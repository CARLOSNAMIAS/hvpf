/**
 * MÓDULO DE VALIDACIÓN Y ENVÍO AJAX DEL FORMULARIO DE CONTACTO
 * 
 * Este módulo maneja la validación y envío del formulario de contacto
 * de forma asíncrona (AJAX) para una mejor experiencia de usuario.
 * 
 * @author Carlos Gómez
 * @version 2.0
 */

/**
 * Inicializa los listeners del formulario de contacto
 * Se ejecuta cuando el DOM está completamente cargado
 */
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) {
        console.warn("Formulario de contacto no encontrado en el DOM");
        return;
    }
    contactForm.addEventListener("submit", handleFormSubmit);
}

/**
 * Maneja el evento de envío del formulario usando Fetch API (AJAX)
 * 
 * @param {Event} event - Evento de envío del formulario
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Validar que los campos requeridos no estén vacíos
    if (!form.checkValidity()) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showSuccessMessage();
            form.reset(); // Limpia el formulario
            // Oculta el mensaje de éxito después de unos segundos
            setTimeout(() => {
                hideSuccessMessage();
            }, 5000);
        } else {
            // Maneja errores del servidor (ej. validación de FormSubmit)
            const data = await response.json();
            const errorMessage = data.errors ? data.errors.map(e => e.message).join(', ') : 'Ocurrió un error al enviar el mensaje.';
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        // Maneja errores de red
        console.error('Error de red al enviar el formulario:', error);
        alert('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    }
}

/**
 * Muestra el mensaje de éxito del formulario
 */
function showSuccessMessage() {
    const successMessage = document.getElementById("mensaje-exito");
    if (successMessage) {
        successMessage.style.display = "block";
    }
}

/**
 * Oculta el mensaje de éxito del formulario
 */
function hideSuccessMessage() {
    const successMessage = document.getElementById("mensaje-exito");
    if (successMessage) {
        successMessage.style.display = "none";
    }
}

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initContactForm);
