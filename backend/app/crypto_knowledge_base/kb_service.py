import json
import os
from typing import Dict, Any, List, Optional

KB_PATH = os.path.join(os.path.dirname(__file__), "knowledge_base.json")

class CryptoKnowledgeBase:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CryptoKnowledgeBase, cls).__new__(cls)
            cls._instance._load_kb()
        return cls._instance

    def _load_kb(self):
        try:
            with open(KB_PATH, "r", encoding="utf-8") as f:
                self.data = json.load(f)
        except Exception as e:
            self.data = {"version": "1.0.0", "algorithms": {}}

    def get_all_algorithms(self) -> Dict[str, Any]:
        return self.data.get("algorithms", {})

    def get_algorithm(self, algo_name: str) -> Optional[Dict[str, Any]]:
        if not algo_name:
            return None
        algo_name_upper = algo_name.strip().upper()
        algorithms = self.data.get("algorithms", {})
        
        # Exact match
        if algo_name_upper in algorithms:
            return algorithms[algo_name_upper]
        
        # Canonical normalization
        mappings = {
            "RSA-2048": "RSA",
            "RSA-4096": "RSA",
            "RSA-1024": "RSA",
            "RSA-3072": "RSA",
            "ECDSA-P256": "ECDSA",
            "ECDSA-P384": "ECDSA",
            "ECDSA-P521": "ECDSA",
            "SECP256K1": "ECC",
            "SECP256R1": "ECC",
            "PRIME256V1": "ECC",
            "CURVE25519": "X25519",
            "ED448": "Ed448",
            "AES-128": "AES",
            "AES-192": "AES",
            "AES-256": "AES",
            "AES-128-GCM": "AES",
            "AES-256-GCM": "AES",
            "AES-128-CBC": "AES",
            "AES-256-CBC": "AES",
            "TRIPLE-DES": "3DES",
            "TRIPLEDES": "3DES",
            "DES-EDE3": "3DES",
            "CHACHA20-POLY1305": "ChaCha20",
            "SHA1": "SHA-1",
            "SHA256": "SHA-256",
            "SHA384": "SHA-384",
            "SHA512": "SHA-512",
            "SHA-2": "SHA-256",
            "TLS1.2": "TLS",
            "TLS1.3": "TLS",
            "SSH2": "SSH",
            "KYBER": "ML-KEM",
            "KYBER512": "ML-KEM",
            "KYBER768": "ML-KEM",
            "KYBER1024": "ML-KEM",
            "DILITHIUM": "ML-DSA",
            "DILITHIUM2": "ML-DSA",
            "DILITHIUM3": "ML-DSA",
            "DILITHIUM5": "ML-DSA",
            "SPHINCS+": "SLH-DSA",
            "SPHINCS": "SLH-DSA"
        }
        
        mapped = mappings.get(algo_name_upper)
        if mapped and mapped in algorithms:
            return algorithms[mapped]

        # Partial search
        for key, details in algorithms.items():
            if key.lower() in algo_name.lower() or algo_name.lower() in key.lower():
                return details
                
        return None

    def search_kb(self, query: str) -> List[Dict[str, Any]]:
        query_lower = query.lower().strip()
        results = []
        for key, details in self.data.get("algorithms", {}).items():
            if (query_lower in key.lower() or
                query_lower in details.get("name", "").lower() or
                query_lower in details.get("category", "").lower() or
                query_lower in details.get("quantum_attack", "").lower() or
                any(query_lower in u.lower() for u in details.get("uses", []))):
                results.append(details)
        return results

kb = CryptoKnowledgeBase()
