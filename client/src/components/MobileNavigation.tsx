import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Wallet,
  Settings, User, PartyPopper
} from "lucide-react";

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
        { icon: <Search size={24} />, label: "Artistes", href: "/club/artists" },
        { icon: <Calendar size={24} />, label: "Scanner", href: "/club/scan" },
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
  
  const navigationItems = getNavigationItems();
  
  return (
    <div className="flex justify-around items-center p-2">
      {navigationItems.map((item) => (
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
    </div>
  );
}