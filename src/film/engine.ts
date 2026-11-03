import {
  ANSWERS,
  DROP,
  DURATION,
  FADE,
  INK,
  PAPER,
  PROMPT,
  SCENES,
  SIXTEENTH,
  SIZE,
  STYLES,
  clamp01,
  cutTimes,
  easeOut,
  lerp,
  letterAlpha,
  mod,
  sceneAlpha,
  sixteenthIndex,
  smooth,
  zoomAt,
  type Token,
} from "./timeline";

type RGB = [number, number, number];
type Still = { img: HTMLImageElement; color: RGB };

type Glass = { x: number; y: number; w: number; h: number; r: number; milk?: number };

const COLLAGE = [
  { i: 0, x: 48, y: 56, w: 390, h: 280, rot: -0.05 },
  { i: 6, x: 500, y: 36, w: 340, h: 230, rot: 0.03 },
  { i: 11, x: 980, y: 72, w: 390, h: 270, rot: 0.045 },
  { i: 27, x: 28, y: 400, w: 300, h: 380, rot: -0.03 },
  { i: 15, x: 1100, y: 390, w: 300, h: 360, rot: 0.04 },
  { i: 64, x: 70, y: 1040, w: 420, h: 280, rot: 0.03 },
  { i: 70, x: 540, y: 1100, w: 400, h: 260, rot: -0.035 },
  { i: 38, x: 1000, y: 1020, w: 380, h: 290, rot: 0.02 },
  { i: 8, x: 360, y: 250, w: 250, h: 180, rot: -0.02 },
  { i: 72, x: 860, y: 230, w: 240, h: 170, rot: 0.025 },
];

function parseHex(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadFonts() {
  const faces: Array<[string, string]> = [
    ["400", "/fonts/Geist-400.woff2"],
    ["500", "/fonts/Geist-500.woff2"],
    ["600", "/fonts/Geist-600.woff2"],
  ];
  await Promise.all(
    faces.map(async ([weight, url]) => {
      const face = new FontFace("Geist", `url(${url})`, { weight, style: "normal" });
      await face.load();
      document.fonts.add(face);
    }),
  );
}

function addRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function cover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  filter?: string,
) {
  ctx.save();
  ctx.beginPath();
  addRoundRect(ctx, x, y, w, h, r);
  ctx.clip();
  if (filter) ctx.filter = filter;
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

function font(weight: number, size: number) {
  return `${weight} ${size}px Geist`;
}

function wordSpan(token: Token, nextT: number) {
  return Math.min(0.26, Math.max(0.12, (nextT - token.t) * 0.62));
}

function drawTokens(
  ctx: CanvasRenderingContext2D,
  tokens: Token[],
  t: number,
  cx: number,
  baseline: number,
  opts: { fill: string; weight: number; size: number; alpha: number; tracking?: number },
) {
  ctx.save();
  ctx.font = font(opts.weight, opts.size);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const tracking = opts.tracking ?? 0;
  const space = ctx.measureText(" ").width;
  const widths = tokens.map((tok) => {
    let w = 0;
    for (const ch of tok.text) w += ctx.measureText(ch).width + tracking;
    return w;
  });
  const total = widths.reduce((a, b) => a + b, 0) + space * Math.max(0, tokens.length - 1);
  let x = cx - total / 2;
  tokens.forEach((tok, i) => {
    const nextT = tokens[i + 1]?.t ?? tok.t + 0.48;
    const span = wordSpan(tok, nextT);
    if (tok.emphasis) {
      const scale = lerp(1.035, 1, easeOut(clamp01((t - tok.t) / 0.5)));
      const wordW = widths[i];
      const startX = x;
      for (let c = 0; c < tok.text.length; c++) {
        const ch = tok.text[c];
        const chW = ctx.measureText(ch).width;
        const t0 = tok.t + (c / tok.text.length) * span;
        const a = letterAlpha(t, t0) * opts.alpha;
        if (a > 0.01) {
          ctx.save();
          ctx.translate(startX + wordW / 2, baseline - opts.size * 0.35);
          ctx.scale(scale, scale);
          ctx.translate(-(startX + wordW / 2), -(baseline - opts.size * 0.35));
          ctx.globalAlpha = a;
          ctx.shadowColor = "rgba(190, 206, 220, 0.95)";
          ctx.shadowBlur = 22 * a;
          const g = ctx.createLinearGradient(startX, baseline - opts.size, startX + wordW, baseline);
          g.addColorStop(0, "#24384a");
          g.addColorStop(0.48, INK);
          g.addColorStop(1, "#6a4b3e");
          ctx.fillStyle = g;
          ctx.fillText(ch, x, baseline);
          ctx.restore();
        }
        x += chW + tracking;
      }
    } else {
      ctx.fillStyle = opts.fill;
      ctx.shadowColor = "transparent";
      for (let c = 0; c < tok.text.length; c++) {
        const ch = tok.text[c];
        const chW = ctx.measureText(ch).width;
        const t0 = tok.t + (c / tok.text.length) * span;
        const a = letterAlpha(t, t0) * opts.alpha;
        if (a > 0.01) {
          ctx.globalAlpha = a;
          ctx.fillText(ch, x, baseline);
        }
        x += chW + tracking;
      }
    }
    x += space;
  });
  ctx.restore();
}

export class Film {
  private stills: Still[];
  private ctx: CanvasRenderingContext2D;
  private world: HTMLCanvasElement;
  private wctx: CanvasRenderingContext2D;
  private snap: HTMLCanvasElement;
  private sctx: CanvasRenderingContext2D;
  private small: HTMLCanvasElement;
  private sm: CanvasRenderingContext2D;
  private mid: HTMLCanvasElement;
  private md: CanvasRenderingContext2D;
  private burst: Array<{
    ang: number;
    dist: number;
    img: number;
    rot: number;
    size: number;
    delay: number;
  }>;

  constructor(canvas: HTMLCanvasElement, stills: Still[]) {
    this.stills = stills;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("canvas");
    this.ctx = ctx;
    this.world = document.createElement("canvas");
    this.world.width = SIZE;
    this.world.height = SIZE;
    this.wctx = this.world.getContext("2d", { alpha: false })!;
    this.snap = document.createElement("canvas");
    this.snap.width = SIZE;
    this.snap.height = SIZE;
    this.sctx = this.snap.getContext("2d", { alpha: false })!;
    this.small = document.createElement("canvas");
    this.small.width = SIZE / 4;
    this.small.height = SIZE / 4;
    this.sm = this.small.getContext("2d")!;
    this.mid = document.createElement("canvas");
    this.mid.width = SIZE / 2;
    this.mid.height = SIZE / 2;
    this.md = this.mid.getContext("2d")!;
    this.burst = [];
    const rings = [
      { n: 16, dist: 210, size: 128 },
      { n: 24, dist: 360, size: 112 },
      { n: 32, dist: 510, size: 100 },
      { n: 48, dist: 670, size: 86 },
    ];
    let k = 0;
    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.n; i++) {
        this.burst.push({
          ang: (i / ring.n) * Math.PI * 2 + ri * 0.31,
          dist: ring.dist,
          img: (k * 5 + ri) % stills.length,
          rot: ((k % 9) - 4) * 0.06,
          size: ring.size,
          delay: ri * 0.045 + (i % 5) * 0.012,
        });
        k += 1;
      }
    });
  }

  private img(i: number) {
    return this.stills[mod(i, this.stills.length)];
  }

  private aura(ctx: CanvasRenderingContext2D, t: number, alpha = 1) {
    const blobs = [
      { c: "213,228,242", x: 0.28 + Math.sin(t * 0.13) * 0.05, y: 0.32, r: 560 },
      { c: "240,221,208", x: 0.74 + Math.cos(t * 0.11) * 0.04, y: 0.62, r: 520 },
      { c: "220,232,220", x: 0.48 + Math.sin(t * 0.09) * 0.04, y: 0.84, r: 440 },
    ];
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const b of blobs) {
      const x = b.x * SIZE;
      const y = b.y * SIZE;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, `rgba(${b.c},0.95)`);
      g.addColorStop(1, `rgba(${b.c},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, SIZE, SIZE);
    }
    ctx.restore();
  }

  private blitBlur(
    dest: CanvasRenderingContext2D,
    blurPx: number,
    magnify = 1,
    origin?: { x: number; y: number },
  ) {
    const factor = blurPx >= 8 ? 4 : 2;
    const c = factor === 4 ? this.small : this.mid;
    const sctx = factor === 4 ? this.sm : this.md;
    const sw = SIZE / factor;
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, sw, sw);
    sctx.filter = `blur(${Math.max(0.4, blurPx / factor)}px)`;
    sctx.drawImage(this.snap, 0, 0, sw, sw);
    sctx.filter = "none";
    dest.save();
    if (magnify !== 1 && origin) {
      dest.translate(origin.x, origin.y);
      dest.scale(magnify, magnify);
      dest.translate(-origin.x, -origin.y);
    }
    dest.imageSmoothingEnabled = true;
    dest.drawImage(c, 0, 0, sw, sw, 0, 0, SIZE, SIZE);
    dest.restore();
  }

  private glass(ctx: CanvasRenderingContext2D, box: Glass, alpha: number) {
    const { x, y, w, h, r } = box;
    const milk = box.milk ?? 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(17,18,20,0.16)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 14;
    ctx.beginPath();
    addRoundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    addRoundRect(ctx, x, y, w, h, r);
    ctx.clip();
    this.blitBlur(ctx, 14);

    if (w > 56 && h > 56) {
      ctx.save();
      ctx.beginPath();
      addRoundRect(ctx, x, y, w, h, r);
      addRoundRect(ctx, x + 12, y + 12, w - 24, h - 24, Math.max(0, r - 12));
      ctx.clip("evenodd");
      this.blitBlur(ctx, 4, 1.06, { x: x + w / 2, y: y + h / 2 });
      ctx.restore();
    }

    ctx.fillStyle = `rgba(255,255,255,${milk})`;
    ctx.fillRect(x, y, w, h);
    const sheen = ctx.createLinearGradient(x, y, x, y + h * 0.55);
    sheen.addColorStop(0, "rgba(255,255,255,0.7)");
    sheen.addColorStop(0.22, "rgba(255,255,255,0.16)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(x, y, w, h * 0.62);
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    addRoundRect(ctx, x + 1, y + 1, w - 2, h - 2, r);
    ctx.stroke();
    ctx.strokeStyle = "rgba(17,18,20,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    addRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
    ctx.stroke();
    ctx.restore();
  }

  private photo(
    ctx: CanvasRenderingContext2D,
    index: number,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    alpha: number,
    rot = 0,
    filter?: string,
    shadow = true,
  ) {
    const still = this.img(index);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rot);
    if (shadow) {
      ctx.shadowColor = "rgba(17,18,20,0.16)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      addRoundRect(ctx, -w / 2, -h / 2, w, h, r);
      ctx.fill();
      ctx.shadowColor = "transparent";
    }
    cover(ctx, still.img, -w / 2, -h / 2, w, h, r, filter);
    ctx.restore();
  }

  private styleAt(t: number) {
    const idx = mod(sixteenthIndex(t), STYLES.length);
    const boundary = DROP + sixteenthIndex(t) * SIXTEENTH;
    const local = clamp01((t - boundary) / (SIXTEENTH * 0.7));
    return { idx, u: easeOut(local), boundary };
  }

  private scene2Index(t: number) {
    const best = [0, 6, 11, 14, 26, 27, 30, 38, 8, 60, 64, 70, 72, 15, 7, 37];
    const s = sixteenthIndex(t);
    return best[mod(s, best.length)];
  }

  private scene6Index(t: number) {
    const hero = 14;
    const start = 14.42;
    const end = 15.7;
    if (t < start) return hero;
    const s0 = Math.ceil((start - DROP) / SIXTEENTH);
    const sEnd = Math.floor((end - DROP) / SIXTEENTH);
    const step = Math.max(0, Math.min(sixteenthIndex(t), sEnd) - s0);
    const seeds = [14, 27, 6, 38, 64, 11, 72, 0, 30, 70, 8, 37];
    return seeds[step % seeds.length];
  }

  private smoothedColor(t: number, indexAt: (time: number) => number): RGB {
    let acc = this.img(indexAt(t - 0.34)).color;
    for (let i = 1; i <= 6; i++) {
      const tt = t - 0.34 + (0.34 * i) / 6;
      const c = this.img(indexAt(tt)).color;
      acc = [
        lerp(acc[0], c[0], 0.42),
        lerp(acc[1], c[1], 0.42),
        lerp(acc[2], c[2], 0.42),
      ];
    }
    return acc;
  }

  private drawScene(
    ctx: CanvasRenderingContext2D,
    t: number,
    index: number,
    alpha: number,
    pass: "back" | "glass" | "front",
  ) {
    if (index === 0) this.scene1(ctx, t, alpha, pass);
    else if (index === 1) this.scene2(ctx, t, alpha, pass);
    else if (index === 2) this.scene3(ctx, t, alpha, pass);
    else if (index === 3) this.scene4(ctx, t, alpha, pass);
    else if (index === 4) this.scene5(ctx, t, alpha, pass);
    else if (index === 5) this.scene6(ctx, t, alpha, pass);
    else this.scene7(ctx, t, alpha, pass);
  }

  private scene1(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    if (pass === "back") {
      const drift = lerp(0.9, 1.07, clamp01(t / 2.3));
      for (const c of COLLAGE) {
        const ox = c.x + c.w / 2 - SIZE / 2;
        const oy = c.y + c.h / 2 - SIZE / 2;
        const x = SIZE / 2 + ox * drift - c.w / 2;
        const y = SIZE / 2 + oy * drift - c.h / 2;
        this.photo(ctx, c.i, x, y, c.w, c.h, 22, alpha, c.rot + t * 0.008);
      }
    }
    if (pass !== "front") return;
    const nameFade = 1 - smooth(clamp01((t - 1.62) / FADE));
    const catIn = smooth(clamp01((t - 1.7) / FADE));
    drawTokens(
      ctx,
      [
        { t: 0.4, text: "This" },
        { t: 0.64, text: "is" },
      ],
      t,
      SIZE / 2,
      640,
      { fill: INK, weight: 500, size: 34, alpha: alpha * nameFade, tracking: 0.4 },
    );
    drawTokens(ctx, [{ t: 0.96, text: "Grok" }], t, SIZE / 2, 820, {
      fill: INK,
      weight: 600,
      size: 188,
      alpha: alpha * nameFade,
      tracking: -1.5,
    });
    drawTokens(
      ctx,
      [
        { t: 1.86, text: "An" },
        { t: 2.14, text: "AI" },
      ],
      t,
      SIZE / 2,
      740,
      { fill: INK, weight: 500, size: 72, alpha: alpha * catIn },
    );
  }

  private scene2(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    if (pass === "back") {
      const still = this.img(this.scene2Index(t));
      ctx.save();
      ctx.globalAlpha = alpha;
      cover(ctx, still.img, 0, 0, SIZE, SIZE, 0);
      const g = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 80, SIZE / 2, SIZE / 2, 620);
      g.addColorStop(0, "rgba(0,0,0,0.38)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.restore();
    }
    if (pass !== "front") return;
    drawTokens(
      ctx,
      [
        { t: 2.52, text: "built" },
        { t: 2.74, text: "to" },
        { t: 2.94, text: "know" },
        { t: 3.14, text: "everything" },
      ],
      t,
      SIZE / 2,
      SIZE / 2 + 20,
      { fill: "#F7F6F4", weight: 600, size: 76, alpha },
    );
  }

  private scene3(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    const { idx } = this.styleAt(t);
    const photoIndex = [0, 11, 6, 27, 38, 64, 14, 72, 8, 30, 70, 15][idx % 12];
    if (pass === "back") {
      const still = this.img(photoIndex);
      ctx.save();
      ctx.globalAlpha = alpha;
      cover(ctx, still.img, -40, -40, SIZE + 80, SIZE + 80, 0);
      ctx.fillStyle = "rgba(17,18,20,0.28)";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.restore();
      const card = { x: 390, y: 348, w: 660, h: 620, r: 32 };
      this.photo(ctx, photoIndex, card.x, card.y, card.w, card.h, card.r, alpha);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      addRoundRect(ctx, card.x, card.y, card.w, card.h, card.r);
      ctx.clip();
      const shade = ctx.createLinearGradient(0, card.y + card.h * 0.55, 0, card.y + card.h);
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = shade;
      ctx.fillRect(card.x, card.y, card.w, card.h);
      ctx.fillStyle = "#F7F6F4";
      ctx.font = font(500, 28);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(ANSWERS[idx], card.x + 32, card.y + card.h - 36);
      ctx.restore();
    }
    if (pass === "glass") {
      this.glass(ctx, { x: 210, y: 1020, w: 1020, h: 108, r: 28, milk: 0.34 }, alpha);
    }
    if (pass !== "front") return;
    drawTokens(
      ctx,
      [
        { t: 4.22, text: "Answer" },
        { t: 4.52, text: "in" },
        { t: 4.74, text: "ANY" },
        { t: 5.08, text: "style" },
      ],
      t,
      SIZE / 2,
      150,
      { fill: "#F7F6F4", weight: 600, size: 54, alpha },
    );
    this.drawThumbs(ctx, t, alpha);
    this.drawChip(ctx, t, alpha);
    this.drawPrompt(ctx, t, alpha);
  }

  private drawThumbs(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
    const { idx, u } = this.styleAt(t);
    const shown = idx - 1 + u;
    const tw = 64;
    const gap = 12;
    const pitch = tw + gap;
    const y = 188;
    const photos = [0, 11, 6, 27, 38, 64, 14, 72, 8, 30, 70, 15];
    for (let s = idx - 4; s <= idx + 4; s++) {
      const pos = s - shown;
      const x = SIZE / 2 + pos * pitch - tw / 2;
      const si = mod(s, STYLES.length);
      this.photo(ctx, photos[si], x, y, tw, tw, 10, alpha, 0, undefined, false);
    }
  }

  private drawChip(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
    const { idx, u } = this.styleAt(t);
    const curr = STYLES[idx];
    const prev = STYLES[mod(idx - 1, STYLES.length)];
    ctx.save();
    ctx.font = font(500, 22);
    const pad = 22;
    const textW = Math.max(ctx.measureText(curr).width, ctx.measureText(prev).width);
    const w = textW + pad * 2;
    const h = 46;
    const x = SIZE / 2 - w / 2;
    const y = 272;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = INK;
    ctx.beginPath();
    addRoundRect(ctx, x, y, w, h, 23);
    ctx.fill();
    ctx.beginPath();
    addRoundRect(ctx, x, y, w, h, 23);
    ctx.clip();
    ctx.fillStyle = PAPER;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(prev, SIZE / 2, y + h / 2 + (1 - u) * -h * 0 + u * -h);
    ctx.fillText(curr, SIZE / 2, y + h / 2 + (1 - u) * h);
    ctx.restore();
  }

  private drawPrompt(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
    const x = 246;
    const y = 1074;
    ctx.save();
    ctx.font = font(500, 32);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    let cx = x;
    const tStart = 4.36;
    for (let i = 0; i < PROMPT.length; i++) {
      const ch = PROMPT[i];
      const chW = ctx.measureText(ch).width;
      const a = letterAlpha(t, tStart + i * 0.038) * alpha;
      if (a > 0.01) {
        ctx.globalAlpha = a;
        ctx.fillText(ch, cx, y);
      }
      cx += chW;
    }
    if (t > tStart) {
      const caretA = alpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 7)));
      ctx.globalAlpha = caretA;
      ctx.fillRect(cx + 4, y - 16, 2, 32);
    }
    ctx.restore();
  }

  private scene4(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    const n = 9;
    const size = 248;
    const gap = 16;
    const total = size * 3 + gap * 2;
    const gx0 = (SIZE - total) / 2;
    const gy0 = (SIZE - total) / 2 + 30;
    const gather = smooth(clamp01((t - 7.25) / 0.8));
    if (pass === "back") {
      for (let i = 0; i < n; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const gx = gx0 + col * (size + gap);
        const gy = gy0 + row * (size + gap);
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2 + (t - 7.4) * 0.12;
        const rad = 430;
        const cx = SIZE / 2 + Math.cos(ang) * rad - size / 2;
        const cy = SIZE / 2 + Math.sin(ang) * rad - size / 2;
        const fly = easeOut(clamp01((t - (5.92 + i * 0.045)) / 0.72));
        const a0 = ang;
        const sx = gx + Math.cos(a0) * 720;
        const sy = gy + Math.sin(a0) * 520;
        const x = lerp(lerp(sx, gx, fly), cx, gather);
        const y = lerp(lerp(sy, gy, fly), cy, gather);
        const fade = smooth(clamp01((t - (5.92 + i * 0.045)) / 0.32));
        this.photo(ctx, i * 7 + 2, x, y, size, size, 20, alpha * fade, lerp((i - 4) * 0.08, 0, fly));
      }
    }
    if (pass !== "front") return;
    const topA = 1 - smooth(clamp01((t - 7.15) / FADE));
    const midA = smooth(clamp01((t - 7.45) / FADE));
    drawTokens(
      ctx,
      [
        { t: 5.96, text: "Give" },
        { t: 6.18, text: "it" },
        { t: 6.36, text: "a" },
        { t: 6.56, text: "question" },
      ],
      t,
      SIZE / 2,
      150,
      { fill: INK, weight: 500, size: 42, alpha: alpha * topA },
    );
    drawTokens(
      ctx,
      [
        { t: 7.5, text: "and" },
        { t: 7.7, text: "it" },
        { t: 7.9, text: "just" },
      ],
      t,
      SIZE / 2,
      690,
      { fill: INK, weight: 500, size: 36, alpha: alpha * midA },
    );
    drawTokens(ctx, [{ t: 8.15, text: "understands" }], t, SIZE / 2, 770, {
      fill: INK,
      weight: 600,
      size: 64,
      alpha: alpha * midA,
    });
  }

  private scene5(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    if (pass !== "front") return;
    drawTokens(
      ctx,
      [
        { t: 9.18, text: "The" },
        { t: 9.4, text: "more" },
        { t: 9.64, text: "you" },
        { t: 9.88, text: "use" },
        { t: 10.12, text: "it" },
      ],
      t,
      SIZE / 2,
      640,
      { fill: INK, weight: 500, size: 52, alpha },
    );
    drawTokens(
      ctx,
      [
        { t: 10.55, text: "the" },
        { t: 10.9, text: "BETTER", emphasis: true },
        { t: 11.42, text: "it" },
        { t: 11.64, text: "gets" },
      ],
      t,
      SIZE / 2,
      760,
      { fill: INK, weight: 600, size: 78, alpha },
    );
  }

  private scene6(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    const index = this.scene6Index(t);
    const depth = lerp(0.18, 0.78, easeOut(clamp01((t - 13.35) / 0.6)));
    const tone = lerp(0.16, 0.9, easeOut(clamp01((t - 15.7) / 0.55)));
    const hue = ((depth - 0.18) / 0.6) * 46;
    const poster = smooth(clamp01((tone - 0.16) / 0.74));
    const frame = { x: 150, y: 248, w: 860, h: 920, r: 28 };
    if (pass === "back") {
      const col = this.smoothedColor(t, (time) => this.scene6Index(time));
      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.filter = "blur(70px)";
      ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
      ctx.beginPath();
      ctx.arc(1040, 680, 420, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      this.photo(
        ctx,
        index,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        frame.r,
        alpha,
        0,
        `hue-rotate(${hue}deg) saturate(${1 + poster * 0.15})`,
      );
      if (poster > 0.01) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        addRoundRect(ctx, frame.x, frame.y, frame.w, frame.h, frame.r);
        ctx.clip();
        const block = frame.h * 0.4 * poster;
        ctx.fillStyle = INK;
        ctx.globalAlpha = alpha * poster;
        ctx.fillRect(frame.x, frame.y + frame.h - block, frame.w, block);
        ctx.fillStyle = PAPER;
        ctx.font = font(600, 48);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("Field note", frame.x + 36, frame.y + frame.h - block + 78);
        ctx.font = font(400, 24);
        ctx.fillText("How birds find home", frame.x + 36, frame.y + frame.h - block + 122);
        ctx.restore();
      }
    }
    if (pass === "glass") {
      this.glass(ctx, { x: 900, y: 268, w: 390, h: 820, r: 32, milk: 0.24 }, alpha);
    }
    if (pass !== "front") return;
    drawTokens(
      ctx,
      [
        { t: 12.8, text: "Adjust" },
        { t: 13.08, text: "its" },
        { t: 13.35, text: "depth" },
      ],
      t,
      1095,
      360,
      { fill: INK, weight: 500, size: 32, alpha: alpha * (1 - smooth(clamp01((t - 13.95) / 0.3))) },
    );
    drawTokens(
      ctx,
      [
        { t: 14.15, text: "Its" },
        { t: 14.42, text: "sources" },
      ],
      t,
      1095,
      360,
      {
        fill: INK,
        weight: 500,
        size: 32,
        alpha:
          alpha *
          smooth(clamp01((t - 13.95) / 0.3)) *
          (1 - smooth(clamp01((t - 15.25) / 0.3))),
      },
    );
    drawTokens(
      ctx,
      [
        { t: 15.4, text: "Its" },
        { t: 15.7, text: "tone" },
      ],
      t,
      1095,
      360,
      { fill: INK, weight: 500, size: 32, alpha: alpha * smooth(clamp01((t - 15.25) / 0.3)) },
    );
    const labels = [
      { name: "Depth", value: depth, t0: 13.35 },
      { name: "Sources", value: lerp(0.22, 0.74, easeOut(clamp01((t - 14.42) / 0.55))), t0: 14.42 },
      { name: "Tone", value: tone, t0: 15.7 },
    ];
    labels.forEach((s, i) => {
      const y = 470 + i * 170;
      const on = smooth(clamp01((t - (s.t0 - 0.15)) / 0.3));
      ctx.save();
      ctx.globalAlpha = alpha * (0.45 + 0.55 * on);
      ctx.fillStyle = INK;
      ctx.font = font(500, 22);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(s.name, 948, y);
      const trackY = y + 36;
      ctx.strokeStyle = "rgba(17,18,20,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(948, trackY);
      ctx.lineTo(1238, trackY);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.beginPath();
      ctx.moveTo(948, trackY);
      ctx.lineTo(948 + 290 * s.value, trackY);
      ctx.stroke();
      ctx.fillStyle = PAPER;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(948 + 290 * s.value, trackY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  private scene7(ctx: CanvasRenderingContext2D, t: number, alpha: number, pass: "back" | "glass" | "front") {
    const gather = smooth(clamp01((t - 18.55) / 0.9));
    if (pass === "back") {
      for (const b of this.burst) {
        const out = easeOut(clamp01((t - (16.32 + b.delay)) / 0.7));
        const fade = smooth(clamp01((t - (16.32 + b.delay)) / 0.32));
        const dist = lerp(0, b.dist, out) * (1 - gather);
        const x = SIZE / 2 + Math.cos(b.ang) * dist - b.size / 2;
        const y = SIZE / 2 + Math.sin(b.ang) * dist - b.size / 2;
        const s = b.size * lerp(0.4, 1, out) * (1 - gather * 0.85);
        const a = alpha * fade * (1 - smooth(clamp01((gather - 0.45) / 0.5)));
        if (a < 0.02 || s < 4) continue;
        this.photo(
          ctx,
          b.img,
          x + (b.size - s) / 2,
          y + (b.size - s) / 2,
          s,
          s,
          12,
          a,
          b.rot * (1 - gather),
          undefined,
          false,
        );
      }
    }
    const pillIn = smooth(clamp01((t - (SCENES[6].t0 - 0.06)) / FADE));
    const pillA = alpha * pillIn * (1 - smooth(clamp01((t - 18.62) / FADE)));
    if (pass === "glass" && pillA > 0.02) {
      this.glass(ctx, { x: 250, y: 620, w: 940, h: 200, r: 36, milk: 0.4 }, pillA);
    }
    if (pass !== "front") return;
    drawTokens(
      ctx,
      [
        { t: 16.4, text: "Every" },
        { t: 16.7, text: "answer" },
      ],
      t,
      SIZE / 2,
      700,
      { fill: INK, weight: 500, size: 36, alpha: pillA },
    );
    drawTokens(
      ctx,
      [
        { t: 17.15, text: "exactly" },
        { t: 17.42, text: "as" },
        { t: 17.62, text: "you" },
        { t: 17.82, text: "pictured" },
        { t: 18.12, text: "it" },
      ],
      t,
      SIZE / 2,
      758,
      { fill: INK, weight: 500, size: 36, alpha: pillA },
    );
    const logoA = smooth(clamp01((t - 18.75) / FADE));
    drawTokens(ctx, [{ t: 18.9, text: "Grok" }], t, SIZE / 2, 730, {
      fill: INK,
      weight: 600,
      size: 168,
      alpha: alpha * logoA,
      tracking: -1.2,
    });
    drawTokens(
      ctx,
      [
        { t: 19.62, text: "Out" },
        { t: 19.86, text: "now" },
      ],
      t,
      SIZE / 2,
      840,
      { fill: INK, weight: 500, size: 36, alpha: alpha * logoA, tracking: 0.6 },
    );
  }

  seek(t: number) {
    const time = Math.max(0, Math.min(DURATION, t));
    const w = this.wctx;
    w.setTransform(1, 0, 0, 1, 0, 0);
    w.fillStyle = PAPER;
    w.fillRect(0, 0, SIZE, SIZE);
    this.aura(w, time);
    const alphas = SCENES.map((_, i) => sceneAlpha(time, i));
    for (const pass of ["back", "glass", "front"] as const) {
      if (pass === "glass") {
        this.sctx.setTransform(1, 0, 0, 1, 0, 0);
        this.sctx.drawImage(this.world, 0, 0);
      }
      for (let i = 0; i < SCENES.length; i++) {
        if (alphas[i] < 0.004) continue;
        this.drawScene(w, time, i, alphas[i], pass);
      }
    }
    const z = zoomAt(time);
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.scale(z, z);
    ctx.translate(-SIZE / 2, -SIZE / 2);
    ctx.drawImage(this.world, 0, 0);
    ctx.restore();
  }

  async scan() {
    const probe = document.createElement("canvas");
    probe.width = 96;
    probe.height = 96;
    const pctx = probe.getContext("2d", { willReadFrequently: true })!;
    const cuts = cutTimes();
    const dt = 1 / 60;
    let prev: Uint8ClampedArray | null = null;
    const spikes: Array<{ t: number; diff: number; allowed: boolean }> = [];
    const diffs: number[] = [];
    for (let frame = 0; frame <= Math.round(DURATION / dt); frame++) {
      const t = Math.min(DURATION, frame * dt);
      this.seek(t);
      pctx.drawImage(this.ctx.canvas, 0, 0, 96, 96);
      const data = pctx.getImageData(0, 0, 96, 96).data;
      if (prev) {
        let acc = 0;
        for (let i = 0; i < data.length; i += 16) {
          acc += Math.abs(data[i] - prev[i]) + Math.abs(data[i + 1] - prev[i + 1]) + Math.abs(data[i + 2] - prev[i + 2]);
        }
        const diff = acc / (data.length / 16);
        diffs.push(diff);
        const allowed = cuts.some((c) => Math.abs(c - t) <= dt * 1.2 || Math.abs(c - (t - dt)) <= dt * 0.2);
        if (diff > 18) spikes.push({ t: Number(t.toFixed(3)), diff: Number(diff.toFixed(2)), allowed });
      }
      prev = data;
    }
    diffs.sort((a, b) => a - b);
    const median = diffs[Math.floor(diffs.length / 2)] ?? 0;
    return {
      frames: diffs.length,
      median: Number(median.toFixed(3)),
      spikes: spikes.filter((s) => !s.allowed),
      allowedCuts: spikes.filter((s) => s.allowed).length,
    };
  }
}

export async function createFilm(canvas: HTMLCanvasElement) {
  await loadFonts();
  const manifest = (await fetch("/film/manifest.json").then((r) => r.json())) as Array<{
    src: string;
    color: string;
  }>;
  const loaded = (
    await Promise.all(
      manifest.map(async (item) => {
        const img = await loadImage(item.src);
        return img ? { img, color: parseHex(item.color) } : null;
      }),
    )
  ).filter((x): x is Still => Boolean(x));
  if (loaded.length < 9) throw new Error("images");
  const film = new Film(canvas, loaded);
  film.seek(0);
  return film;
}

export { DURATION, cutTimes };
