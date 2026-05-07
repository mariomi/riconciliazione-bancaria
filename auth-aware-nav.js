// Auth-aware navigation: rewrite the public-site "Accedi" / "Inizia gratis"
// / "Crea account" CTAs to do the right thing depending on auth state.
//
// NOT LOGGED IN
//   No-op — la pagina mostra i bottoni originali (Accedi + Inizia gratis).
//
// LOGGED IN
//   Convertiamo i CTA di login in azioni sensate per un utente autenticato:
//   - Il bottone primary (Inizia gratis / Crea account) → "Apri app"
//   - Il bottone outline (Accedi) → "Esci" con logout
//   In questo modo il menu (sia desktop che mobile drawer) mostra DUE
//   azioni utili invece di due "Apri app" identici o uno solo.
//   Per i CTA in altri container (hero, footer) c'e' un solo bottone
//   primary → "Apri app" e basta.
(function () {
  var KEY = 'sb-vboflwsbwllbdidifxzq-auth-token';
  if (!localStorage.getItem(KEY)) return;

  var APP_LABEL = 'Apri app';
  var LOGOUT_LABEL = 'Esci';
  var rewritten = [];

  document.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href !== 'login.html' && href.indexOf('login.html?') !== 0) return;
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
      // default: rewrite to Apri app — i gruppi dedup-aware sotto possono
      // poi cambiare il secondo bottone in "Esci"
      a.href = 'app.html';
      a.textContent = APP_LABEL;
      rewritten.push(a);
    }
  });

  // Group rewritten buttons by their parent container (e.g. .nav-links,
  // .hero-actions). Per ogni gruppo:
  //  - se c'e' 1 solo CTA: lascialo come "Apri app"
  //  - se ce ne sono 2+: il primary resta "Apri app", l'outline diventa
  //    "Esci" (logout). Cosi il menu mobile mostra sempre Apri app + Esci.
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
    // Drop CTAs already hidden via CSS (es. .hero-mobile-cta su desktop):
    // se li tocchiamo qui rompiamo la media query che li riattiva su phone.
    arr = arr.filter(function (a) { return a.offsetParent !== null; });
    if (arr.length <= 1) return;
    // Sort: piu prominente per primo (primary > outline > generic btn)
    arr.sort(function (a, b) { return rank(b) - rank(a); });
    // arr[0] resta "Apri app" (primary). arr[1] diventa "Esci" (logout).
    var logoutBtn = arr[1];
    logoutBtn.textContent = LOGOUT_LABEL;
    logoutBtn.removeAttribute('href');
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        // Cancella tutti i token Supabase + reindirizza a home
        Object.keys(localStorage).forEach(function (k) {
          if (k.indexOf('sb-') === 0) localStorage.removeItem(k);
        });
      } catch (_) {}
      window.location.replace('index.html');
    });
    // Eventuali ulteriori bottoni (3+) li nascondiamo: caso raro.
    for (var i = 2; i < arr.length; i++) arr[i].style.display = 'none';
  });
})();
