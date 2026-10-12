// @ts-nocheck
/**
 * CASA MILANO — INTERACTIVE SNOOKER INTRO (engine)
 * ------------------------------------------------------------------
 * Framework-independent. Works in React (via CasaMilanoIntro.tsx) or in plain HTML.
 * No dependencies. Everything is drawn with HTML5 Canvas + a little DOM for text/buttons.
 *
 *   const intro = mountCasaMilanoIntro({
 *     logoSrc: '/casa-milano-logo.png',  // your real logo (PNG/SVG/WebP). Empty = built-in placeholder
 *     onComplete: (info) => { ... },     // called once, after the overlay is removed
 *     sound: true,                       // optional synthesized sounds + mute button (default false)
 *     audio: { strike, impact, transition }, // optional custom audio file URLs
 *     reducedMotion: 'auto',             // 'auto' | true | false
 *   });
 *   intro.destroy();  // manual cleanup (does NOT call onComplete)
 *   intro.skip();     // same as pressing "Skip intro"
 *
 * This file is plain JavaScript (valid TypeScript too). You can rename it to .js.
 */

const STYLE_ID = 'cmi-style-v1';

const CSS = `
.cmi-root{position:fixed;inset:0;background:#06070b;color:#e9eef5;overflow:hidden;touch-action:none;overscroll-behavior:contain;opacity:1;transition:opacity .7s cubic-bezier(.4,0,.2,1);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;outline:none}
.cmi-root.cmi-leaving{opacity:0;pointer-events:none}
.cmi-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:crosshair;transition:transform .7s ease}
.cmi-root.cmi-leaving .cmi-canvas{transform:scale(1.035)}
.cmi-top{position:absolute;top:max(22px,env(safe-area-inset-top));right:max(22px,env(safe-area-inset-right));display:flex;gap:8px;z-index:3}
.cmi-btn{font:600 11px/1 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#cfd8e3;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:11px 15px;min-height:38px;cursor:pointer;transition:background .2s,border-color .2s,color .2s}
.cmi-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(120,220,255,.6);color:#fff}
.cmi-btn:focus-visible{outline:2px solid #38e1ff;outline-offset:2px}
.cmi-instr{position:absolute;left:0;right:0;bottom:0;padding:26px 16px max(14px,env(safe-area-inset-bottom));text-align:center;z-index:2;pointer-events:none;opacity:0;transform:translateY(10px);transition:opacity .8s ease,transform .8s ease;background:linear-gradient(to top,rgba(6,7,11,.94) 58%,rgba(6,7,11,0))}
.cmi-instr.cmi-show{opacity:1;transform:none}
.cmi-h{margin:0;font-weight:800;letter-spacing:.32em;text-indent:.32em;font-size:clamp(17px,2.4vw,30px);line-height:1.15;color:#fff}
.cmi-sub{margin:8px auto 0;max-width:640px;font-size:clamp(12px,1.25vw,15px);line-height:1.45;color:#aab4c2}
.cmi-hint{min-height:1.3em;margin:6px 0 0;font-size:clamp(11px,1.1vw,13px);color:#7be6ff;letter-spacing:.04em;opacity:0;transition:opacity .4s}
.cmi-hint.cmi-on{opacity:1}
.cmi-power{display:flex;align-items:center;justify-content:center;gap:10px;margin:8px auto 0;width:min(320px,70vw)}
.cmi-power span{font-size:10px;letter-spacing:.22em;color:#8d98a8;font-weight:700}
.cmi-bar{flex:1;height:6px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden}
.cmi-fill{display:block;height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,#38e1ff,#8b5cf6 70%,#fff)}
.cmi-keys{margin:8px 0 0;font-size:11px;letter-spacing:.06em;color:#6f7a8a}
.cmi-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (hover:none){.cmi-keys{display:none}}
@media (max-height:520px){.cmi-sub,.cmi-keys{display:none}.cmi-instr{padding-top:14px}}
@media (prefers-reduced-motion:reduce){.cmi-root,.cmi-instr,.cmi-canvas{transition-duration:.01s}}
`;

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const angleBetween = (ax, ay, bx, by) => Math.atan2(ax * by - ay * bx, ax * bx + ay * by);

function rotateToward(d, t, maxA) {
  const a = clamp(angleBetween(d.x, d.y, t.x, t.y), -maxA, maxA);
  const c = Math.cos(a), s = Math.sin(a);
  return { x: d.x * c - d.y * s, y: d.x * s + d.y * c };
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgb(c) { return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')'; }
function sh(c, f) {
  if (f <= 1) return rgb([c[0] * f, c[1] * f, c[2] * f]);
  const t = f - 1;
  return rgb([c[0] + (255 - c[0]) * t, c[1] + (255 - c[1]) * t, c[2] + (255 - c[2]) * t]);
}

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

export function mountCasaMilanoIntro(options) {
  options = options || {};
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { destroy() {}, skip() {}, getState() { return 'done'; } };
  }

  const opts = {
    logoSrc: options.logoSrc || '',
    onComplete: options.onComplete || null,
    sound: !!options.sound,
    audio: options.audio || null,
    reducedMotion: options.reducedMotion === undefined ? 'auto' : options.reducedMotion,
    zIndex: options.zIndex || 2147483000,
    container: options.container || null,
  };

  const reduced =
    opts.reducedMotion === 'auto'
      ? !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      : !!opts.reducedMotion;

  // ---- tuning constants -------------------------------------------------------------------
  const STEP = 1 / 120;          // fixed physics step (deterministic on every refresh rate)
  const MIN_POWER = 0.06;        // below this a release is a cancelled shot
  const RESTITUTION = 0.8;       // cushion bounce
  const DECEL = 0.9;             // felt friction, in table-widths / s^2
  const VMAX = 1.9;              // full-power speed, in table-widths / s
  const LAUNCH_SPEED = 0.3;      // min speed (table-widths / s) needed to jump the top rail
  const IMPACT_HOLD = reduced ? 0.35 : 0.8;
  const TS = reduced ? 0.01 : 1; // timeline scale (reduced motion = nearly instant arrival)

  // ---- DOM --------------------------------------------------------------------------------
  injectStyle();
  const root = el('div', 'cmi-root');
  root.style.zIndex = String(opts.zIndex);
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'cmi-title');
  root.tabIndex = -1;

  const canvas = el('canvas', 'cmi-canvas');
  canvas.setAttribute('aria-hidden', 'true');

  const top = el('div', 'cmi-top');
  const soundBtn = el('button', 'cmi-btn', 'Sound on');
  soundBtn.type = 'button';
  soundBtn.setAttribute('aria-pressed', 'false');
  soundBtn.setAttribute('aria-label', 'Mute or unmute sound');
  const skipBtn = el('button', 'cmi-btn', 'Skip intro');
  skipBtn.type = 'button';
  skipBtn.setAttribute('aria-label', 'Skip the intro and go to the website');
  if (opts.sound || opts.audio) top.appendChild(soundBtn);
  top.appendChild(skipBtn);

  const instr = el('div', 'cmi-instr');
  const title = el('h2', 'cmi-h', 'AIM. STRIKE. ENTER.');
  title.id = 'cmi-title';
  const sub = el('p', 'cmi-sub', 'Pull back to set your power. Aim at the Casa Milano logo. Release to enter.');
  const hint = el('p', 'cmi-hint');
  const powerWrap = el('div', 'cmi-power');
  const powerLabel = el('span', '', 'POWER');
  const bar = el('div', 'cmi-bar');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Shot power');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  bar.setAttribute('aria-valuenow', '0');
  const fill = el('i', 'cmi-fill');
  bar.appendChild(fill);
  powerWrap.appendChild(powerLabel);
  powerWrap.appendChild(bar);
  const keys = el('p', 'cmi-keys', 'Keyboard: \u2190 \u2192 aim \u00b7 hold Space to charge, release to shoot \u00b7 Esc to skip');
  instr.appendChild(title);
  instr.appendChild(sub);
  instr.appendChild(powerWrap);
  instr.appendChild(hint);
  instr.appendChild(keys);

  const live = el('div', 'cmi-sr');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('role', 'status');

  root.appendChild(canvas);
  root.appendChild(instr);
  root.appendChild(top);
  root.appendChild(live);
  (opts.container || document.body).appendChild(root);
  try { root.focus({ preventScroll: true }); } catch (e) {}

  const ctx = canvas.getContext('2d');

  // ---- bookkeeping for clean teardown -------------------------------------------------------
  const cleanups = [];
  const timers = new Set();
  function on(target, ev, fn, o) {
    target.addEventListener(ev, fn, o);
    cleanups.push(() => target.removeEventListener(ev, fn, o));
  }
  function later(fn, ms) {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  }
  function cancelLater(id) { clearTimeout(id); timers.delete(id); }

  // ---- state ------------------------------------------------------------------------------
  let state = 'init'; // init | ready | aiming | charging | fired | travelling | impact | transition | done
  let destroyed = false, finished = false;
  let W = 1, H = 1, dpr = 1, sc = 1;
  let L = null;
  let sceneT = 0, acc = 0, lastNow = 0, raf = 0;
  let T0 = null; // scene time when the logo became ready (start of arrival timeline)
  let instrShown = false;

  let logoImg = null, logoAspect = 960 / 540, logoIsPlaceholder = false;
  let bgImg = null, vigImg = null, tableImg = null, noisePattern = null;
  let dust = [];

  const ball = { x: 0, y: 0, vx: 0, vy: 0, mode: 'roll', alpha: 1, scale: 1, sink: null, flight: null };
  const aim = { x: 0, y: -1 };
  let power = 0, pressed = false, activePointer = null, drag = null;
  const kb = { left: false, right: false, charge: false, chargeT: 0 };
  const cue = { d: 0, alpha: 0, strike: null };
  const shot = { power: 0, dir: { x: 0, y: -1 }, sunk: false };
  let shots = 0, misses = 0, rollIdle = 0;
  let impactT = 0, flash = null, logoPunch = null, shaking = false, shakeT = 0;
  const particles = [], rings = [], trail = [];
  let hintTimer = null, lastPowerPct = -1, resizeTimer = null;

  // ---- audio (synthesized, optional) --------------------------------------------------------
  const sfx = (function () {
    let ac = null, master = null, noiseBuf = null, muted = false;
    const urls = opts.audio || {};
    const enabled = !!opts.sound || !!opts.audio;
    const live_ = () => enabled && !muted;
    function unlock() {
      if (!enabled) return;
      if (ac) { if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} } return; }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ac = new AC();
        master = ac.createGain();
        master.gain.value = 0.9;
        master.connect(ac.destination);
        const len = ac.sampleRate;
        noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) { ac = null; }
    }
    function tone(f0, f1, dur, g, type) {
      const t = ac.currentTime, o = ac.createOscillator(), gn = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f0, t);
      if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      gn.gain.setValueAtTime(g, t);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(gn); gn.connect(master);
      o.start(t); o.stop(t + dur + 0.03);
    }
    function noise(dur, g, ftype, f0, f1) {
      const t = ac.currentTime, s = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
      s.buffer = noiseBuf;
      f.type = ftype;
      f.frequency.setValueAtTime(f0, t);
      if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      gn.gain.setValueAtTime(g, t);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(gn); gn.connect(master);
      s.start(t); s.stop(t + dur + 0.03);
    }
    function url(u, v) { try { const a = new Audio(u); a.volume = v; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    function ok() { return live_() && ac && ac.state !== 'closed'; }
    return {
      unlock,
      setMuted(m) { muted = m; },
      isMuted() { return muted; },
      strike(p) {
        if (!live_()) return;
        if (urls.strike) return url(urls.strike, 0.8);
        if (!ok()) return;
        try { tone(950, 260, 0.06, 0.12 + 0.2 * p, 'triangle'); noise(0.05, 0.1 + 0.18 * p, 'bandpass', 2400, 1800); } catch (e) {}
      },
      tick(k) {
        if (!ok() || urls.strike) return;
        try { tone(620, 380, 0.04, 0.03 + 0.05 * clamp(k, 0, 1), 'sine'); } catch (e) {}
      },
      pocket() {
        if (!ok()) return;
        try { tone(180, 70, 0.18, 0.18, 'sine'); noise(0.12, 0.05, 'lowpass', 700, 300); } catch (e) {}
      },
      impact() {
        if (!live_()) return;
        if (urls.impact) return url(urls.impact, 0.9);
        if (!ok()) return;
        try {
          tone(150, 42, 0.4, 0.4, 'sine');
          noise(0.18, 0.16, 'highpass', 1800, 6000);
          tone(880, 0, 0.55, 0.05, 'sine');
          tone(1320, 0, 0.45, 0.035, 'sine');
        } catch (e) {}
      },
      whoosh() {
        if (!live_()) return;
        if (urls.transition) return url(urls.transition, 0.7);
        if (!ok()) return;
        try { noise(0.55, 0.09, 'bandpass', 400, 3200); } catch (e) {}
      },
      close() { try { if (ac && ac.close) ac.close(); } catch (e) {} ac = null; },
    };
  })();

  // ---- small helpers ------------------------------------------------------------------------
  function announce(msg) { live.textContent = ''; later(() => { live.textContent = msg; }, 30); }
  function setHint(text) {
    hint.textContent = text || '';
    hint.classList.toggle('cmi-on', !!text);
    if (hintTimer) cancelLater(hintTimer);
    if (text) hintTimer = later(() => { hint.classList.remove('cmi-on'); }, 5200);
  }
  function setPowerUI(p) {
    const pct = Math.round(clamp(p, 0, 1) * 100);
    if (pct === lastPowerPct) return;
    lastPowerPct = pct;
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
  }
  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * dpr));
    c.height = Math.max(1, Math.round(h * dpr));
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    return { c, g };
  }
  function rr(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y + h, x, y, r);
    g.closePath();
  }
  function rv(t0, dur) { // arrival-timeline progress 0..1
    if (T0 === null) return 0;
    return clamp((sceneT - T0 - t0 * TS) / (dur * TS), 0, 1);
  }
  function canAim() {
    return (state === 'ready' || state === 'aiming' || state === 'charging') &&
      ball.mode === 'roll' && ball.alpha > 0.6 && ball.vx === 0 && ball.vy === 0;
  }
  function coneRad() { return (24 + Math.min(18, misses * 6)) * Math.PI / 180; }
  function aimAtLogo() {
    const dx = L.logo.cx - ball.x, dy = L.logo.cy - ball.y, d = Math.hypot(dx, dy) || 1;
    aim.x = dx / d; aim.y = dy / d;
  }
  function rotateAim(a) {
    const c = Math.cos(a), s = Math.sin(a), x = aim.x, y = aim.y;
    aim.x = x * c - y * s; aim.y = x * s + y * c;
  }

  // ---- logo ---------------------------------------------------------------------------------
  function makePlaceholderLogo() {
    const c = document.createElement('canvas');
    c.width = 960; c.height = 540;
    const g = c.getContext('2d');
    if (!g) return c;

    const W0 = 960, H0 = 540, cx = 480;
    
    // Background plate with rounded corners
    g.save();
    g.fillStyle = '#080d1e';
    g.beginPath();
    g.roundRect(30, 20, 900, 500, 32);
    g.fill();

    // Outer & inner gold filigree rim
    g.strokeStyle = '#dfba67';
    g.lineWidth = 2.5;
    g.stroke();

    g.strokeStyle = '#8c6621';
    g.lineWidth = 1.5;
    g.setLineDash([6, 8]);
    g.beginPath();
    g.roundRect(44, 34, 872, 472, 24);
    g.stroke();
    g.setLineDash([]);

    // Crossed cue sticks
    g.save();
    g.translate(cx, 168);
    for (const ang of [0.45, -0.45]) {
      g.save();
      g.rotate(ang);
      g.fillStyle = '#2d68c4'; g.fillRect(-220, -3, 10, 6);
      g.fillStyle = '#f0efe8'; g.fillRect(-210, -3.5, 12, 7);
      g.fillStyle = '#c4975d'; g.fillRect(-198, -4, 300, 8);
      g.fillStyle = '#dfba67'; g.fillRect(102, -6, 6, 12);
      g.fillStyle = '#2e170c'; g.fillRect(108, -7, 110, 14);
      g.fillStyle = '#dfba67'; g.fillRect(218, -8, 6, 16);
      g.restore();
    }
    g.restore();

    // Crown Finial at top
    g.save();
    g.translate(cx, 72);
    g.fillStyle = '#dfba67';
    g.fillRect(-35, 14, 70, 4);
    g.beginPath();
    g.moveTo(0, -14); g.lineTo(12, 12); g.lineTo(-12, 12); g.closePath();
    g.fill();
    g.beginPath();
    g.arc(0, -16, 3, 0, Math.PI * 2);
    g.fillStyle = '#fffdf0';
    g.fill();
    g.restore();

    // Central CM Monogram
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#fff6d1';
    g.font = '800 84px "Times New Roman", Georgia, serif';
    g.fillText('CM', cx, 195);

    // 8-Ball Centerpiece
    g.beginPath(); g.arc(cx, 245, 26, 0, Math.PI * 2);
    g.fillStyle = '#080a0f'; g.fill();
    g.strokeStyle = '#dfba67'; g.lineWidth = 2.5; g.stroke();
    g.beginPath(); g.arc(cx, 245, 11, 0, Math.PI * 2);
    g.fillStyle = '#f8f9fc'; g.fill();
    g.fillStyle = '#080a0f';
    g.font = '900 13px sans-serif';
    g.fillText('8', cx, 246);

    // "CASA MILANO" Grand Wordmark
    const goldGrad = g.createLinearGradient(cx - 200, 0, cx + 200, 0);
    goldGrad.addColorStop(0, '#fffdf2');
    goldGrad.addColorStop(0.3, '#fceab3');
    goldGrad.addColorStop(0.7, '#e2c172');
    goldGrad.addColorStop(1, '#dfba67');
    g.fillStyle = goldGrad;
    g.font = '900 58px "Times New Roman", Georgia, serif';
    try { (g as any).letterSpacing = '12px'; } catch (e) {}
    g.fillText('CASA MILANO', cx, 360);

    // Subtitle Line & Text
    g.strokeStyle = '#dfba67';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(cx - 300, 410); g.lineTo(cx - 160, 410);
    g.moveTo(cx + 160, 410); g.lineTo(cx + 300, 410);
    g.stroke();

    g.fillStyle = '#f4de9c';
    g.font = '700 18px "Helvetica Neue", Arial, sans-serif';
    try { (g as any).letterSpacing = '7px'; } catch (e) {}
    g.fillText('LUXURIOUS GAMING CAF\u00c9', cx, 412);

    // Tri-Activity Symbols
    g.fillStyle = '#c4a456';
    g.font = '14px sans-serif';
    try { (g as any).letterSpacing = '28px'; } catch (e) {}
    g.fillText('\ud83c\udfae   \ud83c\udfb1   \ud83c\udfce\ufe0f', cx, 465);

    g.restore();
    return c;
  }
  function loadLogo() {
    return new Promise((resolve) => {
      if (!opts.logoSrc) { resolve(null); return; }
      const img = new Image();
      let done = false, tm = null;
      const fin = (v) => { if (done) return; done = true; if (tm) cancelLater(tm); resolve(v); };
      tm = later(() => fin(null), 4500);
      img.onload = () => fin(img.naturalWidth ? img : null);
      img.onerror = () => fin(null);
      img.src = opts.logoSrc;
    });
  }

  // ---- layout -------------------------------------------------------------------------------
  function layout() {
    const prev = L;
    W = Math.max(1, root.clientWidth || window.innerWidth);
    H = Math.max(1, root.clientHeight || window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    sc = clamp(H / 900, 0.6, 1.25);

    const instrH = instr.offsetHeight || 120;
    const instrTop = H - instrH;
    const padTop = Math.max(60, H * 0.04);
    const avail = Math.max(160, instrTop - padTop - 6);
    const logoZoneH = avail * 0.35, gapH = avail * 0.11, tableZoneH = avail * 0.54;

    let lh = logoAspect < 1.3 
      ? Math.min(logoZoneH * 1.15, Math.min(avail * 0.38, 220)) 
      : logoZoneH * 0.92;
    let lw = lh * logoAspect;
    const maxLW = Math.min(W * 0.72, 620);
    if (lw > maxLW) { lw = maxLW; lh = lw / logoAspect; }
    const lcx = W / 2, lcy = padTop + logoZoneH / 2;
    const logo = { x: lcx - lw / 2, y: lcy - lh / 2, w: lw, h: lh, cx: lcx, cy: lcy };

    const K = 1.49; // table outer height incl. front face, in units of u (= felt height)
    let u = Math.min(tableZoneH / K, Math.min(W * 0.94, 920) / 2.4);
    u = Math.max(u, 40);
    const outerW = 2.4 * u, outerH = 1.4 * u, depth = 0.09 * u;
    const tTop = padTop + logoZoneH + gapH + (tableZoneH - K * u) / 2;
    const table = { x: (W - outerW) / 2, y: tTop, w: outerW, h: outerH, depth, u };
    const fw = 0.13 * u, cw = 0.07 * u;
    const felt = { x0: table.x + fw + cw, y0: table.y + fw + cw, w: 2 * u, h: u };
    felt.x1 = felt.x0 + felt.w; felt.y1 = felt.y0 + felt.h;
    felt.cx = felt.x0 + u; felt.cy = felt.y0 + u / 2;

    const R = 0.052 * u, pr = 1.75 * R, pm = 1.55 * R;
    const pockets = [];
    const addP = (x, y, r, topMid) => pockets.push({ x, y, r, cap: r * 0.95, mouth: r * 1.5, topMid: !!topMid });
    addP(felt.x0 - 0.25 * pr, felt.y0 - 0.25 * pr, pr);
    addP(felt.x1 + 0.25 * pr, felt.y0 - 0.25 * pr, pr);
    addP(felt.x0 - 0.25 * pr, felt.y1 + 0.25 * pr, pr);
    addP(felt.x1 + 0.25 * pr, felt.y1 + 0.25 * pr, pr);
    addP(felt.cx, felt.y0 - 0.3 * pm, pm, true);
    addP(felt.cx, felt.y1 + 0.3 * pm, pm);

    L = {
      W, H, logo, table, felt, R, pockets, instrTop,
      start: { x: felt.cx, y: felt.y0 + 0.7 * u },
      minAnchor: Math.max(30, 0.2 * u),
      maxDrag: clamp(0.5 * u, 110, 240),
      pullMax: 0.34 * u,
    };

    if (prev) {
      const k = felt.w / prev.felt.w;
      const rp = (x, y) => ({ x: felt.x0 + (x - prev.felt.x0) * k, y: felt.y0 + (y - prev.felt.y0) * k });
      const b = rp(ball.x, ball.y);
      ball.x = b.x; ball.y = b.y; ball.vx *= k; ball.vy *= k;
      if (ball.sink) { const s = rp(ball.sink.fx, ball.sink.fy); ball.sink.fx = s.x; ball.sink.fy = s.y; }
      if (ball.flight) {
        const fl = ball.flight;
        fl.sp0 *= k; fl.spF = Math.max(fl.sp0 * 1.1, 1.15 * H);
        const dist = Math.hypot(logo.cx - ball.x, logo.cy - ball.y);
        fl.d0 = Math.max(dist + 1, dist / Math.max(0.05, 1 - fl.prog));
      }
      trail.length = 0;
    } else {
      ball.x = L.start.x; ball.y = L.start.y;
      cue.d = R * 1.4;
      aimAtLogo();
    }
  }

  // ---- pre-rendered layers ------------------------------------------------------------------
  function buildBg() {
    const o = makeCanvas(W, H), g = o.g;
    g.fillStyle = '#06070b';
    g.fillRect(0, 0, W, H);
    let lg = g.createRadialGradient(W / 2, H * 0.25, 0, W / 2, H * 0.45, Math.max(W, H) * 0.75);
    lg.addColorStop(0, 'rgba(70,84,110,0.30)');
    lg.addColorStop(0.45, 'rgba(30,38,56,0.16)');
    lg.addColorStop(1, 'rgba(6,7,11,0)');
    g.fillStyle = lg; g.fillRect(0, 0, W, H);
    // faint overhead light cone
    g.save();
    g.globalAlpha = 0.06;
    const cone = g.createLinearGradient(0, 0, 0, H * 0.9);
    cone.addColorStop(0, '#cfe8ff'); cone.addColorStop(1, 'rgba(207,232,255,0)');
    g.fillStyle = cone;
    g.beginPath();
    g.moveTo(W / 2 - W * 0.05, 0); g.lineTo(W / 2 + W * 0.05, 0);
    g.lineTo(W / 2 + W * 0.42, H * 0.9); g.lineTo(W / 2 - W * 0.42, H * 0.9);
    g.closePath(); g.fill();
    g.restore();
    // pool of light around the table
    if (L) {
      const t = L.table;
      const pl = g.createRadialGradient(t.x + t.w / 2, t.y + t.h / 2, 0, t.x + t.w / 2, t.y + t.h / 2, t.w * 0.8);
      pl.addColorStop(0, 'rgba(120,150,190,0.12)'); pl.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = pl; g.fillRect(0, 0, W, H);
    }
    // HUD corner marks
    const m = 10, len = Math.max(18, Math.min(W, H) * 0.035);
    g.strokeStyle = 'rgba(130,200,255,0.16)'; g.lineWidth = 1.2;
    const corner = (x, y, sx, sy) => { g.beginPath(); g.moveTo(x, y + sy * len); g.lineTo(x, y); g.lineTo(x + sx * len, y); g.stroke(); };
    corner(m, m, 1, 1); corner(W - m, m, -1, 1); corner(m, H - m, 1, -1); corner(W - m, H - m, -1, -1);
    bgImg = o.c;
  }
  function buildVig() {
    const o = makeCanvas(W, H), g = o.g;
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.78)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
    vigImg = o.c;
  }
  function buildDust() {
    dust = [];
    if (reduced) return;
    const n = W < 700 ? 18 : 40;
    for (let i = 0; i < n; i++) {
      dust.push({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.4, v: 4 + Math.random() * 10, a: 0.05 + Math.random() * 0.14, ph: Math.random() * 6 });
    }
  }
  function getNoise() {
    if (noisePattern) return noisePattern;
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const g = c.getContext('2d');
    const id = g.createImageData(96, 96);
    const rnd = mulberry32(5);
    for (let i = 0; i < id.data.length; i += 4) {
      const light = rnd() > 0.5;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = light ? 255 : 0;
      id.data[i + 3] = light ? Math.floor(rnd() * 22) : Math.floor(rnd() * 36);
    }
    g.putImageData(id, 0, 0);
    noisePattern = c;
    return c;
  }
  function buildTable() {
    const t = L.table, f = L.felt, u = t.u, fw = 0.13 * u, cw = 0.07 * u;
    const M = Math.ceil(u * 0.4);
    const bw = t.w + 2 * M, bh = t.h + t.depth + 2 * M;
    const o = makeCanvas(bw, bh), g = o.g;
    g.translate(M - t.x, M - t.y);
    tableImg = { c: o.c, x: t.x - M, y: t.y - M, w: bw, h: bh };
    const rng = mulberry32(11);

    // floor shadow
    g.save();
    g.translate(t.x + t.w / 2, t.y + t.h + t.depth * 0.7);
    g.scale(1, 0.16);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, t.w * 0.62);
    sg.addColorStop(0, 'rgba(0,0,0,0.7)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, t.w * 0.62, 0, TAU); g.fill();
    g.restore();

    // front face (gives the table its thickness)
    rr(g, t.x + u * 0.02, t.y + u * 0.25, t.w - u * 0.04, t.h + t.depth - u * 0.25, u * 0.06);
    const fg = g.createLinearGradient(0, t.y + t.h * 0.3, 0, t.y + t.h + t.depth);
    fg.addColorStop(0, '#3a1c0d'); fg.addColorStop(1, '#150803');
    g.fillStyle = fg; g.fill();

    // wooden frame
    rr(g, t.x, t.y, t.w, t.h, u * 0.07);
    const wg = g.createLinearGradient(0, t.y, 0, t.y + t.h);
    wg.addColorStop(0, '#a46c3d'); wg.addColorStop(0.2, '#7d4824'); wg.addColorStop(1, '#42210f');
    g.fillStyle = wg; g.fill();
    g.save();
    rr(g, t.x, t.y, t.w, t.h, u * 0.07);
    g.clip();
    const hg = g.createLinearGradient(0, t.y, 0, t.y + fw * 0.6);
    hg.addColorStop(0, 'rgba(255,230,190,0.30)'); hg.addColorStop(1, 'rgba(255,230,190,0)');
    g.fillStyle = hg; g.fillRect(t.x, t.y, t.w, fw * 0.6);
    // wood grain
    const bandsH = [[t.y, fw + cw], [f.y1, fw + cw]];
    for (let b = 0; b < bandsH.length; b++) {
      for (let i = 0; i < 24; i++) {
        const y = bandsH[b][0] + rng() * bandsH[b][1];
        g.strokeStyle = 'rgba(30,12,4,' + (0.08 + rng() * 0.12) + ')';
        g.lineWidth = 0.6 + rng() * 1.1;
        g.beginPath(); g.moveTo(t.x, y); g.quadraticCurveTo(t.x + t.w / 2, y + (rng() - 0.5) * 3, t.x + t.w, y); g.stroke();
      }
    }
    const bandsV = [[t.x, fw + cw], [f.x1, fw + cw]];
    for (let b = 0; b < bandsV.length; b++) {
      for (let i = 0; i < 10; i++) {
        const x = bandsV[b][0] + rng() * bandsV[b][1];
        g.strokeStyle = 'rgba(30,12,4,' + (0.08 + rng() * 0.12) + ')';
        g.lineWidth = 0.6 + rng() * 1.1;
        g.beginPath(); g.moveTo(x, t.y); g.quadraticCurveTo(x + (rng() - 0.5) * 3, t.y + t.h / 2, x, t.y + t.h); g.stroke();
      }
    }
    g.restore();
    g.lineWidth = 1.2; g.strokeStyle = 'rgba(0,0,0,0.5)';
    rr(g, t.x, t.y, t.w, t.h, u * 0.07); g.stroke();

    // cushion band
    rr(g, f.x0 - cw, f.y0 - cw, f.w + 2 * cw, f.h + 2 * cw, u * 0.035);
    const cg = g.createLinearGradient(0, f.y0 - cw, 0, f.y1 + cw);
    cg.addColorStop(0, '#0f7551'); cg.addColorStop(0.5, '#0c5f42'); cg.addColorStop(1, '#08402d');
    g.fillStyle = cg; g.fill();
    g.lineWidth = Math.max(1, u * 0.012); g.strokeStyle = 'rgba(0,0,0,0.55)'; g.stroke();

    // felt
    const fg2 = g.createRadialGradient(f.cx, f.cy - u * 0.15, 0, f.cx, f.cy, u * 1.3);
    fg2.addColorStop(0, '#22a171'); fg2.addColorStop(0.5, '#13794f'); fg2.addColorStop(1, '#0a4e36');
    g.fillStyle = fg2; g.fillRect(f.x0, f.y0, f.w, f.h);
    g.save();
    g.globalAlpha = 0.55;
    g.fillStyle = g.createPattern(getNoise(), 'repeat');
    g.fillRect(f.x0, f.y0, f.w, f.h);
    g.restore();
    const sheen = g.createLinearGradient(0, f.y0, 0, f.y1);
    sheen.addColorStop(0, 'rgba(255,255,255,0.06)'); sheen.addColorStop(1, 'rgba(0,0,0,0.16)');
    g.fillStyle = sheen; g.fillRect(f.x0, f.y0, f.w, f.h);

    // inner edge shadows (felt sits below the cushion)
    const ins = u * 0.06;
    let eg = g.createLinearGradient(0, f.y0, 0, f.y0 + ins);
    eg.addColorStop(0, 'rgba(0,0,0,0.42)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = eg; g.fillRect(f.x0, f.y0, f.w, ins);
    eg = g.createLinearGradient(0, f.y1, 0, f.y1 - ins);
    eg.addColorStop(0, 'rgba(0,0,0,0.3)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = eg; g.fillRect(f.x0, f.y1 - ins, f.w, ins);
    eg = g.createLinearGradient(f.x0, 0, f.x0 + ins, 0);
    eg.addColorStop(0, 'rgba(0,0,0,0.34)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = eg; g.fillRect(f.x0, f.y0, ins, f.h);
    eg = g.createLinearGradient(f.x1, 0, f.x1 - ins, 0);
    eg.addColorStop(0, 'rgba(0,0,0,0.34)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = eg; g.fillRect(f.x1 - ins, f.y0, ins, f.h);
    g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 1;
    g.strokeRect(f.x0 - 0.5, f.y0 - 0.5, f.w + 1, f.h + 1);

    // table markings
    const bx = f.x0 + f.w * 0.2;
    g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(bx, f.y0); g.lineTo(bx, f.y1); g.stroke();
    g.beginPath(); g.arc(bx, f.cy, u * 0.3, -Math.PI / 2, Math.PI / 2); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.22)';
    const spots = [[bx, f.cy - u * 0.3], [bx, f.cy], [bx, f.cy + u * 0.3], [f.cx, f.cy], [f.x0 + f.w * 0.75, f.cy]];
    for (let i = 0; i < spots.length; i++) { g.beginPath(); g.arc(spots[i][0], spots[i][1], Math.max(1.2, u * 0.011), 0, TAU); g.fill(); }

    // rail diamonds (pearl)
    const pearl = (x, y) => {
      const r = Math.max(1.6, u * 0.017);
      const pg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      pg.addColorStop(0, '#ffffff'); pg.addColorStop(1, '#b9a98a');
      g.fillStyle = pg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    };
    for (let i = 1; i <= 7; i++) {
      if (i === 4) continue;
      const x = f.x0 + (i * f.w) / 8;
      pearl(x, t.y + fw * 0.45);
      pearl(x, t.y + t.h - fw * 0.45);
    }
    for (let j = 1; j <= 3; j++) {
      const y = f.y0 + (j * f.h) / 4;
      pearl(t.x + fw * 0.45, y);
      pearl(t.x + t.w - fw * 0.45, y);
    }

    // pockets
    for (let i = 0; i < L.pockets.length; i++) {
      const p = L.pockets[i];
      g.beginPath(); g.arc(p.x, p.y, p.r * 1.22, 0, TAU);
      g.fillStyle = '#24120a'; g.fill();
      g.lineWidth = Math.max(1.2, u * 0.012); g.strokeStyle = 'rgba(190,150,80,0.85)'; g.stroke();
      const pg = g.createRadialGradient(p.x, p.y - p.r * 0.2, p.r * 0.1, p.x, p.y, p.r);
      pg.addColorStop(0, '#000000'); pg.addColorStop(0.7, '#050505'); pg.addColorStop(1, '#17110d');
      g.fillStyle = pg; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill();
      g.beginPath(); g.arc(p.x, p.y, p.r * 0.92, 0.15 * Math.PI, 0.85 * Math.PI);
      g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 1.5; g.stroke();
    }
  }
  function rebuild() { buildBg(); buildVig(); buildTable(); buildDust(); }

  // ---- gameplay -----------------------------------------------------------------------------
  function shotSpeed(p) { return VMAX * L.felt.w * (0.15 + 0.85 * Math.pow(p, 1.2)); }

  function launchEligible() {
    const f = L.felt, sp = Math.hypot(ball.vx, ball.vy);
    if (sp < LAUNCH_SPEED * f.w) return false;
    if (ball.vy >= 0) return false;
    if (Math.abs(ball.x - f.cx) > 0.8 * f.h) return false;
    const err = Math.abs(angleBetween(ball.vx, ball.vy, L.logo.cx - ball.x, L.logo.cy - ball.y));
    return err <= coneRad();
  }
  function inMouth(x, y) {
    for (let i = 0; i < L.pockets.length; i++) {
      const p = L.pockets[i];
      if (Math.hypot(x - p.x, y - p.y) < p.mouth) return true;
    }
    return false;
  }

  function fire(p) {
    if (!canAim()) return;
    state = 'fired';
    shot.power = p; shot.dir = { x: aim.x, y: aim.y }; shot.sunk = false;
    power = 0; kb.charge = false; kb.chargeT = 0;
    const from = cue.d;
    cue.strike = { t: 0, dur: lerp(0.24, 0.09, p), from, power: p, dir: { x: aim.x, y: aim.y } };
    setHint('');
  }
  function contact() {
    const s = cue.strike;
    const sp = shotSpeed(s.power);
    ball.vx = s.dir.x * sp; ball.vy = s.dir.y * sp;
    ball.mode = 'roll';
    cue.strike = null;
    state = 'travelling';
    rollIdle = 0;
    shots++;
    sfx.strike(s.power);
  }
  function startFlight() {
    const sp = Math.hypot(ball.vx, ball.vy);
    const dist = Math.hypot(L.logo.cx - ball.x, L.logo.cy - ball.y);
    ball.mode = 'flight';
    ball.flight = { t: 0, dir: { x: ball.vx / sp, y: ball.vy / sp }, sp0: sp, spF: Math.max(sp * 1.1, 1.15 * H), d0: Math.max(1, dist), prog: 0 };
    ball.vx = ball.vy = 0;
    trail.length = 0;
  }
  function startSink(i) {
    ball.mode = 'sink';
    ball.sink = { idx: i, t: 0, fx: ball.x, fy: ball.y };
    ball.vx = ball.vy = 0;
    shot.sunk = true;
    sfx.pocket();
  }
  function respawn() {
    ball.x = L.start.x; ball.y = L.start.y;
    ball.vx = ball.vy = 0;
    ball.mode = 'roll'; ball.sink = null; ball.scale = 1; ball.alpha = 0;
    backToReady();
  }
  function backToReady() {
    misses++;
    let msg;
    if (shot.sunk) msg = 'Into the pocket! Aim for the logo and pull back firmly.';
    else {
      const ang = Math.abs(angleBetween(shot.dir.x, shot.dir.y, L.logo.cx - L.start.x, L.logo.cy - L.start.y));
      msg = ang <= coneRad() + 0.25 ? 'Nearly there \u2014 pull back further for more power.' : 'Line the shot up with the Casa Milano logo.';
    }
    setHint(msg);
    announce('Missed. ' + msg);
    state = 'ready';
    power = 0;
    aimAtLogo();
    rollIdle = 0;
  }
  function triggerImpact(px, py, dx, dy) {
    if (state === 'impact' || state === 'transition' || state === 'done') return;
    state = 'impact';
    impactT = 0;
    ball.mode = 'hidden'; ball.flight = null;
    trail.length = 0;
    const lg = L.logo;
    const ix = clamp(px, lg.x, lg.x + lg.w), iy = clamp(py, lg.y, lg.y + lg.h);
    logoPunch = { t: 0, dx, dy };
    flash = { t: 0, dur: reduced ? 0.35 : 0.42 };
    if (!reduced) {
      const big = Math.max(W, H);
      rings.push({ x: ix, y: iy, t: 0, dur: 0.7, maxR: big * 0.3 });
      rings.push({ x: ix, y: iy, t: -0.12, dur: 0.8, maxR: big * 0.22 });
      const n = W < 700 ? 26 : 46, cols = ['#ffffff', '#7be6ff', '#a78bfa', '#7be6ff'];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU, v = (120 + Math.random() * 420) * sc;
        particles.push({ x: ix, y: iy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: 0.45 + Math.random() * 0.45, c: cols[i % 4] });
      }
      shaking = true; shakeT = 0;
    }
    sfx.impact();
    setPowerUI(0);
    announce('Direct hit! Entering Casa Milano.');
  }
  function startTransition(reason) {
    if (state === 'transition' || state === 'done' || finished || destroyed) return;
    state = 'transition';
    pressed = false; activePointer = null; kb.charge = false;
    root.classList.add('cmi-leaving'); // overlay stops capturing clicks immediately
    sfx.whoosh();
    if (reason === 'skip') announce('Entering the website.');
    later(() => finish(reason), reduced ? 380 : 780);
  }
  function finish(reason) {
    if (finished || destroyed) return;
    finished = true;
    state = 'done';
    teardown();
    if (typeof opts.onComplete === 'function') {
      try { opts.onComplete({ reason, shots, misses }); } catch (e) { console.error(e); }
    }
  }

  function stepBall(dt) {
    const f = L.felt, R = L.R;
    if (ball.mode === 'roll') {
      let sp = Math.hypot(ball.vx, ball.vy);
      if (sp > 0) {
        const ns = Math.max(0, sp - DECEL * f.w * dt);
        const k = ns / sp;
        ball.vx *= k; ball.vy *= k; sp = ns;
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        rollIdle = 0;
        if (ball.vy < 0 && ball.y <= f.y0 + R * 1.3 && launchEligible()) { startFlight(); return; }
        for (let i = 0; i < L.pockets.length; i++) {
          const p = L.pockets[i];
          if (Math.hypot(ball.x - p.x, ball.y - p.y) < p.cap) { startSink(i); return; }
        }
        if (!inMouth(ball.x, ball.y)) {
          const k2 = sp / (VMAX * f.w);
          if (ball.x < f.x0 + R) { ball.x = f.x0 + R; if (ball.vx < 0) { ball.vx = -ball.vx * RESTITUTION; sfx.tick(k2); } }
          else if (ball.x > f.x1 - R) { ball.x = f.x1 - R; if (ball.vx > 0) { ball.vx = -ball.vx * RESTITUTION; sfx.tick(k2); } }
          if (ball.y < f.y0 + R) { ball.y = f.y0 + R; if (ball.vy < 0) { ball.vy = -ball.vy * RESTITUTION; sfx.tick(k2); } }
          else if (ball.y > f.y1 - R) { ball.y = f.y1 - R; if (ball.vy > 0) { ball.vy = -ball.vy * RESTITUTION; sfx.tick(k2); } }
        }
      } else {
        rollIdle += dt;
        if (rollIdle > 0.3) backToReady();
      }
    } else if (ball.mode === 'flight') {
      stepFlight(dt);
    } else if (ball.mode === 'sink') {
      const s = ball.sink;
      s.t += dt;
      const p = clamp(s.t / 0.32, 0, 1), e = easeOutCubic(p), pk = L.pockets[s.idx];
      ball.x = lerp(s.fx, pk.x, e); ball.y = lerp(s.fy, pk.y, e);
      ball.scale = 1 - 0.55 * p; ball.alpha = 1 - p;
      if (s.t >= 0.95) respawn();
    }
  }
  function stepFlight(dt) {
    const fl = ball.flight, lg = L.logo;
    fl.t += dt;
    let tx = lg.cx - ball.x, ty = lg.cy - ball.y;
    const dist = Math.hypot(tx, ty) || 1;
    tx /= dist; ty /= dist;
    fl.dir = rotateToward(fl.dir, { x: tx, y: ty }, 5.5 * dt); // gentle homing = subtle aim assist
    const sp = lerp(fl.sp0, fl.spF, easeOutCubic(clamp(fl.t / 0.28, 0, 1)));
    ball.x += fl.dir.x * sp * dt; ball.y += fl.dir.y * sp * dt;
    fl.prog = clamp((fl.d0 - dist) / Math.max(1, fl.d0 - lg.h * 0.5), 0, 1);
    trail.push({ x: ball.x, y: ball.y, a: 0 });
    // collision: ball circle vs. (slightly padded) logo rectangle
    const pad = Math.min(lg.w, lg.h) * 0.06;
    const cx = clamp(ball.x, lg.x - pad, lg.x + lg.w + pad), cy = clamp(ball.y, lg.y - pad, lg.y + lg.h);
    const r = L.R * 0.8 * (1 - 0.22 * fl.prog);
    if (Math.hypot(ball.x - cx, ball.y - cy) <= r || fl.t > 2.2) {
      triggerImpact(ball.x, ball.y, fl.dir.x, fl.dir.y);
    }
  }

  function timeline() {
    if (T0 === null) return;
    if (!instrShown && sceneT >= T0 + 1.8 * TS) { instrShown = true; instr.classList.add('cmi-show'); }
    if (state === 'init' && sceneT >= T0 + 2.3 * TS) {
      state = 'ready';
      announce('Ready. Aim at the Casa Milano logo, pull back to set power and release to shoot. Keyboard: left and right arrows aim, hold space to charge and release to shoot. Press Escape or choose Skip intro to enter the website.');
    }
  }
  function updateFx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.t += dt;
      if (p.t >= p.life) { particles.splice(i, 1); continue; }
      p.vx *= 1 - 2.2 * dt;
      p.vy = p.vy * (1 - 2.2 * dt) + 160 * sc * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t >= rings[i].dur) rings.splice(i, 1); }
    if (flash) { flash.t += dt; if (flash.t >= flash.dur) flash = null; }
    if (logoPunch) { logoPunch.t += dt; if (logoPunch.t > 1.2) logoPunch = null; }
    if (shaking) { shakeT += dt; if (shakeT > 0.45) shaking = false; }
    for (let i = 0; i < trail.length; i++) trail[i].a += dt;
    while (trail.length && trail[0].a > 0.2) trail.shift();
  }

  function update(dt) {
    sceneT += dt;
    timeline();
    for (let i = 0; i < dust.length; i++) {
      const d = dust[i];
      d.y -= d.v * dt; d.ph += dt;
      if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
    }

    // keyboard aiming / charging
    if (canAim()) {
      let rot = 0;
      if (kb.left) rot -= 1;
      if (kb.right) rot += 1;
      if (rot) { rotateAim(rot * 0.75 * dt); if (state === 'ready') state = 'aiming'; }
      if (kb.charge && !pressed) {
        kb.chargeT += dt;
        power = clamp(kb.chargeT / 1.15, 0, 1);
        state = power >= MIN_POWER ? 'charging' : 'aiming';
      }
    }
    if (!pressed && !kb.charge && (state === 'ready' || state === 'aiming' || state === 'charging')) {
      power = 0;
      if (state === 'charging') state = 'aiming';
    }

    // cue
    const d0 = L.R * 1.4;
    if (state === 'fired' && cue.strike) {
      const s = cue.strike;
      s.t += dt;
      const u = clamp(s.t / s.dur, 0, 1);
      cue.d = lerp(s.from, L.R, easeInCubic(u));
      if (u >= 1) contact();
    } else {
      let target = d0 + power * L.pullMax;
      if (!reduced && state === 'ready' && !pressed) target += L.R * 0.5 * (0.5 - 0.5 * Math.cos(sceneT * 2.4));
      cue.d += (target - cue.d) * Math.min(1, dt * 24);
    }
    const cueOn = (state === 'ready' || state === 'aiming' || state === 'charging' || state === 'fired') &&
      ball.mode === 'roll' && ball.alpha > 0.6;
    cue.alpha += ((cueOn ? 1 : 0) - cue.alpha) * Math.min(1, dt * 10);

    if (ball.mode === 'roll' && ball.alpha < 1) ball.alpha = Math.min(1, ball.alpha + dt * 3);

    if (state === 'travelling') stepBall(dt);
    if (state === 'impact') { impactT += dt; if (impactT >= IMPACT_HOLD) startTransition('hit'); }
    updateFx(dt);
  }

  // ---- rendering ----------------------------------------------------------------------------
  function drawBallBody(g, x, y, r) {
    const gr = g.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.06, x, y, r * 1.05);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#f4f4f1'); gr.addColorStop(0.8, '#cfd1cc'); gr.addColorStop(1, '#8e918c');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    const rg = g.createRadialGradient(x + r * 0.5, y + r * 0.6, 0, x + r * 0.5, y + r * 0.6, r * 0.8);
    rg.addColorStop(0, 'rgba(60,170,120,0.22)'); rg.addColorStop(1, 'rgba(60,170,120,0)');
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.save();
    g.translate(x - r * 0.36, y - r * 0.44);
    g.rotate(-0.6);
    g.scale(1, 0.62);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
    sg.addColorStop(0, 'rgba(255,255,255,0.98)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, r * 0.3, 0, TAU); g.fill();
    g.restore();
  }
  function drawBall(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.save();
    ctx.translate(x + r * 0.22, y + r * 0.34);
    ctx.scale(1, 0.55);
    const sg = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.25);
    sg.addColorStop(0, 'rgba(0,0,0,0.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill();
    ctx.restore();
    drawBallBody(ctx, x, y, r);
    ctx.restore();
  }
  function drawCue(alpha) {
    if (alpha <= 0.01) return;
    const R = L.R, u = L.table.u;
    const ang = Math.atan2(aim.y, aim.x);
    const tip = cue.d;
    const by = -aim.y;
    let len = 0.95 * u;
    if (by > 0.02) {
      const room = (L.instrTop - 6 - (ball.y + by * R * 1.4)) / by;
      len = clamp(room, 0.55 * u, 0.95 * u);
    }
    const tipW = R * 0.5, buttW = R * 1.5;
    const wAt = (s) => tipW + (buttW - tipW) * Math.pow(s, 1.15);
    const X = (s) => -(tip + len * s);
    const seg = (s0, s1, col) => {
      const w0 = wAt(s0), w1 = wAt(s1), wm = Math.max(w0, w1);
      const gr = ctx.createLinearGradient(0, -wm / 2, 0, wm / 2);
      gr.addColorStop(0, sh(col, 0.55)); gr.addColorStop(0.3, sh(col, 1.05)); gr.addColorStop(0.5, sh(col, 1.35));
      gr.addColorStop(0.75, sh(col, 0.9)); gr.addColorStop(1, sh(col, 0.5));
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.moveTo(X(s0), -w0 / 2); ctx.lineTo(X(s1), -w1 / 2); ctx.lineTo(X(s1), w1 / 2); ctx.lineTo(X(s0), w0 / 2);
      ctx.closePath(); ctx.fill();
    };
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    // soft shadow on the felt
    ctx.save();
    ctx.translate(ball.x + 3 * sc, ball.y + 6 * sc);
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.moveTo(X(0), -wAt(0) / 2); ctx.lineTo(X(1), -wAt(1) / 2); ctx.lineTo(X(1), wAt(1) / 2); ctx.lineTo(X(0), wAt(0) / 2);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // the cue
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ang);
    seg(0, 0.012, [58, 120, 213]);      // chalked tip
    seg(0.012, 0.05, [240, 238, 228]);  // ferrule
    seg(0.05, 0.6, [226, 190, 138]);    // maple shaft
    seg(0.6, 0.625, [190, 150, 80]);    // joint
    seg(0.625, 1, [52, 28, 14]);        // dark butt
    seg(0.7, 0.715, [199, 162, 77]);
    seg(0.86, 0.875, [199, 162, 77]);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(0.02), -wAt(0.02) * 0.22); ctx.lineTo(X(0.6), -wAt(0.6) * 0.22); ctx.stroke();
    ctx.restore();
  }
  function drawGuide(a) {
    if (!(state === 'ready' || state === 'aiming' || state === 'charging')) return;
    if (ball.mode !== 'roll' || ball.alpha < 0.5) return;
    const R = L.R, lg = L.logo;
    const sx = ball.x + aim.x * R * 1.6, sy = ball.y + aim.y * R * 1.6;
    const up = aim.y < -0.05;
    let len = L.felt.w * 0.45;
    if (up) len = clamp((lg.y + lg.h - ball.y) / aim.y, R * 3, H * 1.2);
    const ex = ball.x + aim.x * len, ey = ball.y + aim.y * len;
    const boost = state === 'charging' ? 1 : 0.8;
    ctx.save();
    ctx.globalAlpha = a * boost;
    const gr = ctx.createLinearGradient(sx, sy, ex, ey);
    gr.addColorStop(0, 'rgba(150,235,255,0.7)'); gr.addColorStop(0.7, 'rgba(150,235,255,0.24)'); gr.addColorStop(1, 'rgba(150,235,255,0.06)');
    ctx.strokeStyle = gr;
    ctx.lineWidth = Math.max(1.2, R * 0.12);
    ctx.lineCap = 'round';
    ctx.setLineDash([R * 0.5, R * 0.6]);
    ctx.lineDashOffset = reduced ? 0 : -sceneT * R * 1.2;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.setLineDash([]);
    if (up) {
      const locked = Math.abs(angleBetween(aim.x, aim.y, lg.cx - ball.x, lg.cy - ball.y)) <= coneRad();
      const col = locked ? '125,235,255' : '167,139,250';
      const rad = R * 1.15;
      ctx.strokeStyle = 'rgba(' + col + ',' + (locked ? 0.95 : 0.55) + ')';
      ctx.lineWidth = Math.max(1.4, R * 0.14);
      ctx.beginPath(); ctx.arc(ex, ey, rad, 0, TAU); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex - rad * 1.6, ey); ctx.lineTo(ex - rad * 1.05, ey);
      ctx.moveTo(ex + rad * 1.05, ey); ctx.lineTo(ex + rad * 1.6, ey);
      ctx.moveTo(ex, ey - rad * 1.6); ctx.lineTo(ex, ey - rad * 1.05);
      ctx.moveTo(ex, ey + rad * 1.05); ctx.lineTo(ex, ey + rad * 1.6);
      ctx.stroke();
      ctx.fillStyle = 'rgba(' + col + ',' + (locked ? 0.95 : 0.5) + ')';
      ctx.beginPath(); ctx.arc(ex, ey, Math.max(1.6, R * 0.16), 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawFlightBall() {
    const fl = ball.flight;
    if (!fl) return;
    const r = L.R * (1 - 0.22 * fl.prog);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1], b = trail[i], k = 1 - b.a / 0.2;
      ctx.strokeStyle = 'rgba(120,225,255,' + (0.55 * Math.max(0, k)).toFixed(3) + ')';
      ctx.lineWidth = Math.max(0.5, r * 1.5 * Math.max(0, k));
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.restore();
    const stretch = 1 + 2.2 * clamp((fl.prog - 0.45) / 0.55, 0, 1);
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(Math.atan2(fl.dir.y, fl.dir.x));
    ctx.scale(stretch, 1);
    drawBallBody(ctx, 0, 0, r);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, r * 3.2);
    const ga = 0.18 + 0.4 * fl.prog;
    gr.addColorStop(0, 'rgba(160,235,255,' + ga.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(160,235,255,0)');
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, r * 3.2, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawLogo() {
    if (!logoImg) return;
    const lg = L.logo, e = easeOutCubic(rv(0, 1.1));
    if (e <= 0) return;
    let s = 0.9 + 0.1 * e, ox = 0, oy = 0, boost = 0;
    if (logoPunch) {
      const t = logoPunch.t, env = Math.exp(-6.5 * t);
      if (!reduced) {
        s *= 1 + 0.11 * env * Math.cos(22 * t);
        const rec = 15 * sc * env * Math.sin(16 * t);
        ox = logoPunch.dx * rec; oy = logoPunch.dy * rec;
      }
      boost = 0.5 * env;
    }
    const approach = ball.mode === 'flight' && ball.flight ? ball.flight.prog * 0.35 : 0;
    const glow = 0.16 + (reduced ? 0 : 0.08 * Math.sin(sceneT * 1.6)) + approach + boost;
    ctx.save();
    ctx.translate(lg.cx + ox, lg.cy + oy);
    ctx.scale(s, s);
    ctx.globalAlpha = e;
    ctx.globalCompositeOperation = 'lighter';
    const rad = Math.max(lg.w, lg.h) * 0.85;
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
    gr.addColorStop(0, 'rgba(90,210,255,' + (glow * 0.55).toFixed(3) + ')');
    gr.addColorStop(0.5, 'rgba(120,90,255,' + (glow * 0.25).toFixed(3) + ')');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(logoImg, -lg.w / 2, -lg.h / 2, lg.w, lg.h);
    ctx.restore();
  }
  function drawFx() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (flash) {
      const k = 1 - flash.t / flash.dur, lg = L.logo;
      const rad = Math.max(lg.w, lg.h) * 1.1;
      const gr = ctx.createRadialGradient(lg.cx, lg.cy, 0, lg.cx, lg.cy, rad);
      gr.addColorStop(0, 'rgba(210,245,255,' + (0.5 * k * k).toFixed(3) + ')');
      gr.addColorStop(0.5, 'rgba(120,200,255,' + (0.2 * k * k).toFixed(3) + ')');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(lg.cx, lg.cy, rad, 0, TAU); ctx.fill();
    }
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      if (r.t < 0) continue;
      const k = r.t / r.dur;
      ctx.strokeStyle = 'rgba(140,230,255,' + (0.7 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = lerp(6, 1, k) * sc;
      ctx.beginPath(); ctx.arc(r.x, r.y, Math.max(1, r.maxR * easeOutCubic(k)), 0, TAU); ctx.stroke();
    }
    ctx.lineCap = 'round';
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i], k = 1 - p.t / p.life;
      ctx.globalAlpha = clamp(k, 0, 1);
      ctx.strokeStyle = p.c;
      ctx.lineWidth = 2 * sc;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035); ctx.stroke();
    }
    ctx.restore();
  }
  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(bgImg, 0, 0, W, H);

    if (dust.length) {
      const fade = clamp(sceneT / 1.2, 0, 1);
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        ctx.fillStyle = 'rgba(190,215,255,' + (d.a * fade * (0.6 + 0.4 * Math.sin(d.ph * 1.3))).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, TAU); ctx.fill();
      }
    }

    ctx.save();
    if (shaking) {
      const k = 1 - shakeT / 0.45, A = 9 * sc * k * k;
      ctx.translate(Math.sin(shakeT * 97) * A, Math.cos(shakeT * 83) * A);
    }
    drawLogo();

    const ta = easeOutCubic(rv(0.85, 1.1)), ba = rv(1.7, 0.5);
    if (ta > 0) {
      ctx.save();
      ctx.translate(0, (1 - ta) * H * 0.3);
      ctx.globalAlpha = ta;
      ctx.drawImage(tableImg.c, tableImg.x, tableImg.y, tableImg.w, tableImg.h);
      ctx.globalAlpha = 1;
      if (ba > 0) {
        drawGuide(ba);
        if (ball.mode === 'roll' || ball.mode === 'sink') drawBall(ball.x, ball.y, L.R * ball.scale, ball.alpha * ba);
        drawCue(cue.alpha * ba);
      }
      ctx.restore();
    }
    if (ball.mode === 'flight') drawFlightBall();
    drawFx();
    ctx.restore();

    ctx.drawImage(vigImg, 0, 0, W, H);
    const uiP = state === 'fired' || state === 'travelling' ? shot.power : (state === 'impact' || state === 'transition') ? 0 : power;
    setPowerUI(uiP);
  }

  function frame(now) {
    if (destroyed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
    lastNow = now;
    acc += dt;
    let guard = 0;
    while (acc >= STEP && guard++ < 30) { update(STEP); acc -= STEP; }
    if (guard >= 30) acc = 0;
    render();
  }
  function startLoop() {
    if (raf || destroyed) return;
    lastNow = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stopLoop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ---- input --------------------------------------------------------------------------------
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onDown(e) {
    sfx.unlock();
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!canAim() || activePointer !== null || kb.charge) return;
    const p = pos(e);
    let ax = p.x - ball.x, ay = p.y - ball.y, d = Math.hypot(ax, ay), anchor = p;
    if (d < L.minAnchor) {
      ax = aim.x; ay = aim.y; d = 1;
      anchor = { x: ball.x + aim.x * L.minAnchor * 1.6, y: ball.y + aim.y * L.minAnchor * 1.6 };
    }
    drag = { a0: { x: ax / d, y: ay / d }, anchor };
    aim.x = drag.a0.x; aim.y = drag.a0.y;
    pressed = true;
    activePointer = e.pointerId;
    power = 0;
    state = 'aiming';
    canvas.style.cursor = 'grabbing';
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }
  function onMove(e) {
    if (pressed) {
      if (e.pointerId !== activePointer || !drag || !canAim()) return;
      const p = pos(e), dx = p.x - drag.anchor.x, dy = p.y - drag.anchor.y;
      const along = dx * drag.a0.x + dy * drag.a0.y;       // movement along the aim line
      const lx = dx - along * drag.a0.x, ly = dy - along * drag.a0.y; // sideways movement
      const qx = drag.anchor.x + lx - ball.x, qy = drag.anchor.y + ly - ball.y, qd = Math.hypot(qx, qy) || 1;
      aim.x = qx / qd; aim.y = qy / qd;
      power = clamp(-along / L.maxDrag, 0, 1);
      state = power >= MIN_POWER ? 'charging' : 'aiming';
      e.preventDefault();
    } else if ((e.pointerType === 'mouse' || e.pointerType === 'pen') && canAim() && !kb.charge) {
      const p = pos(e), dx = p.x - ball.x, dy = p.y - ball.y, d = Math.hypot(dx, dy);
      if (d > L.minAnchor * 0.5) { aim.x = dx / d; aim.y = dy / d; if (state === 'ready') state = 'aiming'; }
    }
  }
  function endPress(cancel) {
    const wasPressed = pressed, id = activePointer, p = power;
    pressed = false; activePointer = null; drag = null;
    canvas.style.cursor = 'crosshair';
    try { if (id !== null) canvas.releasePointerCapture(id); } catch (err) {}
    if (!wasPressed) return;
    if (!cancel && p >= MIN_POWER && canAim()) fire(p);
    else { power = 0; if (state === 'charging' || state === 'aiming') state = 'aiming'; }
  }
  function onUp(e) { if (pressed && e.pointerId === activePointer) endPress(false); }
  function onCancel(e) { if (pressed && e.pointerId === activePointer) endPress(true); }

  function isChargeKey(k) { return k === ' ' || k === 'Spacebar' || k === 'Enter'; }
  function onKeyDown(e) {
    if (finished || destroyed) return;
    if (e.key === 'Escape') { e.preventDefault(); startTransition('skip'); return; }
    const onBtn = e.target && e.target.tagName === 'BUTTON';
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { kb.left = true; sfx.unlock(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { kb.right = true; sfx.unlock(); e.preventDefault(); }
    else if (isChargeKey(e.key) && !onBtn) {
      e.preventDefault();
      if (!e.repeat && canAim() && !pressed && !kb.charge) { kb.charge = true; kb.chargeT = 0; sfx.unlock(); }
    }
  }
  function onKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') kb.left = false;
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') kb.right = false;
    else if (isChargeKey(e.key) && kb.charge) {
      kb.charge = false; kb.chargeT = 0;
      const p = power;
      if (p >= MIN_POWER && canAim()) fire(p);
      else { power = 0; if (state === 'charging') state = 'aiming'; }
    }
  }

  function onVisibility() {
    if (document.hidden) stopLoop();
    else if (!destroyed && !finished) { acc = 0; startLoop(); }
  }
  function onResize() {
    if (resizeTimer) cancelLater(resizeTimer);
    resizeTimer = later(() => { resizeTimer = null; if (destroyed) return; layout(); rebuild(); }, 60);
  }

  // ---- teardown -----------------------------------------------------------------------------
  function teardown() {
    if (destroyed) return;
    destroyed = true;
    stopLoop();
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    for (let i = 0; i < cleanups.length; i++) { try { cleanups[i](); } catch (e) {} }
    cleanups.length = 0;
    sfx.close();
    if (root.parentNode) root.parentNode.removeChild(root);
    bgImg = vigImg = tableImg = noisePattern = logoImg = null;
  }

  // ---- wire up ------------------------------------------------------------------------------
  layout();
  rebuild();

  on(canvas, 'pointerdown', onDown);
  on(canvas, 'pointermove', onMove);
  on(canvas, 'pointerup', onUp);
  on(canvas, 'pointercancel', onCancel);
  on(canvas, 'lostpointercapture', onCancel);
  on(canvas, 'contextmenu', (e) => e.preventDefault());
  on(root, 'wheel', (e) => e.preventDefault(), { passive: false });
  on(document, 'keydown', onKeyDown);
  on(document, 'keyup', onKeyUp);
  on(document, 'visibilitychange', onVisibility);
  on(window, 'blur', () => { kb.left = kb.right = false; if (kb.charge) { kb.charge = false; kb.chargeT = 0; power = 0; } });
  on(skipBtn, 'click', () => startTransition('skip'));
  on(soundBtn, 'click', () => {
    sfx.unlock();
    sfx.setMuted(!sfx.isMuted());
    soundBtn.textContent = sfx.isMuted() ? 'Sound off' : 'Sound on';
    soundBtn.setAttribute('aria-pressed', sfx.isMuted() ? 'true' : 'false');
  });
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
    cleanups.push(() => ro.disconnect());
  } else {
    on(window, 'resize', onResize);
  }

  loadLogo().then((img) => {
    if (destroyed) return;
    if (img) { logoImg = img; logoAspect = img.naturalWidth / img.naturalHeight; logoIsPlaceholder = false; }
    else {
      logoImg = makePlaceholderLogo(); logoAspect = 960 / 540; logoIsPlaceholder = true;
      if (typeof console !== 'undefined') console.warn('[Casa Milano intro] No logo loaded \u2014 showing the built-in placeholder. Pass a valid logoSrc.');
    }
    layout();
    rebuild();
    T0 = Math.max(0.35 * TS, sceneT);
  });

  if (!document.hidden) startLoop();

  return {
    destroy() { teardown(); },
    skip() { startTransition('skip'); },
    getState() { return state; },
  };
}

if (typeof window !== 'undefined') window.mountCasaMilanoIntro = mountCasaMilanoIntro;
export default mountCasaMilanoIntro;
