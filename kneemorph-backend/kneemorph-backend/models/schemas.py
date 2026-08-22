"""
Pydantic schemas — what the API accepts and returns.
Keeping these separate from db_models.py (ORM) is intentional:
API shape and DB shape are allowed to drift as the product evolves.
"""
from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, Literal


class PatientIn(BaseModel):
    name: str
    age: int = Field(gt=0, lt=130)
    gender: Literal["male", "female", "other"]
    height_cm: float = Field(gt=50, lt=250)
    weight_kg: float = Field(gt=2, lt=400)


class PatientOut(PatientIn):
    id: int
    bmi: float


class PainEntryIn(BaseModel):
    patient_id: int
    onset_date: date
    cause: Literal["sports", "overweight", "aging", "genetic", "injury"]
    severity: int = Field(ge=1, le=10)
    mobility: Literal["normal", "limited", "severe"]


class ScanAnalysisOut(BaseModel):
    scan_id: int
    kl_grade: Optional[int]
    note: str


class DashboardOut(BaseModel):
    patient: PatientOut
    latest_pain: Optional[PainEntryIn]
    kl_grade: Optional[int]
    similar_case_outcomes: list[str]
    summary: str
