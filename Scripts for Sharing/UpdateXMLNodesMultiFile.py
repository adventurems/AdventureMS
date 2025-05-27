import xml.etree.ElementTree as ET
import os
import argparse
import json
import sys
import xml.dom.minidom

"""
UpdateXMLNodesMultiFile.py

Purpose:
    This script processes XML files across multiple directories, updating and removing nodes
    based on a configuration file. It's designed to help standardize XML files by
    updating specific nodes to standard values and removing unwanted nodes.

How it works:
    1. Reads a list of item IDs from a file (comma-separated or line-by-line)
    2. Reads a configuration file that specifies which nodes to update and which to remove
    3. For each folder in the specified list, finds XML files matching the IDs
    4. Updates nodes specified in the 'update' section of the config
    5. Removes nodes specified in the 'remove' section of the config
    6. Writes the modified XML back to the file with proper formatting

Input:
    - List of folders containing XML files to process
    - File containing item IDs to process
    - JSON configuration file specifying nodes to update and remove

Configuration file format:
    {
        "update": {
            "node1": "value1",
            "node2": "value2"
        },
        "remove": [
            "node3",
            "node4"
        ]
    }

Output:
    - Modified XML files with updated and removed nodes
    - Console output summarizing the changes made

Usage:
    1. Command-line mode:
       python UpdateXMLNodesMultiFile.py --folders "path/to/folder1" "path/to/folder2" --ids_file "path/to/ids.txt" --config "path/to/config.json"
    
    2. Configuration mode (modify the variables at the top of the script):
       python UpdateXMLNodesMultiFile.py
"""

# Configuration variables - modify these to run the script directly from IDE
# Set the paths for your files here
BASE_FOLDER = r"path/to/base/folder"  # Base folder containing all directories
# List of directories to process
XML_FOLDERS = [
    os.path.join(BASE_FOLDER, "Folder1"),
    os.path.join(BASE_FOLDER, "Folder2"),
    os.path.join(BASE_FOLDER, "Folder3")
    # Add more folders as needed
]
IDS_FILE = r"path/to/ids/file"  # File containing IDs to process
CONFIG_FILE = r"path/to/config.json"  # JSON configuration file

def read_ids_file(file_path):
    """Read IDs from the file in comma-separated format or line-by-line format."""
    ids_to_process = []
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            # Check if the content contains commas
            if ',' in content:
                # Split by commas and process each ID
                for item_id in content.split(','):
                    # Strip whitespace
                    item_id = item_id.strip()
                    if item_id:
                        ids_to_process.append(item_id)
            else:
                # Split by lines and process each ID
                for item_id in content.splitlines():
                    # Strip whitespace
                    item_id = item_id.strip()
                    if item_id:
                        ids_to_process.append(item_id)
        return ids_to_process
    except Exception as e:
        print(f"Error reading IDs file: {e}")
        return []

def detect_xml_format(root):
    """Detect the format of the XML file (ItemMake-style or Ins-style)."""
    # Check a sample of imgdir elements to determine the format
    for imgdir in root.findall('.//imgdir')[:5]:  # Check first 5 imgdir elements
        # If we find a string element directly under imgdir, it's likely Ins.img.xml format
        if imgdir.find('./string') is not None:
            return "ins"
        # If we find int elements directly under imgdir, it's likely ItemMake.img.xml format
        if imgdir.find('./int') is not None:
            return "itemMake"

    # Default to itemMake format if we can't determine
    return "itemMake"

def process_xml(xml_file, output_file, ids_to_process, nodes_to_update, nodes_to_remove):
    """Process the XML file, updating and removing nodes as specified.

    If output_file is None, the XML file will be updated in-place.
    """
    try:
        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Detect the XML format
        xml_format = detect_xml_format(root)

        # Counter for tracking changes
        updated_items = 0
        changes_made = False

        # Find the first imgdir element (we don't need to check IDs, we already know this is the right file)
        imgdir = root.find('.//imgdir')

        if imgdir is not None:
            if xml_format == "itemMake":
                # ItemMake.img.xml format - look for info imgdir
                info_imgdir = imgdir.find('./imgdir[@name="info"]')
                if info_imgdir is None:
                    # Try to find any info imgdir
                    info_imgdir = root.find('.//imgdir[@name="info"]')

                if info_imgdir is not None:
                    # Update or add nodes
                    for node_name, node_value in nodes_to_update.items():
                        # Check if the node exists
                        node = info_imgdir.find(f'./int[@name="{node_name}"]')
                        if node is not None:
                            # Update existing node
                            current_value = node.get('value')
                            if current_value != str(node_value):
                                node.set('value', str(node_value))
                                print(f"Updated node {node_name} from {current_value} to {node_value} in {xml_file}")
                                changes_made = True
                        else:
                            # Add new node if it doesn't exist
                            new_node = ET.SubElement(info_imgdir, 'int')
                            new_node.set('name', node_name)
                            new_node.set('value', str(node_value))
                            print(f"Added new node {node_name} with value {node_value} to {xml_file}")
                            changes_made = True

                    # Remove nodes
                    for node_name in nodes_to_remove:
                        node = info_imgdir.find(f'./int[@name="{node_name}"]')
                        if node is not None:
                            info_imgdir.remove(node)
                            print(f"Removed node {node_name} from {xml_file}")
                            changes_made = True
                else:
                    print(f"Warning: No info imgdir found in {xml_file}")
            else:  # "ins" format
                # Ins.img.xml format - nodes should be 'int' elements
                # Update or add nodes
                for node_name, node_value in nodes_to_update.items():
                    # Check if the node exists
                    node = imgdir.find(f'./int[@name="{node_name}"]')
                    if node is not None:
                        # Update existing node
                        current_value = node.get('value')
                        if current_value != str(node_value):
                            node.set('value', str(node_value))
                            print(f"Updated node {node_name} from {current_value} to {node_value} in {xml_file}")
                            changes_made = True
                    else:
                        # Add new node if it doesn't exist
                        new_node = ET.SubElement(imgdir, 'int')
                        new_node.set('name', node_name)
                        new_node.set('value', str(node_value))
                        print(f"Added new node {node_name} with value {node_value} to {xml_file}")
                        changes_made = True

                # Remove nodes
                for node_name in nodes_to_remove:
                    node = imgdir.find(f'./int[@name="{node_name}"]')
                    if node is not None:
                        imgdir.remove(node)
                        print(f"Removed node {node_name} from {xml_file}")
                        changes_made = True

        # Only write the file if changes were made
        if changes_made:
            # Increment the updated_items counter
            updated_items += 1

            # Write the modified XML to the file with proper formatting
            # First, write to a temporary string
            rough_string = ET.tostring(root, encoding='UTF-8')

            # Use minidom to pretty-print the XML
            reparsed = xml.dom.minidom.parseString(rough_string)
            pretty_xml = reparsed.toprettyxml(indent="    ")

            # Extract the XML declaration (first line)
            lines = pretty_xml.split('\n')
            xml_declaration = lines[0] if lines and lines[0].startswith('<?xml') else None

            # Remove extra blank lines that minidom sometimes adds
            content_lines = [line for line in lines[1:] if line.strip()]

            # Reconstruct the XML with declaration at the start
            if xml_declaration:
                pretty_xml = xml_declaration + '\n' + '\n'.join(content_lines)
            else:
                pretty_xml = '\n'.join(content_lines)

            # Write the pretty-printed XML to the file (in-place)
            with open(xml_file, 'w', encoding='UTF-8') as f:
                f.write(pretty_xml)

            print(f"Successfully updated file: {xml_file}")

        return updated_items
    except ET.ParseError as e:
        print(f"ERROR: Failed to parse XML file: {xml_file} - {e}")
        return 0
    except Exception as e:
        print(f"ERROR: Failed to process XML file: {xml_file} - {e}")
        return 0

def process_folder(folder_path, ids_to_process, nodes_to_update, nodes_to_remove):
    """Process XML files in a folder that match the IDs in the ids_to_process list."""
    total_updated_items = 0
    processed_files = 0

    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} does not exist")
        return 0, 0

    # Process each ID
    for item_id in ids_to_process:
        # Check if there's a matching XML file in the folder
        xml_file = os.path.join(folder_path, f"{item_id}.xml")
        # Also check for filename with leading zero if the ID doesn't already have one
        xml_file_with_zero = os.path.join(folder_path, f"0{item_id}.xml") if not item_id.startswith('0') else None
        # Check for filename with .img.xml extension
        xml_file_img = os.path.join(folder_path, f"{item_id}.img.xml")
        # Check for filename with leading zero and .img.xml extension
        xml_file_with_zero_img = os.path.join(folder_path, f"0{item_id}.img.xml") if not item_id.startswith('0') else None

        if os.path.isfile(xml_file):
            # Process the XML file
            updated_items = process_xml(xml_file, None, [item_id], nodes_to_update, nodes_to_remove)
            total_updated_items += updated_items
            processed_files += 1
        elif xml_file_with_zero and os.path.isfile(xml_file_with_zero):
            # Process the XML file
            updated_items = process_xml(xml_file_with_zero, None, [item_id], nodes_to_update, nodes_to_remove)
            total_updated_items += updated_items
            processed_files += 1
        elif os.path.isfile(xml_file_img):
            # Process the XML file
            updated_items = process_xml(xml_file_img, None, [item_id], nodes_to_update, nodes_to_remove)
            total_updated_items += updated_items
            processed_files += 1
        elif xml_file_with_zero_img and os.path.isfile(xml_file_with_zero_img):
            # Process the XML file
            updated_items = process_xml(xml_file_with_zero_img, None, [item_id], nodes_to_update, nodes_to_remove)
            total_updated_items += updated_items
            processed_files += 1

    return total_updated_items, processed_files

def main():
    # Check if command-line arguments were provided
    use_config_vars = len(sys.argv) == 1

    if use_config_vars:
        # Use configuration variables from the top of the script
        folders = XML_FOLDERS
        ids_file = IDS_FILE
        config_file = CONFIG_FILE
    else:
        # Use command-line arguments
        parser = argparse.ArgumentParser(description='Update XML nodes for specified item IDs in multiple folders of XML files.')
        parser.add_argument('--folders', nargs='+', required=True, 
                           help='Paths to the folders containing XML files to update. Multiple folders can be specified.')
        parser.add_argument('--ids_file', required=True, 
                           help='Path to the file containing comma-separated or line-by-line IDs to process.')
        parser.add_argument('--config', required=True, 
                           help='Path to the JSON configuration file with nodes to update/remove.')

        args = parser.parse_args()

        folders = args.folders
        ids_file = args.ids_file
        config_file = args.config

    # Read IDs to process
    ids_to_process = read_ids_file(ids_file)
    if not ids_to_process:
        print("No IDs found to process.")
        return

    # Read configuration
    try:
        with open(config_file, 'r') as f:
            config = json.load(f)

        nodes_to_update = config.get('update', {})
        nodes_to_remove = config.get('remove', [])

        print(f"Nodes to update: {', '.join(nodes_to_update.keys())}")
        print(f"Nodes to remove: {', '.join(nodes_to_remove)}")

    except Exception as e:
        print(f"Error reading configuration file: {e}")
        return

    # Process each folder
    grand_total_updated_items = 0
    grand_total_processed_files = 0

    for folder_path in folders:
        print(f"\n=== Processing folder: {folder_path} ===")

        # Process the folder of XML files
        total_updated_items, processed_files = process_folder(
            folder_path, ids_to_process, nodes_to_update, nodes_to_remove
        )

        grand_total_updated_items += total_updated_items
        grand_total_processed_files += processed_files

        if total_updated_items > 0:
            print(f"Updated {total_updated_items} files with changes in {folder_path}")

    # Print grand total
    print(f"\n=== Summary ===")
    print(f"Processed {len(folders)} folders")
    print(f"Processed {grand_total_processed_files} files in total")
    print(f"Updated {grand_total_updated_items} files with changes in total")

if __name__ == "__main__":
    main()