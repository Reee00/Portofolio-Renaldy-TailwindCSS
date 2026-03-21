(function () {
  const ASSET_VERSION = '20260319';
  const HEADER_TARGET_ID = 'site-header';
  const FOOTER_TARGET_ID = 'site-footer';
  const FALLBACK_HEADER = `
    <header class="sticky top-4 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="bg-white/5 dark:bg-white/3 backdrop-blur-lg border border-white/6 rounded-2xl p-2 md:p-3 shadow-lg">
          <div class="flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2 md:gap-3" data-link>
              <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 grid place-items-center text-black font-bold flex-shrink-0">AR</div>
              <div>
                <div class="font-semibold text-sm md:text-base">Ahmad <span class="text-cyan-300">Renaldy</span></div>
                <div class="text-xs text-slate-400 dark:text-slate-300">Web & Digital Media</div>
              </div>
            </a>
            <div class="hidden md:flex items-center gap-5">
              <a href="index.html" class="nav-link" data-link>Home</a>
              <a href="gallery.html" class="nav-link" data-link>Case Studies</a>
              <a href="about.html" class="nav-link" data-link>About</a>
              <a href="profile.html" class="nav-link" data-link>Profile</a>
              <a href="contact.html" class="nav-link" data-link>Contact</a>
              <button id="darkToggle" aria-label="Toggle dark mode" class="p-2 rounded-lg bg-white/3 hover:bg-white/6"><i id="darkIcon" class="fa-regular fa-moon"></i></button>
            </div>
            <div class="md:hidden flex items-center gap-2">
              <button id="darkToggleMobile" class="p-2 rounded-lg bg-white/3" aria-label="Toggle dark mode mobile"><i id="darkIconMobile" class="fa-regular fa-moon"></i></button>
              <button id="menuBtn" class="p-2 rounded-lg bg-white/4" aria-label="Toggle menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
            </div>
          </div>
          <div id="mobileMenu" class="hidden md:hidden mt-4 pt-4 border-t border-white/10">
            <div class="flex flex-col gap-2">
              <a href="index.html" class="nav-link-mobile" data-link><i class="fa-solid fa-home w-5"></i><span>Home</span></a>
              <a href="gallery.html" class="nav-link-mobile" data-link><i class="fa-solid fa-briefcase w-5"></i><span>Case Studies</span></a>
              <a href="about.html" class="nav-link-mobile" data-link><i class="fa-solid fa-user w-5"></i><span>About</span></a>
              <a href="profile.html" class="nav-link-mobile" data-link><i class="fa-solid fa-id-card w-5"></i><span>Profile</span></a>
              <a href="contact.html" class="nav-link-mobile" data-link><i class="fa-solid fa-envelope w-5"></i><span>Contact</span></a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `;
  const FALLBACK_FOOTER = `
    <footer class="py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
        <span>&copy; <strong>Ahmad Renaldy</strong> &mdash; Maintainer yayasankankeranakindonesia.com</span>
      </div>
    </footer>
  `;

  const applyStoredThemeEarly = () => {
    let savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('theme') || 'dark';
    } catch {
      savedTheme = 'dark';
    }
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  };

  const setActiveLink = () => {
    const activePage =
      document.body.dataset.navActive ||
      window.location.pathname.split('/').pop() ||
      'index.html';

    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === activePage);
    });
  };

  const loadFragment = async (targetId, fragmentPath, fallbackMarkup) => {
    const target = document.getElementById(targetId);
    if (!target) return false;

    try {
      // ?v= query string handles cache busting when assets change
      const response = await fetch(`${fragmentPath}?v=${ASSET_VERSION}`);
      if (!response.ok) {
        throw new Error(`Gagal memuat ${fragmentPath}`);
      }

      target.innerHTML = await response.text();
      return true;
    } catch (error) {
      if (fallbackMarkup) {
        target.innerHTML = fallbackMarkup;
      }
      console.error('Shared layout fetch failed:', error);
      return false;
    }
  };

  const syncBehavior = () => {
    if (typeof window.initializePortfolioFeatures === 'function') {
      window.initializePortfolioFeatures();
    }
    if (window.ThemeManager && typeof window.ThemeManager.syncIcons === 'function') {
      window.ThemeManager.syncIcons();
    }
  };

  const initSharedLayout = async () => {
    applyStoredThemeEarly();

    await Promise.all([
      loadFragment(HEADER_TARGET_ID, 'components/header.html', FALLBACK_HEADER),
      loadFragment(FOOTER_TARGET_ID, 'components/footer.html', FALLBACK_FOOTER),
    ]);

    setActiveLink();
    syncBehavior();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedLayout);
  } else {
    initSharedLayout();
  }
})();
