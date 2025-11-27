import {
  User, InsertUser, Artist, InsertArtist, Club, InsertClub, 
  Event, InsertEvent, EventArtist, InsertEventArtist, 
  Invitation, InsertInvitation, Ticket, InsertTicket, 
  Feedback, InsertFeedback, Transaction, InsertTransaction,
  Employee, InsertEmployee, PosDevice, InsertPosDevice,
  ProductCategory, InsertProductCategory, Product, InsertProduct,
  PosTable, InsertPosTable, Order, InsertOrder, OrderItem, InsertOrderItem,
  PosHistory, InsertPosHistory, PaymentMethod, InsertPaymentMethod
} from "@shared/schema";

// Type pour les réponses d'erreur
interface ApiError {
  message: string;
  errors?: any[];
}

// Fonction utilitaire pour convertir snake_case en camelCase
const camelCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => camelCaseKeys(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = camelCaseKeys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

// Fonction pour convertir les champs de date en objets Date pour les types spécifiques
const convertDates = (data: any, type: string): any => {
  if (Array.isArray(data)) {
    return data.map(item => convertDates(item, type));
  }
  if (data && typeof data === 'object') {
    const result = { ...data };
    switch (type) {
      case 'Order':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        if (result.updatedAt) result.updatedAt = new Date(result.updatedAt);
        if (result.estimatedCompletionTime) result.estimatedCompletionTime = new Date(result.estimatedCompletionTime);
        break;
      case 'Event':
        if (result.date) result.date = new Date(result.date);
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        if (result.updatedAt) result.updatedAt = new Date(result.updatedAt);
        break;
      case 'Transaction':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        break;
      case 'Ticket':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        if (result.usedAt) result.usedAt = result.usedAt ? new Date(result.usedAt) : null;
        break;
      case 'Invitation':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        if (result.updatedAt) result.updatedAt = new Date(result.updatedAt);
        break;
      case 'Feedback':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        break;
      case 'PosHistory':
        if (result.createdAt) result.createdAt = new Date(result.createdAt);
        break;
      // Ajoutez d'autres types si nécessaire (par exemple, si d'autres entités ont des champs Date)
    }
    return result;
  }
  return data;
};

// Classe principale de l'API
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  // Méthode utilitaire pour les requêtes HTTP qui retournent des données
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    type?: string // Type optionnel pour la conversion des dates
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

    const data = await response.json();
    // Convertir en camelCase
    const camelCasedData = camelCaseKeys(data);
    // Convertir les dates si un type est spécifié
    return type ? convertDates(camelCasedData, type) : camelCasedData;
  }

  // Méthode utilitaire pour les requêtes DELETE (pas de body attendu en succès)
  private async deleteRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Pas besoin de parser le body pour un DELETE réussi
  }

  // User methods
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {}, 'User');
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.request<User>(`/api/users/username/${username}`, {}, 'User');
  }

  async createUser(userData: InsertUser): Promise<User> {
    return this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }, 'User');
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
    
    return this.request<User[]>(`/api/users?${params.toString()}`, {}, 'User');
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }, 'User');
  }

  async deleteUser(id: number): Promise<void> {
    await this.deleteRequest(`/api/users/${id}`);
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
    
    return this.request<Artist[]>(`/api/artists?${params.toString()}`, {}, 'Artist');
  }

  async getArtist(id: number): Promise<Artist> {
    return this.request<Artist>(`/api/artists/${id}`, {}, 'Artist');
  }

  async getArtistByUserId(userId: number): Promise<Artist> {
    return this.request<Artist>(`/api/artists/user/${userId}`, {}, 'Artist');
  }

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    return this.request<Artist>("/api/artists", {
      method: "POST",
      body: JSON.stringify(artistData),
    }, 'Artist');
  }

  async updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
    return this.request<Artist>(`/api/artists/${id}`, {
      method: "PUT",
      body: JSON.stringify(artistData),
    }, 'Artist');
  }

  async deleteArtist(id: number): Promise<void> {
    await this.deleteRequest(`/api/artists/${id}`);
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
    
    return this.request<Club[]>(`/api/clubs?${params.toString()}`, {}, 'Club');
  }

  async getClub(id: number): Promise<Club> {
    return this.request<Club>(`/api/clubs/${id}`, {}, 'Club');
  }

  async getClubByUserId(userId: number): Promise<Club> {
    return this.request<Club>(`/api/clubs/user/${userId}`, {}, 'Club');
  }

  async createClub(clubData: InsertClub): Promise<Club> {
    return this.request<Club>("/api/clubs", {
      method: "POST",
      body: JSON.stringify(clubData),
    }, 'Club');
  }

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    return this.request<Club>(`/api/clubs/${id}`, {
      method: "PUT",
      body: JSON.stringify(clubData),
    }, 'Club');
  }

  async deleteClub(id: number): Promise<void> {
    await this.deleteRequest(`/api/clubs/${id}`);
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
    
    return this.request<Event[]>(`/api/events?${params.toString()}`, {}, 'Event');
  }

  async getEvent(id: number): Promise<Event> {
    return this.request<Event>(`/api/events/${id}`, {}, 'Event');
  }

  async getEventsByClubId(clubId: number): Promise<Event[]> {
    return this.request<Event[]>(`/api/events/club/${clubId}`, {}, 'Event');
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    return this.request<Event>("/api/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }, 'Event');
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    return this.request<Event>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }, 'Event');
  }

  async deleteEvent(id: number): Promise<void> {
    await this.deleteRequest(`/api/events/${id}`);
  }

  // Event Artist methods
  async getAllEventArtists(filters?: { 
    eventId?: number; 
    artistId?: number 
  }): Promise<EventArtist[]> {
    const params = new URLSearchParams();
    if (filters?.eventId !== undefined) params.append("eventId", filters.eventId.toString());
    if (filters?.artistId !== undefined) params.append("artistId", filters.artistId.toString());
    
    return this.request<EventArtist[]>(`/api/event-artists?${params.toString()}`, {}, 'EventArtist');
  }

  async getEventArtistsByEventId(eventId: number): Promise<EventArtist[]> {
    return this.request<EventArtist[]>(`/api/event-artists/event/${eventId}`, {}, 'EventArtist');
  }

  async getEventArtistsByArtistId(artistId: number): Promise<EventArtist[]> {
    return this.request<EventArtist[]>(`/api/event-artists/artist/${artistId}`, {}, 'EventArtist');
  }

  async createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
    return this.request<EventArtist>("/api/event-artists", {
      method: "POST",
      body: JSON.stringify(eventArtistData),
    }, 'EventArtist');
  }

  async deleteEventArtist(eventId: number, artistId: number): Promise<void> {
    const params = new URLSearchParams();
    params.append("eventId", eventId.toString());
    params.append("artistId", artistId.toString());
    
    await this.deleteRequest(`/api/event-artists?${params.toString()}`);
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
    
    return this.request<Invitation[]>(`/api/invitations?${params.toString()}`, {}, 'Invitation');
  }

  async getInvitation(id: number): Promise<Invitation> {
    return this.request<Invitation>(`/api/invitations/${id}`, {}, 'Invitation');
  }

  async getInvitationsByClubId(clubId: number): Promise<Invitation[]> {
    return this.request<Invitation[]>(`/api/invitations/club/${clubId}`, {}, 'Invitation');
  }

  async getInvitationsByArtistId(artistId: number): Promise<Invitation[]> {
    return this.request<Invitation[]>(`/api/invitations/artist/${artistId}`, {}, 'Invitation');
  }

  async createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
    return this.request<Invitation>("/api/invitations", {
      method: "POST",
      body: JSON.stringify(invitationData),
    }, 'Invitation');
  }

  async updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
    return this.request<Invitation>(`/api/invitations/${id}`, {
      method: "PUT",
      body: JSON.stringify(invitationData),
    }, 'Invitation');
  }

  async deleteInvitation(id: number): Promise<void> {
    await this.deleteRequest(`/api/invitations/${id}`);
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
    
    return this.request<Ticket[]>(`/api/tickets?${params.toString()}`, {}, 'Ticket');
  }

  async getTicket(id: number): Promise<Ticket> {
    return this.request<Ticket>(`/api/tickets/${id}`, {}, 'Ticket');
  }

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/api/tickets/event/${eventId}`, {}, 'Ticket');
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/api/tickets/user/${userId}`, {}, 'Ticket');
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    return this.request<Ticket>("/api/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData),
    }, 'Ticket');
  }

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    return this.request<Ticket>(`/api/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(ticketData),
    }, 'Ticket');
  }

  async deleteTicket(id: number): Promise<void> {
    await this.deleteRequest(`/api/tickets/${id}`);
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
    
    return this.request<Feedback[]>(`/api/feedback?${params.toString()}`, {}, 'Feedback');
  }

  async getFeedback(id: number): Promise<Feedback> {
    return this.request<Feedback>(`/api/feedback/${id}`, {}, 'Feedback');
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    return this.request<Feedback>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    }, 'Feedback');
  }

  async updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
    return this.request<Feedback>(`/api/feedback/${id}`, {
      method: "PUT",
      body: JSON.stringify(feedbackData),
    }, 'Feedback');
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.deleteRequest(`/api/feedback/${id}`);
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
    
    return this.request<Transaction[]>(`/api/transactions?${params.toString()}`, {}, 'Transaction');
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`, {}, 'Transaction');
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/api/transactions/user/${userId}`, {}, 'Transaction');
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    return this.request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    }, 'Transaction');
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    }, 'Transaction');
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.deleteRequest(`/api/transactions/${id}`);
  }

  // Employee methods (POS)
  async getAllEmployees(filters?: { 
    role?: string 
  }): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    
    return this.request<Employee[]>(`/api/employees?${params.toString()}`, {}, 'Employee');
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {}, 'Employee');
  }

  async getEmployeeByPin(pin: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/pin/${pin}`, {}, 'Employee');
  }

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    return this.request<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    }, 'Employee');
  }

  async updateEmployee(id: string, employeeData: Partial<InsertEmployee>): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    }, 'Employee');
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.deleteRequest(`/api/employees/${id}`);
  }

  // POS Device methods
  async getAllPosDevices(filters?: { 
    isActive?: boolean 
  }): Promise<PosDevice[]> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append("isActive", filters.isActive.toString());
    
    return this.request<PosDevice[]>(`/api/pos-devices?${params.toString()}`, {}, 'PosDevice');
  }

  async getPosDevice(id: number): Promise<PosDevice> {
    return this.request<PosDevice>(`/api/pos-devices/${id}`, {}, 'PosDevice');
  }

  async createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice> {
    return this.request<PosDevice>("/api/pos-devices", {
      method: "POST",
      body: JSON.stringify(deviceData),
    }, 'PosDevice');
  }

  async updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice> {
    return this.request<PosDevice>(`/api/pos-devices/${id}`, {
      method: "PUT",
      body: JSON.stringify(deviceData),
    }, 'PosDevice');
  }

  async deletePosDevice(id: number): Promise<void> {
    await this.deleteRequest(`/api/pos-devices/${id}`);
  }

  // Product Category methods
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return this.request<ProductCategory[]>("/api/product-categories", {}, 'ProductCategory');
  }

  async getProductCategory(id: number): Promise<ProductCategory> {
    return this.request<ProductCategory>(`/api/product-categories/${id}`, {}, 'ProductCategory');
  }

  async createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
    return this.request<ProductCategory>("/api/product-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }, 'ProductCategory');
  }

  async updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory> {
    return this.request<ProductCategory>(`/api/product-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }, 'ProductCategory');
  }

  async deleteProductCategory(id: number): Promise<void> {
    await this.deleteRequest(`/api/product-categories/${id}`);
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
    
    return this.request<Product[]>(`/api/products?${params.toString()}`, {}, 'Product');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {}, 'Product');
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.request<Product[]>(`/api/products/category/${categoryId}`, {}, 'Product');
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    return this.request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }, 'Product');
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }, 'Product');
  }

  async deleteProduct(id: number): Promise<void> {
    await this.deleteRequest(`/api/products/${id}`);
  }

  // POS Table methods
  async getAllPosTables(filters?: { 
    isOccupied?: boolean 
  }): Promise<PosTable[]> {
    const params = new URLSearchParams();
    if (filters?.isOccupied !== undefined) params.append("isOccupied", filters.isOccupied.toString());
    
    return this.request<PosTable[]>(`/api/pos-tables?${params.toString()}`, {}, 'PosTable');
  }

  async getPosTable(id: number): Promise<PosTable> {
    return this.request<PosTable>(`/api/pos-tables/${id}`, {}, 'PosTable');
  }

  async createPosTable(tableData: InsertPosTable): Promise<PosTable> {
    return this.request<PosTable>("/api/pos-tables", {
      method: "POST",
      body: JSON.stringify(tableData),
    }, 'PosTable');
  }

  async updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable> {
    return this.request<PosTable>(`/api/pos-tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(tableData),
    }, 'PosTable');
  }

  async deletePosTable(id: number): Promise<void> {
    await this.deleteRequest(`/api/pos-tables/${id}`);
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
    
    return this.request<Order[]>(`/api/orders?${params.toString()}`, {}, 'Order');
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`, {}, 'Order');
  }

  async getOrdersByTableId(tableId: number): Promise<Order[]> {
    return this.request<Order[]>(`/api/orders/table/${tableId}`, {}, 'Order');
  }

  async getOrdersByEmployeeId(employeeId: string): Promise<Order[]> {
    return this.request<Order[]>(`/api/orders/employee/${employeeId}`, {}, 'Order');
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    return this.request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }, 'Order');
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    }, 'Order');
  }

  async deleteOrder(id: number): Promise<void> {
    await this.deleteRequest(`/api/orders/${id}`);
  }

  // Order Item methods
  async getAllOrderItems(filters?: { 
    orderId?: number 
  }): Promise<OrderItem[]> {
    const params = new URLSearchParams();
    if (filters?.orderId !== undefined) params.append("orderId", filters.orderId.toString());
    
    return this.request<OrderItem[]>(`/api/order-items?${params.toString()}`, {}, 'OrderItem');
  }

  async getOrderItem(id: number): Promise<OrderItem> {
    return this.request<OrderItem>(`/api/order-items/${id}`, {}, 'OrderItem');
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.request<OrderItem[]>(`/api/order-items/order/${orderId}`, {}, 'OrderItem');
  }

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    return this.request<OrderItem>("/api/order-items", {
      method: "POST",
      body: JSON.stringify(orderItemData),
    }, 'OrderItem');
  }

  async updateOrderItem(id: number, orderItemData: Partial<InsertOrderItem>): Promise<OrderItem> {
    return this.request<OrderItem>(`/api/order-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderItemData),
    }, 'OrderItem');
  }

  async deleteOrderItem(id: number): Promise<void> {
    await this.deleteRequest(`/api/order-items/${id}`);
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
    
    return this.request<PosHistory[]>(`/api/pos-history?${params.toString()}`, {}, 'PosHistory');
  }

  async getPosHistory(id: number): Promise<PosHistory> {
    return this.request<PosHistory>(`/api/pos-history/${id}`, {}, 'PosHistory');
  }

  async createPosHistory(historyData: InsertPosHistory): Promise<PosHistory> {
    return this.request<PosHistory>("/api/pos-history", {
      method: "POST",
      body: JSON.stringify(historyData),
    }, 'PosHistory');
  }

  async updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory> {
    return this.request<PosHistory>(`/api/pos-history/${id}`, {
      method: "PUT",
      body: JSON.stringify(historyData),
    }, 'PosHistory');
  }

  async deletePosHistory(id: number): Promise<void> {
    await this.deleteRequest(`/api/pos-history/${id}`);
  }

  // Payment Method methods
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>("/api/payment-methods", {}, 'PaymentMethod');
  }

  async getPaymentMethod(id: number): Promise<PaymentMethod> {
    return this.request<PaymentMethod>(`/api/payment-methods/${id}`, {}, 'PaymentMethod');
  }

  async createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod> {
    return this.request<PaymentMethod>("/api/payment-methods", {
      method: "POST",
      body: JSON.stringify(paymentMethodData),
    }, 'PaymentMethod');
  }

  async updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
    return this.request<PaymentMethod>(`/api/payment-methods/${id}`, {
      method: "PUT",
      body: JSON.stringify(paymentMethodData),
    }, 'PaymentMethod');
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.deleteRequest(`/api/payment-methods/${id}`);
  }
}

// Instance par défaut de l'API
export const api = new ApiClient();

// Exportation de la classe pour une utilisation personnalisée
export default ApiClient;