# Pure text processing and math utility (No cryptography)
import json
import math
import re

def compute_compound_interest(principal: float, rate: float, time_years: int) -> float:
    return round(principal * math.pow((1 + rate / 100), time_years), 2)

def sanitize_username(username: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_-]', '', username)
    return cleaned.strip().lower()

def format_summary_json(data: dict) -> str:
    return json.dumps(data, indent=2, sort_keys=True)
