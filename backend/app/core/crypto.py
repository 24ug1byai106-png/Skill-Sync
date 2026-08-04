import base64
import hashlib

from cryptography.fernet import Fernet

from app.config.settings import get_settings


def _fernet() -> Fernet:
    settings = get_settings()
    key = settings.field_encryption_key
    if not key:
        digest = hashlib.sha256(settings.supabase_jwt_secret.encode("utf-8")).digest()
        key = base64.urlsafe_b64encode(digest).decode("ascii")
    return Fernet(key.encode("ascii"))


def encrypt_text(value: str) -> str:
    return _fernet().encrypt(value.encode("utf-8")).decode("ascii")


def decrypt_text(value: str) -> str:
    return _fernet().decrypt(value.encode("ascii")).decode("utf-8")
