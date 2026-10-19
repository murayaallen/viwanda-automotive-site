/* ============================================================
   VIWANDA AUTOMOTIVE - inner.js
   Shared renderer for fleet / locations / about / contact.
   Each block renders only if its hook is on the page.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;

  function pic(k, eager) {
    var b = V.img(k.id);
    return '<picture><source srcset="' + b + '.webp" type="image/webp">' +
      '<img src="' + b + '.jpg" alt="' + VI.esc(k.alt) + '" width="' + k.w + '" height="' + k.h +
      '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '"></picture>';
  }

  function clients() {
    var el = d.querySelector('[data-clients]');
    if (!el) return;
    el.classList.add('reveal-parent');
    el.innerHTML = V.clients.map(function (c) {
      return '<div class="logowall__i" data-anim="up"><img src="/viwanda-automotive-site/images/clients/mono/' +
        c.id + '.png" alt="' + VI.esc(c.name) + '" loading="lazy" decoding="async"></div>';
    }).join('');
  }

  function work() {
    var el = d.querySelector('[data-work]');
    if (!el) return;
    el.classList.add('reveal-parent');
    el.innerHTML = VI.galleryHtml(V.workFor(el.getAttribute('data-work')), { eager: 2 });
  }

  function steps() {
    var el = d.querySelector('[data-steps-list]');
    if (!el) return;
    el.classList.add('reveal-parent');
    var S = [
      ['Assessment', 'Bring the vehicle in, or send photos on WhatsApp. We quote on what we can actually see.'],
      ['Authorisation', 'A written figure before any work starts. Insurers get the same photographs the customer does.'],
      ['The work', 'Strip, panel, fill, mask, prime, colour, coat. Photographed at each stage.'],
      ['Handover', 'Buffed, checked and returned. The record of the job goes with it.']
    ];
    el.innerHTML = S.map(function (s, i) {
      return '<li class="step" data-anim="up"><span class="step__n mono">' +
        String(i + 1).padStart(2, '0') + '</span><div class="min0">' +
        '<h3 class="step__t">' + s[0] + '</h3><p class="step__d">' + s[1] + '</p></div></li>';
    }).join('');
  }

  function locations() {
    var el = d.querySelector('[data-locations]');
    if (!el) return;
    el.classList.add('reveal-parent');
    el.innerHTML = V.locations.map(function (l) {
      var rows = '';
      rows += '<dt>Find us</dt><dd>' + VI.esc(l.landmark || l.address) + '</dd>';
      if (l.landmark) rows += '<dt>Address</dt><dd>' + VI.esc(l.address) + '</dd>';
      rows += '<dt>Hours</dt><dd>' + (l.hours ? VI.esc(l.hours) :
              '<span class="text-2">Call ahead before you come</span>') + '</dd>';
      if (l.phone) rows += '<dt>Phone</dt><dd><a href="tel:' + l.phone + '">' +
                            VI.esc(l.phoneDisplay) + '</a></dd>';
      return '<article class="loc' + (l.primary ? ' loc--primary' : '') + '" data-anim="up">' +
        '<p class="label loc__e">' + (l.primary ? 'The workshop' : 'Also') + '</p>' +
        '<h2 class="loc__h">' + VI.esc(l.name) + '<span class="loc__city">' + VI.esc(l.city) + '</span></h2>' +
        '<p class="loc__note">' + VI.esc(l.note) + '</p>' +
        '<dl class="loc__dl">' + rows + '</dl>' +
        (l.whatsapp ? '<a class="btn btn--primary" target="_blank" rel="noopener" href="' +
          V.wa('Habari. I would like to bring a vehicle in.', l.whatsapp) +
          '"><span data-icon="whatsapp" data-icon-size="18"></span>WhatsApp this branch</a>' : '') +
      '</article>';
    }).join('');
  }

  function contact() {
    var el = d.querySelector('[data-contact]');
    if (!el) return;
    el.classList.add('reveal-parent');
    var C = V.company;
    var rows = [
      ['whatsapp', 'WhatsApp', C.phoneDisplay, V.wa('Habari. I would like a quote.'), true,
       'Send a photo of the vehicle and we will quote from it.'],
      ['phone', 'Phone', C.phoneDisplay, 'tel:' + C.phone, false, 'Calls and WhatsApp on the same number.'],
      ['mail', 'Email', C.email, 'mailto:' + C.email, false, 'For insurers and procurement.'],
      ['pin', 'Workshop', 'Garden Estate, off Thika Road', '/viwanda-automotive-site/locations.html', false, 'Nairobi.']
    ];
    el.innerHTML = rows.map(function (r) {
      return '<a class="crow" href="' + r[3] + '"' + (r[4] ? ' target="_blank" rel="noopener"' : '') +
        ' data-anim="up"><span class="crow__i" data-icon="' + r[0] + '" data-icon-size="22"></span>' +
        '<span class="min0"><span class="crow__l label">' + r[1] + '</span>' +
        '<span class="crow__v">' + VI.esc(r[2]) + '</span>' +
        '<span class="crow__d">' + VI.esc(r[5]) + '</span></span></a>';
    }).join('');
  }

  function mount() {
    clients(); work(); steps(); locations(); contact();
    if (VI && VI.hydrateIcons) VI.hydrateIcons(d);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(window, document);
