from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy import select
from app.models.role_lock import RoleLock
from app.models.enums import UserRole
from app.models.session import Session as SessionModel
from app.core.config import settings

def get_active_lock(db: OrmSession, role: UserRole):
    lock = db.execute(select(RoleLock).where(RoleLock.role == role)).scalar_one_or_none()
    if not lock:
        return None
    
    # Only allow lock if session is valid
    if lock.session_id is not None:
        # Check if the linked session is still valid
        s = db.execute(select(SessionModel).where(SessionModel.session_id == lock.session_id)).scalar_one_or_none()
        if s is None or s.expires_at <= datetime.now(timezone.utc) or s.logout_at is not None:
            # Stale lock, release it
            print(f"Releasing stale lock for role {role} due to invalid session")
            lock.session_id = None
            db.commit()
            return None
        # Session is valid, lock is active
        return lock
    # No active session, lock is not held
    return None

def acquire_lock(db: OrmSession, role: UserRole, session_row: SessionModel):
    lock = db.execute(select(RoleLock).where(RoleLock.role == role)).scalar_one_or_none()
    active = get_active_lock(db, role)
    if active:
        # Lock is held by another session, deny
        return None

    if not lock:
        # Create lock for this session
        lock = RoleLock(
            role=role,
            session_id=session_row.session_id
        )
        db.add(lock)
        db.commit()
        db.refresh(lock)
        return lock

    # Acquire lock for this session
    lock.session_id = session_row.session_id
    db.commit()
    db.refresh(lock)
    return lock

def release_lock_if_owner(db: OrmSession, role: UserRole, session_row: SessionModel):
    print(f"=== RELEASE LOCK DEBUG START ===")
    print(f"Attempting to release lock for role: {role}")
    print(f"Session ID to match: {session_row.session_id}")
    
    lock = db.execute(select(RoleLock).where(RoleLock.role == role)).scalar_one_or_none()
    if not lock:
        print(f"ERROR: No lock found for role {role}")
        print(f"=== RELEASE LOCK DEBUG END ===")
        return
    
    print(f"Found lock: id={lock.id}, role={lock.role}, session_id={lock.session_id}")
    
    # Compare session_id as string
    if lock.session_id == session_row.session_id:
        print(f"Session IDs match! Releasing lock for role {role}")
        # Delete the lock row completely
        db.delete(lock)
        db.commit()
        print(f"Lock successfully DELETED for role {role}")
        
        # Verify deletion
        verify_lock = db.execute(select(RoleLock).where(RoleLock.role == role)).scalar_one_or_none()
        if verify_lock:
            print(f"WARNING: Lock still exists after deletion attempt!")
        else:
            print(f"SUCCESS: Lock completely removed from database")
    else:
        print(f"ERROR: Lock session mismatch!")
        print(f"  Lock session_id: '{lock.session_id}' (type: {type(lock.session_id)})")
        print(f"  Session session_id: '{session_row.session_id}' (type: {type(session_row.session_id)})")
    
    print(f"=== RELEASE LOCK DEBUG END ===")
