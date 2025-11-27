/**
 * Service de gestion de la connexion réseau
 * Permet de détecter si l'application est en ligne ou hors ligne
 * et de s'abonner aux changements d'état de connexion
 */

type ConnectionCallback = (online: boolean) => void;

class ConnectionService {
  private isOnline: boolean;
  private listeners: ConnectionCallback[] = [];

  constructor() {
    this.isOnline = navigator.onLine;
    this.setupListeners();
  }

  private setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public getConnectionStatus(): boolean {
    return this.isOnline;
  }

  public addListener(callback: ConnectionCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  public async waitForConnection(): Promise<void> {
    if (this.isOnline) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const unsubscribe = this.addListener((online) => {
        if (online) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
}

export const connectionService = new ConnectionService();