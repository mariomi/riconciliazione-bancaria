(function () {
  'use strict';

  function reducedMotion() {
    return window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function resetPage() {
    if (!document.body) return;
    document.body.classList.remove('is-leaving');
    document.body.removeAttribute('aria-busy');
    if ('inert' in document.body) document.body.inert = false;
  }

  window.addEventListener('pageshow', resetPage);

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a')
      : null;
    if (!link || !document.body) return;
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || link.target
      || link.hasAttribute('download')
    ) return;

    var rawHref = link.getAttribute('href');
    if (
      !rawHref
      || rawHref.charAt(0) === '#'
      || rawHref.indexOf('mailto:') === 0
      || rawHref.indexOf('tel:') === 0
      || rawHref.indexOf('javascript:') === 0
    ) return;

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }

    if (
      destination.origin !== window.location.origin
      || destination.protocol === 'file:'
      || (destination.pathname === window.location.pathname
        && destination.search === window.location.search
        && destination.hash)
    ) return;

    event.preventDefault();
    if (reducedMotion()) {
      window.location.href = destination.href;
      return;
    }
    if (document.body.classList.contains('is-leaving')) return;

    var navigated = false;
    var fallback;
    function navigate() {
      if (navigated) return;
      navigated = true;
      window.clearTimeout(fallback);
      document.body.removeEventListener('animationend', onAnimationEnd);
      window.location.href = destination.href;
    }
    function onAnimationEnd(animationEvent) {
      if (animationEvent.animationName === 'transition-close-right') navigate();
    }

    document.body.setAttribute('aria-busy', 'true');
    if ('inert' in document.body) document.body.inert = true;
    document.body.addEventListener('animationend', onAnimationEnd);
    document.body.classList.add('is-leaving');
    fallback = window.setTimeout(navigate, 480);
  });
})();
