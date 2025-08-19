from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ToolUsageShortOut(BaseModel):
	request_id: str
	tool_id: int
	tool_name: str
	operator_id: int
	requested_qty: int
	status: str
	requested_at: datetime


class ToolUsageCreateIn(BaseModel):
	tool_id: int
	requested_qty: int


class ApproveToolUsageOut(BaseModel):
	request_id: str
	status: str
	tool_id: int
	tool_name: str
	requested_qty: int
	remaining_qty: int
	approved_at: Optional[datetime] = None
	approved_by: Optional[dict] = None
