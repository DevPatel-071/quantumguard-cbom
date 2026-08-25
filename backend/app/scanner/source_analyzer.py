import re
import os
import ast
from typing import List, Dict, Any, Optional
from app.cbom.cbom_model import ConfidenceLevel

# Regex patterns per language/framework
LANGUAGE_PATTERNS = {
    "c_cpp": [
        # RSA
        {
            "regex": r"\b(RSA_generate_key_ex|RSA_sign|RSA_verify|RSA_public_encrypt|RSA_private_decrypt|RSA_new|RSA_size)\b",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Encryption",
            "library": "OpenSSL / libcrypto",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # ECC / ECDSA / ECDH
        {
            "regex": r"\b(ECDSA_sign|ECDSA_verify|ECDSA_do_sign|ECDSA_do_verify|EC_KEY_new_by_curve_name|EC_KEY_generate_key)\b",
            "algorithm": "ECDSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"\b(ECDH_compute_key|EVP_PKEY_derive|EC_KEY_generate_key)\b",
            "algorithm": "ECDH",
            "category": "Asymmetric Cryptography",
            "usage": "Key Agreement",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Diffie-Hellman
        {
            "regex": r"\b(DH_generate_key|DH_compute_key|DH_generate_parameters_ex|DH_new)\b",
            "algorithm": "Diffie-Hellman",
            "category": "Asymmetric Cryptography",
            "usage": "Key Agreement",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # AES
        {
            "regex": r"\b(EVP_aes_(128|192|256)_(gcm|cbc|ctr|xts|ecb)|AES_set_encrypt_key|AES_encrypt|AES_cbc_encrypt)\b",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # 3DES / DES
        {
            "regex": r"\b(EVP_des_ede3_(cbc|ecb)|DES_ecb_encrypt|DES_ede3_cbc_encrypt)\b",
            "algorithm": "3DES",
            "category": "Symmetric Cryptography",
            "usage": "Legacy Bulk Encryption",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # SHA / Hashes
        {
            "regex": r"\b(EVP_sha1|SHA1_Init|SHA1_Update|SHA1_Final)\b",
            "algorithm": "SHA-1",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"\b(EVP_sha256|SHA256_Init|SHA256_Update|SHA256_Final)\b",
            "algorithm": "SHA-256",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"\b(EVP_sha384|EVP_sha512|SHA512_Init|SHA512_Update)\b",
            "algorithm": "SHA-512",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # PQC (liboqs / BoringSSL / FIPS PQC)
        {
            "regex": r"\b(OQS_KEM_kyber_768|OQS_KEM_ml_kem_768|ML_KEM_768_encapsulate|OQS_KEM_new|OQS_KEM_keypair)\b",
            "algorithm": "ML-KEM",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Key Establishment",
            "library": "liboqs / FIPS 203",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"\b(OQS_SIG_dilithium_3|OQS_SIG_ml_dsa_65|ML_DSA_65_sign|OQS_SIG_new|OQS_SIG_keypair)\b",
            "algorithm": "ML-DSA",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Digital Signature",
            "library": "liboqs / FIPS 204",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"\b(OQS_SIG_sphincs|SLH_DSA_SHA2_128s_sign)\b",
            "algorithm": "SLH-DSA",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Digital Signature",
            "library": "liboqs / FIPS 205",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # General OpenSSL Headers
        {
            "regex": r"#include\s*<openssl/(rsa|ec|evp|aes|sha|dh|ssl)\.h>",
            "algorithm": "OpenSSL Generic",
            "category": "Cryptographic Library",
            "usage": "Cryptographic Services",
            "library": "OpenSSL",
            "confidence": ConfidenceLevel.POTENTIAL_USAGE
        }
    ],
    "python": [
        # Python cryptography RSA
        {
            "regex": r"rsa\.generate_private_key\s*\(|from\s+cryptography\.hazmat\.primitives\.asymmetric\s+import\s+rsa",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Key Exchange",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Python cryptography EC
        {
            "regex": r"ec\.generate_private_key\s*\(|from\s+cryptography\.hazmat\.primitives\.asymmetric\s+import\s+ec|SECP256R1|SECP384R1|SECP521R1|SECP256K1",
            "algorithm": "ECC",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / ECDH",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Ed25519
        {
            "regex": r"ed25519\.Ed25519PrivateKey\.generate|from\s+cryptography\.hazmat\.primitives\.asymmetric\s+import\s+ed25519",
            "algorithm": "Ed25519",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # X25519
        {
            "regex": r"x25519\.X25519PrivateKey\.generate|from\s+cryptography\.hazmat\.primitives\.asymmetric\s+import\s+x25519",
            "algorithm": "X25519",
            "category": "Asymmetric Cryptography",
            "usage": "Key Agreement",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # PyCryptodome / Crypto
        {
            "regex": r"from\s+Crypto\.PublicKey\s+import\s+RSA|RSA\.generate\(",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Key Exchange",
            "library": "PyCryptodome",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"from\s+Crypto\.Cipher\s+import\s+AES|AES\.new\(",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "PyCryptodome",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"from\s+Crypto\.Cipher\s+import\s+DES3|DES3\.new\(",
            "algorithm": "3DES",
            "category": "Symmetric Cryptography",
            "usage": "Legacy Bulk Encryption",
            "library": "PyCryptodome",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # AES in cryptography
        {
            "regex": r"algorithms\.AES\s*\(|modes\.GCM\s*\(|modes\.CBC\s*\(",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # ChaCha20
        {
            "regex": r"algorithms\.ChaCha20\s*\(|ChaCha20Poly1305\s*\(",
            "algorithm": "ChaCha20",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Hashlib
        {
            "regex": r"hashlib\.sha1\s*\(",
            "algorithm": "SHA-1",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Python hashlib",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"hashlib\.md5\s*\(",
            "algorithm": "MD5",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Python hashlib",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"hashlib\.sha256\s*\(",
            "algorithm": "SHA-256",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Python hashlib",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"hashlib\.sha384\s*\(|hashlib\.sha512\s*\(",
            "algorithm": "SHA-512",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Python hashlib",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # PQC (kyber-py, pqcrypto)
        {
            "regex": r"from\s+pqcrypto\.kem\s+import\s+kyber|kyber768\.generate_keypair|ML_KEM",
            "algorithm": "ML-KEM",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Key Establishment",
            "library": "pqcrypto / kyber-py",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"from\s+pqcrypto\.sign\s+import\s+dilithium|dilithium3\.generate_keypair|ML_DSA",
            "algorithm": "ML-DSA",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Digital Signature",
            "library": "pqcrypto / dilithium",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # General imports
        {
            "regex": r"import\s+cryptography|from\s+cryptography\b",
            "algorithm": "Python Cryptography",
            "category": "Cryptographic Library",
            "usage": "Cryptographic Operations",
            "library": "Python cryptography",
            "confidence": ConfidenceLevel.POTENTIAL_USAGE
        }
    ],
    "java": [
        # RSA
        {
            "regex": r"KeyPairGenerator\.getInstance\s*\(\s*\"RSA\"\s*\)|Cipher\.getInstance\s*\(\s*\"RSA[^\"]*\"\s*\)|Signature\.getInstance\s*\(\s*\"[^\"]*withRSA\"\s*\)",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Public-Key Encryption",
            "library": "Java JCA/JCE",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # ECC / ECDSA / ECDH
        {
            "regex": r"KeyPairGenerator\.getInstance\s*\(\s*\"EC\"\s*\)|Signature\.getInstance\s*\(\s*\"[^\"]*withECDSA\"\s*\)|KeyAgreement\.getInstance\s*\(\s*\"ECDH\"\s*\)",
            "algorithm": "ECC",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Key Agreement",
            "library": "Java JCA/JCE",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # AES
        {
            "regex": r"Cipher\.getInstance\s*\(\s*\"AES(/[A-Z0-9]+(/[A-Z0-9]+)?)?\"\s*\)|KeyGenerator\.getInstance\s*\(\s*\"AES\"\s*\)",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Java JCA/JCE",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # 3DES / DES
        {
            "regex": r"Cipher\.getInstance\s*\(\s*\"(DESede|DES)/[^\"]*\"\s*\)",
            "algorithm": "3DES",
            "category": "Symmetric Cryptography",
            "usage": "Legacy Bulk Encryption",
            "library": "Java JCA/JCE",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # MessageDigest
        {
            "regex": r"MessageDigest\.getInstance\s*\(\s*\"SHA-?1\"\s*\)",
            "algorithm": "SHA-1",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Java JCA",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"MessageDigest\.getInstance\s*\(\s*\"SHA-?256\"\s*\)",
            "algorithm": "SHA-256",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Java JCA",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"MessageDigest\.getInstance\s*\(\s*\"SHA-?(384|512)\"\s*\)",
            "algorithm": "SHA-512",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Java JCA",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Bouncy Castle PQC
        {
            "regex": r"org\.bouncycastle\.pqc\.jcajce|MLKEMKeyPairGenerator|MLDSAKeyPairGenerator",
            "algorithm": "ML-KEM",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Key Establishment",
            "library": "Bouncy Castle PQC",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # General imports
        {
            "regex": r"import\s+javax\.crypto\.|import\s+java\.security\.",
            "algorithm": "Java Security API",
            "category": "Cryptographic Library",
            "usage": "Security Services",
            "library": "Java Security",
            "confidence": ConfidenceLevel.POTENTIAL_USAGE
        }
    ],
    "javascript": [
        # RSA in Node
        {
            "regex": r"crypto\.generateKeyPairSync\s*\(\s*['\"]rsa['\"]|crypto\.createSign\s*\(\s*['\"]RSA-[^\"]*['\"]\)|crypto\.publicEncrypt|crypto\.privateDecrypt",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Public-Key Encryption",
            "library": "Node.js crypto",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # ECDSA / ECDH in Node
        {
            "regex": r"crypto\.createECDH\s*\(|crypto\.generateKeyPairSync\s*\(\s*['\"]ec['\"]|crypto\.createSign\s*\(\s*['\"]SHA256['\"].*ec",
            "algorithm": "ECC",
            "category": "Asymmetric Cryptography",
            "usage": "Key Agreement / Signature",
            "library": "Node.js crypto",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Ed25519
        {
            "regex": r"crypto\.generateKeyPairSync\s*\(\s*['\"]ed25519['\"]",
            "algorithm": "Ed25519",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "Node.js crypto",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # AES
        {
            "regex": r"crypto\.createCipheriv\s*\(\s*['\"]aes-(128|192|256)-(gcm|cbc|ctr)['\"]|CryptoJS\.AES\.encrypt",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # 3DES / DES
        {
            "regex": r"crypto\.createCipheriv\s*\(\s*['\"]des-ede3-[a-z]+['\"]|CryptoJS\.TripleDES\.encrypt",
            "algorithm": "3DES",
            "category": "Symmetric Cryptography",
            "usage": "Legacy Bulk Encryption",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # Hashes
        {
            "regex": r"crypto\.createHash\s*\(\s*['\"]sha1['\"]\)|CryptoJS\.SHA1",
            "algorithm": "SHA-1",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"crypto\.createHash\s*\(\s*['\"]md5['\"]\)|CryptoJS\.MD5",
            "algorithm": "MD5",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"crypto\.createHash\s*\(\s*['\"]sha256['\"]\)|CryptoJS\.SHA256",
            "algorithm": "SHA-256",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"crypto\.createHash\s*\(\s*['\"]sha(384|512)['\"]\)|CryptoJS\.SHA512",
            "algorithm": "SHA-512",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Node.js crypto / CryptoJS",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        # General imports
        {
            "regex": r"require\s*\(\s*['\"]crypto['\"]\)|import\s+crypto\s+from\s+['\"]crypto['\"]",
            "algorithm": "Node.js Crypto API",
            "category": "Cryptographic Library",
            "usage": "Cryptographic Services",
            "library": "Node.js crypto",
            "confidence": ConfidenceLevel.POTENTIAL_USAGE
        }
    ],
    "go": [
        {
            "regex": r"rsa\.GenerateKey|rsa\.SignPKCS1v15|rsa\.SignPSS|rsa\.EncryptOAEP",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Key Encapsulation",
            "library": "Go crypto/rsa",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"ecdsa\.GenerateKey|ecdsa\.SignASN1|elliptic\.P256\(\)|elliptic\.P384\(\)",
            "algorithm": "ECC",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "Go crypto/ecdsa",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"ed25519\.GenerateKey|ed25519\.Sign",
            "algorithm": "Ed25519",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "Go crypto/ed25519",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"ecdh\.X25519\(\)|ecdh\.P256\(\)",
            "algorithm": "X25519",
            "category": "Asymmetric Cryptography",
            "usage": "Key Agreement",
            "library": "Go crypto/ecdh",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"aes\.NewCipher|cipher\.NewGCM",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Go crypto/aes",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"sha256\.New\(\)|sha256\.Sum256",
            "algorithm": "SHA-256",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Go crypto/sha256",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"sha512\.New\(\)|sha512\.Sum512",
            "algorithm": "SHA-512",
            "category": "Cryptographic Hash Function",
            "usage": "Integrity / Hashing",
            "library": "Go crypto/sha512",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"circl/pqc/kyber|circl/pqc/dilithium",
            "algorithm": "ML-KEM",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Key Establishment / Signature",
            "library": "Cloudflare CIRCL PQC",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        }
    ],
    "rust": [
        {
            "regex": r"RsaPrivateKey::new|rsa::RsaPrivateKey|rsa::PublicKey",
            "algorithm": "RSA",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature / Public-Key Encryption",
            "library": "Rust rsa crate",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"Aes256Gcm::new|Aes128Gcm::new|aes_gcm::AesGcm",
            "algorithm": "AES",
            "category": "Symmetric Cryptography",
            "usage": "Bulk Encryption",
            "library": "Rust aes-gcm crate",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"ed25519_dalek::SigningKey|ed25519_dalek::Keypair",
            "algorithm": "Ed25519",
            "category": "Asymmetric Cryptography",
            "usage": "Digital Signature",
            "library": "Rust ed25519-dalek",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        },
        {
            "regex": r"pqcrypto_kyber::|pqcrypto_dilithium::",
            "algorithm": "ML-KEM",
            "category": "Post-Quantum Cryptography (NIST Standard)",
            "usage": "Post-Quantum Cryptography",
            "library": "Rust pqcrypto crate",
            "confidence": ConfidenceLevel.CONFIRMED_USAGE
        }
    ]
}

def detect_language(file_path: str) -> Optional[str]:
    ext = os.path.splitext(file_path)[1].lower()
    if ext in [".c", ".cpp", ".cc", ".cxx", ".h", ".hpp"]:
        return "c_cpp"
    elif ext in [".py", ".pyw"]:
        return "python"
    elif ext in [".java"]:
        return "java"
    elif ext in [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]:
        return "javascript"
    elif ext in [".go"]:
        return "go"
    elif ext in [".rs"]:
        return "rust"
    return None

def extract_key_size_and_mode(line: str) -> (Optional[int], Optional[str]):
    key_size = None
    mode = None
    
    # Key sizes
    if re.search(r"\b(4096|3072|2048|1024|512|384|256|192|128)\b", line):
        m = re.search(r"\b(4096|3072|2048|1024|512|384|256|192|128)\b", line)
        if m:
            key_size = int(m.group(1))

    # Modes
    if re.search(r"\b(GCM|CBC|CTR|ECB|CFB|OFB|OAEP|PSS|PKCS1)\b", line, re.IGNORECASE):
        m = re.search(r"\b(GCM|CBC|CTR|ECB|CFB|OFB|OAEP|PSS|PKCS1)\b", line, re.IGNORECASE)
        if m:
            mode = m.group(1).upper()

    return key_size, mode

class SourceCodeAnalyzer:

    @classmethod
    def scan_file(cls, file_path: str, relative_path: str, content: str) -> List[Dict[str, Any]]:
        lang = detect_language(file_path)
        if not lang:
            return []

        findings = []
        lines = content.splitlines()
        patterns = LANGUAGE_PATTERNS.get(lang, [])

        # Python AST analysis for extra accuracy if python
        if lang == "python":
            cls._ast_analyze_python(content, relative_path, findings)

        # Pattern-based analysis
        for line_idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("//") or stripped.startswith("#") and not ("include" in stripped or "import" in stripped):
                # skip pure comments
                continue

            for pat in patterns:
                match = re.search(pat["regex"], line)
                if match:
                    k_size, m_val = extract_key_size_and_mode(line)
                    matched_text = match.group(0)
                    
                    # Refine key size for specific names like aes-256-gcm or EVP_aes_256_gcm
                    if "256" in matched_text:
                        k_size = 256
                    elif "128" in matched_text:
                        k_size = 128
                    elif "192" in matched_text:
                        k_size = 192
                    elif "2048" in matched_text:
                        k_size = 2048
                    elif "4096" in matched_text:
                        k_size = 4096

                    # Extract mode from matched text if present
                    if "gcm" in matched_text.lower():
                        m_val = "GCM"
                    elif "cbc" in matched_text.lower():
                        m_val = "CBC"
                    elif "ctr" in matched_text.lower():
                        m_val = "CTR"

                    findings.append({
                        "algorithm": pat["algorithm"],
                        "category": pat["category"],
                        "usage": pat["usage"],
                        "library": pat["library"],
                        "file": relative_path,
                        "line_number": line_idx,
                        "code_snippet": stripped[:140],
                        "evidence": f"{matched_text} in line {line_idx}",
                        "confidence": pat["confidence"],
                        "key_size": k_size,
                        "mode": m_val
                    })

        # Deduplicate multiple findings on identical algorithm in same line
        unique_findings = []
        seen = set()
        for f in findings:
            key = (f["file"], f["line_number"], f["algorithm"])
            if key not in seen:
                seen.add(key)
                unique_findings.append(f)

        return unique_findings

    @classmethod
    def _ast_analyze_python(cls, content: str, relative_path: str, findings: List[Dict[str, Any]]):
        try:
            tree = ast.parse(content)
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    # Check for rsa.generate_private_key
                    func_name = ""
                    if isinstance(node.func, ast.Attribute):
                        func_name = node.func.attr
                    elif isinstance(node.func, ast.Name):
                        func_name = node.func.id
                        
                    if func_name in ["generate_private_key", "generate", "new", "encrypt", "decrypt", "sign", "verify"]:
                        # Extract key size from call arguments if integer constant is present
                        for arg in node.args:
                            if isinstance(arg, ast.Constant) and isinstance(arg.value, int):
                                if arg.value in [1024, 2048, 3072, 4096]:
                                    findings.append({
                                        "algorithm": "RSA",
                                        "category": "Asymmetric Cryptography",
                                        "usage": "Key Generation",
                                        "library": "Python cryptography / PyCryptodome",
                                        "file": relative_path,
                                        "line_number": getattr(node, "lineno", 1),
                                        "code_snippet": f"Key generation with size {arg.value}",
                                        "evidence": f"AST Call {func_name}(key_size={arg.value})",
                                        "confidence": ConfidenceLevel.CONFIRMED_USAGE,
                                        "key_size": arg.value,
                                        "mode": None
                                    })
        except Exception:
            pass

source_analyzer = SourceCodeAnalyzer()
