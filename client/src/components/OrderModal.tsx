import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, AlertCircle, X, Plus, Minus, Trash } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { POSTable } from "./TableManagementModal";
import { Product } from "./ProductModal";
import { ProductCategory } from "./ProductCategoryModal";

// Type pour les articles d'une commande
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

// Type pour une commande/facture
export interface Order {
  id: number;
  tableId?: number;
  tableName?: string;
  customerId?: number;
  customerName?: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  discount?: number;
  tax?: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: 'cash' | 'card' | 'mobile' | 'pending';
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  editingOrder: Order | null;
  tables: POSTable[];
  products: Product[];
  categories: ProductCategory[];
}

const OrderModal = ({
  isOpen,
  onClose,
  onSave,
  editingOrder,
  tables,
  products,
  categories
}: OrderModalProps) => {
  const [order, setOrder] = useState<Order>({
    id: 0,
    items: [],
    status: 'pending',
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialiser la commande lorsqu'on modifie une commande existante
  useEffect(() => {
    if (editingOrder) {
      setOrder({ ...editingOrder });
    } else {
      // Réinitialiser pour une nouvelle commande
      setOrder({
        id: Date.now(),
        items: [],
        status: 'pending',
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [editingOrder]);
  
  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (order.items.length === 0) {
      setError("Veuillez ajouter au moins un article à la commande.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Mettre à jour le total
    const updatedOrder = {
      ...order,
      total: calculateTotal(order.items),
      updatedAt: new Date()
    };
    
    // Simuler une requête API
    setTimeout(() => {
      onSave(updatedOrder);
      setIsLoading(false);
      onClose();
    }, 500);
  };
  
  const handleAddProduct = () => {
    if (!selectedProduct) {
      setError("Veuillez sélectionner un produit.");
      return;
    }
    
    if (quantity <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      return;
    }
    
    const product = products.find(p => p.id === selectedProduct);
    
    if (!product) {
      setError("Produit introuvable.");
      return;
    }
    
    // Vérifier si le produit est déjà dans la commande
    const existingItemIndex = order.items.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité et le sous-total
      const updatedItems = [...order.items];
      const currentQuantity = updatedItems[existingItemIndex].quantity;
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: currentQuantity + quantity,
        subtotal: (currentQuantity + quantity) * product.price
      };
      
      setOrder({
        ...order,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
    } else {
      // Ajouter un nouvel article
      const newItem: OrderItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: quantity * product.price
      };
      
      const updatedItems = [...order.items, newItem];
      
      setOrder({
        ...order,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
    }
    
    // Réinitialiser pour le prochain ajout
    setQuantity(1);
    setError(null);
  };
  
  const handleRemoveItem = (itemId: number) => {
    const updatedItems = order.items.filter(item => item.id !== itemId);
    
    setOrder({
      ...order,
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  };
  
  const handleUpdateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    const updatedItems = order.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unitPrice
        };
      }
      return item;
    });
    
    setOrder({
      ...order,
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  };
  
  // Filtrer les produits par catégorie
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory && p.isAvailable)
    : products.filter(p => p.isAvailable);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}</DialogTitle>
          <DialogDescription>
            {editingOrder 
              ? 'Modifiez les détails de la commande.' 
              : 'Créez une nouvelle commande.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="table">Table</Label>
              <Select 
                value={order.tableId?.toString() || ""} 
                onValueChange={(val) => {
                  const selectedTable = tables.find(t => t.id === parseInt(val));
                  setOrder(prev => ({ 
                    ...prev, 
                    tableId: parseInt(val),
                    tableName: selectedTable?.name || ""
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune table (à emporter)</SelectItem>
                  {tables.map(table => (
                    <SelectItem key={table.id} value={table.id.toString()}>
                      {table.name} ({table.area})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={order.status} 
                onValueChange={(val) => setOrder(prev => ({ 
                  ...prev, 
                  status: val as 'pending' | 'processing' | 'completed' | 'cancelled'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Ajouter des produits</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={selectedCategory?.toString() || "all"} 
                  onValueChange={(val) => setSelectedCategory(val === "all" ? null : parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="product">Produit</Label>
                <Select 
                  value={selectedProduct?.toString() || ""} 
                  onValueChange={(val) => setSelectedProduct(val ? parseInt(val) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - {product.price.toLocaleString()} Ar
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <div className="flex-grow">
                <Label htmlFor="quantity">Quantité</Label>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="mx-2 text-center"
                    min="1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button type="button" onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md mb-6">
            <h3 className="text-lg font-semibold p-4 border-b">Articles de la commande</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">Produit</th>
                    <th className="text-center p-2 font-medium">Prix unitaire</th>
                    <th className="text-center p-2 font-medium">Quantité</th>
                    <th className="text-right p-2 font-medium">Sous-total</th>
                    <th className="p-2 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.length > 0 ? (
                    order.items.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.productName}</td>
                        <td className="p-2 text-center">{item.unitPrice.toLocaleString()} Ar</td>
                        <td className="p-2">
                          <div className="flex items-center justify-center">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-2 text-right">{item.subtotal.toLocaleString()} Ar</td>
                        <td className="p-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        Aucun article dans la commande
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="p-2 text-right font-medium">Total:</td>
                    <td className="p-2 text-right font-bold">{order.total.toLocaleString()} Ar</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select 
                value={order.paymentMethod || "pending"} 
                onValueChange={(val) => setOrder(prev => ({ 
                  ...prev, 
                  paymentMethod: val as 'cash' | 'card' | 'mobile' | 'pending'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="mobile">Paiement mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="customerName">Nom du client (optionnel)</Label>
              <Input
                id="customerName"
                value={order.customerName || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Nom du client"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingOrder ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;