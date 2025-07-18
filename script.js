

// Validación del formulario de contacto
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !mensaje || !email) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    document.getElementById("mensaje-exito").style.display = "block";

    setTimeout(() => {
        event.target.submit();
    }, 2000);
});

// --- LÓGICA DEL CHATBOT MEJORADA ---

const chatbotData = {
    intents: [
        {
            name: 'saludo',
            keywords: ['hola', 'buenos', 'buenas', 'qué tal'],
            responses: ['¡Hola! Soy el asistente virtual de Carlos. ¿En qué puedo ayudarte hoy?']
        },
        {
            name: 'verProyectos',
            keywords: ['proyectos', 'trabajos', 'portafolio', 'proyectos'],
            responses: ['¡Claro! Carlos ha trabajado en varios proyectos interesantes. ¿Cuál te gustaría conocer?<br><br>1. Clon de TikTok<br>2. Gestión de comandas<br>3. Clon de El Corral'],
            options: [
                { text: 'Clon de TikTok', payload: 'proyecto tiktok' },
                { text: 'Gestión de comandas', payload: 'proyecto comandas' },
                { text: 'Clon de El Corral', payload: 'proyecto el corral' }
            ]
        },
        {
            name: 'sobreMi',
            keywords: ['sobre ti', 'quién eres', 'carlos', 'sobre mí'],
            responses: ['Carlos es un desarrollador web con un fuerte enfoque en crear soluciones tecnológicas que resuelvan problemas reales. Le apasiona el desarrollo frontend y las tecnologías en la nube. ¿Quieres saber más sobre sus habilidades o su experiencia?'],
            options: [
                { text: 'Habilidades', payload: 'habilidades' },
                { text: 'Experiencia', payload: 'experiencia' }
            ]
        },
        {
            name: 'contacto',
            keywords: ['contacto', 'email', 'correo', 'llamar'],
            responses: ['Puedes contactar a Carlos enviando un correo a <strong>carlosjose13975@gmail.com</strong> o a través del formulario de contacto en esta página. ¿Te gustaría ver sus redes sociales?'],
            options: [
                { text: 'Sí, muéstrame sus redes', payload: 'redes sociales' }
            ]
        },
        {
            name: 'proyecto_tiktok',
            keywords: ['tiktok', 'clon de tiktok'],
            responses: ['El clon de TikTok es una réplica funcional de la popular red social, construida para demostrar habilidades en el desarrollo de interfaces dinámicas y manejo de medios. ¿Quieres ver el código en GitHub o la demo en vivo?'],
            options: [
                { text: 'Ver en GitHub', payload: 'github_tiktok' },
                { text: 'Ver demo', payload: 'demo_tiktok' }
            ]
        },
        {
            name: 'proyecto_comandas',
            keywords: ['comandas', 'gestión de comandas'],
            responses: ['Es una aplicación para gestionar pedidos en restaurantes. Permite tomar órdenes, aplicar descuentos y visualizar todo en una tabla interactiva. ¿Te gustaría ver la demo?'],
            options: [
                { text: 'Ver demo', payload: 'demo_comandas' }
            ]
        },
        {
            name: 'proyecto_elcorral',
            keywords: ['el corral', 'clon de el corral'],
            responses: ['Este proyecto es un clon de la página de El Corral, enfocado en la experiencia de usuario, con un menú interactivo y un carrito de compras funcional. ¿Quieres ver la demo del proyecto?'],
            options: [
                { text: 'Ver demo', payload: 'demo_elcorral' }
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
        responses: ['No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta? Puedes preguntarme sobre <strong>proyectos, habilidades o cómo contactar a Carlos</strong>.']
    }
};

function appendMessage(sender, content, options = []) {
    const chatbox = document.getElementById('chatbox');
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
    
    chatbox.appendChild(messageWrapper);

    if (options.length > 0) {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'me-2', 'mt-1');
            button.textContent = option.text;
            button.onclick = () => handleOption(option.payload, option.text);
            optionsContainer.appendChild(button);
        });
        chatbox.appendChild(optionsContainer);
    }
    
    chatbox.scrollTop = chatbox.scrollHeight;
}

function handleOption(payload, text) {
    appendMessage('user', text);
    const response = getChatbotResponse(payload);
    setTimeout(() => appendMessage('Chatbot', response.text, response.options), 600);
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (text !== '') {
        appendMessage('user', text);
        const response = getChatbotResponse(text);
        
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message-wrapper', 'chatbot-message');
        typingIndicator.innerHTML = `
            <div class="chatbot-avatar"></div>
            <div class="message-content typing-indicator">
                <strong>Chatbot:</strong> <span>.</span><span>.</span><span>.</span>
            </div>
        `;
        document.getElementById('chatbox').appendChild(typingIndicator);
        document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;

        setTimeout(() => {
            typingIndicator.remove();
            appendMessage('Chatbot', response.text, response.options);
        }, 800);
        
        input.value = '';
    }
}

function getChatbotResponse(userInput) {
    const msg = userInput.toLowerCase();
    
    // Casos especiales para demos y GitHub
    if (msg.startsWith('demo_')) {
        const project = msg.split('_')[1];
        const urls = {
            'tiktok': 'https://carlosnamias.github.io/tiktok-clone/',
            'comandas': 'https://carlosnamias.github.io/web/index.html',
            'elcorral': 'https://carlosnamias.github.io/menu/'
        };
        window.open(urls[project], '_blank');
        return { text: `He abierto la demo de ${project} en una nueva pestaña. ¿Hay algo más que te gustaría ver?` };
    }

    if (msg.startsWith('github_')) {
        const project = msg.split('_')[1];
        const urls = {
            'tiktok': 'https://github.com/CARLOSNAMIAS/tiktok-clone'
        };
        window.open(urls[project], '_blank');
        return { text: `Te estoy redirigiendo al repositorio de ${project} en GitHub. ¿Necesitas algo más?` };
    }

    const intent = chatbotData.intents.find(intent =>
        intent.keywords.some(keyword => msg.includes(keyword))
    );

    if (intent) {
        const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        return { text: response, options: intent.options || [] };
    }

    return { text: chatbotData.fallback.responses[0] };
}

document.getElementById('chatbotIcon').addEventListener('click', function (event) {
    event.preventDefault();
    const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
    chatbotModal.show();
});

// Event listener para enviar mensaje con la tecla Enter
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
