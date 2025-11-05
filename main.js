/**
 * @file main.js
 * @description Archivo principal que inicializa el portafolio y maneja los eventos.
 * @author Carlos Gomez
 */

// =============================================
// ============== INICIALIZACIÓN ===============
// =============================================

// Inicializa la librería AOS para animaciones al hacer scroll.
AOS.init({
    duration: 800,
    once: true
});

// =============================================
// ============== INICIALIZACIÓN ===============
// =============================================

/**
 * @description Event listener que se ejecuta cuando el DOM está completamente cargado.
 * Se encarga de inicializar la renderización de proyectos y la lógica del chatbot.
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector(SELECTORS.PROJECTS_CONTAINER);

    // =============================================
    // ========== CARGAR PROYECTOS =================
    // =============================================
    
    if (projectsContainer) {
        fetch('projects.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('El formato de datos no es válido');
                }
                projects = data;
                renderProjects(projects, projectsContainer);
            })
            .catch(error => {
                console.error('Error al cargar los proyectos:', error);
                projectsContainer.innerHTML = `
                    <div class="error-message" style="text-align: center; padding: 2rem;">
                        <p style="color: var(--text-color); margin-bottom: 1rem;">
                            ⚠️ Error al cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
                        </p>
                        <button onclick="location.reload()" class="btn-x" style="cursor: pointer;">
                            Reintentar
                        </button>
                    </div>
                `;
            });
    }

    // =============================================
    // ========== EVENTOS DE PROYECTOS =============
    // =============================================
    
    if (projectsContainer) {
        projectsContainer.addEventListener('click', async (e) => {
            const target = e.target;
            
            // PRIORIDAD 1: Si es un enlace o está dentro de un enlace, dejarlo funcionar normalmente
            const linkElement = target.closest('a.project-link');
            if (linkElement) {
                // Dejar que el navegador maneje el click en el enlace
                return;
            }

            // Ahora sí, obtener la tarjeta del proyecto para las demás acciones
            const projectCard = target.closest('.project-card');
            if (!projectCard) return;
            
            const projectIndex = parseInt(projectCard.dataset.projectIndex, 10);
            if (isNaN(projectIndex) || !projects[projectIndex]) {
                console.warn('Índice de proyecto inválido:', projectIndex);
                return;
            }
            
            const project = projects[projectIndex];

            // Acción: Click en el botón 'like'
            const likeAction = target.closest('.like-action');
            if (likeAction) {
                e.preventDefault();
                e.stopPropagation();
                likeAction.classList.toggle('liked');
                return;
            }

            // Acción: Click en el botón 'share'
            const shareAction = target.closest('.share-action');
            if (shareAction) {
                e.preventDefault();
                e.stopPropagation();
                
                const shareData = {
                    title: `Proyecto de Carlos Gómez: ${project.title}`,
                    text: project.text,
                    url: project.link
                };

                // Usar la API de Web Share si está disponible
                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                        console.log('Contenido compartido con éxito:', project.title);
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error al compartir:', error);
                        }
                    }
                } else {
                    // Fallback: copiar al portapapeles
                    try {
                        await navigator.clipboard.writeText(project.link);
                        showNotification(`¡Enlace de "${project.title}" copiado al portapapeles!`);
                    } catch (err) {
                        console.error('Error al copiar al portapapeles:', err);
                        showNotification('Error al copiar el enlace.');
                    }
                }
                return;
            }

            // Acción: Click en cualquier otra parte de la tarjeta para abrir el modal
            e.preventDefault();
            openModal(project);
        });
    }

    // =============================================
    // ========== EVENTOS DEL MODAL ================
    // =============================================
    
    const closeModalBtn = document.querySelector(SELECTORS.MODAL_CLOSE);
    const modalOverlay = document.querySelector(SELECTORS.MODAL_OVERLAY);

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector(SELECTORS.MODAL);
            if (modal && modal.classList.contains('show')) {
                closeModal();
            }
            const chatbotWindow = document.querySelector(SELECTORS.CHATBOT_WINDOW);
            if (chatbotWindow && chatbotWindow.classList.contains('show')) {
                closeChatbot();
            }
        }
    });

    // =============================================
    // ========== EVENTOS DEL CHATBOT ==============
    // =============================================
    
    const chatbotToggle = document.querySelector(SELECTORS.CHATBOT_TOGGLE);
    const chatbotClose = document.querySelector(SELECTORS.CHATBOT_CLOSE);
    const chatbotOverlay = document.querySelector(SELECTORS.CHATBOT_OVERLAY);
    const userInput = document.querySelector(SELECTORS.USER_INPUT);
    const sendButton = document.querySelector(SELECTORS.CHATBOT_SEND_BTN);

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', openChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }

    if (chatbotOverlay) {
        chatbotOverlay.addEventListener('click', closeChatbot);
    }

    // Lógica para ocultar/mostrar el botón del chatbot al hacer scroll
    let lastScrollTop = 0;
    const handleScroll = debounce(() => {
        if (chatbotToggle) {
            chatbotToggle.classList.remove('hidden');
        }
    }, 250);

    window.addEventListener('scroll', () => {
        if (!chatbotToggle) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            chatbotToggle.classList.add('hidden');
        } else {
            chatbotToggle.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        handleScroll();
    });

    // Manejo de botones de acceso rápido del chatbot
    const quickButtons = document.querySelectorAll('.chatbot-body .btn-x.btn-sm');
    quickButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();

            if (buttonText === 'Ver proyectos') {
                addMessage('Ver proyectos', true);
                addMessage('¡Genial! Te llevaré a la sección de proyectos. 🚀');
                setTimeout(() => scrollToSection('#projects'), 800);
            } else if (buttonText === 'Saber más sobre Carlos') {
                addMessage('Saber más sobre Carlos', true);
                addMessage(getRandomResponse(chatbotResponses.about));
            } else if (buttonText === 'Contactarlo') {
                addMessage('Contactarlo', true);
                addMessage('¡Perfecto! Te dirijo al formulario de contacto. 📧');
                setTimeout(() => scrollToSection('#contact'), 800);
            }
        });
    });

    // Lógica para enviar mensajes
    if (sendButton) {
        sendButton.addEventListener('click', () => sendMessage(userInput));
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(userInput);
            }
        });
    }
});

/**
 * Asegura que la página se cargue desde el principio.
 */
window.onload = function () {
    window.scrollTo(0, 0);
};