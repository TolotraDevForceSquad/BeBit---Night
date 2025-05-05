import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Search,
  Calendar,
  Music,
  User,
  Bell,
  Ticket,
  BarChart3,
  LogOut,
  Settings,
  Users,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [location, navigate] = useLocation();
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/auth');
  };

  // Generate navigation items based on user role
  const getNavItems = () => {
    const items = [];

    // Common items for all users
    items.push({
      name: "Recherche",
      icon: <Search className="h-5 w-5" />,
      href: "/search",
      key: "search",
    });

    // Role-specific items
    if (user?.role === "admin") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-5 w-5" />,
          href: "/admin",
          key: "home",
        },
        {
          name: "Modération",
          icon: <ShieldAlert className="h-5 w-5" />,
          href: "/admin/moderation",
          key: "moderation",
        },
        {
          name: "Utilisateurs",
          icon: <Users className="h-5 w-5" />,
          href: "/admin/users",
          key: "users",
        },
        {
          name: "Artistes",
          icon: <Music className="h-5 w-5" />,
          href: "/admin/artists",
          key: "artists",
        },
        {
          name: "Clubs",
          icon: <Building2 className="h-5 w-5" />,
          href: "/admin/clubs",
          key: "clubs",
        },
        {
          name: "Statistiques",
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/admin/stats",
          key: "stats",
        }
      );
    } else if (user?.role === "artist") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-5 w-5" />,
          href: "/artist",
          key: "home",
        },
        {
          name: "Bookings",
          icon: <Calendar className="h-5 w-5" />,
          href: "/artist/bookings",
          key: "bookings",
        },
        {
          name: "Performances",
          icon: <Music className="h-5 w-5" />,
          href: "/artist/performances",
          key: "performances",
        },
        {
          name: "Notifications",
          icon: <Bell className="h-5 w-5" />,
          href: "/artist/notifications",
          key: "notifications",
        }
      );
    } else if (user?.role === "club") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-5 w-5" />,
          href: "/club",
          key: "home",
        },
        {
          name: "Événements",
          icon: <Calendar className="h-5 w-5" />,
          href: "/club/events",
          key: "events",
        },
        {
          name: "Artistes",
          icon: <Music className="h-5 w-5" />,
          href: "/club/artists",
          key: "artists",
        },
        {
          name: "Invitations",
          icon: <Bell className="h-5 w-5" />,
          href: "/club/invitations",
          key: "invitations",
        },
        {
          name: "Statistiques",
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/club/stats",
          key: "stats",
        }
      );
    } else {
      items.push(
        {
          name: "Accueil",
          icon: <Home className="h-5 w-5" />,
          href: "/",
          key: "home",
        },
        {
          name: "Artistes",
          icon: <Music className="h-5 w-5" />,
          href: "/artists",
          key: "artists",
        },
        {
          name: "Clubs",
          icon: <Building2 className="h-5 w-5" />,
          href: "/clubs",
          key: "clubs",
        },
        {
          name: "Tickets",
          icon: <Ticket className="h-5 w-5" />,
          href: "/tickets",
          key: "tickets",
        }
      );
    }

    // Common settings and profile items
    items.push(
      {
        name: "Profil",
        icon: <User className="h-5 w-5" />,
        href: "/profile",
        key: "profile",
      },
      {
        name: "Paramètres",
        icon: <Settings className="h-5 w-5" />,
        href: "/settings",
        key: "settings",
      }
    );

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="fixed inset-y-0 left-0 bg-sidebar-background text-sidebar-foreground w-64 border-r border-sidebar-border flex flex-col h-screen z-40">
      {/* Sidebar Header */}
      <div className="p-6">
        <h1 className="font-heading font-bold text-2xl">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              activeItem === item.key || 
              (activeItem === undefined && location === item.href);
              
            return (
              <li key={item.key}>
                <div
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.username} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}