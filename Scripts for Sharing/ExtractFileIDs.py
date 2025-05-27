#!/usr/bin/env python
"""
ExtractFileIDs.py - Extract IDs from XML filenames and create a formatted list

Purpose:
    This script scans a directory for XML files with names in the format 'XXXXXXXX.img.xml',
    extracts the ID part, removes leading zeros, and creates a formatted text file with
    the IDs arranged in a specified number of items per line, each followed by a comma.

How it works:
    1. Scans a specified directory for XML files with .img.xml extension
    2. Extracts the numeric ID from each filename
    3. Removes leading zeros from each ID
    4. Sorts the IDs numerically
    5. Formats the IDs into a text file with a specified number of IDs per line

Input:
    - Directory containing XML files with names in the format 'XXXXXXXX.img.xml'
    - Optional command-line arguments for input directory, output file, and items per line

Output:
    - A text file containing the formatted list of IDs

Usage examples:
    python ExtractFileIDs.py
    python ExtractFileIDs.py --input "path/to/xml/files" --output "output.txt" --items-per-line 10
    python ExtractFileIDs.py -i "path/to/xml/files" -o "output.txt" -n 10
"""

import os
import re
import argparse
import sys

# Configure the input directory path here
INPUT_DIRECTORY = r"path/to/xml/files"

def extract_ids_from_filenames(directory_path):
    """
    Extract IDs from XML filenames in the specified directory.
    Returns a list of IDs with leading zeros removed.
    """
    # Get all files in the directory
    try:
        files = os.listdir(directory_path)
    except Exception as e:
        print(f"Error accessing directory: {e}")
        return []

    # Filter for XML files and extract IDs
    ids = []
    for filename in files:
        if filename.endswith('.img.xml'):
            # Extract the ID part (remove .img.xml)
            id_part = filename.replace('.img.xml', '')
            # Remove leading zeros
            id_part = id_part.lstrip('0')
            if id_part:  # Ensure we don't add empty strings
                ids.append(id_part)

    # Sort the IDs numerically
    ids.sort(key=int)

    return ids

def format_ids_for_output(ids, items_per_line=15):
    """
    Format the IDs list with the specified number of items per line,
    with a comma at the end of each line.
    """
    formatted_output = ""
    for i in range(0, len(ids), items_per_line):
        chunk = ids[i:i+items_per_line]
        line = ", ".join(chunk) + ","
        formatted_output += line + "\n"

    return formatted_output

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Extract IDs from XML filenames and create a formatted list.')
    parser.add_argument('--input', '-i', type=str, 
                        default=INPUT_DIRECTORY,
                        help='Directory containing the XML files')
    parser.add_argument('--output', '-o', type=str, 
                        help='Output file path (default: ExtractedIDs.txt in the current directory)')
    parser.add_argument('--items-per-line', '-n', type=int, default=15,
                        help='Number of items per line in the output (default: 15)')

    return parser.parse_args()

def main():
    # Parse command line arguments
    args = parse_arguments()

    # Validate input directory
    if not os.path.isdir(args.input):
        print(f"Error: Input directory '{args.input}' does not exist or is not a directory.")
        return 1

    # Set default output file if not specified
    output_file = args.output if args.output else os.path.join(os.getcwd(), "ExtractedIDs.txt")

    # Extract IDs from filenames
    ids = extract_ids_from_filenames(args.input)

    if not ids:
        print("No IDs found or directory is empty.")
        return 1

    # Format the IDs for output
    formatted_output = format_ids_for_output(ids, args.items_per_line)

    # Write to file
    try:
        # Ensure the output directory exists
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)

        with open(output_file, 'w') as f:
            f.write(formatted_output)
        print(f"Successfully extracted {len(ids)} IDs and saved to {output_file}")
    except Exception as e:
        print(f"Error writing to file: {e}")
        return 1

    # Print sample of output
    print("\nSample of formatted output:")
    print(formatted_output[:200] + "..." if len(formatted_output) > 200 else formatted_output)

    return 0

if __name__ == "__main__":
    sys.exit(main())