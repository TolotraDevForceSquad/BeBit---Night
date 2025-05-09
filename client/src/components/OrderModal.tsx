import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2, AlertCircle, Plus, Minus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { POSTable } from './TableManagementModal';
import { Product } from './ProductModal';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: number;
  tableId?: number;
  tableName?: string;
  customerId?: number;
  customerName?: string;
  items: OrderItem[];
  total: number;
  discount?: number;
  tax?: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  paymentMethod?: 'cash' | 'card' | 'mobile' | 'pending';
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  editingOrder: Order | null;
  tables: POSTable[];
  products: Product[];
  selectedTableId?: number;
}

const OrderModal = ({
  isOpen,
  onClose,
  onSave,
  editingOrder,
  tables,
  products,
  selectedTableId
}: OrderModalProps) => {
  const [order, setOrder] = useState<Order>({
    id: 0,
    items: [],
    total: 0,
    status: 'pending',
    createdAt: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Initialiser le formulaire
  useEffect(() => {
    if (editingOrder) {
      setOrder(editingOrder);
    } else {
      // Pour une nouvelle commande
      const newOrder: Order = {
        id: Date.now(),
        items: [],
        total: 0,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Si on a une table sélectionnée
      if (selectedTableId) {
        const selectedTable = tables.find(t => t.id === selectedTableId);
        if (selectedTable) {
          newOrder.tableId = selectedTable.id;
          newOrder.tableName = selectedTable.name + (selectedTable.number ? ` #${selectedTable.number}` : '');
        }
      }
      
      setOrder(newOrder);
    }
  }, [editingOrder, selectedTableId, tables]);

  // Mettre à jour le total quand les articles changent
  useEffect(() => {
    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = order.discount || 0;
    const tax = order.tax || 0;
    const total = subtotal - discount + tax;
    
    setOrder(prev => ({
      ...prev,
      total
    }));
  }, [order.items, order.discount, order.tax]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (order.items.length === 0) {
      setError('Veuillez ajouter au moins un article à la commande.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      onSave(order);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleTableChange = (value: string) => {
    if (value) {
      const tableId = parseInt(value);
      const selectedTable = tables.find(t => t.id === tableId);
      
      if (selectedTable) {
        setOrder(prev => ({
          ...prev,
          tableId,
          tableName: selectedTable.name + (selectedTable.number ? ` #${selectedTable.number}` : '')
        }));
      }
    } else {
      setOrder(prev => ({
        ...prev,
        tableId: undefined,
        tableName: undefined
      }));
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId) {
      setError('Veuillez sélectionner un produit.');
      return;
    }
    
    if (quantity <= 0) {
      setError('La quantité doit être supérieure à zéro.');
      return;
    }
    
    const productId = parseInt(selectedProductId);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      setError('Produit non trouvé.');
      return;
    }
    
    const subtotal = product.price * quantity;
    
    const newItem: OrderItem = {
      id: Date.now(),
      productId,
      productName: product.name,
      price: product.price,
      quantity,
      subtotal,
      notes: notes || undefined
    };
    
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    // Réinitialiser les champs
    setSelectedProductId('');
    setQuantity(1);
    setNotes('');
    setError(null);
  };

  const handleRemoveItem = (itemId: number) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleUpdateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const subtotal = item.price * newQuantity;
          return { ...item, quantity: newQuantity, subtotal };
        }
        return item;
      })
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setOrder(prev => ({
      ...prev,
      paymentMethod: value as 'cash' | 'card' | 'mobile' | 'pending'
    }));
  };

  const handleStatusChange = (value: string) => {
    setOrder(prev => ({
      ...prev,
      status: value as 'pending' | 'processing' | 'completed' | 'cancelled'
    }));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setOrder(prev => ({
      ...prev,
      discount: value
    }));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setOrder(prev => ({
      ...prev,
      tax: value
    }));
  };

  // Filtrer les tables disponibles (ignorer les tables déjà occupées, sauf celle sélectionnée)
  const availableTables = tables.filter(t => 
    t.status !== 'occupied' || (order.tableId && t.id === order.tableId)
  );

  // Regrouper les produits par catégorie
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.categoryName || 'Sans catégorie';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Produits disponibles seulement
  const availableProducts = products.filter(p => p.isAvailable);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? `Modifier la commande #${editingOrder.id}` : 'Nouvelle commande'}
          </DialogTitle>
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
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Informations</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table
                  </Label>
                  <Select
                    value={order.tableId?.toString() || ''}
                    onValueChange={handleTableChange}
                    disabled={!!selectedTableId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez une table (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune table (à emporter)</SelectItem>
                      {availableTables.map(table => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {table.name}{table.number ? ` #${table.number}` : ''} ({table.area})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {editingOrder && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Statut
                      </Label>
                      <Select
                        value={order.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="col-span-3">
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
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="payment" className="text-right">
                        Paiement
                      </Label>
                      <Select
                        value={order.paymentMethod || 'pending'}
                        onValueChange={handlePaymentMethodChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Méthode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="cash">Espèces</SelectItem>
                          <SelectItem value="card">Carte bancaire</SelectItem>
                          <SelectItem value="mobile">Paiement mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Remise (Ar)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={order.discount || ''}
                    onChange={handleDiscountChange}
                    className="col-span-3"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tax" className="text-right">
                    Taxe (Ar)
                  </Label>
                  <Input
                    id="tax"
                    name="tax"
                    type="number"
                    value={order.tax || ''}
                    onChange={handleTaxChange}
                    className="col-span-3"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-4">Résumé</h3>
                
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {order.items.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      Aucun article ajouté à la commande
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-start justify-between pb-4 border-b last:border-0">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">{item.productName}</h4>
                              <span className="text-sm">{item.subtotal.toLocaleString()} Ar</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 text-sm">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <span className="ml-3 text-xs text-muted-foreground">
                                {item.price.toLocaleString()} Ar/unité
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1">Note: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total:</span>
                    <span>{order.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()} Ar</span>
                  </div>
                  {(order.discount && order.discount > 0) && (
                    <div className="flex justify-between text-sm">
                      <span>Remise:</span>
                      <span>-{order.discount.toLocaleString()} Ar</span>
                    </div>
                  )}
                  {(order.tax && order.tax > 0) && (
                    <div className="flex justify-between text-sm">
                      <span>Taxe:</span>
                      <span>{order.tax.toLocaleString()} Ar</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{order.total.toLocaleString()} Ar</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Ajouter des articles</h3>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                      <React.Fragment key={category}>
                        <SelectItem value={`category_${category}`} disabled>
                          {category}
                        </SelectItem>
                        {categoryProducts
                          .filter(p => p.isAvailable)
                          .map(product => (
                            <SelectItem key={product.id} value={product.id.toString()} className="pl-6">
                              {product.name} - {product.price.toLocaleString()} Ar
                            </SelectItem>
                          ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <Label htmlFor="quantity" className="text-sm">
                      Quantité
                    </Label>
                    <div className="flex items-center mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-r-none"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="rounded-none w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-2/3">
                    <Label htmlFor="notes" className="text-sm">
                      Notes (optionnel)
                    </Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                      placeholder="Ex: Sans glace, bien cuit, etc."
                    />
                  </div>
                </div>
                
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter à la commande
                </Button>
              </div>
              
              <h3 className="text-sm font-medium mt-6 mb-4">Produits populaires</h3>
              
              <ScrollArea className="h-[370px]">
                <div className="grid grid-cols-2 gap-3">
                  {availableProducts.slice(0, 6).map(product => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:bg-accent/40 transition-colors"
                      onClick={() => {
                        setSelectedProductId(product.id.toString());
                        setQuantity(1);
                      }}
                    >
                      <CardHeader className="p-3 pb-0">
                        <div className="text-sm font-medium truncate">{product.name}</div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                        {product.categoryName}
                      </CardContent>
                      <CardFooter className="pt-0 p-3 justify-between">
                        <Badge variant="outline">{product.price.toLocaleString()} Ar</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(product.id.toString());
                            handleAddItem();
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || order.items.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingOrder ? 'Mettre à jour' : 'Créer la commande'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;