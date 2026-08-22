"""
Step 3 of the backend: the "AI agent" that compares a patient's profile
against a set of historical cases. This is a nearest-neighbor retrieval
step -- it surfaces similar past cases for a clinician to consider,
it does NOT make an autonomous implant decision.

ASSUMPTION FLAGGED: `HISTORICAL_DATA` below is a small hand-written
placeholder so this code runs out of the box. A real deployment needs
a proper historical case dataset (age, gender, BMI, KL grade, pain
score -> documented outcome), which is a data-collection project of
its own, not something this file can fabricate.
"""
from fastapi import APIRouter
from sklearn.neighbors import NearestNeighbors
from pydantic import BaseModel
import numpy as np

router = APIRouter()

# Placeholder historical dataset: [age, bmi, kl_grade, pain_severity] -> outcome
HISTORICAL_FEATURES = np.array([
    [65, 31.2, 4, 9],
    [58, 28.5, 3, 7],
    [70, 33.0, 4, 8],
    [45, 24.1, 1, 3],
    [60, 27.0, 2, 5],
])
HISTORICAL_OUTCOMES = [
    "Total knee replacement performed, good recovery",
    "Managed conservatively with physiotherapy",
    "Total knee replacement recommended and performed",
    "No surgical intervention needed, weight management advised",
    "Managed with anti-inflammatory treatment, monitored yearly",
]

_agent = NearestNeighbors(n_neighbors=3).fit(HISTORICAL_FEATURES)


class PatientVector(BaseModel):
    age: int
    bmi: float
    kl_grade: int
    pain_severity: int


@router.post("/similar-cases")
def find_similar_cases(patient: PatientVector):
    vector = np.array([[patient.age, patient.bmi, patient.kl_grade, patient.pain_severity]])
    distances, indices = _agent.kneighbors(vector)
    matches = [HISTORICAL_OUTCOMES[i] for i in indices[0]]
    return {
        "similar_case_outcomes": matches,
        "note": "Retrieved for clinician context. Not a recommendation on its own; "
                "based on a small placeholder dataset that must be replaced with "
                "real historical case data before clinical use.",
    }
