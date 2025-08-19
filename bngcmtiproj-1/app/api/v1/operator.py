from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select
from app.api.deps import require_role
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.inventory import ToolInventory
from app.schemas.inventory import ToolListItem

router = APIRouter()

@router.get("/test")
def test():
    return {"status": "operator router loaded"}


# New /tools endpoint: returns only fields present in ToolInventory
@router.get("/tools", response_model=list[ToolListItem])
def list_available_tools(db: OrmSession = Depends(get_db)):
    tools = db.execute(
        select(ToolInventory)
        .order_by(ToolInventory.tool_name.asc())
    ).scalars().all()
    result = [
        ToolListItem(
            id=t.id,
            tool_name=t.tool_name,
            range_mm=t.range_mm,
            identification_code=t.identification_code,
            make=t.make,
            quantity=t.quantity,
            location=None,
            gauge=None,
            remarks=None,
            added_at=t.added_at
        ) for t in tools
    ]
    return result