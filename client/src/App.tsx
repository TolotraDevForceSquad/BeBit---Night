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

// Page d'accueil simple pour un utilisateur connecté
function HomePage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const isMobile = useMobile();
  
  // Pour la redirection, nous utilisons window.location.href dans les boutons

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 py-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Connecté en tant que <strong>{user.username}</strong> ({user.role})
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">
                  Bienvenue sur Be bit.
                </h2>
                <p className="text-muted-foreground mb-4">
                  Votre plateforme événementielle interactive.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-muted rounded-lg border border-border hover:bg-accent cursor-pointer"
                       onClick={() => window.location.href = "/user/explorer"}>
                    <h3 className="font-medium">Découvrir des événements</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explorez des événements près de chez vous
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border border-border hover:bg-accent cursor-pointer"
                       onClick={() => window.location.href = "/user/events"}>
                    <h3 className="font-medium">Mes événements</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gérez vos sorties
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">Votre profil</h3>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium">Nom d'utilisateur</p>
                  <p className="text-muted-foreground">{user.username}</p>
                </div>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
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

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin text-primary">Chargement...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin text-primary">Chargement...</div>
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