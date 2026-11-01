import { useMemo, useState } from 'react';
import { usePokemon } from './hooks/usePokemon.js';
import { usePokemonSearch } from './hooks/usePokemonSearch.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { selectPokemon, uniqueTypes } from './logic/pokemonLogic.js';
import Header from './components/Header.jsx';
import StatsSummary from './components/StatsSummary.jsx';
import FilterBar from './components/FilterBar.jsx';
import PokemonList from './components/PokemonList.jsx';
import PokemonDetail from './components/PokemonDetail.jsx';
import StatusMessage from './components/StatusMessage.jsx';

export default function App() {
  // Estado mínimo de la UI. Los resultados filtrados se derivan con useMemo.
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('id-asc');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('pokedex-m3-favorites', []);
  const [theme, setTheme] = useLocalStorage('pokedex-m3-theme', 'dark');

  const { pokemon, offset, hasMore, total, loading, error, warning, loadMore } = usePokemon();
  const { remotePokemon, searching, searchError } = usePokemonSearch(search, pokemon);

  const collection = useMemo(() => {
    const byId = new Map(pokemon.map((item) => [item.id, item]));
    if (remotePokemon) byId.set(remotePokemon.id, remotePokemon);
    return [...byId.values()];
  }, [pokemon, remotePokemon]);

  const visible = useMemo(
    () => selectPokemon(collection, { search, type, sort, favoritesOnly, favorites }),
    [collection, search, type, sort, favoritesOnly, favorites],
  );
  const types = useMemo(() => uniqueTypes(collection), [collection]);

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]);
  };
  const resetFilters = () => {
    setSearch('');
    setType('all');
    setSort('id-asc');
    setFavoritesOnly(false);
  };

  return (
    <div className={`app theme-${theme}`}>
      <Header theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main id="inicio" className="shell">
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">REACT CORE · MISIÓN 3 <span className="eyebrow-line">/</span> ASYNC ODYSSEY · M2</p>
            <h1>Explora el mundo <span>Pokémon</span></h1>
            <p>Busca, filtra y descubre estadísticas. Ahora con componentes React y favoritos.</p>
            <div className="hero-pills"><span>◈ PokéAPI en directo</span><span>⚛ React 19</span><span>♥ Favoritos locales</span></div>
          </div>
          <StatsSummary pokemon={visible} />
        </section>

        <FilterBar search={search} onSearch={setSearch} type={type} onType={setType} sort={sort} onSort={setSort} types={types} favoritesOnly={favoritesOnly} onFavoritesOnly={setFavoritesOnly} favoriteCount={favorites.length} />

        <div className="results-heading">
          <div><span className="overline">CATÁLOGO</span><h2>Descubre tu próximo favorito</h2><p>{visible.length} resultado{visible.length === 1 ? '' : 's'} visibles · {pokemon.length} Pokémon cargados</p></div>
          <button type="button" className="reset-button" onClick={resetFilters}>↺ Limpiar filtros</button>
        </div>

        <StatusMessage loading={loading} error={error} warning={warning} searching={searching} searchError={searchError} empty={visible.length === 0} onRetry={loadMore} />

        <PokemonList pokemon={visible} favorites={favorites} onSelect={setSelected} onToggleFavorite={toggleFavorite} />

        <div className="pagination">
          {hasMore ? (
            <button className="primary" type="button" disabled={loading} onClick={loadMore}>{loading ? '◌ Cargando...' : '↻ Cargar 20 más'}</button>
          ) : <p>Has llegado al final del catálogo.</p>}
          <span>{total === null ? 'Consultando el catálogo...' : `${Math.min(offset, total)} de ${total} Pokémon consultados`}</span>
        </div>

        <section id="acerca" className="about">
          <div><span className="overline">ACERCA DEL PROYECTO</span><h2>De JavaScript a React</h2></div>
          <p>Adaptación de la <a href="https://github.com/kevin68849-boop/mision2" target="_blank" rel="noopener noreferrer">Misión 2</a> a componentes, props y hooks. Los filtros y estadísticas trabajan sobre los Pokémon cargados (o buscados por coincidencia exacta), no sobre todo el catálogo. Datos de <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>.</p>
        </section>
      </main>
      <footer className="footer">POKÉDEX <span>·</span> REACT CORE <span>·</span> MISIÓN 3</footer>
      {selected && (
        <PokemonDetail
          key={selected.id}
          pokemon={selected}
          favorite={favorites.includes(selected.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
