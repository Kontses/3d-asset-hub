import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Folder as FolderType } from "@/types/folder";
import { ProductCard } from "@/components/ProductCard";
import { FolderCard } from "@/components/FolderCard";
import { UploadDialog } from "@/components/UploadDialog";
import { PreviewDialog } from "@/components/PreviewDialog";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { MoveToFolderDialog } from "@/components/MoveToFolderDialog";
import { BulkActionsBar } from "@/components/BulkActionsBar";
import { FolderBreadcrumb } from "@/components/FolderBreadcrumb";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Grid3x3, List, Search, FolderPlus, Upload, Box } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useFolders, useCreateFolder, useDeleteFolder, useMoveFolder } from "@/hooks/useFolders";
import { useProducts, useDeleteProduct, useMoveProduct } from "@/hooks/useProducts";

const Products = () => {
  const navigate = useNavigate();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [moveToFolderOpen, setMoveToFolderOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  // Fetch data from Supabase
  const { data: allFolders = [] } = useFolders();
  const { data: products = [] } = useProducts(currentFolderId);
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const moveFolderMutation = useMoveFolder();
  const deleteProductMutation = useDeleteProduct();
  const moveProductMutation = useMoveProduct();

  // Get current folder and path
  const currentFolder = allFolders.find(f => f.id === currentFolderId) || null;
  const folderPath: FolderType[] = [];
  let tempFolder = currentFolder;
  while (tempFolder) {
    folderPath.unshift(tempFolder);
    tempFolder = allFolders.find(f => f.id === tempFolder?.parent_id) || null;
  }

  // Filter items
  const currentFolders = allFolders.filter(f =>
    f.parent_id === currentFolderId &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSelected = selectedProducts.length + selectedFolders.length;

  // Handlers
  const handleView = (product: Product) => {
    navigate(`/configurations?productId=${product.id}&productName=${encodeURIComponent(product.name)}`);
  };

  const handleEdit = (product: Product) => {
    navigate(`/editor?id=${product.id}&name=${encodeURIComponent(product.name)}`);
  };

  const handleDelete = (product: Product) => {
    deleteProductMutation.mutate(product.id);
  };

  const handleDuplicate = (product: Product) => {
    // TODO: Implement duplication logic
    console.log("Duplicate product:", product.id);
  };

  // Upload is now handled by UploadDialog component

  // Folder handlers
  const handleCreateFolder = (name: string) => {
    createFolderMutation.mutate({ name, parentId: currentFolderId });
    setCreateFolderOpen(false);
  };

  const handleOpenFolder = (folder: FolderType) => {
    setCurrentFolderId(folder.id);
    setSelectedProducts([]);
    setSelectedFolders([]);
  };

  const handleDeleteFolder = (folder: FolderType) => {
    deleteFolderMutation.mutate(folder.id);
  };

  // Selection handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProducts(prev =>
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleSelectFolder = (folder: FolderType) => {
    setSelectedFolders(prev =>
      prev.includes(folder.id)
        ? prev.filter(id => id !== folder.id)
        : [...prev, folder.id]
    );
  };

  // Bulk operations
  const handleBulkMove = () => {
    setMoveToFolderOpen(true);
  };

  const handleMove = (targetFolderId: string | null) => {
    selectedProducts.forEach(productId => {
      moveProductMutation.mutate({ productId, folderId: targetFolderId });
    });
    selectedFolders.forEach(folderId => {
      moveFolderMutation.mutate({ folderId, targetFolderId });
    });
    setSelectedProducts([]);
    setSelectedFolders([]);
    setMoveToFolderOpen(false);
  };

  const handleBulkDelete = () => {
    selectedProducts.forEach(productId => {
      deleteProductMutation.mutate(productId);
    });
    selectedFolders.forEach(folderId => {
      deleteFolderMutation.mutate(folderId);
    });
    setSelectedProducts([]);
    setSelectedFolders([]);
  };

  const handleBulkShare = () => {
    // TODO: Implement bulk share
    console.log("Share items");
  };

  // Drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Handle reordering logic here
    console.log("Drag end:", active.id, over.id);
  };

  const allItems = [
    ...currentFolders.map(f => `folder-${f.id}`),
    ...currentProducts.map(p => `product-${p.id}`),
  ];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your 3D models and collections
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <Button variant="outline" onClick={() => setCreateFolderOpen(true)} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
              <Button onClick={() => setUploadOpen(true)} className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Model
              </Button>
              <UserMenu />
            </div>
          </div>

          {/* Breadcrumb */}
          {currentFolderId && (
            <FolderBreadcrumb
              path={folderPath}
              onNavigate={(folder) => setCurrentFolderId(folder?.id || null)}
            />
          )}

          {/* Add missing import */}
          <div className="hidden">
            <Box className="w-0 h-0" />
          </div>

          {/* Search and View Toggle */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          <SortableContext items={allItems} strategy={rectSortingStrategy}>
            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-3"
              }
            >
              {currentFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  viewType={viewType}
                  onOpen={handleOpenFolder}
                  onDelete={handleDeleteFolder}
                  isSelected={selectedFolders.includes(folder.id)}
                  onSelect={handleSelectFolder}
                />
              ))}

              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewType={viewType}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={handleSelectProduct}
                />
              ))}

              {currentFolders.length === 0 && currentProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Box className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    {searchQuery
                      ? "No products or folders match your search."
                      : "Get started by uploading your first 3D model or creating a folder."}
                  </p>
                  {!searchQuery && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCreateFolderOpen(true)}
                        className="gap-2"
                      >
                        <FolderPlus className="w-4 h-4" />
                        Create Folder
                      </Button>
                      <Button onClick={() => setUploadOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Upload Model
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SortableContext>
        </div>

        {/* Dialogs */}
        <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} folderId={currentFolderId} />
        <CreateFolderDialog
          open={createFolderOpen}
          onOpenChange={setCreateFolderOpen}
          onCreate={handleCreateFolder}
        />
        <MoveToFolderDialog
          open={moveToFolderOpen}
          onOpenChange={setMoveToFolderOpen}
          folders={allFolders}
          currentFolderId={currentFolderId}
          onMove={handleMove}
        />
        {previewProduct && (
          <PreviewDialog
            product={previewProduct}
            open={!!previewProduct}
            onOpenChange={(open) => !open && setPreviewProduct(null)}
          />
        )}

        {/* Bulk Actions Bar */}
        {totalSelected > 0 && (
          <BulkActionsBar
            selectedCount={totalSelected}
            onMove={handleBulkMove}
            onDelete={handleBulkDelete}
            onShare={handleBulkShare}
            onCancel={() => {
              setSelectedProducts([]);
              setSelectedFolders([]);
            }}
          />
        )}
      </div>
    </DndContext>
  );
};

export default Products;
