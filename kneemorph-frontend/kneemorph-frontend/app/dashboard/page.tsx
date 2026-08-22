"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const API = "/api";

interface AnalysisResult {
  kl_grade: number | null;
  model_trained: boolean;
  note: string;
}

interface AgentResult {
  similar_case_outcomes: string[];
  note: string;
}

export default function Dashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const patientId = params.get("patient_id");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [agent, setAgent] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a full build: fetch the patient's latest scan_id, BMI, and pain
    // severity from the backend first, then call these two endpoints with
    // real values. Placeholder values are used here to keep this file runnable.
    async function loadDashboard() {
      try {
        const agentRes = await fetch(`${API}/agent/similar-cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ age: 60, bmi: 29.5, kl_grade: 3, pain_severity: 7 }),
        });
        setAgent(await agentRes.json());
      } catch {
        setAgent(null);
      }
      setLoading(false);
    }
    loadDashboard();
  }, [patientId]);

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">K</div><span>KneeMorph</span></div>
        <div className="rail-caption">Your care path</div>
        <div className="rail-step"><div className="rail-number">1</div><span>Patient profile</span></div>
        <div className="rail-step"><div className="rail-number">2</div><span>Imaging</span></div>
        <div className="rail-step"><div className="rail-number">3</div><span>Pain history</span></div>
        <div className="rail-step"><div className="rail-number">4</div><span>3D view</span></div>
        <div className="rail-step active"><div className="rail-number">5</div><span>Summary</span></div>
        <div className="rail-footer">Private by design.<br />Your information stays in this workspace.</div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span className="eyebrow">Step 05 / 05</span><span className="topbar-note">Clinical summary</span></header>
        <div className="page-content">
      <span className="eyebrow">A starting point for conversation</span>
      <h1 className="page-title" style={{ fontSize: 46 }}>Your knee health, in one view.</h1>
      <p className="page-lede">
          This page brings together the information you entered. A clinician can
          use it to review your knee. It is not a diagnosis.
      </p>

      {loading && <p className="muted" style={{ marginTop: 28 }}>Preparing your summary...</p>}

      {analysis && (
        <div className="result-card" style={{ marginTop: 28 }}>
          <h3 className="font-semibold mb-1">Your scan result</h3>
          <div className="metric">{analysis.kl_grade ?? "N/A"}</div>
          <p className="muted">Kellgren-Lawrence grade</p>
          <p className="muted">{analysis.note}</p>
        </div>
      )}

      {agent && (
        <div className="result-card" style={{ marginTop: 18 }}>
          <h3 className="font-semibold mb-1">Similar past cases</h3>
          <ul className="outcome-list">
            {agent.similar_case_outcomes.map((outcome, i) => (
              <li key={i}>{outcome}</li>
            ))}
          </ul>
          <p className="muted">{agent.note}</p>
        </div>
      )}

      <div className="result-card" style={{ marginTop: 18, background: "var(--cream)", borderColor: "#f1d9be" }}>
        <h3 className="font-semibold mb-1">What happens next?</h3>
        <p className="muted">
          Take this summary to your healthcare professional. They will combine
          it with an examination and your medical history.
        </p>
      </div>
      <div className="result-card" style={{ marginTop: 18, background: "#edf7f4" }}>
        <h3 className="font-semibold mb-1">Is knee replacement compulsory?</h3>
        <p className="muted">
          No. A high pain level or a poor scan result does not automatically
          mean surgery is required. A clinician must review your scan, pain,
          movement, and other treatment options first.
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          If pain is severe or walking is difficult, a clinician assessment is
          important. This app cannot make a surgery decision.
        </p>
      </div>
      <div className="button-row" style={{ marginTop: 24 }}>
        <button onClick={() => router.push("/intake")} className="primary-button">Start again</button>
      </div>
        </div>
      </main>
    </div>
  );
}
