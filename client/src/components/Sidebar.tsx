import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Home, Search, Calendar, Mail, Image, Users,
  Wallet, Star, Settings, LogOut, PartyPopper,
  CalendarPlus, MessageSquare, PieChart, BellRing,
  TicketIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  activeItem?: string;
}

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

export default function Sidebar({ activeItem }: SidebarProps) {
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

  // Fonction de déconnexion
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Déconnexion en cours...");
    localStorage.removeItem('auth_user');
    console.log("Local storage effacé, redirection...");
    window.location.href = "/auth";
  };

  // Déterminer les éléments de navigation en fonction du rôle
  const getNavigationItems = () => {
    // Éléments pour le rôle utilisateur standard
    if (user?.role === 'user') {
      return [
        { icon: <Home className="h-5 w-5" />, label: "Explorer", href: "/" },
        // Suppression de "Créer Sortie" dans la version web comme demandé
        { icon: <PartyPopper className="h-5 w-5" />, label: "Mes Sorties", href: "/user/events" },
        { 
          icon: <BellRing className="h-5 w-5" />, 
          label: "Invitations", 
          href: "/user/invitations" 
        },
        { icon: <Image className="h-5 w-5" />, label: "Galerie", href: "/user/gallery" },
        { icon: <Wallet className="h-5 w-5" />, label: "Portefeuille", href: "/user/wallet" },
        { icon: <Star className="h-5 w-5" />, label: "Mes avis", href: "/user/reviews" },
        { icon: <Search className="h-5 w-5" />, label: "Rechercher Artistes", href: "/user/search-artists" },
        { icon: <Search className="h-5 w-5" />, label: "Rechercher Clubs", href: "/user/search-clubs" },
      ];
    }
    
    // Éléments pour le rôle artiste
    if (user?.role === 'artist') {
      return [
        { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/artist" },
        { icon: <Calendar className="h-5 w-5" />, label: "Agenda", href: "/artist/agenda" },
        { icon: <Mail className="h-5 w-5" />, label: "Invitations", href: "/artist/invitations" },
        { icon: <MessageSquare className="h-5 w-5" />, label: "Feedbacks", href: "/artist/feedback" },
        { icon: <CalendarPlus className="h-5 w-5" />, label: "Créer événement", href: "/artist/create-event" },
        { icon: <PieChart className="h-5 w-5" />, label: "Collaborations", href: "/artist/collaborations" },
        { icon: <Wallet className="h-5 w-5" />, label: "Portefeuille", href: "/artist/wallet" },
      ];
    }
    
    // Éléments pour le rôle club
    if (user?.role === 'club') {
      return [
        { icon: <Home className="h-5 w-5" />, label: "Dashboard Club", href: "/club" },
        { icon: <Calendar className="h-5 w-5" />, label: "Événements", href: "/club/events" },
        { icon: <Search className="h-5 w-5" />, label: "Trouver Artistes", href: "/club/find-artists" },
        { icon: <Mail className="h-5 w-5" />, label: "Invitations", href: "/club/invitations" },
        { icon: <Image className="h-5 w-5" />, label: "Participants", href: "/club/attendees" },
        { icon: <TicketIcon className="h-5 w-5" />, label: "BI Tickets", href: "/club/tickets" },
        { icon: <Wallet className="h-5 w-5" />, label: "Portefeuille", href: "/club/wallet" },
        { icon: <PieChart className="h-5 w-5" />, label: "Business Intelligence", href: "/club/bi-dashboard" },
      ];
    }
    
    // Éléments pour le rôle admin
    if (user?.role === 'admin') {
      return [
        { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/admin" },
        { icon: <Search className="h-5 w-5" />, label: "Artistes", href: "/admin/artists" },
        { icon: <Image className="h-5 w-5" />, label: "Clubs", href: "/admin/clubs" },
        { icon: <Calendar className="h-5 w-5" />, label: "Événements", href: "/admin/events" },
        { icon: <Star className="h-5 w-5" />, label: "Modération", href: "/admin/moderation" },
      ];
    }
    
    // Par défaut, retourner les éléments utilisateur (sans "Créer Sortie" pour la cohérence)
    return [
      { icon: <Home className="h-5 w-5" />, label: "Explorer", href: "/" },
      { icon: <PartyPopper className="h-5 w-5" />, label: "Mes Sorties", href: "/user/events" },
      { icon: <BellRing className="h-5 w-5" />, label: "Invitations", href: "/user/invitations" },
      { icon: <Image className="h-5 w-5" />, label: "Galerie", href: "/user/gallery" },
      { icon: <Wallet className="h-5 w-5" />, label: "Portefeuille", href: "/user/wallet" },
      { icon: <Star className="h-5 w-5" />, label: "Mes avis", href: "/user/reviews" },
      { icon: <Search className="h-5 w-5" />, label: "Rechercher Artistes", href: "/user/search-artists" },
      { icon: <Search className="h-5 w-5" />, label: "Rechercher Clubs", href: "/user/search-clubs" },
    ];
  };
  
  const navigationItems = getNavigationItems();
  
  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="py-4 flex items-center">
        <h1 className="font-heading font-bold text-xl">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        </h1>
      </div>
      
      {/* Info utilisateur */}
      {user && (
        <div className="flex items-center mb-6 p-2 rounded-lg border border-border bg-card">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-medium line-clamp-1">{user.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
      )}
      
      {/* Menu de navigation */}
      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Button
              variant={activeItem === item.label.toLowerCase() ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeItem === item.label.toLowerCase()
                ? "bg-primary text-white"
                : "text-foreground"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
      
      {/* Actions en bas */}
      <div className="pt-6 space-y-1 border-t">
        <Link href="/settings" className="block">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Paramètres</span>
          </Button>
        </Link>
        
        <Link href="/logout" className="block">
          <Button
            variant="destructive"
            className="w-full justify-start"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Déconnexion</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}