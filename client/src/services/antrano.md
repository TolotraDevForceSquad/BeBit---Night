```jsx
import React, { useState, useEffect } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  PlusCircle,
  Settings,
  Trash,
  Edit,
  Printer,
  PlusSquare,
  DollarSign,
  FileText,
} from 'lucide-react';

import { api } from '../../services/api';
import {
  PosTable,
  Order,
  OrderItem,
  Product,
  ProductCategory
} from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import TableManagementModal from '../../components/TableManagementModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const POSTablesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("floor-plan");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // États avec types corrects depuis schema.ts
  const [tables, setTables] = useState<PosTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // États pour les modals
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<PosTable | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'table' | 'order', id: number } | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadTables(),
          loadOrders(),
          loadProducts(),
          loadCategories(),
        ]);
        toast({ title: "Données chargées avec succès" });
      } catch (error) {
        toast({
          title: "Erreur lors du chargement des données",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const loadTables = async () => {
    try {
      const data = await api.getAllPosTables(); // Appel API sans filters
      setTables(data);
      console.log('Données retournées pour les tables (PosTable):\n', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erreur loadTables:', error);
      throw error; // Propage pour le toast global
    }
  };

  const loadOrders = async () => {
    try {
      const data = await api.getAllOrders(); // Appel API sans filters
      setOrders(data);
      console.log('Données retournées pour les orders (Order):\n', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erreur loadOrders:', error);
      throw error;
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getAllProducts(); // Appel API sans filters
      setProducts(data);
      console.log('Données retournées pour les products (Product):\n', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erreur loadProducts:', error);
      throw error;
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getAllProductCategories(); // Appel API sans filters
      setCategories(data);
      console.log('Données retournées pour les categories (ProductCategory):\n', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erreur loadCategories:', error);
      throw error;
    }
  };

  // Placeholder pour le reste de la logique (à implémenter plus tard)
  const uniqueAreas = []; // Logique pour obtenir les zones uniques
  const tablesByArea = {}; // Logique de regroupement par zone
  const filteredTables = []; // Logique de filtrage des tables
  const filteredOrders = []; // Logique de filtrage des commandes

  const handleAddTable = () => {};
  const handleEditTable = (table: PosTable) => {};
  const handleDeleteTable = (tableId: number) => {};
  const handleSaveTable = async (table: PosTable) => {};
  const handleAddOrder = (tableId?: number) => {};
  const handleEditOrder = (order: Order) => {};
  const handleDeleteOrder = (orderId: number) => {};
  const handleCompleteOrder = async (orderId: number) => {};
  const handleSaveOrder = async (order: Order) => {};
  const confirmDeleteItem = async () => {};
  const getTableOrder = (tableId: number) => {};

  const totalTables = 0;
  const occupiedTables = 0;
  const reservedTables = 0;
  const availableTables = 0;
  const pendingOrders = 0;
  const processingOrders = 0;
  const completedOrders = 0;
  const todayOrders = [];
  const todayRevenue = 0;

  // ... (le reste du JSX reste inchangé, ajoute-le selon ton rendu existant)

  return (
    <POSLayout>
      {/* Ton JSX existant ici */}
    </POSLayout>
  );
};

export default POSTablesPage;