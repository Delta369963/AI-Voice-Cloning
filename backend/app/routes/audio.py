import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import OUTPUT_DIR

router = APIRouter()

@router.get("/audio/{filename}")
async def get_audio(filename: str):

    file_path = os.path.join(
        OUTPUT_DIR,
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Audio file not found."
        )

    return FileResponse(
        path=file_path,
        media_type="audio/wav",
        filename=filename
    )