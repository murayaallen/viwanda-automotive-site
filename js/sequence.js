/* ============================================================
   VIWANDA AUTOMOTIVE - sequence.js
   A frame sequence scrubbed by scroll: the car assembles as you
   read, and reverses when you scroll back.

   Markup:
     <div class="seq" data-seq="/viwanda-automotive-site/images/hero/assembly" data-seq-count="48"
          data-seq-ext="webp" data-seq-pad="3" style="--seq-ratio:16/9">
       <canvas class="seq__c"></canvas>
       <noscript><img src="/viwanda-automotive-site/images/hero/assembly/048.webp" alt="..."></noscript>
     </div>

   Why a sequence and not a video:
     - scrubbing video by scroll is unreliable on mobile Safari, which
       refuses to seek smoothly and often will not decode off-screen
     - a sequence reverses, which video cannot do without re-decoding
     - individual frames can be lazy-loaded and the first frame is a
       normal image, so the page is never blank waiting on a decoder

   Degrades in this order: scroll-scrubbed -> first and last frame only
   (reduced motion) -> a single static frame (no canvas, no JS).
   ============================================================ */
(function (w, d) {
  'use strict';

  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build(host) {
    var base = host.getAttribute('data-seq');
    var count = parseInt(host.getAttribute('data-seq-count'), 10) || 0;
    var ext = host.getAttribute('data-seq-ext') || 'webp';
    var pad = parseInt(host.getAttribute('data-seq-pad'), 10) || 3;
    if (!base || count < 2) return;

    var canvas = host.querySelector('canvas');
    if (!canvas) return;
    var ctx = null;
    try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
    if (!ctx) return;                       /* no 2D context: the <noscript> frame stands */

    function url(i) {
      var n = String(i + 1);
      while (n.length < pad) n = '0' + n;
      return base + '/' + n + '.' + ext;
    }

    var frames = new Array(count);
    var loaded = 0;
    var current = -1;
    var pending = 0;

    function draw(i) {
      var img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      var dpr = Math.min(w.devicePixelRatio || 1, 2);
      var r = host.getBoundingClientRect();
      var cw = Math.max(1, Math.round(r.width));
      var ch = Math.max(1, Math.round(r.height));
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr; canvas.height = ch * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      /* contain, so no part of the car is ever cropped off */
      var s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      current = i;
    }

    function load(i, then) {
      if (frames[i]) { if (then) then(); return; }
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { loaded++; if (then) then(); };
      img.onerror = function () { loaded++; };
      img.src = url(i);
      frames[i] = img;
    }

    /* first and last immediately: the still frame and the payoff */
    load(0, function () { draw(0); host.classList.add('is-ready'); });
    load(count - 1);

    if (reduce) return;                     /* two frames is the whole story */

    /* the rest once the host is near the viewport, in display order so the
       early frames are ready before the user can reach them */
    function loadRest() {
      var i = 0;
      (function next() {
        while (i < count && frames[i]) i++;
        if (i >= count) return;
        load(i, next);
      })();
    }

    function show(p) {
      var i = Math.max(0, Math.min(count - 1, Math.round(p * (count - 1))));
      if (i === current) return;
      if (frames[i] && frames[i].complete && frames[i].naturalWidth) draw(i);
      else if (!pending) { pending = 1; load(i, function () { pending = 0; draw(i); }); }
    }

    var ticking = false;
    function onScroll() {
      ticking = false;
      var r = host.getBoundingClientRect();
      var vh = w.innerHeight;
      /* 0 when the host's top reaches the bottom of the screen,
         1 when its bottom reaches the top */
      var p = (vh - r.top) / (vh + r.height);
      show(Math.max(0, Math.min(1, p)));
    }
    function schedule() {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }

    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          loadRest();
          io.disconnect();
        });
      }, { rootMargin: '400px' });
      io.observe(host);
    } else { loadRest(); }

    w.addEventListener('scroll', schedule, { passive: true });
    w.addEventListener('resize', function () { current = -1; schedule(); }, { passive: true });
    schedule();
  }

  function init() {
    var hosts = d.querySelectorAll('[data-seq]');
    for (var i = 0; i < hosts.length; i++) build(hosts[i]);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();

  w.VI = w.VI || {};
  w.VI.sequence = { init: init };
})(window, document);
