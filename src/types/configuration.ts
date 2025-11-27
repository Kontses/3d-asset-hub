export interface Configuration {
  id: string;
  product_id: string;
  name: string;
  variant_name: string;
  lighting: {
    ambientIntensity: number;
    spotlightIntensity: number;
    spotlightPosition: [number, number, number];
    spotlightColor: string;
  };
  materials: {
    color: string;
    metalness: number;
    roughness: number;
  };
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  share_token: string | null;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
