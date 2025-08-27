/**
 * MÓDULO DE VALIDACIÓN DEL FORMULARIO DE CONTACTO
 * 
 * Este módulo maneja la validación y envío del formulario de contacto.
 * Valida que todos los campos obligatorios estén completos antes del envío
 * y muestra un mensaje de éxito temporal.
 * 
 * @author Carlos
 * @version 1.0
 */

/**
 * Inicializa la validación del formulario de contacto
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
 * Maneja el evento de envío del formulario
 * 
 * @param {Event} event - Evento de envío del formulario
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Obtener valores de los campos del formulario
    const formData = getFormData();
    
    // Validar que todos los campos estén completos
    if (!validateFormData(formData)) {
        showValidationError();
        return;
    }

    // Mostrar mensaje de éxito
    showSuccessMessage();

    // Enviar formulario después de mostrar el mensaje
    setTimeout(() => {
        event.target.submit();
    }, 2000);
}

/**
 * Obtiene los datos del formulario de contacto
 * 
 * @returns {Object} Objeto con los datos del formulario
 */
function getFormData() {
    return {
        nombre: document.getElementById('nombre')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        mensaje: document.getElementById('mensaje')?.value.trim() || ''
    };
}

/**
 * Valida los datos del formulario
 * 
 * @param {Object} formData - Datos del formulario a validar
 * @returns {boolean} true si todos los campos están completos, false en caso contrario
 */
function validateFormData(formData) {
    const { nombre, email, mensaje } = formData;
    return !(!nombre || !email || !mensaje);
}

/**
 * Muestra mensaje de error de validación
 */
function showValidationError() {
    alert('Por favor, completa todos los campos.');
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

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initContactForm);