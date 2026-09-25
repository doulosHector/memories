import { createId } from '../utils/id'

/**
 * Photos are too big for localStorage, so they live in IndexedDB as Blobs,
 * keyed by the memory's `photoId`. When IndexedDB is not available the
 * photos are kept in memory only (lost on reload), like the rest of the data
 * in that case.
 */
const DB_NAME = 'memories'
const STORE_NAME = 'photos'

let dbPromise: Promise<IDBDatabase> | null = null

const openDb = (): Promise<IDBDatabase> => {
  dbPromise ??= new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () =>
        request.result.createObjectStore(STORE_NAME)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
  return dbPromise
}

const memoryFallback = new Map<string, Blob>()
const urlCache = new Map<string, string>()

/** Runs one request in its own transaction; resolves once it is committed. */
const run = <T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> =>
  openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode)
        const request = operation(tx.objectStore(STORE_NAME))
        tx.oncomplete = () => resolve(request.result)
        tx.onerror = tx.onabort = () => reject(tx.error ?? request.error)
      }),
  )

const isIndexedDbUsable = (): Promise<boolean> =>
  openDb().then(
    () => true,
    () => false,
  )

const cacheUrl = (id: string, blob: Blob): string => {
  const url = URL.createObjectURL(blob)
  urlCache.set(id, url)
  return url
}

/** Stores a photo and returns its new id. */
export const savePhoto = async (blob: Blob): Promise<string> => {
  const id = createId()
  if (await isIndexedDbUsable()) await run('readwrite', (s) => s.put(blob, id))
  else memoryFallback.set(id, blob)
  cacheUrl(id, blob)
  return id
}

/** Object URL of a photo already loaded in this session, if any. */
export const peekPhotoUrl = (id: string): string | null =>
  urlCache.get(id) ?? null

/** Object URL for a stored photo, or `null` if it does not exist. */
export const getPhotoUrl = async (id: string): Promise<string | null> => {
  const cached = urlCache.get(id)
  if (cached) return cached
  const blob = (await isIndexedDbUsable())
    ? await run<unknown>('readonly', (s) => s.get(id))
    : memoryFallback.get(id)
  return blob instanceof Blob ? cacheUrl(id, blob) : null
}

export const deletePhoto = async (id: string): Promise<void> => {
  const url = urlCache.get(id)
  if (url) URL.revokeObjectURL(url)
  urlCache.delete(id)
  memoryFallback.delete(id)
  if (await isIndexedDbUsable()) await run('readwrite', (s) => s.delete(id))
}

/** True when a save failed because the device storage is full. */
export const isQuotaError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'QuotaExceededError'
