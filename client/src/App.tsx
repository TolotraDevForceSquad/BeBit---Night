import React, { useEffect, useState } from "react";
import { Route, Switch, Link } from "wouter";
import { Calendar, MessageSquare } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
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
import ClubsManagementPage from "./pages/admin/clubs-management-page";
import POSManagementPage from "./pages/club/pos-management-page";
import POSCatalogPage from "./pages/club/pos-catalog-page";
import POSTablesPage from "./pages/club/pos-tables-page";
import POSLoginPage from "./pages/club/pos-login-page";
import POSKitchenPage from "./pages/club/pos-kitchen-page";
import POSBarPage from "./pages/club/pos-bar-page";
import POSHistoryPage from "./pages/club/pos-history-page";
import BIDashboardPage from "./pages/club/temp-bi-dashboard";
import ClubTableReservationPage from "./pages/club/table-reservation-page";
import FindArtistsPage from "./pages/club/find-artists-page";
import ClubInvitationsPage from "./pages/club/invitations-page";
import ClubWalletPage from "./pages/club/wallet-page";
import AttendeesPage from "./pages/club/attendees-page";
import TicketsManagementPage from "./pages/club/tickets-management-page";
import ClubEventsPage from "./pages/club/club-events-page";
import StaffManagementPage from "./pages/club/staff-management-page";
import ArtistDashboardPage from "./pages/artist/dashboard-page";
import ArtistAgendaPage from "./pages/artist/agenda-page";
import ArtistInvitationsPage from "./pages/artist/invitations-page";
import ArtistFeedbackPage from "./pages/artist/feedback-page";
import ArtistCreateEventPage from "./pages/artist/create-event-page";
import ArtistCollaborationsPage from "./pages/artist/collaborations-page";
import ArtistSettingsPage from "./pages/artist/settings-page";
// import ClubTickets from "./pages/club/club-tickets";
import ClubProfil from "./pages/club/club-profile-page";
import MessengerModal from "./pages/club/modal/MessageModal";
import EventDetail from "./pages/user/events";
// import ClubScanTicketsPage from "./pages/club/club-scan-tickets";

// Helper pour vérifier la session POS
const checkPOSSession = (): boolean => {
  const posSession = localStorage.getItem('pos_session');
  if (!posSession) return false;

  try {
    const session = JSON.parse(posSession);
    const now = new Date();
    const sessionStart = new Date(session.timestamp);
    const durationMs = parseInt(session.sessionDuration || '60') * 60 * 1000; // Durée en minutes convertie en ms
    const expirationTime = new Date(sessionStart.getTime() + durationMs);

    // Si sessionDuration = "0", c'est "Déconnexion après transaction" -> on considère toujours valide pour simplifier
    if (session.sessionDuration === "0") return true;

    return now < expirationTime;
  } catch (error) {
    localStorage.removeItem('pos_session'); // Nettoie si corrompu
    return false;
  }
};

// Composant Guard pour protéger les routes POS
const POSGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (!checkPOSSession()) {
      window.location.href = "/club/pos-login";
    }
  }, []);

  if (!checkPOSSession()) {
    return <div>Redirection vers l'authentification POS...</div>;
  }

  return <>{children}</>;
};

// Version simplifiée sans chargement d'animation pour débloquer
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

            <Route path="/event/:id" component={EventDetail}>
              <EventDetail />
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
              <ArtistDashboardPage/>
            </Route>
            
            <Route path="/artist/agenda">
              <ArtistAgendaPage />
            </Route>
            
            <Route path="/artist/invitations">
              <ArtistInvitationsPage />
            </Route>
            
            <Route path="/artist/feedback">
              <ArtistFeedbackPage />
            </Route>
            
            <Route path="/artist/create-event">
              <ArtistCreateEventPage />
            </Route>
            
            <Route path="/artist/collaborations">
              <ArtistCollaborationsPage />
            </Route>
            
            <Route path="/artist/wallet">
              <ArtistSettingsPage />
            </Route>
            
            {/* Routes club générales (non-POS) */}
            <Route path="/club">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Dashboard Club</h1>
                  <p className="text-lg">Gérez vos événements et votre établissement</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Business Intelligence avancée</h2>
                        <p className="text-blue-700 dark:text-blue-400 mt-1">Accédez à des statistiques détaillées, des prévisions et des recommandations d'optimisation</p>
                      </div>
                      <Link
                        href="/club/bi-dashboard"
                        className="mt-3 md:mt-0 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-6 py-2 rounded-md font-medium"
                      >
                        Consulter les analyses
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-semibold mb-2">Gestion des points de vente</h2>
                      <p className="text-muted-foreground mb-4">Gérez vos terminaux POS, les utilisateurs et suivez vos ventes</p>
                      <div className="flex space-x-2">
                        <Link href="/club/pos" className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-center flex-1">
                          Administration
                        </Link>
                        <Link href="/club/pos-login" className="bg-orange-500 text-white hover:bg-orange-600 py-2 px-4 rounded-md text-center flex-1">
                          Se connecter
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-semibold mb-2">Plan de tables</h2>
                      <p className="text-muted-foreground mb-4">Visualisez et gérez vos tables par zone</p>
                      <div className="flex space-x-2">
                        <Link href="/club/tables" className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-md text-center flex-1">
                          Voir le plan
                        </Link>
                        <Link href="/club/pos-catalog" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md text-center flex-1">
                          Catalogue
                        </Link>
                      </div>
                    </div>
                    
                    <Link href="/club/events" className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow block">
                      <h2 className="text-xl font-semibold mb-2">Créer un événement</h2>
                      <p className="text-muted-foreground mb-4">Planifiez et publiez un nouvel événement dans votre club</p>
                      <div className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md text-center">
                        Nouvel événement
                      </div>
                    </Link>
                    
                    <Link href="/club/reservations" className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow block">
                      <h2 className="text-xl font-semibold mb-2">Réservations de tables</h2>
                      <p className="text-muted-foreground mb-4">Consultez et gérez les réservations de tables</p>
                      <div className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md text-center">
                        Gérer les réservations
                      </div>
                    </Link>
                    
                    <Link href="/club/history" className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow block">
                      <h2 className="text-xl font-semibold mb-2">Historique des transactions</h2>
                      <p className="text-muted-foreground mb-4">Consultez l'historique détaillé des opérations et transactions</p>
                      <div className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md text-center">
                        Voir l'historique
                      </div>
                    </Link>
                  </div>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/find-artists">
              <FindArtistsPage />
            </Route>
            
            <Route path="/club/invitations">
              <ClubInvitationsPage />
            </Route>
            
            <Route path="/club/events">
              <ClubEventsPage />
            </Route>
            
            <Route path="/club/attendees">
              <AttendeesPage />
            </Route>
            
            <Route path="/club/staff">
              <StaffManagementPage />
            </Route>
            
            <Route path="/club/tickets">
              <TicketsManagementPage />
            </Route>
            
            <Route path="/club/profil">
                <ClubProfil />
            </Route>
            
            <Route path="/club/wallet">
              <ClubWalletPage />
            </Route>
            
            <Route path="/club/reservations">
              <ClubTableReservationPage />
            </Route>

            {/* <Route path="/club/ticket">
                <ClubTickets />
            </Route> */}

            {/* <Route path="/club/scan-tickets">
                <ClubScanTicketsPage />
            </Route> */}
            
            {/* Routes POS : Protégées par le POSGuard */}
            <Route path="/club/pos-login">
              <POSLoginPage />
            </Route>

            <Route path="/club/pos">
              <POSGuard>
                <POSManagementPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/dashboard">
              <POSGuard>
                <POSManagementPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/pos-catalog">
              <POSGuard>
                <POSCatalogPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/catalog">
              <POSGuard>
                <POSCatalogPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/pos-tables">
              <POSGuard>
                <POSTablesPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/tables">
              <POSGuard>
                <POSTablesPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/pos-kitchen">
              <POSGuard>
                <POSKitchenPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/kitchen">
              <POSGuard>
                <POSKitchenPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/pos-bar">
              <POSGuard>
                <POSBarPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/bar">
              <POSGuard>
                <POSBarPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/pos-history">
              <POSGuard>
                <POSHistoryPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/history">
              <POSGuard>
                <POSHistoryPage />
              </POSGuard>
            </Route>
            
            <Route path="/club/bi-dashboard">
                <BIDashboardPage />   
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
                  <ClubsManagementPage />
                </Route>
                
                <Route path="/admin/events">
                  <EventsManagementPage />
                </Route>
                
                <Route path="/admin/moderation">
                  <ModerationPage />
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

      {/* Bouton et Modal au niveau racine */}
      {user && !isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#EC4899] hover:bg-[#DB2777] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Ouvrir les messages"
        >
          <MessageSquare size={24} />
        </button>
      )}
      
      {user && isModalOpen && (
        <MessengerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentUser={user}
        />
      )}
    </>
  );
}

export default App;