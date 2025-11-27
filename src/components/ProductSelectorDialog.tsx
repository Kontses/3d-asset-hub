import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Model3DViewer } from "@/components/Model3DViewer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductSelectorDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (variantName: string) => void;
}

// Common variant names for 3D products
const DEFAULT_VARIANTS = [
  { id: "default", name: "Default", description: "Standard product view" },
  { id: "variant-1", name: "Variant 1", description: "Custom variant" },
  { id: "variant-2", name: "Variant 2", description: "Alternative view" },
];

export const ProductSelectorDialog = ({
  product,
  open,
  onOpenChange,
  onSelect,
}: ProductSelectorDialogProps) => {
  const [selectedVariant, setSelectedVariant] = useState(DEFAULT_VARIANTS[0]);

  const handleSelect = () => {
    onSelect(selectedVariant.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>
            Select a variant to create a new configuration
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* 3D Viewer */}
          <div className="flex-1">
            <div className="h-full relative rounded-lg overflow-hidden border border-border bg-secondary">
              <Model3DViewer modelUrl={product.glb_file_path} />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="w-80 flex flex-col">
            <h3 className="text-sm font-semibold mb-4">Select Variant</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {DEFAULT_VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full flex flex-col gap-2 p-4 rounded-lg border transition-all text-left ${
                      selectedVariant.id === variant.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    <p className="font-medium">{variant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {variant.description}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t">
              <Button onClick={handleSelect} className="w-full">
                Create Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
