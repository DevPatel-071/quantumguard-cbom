# 🛡️ QUANTECT: Quantum-Ready Cryptographic Inventory & Risk Assessment Platform (Q-CBOM)

> **"Prepare Today, Secure Tomorrow."**

[![CI / Post-Quantum CBOM Test Suite](https://github.com/DevPatel-071/quantumguard-cbom/actions/workflows/ci.yml/badge.svg)](https://github.com/DevPatel-071/quantumguard-cbom/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![NIST PQC Standards](https://img.shields.io/badge/NIST%20PQC-FIPS%20203%20%7C%20204%20%7C%20205-emerald.svg)](https://csrc.nist.gov/projects/post-quantum-cryptography)
[![CycloneDX 1.6 CBOM](https://img.shields.io/badge/CycloneDX-1.6%20CBOM-purple.svg)](https://cyclonedx.org/)

> **Executive Principle:** *“Quantum readiness starts with knowing where your cryptography is.”*
> **Core Pipeline:** **DISCOVER → INVENTORY (CBOM) → ASSESS QUANTUM RISK → APPLY MOSCA ($X+Y>Z$) → PRIORITIZE → RECOMMEND PQC / HYBRID**

---

## 🌟 Key Features

1. **Multi-Channel Cryptographic Ingestion**:
   - 📁 **Folder Upload**: Native browser directory selector (`webkitdirectory`) with preserved directory hierarchies.
   - 📦 **ZIP & Compressed Archives**: Ingests `.zip`, `.tar.gz`, `.tgz`, `.tar` with isolated sandbox decompression and path-traversal prevention.
   - 🌐 **Remote Git Repository Scanner**: Direct clone & scan from public/authenticated GitHub, GitLab, or Bitbucket URLs with branch selection.
   - 💻 **Local Directory Path**: Instant local filesystem scanning.
   - ⚡ **Pre-Loaded Test Suites**: 5 realistic enterprise test suites (Banking Core, IAM Auth, Legacy Portal, Cloud Native, Clean App).
   - 📝 **Interactive Code Editor**: On-the-fly AST analysis of raw C/C++, Python, Java, JS, Go, Rust code.

2. **Cryptographic Knowledge Base (30+ Algorithms)**:
   - Covers classical public-key (RSA, ECC, ECDSA, ECDH, DH, Ed25519), symmetric ciphers (AES-128/256, 3DES, ChaCha20), hashes (SHA-1/2/3, MD5), and finalized NIST PQC standards:
     - **ML-KEM** (NIST FIPS 203 / CRYSTALS-Kyber)
     - **ML-DSA** (NIST FIPS 204 / CRYSTALS-Dilithium)
     - **SLH-DSA** (NIST FIPS 205 / SPHINCS+)
     - **Falcon** (NIST Round 4 / FN-DSA)
     - **Hybrid Schemes** (X25519 + ML-KEM-768, Composite Dual Signatures)

3. **Deterministic & Explainable Quantum Risk Engine**:
   - Scores assets from 0 to 100 with itemized *Why this Risk Score?* factor breakdowns.

4. **Mosca's Theorem ($X + Y > Z$) & HNDL Simulation Lab**:
   - Calculates the exact Harvest-Now-Decrypt-Later (HNDL) exposure window and urgency tier.

5. **Failure Mode & Effects Analysis (FMEA)**:
   - Evaluates potential failure risks ($S \times O \times D = \text{RPN}$) during PQC/Hybrid migration.

6. **CycloneDX 1.6 Compliant CBOM & Reporting**:
   - Export standard CycloneDX 1.6 JSON, Flat CSV, and standalone executive HTML/PDF audit reports.

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & npm
- **Git**

### 1. Clone the repository
```bash
git clone https://github.com/DevPatel-071/quantumguard-cbom.git
cd quantumguard-cbom
```

### 2. Start the Backend API (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Start the Frontend Dashboard (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
Web Dashboard will be live at: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Deployment

Run the entire platform as a single optimized container:

```bash
# Build and run container
docker build -t quantect-cbom .
docker run -p 8000:8000 -e PORT=8000 quantect-cbom
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

Or use Docker Compose:
```bash
docker-compose up --build
```

---

## 🌐 Deploy to Cloud via GitHub

### Deploy to Render
1. Fork or push this repository to your GitHub account (`https://github.com/DevPatel-071/quantumguard-cbom`).
2. Sign in to [Render](https://render.com/).
3. Click **New +** $\rightarrow$ **Web Service**.
4. Select your GitHub repository.
5. In the settings:
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Plan**: `Free`
6. Click **Create Web Service**. Render will build the Docker container and provide a live public URL (e.g. `https://quantumguard-cbom.onrender.com`).

---

## 🧪 Running Automated Tests

Run the full end-to-end test suite:
```bash
cd backend
python test_e2e.py
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
