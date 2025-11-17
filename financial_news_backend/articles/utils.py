import re


def generate_summary(text: str, max_sentences: int = 3, max_chars: int = 400) -> str:
    if not text:
        return ""

    # Split text into sentences
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    if not sentences:
        return ""

    summary = " ".join(sentences[:max_sentences])
    if len(summary) > max_chars:
        summary = summary[: max_chars - 3].rstrip() + "..."

    return summary
