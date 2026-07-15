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
        fetch('data/projects.json')
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
        });
    }

    // Cerrar el chatbot con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
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

    // Lógica para ocultar/mostrar elementos con el scroll
    const header = document.querySelector('.header');
    const tabbar = document.querySelector('.tabbar');
    let lastScrollTop = 0;

    // Se apartan al bajar y vuelven al subir o al detenerse el scroll. Comparten
    // la lista para que el FAB y la tab bar no se desincronicen.
    const autoHidingElements = [chatbotToggle, tabbar].filter(Boolean);

    const revealAfterScrollStop = debounce(() => {
        autoHidingElements.forEach(el => el.classList.remove('hidden'));
    }, 250);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Lógica para el header
        if (header) {
            // Ocultar al bajar, mostrar al subir
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        }

        if (autoHidingElements.length) {
            const scrollingDown = scrollTop > lastScrollTop;
            autoHidingElements.forEach(el => el.classList.toggle('hidden', scrollingDown));
            revealAfterScrollStop();
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // =============================================
    // ===== SECCIÓN ACTUAL (HEADER + TAB BAR) =====
    // =============================================

    /**
     * @description Mantiene sincronizados el título del header y la pestaña
     * activa de la tab bar con la sección visible, leyendo el data-title de
     * cada <section>.
     */
    const headerTitle = document.getElementById('header-title');
    const sections = [...document.querySelectorAll('section[data-title]')];
    const tabs = document.querySelectorAll('.tabbar a');

    if (headerTitle && sections.length) {
        const visibleSections = new Set();

        const setCurrentSection = (section) => {
            if (headerTitle.textContent !== section.dataset.title) {
                headerTitle.textContent = section.dataset.title;
            }

            tabs.forEach(tab => {
                // Una pestaña puede cubrir varias secciones (Perfil abarca #about).
                const covers = (tab.dataset.tabFor || '').split(' ').includes(section.id);
                tab.classList.toggle('active', covers);
                if (covers) {
                    tab.setAttribute('aria-current', 'true');
                } else {
                    tab.removeAttribute('aria-current');
                }
            });
        };

        const refreshCurrentSection = () => {
            // Al llegar al final de la página, la última sección ya no puede subir
            // hasta la banda de detección, así que nunca se activaría por sí sola.
            const reachedBottom = window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 4;

            const current = reachedBottom
                ? sections[sections.length - 1]
                // Si hay varias en la banda, gana la primera del documento.
                : sections.find(section => visibleSections.has(section));

            if (current) {
                setCurrentSection(current);
            }
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleSections.add(entry.target);
                } else {
                    visibleSections.delete(entry.target);
                }
            });
            refreshCurrentSection();
        }, {
            // Banda estrecha bajo el header: marca la sección al entrar por arriba.
            rootMargin: '-10% 0px -75% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));

        // El observer no dispara en el último tramo de scroll, donde ya no cambia
        // ninguna intersección; sin esto, el caso "final de página" no se detecta.
        window.addEventListener('scroll', refreshCurrentSection, { passive: true });
    }

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
 * Asegura que la página se cargue desde el principio, salvo que la URL traiga
 * un ancla (#projects, #contact…): ahí manda el enlace compartido.
 */
window.onload = function () {
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
};