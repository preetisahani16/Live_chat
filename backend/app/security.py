import re
import secrets
from dataclasses import dataclass


@dataclass
class SafetyResult:
    cleaned_text: str
    sensitive: bool
    blocked: bool
    reason: str | None


SENSITIVE_PATTERNS = [
    (r"\b\d{12,19}\b", "[MASKED_ACCOUNT_OR_CARD]"),
    (r"\b\d{6}\b", "[MASKED_OTP]"),
    (r"\b[A-Z]{5}\d{4}[A-Z]\b", "[MASKED_PAN]"),
    (r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b", "[MASKED_EMAIL]"),
    (r"\b(?:\+91[-\s]?)?[6-9]\d{9}\b", "[MASKED_PHONE]"),
]

TRANSACTION_ACTIONS = (
    "transfer money",
    "send money",
    "make payment",
    "approve payment",
    "release payment",
    "add beneficiary",
    "change limit",
    "share otp",
)


def mask_pii(text: str) -> tuple[str, bool]:
    cleaned = text
    found = False
    for pattern, replacement in SENSITIVE_PATTERNS:
        cleaned, count = re.subn(pattern, replacement, cleaned, flags=re.IGNORECASE)
        found = found or count > 0
    return cleaned, found


def evaluate_safety(text: str) -> SafetyResult:
    cleaned, sensitive = mask_pii(text)
    blocked = any(action in cleaned.lower() for action in TRANSACTION_ACTIONS)
    return SafetyResult(
        cleaned_text=cleaned,
        sensitive=sensitive,
        blocked=blocked,
        reason="transaction_execution_request" if blocked else None,
    )


def generate_token() -> str:
    return secrets.token_urlsafe(24)
