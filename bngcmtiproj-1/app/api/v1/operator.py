
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select, func
from app.api.deps import require_role, get_current_session
from app.db.session import get_db
from app.models.enums import UserRole, RequestStatus
from app.models.inventory import ToolInventory
from app.models.tool_requests import ToolUsageRequest
from app.models.user import User
from app.schemas.inventory import ToolListItem
from app.schemas.tool_requests import ToolUsageCreateIn, ToolUsageShortOut
from app.services.notifications import notify_user

router = APIRouter()

@router.get("/test")
def test():
    return {"status": "operator router loaded"}

# Endpoint for operator to request a tool and notify supervisor
@router.post("/tool-requests", response_model=ToolUsageShortOut)
def create_tool_request(payload: ToolUsageCreateIn, db: OrmSession = Depends(get_db)):
    sess, user = get_current_session(db)
    operator_id = user.id
    inv = db.get(ToolInventory, payload.tool_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Tool not found")
    if payload.requested_qty <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity")
    if payload.requested_qty > inv.quantity:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available")
    next_id = (db.execute(select(func.max(ToolUsageRequest.id))).scalar() or 0) + 1
    rid = f"TR{next_id:05d}"
    row = ToolUsageRequest(
        request_id=rid,
        operator_id=operator_id,
        tool_id=inv.id,
        requested_qty=payload.requested_qty,
        status=RequestStatus.PENDING,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    # Notify all supervisors
    supervisors = db.execute(
        select(User.id).where(User.role == UserRole.SUPERVISOR)
    ).scalars().all()
    for supervisor_id in supervisors:
        notify_user(
            db,
            user_id=supervisor_id,
            role="SUPERVISOR",
            title="Tool Request",
            description=f"Operator requested {payload.requested_qty} of {inv.tool_name}"
        )
    return ToolUsageShortOut(
        request_id=row.request_id,
        tool_id=row.tool_id,
        tool_name=inv.tool_name,
        operator_id=row.operator_id,
        requested_qty=row.requested_qty,
        status=row.status.value,
        requested_at=row.requested_at,
    )

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