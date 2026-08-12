# tools/

## gen-projects-seo.mjs

Regenera, a partir de `data/projects.json`, los dos bloques `AUTO-GEN` de
`index.html`: el JSON-LD `ItemList` del `<head>` y el HTML estático dentro de
`#projects-container`.

```bash
node tools/gen-projects-seo.mjs
```

**Ejecútalo cada vez que edites `data/projects.json`**, o el HTML estático
quedará desincronizado del JSON (y desincronizado del que pinta el JS, que es
justo lo que Google penaliza como cloaking).

No es un paso de build: el sitio funciona sin ejecutarlo. Ese HTML es solo la
versión sin JS que ven los rastreadores que no ejecutan JavaScript (LinkedIn,
Slack, bots de IA, y Googlebot en su primera pasada); `renderProjects()` hace
`innerHTML = ''` y lo sustituye por las tarjetas interactivas al arrancar.

Solo necesita Node — sin dependencias, sin `npm install`.

## og-template.html

Fuente de `img/og-image.png` — la imagen 1200×630 que aparece al compartir el
portafolio en LinkedIn, WhatsApp o X.

Para regenerarla tras editar el template (Chrome debe estar instalado):

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
  --window-size=1200,630 --virtual-time-budget=6000 `
  --screenshot="img\og-image.png" `
  "file:///$((Resolve-Path .\tools\og-template.html).Path -replace '\\','/')"
```

Las medidas 1200×630 están declaradas en los meta tags de `index.html`
(`og:image:width` / `og:image:height`): si cambias el `--window-size`,
actualízalos también o el preview se rompe.

Este directorio no forma parte del sitio publicado.
