/* ============================================================
   VIWANDA AUTOMOTIVE - makes.js        GENERATED, do not hand-edit
   Source: tools/build_makes.py   ->   python tools/build_makes.py

   The manufacturer wall. Every badge is a single-tone line mark on a
   64x64 grid, drawn in currentColor so it takes the page's own ink -
   these are our renderings for the purpose of saying which makes come
   through the bay, not the manufacturers' artwork.

   Four makes render as type rather than a badge, because that is what
   their marks actually are: Ford and Land Rover a name in an oval,
   Isuzu and Suzuki a name set plain.

   Mounts itself on [data-makes]. Also exposed as VI.makesHtml().
   ============================================================ */
(function (w, d) {
  'use strict';

  var MAKES = [
    { id: 'toyota',
      name: 'Toyota',
      f: [
        'M1 32a31 20.5 0 1 0 62 0a31 20.5 0 1 0 -62 0ZM5.2 32a26.8 16.3 0 1 0 53.6 0a26.8 16.3 0 1 0 -53.6 0Z',
        'M10.5 34a21.5 6.4 0 1 0 43 0a21.5 6.4 0 1 0 -43 0ZM14.5 34a17.5 2.4 0 1 0 35 0a17.5 2.4 0 1 0 -35 0Z',
        'M21.2 26.5a10.8 14.6 0 1 0 21.6 0a10.8 14.6 0 1 0 -21.6 0ZM25.4 26.5a6.6 10.4 0 1 0 13.2 0a6.6 10.4 0 1 0 -13.2 0Z'] },
    { id: 'nissan',
      name: 'Nissan',
      f: [
        'M2 32a30 30 0 1 0 60 0a30 30 0 1 0 -60 0ZM5.6 32a26.4 26.4 0 1 0 52.8 0a26.4 26.4 0 1 0 -52.8 0Z',
        'M1 29.2L63 29.2L63 34.8L1 34.8Z'] },
    { id: 'mazda',
      name: 'Mazda',
      f: [
        'M1 32a31 19.5 0 1 0 62 0a31 19.5 0 1 0 -62 0ZM4.4 32a27.6 16.1 0 1 0 55.2 0a27.6 16.1 0 1 0 -55.2 0Z'],
      s: [
        'M11.8 16.4C11.8 19.9 14 21.8 17.4 21.8C24.6 21.8 28.6 28.6 32 34.6',
        'M52.2 16.4C52.2 19.9 50 21.8 46.6 21.8C39.4 21.8 35.4 28.6 32 34.6'],
      sw: 3.4 },
    { id: 'subaru',
      name: 'Subaru',
      f: [
        'M1 32a31 18.5 0 1 0 62 0a31 18.5 0 1 0 -62 0ZM4 32a28 15.5 0 1 0 56 0a28 15.5 0 1 0 -56 0Z',
        'M17.6 23.4L19.84 29.76L26.2 32L19.84 34.24L17.6 40.6L15.36 34.24L9 32L15.36 29.76Z',
        'M31 21.3L32.12 24.48L35.3 25.6L32.12 26.72L31 29.9L29.88 26.72L26.7 25.6L29.88 24.48Z',
        'M41 21.3L42.12 24.48L45.3 25.6L42.12 26.72L41 29.9L39.88 26.72L36.7 25.6L39.88 24.48Z',
        'M31 34.1L32.12 37.28L35.3 38.4L32.12 39.52L31 42.7L29.88 39.52L26.7 38.4L29.88 37.28Z',
        'M41 34.1L42.12 37.28L45.3 38.4L42.12 39.52L41 42.7L39.88 39.52L36.7 38.4L39.88 37.28Z',
        'M49 27.7L50.12 30.88L53.3 32L50.12 33.12L49 36.3L47.88 33.12L44.7 32L47.88 30.88Z'] },
    { id: 'mitsubishi',
      name: 'Mitsubishi',
      f: [
        'M32 28.8L41.6 15.4L32 2L22.4 15.4Z',
        'M34.77 33.6L41.58 48.61L57.98 47L51.18 31.99Z',
        'M29.23 33.6L12.82 31.99L6.02 47L22.42 48.61Z'] },
    { id: 'isuzu',
      name: 'Isuzu',
      word: 'plain' },
    { id: 'honda',
      name: 'Honda',
      f: [
        'M7.71 16.96Q7 11 13 11L51 11Q57 11 56.29 16.96L52.71 47.04Q52 53 46 53L18 53Q12 53 11.29 47.04ZM12.1 19.37Q11.6 15.4 15.6 15.4L48.4 15.4Q52.4 15.4 51.9 19.37L48.7 44.63Q48.2 48.6 44.2 48.6L19.8 48.6Q15.8 48.6 15.3 44.63Z',
        'M19 18L25 18L25 27L39 27L39 18L45 18L45 46L39 46L39 37L25 37L25 46L19 46Z'] },
    { id: 'suzuki',
      name: 'Suzuki',
      word: 'plain' },
    { id: 'volkswagen',
      name: 'Volkswagen',
      f: [
        'M2 32a30 30 0 1 0 60 0a30 30 0 1 0 -60 0ZM5.4 32a26.6 26.6 0 1 0 53.2 0a26.6 26.6 0 1 0 -53.2 0Z'],
      s: [
        'M19 13.5L32 31L45 13.5',
        'M16 34L23.5 52L32 40L40.5 52L48 34'],
      sw: 4.4 },
    { id: 'mercedes-benz',
      name: 'Mercedes-Benz',
      f: [
        'M2 32a30 30 0 1 0 60 0a30 30 0 1 0 -60 0ZM5 32a27 27 0 1 0 54 0a27 27 0 1 0 -54 0Z'],
      s: [
        'M32 32L32 6.5',
        'M32 32L54.08 44.75',
        'M32 32L9.92 44.75'],
      sw: 3.4 },
    { id: 'bmw',
      name: 'BMW',
      f: [
        'M2 32a30 30 0 1 0 60 0a30 30 0 1 0 -60 0ZM7 32a25 25 0 1 0 50 0a25 25 0 1 0 -50 0Z',
        'M32 32L7 32A25 25 0 0 1 32 7Z',
        'M32 32L57 32A25 25 0 0 1 32 57Z'] },
    { id: 'land-rover',
      name: 'Land Rover',
      word: 'oval' },
    { id: 'ford',
      name: 'Ford',
      word: 'oval' }
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* One badge. aria-hidden because the name sits beside it as real text. */
  function svg(m) {
    var body = '';
    if (m.f) {
      body += '<g fill="currentColor" fill-rule="evenodd">' +
        m.f.map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</g>';
    }
    if (m.s) {
      body += '<g fill="none" stroke="currentColor" stroke-width="' + (m.sw || 4) +
        '" stroke-linecap="round" stroke-linejoin="round">' +
        m.s.map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</g>';
    }
    return '<svg class="make__mark" viewBox="0 0 64 64" width="64" height="64" ' +
      'aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  /* the badge alone: a drawn mark, or the name in an oval / in type */
  function art(m) {
    return m.word
      ? '<span class="make__word make__word--' + m.word + '" aria-hidden="true">' +
          esc(m.name) + '</span>'
      : svg(m);
  }

  function cell(m) {
    return '<li class="make" data-anim="up">' + art(m) +
      '<span class="make__n">' + esc(m.name) + '</span></li>';
  }

  function makesHtml(opts) {
    opts = opts || {};
    var list = MAKES;
    if (opts.only) {
      list = MAKES.filter(function (m) { return opts.only.indexOf(m.id) > -1; });
    }
    return list.map(cell).join('');
  }

  w.VI = w.VI || {};
  w.VI.makes = MAKES;
  w.VI.makesHtml = makesHtml;
  w.VI.makeArt = art;
  w.VI.makeByName = function (name) {
    for (var i = 0; i < MAKES.length; i++) if (MAKES[i].name === name) return MAKES[i];
    return null;
  };

  function mount() {
    var els = d.querySelectorAll('[data-makes]');
    for (var i = 0; i < els.length; i++) {
      var only = els[i].getAttribute('data-makes');
      els[i].classList.add('reveal-parent');
      els[i].innerHTML = makesHtml(only ? { only: only.split(/\s*,\s*/) } : null);
    }
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window, document);
