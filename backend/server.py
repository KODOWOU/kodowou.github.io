import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Personal Site API")

# CORS - allow frontend origin from env if present
frontend_url = os.environ.get("FRONTEND_URL")
origins = [frontend_url] if frontend_url else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Health(BaseModel):
    status: str

@app.get("/api/health", response_model=Health)
def health():
    return {"status": "ok"}

# Placeholder route if later we want to list versions or metadata of CV stored in repo
class CVInfo(BaseModel):
    filename: str
    path: str

@app.get("/api/cv", response_model=CVInfo)
def get_cv_info():
    # The PDF is served statically by frontend at /cv.pdf; backend just returns meta
    return {"filename": "cv.pdf", "path": "/cv.pdf"}
