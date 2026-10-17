// Slide layouts. Each layout takes the slide's editorial content and a context
// ({ brand, u, asset, icon, logo }) and returns the slide's inner HTML.
// All visual decisions live here and in styles(); copy lives in content/*.json.

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Escaped text with explicit line breaks (\n in content) kept.
const lines = (s) => esc(s).replace(/\n/g, '<br>');
// Hero title only: **words** are set in SemiBold (an exception to manual p. 19, on the user's explicit request).
const emphasis = (s) => lines(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

export function styles({ brand, u }) {
  const c = brand.colors;
  const S = brand.bodySize;
  const M = Math.round(2 * u); // distance to border: 2 units (manual p. 5)
  return `
@font-face { font-family: 'Noto Sans'; font-weight: 100; src: url('${brand.fontUrl}/noto-sans-latin-100-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-300-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-ext-300-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }
@font-face { font-family: 'Noto Sans'; font-weight: 400; src: url('${brand.fontUrl}/noto-sans-latin-400-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-600-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-ext-600-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }

:root {
  --enterprise: ${c.enterpriseBlue}; --dark: ${c.darkBlue}; --sky: ${c.skyBlue}; --white: ${c.white};
  --u: ${u}px; --m: ${M}px; --s: ${S}px; --t: ${Math.max(30, Math.round((S * 2) / 3))}px; /* 30 px floor: legible on a phone feed */
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #e9edf2; font-family: 'Noto Sans', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; margin: 0 0 40px; color: var(--white); }
.slide p, .slide h1, .slide h2, .slide h3 { text-align: left; text-wrap: pretty; } /* left alignment (manual p. 19) */
.slide h1, .slide h2 { text-wrap: balance; }

/* Backgrounds: radial gradient of two brand colours, light source outside a corner (manual p. 15) */
.bg-dark { background: radial-gradient(130% 95% at 108% -8%, var(--enterprise) 0%, var(--dark) 78%); }
/* Product slide: the photo box covers the top, so the light source sits at the top-right of the dark band */
.bg-dark-band { background: radial-gradient(110% 60% at 108% 50%, var(--enterprise) 0%, var(--dark) 78%); }
.bg-light { background: radial-gradient(120% 90% at -10% -8%, var(--sky) 0%, var(--white) 72%); color: var(--dark); }
/* Light hero with the sky light from the top-right corner (lightFrom: "right"), e.g. to keep people on the left clear. */
.bg-light.light-right { background: radial-gradient(110% 80% at 110% -8%, var(--sky) 0%, var(--white) 66%); }

.logo { position: absolute; top: var(--m); right: var(--m); width: ${brand.logoWidth}px; line-height: 0; }
.logo svg { width: 100%; height: auto; }
.logo.white { color: var(--white); } .logo.blue { color: var(--enterprise); }

.swipe { position: absolute; right: var(--m); bottom: var(--m); display: flex; align-items: center; gap: 12px;
  font-size: var(--t); font-weight: 400; color: var(--white); }
.swipe svg { width: 52px; height: 52px; fill: currentColor; }

/* ---------- 1 · Commemoration ---------- */
.c-spine { position: absolute; top: 300px; right: 70px; width: 410px; height: 891px; }
.c-spine svg { width: 100%; height: 100%; }
.c-main { position: absolute; left: var(--m); top: 320px; width: 500px; }
.pill { display: inline-block; background: var(--sky); color: var(--dark); font-weight: 600; font-size: var(--t);
  line-height: 1; padding: 12px 22px 13px; border-radius: 999px; margin-bottom: 26px; }
.c-eyebrow { font-size: 52px; font-weight: 300; line-height: 1.12; }
.c-title { font-size: 116px; font-weight: 600; line-height: 1; letter-spacing: -1.5px; margin-top: 52px; text-wrap: initial; }
.c-main.wide { width: 820px; } /* cover without illustration */
.c-main.wide .c-question { max-width: 720px; }
/* Cover with the femur (illustration: "bone", bone-health topics): narrower bone on the right, wider text column. */
.c-bone { position: absolute; top: 250px; right: 60px; width: 270px; height: 900px; }
.c-bone svg { width: 100%; height: 100%; overflow: visible; }
.c-main.bone { width: 640px; }
.c-main.bone .c-question { max-width: 640px; }
.c-question { font-size: 42px; font-weight: 300; line-height: 1.22; margin-top: 44px; color: var(--sky); max-width: 480px; }

/* ---------- 2 · Product ---------- */
.p-box { position: absolute; left: 0; top: 0; width: 1080px; height: 720px; overflow: hidden;
  background: radial-gradient(75% 70% at -8% -8%, var(--sky) 0%, var(--white) 70%); }
.p-photo { position: absolute; left: 0; top: 70px; width: 1152px; mix-blend-mode: multiply; }
.p-photo.flat { mix-blend-mode: normal; } /* photo background matches the box colour */
/* Several treatment positions instead of a single photo; white photo backgrounds blend into the gradient */
.p-pos { position: absolute; margin: 0; }
.p-pos img { display: block; height: auto; mix-blend-mode: multiply; }
.p-pos figcaption { position: absolute; font-size: var(--t); font-weight: 600; color: var(--dark); line-height: 1.1; white-space: nowrap; }
.p-text { position: absolute; left: var(--m); right: var(--m); top: 770px; }
.p-eyebrow { font-size: var(--t); font-weight: 600; color: var(--sky); letter-spacing: .5px; }
.p-logo { display: block; width: 400px; height: auto; margin: 0 0 22px -10px; } /* official web asset, shown at native size */
.p-title { font-size: 54px; font-weight: 300; line-height: 1.15; margin-top: 14px; max-width: 820px; }
.p-row { display: flex; gap: 48px; align-items: flex-start; margin-top: 34px; }
.p-stat { flex: 0 0 auto; border-left: 2px solid var(--sky); padding-left: 24px; }
.p-stat b { display: block; font-size: 92px; font-weight: 100; line-height: .95; color: var(--white); }
.p-stat span { display: block; font-size: var(--t); font-weight: 400; line-height: 1.25; margin-top: 8px; max-width: 240px; }
.p-body { font-size: 32px; line-height: 1.35; font-weight: 400; padding-top: 6px; }

/* ---------- 3 · Benefits + CTA ---------- */
.b-title { position: absolute; left: var(--m); top: 270px; width: 700px; font-size: 64px; font-weight: 300;
  line-height: 1.12; color: var(--enterprise); }
.b-list { position: absolute; left: var(--m); right: var(--m); top: 500px; list-style: none; }
.b-item { display: flex; gap: 36px; align-items: center; padding: 40px 0; border-top: 1.5px solid rgba(0,80,140,.25); }
.b-item:last-child { border-bottom: 1.5px solid rgba(0,80,140,.25); }
.b-item svg { flex: 0 0 auto; width: 92px; height: 92px; fill: var(--enterprise); }
.b-item h3 { font-size: 36px; font-weight: 600; line-height: 1.2; color: var(--dark); }
.b-item p { font-size: 32px; font-weight: 400; line-height: 1.3; color: var(--enterprise); margin-top: 6px; }
.b-cta { position: absolute; left: 0; right: 0; bottom: 0; height: 250px; background: var(--enterprise);
  padding: 0 var(--m); display: flex; flex-direction: column; justify-content: center; }
.b-cta-text { font-size: 54px; font-weight: 300; line-height: 1.1; color: var(--white); }
.b-cta small { display: block; font-size: var(--t); font-weight: 600; color: var(--sky); margin-top: 14px; }

/* ===== Layouts added for REACH Content Studio (v2). Existing layouts above are unchanged. ===== */
.bg-blue { background: radial-gradient(120% 90% at 108% -8%, var(--sky) 0%, var(--enterprise) 58%, var(--dark) 100%); }
.bg-light .swipe { color: var(--enterprise); }
.bg-light .pill { background: var(--enterprise); color: var(--white); }
.img-frame { position: absolute; inset: 0; overflow: hidden; }
.img-frame img { position: absolute; display: block; height: auto; }
.bg-light .img-frame img, .sp-panel img { mix-blend-mode: multiply; } /* white photo backgrounds blend into light areas */

/* ---------- hero · large product image with headline ---------- */
.h-shade { position: absolute; left: 0; right: 0; bottom: 0; height: 780px;
  background: linear-gradient(to top, var(--dark) 42%, rgba(0, 10, 50, 0)); }
.bg-light .h-shade { background: linear-gradient(to top, var(--white) 40%, rgba(255, 255, 255, 0)); }
.h-text { position: absolute; left: var(--m); right: var(--m); bottom: 200px; }
.h-eyebrow { font-size: 40px; font-weight: 400; line-height: 1.2; color: var(--sky); }
.bg-light .h-eyebrow { color: var(--enterprise); }
.h-title { font-size: 100px; font-weight: 600; line-height: 1.02; letter-spacing: -1px; margin-top: 20px; text-wrap: balance; }
.h-body { font-size: 38px; font-weight: 300; line-height: 1.3; margin-top: 28px; max-width: 840px; }
.h-title b { font-weight: 600; }
.b-title b { font-weight: 600; }
/* Shared accent system (on request): **words** in SemiBold on the cover title, and the same thin rule under the
   headline of commemoration / benefits as the hero's .h-rule — sky on dark, Enterprise Blue on light. */
.c-title b { font-weight: 600; }
.c-title.ruled::after, .b-title.ruled::after { content: ''; display: block; width: 96px; height: 4px; margin-top: 34px; background: var(--sky); }
.b-title.ruled::after { background: var(--enterprise); } /* benefits title: \n breaks and **words** (only on explicit request) */
/* Hero accents, only on explicit request (manual p. 19 keeps text in one weight and colour): a thin rule between
   headline and body (rule: true) and **phrases** of the body in SemiBold with the corporate accent colour. */
.h-rule { width: 96px; height: 4px; background: var(--sky); margin-top: 34px; }
.bg-light .h-rule { background: var(--enterprise); }
.h-body b { font-weight: 600; color: var(--sky); }
.bg-light .h-body b { color: var(--enterprise); }
/* Benefits CTA band with the dark slides' lit gradient instead of flat Enterprise Blue (ctaBand: "glow"). */
.b-cta.b-cta-glow { background: radial-gradient(110% 260% at 108% -20%, var(--enterprise) 0%, var(--dark) 78%); }
/* Pink date pill (hero, pillColor: "pink"): BTL secondary pink #ffb0d4 (Social Media Guideline p. 8) on a small
   graphic element, e.g. for breast-cancer awareness; text stays Dark Blue. */
.pill.pill-pink { background: #ffb0d4; color: var(--dark); }
/* Centred text: an exception to manual p. 19, only when the user asks for it (align: "center"). */
.slide .h-center, .slide .h-center p, .slide .h-center h1 { text-align: center; }
.h-center .h-body { margin-left: auto; margin-right: auto; }

/* ---------- statement · one big idea, typographic ---------- */
.st-main { position: absolute; left: var(--m); top: 330px; width: 892px; }
.st-bar { width: 120px; height: 6px; background: var(--sky); margin-bottom: 40px; }
.bg-light .st-bar { background: var(--enterprise); }
.st-kicker { font-size: 36px; font-weight: 600; line-height: 1.25; color: var(--sky); }
.bg-light .st-kicker { color: var(--enterprise); }
.st-title { font-size: 112px; font-weight: 600; line-height: 1.02; letter-spacing: -1.5px; margin-top: 30px; text-wrap: initial; }
.st-body { font-size: 44px; font-weight: 300; line-height: 1.25; margin-top: 44px; max-width: 840px; color: var(--sky); }
.bg-light .st-body { color: var(--enterprise); }

/* ---------- stats · official figure badges or big numbers ---------- */
.sx-title { position: absolute; left: var(--m); top: 270px; width: 640px; font-size: 60px; font-weight: 300; line-height: 1.12; }
.bg-light .sx-title { color: var(--enterprise); }
.sx-list { position: absolute; left: var(--m); right: var(--m); top: 470px; display: flex; flex-direction: column; gap: 44px; }
.sx-item img { display: block; height: auto; }
.sx-item b { display: block; font-size: 120px; font-weight: 100; line-height: .95; }
.sx-item span { display: block; font-size: 34px; font-weight: 400; line-height: 1.25; margin-top: 8px; max-width: 760px; }
.sx-note { position: absolute; left: var(--m); right: var(--m); font-size: 30px; font-weight: 400; line-height: 1.3; color: var(--sky); }
.bg-light .sx-note { color: var(--enterprise); }

/* ---------- split · image panel left, text right ---------- */
.sp-panel { position: absolute; left: 0; top: 0; width: 520px; height: 1350px; overflow: hidden;
  background: radial-gradient(120% 70% at -10% -5%, var(--sky) 0%, var(--white) 70%); }
.sp-panel img { position: absolute; display: block; height: auto; }
.sp-label { position: absolute; left: 60px; bottom: var(--m); font-size: var(--t); font-weight: 600; color: var(--dark); }
.sp-text { position: absolute; left: 580px; right: var(--m); top: 330px; }
.sp-eyebrow { font-size: var(--t); font-weight: 600; color: var(--sky); line-height: 1.25; }
.sp-title { font-size: 60px; font-weight: 300; line-height: 1.12; margin-top: 18px; }
.sp-body { font-size: 34px; font-weight: 400; line-height: 1.35; margin-top: 30px; }
.sp-points { list-style: none; margin-top: 36px; }
.sp-points li { font-size: 32px; font-weight: 400; line-height: 1.3; padding: 18px 0; border-top: 1.5px solid rgba(150, 210, 255, .35); }

/* ---------- steps · numbered points on dark ---------- */
.k-title { position: absolute; left: var(--m); top: 270px; width: 640px; font-size: 64px; font-weight: 300; line-height: 1.12; }
.k-list { position: absolute; left: var(--m); right: var(--m); top: 480px; list-style: none; }
.k-item { display: flex; gap: 36px; align-items: baseline; padding: 34px 0; border-top: 1.5px solid rgba(150, 210, 255, .35); }
.k-item:last-child { border-bottom: 1.5px solid rgba(150, 210, 255, .35); }
.k-num { flex: 0 0 110px; font-size: 72px; font-weight: 100; line-height: 1; color: var(--sky); }
.k-item h3 { font-size: 38px; font-weight: 600; line-height: 1.2; }
.k-item p { font-size: 32px; font-weight: 400; line-height: 1.3; color: var(--sky); margin-top: 6px; }
.k-cta { position: absolute; left: var(--m); right: var(--m); bottom: var(--m); }
.k-cta p { font-size: 54px; font-weight: 300; line-height: 1.1; }
.k-cta small { display: block; font-size: var(--t); font-weight: 600; color: var(--sky); margin-top: 14px; }

/* ---------- cta · closing slide ---------- */
.ct-img { position: absolute; inset: 0; overflow: hidden; }
.ct-img img { position: absolute; display: block; height: auto; }
.ct-main { position: absolute; left: var(--m); top: 330px; width: 892px; }
.ct-logo { display: block; width: 400px; height: auto; margin: 0 0 44px -10px; }
.ct-kicker { font-size: 38px; font-weight: 400; line-height: 1.25; }
.ct-title { font-size: 120px; font-weight: 600; line-height: 1; letter-spacing: -1.5px; margin-top: 24px; text-wrap: initial; }
.ct-body { font-size: 42px; font-weight: 300; line-height: 1.25; margin-top: 40px; max-width: 760px; }
.ct-action { display: inline-block; margin-top: 52px; border: 2px solid var(--white); border-radius: 999px; padding: 18px 36px 20px;
  font-size: 40px; font-weight: 600; line-height: 1; }
.ct-sign { position: absolute; left: var(--m); bottom: var(--m); font-size: 34px; font-weight: 600; color: var(--sky); }
.bg-blue .ct-sign { color: var(--white); }
`;
}

// Glowing stylised femur with porous spongy bone at both ends: the same drawing as the design system's
// BoneIllustration (design-system/btl/src/parts.tsx, porous), so a classic cover matches the proposals.
// Illustrative only: it does not depict any device or clinical result.
const boneRng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
function trabeculae(x0, y0, w, h, seed, scale) {
  const r = boneRng(seed);
  const step = 34 * scale;
  const cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
  const pt = [];
  for (let j = 0; j < rows; j++) {
    pt.push([]);
    for (let i = 0; i < cols; i++) pt[j].push([x0 + i * step + (r() - 0.5) * step * 0.7, y0 + j * step + (r() - 0.5) * step * 0.7]);
  }
  const out = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      for (const [dj, di] of [[0, 1], [1, 0], [1, 1]]) {
        const q = pt[j + dj]?.[i + di];
        if (!q || r() > (di && dj ? 0.25 : 0.5)) continue;
        const p = pt[j][i];
        out.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
      }
  return out.join('');
}
export function boneSVG({ sky = '#96d2ff' } = {}) {
  const outline = 'M92 118C110 108 142 112 172 104L192 142C176 166 166 200 168 236C182 246 184 262 170 274C164 330 168 420 170 800C172 845 215 860 222 900C230 945 210 975 182 972C165 970 158 952 150 948C142 952 135 970 118 972C88 975 70 945 78 900C85 860 112 845 114 800L110 330C108 260 90 205 80 162C74 140 78 122 92 118Z';
  const head = 'M205 148A50 50 0 1 0 205 48A50 50 0 0 0 205 148Z';
  return `<svg aria-hidden="true" viewBox="0 0 300 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="bone-c"><path d="${outline}"/><path d="${head}"/></clipPath>
    <radialGradient id="bone-h"><stop offset="0" stop-color="${sky}" stop-opacity="0.28"/><stop offset="1" stop-color="${sky}" stop-opacity="0"/></radialGradient>
    <filter id="bone-g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <ellipse cx="170" cy="150" rx="150" ry="160" fill="url(#bone-h)"/>
  <ellipse cx="152" cy="905" rx="150" ry="120" fill="url(#bone-h)"/>
  <g fill="rgba(150,210,255,0.08)" stroke="#fff" stroke-opacity="0.85" stroke-width="2" stroke-linejoin="round"><path d="${outline}"/><path d="${head}"/></g>
  <g clip-path="url(#bone-c)" fill="none" stroke="${sky}" stroke-linecap="round" filter="url(#bone-g)">
    <path d="${trabeculae(70, 40, 200, 260, 7, 0.6)}" stroke-width="1.4" stroke-opacity="0.7"/>
    <path d="${trabeculae(60, 830, 190, 150, 11, 0.6)}" stroke-width="1.4" stroke-opacity="0.7"/>
    <path d="M126 330L128 790M156 330L156 790" stroke-width="1.5" stroke-opacity="0.35"/>
  </g>
</svg>`;
}

// Stylised lateral view of the spine (cervical, thoracic and lumbar vertebrae + sacrum).
// Vector illustration generated in code; it does not depict any device or clinical result.
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
  // S-curve: cervical and lumbar lordosis (anterior = right), thoracic kyphosis.
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
    const sp = (14 + 34 * s.t) * scale * 1.6; // spinous process length
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
  // Sacrum: tapered shape continuing the curve posteriorly.
  const sx = xAt(0.94), sw = 120 * scale * 1.05;
  const sacrum = `<path d="M${(sx - sw / 2).toFixed(1)} ${(y + 4).toFixed(1)}
    C${(sx - sw / 2 - 18).toFixed(1)} ${(y + sacrumH * scale * 0.55).toFixed(1)} ${(sx - sw * 0.5).toFixed(1)} ${(y + sacrumH * scale * 0.9).toFixed(1)} ${(sx - sw * 0.75).toFixed(1)} ${(y + sacrumH * scale).toFixed(1)}
    C${(sx - sw * 0.35).toFixed(1)} ${(y + sacrumH * scale * 0.85).toFixed(1)} ${(sx + sw * 0.25).toFixed(1)} ${(y + sacrumH * scale * 0.5).toFixed(1)} ${(sx + sw / 2).toFixed(1)} ${(y + 4).toFixed(1)} Z"
    fill="rgba(150,210,255,0.08)" stroke="#fff" stroke-opacity="0.6" stroke-width="1.6" stroke-linejoin="round"/>`;
  // Soft halo behind the lumbar segment.
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
// Logo colour follows the background: white on dark/blue, Enterprise Blue on light (manual p. 6).
const logo = (s, ctx) => `<div class="logo ${s.theme === 'light' ? 'blue' : 'white'} blk" data-logo>${ctx.logo}</div>`;
// Optional frame extras (v2 layouts only): height crops the photo (object-fit cover; focusY 0–100 picks the part kept,
// 0 = top); fadeTop / fadeBottom dissolve
// its top / bottom edge into the background, so a logo can sit on the plain gradient and no crop line shows.
const fadeMask = (t, b) => {
  const g = `linear-gradient(to bottom,${t ? `transparent 0,#000 ${t}px` : '#000 0'},${b ? `#000 calc(100% - ${b}px),transparent 100%` : '#000 100%'})`;
  return `;-webkit-mask-image:${g};mask-image:${g}`;
};
// fadeLeft / fadeRight do the same on the sides; with top/bottom fades too, both masks are intersected.
const sideGradient = (l, r) => `linear-gradient(to right,${l ? `transparent 0,#000 ${l}px` : '#000 0'},${r ? `#000 calc(100% - ${r}px),transparent 100%` : '#000 100%'})`;
const fadeMask4 = (f) => {
  const v = f.fadeTop || f.fadeBottom, h = f.fadeLeft || f.fadeRight;
  if (!h) return v ? fadeMask(f.fadeTop, f.fadeBottom) : '';
  const side = sideGradient(f.fadeLeft, f.fadeRight);
  if (!v) return `;-webkit-mask-image:${side};mask-image:${side}`;
  const top = `linear-gradient(to bottom,${f.fadeTop ? `transparent 0,#000 ${f.fadeTop}px` : '#000 0'},${f.fadeBottom ? `#000 calc(100% - ${f.fadeBottom}px),transparent 100%` : '#000 100%'})`;
  return `;-webkit-mask-image:${top},${side};-webkit-mask-composite:source-in;mask-image:${top},${side};mask-composite:intersect`;
};
const frameExtras = (f) =>
  (f.height ? `;height:${f.height}px;object-fit:cover${f.focusY !== undefined ? `;object-position:50% ${f.focusY}%` : ''}` : '') +
  fadeMask4(f);
const img = (src, alt, f, ctx) =>
  src ? `<img src="${ctx.asset(src)}" alt="${esc(alt ?? '')}" style="left:${f.left}px;top:${f.top}px;width:${f.width}px${frameExtras(f)}">` : '';

export const layouts = {
  commemoration: (s, ctx) => `
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    ${s.illustration === 'none' ? '' : s.illustration === 'bone'
      ? `<div class="c-bone blk">${boneSVG({ sky: ctx.brand.colors.skyBlue })}</div>`
      : `<div class="c-spine blk">${spineSVG({ sky: ctx.brand.colors.skyBlue })}</div>`}
    <div class="c-main blk${s.illustration === 'none' ? ' wide' : s.illustration === 'bone' ? ' bone' : ''}">
      ${s.datePill ? `<span class="pill">${esc(s.datePill)}</span>` : ''}
      ${s.eyebrow ? `<p class="c-eyebrow">${lines(s.eyebrow)}</p>` : ''}
      <h1 class="c-title${s.rule ? ' ruled' : ''}">${emphasis(s.title)}</h1>
      ${s.question ? `<p class="c-question">${lines(s.question)}</p>` : ''}
    </div>
    ${swipe(s.swipe, ctx)}`,

  product: (s, ctx) => `
    <div class="p-box" data-clip${s.imageFrame?.background ? ` style="background:${s.imageFrame.background}"` : ''}>
      ${s.images
        ? s.images.map((im) => `<figure class="p-pos" style="left:${im.left}px;top:${im.top}px">
            <img src="${ctx.asset(im.src)}" alt="${esc(im.alt)}" style="width:${im.width}px">
            <figcaption style="left:${im.label_x}px;top:${im.label_y}px">${esc(im.label)}</figcaption></figure>`).join('')
        : `<img class="p-photo${s.imageFrame?.background ? ' flat' : ''}" src="${ctx.asset(s.image)}" alt="${esc(s.imageAlt)}"
        ${s.imageFrame ? `style="width:${s.imageFrame.width}px;left:${s.imageFrame.left}px;top:${s.imageFrame.top}px"` : ''}>`}
    </div>
    <div class="logo blue blk" data-logo>${ctx.logo}</div>
    <div class="p-text blk">
      ${s.productLogo
        ? `<img class="p-logo" src="${ctx.asset(s.productLogo)}" alt="${esc(s.eyebrow)}">`
        : `<p class="p-eyebrow">${esc(s.eyebrow)}</p>`}
      <h2 class="p-title">${esc(s.title)}</h2>
      <div class="p-row">
        ${s.stat ? `<div class="p-stat"><b>${esc(s.stat.value)}</b><span>${esc(s.stat.label)}</span></div>` : ''}
        ${s.body ? `<p class="p-body">${esc(s.body)}</p>` : ''}
      </div>
    </div>
    ${swipe(s.swipe, ctx)}`,

  benefits: (s, ctx) => `
    <div class="logo blue blk" data-logo>${ctx.logo}</div>
    <h2 class="b-title blk${s.rule ? ' ruled' : ''}">${emphasis(s.title)}</h2>
    <ul class="b-list blk">
      ${s.benefits.map((b) => `<li class="b-item">${ctx.icon(b.icon)}<div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div></li>`).join('')}
    </ul>
    ${s.cta ? `<div class="b-cta blk${s.ctaBand === 'glow' ? ' b-cta-glow' : ''}">
      <p class="b-cta-text">${esc(s.cta)}</p>
      ${s.signature ? `<small>${esc(s.signature)}</small>` : ''}
    </div>` : ''}`,
  // ----- Layouts added for REACH Content Studio (v2) -----
  hero: (s, ctx) => `
    <div class="img-frame" data-clip>${img(s.image, s.imageAlt, s.imageFrame ?? { left: 0, top: 120, width: 1080 }, ctx)}${(s.extraImages ?? []).map((x) => img(x.image, x.imageAlt, x.imageFrame, ctx)).join('')}</div>
    <div class="h-shade"></div>
    ${logo(s, ctx)}
    <div class="h-text blk${s.align === 'center' ? ' h-center' : ''}">
      ${s.datePill ? `<span class="pill${s.pillColor === 'pink' ? ' pill-pink' : ''}">${esc(s.datePill)}</span>` : ''}
      ${s.eyebrow ? `<p class="h-eyebrow">${lines(s.eyebrow)}</p>` : ''}
      <h1 class="h-title">${emphasis(s.title)}</h1>
      ${s.rule ? '<div class="h-rule"></div>' : ''}
      ${s.body ? `<p class="h-body">${emphasis(s.body)}</p>` : ''}
    </div>
    ${swipe(s.swipe, ctx)}`,

  statement: (s, ctx) => `
    ${logo(s, ctx)}
    <div class="st-main blk">
      <div class="st-bar"></div>
      ${s.datePill ? `<span class="pill">${esc(s.datePill)}</span>` : ''}
      ${s.kicker ? `<p class="st-kicker">${lines(s.kicker)}</p>` : ''}
      <h1 class="st-title">${lines(s.title)}</h1>
      ${s.body ? `<p class="st-body">${lines(s.body)}</p>` : ''}
    </div>
    ${swipe(s.swipe, ctx)}`,

  stats: (s, ctx) => `
    ${logo(s, ctx)}
    <h2 class="sx-title blk">${lines(s.title)}</h2>
    <div class="sx-list blk">
      ${s.items.map((it) => `<div class="sx-item">${it.image
        ? `<img src="${ctx.asset(it.image)}" alt="${esc(it.alt ?? it.label ?? '')}" style="width:${it.width ?? 640}px">`
        : `<b>${esc(it.value)}</b><span>${esc(it.label)}</span>`}</div>`).join('')}
    </div>
    ${s.note ? `<p class="sx-note blk" style="bottom:${s.swipe ? 190 : 94}px">${lines(s.note)}</p>` : ''}
    ${swipe(s.swipe, ctx)}`,

  split: (s, ctx) => `
    <div class="sp-panel" data-clip>${img(s.image, s.imageAlt, s.imageFrame ?? { left: 20, top: 420, width: 480 }, ctx)}
      ${s.label ? `<span class="sp-label">${esc(s.label)}</span>` : ''}</div>
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <div class="sp-text blk">
      ${s.eyebrow ? `<p class="sp-eyebrow">${esc(s.eyebrow)}</p>` : ''}
      <h2 class="sp-title">${lines(s.title)}</h2>
      ${s.body ? `<p class="sp-body">${lines(s.body)}</p>` : ''}
      ${s.points?.length ? `<ul class="sp-points">${s.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>
    ${swipe(s.swipe, ctx)}`,

  steps: (s, ctx) => `
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <h2 class="k-title blk">${lines(s.title)}</h2>
    <ol class="k-list blk">
      ${s.items.map((it, i) => `<li class="k-item"><span class="k-num">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(it.title)}</h3>${it.text ? `<p>${esc(it.text)}</p>` : ''}</div></li>`).join('')}
    </ol>
    ${s.cta ? `<div class="k-cta blk"><p>${esc(s.cta)}</p>${s.signature ? `<small>${esc(s.signature)}</small>` : ''}</div>` : swipe(s.swipe, ctx)}`,

  cta: (s, ctx) => `
    ${s.image ? `<div class="ct-img" data-clip>${img(s.image, s.imageAlt, s.imageFrame ?? { left: 560, top: 760, width: 560 }, ctx)}</div>` : ''}
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <div class="ct-main blk">
      ${s.productLogo ? `<img class="ct-logo" src="${ctx.asset(s.productLogo)}" alt="${esc(s.productName ?? '')}">` : ''}
      ${s.kicker ? `<p class="ct-kicker">${lines(s.kicker)}</p>` : ''}
      <h2 class="ct-title">${lines(s.title)}</h2>
      ${s.body ? `<p class="ct-body">${lines(s.body)}</p>` : ''}
      ${s.action ? `<span class="ct-action">${esc(s.action)}</span>` : ''}
    </div>
    ${s.signature ? `<p class="ct-sign blk">${esc(s.signature)}</p>` : ''}`,
};

// Theme-dependent backgrounds for the new layouts; the original three keep their fixed backgrounds.
const theme = (s) => (s.theme === 'light' ? 'bg-light' : s.theme === 'blue' ? 'bg-blue' : 'bg-dark');
export const backgrounds = {
  commemoration: 'bg-dark', product: 'bg-dark-band', benefits: 'bg-light',
  hero: (s) => `${theme(s)}${s.theme === 'light' && s.lightFrom === 'right' ? ' light-right' : ''}`, statement: theme, stats: theme, split: () => 'bg-dark', steps: () => 'bg-dark', cta: (s) => (s.theme === 'blue' ? 'bg-blue' : 'bg-dark'),
};

