// Header: sombra/blur ao rolar
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reinicia animações CSS de uma lista de elementos quando o container entra na tela
function playAnimationOnScroll(container, elements, delayStep) {
  if (!container || elements.length === 0) return;

  const replay = () => {
    elements.forEach((el, i) => {
      el.style.animation = 'none';
      // força reflow para permitir reiniciar a animação
      void el.offsetWidth;
      el.style.animationDelay = `${i * delayStep}s`;
      el.style.animation = '';
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            replay();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(container);
  } else {
    replay();
  }
}

// Mockup do chat do WhatsApp
const chatBody = document.getElementById('chatBody');
playAnimationOnScroll(chatBody, chatBody ? Array.from(chatBody.querySelectorAll('.bubble')) : [], 0.45);

// Mockup do Google Calendar
const calendarCard = document.querySelector('.calendar-card');
const calendarEvent = document.getElementById('calendarEvent');
const calendarToast = document.getElementById('calendarToast');
playAnimationOnScroll(calendarCard, [calendarEvent, calendarToast].filter(Boolean), 0.5);

// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
