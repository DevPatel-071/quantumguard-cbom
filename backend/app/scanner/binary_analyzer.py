import re
from typing import List, Dict, Any
from app.cbom.cbom_model import ConfidenceLevel

KNOWN_BINARY_SYMBOLS = [
    {"pattern": b"RSA_generate_key_ex", "algorithm": "RSA", "category": "Asymmetric Cryptography", "usage": "Key Generation"},
    {"pattern": b"RSA_sign", "algorithm": "RSA", "category": "Asymmetric Cryptography", "usage": "Digital Signature"},
    {"pattern": b"ECDSA_sign", "algorithm": "ECDSA", "category": "Asymmetric Cryptography", "usage": "Digital Signature"},
    {"pattern": b"ECDH_compute_key", "algorithm": "ECDH", "category": "Asymmetric Cryptography", "usage": "Key Agreement"},
    {"pattern": b"EVP_aes_256_gcm", "algorithm": "AES-256-GCM", "category": "Symmetric Cryptography", "usage": "Bulk Encryption"},
    {"pattern": b"EVP_sha256", "algorithm": "SHA-256", "category": "Cryptographic Hash Function", "usage": "Integrity / Hashing"},
    {"pattern": b"OpenSSL", "algorithm": "OpenSSL Library Symbol", "category": "Cryptographic Library", "usage": "General Cryptography"},
    {"pattern": b"libcrypto", "algorithm": "libcrypto Runtime", "category": "Cryptographic Library", "usage": "General Cryptography"},
    {"pattern": b"OQS_KEM_kyber", "algorithm": "ML-KEM", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Key Encapsulation"},
    {"pattern": b"ML_DSA_65", "algorithm": "ML-DSA", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Digital Signature"}
]

class BinaryAnalyzer:

    @classmethod
    def scan_binary(cls, file_name: str, relative_path: str, raw_bytes: bytes) -> List[Dict[str, Any]]:
        findings = []
        lower_name = file_name.lower()
        is_binary = lower_name.endswith((".so", ".dll", ".dylib", ".exe", ".bin", ".a", ".o", ".node", ".wasm"))
        
        if not is_binary and len(raw_bytes) > 4:
            # Check magic bytes for ELF (0x7F 'E' 'L' 'F'), PE ('M' 'Z'), Mach-O (0xFE 0xED 0xFA / 0xCF 0xFA 0xED 0xFE)
            if raw_bytes.startswith(b"\x7fELF") or raw_bytes.startswith(b"MZ") or raw_bytes.startswith(b"\xca\xfe\xba\xbe"):
                is_binary = True

        if not is_binary:
            return []

        # Search for known cryptographic symbols and strings in binary bytes
        seen_algos = set()
        for sym in KNOWN_BINARY_SYMBOLS:
            if sym["pattern"] in raw_bytes:
                algo = sym["algorithm"]
                if algo not in seen_algos:
                    seen_algos.add(algo)
                    pattern_str = sym["pattern"].decode("ascii", errors="ignore")
                    findings.append({
                        "algorithm": algo,
                        "category": sym["category"],
                        "usage": sym["usage"],
                        "library": "Compiled Binary / Native Symbol Table",
                        "file": relative_path,
                        "line_number": 1,
                        "code_snippet": f"Binary Exported Symbol / Embedded String: '{pattern_str}'",
                        "evidence": f"Native binary symbol reference '{pattern_str}' detected in compiled artifact",
                        "confidence": ConfidenceLevel.INFERRED,
                        "key_size": 256 if "256" in algo else None,
                        "mode": "GCM" if "GCM" in algo else None
                    })

        return findings

binary_analyzer = BinaryAnalyzer()
