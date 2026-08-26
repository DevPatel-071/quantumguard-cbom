from typing import Dict, Any, List, Tuple
from app.cbom.cbom_model import (
    RiskLevel,
    BusinessCriticality,
    Exposure,
    ConfidenceLevel,
    MoscaAssessment,
    RiskFactorScore
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
    ) -> Tuple[float, RiskLevel, List[str], List[RiskFactorScore], str, str]:
        """
        Deterministic, explainable risk scoring engine.
        Returns: (
            risk_score [0-100],
            RiskLevel,
            List[str] of explainability rationales,
            List[RiskFactorScore] itemized factor points,
            risk_explanation,
            recommended_action
        )
        """
        rationales: List[str] = []
        factor_scores: List[RiskFactorScore] = []
        base_score = 0.0

        algo_meta = kb.get_algorithm(algorithm)
        algo_name = algo_meta.get("name", algorithm) if algo_meta else algorithm
        algo_vuln = algo_meta.get("quantum_vulnerability", "MEDIUM") if algo_meta else "MEDIUM"

        # 1. Base Algorithm Quantum Vulnerability
        if algo_vuln == "CRITICAL":
            pts = 90.0
            base_score = pts
            rationales.append(f"Algorithm '{algo_name}' is critically vulnerable to quantum cryptanalysis (Shor's polynomial-time attack).")
            factor_scores.append(RiskFactorScore(
                factor_name="Quantum Vulnerability (Shor's Algorithm)",
                score_points=pts,
                description="Shor's algorithm solves discrete log / integer factorization in polynomial time, completely breaking classical asymmetric cryptography."
            ))
        elif algo_vuln == "HIGH":
            pts = 75.0
            base_score = pts
            rationales.append(f"Algorithm/Protocol '{algo_name}' carries high quantum vulnerability (vulnerable key exchange / HNDL risk).")
            factor_scores.append(RiskFactorScore(
                factor_name="Quantum Vulnerability (Key Establishment / HNDL)",
                score_points=pts,
                description="Asymmetric key agreement is broken by Shor's algorithm, allowing retroactive passive decryption."
            ))
        elif algo_vuln == "MEDIUM":
            pts = 50.0
            base_score = pts
            rationales.append(f"Algorithm '{algo_name}' has moderate quantum exposure or classical weaknesses.")
            factor_scores.append(RiskFactorScore(
                factor_name="Quantum Vulnerability (Moderate)",
                score_points=pts,
                description="Legacy algorithm or intermediate strength requiring scheduled transition."
            ))
        elif algo_vuln == "LOW_TO_MEDIUM":
            if key_size and key_size <= 128:
                pts = 45.0
                base_score = pts
                rationales.append("AES-128 bit key is degraded to 64-bit effective strength by Grover's algorithm (O(2^(k/2))), below recommended quantum margins.")
                factor_scores.append(RiskFactorScore(
                    factor_name="Grover Security Margin Halving",
                    score_points=pts,
                    description="Grover's algorithm halves effective symmetric key bit security. 128-bit key drops to 64-bit strength."
                ))
            else:
                pts = 25.0
                base_score = pts
                rationales.append("AES key size offers reasonable quantum defense margins.")
                factor_scores.append(RiskFactorScore(
                    factor_name="Symmetric Grover Resistance",
                    score_points=pts,
                    description="256-bit symmetric cipher maintains 128-bit security against Grover's algorithm."
                ))
        elif algo_vuln in ["LOW", "VERY_LOW"]:
            pts = 15.0
            base_score = pts
            rationales.append(f"Algorithm '{algo_name}' is quantum-resistant against known quantum attacks (adequate Grover/BHT security margin).")
            factor_scores.append(RiskFactorScore(
                factor_name="Quantum Resistance Baseline",
                score_points=pts,
                description="Hashes / large symmetric keys retain sufficient security margins against Grover / BHT quantum collision attacks."
            ))
        elif algo_vuln == "QUANTUM_RESISTANT":
            pts = 5.0
            base_score = pts
            rationales.append(f"Standardized Post-Quantum Cryptographic algorithm (FIPS compliant / Lattice or Hash-based).")
            factor_scores.append(RiskFactorScore(
                factor_name="NIST PQC Standardized Algorithm",
                score_points=pts,
                description="Conforms to NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), or FIPS 205 (SLH-DSA) post-quantum specifications."
            ))
        else:
            pts = 40.0
            base_score = pts
            rationales.append(f"Unknown or unclassified cryptographic algorithm: default baseline risk.")
            factor_scores.append(RiskFactorScore(
                factor_name="Unclassified Primitive Baseline",
                score_points=pts,
                description="Heuristic fallback assessment."
            ))

        # Key Size adjustments for classical algorithms
        if key_size:
            if "RSA" in algorithm.upper() or "DIFFIE" in algorithm.upper():
                if key_size <= 1024:
                    base_score += 10.0
                    rationales.append(f"Substandard key size ({key_size}-bit) is trivially broken classically and instantly by quantum methods.")
                    factor_scores.append(RiskFactorScore(
                        factor_name="Substandard Key Size Penalty",
                        score_points=+10.0,
                        description=f"Key size of {key_size} bits is severely below NIST minimum classical threshold (2048-bit)."
                    ))
                elif key_size >= 4096:
                    base_score -= 5.0
                    rationales.append(f"Extended key size ({key_size}-bit) provides high classical security, though still vulnerable to Shor's algorithm.")
                    factor_scores.append(RiskFactorScore(
                        factor_name="Extended Key Size Mitigation",
                        score_points=-5.0,
                        description="4096-bit key size increases classical resistance, but remains vulnerable to polynomial quantum factorization."
                    ))

        # 2. Mosca Assessment & Timeline Urgency
        if mosca:
            if mosca.is_urgent:
                if mosca.x_plus_y - mosca.z_quantum_timeline >= 5.0:
                    pts = 20.0
                    base_score += pts
                    rationales.append(f"Extreme Mosca urgency: Data lifetime X ({mosca.x_data_lifetime} yrs) + Migration Y ({mosca.y_migration_time} yrs) exceeds Quantum horizon Z ({mosca.z_quantum_timeline} yrs) by {round(mosca.x_plus_y - mosca.z_quantum_timeline, 1)} yrs.")
                    factor_scores.append(RiskFactorScore(
                        factor_name="Extreme Mosca Timeline Urgency",
                        score_points=pts,
                        description=f"X ({mosca.x_data_lifetime}y) + Y ({mosca.y_migration_time}y) exceeds Z ({mosca.z_quantum_timeline}y) by {round(mosca.x_plus_y - mosca.z_quantum_timeline, 1)} years. High HNDL vulnerability."
                    ))
                else:
                    pts = 12.0
                    base_score += pts
                    rationales.append(f"Mosca urgency active (X + Y = {mosca.x_plus_y} yrs > Z = {mosca.z_quantum_timeline} yrs). Migration window will close before CRQC arrival.")
                    factor_scores.append(RiskFactorScore(
                        factor_name="Mosca Urgency Active (X + Y > Z)",
                        score_points=pts,
                        description=f"Migration must start immediately to finish before expected Cryptographically Relevant Quantum Computer (CRQC) arrival."
                    ))
            elif mosca.x_plus_y >= (0.8 * mosca.z_quantum_timeline):
                pts = 5.0
                base_score += pts
                rationales.append(f"Approaching Mosca deadline: Timeline buffer is under 20% remaining.")
                factor_scores.append(RiskFactorScore(
                    factor_name="Approaching Mosca Window Buffer",
                    score_points=pts,
                    description="Timeline buffer between migration completion and quantum arrival is narrowing."
                ))
            else:
                pts = -8.0
                base_score += pts
                rationales.append(f"Safe Mosca buffer: X + Y is well below quantum threat horizon ({mosca.x_plus_y} < {mosca.z_quantum_timeline} yrs).")
                factor_scores.append(RiskFactorScore(
                    factor_name="Safe Mosca Timeline Buffer",
                    score_points=pts,
                    description=f"Data lifetime plus migration ({mosca.x_plus_y}y) is comfortably below quantum horizon ({mosca.z_quantum_timeline}y)."
                ))

        # 3. Business Criticality
        if business_criticality == BusinessCriticality.CRITICAL:
            pts = 15.0
            base_score += pts
            rationales.append("Business Criticality is CRITICAL (Core financial / critical infrastructure / identity systems).")
            factor_scores.append(RiskFactorScore(
                factor_name="Critical Business Impact",
                score_points=pts,
                description="Direct impact on core revenue, transactions, identity infrastructure, or regulatory compliance."
            ))
        elif business_criticality == BusinessCriticality.HIGH:
            pts = 8.0
            base_score += pts
            rationales.append("Business Criticality is HIGH (Customer-facing / sensitive production services).")
            factor_scores.append(RiskFactorScore(
                factor_name="High Business Impact",
                score_points=pts,
                description="Production customer workloads with significant operational impact."
            ))
        elif business_criticality == BusinessCriticality.MEDIUM:
            factor_scores.append(RiskFactorScore(
                factor_name="Medium Business Criticality",
                score_points=0.0,
                description="Standard internal business systems."
            ))
        elif business_criticality == BusinessCriticality.LOW:
            pts = -10.0
            base_score += pts
            rationales.append("Business Criticality is LOW (Public information / non-essential workloads).")
            factor_scores.append(RiskFactorScore(
                factor_name="Low Business Criticality Offset",
                score_points=pts,
                description="Non-critical internal workload reducing overall organizational risk."
            ))

        # 4. Network Exposure
        if exposure == Exposure.INTERNET_FACING:
            pts = 12.0
            base_score += pts
            rationales.append("Asset is INTERNET-FACING (Adversaries can actively harvest encrypted handshakes or target endpoints).")
            factor_scores.append(RiskFactorScore(
                factor_name="Internet-Facing Exposure (Harvest Vector)",
                score_points=pts,
                description="Direct external exposure enables bulk encrypted traffic capture for Harvest Now, Decrypt Later."
            ))
        elif exposure == Exposure.INTERNAL_NETWORK:
            pts = 2.0
            base_score += pts
            rationales.append("Asset is INTERNAL NETWORK accessible.")
            factor_scores.append(RiskFactorScore(
                factor_name="Internal Network Exposure",
                score_points=pts,
                description="Internal corporate network perimeter."
            ))
        elif exposure == Exposure.ISOLATED:
            pts = -8.0
            base_score += pts
            rationales.append("Asset is ISOLATED / AIR-GAPPED (Restricted attack vector).")
            factor_scores.append(RiskFactorScore(
                factor_name="Air-Gapped / Isolated Offset",
                score_points=pts,
                description="Isolated environment restricts adversary capture and external eavesdropping."
            ))

        # 5. Data Sensitivity
        sens_upper = str(data_sensitivity).upper()
        if "RESTRICTED" in sens_upper or "REGULATED" in sens_upper or "SECRET" in sens_upper:
            pts = 10.0
            base_score += pts
            rationales.append(f"Data Sensitivity is '{data_sensitivity}' (Severe compliance/confidentiality penalty).")
            factor_scores.append(RiskFactorScore(
                factor_name="High Data Sensitivity Penalty",
                score_points=pts,
                description="Regulated data (PII/EHR/PCI) requiring long-term non-disclosure mandates."
            ))
        elif "CONFIDENTIAL" in sens_upper or "PII" in sens_upper or "FINANCIAL" in sens_upper:
            pts = 5.0
            base_score += pts
            rationales.append(f"Data Sensitivity is '{data_sensitivity}'.")
            factor_scores.append(RiskFactorScore(
                factor_name="Confidential Data Sensitivity",
                score_points=pts,
                description="Confidential business or customer data subject to privacy policies."
            ))
        elif "PUBLIC" in sens_upper:
            pts = -12.0
            base_score += pts
            rationales.append("Data is PUBLIC (Zero confidentiality impact from HNDL attacks).")
            factor_scores.append(RiskFactorScore(
                factor_name="Public Data Confidentiality Offset",
                score_points=pts,
                description="Publicly available data with zero secrecy requirements."
            ))

        # 6. Confidence Weighting
        if confidence == ConfidenceLevel.CONFIRMED_USAGE:
            factor_scores.append(RiskFactorScore(
                factor_name="Direct AST Invocation Confidence",
                score_points=0.0,
                description="100% confirmed usage in active source code."
            ))
        elif confidence == ConfidenceLevel.POTENTIAL_USAGE:
            base_score *= 0.90
            rationales.append("Confidence is POTENTIAL_USAGE (Library/Package present; potential API invocation).")
            factor_scores.append(RiskFactorScore(
                factor_name="Potential Usage Discount (0.9x)",
                score_points=-5.0,
                description="Inferred or library-level detection."
            ))
        elif confidence == ConfidenceLevel.DEPENDENCY_ONLY:
            base_score *= 0.70
            rationales.append("Confidence is DEPENDENCY_ONLY (Library imported in manifest but no direct API invocation detected in codebase).")
            factor_scores.append(RiskFactorScore(
                factor_name="Dependency Only Discount (0.7x)",
                score_points=-15.0,
                description="Manifest dependency without active AST calls found in scanned source files."
            ))
        elif confidence == ConfidenceLevel.INFERRED:
            base_score *= 0.80
            rationales.append("Confidence is INFERRED (Heuristic binary string/symbol or config pattern).")
            factor_scores.append(RiskFactorScore(
                factor_name="Inferred Confidence Modifier (0.8x)",
                score_points=-10.0,
                description="Heuristic configuration or binary string match."
            ))

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

        # Generate Synthesized Explanation and Action
        if level == RiskLevel.CRITICAL:
            risk_explanation = (
                f"Asset '{algorithm}' carries CRITICAL quantum risk (Score: {final_score}/100). "
                f"It utilizes classical public-key cryptography vulnerable to Shor's polynomial-time quantum attack, "
                f"operates in a {business_criticality.value if hasattr(business_criticality, 'value') else business_criticality} business context, "
                f"and is exposed to Harvest-Now-Decrypt-Later (HNDL) data compromise."
            )
            recommended_action = (
                "Initiate immediate migration to NIST FIPS 203 (ML-KEM) or FIPS 204 (ML-DSA). "
                "Deploy hybrid classical+PQC schemes (e.g. X25519+ML-KEM-768 or composite signatures) "
                "for seamless transitional backward-compatibility without breaking current clients."
            )
        elif level == RiskLevel.HIGH:
            risk_explanation = (
                f"Asset '{algorithm}' carries HIGH quantum risk (Score: {final_score}/100). "
                f"Key establishment or signature routines are susceptible to quantum decryption or forgery, "
                f"warranting prioritized refactoring in the upcoming release cycle."
            )
            recommended_action = (
                "Schedule PQC transition in Phase 2 roadmap. Update cryptographic libraries to PQC-enabled versions "
                "(e.g., OpenSSL 3.2+, Bouncy Castle 1.78+, or liboqs) and prepare key encapsulation wrappers."
            )
        elif level == RiskLevel.MEDIUM:
            risk_explanation = (
                f"Asset '{algorithm}' has MEDIUM risk (Score: {final_score}/100). "
                f"Moderate security margins or internal accessibility mitigate immediate quantum exposure."
            )
            recommended_action = (
                "Plan migration during regular software lifecycle updates (Phase 3). "
                "Evaluate key size upgrades (e.g., AES-256) and audit protocol configurations."
            )
        else:
            risk_explanation = (
                f"Asset '{algorithm}' has LOW quantum risk (Score: {final_score}/100). "
                f"It is either quantum-resistant (symmetric/hash with sufficient margins or NIST PQC standardized) "
                f"or restricted to low-criticality isolated environments."
            )
            recommended_action = (
                "Maintain crypto-agility baseline and monitor for ongoing algorithmic advances (Phase 4)."
            )

        return final_score, level, rationales, factor_scores, risk_explanation, recommended_action

quantum_risk_engine = QuantumRiskEngine()
