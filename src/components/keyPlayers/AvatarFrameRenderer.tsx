import React from 'react';
import { Crown, Flame, Zap, Sparkles } from 'lucide-react';

interface AvatarFrameRendererProps {
  avatarUrl?: string;
  name?: string;
  frameId?: string;
  rank?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCrown?: boolean;
  showTierTag?: boolean;
  className?: string;
}

export const AvatarFrameRenderer: React.FC<AvatarFrameRendererProps> = ({
  avatarUrl,
  name = 'Scholar',
  frameId = 'frame-default',
  rank,
  size = 'md',
  showCrown = true,
  showTierTag = false,
  className = ''
}) => {
  // Dimension mappings
  const sizeConfig = {
    xs: {
      container: 'w-8 h-8',
      avatar: 'w-7 h-7',
      crownIcon: 'w-3 h-3 -top-2',
      badgeText: 'text-[7px] -bottom-1.5 px-1',
      frameThickness: 'p-0.5'
    },
    sm: {
      container: 'w-11 h-11',
      avatar: 'w-9 h-9',
      crownIcon: 'w-3.5 h-3.5 -top-2.5',
      badgeText: 'text-[8px] -bottom-2 px-1.5',
      frameThickness: 'p-0.5'
    },
    md: {
      container: 'w-14 h-14',
      avatar: 'w-12 h-12',
      crownIcon: 'w-4 h-4 -top-3',
      badgeText: 'text-[9px] -bottom-2 px-2',
      frameThickness: 'p-1'
    },
    lg: {
      container: 'w-20 h-20',
      avatar: 'w-16 h-16',
      crownIcon: 'w-6 h-6 -top-4',
      badgeText: 'text-[10px] -bottom-2.5 px-2.5 py-0.5',
      frameThickness: 'p-1.5'
    },
    xl: {
      container: 'w-28 h-28',
      avatar: 'w-22 h-22',
      crownIcon: 'w-8 h-8 -top-5',
      badgeText: 'text-[11px] -bottom-3 px-3 py-0.5',
      frameThickness: 'p-2'
    },
    '2xl': {
      container: 'w-36 h-36',
      avatar: 'w-28 h-28',
      crownIcon: 'w-10 h-10 -top-6',
      badgeText: 'text-xs -bottom-3.5 px-3.5 py-1',
      frameThickness: 'p-2.5'
    }
  }[size];

  // Specific Free Fire Frame decorations & styles
  const isRank1 = rank === 1;
  const isRank2 = rank === 2;
  const isRank3 = rank === 3;

  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
  const displayAvatar = avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl : fallbackAvatar;

  // Frame styling determination
  let frameBorderClass = 'border-2 border-slate-400 bg-slate-800';
  let frameGlowClass = '';
  let badgeLabel = 'SCHOLAR';
  let badgeClass = 'bg-slate-700 text-slate-200';

  if (isRank1) {
    frameBorderClass = 'border-4 border-yellow-400 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200';
    frameGlowClass = 'ring-4 ring-yellow-400/80 shadow-2xl shadow-yellow-500/80 animate-pulse';
    badgeLabel = 'TOP #1 SOVEREIGN';
    badgeClass = 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg';
  } else if (isRank2) {
    frameBorderClass = 'border-4 border-slate-200 bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-300';
    frameGlowClass = 'ring-4 ring-slate-300/80 shadow-xl shadow-slate-300/70';
    badgeLabel = 'TOP #2 CHAMPION';
    badgeClass = 'bg-gradient-to-r from-slate-700 via-slate-400 to-slate-200 text-slate-950 font-black';
  } else if (isRank3) {
    frameBorderClass = 'border-4 border-amber-600 bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-400';
    frameGlowClass = 'ring-4 ring-amber-500/70 shadow-lg shadow-amber-700/60';
    badgeLabel = 'TOP #3 ELITE';
    badgeClass = 'bg-gradient-to-r from-amber-900 to-amber-600 text-amber-100 font-black';
  } else {
    switch (frameId) {
      case 'frame-grandmaster':
        frameBorderClass = 'border-4 border-orange-500 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400';
        frameGlowClass = 'ring-4 ring-orange-400 shadow-2xl shadow-orange-600/70 animate-pulse';
        badgeLabel = 'GRANDMASTER';
        badgeClass = 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-slate-950 font-black';
        break;
      case 'frame-diamond':
        frameBorderClass = 'border-4 border-purple-400 bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400';
        frameGlowClass = 'ring-4 ring-purple-400/80 shadow-2xl shadow-purple-500/60';
        badgeLabel = 'DIAMOND';
        badgeClass = 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 text-white font-black';
        break;
      case 'frame-platinum':
        frameBorderClass = 'border-4 border-cyan-400 bg-gradient-to-tr from-cyan-600 via-teal-400 to-blue-500';
        frameGlowClass = 'ring-4 ring-cyan-300/80 shadow-xl shadow-cyan-400/60';
        badgeLabel = 'PLATINUM';
        badgeClass = 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-black';
        break;
      case 'frame-gold':
        frameBorderClass = 'border-4 border-yellow-400 bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300';
        frameGlowClass = 'ring-4 ring-yellow-300/70 shadow-lg shadow-yellow-400/50';
        badgeLabel = 'GOLD';
        badgeClass = 'bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950 font-black';
        break;
      case 'frame-silver':
        frameBorderClass = 'border-3 border-slate-300 bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-300';
        frameGlowClass = 'ring-2 ring-slate-300 shadow-md shadow-slate-300/40';
        badgeLabel = 'SILVER';
        badgeClass = 'bg-gradient-to-r from-slate-600 to-slate-300 text-slate-900 font-bold';
        break;
      case 'frame-bronze':
        frameBorderClass = 'border-3 border-amber-700 bg-gradient-to-tr from-amber-800 to-amber-600';
        frameGlowClass = 'ring-2 ring-amber-600/50 shadow-md shadow-amber-800/30';
        badgeLabel = 'BRONZE';
        badgeClass = 'bg-amber-800 text-amber-100 font-bold';
        break;
      default:
        frameBorderClass = 'border-2 border-slate-500 bg-slate-800';
        frameGlowClass = 'shadow-md';
        badgeLabel = 'INITIATE';
        badgeClass = 'bg-slate-800 text-slate-300 font-bold';
    }
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeConfig.container} ${className}`}>
      {/* Top 1 Fire Crown Animation */}
      {showCrown && isRank1 && (
        <div className={`absolute ${sizeConfig.crownIcon} z-20 flex items-center justify-center filter drop-shadow-md animate-bounce`}>
          <div className="relative flex items-center justify-center">
            <Flame className="w-full h-full text-red-500 fill-red-500 absolute -top-1 animate-ping opacity-40" />
            <Crown className="w-full h-full text-yellow-300 fill-yellow-400 filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.9)]" />
          </div>
        </div>
      )}

      {/* Top 2 Silver Lightning Crown */}
      {showCrown && isRank2 && (
        <div className={`absolute ${sizeConfig.crownIcon} z-20 flex items-center justify-center filter drop-shadow-md`}>
          <div className="relative flex items-center justify-center">
            <Zap className="w-full h-full text-cyan-300 fill-cyan-400 absolute -top-1 opacity-60 animate-pulse" />
            <Crown className="w-full h-full text-slate-100 fill-slate-200 filter drop-shadow-[0_2px_8px_rgba(203,213,225,0.9)]" />
          </div>
        </div>
      )}

      {/* Top 3 Bronze Ember Crown */}
      {showCrown && isRank3 && (
        <div className={`absolute ${sizeConfig.crownIcon} z-20 flex items-center justify-center filter drop-shadow-md`}>
          <Crown className="w-full h-full text-amber-400 fill-amber-600 filter drop-shadow-[0_2px_6px_rgba(217,119,6,0.8)]" />
        </div>
      )}

      {/* Grandmaster Flame Aura for non-rank-1 GM */}
      {!isRank1 && !isRank2 && !isRank3 && frameId === 'frame-grandmaster' && (
        <div className={`absolute ${sizeConfig.crownIcon} z-20 flex items-center justify-center`}>
          <Flame className="w-full h-full text-orange-500 fill-orange-500 filter drop-shadow-md animate-pulse" />
        </div>
      )}

      {/* Outer Free Fire Beveled Frame Ring */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${sizeConfig.frameThickness} ${frameBorderClass} ${frameGlowClass}`}
      >
        {/* Inner Avatar Image */}
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center relative">
          <img
            src={displayAvatar}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full select-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
          />
          {/* Subtle glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/30 pointer-events-none rounded-full" />
        </div>
      </div>

      {/* Bottom Free Fire Tier Badge */}
      {showTierTag && (
        <div
          className={`absolute ${sizeConfig.badgeText} rounded-full whitespace-nowrap tracking-wider font-extrabold uppercase shadow-md border border-white/20 z-20 ${badgeClass}`}
        >
          {badgeLabel}
        </div>
      )}
    </div>
  );
};
