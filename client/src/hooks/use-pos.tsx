// hooks/use-pos.tsx

import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  PosDevice,
  ProductCategory,
  Product,
  PosTable,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  PosHistory,
  InsertPosHistory,
} from "../../shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

/**
 * Defines the shape of the data and functions available via the PosContext.
 */
type PosContextType = {
  posDevice: PosDevice | null;
  posTables: PosTable[] | null;
  products: Product[] | null;
  productCategories: ProductCategory[] | null;
  isLoading: boolean;
  error: Error | null;
  createOrderMutation: UseMutationResult<Order, Error, InsertOrder>;
  updateOrderMutation: UseMutationResult<Order, Error, { id: number; data: Partial<Order> }>;
  createOrderItemMutation: UseMutationResult<
    OrderItem,
    Error,
    InsertOrderItem
  >;
  createPosHistoryMutation: UseMutationResult<
    PosHistory,
    Error,
    InsertPosHistory
  >;
};

/**
 * Creates the context for the POS system.
 */
export const PosContext = createContext<PosContextType | null>(null);

/**
 * The provider component that fetches and provides POS data and mutations.
 * @param children The child components to render within the provider's scope.
 */
export function PosProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  // NOTE: This assumes a posDeviceId is stored or available somewhere, for example, in local storage.
  const posDeviceId = "1"; // Placeholder for the actual device ID

  /**
   * Fetches the specific POS device by its ID.
   */
  const {
    data: posDevice,
    error: posDeviceError,
    isLoading: isPosDeviceLoading,
  } = useQuery<PosDevice | null, Error>({
    queryKey: ["/api/pos/devices", posDeviceId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!posDeviceId,
  });

  /**
   * Fetches all POS tables.
   */
  const {
    data: posTables,
    error: posTablesError,
    isLoading: isPosTablesLoading,
  } = useQuery<PosTable[] | null, Error>({
    queryKey: ["/api/pos/tables"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  /**
   * Fetches all products.
   */
  const {
    data: products,
    error: productsError,
    isLoading: isProductsLoading,
  } = useQuery<Product[] | null, Error>({
    queryKey: ["/api/pos/products"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  /**
   * Fetches all product categories.
   */
  const {
    data: productCategories,
    error: productCategoriesError,
    isLoading: isProductCategoriesLoading,
  } = useQuery<ProductCategory[] | null, Error>({
    queryKey: ["/api/pos/products/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  /**
   * Mutation to create a new order.
   */
  const createOrderMutation = useMutation({
    mutationFn: async (newOrder: InsertOrder) => {
      const res = await apiRequest("POST", "/api/pos/orders", newOrder);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/orders"] });
      toast({
        title: "Commande créée",
        description: "La nouvelle commande a été ajoutée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation to update an existing order.
   */
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Order> }) => {
      const res = await apiRequest("PATCH", `/api/pos/orders/${id}`, data);
      return await res.json();
    },
    onSuccess: (updatedOrder: Order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/orders"] });
      queryClient.setQueryData(
        ["/api/pos/orders", updatedOrder.id],
        updatedOrder
      );
      toast({
        title: "Commande mise à jour",
        description: `La commande #${updatedOrder.id} a été mise à jour.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation to create a new order item.
   */
  const createOrderItemMutation = useMutation({
    mutationFn: async (newOrderItem: InsertOrderItem) => {
      const res = await apiRequest(
        "POST",
        "/api/pos/orders/items",
        newOrderItem
      );
      return await res.json();
    },
    onSuccess: (newOrderItem: OrderItem) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/pos/orders", newOrderItem.orderId],
      });
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à la commande.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation to create a new POS history entry.
   */
  const createPosHistoryMutation = useMutation({
    mutationFn: async (newHistory: InsertPosHistory) => {
      const res = await apiRequest("POST", "/api/pos/history", newHistory);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pos/history"] });
      toast({
        title: "Historique mis à jour",
        description: "L'historique des transactions a été mis à jour.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading =
    isPosDeviceLoading ||
    isPosTablesLoading ||
    isProductsLoading ||
    isProductCategoriesLoading;
  const error =
    posDeviceError || posTablesError || productsError || productCategoriesError;

  const value = {
    posDevice: posDevice ?? null,
    posTables: posTables ?? null,
    products: products ?? null,
    productCategories: productCategories ?? null,
    isLoading,
    error,
    createOrderMutation,
    updateOrderMutation,
    createOrderItemMutation,
    createPosHistoryMutation,
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

/**
 * A custom hook to consume the PosContext.
 * @returns The context value for the POS system.
 * @throws An error if the hook is used outside of a PosProvider.
 */
export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePos must be used within a PosProvider");
  }
  return context;
}