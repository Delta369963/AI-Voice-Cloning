import subprocess
import uuid
from pathlib import Path

UPLOAD_DIR = Path("app/uploads")


def convert_to_wav(
    input_path: str
):

    output_filename = (
        f"{uuid.uuid4()}.wav"
    )

    output_path = (
        UPLOAD_DIR / output_filename
    )

    command = [

        "ffmpeg",

        "-i",
        input_path,

        "-ar",
        "22050",

        "-ac",
        "1",

        str(output_path)
    ]

    subprocess.run(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return str(output_path)


def clean_audio(
    input_path: str
):

    output_filename = (
        f"{uuid.uuid4()}_clean.wav"
    )

    output_path = (
        UPLOAD_DIR / output_filename
    )

    command = [

        "ffmpeg",

        "-i",
        input_path,

        "-af",
        "afftdn",

        "-ar",
        "22050",

        "-ac",
        "1",

        str(output_path)
    ]

    subprocess.run(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return str(output_path)