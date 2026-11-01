import PokemonCard from './PokemonCard.jsx';

export default function PokemonList({ pokemon, favorites, onSelect, onToggleFavorite }) {
  const favoriteIds = new Set(favorites);
  return (
    <section className="pokemon-grid" aria-label="Lista de Pokémon">
      {pokemon.map((item) => (
        <PokemonCard
          key={item.id}
          pokemon={item}
          favorite={favoriteIds.has(item.id)}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}
