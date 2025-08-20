from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ToolIssueCreateIn(BaseModel):
    tool_id: int
    description: str

class ToolIssueOut(BaseModel):
    id: int
    tool_id: int
    operator_id: int
    description: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        orm_mode = True
