// client\src\services\club-api.ts
import { Club, InsertClub, ClubLocation, InsertClubLocation, ClubTable, InsertClubTable, insertClubSchema, insertClubLocationSchema, insertClubTableSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useClubs(filters?: { city?: string; country?: string; category?: string; featured?: boolean }) {
  return useApiData(() => getAllClubs(filters), [JSON.stringify(filters)]);
}

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

export function useClubLocations(clubId?: number) {
  return useApiData(() => getAllClubLocations({ clubId }), [clubId]);
}

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

export function useClubTables(filters?: { clubId?: number; available?: boolean }) {
  return useApiData(() => getAllClubTables(filters), [JSON.stringify(filters)]);
}