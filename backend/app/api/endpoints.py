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
    ConfidenceLevel
)
from app.crypto_knowledge_base.kb_service import kb
from app.scanner.scan_orchestrator import scan_orchestrator
from app.mosca.mosca_engine import mosca_engine
from app.risk_engine.quantum_risk_engine import quantum_risk_engine
from app.prioritization.priority_engine import priority_engine
from app.reporting.report_generator import report_generator

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
        "version": "1.0.0",
        "pqc_standards": ["NIST FIPS 203 (ML-KEM)", "NIST FIPS 204 (ML-DSA)", "NIST FIPS 205 (SLH-DSA)"],
        "capabilities": ["folder_upload", "zip_tar_upload", "git_clone_scan", "local_path_scan", "ast_analysis"]
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
    paths: str = Form(...), # JSON array of relative paths
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
            # Sanitize path to prevent directory traversal
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

    # Extract repo name
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

        new_risk_score, new_risk_lvl, rationales = quantum_risk_engine.calculate_risk(
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
        a.data_lifetime_years = req.x_data_lifetime
        a.migration_time_years = req.y_migration_time
        total_risk += new_risk_score
        updated_assets.append(a)

    prioritized = priority_engine.prioritize_assets(updated_assets)
    avg_risk = round(total_risk / len(prioritized), 1) if prioritized else 0.0

    return {
        "assets": prioritized,
        "mosca_urgent_count": mosca_urgent_count,
        "average_risk_score": avg_risk,
        "x_plus_y": round(req.x_data_lifetime + req.y_migration_time, 2),
        "is_overall_urgent": (req.x_data_lifetime + req.y_migration_time) > req.z_quantum_timeline
    }

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
