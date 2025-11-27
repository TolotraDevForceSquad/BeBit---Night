import React, { ReactNode, useEffect, useState, useMemo } from "react";
// Assumer que les imports lucide-react sont disponibles
import {
  LogOut,
  ShieldAlert,
  Clock,
  Home as HomeIcon,
  ListOrdered as ListOrderedIcon,
  LayoutGrid as LayoutGridIcon,
  Utensils as UtensilsIcon,
  Wine as BarIcon,
  ClipboardList,
  Menu,
  X,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// --- Mocks pour rendre le fichier auto-suffisant ---
// 1. Mock de wouter
const Link = ({ href, children, className, onClick }) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      e.preventDefault();
      console.log(`Navigating to ${href}`);
      window.history.pushState({}, '', href);
      if (onClick) onClick(e);
    }}
  >
    {children}
  </a>
);
const useLocation = () => {
    const [location, setLocation] = useState(window.location.pathname);
    useEffect(() => {
        const handlePopState = () => setLocation(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    return [location, () => {}];
};
// 2. Mock de useMobile (simule un écran large pour le test initial)
const useMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
};
// 3. Mock du composant Button (Shadcn-like)
const Button = ({ children, onClick, className, variant = "primary", size = "md" }) => {
    let baseStyle = "px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center justify-center active:scale-95";
    let variantStyle = "";
    if (variant === "destructive") {
        variantStyle = "bg-red-600 hover:bg-red-700 text-white";
    } else if (variant === "outline") {
        variantStyle = "bg-transparent border border-white text-white hover:bg-white/10";
    } else {
        variantStyle = "bg-blue-600 hover:bg-blue-700 text-white";
    }
    if (size === "sm") {
        baseStyle = "px-3 py-1.5 text-sm font-medium rounded-md shadow-sm transition-all duration-200 ease-in-out flex items-center justify-center h-8";
    }
    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variantStyle} ${className}`}
        >
            {children}
        </button>
    );
};
// --- Fin des Mocks ---
interface POSLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}
// Configuration des liens de navigation
const navLinks = [
  { href: "/club/pos", icon: HomeIcon, label: "Dashboard", activePaths: ["/club/pos", "/club/dashboard"] },
  { href: "/club/catalog", icon: ListOrderedIcon, label: "Catalogue", activePaths: ["/club/catalog", "/club/pos-catalog"] },
  { href: "/club/tables", icon: LayoutGridIcon, label: "Tables", activePaths: ["/club/tables", "/club/pos-tables"] },
  { href: "/club/kitchen", icon: UtensilsIcon, label: "Cuisine", activePaths: ["/club/kitchen", "/club/pos-kitchen"] },
  { href: "/club/bar", icon: BarIcon, label: "Bar", activePaths: ["/club/bar", "/club/pos-bar"] },
  { href: "/club/history", icon: ClipboardList, label: "Historique", activePaths: ["/club/history", "/club/pos-history"] },
  { href: "/club/settings", icon: Settings, label: "Paramètres", activePaths: ["/club/settings", "/club/pos-settings"] },
];
// Composant principal Layout
export default function POSLayout({
  children,
  title = "Point de vente",
  showHeader = true
}: POSLayoutProps) {
  const isMobile = useMobile();
  const [location] = useLocation();
  const [user, setUser] = useState(null);
  const [posSession, setPosSession] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  // Contrôle l'état du sidebar avec initialisation correcte pour éviter le clignotement
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (isMobile) return false;
    const saved = localStorage.getItem('posSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  // Persistance de l'état du sidebar dans localStorage
  useEffect(() => {
    localStorage.setItem('posSidebarExpanded', JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);
  // Réinitialiser si passage en mode mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarExpanded(false);
      localStorage.removeItem('posSidebarExpanded');
    }
  }, [isMobile]);
  // Récupérer les données utilisateur et session POS depuis localStorage
  useEffect(() => {
    // Récupérer les données de session POS depuis localStorage
    const sessionData = localStorage.getItem('pos_session');
   
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData);
        setPosSession({
          id: parsedSession.employeeId || parsedSession.id,
          employeeName: parsedSession.employeeName,
          employeeRole: parsedSession.employeeRole,
          securityLevel: "high" // Valeur par défaut, peut être ajustée si nécessaire
        });
      } catch (error) {
        console.error("Erreur lors de la lecture des données de session POS:", error);
        localStorage.removeItem('pos_session'); // Nettoyer si corrompu
      }
    }
    // Récupérer les données utilisateur (si séparées, sinon utiliser posSession)
    // Pour l'instant, on utilise posSession pour user aussi
    if (posSession) {
      setUser({ id: posSession.id, name: posSession.employeeName });
    }
  }, []);
  // Mettre à jour l'heure
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  // Fonction de déconnexion du POS
  const handleLogout = () => {
    localStorage.removeItem('pos_session'); // Nettoyer la session
    console.log("Déconnexion POS...");
    window.location.href = "http://localhost:5000/club/pos-tables"; // Redirection
  };
  // Fonction de retour à l'administration
  const handleBackToAdmin = () => {
    console.log("Retour Administration...");
  };

  // Composant d'élément de navigation réutilisable
  const NavItem = ({ href, icon: Icon, label, activePaths }) => {
    const isActive = activePaths.some(p => location.startsWith(p));
   
    // Ferme le drawer sur mobile après le clic. Sur desktop, ne change pas l'état du sidebar (reste tel quel, réduit ou étendu).
    const handleClick = (e) => {
        if (isMobile) {
            setIsSidebarExpanded(false);
        }
        // Explicitement, pas d'action sur desktop pour préserver l'état
    };
    return (
      <Link
        href={href}
        className={`
          flex items-center p-3 rounded-xl transition-colors duration-200 w-full
          ${isActive
            ? "bg-pink-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }
          // Style pour l'état réduit (Mini-Sidebar)
          ${!isSidebarExpanded && !isMobile
            ? "flex-col justify-center text-center p-2 h-20"
            : "items-center"
          }
        `}
        onClick={handleClick}
      >
        <Icon className={`h-6 w-6 ${isSidebarExpanded || isMobile ? "mr-3" : "mr-0 mb-1"}`} />
        <span className={`
            ${isSidebarExpanded || isMobile ? "font-medium" : "text-xs font-medium"}
            ${!isSidebarExpanded && !isMobile ? "" : "truncate"}
        `}>{label}</span>
      </Link>
    );
  };

  // Déterminer la classe de largeur et de padding pour le Sidebar/Header/Main
  const sidebarWidth = isMobile
    ? "w-72"
    : (isSidebarExpanded ? "w-72" : "w-[150px]");
  const sidebarTranslate = isMobile
    ? (isSidebarExpanded ? "translate-x-0" : "-translate-x-full")
    : "translate-x-0";
  const mainPaddingClass = !isMobile
    ? (isSidebarExpanded ? "md:pl-72" : "md:pl-[150px]")
    : "md:pl-0";
  // --- Le Sidebar / Drawer ---
  const Sidebar = () => (
    <>
      {/* Overlay Mobile (clique pour fermer) */}
      {isSidebarExpanded && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarExpanded(false)}
        ></div>
      )}
      {/* Sidebar / Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full ${sidebarWidth}
          bg-black text-white shadow-2xl z-50
          transition-all duration-300 ease-in-out p-4 flex flex-col
          ${sidebarTranslate}
          md:border-r md:border-gray-800
        `}
      >
        
        {/* Logo (toujours complet, adapté à l'état) et Bouton de fermeture mobile */}
        <div className={`flex items-center mb-6 pb-4 transition-all duration-300 ${
            (isSidebarExpanded || isMobile)
                ? "justify-between border-b border-gray-700"
                : "justify-center"
        }`}>
          
            <div className={`flex items-center font-extrabold text-2xl ${
                (isSidebarExpanded || isMobile) ? "space-x-1" : "justify-center"
            }`}>
                <span className="text-pink-500">Be</span>
                <span className="text-cyan-400">bit.</span>
            </div>
          
            {/* Bouton de fermeture seulement sur mobile */}
            {isMobile && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSidebarExpanded(false)}
                    className="border-none bg-gray-800 hover:bg-gray-700 h-10 w-10 p-2"
                >
                    <X className="h-5 w-5" />
                </Button>
            )}
        </div>
        {/* Liens de Navigation */}
        <nav className={`flex-grow space-y-2 overflow-x-hidden overflow-y-auto ${isSidebarExpanded ? "px-2" : "px-0"}`}>
            {navLinks.map((link) => (
                <NavItem key={link.href} {...link} />
            ))}
        </nav>
        {/* Actions en bas du Sidebar */}
        <div className={`mt-auto ${isSidebarExpanded || isMobile ? "pt-6 border-t border-gray-800" : "pt-2"}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAdmin}
                className={`w-full mb-3 text-white border-white/50 hover:bg-white/10 ${!isSidebarExpanded && !isMobile ? "hidden" : ""}`}
            >
                Retour Administration
            </Button>
            
            <Button
                variant="destructive"
                onClick={handleLogout}
                className={`
                    flex ${isSidebarExpanded || isMobile ? "items-center px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95 w-full text-lg h-12" : "flex-col justify-center text-center p-2 h-20 rounded-xl transition-colors duration-200 w-full text-gray-300 hover:bg-gray-800 hover:text-white"}
                    bg-red-600 hover:bg-red-700 text-white
                `}
            >
                <LogOut className={`h-6 w-6 ${isSidebarExpanded || isMobile ? "mr-3" : "mr-0 mb-1"}`} />
                <span className={`
                    ${isSidebarExpanded || isMobile ? "font-medium" : "text-xs font-medium"}
                    ${!isSidebarExpanded && !isMobile ? "" : "truncate"}
                `}>Quitter le POS</span>
            </Button>
        </div>
      </aside>
    </>
  );
  // Composant d'info employé pour le Header
  const EmployeeHeaderInfo = () => {
    if (!posSession?.employeeName) return null;
    const isSessionAdmin = posSession.employeeRole.toLowerCase().includes("admin") || posSession.employeeRole.toLowerCase() === "manager";
    const roleColor = isSessionAdmin ? "text-red-500" : "text-purple-400";
    const roleText = posSession.employeeRole;
    const nameText = posSession.employeeName.split(' ')[0]; // Prendre seulement le prénom pour un affichage concis
    return (
        <div className="flex items-center space-x-2 bg-gray-800/70 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-700 cursor-pointer hover:bg-gray-700/70 transition">
            <User className="h-4 w-4 text-white" />
            <div className="hidden sm:block">
                <span className="text-white">{nameText}</span>
                <span className={`ml-1 ${roleColor}`}>({roleText})</span>
            </div>
            <div className="sm:hidden text-white">
                <span className={roleColor}>{roleText}</span>
            </div>
        </div>
    );
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-foreground">
      {/* En-tête POS */}
      {showHeader && (
        <header className="sticky top-0 z-30 w-full h-16 border-b bg-black text-white shadow-xl">
          {/* L'intérieur du header se décale */}
          <div className={`flex justify-between items-center h-full px-4 md:px-6 transition-all duration-300 ${mainPaddingClass}`}>
            
            {/* Toggle Sidebar et Logo (mobile: Menu pour ouvrir ; desktop: Chevron pour basculer) */}
            <div className="flex items-center space-x-4">
              
              {/* Toggle pour mobile (Menu pour ouvrir le drawer) */}
              {isMobile && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSidebarExpanded(true)}
                    className="bg-pink-600 hover:bg-pink-700 border-none h-10 w-10 p-2"
                >
                    <Menu className="h-5 w-5" />
                </Button>
              )}
              
              {/* Toggle pour desktop (Chevron pour réduire/agrandir) */}
              {!isMobile && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="border-none bg-gray-800 hover:bg-gray-700 h-10 w-10 p-2"
                >
                    {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              )}
            </div>
            {/* Infos et Heure (déplacées à droite) */}
            <div className="flex items-center space-x-4">
              
              {/* Infos Employé (Nom + Rôle) */}
              <EmployeeHeaderInfo />
              
              {/* Heure */}
              <div className="bg-gray-800/70 px-3 py-1.5 rounded-full flex items-center text-sm font-semibold border border-gray-700">
                <Clock className="h-4 w-4 mr-2 text-green-400" />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
        </header>
      )}
      {/* Contenu principal */}
      {/* Ajout d'un padding bas sur mobile pour laisser de la place au Bottom Nav */}
      <main className={`flex-1 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50 transition-all duration-300 ${mainPaddingClass} overflow-y-auto pb-16 md:pb-0`}>
        {children}
      </main>
      {/* Sidebar pour Mobile/Desktop */}
      <Sidebar />
      {/* Barre de navigation mobile (Bottom Navbar) */}
      <nav
          className={`
            fixed bottom-0 left-0 right-0 md:hidden /* IMPORTANT: seulement visible sur mobile */
            bg-black text-white // Couleur noire demandée
            border-t border-gray-800
            shadow-lg z-20
          `}
        >
        <div className="flex justify-around items-center py-2 px-4">
            {navLinks.map(({ href, icon: Icon, label, activePaths }) => (
                <Link
                    key={href}
                    href={href}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors
                        ${activePaths.some(p => location.startsWith(p))
                            ? "text-pink-600"
                            : "text-gray-400 hover:text-pink-500"
                        }`}
                >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs mt-1 font-medium">{label}</span>
                </Link>
            ))}
        </div>
      </nav>
    </div>
  );
}