import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Configuration } from "@/types/configuration";
import { ConfigurationCard } from "@/components/ConfigurationCard";
import { ProductSelectorDialog } from "@/components/ProductSelectorDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useConfigurations, useDeleteConfiguration } from "@/hooks/useConfigurations";
import { useProduct } from "@/hooks/useProducts";

const Configurations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName") || "Product";

  const [shareConfig, setShareConfig] = useState<Configuration | null>(null);
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Fetch data from Supabase
  const { data: configurations = [] } = useConfigurations(productId || undefined);
  const { data: product } = useProduct(productId || "");
  const deleteConfigMutation = useDeleteConfiguration();

  const handleSelect = (config: Configuration) => {
    setSelectedConfigs(prev => 
      prev.includes(config.id) 
        ? prev.filter(id => id !== config.id)
        : [...prev, config.id]
    );
  };

  const handleEdit = (config: Configuration) => {
    navigate(`/editor?configId=${config.id}&productId=${product?.id}`);
  };

  const handleDuplicate = (config: Configuration) => {
    // TODO: Implement duplication logic
    console.log("Duplicate config:", config.id);
  };

  const handleDelete = (config: Configuration) => {
    deleteConfigMutation.mutate(config.id);
  };

  const handleShare = (config: Configuration) => {
    setShareConfig(config);
  };

  const handleView = (config: Configuration) => {
    if (config.share_token) {
      window.open(`/view/${config.share_token}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {productName}
            </h1>
            <p className="text-muted-foreground mt-2">
              {configurations.length} {configurations.length === 1 ? "configuration" : "configurations"}
            </p>
          </div>

          <Button onClick={() => setSelectorOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Configuration
          </Button>
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {configurations.map((config) => (
            <ConfigurationCard
              key={config.id}
              configuration={config}
              productGlbPath={product?.glb_file_path}
              onView={handleView}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onShare={handleShare}
              isSelected={selectedConfigs.includes(config.id)}
              onSelect={handleSelect}
            />
          ))}

          {configurations.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No configurations yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first configuration to start customizing this product.
              </p>
              <Button onClick={() => setSelectorOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Configuration
              </Button>
            </div>
          )}
        </div>

        {/* Dialogs */}
        {product && (
          <ProductSelectorDialog
            open={selectorOpen}
            onOpenChange={setSelectorOpen}
            product={product}
            onSelect={(variant) => {
              navigate(`/editor?productId=${product.id}&variant=${encodeURIComponent(variant)}`);
            }}
          />
        )}
        
        <ShareDialog
          configuration={shareConfig}
          open={!!shareConfig}
          onOpenChange={(open) => !open && setShareConfig(null)}
        />
      </div>
    </div>
  );
};

export default Configurations;
