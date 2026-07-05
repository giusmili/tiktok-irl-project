(() => {
  const sectionLabels = ['00 Cover','01 Intro','02 Concept','03 Objectifs','04 Chiffres','05 Marque','06 Étude de cas','07 Résultats','08 Formats','09 Contact','10 Merci'];
  const navLabels = ['Accueil','Introduction','Concept','Objectifs','Chiffres clés','Application','Campagne créative','Collaborations','Vidéos & UGC','Contact'];

  const faqData = [
    { q: "Pourquoi organiser un Pop-Up Store ?", a: "Montrer que TikTok est bien plus qu'une application de divertissement : un acteur majeur de la culture populaire qui fait vivre cette culture dans le monde réel." },
    { q: "Pourquoi avoir choisi Paris ?", a: "La France est le premier marché européen de TikTok, avec près de 28 millions d'utilisateurs actifs mensuels. Paris, capitale culturelle internationale, s'impose comme le lieu idéal pour ce concept." },
    { q: "Quel est l'objectif de TikTok IRL ?", a: "Créer un lien entre les communautés digitales et le monde physique, en valorisant les créateurs, les partenaires et la richesse culturelle de la plateforme." },
    { q: "Pourquoi Spotify et Huda Beauty ?", a: "Ces deux partenaires représentent deux univers particulièrement présents sur TikTok, la musique et la beauté, et incarnent parfaitement les tendances qui animent la plateforme." },
    { q: "Quels créateurs seront présents ?", a: "Plusieurs créateurs emblématiques, notamment Léa Elui et EnjoyPhoenix, ainsi que des lauréats des TikTok Awards et de nombreux talents émergents." },
    { q: "Pourquoi parler de culture populaire ?", a: "TikTok influence aujourd'hui les tendances musicales, la littérature, la gastronomie, la mode et les comportements de consommation, un impact que l'événement entend valoriser." },
  ];

  const scroller = document.getElementById('scroller');
  const sections = Array.from(scroller.querySelectorAll('[data-section]'));
  const dotNav = document.getElementById('dotNav');
  let activeIndex = 0;
  let scrollRaf = null;

  sectionLabels.forEach((label, i) => {
    const a = document.createElement('a');
    a.href = `#${sections[i] ? sections[i].id : ''}`;
    a.title = label;
    if (i === 0) a.className = 'active';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToIndex(i);
    });
    dotNav.appendChild(a);
  });
  const dots = Array.from(dotNav.children);

  const menuBtn = document.getElementById('menuBtn');
  const navOverlay = document.getElementById('navOverlay');
  const navPanel = document.getElementById('navPanel');

  navLabels.forEach((label, i) => {
    const a = document.createElement('a');
    a.href = `#${sections[i] ? sections[i].id : ''}`;
    a.textContent = label;
    if (i === 0) a.className = 'active';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToIndex(i);
      closeMenu();
    });
    navPanel.appendChild(a);
  });
  const navLinks = Array.from(navPanel.children);

  function openMenu() {
    menuBtn.classList.add('open');
    navOverlay.classList.add('open');
    navPanel.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menuBtn.classList.remove('open');
    navOverlay.classList.remove('open');
    navPanel.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    if (navPanel.classList.contains('open')) closeMenu(); else openMenu();
  });
  navOverlay.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  function setActive(i) {
    activeIndex = i;
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
    navLinks.forEach((l, li) => l.classList.toggle('active', li === i));
  }

  function scrollToIndex(i) {
    i = Math.max(0, Math.min(sections.length - 1, i));
    const target = sections[i];
    if (!target) return;
    animateScrollTo(target.offsetTop);
  }

  function animateScrollTo(targetTop) {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    const start = scroller.scrollTop;
    const distance = targetTop - start;
    if (Math.abs(distance) < 1) return;
    const duration = 650;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      scroller.scrollTop = start + distance * ease(t);
      if (t < 1) scrollRaf = requestAnimationFrame(step);
    };
    scrollRaf = requestAnimationFrame(step);
  }

  document.querySelectorAll('.video-thumb').forEach((thumb) => {
    const v = thumb.querySelector('video');
    if (!v) return;
    v.addEventListener('play', () => thumb.classList.add('is-playing'));
    v.addEventListener('pause', () => thumb.classList.remove('is-playing'));
    v.addEventListener('ended', () => thumb.classList.remove('is-playing'));
  });

  const videoIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const v = entry.target;
      v.src = v.dataset.src;
      v.removeAttribute('data-src');
      v.load();
      videoIo.unobserve(v);
    });
  }, { root: scroller, threshold: 0.01 });
  document.querySelectorAll('video.lazy-video[data-src]').forEach((v) => videoIo.observe(v));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = sections.indexOf(entry.target);
        if (idx !== -1) {
          setActive(idx);
          entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
        }
      }
    });
  }, { root: scroller, threshold: 0.35 });
  sections.forEach((s) => io.observe(s));
  sections[0].querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  });

  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqData.forEach((f) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      const q = document.createElement('div');
      q.className = 'faq-q';
      q.innerHTML = '<div class="text"></div><div class="mark">+</div>';
      q.querySelector('.text').textContent = f.q;
      const aWrap = document.createElement('div');
      aWrap.className = 'faq-a-wrap';
      const p = document.createElement('p');
      p.textContent = f.a;
      aWrap.appendChild(p);
      q.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        faqList.querySelectorAll('.faq-item.open').forEach((el) => el.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
      item.appendChild(q);
      item.appendChild(aWrap);
      faqList.appendChild(item);
    });
  }

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
