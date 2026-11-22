import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from backend.app.config import PROJECT_ROOT, SAMPLES_DIR, settings
from backend.app.db import init_db
from backend.app.routes_api import router as api_router
from backend.app.twin.routes import router as twin_router

FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB and samples exist
    init_db()
    if not (SAMPLES_DIR / "policy_sample.pdf").exists():
        from backend.app.tools.make_samples import generate_all_samples
        generate_all_samples()
    yield

app = FastAPI(
    title="ClaimKavach API",
    description="Multi-Agent AI for Indian Health Insurance Dispute Execution",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(api_router)
app.include_router(twin_router)

# Mount sample files directly if needed
if SAMPLES_DIR.exists():
    app.mount("/samples", StaticFiles(directory=str(SAMPLES_DIR)), name="samples")

# SPA Static and Fallback
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

@app.middleware("http")
async def spa_fallback_middleware(request: Request, call_next):
    # Don't intercept API or twin or documentation endpoints
    path = request.url.path
    if (
        path.startswith("/api") or
        path.startswith("/twin") or
        path.startswith("/samples") or
        path.startswith("/docs") or
        path.startswith("/openapi.json") or
        path.startswith("/redoc") or
        path.startswith("/assets")
    ):
        return await call_next(request)

    response = await call_next(request)
    if response.status_code == 404:
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
    return response

@app.get("/")
def root():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {
        "message": "ClaimKavach Backend running. Build frontend or run Vite dev server on port 5173.",
        "api_docs": "/docs",
        "health": "/api/health"
    }
