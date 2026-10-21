/* ============================================================
   VIWANDA AUTOMOTIVE - booking.js
   Four-step quote request. Submits to WhatsApp, which is where this
   business already talks to its customers.

   State persists to localStorage per step: a dropped connection
   mid-form is common on Kenyan mobile data, and losing the entry
   loses the lead.
   ============================================================ */
(function (w, d) {
  'use strict';
  var V = w.VIWANDA, VI = w.VI;
  var KEY = 'va-quote';
  var step = 0;
  var S = {};

  try { S = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { S = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* Prefill from the home page's quick start: /book.html?service=bodywork&make=Toyota.
     Only values the form itself offers are accepted. With the job already
     chosen, the form opens on the vehicle step. */
  try {
    var q = new URLSearchParams(w.location.search);
    var qs = q.get('service'), qm = q.get('make');
    if (qs && V.service(qs) && V.service(qs).active) { S.service = qs; step = 1; }
    if (qm && V.makes.indexOf(qm) > -1) S.make = qm;
    if (qs || qm) save();
  } catch (e) {}

  var YEARS = (function () {
    var y = new Date().getFullYear(), a = [];
    for (var i = y; i >= 1990; i--) a.push(i);
    return a;
  })();

  /* Where the work happens: the bay, a collection from the office, or the
     mobile service at the car. Pick-up and the mobile service were
     confirmed by the client in October 2026. */
  var WHERE = [
    { v: 'bay',    t: 'We bring it in',             card: 'Brought to the bay' },
    { v: 'pickup', t: 'Collect it from our office', card: 'Pick-up and drop-off' },
    { v: 'mobile', t: 'Come to the car',            card: 'Mobile service' }
  ];
  function whereOf(v) { for (var i = 0; i < WHERE.length; i++) if (WHERE[i].v === v) return WHERE[i]; return WHERE[0]; }

  var STEPS = [
    { id: 'job',     label: 'The job' },
    { id: 'vehicle', label: 'The vehicle' },
    { id: 'detail',  label: 'The detail' },
    { id: 'you',     label: 'You' }
  ];

  function opt(list, sel, blank) {
    return (blank ? '<option value="">' + blank + '</option>' : '') +
      list.map(function (o) {
        var v = typeof o === 'string' ? o : o.v, t = typeof o === 'string' ? o : o.t;
        return '<option value="' + VI.esc(v) + '"' + (String(sel) === String(v) ? ' selected' : '') +
               '>' + VI.esc(t) + '</option>';
      }).join('');
  }

  function fields() {
    var s = STEPS[step].id;
    if (s === 'job') {
      return '<fieldset class="qf__set"><legend class="qf__legend">What does it need?</legend>' +
        '<div class="qf__opts">' +
          V.activeServices.map(function (x) {
            return '<label class="qopt' + (S.service === x.id ? ' is-on' : '') + '">' +
              '<input type="radio" name="service" value="' + x.id + '"' +
                (S.service === x.id ? ' checked' : '') + '>' +
              '<span class="qopt__i" data-icon="' + x.icon + '" data-icon-size="22"></span>' +
              '<span class="qopt__t">' + x.name + '</span>' +
              '<span class="qopt__p mono">' + x.sw + '</span>' +
            '</label>';
          }).join('') +
        '</div><p class="field__err" data-err="service" hidden>Choose what the vehicle needs.</p></fieldset>';
    }
    if (s === 'vehicle') {
      return '<fieldset class="qf__set"><legend class="qf__legend">Which vehicle?</legend>' +
        '<div class="qf__row">' +
          '<div class="field"><label for="q-make">Make</label>' +
            '<select id="q-make" name="make">' + opt(V.makes, S.make, 'Select a make') + '</select>' +
            '<p class="field__err" data-err="make" hidden>Tell us the make.</p></div>' +
          '<div class="field"><label for="q-model">Model</label>' +
            '<input id="q-model" name="model" value="' + VI.esc(S.model || '') +
            '" placeholder="Premio, CR-V, Land Cruiser…" autocomplete="off">' +
            '<p class="field__err" data-err="model" hidden>Tell us the model.</p></div>' +
        '</div>' +
        '<div class="qf__row">' +
          '<div class="field"><label for="q-year">Year</label>' +
            '<select id="q-year" name="year">' + opt(YEARS, S.year, 'Select') + '</select></div>' +
          '<div class="field"><label for="q-colour">Colour <span class="text-3">(optional)</span></label>' +
            '<input id="q-colour" name="colour" value="' + VI.esc(S.colour || '') + '" autocomplete="off"></div>' +
        '</div></fieldset>';
    }
    if (s === 'detail') {
      return '<fieldset class="qf__set"><legend class="qf__legend">What happened?</legend>' +
        '<div class="field"><label for="q-notes">Describe the job</label>' +
          '<textarea id="q-notes" name="notes" rows="5" placeholder="Rear quarter dented, paint cracked. Whole car could do with a respray.">' +
          VI.esc(S.notes || '') + '</textarea>' +
          '<p class="field__err" data-err="notes" hidden>A sentence or two is enough.</p></div>' +
        '<p class="qf__hint">' +
          '<span data-icon="whatsapp" data-icon-size="18"></span>' +
          'Photos help more than words. Attach them to the WhatsApp message at the end &mdash; ' +
          'we can usually quote from a photo without you driving over.' +
        '</p></fieldset>';
    }
    return '<fieldset class="qf__set"><legend class="qf__legend">How do we reach you?</legend>' +
      '<div class="qf__row">' +
        '<div class="field"><label for="q-name">Name</label>' +
          '<input id="q-name" name="name" value="' + VI.esc(S.name || '') + '" autocomplete="name">' +
          '<p class="field__err" data-err="name" hidden>We need a name.</p></div>' +
        '<div class="field"><label for="q-phone">Phone</label>' +
          '<input id="q-phone" name="phone" type="tel" inputmode="tel" placeholder="07xx xxx xxx" ' +
          'value="' + VI.esc(S.phone || '') + '" autocomplete="tel">' +
          '<p class="field__err" data-err="phone" hidden>A Kenyan mobile number, please.</p></div>' +
      '</div>' +
      '<fieldset class="qf__where"><legend class="qf__wl">Where is the car?</legend>' +
        '<div class="qf__wopts">' + WHERE.map(function (o) {
          var on = (S.where || 'bay') === o.v;
          return '<label class="qwhere' + (on ? ' is-on' : '') + '"><input type="radio" name="where" value="' + o.v + '"' +
            (on ? ' checked' : '') + '><span>' + VI.esc(o.t) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="field qf__place"' + ((S.where || 'bay') === 'bay' ? ' hidden' : '') + '>' +
          '<label for="q-place">Where should we come?</label>' +
          '<input id="q-place" name="place" value="' + VI.esc(S.place || '') + '" placeholder="Office, estate or landmark" autocomplete="street-address">' +
          '<p class="field__err" data-err="place" hidden>Tell us where the car is.</p></div>' +
      '</fieldset>' +
      '<div class="field"><label for="q-when">When suits you? <span class="text-3">(optional)</span></label>' +
        '<input id="q-when" name="when" type="date" value="' + VI.esc(S.when || '') + '"></div>' +
      '<div class="qf__summary" data-summary></div></fieldset>';
  }

  function stepsBar() {
    var el = d.querySelector('[data-steps]');
    if (!el) return;
    el.innerHTML = STEPS.map(function (s, i) {
      return '<li class="qf__step' + (i === step ? ' is-on' : '') + (i < step ? ' is-done' : '') + '">' +
        '<span class="mono">' + String(i + 1).padStart(2, '0') + '</span>' + s.label + '</li>';
    }).join('');
  }

  function summary() {
    var el = d.querySelector('[data-summary]');
    if (!el) return;
    var svc = V.service(S.service);
    el.innerHTML = '<h3 class="qf__sh label">Your request</h3><dl class="qf__dl">' +
      '<div><dt>Job</dt><dd>' + (svc ? svc.name : '—') + '</dd></div>' +
      '<div><dt>Vehicle</dt><dd>' + VI.esc([S.make, S.model, S.year].filter(Boolean).join(' ') || '—') + '</dd></div>' +
      '<div><dt>Detail</dt><dd>' + VI.esc(S.notes || '—') + '</dd></div>' +
      '<div><dt>Where</dt><dd>' + VI.esc(whereOf(S.where).card + (S.where && S.where !== 'bay' && S.place ? ', ' + S.place : '')) + '</dd></div>' +
      '</dl>';
  }

  /* a collection or a visit needs somewhere to go */
  function placeOk() { return !S.where || S.where === 'bay' || (S.place || '').trim().length >= 3; }

  function phoneOk() {
    var ph = (S.phone || '').replace(/[^\d+]/g, '');
    return /^(?:\+?254|0)7\d{8}$/.test(ph) || /^(?:\+?254|0)1\d{8}$/.test(ph);
  }

  /* The job card beside the form fills in as the customer answers - the
     same card the workshop writes the job on. Built once; only the
     entries change, so each one inks in as it is answered. */
  var CARD = [
    ['job', 'Job'], ['vehicle', 'Vehicle'], ['yc', 'Year / colour'], ['detail', 'Detail'],
    ['where', 'Where'], ['name', 'Customer'], ['phone', 'Phone'], ['when', 'Preferred date']
  ];
  function card(sent) {
    var el = d.querySelector('[data-jobcard-live]');
    if (!el) return;
    if (!el.firstChild) {
      el.innerHTML =
        '<header class="jc__top">' +
          '<img src="/viwanda-automotive-site/images/logo/final/viwanda-emblem.svg" alt="" width="48" height="44">' +
          '<div><p class="jc__co">Viwanda Automotive Limited</p><p class="jc__ad">Garden Estate &middot; Nairobi</p></div>' +
          '<p class="jc__no">Job card<br><span>Draft</span></p>' +
        '</header>' +
        '<dl class="jc__dl">' + CARD.map(function (c) {
          return '<div class="jc__row" data-k="' + c[0] + '"><dt>' + c[1] + '</dt><dd></dd></div>';
        }).join('') + '</dl>' +
        '<p class="jc__foot">Kutoka jua kali hadi job card</p>' +
        '<span class="jc__stamp" data-stamp>Ready to send</span>';
    }
    var svc = V.service(S.service);
    var vals = {
      job: svc ? svc.name.replace(/&amp;/g, '&') + ' · ' + svc.sw : '',
      vehicle: [S.make, S.model].filter(Boolean).join(' '),
      yc: [S.year, S.colour].filter(Boolean).join(' · '),
      detail: S.notes || '',
      where: S.where && S.where !== 'bay' ? whereOf(S.where).card + (S.place ? ' · ' + S.place : '') : '',
      name: S.name || '',
      phone: S.phone || '',
      when: S.when || ''
    };
    CARD.forEach(function (c) {
      var row = el.querySelector('[data-k="' + c[0] + '"]'), dd = row.querySelector('dd');
      var v = vals[c[0]];
      if (dd.textContent !== v) {
        dd.textContent = v;
        row.classList.toggle('is-filled', !!v);
        if (v) { row.classList.remove('is-ink'); void row.offsetWidth; row.classList.add('is-ink'); }
      }
    });
    var ready = !!(S.service && S.make && (S.model || '').trim() && (S.notes || '').trim().length >= 6 &&
      (S.name || '').trim() && phoneOk() && placeOk());
    var st = el.querySelector('[data-stamp]');
    if (sent) st.textContent = 'Opened in WhatsApp';
    st.classList.toggle('is-on', ready || !!sent);
    el.classList.toggle('is-ready', ready);
  }

  function read() {
    var f = d.querySelector('[data-quote]');
    ['service', 'make', 'model', 'year', 'colour', 'notes', 'where', 'place', 'name', 'phone', 'when'].forEach(function (k) {
      var el = f.elements[k];
      if (!el) return;
      if (el.type === 'radio' || (el.length && el[0] && el[0].type === 'radio')) {
        var c = f.querySelector('[name="' + k + '"]:checked');
        if (c) S[k] = c.value;
      } else { S[k] = el.value; }
    });
    save();
  }

  function err(name, on) {
    var p = d.querySelector('[data-err="' + name + '"]');
    if (p) p.hidden = !on;
    return !on;
  }

  function valid() {
    var s = STEPS[step].id, ok = true;
    if (s === 'job') ok = err('service', !S.service);
    if (s === 'vehicle') {
      ok = err('make', !S.make);
      if (!err('model', !(S.model || '').trim())) ok = false;
    }
    if (s === 'detail') ok = err('notes', (S.notes || '').trim().length < 6);
    if (s === 'you') {
      ok = err('name', !(S.name || '').trim());
      if (!err('phone', !phoneOk())) ok = false;
      if (!err('place', !placeOk())) ok = false;
    }
    if (!ok) {
      var e = d.querySelector('.field__err:not([hidden])');
      if (e && e.scrollIntoView) e.scrollIntoView({ block: 'center' });
    }
    return ok;
  }

  function message() {
    var svc = V.service(S.service);
    return 'Habari Viwanda Automotive.\n\n' +
      'Job: ' + (svc ? svc.name.replace(/&amp;/g, 'and') : '-') + '\n' +
      'Vehicle: ' + [S.make, S.model, S.year, S.colour].filter(Boolean).join(' ') + '\n' +
      'Detail: ' + (S.notes || '') + '\n' +
      (S.where && S.where !== 'bay' ? whereOf(S.where).card + ': ' + (S.place || '') + '\n' : '') +
      (S.when ? 'Preferred date: ' + S.when + '\n' : '') +
      '\nName: ' + (S.name || '') + '\nPhone: ' + (S.phone || '') +
      '\n\n(Sent from viwandaautomotive.com)';
  }

  function render() {
    var host = d.querySelector('[data-fields]');
    if (!host) return;
    host.innerHTML = fields();
    stepsBar();
    if (STEPS[step].id === 'you') summary();
    var back = d.querySelector('[data-back]'), next = d.querySelector('[data-next]');
    back.hidden = step === 0;
    next.innerHTML = step === STEPS.length - 1
      ? '<span data-icon="whatsapp" data-icon-size="19"></span>Send on WhatsApp'
      : 'Continue';
    if (VI && VI.hydrateIcons) VI.hydrateIcons(d);
    card();
  }

  function mount() {
    var f = d.querySelector('[data-quote]');
    if (!f) return;
    render();

    f.addEventListener('change', function (e) {
      read();
      if (e.target.name === 'service') {
        var opts = f.querySelectorAll('.qopt');
        for (var i = 0; i < opts.length; i++) opts[i].classList.remove('is-on');
        if (e.target.closest) e.target.closest('.qopt').classList.add('is-on');
        err('service', false);
      }
      if (e.target.name === 'where') {
        var ws = f.querySelectorAll('.qwhere');
        for (var j = 0; j < ws.length; j++) ws[j].classList.toggle('is-on', ws[j].contains(e.target));
        var pl = f.querySelector('.qf__place');
        if (pl) pl.hidden = e.target.value === 'bay';
        if (e.target.value === 'bay') err('place', false);
        summary();
      }
    });
    f.addEventListener('input', function () { read(); card(); });
    f.addEventListener('change', function () { card(); });

    d.querySelector('[data-back]').addEventListener('click', function () {
      if (step > 0) { read(); step--; render(); }
    });
    d.querySelector('[data-next]').addEventListener('click', function () {
      read();
      if (!valid()) return;
      if (step < STEPS.length - 1) { step++; render(); return; }
      w.open(V.wa(message()), '_blank', 'noopener');
      VI.toast('Opening WhatsApp…');
      card(true);
      try { localStorage.removeItem(KEY); } catch (e) {}
    });
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(window, document);
