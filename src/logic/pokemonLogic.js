// Conserva las transformaciones y criterios de ordenación de la Misión 2.
export function normalizePokemon(raw) {
  return {
    id: raw.id,
    name: raw.name,
    image: raw.sprites?.other?.['official-artwork']?.front_default ?? raw.sprites?.front_default ?? '',
    shinyImage: raw.sprites?.other?.['official-artwork']?.front_shiny ?? raw.sprites?.front_shiny ?? '',
    types: (raw.types ?? []).map((entry) => entry.type.name),
    hp: raw.stats?.find((entry) => entry.stat.name === 'hp')?.base_stat ?? 0,
    attack: raw.stats?.find((entry) => entry.stat.name === 'attack')?.base_stat ?? 0,
    defense: raw.stats?.find((entry) => entry.stat.name === 'defense')?.base_stat ?? 0,
    stats: (raw.stats ?? []).map((entry) => ({ name: entry.stat.name, value: entry.base_stat })),
    height: (raw.height ?? 0) / 10,
    weight: (raw.weight ?? 0) / 10,
    abilities: (raw.abilities ?? []).map((entry) => entry.ability.name),
  };
}

export function selectPokemon(pokemon, { search = '', type = 'all', sort = 'id-asc', favoritesOnly = false, favorites = [] } = {}) {
  const query = String(search).trim().toLowerCase().replace(/^#/, '');
  const favoriteSet = new Set(favorites);
  const filtered = pokemon.filter((item) =>
    (!query || item.name.includes(query) || String(item.id) === query) &&
    (type === 'all' || item.types.includes(type)) &&
    (!favoritesOnly || favoriteSet.has(item.id)),
  );
  const comparators = {
    'id-asc': (a, b) => a.id - b.id,
    'id-desc': (a, b) => b.id - a.id,
    name: (a, b) => a.name.localeCompare(b.name),
    attack: (a, b) => b.attack - a.attack || a.id - b.id,
    hp: (a, b) => b.hp - a.hp || a.id - b.id,
    defense: (a, b) => b.defense - a.defense || a.id - b.id,
  };
  return [...filtered].sort(comparators[sort] ?? comparators['id-asc']);
}

export function summarizePokemon(pokemon) {
  const totals = pokemon.reduce((acc, item) => {
    acc.attack += item.attack;
    acc.hp += item.hp;
    item.types.forEach((type) => acc.types.add(type));
    return acc;
  }, { attack: 0, hp: 0, types: new Set() });

  const count = pokemon.length;
  return {
    count,
    averageAttack: count ? (totals.attack / count).toFixed(1) : '0',
    averageHp: count ? (totals.hp / count).toFixed(1) : '0',
    types: totals.types.size,
  };
}

export const uniqueTypes = (pokemon) => [...new Set(pokemon.flatMap((item) => item.types))].sort();

export const typeLabels = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico', grass: 'Planta',
  ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador',
  psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón',
  dark: 'Siniestro', steel: 'Acero', fairy: 'Hada',
};
export const statLabels = {
  hp: 'HP', attack: 'Ataque', defense: 'Defensa', 'special-attack': 'Ataque esp.',
  'special-defense': 'Defensa esp.', speed: 'Velocidad',
};
export const capitalize = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1).replaceAll('-', ' ');
export const formatNumber = (n) => `#${String(n).padStart(3, '0')}`;
