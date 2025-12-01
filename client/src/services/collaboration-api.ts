// client\src\services\collaboration-api.ts
import { CollaborationMilestone, InsertCollaborationMilestone, CollaborationMessage, InsertCollaborationMessage, insertCollaborationMilestoneSchema, insertCollaborationMessageSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

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

export function useCollaborationMilestones(invitationId?: number) {
  return useApiData(() => getAllCollaborationMilestones({ invitationId }), [invitationId]);
}

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

export function useCollaborationMessages(invitationId?: number) {
  return useApiData(() => getAllCollaborationMessages(invitationId), [invitationId]);
}