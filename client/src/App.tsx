import { Suspense, useState, useEffect } from "react";
import SimpleAuth from "./pages/simple-auth";

// Page d'accueil simple pour un utilisateur connecté
function HomePage({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 py-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Connecté en tant que <strong>{user.username}</strong> ({user.role})
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">
                  Bienvenue sur Be bit.
                </h2>
                <p className="text-muted-foreground mb-4">
                  Votre plateforme événementielle interactive.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <h3 className="font-medium">Découvrir des événements</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explorez des événements près de chez vous
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <h3 className="font-medium">Connectez-vous avec des artistes</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Découvrez de nouveaux talents
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">Votre profil</h3>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium">Nom d'utilisateur</p>
                  <p className="text-muted-foreground">{user.username}</p>
                </div>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin text-primary">Chargement...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin text-primary">Chargement...</div>
      </div>
    }>
      {user ? (
        <HomePage user={user} onLogout={handleLogout} />
      ) : (
        <SimpleAuth />
      )}
    </Suspense>
  );
}

export default App;