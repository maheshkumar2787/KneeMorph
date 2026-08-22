"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = "/api";

export default function IntakePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
  });
  const [error, setError] = useState("");

  const bmi =
    form.height_cm && form.weight_kg
      ? (Number(form.weight_kg) / (Number(form.height_cm) / 100) ** 2).toFixed(1)
      : null;

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          height_cm: Number(form.height_cm),
          weight_kg: Number(form.weight_kg),
        }),
      });
      if (!res.ok) throw new Error("Failed to save patient");
      const data = await res.json();
      router.push(`/upload?patient_id=${data.id}`);
    } catch (err) {
      setError("Could not save your details. Is the backend running on port 8000?");
    }
  };

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">K</div><span>KneeMorph</span></div>
        <div className="rail-caption">Your care path</div>
        <div className="rail-step active"><div className="rail-number">1</div><span>Patient profile</span></div>
        <div className="rail-step"><div className="rail-number">2</div><span>Imaging</span></div>
        <div className="rail-step"><div className="rail-number">3</div><span>Pain history</span></div>
        <div className="rail-step"><div className="rail-number">4</div><span>3D view</span></div>
        <div className="rail-step"><div className="rail-number">5</div><span>Summary</span></div>
        <div className="rail-footer">Private by design.<br />Your information stays in this workspace.</div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span className="eyebrow">Step 01 / 05</span><span className="topbar-note">Patient intake</span></header>
        <div className="page-content split-layout">
          <section>
            <span className="eyebrow">A clearer view of your care</span>
            <h1 className="page-title">Let&apos;s get to know your knees.</h1>
            <p className="page-lede">A few essentials help us create a more useful picture of your knee health. This takes about two minutes.</p>
            <div className="info-strip"><span><i className="info-dot" />Secure workspace</span><span>Clinician-ready summary</span></div>
            <div className="visual-pair">
              <div className="visual-tile"><img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=700&q=80" alt="Medical professional preparing a patient examination" /><span>Expert-led care</span></div>
              <div className="visual-tile"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80" alt="Healthcare professional in a clinical setting" /><span>Built for clarity</span></div>
            </div>
          </section>
          <section className="form-card">
            <div className="eyebrow">Patient profile</div>
            <h2 className="text-2xl font-semibold mb-4">Start with the basics</h2>
            <div className="form-grid">
        <input
          placeholder="Full name"
          className="field-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Age"
          type="number"
          className="field-input"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <select
          className="field-input"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          placeholder="Height (cm)"
          type="number"
          className="field-input"
          value={form.height_cm}
          onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
        />
        <input
          placeholder="Weight (kg)"
          type="number"
          className="field-input"
          value={form.weight_kg}
          onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
        />
        {bmi && <p className="muted">Current BMI estimate: <strong className="metric" style={{ fontSize: 24 }}>{bmi}</strong></p>}
        {error && <p className="error-text">{error}</p>}
        <button
          onClick={handleSubmit}
          className="primary-button"
        >
          Continue to imaging →
        </button>
            </div>
          </section>
        </div>
      </main>
      </div>
  );
}
