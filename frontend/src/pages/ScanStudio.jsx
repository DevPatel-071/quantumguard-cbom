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
  FileCode2
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
    application: 'Core Payment & Settlement API',
    environment: 'PRODUCTION',
    business_criticality: 'CRITICAL',
    exposure: 'INTERNET_FACING',
    data_sensitivity: 'CONFIDENTIAL',
    data_lifetime_years: 15.0,
    migration_time_years: 5.0,
    quantum_timeline_years: 17.0
  });

  // Mode States
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [gitUrl, setGitUrl] = useState('https://github.com/open-quantum-safe/liboqs.git');
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
    setShowConsent(true);
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
        setTelemetryLogs(prev => [
          ...prev, 
          `Packaging folder '${folderName}' (${folderFiles.length} files)...`,
          "Streaming files to backend scanner..."
        ]);

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
        setTelemetryLogs(prev => [
          ...prev,
          `Uploading archive '${zipFile.name}' (${(zipFile.size / 1024).toFixed(1)} KB)...`,
          "Extracting archive in isolated sandbox..."
        ]);

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
        setTelemetryLogs(prev => [
          ...prev,
          `Cloning remote repository: ${gitUrl} (branch: ${gitBranch || 'default'})...`,
          "Executing shallow clone in isolated secure sandbox...",
          "Analyzing cloned source trees and dependency manifests..."
        ]);

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
        setTelemetryLogs(prev => [
          ...prev,
          `Accessing local directory path: ${localPath}...`,
          "Indexing filesystem and parsing source AST..."
        ]);

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
        setTelemetryLogs(prev => [
          ...prev,
          `Mounting test repository '${selectedSample}'...`,
          "Parsing multi-language AST, dependencies, X.509 certs, and container configs..."
        ]);
        result = await scanSampleRepo(selectedSample, contextConfig);
      }

      // 6. Raw Code Snippet
      else if (scanMode === 'raw') {
        setTelemetryLogs(prev => [
          ...prev,
          "Performing on-the-fly source AST analysis on raw snippet..."
        ]);
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

      setTelemetryLogs(prev => [
        ...prev,
        `Discovered ${result.scan_summary.crypto_assets_count} cryptographic assets across ${result.scan_summary.files_scanned} files.`,
        "Evaluating Mosca's Theorem (X + Y > Z) and quantum threat matrices...",
        "Generating CycloneDX 1.6 compliant CBOM...",
        "Synthesizing Quantum FMEA, Dependency Intelligence & Migration Roadmap...",
        "Scan completed successfully!"
      ]);

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
    <div className="p-6 sm:p-8 space-y-7 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Scan className="w-6 h-6 text-blue-600" />
          <span>Cryptographic Discovery & Ingestion Studio</span>
        </h1>
        <p className="text-xs text-slate-500">
          Upload whole folders, ZIP/TAR archives, clone remote Git repositories, or scan local directories to generate an explainable Cryptography Bill of Materials (CBOM).
        </p>
      </div>

      {/* Ingestion Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
        
        <button
          onClick={() => setScanMode('folder')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'folder'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-blue-600" />
          <span>Folder Upload</span>
        </button>

        <button
          onClick={() => setScanMode('zip')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'zip'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FolderArchive className="w-4 h-4 text-indigo-600" />
          <span>ZIP / Archive</span>
        </button>

        <button
          onClick={() => setScanMode('git')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'git'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <GitBranch className="w-4 h-4 text-purple-600" />
          <span>Git Repository</span>
        </button>

        <button
          onClick={() => setScanMode('local')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'local'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <HardDrive className="w-4 h-4 text-emerald-600" />
          <span>Local Path</span>
        </button>

        <button
          onClick={() => setScanMode('sample')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'sample'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>Demo Suites</span>
        </button>

        <button
          onClick={() => setScanMode('raw')}
          className={`py-2.5 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
            scanMode === 'raw'
              ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Code className="w-4 h-4 text-pink-600" />
          <span>Code Snippet</span>
        </button>

      </div>

      {/* 1. FOLDER UPLOAD VIEW */}
      {scanMode === 'folder' && (
        <div className="p-8 rounded-xl bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 text-center space-y-4 shadow-xs transition">
          <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Upload Entire Project Folder
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer transition"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select Folder to Ingest</span>
          </label>

          {folderFiles.length > 0 && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-left font-mono space-y-1 text-slate-700 max-w-lg mx-auto">
              <div className="flex justify-between text-blue-700 font-bold">
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
        <div className="p-8 rounded-xl bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 text-center space-y-4 shadow-xs transition">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Upload ZIP or Compressed Archive
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Supports <span className="font-mono text-indigo-600">.zip</span>, <span className="font-mono text-indigo-600">.tar.gz</span>, <span className="font-mono text-indigo-600">.tgz</span>, and <span className="font-mono text-indigo-600">.tar</span> repositories.
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer transition"
          >
            <Upload className="w-4 h-4" />
            <span>Select Archive File</span>
          </label>

          {zipFile && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 max-w-sm mx-auto">
              ✓ Selected Archive: <strong>{zipFile.name}</strong> ({(zipFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      )}

      {/* 3. GIT REPOSITORY CLONE VIEW */}
      {scanMode === 'git' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <GitBranch className="w-4 h-4 text-purple-600" />
            <span>Remote Git Repository Scanner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-600 font-medium">Git Clone URL (HTTPS / SSH)</label>
              <input
                type="text"
                value={gitUrl}
                onChange={(e) => {
                  setGitUrl(e.target.value);
                  const name = e.target.value.split('/').pop()?.replace('.git', '') || 'Git Repo';
                  setContextConfig(prev => ({ ...prev, application: name }));
                }}
                placeholder="https://github.com/owner/repository.git"
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500 focus:outline-none font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Branch / Tag (Optional)</label>
              <input
                type="text"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
                placeholder="main / master"
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span>Popular Open Source Suggestions:</span>
            <button
              onClick={() => { setGitUrl('https://github.com/open-quantum-safe/liboqs.git'); setGitBranch('main'); setContextConfig(prev => ({ ...prev, application: 'liboqs Post-Quantum C' })); }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-purple-700 border border-slate-200 transition"
            >
              liboqs (PQC Library)
            </button>
            <button
              onClick={() => { setGitUrl('https://github.com/pyca/cryptography.git'); setGitBranch('main'); setContextConfig(prev => ({ ...prev, application: 'pyca/cryptography' })); }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 transition"
            >
              pyca/cryptography
            </button>
          </div>
        </div>
      )}

      {/* 4. LOCAL DIRECTORY PATH VIEW */}
      {scanMode === 'local' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Local Filesystem Directory Path</span>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium">Absolute Directory Path on Host</label>
            <input
              type="text"
              value={localPath}
              onChange={(e) => {
                setLocalPath(e.target.value);
                const baseName = e.target.value.split(/[\/\\]/).pop() || 'Local Project';
                setContextConfig(prev => ({ ...prev, application: baseName }));
              }}
              placeholder="e.g. C:\Users\name\projects\my-app or /var/www/my-app"
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 5. PRE-LOADED DEMO REPOSITORIES */}
      {scanMode === 'sample' && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Pre-Loaded Test Suite:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {samples.map((sample) => {
              const isSelected = selectedSample === sample.id;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSampleChange(sample.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{sample.name}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{sample.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. RAW CODE SNIPPET */}
      {scanMode === 'raw' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Paste Source Code Snippet:
          </label>
          <textarea
            rows={7}
            value={rawCodeSnippet}
            onChange={(e) => setRawCodeSnippet(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
          />
        </div>
      )}

      {/* Operational Context & Threat Model Customization */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Operational Context & Threat Model Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Application Name</label>
            <input
              type="text"
              value={contextConfig.application}
              onChange={(e) => setContextConfig({ ...contextConfig, application: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Business Criticality</label>
            <select
              value={contextConfig.business_criticality}
              onChange={(e) => setContextConfig({ ...contextConfig, business_criticality: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL (Core Banking / Identity)</option>
              <option value="HIGH">HIGH (Customer Production API)</option>
              <option value="MEDIUM">MEDIUM (Internal Services)</option>
              <option value="LOW">LOW (Public Information)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Network Exposure</label>
            <select
              value={contextConfig.exposure}
              onChange={(e) => setContextConfig({ ...contextConfig, exposure: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="INTERNET_FACING">INTERNET_FACING (HNDL Risk)</option>
              <option value="INTERNAL_NETWORK">INTERNAL_NETWORK</option>
              <option value="ISOLATED">ISOLATED (Air-gapped)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Data Sensitivity</label>
            <select
              value={contextConfig.data_sensitivity}
              onChange={(e) => setContextConfig({ ...contextConfig, data_sensitivity: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="HIGHLY_REGULATED">HIGHLY_REGULATED</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="PUBLIC">PUBLIC</option>
            </select>
          </div>
        </div>

        {/* Mosca Sliders Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-600">Data Lifetime (X)</span>
              <span className="font-bold text-blue-700 font-mono">{contextConfig.data_lifetime_years} yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={contextConfig.data_lifetime_years}
              onChange={(e) => setContextConfig({ ...contextConfig, data_lifetime_years: parseFloat(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-600">Migration Time (Y)</span>
              <span className="font-bold text-indigo-700 font-mono">{contextConfig.migration_time_years} yrs</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={contextConfig.migration_time_years}
              onChange={(e) => setContextConfig({ ...contextConfig, migration_time_years: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-600">Quantum Threat Horizon (Z)</span>
              <span className="font-bold text-purple-700 font-mono">{contextConfig.quantum_timeline_years} yrs</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={contextConfig.quantum_timeline_years}
              onChange={(e) => setContextConfig({ ...contextConfig, quantum_timeline_years: parseFloat(e.target.value) })}
              className="w-full accent-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleInitiateScan}
          disabled={loading}
          className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition disabled:opacity-50 flex items-center gap-2.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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
