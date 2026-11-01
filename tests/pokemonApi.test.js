import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson, getPokemonBatch, getPokemonByName } from '../src/api/pokemonApi.js';

function createStorage() {
  const map = new Map();
  return {
    getItem: (key) => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}

test('fetchJson guarda caché local y evita una segunda petición', async () => {
  const oldFetch = globalThis.fetch;
  const oldStorage = globalThis.localStorage;
  let calls = 0;
  globalThis.localStorage = createStorage();
  globalThis.fetch = async () => { calls += 1; return { ok: true, json: async () => ({ id: 1 }) }; };
  try {
    const url = 'https://pokeapi.co/api/v2/pokemon/1';
    assert.deepEqual(await fetchJson(url), { id: 1 });
    assert.deepEqual(await fetchJson(url), { id: 1 });
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = oldFetch;
    globalThis.localStorage = oldStorage;
  }
});

test('getPokemonBatch conserva éxitos parciales con allSettled', async () => {
  const oldFetch = globalThis.fetch;
  const oldStorage = globalThis.localStorage;
  globalThis.localStorage = createStorage();
  globalThis.fetch = async (url) => {
    if (url.includes('?limit=')) return { ok: true, json: async () => ({ results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1' }, { url: 'https://pokeapi.co/api/v2/pokemon/2' }], next: '/next', count: 100 }) };
    if (url.endsWith('/1')) return { ok: true, json: async () => ({ id: 1 }) };
    return { ok: false, status: 503 };
  };
  try {
    const result = await getPokemonBatch(0, 2);
    assert.equal(result.pokemon.length, 1);
    assert.equal(result.pokemon[0].id, 1);
    assert.equal(result.failed, 1);
    assert.equal(result.hasMore, true);
    assert.equal(result.count, 100);
  } finally {
    globalThis.fetch = oldFetch;
    globalThis.localStorage = oldStorage;
  }
});

test('getPokemonByName codifica nombres y propaga errores HTTP', async () => {
  const oldFetch = globalThis.fetch;
  const oldStorage = globalThis.localStorage;
  globalThis.localStorage = createStorage();
  let requested = '';
  globalThis.fetch = async (url) => { requested = url; return { ok: false, status: 404 }; };
  try {
    await assert.rejects(() => getPokemonByName('NO-EXISTE'), /HTTP 404/);
    assert.equal(requested, 'https://pokeapi.co/api/v2/pokemon/no-existe');
  } finally {
    globalThis.fetch = oldFetch;
    globalThis.localStorage = oldStorage;
  }
});
