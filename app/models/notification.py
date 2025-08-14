from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class Notification(Base):
	__tablename__ = "notifications"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	message = Column(String(255), nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
