import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Starfield from "./Starfield";
import EarthMaterial from "./EarthMaterial";
import AtmosphereMesh from "./AtmosphereMesh";
import ScrollSection from "./components/ScrollSection";
import useScrollProgress from "./hooks/useScrollProgress";

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);
const sectionCopy = [
  {
    eyebrow: "Lorem ipsum",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body:
      "Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
  },
  {
    eyebrow: "Lorem ipsum",
    title: "Praesent mauris fusce nec tellus sed augue semper porta.",
    body:
      "Mauris massa. Vestibulum lacinia arcu eget nulla.",
  },
  {
    eyebrow: "Lorem ipsum",
    title: "Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
    body:
      "Per inceptos himenaeos. Curabitur sodales ligula in libero.",
  },
  {
    eyebrow: "Lorem ipsum",
    title: "Sed dignissim lacinia nunc. Curabitur tortor pellentesque nibh.",
    body:
      "Aenean quam. In scelerisque sem at dolor.",
  },
];

const navItems = [
  { label: "Lorem", href: "#top" },
  { label: "Ipsum", href: "#earth-story" },
  { label: "Dolor", href: "#layers" },
  { label: "Sit", href: "#contact" },
];

function Earth({ scrollProgress }) {
  const ref = React.useRef();
  const groupRef = React.useRef();
  
  useFrame((state) => {
    if (!ref.current || !groupRef.current) {
      return;
    }

    const scrollRotation = scrollProgress * Math.PI * 1.8;
    const scrollLift = (scrollProgress - 0.5) * 0.75;
    const earthVisibility = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.12, 0.26);
    const earthScale = THREE.MathUtils.lerp(0.06, 1, earthVisibility);
    const earthIsVisible = earthVisibility > 0.08;

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.clock.elapsedTime * 0.15 + scrollRotation,
      0.08,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      scrollLift,
      0.08,
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      2,
      1,
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      4 - scrollProgress * 0.9,
      0.08,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.1 + scrollLift * 0.3,
      0.08,
    );
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, earthScale, 0.1),
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      -1.1 + (1 - earthVisibility) * 0.35,
      0.08,
    );
    groupRef.current.visible = earthIsVisible;
    state.camera.lookAt(0, 0, 0);
  });
  const axialTilt = 23.4 * Math.PI / 180;
  return (
    <group ref={groupRef} rotation-z={axialTilt}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 64]} />
        <EarthMaterial sunDirection={sunDirection} />
        <AtmosphereMesh />
      </mesh>
    </group>
  );
}

function App() {
  const scrollProgress = useScrollProgress();
  const { x, y, z } = sunDirection;
  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Lorem ipsum home">
          <span className="brand-mark" />
          <span className="brand-text">
            Lorem
            <strong>Ipsum</strong>
          </span>
        </a>

        <nav className="topbar-nav" aria-label="Lorem ipsum navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <Canvas
        className="earth-canvas"
        camera={{ position: [0, 0.1, 4] }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <Earth scrollProgress={scrollProgress} />
        <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
        <directionalLight position={[x, y, z]} />
        <Starfield />
      </Canvas>

      <main className="content-stack">
        <section className="hero-panel" id="top">
          <div>
            <p className="eyebrow">Lorem ipsum</p>
            <h1>Lorem ipsum dolor sit amet.</h1>
            <p className="hero-copy">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor.
            </p>
          </div>
        </section>

        {sectionCopy.map((section, index) => (
          <ScrollSection
            key={section.title}
            eyebrow={section.eyebrow}
            title={section.title}
            body={section.body}
            align={index % 2 === 0 ? "left" : "right"}
            delay={index * 90}
            id={index === 0 ? "earth-story" : index === 1 ? "layers" : index === 2 ? "contact" : undefined}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
