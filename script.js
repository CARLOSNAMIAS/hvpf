// Navbar scroll    
window.addEventListener('scroll', function () {
    let navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Validación del formulario de contacto
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío inmediato

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !mensaje || !email) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Muestra el mensaje de éxito
    document.getElementById("mensaje-exito").style.display = "block";

    // Espera 2 segundos antes de enviar el formulario
    setTimeout(() => {
        event.target.submit();
    }, 2000);
});

// JavaScript para chatbot mejorado //

function appendMessage(sender, text, showOptions = false) {
    const chatbox = document.getElementById('chatbox');
    const message = document.createElement('div');
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatbox.appendChild(message);
    
    // Mostrar opciones rápidas si es necesario
    if (showOptions && sender === 'Carlos Bot') {
        appendQuickOptions();
    }
    
    chatbox.scrollTop = chatbox.scrollHeight;
}

function appendQuickOptions() {
    const chatbox = document.getElementById('chatbox');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quick-options mt-2';
    optionsDiv.innerHTML = `
        <small>Opciones rápidas:</small><br>
        <button class="btn btn-outline-primary btn-sm me-1 mb-1" onclick="handleOption('1')">1. Proyectos</button>
        <button class="btn btn-outline-primary btn-sm me-1 mb-1" onclick="handleOption('2')">2. Habilidades</button>
        <button class="btn btn-outline-primary btn-sm me-1 mb-1" onclick="handleOption('3')">3. Experiencia</button>
        <button class="btn btn-outline-primary btn-sm me-1 mb-1" onclick="handleOption('4')">4. Contacto</button>
    `;
    chatbox.appendChild(optionsDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (text !== '') {
        // Remover opciones anteriores
        removeQuickOptions();
        
        appendMessage('Tú', text);
        const response = chatbot(text);
        setTimeout(() => {
            const showOptions = shouldShowOptions(text);
            appendMessage('Carlos Bot', response, showOptions);
        }, 500);
        input.value = '';
    }
}

function removeQuickOptions() {
    const options = document.querySelectorAll('.quick-options');
    options.forEach(option => option.remove());
}

function shouldShowOptions(message) {
    const helpKeywords = ['ayuda', 'help', 'opciones', 'menú', 'que puedes hacer'];
    return helpKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

function handleOption(option) {
    removeQuickOptions();
    
    const optionTexts = {
        '1': 'Ver proyectos',
        '2': 'Ver habilidades técnicas', 
        '3': 'Conocer mi experiencia',
        '4': 'Información de contacto'
    };
    
    const displayText = optionTexts[option] || option;
    appendMessage('Tú', displayText);
    const response = chatbot(option);
    setTimeout(() => appendMessage('Carlos Bot', response), 500);
}

function chatbot(message) {
    message = message.toLowerCase();

    // Saludo inicial
    if (message.includes("hola") || message.includes("hi") || message.includes("buenos") || message.includes("buenas")) {
        return "¡Hola! 👋 Soy el asistente virtual de Carlos. Estoy aquí para contarte sobre sus proyectos, habilidades y experiencia. Escribe <strong>'ayuda'</strong> o <strong>'menú'</strong> para ver las opciones disponibles.";
    }

    // Opciones numeradas
    if (message === '1' || message.includes("proyectos") || message.includes("trabajos") || message.includes("portfolio")) {
        return `📂 <strong>Principales Proyectos:</strong><br><br>
        🌐 <strong>SENA Connect</strong> - Red social educativa para estudiantes e instructores<br>
        📱 <strong>Taktak</strong> - Clon de TikTok con scroll infinito y API dinámica<br>
        🍔 <strong>El Corral Clone</strong> - Sitio web de restaurante con carrito de compras<br>
        🚗 <strong>App Conductores</strong> - Aplicación móvil para localizar servicios en carretera<br>
        🏆 <strong>Portal Hackathon SENA</strong> - Plataforma de competencias con Firebase<br><br>
        ¿Te gustaría conocer más detalles de algún proyecto específico? Solo menciona su nombre.`;
    }

    if (message === '2' || message.includes("habilidades") || message.includes("tecnologías") || message.includes("skills")) {
        return `💻 <strong>Stack Tecnológico:</strong><br><br>
        <strong>Frontend:</strong><br>
        • HTML5, CSS3, JavaScript ES6+<br>
        • React.js, Bootstrap, Responsive Design<br>
        • Animaciones CSS y transiciones<br><br>
        <strong>Backend & Cloud:</strong><br>
        • Firebase (Auth, Firestore, Hosting)<br>
        • MongoDB, APIs REST<br>
        • Servicios en la nube<br><br>
        <strong>Herramientas:</strong><br>
        • Git, VS Code, Chrome DevTools<br>
        • Figma para diseño UI/UX<br><br>
        <strong>Metodologías:</strong><br>
        • Desarrollo ágil, Mobile-first, Clean Code`;
    }

    if (message === '3' || message.includes("experiencia") || message.includes("formación") || message.includes("estudios") || message.includes("educación")) {
        return `🎓 <strong>Formación y Experiencia:</strong><br><br>
        📚 <strong>Estudiante SENA</strong> - Programación de Aplicaciones y Servicios en la Nube<br>
        🏆 <strong>Participación en Hackathons</strong> - Desarrollo de soluciones innovadoras<br>
        💼 <strong>Proyectos Reales</strong> - Experiencia práctica en desarrollo full-stack<br>
        🌱 <strong>Aprendizaje Continuo</strong> - Siempre actualizándome con nuevas tecnologías<br><br>
        <strong>Áreas de especialización:</strong><br>
        • Desarrollo de aplicaciones web modernas<br>
        • Integración con bases de datos en la nube<br>
        • Diseño responsivo y experiencia de usuario<br>
        • Desarrollo de APIs y servicios backend`;
    }

    if (message === '4' || message.includes("contacto") || message.includes("contactar") || message.includes("email") || message.includes("teléfono")) {
        return `📧 <strong>¡Conectemos!</strong><br><br>
        ✉️ <strong>Email:</strong> carlos.dev@email.com<br>
        💼 <strong>LinkedIn:</strong> linkedin.com/in/carlos-dev<br>
        🐙 <strong>GitHub:</strong> github.com/carlos-dev<br>
        📱 <strong>WhatsApp:</strong> +57 300 123 4567<br><br>
        📝 También puedes usar el <strong>formulario de contacto</strong> en la página principal.<br><br>
        ¿Tienes algún proyecto en mente? ¡Me encantaría colaborar contigo!`;
    }

    // Respuestas específicas de proyectos
    if (message.includes("sena connect") || message.includes("red social")) {
        return `🌐 <strong>SENA Connect - Red Social Educativa</strong><br><br>
        Una plataforma innovadora que conecta estudiantes, instructores y empresas del ecosistema SENA.<br><br>
        <strong>Características principales:</strong><br>
        • Perfiles personalizados para cada tipo de usuario<br>
        • Sistema de networking y conexiones profesionales<br>
        • Compartir y colaborar en proyectos académicos<br>
        • Marketplace de oportunidades laborales<br>
        • Chat en tiempo real y notificaciones<br><br>
        <strong>Tecnologías:</strong> React, Firebase, Bootstrap, JavaScript<br>
        <strong>Estado:</strong> En desarrollo activo 🚀`;
    }

    if (message.includes("taktak") || message.includes("tiktok") || message.includes("videos")) {
        return `📱 <strong>Taktak - Clon de TikTok</strong><br><br>
        Una réplica funcional de TikTok que demuestra habilidades en desarrollo de aplicaciones multimedia.<br><br>
        <strong>Funcionalidades:</strong><br>
        • Scroll infinito de videos<br>
        • Reproducción automática y controles<br>
        • Sistema de likes y comentarios<br>
        • Feed personalizado con API dinámica<br>
        • Interfaz responsive y mobile-first<br><br>
        <strong>Tecnologías:</strong> HTML5, CSS3, JavaScript Vanilla, API REST<br>
        <strong>Desafío técnico:</strong> Optimización de performance para videos`;
    }

    if (message.includes("el corral") || message.includes("restaurante") || message.includes("carrito")) {
        return `🍔 <strong>El Corral Clone - E-commerce Gastronómico</strong><br><br>
        Una recreación completa del sitio web de El Corral con funcionalidades de e-commerce.<br><br>
        <strong>Características:</strong><br>
        • Menú interactivo con categorías<br>
        • Personalización de productos (ingredientes, tamaños)<br>
        • Carrito de compras con persistencia<br>
        • Sistema de checkout y pedidos<br>
        • Diseño responsive y accesible<br><br>
        <strong>Tecnologías:</strong> Bootstrap, JavaScript, LocalStorage<br>
        <strong>Enfoque:</strong> UX/UI centrada en conversión`;
    }

    if (message.includes("app conductores") || message.includes("móvil") || message.includes("conductores")) {
        return `🚗 <strong>App para Conductores - Servicios en Carretera</strong><br><br>
        Aplicación móvil que ayuda a conductores a encontrar servicios esenciales en sus rutas.<br><br>
        <strong>Servicios disponibles:</strong><br>
        • Estaciones de servicio y precios de combustible<br>
        • Hoteles y hospedajes<br>
        • Restaurantes y centros comerciales<br>
        • Talleres mecánicos y servicios de emergencia<br>
        • Navegación GPS integrada<br><br>
        <strong>Tecnologías:</strong> React Native, APIs de geolocalización<br>
        <strong>Estado:</strong> Prototipo funcional en desarrollo`;
    }

    // Ayuda y menú principal
    if (message.includes("ayuda") || message.includes("help") || message.includes("menú") || message.includes("opciones") || message.includes("que puedes hacer")) {
        return `🤖 <strong>¿En qué puedo ayudarte?</strong><br><br>
        Puedes escribir el número o la palabra clave:<br><br>
        <strong>1</strong> o <strong>"proyectos"</strong> - Ver portafolio completo<br>
        <strong>2</strong> o <strong>"habilidades"</strong> - Conocer stack tecnológico<br>
        <strong>3</strong> o <strong>"experiencia"</strong> - Formación y trayectoria<br>
        <strong>4</strong> o <strong>"contacto"</strong> - Información de contacto<br><br>
        <strong>También puedes preguntar sobre:</strong><br>
        • Proyectos específicos (SENA Connect, Taktak, etc.)<br>
        • Tecnologías particulares<br>
        • Colaboraciones y oportunidades<br><br>
        ¡Estoy aquí para responder todas tus preguntas! 😊`;
    }

    // Despedida
    if (message.includes("gracias") || message.includes("bye") || message.includes("adiós") || message.includes("chau")) {
        return "¡Gracias por tu interés! 😊 Ha sido un placer contarte sobre Carlos y sus proyectos. Si tienes más preguntas o quieres colaborar, no dudes en contactarlo. ¡Que tengas un excelente día! 🚀";
    }

    // Preguntas sobre colaboración
    if (message.includes("colaborar") || message.includes("trabajo") || message.includes("proyecto") || message.includes("contratar")) {
        return `🤝 <strong>¡Excelente! Carlos está abierto a nuevas oportunidades</strong><br><br>
        <strong>Tipos de colaboración:</strong><br>
        • Desarrollo de aplicaciones web completas<br>
        • Proyectos de e-commerce y startups<br>
        • Aplicaciones móviles con React Native<br>
        • Consultoría en tecnologías cloud<br>
        • Mentorías y workshops técnicos<br><br>
        <strong>¿Cómo proceder?</strong><br>
        📧 Envía un email a <strong>carlos.dev@email.com</strong> con:<br>
        • Descripción del proyecto<br>
        • Tecnologías requeridas<br>
        • Timeline estimado<br>
        • Presupuesto aproximado<br><br>
        ¡Carlos responde en menos de 24 horas! ⚡`;
    }

    // Preguntas sobre tecnologías específicas
    if (message.includes("react") || message.includes("javascript") || message.includes("firebase")) {
        return `⚛️ <strong>Experiencia en Tecnologías Modernas</strong><br><br>
        Carlos tiene sólida experiencia en el stack moderno de desarrollo:<br><br>
        <strong>React.js:</strong> Componentes funcionales, Hooks, Context API, Router<br>
        <strong>JavaScript:</strong> ES6+, Async/Await, Promises, Manipulación DOM<br>
        <strong>Firebase:</strong> Authentication, Firestore, Hosting, Cloud Functions<br><br>
        <strong>Proyectos destacados:</strong><br>
        • SENA Connect usa React + Firebase<br>
        • Taktak implementa JavaScript vanilla optimizado<br>
        • Portal Hackathon integra autenticación Firebase<br><br>
        ¿Te interesa ver código específico de algún proyecto?`;
    }

    // Mensaje por defecto mejorado
    return `🤔 <strong>No estoy seguro de haber entendido...</strong><br><br>
    Pero puedo ayudarte con información sobre:<br>
    • <strong>Proyectos</strong> de Carlos (escribe "1" o "proyectos")<br>
    • <strong>Habilidades</strong> técnicas (escribe "2" o "habilidades")<br>
    • <strong>Experiencia</strong> y formación (escribe "3" o "experiencia")<br>
    • <strong>Contacto</strong> y colaboración (escribe "4" o "contacto")<br><br>
    O simplemente escribe <strong>"ayuda"</strong> para ver todas las opciones disponibles. 😊`;
}

// Script para abrir el modal al hacer clic en el icono
document.getElementById('chatbotIcon').addEventListener('click', function (event) {
    event.preventDefault();
    const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
    chatbotModal.show();
    
    // Mensaje de bienvenida automático
    setTimeout(() => {
        appendMessage('Carlos Bot', '¡Hola! 👋 Bienvenido a mi portafolio. Soy el asistente virtual de Carlos y estoy aquí para contarte todo sobre sus proyectos y habilidades. ¿En qué puedo ayudarte?', true);
    }, 500);
});