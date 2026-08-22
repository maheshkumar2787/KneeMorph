# KneeMorph AI — Backend (FastAPI)

## What this is
The API server: patient intake + BMI, scan upload, pain history, DL analysis,
and the case-comparison agent. Talks to the Next.js frontend over CORS on `localhost:3000`.

## Step-by-step setup

**1. Create and activate a virtual environment**
```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Run the server**
```bash
uvicorn main:app --reload --port 8000
```
This creates `kneemorph.db` (SQLite) automatically on first run — no separate
database setup needed for local development.

**4. Verify it's running**
Open `http://localhost:8000/docs` — FastAPI's interactive Swagger UI lets you
test every endpoint (create a patient, upload a scan, run analysis) without
touching the frontend yet.

**5. Endpoints available**
| Method | Path | Purpose |
|---|---|---|
| POST | `/patients` | Page 1: create patient, returns computed BMI |
| POST | `/patients/{id}/upload-scan` | Page 2: upload X-ray/MRI/PDF |
| POST | `/pain-entries` | Page 3: log pain history entry |
| POST | `/analysis/scan/{scan_id}` | Page 4/5: run DL analysis on a scan |
| POST | `/agent/similar-cases` | Page 5: retrieve similar historical cases |

## Publish the app

For a simple public demo, deploy this folder as a Render Web Service:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `CORS_ORIGINS=https://your-app.vercel.app`

Deploy the frontend folder to Vercel and set `BACKEND_URL` to the Render API
URL. The browser continues to use the frontend host through `/api`.

## Before real use (not optional)
- Swap SQLite for Postgres: set `DATABASE_URL` env var, e.g.
  `postgresql://user:pass@localhost/kneemorph`
- Swap local file storage in `main.py` for S3 (`boto3`) — see the
  `PRODUCTION NOTE` comment in `main.py`
- Train `kl_grade_model.pt` on real labeled data before trusting `/analysis` output —
  see the warning docstring in `analysis.py`
- Replace `HISTORICAL_FEATURES` / `HISTORICAL_OUTCOMES` in `agent_compare.py`
  with a real historical case dataset
- Add authentication (this API currently has none — do not deploy publicly as-is)
