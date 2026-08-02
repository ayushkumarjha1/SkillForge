/* ==========================================================================
   SkillForge Client-Side Runtime — SaaS Interactions & Utilities
   ========================================================================== */

(function () {
  'use strict';

  // 1. Theme Management (Dark / Light Mode)
  const initTheme = () => {
    const savedTheme = localStorage.getItem('skillforge_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('skillforge_theme', newTheme);
        updateThemeIcons();
      });
    });

    updateThemeIcons();
  };

  const updateThemeIcons = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    toggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  // 2. Mobile Drawer Navigation
  const initMobileNav = () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (!mobileToggle || !sidebar) return;

    const openDrawer = () => {
      sidebar.classList.add('drawer-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      sidebar.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
  };

  // 3. Command Palette (Ctrl+K / Cmd+K)
  const initCommandPalette = () => {
    const modalBackdrop = document.querySelector('.cmd-modal-backdrop');
    const searchTriggers = document.querySelectorAll('.cmd-search-trigger');
    const searchInput = document.querySelector('.cmd-search-input');
    const resultsList = document.querySelector('.cmd-results-list');

    if (!modalBackdrop) return;

    const openModal = () => {
      modalBackdrop.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
      filterItems('');
    };

    const closeModal = () => {
      modalBackdrop.classList.remove('open');
    };

    searchTriggers.forEach(t => t.addEventListener('click', openModal));

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        modalBackdrop.classList.contains('open') ? closeModal() : openModal();
      }
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });

    if (searchInput && resultsList) {
      searchInput.addEventListener('input', (e) => {
        filterItems(e.target.value.toLowerCase());
      });
    }

    function filterItems(query) {
      if (!resultsList) return;
      const items = resultsList.querySelectorAll('.cmd-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }
  };

  // 4. Global Toast Notifications
  window.showToast = (message, type = 'info') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error' || type === 'danger') iconName = 'alert-circle';
    if (type === 'warning') iconName = 'alert-triangle';

    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // 5. Copy to Clipboard Utility
  window.copyToClipboard = (text, btnElement) => {
    navigator.clipboard.writeText(text).then(() => {
      if (btnElement) {
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = '<i data-lucide="check"></i> Copied!';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          btnElement.innerHTML = originalHTML;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      }
      window.showToast('Copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Copy failed:', err);
      window.showToast('Failed to copy', 'error');
    });
  };

  // 6. Initialize on DOM Load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initCommandPalette();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

})();
