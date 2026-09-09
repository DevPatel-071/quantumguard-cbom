import time
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.cbom.cbom_model import (
    MonitoredSource,
    MonitoringAlert,
    MonitoringSummary,
    MonitoringStatus
)

class ContinuousMonitoringEngine:
    """
    Manages continuous cryptographic asset monitoring, periodic change detection,
    and alert dispatch for quantum risk and CBOM drift.
    """

    def __init__(self):
        self._sources: Dict[str, MonitoredSource] = {}
        self._alerts: List[MonitoringAlert] = []
        self._is_monitoring_enabled = True

        # Pre-seed with default sample monitored source & baseline alerts
        self._init_defaults()

    def _init_defaults(self):
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        default_source = MonitoredSource(
            source_id="src-core-banking-01",
            name="Banking Core & Settlement Service",
            source_type="SAMPLE",
            target_path_or_url="app/sample_repositories/banking-payment-gateway",
            status=MonitoringStatus.ACTIVE,
            registered_at=now_iso,
            last_scanned_at=now_iso,
            scan_interval_minutes=60,
            total_assets_tracked=25,
            critical_risks_tracked=12,
            changes_detected_count=3
        )
        self._sources[default_source.source_id] = default_source

        self._alerts = [
            MonitoringAlert(
                alert_id="alt-001",
                source_id="src-core-banking-01",
                timestamp=now_iso,
                severity="CRITICAL",
                alert_type="NEW_CRYPTO_ASSET",
                title="New Shor-Vulnerable RSA-2048 Key Detected",
                message="A new 2048-bit RSA key was committed to payment switch pipeline. Immediate hybrid remediation required.",
                asset_id="CBOM-ASSET-007",
                is_read=False
            ),
            MonitoringAlert(
                alert_id="alt-002",
                source_id="src-core-banking-01",
                timestamp=now_iso,
                severity="HIGH",
                alert_type="RISK_ELEVATED",
                title="Quantum Risk Score Elevated to 100/100",
                message="Asset CBOM-ASSET-007 risk score increased from 82 to 100 due to active Mosca HNDL timeline trigger.",
                asset_id="CBOM-ASSET-007",
                is_read=False
            ),
            MonitoringAlert(
                alert_id="alt-003",
                source_id="src-core-banking-01",
                timestamp=now_iso,
                severity="MEDIUM",
                alert_type="DEPENDENCY_CHANGED",
                title="Cryptographic Dependency Version Bumped",
                message="BouncyCastle library version changed. 8 dependent cryptographic routines re-analyzed.",
                is_read=True
            ),
            MonitoringAlert(
                alert_id="alt-004",
                source_id="src-core-banking-01",
                timestamp=now_iso,
                severity="INFORMATIONAL",
                alert_type="CBOM_SYNC",
                title="CycloneDX 1.6 CBOM Inventory Re-synchronized",
                message="Automated scan verified 25 assets and regenerated 4-phase migration roadmap.",
                is_read=True
            )
        ]

    def register_source(self, name: str, source_type: str, target_path: str, total_assets: int = 0, critical_count: int = 0) -> MonitoredSource:
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        source_id = f"src-{int(time.time())}"
        source = MonitoredSource(
            source_id=source_id,
            name=name,
            source_type=source_type,
            target_path_or_url=target_path,
            status=MonitoringStatus.ACTIVE,
            registered_at=now_iso,
            last_scanned_at=now_iso,
            scan_interval_minutes=60,
            total_assets_tracked=total_assets,
            critical_risks_tracked=critical_count,
            changes_detected_count=0
        )
        self._sources[source_id] = source

        # Add registration alert
        self._alerts.insert(0, MonitoringAlert(
            alert_id=f"alt-{int(time.time())}",
            source_id=source_id,
            timestamp=now_iso,
            severity="INFORMATIONAL",
            alert_type="CBOM_SYNC",
            title=f"Source Registered for Continuous Monitoring: {name}",
            message=f"QUANTECT is now monitoring '{name}' for cryptographic changes, CBOM drift, and quantum risk elevations.",
            is_read=False
        ))

        return source

    def set_source_status(self, source_id: str, new_status: MonitoringStatus) -> Optional[MonitoredSource]:
        if source_id in self._sources:
            self._sources[source_id].status = new_status
            return self._sources[source_id]
        return None

    def mark_alert_read(self, alert_id: str):
        for alt in self._alerts:
            if alt.alert_id == alert_id:
                alt.is_read = True

    def get_summary(self) -> MonitoringSummary:
        sources_list = list(self._sources.values())
        active_count = sum(1 for s in sources_list if s.status == MonitoringStatus.ACTIVE)
        unread_count = sum(1 for a in self._alerts if not a.is_read)

        return MonitoringSummary(
            is_monitoring_enabled=self._is_monitoring_enabled,
            active_sources_count=active_count,
            total_changes_detected=sum(s.changes_detected_count for s in sources_list),
            unread_alerts_count=unread_count,
            sources=sources_list,
            recent_alerts=self._alerts
        )

monitoring_engine = ContinuousMonitoringEngine()
