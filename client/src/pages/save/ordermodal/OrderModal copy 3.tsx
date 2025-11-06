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

const OrderModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const Orders = [
    {
      "id": 35,
      "tableId": 2,
      "customerName": null,
      "status": "pending",
      "total": 20000,
      "createdAt": "2025-09-10T09:40:28.085Z",
      "updatedAt": "2025-09-10T09:40:28.085Z",
      "paymentMethod": null,
      "priority": null,
      "estimatedCompletionTime": null
    }
  ];

  const Tables = [
    {
      "id": 2,
      "name": "Table 2",
      "number": 2,
      "area": "Terrasse",
      "capacity": 2,
      "status": "occupied",
      "currentOrderId": 35
    },
    {
      "id": 3,
      "name": "Table 3",
      "number": 3,
      "area": "Terrasse",
      "capacity": 4,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 4,
      "name": "Table 4",
      "number": 4,
      "area": "Intérieur",
      "capacity": 6,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 5,
      "name": "Table 5",
      "number": 5,
      "area": "Intérieur",
      "capacity": 4,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 6,
      "name": "Table 6",
      "number": 6,
      "area": "Intérieur",
      "capacity": 4,
      "status": "available",
      "currentOrderId": 102
    },
    {
      "id": 7,
      "name": "Table 7",
      "number": 7,
      "area": "Intérieur",
      "capacity": 8,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 8,
      "name": "VIP Lounge 1",
      "number": 8,
      "area": "VIP",
      "capacity": 10,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 9,
      "name": "VIP Lounge 2",
      "number": 9,
      "area": "VIP",
      "capacity": 8,
      "status": "available",
      "currentOrderId": 103
    },
    {
      "id": 10,
      "name": "Bar 1",
      "number": 10,
      "area": "Bar",
      "capacity": 2,
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": 11,
      "name": "Bar 2",
      "number": 11,
      "area": "Bar",
      "capacity": 2,
      "status": "available",
      "currentOrderId": 104
    },
    {
      "id": 12,
      "name": "Bar 3",
      "number": 12,
      "area": "Bar",
      "capacity": 2,
      "status": "available",
      "currentOrderId": null
    }
  ];

  const OrderItems = [
    {
      "id": 35,
      "orderId": 35,
      "productId": 14,
      "quantity": 4,
      "price": 5000,
      "subtotal": 20000,
      "status": "pending",
      "category": null,
      "preparationTime": null,
      "notes": null
    }
  ];

  const Products = [
    {
      "id": 14,
      "name": "Bière Rou",
      "description": "THB/Star",
      "price": 5000,
      "categoryId": 3,
      "isAvailable": true,
      "imageUrl": null
    },
    {
      "id": 9,
      "name": "Burger Club",
      "description": "Burger avec frites",
      "price": 16,
      "categoryId": 5,
      "isAvailable": false,
      "imageUrl": "burger.jpg"
    },
    {
      "id": 7,
      "name": "Coca-Cola",
      "description": "Canette 33cl",
      "price": 5,
      "categoryId": 4,
      "isAvailable": true,
      "imageUrl": "coca.jpg"
    },
    {
      "id": 3,
      "name": "Cosmopolitan",
      "description": "Vodka, triple sec, cranberry",
      "price": 13,
      "categoryId": 1,
      "isAvailable": false,
      "imageUrl": "cosmo.jpg"
    },
    {
      "id": 6,
      "name": "Heineken",
      "description": "BiŠre pression 50cl",
      "price": 7,
      "categoryId": 3,
      "isAvailable": true,
      "imageUrl": "heineken.jpg"
    },
    {
      "id": 2,
      "name": "Margarita",
      "description": "Tequila, triple sec, citron vert",
      "price": 14,
      "categoryId": 1,
      "isAvailable": true,
      "imageUrl": "margarita.jpg"
    },
    {
      "id": 1,
      "name": "Mojito",
      "description": "Rhum, menthe, citron vert",
      "price": 12,
      "categoryId": 1,
      "isAvailable": true,
      "imageUrl": "mojito.jpg"
    },
    {
      "id": 10,
      "name": "Pizza Margherita",
      "description": "Pizza traditionnelle",
      "price": 14,
      "categoryId": 5,
      "isAvailable": true,
      "imageUrl": "pizza.jpg"
    },
    {
      "id": 8,
      "name": "Plateau fromage",
      "description": "Assortiment de fromages",
      "price": 18,
      "categoryId": 6,
      "isAvailable": true,
      "imageUrl": "plateau_fromage.jpg"
    },
    {
      "id": 0,
      "name": "Tenia ",
      "description": "kakana 2m",
      "price": 500,
      "categoryId": 16,
      "isAvailable": true,
      "imageUrl": null
    },
    {
      "id": 12,
      "name": "Tenia 1",
      "description": "Tenia 100",
      "price": 500,
      "categoryId": 16,
      "isAvailable": true,
      "imageUrl": null
    },
    {
      "id": 11,
      "name": "Tenia 2",
      "description": "Tenia 3m",
      "price": 1000,
      "categoryId": 16,
      "isAvailable": true,
      "imageUrl": null
    },
    {
      "id": 13,
      "name": "Tenia 3",
      "description": "Tenia 300\n",
      "price": 1500,
      "categoryId": 16,
      "isAvailable": true,
      "imageUrl": null
    },
    {
      "id": 5,
      "name": "Vin Blanc Maison",
      "description": "Verre de vin blanc",
      "price": 8,
      "categoryId": 2,
      "isAvailable": true,
      "imageUrl": "vin_blanc.jpg"
    },
    {
      "id": 4,
      "name": "Vin Rouge Maison",
      "description": "Verre de vin rouge",
      "price": 8,
      "categoryId": 2,
      "isAvailable": true,
      "imageUrl": "vin_rouge.jpg"
    }
  ];

  const ProductCategories = [
    {
      "id": 3,
      "name": "BiŠres",
      "description": "BiŠres pression et bouteilles",
      "isActive": true
    },
    {
      "id": 8,
      "name": "Boissons",
      "description": "Boisson bafas",
      "isActive": true
    },
    {
      "id": 1,
      "name": "Cocktails",
      "description": "Cocktails signature et classiques",
      "isActive": true
    },
    {
      "id": 16,
      "name": "Kakana",
      "description": "Kakana lava be, kkk non ts de lava kay ka",
      "isActive": false
    },
    {
      "id": 5,
      "name": "Plats",
      "description": "Carte restaurant",
      "isActive": true
    },
    {
      "id": 6,
      "name": "Snacks",
      "description": "En-cas et petits plats",
      "isActive": true
    },
    {
      "id": 4,
      "name": "Softs",
      "description": "Boissons non-alcoolis‚es",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Vins",
      "description": "Vins au verre et bouteilles",
      "isActive": true
    }
  ];

  const [cart, setCart] = useState<Record<number, { quantity: number; notes: string }>>(() => {
    const initial: Record<number, { quantity: number; notes: string }> = {};
    OrderItems.forEach((item) => {
      const id = item.productId;
      if (!initial[id]) {
        initial[id] = { quantity: 0, notes: item.notes || '' };
      }
      initial[id].quantity += item.quantity;
    });
    return initial;
  });

  const [selectedTable, setSelectedTable] = useState<string>('takeaway');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [generalNotes, setGeneralNotes] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [addQuantity, setAddQuantity] = useState(1);
  const [addNotes, setAddNotes] = useState('');

  const subTotal = Object.entries(cart).reduce((sum, [idStr, c]) => {
    const id = parseInt(idStr);
    const price = Products.find(p => p.id === id)?.price || 0;
    return sum + c.quantity * price;
  }, 0);
  const total = subTotal - discount + tax;

  const cartEntries = Object.entries(cart)
    .map(([idStr, data]) => {
      const id = parseInt(idStr);
      const product = Products.find(p => p.id === id);
      return { id, product, ...data };
    })
    .filter(e => e.quantity > 0);

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

  const handleQuantityChange = (productId: number, delta: number) => {
    const current = cart[productId]?.quantity || 0;
    const newQ = Math.max(0, current + delta);
    if (newQ > 0) {
      setCart({ ...cart, [productId]: { ...cart[productId], quantity: newQ } });
    } else {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const id = parseInt(selectedProductId);
    const newQ = addQuantity;
    if (newQ > 0) {
      setCart({ ...cart, [id]: { quantity: newQ, notes: addNotes } });
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
    const currentQ = cart[productId]?.quantity || 0;
    handleQuantityChange(productId, -currentQ);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      tableId: selectedTable === 'takeaway' ? null : parseInt(selectedTable),
      customerName,
      cart,
      discount,
      tax,
      total,
      generalNotes
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] overflow-y-auto pt-10">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Nouvelle commande
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle commande pour une table ou à emporter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Alert variant="destructive" className="mb-4 mx-6">
            <AlertDescription>Message d’erreur (exemple)</AlertDescription>
          </Alert>

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
                          <span className="text-sm">{entry.quantity * (entry.product?.price || 0)} Ar</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(entry.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm">{entry.quantity}</span>
                          <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(entry.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-3 text-xs text-muted-foreground">{entry.product?.price || 0} Ar/unité</span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => removeItem(entry.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Note : {entry.notes || 'Aucune'}</p>
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
                      {Tables.map((table) => (
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
                      {ProductCategories.filter(cat => cat.isActive).map((cat) => (
                        <SelectGroup key={cat.id}>
                          <SelectLabel className="font-bold text-primary">{cat.name}</SelectLabel>
                          {Products.filter(p => p.categoryId === cat.id && p.isAvailable).map((p) => (
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
                      {Products.filter(p => p.isAvailable).slice(0, 6).map((p) => {
                        const cat = ProductCategories.find(c => c.id === p.categoryId);
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
            <Button type="submit">Créer la commande</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;