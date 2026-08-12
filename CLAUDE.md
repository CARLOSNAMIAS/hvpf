# CLAUDE.md

Este archivo orienta a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Qué es esto

Un portafolio personal de una sola página (Carlos Gómez) construido como **sitio estático sin paso de build** — HTML, CSS y JavaScript puro. Sin npm, sin bundler, sin framework. Las librerías de terceros (Bootstrap 5.3, Bootstrap Icons, AOS) se cargan desde CDNs, no desde `node_modules`. El lenguaje visual imita deliberadamente a X/Twitter (nav lateral, secciones "tweet-card", tarjetas de proyecto estilizadas como tweets). El contenido está en **español** — mantén el copy de la UI, los comentarios y los mensajes de commit en español para ser consistente.

Desplegado en **Vercel** en `https://carlosnamias.vercel.app`. El repo vive dentro de una carpeta sincronizada con OneDrive (ver `.gitignore`).

## Ejecutar y desarrollar

No hay nada que compilar ni instalar. Sirve la carpeta por HTTP y abre `index.html`:

- **Live Server de VS Code** es el flujo previsto — configurado al puerto `5501` en `.vscode/settings.json`.
- Cualquier servidor estático sirve: `python -m http.server 5501` desde la raíz del repo.

Debes servir por HTTP, no con `file://` — `js/main.js` hace `fetch('data/projects.json')`, que el navegador bloquea bajo el protocolo `file://`.

No hay suite de tests, configuración de linter ni CI en este repo. `.hintrc` configura webhint (solo hinting en el editor).

## Arquitectura

### El orden de carga de los scripts es contractual
`index.html` carga los cinco scripts con `defer` en un **orden obligatorio** porque comparten scope global plano (sin módulos/imports):

1. `js/config.js` — declara las globales que leen los demás: `SELECTORS` (todas las cadenas de consulta al DOM viven aquí, centralizadas), `AVATAR_IMAGE`/`USERNAME`/`DISPLAY_NAME`, y `let projects = []`.
2. `js/utils.js` — `escapeHtml`, `isValidProject`, `debounce`.
3. `js/projects.js` — renderizado: `renderProjects`, `createImageGrid`, `initCarousels`, `initTextClamps`.
4. `js/chatbot.js` — respuestas del chatbot + UI abrir/cerrar/enviar.
5. `js/main.js` — el punto de entrada; conecta `DOMContentLoaded`, hace fetch de los datos de proyectos y enlaza todos los eventos.

Si añades un script o los reordenas, respeta la cadena de dependencias — un archivo debe cargar después de todo lo que referencia.

### Flujo de datos de los proyectos
Los proyectos son **manejados por datos**, no hardcodeados en el HTML. `data/projects.json` es un array de `{ images, alt, title, text, link }`. Al cargar, `main.js` hace fetch, lo asigna a la global `projects` y llama a `renderProjects()`, que inyecta tarjetas estilo tweet en `#projects-container`. Para añadir/editar un proyecto, edita el JSON — no toques el markup de renderizado.

- Cada imagen es `"ruta"` o `{ src, w, h }`. Provee `w`/`h` reales (píxeles intrínsecos) para que el navegador reserve el espacio de layout y evite CLS. Solo se renderizan las **primeras 2** imágenes por proyecto (`project.images.slice(0, 2)`).
- Tras editar el JSON hay que correr `node tools/gen-projects-seo.mjs`, que regenera los bloques `AUTO-GEN` de `index.html` (ver "SEO y rendimiento").
- `link: "#"` significa "sin enlace público" → la tarjeta se renderiza **sin** envoltura `<a>` (proyecto sin terminar/prototipo). Un enlace `http…` abre en una pestaña nueva.
- Todas las cadenas provenientes del JSON pasan por `escapeHtml()` antes de insertarse — mantenlo así; el markup de las tarjetas se construye con template strings + `insertAdjacentHTML`, así que un dato sin escapar es un agujero XSS.

### Seguimiento de sección (header + tab bar móvil)
`main.js` usa un `IntersectionObserver` sobre `section[data-title]` para mantener el título del header fijo y el estado activo de la tab bar móvil en sync con la sección visible. Dos reglas no obvias:
- El caso del final de la página lo maneja un listener de `scroll` aparte (`refreshCurrentSection`), porque el observer deja de dispararse cuando la última sección no puede alcanzar la banda de detección.
- El mapeo pestaña→sección va por `data-tab-for` en `.tabbar a` (ids separados por espacios). En particular `#about` no tiene pestaña propia y se pliega dentro de la pestaña Perfil (`data-tab-for="profile about"`).

### El "chatbot"
`js/chatbot.js` **no** es un LLM — es coincidencia de palabras clave (`getBotResponse` corre regexes sobre la entrada) devolviendo respuestas predefinidas en español. No hay llamada a API ni clave.

### División del layout responsive
Escritorio (>768px) usa el nav lateral `.sidebar`; móvil lo oculta y muestra la `.tabbar` inferior. En móvil la cuadrícula de imágenes del proyecto se convierte en un carrusel con scroll-snap (mismo markup, distinto CSS) — `initCarousels()` sincroniza los puntos y cancela la navegación del enlace de la tarjeta cuando un swipe (movimiento del puntero >10px) se confunde con un tap.

### CSS
Un solo archivo, `css/styles.css` (~1170 líneas), con un comentario de tabla de contenidos al inicio. El theming son propiedades personalizadas de CSS en `:root` con un override `@media (prefers-color-scheme: dark)` — sin toggle de tema, sigue al sistema operativo. **El orden de carga importa**: `styles.css` se enlaza intencionalmente *después* de Bootstrap para que sus selectores de igual especificidad (`body`, `.form-control`) ganen.

## SEO y rendimiento

Dos reglas que se rompen con facilidad:

- **`img/profile.webp` es la imagen LCP.** Va con `loading="eager"`,
  `fetchpriority="high"` y un `<link rel="preload">` en el `<head>`. Nunca le
  pongas `loading="lazy"`: antes lo tenía y pesaba 1,8 MB, lo que hundía Core
  Web Vitals en móvil. Todas las imágenes del sitio son WebP dimensionadas al
  tamaño en que se muestran (el directorio `img/` entero pesa ~750 KB).
- **Los proyectos existen dos veces en `index.html`**, dentro de marcadores
  `<!-- AUTO-GEN:... -->`: un JSON-LD `ItemList` en el `<head>` y HTML estático
  dentro de `#projects-container`. Son la versión que ven los rastreadores que
  no ejecutan JS; `renderProjects()` los reemplaza en el navegador. **No los
  edites a mano** — se regeneran con `node tools/gen-projects-seo.mjs` a partir
  de `data/projects.json`, y deben coincidir con él o Google lo lee como
  cloaking.

## Generación de la imagen OG
`img/og-image.png` (la vista previa social de 1200×630) se genera desde `tools/og-template.html` vía Chrome headless — ver `tools/README.md` para el comando exacto. Si cambias las dimensiones ahí, actualiza también `og:image:width`/`og:image:height` en `index.html`. El directorio `tools/` no forma parte del sitio publicado.

## Trampas
- Editar contenido de proyectos = editar `data/projects.json`, no el JS/HTML — y luego correr `node tools/gen-projects-seo.mjs`.
- Mantén las cinco etiquetas `<script>` en orden y con `defer`.
- La metadata SEO es extensa y se mantiene a mano en el `<head>` de `index.html` (meta tags, Open Graph, Twitter cards, dos bloques JSON-LD). Si cambias el nombre de la persona, el rol o las URLs, actualiza todo esto más `sitemap.xml` y `robots.txt` para mantener la consistencia.
- El formulario de contacto hace POST a FormSubmit (`formsubmit.co`) — sin backend propio.
