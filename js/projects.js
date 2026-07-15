/**
 * @file projects.js
 * @description Lógica para renderizar los proyectos, sus carruseles de imágenes
 * y el recorte de las descripciones largas.
 * @author Carlos Gomez
 */

// =============================================
// ============ RENDERIZADO DE PROYECTOS =======
// =============================================

/**
 * Normaliza una entrada de `images`, que puede venir como ruta suelta o como
 * objeto con dimensiones.
 * @param {string|{src: string, w?: number, h?: number}} image
 * @returns {{src: string, w?: number, h?: number}|null} null si la entrada es inválida.
 */
function normalizeImage(image) {
    if (typeof image === 'string') return { src: image };
    return image && typeof image.src === 'string' ? image : null;
}

/**
 * Crea el HTML para una cuadrícula de imágenes de proyecto.
 * Soporta de 1 a 4 imágenes, ajustando el layout de la cuadrícula dinámicamente.
 * En móvil el CSS convierte esta misma cuadrícula en un carrusel con scroll-snap,
 * por eso las imágenes van envueltas en .project-media junto a sus puntos.
 * @param {Array<string|{src: string, w?: number, h?: number}>} images - Imágenes del proyecto.
 * @param {string} alt - Texto alternativo base para las imágenes.
 * @returns {string} El string HTML del bloque de imágenes, o un string vacío si no hay imágenes.
 */
function createImageGrid(images, alt) {
    const items = images.map(normalizeImage).filter(Boolean).slice(0, 4);
    const count = items.length;
    if (count === 0) return '';

    const escapedAlt = escapeHtml(alt);
    let gridHtml = `<div class="project-image-grid grid-${count}">`;

    items.forEach((image, i) => {
        const escapedImage = escapeHtml(image.src);
        // El ancho/alto reales dejan que el navegador deduzca la proporción y
        // reserve la caja correcta: sin ellos, object-fit: contain no sabe
        // cuánto espacio pedir hasta que la imagen termina de cargar.
        const dimensions = Number(image.w) > 0 && Number(image.h) > 0
            ? ` width="${Number(image.w)}" height="${Number(image.h)}"`
            : '';
        // Repetir el mismo alt en cada imagen suena a duplicado en un lector de
        // pantalla; numerarlas las distingue.
        const label = count > 1 ? `${escapedAlt} (${i + 1} de ${count})` : escapedAlt;
        gridHtml += `<div class="grid-item"><img src="${escapedImage}" alt="${label}"${dimensions} loading="lazy"></div>`;
    });

    gridHtml += `</div>`;

    // Los puntos viven fuera del carrusel para no desplazarse con él.
    const dotsHtml = count > 1
        ? `<div class="carousel-dots" aria-hidden="true">${
            items.map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}"></span>`).join('')
        }</div>`
        : '';

    return `<div class="project-media">${gridHtml}${dotsHtml}</div>`;
}

/**
 * Revela el botón "Mostrar más" solo en las descripciones que de verdad se
 * quedan cortas con el recorte del CSS.
 * @param {HTMLElement} root - Contenedor donde buscar las tarjetas.
 */
function initTextClamps(root) {
    if (!root) return;

    root.querySelectorAll('.project-card-text-wrap').forEach(wrap => {
        const text = wrap.querySelector('.project-card-text');
        const toggle = wrap.querySelector('.project-text-toggle');
        if (!text || !toggle) return;

        // Preguntarle al layout en vez de contar caracteres: así acierta con
        // cualquier descripción, tamaño de fuente o ancho de pantalla, y en
        // escritorio (donde no hay recorte) el botón no llega a aparecer.
        const syncToggle = () => {
            if (wrap.classList.contains('expanded')) return;
            toggle.hidden = text.scrollHeight <= text.clientHeight + 2;
        };

        toggle.addEventListener('click', (e) => {
            // #projects-container escucha los clicks de la tarjeta (like, compartir);
            // desplegar el texto no es asunto suyo.
            e.stopPropagation();

            const expanded = wrap.classList.toggle('expanded');
            toggle.textContent = expanded ? 'Mostrar menos' : 'Mostrar más';
            toggle.setAttribute('aria-expanded', String(expanded));
        });

        syncToggle();
        window.addEventListener('resize', debounce(syncToggle, 150));

        // Inter llega por red: medir con la tipografía de reserva da un alto
        // distinto al final, y el botón podría sobrar o faltar.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(syncToggle);
        }
    });
}

/**
 * Activa los carruseles de un contenedor ya renderizado: sincroniza los puntos
 * con el scroll y evita que un swipe se cuente como click en el enlace.
 * @param {HTMLElement} root - Contenedor donde buscar los carruseles.
 */
function initCarousels(root) {
    if (!root) return;

    root.querySelectorAll('.project-media').forEach(media => {
        const grid = media.querySelector('.project-image-grid');
        const dots = [...media.querySelectorAll('.carousel-dot')];
        if (!grid) return;

        if (dots.length > 1) {
            const syncDots = () => {
                const index = Math.round(grid.scrollLeft / grid.clientWidth);
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            };
            grid.addEventListener('scroll', debounce(syncDots, 60), { passive: true });
        }

        // El carrusel va dentro de un <a>, así que arrastrar para pasar de
        // imagen terminaría abriendo el proyecto. Si el puntero se movió, no es
        // un tap: cancelamos la navegación.
        const link = media.closest('a.project-link');
        if (!link) return;

        let startX = 0;
        let startY = 0;
        media.addEventListener('pointerdown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
        });

        link.addEventListener('click', (e) => {
            // Un click de teclado no trae coordenadas; siempre debe pasar.
            if (e.detail === 0) return;
            if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
}

/**
 * Renderiza los proyectos en el contenedor especificado.
 * @param {Project[]} projectsToRender - El array de proyectos a renderizar.
 * @param {HTMLElement} container - El contenedor donde renderizar los proyectos.
 */
function renderProjects(projectsToRender, container) {
    if (!container) return;

    container.innerHTML = '';

    projectsToRender.forEach((project, index) => {
        if (!isValidProject(project)) {
            console.warn(`Proyecto en índice ${index} tiene estructura inválida:`, project);
            return;
        }

        const imageGridHtml = createImageGrid(project.images.slice(0, 2), project.alt);
        const isExternal = project.link.startsWith('http');
        const linkAttrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
        const escapedLink = escapeHtml(project.link);
        const escapedTitle = escapeHtml(project.title);
        const escapedText = escapeHtml(project.text);

        // Los proyectos sin enlace público (link: "#") no llevan <a>: un href="#"
        // no navega a ninguna parte, solo salta al inicio de la página.
        const media = isExternal
            ? `<a href="${escapedLink}" ${linkAttrs} aria-label="Ver proyecto: ${escapedTitle}" class="project-link" data-project-url="${escapedLink}">${imageGridHtml}</a>`
            : imageGridHtml;

        const projectCard = `
            <div class="project-card" data-aos="fade-up" data-project-index="${index}">
                <img src="${AVATAR_IMAGE}" alt="${AVATAR_ALT}" class="project-avatar" loading="lazy">
                <div class="project-card-content">
                    <div class="project-card-header">
                        <span class="name">${DISPLAY_NAME}</span>
                        <span class="username">${USERNAME}</span>
                    </div>
                    <div class="project-card-body">
                        <div class="project-card-text-wrap">
                            <p class="project-card-text"><strong>${escapedTitle}</strong>: ${escapedText}</p>
                            <button type="button" class="project-text-toggle" aria-expanded="false" hidden>Mostrar más</button>
                        </div>
                        ${media}
                    </div>
                    <div class="project-card-footer">
                        <div class="action" role="button" tabindex="0" aria-label="Comentar">
                            <i class="bi bi-chat"></i> <span></span>
                        </div>
                        <div class="action" role="button" tabindex="0" aria-label="Retweet">
                            <i class="bi bi-arrow-repeat"></i> <span></span>
                        </div>
                        <div class="action like-action" role="button" tabindex="0" aria-label="Me gusta">
                            <i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i> <span></span>
                        </div>
                        <div class="action share-action" role="button" tabindex="0" aria-label="Compartir">
                            <i class="bi bi-share"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', projectCard);
    });

    initCarousels(container);
    initTextClamps(container);
    AOS.refresh();
}

