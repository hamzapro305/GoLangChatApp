import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)

print("Starting deep model check...")
try:
    models = genai.list_models()
    gen_models = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
    print(f"Found {len(gen_models)} generative models.")
    for m in gen_models:
        print(f"AVAILABLE_MODEL: {m}")
        
    # Try a simple test with the first one that looks like flash
    test_model_name = next((m for m in gen_models if "flash" in m), gen_models[0])
    print(f"Testing generation with: {test_model_name}")
    
    test_model = genai.GenerativeModel(test_model_name)
    response = test_model.generate_content("Say hello")
    print(f"SUCCESS: {response.text}")
    print(f"FINAL_MODEL_NAME: {test_model_name}")
    
    with open("model_found.txt", "w") as f:
        f.write(test_model_name)

except Exception as e:
    with open("model_found.txt", "w") as f:
        f.write(f"ERROR: {str(e)}")
    print(f"FAILURE during check: {e}")
