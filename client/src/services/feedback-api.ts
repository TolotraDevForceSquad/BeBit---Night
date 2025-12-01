// client\src\services\feedback-api.ts
import { Feedback, InsertFeedback, FeedbackLike, InsertFeedbackLike, FeedbackComment, InsertFeedbackComment, insertFeedbackSchema, insertFeedbackLikeSchema, insertFeedbackCommentSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

export async function getAllFeedback(filters?: { sourceType?: string; sourceId?: number }): Promise<Feedback[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.sourceId !== undefined && { sourceId: filters.sourceId }),
  });
  const url = params ? `${API_BASE}/feedback?${params}` : `${API_BASE}/feedback`;
  return apiRequest<Feedback[]>(url, { method: 'GET' });
}

export async function getFeedbackById(id: number): Promise<Feedback> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  return apiRequest<Feedback>(`${API_BASE}/feedback/${id}`, { method: 'GET' });
}

export async function createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
  insertFeedbackSchema.parse(feedbackData);
  return apiRequest<Feedback>(`${API_BASE}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });
}

export async function updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  return apiRequest<Feedback>(`${API_BASE}/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(feedbackData),
  });
}

export async function deleteFeedback(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid feedback ID');
  await apiRequest<null>(`${API_BASE}/feedback/${id}`, { method: 'DELETE' });
}

export function useFeedback(filters?: { sourceType?: string; sourceId?: number }) {
  return useApiData(() => getAllFeedback(filters), [JSON.stringify(filters)]);
}

export async function createFeedbackLike(likeData: InsertFeedbackLike): Promise<FeedbackLike> {
  insertFeedbackLikeSchema.parse(likeData);
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes`, {
    method: 'POST',
    body: JSON.stringify(likeData),
  });
}

export async function deleteFeedbackLike(feedbackId: number, userId: number): Promise<void> {
  await apiRequest<null>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, { method: 'DELETE' });
}

export async function getAllFeedbackLikes(filters?: { feedbackId?: number; userId?: number }): Promise<FeedbackLike[]> {
  const params = buildQueryParams(filters ?? {});
  const url = params ? `${API_BASE}/feedback-likes?${params}` : `${API_BASE}/feedback-likes`;
  return apiRequest<FeedbackLike[]>(url, { method: 'GET' });
}

export async function getFeedbackLike(feedbackId: number, userId: number): Promise<FeedbackLike> {
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, { method: 'GET' });
}

export async function updateFeedbackLike(feedbackId: number, userId: number, data: Partial<InsertFeedbackLike>): Promise<FeedbackLike> {
  return apiRequest<FeedbackLike>(`${API_BASE}/feedback-likes/${feedbackId}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function useFeedbackLikes(filters?: { feedbackId?: number; userId?: number }) {
  return useApiData(
    () => getAllFeedbackLikes(filters),
    [JSON.stringify(filters)]
  );
}

export async function getAllFeedbackComments(feedbackId?: number): Promise<FeedbackComment[]> {
  const params = buildQueryParams({ feedbackId });
  const url = params ? `${API_BASE}/feedback-comments?${params}` : `${API_BASE}/feedback-comments`;
  return apiRequest<FeedbackComment[]>(url, { method: 'GET' });
}

export async function createFeedbackComment(commentData: InsertFeedbackComment): Promise<FeedbackComment> {
  insertFeedbackCommentSchema.parse(commentData);
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export async function updateFeedbackComment(id: number, commentData: Partial<InsertFeedbackComment>): Promise<FeedbackComment> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(commentData),
  });
}

export async function deleteFeedbackComment(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  await apiRequest<null>(`${API_BASE}/feedback-comments/${id}`, { method: 'DELETE' });
}

export async function getFeedbackComment(id: number): Promise<FeedbackComment> {
  return apiRequest<FeedbackComment>(`${API_BASE}/feedback-comments/${id}`, { method: 'GET' });
}

export function useFeedbackComments(feedbackId?: number) {
  return useApiData(() => getAllFeedbackComments(feedbackId), [feedbackId]);
}