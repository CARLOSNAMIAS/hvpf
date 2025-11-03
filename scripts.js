/**
 * @file scripts.js
 * @description Maneja la interactividad del portafolio, incluyendo la renderización dinámica de proyectos
 * y la lógica del chatbot.
 * @author Carlos Gomez
 */

// =============================================
// ============== CONSTANTES ===================
// =============================================

const SELECTORS = {
    PROJECTS_CONTAINER: '#projects-container',
    MODAL: '#project-modal',
    MODAL_OVERLAY: '#project-modal-overlay',
    MODAL_CONTENT: '#project-modal-content',
    MODAL_CLOSE: '#project-modal-close',
    CHATBOT_TOGGLE: '#chatbot-toggle',
    CHATBOT_WINDOW: '#chatbot-window',
    CHATBOT_CLOSE: '#chatbot-close',
    CHATBOT_OVERLAY: '#chatbot-overlay',
    USER_INPUT: '#userInput',
    NOTIFICATION: '#notification',
    CHATBOX: '.chatbox'
};

const AVATAR_IMAGE = './img/carlosjose.PNG';
const AVATAR_ALT = 'Carlos Gómez';
const USERNAME = '@carlosgomez';
const DISPLAY_NAME = 'Carlos Gómez';

// =============================================
// ============== INICIALIZACIÓN ===============
// =============================================

// Inicializa la librería AOS para animaciones al hacer scroll.
AOS.init({
    duration: 800,
    once: true
});

/**
 * @typedef {Object} Project
 * @property {string[]} images - Array de rutas a las imágenes del proyecto.
 * @property {string} alt - Texto alternativo para las imágenes.
 * @property {string} title - Título del proyecto.
 * @property {string} text - Descripción del proyecto.
 * @property {string} link - URL al proyecto desplegado o a una página de "próximamente".
 */

/**
 * @type {Project[]}
 * @description Base de datos de los proyectos a mostrar en el portafolio.
 */
let projects = [];

// =============================================
// ============== UTILIDADES ===================
// =============================================

/**
 * Escapa caracteres HTML para prevenir ataques XSS.
 * @param {string} text - El texto a escapar.
 * @returns {string} Texto con caracteres HTML escapados.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Valida que un proyecto tenga la estructura correcta.
 * @param {Object} project - El proyecto a validar.
 * @returns {boolean} True si el proyecto es válido.
 */
function isValidProject(project) {
    return (
        project &&
        Array.isArray(project.images) &&
        typeof project.alt === 'string' &&
        typeof project.title === 'string' &&
        typeof project.text === 'string' &&
        typeof project.link === 'string'
    );
}

/**
 * Crea un debounce para funciones.
 * @param {Function} func - Función a ejecutar.
 * @param {number} wait - Tiempo de espera en milisegundos.
 * @returns {Function} Función con debounce aplicado.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================
// ============== LÓGICA DEL CHATBOT ===========
// =============================================

/**
 * @description Almacena las posibles respuestas del chatbot, categorizadas por intención.
 */
const chatbotResponses = {
    greetings: [
        "¡Hola! 👋 Soy el asistente virtual de Carlos. ¿En qué puedo ayudarte?",
        "¡Hola! Bienvenido. ¿Qué te gustaría saber sobre Carlos?",
        "¡Hey! ¿En qué puedo asistirte hoy?"
    ],
    about: [
        "Carlos es un Desarrollador Frontend especializado en crear aplicaciones web y servicios cloud. Domina HTML, CSS, JavaScript y Bootstrap. 💻",
        "Carlos se enfoca en desarrollar interfaces responsivas y funcionales que optimizan la experiencia del usuario. También trabaja con tecnologías cloud. ☁️"
    ],
    projects: (numProjects) => [
        `Carlos ha trabajado en ${numProjects} proyectos increíbles, incluyendo clones de Nintendo, TikTok, sistemas de facturación y más. ¿Quieres ver alguno específico? 🚀`,
        "Entre sus proyectos destacan: una app de música con API de Deezer, un clon de TikTok, y sistemas de gestión de restaurantes. ¡Échales un vistazo! 📱"
    ],
    skills: [
        "Carlos domina: HTML5, CSS3, JavaScript, Bootstrap, y tecnologías Cloud. También tiene experiencia con APIs y diseño responsive. 🎯",
        "Sus habilidades principales son Frontend Development, Cloud Computing y creación de interfaces intuitivas y modernas. ⚡"
    ],
    contact: [
        "Puedes contactar a Carlos a través del formulario en la sección de Contacto, o por sus redes sociales: GitHub, LinkedIn y Twitter. 📧",
        "¡Genial! Usa el formulario de contacto en esta página o envíale un mensaje directo por sus redes sociales. 💬"
    ],
    thanks: [
        "¡De nada! ¿Hay algo más en lo que pueda ayudarte? 😊",
        "¡Un placer ayudarte! Si tienes más preguntas, aquí estoy. 🤝"
    ],
    default: [
        "Interesante pregunta. Te sugiero revisar el portafolio de Carlos o contactarlo directamente para más información. 🤔",
        "No estoy seguro de cómo responder a eso, pero puedo ayudarte con información sobre Carlos, sus proyectos, habilidades o cómo contactarlo. 💡"
    ]
};

/**
 * Obtiene una respuesta del bot basada en el mensaje del usuario.
 * Analiza el mensaje para identificar palabras clave y determinar la intención.
 * @param {string} userMessage - El mensaje escrito por el usuario.
 * @returns {string} Una respuesta seleccionada aleatoriamente de la categoría correspondiente.
 */
function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    if (msg.match(/hola|hi|hey|buenos|saludos|que tal/i)) {
        return getRandomResponse(chatbotResponses.greetings);
    }
    if (msg.match(/quien es|sobre|acerca de|quien eres|conocer|información|quien|que hace/i)) {
        return getRandomResponse(chatbotResponses.about);
    }
    if (msg.match(/proyecto|trabajo|portafolio|desarrollado|aplicacion|app|nintendo|tiktok|musica/i)) {
        const numProjects = projects.length > 0 ? projects.length : 'varios';
        return getRandomResponse(chatbotResponses.projects(numProjects));
    }
    if (msg.match(/habilidad|tecnologia|lenguaje|sabe|domina|conocimiento|experiencia|stack/i)) {
        return getRandomResponse(chatbotResponses.skills);
    }
    if (msg.match(/contacto|contactar|email|correo|escribir|mensaje|hablar|comunicar/i)) {
        return getRandomResponse(chatbotResponses.contact);
    }
    if (msg.match(/gracias|thanks|thank you|genial|excelente|perfecto/i)) {
        return getRandomResponse(chatbotResponses.thanks);
    }

    return getRandomResponse(chatbotResponses.default);
}

/**
 * Selecciona una respuesta aleatoria de un array de respuestas.
 * @param {string[]} responses - Un array de strings con posibles respuestas.
 * @returns {string} Una única respuesta del array.
 */
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Añade un mensaje a la ventana del chat.
 * @param {string} message - El contenido del mensaje a añadir.
 * @param {boolean} [isUser=false] - True si el mensaje es del usuario, false si es del bot.
 */
function addMessage(message, isUser = false) {
    const chatbox = document.querySelector(SELECTORS.CHATBOX);
    if (!chatbox) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-content';
    messageDiv.style.marginBottom = '12px';

    const escapedMessage = escapeHtml(message);

    if (isUser) {
        messageDiv.style.backgroundColor = 'var(--accent-color)';
        messageDiv.style.color = 'white';
        messageDiv.style.marginLeft = 'auto';
        messageDiv.style.maxWidth = '80%';
        messageDiv.innerHTML = `<strong>Tú:</strong> ${escapedMessage}`;
    } else {
        messageDiv.innerHTML = `<strong>Chatbot:</strong> ${escapedMessage}`;
    }

    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

/**
 * Desplaza suavemente la vista a una sección específica de la página.
 * @param {string} sectionId - El ID del elemento de la sección a la que se quiere desplazar (ej. '#projects').
 */
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            closeChatbot();
        }, 500);
    }
}

/**
 * Muestra una notificación temporal en la pantalla.
 * @param {string} message - El mensaje que se mostrará en la notificación.
 */
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

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
                            <i class="bi bi-upload"></i>
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
                        <i class="bi bi-upload"></i>
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

// =============================================
// ========== LÓGICA DEL CHATBOT UI ============
// =============================================

/**
 * Abre la ventana del chatbot.
 */
function openChatbot() {
    const chatbotOverlay = document.querySelector(SELECTORS.CHATBOT_OVERLAY);
    const chatbotWindow = document.querySelector(SELECTORS.CHATBOT_WINDOW);
    const userInput = document.querySelector(SELECTORS.USER_INPUT);
    
    if (!chatbotOverlay || !chatbotWindow) return;

    chatbotWindow.setAttribute('aria-hidden', 'false');
    chatbotOverlay.classList.add('show');
    chatbotWindow.classList.add('show');
    
    if (userInput) {
        userInput.focus();
    }
}

/**
 * Cierra la ventana del chatbot.
 */
function closeChatbot() {
    const chatbotOverlay = document.querySelector(SELECTORS.CHATBOT_OVERLAY);
    const chatbotWindow = document.querySelector(SELECTORS.CHATBOT_WINDOW);
    
    if (!chatbotOverlay || !chatbotWindow) return;

    chatbotWindow.setAttribute('aria-hidden', 'true');
    chatbotOverlay.classList.remove('show');
    chatbotWindow.classList.remove('show');
}

/**
 * Envía un mensaje del usuario al chatbot.
 * @param {HTMLInputElement} inputElement - El elemento de input del usuario.
 */
function sendMessage(inputElement) {
    if (!inputElement) return;
    
    const message = inputElement.value.trim();
    if (message === '') return;

    addMessage(message, true);
    inputElement.value = '';

    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response);
    }, 500);
}

// =============================================
// ============== INICIALIZACIÓN ===============
// =============================================

/**
 * @description Event listener que se ejecuta cuando el DOM está completamente cargado.
 * Se encarga de inicializar la renderización de proyectos y la lógica del chatbot.
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector(SELECTORS.PROJECTS_CONTAINER);

    // =============================================
    // ========== CARGAR PROYECTOS =================
    // =============================================
    
    if (projectsContainer) {
        fetch('projects.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('El formato de datos no es válido');
                }
                projects = data;
                renderProjects(projects, projectsContainer);
            })
            .catch(error => {
                console.error('Error al cargar los proyectos:', error);
                projectsContainer.innerHTML = `
                    <div class="error-message" style="text-align: center; padding: 2rem;">
                        <p style="color: var(--text-color); margin-bottom: 1rem;">
                            ⚠️ Error al cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
                        </p>
                        <button onclick="location.reload()" class="btn-x" style="cursor: pointer;">
                            Reintentar
                        </button>
                    </div>
                `;
            });
    }

    // =============================================
    // ========== EVENTOS DE PROYECTOS =============
    // =============================================
    
    if (projectsContainer) {
        projectsContainer.addEventListener('click', async (e) => {
            const target = e.target;
            
            // PRIORIDAD 1: Si es un enlace o está dentro de un enlace, dejarlo funcionar normalmente
            const linkElement = target.closest('a.project-link');
            if (linkElement) {
                // Dejar que el navegador maneje el click en el enlace
                return;
            }

            // Ahora sí, obtener la tarjeta del proyecto para las demás acciones
            const projectCard = target.closest('.project-card');
            if (!projectCard) return;
            
            const projectIndex = parseInt(projectCard.dataset.projectIndex, 10);
            if (isNaN(projectIndex) || !projects[projectIndex]) {
                console.warn('Índice de proyecto inválido:', projectIndex);
                return;
            }
            
            const project = projects[projectIndex];

            // Acción: Click en el botón 'like'
            const likeAction = target.closest('.like-action');
            if (likeAction) {
                e.preventDefault();
                e.stopPropagation();
                likeAction.classList.toggle('liked');
                return;
            }

            // Acción: Click en el botón 'share'
            const shareAction = target.closest('.share-action');
            if (shareAction) {
                e.preventDefault();
                e.stopPropagation();
                
                const shareData = {
                    title: `Proyecto de Carlos Gómez: ${project.title}`,
                    text: project.text,
                    url: project.link
                };

                // Usar la API de Web Share si está disponible
                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                        console.log('Contenido compartido con éxito:', project.title);
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error al compartir:', error);
                        }
                    }
                } else {
                    // Fallback: copiar al portapapeles
                    try {
                        await navigator.clipboard.writeText(project.link);
                        showNotification(`¡Enlace de "${project.title}" copiado al portapapeles!`);
                    } catch (err) {
                        console.error('Error al copiar al portapapeles:', err);
                        showNotification('Error al copiar el enlace.');
                    }
                }
                return;
            }

            // Acción: Click en cualquier otra parte de la tarjeta para abrir el modal
            e.preventDefault();
            openModal(project);
        });
    }

    // =============================================
    // ========== EVENTOS DEL MODAL ================
    // =============================================
    
    const closeModalBtn = document.querySelector(SELECTORS.MODAL_CLOSE);
    const modalOverlay = document.querySelector(SELECTORS.MODAL_OVERLAY);

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector(SELECTORS.MODAL);
            if (modal && modal.classList.contains('show')) {
                closeModal();
            }
            const chatbotWindow = document.querySelector(SELECTORS.CHATBOT_WINDOW);
            if (chatbotWindow && chatbotWindow.classList.contains('show')) {
                closeChatbot();
            }
        }
    });

    // =============================================
    // ========== EVENTOS DEL CHATBOT ==============
    // =============================================
    
    const chatbotToggle = document.querySelector(SELECTORS.CHATBOT_TOGGLE);
    const chatbotWindow = document.querySelector(SELECTORS.CHATBOT_WINDOW);
    const chatbotClose = document.querySelector(SELECTORS.CHATBOT_CLOSE);
    const chatbotOverlay = document.querySelector(SELECTORS.CHATBOT_OVERLAY);
    const userInput = document.querySelector(SELECTORS.USER_INPUT);

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', openChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }

    if (chatbotOverlay) {
        chatbotOverlay.addEventListener('click', closeChatbot);
    }

    // Lógica para ocultar/mostrar el botón del chatbot al hacer scroll
    let lastScrollTop = 0;
    
    const handleScroll = debounce(() => {
        if (chatbotToggle) {
            chatbotToggle.classList.remove('hidden');
        }
    }, 250);

    window.addEventListener('scroll', () => {
        if (!chatbotToggle) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            chatbotToggle.classList.add('hidden');
        } else {
            chatbotToggle.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        handleScroll();
    });

    // Manejo de botones de acceso rápido del chatbot
    const quickButtons = document.querySelectorAll('.chatbot-body .btn-x.btn-sm');
    quickButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();

            if (buttonText === 'Ver proyectos') {
                addMessage('Ver proyectos', true);
                addMessage('¡Genial! Te llevaré a la sección de proyectos. 🚀');
                setTimeout(() => scrollToSection('#projects'), 800);
            } else if (buttonText === 'Saber más sobre Carlos') {
                addMessage('Saber más sobre Carlos', true);
                addMessage(getRandomResponse(chatbotResponses.about));
            } else if (buttonText === 'Contactarlo') {
                addMessage('Contactarlo', true);
                addMessage('¡Perfecto! Te dirijo al formulario de contacto. 📧');
                setTimeout(() => scrollToSection('#contact'), 800);
            }
        });
    });

    // Lógica para enviar mensajes
    const sendButton = document.querySelector('.chatbot-body .btn-x');
    
    if (sendButton) {
        sendButton.addEventListener('click', () => sendMessage(userInput));
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(userInput);
            }
        });
    }
});

/**
 * Asegura que la página se cargue desde el principio.
 */
window.onload = function () {
    window.scrollTo(0, 0);
};