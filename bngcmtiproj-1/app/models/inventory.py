from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.db.base import Base


class ToolInventory(Base):
    __tablename__ = "tool_inventory"

    id = Column(Integer, primary_key=True, index=True)
    tool_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    added_at = Column(TIMESTAMP(timezone=True), nullable=False)
    range_mm = Column(String(100), nullable=True)
    identification_code = Column(String(100), nullable=True)
    make = Column(String(100), nullable=True)
