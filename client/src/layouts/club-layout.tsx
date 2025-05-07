import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";

interface ClubLayoutProps {
  children: React.ReactNode;
}

export default function ClubLayout({ children }: ClubLayoutProps) {
  const isMobile = useMobile();
  const [location] = useLocation();
  const [activeItem, setActiveItem] = useState<string>("");
  
  // Détermine l'élément actif en fonction de l'URL
  useEffect(() => {
    if (location === "/club") {
      setActiveItem("events");
    } else if (location.includes("/club/attendees")) {
      setActiveItem("participants");
    } else if (location.includes("/club/reservations")) {
      setActiveItem("réservations");
    } else if (location.includes("/club/find-artists")) {
      setActiveItem("artistes");
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
      if (userData.role !== 'club') {
        console.error('Accès non autorisé: rôle club requis');
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
        {/* Header avec nom de l'application */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-3 flex items-center justify-center">
          <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Be bit.
          </h1>
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