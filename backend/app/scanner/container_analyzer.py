import re
from typing import List, Dict, Any
from app.cbom.cbom_model import ConfidenceLevel

class ContainerAnalyzer:

    @classmethod
    def scan_container_file(cls, file_name: str, relative_path: str, content: str) -> List[Dict[str, Any]]:
        findings = []
        lower_name = file_name.lower()
        if not ("dockerfile" in lower_name or "containerfile" in lower_name or "docker-compose" in lower_name):
            return []

        lines = content.splitlines()
        base_image = "Unknown"

        for line_idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if stripped.startswith("#"):
                continue

            # Detect Base Image
            if stripped.upper().startswith("FROM "):
                base_image = stripped.split()[1] if len(stripped.split()) > 1 else "Unknown"

            # Package installations
            if re.search(r"\b(apt-get|apt|apk|yum|dnf|pacman|zypper)\s+install.*\b(openssl|libssl-dev|libcrypto|gnutls|libsodium|ca-certificates)\b", stripped, re.IGNORECASE) or re.search(r"apk\s+add.*\b(openssl|libssl|libsodium)\b", stripped, re.IGNORECASE):
                matched_pkg = "OpenSSL / libcrypto"
                if "libsodium" in stripped:
                    matched_pkg = "libsodium"
                elif "gnutls" in stripped:
                    matched_pkg = "GnuTLS"

                findings.append({
                    "algorithm": "OpenSSL / TLS Suite (Container Package)",
                    "category": "Cryptographic Library",
                    "usage": "OS Cryptographic Runtime & Certificates",
                    "library": matched_pkg,
                    "library_version": f"Container Base: {base_image}",
                    "file": relative_path,
                    "line_number": line_idx,
                    "code_snippet": stripped[:120],
                    "evidence": f"Container package installation '{stripped[:80]}'",
                    "confidence": ConfidenceLevel.POTENTIAL_USAGE,
                    "key_size": None,
                    "mode": None
                })

            # Copying SSL/TLS certs into container
            if re.search(r"(COPY|ADD)\s+.*\.(pem|crt|key|cer)\b", stripped, re.IGNORECASE):
                findings.append({
                    "algorithm": "X.509 Certificate / Key Asset (Container Copy)",
                    "category": "Key / Certificate",
                    "usage": "Container TLS / Identity Store",
                    "library": "Container Filesystem",
                    "file": relative_path,
                    "line_number": line_idx,
                    "code_snippet": stripped[:120],
                    "evidence": f"Container certificate/key deployment: '{stripped[:80]}'",
                    "confidence": ConfidenceLevel.POTENTIAL_USAGE,
                    "key_size": None,
                    "mode": None
                })

        return findings

container_analyzer = ContainerAnalyzer()
