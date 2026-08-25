import os
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.cbom.cbom_model import ConfidenceLevel

# Safe Certificate and Key Parsing using cryptography library
try:
    from cryptography import x509
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives.asymmetric import rsa, ec, ed25519, ed448, dsa
    from cryptography.hazmat.primitives import serialization
    HAVE_CRYPTO = True
except ImportError:
    HAVE_CRYPTO = False

class CertificateAnalyzer:

    @classmethod
    def scan_certificate_or_key(cls, file_name: str, relative_path: str, raw_bytes: bytes) -> List[Dict[str, Any]]:
        findings = []
        lower_name = file_name.lower()
        is_cert = lower_name.endswith((".pem", ".crt", ".cer", ".der", ".p12", ".pfx"))
        is_pub_key = lower_name.endswith((".pub", ".key")) or "id_rsa" in lower_name or "id_ecdsa" in lower_name or "id_ed25519" in lower_name

        if not (is_cert or is_pub_key):
            # Check if file text contains PEM markers
            try:
                text = raw_bytes.decode("utf-8", errors="ignore")
                if "BEGIN CERTIFICATE" in text or "BEGIN PUBLIC KEY" in text or "BEGIN RSA PUBLIC KEY" in text or "BEGIN PRIVATE KEY" in text:
                    is_cert = "BEGIN CERTIFICATE" in text
                    is_pub_key = not is_cert
            except Exception:
                pass

        if not (is_cert or is_pub_key):
            return []

        # 1. Attempt X.509 Certificate parsing
        if is_cert and HAVE_CRYPTO:
            cert_findings = cls._parse_x509(raw_bytes, relative_path)
            if cert_findings:
                return cert_findings

        # 2. Attempt Public/Private Key Header & Metadata inspection (SAFE METADATA ONLY - NO SECRETS)
        key_findings = cls._parse_key_metadata(raw_bytes, relative_path)
        if key_findings:
            return key_findings

        return []

    @classmethod
    def _parse_x509(cls, raw_bytes: bytes, relative_path: str) -> List[Dict[str, Any]]:
        try:
            # Try PEM first
            try:
                cert = x509.load_pem_x509_certificate(raw_bytes, default_backend())
            except Exception:
                # Try DER
                cert = x509.load_der_x509_certificate(raw_bytes, default_backend())

            pub_key = cert.public_key()
            algo = "Unknown Public Key"
            category = "Asymmetric Cryptography"
            key_size = None
            curve = None

            if isinstance(pub_key, rsa.RSAPublicKey):
                algo = "RSA"
                key_size = pub_key.key_size
            elif isinstance(pub_key, ec.EllipticCurvePublicKey):
                algo = "ECC"
                key_size = pub_key.key_size
                curve = pub_key.curve.name
            elif isinstance(pub_key, ed25519.Ed25519PublicKey):
                algo = "Ed25519"
                key_size = 256
            elif isinstance(pub_key, ed448.Ed448PublicKey):
                algo = "Ed448"
                key_size = 448
            elif isinstance(pub_key, dsa.DSAPublicKey):
                algo = "DSA"
                key_size = pub_key.key_size

            # Subject & Issuer
            subject_str = cert.subject.rfc4514_string()
            issuer_str = cert.issuer.rfc4514_string()
            sig_algo = cert.signature_algorithm_oid._name if hasattr(cert.signature_algorithm_oid, "_name") else str(cert.signature_algorithm_oid.dotted_string)

            # Validity
            not_before = getattr(cert, "not_valid_before_utc", None)
            if not not_before and hasattr(cert, "not_valid_before"):
                not_before = cert.not_valid_before.replace(tzinfo=timezone.utc)
            not_after = getattr(cert, "not_valid_after_utc", None)
            if not not_after and hasattr(cert, "not_valid_after"):
                not_after = cert.not_valid_after.replace(tzinfo=timezone.utc)

            validity_info = f"Valid: {not_before.strftime('%Y-%m-%d') if not_before else 'N/A'} to {not_after.strftime('%Y-%m-%d') if not_after else 'N/A'}"
            now = datetime.now(timezone.utc)
            is_expired = not_after < now if not_after else False

            snippet = f"X.509 Certificate | Subject: {subject_str[:50]} | Issuer: {issuer_str[:40]} | SigAlgo: {sig_algo} | {validity_info}"

            return [{
                "algorithm": algo,
                "category": "Key / Certificate",
                "usage": "PKI / Digital Identity & TLS Certificate",
                "library": "X.509 Certificate Store",
                "file": relative_path,
                "line_number": 1,
                "code_snippet": snippet,
                "evidence": f"X.509 Cert ({algo}-{key_size or ''} bits, Sig: {sig_algo}) Subject: {subject_str[:40]}",
                "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                "key_size": key_size,
                "curve": curve,
                "mode": None
            }]
        except Exception:
            return []

    @classmethod
    def _parse_key_metadata(cls, raw_bytes: bytes, relative_path: str) -> List[Dict[str, Any]]:
        findings = []
        try:
            text = raw_bytes.decode("utf-8", errors="ignore")
            # RSA Private / Public Key Header
            if "BEGIN RSA PRIVATE KEY" in text or "BEGIN RSA PUBLIC KEY" in text or "ssh-rsa" in text:
                key_size = 2048
                if len(text) > 2500:
                    key_size = 4096
                elif len(text) < 1200:
                    key_size = 1024
                findings.append({
                    "algorithm": "RSA",
                    "category": "Key / Certificate",
                    "usage": "Asymmetric Keypair",
                    "library": "PEM / OpenSSH Key Store",
                    "file": relative_path,
                    "line_number": 1,
                    "code_snippet": "RSA Key Object [SAFE METADATA: Secret Content Redacted]",
                    "evidence": f"RSA Key File ({key_size}-bit estimated from structure)",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": key_size,
                    "mode": None
                })
            # EC Key Header
            elif "BEGIN EC PRIVATE KEY" in text or "BEGIN EC PUBLIC KEY" in text or "ecdsa-sha2" in text:
                findings.append({
                    "algorithm": "ECC",
                    "category": "Key / Certificate",
                    "usage": "Elliptic Curve Keypair",
                    "library": "PEM / OpenSSH Key Store",
                    "file": relative_path,
                    "line_number": 1,
                    "code_snippet": "EC Key Object [SAFE METADATA: Secret Content Redacted]",
                    "evidence": "EC Key Object (ECDSA / ECDH curve)",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": 256,
                    "curve": "P-256 / secp256r1",
                    "mode": None
                })
            # Ed25519 Key
            elif "ssh-ed25519" in text:
                findings.append({
                    "algorithm": "Ed25519",
                    "category": "Key / Certificate",
                    "usage": "Edwards Curve SSH Authentication Key",
                    "library": "OpenSSH Key Store",
                    "file": relative_path,
                    "line_number": 1,
                    "code_snippet": "ssh-ed25519 Key [SAFE METADATA: Public Identifier Only]",
                    "evidence": "OpenSSH Ed25519 Key Format",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": 256,
                    "mode": None
                })
            # Generic PKCS#8 Private Key
            elif "BEGIN PRIVATE KEY" in text or "BEGIN ENCRYPTED PRIVATE KEY" in text:
                findings.append({
                    "algorithm": "RSA / ECC (PKCS#8)",
                    "category": "Key / Certificate",
                    "usage": "PKCS#8 Private Key Container",
                    "library": "PKCS#8 Key Store",
                    "file": relative_path,
                    "line_number": 1,
                    "code_snippet": "PKCS#8 Container [SAFE METADATA: Secret Content Redacted]",
                    "evidence": "PKCS#8 Key Header Structure",
                    "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                    "key_size": 2048,
                    "mode": None
                })
        except Exception:
            pass

        return findings

certificate_analyzer = CertificateAnalyzer()
