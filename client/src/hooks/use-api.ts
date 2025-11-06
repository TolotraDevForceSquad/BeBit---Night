// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import * as services from '../services/api';

export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promise;
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

// Hooks spécifiques
export const useUsers = (filters?: services.ListParams) => {
  const [users, setUsers] = useState<any[]>([]);
  const { loading, error, execute } = useApi<any[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      await execute(services.userService.getAll(filters));
    };
    fetchUsers();
  }, [execute, JSON.stringify(filters)]);

  return { data: users, loading, error };
};

export const useEvents = (filters?: services.ListParams) => {
  const [events, setEvents] = useState<any[]>([]);
  const { loading, error, execute } = useApi<any[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await execute(services.eventService.getAll(filters));
      setEvents(result || []);
    };
    fetchEvents();
  }, [execute, JSON.stringify(filters)]);

  return { data: events, loading, error };
};

// Hook pour les opérations CRUD
export const useCrud = <T>(service: any) => {
  const [item, setItem] = useState<T | null>(null);
  const [items, setItems] = useState<T[]>([]);
  const { loading, error, execute } = useApi<any>();

  const getAll = useCallback(async (filters?: services.ListParams) => {
    const result = await execute(service.getAll(filters));
    setItems(result || []);
    return result;
  }, [execute, service]);

  const getById = useCallback(async (id: number) => {
    const result = await execute(service.getById(id));
    setItem(result);
    return result;
  }, [execute, service]);

  const create = useCallback(async (data: any) => {
    const result = await execute(service.create(data));
    setItems(prev => [...prev, result]);
    return result;
  }, [execute, service]);

  const update = useCallback(async (id: number, data: any) => {
    const result = await execute(service.update(id, data));
    setItems(prev => prev.map(item => item.id === id ? result : item));
    setItem(result);
    return result;
  }, [execute, service]);

  const remove = useCallback(async (id: number) => {
    await execute(service.delete(id));
    setItems(prev => prev.filter(item => item.id !== id));
    if (item?.id === id) setItem(null);
  }, [execute, service, item]);

  return {
    item,
    items,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove
  };
};