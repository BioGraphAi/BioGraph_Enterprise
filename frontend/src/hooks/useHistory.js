import { useState, useEffect } from 'react';

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('biograph_history') || '[]');
      setHistory(stored);
    } catch (e) {
      console.error("History Load Error:", e);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
    // Listen for updates from other components (like Dashboard)
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('biograph_history');
    setHistory([]);
    window.dispatchEvent(new Event('historyUpdated'));
  };

  return { history, clearHistory };
};