/* ============================================================
   VIWANDA AUTOMOTIVE - work.js
   The gallery. Filter is URL-reflected (#respray) so a filtered
   view can be sent to someone.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;
  var current = 'all';

  function pic(k, eager) {
    var b = V.img(k.id);
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(k.alt) + '" width="' + k.w + '" height="' + k.h +
      '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '">' +
    '</picture>';
  }

  function filters() {
    var el = d.querySelector('[data-filters]');
    if (!el) return;
    var items = [{ id: 'all', name: 'Everything' }].concat(
      V.activeServices.filter(function (s) { return V.workFor(s.id).length; }));
    el.innerHTML = items.map(function (s) {
      return '<button class="filt" type="button" data-filter="' + s.id + '"' +
        (s.id === current ? ' aria-current="true"' : '') + '>' + s.name +
        '<span class="filt__n mono">' +
          (s.id === 'all' ? V.work.length : V.workFor(s.id).length) + '</span></button>';
    }).join('');
  }

  function gallery() {
    var el = d.querySelector('[data-gallery]');
    if (!el) return;
    el.classList.add('reveal-parent');
    var list = current === 'all' ? V.work : V.workFor(current);
    el.innerHTML = VI.galleryHtml(list, { eager: 5 });
    if (VI && VI.hydrateIcons) VI.hydrateIcons(el);
  }

  function setFilter(id, push) {
    current = id;
    filters(); gallery();
    if (push && w.history && w.history.replaceState) {
      w.history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id);
    }
  }

  function mount() {
    var h = (location.hash || '').replace('#', '');
    if (h && (h === 'all' || V.service(h))) current = h;
    filters(); gallery();
    d.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-filter]') : null;
      if (b) setFilter(b.getAttribute('data-filter'), true);
    });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(window, document);
