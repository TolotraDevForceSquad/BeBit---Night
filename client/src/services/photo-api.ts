// client\src\services\photo-api.ts
import { Photo, InsertPhoto, PhotoLike, InsertPhotoLike, PhotoComment, InsertPhotoComment, insertPhotoSchema, insertPhotoLikeSchema, insertPhotoCommentSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

export async function getAllPhotos(filters?: { userId?: number; eventId?: number }): Promise<Photo[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.userId !== undefined && { userId: filters.userId }),
    ...(filters?.eventId !== undefined && { eventId: filters.eventId }),
  });
  const url = params ? `${API_BASE}/photos?${params}` : `${API_BASE}/photos`;
  return apiRequest<Photo[]>(url, { method: 'GET' });
}

export async function getPhotoById(id: number): Promise<Photo> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  return apiRequest<Photo>(`${API_BASE}/photos/${id}`, { method: 'GET' });
}

export async function createPhoto(photoData: InsertPhoto): Promise<Photo> {
  insertPhotoSchema.parse(photoData);
  return apiRequest<Photo>(`${API_BASE}/photos`, {
    method: 'POST',
    body: JSON.stringify(photoData),
  });
}

export async function updatePhoto(id: number, photoData: Partial<InsertPhoto>): Promise<Photo> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  return apiRequest<Photo>(`${API_BASE}/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(photoData),
  });
}

export async function deletePhoto(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid photo ID');
  await apiRequest<null>(`${API_BASE}/photos/${id}`, { method: 'DELETE' });
}

export function usePhotos(filters?: { userId?: number; eventId?: number }) {
  return useApiData(() => getAllPhotos(filters), [JSON.stringify(filters)]);
}

export async function createPhotoLike(likeData: InsertPhotoLike): Promise<PhotoLike> {
  insertPhotoLikeSchema.parse(likeData);
  return apiRequest<PhotoLike>(`${API_BASE}/photo-likes`, {
    method: 'POST',
    body: JSON.stringify(likeData),
  });
}

export async function deletePhotoLike(photoId: number, userId: number): Promise<void> {
  await apiRequest<null>(`${API_BASE}/photo-likes/${photoId}/${userId}`, { method: 'DELETE' });
}

export async function getAllPhotoComments(photoId?: number): Promise<PhotoComment[]> {
  const params = buildQueryParams({ photoId });
  const url = params ? `${API_BASE}/photo-comments?${params}` : `${API_BASE}/photo-comments`;
  return apiRequest<PhotoComment[]>(url, { method: 'GET' });
}

export async function createPhotoComment(commentData: InsertPhotoComment): Promise<PhotoComment> {
  insertPhotoCommentSchema.parse(commentData);
  return apiRequest<PhotoComment>(`${API_BASE}/photo-comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export async function updatePhotoComment(id: number, commentData: Partial<InsertPhotoComment>): Promise<PhotoComment> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  return apiRequest<PhotoComment>(`${API_BASE}/photo-comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(commentData),
  });
}

export async function deletePhotoComment(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid comment ID');
  await apiRequest<null>(`${API_BASE}/photo-comments/${id}`, { method: 'DELETE' });
}

export function usePhotoComments(photoId?: number) {
  return useApiData(() => getAllPhotoComments(photoId), [photoId]);
}