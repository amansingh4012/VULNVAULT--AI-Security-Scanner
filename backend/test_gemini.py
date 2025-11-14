import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("Testing Gemini API...")
print(f"API Key (first 10 chars): {GEMINI_API_KEY[:10]}...")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    print("\nSending test prompt...")
    response = model.generate_content("Say 'Hello World' and nothing else.")
    
    print(f"\n✅ Success! Response: {response.text}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
