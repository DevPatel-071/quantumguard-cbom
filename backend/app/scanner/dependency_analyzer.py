import os
import re
import json
from typing import List, Dict, Any
from app.cbom.cbom_model import ConfidenceLevel

KNOWN_CRYPTO_DEPENDENCIES = {
    # Python
    "cryptography": {"algorithm": "Generic Cryptography (RSA/ECC/AES)", "category": "Cryptographic Library", "usage": "Comprehensive Cryptography Suite"},
    "pycryptodome": {"algorithm": "Generic Cryptography (RSA/AES/3DES)", "category": "Cryptographic Library", "usage": "Cryptographic Primitives"},
    "pycrypto": {"algorithm": "Legacy Cryptography (RSA/DES)", "category": "Cryptographic Library", "usage": "Legacy Primitives"},
    "rsa": {"algorithm": "RSA", "category": "Asymmetric Cryptography", "usage": "Digital Signature / Public-Key Encryption"},
    "ecdsa": {"algorithm": "ECDSA", "category": "Asymmetric Cryptography", "usage": "Digital Signature"},
    "pynacl": {"algorithm": "Ed25519 / ChaCha20", "category": "Asymmetric & Symmetric Cryptography", "usage": "Modern Cryptography (libsodium)"},
    "pqcrypto": {"algorithm": "ML-KEM / ML-DSA", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Post-Quantum Primitives"},
    "kyber-py": {"algorithm": "ML-KEM", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Key Encapsulation"},
    "paramiko": {"algorithm": "SSH Protocol (RSA/ECDSA/AES)", "category": "Cryptographic Protocol", "usage": "SSH Protocol"},
    "pyopenssl": {"algorithm": "OpenSSL Wrapper (TLS/RSA/ECC)", "category": "Cryptographic Library", "usage": "OpenSSL Python Bindings"},
    
    # JavaScript / Node.js
    "crypto-js": {"algorithm": "AES / SHA / 3DES / MD5", "category": "Cryptographic Library", "usage": "Client/Server Cryptography"},
    "node-forge": {"algorithm": "RSA / TLS / X.509 / AES", "category": "Cryptographic Library", "usage": "Native JS Crypto Suite"},
    "elliptic": {"algorithm": "ECC (secp256k1/P-256)", "category": "Asymmetric Cryptography", "usage": "Elliptic Curve Operations"},
    "bcrypto": {"algorithm": "RSA / ECC / AES / ChaCha20", "category": "Cryptographic Library", "usage": "Bitcoin/General Crypto"},
    "tweetnacl": {"algorithm": "Ed25519 / Curve25519", "category": "Asymmetric Cryptography", "usage": "High-speed Public Key Crypto"},
    "bcrypt": {"algorithm": "Blowfish Key Derivation", "category": "Password Hashing", "usage": "Credential Storage"},
    "jsonwebtoken": {"algorithm": "JWT (RS256 / HS256 / ES256)", "category": "Cryptographic Token / Signature", "usage": "Auth Token Signing"},
    "jose": {"algorithm": "JWT / JWE / JWS (RSA/ECDSA/AES-GCM)", "category": "Cryptographic Standard", "usage": "JSON Object Signing & Encryption"},
    
    # Java
    "bcprov-jdk18on": {"algorithm": "Bouncy Castle Crypto Suite (RSA/ECC/PQC)", "category": "Cryptographic Library", "usage": "Java Cryptography Provider"},
    "bcpqc-jdk18on": {"algorithm": "ML-KEM / ML-DSA / SLH-DSA (Bouncy Castle)", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Post-Quantum Provider"},
    "spring-security-crypto": {"algorithm": "AES / Password Hashing", "category": "Cryptographic Library", "usage": "Spring Security Cryptography"},
    "jjwt": {"algorithm": "JWT (RSA/ECDSA)", "category": "Authentication Token", "usage": "JWT Signatures"},

    # Rust
    "rsa": {"algorithm": "RSA", "category": "Asymmetric Cryptography", "usage": "Pure Rust RSA"},
    "aes-gcm": {"algorithm": "AES-GCM", "category": "Symmetric Cryptography", "usage": "Authenticated Encryption"},
    "ed25519-dalek": {"algorithm": "Ed25519", "category": "Asymmetric Cryptography", "usage": "Fast Edwards Curve Signatures"},
    "ring": {"algorithm": "RSA / ECC / ChaCha20 / AES", "category": "Cryptographic Library", "usage": "BoringSSL-derived Rust Crypto"},
    "pqcrypto-kyber": {"algorithm": "ML-KEM", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Rust PQC KEM"},
    "pqcrypto-dilithium": {"algorithm": "ML-DSA", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Rust PQC Signatures"},

    # Go
    "golang.org/x/crypto": {"algorithm": "ChaCha20 / Ed25519 / SSH / Argon2", "category": "Cryptographic Library", "usage": "Extended Go Cryptography"},
    "github.com/cloudflare/circl": {"algorithm": "ML-KEM / ML-DSA / SIDH", "category": "Post-Quantum Cryptography (NIST Standard)", "usage": "Cloudflare CIRCL PQC Suite"}
}

class DependencyAnalyzer:

    @classmethod
    def scan_manifest(cls, file_name: str, relative_path: str, content: str) -> List[Dict[str, Any]]:
        findings = []
        lower_name = file_name.lower()

        # 1. requirements.txt / Pipfile / setup.py
        if "requirements" in lower_name or lower_name.endswith(".txt") or lower_name in ["pipfile", "setup.py", "pyproject.toml"]:
            for line_idx, line in enumerate(content.splitlines(), start=1):
                clean_line = line.strip().split("#")[0].strip()
                if not clean_line:
                    continue
                # match package name
                pkg_match = re.match(r"^([a-zA-Z0-9_\-\.]+)(?:[=<>!~]+([0-9a-zA-Z_\.\-]+))?", clean_line)
                if pkg_match:
                    pkg_name = pkg_match.group(1).lower().replace("_", "-")
                    pkg_ver = pkg_match.group(2) or "Unspecified"
                    if pkg_name in KNOWN_CRYPTO_DEPENDENCIES:
                        meta = KNOWN_CRYPTO_DEPENDENCIES[pkg_name]
                        findings.append({
                            "algorithm": meta["algorithm"],
                            "category": meta["category"],
                            "usage": meta["usage"],
                            "library": pkg_name,
                            "library_version": pkg_ver,
                            "file": relative_path,
                            "line_number": line_idx,
                            "code_snippet": clean_line,
                            "evidence": f"Dependency Manifest '{file_name}': {clean_line}",
                            "confidence": ConfidenceLevel.DEPENDENCY_ONLY,
                            "key_size": None,
                            "mode": None
                        })

        # 2. package.json
        elif lower_name == "package.json":
            try:
                data = json.loads(content)
                all_deps = {}
                all_deps.update(data.get("dependencies", {}))
                all_deps.update(data.get("devDependencies", {}))
                all_deps.update(data.get("peerDependencies", {}))
                
                for pkg_name, version in all_deps.items():
                    norm_pkg = pkg_name.lower()
                    if norm_pkg in KNOWN_CRYPTO_DEPENDENCIES:
                        meta = KNOWN_CRYPTO_DEPENDENCIES[norm_pkg]
                        findings.append({
                            "algorithm": meta["algorithm"],
                            "category": meta["category"],
                            "usage": meta["usage"],
                            "library": pkg_name,
                            "library_version": str(version),
                            "file": relative_path,
                            "line_number": 1,
                            "code_snippet": f'"{pkg_name}": "{version}"',
                            "evidence": f"package.json dependency: {pkg_name}@{version}",
                            "confidence": ConfidenceLevel.DEPENDENCY_ONLY,
                            "key_size": None,
                            "mode": None
                        })
            except Exception:
                pass

        # 3. pom.xml / build.gradle
        elif lower_name in ["pom.xml", "build.gradle", "build.gradle.kts"]:
            for line_idx, line in enumerate(content.splitlines(), start=1):
                for pkg_name, meta in KNOWN_CRYPTO_DEPENDENCIES.items():
                    if pkg_name in line.lower():
                        findings.append({
                            "algorithm": meta["algorithm"],
                            "category": meta["category"],
                            "usage": meta["usage"],
                            "library": pkg_name,
                            "library_version": "Build Manifest",
                            "file": relative_path,
                            "line_number": line_idx,
                            "code_snippet": line.strip()[:120],
                            "evidence": f"Build file dependency: {line.strip()[:100]}",
                            "confidence": ConfidenceLevel.DEPENDENCY_ONLY,
                            "key_size": None,
                            "mode": None
                        })

        # 4. Cargo.toml
        elif lower_name == "cargo.toml":
            for line_idx, line in enumerate(content.splitlines(), start=1):
                for pkg_name, meta in KNOWN_CRYPTO_DEPENDENCIES.items():
                    if re.search(rf"^{re.escape(pkg_name)}\s*=", line.strip()):
                        findings.append({
                            "algorithm": meta["algorithm"],
                            "category": meta["category"],
                            "usage": meta["usage"],
                            "library": pkg_name,
                            "library_version": "Cargo",
                            "file": relative_path,
                            "line_number": line_idx,
                            "code_snippet": line.strip()[:120],
                            "evidence": f"Cargo.toml dependency: {line.strip()}",
                            "confidence": ConfidenceLevel.DEPENDENCY_ONLY,
                            "key_size": None,
                            "mode": None
                        })

        # 5. go.mod
        elif lower_name == "go.mod":
            for line_idx, line in enumerate(content.splitlines(), start=1):
                for pkg_name, meta in KNOWN_CRYPTO_DEPENDENCIES.items():
                    if pkg_name in line:
                        findings.append({
                            "algorithm": meta["algorithm"],
                            "category": meta["category"],
                            "usage": meta["usage"],
                            "library": pkg_name,
                            "library_version": "Go Module",
                            "file": relative_path,
                            "line_number": line_idx,
                            "code_snippet": line.strip()[:120],
                            "evidence": f"go.mod module: {line.strip()}",
                            "confidence": ConfidenceLevel.DEPENDENCY_ONLY,
                            "key_size": None,
                            "mode": None
                        })

        return findings

dependency_analyzer = DependencyAnalyzer()
