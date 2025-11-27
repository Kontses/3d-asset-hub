import { Button } from "@/components/ui/button";
import { Trash2, FolderInput, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionsBarProps {
  selectedCount: number;
  onMove?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const BulkActionsBar = ({
  selectedCount,
  onMove,
  onDelete,
  onShare,
  onCancel,
  className,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2",
        className
      )}
    >
      <div className="bg-card border border-border rounded-lg shadow-glow p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 px-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-semibold text-foreground">
            {selectedCount} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onMove} className="gap-2">
            <FolderInput className="w-4 h-4" />
            Move to
          </Button>
          <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="gap-2 text-destructive">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
