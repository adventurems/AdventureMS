import xml.etree.ElementTree as ET
import os
import argparse
import json
import sys
import xml.dom.minidom

"""
StripXMLNodesSingleFolder.py

Purpose:
    This script processes XML files in a single folder, updating or removing nodes
    based on a configuration file. It's designed to help standardize XML files by
    keeping only specific nodes and updating others to standard values.

How it works:
    1. Optionally reads a list of item IDs from a file
    2. Reads a configuration file that specifies which nodes to update and which to skip
    3. Processes either all XML files in the folder or only those matching the IDs
    4. Updates nodes specified in the 'update' section of the config
    5. Keeps nodes specified in the 'skip' section of the config
    6. Removes all other nodes
    7. Writes the modified XML back to the file with proper formatting

Input:
    - Folder containing XML files to process
    - Optional file containing item IDs to process (comma-separated or line-by-line)
    - JSON configuration file specifying nodes to update and skip

Configuration file format:
    {
        "update": {
            "node1": "value1",
            "node2": "value2"
        },
        "skip": [
            "node3",
            "node4"
        ]
    }

Output:
    - Modified XML files with updated nodes
    - Console output summarizing the changes made

Usage:
    1. Command-line mode:
       a. Process specific files:
          python StripXMLNodesSingleFolder.py --folder "path/to/folder" --ids_file "path/to/ids.txt" --config "path/to/config.json"
       b. Process all files:
          python StripXMLNodesSingleFolder.py --folder "path/to/folder" --config "path/to/config.json" --all
    
    2. Configuration mode (modify the variables at the top of the script):
       python StripXMLNodesSingleFolder.py
"""

# Configuration variables - modify these to run the script directly from IDE
# Set the paths for your files here
BASE_FOLDER = r"path/to/folder"  # Folder containing XML files to process
IDS_FILE = r"path/to/ids/file"  # File containing IDs to process
CONFIG_FILE = r"path/to/config.json"  # JSON configuration file
PROCESS_ALL_FILES = True  # Set to True to process all files in the folder, False to only process files matching IDs from IDS_FILE

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

def process_xml(xml_file, output_file, ids_to_process, nodes_to_update, nodes_to_skip):
    """Process the XML file, updating nodes in the update section, 
    skipping nodes in the skip section, and removing all other nodes.

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
                    # Get all existing int nodes in the info imgdir
                    existing_nodes = info_imgdir.findall('./int')
                    nodes_to_remove = []

                    # Identify nodes to remove (those not in update or skip lists)
                    for node in existing_nodes:
                        node_name = node.get('name')
                        if node_name not in nodes_to_update and node_name not in nodes_to_skip:
                            nodes_to_remove.append(node)

                    # Update or add nodes from the update section
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

                    # Remove nodes that are not in update or skip lists
                    for node in nodes_to_remove:
                        node_name = node.get('name')
                        info_imgdir.remove(node)
                        print(f"Removed node {node_name} from {xml_file}")
                        changes_made = True
                else:
                    print(f"Warning: No info imgdir found in {xml_file}")
            else:  # "ins" format
                # Ins.img.xml format - look for info imgdir
                info_imgdir = imgdir.find('./imgdir[@name="info"]')
                if info_imgdir is None:
                    # Try to find any info imgdir
                    info_imgdir = root.find('.//imgdir[@name="info"]')

                if info_imgdir is not None:
                    # Get all existing int nodes in the info imgdir
                    existing_nodes = info_imgdir.findall('./int')
                    nodes_to_remove = []

                    # Identify nodes to remove (those not in update or skip lists)
                    for node in existing_nodes:
                        node_name = node.get('name')
                        if node_name not in nodes_to_update and node_name not in nodes_to_skip:
                            nodes_to_remove.append(node)

                    # Update or add nodes from the update section
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

                    # Remove nodes that are not in update or skip lists
                    for node in nodes_to_remove:
                        node_name = node.get('name')
                        info_imgdir.remove(node)
                        print(f"Removed node {node_name} from {xml_file}")
                        changes_made = True
                else:
                    print(f"Warning: No info imgdir found in {xml_file}")

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

def process_folder(folder_path, ids_to_process, nodes_to_update, nodes_to_skip, process_all_files=False):
    """Process XML files in a folder.

    If process_all_files is True, process all XML files in the folder.
    Otherwise, only process files that match the IDs in the ids_to_process list.
    """
    total_updated_items = 0
    processed_files = 0

    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} does not exist")
        return 0, 0

    if process_all_files:
        # Process all XML files in the folder
        print(f"Processing all XML files in {folder_path}")
        for filename in os.listdir(folder_path):
            if filename.endswith('.xml'):
                xml_file = os.path.join(folder_path, filename)
                # Extract the ID from the filename (remove .xml or .img.xml extension)
                item_id = filename.replace('.img.xml', '').replace('.xml', '')
                # Process the XML file
                updated_items = process_xml(xml_file, None, [item_id], nodes_to_update, nodes_to_skip)
                total_updated_items += updated_items
                processed_files += 1
    else:
        # Process only files matching IDs from the ids_to_process list
        print(f"Processing only files matching IDs from the list ({len(ids_to_process)} IDs)")
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
                updated_items = process_xml(xml_file, None, [item_id], nodes_to_update, nodes_to_skip)
                total_updated_items += updated_items
                processed_files += 1
            elif xml_file_with_zero and os.path.isfile(xml_file_with_zero):
                # Process the XML file
                updated_items = process_xml(xml_file_with_zero, None, [item_id], nodes_to_update, nodes_to_skip)
                total_updated_items += updated_items
                processed_files += 1
            elif os.path.isfile(xml_file_img):
                # Process the XML file
                updated_items = process_xml(xml_file_img, None, [item_id], nodes_to_update, nodes_to_skip)
                total_updated_items += updated_items
                processed_files += 1
            elif xml_file_with_zero_img and os.path.isfile(xml_file_with_zero_img):
                # Process the XML file
                updated_items = process_xml(xml_file_with_zero_img, None, [item_id], nodes_to_update, nodes_to_skip)
                total_updated_items += updated_items
                processed_files += 1

    return total_updated_items, processed_files

def main():
    # Check if command-line arguments were provided
    use_config_vars = len(sys.argv) == 1

    if use_config_vars:
        # Use configuration variables from the top of the script
        folder = BASE_FOLDER
        ids_file = IDS_FILE
        config_file = CONFIG_FILE
        process_all_files = PROCESS_ALL_FILES
    else:
        # Use command-line arguments
        parser = argparse.ArgumentParser(description='Strip XML nodes for specified item IDs in a folder of XML files.')
        parser.add_argument('--folder', required=True, 
                           help='Path to the folder containing XML files to update.')
        parser.add_argument('--ids_file', required=False, 
                           help='Path to the file containing comma-separated or line-by-line IDs to process.')
        parser.add_argument('--config', required=True, 
                           help='Path to the JSON configuration file with nodes to update/skip.')
        parser.add_argument('--all', action='store_true',
                           help='Process all XML files in the folder instead of only those matching IDs from the ids_file.')

        args = parser.parse_args()

        folder = args.folder
        config_file = args.config
        process_all_files = args.all

        # If --all is specified, ids_file is optional
        if not process_all_files and not args.ids_file:
            parser.error("--ids_file is required when not using --all")
            return

        ids_file = args.ids_file if not process_all_files else None

    # Read IDs to process if not processing all files
    ids_to_process = []
    if not process_all_files:
        ids_to_process = read_ids_file(ids_file)
        if not ids_to_process:
            print("No IDs found to process.")
            return

    # Read configuration
    try:
        with open(config_file, 'r') as f:
            config = json.load(f)

        nodes_to_update = config.get('update', {})
        nodes_to_skip = config.get('skip', [])

        print(f"Nodes to update: {', '.join(nodes_to_update.keys())}")
        print(f"Nodes to skip: {', '.join(nodes_to_skip)}")

    except Exception as e:
        print(f"Error reading configuration file: {e}")
        return

    # Process the folder
    print(f"\n=== Processing folder: {folder} ===")
    print(f"Mode: {'All files' if process_all_files else 'Only files matching IDs from the list'}")

    # Process the folder of XML files
    total_updated_items, processed_files = process_folder(
        folder, ids_to_process, nodes_to_update, nodes_to_skip, process_all_files
    )

    if total_updated_items > 0:
        print(f"Updated {total_updated_items} files with changes in {folder}")

    # Print summary
    print(f"\n=== Summary ===")
    print(f"Processed {processed_files} files in total")
    print(f"Updated {total_updated_items} files with changes in total")

if __name__ == "__main__":
    main()