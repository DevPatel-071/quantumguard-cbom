import os
import json
import re
import tempfile
import subprocess
import shutil
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from pydantic import BaseModel

from app.cbom.cbom_model import (
    CBOMReport,
    CBOMAsset,
    BusinessCriticality,
    Exposure,
    ConfidenceLevel,
    CostParameters,
    CostEstimationSummary,
    LatencyComparisonResult,
    RoadmapReport,
    QuantumReadinessAssessment
)
from app.crypto_knowledge_base.kb_service import kb
from app.scanner.scan_orchestrator import scan_orchestrator
from app.mosca.mosca_engine import mosca_engine
from app.risk_engine.quantum_risk_engine import quantum_risk_engine
from app.prioritization.priority_engine import priority_engine
from app.roadmap.roadmap_engine import roadmap_engine
from app.readiness.readiness_engine import readiness_engine
from app.cost_estimator.cost_engine import cost_engine
from app.latency_simulator.latency_engine import latency_engine
from app.reporting.report_generator import report_generator
from app.reporting.migration_plan_generator import migration_plan_generator
from app.fmea.fmea_engine import fmea_engine
from app.dependency_intelligence.dependency_engine import dependency_engine
from app.monitoring.monitoring_engine import monitoring_engine, MonitoringStatus

router = APIRouter()

SAMPLE_REPOS = [
    {
        "id": "banking-payment-gateway",
        "name": "Banking Core & Payment Gateway",
        "description": "High-criticality enterprise transaction switch with C++ OpenSSL RSA-2048 signing, Java JCA AES-256-GCM encryption, Maven BouncyCastle crypto dependencies, and X.509 server certificates.",
        "default_application": "Core Payment Switch & Settlement API",
        "default_criticality": "CRITICAL",
        "default_exposure": "INTERNET_FACING",
        "default_data_lifetime": 15.0,
        "default_migration_time": 5.0,
        "default_quantum_horizon": 17.0,
        "icon": "bank"
    },
    {
        "id": "microservices-auth-service",
        "name": "OAuth2 & IAM Microservices Auth",
        "description": "Modern authentication microservice utilizing Python cryptography (ECDSA P-256, RSA), Node.js JWT signing, paramiko SSH client, and prototype NIST PQC (ML-KEM / ML-DSA).",
        "default_application": "Identity & Access Management API",
        "default_criticality": "HIGH",
        "default_exposure": "INTERNET_FACING",
        "default_data_lifetime": 10.0,
        "default_migration_time": 3.0,
        "default_quantum_horizon": 15.0,
        "icon": "shield-check"
    },
    {
        "id": "legacy-enterprise-portal",
        "name": "Legacy Enterprise E-Commerce Portal",
        "description": "Legacy monolith with heavy technical debt: 3DES bulk encryption, MD5 / SHA-1 credential digests, weak 1024-bit RSA keys, and legacy SSLv3/TLS 1.0 web configurations.",
        "default_application": "Legacy Enterprise E-Commerce",
        "default_criticality": "HIGH",
        "default_exposure": "INTERNET_FACING",
        "default_data_lifetime": 12.0,
        "default_migration_time": 4.0,
        "default_quantum_horizon": 15.0,
        "icon": "alert-triangle"
    },
    {
        "id": "cloud-native-api",
        "name": "Cloud-Native Go & Rust Service",
        "description": "Modern cloud-native service built in Go and Rust featuring AES-256-GCM, Ed25519 signatures, X25519 key exchange, and Cloudflare CIRCL PQC primitives.",
        "default_application": "Cloud-Native Storage & Data Vault",
        "default_criticality": "HIGH",
        "default_exposure": "INTERNAL_NETWORK",
        "default_data_lifetime": 8.0,
        "default_migration_time": 2.0,
        "default_quantum_horizon": 15.0,
        "icon": "cloud"
    },
    {
        "id": "clean-utility-app",
        "name": "Clean Utility App (0 Cryptography Baseline)",
        "description": "Clean utility codebase containing text manipulation and math algorithms without any cryptographic invocations (verifies 0 false positives).",
        "default_application": "String & Math Utilities",
        "default_criticality": "LOW",
        "default_exposure": "INTERNAL_NETWORK",
        "default_data_lifetime": 1.0,
        "default_migration_time": 0.5,
        "default_quantum_horizon": 15.0,
        "icon": "check-circle"
    }
]

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "Quantum-Ready Cryptographic Inventory & Risk Assessment Platform",
        "version": "2.0.0",
        "features": [
            "migration_roadmap_generator",
            "quantum_readiness_score",
            "cost_estimator",
            "latency_impact_simulator",
            "hndl_exposure_simulator",
            "export_migration_plan",
            "explainable_risk_breakdown"
        ],
        "pqc_standards": ["NIST FIPS 203 (ML-KEM)", "NIST FIPS 204 (ML-DSA)", "NIST FIPS 205 (SLH-DSA)"]
    }

@router.get("/samples")
def list_samples():
    return SAMPLE_REPOS

@router.get("/kb")
def get_knowledge_base(query: Optional[str] = None):
    if query:
        return kb.search_kb(query)
    return kb.get_all_algorithms()

@router.get("/kb/{algo_name}")
def get_kb_item(algo_name: str):
    item = kb.get_algorithm(algo_name)
    if not item:
        raise HTTPException(status_code=404, detail=f"Algorithm '{algo_name}' not found in Knowledge Base.")
    return item

class ScanSampleRequest(BaseModel):
    application: Optional[str] = None
    environment: Optional[str] = "PRODUCTION"
    business_criticality: Optional[BusinessCriticality] = BusinessCriticality.HIGH
    exposure: Optional[Exposure] = Exposure.INTERNET_FACING
    data_sensitivity: Optional[str] = "CONFIDENTIAL"
    data_lifetime_years: Optional[float] = 10.0
    migration_time_years: Optional[float] = 3.0
    quantum_timeline_years: Optional[float] = 15.0

@router.post("/scan/sample/{sample_id}", response_model=CBOMReport)
def scan_sample(sample_id: str, req: Optional[ScanSampleRequest] = None):
    sample_meta = next((s for s in SAMPLE_REPOS if s["id"] == sample_id), None)
    if not sample_meta:
        raise HTTPException(status_code=404, detail=f"Sample repo '{sample_id}' not found.")

    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sample_repositories", sample_id)
    if not os.path.exists(base_dir):
        raise HTTPException(status_code=404, detail=f"Sample directory for '{sample_id}' does not exist on disk.")

    app_name = req.application if (req and req.application) else sample_meta["default_application"]
    crit = req.business_criticality if req and req.business_criticality else BusinessCriticality(sample_meta["default_criticality"])
    expo = req.exposure if req and req.exposure else Exposure(sample_meta["default_exposure"])
    x_val = req.data_lifetime_years if req and req.data_lifetime_years is not None else sample_meta["default_data_lifetime"]
    y_val = req.migration_time_years if req and req.migration_time_years is not None else sample_meta["default_migration_time"]
    z_val = req.quantum_timeline_years if req and req.quantum_timeline_years is not None else sample_meta["default_quantum_horizon"]
    env_val = req.environment if req and req.environment else "PRODUCTION"
    sens_val = req.data_sensitivity if req and req.data_sensitivity else "CONFIDENTIAL"

    cbom = scan_orchestrator.scan_directory(
        dir_path=base_dir,
        target_name=sample_meta["name"],
        application=app_name,
        environment=env_val,
        business_criticality=crit,
        exposure=expo,
        data_sensitivity=sens_val,
        data_lifetime_years=x_val,
        migration_time_years=y_val,
        quantum_timeline_years=z_val
    )
    return cbom

@router.post("/scan/upload", response_model=CBOMReport)
async def scan_upload(
    file: UploadFile = File(...),
    application: str = Form("Uploaded Repository"),
    environment: str = Form("PRODUCTION"),
    business_criticality: str = Form("HIGH"),
    exposure: str = Form("INTERNET_FACING"),
    data_sensitivity: str = Form("CONFIDENTIAL"),
    data_lifetime_years: float = Form(10.0),
    migration_time_years: float = Form(3.0),
    quantum_timeline_years: float = Form(15.0)
):
    try:
        content = await file.read()
        filename = file.filename or "uploaded_archive.zip"

        crit = BusinessCriticality(business_criticality) if business_criticality in BusinessCriticality._value2member_map_ else BusinessCriticality.HIGH
        expo = Exposure(exposure) if exposure in Exposure._value2member_map_ else Exposure.INTERNET_FACING

        cbom = scan_orchestrator.scan_archive(
            archive_bytes=content,
            archive_name=filename,
            application=application,
            environment=environment,
            business_criticality=crit,
            exposure=expo,
            data_sensitivity=data_sensitivity,
            data_lifetime_years=data_lifetime_years,
            migration_time_years=migration_time_years,
            quantum_timeline_years=quantum_timeline_years
        )
        return cbom
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scan uploaded archive: {str(e)}")

@router.post("/scan/folder-upload", response_model=CBOMReport)
async def scan_folder_upload(
    files: List[UploadFile] = File(...),
    paths: str = Form(...),
    folder_name: str = Form("Uploaded Folder"),
    application: str = Form("Uploaded Application"),
    environment: str = Form("PRODUCTION"),
    business_criticality: str = Form("HIGH"),
    exposure: str = Form("INTERNET_FACING"),
    data_sensitivity: str = Form("CONFIDENTIAL"),
    data_lifetime_years: float = Form(10.0),
    migration_time_years: float = Form(3.0),
    quantum_timeline_years: float = Form(15.0)
):
    try:
        rel_paths = json.loads(paths)
    except Exception:
        rel_paths = [f.filename for f in files]

    with tempfile.TemporaryDirectory() as temp_dir:
        for idx, file_obj in enumerate(files):
            rel_path = rel_paths[idx] if idx < len(rel_paths) else file_obj.filename
            clean_rel_path = os.path.normpath(rel_path).replace("\\", "/")
            if clean_rel_path.startswith("..") or os.path.isabs(clean_rel_path):
                clean_rel_path = os.path.basename(clean_rel_path)

            dest_path = os.path.join(temp_dir, clean_rel_path)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            
            content = await file_obj.read()
            with open(dest_path, "wb") as f:
                f.write(content)

        crit = BusinessCriticality(business_criticality) if business_criticality in BusinessCriticality._value2member_map_ else BusinessCriticality.HIGH
        expo = Exposure(exposure) if exposure in Exposure._value2member_map_ else Exposure.INTERNET_FACING

        cbom = scan_orchestrator.scan_directory(
            dir_path=temp_dir,
            target_name=f"Folder: {folder_name}",
            application=application,
            environment=environment,
            business_criticality=crit,
            exposure=expo,
            data_sensitivity=data_sensitivity,
            data_lifetime_years=data_lifetime_years,
            migration_time_years=migration_time_years,
            quantum_timeline_years=quantum_timeline_years
        )
        return cbom

class GitRepoScanRequest(BaseModel):
    git_url: str
    branch: Optional[str] = None
    application: Optional[str] = "Git Repository"
    environment: Optional[str] = "PRODUCTION"
    business_criticality: Optional[BusinessCriticality] = BusinessCriticality.HIGH
    exposure: Optional[Exposure] = Exposure.INTERNET_FACING
    data_sensitivity: Optional[str] = "CONFIDENTIAL"
    data_lifetime_years: Optional[float] = 10.0
    migration_time_years: Optional[float] = 3.0
    quantum_timeline_years: Optional[float] = 15.0

@router.post("/scan/git-repo", response_model=CBOMReport)
def scan_git_repo(req: GitRepoScanRequest):
    url = req.git_url.strip()
    if not url.startswith(("http://", "https://", "git://", "git@")):
        raise HTTPException(status_code=400, detail="Invalid Git URL. Must start with https://, http://, or git@")

    repo_name = url.rstrip("/").split("/")[-1].replace(".git", "") or "Git Repository"

    with tempfile.TemporaryDirectory() as temp_dir:
        clone_cmd = ["git", "clone", "--depth", "1"]
        if req.branch:
            clone_cmd.extend(["--branch", req.branch])
        clone_cmd.extend([url, temp_dir])

        try:
            res = subprocess.run(
                clone_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=60
            )
            if res.returncode != 0:
                raise HTTPException(status_code=400, detail=f"Git clone failed: {res.stderr.strip()[:300]}")
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="Git clone operation timed out (60s limit).")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to clone Git repository: {str(e)}")

        cbom = scan_orchestrator.scan_directory(
            dir_path=temp_dir,
            target_name=f"Git Repo: {repo_name}",
            application=req.application or repo_name,
            environment=req.environment or "PRODUCTION",
            business_criticality=req.business_criticality or BusinessCriticality.HIGH,
            exposure=req.exposure or Exposure.INTERNET_FACING,
            data_sensitivity=req.data_sensitivity or "CONFIDENTIAL",
            data_lifetime_years=req.data_lifetime_years or 10.0,
            migration_time_years=req.migration_time_years or 3.0,
            quantum_timeline_years=req.quantum_timeline_years or 15.0
        )
        return cbom

class LocalPathScanRequest(BaseModel):
    path: str
    application: Optional[str] = "Local System Path"
    environment: Optional[str] = "PRODUCTION"
    business_criticality: Optional[BusinessCriticality] = BusinessCriticality.HIGH
    exposure: Optional[Exposure] = Exposure.INTERNET_FACING
    data_sensitivity: Optional[str] = "CONFIDENTIAL"
    data_lifetime_years: Optional[float] = 10.0
    migration_time_years: Optional[float] = 3.0
    quantum_timeline_years: Optional[float] = 15.0

@router.post("/scan/local-path", response_model=CBOMReport)
def scan_local_path(req: LocalPathScanRequest):
    dir_path = os.path.abspath(req.path.strip())
    if not os.path.exists(dir_path):
        raise HTTPException(status_code=404, detail=f"Directory path '{req.path}' does not exist.")
    if not os.path.isdir(dir_path):
        raise HTTPException(status_code=400, detail=f"Path '{req.path}' is a file, not a directory.")

    target_name = os.path.basename(dir_path) or req.path
    cbom = scan_orchestrator.scan_directory(
        dir_path=dir_path,
        target_name=f"Local: {target_name}",
        application=req.application or target_name,
        environment=req.environment or "PRODUCTION",
        business_criticality=req.business_criticality or BusinessCriticality.HIGH,
        exposure=req.exposure or Exposure.INTERNET_FACING,
        data_sensitivity=req.data_sensitivity or "CONFIDENTIAL",
        data_lifetime_years=req.data_lifetime_years or 10.0,
        migration_time_years=req.migration_time_years or 3.0,
        quantum_timeline_years=req.quantum_timeline_years or 15.0
    )
    return cbom

class RawCodeRequest(BaseModel):
    file_name: str = "snippet.cpp"
    code: str
    application: str = "Raw Code Snippet"
    business_criticality: BusinessCriticality = BusinessCriticality.HIGH
    exposure: Exposure = Exposure.INTERNET_FACING
    data_sensitivity: str = "CONFIDENTIAL"
    data_lifetime_years: float = 10.0
    migration_time_years: float = 3.0
    quantum_timeline_years: float = 15.0

@router.post("/scan/raw-code", response_model=CBOMReport)
def scan_raw_code(req: RawCodeRequest):
    content_bytes = req.code.encode("utf-8")
    cbom = scan_orchestrator.scan_archive(
        archive_bytes=content_bytes,
        archive_name=req.file_name,
        application=req.application,
        business_criticality=req.business_criticality,
        exposure=req.exposure,
        data_sensitivity=req.data_sensitivity,
        data_lifetime_years=req.data_lifetime_years,
        migration_time_years=req.migration_time_years,
        quantum_timeline_years=req.quantum_timeline_years
    )
    return cbom

# -------------------------------------------------------------
# FEATURE 4: LATENCY SIMULATOR ENDPOINT
# -------------------------------------------------------------
class LatencyCompareRequest(BaseModel):
    classical_algorithm: str
    target_pqc_or_hybrid: str

@router.post("/latency-impact", response_model=LatencyComparisonResult)
def simulate_latency_impact(req: LatencyCompareRequest):
    return latency_engine.compare_algorithms(req.classical_algorithm, req.target_pqc_or_hybrid)

@router.get("/latency-impact", response_model=LatencyComparisonResult)
def get_latency_impact(classical: str = "RSA-2048", pqc: str = "ML-KEM-768"):
    return latency_engine.compare_algorithms(classical, pqc)

# -------------------------------------------------------------
# FEATURE 3: COST ESTIMATION OVERRIDE ENDPOINT
# -------------------------------------------------------------
class CostEstimateRequest(BaseModel):
    assets: List[CBOMAsset]
    developer_hourly_rate: Optional[float] = 120.0
    qa_testing_hourly_rate: Optional[float] = 90.0
    infra_cost_per_asset: Optional[float] = 500.0
    complexity_multiplier: Optional[float] = 1.0

@router.post("/cost-estimate", response_model=CostEstimationSummary)
def calculate_cost_estimate(req: CostEstimateRequest):
    params = CostParameters(
        developer_hourly_rate=req.developer_hourly_rate or 120.0,
        qa_testing_hourly_rate=req.qa_testing_hourly_rate or 90.0,
        infra_cost_per_asset=req.infra_cost_per_asset or 500.0,
        complexity_multiplier=req.complexity_multiplier or 1.0
    )
    return cost_engine.calculate_portfolio_cost(req.assets, params)

# -------------------------------------------------------------
# FEATURE 5 & REALTIME MOSCA RE-CALCULATION
# -------------------------------------------------------------
class MoscaSimulationRequest(BaseModel):
    x_data_lifetime: float
    y_migration_time: float
    z_quantum_timeline: float
    assets: List[CBOMAsset]

@router.post("/mosca/simulate")
def simulate_mosca(req: MoscaSimulationRequest):
    updated_assets = []
    mosca_urgent_count = 0
    total_risk = 0.0

    for a in req.assets:
        is_conf = "encryption" in a.usage.lower() or "key" in a.usage.lower() or "secret" in a.usage.lower()
        new_mosca = mosca_engine.evaluate(
            x_data_lifetime=req.x_data_lifetime,
            y_migration_time=req.y_migration_time,
            z_quantum_timeline=req.z_quantum_timeline,
            is_confidentiality_sensitive=is_conf
        )
        if new_mosca.is_urgent:
            mosca_urgent_count += 1

        new_risk_score, new_risk_lvl, rationales, factor_scores, risk_explanation, recommended_action = quantum_risk_engine.calculate_risk(
            algorithm=a.algorithm,
            key_size=a.key_size,
            usage=a.usage,
            confidence=a.confidence,
            business_criticality=a.business_criticality,
            exposure=a.exposure,
            data_sensitivity=a.data_sensitivity,
            mosca=new_mosca
        )

        a.mosca = new_mosca
        a.risk_score = new_risk_score
        a.risk_level = new_risk_lvl
        a.risk_factors = rationales
        a.risk_factor_breakdown = factor_scores
        a.risk_explanation = risk_explanation
        a.recommended_action = recommended_action
        a.data_lifetime_years = req.x_data_lifetime
        a.migration_time_years = req.y_migration_time
        total_risk += new_risk_score
        updated_assets.append(a)

    prioritized = priority_engine.prioritize_assets(updated_assets)
    enriched_assets, roadmap_rep = roadmap_engine.generate_roadmap(prioritized)

    # Recompute summary metrics
    summary = ScanSummary(
        scan_id="SIMULATED",
        scan_timestamp="NOW",
        target_name="Simulated Scenario",
        files_scanned=len(enriched_assets),
        libraries_detected=1,
        crypto_assets_count=len(enriched_assets),
        algorithm_counts={},
        risk_distribution={},
        confidence_distribution={},
        quantum_vulnerable_count=sum(1 for a in enriched_assets if a.quantum_vulnerability in ["CRITICAL", "HIGH"]),
        pqc_ready_count=sum(1 for a in enriched_assets if "QUANTUM_RESISTANT" in str(a.quantum_vulnerability) or "ML-" in a.algorithm),
        mosca_urgent_count=mosca_urgent_count,
        critical_risk_count=sum(1 for a in enriched_assets if a.risk_level == "CRITICAL"),
        high_risk_count=sum(1 for a in enriched_assets if a.risk_level == "HIGH"),
        average_risk_score=round(total_risk / len(enriched_assets), 1) if enriched_assets else 0.0
    )

    readiness = readiness_engine.evaluate_readiness(enriched_assets, summary)
    costs = cost_engine.calculate_portfolio_cost(enriched_assets)

    return {
        "assets": enriched_assets,
        "mosca_urgent_count": mosca_urgent_count,
        "average_risk_score": summary.average_risk_score,
        "x_plus_y": round(req.x_data_lifetime + req.y_migration_time, 2),
        "is_overall_urgent": (req.x_data_lifetime + req.y_migration_time) > req.z_quantum_timeline,
        "roadmap_report": roadmap_rep,
        "readiness_assessment": readiness,
        "cost_summary": costs
    }

# -------------------------------------------------------------
# FEATURE 6: EXPORT MIGRATION PLAN ENDPOINTS
# -------------------------------------------------------------
@router.post("/export/migration-plan/html")
def export_migration_plan_html(cbom: CBOMReport):
    html_str = migration_plan_generator.generate_html_plan(cbom)
    return Response(
        content=html_str,
        media_type="text/html",
        headers={"Content-Disposition": f"attachment; filename=migration_plan_{cbom.scan_summary.scan_id}.html"}
    )

@router.post("/export/migration-plan/json")
def export_migration_plan_json(cbom: CBOMReport):
    json_str = migration_plan_generator.generate_json_plan(cbom)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=migration_plan_{cbom.scan_summary.scan_id}.json"}
    )

# -------------------------------------------------------------
# STANDARDIZED CBOM EXPORTS
# -------------------------------------------------------------
@router.post("/export/cbom/json")
def export_cbom_json(cbom: CBOMReport):
    json_str = report_generator.generate_json(cbom)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=cbom_{cbom.scan_summary.scan_id}.json"}
    )

@router.post("/export/cbom/csv")
def export_cbom_csv(cbom: CBOMReport):
    csv_str = report_generator.generate_csv(cbom)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=cbom_{cbom.scan_summary.scan_id}.csv"}
    )

@router.post("/export/report/html")
def export_report_html(cbom: CBOMReport):
    html_str = report_generator.generate_html_report(cbom)
    return Response(
        content=html_str,
        media_type="text/html",
        headers={"Content-Disposition": f"attachment; filename=audit_report_{cbom.scan_summary.scan_id}.html"}
    )

# -------------------------------------------------------------
# DEPENDENCY INTELLIGENCE ENDPOINT
# -------------------------------------------------------------
class DependencyGraphRequest(BaseModel):
    assets: List[CBOMAsset]
    application_name: Optional[str] = "Enterprise Application"

@router.post("/dependencies")
def get_dependency_graph(req: DependencyGraphRequest):
    graph = dependency_engine.build_graph(req.assets, req.application_name or "Enterprise Application")
    return graph

# -------------------------------------------------------------
# QUANTUM FMEA ENDPOINT
# -------------------------------------------------------------
class FMEARequest(BaseModel):
    assets: List[CBOMAsset]

@router.post("/fmea")
def get_fmea_analysis(req: FMEARequest):
    fmea_summary = fmea_engine.analyze_portfolio(req.assets)
    return fmea_summary

# -------------------------------------------------------------
# CONTINUOUS MONITORING & ALERTS ENDPOINTS
# -------------------------------------------------------------
class RegisterMonitoringRequest(BaseModel):
    name: str
    source_type: str = "DIRECTORY"
    target_path: str
    total_assets: int = 0
    critical_count: int = 0

class UpdateMonitoringStatusRequest(BaseModel):
    status: str # "ACTIVE", "PAUSED", "DISABLED"

@router.get("/monitoring/summary")
def get_monitoring_summary():
    return monitoring_engine.get_summary()

@router.post("/monitoring/register")
def register_monitoring_source(req: RegisterMonitoringRequest):
    src = monitoring_engine.register_source(
        name=req.name,
        source_type=req.source_type,
        target_path=req.target_path,
        total_assets=req.total_assets,
        critical_count=req.critical_count
    )
    return src

@router.post("/monitoring/sources/{source_id}/status")
def update_monitoring_source_status(source_id: str, req: UpdateMonitoringStatusRequest):
    st = MonitoringStatus(req.status.upper())
    updated = monitoring_engine.set_source_status(source_id, st)
    if not updated:
        raise HTTPException(status_code=404, detail="Monitored source not found")
    return updated

@router.post("/monitoring/alerts/{alert_id}/read")
def mark_alert_read(alert_id: str):
    monitoring_engine.mark_alert_read(alert_id)
    return {"status": "success", "alert_id": alert_id}

