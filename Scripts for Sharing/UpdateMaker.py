import csv
import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import os

# Define the path for the CSV file - modify this to point to your CSV file
CSV_FILE_PATH = r"Maker Recipes.csv"  # Assumes the CSV file is in the same directory as the script

"""
UpdateMaker.py - Item Maker Recipe XML Generator

Purpose:
    This script converts crafting/maker recipes from a CSV file into an XML format used by the game.
    It reads recipe data from a CSV file, organizes items by categories, and generates a properly
    formatted XML structure with all the necessary properties and relationships.

How it works:
    1. Reads the CSV file with crafting recipes data
    2. Organizes items by their categories
    3. For each recipe, extracts:
       - Basic properties (reqLevel, reqSkillLevel, itemNum, tuc, meso)
       - Recipe ingredients (item IDs and quantities)
       - Random rewards (if applicable)
    4. Generates a properly formatted XML structure
    5. Writes the result to 'ItemMake.img.xml'

Expected CSV format:
    The CSV should contain columns for:
    - Category: The crafting category
    - ID: Item identifier (leading zeros preserved)
    - reqLevel: Required level to craft
    - reqSkillLevel: Required skill level
    - itemNum: Number of items produced
    - tuc: Times upgradeable count
    - meso: Cost in mesos (commas allowed)
    - catalyst: Optional catalyst item
    - reqItem: Required item ID
    - reqEquip: Required equipment ID
    - reqQuest.name: Required quest ID
    - reqQuest.value: Required quest value/state
    - hide: Hide flag
    - recipe.X.item: Recipe ingredient item ID
    - recipe.X.count: Recipe ingredient quantity
    - randomReward.X.item: Random reward item ID
    - randomReward.X.itemNum: Random reward quantity
    - randomReward.X.prob: Random reward probability

Output XML structure:
    <imgdir name="ItemMake.img">
        <imgdir name="[Category]">
            <imgdir name="[ItemID]">
                <int name="reqLevel" value="X"/>
                <int name="reqSkillLevel" value="X"/>
                <int name="itemNum" value="X"/>
                <int name="tuc" value="X"/>
                <int name="meso" value="X"/>
                <int name="catalyst" value="X"/> <!-- if present -->
                <int name="reqItem" value="X"/> <!-- if present -->
                <int name="reqEquip" value="X"/> <!-- if present -->
                <int name="hide" value="X"/> <!-- if present -->
                <imgdir name="reqQuest"> <!-- if present -->
                    <int name="[QuestID]" value="[QuestValue]"/>
                </imgdir>
                <imgdir name="recipe">
                    <imgdir name="0">
                        <int name="item" value="X"/>
                        <int name="count" value="X"/>
                    </imgdir>
                    <!-- Additional recipe entries -->
                </imgdir>
                <imgdir name="randomReward"> <!-- if present -->
                    <imgdir name="0">
                        <int name="item" value="X"/>
                        <int name="itemNum" value="X"/>
                        <int name="prob" value="X"/>
                    </imgdir>
                    <!-- Additional reward entries -->
                </imgdir>
            </imgdir>
        </imgdir>
    </imgdir>

Usage:
    1. Prepare a CSV file with the required columns (see 'Expected CSV format' above)
    2. Place the CSV file in the same directory as this script or update CSV_FILE_PATH
    3. Run the script: python UpdateMaker.py
    4. The script will generate ItemMake.img.xml in the same directory
"""


def create_xml_from_csv(csv_path, output_xml_path):
    # Create the root element
    root = ET.Element("imgdir")
    root.set("name", "ItemMake.img")

    # Dictionary to store category imgdirs
    categories = {}

    try:
        # Read the CSV file with explicit encoding
        with open(csv_path, 'r', encoding='utf-8-sig') as csv_file:
            # Print headers for debugging
            csv_reader = csv.DictReader(csv_file)
            headers = csv_reader.fieldnames
            print("Available columns:", headers)

            for row_num, row in enumerate(csv_reader, start=1):
                try:
                    # Get category
                    category = row['Category']

                    # Create category imgdir if it doesn't exist
                    if category not in categories:
                        category_imgdir = ET.SubElement(root, "imgdir")
                        category_imgdir.set("name", category)
                        categories[category] = category_imgdir
                    else:
                        category_imgdir = categories[category]

                    # Create item imgdir
                    item_id = row['ID']
                    if item_id.startswith('0'):
                        item_id = item_id  # Keep leading zeros
                    item_imgdir = ET.SubElement(category_imgdir, "imgdir")
                    item_imgdir.set("name", f"{item_id}")

                    # Add basic item properties
                    req_level = ET.SubElement(item_imgdir, "int")
                    req_level.set("name", "reqLevel")
                    req_level.set("value", row['reqLevel'])

                    req_skill_level = ET.SubElement(item_imgdir, "int")
                    req_skill_level.set("name", "reqSkillLevel")
                    req_skill_level.set("value", row['reqSkillLevel'])

                    item_num = ET.SubElement(item_imgdir, "int")
                    item_num.set("name", "itemNum")
                    item_num.set("value", row['itemNum'])

                    tuc = ET.SubElement(item_imgdir, "int")
                    tuc.set("name", "tuc")
                    tuc.set("value", row['tuc'])

                    # Remove commas from meso value
                    meso_value = row['meso'].replace(',', '')
                    meso = ET.SubElement(item_imgdir, "int")
                    meso.set("name", "meso")
                    meso.set("value", meso_value)

                    # Add catalyst if present
                    if row['catalyst'] and row['catalyst'].strip():
                        catalyst = ET.SubElement(item_imgdir, "int")
                        catalyst.set("name", "catalyst")
                        catalyst.set("value", row['catalyst'])

                    # Add reqItem if present
                    if 'reqItem' in row and row['reqItem'] and row['reqItem'].strip():
                        req_item = ET.SubElement(item_imgdir, "int")
                        req_item.set("name", "reqItem")
                        req_item.set("value", row['reqItem'])

                    # Add reqEquip if present
                    if 'reqEquip' in row and row['reqEquip'] and row['reqEquip'].strip():
                        req_equip = ET.SubElement(item_imgdir, "int")
                        req_equip.set("name", "reqEquip")
                        req_equip.set("value", row['reqEquip'])

                    # Add hide if present
                    if 'hide' in row and row['hide'] and row['hide'].strip():
                        hide = ET.SubElement(item_imgdir, "int")
                        hide.set("name", "hide")
                        hide.set("value", row['hide'])

                    # Add reqQuest if present
                    if 'reqQuest.name' in row and row['reqQuest.name'] and row['reqQuest.name'].strip() and 'reqQuest.value' in row and row['reqQuest.value'] and row['reqQuest.value'].strip():
                        req_quest_imgdir = ET.SubElement(item_imgdir, "imgdir")
                        req_quest_imgdir.set("name", "reqQuest")

                        quest_int = ET.SubElement(req_quest_imgdir, "int")
                        quest_int.set("name", row['reqQuest.name'])
                        quest_int.set("value", row['reqQuest.value'])

                    # Process recipe entries
                    recipe_imgdir = ET.SubElement(item_imgdir, "imgdir")
                    recipe_imgdir.set("name", "recipe")

                    recipe_index = 0
                    while True:
                        item_key = f'recipe.{recipe_index}.item'
                        count_key = f'recipe.{recipe_index}.count'

                        if item_key not in row or not row[item_key] or row[item_key].strip() == '':
                            break

                        recipe_entry = ET.SubElement(recipe_imgdir, "imgdir")
                        recipe_entry.set("name", str(recipe_index))

                        item_element = ET.SubElement(recipe_entry, "int")
                        item_element.set("name", "item")
                        item_element.set("value", row[item_key])

                        count_element = ET.SubElement(recipe_entry, "int")
                        count_element.set("name", "count")
                        count_element.set("value", row[count_key])

                        recipe_index += 1

                    # Process randomReward entries if present
                    random_reward_index = 0
                    random_reward_keys = [key for key in row.keys() if key.startswith('randomReward')]

                    if any(row[key] and row[key].strip() for key in random_reward_keys):
                        random_reward_imgdir = ET.SubElement(item_imgdir, "imgdir")
                        random_reward_imgdir.set("name", "randomReward")

                        while True:
                            item_key = f'randomReward.{random_reward_index}.item'
                            item_num_key = f'randomReward.{random_reward_index}.itemNum'
                            prob_key = f'randomReward.{random_reward_index}.prob'

                            if item_key not in row or not row[item_key] or row[item_key].strip() == '':
                                break

                            reward_entry = ET.SubElement(random_reward_imgdir, "imgdir")
                            reward_entry.set("name", str(random_reward_index))

                            item_element = ET.SubElement(reward_entry, "int")
                            item_element.set("name", "item")
                            item_element.set("value", row[item_key])

                            item_num_element = ET.SubElement(reward_entry, "int")
                            item_num_element.set("name", "itemNum")
                            item_num_element.set("value", row[item_num_key])

                            prob_element = ET.SubElement(reward_entry, "int")
                            prob_element.set("name", "prob")
                            prob_element.set("value", row[prob_key])

                            random_reward_index += 1

                except KeyError as e:
                    print(f"Error processing row {row_num}: Missing column {e}")
                    print("Row data:", dict(row))
                    raise

    except Exception as e:
        print(f"Error reading CSV file: {str(e)}")
        raise

    # Create a pretty-printed XML string
    rough_string = ET.tostring(root, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    pretty_xml = reparsed.toprettyxml(indent="    ")

    # Remove extra blank lines and the extra XML declaration that minidom adds
    pretty_xml_lines = [line for line in pretty_xml.split('\n') if line.strip()]
    # Remove the XML declaration that minidom adds
    if pretty_xml_lines[0].startswith('<?xml'):
        pretty_xml_lines = pretty_xml_lines[1:]
    pretty_xml = '\n'.join(pretty_xml_lines)

    # Write to file with our own XML declaration
    with open(output_xml_path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
        f.write(pretty_xml)

    print(f"XML file created successfully at {output_xml_path}")


def main():
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, CSV_FILE_PATH)
    output_xml_path = os.path.join(script_dir, "ItemMake.img.xml")

    # Create XML from CSV
    create_xml_from_csv(csv_path, output_xml_path)


if __name__ == "__main__":
    main()