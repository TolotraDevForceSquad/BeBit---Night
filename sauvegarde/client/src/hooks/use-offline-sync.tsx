import { useState, useEffect, useCallback } from 'react';
import { connectionService } from '../lib/connection-service';
import { syncService } from '../lib/sync-service';
import { indexedDBService } from '../lib/indexed-db-service';

/**
 * Hook pour gérer la synchronisation hors ligne/en ligne
 * Fournit des informations sur l'état de connexion, de synchronisation
 * et des méthodes pour manipuler les données localement
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(connectionService.getConnectionStatus());
  const [syncStatus, setSyncStatus] = useState(syncService.getSyncStatus());
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(syncService.getLastSyncTime());

  // Mettre à jour l'état de connexion quand il change
  useEffect(() => {
    const unsubscribe = connectionService.addListener((online) => {
      setIsOnline(online);
    });
    return unsubscribe;
  }, []);

  // Mettre à jour l'état de synchronisation quand il change
  useEffect(() => {
    const unsubscribe = syncService.addListener((status) => {
      setSyncStatus(status);
      setLastSyncTime(syncService.getLastSyncTime());
    });
    return unsubscribe;
  }, []);

  // Compter les changements en attente
  const updatePendingChanges = useCallback(async () => {
    const queue = await indexedDBService.getSyncQueue();
    setPendingChanges(queue.length);
  }, []);

  // Mettre à jour le nombre de changements en attente périodiquement
  useEffect(() => {
    updatePendingChanges();
    const interval = setInterval(updatePendingChanges, 5000);
    return () => clearInterval(interval);
  }, [updatePendingChanges]);

  // Forcer une synchronisation
  const syncNow = useCallback(() => {
    syncService.sync();
  }, []);

  // Sauvegarder un ticket en local + file de synchronisation
  const saveTicket = useCallback(async (ticket: any) => {
    await syncService.saveTicket(ticket);
    updatePendingChanges();
  }, [updatePendingChanges]);

  // Sauvegarder un événement en local + file de synchronisation
  const saveEvent = useCallback(async (event: any) => {
    await syncService.saveEvent(event);
    updatePendingChanges();
  }, [updatePendingChanges]);

  // Sauvegarder un type de ticket en local + file de synchronisation
  const saveTicketType = useCallback(async (ticketType: any) => {
    await syncService.saveTicketType(ticketType);
    updatePendingChanges();
  }, [updatePendingChanges]);

  // Obtenir tous les événements depuis le stockage local
  const getEvents = useCallback(async () => {
    return indexedDBService.getAll('events');
  }, []);

  // Obtenir un événement depuis le stockage local
  const getEvent = useCallback(async (id: number) => {
    return indexedDBService.get('events', id);
  }, []);

  // Obtenir tous les tickets d'un événement depuis le stockage local
  const getTicketsByEvent = useCallback(async (eventId: number) => {
    return indexedDBService.getTicketsByEvent(eventId);
  }, []);

  // Obtenir tous les types de tickets d'un événement depuis le stockage local
  const getTicketTypesByEvent = useCallback(async (eventId: number) => {
    return indexedDBService.getTicketTypesByEvent(eventId);
  }, []);

  // Charger les données initiales
  const loadInitialData = useCallback(async () => {
    await syncService.loadInitialData();
    updatePendingChanges();
  }, [updatePendingChanges]);

  // Formater le temps écoulé depuis la dernière synchronisation
  const formatLastSyncTime = useCallback(() => {
    if (lastSyncTime === 0) {
      return 'Jamais';
    }

    const now = Date.now();
    const diff = now - lastSyncTime;
    
    // Moins d'une minute
    if (diff < 60000) {
      return 'À l\'instant';
    }
    
    // Moins d'une heure
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    // Moins d'un jour
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    // Plus d'un jour
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }, [lastSyncTime]);

  return {
    isOnline,
    syncStatus,
    pendingChanges,
    lastSyncTime,
    syncNow,
    saveTicket,
    saveEvent,
    saveTicketType,
    getEvents,
    getEvent,
    getTicketsByEvent,
    getTicketTypesByEvent,
    loadInitialData,
    formatLastSyncTime,
  };
}