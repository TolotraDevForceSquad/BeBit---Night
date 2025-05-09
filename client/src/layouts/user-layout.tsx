import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const isMobile = useMobile();
  const [location] = useLocation();
  const [activeItem, setActiveItem] = useState<string>("");
  
  // Détermine l'élément actif en fonction de l'URL
  useEffect(() => {
    if (location === "/") {
      setActiveItem("explorer");
    } else if (location.includes("/user/events")) {
      setActiveItem("mes sorties");
    } else if (location.includes("/user/tickets")) {
      setActiveItem("tickets");
    } else if (location.includes("/user/wallet")) {
      setActiveItem("wallet");
    } else if (location.includes("/user/profile")) {
      setActiveItem("profil");
    } else if (location.includes("/user/search-artists")) {
      setActiveItem("recherche");
    }
  }, [location]);
  
  const checkAuth = () => {
    const user = localStorage.getItem('auth_user');
    if (!user) {
      window.location.href = "/auth";
      return null;
    }
    
    try {
      const userData = JSON.parse(user);
      // On permet l'accès à tous les types de compte (user, club, artist)
      // Seul admin est géré différemment
      if (userData.role === 'admin') {
        // Rediriger l'admin vers son dashboard
        window.location.href = "/admin";
        return null;
      }
      return userData;
    } catch (error) {
      console.error('Erreur lors de la lecture des données utilisateur:', error);
      localStorage.removeItem('auth_user');
      window.location.href = "/auth";
      return null;
    }
  };
  
  useEffect(() => {
    const user = checkAuth();
    if (!user) return;
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar pour desktop */}
      {!isMobile && <Sidebar activeItem={activeItem} />}
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        {/* Header pour toutes les pages */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-3 flex items-center justify-between mb-4">
          <div className="w-10"></div> {/* Espace vide pour équilibrer */}
          
          <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Be bit.
          </h1>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.location.href = "/user/settings"}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Paramètres"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('auth_user');
                window.location.href = "/auth";
              }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Déconnexion"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
        
        {children}
      </div>
      
      {/* Navigation mobile */}
      {isMobile && <div className="fixed bottom-0 w-full">
        <MobileNavigation activeItem={activeItem} />
      </div>}
    </div>
  );
}