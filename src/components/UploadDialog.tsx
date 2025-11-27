import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileUp, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadGLBFile, UploadProgress } from "@/services/storage";
import { useCreateProduct } from "@/hooks/useProducts";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string | null;
}

export const UploadDialog = ({ open, onOpenChange, folderId }: UploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProductMutation = useCreateProduct();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.name.toLowerCase().endsWith('.glb')) {
      setFile(selectedFile);
      setUploadError(null);
      setUploadSuccess(false);
      
      // Auto-fill product name from filename if empty
      if (!productName) {
        const name = selectedFile.name.replace('.glb', '').replace(/[_-]/g, ' ');
        setProductName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    } else {
      setUploadError('Please select a valid GLB file');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  }, [productName]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !productName.trim()) {
      setUploadError('Please provide a file and product name');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Upload file to Supabase Storage
      const fileUrl = await uploadGLBFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Create product in database
      await createProductMutation.mutateAsync({
        name: productName.trim(),
        description: description.trim() || null,
        folder_id: folderId || null,
        glb_file_path: fileUrl,
        thumbnail_url: null,
      });

      setUploadSuccess(true);
      
      // Close dialog after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setProductName("");
      setDescription("");
      setUploadProgress(null);
      setUploadError(null);
      setUploadSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload 3D Model</DialogTitle>
          <DialogDescription>
            Upload a GLB file to create a new product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
              isDragging
                ? "border-primary bg-primary/10"
                : file
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              {file ? (
                <>
                  <FileUp className="w-12 h-12 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {!isUploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Drop your GLB file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-semibold">{uploadProgress.percentage}%</span>
              </div>
              <Progress value={uploadProgress.percentage} className="h-2" />
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-primary">
                Product created successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{uploadError}</p>
            </div>
          )}

          {/* Product Details */}
          {!uploadSuccess && (
            <>
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Modern Chair"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the product"
                  disabled={isUploading}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {!uploadSuccess && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !productName.trim() || isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
