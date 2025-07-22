# 🔐 LockAI

**AI + IoT Knock-and-Touch Smart Lock System (with Data Logging & ML Dataset Tools)**

LockAI is a smart access control system that combines **knock pattern recognition** and **multi-finger touch detection** for dual-factor authentication. It uses an **ESP32** microcontroller, logs all access attempts to **Firebase**, and supports remote unlocking via a **Blynk mobile app**. The project now includes a full data collection and ML training pipeline using Python scripts.

---

## 🚀 Features

* 🔊 Knock Pattern Recognition (Edge Impulse TinyML)
* ✋ Multi-finger Touch Detection (TTP223 sensors)
* 🔓 Servo Motor-Based Unlocking
* 🌐 IoT Logging to Firebase
* 📱 Blynk App for remote unlock & status
* 📝 **Serial Data Logger**: Python script saves knock/touch patterns as JSONL
* 🔄 **JSONL→CSV Converter**: Python script for ML dataset creation

---

## 🎯 Use Case

* Personal lockers, drawers, or smart workspace access
* Academic exam material storage
* Low-cost smart surveillance for labs/offices

---

## 📦 Tech Stack

| Layer           | Tools & Platforms                     |
| --------------- | ------------------------------------- |
| Microcontroller | ESP32 DevKit v1                       |
| ML Inference    | TinyML (Edge Impulse)                 |
| Sensors         | Capacitive Touch (TTP223) |
| Output          | Servo Motor, LEDs             |
| IoT Backend     | Firebase Realtime Database            |
| Mobile App      | Blynk IoT Platform                    |
| IDE             | Arduino IDE                           |
| Data Logging    | Python (serial, json, csv)            |

---

## 🎯 Use Case

This system can be used for:

* Personal lockers and drawers
* Academic exam material storage
* Smart workspace access
* Low-cost smart surveillance for small labs or offices

---

## 🧠 System Architecture

```
[User Input: Knock + Finger Touch]
        ↓
[ESP32: knock_logger.ino]
        ↓
[Serial Output: Knock/Touch Pattern as JSON]
        ↓
[Python: serial_data_logger.py → knock_patterns.jsonl]
        ↓
[Python: jsonl_to_csv.py → knock_patterns.csv]
        ↓
[ML Training: Edge Impulse]
        ↓
[ESP32: sample_code.ino (ML, Firebase, Blynk)]
        ↓
[Unlock/Buzz + Log to Firebase + Show on App]
```

---

## 🗂 Directory Structure

```
LockAI/
├── knock_logger.ino           # ESP32: Touch/knock pattern logger (outputs JSON)
├── sample_code.ino            # ESP32: Main smart lock logic (ML, Firebase, Blynk)
├── serial_data_logger.py      # Python: Serial logger (saves JSONL from ESP32)
├── jsonl_to_csv.py            # Python: Converts JSONL to CSV for ML
├── firebaseSDK_credentials.js # Firebase SDK credentials (if using JS)
├── README.md
```

---

## ⚙️ How to Run the Project

### 1. Hardware Setup
- Connect ESP32, TTP223 touch sensors, mic, servo, buzzer, and LEDs as per your circuit.

### 2. Data Logging (Pattern Collection)
- Flash `knock_logger.ino` to ESP32.
- Connect ESP32 to your PC via USB.
- Edit `serial_data_logger.py` and set the correct `SERIAL_PORT` (e.g., `COM9` on Windows).
- Run the logger:
  ```bash
  python serial_data_logger.py
  ```
- Collected knock/touch patterns will be saved to `knock_patterns.jsonl`.

### 3. Data Conversion for ML
- After collecting data, run:
  ```bash
  python jsonl_to_csv.py
  ```
- This creates `knock_patterns.csv` for Edge Impulse or other ML tools.

### 4. Smart Lock Operation
- Flash `sample_code.ino` to ESP32 (update WiFi, Firebase, and Blynk credentials).
- The lock will operate with knock/touch authentication, log to Firebase, and support Blynk app control.

---

## 🔧 Hardware Components

| Component           | Description         | Qty    |
| ------------------- | ------------------- | ------ |
| ESP32 Dev Board     | Main controller     | 1      |
| Analog Microphone   | Knock detection     | 1      |
| TTP223 Touch Sensor | Finger detection    | 3      |
| SG90 Servo Motor    | Locking mechanism   | 1      |
| Buzzer + LED        | Feedback indicators | 1 each |
| Breadboard + Wires  | Connections         | 1      |

---

## 📊 Firebase Data Structure

```json
{
  "access_log": {
    "2025-05-28_13:45:10": {
      "result": "Granted",
      "method": "Knock",
      "finger_count": 2
    }
  }
}
```

---

## 🧪 Demo Plan

1. Knock the correct pattern with correct fingers.
2. Servo unlocks, Firebase logs access.
3. Knock with wrong pattern → red LED + buzzer + denied log.
4. Use mobile app to unlock remotely → logs method as “App”.
5. Use logger to collect new patterns for ML retraining.

---

## 🌱 Future Scope

* Multi-user knock profile support
* Voice-based access layer
* Time-based access restrictions
* Offline fallback mode
* OTA model updates

---

## 🧾 License

This project is released under the MIT License.

---

## 🙌 Acknowledgements

* Edge Impulse for free ML tools
* Firebase for backend services
* Blynk for simplified IoT mobile interface
* Our ISE Department @ RVCE for the IDEA Lab platform

---

## 🤝 Contributors

* Varun Aditya
* Abhijay M. S.
* Shreyas Nayan Kamat
* Vaibhav V. S.

---
