/* main.js
   Handles: loader, dark mode persistence, fade-in animations,
   page transitions (fade out), gallery filter & lightbox, contact demo validation.
*/

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Loader ----------
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => { loader.classList.add('hidden'); }, 500);
  }

  // ---------- Dark Mode with persistence ----------
  const root = document.documentElement;
  const darkKey = 'ahmad_theme_v1';
  const icon = document.getElementById('darkIcon');
  const iconMobile = document.getElementById('darkIconMobile');

  function applyDark(dark) {
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
    if (iconMobile) iconMobile.className = dark ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
  }

  try {
    const stored = localStorage.getItem(darkKey);
    if (stored === 'dark') applyDark(true);
    else if (stored === 'light') applyDark(false);
    else applyDark(true);
  } catch (e) { applyDark(true); }

  const toggles = document.querySelectorAll('#darkToggle, #darkToggleMobile');
  toggles.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      try { localStorage.setItem(darkKey, isDark ? 'dark' : 'light'); } catch(e){}
      applyDark(isDark);
    });
  });

  // ---------- Page transition (fade-out before navigating) ----------
  const links = document.querySelectorAll('a[data-link]');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => window.location.href = href, 320);
    });
  });

  // ---------- IntersectionObserver for fade-in ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  // ---------- Smooth scroll for same-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) { ev.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ---------- Gallery filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-indigo-600','text-white'));
      btn.classList.add('bg-indigo-600','text-white');
      const cat = btn.dataset.cat;
      galleryItems.forEach(it => {
        const itCat = it.dataset.cat || 'all';
        if (cat === 'all' || itCat === cat) {
          it.classList.remove('hidden');
          setTimeout(()=> { it.style.display = ''; }, 220);
        } else {
          it.classList.add('hidden');
          setTimeout(()=> { it.style.display = 'none'; }, 260);
        }
      });
    });
  });
  if (filterBtns.length) filterBtns[0].click();

  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbClose = document.getElementById('lb-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.dataset.img || item.querySelector('img')?.src || '';
      const title = item.dataset.title || item.querySelector('h4')?.innerText || '';
      const desc = item.dataset.desc || item.querySelector('p')?.innerText || '';
      if (!lightbox) return;
      if (lbImg) lbImg.src = img;
      if (lbTitle) lbTitle.textContent = title;
      if (lbDesc) lbDesc.textContent = desc;
      lightbox.classList.remove('hidden'); lightbox.classList.add('flex');
    });
  });

  if (lbClose) lbClose.addEventListener('click', () => {
    if (lightbox) { lightbox.classList.add('hidden'); lightbox.classList.remove('flex'); if (lbImg) lbImg.src = ''; }
  });
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose && lbClose.click(); });

  // ---------- Contact demo submit ----------
  window.submitContact = function(e) {
    e.preventDefault();
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();
    if (!name || !email || !message) { alert('Silakan lengkapi semua field.'); return false; }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) { alert('Masukkan email valid.'); return false; }
    alert('Pesan berhasil dikirim (demo). Integrasikan Formspree atau endpoint Anda untuk pengiriman nyata.');
    e.target.reset && e.target.reset();
    return false;
  };

});
