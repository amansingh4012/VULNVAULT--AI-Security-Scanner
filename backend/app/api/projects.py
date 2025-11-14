"""
API routes for saved projects management
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from app.database import get_projects_collection
from app.models import SavedProject, ProjectListResponse

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=ProjectListResponse)
async def list_projects(limit: int = 100, offset: int = 0):
    """
    List all saved projects sorted by date (newest first)
    
    Args:
        limit: Maximum number of projects to return (default: 100)
        offset: Number of projects to skip (default: 0)
    
    Returns:
        ProjectListResponse with total count and list of projects
    """
    projects_collection = get_projects_collection()
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available. Please configure MongoDB.")
    
    try:
        # Get total count
        total = projects_collection.count_documents({})
        
        # Get projects sorted by creation date (newest first)
        projects_cursor = projects_collection.find(
            {},
            {"_id": 0}  # Exclude MongoDB _id field
        ).sort("created_at", -1).skip(offset).limit(limit)
        
        projects = list(projects_cursor)
        
        return {
            "total": total,
            "projects": projects
        }
        
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch projects: {str(e)}")

@router.get("/{project_name}")
async def get_project(project_name: str):
    """
    Get specific project details by name
    
    Args:
        project_name: Name of the project to retrieve
    
    Returns:
        Complete project scan data including all vulnerabilities
    """
    projects_collection = get_projects_collection()
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available. Please configure MongoDB.")
    
    try:
        project = projects_collection.find_one(
            {"project_name": project_name},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        return project
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch project: {str(e)}")

@router.delete("/{project_name}")
async def delete_project(project_name: str):
    """
    Delete a project and all its scan data
    
    Args:
        project_name: Name of the project to delete
    
    Returns:
        Success message with deleted project name
    """
    projects_collection = get_projects_collection()
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available. Please configure MongoDB.")
    
    try:
        # Check if project exists
        existing = projects_collection.find_one({"project_name": project_name})
        if not existing:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        # Delete the project
        result = projects_collection.delete_one({"project_name": project_name})
        
        if result.deleted_count == 0:
            raise HTTPException(500, "Failed to delete project")
        
        return {
            "message": "Project deleted successfully",
            "project_name": project_name,
            "deleted_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to delete project: {str(e)}")

@router.get("/{project_name}/summary")
async def get_project_summary(project_name: str):
    """
    Get lightweight project summary (without full vulnerability list)
    
    Args:
        project_name: Name of the project
    
    Returns:
        Project summary with basic statistics
    """
    projects_collection = get_projects_collection()
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available. Please configure MongoDB.")
    
    try:
        project = projects_collection.find_one(
            {"project_name": project_name},
            {
                "_id": 0,
                "vulnerabilities": 0  # Exclude large vulnerability array
            }
        )
        
        if not project:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        return project
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch project summary: {str(e)}")
