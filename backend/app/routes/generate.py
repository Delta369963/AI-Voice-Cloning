from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.voice_clone import (
    generate_cloned_voice
)

router = APIRouter()

class GenerateRequest(BaseModel):
    text: str
    filename: str
    speed: float = 1.0

@router.post("/generate")
async def generate_audio(
    request: GenerateRequest
):

    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    output_filename = generate_cloned_voice(
        text=request.text,
        filename=request.filename,
        speed=request.speed
    )

    return {
        "message": "Audio generated successfully",
        "audio_file": output_filename
    }