import os
import uuid
from app.services.audio_processor import convert_to_wav

from app.config import (
    UPLOAD_DIR,
    OUTPUT_DIR
)

from app.services.model_loader import tts_model

def generate_cloned_voice(
    text: str,
    filename: str,
    speed: float = 1.0
):

    # Input audio path
    speaker_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    # Ensure outputs folder exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Unique output filename
    output_filename = f"{uuid.uuid4()}.wav"

    output_path = os.path.join(
        OUTPUT_DIR,
        output_filename
    )
    speaker_path = convert_to_wav(speaker_path)
    # Generate speech
    tts_model.tts_to_file(
        text=text,
        speaker_wav=speaker_path,
        language="en",
        file_path=output_path,
        speed=speed
    )

    return output_filename