import { useState } from "react";
import { Folder } from "@/types/folder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FolderOpen, Pencil, Trash2, FolderInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FolderCardProps {
  folder: Folder;
  viewType: "grid" | "list";
  onOpen?: (folder: Folder) => void;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
  isSelected?: boolean;
  onSelect?: (folder: Folder) => void;
  isDragging?: boolean;
}

export const FolderCard = ({
  folder,
  viewType,
  onOpen,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
}: FolderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `folder-${folder.id}` });

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
        onClick={() => onSelect?.(folder)}
        onDoubleClick={() => onOpen?.(folder)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{folder.name}</h3>
          <p className="text-sm text-muted-foreground">
            0 items
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpen?.(folder)}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(folder)}>
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(folder)} className="text-destructive">
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
      onClick={() => onSelect?.(folder)}
      onDoubleClick={() => onOpen?.(folder)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-gradient-primary flex items-center justify-center relative">
        <FolderOpen className="w-16 h-16 text-primary-foreground" />
        
        {isSelected && (
          <div className="absolute top-2 left-2 bg-background text-foreground px-2 py-1 rounded-md text-xs font-semibold border border-primary">
            ✓ Selected
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{folder.name}</h3>
            <p className="text-sm text-muted-foreground">
              0 items
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen?.(folder)}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(folder)} className="text-destructive">
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
