import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)
    print("Available models:")
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print(f"FOUND_{len(models)}_MODELS")
        for name in models:
            print(f"MODEL:{name}")
    except Exception as e:
        print(f"Error listing models: {e}")
