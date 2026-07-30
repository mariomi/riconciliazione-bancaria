// Scroll reveal animations.
// Aggancia un IntersectionObserver agli elementi .reveal e .reveal-stagger e
// aggiunge .in-view quando entrano in viewport. Il CSS della singola pagina
// decide la direzione (sulla landing l'ingresso avviene da destra a sinistra).
// Una volta animato, l'elemento viene "unobservato".
//
// Comportamento:
// - rootMargin: trigger leggermente prima del bordo viewport per partire
//   non appena l'utente sta per vedere l'elemento
// - threshold 0.05: basta che il 5% sia visibile
// - se il browser non supporta IntersectionObserver (vecchio), mostra
//   tutto subito senza animazione (fail-safe)
// - se l'utente ha richiesto reduce-motion lato OS, idem (no animazioni)
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!els.length) return;

  var prefersReduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Mostra tutto immediatamente in posizione finale.
    els.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var initialHero = document.querySelectorAll(
    '.hero .reveal, .hero .reveal-stagger'
  );

  // La transizione di apertura libera la pagina in circa 380 ms. Un piccolo
  // ritardo mantiene visibile l'ingresso del hero invece di farlo terminare
  // dietro ai pannelli di transizione.
  if (initialHero.length) {
    window.setTimeout(function () {
      initialHero.forEach(function (el) { el.classList.add('in-view'); });
    }, 230);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, {
    root: null,
    // Espande leggermente il viewport verso il basso per far partire il reveal
    // poco prima che l'elemento diventi pienamente visibile.
    rootMargin: '0px 0px 8% 0px',
    threshold: 0.05
  });

  els.forEach(function (el) {
    if (!el.closest('.hero')) io.observe(el);
  });
})();
