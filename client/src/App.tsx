import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import UserExplorerPage from "@/pages/user/explorer-page";
import ArtistDashboardPage from "@/pages/artist/dashboard-page";
import ClubDashboardPage from "@/pages/club/dashboard-page";
import AdminDashboardPage from "@/pages/admin/dashboard-page";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

// Utilisation d'un composant simple pour les routes publiques
function PublicRoutes() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <div className="flex items-center justify-center p-10">
          <AuthPage />
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// Utilisation d'un composant pour les routes protégées
function ProtectedRoutes() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* User Routes */}
      <ProtectedRoute 
        path="/" 
        component={UserExplorerPage} 
        roles={["user"]} 
      />
      
      {/* Artist Routes */}
      <ProtectedRoute 
        path="/artist" 
        component={ArtistDashboardPage} 
        roles={["artist"]} 
      />
      
      {/* Club Routes */}
      <ProtectedRoute 
        path="/club" 
        component={ClubDashboardPage} 
        roles={["club"]} 
      />
      
      {/* Admin Routes */}
      <ProtectedRoute 
        path="/admin" 
        component={AdminDashboardPage} 
        roles={["admin"]} 
      />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Pour l'instant, nous utilisons les routes publiques uniquement pour résoudre les erreurs
  // Une fois que l'authentification sera entièrement implémentée, nous pourrons revenir à ProtectedRoutes
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <PublicRoutes />
    </Suspense>
  );
}

export default App;
