type CacheEntry<T> = { value: T; expiresAt: number };

const cache = new Map<string, CacheEntry<unknown>>();

export const getCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
};

export const setCache = <T>(key: string, value: T, ttlMs: number) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
    return;
  }
  cache.clear();
};

export const getOrSetCache = async <T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> => {
  const cached = getCache<T>(key);
  if (cached !== null) return cached;
  const value = await loader();
  setCache(key, value, ttlMs);
  return value;
};
