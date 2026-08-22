"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = "/api";

export default function UploadPage() {
  const router = useRouter();
  const params = useSearchParams();
  const patientId = params.get("patient_id");
  const [status, setStatus] = useState("");

  const handleUpload = async (file: File) => {
    setStatus("Uploading...");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch(`${API}/patients/${patientId}/upload-scan`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error();
      setStatus("Uploaded successfully.");
    } catch {
      setStatus("Upload failed — you can skip this step.");
    }
  };

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">K</div><span>KneeMorph</span></div>
        <div className="rail-caption">Your care path</div>
        <div className="rail-step"><div className="rail-number">1</div><span>Patient profile</span></div>
        <div className="rail-step active"><div className="rail-number">2</div><span>Imaging</span></div>
        <div className="rail-step"><div className="rail-number">3</div><span>Pain history</span></div>
        <div className="rail-step"><div className="rail-number">4</div><span>3D view</span></div>
        <div className="rail-step"><div className="rail-number">5</div><span>Summary</span></div>
        <div className="rail-footer">Private by design.<br />Your information stays in this workspace.</div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span className="eyebrow">Step 02 / 05</span><span className="topbar-note">Imaging intake</span></header>
        <div className="page-content split-layout">
          <section>
            <span className="eyebrow">Bring your scan into focus</span>
            <h1 className="page-title">Add an image for a richer picture.</h1>
            <p className="page-lede">Upload an X-ray, MRI image, or PDF report. It is optional, and you can continue without one.</p>
            <div className="image-panel" style={{ marginTop: 30, minHeight: 300 }}>
              <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1000&q=85" alt="Medical professional examining a patient knee" style={{ minHeight: 300 }} />
              <div className="image-overlay"><strong>Clinical context matters.</strong><p>Your scan sits alongside your own symptoms and history, never on its own.</p></div>
            </div>
          </section>
          <section className="form-card">
            <div className="eyebrow">Secure upload</div>
            <h2 className="text-2xl font-semibold mb-2">Your knee, in view</h2>
            <p className="muted" style={{ marginTop: 0 }}>Accepted formats: JPG, PNG, DICOM, or PDF.</p>
            <div className="upload-zone">
              <div className="upload-icon">↑</div>
              <strong>Drop a scan here</strong>
              <p className="muted">or choose a file from your device</p>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.dcm" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
            </div>
            <div className="visual-pair">
              <div className="visual-tile"><img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=700&q=80" alt="Healthy knee imaging reference" /><span>Healthy reference</span></div>
              <div className="visual-tile"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80" alt="Medical person reviewing a knee image" /><span>Clinician review</span></div>
            </div>
            {status && <p className="muted" style={{ marginTop: 14 }}>{status}</p>}
            <div className="button-row" style={{ marginTop: 24 }}>
              <button onClick={() => router.push(`/pain-history?patient_id=${patientId}`)} className="primary-button">Continue to history →</button>
              <button onClick={() => router.push(`/pain-history?patient_id=${patientId}`)} className="secondary-button">Skip</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
