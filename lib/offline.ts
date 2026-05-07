import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'stbw_cache_';

export async function cacheData(key: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {}
}

export async function getCachedData<T>(key: string, maxAgeMs = 3600000): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAgeMs) return null;
    return data as T;
  } catch {
    return null;
  }
}

export async function cacheFavourites(places: string[]): Promise<void> {
  await AsyncStorage.setItem('stbw_favourites', JSON.stringify(places));
}

export async function getFavourites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem('stbw_favourites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function cacheRecentSearches(searches: string[]): Promise<void> {
  await AsyncStorage.setItem('stbw_recent', JSON.stringify(searches.slice(0, 10)));
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem('stbw_recent');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
