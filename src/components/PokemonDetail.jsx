import { useEffect, useState } from 'react';
import { capitalize, formatNumber, statLabels } from '../logic/pokemonLogic.js';
import TypePills from './TypePills.jsx';

export default function PokemonDetail({ pokemon, favorite, onToggleFavorite, onClose }) {
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const image = shiny && pokemon.shinyImage ? pokemon.shinyImage : pokemon.image;
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="detail-title" className="detail-dialog">
        <button className="close" type="button" onClick={onClose} aria-label="Cerrar detalles">✕</button>
        <div className="detail-layout">
          <div className="detail-art">
            {image ? <img src={image} alt={capitalize(pokemon.name)} /> : <p>Imagen no disponible</p>}
            {pokemon.shinyImage && <button type="button" className="shiny-toggle" onClick={() => setShiny((value) => !value)} aria-pressed={shiny}>{shiny ? '✦ Forma shiny activada' : '✧ Ver forma shiny'}</button>}
          </div>
          <div className="detail-info">
            <span className="eyebrow">{formatNumber(pokemon.id)}</span>
            <h2 id="detail-title">{capitalize(pokemon.name)}</h2>
            <TypePills types={pokemon.types} />
            <dl>
              <div><dt>Altura</dt><dd>{pokemon.height} m</dd></div>
              <div><dt>Peso</dt><dd>{pokemon.weight} kg</dd></div>
              <div><dt>Habilidades</dt><dd>{pokemon.abilities.map(capitalize).join(', ') || 'Sin datos'}</dd></div>
            </dl>
            <button className={`detail-fav ${favorite ? 'is-favorite' : ''}`} type="button" onClick={() => onToggleFavorite(pokemon.id)} aria-pressed={favorite}>{favorite ? '♥ Guardado en favoritos' : '♡ Añadir a favoritos'}</button>
          </div>
          <div className="detail-stats">
            <h3>Estadísticas base</h3>
            {pokemon.stats.map((stat) => (
              <div className="stat-row" key={stat.name}>
                <span>{statLabels[stat.name] ?? capitalize(stat.name)}</span>
                <b>{stat.value}</b>
                <div className="bar" aria-label={`${stat.name}: ${stat.value}`}><span style={{ width: `${Math.min(100, (stat.value / 255) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
