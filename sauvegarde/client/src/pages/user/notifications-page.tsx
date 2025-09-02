import { useEffect, useState } from "react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Bell, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les notifications
type Notification = {
  id: number;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: "event" | "artist" | "club" | "system";
};

// Données statiques pour les tests
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Nouvel événement de DJ Elektra",
    content: "DJ Elektra vient d'annoncer un nouvel événement le 15 décembre. Ne manquez pas cette occasion !",
    date: "2023-12-02T10:30:00",
    isRead: false,
    type: "event",
  },
  {
    id: 2,
    title: "Invitation acceptée",
    content: "Club Oxygen a accepté votre demande de booking pour le 20 décembre.",
    date: "2023-12-01T14:45:00",
    isRead: true,
    type: "club",
  },
  {
    id: 3,
    title: "Nouvel artiste à suivre",
    content: "Basé sur vos préférences, vous pourriez aimer le style de Luna Ray. Découvrez son profil.",
    date: "2023-11-29T09:15:00",
    isRead: true,
    type: "artist",
  },
  {
    id: 4,
    title: "Mise à jour de vos tickets",
    content: "Votre ticket pour l'événement 'House Party avec MC Blaze' est maintenant disponible. Vous pouvez le télécharger depuis votre espace tickets.",
    date: "2023-11-28T16:20:00",
    isRead: false,
    type: "system",
  },
];

export default function NotificationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
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
    
    // Simuler un chargement des notifications
    setNotifications(mockNotifications);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  // Supprimer une notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Formater la date des notifications
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    }
  };
  
  // Obtenir l'icône appropriée selon le type de notification
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">🎵</div>;
      case "artist":
        return <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">🎤</div>;
      case "club":
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">🏢</div>;
      case "system":
        return <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">📱</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">📋</div>;
    }
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Notifications</h1>
      
      <div className="ml-auto">
        <Button variant="ghost" onClick={markAllAsRead}>
          Tout marquer comme lu
        </Button>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout activeItem="notifications" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Vos notifications</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.isRead).length} non lues
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Pas de notifications
            </h3>
            <p className="text-muted-foreground">
              Vous n'avez aucune notification pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all ${!notification.isRead ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(notification.type)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationDate(notification.date)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.content}
                      </p>
                      
                      <div className="flex justify-end mt-3">
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marquer comme lu
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}