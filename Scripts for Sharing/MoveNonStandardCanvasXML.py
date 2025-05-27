import xml.etree.ElementTree as ET
import os
import argparse
import sys
import shutil

"""
MoveNonStandardCanvasXML.py

Purpose:
    This script processes XML files in a source folder and moves files to a destination folder
    if ALL canvas nodes in the file have dimensions NOT equal to 1x1.

How it works:
    - Checks all XML files in the source folder
    - For each file, examines all canvas nodes with width and height attributes
    - If ALL canvas nodes in a file have dimensions NOT equal to 1x1, moves the file to the destination folder
    - Creates the destination folder if it doesn't exist

Input:
    - Source folder containing XML files to check
    - Destination folder where matching files will be moved

Output:
    - Files with all non-standard canvas dimensions moved to the destination folder
    - Console output summarizing the findings

Usage:
    1. Command-line mode:
       python MoveNonStandardCanvasXML.py --source "path/to/source/folder" --destination "path/to/destination/folder"
    
    2. Configuration mode (modify the variables at the top of the script):
       python MoveNonStandardCanvasXML.py
"""

# Configuration variables - modify these to run the script directly from IDE
# Set the paths for your files here
SOURCE_FOLDER = r"path/to/source/folder"  # Path to the folder containing XML files
DESTINATION_FOLDER = r"path/to/destination/folder"  # Path to move files with non-standard canvas dimensions

def process_xml_file(xml_file):
    """
    Process an XML file to check if ALL canvas nodes have width and height attributes NOT equal to 1x1.

    Args:
        xml_file (str): Path to the XML file

    Returns:
        bool: True if ALL canvas nodes have dimensions NOT equal to 1x1, False otherwise
    """
    try:
        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Find all canvas elements in the file
        canvas_elements = root.findall(".//canvas")

        # If no canvas elements found, return False
        if not canvas_elements:
            print(f"No canvas elements found in {os.path.basename(xml_file)}")
            return False

        # Flag to track if all canvas nodes have dimensions not equal to 1x1
        all_non_standard = True

        # Check each canvas element
        for canvas in canvas_elements:
            width = canvas.get('width')
            height = canvas.get('height')

            # If width or height is missing, skip this canvas
            if width is None or height is None:
                continue

            # Check if both width and height are 1
            if width == '1' and height == '1':
                # Found a 1x1 canvas, so not all are non-standard
                all_non_standard = False
                break

        return all_non_standard

    except ET.ParseError as e:
        print(f"ERROR: Failed to parse XML file: {xml_file} - {e}")
        return False
    except Exception as e:
        print(f"ERROR: Failed to process XML file: {xml_file} - {e}")
        return False

def process_folder(source_folder, destination_folder):
    """
    Process all XML files in a folder and move files where ALL canvas nodes have 
    dimensions NOT equal to 1x1 to the destination folder.

    Args:
        source_folder (str): Path to the folder containing XML files
        destination_folder (str): Path to the folder where files should be moved

    Returns:
        int: Number of files moved
    """
    if not os.path.exists(source_folder):
        print(f"Error: Source folder {source_folder} does not exist")
        return 0

    # Create destination folder if it doesn't exist
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
        print(f"Created destination folder: {destination_folder}")

    # Count of files moved
    files_moved = 0

    # Process each XML file in the folder
    for filename in os.listdir(source_folder):
        if filename.endswith('.xml'):
            xml_file = os.path.join(source_folder, filename)

            # Process the XML file
            if process_xml_file(xml_file):
                # Move the file to the destination folder
                destination_file = os.path.join(destination_folder, filename)
                shutil.move(xml_file, destination_file)
                print(f"Moved {filename} to {destination_folder}")
                files_moved += 1

    return files_moved

def main():
    # Check if command-line arguments were provided
    use_config_vars = len(sys.argv) == 1

    if use_config_vars:
        # Use configuration variables from the top of the script
        source_folder = SOURCE_FOLDER
        destination_folder = DESTINATION_FOLDER

        print("\n=== Using configuration variables from script ===")
    else:
        # Parse command-line arguments
        parser = argparse.ArgumentParser(
            description='Check XML files for canvas nodes and move files where ALL canvas nodes have dimensions NOT equal to 1x1 to a destination folder.'
        )
        parser.add_argument('--source', required=True, 
                           help='Path to the folder containing XML files to check.')
        parser.add_argument('--destination', required=True, 
                           help='Path to the folder where files should be moved.')

        args = parser.parse_args()

        source_folder = args.source
        destination_folder = args.destination

    # Process the folder
    print(f"\n=== Processing folder: {source_folder} ===")
    print(f"Destination folder: {destination_folder}")

    files_moved = process_folder(source_folder, destination_folder)

    print(f"\n=== Summary ===")
    print(f"Files moved to destination folder: {files_moved}")

if __name__ == "__main__":
    main()