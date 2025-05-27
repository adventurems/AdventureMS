"""
ExtractItemIDs.py - Extract 8-digit item IDs from XML files

Purpose:
    This script extracts all 8-digit item IDs from an XML file, typically representing
    game items. It removes duplicates, sorts the IDs, and formats them into a 
    comma-separated list with line breaks for readability.

How it works:
    1. Parses the specified XML file
    2. Finds all imgdir elements with 8-digit IDs
    3. Removes duplicates and sorts the IDs
    4. Removes leading zeros from each ID
    5. Formats the IDs into a comma-separated list with line breaks every 15 IDs
    6. Saves the formatted list to a text file

Input:
    - An XML file containing imgdir elements with 8-digit IDs

Output:
    - A text file containing the formatted list of item IDs

Usage:
    1. Modify the input_file and output_file variables in the script
    2. Run the script: python ExtractItemIDs.py
"""

import xml.etree.ElementTree as ET
import re
import os
import argparse
import sys

def is_eight_digit_id(name):
    """Check if the name is an 8-digit ID."""
    return bool(re.match(r'^\d{8}$', name))

def extract_item_ids(xml_file):
    """Extract all 8-digit item IDs from the XML file."""
    # Parse the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Find all imgdir elements with 8-digit IDs
    item_ids = []

    for imgdir in root.findall('.//imgdir'):
        name = imgdir.get('name')
        if is_eight_digit_id(name):
            item_ids.append(name)

    # Remove duplicates and sort
    item_ids = sorted(list(set(item_ids)))

    return item_ids

def format_ids(item_ids, items_per_line=15):
    """Format IDs into a comma-separated list with line breaks."""
    # Remove leading zeros
    cleaned_ids = [item_id.lstrip('0') for item_id in item_ids]
    
    # Format IDs with line breaks
    formatted_output = ""
    for i in range(0, len(cleaned_ids), items_per_line):
        chunk = cleaned_ids[i:i+items_per_line]
        formatted_output += ", ".join(chunk)
        if i + items_per_line < len(cleaned_ids):
            formatted_output += ",\n"
            
    return formatted_output

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Extract 8-digit item IDs from an XML file.')
    parser.add_argument('--input', '-i', type=str, 
                        help='Input XML file path')
    parser.add_argument('--output', '-o', type=str, 
                        help='Output text file path')
    parser.add_argument('--items-per-line', '-n', type=int, default=15,
                        help='Number of items per line in the output (default: 15)')

    return parser.parse_args()

def main():
    # Parse command line arguments
    args = parse_arguments()
    
    # Use default values if not specified via command line
    input_file = args.input if args.input else "path/to/input.xml"
    output_file = args.output if args.output else "path/to/output.txt"
    items_per_line = args.items_per_line
    
    # Check if input file exists
    if not os.path.isfile(input_file):
        print(f"Error: Input file '{input_file}' does not exist.")
        return 1
        
    # Extract item IDs
    item_ids = extract_item_ids(input_file)
    print(f"Found {len(item_ids)} unique item IDs.")
    
    # Format IDs
    formatted_output = format_ids(item_ids, items_per_line)
    
    # Ensure output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Save to file
    try:
        with open(output_file, 'w') as f:
            f.write(f"Found {len(item_ids)} unique item IDs:\n")
            f.write(formatted_output)
        print(f"Item IDs have been saved to {output_file}")
    except Exception as e:
        print(f"Error writing to file: {e}")
        return 1
        
    # Print sample to console
    print("\nSample of formatted output:")
    sample = formatted_output[:200] + "..." if len(formatted_output) > 200 else formatted_output
    print(sample)
    
    return 0

if __name__ == "__main__":
    # If no command line arguments are provided, use these default values
    if len(sys.argv) == 1:
        # Default file paths - modify these as needed
        input_file = "path/to/input.xml"
        output_file = "path/to/output.txt"
        
        # Extract and save item IDs
        item_ids = extract_item_ids(input_file)
        print(f"Found {len(item_ids)} unique item IDs:")
        
        # Format and save
        formatted_output = format_ids(item_ids)
        with open(output_file, 'w') as f:
            f.write(f"Found {len(item_ids)} unique item IDs:\n")
            f.write(formatted_output)
            
        # Print to console
        print(formatted_output)
        print(f"Item IDs have been saved to {output_file}")
    else:
        sys.exit(main())