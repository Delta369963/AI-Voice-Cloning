from TTS.api import TTS
from app.config import MODEL_NAME

print("Loading XTTS model...")

tts_model = TTS(model_name=MODEL_NAME)

print("XTTS model loaded successfully.")