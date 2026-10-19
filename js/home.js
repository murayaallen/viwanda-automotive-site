/* ============================================================
   VIWANDA AUTOMOTIVE - home.js
   Renders the home page from window.VIWANDA. No copy or price
   lives here; it all comes from data.js.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;

  /* a service photograph, 16:10, for the services that have no job photos */
  function servicePic(id, alt) {
    if (!id) return '';
    var b = '/viwanda-automotive-site/images/service/' + id;
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(alt || '') + '" width="1400" height="875" loading="lazy" decoding="async">' +
    '</picture>';
  }

  /* responsive <picture>, webp first, explicit dimensions so nothing shifts */
  function pic(id, alt, wd, ht, cls, eager) {
    var b = V.img(id);
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(alt) + '" width="' + wd + '" height="' + ht +
      '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '"' +
      (eager ? ' fetchpriority="high"' : '') +
      (cls ? ' class="' + cls + '"' : '') + '>' +
    '</picture>';
  }

  /* ---------- hero: start a quote ----------
     Two selects and one button. The button opens WhatsApp with the answers
     already written, so all that is left is attaching the photos. The
     secondary link carries the same answers into the full form. */
  function quickStart() {
    var f = d.querySelector('[data-qs]');
    if (!f) return;
    var svc = f.elements.service, make = f.elements.make;
    var badge = f.querySelector('[data-qs-badge]');
    var full = f.querySelector('[data-qs-full]');
    var err = f.querySelector('[data-qs-err]');

    svc.innerHTML = '<option value="">Choose a service</option>' +
      V.activeServices.map(function (s) {
        return '<option value="' + s.id + '">' + s.name + '</option>';
      }).join('');
    make.innerHTML = '<option value="">Choose a make</option>' +
      V.makes.map(function (m) {
        return '<option value="' + VI.esc(m) + '">' + VI.esc(m) + '</option>';
      }).join('');

    function sync() {
      var q = [];
      if (svc.value) q.push('service=' + encodeURIComponent(svc.value));
      if (make.value) q.push('make=' + encodeURIComponent(make.value));
      if (full) full.href = '/viwanda-automotive-site/book.html' + (q.length ? '?' + q.join('&') : '');
      if (svc.value && err) { err.hidden = true; svc.removeAttribute('aria-invalid'); }
      if (badge) {
        var m = VI.makeByName ? VI.makeByName(make.value) : null;
        badge.innerHTML = m ? VI.makeArt(m) : '';
        badge.classList.toggle('is-on', !!m);
      }
    }
    f.addEventListener('change', sync);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!svc.value) {
        if (err) err.hidden = false;
        svc.setAttribute('aria-invalid', 'true');
        svc.focus();
        return;
      }
      var s = V.service(svc.value);
      var msg = 'Habari Viwanda Automotive.\n\n' +
        'Job: ' + (s ? s.name.replace(/&amp;/g, 'and') : '') + '\n' +
        (make.value ? 'Make: ' + make.value + '\n' : '') +
        '\nPhotos of the car below.\n\n(Sent from viwandaautomotive.com)';
      w.open(V.wa(msg), '_blank', 'noopener');
    });
    sync();
  }

  /* ---------- the work: a gallery, not a showcase ---------- */
  function gallery() {
    var el = d.querySelector('[data-gallery]');
    if (!el) return;
    /* a spread across services rather than the prettiest twelve */
    var want = ['fuga-finished', 'crv-damaged', 'respray-bay', 'cruiser-gold',
                'pajero-stripped', 'valeting', 'saloon-masked', 'parts-boxed',
                'cruiser-black', 'crv-repaired', 'tint', 'fuga-stripped'];
    var items = want.map(function (id) {
      return V.work.filter(function (k) { return k.id === id; })[0];
    }).filter(Boolean);
    /* the hero is typographic, so nothing on this page is above the fold:
       every photograph waits for the scroll */
    el.innerHTML = VI.galleryHtml(items, { eager: 0 });
  }

  /* ---------- services ---------- */
  function services() {
    var el = d.querySelector('[data-svc-grid]');
    if (!el) return;
    el.innerHTML = V.activeServices.map(function (s, i) {
      var img = s.images[0];
      var media = img
        ? '<div class="svc__ph">' + pic(img, '', 738, 554) + '</div>'
        : '<div class="svc__ph">' + servicePic(s.photo, s.photoAlt) + '</div>';
      return '<a class="svc" href="/viwanda-automotive-site/services.html#' + s.id + '" data-anim="up" data-tilt="4">' +
        media +
        '<div class="svc__body">' +
          '<span class="svc__icon" data-icon="' + s.icon + '" data-icon-size="24"></span>' +
          '<h3 class="svc__t">' + s.name + '</h3>' +
          '<p class="svc__sw sw">' + s.sw + '</p>' +
          '<p class="svc__d">' + VI.esc(s.short) + '</p>' +
        '</div>' +
      '</a>';
    }).join('');
  }


  /* ---------- how a job runs ---------- */
  function process() {
    var el = d.querySelector('[data-process]');
    if (!el) return;
    el.classList.add('reveal-parent');
    el.innerHTML = (V.process || []).map(function (p, i) {
      return '<li class="flow__i" data-anim="up">' +
        '<span class="flow__n mono">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<h3 class="flow__t">' + VI.esc(p.n) + '</h3>' +
        '<p class="flow__sw sw">' + VI.esc(p.sw) + '</p>' +
        '<p class="flow__d">' + VI.esc(p.body) + '</p>' +
      '</li>';
    }).join('');
  }

  /* ---------- one before/after, pulled onto the home page ---------- */
  function featureBA() {
    var el = d.querySelector('[data-feature-ba]');
    if (!el || !V.projects || !V.projects.length) return;
    var p = V.projects[0];
    var before = V.workById(p.before), after = V.workById(p.after);
    if (!before || !after) return;
    function frame(k) {
      var b = '/viwanda-automotive-site/images/work/' + k.id;
      return '<picture><source srcset="' + b + '.webp" type="image/webp">' +
        '<img src="' + b + '.jpg" alt="' + VI.esc(k.alt) + '" width="' + k.w +
        '" height="' + k.h + '" draggable="false" loading="lazy" decoding="async"></picture>';
    }
    el.innerHTML = '<figure class="ba ba--wide" data-ba>' +
      '<div class="ba__layer ba__layer--before">' + frame(before) +
        '<span class="ba__tag">' + VI.esc(p.beforeLabel) + '</span></div>' +
      '<div class="ba__layer ba__layer--after" style="--x:52%">' + frame(after) +
        '<span class="ba__tag ba__tag--after">' + VI.esc(p.afterLabel) + '</span></div>' +
      '<input class="ba__range" type="range" min="0" max="100" value="52" step="0.1" ' +
        'aria-label="Reveal the repaired vehicle">' +
      '<span class="ba__handle" aria-hidden="true"><i></i></span>' +
    '</figure>';
    wireBA(el.querySelector('[data-ba]'));
  }

  /* same wipe behaviour as /before-after.html */
  function wireBA(fig) {
    if (!fig) return;
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
    fig.addEventListener('pointerup', function () { dragging = false; });
    fig.addEventListener('pointercancel', function () { dragging = false; });
  }


  /* ---------- the pinned scroll story ----------
     Markup only. motion.js drives which stage is active, so the scroll
     maths lives with the rest of the scroll work rather than here. */
  function story() {
    var media = d.querySelector('[data-story-media]');
    var msgs = d.querySelector('[data-story-msgs]');
    var dots = d.querySelector('[data-story-dots]');
    var S = V.stages || [];
    if (!media || !msgs || !S.length) return;

    media.innerHTML = '<div class="story__stack">' + S.map(function (st, i) {
      var k = V.workById(st.img);
      var b = '/viwanda-automotive-site/images/work/' + st.img;
      return '<picture class="story__shot' + (i === 0 ? ' is-on' : '') + '" data-shot>' +
        '<source srcset="' + b + '.webp" type="image/webp">' +
        '<img src="' + b + '.jpg" alt="' + VI.esc(k ? k.alt : st.tag) + '" width="' +
        (k ? k.w : 738) + '" height="' + (k ? k.h : 554) + '" loading="' +
        'lazy" decoding="async">' +
      '</picture>';
    }).join('') + '</div>';

    msgs.innerHTML = S.map(function (st, i) {
      return '<div class="story__msg' + (i === 0 ? ' is-on' : '') + '" data-msg>' +
        '<h3 class="story__mh">' + VI.esc(st.head) + '</h3>' +
        '<p class="story__md">' + VI.esc(st.body) + '</p>' +
      '</div>';
    }).join('');

    if (dots) {
      dots.innerHTML = S.map(function (st, i) {
        return '<li class="story__dot' + (i === 0 ? ' is-on' : '') + '" data-dot>' +
          '<span class="sr-only">' + VI.esc(st.tag) + '</span></li>';
      }).join('');
    }
  }

  /* ---------- client wall ---------- */
  function clients() {
    var el = d.querySelector('[data-clients]');
    if (!el) return;
    el.classList.add('marquee');
    el.innerHTML = '<div class="marquee__row">' + V.clients.map(function (c) {
      return '<div class="logowall__i">' +
        '<img src="/viwanda-automotive-site/images/clients/mono/' + c.id + '.png" alt="' + VI.esc(c.name) +
        '" loading="lazy" decoding="async">' +
      '</div>';
    }).join('') + '</div>';
  }

  function mount() {
    quickStart(); gallery(); services(); story(); featureBA(); process(); clients();
    if (VI && VI.hydrateIcons) VI.hydrateIcons(d);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window, document);
