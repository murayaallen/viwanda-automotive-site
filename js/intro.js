/* ============================================================
   VIWANDA AUTOMOTIVE - intro.js
   Runs in <head>, before the first paint, and only decides which
   cover the page opens behind, so nothing flashes underneath it:

     va-bay-in   arriving by a link inside the site: the bay light
     va-intro    every other load, refreshes included: the wall of work

   Back and Forward get neither, so history stays instant. garage.js
   plays them. Under reduced motion neither is shown.
   ============================================================ */
(function (d) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var s = window.sessionStorage;
    if (s.getItem('va-bay')) {
      s.removeItem('va-bay');
      d.documentElement.classList.add('va-bay-in');
      return;
    }
    var nav = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'back_forward') return;
    d.documentElement.classList.add('va-intro');
  } catch (e) {}
})(document);
