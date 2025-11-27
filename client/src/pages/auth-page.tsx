import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { useState } from "react";
// Temporairement, ne pas utiliser useAuth pour éviter les erreurs
// import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@shared/schema";
import PartyLoader from "@/components/PartyLoader";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  role: z.enum(["user", "artist", "club"] as const),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les termes et conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: "user",
      acceptTerms: false,
    },
  });

  // État pour gérer les redirections
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    console.log("Login attempt:", data.username);
    setIsLoading(true);
    
    // Simuler un délai pour voir l'animation de chargement
    setTimeout(() => {
      // Simuler une connexion réussie avec redirection directe
    if (data.username === "user1" && data.password === "password123") {
      // Stocker dans localStorage pour simulation d'authentification
      localStorage.setItem('auth_user', JSON.stringify({
        username: data.username,
        role: 'user'
      }));
      // Utiliser window.location pour une redirection forcée
      window.location.href = "/";
      return;
    } else if (data.username === "dj_elektra" && data.password === "password123") {
      localStorage.setItem('auth_user', JSON.stringify({
        username: data.username,
        role: 'artist'
      }));
      window.location.href = "/artist";
      return;
    } else if (data.username === "club_oxygen" && data.password === "password123") {
      localStorage.setItem('auth_user', JSON.stringify({
        username: data.username,
        role: 'club'
      }));
      window.location.href = "/club";
      return;
    } else if (data.username === "admin" && data.password === "adminpass123") {
      localStorage.setItem('auth_user', JSON.stringify({
        username: data.username,
        role: 'admin'
      }));
      window.location.href = "/admin";
      return;
    }
    
    // Afficher un message d'erreur pour les identifiants incorrects
    alert("Identifiants incorrects. Veuillez réessayer.");
    setIsLoading(false);
    }, 1500);
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    console.log("Register attempt:", data);
    setIsLoading(true);
    
    // Simuler un délai pour voir l'animation de chargement
    setTimeout(() => {
      // Stocker dans localStorage pour simulation d'authentification
    localStorage.setItem('auth_user', JSON.stringify({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    }));
    
    // Rediriger vers la page appropriée selon le rôle
    if (data.role === "artist") {
      window.location.href = "/artist";
    } else if (data.role === "club") {
      window.location.href = "/club";
    } else {
      window.location.href = "/";
    }
    }, 1500);
  };
  
  // Si une redirection est définie, effectuer la redirection
  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <PartyLoader />
          </div>
        </div>
      )}
      
      {/* Header with logo */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="font-heading font-bold text-2xl text-white">
            <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="text-white bg-muted hover:bg-accent px-4 py-2 rounded-full text-sm font-medium transition">FR</button>
          <button className="text-white bg-muted hover:bg-accent px-4 py-2 rounded-full text-sm font-medium transition">EN</button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 flex flex-col md:flex-row">
        {/* Left column - intro & graphics for desktop */}
        <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start space-y-8 mb-10 md:mb-0">
          <div className="text-center md:text-left max-w-md">
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
              <span className="text-primary">Be</span> yourself.<br/>
              <span className="text-secondary">bit.</span> connected.
            </h2>
            <p className="text-muted-foreground text-lg">La plateforme qui révolutionne la scène nocturne en connectant artistes et clubs dans un écosystème numérique innovant.</p>
          </div>
          
          {/* Floating cards animation for desktop */}
          <div className="hidden md:flex relative h-80 w-full">
            {/* Artist Card */}
            <div className="absolute top-0 left-10 w-48 h-64 bg-card rounded-xl shadow-lg transform rotate-[-5deg] border border-border overflow-hidden">
              <div className="w-full h-36 bg-muted"></div>
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <i className="fas fa-music text-xs"></i>
                  </div>
                  <span className="font-medium text-sm">DJ Elektra</span>
                </div>
                <div className="text-xs text-muted-foreground">House & Techno • €350/h</div>
                <div className="mt-2 flex">
                  <div className="text-xs bg-muted rounded-full px-2 py-1 mr-1 text-gray-300">House</div>
                  <div className="text-xs bg-muted rounded-full px-2 py-1 text-gray-300">EDM</div>
                </div>
              </div>
            </div>
            
            {/* Club Card */}
            <div className="absolute top-10 left-40 w-48 h-64 bg-card rounded-xl shadow-lg transform rotate-[5deg] border border-border overflow-hidden">
              <div className="w-full h-36 bg-muted"></div>
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-background">
                    <i className="fas fa-building text-xs"></i>
                  </div>
                  <span className="font-medium text-sm">Club Oxygen</span>
                </div>
                <div className="text-xs text-muted-foreground">Paris • Capacité: 300</div>
                <div className="mt-2 flex">
                  <div className="text-xs bg-muted rounded-full px-2 py-1 mr-1 text-gray-300">Live Music</div>
                  <div className="text-xs bg-muted rounded-full px-2 py-1 text-gray-300">DJ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - auth forms */}
        <div className="md:w-1/2 flex flex-col items-center md:items-end">
          <div className="w-full max-w-md bg-card rounded-2xl p-6 border border-border">
            {/* Tab navigation */}
            <div className="flex border-b border-border mb-6">
              <button 
                className={`flex-1 pb-3 text-center font-medium ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-gray-300'}`}
                onClick={() => setActiveTab('login')}
              >
                Connexion
              </button>
              <button 
                className={`flex-1 pb-3 text-center font-medium ${activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-gray-300'}`}
                onClick={() => setActiveTab('signup')}
              >
                Inscription
              </button>
            </div>
            
            {/* Login form */}
            {activeTab === 'login' && (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="votre@email.com"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="remember-me"
                              className="h-4 w-4 text-primary rounded bg-muted border-border focus:ring-primary"
                            />
                          </FormControl>
                          <label htmlFor="remember-me" className="text-sm text-muted-foreground">
                            Se souvenir de moi
                          </label>
                        </FormItem>
                      )}
                    />
                    <a href="#" className="text-sm text-secondary hover:text-secondary/80">Mot de passe oublié?</a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse">Connexion en cours...</span>
                      </span>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                  
                  <div className="relative flex items-center justify-center mt-6">
                    <div className="border-t border-border absolute w-full"></div>
                    <div className="bg-card px-4 relative z-10 text-muted-foreground text-sm">ou continuer avec</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button variant="outline" size="icon" className="flex justify-center items-center py-2 px-4 bg-muted hover:bg-accent rounded-lg transition">
                      <i className="fab fa-google text-white"></i>
                    </Button>
                    <Button variant="outline" size="icon" className="flex justify-center items-center py-2 px-4 bg-muted hover:bg-accent rounded-lg transition">
                      <i className="fab fa-facebook-f text-white"></i>
                    </Button>
                    <Button variant="outline" size="icon" className="flex justify-center items-center py-2 px-4 bg-muted hover:bg-accent rounded-lg transition">
                      <i className="fab fa-apple text-white"></i>
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            
            {/* Sign up form */}
            {activeTab === 'signup' && (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">Prénom</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Prénom"
                              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">Nom</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom"
                              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nom_utilisateur"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="votre@email.com"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">Confirmez le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-muted-foreground mb-1">Je suis</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            className={`py-2 px-4 ${field.value === 'user' ? 'bg-primary text-white' : 'bg-muted hover:bg-accent text-white'} rounded-lg transition border border-border flex items-center justify-center space-x-2`}
                            onClick={() => field.onChange('user')}
                          >
                            <i className="fas fa-user text-xs"></i>
                            <span>Utilisateur</span>
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            className={`py-2 px-4 ${field.value === 'artist' ? 'bg-primary text-white' : 'bg-muted hover:bg-accent text-white'} rounded-lg transition border border-border flex items-center justify-center space-x-2`}
                            onClick={() => field.onChange('artist')}
                          >
                            <i className="fas fa-music text-xs"></i>
                            <span>Artiste</span>
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            className={`py-2 px-4 ${field.value === 'club' ? 'bg-primary text-white' : 'bg-muted hover:bg-accent text-white'} rounded-lg transition border border-border flex items-center justify-center space-x-2 mt-2`}
                            onClick={() => field.onChange('club')}
                          >
                            <i className="fas fa-building text-xs"></i>
                            <span>Club</span>
                          </Button>
                          
                          <div className="mt-2"></div> {/* Empty div for alignment */}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                            className="h-4 w-4 text-primary rounded bg-muted border-border focus:ring-primary"
                          />
                        </FormControl>
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          J'accepte les <a href="#" className="text-secondary hover:text-secondary/80">termes et conditions</a>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse">Inscription en cours...</span>
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
