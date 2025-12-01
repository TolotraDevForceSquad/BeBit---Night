// client\src\services\pos-api.ts
import { Employee, InsertEmployee, PosDevice, InsertPosDevice, ProductCategory, InsertProductCategory, Product, InsertProduct, PosTable, InsertPosTable, Order, InsertOrder, OrderItem, InsertOrderItem, PosHistory, InsertPosHistory, PosPaymentMethod, InsertPosPaymentMethod, insertEmployeeSchema, insertPosDeviceSchema, insertProductCategorySchema, insertProductSchema, insertPosTableSchema, insertOrderSchema, insertOrderItemSchema, insertPosHistorySchema, insertPosPaymentMethodSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

export async function getAllEmployees(): Promise<Employee[]> {
  return apiRequest<Employee[]>(`${API_BASE}/employees`, { method: 'GET' });
}

export async function getEmployeeById(id: number): Promise<Employee> {
  if (isNaN(id)) throw new Error('Invalid employee ID');
  return apiRequest<Employee>(`${API_BASE}/employees/${id}`, { method: 'GET' });
}

export async function createEmployee(employeeData: InsertEmployee): Promise<Employee> {
  return apiRequest<Employee>(`${API_BASE}/employees`, {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
}

export async function updateEmployee(id: number, employeeData: Partial<InsertEmployee>): Promise<Employee> {
  if (isNaN(id)) throw new Error('Invalid employee ID');
  return apiRequest<Employee>(`${API_BASE}/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  });
}

export async function deleteEmployee(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid employee ID');
  await apiRequest<null>(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
}

export function useEmployees() {
  return useApiData(() => getAllEmployees(), []);
}

export async function getAllPosDevices(filters?: { isActive?: boolean }): Promise<PosDevice[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
  });
  const url = params ? `${API_BASE}/pos-devices?${params}` : `${API_BASE}/pos-devices`;
  return apiRequest<PosDevice[]>(url, { method: 'GET' });
}

export async function getPosDeviceById(id: number): Promise<PosDevice> {
  if (isNaN(id)) throw new Error('Invalid device ID');
  return apiRequest<PosDevice>(`${API_BASE}/pos-devices/${id}`, { method: 'GET' });
}

export async function createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice> {
  return apiRequest<PosDevice>(`${API_BASE}/pos-devices`, {
    method: 'POST',
    body: JSON.stringify(deviceData),
  });
}

export async function updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice> {
  if (isNaN(id)) throw new Error('Invalid device ID');
  return apiRequest<PosDevice>(`${API_BASE}/pos-devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deviceData),
  });
}

export async function deletePosDevice(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid device ID');
  await apiRequest<null>(`${API_BASE}/pos-devices/${id}`, { method: 'DELETE' });
}

export function usePosDevices(isActive?: boolean) {
  return useApiData(() => getAllPosDevices({ isActive }), [isActive]);
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  return apiRequest<ProductCategory[]>(`${API_BASE}/product-categories`, { method: 'GET' });
}

export async function getProductCategoryById(id: number): Promise<ProductCategory> {
  if (isNaN(id)) throw new Error('Invalid category ID');
  return apiRequest<ProductCategory>(`${API_BASE}/product-categories/${id}`, { method: 'GET' });
}

export async function createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
  return apiRequest<ProductCategory>(`${API_BASE}/product-categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export async function updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory> {
  if (isNaN(id)) throw new Error('Invalid category ID');
  return apiRequest<ProductCategory>(`${API_BASE}/product-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

export async function deleteProductCategory(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid category ID');
  await apiRequest<null>(`${API_BASE}/product-categories/${id}`, { method: 'DELETE' });
}

export function useProductCategories() {
  return useApiData(() => getAllProductCategories(), []);
}

export async function getAllProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }): Promise<Product[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.categoryId !== undefined && { categoryId: filters.categoryId }),
    ...(filters?.minPrice !== undefined && { minPrice: filters.minPrice }),
    ...(filters?.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
    ...(filters?.isAvailable !== undefined && { isAvailable: filters.isAvailable }),
  });
  const url = params ? `${API_BASE}/products?${params}` : `${API_BASE}/products`;
  return apiRequest<Product[]>(url, { method: 'GET' });
}

export async function getProductById(id: number): Promise<Product> {
  if (isNaN(id)) throw new Error('Invalid product ID');
  return apiRequest<Product>(`${API_BASE}/products/${id}`, { method: 'GET' });
}

export async function getProductsByCategoryId(categoryId: number): Promise<Product[]> {
  if (isNaN(categoryId)) throw new Error('Invalid category ID');
  return apiRequest<Product[]>(`${API_BASE}/products/category/${categoryId}`, { method: 'GET' });
}

export async function createProduct(productData: InsertProduct): Promise<Product> {
  return apiRequest<Product>(`${API_BASE}/products`, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
  if (isNaN(id)) throw new Error('Invalid product ID');
  return apiRequest<Product>(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid product ID');
  await apiRequest<null>(`${API_BASE}/products/${id}`, { method: 'DELETE' });
}

export function useProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }) {
  return useApiData(() => getAllProducts(filters), [JSON.stringify(filters)]);
}

export async function getAllPosTables(filters?: { isOccupied?: boolean }): Promise<PosTable[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.isOccupied !== undefined && { isOccupied: filters.isOccupied }),
  });
  const url = params ? `${API_BASE}/pos-tables?${params}` : `${API_BASE}/pos-tables`;
  return apiRequest<PosTable[]>(url, { method: 'GET' });
}

export async function getPosTableById(id: number): Promise<PosTable> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  return apiRequest<PosTable>(`${API_BASE}/pos-tables/${id}`, { method: 'GET' });
}

export async function createPosTable(tableData: InsertPosTable): Promise<PosTable> {
  return apiRequest<PosTable>(`${API_BASE}/pos-tables`, {
    method: 'POST',
    body: JSON.stringify(tableData),
  });
}

export async function updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  return apiRequest<PosTable>(`${API_BASE}/pos-tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tableData),
  });
}

export async function deletePosTable(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  await apiRequest<null>(`${API_BASE}/pos-tables/${id}`, { method: 'DELETE' });
}

export function usePosTables(isOccupied?: boolean) {
  return useApiData(() => getAllPosTables({ isOccupied }), [isOccupied]);
}

export async function getAllOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: string; endDate?: string }): Promise<Order[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.tableId !== undefined && { tableId: filters.tableId }),
    ...(filters?.employeeId !== undefined && { employeeId: filters.employeeId }),
    ...(filters?.startDate && { startDate: filters.startDate }),
    ...(filters?.endDate && { endDate: filters.endDate }),
  });
  const url = params ? `${API_BASE}/orders?${params}` : `${API_BASE}/orders`;
  return apiRequest<Order[]>(url, { method: 'GET' });
}

export async function getOrderById(id: number): Promise<Order> {
  if (isNaN(id)) throw new Error('Invalid order ID');
  return apiRequest<Order>(`${API_BASE}/orders/${id}`, { method: 'GET' });
}

export async function getOrdersByTableId(tableId: number): Promise<Order[]> {
  if (isNaN(tableId)) throw new Error('Invalid table ID');
  return apiRequest<Order[]>(`${API_BASE}/orders/table/${tableId}`, { method: 'GET' });
}

export async function getOrdersByEmployeeId(employeeId: number): Promise<Order[]> {
  if (isNaN(employeeId)) throw new Error('Invalid employee ID');
  return apiRequest<Order[]>(`${API_BASE}/orders/employee/${employeeId}`, { method: 'GET' });
}

export async function createOrder(orderData: InsertOrder): Promise<Order> {
  return apiRequest<Order>(`${API_BASE}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
  if (isNaN(id)) throw new Error('Invalid order ID');
  return apiRequest<Order>(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  });
}

export async function deleteOrder(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid order ID');
  await apiRequest<null>(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
}

export function useOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllOrders(filters), [JSON.stringify(filters)]);
}

export async function getAllOrderItems(filters?: { orderId?: number }): Promise<OrderItem[]> {
  const params = buildQueryParams({ orderId: filters?.orderId });
  const url = params ? `${API_BASE}/order-items?${params}` : `${API_BASE}/order-items`;
  return apiRequest<OrderItem[]>(url, { method: 'GET' });
}

export async function getOrderItemById(id: number): Promise<OrderItem> {
  if (isNaN(id)) throw new Error('Invalid order item ID');
  return apiRequest<OrderItem>(`${API_BASE}/order-items/${id}`, { method: 'GET' });
}

export async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  if (isNaN(orderId)) throw new Error('Invalid order ID');
  return apiRequest<OrderItem[]>(`${API_BASE}/order-items/order/${orderId}`, { method: 'GET' });
}

export async function createOrderItem(itemData: InsertOrderItem): Promise<OrderItem> {
  return apiRequest<OrderItem>(`${API_BASE}/order-items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}

export async function updateOrderItem(id: number, itemData: Partial<InsertOrderItem>): Promise<OrderItem> {
  if (isNaN(id)) throw new Error('Invalid order item ID');
  return apiRequest<OrderItem>(`${API_BASE}/order-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  });
}

export async function deleteOrderItem(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid order item ID');
  await apiRequest<null>(`${API_BASE}/order-items/${id}`, { method: 'DELETE' });
}

export function useOrderItems(orderId?: number) {
  return useApiData(() => getAllOrderItems({ orderId }), [orderId]);
}

export async function getAllPosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: string; endDate?: string }): Promise<PosHistory[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.employeeId !== undefined && { employeeId: filters.employeeId }),
    ...(filters?.deviceId !== undefined && { deviceId: filters.deviceId }),
    ...(filters?.startDate && { startDate: filters.startDate }),
    ...(filters?.endDate && { endDate: filters.endDate }),
  });
  const url = params ? `${API_BASE}/pos-history?${params}` : `${API_BASE}/pos-history`;
  return apiRequest<PosHistory[]>(url, { method: 'GET' });
}

export async function getPosHistoryById(id: number): Promise<PosHistory> {
  if (isNaN(id)) throw new Error('Invalid history ID');
  return apiRequest<PosHistory>(`${API_BASE}/pos-history/${id}`, { method: 'GET' });
}

export async function createPosHistory(historyData: InsertPosHistory): Promise<PosHistory> {
  return apiRequest<PosHistory>(`${API_BASE}/pos-history`, {
    method: 'POST',
    body: JSON.stringify(historyData),
  });
}

export async function updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory> {
  if (isNaN(id)) throw new Error('Invalid history ID');
  return apiRequest<PosHistory>(`${API_BASE}/pos-history/${id}`, {
    method: 'PUT',
    body: JSON.stringify(historyData),
  });
}

export async function deletePosHistory(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid history ID');
  await apiRequest<null>(`${API_BASE}/pos-history/${id}`, { method: 'DELETE' });
}

export function usePosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllPosHistory(filters), [JSON.stringify(filters)]);
}

export async function getAllPosPaymentMethods(): Promise<PosPaymentMethod[]> {
  return apiRequest<PosPaymentMethod[]>(`${API_BASE}/pos-payment-methods`, { method: 'GET' });
}

export async function getPosPaymentMethodById(id: number): Promise<PosPaymentMethod> {
  if (isNaN(id)) throw new Error('Invalid POS payment method ID');
  return apiRequest<PosPaymentMethod>(`${API_BASE}/pos-payment-methods/${id}`, { method: 'GET' });
}

export async function createPosPaymentMethod(methodData: InsertPosPaymentMethod): Promise<PosPaymentMethod> {
  return apiRequest<PosPaymentMethod>(`${API_BASE}/pos-payment-methods`, {
    method: 'POST',
    body: JSON.stringify(methodData),
  });
}

export async function updatePosPaymentMethod(id: number, methodData: Partial<InsertPosPaymentMethod>): Promise<PosPaymentMethod> {
  if (isNaN(id)) throw new Error('Invalid POS payment method ID');
  return apiRequest<PosPaymentMethod>(`${API_BASE}/pos-payment-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(methodData),
  });
}

export async function deletePosPaymentMethod(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid POS payment method ID');
  await apiRequest<null>(`${API_BASE}/pos-payment-methods/${id}`, { method: 'DELETE' });
}

export function usePosPaymentMethods() {
  return useApiData(() => getAllPosPaymentMethods(), []);
}