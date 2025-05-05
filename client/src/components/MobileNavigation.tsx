import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Compass, 
  Mail, 
  Plus, 
  Heart, 
  User,
  Music,
  Building2,
  LayoutDashboard
} from "lucide-react";

interface MobileNavigationProps {
  activeItem?: string;
}

export default function MobileNavigation({ activeItem }: MobileNavigationProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Different navigation items based on user role
  const renderNavigationItems = () => {
    if (user?.role === "artist") {
      return (
        <>
          <Link href="/artist">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/artist/events">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'events' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Calendar className="h-6 w-6" />
              <span className="text-xs mt-1">Mes Événements</span>
            </a>
          </Link>
          <div className="relative flex items-center justify-center">
            <button className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-5">
              <Plus className="h-6 w-6" />
            </button>
          </div>
          <Link href="/artist/invitations">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'invitations' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Mail className="h-6 w-6" />
              <span className="text-xs mt-1">Invitations</span>
            </a>
          </Link>
          <Link href="/artist/profile">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profil</span>
            </a>
          </Link>
        </>
      );
    } else if (user?.role === "club") {
      return (
        <>
          <Link href="/club">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/club/events">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'events' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Calendar className="h-6 w-6" />
              <span className="text-xs mt-1">Événements</span>
            </a>
          </Link>
          <div className="relative flex items-center justify-center">
            <button className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-5">
              <Plus className="h-6 w-6" />
            </button>
          </div>
          <Link href="/club/artists">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'artists' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Music className="h-6 w-6" />
              <span className="text-xs mt-1">Artistes</span>
            </a>
          </Link>
          <Link href="/club/profile">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Building2 className="h-6 w-6" />
              <span className="text-xs mt-1">Mon Club</span>
            </a>
          </Link>
        </>
      );
    } else if (user?.role === "admin") {
      return (
        <>
          <Link href="/admin">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/admin/artists">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'artists' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Music className="h-6 w-6" />
              <span className="text-xs mt-1">Artistes</span>
            </a>
          </Link>
          <div className="w-14"></div> {/* Placeholder for spacing */}
          <Link href="/admin/clubs">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'clubs' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Building2 className="h-6 w-6" />
              <span className="text-xs mt-1">Clubs</span>
            </a>
          </Link>
          <Link href="/admin/users">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'users' ? 'text-primary' : 'text-muted-foreground'}`}>
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Utilisateurs</span>
            </a>
          </Link>
        </>
      );
    } else {
      // Regular user navigation
      return (
        <>
          <Link href="/">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'explorer' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Compass className="h-6 w-6" />
              <span className="text-xs mt-1">Explorer</span>
            </a>
          </Link>
          <Link href="/invitations">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'invitations' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Mail className="h-6 w-6" />
              <span className="text-xs mt-1">Invitations</span>
            </a>
          </Link>
          <div className="relative flex items-center justify-center">
            <button className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-5">
              <Plus className="h-6 w-6" />
            </button>
          </div>
          <Link href="/favorites">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'favorites' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Favorites</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`py-3 px-6 flex flex-col items-center ${activeItem === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profil</span>
            </a>
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
      <div className="flex justify-around">
        {renderNavigationItems()}
      </div>
    </nav>
  );
}
