import React from "react";
import { Route, Switch } from "wouter";
import SimpleAuth from "./pages/simple-auth";
import UserLayout from "./layouts/user-layout";
import NotFound from "./pages/not-found";
import ExplorerPage from "./pages/user/explorer-page";
import EventsPage from "./pages/user/events-page";
import TicketsPage from "./pages/user/tickets-page";
import ProfilePage from "./pages/user/profile-page";
import SearchArtistsPage from "./pages/user/search-artists-page";
import CreateEventPage from "./pages/user/create-event-page";
import TableReservationPage from "./pages/user/table-reservation";

// Version simplifiée sans chargement d'animation pour débloquer
function App() {
  // Vérifier si l'utilisateur est connecté
  const storedUser = localStorage.getItem('auth_user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // Si l'utilisateur est connecté et qu'on est sur la page d'accueil, rediriger vers explorer
  if (user && window.location.pathname === "/") {
    window.location.href = "/user/explorer";
    return <div>Redirection...</div>;
  }

  // Afficher l'interface principale
  return (
    <>
      <Switch>
        {/* Route spécifique pour auth */}
        <Route path="/auth">
          <SimpleAuth />
        </Route>
        
        {user ? (
          <>
            {/* Routes utilisateur protégées */}
            <Route path="/user/explorer">
              <UserLayout>
                <ExplorerPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/events">
              <UserLayout>
                <EventsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/tickets">
              <UserLayout>
                <TicketsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/profile">
              <UserLayout>
                <ProfilePage />
              </UserLayout>
            </Route>
            
            <Route path="/user/search-artists">
              <UserLayout>
                <SearchArtistsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/create-event">
              <CreateEventPage />
            </Route>
            
            <Route path="/user/table-reservation">
              <UserLayout>
                <TableReservationPage />
              </UserLayout>
            </Route>
            
            {/* Page d'accueil - force la redirection vers explorer */}
            <Route path="/">
              <UserLayout>
                <ExplorerPage />
              </UserLayout>
            </Route>
          </>
        ) : (
          // Redirection vers auth quand non connecté et pas sur /auth
          <Route path="/">
            {window.location.pathname !== "/auth" && (
              <div className="flex items-center justify-center h-screen">
                <div>Redirection vers la page d'authentification...</div>
                <span className="hidden">
                  {window.location.href = "/auth"}
                </span>
              </div>
            )}
          </Route>
        )}
        
        {/* 404 quand aucune autre route ne correspond */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;