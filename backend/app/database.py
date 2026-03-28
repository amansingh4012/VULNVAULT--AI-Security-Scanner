"""
MongoDB database configuration for VulnVault
"""
from pymongo import MongoClient, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "vulnvault")

# Global database connection
db = None
projects_collection = None
_connection_status = "not_attempted"

def init_database():
    """Initialize MongoDB connection"""
    global db, projects_collection, _connection_status
    
    try:
        # Try to connect to MongoDB
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        
        # Get database and collection
        db = client[DATABASE_NAME]
        projects_collection = db['projects']
        
        # Create indexes for better query performance
        # Compound unique index: same user can't have duplicate project names, 
        # but different users can
        projects_collection.create_index(
            [("user_id", DESCENDING), ("project_name", DESCENDING)], 
            unique=True
        )
        projects_collection.create_index([("created_at", DESCENDING)])
        projects_collection.create_index([("scan_type", DESCENDING)])
        
        _connection_status = "connected"
        return True
        
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        # Instead of falling back to mongomock, just mark it as failed
        db = None
        projects_collection = None
        _connection_status = "failed"
        return False

def get_projects_collection():
    """Get projects collection (returns None if not connected)"""
    return projects_collection

def get_connection_status():
    """Get human-readable connection status"""
    return _connection_status

def close_database():
    """Close database connection"""
    global db, projects_collection
    if db is not None:
        db.client.close()
