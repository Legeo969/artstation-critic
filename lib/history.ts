import { ArtworkCritique } from './critique';

const DB_NAME = 'ArtstationCritic';
const STORE_NAME = 'critiques';
const DB_VERSION = 1;

export interface CritiqueRecord {
  id: string;
  filename: string;
  timestamp: number;
  critique: ArtworkCritique;
  imageBase64?: string;
  optimizedImageBase64?: string;
  optimizationPrompt?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('filename', 'filename', { unique: false });
      }
    };
  });
}

export async function saveCritique(
  filename: string,
  critique: ArtworkCritique,
  imageBase64?: string
): Promise<CritiqueRecord> {
  const db = await openDB();
  const record: CritiqueRecord = {
    id: crypto.randomUUID(),
    filename,
    timestamp: Date.now(),
    critique,
    imageBase64,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(record);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function getHistory(limit?: number): Promise<CritiqueRecord[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = limit ? index.getAllKeys(IDBKeyRange.upperBound(Date.now())) : index.getAll();

    request.onsuccess = async () => {
      if (limit && request.result.length > 0) {
        // 获取最近的 N 条记录
        const keys = request.result.slice(-limit);
        const records: CritiqueRecord[] = [];
        for (const key of keys) {
          const recordRequest = store.get(key);
          records.push(await new Promise<CritiqueRecord>((res) => {
            recordRequest.onsuccess = () => res(recordRequest.result);
          }));
        }
        resolve(records.reverse()); // 最新在前
      } else {
        resolve(request.result.reverse()); // 最新在前
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getCritiqueById(id: string): Promise<CritiqueRecord | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearHistory(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updateCritique(id: string, updates: Partial<CritiqueRecord>): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) { reject(new Error('Record not found')); return; }
      const updated = { ...existing, ...updates, id };
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function deleteCritique(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
