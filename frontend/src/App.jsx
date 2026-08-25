import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AssetDetailDrawer from './components/AssetDetailDrawer';
import Dashboard from './pages/Dashboard';
import ScanStudio from './pages/ScanStudio';
import CBOMInventory from './pages/CBOMInventory';
import MoscaLab from './pages/MoscaLab';
import Recommendations from './pages/Recommendations';
import KnowledgeBaseExplorer from './pages/KnowledgeBaseExplorer';
import Reports from './pages/Reports';
import { scanSampleRepo } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
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

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeScan={cbomReport}
        onNewScanClick={() => setActiveTab('scan')}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          assetCount={cbomReport?.assets?.length || 0}
          urgentCount={cbomReport?.scan_summary?.mosca_urgent_count || 0}
        />

        {/* Center Content View */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F19]/40">
          {initialLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <p className="text-xs text-slate-400 font-mono">
                Initializing Post-Quantum Discovery Engine & Mounting Banking Core Sample...
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

              {activeTab === 'mosca' && (
                <MoscaLab
                  cbomReport={cbomReport}
                  onUpdateCBOM={handleUpdateCBOM}
                  onSelectAsset={setSelectedAsset}
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

      {/* Detail Drawer Modal */}
      {selectedAsset && (
        <AssetDetailDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}
