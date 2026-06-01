import * as THREE from "three";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import Moon from "../Moon";
import Starfield from "../Starfield";
import Topbar from "../components/Topbar";

function MoonPage() {
  return (
    <div className="page-shell moon-page">
      <Topbar />

      <Canvas
        className="scene-canvas"
        camera={{ position: [0, 0, 4.2] }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <Suspense fallback={null}>
          <Moon staticView />
        </Suspense>
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 2, 4]} intensity={2.2} />
        <Starfield />
      </Canvas>

      <main className="moon-stage">
        <section className="moon-panel">
          <p className="eyebrow">Página da lua</p>
          <h1>Agora você está vendo a Lua.</h1>
          <p className="hero-copy">
            Aqui a cena fica dedicada só ao satélite, com navegação por botão na
            barra superior para voltar para a Terra.
          </p>
          <Link className="moon-button" to="/">
            Voltar para a Terra
          </Link>
        </section>
      </main>
    </div>
  );
}

export default MoonPage;