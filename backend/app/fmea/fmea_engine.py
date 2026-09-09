import math
from typing import List, Dict, Any
from app.cbom.cbom_model import (
    CBOMAsset,
    FMEARecord,
    FMEASummary,
    FMEAPriority,
    BusinessCriticality,
    Exposure,
    RiskLevel
)

class QuantumFMEAEngine:
    """
    Failure Mode and Effects Analysis (FMEA) Engine for Post-Quantum Cryptography.
    Calculates Severity (S), Observable Occurrence (O), Detection Difficulty (D),
    and Risk Priority Number (RPN = S * O * D) for every discovered asset.
    """

    def analyze_asset(self, asset: CBOMAsset) -> FMEARecord:
        algo = (asset.algorithm or "").upper()
        cat = (asset.category or "").upper()
        crit = asset.business_criticality
        expo = asset.exposure
        lifetime = asset.data_lifetime_years or 10.0
        
        # 1. Determine Concrete Failure Mode
        if "RSA" in algo:
            failure_mode = "Shor's Algorithm Polynomial Integer Factorization"
            potential_effect = "Full private key extraction enabling retroactive ciphertext decryption and unauthorized signature forgery."
        elif any(ecc in algo for ecc in ["ECDSA", "ECDH", "ECC", "SECP", "ED25519", "X25519"]):
            failure_mode = "Shor's Algorithm Elliptic Curve Discrete Logarithm (ECDLP) Break"
            potential_effect = "Discrete logarithm solution breaks ephemeral key exchanges and allows forged authentication assertions."
        elif "DH" in algo:
            failure_mode = "Shor's Algorithm Discrete Logarithm Solution"
            potential_effect = "Session key recovery across recorded encrypted network handshakes."
        elif any(w in algo for w in ["3DES", "DES", "RC4", "MD5", "SHA1", "SHA-1"]):
            failure_mode = "Classical Cryptanalytic Degradation & Quantum Grover Exhaustion"
            potential_effect = "Immediate collision exploitation and plaintext recovery under legacy key constraints."
        elif "AES-128" in algo:
            failure_mode = "Grover's Quantum Search Space Halving (64-bit Effective Security)"
            potential_effect = "Security strength drops below enterprise threshold (64 bits quantum security); vulnerable to Grover search."
        elif any(pqc in algo for pqc in ["ML-KEM", "ML-DSA", "SLH-DSA", "FALCON", "KYBER", "DILITHIUM", "SPHINCS"]):
            failure_mode = "Quantum-Resilient Baseline (Zero Shor Vulnerability)"
            potential_effect = "Protected against Shor and Grover quantum cryptanalysis under NIST standards."
        else:
            failure_mode = "Potential Cryptographic Primitive Vulnerability"
            potential_effect = "Uncertain post-quantum resilience requiring crypto-agility inspection."

        # 2. Calculate Severity (S: 1 to 10)
        # Based on Business Criticality & Data Sensitivity
        if crit == BusinessCriticality.CRITICAL:
            s_base = 9
        elif crit == BusinessCriticality.HIGH:
            s_base = 7
        elif crit == BusinessCriticality.MEDIUM:
            s_base = 5
        else:
            s_base = 3

        if asset.data_sensitivity == "RESTRICTED":
            s_base = min(10, s_base + 1)
        elif asset.data_sensitivity == "CONFIDENTIAL":
            s_base = min(10, s_base)
        elif asset.data_sensitivity == "PUBLIC":
            s_base = max(1, s_base - 2)

        severity = max(1, min(10, s_base))

        # 3. Calculate Occurrence (O: 1 to 10)
        # Based on Observable System Exposure & Data Lifetime (NOT probability of quantum computer)
        o_base = 4
        if expo == Exposure.INTERNET_FACING:
            o_base += 3
        elif expo == Exposure.INTERNAL_NETWORK:
            o_base += 1
        elif expo == Exposure.ISOLATED:
            o_base -= 2

        if lifetime >= 15.0:
            o_base += 2
        elif lifetime >= 8.0:
            o_base += 1
        elif lifetime <= 2.0:
            o_base -= 1

        if asset.mosca and asset.mosca.is_urgent:
            o_base += 1

        occurrence = max(1, min(10, o_base))

        # 4. Calculate Detection (D: 1 to 10)
        # Higher score = Harder to detect or remediate (lack of crypto-agility)
        d_base = 5
        if asset.code_snippet and "hardcoded" in asset.evidence.lower():
            d_base += 3
        elif "certificate" in (asset.category or "").lower():
            d_base -= 1 # Public certs are easily discoverable
        elif "manifest" in (asset.category or "").lower() or "dependency" in (asset.category or "").lower():
            d_base -= 1
        
        if "C" in (asset.library or "") or "C++" in (asset.file or "") or ".so" in asset.file or ".dll" in asset.file:
            d_base += 2 # Native binary crypto is harder to inspect

        detection = max(1, min(10, d_base))

        # If already PQC, drastically lower severity & occurrence impact
        if any(pqc in algo for pqc in ["ML-KEM", "ML-DSA", "SLH-DSA", "FALCON", "KYBER", "DILITHIUM"]):
            severity = 2
            occurrence = 1
            detection = 2

        # 5. Compute RPN (Risk Priority Number = S * O * D)
        rpn = severity * occurrence * detection

        # 6. Assign FMEA Priority
        if rpn >= 250:
            priority = FMEAPriority.CRITICAL
        elif rpn >= 150:
            priority = FMEAPriority.HIGH
        elif rpn >= 75:
            priority = FMEAPriority.MEDIUM
        else:
            priority = FMEAPriority.LOW

        # 7. Generate Explainable "Why This RPN?"
        why_this_rpn = (
            f"Severity is {severity}/10 ({crit.value} business impact on {asset.data_sensitivity} data). "
            f"Occurrence is {occurrence}/10 ({expo.value} exposure with {lifetime:.0f}-year data secrecy requirement). "
            f"Detection difficulty is {detection}/10 (cryptographic inspection transparency in {asset.file.split('/')[-1]}). "
            f"Yields RPN = {severity} × {occurrence} × {detection} = {rpn}/1000."
        )

        # 8. Prevention & Control Action
        if asset.recommended_pqc:
            prevention = f"Deploy {asset.recommended_pqc} or hybrid {asset.hybrid_alternative or 'X25519+ML-KEM'} to eliminate {failure_mode}."
        else:
            prevention = f"Refactor algorithm to NIST standardized post-quantum equivalent (FIPS 203/204/205)."

        return FMEARecord(
            asset_id=asset.asset_id,
            algorithm=asset.algorithm,
            failure_mode=failure_mode,
            potential_effect=potential_effect,
            severity=severity,
            occurrence=occurrence,
            detection=detection,
            rpn=rpn,
            priority=priority,
            why_this_rpn=why_this_rpn,
            prevention_control=prevention
        )

    def analyze_portfolio(self, assets: List[CBOMAsset]) -> FMEASummary:
        records: List[FMEARecord] = []
        for a in assets:
            record = self.analyze_asset(a)
            a.fmea = record
            records.append(record)

        if not records:
            return FMEASummary(
                total_assessed=0,
                critical_rpn_count=0,
                high_rpn_count=0,
                medium_rpn_count=0,
                low_rpn_count=0,
                average_rpn=0.0,
                max_rpn=0,
                records=[]
            )

        crit = sum(1 for r in records if r.priority == FMEAPriority.CRITICAL)
        high = sum(1 for r in records if r.priority == FMEAPriority.HIGH)
        med = sum(1 for r in records if r.priority == FMEAPriority.MEDIUM)
        low = sum(1 for r in records if r.priority == FMEAPriority.LOW)
        avg_rpn = sum(r.rpn for r in records) / len(records)
        max_rpn = max(r.rpn for r in records)

        # Sort records by descending RPN
        records.sort(key=lambda x: x.rpn, reverse=True)

        return FMEASummary(
            total_assessed=len(records),
            critical_rpn_count=crit,
            high_rpn_count=high,
            medium_rpn_count=med,
            low_rpn_count=low,
            average_rpn=round(avg_rpn, 1),
            max_rpn=max_rpn,
            records=records
        )

fmea_engine = QuantumFMEAEngine()
