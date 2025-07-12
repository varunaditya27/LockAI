// LockAI – Live Knock Classification with WiFi & Blynk Remote Control
// Platform: ESP32 (Arduino IDE)
// Sensors: 3x TTP223 capacitive touch modules on digital GPIO pins
// LEDs: Green (Access Granted) on GPIO 25, Red (Denied) on GPIO 33
// Servo Motor: Connected to GPIO 13
// Remote Control: Blynk app integration with WiFi
// Author: Varun Aditya & Team

// Blynk configuration - must be at the top
#define BLYNK_TEMPLATE_ID "TMPL3-pD3m8cL"
#define BLYNK_TEMPLATE_NAME "LockAI Controller"
#define BLYNK_DEVICE_NAME "LockAI Node"

// Print Blynk debug information
#define BLYNK_PRINT Serial

#include <Arduino.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <ESP32Servo.h>

// WiFi and Blynk Credentials
char auth[] = "vtd8JpWgEHlCEZ8kZod_MGJE3HN1wjIr";
char ssid[] = "OnePlusNord";
char pass[] = "varunaditya27";

// Pin Definitions
const int touchPins[3] = {21, 26, 27}; // Sensor 0, 1, 2
const int greenLEDPin = 25;
const int redLEDPin   = 33;
const int servoPin    = 13; // GPIO pin for the servo motor
const int statusLEDPin = 2; // Built-in LED for connection status

// Servo angles
const int SERVO_CLOSED_ANGLE = 90;   // Angle for locked position
const int SERVO_OPEN_ANGLE   = 180;  // Angle for unlocked position

String lastStatusMessage = "";
unsigned long lastStatusTime = 0;

// Timing and Behavior Constants
const unsigned long BUFFER_WINDOW_MS = 200;
const unsigned long DEBOUNCE_MS     = 300;
const unsigned long POLL_DELAY_MS   = 20;

// Security features
unsigned long lockTimer = 0;
const unsigned long AUTO_LOCK_DELAY = 5000;  // Auto-lock after 10 seconds
bool autoLockEnabled = true;
bool isDoorLocked = true;  // Initial state: door locked

// Servo object
Servo lockServo;

// Blynk timer for periodic tasks
BlynkTimer timer;

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
const int AUTH_MASK_1_P2 = 0b001; // Sensor 0
const int AUTH_COUNT_1_P2 = 1;

const int AUTH_MASK_2_P2 = 0b001; // Sensor 0
const int AUTH_COUNT_2_P2 = 1;
const int AUTH_GAP_MIN_2_P2 = 500;
const int AUTH_GAP_MAX_2_P2 = 850;

const int AUTH_MASK_3_P2 = 0b111; // Sensors 0, 1, and 2
const int AUTH_COUNT_3_P2 = 3;
const int AUTH_GAP_MIN_3_P2 = 500;
const int AUTH_GAP_MAX_3_P2 = 760;

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
  delay(1000);
  
  Serial.println("\n=== LockAI Smart Door Lock System ===");
  Serial.println("Initializing knock detection with WiFi control...");

  // Initialize sensor pins
  for (int i = 0; i < 3; i++) {
    pinMode(touchPins[i], INPUT);
  }

  // Initialize LED pins
  pinMode(greenLEDPin, OUTPUT);
  pinMode(redLEDPin, OUTPUT);
  pinMode(statusLEDPin, OUTPUT);

  // Attach servo to pin and set initial position (closed)
  lockServo.attach(servoPin);
  lockServo.write(SERVO_CLOSED_ANGLE);
  delay(500); // Give servo time to move to initial position

  // Ensure LEDs are off at start
  digitalWrite(greenLEDPin, LOW);
  digitalWrite(redLEDPin, LOW);
  digitalWrite(statusLEDPin, LOW);

  // Connect to Blynk
  Serial.println("Connecting to WiFi and Blynk...");
  Blynk.begin(auth, ssid, pass);
  
  // Wait for connection
  while (!Blynk.connected()) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println("\n✓ LockAI system online!");
  digitalWrite(statusLEDPin, isDoorLocked ? LOW : HIGH);
  
  // Setup timers
  timer.setInterval(1000L, checkAutoLock);     // Check auto-lock every second
  timer.setInterval(5000L, sendStatus);        // Send status every 5 seconds
  
  // Sync with Blynk app
  Blynk.syncAll();
  
  printSystemInfo();
  Serial.println("\n[LockAI] Ready – waiting for knock patterns or app commands...");
}

void loop() {
  // Run Blynk and timers
  Blynk.run();
  timer.run();
  
  // Only process knock detection if door is locked
  // This prevents interference when door is already unlocked
  if (isDoorLocked) {
    processKnockSequence();
  }
  
  delay(POLL_DELAY_MS);
}

// Process a complete 3-knock sequence
void processKnockSequence() {
  // Check if any sensor is touched to start knock detection
  bool anyTouched = false;
  for (int i = 0; i < 3; i++) {
    if (digitalRead(touchPins[i]) == HIGH) {
      anyTouched = true;
      break;
    }
  }
  
  if (!anyTouched) {
    return; // No touch detected, continue monitoring
  }
  
  Serial.println("\n[LockAI] Knock sequence detected - capturing...");
  
  // Capture a 3-knock sequence
  for (int idx = 0; idx < 3; idx++) {
    sequence[idx] = captureKnock(idx);
    delay(DEBOUNCE_MS); // Debounce between knocks
  }

  // Classify the captured sequence
  classifyPattern(sequence);

  // Reset for the next attempt
  lastKnockTime = 0;
  Serial.println("\n[LockAI] Sequence processed - monitoring for next pattern...");
}

// Blynk Virtual Pin V0 - Door Control Switch
BLYNK_WRITE(V0) {
  int switchValue = param.asInt();
  
  Serial.print("Door control command from app: ");
  Serial.println(switchValue == 1 ? "UNLOCK" : "LOCK");
  
  if (switchValue == 1) {
    unlockDoor("Blynk App");
  } else {
    lockDoor("Blynk App");
  }
}

// Send door status to Blynk when requested
BLYNK_READ(V0) {
  Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
}

// Enhanced V1 handler with validation and feedback
BLYNK_WRITE(V1) {
  int newAutoLockState = param.asInt();
  
  // Validate input
  if (newAutoLockState != 0 && newAutoLockState != 1) {
    Serial.println("❌ Invalid auto-lock value received");
    return;
  }
  
  // Check if state actually changed
  if (autoLockEnabled == (newAutoLockState == 1)) {
    Serial.println("ℹ️  Auto-lock state unchanged");
    return;
  }
  
  // Update state
  autoLockEnabled = (newAutoLockState == 1);
  
  // Provide detailed feedback
  Serial.print("🔄 Auto-lock ");
  Serial.print(autoLockEnabled ? "ENABLED" : "DISABLED");
  Serial.println(" via Blynk app");
  
  // If auto-lock is disabled while door is unlocked, cancel timer
  if (!autoLockEnabled && !isDoorLocked) {
    lockTimer = 0;
    Serial.println("⏰ Auto-lock timer cancelled");
  }
  
  // If auto-lock is enabled while door is unlocked, restart timer
  if (autoLockEnabled && !isDoorLocked) {
    lockTimer = millis();
    Serial.println("⏰ Auto-lock timer restarted");
  }
  
  // Send confirmation back to app
  Blynk.virtualWrite(V1, autoLockEnabled ? 1 : 0);
  
  // Log event for tracking
  String eventMsg = autoLockEnabled ? "Auto-lock enabled" : "Auto-lock disabled";
  Blynk.logEvent("autolock_change", eventMsg);
}

// New V2 handler for status requests
BLYNK_READ(V2) {
  String statusText = generateStatusText();
  Blynk.virtualWrite(V2, statusText);
  Serial.print("📱 Status requested via V2: ");
  Serial.println(statusText);
}

// Helper function to generate comprehensive status text
String generateStatusText() {
  String status = "";
  
  // Door state
  status += isDoorLocked ? "🔒 LOCKED" : "🔓 UNLOCKED";
  
  // Auto-lock information
  if (!isDoorLocked && autoLockEnabled && lockTimer > 0) {
    unsigned long timeRemaining = AUTO_LOCK_DELAY - (millis() - lockTimer);
    if (timeRemaining > 0) {
      status += " (Auto-lock: " + String(timeRemaining / 1000) + "s)";
    }
  } else if (!autoLockEnabled && !isDoorLocked) {
    status += " (Auto-lock: OFF)";
  }
  
  // Connection status
  status += Blynk.connected() ? " • WiFi: OK" : " • WiFi: ERROR";
  
  return status;
}

// Blynk connection established
BLYNK_CONNECTED() {
  Serial.println("✓ Blynk connected - LockAI ready for remote control");
  Blynk.syncAll();
  
  // Send current door status
  Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
  Blynk.virtualWrite(V1, autoLockEnabled ? 1 : 0);
}

// Door control functions
void unlockDoor(String method) {
  if (isDoorLocked) {
    Serial.println("🔓 UNLOCKING DOOR...");
    Serial.print("Method: ");
    Serial.println(method);
    
    // Move servo to unlock position
    lockServo.write(SERVO_OPEN_ANGLE);
    
    // Update state
    isDoorLocked = false;
    
    // Visual feedback
    digitalWrite(greenLEDPin, HIGH);
    digitalWrite(statusLEDPin, HIGH);  // Status LED ON when unlocked
    delay(1500);
    digitalWrite(greenLEDPin, LOW);
    
    // Start auto-lock timer
    if (autoLockEnabled) {
      lockTimer = millis();
      Serial.println("⏰ Auto-lock timer started (10 seconds)");
    }
    
    // Send status to Blynk
    Blynk.virtualWrite(V0, 1);  // Switch to ON position
    
    Serial.println("✓ Door unlocked successfully");
  } else {
    Serial.println("ℹ️  Door is already unlocked");
  }
}

void lockDoor(String method) {
  if (!isDoorLocked) {
    Serial.println("🔒 LOCKING DOOR...");
    Serial.print("Method: ");
    Serial.println(method);
    
    // Move servo to lock position
    lockServo.write(SERVO_CLOSED_ANGLE);
    
    // Update state
    isDoorLocked = true;
    
    // Visual feedback
    digitalWrite(redLEDPin, HIGH);
    digitalWrite(statusLEDPin, LOW);   // Status LED OFF when locked
    delay(1500);
    digitalWrite(redLEDPin, LOW);
    
    // Reset auto-lock timer
    lockTimer = 0;
    
    // Send status to Blynk
    Blynk.virtualWrite(V0, 0);  // Switch to OFF position
    
    Serial.println("✓ Door locked successfully");
  } else {
    Serial.println("ℹ️  Door is already locked");
  }
}

// Timer functions
void checkAutoLock() {
  if (!isDoorLocked && autoLockEnabled && lockTimer > 0) {
    if (millis() - lockTimer >= AUTO_LOCK_DELAY) {
      Serial.println("⏰ Auto-lock timer expired - locking door");
      lockDoor("Auto-lock Timer");
    }
  }
}

void sendStatus() {
  if (Blynk.connected()) {
    // Send current door status to V0
    Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
    
    // Send detailed status to V2
    String currentStatus = generateStatusText();
    if (currentStatus != lastStatusMessage) {
      Blynk.virtualWrite(V2, currentStatus);
      lastStatusMessage = currentStatus;
      lastStatusTime = millis();
    }
    
    Serial.print("📡 Status sent - ");
    Serial.println(currentStatus);
  }
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
  bool knock1_ok_P2 = (sequence[0].timeGap == 0 && mask1 == AUTH_MASK_1_P2 && count1 == AUTH_COUNT_1_P2);
  bool knock2_ok_P2 = (mask2 == AUTH_MASK_2_P2 && count2 == AUTH_COUNT_2_P2 && gap2 >= AUTH_GAP_MIN_2_P2 && gap2 <= AUTH_GAP_MAX_2_P2);
  bool knock3_ok_P2 = (mask3 == AUTH_MASK_3_P2 && count3 == AUTH_COUNT_3_P2 && gap3 >= AUTH_GAP_MIN_3_P2 && gap3 <= AUTH_GAP_MAX_3_P2);

  bool authorized_P2 = (knock1_ok_P2 && knock2_ok_P2 && knock3_ok_P2);

  if (authorized_P1 || authorized_P2) {
    Serial.println("✅ Knock Pattern Recognized - Access Granted!");
    String patternUsed = authorized_P1 ? "Pattern 1" : "Pattern 2";
    Serial.print("Authorized Pattern: ");
    Serial.println(patternUsed);
    
    unlockDoor("Knock Pattern (" + patternUsed + ")");
  } else {
    Serial.println("❌ Invalid Knock Pattern - Access Denied!");
    digitalWrite(redLEDPin, HIGH);
    delay(1000);
    digitalWrite(redLEDPin, LOW);
    
    // Send notification to Blynk app about failed attempt
    Blynk.logEvent("unauthorized_access", "Invalid knock pattern detected");
  }
}

// System information
void printSystemInfo() {
  Serial.println("\n--- LockAI System Information ---");
  Serial.print("Touch Sensors: GPIO ");
  for (int i = 0; i < 3; i++) {
    Serial.print(touchPins[i]);
    if (i < 2) Serial.print(", ");
  }
  Serial.println();
  Serial.print("Servo Pin: GPIO ");
  Serial.println(servoPin);
  Serial.print("Lock Angle: ");
  Serial.print(SERVO_CLOSED_ANGLE);
  Serial.println("°");
  Serial.print("Unlock Angle: ");
  Serial.print(SERVO_OPEN_ANGLE);
  Serial.println("°");
  Serial.print("Auto-lock Delay: ");
  Serial.print(AUTO_LOCK_DELAY / 1000);
  Serial.println(" seconds");
  Serial.print("Initial State: ");
  Serial.println(isDoorLocked ? "LOCKED" : "UNLOCKED");
  
  Serial.println("\n--- Blynk Configuration ---");
  Serial.println("Virtual Pin V0: Door Control Switch");
  Serial.println("Virtual Pin V1: Auto-lock Enable/Disable");
  Serial.println("Switch ON (1) = UNLOCK");
  Serial.println("Switch OFF (0) = LOCK");
  
  Serial.println("\n--- Access Methods ---");
  Serial.println("1. Knock Pattern Recognition (2 patterns)");
  Serial.println("2. Blynk mobile app");
  Serial.println("3. Auto-lock timer");
  
  Serial.println("\n--- LED Indicators ---");
  Serial.print("Green LED (GPIO ");
  Serial.print(greenLEDPin);
  Serial.println("): Access granted");
  Serial.print("Red LED (GPIO ");
  Serial.print(redLEDPin);
  Serial.println("): Access denied");
  Serial.print("Status LED (GPIO ");
  Serial.print(statusLEDPin);
  Serial.println("): Connection & lock status");
  
  Serial.println("\n🚪 LockAI system ready!");
}

// Emergency functions
void emergencyUnlock() {
  Serial.println("🚨 EMERGENCY UNLOCK ACTIVATED");
  autoLockEnabled = false;
  unlockDoor("Emergency Override");
  Blynk.logEvent("emergency_unlock", "Emergency unlock activated");
}

void resetSystem() {
  Serial.println("🔄 Resetting LockAI system...");
  lockDoor("System Reset");
  autoLockEnabled = true;
  lockTimer = 0;
  lastKnockTime = 0;
  Serial.println("✓ System reset complete");
}