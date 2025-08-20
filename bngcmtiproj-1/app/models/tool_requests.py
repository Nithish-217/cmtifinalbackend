from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base
from app.models.enums import RequestStatus

class ToolAdditionRequest(Base):
	__tablename__ = "tool_addition_requests"
	id = Column(Integer, primary_key=True, index=True)
	tool_name = Column(String(100), nullable=False)
	status = Column(Enum(RequestStatus), nullable=False, default=RequestStatus.PENDING)
	requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)



class ToolUsageRequest(Base):
	__tablename__ = "tool_usage_requests"
	id = Column(Integer, primary_key=True, index=True)
	request_id = Column(String(32), unique=True, index=True, nullable=False)
	operator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	tool_id = Column(Integer, ForeignKey("tool_inventory.id"), nullable=False)
	requested_qty = Column(Integer, nullable=False)
	status = Column(Enum(RequestStatus), nullable=False, default=RequestStatus.PENDING)
	requested_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	reviewed_at = Column(DateTime(timezone=True), nullable=True)
	reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
	reviewer_remarks = Column(String(255), nullable=True)
