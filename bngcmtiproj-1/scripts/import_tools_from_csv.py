import csv
from app.db.session import SessionLocal
from app.models.inventory import ToolInventory

# Delete all existing tools
db = SessionLocal()
db.query(ToolInventory).delete()
db.commit()

# Import from CSV
with open(r'C:/Users/srisa/Downloads/Annotated (1).csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        tool = ToolInventory(
            tool_name=row.get('Label', ''),
            quantity=int(row.get('3', 0)),
            range_mm=str(row.get('11', '')),
            identification_code=str(row.get('Id', '')),
            make=str(row.get('Label', '')),
            location=str(row.get('440', '')),
            gauge=str(row.get('114', '')),
            remarks=str(row.get('437', ''))
        )
        db.add(tool)
    db.commit()
db.close()
print('CSV import complete.')
