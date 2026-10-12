import xml.etree.ElementTree as ET
import os

intro_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540" fill="none">
  <defs>
    <!-- Background Shield Gradient -->
    <radialGradient id="introPlateGrad" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#12182c" stop-opacity="0.96" />
      <stop offset="65%" stop-color="#080c18" stop-opacity="0.92" />
      <stop offset="100%" stop-color="#03050a" stop-opacity="0.88" />
    </radialGradient>

    <!-- 24K Polished Metallic Gold Gradients -->
    <linearGradient id="goldLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF2" />
      <stop offset="20%" stop-color="#FCEAB3" />
      <stop offset="45%" stop-color="#E2C172" />
      <stop offset="70%" stop-color="#9C7222" />
      <stop offset="85%" stop-color="#E9CB82" />
      <stop offset="100%" stop-color="#FFF5D6" />
    </linearGradient>

    <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C170" />
      <stop offset="50%" stop-color="#7A5615" />
      <stop offset="100%" stop-color="#DFBA67" />
    </linearGradient>

    <linearGradient id="goldBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF5" />
      <stop offset="35%" stop-color="#ECCF85" />
      <stop offset="75%" stop-color="#B88A34" />
      <stop offset="100%" stop-color="#543A08" />
    </linearGradient>

    <linearGradient id="cueWood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8C5827" />
      <stop offset="40%" stop-color="#E5BA82" />
      <stop offset="60%" stop-color="#F3D7A6" />
      <stop offset="100%" stop-color="#6E3D17" />
    </linearGradient>

    <!-- Ball Specular Radial -->
    <radialGradient id="eightBallShine" cx="32%" cy="28%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="70%" stop-color="#1a1c24" stop-opacity="0" />
      <stop offset="100%" stop-color="#050608" stop-opacity="0" />
    </radialGradient>

    <!-- Filters -->
    <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="crispShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.9" />
    </filter>

    <filter id="ambientGold" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feColorMatrix type="matrix" values="1 0 0 0 0.87  0 1 0 0 0.73  0 0 1 0 0.40  0 0 0 0.5 0" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- ==================== LUXURY SHIELD PLINTH ==================== -->
  <g filter="url(#crispShadow)">
    <rect x="30" y="20" width="900" height="500" rx="36" fill="url(#introPlateGrad)" stroke="#1f283d" stroke-width="2" />
    <!-- Fine Inset Double Gold Filigree Border -->
    <rect x="42" y="32" width="876" height="476" rx="28" fill="none" stroke="url(#goldLuxe)" stroke-width="1.8" opacity="0.85" />
    <rect x="50" y="40" width="860" height="460" rx="22" fill="none" stroke="url(#goldDark)" stroke-width="1" stroke-dasharray="5 7" opacity="0.65" />
  </g>

  <!-- Ornate Corner Flourishes -->
  <g fill="url(#goldLuxe)" opacity="0.75">
    <path d="M48 68 L68 48 L76 48 L76 54 L54 76 L48 76 Z" />
    <circle cx="58" cy="58" r="3.5" />
    <path d="M912 68 L892 48 L884 48 L884 54 L906 76 L912 76 Z" />
    <circle cx="902" cy="58" r="3.5" />
    <path d="M48 472 L68 492 L76 492 L76 486 L54 464 L48 464 Z" />
    <circle cx="58" cy="482" r="3.5" />
    <path d="M912 472 L892 492 L884 492 L884 486 L906 464 L912 464 Z" />
    <circle cx="902" cy="482" r="3.5" />
  </g>

  <!-- ==================== CROSSED TOURNAMENT CUE STICKS ==================== -->
  <g filter="url(#crispShadow)" opacity="0.85">
    <g transform="translate(480, 168) rotate(26)">
      <rect x="-240" y="-3.5" width="10" height="7" rx="1.5" fill="#2d68c4" />
      <rect x="-230" y="-4" width="16" height="8" rx="1" fill="#f0efe8" />
      <polygon points="-214,-4.5 130,-7.5 130,7.5 -214,4.5" fill="url(#cueWood)" />
      <rect x="130" y="-8.5" width="8" height="17" rx="1" fill="url(#goldLuxe)" />
      <polygon points="138,-8.5 240,-11.5 240,11.5 138,8.5" fill="#2e170c" />
      <rect x="240" y="-12" width="8" height="24" rx="2" fill="url(#goldLuxe)" />
    </g>

    <g transform="translate(480, 168) rotate(-26)">
      <rect x="-240" y="-3.5" width="10" height="7" rx="1.5" fill="#2d68c4" />
      <rect x="-230" y="-4" width="16" height="8" rx="1" fill="#f0efe8" />
      <polygon points="-214,-4.5 130,-7.5 130,7.5 -214,4.5" fill="url(#cueWood)" />
      <rect x="130" y="-8.5" width="8" height="17" rx="1" fill="url(#goldLuxe)" />
      <polygon points="138,-8.5 240,-11.5 240,11.5 138,8.5" fill="#2e170c" />
      <rect x="240" y="-12" width="8" height="24" rx="2" fill="url(#goldLuxe)" />
    </g>
  </g>

  <!-- ==================== ROYAL GOLDEN CROWN FINIAL ==================== -->
  <g transform="translate(480, 70)" filter="url(#crispShadow)">
    <path d="M-42 16 L42 16 C38 22 20 25 0 25 C-20 25 -38 22 -42 16 Z" fill="url(#goldLuxe)" stroke="#684e1b" stroke-width="1.2" />
    <rect x="-40" y="14" width="80" height="4" rx="1.5" fill="url(#goldDark)" />
    <circle cx="-28" cy="19" r="2" fill="#e82b4a" />
    <circle cx="-14" cy="20" r="2.2" fill="#00e5ff" />
    <circle cx="0" cy="21" r="2.5" fill="#fff" />
    <circle cx="14" cy="20" r="2.2" fill="#00e5ff" />
    <circle cx="28" cy="19" r="2" fill="#e82b4a" />

    <path d="M0 -16 C6 -8 11 0 0 14 C-11 0 -6 -8 0 -16 Z" fill="url(#goldLuxe)" />
    <circle cx="0" cy="-18" r="3.5" fill="#FFFBE6" filter="url(#royalGlow)" />
    <path d="M-20 -6 C-14 2 -10 8 -16 15 C-26 12 -28 4 -20 -6 Z" fill="url(#goldLuxe)" />
    <circle cx="-21" cy="-7" r="2.8" fill="#FFFBE6" />
    <path d="M20 -6 C14 2 10 8 16 15 C26 12 28 4 20 -6 Z" fill="url(#goldLuxe)" />
    <circle cx="21" cy="-7" r="2.8" fill="#FFFBE6" />
    <path d="M-38 4 C-34 9 -32 13 -36 16 C-44 14 -46 8 -38 4 Z" fill="url(#goldDark)" />
    <circle cx="-39" cy="3" r="2.2" fill="#FFFBE6" />
    <path d="M38 4 C34 9 32 13 36 16 C44 14 46 8 38 4 Z" fill="url(#goldDark)" />
    <circle cx="39" cy="3" r="2.2" fill="#FFFBE6" />
  </g>

  <!-- ==================== LAUREL WREATH &amp; FILIGREE ==================== -->
  <g filter="url(#crispShadow)" stroke="url(#goldLuxe)" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M350 175 C340 120 370 95 410 90" />
    <path d="M340 210 C325 170 330 135 365 115" stroke-width="1.5" />
    <g fill="url(#goldLuxe)" stroke="none">
      <polygon points="358,98 375,90 370,104" />
      <polygon points="346,120 363,115 354,129" />
      <polygon points="338,148 355,147 344,160" />
      <polygon points="336,180 353,184 339,195" />
      <polygon points="346,212 360,222 344,228" />
    </g>

    <path d="M610 175 C620 120 590 95 550 90" />
    <path d="M620 210 C635 170 630 135 595 115" stroke-width="1.5" />
    <g fill="url(#goldLuxe)" stroke="none">
      <polygon points="602,98 585,90 590,104" />
      <polygon points="614,120 597,115 606,129" />
      <polygon points="622,148 605,147 616,160" />
      <polygon points="624,180 607,184 621,195" />
      <polygon points="614,212 600,222 616,228" />
    </g>
  </g>

  <!-- ==================== GRAND INTERTWINED CM MONOGRAM ==================== -->
  <g filter="url(#crispShadow)">
    <path d="M440 120 C380 120 340 155 340 205 C340 255 380 290 440 290 C468 290 490 280 502 268 C506 262 500 255 493 259 C478 270 458 276 438 276 C392 276 360 248 360 205 C360 162 392 134 438 134 C460 134 480 142 494 152 C500 157 508 150 502 144 C488 130 466 120 440 120 Z" 
          fill="url(#goldLuxe)" stroke="#5c410b" stroke-width="2" />

    <path d="M442 145 L456 145 L456 260 L442 260 L442 268 L488 268 L488 260 L475 260 L475 168 L516 268 L532 268 L572 168 L572 260 L558 260 L558 268 L604 268 L604 260 L590 260 L590 145 L576 145 L524 246 L472 145 Z" 
          fill="url(#goldBevel)" stroke="url(#goldDark)" stroke-width="2.5" />
    
    <path d="M475 168 L516 268 L510 268 L475 182 Z" fill="#69480d" opacity="0.6" />
    <path d="M572 168 L572 260 L568 260 L568 178 Z" fill="#69480d" opacity="0.6" />
  </g>

  <!-- ==================== CENTERPIECE BILLIARDS 8-BALL ==================== -->
  <g transform="translate(480, 245)" filter="url(#crispShadow)">
    <circle cx="0" cy="0" r="32" fill="url(#goldDark)" stroke="url(#goldLuxe)" stroke-width="2.5" />
    <circle cx="0" cy="0" r="28" fill="#0c0e14" stroke="#252936" stroke-width="1.8" />
    
    <circle cx="0" cy="0" r="26" fill="#080a0f" />
    <circle cx="0" cy="0" r="26" fill="url(#eightBallShine)" />

    <circle cx="0" cy="0" r="13" fill="#f8f9fc" stroke="#c8cad4" stroke-width="0.9" />

    <text x="0" y="5.5" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="16" fill="#080a0f" letter-spacing="-0.5">8</text>
  </g>

  <!-- ==================== 'CASA MILANO' LUXURY WORDMARK ==================== -->
  <g filter="url(#crispShadow)">
    <text x="480" y="365" text-anchor="middle" font-family="'Outfit', 'Cinzel', Georgia, serif" font-weight="900" font-size="64" letter-spacing="14" fill="#dfba67" opacity="0.25" filter="url(#ambientGold)">
      CASA MILANO
    </text>

    <text x="480" y="365" text-anchor="middle" font-family="'Outfit', 'Cinzel', Georgia, serif" font-weight="900" font-size="64" letter-spacing="14" fill="url(#goldLuxe)">
      CASA MILANO
    </text>

    <text x="480" y="365" text-anchor="middle" font-family="'Outfit', 'Cinzel', Georgia, serif" font-weight="900" font-size="64" letter-spacing="14" fill="none" stroke="#5c400c" stroke-width="1.5">
      CASA MILANO
    </text>
  </g>

  <!-- ==================== SUBTITLE BANNER &amp; DIVIDER ==================== -->
  <g transform="translate(480, 415)" filter="url(#crispShadow)">
    <line x1="-340" y1="0" x2="-180" y2="0" stroke="url(#goldLuxe)" stroke-width="1.8" />
    <circle cx="-340" cy="0" r="3" fill="url(#goldLuxe)" />
    <polygon points="-180,0 -186,-4 -192,0 -186,4" fill="url(#goldLuxe)" />

    <text x="0" y="5.5" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Outfit', sans-serif" font-weight="700" font-size="19" letter-spacing="8" fill="#F4DE9C">
      LUXURIOUS GAMING CAFÉ
    </text>

    <line x1="180" y1="0" x2="340" y2="0" stroke="url(#goldLuxe)" stroke-width="1.8" />
    <circle cx="340" cy="0" r="3" fill="url(#goldLuxe)" />
    <polygon points="180,0 186,-4 192,0 186,4" fill="url(#goldLuxe)" />
  </g>

  <!-- ==================== TRI-PILLAR ACTIVITY BADGES ==================== -->
  <g transform="translate(480, 465)" filter="url(#crispShadow)" opacity="0.88">
    <g transform="translate(-160, 0)">
      <path d="M-24 -12 C-20 -18 -10 -20 0 -20 C10 -20 20 -18 24 -12 C28 -5 27 8 22 17 C20 21 15 22 12 18 L6 9 C4 7 -4 7 -6 9 L-12 18 C-15 22 -20 21 -22 17 C-27 8 -28 -5 -24 -12 Z" 
            fill="#141824" stroke="url(#goldLuxe)" stroke-width="1.5" />
      <rect x="-8" y="-16" width="16" height="2" rx="1" fill="#00e5ff" />
      <circle cx="-7" cy="4" r="4.2" fill="url(#goldDark)" />
      <circle cx="7" cy="4" r="4.2" fill="url(#goldDark)" />
      <circle cx="-14" cy="-5" r="1.5" fill="#dfba67" />
      <circle cx="14" cy="-5" r="1.5" fill="#dfba67" />
      <text x="0" y="26" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" letter-spacing="2" fill="#c4a456">PS5 ARENA</text>
    </g>

    <polygon points="-80,0 -83,-3 -86,0 -83,3" fill="url(#goldLuxe)" />

    <g transform="translate(0, 0)">
      <polygon points="0,-22 24,18 -24,18" fill="none" stroke="url(#goldLuxe)" stroke-width="2.2" stroke-linejoin="round" />
      <polygon points="0,-22 24,18 -24,18" fill="#101420" stroke="url(#goldDark)" stroke-width="1" />
      <circle cx="0" cy="-12" r="3.5" fill="#e6b800" stroke="#fff" stroke-width="0.3" />
      <circle cx="-4" cy="-5" r="3.5" fill="#d92534" />
      <circle cx="4" cy="-5" r="3.5" fill="#d92534" />
      <circle cx="-8" cy="2" r="3.5" fill="#d92534" />
      <circle cx="0" cy="2" r="3.5" fill="#0a0a0c" stroke="#f0efe8" stroke-width="0.5" />
      <circle cx="8" cy="2" r="3.5" fill="#d92534" />
      <circle cx="-12" cy="9" r="3.5" fill="#d92534" />
      <circle cx="-4" cy="9" r="3.5" fill="#d92534" />
      <circle cx="4" cy="9" r="3.5" fill="#d92534" />
      <circle cx="12" cy="9" r="3.5" fill="#d92534" />
      <text x="0" y="26" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" letter-spacing="2" fill="#F4DE9C">CHAMPIONSHIP SNOOKER</text>
    </g>

    <polygon points="80,0 83,-3 86,0 83,3" fill="url(#goldLuxe)" />

    <g transform="translate(160, 0)">
      <circle cx="0" cy="0" r="19" fill="none" stroke="url(#goldLuxe)" stroke-width="2.8" />
      <path d="M-15 11 L15 11" stroke="#0e1320" stroke-width="3" />
      <circle cx="0" cy="0" r="7" fill="#161b2a" stroke="url(#goldLuxe)" stroke-width="1.5" />
      <rect x="-1" y="-19" width="2" height="4" fill="#ffd700" />
      <line x1="-18" y1="0" x2="-7" y2="0" stroke="url(#goldLuxe)" stroke-width="2" />
      <line x1="7" y1="0" x2="18" y2="0" stroke="url(#goldLuxe)" stroke-width="2" />
      <line x1="0" y1="7" x2="0" y2="15" stroke="url(#goldLuxe)" stroke-width="2" />
      <text x="0" y="26" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" letter-spacing="2" fill="#c4a456">RACING COCKPITS</text>
    </g>
  </g>
</svg>'''

# Circular 800x800 Crest Medallion for Navbar, Favicon, and general brand crest
crest_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" fill="none">
  <defs>
    <radialGradient id="crestBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#14192b" />
      <stop offset="60%" stop-color="#090d18" />
      <stop offset="92%" stop-color="#04060d" />
      <stop offset="100%" stop-color="#010205" />
    </radialGradient>

    <linearGradient id="cGoldLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF2" />
      <stop offset="25%" stop-color="#FCEAB3" />
      <stop offset="50%" stop-color="#E2C172" />
      <stop offset="75%" stop-color="#9C7222" />
      <stop offset="100%" stop-color="#F7D88B" />
    </linearGradient>

    <linearGradient id="cGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C170" />
      <stop offset="50%" stop-color="#7A5615" />
      <stop offset="100%" stop-color="#DFBA67" />
    </linearGradient>

    <radialGradient id="cBallShine" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#020306" stop-opacity="0" />
    </radialGradient>

    <filter id="cDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- Marble Crest Medallion Base -->
  <circle cx="400" cy="400" r="380" fill="url(#crestBgGrad)" stroke="#1a2034" stroke-width="2.5" />
  <circle cx="400" cy="400" r="366" fill="none" stroke="url(#cGoldLuxe)" stroke-width="4.5" />
  <circle cx="400" cy="400" r="352" fill="none" stroke="url(#cGoldDark)" stroke-width="2" stroke-dasharray="4 6" />
  <circle cx="400" cy="400" r="340" fill="none" stroke="url(#cGoldLuxe)" stroke-width="2.5" />

  <!-- Cardinal Jewels -->
  <circle cx="400" cy="34" r="5" fill="url(#cGoldLuxe)" />
  <circle cx="400" cy="766" r="5" fill="url(#cGoldLuxe)" />
  <circle cx="34" cy="400" r="5" fill="url(#cGoldLuxe)" />
  <circle cx="766" cy="400" r="5" fill="url(#cGoldLuxe)" />

  <!-- Crossed Tournament Cues -->
  <g transform="translate(400, 260) rotate(28)" opacity="0.75">
    <rect x="-190" y="-3" width="8" height="6" rx="1" fill="#2d68c4" />
    <rect x="-182" y="-3.5" width="12" height="7" rx="1" fill="#f0efe8" />
    <polygon points="-170,-3.5 100,-6 100,6 -170,3.5" fill="#c4975d" />
    <polygon points="100,-6.5 180,-9 180,9 100,6.5" fill="#30190d" />
  </g>
  <g transform="translate(400, 260) rotate(-28)" opacity="0.75">
    <rect x="-190" y="-3" width="8" height="6" rx="1" fill="#2d68c4" />
    <rect x="-182" y="-3.5" width="12" height="7" rx="1" fill="#f0efe8" />
    <polygon points="-170,-3.5 100,-6 100,6 -170,3.5" fill="#c4975d" />
    <polygon points="100,-6.5 180,-9 180,9 100,6.5" fill="#30190d" />
  </g>

  <!-- Crown Finial -->
  <g transform="translate(400, 105)" filter="url(#cDropShadow)">
    <path d="M-36 14 L36 14 C32 20 18 22 0 22 C-18 22 -32 20 -36 14 Z" fill="url(#cGoldLuxe)" />
    <circle cx="-24" cy="17" r="1.8" fill="#e82b4a" />
    <circle cx="0" cy="18" r="2.2" fill="#fff" />
    <circle cx="24" cy="17" r="1.8" fill="#e82b4a" />
    <path d="M0 -14 C5 -7 9 0 0 12 C-9 0 -5 -7 0 -14 Z" fill="url(#cGoldLuxe)" />
    <circle cx="0" cy="-16" r="3" fill="#FFFBE6" />
    <path d="M-18 -5 C-12 2 -9 7 -14 13 C-23 10 -25 3 -18 -5 Z" fill="url(#cGoldLuxe)" />
    <circle cx="-19" cy="-6" r="2.5" fill="#FFFBE6" />
    <path d="M18 -5 C12 2 9 7 14 13 C23 10 25 3 18 -5 Z" fill="url(#cGoldLuxe)" />
    <circle cx="19" cy="-6" r="2.5" fill="#FFFBE6" />
  </g>

  <!-- Interlocking CM Monogram -->
  <g filter="url(#cDropShadow)">
    <path d="M370 170 C315 170 275 210 275 265 C275 320 315 360 370 360 C398 360 422 348 436 334 C440 328 434 321 428 325 C412 336 392 344 370 344 C330 344 296 312 296 265 C296 218 330 186 370 186 C392 186 412 194 426 205 C432 210 440 203 434 197 C420 182 398 170 370 170 Z" 
          fill="url(#cGoldLuxe)" stroke="#52390f" stroke-width="2" />

    <path d="M374 200 L388 200 L388 335 L374 335 L374 343 L422 343 L422 335 L408 335 L408 226 L456 343 L474 343 L522 226 L522 335 L508 335 L508 343 L556 343 L556 335 L542 335 L542 200 L526 200 L465 322 L404 200 Z" 
          fill="url(#cGoldLuxe)" stroke="url(#cGoldDark)" stroke-width="2.5" />
  </g>

  <!-- 8-Ball Centerpiece -->
  <g transform="translate(400, 395)" filter="url(#cDropShadow)">
    <circle cx="0" cy="0" r="30" fill="url(#cGoldDark)" stroke="url(#cGoldLuxe)" stroke-width="2" />
    <circle cx="0" cy="0" r="26" fill="#080a0f" stroke="#1f2230" stroke-width="1.5" />
    <circle cx="0" cy="0" r="25" fill="#080a0f" />
    <circle cx="0" cy="0" r="25" fill="url(#cBallShine)" />
    <circle cx="0" cy="0" r="12" fill="#f8f9fc" />
    <text x="0" y="5" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="15" fill="#080a0f">8</text>
  </g>

  <!-- Horizontal Gold Accents -->
  <line x1="130" y1="395" x2="350" y2="395" stroke="url(#cGoldLuxe)" stroke-width="2" />
  <circle cx="130" cy="395" r="3.5" fill="url(#cGoldLuxe)" />
  <polygon points="350,395 356,390 362,395 356,400" fill="url(#cGoldLuxe)" />

  <line x1="450" y1="395" x2="670" y2="395" stroke="url(#cGoldLuxe)" stroke-width="2" />
  <circle cx="670" cy="395" r="3.5" fill="url(#cGoldLuxe)" />
  <polygon points="450,395 444,390 438,395 444,400" fill="url(#cGoldLuxe)" />

  <!-- Bold Brand Typography: CASA MILANO -->
  <g filter="url(#cDropShadow)">
    <text x="400" y="485" text-anchor="middle" font-family="'Outfit', Georgia, serif" font-weight="900" font-size="52" letter-spacing="10" fill="url(#cGoldLuxe)">
      CASA MILANO
    </text>
    <text x="400" y="485" text-anchor="middle" font-family="'Outfit', Georgia, serif" font-weight="900" font-size="52" letter-spacing="10" fill="none" stroke="#52390f" stroke-width="1.2">
      CASA MILANO
    </text>
  </g>

  <!-- Subtitle: LUXURIOUS GAMING CAFÉ -->
  <g transform="translate(400, 528)" filter="url(#cDropShadow)">
    <line x1="-220" y1="-5" x2="-140" y2="-5" stroke="url(#cGoldLuxe)" stroke-width="1.5" />
    <circle cx="-220" cy="-5" r="2" fill="url(#cGoldLuxe)" />
    <text x="0" y="0" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="17" letter-spacing="6" fill="#F4DE9C">
      LUXURIOUS GAMING CAFÉ
    </text>
    <line x1="140" y1="-5" x2="220" y2="-5" stroke="url(#cGoldLuxe)" stroke-width="1.5" />
    <circle cx="220" cy="-5" r="2" fill="url(#cGoldLuxe)" />
  </g>

  <!-- Bottom Badges Arc Divider -->
  <path d="M220 570 Q400 600 580 570" fill="none" stroke="url(#cGoldDark)" stroke-width="1.5" opacity="0.65" />

  <!-- PS5 Icon (Left) -->
  <g transform="translate(240, 640)" filter="url(#cDropShadow)">
    <path d="M-22 -11 C-18 -16 -9 -18 0 -18 C9 -18 18 -16 22 -11 C26 -5 25 7 20 15 C18 19 14 20 11 16 L5 8 C3 6 -3 6 -5 8 L-11 16 C-14 20 -18 19 -20 15 C-25 7 -26 -5 -22 -11 Z" 
          fill="#141824" stroke="url(#cGoldLuxe)" stroke-width="1.8" />
    <rect x="-7" y="-15" width="14" height="2" rx="1" fill="#00e5ff" />
    <circle cx="-6" cy="4" r="3.8" fill="url(#cGoldDark)" />
    <circle cx="6" cy="4" r="3.8" fill="url(#cGoldDark)" />
  </g>

  <!-- Snooker Triangle (Center) -->
  <g transform="translate(400, 640)" filter="url(#cDropShadow)">
    <polygon points="0,-22 24,16 -24,16" fill="none" stroke="url(#cGoldLuxe)" stroke-width="2.5" stroke-linejoin="round" />
    <polygon points="0,-22 24,16 -24,16" fill="#101420" stroke="url(#cGoldDark)" stroke-width="1" />
    <circle cx="0" cy="-12" r="3.5" fill="#e6b800" />
    <circle cx="-4" cy="-5" r="3.5" fill="#d92534" />
    <circle cx="4" cy="-5" r="3.5" fill="#d92534" />
    <circle cx="-8" cy="2" r="3.5" fill="#d92534" />
    <circle cx="0" cy="2" r="3.5" fill="#0a0a0c" stroke="#fff" stroke-width="0.4" />
    <circle cx="8" cy="2" r="3.5" fill="#d92534" />
    <circle cx="-12" cy="9" r="3.5" fill="#d92534" />
    <circle cx="-4" cy="9" r="3.5" fill="#d92534" />
    <circle cx="4" cy="9" r="3.5" fill="#d92534" />
    <circle cx="12" cy="9" r="3.5" fill="#d92534" />
  </g>

  <!-- Racing Wheel (Right) -->
  <g transform="translate(560, 640)" filter="url(#cDropShadow)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="url(#cGoldLuxe)" stroke-width="2.6" />
    <circle cx="0" cy="0" r="6" fill="#161b2a" stroke="url(#cGoldLuxe)" stroke-width="1.5" />
    <rect x="-1" y="-18" width="2" height="4" fill="#ffd700" />
    <line x1="-16" y1="0" x2="-6" y2="0" stroke="url(#cGoldLuxe)" stroke-width="2" />
    <line x1="6" y1="0" x2="16" y2="0" stroke="url(#cGoldLuxe)" stroke-width="2" />
    <line x1="0" y1="6" x2="0" y2="14" stroke="url(#cGoldLuxe)" stroke-width="2" />
  </g>
</svg>'''

# Validate XML
ET.fromstring(intro_svg)
ET.fromstring(crest_svg)
print("Both SVGs are strictly valid XML!")

with open("public/images/casamilano-intro-logo.svg", "w", encoding="utf-8") as f:
    f.write(intro_svg)
print("Wrote public/images/casamilano-intro-logo.svg")

with open("public/images/casamilano-logo.svg", "w", encoding="utf-8") as f:
    f.write(crest_svg)
print("Wrote public/images/casamilano-logo.svg")

with open("public/logo.svg", "w", encoding="utf-8") as f:
    f.write(crest_svg)
print("Wrote public/logo.svg")
