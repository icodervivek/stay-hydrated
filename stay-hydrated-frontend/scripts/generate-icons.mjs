// Generates PNG app icons from the SVG logo.
// Run: node scripts/generate-icons.mjs
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "assets/images");

function render(svgString, size) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: size },
  });
  return resvg.render().asPng();
}

// ─── Full icon (1024×1024) ────────────────────────────────────────────────────
const FULL_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="55%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#67E8F9"/>
    </linearGradient>
    <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <radialGradient id="shine" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="232" fill="url(#bg)"/>
  <circle cx="780" cy="220" r="240" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="860" r="180" fill="rgba(255,255,255,0.06)"/>
  <g transform="translate(512 540)">
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#drop)"/>
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#shine)"/>
    <path d="M -80 30 q 0 100 80 130" stroke="rgba(14,165,233,0.35)" stroke-width="18" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

// ─── Adaptive foreground: water drop on transparent background ────────────────
// Content is scaled to sit comfortably within the 66% safe zone (673px of 1024)
const FOREGROUND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <radialGradient id="shine" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <g transform="translate(512 530) scale(0.85)">
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#drop)"/>
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#shine)"/>
    <path d="M -80 30 q 0 100 80 130" stroke="rgba(14,165,233,0.35)" stroke-width="18" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

// ─── Adaptive background: gradient without rounded corners ────────────────────
const BACKGROUND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="55%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#67E8F9"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <circle cx="780" cy="220" r="240" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="860" r="180" fill="rgba(255,255,255,0.06)"/>
</svg>`;

// ─── Monochrome: single-colour drop for Android themed icons ─────────────────
const MONOCHROME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g transform="translate(512 530) scale(0.85)">
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="#FFFFFF"/>
    <path d="M -80 30 q 0 100 80 130" stroke="rgba(255,255,255,0.5)" stroke-width="18" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

// ─── Splash icon: water drop on transparent (small, centred) ─────────────────
const SPLASH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
  </defs>
  <g transform="translate(100 108) scale(0.82)">
    <path d="M 0 -90 C 0 -90 -63 -18 -63 30 a 63 63 0 0 0 126 0 C 63 -18 0 -90 0 -90 Z" fill="url(#drop)"/>
    <path d="M -24 9 q 0 30 24 39" stroke="rgba(14,165,233,0.45)" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

const jobs = [
  { svg: FULL_ICON_SVG, file: "icon.png", size: 1024 },
  { svg: FOREGROUND_SVG, file: "android-icon-foreground.png", size: 1024 },
  { svg: BACKGROUND_SVG, file: "android-icon-background.png", size: 1024 },
  { svg: MONOCHROME_SVG, file: "android-icon-monochrome.png", size: 1024 },
  { svg: SPLASH_SVG, file: "splash-icon.png", size: 200 },
];

for (const { svg, file, size } of jobs) {
  const png = render(svg, size);
  const dest = resolve(OUT, file);
  writeFileSync(dest, png);
  console.log(`✓ ${file} (${size}×${size})`);
}

console.log("\nDone. Rebuild your app to see the new icon.");
