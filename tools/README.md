# tools/

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
