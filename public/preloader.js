/* Hides the preloader once the page is ready. Kept as a separate file (not inline)
   so the Content-Security-Policy can stay at script-src 'self' with no
   'unsafe-inline' — the auth token lives in localStorage, so injected script is
   the main risk we are guarding against. */

(function () {
  var start = Date.now();
  function hide() {
    var p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
  }
  window.addEventListener('load', function () {
    /* Cap the artificial delay: a cold cache on a slow connection should not
       cost the visitor three seconds of blank blue screen. */
    setTimeout(hide, Math.min(400, Math.max(0, 400 - (Date.now() - start))));
  });
})();
