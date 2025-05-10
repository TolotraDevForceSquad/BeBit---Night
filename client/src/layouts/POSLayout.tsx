import { ReactNode, useEffect, useState } from "react";
import { useMobile } from "../hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { 
  LogOut, 
  ShieldAlert, 
  Terminal, 
  Clock, 
  Home as HomeIcon, 
  ListOrdered as ListOrderedIcon,
  LayoutGrid as LayoutGridIcon,
  Utensils as UtensilsIcon
} from "lucide-react";

interface POSLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export default function POSLayout({
  children,
  title = "Point de vente",
  showHeader = true
}: POSLayoutProps) {
  const isMobile = useMobile();
  const [location] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [posSession, setPosSession] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  
  // Récupérer les données utilisateur et session POS
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    const posData = localStorage.getItem('pos_session');
    
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
    
    if (posData) {
      try {
        const sessionData = JSON.parse(posData);
        setPosSession(sessionData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données de session POS:", error);
      }
    }
  }, []);
  
  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initialiser
    const interval = setInterval(updateTime, 60000); // Mettre à jour chaque minute
    
    return () => clearInterval(interval);
  }, []);

  // Fonction de déconnexion du POS
  const handleLogout = () => {
    localStorage.removeItem('pos_session');
    window.location.href = "/club/pos-login";
  };
  
  // Fonction de retour à l'administration
  const handleBackToAdmin = () => {
    window.location.href = "/club";
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-foreground">
      {/* En-tête POS */}
      {showHeader && (
        <header className="sticky top-0 z-50 w-full border-b bg-black text-white shadow-md p-3">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Terminal className="h-6 w-6" />
              <div>
                <h1 className="font-bold text-xl">
                  Be bit. <span className="text-sm font-light">POS</span>
                </h1>
                {posSession && (
                  <p className="text-xs text-gray-300">
                    {posSession.deviceName || "Terminal POS"}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {posSession && posSession.securityLevel === "high" && (
                <div className="bg-yellow-600 p-1 px-2 rounded-md flex items-center text-xs">
                  <ShieldAlert className="h-3 w-3 mr-1" />
                  <span>Sécurité élevée</span>
                </div>
              )}
              
              <div className="bg-gray-800 p-1 px-3 rounded-md flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{currentTime}</span>
              </div>
              
              {posSession && posSession.employeeName && (
                <div className="hidden md:block bg-blue-800 p-1 px-2 rounded-md text-xs">
                  {posSession.employeeName} ({posSession.employeeRole})
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToAdmin}
                className="hidden md:flex text-xs h-8 text-white border-white"
              >
                Administration
              </Button>
              
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="flex items-center h-8"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>Quitter</span>
              </Button>
            </div>
          </div>
        </header>
      )}
      
      {/* Contenu principal */}
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Barre de navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          <Link 
            href="/club/pos" 
            className={`flex flex-col items-center justify-center p-2 ${
              location === "/club/pos" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link 
            href="/club/catalog" 
            className={`flex flex-col items-center justify-center p-2 ${
              location === "/club/catalog" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <ListOrderedIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Catalogue</span>
          </Link>
          
          <Link 
            href="/club/tables" 
            className={`flex flex-col items-center justify-center p-2 ${
              (location === "/club/tables") ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <LayoutGridIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Tables</span>
          </Link>
          
          <Link 
            href="/club/kitchen" 
            className={`flex flex-col items-center justify-center p-2 ${
              (location === "/club/kitchen" || location === "/club/pos-kitchen") ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <UtensilsIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Cuisine</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}