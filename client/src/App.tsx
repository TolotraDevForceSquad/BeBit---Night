import { Suspense, lazy, useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import SimpleAuth from "./pages/simple-auth";
import UserLayout from "./layouts/user-layout";
import ClubLayout from "./layouts/club-layout";
import NotFound from "./pages/not-found";
import { useMobile } from "./hooks/use-mobile";

// Chargement différé des pages utilisateur
const ExplorerPage = lazy(() => import("./pages/user/explorer-page"));
const EventsPage = lazy(() => import("./pages/user/events-page"));
const TicketsPage = lazy(() => import("./pages/user/tickets-page"));
const ProfilePage = lazy(() => import("./pages/user/profile-page"));
const SearchArtistsPage = lazy(() => import("./pages/user/search-artists-page"));
const CreateEventPage = lazy(() => import("./pages/user/create-event-page"));
const TableReservationPage = lazy(() => import("./pages/user/table-reservation"));

// Chargement différé des pages club
const ClubDashboardPage = lazy(() => import("./pages/club/dashboard-page"));
const ClubProfilePage = lazy(() => import("./pages/club/club-profile-page"));
const ClubAttendeesPage = lazy(() => import("./pages/club/attendees-page"));
const ClubFindArtistsPage = lazy(() => import("./pages/club/find-artists-page"));
const ClubReservationsPage = lazy(() => import("./pages/club/manage-reservations-page"));

// Page d'accueil qui redirige vers /user/explorer
function HomePage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const isMobile = useMobile();
  
  // Redirection automatique vers la page appropriée selon le rôle
  useEffect(() => {
    if (user.role === 'user') {
      window.location.href = "/user/explorer";
    } else if (user.role === 'artist') {
      // À activer quand l'interface artiste sera prête
      // window.location.href = "/artist/dashboard";
    } else if (user.role === 'club') {
      window.location.href = "/club/dashboard";
    } else if (user.role === 'admin') {
      // À activer quand l'interface admin sera prête
      // window.location.href = "/admin/dashboard";
    }
  }, [user]);

  // Afficher un écran de chargement musical pendant la redirection
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 text-center">Redirection en cours...</p>
      </div>
      <div className="flex space-x-2 h-16">
        <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.2s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.3s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.4s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.5s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.6s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.7s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.8s] h-full rounded-t-lg"></div>
        <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.9s] h-full rounded-t-lg"></div>
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
        <Route path="/user/profile" component={ProfilePage} />
        <Route path="/user/wallet">
          {() => {
            // Redirection de l'ancienne URL wallet vers profil
            window.location.href = "/user/profile";
            return null;
          }}
        </Route>
        <Route path="/user/search-artists" component={SearchArtistsPage} />
        <Route path="/user/create-event" component={CreateEventPage} />
        <Route path="/user/table-reservation" component={TableReservationPage} />
        <Route component={NotFound} />
      </Switch>
    </UserLayout>
  );
}

function ClubRoutes() {
  return (
    <Switch>
      <Route path="/club">
        <ClubDashboardPage />
      </Route>
      <Route path="/club/dashboard">
        <ClubDashboardPage />
      </Route>
      <Route path="/club/profile">
        <ClubProfilePage />
      </Route>
      <Route path="/club/attendees">
        <ClubAttendeesPage />
      </Route>
      <Route path="/club/find-artists">
        <ClubFindArtistsPage />
      </Route>
      <Route path="/club/reservations">
        <ClubReservationsPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
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

  // Afficher un écran de chargement stylisé avec le nom Be bit et animation musicale
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">La plateforme événementielle</p>
        </div>
        <div className="flex space-x-2 h-16">
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.2s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.3s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.4s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.5s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.6s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.7s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.8s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.9s] h-full rounded-t-lg"></div>
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
        <div className="flex space-x-2 h-16">
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.2s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.3s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.4s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.5s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.6s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-secondary animate-[bounce_1s_infinite_0.7s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.8s] h-full rounded-t-lg"></div>
          <div className="w-3 bg-primary animate-[bounce_1s_infinite_0.9s] h-full rounded-t-lg"></div>
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
          <Route path="/club/:rest*">
            <ClubRoutes />
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