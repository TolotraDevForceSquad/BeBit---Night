import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Search, 
  Calendar, 
  Music, 
  User, 
  PlusSquare,
  Building2,
  BarChart3,
  ShieldAlert
} from "lucide-react";

interface MobileNavigationProps {
  activeItem?: string;
}

export default function MobileNavigation({ activeItem }: MobileNavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Generate navigation items based on user role
  const getNavItems = () => {
    const items = [];

    // Role-specific items
    if (user?.role === "admin") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-6 w-6" />,
          href: "/admin",
          key: "home",
        },
        {
          name: "Modérer",
          icon: <ShieldAlert className="h-6 w-6" />,
          href: "/admin/moderation",
          key: "moderation",
        },
        {
          name: "Stats",
          icon: <BarChart3 className="h-6 w-6" />,
          href: "/admin/stats",
          key: "stats",
        },
        {
          name: "Profil",
          icon: <User className="h-6 w-6" />,
          href: "/profile",
          key: "profile",
        }
      );
    } else if (user?.role === "artist") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-6 w-6" />,
          href: "/artist",
          key: "home",
        },
        {
          name: "Bookings",
          icon: <Calendar className="h-6 w-6" />,
          href: "/artist/bookings",
          key: "bookings",
        },
        {
          name: "Profil",
          icon: <Music className="h-6 w-6" />,
          href: "/artist/profile",
          key: "profile",
        }
      );
    } else if (user?.role === "club") {
      items.push(
        {
          name: "Dashboard",
          icon: <Home className="h-6 w-6" />,
          href: "/club",
          key: "home",
        },
        {
          name: "Événements",
          icon: <Calendar className="h-6 w-6" />,
          href: "/club/events",
          key: "events",
        },
        {
          name: "Créer",
          icon: <PlusSquare className="h-6 w-6" />,
          href: "/club/events/new",
          key: "create",
        },
        {
          name: "Profil",
          icon: <Building2 className="h-6 w-6" />,
          href: "/club/profile",
          key: "profile",
        }
      );
    } else {
      // User navigation
      items.push(
        {
          name: "Accueil",
          icon: <Home className="h-6 w-6" />,
          href: "/",
          key: "home",
        },
        {
          name: "Découvrir",
          icon: <Search className="h-6 w-6" />,
          href: "/search",
          key: "search",
        },
        {
          name: "Artistes",
          icon: <Music className="h-6 w-6" />,
          href: "/artists",
          key: "artists",
        },
        {
          name: "Profil",
          icon: <User className="h-6 w-6" />,
          href: "/profile",
          key: "profile",
        }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = 
            activeItem === item.key || 
            (activeItem === undefined && location === item.href);
            
          return (
            <Link href={item.href} key={item.key}>
              <a className="flex flex-col items-center justify-center w-full h-full">
                <span className={`mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.icon}
                </span>
                <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {item.name}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for iOS devices */}
      <div className="h-safe-area bg-background" />
    </div>
  );
}