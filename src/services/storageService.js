import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY   = '@search_history';
const FAVORITES_KEY = '@favorites';

// ── Histórico ──────────────────────────────────────────────────────────────

export async function addToHistory(origin, destination) {
  const raw     = await AsyncStorage.getItem(HISTORY_KEY);
  const history = raw ? JSON.parse(raw) : [];

  const filtered = history.filter(
    (h) => !(h.origin === origin && h.destination === destination)
  );
  const updated = [{ origin, destination, timestamp: Date.now() }, ...filtered].slice(0, 5);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

// ── Favoritos ──────────────────────────────────────────────────────────────

function routeKey(route) {
  return `${route.origin}|${route.destination}|${route.id}`;
}

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function isRouteFavorite(route) {
  const favorites = await getFavorites();
  return favorites.some((f) => routeKey(f) === routeKey(route));
}

export async function toggleFavorite(route) {
  const favorites = await getFavorites();
  const key       = routeKey(route);
  const exists    = favorites.some((f) => routeKey(f) === key);

  const updated = exists
    ? favorites.filter((f) => routeKey(f) !== key)
    : [{ ...route, savedAt: Date.now() }, ...favorites];

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return { favorites: updated, isFavorite: !exists };
}
