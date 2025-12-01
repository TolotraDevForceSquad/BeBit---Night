// client\src\services\event-api.ts
import { Event, InsertEvent, EventArtist, InsertEventArtist, EventReservedTable, InsertEventReservedTable, EventParticipant, InsertEventParticipant, insertEventSchema, insertEventArtistSchema, insertEventReservedTableSchema, insertEventParticipantSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useEvents(filters?: { clubId?: number; city?: string; country?: string; status?: string; startDate?: string; endDate?: string }) {
  return useApiData(() => getAllEvents(filters), [JSON.stringify(filters)]);
}

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