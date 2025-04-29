
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



        
    // JavaScript para chatbot //
    
        function appendMessage(sender, text) {
            const chatbox = document.getElementById('chatbox');
            const message = document.createElement('div');
            message.innerHTML = `<strong>${sender}:</strong> ${text}`;
            chatbox.appendChild(message);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function sendMessage() {
            const input = document.getElementById('userInput');
            const text = input.value.trim();
            if (text !== '') {
                appendMessage('Tú', text);
                const response = chatbot(text);
                setTimeout(() => appendMessage('Chatbot', response), 500);
                input.value = '';
            }
        }

        function handleOption(option) {
            appendMessage('Tú', option);
            const response = chatbot(option);
            setTimeout(() => appendMessage('Chatbot', response), 500);
        }

        function chatbot(message) {
            message = message.toLowerCase();

            if (message.includes("ver proyectos")) {
                return "¿Qué tipo de proyecto te interesa? <br><button class='btn btn-outline-primary btn-sm mt-2' onclick=\"handleOption('aplicaciones web')\">Aplicaciones Web</button> <button class='btn btn-outline-primary btn-sm mt-2' onclick=\"handleOption('aplicaciones móviles')\">Aplicaciones Móviles</button> <button class='btn btn-outline-primary btn-sm mt-2' onclick=\"handleOption('hackathons')\">Hackathons</button>";
            }

            if (message.includes("aplicaciones web")) {
                return "En web, he trabajado en 'SENA Connect' (una red social educativa) y una app de música tipo Spotify. ¿Te gustaría ver una demo o leer más?";
            }

            if (message.includes("red social") || message.includes("sena connect")) {
                return "'SENA Connect' conecta estudiantes, instructores y empresas. ¡Un proyecto lleno de innovación!";
            }

            if (message.includes("saber más")) {
                return "Soy un desarrollador apasionado de React, Firebase y tecnologías en la nube. ¿Quieres ver mi trayectoria o mis habilidades?";
            }

            if (message.includes("contactarlo") || message.includes("contacto")) {
                return "¡Puedes escribirme directamente a carlos.dev@email.com o completar un formulario!";
            }

            if (message.includes("ayuda")) {
                return "Opciones disponibles: Ver proyectos / Saber más sobre Carlos / Contactarlo.";
            }

            return "¡Ups! No entendí eso. ¿Puedes intentar otra vez o escribir 'ayuda' para ver las opciones?";
        }
    

    // Script para abrir el modal al hacer clic en el icono //
   
        document.getElementById('chatbotIcon').addEventListener('click', function (event) {
            event.preventDefault();
            const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
            chatbotModal.show();
        });
  
