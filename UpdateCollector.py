#!/usr/bin/env python
"""
Collector Items Update Script

This script reads a CSV file containing collector items data and updates a JSON file
with this information. The script organizes the items by category in the JSON file.

You can set the default file paths at the top of the script by modifying:
    DEFAULT_CSV_PATH - Path to the CSV file containing collector items data
    DEFAULT_JSON_PATH - Path to the JSON file to be updated

Usage:
    python UpdateCollector.py [--csv CSV_PATH] [--json JSON_PATH]

Examples:
    python UpdateCollector.py
    python UpdateCollector.py --csv "path/to/csv/file.csv"
    python UpdateCollector.py --json "path/to/json/file.json"
    python UpdateCollector.py --csv "path/to/csv/file.csv" --json "path/to/json/file.json"
"""

import json
import csv
import os
import logging
import argparse
from datetime import datetime

# Define default file paths
script_dir = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV_PATH = r"yourpathhere/CollectorItems.csv"
DEFAULT_JSON_PATH = r"yourpathhere/CollectorItems.json"

# Configure logging
log_filename = f"update_collector_items_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def read_csv_file(csv_path):
    """
    Read the CSV file containing collector items data.

    Args:
        csv_path (str): Path to the CSV file

    Returns:
        list: List of dictionaries containing the CSV data
    """
    items_data = []
    try:
        with open(csv_path, 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                items_data.append(row)
        logging.info(f"Successfully read {len(items_data)} items from CSV file")
        return items_data
    except Exception as e:
        logging.error(f"Error reading CSV file: {str(e)}")
        raise

def read_json_file(json_path):
    """
    Read the existing JSON file if it exists.

    Args:
        json_path (str): Path to the JSON file

    Returns:
        dict: JSON data as a dictionary, or an empty dictionary if the file doesn't exist
    """
    try:
        if os.path.exists(json_path):
            with open(json_path, 'r') as json_file:
                json_data = json.load(json_file)
            logging.info(f"Successfully read existing JSON file")
            return json_data
        else:
            logging.warning(f"JSON file does not exist. Creating a new one.")
            return {}
    except Exception as e:
        logging.error(f"Error reading JSON file: {str(e)}")
        raise

def update_json_data(json_data, items_data):
    """
    Update the JSON data with the items from the CSV.

    Args:
        json_data (dict): Existing JSON data
        items_data (list): List of items from the CSV

    Returns:
        dict: Updated JSON data
    """
    try:
        # Initialize counters for logging
        categories_added = 0
        items_added = 0
        items_updated = 0
        skipped_items = 0

        for item in items_data:
            # Handle BOM character in column names
            id_key = next((k for k in item.keys() if k.endswith('ID')), None)
            if not id_key or 'Item Name' not in item or 'Collectable Category' not in item:
                logging.warning(f"Skipping item because it's missing required fields: {item}")
                skipped_items += 1
                continue

            item_id = item[id_key]
            item_name = item['Item Name']
            category = item['Collectable Category']

            # Skip items with empty ID or category
            if not item_id or not category:
                logging.warning(f"Skipping item because it has empty ID or category: {item}")
                skipped_items += 1
                continue

            # Use a default name if Item Name is empty
            if not item_name:
                item_name = f"Unknown Item {item_id}"
                logging.warning(f"Using default name for item with empty name: {item_id} -> {item_name}")
                # Don't skip these items, just use the default name

            # Map 'Collectable Category' to 'categories' in the JSON
            if 'categories' not in json_data:
                json_data['categories'] = {}

            if category not in json_data['categories']:
                json_data['categories'][category] = []
                categories_added += 1
                logging.info(f"Added new category: {category}")

            # Convert item_id to integer if possible
            try:
                numeric_id = int(item_id)
            except ValueError:
                numeric_id = item_id  # Keep as string if not convertible to int

            # Create new item object
            new_item = {"id": numeric_id, "name": item_name}

            # Check if item exists in category by ID, if not add it
            item_exists = False
            for existing_item in json_data['categories'][category]:
                if existing_item.get('id') == numeric_id:
                    # Update existing item
                    existing_item['name'] = item_name
                    items_updated += 1
                    logging.info(f"Updated existing item: {item_id} - {item_name} in category {category}")
                    item_exists = True
                    break

            if not item_exists:
                # Add new item to category array
                json_data['categories'][category].append(new_item)
                items_added += 1
                logging.info(f"Added new item: {item_id} - {item_name} to category {category}")

        logging.info(f"Update summary: {categories_added} categories added, {items_added} items added, {items_updated} items updated, {skipped_items} items skipped")
        return json_data
    except Exception as e:
        logging.error(f"Error updating JSON data: {str(e)}")
        # Log the traceback for more detailed error information
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        raise

def write_json_file(json_data, json_path):
    """
    Write the updated JSON data back to the file.

    Args:
        json_data (dict): Updated JSON data
        json_path (str): Path to the JSON file
    """
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        # Custom JSON encoder to format items on a single line
        class CompactJSONEncoder(json.JSONEncoder):
            def encode(self, obj):
                if isinstance(obj, dict) and 'categories' in obj:
                    # Format the main structure with indentation
                    result = '{\n'
                    result += '  "categories":\n'
                    result += '  {\n'

                    # Process each category
                    categories = []
                    for category, items in obj['categories'].items():
                        # Escape quotes in category names
                        escaped_category = category.replace('"', '\\"')
                        cat_str = f'    "{escaped_category}":\n    [\n'

                        # Format each item on a single line
                        item_lines = []
                        for item in items:
                            # Escape quotes in item names
                            escaped_name = item["name"].replace('"', '\\"')
                            item_lines.append(f'      {{"id": {item["id"]}, "name": "{escaped_name}"}}')

                        cat_str += ',\n'.join(item_lines)
                        cat_str += '\n    ]'
                        categories.append(cat_str)

                    result += ',\n\n'.join(categories)
                    result += '\n  }\n}'
                    return result
                return super().encode(obj)

        with open(json_path, 'w') as json_file:
            json_file.write(CompactJSONEncoder().encode(json_data))
        logging.info(f"Successfully wrote updated JSON data to {json_path}")
    except Exception as e:
        logging.error(f"Error writing JSON file: {str(e)}")
        raise

def parse_arguments():
    """
    Parse command-line arguments.

    Returns:
        argparse.Namespace: Parsed command-line arguments
    """
    parser = argparse.ArgumentParser(description='Update CollectorItems.json with data from a CSV file.')

    # Define arguments
    parser.add_argument('--csv', type=str, help='Path to the CSV file')
    parser.add_argument('--json', type=str, help='Path to the JSON file')

    return parser.parse_args()

def main():
    try:
        # Parse command-line arguments
        args = parse_arguments()

        # Use command-line argument for CSV path if provided, otherwise use default
        if args.csv and os.path.exists(args.csv):
            csv_path = args.csv
        else:
            csv_path = DEFAULT_CSV_PATH
            if args.csv:
                print(f"Warning: Specified CSV file not found: {args.csv}")
                print(f"Using default CSV file: {csv_path}")

        # Use command-line argument for JSON path if provided, otherwise use default
        if args.json:
            json_path = args.json
        elif os.access(os.path.dirname(DEFAULT_JSON_PATH), os.W_OK):
            json_path = DEFAULT_JSON_PATH
        else:
            json_path = os.path.join(script_dir, "CollectorItems.json")
            print(f"Warning: Cannot access the default path. Using local path instead: {json_path}")

        print(f"Starting collector items update process...")
        print(f"CSV file: {csv_path}")
        print(f"JSON file: {json_path}")
        print(f"Log file: {os.path.join(os.getcwd(), log_filename)}")
        print("Processing...")

        # Process the CSV and update the JSON
        logging.info("Starting collector items update process")

        # Read the CSV file
        items_data = read_csv_file(csv_path)

        # Read the existing JSON file
        json_data = read_json_file(json_path)

        # Update the JSON data with the CSV data
        updated_json_data = update_json_data(json_data, items_data)

        # Write the updated JSON data back to the file
        write_json_file(updated_json_data, json_path)

        print("\nCollector items update process completed successfully!")
        logging.info("Collector items update process completed")

        print(f"\nLog file has been saved to: {os.path.join(os.getcwd(), log_filename)}")

    except Exception as e:
        logging.error(f"Unexpected error in main function: {str(e)}")
        # Log the traceback for more detailed error information
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        print(f"An unexpected error occurred: {str(e)}")
        print(f"Check the log file for details: {os.path.join(os.getcwd(), log_filename)}")

if __name__ == "__main__":
    main()
