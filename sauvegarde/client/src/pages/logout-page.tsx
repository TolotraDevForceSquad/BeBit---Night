import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        </h1>
        
        <div className="bg-card rounded-lg p-8 shadow-lg border border-border mb-4">
          <h2 className="text-xl font-semibold mb-4">Déconnexion</h2>
          <p className="mb-6 text-muted-foreground">
            Cliquez sur le bouton ci-dessous pour vous déconnecter de votre compte.
          </p>
          
          <Button 
            variant="destructive"
            size="lg"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Be bit. | Tous droits réservés
        </p>
      </div>
    </div>
  );
}