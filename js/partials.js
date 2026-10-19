/* ============================================================
   VIWANDA AUTOMOTIVE - partials.js
   Header, drawer, footer, sticky mobile bar, and the shared helpers.
   Runs after data.js + icons.js, before the page script.

   Mounts into [data-header], [data-footer], [data-mobilebar] if present.
   ============================================================ */
(function (w, d) {
  'use strict';

  var V  = w.VIWANDA;
  var VI = w.VI || {};
  var C  = V.company;

  /* ---------------------------------------------------------
     helpers
     --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* <picture> with a webp sibling and explicit dimensions, so nothing
     shifts while images load. Everything below the fold is lazy. */
  function vaPicture(opts) {
    var src = opts.src, alt = opts.alt || '', w_ = opts.w, h_ = opts.h;
    var webp = src.replace(/\.(jpe?g|png)$/i, '.webp');
    var eager = opts.eager === true;
    return '<picture>' +
      '<source srcset="' + esc(webp) + '" type="image/webp">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' +
      (w_ ? ' width="' + w_ + '"' : '') + (h_ ? ' height="' + h_ + '"' : '') +
      ' decoding="async" loading="' + (eager ? 'eager' : 'lazy') +
      (eager ? '" fetchpriority="high' : '') + '"' +
      (opts.cls ? ' class="' + esc(opts.cls) + '"' : '') + '>' +
      '</picture>';
  }

  var toastTimer = null;
  function vaToast(msg, kind) {
    var el = d.getElementById('va-toast');
    if (!el) {
      el = d.createElement('div');
      el.id = 'va-toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      d.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast is-on' + (kind ? ' toast--' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = 'toast'; }, 2600);
  }

  /* Clipboard is refused in some embedded views - always have a fallback. */
  function copyText(text, okMsg) {
    function fallback() {
      var ta = d.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      d.body.appendChild(ta);
      ta.select();
      var done = false;
      try { done = d.execCommand('copy'); } catch (e) { done = false; }
      d.body.removeChild(ta);
      vaToast(done ? (okMsg || 'Copied') : 'Press Ctrl+C to copy', done ? null : 'warn');
    }
    if (w.navigator && w.navigator.clipboard && w.navigator.clipboard.writeText) {
      w.navigator.clipboard.writeText(text)
        .then(function () { vaToast(okMsg || 'Copied'); })
        .catch(fallback);
    } else { fallback(); }
  }


  /* ---------------------------------------------------------
     gallery
     The work photographs run from 738x340 to 738x1351. Cropping
     them all to one ratio throws away most of several frames, so
     the gallery is CSS-column masonry and every image keeps its
     own shape.
     --------------------------------------------------------- */
  function workPicture(k, eager) {
    var b = '/viwanda-automotive-site/images/work/' + k.id;
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + esc(k.alt) + '" width="' + k.w + '" height="' + k.h +
      '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '">' +
    '</picture>';
  }

  function galleryHtml(items, opts) {
    opts = opts || {};
    return items.map(function (k, i) {
      return '<figure class="gi" data-anim="up" tabindex="0" role="button" aria-label="' + esc('Open photo: ' + k.alt) + '">' +
        workPicture(k, i < (opts.eager || 0)) +
        (opts.caption === false ? '' :
          '<figcaption class="gi__cap">' +
            '<span class="gi__stage label">' + esc(k.stage) + '</span>' +
            '<span class="gi__alt">' + esc(k.alt) + '</span>' +
          '</figcaption>') +
      '</figure>';
    }).join('');
  }

  /* ---------------------------------------------------------
     theme
     The pre-paint snippet in each <head> has already applied the
     stored theme; this only handles the toggle afterwards.
     --------------------------------------------------------- */
  function currentTheme() {
    var set = d.documentElement.getAttribute('data-theme');
    if (set) return set;
    return w.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t) {
    d.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('va-theme', t); } catch (e) {}
    labelToggle(t);
  }
  function labelToggle(t) {
    var btns = d.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label',
        t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  /* ---------------------------------------------------------
     header
     --------------------------------------------------------- */
  function headerHtml(active) {
    var nav = '';
    V.nav.forEach(function (n) {
      var on = active && n.href.indexOf(active) !== -1;
      nav += '<li><a href="' + esc(n.href) + '"' +
             (on ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
    });
    return '' +
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header" data-header-el>' +
      '<div class="scroll-progress" aria-hidden="true"><i></i></div>' +
      '<div class="wrap site-header__in">' +
        '<a class="brand" href="/viwanda-automotive-site/" aria-label="' + esc(C.legal) + ' - home">' +
          '<img src="/viwanda-automotive-site/images/logo/v2/workshop-lockup-light-web.svg" alt="" width="158" height="40" class="brand__mark brand__mark--light">' +
          '<img src="/viwanda-automotive-site/images/logo/v2/workshop-lockup-dark-web.svg" alt="" width="158" height="40" class="brand__mark brand__mark--dark">' +
          '<span class="sr-only">' + esc(C.legal) + '</span>' +
        '</a>' +
        '<nav class="site-nav" aria-label="Primary"><ul>' + nav + '</ul></nav>' +
        '<div class="site-header__end">' +
          '<button class="icon-btn" type="button" data-theme-toggle aria-label="Switch theme">' +
            '<span data-icon="sparkle" data-icon-size="18"></span>' +
          '</button>' +
          '<a class="btn btn--primary btn--sm hide-sm" href="/viwanda-automotive-site/book.html">Book a service' +
            '<span class="btn__sw">Weka miadi</span></a>' +
          '<button class="icon-btn show-md" type="button" data-drawer-open ' +
                  'aria-expanded="false" aria-controls="va-drawer" aria-label="Open menu">' +
            '<span data-icon="menu" data-icon-size="22"></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  function drawerHtml() {
    var nav = '';
    V.nav.forEach(function (n) {
      nav += '<li><a href="' + esc(n.href) + '">' + n.label + '</a></li>';
    });
    return '' +
    '<div class="drawer" id="va-drawer" hidden>' +
      '<div class="drawer__scrim" data-drawer-close></div>' +
      '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="drawer__top">' +
          '<img src="/viwanda-automotive-site/images/logo/v2/workshop-emblem-small.svg" alt="" width="36" height="36" loading="lazy">' +
          '<button class="icon-btn" type="button" data-drawer-close aria-label="Close menu">' +
            '<span data-icon="close" data-icon-size="22"></span>' +
          '</button>' +
        '</div>' +
        '<nav aria-label="Menu"><ul class="drawer__nav">' + nav +
          '<li><a href="/viwanda-automotive-site/contact.html">Contact</a></li>' +
        '</ul></nav>' +
        '<a class="btn btn--primary btn--block" href="/viwanda-automotive-site/book.html">Book a service' +
          '<span class="btn__sw">Weka miadi</span></a>' +
        '<div class="drawer__foot">' +
          '<a class="drawer__line" href="tel:' + esc(C.phone) + '">' +
            '<span data-icon="phone" data-icon-size="18"></span>' + esc(C.phoneDisplay) + '</a>' +
          '<a class="drawer__line" href="' + esc(V.wa('Habari, I would like to book a service.')) +
            '" target="_blank" rel="noopener">' +
            '<span data-icon="whatsapp" data-icon-size="18"></span>WhatsApp</a>' +
          '<p class="sw drawer__sw">' + esc(C.tagline) + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------------------------------------------------------
     footer
     --------------------------------------------------------- */
  function footerHtml() {
    var locs = '';
    V.locations.forEach(function (l) {
      locs += '<div class="foot__loc">' +
        '<h3 class="foot__h">' + esc(l.name) + '</h3>' +
        '<p class="text-2">' + esc(l.landmark || l.address) + '</p>' +
        (l.hours ? '<p class="label">' + esc(l.hours) + '</p>' : '') +
        (l.phone ? '<a href="tel:' + esc(l.phone) + '">' + esc(l.phoneDisplay) + '</a>' : '') +
      '</div>';
    });

    var svc = '';
    V.activeServices.forEach(function (s) {
      svc += '<li><a href="/viwanda-automotive-site/services.html#' + esc(s.id) + '">' + s.name + '</a></li>';
    });

    return '' +
    '<footer class="site-footer on-ink">' +
      '<div class="wrap">' +
        '<div class="foot__grid">' +
          '<div class="foot__brand">' +
            '<img class="foot__logo foot__logo--light" src="/viwanda-automotive-site/images/logo/v2/workshop-stacked-light.svg" alt="' +
              esc(C.legal) + '" width="200" height="148" loading="lazy">' +
            '<img class="foot__logo foot__logo--dark" src="/viwanda-automotive-site/images/logo/v2/workshop-stacked-dark.svg" alt="" width="200" height="148" loading="lazy">' +
            '<p class="sw foot__tag">' + esc(C.tagline) + '</p>' +
            '<p class="text-3 foot__gloss">' + esc(C.taglineEn) +
              ' &middot; and done properly. Both meanings at once.</p>' +
          '</div>' +
          '<div class="foot__col"><h3 class="foot__h">Services</h3><ul class="foot__list">' +
            svc + '</ul></div>' +
          '<div class="foot__col"><h3 class="foot__h">Company</h3><ul class="foot__list">' +
            '<li><a href="/viwanda-automotive-site/fleet.html">Fleet &amp; corporate</a></li>' +
            '<li><a href="/viwanda-automotive-site/about.html">About</a></li>' +
            '<li><a href="/viwanda-automotive-site/locations.html">Locations</a></li>' +
            '<li><a href="/viwanda-automotive-site/contact.html">Contact</a></li>' +
          '</ul></div>' +
          '<div class="foot__col foot__locs">' + locs + '</div>' +
        '</div>' +

        '<div class="foot__contact">' +
          '<a class="foot__cta" href="tel:' + esc(C.phone) + '">' +
            '<span data-icon="phone" data-icon-size="18"></span>' + esc(C.phoneDisplay) + '</a>' +
          '<a class="foot__cta" href="mailto:' + esc(C.email) + '">' +
            '<span data-icon="mail" data-icon-size="18"></span>' + esc(C.email) + '</a>' +
          (C.mpesa
            ? '<button class="foot__cta" type="button" data-copy="' + esc(C.mpesa) + '" ' +
              'data-copy-msg="M-Pesa till copied">' +
              '<span data-icon="copy" data-icon-size="18"></span>M-Pesa ' + esc(C.mpesa) + '</button>'
            : '') +
        '</div>' +

        '<div class="foot__base">' +
          '<p class="label">&copy; ' + new Date().getFullYear() + ' ' + esc(C.legal) + '</p>' +
          '<p class="label">' + esc(C.promise) + '</p>' +
          '<p class="label foot__karibu">Karibu Viwanda</p>' +
        '</div>' +
      '</div>' +
      '<div class="foot__giant" aria-hidden="true"><img src="/viwanda-automotive-site/images/logo/v2/workshop-wordmark-mono-white.svg" ' +
        'alt="" width="300" height="62" loading="lazy" decoding="async"></div>' +
    '</footer>';
  }

  /* The closing call to action, the same on every page that has one:
     a photo on WhatsApp first, the phone second. */
  function ctaHtml() {
    return '<a class="btn btn--primary btn--lg" target="_blank" rel="noopener" href="' +
        esc(V.wa('Habari Viwanda. I would like a quote. Photos below.')) + '">' +
        '<span data-icon="whatsapp" data-icon-size="19"></span>Send a photo</a>' +
      '<a class="btn btn--ghost btn--lg" href="tel:' + esc(C.phone) + '">' +
        esc(C.phoneDisplay) + '</a>';
  }

  /* Kenya is mobile-first and this is reported to lift mobile conversion
     15-35%. Two buttons, not one: Call and WhatsApp. */
  function mobileBarHtml() {
    return '' +
    '<div class="mobilebar" data-noprint>' +
      '<a class="mobilebar__btn" href="tel:' + esc(C.phone) + '">' +
        '<span data-icon="phone" data-icon-size="19"></span>Call</a>' +
      '<a class="mobilebar__btn mobilebar__btn--wa" target="_blank" rel="noopener" href="' +
        esc(V.wa('Habari, I would like to book a service.')) + '">' +
        '<span data-icon="whatsapp" data-icon-size="19"></span>WhatsApp</a>' +
    '</div>';
  }

  /* ---------------------------------------------------------
     drawer behaviour: Escape, focus trap, focus return
     --------------------------------------------------------- */
  var lastFocus = null;

  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; });
  }

  function openDrawer() {
    var dr = d.getElementById('va-drawer');
    if (!dr) return;
    lastFocus = d.activeElement;
    dr.hidden = false;
    d.documentElement.classList.add('is-locked');
    requestAnimationFrame(function () { dr.classList.add('is-open'); });
    var f = focusables(dr);
    if (f.length) f[0].focus();
    setExpanded(true);
  }
  function closeDrawer() {
    var dr = d.getElementById('va-drawer');
    if (!dr || dr.hidden) return;
    dr.classList.remove('is-open');
    d.documentElement.classList.remove('is-locked');
    setExpanded(false);
    var done = function () { dr.hidden = true; dr.removeEventListener('transitionend', done); };
    dr.addEventListener('transitionend', done);
    setTimeout(done, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function setExpanded(on) {
    var b = d.querySelectorAll('[data-drawer-open]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  function bind() {
    d.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-drawer-open],[data-drawer-close],[data-theme-toggle],[data-copy]') : null;
      if (!t) return;
      if (t.hasAttribute('data-drawer-open'))  { openDrawer(); }
      else if (t.hasAttribute('data-drawer-close')) { closeDrawer(); }
      else if (t.hasAttribute('data-theme-toggle')) {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      } else if (t.hasAttribute('data-copy')) {
        copyText(t.getAttribute('data-copy'), t.getAttribute('data-copy-msg'));
      }
    });

    d.addEventListener('keydown', function (e) {
      var dr = d.getElementById('va-drawer');
      if (!dr || dr.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(dr);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* header solidifies once the hero is behind it */
    var hdr = d.querySelector('[data-header-el]');
    if (hdr) {
      var onScroll = function () {
        hdr.classList.toggle('is-stuck', (w.scrollY || w.pageYOffset) > 12);
      };
      w.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------------------------------------------------------
     mount
     --------------------------------------------------------- */
  function mount() {
    var active = location.pathname.replace(/^\/|\.html$/g, '') || 'index';
    var h = d.querySelector('[data-header]');
    if (h) h.innerHTML = headerHtml(active) + drawerHtml();
    var f = d.querySelector('[data-footer]');
    if (f) f.innerHTML = footerHtml();
    var m = d.querySelector('[data-mobilebar]');
    if (m) m.innerHTML = mobileBarHtml();
    var ctas = d.querySelectorAll('[data-cta]');
    for (var i = 0; i < ctas.length; i++) ctas[i].innerHTML = ctaHtml();

    if (VI.hydrateIcons) VI.hydrateIcons(d);
    bind();
    labelToggle(currentTheme());

    /* reveal failsafe - see css/base.css. motion.js clears this timer. */
    d.documentElement.classList.add('js-anim');
    /* motion.js may already have run (it loads after this file but this
       mount waits for DOMContentLoaded), so it leaves a flag rather than
       relying on clearing a timer that does not exist yet */
    if (!w.__vaMotion) w.__vaFailsafe = setTimeout(function () {
      if (!w.__vaMotion) d.documentElement.classList.add('anim-failsafe');
    }, 2500);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount);
  else mount();

  w.VI = VI;
  VI.picture = vaPicture;
  VI.toast = vaToast;
  VI.copy = copyText;
  VI.esc = esc;
  VI.workPicture = workPicture;
  VI.galleryHtml = galleryHtml;
  VI.openDrawer = openDrawer;
  VI.closeDrawer = closeDrawer;
})(window, document);
