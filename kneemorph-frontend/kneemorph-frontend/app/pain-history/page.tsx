"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = "/api";

export default function PainHistory() {
  const router = useRouter();
  const params = useSearchParams();
  const patientId = params.get("patient_id");

  const [entry, setEntry] = useState({
    onset_date: "",
    cause: "",
    severity: 5,
    mobility: "normal",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!patientId || !entry.onset_date || !entry.cause) {
      setError("Please select the pain start date and cause.");
      return;
    }

    try {
      const res = await fetch(`${API}/pain-entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, patient_id: Number(patientId) }),
      });
      if (!res.ok) {
        const details = await res.json().catch(() => null);
        const message = details?.detail?.[0]?.msg || details?.detail;
        throw new Error(typeof message === "string" ? message : "Could not save pain history.");
      }
      router.push(`/knee-3d?patient_id=${patientId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save pain history.");
    }
  };

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">K</div><span>KneeMorph</span></div>
        <div className="rail-caption">Your care path</div>
        <div className="rail-step"><div className="rail-number">1</div><span>Patient profile</span></div>
        <div className="rail-step"><div className="rail-number">2</div><span>Imaging</span></div>
        <div className="rail-step active"><div className="rail-number">3</div><span>Pain history</span></div>
        <div className="rail-step"><div className="rail-number">4</div><span>3D view</span></div>
        <div className="rail-step"><div className="rail-number">5</div><span>Summary</span></div>
        <div className="rail-footer">Private by design.<br />Your information stays in this workspace.</div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span className="eyebrow">Step 03 / 05</span><span className="topbar-note">Pain history</span></header>
        <div className="page-content split-layout">
          <section>
            <span className="eyebrow">Your lived experience</span>
            <h1 className="page-title">Tell us what your knee feels like.</h1>
            <p className="page-lede">Symptoms are part of the picture. A simple history helps put any imaging into the right context.</p>
            <div className="image-panel" style={{ marginTop: 30, minHeight: 300 }}>
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85" alt="Healthcare professional speaking with a patient" style={{ minHeight: 300 }} />
              <div className="image-overlay"><strong>Your story belongs here.</strong><p>There is no right or wrong answer. Choose what best describes your day-to-day experience.</p></div>
            </div>
          </section>
          <section className="form-card">
            <div className="eyebrow">Symptom snapshot</div>
            <h2 className="text-2xl font-semibold mb-4">A few quick details</h2>
            <div className="form-grid">
      <label className="field-label">Pain began
      <input
        type="date"
        required
        className="field-input"
        value={entry.onset_date}
        onChange={(e) => setEntry({ ...entry, onset_date: e.target.value })}
      />
      </label>
      <label className="field-label">What caused it?
      <select
        required
        className="field-input"
        value={entry.cause}
        onChange={(e) => setEntry({ ...entry, cause: e.target.value })}
      >
        <option value="">How did it happen?</option>
        <option value="sports">Playing sports / activity</option>
        <option value="overweight">High weight / load</option>
        <option value="aging">Age-related wear</option>
        <option value="genetic">Family history / genetic</option>
        <option value="injury">Injury / accident</option>
      </select>
      </label>
      <label className="field-label">Pain level <span className="range-value">{entry.severity} / 10</span>
      <input
        type="range"
        min={1}
        max={10}
        value={entry.severity}
        onChange={(e) => setEntry({ ...entry, severity: Number(e.target.value) })}
        className="range-input"
      />
      </label>
      <label className="field-label">How is your mobility today?
      <select
        className="field-input"
        value={entry.mobility}
        onChange={(e) => setEntry({ ...entry, mobility: e.target.value })}
      >
        <option value="normal">Full mobility</option>
        <option value="limited">Limited mobility</option>
        <option value="severe">Significant difficulty walking</option>
      </select>
      </label>
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleSubmit} className="primary-button">
        Continue to 3D view →
      </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
