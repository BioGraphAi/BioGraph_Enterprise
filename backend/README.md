# 🧠 BioGraph Enterprise - Discovery Engine (Backend)

The backend of **BioGraph Enterprise** is a high-performance Python server powered by **FastAPI**. It acts as the core scientific discovery engine, handling all computationally intensive tasks ranging from Graph Neural Network (GNN) inference to real-time chemical profiling.

## 🚀 Core Engine Capabilities

### 1. DeepDrugNet_V4 (AI Inference)
- **GNN-Based Binding Affinity:** Utilizes PyTorch and PyTorch Geometric to run DeepDrugNet_V4. It parses 1D protein sequences (CNN) and 2D molecular graphs (GAT) to predict precise binding affinities (pKd).
- **Intelligent Processing:** Automatically handles SMILES strings, canonization, and PyTorch tensor generation.

### 2. Multi-Target Analysis & Automation
- **High-Throughput Processing:** Handles batch analyses for thousands of SMILES inputs via CSV or TXT, enabling rapid virtual screening.
- **Background Task Execution:** Employs FastAPI background tasks and asynchronous endpoints to stream live inference updates to the frontend dashboard.

### 3. Cheminformatics & ADMET Profiling
- **RDKit Integration:** Generates on-the-fly molecular descriptors to estimate Lipinski's Rule of Five compliance, molecular weight, LogP, TPSA, and hydrogen bond donors/acceptors.
- **Drug-likeness (QED):** Quantifies structural safety through algorithmic assessment.

### 4. Advanced PDF Lab Reporting
- **Automated Generation:** Employs ReportLab to generate highly professional, lab-ready PDF documents summarising AI diagnostics and ADMET profiles.
- **Embedded Structures:** Includes dynamically generated 2D structures directly inside the downloadable report.

## 🛠️ Technology Stack

- **Framework:** `FastAPI` + `Uvicorn`
- **Machine Learning:** `PyTorch`, `PyTorch Geometric` (PyG)
- **Cheminformatics:** `RDKit`, `PubChemPy`
- **Database:** `SQLite` (`drugs.db` for the internal library)
- **Reporting:** `ReportLab`

## 📂 Project Structure

```text
backend/
├── main.py             # FastAPI entry point & routers
├── modules/            
│   ├── ai_model.py     # DeepDrugNet_V4 GNN implementations
│   ├── admet.py        # Real-time ADMET profiling logic
│   ├── chemistry.py    # Molecular parsing (SMILES/PDB)
│   └── report.py       # PDF generation engine
├── routers/            # Cleanly separated API endpoints
├── drugs.db            # Local curated drug database
└── requirements.txt    # Python dependencies
```

## 📦 Installation & Setup

1. **Set Up Virtual Environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate the Environment:**
   - **Windows:** `venv\Scripts\activate`
   - **Linux/Mac:** `source venv/bin/activate`

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Discovery Engine:**
   ```bash
   uvicorn main:app --reload
   ```

## 🧪 Scientific Integrity
The backend engine has been strictly refined to focus on highly verifiable computational science. Experimental fluff (such as unsupported docking simulations) has been removed to maintain maximum performance, ensuring that all API endpoints serve robust, actionable research data.
