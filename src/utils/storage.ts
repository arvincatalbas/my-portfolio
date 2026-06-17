import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const dbName = 'portfolio_database';
const storeName = 'portfolio_store';
const version = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (!isWeb) {
    return Promise.reject(new Error('IndexedDB is only supported on Web.'));
  }
  
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
  });
  
  return dbPromise;
};

export const getIndexedDBItem = async <T>(key: string): Promise<T | null> => {
  if (!isWeb) return null;
  
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve((request.result as T) || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB failed, falling back to localStorage:', e);
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (localErr) {
      console.error('LocalStorage fallback failed:', localErr);
      return null;
    }
  }
};

export const setIndexedDBItem = async <T>(key: string, value: T): Promise<void> => {
  if (!isWeb) return;
  
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB failed, falling back to localStorage:', e);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (localErr) {
      console.error('LocalStorage fallback failed:', localErr);
      throw localErr;
    }
  }
};

export const removeIndexedDBItem = async (key: string): Promise<void> => {
  if (!isWeb) return;
  
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB failed, falling back to localStorage:', e);
    try {
      localStorage.removeItem(key);
    } catch (localErr) {
      console.error('LocalStorage fallback failed:', localErr);
    }
  }
};
