import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePokemon, selectPokemon, summarizePokemon, uniqueTypes } from '../src/logic/pokemonLogic.js';

const raw = {
  id: 6, name: 'charizard',
  sprites: { front_default: 'default.png', other: { 'official-artwork': { front_default: 'art.png', front_shiny: 'shiny.png' } } },
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 78 }, { stat: { name: 'attack' }, base_stat: 84 }, { stat: { name: 'defense' }, base_stat: 78 }],
  height: 17, weight: 905, abilities: [{ ability: { name: 'blaze' } }],
};
const charizard = normalizePokemon(raw);
const squirtle = { ...charizard, id: 7, name: 'squirtle', types: ['water'], attack: 48, hp: 44, defense: 65 };
const pikachu = { ...charizard, id: 25, name: 'pikachu', types: ['electric'], attack: 55, hp: 35, defense: 40 };
const collection = [pikachu, squirtle, charizard];

test('normaliza imagen, atributos, tipos y unidades originales de M2', () => {
  assert.equal(charizard.image, 'art.png');
  assert.equal(charizard.shinyImage, 'shiny.png');
  assert.deepEqual(charizard.types, ['fire', 'flying']);
  assert.equal(charizard.height, 1.7);
  assert.equal(charizard.weight, 90.5);
  assert.equal(charizard.attack, 84);
});

test('busca por nombre parcial, ID y #ID', () => {
  assert.deepEqual(selectPokemon(collection, { search: 'char' }).map((p) => p.id), [6]);
  assert.deepEqual(selectPokemon(collection, { search: '25' }).map((p) => p.id), [25]);
  assert.deepEqual(selectPokemon(collection, { search: '#25' }).map((p) => p.id), [25]);
});

test('filtra por tipo y favoritos a la vez', () => {
  const result = selectPokemon(collection, { type: 'fire', favorites: [6, 25], favoritesOnly: true });
  assert.deepEqual(result.map((p) => p.id), [6]);
});

test('ordena por ID y estadísticas sin mutar el array de entrada', () => {
  assert.deepEqual(selectPokemon(collection).map((p) => p.id), [6, 7, 25]);
  assert.deepEqual(selectPokemon(collection, { sort: 'attack' }).map((p) => p.id), [6, 25, 7]);
  assert.deepEqual(selectPokemon(collection, { sort: 'id-desc' }).map((p) => p.id), [25, 7, 6]);
  assert.equal(collection[0].id, 25);
});

test('resume sólo elementos visibles usando reduce y Set', () => {
  const result = summarizePokemon([charizard, pikachu]);
  assert.deepEqual(result, { count: 2, averageAttack: '69.5', averageHp: '56.5', types: 3 });
  assert.deepEqual(uniqueTypes(collection), ['electric', 'fire', 'flying', 'water']);
});

test('muestra valores por defecto con estadísticas ausentes', () => {
  const normalized = normalizePokemon({ id: 1, name: 'test' });
  assert.equal(normalized.image, '');
  assert.equal(normalized.attack, 0);
  assert.deepEqual(normalized.stats, []);
  assert.deepEqual(normalized.abilities, []);
});
