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
from app.roadmap.roadmap_engine import roadmap_engine
from app.readiness.readiness_engine import readiness_engine
from app.cost_estimator.cost_engine import cost_engine
from app.fmea.fmea_engine import fmea_engine
from app.dependency_intelligence.dependency_engine import dependency_engine
from app.monitoring.monitoring_engine import monitoring_engine

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

            # 2. Risk Calculation & Explainable Factor Breakdown
            conf = item.get("confidence", ConfidenceLevel.CONFIRMED_USAGE)
            risk_score, risk_lvl, rationales, factor_scores, risk_explanation, recommended_action = quantum_risk_engine.calculate_risk(
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
                risk_factor_breakdown=factor_scores,
                risk_explanation=risk_explanation,
                recommended_action=recommended_action,
                mosca=mosca,
                recommended_pqc=pqc,
                hybrid_alternative=hybrid,
                migration_priority=999,
                status="DISCOVERED"
            )
            assets.append(asset)

        # 4. Prioritize Assets
        prioritized_assets = priority_engine.prioritize_assets(assets)

        # 5. Classify Migration Roadmap Phases & Enrich Assets
        enriched_assets, roadmap_rep = roadmap_engine.generate_roadmap(prioritized_assets)

        # 6. Perform Quantum FMEA Assessment
        fmea_summary = fmea_engine.analyze_portfolio(enriched_assets)

        # 7. Construct Dependency Intelligence Graph
        dep_graph = dependency_engine.build_graph(enriched_assets, application)

        # 8. Build Aggregated Metrics
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

        for a in enriched_assets:
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

        avg_risk = round(total_risk_score / len(enriched_assets), 1) if enriched_assets else 0.0

        summary = ScanSummary(
            scan_id=f"SCAN-{uuid.uuid4().hex[:8].upper()}",
            scan_timestamp=datetime.now(timezone.utc).isoformat(),
            target_name=target_name,
            files_scanned=files_scanned_count,
            libraries_detected=len(unique_libraries),
            crypto_assets_count=len(enriched_assets),
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

        # 9. Evaluate Organization Quantum Readiness Score (0-100)
        readiness_assessment = readiness_engine.evaluate_readiness(enriched_assets, summary)

        # 10. Calculate Financial & Effort Summary
        cost_summary = cost_engine.calculate_portfolio_cost(enriched_assets)

        # 11. Fetch Continuous Monitoring Status
        monitoring_summary = monitoring_engine.get_summary()

        return CBOMReport(
            cbom_version="1.0.0",
            cyclonedx_spec_version="1.6",
            generated_at=datetime.now(timezone.utc).isoformat(),
            scan_summary=summary,
            assets=enriched_assets,
            readiness_assessment=readiness_assessment,
            roadmap_report=roadmap_rep,
            cost_summary=cost_summary,
            fmea_summary=fmea_summary,
            dependency_graph=dep_graph,
            monitoring_summary=monitoring_summary,
            metadata={
                "platform": "QUANTECT",
                "tagline": "Prepare Today, Secure Tomorrow.",
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
