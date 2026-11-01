import { summarizePokemon } from '../logic/pokemonLogic.js';

export default function StatsSummary({ pokemon }) {
  // El resumen es un valor derivado: no necesita useState ni useEffect.
  const summary = summarizePokemon(pokemon);
  const metrics = [
    { icon: '◉', value: summary.count, label: 'Pokémon visibles' },
    { icon: '↗', value: summary.averageAttack, label: 'Ataque medio' },
    { icon: '♥', value: summary.averageHp, label: 'HP medio' },
    { icon: '✦', value: summary.types, label: 'Tipos distintos' },
  ];

  return (
    <div id="estadisticas" className="metrics" aria-label="Estadísticas de los Pokémon visibles">
      {metrics.map((metric) => (
        <div className="metric" key={metric.label}>
          <span className="metric-icon" aria-hidden="true">{metric.icon}</span>
          <strong>{metric.value}</strong>
          <small>{metric.label}</small>
        </div>
      ))}
    </div>
  );
}
