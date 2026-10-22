/* Ajit Carpenter's — interactions */
(function () {
  'use strict';

  /* Theme toggle (light default, saved choice wins) */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('ac-theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') { root.setAttribute('data-theme', saved); }
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ac-theme', next); } catch (e) {}
  });

  /* Header shadow on scroll */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  hamburger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* Active nav link */
  var sections = ['home', 'services', 'work', 'process', 'about', 'contact'];
  var links = {};
  nav.querySelectorAll('.nav-link').forEach(function (l) {
    links[l.getAttribute('href').slice(1)] = l;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && links[en.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        links[en.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* Reveal on scroll */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        reveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });

  /* Gallery filter */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        it.classList.toggle('hidden', f !== 'all' && it.getAttribute('data-cat') !== f);
      });
    });
  });

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var current = 0;
  function visibleItems() {
    return items.filter(function (it) { return !it.classList.contains('hidden'); });
  }
  function showAt(i) {
    var vis = visibleItems();
    if (!vis.length) return;
    current = (i + vis.length) % vis.length;
    var img = vis[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }
  items.forEach(function (it) {
    it.addEventListener('click', function () {
      var vis = visibleItems();
      showAt(vis.indexOf(it));
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); showAt(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); showAt(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showAt(current - 1);
    if (e.key === 'ArrowRight') showAt(current + 1);
  });

  /* Enquiry form -> WhatsApp */
  document.getElementById('enquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var phone = document.getElementById('fPhone').value.trim();
    var service = document.getElementById('fService').value;
    var msg = document.getElementById('fMsg').value.trim();
    var lines = [
      'Namaste! New enquiry from the website:',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Requirement: ' + service
    ];
    if (msg) lines.push('Details: ' + msg);
    window.open('https://wa.me/917710891619?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
