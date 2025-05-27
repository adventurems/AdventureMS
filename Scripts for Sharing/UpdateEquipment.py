import csv
import os
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
import logging
from datetime import datetime

"""
UpdateEquipment.py - MapleStory Equipment XML Updater

Purpose:
    - Batch update equipment stats and properties in MapleStory XML files
    - Maintain consistency between a spreadsheet database and game files
    - Automate the tedious process of manually editing multiple XML files

How it works:
    1. Reads equipment data from "Equipment Breakdown.csv" in the script directory
    2. Maps item IDs to their appropriate equipment categories (weapons, accessories, etc.)
    3. Locates the corresponding XML files in the MapleStory directory structure
    4. Updates or adds properties in the XML files based on the CSV data
    5. Logs all actions and provides a summary of successful/failed updates

Input:
    - CSV file with columns:
        - "ID" (required): The equipment item ID
        - Other columns: Equipment properties to update (stat values, requirements, etc.)

Output:
    - Updated XML files in the MapleStory directory
    - Detailed log file with timestamp
    - Console summary of the update process

Usage:
    1. Prepare a CSV file named "Equipment Breakdown.csv" with equipment data
    2. Update the XML_ROOT_PATH variable to point to your MapleStory Character.wz directory
    3. Run the script: python UpdateEquipment.py
    4. Check the log file for details on the update process

Requirements:
    - CSV file must have an "ID" column with valid MapleStory equipment IDs
    - XML_ROOT_PATH must point to a valid MapleStory Character.wz directory
"""

# Set up logging
log_filename = f"equipment_update_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Create a console handler for INFO level (less verbose than the file log)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(levelname)s: %(message)s')
console_handler.setFormatter(console_formatter)

# Add the console handler to the root logger
root_logger = logging.getLogger()
root_logger.addHandler(console_handler)

# Define the root path for XML files - update this to point to your Character.wz directory
XML_ROOT_PATH = r"path/to/your/Character.wz"

# Define category mapping
CATEGORY_MAPPING = {
    "100": "Cap",
    "101": "Accessory",
    "102": "Accessory",
    "103": "Accessory",
    "112": "Accessory",
    "113": "Accessory",
    "114": "Accessory",
    "110": "Cape",
    "104": "Coat",
    "108": "Glove",
    "105": "Longcoat",
    "106": "Pants",
    "111": "Ring",
    "109": "Shield",
    "107": "Shoes"
}

# Add weapon categories (130-150)
for i in range(130, 151):
    CATEGORY_MAPPING[str(i)] = "Weapon"

def get_category_folder(item_id):
    """Determine the category folder based on the first 3 digits of the item ID."""
    category_code = item_id[:3]

    if category_code in CATEGORY_MAPPING:
        return CATEGORY_MAPPING[category_code]

    logging.warning(f"Unknown category code: {category_code} for item ID: {item_id}")
    return None

def get_xml_path(item_id):
    """Get the full path to the XML file for the given item ID."""
    category_folder = get_category_folder(item_id)
    if not category_folder:
        return None

    # Add leading zero to the item ID for XML filename
    xml_item_id = "0" + item_id

    xml_path = os.path.join(XML_ROOT_PATH, category_folder, f"{xml_item_id}.img.xml")
    return xml_path

def update_xml_file(xml_path, row_data):
    """Update the XML file with data from the CSV row."""
    try:
        # Parse the XML file
        tree = ET.parse(xml_path)
        root = tree.getroot()

        # Find or create the info node - try different possible locations
        info_node = None

        # Try direct child of root
        for child in root.findall("./imgdir"):
            if child.get("name") == "info":
                info_node = child
                break

        # Try one level deeper (common in MapleStory XMLs)
        if info_node is None:
            for imgdir in root.findall("./imgdir"):
                for child in imgdir.findall("./imgdir"):
                    if child.get("name") == "info":
                        info_node = child
                        break
                if info_node:
                    break

        # If still not found, create it as direct child of root
        if info_node is None:
            logging.info(f"Creating new info node in {xml_path}")
            info_node = ET.SubElement(root, "imgdir")
            info_node.set("name", "info")

        # Update or add each column from the CSV
        for column, value in row_data.items():
            # Skip ID column as it's used for identification only
            if column == "ID" or not value or value.strip() == "":
                continue

            # Skip attackSpeed for non-weapons
            category_folder = get_category_folder(row_data["ID"])
            if column == "attackSpeed" and category_folder != "Weapon":
                logging.debug(f"Skipping attackSpeed for non-weapon item {row_data['ID']}")
                continue

            # Find existing node for this column
            existing_node = None
            for child in info_node.findall("./int"):
                if child.get("name") == column:
                    existing_node = child
                    break

            # Remove commas from numeric values
            if value and "," in value:
                value = value.replace(",", "")

            if existing_node is not None:
                # Update existing node
                logging.debug(f"Updating existing node {column}={value} for item {row_data['ID']}")
                existing_node.set("value", value)
            else:
                # Create new node
                logging.debug(f"Creating new node {column}={value} for item {row_data['ID']}")
                new_node = ET.SubElement(info_node, "int")
                new_node.set("name", column)
                new_node.set("value", value)

        # Pretty print the XML
        rough_string = ET.tostring(root, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        pretty_xml = reparsed.toprettyxml(indent="    ")

        # Remove extra blank lines
        pretty_xml_lines = [line for line in pretty_xml.split('\n') if line.strip()]
        # Remove the XML declaration that minidom adds
        if pretty_xml_lines[0].startswith('<?xml'):
            pretty_xml_lines = pretty_xml_lines[1:]
        pretty_xml = '\n'.join(pretty_xml_lines)

        # Write to file with our own XML declaration
        with open(xml_path, 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
            f.write(pretty_xml)

        logging.info(f"Successfully updated {xml_path}")
        return True

    except Exception as e:
        logging.error(f"Error updating {xml_path}: {str(e)}")
        return False

def process_csv(csv_path):
    """Process the CSV file and update XML files."""
    success_count = 0
    failure_count = 0
    not_found_count = 0

    # Check if CSV file exists
    if not os.path.exists(csv_path):
        logging.error(f"CSV file not found: {csv_path}")
        print(f"Error: CSV file not found: {csv_path}")
        return False

    # Check if root XML path exists
    if not os.path.exists(XML_ROOT_PATH):
        logging.error(f"XML root path not found: {XML_ROOT_PATH}")
        print(f"Error: XML root path not found: {XML_ROOT_PATH}")
        return False

    try:
        with open(csv_path, 'r', encoding='utf-8-sig') as csv_file:
            csv_reader = csv.DictReader(csv_file)

            # Validate CSV has required columns
            required_columns = ["ID"]
            missing_columns = [col for col in required_columns if col not in csv_reader.fieldnames]
            if missing_columns:
                logging.error(f"CSV is missing required columns: {', '.join(missing_columns)}")
                print(f"Error: CSV is missing required columns: {', '.join(missing_columns)}")
                return False

            for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 to account for header row
                item_id = row.get("ID", "").strip()

                if not item_id:
                    logging.warning(f"Row {row_num}: Missing item ID")
                    failure_count += 1
                    continue

                # Get category and XML path
                category_folder = get_category_folder(item_id)
                if not category_folder:
                    logging.warning(f"Row {row_num}: Could not determine category for item ID {item_id}")
                    failure_count += 1
                    continue

                # Check if category folder exists
                category_path = os.path.join(XML_ROOT_PATH, category_folder)
                if not os.path.exists(category_path):
                    logging.warning(f"Row {row_num}: Category folder not found: {category_path}")
                    not_found_count += 1
                    continue

                xml_path = get_xml_path(item_id)
                if not xml_path:
                    logging.warning(f"Row {row_num}: Could not determine XML path for item ID {item_id}")
                    failure_count += 1
                    continue

                if not os.path.exists(xml_path):
                    logging.warning(f"Row {row_num}: XML file not found: {xml_path}")
                    not_found_count += 1
                    continue

                try:
                    if update_xml_file(xml_path, row):
                        success_count += 1
                        logging.info(f"Row {row_num}: Successfully updated item {item_id}")
                    else:
                        failure_count += 1
                        logging.error(f"Row {row_num}: Failed to update item {item_id}")
                except Exception as e:
                    logging.error(f"Row {row_num}: Error processing item {item_id}: {str(e)}")
                    failure_count += 1

    except Exception as e:
        logging.error(f"Error processing CSV file: {str(e)}")
        return False

    # Log summary
    logging.info(f"Processing complete. Success: {success_count}, Failures: {failure_count}, Not Found: {not_found_count}")
    print(f"Processing complete. Success: {success_count}, Failures: {failure_count}, Not Found: {not_found_count}")
    print(f"See {log_filename} for details")

    return True

def main():
    try:
        # Define paths
        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(script_dir, "Equipment Breakdown.csv")

        print(f"Starting equipment XML update process...")
        print(f"CSV file: {csv_path}")
        print(f"XML root path: {XML_ROOT_PATH}")
        print(f"Log file: {os.path.join(os.getcwd(), log_filename)}")
        print("Processing...")

        # Process the CSV file
        logging.info("Starting equipment XML update process")
        result = process_csv(csv_path)

        if result:
            print("\nEquipment XML update process completed successfully!")
        else:
            print("\nEquipment XML update process completed with errors. Check the log file for details.")

        logging.info("Equipment XML update process completed")

        print(f"\nLog file has been saved to: {os.path.join(os.getcwd(), log_filename)}")

    except Exception as e:
        logging.error(f"Unexpected error in main function: {str(e)}")
        print(f"An unexpected error occurred: {str(e)}")
        print(f"Check the log file for details: {os.path.join(os.getcwd(), log_filename)}")

if __name__ == "__main__":
    main()