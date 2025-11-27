import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Model3DViewer } from "@/components/Model3DViewer";
import { Maximize2, Share2, Loader2 } from "lucide-react";
import { useConfigurationByToken } from "@/hooks/useConfigurations";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const ViewerPage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { data: configData, isLoading, error } = useConfigurationByToken(shareToken || "");

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error || !configData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Configuration not found</p>
          <p className="text-muted-foreground mb-4">
            This configuration may not exist or is not publicly shared.
          </p>
        </div>
      </div>
    );
  }

  const configuration = configData as any; // Type assertion for now
  const product = configuration.products;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{configuration.name}</h1>
              <p className="text-sm text-muted-foreground">
                {product?.name || "Interactive 3D Viewer"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleFullscreen} className="gap-2">
                <Maximize2 className="w-4 h-4" />
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 p-6">
        <div className="h-full rounded-lg overflow-hidden border border-border shadow-glow">
          {product?.glb_file_path && (
            <Model3DViewer
              modelUrl={product.glb_file_path}
              initialPosition={configuration.transform?.position}
              initialRotation={configuration.transform?.rotation}
              initialScale={configuration.transform?.scale}
              materialColor={configuration.materials?.color}
              metalness={configuration.materials?.metalness}
              roughness={configuration.materials?.roughness}
              ambientIntensity={configuration.lighting?.ambientIntensity}
              spotlightIntensity={configuration.lighting?.spotlightIntensity}
              spotlightPosition={configuration.lighting?.spotlightPosition}
              spotlightColor={configuration.lighting?.spotlightColor}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Powered by 3D AR Studio</p>
            <div className="flex gap-4">
              <button className="hover:text-foreground transition-colors">
                AR View
              </button>
              <button className="hover:text-foreground transition-colors">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
