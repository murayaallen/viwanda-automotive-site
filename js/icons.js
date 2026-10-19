/* ============================================================
   VIWANDA AUTOMOTIVE - icons.js
   Inline SVG set on a 24x24 grid. Stroke icons use currentColor at
   1.75 so they sit with Inter at body weight; the gear and the star
   are filled because they are shapes, not line drawings.

   Usage:  <span data-icon="wrench"></span>   then  hydrateIcons()
   or:     VI.icon('wrench', { size: 20, cls: 'foo' })
   ============================================================ */
(function (w, d) {
  'use strict';

  /* The gear is generated geometry (8 teeth), not drawn by hand, so it
     matches the emblem's construction. See tools/emblem_svg.py. */
  var GEAR8 = 'M18.59 10.80L18.69 11.60L18.69 12.40L18.59 13.20L21.08 14.03L20.59 15.56' +
    'L19.85 16.98L17.51 15.81L17.01 16.44L16.44 17.01L15.81 17.51L16.98 19.85L15.56 20.59' +
    'L14.03 21.08L13.20 18.59L12.40 18.69L11.60 18.69L10.80 18.59L9.97 21.08L8.44 20.59' +
    'L7.02 19.85L8.19 17.51L7.56 17.01L6.99 16.44L6.49 15.81L4.15 16.98L3.41 15.56' +
    'L2.92 14.03L5.41 13.20L5.31 12.40L5.31 11.60L5.41 10.80L2.92 9.97L3.41 8.44' +
    'L4.15 7.02L6.49 8.19L6.99 7.56L7.56 6.99L8.19 6.49L7.02 4.15L8.44 3.41L9.97 2.92' +
    'L10.80 5.41L11.60 5.31L12.40 5.31L13.20 5.41L14.03 2.92L15.56 3.41L16.98 4.15' +
    'L15.81 6.49L16.44 6.99L17.01 7.56L17.51 8.19L19.85 7.02L20.59 8.44L21.08 9.97Z';

  /* s = stroke paths, f = filled paths */
  var ICONS = {

    /* ---- services ---- */
    gear:    { f: [GEAR8, 'M12 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z'], rule: 'evenodd' },
    wrench:  { s: ['M6.2 18.6 13.6 11.2'],
               f: ['M18.9 4.3a4.6 4.6 0 1 0 0 6.9L15 7.75Z'],
               w: 3 },
    spray:   { s: ['M13.4 4.2 20 7.6 17 13.6 10.4 10.2Z', 'M10.4 10.2 6.6 12.1',
                   'M5.2 15.3h.01', 'M4.2 18.2h.01', 'M7.1 17.4h.01'] },
    sparkle: { f: ['M12 2.6 13.75 10.25 21.4 12 13.75 13.75 12 21.4 10.25 13.75 2.6 12 10.25 10.25Z',
                   'M18.6 3.2 19.3 5.7 21.8 6.4 19.3 7.1 18.6 9.6 17.9 7.1 15.4 6.4 17.9 5.7Z'] },
    scan:    { s: ['M4 8.5V5.6A1.6 1.6 0 0 1 5.6 4h2.9', 'M15.5 4h2.9A1.6 1.6 0 0 1 20 5.6v2.9',
                   'M20 15.5v2.9a1.6 1.6 0 0 1-1.6 1.6h-2.9', 'M8.5 20H5.6A1.6 1.6 0 0 1 4 18.4v-2.9',
                   'M4 12h16'] },
    route:   { s: ['M6.6 10.4c0 4 3.4 4.4 5.4 5.4s4.4 1.6 5.4 3',
                   'M14.6 18.8h3.2v-3.2'],
               f: ['M6.6 3.4a3.2 3.2 0 0 0-3.2 3.2c0 2.4 3.2 5.4 3.2 5.4s3.2-3 3.2-5.4a3.2 3.2 0 0 0-3.2-3.2zm0 4.4a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z'] },
    key:     { s: ['M12.4 11.6 20.4 3.6', 'M17.2 6.8l2 2', 'M14.8 9.2l2 2'],
               f: ['M8.4 11.6a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 6.5a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8z'] },
    chart:   { s: ['M4 20h16'],
               f: ['M5.4 12.6h3v6h-3zM10.5 8.2h3v10.4h-3zM15.6 4.4h3v14.2h-3z'] },
    drop:    { s: ['M12 3.2S5.2 10.4 5.2 14.6a6.8 6.8 0 0 0 13.6 0C18.8 10.4 12 3.2 12 3.2Z',
                   'M9 15.4a3 3 0 0 0 3 3'] },
    chip:    { s: ['M7.6 7.6h8.8v8.8H7.6Z', 'M4.6 4.6h14.8v14.8H4.6Z',
                   'M9.4 2.2v2.4', 'M14.6 2.2v2.4', 'M9.4 19.4v2.4', 'M14.6 19.4v2.4',
                   'M2.2 9.4h2.4', 'M2.2 14.6h2.4', 'M19.4 9.4h2.4', 'M19.4 14.6h2.4'] },
    oil:     { s: ['M3.4 13.2h9.2l3.4-3.4h4.6v6.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2Z',
                   'M8 9.8V6.4h4.6', 'M16 9.8V5.2c0-1.2 1-2 2.1-1.6'] },

    /* ---- chrome ---- */
    menu:    { s: ['M3.5 7h17', 'M3.5 12h17', 'M3.5 17h17'] },
    close:   { s: ['M5.5 5.5l13 13', 'M18.5 5.5l-13 13'] },
    arrow:   { s: ['M4.5 12h15', 'M13.5 6l6 6-6 6'] },
    arrowUp: { s: ['M7 17 17 7', 'M8.5 7H17v8.5'] },
    chevron: { s: ['M6.5 9.5 12 15l5.5-5.5'] },
    check:   { s: ['M4.5 12.8 9.4 17.6 19.5 6.8'] },
    plus:    { s: ['M12 5v14', 'M5 12h14'] },
    copy:    { s: ['M9.5 9.5h9a1.6 1.6 0 0 1 1.6 1.6v9a1.6 1.6 0 0 1-1.6 1.6h-9A1.6 1.6 0 0 1 7.9 20.1v-9A1.6 1.6 0 0 1 9.5 9.5Z',
                   'M4.4 14.5H4A1.6 1.6 0 0 1 2.4 12.9v-9A1.6 1.6 0 0 1 4 2.3h9a1.6 1.6 0 0 1 1.6 1.6v.4'] },

    /* ---- contact ---- */
    phone:   { s: ['M7.3 3.6h3.1l1.6 3.9-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 3.9 1.6v3.1a1.8 1.8 0 0 1-2 1.8A16.4 16.4 0 0 1 5.5 5.6a1.8 1.8 0 0 1 1.8-2Z'] },
    mail:    { s: ['M3.6 6.2h16.8v11.6H3.6Z', 'M3.6 6.9 12 13.2l8.4-6.3'] },
    pin:     { s: ['M12 2.8a6.5 6.5 0 0 0-6.5 6.5c0 4.9 6.5 11.9 6.5 11.9s6.5-7 6.5-11.9A6.5 6.5 0 0 0 12 2.8Z',
                   'M12 11.9a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z'] },
    clock:   { s: ['M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Z', 'M12 7.4V12l3.2 2'] },
    whatsapp:{ f: ['M12.03 3.2a8.74 8.74 0 0 0-7.4 13.37L3.3 20.8l4.35-1.3a8.74 8.74 0 1 0 4.38-16.3Zm0 1.86a6.88 6.88 0 1 1-3.5 12.8l-.3-.18-2.3.69.7-2.24-.2-.32a6.88 6.88 0 0 1 5.6-10.75Z',
                    'M9.3 7.9c-.2-.45-.4-.46-.58-.47h-.5a.95.95 0 0 0-.69.33 2.9 2.9 0 0 0-.9 2.16c0 1.27.92 2.5 1.05 2.67.13.17 1.8 2.88 4.45 3.92 2.2.87 2.65.7 3.13.65.48-.04 1.55-.63 1.77-1.25.22-.61.22-1.14.15-1.25-.06-.1-.24-.17-.5-.3-.27-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.17.26-.68.86-.83 1.04-.15.17-.3.2-.57.07a7.2 7.2 0 0 1-2.1-1.3 7.9 7.9 0 0 1-1.46-1.8c-.15-.27-.01-.41.12-.54.12-.12.26-.3.4-.46.12-.16.16-.27.25-.45.08-.17.04-.33-.02-.46-.07-.13-.6-1.43-.8-1.96Z'] },

    /* ---- the brand mark, for the drawer and small chrome ---- */
    bay:     { f: [GEAR8], rule: 'evenodd' }
  };

  function build(name, opts) {
    var ic = ICONS[name];
    if (!ic) return '';
    opts = opts || {};
    var size = opts.size || 24;
    var parts = '';
    if (ic.f) {
      ic.f.forEach(function (p) {
        parts += '<path d="' + p + '" fill="currentColor"' +
                 (ic.rule ? ' fill-rule="' + ic.rule + '"' : '') + '/>';
      });
    }
    if (ic.s) {
      var g = '<g fill="none" stroke="currentColor" stroke-width="' + (ic.w || 1.75) +
              '" stroke-linecap="round" stroke-linejoin="round">';
      ic.s.forEach(function (p) { g += '<path d="' + p + '"/>'; });
      parts += g + '</g>';
    }
    return '<svg class="icon' + (opts.cls ? ' ' + opts.cls : '') + '" viewBox="0 0 24 24" ' +
           'width="' + size + '" height="' + size + '" aria-hidden="true" focusable="false">' +
           parts + '</svg>';
  }

  /* Replace every [data-icon] in `root` with its SVG. Idempotent. */
  function hydrateIcons(root) {
    var nodes = (root || d).querySelectorAll('[data-icon]:not([data-icon-done])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var svg = build(el.getAttribute('data-icon'), {
        size: parseInt(el.getAttribute('data-icon-size'), 10) || 24
      });
      if (svg) {
        el.innerHTML = svg;
        el.setAttribute('data-icon-done', '');
      }
    }
  }

  w.VI = w.VI || {};
  w.VI.icon = build;
  w.VI.icons = ICONS;
  w.VI.hydrateIcons = hydrateIcons;
})(window, document);
