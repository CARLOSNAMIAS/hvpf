/**
 * @file utils.js
 * @description Funciones de utilidad generales para el portafolio.
 * @author Carlos Gomez
 */

/**
 * Escapa caracteres HTML para prevenir ataques XSS.
 * @param {string} text - El texto a escapar.
 * @returns {string} Texto con caracteres HTML escapados.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Valida que un proyecto tenga la estructura correcta.
 * @param {Object} project - El proyecto a validar.
 * @returns {boolean} True si el proyecto es válido.
 */
function isValidProject(project) {
    return (
        project &&
        Array.isArray(project.images) &&
        typeof project.alt === 'string' &&
        typeof project.title === 'string' &&
        typeof project.text === 'string' &&
        typeof project.link === 'string'
    );
}

/**
 * Crea un debounce para funciones.
 * @param {Function} func - Función a ejecutar.
 * @param {number} wait - Tiempo de espera en milisegundos.
 * @returns {Function} Función con debounce aplicado.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
