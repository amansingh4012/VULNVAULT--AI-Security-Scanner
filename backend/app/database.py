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
_client = None

def _sanitize_url(url: str) -> str:
    """Remove password from URL for safe logging"""
    try:
        if "@" in url:
            # Hide the password portion
            prefix = url.split("://")[0]
            rest = url.split("://")[1]
            user_part = rest.split("@")[0]
            host_part = rest.split("@")[1]
            user = user_part.split(":")[0] if ":" in user_part else user_part
            return f"{prefix}://{user}:****@{host_part}"
        return url
    except Exception:
        return "****"

def init_database():
    """Initialize MongoDB connection"""
    global db, projects_collection, _connection_status, _client
    
    print(f"🔌 Attempting MongoDB connection...")
    print(f"   URL: {_sanitize_url(MONGODB_URL)}")
    print(f"   Database: {DATABASE_NAME}")
    
    try:
        # Try to connect to MongoDB
        _client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        
        # Test connection
        _client.admin.command('ping')
        
        # Get database and collection
        db = _client[DATABASE_NAME]
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
        print(f"✅ MongoDB connected successfully to database '{DATABASE_NAME}'")
        return True
        
    except ServerSelectionTimeoutError as e:
        db = None
        projects_collection = None
        _connection_status = "failed"
        print(f"❌ MongoDB connection TIMEOUT: {e}")
        print(f"   This usually means the MongoDB server is unreachable.")
        print(f"   Check that MONGODB_URL is correct and the server allows connections from this IP.")
        return False
    except ConnectionFailure as e:
        db = None
        projects_collection = None
        _connection_status = "failed"
        print(f"❌ MongoDB connection FAILED: {e}")
        return False
    except Exception as e:
        db = None
        projects_collection = None
        _connection_status = "failed"
        print(f"❌ MongoDB unexpected error: {type(e).__name__}: {e}")
        return False

def get_projects_collection():
    """Get projects collection. Retries connection once if previously failed."""
    global projects_collection
    
    if projects_collection is None and _connection_status == "failed":
        # Retry once - the env var might have been set after initial startup
        print("🔄 Retrying MongoDB connection...")
        init_database()
    
    return projects_collection

def get_connection_status():
    """Get human-readable connection status"""
    return _connection_status

def close_database():
    """Close database connection"""
    global db, projects_collection, _client
    if _client is not None:
        _client.close()
        db = None
        projects_collection = None

