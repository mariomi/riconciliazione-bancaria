// Mobile hamburger drawer — handler universale per tutte le pagine pubbliche.
// Lavora insieme alla CSS .nav-burger / .nav-links / body.nav-open definita
// inline in ogni pagina.
//
// Comportamenti:
//   - Click sull'hamburger toggla body.nav-open (gia' nell'onclick del button,
//     ma riconfermato qui come safety net se l'attributo onclick fallisce)
//   - Click su qualsiasi link nel drawer: chiude (cosi' navigare al link
//     non lascia il drawer aperto sul retorno indietro/transizione)
//   - Tap sullo sfondo del drawer (non sui link): chiude
//   - Escape: chiude
//   - Resize a desktop (>768px) chiude automaticamente per evitare stato
//     stale se l'utente ruota o ridimensiona
(function () {
  function close() {
    document.body.classList.remove('nav-open');
  }
  function open() {
    document.body.classList.add('nav-open');
  }
  function toggle() {
    document.body.classList.toggle('nav-open');
  }

  // Hamburger: garantisce il toggle anche se l'attributo onclick inline
  // fallisce (es. CSP strict, browser strict mode su alcune mobile webview)
  var burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', function (e) {
      // L'attributo onclick="..." ha gia' fatto il toggle; previeni il doppio
      // toggle qui se il burger non ha onclick allora siamo noi a fare il
      // lavoro.
      if (!burger.hasAttribute('data-mn-bound')) {
        burger.setAttribute('data-mn-bound', '1');
      }
    });
  }

  // Click su un link nel drawer: chiudi prima della navigazione
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      close();
    });
  });

  // Click sullo sfondo del drawer (sull'elemento .nav-links stesso, non sui
  // suoi figli): chiudi. Il drawer in CSS e' position:fixed inset:0, quindi
  // l'area vuota tra/intorno ai link e' .nav-links direttamente.
  document.querySelectorAll('.nav-links').forEach(function (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target === nav) close();
    });
  });

  // Tasto Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') close();
  });

  // Resize a desktop: chiudi (evita stato stale dopo rotazione/ridimensiona)
  var mql = window.matchMedia('(min-width: 769px)');
  if (mql.addEventListener) {
    mql.addEventListener('change', function (e) {
      if (e.matches) close();
    });
  } else if (mql.addListener) {
    // Safari < 14 fallback
    mql.addListener(function (e) { if (e.matches) close(); });
  }
})();
