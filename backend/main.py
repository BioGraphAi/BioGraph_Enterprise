from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from modules.database import init_db

# Import Routers
from routers import system, analysis, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 BioGraph Enterprise Starting...")
    init_db()
    yield
    print("🛑 BioGraph Enterprise Shutting Down...")

app = FastAPI(title="BioGraph Enterprise API", version="2.0", lifespan=lifespan)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(system.router)
app.include_router(analysis.router)
app.include_router(reports.router)

# Health Check (Direct)
@app.get("/")
def root():
    return {"status": "System Online", "mode": "Modular"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
