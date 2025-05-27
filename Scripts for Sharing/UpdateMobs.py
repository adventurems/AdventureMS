import xml.etree.ElementTree as ET
import os
import csv
import xml.dom.minidom
import datetime

"""
UpdateMobs.py - A script to update mob XML files based on CSV data

Purpose:
    This script reads mob data from a CSV file and updates the corresponding XML files.
    For each ID in the CSV, it finds the matching XML file in the specified directory.
    It then updates the nodes within the "info" block based on the CSV column values.
    If a column is blank in the CSV, no changes are made to that field in the XML.
    If a matching node doesn't exist, it will be added.

How it works:
    1. Reads mob data from a CSV file with mob IDs and properties
    2. For each mob ID, finds the corresponding XML file
    3. Updates the XML nodes based on the CSV data
    4. Generates a report of all changes made

Input:
    - CSV file with mob data (must have an "ID" column)
    - Directory containing mob XML files

Output:
    - Updated XML files
    - Export file with a report of all changes made

Notes:
    - All fields are treated as type "int" except for "info.elemAttr" which is treated as type "string"
    - CSV column headers should match the node names (e.g., "info.level", "info.maxHP")
    - Empty cells in the CSV will be ignored (no changes made to those fields)
    - XML files should be named with the mob ID (e.g., "0100100.img.xml")
    - The script will add a leading 0 to IDs if needed to find matching files

Usage:
    1. Set the XML_DIRECTORY variable to the folder containing your XML files
    2. Set the CSV_FILE variable to the path of your CSV file
    3. Run the script: python UpdateMobs.py
"""

# Configuration variables - modify these to run the script
# Set the path for your directory containing XML files
XML_DIRECTORY = r"path/to/your/mob/xml/files"
# Set the path for your CSV file
CSV_FILE = r"path/to/your/mobs.csv"

def read_csv_file(file_path):
    """Read mob data from the CSV file."""
    mob_data = {}
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            # Try to read as CSV
            reader = csv.reader(f)
            headers = next(reader, None)

            if not headers:
                print("CSV file is empty or has no headers")
                return {}, []

            # Clean headers to remove BOM if present
            headers = [h.strip().replace('\ufeff', '') for h in headers]

            # Find the index of the ID column
            try:
                id_index = headers.index('ID')
            except ValueError:
                print("Error: No 'ID' column found in CSV headers")
                return {}, []

            # Process each row in the CSV
            for row in reader:
                if len(row) <= id_index:
                    print(f"Warning: Row has fewer columns than expected: {row}")
                    continue

                mob_id = row[id_index]
                if mob_id:
                    # Store non-empty values for each field
                    mob_data[mob_id] = {
                        headers[i]: value 
                        for i, value in enumerate(row) 
                        if i < len(headers) and value
                    }

        return mob_data, headers
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        import traceback
        traceback.print_exc()
        return {}, []

def process_xml_file(xml_file, mob_id, mob_fields):
    """Process a single XML file, updating nodes based on mob_fields."""
    try:
        # Use the correct XML declaration that should be preserved
        original_declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'

        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Find the info imgdir directly beneath the mob id directory
        # Using './imgdir[@name="info"]' instead of './/imgdir[@name="info"]' to only target
        # the root-level info node and avoid updating nested info nodes (e.g., in attack1/info)
        info_imgdir = root.find('./imgdir[@name="info"]')
        if info_imgdir is None:
            print(f"Warning: No info imgdir found in {xml_file}")
            return False, []

        changes_made = False
        changes_list = []  # List to track specific changes for this ID

        # Update or add nodes based on mob_fields
        for field_name, field_value in mob_fields.items():
            # Skip the ID field
            if field_name == 'ID':
                continue

            # Extract the node name from the field name (e.g., "info.level" -> "level")
            if '.' in field_name:
                node_name = field_name.split('.')[1]
            else:
                node_name = field_name

            # Determine node type (string for elemAttr, int for others)
            node_type = 'string' if node_name == 'elemAttr' else 'int'

            # Check if the node exists
            node = info_imgdir.find(f'./{node_type}[@name="{node_name}"]')

            if node is not None:
                # Update existing node
                current_value = node.get('value')
                if current_value != field_value:
                    node.set('value', field_value)
                    change_info = f"Updated node {node_name} from {current_value} to {field_value}"
                    print(f"{change_info} in {xml_file}")
                    changes_list.append(change_info)
                    changes_made = True
            else:
                # Add new node
                new_node = ET.SubElement(info_imgdir, node_type)
                new_node.set('name', node_name)
                new_node.set('value', field_value)
                change_info = f"Added new node {node_name} with value {field_value}"
                print(f"{change_info} to {xml_file}")
                changes_list.append(change_info)
                changes_made = True

        # Only write the file if changes were made
        if changes_made:
            # Write the modified XML back to the file with proper formatting
            rough_string = ET.tostring(root, encoding='UTF-8')

            # Use minidom to pretty-print the XML
            reparsed = xml.dom.minidom.parseString(rough_string)
            pretty_xml = reparsed.toprettyxml(indent="    ")

            # Extract content without the XML declaration
            lines = pretty_xml.split('\n')
            content_lines = [line for line in lines[1:] if line.strip()]  # Skip the first line (declaration)

            # Reconstruct the XML with the original declaration at the start
            if original_declaration:
                pretty_xml = original_declaration + '\n' + '\n'.join(content_lines)
            else:
                # Fallback to the generated declaration if original wasn't found
                xml_declaration = lines[0] if lines and lines[0].startswith('<?xml') else None
                if xml_declaration:
                    pretty_xml = xml_declaration + '\n' + '\n'.join(content_lines)
                else:
                    pretty_xml = '\n'.join(content_lines)

            # Write the pretty-printed XML to the file (in-place)
            with open(xml_file, 'w', encoding='UTF-8') as f:
                f.write(pretty_xml)

            print(f"Successfully updated file: {xml_file}")
            return True, changes_list

        return False, []

    except ET.ParseError as e:
        print(f"ERROR: Failed to parse XML file: {xml_file} - {e}")
        return False, []
    except Exception as e:
        print(f"ERROR: Failed to process XML file: {xml_file} - {e}")
        return False, []

def find_xml_file(directory, mob_id):
    """Find the XML file for the given mob_id in the directory."""
    # Add leading zero if not present
    if not mob_id.startswith('0'):
        mob_id_with_zero = '0' + mob_id
    else:
        mob_id_with_zero = mob_id

    # Check for different possible filenames
    possible_filenames = [
        f"{mob_id}.xml",
        f"{mob_id_with_zero}.xml",
        f"{mob_id}.img.xml",
        f"{mob_id_with_zero}.img.xml"
    ]

    for filename in possible_filenames:
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            return file_path

    return None

def generate_export_file(updated_ids, unchanged_ids):
    """Generate a .txt file with details of all updates and unchanged IDs."""
    # Create a timestamp for the filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    export_filename = f"update_mobs_export_{timestamp}.txt"

    # Get the script directory to save the file in the same location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    export_path = os.path.join(script_dir, export_filename)

    with open(export_path, 'w', encoding='utf-8') as f:
        f.write("=== MOB UPDATE REPORT ===\n")
        f.write(f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

        # Write details for each updated ID
        f.write("=== UPDATED IDs ===\n")
        if updated_ids:
            for mob_id, changes in updated_ids.items():
                f.write(f"\nID: {mob_id}\n")
                if changes:
                    for change in changes:
                        f.write(f"  - {change}\n")
                else:
                    f.write("  No specific changes recorded\n")
        else:
            f.write("No IDs were updated\n")

        # Write list of unchanged IDs
        f.write("\n\n=== UNCHANGED IDs ===\n")
        if unchanged_ids:
            for mob_id in unchanged_ids:
                f.write(f"{mob_id}\n")
        else:
            f.write("All IDs were updated\n")

    print(f"\nExport file generated: {export_path}")
    return export_path

def main():

    # Read mob data from CSV
    mob_data, fields = read_csv_file(CSV_FILE)
    if not mob_data:
        print("No mob data found in CSV file.")
        return

    print(f"Found {len(mob_data)} mobs to update.")

    # Process each mob from CSV
    updated_files = 0
    updated_ids = {}  # Dictionary to track updated IDs and their changes
    unchanged_ids = []  # List to track IDs that were not changed

    for mob_id, mob_fields in mob_data.items():
        # Find the XML file for this mob
        xml_file = find_xml_file(XML_DIRECTORY, mob_id)

        if xml_file:
            print(f"Processing mob ID: {mob_id}, File: {xml_file}")
            was_updated, changes = process_xml_file(xml_file, mob_id, mob_fields)
            if was_updated:
                updated_files += 1
                updated_ids[mob_id] = changes
            else:
                unchanged_ids.append(mob_id)
        else:
            print(f"Warning: No XML file found for mob ID: {mob_id}")
            unchanged_ids.append(mob_id)

    print(f"\n=== Summary ===")
    print(f"Processed {len(mob_data)} mobs from CSV")
    print(f"Updated {updated_files} files with changes")

    # Generate the export file
    generate_export_file(updated_ids, unchanged_ids)

if __name__ == "__main__":
    main()