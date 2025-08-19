from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ToolListItem(BaseModel):
	id: int
	tool_name: str
	range_mm: str | None = None
	identification_code: str | None = None
	make: str | None = None
	quantity: int
	location: str | None = None
	gauge: str | None = None
	remarks: str | None = None
	added_at: datetime | None = None
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ToolAdditionCreateIn(BaseModel):
	tool_name: str
	quantity: int

class ToolAdditionOut(BaseModel):
	id: int
	tool_name: str
	status: str
	requested_by: int
	created_at: datetime

class ApproveToolAdditionOut(BaseModel):
	id: int
	tool_name: str
	status: str
	approved_by: Optional[int] = None
	approved_at: Optional[datetime] = None
