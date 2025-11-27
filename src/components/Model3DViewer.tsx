import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Model3DViewerProps {
  modelUrl: string;
  initialPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  initialScale?: [number, number, number];
  materialColor?: string;
  metalness?: number;
  roughness?: number;
  ambientIntensity?: number;
  spotlightIntensity?: number;
  spotlightPosition?: [number, number, number];
  spotlightColor?: string;
}

const Model = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color,
  metalness = 0.5,
  roughness = 0.5,
}: {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
}) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  // Apply material properties if color is provided
  useEffect(() => {
    if (color) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: metalness,
            roughness: roughness,
          });
        }
      });
    }
  }, [scene, color, metalness, roughness]);

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};

export const Model3DViewer = ({
  modelUrl,
  initialPosition,
  initialRotation,
  initialScale,
  materialColor,
  metalness,
  roughness,
  ambientIntensity = 0.5,
  spotlightIntensity = 1,
  spotlightPosition = [10, 10, 10],
  spotlightColor = "#ffffff",
}: Model3DViewerProps) => {
  return (
    <div className="w-full h-full relative bg-secondary rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={ambientIntensity} />
          <spotLight
            position={spotlightPosition}
            angle={0.3}
            penumbra={1}
            intensity={spotlightIntensity}
            color={spotlightColor}
            castShadow
          />
          
          <Model
            url={modelUrl}
            position={initialPosition}
            rotation={initialRotation}
            scale={initialScale}
            color={materialColor}
            metalness={metalness}
            roughness={roughness}
          />
          
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
          
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
        Click + drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};
