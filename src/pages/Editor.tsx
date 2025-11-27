import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EditorScene } from "@/components/EditorScene";
import { TransformPanel } from "@/components/TransformPanel";
import { LightingPanel } from "@/components/LightingPanel";
import { MaterialPanel } from "@/components/MaterialPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Move, RotateCw, Maximize2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProduct } from "@/hooks/useProducts";
import { useConfiguration, useCreateConfiguration, useUpdateConfiguration } from "@/hooks/useConfigurations";
import { toast } from "@/hooks/use-toast";

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const configId = searchParams.get("configId");
  const variantName = searchParams.get("variant") || "Default";

  // Fetch data
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId || "");
  const { data: existingConfig, isLoading: isLoadingConfig } = useConfiguration(configId || "");
  
  const createConfigMutation = useCreateConfiguration();
  const updateConfigMutation = useUpdateConfiguration();

  // Configuration name state
  const [configName, setConfigName] = useState("");

  // Transform state
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");

  // Material state
  const [materialColor, setMaterialColor] = useState("#ffffff");
  const [metalness, setMetalness] = useState(0.5);
  const [roughness, setRoughness] = useState(0.5);

  // Lighting state
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [spotlightIntensity, setSpotlightIntensity] = useState(1);
  const [spotlightPosition, setSpotlightPosition] = useState<[number, number, number]>([10, 10, 10]);
  const [spotlightColor, setSpotlightColor] = useState("#ffffff");

  const [isSaving, setIsSaving] = useState(false);

  // Load existing configuration if editing
  useEffect(() => {
    if (existingConfig) {
      setConfigName(existingConfig.name);
      setPosition(existingConfig.transform.position);
      setRotation(existingConfig.transform.rotation);
      setScale(existingConfig.transform.scale);
      setMaterialColor(existingConfig.materials.color);
      setMetalness(existingConfig.materials.metalness);
      setRoughness(existingConfig.materials.roughness);
      setAmbientIntensity(existingConfig.lighting.ambientIntensity);
      setSpotlightIntensity(existingConfig.lighting.spotlightIntensity);
      setSpotlightPosition(existingConfig.lighting.spotlightPosition);
      setSpotlightColor(existingConfig.lighting.spotlightColor);
    } else if (product) {
      // Set default name for new configuration
      setConfigName(`${product.name} - ${variantName}`);
    }
  }, [existingConfig, product, variantName]);

  const handleSave = async () => {
    if (!productId || !configName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a configuration name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const configData = {
        product_id: productId,
        name: configName.trim(),
        variant_name: variantName,
        transform: {
          position,
          rotation,
          scale,
        },
        materials: {
          color: materialColor,
          metalness,
          roughness,
        },
        lighting: {
          ambientIntensity,
          spotlightIntensity,
          spotlightPosition,
          spotlightColor,
        },
        is_public: false,
      };

      if (configId && existingConfig) {
        // Update existing configuration
        await updateConfigMutation.mutateAsync({
          id: configId,
          updates: configData,
        });
        
        toast({
          title: "Success",
          description: "Configuration updated successfully",
        });
      } else {
        // Create new configuration
        const newConfig = await createConfigMutation.mutateAsync(configData);
        
        toast({
          title: "Success",
          description: "Configuration created successfully",
        });

        // Navigate to edit the newly created configuration
        navigate(`/editor?productId=${productId}&configId=${newConfig.id}`, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransformChange = (
    newPosition: [number, number, number],
    newRotation: [number, number, number],
    newScale: [number, number, number]
  ) => {
    setPosition(newPosition);
    setRotation(newRotation);
    setScale(newScale);
  };

  const handleBack = () => {
    if (productId) {
      navigate(`/configurations?productId=${productId}&productName=${encodeURIComponent(product?.name || "Product")}`);
    } else {
      navigate("/products");
    }
  };

  if (isLoadingProduct || (configId && isLoadingConfig)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate("/products")}>Go to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {configId ? "Edit Configuration" : "New Configuration"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="config-name" className="text-sm">Name:</Label>
                <Input
                  id="config-name"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Configuration name"
                  className="w-64"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col gap-4">
            {/* Transform Mode Buttons */}
            <div className="flex gap-2">
              <Button
                variant={transformMode === "translate" ? "default" : "outline"}
                size="sm"
                onClick={() => setTransformMode("translate")}
                className="gap-2"
              >
                <Move className="w-4 h-4" />
                Move
              </Button>
              <Button
                variant={transformMode === "rotate" ? "default" : "outline"}
                size="sm"
                onClick={() => setTransformMode("rotate")}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Rotate
              </Button>
              <Button
                variant={transformMode === "scale" ? "default" : "outline"}
                size="sm"
                onClick={() => setTransformMode("scale")}
                className="gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Scale
              </Button>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 rounded-lg overflow-hidden border border-border shadow-glow">
              <EditorScene
                modelUrl={product.glb_file_path}
                position={position}
                rotation={rotation}
                scale={scale}
                materialColor={materialColor}
                metalness={metalness}
                roughness={roughness}
                ambientIntensity={ambientIntensity}
                spotlightIntensity={spotlightIntensity}
                spotlightPosition={spotlightPosition}
                spotlightColor={spotlightColor}
                transformMode={transformMode}
                onTransformChange={handleTransformChange}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings Panels */}
        <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto">
          <Tabs defaultValue="transform" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transform">Transform</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
            </TabsList>

            <TabsContent value="transform" className="space-y-4 mt-4">
              <TransformPanel
                position={position}
                rotation={rotation}
                scale={scale}
                onPositionChange={setPosition}
                onRotationChange={setRotation}
                onScaleChange={setScale}
              />
            </TabsContent>

            <TabsContent value="material" className="space-y-4 mt-4">
              <MaterialPanel
                color={materialColor}
                metalness={metalness}
                roughness={roughness}
                onColorChange={setMaterialColor}
                onMetalnessChange={setMetalness}
                onRoughnessChange={setRoughness}
                onReset={() => {
                  setMaterialColor("#ffffff");
                  setMetalness(0.5);
                  setRoughness(0.5);
                }}
              />
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4 mt-4">
              <LightingPanel
                ambientIntensity={ambientIntensity}
                spotlightIntensity={spotlightIntensity}
                spotlightPosition={spotlightPosition}
                spotlightColor={spotlightColor}
                onAmbientIntensityChange={setAmbientIntensity}
                onSpotlightIntensityChange={setSpotlightIntensity}
                onSpotlightPositionChange={setSpotlightPosition}
                onSpotlightColorChange={setSpotlightColor}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editor;
