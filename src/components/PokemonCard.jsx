import { capitalize, formatNumber } from '../logic/pokemonLogic.js';
import TypePills from './TypePills.jsx';

export default function PokemonCard({ pokemon, onSelect, favorite, onToggleFavorite }) {
  return (
    <article className="pokemon-card">
      <button className="card-main" type="button" onClick={() => onSelect(pokemon)} aria-label={`Ver detalles de ${pokemon.name}`}>
        <div className="art">
          {pokemon.image ? <img src={pokemon.image} alt={capitalize(pokemon.name)} loading="lazy" /> : <span>Sin imagen</span>}
        </div>
        <div className="card-name"><span>{formatNumber(pokemon.id)}</span><strong>{capitalize(pokemon.name)}</strong></div>
        <TypePills types={pokemon.types} />
        <div className="mini-stats"><span>HP <b>{pokemon.hp}</b></span><span>ATK <b>{pokemon.attack}</b></span><span>DEF <b>{pokemon.defense}</b></span></div>
      </button>
      <button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} type="button" onClick={() => onToggleFavorite(pokemon.id)} aria-label={favorite ? `Quitar ${pokemon.name} de favoritos` : `Añadir ${pokemon.name} a favoritos`} aria-pressed={favorite} title={favorite ? 'Quitar favorito' : 'Guardar favorito'}>
        {favorite ? '♥' : '♡'}
      </button>
    </article>
  );
}
