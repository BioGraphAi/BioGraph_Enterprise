const BASE_URL = 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server Error: ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  // 1. Analyze (Manual/Auto)
  analyze: async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Analyze Error:", error);
      return { error: error.message || "Failed to connect to BioGraph Engine." };
    }
  },

  // 2. Upload File
  upload: async (file, targetId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_id', targetId);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData, // Content-Type header mat lagana, browser khud set karega
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Upload Error:", error);
      return { error: error.message || "Upload failed." };
    }
  },

  // ... (Upload function ke baad)

  // 4. Chat with Drug
  askDrugAI: async (question, drugContext) => {
    try {
      const response = await fetch(`${BASE_URL}/chat_drug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, drug_context: drugContext })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Chat Error:", error);
      return { answer: "Server connection failed." };
    }
  },
  
  // ... (getImageUrl waghaira same rahega)

  // 3. Get Progress
  getProgress: async () => {
    try {
      const response = await fetch(`${BASE_URL}/progress`);
      return await response.json();
    } catch (e) {
      return { progress: 0, status: 'Connecting...' };
    }
  },

  // 4. Get Image URL Helper
  getImageUrl: (smiles) => {
    if (!smiles) return "https://via.placeholder.com/400x400.png?text=No+Structure";
    return `${BASE_URL}/molecule_image?smiles=${encodeURIComponent(smiles)}`;
  }
};