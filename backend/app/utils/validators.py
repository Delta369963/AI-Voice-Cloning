import os

from fastapi import UploadFile, HTTPException

from app.config import (
    SUPPORTED_FORMATS,
    MAX_FILE_SIZE_MB
)

def validate_audio_file(file: UploadFile):

    # Check extension
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format."
        )

    return True