import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Settings, Bell, Globe, Lock, Palette, Database, 
  DollarSign, FileText, Save, AlertTriangle, Info,
  Check, X, EyeOff, SquareUser, MailCheck, Languages,
  Filter, Star
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

// Types pour les paramètres
interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  enableRegistration: boolean;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  allowDeleteAccounts: boolean;
  defaultCommission: number;
  paymentGateways: {
    stripe: boolean;
    paypal: boolean;
    mvolamobile: boolean;
    orangemoney: boolean;
  };
  allowedFileTypes: string[];
  maxFileSize: number;
  emailNotifications: {
    newUser: boolean;
    newEvent: boolean;
    newBooking: boolean;
    paymentReceived: boolean;
    systemAlert: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    newMessages: boolean;
    eventReminders: boolean;
    bookingUpdates: boolean;
  };
  themePrimary: string;
  themeSecondary: string;
  darkMode: boolean;
  dashboardWidgets: {
    recentActivity: boolean;
    stats: boolean;
    upcomingEvents: boolean;
    pendingApprovals: boolean;
  };
}

// Types pour les logs système
interface SystemLog {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error";
  source: string;
  message: string;
  details?: string;
}

export default function AdminSettingsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isLogDetailsOpen, setIsLogDetailsOpen] = useState(false);
  
  // État initial des paramètres
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Be bit.",
    siteDescription: "Plateforme de découverte d'événements et de collaboration musicale",
    adminEmail: "admin@bebit.app",
    supportEmail: "support@bebit.app",
    maintenanceMode: false,
    maintenanceMessage: "Site en maintenance, merci de revenir plus tard.",
    defaultLanguage: "fr",
    defaultCurrency: "MGA",
    timezone: "Indian/Antananarivo",
    dateFormat: "DD/MM/YYYY",
    enableRegistration: true,
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    allowDeleteAccounts: false,
    defaultCommission: 10,
    paymentGateways: {
      stripe: true,
      paypal: false,
      mvolamobile: true,
      orangemoney: true
    },
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "mp3", "mp4"],
    maxFileSize: 10,
    emailNotifications: {
      newUser: true,
      newEvent: true,
      newBooking: true,
      paymentReceived: true,
      systemAlert: true
    },
    pushNotifications: {
      enabled: true,
      newMessages: true,
      eventReminders: true,
      bookingUpdates: true
    },
    themePrimary: "#8b5cf6",
    themeSecondary: "#ec4899",
    darkMode: true,
    dashboardWidgets: {
      recentActivity: true,
      stats: true,
      upcomingEvents: true,
      pendingApprovals: true
    }
  });
  
  // Simuler des logs système
  const [systemLogs] = useState<SystemLog[]>([
    {
      id: 1,
      timestamp: "2025-05-08T12:34:56",
      level: "info",
      source: "Authentication",
      message: "Connexion admin réussie",
      details: "IP: 192.168.1.100, User-Agent: Mozilla/5.0"
    },
    {
      id: 2,
      timestamp: "2025-05-08T11:22:33",
      level: "warning",
      source: "Database",
      message: "Ralentissement des performances de la base de données",
      details: "Query time > 5s for SELECT * FROM events WHERE date > NOW() ORDER BY date LIMIT 1000"
    },
    {
      id: 3,
      timestamp: "2025-05-08T10:15:20",
      level: "error",
      source: "Payment",
      message: "Échec de paiement Stripe",
      details: "Error: Your card was declined. [Error code: card_declined]"
    },
    {
      id: 4,
      timestamp: "2025-05-08T09:45:12",
      level: "info",
      source: "Events",
      message: "Nouvel événement créé",
      details: "Event ID: 156, Title: Summer Beach Party, Creator: Club Oxygen"
    },
    {
      id: 5,
      timestamp: "2025-05-08T08:30:45",
      level: "warning",
      source: "Storage",
      message: "Espace disque faible",
      details: "Available space: 2.3GB, Used: 87%"
    },
    {
      id: 6,
      timestamp: "2025-05-07T23:12:33",
      level: "info",
      source: "Moderation",
      message: "Nouvel artiste approuvé",
      details: "Artist ID: 89, Name: DJ Pulse, Approved by: admin"
    },
    {
      id: 7,
      timestamp: "2025-05-07T21:05:18",
      level: "error",
      source: "Email",
      message: "Échec d'envoi d'email",
      details: "Recipient: user123@example.com, Error: Connection timeout"
    }
  ]);
  
  // Mettre à jour les paramètres
  const handleSettingsChange = (field: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      
      // Gérer les champs imbriqués comme "paymentGateways.stripe"
      if (field.includes(".")) {
        const [parentField, childField] = field.split(".");
        const parent = parentField as keyof SystemSettings;
        
        if (parent === "paymentGateways") {
          newSettings.paymentGateways = {
            ...newSettings.paymentGateways,
            [childField]: value
          };
        } else if (parent === "emailNotifications") {
          newSettings.emailNotifications = {
            ...newSettings.emailNotifications,
            [childField]: value
          };
        } else if (parent === "pushNotifications") {
          newSettings.pushNotifications = {
            ...newSettings.pushNotifications,
            [childField]: value
          };
        } else if (parent === "dashboardWidgets") {
          newSettings.dashboardWidgets = {
            ...newSettings.dashboardWidgets,
            [childField]: value
          };
        }
      } else {
        (newSettings as any)[field] = value;
      }
      
      return newSettings;
    });
  };
  
  // Sauvegarder les paramètres
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
      setIsLoading(false);
    }, 1000);
  };
  
  // Voir les détails d'un log
  const handleViewLogDetails = (log: SystemLog) => {
    setSelectedLog(log);
    setIsLogDetailsOpen(true);
  };
  
  // Réinitialiser les paramètres aux valeurs par défaut
  const handleResetSettings = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres à leurs valeurs par défaut ?")) {
      // Simuler une requête API
      setIsLoading(true);
      setTimeout(() => {
        // Ici on réinitialiserait avec les vraies valeurs par défaut
        toast({
          title: "Paramètres réinitialisés",
          description: "Tous les paramètres ont été restaurés à leurs valeurs par défaut.",
        });
        setIsLoading(false);
      }, 1000);
    }
  };
  
  return (
    <ResponsiveLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres d'administration</h1>
            <p className="text-muted-foreground">
              Configurez les paramètres de la plateforme Be bit.
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button onClick={() => setLocation("/admin")} variant="outline">
              Retour au Dashboard
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 lg:w-[800px]">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="payment">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Système</span>
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Journaux</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Général */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les informations de base de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="site-name">Nom du site</Label>
                    <Input
                      id="site-name"
                      value={settings.siteName}
                      onChange={(e) => handleSettingsChange("siteName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="admin-email">Email administrateur</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingsChange("adminEmail", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="support-email">Email support</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleSettingsChange("supportEmail", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="default-language">Langue par défaut</Label>
                    <Select
                      value={settings.defaultLanguage}
                      onValueChange={(value) => handleSettingsChange("defaultLanguage", value)}
                    >
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                        <SelectItem value="mg">Malgache</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="default-currency">Devise par défaut</Label>
                    <Select
                      value={settings.defaultCurrency}
                      onValueChange={(value) => handleSettingsChange("defaultCurrency", value)}
                    >
                      <SelectTrigger id="default-currency">
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MGA">Ariary (MGA)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar US (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => handleSettingsChange("timezone", value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indian/Antananarivo">Indian/Antananarivo (UTC+3)</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+1/+2)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="site-description">Description du site</Label>
                  <Textarea
                    id="site-description"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingsChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance-mode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingsChange("maintenanceMode", checked)}
                  />
                  <Label htmlFor="maintenance-mode" className="cursor-pointer">
                    Mode maintenance
                  </Label>
                </div>
                
                {settings.maintenanceMode && (
                  <div className="space-y-3">
                    <Label htmlFor="maintenance-message">Message de maintenance</Label>
                    <Textarea
                      id="maintenance-message"
                      value={settings.maintenanceMessage}
                      onChange={(e) => handleSettingsChange("maintenanceMessage", e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Sécurité */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
                <CardDescription>
                  Configurez les options de sécurité et d'authentification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="max-login-attempts">Tentatives de connexion maximales</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      min={1}
                      max={10}
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingsChange("maxLoginAttempts", parseInt(e.target.value, 10))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Nombre de tentatives avant blocage temporaire
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="session-timeout">Durée de session (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min={5}
                      max={1440}
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingsChange("sessionTimeout", parseInt(e.target.value, 10))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Durée d'inactivité avant déconnexion automatique
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-registration"
                      checked={settings.enableRegistration}
                      onCheckedChange={(checked) => handleSettingsChange("enableRegistration", checked)}
                    />
                    <Label htmlFor="enable-registration" className="cursor-pointer">
                      Activer les inscriptions
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require-email-verification"
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSettingsChange("requireEmailVerification", checked)}
                    />
                    <Label htmlFor="require-email-verification" className="cursor-pointer">
                      Exiger la vérification de l'email
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-delete-accounts"
                      checked={settings.allowDeleteAccounts}
                      onCheckedChange={(checked) => handleSettingsChange("allowDeleteAccounts", checked)}
                    />
                    <Label htmlFor="allow-delete-accounts" className="cursor-pointer">
                      Autoriser la suppression de compte par les utilisateurs
                    </Label>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Contrôle d'accès administrateur</h3>
                  <Button variant="destructive" className="mr-2">
                    Réinitialiser le mot de passe admin
                  </Button>
                  <Button variant="outline">
                    Gérer les rôles utilisateurs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>
                  Configurez les notifications par email et push
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Notifications par email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-user" className="cursor-pointer">
                        <span className="mr-2">Nouvel utilisateur inscrit</span>
                      </Label>
                      <Switch
                        id="email-new-user"
                        checked={settings.emailNotifications.newUser}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications.newUser", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-event" className="cursor-pointer">
                        <span className="mr-2">Nouvel événement créé</span>
                      </Label>
                      <Switch
                        id="email-new-event"
                        checked={settings.emailNotifications.newEvent}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications.newEvent", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-booking" className="cursor-pointer">
                        <span className="mr-2">Nouvelle réservation effectuée</span>
                      </Label>
                      <Switch
                        id="email-new-booking"
                        checked={settings.emailNotifications.newBooking}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications.newBooking", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-payment-received" className="cursor-pointer">
                        <span className="mr-2">Paiement reçu</span>
                      </Label>
                      <Switch
                        id="email-payment-received"
                        checked={settings.emailNotifications.paymentReceived}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications.paymentReceived", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-system-alert" className="cursor-pointer">
                        <span className="mr-2">Alertes système</span>
                      </Label>
                      <Switch
                        id="email-system-alert"
                        checked={settings.emailNotifications.systemAlert}
                        onCheckedChange={(checked) => handleSettingsChange("emailNotifications.systemAlert", checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Notifications push</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-enabled" className="cursor-pointer">
                        <span className="mr-2">Activer les notifications push</span>
                      </Label>
                      <Switch
                        id="push-enabled"
                        checked={settings.pushNotifications.enabled}
                        onCheckedChange={(checked) => handleSettingsChange("pushNotifications.enabled", checked)}
                      />
                    </div>
                    
                    {settings.pushNotifications.enabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-new-messages" className="cursor-pointer">
                            <span className="mr-2">Nouveaux messages</span>
                          </Label>
                          <Switch
                            id="push-new-messages"
                            checked={settings.pushNotifications.newMessages}
                            onCheckedChange={(checked) => handleSettingsChange("pushNotifications.newMessages", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-event-reminders" className="cursor-pointer">
                            <span className="mr-2">Rappels d'événements</span>
                          </Label>
                          <Switch
                            id="push-event-reminders"
                            checked={settings.pushNotifications.eventReminders}
                            onCheckedChange={(checked) => handleSettingsChange("pushNotifications.eventReminders", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-booking-updates" className="cursor-pointer">
                            <span className="mr-2">Mises à jour de réservation</span>
                          </Label>
                          <Switch
                            id="push-booking-updates"
                            checked={settings.pushNotifications.bookingUpdates}
                            onCheckedChange={(checked) => handleSettingsChange("pushNotifications.bookingUpdates", checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Modèles d'emails</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Personnalisez les modèles d'emails envoyés aux utilisateurs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Bienvenue</Button>
                    <Button variant="outline" size="sm">Confirmation de réservation</Button>
                    <Button variant="outline" size="sm">Réinitialisation du mot de passe</Button>
                    <Button variant="outline" size="sm">Vérification de l'email</Button>
                    <Button variant="outline" size="sm">Rappel d'événement</Button>
                    <Button variant="outline" size="sm">Reçu de paiement</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Apparence */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres d'apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="theme-primary">Couleur primaire</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="theme-primary"
                        type="color"
                        value={settings.themePrimary}
                        onChange={(e) => handleSettingsChange("themePrimary", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.themePrimary}
                        onChange={(e) => handleSettingsChange("themePrimary", e.target.value)}
                        className="w-32"
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="theme-secondary">Couleur secondaire</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="theme-secondary"
                        type="color"
                        value={settings.themeSecondary}
                        onChange={(e) => handleSettingsChange("themeSecondary", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.themeSecondary}
                        onChange={(e) => handleSettingsChange("themeSecondary", e.target.value)}
                        className="w-32"
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingsChange("darkMode", checked)}
                  />
                  <Label htmlFor="dark-mode" className="cursor-pointer">
                    Mode sombre par défaut
                  </Label>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Widgets du tableau de bord</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="widget-recent-activity" className="cursor-pointer">
                        <span className="mr-2">Activité récente</span>
                      </Label>
                      <Switch
                        id="widget-recent-activity"
                        checked={settings.dashboardWidgets.recentActivity}
                        onCheckedChange={(checked) => handleSettingsChange("dashboardWidgets.recentActivity", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="widget-stats" className="cursor-pointer">
                        <span className="mr-2">Statistiques</span>
                      </Label>
                      <Switch
                        id="widget-stats"
                        checked={settings.dashboardWidgets.stats}
                        onCheckedChange={(checked) => handleSettingsChange("dashboardWidgets.stats", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="widget-upcoming-events" className="cursor-pointer">
                        <span className="mr-2">Événements à venir</span>
                      </Label>
                      <Switch
                        id="widget-upcoming-events"
                        checked={settings.dashboardWidgets.upcomingEvents}
                        onCheckedChange={(checked) => handleSettingsChange("dashboardWidgets.upcomingEvents", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="widget-pending-approvals" className="cursor-pointer">
                        <span className="mr-2">Approbations en attente</span>
                      </Label>
                      <Switch
                        id="widget-pending-approvals"
                        checked={settings.dashboardWidgets.pendingApprovals}
                        onCheckedChange={(checked) => handleSettingsChange("dashboardWidgets.pendingApprovals", checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Prévisualisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2" style={{borderColor: settings.themePrimary}}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{color: settings.themePrimary}}>Aperçu Carte</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Exemple de contenu</p>
                        <div className="mt-2">
                          <Button className="mr-2" style={{backgroundColor: settings.themePrimary}}>Action</Button>
                          <Button variant="outline" style={{borderColor: settings.themeSecondary, color: settings.themeSecondary}}>Annuler</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="p-4 rounded-lg" style={{backgroundColor: settings.darkMode ? "#1f2937" : "#f9fafb"}}>
                      <h4 className="font-medium mb-2" style={{color: settings.darkMode ? "#f9fafb" : "#1f2937"}}>
                        Aperçu du mode {settings.darkMode ? "sombre" : "clair"}
                      </h4>
                      <p className="text-sm" style={{color: settings.darkMode ? "#d1d5db" : "#4b5563"}}>
                        C'est ainsi que le texte apparaîtra sur votre site.
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <Badge style={{backgroundColor: settings.themePrimary}}>Tag 1</Badge>
                        <Badge style={{backgroundColor: settings.themeSecondary}}>Tag 2</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Paiements */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de paiement</CardTitle>
                <CardDescription>
                  Configurez les passerelles de paiement et les commissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Passerelles de paiement</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-md flex items-center justify-center text-white mr-3">
                          S
                        </div>
                        <div>
                          <p className="font-medium">Stripe</p>
                          <p className="text-xs text-muted-foreground">Cartes de crédit et portefeuilles numériques</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.paymentGateways.stripe}
                        onCheckedChange={(checked) => handleSettingsChange("paymentGateways.stripe", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-600 w-10 h-10 rounded-md flex items-center justify-center text-white mr-3">
                          P
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-xs text-muted-foreground">Paiements internationaux</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.paymentGateways.paypal}
                        onCheckedChange={(checked) => handleSettingsChange("paymentGateways.paypal", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-green-600 w-10 h-10 rounded-md flex items-center justify-center text-white mr-3">
                          M
                        </div>
                        <div>
                          <p className="font-medium">MVola Mobile</p>
                          <p className="text-xs text-muted-foreground">Paiements mobiles locaux</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.paymentGateways.mvolamobile}
                        onCheckedChange={(checked) => handleSettingsChange("paymentGateways.mvolamobile", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-orange-500 w-10 h-10 rounded-md flex items-center justify-center text-white mr-3">
                          O
                        </div>
                        <div>
                          <p className="font-medium">Orange Money</p>
                          <p className="text-xs text-muted-foreground">Paiements mobiles locaux</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.paymentGateways.orangemoney}
                        onCheckedChange={(checked) => handleSettingsChange("paymentGateways.orangemoney", checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Commissions et frais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="default-commission">Commission par défaut (%)</Label>
                      <Input
                        id="default-commission"
                        type="number"
                        min={0}
                        max={100}
                        value={settings.defaultCommission}
                        onChange={(e) => handleSettingsChange("defaultCommission", parseInt(e.target.value, 10))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Pourcentage prélevé sur les ventes de billets
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Retraits et paiements</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        <p className="font-medium">Seuil de retrait</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Les artistes et clubs peuvent retirer leurs fonds à partir de 50,000 Ar.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        <p className="font-medium">Fréquence des paiements automatiques</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Les paiements sont traités automatiquement tous les 15 jours.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Système */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres système</CardTitle>
                <CardDescription>
                  Configuration des paramètres avancés du système
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="show-advanced"
                    checked={showAdvancedSettings}
                    onCheckedChange={setShowAdvancedSettings}
                  />
                  <Label htmlFor="show-advanced">Afficher les paramètres avancés</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Gestion de fichiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <Label htmlFor="max-file-size">Taille maximale de fichier (MB)</Label>
                      <Input
                        id="max-file-size"
                        type="number"
                        min={1}
                        max={50}
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingsChange("maxFileSize", parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Types de fichiers autorisés</Label>
                    <div className="flex flex-wrap gap-2">
                      {settings.allowedFileTypes.map((type) => (
                        <Badge key={type} variant="outline" className="px-3 py-1">
                          <span className="mr-1">.{type}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              const newTypes = settings.allowedFileTypes.filter(t => t !== type);
                              handleSettingsChange("allowedFileTypes", newTypes);
                            }}
                          />
                        </Badge>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newType = prompt("Entrez un type de fichier (sans le point)");
                          if (newType && !settings.allowedFileTypes.includes(newType)) {
                            handleSettingsChange("allowedFileTypes", [...settings.allowedFileTypes, newType]);
                          }
                        }}
                      >
                        + Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
                
                {showAdvancedSettings && (
                  <>
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Caching</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Cache des requêtes</p>
                            <p className="text-xs text-muted-foreground">
                              Met en cache les requêtes API fréquentes
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Vider le cache
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Cache des pages</p>
                            <p className="text-xs text-muted-foreground">
                              Met en cache les pages statiques pour améliorer les performances
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Régénérer le cache
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">API</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Accès API</p>
                            <p className="text-xs text-muted-foreground">
                              Permet l'accès aux points d'API externes
                            </p>
                          </div>
                          <Switch
                            checked={true}
                            onCheckedChange={() => {}}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Limitation de taux</p>
                            <p className="text-xs text-muted-foreground">
                              Limite le nombre de requêtes par IP
                            </p>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <Input
                              type="number"
                              value="100"
                              className="w-20 h-8"
                            />
                            <span className="text-sm">/ min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Tâches planifiées</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tâche</TableHead>
                            <TableHead>Fréquence</TableHead>
                            <TableHead>Dernière exécution</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Nettoyage de la base de données</TableCell>
                            <TableCell>Hebdomadaire</TableCell>
                            <TableCell>07/05/2025 02:00</TableCell>
                            <TableCell><Badge variant="outline" className="bg-green-100 text-green-600">Réussi</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Exécuter</Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Sauvegarde complète</TableCell>
                            <TableCell>Quotidienne</TableCell>
                            <TableCell>08/05/2025 00:00</TableCell>
                            <TableCell><Badge variant="outline" className="bg-green-100 text-green-600">Réussi</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Exécuter</Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Envoi des rappels d'événements</TableCell>
                            <TableCell>Toutes les 6 heures</TableCell>
                            <TableCell>08/05/2025 06:00</TableCell>
                            <TableCell><Badge variant="outline" className="bg-green-100 text-green-600">Réussi</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Exécuter</Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
                
                <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleResetSettings}
                    >
                      Réinitialiser aux valeurs par défaut
                    </Button>
                    <Button variant="outline">
                      Exporter la configuration
                    </Button>
                  </div>
                  
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Journaux */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Journaux système</CardTitle>
                <CardDescription>
                  Consultez les journaux du système pour le dépannage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Filter className="h-4 w-4 mr-1" />
                      <span>Filtrer</span>
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les niveaux</SelectItem>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm">
                    Télécharger les logs
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.level === "info" 
                                  ? "bg-blue-100 text-blue-600" 
                                  : log.level === "warning"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600" 
                              }
                            >
                              {log.level.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.source}</TableCell>
                          <TableCell className="max-w-md truncate">{log.message}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLogDetails(log)}
                            >
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Affichage des 7 entrées les plus récentes sur un total de 3,254 entrées.
                </div>
              </CardContent>
            </Card>
            
            {/* Modal de détails de log */}
            <Dialog open={isLogDetailsOpen} onOpenChange={setIsLogDetailsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Détails du journal</DialogTitle>
                  <DialogDescription>
                    Informations détaillées sur l'entrée de journal
                  </DialogDescription>
                </DialogHeader>
                
                {selectedLog && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Horodatage</p>
                        <p className="text-sm font-mono">
                          {new Date(selectedLog.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Niveau</p>
                        <Badge
                          variant="outline"
                          className={
                            selectedLog.level === "info" 
                              ? "bg-blue-100 text-blue-600" 
                              : selectedLog.level === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600" 
                          }
                        >
                          {selectedLog.level.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Source</p>
                        <p className="text-sm">{selectedLog.source}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">ID</p>
                        <p className="text-sm">{selectedLog.id}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Message</p>
                      <p className="text-sm">{selectedLog.message}</p>
                    </div>
                    
                    {selectedLog.details && (
                      <div>
                        <p className="text-sm font-medium">Détails</p>
                        <div className="mt-1 bg-muted p-3 rounded-md text-xs font-mono whitespace-pre-wrap">
                          {selectedLog.details}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Fermer</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}