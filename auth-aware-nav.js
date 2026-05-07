// Auth-aware navigation: if the user already has a Supabase session in
// localStorage, rewrite all "Accedi" / "Inizia gratis" / "Crea account" CTAs
// on the public site so they open the app directly. After rewriting we also
// dedupe adjacent "Apri app" buttons inside the same container — otherwise
// every login CTA collapses into a separate "Apri app" and you end up with
// two of them sitting next to each other in the navbar.
//
// Logout clears localStorage so this script becomes a no-op until the user
// logs in again.
(function () {
  var KEY = 'sb-vboflwsbwllbdidifxzq-auth-token';
  if (!localStorage.getItem(KEY)) return;

  var APP_LABEL = 'Apri app';
  var rewritten = [];

  document.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href !== 'login.html' && href.indexOf('login.html?') !== 0) return;
    a.href = 'app.html';
    var txt = (a.textContent || '').trim().toLowerCase();
    if (
      txt === 'accedi' ||
      txt === 'accedi / registrati' ||
      txt === 'inizia gratis' ||
      txt.indexOf('account gratis') !== -1 ||
      txt.indexOf('inizia con pro') !== -1 ||
      txt.indexOf('inizia con pro+') !== -1 ||
      txt.indexOf('inizia gratis') !== -1
    ) {
      a.textContent = APP_LABEL;
      rewritten.push(a);
    }
  });

  // Group rewritten buttons by their parent container (e.g. .nav-links,
  // .hero-actions) and keep only the most prominent one per group. Hide the
  // rest so we don't show two identical "Apri app" pills next to each other.
  var groups = {};
  rewritten.forEach(function (a) {
    var parent = a.parentElement;
    if (!parent) return;
    var id = parent.dataset.aaaId;
    if (!id) {
      id = 'g' + Math.random().toString(36).slice(2, 9);
      parent.dataset.aaaId = id;
    }
    (groups[id] = groups[id] || []).push(a);
  });

  function rank(el) {
    var c = el.className || '';
    if (c.indexOf('btn-primary') !== -1) return 3;
    if (c.indexOf('btn-outline') !== -1) return 2;
    if (c.indexOf('btn') !== -1) return 1;
    return 0;
  }

  Object.keys(groups).forEach(function (id) {
    var arr = groups[id];
    // Drop CTAs already hidden via CSS (e.g. .hero-mobile-cta on desktop): if
    // we hide them here we'd inline-style display:none and break the media
    // query that re-shows them on phone.
    arr = arr.filter(function (a) { return a.offsetParent !== null; });
    if (arr.length <= 1) return;
    // Keep the highest-ranked visible CTA, hide the rest.
    arr.sort(function (a, b) { return rank(b) - rank(a); });
    for (var i = 1; i < arr.length; i++) {
      arr[i].style.display = 'none';
    }
  });
})();
