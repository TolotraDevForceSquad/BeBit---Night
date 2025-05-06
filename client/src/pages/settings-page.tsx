import { useEffect, useState } from "react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  LogOut 
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [, setLocation] = useLocation();
  const isMobile = useMobile();

  // Paramètres
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [locationEnabled, setLocationEnabled] = useState(true);
  
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
    } else {
      // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
      setLocation("/auth");
    }
  }, [setLocation]);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setLocation("/auth");
  };

  // Header content for the layout
  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg">
        Paramètres
      </h1>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="settings"
      headerContent={headerContent}
    >
      <div className="max-w-4xl mx-auto">
        {!isMobile && (
          <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Sécurité</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={user?.firstName || ""} 
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={user?.lastName || ""} 
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input 
                    id="username" 
                    defaultValue={user?.username || ""} 
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ""} 
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    defaultValue={user?.phone || ""} 
                    placeholder="+33 6 XX XX XX XX"
                  />
                </div>
              </div>
              <Button>Enregistrer les modifications</Button>
            </div>
          </TabsContent>
          
          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Paramètres de notification</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des mises à jour par email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotificationsEnabled} 
                    onCheckedChange={setEmailNotificationsEnabled} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Préférences */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Préférences d'affichage</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">Changer l'apparence de l'application</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <Switch 
                      id="dark-mode" 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode} 
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-base">Langue</Label>
                  <RadioGroup value={language} onValueChange={setLanguage} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fr" id="fr" />
                      <Label htmlFor="fr">Français</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="en" />
                      <Label htmlFor="en">English</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location" className="text-base">Services de localisation</Label>
                    <p className="text-sm text-muted-foreground">Permettre à l'application d'accéder à votre position</p>
                  </div>
                  <Switch 
                    id="location" 
                    checked={locationEnabled} 
                    onCheckedChange={setLocationEnabled} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Sécurité du compte</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Changer le mot de passe</Button>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appareils connectés</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-xs text-muted-foreground">Dernière connexion: aujourd'hui</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Déconnecter</Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium text-destructive mb-2">Zone de danger</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  La déconnexion mettra fin à votre session sur tous les appareils.
                </p>
                <Button 
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}