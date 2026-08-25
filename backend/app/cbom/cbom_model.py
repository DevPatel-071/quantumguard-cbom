from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ConfidenceLevel(str, Enum):
    CONFIRMED_USAGE = "CONFIRMED_USAGE"
    POTENTIAL_USAGE = "POTENTIAL_USAGE"
    DEPENDENCY_ONLY = "DEPENDENCY_ONLY"
    INFERRED = "INFERRED"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class BusinessCriticality(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Exposure(str, Enum):
    INTERNET_FACING = "INTERNET_FACING"
    INTERNAL_NETWORK = "INTERNAL_NETWORK"
    ISOLATED = "ISOLATED"

class MoscaUrgency(str, Enum):
    CRITICAL_URGENT = "CRITICAL_URGENT"
    HIGH_PRIORITY = "HIGH_PRIORITY"
    MONITOR = "MONITOR"
    SECURE = "SECURE"

class MoscaAssessment(BaseModel):
    x_data_lifetime: float = Field(..., description="Years data must remain confidential/valid")
    y_migration_time: float = Field(..., description="Years required to complete PQC migration")
    z_quantum_timeline: float = Field(..., description="Estimated years until CRQC arrival")
    x_plus_y: float = Field(..., description="Total exposure timeline X + Y")
    is_urgent: bool = Field(..., description="True if X + Y > Z")
    urgency: MoscaUrgency = Field(..., description="Urgency classification")
    hndl_exposure_years: float = Field(..., description="Harvest Now Decrypt Later risk window")
    explanation: str = Field(..., description="Plain-English explanation of Mosca formula result")

class CBOMAsset(BaseModel):
    asset_id: str
    algorithm: str
    category: str
    version: Optional[str] = None
    mode: Optional[str] = None
    key_size: Optional[int] = None
    curve: Optional[str] = None
    library: Optional[str] = None
    library_version: Optional[str] = None
    protocol: Optional[str] = None
    file: str
    line_number: Optional[int] = None
    code_snippet: Optional[str] = None
    application: str = "Default App"
    environment: str = "PRODUCTION"
    usage: str = "General Cryptography"
    evidence: str
    confidence: ConfidenceLevel
    data_sensitivity: str = "CONFIDENTIAL"
    data_lifetime_years: float = 10.0
    migration_time_years: float = 3.0
    business_criticality: BusinessCriticality = BusinessCriticality.HIGH
    exposure: Exposure = Exposure.INTERNET_FACING
    quantum_vulnerability: str = "HIGH"
    quantum_attack: Optional[str] = None
    risk_score: float = 0.0
    risk_level: RiskLevel = RiskLevel.MEDIUM
    risk_factors: List[str] = []
    mosca: Optional[MoscaAssessment] = None
    recommended_pqc: Optional[str] = None
    hybrid_alternative: Optional[str] = None
    migration_priority: int = 999
    migration_reason: Optional[str] = None
    status: str = "DISCOVERED"

class ScanSummary(BaseModel):
    scan_id: str
    scan_timestamp: str
    target_name: str
    files_scanned: int
    libraries_detected: int
    crypto_assets_count: int
    algorithm_counts: Dict[str, int]
    risk_distribution: Dict[str, int]
    confidence_distribution: Dict[str, int]
    quantum_vulnerable_count: int
    pqc_ready_count: int
    mosca_urgent_count: int
    critical_risk_count: int
    high_risk_count: int
    average_risk_score: float

class CBOMReport(BaseModel):
    cbom_version: str = "1.0.0"
    cyclonedx_spec_version: str = "1.6"
    generated_at: str
    scan_summary: ScanSummary
    assets: List[CBOMAsset]
    metadata: Dict[str, Any] = {}
