// Opción C — concepto «el segmento». Fuentes propias de esta opción.
// Narrativa: L4–L5 (lo que el profesional ve en consulta) → ajustar la posición al
// segmento (posiciones oficiales del catálogo) → DEMO (misma "short statement" que abre).
// Short statements: 4–10 caracteres, centrados en la parte superior (manual p. 22).

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const lines = (s) => esc(s).replace(/\n/g, '<br>');

export function styles({ brand, u }) {
  const c = brand.colors;
  const M = Math.round(2 * u);
  return `
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-300-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 300; src: url('${brand.fontUrl}/noto-sans-latin-ext-300-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }
@font-face { font-family: 'Noto Sans'; font-weight: 400; src: url('${brand.fontUrl}/noto-sans-latin-400-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-600-normal.woff2'); }
@font-face { font-family: 'Noto Sans'; font-weight: 600; src: url('${brand.fontUrl}/noto-sans-latin-ext-600-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }

:root { --enterprise: ${c.enterpriseBlue}; --dark: ${c.darkBlue}; --sky: ${c.skyBlue}; --white: ${c.white}; --m: ${M}px; --u: ${u}px; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #e9edf2; font-family: 'Noto Sans', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; margin: 0 0 40px; color: var(--white); }
.slide p, .slide h1, .slide h2, .slide h3 { text-align: left; text-wrap: pretty; }
.slide h2 { text-wrap: balance; }

.bg-dark { background: radial-gradient(130% 95% at 108% -8%, var(--enterprise) 0%, var(--dark) 78%); }
.bg-light { background: radial-gradient(120% 90% at -10% -8%, var(--sky) 0%, var(--white) 72%); color: var(--dark); }
.bg-light-top { background: radial-gradient(75% 30% at -8% -6%, var(--sky) 0%, var(--white) 75%); color: var(--dark); } /* photos sit on pure white */
.bg-blue { background: radial-gradient(140% 110% at -10% 112%, var(--dark) 0%, var(--enterprise) 62%); }

.logo { position: absolute; top: var(--m); right: var(--m); width: ${brand.logoWidth}px; line-height: 0; }
.logo svg { width: 100%; height: auto; }
.logo.white { color: var(--white); } .logo.blue { color: var(--enterprise); }

.swipe { position: absolute; right: var(--m); bottom: var(--m); display: flex; align-items: center; gap: 12px;
  font-size: 30px; font-weight: 400; color: var(--white); border: 1.5px solid rgba(255,255,255,.55);
  border-radius: 999px; padding: 10px 18px 10px 26px; line-height: 1; }
.swipe.on-light { color: var(--enterprise); border-color: rgba(0,80,140,.45); }
.swipe svg { width: 40px; height: 40px; fill: currentColor; }

/* Short statement: centred, large (manual p. 22) */
.statement { position: absolute; left: var(--m); right: var(--m); text-align: center !important; font-weight: 600;
  line-height: 1; letter-spacing: -4px; }

/* ---------- 1 · Segment ---------- */
.s-pill { position: absolute; left: var(--m); top: calc(var(--m) + 22px); display: inline-block; background: var(--sky);
  color: var(--dark); font-weight: 600; font-size: 30px; line-height: 1; padding: 12px 22px 13px; border-radius: 999px; }
.s-occasion { position: absolute; left: var(--m); top: 270px; font-size: 42px; font-weight: 300; line-height: 1.15; }
.s-statement { top: 370px; font-size: 270px; }
.s-segment { position: absolute; left: 110px; width: 860px; top: 690px; height: 200px; }
.s-segment svg { width: 100%; height: 100%; }
.s-text { position: absolute; left: var(--m); top: 950px; width: 820px; }
.s-hook { font-size: 54px; font-weight: 600; line-height: 1.12; }
.s-question { font-size: 42px; font-weight: 400; line-height: 1.2; color: var(--sky); margin-top: 22px; }

/* ---------- 2 · Fit the position ---------- */
.f-title { position: absolute; left: var(--m); top: 260px; width: 860px; font-size: 62px; font-weight: 300;
  line-height: 1.12; color: var(--enterprise); }
.f-rows { position: absolute; left: 60px; right: var(--m); top: 470px; display: flex; flex-direction: column; gap: 46px; }
.f-row { display: flex; align-items: center; gap: 40px; }
.f-ph { flex: 0 0 470px; height: 270px; display: flex; align-items: flex-end; justify-content: center; }
.f-ph img { display: block; width: 470px; height: auto; }
.f-row h3 { font-size: 40px; font-weight: 600; line-height: 1.12; color: var(--dark); }
.f-row p { font-size: 32px; font-weight: 400; line-height: 1.3; color: var(--enterprise); margin-top: 10px; }
.f-foot { position: absolute; left: var(--m); top: 1130px; width: 600px; font-size: 32px; font-weight: 600;
  line-height: 1.3; color: var(--dark); border-left: 3px solid var(--sky); padding-left: 22px; }

/* ---------- 3 · DEMO ---------- */
.d-product { position: absolute; left: calc(var(--m) - 10px); top: calc(var(--m) + 13px); width: 400px; height: auto; }
.d-statement { top: 380px; font-size: 300px; }
.d-text { position: absolute; left: var(--m); right: var(--m); top: 780px; }
.d-cta { font-size: 58px; font-weight: 300; line-height: 1.12; }
.d-sub { font-size: 36px; font-weight: 400; line-height: 1.3; color: var(--sky); margin-top: 22px; }
.d-chips { position: absolute; left: var(--m); right: var(--m); top: 1160px; display: flex; flex-wrap: wrap; gap: 16px; list-style: none; }
.d-chips li { font-size: 30px; font-weight: 400; line-height: 1; padding: 14px 22px; border: 1.5px solid var(--sky); border-radius: 999px; }
`;
}

// Lumbar segment drawn lying down (like the patient on the table): L3, L4, L5 vertebral
// bodies with intervertebral discs; the disc named in `focus` is highlighted.
// Generic vector illustration — no device, no clinical result.
export function segmentSVG({ labels = ['L3', 'L4', 'L5'], focus = 1, sky = '#96d2ff' } = {}) {
  const W = 860, H = 200, bw = 220, bh = 112, gap = 46, y = 30;
  const x0 = (W - (labels.length * bw + (labels.length - 1) * gap)) / 2;
  let g = '';
  labels.forEach((lab, i) => {
    const x = x0 + i * (bw + gap);
    g += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="26" fill="rgba(150,210,255,.10)" stroke="#fff" stroke-opacity=".9" stroke-width="2"/>
      <path d="M${x + bw * 0.3} ${y + bh} L${x + bw * 0.38} ${y + bh + 34} L${x + bw * 0.62} ${y + bh + 34} L${x + bw * 0.7} ${y + bh}"
        fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linejoin="round"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 12}" text-anchor="middle" font-family="Noto Sans" font-weight="600" font-size="34" fill="#fff" fill-opacity=".85">${lab}</text>`;
    if (i < labels.length - 1) {
      const dx = x + bw + 8, on = i === focus;
      g += `<rect x="${dx}" y="${y + 10}" width="${gap - 16}" height="${bh - 20}" rx="14" fill="${sky}" opacity="${on ? 1 : 0.4}" ${on ? 'filter="url(#sglow)"' : ''}/>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><filter id="sglow" x="-200%" y="-50%" width="500%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${g}</svg>`;
}

const swipe = (text, ctx, light) =>
  text ? `<div class="swipe blk${light ? ' on-light' : ''}">${esc(text)}${ctx.icon('swipe_left')}</div>` : '';

export const layouts = {
  segment: (s, ctx) => `
    <span class="s-pill blk">${esc(s.datePill)}</span>
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <p class="s-occasion blk">${esc(s.occasion)}</p>
    <p class="statement s-statement blk">${esc(s.statement)}</p>
    <div class="s-segment blk">${segmentSVG({ sky: ctx.brand.colors.skyBlue })}</div>
    <div class="s-text blk">
      <h1 class="s-hook">${lines(s.hook)}</h1>
      <p class="s-question">${lines(s.question)}</p>
    </div>
    ${swipe(s.swipe, ctx)}`,

  fit: (s, ctx) => `
    <div class="logo blue blk" data-logo>${ctx.logo}</div>
    <h2 class="f-title blk">${esc(s.title)}</h2>
    <div class="f-rows blk">
      ${s.positions.map((p) => `<div class="f-row">
        <div class="f-ph"><img src="${ctx.asset(p.src)}" alt="${esc(p.alt)}"></div>
        <div><h3>${esc(p.label)}</h3><p>${esc(p.text)}</p></div></div>`).join('')}
    </div>
    <p class="f-foot blk">${esc(s.footnote)}</p>
    ${swipe(s.swipe, ctx, true)}`,

  demo: (s, ctx) => `
    <img class="d-product blk" src="${ctx.asset(s.productLogo)}" alt="BTL Spinal Decompression">
    <div class="logo white blk" data-logo>${ctx.logo}</div>
    <p class="statement d-statement blk">${esc(s.statement)}</p>
    <div class="d-text blk">
      <p class="d-cta">${lines(s.cta)}</p>
      <p class="d-sub">${lines(s.sub)}</p>
    </div>
    <ul class="d-chips blk">${s.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`,
};

export const backgrounds = { segment: 'bg-dark', fit: 'bg-light-top', demo: 'bg-blue' };
