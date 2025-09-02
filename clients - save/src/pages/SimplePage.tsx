import { useState, useEffect } from "react";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
};

export default function SimplePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 p-4 bg-card rounded-lg border border-border">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
          
          {user ? (
            <div className="flex items-center">
              <div className="mr-4">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div>Non connecté</div>
          )}
        </header>
        
        {/* Main content */}
        <main className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">
            Bienvenue sur la page {user?.role || ""}
          </h2>
          
          <p className="mb-6 text-muted-foreground">
            Vous êtes connecté en tant que {user?.username || "invité"}.
          </p>
          
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Navigation simplifiée:</h3>
            <div className="flex flex-wrap gap-2">
              <a href="/" className="px-4 py-2 bg-primary text-white rounded-md">
                Accueil
              </a>
              <a href="/auth" className="px-4 py-2 bg-secondary text-white rounded-md">
                Authentification
              </a>
              <button
                onClick={handleLogout} 
                className="px-4 py-2 bg-destructive text-white rounded-md"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}