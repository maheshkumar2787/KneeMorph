"""
Step 2 of the backend: deep learning analysis of an uploaded scan.
Page 4/5 call this after a scan has been uploaded via /patients/{id}/upload-scan.

IMPORTANT ASSUMPTION FLAGGED:
This loads a KL-grade (knee osteoarthritis severity, 0-4) classifier —
NOT an "implant needed: yes/no" model. No public dataset maps directly
to an implant verdict. kl_grade_model.pt must be trained separately on
labeled data (e.g. a KL-grade-annotated subset of the OAI dataset)
before this returns anything meaningful. Until trained weights exist,
this endpoint runs on an untrained network and its output should be
treated as a placeholder, not a real result.
"""
from fastapi import APIRouter, HTTPException
from torchvision import models, transforms
from PIL import Image
import torch
import os

router = APIRouter()

MODEL_PATH = "kl_grade_model.pt"
_model = None
_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def get_model():
    global _model
    if _model is None:
        _model = models.resnet18(weights=None)
        _model.fc = torch.nn.Linear(_model.fc.in_features, 5)  # 5 KL grades: 0-4
        if os.path.exists(MODEL_PATH):
            _model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
        _model.eval()
    return _model


@router.post("/scan/{scan_id}")
async def analyze_scan(scan_id: int, file_path: str):
    """
    file_path is passed here for simplicity; in a full build, look it up
    from the Scan row in the database by scan_id instead of trusting the caller.
    """
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Scan file not found")

    img = Image.open(file_path).convert("RGB")
    tensor = _transform(img).unsqueeze(0)

    model = get_model()
    with torch.no_grad():
        prediction = model(tensor)
        kl_grade = int(prediction.argmax())

    trained = os.path.exists(MODEL_PATH)
    return {
        "scan_id": scan_id,
        "kl_grade": kl_grade,
        "model_trained": trained,
        "note": (
            "KL grade is a radiographic osteoarthritis severity score (0-4), "
            "not a treatment decision. Requires clinician review."
            if trained else
            "WARNING: no trained weights found (kl_grade_model.pt missing). "
            "This output is from an untrained network and is not meaningful."
        ),
    }
