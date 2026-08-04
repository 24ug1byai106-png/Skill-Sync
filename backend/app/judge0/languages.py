SUPPORTED_LANGUAGES = {
    "python": 71,
    "java": 62,
    "cpp": 54,
    "c++": 54,
    "javascript": 63,
    "go": 60,
    "rust": 73,
}


def language_id_for(name: str) -> int:
    normalized = name.strip().lower()
    if normalized not in SUPPORTED_LANGUAGES:
        supported = ", ".join(sorted(SUPPORTED_LANGUAGES))
        raise ValueError(f"Unsupported language. Supported languages: {supported}")
    return SUPPORTED_LANGUAGES[normalized]
