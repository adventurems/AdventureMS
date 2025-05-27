"""
ImportHighVersionCashItems.py

Purpose:
    This script processes XML files containing item data. It's designed to help import
    high-version cash items from one set of XML files to another, while preserving
    necessary data and updating item strings.

How it works:
    1. Scans a source directory for XML files with cash=1
    2. Skips files that exist in both the source directory and the skip directory
    3. Removes all _outlink nodes from these files
    4. Copies bytedata, width, and height values from matching files in a reference directory
    5. If no matching file exists, uses the file referenced in _outlink
    6. Preserves vector origin values in the output files
    7. Saves the updated files to an output directory
    8. Creates a text file in the output directory listing all processed item IDs
    9. Copies item name and description strings from a source strings file to a target strings file

Configuration:
    Before running the script, modify the configuration variables below to set the paths
    for your specific environment:
    - ITEM_TYPE: The type of item being processed (e.g., "Coat", "Cap", etc.)
    - SOURCE_DIR: Folder containing XML files to check for cash=1
    - REFERENCE_DIR: Folder containing XML files with bytedata to copy
    - SKIP_DIR: Folder containing files that should be skipped if they exist in SOURCE_DIR
    - OUTPUT_DIR: Folder where updated XML files will be saved
    - STRINGS_SOURCE: XML file containing item name and description strings to copy from
    - STRINGS_TARGET: XML file where item name and description strings will be copied to

Usage:
    1. Set the configuration variables below
    2. Run the script: python ImportHighVersionCashItems.py
    3. Check the output directory for processed files
"""

import os
import xml.etree.ElementTree as ET
import xml.dom.minidom
import shutil
import re

def _write_element(file, element, indent=0):
    """
    Write an XML element to a file with proper indentation

    Args:
        file: The file object to write to
        element: The XML element to write
        indent: The current indentation level (number of spaces)
    """
    # Create indentation string
    indent_str = ' ' * indent

    # Write opening tag with attributes
    file.write(f'{indent_str}<{element.tag}')
    for attr, value in element.attrib.items():
        file.write(f' {attr}="{value}"')

    # Check if element has children or text
    if len(element) > 0 or (element.text and element.text.strip()):
        # Close opening tag
        file.write('>\n')

        # Write text content if any
        if element.text and element.text.strip():
            file.write(f'{indent_str}    {element.text.strip()}\n')

        # Write child elements
        for child in element:
            _write_element(file, child, indent + 4)

        # Write closing tag
        file.write(f'{indent_str}</{element.tag}>\n')
    else:
        # Self-closing tag with space before closing bracket
        file.write(' />\n')

# Configuration - Set these paths before running the script
# =====================================================================
# ITEM_TYPE: The type of item being processed (e.g., "Coat", "Cap", etc.)
# SOURCE_DIR: Folder containing XML files to check for cash=1
# REFERENCE_DIR: Folder containing XML files with bytedata to copy
# SKIP_DIR: Folder containing files that should be skipped if they exist in SOURCE_DIR
# OUTPUT_DIR: Folder where updated XML files will be saved
# STRINGS_SOURCE: XML file containing item name and description strings to copy from
# STRINGS_TARGET: XML file where item name and description strings will be copied to
# =====================================================================

# Set the item type (e.g., "Longcoat", "Coat", "Cap", etc.)
ITEM_TYPE = "Coat"

SOURCE_DIR = r"path/to/source/directory"  # The wz files with coords and such
REFERENCE_DIR = r"path/to/reference/directory"  # The canvas files
SKIP_DIR = r"path/to/skip/directory"  # Your current wz directory (will skip these)
OUTPUT_DIR = r"path/to/output/directory"  # Where you want the new imgs to go
STRINGS_SOURCE = r"path/to/source/strings.xml"  # Source file for item strings
STRINGS_TARGET = r"path/to/target/strings.xml"  # Target file for item strings

def ensure_directory_exists(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def parse_xml_file(file_path):
    """Parse an XML file and return the root element"""
    try:
        tree = ET.parse(file_path)
        return tree, tree.getroot()
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return None, None

def is_cash_item(root):
    """Check if the item has cash=1"""
    try:
        # Look for the cash node in the info section
        for info in root.findall("./imgdir[@name='info']"):
            for cash_node in info.findall("./int[@name='cash']"):
                if cash_node.get("value") == "1":
                    return True
        return False
    except Exception as e:
        print(f"Error checking cash value: {e}")
        return False

def extract_outlink_info(outlink_value):
    """
    Extract the file ID and path from an outlink value
    Example: "Character/Coat/_Canvas/01042452.img/info/icon"
    Returns: (file_id, path) tuple, e.g., ("01042452", "info/icon")
    """
    # Only extract if it points to another XML file (contains .img)
    match = re.search(r'(\d+)\.img/(.*)', outlink_value)
    if match:
        file_id = match.group(1)
        path = match.group(2)
        return file_id, path
    return None, None

def remove_outlink_nodes(root):
    """Remove all _outlink nodes from the XML"""
    # We need to find all parents that contain _outlink nodes
    for parent in root.findall(".//*"):
        for child in list(parent):
            if child.tag == "string" and child.get("name") == "_outlink":
                parent.remove(child)

def find_canvas_by_path(root, path, canvas_name):
    """
    Find a canvas element in the XML tree using a path and canvas name
    Example path: "info/icon" would look for a canvas named "icon" under an imgdir named "info"
    """
    # Split the path into components
    components = path.split('/')

    # Start with the root element
    current = root

    # Navigate through each component of the path
    for i, component in enumerate(components):
        if i == len(components) - 1:
            # Last component should be the canvas name
            if component == canvas_name:
                # Look for canvas with this name under the current element
                for canvas in current.findall(f"./canvas[@name='{canvas_name}']"):
                    return canvas
        else:
            # Look for imgdir with this name
            found = False
            for imgdir in current.findall(f"./imgdir[@name='{component}']"):
                current = imgdir
                found = True
                break

            if not found:
                # Path component not found
                return None

    # If we get here, we didn't find the canvas
    return None

def copy_bytedata(source_root, target_root, outlinks=None):
    """
    Copy bytedata values from source to target

    Args:
        source_root: The root element of the source XML
        target_root: The root element of the target XML
        outlinks: Optional dictionary mapping canvas elements to their outlink info
    """
    # Find all canvas elements with bytedata in the target
    for target_canvas in target_root.findall(".//canvas[@bytedata]"):
        canvas_name = target_canvas.get("name")

        # Check if this canvas has an outlink
        outlink_value = None
        for outlink in target_canvas.findall("./string[@name='_outlink']"):
            outlink_value = outlink.get("value")
            break

        if outlink_value:
            # Extract file ID and path from the outlink
            file_id, path = extract_outlink_info(outlink_value)

            if not file_id:
                # This outlink doesn't point to an XML file, so don't change the bytedata
                continue

            # If we have outlinks dictionary and this is for a different file,
            # we'll handle it in the process_file function
            if outlinks is not None:
                outlinks[target_canvas] = (file_id, path, outlink_value)
                continue

            # If source_root is None, we can't copy bytedata
            if source_root is None:
                continue

            # Try to find the canvas in the source using the path
            if path:
                # The last component of the path should be the canvas name
                path_components = path.split('/')
                if path_components[-1] == canvas_name:
                    # Remove the canvas name from the path
                    parent_path = '/'.join(path_components[:-1])

                    # Build an XPath to find the canvas
                    xpath = f".//{'/'.join([f'imgdir[@name=\'{comp}\']' for comp in parent_path.split('/')])}/canvas[@name='{canvas_name}']"
                    matching_canvases = source_root.findall(xpath)

                    if matching_canvases:
                        # Use the first match
                        source_canvas = matching_canvases[0]
                        if source_canvas.get("bytedata"):
                            # Copy bytedata, width, and height attributes
                            target_canvas.set("bytedata", source_canvas.get("bytedata"))
                            if source_canvas.get("width"):
                                target_canvas.set("width", source_canvas.get("width"))
                            if source_canvas.get("height"):
                                target_canvas.set("height", source_canvas.get("height"))
                            print(f"Copied bytedata, width, and height for {canvas_name} using outlink path {path}")
                            continue

        # If we don't have an outlink or couldn't find the canvas using the outlink,
        # fall back to the original method

        # If source_root is None, we can't copy bytedata
        if source_root is None:
            continue

        # Try to find a matching canvas in the source
        # First, look for canvas with the same name and parent name
        parent_name = None
        for parent in target_root.findall(".//*"):
            for child in parent:
                if child is target_canvas:
                    parent_name = parent.get("name")
                    break
            if parent_name:
                break

        # If we have parent name, try to find a matching canvas in the source
        if parent_name and canvas_name:
            # Look for canvas with same name under parent with same name
            xpath = f".//imgdir[@name='{parent_name}']/canvas[@name='{canvas_name}']"
            matching_canvases = source_root.findall(xpath)

            if matching_canvases:
                # Use the first match
                source_canvas = matching_canvases[0]
                if source_canvas.get("bytedata"):
                    # Copy bytedata, width, and height attributes
                    target_canvas.set("bytedata", source_canvas.get("bytedata"))
                    if source_canvas.get("width"):
                        target_canvas.set("width", source_canvas.get("width"))
                    if source_canvas.get("height"):
                        target_canvas.set("height", source_canvas.get("height"))
                    print(f"Copied bytedata, width, and height for {canvas_name} in {parent_name} using parent/name match")
                    continue

        # If we couldn't find a match by parent/name, try just by name
        if canvas_name:
            xpath = f".//canvas[@name='{canvas_name}']"
            matching_canvases = source_root.findall(xpath)

            if matching_canvases:
                # Use the first match
                source_canvas = matching_canvases[0]
                if source_canvas.get("bytedata"):
                    # Copy bytedata, width, and height attributes
                    target_canvas.set("bytedata", source_canvas.get("bytedata"))
                    if source_canvas.get("width"):
                        target_canvas.set("width", source_canvas.get("width"))
                    if source_canvas.get("height"):
                        target_canvas.set("height", source_canvas.get("height"))
                    print(f"Copied bytedata, width, and height for {canvas_name} using name-only match")
                    continue

        if source_root is not None:
            print(f"Warning: Could not find matching bytedata for {canvas_name}")

def process_file(file_path, reference_dir, output_dir):
    """Process a single XML file (assumes it's already been checked as a cash item)"""
    file_name = os.path.basename(file_path)
    print(f"Processing cash item: {file_name}...")

    # Parse the XML file
    tree, root = parse_xml_file(file_path)
    if root is None:
        return None

    # Collect all canvas elements with outlinks
    canvas_outlinks = {}

    # First pass: collect all outlinks
    copy_bytedata(None, root, canvas_outlinks)

    # Group outlinks by file_id for easier processing
    outlinks_by_file = {}
    for canvas, (file_id, path, outlink_value) in canvas_outlinks.items():
        if file_id not in outlinks_by_file:
            outlinks_by_file[file_id] = []
        outlinks_by_file[file_id].append((canvas, path, outlink_value))

    # Try to find the reference file in the second folder
    item_id = os.path.splitext(file_name)[0]  # Remove .img.xml extension
    if item_id.endswith(".img"):
        item_id = item_id[:-4]  # Remove .img suffix if present

    reference_file = os.path.join(reference_dir, f"{item_id}.img.xml")

    # Process the main reference file first
    if os.path.exists(reference_file):
        print(f"Using reference file: {reference_file}")
        _, reference_root = parse_xml_file(reference_file)
        if reference_root is not None:
            # Copy bytedata from the reference file to the target
            copy_bytedata(reference_root, root)
    else:
        print(f"Reference file not found: {reference_file}")

    # Process outlinks to other files
    for file_id, outlinks in outlinks_by_file.items():
        outlink_file = os.path.join(reference_dir, f"{file_id}.img.xml")
        if os.path.exists(outlink_file):
            print(f"Processing outlinks to {file_id}.img.xml")
            _, outlink_root = parse_xml_file(outlink_file)
            if outlink_root is not None:
                # Process each canvas with an outlink to this file
                for canvas, path, outlink_value in outlinks:
                    # Try to find the canvas in the outlink file using the path
                    if path:
                        path_components = path.split('/')
                        canvas_name = canvas.get("name")

                        # Check if the last component matches the canvas name
                        if path_components[-1] == canvas_name:
                            # Remove the canvas name from the path
                            parent_path = '/'.join(path_components[:-1])

                            # Build an XPath to find the canvas
                            if parent_path:
                                xpath = f".//{'/'.join([f'imgdir[@name=\'{comp}\']' for comp in parent_path.split('/')])}/canvas[@name='{canvas_name}']"
                            else:
                                xpath = f".//canvas[@name='{canvas_name}']"

                            matching_canvases = outlink_root.findall(xpath)

                            if matching_canvases:
                                # Use the first match
                                source_canvas = matching_canvases[0]
                                if source_canvas.get("bytedata"):
                                    # Copy bytedata, width, and height attributes
                                    canvas.set("bytedata", source_canvas.get("bytedata"))
                                    if source_canvas.get("width"):
                                        canvas.set("width", source_canvas.get("width"))
                                    if source_canvas.get("height"):
                                        canvas.set("height", source_canvas.get("height"))
                                    print(f"Copied bytedata, width, and height for {canvas_name} using outlink path {path}")
                                    continue

                        # If we couldn't find the canvas using the exact path, try a more flexible approach
                        # This handles cases where the path might not be exactly as specified in the outlink
                        canvas_name = canvas.get("name")
                        xpath = f".//canvas[@name='{canvas_name}']"
                        matching_canvases = outlink_root.findall(xpath)

                        if matching_canvases:
                            # Use the first match
                            source_canvas = matching_canvases[0]
                            if source_canvas.get("bytedata"):
                                # Copy bytedata, width, and height attributes
                                canvas.set("bytedata", source_canvas.get("bytedata"))
                                if source_canvas.get("width"):
                                    canvas.set("width", source_canvas.get("width"))
                                if source_canvas.get("height"):
                                    canvas.set("height", source_canvas.get("height"))
                                print(f"Copied bytedata, width, and height for {canvas_name} using name-only match from outlink file")
                                continue
        else:
            print(f"Outlink file not found: {outlink_file}")

    # Remove all _outlink nodes
    remove_outlink_nodes(root)

    # Save the modified file to the output directory with proper formatting
    output_file = os.path.join(output_dir, file_name)

    # Write the XML to file with consistent formatting
    with open(output_file, "w", encoding="UTF-8") as f:
        # Write XML declaration
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')

        # Write the root element
        f.write(f'<{root.tag}')
        for attr, value in root.attrib.items():
            f.write(f' {attr}="{value}"')
        f.write('>\n')

        # Write child elements with proper indentation
        for child in root:
            _write_element(f, child, indent=4)

        # Close root element
        f.write(f'</{root.tag}>\n')

    print(f"Saved updated file to {output_file}")

    return item_id

def find_item_string_block(source_root, item_id):
    """
    Find and extract an item block from the source strings file

    Args:
        source_root: The root element of the source strings XML
        item_id: The ID of the item to find

    Returns:
        The item block element if found, None otherwise
    """
    # Strip leading zeros from the item ID
    # In the source strings file, IDs don't have leading zeros (e.g., "1040000" instead of "01040000")
    item_id_no_zeros = item_id.lstrip('0')

    # Look for the item block in all categories (Cap, Coat, etc.)
    for category in source_root.findall("./imgdir[@name='Eqp']/imgdir"):
        item_block = category.find(f"./imgdir[@name='{item_id_no_zeros}']")
        if item_block is not None:
            return item_block

    return None

def copy_item_strings(processed_ids):
    """
    Copy item strings from source to target for all processed item IDs

    Args:
        processed_ids: List of item IDs to copy strings for

    Returns:
        Number of items successfully copied
    """
    print("\nCopying item strings...")

    # Parse the source file
    source_tree, source_root = parse_xml_file(STRINGS_SOURCE)
    if source_root is None:
        print("Error: Could not parse source strings file")
        return 0

    # Read the target file as text to preserve its exact formatting
    try:
        with open(STRINGS_TARGET, 'r', encoding='UTF-8') as f:
            target_content = f.read()
    except Exception as e:
        print(f"Error reading target strings file: {e}")
        return 0

    # Create a backup of the original file
    backup_file = STRINGS_TARGET + ".bak"
    try:
        with open(backup_file, 'w', encoding='UTF-8') as f:
            f.write(target_content)
        print(f"Created backup of original file: {backup_file}")
    except Exception as e:
        print(f"Warning: Could not create backup file: {e}")

    # Parse the target file for manipulation
    target_tree, target_root = parse_xml_file(STRINGS_TARGET)
    if target_root is None:
        print("Error: Could not parse target strings file")
        return 0

    # Count of successfully copied items
    copied_items = 0

    # Sort the processed IDs to insert them in ascending order
    processed_ids.sort()

    # Collect all the items we need to add
    items_to_add = []
    for item_id in processed_ids:
        # Strip leading zeros for searching in the source file
        item_id_no_zeros = item_id.lstrip('0')

        # Find the item block in the source file
        source_block = find_item_string_block(source_root, item_id)

        if source_block is not None:
            # Determine which category this item belongs to
            parent = None
            for p in source_root.findall(".//imgdir"):
                if source_block in p:
                    parent = p
                    break

            if parent is not None:
                category_name = parent.get("name")

                # Format the item block with the correct indentation and spacing
                item_xml = f'            <imgdir name="{item_id_no_zeros}">\n'

                # Add all string elements
                for string_elem in source_block.findall("./string"):
                    name = string_elem.get("name")
                    value = string_elem.get("value")
                    item_xml += f'                <string name="{name}" value="{value}" />\n'

                item_xml += '            </imgdir>\n'

                items_to_add.append((category_name, item_id_no_zeros, item_xml))
                copied_items += 1
                print(f"Prepared strings for item {item_id}")
            else:
                print(f"Warning: Could not determine category for item {item_id}")
        else:
            print(f"Warning: Could not find strings for item {item_id}")

    # Group items by category for more efficient processing
    items_by_category = {}
    for category_name, item_id, item_xml in items_to_add:
        if category_name not in items_by_category:
            items_by_category[category_name] = []
        items_by_category[category_name].append((item_id, item_xml))

    # Now insert the items into the target content, one category at a time
    for category_name, category_items in items_by_category.items():
        # Find the category section in the target content
        category_start = target_content.find(f'<imgdir name="{category_name}">')
        if category_start == -1:
            print(f"Warning: Could not find category {category_name} in target file")
            continue

        # Find the end of the category section
        # We need to find the matching closing tag for this category
        # Count opening and closing tags to find the correct one
        open_count = 1  # Start with 1 for the category opening tag
        search_pos = category_start + len(f'<imgdir name="{category_name}">')
        category_end = -1

        while search_pos < len(target_content):
            open_tag = target_content.find('<imgdir', search_pos)
            close_tag = target_content.find('</imgdir>', search_pos)

            # If no more tags found or close tag is beyond the end of the file
            if open_tag == -1 and close_tag == -1:
                break

            # If we find an opening tag before a closing tag
            if open_tag != -1 and (close_tag == -1 or open_tag < close_tag):
                open_count += 1
                search_pos = open_tag + 7  # Length of '<imgdir'
            # If we find a closing tag
            elif close_tag != -1:
                open_count -= 1
                search_pos = close_tag + 9  # Length of '</imgdir>'

                # If we've found the matching closing tag for our category
                if open_count == 0:
                    category_end = close_tag
                    break

        if category_end == -1:
            print(f"Warning: Could not find end of category {category_name} in target file")
            continue

        # Sort items by ID for consistent ordering
        category_items.sort(key=lambda x: int(x[0]))

        # Build a single string with all items for this category
        all_items_xml = ""
        for item_id, item_xml in category_items:
            # Check if the item already exists
            item_start = target_content.find(f'<imgdir name="{item_id}">', category_start, category_end)
            if item_start != -1:
                # Find the end of the existing item using the same tag counting approach
                open_count = 1  # Start with 1 for the item opening tag
                search_pos = item_start + len(f'<imgdir name="{item_id}">')
                item_end = -1

                while search_pos < category_end:
                    open_tag = target_content.find('<imgdir', search_pos, category_end)
                    close_tag = target_content.find('</imgdir>', search_pos, category_end)

                    # If no more tags found or both are beyond the category end
                    if (open_tag == -1 or open_tag >= category_end) and (close_tag == -1 or close_tag >= category_end):
                        break

                    # If we find an opening tag before a closing tag
                    if open_tag != -1 and (close_tag == -1 or open_tag < close_tag) and open_tag < category_end:
                        open_count += 1
                        search_pos = open_tag + 7  # Length of '<imgdir'
                    # If we find a closing tag
                    elif close_tag != -1 and close_tag < category_end:
                        open_count -= 1
                        search_pos = close_tag + 9  # Length of '</imgdir>'

                        # If we've found the matching closing tag for our item
                        if open_count == 0:
                            item_end = close_tag + 9  # Include the closing tag
                            break

                if item_end != -1:
                    # Remove the existing item
                    target_content = target_content[:item_start] + target_content[item_end:]

                    # We need to recalculate the category end since we removed content
                    # Use the same tag counting approach to find the new category end
                    open_count = 1  # Start with 1 for the category opening tag
                    search_pos = category_start + len(f'<imgdir name="{category_name}">')
                    category_end = -1

                    while search_pos < len(target_content):
                        open_tag = target_content.find('<imgdir', search_pos)
                        close_tag = target_content.find('</imgdir>', search_pos)

                        # If no more tags found
                        if open_tag == -1 and close_tag == -1:
                            break

                        # If we find an opening tag before a closing tag
                        if open_tag != -1 and (close_tag == -1 or open_tag < close_tag):
                            open_count += 1
                            search_pos = open_tag + 7  # Length of '<imgdir'
                        # If we find a closing tag
                        elif close_tag != -1:
                            open_count -= 1
                            search_pos = close_tag + 9  # Length of '</imgdir>'

                            # If we've found the matching closing tag for our category
                            if open_count == 0:
                                category_end = close_tag
                                break

                    if category_end == -1:
                        print(f"Warning: Could not find end of category {category_name} after removing item {item_id}")
                        continue

            # Add this item to the combined XML
            all_items_xml += item_xml

        # Find the last item in the category
        last_item_end = -1

        # Look for the last </imgdir> before the category end
        search_pos = category_start
        while True:
            item_end = target_content.find('</imgdir>', search_pos, category_end)
            if item_end == -1 or item_end >= category_end:
                break
            last_item_end = item_end + len('</imgdir>')
            search_pos = last_item_end

        # If we found a last item, insert after it
        if last_item_end != -1:
            # Find the next line after the last item
            next_line = target_content.find('\n', last_item_end)
            if next_line != -1 and next_line < category_end:
                insert_pos = next_line + 1  # +1 to insert after the newline
            else:
                # If no newline found, insert directly after the last item
                insert_pos = last_item_end
        else:
            # No items found, insert just before the category end tag
            # Find the last newline before the category end
            insert_pos = target_content.rfind('\n', category_start, category_end)
            if insert_pos == -1 or insert_pos <= category_start:
                # If no newline found, insert directly before the category end tag
                insert_pos = category_end

        target_content = target_content[:insert_pos] + all_items_xml + target_content[insert_pos:]

        print(f"Inserted {len(category_items)} items into category {category_name}")

    # Write the updated content back to the file
    try:
        with open(STRINGS_TARGET, 'w', encoding='UTF-8') as f:
            f.write(target_content)
        print(f"Saved updated strings to {STRINGS_TARGET} (preserved original formatting)")
    except Exception as e:
        print(f"Error updating target file: {e}")
        # Restore from backup if something went wrong
        try:
            shutil.copy2(backup_file, STRINGS_TARGET)
            print(f"Restored original file from backup")
        except Exception as e2:
            print(f"Error restoring from backup: {e2}")

    return copied_items

def main():
    """Main function to process all files"""
    print("\nStarting to process files...")

    # Ensure the output directory exists
    ensure_directory_exists(OUTPUT_DIR)
    print(f"Output directory created/verified: {OUTPUT_DIR}")

    # Count variables for summary
    total_files = 0
    cash_files = 0
    skipped_files = 0
    removed_files = 0

    # List to store processed item IDs
    processed_ids = []

    # Parse the source strings file once
    source_tree, source_root = parse_xml_file(STRINGS_SOURCE)
    if source_root is None:
        print("Error: Could not parse source strings file")
        return

    # Process all XML files in the source directory
    for file_name in os.listdir(SOURCE_DIR):
        if file_name.endswith(".img.xml"):
            total_files += 1
            file_path = os.path.join(SOURCE_DIR, file_name)

            # Check if the file exists in the skip directory
            skip_file_path = os.path.join(SKIP_DIR, file_name)
            if os.path.exists(skip_file_path):
                print(f"Skipping file (exists in skip directory): {file_name}")
                skipped_files += 1
                continue

            # Check if it's a cash item before processing
            tree, root = parse_xml_file(file_path)
            if root is not None and is_cash_item(root):
                cash_files += 1
                item_id = process_file(file_path, REFERENCE_DIR, OUTPUT_DIR)
                if item_id:
                    # Check if strings exist for this item
                    item_block = find_item_string_block(source_root, item_id)
                    if item_block is not None:
                        processed_ids.append(item_id)
                    else:
                        # Remove the output file if strings don't exist
                        output_file = os.path.join(OUTPUT_DIR, file_name)
                        if os.path.exists(output_file):
                            os.remove(output_file)
                            print(f"Removed output file for item {item_id} (no strings available)")
                            removed_files += 1

    # Write processed item IDs to a text file in the output directory
    if processed_ids:
        ids_file_path = os.path.join(OUTPUT_DIR, "processed_item_ids.txt")
        with open(ids_file_path, 'w') as f:
            for item_id in processed_ids:
                # Remove leading zeros when writing to the file
                item_id_no_zeros = item_id.lstrip('0')
                f.write(f"{item_id_no_zeros}\n")
        print(f"Created list of processed item IDs: {ids_file_path}")

    # Copy item strings if we have processed any items
    copied_items = 0
    if processed_ids:
        copied_items = copy_item_strings(processed_ids)

    # Print summary
    print("\nProcessing Summary:")
    print(f"Total files scanned: {total_files}")
    print(f"Files skipped (exist in skip directory): {skipped_files}")
    print(f"Cash items processed: {cash_files}")
    print(f"Files removed (no strings available): {removed_files}")
    print(f"Updated files saved to: {OUTPUT_DIR}")
    if processed_ids:
        print(f"List of processed item IDs saved to: {ids_file_path}")
        print(f"Item strings copied to target file: {copied_items}")

if __name__ == "__main__":
    print("Starting ImportHighVersionCashItems.py")
    print(f"Item type: {ITEM_TYPE}")
    print(f"Source directory: {SOURCE_DIR}")
    print(f"Reference directory: {REFERENCE_DIR}")
    print(f"Skip directory: {SKIP_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Strings source file: {STRINGS_SOURCE}")
    print(f"Strings target file: {STRINGS_TARGET}")
    main()
    print("Processing complete!")