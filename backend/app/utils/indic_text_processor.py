import re


def preprocess_indic_text(
    text: str
):

    # Remove excessive spaces

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    # Replace English punctuation
    # with Indic-friendly spacing

    text = text.replace(
        "।",
        " । "
    )

    text = text.replace(
        ",",
        " , "
    )

    text = text.replace(
        "?",
        " ? "
    )

    # Remove duplicate spaces

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text