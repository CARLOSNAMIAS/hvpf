/**
 * @file projects.js
 * @description Lógica para renderizar proyectos y manejar el modal de vista de proyecto.
 * @author Carlos Gomez
 */

// =============================================
// ============ RENDERIZADO DE PROYECTOS =======
// =============================================

/**
 * Crea el HTML para una cuadrícula de imágenes de proyecto.
 * Soporta de 1 a 4 imágenes, ajustando el layout de la cuadrícula dinámicamente.
 * @param {string[]} images - Array con las URLs de las imágenes.
 * @param {string} alt - Texto alternativo para las imágenes.
 * @returns {string} El string HTML de la cuadrícula de imágenes, o un string vacío si no hay imágenes.
 */
function createImageGrid(images, alt) {
    const count = images.length;
    if (count === 0) return '';

    const gridClass = `project-image-grid grid-${Math.min(count, 4)}`;
    const escapedAlt = escapeHtml(alt);
    let gridHtml = `<div class="${gridClass}">`;

    for (let i = 0; i < Math.min(count, 4); i++) {
        const escapedImage = escapeHtml(images[i]);
        gridHtml += `<div class="grid-item"><img src="${escapedImage}" alt="${escapedAlt}" loading="lazy"></div>`;
    }

    gridHtml += `</div>`;
    return gridHtml;
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

        const imageGridHtml = createImageGrid(project.images, project.alt);
        const isExternal = project.link.startsWith('http');
        const linkAttrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
        const escapedLink = escapeHtml(project.link);
        const escapedTitle = escapeHtml(project.title);
        const escapedText = escapeHtml(project.text);

        const projectCard = `
            <div class="project-card" data-aos="fade-up" data-project-index="${index}">
                <img src="${AVATAR_IMAGE}" alt="${AVATAR_ALT}" class="project-avatar" loading="lazy">
                <div class="project-card-content">
                    <div class="project-card-header">
                        <span class="name">${DISPLAY_NAME}</span>
                        <span class="username">${USERNAME}</span>
                    </div>
                    <div class="project-card-body">
                        <p class="project-card-text"><strong>${escapedTitle}</strong>: ${escapedText}</p>
                        <a href="${escapedLink}" ${linkAttrs} aria-label="Ver proyecto: ${escapedTitle}" class="project-link" data-project-url="${escapedLink}">
                            ${imageGridHtml}
                        </a>
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

    AOS.refresh();
}

// =============================================
// ============ LÓGICA DEL MODAL ===============
// =============================================

let scrollY = 0;

/**
 * Abre el modal con los detalles del proyecto.
 * @param {Project} project - El proyecto a mostrar.
 */
function openModal(project) {
    const modal = document.querySelector(SELECTORS.MODAL);
    const modalOverlay = document.querySelector(SELECTORS.MODAL_OVERLAY);
    const modalContent = document.querySelector(SELECTORS.MODAL_CONTENT);

    if (!modal || !modalOverlay || !modalContent) return;

    // Guardar posición de scroll y congelar el body
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.overflow = 'hidden';

    // Llenar el modal con el contenido del proyecto
    const imageGridHtml = createImageGrid(project.images, project.alt);
    const isExternal = project.link.startsWith('http');
    const linkAttrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
    const escapedLink = escapeHtml(project.link);
    const escapedTitle = escapeHtml(project.title);
    const escapedText = escapeHtml(project.text);

    const projectDetailHtml = `
        <div class="project-card">
            <img src="${AVATAR_IMAGE}" alt="${AVATAR_ALT}" class="project-avatar" loading="lazy">
            <div class="project-card-content">
                <div class="project-card-header">
                    <span class="name">${DISPLAY_NAME}</span>
                    <span class="username">${USERNAME}</span>
                </div>
                <div class="project-card-body">
                    <p class="project-card-text"><strong>${escapedTitle}</strong>: ${escapedText}</p>
                    <a href="${escapedLink}" ${linkAttrs} aria-label="Ver proyecto: ${escapedTitle}" class="project-link" data-project-url="${escapedLink}">
                        ${imageGridHtml}
                    </a>
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

    modalContent.innerHTML = projectDetailHtml;

    // Mostrar el modal con atributos ARIA
    modal.setAttribute('aria-hidden', 'false');
    modalOverlay.classList.add('show');
    modal.classList.add('show');
}

/**
 * Cierra el modal de proyectos.
 */
function closeModal() {
    const modal = document.querySelector(SELECTORS.MODAL);
    const modalOverlay = document.querySelector(SELECTORS.MODAL_OVERLAY);
    const modalContent = document.querySelector(SELECTORS.MODAL_CONTENT);

    if (!modal || !modalOverlay) return;

    // Liberar el body y restaurar la posición del scroll
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);

    // Ocultar el modal
    modal.setAttribute('aria-hidden', 'true');
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');

    // Limpiar el contenido del modal para evitar conflictos
    if (modalContent) {
        setTimeout(() => {
            modalContent.innerHTML = '';
        }, 300); // Esperar a que termine la animación de cierre
    }
}
