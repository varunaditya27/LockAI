// LockAI - main.ino (ESP32-compatible)
// Author: Varun Aditya & Team
// Description: ESP32-based knock + touch authentication with Firebase and Blynk (using ESP32Servo)

#include <ESP32Servo.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <BlynkSimpleEsp32.h>
#include "knock_model.h"  // Edge Impulse model

// Replace with your credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define BLYNK_AUTH_TOKEN "YOUR_BLYNK_TOKEN"
#define FIREBASE_HOST "your-project-id.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"

// Firebase and Blynk objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Hardware pins
const int micPin = 34;               // Analog pin for mic
const int touchPins[] = {T0, T3, T4}; // Capacitive touch pins
const int buzzerPin = 14;
const int ledPin = 27;
const int servoPin = 13;

Servo lockServo;

// Blynk virtual pin
#define VPIN_UNLOCK V1

// Firebase path
String firebasePath = "/access_log";

// Helper: Count touched pins
int getFingerCount() {
  int count = 0;
  for (int i = 0; i < 3; i++) {
    if (touchRead(touchPins[i]) < 30) count++;
  }
  return count;
}

// Mock: Run ML inference (replace with real logic)
bool isKnockAuthorized() {
  // Normally you'd collect audio and call run_classifier() here
  // For demo purposes we assume the knock is valid
  return true;
}

// Log access to Firebase
void logAccess(bool granted, int fingers, String method) {
  String timestamp = String(millis());
  FirebaseJson json;
  json.set("result", granted ? "Granted" : "Denied");
  json.set("method", method);
  json.set("fingers", fingers);
  Firebase.RTDB.setJSON(&fbdo, firebasePath + "/" + timestamp, &json);
}

// Blynk button handler
BLYNK_WRITE(VPIN_UNLOCK) {
  int value = param.asInt();
  if (value == 1) {
    digitalWrite(ledPin, HIGH);
    lockServo.write(90);
    delay(3000);
    lockServo.write(0);
    digitalWrite(ledPin, LOW);
    logAccess(true, 0, "App");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);
  digitalWrite(ledPin, LOW);

  lockServo.setPeriodHertz(50);  // 50 Hz for typical servo
  lockServo.attach(servoPin);
  lockServo.write(0);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  Blynk.begin(BLYNK_AUTH_TOKEN, WIFI_SSID, WIFI_PASSWORD);

  config.api_key = FIREBASE_AUTH;
  config.database_url = FIREBASE_HOST;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  Blynk.run();

  // Detect knock + fingers
  bool knockDetected = isKnockAuthorized();
  int fingers = getFingerCount();

  if (knockDetected && fingers == 2) {  // Set your own pattern rule
    digitalWrite(ledPin, HIGH);
    lockServo.write(90);
    delay(3000);
    lockServo.write(0);
    digitalWrite(ledPin, LOW);
    logAccess(true, fingers, "Knock");
  } else if (knockDetected) {
    digitalWrite(buzzerPin, HIGH);
    delay(1000);
    digitalWrite(buzzerPin, LOW);
    logAccess(false, fingers, "Knock");
  }

  delay(1000);
}
