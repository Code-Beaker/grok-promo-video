import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-XhmLllCL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIZE = 1440;
var BPM = 129.83;
var DROP = 4.2;
var SIXTEENTH = 60 / BPM / 4;
var FADE = .34;
var INK = "#111214";
var PAPER = "#F7F6F4";
var SCENES = [
	{
		id: 1,
		t0: 0,
		t1: 2.5,
		z0: 1,
		z1: 1.04
	},
	{
		id: 2,
		t0: 2.5,
		t1: 4.2,
		z0: 1.04,
		z1: 1.08
	},
	{
		id: 3,
		t0: 4.2,
		t1: 5.9,
		z0: 1.08,
		z1: 1.12
	},
	{
		id: 4,
		t0: 5.9,
		t1: 9.1,
		z0: 1.12,
		z1: 1.16
	},
	{
		id: 5,
		t0: 9.1,
		t1: 12.72,
		z0: 1.16,
		z1: 1.2
	},
	{
		id: 6,
		t0: 12.72,
		t1: 16.28,
		z0: 1.2,
		z1: 1.24
	},
	{
		id: 7,
		t0: 16.28,
		t1: 22,
		z0: 1.24,
		z1: 1.28
	}
];
var STYLES = [
	"Editorial",
	"Field note",
	"Nocturne",
	"Atlas",
	"Daylight",
	"Archive",
	"Studio",
	"Polaroid",
	"Blueprint",
	"Soft grain",
	"Coastal",
	"Ink"
];
var ANSWERS = [
	"They read the sky",
	"A map of wind and light",
	"By stars, quietly",
	"Along old magnetic lines",
	"The sun is a compass",
	"Memory, passed wing to wing",
	"Practice, then instinct",
	"Home is a direction",
	"A route written in light",
	"They remember the air",
	"The shoreline pulls",
	"Ask, and the path appears"
];
var PROMPT = "How do birds find home";
function clamp01(v) {
	return Math.max(0, Math.min(1, v));
}
function smooth(t) {
	const x = clamp01(t);
	return x * x * (3 - 2 * x);
}
function easeOut(t) {
	return 1 - (1 - clamp01(t)) ** 3;
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function sceneAlpha(t, index) {
	const sc = SCENES[index];
	const fade = FADE;
	return (index === 0 ? smooth(clamp01(t / fade)) : smooth(clamp01((t - (sc.t0 - fade)) / fade))) * (index === SCENES.length - 1 ? 1 : 1 - smooth(clamp01((t - (sc.t1 - fade)) / fade)));
}
function zoomAt(t) {
	if (t <= 0) return SCENES[0].z0;
	for (const sc of SCENES) if (t <= sc.t1) {
		const u = clamp01((t - sc.t0) / (sc.t1 - sc.t0));
		return lerp(sc.z0, sc.z1, u);
	}
	return SCENES[SCENES.length - 1].z1;
}
function sixteenthIndex(t) {
	return Math.floor((t - DROP) / SIXTEENTH + 1e-6);
}
function cutTimes() {
	const times = [];
	const push = (t0, t1) => {
		let n = Math.ceil((t0 - DROP) / SIXTEENTH - 1e-6);
		for (;;) {
			const tt = DROP + n * SIXTEENTH;
			if (tt > t1 + 1e-6) break;
			if (tt >= t0 - 1e-6) times.push(Number(tt.toFixed(4)));
			n += 1;
		}
	};
	push(SCENES[1].t0, SCENES[1].t1);
	push(SCENES[2].t0, SCENES[2].t1);
	push(14.42, 15.85);
	return times;
}
function letterAlpha(t, t0) {
	return smooth(clamp01((t - t0) / .3));
}
function mod(n, m) {
	return (n % m + m) % m;
}
var COLLAGE = [
	{
		i: 0,
		x: 48,
		y: 56,
		w: 390,
		h: 280,
		rot: -.05
	},
	{
		i: 6,
		x: 500,
		y: 36,
		w: 340,
		h: 230,
		rot: .03
	},
	{
		i: 11,
		x: 980,
		y: 72,
		w: 390,
		h: 270,
		rot: .045
	},
	{
		i: 27,
		x: 28,
		y: 400,
		w: 300,
		h: 380,
		rot: -.03
	},
	{
		i: 15,
		x: 1100,
		y: 390,
		w: 300,
		h: 360,
		rot: .04
	},
	{
		i: 64,
		x: 70,
		y: 1040,
		w: 420,
		h: 280,
		rot: .03
	},
	{
		i: 70,
		x: 540,
		y: 1100,
		w: 400,
		h: 260,
		rot: -.035
	},
	{
		i: 38,
		x: 1e3,
		y: 1020,
		w: 380,
		h: 290,
		rot: .02
	},
	{
		i: 8,
		x: 360,
		y: 250,
		w: 250,
		h: 180,
		rot: -.02
	},
	{
		i: 72,
		x: 860,
		y: 230,
		w: 240,
		h: 170,
		rot: .025
	}
];
function parseHex(hex) {
	const h = hex.replace("#", "");
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16)
	];
}
function loadImage(src) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => resolve(null);
		img.src = src;
	});
}
async function loadFonts() {
	await Promise.all([
		["400", "/fonts/Geist-400.woff2"],
		["500", "/fonts/Geist-500.woff2"],
		["600", "/fonts/Geist-600.woff2"]
	].map(async ([weight, url]) => {
		const face = new FontFace("Geist", `url(${url})`, {
			weight,
			style: "normal"
		});
		await face.load();
		document.fonts.add(face);
	}));
}
function addRoundRect(ctx, x, y, w, h, r) {
	const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
function cover(ctx, img, x, y, w, h, r, filter) {
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
function font(weight, size) {
	return `${weight} ${size}px Geist`;
}
function wordSpan(token, nextT) {
	return Math.min(.26, Math.max(.12, (nextT - token.t) * .62));
}
function drawTokens(ctx, tokens, t, cx, baseline, opts) {
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
	let x = cx - (widths.reduce((a, b) => a + b, 0) + space * Math.max(0, tokens.length - 1)) / 2;
	tokens.forEach((tok, i) => {
		const span = wordSpan(tok, tokens[i + 1]?.t ?? tok.t + .48);
		if (tok.emphasis) {
			const scale = lerp(1.035, 1, easeOut(clamp01((t - tok.t) / .5)));
			const wordW = widths[i];
			const startX = x;
			for (let c = 0; c < tok.text.length; c++) {
				const ch = tok.text[c];
				const chW = ctx.measureText(ch).width;
				const a = letterAlpha(t, tok.t + c / tok.text.length * span) * opts.alpha;
				if (a > .01) {
					ctx.save();
					ctx.translate(startX + wordW / 2, baseline - opts.size * .35);
					ctx.scale(scale, scale);
					ctx.translate(-(startX + wordW / 2), -(baseline - opts.size * .35));
					ctx.globalAlpha = a;
					ctx.shadowColor = "rgba(190, 206, 220, 0.95)";
					ctx.shadowBlur = 22 * a;
					const g = ctx.createLinearGradient(startX, baseline - opts.size, startX + wordW, baseline);
					g.addColorStop(0, "#24384a");
					g.addColorStop(.48, INK);
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
				const a = letterAlpha(t, tok.t + c / tok.text.length * span) * opts.alpha;
				if (a > .01) {
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
var Film = class {
	stills;
	ctx;
	world;
	wctx;
	snap;
	sctx;
	small;
	sm;
	mid;
	md;
	burst;
	constructor(canvas, stills) {
		this.stills = stills;
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!ctx) throw new Error("canvas");
		this.ctx = ctx;
		this.world = document.createElement("canvas");
		this.world.width = SIZE;
		this.world.height = SIZE;
		this.wctx = this.world.getContext("2d", { alpha: false });
		this.snap = document.createElement("canvas");
		this.snap.width = SIZE;
		this.snap.height = SIZE;
		this.sctx = this.snap.getContext("2d", { alpha: false });
		this.small = document.createElement("canvas");
		this.small.width = SIZE / 4;
		this.small.height = SIZE / 4;
		this.sm = this.small.getContext("2d");
		this.mid = document.createElement("canvas");
		this.mid.width = SIZE / 2;
		this.mid.height = SIZE / 2;
		this.md = this.mid.getContext("2d");
		this.burst = [];
		const rings = [
			{
				n: 16,
				dist: 210,
				size: 128
			},
			{
				n: 24,
				dist: 360,
				size: 112
			},
			{
				n: 32,
				dist: 510,
				size: 100
			},
			{
				n: 48,
				dist: 670,
				size: 86
			}
		];
		let k = 0;
		rings.forEach((ring, ri) => {
			for (let i = 0; i < ring.n; i++) {
				this.burst.push({
					ang: i / ring.n * Math.PI * 2 + ri * .31,
					dist: ring.dist,
					img: (k * 5 + ri) % stills.length,
					rot: (k % 9 - 4) * .06,
					size: ring.size,
					delay: ri * .045 + i % 5 * .012
				});
				k += 1;
			}
		});
	}
	img(i) {
		return this.stills[mod(i, this.stills.length)];
	}
	aura(ctx, t, alpha = 1) {
		const blobs = [
			{
				c: "213,228,242",
				x: .28 + Math.sin(t * .13) * .05,
				y: .32,
				r: 560
			},
			{
				c: "240,221,208",
				x: .74 + Math.cos(t * .11) * .04,
				y: .62,
				r: 520
			},
			{
				c: "220,232,220",
				x: .48 + Math.sin(t * .09) * .04,
				y: .84,
				r: 440
			}
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
	blitBlur(dest, blurPx, magnify = 1, origin) {
		const factor = blurPx >= 8 ? 4 : 2;
		const c = factor === 4 ? this.small : this.mid;
		const sctx = factor === 4 ? this.sm : this.md;
		const sw = SIZE / factor;
		sctx.setTransform(1, 0, 0, 1, 0, 0);
		sctx.clearRect(0, 0, sw, sw);
		sctx.filter = `blur(${Math.max(.4, blurPx / factor)}px)`;
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
	glass(ctx, box, alpha) {
		const { x, y, w, h, r } = box;
		const milk = box.milk ?? .3;
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
			this.blitBlur(ctx, 4, 1.06, {
				x: x + w / 2,
				y: y + h / 2
			});
			ctx.restore();
		}
		ctx.fillStyle = `rgba(255,255,255,${milk})`;
		ctx.fillRect(x, y, w, h);
		const sheen = ctx.createLinearGradient(x, y, x, y + h * .55);
		sheen.addColorStop(0, "rgba(255,255,255,0.7)");
		sheen.addColorStop(.22, "rgba(255,255,255,0.16)");
		sheen.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = sheen;
		ctx.fillRect(x, y, w, h * .62);
		ctx.strokeStyle = "rgba(255,255,255,0.92)";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		addRoundRect(ctx, x + 1, y + 1, w - 2, h - 2, r);
		ctx.stroke();
		ctx.strokeStyle = "rgba(17,18,20,0.14)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		addRoundRect(ctx, x + .5, y + .5, w - 1, h - 1, r);
		ctx.stroke();
		ctx.restore();
	}
	photo(ctx, index, x, y, w, h, r, alpha, rot = 0, filter, shadow = true) {
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
	styleAt(t) {
		const idx = mod(sixteenthIndex(t), STYLES.length);
		const boundary = DROP + sixteenthIndex(t) * SIXTEENTH;
		return {
			idx,
			u: easeOut(clamp01((t - boundary) / (SIXTEENTH * .7))),
			boundary
		};
	}
	scene2Index(t) {
		const best = [
			0,
			6,
			11,
			14,
			26,
			27,
			30,
			38,
			8,
			60,
			64,
			70,
			72,
			15,
			7,
			37
		];
		return best[mod(sixteenthIndex(t), best.length)];
	}
	scene6Index(t) {
		const hero = 14;
		const start = 14.42;
		const end = 15.7;
		if (t < start) return hero;
		const s0 = Math.ceil((start - DROP) / SIXTEENTH);
		const sEnd = Math.floor((end - DROP) / SIXTEENTH);
		const step = Math.max(0, Math.min(sixteenthIndex(t), sEnd) - s0);
		const seeds = [
			14,
			27,
			6,
			38,
			64,
			11,
			72,
			0,
			30,
			70,
			8,
			37
		];
		return seeds[step % seeds.length];
	}
	smoothedColor(t, indexAt) {
		let acc = this.img(indexAt(t - .34)).color;
		for (let i = 1; i <= 6; i++) {
			const tt = t - .34 + .34 * i / 6;
			const c = this.img(indexAt(tt)).color;
			acc = [
				lerp(acc[0], c[0], .42),
				lerp(acc[1], c[1], .42),
				lerp(acc[2], c[2], .42)
			];
		}
		return acc;
	}
	drawScene(ctx, t, index, alpha, pass) {
		if (index === 0) this.scene1(ctx, t, alpha, pass);
		else if (index === 1) this.scene2(ctx, t, alpha, pass);
		else if (index === 2) this.scene3(ctx, t, alpha, pass);
		else if (index === 3) this.scene4(ctx, t, alpha, pass);
		else if (index === 4) this.scene5(ctx, t, alpha, pass);
		else if (index === 5) this.scene6(ctx, t, alpha, pass);
		else this.scene7(ctx, t, alpha, pass);
	}
	scene1(ctx, t, alpha, pass) {
		if (pass === "back") {
			const drift = lerp(.9, 1.07, clamp01(t / 2.3));
			for (const c of COLLAGE) {
				const ox = c.x + c.w / 2 - SIZE / 2;
				const oy = c.y + c.h / 2 - SIZE / 2;
				const x = SIZE / 2 + ox * drift - c.w / 2;
				const y = SIZE / 2 + oy * drift - c.h / 2;
				this.photo(ctx, c.i, x, y, c.w, c.h, 22, alpha, c.rot + t * .008);
			}
		}
		if (pass !== "front") return;
		const nameFade = 1 - smooth(clamp01((t - 1.62) / FADE));
		const catIn = smooth(clamp01((t - 1.7) / FADE));
		drawTokens(ctx, [{
			t: .4,
			text: "This"
		}, {
			t: .64,
			text: "is"
		}], t, SIZE / 2, 640, {
			fill: INK,
			weight: 500,
			size: 34,
			alpha: alpha * nameFade,
			tracking: .4
		});
		drawTokens(ctx, [{
			t: .96,
			text: "Grok"
		}], t, SIZE / 2, 820, {
			fill: INK,
			weight: 600,
			size: 188,
			alpha: alpha * nameFade,
			tracking: -1.5
		});
		drawTokens(ctx, [{
			t: 1.86,
			text: "An"
		}, {
			t: 2.14,
			text: "AI"
		}], t, SIZE / 2, 740, {
			fill: INK,
			weight: 500,
			size: 72,
			alpha: alpha * catIn
		});
	}
	scene2(ctx, t, alpha, pass) {
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
		drawTokens(ctx, [
			{
				t: 2.52,
				text: "built"
			},
			{
				t: 2.74,
				text: "to"
			},
			{
				t: 2.94,
				text: "know"
			},
			{
				t: 3.14,
				text: "everything"
			}
		], t, SIZE / 2, SIZE / 2 + 20, {
			fill: "#F7F6F4",
			weight: 600,
			size: 76,
			alpha
		});
	}
	scene3(ctx, t, alpha, pass) {
		const { idx } = this.styleAt(t);
		const photoIndex = [
			0,
			11,
			6,
			27,
			38,
			64,
			14,
			72,
			8,
			30,
			70,
			15
		][idx % 12];
		if (pass === "back") {
			const still = this.img(photoIndex);
			ctx.save();
			ctx.globalAlpha = alpha;
			cover(ctx, still.img, -40, -40, SIZE + 80, SIZE + 80, 0);
			ctx.fillStyle = "rgba(17,18,20,0.28)";
			ctx.fillRect(0, 0, SIZE, SIZE);
			ctx.restore();
			const card = {
				x: 390,
				y: 348,
				w: 660,
				h: 620,
				r: 32
			};
			this.photo(ctx, photoIndex, card.x, card.y, card.w, card.h, card.r, alpha);
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			addRoundRect(ctx, card.x, card.y, card.w, card.h, card.r);
			ctx.clip();
			const shade = ctx.createLinearGradient(0, card.y + card.h * .55, 0, card.y + card.h);
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
		if (pass === "glass") this.glass(ctx, {
			x: 210,
			y: 1020,
			w: 1020,
			h: 108,
			r: 28,
			milk: .34
		}, alpha);
		if (pass !== "front") return;
		drawTokens(ctx, [
			{
				t: 4.22,
				text: "Answer"
			},
			{
				t: 4.52,
				text: "in"
			},
			{
				t: 4.74,
				text: "ANY"
			},
			{
				t: 5.08,
				text: "style"
			}
		], t, SIZE / 2, 150, {
			fill: "#F7F6F4",
			weight: 600,
			size: 54,
			alpha
		});
		this.drawThumbs(ctx, t, alpha);
		this.drawChip(ctx, t, alpha);
		this.drawPrompt(ctx, t, alpha);
	}
	drawThumbs(ctx, t, alpha) {
		const { idx, u } = this.styleAt(t);
		const shown = idx - 1 + u;
		const tw = 64;
		const pitch = 76;
		const y = 188;
		const photos = [
			0,
			11,
			6,
			27,
			38,
			64,
			14,
			72,
			8,
			30,
			70,
			15
		];
		for (let s = idx - 4; s <= idx + 4; s++) {
			const pos = s - shown;
			const x = SIZE / 2 + pos * pitch - tw / 2;
			const si = mod(s, STYLES.length);
			this.photo(ctx, photos[si], x, y, tw, tw, 10, alpha, 0, void 0, false);
		}
	}
	drawChip(ctx, t, alpha) {
		const { idx, u } = this.styleAt(t);
		const curr = STYLES[idx];
		const prev = STYLES[mod(idx - 1, STYLES.length)];
		ctx.save();
		ctx.font = font(500, 22);
		const w = Math.max(ctx.measureText(curr).width, ctx.measureText(prev).width) + 44;
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
		ctx.fillText(prev, SIZE / 2, 295 + (1 - u) * -46 * 0 + u * -46);
		ctx.fillText(curr, SIZE / 2, 295 + (1 - u) * h);
		ctx.restore();
	}
	drawPrompt(ctx, t, alpha) {
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
			const a = letterAlpha(t, tStart + i * .038) * alpha;
			if (a > .01) {
				ctx.globalAlpha = a;
				ctx.fillText(ch, cx, y);
			}
			cx += chW;
		}
		if (t > tStart) {
			ctx.globalAlpha = alpha * (.35 + .65 * (.5 + .5 * Math.sin(t * 7)));
			ctx.fillRect(cx + 4, 1058, 2, 32);
		}
		ctx.restore();
	}
	scene4(ctx, t, alpha, pass) {
		const n = 9;
		const size = 248;
		const total = 776;
		const gx0 = (SIZE - total) / 2;
		const gy0 = (SIZE - total) / 2 + 30;
		const gather = smooth(clamp01((t - 7.25) / .8));
		if (pass === "back") for (let i = 0; i < n; i++) {
			const col = i % 3;
			const row = Math.floor(i / 3);
			const gx = gx0 + col * 264;
			const gy = gy0 + row * 264;
			const ang = -Math.PI / 2 + i / n * Math.PI * 2 + (t - 7.4) * .12;
			const rad = 430;
			const cx = SIZE / 2 + Math.cos(ang) * rad - size / 2;
			const cy = SIZE / 2 + Math.sin(ang) * rad - size / 2;
			const fly = easeOut(clamp01((t - (5.92 + i * .045)) / .72));
			const a0 = ang;
			const sx = gx + Math.cos(a0) * 720;
			const sy = gy + Math.sin(a0) * 520;
			const x = lerp(lerp(sx, gx, fly), cx, gather);
			const y = lerp(lerp(sy, gy, fly), cy, gather);
			const fade = smooth(clamp01((t - (5.92 + i * .045)) / .32));
			this.photo(ctx, i * 7 + 2, x, y, size, size, 20, alpha * fade, lerp((i - 4) * .08, 0, fly));
		}
		if (pass !== "front") return;
		const topA = 1 - smooth(clamp01((t - 7.15) / FADE));
		const midA = smooth(clamp01((t - 7.45) / FADE));
		drawTokens(ctx, [
			{
				t: 5.96,
				text: "Give"
			},
			{
				t: 6.18,
				text: "it"
			},
			{
				t: 6.36,
				text: "a"
			},
			{
				t: 6.56,
				text: "question"
			}
		], t, SIZE / 2, 150, {
			fill: INK,
			weight: 500,
			size: 42,
			alpha: alpha * topA
		});
		drawTokens(ctx, [
			{
				t: 7.5,
				text: "and"
			},
			{
				t: 7.7,
				text: "it"
			},
			{
				t: 7.9,
				text: "just"
			}
		], t, SIZE / 2, 690, {
			fill: INK,
			weight: 500,
			size: 36,
			alpha: alpha * midA
		});
		drawTokens(ctx, [{
			t: 8.15,
			text: "understands"
		}], t, SIZE / 2, 770, {
			fill: INK,
			weight: 600,
			size: 64,
			alpha: alpha * midA
		});
	}
	scene5(ctx, t, alpha, pass) {
		if (pass !== "front") return;
		drawTokens(ctx, [
			{
				t: 9.18,
				text: "The"
			},
			{
				t: 9.4,
				text: "more"
			},
			{
				t: 9.64,
				text: "you"
			},
			{
				t: 9.88,
				text: "use"
			},
			{
				t: 10.12,
				text: "it"
			}
		], t, SIZE / 2, 640, {
			fill: INK,
			weight: 500,
			size: 52,
			alpha
		});
		drawTokens(ctx, [
			{
				t: 10.55,
				text: "the"
			},
			{
				t: 10.9,
				text: "BETTER",
				emphasis: true
			},
			{
				t: 11.42,
				text: "it"
			},
			{
				t: 11.64,
				text: "gets"
			}
		], t, SIZE / 2, 760, {
			fill: INK,
			weight: 600,
			size: 78,
			alpha
		});
	}
	scene6(ctx, t, alpha, pass) {
		const index = this.scene6Index(t);
		const depth = lerp(.18, .78, easeOut(clamp01((t - 13.35) / .6)));
		const tone = lerp(.16, .9, easeOut(clamp01((t - 15.7) / .55)));
		const hue = (depth - .18) / .6 * 46;
		const poster = smooth(clamp01((tone - .16) / .74));
		const frame = {
			x: 150,
			y: 248,
			w: 860,
			h: 920,
			r: 28
		};
		if (pass === "back") {
			const col = this.smoothedColor(t, (time) => this.scene6Index(time));
			ctx.save();
			ctx.globalAlpha = alpha * .9;
			ctx.filter = "blur(70px)";
			ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
			ctx.beginPath();
			ctx.arc(1040, 680, 420, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
			this.photo(ctx, index, frame.x, frame.y, frame.w, frame.h, frame.r, alpha, 0, `hue-rotate(${hue}deg) saturate(${1 + poster * .15})`);
			if (poster > .01) {
				ctx.save();
				ctx.globalAlpha = alpha;
				ctx.beginPath();
				addRoundRect(ctx, frame.x, frame.y, frame.w, frame.h, frame.r);
				ctx.clip();
				const block = frame.h * .4 * poster;
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
		if (pass === "glass") this.glass(ctx, {
			x: 900,
			y: 268,
			w: 390,
			h: 820,
			r: 32,
			milk: .24
		}, alpha);
		if (pass !== "front") return;
		drawTokens(ctx, [
			{
				t: 12.8,
				text: "Adjust"
			},
			{
				t: 13.08,
				text: "its"
			},
			{
				t: 13.35,
				text: "depth"
			}
		], t, 1095, 360, {
			fill: INK,
			weight: 500,
			size: 32,
			alpha: alpha * (1 - smooth(clamp01((t - 13.95) / .3)))
		});
		drawTokens(ctx, [{
			t: 14.15,
			text: "Its"
		}, {
			t: 14.42,
			text: "sources"
		}], t, 1095, 360, {
			fill: INK,
			weight: 500,
			size: 32,
			alpha: alpha * smooth(clamp01((t - 13.95) / .3)) * (1 - smooth(clamp01((t - 15.25) / .3)))
		});
		drawTokens(ctx, [{
			t: 15.4,
			text: "Its"
		}, {
			t: 15.7,
			text: "tone"
		}], t, 1095, 360, {
			fill: INK,
			weight: 500,
			size: 32,
			alpha: alpha * smooth(clamp01((t - 15.25) / .3))
		});
		[
			{
				name: "Depth",
				value: depth,
				t0: 13.35
			},
			{
				name: "Sources",
				value: lerp(.22, .74, easeOut(clamp01((t - 14.42) / .55))),
				t0: 14.42
			},
			{
				name: "Tone",
				value: tone,
				t0: 15.7
			}
		].forEach((s, i) => {
			const y = 470 + i * 170;
			const on = smooth(clamp01((t - (s.t0 - .15)) / .3));
			ctx.save();
			ctx.globalAlpha = alpha * (.45 + .55 * on);
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
	scene7(ctx, t, alpha, pass) {
		const gather = smooth(clamp01((t - 18.55) / .9));
		if (pass === "back") for (const b of this.burst) {
			const out = easeOut(clamp01((t - (16.32 + b.delay)) / .7));
			const fade = smooth(clamp01((t - (16.32 + b.delay)) / .32));
			const dist = lerp(0, b.dist, out) * (1 - gather);
			const x = SIZE / 2 + Math.cos(b.ang) * dist - b.size / 2;
			const y = SIZE / 2 + Math.sin(b.ang) * dist - b.size / 2;
			const s = b.size * lerp(.4, 1, out) * (1 - gather * .85);
			const a = alpha * fade * (1 - smooth(clamp01((gather - .45) / .5)));
			if (a < .02 || s < 4) continue;
			this.photo(ctx, b.img, x + (b.size - s) / 2, y + (b.size - s) / 2, s, s, 12, a, b.rot * (1 - gather), void 0, false);
		}
		const pillA = alpha * smooth(clamp01((t - (SCENES[6].t0 - .06)) / FADE)) * (1 - smooth(clamp01((t - 18.62) / FADE)));
		if (pass === "glass" && pillA > .02) this.glass(ctx, {
			x: 250,
			y: 620,
			w: 940,
			h: 200,
			r: 36,
			milk: .4
		}, pillA);
		if (pass !== "front") return;
		drawTokens(ctx, [{
			t: 16.4,
			text: "Every"
		}, {
			t: 16.7,
			text: "answer"
		}], t, SIZE / 2, 700, {
			fill: INK,
			weight: 500,
			size: 36,
			alpha: pillA
		});
		drawTokens(ctx, [
			{
				t: 17.15,
				text: "exactly"
			},
			{
				t: 17.42,
				text: "as"
			},
			{
				t: 17.62,
				text: "you"
			},
			{
				t: 17.82,
				text: "pictured"
			},
			{
				t: 18.12,
				text: "it"
			}
		], t, SIZE / 2, 758, {
			fill: INK,
			weight: 500,
			size: 36,
			alpha: pillA
		});
		const logoA = smooth(clamp01((t - 18.75) / FADE));
		drawTokens(ctx, [{
			t: 18.9,
			text: "Grok"
		}], t, SIZE / 2, 730, {
			fill: INK,
			weight: 600,
			size: 168,
			alpha: alpha * logoA,
			tracking: -1.2
		});
		drawTokens(ctx, [{
			t: 19.62,
			text: "Out"
		}, {
			t: 19.86,
			text: "now"
		}], t, SIZE / 2, 840, {
			fill: INK,
			weight: 500,
			size: 36,
			alpha: alpha * logoA,
			tracking: .6
		});
	}
	seek(t) {
		const time = Math.max(0, Math.min(22, t));
		const w = this.wctx;
		w.setTransform(1, 0, 0, 1, 0, 0);
		w.fillStyle = PAPER;
		w.fillRect(0, 0, SIZE, SIZE);
		this.aura(w, time);
		const alphas = SCENES.map((_, i) => sceneAlpha(time, i));
		for (const pass of [
			"back",
			"glass",
			"front"
		]) {
			if (pass === "glass") {
				this.sctx.setTransform(1, 0, 0, 1, 0, 0);
				this.sctx.drawImage(this.world, 0, 0);
			}
			for (let i = 0; i < SCENES.length; i++) {
				if (alphas[i] < .004) continue;
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
		const pctx = probe.getContext("2d", { willReadFrequently: true });
		const cuts = cutTimes();
		const dt = 1 / 60;
		let prev = null;
		const spikes = [];
		const diffs = [];
		for (let frame = 0; frame <= Math.round(22 / dt); frame++) {
			const t = Math.min(22, frame * dt);
			this.seek(t);
			pctx.drawImage(this.ctx.canvas, 0, 0, 96, 96);
			const data = pctx.getImageData(0, 0, 96, 96).data;
			if (prev) {
				let acc = 0;
				for (let i = 0; i < data.length; i += 16) acc += Math.abs(data[i] - prev[i]) + Math.abs(data[i + 1] - prev[i + 1]) + Math.abs(data[i + 2] - prev[i + 2]);
				const diff = acc / (data.length / 16);
				diffs.push(diff);
				const allowed = cuts.some((c) => Math.abs(c - t) <= dt * 1.2 || Math.abs(c - (t - dt)) <= dt * .2);
				if (diff > 18) spikes.push({
					t: Number(t.toFixed(3)),
					diff: Number(diff.toFixed(2)),
					allowed
				});
			}
			prev = data;
		}
		diffs.sort((a, b) => a - b);
		const median = diffs[Math.floor(diffs.length / 2)] ?? 0;
		return {
			frames: diffs.length,
			median: Number(median.toFixed(3)),
			spikes: spikes.filter((s) => !s.allowed),
			allowedCuts: spikes.filter((s) => s.allowed).length
		};
	}
};
async function createFilm(canvas) {
	await loadFonts();
	const manifest = await fetch("/film/manifest.json").then((r) => r.json());
	const loaded = (await Promise.all(manifest.map(async (item) => {
		const img = await loadImage(item.src);
		return img ? {
			img,
			color: parseHex(item.color)
		} : null;
	}))).filter((x) => Boolean(x));
	if (loaded.length < 9) throw new Error("images");
	const film = new Film(canvas, loaded);
	film.seek(0);
	return film;
}
function Home() {
	const canvasRef = (0, import_react.useRef)(null);
	const barRef = (0, import_react.useRef)(null);
	const [booting, setBooting] = (0, import_react.useState)(true);
	const [ended, setEnded] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const filmRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let raf = 0;
		let start = 0;
		let paused = false;
		let held = 0;
		let stop = false;
		const params = new URLSearchParams(window.location.search);
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const fixed = params.has("t") ? Number(params.get("t")) : null;
		const paintBar = (t) => {
			if (barRef.current) barRef.current.style.width = `${t / 22 * 100}%`;
		};
		const loop = (now) => {
			if (stop) return;
			const film = filmRef.current;
			if (!film) return;
			const t = paused ? held : Math.min(22, (now - start) / 1e3);
			film.seek(t);
			paintBar(t);
			if (!paused && t >= 22) {
				paused = true;
				held = 22;
				setEnded(true);
				return;
			}
			raf = requestAnimationFrame(loop);
		};
		const api = {
			ready: false,
			duration: 22,
			seek(t) {
				paused = true;
				held = t;
				filmRef.current?.seek(t);
				paintBar(t);
			},
			play() {
				if (!filmRef.current) return;
				paused = false;
				start = performance.now() - held * 1e3;
				setEnded(false);
				cancelAnimationFrame(raf);
				raf = requestAnimationFrame(loop);
			},
			pause() {
				paused = true;
			}
		};
		createFilm(canvas).then((film) => {
			filmRef.current = film;
			api.ready = true;
			window.__GROK_FILM__ = {
				...api,
				scan: () => film.scan()
			};
			setBooting(false);
			if (fixed !== null && !Number.isNaN(fixed)) {
				api.seek(fixed);
				return;
			}
			if (reduce) {
				api.seek(21);
				setEnded(true);
				return;
			}
			held = 0;
			start = performance.now();
			raf = requestAnimationFrame(loop);
		}).catch(() => setFailed(true));
		const onClick = () => {
			if (!filmRef.current || fixed !== null) return;
			if (paused && held >= 21.99) return;
			if (paused) api.play();
			else {
				held = Math.min(22, (performance.now() - start) / 1e3);
				api.pause();
			}
		};
		canvas.addEventListener("click", onClick);
		return () => {
			stop = true;
			cancelAnimationFrame(raf);
			canvas.removeEventListener("click", onClick);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "stage",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "Grok"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: "Know about everything. A launch film."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				id: "film",
				width: 1440,
				height: 1440,
				"aria-label": "Grok launch film"
			}),
			booting && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "boot",
				children: "Grok"
			}) : null,
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "boot",
				children: "Couldn’t load the film"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "progress",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { ref: barRef })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: ended ? "replay show" : "replay",
				onClick: () => window.__GROK_FILM__?.play(),
				children: "Replay"
			})
		]
	});
}
//#endregion
export { Home as component };
