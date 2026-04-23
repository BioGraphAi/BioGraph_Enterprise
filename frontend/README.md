# 🌐 BioGraph Enterprise - Research Dashboard (Frontend)

The frontend of **BioGraph Enterprise** is a high-performance, immersive research dashboard built with **React** and **Vite**. It provides scientists with a real-time interface to explore AI-driven drug repurposing results.

---

### ✨ Key Features

#### **1. 3D Interaction Studio**
- **Molecular Rendering:** High-fidelity 3D visualization using `Three.js` (via `3d-force-graph` for the knowledge graph).
- **Interactive Graphs:** Dynamic 3D network graphs where spatial distance represents AI-predicted binding affinity.

#### **2. Real-Time Discovery Dashboard**
- **Multiple Discovery Modes:** Manual (SMILES/Name), Auto (Library Scan), and Batch (File Upload).
- **Holographic Progress:** Advanced CSS-based loading animations and progress tracking for long-running AI tasks.

#### **3. Advanced Analytics**
- **ADMET Visualization:** Radar charts and detailed tables for safety profiling.
- **AI Scientific Chat:** Context-aware interactive assistant powered by GPT-4o.
- **Export System:** One-click PDF report generation and download.

---

### 🛠️ Technology Stack

- **Framework:** `React 18` + `Vite`
- **State Management:** `React Hooks` (Custom `useDashboardLogic`)
- **Icons:** `Lucide-React`
- **3D Visualization:** `3d-force-graph` (Three.js based)
- **Styling:** `Vanilla CSS` with a custom Glassmorphic Design System.

---

### 📂 Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/      # Discovery, Results, Hologram UI
│   │   ├── sidebar/        # Navigation & Result Filter
│   │   └── layout/         # Background effects & Global UI
│   ├── hooks/              # Centralized business logic (useDashboardLogic)
│   ├── pages/              # Main Dashboard entry point
│   ├── styles/             # Modular CSS (Main, Dashboard, Components)
│   └── api/                # API communication layer
├── public/                 # Static assets
└── vite.config.js          # Vite configuration
```

---

### 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configuration:**
   The frontend communicates with the backend via a base URL. Ensure the backend is running.
   Environment variables can be set in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

### 🎨 Design System
The dashboard uses a **Cyber-Scientific** aesthetic:
- **Primary Color:** `#00f3ff` (Neon Cyan) for active/positive hits.
- **Secondary Color:** `#ff0055` (Neon Pink) for inactive/risky hits.
- **Surface:** Translucent glassmorphism (`backdrop-filter: blur(10px)`).
- **Typography:** Modern sans-serif (Inter/Roboto).
