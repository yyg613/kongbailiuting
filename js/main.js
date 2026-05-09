/**
 * 空白流汀 — 个人主页交互逻辑
 * 纯原生 JS，无依赖
 */

(function () {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavScroll();
    initMobileNav();
    initScrollReveal();
    initActiveNav();
    initLightbox();
    initGuestbook();
    initBackToTop();
    initLeafCanvas();
    initLikeButtons();
  }

  // ============================
  // Navigation — scroll effect
  // ============================
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('nav--scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================
  // Mobile nav toggle
  // ============================
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.classList.toggle('nav__toggle--open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '打开菜单');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================
  // Scroll reveal (IntersectionObserver)
  // ============================
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all
      elements.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Staggered delay based on sibling index
          var parent = entry.target.parentElement;
          var siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
          var index = siblings.indexOf(entry.target);
          var delay = Math.max(0, index) * 80;

          setTimeout(function () {
            entry.target.classList.add('reveal--visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ============================
  // Active nav link on scroll
  // ============================
  function initActiveNav() {
    var sections = document.querySelectorAll('.section[id]');
    var navLinks = document.querySelectorAll('.nav__link[data-section]');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            var isActive = link.getAttribute('data-section') === id;
            link.classList.toggle('nav__link--active', isActive);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ============================
  // Image Lightbox
  // ============================
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-image');
    var lightboxClose = document.getElementById('lightbox-close');
    if (!lightbox || !lightboxImg || !lightboxClose) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '预览图片';
      lightbox.classList.add('lightbox--open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('lightbox--open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    // Click on moment images
    document.querySelectorAll('.moment-card__image-wrap').forEach(function (wrap) {
      wrap.addEventListener('click', function () {
        var img = wrap.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var img = wrap.querySelector('img');
          if (img) openLightbox(img.src, img.alt);
        }
      });
    });

    // Click on gallery images
    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var img = item.querySelector('img');
          if (img) openLightbox(img.src, img.alt);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
        closeLightbox();
      }
    });
  }

  // ============================
  // Guestbook form
  // ============================
  function initGuestbook() {
    var form = document.getElementById('guestbook-form');
    var messagesContainer = document.getElementById('guestbook-messages');
    if (!form || !messagesContainer) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('gb-name');
      var messageInput = document.getElementById('gb-message');
      var name = (nameInput.value || '').trim();
      var message = (messageInput.value || '').trim();

      if (!name) {
        nameInput.focus();
        showToast('请输入昵称哦~');
        return;
      }
      if (!message) {
        messageInput.focus();
        showToast('请输入留言内容~');
        return;
      }

      // Build message element
      var today = new Date();
      var dateStr = today.getFullYear() + '.' +
        String(today.getMonth() + 1).padStart(2, '0') + '.' +
        String(today.getDate()).padStart(2, '0');

      var initial = name.charAt(0).toUpperCase();

      var msgEl = document.createElement('div');
      msgEl.className = 'guestbook__message';
      msgEl.setAttribute('role', 'listitem');
      msgEl.innerHTML =
        '<div class="guestbook__message-header">' +
          '<div class="guestbook__message-avatar" aria-hidden="true">' + escapeHtml(initial) + '</div>' +
          '<div>' +
            '<div class="guestbook__message-name">' + escapeHtml(name) + '</div>' +
            '<div class="guestbook__message-time">' + dateStr + '</div>' +
          '</div>' +
        '</div>' +
        '<p class="guestbook__message-text">' + escapeHtml(message) + '</p>';

      // Prepend (newest first)
      messagesContainer.insertBefore(msgEl, messagesContainer.firstChild);

      // Reset form
      form.reset();
      showToast('留言成功！感谢你的留言 💚');
    });
  }

  // ============================
  // Like buttons (toggle)
  // ============================
  function initLikeButtons() {
    document.querySelectorAll('.moment-card__action').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var countEl = btn.querySelector('span');
        if (!countEl) return;

        var count = parseInt(countEl.textContent, 10) || 0;
        var isLiked = btn.classList.toggle('liked');

        if (isLiked) {
          countEl.textContent = count + 1;
          btn.style.color = 'var(--color-coral)';
          btn.querySelector('svg').setAttribute('fill', 'var(--color-coral)');
        } else {
          countEl.textContent = Math.max(0, count - 1);
          btn.style.color = '';
          btn.querySelector('svg').setAttribute('fill', 'none');
        }
      });
    });
  }

  // ============================
  // Back to Top
  // ============================
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================
  // Toast notification
  // ============================
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('toast--show');

    setTimeout(function () {
      toast.classList.remove('toast--show');
    }, 2500);
  }

  // ============================
  // Floating Leaves (Canvas)
  // ============================
  function initLeafCanvas() {
    var canvas = document.getElementById('leaf-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var leaves = [];
    var leafCount = 15;
    var animationId;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createLeaf() {
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: 8 + Math.random() * 12,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: 0.3 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.15 + Math.random() * 0.25,
        hue: 90 + Math.random() * 40, // green range
        swayAmplitude: 20 + Math.random() * 30,
        swaySpeed: 0.005 + Math.random() * 0.01,
        swayOffset: Math.random() * Math.PI * 2
      };
    }

    function drawLeaf(leaf) {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;

      // Simple leaf shape
      ctx.fillStyle = 'hsl(' + leaf.hue + ', 45%, 50%)';
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size);
      ctx.bezierCurveTo(
        leaf.size * 0.6, -leaf.size * 0.6,
        leaf.size * 0.6, leaf.size * 0.6,
        0, leaf.size
      );
      ctx.bezierCurveTo(
        -leaf.size * 0.6, leaf.size * 0.6,
        -leaf.size * 0.6, -leaf.size * 0.6,
        0, -leaf.size
      );
      ctx.fill();

      // Leaf vein
      ctx.strokeStyle = 'hsl(' + leaf.hue + ', 45%, 40%)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size * 0.8);
      ctx.lineTo(0, leaf.size * 0.8);
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var time = Date.now();
      leaves.forEach(function (leaf) {
        // Sway movement
        leaf.x += leaf.speedX + Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * 0.3;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotationSpeed;

        // Reset when out of bounds
        if (leaf.y > canvas.height + 30 || leaf.x < -30 || leaf.x > canvas.width + 30) {
          leaf.y = -20 - Math.random() * 60;
          leaf.x = Math.random() * canvas.width;
        }

        drawLeaf(leaf);
      });

      animationId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (!prefersReducedMotion) {
      for (var i = 0; i < leafCount; i++) {
        var leaf = createLeaf();
        leaf.y = Math.random() * canvas.height; // Distribute initially
        leaves.push(leaf);
      }
      animate();
    }
  }

  // ============================
  // Helpers
  // ============================
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
