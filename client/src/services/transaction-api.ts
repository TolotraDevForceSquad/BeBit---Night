// client\src\services\transaction-api.ts
import { Transaction, InsertTransaction, insertTransactionSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useTransactions(userId?: number) {
  return useApiData(() => getAllTransactions({ userId }), [userId]);
}