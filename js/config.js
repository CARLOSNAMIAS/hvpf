/**
 * @file config.js
 * @description Variables de configuración y constantes globales para el portafolio.
 * @author Carlos Gomez
 */

const SELECTORS = {
    PROJECTS_CONTAINER: '#projects-container',
    CHATBOT_TOGGLE: '#chatbot-toggle',
    CHATBOT_WINDOW: '#chatbot-window',
    CHATBOT_CLOSE: '#chatbot-close',
    CHATBOT_OVERLAY: '#chatbot-overlay',
    USER_INPUT: '#userInput',
    NOTIFICATION: '#notification',
    CHATBOX: '.chatbox',
    CHATBOT_SEND_BTN: '#chatbot-send-btn'
};

const AVATAR_IMAGE = './img/avatar.jpg';
const AVATAR_ALT = 'Carlos Gómez ';
const USERNAME = '@carlosgomez';
const DISPLAY_NAME = 'Carlos Gómez';

/**
 * @typedef {Object} ProjectImage
 * @property {string} src - Ruta a la imagen.
 * @property {number} [w] - Ancho real en píxeles.
 * @property {number} [h] - Alto real en píxeles.
 */

/**
 * @typedef {Object} Project
 * @property {Array<string|ProjectImage>} images - Imágenes del proyecto. Con w/h el
 * navegador reserva la caja correcta y evita saltos de layout al cargar.
 * @property {string} alt - Texto alternativo base para las imágenes.
 * @property {string} title - Título del proyecto.
 * @property {string} text - Descripción del proyecto.
 * @property {string} link - URL al proyecto desplegado o a una página de "próximamente".
 */

/**
 * @type {Project[]}
 * @description Base de datos de los proyectos a mostrar en el portafolio.
 */
let projects = [];
