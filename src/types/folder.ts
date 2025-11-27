export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type DraggableItem = 
  | { type: 'product'; id: string }
  | { type: 'folder'; id: string };
