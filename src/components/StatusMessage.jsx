export default function StatusMessage({ loading, error, warning, searching, searchError, empty, onRetry }) {
  return (
    <div className="status-area" aria-live="polite">
      {error && <div className="notice notice-error" role="alert">{error}. Comprueba tu conexión. <button type="button" onClick={onRetry}>Reintentar</button></div>}
      {warning && <div className="notice notice-warning" role="status">{warning}</div>}
      {loading && <div className="notice notice-info" role="status"><span className="spinner" aria-hidden="true" /> Cargando Pokémon desde PokéAPI...</div>}
      {searching && <div className="notice notice-info" role="status"><span className="spinner" aria-hidden="true" /> Buscando en PokéAPI...</div>}
      {searchError && !searching && <div className="notice notice-warning" role="status">No se encontró una coincidencia exacta en PokéAPI, o se produjo un error de conexión.</div>}
      {empty && !loading && !searching && !error && !searchError && <div className="notice notice-empty">No se encontraron Pokémon con estos filtros. Prueba a cambiarlos.</div>}
    </div>
  );
}
