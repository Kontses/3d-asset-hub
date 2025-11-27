import { useState } from "react";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, Copy, Trash2, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { Model3DPreview } from "@/components/Model3DPreview";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProductCardProps {
  product: Product;
  viewType: "grid" | "list";
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  isSelected?: boolean;
  onSelect?: (product: Product) => void;
}

export const ProductCard = ({
  product,
  viewType,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  isSelected,
  onSelect,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `product-${product.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (viewType === "list") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "group flex items-center gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-all duration-300 cursor-pointer",
          isSelected ? "border-primary bg-primary/5" : "border-border"
        )}
        onClick={() => onSelect?.(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden">
          <Model3DPreview modelUrl={product.glb_file_path} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {product.configurations?.length || 0} {product.configurations?.length === 1 ? "configuration" : "configurations"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(product)}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(product)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(product)}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(product)} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative overflow-hidden bg-card border transition-all duration-300 cursor-pointer hover:shadow-glow",
        isSelected ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
      )}
      onClick={() => onSelect?.(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-secondary overflow-hidden relative group/preview">
        <Model3DPreview modelUrl={product.glb_file_path} />
        
        <div className={cn(
          "absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <Button size="sm" variant="secondary" onClick={() => onView?.(product)} className="shadow-lg">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onEdit?.(product)} className="shadow-lg">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        {/* Floating badge */}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
          {product.configurations?.length || 0}x
        </div>
        
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
            ✓ Selected
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.configurations?.length || 0} {product.configurations?.length === 1 ? "config" : "configs"}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(product)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(product)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(product)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(product)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};
