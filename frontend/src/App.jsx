import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import AssetDetailDrawer from './components/AssetDetailDrawer';
import Dashboard from './pages/Dashboard';
import ScanStudio from './pages/ScanStudio';
import CBOMInventory from './pages/CBOMInventory';
import DependencyIntelligence from './pages/DependencyIntelligence';
import FMEAAnalysis from './pages/FMEAAnalysis';
import MigrationRoadmap from './pages/MigrationRoadmap';
import QuantumReadiness from './pages/QuantumReadiness';
import SimulatorsLab from './pages/SimulatorsLab';
import ContinuousMonitoring from './pages/ContinuousMonitoring';
import Recommendations from './pages/Recommendations';
import KnowledgeBaseExplorer from './pages/KnowledgeBaseExplorer';
import Reports from './pages/Reports';
import { scanSampleRepo } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cbomReport, setCbomReport] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // On mount, auto-load the primary demo repo
  useEffect(() => {
    scanSampleRepo('banking-payment-gateway')
      .then((data) => {
        setCbomReport(data);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error('Initial sample scan failed:', err);
        setInitialLoading(false);
      });
  }, []);

  const handleScanComplete = (newReport) => {
    setCbomReport(newReport);
    setActiveTab('dashboard');
  };

  const handleUpdateCBOM = (updatedReport) => {
    setCbomReport(updatedReport);
  };

  const handleSelectAssetById = (assetId) => {
    if (cbomReport?.assets) {
      const found = cbomReport.assets.find(a => a.asset_id === assetId);
      if (found) {
        setSelectedAsset(found);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* 1. Opening Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Top Command Center Navbar */}
      <Navbar
        activeScan={cbomReport}
        onNewScanClick={() => setActiveTab('scan')}
        onOpenMonitoring={() => setActiveTab('monitoring')}
      />

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          assetCount={cbomReport?.assets?.length || 0}
          readinessScore={cbomReport?.readiness_assessment?.overall_score ?? null}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Content View */}
        <main className="flex-1 overflow-y-auto bg-[#040711] command-grid">
          {initialLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-cyan-glow">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
              <p className="text-xs font-mono text-cyan-400">
                Initializing QUANTECT Command Center &amp; Discovering Cryptographic Baseline...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  cbomReport={cbomReport}
                  onNavigate={setActiveTab}
                  onSelectAsset={setSelectedAsset}
                />
              )}

              {activeTab === 'scan' && (
                <ScanStudio
                  onScanComplete={handleScanComplete}
                />
              )}

              {activeTab === 'cbom' && (
                <CBOMInventory
                  cbomReport={cbomReport}
                  onSelectAsset={setSelectedAsset}
                />
              )}

              {activeTab === 'dependencies' && (
                <DependencyIntelligence
                  cbomReport={cbomReport}
                  onSelectAsset={setSelectedAsset}
                />
              )}

              {activeTab === 'fmea' && (
                <FMEAAnalysis
                  cbomReport={cbomReport}
                  onSelectAsset={setSelectedAsset}
                />
              )}

              {activeTab === 'roadmap' && (
                <MigrationRoadmap
                  cbomReport={cbomReport}
                  onSelectAsset={setSelectedAsset}
                />
              )}

              {activeTab === 'readiness' && (
                <QuantumReadiness
                  cbomReport={cbomReport}
                  onNavigateToRoadmap={() => setActiveTab('roadmap')}
                />
              )}

              {activeTab === 'simulators' && (
                <SimulatorsLab
                  cbomReport={cbomReport}
                  onUpdateCBOM={handleUpdateCBOM}
                />
              )}

              {activeTab === 'monitoring' && (
                <ContinuousMonitoring
                  cbomReport={cbomReport}
                  onNavigateToCBOM={() => setActiveTab('cbom')}
                  onSelectAssetId={handleSelectAssetById}
                />
              )}

              {activeTab === 'recommendations' && (
                <Recommendations />
              )}

              {activeTab === 'knowledge-base' && (
                <KnowledgeBaseExplorer />
              )}

              {activeTab === 'reports' && (
                <Reports
                  cbomReport={cbomReport}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 4. Unified Asset Detail Inspector Drawer */}
      {selectedAsset && (
        <AssetDetailDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

    </div>
  );
}
