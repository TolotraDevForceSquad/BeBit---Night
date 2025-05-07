import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Wallet,
  Settings, User, PartyPopper, Users, LogOut, CalendarPlus, Plus,
  GlassWater, UtensilsCrossed, Music, Mic, Guitar, BellRing,
  Ticket
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
        { icon: <Mic size={24} />, label: "Artistes", href: "/user/search-artists" },
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
          href: "/user/create-event" 
        },
        { icon: <Ticket size={24} />, label: "Tickets", href: "/user/tickets" },
        { icon: <UtensilsCrossed size={24} />, label: "Tables", href: "/user/table-reservation" },
        { icon: <User size={24} />, label: "Profil", href: "/user/profile" },
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
        { icon: <Home size={24} />, label: "Events", href: "/club" },
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
        { icon: <Calendar size={24} />, label: "Participants", href: "/club/attendees" },
        { icon: <Search size={24} />, label: "Artistes", href: "/club/find-artists" },
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
      { icon: <Mic size={24} />, label: "Artistes", href: "/user/search-artists" },
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
        href: "/user/create-event" 
      },
      { icon: <Ticket size={24} />, label: "Tickets", href: "/user/tickets" },
      { icon: <UtensilsCrossed size={24} />, label: "Tables", href: "/user/table-reservation" },
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
    <div className="flex items-center p-2 bg-background border-t border-border">
      {/* Navigation principale avec tous les boutons sur une ligne */}
      <div className={`grid ${navigationItems.length <= 5 ? 'grid-cols-5' : 'grid-cols-7'} w-full gap-1`}>
        {navigationItems.map((item, index) => (
          <Link 
            key={index}
            href={item.href}
            className="text-center"
          >
            <div 
              className={`flex flex-col items-center py-2 rounded-lg ${
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
    </div>
  );
}