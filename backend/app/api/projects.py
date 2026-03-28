"""
API routes for saved projects management
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
from typing import List, Optional
from datetime import datetime
from io import BytesIO
import jwt
from app.database import get_projects_collection
from app.models import SavedProject, ProjectListResponse

router = APIRouter(prefix="/api/projects", tags=["projects"])

async def get_user_id(authorization: str = Header(None)):
    """Extract user_id from Clerk JWT token for data isolation"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authentication required to view projects")
    try:
        token = authorization.replace("Bearer ", "")
        decoded = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token structure")
        return user_id
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

@router.get("", response_model=ProjectListResponse)
async def list_projects(limit: int = 100, offset: int = 0, user_id: str = Depends(get_user_id)):
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
        total = projects_collection.count_documents({"user_id": user_id})
        
        # Get projects sorted by creation date (newest first)
        projects_cursor = projects_collection.find(
            {"user_id": user_id},
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
async def get_project(project_name: str, user_id: str = Depends(get_user_id)):
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
            {"project_name": project_name, "user_id": user_id},
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
async def delete_project(project_name: str, user_id: str = Depends(get_user_id)):
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
        existing = projects_collection.find_one({"project_name": project_name, "user_id": user_id})
        if not existing:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        # Delete the project
        result = projects_collection.delete_one({"project_name": project_name, "user_id": user_id})
        
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
async def get_project_summary(project_name: str, user_id: str = Depends(get_user_id)):
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
            {"project_name": project_name, "user_id": user_id},
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

@router.get("/{project_name}/pdf")
async def generate_pdf_report(project_name: str, user_id: str = Depends(get_user_id)):
    """Generate PDF report for a project securely"""
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    
    projects_collection = get_projects_collection()
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available")
    
    try:
        # Fetch project belonging to the specific user securely
        project = projects_collection.find_one({
            "project_name": project_name, 
            "user_id": user_id
        }, {"_id": 0})
        if not project:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        # Create PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12
        )
        
        # Title
        story.append(Paragraph(f"VulnVault Security Report", title_style))
        story.append(Paragraph(f"Project: {project['project_name']}", styles['Heading2']))
        story.append(Spacer(1, 0.3*inch))
        
        # Summary Section
        story.append(Paragraph("Executive Summary", heading_style))
        summary_data = [
            ['Metric', 'Value'],
            ['Security Score', f"{project['security_score']}/100"],
            ['Total Issues', str(project['total_issues'])],
            ['High Severity', str(project['summary'].get('high', 0))],
            ['Medium Severity', str(project['summary'].get('medium', 0))],
            ['Low Severity', str(project['summary'].get('low', 0))],
            ['Scan Type', project['scan_type'].replace('_', ' ').title()],
            ['Files Scanned', str(project.get('files_scanned', 1))],
            ['Scan Date', project['created_at'][:10]]
        ]
        
        if project.get('file_name'):
            summary_data.append(['File Name', project['file_name']])
        if project.get('repo_url'):
            summary_data.append(['Repository', project['repo_url']])
        
        summary_table = Table(summary_data, colWidths=[2.5*inch, 4*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Vulnerabilities Section
        if project['vulnerabilities']:
            story.append(Paragraph(f"Vulnerabilities Detected ({len(project['vulnerabilities'])})", heading_style))
            story.append(Spacer(1, 0.2*inch))
            
            for idx, vuln in enumerate(project['vulnerabilities'][:50], 1):  # Limit to 50 for PDF size
                # Severity color
                sev_color = colors.red if vuln['severity'] == 'HIGH' else \
                           colors.orange if vuln['severity'] == 'MEDIUM' else colors.blue
                
                vuln_data = [
                    ['#', str(idx)],
                    ['Severity', vuln['severity']],
                    ['Type', vuln['type']],
                    ['Line', str(vuln.get('line_number', 'N/A'))],
                    ['File', vuln.get('file', 'N/A')],
                    ['Description', vuln.get('description', 'No description')[:100]],
                ]
                
                vuln_table = Table(vuln_data, colWidths=[1*inch, 5.5*inch])
                vuln_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                    ('BACKGROUND', (0, 1), (0, 1), sev_color),
                    ('TEXTCOLOR', (0, 1), (0, 1), colors.whitesmoke),
                    ('FONTNAME', (0, 1), (0, 1), 'Helvetica-Bold'),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                story.append(vuln_table)
                story.append(Spacer(1, 0.15*inch))
        else:
            story.append(Paragraph("✅ No vulnerabilities detected!", styles['Normal']))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph(
            "Generated by VulnVault Security Scanner | " + datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
            ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
        ))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        # Return as downloadable file
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={project_name.replace(' ', '_')}_report.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to generate PDF: {str(e)}")
