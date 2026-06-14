(function () {
  'use strict';

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const form = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');

  /* Sticky header shadow */
  function onScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  burger.addEventListener('click', function () {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  nav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Phone mask (simple) */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length > 0) val = '7' + val;

      let formatted = '';
      if (val.length > 0) formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
      if (val.length >= 7) formatted += '-' + val.slice(7, 9);
      if (val.length >= 9) formatted += '-' + val.slice(9, 11);

      e.target.value = formatted;
    });
  }

  /* Form validation & submit */
  function showError(field, message) {
    field.classList.add('error');
    const errEl = document.querySelector('[data-for="' + field.id + '"]');
    if (errEl) errEl.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 11;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Укажите ваше имя');
      valid = false;
    }

    if (!validatePhone(phone.value)) {
      showError(phone, 'Введите корректный номер телефона');
      valid = false;
    }

    if (!valid) return;

    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* Scroll reveal */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll(
    '.card, .step, .case-card, .gallery__item, .stat-item, .section-header'
  ).forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();
