# 🔐 LockAI

**An AI and IoT-Driven Knock-and-Touch Access System for Secure Smart Environments**

LockAI is an innovative smart access control system that combines **knock pattern recognition** and **multi-finger touch detection** to create a dual-factor authentication mechanism. It runs a **TinyML model** on an **ESP32** microcontroller, and logs all access attempts to **Firebase**. A companion **Blynk mobile app** enables remote unlocking and live status monitoring.

---

## 🚀 Features

* 🔊 Knock Pattern Recognition using Edge Impulse TinyML
* ✋ Finger Count Detection via capacitive touch sensors (e.g., TTP223)
* 🔓 Servo Motor-Based Unlocking Mechanism
* 🌐 IoT Integration with Firebase for real-time access logging
* 📱 Mobile App (Blynk) for remote unlocking & monitoring
* 📊 Access logs include time, result, and method (knock/app)

---

## 🎯 Use Case

This system can be used for:

* Personal lockers and drawers
* Academic exam material storage
* Smart workspace access
* Low-cost smart surveillance for small labs or offices

---

## 📦 Tech Stack

| Layer           | Tools & Platforms                     |
| --------------- | ------------------------------------- |
| Microcontroller | ESP32 DevKit v1                       |
| ML Inference    | TinyML (Edge Impulse)                 |
| Sensors         | Analog Mic, Capacitive Touch (TTP223) |
| Output          | Servo Motor, Buzzer, LEDs             |
| IoT Backend     | Firebase Realtime Database            |
| Mobile App      | Blynk IoT Platform                    |
| IDE             | Arduino IDE                           |

---

## 🧠 System Architecture

```
[User Input: Knock + Finger Touch]
        ↓
[ESP32] → Mic + Touch Sensor Readings
        ↓
[TinyML Model Classifier] → Knock Valid?
        ↓                              ↓
    [Finger Count Match?]         [Invalid]
        ↓                              ↓
    ✅ [Unlock Servo]              ❌ [Buzz + Log Denied]
        ↓
[Log to Firebase + Show on App]
```

---

## 📱 Blynk App Functionality

* Remote Unlock Button
* Real-Time Lock Status
* Optional Access History Display

---

## 🗂 Directory Structure

```
LockAI/
├── models/
│   └── knock_model.h          # Edge Impulse TinyML model
├── src/
│   └── main.ino               # ESP32 Arduino sketch
├── firebase/
│   └── firebase_config.h      # Firebase credentials & path
├── docs/
│   └── circuit_diagram.png    # Wiring layout
│   └── poster.pdf             # Final project poster
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/<your-username>/LockAI.git
cd LockAI
```

### 2. Open `src/main.ino` in Arduino IDE

* Install required libraries:

  * `Firebase ESP Client`
  * `Servo`
  * `Blynk`
  * `Edge Impulse Inference SDK` (from Edge Impulse export)

### 3. Configure

* Add your WiFi credentials
* Add your Firebase project details in `firebase_config.h`
* Insert your Blynk Auth token in the sketch

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

## 📷 Screenshots (Add later)

* Circuit Diagram
* Blynk UI
* Firebase Log Snapshot
* Final Prototype Image

---

## 🔗 Live Demo / Video (Optional)

\[Insert YouTube link or demo video here once available]

---
