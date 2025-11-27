import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Folder } from "@/types/folder";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MoveToFolderDialogProps {
  folders: Folder[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (folderId: string | null) => void;
  currentFolderId?: string | null;
}

export const MoveToFolderDialog = ({
  folders,
  open,
  onOpenChange,
  onMove,
  currentFolderId,
}: MoveToFolderDialogProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleMove = () => {
    onMove(selectedFolderId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* Root folder option */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
              selectedFolderId === null
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-secondary"
            )}
          >
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Root</p>
              <p className="text-xs text-muted-foreground">Move to root folder</p>
            </div>
          </button>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2 pr-4">
              {folders
                .filter(f => f.id !== currentFolderId)
                .map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                      selectedFolderId === folder.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary"
                    )}
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Folder
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleMove}>
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
