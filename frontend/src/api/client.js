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
        body: formData,
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Upload Error:", error);
      return { error: error.message || "Upload failed." };
    }
  },

  // 3. Get Progress (Task Based)
  getProgress: async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/progress/${taskId}`);
      return await response.json();
    } catch (e) {
      return { progress: 0, status: 'Connecting...', error: "Connection Error" };
    }
  },

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
  
  // 5. Get Image URL Helper
  getImageUrl: (smiles) => {
    if (!smiles) return "https://via.placeholder.com/400x400.png?text=No+Structure";
    return `${BASE_URL}/molecule_image?smiles=${encodeURIComponent(smiles)}`;
  }
};
