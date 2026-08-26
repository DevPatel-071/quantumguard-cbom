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

class RoadmapPhaseType(str, Enum):
    PHASE_1_IMMEDIATE = "PHASE_1_IMMEDIATE"
    PHASE_2_HIGH_PRIORITY = "PHASE_2_HIGH_PRIORITY"
    PHASE_3_PLANNED = "PHASE_3_PLANNED"
    PHASE_4_MONITOR = "PHASE_4_MONITOR"

class MoscaAssessment(BaseModel):
    x_data_lifetime: float = Field(..., description="Years data must remain confidential/valid")
    y_migration_time: float = Field(..., description="Years required to complete PQC migration")
    z_quantum_timeline: float = Field(..., description="Estimated years until CRQC arrival")
    x_plus_y: float = Field(..., description="Total exposure timeline X + Y")
    is_urgent: bool = Field(..., description="True if X + Y > Z")
    urgency: MoscaUrgency = Field(..., description="Urgency classification")
    hndl_exposure_years: float = Field(..., description="Harvest Now Decrypt Later risk window")
    explanation: str = Field(..., description="Plain-English explanation of Mosca formula result")

class RiskFactorScore(BaseModel):
    factor_name: str
    score_points: float
    description: str

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
    risk_factor_breakdown: List[RiskFactorScore] = []
    risk_explanation: Optional[str] = None
    recommended_action: Optional[str] = None
    mosca: Optional[MoscaAssessment] = None
    recommended_pqc: Optional[str] = None
    hybrid_alternative: Optional[str] = None
    migration_priority: int = 999
    migration_reason: Optional[str] = None
    
    # New Migration Decision & Roadmap fields
    migration_phase: RoadmapPhaseType = RoadmapPhaseType.PHASE_3_PLANNED
    phase_label: str = "Phase 3: Planned Migration"
    suggested_action: str = "Schedule algorithm refactoring in upcoming release."
    estimated_effort_hours: float = 24.0
    estimated_cost_usd: float = 2800.0
    cost_category: str = "MEDIUM" # LOW | MEDIUM | HIGH | VERY HIGH
    complexity_rating: str = "MEDIUM" # LOW | MEDIUM | HIGH | VERY HIGH
    latency_impact: str = "LOW" # MINIMAL | LOW | MODERATE | SIGNIFICANT
    bandwidth_impact: str = "LOW (+1.1 KB)"
    status: str = "DISCOVERED"

class ReadinessFactor(BaseModel):
    factor_id: str
    name: str
    score: float # 0 to 100
    weight: float # percentage, e.g. 0.20
    weighted_score: float
    description: str
    status: str

class QuantumReadinessAssessment(BaseModel):
    overall_score: float # 0 to 100
    status_label: str # "Quantum Ready", "Strong Readiness", "Moderate Readiness", "High Exposure", "Critical Exposure"
    status_tier: str # "EXCELLENT", "GOOD", "MODERATE", "WARNING", "CRITICAL"
    status_color: str # "emerald", "sky", "amber", "orange", "rose"
    factors: List[ReadinessFactor] = []
    strengths: List[str] = []
    gaps: List[str] = []
    summary: str

class RoadmapPhaseSummary(BaseModel):
    phase_type: RoadmapPhaseType
    phase_title: str
    target_timeline: str
    asset_count: int
    critical_risk_count: int
    high_risk_count: int
    total_effort_hours: float
    total_cost_usd: float
    action_summary: str

class RoadmapReport(BaseModel):
    phases: List[RoadmapPhaseSummary]
    total_assets: int
    total_effort_hours: float
    total_cost_usd: float
    immediate_actions_count: int
    timeline_overview: str

class CostParameters(BaseModel):
    developer_hourly_rate: float = 120.0
    qa_testing_hourly_rate: float = 90.0
    infra_cost_per_asset: float = 500.0
    complexity_multiplier: float = 1.0

class CostEstimationSummary(BaseModel):
    parameters: CostParameters
    total_engineering_hours: float
    total_testing_hours: float
    engineering_cost_usd: float
    testing_cost_usd: float
    infrastructure_cost_usd: float
    total_estimated_cost_usd: float
    cost_tier: str # "LOW", "MEDIUM", "HIGH", "ENTERPRISE_SCALE"

class LatencyMetricComparison(BaseModel):
    metric_name: str
    classical_value: str
    pqc_value: str
    impact_level: str # "MINIMAL", "FASTER", "SLOWER", "MODERATE", "HIGH"
    details: str

class LatencyComparisonResult(BaseModel):
    classical_algorithm: str
    target_pqc_or_hybrid: str
    category: str # "KEY_EXCHANGE", "SIGNATURE", "SYMMETRIC"
    overall_latency_impact: str # "MINIMAL", "LOW", "MODERATE", "SIGNIFICANT"
    bandwidth_overhead: str
    cpu_impact: str
    memory_impact: str
    metrics: List[LatencyMetricComparison]
    tradeoff_explanation: str

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
    readiness_assessment: Optional[QuantumReadinessAssessment] = None
    roadmap_report: Optional[RoadmapReport] = None
    cost_summary: Optional[CostEstimationSummary] = None
    metadata: Dict[str, Any] = {}
