import xml.etree.ElementTree as ET
import os
import argparse
import json
import sys
import xml.dom.minidom

"""
UpdateXMLNodesSingleFile.py

Purpose:
    This script processes a single XML file, updating and removing nodes for specific item IDs
    based on a configuration file. It's designed to help standardize XML files by
    updating specific nodes to standard values and removing unwanted nodes.

How it works:
    1. Reads a list of item IDs from a file (comma-separated or line-by-line)
    2. Reads a configuration file that specifies which nodes to update and which to remove
    3. Finds XML elements (imgdir) that match the specified IDs
    4. Updates nodes specified in the 'update' section of the config
    5. Removes nodes specified in the 'remove' section of the config
    6. Writes the modified XML to a new output file with proper formatting

Input:
    - XML file to process
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
    - Modified XML file with updated and removed nodes
    - Console output summarizing the changes made

Usage:
    1. Command-line mode:
       python UpdateXMLNodesSingleFile.py --xml_file "path/to/file.xml" --ids_file "path/to/ids.txt" --config "path/to/config.json" [--output_file "path/to/output.xml"]
    
    2. Configuration mode (modify the variables at the top of the script):
       python UpdateXMLNodesSingleFile.py
"""

# Configuration variables - modify these to run the script directly from IDE
# Set the paths for your files here
XML_FILE = r"path/to/your/input.xml"  # Path to the XML file to update
IDS_FILE = r"path/to/your/ids.txt"    # Path to the file containing IDs to process
CONFIG_FILE = r"path/to/your/config.json"  # Path to the JSON configuration file
OUTPUT_FILE = ""  # Specify output file or leave empty to use default (input filename + .modified)

def read_ids_file(file_path):
    """Read IDs from the file in comma-separated format."""
    ids_to_process = []
    try:
        with open(file_path, 'r') as f:
            # Read the file line by line
            for line in f:
                # Skip lines that don't contain any digits (e.g., header lines)
                if not any(c.isdigit() for c in line):
                    continue

                # Split by commas and process each ID
                for item_id in line.split(','):
                    # Strip whitespace and remove all commas
                    item_id = item_id.strip().replace(',', '')
                    if item_id:  # Only add non-empty IDs
                        ids_to_process.append(item_id)
        return ids_to_process
    except Exception as e:
        print(f"Error reading IDs file: {e}")
        return []

def process_xml(xml_file, output_file, ids_to_process, nodes_to_update, nodes_to_remove):
    """Process the XML file, updating and removing nodes as specified."""
    try:
        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Create sets for faster lookups - both with and without leading zeros
        ids_set = set(ids_to_process)
        # Also create a set with leading zeros for IDs that don't have them
        ids_set_with_zeros = set('0' + id if not id.startswith('0') else id for id in ids_to_process)

        # Counter for tracking changes
        updated_items = 0

        # Process each imgdir element that matches our IDs
        for imgdir in root.findall('.//imgdir'):
            name = imgdir.get('name')
            if name in ids_set or name in ids_set_with_zeros:
                # Found an item to process
                updated_items += 1
                print(f"Processing item: {name}")

                # Update or add nodes
                for node_name, node_value in nodes_to_update.items():
                    # Check if the node exists
                    node = imgdir.find(f'./string[@name="{node_name}"]')
                    if node is not None:
                        # Update existing node
                        node.set('value', str(node_value))
                        print(f"  Updated node {node_name} to {node_value}")
                    else:
                        # Add new node
                        new_node = ET.SubElement(imgdir, 'string')
                        new_node.set('name', node_name)
                        new_node.set('value', str(node_value))
                        print(f"  Added new node {node_name} with value {node_value}")

                # Remove nodes
                for node_name in nodes_to_remove:
                    node = imgdir.find(f'./string[@name="{node_name}"]')
                    if node is not None:
                        imgdir.remove(node)
                        print(f"  Removed node {node_name}")

        # Write the modified XML to the output file with proper formatting
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

        # Write the pretty-printed XML to the output file
        with open(output_file, 'w', encoding='UTF-8') as f:
            f.write(pretty_xml)

        return updated_items
    except Exception as e:
        print(f"Error processing XML file: {e}")
        return 0

def main():
    # Check if command-line arguments were provided
    use_config_vars = len(sys.argv) == 1

    if use_config_vars:
        # Use configuration variables from the top of the script
        xml_file = XML_FILE
        ids_file = IDS_FILE
        config_file = CONFIG_FILE
        output_file = OUTPUT_FILE

        # Set default output file if not provided
        if not output_file:
            base, ext = os.path.splitext(xml_file)
            output_file = f"{base}.modified{ext}"

        print("Using configuration variables from script.")
    else:
        # Use command-line arguments
        parser = argparse.ArgumentParser(description='Update XML nodes for specified item IDs.')
        parser.add_argument('--xml_file', required=True, help='Path to the XML file to update')
        parser.add_argument('--output_file', help='Path to save the modified XML file (default: adds .modified to input filename)')
        parser.add_argument('--ids_file', required=True, help='Path to the file containing comma-separated IDs to process')
        parser.add_argument('--config', required=True, help='Path to the JSON configuration file')

        args = parser.parse_args()

        xml_file = args.xml_file
        ids_file = args.ids_file
        config_file = args.config
        output_file = args.output_file

        # Set default output file if not provided
        if not output_file:
            base, ext = os.path.splitext(xml_file)
            output_file = f"{base}.modified{ext}"

    # Read IDs to process
    ids_to_process = read_ids_file(ids_file)
    if not ids_to_process:
        print("No IDs found to process.")
        return

    print(f"Found {len(ids_to_process)} IDs to process.")

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

    # Process the XML file
    updated_items = process_xml(xml_file, output_file, ids_to_process, nodes_to_update, nodes_to_remove)

    print(f"Processed XML file. Updated {updated_items} items.")
    print(f"Modified XML saved to {output_file}")

if __name__ == "__main__":
    main()