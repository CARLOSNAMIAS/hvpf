/**
 * @file chatbot.js
 * @description Lógica y manejo de la interfaz del chatbot.
 * @author Carlos Gomez
 */

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
