# KneeMorph

KneeMorph is a Next.js frontend with a FastAPI backend.

## Deploy the website

This repository contains two applications. Deploy them as two services:

### Frontend: Vercel

Create a Vercel project from this repository and set **Root Directory** to:

```text
kneemorph-frontend/kneemorph-frontend
```

Use the Next.js framework preset. Set this environment variable:

```text
BACKEND_URL=https://YOUR-API.onrender.com
```

The public website will be served by Vercel, including the `/` redirect to
`/intake`.

### Backend: Render

Create a Render Web Service from this repository. Use the settings in
`render.yaml`, or set:

```text
Root directory: kneemorph-backend/kneemorph-backend
Build command: pip install -r requirements.txt
Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

After Vercel gives you its public URL, set this Render environment variable:

```text
CORS_ORIGINS=https://YOUR-APP.vercel.app
```

Both services redeploy automatically when changes are pushed to `main`.

Do not deploy the repository root as a static site. It only contains the two
applications and deployment configuration, which is why that setup displays a
directory listing.# keenmorph