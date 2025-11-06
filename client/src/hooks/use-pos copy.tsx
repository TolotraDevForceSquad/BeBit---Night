// hooks/use-pos.tsx

import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  PosDevice,
  InsertPosDevice,
  ProductCategory,
  InsertProductCategory,
  Product,
  InsertProduct,
  PosTable,
  InsertPosTable,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  PosHistory,
  InsertPosHistory,
} from "../../../shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

type PosContextType = {
  // Devices
  devices: PosDevice[] | undefined;
  isLoadingDevices: boolean;
  createDeviceMutation: UseMutationResult<PosDevice, Error, InsertPosDevice>;

  // Product Categories
  productCategories: ProductCategory[] | undefined;
  isLoadingProductCategories: boolean;
  createProductCategoryMutation: UseMutationResult<ProductCategory, Error, InsertProductCategory>;

  // Products
  products: Product[] | undefined;
  isLoadingProducts: boolean;
  createProductMutation: UseMutationResult<Product, Error, InsertProduct>;

  // Tables
  tables: PosTable[] | undefined;
  isLoadingTables: boolean;
  createTableMutation: UseMutationResult<PosTable, Error, InsertPosTable>;

  // Orders
  createOrderMutation: UseMutationResult<Order, Error, InsertOrder>;
  updateOrderMutation: UseMutationResult<Order | undefined, Error, { id: number; data: Partial<Order> }>;
  createOrderItemMutation: UseMutationResult<OrderItem, Error, InsertOrderItem>;
};

export const PosContext = createContext<PosContextType | null>(null);

export function PosProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Queries
  const { data: devices, isLoading: isLoadingDevices } = useQuery<PosDevice[], Error>({
    queryKey: ["/api/pos/devices"],
    queryFn: getQueryFn(),
  });

  const { data: productCategories, isLoading: isLoadingProductCategories } = useQuery<ProductCategory[], Error>({
    queryKey: ["/api/pos/products/categories"],
    queryFn: getQueryFn(),
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[], Error>({
    queryKey: ["/api/pos/products"],
    queryFn: getQueryFn(),
  });

  const { data: tables, isLoading: isLoadingTables } = useQuery<PosTable[], Error>({
    queryKey: ["/api/pos/tables"],
    queryFn: getQueryFn(),
  });

  // Mutations
  const createDeviceMutation = useMutation({
    mutationFn: (data: InsertPosDevice) => apiRequest("POST", "/api/pos/devices", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/devices"] });
      toast({
        title: "Appareil ajouté",
        description: "Le nouvel appareil POS a été ajouté avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'ajout de l'appareil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createProductCategoryMutation = useMutation({
    mutationFn: (data: InsertProductCategory) => apiRequest("POST", "/api/pos/products/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/products/categories"] });
      toast({
        title: "Catégorie ajoutée",
        description: "La nouvelle catégorie de produits a été ajoutée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'ajout de la catégorie",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("POST", "/api/pos/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/products"] });
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'ajout du produit",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createTableMutation = useMutation({
    mutationFn: (data: InsertPosTable) => apiRequest("POST", "/api/pos/tables", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/tables"] });
      toast({
        title: "Table ajoutée",
        description: "La nouvelle table POS a été ajoutée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'ajout de la table",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: InsertOrder) => apiRequest("POST", "/api/pos/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/orders"] });
      toast({
        title: "Commande créée",
        description: "La nouvelle commande a été créée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de la création de la commande",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Order> }) =>
      apiRequest("PATCH", `/api/pos/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/orders"] });
      toast({
        title: "Commande mise à jour",
        description: "La commande a été mise à jour avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de la mise à jour de la commande",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createOrderItemMutation = useMutation({
    mutationFn: (data: InsertOrderItem) => apiRequest("POST", "/api/pos/orders/items", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/orders"] });
      toast({
        title: "Article de commande ajouté",
        description: "L'article a été ajouté à la commande avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'ajout de l'article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <PosContext.Provider
      value={{
        devices,
        isLoadingDevices,
        createDeviceMutation,
        productCategories,
        isLoadingProductCategories,
        createProductCategoryMutation,
        products,
        isLoadingProducts,
        createProductMutation,
        tables,
        isLoadingTables,
        createTableMutation,
        createOrderMutation,
        updateOrderMutation,
        createOrderItemMutation,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePos must be used within a PosProvider");
  }
  return context;
}