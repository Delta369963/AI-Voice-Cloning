from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.voice_clone import (
    generate_cloned_voice
)

router = APIRouter()


class GenerateRequest(BaseModel):

    text: str

    filename: str

    speed: float = 0.95

    language: str = "en"


@router.post("/generate")
async def generate_audio(
    request: GenerateRequest
):

    # Empty text validation

    if not request.text.strip():

        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    # Supported languages

    supported_languages = [
        "en",
        "hi"
    ]

    if request.language not in supported_languages:

        raise HTTPException(
            status_code=400,
            detail="Unsupported language."
        )

    # Speed validation

    if request.speed < 0.5 or request.speed > 2.0:

        raise HTTPException(
            status_code=400,
            detail="Speed must be between 0.5 and 2.0"
        )

    try:

        output_filename = generate_cloned_voice(

            text=request.text,

            filename=request.filename,

            speed=request.speed,

            language=request.language
        )

        return {

            "message":
            "Audio generated successfully",

            "audio_file":
            output_filename
        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"Voice generation failed: {str(e)}"
        )