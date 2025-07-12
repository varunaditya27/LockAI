// LockAI – Live Knock Classification with LEDs & Servo (Rule-Based Auth)
// Platform: ESP32 (Arduino IDE)
// Sensors: 3x TTP223 capacitive touch modules on digital GPIO pins
// LEDs: Green (Access Granted) on GPIO 25, Red (Denied) on GPIO 33
// Servo Motor: Connected to GPIO 13 (example pin)
// Author: Varun Aditya & Team

#include <Arduino.h>
#include <ESP32Servo.h> // Include the ESP32 Servo library

// Pin Definitions
const int touchPins[3] = {21, 26, 27}; // Sensor 0, 1, 2
const int greenLEDPin = 25;
const int redLEDPin   = 33;
const int servoPin    = 13; // GPIO pin for the servo motor

// Servo angles
const int SERVO_CLOSED_ANGLE = 90;   // Angle for locked position
const int SERVO_OPEN_ANGLE   = 180;  // Angle for unlocked position

// Timing and Behavior Constants
const unsigned long BUFFER_WINDOW_MS = 200;
const unsigned long DEBOUNCE_MS     = 300;
const unsigned long POLL_DELAY_MS   = 20;

// Servo object
Servo lockServo;

// --- Authorized Pattern 1 Definition (Original) ---
const int AUTH_MASK_1_P1 = 0b011; // Sensors 0 and 1
const int AUTH_COUNT_1_P1 = 2;

const int AUTH_MASK_2_P1 = 0b001; // Sensor 0
const int AUTH_COUNT_2_P1 = 1;
const int AUTH_GAP_MIN_2_P1 = 450;
const int AUTH_GAP_MAX_2_P1 = 750;

const int AUTH_MASK_3_P1 = 0b101; // Sensors 0 and 2
const int AUTH_COUNT_3_P1 = 2;
const int AUTH_GAP_MIN_3_P1 = 450;
const int AUTH_GAP_MAX_3_P1 = 750;

// --- Authorized Pattern 2 Definition (auth_knock_2) ---
// Derived from knock_patterns2.csv [1]
const int AUTH_MASK_1_P2 = 0b001; // Sensor 0
const int AUTH_COUNT_1_P2 = 1;

const int AUTH_MASK_2_P2 = 0b001; // Sensor 0
const int AUTH_COUNT_2_P2 = 1;
const int AUTH_GAP_MIN_2_P2 = 500; // Based on observed data in knock_patterns2.csv [1]
const int AUTH_GAP_MAX_2_P2 = 850; // Based on observed data in knock_patterns2.csv [1]

const int AUTH_MASK_3_P2 = 0b111; // Sensors 0, 1, and 2
const int AUTH_COUNT_3_P2 = 3;
const int AUTH_GAP_MIN_3_P2 = 500; // Based on observed data in knock_patterns2.csv [1]
const int AUTH_GAP_MAX_3_P2 = 760; // Based on observed data in knock_patterns2.csv [1]


// Data structure for a single knock
struct Knock {
  unsigned long timeGap;
  bool touched[3];
  int  fingerCount;
};

// Global state variables
Knock sequence[3];
unsigned long lastKnockTime = 0;

void setup() {
  Serial.begin(115200);

  // Initialize sensor pins
  for (int i = 0; i < 3; i++) {
    pinMode(touchPins[i], INPUT);
  }

  // Initialize LED pins
  pinMode(greenLEDPin, OUTPUT);
  pinMode(redLEDPin, OUTPUT);

  // Attach servo to pin and set initial position (closed)
  lockServo.attach(servoPin);
  lockServo.write(SERVO_CLOSED_ANGLE);
  delay(500); // Give servo time to move to initial position

  // Ensure LEDs are off at start
  digitalWrite(greenLEDPin, LOW);
  digitalWrite(redLEDPin, LOW);

  Serial.println("\n[LockAI] Ready – waiting for first knock...");
}

void loop() {
  // Capture a 3-knock sequence
  for (int idx = 0; idx < 3; idx++) {
    sequence[idx] = captureKnock(idx);
    delay(DEBOUNCE_MS); // Debounce between knocks
  }

  // Classify the captured sequence
  classifyPattern(sequence);

  // Reset for the next attempt
  lastKnockTime = 0;
  Serial.println("\n[LockAI] Awaiting next 3-knock session...");
  delay(POLL_DELAY_MS);
}

// Helper function to print the boolean array of touched sensors
void printTouchedArray(bool touched[3]) {
  Serial.print("[");
  for (int i = 0; i < 3; i++) {
    Serial.print(touched[i] ? "true" : "false");
    if (i < 2) {
      Serial.print(", ");
    }
  }
  Serial.print("]");
}

Knock captureKnock(int idx) {
  Knock k;
  // Initialize touched array
  for (int i = 0; i < 3; i++) {
    k.touched[i] = false;
  }

  // Wait for the first touch of a knock
  while (true) {
    for (int i = 0; i < 3; i++) {
      if (digitalRead(touchPins[i]) == HIGH) {
        goto KNOCK_DETECTED;
      }
    }
    delay(POLL_DELAY_MS);
  }

KNOCK_DETECTED:
  bool tempState[3] = {false, false, false};
  int count = 0;
  unsigned long windowStart = millis();

  // Capture all unique touches within the buffer window
  while (millis() - windowStart < BUFFER_WINDOW_MS) {
    for (int i = 0; i < 3; i++) {
      if (digitalRead(touchPins[i]) == HIGH && !tempState[i]) {
        tempState[i] = true;
      }
    }
    delay(POLL_DELAY_MS / 2);
  }
  
  // Finalize the count from the tempState
  for(int i = 0; i < 3; i++) {
      if (tempState[i]) {
        count++;
      }
  }

  unsigned long now = millis();
  k.timeGap = (idx == 0) ? 0 : now - lastKnockTime;
  lastKnockTime = now;
  k.fingerCount = count;
  for (int i = 0; i < 3; i++) {
    k.touched[i] = tempState[i];
  }

  // Print knock details with the new boolean array format
  Serial.print("[Knock "); Serial.print(idx + 1);
  Serial.print("] gap="); Serial.print(k.timeGap);
  Serial.print("ms count="); Serial.print(k.fingerCount);
  Serial.print(" touched="); printTouchedArray(k.touched);
  Serial.println();

  // Wait for all sensors to be released before proceeding
  while (digitalRead(touchPins[0]) == HIGH || digitalRead(touchPins[1]) == HIGH || digitalRead(touchPins[2]) == HIGH) {
    delay(POLL_DELAY_MS);
  }
  return k;
}

// Generates a bitmask from the boolean `touched` array
int touchedToMask(bool touched[3]) {
  int mask = 0;
  if (touched[0]) mask |= (1 << 0);
  if (touched[1]) mask |= (1 << 1);
  if (touched[2]) mask |= (1 << 2);
  return mask;
}

void classifyPattern(Knock sequence[3]) {
  // Convert captured knock data to masks for comparison
  int mask1 = touchedToMask(sequence[0].touched);
  int count1 = sequence[0].fingerCount;

  unsigned long gap2 = sequence[1].timeGap;
  int mask2 = touchedToMask(sequence[1].touched);
  int count2 = sequence[1].fingerCount;
  
  unsigned long gap3 = sequence[2].timeGap;
  int mask3 = touchedToMask(sequence[2].touched);
  int count3 = sequence[2].fingerCount;

  // Check against Authorized Pattern 1
  bool knock1_ok_P1 = (mask1 == AUTH_MASK_1_P1 && count1 == AUTH_COUNT_1_P1);
  bool knock2_ok_P1 = (mask2 == AUTH_MASK_2_P1 && count2 == AUTH_COUNT_2_P1 && gap2 >= AUTH_GAP_MIN_2_P1 && gap2 <= AUTH_GAP_MAX_2_P1);
  bool knock3_ok_P1 = (mask3 == AUTH_MASK_3_P1 && count3 == AUTH_COUNT_3_P1 && gap3 >= AUTH_GAP_MIN_3_P1 && gap3 <= AUTH_GAP_MAX_3_P1);

  bool authorized_P1 = (knock1_ok_P1 && knock2_ok_P1 && knock3_ok_P1);

  // Check against Authorized Pattern 2 (auth_knock_2)
  bool knock1_ok_P2 = (sequence[0].timeGap == 0 && mask1 == AUTH_MASK_1_P2 && count1 == AUTH_COUNT_1_P2); // gap1 for auth_knock_2 is consistently 0 [1]
  bool knock2_ok_P2 = (mask2 == AUTH_MASK_2_P2 && count2 == AUTH_COUNT_2_P2 && gap2 >= AUTH_GAP_MIN_2_P2 && gap2 <= AUTH_GAP_MAX_2_P2);
  bool knock3_ok_P2 = (mask3 == AUTH_MASK_3_P2 && count3 == AUTH_COUNT_3_P2 && gap3 >= AUTH_GAP_MIN_3_P2 && gap3 <= AUTH_GAP_MAX_3_P2);

  bool authorized_P2 = (knock1_ok_P2 && knock2_ok_P2 && knock3_ok_P2);

  if (authorized_P1 || authorized_P2) {
    Serial.println("✅ Access Granted!");
    digitalWrite(greenLEDPin, HIGH);
    lockServo.write(SERVO_OPEN_ANGLE); // Unlock
    delay(2000);
    digitalWrite(greenLEDPin, LOW);
    lockServo.write(SERVO_CLOSED_ANGLE); // Re-lock after a delay
  } else {
    Serial.println("❌ Access Denied!");
    digitalWrite(redLEDPin, HIGH);
    // Servo remains in SERVO_CLOSED_ANGLE position (locked)
    delay(2000);
    digitalWrite(redLEDPin, LOW);
  }
}