import { Suspense, lazy, useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import SimpleAuth from "./pages/simple-auth";
import UserLayout from "./layouts/user-layout";
import NotFound from "./pages/not-found";
import { useMobile } from "./hooks/use-mobile";

// Chargement différé des pages principales
const ExplorerPage = lazy(() => import("./pages/user/explorer-page"));
const EventsPage = lazy(() => import("./pages/user/events-page"));
const TicketsPage = lazy(() => import("./pages/user/tickets-page"));
const WalletPage = lazy(() => import("./pages/user/wallet-page"));
const SearchArtistsPage = lazy(() => import("./pages/user/search-artists-page"));
const CreateEventPage = lazy(() => import("./pages/user/create-event-page"));
const TableReservationPage = lazy(() => import("./pages/user/table-reservation-page"));

// Page d'accueil qui redirige vers /user/explorer
function HomePage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const isMobile = useMobile();
  
  // Redirection automatique vers /user/explorer
  useEffect(() => {
    // Rediriger vers la page appropriée selon le rôle
    if (user.role === 'user') {
      window.location.href = "/user/explorer";
    } else if (user.role === 'artist') {
      // À activer quand l'interface artiste sera prête
      // window.location.href = "/artist/dashboard";
    } else if (user.role === 'club') {
      // À activer quand l'interface club sera prête
      // window.location.href = "/club/dashboard";
    } else if (user.role === 'admin') {
      // À activer quand l'interface admin sera prête
      // window.location.href = "/admin/dashboard";
    }
  }, [user]);

  // Afficher un écran de chargement pendant la redirection
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 text-center">Redirection en cours...</p>
      </div>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    </div>
  );
}

function UserRoutes() {
  return (
    <UserLayout>
      <Switch>
        <Route path="/user/explorer" component={ExplorerPage} />
        <Route path="/user/events" component={EventsPage} />
        <Route path="/user/tickets" component={TicketsPage} />
        <Route path="/user/wallet" component={WalletPage} />
        <Route path="/user/search-artists" component={SearchArtistsPage} />
        <Route path="/user/create-event" component={CreateEventPage} />
        <Route path="/user/table-reservation" component={TableReservationPage} />
        <Route component={NotFound} />
      </Switch>
    </UserLayout>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors de la lecture des données utilisateur:", error);
      }
    }
    setLoading(false);
  }, []);
  
  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setLocation("/auth");
  };

  // Afficher un écran de chargement stylisé avec le nom Be bit
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">La plateforme événementielle</p>
        </div>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">La plateforme événementielle</p>
        </div>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
        </div>
      </div>
    }>
      {user ? (
        <Switch>
          <Route path="/">
            <HomePage user={user} onLogout={handleLogout} />
          </Route>
          <Route path="/user/:rest*">
            <UserRoutes />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      ) : (
        <SimpleAuth />
      )}
    </Suspense>
  );
}

export default App;