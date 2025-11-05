/**
 * @file config.js
 * @description Variables de configuración y constantes globales para el portafolio.
 * @author Carlos Gomez
 */

const SELECTORS = {
    PROJECTS_CONTAINER: '#projects-container',
    MODAL: '#project-modal',
    MODAL_OVERLAY: '#project-modal-overlay',
    MODAL_CONTENT: '#project-modal-content',
    MODAL_CLOSE: '#project-modal-close',
    CHATBOT_TOGGLE: '#chatbot-toggle',
    CHATBOT_WINDOW: '#chatbot-window',
    CHATBOT_CLOSE: '#chatbot-close',
    CHATBOT_OVERLAY: '#chatbot-overlay',
    USER_INPUT: '#userInput',
    NOTIFICATION: '#notification',
    CHATBOX: '.chatbox',
    CHATBOT_SEND_BTN: '#chatbot-send-btn'
};

const AVATAR_IMAGE = './img/carlosjose.PNG';
const AVATAR_ALT = 'Carlos Gómez';
const USERNAME = '@carlosgomez';
const DISPLAY_NAME = 'Carlos Gómez';

/**
 * @typedef {Object} Project
 * @property {string[]} images - Array de rutas a las imágenes del proyecto.
 * @property {string} alt - Texto alternativo para las imágenes.
 * @property {string} title - Título del proyecto.
 * @property {string} text - Descripción del proyecto.
 * @property {string} link - URL al proyecto desplegado o a una página de "próximamente".
 */

/**
 * @type {Project[]}
 * @description Base de datos de los proyectos a mostrar en el portafolio.
 */
let projects = [];
