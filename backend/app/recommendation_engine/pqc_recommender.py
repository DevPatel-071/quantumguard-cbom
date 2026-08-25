from typing import Dict, Any, Tuple, Optional
from app.crypto_knowledge_base.kb_service import kb

class PQCRecommendationEngine:

    @classmethod
    def get_recommendation(
        cls,
        algorithm: str,
        usage: str,
        key_size: Optional[int] = None,
        business_criticality: str = "HIGH",
        exposure: str = "INTERNET_FACING"
    ) -> Tuple[str, str, str]:
        """
        Returns (recommended_pqc, hybrid_alternative, recommendation_rationale)
        """
        algo_upper = algorithm.upper()
        usage_lower = usage.lower()

        # Check KB first
        kb_entry = kb.get_algorithm(algorithm)
        
        # 1. Asymmetric Signatures (RSA, ECDSA, Ed25519)
        if any(sig_kw in algo_upper for sig_kw in ["RSA", "ECDSA", "ED25519", "ED448", "DSA", "EC"]) and ("sign" in usage_lower or "cert" in usage_lower or "auth" in usage_lower or "pki" in usage_lower):
            if "root" in usage_lower or "firmware" in usage_lower or "archival" in usage_lower:
                pqc = "SLH-DSA-SHA2-128s (NIST FIPS 205, Stateless Hash-Based Signatures)"
                hybrid = "Composite Dual Signature (RSA-4096 / ECDSA P-384 + SLH-DSA-128s)"
                reason = "For root certificates, firmware verification, and archival code-signing, SLH-DSA provides ultra-conservative security based purely on standard cryptographic hash functions without algebraic lattice assumptions."
            elif business_criticality == "CRITICAL" or (key_size and key_size >= 384):
                pqc = "ML-DSA-65 or ML-DSA-87 (NIST FIPS 204, NIST Security Level 3/5)"
                hybrid = "Composite Dual Signature (ECDSA P-384 + ML-DSA-65)"
                reason = "High-security production signature requirement: ML-DSA-65 provides fast verification and high post-quantum lattice security margins."
            else:
                pqc = "ML-DSA-65 (NIST FIPS 204 / CRYSTALS-Dilithium)"
                hybrid = "Hybrid Dual Signature (ECDSA P-256 + ML-DSA-44/65)"
                reason = "General-purpose digital signature standard: ML-DSA-65 delivers high throughput, rapid verification, and moderate signature overhead (~2.4 KB)."
            return pqc, hybrid, reason

        # 2. Key Establishment / Key Exchange (ECDH, X25519, RSA encryption, DH)
        if any(kex_kw in algo_upper for kex_kw in ["ECDH", "X25519", "DIFFIE", "DH", "RSA"]) or ("key agreement" in usage_lower or "kex" in usage_lower or "exchange" in usage_lower or "transport" in usage_lower):
            if business_criticality == "CRITICAL":
                pqc = "ML-KEM-1024 (NIST FIPS 203, NIST Security Level 5)"
                hybrid = "Hybrid KEM (X25519 + ML-KEM-768 / ML-KEM-1024 / X25519Kyber768)"
                reason = "Critical confidentiality requirement: Deploy Hybrid X25519+ML-KEM-768 immediately for defense-in-depth against both classical zero-days and quantum HNDL harvesting."
            else:
                pqc = "ML-KEM-768 (NIST FIPS 203 / CRYSTALS-Kyber)"
                hybrid = "Hybrid KEX (X25519 + ML-KEM-768 [X25519Kyber768])"
                reason = "Industry standard post-quantum KEM: Fast encapsulation (< 50 microseconds), 1,088-byte ciphertext, native support in TLS 1.3, OpenSSH, and BoringSSL."
            return pqc, hybrid, reason

        # 3. Symmetric Cryptography (AES, 3DES, DES, ChaCha20)
        if "3DES" in algo_upper or "DES" in algo_upper:
            return (
                "AES-256-GCM (NIST SP 800-38D)",
                "Direct upgrade to AES-256-GCM / ChaCha20-Poly1305 with ML-KEM key wrapping",
                "3DES/DES is cryptographically broken and obsolete. Migrate immediately to AES-256-GCM for both classical and 128-bit post-quantum Grover resistance."
            )
        if "AES" in algo_upper:
            if key_size and key_size <= 128:
                return (
                    "AES-256-GCM (NIST SP 800-38D)",
                    "AES-256-GCM with ML-KEM-768 derived symmetric keys",
                    "Upgrade AES-128 to AES-256. Grover's algorithm halves key strength to 64 bits for AES-128; AES-256 guarantees 128-bit quantum security."
                )
            else:
                return (
                    "Maintain AES-256-GCM (Quantum-Resistant)",
                    "Combine AES-256-GCM with Post-Quantum Key Encapsulation (ML-KEM-768)",
                    "AES-256 is already Post-Quantum safe against Grover's algorithm (128-bit quantum security margin). Ensure key exchange mechanism is migrated to PQC."
                )
        if "CHACHA" in algo_upper:
            return (
                "Maintain ChaCha20-Poly1305 (Quantum-Resistant)",
                "ChaCha20-Poly1305 with ML-KEM-768 session keys",
                "256-bit stream cipher provides adequate Grover protection (128 bits post-quantum security)."
            )

        # 4. Hash Functions (MD5, SHA-1, SHA-256, SHA-384, SHA-512)
        if "MD5" in algo_upper or "SHA-1" in algo_upper or "SHA1" in algo_upper:
            return (
                "SHA-256, SHA-384, or SHA-512 (FIPS 180-4) / SHA3-256 (FIPS 202)",
                "Direct replacement with SHA-384 / SHA-512",
                "MD5 and SHA-1 have broken classical collisions and severe quantum BHT collision vulnerability. Migrate immediately to SHA-256 or SHA-384."
            )
        if any(h in algo_upper for h in ["SHA-256", "SHA-384", "SHA-512", "SHA256", "SHA384", "SHA512", "SHA3", "BLAKE"]):
            return (
                f"Maintain {algorithm} (Quantum-Resistant)",
                "Native PQC Hash function",
                f"{algorithm} provides robust quantum collision and preimage resistance."
            )

        # 5. Protocols (TLS, SSH, IPsec)
        if "TLS" in algo_upper:
            return (
                "TLS 1.3 with ML-KEM-768 Key Exchange and ML-DSA-65 Certs",
                "Hybrid TLS 1.3: X25519 + ML-KEM-768 Key Exchange with Dual RSA/ECDSA+ML-DSA certificates",
                "Enables quantum-safe forward secrecy against Harvest Now, Decrypt Later (HNDL) data storage while maintaining legacy client compatibility."
            )
        if "SSH" in algo_upper:
            return (
                "OpenSSH 9.9+ with mlkem768x25519-sha512 KEX and ssh-mldsa65 keys",
                "Hybrid KEX: sntrup761x25519-sha512 or mlkem768x25519-sha512",
                "Protects SSH administrative sessions from retroactive quantum decryption."
            )

        # Default fallback
        if kb_entry and kb_entry.get("recommended_pqc_alternatives"):
            rec_dict = kb_entry["recommended_pqc_alternatives"]
            first_val = list(rec_dict.values())[0] if isinstance(rec_dict, dict) else str(rec_dict)
            return first_val, "Hybrid Classical + PQC Transition Pattern", "Follow NIST Post-Quantum Cryptography transition guidelines."

        return "ML-KEM-768 (KEX) / ML-DSA-65 (Signatures)", "Hybrid Dual-Algorithm Scheme", "Evaluate NIST PQC standards (FIPS 203 / 204)."

pqc_recommender = PQCRecommendationEngine()
