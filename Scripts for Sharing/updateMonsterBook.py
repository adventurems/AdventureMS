import csv
import os
from collections import defaultdict

"""
updateMonsterBook.py - Monster Book XML Generator

Purpose:
    This script generates a MonsterBook XML file based on monster data and drop data from CSV files.
    It maps monsters to their locations (maps) and drops, creating a structured XML file that can
    be used by the game to populate the Monster Book feature.

How it works:
    1. Reads monster data from 'MonsterBook.csv', which contains monster IDs and their map locations
    2. Reads drop data from a CSV file containing item drops for each monster
    3. Combines this information to generate a properly formatted MonsterBook XML file
    4. Allows for configuring a list of item IDs to skip (not include in the XML)
    5. Automatically skips items with IDs starting with "238"

Input:
    - MonsterBook.csv: CSV file with monster IDs and map IDs
      Format: monster_id, map_id1, map_id2, map_id3, map_id4, map_id5
    - Drop data CSV file: CSV file with monster drop information
      Required columns: 'dropperid' (monster ID), 'itemid' (item ID)

Output:
    - MonsterBook.img.xml: XML file with monster book data structured for the game
    - Console output with statistics on monsters processed and items skipped

Usage:
    1. Place the required CSV files in the same directory as this script:
       - MonsterBook.csv
       - A drop data CSV file (default name: '_ SQL drop_data.csv')
    2. Modify the ITEMS_TO_SKIP list if needed to exclude specific items
    3. Run the script: python updateMonsterBook.py
    4. The script will generate MonsterBook.img.xml in the same directory
"""

# Configurable section: List of item IDs to skip (not add to the generated XML file)
# Add item IDs as strings in this list
ITEMS_TO_SKIP = [
    "4310000", "4020008", "4020100"
]

def read_monster_data(csv_file):
    """
    Read monster data from CSV file.
    Returns a dictionary with monster IDs as keys and a list of map IDs as values.
    """
    monster_data = {}

    with open(csv_file, 'r', newline='') as file:
        # Read the first line to get the column names
        first_line = file.readline().strip()
        column_names = first_line.split(',')

        # Reset file pointer to the beginning
        file.seek(0)

        reader = csv.reader(file)
        next(reader)  # Skip header row

        for row in reader:
            if not row:  # Skip empty rows
                continue

            monster_id = row[0]  # First column is monsterid
            maps = []

            # Collect all map IDs for this monster (columns 1-5)
            for i in range(1, min(6, len(row))):
                if row[i]:
                    maps.append(row[i])

            monster_data[monster_id] = maps

    return monster_data

def read_drop_data(csv_file):
    """
    Read drop data from CSV file.
    Returns a dictionary with monster IDs as keys and a set of item IDs as values.
    """
    drop_data = defaultdict(set)

    with open(csv_file, 'r', newline='') as file:
        # Read the first line to get the column names
        first_line = file.readline().strip()
        column_names = first_line.split(',')

        # Find the indices of the dropperid and itemid columns
        dropper_id_index = column_names.index('dropperid')
        item_id_index = column_names.index('itemid')

        # Reset file pointer to the beginning
        file.seek(0)

        reader = csv.reader(file)
        next(reader)  # Skip header row

        for row in reader:
            if not row or len(row) <= max(dropper_id_index, item_id_index):  # Skip invalid rows
                continue

            dropper_id = row[dropper_id_index]
            item_id = row[item_id_index]

            # Skip entries with itemid=0 (meso drops)
            if item_id != '0':
                drop_data[dropper_id].add(item_id)

    return drop_data

def generate_monster_book_xml(monster_data, drop_data, output_file):
    """
    Generate MonsterBook XML file based on monster data and drop data.
    Items in the ITEMS_TO_SKIP list will be excluded from the XML.
    Items with IDs starting with "238" will also be automatically skipped.
    """
    # Track statistics for reporting
    total_items_skipped = 0
    with open(output_file, 'w') as file:
        # Write XML header
        file.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
        file.write('<imgdir name="MonsterBook.img">\n')

        # Process each monster
        for monster_id, maps in monster_data.items():
            file.write(f'    <imgdir name="{monster_id}">\n')

            # Add episode (always empty)
            file.write('        <string name="episode" value=""/>\n')

            # Add map information
            file.write('        <imgdir name="map">\n')
            for i, map_id in enumerate(maps):
                file.write(f'            <int name="{i}" value="{map_id}"/>\n')
            file.write('        </imgdir>\n')

            # Add reward information
            file.write('        <imgdir name="reward">\n')

            # Get drops for this monster
            drops = sorted(list(drop_data.get(monster_id, [])))

            # Filter out items that should be skipped
            filtered_drops = [item_id for item_id in drops if item_id not in ITEMS_TO_SKIP and not item_id.startswith("238")]

            # Count skipped items
            items_skipped = len(drops) - len(filtered_drops)
            total_items_skipped += items_skipped

            # Log if no drop data found for this monster
            if not filtered_drops:
                if not drops:
                    print(f"No drop data found for monster ID: {monster_id}")
                else:
                    print(f"All drops for monster ID: {monster_id} were filtered out")

            for i, item_id in enumerate(filtered_drops):
                file.write(f'            <int name="{i}" value="{item_id}"/>\n')

            file.write('        </imgdir>\n')
            file.write('    </imgdir>\n')

        # Close root imgdir
        file.write('</imgdir>\n')

    return total_items_skipped

def main():
    # Define file paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    monster_csv = os.path.join(script_dir, 'MonsterBook.csv')
    drop_csv = os.path.join(script_dir, '_ SQL drop_data.csv')
    output_xml = os.path.join(script_dir, 'MonsterBook.img.xml')

    # Read data
    print("Reading monster data...")
    monster_data = read_monster_data(monster_csv)
    print(f"Found {len(monster_data)} monsters.")

    print("Reading drop data...")
    drop_data = read_drop_data(drop_csv)
    print(f"Found drop data for {len(drop_data)} monsters.")

    # Generate XML
    print("Generating XML...")
    print(f"Items configured to skip: {len(ITEMS_TO_SKIP)}")
    print("Automatically skipping items with IDs starting with '238'")
    items_skipped = generate_monster_book_xml(monster_data, drop_data, output_xml)
    print(f"XML file generated: {output_xml}")
    print(f"Total items skipped: {items_skipped}")

if __name__ == "__main__":
    main()