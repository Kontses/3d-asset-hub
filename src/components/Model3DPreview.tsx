import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { Box } from "lucide-react";

interface Model3DPreviewProps {
  modelUrl?: string;
  className?: string;
}

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

export const Model3DPreview = ({ modelUrl, className }: Model3DPreviewProps) => {
  if (!modelUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-secondary ${className}`}>
        <Box className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          
          <Model url={modelUrl} />
          
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
            far={2}
          />
          
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
