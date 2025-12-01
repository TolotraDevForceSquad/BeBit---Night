// client\src\services\ticket-api.ts
import { Ticket, InsertTicket, TicketType, InsertTicketType, insertTicketSchema, insertTicketTypeSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useTicketTypes(eventId?: number) {
  return useApiData(() => getAllTicketTypes(eventId), [eventId]);
}