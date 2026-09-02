import React from 'react';
import { Crown, Trophy, Medal, Flame, Zap, CheckCircle2, GraduationCap, Globe, ThumbsUp, ChevronRight } from 'lucide-react';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import type { StudentAchiever } from '@/data/keyPlayersData';
import type { PageId } from '@/components/Layout';
import confetti from 'canvas-confetti';

interface Top3PodiumProps {
  topStudents: StudentAchiever[];
  onCheerStudent: (id: string) => void;
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  onNavigate?: (page: PageId) => void;
  showViewAllButton?: boolean;
}

export const Top3Podium: React.FC<Top3PodiumProps> = ({
  topStudents,
  onCheerStudent,
  title = 'Top Champions Podium (Live Real-Time Ranks)',
  subtitle,
  badgeLabel = 'WORLD APEX 🌍',
  onNavigate,
  showViewAllButton = false
}) => {
  const rank1 = topStudents[0];
  const rank2 = topStudents[1];
  const rank3 = topStudents[2];

  const handleCheer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundFX.playPop();
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    onCheerStudent(id);
  };

  if (!rank1) return null;

  const totalPodiumCount = [rank1, rank2, rank3].filter(Boolean).length;

  return (
    <div id="top-3-podium-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700">
                100% REAL
              </span>
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold whitespace-nowrap">
            {badgeLabel}
          </span>
          {showViewAllButton && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('key_players')}
              className="px-3 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>View Full Leaderboard</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Podium Grid dynamically responsive based on available champions */}
      <div
        className={`pt-6 max-w-full items-end ${
          totalPodiumCount === 1
            ? 'max-w-md mx-auto'
            : totalPodiumCount === 2
            ? 'max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6'
        }`}
      >
        {/* RANK #2 - SILVER PODIUM */}
        {rank2 && (
          <div className="relative w-full max-w-full rounded-3xl bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-950 border-2 border-slate-300/60 p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center space-y-3.5 order-2 md:order-1 ring-1 ring-slate-300/30 hover:scale-102 transition duration-300 min-w-0">
            {/* Top Silver Rank Badge */}
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-slate-300 to-slate-100 text-slate-950 font-black text-[11px] sm:text-xs shadow-lg flex items-center gap-1 z-10">
              <span>🥈 RANK #2</span>
            </div>

            <div className="pt-4 pb-1 relative">
              <AvatarFrameRenderer
                avatarUrl={rank2.avatar}
                name={rank2.name}
                frameId="frame-silver"
                rank={2}
                size="lg"
                showCrown={true}
              />
            </div>

            {/* Free Fire Status Indicator */}
            <div className="flex items-center justify-center">
              {rank2.isOnline ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-black text-emerald-400 shadow-xs shadow-emerald-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>ONLINE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-bold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>OFFLINE</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 w-full min-w-0">
              <div className="flex items-center justify-center gap-1.5 flex-wrap px-1">
                <h4 className="text-sm sm:text-base font-black text-slate-100 truncate max-w-[180px]">{rank2.name}</h4>
                <span className="text-base flex-shrink-0" title={rank2.countryName}>{rank2.countryFlag}</span>
                {rank2.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-full px-2">
                {rank2.institution}
              </p>
              <div className="flex items-center justify-center">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold inline-block border border-slate-700 max-w-[200px] truncate">
                  {rank2.stream}
                </span>
              </div>
            </div>

            {/* Score Stats */}
            <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block truncate">XP SCORE</span>
                <span className="text-xs sm:text-sm font-black text-slate-200 truncate block">{rank2.allTimeXP.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block truncate">ACCURACY</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 truncate block">{rank2.quizAccuracy}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => handleCheer(e, rank2.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700 active:scale-95 shadow-xs"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              <span className="truncate">Cheer ({rank2.cheersCount})</span>
            </button>
          </div>
        )}

        {/* RANK #1 - GOLD PODIUM (TALLL & GLOWING) */}
        {rank1 && (
          <div className="relative w-full max-w-full rounded-3xl bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-2 border-yellow-400 p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center space-y-4 order-1 md:order-2 ring-2 ring-yellow-400/50 shadow-yellow-500/20 transform md:-translate-y-3 hover:scale-103 transition duration-300 min-w-0">
            {/* Top Gold Rank 1 Crown Badge */}
            <div className="absolute -top-4.5 px-4 sm:px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 animate-pulse z-10 whitespace-nowrap">
              <Crown className="w-4 h-4 fill-slate-950 flex-shrink-0" />
              <span>👑 SOVEREIGN RANK #1</span>
            </div>

            <div className="pt-5 pb-1 relative">
              <AvatarFrameRenderer
                avatarUrl={rank1.avatar}
                name={rank1.name}
                frameId="frame-gold"
                rank={1}
                size="xl"
                showCrown={true}
                showTierTag={true}
              />
            </div>

            {/* Free Fire Status Indicator */}
            <div className="flex items-center justify-center">
              {rank1.isOnline ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-[10px] font-black text-emerald-300 shadow-sm shadow-emerald-500/40">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span>ONLINE NOW</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-bold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>OFFLINE</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 w-full min-w-0">
              <div className="flex items-center justify-center gap-1.5 flex-wrap px-1">
                <h4 className="text-base sm:text-lg font-black text-yellow-300 truncate max-w-[200px]">{rank1.name}</h4>
                <span className="text-lg flex-shrink-0" title={rank1.countryName}>{rank1.countryFlag}</span>
                {rank1.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-amber-200 font-semibold truncate max-w-full px-2">
                {rank1.institution}
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-0.5 flex-wrap px-1">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 truncate max-w-[150px]">
                  {rank1.stream}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold truncate max-w-[120px]">
                  {rank1.specialBadge}
                </span>
              </div>
            </div>

            {/* Score Stats */}
            <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/90 border border-yellow-500/30 text-center min-w-0">
                <span className="text-[10px] text-amber-400 font-bold block truncate">ALL-TIME XP</span>
                <span className="text-sm sm:text-base font-black text-yellow-300 truncate block">{rank1.allTimeXP.toLocaleString()}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/90 border border-yellow-500/30 text-center min-w-0">
                <span className="text-[10px] text-amber-400 font-bold block truncate">ACCURACY</span>
                <span className="text-sm sm:text-base font-black text-emerald-400 truncate block">{rank1.quizAccuracy}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => handleCheer(e, rank1.id)}
              className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-yellow-500/20 active:scale-95"
            >
              <ThumbsUp className="w-4 h-4 fill-slate-950 flex-shrink-0" />
              <span className="truncate">Cheer Champion ({rank1.cheersCount})</span>
            </button>
          </div>
        )}

        {/* RANK #3 - BRONZE PODIUM / CHALLENGER ZONE */}
        {rank3 && (
          <div className="relative w-full max-w-full rounded-3xl bg-gradient-to-b from-amber-950/70 via-slate-900 to-slate-950 border-2 border-amber-600/80 p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center space-y-3.5 order-3 md:order-3 ring-2 ring-orange-500/50 shadow-orange-500/20 hover:scale-102 transition duration-300 min-w-0">
            {/* Challenger Zone Neon Banner */}
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-600 to-amber-700 text-white font-black text-[11px] sm:text-xs shadow-lg shadow-orange-500/30 flex items-center gap-1.5 z-10 animate-pulse border border-orange-300/40">
              <Flame className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span>CHALLENGER SPOT #3</span>
            </div>

            <div className="pt-4 pb-1 relative">
              <AvatarFrameRenderer
                avatarUrl={rank3.avatar}
                name={rank3.name}
                frameId="frame-bronze"
                rank={3}
                size="lg"
                showCrown={true}
              />
            </div>

            {/* Free Fire Status Indicator */}
            <div className="flex items-center justify-center">
              {rank3.isOnline ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-black text-emerald-400 shadow-xs shadow-emerald-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>ONLINE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-bold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>OFFLINE</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 w-full min-w-0">
              <div className="flex items-center justify-center gap-1.5 flex-wrap px-1">
                <h4 className="text-sm sm:text-base font-black text-amber-200 truncate max-w-[180px]">{rank3.name}</h4>
                <span className="text-base flex-shrink-0" title={rank3.countryName}>{rank3.countryFlag}</span>
                {rank3.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-full px-2">
                {rank3.institution}
              </p>
              <div className="flex items-center justify-center">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold inline-block border border-slate-700 max-w-[200px] truncate">
                  {rank3.stream}
                </span>
              </div>
            </div>

            {/* Score Stats */}
            <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block truncate">XP SCORE</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate block">{rank3.allTimeXP.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block truncate">ACCURACY</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 truncate block">{rank3.quizAccuracy}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => handleCheer(e, rank3.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700 active:scale-95 shadow-xs"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Cheer ({rank3.cheersCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
