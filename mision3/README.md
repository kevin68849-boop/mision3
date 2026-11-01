# Pokedex

Mision M3 - React Core

## Cómo probarlo 

Abre el proyecto en VS Code y ejecuta desde la terminal:

```bash

npm install
npm run dev

```

Abre la dirección local que proporciona Vite

La aplicación carga inicialmente 20 Pokemon desde PokeAPI. Puedes buscar Pokemon por nombre o número, filtrarlos por tipo, ordenarlos por estadísticas y pulsar sobre sus tarjetas para consultar información detallada.

Pulsa «Cargar más» para solicitar otros 20 Pokemon. También puedes buscar uno que todavía no se haya descargado, como Mewtwo, esta ultima version solo lo cuentra por nombre exacto.

se agregó la opcion de implmentar pokemon favoritos y ver la version shiny de los pokemon en 
la parte de ver estadisticas.


Para ejecutar:
```
npm run build

```

## Estructura proyecto

src/
├── main.jsx                    # Arranque de React
├── App.jsx                     # Componente principal y estado compartido
├── style.css                   # Estilos de la Pokédex
├── api/
│   └── pokemonApi.js           # Peticiones a PokéAPI y caché
├── logic/
│   └── pokemonLogic.js         # Normalización, filtros y estadísticas
├── hooks/
│   ├── usePokemon.js           # Carga de lotes y estados de petición
│   ├── usePokemonSearch.js     # Búsqueda remota y cancelación
│   └── useLocalStorage.js      # Persistencia de tema y favoritos
└── components/
    ├── Header.jsx
    ├── StatsSummary.jsx
    ├── FilterBar.jsx
    ├── PokemonList.jsx
    ├── PokemonCard.jsx
    ├── PokemonDetail.jsx
    ├── TypePills.jsx
    └── StatusMessage.jsx

tests/
├── pokemonApi.test.js
└── pokemonLogic.test.js

## Uso de IA

IA usada: ChatGPT 

Para este proyecto he utilizado la IA para generar la estructura de carpetas teniendo el 
modelo de la anterior mision como base. poco a poco he generado el codigo entendiendo
la funcionalidad de la aplicacion aplicada a react.
Ejemplos de prompts:

`"Antes de comenzar con React, quiero que analicemos la estructura de mi Misión 2. Explícame qué responsabilidad tienen main.js, pokemonApi.js, pokemonLogic.js y pokemonRender.js. ¿Qué partes podemos reutilizar y cuáles debemos cambiar obligatoriamente?"`

`"Vamos a organizar nuestra Pokédex en componentes de React ¿Qué componentes tendría sentido crear? Justifica cada uno."`

`"Vamos a implementar PokemonCard y PokemonList. ¿Qué datos debería recibir cada componente mediante props? ¿Es mejor pasar el objeto Pokémon completo o enviar sus propiedades individualmente? Explícame las ventajas e inconvenientes."`

## Autopsia

He mantenido los módulos de API y lógica, pero he sustituido el renderizado imperativo por componentes .jsx. Descarté seguir utilizando innerHTML porque React ya se encarga de actualizar la interfaz cuando cambia el estado.

Dividí la interfaz en Header, FilterBar, StatsSummary, PokemonList, PokemonCard, PokemonDetail y otros componentes pequeños. Los datos y las funciones de interacción pasan del componente principal a los hijos mediante props. Preferí esta estructura a un componente único que contuviera toda la aplicación, porque es más fácil de mantener y explicar. Las listas utilizan claves estables basadas en el ID del Pokémon.

Utilicé useState para los filtros, la selección y los estados de carga, y un hook personalizado useLocalStorage para favoritos y tema. Los resultados filtrados y las estadísticas se calculan a partir de los datos actuales, sin guardarlos en otro estado. Elegí este enfoque frente a utilizar useEffect para recalcular cada filtro, porque evita duplicaciones.

Conservé fetch, async/await, response.ok, Promise.allSettled() y la caché de 24 horas. Utilicé usePokemon para cargar lotes y usePokemonSearch para realizar la búsqueda remota. Los efectos gestionan peticiones y temporizadores; sus funciones de limpieza utilizan AbortController o clearTimeout cuando corresponde. Elegí Promise.allSettled() frente a Promise.all() para aprovechar los Pokémon recibidos aunque una petición del lote falle.
