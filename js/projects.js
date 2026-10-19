/* ============================================================
   VIWANDA AUTOMOTIVE - projects.js
   Before and after, one job per band.

   The two frames are rarely shot from the same spot, so this is not a
   naive wipe: each image is its own layer and the handle reveals the
   "after" over the "before". Works by drag, by click anywhere on the
   frame, and by keyboard on the slider itself.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;

  function pic(k, eager) {
    var b = '/viwanda-automotive-site/images/work/' + k.id;
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(k.alt) + '" width="' + k.w + '" height="' + k.h +
      '" draggable="false" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '">' +
    '</picture>';
  }

  function band(p, i) {
    var before = V.workById(p.before), after = V.workById(p.after);
    if (!before || !after) return '';
    var svc = V.service(p.service);
    return '<section class="section section--ruled cv-auto proj' + (i % 2 ? ' proj--flip' : '') +
             '" id="' + p.id + '"><div class="wrap proj__in">' +
      '<div class="proj__copy">' +
        '<p class="label proj__e">' + VI.esc(p.vehicle) + '</p>' +
        '<h2 class="proj__h" data-anim="up">' + VI.esc(p.title) + '</h2>' +
        '<p class="lede" data-anim="up">' + VI.esc(p.body) + '</p>' +
        '<p class="proj__meta label" data-anim="up">' +
          (svc ? svc.name : '') +
          (p.confirmed ? '' : ' &middot; <span class="text-3">two stages of one job</span>') +
        '</p>' +
        '<a class="btn btn--ghost" data-anim="up" href="/viwanda-automotive-site/book.html">Get this quoted</a>' +
      '</div>' +
      '<figure class="ba" data-ba>' +
        '<div class="ba__layer ba__layer--before">' + pic(before, i === 0) +
          '<span class="ba__tag">' + VI.esc(p.beforeLabel) + '</span></div>' +
        '<div class="ba__layer ba__layer--after" style="--x:55%">' + pic(after, i === 0) +
          '<span class="ba__tag ba__tag--after">' + VI.esc(p.afterLabel) + '</span></div>' +
        '<input class="ba__range" type="range" min="0" max="100" value="55" step="0.1" ' +
          'id="ba-' + p.id + '" aria-label="Reveal the finished vehicle">' +
        '<span class="ba__handle" aria-hidden="true"><i></i></span>' +
      '</figure>' +
    '</div></section>';
  }

  function wire(fig) {
    var range = fig.querySelector('.ba__range');
    var after = fig.querySelector('.ba__layer--after');
    var handle = fig.querySelector('.ba__handle');
    if (!range || !after) return;

    function set(v) {
      v = Math.max(0, Math.min(100, v));
      range.value = v;
      after.style.setProperty('--x', v + '%');
      if (handle) handle.style.setProperty('--x', v + '%');
    }
    set(parseFloat(range.value));
    range.addEventListener('input', function () { set(parseFloat(range.value)); });

    /* dragging anywhere on the frame, not just on the thin handle */
    var dragging = false;
    function fromEvent(e) {
      var r = fig.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX);
      set(((cx - r.left) / r.width) * 100);
    }
    fig.addEventListener('pointerdown', function (e) {
      if (e.target === range) return;
      dragging = true; fromEvent(e); fig.setPointerCapture(e.pointerId);
    });
    fig.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    fig.addEventListener('pointerup', function (e) {
      dragging = false;
      if (fig.hasPointerCapture && fig.hasPointerCapture(e.pointerId)) fig.releasePointerCapture(e.pointerId);
    });
    fig.addEventListener('pointercancel', function () { dragging = false; });
  }

  function mount() {
    var host = d.querySelector('[data-projects]');
    if (host) {
      host.innerHTML = (V.projects || []).map(band).join('');
      var figs = host.querySelectorAll('[data-ba]');
      for (var i = 0; i < figs.length; i++) wire(figs[i]);
    }
    if (VI && VI.hydrateIcons) VI.hydrateIcons(d);
    if (location.hash) {
      var t = d.getElementById(location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 60);
    }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(window, document);
