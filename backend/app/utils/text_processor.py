import re


def preprocess_text(
    text: str
):

    # Remove extra spaces

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    # Add pause after punctuation

    text = re.sub(
        r"\.",
        ". ",
        text
    )

    text = re.sub(
        r"\?",
        "? ",
        text
    )

    text = re.sub(
        r"\!",
        "! ",
        text
    )

    text = re.sub(
        r"\,",
        ", ",
        text
    )

    # Remove duplicate spaces

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()