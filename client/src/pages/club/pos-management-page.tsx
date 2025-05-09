import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ShoppingCart, Search, Filter, MoreHorizontal, Plus, 
  ArrowUpDown, CheckCircle, XCircle, Eye, Edit, Trash2, 
  User, DollarSign, BarChart, Calendar, Terminal, X, 
  UserPlus, Settings, LogOut, RefreshCcw, Printer, QrCode
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import PartyLoader from "@/components/PartyLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Types pour les POS
type POS = {
  id: number;
  name: string;
  username: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
  lastActive: string;
  salesCount: number;
  salesTotal: number;
  createdAt: string;
  assignedTo: {
    id: number;
    name: string;
    role: string;
    avatar?: string;
  } | null;
  printers: {
    id: number;
    name: string;
    type: "receipt" | "kitchen" | "bar";
    status: "connected" | "disconnected" | "error";
  }[];
  permissions: {
    canRefund: boolean;
    canDiscount: boolean;
    canVoidSales: boolean;
    canViewReports: boolean;
    canManageInventory: boolean;
  };
};

// Types pour les utilisateurs du POS
type POSUser = {
  id: number;
  name: string;
  username: string;
  role: "manager" | "cashier" | "bartender" | "waiter";
  status: "active" | "inactive";
  avatar?: string;
  assignedPos: number[];
  createdAt: string;
  lastLogin?: string;
  salesCount: number;
  salesTotal: number;
};

// Types pour les ventes
type Sale = {
  id: number;
  posId: number;
  posName: string;
  userId: number;
  userName: string;
  timestamp: string;
  total: number;
  paymentMethod: "cash" | "card" | "mobile" | "other";
  status: "completed" | "refunded" | "voided";
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    category: string;
  }[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    reason?: string;
  };
  refund?: {
    timestamp: string;
    reason: string;
    by: string;
  };
};

// Type pour le résumé des statistiques
type POSStatistics = {
  totalSales: number;
  totalTransactions: number;
  averageTicket: number;
  totalActivePOS: number;
  totalActiveUsers: number;
  dailyStats: {
    date: string;
    sales: number;
    transactions: number;
  }[];
  topProducts: {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  paymentMethodsDistribution: {
    method: string;
    percentage: number;
    amount: number;
  }[];
};

export default function POSManagementPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("terminals");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // État pour les POS, utilisateurs et ventes
  const [posTerminals, setPosTerminals] = useState<POS[]>([]);
  const [posUsers, setPosUsers] = useState<POSUser[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [statistics, setStatistics] = useState<POSStatistics | null>(null);
  
  // États pour les modales
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isViewPosModalOpen, setIsViewPosModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [isViewSaleModalOpen, setIsViewSaleModalOpen] = useState(false);
  
  // États pour les objets sélectionnés
  const [selectedPos, setSelectedPos] = useState<POS | null>(null);
  const [selectedUser, setSelectedUser] = useState<POSUser | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  // États pour les formulaires
  const [newPosData, setNewPosData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  
  const [newUserData, setNewUserData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "cashier",
    assignedPos: [] as number[],
  });

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simuler le chargement des terminaux POS
      const mockPosTerminals: POS[] = [
        {
          id: 1,
          name: "Caisse Principale",
          username: "caisse_principale",
          status: "active",
          location: "Entrée",
          lastActive: "2025-05-08T20:15:30",
          salesCount: 456,
          salesTotal: 1250000,
          createdAt: "2025-01-10T09:30:00",
          assignedTo: {
            id: 101,
            name: "Marie Rakoto",
            role: "cashier",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
          },
          printers: [
            {
              id: 1,
              name: "Imprimante Tickets",
              type: "receipt",
              status: "connected"
            },
            {
              id: 2,
              name: "Imprimante Bar",
              type: "bar",
              status: "connected"
            }
          ],
          permissions: {
            canRefund: false,
            canDiscount: true,
            canVoidSales: false,
            canViewReports: false,
            canManageInventory: false
          }
        },
        {
          id: 2,
          name: "Caisse VIP",
          username: "caisse_vip",
          status: "active",
          location: "Zone VIP",
          lastActive: "2025-05-07T23:45:12",
          salesCount: 189,
          salesTotal: 980000,
          createdAt: "2025-01-15T10:00:00",
          assignedTo: {
            id: 102,
            name: "Jean Ravalomanana",
            role: "cashier",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
          },
          printers: [
            {
              id: 3,
              name: "Imprimante VIP",
              type: "receipt",
              status: "connected"
            }
          ],
          permissions: {
            canRefund: true,
            canDiscount: true,
            canVoidSales: true,
            canViewReports: false,
            canManageInventory: false
          }
        },
        {
          id: 3,
          name: "Caisse Bar 1",
          username: "caisse_bar1",
          status: "active",
          location: "Bar principal",
          lastActive: "2025-05-08T21:30:00",
          salesCount: 342,
          salesTotal: 750000,
          createdAt: "2025-01-20T14:15:00",
          assignedTo: {
            id: 103,
            name: "Sophie Andrianarisoa",
            role: "bartender",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop"
          },
          printers: [
            {
              id: 4,
              name: "Imprimante Bar 1",
              type: "bar",
              status: "connected"
            }
          ],
          permissions: {
            canRefund: false,
            canDiscount: true,
            canVoidSales: false,
            canViewReports: false,
            canManageInventory: true
          }
        },
        {
          id: 4,
          name: "Caisse Mobile",
          username: "caisse_mobile",
          status: "inactive",
          location: "Mobile",
          lastActive: "2025-05-05T18:20:45",
          salesCount: 87,
          salesTotal: 320000,
          createdAt: "2025-02-05T11:30:00",
          assignedTo: null,
          printers: [],
          permissions: {
            canRefund: false,
            canDiscount: false,
            canVoidSales: false,
            canViewReports: false,
            canManageInventory: false
          }
        },
        {
          id: 5,
          name: "Caisse Bar 2",
          username: "caisse_bar2",
          status: "maintenance",
          location: "Bar extérieur",
          lastActive: "2025-05-02T22:10:15",
          salesCount: 156,
          salesTotal: 420000,
          createdAt: "2025-02-10T09:45:00",
          assignedTo: null,
          printers: [
            {
              id: 5,
              name: "Imprimante Bar 2",
              type: "bar",
              status: "error"
            }
          ],
          permissions: {
            canRefund: false,
            canDiscount: true,
            canVoidSales: false,
            canViewReports: false,
            canManageInventory: true
          }
        }
      ];
      
      // Simuler le chargement des utilisateurs POS
      const mockPosUsers: POSUser[] = [
        {
          id: 101,
          name: "Marie Rakoto",
          username: "marie.r",
          role: "cashier",
          status: "active",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          assignedPos: [1],
          createdAt: "2025-01-05T08:30:00",
          lastLogin: "2025-05-08T19:45:00",
          salesCount: 456,
          salesTotal: 1250000
        },
        {
          id: 102,
          name: "Jean Ravalomanana",
          username: "jean.r",
          role: "cashier",
          status: "active",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          assignedPos: [2],
          createdAt: "2025-01-05T09:15:00",
          lastLogin: "2025-05-07T22:30:00",
          salesCount: 189,
          salesTotal: 980000
        },
        {
          id: 103,
          name: "Sophie Andrianarisoa",
          username: "sophie.a",
          role: "bartender",
          status: "active",
          avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
          assignedPos: [3],
          createdAt: "2025-01-10T10:00:00",
          lastLogin: "2025-05-08T20:15:00",
          salesCount: 342,
          salesTotal: 750000
        },
        {
          id: 104,
          name: "Thomas Rakotonirina",
          username: "thomas.r",
          role: "waiter",
          status: "active",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
          assignedPos: [4],
          createdAt: "2025-01-15T11:30:00",
          lastLogin: "2025-05-05T17:45:00",
          salesCount: 87,
          salesTotal: 320000
        },
        {
          id: 105,
          name: "Nathalie Razafindrazaka",
          username: "nathalie.r",
          role: "manager",
          status: "active",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          assignedPos: [1, 2, 3, 4, 5],
          createdAt: "2025-01-03T08:00:00",
          lastLogin: "2025-05-08T08:30:00",
          salesCount: 45,
          salesTotal: 280000
        },
        {
          id: 106,
          name: "Eric Andriamahefa",
          username: "eric.a",
          role: "bartender",
          status: "inactive",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          assignedPos: [5],
          createdAt: "2025-01-20T09:45:00",
          lastLogin: "2025-05-01T21:30:00",
          salesCount: 156,
          salesTotal: 420000
        }
      ];
      
      // Simuler le chargement des ventes
      const mockSales: Sale[] = [
        {
          id: 1001,
          posId: 1,
          posName: "Caisse Principale",
          userId: 101,
          userName: "Marie Rakoto",
          timestamp: "2025-05-08T20:15:30",
          total: 45000,
          paymentMethod: "cash",
          status: "completed",
          items: [
            {
              id: 1,
              name: "Cocktail Mojito",
              quantity: 2,
              price: 15000,
              category: "Boissons"
            },
            {
              id: 2,
              name: "Assiette Tapas",
              quantity: 1,
              price: 15000,
              category: "Nourriture"
            }
          ]
        },
        {
          id: 1002,
          posId: 2,
          posName: "Caisse VIP",
          userId: 102,
          userName: "Jean Ravalomanana",
          timestamp: "2025-05-07T23:30:45",
          total: 120000,
          paymentMethod: "card",
          status: "completed",
          items: [
            {
              id: 3,
              name: "Bouteille Champagne",
              quantity: 1,
              price: 100000,
              category: "Boissons"
            },
            {
              id: 4,
              name: "Plateau Fruits de Mer",
              quantity: 1,
              price: 20000,
              category: "Nourriture"
            }
          ]
        },
        {
          id: 1003,
          posId: 3,
          posName: "Caisse Bar 1",
          userId: 103,
          userName: "Sophie Andrianarisoa",
          timestamp: "2025-05-08T21:15:20",
          total: 32000,
          paymentMethod: "mobile",
          status: "completed",
          items: [
            {
              id: 5,
              name: "Cocktail Piña Colada",
              quantity: 2,
              price: 16000,
              category: "Boissons"
            }
          ]
        },
        {
          id: 1004,
          posId: 1,
          posName: "Caisse Principale",
          userId: 101,
          userName: "Marie Rakoto",
          timestamp: "2025-05-08T19:45:10",
          total: 28000,
          paymentMethod: "cash",
          status: "refunded",
          items: [
            {
              id: 6,
              name: "Bière locale",
              quantity: 4,
              price: 8000,
              category: "Boissons"
            }
          ],
          refund: {
            timestamp: "2025-05-08T20:00:15",
            reason: "Erreur de commande",
            by: "Nathalie Razafindrazaka"
          }
        },
        {
          id: 1005,
          posId: 2,
          posName: "Caisse VIP",
          userId: 102,
          userName: "Jean Ravalomanana",
          timestamp: "2025-05-07T22:20:30",
          total: 85000,
          paymentMethod: "card",
          status: "completed",
          items: [
            {
              id: 7,
              name: "Cocktail Premium",
              quantity: 5,
              price: 17000,
              category: "Boissons"
            }
          ]
        },
        {
          id: 1006,
          posId: 1,
          posName: "Caisse Principale",
          userId: 101,
          userName: "Marie Rakoto",
          timestamp: "2025-05-08T21:30:40",
          total: 55000,
          paymentMethod: "cash",
          status: "voided",
          items: [
            {
              id: 8,
              name: "Bouteille Whisky",
              quantity: 1,
              price: 55000,
              category: "Boissons"
            }
          ]
        },
        {
          id: 1007,
          posId: 3,
          posName: "Caisse Bar 1",
          userId: 103,
          userName: "Sophie Andrianarisoa",
          timestamp: "2025-05-08T20:45:15",
          total: 42000,
          paymentMethod: "mobile",
          status: "completed",
          items: [
            {
              id: 9,
              name: "Cocktail Maison",
              quantity: 3,
              price: 14000,
              category: "Boissons"
            }
          ]
        }
      ];
      
      // Simuler les statistiques
      const mockStatistics: POSStatistics = {
        totalSales: 3800000,
        totalTransactions: 1230,
        averageTicket: 30894,
        totalActivePOS: 3,
        totalActiveUsers: 5,
        dailyStats: [
          { date: "2025-05-02", sales: 320000, transactions: 85 },
          { date: "2025-05-03", sales: 380000, transactions: 102 },
          { date: "2025-05-04", sales: 410000, transactions: 125 },
          { date: "2025-05-05", sales: 350000, transactions: 110 },
          { date: "2025-05-06", sales: 420000, transactions: 135 },
          { date: "2025-05-07", sales: 520000, transactions: 165 },
          { date: "2025-05-08", sales: 480000, transactions: 155 }
        ],
        topProducts: [
          { id: 1, name: "Cocktail Mojito", quantity: 145, revenue: 2175000 },
          { id: 3, name: "Bouteille Champagne", quantity: 12, revenue: 1200000 },
          { id: 9, name: "Cocktail Maison", quantity: 98, revenue: 1372000 },
          { id: 7, name: "Cocktail Premium", quantity: 76, revenue: 1292000 },
          { id: 6, name: "Bière locale", quantity: 120, revenue: 960000 }
        ],
        paymentMethodsDistribution: [
          { method: "cash", percentage: 45, amount: 1710000 },
          { method: "card", percentage: 35, amount: 1330000 },
          { method: "mobile", percentage: 20, amount: 760000 }
        ]
      };

      setPosTerminals(mockPosTerminals);
      setPosUsers(mockPosUsers);
      setSales(mockSales);
      setStatistics(mockStatistics);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filtrer les terminaux POS
  const getFilteredPOS = () => {
    return posTerminals.filter(pos => {
      // Filtre par recherche
      const matchesSearch = 
        pos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pos.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        pos.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "location") {
        return sortOrder === "asc" 
          ? a.location.localeCompare(b.location)
          : b.location.localeCompare(a.location);
      } else if (sortBy === "sales") {
        return sortOrder === "asc" 
          ? a.salesTotal - b.salesTotal
          : b.salesTotal - a.salesTotal;
      } else if (sortBy === "lastActive") {
        return sortOrder === "asc" 
          ? new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          : new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      }
      return 0;
    });
  };

  // Filtrer les utilisateurs POS
  const getFilteredUsers = () => {
    return posUsers.filter(user => {
      // Filtre par recherche
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "role") {
        return sortOrder === "asc" 
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (sortBy === "sales") {
        return sortOrder === "asc" 
          ? a.salesTotal - b.salesTotal
          : b.salesTotal - a.salesTotal;
      } else if (sortBy === "lastLogin") {
        if (!a.lastLogin) return sortOrder === "asc" ? -1 : 1;
        if (!b.lastLogin) return sortOrder === "asc" ? 1 : -1;
        return sortOrder === "asc" 
          ? new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
          : new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      }
      return 0;
    });
  };

  // Filtrer les ventes
  const getFilteredSales = () => {
    return sales.filter(sale => {
      // Filtre par recherche
      const matchesSearch = 
        sale.posName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        sale.status === statusFilter;
      
      // Filtre par date
      let matchesDate = true;
      if (dateFilter !== "all") {
        const saleDate = new Date(sale.timestamp);
        const today = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = saleDate.toDateString() === today.toDateString();
            break;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesDate = saleDate.toDateString() === yesterday.toDateString();
            break;
          case "thisWeek":
            const thisWeekStart = new Date(today);
            thisWeekStart.setDate(today.getDate() - today.getDay());
            matchesDate = saleDate >= thisWeekStart;
            break;
          case "thisMonth":
            matchesDate = saleDate.getMonth() === today.getMonth() && 
                          saleDate.getFullYear() === today.getFullYear();
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === "total") {
        return sortOrder === "asc" 
          ? a.total - b.total
          : b.total - a.total;
      } else if (sortBy === "pos") {
        return sortOrder === "asc" 
          ? a.posName.localeCompare(b.posName)
          : b.posName.localeCompare(a.posName);
      } else if (sortBy === "user") {
        return sortOrder === "asc" 
          ? a.userName.localeCompare(b.userName)
          : b.userName.localeCompare(a.userName);
      } else if (sortBy === "status") {
        return sortOrder === "asc" 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  };

  // Obtenir les terminaux POS filtrés et triés
  const filteredPOS = getFilteredPOS();
  // Obtenir les utilisateurs POS filtrés et triés
  const filteredUsers = getFilteredUsers();
  // Obtenir les ventes filtrées et triées
  const filteredSales = getFilteredSales();

  // Fonctions de gestion des terminaux POS
  const handleAddPOS = () => {
    // Validation du formulaire
    if (!newPosData.name || !newPosData.username || !newPosData.password) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (newPosData.password !== newPosData.confirmPassword) {
      toast({
        title: "Erreur de mot de passe",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    // Générer un nouvel ID
    const newId = Math.max(...posTerminals.map(p => p.id), 0) + 1;

    // Créer le nouveau terminal POS
    const newPOS: POS = {
      id: newId,
      name: newPosData.name,
      username: newPosData.username,
      status: "inactive",
      location: newPosData.location || "Non spécifié",
      lastActive: new Date().toISOString(),
      salesCount: 0,
      salesTotal: 0,
      createdAt: new Date().toISOString(),
      assignedTo: null,
      printers: [],
      permissions: {
        canRefund: false,
        canDiscount: false,
        canVoidSales: false,
        canViewReports: false,
        canManageInventory: false
      }
    };

    // Ajouter le terminal à la liste
    setPosTerminals([...posTerminals, newPOS]);

    // Réinitialiser le formulaire et fermer la modale
    setNewPosData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      location: ""
    });
    setIsAddPosModalOpen(false);

    toast({
      title: "Terminal POS ajouté",
      description: `Le terminal "${newPOS.name}" a été ajouté avec succès.`
    });
  };

  const handleViewPOS = (pos: POS) => {
    setSelectedPos(pos);
    setIsViewPosModalOpen(true);
  };

  const handleDeletePOS = (pos: POS) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le terminal "${pos.name}" ?`)) {
      setPosTerminals(posTerminals.filter(p => p.id !== pos.id));
      toast({
        title: "Terminal POS supprimé",
        description: `Le terminal "${pos.name}" a été supprimé avec succès.`,
        variant: "destructive"
      });
    }
  };

  const handleTogglePOSStatus = (pos: POS) => {
    const newStatus = pos.status === "active" ? "inactive" : "active";
    setPosTerminals(posTerminals.map(p => 
      p.id === pos.id ? { ...p, status: newStatus as "active" | "inactive" | "maintenance" } : p
    ));
    toast({
      title: `Terminal ${newStatus === "active" ? "activé" : "désactivé"}`,
      description: `Le terminal "${pos.name}" est maintenant ${newStatus === "active" ? "actif" : "inactif"}.`
    });
  };

  // Fonctions de gestion des utilisateurs POS
  const handleAddUser = () => {
    // Validation du formulaire
    if (!newUserData.name || !newUserData.username || !newUserData.password) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      toast({
        title: "Erreur de mot de passe",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    // Générer un nouvel ID
    const newId = Math.max(...posUsers.map(u => u.id), 0) + 1;

    // Créer le nouvel utilisateur
    const newUser: POSUser = {
      id: newId,
      name: newUserData.name,
      username: newUserData.username,
      role: newUserData.role as "manager" | "cashier" | "bartender" | "waiter",
      status: "active",
      assignedPos: newUserData.assignedPos,
      createdAt: new Date().toISOString(),
      salesCount: 0,
      salesTotal: 0
    };

    // Ajouter l'utilisateur à la liste
    setPosUsers([...posUsers, newUser]);

    // Mettre à jour les assignations de POS
    if (newUserData.assignedPos.length > 0) {
      setPosTerminals(posTerminals.map(pos => {
        if (newUserData.assignedPos.includes(pos.id)) {
          return {
            ...pos,
            assignedTo: {
              id: newUser.id,
              name: newUser.name,
              role: newUser.role
            }
          };
        }
        return pos;
      }));
    }

    // Réinitialiser le formulaire et fermer la modale
    setNewUserData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "cashier",
      assignedPos: []
    });
    setIsAddUserModalOpen(false);

    toast({
      title: "Utilisateur ajouté",
      description: `L'utilisateur "${newUser.name}" a été ajouté avec succès.`
    });
  };

  const handleViewUser = (user: POSUser) => {
    setSelectedUser(user);
    setIsViewUserModalOpen(true);
  };

  const handleDeleteUser = (user: POSUser) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
      // Supprimer les assignations de cet utilisateur des terminaux POS
      setPosTerminals(posTerminals.map(pos => {
        if (pos.assignedTo && pos.assignedTo.id === user.id) {
          return {
            ...pos,
            assignedTo: null
          };
        }
        return pos;
      }));

      // Supprimer l'utilisateur
      setPosUsers(posUsers.filter(u => u.id !== user.id));
      
      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur "${user.name}" a été supprimé avec succès.`,
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = (user: POSUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setPosUsers(posUsers.map(u => 
      u.id === user.id ? { ...u, status: newStatus as "active" | "inactive" } : u
    ));
    toast({
      title: `Utilisateur ${newStatus === "active" ? "activé" : "désactivé"}`,
      description: `L'utilisateur "${user.name}" est maintenant ${newStatus === "active" ? "actif" : "inactif"}.`
    });
  };

  // Fonctions de gestion des ventes
  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewSaleModalOpen(true);
  };

  // Fonction pour formater les montants en Ariary
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', { style: 'decimal' }).format(amount) + " Ar";
  };

  // Obtenir l'affichage du statut avec couleur
  const getStatusDisplay = (status: string, type: 'pos' | 'user' | 'sale') => {
    switch (type) {
      case 'pos':
        switch (status) {
          case "active":
            return { label: "Actif", color: "bg-green-100 text-green-600 border-green-200" };
          case "inactive":
            return { label: "Inactif", color: "bg-gray-100 text-gray-600 border-gray-200" };
          case "maintenance":
            return { label: "Maintenance", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
          default:
            return { label: status, color: "" };
        }
      case 'user':
        switch (status) {
          case "active":
            return { label: "Actif", color: "bg-green-100 text-green-600 border-green-200" };
          case "inactive":
            return { label: "Inactif", color: "bg-gray-100 text-gray-600 border-gray-200" };
          default:
            return { label: status, color: "" };
        }
      case 'sale':
        switch (status) {
          case "completed":
            return { label: "Complété", color: "bg-green-100 text-green-600 border-green-200" };
          case "refunded":
            return { label: "Remboursé", color: "bg-red-100 text-red-600 border-red-200" };
          case "voided":
            return { label: "Annulé", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
          default:
            return { label: status, color: "" };
        }
      default:
        return { label: status, color: "" };
    }
  };

  // Obtenir le rôle formaté pour affichage
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "manager":
        return { label: "Manager", color: "bg-purple-100 text-purple-600 border-purple-200" };
      case "cashier":
        return { label: "Caissier", color: "bg-blue-100 text-blue-600 border-blue-200" };
      case "bartender":
        return { label: "Barman", color: "bg-indigo-100 text-indigo-600 border-indigo-200" };
      case "waiter":
        return { label: "Serveur", color: "bg-teal-100 text-teal-600 border-teal-200" };
      default:
        return { label: role, color: "" };
    }
  };

  // Obtenir la méthode de paiement formatée pour affichage
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cash":
        return { label: "Espèces", color: "bg-green-100 text-green-600 border-green-200" };
      case "card":
        return { label: "Carte", color: "bg-blue-100 text-blue-600 border-blue-200" };
      case "mobile":
        return { label: "Mobile", color: "bg-indigo-100 text-indigo-600 border-indigo-200" };
      case "other":
        return { label: "Autre", color: "bg-gray-100 text-gray-600 border-gray-200" };
      default:
        return { label: method, color: "" };
    }
  };

  return (
    <ResponsiveLayout>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <PartyLoader />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestion des Points de Vente</h1>
              <p className="text-muted-foreground">
                Gérez vos terminaux, utilisateurs et ventes
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button onClick={() => setLocation("/club")} variant="outline">
                Retour au Dashboard
              </Button>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAmount(statistics?.totalSales || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics?.totalTransactions || 0} transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAmount(statistics?.averageTicket || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Par transaction
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Terminaux actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalActivePOS || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {posTerminals.length} terminaux
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalActiveUsers || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {posUsers.length} utilisateurs
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-2/3">
              <TabsTrigger value="terminals">
                Terminaux <Badge className="ml-1">{posTerminals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="users">
                Utilisateurs <Badge className="ml-1">{posUsers.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="sales">
                Ventes <Badge className="ml-1">{sales.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reports">
                Rapports
              </TabsTrigger>
            </TabsList>
            
            {/* Onglet Terminaux */}
            <TabsContent value="terminals">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>Liste des terminaux POS</CardTitle>
                      <CardDescription>
                        Gérez les terminaux de vente
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsAddPosModalOpen(true)}
                      className="mt-2 md:mt-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un terminal
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un terminal..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <X 
                          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                          onClick={() => setSearchQuery("")}
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="active">Actifs</SelectItem>
                          <SelectItem value="inactive">Inactifs</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("name");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Terminal
                            {sortBy === "name" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("location");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Emplacement
                            {sortBy === "location" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Assigné à</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("lastActive");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Dernière activité
                            {sortBy === "lastActive" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("sales");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Ventes
                            {sortBy === "sales" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {filteredPOS.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <Terminal className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-lg font-medium">Aucun terminal trouvé</p>
                              <p className="text-sm text-muted-foreground">
                                Ajoutez un nouveau terminal ou modifiez vos filtres
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPOS.map((pos) => (
                          <TableRow key={pos.id}>
                            <TableCell>
                              <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center">
                                <Terminal className="h-5 w-5 text-primary" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{pos.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  @{pos.username}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {pos.location}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusDisplay(pos.status, 'pos').color}>
                                {getStatusDisplay(pos.status, 'pos').label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {pos.assignedTo ? (
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={pos.assignedTo.avatar} />
                                    <AvatarFallback>{pos.assignedTo.name.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{pos.assignedTo.name}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Non assigné</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {format(new Date(pos.lastActive), "dd/MM/yyyy HH:mm", { locale: fr })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{formatAmount(pos.salesTotal)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {pos.salesCount} transactions
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewPOS(pos)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      <span>Voir les détails</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      <span>Modifier</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleTogglePOSStatus(pos)}>
                                      {pos.status === "active" ? (
                                        <>
                                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                          <span>Désactiver</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                          <span>Activer</span>
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeletePOS(pos)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      <span>Supprimer</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
            
            {/* Onglet Utilisateurs */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>Liste des utilisateurs POS</CardTitle>
                      <CardDescription>
                        Gérez les utilisateurs des terminaux de vente
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="mt-2 md:mt-0"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter un utilisateur
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <X 
                          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                          onClick={() => setSearchQuery("")}
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="active">Actifs</SelectItem>
                          <SelectItem value="inactive">Inactifs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("name");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Utilisateur
                            {sortBy === "name" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("role");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Rôle
                            {sortBy === "role" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Terminaux assignés</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("lastLogin");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Dernière connexion
                            {sortBy === "lastLogin" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("sales");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Ventes
                            {sortBy === "sales" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <User className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                              <p className="text-sm text-muted-foreground">
                                Ajoutez un nouvel utilisateur ou modifiez vos filtres
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  @{user.username}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleDisplay(user.role).color}>
                                {getRoleDisplay(user.role).label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusDisplay(user.status, 'user').color}>
                                {getStatusDisplay(user.status, 'user').label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.assignedPos.length > 0 ? (
                                <Badge variant="outline">
                                  {user.assignedPos.length} terminal{user.assignedPos.length > 1 ? 's' : ''}
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">Aucun</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.lastLogin ? (
                                <span className="text-sm">
                                  {format(new Date(user.lastLogin), "dd/MM/yyyy HH:mm", { locale: fr })}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">Jamais</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{formatAmount(user.salesTotal)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.salesCount} transactions
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      <span>Voir les détails</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      <span>Modifier</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                                      {user.status === "active" ? (
                                        <>
                                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                          <span>Désactiver</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                          <span>Activer</span>
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <RefreshCcw className="h-4 w-4 mr-2" />
                                      <span>Réinitialiser mot de passe</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteUser(user)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      <span>Supprimer</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
            
            {/* Onglet Ventes */}
            <TabsContent value="sales">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>Historique des ventes</CardTitle>
                      <CardDescription>
                        Consultez l'historique des transactions
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une vente..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <X 
                          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                          onClick={() => setSearchQuery("")}
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="completed">Complétés</SelectItem>
                          <SelectItem value="refunded">Remboursés</SelectItem>
                          <SelectItem value="voided">Annulés</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Calendar className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="yesterday">Hier</SelectItem>
                          <SelectItem value="thisWeek">Cette semaine</SelectItem>
                          <SelectItem value="thisMonth">Ce mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("date");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Date
                            {sortBy === "date" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("pos");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Terminal
                            {sortBy === "pos" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("user");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Utilisateur
                            {sortBy === "user" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Articles</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("total");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Total
                            {sortBy === "total" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => {
                            setSortBy("status");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}>
                            Statut
                            {sortBy === "status" && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {filteredSales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-lg font-medium">Aucune vente trouvée</p>
                              <p className="text-sm text-muted-foreground">
                                Modifiez vos critères de recherche
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>
                              <span className="text-sm">
                                {format(new Date(sale.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-mono">#{sale.id}</span>
                            </TableCell>
                            <TableCell>
                              {sale.posName}
                            </TableCell>
                            <TableCell>
                              {sale.userName}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {sale.items.length} article{sale.items.length > 1 ? 's' : ''}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {formatAmount(sale.total)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPaymentMethodDisplay(sale.paymentMethod).color}>
                                {getPaymentMethodDisplay(sale.paymentMethod).label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusDisplay(sale.status, 'sale').color}>
                                {getStatusDisplay(sale.status, 'sale').label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleViewSale(sale)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {filteredSales.length} ventes sur {sales.length} au total
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Onglet Rapports */}
            <TabsContent value="reports">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Ventes des 7 derniers jours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statistics && (
                      <div className="h-[300px]">
                        <div className="space-y-4">
                          {statistics.dailyStats.map((day) => (
                            <div key={day.date} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {format(new Date(day.date), "EEEE dd MMMM", { locale: fr })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    {day.transactions} transactions
                                  </span>
                                  <span className="font-medium">
                                    {formatAmount(day.sales)}
                                  </span>
                                </div>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ 
                                    width: `${(day.sales / Math.max(...statistics.dailyStats.map(d => d.sales))) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Méthodes de paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statistics && (
                      <div className="space-y-4">
                        {statistics.paymentMethodsDistribution.map((method) => (
                          <div key={method.method} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={getPaymentMethodDisplay(method.method).color}>
                                  {getPaymentMethodDisplay(method.method).label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {method.percentage}%
                                </span>
                                <span className="font-medium">
                                  {formatAmount(method.amount)}
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  method.method === "cash" ? "bg-green-600" : 
                                  method.method === "card" ? "bg-blue-600" : 
                                  method.method === "mobile" ? "bg-indigo-600" : "bg-gray-600"
                                }`}
                                style={{ width: `${method.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Produits les plus vendus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Quantité vendue</TableHead>
                          <TableHead>Revenu</TableHead>
                          <TableHead>Part du revenu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statistics?.topProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                            </TableCell>
                            <TableCell>
                              {product.quantity} unités
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{formatAmount(product.revenue)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ 
                                      width: `${(product.revenue / statistics.totalSales) * 100}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {((product.revenue / statistics.totalSales) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Modal d'ajout de terminal POS */}
      <Dialog open={isAddPosModalOpen} onOpenChange={setIsAddPosModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau terminal POS</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouveau terminal POS
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pos-name">Nom du terminal</Label>
              <Input 
                id="pos-name"
                placeholder="Ex: Caisse Bar 1"
                value={newPosData.name}
                onChange={(e) => setNewPosData({ 
                  ...newPosData, 
                  name: e.target.value 
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pos-username">Nom d'utilisateur</Label>
              <Input 
                id="pos-username"
                placeholder="Ex: caisse_bar1"
                value={newPosData.username}
                onChange={(e) => setNewPosData({ 
                  ...newPosData, 
                  username: e.target.value 
                })}
              />
              <p className="text-xs text-muted-foreground">
                Utilisé pour la connexion au terminal
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pos-password">Mot de passe</Label>
                <Input 
                  id="pos-password"
                  type="password"
                  value={newPosData.password}
                  onChange={(e) => setNewPosData({ 
                    ...newPosData, 
                    password: e.target.value 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pos-confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="pos-confirm-password"
                  type="password"
                  value={newPosData.confirmPassword}
                  onChange={(e) => setNewPosData({ 
                    ...newPosData, 
                    confirmPassword: e.target.value 
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pos-location">Emplacement</Label>
              <Input 
                id="pos-location"
                placeholder="Ex: Bar principal"
                value={newPosData.location}
                onChange={(e) => setNewPosData({ 
                  ...newPosData, 
                  location: e.target.value 
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsAddPosModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleAddPOS}>
              Ajouter le terminal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout d'utilisateur */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouvel utilisateur
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nom complet</Label>
              <Input 
                id="user-name"
                placeholder="Ex: Jean Dupont"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ 
                  ...newUserData, 
                  name: e.target.value 
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-username">Nom d'utilisateur</Label>
              <Input 
                id="user-username"
                placeholder="Ex: jean.d"
                value={newUserData.username}
                onChange={(e) => setNewUserData({ 
                  ...newUserData, 
                  username: e.target.value 
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-password">Mot de passe</Label>
                <Input 
                  id="user-password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ 
                    ...newUserData, 
                    password: e.target.value 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="user-confirm-password"
                  type="password"
                  value={newUserData.confirmPassword}
                  onChange={(e) => setNewUserData({ 
                    ...newUserData, 
                    confirmPassword: e.target.value 
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-role">Rôle</Label>
              <Select 
                value={newUserData.role}
                onValueChange={(value) => setNewUserData({ 
                  ...newUserData, 
                  role: value 
                })}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="cashier">Caissier</SelectItem>
                  <SelectItem value="bartender">Barman</SelectItem>
                  <SelectItem value="waiter">Serveur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Terminaux assignés</Label>
              <div className="border rounded-md p-3 space-y-2">
                {posTerminals.filter(pos => pos.status === "active").length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun terminal actif disponible
                  </p>
                ) : (
                  posTerminals
                    .filter(pos => pos.status === "active")
                    .map(pos => (
                      <div key={pos.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`pos-${pos.id}`}
                          checked={newUserData.assignedPos.includes(pos.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUserData({
                                ...newUserData,
                                assignedPos: [...newUserData.assignedPos, pos.id]
                              });
                            } else {
                              setNewUserData({
                                ...newUserData,
                                assignedPos: newUserData.assignedPos.filter(id => id !== pos.id)
                              });
                            }
                          }}
                        />
                        <Label 
                          htmlFor={`pos-${pos.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {pos.name} ({pos.location})
                        </Label>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleAddUser}>
              Ajouter l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de détails de terminal POS */}
      <Dialog open={isViewPosModalOpen} onOpenChange={setIsViewPosModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedPos && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2" />
                  Détails du terminal: {selectedPos.name}
                </DialogTitle>
                <DialogDescription>
                  ID: {selectedPos.id} · Créé le {format(new Date(selectedPos.createdAt), "dd MMMM yyyy", { locale: fr })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusDisplay(selectedPos.status, 'pos').color}>
                    {getStatusDisplay(selectedPos.status, 'pos').label}
                  </Badge>
                  
                  {selectedPos.assignedTo ? (
                    <Badge variant="outline" className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Assigné à {selectedPos.assignedTo.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
                      Non assigné
                    </Badge>
                  )}
                </div>
                
                <Tabs defaultValue="info">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="sales">Ventes</TabsTrigger>
                    <TabsTrigger value="settings">Paramètres</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Détails du terminal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Nom d'utilisateur:</span>
                            <p className="text-sm text-muted-foreground">{selectedPos.username}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Emplacement:</span>
                            <p className="text-sm text-muted-foreground">{selectedPos.location}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Dernière activité:</span>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(selectedPos.lastActive), "dd MMMM yyyy à HH:mm", { locale: fr })}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Nombre de ventes:</span>
                            <p className="text-sm text-muted-foreground">{selectedPos.salesCount} transactions</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Total des ventes:</span>
                            <p className="text-sm font-semibold">{formatAmount(selectedPos.salesTotal)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Imprimantes connectées</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedPos.printers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucune imprimante connectée</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedPos.printers.map((printer) => (
                                <TableRow key={printer.id}>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Printer className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{printer.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {printer.type === "receipt" ? "Tickets" : 
                                    printer.type === "kitchen" ? "Cuisine" : 
                                    printer.type === "bar" ? "Bar" : printer.type}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={
                                      printer.status === "connected" ? "bg-green-100 text-green-600 border-green-200" : 
                                      printer.status === "disconnected" ? "bg-gray-100 text-gray-600 border-gray-200" : 
                                      "bg-red-100 text-red-600 border-red-200"
                                    }>
                                      {printer.status === "connected" ? "Connectée" : 
                                      printer.status === "disconnected" ? "Déconnectée" : 
                                      "Erreur"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="sales" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Dernières ventes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {sales.filter(sale => sale.posId === selectedPos.id).length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucune vente enregistrée</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sales
                                .filter(sale => sale.posId === selectedPos.id)
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .slice(0, 5)
                                .map((sale) => (
                                  <TableRow key={sale.id}>
                                    <TableCell>
                                      <span className="text-sm">
                                        {format(new Date(sale.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-sm font-mono">#{sale.id}</span>
                                    </TableCell>
                                    <TableCell>
                                      {sale.userName}
                                    </TableCell>
                                    <TableCell>
                                      <span className="font-medium">
                                        {formatAmount(sale.total)}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getStatusDisplay(sale.status, 'sale').color}>
                                        {getStatusDisplay(sale.status, 'sale').label}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        )}
                        
                        {sales.filter(sale => sale.posId === selectedPos.id).length > 5 && (
                          <div className="mt-2 text-center">
                            <Button variant="link" onClick={() => {
                              setSearchQuery(selectedPos.name);
                              setActiveTab("sales");
                              setIsViewPosModalOpen(false);
                            }}>
                              Voir toutes les ventes
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Permissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-refund">Peut effectuer des remboursements</Label>
                            <Switch 
                              id="perm-refund" 
                              checked={selectedPos.permissions.canRefund}
                              disabled
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-discount">Peut appliquer des remises</Label>
                            <Switch 
                              id="perm-discount" 
                              checked={selectedPos.permissions.canDiscount}
                              disabled
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-void">Peut annuler des ventes</Label>
                            <Switch 
                              id="perm-void" 
                              checked={selectedPos.permissions.canVoidSales}
                              disabled
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-reports">Peut consulter les rapports</Label>
                            <Switch 
                              id="perm-reports" 
                              checked={selectedPos.permissions.canViewReports}
                              disabled
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-inventory">Peut gérer le stock</Label>
                            <Switch 
                              id="perm-inventory" 
                              checked={selectedPos.permissions.canManageInventory}
                              disabled
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          Pour modifier ces paramètres, utilisez le bouton "Modifier" dans la vue principale.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Configuration d'accès</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Code QR de connexion:</span>
                            <div className="mt-2 p-4 border rounded-md flex justify-center">
                              <div className="h-32 w-32 bg-gray-200 flex items-center justify-center">
                                <QrCode className="h-16 w-16 text-muted-foreground" />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                              Utilisez ce QR code pour un accès rapide au terminal
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                <div className="flex-1 flex justify-start">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDeletePOS(selectedPos);
                      setIsViewPosModalOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => handleTogglePOSStatus(selectedPos)}
                  >
                    {selectedPos.status === "active" ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activer
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => setIsViewPosModalOpen(false)}>
                    Fermer
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de détails d'utilisateur */}
      <Dialog open={isViewUserModalOpen} onOpenChange={setIsViewUserModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedUser.name}</DialogTitle>
                    <DialogDescription>
                      @{selectedUser.username} · Créé le {format(new Date(selectedUser.createdAt), "dd MMMM yyyy", { locale: fr })}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleDisplay(selectedUser.role).color}>
                    {getRoleDisplay(selectedUser.role).label}
                  </Badge>
                  
                  <Badge className={getStatusDisplay(selectedUser.status, 'user').color}>
                    {getStatusDisplay(selectedUser.status, 'user').label}
                  </Badge>
                </div>
                
                <Tabs defaultValue="info">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="pos">Terminaux</TabsTrigger>
                    <TabsTrigger value="sales">Ventes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Détails de l'utilisateur</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Rôle:</span>
                          <p className="text-sm text-muted-foreground">{getRoleDisplay(selectedUser.role).label}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Statut:</span>
                          <p className="text-sm text-muted-foreground">{getStatusDisplay(selectedUser.status, 'user').label}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Date de création:</span>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedUser.createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Dernière connexion:</span>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.lastLogin ? 
                              format(new Date(selectedUser.lastLogin), "dd MMMM yyyy à HH:mm", { locale: fr }) : 
                              "Jamais connecté"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Statistiques</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Nombre de ventes:</span>
                          <p className="text-sm text-muted-foreground">{selectedUser.salesCount} transactions</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Total des ventes:</span>
                          <p className="text-sm font-semibold">{formatAmount(selectedUser.salesTotal)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Terminaux assignés:</span>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.assignedPos.length} terminal{selectedUser.assignedPos.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="pos" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Terminaux assignés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedUser.assignedPos.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucun terminal assigné</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Terminal</TableHead>
                                <TableHead>Emplacement</TableHead>
                                <TableHead>Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedUser.assignedPos.map((posId) => {
                                const pos = posTerminals.find(p => p.id === posId);
                                if (!pos) return null;
                                
                                return (
                                  <TableRow key={pos.id}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <Terminal className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{pos.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {pos.location}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getStatusDisplay(pos.status, 'pos').color}>
                                        {getStatusDisplay(pos.status, 'pos').label}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="sales" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Dernières ventes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {sales.filter(sale => sale.userId === selectedUser.id).length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucune vente enregistrée</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Terminal</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sales
                                .filter(sale => sale.userId === selectedUser.id)
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .slice(0, 5)
                                .map((sale) => (
                                  <TableRow key={sale.id}>
                                    <TableCell>
                                      <span className="text-sm">
                                        {format(new Date(sale.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-sm font-mono">#{sale.id}</span>
                                    </TableCell>
                                    <TableCell>
                                      {sale.posName}
                                    </TableCell>
                                    <TableCell>
                                      <span className="font-medium">
                                        {formatAmount(sale.total)}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getStatusDisplay(sale.status, 'sale').color}>
                                        {getStatusDisplay(sale.status, 'sale').label}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        )}
                        
                        {sales.filter(sale => sale.userId === selectedUser.id).length > 5 && (
                          <div className="mt-2 text-center">
                            <Button variant="link" onClick={() => {
                              setSearchQuery(selectedUser.name);
                              setActiveTab("sales");
                              setIsViewUserModalOpen(false);
                            }}>
                              Voir toutes les ventes
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                <div className="flex-1 flex justify-start">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDeleteUser(selectedUser);
                      setIsViewUserModalOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => handleToggleUserStatus(selectedUser)}
                  >
                    {selectedUser.status === "active" ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activer
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => setIsViewUserModalOpen(false)}>
                    Fermer
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de détails de vente */}
      <Dialog open={isViewSaleModalOpen} onOpenChange={setIsViewSaleModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedSale && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la vente #{selectedSale.id}</DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedSale.timestamp), "EEEE dd MMMM yyyy à HH:mm", { locale: fr })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusDisplay(selectedSale.status, 'sale').color}>
                    {getStatusDisplay(selectedSale.status, 'sale').label}
                  </Badge>
                  
                  <Badge className={getPaymentMethodDisplay(selectedSale.paymentMethod).color}>
                    {getPaymentMethodDisplay(selectedSale.paymentMethod).label}
                  </Badge>
                  
                  {selectedSale.refund && (
                    <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
                      Remboursé le {format(new Date(selectedSale.refund.timestamp), "dd/MM/yyyy", { locale: fr })}
                    </Badge>
                  )}
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Informations de la vente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Terminal:</span>
                        <p className="text-sm text-muted-foreground">{selectedSale.posName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Utilisateur:</span>
                        <p className="text-sm text-muted-foreground">{selectedSale.userName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Date:</span>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedSale.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Mode de paiement:</span>
                        <p className="text-sm text-muted-foreground">
                          {getPaymentMethodDisplay(selectedSale.paymentMethod).label}
                        </p>
                      </div>
                    </div>
                    
                    {selectedSale.refund && (
                      <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                        <div className="flex items-start">
                          <div className="mr-2 mt-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-600">Remboursement</p>
                            <p className="text-sm text-red-600">
                              Effectué le {format(new Date(selectedSale.refund.timestamp), "dd/MM/yyyy à HH:mm", { locale: fr })}
                            </p>
                            <p className="text-sm text-red-600">
                              Motif: {selectedSale.refund.reason}
                            </p>
                            <p className="text-sm text-red-600">
                              Par: {selectedSale.refund.by}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Article</TableHead>
                          <TableHead className="text-right">Prix unitaire</TableHead>
                          <TableHead className="text-center">Qté</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSale.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.category}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(item.price)}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {selectedSale.discount && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium">
                              Remise {selectedSale.discount.type === "percentage" ? `(${selectedSale.discount.value}%)` : ""}:
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              - {formatAmount(
                                selectedSale.discount.type === "percentage" 
                                ? (selectedSale.items.reduce((total, item) => total + (item.price * item.quantity), 0) * selectedSale.discount.value / 100)
                                : selectedSale.discount.value
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                        
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total:
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatAmount(selectedSale.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsViewSaleModalOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}