"""
Test script to verify Saved Projects feature setup
"""
import sys
import os

print("🔍 VulnVault - Saved Projects Feature Test")
print("=" * 50)

# Test 1: Check Python packages
print("\n1️⃣ Checking Python packages...")
try:
    import pymongo
    print(f"   ✅ pymongo: {pymongo.__version__}")
except ImportError as e:
    print(f"   ❌ pymongo: Not installed - {e}")
    sys.exit(1)

try:
    import dns
    print(f"   ✅ dnspython: Installed")
except ImportError as e:
    print(f"   ❌ dnspython: Not installed - {e}")
    sys.exit(1)

try:
    import reportlab
    print(f"   ✅ reportlab: {reportlab.Version}")
except ImportError as e:
    print(f"   ❌ reportlab: Not installed - {e}")
    sys.exit(1)

# Test 2: Check MongoDB connection
print("\n2️⃣ Testing MongoDB connection...")
try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
    client.admin.command('ping')
    version = client.server_info()['version']
    print(f"   ✅ MongoDB connected: Version {version}")
    
    # Test database and collection
    db = client['vulnvault']
    projects = db['projects']
    count = projects.count_documents({})
    print(f"   ✅ Database 'vulnvault' accessible: {count} projects")
    
    client.close()
    
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(f"   ⚠️  MongoDB not running: {e}")
    print(f"   💡 Start MongoDB to enable project saving")
    print(f"      Windows: Start-Service MongoDB")
    print(f"      macOS: brew services start mongodb-community")
    print(f"      Linux: sudo systemctl start mongod")
except Exception as e:
    print(f"   ❌ MongoDB error: {e}")

# Test 3: Check API modules
print("\n3️⃣ Checking API modules...")
try:
    from app.database import init_database, get_projects_collection
    print("   ✅ app.database module loaded")
    
    from app.models import SavedProject, ProjectListResponse
    print("   ✅ app.models module loaded")
    
    from app.api.projects import router
    print("   ✅ app.api.projects router loaded")
    
except ImportError as e:
    print(f"   ❌ Module import error: {e}")
    sys.exit(1)

# Test 4: Check frontend component
print("\n4️⃣ Checking frontend files...")
frontend_files = [
    "../frontend/src/components/SavedProjects.jsx",
    "../frontend/src/App.jsx"
]

for file_path in frontend_files:
    if os.path.exists(file_path):
        print(f"   ✅ {os.path.basename(file_path)} exists")
    else:
        print(f"   ❌ {os.path.basename(file_path)} not found")

print("\n" + "=" * 50)
print("✅ All checks complete!")
print("\n📋 Next steps:")
print("   1. Start MongoDB (if not running)")
print("   2. Start backend: cd backend && python -m uvicorn main:app --reload")
print("   3. Start frontend: cd frontend && npm run dev")
print("   4. Go to Saved Projects tab to view saved scans")
print("\n📖 For detailed setup: See SAVED_PROJECTS_SETUP.md")
