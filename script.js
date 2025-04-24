

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

