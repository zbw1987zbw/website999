/* ============================================
   INGBOEX - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle') || document.querySelector('.hamburger');
  const nav = document.querySelector('.nav') || document.querySelector('.nav-menu');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // --- Mobile Dropdown Toggle ---
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function(dropdown) {
    const link = dropdown.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header') || document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Back to Top Button ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        // Close all items
        faqItems.forEach(function(fi) {
          fi.classList.remove('active');
        });
        // Open clicked item (unless it was already open)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Product Tabs ---
  const productTabs = document.querySelectorAll('.product-tab');
  const productPanels = document.querySelectorAll('.product-detail-panel');

  productTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab') || this.getAttribute('data-target');

      // Update tabs
      productTabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Update panels - match by id with or without "panel-" prefix
      productPanels.forEach(function(panel) {
        panel.classList.remove('active');
        const panelId = panel.getAttribute('id');
        if (panelId === target || panelId === 'panel-' + target) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- Product Filter ---
  const productSearch = document.querySelector('#product-search') || document.querySelector('#product-search-input');
  const productCards = document.querySelectorAll('.product-card') ;
  const categoryCards = document.querySelectorAll('.category-large-card, .category-card');
  const allSearchableCards = productCards.length > 0 ? productCards : categoryCards;

  if (productSearch) {
    productSearch.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      allSearchableCards.forEach(function(card) {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Intersection Observer for Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Contact Form Validation ---
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    // Record form load timestamp for anti-spam speed check
    var loadedAtInput = contactForm.querySelector('#form-loaded-at');
    if (loadedAtInput) {
      loadedAtInput.value = Date.now();
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // --- Anti-spam checks ---
      // 1. Honeypot: if filled, silently reject (bot detected)
      var honeypot = contactForm.querySelector('#website-url');
      if (honeypot && honeypot.value.trim() !== '') {
        return; // Bot filled the hidden field, silently ignore
      }

      // 2. Speed check: if submitted in under 3 seconds, likely a bot
      if (loadedAtInput && loadedAtInput.value) {
        var elapsed = Date.now() - parseInt(loadedAtInput.value);
        if (elapsed < 3000) {
          var msgEl = contactForm.querySelector('#message');
          if (msgEl) showError(msgEl, 'Please take a moment to review your message before sending.');
          return;
        }
      }

      let valid = true;
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      // Clear previous errors
      contactForm.querySelectorAll('.error').forEach(function(el) {
        el.remove();
      });

      if (name && !name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }

      if (email && !email.value.trim()) {
        showError(email, 'Please enter your email');
        valid = false;
      } else if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        valid = false;
      }

      if (message && !message.value.trim()) {
        showError(message, 'Please enter your message');
        valid = false;
      }

      if (valid) {
        // 获取表单数据
        var nameVal = name ? name.value : '';
        var emailVal = email ? email.value : '';
        var phoneEl = contactForm.querySelector('#phone');
        var companyEl = contactForm.querySelector('#company');
        var productEl = contactForm.querySelector('#product-interest') || contactForm.querySelector('#product');
        var phoneVal = phoneEl ? phoneEl.value : '';
        var companyVal = companyEl ? companyEl.value : '';
        var productVal = productEl ? productEl.value : '';
        var messageVal = message ? message.value : '';

        // 显示提交中状态
        var btn = contactForm.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        var feedbackEl = contactForm.querySelector('#form-feedback');

        // 通过 Formsubmit.co AJAX 提交
        fetch('https://formsubmit.co/ajax/billzhang@ingboex.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: 'Inquiry from ' + nameVal + ' - INGBOEX Website',
            _template: 'table',
            Name: nameVal,
            Email: emailVal,
            Phone: phoneVal,
            Company: companyVal,
            'Product Interest': productVal,
            Message: messageVal
          })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '';

          if (data.success) {
            // 提交成功
            if (feedbackEl) {
              feedbackEl.style.display = 'block';
              feedbackEl.style.background = '#d1fae5';
              feedbackEl.style.color = '#065f46';
              feedbackEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
            }
            contactForm.reset();
          } else {
            // 提交失败
            var errMsg = (data.message) ? data.message : 'Something went wrong. Please try again or email us directly.';
            if (feedbackEl) {
              feedbackEl.style.display = 'block';
              feedbackEl.style.background = '#fef2f2';
              feedbackEl.style.color = '#991b1b';
              feedbackEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + errMsg;
            }
          }
        })
        .catch(function(error) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '';

          // 网络错误时回退到 mailto
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.background = '#fef3c7';
            feedbackEl.style.color = '#92400e';
            feedbackEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network error. Please try again, or email us directly at billzhang@ingboex.com';
          }
        });
      }
    });
  }

  function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:5px;';
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.style.borderColor = '#ef4444';
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const err = input.parentNode.querySelector('.error');
      if (err) err.remove();
    }, { once: true });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Current Year for Footer ---
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Anti-spam Email Protection ---
  // Replace all data-email placeholders with obfuscated mailto links
  document.querySelectorAll('[data-email]').forEach(function(el) {
    var user = el.getAttribute('data-email');
    var domain = el.getAttribute('data-domain') || 'ingboex.com';
    var email = user + '@' + domain;
    var subject = el.getAttribute('data-subject') || '';
    var href = 'mailto:' + email;
    if (subject) href += '?subject=' + encodeURIComponent(subject);

    if (el.tagName === 'A') {
      el.setAttribute('href', href);
      // If there's no visible text, show the email
      if (!el.textContent.trim() || el.querySelector('i.fa-envelope, i.fa-solid.fa-envelope')) {
        // Icon-only link - don't change text
      } else if (el.textContent.trim() === email) {
        // already has email text, keep it
      }
    }
    // Also handle spans that show email text
    var textSpan = el.querySelector('[data-email-text]');
    if (textSpan) {
      textSpan.textContent = email;
    }
  });

  // Also handle inline email text replacements
  document.querySelectorAll('[data-email-text]').forEach(function(el) {
    var user = el.getAttribute('data-email-text');
    var domain = el.getAttribute('data-domain') || 'ingboex.com';
    el.textContent = user + '@' + domain;
  });
});
