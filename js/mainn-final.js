// mainn-final.js
// Merged JS (mainn.js + latihan inline) - compatible across all pages
// Features: page loader, dark/light theme (html.dark / html.light), mobile menu,
// gallery/training filter (supports data-cat or data-filter), lightbox, contact form,
// upload-to-localStorage gallery, smooth scroll, active nav, and fade-in observer.

// Page Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.style.display = 'none', 500);
    }, 300);
  }
});

// Dark Mode Toggle (unified logic)
// Uses localStorage key: 'theme' with values 'dark' or 'light'.
// Adds html.class 'dark' for dark mode, 'light' for explicit light mode (some CSS targets .light .title-gradient)
const initDarkMode = () => {
  const darkToggle = document.getElementById('darkToggle');
  const darkToggleMobile = document.getElementById('darkToggleMobile');
  const darkIcon = document.getElementById('darkIcon');
  const darkIconMobile = document.getElementById('darkIconMobile');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme'); // 'dark' or 'light'
  const defaultTheme = saved || 'dark';
  applyTheme(defaultTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark'); html.classList.remove('light');
    } else {
      html.classList.remove('dark'); html.classList.add('light');
    }
    updateIcons(theme);
    localStorage.setItem('theme', theme);
  }

  function updateIcons(theme) {
    const iconClass = theme === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    if (darkIcon) darkIcon.className = iconClass;
    if (darkIconMobile) darkIconMobile.className = iconClass;
  }

  function toggleTheme() {
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  if (darkToggle) darkToggle.addEventListener('click', toggleTheme);
  if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleTheme);
};

// Mobile Menu Toggle (with outside click close)
const initMobileMenu = () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !expanded);
  });

  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', false);
    }
  });
};

// Gallery / Training Filter (supports data-cat OR data-filter)
const initGalleryFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item, .training-card');

  if (filterBtns.length === 0) return;

  // Activate first button if none active
  if (![...filterBtns].some(b=>b.classList.contains('active'))) filterBtns[0].classList.add('active');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || btn.dataset.cat || btn.getAttribute('data-filter') || btn.getAttribute('data-cat');
      // update active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // show/hide items
      galleryItems.forEach(item => {
        const cat = item.dataset.cat || item.dataset.category || item.getAttribute('data-category') || item.dataset.filter;
        if (!filter || filter === 'all' || filter === 'All' || cat === filter) {
          item.style.display = (item.classList.contains('training-card')) ? 'flex' : 'block';
          // add a small animation
          item.style.animation = 'fadeIn 0.45s ease-in';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
};

// Lightbox for gallery items
const initLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbClose = document.getElementById('lb-close');
  const galleryItems = document.querySelectorAll('.gallery-item, .training-card');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || item.querySelector('h3, h4')?.textContent || '';
      const desc = item.dataset.desc || item.querySelector('p')?.textContent || '';
      const img = item.dataset.img || item.dataset.src || item.querySelector('img')?.src || '';

      if (lbTitle) lbTitle.textContent = title;
      if (lbDesc) lbDesc.textContent = desc;
      if (lbImg) lbImg.src = img || 'https://via.placeholder.com/800x600?text=Preview';

      lightbox.classList.remove('hidden'); lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add('hidden'); lightbox.classList.remove('flex');
    document.body.style.overflow = 'auto';
  };

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox(); });
};

// Contact form handler (global)
window.submitContact = (e) => {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  if (!form) return false;
  const name = document.getElementById('name')?.value;
  const email = document.getElementById('email')?.value;
  const message = document.getElementById('message')?.value;
  if (!name || !email || !message) { alert('Mohon isi semua field!'); return false; }
  alert(`Terima kasih ${name}!\n\nPesan Anda telah diterima (demo mode).`);
  form.reset();
  return false;
};

// Upload form (upload.html) -> save to localStorage galleryItems
const initUpload = () => {
  const uploadForm = document.getElementById('uploadForm');
  if (!uploadForm) return;
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title')?.value || 'Untitled';
    const desc = document.getElementById('desc')?.value || '';
    const fileInput = document.getElementById('file');
    let fileUrl = '';
    if (fileInput && fileInput.files && fileInput.files[0]) {
      fileUrl = URL.createObjectURL(fileInput.files[0]);
    }
    const newItem = { title, desc, img: fileUrl, date: new Date().toLocaleString() };
    const existing = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    existing.push(newItem);
    localStorage.setItem('galleryItems', JSON.stringify(existing));
    uploadForm.reset();
    const success = document.getElementById('successMsg'); if (success) success.classList.remove('hidden');
  });
};

// Populate gallery from localStorage on pages that have galleryGrid
const populateGalleryFromStorage = () => {
  const galleryGrid = document.getElementById('galleryGrid') || document.getElementById('trainingGrid');
  if (!galleryGrid) return;
  const stored = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  stored.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item glass p-4 cursor-pointer';
    div.setAttribute('data-cat', item.cat || 'web');
    div.setAttribute('data-title', item.title);
    div.setAttribute('data-desc', item.desc);
    div.setAttribute('data-img', item.img);
    div.innerHTML = `
      <div class="w-full h-40 bg-white/5 rounded-lg mb-3 grid place-items-center text-slate-400">
        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover rounded-lg" />
      </div>
      <h4 class="font-semibold">${item.title}</h4>
      <p class="text-sm text-slate-400">${item.desc}</p>
    `;
    galleryGrid.appendChild(div);
  });
};

// Smooth scroll for anchor links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// Active nav link based on current page
const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) link.classList.add('active'); else link.classList.remove('active');
  });
};

// Intersection Observer for fade-in
const initScrollAnimations = () => {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; observer.observe(el);
  });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  initGalleryFilter();
  initLightbox();
  initUpload();
  populateGalleryFromStorage();
  initSmoothScroll();
  setActiveNavLink();
  initScrollAnimations();
});

// Resize handler (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { console.log('Viewport resized'); }, 250);
});
