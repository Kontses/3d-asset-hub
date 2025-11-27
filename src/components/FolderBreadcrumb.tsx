import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Folder } from "@/types/folder";
import { Home } from "lucide-react";

interface FolderBreadcrumbProps {
  path: Folder[];
  onNavigate: (folder: Folder | null) => void;
}

export const FolderBreadcrumb = ({
  path,
  onNavigate,
}: FolderBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => onNavigate(null)}
            className="flex items-center gap-2 cursor-pointer hover:text-primary"
          >
            <Home className="w-4 h-4" />
            All Products
          </BreadcrumbLink>
        </BreadcrumbItem>

        {path.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === path.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => onNavigate(folder)}
                  className="cursor-pointer hover:text-primary"
                >
                  {folder.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
