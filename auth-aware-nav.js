// Auth-aware navigation: if user is already logged in (Supabase session in
// localStorage), rewrite the public-site "Accedi" / "Inizia gratis" CTAs to
// open the app directly. Logout clears localStorage so this script becomes a
// no-op until the user logs in again.
(function () {
  var KEY = 'sb-vboflwsbwllbdidifxzq-auth-token';
  if (!localStorage.getItem(KEY)) return;

  var APP_LABEL = 'Apri app';
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
    }
  });
})();
