import { useState } from "react";
import PartyLoader from "@/components/PartyLoader";

export default function SimpleAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", username, password);
    setError("");
    setIsLoading(true);
    
    // Simuler un délai pour voir l'animation de chargement
    setTimeout(() => {
      // Simple authentication logic
      if (username === "user1" && password === "password123") {
        // Store user data in localStorage
        localStorage.setItem('auth_user', JSON.stringify({
          username: username,
          role: 'user'
        }));
        
        // Redirection directe vers la page explorer
        window.location.href = "/user/explorer";
      } else if (username === "dj_elektra" && password === "password123") {
        localStorage.setItem('auth_user', JSON.stringify({
          username: username,
          role: 'artist'
        }));
        window.location.href = "/user/explorer";
      } else if (username === "club_oxygen" && password === "password123") {
        localStorage.setItem('auth_user', JSON.stringify({
          username: username,
          role: 'club'
        }));
        window.location.href = "/user/explorer";
      } else if (username === "admin" && password === "adminpass123") {
        localStorage.setItem('auth_user', JSON.stringify({
          username: username,
          role: 'admin'
        }));
        window.location.href = "/user/explorer";
      } else {
        setError("Identifiants invalides");
        setIsLoading(false);
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {isLoading ? (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <PartyLoader />
          </div>
        </div>
      ) : null}
    
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-muted"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-muted"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">Connexion en cours...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <p>Testing credentials:</p>
            <p className="text-muted-foreground">user1 / password123 (User)</p>
            <p className="text-muted-foreground">dj_elektra / password123 (Artist)</p>
            <p className="text-muted-foreground">club_oxygen / password123 (Club)</p>
            <p className="text-muted-foreground">admin / adminpass123 (Admin)</p>
          </div>
        </div>
      </div>
    </div>
  );
}