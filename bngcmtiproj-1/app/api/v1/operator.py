from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select, func
from app.api.deps import require_role, get_current_session
from app.db.session import get_db
from app.models.enums import UserRole, RequestStatus
from app.models.inventory import ToolInventory
from app.models.tool_requests import ToolUsageRequest
from app.models.user import User
from app.models.issue import ToolIssue
from app.schemas.issue import ToolIssueCreateIn
from app.schemas.inventory import ToolListItem
from app.schemas.tool_requests import ToolUsageCreateIn, ToolUsageShortOut
from app.services.notifications import notify_user

# Single router for all operator endpoints
router = APIRouter()


# Report a tool issue (operator -> officer)
@router.post("/tool-issues")
def report_tool_issue(
    payload: ToolIssueCreateIn,
    db: OrmSession = Depends(get_db),
    session_data: tuple = Depends(get_current_session)
):
    sess, user = session_data
    issue = ToolIssue(
        tool_id=payload.tool_id,
        operator_id=user.id,
        description=payload.description,
        status="OPEN",
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)
    # Notify all officers
    officers = db.execute(select(User.id).where(User.role == UserRole.OFFICER)).scalars().all()
    for officer_id in officers:
        notify_user(
            db,
            user_id=officer_id,
            role="OFFICER",
            title="Tool Issue Reported",
            description=f"Operator {user.id} reported an issue for tool {payload.tool_id}",
            target_url="/officer/tool-issues",
        )
    return {"message": "Issue reported and officers notified.", "issue_id": issue.id}

# Endpoint to display all tool requests made by the operator
@router.get("/tool-requests/all")
def list_operator_tool_requests(db: OrmSession = Depends(get_db), session_data: tuple = Depends(get_current_session)):
    sess, user = session_data
    rows = db.execute(
        select(ToolUsageRequest)
        .where(ToolUsageRequest.operator_id == user.id)
        .order_by(ToolUsageRequest.requested_at.desc())
    ).scalars().all()
    return [
        {
            "request_id": r.request_id,
            "tool_id": r.tool_id,
            "requested_qty": r.requested_qty,
            "status": r.status.value,
            "requested_at": str(r.requested_at),
            "reviewed_at": str(r.reviewed_at) if r.reviewed_at else None,
            "reviewer_id": r.reviewer_id,
            "reviewer_remarks": r.reviewer_remarks
        } for r in rows
    ]


# Rewritten endpoint: POST /tool-requests
@router.post("/tool-requests")
def create_tool_request(
    payload: ToolUsageCreateIn,
    db: OrmSession = Depends(get_db),
    session_data: tuple = Depends(get_current_session)
):
    sess, user = session_data
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
        user_id=user.id,
        tool_id=inv.id,
        requested_qty=payload.requested_qty,
        status=RequestStatus.PENDING,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    # Notify all supervisors with target_url for dashboard
    supervisors = db.execute(
        select(User.id).where(User.role == UserRole.SUPERVISOR)
    ).scalars().all()
    for supervisor_id in supervisors:
        notify_user(
            db,
            user_id=supervisor_id,
            role="SUPERVISOR",
            title="Tool Request",
            description=f"Operator requested {payload.requested_qty} of {inv.tool_name}",
            target_url="/supervisor/tool-requests"
        )
    return JSONResponse(content={
        "message": "Request was successful and supervisors have been notified.",
        "request_id": row.request_id,
        "tool_id": row.tool_id,
        "operator_id": row.operator_id,
        "requested_qty": row.requested_qty,
        "status": row.status.value,
        "requested_at": str(row.requested_at)
    })

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