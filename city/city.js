// Draws a "your city" page from its #plan JSON (written by the city's Burnoff growth desk, one file per business: city/<slug>/index.html).
// Every word about the business comes from the plan; everything about Burnoff (the offer, the rules) lives here, so one edit changes every page.
// Text goes in with textContent only: the plan is data, never markup.
(function () {
  var plan = {};
  try { plan = JSON.parse(document.getElementById('plan').textContent || '{}'); } catch (e) {}
  var app = document.getElementById('app'); if (!app || !plan.name) return;
  var name = String(plan.name), host = String(plan.host || ''), depts = (plan.depts || []).slice(0, 7), facts = (plan.facts || []).slice(0, 6);
  var COLORS = { 'mail room': 'pink', 'leads': 'mint', 'social media': 'cyan', 'social': 'cyan', 'reviews': 'violet', 'newsletter': 'amber', 'ads': 'gold' };
  var CYCLE = ['pink', 'mint', 'cyan', 'violet', 'amber', 'gold'];
  var colorOf = function (d, i) { return 'var(--' + (COLORS[String(d.name || '').toLowerCase()] || CYCLE[i % CYCLE.length]) + ')'; };
  var HEX = { pink: '#ff5a9a', mint: '#7dffb0', cyan: '#57e1ff', violet: '#9c8cff', amber: '#ffb35a', gold: '#f0cf86' };
  var hexOf = function (d, i) { return HEX[COLORS[String(d.name || '').toLowerCase()] || CYCLE[i % CYCLE.length]]; };

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function words(tag, cls, parts) {   // a heading with an italic gold part: parts = ['plain ', ['gold'], ...]
    var n = el(tag, cls); parts.forEach(function (p) { n.appendChild(typeof p === 'string' ? document.createTextNode(p) : el('em', '', p[0])); }); return n;
  }
  function link(cls, href, text) { var a = el('a', cls, text); a.href = href; if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } return a; }

  // header
  var top = el('header', 'top'), mark = el('a', 'mark'); mark.href = '/'; mark.append('Burn', el('em', '', 'off'));
  var pill = el('div', 'pill'); pill.append(el('i'), plan.sample ? 'A sample city' : 'Made for ' + name);
  add(app, add(top, mark, pill));

  // hero
  var hero = el('div', 'hero');
  add(hero, el('p', 'label', 'Your city · a free plan'), words('h1', '', [name + ', here is ', ['your city.']]));
  var lede = el('p', 'lede'); lede.append('We read ' + (host || 'your website') + ' and planned the AI helpers that would take the busywork off you. ', el('b', '', 'Nothing goes out until you say OK.'));
  add(hero, lede, skyline());
  add(app, hero);

  // the buildings
  var s1 = el('section'), grid = el('div', 'depts');
  depts.forEach(function (d, i) {
    var card = el('div', 'bld' + (d.own ? ' own' : '')), sign = el('div', 'sign'); sign.style.setProperty('--c', colorOf(d, i)); sign.append(el('i'), String(d.name || 'Building'));
    var ex = d.example ? el('p') : null; if (ex) ex.append(el('em', '', 'For you: '), String(d.example));
    add(grid, add(card, sign, el('b', '', d.takes || ''), ex));
  });
  add(app, add(s1, el('p', 'label', 'Your buildings'), words('h2', '', ['Each building ', ['takes one job off you.']]),
    el('p', 'sub', 'Planned from what your website says. You can change any of them, or build your own by saying what you want in plain words.'), grid));

  // what we read
  if (facts.length) {
    var s2 = el('section'), list = el('ul', 'read');
    facts.forEach(function (f) { var li = el('li', '', f.fact || ''); if (f.quote) li.appendChild(el('span', '', 'Your site: "' + f.quote + '"')); list.appendChild(li); });
    add(app, add(s2, el('p', 'label', 'What we read'), words('h2', '', ['Planned from ', ['your own website.']]),
      el('p', 'sub', 'Only what ' + (host || 'your site') + ' says. If we got something wrong, tell us and we fix it.'), list));
  }

  // the rules (the same promises as the home page)
  var s3 = el('section'), rules = el('div', 'rules');
  [['Nothing sends without your OK.', 'Every email and post waits for your tap, unless you turn on autopilot for a building that has earned it.'],
   ['It sticks to your facts.', 'It uses only what you gave it for prices, dates and promises, and asks you when a fact is missing.'],
   ['Any AI you like.', 'Claude, ChatGPT, Gemini, or any model on OpenRouter. Switch any time.'],
   ['It runs on your own account.', 'Your city lives on your own Railway, with your own Gmail permission.']].forEach(function (r) { add(rules, add(el('div'), el('b', '', r[0]), el('span', '', r[1]))); });
  add(app, add(s3, el('p', 'label', 'Your rules'), words('h2', '', ['You stay ', ['in charge.']]), rules));

  // the offer
  var s4 = el('section', 'end'), cta = el('div', 'cta'), big = el('div', 'big'); big.append('First 5 businesses ', el('em', '', 'get set up free'));
  var mail = 'mailto:hello@burnoff.app?subject=' + encodeURIComponent('Set up my city: ' + name) + '&body=' + encodeURIComponent('Hi! I saw the city you planned for ' + name + ' (' + location.href + '). I would like a free setup.\n\nMy name:\nBest time for a short call:');
  var row = add(el('div', 'row'), link('buy', mail, 'Claim a free setup'), link('code', 'https://ig.me/m/burnoff.app', 'DM us on Instagram'));
  var small = el('small'); small.append('We set up your city with you on a short call: your Gmail, your AI, your first buildings. After the first 5, a setup is $500 once. Or set it up yourself for free: ', link('', 'https://github.com/blake632/your-city', 'the code is on GitHub'), '.');
  add(app, add(s4, words('h2', '', ['Want this city ', ['for real?']]), add(cta, big, row, small)));

  var fine = el('p', 'fine'); var made = plan.date ? new Date(plan.date + 'T12:00:00') : null;
  if (plan.sample) fine.append('This is a sample: ' + name + ' is a made-up business. A real page is planned from your own website. ', link('', '/privacy.html', 'Privacy'), ' · ', link('', 'mailto:hello@burnoff.app', 'hello@burnoff.app'));
  else fine.append('Burnoff made this example ' + (made && !isNaN(made) ? 'on ' + made.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' ' : '') + 'from the public website ' + (host || 'of ' + name) + '. ' +
    name + ' did not make this page and is not part of Burnoff. No account of theirs was touched. ', link('', '/privacy.html', 'Privacy'), ' · ', link('', 'mailto:hello@burnoff.app', 'hello@burnoff.app'));
  add(app, fine);
  document.title = 'Your city, made for ' + name + ' | Burnoff';

  // A small night skyline: one building per department in its own light, low ones between, windows that flicker.
  function skyline() {
    var NS = 'http://www.w3.org/2000/svg', W = 640, H = 230, n = Math.max(depts.length, 1), slot = (W - 40) / n;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'A small city with ' + depts.length + ' buildings: ' + depts.map(function (d) { return d.name; }).join(', '));
    var seed = 0; for (var k = 0; k < name.length; k++) seed = (seed * 31 + name.charCodeAt(k)) >>> 0;
    var rnd = function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    var mk = function (tag, at) { var n = document.createElementNS(NS, tag); for (var a in at) n.setAttribute(a, at[a]); svg.appendChild(n); return n; };
    var defs = mk('defs', {}), f = document.createElementNS(NS, 'filter'); f.setAttribute('id', 'glow'); f.setAttribute('x', '-50%'); f.setAttribute('y', '-50%'); f.setAttribute('width', '200%'); f.setAttribute('height', '200%');
    var bl = document.createElementNS(NS, 'feGaussianBlur'); bl.setAttribute('stdDeviation', '4'); f.appendChild(bl); defs.appendChild(f);
    for (var b = 0; b < n + 1; b++) {   // low back buildings between the departments
      var bx = 20 + b * slot - slot * .22, bh = 40 + rnd() * 50; mk('rect', { x: bx, y: H - 18 - bh, width: slot * .44, height: bh, fill: '#0b1020', stroke: '#1a2138' });
    }
    depts.forEach(function (d, i) {
      var c = hexOf(d, i), w = Math.min(slot * .62, 74), x = 20 + i * slot + (slot - w) / 2, h = 105 + rnd() * 85, y = H - 18 - h;
      mk('rect', { 'class': 'beam', x: x + w / 2 - 1, y: y - 28, width: 2, height: 28, fill: c, opacity: .7 });
      mk('rect', { x: x, y: y, width: w, height: h, rx: 3, fill: '#10162a', stroke: '#26304d' });
      mk('rect', { x: x + 4, y: y + 6, width: w - 8, height: 6, rx: 3, fill: c, filter: 'url(#glow)' });
      mk('rect', { x: x + 4, y: y + 6, width: w - 8, height: 6, rx: 3, fill: c });
      for (var ry = y + 24; ry < H - 30; ry += 14) for (var rx = x + 8; rx < x + w - 10; rx += 12) {
        var lit = rnd(); if (lit < .45) continue;
        var win = mk('rect', { x: rx, y: ry, width: 6, height: 7, rx: 1, fill: lit > .9 ? c : '#f6f1e6', opacity: lit > .9 ? .9 : .18 + rnd() * .3 });
        if (rnd() < .18) { win.setAttribute('class', 'win'); win.style.animationDelay = (-rnd() * 6).toFixed(2) + 's'; }
      }
    });
    mk('rect', { x: 0, y: H - 18, width: W, height: 18, fill: '#0a0e1c' });
    mk('line', { x1: 0, y1: H - 18, x2: W, y2: H - 18, stroke: '#f0cf86', 'stroke-opacity': .35 });
    return add(el('div', 'sky'), svg);
  }
})();

// Light trails on the street grid behind the page (the home page's own).
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.getElementById('trails'); if (!cv) return;
  var cx = cv.getContext('2d'), W = 0, H = 0, S = 64, dpr = Math.min(2, window.devicePixelRatio || 1);
  var cols = ['#57e1ff', '#ff5a9a', '#7dffb0', '#9c8cff', '#ffb35a', '#f0cf86'], bikes = [];
  function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function bike() {
    var x = Math.round(Math.random() * W / S) * S, y = Math.round(Math.random() * H / S) * S, d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
    return { pts: [[x, y]], x: x, y: y, d: d, c: cols[Math.floor(Math.random() * cols.length)], run: 0, life: 260 + Math.random() * 380, v: 1.6 + Math.random() * 1.6 };
  }
  function step() {
    cx.clearRect(0, 0, W, H);
    while (bikes.length < 7) bikes.push(bike());
    bikes.forEach(function (b) {
      b.x += b.d[0] * b.v; b.y += b.d[1] * b.v; b.run += b.v;
      if (b.run % S < b.v && Math.random() < .35) { b.x = Math.round(b.x / S) * S; b.y = Math.round(b.y / S) * S; b.pts.push([b.x, b.y]); b.d = b.d[0] ? [0, Math.random() < .5 ? 1 : -1] : [Math.random() < .5 ? 1 : -1, 0]; }
      var fade = Math.max(0, Math.min(1, (b.life - b.run) / 80));
      cx.strokeStyle = b.c; cx.globalAlpha = .7 * fade; cx.lineWidth = 2; cx.shadowColor = b.c; cx.shadowBlur = 12;
      cx.beginPath(); cx.moveTo(b.pts[0][0], b.pts[0][1]); b.pts.slice(1).forEach(function (p) { cx.lineTo(p[0], p[1]); }); cx.lineTo(b.x, b.y); cx.stroke();
      cx.globalAlpha = 1; cx.shadowBlur = 0;
    });
    bikes = bikes.filter(function (b) { return b.run < b.life && b.x > -S && b.x < W + S && b.y > -S && b.y < H + S; });
    requestAnimationFrame(step);
  }
  size(); addEventListener('resize', size); step();
})();
