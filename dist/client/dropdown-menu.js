// Shared dropdown menu — usato da tutte le pagine pubbliche.
// Aggancia comportamento open/close al primo elemento .dropdown della pagina.
//
// Comportamenti:
//   - Click sul trigger toggla il panel
//   - Click su un item nel panel chiude (cosi' la navigazione succede dopo)
//   - Click fuori dal dropdown chiude
//   - Escape chiude
//   - Stato sincronizzato con aria-expanded sul trigger
(function () {
  var dd = document.querySelector('.dropdown');
  if (!dd) return;
  var btn = dd.querySelector('.dropdown-trigger');
  var panel = dd.querySelector('.dropdown-panel');
  if (!btn || !panel) return;

  function open() {
    dd.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    dd.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    if (dd.classList.contains('open')) close(); else open();
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  // Close on item click — la navigazione del link procede normalmente
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      close();
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') close();
  });
})();
