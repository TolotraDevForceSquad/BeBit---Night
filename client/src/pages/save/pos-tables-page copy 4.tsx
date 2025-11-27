import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PosTable, Order, OrderItem, Product } from '@shared/schema';

interface TableWithOrders extends PosTable {
  orders: (Order & { items: (OrderItem & { product: Product | null })[] })[];
}

const POSPagesTable: React.FC = () => {
  const [tables, setTables] = useState<TableWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTablesAndOrders = async () => {
      try {
        setLoading(true);
        // Fetch all POS tables
        const posTables = await api.getAllPosTables();

        // For each table, fetch its orders and order items
        const tablesWithOrders = await Promise.all(
          posTables.map(async (table) => {
            const orders = await api.getOrdersByTableId(table.id);
            const ordersWithItems = await Promise.all(
              orders.map(async (order) => {
                const rawItems = await api.getOrderItemsByOrderId(order.id);
                // Log the raw order items
                console.log(`Order ${order.id} items:`, JSON.stringify(rawItems, null, 2));
                // Map product_id to productId to match OrderItem type
                const items = rawItems.map((item: any) => ({
                  ...item,
                  productId: item.product_id, // Map snake_case to camelCase
                })) as OrderItem[];
                // Fetch product details for each order item
                const itemsWithProducts = await Promise.all(
                  items.map(async (item) => {
                    let product: Product | null = null;
                    try {
                      if (item.productId !== null && item.productId !== undefined) {
                        product = await api.getProduct(item.productId);
                        console.log(`Fetched product for productId ${item.productId}:`, JSON.stringify(product, null, 2));
                      } else {
                        console.warn(`OrderItem ${item.id} has invalid productId: ${item.productId}`);
                      }
                    } catch (err) {
                      console.error(`Failed to fetch product ${item.productId} for OrderItem ${item.id}:`, err);
                    }
                    return { ...item, product };
                  })
                );
                return { ...order, items: itemsWithProducts };
              })
            );
            return { ...table, orders: ordersWithItems };
          })
        );

        setTables(tablesWithOrders);
      } catch (err) {
        setError('Failed to fetch tables, orders, or products');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTablesAndOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center p-4 bg-gray-100 dark:bg-gray-900">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">POS Tables Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-4 rounded-lg shadow-md ${
              table.status === 'occupied'
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : 'bg-green-100 dark:bg-green-900'
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Table {table.name} (#{table.number})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Area: {table.area || 'N/A'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Capacity: {table.capacity}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Status: {table.status}
            </p>
            {table.orders.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">Orders</h3>
                {table.orders.map((order) => (
                  <div
                    key={order.id}
                    className="mt-2 p-2 bg-white dark:bg-gray-800 rounded shadow-sm"
                  >
                    <p className="text-sm text-gray-900 dark:text-white">
                      Order #{order.id} - Total: ${order.total}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Status: {order.status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Customer: {order.customerName || 'N/A'}
                    </p>
                    {order.items.length > 0 ? (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Order Items</h4>
                        <ul className="list-disc pl-5">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-sm text-gray-900 dark:text-gray-300">
                              {item.product?.name || 
                                (item.productId !== null && item.productId !== undefined 
                                  ? `Product ID ${item.productId} (Not Found)` 
                                  : 'No Product ID')}
                              {item.category ? ` (Category: ${item.category})` : ''} - 
                              Quantity: {item.quantity}, Subtotal: ${item.subtotal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No items in this order</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No orders for this table</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default POSPagesTable;