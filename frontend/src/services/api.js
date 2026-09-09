// API Service for QUANTECT Platform
const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchSamples() {
  const res = await fetch(`${BASE_URL}/samples`);
  if (!res.ok) throw new Error('Failed to load sample repositories');
  return res.json();
}

export async function scanSampleRepo(sampleId, options = {}) {
  const res = await fetch(`${BASE_URL}/scan/sample/${sampleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Scan failed');
  }
  return res.json();
}

export async function scanUploadedFile(formData) {
  const res = await fetch(`${BASE_URL}/scan/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Upload scan failed');
  }
  return res.json();
}

export async function scanFolderUpload(formData) {
  const res = await fetch(`${BASE_URL}/scan/folder-upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Folder upload scan failed');
  }
  return res.json();
}

export async function scanGitRepo(payload) {
  const res = await fetch(`${BASE_URL}/scan/git-repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Git repository scan failed');
  }
  return res.json();
}

export async function scanLocalPath(payload) {
  const res = await fetch(`${BASE_URL}/scan/local-path`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Local directory path scan failed');
  }
  return res.json();
}

export async function scanRawCode(payload) {
  const res = await fetch(`${BASE_URL}/scan/raw-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Raw code scan failed');
  }
  return res.json();
}

export async function simulateMosca(payload) {
  const res = await fetch(`${BASE_URL}/mosca/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Mosca simulation failed');
  }
  return res.json();
}

export async function fetchLatencyImpact(classicalAlgo, targetPqc) {
  const res = await fetch(`${BASE_URL}/latency-impact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classical_algorithm: classicalAlgo,
      target_pqc_or_hybrid: targetPqc
    })
  });
  if (!res.ok) throw new Error('Failed to simulate latency impact');
  return res.json();
}

export async function simulateCostEstimate(payload) {
  const res = await fetch(`${BASE_URL}/cost-estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Cost calculation failed');
  return res.json();
}

export async function fetchDependencies(assets, appName = "Enterprise Application") {
  const res = await fetch(`${BASE_URL}/dependencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assets, application_name: appName })
  });
  if (!res.ok) throw new Error('Failed to build dependency graph');
  return res.json();
}

export async function fetchFMEAAnalysis(assets) {
  const res = await fetch(`${BASE_URL}/fmea`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assets })
  });
  if (!res.ok) throw new Error('Failed to compute FMEA matrix');
  return res.json();
}

export async function fetchMonitoringSummary() {
  const res = await fetch(`${BASE_URL}/monitoring/summary`);
  if (!res.ok) throw new Error('Failed to fetch monitoring summary');
  return res.json();
}

export async function registerMonitoringSource(payload) {
  const res = await fetch(`${BASE_URL}/monitoring/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to register monitoring source');
  return res.json();
}

export async function updateMonitoringStatus(sourceId, status) {
  const res = await fetch(`${BASE_URL}/monitoring/sources/${sourceId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update monitoring status');
  return res.json();
}

export async function markAlertRead(alertId) {
  const res = await fetch(`${BASE_URL}/monitoring/alerts/${alertId}/read`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to mark alert as read');
  return res.json();
}

export async function fetchKnowledgeBase(query = '') {
  const url = query ? `${BASE_URL}/kb?query=${encodeURIComponent(query)}` : `${BASE_URL}/kb`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load Knowledge Base');
  return res.json();
}

export async function fetchAlgorithmDetails(algoName) {
  const res = await fetch(`${BASE_URL}/kb/${encodeURIComponent(algoName)}`);
  if (!res.ok) throw new Error(`Algorithm '${algoName}' not found`);
  return res.json();
}

export async function downloadCBOMJson(cbomReport) {
  const res = await fetch(`${BASE_URL}/export/cbom/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cbomReport)
  });
  if (!res.ok) throw new Error('Export JSON failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cbom_${cbomReport.scan_summary.scan_id || 'export'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadCBOMCsv(cbomReport) {
  const res = await fetch(`${BASE_URL}/export/cbom/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cbomReport)
  });
  if (!res.ok) throw new Error('Export CSV failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cbom_${cbomReport.scan_summary.scan_id || 'export'}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadHtmlReport(cbomReport) {
  const res = await fetch(`${BASE_URL}/export/report/html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cbomReport)
  });
  if (!res.ok) throw new Error('Export HTML failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit_report_${cbomReport.scan_summary.scan_id || 'export'}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadMigrationPlanHtml(cbomReport) {
  const res = await fetch(`${BASE_URL}/export/migration-plan/html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cbomReport)
  });
  if (!res.ok) throw new Error('Export Migration Plan HTML failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quantect_migration_plan_${cbomReport.scan_summary.scan_id || 'export'}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadMigrationPlanJson(cbomReport) {
  const res = await fetch(`${BASE_URL}/export/migration-plan/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cbomReport)
  });
  if (!res.ok) throw new Error('Export Migration Plan JSON failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quantect_migration_plan_${cbomReport.scan_summary.scan_id || 'export'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
