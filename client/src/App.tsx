import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import UserExplorerPage from "@/pages/user/explorer-page";
import ArtistDashboardPage from "@/pages/artist/dashboard-page";
import ClubDashboardPage from "@/pages/club/dashboard-page";
import AdminDashboardPage from "@/pages/admin/dashboard-page";

function App() {
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

export default App;
