import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
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

        <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0">
          {/* Colonne Résumé */}
          <div className="lg:w-1/3">
            <h3 className="text-sm font-medium mb-4">Résumé</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">Produit Exemple</h4>
                      <span className="text-sm">25.00 Ar</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        type="button"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">2</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        type="button"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="ml-3 text-xs text-muted-foreground">
                        12.50 Ar/unité
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto"
                        type="button"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Note: Sans oignons</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>25.00 Ar</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>25.00 Ar</span>
              </div>
            </div>
          </div>

          {/* Colonne Informations */}
          <div className="lg:w-1/3">
            <h3 className="text-sm font-medium mb-4">Informations</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table" className="text-right">Table</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="takeaway">À emporter</SelectItem>
                    <SelectItem value="1">Table 1 (#1)</SelectItem>
                    <SelectItem value="2">Table 2 (#2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">Client</Label>
                <Input
                  id="customerName"
                  placeholder="Nom du client (optionnel)"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  className="col-span-3"
                  placeholder="Notes générales (optionnel)"
                />
              </div>
            </div>
          </div>

          {/* Colonne Ajout d'articles */}
          <div className="lg:w-1/3">
            <h3 className="text-sm font-medium mb-4">Ajouter des articles</h3>
            <Tabs defaultValue="products">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="products" type="button">Tous les produits</TabsTrigger>
                <TabsTrigger value="popular" type="button">Populaires</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Pizza Margherita (12.50 Ar)</SelectItem>
                    <SelectItem value="2">Pasta Carbonara (15.00 Ar)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-4 mt-4">
                  <div className="w-1/3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      type="button"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">2</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      type="button"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Notes"
                    className="w-2/3"
                  />
                </div>
                <Button className="w-full mt-2" type="button">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter à la commande
                </Button>
              </TabsContent>

              <TabsContent value="popular">
                <ScrollArea className="h-[210px]">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="cursor-pointer hover:bg-accent/40 transition-colors">
                      <CardHeader className="p-3 pb-0">
                        <div className="text-sm font-medium truncate">Pizza Margherita</div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                        Pizzas
                      </CardContent>
                      <CardFooter className="pt-0 p-3 justify-between">
                        <Badge variant="outline">12.50 Ar</Badge>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            type="button"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/40 transition-colors">
                      <CardHeader className="p-3 pb-0">
                        <div className="text-sm font-medium truncate">Pasta Carbonara</div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                        Pâtes
                      </CardContent>
                      <CardFooter className="pt-0 p-3 justify-between">
                        <Badge variant="outline">15.00 Ar</Badge>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            type="button"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-background border-t p-4 mt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button">Créer la commande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;