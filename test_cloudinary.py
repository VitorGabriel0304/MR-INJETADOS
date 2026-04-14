import os
import cloudinary
import cloudinary.api
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
  cloud_name = os.environ.get("CLOUD_NAME"),
  api_key = os.environ.get("API_KEY"),
  api_secret = os.environ.get("API_SECRET")
)

print(f"--- TESTANDO CONEXÃO ---")
print(f"Cloud Name: {os.environ.get('CLOUD_NAME')}")
print(f"API Key: {os.environ.get('API_KEY')}")

try:
    res = cloudinary.api.ping()
    print("✅ SUCESSO! Conectado ao Cloudinary.")
except Exception as e:
    print(f"❌ ERRO: {e}")
