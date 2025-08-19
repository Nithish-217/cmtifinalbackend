from app.db.session import get_db
from app.models.inventory import ToolInventory

def seed_tools():
    db = next(get_db())
    tools = [
        ToolInventory(name="Vernier Caliper", make="Mitutoyo", range_mm=150, location="A1", quantity_available=10),
        ToolInventory(name="Micrometer", make="Starrett", range_mm=25, location="B2", quantity_available=5),
        ToolInventory(name="Dial Gauge", make="Baker", range_mm=10, location="C3", quantity_available=8),
        ToolInventory(name="Height Gauge", make="Mitutoyo", range_mm=300, location="D4", quantity_available=3),
    ]
    for tool in tools:
        db.add(tool)
    db.commit()
    print("Seeded sample tools.")

if __name__ == "__main__":
    seed_tools()
