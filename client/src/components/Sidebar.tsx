import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Compass,
  Mail,
  Image,
  Wallet,
  Star,
  User,
  LogOut,
  Calendar,
  Users,
  BarChart3,
  Building2,
  Music,
  Settings,
  Ban,
  PieChart,
  LayoutDashboard
} from "lucide-react";

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const { user, logoutMutation } = useAuth();

  // Function to handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Render navigation items based on user role
  const renderNavigationItems = () => {
    if (user?.role === "admin") {
      return (
        <div className="space-y-1">
          <Link href="/admin">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'dashboard' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/admin/artists">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'artists' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Music className="mr-3 h-5 w-5" />
              <span>Artistes</span>
            </a>
          </Link>
          <Link href="/admin/clubs">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'clubs' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Building2 className="mr-3 h-5 w-5" />
              <span>Clubs</span>
            </a>
          </Link>
          <Link href="/admin/users">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'users' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Users className="mr-3 h-5 w-5" />
              <span>Utilisateurs</span>
            </a>
          </Link>
          <Link href="/admin/events">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'events' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Calendar className="mr-3 h-5 w-5" />
              <span>Tous les Événements</span>
            </a>
          </Link>
          <Link href="/admin/moderation">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'moderation' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Ban className="mr-3 h-5 w-5" />
              <span>Modération</span>
            </a>
          </Link>
          <Link href="/admin/settings">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'settings' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Settings className="mr-3 h-5 w-5" />
              <span>Paramètres</span>
            </a>
          </Link>
        </div>
      );
    } else if (user?.role === "artist") {
      return (
        <div className="space-y-1">
          <Link href="/artist">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'dashboard' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/artist/events">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'events' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Calendar className="mr-3 h-5 w-5" />
              <span>Mes événements</span>
            </a>
          </Link>
          <Link href="/artist/invitations">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'invitations' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Mail className="mr-3 h-5 w-5" />
              <span>Invitations des clubs</span>
            </a>
          </Link>
          <Link href="/artist/feedback">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'feedback' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Star className="mr-3 h-5 w-5" />
              <span>Feedbacks reçus</span>
            </a>
          </Link>
          <Link href="/artist/wallet">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'wallet' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Wallet className="mr-3 h-5 w-5" />
              <span>Portefeuille & dons</span>
            </a>
          </Link>
          <Link href="/artist/profile">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'profile' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <User className="mr-3 h-5 w-5" />
              <span>Mon profil</span>
            </a>
          </Link>
        </div>
      );
    } else if (user?.role === "club") {
      return (
        <div className="space-y-1">
          <Link href="/club">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'dashboard' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/club/events">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'events' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Calendar className="mr-3 h-5 w-5" />
              <span>Événements organisés</span>
            </a>
          </Link>
          <Link href="/club/artists">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'artists' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Music className="mr-3 h-5 w-5" />
              <span>Appels à artistes</span>
            </a>
          </Link>
          <Link href="/club/participants">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'participants' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Users className="mr-3 h-5 w-5" />
              <span>Participants & billetterie</span>
            </a>
          </Link>
          <Link href="/club/statistics">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'statistics' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <PieChart className="mr-3 h-5 w-5" />
              <span>Statistiques club</span>
            </a>
          </Link>
          <Link href="/club/wallet">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'wallet' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Wallet className="mr-3 h-5 w-5" />
              <span>Portefeuille</span>
            </a>
          </Link>
          <Link href="/club/profile">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'profile' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Building2 className="mr-3 h-5 w-5" />
              <span>Mon club</span>
            </a>
          </Link>
        </div>
      );
    } else {
      // Regular user navigation
      return (
        <div className="space-y-1">
          <Link href="/">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'explorer' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Compass className="mr-3 h-5 w-5 text-primary" />
              <span>Explorer</span>
            </a>
          </Link>
          <Link href="/invitations">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'invitations' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Mail className="mr-3 h-5 w-5" />
              <span>Invitations</span>
            </a>
          </Link>
          <Link href="/gallery">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'gallery' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Image className="mr-3 h-5 w-5" />
              <span>Galerie</span>
            </a>
          </Link>
          <Link href="/wallet">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'wallet' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Wallet className="mr-3 h-5 w-5" />
              <span>Portefeuille</span>
            </a>
          </Link>
          <Link href="/reviews">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'reviews' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <Star className="mr-3 h-5 w-5" />
              <span>Mes avis</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`flex items-center w-full px-4 py-3 rounded-lg ${activeItem === 'profile' ? 'bg-muted text-white' : 'text-muted-foreground hover:bg-muted hover:text-white'}`}>
              <User className="mr-3 h-5 w-5" />
              <span>Profil</span>
            </a>
          </Link>
        </div>
      );
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full">
      <div className="p-4">
        <h1 className="font-heading font-bold text-2xl mb-6">
          <span className="text-primary">Night</span>
          <span className="text-secondary">Connect</span>
        </h1>
        
        {renderNavigationItems()}
      </div>
      
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white overflow-hidden">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold">{user?.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="ml-3">
            <div className="font-medium">{user?.username}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
          </div>
          <button 
            className="ml-auto text-muted-foreground hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
