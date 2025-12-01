// client\src\services\invitation-api.ts
import { Invitation, InsertInvitation, insertInvitationSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useInvitations(filters?: { eventId?: number; userId?: number; status?: string }) {
  return useApiData(() => getAllInvitations(filters), [JSON.stringify(filters)]);
}

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

export function useArtistInvitations(filters?: { artistId?: number; eventId?: number; status?: string }) {
  return useApiData(() => getAllArtistInvitations(filters), [JSON.stringify(filters)]);
}