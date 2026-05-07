// Scroll reveal animations.
// Aggancia un IntersectionObserver a tutti gli elementi marcati .reveal o
// .reveal-stagger e aggiunge la classe .in-view quando entrano in viewport.
// Il CSS associato fa il fade-up morbido. Una volta animato, l'elemento viene
// "unobservato" (non si ri-anima quando esce e rientra).
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

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, {
    root: null,
    // Anticipa il trigger: parte quando l'elemento sta per entrare in viewport
    // (10% sotto il bordo bottom). Margin negativo in basso rende la soglia
    // un po' piu' "in alto" — l'animazione e' visibile prima del primo scroll.
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.05
  });

  els.forEach(function (el) { io.observe(el); });
})();
