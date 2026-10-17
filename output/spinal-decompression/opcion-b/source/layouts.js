// Opción B — evolución cercana a la opción A.
// Copia independiente de studio/layouts.js (A): mismos fondos, ilustración y estructura,
// con texto secundario más grande, público explícito en la lámina 1, dos posiciones
// oficiales en la lámina 2 y un CTA que dice exactamente qué hacer.

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const lines = (s) => esc(s).replace(/\n/g, '<br>');

export function styles({ brand, u }) {
  const c = brand.colors;
  const M = Math.round(2 * u); // distance to border: 2 units (manual p. 5)
  return `
@font-face { font-family: 'Noto Sans'; font-weight: 100; src: url('${brand.fontUrl}/noto-sans-latin-100-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-300-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-ext-300-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }
@font-face { font-family: 'Noto Sans'; font-weight: 400; src: url('${brand.fontUrl}/noto-sans-latin-400-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-600-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-ext-600-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }

:root { --enterprise: ${c.enterpriseBlue}; --dark: ${c.darkBlue}; --sky: ${c.skyBlue}; --white: ${c.white}; --m: ${M}px; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #e9edf2; font-family: 'Noto Sans', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; margin: 0 0 40px; color: var(--white); }
.slide p, .slide h1, .slide h2, .slide h3 { text-align: left; text-wrap: pretty; }
.slide h1, .slide h2 { text-wrap: balance; }

.bg-dark { background: radial-gradient(130% 95% at 108% -8%, var(--enterprise) 0%, var(--dark) 78%); }
.bg-light { background: radial-gradient(120% 90% at -10% -8%, var(--sky) 0%, var(--white) 72%); color: var(--dark); }

.logo { position: absolute; top: var(--m); right: var(--m); width: ${brand.logoWidth}px; line-height: 0; }
.logo svg { width: 100%; height: auto; }
.logo.white { color: var(--white); } .logo.blue { color: var(--enterprise); }

/* Swipe cue: small outlined pill, visible but secondary */
.swipe { position: absolute; right: var(--m); bottom: var(--m); display: flex; align-items: center; gap: 12px;
  font-size: 30px; font-weight: 400; color: var(--white); border: 1.5px solid rgba(255,255,255,.55);
  border-radius: 999px; padding: 10px 18px 10px 26px; line-height: 1; }
.swipe svg { width: 40px; height: 40px; fill: currentColor; }

/* ---------- 1 · Commemoration ---------- */
.c-audience { position: absolute; left: var(--m); top: calc(var(--m) + 28px); font-size: 30px; font-weight: 600;
  color: var(--sky); line-height: 1.2; }
.c-spine { position: absolute; top: 300px; right: 70px; width: 410px; height: 891px; }
.c-spine svg { width: 100%; height: 100%; }
.c-main { position: absolute; left: var(--m); top: 300px; width: 500px; }
.pill { display: inline-block; background: var(--sky); color: var(--dark); font-weight: 600; font-size: 30px;
  line-height: 1; padding: 12px 22px 13px; border-radius: 999px; margin-bottom: 22px; }
.c-eyebrow { font-size: 52px; font-weight: 300; line-height: 1.12; }
.c-title { font-size: 116px; font-weight: 600; line-height: 1; letter-spacing: -1.5px; margin-top: 48px; text-wrap: initial; }
.c-question { font-size: 46px; font-weight: 400; line-height: 1.2; margin-top: 40px; color: var(--sky); max-width: 480px; }

/* ---------- 2 · Positions ---------- */
.p-box { position: absolute; left: 0; top: 0; width: 1080px; height: 700px; overflow: hidden;
  background: radial-gradient(75% 70% at -8% -8%, var(--sky) 0%, var(--white) 70%); }
.p-pos { position: absolute; top: 280px; display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
.p-pos .ph { height: 300px; display: flex; align-items: flex-end; } /* common baseline for both photos */
.p-pos img { display: block; height: auto; }
.p-pos span { font-size: 30px; font-weight: 600; color: var(--dark); line-height: 1.1; }
.p-text { position: absolute; left: var(--m); right: var(--m); top: 760px; }
.p-logo { display: block; width: 400px; height: auto; margin: 0 0 30px -10px; } /* official web asset, native size */
.p-stat { display: flex; align-items: baseline; gap: 24px; }
.p-stat b { font-size: 150px; font-weight: 100; line-height: .9; letter-spacing: -3px; }
.p-stat span { font-size: 46px; font-weight: 300; line-height: 1.12; }
.p-body { font-size: 38px; font-weight: 400; line-height: 1.3; margin-top: 34px; color: var(--sky); max-width: 860px; }

/* ---------- 3 · Benefits + CTA ---------- */
.b-title { position: absolute; left: var(--m); top: 280px; width: 640px; font-size: 64px; font-weight: 300;
  line-height: 1.12; color: var(--enterprise); }
.b-list { position: absolute; left: var(--m); right: var(--m); top: 470px; list-style: none; }
.b-item { display: flex; gap: 34px; align-items: center; padding: 36px 0; border-top: 1.5px solid rgba(0,80,140,.25); }
.b-item:last-child { border-bottom: 1.5px solid rgba(0,80,140,.25); }
.b-item svg { flex: 0 0 auto; width: 92px; height: 92px; fill: var(--enterprise); }
.b-item h3 { font-size: 42px; font-weight: 600; line-height: 1.15; color: var(--dark); }
.b-item p { font-size: 33px; font-weight: 400; line-height: 1.3; color: var(--enterprise); margin-top: 6px; }
.b-cta { position: absolute; left: 0; right: 0; bottom: 0; height: 300px; background: var(--enterprise);
  padding: 0 var(--m); display: flex; flex-direction: column; justify-content: center; }
.b-cta-text { font-size: 58px; font-weight: 300; line-height: 1.1; color: var(--white); }
.b-cta small { display: block; font-size: 32px; font-weight: 600; color: var(--sky); margin-top: 18px; }
`;
}

// Stylised lateral view of the spine — copied unchanged from studio/layouts.js (opción A).
export function spineSVG({ w = 520, h = 1130, sky = '#96d2ff' } = {}) {
  const counts = [7, 12, 5];
  const n = counts.reduce((a, b) => a + b);
  const segs = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    segs.push({ i, t, body: 22 + 30 * t ** 1.2, disc: 7 + 8 * t, depth: 50 + 70 * t ** 1.1 });
  }
  const sacrumH = 150;
  const total = segs.reduce((a, s) => a + s.body + s.disc, 0) + sacrumH;
  const scale = (h - 40) / total;
  const A = 42, cx = w * 0.58;
  const xAt = (t) => cx + A * Math.sin((2 * Math.PI * (t - 0.06)) / 0.76 + Math.PI / 2);
  let y = 20, out = [], discs = [];
  for (const s of segs) {
    const bh = s.body * scale, dh = s.disc * scale, d = s.depth * scale * 1.05;
    const yc = y + bh / 2;
    const tt = s.t * 0.92;
    const x = xAt(tt);
    const ang = (Math.atan2(xAt(tt + 0.01) - xAt(tt - 0.01), 0.02 * total * scale) * -180) / Math.PI;
    const lumbar = s.i >= 19;
    const sp = (14 + 34 * s.t) * scale * 1.6;
    out.push(`<g transform="translate(${x.toFixed(1)} ${yc.toFixed(1)}) rotate(${ang.toFixed(2)})">
      <rect x="${(-d / 2).toFixed(1)}" y="${(-bh / 2).toFixed(1)}" width="${d.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bh * 0.28).toFixed(1)}"
        fill="rgba(150,210,255,${lumbar ? 0.16 : 0.08})" stroke="#fff" stroke-opacity="${lumbar ? 0.95 : 0.7}" stroke-width="1.6"/>
      <path d="M${(-d / 2).toFixed(1)} ${(-bh * 0.22).toFixed(1)} L${(-d / 2 - d * 0.28).toFixed(1)} ${(-bh * 0.3).toFixed(1)}
        L${(-d / 2 - d * 0.28 - sp).toFixed(1)} ${(bh * 0.55).toFixed(1)} L${(-d / 2 - d * 0.22 - sp).toFixed(1)} ${(bh * 0.85).toFixed(1)}
        L${(-d / 2 - d * 0.18).toFixed(1)} ${(bh * 0.32).toFixed(1)} L${(-d / 2).toFixed(1)} ${(bh * 0.22).toFixed(1)}"
        fill="none" stroke="#fff" stroke-opacity="${lumbar ? 0.8 : 0.5}" stroke-width="1.4" stroke-linejoin="round"/>
    </g>`);
    y += bh;
    if (s.i < n - 1) {
      const xd = xAt(tt + 0.5 / n);
      discs.push(`<g transform="translate(${xd.toFixed(1)} ${(y + dh / 2).toFixed(1)}) rotate(${ang.toFixed(2)})">
        <rect x="${(-d * 0.46).toFixed(1)}" y="${(-dh * 0.36).toFixed(1)}" width="${(d * 0.92).toFixed(1)}" height="${(dh * 0.72).toFixed(1)}"
          rx="${(dh * 0.36).toFixed(1)}" fill="${sky}" opacity="${lumbar || s.i === 18 ? 1 : 0.55}"
          ${lumbar || s.i === 18 ? 'filter="url(#glow)"' : ''}/></g>`);
    }
    y += dh;
  }
  const sx = xAt(0.94), sw = 120 * scale * 1.05;
  const sacrum = `<path d="M${(sx - sw / 2).toFixed(1)} ${(y + 4).toFixed(1)}
    C${(sx - sw / 2 - 18).toFixed(1)} ${(y + sacrumH * scale * 0.55).toFixed(1)} ${(sx - sw * 0.5).toFixed(1)} ${(y + sacrumH * scale * 0.9).toFixed(1)} ${(sx - sw * 0.75).toFixed(1)} ${(y + sacrumH * scale).toFixed(1)}
    C${(sx - sw * 0.35).toFixed(1)} ${(y + sacrumH * scale * 0.85).toFixed(1)} ${(sx + sw * 0.25).toFixed(1)} ${(y + sacrumH * scale * 0.5).toFixed(1)} ${(sx + sw / 2).toFixed(1)} ${(y + 4).toFixed(1)} Z"
    fill="rgba(150,210,255,0.08)" stroke="#fff" stroke-opacity="0.6" stroke-width="1.6" stroke-linejoin="round"/>`;
  const lum = segs.slice(19).reduce((a, s) => a + (s.body + s.disc) * scale, 0);
  const halo = `<ellipse cx="${xAt(0.82).toFixed(1)}" cy="${(y - lum / 2).toFixed(1)}" rx="${(w * 0.42).toFixed(1)}" ry="${(lum * 0.9).toFixed(1)}" fill="url(#halo)"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="glow" x="-60%" y="-300%" width="220%" height="700%"><feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="halo"><stop offset="0" stop-color="${sky}" stop-opacity=".35"/><stop offset="1" stop-color="${sky}" stop-opacity="0"/></radialGradient>
    </defs>
    ${halo}${discs.join('')}${out.join('')}${sacrum}
  </svg>`;
}

const swipe = (text, ctx) => (text ? `<div class="swipe blk">${esc(text)}${ctx.icon('swipe_left')}</div>` : '');

export const layouts = {
  commemoration: (s, ctx) => `
    <p class="c-audience blk">${esc(s.audience)}</p>
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <div class="c-spine blk">${spineSVG({ sky: ctx.brand.colors.skyBlue })}</div>
    <div class="c-main blk">
      <span class="pill">${esc(s.datePill)}</span>
      <p class="c-eyebrow">${lines(s.eyebrow)}</p>
      <h1 class="c-title">${lines(s.title)}</h1>
      <p class="c-question">${lines(s.question)}</p>
    </div>
    ${swipe(s.swipe, ctx)}`,

  positions: (s, ctx) => `
    <div class="p-box">
      ${s.images.map((im) => `<figure class="p-pos" style="left:${im.left}px">
        <div class="ph"><img src="${ctx.asset(im.src)}" alt="${esc(im.alt)}" style="width:${im.width}px"></div>
        <span>${esc(im.label)}</span></figure>`).join('')}
    </div>
    <div class="logo blue blk" data-logo>${ctx.logo}</div>
    <div class="p-text blk">
      <img class="p-logo" src="${ctx.asset(s.productLogo)}" alt="BTL Spinal Decompression">
      <div class="p-stat"><b>${esc(s.stat.value)}</b><span>${lines(s.stat.label)}</span></div>
      <p class="p-body">${esc(s.body)}</p>
    </div>
    ${swipe(s.swipe, ctx)}`,

  benefits: (s, ctx) => `
    <div class="logo blue blk" data-logo>${ctx.logo}</div>
    <h2 class="b-title blk">${esc(s.title)}</h2>
    <ul class="b-list blk">
      ${s.benefits.map((b) => `<li class="b-item">${ctx.icon(b.icon)}<div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div></li>`).join('')}
    </ul>
    <div class="b-cta blk">
      <p class="b-cta-text">${lines(s.cta)}</p>
      <small>${esc(s.signature)}</small>
    </div>`,
};

export const backgrounds = { commemoration: 'bg-dark', positions: 'bg-dark', benefits: 'bg-light' };
