// client\src\services\file-api.ts
import { apiRequest, API_BASE, useApiData } from './utils';
import { FileInfo, UploadResponse, MultipleUploadResponse } from './servapi';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `Upload failed: ${response.status}`);
  }

  return response.json();
}

export async function uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE}/uploads/multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `Upload failed: ${response.status}`);
  }

  return response.json();
}

export async function getAllUploads(): Promise<FileInfo[]> {
  return apiRequest<FileInfo[]>(`${API_BASE}/uploads`, { method: 'GET' });
}

export function getFileUrl(filename: string): string {
  return `${API_BASE}/uploads/${filename}`;
}

export async function deleteFile(filename: string): Promise<void> {
  await apiRequest<null>(`${API_BASE}/uploads/${filename}`, { method: 'DELETE' });
}

export async function downloadFile(filename: string): Promise<Blob> {
  const response = await fetch(getFileUrl(filename));
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }
  return response.blob();
}

export function useUploads() {
  return useApiData(() => getAllUploads(), []);
}