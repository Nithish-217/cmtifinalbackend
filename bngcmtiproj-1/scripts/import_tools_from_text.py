
print("[DEBUG] import_tools_from_text.py script started")
# This script parses a pasted text inventory and imports it into the Tool table.
# Place this file in scripts/import_tools_from_text.py and run it with your backend environment activated.

import os
import re
import sys

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.inventory import ToolInventory
from app.db.session import engine

def parse_inventory(text):
    # Split lines, skip empty lines
    lines = [l for l in text.splitlines() if l.strip()]
    tools = []
    for line in lines:
        # Try to split by tab or multiple spaces
        parts = re.split(r'\t| {2,}', line)
        # Remove empty strings
        parts = [p.strip() for p in parts if p.strip()]
        if len(parts) < 3:
            continue  # skip lines that are not data
        # Map columns: Sl no, Item Description, Range in mm, Identification Code, Make, Quantity, Location, Gauge, Remarks
        # Try to extract fields by position
        sl_no = parts[0]
        name = parts[1] if len(parts) > 1 else ''
        range_mm = parts[2] if len(parts) > 2 else ''
        identification_code = parts[3] if len(parts) > 3 else ''
        make = parts[4] if len(parts) > 4 else ''
        quantity = parts[5] if len(parts) > 5 else ''
        location = parts[6] if len(parts) > 6 else ''
        gauge = parts[7] if len(parts) > 7 else ''
        remarks = parts[8] if len(parts) > 8 else ''
        # Try to convert quantity to int
        try:
            quantity = int(re.sub(r'[^0-9]', '', quantity))
        except Exception:
            quantity = 0
        tool = dict(
            name=name,
            range_mm=range_mm,
            identification_code=identification_code,
            make=make,
            quantity_available=quantity,
            location=location,
            gauge=gauge,
            remarks=remarks
        )
        tools.append(tool)
    return tools

def import_tools(text):
    # Print the actual database URL being used
    print(f"[DEBUG] SQLAlchemy DB URL: {engine.url}")
    db: Session = SessionLocal()
    tools = parse_inventory(text)
    for t in tools:
        tool_name = t['name']
        quantity = t['quantity_available']
        range_mm = t['range_mm']
        identification_code = t['identification_code']
        make = t['make']
        location = t['location']
        gauge = t['gauge']
        remarks = t['remarks']
        print(f"Processing: {tool_name}, qty={quantity}, range={range_mm}, id_code={identification_code}, make={make}, location={location}, gauge={gauge}, remarks={remarks}")
        if not tool_name:
            print("Skipping: No tool name")
            continue
        try:
            existing = db.query(ToolInventory).filter(ToolInventory.tool_name == tool_name).first()
            if existing:
                print(f"Updating existing tool: {tool_name}")
                existing.quantity = quantity
                existing.range_mm = range_mm
                existing.identification_code = identification_code
                existing.make = make
                existing.location = location
                existing.gauge = gauge
                existing.remarks = remarks
            else:
                print(f"Adding new tool: {tool_name}")
                tool_obj = ToolInventory(
                    tool_name=tool_name,
                    quantity=quantity,
                    range_mm=range_mm,
                    identification_code=identification_code,
                    make=make,
                    location=location,
                    gauge=gauge,
                    remarks=remarks
                )
                db.add(tool_obj)
        except Exception as e:
            print(f"Error processing {tool_name}: {e}")
    try:
        db.commit()
        print(f"Imported {len(tools)} tools.")
    except Exception as e:
        print(f"Commit failed: {e}")
    db.close()

if __name__ == "__main__":
    # Read the pasted text from a file or stdin
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        print("Paste your inventory text, then press Ctrl+D (Linux/Mac) or Ctrl+Z (Windows) and Enter:")
        text = sys.stdin.read()
    import_tools(text)
