# 🛡️ QuantumGuard: Quantum-Ready Cryptographic Inventory & Risk Assessment Platform (Q-CBOM)

[![CI / Post-Quantum CBOM Test Suite](https://github.com/your-username/quantumguard-cbom/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/quantumguard-cbom/actions)
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

5. **CycloneDX 1.6 Compliant CBOM & Reporting**:
   - Export standard CycloneDX 1.6 JSON, Flat CSV, and standalone executive HTML audit reports.

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & npm
- **Git**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/quantumguard-cbom.git
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
docker build -t quantumguard-cbom .
docker run -p 8000:8000 -e PORT=8000 quantumguard-cbom
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

Or use Docker Compose:
```bash
docker-compose up --build
```

---

## 🌐 Deploy to Cloud via GitHub

### Option A: Deploy to Render (Recommended & Free)
1. Fork or push this repository to your GitHub account.
2. Sign in to [Render](https://render.com/).
3. Click **New +** $\rightarrow$ **Web Service**.
4. Select your GitHub repository.
5. In the settings:
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Plan**: `Free`
6. Click **Create Web Service**. Render will build the Docker container and provide a live public URL (e.g. `https://quantumguard-cbom.onrender.com`).

---

### Option B: Deploy to Railway
1. Sign in to [Railway](https://railway.app/).
2. Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select this repository. Railway will detect the `Dockerfile` automatically.
4. Click **Deploy**. Generate a public domain under service settings.

---

### Option C: Deploy to Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in the project root.
3. Run `fly deploy`.

---

### Option D: Deploy to Self-Hosted VPS / AWS EC2 / DigitalOcean
1. SSH into your server:
   ```bash
   ssh user@your-server-ip
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/your-username/quantumguard-cbom.git
   cd quantumguard-cbom
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

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
