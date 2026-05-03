export const LOGO_HORIZONTAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 120" width="480" height="120">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <g transform="translate(20 20)">
    <rect width="80" height="80" rx="22" fill="url(#lg)"/>
    <g transform="translate(40 42)">
      <path d="M 0 -22 C 0 -22 -16 -4 -16 8 a 16 16 0 0 0 32 0 C 16 -4 0 -22 0 -22 Z" fill="#FFFFFF"/>
      <path d="M -6 4 q 0 8 6 10" stroke="rgba(14,165,233,0.45)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>
  </g>
  <g transform="translate(120 50)">
    <text x="0" y="0" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="28" font-weight="600" fill="#0F172A" letter-spacing="-0.5">Stay Hydrated</text>
    <text x="2" y="26" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="13" font-weight="500" fill="#0EA5E9" letter-spacing="2">DRINK · TRACK · GLOW</text>
  </g>
</svg>`;

export const WELCOME_HERO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E0F2FE"/>
      <stop offset="100%" stop-color="#ECFEFF"/>
    </linearGradient>
    <linearGradient id="bottle" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(34,211,238,0.35)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <clipPath id="bottleClip">
      <path d="M 220 90 h 40 v 16 c 0 6 12 8 12 22 v 130 c 0 16 -12 24 -28 24 h -8 c -16 0 -28 -8 -28 -24 v -130 c 0 -14 12 -16 12 -22 z"/>
    </clipPath>
  </defs>
  <rect width="480" height="360" rx="24" fill="url(#sky)"/>
  <circle cx="240" cy="190" r="160" fill="url(#glow)"/>
  <g opacity="0.55">
    <circle cx="80" cy="60" r="6" fill="#67E8F9"/>
    <circle cx="120" cy="120" r="4" fill="#0EA5E9"/>
    <circle cx="60" cy="200" r="8" fill="#22D3EE"/>
    <circle cx="400" cy="80" r="5" fill="#22D3EE"/>
    <circle cx="430" cy="180" r="7" fill="#67E8F9"/>
    <circle cx="380" cy="280" r="4" fill="#0EA5E9"/>
    <path d="M 100 280 q 6 -10 12 0 q 6 10 12 0" stroke="#0EA5E9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 360 320 q 6 -10 12 0 q 6 10 12 0" stroke="#0EA5E9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
  </g>
  <g>
    <ellipse cx="240" cy="320" rx="100" ry="10" fill="rgba(14,165,233,0.18)"/>
    <path d="M 220 90 h 40 v 16 c 0 6 12 8 12 22 v 130 c 0 16 -12 24 -28 24 h -8 c -16 0 -28 -8 -28 -24 v -130 c 0 -14 12 -16 12 -22 z" fill="rgba(255,255,255,0.85)" stroke="#0EA5E9" stroke-width="2"/>
    <g clip-path="url(#bottleClip)">
      <rect x="200" y="180" width="84" height="120" fill="url(#water)"/>
      <path d="M 195 184 q 12 -8 24 0 t 24 0 t 24 0 t 24 0 v 12 h -100 z" fill="rgba(255,255,255,0.4)"/>
      <circle cx="220" cy="220" r="3" fill="rgba(255,255,255,0.6)"/>
      <circle cx="248" cy="240" r="2" fill="rgba(255,255,255,0.55)"/>
      <circle cx="236" cy="260" r="2.5" fill="rgba(255,255,255,0.5)"/>
      <circle cx="252" cy="200" r="1.8" fill="rgba(255,255,255,0.6)"/>
    </g>
    <rect x="226" y="80" width="28" height="14" rx="4" fill="#0F172A"/>
    <rect x="216" y="160" width="6" height="2" rx="1" fill="rgba(14,165,233,0.4)"/>
    <rect x="216" y="180" width="6" height="2" rx="1" fill="rgba(14,165,233,0.4)"/>
    <rect x="216" y="200" width="6" height="2" rx="1" fill="rgba(14,165,233,0.4)"/>
    <rect x="216" y="220" width="6" height="2" rx="1" fill="rgba(14,165,233,0.4)"/>
  </g>
  <g transform="translate(120 110)">
    <circle cx="0" cy="0" r="12" fill="url(#bottle)"/>
    <path d="M 0 -8 C 0 -8 -6 -1 -6 4 a 6 6 0 0 0 12 0 C 6 -1 0 -8 0 -8 Z" fill="#FFFFFF"/>
  </g>
  <g transform="translate(360 130)">
    <circle cx="0" cy="0" r="9" fill="#22D3EE"/>
    <path d="M 0 -6 C 0 -6 -4 -1 -4 3 a 4 4 0 0 0 8 0 C 4 -1 0 -6 0 -6 Z" fill="#FFFFFF"/>
  </g>
  <g transform="translate(380 250)">
    <circle cx="0" cy="0" r="14" fill="url(#bottle)"/>
    <path d="M 0 -10 C 0 -10 -7 -1 -7 5 a 7 7 0 0 0 14 0 C 7 -1 0 -10 0 -10 Z" fill="#FFFFFF"/>
  </g>
  <g transform="translate(90 270)" opacity="0.85">
    <path d="M 0 0 q -10 -16 -20 0" stroke="#0EA5E9" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 4 -8 l 8 -4 m -4 4 l 4 -8" stroke="#22D3EE" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

export const GOAL_SETUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360">
  <defs>
    <linearGradient id="gs-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ECFEFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <linearGradient id="gs-water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="gs-pour" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <radialGradient id="gs-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(34,211,238,0.4)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <clipPath id="gs-clip">
      <path d="M 140 130 h 80 v 24 c 0 10 16 14 16 28 v 110 c 0 18 -14 26 -28 26 h -56 c -14 0 -28 -8 -28 -26 v -110 c 0 -14 16 -18 16 -28 z"/>
    </clipPath>
  </defs>
  <rect width="360" height="360" rx="24" fill="url(#gs-bg)"/>
  <circle cx="180" cy="200" r="150" fill="url(#gs-glow)"/>
  <g opacity="0.5">
    <circle cx="60" cy="80" r="4" fill="#0EA5E9"/>
    <circle cx="300" cy="100" r="5" fill="#22D3EE"/>
    <circle cx="40" cy="180" r="6" fill="#67E8F9"/>
    <circle cx="320" cy="240" r="4" fill="#0EA5E9"/>
  </g>
  <g transform="translate(70 30)">
    <path d="M 0 0 c 8 -8 28 -8 36 0 c 8 8 8 28 0 36 c -8 8 -28 8 -36 0 c -8 -8 -8 -28 0 -36 z" fill="#FFFFFF" opacity="0.9"/>
    <path d="M 14 12 q -4 4 0 12 q 6 8 14 4" stroke="#0EA5E9" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <g>
    <path d="M 175 30 q -8 30 5 60 q 13 30 0 50" stroke="url(#gs-pour)" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.85"/>
    <ellipse cx="180" cy="138" rx="12" ry="6" fill="#22D3EE" opacity="0.5"/>
  </g>
  <ellipse cx="180" cy="320" rx="86" ry="10" fill="rgba(14,165,233,0.18)"/>
  <path d="M 140 130 h 80 v 24 c 0 10 16 14 16 28 v 110 c 0 18 -14 26 -28 26 h -56 c -14 0 -28 -8 -28 -26 v -110 c 0 -14 16 -18 16 -28 z" fill="rgba(255,255,255,0.85)" stroke="#0EA5E9" stroke-width="2.5"/>
  <g clip-path="url(#gs-clip)">
    <rect x="120" y="200" width="120" height="120" fill="url(#gs-water)"/>
    <path d="M 110 204 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 v 14 h -120 z" fill="rgba(255,255,255,0.4)"/>
    <circle cx="160" cy="240" r="3" fill="rgba(255,255,255,0.6)"/>
    <circle cx="200" cy="260" r="2.5" fill="rgba(255,255,255,0.55)"/>
    <circle cx="180" cy="280" r="3" fill="rgba(255,255,255,0.5)"/>
    <circle cx="210" cy="225" r="2" fill="rgba(255,255,255,0.6)"/>
  </g>
  <rect x="146" y="120" width="68" height="14" rx="4" fill="#0F172A"/>
  <g transform="translate(132 170)" font-family="Inter, sans-serif" font-size="9" fill="#0EA5E9" opacity="0.7" font-weight="500">
    <line x1="0" y1="0" x2="6" y2="0" stroke="#0EA5E9" stroke-width="1.5"/>
    <text x="-18" y="3">2L</text>
    <line x1="0" y1="40" x2="6" y2="40" stroke="#0EA5E9" stroke-width="1.5"/>
    <text x="-18" y="43">1L</text>
  </g>
  <g transform="translate(80 280)">
    <circle cx="0" cy="0" r="6" fill="#22D3EE" opacity="0.7"/>
    <circle cx="-12" cy="14" r="4" fill="#0EA5E9" opacity="0.6"/>
    <circle cx="14" cy="20" r="5" fill="#67E8F9" opacity="0.7"/>
  </g>
  <g transform="translate(280 280)">
    <circle cx="0" cy="0" r="5" fill="#22D3EE" opacity="0.7"/>
    <circle cx="14" cy="14" r="4" fill="#0EA5E9" opacity="0.6"/>
    <circle cx="-10" cy="20" r="6" fill="#67E8F9" opacity="0.7"/>
  </g>
</svg>`;

export const GOAL_COMPLETE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320" width="360" height="320">
  <defs>
    <linearGradient id="cel-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#DBEAFE"/>
      <stop offset="100%" stop-color="#ECFEFF"/>
    </linearGradient>
    <linearGradient id="cel-medal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="cel-ribbon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E40AF"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <radialGradient id="cel-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(34,211,238,0.45)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
  </defs>
  <rect width="360" height="320" rx="24" fill="url(#cel-bg)"/>
  <circle cx="180" cy="170" r="140" fill="url(#cel-glow)"/>
  <g opacity="0.85">
    <rect x="60" y="60" width="6" height="14" rx="2" fill="#F97316" transform="rotate(20 63 67)"/>
    <rect x="290" y="80" width="6" height="14" rx="2" fill="#22D3EE" transform="rotate(-30 293 87)"/>
    <rect x="40" y="140" width="6" height="14" rx="2" fill="#0EA5E9" transform="rotate(45 43 147)"/>
    <rect x="310" y="160" width="6" height="14" rx="2" fill="#FB923C" transform="rotate(-15 313 167)"/>
    <rect x="50" y="240" width="6" height="14" rx="2" fill="#67E8F9" transform="rotate(60 53 247)"/>
    <rect x="300" y="250" width="6" height="14" rx="2" fill="#0EA5E9" transform="rotate(-45 303 257)"/>
    <circle cx="100" cy="100" r="3" fill="#22D3EE"/>
    <circle cx="270" cy="120" r="3" fill="#F97316"/>
    <circle cx="80" cy="200" r="2.5" fill="#0EA5E9"/>
    <circle cx="280" cy="220" r="3" fill="#67E8F9"/>
    <path d="M 130 50 l 4 4 m 0 -4 l -4 4" stroke="#F97316" stroke-width="2" stroke-linecap="round"/>
    <path d="M 240 50 l 4 4 m 0 -4 l -4 4" stroke="#22D3EE" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g transform="translate(180 165)">
    <path d="M -52 -10 L -34 -54 L 34 -54 L 52 -10 L 28 -10 L 14 -34 L -14 -34 L -28 -10 Z" fill="url(#cel-ribbon)"/>
    <circle cx="0" cy="20" r="68" fill="rgba(255,255,255,0.4)"/>
    <circle cx="0" cy="20" r="58" fill="url(#cel-medal)" stroke="rgba(255,255,255,0.6)" stroke-width="3"/>
    <circle cx="0" cy="20" r="48" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="4 3"/>
    <g transform="translate(0 24)">
      <path d="M 0 -28 C 0 -28 -20 -4 -20 12 a 20 20 0 0 0 40 0 C 20 -4 0 -28 0 -28 Z" fill="#FFFFFF"/>
      <path d="M -8 6 q 0 10 8 12" stroke="rgba(14,165,233,0.5)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(0 -54)">
      <path d="M 0 -10 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z" fill="#F97316" stroke="#FFFFFF" stroke-width="1.5"/>
    </g>
  </g>
  <g transform="translate(180 270)">
    <text x="0" y="0" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#0F172A">Goal smashed!</text>
    <text x="0" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#64748B">keep flowing</text>
  </g>
</svg>`;

export const EMPTY_STATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280" width="360" height="280">
  <defs>
    <linearGradient id="es-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="es-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(186,230,253,0.4)"/>
      <stop offset="100%" stop-color="rgba(56,189,248,0.25)"/>
    </linearGradient>
  </defs>
  <rect width="360" height="280" rx="24" fill="url(#es-bg)"/>
  <ellipse cx="180" cy="240" rx="80" ry="8" fill="rgba(14,165,233,0.15)"/>
  <g transform="translate(180 130)">
    <path d="M -50 -50 L 50 -50 L 40 70 q -2 16 -16 16 h -48 q -14 0 -16 -16 z" fill="url(#es-glass)" stroke="#0EA5E9" stroke-width="2" opacity="0.95"/>
    <ellipse cx="0" cy="-50" rx="50" ry="6" fill="rgba(255,255,255,0.8)" stroke="#0EA5E9" stroke-width="2"/>
    <path d="M -42 -44 q 6 12 0 24 q -6 12 0 24" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="86" rx="44" ry="4" fill="rgba(2,132,199,0.25)"/>
  </g>
  <g transform="translate(85 90)">
    <ellipse cx="0" cy="0" rx="22" ry="14" fill="rgba(255,255,255,0.95)"/>
    <ellipse cx="22" cy="-4" rx="14" ry="10" fill="rgba(255,255,255,0.9)"/>
    <ellipse cx="-18" cy="-2" rx="14" ry="10" fill="rgba(255,255,255,0.85)"/>
  </g>
  <g transform="translate(290 100)">
    <ellipse cx="0" cy="0" rx="20" ry="12" fill="rgba(255,255,255,0.92)"/>
    <ellipse cx="-16" cy="-3" rx="12" ry="8" fill="rgba(255,255,255,0.85)"/>
  </g>
  <g transform="translate(220 60)" opacity="0.85">
    <circle cx="0" cy="0" r="4" fill="#22D3EE"/>
    <path d="M 8 -2 q 2 -8 6 -2" stroke="#0EA5E9" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(180 210)">
    <text x="0" y="0" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#0F172A">No sips logged yet</text>
    <text x="0" y="18" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#64748B">Tap the + to add your first one</text>
  </g>
</svg>`;

export const BADGE_FIRST_SIP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="fs-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="fs-drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#A7F3D0"/>
    </linearGradient>
    <radialGradient id="fs-glow">
      <stop offset="0%" stop-color="rgba(34,211,238,0.4)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="92" fill="url(#fs-glow)"/>
  <g transform="translate(100 100)">
    <polygon points="0,-78 22,-72 40,-82 32,-58 50,-44 28,-38 22,-22 0,-30 -22,-22 -28,-38 -50,-44 -32,-58 -40,-82 -22,-72" fill="url(#fs-bg)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <circle cx="0" cy="0" r="60" fill="url(#fs-bg)" stroke="#FFFFFF" stroke-width="3.5"/>
    <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="3 4"/>
    <g transform="translate(0 4)">
      <path d="M 0 -32 C 0 -32 -20 -8 -20 10 a 20 20 0 0 0 40 0 C 20 -8 0 -32 0 -32 Z" fill="url(#fs-drop)" stroke="#FFFFFF" stroke-width="2"/>
      <text x="0" y="14" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="#0EA5E9">1</text>
    </g>
    <text x="0" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="1.5">FIRST SIP</text>
  </g>
</svg>`;

export const BADGE_STREAK_7_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="b7-medal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="b7-flame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="60%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <radialGradient id="b7-glow">
      <stop offset="0%" stop-color="rgba(34,211,238,0.5)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#b7-glow)"/>
  <g transform="translate(100 100)">
    <polygon points="0,-78 18,-72 36,-78 30,-60 42,-46 24,-42 18,-24 0,-32 -18,-24 -24,-42 -42,-46 -30,-60 -36,-78 -18,-72" fill="url(#b7-medal)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <circle cx="0" cy="0" r="58" fill="url(#b7-medal)" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="0" cy="0" r="48" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="3 4"/>
    <g transform="translate(0 6)">
      <path d="M 0 -28 q -4 12 -16 18 q -8 4 -8 14 a 24 24 0 0 0 48 0 q 0 -10 -8 -14 q -8 -4 -10 -18 q -2 12 -10 14 q 4 -8 -2 -16 q -2 8 0 12 q -2 -2 6 -10 z" fill="url(#b7-flame)" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M -6 4 q -4 8 0 12 a 8 8 0 0 0 16 0 q 0 -8 -6 -10" fill="rgba(255,255,255,0.5)"/>
    </g>
    <text x="0" y="56" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" letter-spacing="1">7 DAYS</text>
  </g>
</svg>`;

export const BADGE_STREAK_30_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="b30-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="b30-flame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="50%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <radialGradient id="b30-glow">
      <stop offset="0%" stop-color="rgba(249,115,22,0.45)"/>
      <stop offset="100%" stop-color="rgba(249,115,22,0)"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#b30-glow)"/>
  <g transform="translate(100 100)">
    <g opacity="0.9">
      <line x1="0" y1="-92" x2="0" y2="-78" stroke="#F59E0B" stroke-width="2"/>
      <line x1="48" y1="-70" x2="40" y2="-58" stroke="#F59E0B" stroke-width="2"/>
      <line x1="70" y1="-30" x2="58" y2="-22" stroke="#F59E0B" stroke-width="2"/>
      <line x1="70" y1="30" x2="58" y2="22" stroke="#F59E0B" stroke-width="2"/>
      <line x1="-48" y1="-70" x2="-40" y2="-58" stroke="#F59E0B" stroke-width="2"/>
      <line x1="-70" y1="-30" x2="-58" y2="-22" stroke="#F59E0B" stroke-width="2"/>
      <line x1="-70" y1="30" x2="-58" y2="22" stroke="#F59E0B" stroke-width="2"/>
    </g>
    <polygon points="0,-82 20,-72 40,-82 32,-60 46,-44 24,-42 18,-22 0,-32 -18,-22 -24,-42 -46,-44 -32,-60 -40,-82 -20,-72" fill="url(#b30-gold)" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="62" fill="url(#b30-gold)" stroke="#FFFFFF" stroke-width="4"/>
    <circle cx="0" cy="0" r="52" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    <g transform="translate(0 6)">
      <path d="M 0 -34 q -4 14 -18 22 q -10 6 -10 18 a 28 28 0 0 0 56 0 q 0 -12 -10 -18 q -10 -6 -12 -22 q -2 14 -12 18 q 6 -10 -2 -20 q -2 10 0 14 q -2 -2 8 -12 z" fill="url(#b30-flame)" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M -8 6 q -4 10 0 14 a 10 10 0 0 0 20 0 q 0 -10 -8 -12" fill="rgba(255,255,255,0.55)"/>
    </g>
    <text x="0" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#7C2D12" letter-spacing="1.5">30 DAYS</text>
  </g>
</svg>`;

export const BADGE_HYDRATION_PRO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bp-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E40AF"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <linearGradient id="bp-drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#67E8F9"/>
    </linearGradient>
    <linearGradient id="bp-star" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <radialGradient id="bp-glow">
      <stop offset="0%" stop-color="rgba(14,165,233,0.4)"/>
      <stop offset="100%" stop-color="rgba(14,165,233,0)"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="92" fill="url(#bp-glow)"/>
  <g transform="translate(100 100)">
    <polygon points="0,-78 22,-72 40,-82 38,-60 56,-46 36,-40 28,-22 8,-30 -8,-30 -28,-22 -36,-40 -56,-46 -38,-60 -40,-82 -22,-72" fill="url(#bp-bg)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <circle cx="0" cy="0" r="60" fill="url(#bp-bg)" stroke="#FFFFFF" stroke-width="3.5"/>
    <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-dasharray="2 3"/>
    <g transform="translate(0 4)">
      <path d="M 0 -34 C 0 -34 -22 -8 -22 12 a 22 22 0 0 0 44 0 C 22 -8 0 -34 0 -34 Z" fill="url(#bp-drop)" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M -10 6 q 0 12 10 14" stroke="rgba(14,165,233,0.5)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(20 -20)">
      <path d="M 0 -8 l 2.5 5 l 5.5 0.8 l -4 4 l 1 5.5 l -5 -2.7 l -5 2.7 l 1 -5.5 l -4 -4 l 5.5 -0.8 z" fill="url(#bp-star)" stroke="#FFFFFF" stroke-width="1"/>
    </g>
    <text x="0" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="1.5">HYDRATION PRO</text>
  </g>
</svg>`;

export const BADGE_WAVE_MAKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="wm-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <linearGradient id="wm-wave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <radialGradient id="wm-glow">
      <stop offset="0%" stop-color="rgba(34,211,238,0.45)"/>
      <stop offset="100%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <clipPath id="wm-clip">
      <circle cx="100" cy="100" r="60"/>
    </clipPath>
  </defs>
  <circle cx="100" cy="100" r="92" fill="url(#wm-glow)"/>
  <g transform="translate(100 100)">
    <polygon points="0,-78 22,-72 40,-82 32,-58 50,-44 28,-38 22,-22 0,-30 -22,-22 -28,-38 -50,-44 -32,-58 -40,-82 -22,-72" fill="url(#wm-bg)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <circle cx="0" cy="0" r="60" fill="url(#wm-bg)" stroke="#FFFFFF" stroke-width="3.5"/>
  </g>
  <g clip-path="url(#wm-clip)">
    <path d="M 30 110 q 17.5 -22 35 0 t 35 0 t 35 0 t 35 0 v 60 h -140 z" fill="url(#wm-wave)"/>
    <path d="M 30 124 q 17.5 -16 35 0 t 35 0 t 35 0 t 35 0 v 60 h -140 z" fill="rgba(255,255,255,0.3)"/>
    <circle cx="80" cy="100" r="3" fill="rgba(255,255,255,0.7)"/>
    <circle cx="120" cy="105" r="2" fill="rgba(255,255,255,0.7)"/>
    <circle cx="100" cy="115" r="2.5" fill="rgba(255,255,255,0.6)"/>
  </g>
  <g transform="translate(100 100)">
    <text x="0" y="64" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="1.5">WAVE MAKER</text>
  </g>
</svg>`;

export const BADGE_ALL_STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="as-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <linearGradient id="as-star" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <radialGradient id="as-glow">
      <stop offset="0%" stop-color="rgba(251,191,36,0.4)"/>
      <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="92" fill="url(#as-glow)"/>
  <g transform="translate(100 100)">
    <polygon points="0,-78 22,-72 40,-82 32,-58 50,-44 28,-38 22,-22 0,-30 -22,-22 -28,-38 -50,-44 -32,-58 -40,-82 -22,-72" fill="url(#as-bg)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <circle cx="0" cy="0" r="60" fill="url(#as-bg)" stroke="#FFFFFF" stroke-width="3.5"/>
    <g opacity="0.7">
      <circle cx="-32" cy="-22" r="2" fill="#FFFFFF"/>
      <circle cx="34" cy="-26" r="1.5" fill="#FFFFFF"/>
      <circle cx="36" cy="20" r="2" fill="#FFFFFF"/>
      <circle cx="-30" cy="24" r="1.5" fill="#FFFFFF"/>
      <circle cx="0" cy="-44" r="1.5" fill="#FFFFFF"/>
      <circle cx="-44" cy="0" r="1.2" fill="#FFFFFF"/>
      <circle cx="44" cy="0" r="1.2" fill="#FFFFFF"/>
    </g>
    <g transform="translate(0 2)">
      <path d="M 0 -32 l 9 19 l 21 3 l -15 14 l 4 21 l -19 -10 l -19 10 l 4 -21 l -15 -14 l 21 -3 z" fill="url(#as-star)" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M -8 -10 l 4 8 l 8 1 l -6 5" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(28 -32)">
      <path d="M 0 -6 C 0 -6 -4 -1 -4 3 a 4 4 0 0 0 8 0 C 4 -1 0 -6 0 -6 Z" fill="#67E8F9" stroke="#FFFFFF" stroke-width="1"/>
    </g>
    <g transform="translate(-30 -28)">
      <path d="M 0 -5 C 0 -5 -3 -1 -3 2 a 3 3 0 0 0 6 0 C 3 -1 0 -5 0 -5 Z" fill="#67E8F9" stroke="#FFFFFF" stroke-width="1"/>
    </g>
    <text x="0" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" letter-spacing="1.5">ALL STAR</text>
  </g>
</svg>`;

export const APP_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="si_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="55%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#67E8F9"/>
    </linearGradient>
    <linearGradient id="si_drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <radialGradient id="si_shine" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="232" fill="url(#si_bg)"/>
  <circle cx="780" cy="220" r="240" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="860" r="180" fill="rgba(255,255,255,0.06)"/>
  <g transform="translate(512 540)">
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#si_drop)"/>
    <path d="M 0 -300 C 0 -300 -210 -60 -210 100 a 210 210 0 0 0 420 0 C 210 -60 0 -300 0 -300 Z" fill="url(#si_shine)"/>
    <path d="M -80 30 q 0 100 80 130" stroke="rgba(14,165,233,0.35)" stroke-width="18" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
