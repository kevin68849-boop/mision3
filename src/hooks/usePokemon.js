import { useCallback, useEffect, useRef, useState } from 'react';
import { getPokemonBatch } from '../api/pokemonApi.js';
import { normalizePokemon } from '../logic/pokemonLogic.js';

const PAGE_SIZE = 20;

// El hook encapsula el estado asíncrono. Los filtros NO se guardan aquí.
export function usePokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const activeRequest = useRef(null);

  const fetchPage = useCallback(async (pageOffset, signal) => {
    if (activeRequest.current) return;
    const controller = signal ? null : new AbortController();
    const requestSignal = signal ?? controller.signal;
    activeRequest.current = requestSignal;
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const batch = await getPokemonBatch(pageOffset, PAGE_SIZE, { signal: requestSignal });
      if (requestSignal.aborted) return;
      const normalized = batch.pokemon.map(normalizePokemon);
      setPokemon((previous) => {
        const byId = new Map([...previous, ...normalized].map((item) => [item.id, item]));
        return [...byId.values()];
      });
      setOffset(pageOffset + PAGE_SIZE);
      setHasMore(batch.hasMore);
      setTotal(batch.count);
      if (batch.failed) {
        setWarning(`${batch.failed} fichas de este lote no se han podido cargar. Las demás sí están disponibles.`);
      }
    } catch (caught) {
      if (!requestSignal.aborted) setError(caught.message || 'No se han podido cargar los Pokémon.');
    } finally {
      if (activeRequest.current === requestSignal) {
        activeRequest.current = null;
        if (!requestSignal.aborted) setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchPage(0, controller.signal);
    return () => {
      controller.abort();
      if (activeRequest.current === controller.signal) activeRequest.current = null;
    };
  }, [fetchPage]);

  const loadMore = () => {
    if (!loading && hasMore) void fetchPage(offset);
  };

  return { pokemon, offset, hasMore, total, loading, error, warning, loadMore };
}
