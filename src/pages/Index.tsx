import { Button } from "@/components/ui/button";
import { Box, Upload, Settings, Link2, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">3D AR Studio</h2>
          {user ? (
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")} className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-6 shadow-glow">
            <Box className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            3D AR Studio
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload, manage, and share 3D models with your clients. 
            Create AR experiences that bring products to life.
          </p>

          <Button 
            size="lg" 
            onClick={() => navigate("/products")}
            className="gap-2 shadow-glow"
          >
            Get Started
            <Box className="w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload GLB Files</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop your 3D models. Support for GLB format with automatic optimization.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Edit & Configure</h3>
            <p className="text-muted-foreground text-sm">
              Create multiple configurations and variants. Customize materials, lighting, and more.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Share with Clients</h3>
            <p className="text-muted-foreground text-sm">
              Generate shareable links and embed codes. Give clients instant access to AR views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
