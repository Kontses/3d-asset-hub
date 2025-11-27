import { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, TransformControls as DreiTransformControls } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

interface EditorSceneProps {
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  materialColor: string;
  metalness: number;
  roughness: number;
  ambientIntensity: number;
  spotlightIntensity: number;
  spotlightPosition: [number, number, number];
  spotlightColor: string;
  transformMode: "translate" | "rotate" | "scale";
  onTransformChange: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
}

const Model = ({
  url,
  position,
  rotation,
  scale,
  color,
  metalness,
  roughness,
  transformMode,
  onTransformChange,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  transformMode: "translate" | "rotate" | "scale";
  onTransformChange: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
}) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  const transformRef = useRef<any>(null);

  // Apply material properties
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: color,
          metalness: metalness,
          roughness: roughness,
        });
      }
    });
  }, [scene, color, metalness, roughness]);

  return (
    <>
      <DreiTransformControls
        ref={transformRef}
        mode={transformMode}
        onObjectChange={() => {
          if (meshRef.current) {
            onTransformChange(
              [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z],
              [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z],
              [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z]
            );
          }
        }}
      >
        <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
          <primitive object={scene} />
        </group>
      </DreiTransformControls>
    </>
  );
};

export const EditorScene = ({
  modelUrl,
  position,
  rotation,
  scale,
  materialColor,
  metalness,
  roughness,
  ambientIntensity,
  spotlightIntensity,
  spotlightPosition,
  spotlightColor,
  transformMode,
  onTransformChange,
}: EditorSceneProps) => {
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
            position={position}
            rotation={rotation}
            scale={scale}
            color={materialColor}
            metalness={metalness}
            roughness={roughness}
            transformMode={transformMode}
            onTransformChange={onTransformChange}
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
            makeDefault
            minDistance={2}
            maxDistance={20}
          />
          
          <gridHelper args={[20, 20, '#444444', '#222222']} position={[0, -1, 0]} />
        </Suspense>
      </Canvas>
      
      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 space-y-1">
        <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
          <span className="font-semibold text-primary">Orbit:</span> Right-click + drag
        </div>
        <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
          <span className="font-semibold text-primary">Transform:</span> Drag gizmo arrows
        </div>
      </div>
      
      {/* Grid Legend */}
      <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
        Grid: 1 unit = 1 meter
      </div>
    </div>
  );
};
