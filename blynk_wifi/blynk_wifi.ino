// Blynk configuration - must be at the top
#define BLYNK_TEMPLATE_ID "TMPL3-pD3m8cL"
#define BLYNK_TEMPLATE_NAME "LockAI Controller"
#define BLYNK_DEVICE_NAME "LockAI Node"

// Print Blynk debug information
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <ESP32Servo.h>

// Credentials
char auth[] = "vtd8JpWgEHlCEZ8kZod_MGJE3HN1wjIr";
char ssid[] = "OnePlusNord";
char pass[] = "varunaditya27";

// Hardware pins
#define SERVO_PIN 18        // GPIO pin for servo motor
#define LED_PIN 2           // Built-in LED for status indication
#define BUTTON_PIN 0        // Built-in button for manual override

// Servo positions (adjust these based on your mechanical setup)
#define DOOR_LOCKED_ANGLE 0     // Servo angle when door is locked
#define DOOR_UNLOCKED_ANGLE 90  // Servo angle when door is unlocked

// Door control variables
Servo doorServo;
bool isDoorLocked = true;  // Initial state: door locked
bool lastButtonState = HIGH;
unsigned long lastButtonPress = 0;
const unsigned long DEBOUNCE_DELAY = 50;

// Security features
unsigned long lockTimer = 0;
const unsigned long AUTO_LOCK_DELAY = 10000;  // Auto-lock after 10 seconds
bool autoLockEnabled = true;

// Timer for periodic tasks
BlynkTimer timer;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32 Smart Door Lock System ===");
  Serial.println("Initializing door lock controller...");
  
  // Initialize hardware
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  // Initialize servo
  doorServo.attach(SERVO_PIN);
  
  // Set initial door state (locked)
  lockDoor();
  
  // Connect to Blynk
  Serial.println("Connecting to WiFi and Blynk...");
  Blynk.begin(auth, ssid, pass);
  
  // Wait for connection
  while (!Blynk.connected()) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println("\n✓ Door lock system online!");
  
  // Setup timers
  timer.setInterval(1000L, checkAutoLock);     // Check auto-lock every second
  timer.setInterval(500L, checkManualButton);  // Check manual button
  timer.setInterval(5000L, sendStatus);        // Send status every 5 seconds
  
  // Sync with Blynk app
  Blynk.syncAll();
  
  printSystemInfo();
}

void loop() {
  Blynk.run();
  timer.run();
  delay(10);
}

// Blynk Virtual Pin V0 - Door Control Switch
BLYNK_WRITE(V0) {
  int switchValue = param.asInt();
  
  Serial.print("Door control command from app: ");
  Serial.println(switchValue == 1 ? "UNLOCK" : "LOCK");
  
  if (switchValue == 1) {
    unlockDoor();
  } else {
    lockDoor();
  }
}

// Send door status to Blynk when requested
BLYNK_READ(V0) {
  Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
}

// Blynk connection established
BLYNK_CONNECTED() {
  Serial.println("✓ Blynk connected - Door lock ready for remote control");
  Blynk.syncAll();
  
  // Send current door status
  Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
}

// Door control functions
void unlockDoor() {
  if (isDoorLocked) {
    Serial.println("🔓 UNLOCKING DOOR...");
    
    // Move servo to unlock position
    doorServo.write(DOOR_UNLOCKED_ANGLE);
    
    // Update state
    isDoorLocked = false;
    
    // Visual feedback
    digitalWrite(LED_PIN, HIGH);  // LED ON when unlocked
    
    // Start auto-lock timer
    lockTimer = millis();
    
    // Send status to Blynk
    Blynk.virtualWrite(V0, 1);  // Switch to ON position
    
    Serial.println("✓ Door unlocked successfully");
    Serial.println("⏰ Auto-lock timer started (10 seconds)");
  } else {
    Serial.println("ℹ️  Door is already unlocked");
  }
}

void lockDoor() {
  if (!isDoorLocked) {
    Serial.println("🔒 LOCKING DOOR...");
    
    // Move servo to lock position
    doorServo.write(DOOR_LOCKED_ANGLE);
    
    // Update state
    isDoorLocked = true;
    
    // Visual feedback
    digitalWrite(LED_PIN, LOW);   // LED OFF when locked
    
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
      lockDoor();
    }
  }
}

void checkManualButton() {
  bool currentButtonState = digitalRead(BUTTON_PIN);
  
  // Debounce button
  if (currentButtonState != lastButtonState) {
    if (millis() - lastButtonPress > DEBOUNCE_DELAY) {
      if (currentButtonState == LOW) {  // Button pressed
        Serial.println("🔘 Manual button pressed");
        
        // Toggle door state
        if (isDoorLocked) {
          unlockDoor();
        } else {
          lockDoor();
        }
        
        lastButtonPress = millis();
      }
    }
  }
  
  lastButtonState = currentButtonState;
}

void sendStatus() {
  if (Blynk.connected()) {
    // Send current door status
    Blynk.virtualWrite(V0, isDoorLocked ? 0 : 1);
    
    Serial.print("📡 Status sent - Door: ");
    Serial.print(isDoorLocked ? "LOCKED" : "UNLOCKED");
    
    if (!isDoorLocked && autoLockEnabled) {
      unsigned long timeRemaining = AUTO_LOCK_DELAY - (millis() - lockTimer);
      Serial.print(" (Auto-lock in ");
      Serial.print(timeRemaining / 1000);
      Serial.print("s)");
    }
    Serial.println();
  }
}

// System information
void printSystemInfo() {
  Serial.println("\n--- Door Lock System Information ---");
  Serial.print("Servo Pin: GPIO ");
  Serial.println(SERVO_PIN);
  Serial.print("Lock Angle: ");
  Serial.print(DOOR_LOCKED_ANGLE);
  Serial.println("°");
  Serial.print("Unlock Angle: ");
  Serial.print(DOOR_UNLOCKED_ANGLE);
  Serial.println("°");
  Serial.print("Auto-lock Delay: ");
  Serial.print(AUTO_LOCK_DELAY / 1000);
  Serial.println(" seconds");
  Serial.print("Initial State: ");
  Serial.println(isDoorLocked ? "LOCKED" : "UNLOCKED");
  
  Serial.println("\n--- Blynk Configuration ---");
  Serial.println("Virtual Pin V0: Door Control Switch");
  Serial.println("Switch ON (1) = UNLOCK");
  Serial.println("Switch OFF (0) = LOCK");
  
  Serial.println("\n--- Control Methods ---");
  Serial.println("1. Blynk app switch");
  Serial.println("2. Physical button (BOOT button)");
  Serial.println("3. Auto-lock timer");
  
  Serial.println("\n🚪 Door lock system ready!");
}

// Emergency functions
void emergencyUnlock() {
  Serial.println("🚨 EMERGENCY UNLOCK ACTIVATED");
  autoLockEnabled = false;
  unlockDoor();
}

void resetSystem() {
  Serial.println("🔄 Resetting door lock system...");
  lockDoor();
  autoLockEnabled = true;
  Serial.println("✓ System reset complete");
}

// Servo calibration function (call this if servo angles need adjustment)
void calibrateServo() {
  Serial.println("🔧 Servo calibration mode");
  Serial.println("Moving servo through full range...");
  
  for (int angle = 0; angle <= 180; angle += 10) {
    doorServo.write(angle);
    Serial.print("Angle: ");
    Serial.println(angle);
    delay(500);
  }
  
  // Return to locked position
  doorServo.write(DOOR_LOCKED_ANGLE);
  Serial.println("Calibration complete - returned to locked position");
}