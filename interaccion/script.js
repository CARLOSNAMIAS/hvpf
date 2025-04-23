
// Configuración de APIs
const OPENWEATHERMAP_API_KEY = 'db602d829b90280d24129b8db657a96c'; // Tu clave
const NEWS_API_KEY = '5731e3b25f2146619ba5d1ded36c10d4'; // Tu clave

// Elementos del DOM
const modal = document.getElementById('chatbotModal');
const messageInput = document.getElementById('message');
const messageContainer = document.getElementById('messageContainer');
const chatbotIcon = document.getElementById('chatbotIcon');
const botSound = document.getElementById('botSound');

// Abrir modal
function openModal() {
    modal.classList.add('active');
    chatbotIcon.style.display = 'none';
    document.body.classList.add('modal-open');
    messageInput.focus();
}

// Cerrar modal
function closeModal() {
    modal.classList.remove('active');
    chatbotIcon.style.display = 'block';
    document.body.classList.remove('modal-open');
}

// Mostrar mensaje en el chat
function displayMessage(message, sender, imgSrc = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    if (imgSrc) {
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = 'Ícono del clima';
        imgElement.style.width = '50px';
        imgElement.style.height = '50px';
        messageContainer.appendChild(imgElement);
    }

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Enviar mensaje
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) {
        displayMessage('Por favor, escribe un mensaje.', 'bot');
        botSound.play();
        return;
    }

    // Mostrar mensaje del usuario
    displayMessage(userMessage, 'user');
    messageInput.value = '';

    // Procesar mensaje
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('clima') || lowerMessage.includes('tiempo') || lowerMessage.includes('pronóstico')) {
        getWeather();
    } else if (lowerMessage.includes('noticias') || lowerMessage.includes('news')) {
        getNews();
    } else {
        const botResponse = getBotResponse(lowerMessage);
        setTimeout(() => {
            displayMessage(botResponse, 'bot');
            botSound.play();
        }, 1000);
    }
}

// Mejorar respuestas predefinidas
function getBotResponse(userMessage) {
    const responses = [
        {
            patterns: ['hola', 'buenas', 'hey', 'saludos'],
            response: '¡Hola! Soy el asistente virtual de Carlos, ¿cómo te ayudo hoy?'
        },
        {
            patterns: ['cómo estás', 'qué tal', 'cómo vas'],
            response: 'Estoy bien, gracias por preguntar. ¿Y tú?'
        },
        {
            patterns: ['adiós', 'chao', 'hasta luego', 'nos vemos'],
            response: '¡Hasta pronto! Que tengas un buen día. 👋'
        },
        {
            patterns: ['gracias', 'muchas gracias', 'agradecido'],
            response: '¡De nada! 😊'
        },
        {
            patterns: ['ayuda', 'qué puedes hacer', 'qué haces', 'info'],
            response: 'Puedo darte el clima en Cúcuta, noticias, o charlar. Prueba decir "clima" o "noticias".'
        },
        {
            patterns: ['cúcuta', 'info de cúcuta', 'sobre cúcuta'],
            response: 'Cúcuta es una ciudad colombiana en la frontera con Venezuela, conocida por su comercio y cultura.'
        }
    ];

    // Buscar coincidencia
    for (const { patterns, response } of responses) {
        if (patterns.some(pattern => userMessage.includes(pattern))) {
            return response;
        }
    }

    // Respuesta por defecto
    return 'Lo siento, no entendí eso. Prueba con "hola", "clima", "noticias" o "ayuda".';
}

// Obtener clima (OpenWeatherMap)
function getWeather() {
    const ciudad = 'Cúcuta';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const desc = data.weather[0].description;
            const windSpeed = data.wind.speed * 3.6; // Convertir a km/h
            const humidity = data.main.humidity;
            const iconCode = data.wxAIeather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const climaMensaje = `El clima en ${ciudad} es de ${temp}°C con ${desc}. La velocidad del viento es de ${windSpeed.toFixed(2)} km/h y la humedad es del ${humidity}%.`;
            displayMessage(climaMensaje, 'bot', iconUrl);
            botSound.play();
        })
        .catch(error => {
            displayMessage('No pude obtener el clima en este momento. Inténtalo más tarde.', 'bot');
            console.error('Error obteniendo el clima:', error);
            botSound.play();
        });
}

// Obtener noticias (NewsAPI)
function getNews() {
    const query = 'Cúcuta';
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                const newsMessage = data.articles.slice(0, 5).map(article => {
                    return `${article.title}\n${article.description || 'Sin descripción'}\nLeer más: ${article.url}\n`;
                }).join('');
                displayMessage(`Últimas noticias sobre ${query}:\n${newsMessage}`, 'bot');
            } else {
                displayMessage(`No se encontraron noticias sobre ${query} en este momento.`, 'bot');
            }
            botSound.play();
        })
        .catch(error => {
            displayMessage('No pude obtener las noticias en este momento. Inténtalo más tarde.', 'bot');
            console.error('Error obteniendo las noticias:', error);
            botSound.play();
        });
}

// Soporte para tecla Enter
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});