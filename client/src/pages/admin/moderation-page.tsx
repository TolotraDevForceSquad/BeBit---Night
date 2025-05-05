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

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserReports(mockUserReports);
      setEventReports(mockEventReports);
      setPendingItems(mockPendingItems);
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
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
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reports">
              Signalements
            </TabsTrigger>
            <TabsTrigger value="approvals">
              Approbations en attente ({pendingItems.length})
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
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}