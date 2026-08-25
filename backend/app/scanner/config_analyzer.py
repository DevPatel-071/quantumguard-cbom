import re
from typing import List, Dict, Any
from app.cbom.cbom_model import ConfidenceLevel

class ConfigAnalyzer:

    @classmethod
    def scan_config(cls, file_name: str, relative_path: str, content: str) -> List[Dict[str, Any]]:
        findings = []
        lower_name = file_name.lower()
        is_config = (
            lower_name.endswith((".conf", ".cnf", ".cfg", ".yml", ".yaml", ".properties", ".ini", ".env", ".toml")) or
            "nginx" in lower_name or "apache" in lower_name or "openssl" in lower_name
        )
        if not is_config:
            return []

        lines = content.splitlines()
        for line_idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue

            # TLS Protocols in Nginx/Apache/HAProxy
            if re.search(r"\bssl_protocols\b|\bSSLProtocol\b", stripped, re.IGNORECASE):
                protocols = []
                if "TLSv1.3" in stripped:
                    protocols.append("TLS 1.3")
                if "TLSv1.2" in stripped:
                    protocols.append("TLS 1.2")
                if "TLSv1.1" in stripped or "TLSv1 " in stripped or "TLSv1;" in stripped:
                    protocols.append("Legacy TLS 1.0/1.1")
                if "SSLv3" in stripped or "SSLv2" in stripped:
                    protocols.append("Insecure SSLv3")

                findings.append({
                    "algorithm": "TLS (" + ", ".join(protocols) + ")" if protocols else "TLS Protocol Config",
                    "category": "Cryptographic Protocol",
                    "usage": "Network Transport Security (HTTPS / API)",
                    "library": "Web Server / Proxy Config",
                    "protocol": ", ".join(protocols) if protocols else "TLS",
                    "file": relative_path,
                    "line_number": line_idx,
                    "code_snippet": stripped[:120],
                    "evidence": f"Web Server TLS protocol directive: '{stripped[:90]}'",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": None,
                    "mode": None
                })

            # Cipher Suites in Configs
            if re.search(r"\b(ssl_ciphers|SSLCipherSuite|ciphers)\b", stripped, re.IGNORECASE):
                has_rsa = "RSA" in stripped
                has_ecdhe = "ECDHE" in stripped or "ECDSA" in stripped
                has_3des = "3DES" in stripped or "DES" in stripped
                has_aes = "AES" in stripped

                algos = []
                if has_rsa:
                    algos.append("RSA")
                if has_ecdhe:
                    algos.append("ECDHE")
                if has_3des:
                    algos.append("3DES")
                if has_aes:
                    algos.append("AES")

                findings.append({
                    "algorithm": "Cipher Suite (" + "/".join(algos) + ")" if algos else "Configured Cipher Suite",
                    "category": "Cryptographic Protocol",
                    "usage": "Transport Layer Cipher Suite Negotiation",
                    "library": "OpenSSL / Proxy Engine",
                    "file": relative_path,
                    "line_number": line_idx,
                    "code_snippet": stripped[:120],
                    "evidence": f"Cipher Suite Directive: '{stripped[:90]}'",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": 256 if "256" in stripped else (128 if "128" in stripped else None),
                    "mode": "GCM" if "GCM" in stripped else ("CBC" if "CBC" in stripped else None)
                })

            # OpenSSL config default bits
            if re.search(r"\bdefault_bits\s*=\s*(\d+)\b", stripped):
                m = re.search(r"\bdefault_bits\s*=\s*(\d+)\b", stripped)
                bits = int(m.group(1)) if m else 2048
                findings.append({
                    "algorithm": "RSA (OpenSSL Configuration Default)",
                    "category": "Asymmetric Cryptography",
                    "usage": "Key Generation Default",
                    "library": "OpenSSL CLI / Config",
                    "file": relative_path,
                    "line_number": line_idx,
                    "code_snippet": stripped[:120],
                    "evidence": f"OpenSSL default_bits parameter = {bits}",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": bits,
                    "mode": None
                })

        return findings

config_analyzer = ConfigAnalyzer()
