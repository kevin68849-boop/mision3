import { capitalize, typeLabels } from '../logic/pokemonLogic.js';

export default function TypePills({ types }) {
  return (
    <div className="types">
      {types.map((type) => (
        <span key={type} className={`type type-${type}`}>
          {typeLabels[type] ?? capitalize(type)}
        </span>
      ))}
    </div>
  );
}
