from fastapi import APIRouter, UploadFile, File

from app.utils.validators import validate_audio_file
from app.utils.file_manager import save_uploaded_file

router = APIRouter()

@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...)
):

    validate_audio_file(file)

    filename = save_uploaded_file(file)

    return {
        "message": "File uploaded successfully",
        "filename": filename
    }