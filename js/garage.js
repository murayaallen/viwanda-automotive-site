/* ============================================================
   VIWANDA AUTOMOTIVE - garage.js
   The set pieces. Each module looks for its own markup and does
   nothing when the page does not have it.

     intro      first page of a visit: the wall of work, then the mark
     bay        between pages: the strip light strikes and floods out
     bay hero   real jobs drifting behind the home headline
     wheel      Restore/Maintain/Enhance turns about the hub on scroll
     engine     under the bonnet: pull back from the crank, then the
                points to check, tappable
     job card   the process fills in as you read down it
     tread      the road section rolls, faster while you scroll
     close      the bay light comes on at the last section
     glare      service cards catch the light under a pointer

   One scroll loop, transform and opacity only. Under reduced motion
   the page is complete and still.
   ============================================================ */
(function (w, d) {
  'use strict';

  var html = d.documentElement;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = w.matchMedia && w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  /* read before any module clears it: will a cover play before the page shows? */
  var pendingStage = html.classList.contains('va-intro') || html.classList.contains('va-bay-in');

  var WALL = [
    ['respray-bay', 'cruiser-black', 'saloon-masked', 'v8-glasscoat', 'pajero-finished', 'buffing'],
    ['fuga-finished', 'premio-blue', 'fuga-stripped', 'crv-rear-repaired', 'valeting', 'cruiser-gold'],
    ['tint', 'v8-gold-damaged', 'dashboard', 'crv-damaged', 'wagon-finished', 'parts-boxed']
  ];

  function el(tag, cls) { var e = d.createElement(tag); if (cls) e.className = cls; return e; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function store(k, v) { try { if (v === undefined) return w.sessionStorage.getItem(k); w.sessionStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- one scroll loop ---------- */
  var tasks = [], ticking = false, lastY = w.scrollY || 0;
  function frame() {
    ticking = false;
    var y = w.scrollY || 0, v = y - lastY;
    lastY = y;
    for (var i = 0; i < tasks.length; i++) tasks[i](y, v);
  }
  function schedule() { if (!ticking) { ticking = true; w.requestAnimationFrame(frame); } }
  w.addEventListener('scroll', schedule, { passive: true });
  w.addEventListener('resize', schedule, { passive: true });

  /* rows of real jobs, each set twice so the drift repeats with no seam */
  function wallRows(host, rowClass, speeds) {
    /* a phone's rows are short: smaller photographs, four to a row */
    var small = w.innerWidth < 700;
    WALL.forEach(function (set, r) {
      var row = el('div', 'wall-row ' + rowClass + (r % 2 ? ' wall-row--rev' : ''));
      row.style.setProperty('--r', r);
      var tr = el('div', 'wall-track');
      tr.style.setProperty('--d', (small ? speeds[r] * 0.7 : speeds[r]) + 's');
      var use = small ? set.slice(0, 4) : set;
      for (var k = 0; k < 2; k++) use.forEach(function (n) {
        var im = new Image();
        im.alt = ''; im.decoding = 'async';
        im.width = small ? 320 : 480; im.height = small ? 240 : 360;
        im.src = '/viwanda-automotive-site/images/garage/wall/' + n + (small ? '-320' : '') + '.webp';
        tr.appendChild(im);
      });
      row.appendChild(tr);
      host.appendChild(row);
    });
  }

  /* ============================================================
     INTRO - the wall of work
     ============================================================ */
  function intro() {
    if (!html.classList.contains('va-intro')) return;
    store('va-intro', '1');
    var hero = d.querySelector('.hero--bay');
    if (hero) html.classList.add('intro-hold');

    var box = el('div', 'intro');
    box.setAttribute('role', 'presentation');
    var wall = el('div', 'intro__wall');
    wallRows(wall, 'intro__row', [52, 63, 58]);
    var mark = el('div', 'intro__mark');
    var em = el('div', 'intro__em');
    var img = new Image();
    img.alt = ''; img.src = '/viwanda-automotive-site/images/logo/final/viwanda-emblem.svg';
    em.appendChild(img);
    em.appendChild(el('i', 'intro__shine'));
    var word = el('div', 'intro__word');
    mark.appendChild(em); mark.appendChild(word);
    var skip = el('button', 'intro__skip');
    skip.type = 'button'; skip.textContent = 'Skip';
    box.appendChild(wall); box.appendChild(el('div', 'intro__veil')); box.appendChild(mark); box.appendChild(skip);
    d.body.appendChild(box);

    /* the name is inlined so its two lines can arrive one after the other */
    function plainWord() {
      if (word.firstChild) return;
      var wi = new Image(); wi.alt = ''; wi.src = '/viwanda-automotive-site/images/logo/final/viwanda-wordmark-dark.svg';
      word.appendChild(wi);
    }
    if (w.fetch) {
      w.fetch('/viwanda-automotive-site/images/logo/final/viwanda-wordmark-dark.svg').then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (t) { if (t && !word.firstChild) word.innerHTML = t.replace(/<title>.*?<\/title>/, ''); else plainWord(); })
        .catch(plainWord);
    } else plainWord();

    var started = false, timer = null, done = false;
    function start() {
      if (started) return; started = true;
      var cover = d.querySelector('.intro-cover');
      if (cover) cover.remove();
      void box.offsetWidth;
      box.classList.add('run');
      timer = setTimeout(leave, 3700);
    }
    function leave() {
      if (done) return; done = true;
      clearTimeout(timer);
      if (!started) { started = true; var c = d.querySelector('.intro-cover'); if (c) c.remove(); }
      box.classList.add('out');
      html.classList.remove('va-intro', 'intro-hold');
      setTimeout(stageClear, 250);
      d.removeEventListener('keydown', onKey);
      setTimeout(function () { box.remove(); }, 1100);
    }
    function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') leave(); }
    box.addEventListener('click', leave);
    d.addEventListener('keydown', onKey);
    if (img.complete) start(); else { img.onload = img.onerror = start; setTimeout(start, 600); }
  }

  /* ============================================================
     BAY LIGHT - between pages
     ============================================================ */
  function bay() {
    var box = el('div', 'bay');
    box.setAttribute('aria-hidden', 'true');
    box.appendChild(el('div', 'bay__beam'));
    box.appendChild(el('div', 'bay__tube'));
    var em = el('div', 'bay__em');
    var img = new Image(); img.alt = ''; img.src = '/viwanda-automotive-site/images/logo/final/viwanda-emblem.svg';
    em.appendChild(img); box.appendChild(em);
    d.body.appendChild(box);

    if (html.classList.contains('va-bay-in')) {
      box.classList.add('is-in');
      var cover = d.querySelector('.intro-cover');
      if (cover) cover.remove();
      html.classList.remove('va-bay-in');
      w.requestAnimationFrame(function () {
        setTimeout(function () { box.classList.add('is-leaving'); }, 140);
        setTimeout(stageClear, 320);
        setTimeout(function () { box.classList.remove('is-in', 'is-leaving'); }, 1000);
      });
    }
    if (reduce) return;

    d.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
      var u;
      try { u = new URL(a.href, w.location.href); } catch (er) { return; }
      if (u.origin !== w.location.origin || !/^https?:$/.test(u.protocol)) return;
      if (u.pathname === w.location.pathname && u.search === w.location.search) return;   /* same page, a hash */
      e.preventDefault();
      store('va-bay', '1');
      box.classList.remove('is-in', 'is-leaving');
      void box.offsetWidth;
      box.classList.add('is-on');
      setTimeout(function () { w.location.href = u.href; }, 760);
    });
    /* back to a page kept in memory: it must not come back dark */
    w.addEventListener('pageshow', function (e) {
      if (e.persisted) { box.classList.remove('is-on', 'is-in', 'is-leaving'); store('va-bay', ''); }
    });
  }

  /* ============================================================
     THE BAY - home hero
     ============================================================ */
  function heroWall() {
    var hero = d.querySelector('.hero--bay');
    var host = hero && hero.querySelector('[data-wall]');
    if (!host) return;
    wallRows(host, '', [74, 92, 83]);

    lean(hero, host, 0.22);
  }

  /* the backdrop drifts up slower than the page, and leans away from the pointer */
  function lean(sec, target, speed) {
    if (reduce) return;
    tasks.push(function (y) {
      if (sec.getBoundingClientRect().bottom > 0) target.style.setProperty('--sy', (y * speed).toFixed(1) + 'px');
    });
    schedule();
    if (!finePointer) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function ease() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      target.style.setProperty('--mx', cx.toFixed(3));
      target.style.setProperty('--my', cy.toFixed(3));
      raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? w.requestAnimationFrame(ease) : 0;
    }
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = w.requestAnimationFrame(ease);
    });
    sec.addEventListener('pointerleave', function () { tx = ty = 0; if (!raf) raf = w.requestAnimationFrame(ease); });
  }

  /* the header goes clear while a dark opening section sits under it */
  function overInk() {
    var top = d.querySelector('main > .hero--bay, main > .pagehead--bay');
    var hdr = d.querySelector('.site-header');
    if (!top || !hdr) return;
    tasks.push(function () { hdr.classList.toggle('is-over-ink', top.getBoundingClientRect().bottom > 70); });
    schedule();
  }

  /* ============================================================
     PAGE HEADS - each inner page opens on its own backdrop
       data-backdrop="photo:belt | turn:alloy | wall | logos | gear |
                      bay | flicker | tread | ba"
     ============================================================ */
  var PHOTOS = {
    belt: { set: [800, 1400, 2400], base: '/viwanda-automotive-site/images/garage/belt-' },
    alloy: { set: [800, 1400], base: '/viwanda-automotive-site/images/garage/alloy-' }
  };
  function photo(name) {
    var p = PHOTOS[name];
    var pic = el('picture');
    var src = el('source');
    src.type = 'image/webp';
    src.srcset = p.set.map(function (n) { return p.base + n + '.webp ' + n + 'w'; }).join(', ');
    src.sizes = '100vw';
    var im = new Image();
    im.alt = ''; im.decoding = 'async';
    im.src = p.base + p.set[Math.min(1, p.set.length - 1)] + '.jpg';
    pic.appendChild(src); pic.appendChild(im);
    return pic;
  }
  function pageHeads() {
    var V = w.VIWANDA || {};
    [].forEach.call(d.querySelectorAll('[data-backdrop]'), function (sec) {
      var spec = sec.getAttribute('data-backdrop').split(':'), k = spec[0];
      var bd = el('div', 'backdrop backdrop--' + k);
      bd.setAttribute('aria-hidden', 'true');
      if (k === 'photo' || k === 'turn') bd.appendChild(photo(spec[1]));
      else if (k === 'wall') { var wl = el('div', 'hero__wall'); wallRows(wl, '', [74, 92, 83]); bd.appendChild(wl); }
      else if (k === 'logos') {
        var rows = el('div', 'logo-rows'), cl = V.clients || [];
        for (var r = 0; r < 3; r++) {
          var row = el('div', 'wall-row' + (r % 2 ? ' wall-row--rev' : ''));
          var tr = el('div', 'logo-track');
          tr.style.setProperty('--d', (58 + r * 13) + 's');
          for (var rep = 0; rep < 2; rep++) for (var j = 0; j < cl.length; j++) {
            var im = new Image(); im.alt = ''; im.decoding = 'async';
            im.src = '/viwanda-automotive-site/images/clients/mono/' + cl[(j + r * 3) % cl.length].id + '.png';
            tr.appendChild(im);
          }
          row.appendChild(tr); rows.appendChild(row);
        }
        bd.appendChild(rows);
      } else if (k === 'gear') {
        var g = el('div', 'gear');
        var gi = new Image(); gi.alt = ''; gi.src = '/viwanda-automotive-site/images/logo/v2/workshop-ring-dark.svg';
        g.appendChild(gi); bd.appendChild(g);
        if (!reduce) tasks.push(function (y) { g.style.setProperty('--rot', (y * 0.14).toFixed(2) + 'deg'); });
      } else if (k === 'bay' || k === 'flicker') {
        bd.appendChild(el('div', 'bd-beam')); bd.appendChild(el('div', 'bd-tube'));
      } else if (k === 'tread') {
        bd.className += ' road__tread'; bd.appendChild(el('i'));
      } else if (k === 'ba') {
        var ba = el('div', 'bd-ba');
        /* one real job, the same car both sides of the wipe */
        ['v8-gold-damaged', 'cruiser-gold'].forEach(function (n) {
          var bi = new Image(); bi.alt = ''; bi.decoding = 'async'; bi.src = '/viwanda-automotive-site/images/work/' + n + '.webp'; ba.appendChild(bi);
        });
        ba.appendChild(el('i')); bd.appendChild(ba);
      }
      sec.insertBefore(el('div', 'backdrop__veil'), sec.firstChild);
      sec.insertBefore(bd, sec.firstChild);
      if (k === 'photo' || k === 'turn' || k === 'wall') lean(sec, bd, 0.2);
    });
  }

  /* straight to a service, from the Services page head */
  function jump() {
    var ul = d.querySelector('[data-jump]');
    var V = w.VIWANDA;
    if (!ul || !V || !V.activeServices) return;
    ul.innerHTML = V.activeServices.map(function (s, i) {
      return '<li><a href="#' + s.id + '"><span class="mono">' + String(i + 1).padStart(2, '0') + '</span>' + s.name + '</a></li>';
    }).join('');
    ul.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var t = d.getElementById(a.getAttribute('href').slice(1));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (w.history && w.history.replaceState) w.history.replaceState(null, '', a.getAttribute('href'));
    });
  }

  /* ============================================================
     LIGHTBOX - any job photograph, full screen
     Opens out of the thumbnail. Arrow keys, swipe, Escape. Focus
     goes in, stays in, and comes back to the photo it came from.
     ============================================================ */
  function lightbox() {
    var box = null, img, stageEl, altEl, numEl, items = [], idx = 0, opener = null, downX = null;
    /* the photo's own proportions, so the viewer can make it as large as the
       screen allows without stretching it into a box of another shape */
    function shape(im) {
      if (im && im.naturalWidth && im.naturalHeight) img.style.setProperty('--ar', (im.naturalWidth / im.naturalHeight).toFixed(4));
    }
    function srcOf(fig) {
      var im = fig.querySelector('img'), so = fig.querySelector('source');
      return (im && im.currentSrc) || (so && so.srcset.split(/[ ,]/)[0]) || (im && im.src);
    }
    function build() {
      box = el('div', 'lb');
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Photo viewer');
      box.innerHTML =
        '<figure class="lb__fig"><img class="lb__img" alt="">' +
        '<figcaption class="lb__cap"><span class="lb__stage label"></span><span class="lb__alt"></span><span class="lb__n"></span></figcaption>' +
        '<div class="lb__journey" hidden></div></figure>' +
        '<button class="lb__btn lb__prev" type="button" aria-label="Previous photo"><span data-icon="arrow" data-icon-size="20"></span></button>' +
        '<button class="lb__btn lb__next" type="button" aria-label="Next photo"><span data-icon="arrow" data-icon-size="20"></span></button>' +
        '<button class="lb__btn lb__x" type="button" aria-label="Close"><span data-icon="close" data-icon-size="20"></span></button>';
      d.body.appendChild(box);
      if (w.VI && w.VI.hydrateIcons) w.VI.hydrateIcons(box);
      img = box.querySelector('.lb__img');
      stageEl = box.querySelector('.lb__stage'); altEl = box.querySelector('.lb__alt'); numEl = box.querySelector('.lb__n');
      box.querySelector('.lb__prev').addEventListener('click', function () { show(idx - 1); });
      box.querySelector('.lb__next').addEventListener('click', function () { show(idx + 1); });
      box.querySelector('.lb__x').addEventListener('click', close);
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      img.addEventListener('pointerdown', function (e) { downX = e.clientX; });
      img.addEventListener('pointerup', function (e) {
        if (downX === null) return;
        var dx = e.clientX - downX; downX = null;
        if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') show(idx + 1);
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'Tab') {
          var f = [].slice.call(box.querySelectorAll('button'));
          var i = f.indexOf(d.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      });
    }
    /* a confirmed job: show it from arrival to handover, side by side */
    function journey(src) {
      var V = w.VIWANDA || {}, jr = box.querySelector('.lb__journey');
      var m = (src || '').match(/\/work\/([^/.]+)\./), id = m && m[1];
      var proj = id && (V.projects || []).filter(function (p) { return p.confirmed && (p.before === id || p.after === id); })[0];
      if (!proj || !V.workById) { jr.hidden = true; jr.innerHTML = ''; return; }
      jr.hidden = false;
      jr.innerHTML = '<p class="lb__jh label">This job, start to finish</p>' + [[proj.before, proj.beforeLabel], [proj.after, proj.afterLabel]].map(function (x) {
        return '<button type="button" data-id="' + x[0] + '" aria-pressed="' + (x[0] === id) + '">' +
          '<img src="/viwanda-automotive-site/images/work/' + x[0] + '.webp" alt="" width="84" height="56"><span>' + x[1] + '</span></button>';
      }).join('');
      [].forEach.call(jr.querySelectorAll('button'), function (b) {
        b.addEventListener('click', function () {
          var k = V.workById(b.getAttribute('data-id'));
          if (!k) return;
          img.style.opacity = '0';
          var n = new Image();
          n.onload = n.onerror = function () {
            shape(n); img.src = n.src; img.alt = k.alt;
            stageEl.textContent = k.stage; altEl.textContent = k.alt;
            img.style.opacity = '1';
            journey(n.src);
          };
          n.src = '/viwanda-automotive-site/images/work/' + k.id + '.webp';
        });
      });
    }
    function caption(fig) {
      var s = fig.querySelector('.gi__stage'), a = fig.querySelector('.gi__alt'), im = fig.querySelector('img');
      stageEl.textContent = s ? s.textContent : '';
      altEl.textContent = a ? a.textContent : (im ? im.alt : '');
      img.alt = im ? im.alt : '';
      numEl.textContent = items.length > 1 ? (idx + 1) + ' / ' + items.length : '';
      journey(srcOf(fig));
    }
    function show(i) {
      idx = (i + items.length) % items.length;
      var f = items[idx];
      img.style.transition = 'opacity .2s ease';
      img.style.opacity = '0';
      var n = new Image();
      n.onload = n.onerror = function () { shape(n); img.src = n.src; caption(f); img.style.opacity = '1'; };
      n.src = srcOf(f);
    }
    function fromThumb(fig) {
      var t = fig.querySelector('img');
      if (!t || reduce) return;
      var a = t.getBoundingClientRect(), b = img.getBoundingClientRect();
      if (!b.width) return;
      img.style.transition = 'none';
      img.style.transform = 'translate(' + (a.left + a.width / 2 - (b.left + b.width / 2)) + 'px,' +
        (a.top + a.height / 2 - (b.top + b.height / 2)) + 'px) scale(' + (a.width / b.width) + ')';
      void img.offsetWidth;
      img.style.transition = '';
      img.style.transform = '';
    }
    function open(fig) {
      if (!box) build();
      var scope = fig.closest('[data-gallery], .gallery, .band__media') || d;
      items = [].slice.call(scope.querySelectorAll('.gi')).filter(function (g) { return g.offsetParent !== null; });
      if (!items.length) items = [fig];
      idx = Math.max(0, items.indexOf(fig));
      opener = fig;
      img.style.opacity = '1';
      shape(fig.querySelector('img'));
      img.src = srcOf(items[idx]);
      caption(items[idx]);
      box.classList.add('is-open');
      d.documentElement.classList.add('lb-open');
      if (img.complete) fromThumb(fig); else img.onload = function () { img.onload = null; shape(img); fromThumb(fig); };
      box.querySelector('.lb__x').focus({ preventScroll: true });
    }
    function close() {
      if (!box || !box.classList.contains('is-open')) return;
      box.classList.remove('is-open');
      d.documentElement.classList.remove('lb-open');
      if (opener) opener.focus({ preventScroll: true });
    }
    d.addEventListener('click', function (e) {
      var fig = e.target.closest && e.target.closest('.gi');
      if (!fig || fig.closest('.lb, .intro')) return;
      e.preventDefault();
      open(fig);
    });
    d.addEventListener('keydown', function (e) {
      var a = d.activeElement;
      if ((e.key === 'Enter' || e.key === ' ') && a && a.classList && a.classList.contains('gi')) { e.preventDefault(); open(a); }
    });
  }

  /* ============================================================
     THE WHEEL
     ============================================================ */
  function wheel() {
    var sec = d.querySelector('[data-wheel]');
    if (!sec || reduce) return;
    tasks.push(function () {
      var r = sec.getBoundingClientRect(), vh = w.innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      sec.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height), 0, 1).toFixed(4));
    });
    schedule();
  }

  /* ============================================================
     UNDER THE BONNET
     Positions are percentages of the photograph itself, read off the
     4000 x 4200 crop that tools/build_garage.py makes.
     ============================================================ */
  var CHECKS = [
    { x: 49, y: 84, t: 'Timing chain',
      d: 'A stretched chain rattles on a cold start and can jump a tooth. We check its slack and the sprockets it runs on before it gets that far.' },
    { x: 30, y: 67, t: 'Guides and tensioners',
      d: 'The plastic guides harden and crack with heat, and a tensioner that has lost pressure lets the chain slap. Both are cheap next to what they protect.' },
    { x: 84, y: 35, t: 'Cam timing',
      d: 'The camshaft sprockets set when every valve opens. Diagnosis starts with the live data, before anything is taken apart.' },
    { x: 44, y: 15, t: 'Hoses and wiring',
      d: 'Heat and dust harden rubber and chafe the loom. Every hose and connector gets looked at, not only the one that failed.' },
    { x: 13, y: 50, t: 'Gasket faces',
      d: 'Oil on the outside of an engine is a gasket or seal giving up. Faces cleaned flat, new seals, bolts torqued in sequence.' }
  ];

  function engine() {
    var sec = d.querySelector('[data-engine]');
    if (!sec) return;
    var frameEl = sec.querySelector('[data-engine-frame]');
    var spotsEl = sec.querySelector('[data-engine-spots]');
    var listEl = sec.querySelector('[data-engine-list]');
    var track = sec.querySelector('.engine__track') || sec;
    if (!frameEl || !spotsEl || !listEl) return;

    var tip = el('div', 'engine__tip');
    tip.setAttribute('aria-hidden', 'true');
    frameEl.appendChild(tip);
    var spots = [], items = [], touched = false, shown = false;

    CHECKS.forEach(function (c, i) {
      var id = 'chk-' + i;
      var s = el('button', 'spot');
      s.type = 'button';
      s.style.setProperty('--x', c.x + '%');
      s.style.setProperty('--y', c.y + '%');
      s.textContent = String(i + 1);
      s.setAttribute('aria-label', c.t);
      s.setAttribute('aria-expanded', 'false');
      s.setAttribute('aria-controls', id);
      spotsEl.appendChild(s);
      spots.push(s);

      var li = el('li');
      var b = el('button');
      b.type = 'button';
      b.setAttribute('aria-expanded', 'false');
      b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="t">' + c.t + '</span><span class="d" id="' + id + '">' + c.d + '</span>';
      li.appendChild(b);
      listEl.appendChild(li);
      items.push(b);

      function go() { touched = true; activate(i); }
      s.addEventListener('click', go);
      b.addEventListener('click', go);
      if (finePointer) s.addEventListener('mouseenter', go);
    });

    function activate(i) {
      CHECKS.forEach(function (c, k) {
        spots[k].setAttribute('aria-expanded', k === i ? 'true' : 'false');
        items[k].setAttribute('aria-expanded', k === i ? 'true' : 'false');
      });
      var c = CHECKS[i];
      tip.innerHTML = '<b>' + c.t + '</b><span>' + c.d + '</span>';
      var right = c.x > 55;
      tip.style.left = right ? '' : 'calc(' + c.x + '% + 1.75rem)';
      tip.style.right = right ? 'calc(' + (100 - c.x) + '% + 1.75rem)' : '';
      tip.style.top = 'clamp(.75rem, calc(' + c.y + '% - 3rem), calc(100% - 10rem))';
      tip.classList.add('is-on');
    }

    if (reduce) { frameEl.style.setProperty('--show', 1); frameEl.style.setProperty('--z', 1); return; }

    var mq = w.matchMedia('(min-width: 900px)');
    tasks.push(function () {
      var vh = w.innerHeight, p;
      if (mq.matches) {
        var r = track.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      } else {
        var f = frameEl.getBoundingClientRect();
        if (f.bottom < 0 || f.top > vh) return;
        /* a phone looks at the photo with it centred: be fully revealed by then */
        p = clamp((vh - f.top) / (vh * 0.65), 0, 1);
      }
      var z = clamp(p / 0.62, 0, 1);
      z = 1 - Math.pow(1 - z, 3);
      frameEl.style.setProperty('--z', z.toFixed(4));
      var show = clamp((p - 0.6) / 0.14, 0, 1);
      frameEl.style.setProperty('--show', show.toFixed(3));
      spotsEl.style.pointerEvents = show > 0.5 ? 'auto' : 'none';
      if (show >= 1 && !shown) { shown = true; if (!touched) activate(0); }
    });
    schedule();
  }

  /* ============================================================
     THE JOB CARD
     ============================================================ */
  function jobcard() {
    [].forEach.call(d.querySelectorAll('[data-jobcard]'), function (list) {
      var prev = list.previousElementSibling;
      var rail = prev && prev.classList.contains('flow__rail') ? prev.querySelector('i') : null;
      var steps = [].slice.call(list.children);
      steps.forEach(function (s) {
        var st = el('span', 'flow__stamp'); st.textContent = 'Done'; st.setAttribute('aria-hidden', 'true');
        s.appendChild(st);
      });
      if (reduce) {
        steps.forEach(function (s) { s.classList.add('is-on'); });
        if (rail) rail.style.setProperty('--fill', 1);
        list.style.setProperty('--fill', 1);
        return;
      }
      tasks.push(function () {
        var r = list.getBoundingClientRect(), vh = w.innerHeight;
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.35), 0, 1);
        if (rail) rail.style.setProperty('--fill', p.toFixed(4));
        list.style.setProperty('--fill', p.toFixed(4));
        var n = steps.length;
        steps.forEach(function (s, i) {
          s.classList.toggle('is-on', p > i / n);
          s.classList.toggle('is-done', p > (i + 1) / n);
        });
      });
    });
    schedule();
  }

  /* ============================================================
     BELTS - things that run sideways: the tyre tread and the makes
     strip. Driven by hand, one frame loop for all of them, and only
     while one is on screen. Scrolling pushes them all faster; scroll
     up and they run backwards, then settle back to their own pace.

     Not an endless WAAPI animation: run in reverse, one of those
     finishes when its clock reaches zero and never moves again, which
     is what a quick flick upwards on a phone did to the tread.
     ============================================================ */
  var belts = [], beltRaf = 0, beltLast = 0, rate = 1, target = 1;
  function beltFrame(t) {
    var dt = beltLast ? Math.min(t - beltLast, 50) : 16;
    beltLast = t;
    rate += (target - rate) * 0.08;
    target += (1 - target) * 0.05;
    var live = false;
    for (var i = 0; i < belts.length; i++) {
      var b = belts[i];
      if (!b.on || !b.len) continue;
      live = true;
      b.slow += (b.pace - b.slow) * 0.08;
      b.x = (b.x + b.speed * dt * rate * b.slow) % b.len;
      if (b.x < 0) b.x += b.len;
      b.el.style.transform = 'translate3d(' + (-b.x).toFixed(2) + 'px,0,0)';
    }
    beltRaf = live ? w.requestAnimationFrame(beltFrame) : 0;
    if (!live) beltLast = 0;
  }
  function beltWake() { if (!beltRaf) beltRaf = w.requestAnimationFrame(beltFrame); }
  /* el moves; host is watched for being on screen; measure() gives one loop's length */
  function belt(el, host, speed, measure) {
    var b = { el: el, speed: speed, x: 0, len: 0, on: false, pace: 1, slow: 1 };
    function size() { b.len = measure() || 0; }
    size();
    var rt;
    w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    belts.push(b);
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) {
        b.on = es[es.length - 1].isIntersecting;
        if (b.on) beltWake();
      }, { rootMargin: '80px 0px' }).observe(host);
    } else { b.on = true; beltWake(); }
    if (belts.length === 1) {
      tasks.push(function (y, v) {
        if (!v) return;
        target = clamp(1 + Math.abs(v) * 0.35, 1, 9) * (v < 0 ? -1 : 1);
        beltWake();
      });
    }
    return b;
  }

  /* ============================================================
     THE ROAD - tread that rolls, faster while you scroll
     ============================================================ */
  function tread() {
    var bands = [].slice.call(d.querySelectorAll('.road__tread'));
    if (!bands.length) return;
    function near(b) {
      b.classList.add('is-near');
      var band = b.querySelector('i');
      /* ratio: one tile's width for each unit of band height */
      var ratio = parseFloat(b.getAttribute('data-ratio')) || 3.2;
      function tile() {
        var tw = Math.round((band.offsetHeight || 600) * ratio);
        band.style.setProperty('--tw', tw + 'px');
        return tw;
      }
      if (reduce) { tile(); return; }
      /* a phone's band is short, so its tiles are small: run it a little
         quicker there or the movement is too slight to notice */
      belt(band, b, finePointer ? 0.055 : 0.075, tile);
    }
    if (!('IntersectionObserver' in w)) { bands.forEach(near); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); near(e.target); } });
    }, { rootMargin: '600px 0px' });
    bands.forEach(function (b) { io.observe(b); });
  }

  /* ============================================================
     MAKES STRIP - the marks run across under the tread
     ============================================================ */
  function makesBelt() {
    var host = d.querySelector('[data-makes-strip]');
    var track = host && host.querySelector('.belt__track');
    if (!track) return;
    if (reduce) { host.classList.add('is-still'); return; }
    var set = track.querySelector('.belt__set');
    var b = belt(track, host, 0.045, function () { return set.offsetWidth; });
    if (finePointer) {
      /* slows right down under the pointer, so a mark can be clicked */
      host.addEventListener('mouseenter', function () { b.pace = 0.2; });
      host.addEventListener('mouseleave', function () { b.pace = 1; });
    }
    /* a thumb on it stops it dead, at once - the belt may still be running
       fast from the scroll, and the mark must not slide out from under the
       finger before the tap lands. It picks up again after the finger lifts. */
    var resume = 0;
    host.addEventListener('touchstart', function () { clearTimeout(resume); b.pace = 0; b.slow = 0; }, { passive: true });
    host.addEventListener('touchend', function () { resume = setTimeout(function () { b.pace = 1; }, 1200); }, { passive: true });
    host.addEventListener('focusin', function (e) {
      /* only the keyboard: a tap focuses the link too, and moving the belt
         then would slide the mark out from under the finger before the click */
      var kb = true;
      try { kb = e.target.matches(':focus-visible'); } catch (er) {}
      if (!kb) return;
      b.pace = 0; b.slow = 0;   /* a focused mark stands still */
      /* bring the focused mark into view: set the belt so it sits a little in from the left */
      var a = e.target.closest('.belt__i');
      if (a) b.x = Math.max(0, a.offsetLeft - 24) % (b.len || 1);
      host.scrollLeft = 0;   /* the browser's own scroll-into-view would fight the belt */
      beltWake();
    });
    host.addEventListener('focusout', function () { b.pace = 1; });
  }

  /* ============================================================
     THE CLOSE - the bay light comes on
     ============================================================ */
  function closeLight() {
    var sec = d.querySelector('.cta--bay');
    if (!sec) return;
    if (reduce || !('IntersectionObserver' in w)) { sec.classList.add('is-lit'); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { sec.classList.add('is-lit'); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(sec);
  }

  /* ============================================================
     GLARE - light follows the pointer across a service card
     ============================================================ */
  function glare() {
    var grid = d.querySelector('[data-svc-grid]');
    if (!grid || reduce) return;
    if (!finePointer) {
      /* on a phone the light runs down each card as it passes the middle of the screen */
      var cards = [].slice.call(grid.querySelectorAll('.svc'));
      tasks.push(function () {
        var vh = w.innerHeight;
        cards.forEach(function (c) {
          var r = c.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) { c.classList.remove('is-lit'); return; }
          var p = clamp((vh * 0.75 - r.top) / (r.height + vh * 0.25), 0, 1);
          c.style.setProperty('--gx', '50%');
          c.style.setProperty('--gy', (p * 120 - 10).toFixed(1) + '%');
          c.classList.toggle('is-lit', p > 0 && p < 1);
        });
      });
      schedule();
      return;
    }
    grid.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.svc');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      c.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* ============================================================
     INTERLUDES - a tyre wall, and the trade's words across it
       <div data-interlude="rims" data-words="Restore|Maintain|Enhance">
     Without data-words, the top row is each service's Swahili name and
     the bottom row its English one.
     ============================================================ */
  function interludes() {
    var V = w.VIWANDA || {};
    [].forEach.call(d.querySelectorAll('[data-interlude]'), function (box) {
      var name = box.getAttribute('data-interlude');
      box.classList.add('interlude', 'on-ink');
      box.setAttribute('aria-hidden', 'true');
      var bg = el('div', 'interlude__bg');
      var pic = el('picture');
      var so = el('source'); so.type = 'image/webp';
      so.srcset = '/viwanda-automotive-site/images/garage/spann/' + name + '-900.webp 900w, /viwanda-automotive-site/images/garage/spann/' + name + '-1600.webp 1600w';
      so.sizes = '100vw';
      var im = new Image(); im.alt = ''; im.decoding = 'async'; im.loading = 'lazy';
      im.src = '/viwanda-automotive-site/images/garage/spann/' + name + '-900.jpg';
      pic.appendChild(so); pic.appendChild(im); bg.appendChild(pic);
      box.appendChild(bg);

      var custom = box.getAttribute('data-words');
      var top, bottom;
      if (custom) { top = custom.split('|'); bottom = top.slice().reverse(); }
      else {
        var sv = V.activeServices || [];
        top = sv.map(function (s) { return s.sw; });
        bottom = sv.map(function (s) { return s.name.replace(/&amp;/g, '&'); });
      }
      function row(words, styles) {
        var r = el('p', 'interlude__row');
        for (var rep = 0; rep < 3; rep++) words.forEach(function (t, i) {
          var s = el('span', styles[i % styles.length]); s.textContent = t; r.appendChild(s);
          var dt = el('span', 'dot'); dt.textContent = '·'; r.appendChild(dt);
        });
        box.appendChild(r);
        return r;
      }
      var r1 = row(top, ['o', 'g']);
      var r2 = row(bottom, ['w', 'o']);
      if (reduce) return;
      tasks.push(function () {
        var b = box.getBoundingClientRect(), vh = w.innerHeight, vw = w.innerWidth;
        if (b.bottom < -50 || b.top > vh + 50) return;
        var p = clamp((vh - b.top) / (vh + b.height), 0, 1);
        r1.style.setProperty('--wx', (-vw * 0.15 - p * vw * 0.55).toFixed(1) + 'px');
        r2.style.setProperty('--wx', (-vw * 0.9 + p * vw * 0.55).toFixed(1) + 'px');
        im.style.setProperty('--py', ((p - 0.5) * -14).toFixed(2) + '%');
      });
    });
    schedule();
  }

  /* ============================================================
     THE ROLLING WHEEL
       <div data-roll></div>
     ============================================================ */
  function roll() {
    [].forEach.call(d.querySelectorAll('[data-roll]'), function (box) {
      box.classList.add('roll');
      box.setAttribute('aria-hidden', 'true');
      box.appendChild(el('div', 'roll__track'));
      box.appendChild(el('div', 'roll__shadow'));
      var wh = el('div', 'roll__wheel');
      var pic = el('picture'), so = el('source');
      so.type = 'image/webp'; so.srcset = '/viwanda-automotive-site/images/garage/spann/wheel-cut.webp';
      var im = new Image(); im.alt = ''; im.decoding = 'async'; im.loading = 'lazy';
      im.src = '/viwanda-automotive-site/images/garage/spann/wheel-cut.png';
      pic.appendChild(so); pic.appendChild(im); wh.appendChild(pic); box.appendChild(wh);
      if (reduce) return;
      tasks.push(function () {
        var b = box.getBoundingClientRect(), vh = w.innerHeight, vw = box.clientWidth;
        if (b.bottom < -20 || b.top > vh + 20) return;
        var h = wh.offsetHeight || 100;
        var p = clamp((vh - b.top) / (vh + b.height), 0, 1);
        var x = -h + p * (vw + h);
        box.style.setProperty('--rx', x.toFixed(1) + 'px');
        box.style.setProperty('--rr', (x / (Math.PI * h) * 360).toFixed(1) + 'deg');
        box.style.setProperty('--tx', Math.max(0, x + h / 2).toFixed(1) + 'px');
      });
    });
    schedule();
  }

  /* the gear watermark in shaded sections turns with the page */
  function watermark() {
    if (reduce || !d.querySelector('.section--sunk')) return;
    tasks.push(function (y) { html.style.setProperty('--page-rot', (y * 0.05).toFixed(2) + 'deg'); });
  }

  /* a work-lamp that follows the pointer across the dark bands */
  function torch() {
    if (reduce) return;
    [].forEach.call(d.querySelectorAll('.hero--bay, .pagehead--bay, .promise--wheel, .engine, .road--tread, .interlude, .cta--bay'), function (sec) {
      var t = el('i', 'torch');
      t.setAttribute('aria-hidden', 'true');
      sec.appendChild(t);
      if (!finePointer) {
        /* no pointer to follow on a phone: the lamp sweeps across the band as it scrolls past */
        tasks.push(function () {
          var r = sec.getBoundingClientRect(), vh = w.innerHeight;
          var on = r.bottom > 0 && r.top < vh;
          t.classList.toggle('is-on', on);
          if (!on) return;
          var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
          t.style.setProperty('--tx', (15 + p * 70).toFixed(1) + '%');
          t.style.setProperty('--ty', (20 + p * 60).toFixed(1) + '%');
        });
        schedule();
        return;
      }
      sec.addEventListener('pointermove', function (e) {
        var r = sec.getBoundingClientRect();
        t.style.setProperty('--tx', (e.clientX - r.left).toFixed(0) + 'px');
        t.style.setProperty('--ty', (e.clientY - r.top).toFixed(0) + 'px');
        t.classList.add('is-on');
      });
      sec.addEventListener('pointerleave', function () { t.classList.remove('is-on'); });
    });
  }

  /* ============================================================
     HEADLINES THAT ARRIVE - each word rises out of its own mask once
     the intro or the bay light has cleared
     ============================================================ */
  var stageCbs = [], stageReady = false;
  function onStage(fn) { if (stageReady) fn(); else stageCbs.push(fn); }
  function stageClear() {
    if (stageReady) return;
    stageReady = true;
    stageCbs.forEach(function (f) { f(); });
  }
  function splitWords(h) {
    var i = 0;
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = d.createDocumentFragment();
          parts.forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(t)); return; }
            var o = el('span', 'hw'), inner = el('span');
            inner.textContent = t;
            inner.style.setProperty('--i', i++);
            o.appendChild(inner); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(h);
  }
  function headlines() {
    var hs = d.querySelectorAll('.hero--bay .hero__h, .pagehead--bay .pagehead__h');
    if (!hs.length || reduce) { stageClear(); return; }
    [].forEach.call(hs, function (h) { splitWords(h); h.classList.add('hw-ready'); });
    onStage(function () {
      w.requestAnimationFrame(function () { [].forEach.call(hs, function (h) { h.classList.add('is-in'); }); });
    });
    if (!pendingStage) stageClear();
  }

  /* ============================================================
     SERVICES - each band's Swahili name, huge and outlined, drifting
     behind it as you scroll
     ============================================================ */
  function ghosts() {
    [].forEach.call(d.querySelectorAll('.band'), function (band, i) {
      var e = band.querySelector('.band__e');
      if (!e) return;
      var word = (e.textContent.split(/\u2014|-/)[1] || '').trim();
      if (!word) return;
      var g = el('span', 'band__ghost');
      g.setAttribute('aria-hidden', 'true');
      g.textContent = word;
      band.insertBefore(g, band.firstChild);
      if (reduce) return;
      var dir = i % 2 ? 1 : -1;
      tasks.push(function () {
        var r = band.getBoundingClientRect(), vh = w.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        g.style.setProperty('--gx', (dir * (p - 0.5) * 22).toFixed(2) + 'vw');
      });
    });
    schedule();
  }

  /* ============================================================
     BEFORE AND AFTER - each wipe sweeps itself as you scroll past,
     until you take hold of it
     ============================================================ */
  function autoWipe() {
    if (reduce) return;
    [].forEach.call(d.querySelectorAll('[data-ba], .ba'), function (fig) {
      var range = fig.querySelector('.ba__range');
      if (!range || fig.__auto) return;
      fig.__auto = true;
      var held = false;
      function hold() { held = true; }
      fig.addEventListener('pointerdown', hold);
      range.addEventListener('keydown', hold);
      range.addEventListener('focus', hold);
      tasks.push(function () {
        if (held) return;
        var r = fig.getBoundingClientRect(), vh = w.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        var p = clamp((vh * 0.9 - r.top) / (vh * 0.9), 0, 1);
        var v = 92 - p * 74;
        range.value = v.toFixed(1);
        range.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    schedule();
  }

  /* ============================================================
     MAKES - every badge is a way in: the quote form, make chosen
     ============================================================ */
  function makesLinks() {
    var V = w.VIWANDA || {};
    var known = V.makes || [];
    [].forEach.call(d.querySelectorAll('.makes .make'), function (li) {
      var n = li.querySelector('.make__n');
      var name = n && n.textContent.trim();
      var match = known.filter(function (m) { return m.toLowerCase() === (name || '').toLowerCase(); })[0];
      if (!match || li.querySelector('a')) return;
      var a = el('a', 'make__a');
      a.href = '/viwanda-automotive-site/book.html?make=' + encodeURIComponent(match);
      a.setAttribute('aria-label', 'Get a quote for a ' + match);
      while (li.firstChild) a.appendChild(li.firstChild);
      var cue = el('span', 'make__cue'); cue.textContent = 'Quote'; cue.setAttribute('aria-hidden', 'true');
      a.appendChild(cue);
      li.appendChild(a);
    });
  }

  /* ============================================================
     CLIENTS - the knockouts take their own colours under a pointer
     ============================================================ */
  function clientColour() {
    if (!finePointer) return;
    d.addEventListener('mouseover', function (e) {
      var i = e.target.closest && e.target.closest('.logowall__i');
      if (!i || i.classList.contains('is-colour')) return;
      var img = i.querySelector('img');
      if (!img || img.src.indexOf('/clients/mono/') < 0) return;
      var mono = img.src, colour = mono.replace('/clients/mono/', '/clients/');
      var pre = new Image();
      pre.onload = function () {
        img.src = colour; i.classList.add('is-colour');
        i.addEventListener('mouseleave', function back() {
          img.src = mono; i.classList.remove('is-colour'); i.removeEventListener('mouseleave', back);
        });
      };
      pre.src = colour;
    });
  }

  /* nothing loops while it is off screen (the belts stop themselves) */
  function pauseOffscreen() {
    if (!('IntersectionObserver' in w)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); });
    }, { rootMargin: '120px 0px' });
    [].forEach.call(d.querySelectorAll('.hero--bay, .pagehead--bay, .interlude, .road__tread, .engine'), function (s) { io.observe(s); });
  }

  function boot() {
    intro();
    bay();
    pageHeads();
    overInk();
    jump();
    lightbox();
    interludes();
    roll();
    watermark();
    heroWall();
    torch();
    headlines();
    ghosts();
    autoWipe();
    makesLinks();
    clientColour();
    pauseOffscreen();
    wheel();
    engine();
    jobcard();
    tread();
    makesBelt();
    closeLight();
    glare();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);
