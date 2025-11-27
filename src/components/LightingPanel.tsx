import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface LightingPanelProps {
  ambientIntensity: number;
  spotlightIntensity: number;
  spotlightPosition: [number, number, number];
  spotlightColor: string;
  onAmbientIntensityChange: (value: number) => void;
  onSpotlightIntensityChange: (value: number) => void;
  onSpotlightPositionChange: (position: [number, number, number]) => void;
  onSpotlightColorChange: (color: string) => void;
}

export const LightingPanel = ({
  ambientIntensity,
  spotlightIntensity,
  spotlightPosition,
  spotlightColor,
  onAmbientIntensityChange,
  onSpotlightIntensityChange,
  onSpotlightPositionChange,
  onSpotlightColorChange,
}: LightingPanelProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        Lighting
      </h3>

      {/* Ambient Light */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Ambient Intensity</Label>
          <span className="text-xs font-mono">{ambientIntensity.toFixed(2)}</span>
        </div>
        <Slider
          value={[ambientIntensity]}
          onValueChange={([value]) => onAmbientIntensityChange(value)}
          min={0}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>

      {/* Spotlight */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Spotlight</Label>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Intensity</Label>
            <span className="text-xs font-mono">{spotlightIntensity.toFixed(2)}</span>
          </div>
          <Slider
            value={[spotlightIntensity]}
            onValueChange={([value]) => onSpotlightIntensityChange(value)}
            min={0}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={spotlightColor}
              onChange={(e) => onSpotlightColorChange(e.target.value)}
              className="h-10 w-20 p-1"
            />
            <Input
              type="text"
              value={spotlightColor}
              onChange={(e) => onSpotlightColorChange(e.target.value)}
              className="h-10 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Position</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                step="1"
                value={spotlightPosition[0]}
                onChange={(e) => onSpotlightPositionChange([parseFloat(e.target.value), spotlightPosition[1], spotlightPosition[2]])}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                step="1"
                value={spotlightPosition[1]}
                onChange={(e) => onSpotlightPositionChange([spotlightPosition[0], parseFloat(e.target.value), spotlightPosition[2]])}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Z</Label>
              <Input
                type="number"
                step="1"
                value={spotlightPosition[2]}
                onChange={(e) => onSpotlightPositionChange([spotlightPosition[0], spotlightPosition[1], parseFloat(e.target.value)])}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
