/**
 * @file scripts.js
 * @description Maneja la interactividad del portafolio, incluyendo la renderización dinámica de proyectos
 * y la lógica del chatbot.
 * @author Carlos Gomez
 */

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
        return getRandomResponse(chatbotResponses.projects(projects.length));
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
    const chatbox = document.querySelector('.chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-content';
    messageDiv.style.marginBottom = '12px';

    if (isUser) {
        messageDiv.style.backgroundColor = 'var(--accent-color)';
        messageDiv.style.color = 'white';
        messageDiv.style.marginLeft = 'auto';
        messageDiv.style.maxWidth = '80%';
        messageDiv.innerHTML = `<strong>Tú:</strong> ${message}`;
    } else {
        messageDiv.innerHTML = `<strong>Chatbot:</strong> ${message}`;
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
    let gridHtml = `<div class="${gridClass}">`;

    for (let i = 0; i < Math.min(count, 4); i++) {
        gridHtml += `<div class="grid-item"><img src="${images[i]}" alt="${alt}" loading="lazy"></div>`;
    }

    gridHtml += `</div>`;
    return gridHtml;
}

// =============================================
// ============== INICIALIZACIÓN ===============
// =============================================

/**
 * @description Event listener que se ejecuta cuando el DOM está completamente cargado.
 * Se encarga de inicializar la renderización de proyectos y la lógica del chatbot.
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');

    // Cargar y renderizar proyectos desde JSON
    if (projectsContainer) {
        fetch('projects.json')
            .then(response => response.json())
            .then(data => {
                projects = data; // Guardar los proyectos en la variable global
                renderProjects(projects);
            })
            .catch(error => {
                console.error('Error al cargar los proyectos:', error);
                projectsContainer.innerHTML = '<p>Error al cargar los proyectos. Inténtalo de nuevo más tarde.</p>';
            });
    }

    /**
     * Renderiza los proyectos en el contenedor especificado.
     * @param {Project[]} projectsToRender - El array de proyectos a renderizar.
     */
    function renderProjects(projectsToRender) {
        projectsContainer.innerHTML = ''; // Limpiar el contenedor
        projectsToRender.forEach(project => {
            const imageGridHtml = createImageGrid(project.images, project.alt);
            const projectCard = `
                <div class="project-card" data-aos="fade-up">
                    <img src="./img/carlosjose.PNG" alt="Carlos Gómez" class="project-avatar" loading="lazy">
                    <div class="project-card-content">
                        <div class="project-card-header">
                            <span class="name">Carlos Gómez</span>
                            <span class="username">@carlosgomez</span>
                        </div>
                        <div class="project-card-body">
                            <p class="project-card-text"><strong>${project.title}</strong>: ${project.text}</p>
                            <a href="${project.link}" ${project.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
                                ${imageGridHtml}
                            </a>
                        </div>
                        <div class="project-card-footer">
                            <div class="action"><i class="bi bi-chat"></i> <span></span></div>
                            <div class="action"><i class="bi bi-arrow-repeat"></i> <span></span></div>
                            <div class="action"><i class="bi bi-heart"></i> <span></span></div>
                            <div class="action"><i class="bi bi-upload"></i></div>
                        </div>
                    </div>
                </div>
            `;
            projectsContainer.innerHTML += projectCard;
        });
        // Re-inicializar AOS para las nuevas tarjetas de proyecto si es necesario
        AOS.refresh();
    }

    // Lógica para controlar el chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const userInput = document.getElementById('userInput');
    const sendButton = document.querySelector('.chatbot-body .btn-x');

    function openChatbot() {
        chatbotOverlay.classList.add('show');
        chatbotWindow.classList.add('show');
        userInput.focus();
    }

    function closeChatbot() {
        chatbotOverlay.classList.remove('show');
        chatbotWindow.classList.remove('show');
    }

    if (chatbotToggle && chatbotWindow && chatbotClose && chatbotOverlay) {
        chatbotToggle.addEventListener('click', openChatbot);
        chatbotClose.addEventListener('click', closeChatbot);
        chatbotOverlay.addEventListener('click', closeChatbot);
    }

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
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        userInput.value = '';

        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response);
        }, 500);
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // ====== DYNAMIC HEADER TITLE LOGIC ======
    const headerTitle = document.querySelector('.header-title');
    const sections = document.querySelectorAll('main section[data-title]');

    const observerOptions = {
        root: null, // Observa intersecciones relativas al viewport
        rootMargin: '0px 0px -85% 0px', // Activa cuando el 15% superior de la sección es visible
        threshold: 0
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                headerTitle.textContent = entry.target.dataset.title;
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

/**
 * Asegura que la página se cargue desde el principio.
 */
window.onload = function () {
    window.scrollTo(0, 0);
};