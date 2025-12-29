import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';

export const useDashboardLogic = (showToast, historyLoadData) => {
  // --- 1. STATES ---
  const [activeTab, setActiveTab] = useState('manual');
  const [target, setTarget] = useState('');
  const [smiles, setSmiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiThreshold, setAiThreshold] = useState(7.0);
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
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) setSelectedFile(event.target.files[0]);
  };

  const handleDrugClick = (drug) => {
    setSelectedId(drug.name);
    setChatHistory([]);
    
    const isActive = drug.score >= aiThreshold;
    const newResult = {
      score: drug.score,
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      confidence: drug.confidence || "N/A",
      color: isActive ? '#00f3ff' : '#ff0055',
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
    setResult(null); 
    setBatchResults([]); 
    setSelectedId(null);
    setChatHistory([]);
    
    try {
      // 1. Start Analysis (Get Task ID)
      let startResponse;
      if (activeTab === 'upload') {
        startResponse = await apiClient.upload(selectedFile, safeTarget);
      } else {
        startResponse = await apiClient.analyze({
          target_id: safeTarget,
          smiles: safeSmiles,
          mode: activeTab
        });
      }

      if (startResponse.error) {
        showToast(startResponse.error, "error");
        setLoading(false);
        return;
      }

      const taskId = startResponse.task_id;
      if (!taskId) {
        showToast("Failed to start analysis.", "error");
        setLoading(false);
        return;
      }

      // 2. Poll for Progress
      const pollInterval = setInterval(async () => {
        const statusData = await apiClient.getProgress(taskId);

        if (statusData.error) {
          clearInterval(pollInterval);
          showToast(`Error: ${statusData.error}`, "error");
          setLoading(false);
          return;
        }

        setProgress(statusData.progress || 0);

        if (statusData.status === "Completed") {
          clearInterval(pollInterval);
          setLoading(false);
          const data = statusData.result;

          if (data.results) {
             setBatchResults(data.results);
             showToast(`Found ${data.results.length} candidates`, "success");
          } else {
             const scoreValue = data.score !== undefined ? data.score : 0;
             const isActive = scoreValue >= aiThreshold;

             const finalData = {
                 ...data,
                 confidence: data.confidence || "N/A",
                 status: isActive ? 'ACTIVE' : 'INACTIVE',
                 color: isActive ? '#00f3ff' : '#ff0055'
             };

             setResult(finalData);
             showToast("Analysis Complete", "success");
             saveToHistory(finalData);
          }
        } else if (statusData.status === "Failed") {
           clearInterval(pollInterval);
           setLoading(false);
           showToast(`Analysis Failed: ${statusData.error}`, "error");
        }

      }, 500); // Poll every 500ms

    } catch (error) {
      console.error(error);
      showToast("Server Error or Network Issue", "error");
      setLoading(false);
    }
  };

  return {
    activeTab, setActiveTab: handleTabChange,
    target, setTarget,
    smiles, setSmiles,
    loading, progress,
    result, setResult,
    batchResults,
    selectedId,
    isSidebarOpen, setIsSidebarOpen,
    selectedFile, setSelectedFile,
    aiThreshold,
    fileInputRef,
    handleFileSelect,
    handleScan,
    handleDrugClick,
    chatHistory, setChatHistory
  };
};
