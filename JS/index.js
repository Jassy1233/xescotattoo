document.addEventListener("DOMContentLoaded", function() {
     // NAV SCROLL
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });

    // MOBILE MENU
    const mob = document.getElementById('mob');
    function openMob() { mob.classList.add('open'); document.body.style.overflow = 'hidden' }
    function closeMob() { mob.classList.remove('open'); document.body.style.overflow = '' }
    document.getElementById('hamburger').addEventListener('click', openMob);
    document.getElementById('mobClose').addEventListener('click', closeMob);
    document.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', () => {
        closeMob();
        const id = a.getAttribute('href');
        setTimeout(() => { const el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 80);
      });
    });
    // Close on backdrop tap
    mob.addEventListener('click', e => { if (e.target === mob) closeMob() });

    // REVEAL OBSERVER
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target) } })
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(el => ro.observe(el));

    // STAGGER OBSERVER
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stag').forEach((el, i) => setTimeout(() => el.classList.add('on'), i * 70));
          so.unobserve(e.target);
        }
      })
    }, { threshold: .1 });
    document.querySelectorAll('#galGrid').forEach(el => so.observe(el));

    // COUNTER
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-count]').forEach(el => {
            const t = parseInt(el.dataset.count), d = 1400, s = 50, step = t / s;
            let c = 0;
            const timer = setInterval(() => {
              c += step;
              if (c >= t) { c = t; clearInterval(timer) }
              el.textContent = '+' + Math.floor(c).toLocaleString('es-ES');
            }, d / s);
          });
          co.unobserve(e.target);
        }
      })
    }, { threshold: .5 });
    document.querySelectorAll('.statsbar,.met-grid').forEach(el => co.observe(el));

    // PARALLAX KANJI
    window.addEventListener('scroll', () => {
      const y = scrollY;
      document.querySelectorAll('.kanji-deco').forEach((k, i) => {
        k.style.transform = `translateY(${y * (0.12 + i * .06)}px)`;
      });
    }, { passive: true });

    // SMOOTH ANCHOR (excluding mob-links, handled separately)
    document.querySelectorAll('a[href^="#"]:not(.mob-link)').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }) }
      });
    });

    // LIGHTBOX
    const lb = document.getElementById('lb');
    const lbImg = document.getElementById('lbImg');
    const lbCounter = document.getElementById('lbCounter');
    const galleryImgs = Array.from(document.querySelectorAll('#galGrid .gi img'));
    let lbIdx = 0;

    function lbOpen(idx) {
      lbIdx = idx;
      lbImg.src = galleryImgs[idx].src;
      lbCounter.textContent = (idx + 1) + ' / ' + galleryImgs.length;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function lbClose() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    function lbNav(dir) {
      lbIdx = (lbIdx + dir + galleryImgs.length) % galleryImgs.length;
      lbImg.style.animation = 'none';
      lbImg.offsetHeight; // reflow
      lbImg.style.animation = '';
      lbImg.src = galleryImgs[lbIdx].src;
      lbCounter.textContent = (lbIdx + 1) + ' / ' + galleryImgs.length;
    }

    document.querySelectorAll('#galGrid .gi').forEach((gi, i) => {
      gi.addEventListener('click', () => lbOpen(i));
    });
    document.getElementById('lbClose').addEventListener('click', lbClose);
    document.getElementById('lbPrev').addEventListener('click', () => lbNav(-1));
    document.getElementById('lbNext').addEventListener('click', () => lbNav(1));
    lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });
});