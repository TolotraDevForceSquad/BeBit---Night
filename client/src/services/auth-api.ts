// client\src\services\auth-api.ts
import { User, InsertUser, insertUserSchema } from '@shared/schema';
import { apiRequest, API_BASE } from './utils';

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
