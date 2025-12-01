// client\src\services\customer-api.ts
import { CustomerProfile, InsertCustomerProfile, MusicGenre, InsertMusicGenre, DrinkType, InsertDrinkType, CustomerTag, InsertCustomerTag, insertCustomerProfileSchema, insertMusicGenreSchema, insertDrinkTypeSchema, insertCustomerTagSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useCustomerProfiles(userId?: number) {
  return useApiData(() => getAllCustomerProfiles(userId), [userId]);
}

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

export function useMusicGenres() {
  return useApiData(() => getAllMusicGenres(), []);
}

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

export function useDrinkTypes() {
  return useApiData(() => getAllDrinkTypes(), []);
}

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

export function useCustomerTags(customerId?: number) {
  return useApiData(() => getAllCustomerTags(customerId), [customerId]);
}