import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Wallet,
  Settings, User, PartyPopper, Users, LogOut, CalendarPlus, Plus
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  activeItem?: string;
}

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

export default function MobileNavigation({ activeItem }: MobileNavigationProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  
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

  // Définir les éléments de navigation en fonction du rôle
  const getNavigationItems = () => {
    // Utilisateur standard
    if (user?.role === 'user') {
      return [
        { icon: <Home size={24} />, label: "Explorer", href: "/swipe" },
        { icon: <PartyPopper size={24} />, label: "Mes Sorties", href: "/user/events" },
        { 
          icon: (
            <div className="relative rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background -mt-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          ), 
          label: "Créer", 
          href: "/user/events/create" 
        },
        { icon: <Calendar size={24} />, label: "Tickets", href: "/user/tickets" },
        { icon: <Wallet size={24} />, label: "Wallet", href: "/user/wallet" },
        { icon: <Search size={24} />, label: "Recherche", href: "/user/search-artists" },
        { icon: <User size={24} />, label: "Profil", href: "/user/profile" },
      ];
    }
    
    // Artiste
    if (user?.role === 'artist') {
      return [
        { icon: <Home size={24} />, label: "Events", href: "/artist" },
        { icon: <Calendar size={24} />, label: "Agenda", href: "/artist/agenda" },
        { icon: <Wallet size={24} />, label: "Wallet", href: "/artist/wallet" },
        { icon: <User size={24} />, label: "Profil", href: "/artist/profile" },
        { icon: <Settings size={24} />, label: "Réglages", href: "/artist/settings" },
      ];
    }
    
    // Club
    if (user?.role === 'club') {
      return [
        { icon: <Home size={24} />, label: "Events", href: "/club" },
        { icon: <Search size={24} />, label: "Artistes", href: "/club/find-artists" },
        { icon: <Users size={24} />, label: "Participants", href: "/club/attendees" },
        { icon: <Wallet size={24} />, label: "Wallet", href: "/club/wallet" },
        { icon: <Settings size={24} />, label: "Réglages", href: "/club/settings" },
      ];
    }
    
    // Admin
    if (user?.role === 'admin') {
      return [
        { icon: <Home size={24} />, label: "Dashboard", href: "/admin" },
        { icon: <Calendar size={24} />, label: "Events", href: "/admin/events" },
        { icon: <User size={24} />, label: "Users", href: "/admin/users" },
        { icon: <Settings size={24} />, label: "Réglages", href: "/admin/settings" },
      ];
    }
    
    // Par défaut, retourner la navigation utilisateur
    return [
      { icon: <Home size={24} />, label: "Explorer", href: "/" },
      { icon: <PartyPopper size={24} />, label: "Mes Sorties", href: "/user/events" },
      { 
        icon: (
          <div className="relative rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background -mt-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        ), 
        label: "Créer", 
        href: "/user/events/create" 
      },
      { icon: <Calendar size={24} />, label: "Tickets", href: "/user/tickets" },
      { icon: <Wallet size={24} />, label: "Wallet", href: "/user/wallet" },
      { icon: <Search size={24} />, label: "Recherche", href: "/user/search-artists" },
      { icon: <User size={24} />, label: "Profil", href: "/user/profile" },
    ];
  };
  
  // Fonction de déconnexion
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Mobile - Déconnexion en cours...");
    localStorage.removeItem('auth_user');
    console.log("Mobile - Local storage effacé, redirection...");
    setTimeout(() => {
      window.location.href = "/auth";
    }, 100);
  };

  const navigationItems = getNavigationItems();
  
  return (
    <div className="flex justify-around items-center p-2 relative">
      {navigationItems.slice(0, 4).map((item, index) => (
        <Link 
          key={item.href}
          href={item.href}
          className={`text-center ${item.label === "Créer" ? "absolute left-1/2 -translate-x-1/2 -top-4" : ""}`}
        >
          <div 
            className={`flex flex-col items-center py-2 px-4 rounded-lg ${
              activeItem === item.label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span className={`text-xs ${item.label === "Créer" ? "mt-2" : "mt-1"}`}>{item.label}</span>
          </div>
        </Link>
      ))}
      
      {/* Bouton de déconnexion */}
      <Link href="/logout" className="text-center">
        <Button
          variant="ghost"
          className="flex flex-col items-center p-0 h-auto bg-destructive/10 rounded-lg"
        >
          <div className="py-2 px-4">
            <LogOut size={24} className="text-destructive" />
            <span className="text-xs mt-1 text-destructive font-medium">Déconnexion</span>
          </div>
        </Button>
      </Link>
    </div>
  );
}