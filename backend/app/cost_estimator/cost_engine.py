from typing import List, Dict, Any, Tuple
from app.cbom.cbom_model import (
    CBOMAsset,
    CostParameters,
    CostEstimationSummary,
    BusinessCriticality
)

class MigrationCostEngine:

    @classmethod
    def estimate_asset_cost(
        cls,
        asset: CBOMAsset,
        params: CostParameters
    ) -> Tuple[float, float, float, str, str, str]:
        """
        Calculates dev hours, QA hours, total cost, cost category, complexity rating, and rationale for a single asset.
        Returns: (dev_hours, qa_hours, total_cost_usd, cost_category, complexity_rating, rationale)
        """
        usage_lower = str(asset.usage).lower()
        file_lower = str(asset.file).lower()
        b_crit = asset.business_criticality.value if hasattr(asset.business_criticality, "value") else str(asset.business_criticality)

        # Baseline hours based on implementation context
        if "cert" in file_lower or "crt" in file_lower or "x.509" in usage_lower or "vault" in file_lower:
            base_dev = 6.0
            base_qa = 6.0
            complexity = "LOW"
            reason = "PKI / X.509 certificate reissue and root trust store update."
        elif "nginx" in file_lower or "conf" in file_lower or "yaml" in file_lower or "yml" in file_lower:
            base_dev = 4.0
            base_qa = 4.0
            complexity = "LOW"
            reason = "Web server / reverse proxy TLS cipher suite configuration update."
        elif "requirements" in file_lower or "package.json" in file_lower or "pom.xml" in file_lower or "cargo.toml" in file_lower or "go.mod" in file_lower:
            base_dev = 12.0
            base_qa = 8.0
            complexity = "MEDIUM"
            reason = "Cryptographic dependency manifest upgrade, compatibility validation, and test suite execution."
        elif "cpp" in file_lower or "c" in file_lower or "rust" in file_lower:
            base_dev = 32.0
            base_qa = 18.0
            complexity = "HIGH"
            reason = "Native C/C++/Rust source refactoring, memory buffer sizing for larger PQC keys, and API integration."
        else:
            # Python, Java, JS source code
            base_dev = 20.0
            base_qa = 12.0
            complexity = "MEDIUM"
            reason = "Application code refactoring to integrate PQC key encapsulation or signature wrappers."

        # Business Criticality Multiplier
        if b_crit == "CRITICAL":
            crit_mult = 1.4
            reason += " Heightened rigor and regression testing applied due to CRITICAL business system classification."
        elif b_crit == "HIGH":
            crit_mult = 1.2
        elif b_crit == "LOW":
            crit_mult = 0.8
        else:
            crit_mult = 1.0

        mult = params.complexity_multiplier * crit_mult
        dev_hrs = round(base_dev * mult, 1)
        qa_hrs = round(base_qa * mult, 1)

        dev_cost = dev_hrs * params.developer_hourly_rate
        qa_cost = qa_hrs * params.qa_testing_hourly_rate
        infra_cost = params.infra_cost_per_asset
        total_cost = round(dev_cost + qa_cost + infra_cost, 2)

        # Categorize
        if total_cost >= 6000.0 or dev_hrs + qa_hrs >= 45.0:
            cat = "VERY_HIGH"
        elif total_cost >= 3500.0 or dev_hrs + qa_hrs >= 25.0:
            cat = "HIGH"
        elif total_cost >= 1800.0 or dev_hrs + qa_hrs >= 14.0:
            cat = "MEDIUM"
        else:
            cat = "LOW"

        return dev_hrs, qa_hrs, total_cost, cat, complexity, reason

    @classmethod
    def calculate_portfolio_cost(
        cls,
        assets: List[CBOMAsset],
        params: CostParameters | None = None
    ) -> CostEstimationSummary:
        if params is None:
            params = CostParameters()

        total_dev_hours = 0.0
        total_qa_hours = 0.0
        total_infra_cost = 0.0

        for a in assets:
            dev_h, qa_h, _, _, _, _ = cls.estimate_asset_cost(a, params)
            total_dev_hours += dev_h
            total_qa_hours += qa_h
            total_infra_cost += params.infra_cost_per_asset

        eng_cost = round(total_dev_hours * params.developer_hourly_rate, 2)
        test_cost = round(total_qa_hours * params.qa_testing_hourly_rate, 2)
        total_cost = round(eng_cost + test_cost + total_infra_cost, 2)

        if total_cost >= 100000.0:
            tier = "ENTERPRISE_SCALE"
        elif total_cost >= 50000.0:
            tier = "HIGH"
        elif total_cost >= 20000.0:
            tier = "MEDIUM"
        else:
            tier = "LOW"

        return CostEstimationSummary(
            parameters=params,
            total_engineering_hours=round(total_dev_hours, 1),
            total_testing_hours=round(total_qa_hours, 1),
            engineering_cost_usd=eng_cost,
            testing_cost_usd=test_cost,
            infrastructure_cost_usd=round(total_infra_cost, 2),
            total_estimated_cost_usd=total_cost,
            cost_tier=tier
        )

cost_engine = MigrationCostEngine()
