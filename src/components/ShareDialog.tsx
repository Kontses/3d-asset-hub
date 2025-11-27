import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Configuration } from "@/types/configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Code, QrCode, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareDialogProps {
  configuration: Configuration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog = ({ configuration, open, onOpenChange }: ShareDialogProps) => {
  if (!configuration) return null;

  const shareUrl = `${window.location.origin}/view/${configuration.share_token || configuration.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Configuration</DialogTitle>
          <DialogDescription>
            Share "{configuration.name}" with your clients
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Shareable Link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(shareUrl, "Link")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view the 3D model
              </p>
            </div>

            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Interactive 3D viewer</li>
                <li>• AR support on compatible devices</li>
                <li>• Optimized for mobile and desktop</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Embed Code</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input value={embedCode} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(embedCode, "Embed code")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this code to embed the 3D viewer on your website
              </p>
            </div>

            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Integration
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Works on any HTML page</li>
                <li>• Responsive iframe</li>
                <li>• No external dependencies</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center p-8 bg-secondary rounded-lg">
              <div className="w-48 h-48 bg-background border-2 border-border rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                QR code generation coming soon
              </p>
            </div>
            
            <Button variant="outline" className="w-full gap-2" disabled>
              <Copy className="w-4 h-4" />
              Download QR Code
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
