from typing import List, Dict, Any, Tuple
from app.cbom.cbom_model import (
    CBOMAsset,
    RoadmapPhaseType,
    RoadmapPhaseSummary,
    RoadmapReport,
    RiskLevel,
    BusinessCriticality
)

class MigrationRoadmapEngine:

    @classmethod
    def classify_asset_phase(cls, asset: CBOMAsset) -> Tuple[RoadmapPhaseType, str, str, float, str, str, str]:
        """
        Deterministic classification of an asset into a migration phase.
        Returns: (phase_type, phase_label, suggested_action, effort_hours, cost_category, latency_impact, bandwidth_impact)
        """
        r_lvl = asset.risk_level.value if hasattr(asset.risk_level, "value") else str(asset.risk_level)
        b_crit = asset.business_criticality.value if hasattr(asset.business_criticality, "value") else str(asset.business_criticality)
        is_mosca_urgent = bool(asset.mosca and asset.mosca.is_urgent)
        is_pqc = "QUANTUM_RESISTANT" in str(asset.quantum_vulnerability) or "ML-" in asset.algorithm or "SLH-" in asset.algorithm

        # Phase 4: Monitor & Maintain (Already PQC or Low Risk)
        if is_pqc or r_lvl == "LOW":
            phase = RoadmapPhaseType.PHASE_4_MONITOR
            label = "Phase 4: Monitor / Maintain"
            action = "Maintain crypto-agility baseline. Monitor NIST / IETF PQC standardization updates and periodic dependency audits."
            effort = 8.0
            cost_cat = "LOW"
            latency = "MINIMAL"
            bandwidth = "Standard Baseline"
            return phase, label, action, effort, cost_cat, latency, bandwidth

        # Phase 1: Immediate / Critical
        # Critical risk OR Mosca urgent OR (Critical business system with High risk) OR (Regulated long-lived data with High risk)
        if (
            r_lvl == "CRITICAL"
            or is_mosca_urgent
            or (b_crit == "CRITICAL" and r_lvl in ["HIGH", "CRITICAL"])
            or (asset.data_lifetime_years >= 15.0 and r_lvl in ["HIGH", "CRITICAL"])
        ):
            phase = RoadmapPhaseType.PHASE_1_IMMEDIATE
            label = "Phase 1: Immediate / Critical"
            if "RSA" in asset.algorithm.upper() or "ECDSA" in asset.algorithm.upper() or "EC" in asset.algorithm.upper():
                action = f"Initiate immediate hybrid replacement: Deploy {asset.hybrid_alternative or 'X25519+ML-KEM-768'} to eliminate HNDL exposure without breaking classical compatibility."
            else:
                action = f"Immediate refactoring: Replace {asset.algorithm} with {asset.recommended_pqc or 'NIST PQC standardized equivalent'}."
            effort = 40.0 if "C++" in str(asset.file) or "src" in str(asset.file) else 24.0
            cost_cat = "HIGH" if effort >= 35.0 else "MEDIUM"
            latency = "LOW" if "KEM" in str(asset.recommended_pqc) else "MODERATE"
            bandwidth = "+1.1 KB (ML-KEM-768) / +2.4 KB (ML-DSA-65)"
            return phase, label, action, effort, cost_cat, latency, bandwidth

        # Phase 2: High Priority
        # High risk OR High business criticality OR approaching Mosca window
        if r_lvl == "HIGH" or b_crit == "HIGH" or (asset.mosca and asset.mosca.x_plus_y >= 0.8 * asset.mosca.z_quantum_timeline):
            phase = RoadmapPhaseType.PHASE_2_HIGH_PRIORITY
            label = "Phase 2: High Priority"
            action = f"Schedule PQC migration for {asset.algorithm} -> {asset.recommended_pqc or 'ML-KEM/ML-DSA'} in upcoming sprint. Upgrade crypto libraries and test API endpoints."
            effort = 24.0
            cost_cat = "MEDIUM"
            latency = "LOW"
            bandwidth = "+1.1 KB (PQC Keys/Ciphertext)"
            return phase, label, action, effort, cost_cat, latency, bandwidth

        # Phase 3: Planned Migration
        # Default for Medium risk
        phase = RoadmapPhaseType.PHASE_3_PLANNED
        label = "Phase 3: Planned Migration"
        action = f"Plan migration of {asset.algorithm} during routine system lifecycle upgrades. Upgrade underlying frameworks to PQC-ready baseline."
        effort = 16.0
        cost_cat = "LOW"
        latency = "MINIMAL"
        bandwidth = "Negligible"
        return phase, label, action, effort, cost_cat, latency, bandwidth

    @classmethod
    def generate_roadmap(cls, assets: List[CBOMAsset], developer_rate: float = 120.0, qa_rate: float = 90.0) -> Tuple[List[CBOMAsset], RoadmapReport]:
        """
        Processes assets and generates a complete 4-Phase RoadmapReport.
        """
        enriched_assets: List[CBOMAsset] = []
        phase_counts = {
            RoadmapPhaseType.PHASE_1_IMMEDIATE: 0,
            RoadmapPhaseType.PHASE_2_HIGH_PRIORITY: 0,
            RoadmapPhaseType.PHASE_3_PLANNED: 0,
            RoadmapPhaseType.PHASE_4_MONITOR: 0
        }
        phase_efforts = {p: 0.0 for p in phase_counts}
        phase_costs = {p: 0.0 for p in phase_counts}
        phase_crit_counts = {p: 0 for p in phase_counts}
        phase_high_counts = {p: 0 for p in phase_counts}

        for a in assets:
            phase, label, action, effort, cost_cat, latency, bandwidth = cls.classify_asset_phase(a)
            a.migration_phase = phase
            a.phase_label = label
            a.suggested_action = action
            a.estimated_effort_hours = effort
            a.cost_category = cost_cat
            a.latency_impact = latency
            a.bandwidth_impact = bandwidth

            # Calculate asset cost
            cost_val = (effort * 0.70 * developer_rate) + (effort * 0.30 * qa_rate) + 300.0
            a.estimated_cost_usd = round(cost_val, 2)

            phase_counts[phase] += 1
            phase_efforts[phase] += effort
            phase_costs[phase] += cost_val

            r_str = a.risk_level.value if hasattr(a.risk_level, "value") else str(a.risk_level)
            if r_str == "CRITICAL":
                phase_crit_counts[phase] += 1
            elif r_str == "HIGH":
                phase_high_counts[phase] += 1

            enriched_assets.append(a)

        # Build phase summaries
        phases_meta = [
            (
                RoadmapPhaseType.PHASE_1_IMMEDIATE,
                "Phase 1: Immediate / Critical Remediation",
                "0 – 6 Months",
                "Immediate hybrid deployment (FIPS 203 ML-KEM) and key exchange migration to neutralize active HNDL exposure."
            ),
            (
                RoadmapPhaseType.PHASE_2_HIGH_PRIORITY,
                "Phase 2: High-Priority Migration",
                "6 – 18 Months",
                "Refactor authentication tokens, internal microservice APIs, and long-term digital signature certificates to FIPS 204 (ML-DSA)."
            ),
            (
                RoadmapPhaseType.PHASE_3_PLANNED,
                "Phase 3: Planned Routine Transition",
                "18 – 36 Months",
                "Incorporate PQC dependencies and configuration upgrades into routine software release cycles and framework updates."
            ),
            (
                RoadmapPhaseType.PHASE_4_MONITOR,
                "Phase 4: Monitor & Crypto-Agility Maintenance",
                "Continuous",
                "Maintain crypto-agility baseline, automate CBOM discovery scans, and monitor global post-quantum cryptographic standards."
            )
        ]

        phase_summaries: List[RoadmapPhaseSummary] = []
        total_effort = 0.0
        total_cost = 0.0

        for p_type, title, timeline, act_summary in phases_meta:
            cnt = phase_counts[p_type]
            eff = round(phase_efforts[p_type], 1)
            cst = round(phase_costs[p_type], 2)
            total_effort += eff
            total_cost += cst

            phase_summaries.append(RoadmapPhaseSummary(
                phase_type=p_type,
                phase_title=title,
                target_timeline=timeline,
                asset_count=cnt,
                critical_risk_count=phase_crit_counts[p_type],
                high_risk_count=phase_high_counts[p_type],
                total_effort_hours=eff,
                total_cost_usd=cst,
                action_summary=act_summary
            ))

        total_assets = len(enriched_assets)
        immediate_count = phase_counts[RoadmapPhaseType.PHASE_1_IMMEDIATE]
        timeline_overview = (
            f"The migration roadmap divides {total_assets} cryptographic assets across 4 structured execution phases. "
            f"{immediate_count} assets require immediate Phase 1 remediation within 0-6 months to prevent Harvest-Now-Decrypt-Later compromise. "
            f"Total estimated migration effort is {round(total_effort, 1)} engineering hours across the enterprise portfolio."
        )

        report = RoadmapReport(
            phases=phase_summaries,
            total_assets=total_assets,
            total_effort_hours=round(total_effort, 1),
            total_cost_usd=round(total_cost, 2),
            immediate_actions_count=immediate_count,
            timeline_overview=timeline_overview
        )

        return enriched_assets, report

roadmap_engine = MigrationRoadmapEngine()
