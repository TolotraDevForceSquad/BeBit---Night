import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartyLoader from "@/components/PartyLoader";

export default function SimpleAuth() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerRole, setRegisterRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Détecter si le paramètre tab=register est dans l'URL
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  });
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", loginUsername, loginPassword);
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Stocker les données utilisateur dans localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // Redirection selon le rôle
        if (userData.role === 'admin') {
          window.location.href = "/admin/moderation";
        } else if (userData.role === 'club') {
          window.location.href = "/club";
        } else if (userData.role === 'artist') {
          window.location.href = "/artist";
        } else {
          window.location.href = "/user/explorer";
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Identifiants invalides");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Erreur de connexion au serveur");
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register attempt with:", registerUsername, registerPassword, registerEmail, registerRole, registerPhone);
    setError("");
    
    // Vérification du mot de passe de confirmation
    if (registerPassword !== registerConfirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    // Vérification du numéro de téléphone pour les artistes et clubs
    if ((registerRole === "artist" || registerRole === "club") && !registerPhone) {
      setError("Le numéro de téléphone est obligatoire pour les comptes artiste et club");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
          email: registerEmail,
          role: registerRole,
          phone: registerPhone || null,
          // Champs par défaut pour la création d'utilisateur
          firstName: registerUsername,
          lastName: registerUsername,
          city: "Antananarivo",
          country: "Madagascar",
          isVerified: false
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Sauvegarder dans localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // Redirection selon le type de compte
        if (userData.role === 'admin') {
          window.location.href = "/admin/moderation";
        } else if (userData.role === 'club') {
          window.location.href = "/club";
        } else if (userData.role === 'artist') {
          window.location.href = "/artist";
        } else {
          window.location.href = "/user/explorer";
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de l'inscription");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Erreur de connexion au serveur");
      setIsLoading(false);
    }
  };
  
  const loginForm = (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="login-username">
          Nom d'utilisateur
        </label>
        <input
          id="login-username"
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="login-password">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
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
          "Se connecter"
        )}
      </button>
    </form>
  );
  
  const registerForm = (
    <form onSubmit={handleRegister}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="register-username">
          Nom d'utilisateur
        </label>
        <input
          id="register-username"
          type="text"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="register-password">
          Mot de passe
        </label>
        <input
          id="register-password"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="register-confirm-password">
          Confirmer le mot de passe
        </label>
        <input
          id="register-confirm-password"
          type="password"
          value={registerConfirmPassword}
          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="register-role">
          Type de compte
        </label>
        <select
          id="register-role"
          value={registerRole}
          onChange={(e) => setRegisterRole(e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-muted"
          required
        >
          <option value="user">Utilisateur</option>
          <option value="artist">Artiste</option>
          <option value="club">Club / Établissement</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      
      {/* Champ de téléphone pour les artistes et clubs */}
      {(registerRole === "artist" || registerRole === "club") && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="register-phone">
            Numéro de téléphone
          </label>
          <input
            id="register-phone"
            type="tel"
            value={registerPhone}
            onChange={(e) => setRegisterPhone(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-muted"
            placeholder="+261 xx xx xxx xx"
            required={registerRole === "artist" || registerRole === "club"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Nécessaire pour la vérification de votre compte {registerRole === "artist" ? "d'artiste" : "de club"}
          </p>
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors relative"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-pulse">Inscription en cours...</span>
          </span>
        ) : (
          "S'inscrire"
        )}
      </button>
    </form>
  );
  
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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Be bit.</span>
          </h1>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Connexion</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {loginForm}
            </TabsContent>
            
            <TabsContent value="register">
              {registerForm}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}