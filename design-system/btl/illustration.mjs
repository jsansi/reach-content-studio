// Topic illustrations drawn by the AI for a publication (the `Illustration` primitive): vector shapes only, in BTL
// brand colours, no text, images, links or scripts. Shared by the structural check (server) and the component.

export const BRAND_FILLS = ['#00508c', '#000a32', '#96d2ff', '#ffffff', '#fff', 'none', 'currentColor', 'transparent'];
const TAGS = new Set(['g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask', 'filter', 'feGaussianBlur', 'feMerge', 'feMergeNode']);
const ATTRS = new Set([
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'fx', 'fy', 'width', 'height', 'points', 'transform', 'id', 'offset',
  'fill', 'stroke', 'stop-color', 'stroke-width', 'stroke-opacity', 'fill-opacity', 'stop-opacity', 'opacity', 'stroke-linecap', 'stroke-linejoin',
  'stroke-dasharray', 'fill-rule', 'clip-rule', 'clip-path', 'mask', 'filter', 'stdDeviation', 'in', 'result', 'gradientUnits', 'gradientTransform',
]);
const COLOR_ATTRS = new Set(['fill', 'stroke', 'stop-color']);
export const MAX_SVG = 60000;

/** Problems (Spanish) with an illustration's inner SVG markup; empty when it can be rendered. */
export function checkIllustrationSvg(svg) {
  const errors = [];
  if (typeof svg !== 'string' || !svg.trim()) return ['falta el SVG de la ilustración.'];
  if (svg.length > MAX_SVG) errors.push(`el SVG es demasiado grande (${svg.length} caracteres, máximo ${MAX_SVG}).`);
  if (/<!|<\?|&#|javascript:|<\s*(script|style|text|tspan|image|foreignObject|a|use)\b/i.test(svg)) errors.push('el SVG no puede llevar texto, imágenes, enlaces, estilos ni scripts (solo formas).');
  for (const m of svg.matchAll(/<\s*([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const [, tag, rest] = m;
    if (!TAGS.has(tag)) { errors.push(`elemento no permitido <${tag}>.`); continue; }
    for (const a of rest.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
      const name = a[1], value = (a[3] ?? a[4] ?? '').trim();
      if (!ATTRS.has(name)) { errors.push(`atributo no permitido "${name}" en <${tag}>.`); continue; }
      if (COLOR_ATTRS.has(name) && !BRAND_FILLS.includes(value.toLowerCase()) && !/^url\(#[\w-]+\)$/.test(value))
        errors.push(`color "${value}" fuera de la paleta BTL (usa #00508c, #000a32, #96d2ff, #ffffff o none).`);
      if (/^url\(/.test(value) && !/^url\(#[\w-]+\)$/.test(value)) errors.push(`referencia externa no permitida (${value}).`);
    }
  }
  return [...new Set(errors)];
}

/** Ids inside the markup get a per-instance prefix so two illustrations on one page never collide. */
export function scopeIds(svg, prefix) {
  return svg.replace(/\bid\s*=\s*"([\w-]+)"/g, `id="${prefix}-$1"`).replace(/url\(#([\w-]+)\)/g, `url(#${prefix}-$1)`);
}
