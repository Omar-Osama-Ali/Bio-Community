(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const siteRoot = new URL(document.documentElement.dataset.root || '.', location.href);
  const hrefFor = (path = '') => new URL(path, siteRoot).href;
  const page = document.body.dataset.page || '';
  const asset = path => hrefFor(path);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const navItems = [
    ['HOME', 'index.html', 'home'], ['ABOUT', 'about.html', 'about'],
    ['EXPERIMENTS', 'experiments.html', 'experiments'], ['BIO SHORTS', 'shorts.html', 'shorts'],
    ['MICROSCOPIC WORLD', 'microscopy.html', 'microscopy'], ['ACTIVITIES', 'activities.html', 'activities']
  ];

  function header() {
    const links = navItems.map(([label, path, id]) =>
      `<a href="${hrefFor(path)}" ${page === id ? 'aria-current="page"' : ''}>${label}</a>`
    ).join('');
    return `<a class="skip-link" href="#main">Skip to content</a>
      <header class="site-header"><div class="container header-inner">
        <a class="brand" href="${hrefFor('index.html')}" aria-label="BIO COMMUNITY home">
          <img src="${asset('assets/images/branding/bio-community-logo.jpg')}" alt="" width="54" height="54">
          <span>BIO COMMUNITY</span>
        </a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span aria-hidden="true">☰</span></button>
        <nav class="nav" id="primary-nav" aria-label="Main navigation">${links}</nav>
      </div></header>`;
  }

  function footer() {
    return `<footer class="site-footer"><div class="container">
      <div class="footer-grid">
        <div><div class="footer-brand"><img src="${asset('assets/images/branding/bio-community-logo.jpg')}" alt="" width="72" height="72"><div><strong>BIO COMMUNITY</strong><br><small>Where Biology Comes to Life.</small></div></div>
          <p class="footer-intro">Discover. Explore. Experiment. A student community exploring Biology through observation and hands-on learning.</p>
        </div>
        <div><h3>Explore</h3><div class="footer-links">${navItems.slice(1).map(item => `<a href="${hrefFor(item[1])}">${item[0]}</a>`).join('')}</div></div>
        <div><h3>Information</h3><div class="footer-links"><a href="${hrefFor('privacy.html')}">Privacy &amp; Media Information</a></div>
          <div class="institution-mark"><img class="school-mark" src="${asset('assets/images/branding/school-logo.jpg')}" alt="School logo" width="44" height="44"><small>Institutional identity</small></div>
        </div>
      </div>
      <div class="footer-bottom"><span>© <span id="year"></span> BIO COMMUNITY</span><span>Discover. Explore. Experiment.</span></div>
      <div class="developer-credit">Created by <a href="https://omar-osama-ali.github.io/" target="_blank" rel="noopener noreferrer">Omar Osama</a></div>
    </div></footer><button class="top-link" type="button" aria-label="Back to top">↑</button>`;
  }

  async function loadData(name) {
    const response = await fetch(asset(`data/${name}.json`), { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load ${name}.json (${response.status})`);
    return response.json();
  }

  function setError(selector, message = 'This content could not be loaded right now.') {
    const target = $(selector);
    if (!target) return;
    target.innerHTML = `<div class="empty-state" role="status"><h2>Content temporarily unavailable</h2><p>${escapeHTML(message)}</p><button class="btn secondary" type="button" data-retry>Try again</button></div>`;
    $('[data-retry]', target)?.addEventListener('click', () => location.reload());
  }

  function experimentCard(experiment) {
    const id = encodeURIComponent(experiment.id);
    const detailURL = hrefFor(`experiment.html?id=${id}`);
    if (experiment.status !== 'published') {
      return `<article class="card coming-card"><a class="card-media coming" href="${detailURL}" aria-label="Experiment ${escapeHTML(experiment.number)} coming soon">
        <div class="coming-inner"><span class="coming-label">Coming soon</span><p class="eyebrow">Experiment ${escapeHTML(experiment.number)}</p></div></a>
        <div class="card-body"><div class="card-meta">In preparation</div><h3>Experiment ${escapeHTML(experiment.number)}</h3><p>Details and media will be added when verified content is ready.</p><a class="text-link" href="${detailURL}">View status →</a></div></article>`;
    }
    return `<article class="card"><a href="${detailURL}" class="card-media-link" aria-label="View ${escapeHTML(experiment.title)}">
      <div class="card-media"><img loading="lazy" width="960" height="540" src="${asset(experiment.thumbnail)}" alt="Video preview for ${escapeHTML(experiment.title)}"></div></a>
      <div class="card-body"><div class="card-meta">Experiment ${escapeHTML(experiment.number)} · ${escapeHTML(experiment.duration || 'Video')}</div><h3>${escapeHTML(experiment.title)}</h3><p>${escapeHTML(experiment.description)}</p><a class="text-link" href="${detailURL}">Watch experiment →</a></div></article>`;
  }

  function shortCard(short) {
    const parent = encodeURIComponent(short.parentExperimentId || '');
    const detailURL = hrefFor(`experiment.html?id=${parent}`);
    if (short.status !== 'published') {
      const experimentNumber = String(short.parentExperimentId || '').slice(-2);
      return `<article class="short-card short-card-upcoming"><div class="short-placeholder"><div><span class="coming-label">Coming soon</span><p class="eyebrow">Experiment ${escapeHTML(experimentNumber)}</p><strong>Short ${escapeHTML(short.number)}</strong></div></div><div class="short-info"><h3>Short ${escapeHTML(short.number)}</h3><p>Reserved for a future release.</p></div></article>`;
    }
    return `<article class="short-card"><div class="short-video-wrap"><video controls playsinline muted preload="none" poster="${asset(short.thumbnail)}" data-short-video aria-label="${escapeHTML(short.title)}">
      <source src="${asset(short.video)}" type="video/mp4"></video></div>
      <div class="short-info"><div class="card-meta">EXPERIMENT ${escapeHTML(parent.slice(-2))} · SHORT ${escapeHTML(short.number)}</div><h3>${escapeHTML(short.title)}</h3><p>${escapeHTML(short.description)}</p><a class="btn" href="${detailURL}">Watch full experiment</a></div></article>`;
  }

  function setupShell() {
    document.body.insertAdjacentHTML('afterbegin', header());
    document.body.insertAdjacentHTML('beforeend', footer());
    const toggle = $('.menu-toggle');
    const nav = $('.nav');
    const closeMenu = () => {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open navigation');
      if (toggle) toggle.innerHTML = '<span aria-hidden="true">☰</span>';
    };
    toggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('open') || false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.innerHTML = open ? '<span aria-hidden="true">×</span>' : '<span aria-hidden="true">☰</span>';
    });
    $$('.nav a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    $('#year').textContent = new Date().getFullYear();

    const topButton = $('.top-link');
    const updateTopButton = () => topButton?.classList.toggle('visible', window.scrollY > 600);
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
    topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

    document.addEventListener('play', event => {
      if (event.target instanceof HTMLVideoElement && event.target.matches('[data-short-video]')) {
        $$('[data-short-video]').forEach(video => { if (video !== event.target) video.pause(); });
      }
    }, true);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!(entry.target instanceof HTMLVideoElement)) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          $$('[data-short-video]').forEach(video => { if (video !== entry.target) video.pause(); });
          entry.target.muted = true;
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      }), { threshold: [0, 0.25, 0.65] });
      $$('[data-short-video]').forEach(video => observer.observe(video));
    }
  }

  async function renderExperiments(selector, limit = 6) {
    try { const items = await loadData('experiments'); $(selector).innerHTML = items.slice(0, limit).map(experimentCard).join(''); }
    catch (error) { console.error('[BIO COMMUNITY] Experiments:', error); setError(selector, 'The experiment library could not be reached. Check your connection and try again.'); }
  }

  async function renderShorts(selector, grouped = false) {
    try {
      const [shorts, experiments] = await Promise.all([loadData('shorts'), loadData('experiments')]);
      const target = $(selector);
      if (!grouped) { target.innerHTML = shorts.filter(short => short.status === 'published').map(shortCard).join(''); return; }
      target.innerHTML = experiments.map(experiment => {
        const related = shorts.filter(short => short.parentExperimentId === experiment.id);
        return `<section class="short-group-section"><div class="short-group"><div><span class="eyebrow">Experiment ${escapeHTML(experiment.number)}</span><h2>${escapeHTML(experiment.title)}</h2></div>${experiment.status === 'published' ? `<a class="text-link" href="${hrefFor(`experiment.html?id=${encodeURIComponent(experiment.id)}`)}">Full experiment →</a>` : '<span class="coming-label">Coming soon</span>'}</div><div class="shorts-feed-grid">${related.map(shortCard).join('')}</div></section>`;
      }).join('');
    } catch (error) { console.error('[BIO COMMUNITY] Shorts:', error); setError(selector, 'BIO SHORTS could not be loaded. Please try again.'); }
  }

  async function renderSpecimens() {
    const selector = '#specimen-grid';
    try {
      const items = await loadData('specimens');
      const target = $(selector);
      target.innerHTML = items.filter(item => item.status === 'published').map(item => `<article class="specimen">
        <button class="gallery-trigger" type="button" data-image="${asset(item.image)}" data-caption="${escapeHTML(item.name)}" aria-label="Enlarge ${escapeHTML(item.name)}">
          <img loading="lazy" width="800" height="600" src="${asset(item.image)}" alt="${escapeHTML(item.description)}"></button>
        <div class="card-body"><div class="card-meta">Microscope observation</div><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p>
          ${item.magnification ? `<p>Magnification: ${escapeHTML(item.magnification)}</p>` : '<p class="muted">Magnification not yet verified.</p>'}
        </div></article>`).join('');
      setupModal();
    } catch (error) { console.error('[BIO COMMUNITY] Microscopy:', error); setError(selector, 'The microscope gallery could not be loaded. Please try again.'); }
  }

  function setupModal() {
    const modal = $('#image-modal');
    if (!modal) return;
    const image = $('#modal-image');
    const caption = $('#modal-caption');
    const closeButton = $('.modal-close');
    let previousFocus = null;
    const close = () => {
      modal.setAttribute('aria-hidden', 'true');
      image.removeAttribute('src');
      previousFocus?.focus();
    };
    $$('[data-image]').forEach(button => button.addEventListener('click', () => {
      previousFocus = button;
      image.src = button.dataset.image;
      image.alt = button.dataset.caption || 'Enlarged microscope observation';
      caption.textContent = button.dataset.caption || '';
      modal.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    }));
    closeButton?.addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const focusable = $$('button', modal);
        if (focusable.length === 1) { event.preventDefault(); focusable[0].focus(); }
      }
    });
  }

  async function renderActivities() {
    const selector = '#activity-grid';
    try {
      const items = await loadData('activities');
      $(selector).innerHTML = items.map(item => `<article class="card activity-card"><div class="card-media activity-media"><video class="activity-video" controls playsinline preload="none" poster="${asset(item.poster)}" aria-label="${escapeHTML(item.title)}"><source src="${asset(item.video)}" type="video/mp4"></video></div>
        <div class="card-body"><div class="card-meta">Community video</div><h3>${escapeHTML(item.title)}</h3><p>Authentic footage supplied for BIO COMMUNITY.</p></div></article>`).join('');
    } catch (error) { console.error('[BIO COMMUNITY] Activities:', error); setError(selector, 'Community activity videos could not be loaded. Please try again.'); }
  }

  async function renderExperimentDetail() {
    const host = $('#experiment-detail');
    try {
      const id = new URLSearchParams(location.search).get('id') || 'experiment-01';
      const [experiments, shorts] = await Promise.all([loadData('experiments'), loadData('shorts')]);
      const experiment = experiments.find(item => item.id === id);
      const canonical = document.querySelector('link[rel=canonical]');
      if (canonical) canonical.href = hrefFor(`experiment.html?id=${encodeURIComponent(id)}`);
      if (experiment && experiment.status === 'published') {
        document.title = `${experiment.title} | BIO COMMUNITY`;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = document.title;
      } else {
        const robots = document.querySelector('meta[name="robots"]');
        if (robots) robots.content = 'noindex,follow';
      }
      if (!experiment) {
        host.innerHTML = `<div class="empty-state"><h2>Experiment not found</h2><p>This experiment does not exist in the current library.</p><a class="btn" href="${hrefFor('experiments.html')}">Back to experiments</a></div>`;
        return;
      }
      if (experiment.status !== 'published') {
        host.innerHTML = `<div class="empty-state"><span class="coming-label">Coming soon</span><h1>Experiment ${escapeHTML(experiment.number)}</h1><p class="lead">This experiment is being prepared. Its video and verified scientific information will appear here when published.</p><a class="btn" href="${hrefFor('experiments.html')}">Explore available experiments</a></div>`;
        return;
      }
      const related = shorts.filter(short => short.parentExperimentId === id);
      host.innerHTML = `<div class="detail-grid"><div class="detail-main"><div class="card-meta">EXPERIMENT ${escapeHTML(experiment.number)} · ${escapeHTML(experiment.duration || 'Video')}</div>
        <h1>${escapeHTML(experiment.title)}</h1><p class="lead">${escapeHTML(experiment.description)}</p>
        <div class="video-wrap"><video controls playsinline preload="none" poster="${asset(experiment.thumbnail)}" aria-label="Full experiment video"><source src="${asset(experiment.video)}" type="video/mp4"></video></div>
        <section class="detail-copy"><h2>About this video</h2><p class="muted">The supplied full-length video is published here. The experiment title, objective, materials, procedure, observations, and scientific explanation have not yet been provided as verified text.</p><div class="notice">Scientific information will be added after it has been confirmed by the community.</div></section>
        <h2>Associated BIO SHORTS</h2><div class="shorts-row">${related.map(shortCard).join('')}</div></div>
        <aside class="detail-aside"><span class="eyebrow">Video information</span><h3>Experiment ${escapeHTML(experiment.number)}</h3><p class="muted">Published video</p><p><strong>Duration</strong><br>${escapeHTML(experiment.duration || 'Not supplied')}</p><a class="btn" href="${hrefFor('shorts.html')}">Explore BIO SHORTS</a></aside></div>`;
    } catch (error) { console.error('[BIO COMMUNITY] Experiment detail:', error); host.innerHTML = `<div class="empty-state" role="status"><h2>Experiment details unavailable</h2><p>We could not load this experiment. Please refresh the page.</p><a class="btn" href="${hrefFor('experiments.html')}">Back to experiments</a></div>`; }
  }

  setupShell();
  if (page === 'home') {
    renderExperiments('#featured-experiments', 3);
    renderShorts('#home-shorts');
  } else if (page === 'experiments') renderExperiments('#experiments-grid');
  else if (page === 'shorts') renderShorts('#shorts-feed', true);
  else if (page === 'microscopy') renderSpecimens();
  else if (page === 'activities') renderActivities();
  else if (page === 'experiment') renderExperimentDetail();
})();
