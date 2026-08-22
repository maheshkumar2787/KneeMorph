# KneeMorph AI — Frontend (Next.js)

## What this is
The 5-page patient flow: intake/BMI -> upload scan -> pain history -> 3D knee view -> dashboard.
Calls the FastAPI backend through the same frontend origin at `/api`.

## Step-by-step setup

**1. Create the Next.js app shell (if starting fresh)**
```bash
npx create-next-app@latest kneemorph-frontend --typescript --tailwind --app
```
Then copy the `app/` folder contents from this project into the generated one
(or just drop this whole folder in and run the install step below).

**2. Install dependencies**
```bash
npm install
```

**3. Add Tailwind config** (if not already present from step 1)
Make sure `tailwind.config.js` includes:
```js
content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]
```

**4. Add 3D model assets**
Create `public/models/patient_knee.glb` — a placeholder .glb mesh. In production
this comes from segmenting the patient's uploaded MRI/CT scan (e.g. with MONAI or
3D Slicer), not a static file. Page 4 will fail to render until a .glb exists at that path.

**5. Run the dev server**
```bash
npm run dev
```
Visit `http://localhost:3000/intake` to start the flow.

The frontend proxies `/api/*` to FastAPI at `http://localhost:8000`, so the
browser uses one host. For a different backend address, set `BACKEND_URL`
before starting Next.js.

For Vercel, set `BACKEND_URL` to the deployed backend URL, for example
`https://kneemorph-api.onrender.com`.

**6. Make sure the backend is running first**
Every page after intake calls the FastAPI backend on port 8000 — start that
project (see its own README) before testing the full flow.

## Page flow
`/intake` → `/upload` → `/pain-history` → `/knee-3d` → `/dashboard`

Patient ID is passed via URL query params (`?patient_id=...`) between pages.
This is intentionally simple for a first build — swap for proper session/auth
state (e.g. via your auth provider) before handling real patient data.

## Before real use (not optional)
- Patient ID in a URL query string is not secure for real health data —
  move to authenticated session state
- Add an auth provider (Clerk/Auth0) — this UI currently has no login
- Replace the placeholder `.glb` with real per-patient segmented meshes
- Point `API` constant (top of each page file) at your deployed backend URL, not localhost
