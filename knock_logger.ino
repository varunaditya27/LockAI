// LockAI – Continuous 3-Knock Touch Pattern Logger (Revised)
// Platform: ESP32 (Arduino IDE)
// Sensors: 3x TTP223 capacitive touch modules on digital GPIO pins
// Author: Varun Aditya & Team
// Description: Detects & logs sequences of three human knocks, capturing timing,
//              finger count, and which sensors were touched. Exports JSON for data collection.

// ----- CONFIGURATION -----
const int touchPins[3] = {14, 26, 27};       // GPIO pins for Touch sensors T0, T1, T2
const unsigned long BUFFER_WINDOW_MS = 100;  // Time window to detect multi-finger touch
const unsigned long DEBOUNCE_MS     = 300;   // Guard time after each knock to avoid re-trigger
const unsigned long POLL_DELAY_MS   = 20;    // Idle polling delay to reduce CPU usage

// ----- DATA STRUCTURES -----
struct Knock {
  unsigned long timeGap;   // ms since previous knock (0 for first)
  bool touched[3];         // which sensors were touched
  int  fingerCount;        // number of sensors touched
};

Knock sequence[3];         // Buffer for three-knock pattern
unsigned long lastKnockTime = 0;  // Timestamp of last knock event (millis)

// ----- SETUP -----
void setup() {
  Serial.begin(115200);
  // Initialize sensor pins as inputs
  for (int i = 0; i < 3; i++) {
    pinMode(touchPins[i], INPUT);
  }
  Serial.println();
  Serial.println("[LockAI] Ready – waiting for first knock...");
}

// ----- MAIN LOOP -----
void loop() {
  // Collect exactly three knocks in sequence
  for (int idx = 0; idx < 3; idx++) {
    sequence[idx] = captureKnock(idx);
    // Debounce: ensure fingers are lifted before next knock
    delay(DEBOUNCE_MS);
  }

  // Output the 3-knock pattern as JSON
  printSequenceAsJson();

  // Reset timing for next session
  lastKnockTime = 0;
  Serial.println();
  Serial.println("[LockAI] Awaiting next 3-knock session...");
  delay(POLL_DELAY_MS);  // Brief pause before restart
}

// ----- FUNCTION: Wait & capture one knock -----
Knock captureKnock(int idx) {
  Knock k;
  // 1) Wait for any sensor to be touched (HIGH)
  while (true) {
    for (int i = 0; i < 3; i++) {
      if (digitalRead(touchPins[i]) == HIGH) {
        goto KNOCK_DETECTED;
      }
    }
    delay(POLL_DELAY_MS);
  }

KNOCK_DETECTED:
  // 2) In BUFFER_WINDOW_MS, detect all simultaneous touches
  bool tempState[3] = {false, false, false};
  int count = 0;
  unsigned long windowStart = millis();
  while (millis() - windowStart < BUFFER_WINDOW_MS) {
    for (int i = 0; i < 3; i++) {
      if (digitalRead(touchPins[i]) == HIGH && !tempState[i]) {
        tempState[i] = true;
        count++;
      }
    }
  }

  // 3) Capture precise time gap BEFORE debounce
  unsigned long now = millis();
  if (idx == 0 || lastKnockTime == 0) {
    k.timeGap = 0;  // No gap for first knock
  } else {
    k.timeGap = now - lastKnockTime;
  }
  lastKnockTime = now;  // Update for next gap calculation

  // 4) Store which sensors and how many were touched
  k.fingerCount = count;
  for (int i = 0; i < 3; i++) {
    k.touched[i] = tempState[i];
  }

  // 5) Debug print for each knock
  Serial.print("[Knock ");
  Serial.print(idx + 1);
  Serial.print("] gap=");
  Serial.print(k.timeGap);
  Serial.print("ms count=");
  Serial.println(k.fingerCount);

  return k;
}

// ----- FUNCTION: Print all three knocks as JSON -----
void printSequenceAsJson() {
  Serial.println("{\"sequence\":[");
  for (int i = 0; i < 3; i++) {
    Serial.print("  {\"gap\":");
    Serial.print(sequence[i].timeGap);
    Serial.print(",\"touched\":[");
    for (int j = 0; j < 3; j++) {
      Serial.print(sequence[i].touched[j] ? "1" : "0");
      if (j < 2) Serial.print(",");
    }
    Serial.print("],\"count\":");
    Serial.print(sequence[i].fingerCount);
    Serial.print("}");
    if (i < 2) Serial.println(","); 
    else Serial.println();
  }
  Serial.println("],\"label\":\"auth_knock\"}");
}
