import { useState, useEffect } from "react";
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, []);
  
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
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white" htmlFor="login-username">
          Nom d'utilisateur
        </label>
        <input
          id="login-username"
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white" htmlFor="login-password">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg relative overflow-hidden group"
        disabled={isLoading}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
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
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white" htmlFor="register-username">
          Nom d'utilisateur
        </label>
        <input
          id="register-username"
          type="text"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
          className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="register-password">
            Mot de passe
          </label>
          <input
            id="register-password"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="register-confirm-password">
            Confirmation
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white" htmlFor="register-role">
          Type de compte
        </label>
        <select
          id="register-role"
          value={registerRole}
          onChange={(e) => setRegisterRole(e.target.value)}
          className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="register-phone">
            Numéro de téléphone
          </label>
          <input
            id="register-phone"
            type="tel"
            value={registerPhone}
            onChange={(e) => setRegisterPhone(e.target.value)}
            className="w-full p-3 border border-[#374151] rounded-lg bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-[#EC4899] transition-all"
            placeholder="+261 xx xx xxx xx"
            required={registerRole === "artist" || registerRole === "club"}
          />
          <p className="text-xs text-[#9CA3AF] mt-1">
            Nécessaire pour la vérification de votre compte {registerRole === "artist" ? "d'artiste" : "de club"}
          </p>
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg relative overflow-hidden group"
        disabled={isLoading}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
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
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Arrière-plan avec éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC4899] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A78BFA] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#60A5FA] opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      {isLoading ? (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <PartyLoader />
          </div>
        </div>
      ) : null}
    
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#A78BFA] bg-clip-text text-transparent">
              Be bit.
            </span>
          </h1>
          <p className="text-[#9CA3AF] text-lg">Votre plateforme musicale à Madagascar</p>
        </div>
        
        <div className="bg-[#111827] rounded-2xl p-8 shadow-2xl border border-[#1F2937] backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6 border border-red-500/20 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-8 bg-[#1F2937] p-1 rounded-xl">
              <TabsTrigger 
                value="login" 
                className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899] data-[state=active]:to-[#DB2777] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899] data-[state=active]:to-[#DB2777] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                Inscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              {loginForm}
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              {registerForm}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center mt-6 text-[#9CA3AF] text-sm">
          <p>Rejoignez la communauté musicale malgache</p>
        </div>
      </div>
    </div>
  );
}