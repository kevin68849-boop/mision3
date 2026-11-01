import { useEffect, useState } from 'react';
import { getPokemonByName } from '../api/pokemonApi.js';
import { normalizePokemon } from '../logic/pokemonLogic.js';

// M2 hacía debounce manual con setTimeout y requestId.
// En React, el cleanup de useEffect cancela el temporizador y la petición anterior.
export function usePokemonSearch(search, loadedPokemon) {
  const query = search.trim().toLowerCase().replace(/^#/, '');
  const [result, setResult] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(null);
  const [failure, setFailure] = useState(null);

  const hasLocalMatch = loadedPokemon.some((item) =>
    item.name.includes(query) || String(item.id) === query,
  );
  const remoteNeeded = query.length >= 2 && /^[a-z0-9-]+$/.test(query) && !hasLocalMatch;

  useEffect(() => {
    if (!remoteNeeded) return undefined;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setPendingQuery(query);
      try {
        const raw = await getPokemonByName(query, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setResult({ query, pokemon: normalizePokemon(raw) });
          setFailure(null);
        }
      } catch (caught) {
        if (!controller.signal.aborted) {
          setFailure({ query, message: caught.message });
        }
      } finally {
        if (!controller.signal.aborted) setPendingQuery(null);
      }
    }, 400);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, remoteNeeded]);

  // En vez de borrar el estado durante un efecto, lo derivamos de la consulta actual.
  return {
    remotePokemon: remoteNeeded && result?.query === query ? result.pokemon : null,
    searching: remoteNeeded && pendingQuery === query,
    searchError: remoteNeeded && failure?.query === query ? failure.message : '',
  };
}
