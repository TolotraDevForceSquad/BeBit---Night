import React from "react";
import { Route, Switch, Link } from "wouter";
import SimpleAuth from "./pages/simple-auth";
import UserLayout from "./layouts/user-layout";
import NotFound from "./pages/not-found";
import ExplorerPage from "./pages/user/explorer-page";
import EventsPage from "./pages/user/events-page";
import TicketsPage from "./pages/user/tickets-page";
import ProfilePage from "./pages/user/profile-page";
import SearchArtistsPage from "./pages/user/search-artists-page";
import SearchClubsPage from "./pages/user/search-clubs-page";
import CreateEventPage from "./pages/user/create-event-page";
import TableReservationPage from "./pages/user/table-reservation";
import InvitationsPage from "./pages/user/invitations-page";
import GalleryPage from "./pages/user/gallery-page";
import WalletPage from "./pages/user/wallet-page";
import ReviewsPage from "./pages/user/reviews-page";
import SettingsPage from "./pages/settings-page";
import LogoutPage from "./pages/logout-page";
import LandingPage from "./pages/landing-page";
import ClubProfilePage from "./pages/user/club-profile-page";
import ResponsiveLayout from "./layouts/ResponsiveLayout";
import ModerationPage from "./pages/admin/moderation-page";
import AdminDashboardPage from "./pages/admin/dashboard-page";
import ArtistsManagementPage from "./pages/admin/artists-management-page";
import EventsManagementPage from "./pages/admin/events-management-page";
import AdminSettingsPage from "./pages/admin/settings-page";

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
            
            <Route path="/user/search-clubs">
              <UserLayout>
                <SearchClubsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/create-event">
              <CreateEventPage />
            </Route>
            
            <Route path="/user/events/create">
              <CreateEventPage />
            </Route>
            
            <Route path="/user/table-reservation">
              <TableReservationPage />
            </Route>
            
            <Route path="/user/invitations">
              <UserLayout>
                <InvitationsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/gallery">
              <UserLayout>
                <GalleryPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/wallet">
              <UserLayout>
                <WalletPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/reviews">
              <UserLayout>
                <ReviewsPage />
              </UserLayout>
            </Route>
            
            <Route path="/user/settings">
              <SettingsPage />
            </Route>
            
            <Route path="/settings">
              <SettingsPage />
            </Route>
            
            <Route path="/user/club-profile">
              <ClubProfilePage />
            </Route>
            
            <Route path="/logout">
              <LogoutPage />
            </Route>

            {/* Routes artiste */}
            <Route path="/artist">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Dashboard Artiste</h1>
                  <p className="text-lg">Bienvenue sur votre espace artiste</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/agenda">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Agenda</h1>
                  <p className="text-lg">Gérez vos événements à venir</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/invitations">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Invitations</h1>
                  <p className="text-lg">Gérez vos invitations</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/feedback">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Feedbacks</h1>
                  <p className="text-lg">Consultez les avis de vos fans</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/create-event">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Créer un événement</h1>
                  <p className="text-lg">Créez un nouvel événement</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/collaborations">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Collaborations</h1>
                  <p className="text-lg">Gérez vos collaborations</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/artist/wallet">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Portefeuille</h1>
                  <p className="text-lg">Gérez vos revenus</p>
                </div>
              </ResponsiveLayout>
            </Route>

            {/* Routes club */}
            <Route path="/club">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Dashboard Club</h1>
                  <p className="text-lg">Gérez vos événements</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/find-artists">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Rechercher des artistes</h1>
                  <p className="text-lg">Trouvez des artistes pour vos événements</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/invitations">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Invitations</h1>
                  <p className="text-lg">Gérez vos invitations aux artistes</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/attendees">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Participants</h1>
                  <p className="text-lg">Consultez la liste des participants</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/wallet">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Portefeuille</h1>
                  <p className="text-lg">Gérez vos revenus</p>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/reservations">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Réservations de tables</h1>
                  <p className="text-lg">Gérez les réservations de tables</p>
                </div>
              </ResponsiveLayout>
            </Route>

            <Route path="/club/create-event">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Créer un événement</h1>
                  <p className="text-lg">Créez un nouvel événement dans votre club</p>
                </div>
              </ResponsiveLayout>
            </Route>

            {/* Routes admin - protégées pour le rôle admin uniquement */}
            {user.role === 'admin' && (
              <>
                <Route path="/admin">
                  <AdminDashboardPage />
                </Route>
                
                <Route path="/admin/artists">
                  <ArtistsManagementPage />
                </Route>
                
                <Route path="/admin/clubs">
                  <ResponsiveLayout>
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-6">Gestion des clubs</h1>
                      <p className="text-lg">Gérez les profils de clubs</p>
                    </div>
                  </ResponsiveLayout>
                </Route>
                
                <Route path="/admin/events">
                  <EventsManagementPage />
                </Route>
                
                <Route path="/admin/moderation">
                  <ModerationPage />
                </Route>
                
                <Route path="/admin/search">
                  <ResponsiveLayout>
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-6">Recherche globale</h1>
                      <p className="text-lg">Recherchez dans toute la plateforme</p>
                    </div>
                  </ResponsiveLayout>
                </Route>
                
                <Route path="/admin/settings">
                  <AdminSettingsPage />
                </Route>
              </>
            )}
            
            {/* Protection pour les routes admin si l'utilisateur n'est pas admin */}
            {user.role !== 'admin' && (
              <Route path="/admin/:rest*">
                <NotFound />
              </Route>
            )}
            
            {/* Page d'accueil - force la redirection vers explorer */}
            <Route path="/">
              <UserLayout>
                <ExplorerPage />
              </UserLayout>
            </Route>
          </>
        ) : (
          // Pour les utilisateurs non connectés
          <>
            {/* Page d'accueil vitrine */}
            <Route path="/">
              <LandingPage />
            </Route>
          </>
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