// Clés de stockage
export const STORAGE_KEYS = {
  USER: 'siggil_user',
  CART: 'siggil_cart',
  PRODUCTS: 'siggil_products',
  ORDERS: 'siggil_orders',
  ADMIN_SESSION: 'siggil_admin_session',
  PREMIUM_REQUESTS: 'siggil_premium_requests',
} as const;

// Interface pour les données de stockage
export interface StorageData {
  [key: string]: any;
}

// Classe utilitaire pour la gestion du localStorage
export class StorageManager {
  // Récupérer des données
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }

  // Sauvegarder des données
  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
      return false;
    }
  }

  // Supprimer des données
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  }

  // Vérifier si une clé existe
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Nettoyer tout le stockage
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
      return false;
    }
  }

  // Nettoyer uniquement les données SIGGIL
  static clearSiggilData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage des données SIGGIL:', error);
      return false;
    }
  }

  // Obtenir la taille du stockage
  static getSize(): number {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  // Obtenir la taille en MB
  static getSizeInMB(): number {
    return this.getSize() / (1024 * 1024);
  }

  // Vérifier si le stockage est disponible
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Sauvegarder avec expiration
  static setWithExpiry<T>(key: string, value: T, expiryHours: number = 24): boolean {
    try {
      const item = {
        value,
        expiry: new Date().getTime() + (expiryHours * 60 * 60 * 1000)
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde avec expiration de ${key}:`, error);
      return false;
    }
  }

  // Récupérer avec vérification d'expiration
  static getWithExpiry<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsedItem = JSON.parse(item);
      const now = new Date().getTime();

      if (now > parsedItem.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedItem.value;
    } catch (error) {
      console.error(`Erreur lors de la récupération avec expiration de ${key}:`, error);
      return null;
    }
  }

  // Nettoyer les données expirées
  static cleanExpired(): number {
    let cleaned = 0;
    const now = new Date().getTime();

    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const item = JSON.parse(localStorage[key]);
          if (item.expiry && now > item.expiry) {
            localStorage.removeItem(key);
            cleaned++;
          }
        } catch (error) {
          // Ignorer les éléments qui ne sont pas au format d'expiration
        }
      }
    }

    return cleaned;
  }

  // Sauvegarder des données de manière sécurisée (avec chiffrement basique)
  static setSecure<T>(key: string, value: T, password: string): boolean {
    try {
      const encrypted = this.encrypt(JSON.stringify(value), password);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde sécurisée de ${key}:`, error);
      return false;
    }
  }

  // Récupérer des données de manière sécurisée
  static getSecure<T>(key: string, password: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted, password);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error(`Erreur lors de la récupération sécurisée de ${key}:`, error);
      return null;
    }
  }

  // Chiffrement basique (pour la démo - utiliser une vraie bibliothèque en production)
  private static encrypt(text: string, password: string): string {
    return btoa(text + '|' + password);
  }

  // Déchiffrement basique
  private static decrypt(encrypted: string, password: string): string {
    const decoded = atob(encrypted);
    const parts = decoded.split('|');
    if (parts[1] !== password) {
      throw new Error('Mot de passe incorrect');
    }
    return parts[0];
  }
}

// Fonctions utilitaires spécifiques à SIGGIL
export const SiggilStorage = {
  // Gestion des utilisateurs
  getUser: () => StorageManager.get(STORAGE_KEYS.USER),
  setUser: (user: any) => StorageManager.set(STORAGE_KEYS.USER, user),
  removeUser: () => StorageManager.remove(STORAGE_KEYS.USER),

  // Gestion du panier
  getCart: () => StorageManager.get(STORAGE_KEYS.CART),
  setCart: (cart: any) => StorageManager.set(STORAGE_KEYS.CART, cart),
  removeCart: () => StorageManager.remove(STORAGE_KEYS.CART),

  // Gestion des produits
  getProducts: () => StorageManager.get(STORAGE_KEYS.PRODUCTS),
  setProducts: (products: any) => StorageManager.set(STORAGE_KEYS.PRODUCTS, products),
  removeProducts: () => StorageManager.remove(STORAGE_KEYS.PRODUCTS),

  // Gestion des commandes
  getOrders: () => StorageManager.get(STORAGE_KEYS.ORDERS),
  setOrders: (orders: any) => StorageManager.set(STORAGE_KEYS.ORDERS, orders),
  addOrder: (order: any) => {
    const orders = SiggilStorage.getOrders() || [];
    orders.push(order);
    SiggilStorage.setOrders(orders);
  },

  // Gestion de la session admin
  getAdminSession: () => StorageManager.get(STORAGE_KEYS.ADMIN_SESSION),
  setAdminSession: (session: any) => StorageManager.set(STORAGE_KEYS.ADMIN_SESSION, session),
  removeAdminSession: () => StorageManager.remove(STORAGE_KEYS.ADMIN_SESSION),

  // Gestion des demandes premium
  getPremiumRequests: () => StorageManager.get(STORAGE_KEYS.PREMIUM_REQUESTS),
  setPremiumRequests: (requests: any) => StorageManager.set(STORAGE_KEYS.PREMIUM_REQUESTS, requests),
  addPremiumRequest: (request: any) => {
    const requests = SiggilStorage.getPremiumRequests() || [];
    requests.push(request);
    SiggilStorage.setPremiumRequests(requests);
  },

  // Nettoyage complet
  clearAll: () => StorageManager.clearSiggilData(),
};
