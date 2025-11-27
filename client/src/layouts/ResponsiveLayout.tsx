import { ReactNode, useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  activeItem?: string;
  showNavigation?: boolean;
  sidebarContent?: ReactNode;
  headerContent?: ReactNode;
}

export default function ResponsiveLayout({
  children,
  activeItem,
  showNavigation = true,
  sidebarContent,
  headerContent
}: ResponsiveLayoutProps) {
  const isMobile = useMobile();
  const [user, setUser] = useState<any>(null);
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.location.href = "/auth";
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* En-tête mobile */}
      {isMobile && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm p-2 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Be bit.
            </h1>
          </div>
          
          {/* Bouton de déconnexion toujours visible */}
          {user && (
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span>Déconnexion</span>
            </Button>
          )}
          
          {headerContent}
        </header>
      )}
      
      {/* Contenu principal avec sidebar pour desktop */}
      <div className="flex-1 flex">
        {/* Sidebar pour la version desktop */}
        {!isMobile && showNavigation && (
          <aside className="hidden md:block w-64 border-r p-4 shrink-0">
            <Sidebar activeItem={activeItem} />
            
            {/* Contenu additionnel de la sidebar */}
            {sidebarContent && (
              <div className="mt-6">
                {sidebarContent}
              </div>
            )}
          </aside>
        )}
        
        {/* Contenu principal */}
        <main className="flex-1 p-4">
          {!isMobile && (
            <div className="sticky top-0 z-10 -mt-4 -mx-4 px-4 pt-4 pb-3 bg-background/80 backdrop-blur-sm border-b border-border mb-4 flex items-center justify-center">
              <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Be bit.
              </h1>
            </div>
          )}
          
          {/* En-tête desktop */}
          {!isMobile && headerContent && (
            <header className="mb-6">
              {headerContent}
            </header>
          )}
          
          {/* Contenu de la page */}
          <div>
            {children}
          </div>
        </main>
      </div>
      
      {/* Navigation mobile */}
      {isMobile && showNavigation && (
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur-sm">
          <MobileNavigation activeItem={activeItem} />
        </div>
      )}
    </div>
  );
}