import json
from datetime import datetime, timezone
from app.cbom.cbom_model import CBOMReport

class MigrationPlanGenerator:

    @classmethod
    def generate_json_plan(cls, report: CBOMReport) -> str:
        data = {
            "title": "Quantum Migration Decision & Readiness Plan",
            "spec_version": "1.0.0",
            "generated_at": report.generated_at,
            "target_system": report.scan_summary.target_name,
            "readiness_score": report.readiness_assessment.model_dump() if report.readiness_assessment else None,
            "roadmap": report.roadmap_report.model_dump() if report.roadmap_report else None,
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

        readiness_score = r.overall_score if r else 70.0
        status_label = r.status_label if r else "Moderate Readiness"
        status_color = r.status_color if r else "amber"

        # Asset rows
        asset_rows_html = ""
        for a in report.assets:
            r_str = a.risk_level.value if hasattr(a.risk_level, "value") else str(a.risk_level)
            b_str = a.business_criticality.value if hasattr(a.business_criticality, "value") else str(a.business_criticality)
            badge_class = "badge-critical" if r_str == "CRITICAL" else ("badge-high" if r_str == "HIGH" else "badge-medium")

            asset_rows_html += f"""
            <tr>
                <td><strong>{a.asset_id}</strong><br><span style="font-size:11px;color:#64748b;">{a.file}:{a.line_number or 1}</span></td>
                <td><strong>{a.algorithm}</strong><br><span style="font-size:11px;color:#94a3b8;">{a.category}</span></td>
                <td><span class="{badge_class}">{r_str}</span><br><span style="font-size:11px;color:#64748b;">Score: {a.risk_score}</span></td>
                <td><span class="badge-phase">{a.phase_label}</span></td>
                <td><strong style="color:#0ea5e9;">{a.recommended_pqc or 'N/A'}</strong><br><span style="font-size:11px;color:#818cf8;">Hybrid: {a.hybrid_alternative or 'N/A'}</span></td>
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
                    <p style="font-size:12px;color:#475569;margin-bottom:12px;">{p.action_summary}</p>
                    <div class="phase-metrics">
                        <div><strong>{p.asset_count}</strong><br><span style="font-size:10px;color:#64748b;">ASSETS</span></div>
                        <div><strong style="color:#ef4444;">{p.critical_risk_count}</strong><br><span style="font-size:10px;color:#64748b;">CRITICAL</span></div>
                        <div><strong>{p.total_effort_hours}h</strong><br><span style="font-size:10px;color:#64748b;">EFFORT</span></div>
                        <div><strong>${p.total_cost_usd:,.0f}</strong><br><span style="font-size:10px;color:#64748b;">EST. COST</span></div>
                    </div>
                </div>
                """

        # Readiness Factors
        factors_html = ""
        if r:
            for f in r.factors:
                factors_html += f"""
                <div style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                        <span><strong>{f.name}</strong></span>
                        <span><strong>{f.score}/100</strong> (Weight: {int(f.weight*100)}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width:{f.score}%;"></div>
                    </div>
                    <div style="font-size:11px;color:#64748b;margin-top:2px;">{f.description}</div>
                </div>
                """

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QuantumGuard — Post-Quantum Cryptography Migration Plan</title>
<style>
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        background: #f8fafc;
        margin: 0;
        padding: 30px 20px;
        line-height: 1.5;
    }}
    .container {{
        max-width: 1000px;
        margin: 0 auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        border: 1px solid #e2e8f0;
    }}
    .header {{
        border-bottom: 2px solid #0284c7;
        padding-bottom: 20px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }}
    .title {{
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 6px 0;
    }}
    .subtitle {{
        font-size: 13px;
        color: #64748b;
        margin: 0;
    }}
    .scorecard {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 30px;
    }}
    .scorecard-item {{
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }}
    .scorecard-item .val {{
        font-size: 28px;
        font-weight: 900;
        margin: 4px 0;
    }}
    .scorecard-item .lbl {{
        font-size: 11px;
        text-transform: uppercase;
        color: #64748b;
        font-weight: 700;
    }}
    .section-title {{
        font-size: 17px;
        font-weight: 800;
        color: #0f172a;
        margin: 30px 0 16px 0;
        border-left: 4px solid #0284c7;
        padding-left: 10px;
    }}
    .phases-grid {{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 30px;
    }}
    .phase-card {{
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 18px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }}
    .timeline-badge {{
        background: #e0f2fe;
        color: #0369a1;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
    }}
    .phase-metrics {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        background: #f8fafc;
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e2e8f0;
    }}
    .progress-bar-bg {{
        background: #e2e8f0;
        height: 7px;
        border-radius: 4px;
        overflow: hidden;
    }}
    .progress-bar-fill {{
        background: #0284c7;
        height: 100%;
        border-radius: 4px;
    }}
    table {{
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size: 12px;
    }}
    th {{
        background: #f1f5f9;
        color: #475569;
        text-align: left;
        padding: 10px;
        border-bottom: 2px solid #cbd5e1;
        font-weight: 700;
    }}
    td {{
        padding: 12px 10px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
    }}
    .badge-critical {{ background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
    .badge-high {{ background: #ffedd5; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
    .badge-medium {{ background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
    .badge-phase {{ background: #ede9fe; color: #6d28d9; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }}
    
    @media print {{
        body {{ background: #ffffff; padding: 0; }}
        .container {{ box-shadow: none; border: none; padding: 0; }}
        .no-print {{ display: none; }}
    }}
</style>
</head>
<body>

<div class="container">
    
    <!-- Header -->
    <div class="header">
        <div>
            <h1 class="title">Quantum Migration Decision & Readiness Plan</h1>
            <p class="subtitle">Target System: <strong>{s.target_name}</strong> | Generated: {datetime.now(timezone.utc).strftime('%B %d, %Y')}</p>
        </div>
        <div style="text-align:right;">
            <div style="font-size:12px;color:#64748b;font-weight:700;">ORGANIZATION POSTURE</div>
            <div style="font-size:22px;font-weight:900;color:#0284c7;">{readiness_score}/100</div>
            <div style="font-size:11px;font-weight:700;color:#0369a1;">{status_label.upper()}</div>
        </div>
    </div>

    <!-- Executive Scorecard -->
    <div class="scorecard">
        <div class="scorecard-item">
            <div class="lbl">Total Crypto Assets</div>
            <div class="val" style="color:#0f172a;">{s.crypto_assets_count}</div>
            <div style="font-size:11px;color:#64748b;">{s.files_scanned} files inspected</div>
        </div>
        <div class="scorecard-item">
            <div class="lbl">Shor Vulnerable</div>
            <div class="val" style="color:#ef4444;">{s.quantum_vulnerable_count}</div>
            <div style="font-size:11px;color:#64748b;">{s.critical_risk_count} Critical Risks</div>
        </div>
        <div class="scorecard-item">
            <div class="lbl">Mosca Urgent (X+Y&gt;Z)</div>
            <div class="val" style="color:#f59e0b;">{s.mosca_urgent_count}</div>
            <div style="font-size:11px;color:#64748b;">Active HNDL Exposure</div>
        </div>
        <div class="scorecard-item">
            <div class="lbl">Total Estimated Effort</div>
            <div class="val" style="color:#0284c7;">{rm.total_effort_hours if rm else 0}h</div>
            <div style="font-size:11px;color:#64748b;">${c.total_estimated_cost_usd if c else 0:,.0f} Budget</div>
        </div>
    </div>

    <!-- Executive Summary Statement -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px;margin-bottom:24px;font-size:12px;line-height:1.6;">
        <strong>Executive Assessment:</strong> The application <em>{s.target_name}</em> utilizes {s.crypto_assets_count} cryptographic assets. 
        Quantum risk analysis identified {s.critical_risk_count} critical-risk public-key algorithms and {s.mosca_urgent_count} assets with active 
        Harvest-Now-Decrypt-Later exposure. Immediate Phase 1 migration to NIST FIPS 203 (ML-KEM-768) and FIPS 204 (ML-DSA-65) is recommended.
    </div>

    <!-- 4-Phase Migration Roadmap -->
    <div class="section-title">1. Four-Phase Quantum Migration Roadmap</div>
    <div class="phases-grid">
        {phase_cards_html}
    </div>

    <!-- Quantum Readiness Factors -->
    <div class="section-title">2. Organization Quantum Readiness Methodology</div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin-bottom:30px;">
        {factors_html}
    </div>

    <!-- Asset-Level Migration Details Table -->
    <div class="section-title">3. Asset-Level Migration Actions & Cost Breakdown</div>
    <table>
        <thead>
            <tr>
                <th style="width:18%;">Asset & Location</th>
                <th style="width:14%;">Algorithm</th>
                <th style="width:10%;">Risk</th>
                <th style="width:14%;">Phase</th>
                <th style="width:16%;">Target PQC</th>
                <th style="width:10%;">Effort / Cost</th>
                <th style="width:18%;">Suggested Action</th>
            </tr>
        </thead>
        <tbody>
            {asset_rows_html}
        </tbody>
    </table>

    <!-- Footer -->
    <div style="margin-top:40px;border-top:1px solid #e2e8f0;padding-top:16px;text-align:center;font-size:11px;color:#94a3b8;">
        Generated by <strong>QuantumGuard</strong> &bull; NIST FIPS 203/204/205 Post-Quantum Cryptography Decision Platform &bull; CycloneDX 1.6 Compliant
    </div>

</div>

</body>
</html>
        """
        return html_content

migration_plan_generator = MigrationPlanGenerator()
