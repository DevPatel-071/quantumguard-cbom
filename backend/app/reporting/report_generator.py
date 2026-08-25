import io
import csv
import json
from typing import Dict, Any
from app.cbom.cbom_model import CBOMReport

class ReportGenerator:

    @classmethod
    def generate_json(cls, cbom: CBOMReport) -> str:
        return json.dumps(cbom.model_dump(), indent=2)

    @classmethod
    def generate_csv(cls, cbom: CBOMReport) -> str:
        output = io.StringIO()
        writer = csv.writer(output)

        headers = [
            "Asset ID", "Priority Rank", "Algorithm", "Category", "Key Size", "Mode/Curve",
            "Library", "Version", "Protocol", "File Path", "Line Number", "Application",
            "Environment", "Usage", "Evidence", "Confidence", "Business Criticality",
            "Network Exposure", "Data Sensitivity", "Data Lifetime (X yrs)",
            "Migration Time (Y yrs)", "Quantum Horizon (Z yrs)", "Mosca Urgency",
            "Quantum Vulnerability", "Quantum Attack", "Risk Score (0-100)", "Risk Level",
            "Recommended PQC Alternative", "Hybrid Migration Alternative", "Priority Rationale"
        ]
        writer.writerow(headers)

        for a in cbom.assets:
            writer.writerow([
                a.asset_id,
                a.migration_priority,
                a.algorithm,
                a.category,
                a.key_size or "N/A",
                a.curve or a.mode or "N/A",
                a.library or "N/A",
                a.library_version or "N/A",
                a.protocol or "N/A",
                a.file,
                a.line_number or "N/A",
                a.application,
                a.environment,
                a.usage,
                a.evidence,
                a.confidence.value if hasattr(a.confidence, "value") else str(a.confidence),
                a.business_criticality.value if hasattr(a.business_criticality, "value") else str(a.business_criticality),
                a.exposure.value if hasattr(a.exposure, "value") else str(a.exposure),
                a.data_sensitivity,
                a.data_lifetime_years,
                a.migration_time_years,
                a.mosca.z_quantum_timeline if a.mosca else 15.0,
                a.mosca.urgency.value if a.mosca else "N/A",
                a.quantum_vulnerability,
                a.quantum_attack or "N/A",
                a.risk_score,
                a.risk_level.value if hasattr(a.risk_level, "value") else str(a.risk_level),
                a.recommended_pqc or "N/A",
                a.hybrid_alternative or "N/A",
                a.migration_reason or "N/A"
            ])

        return output.getvalue()

    @classmethod
    def generate_html_report(cls, cbom: CBOMReport) -> str:
        s = cbom.scan_summary
        
        # Build asset rows HTML
        asset_rows = ""
        for a in cbom.assets:
            risk_color = {
                "CRITICAL": "#ef4444",
                "HIGH": "#f97316",
                "MEDIUM": "#eab308",
                "LOW": "#22c55e"
            }.get(str(a.risk_level.value if hasattr(a.risk_level, "value") else a.risk_level), "#64748b")

            conf_badge = {
                "CONFIRMED_USAGE": "#10b981",
                "POTENTIAL_USAGE": "#3b82f6",
                "DEPENDENCY_ONLY": "#8b5cf6",
                "INFERRED": "#ec4899"
            }.get(str(a.confidence.value if hasattr(a.confidence, "value") else a.confidence), "#64748b")

            asset_rows += f"""
            <tr style="border-bottom: 1px solid #334155; font-size: 13px;">
                <td style="padding: 10px; font-weight: bold; color: #38bdf8;">#{a.migration_priority}</td>
                <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #f8fafc;">{a.algorithm} <span style="font-size: 11px; color: #94a3b8;">({a.key_size or 'N/A'})</span></td>
                <td style="padding: 10px; color: #cbd5e1;">{a.category}</td>
                <td style="padding: 10px; font-family: monospace; color: #a5b4fc;">{a.file}:{a.line_number or 1}</td>
                <td style="padding: 10px;"><span style="background: {conf_badge}22; color: {conf_badge}; border: 1px solid {conf_badge}44; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">{a.confidence.value if hasattr(a.confidence, 'value') else a.confidence}</span></td>
                <td style="padding: 10px;"><span style="background: {risk_color}22; color: {risk_color}; border: 1px solid {risk_color}44; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">{a.risk_level.value if hasattr(a.risk_level, 'value') else a.risk_level} ({a.risk_score})</span></td>
                <td style="padding: 10px; color: #34d399; font-weight: 500;">{a.recommended_pqc}</td>
            </tr>
            """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Readiness & CBOM Audit Report - {s.target_name}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 30px; }}
        .header {{ border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }}
        .brand {{ font-size: 24px; font-weight: bold; color: #38bdf8; }}
        .tagline {{ font-size: 13px; color: #94a3b8; margin-top: 4px; }}
        .meta-box {{ text-align: right; font-size: 13px; color: #94a3b8; }}
        .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }}
        .kpi-card {{ background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 18px; }}
        .kpi-title {{ font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; }}
        .kpi-value {{ font-size: 28px; font-weight: bold; margin-top: 8px; }}
        .mosca-banner {{ background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #f59e0b55; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px; }}
        .section-title {{ font-size: 18px; font-weight: bold; color: #f8fafc; margin: 30px 0 15px 0; border-bottom: 1px solid #334155; padding-bottom: 8px; }}
        table {{ width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }}
        th {{ background: #0f172a; padding: 12px 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }}
        @media print {{ body {{ background: #ffffff; color: #000000; }} .kpi-card, table, .mosca-banner {{ background: #f8fafc; border-color: #cbd5e1; color: #000000; }} th {{ background: #e2e8f0; color: #000000; }} }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="brand">⚡ QuantumGuard CBOM Platform</div>
            <div class="tagline">Quantum-Ready Cryptographic Inventory & Risk Assessment Audit Report</div>
        </div>
        <div class="meta-box">
            <div>Target: <strong>{s.target_name}</strong></div>
            <div>Generated: {s.scan_timestamp}</div>
            <div>CycloneDX 1.6 / CBOM Spec 1.0</div>
        </div>
    </div>

    <div class="grid">
        <div class="kpi-card">
            <div class="kpi-title">Total Crypto Assets</div>
            <div class="kpi-value" style="color: #38bdf8;">{s.crypto_assets_count}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Quantum Vulnerable (Shor)</div>
            <div class="kpi-value" style="color: #ef4444;">{s.quantum_vulnerable_count}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Critical & High Risk Assets</div>
            <div class="kpi-value" style="color: #f97316;">{s.critical_risk_count + s.high_risk_count}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Mosca Urgent Assets (X+Y > Z)</div>
            <div class="kpi-value" style="color: #eab308;">{s.mosca_urgent_count}</div>
        </div>
    </div>

    <div class="mosca-banner">
        <h3 style="margin-top: 0; color: #f59e0b;">Mosca's Theorem Migration Urgency Assessment (X + Y > Z)</h3>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5; margin-bottom: 8px;">
            <strong>Formula Evaluation:</strong> Information Lifetime (X = {cbom.metadata.get('data_lifetime_years', 10.0)} yrs) + Migration Duration (Y = {cbom.metadata.get('migration_time_years', 3.0)} yrs) = 
            <strong>{float(cbom.metadata.get('data_lifetime_years', 10.0)) + float(cbom.metadata.get('migration_time_years', 3.0))} yrs</strong>.
            Estimated Quantum Threat Horizon (Z = {cbom.metadata.get('quantum_timeline_years', 15.0)} yrs).
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">
            Assets identified with Harvest-Now-Decrypt-Later (HNDL) exposure require immediate dual-signature and hybrid key-encapsulation (ML-KEM-768) deployment.
        </p>
    </div>

    <div class="section-title">Cryptographic Bill of Materials (CBOM) & Prioritized Migration Roadmap</div>
    <table>
        <thead>
            <tr>
                <th>Priority</th>
                <th>Algorithm & Key Size</th>
                <th>Category</th>
                <th>Location</th>
                <th>Evidence Confidence</th>
                <th>Risk Level</th>
                <th>Recommended PQC Target</th>
            </tr>
        </thead>
        <tbody>
            {asset_rows}
        </tbody>
    </table>

    <div class="footer">
        Generated deterministically by Quantum-Ready Cryptographic Inventory & Risk Assessment Platform &bull; FIPS 203 / 204 / 205 PQC Standards Grounded
    </div>
</body>
</html>"""
        return html

report_generator = ReportGenerator()
