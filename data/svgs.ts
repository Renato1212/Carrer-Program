// Hand-built inline SVGs. Compact, schematic, terminal-grade.
// Colors map to Tailwind palette: long #3fb6a8, short #e0a458, accent #7aa2ff, ink #e6e9ef, muted #9aa3b2, faint #4a5160, line #1f2532.

const W = 400;
const H = 200;

const wrap = (inner: string, vb = `0 0 ${W} ${H}`) =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">${inner}</svg>`;

// -- Generic axes -----------------------------------------------------------
const axes = `
  <line x1="40" y1="170" x2="380" y2="170" stroke="#2a3142" stroke-width="1"/>
  <line x1="40" y1="20" x2="40" y2="170" stroke="#2a3142" stroke-width="1"/>
`;

// -- TPO blocks helper ------------------------------------------------------
const tpoRow = (x: number, y: number, count: number, color = "#7aa2ff") =>
  Array.from({ length: count })
    .map((_, i) => `<rect x="${x + i * 10}" y="${y}" width="9" height="9" fill="${color}" fill-opacity="0.7"/>`)
    .join("");

// === DAY TYPES (Dalton) ====================================================

export const svgNormalDay = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">NORMAL DAY</text>
  ${tpoRow(150, 30, 4)}
  ${tpoRow(140, 45, 6)}
  ${tpoRow(120, 60, 10, "#3fb6a8")}
  ${tpoRow(110, 75, 12, "#3fb6a8")}
  ${tpoRow(110, 90, 12, "#3fb6a8")}
  ${tpoRow(120, 105, 10, "#3fb6a8")}
  ${tpoRow(140, 120, 6)}
  ${tpoRow(150, 135, 4)}
  <text x="270" y="80" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">IB</text>
  <line x1="110" y1="60" x2="110" y2="120" stroke="#7aa2ff" stroke-dasharray="2 3"/>
  <line x1="230" y1="60" x2="230" y2="120" stroke="#7aa2ff" stroke-dasharray="2 3"/>
`);

export const svgNormalVariation = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">NORMAL VARIATION</text>
  ${tpoRow(80, 30, 3)}
  ${tpoRow(100, 45, 5)}
  ${tpoRow(110, 60, 8, "#3fb6a8")}
  ${tpoRow(120, 75, 10, "#3fb6a8")}
  ${tpoRow(130, 90, 12, "#3fb6a8")}
  ${tpoRow(140, 105, 10, "#3fb6a8")}
  ${tpoRow(160, 120, 6)}
  ${tpoRow(180, 135, 4)}
  <text x="40" y="40" fill="#e0a458" font-size="10" font-family="JetBrains Mono">IB ext.</text>
`);

export const svgTrendDay = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">TREND DAY</text>
  ${tpoRow(60, 30, 2, "#3fb6a8")}
  ${tpoRow(80, 45, 3, "#3fb6a8")}
  ${tpoRow(110, 60, 3, "#3fb6a8")}
  ${tpoRow(140, 75, 3, "#3fb6a8")}
  ${tpoRow(180, 90, 3, "#3fb6a8")}
  ${tpoRow(220, 105, 3, "#3fb6a8")}
  ${tpoRow(260, 120, 3, "#3fb6a8")}
  ${tpoRow(300, 135, 3, "#3fb6a8")}
  <path d="M70 35 L320 140" stroke="#7aa2ff" stroke-width="1" stroke-dasharray="3 3"/>
`);

export const svgDoubleDist = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">DOUBLE DISTRIBUTION TREND</text>
  ${tpoRow(60, 30, 8)}
  ${tpoRow(80, 45, 6)}
  ${tpoRow(100, 60, 4)}
  ${tpoRow(140, 75, 2, "#e0a458")}
  ${tpoRow(170, 90, 2, "#e0a458")}
  ${tpoRow(200, 105, 6)}
  ${tpoRow(220, 120, 8)}
  ${tpoRow(220, 135, 10)}
  <text x="350" y="80" fill="#e0a458" font-size="9" font-family="JetBrains Mono" text-anchor="end">single prints</text>
`);

export const svgNeutralCenter = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">NEUTRAL DAY — CENTER CLOSE</text>
  ${tpoRow(80, 30, 2)}
  ${tpoRow(100, 45, 4)}
  ${tpoRow(110, 60, 8, "#3fb6a8")}
  ${tpoRow(110, 75, 14, "#3fb6a8")}
  ${tpoRow(110, 90, 14, "#3fb6a8")}
  ${tpoRow(110, 105, 10, "#3fb6a8")}
  ${tpoRow(100, 120, 4)}
  ${tpoRow(80, 135, 2)}
  <circle cx="200" cy="95" r="4" fill="#7aa2ff"/>
  <text x="220" y="98" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">close near POC</text>
`);

export const svgNeutralExtreme = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">NEUTRAL DAY — EXTREME CLOSE</text>
  ${tpoRow(80, 30, 3)}
  ${tpoRow(100, 45, 5)}
  ${tpoRow(110, 60, 10)}
  ${tpoRow(110, 75, 14)}
  ${tpoRow(110, 90, 12)}
  ${tpoRow(110, 105, 8)}
  ${tpoRow(100, 120, 4, "#3fb6a8")}
  ${tpoRow(70, 135, 4, "#3fb6a8")}
  <text x="120" y="148" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">close at extreme</text>
`);

// === OPEN TYPES (Dalton) ===================================================

export const svgOpenDrive = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">OPEN-DRIVE</text>
  <circle cx="60" cy="140" r="4" fill="#3fb6a8"/>
  <path d="M60 140 L350 50" stroke="#3fb6a8" stroke-width="2"/>
  <text x="60" y="160" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">open</text>
  <text x="320" y="40" fill="#3fb6a8" font-size="10" font-family="JetBrains Mono">drive</text>
`);

export const svgOpenTestDrive = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">OPEN-TEST-DRIVE</text>
  <circle cx="80" cy="90" r="4" fill="#7aa2ff"/>
  <path d="M80 90 L130 130 L160 110 L350 30" stroke="#3fb6a8" stroke-width="2" fill="none"/>
  <text x="135" y="148" fill="#e0a458" font-size="10" font-family="JetBrains Mono">test &amp; fail</text>
`);

export const svgOpenRejectionReverse = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">OPEN-REJECTION-REVERSE</text>
  <circle cx="80" cy="90" r="4" fill="#7aa2ff"/>
  <path d="M80 90 L140 40 L160 50 L350 150" stroke="#e0a458" stroke-width="2" fill="none"/>
  <text x="150" y="32" fill="#e0a458" font-size="10" font-family="JetBrains Mono">probe rejected</text>
`);

export const svgOpenAuction = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">OPEN-AUCTION</text>
  <path d="M60 100 L90 85 L110 110 L140 90 L170 105 L210 95 L250 110 L290 90 L330 105 L360 95" stroke="#7aa2ff" stroke-width="1.5" fill="none"/>
  <text x="200" y="160" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">two-sided rotation, no commitment</text>
`);

// === STRUCTURE =============================================================

export const svgValueArea = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">VALUE AREA — 70% / POC / VAH / VAL</text>
  ${tpoRow(140, 30, 4)}
  ${tpoRow(130, 45, 6)}
  ${tpoRow(110, 60, 10, "#3fb6a8")}
  ${tpoRow(95, 75, 14, "#3fb6a8")}
  ${tpoRow(90, 90, 16, "#3fb6a8")}
  ${tpoRow(100, 105, 12, "#3fb6a8")}
  ${tpoRow(120, 120, 8, "#3fb6a8")}
  ${tpoRow(140, 135, 4)}
  <line x1="260" y1="60" x2="260" y2="120" stroke="#7aa2ff" stroke-dasharray="2 3"/>
  <text x="266" y="64" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">VAH</text>
  <text x="266" y="124" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">VAL</text>
  <line x1="260" y1="94" x2="290" y2="94" stroke="#e0a458"/>
  <text x="296" y="97" fill="#e0a458" font-size="9" font-family="JetBrains Mono">POC</text>
`);

export const svgInitialBalance = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">INITIAL BALANCE (FIRST HOUR)</text>
  ${tpoRow(60, 50, 4, "#7aa2ff")}
  ${tpoRow(60, 65, 4, "#7aa2ff")}
  ${tpoRow(60, 80, 4, "#7aa2ff")}
  ${tpoRow(60, 95, 4, "#7aa2ff")}
  ${tpoRow(60, 110, 4, "#7aa2ff")}
  ${tpoRow(60, 125, 4, "#7aa2ff")}
  <line x1="55" y1="48" x2="105" y2="48" stroke="#e0a458" stroke-dasharray="2 2"/>
  <line x1="55" y1="138" x2="105" y2="138" stroke="#e0a458" stroke-dasharray="2 2"/>
  <text x="115" y="52" fill="#e0a458" font-size="9" font-family="JetBrains Mono">IB high</text>
  <text x="115" y="142" fill="#e0a458" font-size="9" font-family="JetBrains Mono">IB low</text>
  ${tpoRow(110, 35, 3, "#3fb6a8")}
  ${tpoRow(140, 30, 3, "#3fb6a8")}
  <text x="180" y="35" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">IB extension</text>
`);

export const svgExcessPoor = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">EXCESS vs POOR HIGHS</text>
  <text x="100" y="35" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">EXCESS</text>
  <rect x="80" y="42" width="8" height="8" fill="#3fb6a8" fill-opacity="0.7"/>
  <rect x="80" y="55" width="8" height="8" fill="#3fb6a8" fill-opacity="0.7"/>
  ${tpoRow(80, 70, 5, "#3fb6a8")}
  ${tpoRow(80, 85, 8, "#3fb6a8")}
  <text x="280" y="35" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">POOR</text>
  ${tpoRow(250, 42, 8, "#e0a458")}
  ${tpoRow(250, 55, 8, "#e0a458")}
  ${tpoRow(250, 70, 8, "#e0a458")}
  ${tpoRow(250, 85, 8, "#e0a458")}
  <text x="100" y="160" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">single prints = exhaustion</text>
  <text x="290" y="160" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">flat top = unfinished</text>
`);

export const svgNakedPoc = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">NAKED / VIRGIN POC</text>
  ${tpoRow(60, 40, 6, "#4a5160")}
  ${tpoRow(60, 55, 8, "#4a5160")}
  ${tpoRow(60, 70, 6, "#4a5160")}
  <line x1="55" y1="64" x2="150" y2="64" stroke="#e0a458" stroke-dasharray="3 2"/>
  <text x="155" y="68" fill="#e0a458" font-size="9" font-family="JetBrains Mono">untouched POC</text>
  <path d="M155 90 L250 110 L330 80" stroke="#7aa2ff" fill="none" stroke-width="1.5"/>
  <circle cx="330" cy="80" r="3" fill="#7aa2ff"/>
  <text x="245" y="135" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">price magnet → expects retest</text>
`);

export const svgValueMigration = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">MIGRATING VALUE</text>
  <rect x="60" y="80" width="50" height="50" fill="#4a5160" fill-opacity="0.5"/>
  <text x="85" y="148" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">D-2</text>
  <rect x="140" y="60" width="50" height="50" fill="#4a5160" fill-opacity="0.6"/>
  <text x="165" y="148" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">D-1</text>
  <rect x="220" y="40" width="50" height="50" fill="#3fb6a8" fill-opacity="0.5"/>
  <text x="245" y="148" text-anchor="middle" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">today</text>
  <path d="M85 105 L165 85 L245 65" stroke="#7aa2ff" stroke-dasharray="2 3"/>
`);

export const svgBalance = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">BALANCE → BREAKOUT</text>
  <rect x="60" y="60" width="200" height="80" fill="none" stroke="#7aa2ff" stroke-dasharray="3 3"/>
  <path d="M60 100 L80 80 L100 110 L120 90 L140 105 L160 85 L180 100 L200 90 L220 100 L240 85 L260 95 L280 60 L320 30" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <text x="160" y="155" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">contained rotation</text>
  <text x="320" y="55" text-anchor="middle" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">break</text>
`);

export const svgOvernightInventory = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">OVERNIGHT INVENTORY</text>
  <line x1="40" y1="100" x2="380" y2="100" stroke="#2a3142" stroke-dasharray="2 2"/>
  <text x="44" y="96" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">prior close</text>
  <path d="M40 100 L80 60 L120 70 L160 50 L200 55" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <text x="220" y="55" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">long inv</text>
  <path d="M240 100 L280 140 L320 130 L360 150" stroke="#e0a458" stroke-width="1.5" fill="none"/>
  <text x="270" y="170" fill="#e0a458" font-size="9" font-family="JetBrains Mono">short inv</text>
`);

export const svgSpike = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">LATE-SESSION SPIKE</text>
  <path d="M60 130 L120 125 L180 128 L220 120 L260 30" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <circle cx="260" cy="30" r="3" fill="#3fb6a8"/>
  <text x="270" y="32" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">spike</text>
  <line x1="280" y1="30" x2="280" y2="80" stroke="#e0a458" stroke-dasharray="2 2"/>
  <text x="288" y="60" fill="#e0a458" font-size="9" font-family="JetBrains Mono">next open decides</text>
`);

export const svgComposite = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">COMPOSITE PROFILE (5-DAY)</text>
  ${tpoRow(60, 30, 2)}
  ${tpoRow(60, 45, 4)}
  ${tpoRow(60, 60, 8, "#3fb6a8")}
  ${tpoRow(60, 75, 14, "#3fb6a8")}
  ${tpoRow(60, 90, 18, "#3fb6a8")}
  ${tpoRow(60, 105, 14, "#3fb6a8")}
  ${tpoRow(60, 120, 8, "#3fb6a8")}
  ${tpoRow(60, 135, 4)}
  <text x="280" y="95" fill="#e0a458" font-size="9" font-family="JetBrains Mono">composite POC</text>
`);

// === ORDER FLOW (Axia) =====================================================

export const svgAbsorption = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">ABSORPTION</text>
  <line x1="60" y1="90" x2="350" y2="90" stroke="#e0a458" stroke-dasharray="3 2"/>
  <text x="60" y="84" fill="#e0a458" font-size="9" font-family="JetBrains Mono">level</text>
  <path d="M70 130 L100 110 L130 95 L160 92 L190 93 L220 91 L250 92 L280 95 L310 80 L340 60" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <rect x="155" y="100" width="80" height="20" fill="#e0a458" fill-opacity="0.15"/>
  <text x="195" y="115" text-anchor="middle" fill="#e0a458" font-size="9" font-family="JetBrains Mono">stalls at level, size eaten</text>
`);

export const svgCvdDivergence = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">CVD DIVERGENCE</text>
  <path d="M60 130 L120 110 L180 90 L240 70 L300 50 L340 45" stroke="#9aa3b2" stroke-width="1.5" fill="none"/>
  <text x="345" y="42" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">price ↑</text>
  <path d="M60 145 L120 120 L180 105 L240 110 L300 125 L340 135" stroke="#e0a458" stroke-width="1.5" fill="none"/>
  <text x="345" y="138" fill="#e0a458" font-size="9" font-family="JetBrains Mono">CVD ↓</text>
`);

export const svgFootprint = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">FOOTPRINT IMBALANCE</text>
  ${[0, 1, 2, 3, 4, 5].map((r) => {
    const y = 40 + r * 18;
    const buy = [12, 30, 80, 220, 60, 18][r];
    const sell = [40, 90, 110, 60, 25, 14][r];
    const buyW = Math.min(buy, 120);
    const sellW = Math.min(sell, 120);
    const buyHot = buy > sell * 3;
    const sellHot = sell > buy * 3;
    return `
      <rect x="${200 - sellW}" y="${y}" width="${sellW}" height="14" fill="${sellHot ? "#e0a458" : "#6a4d29"}" fill-opacity="${sellHot ? 0.8 : 0.4}"/>
      <rect x="202" y="${y}" width="${buyW}" height="14" fill="${buyHot ? "#3fb6a8" : "#1f5953"}" fill-opacity="${buyHot ? 0.8 : 0.4}"/>
      <text x="${200 - sellW - 6}" y="${y + 11}" text-anchor="end" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">${sell}</text>
      <text x="${202 + buyW + 6}" y="${y + 11}" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">${buy}</text>
    `;
  }).join("")}
  <line x1="200" y1="20" x2="200" y2="170" stroke="#2a3142"/>
`);

export const svgStopRun = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">LIQUIDITY SWEEP / STOP RUN</text>
  <line x1="40" y1="70" x2="380" y2="70" stroke="#e0a458" stroke-dasharray="3 2"/>
  <text x="44" y="66" fill="#e0a458" font-size="9" font-family="JetBrains Mono">prior high</text>
  <path d="M60 130 L100 110 L140 95 L180 80 L220 55 L240 60 L300 110 L350 140" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <circle cx="220" cy="55" r="3" fill="#e0a458"/>
  <text x="230" y="52" fill="#e0a458" font-size="9" font-family="JetBrains Mono">sweep</text>
  <text x="310" y="100" fill="#e0a458" font-size="9" font-family="JetBrains Mono">reversal</text>
`);

export const svgIceberg = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">ICEBERG / HIDDEN LIQUIDITY</text>
  <line x1="60" y1="90" x2="350" y2="90" stroke="#e0a458" stroke-dasharray="3 2"/>
  <text x="60" y="84" fill="#e0a458" font-size="9" font-family="JetBrains Mono">level</text>
  ${[100, 130, 160, 190, 220, 250, 280].map(
    (x) => `<rect x="${x}" y="86" width="20" height="8" fill="#7aa2ff" fill-opacity="0.6"/>`,
  ).join("")}
  <text x="195" y="120" text-anchor="middle" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">refills repeatedly, displayed size &lt;&lt; transacted size</text>
`);

export const svgDom = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">DOM — STACKING / PULL / REFILL</text>
  ${[0, 1, 2, 3, 4].map((r) => {
    const y = 40 + r * 22;
    const size = [180, 320, 90, 40, 20][r];
    return `<rect x="60" y="${y}" width="${size}" height="14" fill="#e0a458" fill-opacity="0.5"/>
            <text x="${65 + size}" y="${y + 11}" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">${size}</text>`;
  }).join("")}
  <text x="60" y="170" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">stacked offers above</text>
`);

export const svgTape = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">TAPE — SPEED &amp; SIZE</text>
  ${Array.from({ length: 20 }).map((_, i) => {
    const x = 50 + i * 16;
    const aggressive = i > 12;
    const size = aggressive ? 14 : 4 + (i % 3);
    const color = i % 2 === 0 ? "#3fb6a8" : "#e0a458";
    return `<rect x="${x}" y="${100 - size}" width="10" height="${size * 2}" fill="${color}" fill-opacity="0.6"/>`;
  }).join("")}
  <text x="320" y="40" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">acceleration</text>
`);

export const svgTrapped = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">TRAPPED TRADERS</text>
  <path d="M60 130 L100 100 L140 80 L180 70 L220 65 L260 90 L300 120 L340 145" stroke="#7aa2ff" stroke-width="1.5" fill="none"/>
  <rect x="200" y="55" width="60" height="20" fill="#e0a458" fill-opacity="0.2"/>
  <text x="230" y="50" text-anchor="middle" fill="#e0a458" font-size="9" font-family="JetBrains Mono">late longs</text>
  <text x="320" y="160" text-anchor="end" fill="#e0a458" font-size="9" font-family="JetBrains Mono">forced out → fuel</text>
`);

export const svgSpoof = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">SPOOFING — SIZE THAT VANISHES</text>
  <rect x="60" y="60" width="280" height="16" fill="#e0a458" fill-opacity="0.4"/>
  <text x="350" y="71" text-anchor="end" fill="#e0a458" font-size="9" font-family="JetBrains Mono">800</text>
  <rect x="60" y="90" width="40" height="16" fill="#e0a458" fill-opacity="0.4"/>
  <text x="110" y="101" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">800 → pulled</text>
  <path d="M60 130 L150 120 L240 130 L340 115" stroke="#7aa2ff" stroke-width="1.5" fill="none"/>
  <text x="200" y="160" text-anchor="middle" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">price drifts up despite stacked offers</text>
`);

// === CHARTS (Career Program structural) ====================================

export const svgSupportResistance = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">SUPPORT / RESISTANCE — TIMEFRAME HIERARCHY</text>
  <line x1="40" y1="50" x2="380" y2="50" stroke="#e0a458" stroke-width="1.5"/>
  <text x="46" y="46" fill="#e0a458" font-size="9" font-family="JetBrains Mono">HTF resistance</text>
  <line x1="40" y1="140" x2="380" y2="140" stroke="#3fb6a8" stroke-width="1.5"/>
  <text x="46" y="155" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">HTF support</text>
  <line x1="40" y1="95" x2="380" y2="95" stroke="#7aa2ff" stroke-dasharray="3 2"/>
  <text x="46" y="91" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">intraday pivot</text>
  <path d="M60 130 L100 90 L140 110 L180 60 L220 80 L260 55 L300 90 L340 75" stroke="#e6e9ef" fill="none" stroke-width="1.2"/>
`);

export const svgPattern = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">FLAG / COMPRESSION</text>
  <path d="M60 140 L120 60" stroke="#3fb6a8" stroke-width="1.5"/>
  <path d="M120 60 L160 75 L180 70 L200 85 L220 80 L240 95 L260 90" stroke="#e6e9ef" stroke-width="1.2" fill="none"/>
  <line x1="160" y1="68" x2="280" y2="85" stroke="#7aa2ff" stroke-dasharray="3 2"/>
  <line x1="155" y1="80" x2="280" y2="100" stroke="#7aa2ff" stroke-dasharray="3 2"/>
  <path d="M260 90 L320 40" stroke="#3fb6a8" stroke-width="1.5"/>
  <text x="305" y="40" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">break</text>
`);

export const svgGap = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">GAP — TRAP &amp; OPEN URGENCY</text>
  <path d="M60 130 L100 120 L140 125 L180 115 L200 120" stroke="#9aa3b2" stroke-width="1.5" fill="none"/>
  <rect x="200" y="60" width="60" height="55" fill="#e0a458" fill-opacity="0.1" stroke="#e0a458" stroke-dasharray="2 2"/>
  <text x="230" y="92" text-anchor="middle" fill="#e0a458" font-size="9" font-family="JetBrains Mono">GAP</text>
  <path d="M260 60 L300 45 L340 30" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
`);

export const svgVolumeProfile = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">HVN &amp; LVN</text>
  ${[
    [30, 30],
    [45, 60],
    [60, 90],
    [75, 140],
    [90, 180],
    [105, 140],
    [120, 60],
    [135, 30],
  ]
    .map(([y, w]) => `<rect x="60" y="${y}" width="${w}" height="11" fill="#7aa2ff" fill-opacity="0.45"/>`)
    .join("")}
  <text x="260" y="100" fill="#e0a458" font-size="9" font-family="JetBrains Mono">HVN — acceptance</text>
  <text x="200" y="42" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">LVN — edge</text>
`);

export const svgExhaustion = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">VOLUME EXHAUSTION</text>
  <path d="M60 140 L100 120 L140 100 L180 80 L220 50 L240 55 L280 80 L320 100" stroke="#7aa2ff" stroke-width="1.5" fill="none"/>
  ${[
    [70, 30],
    [110, 40],
    [150, 50],
    [190, 60],
    [225, 110],
    [265, 35],
    [305, 25],
  ]
    .map(([x, h]) => `<rect x="${x}" y="${170 - h}" width="12" height="${h}" fill="#9aa3b2" fill-opacity="0.5"/>`)
    .join("")}
  <text x="225" y="38" fill="#e0a458" font-size="9" font-family="JetBrains Mono">spike</text>
`);

export const svgEntryExit = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">ASYMMETRIC R:R</text>
  <line x1="40" y1="60" x2="380" y2="60" stroke="#3fb6a8" stroke-dasharray="2 2"/>
  <text x="44" y="56" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">target (+3R)</text>
  <line x1="40" y1="110" x2="380" y2="110" stroke="#7aa2ff" stroke-dasharray="2 2"/>
  <text x="44" y="106" fill="#7aa2ff" font-size="9" font-family="JetBrains Mono">entry</text>
  <line x1="40" y1="130" x2="380" y2="130" stroke="#e0a458" stroke-dasharray="2 2"/>
  <text x="44" y="126" fill="#e0a458" font-size="9" font-family="JetBrains Mono">stop (-1R)</text>
  <path d="M200 130 L220 120 L240 110 L260 80 L280 60" stroke="#e6e9ef" stroke-width="1.5" fill="none"/>
`);

export const svgFractal = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">FRACTALITY — LTF EXECUTION OF HTF TRADE</text>
  <path d="M60 140 L120 100 L180 120 L240 60 L300 90 L340 30" stroke="#7aa2ff" stroke-width="1.5" fill="none"/>
  <rect x="160" y="50" width="100" height="90" fill="none" stroke="#e0a458" stroke-dasharray="3 2"/>
  <path d="M170 130 L190 110 L210 120 L230 95 L255 75" stroke="#3fb6a8" stroke-width="1" fill="none"/>
  <text x="265" y="148" text-anchor="end" fill="#e0a458" font-size="9" font-family="JetBrains Mono">LTF zoom</text>
`);

export const svgResponsiveInitiative = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">RESPONSIVE vs INITIATIVE</text>
  <line x1="40" y1="60" x2="380" y2="60" stroke="#9aa3b2" stroke-dasharray="2 2"/>
  <line x1="40" y1="130" x2="380" y2="130" stroke="#9aa3b2" stroke-dasharray="2 2"/>
  <text x="44" y="56" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">VAH</text>
  <text x="44" y="142" fill="#9aa3b2" font-size="9" font-family="JetBrains Mono">VAL</text>
  <path d="M60 130 L90 110 L120 90 L140 70 L130 55 L150 75" stroke="#e0a458" stroke-width="1.5" fill="none"/>
  <text x="80" y="50" fill="#e0a458" font-size="9" font-family="JetBrains Mono">responsive — contained</text>
  <path d="M200 95 L240 60 L280 45 L320 25 L350 20" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <text x="260" y="120" fill="#3fb6a8" font-size="9" font-family="JetBrains Mono">initiative — breakout</text>
`);

export const svgRiskMgmt = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">R-BASED EQUITY CURVE</text>
  <path d="M60 130 L90 120 L120 100 L150 110 L180 80 L210 90 L240 60 L270 70 L300 45 L340 30" stroke="#3fb6a8" stroke-width="1.5" fill="none"/>
  <line x1="40" y1="150" x2="380" y2="150" stroke="#e0a458" stroke-dasharray="2 2"/>
  <text x="44" y="146" fill="#e0a458" font-size="9" font-family="JetBrains Mono">daily loss limit</text>
`);

export const svgProcess = wrap(`
  ${axes}
  <text x="200" y="14" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="JetBrains Mono">PROCESS LOOP</text>
  ${["PREP", "EXECUTE", "REVIEW", "STORE"].map((label, i) => {
    const x = 60 + i * 80;
    return `<rect x="${x}" y="80" width="60" height="40" fill="#161a23" stroke="#7aa2ff"/>
            <text x="${x + 30}" y="105" text-anchor="middle" fill="#e6e9ef" font-size="10" font-family="JetBrains Mono">${label}</text>`;
  }).join("")}
  ${[0, 1, 2].map((i) => {
    const x = 60 + i * 80 + 60;
    return `<path d="M${x} 100 L${x + 20} 100" stroke="#7aa2ff" stroke-width="1.5" marker-end="url(#arr)"/>`;
  }).join("")}
  <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#7aa2ff"/></marker></defs>
  <path d="M380 100 Q400 60 200 60 Q60 60 60 80" stroke="#7aa2ff" stroke-dasharray="2 3" fill="none"/>
`);
