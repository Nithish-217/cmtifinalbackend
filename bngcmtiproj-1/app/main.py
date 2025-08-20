from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.router import api_router
import logging
import traceback

# Create FastAPI instance first
app = FastAPI(title=settings.APP_NAME)

# Ensure tables exist if running without Alembic (dev convenience)
print("[DEBUG] Using database URL:", settings.db_url())
try:
    Base.metadata.create_all(bind=engine)
    print("[DEBUG] Database connection successful")
except Exception as e:
    print(f"[WARNING] Database connection failed: {e}")
    print("[WARNING] Server will start but database features may not work")

logging.basicConfig(level=logging.DEBUG)

# Global exception handler (for debugging)
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    print("UNHANDLED EXCEPTION:", exc)
    traceback.print_exc()
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(str(exc), status_code=500)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS] if isinstance(settings.CORS_ORIGINS, str) else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register main API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Router test passed"}

@app.get("/health")
def health():
    return {"status": "ok"}
