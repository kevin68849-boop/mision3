// Migración de src/api/pokemonApi.js de M2: misma API, caché de 24h y allSettled.
// El AbortSignal permite limpiar solicitudes iniciadas desde useEffect.
const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_PREFIX = 'pokedex-m3-v1:';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function fetchJson(url, { signal } = {}) {
  signal?.throwIfAborted();
  const key = CACHE_PREFIX + url;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
      localStorage.removeItem(key);
    }
  } catch {
    // La aplicación funciona incluso sin permiso para usar localStorage.
  }

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Error HTTP ${response.status} al consultar PokéAPI`);
  const data = await response.json();
  signal?.throwIfAborted();

  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Ignoramos cuotas llenas o almacenamiento restringido.
  }
  return data;
}

export async function getPokemonBatch(offset = 0, limit = 20, { signal } = {}) {
  const list = await fetchJson(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  const settled = await Promise.allSettled(
    list.results.map((item) => fetchJson(item.url, { signal })),
  );
  signal?.throwIfAborted();

  const pokemon = settled
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  if (!pokemon.length && list.results.length) {
    throw new Error('No se han podido obtener los detalles de los Pokémon');
  }

  return {
    pokemon,
    failed: settled.length - pokemon.length,
    hasMore: Boolean(list.next),
    count: list.count,
  };
}

export function getPokemonByName(name, { signal } = {}) {
  const query = encodeURIComponent(String(name).trim().toLowerCase());
  return fetchJson(`${BASE_URL}/pokemon/${query}`, { signal });
}
