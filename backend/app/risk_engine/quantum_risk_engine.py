from typing import Dict, Any, List, Tuple
from app.cbom.cbom_model import (
    RiskLevel,
    BusinessCriticality,
    Exposure,
    ConfidenceLevel,
    MoscaAssessment
)
from app.crypto_knowledge_base.kb_service import kb

class QuantumRiskEngine:

    @classmethod
    def calculate_risk(
        cls,
        algorithm: str,
        key_size: int | None,
        usage: str,
        confidence: ConfidenceLevel,
        business_criticality: BusinessCriticality,
        exposure: Exposure,
        data_sensitivity: str,
        mosca: MoscaAssessment
    ) -> Tuple[float, RiskLevel, List[str]]:
        """
        Deterministic, explainable risk scoring engine.
        Returns: (risk_score [0-100], RiskLevel, List[str] of explainability rationales)
        """
        rationales = []
        base_score = 0.0

        algo_meta = kb.get_algorithm(algorithm)
        algo_name = algo_meta.get("name", algorithm) if algo_meta else algorithm
        algo_vuln = algo_meta.get("quantum_vulnerability", "MEDIUM") if algo_meta else "MEDIUM"
        category = algo_meta.get("category", "") if algo_meta else ""

        # 1. Base Algorithm Quantum Vulnerability
        if algo_vuln == "CRITICAL":
            base_score = 90.0
            rationales.append(f"Algorithm '{algo_name}' is critically vulnerable to quantum cryptanalysis (Shor's polynomial-time attack).")
        elif algo_vuln == "HIGH":
            base_score = 75.0
            rationales.append(f"Algorithm/Protocol '{algo_name}' carries high quantum vulnerability (vulnerable key exchange / HNDL risk).")
        elif algo_vuln == "MEDIUM":
            base_score = 50.0
            rationales.append(f"Algorithm '{algo_name}' has moderate quantum exposure or classical weaknesses.")
        elif algo_vuln == "LOW_TO_MEDIUM":
            # For AES-128, key size matters
            if key_size and key_size <= 128:
                base_score = 45.0
                rationales.append(f"AES-128 bit key is degraded to 64-bit effective strength by Grover's algorithm (O(2^(k/2))), below recommended quantum margins.")
            else:
                base_score = 25.0
                rationales.append(f"AES key size offers reasonable quantum defense margins.")
        elif algo_vuln in ["LOW", "VERY_LOW"]:
            base_score = 15.0
            rationales.append(f"Algorithm '{algo_name}' is quantum-resistant against known quantum attacks (adequate Grover/BHT security margin).")
        elif algo_vuln == "QUANTUM_RESISTANT":
            base_score = 5.0
            rationales.append(f"Standardized Post-Quantum Cryptographic algorithm (FIPS compliant / Lattice or Hash-based).")
        else:
            base_score = 40.0
            rationales.append(f"Unknown or unclassified cryptographic algorithm: default baseline risk.")

        # Key Size adjustments for classical algorithms
        if key_size:
            if "RSA" in algorithm.upper() or "DIFFIE" in algorithm.upper():
                if key_size <= 1024:
                    base_score += 10.0
                    rationales.append(f"Substandard key size ({key_size}-bit) is trivially broken classically and instantly by quantum methods.")
                elif key_size >= 4096:
                    base_score -= 5.0
                    rationales.append(f"Extended key size ({key_size}-bit) provides high classical security, though still vulnerable to Shor's algorithm.")

        # 2. Mosca Assessment & Timeline Urgency
        if mosca:
            if mosca.is_urgent:
                if mosca.x_plus_y - mosca.z_quantum_timeline >= 5.0:
                    base_score += 20.0
                    rationales.append(f"Extreme Mosca urgency: Data lifetime X ({mosca.x_data_lifetime} yrs) + Migration Y ({mosca.y_migration_time} yrs) exceeds Quantum horizon Z ({mosca.z_quantum_timeline} yrs) by {round(mosca.x_plus_y - mosca.z_quantum_timeline, 1)} yrs.")
                else:
                    base_score += 12.0
                    rationales.append(f"Mosca urgency active (X + Y = {mosca.x_plus_y} yrs > Z = {mosca.z_quantum_timeline} yrs). Migration window will close before CRQC arrival.")
            elif mosca.x_plus_y >= (0.8 * mosca.z_quantum_timeline):
                base_score += 5.0
                rationales.append(f"Approaching Mosca deadline: Timeline buffer is under 20% remaining.")
            else:
                base_score -= 8.0
                rationales.append(f"Safe Mosca buffer: X + Y is well below quantum threat horizon ({mosca.x_plus_y} < {mosca.z_quantum_timeline} yrs).")

        # 3. Business Criticality
        if business_criticality == BusinessCriticality.CRITICAL:
            base_score += 15.0
            rationales.append("Business Criticality is CRITICAL (Core financial / critical infrastructure / identity systems).")
        elif business_criticality == BusinessCriticality.HIGH:
            base_score += 8.0
            rationales.append("Business Criticality is HIGH (Customer-facing / sensitive production services).")
        elif business_criticality == BusinessCriticality.MEDIUM:
            base_score += 0.0
            rationales.append("Business Criticality is MEDIUM (Internal business systems).")
        elif business_criticality == BusinessCriticality.LOW:
            base_score -= 10.0
            rationales.append("Business Criticality is LOW (Public information / non-essential workloads).")

        # 4. Network Exposure
        if exposure == Exposure.INTERNET_FACING:
            base_score += 12.0
            rationales.append("Asset is INTERNET-FACING (Adversaries can actively harvest encrypted handshakes or target endpoints).")
        elif exposure == Exposure.INTERNAL_NETWORK:
            base_score += 2.0
            rationales.append("Asset is INTERNAL NETWORK accessible.")
        elif exposure == Exposure.ISOLATED:
            base_score -= 8.0
            rationales.append("Asset is ISOLATED / AIR-GAPPED (Restricted attack vector).")

        # 5. Data Sensitivity
        sens_upper = str(data_sensitivity).upper()
        if "RESTRICTED" in sens_upper or "REGULATED" in sens_upper or "SECRET" in sens_upper:
            base_score += 10.0
            rationales.append(f"Data Sensitivity is '{data_sensitivity}' (Severe compliance/confidentiality penalty).")
        elif "CONFIDENTIAL" in sens_upper or "PII" in sens_upper or "FINANCIAL" in sens_upper:
            base_score += 5.0
            rationales.append(f"Data Sensitivity is '{data_sensitivity}'.")
        elif "PUBLIC" in sens_upper:
            base_score -= 12.0
            rationales.append("Data is PUBLIC (Zero confidentiality impact from HNDL attacks).")

        # 6. Confidence Weighting
        if confidence == ConfidenceLevel.CONFIRMED_USAGE:
            # Full weight
            pass
        elif confidence == ConfidenceLevel.POTENTIAL_USAGE:
            base_score *= 0.90
            rationales.append("Confidence is POTENTIAL_USAGE (Library/Package present; potential API invocation).")
        elif confidence == ConfidenceLevel.DEPENDENCY_ONLY:
            base_score *= 0.70
            rationales.append("Confidence is DEPENDENCY_ONLY (Library imported in manifest but no direct API invocation detected in codebase).")
        elif confidence == ConfidenceLevel.INFERRED:
            base_score *= 0.80
            rationales.append("Confidence is INFERRED (Heuristic binary string/symbol or config pattern).")

        # Clamp score between 0 and 100
        final_score = round(max(0.0, min(100.0, base_score)), 1)

        # Classify Level
        if final_score >= 75.0:
            level = RiskLevel.CRITICAL
        elif final_score >= 50.0:
            level = RiskLevel.HIGH
        elif final_score >= 25.0:
            level = RiskLevel.MEDIUM
        else:
            level = RiskLevel.LOW

        return final_score, level, rationales

quantum_risk_engine = QuantumRiskEngine()
