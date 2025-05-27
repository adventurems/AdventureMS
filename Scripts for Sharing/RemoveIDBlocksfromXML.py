"""
RemoveIDBlocksfromXML.py

Purpose:
    This script processes an XML file to selectively remove specific XML elements (imgdir nodes)
    based on their ID attributes. It keeps only the elements with IDs that are listed in a 
    separate file, while removing all others that match certain criteria.

How it works:
    1. Reads a list of IDs to keep from a file named 'IDs'
    2. Parses the input XML file ('Ins.img.xml.modified.xml')
    3. Identifies all imgdir elements with 7-digit IDs that:
       - Start with '301' but not '399'
       - Are NOT in the list of IDs to keep
    4. Removes these identified elements from the XML structure
    5. Writes the modified XML to the output file ('Ins.img.xml')

Input files:
    - Ins.img.xml.modified.xml: The source XML file to process
    - IDs: A text file containing one ID per line, listing IDs that should be kept

Output file:
    - Ins.img.xml: The processed XML file with unwanted elements removed

ID filtering criteria:
    - Only processes elements with 7-digit numeric IDs
    - Only targets IDs that start with '301' but not '399'
    - Removes elements only if their IDs are not in the 'IDs' file

Usage:
    1. Place this script in the same directory as your XML files
    2. Create an 'IDs' file with the list of IDs to keep
    3. Run the script: python RemoveIDBlocksfromXML.py
    4. Alternatively, modify the file paths in the script to point to your specific files
"""

import xml.etree.ElementTree as ET
import re
import os

def is_valid_id_to_process(name):
    """Check if the name is a 7-digit ID that starts with 301 but not 399."""
    if not bool(re.match(r'^\d{7}$', name)):
        return False
    # Only process IDs that start with 301, not 399
    return name.startswith('301') and not name.startswith('399')

def read_ids_file(file_path):
    """Read IDs from the file, one ID per line."""
    ids_to_keep = []
    try:
        with open(file_path, 'r') as f:
            for line in f:
                # Strip whitespace
                item_id = line.strip()
                if item_id:
                    ids_to_keep.append(item_id)
        return ids_to_keep
    except Exception as e:
        print(f"Error reading IDs file: {e}")
        return []

def process_xml(input_file, output_file, ids_file):
    # Read IDs to keep
    ids_to_keep = read_ids_file(ids_file)
    if not ids_to_keep:
        print("No IDs found to keep. All items will be removed.")
        return 0

    print(f"Found {len(ids_to_keep)} IDs to keep.")

    # Parse the XML file
    tree = ET.parse(input_file)
    root = tree.getroot()

    # Find all imgdir elements with IDs NOT matching those in the list
    items_to_remove = []

    # Create a set for faster lookups
    ids_set = set(ids_to_keep)

    # Build a map of elements to their parents for faster removal
    parent_map = {c: p for p in root.iter() for c in p}

    for imgdir in root.findall('.//imgdir'):
        name = imgdir.get('name')
        # Only consider elements with 7-digit IDs that start with 301 but not 399
        if is_valid_id_to_process(name) and name not in ids_set:
            items_to_remove.append(imgdir)
            print(f"Found item to remove: {name}")

    # Remove the identified items
    for item in items_to_remove:
        parent = parent_map.get(item)
        if parent is not None:
            parent.remove(item)

    # Write the modified XML to the output file
    tree.write(output_file, encoding='UTF-8', xml_declaration=True)

    return len(items_to_remove)

if __name__ == "__main__":
    # Use the current directory as the default location
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Default file names - can be modified as needed
    input_file = os.path.join(script_dir, "Ins.img.xml.modified.xml")
    output_file = os.path.join(script_dir, "Ins.img.xml")
    ids_file = os.path.join(script_dir, "IDs")
    
    # Uncomment and modify these lines to use custom file paths
    # input_file = "path/to/your/input/file.xml"
    # output_file = "path/to/your/output/file.xml"
    # ids_file = "path/to/your/ids/file"

    removed_count = process_xml(input_file, output_file, ids_file)
    print(f"Processed XML file. Removed {removed_count} items that start with 301 (but not 399) and were not in the IDs list.")