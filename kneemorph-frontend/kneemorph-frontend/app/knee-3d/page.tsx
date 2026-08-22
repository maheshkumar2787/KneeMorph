"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function KneeMesh() {
  return (
    <group rotation={[0, 0, 0.08]}>
        <mesh position={[0, 1.12, 0]} castShadow>
          <sphereGeometry args={[0.62, 40, 28]} />
          <meshStandardMaterial color="#f1d7b5" roughness={0.82} />
      </mesh>
        <mesh position={[0, 1.86, 0]} rotation={[0, 0, 0.04]} castShadow>
          <cylinderGeometry args={[0.34, 0.54, 1.05, 40]} />
          <meshStandardMaterial color="#eed0aa" roughness={0.82} />
      </mesh>
        <mesh position={[0.56, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 24]} />
          <meshStandardMaterial color="#e8c49c" roughness={0.82} />
      </mesh>
        <mesh position={[-0.56, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 24]} />
          <meshStandardMaterial color="#e8c49c" roughness={0.82} />
      </mesh>
        <mesh position={[0, 0.22, 0.46]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <sphereGeometry args={[0.3, 40, 24]} />
          <meshStandardMaterial color="#f5dfc1" roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.28, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.34, 1.25, 40]} />
          <meshStandardMaterial color="#efd2ad" roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.95, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.38, 0.9, 40]} />
          <meshStandardMaterial color="#e8c39c" roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.02, 0]} scale={[1.08, 0.18, 0.82]} castShadow>
          <torusGeometry args={[0.48, 0.11, 16, 40]} />
          <meshStandardMaterial color="#9fc5b4" roughness={0.42} metalness={0.08} />
      </mesh>
    </group>
  );
}

export default function Knee3D() {
  const router = useRouter();
  const params = useSearchParams();
  const patientId = params.get("patient_id");
  const [heightCm, setHeightCm] = useState<number | null>(null);

  useEffect(() => {
    if (!patientId) return;
    fetch(`/api/patients/${patientId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((patient) => setHeightCm(patient?.height_cm ?? null))
      .catch(() => setHeightCm(null));
  }, [patientId]);

  const femurLength = heightCm ? Math.round(heightCm * 0.267) : null;
  const tibiaLength = heightCm ? Math.round(heightCm * 0.225) : null;

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">K</div><span>KneeMorph</span></div>
        <div className="rail-caption">Your care path</div>
        <div className="rail-step"><div className="rail-number">1</div><span>Patient profile</span></div>
        <div className="rail-step"><div className="rail-number">2</div><span>Imaging</span></div>
        <div className="rail-step"><div className="rail-number">3</div><span>Pain history</span></div>
        <div className="rail-step active"><div className="rail-number">4</div><span>3D view</span></div>
        <div className="rail-step"><div className="rail-number">5</div><span>Summary</span></div>
        <div className="rail-footer">Private by design.<br />Your information stays in this workspace.</div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span className="eyebrow">Step 04 / 05</span><span className="topbar-note">Anatomy view</span></header>
        <div className="page-content">
          <div className="model-meta"><div><span className="eyebrow">Explore your anatomy</span><h1 className="page-title" style={{ fontSize: 42, marginBottom: 8 }}>A closer look at the knee.</h1><p className="page-lede" style={{ margin: 0 }}>This is a realistic reference model. Drag it to turn it around.</p></div><span className="badge">Interactive 3D reference</span></div>
          <div className="model-stage">
            <Canvas shadows camera={{ position: [0, 0.2, 4.8], fov: 42 }}>
          <ambientLight intensity={0.7} />
          <directionalLight castShadow position={[5, 5, 5]} intensity={1.3} />
          <pointLight position={[-4, 1, 3]} color="#ef856f" intensity={8} distance={8} />
          <KneeMesh />
          <OrbitControls />
        </Canvas>
      </div>
          <div className="dashboard-grid" style={{ marginTop: 18 }}>
            <div className="stat-card"><h3>Estimated femur length</h3><div className="metric">{femurLength ? `${femurLength} mm` : "—"}</div><p className="muted">Reference estimate from recorded height</p></div>
            <div className="stat-card"><h3>Estimated tibia length</h3><div className="metric">{tibiaLength ? `${tibiaLength} mm` : "—"}</div><p className="muted">Reference estimate from recorded height</p></div>
            <div className="stat-card"><h3>Cartilage reference</h3><div className="metric">3 mm</div><p className="muted">Typical reference thickness. Your cartilage amount needs an X-ray or MRI.</p></div>
          </div>
          <div className="button-row" style={{ marginTop: 22, justifyContent: "space-between" }}><span className="muted">The model is not made from your scan. Measurements are estimates.</span><button
          onClick={() => router.push(`/dashboard?patient_id=${patientId}`)}
          className="primary-button"
        >
          View full analysis →
        </button></div>
        </div>
      </main>
    </div>
  );
}
