from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Vulnerability(BaseModel):
    """Model for a single vulnerability"""
    severity: str
    type: str
    line_number: int
    code: str
    description: str
    suggestion: Optional[str] = None
    file: Optional[str] = None
    # Dependency-specific fields
    package: Optional[str] = None
    current_version: Optional[str] = None
    cve: Optional[str] = None
    # Secret-specific fields
    secret_type: Optional[str] = None
    masked_value: Optional[str] = None

class SavedProject(BaseModel):
    """Model for saved project scan results"""
    project_name: str
    scan_type: str  # "file_upload", "github", or "dependencies"
    security_score: int
    vulnerabilities: List[dict]
    total_issues: int
    summary: dict
    
    # Optional fields based on scan type
    file_name: Optional[str] = None
    repo_url: Optional[str] = None
    files_scanned: Optional[int] = None
    
    # Metadata
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_name": "MyApp v1.0",
                "scan_type": "file_upload",
                "security_score": 75,
                "vulnerabilities": [],
                "total_issues": 5,
                "summary": {"high": 1, "medium": 2, "low": 2},
                "file_name": "app.py",
                "created_at": "2024-01-15T10:30:00"
            }
        }

class ProjectListResponse(BaseModel):
    """Response model for listing projects"""
    total: int
    projects: List[dict]
