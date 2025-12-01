// client\src\services\user-api.ts
import { User, InsertUser, insertUserSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }) {
  return useApiData(() => getAllUsers(filters), [JSON.stringify(filters)]);
}