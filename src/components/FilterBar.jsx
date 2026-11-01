import { capitalize, typeLabels } from '../logic/pokemonLogic.js';

export default function FilterBar({ search, onSearch, type, onType, sort, onSort, types, favoritesOnly, onFavoritesOnly, favoriteCount }) {
  return (
    <section className="toolbar" aria-label="Búsqueda y filtros">
      <label className="search">
        <span aria-hidden="true" className="search-icon">⌕</span>
        <input value={search} onChange={(event) => onSearch(event.target.value)} type="search" placeholder="Buscar Pokémon por nombre o número..." aria-label="Buscar Pokémon" />
      </label>
      <label className="field-label">Tipo
        <select value={type} onChange={(event) => onType(event.target.value)}>
          <option value="all">Todos los tipos</option>
          {types.map((entry) => <option value={entry} key={entry}>{typeLabels[entry] ?? capitalize(entry)}</option>)}
        </select>
      </label>
      <label className="field-label">Ordenar por
        <select value={sort} onChange={(event) => onSort(event.target.value)}>
          <option value="id-asc">Número (asc.)</option>
          <option value="id-desc">Número (desc.)</option>
          <option value="name">Nombre (A-Z)</option>
          <option value="attack">Mayor ataque</option>
          <option value="hp">Mayor HP</option>
          <option value="defense">Mayor defensa</option>
        </select>
      </label>
      <label className={`favorites-filter ${favoritesOnly ? 'is-active' : ''}`}>
        <input type="checkbox" checked={favoritesOnly} onChange={(event) => onFavoritesOnly(event.target.checked)} />
        <span aria-hidden="true">♥</span> Favoritos <span className="counter">{favoriteCount}</span>
      </label>
    </section>
  );
}
