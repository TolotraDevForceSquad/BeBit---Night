import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { UserRole } from "@shared/schema";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  roles: UserRole[];
}

export function ProtectedRoute({
  path,
  component: Component,
  roles,
}: ProtectedRouteProps) {
  // Essayons d'accéder à useAuth et gérons les erreurs
  try {
    const { user, isLoading } = useAuth();

    return (
      <Route path={path}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <Redirect to="/auth" />
        ) : !roles.includes(user.role) ? (
          <Redirect to={
            user.role === "admin" 
              ? "/admin" 
              : user.role === "artist" 
                ? "/artist" 
                : user.role === "club" 
                  ? "/club" 
                  : "/"
          } />
        ) : (
          <Component />
        )}
      </Route>
    );
  } catch (error) {
    // Si une erreur se produit avec useAuth, rediriger vers la page d'authentification
    console.error("Error in ProtectedRoute:", error);
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
}
