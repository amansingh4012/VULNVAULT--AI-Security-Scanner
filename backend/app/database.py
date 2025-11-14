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

def init_database():
    """Initialize MongoDB connection"""
    global db, projects_collection
    
    try:
        # Try to connect to MongoDB
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        
        # Get database and collection
        db = client[DATABASE_NAME]
        projects_collection = db['projects']
        
        # Create indexes for better query performance
        projects_collection.create_index([("project_name", DESCENDING)], unique=True)
        projects_collection.create_index([("created_at", DESCENDING)])
        projects_collection.create_index([("scan_type", DESCENDING)])
        
        print(f"✅ MongoDB connected: {DATABASE_NAME}")
        return True
        
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"⚠️ MongoDB not available: {e}")
        print("   Projects will not be saved. To enable, start MongoDB and configure MONGODB_URL")
        db = None
        projects_collection = None
        return False
    except Exception as e:
        print(f"⚠️ Database initialization error: {e}")
        db = None
        projects_collection = None
        return False

def get_projects_collection():
    """Get projects collection (returns None if not connected)"""
    return projects_collection

def close_database():
    """Close database connection"""
    global db, projects_collection
    if db is not None:
        db.client.close()
        print("MongoDB connection closed")
