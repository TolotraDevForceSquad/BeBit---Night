import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  LogOut,
  Upload,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import UserLayout from '../layouts/user-layout';

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  verified?: boolean; // Indique si le compte est vérifié (pour artistes et clubs)
  verificationStatus?: 'pending' | 'approved' | 'rejected'; // Statut de vérification
  verificationDocuments?: string[]; // Liste des documents chargés pour la vérification
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
  
  // État pour la gestion des documents d'upload de vérification
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<string[]>([]);
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
        
        // Initialiser les documents de vérification s'ils existent
        if (userData.verificationDocuments) {
          setVerificationDocs(userData.verificationDocuments);
        }
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
  
  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Simuler l'upload de document (dans une vraie application, cela serait un appel API)
  const handleFileUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simuler une progression d'upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Ajouter le document à la liste
          const newDocName = `${selectedFile.name}`;
          setVerificationDocs(prev => [...prev, newDocName]);
          
          // Mettre à jour l'utilisateur dans localStorage
          if (user) {
            const updatedUser = {
              ...user,
              verificationDocuments: [...(verificationDocs || []), newDocName],
              verificationStatus: 'pending' as 'pending' | 'approved' | 'rejected' | undefined
            };
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
          
          setSelectedFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Formater le statut de vérification
  const formatVerificationStatus = (status?: 'pending' | 'approved' | 'rejected' | string) => {
    switch(status) {
      case 'pending':
        return { icon: <Clock className="h-4 w-4" />, label: "En attente", color: "bg-yellow-500" };
      case 'approved':
        return { icon: <CheckCircle2 className="h-4 w-4" />, label: "Approuvé", color: "bg-green-500" };
      case 'rejected':
        return { icon: <XCircle className="h-4 w-4" />, label: "Refusé", color: "bg-red-500" };
      default:
        return { icon: <Info className="h-4 w-4" />, label: "Non vérifié", color: "bg-gray-500" };
    }
  };

  return (
    <UserLayout>
      <div className="w-full max-w-4xl mx-auto">
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

            {/* Section de vérification de compte (uniquement pour les artistes et clubs) */}
            {(user?.role === 'artist' || user?.role === 'club') && (
              <div className="space-y-6 p-6 bg-card border rounded-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Vérification du compte</h2>
                  {user?.verificationStatus && (
                    <Badge className={`${formatVerificationStatus(user?.verificationStatus).color} flex items-center gap-1 text-white`}>
                      {formatVerificationStatus(user?.verificationStatus).icon}
                      <span>{formatVerificationStatus(user?.verificationStatus).label}</span>
                    </Badge>
                  )}
                </div>

                {!user?.verified && (
                  <Alert className={user?.verificationStatus === 'rejected' ? "border-red-500" : "border-yellow-500"}>
                    <AlertTriangle className={`h-4 w-4 ${user?.verificationStatus === 'rejected' ? "text-red-500" : "text-yellow-500"}`} />
                    <AlertTitle>
                      {user?.verificationStatus === 'rejected' 
                        ? "Votre vérification a été refusée" 
                        : user?.verificationStatus === 'pending'
                          ? "Votre compte est en cours de vérification"
                          : "Votre compte n'est pas vérifié"}
                    </AlertTitle>
                    <AlertDescription>
                      {user?.verificationStatus === 'rejected' 
                        ? "Votre demande de vérification a été refusée. Veuillez soumettre de nouveaux documents."
                        : user?.verificationStatus === 'pending'
                          ? "Notre équipe examine actuellement vos documents. La vérification peut prendre jusqu'à 48 heures."
                          : user?.role === 'artist' 
                            ? "Les artistes doivent être vérifiés pour recevoir des invitations et des paiements. Veuillez charger vos documents d'identité et professionnels."
                            : "Les clubs doivent être vérifiés pour organiser des événements. Veuillez charger les documents attestant de votre établissement."}
                    </AlertDescription>
                  </Alert>
                )}
                
                {user?.verified && (
                  <Alert className="border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Compte vérifié</AlertTitle>
                    <AlertDescription>
                      Votre compte a été vérifié avec succès. Vous avez maintenant accès à toutes les fonctionnalités.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">Documents soumis</h3>
                  
                  {verificationDocs.length > 0 ? (
                    <div className="space-y-2">
                      {verificationDocs.map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-lg">
                          <FileCheck className="h-5 w-5 text-primary mr-2" />
                          <span className="flex-1">{doc}</span>
                          <Badge variant="outline">Document {index + 1}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun document soumis pour vérification.</p>
                  )}
                </div>

                {(user?.verificationStatus !== 'pending' || !user?.verificationStatus) && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Soumettre des documents</h3>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="verification-doc">Choisir un document</Label>
                      <Input 
                        id="verification-doc" 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {user?.role === 'artist' 
                          ? "Veuillez soumettre une pièce d'identité et des preuves de votre activité artistique (contrats, affiches d'événements passés, etc.)"
                          : "Veuillez soumettre un KBIS, une licence ou tout document officiel de votre établissement."}
                      </p>
                      
                      {isUploading && (
                        <div className="space-y-2 my-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center">{uploadProgress}% chargé</p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full mt-2" 
                        disabled={!selectedFile || isUploading}
                        onClick={handleFileUpload}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? "Chargement en cours..." : "Charger le document"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                    <Label htmlFor="location-enabled" className="text-base">Géolocalisation</Label>
                    <p className="text-sm text-muted-foreground">Activer la localisation pour découvrir les événements à proximité</p>
                  </div>
                  <Switch 
                    id="location-enabled" 
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
                <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <Button className="mt-2">Changer le mot de passe</Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Double authentification</h3>
                  <p className="text-sm text-muted-foreground">
                    Sécurisez votre compte avec une vérification en deux étapes.
                  </p>
                  <Button variant="outline" className="mt-2">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Configurer la double authentification
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-destructive">Déconnexion</h3>
                  <p className="text-sm text-muted-foreground">
                    Déconnectez-vous de votre compte sur cet appareil.
                  </p>
                  <Button 
                    variant="destructive" 
                    className="mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}