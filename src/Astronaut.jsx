import * as THREE from "three";
import React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";

function configureAstronautMaterial(material, astronautTexture) {
  const nextMaterial = material.clone();
  nextMaterial.map = astronautTexture;
  nextMaterial.map.colorSpace = THREE.SRGBColorSpace;
  nextMaterial.map.flipY = false;
  nextMaterial.color = new THREE.Color(1.15, 1.15, 1.15);
  nextMaterial.emissive = new THREE.Color(0x2a2a2a);
  nextMaterial.emissiveIntensity = 0.85;
  nextMaterial.roughness = 0.95;
  nextMaterial.metalness = 0.02;
  nextMaterial.transparent = true;
  nextMaterial.opacity = 1;
  nextMaterial.needsUpdate = true;
  return nextMaterial;
}

function Astronaut({ scrollProgress }) {
  const groupRef = React.useRef();
  const { scene } = useGLTF("/models/astronaut.glb");
  const astronautTexture = useTexture("/textures/astronaut-4k.png");

  const astronaut = React.useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((object) => {
      if (!object.isMesh) {
        return;
      }

      object.castShadow = false;
      object.receiveShadow = false;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) =>
          configureAstronautMaterial(material, astronautTexture),
        );
        return;
      }

      object.material = configureAstronautMaterial(
        object.material,
        astronautTexture,
      );
    });

    return clonedScene;
  }, [astronautTexture, scene]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const drift = Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
    const verticalTravel = THREE.MathUtils.lerp(0.35, -0.35, scrollProgress);
    const appear = THREE.MathUtils.smoothstep(scrollProgress, 0.62, 0.72);
    const disappear = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.84, 0.9);
    const visibility = appear * disappear;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      2.7,
      0.08,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      verticalTravel + drift,
      0.08,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      -0.55,
      0.08,
    );
    groupRef.current.scale.setScalar(1.7 * THREE.MathUtils.lerp(0.08, 1, visibility));
    groupRef.current.visible = visibility > 0.02;
    groupRef.current.traverse((object) => {
      if (!object.isMesh || !object.material) {
        return;
      }

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          material.opacity = visibility;
        });
        return;
      }

      object.material.opacity = visibility;
    });
  });

  return (
    <group
      ref={groupRef}
      scale={1.7}
      position={[2.7, 0.1, -0.55]}
      rotation={[0, 0.45, 0.04]}
    >
      <primitive object={astronaut} />
    </group>
  );
}

useGLTF.preload("/models/astronaut.glb");

export default Astronaut;