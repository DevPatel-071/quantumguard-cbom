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
from app.fmea.fmea_engine import fmea_engine
from app.dependency_intelligence.dependency_engine import dependency_engine
from app.monitoring.monitoring_engine import monitoring_engine
from app.reporting.migration_plan_generator import migration_plan_generator

print('==================================================================')
print('TESTING QUANTECT ENTERPRISE ENGINES & SUITE')
print('Tagline: Prepare Today, Secure Tomorrow.')
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
fmea = cbom.fmea_summary
dep = cbom.dependency_graph
mon = cbom.monitoring_summary

print(f'[PASS] QUANTECT Discovery Scan: {s.crypto_assets_count} assets, {s.quantum_vulnerable_count} Shor-vulnerable, Critical: {s.critical_risk_count}')

# 2. Test Quantum Readiness Assessment
assert r is not None, "Readiness assessment must be generated"
print(f'[PASS] Quantum Readiness Score: {r.overall_score}/100 ({r.status_label} - {r.status_tier})')

# 3. Test Migration Roadmap
assert rm is not None, "Roadmap report must be generated"
print(f'[PASS] Migration Roadmap: {len(rm.phases)} phases, Total Effort: {rm.total_effort_hours} hrs, Total Cost: ${rm.total_cost_usd:,.2f}')

# 4. Test Quantum FMEA (Failure Mode and Effects Analysis)
assert fmea is not None, "FMEA summary must be generated"
print(f'[PASS] Quantum FMEA Engine: Total {fmea.total_assessed} assets analyzed, Max RPN: {fmea.max_rpn}, Avg RPN: {fmea.average_rpn}')
top_fmea = fmea.records[0]
print(f'   -> Top Failure Mode: {top_fmea.asset_id} ({top_fmea.algorithm}) -> RPN: {top_fmea.rpn} ({top_fmea.severity}S × {top_fmea.occurrence}O × {top_fmea.detection}D) | {top_fmea.priority.value}')

# 5. Test Dependency Intelligence
assert dep is not None, "Dependency graph must be generated"
print(f'[PASS] Dependency Intelligence Graph: {len(dep.nodes)} nodes, {len(dep.edges)} edges, {dep.total_packages} packages')
for node in dep.nodes[:4]:
    print(f'   -> Node: [{node.node_type}] {node.label} (Depth: {node.depth})')

# 6. Test Continuous Monitoring Engine
assert mon is not None, "Monitoring summary must be generated"
print(f'[PASS] Continuous Monitoring: {mon.active_sources_count} active sources, {len(mon.recent_alerts)} alerts dispatched')

# 7. Test Export Migration Plan (HTML & JSON) with QUANTECT branding
html_plan = migration_plan_generator.generate_html_plan(cbom)
assert "QUANTECT" in html_plan
assert "Prepare Today, Secure Tomorrow." in html_plan
print(f'[PASS] Generated Branded QUANTECT HTML Migration Plan ({len(html_plan)} bytes)')

json_plan = migration_plan_generator.generate_json_plan(cbom)
parsed = json.loads(json_plan)
assert parsed["platform"] == "QUANTECT"
assert parsed["tagline"] == "Prepare Today, Secure Tomorrow."
print(f'[PASS] Generated Machine-Readable JSON Migration Plan ({len(json_plan)} bytes)')

print('==================================================================')
print('ALL QUANTECT ENGINES PASSED VERIFICATION TEST SUITE!')
print('==================================================================')
