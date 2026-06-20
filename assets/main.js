// ============================================================
// NEVAR SYSTEMS — Shared interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dynamic Island Nav: shrink on scroll ---------- */
  const islandNav = document.querySelector('.island-nav');
  if (islandNav) {
    let lastY = window.scrollY;
    let ticking = false;

    const updateNav = () => {
      const y = window.scrollY;
      if (y > 80) {
        islandNav.classList.add('shrink');
      } else {
        islandNav.classList.remove('shrink');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    // Expand on hover/focus even if shrunk
    islandNav.addEventListener('mouseenter', () => islandNav.classList.remove('shrink'));
    islandNav.addEventListener('mouseleave', () => {
      if (window.scrollY > 80) islandNav.classList.add('shrink');
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Magnetic buttons (desktop only) ---------- */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Payload swap interaction (Products page) ---------- */
  const payloadItems = document.querySelectorAll('.payload-item');
  const payloadMedia = document.querySelector('[data-payload-media]');
  if (payloadItems.length && payloadMedia) {
    payloadItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        payloadItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const label = item.getAttribute('data-payload');
        const labelEl = payloadMedia.querySelector('.ph-label');
        if (labelEl && label) labelEl.textContent = label;
      });
      item.addEventListener('click', () => {
        payloadItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const label = item.getAttribute('data-payload');
        const labelEl = payloadMedia.querySelector('.ph-label');
        if (labelEl && label) labelEl.textContent = label;
      });
    });
  }

  /* ---------- Telemetry count-up ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => countIo.observe(c));
  }

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Mobile menu sub-expand (Services sub-links on island) ---------- */
  document.querySelectorAll('[data-toggle-sub]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const subId = trigger.getAttribute('data-toggle-sub');
      const sub = document.getElementById(subId);
      if (sub) {
        e.preventDefault();
        sub.classList.toggle('open');
      }
    });
  });

});