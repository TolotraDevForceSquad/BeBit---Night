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
import { Loader2, AlertCircle, Plus, Minus, Trash2, User, CreditCard, FileText, ShoppingCart, ArrowRight, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Product, ProductCategory, PosTable, Order, OrderItem } from '@shared/schema';

interface OrderItemWithProduct extends OrderItem {
  product: Product | null;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: {
    tableId: number | null;
    customerName: string | null;
    items: { productId: number; quantity: number; notes?: string }[];
  }) => void;
  editingOrder: (Order & { items: OrderItem[] }) | null;
  tables: PosTable[];
  products: Product[];
  categories: ProductCategory[];
}

interface CartItem {
  productId: number;
  quantity: number;
  notes?: string;
  product: Product | null;
}

const OrderModal = ({ isOpen, onClose, onSave, editingOrder, tables, products, categories }: OrderModalProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState("");
  const [tableId, setTableId] = useState<string>(editingOrder?.tableId?.toString() || "takeaway");
  const [customerName, setCustomerName] = useState(editingOrder?.customerName || "");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingOrder) {
      // Pré-remplir les données de la commande en cours d'édition
      setTableId(editingOrder.tableId?.toString() || "takeaway");
      setCustomerName(editingOrder.customerName || "");
      
      // Convertir les OrderItem en CartItem
      const items: CartItem[] = editingOrder.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes || "",
        product: products.find(p => p.id === item.productId) || null
      }));
      setCartItems(items);
    } else {
      // Réinitialiser le formulaire pour une nouvelle commande
      setCartItems([]);
      setSelectedProductId("");
      setQuantity(1);
      setItemNotes("");
      setTableId("takeaway");
      setCustomerName("");
      setDiscount(0);
      setTax(0);
      setOrderNotes("");
    }
  }, [editingOrder, products]);

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    
    const productId = parseInt(selectedProductId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId && item.notes === itemNotes);
    
    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité si le produit existe déjà
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Ajouter un nouvel élément au panier
      setCartItems([...cartItems, {
        productId,
        quantity,
        notes: itemNotes,
        product
      }]);
    }
    
    // Réinitialiser les champs d'ajout
    setSelectedProductId("");
    setQuantity(1);
    setItemNotes("");
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave({
        tableId: tableId === "takeaway" ? null : parseInt(tableId),
        customerName: customerName || null,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes
        }))
      });
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la commande:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedProducts = categories.map(category => ({
    ...category,
    products: products.filter(product => product.categoryId === category.id)
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] overflow-y-auto pt-10">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {editingOrder ? `Modifier la commande #${editingOrder.id}` : 'Nouvelle commande'}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? 'Modifiez la commande existante.' : 'Créez une nouvelle commande pour une table ou à emporter.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0">
            {/* Colonne Résumé */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Résumé</h3>

              {cartItems.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Aucun article ajouté</p>
                </div>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{item.product?.name || 'Produit inconnu'}</h4>
                            <span className="text-sm">{(item.product?.price || 0) * item.quantity} Ar</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 text-sm">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="ml-3 text-xs text-muted-foreground">
                              {item.product?.price || 0} Ar/unité
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-auto"
                              onClick={() => handleRemoveFromCart(index)}
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
                </ScrollArea>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>{calculateSubtotal().toLocaleString()} Ar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remise:</span>
                  <span>-{discount.toLocaleString()} Ar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxe:</span>
                  <span>{tax.toLocaleString()} Ar</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{calculateTotal().toLocaleString()} Ar</span>
                </div>
              </div>
            </div>

            {/* Colonne Informations */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Informations</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table
                  </Label>
                  <Select
                    value={tableId}
                    onValueChange={setTableId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez une table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="takeaway">À emporter</SelectItem>
                      {tables.map(table => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {table.name} #{table.number} ({table.area || 'Non spécifié'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerName" className="text-right">
                    Client
                  </Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nom du client (optionnel)"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Remise (Ar)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    inputMode="numeric"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    className="col-span-3"
                    placeholder="0"
                    min="0"
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
                    inputMode="numeric"
                    value={tax}
                    onChange={(e) => setTax(parseInt(e.target.value) || 0)}
                    className="col-span-3"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Notes générales (optionnel)"
                    rows={3}
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>

            {/* Colonne Ajout d'articles */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Ajouter des articles</h3>

              <Tabs defaultValue="products">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="products">Tous les produits</TabsTrigger>
                  <TabsTrigger value="popular" className="flex items-center gap-1">
                    Populaires
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <Select
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un produit" />
                      </SelectTrigger>
                      <SelectContent className="max-h-52 overflow-y-auto">
                        {groupedProducts.map(category => (
                          <React.Fragment key={category.id}>
                            <SelectItem value={`category_${category.id}`} disabled>
                              {category.name}
                            </SelectItem>
                            {category.products.map(product => (
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
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
                        <Label htmlFor="itemNotes" className="text-sm">
                          Notes (optionnel)
                        </Label>
                        <Input
                          id="itemNotes"
                          value={itemNotes}
                          onChange={(e) => setItemNotes(e.target.value)}
                          className="mt-2"
                          placeholder="Ex: Sans glace, bien cuit, etc."
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full mt-2"
                      disabled={!selectedProductId}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter à la commande
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="popular">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Produits populaires</h3>
                  </div>

                  <ScrollArea className="h-[210px]">
                    <div className="grid grid-cols-2 gap-3">
                      {products.slice(0, 4).map(product => (
                        <Card 
                          key={product.id} 
                          className="cursor-pointer hover:bg-accent/40 transition-colors"
                          onClick={() => {
                            setSelectedProductId(product.id.toString());
                            setQuantity(1);
                            setItemNotes("");
                          }}
                        >
                          <CardHeader className="p-3 pb-0">
                            <div className="text-sm font-medium truncate">{product.name}</div>
                          </CardHeader>
                          <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                            {categories.find(c => c.id === product.categoryId)?.name || 'Non catégorisé'}
                          </CardContent>
                          <CardFooter className="pt-0 p-3 justify-between">
                            <Badge variant="secondary">{product.price.toLocaleString()} Ar</Badge>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductId(product.id.toString());
                                setQuantity(1);
                                setItemNotes("");
                                handleAddToCart();
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={cartItems.length === 0 || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingOrder ? 'Mettre à jour' : 'Créer la commande'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;