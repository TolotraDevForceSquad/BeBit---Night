// OrderModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, Search, Tag, Coffee, Users, Utensils, DollarSign, Percent, User, FileText, ChevronsLeftRight, AlertCircle, X } from "lucide-react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [isTakeaway, setIsTakeaway] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);

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
      const tableIdStr = editingOrder.tableId?.toString() || 'takeaway';
      setSelectedTable(tableIdStr);
      setIsTakeaway(tableIdStr === 'takeaway');
      setCustomerName(editingOrder.customerName || '');
      setGeneralNotes('');

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
      const initTable = initialTableId ? initialTableId.toString() : 'takeaway';
      setSelectedTable(initTable);
      setIsTakeaway(initTable === 'takeaway');
      setCustomerName('');
      setDiscount(0);
      setTax(0);
      setGeneralNotes('');
    }
    setShowAddPanel(false);
  }, [editingOrder, orderItems, initialTableId, products]);

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

  const filteredProducts = products.filter(p =>
    p.isAvailable &&
    (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      categories.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(productSearch.toLowerCase()))
  );

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
    if (delta > 0) {
      setSuccessMessage(`+1 ${products.find(p => p.id === productId)?.name ?? 'Produit'}`);
      setTimeout(() => setSuccessMessage(null), 1500);
    }
  };

  const handleNotesChange = (productId: number, newNotes: string) => {
    const current = cart[productId] ?? { quantity: 0, notes: '' };
    setCart({ ...cart, [productId]: { ...current, notes: newNotes } });
  };

  const handleAddFromCard = (productId: number) => {
    handleQuantityChange(productId, 1);
  };

  const removeItem = (productId: number) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
  };

  const clearCart = () => {
    setCart({});
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
      notes: generalNotes || null,
    };

    if (editingOrder) {
      orderData.paymentMethod = editingOrder.paymentMethod;
      orderData.priority = editingOrder.priority;
      orderData.estimatedCompletionTime = editingOrder.estimatedCompletionTime;
    }

    const items: InsertOrderItem[] = cartEntries.map(entry => ({
      orderId: editingOrder?.id || 0,
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

  const getProductIcon = (categoryId?: number) => {
    if (categoryId === 1) return <Coffee className="h-8 w-8 text-gray-400" />;
    if (categoryId === 2) return <Utensils className="h-8 w-8 text-gray-400" />;
    return <Tag className="h-8 w-8 text-gray-400" />;
  };

  const getTableStatusBadge = (tableIdStr: string) => {
    if (tableIdStr === 'takeaway') return <Badge variant="secondary">À emporter</Badge>;
    const tableId = parseInt(tableIdStr);
    if (isNaN(tableId)) return <Badge variant="outline">Invalide</Badge>;
    const table = tables.find(t => t.id === tableId);
    if (!table) return <Badge variant="outline">Inconnue</Badge>;
    const color = table.status === 'available' ? 'bg-green-500' : table.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500';
    return <Badge className={`${color} text-white`}>{table.status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[99vw] max-h-[100vh] w-[99vw] pt-1">
        <form onSubmit={handleSubmit} className="h-full">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 mx-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mb-4 mx-6 bg-green-900/20 border-green-500">
              <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Titre intégré en haut (Header)*/}
          <div className="mt-2 mb-0">
            <div className="pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-pink-500" />
                <div>
                  <h1 className="text-xl font-bold">{editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}</h1>
                  <p className="text-sm text-muted-foreground">{editingOrder ? 'Modifiez la commande existante.' : 'Créez une nouvelle commande pour une table ou à emporter.'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* (Contenu) */}
          <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0 h-full">
            {/* Colonne Résumé - Ajuste la largeur */}
            <div className={`space-y-4 transition-all duration-300 ${showAddPanel ? 'w-full lg:w-1/3 flex-shrink-0' : 'w-full lg:w-1/2 flex-shrink-0'}`}>
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Résumé ({cartEntries.length} articles)
                </h3>
                {!showAddPanel && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 flex items-center gap-2"
                    onClick={() => setShowAddPanel(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter des articles
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[75vh] rounded-md border p-4">
                <div className="space-y-4">
                  {cartEntries.map((entry) => (
                    <Card key={entry.id} className="p-4 relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-75">
                        <Badge variant="secondary" className="bg-green-500 text-white text-xs">{entry.quantity}</Badge>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0">
                          {entry.product?.imageUrl ? (
                            <img src={entry.product.imageUrl} alt={entry.product?.name ?? 'Produit'} className="h-full w-full object-cover rounded-lg shadow-md" />
                          ) : (
                            getProductIcon(entry.product?.categoryId)
                          )}
                          {entry.notes && <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs px-1 rounded-tl">N</div>}
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <h4 className="font-medium text-sm">{entry.product?.name ?? 'Produit inconnu'}</h4>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">{entry.price ?? entry.product?.price ?? 0} Ar</Badge>
                            <Badge variant="secondary" className="text-xs bg-gray-700">x{entry.quantity}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" className="h-8 w-8 border-gray-400 hover:border-red-400 hover:bg-transparent" onClick={() => handleQuantityChange(entry.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-bold min-w-8 text-center">{entry.quantity}</span>
                            <Button type="button" variant="outline" size="sm" className="h-8 w-8 border-gray-400 hover:border-green-400 hover:bg-transparent" onClick={() => handleQuantityChange(entry.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 absolute top-2 left-2" onClick={() => removeItem(entry.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Note pour article */}
                      <div className="mt-3">
                        <label className="text-xs font-medium mb-1 block">Notes pour cet article</label>
                        <Textarea
                          className="w-full text-xs h-16 resize-none"
                          placeholder="Notes pour cet article"
                          value={entry.notes}
                          onChange={(e) => handleNotesChange(entry.id, e.target.value)}
                        />
                      </div>
                      <div className="mt-3 text-right">
                        <Badge variant="default" className="bg-pink-500 text-white text-sm font-bold">
                          {entry.quantity * (entry.price ?? entry.product?.price ?? 0)} Ar
                        </Badge>
                      </div>
                    </Card>
                  ))}
                  {cartEntries.length === 0 && <p className="text-center text-muted-foreground py-8">Panier vide – Ajoutez des produits !</p>}

                  {/* Totaux intégrés dans le scroll */}
                  <div className="mt-6 space-y-3 p-4 bg-gradient-to-r from-muted to-muted/50 rounded-xl border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> Sous-total:</span>
                      <span className="font-semibold">{subTotal} Ar</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-sm text-red-400">
                        <span>Remise:</span>
                        <span>-{discount} Ar</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex items-center justify-between text-sm text-green-400">
                        <span>Taxe:</span>
                        <span>+{tax} Ar</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Total:</span>
                      <span className="text-pink-400">{total} Ar</span>
                    </div>
                  </div>

                  {/* Bouton Vider le panier intégré dans le scroll */}
                  {cartEntries.length > 0 && (
                    <div className="pt-4 border-t border-muted/50">
                      <Button type="button" variant="destructive" className="w-full font-medium" onClick={clearCart} size="sm">
                        <Trash2 className="h-4 w-4 mr-2" /> Vider le panier
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Colonne Informations - Cachée quand showAddPanel est true */}
            {!showAddPanel && (
              <div className="space-y-4 w-full lg:w-1/2 flex-shrink-0">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">📋 Informations</h3>
                <ScrollArea className="h-[65vh] rounded-md border p-4">
                  <div className="space-y-4">
                    {/* Switch rapide */}
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Type de service</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={tables.length === 0 && !isTakeaway}
                          onClick={() => {
                            if (isTakeaway) {
                              if (tables.length > 0) {
                                setIsTakeaway(false);
                                setSelectedTable(tables[0].id.toString());
                              } else {
                                setErrorMessage('Aucune table disponible – Créez-en une d\'abord !');
                                setTimeout(() => setErrorMessage(null), 3000);
                              }
                            } else {
                              setIsTakeaway(true);
                              setSelectedTable('takeaway');
                            }
                          }}
                          className={`flex items-center gap-2 ${isTakeaway ? 'bg-green-500 text-white' : 'text-muted-foreground'}`}
                        >
                          <ChevronsLeftRight className="h-3 w-3" />
                          {isTakeaway ? 'À emporter' : 'Sur place'}
                        </Button>
                      </div>
                      {tables.length === 0 && !isTakeaway && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
                          <AlertCircle className="h-3 w-3" /> Aucune table configurée
                        </div>
                      )}
                    </Card>

                    {!isTakeaway && (
                      <Card className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Table</Label>
                        </div>
                        <Select onValueChange={setSelectedTable} value={selectedTable}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choisir une table" />
                          </SelectTrigger>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.id} value={table.id.toString()}>
                                {table.name ?? 'Table'} ({table.area ?? 'Zone'}) - {table.capacity ?? 0} places
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="mt-2">{getTableStatusBadge(selectedTable)}</div>
                      </Card>
                    )}

                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">Client (optionnel)</Label>
                      </div>
                      <Input
                        placeholder="Nom du client"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full"
                        title="Ajoutez le nom pour une commande personnalisée"
                      />
                    </Card>

                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="h-4 w-4 text-red-500" />
                        <Label className="text-sm font-medium">Remise (Ar)</Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-full"
                        title="Appliquez une réduction fixe"
                      />
                      {discount > 0 && <Badge variant="destructive" className="mt-1">-{discount} Ar appliquée</Badge>}
                    </Card>

                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <Label className="text-sm font-medium">Taxe (Ar)</Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                        className="w-full"
                        title="Ajoutez une taxe supplémentaire"
                      />
                      {tax > 0 && <Badge variant="default" className="mt-1 bg-green-500">+{tax} Ar appliquée</Badge>}
                    </Card>

                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">Notes générales</Label>
                      </div>
                      <Textarea
                        rows={4}
                        placeholder="Instructions spéciales pour la cuisine..."
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        className="w-full"
                        title="Notes visibles pour toute l'équipe"
                      />
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Panneau Ajout d'articles - Affiché quand showAddPanel est true, prend plus d'espace */}
            {showAddPanel && (
              <div className="space-y-4 transition-all duration-300 w-full lg:w-2/3 flex-shrink-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Ajouter des articles</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddPanel(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Tabs defaultValue="search">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="search">Recherche</TabsTrigger>
                    <TabsTrigger value="categories">Catégories</TabsTrigger>
                    <TabsTrigger value="popular">Populaires</TabsTrigger>
                  </TabsList>

                  <TabsContent value="search" className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un produit ou catégorie..."
                        className="pl-10"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[60vh]">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {filteredProducts.map((p) => {
                          const currentQuantity = cart[p.id]?.quantity || 0;
                          return (
                            <Card key={p.id} className={`cursor-pointer hover:bg-accent p-3 text-center relative border-2 ${currentQuantity > 0 ? 'border-green-400' : 'border-transparent'}`} onClick={() => handleAddFromCard(p.id)}>
                              <div className="relative h-20 w-full mb-2 overflow-hidden rounded-lg">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                  getProductIcon(p.categoryId)
                                )}
                              </div>
                              <h5 className="font-medium text-xs truncate mb-1">{p.name}</h5>
                              <p className="text-xs text-muted-foreground mb-2">{categories.find(c => c.id === p.categoryId)?.name ?? 'Sans cat.'}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">{p.price} Ar</Badge>
                                <div className="flex items-center gap-2">
                                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, -1); }} disabled={currentQuantity === 0}>
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-bold min-w-6 text-center">{currentQuantity}</span>
                                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, 1); }}>
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                        {filteredProducts.length === 0 && (
                          <p className="col-span-full text-center text-muted-foreground py-8">Aucun produit trouvé...</p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="categories">
                    <ScrollArea className="h-[55vh]">
                      {categories.filter(cat => cat.isActive).map((cat) => (
                        <div key={cat.id} className="mb-6">
                          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                            {getProductIcon(cat.id)}
                            {cat.name}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {products.filter(p => p.categoryId === cat.id && p.isAvailable).map((p) => {
                              const currentQuantity = cart[p.id]?.quantity || 0;
                              return (
                                <Card key={p.id} className={`cursor-pointer hover:bg-accent p-3 text-center relative border-2 ${currentQuantity > 0 ? 'border-green-400' : 'border-transparent'}`} onClick={() => handleAddFromCard(p.id)}>
                                  <div className="relative h-20 w-full mb-2 overflow-hidden rounded-lg">
                                    {p.imageUrl ? (
                                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                      getProductIcon(p.categoryId)
                                    )}
                                  </div>
                                  <h5 className="text-xs truncate mb-1">{p.name}</h5>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs">{p.price} Ar</Badge>
                                    <div className="flex items-center gap-2">
                                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, -1); }} disabled={currentQuantity === 0}>
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="text-sm font-bold min-w-6 text-center">{currentQuantity}</span>
                                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, 1); }}>
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {categories.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune catégorie...</p>}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="popular">
                    <ScrollArea className="h-[70vh]">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {products.filter(p => p.isAvailable).map((p) => {
                          const currentQuantity = cart[p.id]?.quantity || 0;
                          return (
                            <Card key={p.id} className={`cursor-pointer hover:bg-accent relative overflow-hidden border-2 ${currentQuantity > 0 ? 'border-green-400' : 'border-transparent'}`} onClick={() => handleAddFromCard(p.id)}>
                              <div className="relative h-20 w-full mb-2 overflow-hidden rounded-lg">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                  getProductIcon(p.categoryId)
                                )}
                              </div>
                              <CardContent className="p-3 text-xs">
                                <h5 className="font-medium truncate mb-1">{p.name}</h5>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline">{p.price} Ar</Badge>
                                  <div className="flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, -1); }} disabled={currentQuantity === 0}>
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm font-bold min-w-6 text-center">{currentQuantity}</span>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-500" onClick={(e) => { e.stopPropagation(); handleQuantityChange(p.id, 1); }}>
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        {products.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">Aucun produit disponible</p>}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* (Footer) */}
          {/* Boutons intégrés en bas - Version fixée pour debug */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-6 z-50 flex justify-end gap-4 shadow-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-3"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={cartEntries.length === 0}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 font-semibold shadow-lg disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4 mr-2 inline" />
              {editingOrder ? 'Mettre à jour' : 'Créer'} la commande ({total} Ar)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;