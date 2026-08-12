/**
 * Genera, a partir de `data/projects.json`, los dos bloques de `index.html` que
 * hacen visibles los proyectos para los rastreadores:
 *
 *   1. El JSON-LD `ItemList` del <head>.
 *   2. El HTML estático dentro de #projects-container.
 *
 * Por qué hace falta: las tarjetas de proyecto las pinta `renderProjects()` en
 * el cliente tras un `fetch`. Googlebot ejecuta JS, pero en una segunda pasada
 * diferida, y los rastreadores de LinkedIn, Slack, Bing y los bots de IA a
 * menudo no lo hacen — veían la sección Proyectos vacía.
 *
 * No es un paso de build: el sitio sigue funcionando sin ejecutar esto. El HTML
 * estático es solo la versión sin JS; `renderProjects()` hace `innerHTML = ''`
 * y lo sustituye por las tarjetas interactivas en cuanto el JS arranca. El
 * texto de ambas versiones es el mismo, así que no hay cloaking.
 *
 * Ejecútalo cada vez que edites `data/projects.json`:
 *
 *   node tools/gen-projects-seo.mjs
 *
 * Es idempotente: reescribe solo lo que hay entre los marcadores AUTO-GEN.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://carlosnamias.vercel.app';

const escapeHtml = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

/** './img/x.webp' -> 'https://carlosnamias.vercel.app/img/x.webp' */
const absUrl = (src) => `${SITE}/${String(src).replace(/^\.?\//, '')}`;

/** Sustituye el contenido entre <!-- AUTO-GEN:name --> y <!-- /AUTO-GEN:name -->. */
function replaceBlock(html, name, body) {
    const re = new RegExp(
        `([ \\t]*)<!-- AUTO-GEN:${name} -->[\\s\\S]*?<!-- /AUTO-GEN:${name} -->`
    );
    if (!re.test(html)) throw new Error(`No encuentro los marcadores AUTO-GEN:${name} en index.html`);
    return html.replace(re, (_m, indent) =>
        `${indent}<!-- AUTO-GEN:${name} — generado por tools/gen-projects-seo.mjs, no editar a mano -->\n` +
        body.replace(/^/gm, indent) +
        `\n${indent}<!-- /AUTO-GEN:${name} -->`
    );
}

const projects = JSON.parse(await readFile(join(ROOT, 'data', 'projects.json'), 'utf8'));

// ---- 1. JSON-LD ItemList ----------------------------------------------------
const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Proyectos de Carlos Gómez',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => {
        const item = {
            '@type': 'CreativeWork',
            name: p.title,
            description: p.text,
            image: p.images.map((img) => absUrl(typeof img === 'string' ? img : img.src)),
            author: { '@type': 'Person', name: 'Carlos Gómez' }
        };
        // link "#" = proyecto sin URL pública; no se declara `url`.
        if (p.link && p.link.startsWith('http')) item.url = p.link;
        return { '@type': 'ListItem', position: i + 1, item };
    })
};

const jsonLd =
    '<script type="application/ld+json">\n' +
    JSON.stringify(itemList, null, 2) +
    '\n</script>';

// ---- 2. HTML estático de respaldo ------------------------------------------
const cards = projects.map((p) => {
    const title = escapeHtml(p.title);
    const isExternal = p.link && p.link.startsWith('http');
    const heading = isExternal
        ? `<h3><a href="${escapeHtml(p.link)}" target="_blank" rel="noopener noreferrer">${title}</a></h3>`
        : `<h3>${title}</h3>`;
    const imgs = p.images
        .slice(0, 2)
        .map((img) => {
            const { src, w, h } = typeof img === 'string' ? { src: img } : img;
            const dims = w && h ? ` width="${w}" height="${h}"` : '';
            return `  <img src="${escapeHtml(src)}" alt="${escapeHtml(p.alt)}"${dims} loading="lazy">`;
        })
        .join('\n');
    return `<article class="project-fallback">\n  ${heading}\n  <p>${escapeHtml(p.text)}</p>\n${imgs}\n</article>`;
}).join('\n');

const fallback =
    '<!-- Versión sin JS de las tarjetas. renderProjects() la reemplaza por las\n' +
    '     tarjetas interactivas; existe para los rastreadores que no ejecutan JS. -->\n' +
    cards;

// ---- Escribir ---------------------------------------------------------------
const indexPath = join(ROOT, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = replaceBlock(html, 'projects-jsonld', jsonLd);
html = replaceBlock(html, 'projects-fallback', fallback);
await writeFile(indexPath, html, 'utf8');

console.log(`index.html actualizado con ${projects.length} proyectos (JSON-LD + HTML estático).`);
