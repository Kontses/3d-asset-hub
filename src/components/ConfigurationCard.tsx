import { useState } from "react";
import { Configuration } from "@/types/configuration";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, Copy, Trash2, Share2, ExternalLink } from "lucide-react";
import { Model3DPreview } from "@/components/Model3DPreview";
import { cn } from "@/lib/utils";

interface ConfigurationCardProps {
  configuration: Configuration;
  productGlbPath?: string;
  onView?: (config: Configuration) => void;
  onEdit?: (config: Configuration) => void;
  onDuplicate?: (config: Configuration) => void;
  onDelete?: (config: Configuration) => void;
  onShare?: (config: Configuration) => void;
  isSelected?: boolean;
  onSelect?: (config: Configuration) => void;
}

export const ConfigurationCard = ({
  configuration,
  productGlbPath,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onShare,
  isSelected,
  onSelect,
}: ConfigurationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-card border transition-all duration-300 cursor-pointer hover:shadow-glow",
        isSelected ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
      )}
      onClick={() => onSelect?.(configuration)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-secondary overflow-hidden relative">
        {productGlbPath && <Model3DPreview modelUrl={productGlbPath} />}
        
        <div className={cn(
          "absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              onView?.(configuration);
            }}
            className="shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(configuration);
            }}
            className="shadow-lg"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(configuration);
            }}
            className="shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
            Selected
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{configuration.name}</h3>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(configuration.updated_at).toLocaleDateString()}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(configuration)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(configuration)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(configuration)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(configuration)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(configuration)} className="text-destructive">
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
