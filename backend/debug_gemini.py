import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("=" * 60)
print("Gemini API Debug Test")
print("=" * 60)

genai.configure(api_key=GEMINI_API_KEY)

# Test different models with timing
models_to_test = [
    'gemini-2.5-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-exp',
]

for model_name in models_to_test:
    print(f"\n📊 Testing model: {model_name}")
    try:
        model = genai.GenerativeModel(model_name)
        
        # Short prompt
        start = time.time()
        response = model.generate_content("Say 'Hello' in one word only.")
        elapsed = time.time() - start
        
        print(f"   ✅ Response: {response.text.strip()}")
        print(f"   ⏱️  Time: {elapsed:.2f} seconds")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("Testing with security prompt...")
print("=" * 60)

# Test with actual security prompt
try:
    model = genai.GenerativeModel('gemini-2.5-flash', generation_config={
        "temperature": 0.5,
        "max_output_tokens": 500,
    })
    
    prompt = """Fix for SQL Injection vulnerability:
Code: cursor.execute("SELECT * FROM users WHERE id = " + user_id)

Provide brief fix in 3 lines."""
    
    print(f"\n🔍 Sending security prompt...")
    start = time.time()
    response = model.generate_content(prompt)
    elapsed = time.time() - start
    
    print(f"✅ Response received in {elapsed:.2f} seconds")
    print(f"📝 Response:\n{response.text}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
