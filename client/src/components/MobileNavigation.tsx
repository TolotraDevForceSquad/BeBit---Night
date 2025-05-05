import { useLocation, Link } from "wouter";
import { Home, Music, CalendarDays, User, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MobileNavigationProps {
  activeItem?: string;
}

export default function MobileNavigation({ activeItem }: MobileNavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Determine navigation items based on user role
  const getNavItems = () => {
    // Default navigation items for all users
    const items = [
      { 
        label: "Accueil", 
        icon: <Home className="h-6 w-6" />, 
        path: user?.role === "user" ? "/" : `/${user?.role}`,
        key: "home" 
      },
      { 
        label: "Recherche", 
        icon: <Search className="h-6 w-6" />, 
        path: "/search", 
        key: "search" 
      },
    ];

    // Add role-specific items
    if (user?.role === "artist") {
      items.push(
        { 
          label: "Bookings", 
          icon: <CalendarDays className="h-6 w-6" />, 
          path: "/artist/bookings", 
          key: "bookings" 
        }
      );
    } else if (user?.role === "club") {
      items.push(
        { 
          label: "Événements", 
          icon: <CalendarDays className="h-6 w-6" />, 
          path: "/club/events", 
          key: "events" 
        }
      );
    } else {
      items.push(
        { 
          label: "Artistes", 
          icon: <Music className="h-6 w-6" />, 
          path: "/artists", 
          key: "artists" 
        }
      );
    }
    
    // Add profile link for all users
    items.push(
      { 
        label: "Profil", 
        icon: <User className="h-6 w-6" />, 
        path: "/profile", 
        key: "profile" 
      }
    );
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-nav md:hidden">
      {navItems.map((item) => {
        const isActive = 
          activeItem === item.key || 
          (activeItem === undefined && location === item.path);
          
        return (
          <Link key={item.key} href={item.path}>
            <a className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}