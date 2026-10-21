/* ============================================================
   VIWANDA AUTOMOTIVE - data.js
   Single source of truth on window.VIWANDA. Every page script and
   partial reads from here; nothing hard-codes copy or prices.

   Services and prices are transcribed from the client's own WhatsApp
   Business catalogue, October 2026. See docs/CATALOGUE.md for the
   evidence and the two prices that are deliberately absent.
   ============================================================ */
(function (w) {
  'use strict';

  /* ---------------------------------------------------------
     SERVICES
     Grouped for a website; the exact priced line items are in
     CATALOGUE below. `active:false` means it appears in the 2023
     company profile but nowhere in the live catalogue or on the
     frontage sign - held back pending a word from the client
     rather than quietly dropped or quietly claimed.
     --------------------------------------------------------- */
  var SERVICES = [
    {
      id: 'respray', icon: 'spray', active: true, from: null,
      name: 'Paint &amp; Respray',
      sw: 'Rangi',
      short: 'Complete resprays, two-tone, pearl and glass coating.',
      body: 'Full vehicle resprays from medium saloons to V8 SUVs, finished with glass ' +
            'coating. Panels are stripped, filled, masked and primed before colour, and ' +
            'every stage is photographed so you can see the work rather than take it on trust.',
      images: ['respray-bay', 'premio-masked', 'premio-blue', 'v8-glasscoat', 'cruiser-black']
    },
    {
      id: 'bodywork', icon: 'wrench', active: true, from: null,
      name: 'Accident &amp; Panel Repair',
      sw: 'Kunyoosha',
      short: 'Crash damage straightened, replaced and refinished.',
      body: 'Rear-end and side impact work, panel replacement and alignment, finished with ' +
            'complete paintwork. This is the work insurers send vehicles for, and it is ' +
            'quoted on assessment because no two impacts are the same.',
      images: ['crv-rear-damaged', 'crv-rear-repaired', 'v8-gold-damaged', 'wagon-damaged']
    },
    {
      id: 'restoration', icon: 'sparkle', active: true, from: null,
      name: 'Restoration',
      sw: 'Kurudisha Hali',
      short: 'Bringing a vehicle back, not just keeping it running.',
      body: 'Engine replacement, dashboard and interior repair, and full paintwork on ' +
            'vehicles worth saving. Quoted on assessment once the shell has been stripped ' +
            'and the real condition is known.',
      images: ['fuga-stripped', 'fuga-bare', 'fuga-finished']
    },
    {
      id: 'detailing', icon: 'drop', active: true, from: null,
      name: 'Detailing &amp; Tint',
      sw: 'Usafi na Ving’ora',
      short: 'Buffing, valeting and all-around tint.',
      body: 'Buffing and polishing to bring back a tired finish, complete interior ' +
            'clean-up, and all-around tint that keeps the cabin cool and adds a layer of ' +
            'privacy. The quickest way to make an older vehicle look cared for.',
      images: ['buffing', 'valeting', 'tint'], photo: 'alloy'
    },
    {
      id: 'parts', icon: 'gear', active: true, from: null,
      name: 'Spare Parts &amp; Importation',
      sw: 'Vipuri',
      short: 'Sourced worldwide, for all models.',
      body: 'We source and import parts for any model - airbags, dashboards, panels, trim. ' +
            'Clearing through Mombasa takes the time it takes; what we can do is tell you ' +
            'where the part is and when it lands, instead of leaving you to guess.',
      images: ['parts-boxed', 'parts-airbag', 'dashboard']
    },

    {
      id: 'diagnostics', icon: 'scan', active: true, from: null,
      name: 'Engine Diagnosis',
      sw: 'Uchunguzi',
      short: 'Hakuna guesswork. We find the fault, then quote it.',
      body: 'Fault codes read, live data watched, and the actual cause traced before a ' +
            'single part is ordered. You see the reading and the photograph of the fault ' +
            'before you authorise anything.',
      images: [], photo: 'engine-internals',
      photoAlt: 'Timing chains exposed on a stripped V-engine'
    },
    {
      id: 'ecu', icon: 'chip', active: true, from: null,
      name: 'ECU &amp; Software Support',
      sw: 'Programu',
      short: 'Coding, reprogramming and module replacement.',
      body: 'Reprogramming after a module or engine swap, immobiliser and key coding, ' +
            'and sensor calibration. A replacement part that has not been coded to the ' +
            'vehicle is a part that does not work, and that is where most imported-module ' +
            'jobs go wrong.',
      images: [], photo: 'ecu',
      photoAlt: 'Technician leaning into an engine bay'
    },
    {
      id: 'service', icon: 'oil', active: true, from: null,
      name: 'Service &amp; Maintenance',
      sw: 'Huduma ya Kawaida',
      short: 'Scheduled servicing on Kenyan intervals, not European ones.',
      body: 'Oil and filters, brakes, suspension and the undercarriage work that matuta, ' +
            'dust and stop-start Thika Road traffic actually cause. Service intervals here ' +
            'are set by the road, not by a manual written for a motorway.',
      images: [], photo: 'undercarriage',
      photoAlt: 'Technician working at the front wheel arch of a car'
    },

    /* --- in the 2023 profile only. Not in the catalogue, not on the sign. --- */
    { id: 'sourcing', icon: 'key', active: false, from: null,
      name: 'Vehicle Sourcing &amp; Valuation', sw: 'Kutafuta Gari',
      short: 'In the 2023 profile. Not in the live catalogue.', body: '', images: [] },
    { id: 'consultancy', icon: 'chart', active: false, from: null,
      name: 'Fleet Consultancy', sw: 'Ushauri',
      short: 'In the 2023 profile. Not in the live catalogue.', body: '', images: [] }
    /* Pick & Drop, held back here until October 2026, is confirmed now and
       lives in REACH below, with the mobile service. */
  ];

  /* ---------------------------------------------------------
     CATALOGUE - the jobs the workshop markets, from its own WhatsApp
     Business catalogue. Prices are deliberately NOT shown on the site;
     the `price` field is kept only as an internal record and nothing
     renders it. See docs/CATALOGUE.md.
     --------------------------------------------------------- */
  var CATALOGUE = [
    { id: 'paint-restoration', name: 'Paint restoration', price: null, service: 'respray',
      desc: 'Big SUVs, complete respray and glass coating.', image: 'v8-glasscoat' },
    { id: 'v8-paint', name: 'Fresh paint work, V8', price: null, service: 'respray',
      desc: 'V8 paint work with glass coating.', image: 'cruiser-gold' },
    { id: 'complete-respray', name: 'Complete vehicle respray', price: null, service: 'respray',
      desc: 'Two-tone colours.', image: 'crv-rear-repaired' },
    { id: 'pearl-respray', name: 'Pearl complete respray', price: null, service: 'bodywork',
      desc: 'Medium saloon with rear accident repairs and complete paint work.', image: 'premio-silver' },
    { id: 'prestine-black', name: 'Complete respray, Prestine Black', price: null, service: 'respray',
      desc: 'Paint, perfection and presence.', image: 'fuga-finished' },
    { id: 'paint-work', name: 'Paint work', price: null, service: 'respray',
      desc: 'Complete respray for medium saloons.', image: 'saloon-masked' },
    { id: 'tint', name: 'Presidential car tint', price: null, service: 'detailing',
      desc: 'Dark but clear all-around tint. Keeps the cabin cool and adds a security layer.', image: 'tint' },
    { id: 'valeting', name: 'Valeting', price: null, service: 'detailing',
      desc: 'Complete interior clean-up and refreshing scents.', image: 'valeting' },
    { id: 'touch-up', name: 'Touch-up repairs', price: null, service: 'bodywork',
      desc: 'Patch respray.', image: 'avensis-patch' },
    { id: 'buffing', name: 'Complete buffing', price: null, service: 'detailing',
      desc: 'Buffing and polishing.', image: 'buffing' },
    { id: 'full-restoration', name: 'Full respray &amp; engine restoration', price: null, service: 'restoration',
      desc: 'Engine replacement, dashboard repairs and paint work.', image: 'fuga-stripped' },
    { id: 'parts-import', name: 'Parts sourcing and importation', price: null, service: 'parts',
      desc: 'Across the world, for all models.', image: 'parts-boxed' }
  ];

  /* ---------------------------------------------------------
     WORK - the gallery. Plates blurred; see docs/CATALOGUE.md.
     --------------------------------------------------------- */
  var WORK = [
    { id: 'fuga-stripped', w: 738, h: 554, stage: 'Stripped', service: 'restoration',
      alt: 'Nissan Fuga in the bay, wheels off, before its restoration' },
    { id: 'fuga-finished', w: 738, h: 985, stage: 'Finished', service: 'restoration',
      alt: 'Nissan Fuga finished in Prestine Black' },
    { id: 'fuga-bare', w: 738, h: 340, stage: 'Bare metal', service: 'restoration',
      alt: 'Nissan Fuga taken back to bare metal, front end off, during its restoration' },
    { id: 'pajero-finished', w: 738, h: 402, stage: 'Finished', service: 'detailing',
      alt: 'Mitsubishi Pajero Sport finished and being buffed' },
    { id: 'crv-damaged', w: 738, h: 826, stage: 'Damaged', service: 'bodywork',
      alt: 'Honda CR-V with rear accident damage before repair' },
    { id: 'saloon-masked', w: 738, h: 554, stage: 'Masked', service: 'respray',
      alt: 'Saloon masked and primed, ready for colour' },
    { id: 'respray-bay', w: 738, h: 554, stage: 'In the bay', service: 'respray',
      alt: 'Vehicle masked for a complete respray in the workshop' },
    { id: 'v8-glasscoat', w: 738, h: 554, stage: 'Finished', service: 'respray',
      alt: 'Toyota Land Cruiser V8 after paint work and glass coating' },
    { id: 'cruiser-gold', w: 738, h: 554, stage: 'Finished', service: 'respray',
      alt: 'Toyota Land Cruiser V8 finished, front view' },
    { id: 'cruiser-black', w: 738, h: 554, stage: 'Finished', service: 'respray',
      alt: 'Black Toyota Land Cruiser V8 after a complete respray' },
    { id: 'valeting', w: 738, h: 554, stage: 'Valeted', service: 'detailing',
      alt: 'Interior after a complete clean-up' },
    { id: 'buffing', w: 738, h: 554, stage: 'Buffed', service: 'detailing',
      alt: 'Gloss finish after complete buffing and polishing' },
    { id: 'tint', w: 738, h: 1033, stage: 'Tinted', service: 'detailing',
      alt: 'All-around window tint fitted' },
    { id: 'parts-boxed', w: 738, h: 1196, stage: 'Landed', service: 'parts',
      alt: 'Imported parts boxed and labelled for a customer' },
    { id: 'parts-airbag', w: 738, h: 1351, stage: 'Sourced', service: 'parts',
      alt: 'Replacement airbag module sourced for a repair' },
    { id: 'dashboard', w: 738, h: 555, stage: 'Rebuilt', service: 'parts',
      alt: 'Dashboard repair and interior trim work' },
    { id: 'premio-silver', w: 738, h: 412, stage: 'Finished', service: 'bodywork',
      alt: 'Toyota saloon after a complete respray' },
    { id: 'crv-rear-damaged', w: 738, h: 554, stage: 'Damaged', service: 'bodywork',
      alt: 'Honda CR-V from behind, rear quarter and tailgate crushed' },
    { id: 'crv-rear-repaired', w: 738, h: 554, stage: 'Repaired', service: 'bodywork',
      alt: 'The same Honda CR-V from behind, rear quarter and tailgate repaired and refinished' },
    { id: 'v8-gold-damaged', w: 738, h: 554, stage: 'Damaged', service: 'bodywork',
      alt: 'Toyota Land Cruiser V8 with the front end smashed, bumper and lights off' },
    { id: 'cruiser-black-stripped', w: 738, h: 554, stage: 'Stripped', service: 'respray',
      alt: 'Black Toyota Land Cruiser V8 with the front stripped for respray' },
    { id: 'cruiser-black-front', w: 738, h: 554, stage: 'Finished', service: 'respray',
      alt: 'The same black Land Cruiser V8 finished and glass-coated' },
    { id: 'wagon-damaged', w: 738, h: 554, stage: 'Damaged', service: 'bodywork',
      alt: 'White Toyota estate with rear accident damage in the bay' },
    { id: 'wagon-finished', w: 738, h: 554, stage: 'Repaired', service: 'bodywork',
      alt: 'The same white Toyota estate after rear accident repair and complete paint' },
    { id: 'premio-masked', w: 738, h: 554, stage: 'Masked', service: 'respray',
      alt: 'Toyota Premio masked and in primer for a complete respray' },
    { id: 'premio-blue', w: 738, h: 554, stage: 'Finished', service: 'respray',
      alt: 'The same Toyota Premio finished in blue' },
    { id: 'avensis-patch', w: 738, h: 554, stage: 'Patched', service: 'bodywork',
      alt: 'Silver Toyota Avensis with the front wing and bumper patched and primed' },
    { id: 'avensis-finished', w: 738, h: 554, stage: 'Finished', service: 'bodywork',
      alt: 'The same Toyota Avensis after the patch respray' }
  ];


  /* ---------------------------------------------------------
     PROJECTS - one job, shown before and after.

     Every pair is two photographs of the same vehicle on the same job:
     both frames come from the same item in the client's own WhatsApp
     catalogue, and they are matched by angle so the wipe compares like
     with like. Checked photo by photo in October 2026, after the client
     flagged pairs that were two different cars.

     `confirmed: false` would render a pair as "two stages of one job"
     rather than one car. Nothing here needs it; keep it for any pair
     that cannot be traced to one catalogue item.

     The Fuga restoration and the Pajero buff are not here: neither job
     has a before and an after of the same car from a matching angle.
     Their photographs stay in the gallery.
     --------------------------------------------------------- */
  var PROJECTS = [
    {
      id: 'land-cruiser-gold', vehicle: 'Toyota Land Cruiser V8', service: 'bodywork', confirmed: true,
      title: 'Front end rebuilt, painted and glass-coated',
      body: 'It came in with the front end gone: bumper, lights and grille off, the wing pushed in. ' +
            'Rebuilt, refinished in its own colour and glass-coated, so nothing says it was ever hit.',
      before: 'v8-gold-damaged', after: 'cruiser-gold',
      beforeLabel: 'As it arrived', afterLabel: 'As it left'
    },
    {
      id: 'crv', vehicle: 'Honda CR-V', service: 'bodywork', confirmed: true,
      title: 'Rear impact, panel and paint',
      body: 'Rear quarter and tailgate took the hit. Panels straightened and replaced, then ' +
            'refinished to match so the repair does not announce itself.',
      before: 'crv-rear-damaged', after: 'crv-rear-repaired',
      beforeLabel: 'As it arrived', afterLabel: 'Repaired and refinished'
    },
    {
      id: 'land-cruiser-black', vehicle: 'Toyota Land Cruiser V8', service: 'respray', confirmed: true,
      title: 'Complete respray and glass coating',
      body: 'Front stripped back, the whole body resprayed and finished with glass coating. ' +
            'The big SUVs take the longest to prepare, and it shows in the gloss.',
      before: 'cruiser-black-stripped', after: 'cruiser-black-front',
      beforeLabel: 'Stripped for respray', afterLabel: 'Resprayed and coated'
    },
    {
      id: 'toyota-estate', vehicle: 'Toyota estate', service: 'bodywork', confirmed: true,
      title: 'Rear accident repair and complete paint',
      body: 'Rear bumper and tailgate crushed. The rear end was rebuilt, then the whole car painted ' +
            'so the new panels and the old ones finish as one colour.',
      before: 'wagon-damaged', after: 'wagon-finished',
      beforeLabel: 'As it arrived', afterLabel: 'As it left'
    },
    {
      id: 'premio', vehicle: 'Toyota Premio', service: 'respray', confirmed: true,
      title: 'Complete respray, medium saloon',
      body: 'Masked by hand and primed all over, then laid in colour. Most of a good respray is ' +
            'the preparation in the first frame, which nobody sees in the second.',
      before: 'premio-masked', after: 'premio-blue',
      beforeLabel: 'Masked and primed', afterLabel: 'Finished in blue'
    },
    {
      id: 'avensis', vehicle: 'Toyota Avensis', service: 'bodywork', confirmed: true,
      title: 'Patch respray',
      body: 'Not every job is a whole car. The front wing and bumper were patched, primed and ' +
            'blended into the paint around them.',
      before: 'avensis-patch', after: 'avensis-finished',
      beforeLabel: 'Patched and primed', afterLabel: 'Blended in'
    }
  ];


  /* ---------------------------------------------------------
     PROCESS - how a job actually runs. This is the "documented"
     half of the brand made concrete; it is what a jua kali repair
     cannot offer and what an insurer needs.
     --------------------------------------------------------- */
  var PROCESS = [
    { n: 'Assessment', sw: 'Ukaguzi',
      body: 'Bring it in, or send photographs on WhatsApp. Most paint and panel work ' +
            'can be quoted from a picture without you losing a morning.' },
    { n: 'The figure', sw: 'Bei',
      body: 'A written price before anything is touched. If stripping the panel reveals ' +
            'worse underneath, you hear about it before we carry on, not after.' },
    { n: 'The work', sw: 'Kazi',
      body: 'Strip, panel, fill, mask, prime, colour, coat. Photographed at each stage, ' +
            'so the work is visible rather than promised.' },
    { n: 'Handover', sw: 'Kurudisha',
      body: 'Buffed, checked and returned. The record of the job goes with the car, and ' +
            'nothing about the job is a surprise when you pick it up.' }
  ];


  /* ---------------------------------------------------------
     STAGES - the pinned scroll story.
     Six stages of a respray, each one a real photograph from the
     bay. Pattern ported from the Spann Tyres explode section:
     tall stage, sticky pin, scroll progress banded into steps.
     --------------------------------------------------------- */
  var STAGES = [
    { img: 'crv-damaged',   tag: 'As it arrives',
      head: 'Damage, honestly assessed.',
      body: 'Rear quarter and tailgate took the hit. Before anything is touched we ' +
            'photograph what is actually wrong and put a figure to it.' },
    { img: 'fuga-stripped', tag: 'Stripped',
      head: 'Back to bare metal.',
      body: 'Filler and old paint come off so the panel underneath can be seen. This is ' +
            'where a job gets longer or shorter, and where you hear about it.' },
    { img: 'saloon-masked', tag: 'Masked and primed',
      head: 'Everything that is not getting painted, covered.',
      body: 'Glass, trim and shuts masked by hand, then primer. Most of a good respray ' +
            'is preparation nobody ever sees.' },
    { img: 'respray-bay',   tag: 'In the bay',
      head: 'Colour, in coats.',
      body: 'Laid in thin passes and left to flash between them. Rushing this is what ' +
            'produces the orange-peel finish you see on a cheap job.' },
    { img: 'buffing',       tag: 'Buffed',
      head: 'Cut back and polished.',
      body: 'The gloss is not in the paint, it is in the buffing. This is the stage that ' +
            'separates a repair you notice from one you do not.' },
    { img: 'cruiser-gold',  tag: 'Finished',
      head: 'Back to you, documented.',
      body: 'Checked, photographed and handed over with the record of the job, so ' +
            'what was done is written down rather than remembered.' }
  ];

  var LOCATIONS = [
    { id: 'nairobi', name: 'Garden Estate', city: 'Nairobi', primary: true,
      landmark: 'Garden Estate, off Thika Road',
      address: 'Garden Estate, Nairobi, Kenya',
      phone: '+254721717064', phoneDisplay: '+254 721 717 064',
      whatsapp: '254721717064', hours: null,
      note: 'The workshop. Paint, bodywork, restoration, detailing and parts.' },
    { id: 'embu', name: 'Embu', city: 'Embu', primary: false,
      landmark: null, address: 'Embu, Kenya',
      phone: null, whatsapp: null, hours: null,
      note: 'Our Embu site. Call ahead and we will tell you what can be done there.' }
  ];

  /* ---------------------------------------------------------
     REACH - how the car gets to the work, or the work to the car.
     Confirmed by the client in October 2026: pick-up and drop-off for
     office and corporate clients, and a mobile, door-to-door service
     wherever the client is.
     --------------------------------------------------------- */
  var REACH = [
    { id: 'pickup', icon: 'route', sw: 'Tunachukua. Tunarudisha.',
      name: 'Pick-up &amp; drop-off',
      short: 'For office and corporate clients.',
      body: 'We collect the vehicle from your office and bring it back when the work is done, ' +
            'so nobody loses a working day sitting in a workshop.' },
    { id: 'mobile', icon: 'pin', sw: 'Tunakuja kwako',
      name: 'Mobile service, door to door',
      short: 'Wherever you are.',
      body: 'Tell us where the car is, at home, at work or wherever it stopped, and we come to it. ' +
            'What can be done on the spot is done there; what needs the bay, we take in.' }
  ];

  var CLIENTS = [
    { id: 'resolution-insurance',    name: 'Resolution Insurance' },
    { id: 'kenya-credit-traders',    name: 'Kenya Credit Traders' },
    { id: 'raiser-resource-group',   name: 'Raiser Resource Group' },
    { id: 'mumbi-coffee-refineries', name: 'Mumbi Coffee Refineries' },
    { id: 'eagle-lights',            name: 'Eagle Lights' },
    { id: 'insignia-group',          name: 'Insignia Group' },
    { id: 'sydenham',                name: 'Sydenham' },
    { id: 'lijaque-stationers',      name: 'Lijaque Stationers' },
    { id: 'dreamcoat',               name: 'Dreamcoat Automotive Refinishing' },
    { id: 'viwanda-africa-group',    name: 'The Viwanda Africa Group' }
  ];

  /* Ordered by Kenyan market share, not alphabetically. */
  var MAKES = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Isuzu', 'Honda',
               'Volkswagen', 'Mercedes-Benz', 'BMW', 'Land Rover', 'Suzuki', 'Ford', 'Other'];

  var NAV = [
    { href: '/viwanda-automotive-site/services.html',  label: 'Services' },
    { href: '/viwanda-automotive-site/work.html',      label: 'Our work' },
    { href: '/viwanda-automotive-site/before-after.html', label: 'Before &amp; after' },
    { href: '/viwanda-automotive-site/fleet.html',     label: 'Fleet' },
    { href: '/viwanda-automotive-site/locations.html', label: 'Locations' },
    { href: '/viwanda-automotive-site/about.html',     label: 'About' }
  ];


  w.VIWANDA = {
    company: {
      name: 'Viwanda Automotive',
      legal: 'Viwanda Automotive Limited',
      meaning: 'industries',               /* viwanda, Swahili */
      tagline: 'Tunaijua Barabara',
      taglineEn: 'We know the road',
      /* The client's own line, already in market on their catalogue. */
      paintLine: 'Paint, perfection &amp; presence.',
      paintSub: 'We don’t just paint cars. We make them turn heads.',
      promise: 'Restore · Maintain · Enhance',
      promiseAlt: 'Keep you moving',
      line: 'Kutoka jua kali hadi job card.',
      lineEn: 'From jua kali to job card.',
      email: 'info@viwandaautomotive.com',
      phone: '+254721717064',
      phoneDisplay: '+254 721 717 064',
      whatsapp: '254721717064',
      mpesa: null, founded: null, warranty: null
    },
    services: SERVICES,
    activeServices: SERVICES.filter(function (s) { return s.active; }),
    catalogue: CATALOGUE,
    work: WORK,
    projects: PROJECTS,
    reach: REACH,
    process: PROCESS,
    stages: STAGES,
    locations: LOCATIONS,
    clients: CLIENTS,
    makes: MAKES,
    nav: NAV,
    img: function (id) { return '/viwanda-automotive-site/images/work/' + id; },
    wa: function (text, number) {
      var n = number || w.VIWANDA.company.whatsapp;
      return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
    },
    service: function (id) {
      for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
      return null;
    },
    workFor: function (serviceId) {
      return WORK.filter(function (k) { return k.service === serviceId; });
    },
    workById: function (id) {
      for (var i = 0; i < WORK.length; i++) if (WORK[i].id === id) return WORK[i];
      return null;
    }
  };
})(window);
