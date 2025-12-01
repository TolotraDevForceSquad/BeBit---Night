// client\src\services\artist-api.ts
import { Artist, InsertArtist, ArtistPortfolio, InsertArtistPortfolio, insertArtistSchema, insertArtistPortfolioSchema } from '@shared/schema';
import { apiRequest, buildQueryParams, API_BASE, useApiData } from './utils';

export async function getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]> {
  const params = buildQueryParams({
    ...filters,
    ...(filters?.minRate !== undefined && { minRate: filters.minRate }),
    ...(filters?.maxRate !== undefined && { maxRate: filters.maxRate }),
    ...(filters?.minPopularity !== undefined && { minPopularity: filters.minPopularity }),
  });
  const url = params ? `${API_BASE}/artists?${params}` : `${API_BASE}/artists`;
  return apiRequest<Artist[]>(url, { method: 'GET' });
}

export async function getArtistById(id: number): Promise<Artist> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  return apiRequest<Artist>(`${API_BASE}/artists/${id}`, { method: 'GET' });
}

export async function getArtistByUserId(userId: number): Promise<Artist> {
  if (isNaN(userId)) throw new Error('Invalid user ID');
  return apiRequest<Artist>(`${API_BASE}/artists/user/${userId}`, { method: 'GET' });
}

export async function createArtist(artistData: InsertArtist): Promise<Artist> {
  insertArtistSchema.parse(artistData);
  return apiRequest<Artist>(`${API_BASE}/artists`, {
    method: 'POST',
    body: JSON.stringify(artistData),
  });
}

export async function updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  return apiRequest<Artist>(`${API_BASE}/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artistData),
  });
}

export async function deleteArtist(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid artist ID');
  await apiRequest<null>(`${API_BASE}/artists/${id}`, { method: 'DELETE' });
}

export function useArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }) {
  return useApiData(() => getAllArtists(filters), [JSON.stringify(filters)]);
}

export async function getAllArtistPortfolios(filters?: { artistId?: number }): Promise<ArtistPortfolio[]> {
  const params = buildQueryParams(filters || {});
  const url = params ? `${API_BASE}/artist-portfolios?${params}` : `${API_BASE}/artist-portfolios`;
  return apiRequest<ArtistPortfolio[]>(url, { method: 'GET' });
}

export async function getArtistPortfolioById(id: number): Promise<ArtistPortfolio> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios/${id}`, { method: 'GET' });
}

export async function getArtistPortfoliosByArtistId(artistId: number): Promise<ArtistPortfolio[]> {
  if (isNaN(artistId)) throw new Error('Invalid artist ID');
  return apiRequest<ArtistPortfolio[]>(`${API_BASE}/artist-portfolios/artist/${artistId}`, { method: 'GET' });
}

export async function createArtistPortfolio(portfolioData: InsertArtistPortfolio): Promise<ArtistPortfolio> {
  insertArtistPortfolioSchema.parse(portfolioData);
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios`, {
    method: 'POST',
    body: JSON.stringify(portfolioData),
  });
}

export async function updateArtistPortfolio(id: number, portfolioData: Partial<InsertArtistPortfolio>): Promise<ArtistPortfolio> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  return apiRequest<ArtistPortfolio>(`${API_BASE}/artist-portfolios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(portfolioData),
  });
}

export async function deleteArtistPortfolio(id: number): Promise<void> {
  if (isNaN(id)) throw new Error('Invalid portfolio ID');
  await apiRequest<null>(`${API_BASE}/artist-portfolios/${id}`, { method: 'DELETE' });
}

export function useArtistPortfolios(artistId?: number) {
  return useApiData(() => getAllArtistPortfolios({ artistId }), [artistId]);
}