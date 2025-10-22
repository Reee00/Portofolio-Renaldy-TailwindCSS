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

// Dark Mode Toggle
const initDarkMode = () => {
  const darkToggle = document.getElementById('darkToggle');
  const darkToggleMobile = document.getElementById('darkToggleMobile');
  const darkIcon = document.getElementById('darkIcon');
  const darkIconMobile = document.getElementById('darkIconMobile');
  const html = document.documentElement;

  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.classList.toggle('dark', savedTheme === 'dark');
  updateIcons(savedTheme);

  function updateIcons(theme) {
    const iconClass = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    if (darkIcon) darkIcon.className = `fa-regular ${iconClass}`;
    if (darkIconMobile) darkIconMobile.className = `fa-regular ${iconClass}`;
  }

  function toggleTheme() {
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
    html.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
  }

  if (darkToggle) darkToggle.addEventListener('click', toggleTheme);
  if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleTheme);
};

// Mobile Menu Toggle
const initMobileMenu = () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
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

// Contact Form Handler
window.submitContact = (e) => {
  e.preventDefault();
  
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Simple validation
  if (!name || !email || !message) {
    alert('Mohon isi semua field!');
    return false;
  }

  // Demo: Show success message
  alert(`Terima kasih ${name}!\n\nPesan Anda telah diterima (demo mode).\n\nUntuk implementasi nyata, integrasikan dengan:\n- Formspree\n- EmailJS\n- Netlify Forms\n- Custom backend API`);
  
  form.reset();
  return false;
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

// Initialize all features on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  initGalleryFilter();
  initLightbox();
  initSmoothScroll();
  setActiveNavLink();
  initScrollAnimations();
});

// Handle viewport resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate any necessary layouts
    console.log('Viewport resized');
  }, 250);
});