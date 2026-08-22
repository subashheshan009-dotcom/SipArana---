import React from 'react';

export interface SiparanaLogoProps {
  /** 'full' includes wreath + cap + SIPARANA text; 'mark' is just emblem; 'horizontal' has emblem + styled text side by side */
  variant?: 'full' | 'mark' | 'horizontal' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export default function SiparanaLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  theme = 'auto',
  showSubtitle = true
}: SiparanaLogoProps) {
  // Dimension mappings
  const markSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  const isDark = theme === 'dark';

  // High-Resolution Official Vector Emblem: Royal Blue Graduation Cap + Radiant Gold Laurel Wreath
  const OfficialEmblem = ({ svgClass = 'w-full h-full' }: { svgClass?: string }) => (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} drop-shadow-sm`}
    >
      <defs>
        {/* Radiant Metallic Gold Gradient */}
        <linearGradient id="spGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Highlight Gold Gradient for Leaf Accents */}
        <linearGradient id="spGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Deep Royal Blue Gradient for Cap */}
        <linearGradient id="spRoyalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Dark Royal Bevel Gradient */}
        <linearGradient id="spNavyDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Gold Tassel Gradient */}
        <linearGradient id="spTasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Soft Radial Ambient Glow */}
        <radialGradient id="spAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>

        {/* Single Laurel Leaf Archetype */}
        <g id="spWreathLeaf">
          <path
            d="M0,0 C-2.5,-6.5 -7,-12.5 -14,-14.5 C-9.5,-7 -7,-2.5 0,0 Z"
            fill="url(#spGoldGrad)"
          />
          <path
            d="M0,0 C2.5,-6.5 7,-12.5 14,-14.5 C9.5,-7 7,-2.5 0,0 Z"
            fill="url(#spGoldLight)"
          />
        </g>
      </defs>

      {/* Subtle Warm Glow Backdrop */}
      <circle cx="100" cy="100" r="92" fill="url(#spAura)" />

      {/* GOLD LAUREL WREATH (Both sides) */}
      <g transform="translate(100, 100)">
        {/* Left Curved Stem */}
        <path
          d="M-8,72 C-45,64 -82,34 -82,-12 C-82,-45 -58,-72 -18,-86"
          fill="none"
          stroke="url(#spGoldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right Curved Stem */}
        <path
          d="M8,72 C45,64 82,34 82,-12 C82,-45 58,-72 18,-86"
          fill="none"
          stroke="url(#spGoldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Crossed Stem Bow at bottom */}
        <path
          d="M-14,68 L9,82 M14,68 L-9,82"
          stroke="#B45309"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="0" cy="74" r="3" fill="url(#spGoldGrad)" />

        {/* Left Laurel Leaves */}
        <g transform="translate(-18, -86) rotate(-35)"><use href="#spWreathLeaf" transform="scale(0.85)" /></g>
        <g transform="translate(-40, -76) rotate(-50)"><use href="#spWreathLeaf" transform="scale(0.9)" /></g>
        <g transform="translate(-58, -60) rotate(-65)"><use href="#spWreathLeaf" transform="scale(0.95)" /></g>
        <g transform="translate(-72, -38) rotate(-80)"><use href="#spWreathLeaf" transform="scale(1)" /></g>
        <g transform="translate(-80, -14) rotate(-95)"><use href="#spWreathLeaf" transform="scale(1.05)" /></g>
        <g transform="translate(-81, 12) rotate(-110)"><use href="#spWreathLeaf" transform="scale(1.05)" /></g>
        <g transform="translate(-74, 36) rotate(-125)"><use href="#spWreathLeaf" transform="scale(1)" /></g>
        <g transform="translate(-60, 56) rotate(-140)"><use href="#spWreathLeaf" transform="scale(0.9)" /></g>
        <g transform="translate(-40, 68) rotate(-155)"><use href="#spWreathLeaf" transform="scale(0.85)" /></g>
        <g transform="translate(-20, 72) rotate(-170)"><use href="#spWreathLeaf" transform="scale(0.75)" /></g>

        {/* Right Laurel Leaves (Mirrored) */}
        <g transform="translate(18, -86) rotate(35) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.85)" /></g>
        <g transform="translate(40, -76) rotate(50) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.9)" /></g>
        <g transform="translate(58, -60) rotate(65) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.95)" /></g>
        <g transform="translate(72, -38) rotate(80) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(1)" /></g>
        <g transform="translate(80, -14) rotate(95) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(1.05)" /></g>
        <g transform="translate(81, 12) rotate(110) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(1.05)" /></g>
        <g transform="translate(74, 36) rotate(125) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(1)" /></g>
        <g transform="translate(60, 56) rotate(140) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.9)" /></g>
        <g transform="translate(40, 68) rotate(155) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.85)" /></g>
        <g transform="translate(20, 72) rotate(170) scale(-1, 1)"><use href="#spWreathLeaf" transform="scale(0.75)" /></g>
      </g>

      {/* ROYAL BLUE GRADUATION MORTARBOARD CAP (CENTERED) */}
      <g transform="translate(100, 94)">
        {/* Diamond Top Plane */}
        <path
          d="M0,-36 L52,-10 L0,16 L-52,-10 Z"
          fill="url(#spRoyalBlueGrad)"
          stroke="#1E3A8A"
          strokeWidth="1.5"
        />

        {/* Mortarboard Underside 3D Bevel Edges */}
        <path
          d="M-52,-10 L0,16 L0,21 L-52,-5 Z"
          fill="url(#spNavyDarkGrad)"
        />
        <path
          d="M0,16 L52,-10 L52,-5 L0,21 Z"
          fill="#1E3A8A"
        />

        {/* Lower Cap Skull / Base */}
        <path
          d="M-30,2 L0,17 L30,2 L30,26 L0,42 L-30,26 Z"
          fill="url(#spNavyDarkGrad)"
          stroke="#1E3A8A"
          strokeWidth="1"
        />

        {/* Crisp Chevron / Ribbon Inlay */}
        <path
          d="M-24,8 L0,20 L24,8 L24,14 L0,27 L-24,14 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Top Button */}
        <ellipse cx="0" cy="-10" rx="3.5" ry="2.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />

        {/* Golden Tassel Ribbon draped to the right */}
        <path
          d="M0,-10 Q32,-4 38,10 L38,30"
          fill="none"
          stroke="url(#spTasselGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Golden Tassel Clasp & Fringe */}
        <rect x="35.5" y="28" width="5" height="2.5" rx="0.6" fill="#F59E0B" />
        <path
          d="M35,30.5 L41,30.5 L42.5,42 L33.5,42 Z"
          fill="url(#spTasselGrad)"
          stroke="#B45309"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );

  // Variant: Mark only (Emblem Icon)
  if (variant === 'mark') {
    return (
      <div className={`relative flex items-center justify-center ${markSizeMap[size]} ${className}`}>
        <OfficialEmblem />
      </div>
    );
  }

  // Variant: Badge / Capsule Container
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-xs ${className}`}
      >
        <div className="w-8 h-8 flex-shrink-0">
          <OfficialEmblem />
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-black text-sm tracking-wider uppercase font-serif text-blue-950">
              SIPARANA
            </span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white">
              LK
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-slate-500 font-semibold tracking-tight mt-0.5">
              Official Portal
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variant: Horizontal (Emblem + Brand typography)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${markSizeMap[size]} flex-shrink-0`}>
          <OfficialEmblem />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase font-serif ${
                size === 'xs' || size === 'sm'
                  ? 'text-lg sm:text-xl'
                  : size === 'md'
                  ? 'text-xl sm:text-2xl'
                  : 'text-2xl sm:text-3xl'
              } ${isDark ? 'text-white' : 'text-blue-950'}`}
            >
              SIPARANA
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
              LK
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[11px] font-bold text-slate-500 -mt-0.5">
              Sri Lanka Education & Degree AI
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variant: Full Stacked Emblem (Hero centered layout with wreath, cap, and SIPARANA serif text underneath)
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className={`${markSizeMap[size]} relative`}>
        <OfficialEmblem />
      </div>
      <div className="mt-1 flex items-center justify-center gap-1.5">
        <span
          className={`font-black tracking-[0.2em] uppercase font-serif text-blue-950 ${
            size === 'hero'
              ? 'text-3xl sm:text-4xl'
              : size === '2xl'
              ? 'text-2xl sm:text-3xl'
              : size === 'xl'
              ? 'text-xl sm:text-2xl'
              : 'text-lg sm:text-xl'
          }`}
        >
          SIPARANA
        </span>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
          LK
        </span>
      </div>
      {showSubtitle && (
        <span className="text-xs text-slate-500 font-semibold mt-1">
          National Curriculum (6–13) & University Degree Ecosystem
        </span>
      )}
    </div>
  );
}
