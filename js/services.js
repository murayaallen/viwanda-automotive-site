/* ============================================================
   VIWANDA AUTOMOTIVE - services.js
   One alternating band per active service. Quoted on assessment; no
   prices are rendered anywhere on the site.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;

  function pic(id, alt, eager) {
    var k = V.work.filter(function (x) { return x.id === id; })[0];
    if (!k) return '';
    var b = V.img(id);
    return '<picture>' +
      '<source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(alt || k.alt) + '" width="' + k.w +
      '" height="' + k.h + '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '">' +
    '</picture>';
  }

  function band(s, i) {
    return '<section class="section section--ruled band' + (i % 2 ? ' band--flip' : '') +
             ' cv-auto" id="' + s.id + '"><div class="wrap band__in">' +
      '<div class="band__copy">' +
        '<p class="label band__e">' + String(i + 1).padStart(2, '0') + ' &mdash; ' + s.sw + '</p>' +
        '<h2 class="band__h" data-anim="up">' + s.name + '</h2>' +
        '<p class="lede" data-anim="up">' + VI.esc(s.body) + '</p>' +
        '<p class="band__from" data-anim="up">Quoted on assessment</p>' +
        '<a class="btn btn--primary" data-anim="up" target="_blank" rel="noopener" href="' +
          V.wa('Habari. I would like a quote for ' + s.name.replace(/&amp;/g, 'and') + '.') +
          '"><span data-icon="whatsapp" data-icon-size="18"></span>Ask about this</a>' +
      '</div>' +
      '<div class="band__media' + (V.workFor(s.id).length ? ' gallery reveal-parent' : '') + '">' +
        (V.workFor(s.id).length
          ? VI.galleryHtml(V.workFor(s.id), { eager: i === 0 ? 1 : 0 })
          : '<figure class="band__solo" data-anim="' + (i % 2 ? 'left' : 'right') + '">' +
            '<picture><source srcset="/viwanda-automotive-site/images/service/' + s.photo + '.webp" type="image/webp">' +
            '<img src="/viwanda-automotive-site/images/service/' + s.photo + '.jpg" alt="' + VI.esc(s.photoAlt || '') +
            '" width="1400" height="875" ' +
            'loading="lazy" decoding="async"></picture></figure>') +
      '</div>' +
    '</div></section>';
  }

  function mount() {
    var host = d.querySelector('[data-services]');
    if (host) host.innerHTML = V.activeServices.map(band).join('');
    if (VI && VI.hydrateIcons) VI.hydrateIcons(d);
    if (location.hash) {
      var t = d.getElementById(location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 60);
    }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(window, document);
