import * as THREE from "three";
import React from "react";
import { useFrame, useLoader } from "@react-three/fiber";

function Moon({ scrollProgress }) {
  const groupRef = React.useRef();
  const meshRef = React.useRef();
  const moonMap = useLoader(THREE.TextureLoader, "/textures/moon-4k.jpg");

  React.useEffect(() => {
    moonMap.colorSpace = THREE.SRGBColorSpace;
  }, [moonMap]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) {
      return;
    }

    const moonEntry = 0.18;
    const moonExit = 0.42;
    const moonVisibility =
      THREE.MathUtils.smoothstep(scrollProgress, moonEntry - 0.04, moonEntry + 0.05) *
      (1 - THREE.MathUtils.smoothstep(scrollProgress, moonExit - 0.05, moonExit + 0.04));
    const moonScale = THREE.MathUtils.lerp(0.035, 0.45, moonVisibility);
    const moonX = -3.25;
    const moonY = -1.7;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      state.clock.elapsedTime * 0.08,
      0.08,
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      moonX,
      0.08,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      moonY,
      0.08,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      -1.0,
      0.08,
    );
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, moonScale, 0.1),
    );
    groupRef.current.visible = moonVisibility > 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={moonMap} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export default Moon;