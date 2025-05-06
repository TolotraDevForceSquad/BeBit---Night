import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Wallet,
  Settings, User, PartyPopper, Users, LogOut
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
        { icon: <Home size={24} />, label: "Explorer", href: "/" },
        { icon: <PartyPopper size={24} />, label: "Sorties", href: "/user/events" },
        { icon: <Calendar size={24} />, label: "Tickets", href: "/user/tickets" },
        { icon: <Wallet size={24} />, label: "Wallet", href: "/user/wallet" },
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
      { icon: <PartyPopper size={24} />, label: "Sorties", href: "/user/events" },
      { icon: <Calendar size={24} />, label: "Tickets", href: "/user/tickets" },
      { icon: <Wallet size={24} />, label: "Wallet", href: "/user/wallet" },
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
    <div className="flex justify-around items-center p-2">
      {navigationItems.slice(0, 4).map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          className="text-center"
        >
          <div 
            className={`flex flex-col items-center py-2 px-4 rounded-lg ${
              activeItem === item.label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </div>
        </Link>
      ))}
      
      {/* Menu contextuel pour les options supplémentaires */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="text-center">
            <div
              className={`flex flex-col items-center py-2 px-4 rounded-lg ${
                activeItem === "réglages"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Settings size={24} />
              <span className="text-xs mt-1">Plus</span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px]">
          <div className="py-4 flex flex-col gap-2">
            <h3 className="font-semibold text-lg mb-4">Menu</h3>
            
            {/* Lien vers les paramètres */}
            <Link 
              href="/settings"
              className="w-full"
            >
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="h-5 w-5 mr-2" />
                <span>Paramètres</span>
              </Button>
            </Link>
            
            {/* Bouton de déconnexion */}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}