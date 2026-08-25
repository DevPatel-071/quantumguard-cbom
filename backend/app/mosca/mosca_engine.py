from typing import Dict, Any
from app.cbom.cbom_model import MoscaAssessment, MoscaUrgency

class MoscaEngine:
    DEFAULT_Z_TIMELINE = 15.0  # Estimated years until CRQC (configurable)

    @classmethod
    def evaluate(
        cls,
        x_data_lifetime: float,
        y_migration_time: float,
        z_quantum_timeline: float = DEFAULT_Z_TIMELINE,
        is_confidentiality_sensitive: bool = True
    ) -> MoscaAssessment:
        """
        Evaluates Mosca's Framework: X + Y > Z
        X = Data / information lifetime (years)
        Y = Migration time (years)
        Z = Estimated time until Cryptographically Relevant Quantum Computer (CRQC)
        """
        x_val = max(0.1, float(x_data_lifetime))
        y_val = max(0.1, float(y_migration_time))
        z_val = max(1.0, float(z_quantum_timeline))

        x_plus_y = round(x_val + y_val, 2)
        is_urgent = x_plus_y > z_val
        diff = round(x_plus_y - z_val, 2)

        # HNDL risk window: Max(0, X - (Z - Y))
        # If adversary captures data at t=0, they decrypt at t=Z.
        # If data is sensitive until t=X, data is exposed from t=Z to t=X (if X > Z).
        hndl_exposure = max(0.0, round(x_val - z_val, 2)) if is_confidentiality_sensitive else 0.0

        if is_urgent:
            if diff >= 5.0 or (x_val >= z_val and is_confidentiality_sensitive):
                urgency = MoscaUrgency.CRITICAL_URGENT
                explanation = (
                    f"CRITICAL MOSCA URGENCY: X ({x_val} yrs data lifetime) + Y ({y_val} yrs migration) = "
                    f"{x_plus_y} yrs, which exceeds the quantum horizon Z ({z_val} yrs) by {diff} yrs. "
                    f"Severe Harvest-Now-Decrypt-Later (HNDL) exposure of {hndl_exposure} yrs."
                )
            else:
                urgency = MoscaUrgency.HIGH_PRIORITY
                explanation = (
                    f"HIGH MOSCA URGENCY: X + Y ({x_plus_y} yrs) > Z ({z_val} yrs) by {diff} yrs. "
                    f"Migration will complete after quantum threats emerge unless accelerated."
                )
        elif x_plus_y >= (0.8 * z_val):
            urgency = MoscaUrgency.MONITOR
            explanation = (
                f"MONITOR / PLANNING REQUIRED: X + Y ({x_plus_y} yrs) is within 20% of quantum timeline "
                f"Z ({z_val} yrs). Initiate PQC transition roadmap to avoid critical risk."
            )
        else:
            urgency = MoscaUrgency.SECURE
            explanation = (
                f"SAFE TIMELINE: X + Y ({x_plus_y} yrs) is comfortably below quantum horizon Z ({z_val} yrs). "
                f"Estimated safety margin of {round(z_val - x_plus_y, 2)} yrs."
            )

        return MoscaAssessment(
            x_data_lifetime=x_val,
            y_migration_time=y_val,
            z_quantum_timeline=z_val,
            x_plus_y=x_plus_y,
            is_urgent=is_urgent,
            urgency=urgency,
            hndl_exposure_years=hndl_exposure,
            explanation=explanation
        )

mosca_engine = MoscaEngine()
