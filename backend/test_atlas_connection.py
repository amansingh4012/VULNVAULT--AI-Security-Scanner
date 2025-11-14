"""
Quick test script for MongoDB Atlas connection
"""
import sys
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

print("🌐 MongoDB Atlas Connection Test")
print("=" * 50)

# Get connection string
MONGODB_URL = os.getenv("MONGODB_URL", "")

if not MONGODB_URL:
    print("❌ MONGODB_URL not found in .env file")
    print("\n📝 Please create backend/.env with:")
    print("MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/")
    print("DATABASE_NAME=vulnvault")
    sys.exit(1)

# Check if it's Atlas URL
is_atlas = "mongodb+srv://" in MONGODB_URL
print(f"\n📊 Connection Type: {'Atlas (Cloud) ☁️' if is_atlas else 'Local MongoDB 💻'}")
print(f"🔗 URL: {MONGODB_URL[:30]}..." if len(MONGODB_URL) > 30 else f"🔗 URL: {MONGODB_URL}")

# Check for common mistakes
if "<password>" in MONGODB_URL or "<username>" in MONGODB_URL:
    print("\n❌ ERROR: Replace <username> and <password> with actual values!")
    print("\nYour connection string should look like:")
    print("mongodb+srv://vulnvault_user:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/")
    print("                    ↑              ↑")
    print("                username      actual password")
    sys.exit(1)

# Test connection
print("\n🔍 Testing connection...")
try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, OperationFailure
    
    # Longer timeout for cloud connections
    timeout = 10000 if is_atlas else 3000
    
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=timeout)
    
    # Test connection
    print("   ⏳ Connecting to MongoDB...")
    client.admin.command('ping')
    
    # Get version
    version = client.server_info()['version']
    print(f"   ✅ Connected successfully!")
    print(f"   📌 MongoDB Version: {version}")
    
    # Test database access
    db_name = os.getenv("DATABASE_NAME", "vulnvault")
    db = client[db_name]
    projects = db['projects']
    
    # Count documents
    count = projects.count_documents({})
    print(f"   ✅ Database '{db_name}' accessible")
    print(f"   📊 Saved projects: {count}")
    
    # Test write permission
    try:
        test_doc = {"_test": True, "message": "Connection test"}
        projects.insert_one(test_doc)
        projects.delete_one({"_test": True})
        print(f"   ✅ Write permissions verified")
    except Exception as e:
        print(f"   ⚠️  Write test failed: {e}")
    
    client.close()
    
    print("\n" + "=" * 50)
    print("✅ SUCCESS! MongoDB is ready to use!")
    print("\n🚀 Next steps:")
    print("   1. Start backend: cd backend && python -m uvicorn main:app --reload")
    print("   2. Start frontend: cd frontend && npm run dev")
    print("   3. Open http://localhost:5173")
    print("   4. Go to 💾 Saved Projects tab")
    
except OperationFailure as e:
    print(f"\n❌ Authentication Error: {e}")
    print("\n🔧 Possible solutions:")
    print("   1. Check username and password are correct")
    print("   2. Make sure database user exists in Atlas")
    print("   3. User needs 'readWriteAnyDatabase' permission")
    print("\n📖 See MONGODB_ATLAS_SETUP.md for help")
    sys.exit(1)
    
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(f"\n❌ Connection Error: {e}")
    print("\n🔧 Possible solutions:")
    if is_atlas:
        print("   1. Check your IP is whitelisted in Atlas")
        print("      → Security → Network Access → Add IP Address")
        print("      → Or use 0.0.0.0/0 to allow from anywhere")
        print("   2. Verify connection string is correct")
        print("   3. Check your internet connection")
        print("   4. Ensure cluster is running (check Atlas dashboard)")
    else:
        print("   1. Start MongoDB service:")
        print("      Windows: Start-Service MongoDB")
        print("      macOS: brew services start mongodb-community")
        print("      Linux: sudo systemctl start mongod")
        print("   2. Verify MongoDB is running on port 27017")
    print("\n📖 See MONGODB_ATLAS_SETUP.md for detailed help")
    sys.exit(1)
    
except ModuleNotFoundError as e:
    print(f"\n❌ Missing Package: {e}")
    print("\n🔧 Install required packages:")
    print("   pip install pymongo dnspython")
    sys.exit(1)
    
except Exception as e:
    print(f"\n❌ Unexpected Error: {e}")
    print("\n📖 Check MONGODB_ATLAS_SETUP.md for troubleshooting")
    sys.exit(1)
