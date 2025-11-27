/**
 * Service de stockage local avec IndexedDB
 * Permet de stocker et récupérer des données localement
 * pour un fonctionnement hors ligne
 */

import { openDB, IDBPDatabase } from 'idb';

// Nom de la base de données
const DB_NAME = 'be-bit-offline-db';
// Version de la base de données
const DB_VERSION = 1;

// Nom des stores
const STORES = {
  TICKETS: 'tickets',
  EVENTS: 'events',
  TICKET_TYPES: 'ticketTypes',
  SYNC_QUEUE: 'syncQueue',
  SETTINGS: 'settings',
};

// Structure de la base de données
interface OfflineDB {
  tickets: {
    key: string;
    value: any;
    indexes: { 'by-event': string };
  };
  events: {
    key: number;
    value: any;
  };
  ticketTypes: {
    key: number;
    value: any;
    indexes: { 'by-event': number };
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      timestamp: number;
      action: 'create' | 'update' | 'delete';
      store: string;
      data: any;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<OfflineDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<OfflineDB>> {
    return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Création du store pour les tickets
        if (!db.objectStoreNames.contains(STORES.TICKETS)) {
          const ticketsStore = db.createObjectStore(STORES.TICKETS, { keyPath: 'id' });
          ticketsStore.createIndex('by-event', 'eventId');
        }

        // Création du store pour les événements
        if (!db.objectStoreNames.contains(STORES.EVENTS)) {
          db.createObjectStore(STORES.EVENTS, { keyPath: 'id' });
        }

        // Création du store pour les types de tickets
        if (!db.objectStoreNames.contains(STORES.TICKET_TYPES)) {
          const ticketTypesStore = db.createObjectStore(STORES.TICKET_TYPES, { keyPath: 'id' });
          ticketTypesStore.createIndex('by-event', 'eventId');
        }

        // Création du store pour la file de synchronisation
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
        }

        // Création du store pour les paramètres
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }
      },
    });
  }

  // Méthodes génériques pour manipuler les données

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.dbPromise;
    return db.getAll(storeName);
  }

  public async get<T>(storeName: string, id: string | number): Promise<T | undefined> {
    const db = await this.dbPromise;
    return db.get(storeName, id as any);
  }

  public async add<T>(storeName: string, item: T): Promise<any> {
    const db = await this.dbPromise;
    return db.add(storeName, item);
  }

  public async put<T>(storeName: string, item: T): Promise<any> {
    const db = await this.dbPromise;
    return db.put(storeName, item);
  }

  public async delete(storeName: string, id: string | number): Promise<void> {
    const db = await this.dbPromise;
    return db.delete(storeName, id);
  }

  public async clear(storeName: string): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(storeName);
  }

  // Méthodes spécifiques pour les tickets

  public async getTicketsByEvent(eventId: number): Promise<any[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex(STORES.TICKETS, 'by-event', eventId);
  }

  public async getTicketTypesByEvent(eventId: number): Promise<any[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex(STORES.TICKET_TYPES, 'by-event', eventId);
  }

  // Méthodes pour la synchronisation

  public async addToSyncQueue(action: 'create' | 'update' | 'delete', store: string, data: any): Promise<string> {
    const syncItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      store,
      data,
    };

    const db = await this.dbPromise;
    await db.add(STORES.SYNC_QUEUE, syncItem);
    return syncItem.id;
  }

  public async getSyncQueue(): Promise<any[]> {
    return this.getAll(STORES.SYNC_QUEUE);
  }

  public async clearSyncQueue(): Promise<void> {
    return this.clear(STORES.SYNC_QUEUE);
  }

  public async removeSyncItem(id: string): Promise<void> {
    return this.delete(STORES.SYNC_QUEUE, id);
  }

  // Paramètres

  public async saveSettings(key: string, data: any): Promise<void> {
    await this.put(STORES.SETTINGS, { id: key, ...data });
  }

  public async getSettings(key: string): Promise<any> {
    return this.get(STORES.SETTINGS, key);
  }
}

export const indexedDBService = new IndexedDBService();