export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="shell nav">
        <a href="#inicio" className="brand"><span className="ball" aria-hidden="true">◉</span> PokéDex <span className="brand-tag">REACT</span></a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#estadisticas">Estadísticas</a>
          <a href="#acerca">Acerca de</a>
        </nav>
        <button className="icon-button theme-button" type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'} title="Cambiar tema">
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
      </div>
    </header>
  );
}
