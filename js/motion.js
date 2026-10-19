/* ============================================================
   VIWANDA AUTOMOTIVE - motion.js
   Loads last, so it observes everything the page scripts injected.

   One requestAnimationFrame loop drives every scroll-coupled module;
   IntersectionObserver drives everything that only needs to fire once.
   Per-frame cost is transform and opacity only - no animated blur, no
   layout-triggering properties, no shadow transitions.

   Modules            attribute
     reveal           data-anim="up|left|right|scale|fade"
     split text       data-split="words|chars"
     parallax         data-parallax="0.12"
     scrub            data-scrub   (0..1 progress into --p)
     marquee          .marquee     (drifts, and follows scroll velocity)
     tilt             data-tilt
     sticky steps     data-steps
     lamp strike      data-lamp
     sweep            data-sweep
     chrome           .scroll-progress, header solidify

   EVERY module no-ops under prefers-reduced-motion: reduce. On a cheap
   Android a dropped frame reads as "broken", not "elegant".
   ============================================================ */
(function (w, d) {
  'use strict';

  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tasks = [];                 // run once per frame while scrolling
  var lastY = w.scrollY || 0;
  var velocity = 0;
  var ticking = false;
  var always = false;

  /* motion.js is alive, so the blank-page failsafe is not needed */
  w.__vaMotion = true;
  if (w.__vaFailsafe) { clearTimeout(w.__vaFailsafe); w.__vaFailsafe = null; }

  function onFrame() {
    ticking = false;
    var y = w.scrollY || 0;
    velocity = y - lastY;
    lastY = y;
    for (var i = 0; i < tasks.length; i++) tasks[i](y, velocity);
    if (Math.abs(velocity) > 0.08 || always) schedule();
  }
  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }
  function addTask(fn) { tasks.push(fn); }

  if (!reduce) {
    w.addEventListener('scroll', schedule, { passive: true });
    w.addEventListener('resize', schedule, { passive: true });
  }

  /* ---------- 1. reveal ---------- */
  function initReveal() {
    var els = d.querySelectorAll('[data-anim]');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in w)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var parent = el.closest ? el.closest('.reveal-parent') : null;
        if (parent) {
          var sibs = parent.querySelectorAll('[data-anim]');
          var n = Array.prototype.indexOf.call(sibs, el);
          if (n > 0) el.style.transitionDelay = Math.min(n * 40, 360) + 'ms';
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    for (var j = 0; j < els.length; j++) {
      /* anything already on screen reveals at once, so the first frame is
         never a blank page waiting on a scroll that may never come */
      if (els[j].getBoundingClientRect().top < w.innerHeight * 0.94) els[j].classList.add('in');
      else io.observe(els[j]);
    }
  }

  /* ---------- 2. split text ---------- */
  function initSplit() {
    var els = d.querySelectorAll('[data-split]');
    if (!els.length) return;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.dataset.splitDone) continue;
      var mode = el.getAttribute('data-split') || 'words';
      var text = el.textContent;
      var parts = mode === 'chars' ? text.split('') : text.split(/(\s+)/);
      var html = '';
      var n = 0;
      parts.forEach(function (p) {
        if (/^\s+$/.test(p)) { html += p; return; }
        html += '<span class="sp"><span class="sp__i" style="transition-delay:' +
                (n * (mode === 'chars' ? 18 : 42)) + 'ms">' + p + '</span></span>';
        n++;
      });
      el.innerHTML = html;
      el.dataset.splitDone = '1';
    }
    if (reduce || !('IntersectionObserver' in w)) {
      for (var k = 0; k < els.length; k++) els[k].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    for (var m = 0; m < els.length; m++) {
      if (els[m].getBoundingClientRect().top < w.innerHeight * 0.94) els[m].classList.add('in');
      else io.observe(els[m]);
    }
  }

  /* ---------- 3. parallax ---------- */
  function initParallax() {
    if (reduce) return;
    var els = Array.prototype.slice.call(d.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    addTask(function () {
      var vh = w.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var amt = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (-mid * amt).toFixed(2) + 'px,0)';
      });
    });
    schedule();
  }

  /* ---------- 4. scrub: writes 0..1 progress into --p ---------- */
  function initScrub() {
    if (reduce) return;
    var els = Array.prototype.slice.call(d.querySelectorAll('[data-scrub]'));
    if (!els.length) return;
    addTask(function () {
      var vh = w.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = 1 - (r.top + r.height) / (vh + r.height);
        el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
      });
    });
    schedule();
  }

  /* ---------- 6. marquee: drifts, and follows scroll ---------- */
  function initMarquee() {
    var els = Array.prototype.slice.call(d.querySelectorAll('.marquee'));
    if (!els.length || reduce) return;
    var state = els.map(function (el) {
      var row = el.querySelector('.marquee__row');
      if (row && row.children.length) row.innerHTML += row.innerHTML;  // seamless loop
      return { el: el, row: row, x: 0, w: row ? row.scrollWidth / 2 : 0 };
    });
    always = true;
    addTask(function (y, v) {
      state.forEach(function (s) {
        if (!s.row) return;
        if (!s.w) s.w = s.row.scrollWidth / 2;
        s.x -= 0.35 + Math.min(5, Math.abs(v) * 0.1) * (v < 0 ? -1 : 1) * 0.6;
        if (s.x <= -s.w) s.x += s.w;
        if (s.x > 0) s.x -= s.w;
        s.row.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,0,0)';
      });
    });
    schedule();
  }

  /* ---------- 7. tilt ---------- */
  function initTilt() {
    if (reduce || w.matchMedia('(hover: none)').matches) return;
    var els = d.querySelectorAll('[data-tilt]');
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        var max = parseFloat(el.getAttribute('data-tilt')) || 6;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(700px) rotateY(' + (x * max) +
                               'deg) rotateX(' + (-y * max) + 'deg)';
          el.style.setProperty('--mx', (x * 100 + 50).toFixed(1) + '%');
          el.style.setProperty('--my', (y * 100 + 50).toFixed(1) + '%');
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      })(els[i]);
    }
  }

  /* ---------- 8. sticky steps ---------- */
  function initSteps() {
    var hosts = d.querySelectorAll('[data-steps]');
    if (!hosts.length || reduce) return;
    for (var i = 0; i < hosts.length; i++) {
      (function (host) {
        var items = Array.prototype.slice.call(host.querySelectorAll('[data-step]'));
        if (!items.length) return;
        addTask(function () {
          var focal = w.innerHeight * 0.45, best = 0, bd = 1e9;
          items.forEach(function (el, n) {
            var r = el.getBoundingClientRect();
            var dist = Math.abs(r.top + r.height / 2 - focal);
            if (dist < bd) { bd = dist; best = n; }
          });
          items.forEach(function (el, n) { el.classList.toggle('is-on', n === best); });
          host.style.setProperty('--step', best);
        });
      })(hosts[i]);
    }
    schedule();
  }

  /* ---------- 9. lamp strike ---------- */
  function initLamp() {
    var els = d.querySelectorAll('[data-lamp]');
    if (!els.length) return;
    if (reduce) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('lit');
      return;
    }
    if (!('IntersectionObserver' in w)) {
      for (var k = 0; k < els.length; k++) els[k].classList.add('lit');
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('lit'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }


  /* ---------- 9b. pinned scroll story ----------
     A tall stage with a sticky pin inside it. Scroll progress through
     the stage is banded into one step per stage; the stacked photos
     crossfade and the copy swaps to match. Ported from the Spann Tyres
     explode section and generalised.

     Under reduced motion the pin is released in CSS and every stage is
     simply shown in order, so the content is all still there. */
  function initStory() {
    var hosts = d.querySelectorAll('[data-story]');
    if (!hosts.length || reduce) return;
    for (var h = 0; h < hosts.length; h++) {
      (function (stage) {
        var shots = stage.querySelectorAll('[data-shot]');
        var msgs = stage.querySelectorAll('[data-msg]');
        var dots = stage.querySelectorAll('[data-dot]');
        var tag = stage.querySelector('[data-story-tag]');
        var tags = (w.VIWANDA && w.VIWANDA.stages) || [];
        var n = Math.max(shots.length, msgs.length);
        if (!n) return;
        var cur = -1;

        addTask(function () {
          var r = stage.getBoundingClientRect();
          var vh = w.innerHeight;
          if (r.bottom < 0 || r.top > vh) return;
          var span = r.height - vh;
          var p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 0;
          var i = Math.min(n - 1, Math.floor(p * n));
          if (i !== cur) {
            cur = i;
            for (var k = 0; k < shots.length; k++) shots[k].classList.toggle('is-on', k === i);
            for (var m = 0; m < msgs.length; m++) msgs[m].classList.toggle('is-on', m === i);
            for (var q = 0; q < dots.length; q++) dots[q].classList.toggle('is-on', q <= i);
            if (tag && tags[i]) tag.textContent = tags[i].tag;
          }
          /* a shallow drift on the live photo, never enough to crop tight */
          var live = shots[i];
          if (live) live.style.setProperty('--z', (1.012 + 0.04 * p).toFixed(4));
        });
      })(hosts[h]);
    }
    schedule();
  }

  /* ---------- 10. chrome: progress hairline + header ---------- */
  function initChrome() {
    var bar = d.querySelector('.scroll-progress i');
    var hdr = d.querySelector('[data-header-el]');
    if (!bar && !hdr) return;
    addTask(function (y) {
      if (bar) {
        var h = d.documentElement.scrollHeight - w.innerHeight;
        var p = h > 0 ? y / h : 0;
        bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, p)).toFixed(4) + ')';
      }
      if (hdr) hdr.classList.toggle('is-stuck', y > 12);
    });
    schedule();
    tasks[tasks.length - 1](w.scrollY || 0, 0);
  }

  var SDA = !reduce && w.CSS && CSS.supports &&
            CSS.supports('animation-timeline', 'view()');

  function boot() {
    /* Where the browser can drive the reveal from the scroll itself, let it:
       it runs on the compositor and costs no main-thread work. motion.js
       then skips its own reveal pass entirely. */
    if (SDA) d.documentElement.classList.add('sda');
    if (!SDA) initReveal(); initSplit(); initParallax(); initScrub();
    initMarquee(); initTilt(); initSteps();
    initLamp(); initStory(); initChrome();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

  w.VI = w.VI || {};
  w.VI.motion = { schedule: schedule, addTask: addTask, reduce: reduce };
})(window, document);
