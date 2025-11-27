import { ReactNode, useEffect, useState } from "react";
import { useMobile } from "../hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import {
  LogOut,
  ShieldAlert,
  Clock,
  Home as HomeIcon,
  ListOrdered as ListOrderedIcon,
  LayoutGrid as LayoutGridIcon,
  Utensils as UtensilsIcon,
  ClipboardList
} from "lucide-react";
import AlertModal from "@/components/AlertModal";

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
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [posSession, setPosSession] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'danger';
    onConfirm: () => void;
  } | null>(null);

  // Pages restreintes aux administrateurs
  const restrictedPages = ["/club/history", "/club/pos-history", "/club/dashboard"];

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
        setIsAdmin(sessionData.employeeRole === 'admin');
      } catch (error) {
        console.error("Erreur lors de la lecture des données de session POS:", error);
      }
    }
  }, []);

  // Vérifier l'accès aux pages restreintes
  useEffect(() => {
    if (!isAdmin && restrictedPages.includes(location)) {
      setAlert({
        isOpen: true,
        title: "Accès non autorisé",
        description: "Cette page est réservée aux administrateurs. Vous serez redirigé vers le tableau de bord.",
        type: "error",
        onConfirm: () => {
          setAlert(null);
          setLocation("/club/pos");
        }
      });
    }
  }, [isAdmin, location, setLocation]);

  // Mettre à jour l'heure toutes les minutes
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
        <header className="sticky top-0 z-50 w-full border-b bg-black text-white shadow-md px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-1 font-extrabold text-lg">
              <span className="text-pink-500">Be</span>
              <span className="text-cyan-400">bit.</span>
            </div>

            {/* Infos & actions */}
            <div className="flex items-center space-x-3">
              {posSession && posSession.securityLevel === "high" && (
                <div className="bg-yellow-600 px-2 py-1 rounded-md flex items-center text-xs">
                  <ShieldAlert className="h-3 w-3 mr-1" />
                  <span>Sécurité élevée</span>
                </div>
              )}

              <div className="bg-gray-800 px-3 py-1 rounded-md flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{currentTime}</span>
              </div>

              {posSession?.employeeName && (
                <div className="hidden md:block bg-purple-700 px-2 py-1 rounded-md text-xs">
                  {posSession.employeeName} ({posSession.employeeRole})
                </div>
              )}

              {/* Bouton Administration (visible uniquement pour les admins) */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToAdmin}
                  className="hidden md:flex text-xs h-8 text-white border-white"
                >
                  Administration
                </Button>
              )}

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
      <main className="flex-1 pb-16 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
        {children}
      </main>

      {/* Barre de navigation mobile / flottante PC */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0 
          bg-white dark:bg-gray-900 
          border-t border-gray-200 dark:border-gray-800 
          shadow-lg z-50 

          /* Mode Desktop : flottant centré */
          md:bottom-0 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 
          md:w-max md:rounded-t-2xl md:border-x md:border-t md:shadow-xl
        `}
      >
        <div className="flex justify-around items-center py-2 px-4 md:gap-6">
          <Link
            href="/club/pos"
            className={`flex flex-col items-center justify-center p-2 ${location === "/club/pos" || location === "/club/dashboard"
                ? "text-blue-600"
                : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          <Link
            href="/club/catalog"
            className={`flex flex-col items-center justify-center p-2 ${location === "/club/catalog" || location === "/club/pos-catalog"
                ? "text-blue-600"
                : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <ListOrderedIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Catalogue</span>
          </Link>

          <Link
            href="/club/tables"
            className={`flex flex-col items-center justify-center p-2 ${location === "/club/tables" || location === "/club/pos-tables"
                ? "text-blue-600"
                : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <LayoutGridIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Tables</span>
          </Link>

          <Link
            href="/club/kitchen"
            className={`flex flex-col items-center justify-center p-2 ${location === "/club/kitchen" || location === "/club/pos-kitchen"
                ? "text-blue-600"
                : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <UtensilsIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Cuisine</span>
          </Link>

          {/* Lien Historique (visible uniquement pour les admins) */}
          {isAdmin && (
            <Link
              href="/club/history"
              className={`flex flex-col items-center justify-center p-2 ${location === "/club/history" || location === "/club/pos-history"
                  ? "text-blue-600"
                  : "text-gray-600 dark:text-gray-400"
                }`}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs mt-1">Historique</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Alerte pour accès non autorisé */}
      {alert && (
        <AlertModal
          isOpen={alert.isOpen}
          onClose={() => {
            setAlert(null);
            setLocation("/club/pos");
          }}
          onConfirm={alert.onConfirm}
          title={alert.title}
          description={alert.description}
          type={alert.type}
          confirmLabel="OK"
          cancelLabel="Annuler"
        />
      )}
    </div>
  );
}