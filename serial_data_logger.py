# LockAI Serial Data Logger
# Reads JSON knock-pattern data from ESP32 Serial and writes to a file

import serial
import time
import json

# === CONFIGURATION ===
SERIAL_PORT = 'COM9'       # Update to your serial port (e.g., '/dev/ttyUSB0')
BAUD_RATE = 115200
OUTPUT_PATH = 'knock_patterns.jsonl'  # One JSON object per line

# === INITIALIZATION ===
print(f"[Logger] Opening serial port {SERIAL_PORT} at {BAUD_RATE} baud...")
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    # Give ESP32 time to reset
    time.sleep(2)
except Exception as e:
    print(f"[ERROR] Could not open serial port: {e}")
    exit(1)

print(f"[Logger] Listening for JSON patterns, saving to {OUTPUT_PATH}. Press Ctrl+C to stop.")

# Buffer for incoming lines
buffer = ''

with open(OUTPUT_PATH, 'a') as outfile:
    try:
        while True:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                continue

            # Look for start of JSON
            if line.startswith('{'):
                buffer = line
            elif buffer:
                # Append and check for end of JSON
                buffer += line
                if line.endswith('}'):
                    try:
                        data = json.loads(buffer)
                        # Write as compact JSON line
                        outfile.write(json.dumps(data) + '\n')
                        outfile.flush()
                        print(f"[Saved] {data}")
                    except json.JSONDecodeError:
                        print(f"[Warning] Failed to parse JSON: {buffer}")
                    buffer = ''
    except KeyboardInterrupt:
        print("\n[Logger] Stopped by user. Exiting...")
        ser.close()
