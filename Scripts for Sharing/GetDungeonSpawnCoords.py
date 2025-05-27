import xml.etree.ElementTree as ET
import os
import argparse

"""
XML Life Coordinates Extractor

Purpose:
    This script extracts x and y coordinates from the 'life' block in an XML file
    and writes them to a text file as comma-separated pairs.

How it works:
    - Parses the XML file
    - Finds the 'life' block
    - Extracts x and y coordinates from each numbered imgdir within the life block
    - Writes the coordinates as pairs to a text file

Input:
    - An XML file containing a 'life' block with coordinate data
    - Optional command-line arguments for input and output files

Output:
    - A CSV text file with X,Y coordinates, one pair per line

Usage:
    1. Command-line mode:
       python GetDungeonSpawnCoords.py --input "path/to/map.img.xml" --output "path/to/coordinates.txt"
    
    2. Configuration mode (modify the variables at the top of the script):
       python GetDungeonSpawnCoords.py
"""

# Set the target XML file path here
TARGET_XML_FILE = "path/to/map.img.xml"
# Set the output text file path here
OUTPUT_TXT_FILE = "path/to/coordinates.txt"

def extract_coordinates(xml_file, output_file):
    """
    Extract x and y coordinates from life nodes in an XML file and write them to a text file.

    Args:
        xml_file (str): Path to the XML file
        output_file (str): Path to the output text file
    """
    print(f"Extracting coordinates from {xml_file}")

    # Parse the XML file
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except Exception as e:
        print(f"Error parsing XML file: {e}")
        return

    # Find the life block
    life_block = None
    for child in root:
        if child.get('name') == 'life':
            life_block = child
            break

    if life_block is None:
        print("No 'life' block found in the XML file.")
        return

    # Extract x and y coordinates from each numbered imgdir within the life block
    coordinates = []
    for imgdir in life_block:
        x_value = None
        y_value = None

        for element in imgdir:
            if element.get('name') == 'x':
                x_value = element.get('value')
            elif element.get('name') == 'y':
                y_value = element.get('value')

        if x_value is not None and y_value is not None:
            coordinates.append((x_value, y_value))

    # Write coordinates to the output file
    try:
        with open(output_file, 'w') as f:
            f.write("X,Y\n")  # Header
            for x, y in coordinates:
                f.write(f"{x},{y}\n")
        print(f"Successfully wrote {len(coordinates)} coordinate pairs to {output_file}")
    except Exception as e:
        print(f"Error writing to output file: {e}")

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Extract coordinates from XML life blocks.')
    parser.add_argument('--input', '-i', type=str, 
                        help='Input XML file path')
    parser.add_argument('--output', '-o', type=str, 
                        help='Output text file path')

    return parser.parse_args()

def main():
    # Parse command line arguments
    args = parse_arguments()
    
    # Use command line arguments if provided, otherwise use the constants
    xml_file = args.input if args.input else TARGET_XML_FILE
    output_file = args.output if args.output else OUTPUT_TXT_FILE
    
    # Check if the target XML file exists
    if not os.path.exists(xml_file):
        print(f"Error: Target XML file not found at {xml_file}")
        return

    # Create the output directory if it doesn't exist
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Extract coordinates and write to output file
    extract_coordinates(xml_file, output_file)

if __name__ == "__main__":
    main()