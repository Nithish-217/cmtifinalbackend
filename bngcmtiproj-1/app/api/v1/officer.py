from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select
from app.api.deps import get_current_session
from app.db.session import get_db
from fastapi import Depends
from fastapi import APIRouter

router = APIRouter()

from app.models.issue import ToolIssue
from app.schemas.issue import ToolIssueOut
# Officer: View all reported tool issues
@router.get("/tool-issues", response_model=list[ToolIssueOut])
def list_tool_issues(db: OrmSession = Depends(get_db), session_data: tuple = Depends(get_current_session)):
    sess, user = session_data
    issues = db.execute(
        select(ToolIssue)
        .order_by(ToolIssue.created_at.desc())
    ).scalars().all()
    print("[DEBUG] Officer fetched tool issues:", issues)
    # Return all required fields for each issue
    return [
        ToolIssueOut(
            id=issue.id,
            tool_id=issue.tool_id,
            operator_id=issue.operator_id,
            description=issue.description,
            status=issue.status,
            created_at=issue.created_at,
            resolved_at=issue.resolved_at
        ) for issue in issues
    ]
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select, func
from app.api.deps import require_role, get_current_session
from app.db.session import get_db
from app.models.user import User
from app.models.enums import UserRole, RequestStatus
from app.models.session import Session as SessionModel
from app.models.tool_requests import ToolAdditionRequest
from app.models.inventory import ToolInventory
from app.schemas.user import UserCreateIn, UserOut
from app.schemas.inventory import ToolAdditionOut, ApproveToolAdditionOut
from app.schemas.common import MessageOut
from app.core.config import settings
from app.core.security import hash_password


@router.post("/users", response_model=UserOut, dependencies=[Depends(require_role(UserRole.OFFICER))])
def create_user(payload: UserCreateIn, db: OrmSession = Depends(get_db)):
    if db.execute(select(User).where(User.username == payload.username)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")
    user = User(
    full_name=payload.full_name,
    username=payload.username,
    email=payload.email,
    contact_number=payload.contact_number,
    role=payload.role,
    hashed_password=hash_password(settings.DEFAULT_PASSWORD),
    is_first_login=True,
    is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/users", response_model=list[UserOut], dependencies=[Depends(require_role(UserRole.OFFICER))])
def list_users(db: OrmSession = Depends(get_db)):
    users = db.execute(select(User).order_by(User.created_at.desc())).scalars().all()
    return users

@router.delete("/users/{user_id}", response_model=MessageOut, dependencies=[Depends(require_role(UserRole.OFFICER))])
def delete_user(user_id: int, db: OrmSession = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return MessageOut(message="User deleted")

@router.get("/tool-additions", response_model=list[ToolAdditionOut], dependencies=[Depends(require_role(UserRole.OFFICER))])
def list_tool_additions(status_filter: RequestStatus | None = None, db: OrmSession = Depends(get_db)):
    stmt = select(ToolAdditionRequest)
    if status_filter:
        stmt = stmt.where(ToolAdditionRequest.status == status_filter)
    rows = db.execute(stmt.order_by(ToolAdditionRequest.created_at.desc())).scalars().all()
    return [
        ToolAdditionOut(
            id=r.id,
            tool_name=r.tool_name,
            status=r.status.value,
            requested_by=r.requested_by,
            created_at=r.created_at,
        )
        for r in rows
    ]

@router.post("/tool-additions/{request_id}/approve", response_model=ApproveToolAdditionOut, dependencies=[Depends(require_role(UserRole.OFFICER))])
def approve_tool_addition(request_id: str, data=Depends(get_current_session), db: OrmSession = Depends(get_db)):
    sess, officer = data
    req = db.execute(select(ToolAdditionRequest).where(ToolAdditionRequest.request_id == request_id)).scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request already processed")


    req.status = RequestStatus.APPROVED
    req.reviewed_at = datetime.now(timezone.utc)
    req.officer_id = officer.id

    db.commit()

    return ApproveToolAdditionOut(
        request_id=req.request_id,
        status=req.status.value,
        tool_name=req.tool_name,
        make=req.make,
        range_mm=req.range_mm,
        quantity=req.quantity,
        approved_at=req.reviewed_at,
        officer={"id": officer.id, "name": officer.full_name},
    )

@router.post("/tool-additions/{request_id}/reject", response_model=MessageOut, dependencies=[Depends(require_role(UserRole.OFFICER))])
def reject_tool_addition(request_id: str, reason: str = "Not approved", data=Depends(get_current_session), db: OrmSession = Depends(get_db)):
    _, officer = data
    req = db.execute(select(ToolAdditionRequest).where(ToolAdditionRequest.request_id == request_id)).scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request already processed")
    req.status = RequestStatus.REJECTED
    req.reviewed_at = datetime.now(timezone.utc)
    req.reviewer_remarks = reason
    req.officer_id = officer.id
    db.commit()
    return MessageOut(message="Rejected")

@router.get("/session-logs", dependencies=[Depends(require_role(UserRole.OFFICER))])
def session_logs(role: UserRole | None = None, username: str | None = None, status_filter: str | None = None, db: OrmSession = Depends(get_db)):
    stmt = select(SessionModel).join(User, User.id == SessionModel.user_id)
    if role:
        stmt = stmt.where(SessionModel.role == role)
    if username:
        stmt = stmt.where(User.username == username)
        rows = db.execute(stmt.order_by(SessionModel.login_at.desc())).scalars().all()
        result = []
        now = datetime.now(timezone.utc)
        for s in rows:
            u = db.get(User, s.user_id)
            active = s.logout_at is None and s.expires_at > now
            if status_filter == "ACTIVE" and not active:
                continue
            if status_filter == "ENDED" and active:
                continue
            result.append({
            "session_id": s.session_id,
            "username": u.username if u else None,
            "full_name": u.full_name if u else None,
            "role": s.role.value,
            "login_at": s.login_at,
            "expires_at": s.expires_at,
            "logout_at": s.logout_at,
            "ended_reason": s.ended_reason.value if s.ended_reason else None,
            "ip_address": s.ip_address,
            })
    return result

@router.get("/active-sessions", dependencies=[Depends(require_role(UserRole.OFFICER))])
def active_sessions(db: OrmSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    rows = db.execute(select(SessionModel).where(SessionModel.logout_at.is_(None))).scalars().all()
    active = []
    for s in rows:
        if s.expires_at > now:
            active.append({
            "session_id": s.session_id,
            "user_id": s.user_id,
            "role": s.role.value,
            "login_at": s.login_at,
            "expires_at": s.expires_at,
            })
    return active