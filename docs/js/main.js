/* ============================================================
   JS — Interações
   ============================================================ */

/* ============================================================
envio de email https://dashboard.emailjs.com/
============================================================ */
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'Ffh2Wy-R9kRrghhj0' });

  document.getElementById('formContato').addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs
      .send('service_q66140s', 'template_gbyr9ur', {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        mensagem: document.getElementById('mensagem').value,
      })
      .then(
        function () {
          const statusEl = document.getElementById('formMsg');
          statusEl.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
          statusEl.classList.add('show');
        },
        function (error) {
          const statusEl = document.getElementById('formMsg');
          statusEl.textContent = 'Erro ao enviar: ' + (error?.text || 'tente novamente.');
          statusEl.classList.add('show');
        }
      );
  });
} else {
  console.error('EmailJS nao carregou. Verifique a conexao ou bloqueios de script.');
}

// 1) Header com sombra ao rolar
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// 2) Menu hambúrguer (mobile)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});
// Fecha o menu ao clicar em um link
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// 3) Fade-in ao scroll (IntersectionObserver)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.count;
        const duration = 1600;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? '+' : '');
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);
counters.forEach((c) => counterObs.observe(c));

// 5) Formulário de contato (simulação)
const form = document.getElementById('formContato');
const formMsg = document.getElementById('formMsg');
if (form && typeof emailjs === 'undefined') {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    formMsg.classList.add('show');
    form.reset();
    setTimeout(() => formMsg.classList.remove('show'), 5000);
  });
}

// 6) Carrossel da seção Sobre
const sobreCarousel = document.getElementById('sobreCarousel');
if (sobreCarousel) {
  const track = document.getElementById('sobreCarouselTrack');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const prevBtn = document.getElementById('sobrePrev');
  const nextBtn = document.getElementById('sobreNext');
  const dots = Array.from(document.querySelectorAll('#sobreDots .dot'));
  let current = 0;
  let autoplay = null;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplay = setInterval(() => goTo(current + 1), 4500);
  };

  const stopAutoplay = () => {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  };

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goTo(index);
      startAutoplay();
    });
  });

  sobreCarousel.addEventListener('mouseenter', stopAutoplay);
  sobreCarousel.addEventListener('mouseleave', startAutoplay);
  sobreCarousel.addEventListener('focusin', stopAutoplay);
  sobreCarousel.addEventListener('focusout', startAutoplay);

  goTo(0);
  startAutoplay();
}
