"""
CheckXMLNodeDimensions.py

Purpose:
    This script analyzes XML files to identify nodes with specific dimensions (width=1 and height=1).
    It's particularly useful for finding problematic or placeholder images in XML data structures.
    The script only processes files where the 'info' node contains a 'cash' node with value 1.

How it works:
    1. Scans a folder containing XML files
    2. For each file, checks if it has a 'cash' node with value 1 in the 'info' section
    3. Searches for specific canvas nodes (like 'icon', 'iconRaw') within designated parent nodes
    4. Identifies nodes with width=1 and height=1
    5. Outputs the IDs of files containing such nodes to a text file

Input:
    - A folder containing XML files to analyze
    - (Optional) Command-line arguments to specify folder, output file, and target nodes

Output:
    - A text file containing the IDs of XML files with nodes having width=1 and height=1
    - Console output summarizing the findings

Usage:
    1. Command-line mode:
       python CheckXMLNodeDimensions.py --folder "path/to/xml/files" --output "path/to/output.txt" --nodes icon iconRaw
    
    2. Configuration mode (modify the variables at the top of the script):
       python CheckXMLNodeDimensions.py
"""

import xml.etree.ElementTree as ET
import os
import argparse
import sys

# Configuration variables - modify these to run the script directly from IDE
# Set the paths for your files here
FOLDER_PATH = r"path/to/xml/files"  # Path to the folder containing XML files
OUTPUT_FILE = r"path/to/output.txt"  # Path to the output text file
TARGET_NODES = ['icon', 'iconRaw', 'iconD', 'iconRawD']  # Names of nodes to check
PARENT_NODES = ['info', 'default', 'backDefault']  # Parent nodes where TARGET_NODES should be searched

def process_xml_file(xml_file, target_nodes):
    """
    Process an XML file to check if specified nodes have width and height attributes equal to 1.
    Only looks for target nodes within specific parent nodes (info, default, backDefault).
    Only evaluates files where the info node contains a cash node with value 1.

    Args:
        xml_file (str): Path to the XML file
        target_nodes (list): List of node names to check

    Returns:
        bool: True if any target node has width=1 and height=1, False otherwise
    """
    try:
        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Check if the info node contains a cash node with value 1
        info_elements = root.findall(".//imgdir[@name='info']")
        if not info_elements:
            print(f"No info node found in {os.path.basename(xml_file)}")
            return False

        cash_node_found = False
        for info in info_elements:
            cash_node = info.find("./int[@name='cash']")
            if cash_node is not None and cash_node.get('value') == '1':
                cash_node_found = True
                break

        if not cash_node_found:
            print(f"No cash node with value 1 found in info node in {os.path.basename(xml_file)}")
            return False

        # Flag to track if any target node has width=1 and height=1
        found_target_node = False

        # Search for canvas elements with the specified names only within specific parent nodes
        for parent_node in PARENT_NODES:
            # Find the parent imgdir node
            parent_elements = root.findall(f".//imgdir[@name='{parent_node}']")

            for parent in parent_elements:
                # Search for target nodes only within this parent
                for node_name in target_nodes:
                    canvas_elements = parent.findall(f"./canvas[@name='{node_name}']")

                    for canvas in canvas_elements:
                        width = canvas.get('width')
                        height = canvas.get('height')

                        # Check if both width and height are 1
                        if width == '1' and height == '1':
                            print(f"Found {node_name} with width=1 and height=1 in parent {parent_node} in {os.path.basename(xml_file)}")
                            found_target_node = True

        return found_target_node

    except ET.ParseError as e:
        print(f"ERROR: Failed to parse XML file: {xml_file} - {e}")
        return False
    except Exception as e:
        print(f"ERROR: Failed to process XML file: {xml_file} - {e}")
        return False

def process_folder(folder_path, target_nodes, output_file):
    """
    Process all XML files in a folder and check for target nodes with width=1 and height=1.

    Args:
        folder_path (str): Path to the folder containing XML files
        target_nodes (list): List of node names to check
        output_file (str): Path to the output text file

    Returns:
        int: Number of files with target nodes having width=1 and height=1
    """
    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} does not exist")
        return 0

    # Count of files with target nodes having width=1 and height=1
    files_with_target_nodes = 0

    # List to store IDs of files with target nodes having width=1 and height=1
    ids_with_target_nodes = []

    # Process each XML file in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith('.xml'):
            xml_file = os.path.join(folder_path, filename)

            # Extract the ID from the filename (remove .img.xml or .xml extension)
            file_id = filename.replace('.img.xml', '').replace('.xml', '')

            # Process the XML file
            if process_xml_file(xml_file, target_nodes):
                files_with_target_nodes += 1
                ids_with_target_nodes.append(file_id)

    # Write IDs to the output file (append mode)
    if ids_with_target_nodes:
        with open(output_file, 'a') as f:
            for file_id in ids_with_target_nodes:
                f.write(f"{file_id}\n")

        print(f"Added {len(ids_with_target_nodes)} IDs to {output_file}")

    return files_with_target_nodes

def main():
    # Check if command-line arguments were provided
    use_config_vars = len(sys.argv) == 1

    if use_config_vars:
        # Use configuration variables from the top of the script
        folder_path = FOLDER_PATH
        output_file = OUTPUT_FILE
        target_nodes = TARGET_NODES

        print("\n=== Using configuration variables from script ===")
    else:
        # Parse command-line arguments
        parser = argparse.ArgumentParser(
            description='Check XML files for nodes with width=1 and height=1 and output IDs to a text file.'
        )
        parser.add_argument('--folder', required=True, 
                           help='Path to the folder containing XML files to check.')
        parser.add_argument('--output', required=True, 
                           help='Path to the output text file (IDs will be appended).')
        parser.add_argument('--nodes', nargs='+', default=['icon', 'iconRaw', 'default', 'backDefault'],
                           help='Names of nodes to check. Default: icon, iconRaw, default, backDefault')

        args = parser.parse_args()

        folder_path = args.folder
        output_file = args.output
        target_nodes = args.nodes

    # Process the folder
    print(f"\n=== Processing folder: {folder_path} ===")
    print(f"Looking for nodes: {', '.join(target_nodes)}")
    print(f"Output file: {output_file}")

    files_with_target_nodes = process_folder(folder_path, target_nodes, output_file)

    print(f"\n=== Summary ===")
    print(f"Files with target nodes having width=1 and height=1: {files_with_target_nodes}")

if __name__ == "__main__":
    main()