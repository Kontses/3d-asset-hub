import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Move, RotateCw, Maximize2 } from "lucide-react";

interface TransformPanelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  onPositionChange: (position: [number, number, number]) => void;
  onRotationChange: (rotation: [number, number, number]) => void;
  onScaleChange: (scale: [number, number, number]) => void;
}

export const TransformPanel = ({
  position,
  rotation,
  scale,
  onPositionChange,
  onRotationChange,
  onScaleChange,
}: TransformPanelProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Move className="w-4 h-4 text-primary" />
        Transform
      </h3>

      {/* Position */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Position</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              step="0.1"
              value={position[0]}
              onChange={(e) => onPositionChange([parseFloat(e.target.value), position[1], position[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              step="0.1"
              value={position[1]}
              onChange={(e) => onPositionChange([position[0], parseFloat(e.target.value), position[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Z</Label>
            <Input
              type="number"
              step="0.1"
              value={position[2]}
              onChange={(e) => onPositionChange([position[0], position[1], parseFloat(e.target.value)])}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-2">
          <RotateCw className="w-3 h-3" />
          Rotation (degrees)
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              step="1"
              value={Math.round((rotation[0] * 180) / Math.PI)}
              onChange={(e) => onRotationChange([(parseFloat(e.target.value) * Math.PI) / 180, rotation[1], rotation[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              step="1"
              value={Math.round((rotation[1] * 180) / Math.PI)}
              onChange={(e) => onRotationChange([rotation[0], (parseFloat(e.target.value) * Math.PI) / 180, rotation[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Z</Label>
            <Input
              type="number"
              step="1"
              value={Math.round((rotation[2] * 180) / Math.PI)}
              onChange={(e) => onRotationChange([rotation[0], rotation[1], (parseFloat(e.target.value) * Math.PI) / 180])}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-2">
          <Maximize2 className="w-3 h-3" />
          Scale
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              step="0.1"
              value={scale[0]}
              onChange={(e) => onScaleChange([parseFloat(e.target.value), scale[1], scale[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              step="0.1"
              value={scale[1]}
              onChange={(e) => onScaleChange([scale[0], parseFloat(e.target.value), scale[2]])}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Z</Label>
            <Input
              type="number"
              step="0.1"
              value={scale[2]}
              onChange={(e) => onScaleChange([scale[0], scale[1], parseFloat(e.target.value)])}
              className="h-8"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onScaleChange([1, 1, 1])}
          className="w-full"
        >
          Reset Scale
        </Button>
      </div>
    </Card>
  );
};
