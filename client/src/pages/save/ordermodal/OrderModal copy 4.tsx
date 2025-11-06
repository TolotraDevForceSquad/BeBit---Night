// OrderModal.tsx
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
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Order, InsertOrder, OrderItem, InsertOrderItem, Product, ProductCategory, PosTable } from '@shared/schema';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Partial<InsertOrder>, itemsData: InsertOrderItem[]) => void;
  editingOrder: Order | null;
  products: Product[];
  categories: ProductCategory[];
  tables: PosTable[];
  orderItems: OrderItem[];
  initialTableId?: number;
}

const OrderModal = ({
  isOpen,
  onClose,
  onSave,
  editingOrder,
  products,
  categories,
  tables,
  orderItems,
  initialTableId,
}: OrderModalProps) => {
  const [cart, setCart] = useState<Record<number, { quantity: number; notes: string; price?: number }>>({});
  const [selectedTable, setSelectedTable] = useState<string>('takeaway');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [generalNotes, setGeneralNotes] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [addQuantity, setAddQuantity] = useState(1);
  const [addNotes, setAddNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingOrder) {
      const initial: Record<number, { quantity: number; notes: string; price?: number }> = {};
      const items = orderItems.filter(oi => oi.orderId === editingOrder.id);
      items.forEach((item) => {
        const id = item.productId;
        if (!initial[id]) {
          initial[id] = { quantity: 0, notes: '', price: item.price };
        }
        initial[id].quantity += item.quantity;
        if (item.notes) {
          if (initial[id].notes) {
            initial[id].notes += `\n${item.notes}`;
          } else {
            initial[id].notes = item.notes;
          }
        }
      });
      setCart(initial);
      setSelectedTable(editingOrder.tableId?.toString() || 'takeaway');
      setCustomerName(editingOrder.customerName || '');
      setGeneralNotes('');

      // Calculate initial subtotal using original prices
      const initialSubtotal = Object.entries(initial).reduce((sum, [idStr, data]) => {
        const id = parseInt(idStr);
        const pr = data.price ?? products.find(p => p.id === id)?.price ?? 0;
        return sum + data.quantity * pr;
      }, 0);

      const oldTotal = editingOrder.total ?? 0;
      const diff = oldTotal - initialSubtotal;
      if (diff > 0) {
        setTax(diff);
        setDiscount(0);
      } else {
        setDiscount(-diff);
        setTax(0);
      }
    } else {
      setCart({});
      setSelectedTable(initialTableId ? initialTableId.toString() : 'takeaway');
      setCustomerName('');
      setDiscount(0);
      setTax(0);
      setGeneralNotes('');
    }
  }, [editingOrder, orderItems, initialTableId, products]);

  useEffect(() => {
    if (selectedProductId) {
      const id = parseInt(selectedProductId);
      const current = cart[id];
      setAddQuantity(current?.quantity || 1);
      setAddNotes(current?.notes || '');
    } else {
      setAddQuantity(1);
      setAddNotes('');
    }
  }, [selectedProductId, cart]);

  const subTotal = Object.entries(cart).reduce((sum, [idStr, c]) => {
    const id = parseInt(idStr);
    const pr = (c.price ?? products.find(p => p.id === id)?.price) || 0;
    return sum + c.quantity * pr;
  }, 0);
  const total = subTotal - discount + tax;

  const cartEntries = Object.entries(cart)
    .map(([idStr, data]) => {
      const id = parseInt(idStr);
      const product = products.find(p => p.id === id);
      return { id, product, ...data };
    })
    .filter(e => e.quantity > 0);

  const handleQuantityChange = (productId: number, delta: number) => {
    const current = cart[productId] ?? { quantity: 0, notes: '' };
    const newQ = Math.max(0, current.quantity + delta);
    if (newQ > 0) {
      setCart({ ...cart, [productId]: { ...current, quantity: newQ } });
    } else {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    }
  };

  const handleNotesChange = (productId: number, newNotes: string) => {
    const current = cart[productId] ?? { quantity: 0, notes: '' };
    setCart({ ...cart, [productId]: { ...current, notes: newNotes } });
  };

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const id = parseInt(selectedProductId);
    const current = cart[id] ?? { quantity: 0, notes: '' };
    const newQ = addQuantity;
    if (newQ > 0) {
      setCart({ ...cart, [id]: { ...current, quantity: newQ, notes: addNotes } });
    } else {
      const newCart = { ...cart };
      delete newCart[id];
      setCart(newCart);
    }
    setSelectedProductId(undefined);
    setAddQuantity(1);
    setAddNotes('');
  };

  const removeItem = (productId: number) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const tableId = selectedTable === 'takeaway' ? null : parseInt(selectedTable);
    const orderData: Partial<InsertOrder> = {
      tableId,
      customerName: customerName || null,
      status: editingOrder ? editingOrder.status : 'pending',
      total,
      paymentMethod: null,
      priority: null,
      estimatedCompletionTime: null,
    };

    if (editingOrder) {
      orderData.paymentMethod = editingOrder.paymentMethod;
      orderData.priority = editingOrder.priority;
      orderData.estimatedCompletionTime = editingOrder.estimatedCompletionTime;
    }

    const items: InsertOrderItem[] = cartEntries.map(entry => ({
      orderId: editingOrder?.id || 0, // Will be overridden in onSave
      productId: entry.id,
      quantity: entry.quantity,
      price: entry.price ?? entry.product?.price,
      subtotal: entry.quantity * (entry.price ?? entry.product?.price ?? 0),
      notes: entry.notes || null,
      status: 'pending',
      category: null,
      preparationTime: null,
    }));

    if (cartEntries.length === 0) {
      setErrorMessage('Veuillez ajouter au moins un article à la commande.');
      return;
    }

    onSave(orderData, items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] overflow-y-auto pt-10">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? 'Modifiez la commande existante.' : 'Créez une nouvelle commande pour une table ou à emporter.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 mx-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0">
            {/* Colonne Résumé */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Résumé</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {cartEntries.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between pb-4 border-b">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm">{entry.product?.name || 'Produit inconnu'}</h4>
                          <span className="text-sm">{entry.quantity * (entry.price ?? entry.product?.price ?? 0)} Ar</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(entry.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm">{entry.quantity}</span>
                          <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(entry.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-3 text-xs text-muted-foreground">{entry.price ?? entry.product?.price ?? 0} Ar/unité</span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => removeItem(entry.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                        <Textarea
                          className="text-xs mt-1"
                          placeholder="Note"
                          value={entry.notes}
                          onChange={(e) => handleNotesChange(entry.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>{subTotal} Ar</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{total} Ar</span>
                </div>
              </div>
            </div>

            {/* Colonne Informations */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">Table</Label>
                  <Select onValueChange={setSelectedTable} value={selectedTable}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez une table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="takeaway">À emporter</SelectItem>
                      {tables.map((table) => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {table.name} ({table.area}, {table.capacity} places) - {table.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerName" className="text-right">Client</Label>
                  <Input id="customerName" placeholder="Nom du client (optionnel)" className="col-span-3" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">Remise (Ar)</Label>
                  <Input id="discount" className="col-span-3" placeholder="0" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tax" className="text-right">Taxe (Ar)</Label>
                  <Input id="tax" className="col-span-3" placeholder="0" type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea id="notes" rows={3} className="col-span-3" placeholder="Notes générales (optionnel)" value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Colonne Ajout d'articles */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Ajouter des articles</h3>
              <Tabs defaultValue="products">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="products">Tous les produits</TabsTrigger>
                  <TabsTrigger value="popular">Populaires</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.isActive).map((cat) => (
                        <SelectGroup key={cat.id}>
                          <SelectLabel className="font-bold text-primary">{cat.name}</SelectLabel>
                          {products.filter(p => p.categoryId === cat.id && p.isAvailable).map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name} - {p.price} Ar
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 w-1/3">
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => setAddQuantity(Math.max(0, addQuantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input className="text-center h-9" value={addQuantity} readOnly />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => setAddQuantity(addQuantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input placeholder="Notes" className="w-2/3" value={addNotes} onChange={(e) => setAddNotes(e.target.value)} />
                  </div>
                  <Button type="button" className="w-full mt-2" onClick={handleAddItem} disabled={!selectedProductId}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter à la commande
                  </Button>
                </TabsContent>

                <TabsContent value="popular">
                  <ScrollArea className="h-[210px]">
                    <div className="grid grid-cols-2 gap-3">
                      {products.filter(p => p.isAvailable).slice(0, 6).map((p) => {
                        const cat = categories.find(c => c.id === p.categoryId);
                        const currentQuantity = cart[p.id]?.quantity || 0;
                        return (
                          <Card key={p.id} className="cursor-pointer hover:bg-accent/40 transition-colors">
                            <CardHeader className="p-3 pb-0">
                              <div className="text-sm font-medium truncate">{p.name}</div>
                            </CardHeader>
                            <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                              {cat?.name || 'Inconnu'}
                            </CardContent>
                            <CardFooter className="pt-0 p-3 justify-between">
                              <Badge variant="outline">{p.price} Ar</Badge>
                              <div className="flex items-center gap-1">
                                <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(p.id, -1)} disabled={currentQuantity === 0}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium min-w-[20px] text-center">{currentQuantity}</span>
                                <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(p.id, 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background border-t p-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{editingOrder ? 'Mettre à jour' : 'Créer'} la commande</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;