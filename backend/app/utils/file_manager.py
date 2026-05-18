import os
import shutil
import uuid

from fastapi import UploadFile

from app.config import UPLOAD_DIR

def save_uploaded_file(
    file: UploadFile
):

    # Generate unique filename
    unique_filename = (
        f"{uuid.uuid4()}_{file.filename}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    # Save file
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return unique_filename