// =============================================================================
// Visual system — hand-built, cohesive, institutional-grade inline SVGs.
// One coordinate system, one type scale, one palette. No stock imagery.
//
// Authoring model:
//   P(fx, fy) maps fractional coordinates to the plot box.
//   fx: 0 = left edge, 1 = right edge.
//   fy: 0 = plot floor (low price), 1 = plot ceiling (high price).
// =============================================================================

const VB_W = 480;
const VB_H = 300;
const PAD = { l: 30, r: 30, t: 48, b: 40 };
const PLOT_W = VB_W - PAD.l - PAD.r;
const PLOT_H = VB_H - PAD.t - PAD.b;
const FLOOR = PAD.t + PLOT_H; // y of fy=0

const C = {
  bg: "#0a0d13",
  panel: "#0c1018",
  hair: "rgba(255,255,255,0.055)",
  grid: "rgba(255,255,255,0.035)",
  axis: "#28303f",
  label: "#7f8799",
  faint: "#565e70",
  ink: "#d8dde7",
  price: "#c2c9d8",
  long: "#3fb6a8",
  short: "#e0a458",
  accent: "#7aa2ff",
  violet: "#a78bfa",
};

const x = (fx: number) => +(PAD.l + fx * PLOT_W).toFixed(2);
const y = (fy: number) => +(PAD.t + (1 - fy) * PLOT_H).toFixed(2);

type Pt = [number, number]; // fractional

// Catmull-Rom → cubic Bézier for elegant curves.
function spline(fpts: Pt[], smoothing = 0.2): string {
  const pts = fpts.map(([fx, fy]) => [x(fx), y(fy)] as [number, number]);
  if (pts.length < 2) return "";
  const ctrl = (
    cur: [number, number],
    prev: [number, number] | undefined,
    next: [number, number] | undefined,
    rev: boolean,
  ) => {
    const p = prev ?? cur;
    const n = next ?? cur;
    const dx = n[0] - p[0];
    const dy = n[1] - p[1];
    const ang = Math.atan2(dy, dx) + (rev ? Math.PI : 0);
    const len = Math.hypot(dx, dy) * smoothing;
    return [cur[0] + Math.cos(ang) * len, cur[1] + Math.sin(ang) * len];
  };
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cps = ctrl(pts[i - 1], pts[i - 2], pts[i], false);
    const cpe = ctrl(pts[i], pts[i - 1], pts[i + 1], true);
    d += ` C ${cps[0].toFixed(2)} ${cps[1].toFixed(2)}, ${cpe[0].toFixed(2)} ${cpe[1].toFixed(2)}, ${pts[i][0]} ${pts[i][1]}`;
  }
  return d;
}

let UID = 0;

function frame(
  title: string,
  build: (ns: (s: string) => string) => string,
  opts: { legend?: { c: string; t: string }[]; caption?: string } = {},
): string {
  const u = `s${++UID}`;
  const ns = (s: string) => `${s}_${u}`;
  const grid = [0.25, 0.5, 0.75]
    .map(
      (g) =>
        `<line x1="${PAD.l}" y1="${y(g)}" x2="${VB_W - PAD.r}" y2="${y(g)}" stroke="${C.grid}" stroke-dasharray="1 5" stroke-linecap="round"/>`,
    )
    .join("");
  const legend = opts.legend
    ? `<g transform="translate(${PAD.l}, ${VB_H - 16})" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">${opts.legend
        .map((l, i) => {
          const ox = i * 118;
          return `<rect x="${ox}" y="-7" width="9" height="9" rx="2" fill="${l.c}"/><text x="${ox + 15}" y="1">${l.t}</text>`;
        })
        .join("")}</g>`
    : "";
  const caption = opts.caption
    ? `<text x="${VB_W - PAD.r}" y="${VB_H - 14}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.faint}">${opts.caption}</text>`
    : "";
  return `<svg viewBox="0 0 ${VB_W} ${VB_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}" class="w-full h-auto block">
<defs>
  <linearGradient id="${ns("aLong")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.long}" stop-opacity="0.30"/><stop offset="100%" stop-color="${C.long}" stop-opacity="0"/></linearGradient>
  <linearGradient id="${ns("aShort")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.short}" stop-opacity="0.30"/><stop offset="100%" stop-color="${C.short}" stop-opacity="0"/></linearGradient>
  <linearGradient id="${ns("aAcc")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.accent}" stop-opacity="0.26"/><stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
  <linearGradient id="${ns("bar")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.accent}" stop-opacity="0.62"/><stop offset="100%" stop-color="${C.accent}" stop-opacity="0.16"/></linearGradient>
  <linearGradient id="${ns("barT")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.long}" stop-opacity="0.6"/><stop offset="100%" stop-color="${C.long}" stop-opacity="0.14"/></linearGradient>
  <marker id="${ns("arr")}" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${C.label}"/></marker>
  <filter id="${ns("glow")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect x="0" y="0" width="${VB_W}" height="${VB_H}" rx="12" fill="${C.bg}"/>
<rect x="${PAD.l}" y="${PAD.t}" width="${PLOT_W}" height="${PLOT_H}" rx="6" fill="${C.panel}"/>
<rect x="${PAD.l + 0.5}" y="${PAD.t + 0.5}" width="${PLOT_W - 1}" height="${PLOT_H - 1}" rx="6" fill="none" stroke="${C.hair}"/>
${grid}
<text x="${PAD.l}" y="28" font-family="JetBrains Mono, monospace" font-size="11" font-weight="500" letter-spacing="1.8" fill="${C.label}">${title.toUpperCase()}</text>
<line x1="${PAD.l}" y1="38" x2="${VB_W - PAD.r}" y2="38" stroke="${C.hair}"/>
${build(ns)}
${legend}
${caption}
</svg>`;
}

// ---- Scene primitives -------------------------------------------------------

const priceArea = (pts: Pt[], color: string, fillId: string, width = 2.25) => {
  const path = spline(pts);
  const last = x(pts[pts.length - 1][0]);
  const first = x(pts[0][0]);
  const fill = `${path} L ${last} ${FLOOR} L ${first} ${FLOOR} Z`;
  return `<path d="${fill}" fill="url(#${fillId})"/><path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const line = (pts: Pt[], color: string, width = 2, dash = "") =>
  `<path d="${spline(pts)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;

const level = (fy: number, color: string, label: string, from = 0, to = 1) =>
  `<line x1="${x(from)}" y1="${y(fy)}" x2="${x(to)}" y2="${y(fy)}" stroke="${color}" stroke-width="1.25" stroke-dasharray="5 4" opacity="0.85"/>
   <g transform="translate(${x(to) + 4}, ${y(fy)})"><rect x="0" y="-8.5" width="${label.length * 6.4 + 12}" height="17" rx="4" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.4"/><text x="6" y="3.5" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${color}">${label}</text></g>`;

const tag = (
  fx: number,
  fy: number,
  text: string,
  color: string,
  anchor: "start" | "middle" | "end" = "start",
) => {
  const w = text.length * 6.2 + 14;
  const tx = anchor === "end" ? x(fx) - w : anchor === "middle" ? x(fx) - w / 2 : x(fx);
  return `<g transform="translate(${tx}, ${y(fy)})"><rect x="0" y="-9.5" width="${w}" height="19" rx="5" fill="${C.bg}" stroke="${color}" stroke-opacity="0.5"/><text x="${w / 2}" y="3.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${color}">${text}</text></g>`;
};

const dot = (fx: number, fy: number, color: string, r = 4) =>
  `<circle cx="${x(fx)}" cy="${y(fy)}" r="${r + 2.5}" fill="${color}" opacity="0.18"/><circle cx="${x(fx)}" cy="${y(fy)}" r="${r}" fill="${color}" stroke="${C.bg}" stroke-width="1.5"/>`;

const leader = (fx1: number, fy1: number, fx2: number, fy2: number, color: string) =>
  `<path d="M ${x(fx1)} ${y(fy1)} L ${x(fx2)} ${y(fy2)}" stroke="${color}" stroke-width="1" stroke-dasharray="2 3" opacity="0.65"/>`;

// Left-anchored market-profile silhouette. rows: top→bottom relative widths 0..1.
function profile(
  ns: (s: string) => string,
  rows: number[],
  o: { pocIndex?: number; vaFrom?: number; vaTo?: number; barColor?: string; originFx?: number; maxFx?: number } = {},
): string {
  const n = rows.length;
  const gap = 2.4;
  const rowH = (PLOT_H - 16) / n;
  const ox = o.originFx ?? 0.06;
  const maxW = (o.maxFx ?? 0.62) * PLOT_W;
  const barId = o.barColor ?? ns("bar");
  let out = "";
  if (o.vaFrom != null && o.vaTo != null) {
    const yTop = PAD.t + 8 + o.vaFrom * rowH;
    const h = (o.vaTo - o.vaFrom + 1) * rowH;
    out += `<rect x="${x(ox) - 4}" y="${yTop}" width="${maxW + 10}" height="${h - gap}" rx="4" fill="${C.accent}" fill-opacity="0.06" stroke="${C.accent}" stroke-opacity="0.18"/>`;
  }
  rows.forEach((w, i) => {
    const yy = PAD.t + 8 + i * rowH;
    const bw = Math.max(6, w * maxW);
    out += `<rect x="${x(ox)}" y="${yy}" width="${bw}" height="${rowH - gap}" rx="${Math.min(3, (rowH - gap) / 2)}" fill="url(#${barId})" stroke="${C.accent}" stroke-opacity="0.16"/>`;
  });
  if (o.pocIndex != null) {
    const yy = PAD.t + 8 + o.pocIndex * rowH + (rowH - gap) / 2;
    out += `<line x1="${x(ox) - 6}" y1="${yy}" x2="${x(ox) + maxW + 6}" y2="${yy}" stroke="${C.short}" stroke-width="1.75"/>`;
    out += `<g transform="translate(${x(ox) + maxW + 12}, ${yy})"><rect x="0" y="-8.5" width="38" height="17" rx="4" fill="${C.short}" fill-opacity="0.16" stroke="${C.short}" stroke-opacity="0.45"/><text x="19" y="3.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.short}">POC</text></g>`;
  }
  return out;
}

const bell = (peak: number, n = 13, skew = 0): number[] =>
  Array.from({ length: n }, (_, i) => {
    const t = (i - (n - 1) / 2) / ((n - 1) / 2) + skew;
    return Math.max(0.12, peak * Math.exp(-(t * t) * 2.1));
  });

// =============================================================================
// SCENES
// =============================================================================

// --- Career Program structural ----------------------------------------------

export const svgSupportResistance = frame(
  "Support / Resistance — timeframe hierarchy",
  (ns) => `
  ${level(0.86, C.short, "HTF resistance")}
  ${level(0.5, C.accent, "intraday pivot")}
  ${level(0.14, C.long, "HTF support")}
  ${priceArea(
    [
      [0, 0.2],
      [0.14, 0.45],
      [0.26, 0.32],
      [0.4, 0.66],
      [0.52, 0.5],
      [0.64, 0.82],
      [0.72, 0.7],
      [0.84, 0.5],
      [1, 0.6],
    ],
    C.price,
    ns("aAcc"),
  )}
  ${dot(0.64, 0.82, C.short)}
  ${tag(0.64, 0.95, "first touch", C.short, "middle")}
  ${dot(0.14, 0.45, C.long)}
  `,
  { caption: "weight by timeframe · act on the flow, not the line" },
);

export const svgPattern = frame(
  "Compression → expansion",
  (ns) => `
  ${line(
    [
      [0, 0.15],
      [0.22, 0.78],
    ],
    C.long,
    2,
  )}
  ${line(
    [
      [0.22, 0.78],
      [0.62, 0.86],
    ],
    C.faint,
    1.25,
    "4 4",
  )}
  ${line(
    [
      [0.24, 0.5],
      [0.62, 0.62],
    ],
    C.faint,
    1.25,
    "4 4",
  )}
  ${priceArea(
    [
      [0.22, 0.78],
      [0.3, 0.62],
      [0.38, 0.74],
      [0.46, 0.66],
      [0.54, 0.72],
      [0.62, 0.7],
      [0.74, 0.92],
      [0.88, 1.02],
      [1, 0.98],
    ],
    C.price,
    ns("aLong"),
  )}
  ${tag(0.42, 0.4, "time + volume compressed", C.label, "middle")}
  ${tag(0.86, 0.78, "release", C.long, "middle")}
  `,
  { caption: "tighter coil + crisp invalidation → more explosive move" },
);

export const svgExhaustion = frame(
  "Volume exhaustion",
  (ns) => `
  ${[
    [0.06, 0.16],
    [0.18, 0.22],
    [0.3, 0.3],
    [0.42, 0.38],
    [0.54, 0.78],
    [0.66, 0.26],
    [0.78, 0.18],
    [0.9, 0.14],
  ]
    .map(
      ([fx, h]) =>
        `<rect x="${x(fx) - 11}" y="${y(h)}" width="22" height="${FLOOR - y(h)}" rx="2.5" fill="${fx === 0.54 ? C.short : C.faint}" fill-opacity="${fx === 0.54 ? 0.85 : 0.4}"/>`,
    )
    .join("")}
  ${line(
    [
      [0, 0.32],
      [0.2, 0.46],
      [0.4, 0.62],
      [0.54, 0.9],
      [0.62, 0.86],
      [0.78, 0.66],
      [1, 0.5],
    ],
    C.price,
    2,
  )}
  ${dot(0.54, 0.9, C.short)}
  ${tag(0.54, 1.04, "spike, no follow-through", C.short, "middle")}
  `,
  { legend: [{ c: C.faint, t: "volume" }, { c: C.price, t: "price" }] },
);

export const svgEntryExit = frame(
  "Asymmetric R : R",
  (ns) => `
  ${level(0.9, C.long, "target  +3R")}
  ${level(0.52, C.accent, "entry")}
  ${level(0.34, C.short, "stop  −1R")}
  <rect x="${x(0.08)}" y="${y(0.9)}" width="${x(0.5) - x(0.08)}" height="${y(0.52) - y(0.9)}" fill="${C.long}" fill-opacity="0.07"/>
  <rect x="${x(0.08)}" y="${y(0.52)}" width="${x(0.5) - x(0.08)}" height="${y(0.34) - y(0.52)}" fill="${C.short}" fill-opacity="0.09"/>
  ${priceArea(
    [
      [0.5, 0.52],
      [0.58, 0.46],
      [0.66, 0.58],
      [0.74, 0.7],
      [0.84, 0.84],
      [1, 0.92],
    ],
    C.price,
    ns("aLong"),
  )}
  ${tag(0.28, 0.71, "1 unit risk", C.short, "middle")}
  ${tag(0.28, 0.2, "if not asymmetric, no trade", C.label, "middle")}
  `,
);

export const svgVolumeProfile = frame(
  "HVN / LVN — acceptance vs acceleration",
  (ns) => `
  ${profile(ns, [0.2, 0.34, 0.52, 0.16, 0.12, 0.7, 0.96, 0.66, 0.18, 0.3, 0.22], {
    pocIndex: 6,
    vaFrom: 5,
    vaTo: 8,
  })}
  ${tag(0.5, 0.62, "HVN — acceptance", C.long, "start")}
  ${leader(0.5, 0.6, 0.42, 0.5, C.long)}
  ${tag(0.5, 0.96, "LVN — edge / acceleration", C.short, "start")}
  ${leader(0.5, 0.93, 0.32, 0.82, C.short)}
  `,
);

export const svgRiskMgmt = frame(
  "R-based equity & loss limit",
  (ns) => `
  ${level(0.16, C.short, "daily loss limit")}
  ${priceArea(
    [
      [0, 0.4],
      [0.12, 0.34],
      [0.22, 0.5],
      [0.32, 0.42],
      [0.44, 0.62],
      [0.54, 0.54],
      [0.66, 0.74],
      [0.76, 0.68],
      [0.88, 0.88],
      [1, 0.96],
    ],
    C.long,
    ns("aLong"),
  )}
  ${tag(0.5, 0.28, "survive first · compound second", C.label, "middle")}
  `,
);

export const svgFractal = frame(
  "Fractality — LTF execution of an HTF trade",
  (ns) => `
  ${priceArea(
    [
      [0, 0.18],
      [0.16, 0.42],
      [0.3, 0.3],
      [0.46, 0.62],
      [0.62, 0.5],
      [0.78, 0.82],
      [1, 1.0],
    ],
    C.accent,
    ns("aAcc"),
    2,
  )}
  <rect x="${x(0.42)}" y="${y(0.74)}" width="${x(0.78) - x(0.42)}" height="${y(0.42) - y(0.74)}" rx="5" fill="none" stroke="${C.short}" stroke-dasharray="4 3" stroke-opacity="0.7"/>
  ${line(
    [
      [0.45, 0.5],
      [0.52, 0.46],
      [0.58, 0.56],
      [0.64, 0.52],
      [0.72, 0.66],
    ],
    C.short,
    1.5,
  )}
  ${tag(0.6, 0.34, "LTF zoom", C.short, "middle")}
  `,
  { caption: "best asymmetry: small-timeframe entry, larger-timeframe trade" },
);

// --- Dalton: structure ------------------------------------------------------

export const svgValueArea = frame(
  "Value Area · VAH · VAL · POC",
  (ns) => `
  ${profile(ns, bell(0.95, 13), { pocIndex: 6, vaFrom: 3, vaTo: 9 })}
  ${level(0.74, C.accent, "VAH", 0.62, 0.78)}
  ${level(0.26, C.accent, "VAL", 0.62, 0.78)}
  ${tag(0.5, 0.5, "70% of volume", C.accent, "start")}
  `,
  { caption: "inside value → rotate · outside → accept or reject" },
);

export const svgInitialBalance = frame(
  "Initial Balance — first hour",
  (ns) => `
  <rect x="${x(0.06)}" y="${y(0.74)}" width="${x(0.42) - x(0.06)}" height="${y(0.3) - y(0.74)}" rx="5" fill="${C.accent}" fill-opacity="0.08" stroke="${C.accent}" stroke-opacity="0.35"/>
  ${level(0.74, C.short, "IB high", 0.06, 0.42)}
  ${level(0.3, C.short, "IB low", 0.06, 0.42)}
  ${priceArea(
    [
      [0.06, 0.52],
      [0.14, 0.7],
      [0.22, 0.36],
      [0.3, 0.66],
      [0.4, 0.46],
      [0.5, 0.72],
      [0.62, 0.84],
      [0.76, 0.9],
      [0.9, 1.02],
      [1, 0.98],
    ],
    C.price,
    ns("aAcc"),
  )}
  ${tag(0.78, 0.78, "IB extension", C.long, "middle")}
  `,
  { caption: "wide IB → OTF present · narrow IB → day-timeframe" },
);

export const svgExcessPoor = frame(
  "Excess vs poor highs",
  (ns) => {
    const colW = (0.4 * PLOT_W) / 5;
    const excess = bell(0.7, 7).map((v, i) => (i < 2 ? 0.16 : v));
    const poor = [0.8, 0.82, 0.78, 0.8, 0.66, 0.4, 0.22];
    const colsExcess = excess
      .map((w, i) => `<rect x="${x(0.06)}" y="${PAD.t + 12 + i * 26}" width="${w * colW * 5}" height="22" rx="3" fill="url(#${ns("barT")})"/>`)
      .join("");
    const colsPoor = poor
      .map((w, i) => `<rect x="${x(0.56)}" y="${PAD.t + 12 + i * 26}" width="${Math.max(w, i < 4 ? 0.78 : w) * colW * 5}" height="22" rx="3" fill="url(#${ns("aShort")})" stroke="${C.short}" stroke-opacity="0.3"/>`)
      .join("");
    return `${colsExcess}${colsPoor}
    ${tag(0.18, 0.96, "single prints", C.long, "middle")}
    ${tag(0.74, 0.96, "flat / unfinished", C.short, "middle")}
    ${tag(0.18, 1.06, "excess = rejected", C.label, "middle")}
    ${tag(0.74, 1.06, "poor = invites return", C.label, "middle")}`;
  },
);

export const svgNakedPoc = frame(
  "Naked / virgin POC",
  (ns) => `
  ${profile(ns, bell(0.55, 7), { originFx: 0.06, maxFx: 0.26, barColor: ns("bar") })}
  ${level(0.6, C.short, "untested POC", 0.06, 0.34)}
  ${priceArea(
    [
      [0.34, 0.36],
      [0.46, 0.28],
      [0.58, 0.44],
      [0.7, 0.5],
      [0.82, 0.58],
      [1, 0.6],
    ],
    C.price,
    ns("aShort"),
  )}
  ${dot(1, 0.6, C.short)}
  ${tag(0.6, 0.84, "magnet → expect retest", C.short, "middle")}
  `,
);

export const svgValueMigration = frame(
  "Migrating value",
  (ns) => {
    const block = (fx: number, fyMid: number, label: string, c: string, op: number) =>
      `<rect x="${x(fx)}" y="${y(fyMid + 0.16)}" width="${x(0.2) - x(0)}" height="${y(fyMid - 0.16) - y(fyMid + 0.16)}" rx="5" fill="${c}" fill-opacity="${op}" stroke="${c}" stroke-opacity="0.3"/><text x="${x(fx) + (x(0.2) - x(0)) / 2}" y="${VB_H - 26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">${label}</text>`;
    return `${block(0.06, 0.32, "D-2", C.faint, 0.45)}${block(0.32, 0.5, "D-1", C.accent, 0.35)}${block(0.58, 0.7, "today", C.long, 0.4)}
    ${line(
      [
        [0.16, 0.32],
        [0.42, 0.5],
        [0.68, 0.7],
      ],
      C.accent,
      1.5,
      "4 3",
    )}
    ${tag(0.86, 0.7, "value higher", C.long, "middle")}`;
  },
  { caption: "higher / lower / overlap / unchanged → next-day bias" },
);

export const svgBalance = frame(
  "Balance → breakout",
  (ns) => `
  <rect x="${x(0.05)}" y="${y(0.78)}" width="${x(0.66) - x(0.05)}" height="${y(0.3) - y(0.78)}" rx="6" fill="${C.accent}" fill-opacity="0.05" stroke="${C.accent}" stroke-opacity="0.28" stroke-dasharray="5 4"/>
  ${priceArea(
    [
      [0.05, 0.54],
      [0.13, 0.72],
      [0.21, 0.4],
      [0.3, 0.66],
      [0.39, 0.44],
      [0.48, 0.64],
      [0.57, 0.46],
      [0.66, 0.6],
      [0.78, 0.86],
      [0.9, 1.0],
      [1, 0.96],
    ],
    C.price,
    ns("aLong"),
  )}
  ${tag(0.34, 0.2, "contained rotation", C.label, "middle")}
  ${tag(0.86, 0.74, "break + target", C.long, "middle")}
  `,
);

export const svgComposite = frame(
  "Composite profile — multi-day",
  (ns) => `
  ${profile(ns, bell(0.96, 17), { pocIndex: 8, vaFrom: 4, vaTo: 12 })}
  ${tag(0.5, 0.5, "composite POC = strongest magnet", C.short, "start")}
  `,
);

export const svgOvernightInventory = frame(
  "Overnight inventory",
  (ns) => `
  ${level(0.5, C.faint, "prior close")}
  ${line(
    [
      [0, 0.5],
      [0.1, 0.66],
      [0.2, 0.6],
      [0.32, 0.78],
      [0.44, 0.74],
    ],
    C.long,
    2,
  )}
  ${tag(0.36, 0.9, "long inventory", C.long, "middle")}
  ${line(
    [
      [0.56, 0.5],
      [0.66, 0.36],
      [0.78, 0.4],
      [0.9, 0.24],
      [1, 0.2],
    ],
    C.short,
    2,
  )}
  ${tag(0.78, 0.12, "short inventory", C.short, "middle")}
  `,
  { caption: "long + open above → reversion risk lower" },
);

export const svgSpike = frame(
  "Late-session spike — next open decides",
  (ns) => `
  ${priceArea(
    [
      [0, 0.32],
      [0.18, 0.36],
      [0.34, 0.3],
      [0.5, 0.34],
      [0.62, 0.4],
      [0.68, 0.86],
      [0.74, 0.96],
    ],
    C.long,
    ns("aLong"),
  )}
  <line x1="${x(0.66)}" y1="${y(0.46)}" x2="${x(0.66)}" y2="${y(1.0)}" stroke="${C.long}" stroke-dasharray="3 3" opacity="0.5"/>
  ${tag(0.7, 0.66, "spike base", C.long, "middle")}
  ${level(0.7, C.short, "next open: accept or reject", 0.74, 1)}
  ${dot(0.74, 0.96, C.long)}
  `,
);

// --- Dalton: day types (profile silhouettes) --------------------------------

export const svgNormalDay = frame(
  "Normal Day",
  (ns) => profile(ns, bell(0.95, 13), { pocIndex: 6, vaFrom: 3, vaTo: 9 }),
  { caption: "range set in IB · rotate the edges" },
);

export const svgNormalVariation = frame(
  "Normal Variation Day",
  (ns) => profile(ns, bell(0.9, 13, 0.55), { pocIndex: 8, vaFrom: 5, vaTo: 11 }),
  { caption: "one-sided IB extension that holds" },
);

export const svgTrendDay = frame(
  "Trend Day",
  (ns) => `
  ${priceArea(
    [
      [0, 0.12],
      [0.16, 0.26],
      [0.3, 0.4],
      [0.46, 0.5],
      [0.6, 0.66],
      [0.74, 0.78],
      [0.88, 0.92],
      [1, 1.0],
    ],
    C.long,
    ns("aLong"),
    2.5,
  )}
  ${[0.18, 0.34, 0.5, 0.66, 0.82].map((fx, i) => `<rect x="${x(0.9)}" y="${PAD.t + 16 + i * 30}" width="${[0.5, 0.7, 0.85, 0.6, 0.4][i] * 40}" height="24" rx="3" fill="url(#${ns("barT")})"/>`).join("")}
  ${tag(0.3, 0.74, "shallow pullbacks absorbed", C.long, "middle")}
  ${tag(0.86, 0.2, "thin\nprofile", C.label, "middle")}
  `,
  { caption: "OTF in control · do not fade" },
);

export const svgDoubleDist = frame(
  "Double Distribution Trend Day",
  (ns) => {
    const rows = [
      ...bell(0.85, 6),
      0.14,
      0.12,
      0.13,
      ...bell(0.95, 6),
    ];
    return `${profile(ns, rows, { pocIndex: 12 })}
    ${tag(0.5, 0.5, "single prints — LVN", C.short, "start")}
    ${leader(0.5, 0.5, 0.26, 0.52, C.short)}`;
  },
  { caption: "context shift mid-session · trade the new value" },
);

export const svgNeutralCenter = frame(
  "Neutral Day — center close",
  (ns) => `
  ${profile(ns, bell(0.95, 13), { pocIndex: 6, vaFrom: 3, vaTo: 9 })}
  ${dot(0.5, 0.5, C.accent)}
  ${tag(0.56, 0.5, "close ≈ POC → unresolved", C.accent, "start")}
  `,
);

export const svgNeutralExtreme = frame(
  "Neutral Day — extreme close",
  (ns) => `
  ${profile(ns, bell(0.92, 13, -0.15), { pocIndex: 5, vaFrom: 2, vaTo: 8 })}
  ${dot(0.42, 0.08, C.long)}
  ${tag(0.5, 0.08, "close at extreme → next-day signal", C.long, "start")}
  `,
);

// --- Dalton: open types (price-path) ----------------------------------------

const openMarker = (fy: number) => `${dot(0.06, fy, C.accent, 3.5)}${tag(0.06, fy + 0.13, "open", C.accent, "start")}`;

export const svgOpenDrive = frame(
  "Open-Drive",
  (ns) => `
  ${priceArea(
    [
      [0.06, 0.2],
      [0.2, 0.38],
      [0.36, 0.56],
      [0.54, 0.72],
      [0.74, 0.86],
      [1, 0.96],
    ],
    C.long,
    ns("aLong"),
    2.5,
  )}
  ${openMarker(0.2)}
  ${tag(0.72, 0.62, "no test, instant conviction", C.long, "middle")}
  `,
);

export const svgOpenTestDrive = frame(
  "Open-Test-Drive",
  (ns) => `
  ${priceArea(
    [
      [0.06, 0.52],
      [0.16, 0.32],
      [0.24, 0.26],
      [0.32, 0.42],
      [0.46, 0.62],
      [0.64, 0.78],
      [0.82, 0.9],
      [1, 0.98],
    ],
    C.price,
    ns("aLong"),
  )}
  ${openMarker(0.52)}
  ${dot(0.24, 0.26, C.short)}
  ${tag(0.24, 0.16, "test fails", C.short, "middle")}
  ${tag(0.74, 0.7, "drive", C.long, "middle")}
  `,
);

export const svgOpenRejectionReverse = frame(
  "Open-Rejection-Reverse",
  (ns) => `
  ${priceArea(
    [
      [0.06, 0.5],
      [0.18, 0.72],
      [0.28, 0.86],
      [0.36, 0.78],
      [0.5, 0.54],
      [0.66, 0.34],
      [0.82, 0.2],
      [1, 0.12],
    ],
    C.short,
    ns("aShort"),
  )}
  ${openMarker(0.5)}
  ${dot(0.28, 0.86, C.short)}
  ${tag(0.3, 0.97, "probe rejected", C.short, "middle")}
  ${tag(0.78, 0.3, "reverse through open", C.short, "middle")}
  `,
);

export const svgOpenAuction = frame(
  "Open-Auction",
  (ns) => `
  ${level(0.72, C.faint, "prior range", 0, 1)}
  ${level(0.3, C.faint, "", 0, 1)}
  ${line(
    [
      [0.06, 0.5],
      [0.16, 0.62],
      [0.26, 0.42],
      [0.36, 0.58],
      [0.46, 0.46],
      [0.56, 0.6],
      [0.66, 0.44],
      [0.76, 0.56],
      [0.86, 0.48],
      [1, 0.52],
    ],
    C.price,
    2,
  )}
  ${tag(0.5, 0.16, "two-sided · no commitment", C.label, "middle")}
  `,
);

// --- Dalton: framework ------------------------------------------------------

export const svgResponsiveInitiative = frame(
  "Responsive vs initiative",
  (ns) => `
  ${level(0.78, C.faint, "VAH")}
  ${level(0.24, C.faint, "VAL")}
  ${line(
    [
      [0.04, 0.26],
      [0.12, 0.46],
      [0.2, 0.66],
      [0.27, 0.8],
      [0.32, 0.7],
      [0.38, 0.58],
      [0.44, 0.42],
    ],
    C.short,
    2,
  )}
  ${tag(0.22, 0.92, "responsive — contained", C.short, "middle")}
  ${priceArea(
    [
      [0.5, 0.5],
      [0.6, 0.66],
      [0.7, 0.8],
      [0.82, 0.92],
      [1, 1.0],
    ],
    C.long,
    ns("aLong"),
  )}
  ${tag(0.74, 0.34, "initiative — drives discovery", C.long, "middle")}
  `,
);

// --- Axia: order flow -------------------------------------------------------

export const svgAbsorption = frame(
  "Absorption",
  (ns) => `
  ${level(0.66, C.short, "defended level", 0, 1)}
  <rect x="${x(0.42)}" y="${y(0.66) - 1}" width="${x(0.74) - x(0.42)}" height="2" fill="${C.short}"/>
  ${Array.from({ length: 7 }, (_, i) => {
    const fx = 0.4 + i * 0.05;
    return `<path d="M ${x(fx)} ${y(0.36)} L ${x(fx)} ${y(0.62)}" stroke="${C.long}" stroke-width="2" marker-end="url(#${ns("arr")})" opacity="0.5"/>`;
  }).join("")}
  ${line(
    [
      [0, 0.2],
      [0.16, 0.34],
      [0.3, 0.5],
      [0.42, 0.6],
      [0.54, 0.62],
      [0.66, 0.61],
      [0.76, 0.63],
      [0.86, 0.78],
      [1, 0.94],
    ],
    C.price,
    2.25,
  )}
  ${tag(0.56, 0.42, "size eats flow, price holds", C.short, "middle")}
  ${tag(0.88, 0.88, "then resolves", C.long, "middle")}
  `,
  { caption: "trade with the absorption · if it fails, trade the trapped" },
);

export const svgCvdDivergence = frame(
  "CVD divergence",
  (ns) => `
  <line x1="${PAD.l}" y1="${y(0.5)}" x2="${VB_W - PAD.r}" y2="${y(0.5)}" stroke="${C.hair}"/>
  ${line(
    [
      [0, 0.56],
      [0.18, 0.66],
      [0.36, 0.78],
      [0.54, 0.86],
      [0.74, 0.92],
      [1, 0.95],
    ],
    C.price,
    2,
  )}
  ${tag(0.5, 0.98, "price — higher highs", C.price, "middle")}
  ${line(
    [
      [0, 0.42],
      [0.18, 0.34],
      [0.36, 0.4],
      [0.54, 0.3],
      [0.74, 0.22],
      [1, 0.16],
    ],
    C.short,
    2,
  )}
  ${tag(0.5, 0.06, "CVD — lower lows", C.short, "middle")}
  <rect x="${x(0.7)}" y="${y(0.95)}" width="${x(1) - x(0.7)}" height="${y(0.16) - y(0.95)}" fill="${C.short}" fill-opacity="0.06"/>
  `,
  { legend: [{ c: C.price, t: "price" }, { c: C.short, t: "cvd" }] },
);

export const svgFootprint = frame(
  "Footprint imbalance",
  (ns) => {
    const rows = [
      [10, 42],
      [26, 96],
      [70, 128],
      [240, 58],
      [88, 24],
      [22, 14],
    ];
    const mid = (PAD.l + VB_W - PAD.r) / 2;
    const scale = 0.42;
    return `<line x1="${mid}" y1="${PAD.t + 6}" x2="${mid}" y2="${FLOOR - 6}" stroke="${C.axis}"/>
    ${rows
      .map(([buy, sell], i) => {
        const yy = PAD.t + 14 + i * 34;
        const bw = Math.min(buy * scale, 150);
        const sw = Math.min(sell * scale, 150);
        const buyHot = buy > sell * 3;
        const sellHot = sell > buy * 3;
        return `<rect x="${mid - sw}" y="${yy}" width="${sw}" height="22" rx="2.5" fill="${sellHot ? C.short : C.faint}" fill-opacity="${sellHot ? 0.85 : 0.34}"/>
        <rect x="${mid + 1}" y="${yy}" width="${bw}" height="22" rx="2.5" fill="${buyHot ? C.long : C.faint}" fill-opacity="${buyHot ? 0.85 : 0.34}"/>
        <text x="${mid - sw - 7}" y="${yy + 15}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">${sell}</text>
        <text x="${mid + bw + 7}" y="${yy + 15}" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">${buy}</text>
        ${buyHot || sellHot ? `<circle cx="${mid + (buyHot ? bw + 22 : -sw - 26)}" cy="${yy + 11}" r="3" fill="${buyHot ? C.long : C.short}"/>` : ""}`;
      })
      .join("")}
    <text x="${mid - 4}" y="${PAD.t - 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.short}">SELL</text>
    <text x="${mid + 4}" y="${PAD.t - 4}" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.long}">BUY</text>`;
  },
  { caption: "stacked imbalance ≥ 3:1 reveals the aggressor" },
);

export const svgStopRun = frame(
  "Liquidity sweep / stop run",
  (ns) => `
  ${level(0.78, C.short, "obvious high", 0, 1)}
  ${priceArea(
    [
      [0, 0.26],
      [0.16, 0.4],
      [0.32, 0.56],
      [0.46, 0.7],
      [0.56, 0.88],
      [0.6, 0.82],
      [0.72, 0.5],
      [0.86, 0.28],
      [1, 0.18],
    ],
    C.price,
    ns("aShort"),
  )}
  ${dot(0.56, 0.88, C.short)}
  ${tag(0.56, 0.99, "sweep", C.short, "middle")}
  ${tag(0.84, 0.4, "reversal + trapped fuel", C.short, "middle")}
  `,
);

export const svgIceberg = frame(
  "Iceberg / hidden liquidity",
  (ns) => `
  ${level(0.5, C.accent, "level", 0, 1)}
  ${Array.from({ length: 8 }, (_, i) => {
    const fx = 0.16 + i * 0.09;
    return `<rect x="${x(fx) - 7}" y="${y(0.5) - 7}" width="14" height="14" rx="2.5" fill="${C.accent}" fill-opacity="0.55"/>`;
  }).join("")}
  ${line(
    [
      [0, 0.32],
      [0.2, 0.46],
      [0.4, 0.49],
      [0.6, 0.5],
      [0.8, 0.49],
      [1, 0.5],
    ],
    C.price,
    2,
  )}
  ${tag(0.5, 0.78, "displayed ≪ transacted · refills", C.accent, "middle")}
  `,
);

export const svgDom = frame(
  "DOM — stacking / pull / refill",
  (ns) => `
  ${[200, 360, 110, 50, 24].map((sz, i) => {
    const yy = PAD.t + 20 + i * 34;
    const w = sz * 0.42;
    return `<rect x="${x(0.06)}" y="${yy}" width="${w}" height="22" rx="3" fill="url(#${ns("aShort")})" stroke="${C.short}" stroke-opacity="0.32"/>
    <text x="${x(0.06) + w + 8}" y="${yy + 15}" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">${sz}</text>`;
  }).join("")}
  ${tag(0.5, 0.16, "trust refills · discount pulls", C.label, "middle")}
  `,
);

export const svgTape = frame(
  "Tape — speed & size",
  (ns) =>
    `${Array.from({ length: 24 }, (_, i) => {
      const fx = 0.04 + i * 0.04;
      const accel = i > 15;
      const h = accel ? 0.34 + (i % 3) * 0.06 : 0.08 + (i % 4) * 0.03;
      const c = i % 2 === 0 ? C.long : C.short;
      return `<rect x="${x(fx) - 5}" y="${y(0.5 + h / 2)}" width="10" height="${y(0.5 - h / 2) - y(0.5 + h / 2)}" rx="2" fill="${c}" fill-opacity="${accel ? 0.8 : 0.4}"/>`;
    }).join("")}
  ${tag(0.82, 0.92, "acceleration", C.long, "middle")}
  ${tag(0.2, 0.92, "average pace", C.label, "middle")}`,
);

export const svgTrapped = frame(
  "Trapped traders",
  (ns) => `
  <rect x="${x(0.46)}" y="${y(0.86)}" width="${x(0.66) - x(0.46)}" height="${y(0.7) - y(0.86)}" rx="4" fill="${C.short}" fill-opacity="0.12" stroke="${C.short}" stroke-opacity="0.35"/>
  ${priceArea(
    [
      [0, 0.24],
      [0.14, 0.46],
      [0.28, 0.66],
      [0.42, 0.8],
      [0.54, 0.78],
      [0.66, 0.56],
      [0.8, 0.32],
      [1, 0.16],
    ],
    C.price,
    ns("aShort"),
  )}
  ${tag(0.56, 0.92, "late longs", C.short, "middle")}
  ${tag(0.84, 0.42, "forced out → fuel", C.short, "middle")}
  `,
);

export const svgSpoof = frame(
  "Spoofing — size that vanishes",
  (ns) => `
  <rect x="${x(0.06)}" y="${PAD.t + 18}" width="${0.62 * PLOT_W}" height="20" rx="3" fill="${C.short}" fill-opacity="0.30" stroke="${C.short}" stroke-opacity="0.3"/>
  <text x="${x(0.06) + 0.62 * PLOT_W + 8}" y="${PAD.t + 32}" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.label}">800</text>
  <rect x="${x(0.06)}" y="${PAD.t + 50}" width="${0.08 * PLOT_W}" height="20" rx="3" fill="${C.short}" fill-opacity="0.18" stroke="${C.short}" stroke-opacity="0.25" stroke-dasharray="3 3"/>
  <text x="${x(0.06) + 0.08 * PLOT_W + 8}" y="${PAD.t + 64}" font-family="JetBrains Mono, monospace" font-size="9.5" fill="${C.faint}">pulled on approach</text>
  ${line(
    [
      [0, 0.32],
      [0.25, 0.36],
      [0.5, 0.42],
      [0.75, 0.5],
      [1, 0.6],
    ],
    C.price,
    2,
  )}
  ${tag(0.5, 0.16, "price drifts up despite the wall", C.label, "middle")}
  `,
);

export const svgProcess = frame("Process loop", (ns) => {
  const steps = ["PREP", "EXECUTE", "REVIEW", "STORE"];
  const bw = 86;
  const gap = (PLOT_W - bw * 4) / 3;
  let out = "";
  steps.forEach((s, i) => {
    const bx = PAD.l + i * (bw + gap);
    const by = PAD.t + PLOT_H / 2 - 22;
    out += `<rect x="${bx}" y="${by}" width="${bw}" height="44" rx="8" fill="${C.panel}" stroke="${C.accent}" stroke-opacity="0.4"/>
    <text x="${bx + bw / 2}" y="${by + 27}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="${C.ink}">${s}</text>`;
    if (i < 3)
      out += `<path d="M ${bx + bw + 6} ${by + 22} L ${bx + bw + gap - 6} ${by + 22}" stroke="${C.accent}" stroke-width="1.5" marker-end="url(#${ns("arr")})"/>`;
  });
  const lastX = PAD.l + 3 * (bw + gap) + bw;
  const midY = PAD.t + PLOT_H / 2;
  out += `<path d="M ${lastX} ${midY + 22} C ${lastX + 24} ${midY + 70}, ${PAD.l - 24} ${midY + 70}, ${PAD.l} ${midY + 22}" fill="none" stroke="${C.accent}" stroke-opacity="0.5" stroke-dasharray="3 4" marker-end="url(#${ns("arr")})"/>`;
  return out;
});
