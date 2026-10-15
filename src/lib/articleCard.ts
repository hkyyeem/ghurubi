/** Draws a 1600x900 Ghurubi article card (for attaching to posts on X) and downloads it as PNG. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
  const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src;
});

export async function downloadArticleCard(o: { title: string; kicker?: string; slug: string; lang: 'ar' | 'en' }) {
  const W = 1600, H = 900, P = 110, ar = o.lang === 'ar';
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  const font = getComputedStyle(document.body).fontFamily || 'sans-serif';
  await document.fonts?.ready;
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H);
  ctx.direction = ar ? 'rtl' : 'ltr';
  const x0 = ar ? W - P : P; ctx.textAlign = ar ? 'right' : 'left';

  // brand
  try {
    const logo = await loadImg('/icon-192.png');
    ctx.drawImage(logo, ar ? W - P - 72 : P, P - 10, 72, 72);
  } catch { /* no logo */ }
  const bx = ar ? W - P - 96 : P + 96;
  ctx.fillStyle = '#fafafa'; ctx.font = `700 40px ${font}`;
  ctx.fillText(ar ? 'غروبي' : 'Ghurubi', bx, P + 28);
  ctx.fillStyle = '#8a8a8a'; ctx.font = `500 22px ${font}`;
  ctx.fillText(ar ? 'ساعة الأرض الطبيعية' : 'THE EARTH CLOCK', bx, P + 60);

  // label
  ctx.fillStyle = '#8a8a8a'; ctx.font = `600 26px ${font}`;
  const label = (ar ? 'مقال' : 'ARTICLE') + (o.kicker ? `  ·  ${o.kicker}` : '');
  ctx.fillText(label, x0, 330);

  // title (auto-fit)
  let size = 96, lines: string[] = [];
  for (; size >= 52; size -= 4) {
    ctx.font = `700 ${size}px ${font}`;
    lines = wrap(ctx, o.title, W - P * 2);
    if (lines.length * size * 1.25 <= 380) break;
  }
  ctx.fillStyle = '#fafafa';
  lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, x0, 330 + 40 + size * 1.1 + i * size * 1.25));

  // footer
  ctx.fillStyle = '#262626'; ctx.fillRect(P, H - 140, W - P * 2, 2);
  ctx.fillStyle = '#8a8a8a'; ctx.font = `500 26px ${font}`;
  ctx.fillText(ar ? 'اقرأ المقال كاملاً' : 'Read the full article', x0, H - 82);
  ctx.textAlign = ar ? 'left' : 'right'; ctx.direction = 'ltr';
  ctx.fillStyle = '#fafafa'; ctx.font = `600 28px ${font}`;
  ctx.fillText(`ghurubi.com/articles/${o.slug}`, ar ? P : W - P, H - 82);

  const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `ghurubi-${o.slug}-${o.lang}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
