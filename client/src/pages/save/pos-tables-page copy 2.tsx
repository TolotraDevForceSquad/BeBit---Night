import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Order, InsertOrder, OrderItem, InsertOrderItem, PosTable, Product, ProductCategory } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Minus, Plus, Trash2, Eye } from 'lucide-react';

// Extend InsertOrderItem and InsertOrder to include notes
interface ExtendedInsertOrderItem extends InsertOrderItem {
  notes?: string;
}

interface ExtendedInsertOrder extends InsertOrder {
  notes?: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: ()
  editingOrder?: Order | null;
  tables: PosTable[];
  products: Product[];
  categories: ProductCategory[];
  defaultTableId?: number | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, editingOrder, tables, products, categories, defaultTableId }) => {
  const [orderData, setOrderData] = useState<Partial<ExtendedInsertOrder>>(editingOrder || { status: 'pending', total: 0, tableId: defaultTableId });
  const [orderItems, setOrderItems] = useState<ExtendedInsertOrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [itemNotes, setItemNotes] = useState<string>('');

  useEffect(() => {
    if (editingOrder) {
      setOrderData({
        tableId: editingOrder.tableId,
        customerName: editingOrder.customerName,
        status: editingOrder.status,
        total: editingOrder.total,
        paymentMethod: editingOrder.paymentMethod,
        priority: editingOrder.priority,
        estimatedCompletionTime: editingOrder.estimatedCompletionTime,
        notes: (editingOrder as any).notes, // Handle notes if present in DB
      });
      api.getOrderItemsByOrderId(editingOrder.id).then(items => {
        setOrderItems(items.map(item => ({ ...item, notes: (item as any).notes || '' })));
      }).catch(console.error);
    } else {
      setOrderData({ status: 'pending', total: 0, tableId: defaultTableId });
      setOrderItems([]);
    }
  }, [editingOrder, defaultTableId]);

  const handleAddItem = () => {
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem: ExtendedInsertOrderItem = {
      productId: selectedProductId,
      quantity,
      price: product.price,
      subtotal: product.price * quantity,
      status: 'pending',
      category: categories.find(c => c.id === product.categoryId)?.name,
      notes: itemNotes,
    };
    setOrderItems([...orderItems, newItem]);
    setOrderData({
      ...orderData,
      total: (orderData.total || 0) + newItem.subtotal,
    });
    setSelectedProductId(null);
    setQuantity(1);
    setItemNotes('');
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    const item = orderItems[index];
    setOrderItems(orderItems.filter((_, i) => i !== index));
    setOrderData({
      ...orderData,
      total: (orderData.total || 0) - (item.subtotal || 0),
    });
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const newItems = [...orderItems];
    const item = newItems[index];
    const newQuantity = Math.max(1, (item.quantity || 1) + delta);
    item.quantity = newQuantity;
    item.subtotal = (item.price || 0) * newQuantity;
    setOrderItems(newItems);
    setOrderData({
      ...orderData,
      total: newItems.reduce((sum, item) => sum + (item.subtotal || 0), 0),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(orderData as ExtendedInsertOrder, orderItems);
      onClose();
    } catch (err) {
      setError('Failed to save order');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] overflow-y-auto pt-10">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {editingOrder ? 'Edit Order' : 'New Order'}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? 'Edit an existing order.' : 'Create a new order for a table or takeaway.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4 mx-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0">
            {/* Summary Column */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Summary</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {orderItems.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex items-start justify-between pb-4 border-b">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{product?.name || 'Unknown'}</h4>
                            <span className="text-sm">{item.subtotal} Ar</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="ml-3 text-xs text-muted-foreground">{item.price} Ar/unit</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-auto"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                          {item.notes && <p className="text-xs text-muted-foreground mt-1">Note: {item.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{orderData.total || 0} Ar</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{orderData.total || 0} Ar</span>
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">Table</Label>
                  <Select
                    value={orderData.tableId?.toString() || 'takeaway'}
                    onValueChange={(value) =>
                      setOrderData({ ...orderData, tableId: value === 'takeaway' ? undefined : Number(value) })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="takeaway">Takeaway</SelectItem>
                      {tables.map(table => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerName" className="text-right">Customer</Label>
                  <Input
                    id="customerName"
                    placeholder="Customer name (optional)"
                    value={orderData.customerName || ''}
                    onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={orderData.status || 'pending'}
                    onValueChange={(value) => setOrderData({ ...orderData, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    className="col-span-3"
                    placeholder="General notes (optional)"
                    value={orderData.notes || ''}
                    onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Add Items Column */}
            <div className="lg:w-1/3">
              <h3 className="text-sm font-medium mb-4">Add Items</h3>
              <Tabs defaultValue="products">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="products">All Products</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <Select
                    value={selectedProductId?.toString() || ''}
                    onValueChange={(value) => setSelectedProductId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.price} Ar)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* CR : Correction de l'affichage des contrôles de quantité */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center">
                      <Button
                        type='button'
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-12 text-center mx-2"
                        min={1}
                      />
                      <Button
                        type='button'
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Notes"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Button type='button' className="w-full mt-2" onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" /> Add to Order
                  </Button>
                </TabsContent>

                <TabsContent value="popular">
                  <ScrollArea className="h-[210px]">
                    <div className="grid grid-cols-2 gap-3">
                      {products
                        .filter(p => p.isAvailable)
                        .slice(0, 6)
                        .map(product => (
                          <Card
                            key={product.id}
                            className="cursor-pointer hover:bg-accent/40 transition-colors"
                            onClick={() => setSelectedProductId(product.id)}
                          >
                            <CardHeader className="p-3 pb-0">
                              <div className="text-sm font-medium truncate">{product.name}</div>
                            </CardHeader>
                            <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                              {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                            </CardContent>
                            <CardFooter className="pt-0 p-3 justify-between">
                              <Badge variant="outline">{product.price} Ar</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProductId(product.id);
                                  handleAddItem();
                                }}
                              >
                                <Plus className="h-3 w-3" />
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

          <DialogFooter className="sticky bottom-0 bg-background border-t p-4 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const POSTablesPage: React.FC = () => {
  // State management
  const [tables, setTables] = useState<PosTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      // Fetch tables
      const tablesResponse = await api.getAllPosTables();
      setTables(tablesResponse);

      // Fetch products
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse);

      // Fetch categories
      const categoriesResponse = await api.getAllProductCategories();
      setCategories(categoriesResponse);

      // Fetch all orders
      const allOrders = await api.getAllOrders();
      setOrders(allOrders);

      // Fetch all order items
      const allOrderItems = await Promise.all(
        allOrders.map(async (order) => {
          try {
            const items = await api.getOrderItemsByOrderId(order.id);
            return items;
          } catch (error) {
            console.error(`Error fetching items for order ${order.id}:`, error);
            return [];
          }
        })
      );
      setOrderItems(allOrderItems.flat());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle save order
  const handleSaveOrder = async (orderData: ExtendedInsertOrder, items: ExtendedInsertOrderItem[]) => {
    try {
      let order: Order;
      if (editingOrder) {
        order = await api.updateOrder(editingOrder.id, orderData);
        // Delete existing order items
        const existingItems = orderItems.filter(oi => oi.orderId === editingOrder.id);
        for (const item of existingItems) {
          await api.deleteOrderItem(item.id);
        }
      } else {
        order = await api.createOrder(orderData);
      }

      // Create new order items
      const createdItems = await Promise.all(
        items.map(item => api.createOrderItem({ ...item, orderId: order.id }))
      );

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: number) => {
    try {
      await api.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setOrderItems(prev => prev.filter(oi => oi.orderId !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">POS Tables Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tables List */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map(table => {
                const tableOrders = orders.filter(o => o.tableId === table.id);
                return (
                  <TableRow key={table.id}>
                    <TableCell>{table.name}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={table.status === 'occupied' ? 'destructive' : 'default'}>
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => {
                          if (value === 'view') return;
                          const selectedOrder = orders.find(o => o.id === Number(value));
                          if (selectedOrder) {
                            setEditingOrder(selectedOrder);
                            setIsOrderModalOpen(true);
                            setSelectedTableId(table.id);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={`${tableOrders.length} order(s)`} />
                        </SelectTrigger>
                        <SelectContent>
                          {tableOrders.length === 0 ? (
                            <SelectItem value="none" disabled>No orders</SelectItem>
                          ) : (
                            <>
                              <SelectItem value="view" disabled>Select an order:</SelectItem>
                              {tableOrders.map(order => (
                                <SelectItem key={order.id} value={order.id.toString()}>
                                  Order #{order.id} ({order.status})
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setEditingOrder(null);
                          setSelectedTableId(table.id);
                          setIsOrderModalOpen(true);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        New Order
                      </Button>
                      {tableOrders.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingOrder(tableOrders[0]);
                            setSelectedTableId(table.id);
                            setIsOrderModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">All Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => {
                    const items = orderItems.filter(oi => oi.orderId === order.id);
                    return (
                      <React.Fragment key={order.id}>
                        <TableRow>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{tables.find(t => t.id === order.tableId)?.name || 'Takeaway'}</TableCell>
                          <TableCell>{order.customerName || 'N/A'}</TableCell>
                          <TableCell>{items.length}</TableCell>
                          <TableCell>{order.total} Ar</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === 'completed'
                                  ? 'default'
                                  : order.status === 'cancelled'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setEditingOrder(order);
                                setSelectedTableId(order.tableId || null);
                                setIsOrderModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View/Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                        {items.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="p-0">
                              <div className="pl-8 pr-4 py-2 bg-muted/50">
                                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Price</TableHead>
                                      <TableHead>Subtotal</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Notes</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {items.map(item => {
                                      const product = products.find(p => p.id === item.productId);
                                      return (
                                        <TableRow key={item.id}>
                                          <TableCell>{product?.name || 'Unknown'}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>{item.price} Ar</TableCell>
                                          <TableCell>{item.subtotal} Ar</TableCell>
                                          <TableCell>
                                            <Badge variant={
                                              item.status === 'completed' 
                                                ? 'default' 
                                                : item.status === 'cancelled' 
                                                ? 'destructive' 
                                                : 'outline'
                                            }>
                                              {item.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{(item as any).notes || 'N/A'}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setEditingOrder(null);
          setSelectedTableId(null);
        }}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        tables={tables}
        products={products}
        categories={categories}
        defaultTableId={selectedTableId}
      />
    </div>
  );
};

export default POSTablesPage;