import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  AlertTriangle, Ban, Check, XCircle, Eye, Search,
  ChevronRight, ChevronLeft, Filter, RefreshCw, User, Calendar,
  Clock, Music, Building
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types pour la modération
type ReportReason = "inappropriate_content" | "fake_account" | "spam" | "illegal_activity" | "harassment" | "other";

// Type pour les utilisateurs signalés
type UserReport = {
  id: number;
  userId: number;
  username: string;
  userRole: string;
  userImage?: string;
  dateCreated: string;
  reportCount: number;
  reports: {
    id: number;
    reason: ReportReason;
    description: string;
    reportedBy: string;
    date: string;
    status: "pending" | "resolved" | "dismissed";
  }[];
  accountStatus: "active" | "suspended" | "banned";
};

// Type pour les événements signalés
type EventReport = {
  id: number;
  eventId: number;
  eventTitle: string;
  clubName: string;
  clubId: number;
  coverImage: string;
  eventDate: string;
  dateCreated: string;
  reports: {
    id: number;
    reason: ReportReason;
    description: string;
    reportedBy: string;
    date: string;
    status: "pending" | "resolved" | "dismissed";
  }[];
  eventStatus: "active" | "suspended" | "banned";
};

// Type pour les éléments en attente d'approbation
type PendingItem = {
  id: number;
  type: "user" | "artist" | "club" | "event";
  name: string;
  image?: string;
  date: string;
  details: string;
};

// Données fictives
const mockUserReports: UserReport[] = [
  {
    id: 1,
    userId: 101,
    username: "partyanimal",
    userRole: "user",
    dateCreated: "2023-11-15T09:45:22",
    reportCount: 3,
    reports: [
      {
        id: 1,
        reason: "harassment",
        description: "Commentaires inappropriés sur plusieurs événements",
        reportedBy: "dj_elektra",
        date: "2023-11-20T15:30:00",
        status: "pending"
      },
      {
        id: 2,
        reason: "inappropriate_content",
        description: "Contenu offensant dans sa bio",
        reportedBy: "cluboxygen",
        date: "2023-11-18T10:15:00",
        status: "pending"
      },
      {
        id: 3,
        reason: "spam",
        description: "Spamme les commentaires",
        reportedBy: "john_doe",
        date: "2023-11-16T14:50:00",
        status: "resolved"
      }
    ],
    accountStatus: "active"
  },
  {
    id: 2,
    userId: 102,
    username: "dj_shadybeats",
    userRole: "artist",
    userImage: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=80&h=80&fit=crop",
    dateCreated: "2023-11-08T11:20:33",
    reportCount: 5,
    reports: [
      {
        id: 4,
        reason: "fake_account",
        description: "Faux compte se faisant passer pour un DJ connu",
        reportedBy: "real_dj",
        date: "2023-11-14T09:20:00",
        status: "pending"
      },
      {
        id: 5,
        reason: "inappropriate_content",
        description: "Photos inappropriées",
        reportedBy: "moderator1",
        date: "2023-11-12T16:40:00",
        status: "pending"
      }
    ],
    accountStatus: "suspended"
  }
];

const mockEventReports: EventReport[] = [
  {
    id: 1,
    eventId: 201,
    eventTitle: "After Party Underground",
    clubName: "Le Bunker",
    clubId: 301,
    coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=240&h=120&fit=crop",
    eventDate: "2023-12-25T02:00:00",
    dateCreated: "2023-11-10T08:30:00",
    reports: [
      {
        id: 1,
        reason: "illegal_activity",
        description: "Promotion de substances illicites",
        reportedBy: "responsible_user",
        date: "2023-11-20T15:30:00",
        status: "pending"
      },
      {
        id: 2,
        reason: "inappropriate_content",
        description: "Descriptions et images inappropriées",
        reportedBy: "club_owner",
        date: "2023-11-18T10:15:00",
        status: "pending"
      }
    ],
    eventStatus: "active"
  },
  {
    id: 2,
    eventId: 202,
    eventTitle: "Rave Illégale",
    clubName: "Warehouse",
    clubId: 302,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&h=120&fit=crop",
    eventDate: "2023-12-28T23:00:00",
    dateCreated: "2023-11-12T14:22:00",
    reports: [
      {
        id: 3,
        reason: "illegal_activity",
        description: "Événement sans autorisations légales",
        reportedBy: "concerned_citizen",
        date: "2023-11-19T11:10:00",
        status: "pending"
      }
    ],
    eventStatus: "suspended"
  }
];

const mockPendingItems: PendingItem[] = [
  {
    id: 1,
    type: "artist",
    name: "DJ New Talent",
    image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=80&h=80&fit=crop",
    date: "2023-11-22T09:15:30",
    details: "DJ Techno, Paris, France"
  },
  {
    id: 2,
    type: "club",
    name: "Club Metropolis",
    image: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=80&h=80&fit=crop",
    date: "2023-11-21T14:20:10",
    details: "Club de Nuit, Paris, France, Capacité: 500"
  },
  {
    id: 3,
    type: "event",
    name: "Techno Night XL",
    image: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=80&h=80&fit=crop",
    date: "2023-11-20T11:05:45",
    details: "Club Oxygen, 24 Déc 2023, 22:00"
  },
  {
    id: 4,
    type: "user",
    name: "music_lover_22",
    date: "2023-11-19T16:30:20",
    details: "Utilisateur standard"
  }
];

// Fonctions d'aide
function getReasonLabel(reason: ReportReason): string {
  const labels: Record<ReportReason, string> = {
    inappropriate_content: "Contenu inapproprié",
    fake_account: "Faux compte",
    spam: "Spam",
    illegal_activity: "Activité illégale",
    harassment: "Harcèlement",
    other: "Autre"
  };
  return labels[reason] || reason;
}

function getReasonBadgeColor(reason: ReportReason): string {
  const colors: Record<ReportReason, string> = {
    inappropriate_content: "bg-orange-500/10 text-orange-500 border-orange-500/25",
    fake_account: "bg-blue-500/10 text-blue-500 border-blue-500/25",
    spam: "bg-yellow-500/10 text-yellow-500 border-yellow-500/25",
    illegal_activity: "bg-red-500/10 text-red-500 border-red-500/25",
    harassment: "bg-purple-500/10 text-purple-500 border-purple-500/25",
    other: "bg-gray-500/10 text-gray-500 border-gray-500/25"
  };
  return colors[reason] || "";
}

function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-500/10 text-green-500 border-green-500/25",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/25",
    resolved: "bg-green-500/10 text-green-500 border-green-500/25",
    dismissed: "bg-gray-500/10 text-gray-500 border-gray-500/25",
    suspended: "bg-orange-500/10 text-orange-500 border-orange-500/25",
    banned: "bg-red-500/10 text-red-500 border-red-500/25"
  };
  return colors[status] || "";
}

function getTypeIcon(type: string) {
  switch (type) {
    case "user":
      return <User className="h-4 w-4" />;
    case "artist":
      return <Music className="h-4 w-4" />;
    case "club":
      return <Building className="h-4 w-4" />;
    case "event":
      return <Calendar className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
}

// Composant principal
export default function ModerationPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("reports");
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [eventReports, setEventReports] = useState<EventReport[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedUserReport, setSelectedUserReport] = useState<UserReport | null>(null);
  const [selectedEventReport, setSelectedEventReport] = useState<EventReport | null>(null);
  
  // Type pour les demandes d'artistes/clubs
  type ApplicationStatus = "pending" | "approved" | "rejected" | "review";
  
  type UserApplication = {
    id: number;
    userId: number;
    username: string;
    email: string;
    applicationType: "artist" | "club";
    userImage?: string;
    name: string;
    dateSubmitted: string;
    description: string;
    location: string;
    phoneNumber: string;
    socialLinks: { platform: string; url: string }[];
    status: ApplicationStatus;
    notes?: string;
  };
  
  // Données de démonstration pour les demandes d'artistes/clubs
  const mockUserApplications: UserApplication[] = [
    {
      id: 1,
      userId: 201,
      username: "dj_techno",
      email: "dj_techno@email.com",
      applicationType: "artist",
      userImage: "https://images.unsplash.com/photo-1592334873219-42275059d13c?w=80&h=80&fit=crop",
      name: "DJ TechnoBeats",
      dateSubmitted: "2023-11-15T08:30:00",
      description: "DJ Techno avec 5 ans d'expérience, spécialisé dans les musiques électroniques.",
      location: "Antananarivo, Madagascar",
      phoneNumber: "+261 34 12 34 567",
      socialLinks: [
        { platform: "instagram", url: "instagram.com/dj_technobeats" },
        { platform: "soundcloud", url: "soundcloud.com/dj_technobeats" }
      ],
      status: "pending"
    },
    {
      id: 2,
      userId: 202,
      username: "club_euphoria",
      email: "contact@clubeuphoria.com",
      applicationType: "club",
      userImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=80&h=80&fit=crop",
      name: "Club Euphoria",
      dateSubmitted: "2023-11-20T14:22:00",
      description: "Club de nuit moderne au cœur d'Antananarivo avec une capacité de 300 personnes.",
      location: "Antananarivo, Madagascar",
      phoneNumber: "+261 34 98 76 543",
      socialLinks: [
        { platform: "instagram", url: "instagram.com/clubeuphoria" },
        { platform: "facebook", url: "facebook.com/clubeuphoria" }
      ],
      status: "pending"
    },
    {
      id: 3,
      userId: 203,
      username: "vocalartist",
      email: "vocal@email.com",
      applicationType: "artist",
      name: "Vocal Star",
      dateSubmitted: "2023-11-18T10:15:00",
      description: "Artiste vocal avec une large gamme de genres.",
      location: "Toamasina, Madagascar",
      phoneNumber: "+261 33 11 22 333",
      socialLinks: [
        { platform: "youtube", url: "youtube.com/vocalstar" }
      ],
      status: "review"
    },
    {
      id: 4,
      userId: 204,
      username: "retropub",
      email: "info@retropub.com",
      applicationType: "club",
      userImage: "https://images.unsplash.com/photo-1541057591728-77510a9ea77f?w=80&h=80&fit=crop",
      name: "Retro Pub",
      dateSubmitted: "2023-11-16T09:40:00",
      description: "Pub à thème rétro avec musique live tous les weekends.",
      location: "Antananarivo, Madagascar",
      phoneNumber: "+261 32 55 66 777",
      socialLinks: [
        { platform: "instagram", url: "instagram.com/retropub" },
        { platform: "twitter", url: "twitter.com/retropub" }
      ],
      status: "approved"
    }
  ];
  
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<UserApplication | null>(null);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserReports(mockUserReports);
      setEventReports(mockEventReports);
      setPendingItems(mockPendingItems);
      setUserApplications(mockUserApplications);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les utilisateurs signalés
  const filteredUserReports = userReports.filter(report => {
    const matchesSearch = searchQuery 
      ? report.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : report.accountStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filtrer les événements signalés
  const filteredEventReports = eventReports.filter(report => {
    const matchesSearch = searchQuery 
      ? report.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.clubName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : report.eventStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filtrer les éléments en attente
  const filteredPendingItems = pendingItems.filter(item => {
    const matchesSearch = searchQuery 
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesType = typeFilter === "all" 
      ? true 
      : item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Filtrer les demandes d'utilisateurs (artistes/clubs)
  const filteredUserApplications = userApplications.filter(app => {
    const matchesSearch = searchQuery 
      ? app.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesRole = roleFilter === "all" 
      ? true 
      : app.applicationType === roleFilter;
      
    const matchesStatus = applicationStatusFilter === "all"
      ? true
      : app.status === applicationStatusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Gérer l'action de suspension d'un utilisateur
  const handleSuspendUser = (userId: number) => {
    // Implémentation à venir (API call, etc.)
    setUserReports(prev => 
      prev.map(report => 
        report.userId === userId 
          ? { ...report, accountStatus: "suspended" } 
          : report
      )
    );
  };

  // Gérer l'action de suspension d'un événement
  const handleSuspendEvent = (eventId: number) => {
    // Implémentation à venir (API call, etc.)
    setEventReports(prev => 
      prev.map(report => 
        report.eventId === eventId 
          ? { ...report, eventStatus: "suspended" } 
          : report
      )
    );
  };

  // Gérer l'approbation d'un élément en attente
  const handleApprovePending = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setPendingItems(prev => prev.filter(item => item.id !== id));
  };

  // Gérer le rejet d'un élément en attente
  const handleRejectPending = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setPendingItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Gérer l'approbation d'une demande d'artiste/club
  const handleApproveApplication = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setUserApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: "approved" } 
          : app
      )
    );
  };
  
  // Gérer la mise en attente d'une demande d'artiste/club
  const handleReviewApplication = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setUserApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: "review" } 
          : app
      )
    );
  };
  
  // Gérer le rejet d'une demande d'artiste/club
  const handleRejectApplication = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setUserApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: "rejected" } 
          : app
      )
    );
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Modération</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setLocation("/admin")}
        >
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ResponsiveLayout headerContent={headerContent} activeItem="modération">
        <LoadingSpinner message="Chargement de la modération..." />
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="modération">
      <div className="space-y-6">
        {/* Statistiques de modération */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Signalements
                </div>
                <div className="text-2xl font-bold">
                  {userReports.reduce((sum, u) => sum + u.reportCount, 0) + 
                   eventReports.reduce((sum, e) => sum + e.reports.length, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <User className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Utilisateurs signalés
                </div>
                <div className="text-2xl font-bold">{userReports.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Événements signalés
                </div>
                <div className="text-2xl font-bold">{eventReports.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  En attente
                </div>
                <div className="text-2xl font-bold">{pendingItems.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, événement..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="banned">Banni</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="artist">Artiste</SelectItem>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="event">Événement</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" title="Rafraîchir" onClick={() => {
              // Implémentation à venir (API call, etc.)
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Contenu des onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="reports">
              Signalements
            </TabsTrigger>
            <TabsTrigger value="approvals">
              Approbations en attente ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Espace Utilisateur
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Signalements */}
          <TabsContent value="reports" className="space-y-6 mt-6">
            {/* Tableau utilisateurs signalés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Utilisateurs signalés
                </CardTitle>
                <CardDescription>
                  Utilisateurs ayant reçu des signalements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Signalements</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucun utilisateur signalé correspondant aux critères
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUserReports.map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={report.userImage} alt={report.username} />
                                <AvatarFallback>{report.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{report.username}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              report.userRole === "admin" ? "bg-purple-500/10 text-purple-500" :
                              report.userRole === "artist" ? "bg-blue-500/10 text-blue-500" :
                              report.userRole === "club" ? "bg-green-500/10 text-green-500" :
                              "bg-gray-500/10 text-gray-500"
                            }>
                              {report.userRole === "admin" ? "Admin" :
                               report.userRole === "artist" ? "Artiste" :
                               report.userRole === "club" ? "Club" : "Utilisateur"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(report.dateCreated), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              {report.reportCount} signalement(s)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(report.accountStatus)}>
                              {report.accountStatus === "active" ? "Actif" :
                               report.accountStatus === "suspended" ? "Suspendu" : "Banni"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedUserReport(report)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Détails
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl">
                                  <DialogHeader>
                                    <DialogTitle>Signalements pour @{selectedUserReport?.username}</DialogTitle>
                                    <DialogDescription>
                                      {selectedUserReport?.reportCount} signalement(s) pour cet utilisateur
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
                                    {selectedUserReport?.reports.map(r => (
                                      <div key={r.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <Badge className={getReasonBadgeColor(r.reason)}>
                                            {getReasonLabel(r.reason)}
                                          </Badge>
                                          <Badge className={getStatusBadgeColor(r.status)}>
                                            {r.status === "pending" ? "En attente" :
                                             r.status === "resolved" ? "Résolu" : "Ignoré"}
                                          </Badge>
                                        </div>
                                        
                                        <p className="text-sm mb-2">{r.description}</p>
                                        
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>Signalé par: @{r.reportedBy}</span>
                                          <span>{format(new Date(r.date), "dd/MM/yyyy HH:mm", { locale: fr })}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <DialogFooter className="gap-2">
                                    {selectedUserReport?.accountStatus !== "suspended" && (
                                      <Button 
                                        variant="destructive"
                                        onClick={() => {
                                          if (selectedUserReport) {
                                            handleSuspendUser(selectedUserReport.userId);
                                          }
                                        }}
                                      >
                                        <Ban className="h-4 w-4 mr-1" />
                                        Suspendre le compte
                                      </Button>
                                    )}
                                    <Button variant="outline">Fermer</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {report.accountStatus === "active" && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleSuspendUser(report.userId)}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Suspendre
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Tableau événements signalés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Événements signalés
                </CardTitle>
                <CardDescription>
                  Événements ayant reçu des signalements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Événement</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Signalements</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEventReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucun événement signalé correspondant aux critères
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEventReports.map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div 
                                className="h-8 w-8 rounded-md bg-cover bg-center flex-shrink-0 mr-2" 
                                style={{ backgroundImage: `url(${report.coverImage})` }}
                              />
                              <div>
                                <p>{report.eventTitle}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{report.clubName}</TableCell>
                          <TableCell>
                            {format(new Date(report.eventDate), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              {report.reports.length} signalement(s)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(report.eventStatus)}>
                              {report.eventStatus === "active" ? "Actif" :
                               report.eventStatus === "suspended" ? "Suspendu" : "Banni"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedEventReport(report)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Détails
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl">
                                  <DialogHeader>
                                    <DialogTitle>Signalements pour "{selectedEventReport?.eventTitle}"</DialogTitle>
                                    <DialogDescription>
                                      {selectedEventReport?.reports.length} signalement(s) pour cet événement
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
                                    {selectedEventReport?.reports.map(r => (
                                      <div key={r.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <Badge className={getReasonBadgeColor(r.reason)}>
                                            {getReasonLabel(r.reason)}
                                          </Badge>
                                          <Badge className={getStatusBadgeColor(r.status)}>
                                            {r.status === "pending" ? "En attente" :
                                             r.status === "resolved" ? "Résolu" : "Ignoré"}
                                          </Badge>
                                        </div>
                                        
                                        <p className="text-sm mb-2">{r.description}</p>
                                        
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>Signalé par: @{r.reportedBy}</span>
                                          <span>{format(new Date(r.date), "dd/MM/yyyy HH:mm", { locale: fr })}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <DialogFooter className="gap-2">
                                    {selectedEventReport?.eventStatus !== "suspended" && (
                                      <Button 
                                        variant="destructive"
                                        onClick={() => {
                                          if (selectedEventReport) {
                                            handleSuspendEvent(selectedEventReport.eventId);
                                          }
                                        }}
                                      >
                                        <Ban className="h-4 w-4 mr-1" />
                                        Suspendre l'événement
                                      </Button>
                                    )}
                                    <Button variant="outline">Fermer</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {report.eventStatus === "active" && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleSuspendEvent(report.eventId)}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Suspendre
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Approbations en attente */}
          <TabsContent value="approvals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Éléments en attente d'approbation
                </CardTitle>
                <CardDescription>
                  Nouveaux utilisateurs, artistes, clubs et événements qui nécessitent une vérification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Aucun élément en attente correspondant aux critères
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={item.image} alt={item.name} />
                                <AvatarFallback>{item.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{item.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex gap-1 w-fit items-center">
                              {getTypeIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{item.details}</TableCell>
                          <TableCell>
                            {format(new Date(item.date), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleApprovePending(item.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectPending(item.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Espace Utilisateur */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Music className="h-5 w-5 mr-2" />
                  <Building className="h-5 w-5 mr-2" />
                  Gestion des Artistes et Clubs
                </CardTitle>
                <CardDescription>
                  Gestion des demandes d'inscription des artistes et clubs
                </CardDescription>
                
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher par nom ou utilisateur..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="artist">Artiste</SelectItem>
                        <SelectItem value="club">Club</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={applicationStatusFilter} onValueChange={setApplicationStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="review">En révision</SelectItem>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nom artistique/établissement</TableHead>
                      <TableHead>Date de soumission</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucune demande correspondant aux critères
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUserApplications.map(application => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={application.userImage} alt={application.username} />
                                <AvatarFallback>{application.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p>@{application.username}</p>
                                <p className="text-xs text-muted-foreground">{application.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              application.applicationType === "artist" 
                              ? "bg-purple-500/10 text-purple-500 flex gap-1 items-center" 
                              : "bg-blue-500/10 text-blue-500 flex gap-1 items-center"
                            }>
                              {application.applicationType === "artist" 
                                ? <Music className="h-3 w-3" /> 
                                : <Building className="h-3 w-3" />}
                              {application.applicationType === "artist" ? "Artiste" : "Club"}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.name}</TableCell>
                          <TableCell>
                            {format(new Date(application.dateSubmitted), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              application.status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/25" : 
                              application.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/25" :
                              application.status === "review" ? "bg-blue-500/10 text-blue-500 border-blue-500/25" :
                              "bg-red-500/10 text-red-500 border-red-500/25"
                            }>
                              {application.status === "approved" ? "Approuvé" : 
                               application.status === "pending" ? "En attente" :
                               application.status === "review" ? "En révision" : "Rejeté"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedApplication(application)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Détails
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl">
                                  <DialogHeader>
                                    <DialogTitle>Demande de {selectedApplication?.applicationType === "artist" ? "l'artiste" : "l'établissement"}</DialogTitle>
                                    <DialogDescription>
                                      Détails de la demande pour {selectedApplication?.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedApplication && (
                                    <div className="space-y-4 my-4">
                                      <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                          <AvatarImage src={selectedApplication.userImage} alt={selectedApplication.name} />
                                          <AvatarFallback className="text-lg">{selectedApplication.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="text-xl font-bold">{selectedApplication.name}</h3>
                                          <p className="text-muted-foreground">@{selectedApplication.username}</p>
                                          <Badge className={
                                            selectedApplication.applicationType === "artist" 
                                            ? "bg-purple-500/10 text-purple-500 mt-2" 
                                            : "bg-blue-500/10 text-blue-500 mt-2"
                                          }>
                                            {selectedApplication.applicationType === "artist" ? "Artiste" : "Club"}
                                          </Badge>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                                          <p>{selectedApplication.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                                          <p>{selectedApplication.phoneNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                                          <p>{selectedApplication.location}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Date de soumission</p>
                                          <p>{format(new Date(selectedApplication.dateSubmitted), "dd MMMM yyyy", { locale: fr })}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="border-t pt-4">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                                        <p className="text-sm">{selectedApplication.description}</p>
                                      </div>
                                      
                                      {selectedApplication.socialLinks.length > 0 && (
                                        <div className="border-t pt-4">
                                          <p className="text-sm font-medium text-muted-foreground mb-2">Réseaux sociaux</p>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedApplication.socialLinks.map((link, index) => (
                                              <Badge key={index} variant="outline" className="flex gap-1 items-center">
                                                {link.platform === "instagram" && <span className="text-pink-500">Instagram</span>}
                                                {link.platform === "facebook" && <span className="text-blue-500">Facebook</span>}
                                                {link.platform === "twitter" && <span className="text-sky-500">Twitter</span>}
                                                {link.platform === "soundcloud" && <span className="text-orange-500">SoundCloud</span>}
                                                {link.platform === "youtube" && <span className="text-red-500">YouTube</span>}
                                                <a href={`https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-xs underline ml-1">
                                                  {link.url}
                                                </a>
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="border-t pt-4">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Statut actuel</p>
                                        <Badge className={
                                          selectedApplication.status === "approved" ? "bg-green-500/10 text-green-500" : 
                                          selectedApplication.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                          selectedApplication.status === "review" ? "bg-blue-500/10 text-blue-500" :
                                          "bg-red-500/10 text-red-500"
                                        }>
                                          {selectedApplication.status === "approved" ? "Approuvé" : 
                                           selectedApplication.status === "pending" ? "En attente" :
                                           selectedApplication.status === "review" ? "En révision" : "Rejeté"}
                                        </Badge>
                                      </div>
                                      
                                      {selectedApplication.notes && (
                                        <div className="border-t pt-4">
                                          <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                                          <p className="text-sm">{selectedApplication.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <DialogFooter className="gap-2 flex-wrap">
                                    {selectedApplication && selectedApplication.status !== "approved" && (
                                      <Button 
                                        onClick={() => {
                                          if (selectedApplication) {
                                            handleApproveApplication(selectedApplication.id);
                                          }
                                        }}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approuver
                                      </Button>
                                    )}
                                    
                                    {selectedApplication && selectedApplication.status !== "review" && (
                                      <Button 
                                        variant="outline"
                                        onClick={() => {
                                          if (selectedApplication) {
                                            handleReviewApplication(selectedApplication.id);
                                          }
                                        }}
                                      >
                                        <Clock className="h-4 w-4 mr-1" />
                                        Mettre en révision
                                      </Button>
                                    )}
                                    
                                    {selectedApplication && selectedApplication.status !== "rejected" && (
                                      <Button 
                                        variant="destructive"
                                        onClick={() => {
                                          if (selectedApplication) {
                                            handleRejectApplication(selectedApplication.id);
                                          }
                                        }}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Rejeter
                                      </Button>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {application.status === "pending" && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleApproveApplication(application.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approuver
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleReviewApplication(application.id)}
                                  >
                                    <Clock className="h-4 w-4 mr-1" />
                                    En révision
                                  </Button>
                                </>
                              )}
                              
                              {application.status === "review" && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleApproveApplication(application.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}