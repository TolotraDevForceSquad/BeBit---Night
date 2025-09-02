import {
  User, InsertUser, Artist, InsertArtist, Club, InsertClub, 
  Event, InsertEvent, EventArtist, InsertEventArtist, 
  Invitation, InsertInvitation, Ticket, InsertTicket, 
  Feedback, InsertFeedback, Transaction, InsertTransaction,
  Employee, InsertEmployee, PosDevice, InsertPosDevice,
  ProductCategory, InsertProductCategory, Product, InsertProduct,
  PosTable, InsertPosTable, Order, InsertOrder, OrderItem, InsertOrderItem,
  PosHistory, InsertPosHistory
} from "@shared/schema";

// Type pour les réponses d'erreur
interface ApiError {
  message: string;
  errors?: any[];
}

// Classe principale de l'API
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  // Méthode utilitaire pour les requêtes HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // User methods
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/api/users/${id}`);
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.request<User>(`/api/users/username/${username}`);
  }

  async createUser(userData: InsertUser): Promise<User> {
    return this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers(filters?: { 
    role?: string; 
    city?: string; 
    country?: string; 
    isVerified?: boolean 
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.country) params.append("country", filters.country);
    if (filters?.isVerified !== undefined) params.append("isVerified", filters.isVerified.toString());
    
    return this.request<User[]>(`/api/users?${params.toString()}`);
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  // Artist methods
  async getAllArtists(filters?: { 
    genre?: string; 
    minRate?: number; 
    maxRate?: number; 
    minPopularity?: number 
  }): Promise<Artist[]> {
    const params = new URLSearchParams();
    if (filters?.genre) params.append("genre", filters.genre);
    if (filters?.minRate !== undefined) params.append("minRate", filters.minRate.toString());
    if (filters?.maxRate !== undefined) params.append("maxRate", filters.maxRate.toString());
    if (filters?.minPopularity !== undefined) params.append("minPopularity", filters.minPopularity.toString());
    
    return this.request<Artist[]>(`/api/artists?${params.toString()}`);
  }

  async getArtist(id: number): Promise<Artist> {
    return this.request<Artist>(`/api/artists/${id}`);
  }

  async getArtistByUserId(userId: number): Promise<Artist> {
    return this.request<Artist>(`/api/artists/user/${userId}`);
  }

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    return this.request<Artist>("/api/artists", {
      method: "POST",
      body: JSON.stringify(artistData),
    });
  }

  async updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
    return this.request<Artist>(`/api/artists/${id}`, {
      method: "PUT",
      body: JSON.stringify(artistData),
    });
  }

  async deleteArtist(id: number): Promise<void> {
    await this.request(`/api/artists/${id}`, {
      method: "DELETE",
    });
  }

  // Club methods
  async getAllClubs(filters?: { 
    city?: string; 
    country?: string; 
    minRating?: number; 
    minCapacity?: number 
  }): Promise<Club[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.append("city", filters.city);
    if (filters?.country) params.append("country", filters.country);
    if (filters?.minRating !== undefined) params.append("minRating", filters.minRating.toString());
    if (filters?.minCapacity !== undefined) params.append("minCapacity", filters.minCapacity.toString());
    
    return this.request<Club[]>(`/api/clubs?${params.toString()}`);
  }

  async getClub(id: number): Promise<Club> {
    return this.request<Club>(`/api/clubs/${id}`);
  }

  async getClubByUserId(userId: number): Promise<Club> {
    return this.request<Club>(`/api/clubs/user/${userId}`);
  }

  async createClub(clubData: InsertClub): Promise<Club> {
    return this.request<Club>("/api/clubs", {
      method: "POST",
      body: JSON.stringify(clubData),
    });
  }

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    return this.request<Club>(`/api/clubs/${id}`, {
      method: "PUT",
      body: JSON.stringify(clubData),
    });
  }

  async deleteClub(id: number): Promise<void> {
    await this.request(`/api/clubs/${id}`, {
      method: "DELETE",
    });
  }

  // Event methods
  async getAllEvents(filters?: { 
    clubId?: number; 
    category?: string; 
    city?: string; 
    country?: string; 
    minDate?: Date; 
    maxDate?: Date; 
    minPrice?: number; 
    maxPrice?: number; 
    isApproved?: boolean; 
    mood?: string 
  }): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters?.clubId !== undefined) params.append("clubId", filters.clubId.toString());
    if (filters?.category) params.append("category", filters.category);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.country) params.append("country", filters.country);
    if (filters?.minDate) params.append("minDate", filters.minDate.toISOString());
    if (filters?.maxDate) params.append("maxDate", filters.maxDate.toISOString());
    if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isApproved !== undefined) params.append("isApproved", filters.isApproved.toString());
    if (filters?.mood) params.append("mood", filters.mood);
    
    return this.request<Event[]>(`/api/events?${params.toString()}`);
  }

  async getEvent(id: number): Promise<Event> {
    return this.request<Event>(`/api/events/${id}`);
  }

  async getEventsByClubId(clubId: number): Promise<Event[]> {
    return this.request<Event[]>(`/api/events/club/${clubId}`);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    return this.request<Event>("/api/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    return this.request<Event>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.request(`/api/events/${id}`, {
      method: "DELETE",
    });
  }

  // Event Artist methods
  async getAllEventArtists(filters?: { 
    eventId?: number; 
    artistId?: number 
  }): Promise<EventArtist[]> {
    const params = new URLSearchParams();
    if (filters?.eventId !== undefined) params.append("eventId", filters.eventId.toString());
    if (filters?.artistId !== undefined) params.append("artistId", filters.artistId.toString());
    
    return this.request<EventArtist[]>(`/api/event-artists?${params.toString()}`);
  }

  async getEventArtistsByEventId(eventId: number): Promise<EventArtist[]> {
    return this.request<EventArtist[]>(`/api/event-artists/event/${eventId}`);
  }

  async getEventArtistsByArtistId(artistId: number): Promise<EventArtist[]> {
    return this.request<EventArtist[]>(`/api/event-artists/artist/${artistId}`);
  }

  async createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
    return this.request<EventArtist>("/api/event-artists", {
      method: "POST",
      body: JSON.stringify(eventArtistData),
    });
  }

  async deleteEventArtist(eventId: number, artistId: number): Promise<void> {
    const params = new URLSearchParams();
    params.append("eventId", eventId.toString());
    params.append("artistId", artistId.toString());
    
    await this.request(`/api/event-artists?${params.toString()}`, {
      method: "DELETE",
    });
  }

  // Invitation methods
  async getAllInvitations(filters?: { 
    clubId?: number; 
    artistId?: number; 
    status?: string 
  }): Promise<Invitation[]> {
    const params = new URLSearchParams();
    if (filters?.clubId !== undefined) params.append("clubId", filters.clubId.toString());
    if (filters?.artistId !== undefined) params.append("artistId", filters.artistId.toString());
    if (filters?.status) params.append("status", filters.status);
    
    return this.request<Invitation[]>(`/api/invitations?${params.toString()}`);
  }

  async getInvitation(id: number): Promise<Invitation> {
    return this.request<Invitation>(`/api/invitations/${id}`);
  }

  async getInvitationsByClubId(clubId: number): Promise<Invitation[]> {
    return this.request<Invitation[]>(`/api/invitations/club/${clubId}`);
  }

  async getInvitationsByArtistId(artistId: number): Promise<Invitation[]> {
    return this.request<Invitation[]>(`/api/invitations/artist/${artistId}`);
  }

  async createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
    return this.request<Invitation>("/api/invitations", {
      method: "POST",
      body: JSON.stringify(invitationData),
    });
  }

  async updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
    return this.request<Invitation>(`/api/invitations/${id}`, {
      method: "PUT",
      body: JSON.stringify(invitationData),
    });
  }

  async deleteInvitation(id: number): Promise<void> {
    await this.request(`/api/invitations/${id}`, {
      method: "DELETE",
    });
  }

  // Ticket methods
  async getAllTickets(filters?: { 
    eventId?: number; 
    userId?: number; 
    isUsed?: boolean 
  }): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.eventId !== undefined) params.append("eventId", filters.eventId.toString());
    if (filters?.userId !== undefined) params.append("userId", filters.userId.toString());
    if (filters?.isUsed !== undefined) params.append("isUsed", filters.isUsed.toString());
    
    return this.request<Ticket[]>(`/api/tickets?${params.toString()}`);
  }

  async getTicket(id: number): Promise<Ticket> {
    return this.request<Ticket>(`/api/tickets/${id}`);
  }

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/api/tickets/event/${eventId}`);
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/api/tickets/user/${userId}`);
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    return this.request<Ticket>("/api/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    return this.request<Ticket>(`/api/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(ticketData),
    });
  }

  async deleteTicket(id: number): Promise<void> {
    await this.request(`/api/tickets/${id}`, {
      method: "DELETE",
    });
  }

  // Feedback methods
  async getAllFeedback(filters?: { 
    eventId?: number; 
    artistId?: number; 
    clubId?: number; 
    userId?: number; 
    minRating?: number 
  }): Promise<Feedback[]> {
    const params = new URLSearchParams();
    if (filters?.eventId !== undefined) params.append("eventId", filters.eventId.toString());
    if (filters?.artistId !== undefined) params.append("artistId", filters.artistId.toString());
    if (filters?.clubId !== undefined) params.append("clubId", filters.clubId.toString());
    if (filters?.userId !== undefined) params.append("userId", filters.userId.toString());
    if (filters?.minRating !== undefined) params.append("minRating", filters.minRating.toString());
    
    return this.request<Feedback[]>(`/api/feedback?${params.toString()}`);
  }

  async getFeedback(id: number): Promise<Feedback> {
    return this.request<Feedback>(`/api/feedback/${id}`);
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    return this.request<Feedback>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
  }

  async updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
    return this.request<Feedback>(`/api/feedback/${id}`, {
      method: "PUT",
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.request(`/api/feedback/${id}`, {
      method: "DELETE",
    });
  }

  // Transaction methods
  async getAllTransactions(filters?: { 
    userId?: number; 
    type?: string; 
    minAmount?: number; 
    maxAmount?: number; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.userId !== undefined) params.append("userId", filters.userId.toString());
    if (filters?.type) params.append("type", filters.type);
    if (filters?.minAmount !== undefined) params.append("minAmount", filters.minAmount.toString());
    if (filters?.maxAmount !== undefined) params.append("maxAmount", filters.maxAmount.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate) params.append("endDate", filters.endDate.toISOString());
    
    return this.request<Transaction[]>(`/api/transactions?${params.toString()}`);
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`);
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/api/transactions/user/${userId}`);
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    return this.request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.request(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  }

  // Employee methods (POS)
  async getAllEmployees(filters?: { 
    role?: string 
  }): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    
    return this.request<Employee[]>(`/api/employees?${params.toString()}`);
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`);
  }

  async getEmployeeByPin(pin: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/pin/${pin}`);
  }

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    return this.request<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: string, employeeData: Partial<InsertEmployee>): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.request(`/api/employees/${id}`, {
      method: "DELETE",
    });
  }

  // POS Device methods
  async getAllPosDevices(filters?: { 
    isActive?: boolean 
  }): Promise<PosDevice[]> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append("isActive", filters.isActive.toString());
    
    return this.request<PosDevice[]>(`/api/pos-devices?${params.toString()}`);
  }

  async getPosDevice(id: number): Promise<PosDevice> {
    return this.request<PosDevice>(`/api/pos-devices/${id}`);
  }

  async createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice> {
    return this.request<PosDevice>("/api/pos-devices", {
      method: "POST",
      body: JSON.stringify(deviceData),
    });
  }

  async updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice> {
    return this.request<PosDevice>(`/api/pos-devices/${id}`, {
      method: "PUT",
      body: JSON.stringify(deviceData),
    });
  }

  async deletePosDevice(id: number): Promise<void> {
    await this.request(`/api/pos-devices/${id}`, {
      method: "DELETE",
    });
  }

  // Product Category methods
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return this.request<ProductCategory[]>("/api/product-categories");
  }

  async getProductCategory(id: number): Promise<ProductCategory> {
    return this.request<ProductCategory>(`/api/product-categories/${id}`);
  }

  async createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
    return this.request<ProductCategory>("/api/product-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory> {
    return this.request<ProductCategory>(`/api/product-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteProductCategory(id: number): Promise<void> {
    await this.request(`/api/product-categories/${id}`, {
      method: "DELETE",
    });
  }

  // Product methods
  async getAllProducts(filters?: { 
    categoryId?: number; 
    minPrice?: number; 
    maxPrice?: number; 
    isAvailable?: boolean 
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.categoryId !== undefined) params.append("categoryId", filters.categoryId.toString());
    if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isAvailable !== undefined) params.append("isAvailable", filters.isAvailable.toString());
    
    return this.request<Product[]>(`/api/products?${params.toString()}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.request<Product[]>(`/api/products/category/${categoryId}`);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    return this.request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/api/products/${id}`, {
      method: "DELETE",
    });
  }

  // POS Table methods
  async getAllPosTables(filters?: { 
    isOccupied?: boolean 
  }): Promise<PosTable[]> {
    const params = new URLSearchParams();
    if (filters?.isOccupied !== undefined) params.append("isOccupied", filters.isOccupied.toString());
    
    return this.request<PosTable[]>(`/api/pos-tables?${params.toString()}`);
  }

  async getPosTable(id: number): Promise<PosTable> {
    return this.request<PosTable>(`/api/pos-tables/${id}`);
  }

  async createPosTable(tableData: InsertPosTable): Promise<PosTable> {
    return this.request<PosTable>("/api/pos-tables", {
      method: "POST",
      body: JSON.stringify(tableData),
    });
  }

  async updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable> {
    return this.request<PosTable>(`/api/pos-tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(tableData),
    });
  }

  async deletePosTable(id: number): Promise<void> {
    await this.request(`/api/pos-tables/${id}`, {
      method: "DELETE",
    });
  }

  // Order methods
  async getAllOrders(filters?: { 
    tableId?: number; 
    employeeId?: string; 
    status?: string; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters?.tableId !== undefined) params.append("tableId", filters.tableId.toString());
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate) params.append("endDate", filters.endDate.toISOString());
    
    return this.request<Order[]>(`/api/orders?${params.toString()}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`);
  }

  async getOrdersByTableId(tableId: number): Promise<Order[]> {
    return this.request<Order[]>(`/api/orders/table/${tableId}`);
  }

  async getOrdersByEmployeeId(employeeId: string): Promise<Order[]> {
    return this.request<Order[]>(`/api/orders/employee/${employeeId}`);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    return this.request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.request(`/api/orders/${id}`, {
      method: "DELETE",
    });
  }

  // Order Item methods
  async getAllOrderItems(filters?: { 
    orderId?: number 
  }): Promise<OrderItem[]> {
    const params = new URLSearchParams();
    if (filters?.orderId !== undefined) params.append("orderId", filters.orderId.toString());
    
    return this.request<OrderItem[]>(`/api/order-items?${params.toString()}`);
  }

  async getOrderItem(id: number): Promise<OrderItem> {
    return this.request<OrderItem>(`/api/order-items/${id}`);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.request<OrderItem[]>(`/api/order-items/order/${orderId}`);
  }

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    return this.request<OrderItem>("/api/order-items", {
      method: "POST",
      body: JSON.stringify(orderItemData),
    });
  }

  async updateOrderItem(id: number, orderItemData: Partial<InsertOrderItem>): Promise<OrderItem> {
    return this.request<OrderItem>(`/api/order-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderItemData),
    });
  }

  async deleteOrderItem(id: number): Promise<void> {
    await this.request(`/api/order-items/${id}`, {
      method: "DELETE",
    });
  }

  // POS History methods
  async getAllPosHistory(filters?: { 
    employeeId?: string; 
    deviceId?: number; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<PosHistory[]> {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);
    if (filters?.deviceId !== undefined) params.append("deviceId", filters.deviceId.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate) params.append("endDate", filters.endDate.toISOString());
    
    return this.request<PosHistory[]>(`/api/pos-history?${params.toString()}`);
  }

  async getPosHistory(id: number): Promise<PosHistory> {
    return this.request<PosHistory>(`/api/pos-history/${id}`);
  }

  async createPosHistory(historyData: InsertPosHistory): Promise<PosHistory> {
    return this.request<PosHistory>("/api/pos-history", {
      method: "POST",
      body: JSON.stringify(historyData),
    });
  }

  async updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory> {
    return this.request<PosHistory>(`/api/pos-history/${id}`, {
      method: "PUT",
      body: JSON.stringify(historyData),
    });
  }

  async deletePosHistory(id: number): Promise<void> {
    await this.request(`/api/pos-history/${id}`, {
      method: "DELETE",
    });
  }
}

// Instance par défaut de l'API
export const api = new ApiClient();

// Exportation de la classe pour une utilisation personnalisée
export default ApiClient;