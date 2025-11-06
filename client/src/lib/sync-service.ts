/**
 * Service de synchronisation
 * Permet de synchroniser les données locales avec le serveur
 * lorsque la connexion est rétablie
 */

import { connectionService } from './connection-service';
import { indexedDBService } from './indexed-db-service';
import { apiRequest } from './queryClient';

type SyncStatusListener = (status: 'idle' | 'syncing' | 'error') => void;

class SyncService {
  private syncStatus: 'idle' | 'syncing' | 'error' = 'idle';
  private listeners: SyncStatusListener[] = [];
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private lastSyncTime: number = 0;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // S'abonner aux changements de connexion
    connectionService.addListener(this.handleConnectionChange);

    // Tenter de synchroniser toutes les minutes
    this.syncInterval = setInterval(() => {
      this.syncIfNeeded();
    }, 60000);

    // Tenter une synchronisation au démarrage
    this.syncIfNeeded();
  }

  private handleConnectionChange = (online: boolean) => {
    if (online) {
      // Si la connexion est rétablie, lancer une synchronisation
      this.sync();
    }
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  private async syncIfNeeded() {
    // Vérifier s'il y a des éléments à synchroniser et si on est en ligne
    if (!connectionService.getConnectionStatus()) {
      return;
    }

    const queue = await indexedDBService.getSyncQueue();
    if (queue.length > 0) {
      this.sync();
    }
  }

  public async sync(): Promise<void> {
    // Ne pas lancer plusieurs synchronisations simultanément
    if (this.syncStatus === 'syncing') {
      return;
    }

    // Vérifier si on est en ligne
    if (!connectionService.getConnectionStatus()) {
      return;
    }

    try {
      this.syncStatus = 'syncing';
      this.notifyListeners();

      const queue = await indexedDBService.getSyncQueue();
      
      // Si la file est vide, rien à synchroniser
      if (queue.length === 0) {
        this.syncStatus = 'idle';
        this.notifyListeners();
        this.lastSyncTime = Date.now();
        return;
      }

      // Synchroniser chaque élément un par un
      for (const item of queue) {
        await this.processSyncItem(item);
      }

      // Mettre à jour le statut
      this.syncStatus = 'idle';
      this.lastSyncTime = Date.now();
      this.notifyListeners();
    } catch (error) {
      console.error('Error during synchronization:', error);
      this.syncStatus = 'error';
      this.notifyListeners();
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    try {
      // Déterminer l'endpoint en fonction du store
      const endpoint = this.getEndpointForStore(item.store);
      
      // Effectuer l'action appropriée
      switch (item.action) {
        case 'create':
          await apiRequest('POST', endpoint, item.data);
          break;
        case 'update':
          await apiRequest('PUT', `${endpoint}/${item.data.id}`, item.data);
          break;
        case 'delete':
          await apiRequest('DELETE', `${endpoint}/${item.data.id}`);
          break;
      }

      // Supprimer l'élément de la file après synchronisation réussie
      await indexedDBService.removeSyncItem(item.id);
    } catch (error) {
      console.error(`Error processing sync item ${item.id}:`, error);
      throw error;
    }
  }

  private getEndpointForStore(store: string): string {
    switch (store) {
      case 'tickets':
        return '/api/tickets';
      case 'events':
        return '/api/events';
      case 'ticketTypes':
        return '/api/ticket-types';
      default:
        throw new Error(`Unknown store: ${store}`);
    }
  }

  public getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  public getSyncStatus(): 'idle' | 'syncing' | 'error' {
    return this.syncStatus;
  }

  public addListener(callback: SyncStatusListener): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  public async saveTicket(ticket: any): Promise<void> {
    // Sauvegarder localement
    await indexedDBService.put('tickets', ticket);
    
    // Ajouter à la file de synchronisation
    await indexedDBService.addToSyncQueue(
      ticket.id ? 'update' : 'create',
      'tickets',
      ticket
    );
    
    // Tenter une synchronisation si en ligne
    this.syncIfNeeded();
  }

  public async saveEvent(event: any): Promise<void> {
    // Sauvegarder localement
    await indexedDBService.put('events', event);
    
    // Ajouter à la file de synchronisation
    await indexedDBService.addToSyncQueue(
      event.id ? 'update' : 'create',
      'events',
      event
    );
    
    // Tenter une synchronisation si en ligne
    this.syncIfNeeded();
  }

  public async saveTicketType(ticketType: any): Promise<void> {
    // Sauvegarder localement
    await indexedDBService.put('ticketTypes', ticketType);
    
    // Ajouter à la file de synchronisation
    await indexedDBService.addToSyncQueue(
      ticketType.id ? 'update' : 'create',
      'ticketTypes',
      ticketType
    );
    
    // Tenter une synchronisation si en ligne
    this.syncIfNeeded();
  }

  // Méthode pour charger les données initiales depuis le serveur
  public async loadInitialData(): Promise<void> {
    if (!connectionService.getConnectionStatus()) {
      return;
    }

    try {
      // Charger les événements
      const eventsResponse = await apiRequest('GET', '/api/events');
      const events = await eventsResponse.json();
      
      // Sauvegarder localement
      for (const event of events) {
        await indexedDBService.put('events', event);
      }

      // Charger les types de tickets
      const ticketTypesResponse = await apiRequest('GET', '/api/ticket-types');
      const ticketTypes = await ticketTypesResponse.json();
      
      // Sauvegarder localement
      for (const ticketType of ticketTypes) {
        await indexedDBService.put('ticketTypes', ticketType);
      }

      // Charger les tickets
      const ticketsResponse = await apiRequest('GET', '/api/tickets');
      const tickets = await ticketsResponse.json();
      
      // Sauvegarder localement
      for (const ticket of tickets) {
        await indexedDBService.put('tickets', ticket);
      }

      this.lastSyncTime = Date.now();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
}

export const syncService = new SyncService();