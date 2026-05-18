import os
import subprocess

def convert_to_wav(input_path: str):

    output_path = input_path.rsplit(".", 1)[0] + ".wav"

    command = [
        "ffmpeg",
        "-y",
        "-i",
        input_path,
        "-ar",
        "22050",
        "-ac",
        "1",
        output_path
    ]

    subprocess.run(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return output_path