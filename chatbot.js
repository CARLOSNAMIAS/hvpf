/**
 * MÓDULO DEL CHATBOT INTELIGENTE
 * 
 * Este módulo implementa un chatbot conversacional para el portafolio de Carlos.
 * Utiliza un sistema de intenciones (intents) basado en palabras clave para 
 * proporcionar respuestas contextuales sobre proyectos, habilidades y contacto.
 * 
 * Características principales:
 * - Sistema de intenciones basado en palabras clave
 * - Respuestas con opciones interactivas (botones)
 * - Indicador de escritura
 * - Soporte para enlaces externos
 * - Respuestas de fallback para consultas no reconocidas
 * 
 * @author Carlos
 * @version 2.0
 */

/**
 * Configuración de datos del chatbot
 * Contiene todas las intenciones, palabras clave, respuestas y opciones
 */
const chatbotData = {
    intents: [
        {
            name: 'saludo',
            keywords: ['hola', 'buenos', 'buenas', 'qué tal'],
            responses: ['¡Hola! Soy el asistente virtual de Carlos. ¿En qué puedo ayudarte hoy?']
        },
        {
            name: 'verProyectos',
            keywords: ['proyectos', 'trabajos', 'portafolio', 'ver proyectos'],
            responses: ['¡Claro! Carlos ha trabajado en varios proyectos. ¿Cuál te gustaría conocer?<br><br>1. Videojuegos Nintendo<br>2. Clon El Corral<br>3. Clon TikTok<br>4. App Music<br>5. Gestión de Comandas<br>6. Proyecto Farmacia (En construcción)'],
            options: [
                { text: 'Videojuegos', payload: 'proyecto nintendo' },
                { text: 'El Corral', payload: 'proyecto el corral' },
                { text: 'TikTok', payload: 'proyecto tiktok' },
                { text: 'App Music', payload: 'proyecto music' },
                { text: 'Comandas', payload: 'proyecto comandas' },
                { text: 'Farmacia', payload: 'proyecto farmacia' }
            ]
        },
        {
            name: 'sobreMi',
            keywords: ['sobre ti', 'quién eres', 'carlos', 'sobre mí', 'saber más'],
            responses: ['Carlos es un desarrollador web con un fuerte enfoque en crear soluciones tecnológicas que resuelvan problemas reales. Le apasiona el desarrollo frontend y las tecnologías en la nube. ¿Quieres saber más sobre sus habilidades o su experiencia?'],
            options: [
                { text: 'Habilidades', payload: 'habilidades' },
                { text: 'Experiencia', payload: 'experiencia' }
            ]
        },
        {
            name: 'contacto',
            keywords: ['contacto', 'email', 'correo', 'llamar', 'contactarlo'],
            responses: ['Puedes contactar a Carlos enviando un correo a <strong>carlosjose13975@gmail.com</strong> o a través del formulario de contacto en esta página. ¿Te gustaría ver sus redes sociales?'],
            options: [
                { text: 'Sí, muéstrame sus redes', payload: 'redes sociales' }
            ]
        },
        {
            name: 'proyecto_nintendo',
            keywords: ['nintendo', 'videojuegos'],
            responses: ['Este proyecto es una página web inspirada en Nintendo con un carrito de compras y galería de personajes. ¿Quieres ver el código en GitHub o la demo en vivo?'],
            options: [
                { text: 'Ver en GitHub', url: 'https://github.com/CARLOSNAMIAS/Nintendo' },
                { text: 'Ver demo', url: 'https://carlosnamias.github.io/Nintendo/' }
            ]
        },
        {
            name: 'proyecto_elcorral',
            keywords: ['el corral'],
            responses: ['Este proyecto es un clon de la página de El Corral, enfocado en la experiencia de usuario, con un menú interactivo y un carrito de compras funcional. ¿Quieres ver la demo del proyecto?'],
            options: [
                { text: 'Ver demo', url: 'https://carlosnamias.github.io/menu/' }
            ]
        },
        {
            name: 'proyecto_tiktok',
            keywords: ['tiktok'],
            responses: ['El clon de TikTok es una réplica funcional de la popular red social, construida para demostrar habilidades en el desarrollo de interfaces dinámicas y manejo de medios. ¿Quieres ver el código en GitHub o la demo en vivo?'],
            options: [
                { text: 'Ver en GitHub', url: 'https://github.com/CARLOSNAMIAS/tiktok-clone' },
                { text: 'Ver demo', url: 'https://carlosnamias.github.io/tiktok-clone/' }
            ]
        },
        {
            name: 'proyecto_music',
            keywords: ['music', 'musica', 'deezer'],
            responses: ['Es una aplicación web para streaming de música que utiliza la API de Deezer, con un diseño inspirado en Spotify. ¿Quieres ver la demo?'],
            options: [
                { text: 'Ver demo', url: 'https://carlosnamias.github.io/music/' }
            ]
        },
        {
            name: 'proyecto_comandas',
            keywords: ['comandas', 'gestión de comandas'],
            responses: ['Es una aplicación para gestionar pedidos en restaurantes. Permite tomar órdenes, aplicar descuentos y visualizar todo en una tabla interactiva. ¿Te gustaría ver la demo?'],
            options: [
                { text: 'Ver demo', url: 'https://carlosnamias.github.io/web/index.html' }
            ]
        },
        {
            name: 'proyecto_farmacia',
            keywords: ['farmacia', 'construcción'],
            responses: ['Este es un proyecto en desarrollo para una aplicación de farmacia. Actualmente puedes ver una página de "próximamente".'],
            options: [
                { text: 'Ver demo', url: './comingsoon.html' }
            ]
        },
        {
            name: 'habilidades',
            keywords: ['habilidades', 'skills', 'tecnologías'],
            responses: ['Carlos se especializa en <strong>HTML, CSS, JavaScript, Bootstrap y React</strong>. Además, tiene experiencia con servicios en la nube de <strong>AWS y Google Cloud</strong>.']
        },
        {
            name: 'experiencia',
            keywords: ['experiencia', 'formación', 'estudios'],
            responses: ['Carlos es tecnólogo en Análisis y Desarrollo de Software del SENA. Ha desarrollado proyectos freelance y participado en hackathons, enfocándose en soluciones web innovadoras.']
        },
        {
            name: 'redes_sociales',
            keywords: ['redes sociales', 'github', 'linkedin'],
            responses: ['¡Claro! Aquí tienes los perfiles de Carlos:<br><a href="https://github.com/CARLOSNAMIAS" target="_blank">GitHub</a><br><a href="#" target="_blank">LinkedIn</a> (próximamente)']
        },
        {
            name: 'despedida',
            keywords: ['adiós', 'gracias', 'hasta luego'],
            responses: ['¡De nada! Si tienes alguna otra pregunta, no dudes en consultarme. ¡Que tengas un buen día!']
        }
    ],
    fallback: {
        responses: [
            'No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta? Puedes preguntarme sobre:',
            'Vaya, eso es nuevo para mí. Intenta preguntarme por "proyectos", "habilidades" o "contacto" para que pueda ayudarte mejor.'
        ],
        options: [
            { text: 'Ver Proyectos', payload: 'proyectos' },
            { text: 'Habilidades', payload: 'habilidades' },
            { text: 'Contacto', payload: 'contacto' }
        ]
    }
};

/**
 * Configuración del chatbot
 */
const chatbotConfig = {
    typingDelay: 800,
    responseDelay: 600
};

/**
 * Inicializa el chatbot cuando el DOM está listo
 */
function initChatbot() {
    setupEventListeners();
}

/**
 * Configura los event listeners del chatbot
 */
function setupEventListeners() {
    // Event listener para abrir el modal del chatbot
    const chatbotIcon = document.getElementById('chatbotIcon');
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', handleChatbotIconClick);
    }

    // Event listener para enviar mensaje con Enter
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', handleKeyPress);
    }
}

/**
 * Maneja el clic en el ícono del chatbot
 * 
 * @param {Event} event - Evento del clic
 */
function handleChatbotIconClick(event) {
    event.preventDefault();
    const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
    chatbotModal.show();
}

/**
 * Maneja las teclas presionadas en el input del usuario
 * 
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * Envía un mensaje del usuario y obtiene la respuesta del chatbot
 */
function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    
    if (text === '') return;

    // Mostrar mensaje del usuario
    appendMessage('user', text);
    
    // Obtener respuesta del chatbot
    const response = getChatbotResponse(text);
    
    // Mostrar indicador de escritura
    showTypingIndicator();

    // Mostrar respuesta después del delay
    setTimeout(() => {
        hideTypingIndicator();
        appendMessage('Chatbot', response.text, response.options);
    }, chatbotConfig.typingDelay);
    
    // Limpiar input
    input.value = '';
}

/**
 * Agrega un mensaje al chat
 * 
 * @param {string} sender - 'user' o 'Chatbot'
 * @param {string} content - Contenido del mensaje
 * @param {Array} options - Array de opciones (botones) para mostrar
 */
function appendMessage(sender, content, options = []) {
    const chatbox = document.getElementById('chatbox');
    const messageWrapper = createMessageWrapper(sender, content);
    
    chatbox.appendChild(messageWrapper);
    removeExistingOptions();
    
    if (options.length > 0) {
        appendOptionsButtons(options);
    }
    
    scrollChatboxToBottom();
}

/**
 * Crea el wrapper del mensaje
 * 
 * @param {string} sender - Remitente del mensaje
 * @param {string} content - Contenido del mensaje
 * @returns {HTMLElement} Elemento div del wrapper del mensaje
 */
function createMessageWrapper(sender, content) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    if (sender === 'user') {
        messageWrapper.classList.add('user-message');
        messageWrapper.innerHTML = `<div class="message-content">${content}</div>`;
    } else {
        messageWrapper.classList.add('chatbot-message');
        messageWrapper.innerHTML = `
            <div class="chatbot-avatar"></div>
            <div class="message-content"><strong>Chatbot:</strong> ${content}</div>
        `;
    }

    return messageWrapper;
}

/**
 * Elimina las opciones existentes del chatbox
 */
function removeExistingOptions() {
    const existingOptions = document.getElementById('chatbox').querySelector('.options-container');
    if (existingOptions) {
        existingOptions.remove();
    }
}

/**
 * Agrega botones de opciones al chatbox
 * 
 * @param {Array} options - Array de opciones a mostrar
 */
function appendOptionsButtons(options) {
    const chatbox = document.getElementById('chatbox');
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    
    options.forEach(option => {
        const button = createOptionButton(option);
        optionsContainer.appendChild(button);
    });
    
    chatbox.appendChild(optionsContainer);
}

/**
 * Crea un botón de opción
 * 
 * @param {Object} option - Opción a crear
 * @returns {HTMLElement} Elemento button
 */
function createOptionButton(option) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'me-2', 'mt-1');
    button.textContent = option.text;
    button.onclick = () => handleOption(option);
    return button;
}

/**
 * Hace scroll del chatbox hacia abajo
 */
function scrollChatboxToBottom() {
    const chatbox = document.getElementById('chatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

/**
 * Maneja el clic en una opción (botón)
 * 
 * @param {Object|string} option - Opción seleccionada (objeto o string para retrocompatibilidad)
 */
function handleOption(option) {
    // Manejo de formato antiguo (string) para retrocompatibilidad
    if (typeof option === 'string') {
        handleLegacyOption(option);
        return;
    }

    // Abrir URL si existe
    if (option.url) {
        window.open(option.url, '_blank');
    }

    // Mostrar selección del usuario
    appendMessage('user', option.text);

    // Obtener respuesta si hay payload
    if (option.payload) {
        const response = getChatbotResponse(option.payload);
        setTimeout(() => {
            appendMessage('Chatbot', response.text, response.options);
        }, chatbotConfig.responseDelay);
    } 
    // Si solo había URL, dar respuesta genérica
    else if (option.url) {
        setTimeout(() => {
            appendMessage('Chatbot', "He abierto el enlace en una nueva pestaña. ¿Necesitas algo más?");
        }, chatbotConfig.responseDelay);
    }
}

/**
 * Función global para compatibilidad con botones HTML onclick
 * Expuesta en window para que sea accesible desde HTML
 */
window.handleOption = handleOption;

/**
 * Maneja opciones en formato legacy (string)
 * 
 * @param {string} optionString - Opción en formato string
 */
function handleLegacyOption(optionString) {
    const userText = optionString.charAt(0).toUpperCase() + optionString.slice(1);
    appendMessage('user', userText);
    
    const response = getChatbotResponse(optionString);
    setTimeout(() => {
        appendMessage('Chatbot', response.text, response.options);
    }, chatbotConfig.responseDelay);
}

/**
 * Muestra el indicador de escritura
 */
function showTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message-wrapper', 'chatbot-message');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="chatbot-avatar"></div>
        <div class="message-content typing-indicator">
            <strong>Chatbot:</strong> <span>.</span><span>.</span><span>.</span>
        </div>
    `;
    
    chatbox.appendChild(typingIndicator);
    scrollChatboxToBottom();
}

/**
 * Oculta el indicador de escritura
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Obtiene la respuesta del chatbot basada en la entrada del usuario
 * 
 * @param {string} userInput - Texto ingresado por el usuario
 * @returns {Object} Objeto con la respuesta y opciones
 */
function getChatbotResponse(userInput) {
    const normalizedInput = userInput.toLowerCase();
    
    // Buscar intención que coincida con las palabras clave
    const matchingIntent = findMatchingIntent(normalizedInput);
    
    if (matchingIntent) {
        const response = getRandomResponse(matchingIntent.responses);
        return { 
            text: response, 
            options: matchingIntent.options || [] 
        };
    }

    // Respuesta de fallback si no se encuentra intención
    return getFallbackResponse();
}

/**
 * Busca una intención que coincida con la entrada del usuario
 * 
 * @param {string} input - Entrada normalizada del usuario
 * @returns {Object|null} Intención encontrada o null
 */
function findMatchingIntent(input) {
    return chatbotData.intents.find(intent =>
        intent.keywords.some(keyword => input.includes(keyword))
    );
}

/**
 * Obtiene una respuesta aleatoria de un array de respuestas
 * 
 * @param {Array} responses - Array de respuestas posibles
 * @returns {string} Respuesta seleccionada
 */
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Obtiene la respuesta de fallback
 * 
 * @returns {Object} Objeto con respuesta y opciones de fallback
 */
function getFallbackResponse() {
    const fallbackResponse = getRandomResponse(chatbotData.fallback.responses);
    return { 
        text: fallbackResponse, 
        options: chatbotData.fallback.options || [] 
    };
}

/**
 * Función global para el botón Enviar en HTML
 * Expuesta en window para que sea accesible desde HTML
 */
window.sendMessage = sendMessage;

// Inicializar el chatbot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initChatbot);