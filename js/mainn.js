// Page Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }, 300);
  }
});

// Theme Manager (robust for dynamic header/footer)
const ThemeManager = (() => {
  const THEME_KEY = 'theme';

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage failures and keep runtime theme only.
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const getCurrentTheme = () => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const syncIcons = () => {
    const theme = getCurrentTheme();
    const iconClass = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    document.querySelectorAll('#darkIcon, #darkIconMobile').forEach((icon) => {
      icon.className = `fa-regular ${iconClass}`;
    });
  };

  const setTheme = (theme) => {
    applyTheme(theme);
    saveTheme(theme);
    syncIcons();
  };

  const toggleTheme = () => {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const init = () => {
    applyTheme(getSavedTheme());
    syncIcons();

    if (window.__themeSystemInitialized) return;
    window.__themeSystemInitialized = true;

    // Delegation keeps toggle working even when header is injected dynamically.
    document.addEventListener('click', (event) => {
      const button = event.target.closest('#darkToggle, #darkToggleMobile');
      if (!button) return;
      event.preventDefault();
      toggleTheme();
    });
  };

  return {
    init,
    setTheme,
    syncIcons,
  };
})();

const initDarkMode = () => {
  ThemeManager.init();
};

window.ThemeManager = ThemeManager;

// Mobile Menu Toggle
const initMobileMenu = () => {
  if (window.__mobileMenuSystemInitialized) return;
  window.__mobileMenuSystemInitialized = true;

  const closeMenu = () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', (event) => {
    const menuBtn = event.target.closest('#menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
      return;
    }

    if (!event.target.closest('#mobileMenu')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#mobileMenu a')) return;
    closeMenu();
  });
};

// Gallery Filter
const initGalleryFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  // Set first button as active
  filterBtns[0]?.classList.add('active');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.cat;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        const itemCat = item.dataset.cat;
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease-in';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
};

// Lightbox
const initLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbClose = document.getElementById('lb-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title;
      const desc = item.dataset.desc;
      const img = item.dataset.img;

      lbTitle.textContent = title;
      lbDesc.textContent = desc;
      lbImg.src = img || 'https://via.placeholder.com/800x600?text=Project+Image';
      
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = 'auto';
  };

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
};

// Contact Form Handler (async submit with inline status)
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    const formData = new FormData(form);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Mengirim...';
    }

    status.classList.remove('hidden', 'text-red-500', 'text-green-500');
    status.classList.add('text-slate-500');
    status.textContent = 'Sedang mengirim pesan...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Submit failed');
      }

      form.reset();
      status.classList.remove('text-slate-500', 'text-red-500');
      status.classList.add('text-green-500');
      status.textContent = 'Pesan berhasil dikirim. Terima kasih!';
    } catch (error) {
      status.classList.remove('text-slate-500', 'text-green-500');
      status.classList.add('text-red-500');
      status.textContent = 'Pesan gagal dikirim. Coba lagi dalam beberapa saat.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
};

// Smooth scroll for anchor links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
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
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

// Intersection Observer for fade-in animations
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

const initializePortfolioFeatures = () => {
  if (window.__portfolioFeaturesInitialized) return;
  window.__portfolioFeaturesInitialized = true;

  initDarkMode();
  initMobileMenu();
  initGalleryFilter();
  initLightbox();
  initContactForm();
  initSmoothScroll();
  setActiveNavLink();
  initScrollAnimations();
};

window.initializePortfolioFeatures = initializePortfolioFeatures;

// Initialize all features on DOM ready (or immediately if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolioFeatures);
} else {
  initializePortfolioFeatures();
}

// Handle viewport resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reserved for responsive recalculations when needed.
  }, 250);
});