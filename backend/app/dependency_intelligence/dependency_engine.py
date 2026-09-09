import os
from typing import List, Dict, Any, Set
from app.cbom.cbom_model import (
    CBOMAsset,
    DependencyNode,
    DependencyEdge,
    DependencyGraph,
    RiskLevel
)

class DependencyIntelligenceEngine:
    """
    Constructs multi-tier dependency call graphs and intelligence models
    tracing: Application -> Source File -> Package/Library -> Capability -> Algorithm -> Quantum Risk.
    """

    def build_graph(self, assets: List[CBOMAsset], application_name: str = "Enterprise Application") -> DependencyGraph:
        nodes_dict: Dict[str, DependencyNode] = {}
        edges: List[DependencyEdge] = []
        packages_set: Set[str] = set()
        direct_deps: Set[str] = set()
        transitive_deps: Set[str] = set()
        vulnerable_pkgs: Set[str] = set()

        # 1. Root Application Node
        app_id = f"app-{application_name.lower().replace(' ', '-')}"
        nodes_dict[app_id] = DependencyNode(
            id=app_id,
            label=application_name,
            node_type="APPLICATION",
            risk_level=RiskLevel.HIGH if any(a.risk_level == RiskLevel.CRITICAL for a in assets) else RiskLevel.MEDIUM,
            quantum_vulnerable=any(a.quantum_vulnerability in ["CRITICAL", "HIGH"] for a in assets),
            details=f"Root target system analyzing {len(assets)} discovered cryptographic invocations.",
            depth=0
        )

        for asset in assets:
            # 2. Source File Node
            file_basename = os.path.basename(asset.file) or asset.file
            file_id = f"file-{file_basename.lower().replace('.', '-')}"
            if file_id not in nodes_dict:
                nodes_dict[file_id] = DependencyNode(
                    id=file_id,
                    label=file_basename,
                    node_type="FILE",
                    risk_level=asset.risk_level,
                    quantum_vulnerable=asset.quantum_vulnerability in ["CRITICAL", "HIGH"],
                    details=f"Source Path: {asset.file} | Usage: {asset.usage}",
                    depth=1
                )
                edges.append(DependencyEdge(
                    source=app_id,
                    target=file_id,
                    relationship="CONTAINS"
                ))

            # 3. Library / Package Node
            lib_name = asset.library or "Native/Standard Library"
            lib_id = f"pkg-{lib_name.lower().replace(' ', '-').replace('/', '-')}"
            packages_set.add(lib_name)
            
            # Identify transitive vs direct
            if any(term in lib_name.lower() for term in ["bouncy", "pycryptodome", "openssl", "cryptography", "boringssl", "circl"]):
                direct_deps.add(lib_name)
            else:
                transitive_deps.add(lib_name)

            if asset.quantum_vulnerability in ["CRITICAL", "HIGH"]:
                vulnerable_pkgs.add(lib_name)

            if lib_id not in nodes_dict:
                nodes_dict[lib_id] = DependencyNode(
                    id=lib_id,
                    label=f"{lib_name} {asset.library_version or ''}".strip(),
                    node_type="LIBRARY",
                    risk_level=asset.risk_level,
                    quantum_vulnerable=asset.quantum_vulnerability in ["CRITICAL", "HIGH"],
                    details=f"Cryptographic package imported by {file_basename}",
                    depth=2
                )
            
            # Edge from File -> Library
            edge_f_l = DependencyEdge(source=file_id, target=lib_id, relationship="IMPORTS")
            if not any(e.source == edge_f_l.source and e.target == edge_f_l.target for e in edges):
                edges.append(edge_f_l)

            # 4. Capability Node (e.g. Asymmetric Key Exchange, Digital Signature)
            cap_label = asset.category or "Cryptographic Operation"
            cap_id = f"cap-{cap_label.lower().replace(' ', '-')}"
            if cap_id not in nodes_dict:
                nodes_dict[cap_id] = DependencyNode(
                    id=cap_id,
                    label=cap_label,
                    node_type="CAPABILITY",
                    risk_level=asset.risk_level,
                    quantum_vulnerable=asset.quantum_vulnerability in ["CRITICAL", "HIGH"],
                    details=f"Functional capability utilized for {asset.usage}",
                    depth=3
                )
            
            # Edge from Library -> Capability
            edge_l_c = DependencyEdge(source=lib_id, target=cap_id, relationship="PROVIDES")
            if not any(e.source == edge_l_c.source and e.target == edge_l_c.target for e in edges):
                edges.append(edge_l_c)

            # 5. Algorithm Node (Leaf)
            algo_label = f"{asset.algorithm} {f'({asset.key_size}-bit)' if asset.key_size else ''}".strip()
            algo_id = f"algo-{asset.asset_id}"
            nodes_dict[algo_id] = DependencyNode(
                id=algo_id,
                label=algo_label,
                node_type="ALGORITHM",
                risk_level=asset.risk_level,
                quantum_vulnerable=asset.quantum_vulnerability in ["CRITICAL", "HIGH"],
                details=f"Target: {asset.recommended_pqc or 'NIST PQC'} | Risk: {asset.risk_score}/100",
                depth=4
            )

            # Edge from Capability -> Algorithm
            edges.append(DependencyEdge(
                source=cap_id,
                target=algo_id,
                relationship="EXECUTES"
            ))

            # Enrich asset with dependency trace
            asset.dependencies = [lib_name, file_basename]
            asset.upstream_package = lib_name
            asset.downstream_usage = [asset.usage, application_name]

        return DependencyGraph(
            nodes=list(nodes_dict.values()),
            edges=edges,
            total_packages=len(packages_set),
            direct_dependencies_count=max(len(direct_deps), 1),
            transitive_dependencies_count=len(transitive_deps),
            vulnerable_packages_count=len(vulnerable_pkgs)
        )

dependency_engine = DependencyIntelligenceEngine()
