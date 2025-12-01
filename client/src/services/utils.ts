// client\src\services\utils.ts
import { useState, useEffect } from 'react';

// Utility: Build query params
export function buildQueryParams(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  return params.toString();
}

// Utility: Handle fetch with error parsing
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Generic React Hook
export function useApiData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}

export const API_BASE = '/api';