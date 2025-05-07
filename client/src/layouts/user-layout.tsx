import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { isMobile } = useMobile();
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
      if (userData.role !== 'user') {
        console.error('Accès non autorisé: rôle utilisateur requis');
        window.location.href = "/auth";
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
        {children}
      </div>
      
      {/* Navigation mobile */}
      {isMobile && <div className="fixed bottom-0 w-full">
        <MobileNavigation activeItem={activeItem} />
      </div>}
    </div>
  );
}