import os
import uuid
from app.utils.text_processor import (
    preprocess_text
)

from app.utils.indic_text_processor import (
    preprocess_indic_text
)

from app.services.audio_processor import (
    convert_to_wav,
    clean_audio
)

from app.config import (
    UPLOAD_DIR,
    OUTPUT_DIR
)

from app.services.model_loader import (
    tts_model
)


def generate_cloned_voice(

    text: str,

    filename: str,

    speed: float = 1.0,

    language: str = "en"
):

    # Input audio path

    speaker_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    # Convert uploaded audio to WAV

    speaker_path = convert_to_wav(
        speaker_path
    )

    # Clean audio for better XTTS conditioning

    speaker_path = clean_audio(
        speaker_path
    )

    # Ensure outputs folder exists

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    # Unique generated filename

    output_filename = (
        f"{uuid.uuid4()}.wav"
    )

    output_path = os.path.join(
        OUTPUT_DIR,
        output_filename
    )

    # XTTS inference

    text = preprocess_indic_text(text)

    tts_model.tts_to_file(

        text=text,

        speaker_wav=speaker_path,

        language="hi",

        file_path=output_path,

        speed=speed
    )

    return output_filename