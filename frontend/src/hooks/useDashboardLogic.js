import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';

export const useDashboardLogic = (showToast, historyLoadData) => {
  // --- 1. STATES ---
  const [activeTab, setActiveTab] = useState('manual');
  const [target, setTarget] = useState('');
  const [smiles, setSmiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDetail, setProgressDetail] = useState({ current: 0, total: 0, status: '' });
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(true); // ✅ Controls form vs result view
  const [batchResults, setBatchResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiThreshold, setAiThreshold] = useState(7.0);
  
  // ✅ Result Sidebar / Content states
  const [resultActiveTab, setResultActiveTab] = useState('intelligence');
  const [isResultSidebarOpen, setIsResultSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or '3d'

  // ✅ Chat History State
  const [chatHistory, setChatHistory] = useState([]);

  const fileInputRef = useRef(null);

  // --- 2. LOAD SETTINGS & HISTORY ---
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('biograph_settings') || '{}');
        setAiThreshold(saved.threshold !== undefined ? saved.threshold : 7.0);
      } catch (e) { console.error(e); }
    };
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  useEffect(() => {
    if (historyLoadData) {
      setResult(historyLoadData);
      setBatchResults([]);
      setChatHistory([]); 
      setResultActiveTab('intelligence'); // Reset tab on load
      showToast(`History Loaded: ${historyLoadData.name}`, 'success');
    }
  }, [historyLoadData, showToast]);

  // --- 3. HELPER FUNCTIONS ---
  const saveToHistory = (data) => {
    try {
      const existing = JSON.parse(localStorage.getItem('biograph_history') || '[]');
      const isDuplicate = existing.some(item => (item.name === data.name) || (item.smiles === data.smiles));
      if (!isDuplicate) {
        const newEntry = { ...data, timestamp: new Date().toISOString() };
        const updated = [newEntry, ...existing].slice(0, 15);
        localStorage.setItem('biograph_history', JSON.stringify(updated));
        window.dispatchEvent(new Event('historyUpdated'));
      }
    } catch (e) { console.error("History Save Error", e); }
  };

  // --- 4. HANDLERS ---
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setResult(null);
    setBatchResults([]);
    setSelectedId(null);
    setChatHistory([]);
    setShowForm(true); // ✅ Reset to form on tab change
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) setSelectedFile(event.target.files[0]);
  };

  const handleDrugClick = (drug) => {
    setSelectedId(drug.name);
    setChatHistory([]); 
    setResultActiveTab('intelligence'); // Switch to intelligence on click
    
    const isActive = drug.score >= aiThreshold;
    const newResult = {
      score: drug.score,
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      confidence: drug.confidence || "N/A",
      color: isActive ? 'var(--status-success)' : 'var(--status-error)',
      name: drug.name,
      smiles: drug.smiles || smiles,
      admet: drug.admet
    };

    setResult(newResult);
    if (drug.smiles) setSmiles(drug.smiles);
    saveToHistory(newResult);
  };

  const handleScan = async () => {
    const safeTarget = target ? target.trim() : '';
    const safeSmiles = smiles ? smiles.trim() : '';

    if (!safeTarget) return showToast("Enter Target Protein ID!", "error");
    if (activeTab === 'manual' && !safeSmiles) return showToast("Enter SMILES!", "error");
    if (activeTab === 'upload' && !selectedFile) return showToast("Select a file!", "error");

    setLoading(true);
    setProgress(0);
    setResult(null);       // ✅ Clear old result only when NEW scan starts
    setBatchResults([]);
    setSelectedId(null);
    setChatHistory([]);
    setResultActiveTab('intelligence');
    setShowForm(false);    // ✅ Will show result when done
    
    let progressInterval = null;

    try {
      const sessionId = Math.random().toString(36).substring(2, 15);
      
      let initialResponse;
      if (activeTab === 'upload') {
        initialResponse = await apiClient.upload(selectedFile, safeTarget, sessionId);
      } else {
        initialResponse = await apiClient.analyze({
          target_id: safeTarget,
          smiles: safeSmiles,
          mode: activeTab,
          task_id: sessionId
        });
      }

      if (initialResponse.error) {
        showToast(initialResponse.error, "error");
        setLoading(false);
        return;
      }

      // Polling Loop for Results
      let completed = false;
      let pollCount = 0;
      
      while (!completed && pollCount < 100) { // Safety timeout
        pollCount++;
        const pollData = await apiClient.getProgress(sessionId);
        
        if (pollData) {
          if (pollData.progress !== undefined) setProgress(pollData.progress);
          setProgressDetail({
            current: pollData.current || 0,
            total: pollData.total || 0,
            status: pollData.status || ''
          });
          
          if (pollData.status === 'Done') {
            const finalData = pollData.result;
            
            if (finalData && finalData.results) {
              // Batch results (Auto/Upload)
              setBatchResults(finalData.results);
              showToast(`Found ${finalData.results.length} candidates`, "success");
            } else if (finalData) {
              // Single result (Manual)
              const scoreValue = finalData.score !== undefined ? finalData.score : 0;
              const isActive = scoreValue >= aiThreshold;
              
              const formattedData = {
                  ...finalData,
                  confidence: finalData.confidence || "N/A",
                  status: isActive ? 'ACTIVE' : 'INACTIVE',
                  color: isActive ? 'var(--status-success)' : 'var(--status-error)'
              };

              setResult(formattedData);
              showToast("Analysis Complete", "success");
              saveToHistory(formattedData);
            }
            completed = true;
          } else if (pollData.status === 'FAILED') {
            showToast(pollData.error || "Analysis Failed", "error");
            completed = true;
          }
        }
        
        if (!completed) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

    } catch (error) {
      console.error(error);
      showToast("Server Error or Network Issue", "error");
    } finally {
      setProgress(100); 
      setLoading(false);
    }
  };

  return {
    activeTab, setActiveTab: handleTabChange,
    target, setTarget,
    smiles, setSmiles,
    loading, progress, progressDetail,
    result, setResult,
    showForm, setShowForm,   // ✅ Export form visibility toggle
    batchResults,
    selectedId,
    isSidebarOpen, setIsSidebarOpen,
    selectedFile, setSelectedFile,
    aiThreshold,
    fileInputRef,
    handleFileSelect,
    handleScan,
    handleDrugClick,
    chatHistory, setChatHistory,
    // ✅ Export New States
    resultActiveTab, setResultActiveTab,
    isResultSidebarOpen, setIsResultSidebarOpen,
    viewMode, setViewMode
  };
};