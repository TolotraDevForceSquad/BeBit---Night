import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PosTable, Order, OrderItem, Product, ProductCategory } from '@shared/schema';
import OrderModal from '@/components/OrderModal';
import { Button } from '@/components/ui/button';

interface TableWithOrders extends PosTable {
  orders: (Order & {
    items: (OrderItem & {
      product?: Product & {
        category?: ProductCategory;
      };
    })[];
  })[];
}

const POSTablesPage: React.FC = () => {
  const [tables, setTables] = useState<TableWithOrders[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all tables, products, and categories
        const [posTables, allProducts, allCategories] = await Promise.all([
          api.getAllPosTables(),
          api.getAllProducts(),
          api.getAllProductCategories(),
        ]);

        // Log des produits et catégories pour débogage
        console.log('Fetched products:', allProducts);
        console.log('Product IDs available:', allProducts.map(p => p.id)); // Vérifier les IDs disponibles
        console.log('Fetched categories:', allCategories);

        // Fetch related data for each table
        const tablesWithOrders = await Promise.all(
          posTables.map(async (table) => {
            const orders = await api.getOrdersByTableId(table.id);
            console.log(`Table ${table.id} orders:`, orders);
            const ordersWithItems = await Promise.all(
              orders.map(async (order) => {
                const orderItems = await api.getOrderItemsByOrderId(order.id);
                console.log(`Order ${order.id} items:`, orderItems);
                const itemsWithProducts = orderItems.map((item) => {
                  if (!item.productId) {
                    console.warn(`Order item ${item.id} has no productId`);
                    return { ...item, product: undefined };
                  }
                  // Normaliser les IDs pour éviter les problèmes de type (chaîne vs nombre)
                  console.log(' Looking for product : ', item.productId, ' among : ', allProducts.map(p => p.id));
                  const product = allProducts.find((p) => Number(p.id) === Number(item.productId));
                  // const product = allProducts.find((p) => String(p.id) === String(item.productId));
                  if (!product) {
                    console.warn(`Product not found for ID ${item.productId} in order item ${item.id}`);
                    console.log('Available product IDs:', allProducts.map(p => p.id)); // Log pour déboguer
                    return { ...item, product: undefined };
                  }
                  // Recherche de la catégorie associée
                  const category = product.categoryId
                    ? allCategories.find((c) => String(c.id) === String(product.categoryId))
                    : undefined;
                  if (!category && product.categoryId) {
                    console.warn(`Category not found for ID ${product.categoryId} in product ${product.id}`);
                  }
                  // Log détaillé du produit trouvé
                  console.log(`Matched product for item ${item.id}:`, {
                    productId: item.productId,
                    productName: product.name,
                    productPrice: product.price,
                    category: category ? category.name : 'No category',
                  });
                  return {
                    ...item,
                    product: { ...product, category }, // Assigner l'objet produit avec sa catégorie
                  };
                });
                return { ...order, items: itemsWithProducts };
              })
            );
            return { ...table, orders: ordersWithItems };
          })
        );

        console.log('Tables with orders:', tablesWithOrders);
        setTables(tablesWithOrders);
        setProducts(allProducts);
        setCategories(allCategories);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const handleSaveOrder = async (newOrder: Order) => {
    try {
      // Fetch order items for the new order
      const orderItems = await api.getOrderItemsByOrderId(newOrder.id);
      console.log(`New order ${newOrder.id} items:`, orderItems);
      const itemsWithProducts = orderItems.map((item) => {
        if (!item.productId) {
          console.warn(`Order item ${item.id} has no productId`);
          return { ...item, product: undefined };
        }
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          console.warn(`Product not found for ID ${item.productId}`);
          return { ...item, product: undefined };
        }
        const category = product.categoryId
          ? categories.find((c) => c.id === product.categoryId)
          : undefined;
        console.log(`Matched product for new order item ${item.id}:`, product);
        return {
          ...item,
          product: { ...product, category },
        };
      });

      // Create the complete order with items
      const completeOrder: Order & { items: (OrderItem & { product?: Product & { category?: ProductCategory } })[] } = {
        ...newOrder,
        items: itemsWithProducts,
      };

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === newOrder.tableId
            ? { ...table, orders: [...table.orders, completeOrder] }
            : table
        )
      );

      // Update table status to 'occupied' if an order is added
      if (newOrder.tableId) {
        await api.updatePosTable(newOrder.tableId, { status: 'occupied' });
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === newOrder.tableId ? { ...table, status: 'occupied' } : table
          )
        );
      }
    } catch (err) {
      console.error('Save order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">POS Tables Management</h1>
        <Button onClick={() => setIsOrderModalOpen(true)}>New Order</Button>
      </div>

      <div className="grid gap-6">
        {tables.map((table) => (
          <div key={table.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Table: {table.name} (#{table.number})
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${table.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}
              >
                {table.status}
              </span>
            </h2>

            {table.orders.length === 0 ? (
              <p className="text-gray-500">No orders for this table</p>
            ) : (
              <div className="space-y-4">
                {table.orders.map((order) => (
                  <div key={order.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium">
                      Order #{order.id} - {order.customerName || 'No customer name'}
                      <span
                        className={`ml-2 px-2 py-1 rounded text-sm ${order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {order.status}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      Total: {(order.total / 100).toFixed(2)} Ar
                      {order.paymentMethod && ` | Payment: ${order.paymentMethod}`}
                      {order.estimatedCompletionTime &&
                        ` | ETA: ${new Date(order.estimatedCompletionTime).toLocaleTimeString()}`}
                    </p>

                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Order Items:</h4>
                      {order.items.length === 0 ? (
                        <p className="text-gray-500 text-sm">No items in this order</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-sm">
                              {item.product ? (
                                <>
                                  <span className="font-medium">{item.product.name}</span>
                                  <span className="text-gray-600">
                                    {' '}x{item.quantity} ({(item.subtotal / 100).toFixed(2)} Ar)
                                  </span>
                                  <span className="text-gray-500">
                                    {' '}| Category: {item.product.category?.name || 'No category'}
                                  </span>
                                </>
                              ) : (
                                <span className="text-red-500">
                                  Product not found (ID: {item.productId || 'undefined'})
                                </span>
                              )}
                              {item.status && (
                                <span
                                  className={`ml-2 px-2 py-1 rounded text-xs ${item.status === 'ready'
                                      ? 'bg-green-100 text-green-800'
                                      : item.status === 'preparing'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                  {item.status}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        editingOrder={null}
        tables={tables}
        products={products}
        categories={categories}
      />
    </div>
  );
};

export default POSTablesPage;