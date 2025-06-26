# LockAI Serial Data Logger (Fixed for multi-line JSON capture)
# Reads complete JSON objects from ESP32 Serial and writes them to a file

import serial
import time
import json

# === CONFIGURATION ===
SERIAL_PORT = 'COM9'       # Update to your serial port (e.g., '/dev/ttyUSB0')
BAUD_RATE = 115200
OUTPUT_PATH = 'knock_patterns2.jsonl'  # One JSON object per line

# === INITIALIZATION ===
print(f"[Logger] Opening serial port {SERIAL_PORT} at {BAUD_RATE} baud...")
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)  # Allow ESP32 to reset
except Exception as e:
    print(f"[ERROR] Could not open serial port: {e}")
    exit(1)

print(f"[Logger] Listening for JSON patterns. Saving only full JSON objects to {OUTPUT_PATH}. Press Ctrl+C to stop.")

buffer = ''
receiving = False

with open(OUTPUT_PATH, 'a') as outfile:
    try:
        while True:
            raw = ser.readline().decode('utf-8', errors='ignore').strip()
            if not raw:
                continue

            # Detect start of JSON object
            if raw.startswith('{"sequence":['):
                buffer = raw
                receiving = True
                continue

            # If currently buffering, append
            if receiving:
                buffer += raw
                # Detect end of JSON object (closing brace)
                if raw.endswith('"}'):
                    # Try parsing complete JSON block
                    try:
                        data = json.loads(buffer)
                        outfile.write(json.dumps(data) + '\n')
                        outfile.flush()
                        print(f"[Saved] {data}")
                    except json.JSONDecodeError:
                        print(f"[Warning] Invalid JSON skipped: {buffer}")
                    # Reset buffer state
                    buffer = ''
                    receiving = False
    except KeyboardInterrupt:
        print("\n[Logger] Stopped by user. Exiting...")
        ser.close()
