import React from "react";
import { Route, Switch, Link } from "wouter";
import { Calendar } from "lucide-react";
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
                    
                    <Link href="/club/create-event" className="bg-card rounded-lg p-6 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow block">
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
            
            <Route path="/club/wallet">
              <ClubWalletPage />
            </Route>
            
            <Route path="/club/reservations">
              <ClubTableReservationPage />
            </Route>
            
            <Route path="/club/old-reservations">
              <ResponsiveLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Réservations de tables</h1>
                  <p className="text-lg">Gérez les réservations de tables de votre établissement</p>
                  
                  <div className="mt-8 flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3">
                      <div className="bg-card p-6 rounded-lg border border-border shadow-sm mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold">Réservations à venir</h2>
                          <div className="flex space-x-2 mt-2 md:mt-0">
                            <div className="relative w-[250px]">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                              </div>
                              <input
                                type="search"
                                className="w-full p-2 pl-10 text-sm border border-input rounded-lg bg-background"
                                placeholder="Rechercher un client..."
                              />
                            </div>
                            
                            <select className="p-2 text-sm border border-input rounded-lg bg-background">
                              <option value="all">Tous les statuts</option>
                              <option value="confirmed">Confirmées</option>
                              <option value="pending">En attente</option>
                              <option value="cancelled">Annulées</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                              <tr>
                                <th scope="col" className="px-4 py-3">Client</th>
                                <th scope="col" className="px-4 py-3">Date</th>
                                <th scope="col" className="px-4 py-3">Heure</th>
                                <th scope="col" className="px-4 py-3">Personnes</th>
                                <th scope="col" className="px-4 py-3">Zone</th>
                                <th scope="col" className="px-4 py-3">Statut</th>
                                <th scope="col" className="px-4 py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-card border-b hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">Thomas Dubois</td>
                                <td className="px-4 py-3">15/07/2025</td>
                                <td className="px-4 py-3">21:30</td>
                                <td className="px-4 py-3">4</td>
                                <td className="px-4 py-3">VIP</td>
                                <td className="px-4 py-3">
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Confirmée</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-1">
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-card border-b hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">Marie Laurent</td>
                                <td className="px-4 py-3">17/07/2025</td>
                                <td className="px-4 py-3">22:00</td>
                                <td className="px-4 py-3">8</td>
                                <td className="px-4 py-3">Terrasse</td>
                                <td className="px-4 py-3">
                                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">En attente</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-1">
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-card border-b hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">Pierre Moreau</td>
                                <td className="px-4 py-3">22/07/2025</td>
                                <td className="px-4 py-3">23:00</td>
                                <td className="px-4 py-3">6</td>
                                <td className="px-4 py-3">Intérieur</td>
                                <td className="px-4 py-3">
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Confirmée</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-1">
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="p-1 rounded-md hover:bg-muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Affichage des réservations 1 à 3 sur 28
                          </div>
                          <div className="flex space-x-1">
                            <button className="px-3 py-1 text-sm border rounded-md bg-background">Précédent</button>
                            <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">1</button>
                            <button className="px-3 py-1 text-sm border rounded-md bg-background">2</button>
                            <button className="px-3 py-1 text-sm border rounded-md bg-background">3</button>
                            <button className="px-3 py-1 text-sm border rounded-md bg-background">Suivant</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/3">
                      <div className="bg-card p-6 rounded-lg border border-border shadow-sm mb-6">
                        <h2 className="text-xl font-semibold mb-4">Configuration des tables</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configurez les zones et tables disponibles pour optimiser la gestion des réservations.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                            <div>
                              <div className="font-medium">Terrasse</div>
                              <div className="text-xs text-muted-foreground">8 tables, 32 places</div>
                            </div>
                            <button className="p-1 rounded-md hover:bg-muted">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                          </div>
                         
                          <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                            <div>
                              <div className="font-medium">Intérieur</div>
                              <div className="text-xs text-muted-foreground">12 tables, 48 places</div>
                            </div>
                            <button className="p-1 rounded-md hover:bg-muted">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                          </div>
                         
                          <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                            <div>
                              <div className="font-medium">VIP</div>
                              <div className="text-xs text-muted-foreground">4 tables, 16 places</div>
                            </div>
                            <button className="p-1 rounded-md hover:bg-muted">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                          </div>
                         
                          <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                            <div>
                              <div className="font-medium">Bar</div>
                              <div className="text-xs text-muted-foreground">6 tables, 18 places</div>
                            </div>
                            <button className="p-1 rounded-md hover:bg-muted">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                          </div>
                        </div>
                        
                        <button className="w-full mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Ajouter une nouvelle zone
                        </button>
                      </div>
                      
                      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Statistiques des réservations</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Réservations cette semaine</span>
                              <span className="font-medium">24</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full" style={{width: '60%'}}></div>
                            </div>
                          </div>
                         
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Taux d'occupation</span>
                              <span className="font-medium">78%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full" style={{width: '78%'}}></div>
                            </div>
                          </div>
                         
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Annulations</span>
                              <span className="font-medium">5%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div className="h-2 bg-red-500 rounded-full" style={{width: '5%'}}></div>
                            </div>
                          </div>
                         
                          <div className="pt-4 mt-4 border-t">
                            <div className="text-sm font-medium mb-2">Zone la plus demandée</div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                              <div>Terrasse (42% des réservations)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ResponsiveLayout>
            </Route>
            
            <Route path="/club/pos">
              <POSManagementPage />
            </Route>
            
            {/* Alias pour la page principale du POS */}
            <Route path="/club/dashboard">
              <POSManagementPage />
            </Route>
            
            <Route path="/club/pos-catalog">
              <POSCatalogPage />
            </Route>
            
            {/* Alias pour faciliter l'accès */}
            <Route path="/club/catalog">
              <POSCatalogPage />
            </Route>
            
            <Route path="/club/pos-tables">
              <POSTablesPage />
            </Route>
            
            {/* Alias pour faciliter l'accès */}
            <Route path="/club/tables">
              <POSTablesPage />
            </Route>
            
            <Route path="/club/pos-login">
              <POSLoginPage />
            </Route>
            
            <Route path="/club/pos-kitchen">
              <POSKitchenPage />
            </Route>
            
            {/* Alias pour faciliter l'accès */}
            <Route path="/club/kitchen">
              <POSKitchenPage />
            </Route>
            
            <Route path="/club/pos-bar">
              <POSBarPage />
            </Route>
            
            {/* Alias pour faciliter l'accès */}
            <Route path="/club/bar">
              <POSBarPage />
            </Route>
            
            <Route path="/club/pos-history">
              <POSHistoryPage />
            </Route>
            
            {/* Alias pour faciliter l'accès */}
            <Route path="/club/history">
              <POSHistoryPage />
            </Route>
            
            <Route path="/club/bi-dashboard">
              <BIDashboardPage />
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
                  <ClubsManagementPage />
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