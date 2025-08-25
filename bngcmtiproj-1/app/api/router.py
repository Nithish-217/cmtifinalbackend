from fastapi import APIRouter
from app.api.v1 import auth, officer, supervisor, operator, notifications, user

# Create router instance FIRST
api_router = APIRouter()

# Include all sub-routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(officer.router, prefix="/officer", tags=["officer"])
api_router.include_router(officer.router, prefix="/v1/officer", tags=["officer"])
api_router.include_router(supervisor.router, prefix="/supervisor", tags=["supervisor"])
api_router.include_router(supervisor.router, prefix="/v1/supervisor", tags=["supervisor"])
api_router.include_router(operator.router, prefix="/operator", tags=["operator"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
# router.py
api_router.include_router(operator.router, prefix="/v1/operator", tags=["operator"])

