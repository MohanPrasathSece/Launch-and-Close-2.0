import { initHeroShader } from './shader.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize WebGL Liquid Gradient Background
  try {
    initHeroShader('hero-shader');
  } catch (err) {
    console.warn('WebGL shader initialization skipped:', err);
  }

  // 2. Mobile Drawer Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Process Section Sticky Spine ScrollSpy
  const processCards = document.querySelectorAll('.process-card');
  const spineItems = document.querySelectorAll('.spine-item');

  if (processCards.length > 0 && spineItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.2
    };

    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute('data-stage-index');
          spineItems.forEach((item, i) => {
            if (i.toString() === index) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    processCards.forEach((card, i) => {
      card.setAttribute('data-stage-index', i.toString());
      processObserver.observe(card);
    });

    spineItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (processCards[i]) {
          processCards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // 4. Interactive Contact Form Submission State & LeadConnector Sync
  const contactForm = document.getElementById('lead-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.innerHTML;
      const formData = new FormData(contactForm);

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending Request...
      `;

      // Post in background to LeadConnector
      try {
        fetch('https://api.leadconnectorhq.com/widget/form/BeMJU7AZJ6HAkTePUNPj', {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        }).catch(() => {});
      } catch (err) {}

      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Request Received! We'll reply within 1 business day.
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #00C853 0%, #009624 100%)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 6000);
      }, 1000);
    });
  }

  // 5. Smooth Scroll-to-Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
