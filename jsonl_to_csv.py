# LockAI JSONL→CSV Converter
# Reads `knock_patterns.jsonl` and writes a flattened CSV for Edge Impulse training

import json
import csv

# === CONFIGURATION ===
INPUT_PATH = 'knock_patterns.jsonl'  # JSON Lines input
OUTPUT_PATH = 'knock_patterns.csv'   # Flattened CSV output

# Define CSV header fields
header = [
    'gap1', 't1_0', 't1_1', 't1_2', 'count1',
    'gap2', 't2_0', 't2_1', 't2_2', 'count2',
    'gap3', 't3_0', 't3_1', 't3_2', 'count3',
    'label'
]

def flatten_record(record):
    """
    Convert one JSON record into a flat list matching the CSV header.
    """
    seq = record.get('sequence', [])
    row = []
    # Expect exactly 3 knocks
    for i in range(3):
        knock = seq[i]
        # gap
        row.append(knock.get('gap', 0))
        # touched array
        touched = knock.get('touched', [0,0,0])
        row.extend(int(x) for x in touched)
        # count
        row.append(knock.get('count', 0))
    # label
    row.append(record.get('label', ''))
    return row

# Read JSONL, flatten, and write CSV
with open(INPUT_PATH, 'r') as infile, open(OUTPUT_PATH, 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(header)
    for line in infile:
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
            row = flatten_record(data)
            writer.writerow(row)
        except json.JSONDecodeError:
            print(f"[Warning] Skipping invalid JSON: {line}")

print(f"Converted '{INPUT_PATH}' → '{OUTPUT_PATH}' successfully.")
