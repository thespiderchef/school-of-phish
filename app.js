/* The School of Phish: app.js
 *
 * Vanilla JavaScript, no dependencies. Structure:
 *   1. Setup and helpers       5. Link checking and status bar
 *   2. Theme and routing       6. Verdicts and debrief
 *   3. Rounds                  7. Results, progress and field guide
 *   4. Rendering an email      8. Events
 *
 * Email content is always inserted with textContent / DOM nodes, never
 * innerHTML, so the data file can't inject markup or scripts.
 */
(function () {
  'use strict';

  /* ===== 1. Setup and helpers ===== */

  const DATA = window.SCHOOL_OF_PHISH;
  const ROUND_SIZE = 10;
  const LEGIT_PER_ROUND = 4;
  const POINTS = { verdict: 100, flag: 25, falseFlag: -10, openedPhish: -25 };
  const STORE_KEY = 'school-of-phish:progress:v1';
  const THEME_KEY = 'school-of-phish:theme';
  const MY_ADDRESS = 'me@students.plymouth.ac.uk';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Small element builder: el('p', { class: 'x', text: 'hi' }, child, child)
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === false || value === null || value === undefined) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  const plural = (n, word, many = word + 's') => `${n} ${n === 1 ? word : many}`;

  function announce(message) {
    const node = $('#announcer');
    node.textContent = '';
    window.setTimeout(() => { node.textContent = message; }, 30);
  }

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Domains. The "registrable" domain is the part someone actually bought:
     in login.microsoft.com.verify-identity.co it's verify-identity.co. Showing
     it clearly is one of the main things this app teaches. */
  const TWO_PART_SUFFIXES = ['co.uk', 'ac.uk', 'gov.uk', 'org.uk', 'nhs.uk', 'ltd.uk', 'me.uk', 'com.au', 'co.nz'];

  function hostOf(text) {
    const email = text.match(/@([a-z0-9.-]+\.[a-z]{2,})/i);
    if (email) return email[1].toLowerCase();
    const url = text.match(/[a-z][a-z0-9+.-]*:\/\/([^/:?#\s]+)/i);
    if (url) return url[1].toLowerCase();
    const bare = text.match(/^([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    return bare ? bare[1].toLowerCase() : null;
  }

  function registrableDomain(host) {
    const parts = host.split('.');
    const lastTwo = parts.slice(-2).join('.');
    if (parts.length >= 3 && TWO_PART_SUFFIXES.includes(lastTwo)) return parts.slice(-3).join('.');
    return lastTwo;
  }

  // Returns a fragment with the registrable domain underlined.
  function domainMarkup(text) {
    const frag = document.createDocumentFragment();
    const host = hostOf(text);
    const hostStart = host ? text.toLowerCase().indexOf(host) : -1;
    if (hostStart < 0) {
      frag.append(text);
      return frag;
    }
    const reg = registrableDomain(host);
    const regStart = hostStart + host.length - reg.length;
    frag.append(
      text.slice(0, regStart),
      el('span', { class: 'reg', text: text.slice(regStart, regStart + reg.length) }),
      text.slice(regStart + reg.length)
    );
    return frag;
  }

  /* Data preparation: give every highlightable part of an email a "spot" id,
     and number the red flags in reading order. */
  function normalise(raw) {
    const subject = typeof raw.subject === 'string' ? { text: raw.subject } : raw.subject;
    const blocks = raw.body.map((b, i) => ({ ...(typeof b === 'string' ? { p: b } : b), spot: 'b' + i }));
    const flags = [];
    const add = (spot, f) => { if (f) flags.push({ spot, tactic: f.t, note: f.n }); };
    add('from', raw.from.flag);
    if (raw.replyTo) add('replyTo', raw.replyTo.flag);
    add('subject', subject.flag);
    blocks.forEach(b => add(b.spot, b.flag));
    flags.forEach((f, i) => { f.n = i + 1; });
    return { ...raw, subject, blocks, flags, flagBySpot: new Map(flags.map(f => [f.spot, f])) };
  }

  const EMAILS = DATA.EMAILS.map(normalise);
  const emailById = new Map(EMAILS.map(e => [e.id, e]));
  const tacticById = new Map(DATA.TACTICS.map(t => [t.id, t]));

  EMAILS.forEach(e => e.flags.forEach(f => {
    if (!tacticById.has(f.tactic)) console.warn(`Email "${e.id}" uses unknown tactic "${f.tactic}"`);
  }));

  /* Progress is stored locally; storage can be blocked, so always fail softly. */
  const freshProgress = () => ({ rounds: [], tactics: {}, emailsSeen: {} });

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && Array.isArray(saved.rounds)) return { ...freshProgress(), ...saved };
    } catch (e) { /* fall through */ }
    return freshProgress();
  }

  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }

  let progress = loadProgress();

  /* ===== 2. Theme and routing ===== */

  const root = document.documentElement;
  const themeBtn = $('#theme-toggle');

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    }
  }

  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  // Hash routing (#train, #guide, #guide/lookalike, #progress, #about) so every
  // view can be linked to and the back button works.
  const VIEWS = { train: 'Train', guide: 'Field guide', progress: 'Progress', about: 'About' };

  function route() {
    const [name, sub] = location.hash.replace(/^#/, '').split('/');
    const view = name in VIEWS ? name : 'train';

    $$('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    $$('.site-nav a').forEach(a => {
      if (a.dataset.view === view) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = view === 'train' ? 'The School of Phish' : `${VIEWS[view]}: The School of Phish`;
    closeLinkPop();

    if (view === 'guide') renderGuide(sub);
    else window.scrollTo(0, 0);
    if (view === 'progress') renderProgress();
  }

  /* ===== 3. Rounds ===== */

  let round = null;

  const currentItem = () => round.items[round.current];
  const currentEmail = () => emailById.get(currentItem().id);

  // Least-seen emails first, so repeat players work through the whole pool.
  function pickEmails() {
    const seen = id => progress.emailsSeen[id] || 0;
    const pick = (list, n) => shuffle(list).sort((a, b) => seen(a.id) - seen(b.id)).slice(0, n);
    const legit = pick(EMAILS.filter(e => !e.phish), LEGIT_PER_ROUND);
    const phish = pick(EMAILS.filter(e => e.phish), ROUND_SIZE - LEGIT_PER_ROUND);
    return shuffle(legit.concat(phish));
  }

  function startRound() {
    let time = Date.now();
    const items = pickEmails().map(email => {
      time -= (12 + Math.random() * 160) * 60000; // newest first, spaced out like a real inbox
      return { id: email.id, time, answer: null, flags: new Set(), opened: false, detailsOpen: false, points: 0 };
    });
    round = { items, current: 0, score: 0, finished: false };

    if (location.hash !== '#train') location.hash = '#train';
    $('#intro').hidden = true;
    $('#results').hidden = true;
    $('#trainer').hidden = false;
    renderTrainer();
    $('#mail-subject').focus();
  }

  function selectEmail(index) {
    round.current = index;
    renderTrainer();
    if (window.innerWidth < 900) $('#reader').scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function goNext() {
    if (!currentItem().answer) return;
    const n = round.items.length;
    for (let step = 1; step <= n; step++) {
      const i = (round.current + step) % n;
      if (!round.items[i].answer) {
        selectEmail(i);
        $('#mail-subject').focus();
        return;
      }
    }
    finishRound();
  }

  /* ===== 4. Rendering an email ===== */

  function formatTime(ts, long) {
    const d = new Date(ts);
    const now = new Date();
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === now.toDateString()) return time;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return long ? `Yesterday, ${time}` : 'Yesterday';
    return d.toLocaleDateString('en-GB', long ? { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { weekday: 'short' });
  }

  function initials(name) {
    const words = name.replace(/[^a-z0-9 ]/gi, '').split(/\s+/).filter(Boolean);
    return ((words[0] || '?')[0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
  }

  function renderTrainer() {
    closeLinkPop();
    renderRoundBar();
    renderInbox();
    renderEmail();
    renderDebrief();
    renderVerdictBar();
  }

  function renderRoundBar() {
    const answered = round.items.filter(i => i.answer).length;
    $('#round-count').textContent = `${answered} of ${round.items.length} answered`;
    $('#score').textContent = round.score;

    $('#round-dots').replaceChildren(...round.items.map((item, i) => {
      const status = !item.answer ? 'not answered' : item.correct ? 'correct' : 'incorrect';
      const btn = el('button', {
        type: 'button',
        class: item.answer ? (item.correct ? 'is-right' : 'is-wrong') : '',
        'aria-label': `Email ${i + 1}, ${status}`,
        'aria-current': i === round.current ? 'true' : false,
        'data-index': i
      }, item.answer ? (item.correct ? '✓' : '✗') : String(i + 1));
      return el('li', {}, btn);
    }));
  }

  function renderInbox() {
    $('#inbox-list').replaceChildren(...round.items.map((item, i) => {
      const email = emailById.get(item.id);
      const result = item.answer
        ? el('span', { class: 'inbox-result ' + (item.correct ? 'is-right' : 'is-wrong'), text: item.correct ? `right, +${item.points}` : `wrong, +${item.points}` })
        : null;
      const btn = el('button', {
        type: 'button',
        class: 'inbox-item' + (item.answer ? '' : ' is-unread'),
        'aria-current': i === round.current ? 'true' : false,
        'data-index': i
      },
        el('span', { class: 'inbox-from', text: email.from.name }),
        el('span', { class: 'inbox-time', text: formatTime(item.time) }),
        el('span', { class: 'inbox-subject', text: email.subject.text }),
        result
      );
      return el('li', {}, btn);
    }));
  }

  // Every highlightable element gets the same treatment, so being clickable
  // never gives away whether something is a red flag.
  function makeSpot(node, spot, answered) {
    node.dataset.spot = spot;
    node.classList.add('spot');
    if (node.tagName !== 'A') {
      if (answered) {
        node.removeAttribute('role');
        node.removeAttribute('tabindex');
        node.removeAttribute('aria-pressed');
      } else {
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', '0');
      }
    }
    return node;
  }

  function renderEmail() {
    const item = currentItem();
    const email = currentEmail();
    const answered = Boolean(item.answer);
    const reader = $('#reader');
    reader.classList.toggle('is-answered', answered);

    makeSpot($('#mail-subject'), 'subject', answered).textContent = email.subject.text;
    makeSpot($('#mail-from'), 'from', answered).textContent = email.from.name;

    const avatar = $('#mail-avatar');
    avatar.textContent = initials(email.from.name);
    avatar.style.setProperty('--hue', hashString(email.from.name) % 360);

    const time = $('#mail-time');
    time.textContent = formatTime(item.time, true);
    time.dateTime = new Date(item.time).toISOString();

    // Sender details, collapsed by default like most mail apps
    const details = $('#mail-details');
    const row = (label, value) => [el('dt', { text: label }), el('dd', {}, value)];
    details.replaceChildren(
      ...row('From', makeSpot(el('span', {}, `${email.from.name} <`, el('span', { class: 'addr' }, domainMarkup(email.from.email)), '>'), 'from', answered)),
      ...(email.replyTo ? row('Reply-To', makeSpot(el('span', { class: 'addr' }, domainMarkup(email.replyTo.email)), 'replyTo', answered)) : []),
      ...row('To', el('span', { class: 'addr', text: MY_ADDRESS })),
      ...row('Date', formatTime(item.time, true))
    );
    details.hidden = !item.detailsOpen;
    const toggle = $('#details-toggle');
    toggle.setAttribute('aria-expanded', String(item.detailsOpen));
    toggle.textContent = item.detailsOpen ? 'Hide details' : 'Show details';

    $('#mail-body').replaceChildren(...email.blocks.map(block => renderBlock(block, email, answered)));

    applySpotStates();
    clearStatus();
  }

  const ATTACHMENT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  function renderBlock(block, email, answered) {
    if (block.link) {
      const link = el('a', {
        href: block.href,
        class: 'mail-link' + (block.cta ? ' is-cta' : ''),
        'data-href': block.href,
        'aria-haspopup': 'dialog',
        text: block.link
      });
      makeSpot(link, block.spot, answered);
      return el('p', {}, link);
    }
    if (block.attach) {
      const box = el('div', { class: 'attachment', 'aria-label': `Attachment: ${block.attach}, ${block.size}` });
      box.insertAdjacentHTML('afterbegin', ATTACHMENT_ICON); // static icon, not data
      box.append(el('span', {}, el('span', { class: 'attachment-name', text: block.attach }), el('span', { class: 'attachment-size', text: block.size })));
      return makeSpot(box, block.spot, answered);
    }
    if (block.qr) {
      const fig = el('figure', { class: 'qr', 'aria-label': 'QR code' });
      fig.insertAdjacentHTML('afterbegin', qrSvg(email.id)); // generated from numbers, not data
      fig.append(el('figcaption', { text: 'Scan with your phone camera' }));
      return makeSpot(fig, block.spot, answered);
    }
    if (block.sig) return makeSpot(el('p', { class: 'mail-sig', text: block.sig }), block.spot, answered);
    return makeSpot(el('p', { text: block.p }), block.spot, answered);
  }

  // A decorative, QR-shaped pattern (it doesn't encode anything scannable).
  function qrSvg(seed) {
    const size = 25;
    let s = hashString(seed) || 1;
    const rand = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
    const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
    let path = '';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let dark;
        const f = finders.find(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
        if (f) {
          const dx = x - f[0];
          const dy = y - f[1];
          const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
          dark = inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        } else {
          dark = rand() < 0.48;
        }
        if (dark) path += `M${x} ${y}h1v1h-1z`;
      }
    }
    return `<svg viewBox="-2 -2 ${size + 4} ${size + 4}" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${size + 4}" height="${size + 4}" fill="#fff"/><path d="${path}" fill="#10293a"/></svg>`;
  }

  function applySpotStates() {
    const item = currentItem();
    const email = currentEmail();
    const answered = Boolean(item.answer);

    $$('#reader [data-spot]').forEach(node => {
      const spot = node.dataset.spot;
      const flagged = item.flags.has(spot);
      const real = email.flagBySpot.get(spot);
      node.classList.toggle('is-flagged', flagged);
      node.classList.toggle('is-redflag', answered && Boolean(real));
      node.classList.toggle('is-missed', answered && Boolean(real) && !flagged);
      node.classList.toggle('is-false', answered && !real && flagged);
      if (answered && real) node.dataset.n = real.n;
      else delete node.dataset.n;
      if (!answered && node.tagName !== 'A') node.setAttribute('aria-pressed', String(flagged));
    });
  }

  function toggleFlag(spot) {
    const item = currentItem();
    if (item.answer) return;
    if (item.flags.has(spot)) {
      item.flags.delete(spot);
      announce('Highlight removed');
    } else {
      item.flags.add(spot);
      announce('Highlighted as suspicious');
    }
    applySpotStates();
    renderVerdictBar();
  }

  function renderVerdictBar() {
    const item = currentItem();
    const answered = Boolean(item.answer);
    $('#btn-legit').hidden = answered;
    $('#btn-phish').hidden = answered;
    $('#btn-next').hidden = !answered;

    const remaining = round.items.filter(i => !i.answer).length;
    $('#btn-next-label').textContent = remaining ? 'Next email' : 'See your results';

    const hint = $('#flag-hint');
    if (answered) {
      hint.replaceChildren(remaining ? `${plural(remaining, 'email')} left in this round.` : 'That was the last one.');
    } else if (item.flags.size) {
      hint.replaceChildren(el('strong', { text: `${item.flags.size} highlighted.` }), ' Click again to remove a highlight, or make your call.');
    } else {
      hint.replaceChildren('Click anything that looks suspicious to highlight it, then make your call.');
    }
  }

  /* ===== 5. Link checking and status bar ===== */

  const pop = $('#link-pop');
  let popLink = null;

  function openLinkPop(link) {
    const item = currentItem();
    const href = link.dataset.href;
    const host = hostOf(href);
    popLink = link;

    pop.replaceChildren(
      el('p', { class: 'pop-label', text: 'This link goes to' }),
      el('p', { class: 'pop-url' }, domainMarkup(href)),
      el('p', { class: 'pop-site' }, 'Website: ', el('strong', { text: host ? registrableDomain(host) : href })),
      el('div', { class: 'pop-actions' },
        item.answer ? null : el('button', { type: 'button', class: 'btn btn-small btn-mark', 'data-pop': 'flag' }, item.flags.has(link.dataset.spot) ? 'Remove highlight' : 'Highlight as suspicious'),
        el('button', { type: 'button', class: 'btn btn-small btn-quiet', 'data-pop': 'open' }, 'Open link')
      ),
      el('p', { class: 'pop-result', 'aria-live': 'polite' }),
      el('button', { type: 'button', class: 'pop-close', 'data-pop': 'close', 'aria-label': 'Close' }, '×')
    );

    const reader = $('#reader');
    const r = reader.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    pop.hidden = false;
    const maxLeft = r.width - pop.offsetWidth - 8;
    pop.style.left = Math.max(8, Math.min(l.left - r.left, maxLeft)) + 'px';
    pop.style.top = (l.bottom - r.top + 8) + 'px';
    pop.querySelector('button').focus();
  }

  function closeLinkPop(returnFocus) {
    if (pop.hidden) return;
    pop.hidden = true;
    if (returnFocus && popLink && document.contains(popLink)) popLink.focus();
    popLink = null;
  }

  function openLinkFromPop() {
    const item = currentItem();
    const email = currentEmail();
    const host = hostOf(popLink.dataset.href);
    const site = host ? registrableDomain(host) : 'that address';
    const result = pop.querySelector('.pop-result');

    if (email.phish) {
      if (!item.answer) item.opened = true;
      result.className = 'pop-result is-danger';
      result.textContent = `Caught. In a real inbox this would have opened a page on ${site}, built to look genuine and capture whatever you type. Opening a link isn't always the end of the world, but entering a password or card details there would be.` + (item.answer ? '' : ` (${POINTS.openedPhish} points)`);
    } else {
      result.className = 'pop-result is-safe';
      result.textContent = `This goes to ${site}, the organisation's real website. Even so, the safest habit is to visit sites by typing the address or using the app, rather than following links in emails.`;
    }
  }

  const statusBar = $('#status-bar');

  function showStatus(href) {
    statusBar.classList.add('is-active');
    statusBar.replaceChildren(domainMarkup(href));
  }

  function clearStatus() {
    statusBar.classList.remove('is-active');
    statusBar.replaceChildren(el('span', { class: 'status-empty', text: 'Hover over a link to see where it really goes. On a touchscreen, tap it.' }));
  }

  /* ===== 6. Verdicts and debrief ===== */

  function giveVerdict(choice) {
    if (!round) return;
    const item = currentItem();
    if (item.answer) return;
    const email = currentEmail();
    closeLinkPop();

    item.answer = choice;
    item.correct = (choice === 'phish') === email.phish;
    item.found = email.flags.filter(f => item.flags.has(f.spot)).length;
    item.falseFlags = Array.from(item.flags).filter(s => !email.flagBySpot.has(s)).length;
    item.openedPhish = item.opened && email.phish;
    // Open the sender details if some of the evidence is hidden in them.
    if (email.flagBySpot.has('from') || email.flagBySpot.has('replyTo')) item.detailsOpen = true;

    const points = (item.correct ? POINTS.verdict : 0)
      + item.found * POINTS.flag
      + item.falseFlags * POINTS.falseFlag
      + (item.openedPhish ? POINTS.openedPhish : 0);
    item.points = Math.max(0, points);
    round.score += item.points;

    renderTrainer();
    const title = $('#debrief-title');
    title.focus({ preventScroll: true });
    $('#debrief').scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function renderDebrief() {
    const box = $('#debrief');
    const item = currentItem();
    const email = currentEmail();
    if (!item.answer) {
      box.hidden = true;
      return;
    }

    const kind = email.phish ? 'phishing' : 'legitimate';
    const parts = [
      el('div', { class: 'debrief-head' },
        el('h3', { id: 'debrief-title', tabindex: '-1', text: item.correct ? `Correct: this one is ${kind}.` : `Not quite: this one is ${kind}.` }),
        el('span', { class: 'debrief-points', 'aria-label': `${item.points} points` }, `+${item.points}`)
      ),
      el('p', { class: 'debrief-lesson', text: email.lesson })
    ];

    if (email.phish) {
      parts.push(
        el('h4', { text: `What gave it away (you highlighted ${item.found} of ${email.flags.length})` }),
        el('ol', { class: 'flag-list' }, email.flags.map(f => {
          const tactic = tacticById.get(f.tactic);
          const spotted = item.flags.has(f.spot);
          return el('li', {},
            el('span', { class: 'flag-num', 'aria-hidden': 'true', text: f.n }),
            el('div', { class: 'flag-title' },
              el('a', { href: `#guide/${f.tactic}`, text: tactic ? tactic.name : f.tactic }),
              el('span', { class: 'flag-status ' + (spotted ? 'is-spotted' : 'is-missed'), text: spotted ? 'you spotted this' : 'missed' })
            ),
            el('p', { class: 'flag-note', text: f.note })
          );
        }))
      );
    } else {
      parts.push(
        el('h4', { text: 'Why it checks out' }),
        el('ul', { class: 'good-list' }, (email.good || []).map(g => el('li', { text: g })))
      );
    }

    if (item.falseFlags) {
      parts.push(el('p', { class: 'debrief-aside' },
        `You also highlighted ${plural(item.falseFlags, 'thing')} that ${item.falseFlags === 1 ? 'was' : 'were'} fine (shaded grey above, ${POINTS.falseFlag} points each). Caution is good, but knowing what normal looks like matters too.`));
    }
    if (item.openedPhish) {
      parts.push(el('p', { class: 'debrief-aside is-danger', text: `You opened a link in this email before deciding (${POINTS.openedPhish} points). Next time, read where it goes and leave it there.` }));
    }
    if (email.phish && item.correct && item.found === 0) {
      parts.push(el('p', { class: 'debrief-aside', text: `Right call. Next time, try highlighting the red flags before you decide: each one you catch is worth ${POINTS.flag} points.` }));
    }

    box.className = 'debrief ' + (item.correct ? 'is-right' : 'is-wrong');
    box.replaceChildren(...parts);
    box.hidden = false;
  }

  /* ===== 7. Results, progress and field guide ===== */

  function summarise(r) {
    const s = { score: r.score, total: r.items.length, correct: 0, found: 0, flagTotal: 0, opened: 0, missedByTactic: {} };
    r.items.forEach(item => {
      const email = emailById.get(item.id);
      if (item.correct) s.correct++;
      if (item.openedPhish) s.opened++;
      email.flags.forEach(f => {
        s.flagTotal++;
        if (item.flags.has(f.spot)) s.found++;
        else s.missedByTactic[f.tactic] = (s.missedByTactic[f.tactic] || 0) + 1;
      });
    });
    s.max = s.total * POINTS.verdict + s.flagTotal * POINTS.flag;
    return s;
  }

  function grade(pct) {
    if (pct >= 0.85) return 'A';
    if (pct >= 0.7) return 'B';
    if (pct >= 0.55) return 'C';
    if (pct >= 0.4) return 'D';
    return 'See me';
  }

  function finishRound() {
    const s = summarise(round);
    if (!round.finished) {
      round.finished = true;
      progress.rounds.push({ at: Date.now(), score: s.score, max: s.max, correct: s.correct, total: s.total, found: s.found, flagTotal: s.flagTotal, opened: s.opened });
      progress.rounds = progress.rounds.slice(-50);
      round.items.forEach(item => {
        const email = emailById.get(item.id);
        progress.emailsSeen[item.id] = (progress.emailsSeen[item.id] || 0) + 1;
        email.flags.forEach(f => {
          const t = progress.tactics[f.tactic] || (progress.tactics[f.tactic] = { seen: 0, spotted: 0 });
          t.seen++;
          if (item.flags.has(f.spot)) t.spotted++;
        });
      });
      saveProgress();
    }
    renderResults(s);
  }

  function renderResults(s) {
    const g = grade(s.score / s.max);
    const missed = Object.entries(s.missedByTactic).sort((a, b) => b[1] - a[1]);

    const revisit = missed.length
      ? [
          el('h3', { text: 'Worth revisiting' }),
          el('ul', { class: 'revisit' }, missed.map(([id, n]) =>
            el('li', {}, el('a', { href: `#guide/${id}`, text: tacticById.get(id).name }), ` (missed ${n === 1 ? 'once' : n + ' times'})`)))
        ]
      : [el('p', { text: "You didn't miss a single red flag. Impressive." })];

    const box = $('#results');
    box.replaceChildren(el('div', { class: 'results-paper' },
      el('span', { class: 'grade' + (g.length > 1 ? ' is-long' : ''), 'aria-label': `Grade: ${g}` }, g),
      el('h2', { id: 'results-title', tabindex: '-1', text: 'Round complete' }),
      el('p', { class: 'results-score', text: `${s.score} points out of a possible ${s.max}.` }),
      el('dl', { class: 'stat-grid' },
        el('div', { class: 'stat' }, el('dt', { text: 'Right calls' }), el('dd', { text: `${s.correct} of ${s.total}` })),
        el('div', { class: 'stat' }, el('dt', { text: 'Red flags highlighted' }), el('dd', { text: `${s.found} of ${s.flagTotal}` })),
        el('div', { class: 'stat' }, el('dt', { text: 'Phishing links opened' }), el('dd', { text: String(s.opened) }))
      ),
      ...revisit,
      el('div', { class: 'actions-row' },
        el('button', { type: 'button', class: 'btn btn-primary', 'data-action': 'start' }, 'Start a new round'),
        el('button', { type: 'button', class: 'btn btn-quiet', 'data-action': 'review' }, 'Review this round'),
        el('a', { class: 'btn btn-quiet', href: '#progress' }, 'See your progress')
      )
    ));

    $('#trainer').hidden = true;
    box.hidden = false;
    window.scrollTo(0, 0);
    $('#results-title').focus();
  }

  function reviewRound() {
    $('#results').hidden = true;
    $('#trainer').hidden = false;
    round.current = 0;
    renderTrainer();
  }

  let guideBuilt = false;

  function renderGuide(anchor) {
    const list = $('#guide-list');
    if (!guideBuilt) {
      list.replaceChildren(...DATA.TACTICS.map(t => el('article', { class: 'tactic', id: 'tactic-' + t.id, tabindex: '-1' },
        el('h3', { text: t.name }),
        el('p', { class: 'tactic-summary', text: t.summary }),
        el('dl', {},
          el('dt', { text: 'What it looks like' }),
          el('dd', {}, t.examples.map(x => el('code', { class: 'tactic-example' }, domainMarkup(x)))),
          el('dt', { text: 'How to check' }),
          el('dd', { text: t.check })
        ),
        el('p', { class: 'tactic-mastery', 'data-mastery': t.id })
      )));
      guideBuilt = true;
    }

    $$('[data-mastery]', list).forEach(node => {
      const stat = progress.tactics[node.dataset.mastery];
      node.textContent = stat && stat.seen
        ? `You've caught ${stat.spotted} of the ${stat.seen} you've seen`
        : 'Not met in training yet';
    });

    const target = anchor && document.getElementById('tactic-' + anchor);
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
      target.focus({ preventScroll: true });
      target.classList.add('is-target');
      window.setTimeout(() => target.classList.remove('is-target'), 900);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function renderProgress() {
    const body = $('#progress-body');
    const rounds = progress.rounds;

    if (!rounds.length) {
      body.replaceChildren(el('div', { class: 'empty' },
        el('p', { text: 'No rounds yet. Finish one and your scores, plus the red flags you tend to miss, will appear here.' }),
        el('button', { type: 'button', class: 'btn btn-primary', 'data-action': 'start' }, 'Start a round')
      ));
      return;
    }

    const sum = key => rounds.reduce((n, r) => n + r[key], 0);
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0) + '%';
    const best = Math.max(...rounds.map(r => r.score));

    const tactics = Object.entries(progress.tactics)
      .filter(([id, t]) => t.seen && tacticById.has(id))
      .map(([id, t]) => ({ id, ...t, rate: t.spotted / t.seen }))
      .sort((a, b) => a.rate - b.rate || b.seen - a.seen);

    const recent = rounds.slice(-8).reverse();

    body.replaceChildren(
      el('dl', { class: 'stat-grid' },
        el('div', { class: 'stat' }, el('dt', { text: 'Rounds played' }), el('dd', { text: String(rounds.length) })),
        el('div', { class: 'stat' }, el('dt', { text: 'Best score' }), el('dd', { text: String(best) })),
        el('div', { class: 'stat' }, el('dt', { text: 'Right calls' }), el('dd', { text: pct(sum('correct'), sum('total')) })),
        el('div', { class: 'stat' }, el('dt', { text: 'Red flags highlighted' }), el('dd', { text: pct(sum('found'), sum('flagTotal')) }))
      ),
      el('section', { class: 'progress-section', 'aria-labelledby': 'mastery-title' },
        el('h2', { id: 'mastery-title', text: 'Red flags by type' }),
        el('p', { text: 'Weakest first. Each bar shows how often you highlighted that kind of red flag when it appeared.' }),
        el('ul', { class: 'mastery-list' }, tactics.map(t => el('li', {},
          el('a', { href: `#guide/${t.id}`, text: tacticById.get(t.id).name }),
          el('span', { class: 'bar' + (t.rate < 0.5 ? ' is-low' : ''), role: 'img', 'aria-label': `${pct(t.spotted, t.seen)} spotted` },
            el('span', { style: `width: ${Math.round(t.rate * 100)}%` })),
          el('span', { class: 'mastery-count', text: `${t.spotted}/${t.seen}` })
        )))
      ),
      el('section', { class: 'progress-section', 'aria-labelledby': 'recent-title' },
        el('h2', { id: 'recent-title', text: 'Recent rounds' }),
        el('div', { class: 'table-wrap' }, el('table', { class: 'rounds-table' },
          el('thead', {}, el('tr', {}, ['Date', 'Score', 'Right calls', 'Red flags'].map(h => el('th', { scope: 'col', text: h })))),
          el('tbody', {}, recent.map(r => el('tr', {},
            el('td', { text: new Date(r.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }),
            el('td', { text: `${r.score} / ${r.max}` }),
            el('td', { text: `${r.correct} of ${r.total}` }),
            el('td', { text: `${r.found} of ${r.flagTotal}` })
          )))
        ))
      ),
      el('div', { class: 'actions-row' },
        el('button', { type: 'button', class: 'btn btn-primary', 'data-action': 'start' }, 'Start a round'),
        el('button', { type: 'button', class: 'btn btn-quiet', 'data-action': 'reset' }, 'Reset progress')
      )
    );
  }

  /* ===== 8. Events ===== */

  // Global buttons: start, review, reset
  document.addEventListener('click', e => {
    const action = e.target.closest('[data-action]');
    if (!action) return;
    const name = action.dataset.action;
    if (name === 'start') startRound();
    if (name === 'review') reviewRound();
    if (name === 'reset' && window.confirm('Reset all your progress? This can\'t be undone.')) {
      progress = freshProgress();
      saveProgress();
      renderProgress();
      announce('Progress reset');
    }
  });

  // Skip link: focus main content without changing the route
  $('[data-skip]').addEventListener('click', e => {
    e.preventDefault();
    $('#main').focus();
  });

  $('#round-dots').addEventListener('click', e => {
    const btn = e.target.closest('[data-index]');
    if (btn) selectEmail(Number(btn.dataset.index));
  });
  $('#inbox-list').addEventListener('click', e => {
    const btn = e.target.closest('[data-index]');
    if (btn) selectEmail(Number(btn.dataset.index));
  });

  $('#details-toggle').addEventListener('click', () => {
    const item = currentItem();
    item.detailsOpen = !item.detailsOpen;
    renderEmail();
  });

  const reader = $('#reader');

  reader.addEventListener('click', e => {
    if (pop.contains(e.target)) return;
    const link = e.target.closest('a.mail-link');
    if (link) {
      e.preventDefault();
      if (popLink === link) closeLinkPop();
      else openLinkPop(link);
      return;
    }
    const spot = e.target.closest('[data-spot][role="button"]');
    if (spot) toggleFlag(spot.dataset.spot);
  });

  reader.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-spot][role="button"]')) {
      e.preventDefault();
      toggleFlag(e.target.dataset.spot);
    }
  });

  // The fake browser status bar
  reader.addEventListener('mouseover', e => {
    const link = e.target.closest('a.mail-link');
    if (link) showStatus(link.dataset.href);
  });
  reader.addEventListener('mouseout', e => {
    const link = e.target.closest('a.mail-link');
    if (link && !link.contains(e.relatedTarget)) clearStatus();
  });
  reader.addEventListener('focusin', e => {
    if (e.target.matches('a.mail-link')) showStatus(e.target.dataset.href);
  });
  reader.addEventListener('focusout', e => {
    if (e.target.matches('a.mail-link')) clearStatus();
  });

  pop.addEventListener('click', e => {
    const btn = e.target.closest('[data-pop]');
    if (!btn) return;
    const action = btn.dataset.pop;
    if (action === 'close') closeLinkPop(true);
    if (action === 'open') openLinkFromPop();
    if (action === 'flag') {
      toggleFlag(popLink.dataset.spot);
      btn.textContent = currentItem().flags.has(popLink.dataset.spot) ? 'Remove highlight' : 'Highlight as suspicious';
    }
  });

  document.addEventListener('click', e => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('a.mail-link')) closeLinkPop();
  });

  $('#btn-legit').addEventListener('click', () => giveVerdict('legit'));
  $('#btn-phish').addEventListener('click', () => giveVerdict('phish'));
  $('#btn-next').addEventListener('click', goNext);

  // Keyboard shortcuts: L, P, N, and Escape for the link popover
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !pop.hidden) {
      closeLinkPop(true);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (!round || $('#trainer').hidden || $('#view-train').hidden) return;

    const key = e.key.toLowerCase();
    const item = currentItem();
    if (key === 'l' && !item.answer) giveVerdict('legit');
    else if (key === 'p' && !item.answer) giveVerdict('phish');
    else if (key === 'n' && item.answer) goNext();
  });

  window.addEventListener('hashchange', route);

  $('#year').textContent = new Date().getFullYear();
  route();
})();
