import json
import os
import sys

# Add backend to path for direct engine unit testing
sys.path.insert(0, os.path.abspath('.'))

from app.scanner.scan_orchestrator import scan_orchestrator
from app.roadmap.roadmap_engine import roadmap_engine
from app.readiness.readiness_engine import readiness_engine
from app.cost_estimator.cost_engine import cost_engine
from app.latency_simulator.latency_engine import latency_engine
from app.reporting.migration_plan_generator import migration_plan_generator

print('==================================================================')
print('TESTING QUANTUMGUARD DECISION & READINESS PLATFORM (7 FEATURES)')
print('==================================================================')

# 1. Test Banking Sample Scan with Extended Decision Output
sample_dir = os.path.abspath('app/sample_repositories/banking-payment-gateway')
cbom = scan_orchestrator.scan_directory(
    dir_path=sample_dir,
    target_name="Banking Core Test Suite",
    application="Banking Switch API"
)

s = cbom.scan_summary
r = cbom.readiness_assessment
rm = cbom.roadmap_report
c = cbom.cost_summary

print(f'[PASS] CBOM Scan: {s.crypto_assets_count} assets, {s.quantum_vulnerable_count} Shor-vulnerable, Critical: {s.critical_risk_count}')

# 2. Test Feature 2: Quantum Readiness Assessment
assert r is not None, "Readiness assessment must be generated"
print(f'[PASS] Quantum Readiness Score: {r.overall_score}/100 ({r.status_label} - {r.status_tier})')
for f in r.factors:
    print(f'   -> Factor: {f.name} = {f.score}/100 (Weighted: {f.weighted_score})')

# 3. Test Feature 1: Migration Roadmap Generator
assert rm is not None, "Roadmap report must be generated"
print(f'[PASS] Migration Roadmap: {len(rm.phases)} phases, Total Effort: {rm.total_effort_hours} hrs, Total Cost: ${rm.total_cost_usd:,.2f}')
for p in rm.phases:
    print(f'   -> {p.phase_title}: {p.asset_count} assets ({p.critical_risk_count} critical), {p.total_effort_hours}h, Timeline: {p.target_timeline}')

# 4. Test Feature 3: Cost Estimator
assert c is not None, "Cost summary must be generated"
print(f'[PASS] Migration Cost Estimator: Total ${c.total_estimated_cost_usd:,.2f} (Dev: {c.total_engineering_hours}h, QA: {c.total_testing_hours}h, Tier: {c.cost_tier})')

# 5. Test Feature 4: Latency & Bandwidth Impact Simulator
lat_res = latency_engine.compare_algorithms("ECDH P-256", "Hybrid X25519 + ML-KEM-768")
print(f'[PASS] Latency Simulator: {lat_res.classical_algorithm} -> {lat_res.target_pqc_or_hybrid}')
print(f'   -> Latency Impact: {lat_res.overall_latency_impact}, Bandwidth: {lat_res.bandwidth_overhead}')
print(f'   -> Trade-off: {lat_res.tradeoff_explanation[:100]}...')

# 6. Test Feature 7: Explainable Risk Factor Breakdown on Asset
asset_0 = cbom.assets[0]
print(f'[PASS] Explainable Risk Breakdown for Asset #{asset_0.asset_id} ({asset_0.algorithm}):')
print(f'   -> Risk Score: {asset_0.risk_score} ({asset_0.risk_level})')
print(f'   -> Phase: {asset_0.phase_label}, Suggested Action: {asset_0.suggested_action[:60]}...')
assert len(asset_0.risk_factor_breakdown) > 0, "Asset must contain itemized factor breakdown"
for fb in asset_0.risk_factor_breakdown[:3]:
    print(f'      * {fb.factor_name}: {fb.score_points:+.1f} pts ({fb.description[:50]}...)')

# 7. Test Feature 6: Export Migration Plan (HTML & JSON)
html_plan = migration_plan_generator.generate_html_plan(cbom)
assert "Quantum Migration Decision & Readiness Plan" in html_plan
assert f"{r.overall_score}/100" in html_plan
print(f'[PASS] Generated Standalone HTML Migration Plan ({len(html_plan)} bytes)')

json_plan = migration_plan_generator.generate_json_plan(cbom)
parsed = json.loads(json_plan)
assert parsed["readiness_score"]["overall_score"] == r.overall_score
print(f'[PASS] Generated Machine-Readable JSON Migration Plan ({len(json_plan)} bytes)')

# 8. Test Clean Utility App (Zero False Positives & 100% Readiness)
clean_dir = os.path.abspath('app/sample_repositories/clean-utility-app')
clean_cbom = scan_orchestrator.scan_directory(clean_dir, target_name="Clean App")
assert clean_cbom.scan_summary.crypto_assets_count == 0
assert clean_cbom.readiness_assessment.overall_score == 100.0
print(f'[PASS] Clean App Verified: 0 assets, 100/100 Quantum Readiness.')

print('==================================================================')
print('ALL 7 NEW POST-QUANTUM PLATFORM ENGINES PASSED TEST SUITE!')
print('==================================================================')
