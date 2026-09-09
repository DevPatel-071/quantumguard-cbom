import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Code, 
  Building2, 
  Layers, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Terminal,
  FolderArchive,
  FolderOpen,
  GitBranch,
  HardDrive,
  ArrowRight,
  FileCode2,
  Cpu,
  Radio
} from 'lucide-react';
import { 
  fetchSamples, 
  scanSampleRepo, 
  scanUploadedFile, 
  scanFolderUpload, 
  scanGitRepo, 
  scanLocalPath, 
  scanRawCode,
  registerMonitoringSource 
} from '../services/api';
import ConsentDialog from '../components/ConsentDialog';
import ScanLoadingModal from '../components/ScanLoadingModal';

export default function ScanStudio({ onScanComplete }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('banking-payment-gateway');
  const [scanMode, setScanMode] = useState('folder'); // 'folder' | 'zip' | 'git' | 'local' | 'sample' | 'raw'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConsent, setShowConsent] = useState(false);
  const [showScanLoading, setShowScanLoading] = useState(false);
  
  // Customization Context
  const [contextConfig, setContextConfig] = useState({
    application: '',
    environment: 'PRODUCTION',
    business_criticality: 'CRITICAL',
    exposure: 'INTERNET_FACING',
    data_sensitivity: 'CONFIDENTIAL',
    data_lifetime_years: 10.0,
    migration_time_years: 3.0,
    quantum_timeline_years: 15.0
  });

  // Mode States
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [gitUrl, setGitUrl] = useState('');
  const [gitBranch, setGitBranch] = useState('main');
  const [localPath, setLocalPath] = useState('');
  const [rawCodeSnippet, setRawCodeSnippet] = useState(`// Financial Authorization & Signature Module
#include <openssl/rsa.h>
#include <openssl/evp.h>
#include <openssl/sha.h>

void SignFinancialTransaction(RSA* rsa_key, const unsigned char* payload, size_t len, unsigned char* signature) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256(payload, len, hash);
    unsigned int sig_len;
    // RSA signature vulnerable to Shor's quantum algorithm
    RSA_sign(NID_sha256, hash, SHA256_DIGEST_LENGTH, signature, &sig_len, rsa_key);
}
`);

  // Telemetry log stream
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  useEffect(() => {
    fetchSamples()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
          const first = data[0];
          setSelectedSample(first.id);
        }
      })
      .catch(() => setError('Failed to load preloaded sample suites.'));
  }, []);

  const handleSampleChange = (sampleId) => {
    setSelectedSample(sampleId);
    const sample = samples.find(s => s.id === sampleId);
    if (sample) {
      setContextConfig(prev => ({
        ...prev,
        application: sample.default_application,
        business_criticality: sample.default_criticality,
        exposure: sample.default_exposure,
        data_lifetime_years: sample.default_data_lifetime,
        migration_time_years: sample.default_migration_time,
        quantum_timeline_years: sample.default_quantum_horizon
      }));
    }
  };

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFolderFiles(files);
      const rootFolder = files[0].webkitRelativePath?.split('/')[0] || 'Selected Folder';
      setFolderName(rootFolder);
      setContextConfig(prev => ({ ...prev, application: rootFolder }));
    }
  };

  const getTargetDisplayName = () => {
    if (scanMode === 'folder') return folderName || 'Selected Folder';
    if (scanMode === 'zip') return zipFile?.name || 'Uploaded Archive';
    if (scanMode === 'git') return gitUrl || 'Git Repository';
    if (scanMode === 'local') return localPath || 'Local Directory';
    if (scanMode === 'sample') {
      const sample = samples.find(s => s.id === selectedSample);
      return sample ? sample.name : 'Sample Suite';
    }
    return 'Raw Code Snippet';
  };

  const handleInitiateScan = () => {
    setError(null);
    if (scanMode === 'folder' && folderFiles.length === 0) {
      setError('Please select a folder to upload and scan.');
      return;
    }
    if (scanMode === 'zip' && !zipFile) {
      setError('Please select a ZIP or TAR archive to upload.');
      return;
    }
    if (scanMode === 'git' && !gitUrl.trim()) {
      setError('Please enter a valid Git repository URL.');
      return;
    }
    if (scanMode === 'local' && !localPath.trim()) {
      setError('Please specify an absolute local directory path.');
      return;
    }
    executeScan(false);
  };

  const executeScan = async (isContinuous) => {
    setShowConsent(false);
    setShowScanLoading(true);
    setLoading(true);
    setError(null);
    setTelemetryLogs([
      "Initializing QUANTECT static analysis pipeline...",
      "Configuring cryptographic knowledge base (30+ algorithms & NIST PQC standards)..."
    ]);

    try {
      let result;
      
      // 1. Folder Upload
      if (scanMode === 'folder') {
        const formData = new FormData();
        const paths = [];
        folderFiles.forEach((file) => {
          formData.append('files', file);
          paths.push(file.webkitRelativePath || file.name);
        });
        formData.append('paths', JSON.stringify(paths));
        formData.append('folder_name', folderName);
        formData.append('application', contextConfig.application);
        formData.append('environment', contextConfig.environment);
        formData.append('business_criticality', contextConfig.business_criticality);
        formData.append('exposure', contextConfig.exposure);
        formData.append('data_sensitivity', contextConfig.data_sensitivity);
        formData.append('data_lifetime_years', contextConfig.data_lifetime_years);
        formData.append('migration_time_years', contextConfig.migration_time_years);
        formData.append('quantum_timeline_years', contextConfig.quantum_timeline_years);

        result = await scanFolderUpload(formData);
      }

      // 2. ZIP / Archive Upload
      else if (scanMode === 'zip') {
        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('application', contextConfig.application);
        formData.append('environment', contextConfig.environment);
        formData.append('business_criticality', contextConfig.business_criticality);
        formData.append('exposure', contextConfig.exposure);
        formData.append('data_sensitivity', contextConfig.data_sensitivity);
        formData.append('data_lifetime_years', contextConfig.data_lifetime_years);
        formData.append('migration_time_years', contextConfig.migration_time_years);
        formData.append('quantum_timeline_years', contextConfig.quantum_timeline_years);

        result = await scanUploadedFile(formData);
      }

      // 3. Git Repository URL
      else if (scanMode === 'git') {
        result = await scanGitRepo({
          git_url: gitUrl.trim(),
          branch: gitBranch ? gitBranch.trim() : null,
          application: contextConfig.application || 'Git Repository',
          environment: contextConfig.environment,
          business_criticality: contextConfig.business_criticality,
          exposure: contextConfig.exposure,
          data_sensitivity: contextConfig.data_sensitivity,
          data_lifetime_years: contextConfig.data_lifetime_years,
          migration_time_years: contextConfig.migration_time_years,
          quantum_timeline_years: contextConfig.quantum_timeline_years
        });
      }

      // 4. Local System Path
      else if (scanMode === 'local') {
        result = await scanLocalPath({
          path: localPath.trim(),
          application: contextConfig.application || 'Local Repository',
          environment: contextConfig.environment,
          business_criticality: contextConfig.business_criticality,
          exposure: contextConfig.exposure,
          data_sensitivity: contextConfig.data_sensitivity,
          data_lifetime_years: contextConfig.data_lifetime_years,
          migration_time_years: contextConfig.migration_time_years,
          quantum_timeline_years: contextConfig.quantum_timeline_years
        });
      }

      // 5. Pre-loaded Sample Suite
      else if (scanMode === 'sample') {
        result = await scanSampleRepo(selectedSample, contextConfig);
      }

      // 6. Raw Code Snippet
      else if (scanMode === 'raw') {
        result = await scanRawCode({
          file_name: 'snippet.cpp',
          code: rawCodeSnippet,
          application: contextConfig.application,
          business_criticality: contextConfig.business_criticality,
          exposure: contextConfig.exposure,
          data_sensitivity: contextConfig.data_sensitivity,
          data_lifetime_years: contextConfig.data_lifetime_years,
          migration_time_years: contextConfig.migration_time_years,
          quantum_timeline_years: contextConfig.quantum_timeline_years
        });
      }

      // Register continuous monitoring if chosen
      if (isContinuous) {
        try {
          await registerMonitoringSource({
            name: getTargetDisplayName(),
            source_type: scanMode.toUpperCase(),
            target_path: scanMode === 'git' ? gitUrl : scanMode === 'local' ? localPath : getTargetDisplayName(),
            total_assets: result.scan_summary?.crypto_assets_count || 0,
            critical_count: result.scan_summary?.critical_risk_count || 0
          });
        } catch (mErr) {
          console.warn('Monitoring registration notice:', mErr);
        }
      }

      setTimeout(() => {
        setShowScanLoading(false);
        setLoading(false);
        onScanComplete(result);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Scan execution failed.');
      setShowScanLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto command-grid">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              CRYPTOGRAPHIC INGESTION SUITE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              MULTI-LANGUAGE AST ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Scan className="w-6 h-6 text-cyan-400" />
            <span>Cryptographic Discovery &amp; Ingestion Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload whole folders, ZIP/TAR archives, clone remote Git repositories, or scan local directories to generate an explainable Cryptography Bill of Materials (CBOM).
          </p>
        </div>
      </div>

      {/* Ingestion Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
        
        <button
          onClick={() => setScanMode('folder')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'folder'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          <span>Folder Upload</span>
        </button>

        <button
          onClick={() => setScanMode('zip')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'zip'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <FolderArchive className="w-4 h-4 text-indigo-400" />
          <span>ZIP / Archive</span>
        </button>

        <button
          onClick={() => setScanMode('git')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'git'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span>Git Repository</span>
        </button>

        <button
          onClick={() => setScanMode('local')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'local'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span>Local Path</span>
        </button>

        <button
          onClick={() => setScanMode('sample')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'sample'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Demo Suites</span>
        </button>

        <button
          onClick={() => setScanMode('raw')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'raw'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
          }`}
        >
          <Code className="w-4 h-4 text-pink-400" />
          <span>Code Snippet</span>
        </button>

      </div>

      {/* 1. FOLDER UPLOAD VIEW */}
      {scanMode === 'folder' && (
        <div className="p-8 rounded-xl command-card border-2 border-dashed border-[#1E2D4A] hover:border-cyan-500/50 text-center space-y-4 transition font-mono">
          <div className="w-14 h-14 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-cyan-glow">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Upload Entire Project Folder
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
              Select an entire directory from your local machine. Subdirectories, source code files, certificates, and manifests will be ingested with preserved paths.
            </p>
          </div>

          <input
            type="file"
            id="folder-input"
            webkitdirectory="true"
            directory="true"
            multiple
            className="hidden"
            onChange={handleFolderSelect}
          />
          <label
            htmlFor="folder-input"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-glow cursor-pointer transition"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select Folder to Ingest</span>
          </label>

          {folderFiles.length > 0 && (
            <div className="p-3.5 rounded-lg bg-[#050A14] border border-cyan-500/40 text-xs text-left font-mono space-y-1 text-slate-300 max-w-lg mx-auto">
              <div className="flex justify-between text-cyan-400 font-bold">
                <span>📁 Folder: {folderName}</span>
                <span>{folderFiles.length} files detected</span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Root: {folderFiles[0]?.webkitRelativePath || folderFiles[0]?.name}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ZIP / ARCHIVE UPLOAD VIEW */}
      {scanMode === 'zip' && (
        <div className="p-8 rounded-xl command-card border-2 border-dashed border-[#1E2D4A] hover:border-indigo-500/50 text-center space-y-4 transition font-mono">
          <div className="w-14 h-14 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 shadow-md">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Upload ZIP or Compressed Archive
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
              Supports <span className="font-mono text-cyan-400">.zip</span>, <span className="font-mono text-cyan-400">.tar.gz</span>, <span className="font-mono text-cyan-400">.tgz</span>, and <span className="font-mono text-cyan-400">.tar</span> repositories.
            </p>
          </div>

          <input
            type="file"
            id="zip-input"
            accept=".zip,.tar,.tar.gz,.tgz,.tar.bz2"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) {
                setZipFile(e.target.files[0]);
                setContextConfig(prev => ({ ...prev, application: e.target.files[0].name.split('.')[0] }));
              }
            }}
          />
          <label
            htmlFor="zip-input"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer transition"
          >
            <Upload className="w-4 h-4" />
            <span>Select Archive File</span>
          </label>

          {zipFile && (
            <div className="p-3 rounded-lg bg-[#050A14] border border-emerald-500/40 text-xs font-mono text-emerald-300 max-w-sm mx-auto">
              ✓ Selected Archive: <strong>{zipFile.name}</strong> ({(zipFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      )}

      {/* 3. GIT REPOSITORY CLONE VIEW */}
      {scanMode === 'git' && (
        <div className="p-6 rounded-xl command-card space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-white uppercase">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>Remote Git Repository Scanner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400">Git Clone URL (HTTPS / SSH)</label>
              <input
                type="text"
                value={gitUrl}
                onChange={(e) => {
                  setGitUrl(e.target.value);
                  const name = e.target.value.split('/').pop()?.replace('.git', '') || 'Git Repo';
                  setContextConfig(prev => ({ ...prev, application: name }));
                }}
                placeholder="https://github.com/owner/repository.git"
                className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Branch / Tag (Optional)</label>
              <input
                type="text"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
                placeholder="main / master"
                className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Popular Open Source Targets:</span>
            <button
              onClick={() => { setGitUrl('https://github.com/open-quantum-safe/liboqs.git'); setGitBranch('main'); setContextConfig(prev => ({ ...prev, application: 'liboqs Post-Quantum C' })); }}
              className="px-2.5 py-1 rounded bg-[#050A14] hover:bg-[#0D1730] text-purple-300 border border-[#1E2D4A] transition"
            >
              liboqs (PQC Library)
            </button>
            <button
              onClick={() => { setGitUrl('https://github.com/pyca/cryptography.git'); setGitBranch('main'); setContextConfig(prev => ({ ...prev, application: 'pyca/cryptography' })); }}
              className="px-2.5 py-1 rounded bg-[#050A14] hover:bg-[#0D1730] text-cyan-300 border border-[#1E2D4A] transition"
            >
              pyca/cryptography
            </button>
          </div>
        </div>
      )}

      {/* 4. LOCAL DIRECTORY PATH VIEW */}
      {scanMode === 'local' && (
        <div className="p-6 rounded-xl command-card space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-white uppercase">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local Filesystem Directory Path</span>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Absolute Directory Path on Host</label>
            <input
              type="text"
              value={localPath}
              onChange={(e) => {
                setLocalPath(e.target.value);
                const baseName = e.target.value.split(/[\/\\]/).pop() || 'Local Project';
                setContextConfig(prev => ({ ...prev, application: baseName }));
              }}
              placeholder="e.g. C:\Users\name\projects\my-app or /var/www/my-app"
              className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 5. PRE-LOADED DEMO REPOSITORIES */}
      {scanMode === 'sample' && (
        <div className="space-y-3 font-mono">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            Select Pre-Loaded Test Suite:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {samples.map((sample) => {
              const isSelected = selectedSample === sample.id;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSampleChange(sample.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 space-y-2 bg-[#050A14] ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-glow'
                      : 'border-[#1E2D4A] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{sample.name}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{sample.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. RAW CODE SNIPPET */}
      {scanMode === 'raw' && (
        <div className="space-y-2 font-mono">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            Paste Source Code Snippet:
          </label>
          <textarea
            rows={7}
            value={rawCodeSnippet}
            onChange={(e) => setRawCodeSnippet(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#040711] border border-[#1E2D4A] text-emerald-400 font-mono text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
          />
        </div>
      )}

      {/* Operational Context & Threat Model Customization */}
      <div className="p-6 rounded-xl command-card space-y-5 font-mono text-xs">
        <div className="flex items-center gap-2 text-white font-bold uppercase">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Operational Context &amp; Threat Model Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400">Application Name</label>
            <input
              type="text"
              value={contextConfig.application}
              onChange={(e) => setContextConfig({ ...contextConfig, application: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Business Criticality</label>
            <select
              value={contextConfig.business_criticality}
              onChange={(e) => setContextConfig({ ...contextConfig, business_criticality: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL (Core Banking / Identity)</option>
              <option value="HIGH">HIGH (Customer Production API)</option>
              <option value="MEDIUM">MEDIUM (Internal Services)</option>
              <option value="LOW">LOW (Public Information)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Network Exposure</label>
            <select
              value={contextConfig.exposure}
              onChange={(e) => setContextConfig({ ...contextConfig, exposure: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="INTERNET_FACING">INTERNET_FACING (HNDL Risk)</option>
              <option value="INTERNAL_NETWORK">INTERNAL_NETWORK</option>
              <option value="ISOLATED">ISOLATED (Air-gapped)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Data Sensitivity</label>
            <select
              value={contextConfig.data_sensitivity}
              onChange={(e) => setContextConfig({ ...contextConfig, data_sensitivity: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="HIGHLY_REGULATED">HIGHLY_REGULATED</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="PUBLIC">PUBLIC</option>
            </select>
          </div>
        </div>

        {/* Mosca Sliders Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1E2D4A]">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Data Lifetime (X)</span>
              <span className="font-bold text-cyan-400">{contextConfig.data_lifetime_years} yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={contextConfig.data_lifetime_years}
              onChange={(e) => setContextConfig({ ...contextConfig, data_lifetime_years: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Migration Time (Y)</span>
              <span className="font-bold text-indigo-400">{contextConfig.migration_time_years} yrs</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={contextConfig.migration_time_years}
              onChange={(e) => setContextConfig({ ...contextConfig, migration_time_years: parseFloat(e.target.value) })}
              className="w-full accent-indigo-400 bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Threat Horizon (Z)</span>
              <span className="font-bold text-rose-400">{contextConfig.quantum_timeline_years} yrs</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={contextConfig.quantum_timeline_years}
              onChange={(e) => setContextConfig({ ...contextConfig, quantum_timeline_years: parseFloat(e.target.value) })}
              className="w-full accent-rose-400 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleInitiateScan}
          disabled={loading}
          className="px-8 py-3.5 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-glow transition disabled:opacity-50 flex items-center gap-2.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Analyzing Target Cryptographic Footprint...</span>
            </>
          ) : (
            <>
              <span>Execute Discovery Scan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* User Consent Dialog */}
      <ConsentDialog
        isOpen={showConsent}
        targetName={getTargetDisplayName()}
        onConfirm={(isContinuous) => executeScan(isContinuous)}
        onCancel={() => setShowConsent(false)}
      />

      {/* Scan Loading Modal */}
      <ScanLoadingModal
        isOpen={showScanLoading}
        targetName={getTargetDisplayName()}
      />

    </div>
  );
}
