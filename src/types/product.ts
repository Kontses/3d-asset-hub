import { Configuration } from "./configuration";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  folder_id: string | null;
  glb_file_path: string;
  thumbnail_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  configurations?: Configuration[];
}
