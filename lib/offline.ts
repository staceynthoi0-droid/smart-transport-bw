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

export type SavedPlace = {
  id: string;
  name: string;
  landmark: string;
  type: 'rank' | 'mall' | 'school' | 'work' | 'home' | 'other';
};

export type IssueReport = {
  id: string;
  reason: string;
  details: string;
  route?: string;
  createdAt: string;
};

export type CommuterSettings = {
  lowDataMode: boolean;
  safetyModePrompt: boolean;
  trafficAlerts: boolean;
  cacheOfflineRoutes: boolean;
  hapticFeedback: boolean;
  defaultPickup: string;
};

const DEFAULT_SETTINGS: CommuterSettings = {
  lowDataMode: true,
  safetyModePrompt: true,
  trafficAlerts: true,
  cacheOfflineRoutes: true,
  hapticFeedback: true,
  defaultPickup: 'Current Location',
};

export async function cacheSavedPlaces(places: SavedPlace[]): Promise<void> {
  await AsyncStorage.setItem('stbw_saved_places', JSON.stringify(places));
}

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  try {
    const raw = await AsyncStorage.getItem('stbw_saved_places');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'sp-main-mall', name: 'Main Mall Rank', landmark: 'Near Queens Road taxi bay', type: 'rank' },
      { id: 'sp-ub', name: 'University of Botswana', landmark: 'Library gate', type: 'school' },
    ];
  } catch {
    return [];
  }
}

export async function cacheIssueReports(reports: IssueReport[]): Promise<void> {
  await AsyncStorage.setItem('stbw_issue_reports', JSON.stringify(reports));
}

export async function getIssueReports(): Promise<IssueReport[]> {
  try {
    const raw = await AsyncStorage.getItem('stbw_issue_reports');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function cacheCommuterSettings(settings: CommuterSettings): Promise<void> {
  await AsyncStorage.setItem('stbw_commuter_settings', JSON.stringify(settings));
}

export async function getCommuterSettings(): Promise<CommuterSettings> {
  try {
    const raw = await AsyncStorage.getItem('stbw_commuter_settings');
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
