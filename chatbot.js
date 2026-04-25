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
        "¡Hola! 👋 Soy el asistente de Carlos. ¿Quieres saber sobre sus proyectos, su stack o cómo contratarlo?",
        "¡Hey! Bienvenido al portafolio de Carlos. ¿En qué puedo ayudarte?",
        "¡Hola! ¿Qué te gustaría saber sobre Carlos?"
    ],
    about: [
        "Carlos es un AI-Native Full-Stack Developer basado en Colombia. Fundó Emergencia Colombia S.A.S. — una plataforma civic-tech con 3 apps en producción. Trabaja en solitario usando Claude Code, Cursor y Figma MCP. 🚀",
        "Carlos es desarrollador full-stack con workflow AI-native. Su stack principal es Next.js 15 + TypeScript + Supabase + Turborepo. También trabaja con clientes freelance como Small Bites English Academy. 💻"
    ],
    projects: (numProjects) => [
        `Carlos tiene ${numProjects} proyectos en el portafolio. El flagship es Emergencia Colombia — monorepo Turborepo con Reporta CO, Paramédicos CO y Admin Panel en producción. ¿Quieres ver alguno? 🚨`,
        "Sus proyectos destacados: Emergencia Colombia (civic-tech, 3 apps en producción), Small Bites English Academy (mini-LMS freelance) y SonicWave Radio. Todos con Next.js, Supabase y Tailwind. 📱"
    ],
    skills: [
        "Stack de Carlos: Next.js 15, TypeScript, Supabase, Tailwind, Zustand, Turborepo, React Native, Leaflet/OSRM. Herramientas AI: Claude Code, Cursor, Figma MCP. Deploy en Vercel. ⚡",
        "Carlos trabaja con un workflow 100% AI-assisted: Claude Code para arquitectura, Cursor para edición y Figma MCP para diseño-to-code. Stack principal: Next.js 15 + Supabase + TypeScript. 🎯"
    ],
    contact: [
        "Puedes escribirle directamente desde el formulario de Contacto en esta página. También está en GitHub como CARLOSNAMIAS. 📧",
        "Usa el formulario de contacto aquí abajo. Carlos está disponible para proyectos remotos en LATAM y US time zones. 💬"
    ],
    thanks: [
        "¡De nada! ¿Algo más sobre Carlos o sus proyectos? 😊",
        "¡Un placer! Si tienes más preguntas, aquí estoy. 🤝"
    ],
    default: [
        "Puedo contarte sobre Carlos, sus proyectos, su stack AI-native o cómo contratarlo. ¿Qué te interesa? 🤔",
        "No tengo esa info, pero puedo ayudarte con proyectos, habilidades o contacto. ¿Qué necesitas? 💡"
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
    if (msg.match(/quien es|sobre|acerca de|quien eres|conocer|información|quien|que hace|founder|emergencia/i)) {
        return getRandomResponse(chatbotResponses.about);
    }
    if (msg.match(/proyecto|trabajo|portafolio|desarrollado|aplicacion|app|smallbites|sonicwave|lms/i)) {
        const numProjects = projects.length > 0 ? projects.length : 'varios';
        return getRandomResponse(chatbotResponses.projects(numProjects));
    }
    if (msg.match(/habilidad|tecnologia|lenguaje|sabe|domina|conocimiento|experiencia|stack|next|supabase|claude|cursor|ai|typescript/i)) {
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
