const apiKey = "db602d829b90280d24129b8db657a96c"; // Reemplaza con tu API Key
const newsApiKey = "5731e3b25f2146619ba5d1ded36c10d4"; // API Key de noticias
const modal = document.getElementById('chatbotModal');
const messageInput = document.getElementById('message');
const messageContainer = document.getElementById('messageContainer');
const chatbotIcon = document.getElementById('chatbotIcon');
const botSound = document.getElementById('botSound');  // Sonido de respuesta

function openModal() {
    modal.style.visibility = 'visible'; // Asegurarse de que el modal se vea
    modal.classList.add('active');
    chatbotIcon.style.display = 'none';
    document.body.classList.add('modal-open');  // Bloquear el scroll del body
}

function closeModal() {
    modal.style.visibility = 'hidden'; // Ocultar el modal
    modal.classList.remove('active');
    chatbotIcon.style.display = 'block';
    document.body.classList.remove('modal-open'); // Restaurar el scroll del body
}

function sendMessage() {
    let userMessage = messageInput.value.trim();
    if (userMessage) {
        displayMessage(userMessage, 'user');
        messageInput.value = '';

        // Si el usuario pregunta por el clima
        if (userMessage.toLowerCase().includes("clima")) {
            getWeather(); // Llamar a la API del clima
        }
        // Si el usuario pregunta por noticias
        else if (userMessage.toLowerCase().includes("noticias")) {
            getNews(); // Llamar a la API de noticias
        } else {
            // Responder con un mensaje del bot
            let botResponse = getBotResponse(userMessage);
            setTimeout(() => {
                displayMessage(botResponse, 'bot');
                botSound.play();  // Reproducir sonido cuando el bot responde
            }, 1000);
        }
    } else {
        alert("Por favor, escribe un mensaje antes de enviar.");
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function getBotResponse(userMessage) {
    const responses = {
        'hola': '¡Hola! ¿En qué puedo ayudarte?',
        '¿cómo estás?': 'Estoy bien, gracias por preguntar. ¿Y tú?',
        'adiós': '¡Hasta luego! Que tengas un buen día.',
        'gracias': '¡De nada! 😊',
        'default': 'Lo siento, no entendí eso. ¿Puedes intentar otra vez?',
        'clima': 'Para consultar el clima, introduce el nombre de la ciudad, por ejemplo, "Clima en Cúcuta"',
        'noticias': 'Te puedo contar las últimas noticias. Solo pregunta, por ejemplo, "dame las noticias".',
        
        // Añadir más respuestas para diferentes preguntas y contextos
        'qué tal tu día': 'Siempre estoy aquí, listo para ayudarte.',
        'cúcuta': 'Cúcuta es una ciudad colombiana ubicada en la frontera con Venezuela.',

        // Otros casos...
    };

    return responses[userMessage.toLowerCase()] || responses['default'];
}

function getWeather() {
    const ciudad = "Cúcuta"; // Puedes cambiarlo o hacer que el usuario lo indique
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const desc = data.weather[0].description;
            const windSpeed = data.wind.speed * 3.6; // Convertir la velocidad del viento de m/s a km/h
            const humidity = data.main.humidity; // Humedad
            const iconCode = data.weather[0].icon; // Código del icono del clima

            // Crear la URL para la imagen del clima
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            // Crear el mensaje con los detalles del clima
            const climaMensaje = `El clima en ${ciudad} es de ${temp}°C con ${desc}. 
                                          La velocidad del viento es de ${windSpeed.toFixed(2)} km/h y la humedad es del ${humidity}%.`;

            // Mostrar el mensaje
            displayMessage(climaMensaje, 'bot');

            // Mostrar la imagen del clima
            const imgElement = document.createElement('img');
            imgElement.src = iconUrl;
            imgElement.alt = desc;
            imgElement.style.width = "50px";  // Tamaño de la imagen
            imgElement.style.height = "50px"; // Tamaño de la imagen

            // Agregar la imagen al chat
            messageContainer.appendChild(imgElement);
            messageContainer.scrollTop = messageContainer.scrollHeight;

            // Reproducir el sonido
            botSound.play();  // Reproducir sonido cuando el bot responde
        })
        .catch(error => {
            displayMessage("No pude obtener el clima en este momento. Inténtalo más tarde.", 'bot');
            console.error("Error obteniendo el clima", error);
            botSound.play();  // Reproducir sonido si hay un error
        });
}


// Llamar a las funciones cuando se carga la página
function getNews() {
    const query = "Cúcuta"; // Término de búsqueda para noticias de Cúcuta
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                const newsMessage = data.articles.slice(0, 5).map(article => {
                    return `${article.title}\n${article.description}\nLeer más: ${article.url}\n\n`;
                }).join('');
                displayMessage(`Últimas noticias sobre ${query}:\n` + newsMessage, 'bot');
            } else {
                displayMessage(`No se encontraron noticias sobre ${query} en este momento.`, 'bot');
            }
            botSound.play();
        })
        .catch(error => {
            displayMessage("No pude obtener las noticias en este momento. Inténtalo más tarde.", 'bot');
            console.error("Error obteniendo las noticias", error);
            botSound.play();
        });
}
 

