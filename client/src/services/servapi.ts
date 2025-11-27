
// client\src\services\servapi.ts
import {
  // Types
  User, InsertUser, Artist, InsertArtist, ArtistPortfolio, InsertArtistPortfolio,
  Club, InsertClub, ClubLocation, InsertClubLocation, ClubTable, InsertClubTable,
  Event, InsertEvent, EventArtist, InsertEventArtist, EventReservedTable, InsertEventReservedTable,
  EventParticipant, InsertEventParticipant, Invitation, InsertInvitation,
  Ticket, InsertTicket, TicketType, InsertTicketType,
  Feedback, InsertFeedback, FeedbackLike, InsertFeedbackLike, FeedbackComment, InsertFeedbackComment,
  Photo, InsertPhoto, PhotoLike, InsertPhotoLike, PhotoComment, InsertPhotoComment,
  CollaborationMilestone, InsertCollaborationMilestone, CollaborationMessage, InsertCollaborationMessage,
  Transaction, InsertTransaction, CustomerProfile, InsertCustomerProfile,
  MusicGenre, InsertMusicGenre, DrinkType, InsertDrinkType, CustomerTag, InsertCustomerTag,
  Promotion, InsertPromotion, PaymentMethod, InsertPaymentMethod, Invoice, InsertInvoice,
  Employee, InsertEmployee, PosDevice, InsertPosDevice, ProductCategory, InsertProductCategory,
  Product, InsertProduct, PosTable, InsertPosTable, Order, InsertOrder,
  OrderItem, InsertOrderItem, PosHistory, InsertPosHistory, PosPaymentMethod, InsertPosPaymentMethod,
  // Schemas for validation
  insertUserSchema, insertArtistSchema, insertArtistPortfolioSchema,
  insertClubSchema, insertClubLocationSchema, insertClubTableSchema,
  insertEventSchema, insertEventArtistSchema, insertEventReservedTableSchema,
  insertEventParticipantSchema, insertInvitationSchema,
  insertTicketSchema, insertTicketTypeSchema,
  insertFeedbackSchema, insertFeedbackLikeSchema, insertFeedbackCommentSchema,
  insertPhotoSchema, insertPhotoLikeSchema, insertPhotoCommentSchema,
  insertCollaborationMilestoneSchema, insertCollaborationMessageSchema,
  insertTransactionSchema, insertCustomerProfileSchema,
  insertMusicGenreSchema, insertDrinkTypeSchema, insertCustomerTagSchema,
  insertPromotionSchema, insertPaymentMethodSchema, insertInvoiceSchema,
  insertEmployeeSchema, insertPosDeviceSchema,
  insertProductCategorySchema, insertProductSchema,
  insertPosTableSchema, insertOrderSchema, insertOrderItemSchema,
  insertPosHistorySchema, insertPosPaymentMethodSchema
} from '@shared/schema';
import { z } from 'zod';
import { useState, useEffect } from 'react';

// Types pour les fichiers uploadés
export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface UploadResponse {
  message: string;
  file: UploadedFile;
}

export interface MultipleUploadResponse {
  message: string;
  files: UploadedFile[];
}

export interface FileInfo {
  filename: string;
  url: string;
  size: number;
  uploadedAt: Date;
  modifiedAt: Date;
}

const API_BASE = '/api';

// Utility: Build query params
function buildQueryParams(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  return params.toString();
}

// Utility: Handle fetch with error parsing
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// ================================
// AUTH
// ================================
export async function registerUser(userData: InsertUser): Promise<User> {
  insertUserSchema.parse(userData);
  return apiRequest<User>(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginUser(username: string, password: string): Promise<User> {
  if (!username || !password) throw new Error('Username and password required');
  return apiRequest<User>(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ================================
// USERS
// ================================
export async function getAllUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }): Promise<User[]> {
  const params = buildQueryParams(filters || {});
  const url = params ? `${API_BASE}/users?${params}` : `${API_BASE}/users`;
  return apiRequest<User[]>(url, { method: 'GET' });
}

export async function getUserById(id: number): Promise<User> {
  if (isNaN(id)) throw new Error('Invalid user ID');
  return apiRequest<User>(`${API_BASE}/users/${id}`, { method: 'GET' });
}

export async function getUserByUsername(username: string): Promise<User> {
  return apiRequest<User>(`${API_BASE}/users/username/${username}`, { method: 'GET' });
}

export async function createUser(userData: InsertUser): Promise<User> {
  insertUserSchema.parse(userData);
  return apiRequest<User>(`${API_BASE}/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id: number, userData: Partial<InsertUser> & { currentPassword?: string }): Promise<User> {
  if (isNaN(id)) throw new Error('Invalid user ID');
  return apiRequest<User>(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid user ID');
  await apiRequest<null>(`${API_BASE}/users/${id}`, { method: 'DELETE' });
}

// Hook
export function useUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }) {
  return useApiData(() => getAllUsers(filters), [JSON.stringify(filters)]);
}

// ================================
// ARTISTS
// ================================
export async function getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.minRate !== undefined && { minRate: filters.minRate }),
    ...(filters?.maxRate !== undefined && { maxRate: filters.maxRate }),
    ...(filters?.minPopularity !== undefined && { minPopularity: filters.minPopularity }),
  });
  const url = params ? `${API_BASE}/artists?${params}` : `${API_BASE}/artists`;
  return apiRequest<Artist[]>(url, { method: 'GET' });
}

export async function getArtistById(id: number): Promise<Artist> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  return apiRequest<Artist>(`${API_BASE}/artists/${id}`, { method: 'GET' });
}

export async function getArtistByUserId(userId: number): Promise<Artist> {
  if (isNaN(userId)) throw new Error('Invalid user ID');
  return apiRequest<Artist>(`${API_BASE}/artists/user/${userId}`, { method: 'GET' });
}

export async function createArtist(artistData: InsertArtist): Promise<Artist> {
  insertArtistSchema.parse(artistData);
  return apiRequest<Artist>(`${API_BASE}/artists`, {
    method: 'POST',
    body: JSON.stringify(artistData),
  });
}

export async function updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  return apiRequest<Artist>(`${API_BASE}/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artistData),
  });
}

export async function deleteArtist(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  await apiRequest<null>(`${API_BASE}/artists/${id}`, { method: 'DELETE' });
}

// Hook
export function useArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }) {
  return useApiData(() => getAllArtists(filters), [JSON.stringify(filters)]);
}

// ================================
// ARTIST PORTFOLIOS
// ================================
export async function getAllArtistPortfolios(filters?: { artistId?: number }): Promise<ArtistPortfolio[]> {
  const params = buildQueryParams(filters || {});
  const url = params ? `${API_BASE}/artist-portfolios?${params}` : `${API_BASE}/artist-portfolios`;
  return apiRequest<ArtistPortfolio[]>(url, { method: 'GET' });
}

export async function getArtistPortfolioById(id: number): Promise<ArtistPortfolio> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios/${id}`, { method: 'GET' });
}

export async function getArtistPortfoliosByArtistId(artistId: number): Promise<ArtistPortfolio[]> {
  if (isNaN(artistId)) throw new Error('Invalid artist ID');
  return apiRequest<ArtistPortfolio[]>(`${API_BASE}/artist-portfolios/artist/${artistId}`, { method: 'GET' });
}

export async function createArtistPortfolio(portfolioData: InsertArtistPortfolio): Promise<ArtistPortfolio> {
  insertArtistPortfolioSchema.parse(portfolioData);
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios`, {
    method: 'POST',
    body: JSON.stringify(portfolioData),
  });
}

export async function updateArtistPortfolio(id: number, portfolioData: Partial<InsertArtistPortfolio>): Promise<ArtistPortfolio> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(portfolioData),
  });
}

export async function deleteArtistPortfolio(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  await apiRequest<null>(`${API_BASE}/artist-portfolios/${id}`, { method: 'DELETE' });
}

// Hook
export function useArtistPortfolios(artistId?: number) {
  return useApiData(() => getAllArtistPortfolios({ artistId }), [artistId]);
}

// ================================
// CLUBS
// ================================
export async function getAllClubs(filters?: { city?: string; country?: string; category?: string; featured?: boolean }): Promise<Club[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.featured !== undefined && { featured: filters.featured }),
  });
  const url = params ? `${API_BASE}/clubs?${params}` : `${API_BASE}/clubs`;
  return apiRequest<Club[]>(url, { method: 'GET' });
}

export async function getClubById(id: number): Promise<Club> {
  if (isNaN(id)) throw new Error('Invalid club ID');
  return apiRequest<Club>(`${API_BASE}/clubs/${id}`, { method: 'GET' });
}

export async function getClubByUserId(userId: number): Promise<Club> {
  if (isNaN(userId)) throw new Error('Invalid user ID');
  return apiRequest<Club>(`${API_BASE}/clubs/user/${userId}`, { method: 'GET' });
}

export async function createClub(clubData: InsertClub): Promise<Club> {
  insertClubSchema.parse(clubData);
  return apiRequest<Club>(`${API_BASE}/clubs`, {
    method: 'POST',
    body: JSON.stringify(clubData),
  });
}

export async function updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
  if (isNaN(id)) throw new Error('Invalid club ID');
  return apiRequest<Club>(`${API_BASE}/clubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clubData),
  });
}

export async function deleteClub(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid club ID');
  await apiRequest<null>(`${API_BASE}/clubs/${id}`, { method: 'DELETE' });
}

// Hook
export function useClubs(filters?: { city?: string; country?: string; category?: string; featured?: boolean }) {
  return useApiData(() => getAllClubs(filters), [JSON.stringify(filters)]);
}

// ================================
// CLUB LOCATIONS
// ================================
export async function getAllClubLocations(filters?: { clubId?: number }): Promise<ClubLocation[]> {
  const params = buildQueryParams(filters || {});
  const url = params ? `${API_BASE}/club-locations?${params}` : `${API_BASE}/club-locations`;
  return apiRequest<ClubLocation[]>(url, { method: 'GET' });
}

export async function getClubLocationById(id: number): Promise<ClubLocation> {
  if (isNaN(id)) throw new Error('Invalid location ID');
  return apiRequest<ClubLocation>(`${API_BASE}/club-locations/${id}`, { method: 'GET' });
}

export async function getClubLocationsByClubId(clubId: number): Promise<ClubLocation[]> {
  if (isNaN(clubId)) throw new Error('Invalid club ID');
  return apiRequest<ClubLocation[]>(`${API_BASE}/club-locations/club/${clubId}`, { method: 'GET' });
}

export async function createClubLocation(locationData: InsertClubLocation): Promise<ClubLocation> {
  insertClubLocationSchema.parse(locationData);
  return apiRequest<ClubLocation>(`${API_BASE}/club-locations`, {
    method: 'POST',
    body: JSON.stringify(locationData),
  });
}

export async function updateClubLocation(id: number, locationData: Partial<InsertClubLocation>): Promise<ClubLocation> {
  if (isNaN(id)) throw new Error('Invalid location ID');
  return apiRequest<ClubLocation>(`${API_BASE}/club-locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(locationData),
  });
}

export async function deleteClubLocation(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid location ID');
  await apiRequest<null>(`${API_BASE}/club-locations/${id}`, { method: 'DELETE' });
}

// Hook
export function useClubLocations(clubId?: number) {
  return useApiData(() => getAllClubLocations({ clubId }), [clubId]);
}

// ================================
// CLUB TABLES
// ================================
export async function getAllClubTables(filters?: { clubId?: number; available?: boolean }): Promise<ClubTable[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.available !== undefined && { available: filters.available }),
  });
  const url = params ? `${API_BASE}/club-tables?${params}` : `${API_BASE}/club-tables`;
  return apiRequest<ClubTable[]>(url, { method: 'GET' });
}

export async function getClubTableById(id: number): Promise<ClubTable> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  return apiRequest<ClubTable>(`${API_BASE}/club-tables/${id}`, { method: 'GET' });
}

export async function getClubTablesByClubId(clubId: number): Promise<ClubTable[]> {
  if (isNaN(clubId)) throw new Error('Invalid club ID');
  return apiRequest<ClubTable[]>(`${API_BASE}/club-tables/club/${clubId}`, { method: 'GET' });
}

export async function createClubTable(tableData: InsertClubTable): Promise<ClubTable> {
  insertClubTableSchema.parse(tableData);
  return apiRequest<ClubTable>(`${API_BASE}/club-tables`, {
    method: 'POST',
    body: JSON.stringify(tableData),
  });
}

export async function updateClubTable(id: number, tableData: Partial<InsertClubTable>): Promise<ClubTable> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  return apiRequest<ClubTable>(`${API_BASE}/club-tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tableData),
  });
}

export async function deleteClubTable(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid table ID');
  await apiRequest<null>(`${API_BASE}/club-tables/${id}`, { method: 'DELETE' });
}

// Hook
export function useClubTables(filters?: { clubId?: number; available?: boolean }) {
  return useApiData(() => getAllClubTables(filters), [JSON.stringify(filters)]);
}

// ================================
// EVENTS
// ================================
export async function getAllEvents(filters?: { clubId?: number; city?: string; country?: string; status?: string; startDate?: string; endDate?: string }): Promise<Event[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.clubId !== undefined && { clubId: filters.clubId }),
    ...(filters?.startDate && { startDate: filters.startDate }),
    ...(filters?.endDate && { endDate: filters.endDate }),
  });
  const url = params ? `${API_BASE}/events?${params}` : `${API_BASE}/events`;
  return apiRequest<Event[]>(url, { method: 'GET' });
}

export async function getEventById(id: number): Promise<Event> {
  if (isNaN(id)) throw new Error('Invalid event ID');
  return apiRequest<Event>(`${API_BASE}/events/${id}`, { method: 'GET' });
}

export async function createEvent(eventData: InsertEvent): Promise<Event> {
  insertEventSchema.parse(eventData);
  return apiRequest<Event>(`${API_BASE}/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
  if (isNaN(id)) throw new Error('Invalid event ID');
  return apiRequest<Event>(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

export async function deleteEvent(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid event ID');
  await apiRequest<null>(`${API_BASE}/events/${id}`, { method: 'DELETE' });
}

// Hook
export function useEvents(filters?: { clubId?: number; city?: string; country?: string; status?: string; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllEvents(filters), [JSON.stringify(filters)]);
}

// ================================
// EVENT ARTISTS (Junction - POST only in routes, assume CRUD if needed)
// ================================
export async function createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
  insertEventArtistSchema.parse(eventArtistData);
  return apiRequest<EventArtist>(`${API_BASE}/event-artists`, {
    method: 'POST',
    body: JSON.stringify(eventArtistData),
  });
}

export async function getAllEventArtists(eventId?: number, artistId?: number): Promise<EventArtist[]> {
  const params = buildQueryParams({ eventId, artistId });
  const url = params ? `${API_BASE}/event-artists?${params}` : `${API_BASE}/event-artists`;
  return apiRequest<EventArtist[]>(url, { method: 'GET' });
}

// ================================
// EVENT RESERVED TABLES (Junction)
// ================================
export async function createEventReservedTable(reservedTableData: InsertEventReservedTable): Promise<EventReservedTable> {
  insertEventReservedTableSchema.parse(reservedTableData);
  return apiRequest<EventReservedTable>(`${API_BASE}/event-reserved-tables`, {
    method: 'POST',
    body: JSON.stringify(reservedTableData),
  });
}

export async function getAllEventReservedTables(eventId?: number, tableId?: number): Promise<EventReservedTable[]> {
  const params = buildQueryParams({ eventId, tableId });
  const url = params ? `${API_BASE}/event-reserved-tables?${params}` : `${API_BASE}/event-reserved-tables`;
  return apiRequest<EventReservedTable[]>(url, { method: 'GET' });
}

// ================================
// EVENT PARTICIPANTS (Junction)
// ================================
export async function createEventParticipant(participantData: InsertEventParticipant): Promise<EventParticipant> {
  insertEventParticipantSchema.parse(participantData);
  return apiRequest<EventParticipant>(`${API_BASE}/event-participants`, {
    method: 'POST',
    body: JSON.stringify(participantData),
  });
}

export async function getAllEventParticipants(eventId?: number, userId?: number): Promise<EventParticipant[]> {
  const params = buildQueryParams({ eventId, userId });
  const url = params ? `${API_BASE}/event-participants?${params}` : `${API_BASE}/event-participants`;
  return apiRequest<EventParticipant[]>(url, { method: 'GET' });
}

// ================================
// EVENT ARTISTS - Additional functions
// ================================
export async function deleteEventArtist(eventId: number, artistId: number): Promise<void> {
  if (isNaN(eventId) || isNaN(artistId)) throw new Error('Invalid event ID or artist ID');
  await apiRequest<null>(`${API_BASE}/event-artists/${eventId}/${artistId}`, { method: 'DELETE' });
}

export async function updateEventArtist(eventId: number, artistId: number, eventArtistData: Partial<InsertEventArtist>): Promise<EventArtist> {
  if (isNaN(eventId) || isNaN(artistId)) throw new Error('Invalid event ID or artist ID');
  return apiRequest<EventArtist>(`${API_BASE}/event-artists/${eventId}/${artistId}`, {
    method: 'PUT',
    body: JSON.stringify(eventArtistData),
  });
}

// ================================
// EVENT PARTICIPANTS - Additional functions
// ================================
export async function updateEventParticipant(eventId: number, userId: number, participantData: Partial<InsertEventParticipant>): Promise<EventParticipant> {
  if (isNaN(eventId) || isNaN(userId)) throw new Error('Invalid event ID or user ID');
  return apiRequest<EventParticipant>(`${API_BASE}/event-participants/${eventId}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(participantData),
  });
}

export async function deleteEventParticipant(eventId: number, userId: number): Promise<void> {
  if (isNaN(eventId) || isNaN(userId)) throw new Error('Invalid event ID or user ID');
  await apiRequest<null>(`${API_BASE}/event-participants/${eventId}/${userId}`, { method: 'DELETE' });
}


// ================================
// INVITATIONS
// ================================
export async function getAllInvitations(filters?: { eventId?: number; userId?: number; status?: string }): Promise<Invitation[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.eventId !== undefined && { eventId: filters.eventId }),
    ...(filters?.userId !== undefined && { userId: filters.userId }),
  });
  const url = params ? `${API_BASE}/invitations?${params}` : `${API_BASE}/invitations`;
  return apiRequest<Invitation[]>(url, { method: 'GET' });
}

export async function getInvitationById(id: number): Promise<Invitation> {
  if (isNaN(id)) throw new Error('Invalid invitation ID');
  return apiRequest<Invitation>(`${API_BASE}/invitations/${id}`, { method: 'GET' });
}

export async function createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
  insertInvitationSchema.parse(invitationData);
  return apiRequest<Invitation>(`${API_BASE}/invitations`, {
    method: 'POST',
    body: JSON.stringify(invitationData),
  });
}

export async function updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
  if (isNaN(id)) throw new Error('Invalid invitation ID');
  return apiRequest<Invitation>(`${API_BASE}/invitations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invitationData),
  });
}

export async function deleteInvitation(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid invitation ID');
  await apiRequest<null>(`${API_BASE}/invitations/${id}`, { method: 'DELETE' });
}

// Hook
export function useInvitations(filters?: { eventId?: number; userId?: number; status?: string }) {
  return useApiData(() => getAllInvitations(filters), [JSON.stringify(filters)]);
}

// ================================
// TICKETS & TICKET TYPES
// ================================
export async function getAllTickets(eventId?: number, userId?: number): Promise<Ticket[]> {
  const params = buildQueryParams({ eventId, userId });
  const url = params ? `${API_BASE}/tickets?${params}` : `${API_BASE}/tickets`;
  return apiRequest<Ticket[]>(url, { method: 'GET' });
}

export async function getTicketById(id: number): Promise<Ticket> {
  if (isNaN(id)) throw new Error('Invalid ticket ID');
  return apiRequest<Ticket>(`${API_BASE}/tickets/${id}`, { method: 'GET' });
}

export async function createTicket(ticketData: InsertTicket): Promise<Ticket> {
  insertTicketSchema.parse(ticketData);
  return apiRequest<Ticket>(`${API_BASE}/tickets`, {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
}

export async function updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
  if (isNaN(id)) throw new Error('Invalid ticket ID');
  return apiRequest<Ticket>(`${API_BASE}/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketData),
  });
}

export async function deleteTicket(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid ticket ID');
  await apiRequest<null>(`${API_BASE}/tickets/${id}`, { method: 'DELETE' });
}

export async function getAllTicketTypes(eventId?: number): Promise<TicketType[]> {
  const params = buildQueryParams({ eventId });
  const url = params ? `${API_BASE}/ticket-types?${params}` : `${API_BASE}/ticket-types`;
  return apiRequest<TicketType[]>(url, { method: 'GET' });
}

export async function getTicketTypeById(id: number): Promise<TicketType> {
  if (isNaN(id)) throw new Error('Invalid ticket type ID');
  return apiRequest<TicketType>(`${API_BASE}/ticket-types/${id}`, { method: 'GET' });
}

export async function createTicketType(ticketTypeData: InsertTicketType): Promise<TicketType> {
  insertTicketTypeSchema.parse(ticketTypeData);
  return apiRequest<TicketType>(`${API_BASE}/ticket-types`, {
    method: 'POST',
    body: JSON.stringify(ticketTypeData),
  });
}

export async function updateTicketType(id: number, ticketTypeData: Partial<InsertTicketType>): Promise<TicketType> {
  if (isNaN(id)) throw new Error('Invalid ticket type ID');
  return apiRequest<TicketType>(`${API_BASE}/ticket-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketTypeData),
  });
}

export async function deleteTicketType(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid ticket type ID');
  await apiRequest<null>(`${API_BASE}/ticket-types/${id}`, { method: 'DELETE' });
}

// Hook
export function useTicketTypes(eventId?: number) {
  return useApiData(() => getAllTicketTypes(eventId), [eventId]);
}

// ================================
// FEEDBACK
// ================================
export async function getAllFeedback(filters?: { sourceType?: string; sourceId?: number }): Promise<Feedback[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.sourceId !== undefined && { sourceId: filters.sourceId }),
  });
  const url = params ? `${API_BASE}/feedback?${params}` : `${API_BASE}/feedback`;
  return apiRequest<Feedback[]>(url, { method: 'GET' });
}

export async function getFeedbackById(id: number): Promise<Feedback> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  return apiRequest<Feedback>(`${API_BASE}/feedback/${id}`, { method: 'GET' });
}

export async function createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
  insertFeedbackSchema.parse(feedbackData);
  return apiRequest<Feedback>(`${API_BASE}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });
}

export async function updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  return apiRequest<Feedback>(`${API_BASE}/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(feedbackData),
  });
}

export async function deleteFeedback(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  await apiRequest<null>(`${API_BASE}/feedback/${id}`, { method: 'DELETE' });
}

// Hook
export function useFeedback(filters?: { sourceType?: string; sourceId?: number }) {
  return useApiData(() => getAllFeedback(filters), [JSON.stringify(filters)]);
}

// ================================
// FEEDBACK LIKES
// ================================
export async function createFeedbackLike(likeData: InsertFeedbackLike): Promise<FeedbackLike> {
  insertFeedbackLikeSchema.parse(likeData);
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes`, {
    method: 'POST',
    body: JSON.stringify(likeData),
  });
}

export async function deleteFeedbackLike(feedbackId: number, userId: number): Promise<void> {
  await apiRequest<null>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, { method: 'DELETE' });
}


export async function getAllFeedbackLikes(filters?: { feedbackId?: number; userId?: number }): Promise<FeedbackLike[]> {
  const params = buildQueryParams(filters ?? {});
  const url = params ? `${API_BASE}/feedback-likes?${params}` : `${API_BASE}/feedback-likes`;
  return apiRequest<FeedbackLike[]>(url, { method: 'GET' });
}

export async function getFeedbackLike(feedbackId: number, userId: number): Promise<FeedbackLike> {
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, { method: 'GET' });
}

export async function updateFeedbackLike(feedbackId: number, userId: number, data: Partial<InsertFeedbackLike>): Promise<FeedbackLike> {
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// ================================
// HOOK : FEEDBACK LIKES
// ================================
export function useFeedbackLikes(filters?: { feedbackId?: number; userId?: number }) {
  return useApiData(
    () => getAllFeedbackLikes(filters),
    [JSON.stringify(filters)]
  );
}


// ================================
// FEEDBACK COMMENTS
// ================================
export async function getAllFeedbackComments(feedbackId?: number): Promise<FeedbackComment[]> {
  const params = buildQueryParams({ feedbackId });
  const url = params ? `${API_BASE}/feedback-comments?${params}` : `${API_BASE}/feedback-comments`;
  return apiRequest<FeedbackComment[]>(url, { method: 'GET' });
}

export async function createFeedbackComment(commentData: InsertFeedbackComment): Promise<FeedbackComment> {
  insertFeedbackCommentSchema.parse(commentData);
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export async function updateFeedbackComment(id: number, commentData: Partial<InsertFeedbackComment>): Promise<FeedbackComment> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(commentData),
  });
}

export async function deleteFeedbackComment(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  await apiRequest<null>(`${API_BASE}/feedback-comments/${id}`, { method: 'DELETE' });
}

export async function getFeedbackComment(id: number): Promise<FeedbackComment> {
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments/${id}`, { method: 'GET' });
}


// Hook
export function useFeedbackComments(feedbackId?: number) {
  return useApiData(() => getAllFeedbackComments(feedbackId), [feedbackId]);
}

// ================================
// PHOTOS
// ================================
export async function getAllPhotos(filters?: { userId?: number; eventId?: number }): Promise<Photo[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.userId !== undefined && { userId: filters.userId }),
    ...(filters?.eventId !== undefined && { eventId: filters.eventId }),
  });
  const url = params ? `${API_BASE}/photos?${params}` : `${API_BASE}/photos`;
  return apiRequest<Photo[]>(url, { method: 'GET' });
}

export async function getPhotoById(id: number): Promise<Photo> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  return apiRequest<Photo>(`${API_BASE}/photos/${id}`, { method: 'GET' });
}

export async function createPhoto(photoData: InsertPhoto): Promise<Photo> {
  insertPhotoSchema.parse(photoData);
  return apiRequest<Photo>(`${API_BASE}/photos`, {
    method: 'POST',
    body: JSON.stringify(photoData),
  });
}

export async function updatePhoto(id: number, photoData: Partial<InsertPhoto>): Promise<Photo> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  return apiRequest<Photo>(`${API_BASE}/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(photoData),
  });
}

export async function deletePhoto(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  await apiRequest<null>(`${API_BASE}/photos/${id}`, { method: 'DELETE' });
}

// Hook
export function usePhotos(filters?: { userId?: number; eventId?: number }) {
  return useApiData(() => getAllPhotos(filters), [JSON.stringify(filters)]);
}

// ================================
// PHOTO LIKES
// ================================
export async function createPhotoLike(likeData: InsertPhotoLike): Promise<PhotoLike> {
  insertPhotoLikeSchema.parse(likeData);
  return apiRequest<PhotoLike>(`${API_BASE}/photo-likes`, {
    method: 'POST',
    body: JSON.stringify(likeData),
  });
}

export async function deletePhotoLike(photoId: number, userId: number): Promise<void> {
  await apiRequest<null>(`${API_BASE}/photo-likes/${photoId}/${userId}`, { method: 'DELETE' });
}

// ================================
// PHOTO COMMENTS
// ================================
export async function getAllPhotoComments(photoId?: number): Promise<PhotoComment[]> {
  const params = buildQueryParams({ photoId });
  const url = params ? `${API_BASE}/photo-comments?${params}` : `${API_BASE}/photo-comments`;
  return apiRequest<PhotoComment[]>(url, { method: 'GET' });
}

export async function createPhotoComment(commentData: InsertPhotoComment): Promise<PhotoComment> {
  insertPhotoCommentSchema.parse(commentData);
  return apiRequest<PhotoComment>(`${API_BASE}/photo-comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export async function updatePhotoComment(id: number, commentData: Partial<InsertPhotoComment>): Promise<PhotoComment> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  return apiRequest<PhotoComment>(`${API_BASE}/photo-comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(commentData),
  });
}

export async function deletePhotoComment(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  await apiRequest<null>(`${API_BASE}/photo-comments/${id}`, { method: 'DELETE' });
}

// Hook
export function usePhotoComments(photoId?: number) {
  return useApiData(() => getAllPhotoComments(photoId), [photoId]);
}

// ================================
// COLLABORATION MILESTONES
// ================================
export async function getAllCollaborationMilestones(filters?: { invitationId?: number }): Promise<CollaborationMilestone[]> {
  const params = buildQueryParams({ invitationId: filters?.invitationId });
  const url = params ? `${API_BASE}/collaboration-milestones?${params}` : `${API_BASE}/collaboration-milestones`;
  return apiRequest<CollaborationMilestone[]>(url, { method: 'GET' });
}

export async function getCollaborationMilestoneById(id: number): Promise<CollaborationMilestone> {
  if (isNaN(id)) throw new Error('Invalid milestone ID');
  return apiRequest<CollaborationMilestone>(`${API_BASE}/collaboration-milestones/${id}`, { method: 'GET' });
}

export async function createCollaborationMilestone(milestoneData: InsertCollaborationMilestone): Promise<CollaborationMilestone> {
  insertCollaborationMilestoneSchema.parse(milestoneData);
  return apiRequest<CollaborationMilestone>(`${API_BASE}/collaboration-milestones`, {
    method: 'POST',
    body: JSON.stringify(milestoneData),
  });
}

export async function updateCollaborationMilestone(id: number, milestoneData: Partial<InsertCollaborationMilestone>): Promise<CollaborationMilestone> {
  if (isNaN(id)) throw new Error('Invalid milestone ID');
  return apiRequest<CollaborationMilestone>(`${API_BASE}/collaboration-milestones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(milestoneData),
  });
}

export async function deleteCollaborationMilestone(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid milestone ID');
  await apiRequest<null>(`${API_BASE}/collaboration-milestones/${id}`, { method: 'DELETE' });
}

// Hook
export function useCollaborationMilestones(invitationId?: number) {
  return useApiData(() => getAllCollaborationMilestones({ invitationId }), [invitationId]);
}

// ================================
// COLLABORATION MESSAGES
// ================================
export async function getAllCollaborationMessages(invitationId?: number): Promise<CollaborationMessage[]> {
  const params = buildQueryParams({ invitationId });
  const url = params ? `${API_BASE}/collaboration-messages?${params}` : `${API_BASE}/collaboration-messages`;
  return apiRequest<CollaborationMessage[]>(url, { method: 'GET' });
}

export async function createCollaborationMessage(messageData: InsertCollaborationMessage): Promise<CollaborationMessage> {
  insertCollaborationMessageSchema.parse(messageData);
  return apiRequest<CollaborationMessage>(`${API_BASE}/collaboration-messages`, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

export async function updateCollaborationMessage(id: number, messageData: Partial<InsertCollaborationMessage>): Promise<CollaborationMessage> {
  if (isNaN(id)) throw new Error('Invalid message ID');
  return apiRequest<CollaborationMessage>(`${API_BASE}/collaboration-messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(messageData),
  });
}

export async function deleteCollaborationMessage(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid message ID');
  await apiRequest<null>(`${API_BASE}/collaboration-messages/${id}`, { method: 'DELETE' });
}

// Hook
export function useCollaborationMessages(invitationId?: number) {
  return useApiData(() => getAllCollaborationMessages(invitationId), [invitationId]);
}

// ================================
// TRANSACTIONS
// ================================
export async function getAllTransactions(filters?: { userId?: number }): Promise<Transaction[]> {
  const params = buildQueryParams({ userId: filters?.userId });
  const url = params ? `${API_BASE}/transactions?${params}` : `${API_BASE}/transactions`;
  return apiRequest<Transaction[]>(url, { method: 'GET' });
}

export async function getTransactionById(id: number): Promise<Transaction> {
  if (isNaN(id)) throw new Error('Invalid transaction ID');
  return apiRequest<Transaction>(`${API_BASE}/transactions/${id}`, { method: 'GET' });
}

export async function createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
  insertTransactionSchema.parse(transactionData);
  return apiRequest<Transaction>(`${API_BASE}/transactions`, {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

export async function updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
  if (isNaN(id)) throw new Error('Invalid transaction ID');
  return apiRequest<Transaction>(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
}

export async function deleteTransaction(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid transaction ID');
  await apiRequest<null>(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
}

// Hook
export function useTransactions(userId?: number) {
  return useApiData(() => getAllTransactions({ userId }), [userId]);
}

// ================================
// CUSTOMER PROFILES
// ================================
export async function getAllCustomerProfiles(userId?: number): Promise<CustomerProfile[]> {
  const params = buildQueryParams({ userId });
  const url = params ? `${API_BASE}/customer-profiles?${params}` : `${API_BASE}/customer-profiles`;
  return apiRequest<CustomerProfile[]>(url, { method: 'GET' });
}

export async function getCustomerProfileById(id: number): Promise<CustomerProfile> {
  if (isNaN(id)) throw new Error('Invalid profile ID');
  return apiRequest<CustomerProfile>(`${API_BASE}/customer-profiles/${id}`, { method: 'GET' });
}

export async function createCustomerProfile(profileData: InsertCustomerProfile): Promise<CustomerProfile> {
  return apiRequest<CustomerProfile>(`${API_BASE}/customer-profiles`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
}

export async function updateCustomerProfile(id: number, profileData: Partial<InsertCustomerProfile>): Promise<CustomerProfile> {
  if (isNaN(id)) throw new Error('Invalid profile ID');
  return apiRequest<CustomerProfile>(`${API_BASE}/customer-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

export async function deleteCustomerProfile(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid profile ID');
  await apiRequest<null>(`${API_BASE}/customer-profiles/${id}`, { method: 'DELETE' });
}

// Hook
export function useCustomerProfiles(userId?: number) {
  return useApiData(() => getAllCustomerProfiles(userId), [userId]);
}

// ================================
// MUSIC GENRES
// ================================
export async function getAllMusicGenres(): Promise<MusicGenre[]> {
  return apiRequest<MusicGenre[]>(`${API_BASE}/music-genres`, { method: 'GET' });
}

export async function getMusicGenreById(id: number): Promise<MusicGenre> {
  if (isNaN(id)) throw new Error('Invalid genre ID');
  return apiRequest<MusicGenre>(`${API_BASE}/music-genres/${id}`, { method: 'GET' });
}

export async function createMusicGenre(genreData: InsertMusicGenre): Promise<MusicGenre> {
  return apiRequest<MusicGenre>(`${API_BASE}/music-genres`, {
    method: 'POST',
    body: JSON.stringify(genreData),
  });
}

export async function updateMusicGenre(id: number, genreData: Partial<InsertMusicGenre>): Promise<MusicGenre> {
  if (isNaN(id)) throw new Error('Invalid genre ID');
  return apiRequest<MusicGenre>(`${API_BASE}/music-genres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(genreData),
  });
}

export async function deleteMusicGenre(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid genre ID');
  await apiRequest<null>(`${API_BASE}/music-genres/${id}`, { method: 'DELETE' });
}

// Hook
export function useMusicGenres() {
  return useApiData(() => getAllMusicGenres(), []);
}

// ================================
// DRINK TYPES
// ================================
export async function getAllDrinkTypes(): Promise<DrinkType[]> {
  return apiRequest<DrinkType[]>(`${API_BASE}/drink-types`, { method: 'GET' });
}

export async function getDrinkTypeById(id: number): Promise<DrinkType> {
  if (isNaN(id)) throw new Error('Invalid drink type ID');
  return apiRequest<DrinkType>(`${API_BASE}/drink-types/${id}`, { method: 'GET' });
}

export async function createDrinkType(drinkTypeData: InsertDrinkType): Promise<DrinkType> {
  return apiRequest<DrinkType>(`${API_BASE}/drink-types`, {
    method: 'POST',
    body: JSON.stringify(drinkTypeData),
  });
}

export async function updateDrinkType(id: number, drinkTypeData: Partial<InsertDrinkType>): Promise<DrinkType> {
  if (isNaN(id)) throw new Error('Invalid drink type ID');
  return apiRequest<DrinkType>(`${API_BASE}/drink-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(drinkTypeData),
  });
}

export async function deleteDrinkType(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid drink type ID');
  await apiRequest<null>(`${API_BASE}/drink-types/${id}`, { method: 'DELETE' });
}

// Hook
export function useDrinkTypes() {
  return useApiData(() => getAllDrinkTypes(), []);
}

// ================================
// CUSTOMER TAGS
// ================================
export async function getAllCustomerTags(customerId?: number): Promise<CustomerTag[]> {
  const params = buildQueryParams({ customerId });
  const url = params ? `${API_BASE}/customer-tags?${params}` : `${API_BASE}/customer-tags`;
  return apiRequest<CustomerTag[]>(url, { method: 'GET' });
}

export async function createCustomerTag(tagData: InsertCustomerTag): Promise<CustomerTag> {
  return apiRequest<CustomerTag>(`${API_BASE}/customer-tags`, {
    method: 'POST',
    body: JSON.stringify(tagData),
  });
}

export async function deleteCustomerTag(customerId: number, tag: string): Promise<void> {
  await apiRequest<null>(`${API_BASE}/customer-tags/${customerId}/${tag}`, { method: 'DELETE' });
}

// Hook
export function useCustomerTags(customerId?: number) {
  return useApiData(() => getAllCustomerTags(customerId), [customerId]);
}

// ================================
// PROMOTIONS
// ================================
export async function getAllPromotions(filters?: { eventId?: number; clubId?: number; status?: string }): Promise<Promotion[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.eventId !== undefined && { eventId: filters.eventId }),
    ...(filters?.clubId !== undefined && { clubId: filters.clubId }),
  });
  const url = params ? `${API_BASE}/promotions?${params}` : `${API_BASE}/promotions`;
  return apiRequest<Promotion[]>(url, { method: 'GET' });
}

export async function getPromotionById(id: number): Promise<Promotion> {
  if (isNaN(id)) throw new Error('Invalid promotion ID');
  return apiRequest<Promotion>(`${API_BASE}/promotions/${id}`, { method: 'GET' });
}

export async function createPromotion(promotionData: InsertPromotion): Promise<Promotion> {
  insertPromotionSchema.parse(promotionData);
  return apiRequest<Promotion>(`${API_BASE}/promotions`, {
    method: 'POST',
    body: JSON.stringify(promotionData),
  });
}

export async function updatePromotion(id: number, promotionData: Partial<InsertPromotion>): Promise<Promotion> {
  if (isNaN(id)) throw new Error('Invalid promotion ID');
  return apiRequest<Promotion>(`${API_BASE}/promotions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(promotionData),
  });
}

export async function deletePromotion(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid promotion ID');
  await apiRequest<null>(`${API_BASE}/promotions/${id}`, { method: 'DELETE' });
}

// Hook
export function usePromotions(filters?: { eventId?: number; clubId?: number; status?: string }) {
  return useApiData(() => getAllPromotions(filters), [JSON.stringify(filters)]);
}

// ================================
// PAYMENT METHODS
// ================================
export async function getAllPaymentMethods(userId?: number): Promise<PaymentMethod[]> {
  const params = buildQueryParams({ userId });
  const url = params ? `${API_BASE}/payment-methods?${params}` : `${API_BASE}/payment-methods`;
  return apiRequest<PaymentMethod[]>(url, { method: 'GET' });
}

export async function getPaymentMethodById(id: number): Promise<PaymentMethod> {
  if (isNaN(id)) throw new Error('Invalid payment method ID');
  return apiRequest<PaymentMethod>(`${API_BASE}/payment-methods/${id}`, { method: 'GET' });
}

export async function createPaymentMethod(methodData: InsertPaymentMethod): Promise<PaymentMethod> {
  insertPaymentMethodSchema.parse(methodData);
  return apiRequest<PaymentMethod>(`${API_BASE}/payment-methods`, {
    method: 'POST',
    body: JSON.stringify(methodData),
  });
}

export async function updatePaymentMethod(id: number, methodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
  if (isNaN(id)) throw new Error('Invalid payment method ID');
  return apiRequest<PaymentMethod>(`${API_BASE}/payment-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(methodData),
  });
}

export async function deletePaymentMethod(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid payment method ID');
  await apiRequest<null>(`${API_BASE}/payment-methods/${id}`, { method: 'DELETE' });
}

// Hook
export function usePaymentMethods(userId?: number) {
  return useApiData(() => getAllPaymentMethods(userId), [userId]);
}

// ================================
// INVOICES
// ================================
export async function getAllInvoices(userId?: number): Promise<Invoice[]> {
  const params = buildQueryParams({ userId });
  const url = params ? `${API_BASE}/invoices?${params}` : `${API_BASE}/invoices`;
  return apiRequest<Invoice[]>(url, { method: 'GET' });
}

export async function getInvoiceById(id: number): Promise<Invoice> {
  if (isNaN(id)) throw new Error('Invalid invoice ID');
  return apiRequest<Invoice>(`${API_BASE}/invoices/${id}`, { method: 'GET' });
}

export async function createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
  insertInvoiceSchema.parse(invoiceData);
  return apiRequest<Invoice>(`${API_BASE}/invoices`, {
    method: 'POST',
    body: JSON.stringify(invoiceData),
  });
}

export async function updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
  if (isNaN(id)) throw new Error('Invalid invoice ID');
  return apiRequest<Invoice>(`${API_BASE}/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invoiceData),
  });
}

export async function deleteInvoice(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid invoice ID');
  await apiRequest<null>(`${API_BASE}/invoices/${id}`, { method: 'DELETE' });
}

// Hook
export function useInvoices(userId?: number) {
  return useApiData(() => getAllInvoices(userId), [userId]);
}

// ================================
// EMPLOYEES (POS)
// ================================
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

// Hook
export function useEmployees() {
  return useApiData(() => getAllEmployees(), []);
}

// ================================
// POS DEVICES
// ================================
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

// Hook
export function usePosDevices(isActive?: boolean) {
  return useApiData(() => getAllPosDevices({ isActive }), [isActive]);
}

// ================================
// PRODUCT CATEGORIES
// ================================
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

// Hook
export function useProductCategories() {
  return useApiData(() => getAllProductCategories(), []);
}

// ================================
// PRODUCTS
// ================================
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

// Hook
export function useProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }) {
  return useApiData(() => getAllProducts(filters), [JSON.stringify(filters)]);
}

// ================================
// POS TABLES
// ================================
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

// Hook
export function usePosTables(isOccupied?: boolean) {
  return useApiData(() => getAllPosTables({ isOccupied }), [isOccupied]);
}

// ================================
// ORDERS
// ================================
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

// Hook
export function useOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllOrders(filters), [JSON.stringify(filters)]);
}

// ================================
// ORDER ITEMS
// ================================
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

// Hook
export function useOrderItems(orderId?: number) {
  return useApiData(() => getAllOrderItems({ orderId }), [orderId]);
}

// ================================
// POS HISTORY
// ================================
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

// Hook
export function usePosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllPosHistory(filters), [JSON.stringify(filters)]);
}

// ================================
// POS PAYMENT METHODS
// ================================
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

// Hook
export function usePosPaymentMethods() {
  return useApiData(() => getAllPosPaymentMethods(), []);
}

// ================================
// FILE UPLOAD
// ================================

// Upload un seul fichier
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `Upload failed: ${response.status}`);
  }

  return response.json();
}

// Upload multiple fichiers
export async function uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE}/uploads/multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `Upload failed: ${response.status}`);
  }

  return response.json();
}

// Récupérer la liste des fichiers
export async function getAllUploads(): Promise<FileInfo[]> {
  return apiRequest<FileInfo[]>(`${API_BASE}/uploads`, { method: 'GET' });
}

// Récupérer un fichier spécifique (retourne l'URL)
export function getFileUrl(filename: string): string {
  return `${API_BASE}/uploads/${filename}`;
}

// Supprimer un fichier
export async function deleteFile(filename: string): Promise<void> {
  await apiRequest<null>(`${API_BASE}/uploads/${filename}`, { method: 'DELETE' });
}

// Télécharger un fichier (pour les fichiers binaires)
export async function downloadFile(filename: string): Promise<Blob> {
  const response = await fetch(getFileUrl(filename));
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }
  return response.blob();
}

// Hook pour les uploads
export function useUploads() {
  return useApiData(() => getAllUploads(), []);
}

// ================================
// ARTIST INVITATIONS
// ================================

export async function getAllArtistInvitations(filters?: { 
  artistId?: number; 
  eventId?: number; 
  status?: string 
}): Promise<Invitation[]> {
  const params = buildQueryParams(filters || {});
  const url = params ? `${API_BASE}/invitations?${params}` : `${API_BASE}/invitations`;
  return apiRequest<Invitation[]>(url, { method: 'GET' });
}

export async function createArtistInvitation(invitationData: InsertInvitation): Promise<Invitation> {
  insertInvitationSchema.parse(invitationData);
  return apiRequest<Invitation>(`${API_BASE}/invitations`, {
    method: 'POST',
    body: JSON.stringify(invitationData),
  });
}

export async function updateArtistInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
  if (isNaN(id)) throw new Error('Invalid invitation ID');
  return apiRequest<Invitation>(`${API_BASE}/invitations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invitationData),
  });
}

export async function deleteArtistInvitation(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid invitation ID');
  await apiRequest<null>(`${API_BASE}/invitations/${id}`, { method: 'DELETE' });
}

// Hook
export function useArtistInvitations(filters?: { artistId?: number; eventId?: number; status?: string }) {
  return useApiData(() => getAllArtistInvitations(filters), [JSON.stringify(filters)]);
}

// ================================
// GENERIC REACT HOOK
// ================================
export function useApiData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}
