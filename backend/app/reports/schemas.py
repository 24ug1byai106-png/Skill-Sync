from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class ReportSummaryRead(BaseModel):
    report_type: str
    user_id: UUID
    title: str
    generated_at: datetime
    content_html: str
