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
      {user ? (
        <Switch>
          <Route path="/user">
            <UserLayout>
              <Switch>
                <Route path="/user/explorer" component={ExplorerPage} />
                <Route path="/user/events" component={EventsPage} />
                <Route path="/user/tickets" component={TicketsPage} />
                <Route path="/user/profile" component={ProfilePage} />
                <Route path="/user/search-artists" component={SearchArtistsPage} />
                <Route path="/user/create-event" component={CreateEventPage} />
                <Route path="/user/table-reservation" component={TableReservationPage} />
                <Route component={NotFound} />
              </Switch>
            </UserLayout>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      ) : (
        <SimpleAuth />
      )}
    </>
  );
}

export default App;