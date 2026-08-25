import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.cbom.cbom_model import (
    CBOMAsset,
    CBOMReport,
    ScanSummary,
    ConfidenceLevel,
    RiskLevel,
    BusinessCriticality,
    Exposure
)
from app.crypto_knowledge_base.kb_service import kb
from app.mosca.mosca_engine import mosca_engine
from app.risk_engine.quantum_risk_engine import quantum_risk_engine
from app.recommendation_engine.pqc_recommender import pqc_recommender
from app.prioritization.priority_engine import priority_engine

class CBOMGenerator:

    @classmethod
    def build_cbom(
        cls,
        raw_findings: List[Dict[str, Any]],
        target_name: str,
        files_scanned_count: int,
        application: str = "Banking API",
        environment: str = "PRODUCTION",
        business_criticality: BusinessCriticality = BusinessCriticality.HIGH,
        exposure: Exposure = Exposure.INTERNET_FACING,
        data_sensitivity: str = "CONFIDENTIAL",
        data_lifetime_years: float = 10.0,
        migration_time_years: float = 3.0,
        quantum_timeline_years: float = 15.0
    ) -> CBOMReport:
        assets: List[CBOMAsset] = []
        unique_libraries = set()

        for idx, item in enumerate(raw_findings, start=1):
            algo = item.get("algorithm", "Unknown Algorithm")
            lib = item.get("library", "Unknown Library")
            if lib:
                unique_libraries.add(lib)

            # KB lookup
            kb_data = kb.get_algorithm(algo)
            quantum_vuln = kb_data.get("quantum_vulnerability", "HIGH") if kb_data else "HIGH"
            quantum_attack = kb_data.get("quantum_attack", "Shor's / Grover's Quantum Algorithms") if kb_data else "Quantum cryptanalysis"

            # 1. Mosca Assessment
            is_confidential = "encryption" in item.get("usage", "").lower() or "key" in item.get("usage", "").lower() or "secret" in item.get("usage", "").lower()
            mosca = mosca_engine.evaluate(
                x_data_lifetime=data_lifetime_years,
                y_migration_time=migration_time_years,
                z_quantum_timeline=quantum_timeline_years,
                is_confidentiality_sensitive=is_confidential
            )

            # 2. Risk Calculation
            conf = item.get("confidence", ConfidenceLevel.CONFIRMED_USAGE)
            risk_score, risk_lvl, rationales = quantum_risk_engine.calculate_risk(
                algorithm=algo,
                key_size=item.get("key_size"),
                usage=item.get("usage", "Cryptographic Operation"),
                confidence=conf,
                business_criticality=business_criticality,
                exposure=exposure,
                data_sensitivity=data_sensitivity,
                mosca=mosca
            )

            # 3. PQC & Hybrid Recommendation
            pqc, hybrid, rec_reason = pqc_recommender.get_recommendation(
                algorithm=algo,
                usage=item.get("usage", "Cryptographic Operation"),
                key_size=item.get("key_size"),
                business_criticality=business_criticality.value if hasattr(business_criticality, "value") else str(business_criticality),
                exposure=exposure.value if hasattr(exposure, "value") else str(exposure)
            )

            asset_id = f"CBOM-ASSET-{idx:03d}"
            asset = CBOMAsset(
                asset_id=asset_id,
                algorithm=algo,
                category=item.get("category", "General Cryptography"),
                version=item.get("version"),
                mode=item.get("mode"),
                key_size=item.get("key_size"),
                curve=item.get("curve"),
                library=lib,
                library_version=item.get("library_version"),
                protocol=item.get("protocol"),
                file=item.get("file", "unknown"),
                line_number=item.get("line_number"),
                code_snippet=item.get("code_snippet"),
                application=application,
                environment=environment,
                usage=item.get("usage", "General Cryptography"),
                evidence=item.get("evidence", "Detected cryptographic pattern"),
                confidence=conf,
                data_sensitivity=data_sensitivity,
                data_lifetime_years=data_lifetime_years,
                migration_time_years=migration_time_years,
                business_criticality=business_criticality,
                exposure=exposure,
                quantum_vulnerability=quantum_vuln,
                quantum_attack=quantum_attack,
                risk_score=risk_score,
                risk_level=risk_lvl,
                risk_factors=rationales,
                mosca=mosca,
                recommended_pqc=pqc,
                hybrid_alternative=hybrid,
                migration_priority=999,
                status="DISCOVERED"
            )
            assets.append(asset)

        # 4. Prioritize Assets
        prioritized_assets = priority_engine.prioritize_assets(assets)

        # 5. Build Aggregated Metrics
        algo_counts: Dict[str, int] = {}
        risk_dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        conf_dist = {
            "CONFIRMED_USAGE": 0,
            "POTENTIAL_USAGE": 0,
            "DEPENDENCY_ONLY": 0,
            "INFERRED": 0
        }
        quantum_vuln_count = 0
        pqc_ready_count = 0
        mosca_urgent_count = 0
        total_risk_score = 0.0

        for a in prioritized_assets:
            # Main algorithm family grouping
            main_algo = a.algorithm.split()[0].split("-")[0].replace("(", "").strip().upper()
            algo_counts[main_algo] = algo_counts.get(main_algo, 0) + 1

            r_key = a.risk_level.value if hasattr(a.risk_level, "value") else str(a.risk_level)
            risk_dist[r_key] = risk_dist.get(r_key, 0) + 1

            c_key = a.confidence.value if hasattr(a.confidence, "value") else str(a.confidence)
            conf_dist[c_key] = conf_dist.get(c_key, 0) + 1

            if a.quantum_vulnerability in ["CRITICAL", "HIGH"]:
                quantum_vuln_count += 1
            elif a.quantum_vulnerability == "QUANTUM_RESISTANT" or "ML-" in a.algorithm or "SLH-" in a.algorithm:
                pqc_ready_count += 1

            if a.mosca and a.mosca.is_urgent:
                mosca_urgent_count += 1

            total_risk_score += a.risk_score

        avg_risk = round(total_risk_score / len(prioritized_assets), 1) if prioritized_assets else 0.0

        summary = ScanSummary(
            scan_id=f"SCAN-{uuid.uuid4().hex[:8].upper()}",
            scan_timestamp=datetime.now(timezone.utc).isoformat(),
            target_name=target_name,
            files_scanned=files_scanned_count,
            libraries_detected=len(unique_libraries),
            crypto_assets_count=len(prioritized_assets),
            algorithm_counts=algo_counts,
            risk_distribution=risk_dist,
            confidence_distribution=conf_dist,
            quantum_vulnerable_count=quantum_vuln_count,
            pqc_ready_count=pqc_ready_count,
            mosca_urgent_count=mosca_urgent_count,
            critical_risk_count=risk_dist.get("CRITICAL", 0),
            high_risk_count=risk_dist.get("HIGH", 0),
            average_risk_score=avg_risk
        )

        return CBOMReport(
            cbom_version="1.0.0",
            cyclonedx_spec_version="1.6",
            generated_at=datetime.now(timezone.utc).isoformat(),
            scan_summary=summary,
            assets=prioritized_assets,
            metadata={
                "target_name": target_name,
                "application": application,
                "environment": environment,
                "business_criticality": business_criticality.value if hasattr(business_criticality, "value") else str(business_criticality),
                "exposure": exposure.value if hasattr(exposure, "value") else str(exposure),
                "data_lifetime_years": data_lifetime_years,
                "migration_time_years": migration_time_years,
                "quantum_timeline_years": quantum_timeline_years
            }
        )

cbom_generator = CBOMGenerator()
