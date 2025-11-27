import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialPanelProps {
  color: string;
  metalness: number;
  roughness: number;
  onColorChange: (color: string) => void;
  onMetalnessChange: (value: number) => void;
  onRoughnessChange: (value: number) => void;
  onReset: () => void;
}

export const MaterialPanel = ({
  color,
  metalness,
  roughness,
  onColorChange,
  onMetalnessChange,
  onRoughnessChange,
  onReset,
}: MaterialPanelProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Palette className="w-4 h-4 text-primary" />
        Material
      </h3>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-10 w-20 p-1"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-10 font-mono text-xs"
          />
        </div>
      </div>

      {/* Metalness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Metalness</Label>
          <span className="text-xs font-mono">{metalness.toFixed(2)}</span>
        </div>
        <Slider
          value={[metalness]}
          onValueChange={([value]) => onMetalnessChange(value)}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          How metallic the material appears
        </p>
      </div>

      {/* Roughness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Roughness</Label>
          <span className="text-xs font-mono">{roughness.toFixed(2)}</span>
        </div>
        <Slider
          value={[roughness]}
          onValueChange={([value]) => onRoughnessChange(value)}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Surface roughness (0 = mirror, 1 = matte)
        </p>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} className="w-full">
        Reset Material
      </Button>
    </Card>
  );
};
