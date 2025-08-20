from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class Notification(Base):
	__tablename__ = "notifications"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	role = Column(String(50), nullable=True)
	title = Column(String(100), nullable=True)
	description = Column(String(255), nullable=True)
	target_url = Column(String(255), nullable=True)
	message = Column(String(255), nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
