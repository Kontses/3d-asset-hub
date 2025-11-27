import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Model3DViewer } from "@/components/Model3DViewer";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Maximize2, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PreviewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ product, open, onOpenChange }: PreviewDialogProps) => {
  if (!product) return null;

  const handleShare = () => {
    // Mock share functionality
    const shareUrl = `${window.location.origin}/view/${product.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  };

  const handleDownload = () => {
    toast.success("Download started");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {product.configurations?.length || 0} {product.configurations?.length === 1 ? "configuration" : "configurations"}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 relative rounded-lg overflow-hidden border border-border bg-secondary">
          {product.glb_file_path ? (
            <Model3DViewer modelUrl={product.glb_file_path} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Maximize2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No 3D model available</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Created {new Date(product.created_at).toLocaleDateString()}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
