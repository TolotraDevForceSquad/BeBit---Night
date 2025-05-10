import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Wallet, PieChart,
  Settings, User, PartyPopper, Users, LogOut, CalendarPlus, Plus,
  GlassWater, UtensilsCrossed, Music, Mic, Guitar, BellRing,
  Ticket, Headphones, Radio, Megaphone, Headset, HeadphonesIcon
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
        { icon: <Home size={24} />, label: "Explorer", href: "/user/explorer" },
        { 
          icon: (
            <div className="relative">
              <PartyPopper size={24} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">3</span>
              </div>
            </div>
          ), 
          label: "Mes Sorties", 
          href: "/user/events" 
        },
        { 
          icon: <Radio size={24} className="text-pink-500" />, 
          label: "Mes Artistes", 
          href: "/user/search-artists" 
        },
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
        { 
          icon: (
            <div className="relative">
              <BellRing size={24} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">2</span>
              </div>
            </div>
          ), 
          label: "Invitations", 
          href: "/user/invitations" 
        },
        { icon: <User size={24} />, label: "Profil", href: "/user/profile" },
        { icon: <UtensilsCrossed size={24} />, label: "Tables", href: "/user/table-reservation" },
      ];
    }
    
    // Artiste
    if (user?.role === 'artist') {
      return [
        { icon: <Home size={24} />, label: "Events", href: "/artist" },
        { icon: <PartyPopper size={24} />, label: "Invitations", href: "/artist/invitations" },
        { 
          icon: (
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          ), 
          label: "Créer", 
          href: "/artist/create-event" 
        },
        { icon: <Calendar size={24} />, label: "Agenda", href: "/artist/agenda" },
        { icon: <Search size={24} />, label: "Recherche", href: "/artist/find-clubs" },
      ];
    }
    
    // Club
    if (user?.role === 'club') {
      return [
        { icon: <Home size={24} />, label: "Dashboard", href: "/club" },
        { icon: <Users size={24} />, label: "Réservations", href: "/club/reservations" },
        { 
          icon: (
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          ), 
          label: "Créer", 
          href: "/club/create-event" 
        },
        { icon: <Calendar size={24} />, label: "Événements", href: "/club/events" },
        { icon: <Search size={24} />, label: "Artistes", href: "/club/find-artists" },
        { icon: <PieChart size={24} />, label: "BI", href: "/club/bi-dashboard" },
      ];
    }
    
    // Admin
    if (user?.role === 'admin') {
      return [
        { icon: <Home size={24} />, label: "Dashboard", href: "/admin" },
        { icon: <Search size={24} />, label: "Recherche", href: "/admin/search" },
        { 
          icon: (
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          ), 
          label: "Actions", 
          href: "/admin/actions" 
        },
        { icon: <Calendar size={24} />, label: "Events", href: "/admin/events" },
        { icon: <User size={24} />, label: "Users", href: "/admin/users" },
      ];
    }
    
    // Par défaut, retourner la navigation utilisateur
    return [
      { icon: <Home size={24} />, label: "Explorer", href: "/user/explorer" },
      { 
        icon: (
          <div className="relative">
            <PartyPopper size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">3</span>
            </div>
          </div>
        ), 
        label: "Mes Sorties", 
        href: "/user/events" 
      },
      { 
        icon: <Radio size={24} className="text-pink-500" />, 
        label: "Mes Artistes", 
        href: "/user/search-artists" 
      },
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
      { 
        icon: (
          <div className="relative">
            <BellRing size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">2</span>
            </div>
          </div>
        ), 
        label: "Invitations", 
        href: "/user/invitations" 
      },
      { icon: <User size={24} />, label: "Profil", href: "/user/profile" },
      { icon: <UtensilsCrossed size={24} />, label: "Tables", href: "/user/table-reservation" },
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
    <div className="flex items-center p-2 bg-background border-t border-border">
      {/* Navigation principale avec tous les boutons sur une ligne */}
      <div className="grid grid-cols-6 w-full gap-1">
        <Link 
          href={navigationItems[0].href}
          className="text-center"
        >
          <div 
            className={`flex flex-col items-center py-2 rounded-lg ${
              activeItem === navigationItems[0].label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {navigationItems[0].icon}
            <span className="text-xs mt-1">{navigationItems[0].label}</span>
          </div>
        </Link>
        
        <Link 
          href={navigationItems[1].href}
          className="text-center"
        >
          <div 
            className={`flex flex-col items-center py-2 rounded-lg ${
              activeItem === navigationItems[1].label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {navigationItems[1].icon}
            <span className="text-xs mt-1">{navigationItems[1].label}</span>
          </div>
        </Link>
        
        {/* Bouton Créer (style TikTok) */}
        <Link 
          href={navigationItems[2].href}
          className="text-center relative"
        >
          <div className="flex flex-col items-center">
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-4 border-background">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>
        </Link>
        
        <Link 
          href={navigationItems[3].href}
          className="text-center"
        >
          <div 
            className={`flex flex-col items-center py-2 rounded-lg ${
              activeItem === navigationItems[3].label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {navigationItems[3].icon}
            <span className="text-xs mt-1">{navigationItems[3].label}</span>
          </div>
        </Link>
        
        <Link 
          href={navigationItems[4].href}
          className="text-center"
        >
          <div 
            className={`flex flex-col items-center py-2 rounded-lg ${
              activeItem === navigationItems[4].label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {navigationItems[4].icon}
            <span className="text-xs mt-1">{navigationItems[4].label}</span>
          </div>
        </Link>

        {navigationItems[5] && (
          <Link 
            href={navigationItems[5].href}
            className="text-center"
          >
            <div 
              className={`flex flex-col items-center py-2 rounded-lg ${
                activeItem === navigationItems[5].label.toLowerCase()
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {navigationItems[5].icon}
              <span className="text-xs mt-1">{navigationItems[5].label}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}