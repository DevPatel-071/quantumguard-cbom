import os
import io
import zipfile
import tarfile
import tempfile
import shutil
from typing import List, Dict, Any, Optional
from app.cbom.cbom_model import (
    CBOMReport,
    BusinessCriticality,
    Exposure,
    ConfidenceLevel
)
from app.cbom.cbom_generator import cbom_generator
from app.scanner.source_analyzer import source_analyzer
from app.scanner.dependency_analyzer import dependency_analyzer
from app.scanner.certificate_analyzer import certificate_analyzer
from app.scanner.container_analyzer import container_analyzer
from app.scanner.config_analyzer import config_analyzer
from app.scanner.binary_analyzer import binary_analyzer

IGNORED_DIRS = {
    ".git", ".github", ".vscode", ".idea", "node_modules", "__pycache__",
    ".venv", "venv", "env", ".pytest_cache", ".tox", "dist", "build", "target"
}

class ScanOrchestrator:

    @classmethod
    def scan_directory(
        cls,
        dir_path: str,
        target_name: str = "Scanned Repository",
        application: str = "Banking API",
        environment: str = "PRODUCTION",
        business_criticality: BusinessCriticality = BusinessCriticality.HIGH,
        exposure: Exposure = Exposure.INTERNET_FACING,
        data_sensitivity: str = "CONFIDENTIAL",
        data_lifetime_years: float = 10.0,
        migration_time_years: float = 3.0,
        quantum_timeline_years: float = 15.0
    ) -> CBOMReport:
        raw_findings = []
        files_scanned = 0
        confirmed_libraries_in_code = set()

        if not os.path.exists(dir_path) or not os.path.isdir(dir_path):
            raise ValueError(f"Directory path '{dir_path}' does not exist or is not a directory.")

        # Step 1: Walk files
        for root, dirs, files in os.walk(dir_path):
            # Prune ignored dirs
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dir_path).replace("\\", "/")
                files_scanned += 1

                try:
                    with open(full_path, "rb") as f:
                        raw_bytes = f.read()

                    # Try text decoding
                    text_content = ""
                    try:
                        text_content = raw_bytes.decode("utf-8")
                    except Exception:
                        try:
                            text_content = raw_bytes.decode("latin-1")
                        except Exception:
                            pass

                    # 1. Source Code Analyzer
                    if text_content:
                        src_res = source_analyzer.scan_file(full_path, rel_path, text_content)
                        for r in src_res:
                            raw_findings.append(r)
                            if r.get("library"):
                                confirmed_libraries_in_code.add(r["library"].lower())

                    # 2. Dependency Manifest Analyzer
                    if text_content:
                        dep_res = dependency_analyzer.scan_manifest(file, rel_path, text_content)
                        raw_findings.extend(dep_res)

                    # 3. Certificate & Key Analyzer
                    cert_res = certificate_analyzer.scan_certificate_or_key(file, rel_path, raw_bytes)
                    raw_findings.extend(cert_res)

                    # 4. Container Analyzer
                    if text_content:
                        cont_res = container_analyzer.scan_container_file(file, rel_path, text_content)
                        raw_findings.extend(cont_res)

                    # 5. Config Analyzer
                    if text_content:
                        cfg_res = config_analyzer.scan_config(file, rel_path, text_content)
                        raw_findings.extend(cfg_res)

                    # 6. Binary Analyzer
                    bin_res = binary_analyzer.scan_binary(file, rel_path, raw_bytes)
                    raw_findings.extend(bin_res)

                except Exception:
                    continue

        # Step 2: Generate CBOM
        return cbom_generator.build_cbom(
            raw_findings=raw_findings,
            target_name=target_name,
            files_scanned_count=files_scanned,
            application=application,
            environment=environment,
            business_criticality=business_criticality,
            exposure=exposure,
            data_sensitivity=data_sensitivity,
            data_lifetime_years=data_lifetime_years,
            migration_time_years=migration_time_years,
            quantum_timeline_years=quantum_timeline_years
        )

    @classmethod
    def scan_archive(
        cls,
        archive_bytes: bytes,
        archive_name: str,
        application: str = "Uploaded Repository",
        environment: str = "PRODUCTION",
        business_criticality: BusinessCriticality = BusinessCriticality.HIGH,
        exposure: Exposure = Exposure.INTERNET_FACING,
        data_sensitivity: str = "CONFIDENTIAL",
        data_lifetime_years: float = 10.0,
        migration_time_years: float = 3.0,
        quantum_timeline_years: float = 15.0
    ) -> CBOMReport:
        lower_name = archive_name.lower()
        
        # 1. ZIP Archive
        if lower_name.endswith(".zip"):
            with tempfile.TemporaryDirectory() as temp_dir:
                try:
                    with zipfile.ZipFile(io.BytesIO(archive_bytes), "r") as zf:
                        # Extract safely preventing zip slip
                        for member in zf.infolist():
                            # Path traversal security check
                            norm_path = os.path.normpath(member.filename)
                            if norm_path.startswith("..") or os.path.isabs(norm_path):
                                continue
                            zf.extract(member, temp_dir)
                    return cls.scan_directory(
                        dir_path=temp_dir,
                        target_name=archive_name,
                        application=application,
                        environment=environment,
                        business_criticality=business_criticality,
                        exposure=exposure,
                        data_sensitivity=data_sensitivity,
                        data_lifetime_years=data_lifetime_years,
                        migration_time_years=migration_time_years,
                        quantum_timeline_years=quantum_timeline_years
                    )
                except Exception as e:
                    raise ValueError(f"Failed to unpack ZIP archive: {str(e)}")

        # 2. Tarball (.tar, .tar.gz, .tgz, .tar.bz2)
        elif lower_name.endswith((".tar", ".tar.gz", ".tgz", ".tar.bz2")):
            with tempfile.TemporaryDirectory() as temp_dir:
                try:
                    mode = "r:*"
                    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode=mode) as tf:
                        for member in tf.getmembers():
                            norm_path = os.path.normpath(member.name)
                            if norm_path.startswith("..") or os.path.isabs(norm_path):
                                continue
                            tf.extract(member, temp_dir)
                    return cls.scan_directory(
                        dir_path=temp_dir,
                        target_name=archive_name,
                        application=application,
                        environment=environment,
                        business_criticality=business_criticality,
                        exposure=exposure,
                        data_sensitivity=data_sensitivity,
                        data_lifetime_years=data_lifetime_years,
                        migration_time_years=migration_time_years,
                        quantum_timeline_years=quantum_timeline_years
                    )
                except Exception as e:
                    raise ValueError(f"Failed to unpack Tarball archive: {str(e)}")

        # 3. Single File Upload
        else:
            with tempfile.TemporaryDirectory() as temp_dir:
                safe_name = os.path.basename(archive_name)
                file_path = os.path.join(temp_dir, safe_name)
                with open(file_path, "wb") as f:
                    f.write(archive_bytes)
                return cls.scan_directory(
                    dir_path=temp_dir,
                    target_name=archive_name,
                    application=application,
                    environment=environment,
                    business_criticality=business_criticality,
                    exposure=exposure,
                    data_sensitivity=data_sensitivity,
                    data_lifetime_years=data_lifetime_years,
                    migration_time_years=migration_time_years,
                    quantum_timeline_years=quantum_timeline_years
                )

scan_orchestrator = ScanOrchestrator()
