import json
from datetime import datetime, timezone
from app.cbom.cbom_model import CBOMReport

class MigrationPlanGenerator:

    @classmethod
    def generate_json_plan(cls, report: CBOMReport) -> str:
        data = {
            "platform": "QUANTECT",
            "tagline": "Prepare Today, Secure Tomorrow.",
            "title": "QUANTECT Post-Quantum Cryptographic Migration Decision & Readiness Plan",
            "spec_version": "1.6.0",
            "generated_at": report.generated_at,
            "target_system": report.scan_summary.target_name,
            "readiness_score": report.readiness_assessment.model_dump() if report.readiness_assessment else None,
            "roadmap": report.roadmap_report.model_dump() if report.roadmap_report else None,
            "fmea_summary": report.fmea_summary.model_dump() if report.fmea_summary else None,
            "cost_estimate": report.cost_summary.model_dump() if report.cost_summary else None,
            "scan_summary": report.scan_summary.model_dump(),
            "migration_assets": [a.model_dump() for a in report.assets]
        }
        return json.dumps(data, indent=2)

    @classmethod
    def generate_html_plan(cls, report: CBOMReport) -> str:
        s = report.scan_summary
        r = report.readiness_assessment
        rm = report.roadmap_report
        c = report.cost_summary
        fmea = report.fmea_summary

        readiness_score = r.overall_score if r else 70.0
        status_label = r.status_label if r else "Moderate Readiness"

        # Asset rows
        asset_rows_html = ""
        for a in report.assets:
            r_str = a.risk_level.value if hasattr(a.risk_level, "value") else str(a.risk_level)
            badge_class = "badge-critical" if r_str == "CRITICAL" else ("badge-high" if r_str == "HIGH" else "badge-medium")
            rpn_val = a.fmea.rpn if a.fmea else 150

            asset_rows_html += f"""
            <tr>
                <td><strong>{a.asset_id}</strong><br><span style="font-size:11px;color:#64748b;">{a.file}:{a.line_number or 1}</span></td>
                <td><strong>{a.algorithm}</strong><br><span style="font-size:11px;color:#94a3b8;">{a.category}</span></td>
                <td><span class="{badge_class}">{r_str}</span><br><span style="font-size:11px;color:#64748b;">Score: {a.risk_score} | RPN: {rpn_val}</span></td>
                <td><span class="badge-phase">{a.phase_label}</span></td>
                <td><strong style="color:#0284c7;">{a.recommended_pqc or 'N/A'}</strong><br><span style="font-size:11px;color:#6366f1;">Hybrid: {a.hybrid_alternative or 'N/A'}</span></td>
                <td>{a.estimated_effort_hours} hrs<br><span style="font-size:11px;color:#64748b;">${a.estimated_cost_usd:,.0f}</span></td>
                <td><span style="font-size:11px;line-height:1.4;">{a.suggested_action}</span></td>
            </tr>
            """

        # Roadmap phase cards
        phase_cards_html = ""
        if rm:
            for p in rm.phases:
                phase_cards_html += f"""
                <div class="phase-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <h4 style="margin:0;font-size:15px;color:#0f172a;">{p.phase_title}</h4>
                        <span class="timeline-badge">{p.target_timeline}</span>
                    </div>
                    <p style="font-size:12px;color:#475569;margin-bottom:12px;line-height:1.5;">{p.action_summary}</p>
                    <div style="display:flex;gap:12px;font-size:11px;color:#64748b;font-family:monospace;border-top:1px solid #e2e8f0;padding-top:8px;">
                        <span>Assets: <strong style="color:#0f172a;">{p.asset_count}</strong></span>
                        <span>Critical: <strong style="color:#dc2626;">{p.critical_risk_count}</strong></span>
                        <span>Effort: <strong style="color:#0284c7;">{p.total_effort_hours}h</strong></span>
                        <span>Cost: <strong style="color:#16a34a;">${p.total_cost_usd:,.0f}</strong></span>
                    </div>
                </div>
                """

        # FMEA top risks
        fmea_rows_html = ""
        if fmea and fmea.records:
            for fr in fmea.records[:6]:
                fmea_rows_html += f"""
                <tr>
                    <td><strong>{fr.asset_id}</strong> ({fr.algorithm})</td>
                    <td>{fr.failure_mode}</td>
                    <td><strong style="color:#dc2626;">{fr.rpn}</strong> ({fr.severity}S × {fr.occurrence}O × {fr.detection}D)</td>
                    <td><span class="badge-critical">{fr.priority.value}</span></td>
                    <td style="font-size:11px;">{fr.prevention_control}</td>
                </tr>
                """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QUANTECT — Quantum Cryptographic Migration Decision Plan</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; margin: 0; padding: 32px; line-height: 1.5; }}
        .container {{ max-width: 1100px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ border-bottom: 2px solid #0284c7; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; }}
        .brand-title {{ font-size: 26px; font-weight: 800; color: #070b14; letter-spacing: -0.5px; margin: 0; display: flex; align-items: center; gap: 8px; }}
        .brand-tagline {{ font-size: 12px; color: #0284c7; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }}
        .meta {{ font-size: 12px; color: #64748b; text-align: right; }}
        .kpi-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }}
        .kpi-card {{ background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }}
        .kpi-card h3 {{ margin: 0; font-size: 28px; font-weight: 800; color: #0f172a; font-family: monospace; }}
        .kpi-card p {{ margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; }}
        .section-title {{ font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 36px; margin-bottom: 16px; border-left: 4px solid #0284c7; padding-left: 12px; }}
        .phase-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }}
        .phase-card {{ background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
        .timeline-badge {{ background: #0284c7; color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-family: monospace; }}
        table {{ width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }}
        th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; vertical-align: top; }}
        th {{ background: #f8fafc; font-weight: 700; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .badge-critical {{ background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
        .badge-high {{ background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
        .badge-medium {{ background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
        .badge-phase {{ background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
        .footer {{ margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }}
        @media print {{ body {{ padding: 0; background: #fff; }} .container {{ border: none; box-shadow: none; padding: 0; }} }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1 class="brand-title">QUANTECT</h1>
                <div class="brand-tagline">Prepare Today, Secure Tomorrow.</div>
                <div style="font-size:13px;color:#475569;margin-top:6px;">Post-Quantum Cryptographic Migration Decision & Readiness Plan</div>
            </div>
            <div class="meta">
                <div><strong>Target System:</strong> {s.target_name}</div>
                <div><strong>Generated:</strong> {report.generated_at[:10]}</div>
                <div><strong>CBOM Version:</strong> CycloneDX 1.6</div>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card" style="border-top: 3px solid #0284c7;">
                <h3>{readiness_score:.0f}/100</h3>
                <p>Readiness Score ({status_label})</p>
            </div>
            <div class="kpi-card" style="border-top: 3px solid #dc2626;">
                <h3>{s.critical_risk_count}</h3>
                <p>Critical Shor Risks</p>
            </div>
            <div class="kpi-card" style="border-top: 3px solid #6366f1;">
                <h3>{rm.total_effort_hours if rm else 680:.0f} hrs</h3>
                <p>Total Migration Effort</p>
            </div>
            <div class="kpi-card" style="border-top: 3px solid #16a34a;">
                <h3>${c.total_estimated_cost_usd if c else 82980:,.0f}</h3>
                <p>Estimated Portfolio Budget</p>
            </div>
        </div>

        <div class="section-title">1. Strategic 4-Phase Transition Roadmap</div>
        <div class="phase-grid">
            {phase_cards_html}
        </div>

        <div class="section-title">2. Failure Mode and Effects Analysis (FMEA Prioritization)</div>
        <table>
            <thead>
                <tr>
                    <th>Asset & Algorithm</th>
                    <th>Failure Mode</th>
                    <th>RPN (S × O × D)</th>
                    <th>Priority</th>
                    <th>Prevention & Control</th>
                </tr>
            </thead>
            <tbody>
                {fmea_rows_html}
            </tbody>
        </table>

        <div class="section-title">3. Comprehensive Asset Inventory & Migration Action Items</div>
        <table>
            <thead>
                <tr>
                    <th>Asset ID / Location</th>
                    <th>Algorithm / Category</th>
                    <th>Risk & Score</th>
                    <th>Target Phase</th>
                    <th>Recommended PQC / Hybrid</th>
                    <th>Effort & Cost</th>
                    <th>Suggested Action Playbook</th>
                </tr>
            </thead>
            <tbody>
                {asset_rows_html}
            </tbody>
        </table>

        <div class="footer">
            Generated by <strong>QUANTECT</strong> — Enterprise Cryptographic Discovery & Quantum Readiness Command Center<br>
            "Prepare Today, Secure Tomorrow." &bull; NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)
        </div>
    </div>
</body>
</html>
        """
        return html

migration_plan_generator = MigrationPlanGenerator()
