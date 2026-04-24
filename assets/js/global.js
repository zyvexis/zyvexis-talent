/**
 * Zyvexis Talent Solutions - Global JavaScript
 * Handles navigation, scroll effects, and WhatsApp button
 */

(function () {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  // ============================================
  // Navigation Scroll Effect
  // ============================================
  function handleScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  // ============================================
  // Active Link Highlighting
  // ============================================
  
  function setActiveLink() {
  let path = window.location.pathname;
  if (path === "/" || path === "") {  path = "index.html";} else {path = path.replace(/^\//, ""); }
  const navLinks = document.querySelectorAll('.nav-links a[data-page]');
  navLinks.forEach((link) => {const linkPage = link.getAttribute('data-page');
  if (linkPage === path) {link.classList.add('active');} else {  link.classList.remove('active');}
  });
}

  
  // ============================================
  // Mobile Menu Toggle
  // ============================================
  function initializeMobileMenu() {
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Close menu when clicking on links
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================
  // WhatsApp Floating Button
  // ============================================
  function createWhatsAppButton() {
    const config = {
      phoneNumber: '919510400470',
      message: 'Hi, I would like to know more about your services',
      position: { bottom: '24px', right: '24px' }
    };

    if (document.querySelector('.whatsapp-float')) return;

    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.href = `https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(config.message)}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';

    Object.assign(whatsappBtn.style, {
      position: 'fixed',
      bottom: config.position.bottom,
      right: config.position.right
    });

    document.body.appendChild(whatsappBtn);
    setTimeout(() => whatsappBtn.classList.add('visible'), 100);

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      whatsappBtn.classList.add('pulse');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        whatsappBtn.classList.remove('pulse');
      }, 1000);
    }, { passive: true });
  }

  // ============================================
  // Form Validation
  // ============================================
  function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach((input) => {
          const value = input.type === 'file' ? input.files.length : input.value.trim();
          if (!value) {
            isValid = false;
            input.classList.add('error');
          } else {
            input.classList.remove('error');
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offset = navbar ? navbar.offsetHeight : 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!('IntersectionObserver' in window) || images.length === 0) {
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // ============================================
  // Animation on Scroll
  // ============================================
  function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const elementObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((el) => elementObserver.observe(el));
  }

  // ============================================
  // Initialize All Functions
  // ============================================
  function initialize() {
    handleScroll();
    setActiveLink();
    initializeMobileMenu();
    createWhatsAppButton();
    initializeFormValidation();
    initializeSmoothScroll();
    initializeLazyLoading();
    initializeScrollAnimations();
  }

  // ============================================
  // Event Listeners
  // ============================================
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', initialize);

  // Expose utility functions globally if needed
  window.ZyvexisUtils = {
    setActiveLink,
    handleScroll
  };

})();
