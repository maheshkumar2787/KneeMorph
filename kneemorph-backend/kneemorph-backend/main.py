"""
Step 1 of the backend: core FastAPI app.
Handles Page 1 (intake -> BMI) and Page 2 (optional scan upload).
Run with: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import uuid
import os

from models.schemas import PatientIn, PatientOut, PainEntryIn
from models.db_models import Patient, Scan, PainEntry
from database import get_db, engine, Base
from analysis import router as analysis_router
from agent_compare import router as agent_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KneeMorph AI API")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router, prefix="/analysis")
app.include_router(agent_router, prefix="/agent")

STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)


@app.post("/patients", response_model=PatientOut)
def create_patient(patient: PatientIn, db: Session = Depends(get_db)):
    """Page 1: intake form submits here. Computes and stores BMI."""
    bmi = round(patient.weight_kg / ((patient.height_cm / 100) ** 2), 1)
    db_patient = Patient(**patient.model_dump(), bmi=bmi)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@app.get("/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.post("/patients/{patient_id}/upload-scan")
async def upload_scan(patient_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Page 2: optional X-ray/MRI/PDF upload."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    file_id = str(uuid.uuid4())
    file_path = f"{STORAGE_DIR}/{file_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # PRODUCTION NOTE: replace local disk write above with an S3 upload (boto3).
    # Patient imaging data should never sit on a local filesystem long-term.

    scan = Scan(patient_id=patient_id, file_path=file_path, file_type=file.content_type or "unknown")
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return {"scan_id": scan.id, "status": "uploaded"}


@app.post("/pain-entries")
def create_pain_entry(entry: PainEntryIn, db: Session = Depends(get_db)):
    """Page 3: pain history form submits here."""
    db_entry = PainEntry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return {"status": "recorded", "id": db_entry.id}
