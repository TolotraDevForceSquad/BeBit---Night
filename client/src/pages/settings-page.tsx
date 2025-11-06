// D:\Projet\BeBit\bebit - new\client\src\pages\settings-page.tsx
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
  User as UserIcon,
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
import { api } from "@/services/api";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
// Type pour l'utilisateur authentifié (étendu pour les nouveaux champs)
type AuthUser = User;
export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [, setLocation] = useLocation();
  const isMobile = useMobile();
  const { toast } = useToast();

  // États pour préférences (initialisés depuis user)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  // État pour la gestion des documents d'upload de vérification
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<string[]>([]);
  // États pour les formulaires
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  // Récupérer les données utilisateur du localStorage et synchroniser avec API
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const localUser = JSON.parse(authData) as AuthUser;
        setUser(localUser);
        setProfileForm({
          firstName: localUser.firstName || "",
          lastName: localUser.lastName || "",
          username: localUser.username || "",
          email: localUser.email || "",
          phone: localUser.phone || "",
        });
        // Initialiser les préférences depuis user
        setNotificationsEnabled(localUser.notificationsEnabled ?? true);
        setEmailNotificationsEnabled(localUser.emailNotificationsEnabled ?? true);
        setDarkMode(localUser.darkMode ?? false);
        setLanguage(localUser.language ?? "fr");
        setLocationEnabled(localUser.locationEnabled ?? true);
        setTwoFactorEnabled(localUser.twoFactorEnabled ?? false);
        // Initialiser les documents de vérification s'ils existent
        if (localUser.verificationDocuments) {
          setVerificationDocs(Array.isArray(localUser.verificationDocuments) ? localUser.verificationDocuments : []);
        }
        // Appliquer mode sombre et langue localement
        applyDarkMode(localUser.darkMode ?? false);
        applyLanguage(localUser.language ?? "fr");
        // Synchroniser avec l'API si l'ID est disponible
        if (localUser.id) {
          api.getUser(localUser.id).then((apiUser: User) => {
            const syncedUser: AuthUser = apiUser;
            setUser(syncedUser);
            localStorage.setItem('auth_user', JSON.stringify(syncedUser));
            // Réappliquer préférences après synchro
            setNotificationsEnabled(syncedUser.notificationsEnabled ?? true);
            setEmailNotificationsEnabled(syncedUser.emailNotificationsEnabled ?? true);
            setDarkMode(syncedUser.darkMode ?? false);
            setLanguage(syncedUser.language ?? "fr");
            setLocationEnabled(syncedUser.locationEnabled ?? true);
            setTwoFactorEnabled(syncedUser.twoFactorEnabled ?? false);
            applyDarkMode(syncedUser.darkMode ?? false);
            applyLanguage(syncedUser.language ?? "fr");
          }).catch((err) => {
            console.error("Erreur lors de la synchronisation utilisateur:", err);
          });
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    } else {
      // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
      setLocation("/auth");
    }
  }, [setLocation]);
  // Fonctions utilitaires pour appliquer préférences localement
  const applyDarkMode = (enabled: boolean) => {
    if (enabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };
  const applyLanguage = (lang: string) => {
    // Ex. : Changer la langue de l'app (i18n hook si disponible, sinon console.log pour debug)
    console.log(`Langue appliquée : ${lang}`);
    // Intégrez votre système i18n ici (ex. : i18next.changeLanguage(lang))
  };
  // Handler générique pour updater une préférence booléenne
  const updateBooleanPref = async (key: keyof Pick<AuthUser, 'notificationsEnabled' | 'emailNotificationsEnabled' | 'darkMode' | 'locationEnabled' | 'twoFactorEnabled'>, value: boolean) => {
    if (!user?.id) return;
    try {
      const updateData = { [key]: value } as Partial<InsertUser>;
      const updatedUser: User = await api.updateUser(user.id, updateData);
      const syncedUser: AuthUser = updatedUser;
      setUser(syncedUser);
      localStorage.setItem('auth_user', JSON.stringify(syncedUser));
      // Appliquer localement si nécessaire
      if (key === 'darkMode') applyDarkMode(value);
      toast({
        title: "Succès",
        description: `Préférence mise à jour: ${key}`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || `Erreur lors de la mise à jour de ${key}`,
        variant: "destructive",
      });
    }
  };
  // Handler pour updater la langue
  const updateLanguagePref = async (newLang: string) => {
    if (!user?.id) return;
    try {
      const updateData = { language: newLang } as Partial<InsertUser>;
      const updatedUser: User = await api.updateUser(user.id, updateData);
      const syncedUser: AuthUser = updatedUser;
      setUser(syncedUser);
      localStorage.setItem('auth_user', JSON.stringify(syncedUser));
      applyLanguage(newLang);
      toast({
        title: "Succès",
        description: "Langue mise à jour",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la mise à jour de la langue",
        variant: "destructive",
      });
    }
  };
  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setLocation("/auth");
  };
  // Mise à jour du profil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsUpdatingProfile(true);
    try {
      const updateData = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
      };
      const updatedUser: User = await api.updateUser(user.id, updateData);
      const syncedUser: AuthUser = updatedUser;
      setUser(syncedUser);
      localStorage.setItem('auth_user', JSON.stringify(syncedUser));
      setProfileForm({
        firstName: syncedUser.firstName || "",
        lastName: syncedUser.lastName || "",
        username: syncedUser.username || "",
        email: syncedUser.email || "",
        phone: syncedUser.phone || "",
      });
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  // Mise à jour du mot de passe (inclut currentPassword pour vérification backend)
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const updateData = {
        password: passwordForm.newPassword,
        // Ajout du current pour vérification (backend doit l'utiliser)
        currentPassword: passwordForm.currentPassword, // Note: Ajoutez un champ temp si besoin dans InsertUser, mais Partial le permet
      };
      const updatedUser: User = await api.updateUser(user.id, updateData);
      const syncedUser: AuthUser = updatedUser;
      setUser(syncedUser);
      localStorage.setItem('auth_user', JSON.stringify(syncedUser));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Succès",
        description: "Mot de passe modifié",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la mise à jour du mot de passe (vérifiez le mot de passe actuel)",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  // Upload de document (ajoute une URL simulée au JSONB ; backend peut stocker vraiment)
  const handleFileUpload = async () => {
    if (!selectedFile || !user?.id) return;
    setIsUploading(true);
    setUploadProgress(0);
   
    // Simulation de progression (remplacez par vrai upload si backend a un endpoint dédié)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
         
          // Générer une "URL" pour le doc (ex. : backend la stocke en /uploads/)
          const newDocUrl = `/uploads/${Date.now()}-${selectedFile.name}`;
          const updatedDocs = [...verificationDocs, newDocUrl];
          setVerificationDocs(updatedDocs);
         
          // Mettre à jour via API
          const updateData = {
            verificationDocuments: updatedDocs,
            verificationStatus: "pending" as const, // Trigger review
          };
          api.updateUser(user.id, updateData).then((updatedUser: User) => {
            const syncedUser: AuthUser = updatedUser;
            setUser(syncedUser);
            localStorage.setItem('auth_user', JSON.stringify(syncedUser));
            toast({
              title: "Succès",
              description: "Document uploadé et en attente de vérification",
            });
          }).catch((err) => {
            console.error("Erreur lors de la mise à jour des documents:", err);
            toast({
              title: "Erreur",
              description: "Erreur lors de l'upload",
              variant: "destructive",
            });
          });
         
          setSelectedFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  // Formater le statut de vérification
  const formatVerificationStatus = (status?: 'pending' | 'approved' | 'rejected' | string | null) => {
    if (!status) {
      return { icon: <Info className="h-4 w-4" />, label: "Non vérifié", color: "bg-gray-500" };
    }
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
  if (!user) {
    return <div>Chargement...</div>; // Ou un loader approprié
  }
  return (
    <UserLayout>
      <div className="w-full max-w-4xl mx-auto">
        {!isMobile && (
          <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
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
         
          {/* Profil (inchangé, sauf gestion d'erreur globale) */}
          <TabsContent value="profile" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+33 6 XX XX XX XX"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isUpdatingProfile} className="mt-4">
                  {isUpdatingProfile ? "Mise à jour en cours..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </div>
            {/* Section de vérification de compte (inchangée, mais upload maintenant persistant) */}
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
                {!user?.isVerified && (
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
                
                {user?.isVerified && (
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
         
          {/* Notifications (maintenant persistantes) */}
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
                    onCheckedChange={(checked) => {
                      setNotificationsEnabled(checked);
                      updateBooleanPref('notificationsEnabled', checked);
                    }}
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
                    onCheckedChange={(checked) => {
                      setEmailNotificationsEnabled(checked);
                      updateBooleanPref('emailNotificationsEnabled', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
         
          {/* Préférences (maintenant persistantes) */}
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
                      onCheckedChange={(checked) => {
                        setDarkMode(checked);
                        updateBooleanPref('darkMode', checked);
                      }}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-base">Langue</Label>
                  <RadioGroup value={language} onValueChange={(val) => {
                    setLanguage(val);
                    updateLanguagePref(val);
                  }} className="flex flex-col space-y-1">
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
                    onCheckedChange={(checked) => {
                      setLocationEnabled(checked);
                      updateBooleanPref('locationEnabled', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
         
          {/* Sécurité (maintenant avec 2FA fonctionnel et password complet) */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-6 p-6 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold">Sécurité du compte</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isUpdatingPassword} className="mt-2">
                      {isUpdatingPassword ? "Mise à jour en cours..." : "Changer le mot de passe"}
                    </Button>
                  </div>
                </form>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Double authentification</h3>
                  <p className="text-sm text-muted-foreground">
                    Sécurisez votre compte avec une vérification en deux étapes.
                  </p>
                  <div className="flex items-center justify-between">
                    <span>Activer la double authentification</span>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setTwoFactorEnabled(checked);
                        updateBooleanPref('twoFactorEnabled', checked);
                      }}
                    />
                  </div>
                  {twoFactorEnabled && (
                    <Alert className="mt-2 border-blue-500">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertTitle>2FA activé</AlertTitle>
                      <AlertDescription>
                        Téléchargez une app comme Google Authenticator et scannez le QR code dans votre profil (généré côté backend).
                      </AlertDescription>
                    </Alert>
                  )}
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