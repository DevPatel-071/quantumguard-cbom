from typing import Dict, Any, List, Optional
from app.cbom.cbom_model import (
    LatencyComparisonResult,
    LatencyMetricComparison
)

LATENCY_BENCHMARK_PROFILES = {
    # Key Encapsulation (KEX / KEM)
    ("RSA-2048", "ML-KEM-768"): {
        "category": "KEY_EXCHANGE",
        "overall_latency_impact": "LOW",
        "bandwidth_overhead": "+1,184 B Public Key, +1,088 B Ciphertext",
        "cpu_impact": "FASTER (Lattice arithmetic is ~8-12x faster than 2048-bit modular exponentiation)",
        "memory_impact": "LOW (Under 4 KB working buffer)",
        "metrics": [
            LatencyMetricComparison(metric_name="Public Key Size", classical_value="256 Bytes", pqc_value="1,184 Bytes", impact_level="MODERATE", details="~4.6x increase in public key payload size."),
            LatencyMetricComparison(metric_name="Ciphertext Size", classical_value="256 Bytes", pqc_value="1,088 Bytes", impact_level="MODERATE", details="~4.2x increase in key encapsulation message."),
            LatencyMetricComparison(metric_name="Encapsulation (CPU)", classical_value="High (Modular Exp)", pqc_value="Ultra-Fast (NTT Polynomials)", impact_level="FASTER", details="ML-KEM encapsulates in ~20-40 microseconds vs ~150-300 microseconds for RSA."),
            LatencyMetricComparison(metric_name="Decapsulation (CPU)", classical_value="Very High (RSA Private Key)", pqc_value="Ultra-Fast (NTT Polynomials)", impact_level="FASTER", details="ML-KEM decapsulates in ~30-50 microseconds vs ~1.2 milliseconds for RSA."),
            LatencyMetricComparison(metric_name="TLS Handshake Overhead", classical_value="Baseline (~15-30 ms WAN)", pqc_value="+0.5 – 1.8 ms", impact_level="LOW", details="Slight network transmission latency on constrained networks, offset by faster CPU execution.")
        ],
        "tradeoff_explanation": "ML-KEM-768 (NIST FIPS 203) provides quantum resistance and significantly faster CPU encryption/decryption than RSA-2048, in exchange for a modest ~2.2 KB total transmission size increase per TLS handshake."
    },
    ("ECDH P-256", "Hybrid X25519 + ML-KEM-768"): {
        "category": "KEY_EXCHANGE",
        "overall_latency_impact": "LOW",
        "bandwidth_overhead": "+1,216 B Public Key (+32 B X25519, +1,184 B ML-KEM)",
        "cpu_impact": "LOW OVERHEAD (X25519 + ML-KEM compute in parallel in < 0.1 ms)",
        "memory_impact": "LOW (< 5 KB)",
        "metrics": [
            LatencyMetricComparison(metric_name="Public Key Size", classical_value="64 Bytes", pqc_value="1,216 Bytes", impact_level="MODERATE", details="Combined X25519 (32B) + ML-KEM-768 (1,184B) hybrid key exchange."),
            LatencyMetricComparison(metric_name="Ciphertext Size", classical_value="32 Bytes", pqc_value="1,120 Bytes", impact_level="MODERATE", details="Dual ephemeral public key/ciphertext encapsulation."),
            LatencyMetricComparison(metric_name="CPU Execution Time", classical_value="~0.04 ms", pqc_value="~0.09 ms", impact_level="LOW", details="Negligible CPU impact across modern server hardware."),
            LatencyMetricComparison(metric_name="Handshake Packet Fragmentation", classical_value="0% (Single TCP packet)", pqc_value="< 2% on low MTU links", impact_level="LOW", details="ClientHello fits comfortably within standard 1,500 Byte Ethernet MTU with minimal risk of TCP fragmentation.")
        ],
        "tradeoff_explanation": "Hybrid X25519+ML-KEM-768 represents the industry standard (IETF & Chrome/Cloudflare TLS 1.3) recommended transition mode. It provides dual quantum + classical security with less than 2 ms WAN latency impact."
    },
    ("RSA-2048", "ML-DSA-65"): {
        "category": "SIGNATURE",
        "overall_latency_impact": "LOW_TO_MODERATE",
        "bandwidth_overhead": "+1,952 B Public Key, +3,309 B Signature",
        "cpu_impact": "FASTER VERIFICATION (Matrix operations compute faster than RSA verify)",
        "memory_impact": "LOW (< 8 KB)",
        "metrics": [
            LatencyMetricComparison(metric_name="Public Key Size", classical_value="256 Bytes", pqc_value="1,952 Bytes", impact_level="MODERATE", details="ML-DSA-65 public key size."),
            LatencyMetricComparison(metric_name="Signature Size", classical_value="256 Bytes", pqc_value="3,309 Bytes", impact_level="MODERATE", details="~13x increase in signature size over 2048-bit RSA."),
            LatencyMetricComparison(metric_name="Signing Time", classical_value="~1.2 ms (RSA)", pqc_value="~0.15 ms (ML-DSA)", impact_level="FASTER", details="Signing is ~8x faster than classical RSA-2048."),
            LatencyMetricComparison(metric_name="Verification Time", classical_value="~0.08 ms", pqc_value="~0.05 ms", impact_level="FASTER", details="Signature verification is extremely fast.")
        ],
        "tradeoff_explanation": "ML-DSA-65 (NIST FIPS 204) delivers high-speed digital signing and verification, ideal for high-throughput authentication tokens (JWT) and code signing, with an expected ~3.3 KB signature payload."
    },
    ("ECDSA P-256", "ML-DSA-65"): {
        "category": "SIGNATURE",
        "overall_latency_impact": "LOW_TO_MODERATE",
        "bandwidth_overhead": "+1,888 B Public Key, +3,245 B Signature",
        "cpu_impact": "FASTER VERIFY (ML-DSA matrix vector verification vs elliptic curve scalar point multiplication)",
        "memory_impact": "LOW (< 8 KB)",
        "metrics": [
            LatencyMetricComparison(metric_name="Public Key Size", classical_value="64 Bytes", pqc_value="1,952 Bytes", impact_level="MODERATE", details="Larger lattice public key."),
            LatencyMetricComparison(metric_name="Signature Size", classical_value="64 Bytes", pqc_value="3,309 Bytes", impact_level="HIGH", details="Larger signature payload than compact 64-byte ECDSA."),
            LatencyMetricComparison(metric_name="Signing Performance", classical_value="~0.1 ms", pqc_value="~0.15 ms", impact_level="MINIMAL", details="Comparable high-speed signing performance."),
            LatencyMetricComparison(metric_name="Verification Performance", classical_value="~0.25 ms", pqc_value="~0.05 ms", impact_level="FASTER", details="ML-DSA verification is ~5x faster than ECDSA P-256.")
        ],
        "tradeoff_explanation": "ML-DSA-65 trades larger signature sizes (3.3 KB vs 64 B) for quantum security and substantially faster verification throughput."
    },
    ("RSA-2048", "SLH-DSA-128s"): {
        "category": "SIGNATURE",
        "overall_latency_impact": "MODERATE_TO_HIGH",
        "bandwidth_overhead": "+32 B Public Key, +7,856 B Signature",
        "cpu_impact": "SLOWER SIGNING (Stateless hash tree traversals compute in ~10-20 ms)",
        "memory_impact": "LOW",
        "metrics": [
            LatencyMetricComparison(metric_name="Public Key Size", classical_value="256 Bytes", pqc_value="32 Bytes", impact_level="FASTER", details="SLH-DSA public key is extremely compact (32 Bytes)."),
            LatencyMetricComparison(metric_name="Signature Size", classical_value="256 Bytes", pqc_value="7,856 Bytes", impact_level="HIGH", details="Large hash-based signature payload."),
            LatencyMetricComparison(metric_name="Signing Time", classical_value="~1.2 ms", pqc_value="~12.5 ms", impact_level="SLOWER", details="Iterated SHA-256 / SHAKE tree operations."),
            LatencyMetricComparison(metric_name="Security Assumption", classical_value="Number-Theoretic (Factoring)", pqc_value="Pure Hash-Function Security (Zero Lattice Assumptions)", impact_level="OPTIMAL", details="SLH-DSA relies solely on standard hash security, making it the most conservative PQC standard.")
        ],
        "tradeoff_explanation": "SLH-DSA-128s (NIST FIPS 205) is the ideal ultra-conservative fallback for firmware and root certificate signing where verification speed and compact keys are prioritized over signing frequency."
    }
}

class LatencySimulatorEngine:

    @classmethod
    def compare_algorithms(cls, classical_algo: str, target_pqc: str) -> LatencyComparisonResult:
        # Normalize keys
        key = (classical_algo.strip(), target_pqc.strip())
        if key in LATENCY_BENCHMARK_PROFILES:
            profile = LATENCY_BENCHMARK_PROFILES[key]
            return LatencyComparisonResult(
                classical_algorithm=classical_algo,
                target_pqc_or_hybrid=target_pqc,
                category=profile["category"],
                overall_latency_impact=profile["overall_latency_impact"],
                bandwidth_overhead=profile["bandwidth_overhead"],
                cpu_impact=profile["cpu_impact"],
                memory_impact=profile["memory_impact"],
                metrics=profile["metrics"],
                tradeoff_explanation=profile["tradeoff_explanation"]
            )

        # Dynamic Generic Fallback for unlisted pairs
        is_kem = "KEM" in target_pqc.upper() or "ECDH" in classical_algo.upper() or "DH" in classical_algo.upper()
        if is_kem:
            return LatencyComparisonResult(
                classical_algorithm=classical_algo,
                target_pqc_or_hybrid=target_pqc,
                category="KEY_EXCHANGE",
                overall_latency_impact="LOW",
                bandwidth_overhead="+1,184 B Public Key, +1,088 B Ciphertext",
                cpu_impact="FASTER (NTT polynomial multiplications compute in < 50 microseconds)",
                memory_impact="LOW (< 4 KB)",
                metrics=[
                    LatencyMetricComparison(metric_name="Public Key Size", classical_value="~64 - 256 B", pqc_value="~1,184 B (ML-KEM-768)", impact_level="MODERATE", details="Standard FIPS 203 lattice public key payload."),
                    LatencyMetricComparison(metric_name="Ciphertext Size", classical_value="~32 - 256 B", pqc_value="~1,088 B", impact_level="MODERATE", details="Standard encapsulated shared secret ciphertext."),
                    LatencyMetricComparison(metric_name="Handshake Latency", classical_value="Baseline", pqc_value="+0.8 ms WAN", impact_level="LOW", details="Sub-millisecond latency overhead on typical network interfaces.")
                ],
                tradeoff_explanation=f"Migrating from {classical_algo} to {target_pqc} ensures quantum immunity against Shor's algorithm and retroactive HNDL capture with minimal CPU/bandwidth footprint."
            )
        else:
            return LatencyComparisonResult(
                classical_algorithm=classical_algo,
                target_pqc_or_hybrid=target_pqc,
                category="SIGNATURE",
                overall_latency_impact="LOW_TO_MODERATE",
                bandwidth_overhead="+1.9 KB Public Key, +3.3 KB Signature",
                cpu_impact="FASTER VERIFICATION (Lattice matrix checks bypass modular exponentiation)",
                memory_impact="LOW (< 8 KB)",
                metrics=[
                    LatencyMetricComparison(metric_name="Public Key Size", classical_value="~64 - 256 B", pqc_value="~1,952 B", impact_level="MODERATE", details="Standard FIPS 204 lattice public key."),
                    LatencyMetricComparison(metric_name="Signature Size", classical_value="~64 - 256 B", pqc_value="~3,309 B", impact_level="MODERATE", details="NIST standardized digital signature format."),
                    LatencyMetricComparison(metric_name="Verification Throughput", classical_value="Standard", pqc_value="~3-5x Faster", impact_level="FASTER", details="Extremely efficient verification cycles on servers and embedded devices.")
                ],
                tradeoff_explanation=f"Migrating from {classical_algo} to {target_pqc} provides provable post-quantum signature authenticity with high verification throughput."
            )

latency_engine = LatencySimulatorEngine()
