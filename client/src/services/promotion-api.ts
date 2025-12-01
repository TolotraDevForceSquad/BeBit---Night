// client\src\services\promotion-api.ts
import { Promotion, InsertPromotion, PaymentMethod, InsertPaymentMethod, Invoice, InsertInvoice, insertPromotionSchema, insertPaymentMethodSchema, insertInvoiceSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function usePromotions(filters?: { eventId?: number; clubId?: number; status?: string }) {
  return useApiData(() => getAllPromotions(filters), [JSON.stringify(filters)]);
}

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

export function usePaymentMethods(userId?: number) {
  return useApiData(() => getAllPaymentMethods(userId), [userId]);
}

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

export function useInvoices(userId?: number) {
  return useApiData(() => getAllInvoices(userId), [userId]);
}