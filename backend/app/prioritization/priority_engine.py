from typing import List
from app.cbom.cbom_model import CBOMAsset, RiskLevel, ConfidenceLevel, Exposure

class MigrationPriorityEngine:

    @classmethod
    def prioritize_assets(cls, assets: List[CBOMAsset]) -> List[CBOMAsset]:
        """
        Sorts assets deterministically and assigns sequential migration priority #1, #2, ...
        with detailed human-readable priority justification.
        """
        def sort_key(asset: CBOMAsset):
            # Mosca urgency weight
            mosca_weight = 0
            if asset.mosca:
                if asset.mosca.urgency == "CRITICAL_URGENT":
                    mosca_weight = 40
                elif asset.mosca.urgency == "HIGH_PRIORITY":
                    mosca_weight = 30
                elif asset.mosca.urgency == "MONITOR":
                    mosca_weight = 15
                else:
                    mosca_weight = 0

            # Criticality weight
            crit_weight = {
                "CRITICAL": 30,
                "HIGH": 20,
                "MEDIUM": 10,
                "LOW": 0
            }.get(str(asset.business_criticality.value if hasattr(asset.business_criticality, "value") else asset.business_criticality), 0)

            # Exposure weight
            exp_weight = {
                "INTERNET_FACING": 20,
                "INTERNAL_NETWORK": 10,
                "ISOLATED": 0
            }.get(str(asset.exposure.value if hasattr(asset.exposure, "value") else asset.exposure), 0)

            # Confidence weight
            conf_weight = {
                "CONFIRMED_USAGE": 15,
                "POTENTIAL_USAGE": 10,
                "INFERRED": 7,
                "DEPENDENCY_ONLY": 3
            }.get(str(asset.confidence.value if hasattr(asset.confidence, "value") else asset.confidence), 0)

            composite = (asset.risk_score * 2.0) + (mosca_weight * 2.5) + crit_weight + exp_weight + conf_weight
            return composite

        sorted_assets = sorted(assets, key=sort_key, reverse=True)

        for rank, asset in enumerate(sorted_assets, start=1):
            asset.migration_priority = rank
            
            # Generate justification
            urgency_str = asset.mosca.urgency.value if asset.mosca else "STANDARD"
            reasons = []
            
            if asset.risk_score >= 75.0:
                reasons.append(f"Critical Risk Score ({asset.risk_score}/100)")
            elif asset.risk_score >= 50.0:
                reasons.append(f"High Risk Score ({asset.risk_score}/100)")

            if asset.mosca and asset.mosca.is_urgent:
                reasons.append(f"Active Mosca threat (X+Y={asset.mosca.x_plus_y} yrs > Z={asset.mosca.z_quantum_timeline} yrs)")

            if asset.exposure == Exposure.INTERNET_FACING:
                reasons.append("Internet-facing exposure enables active HNDL traffic harvesting")

            if asset.confidence == ConfidenceLevel.CONFIRMED_USAGE:
                reasons.append("Confirmed live code invocation")

            crit_val = asset.business_criticality.value if hasattr(asset.business_criticality, "value") else asset.business_criticality
            if crit_val in ["CRITICAL", "HIGH"]:
                reasons.append(f"{crit_val} business criticality system")

            if not reasons:
                reasons.append("Standard migration backlog order based on risk score and exposure.")

            asset.migration_reason = f"Rank #{rank}: " + "; ".join(reasons) + f" -> Recommended target: {asset.recommended_pqc}."

        return sorted_assets

priority_engine = MigrationPriorityEngine()
