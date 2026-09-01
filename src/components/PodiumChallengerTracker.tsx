import React from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  Crown,
  Play,
  FileQuestion,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { soundFX } from '@/utils/audioUtils';
import type { PageId } from '@/components/Layout';

interface PodiumChallengerTrackerProps {
  onNavigate?: (page: PageId) => void;
}

export const PodiumChallengerTracker: React.FC<PodiumChallengerTrackerProps> = ({
  onNavigate
}) => {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const { leaderboard, top3, userRank } = useLeaderboard();

  const userXP = profile?.xp || 0;
  const userRankNum = userRank > 0 ? userRank : leaderboard.findIndex(u => u.name === profile?.name) + 1 || 1;

  // Identify the target 3rd rank scholar or lowest podium cutoff
  const rank3Scholar = top3[2] || (leaderboard.length >= 3 ? leaderboard[2] : top3[top3.length - 1]);
  const rank3XP = rank3Scholar ? rank3Scholar.allTimeXP : 0;
  
  // Calculate gap
  const isInsideTop3 = userRankNum > 0 && userRankNum <= 3;
  const xpDifference = isInsideTop3 ? 0 : Math.max(0, rank3XP - userXP + 1);

  // Each ad reward gives +100 XP, each quiz gives +50 XP
  const adsNeeded = Math.ceil(xpDifference / 100);
  const quizzesNeeded = Math.ceil(xpDifference / 50);

  // Progress percentage toward rank 3 (or if inside top 3, towards rank 1)
  const targetXP = isInsideTop3 
    ? (top3[0]?.allTimeXP || (userXP + 100)) 
    : (rank3XP > 0 ? rank3XP : userXP + 100);

  const progressPercent = Math.min(
    100,
    targetXP > 0 ? Math.max(8, Math.round((userXP / targetXP) * 100)) : 100
  );

  return (
    <div
      id="podium-challenger-tracker-card"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 p-4 sm:p-6 shadow-2xl space-y-4 backdrop-blur-xl ring-1 ring-amber-500/20"
    >
      {/* Background ambient lighting */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>CHALLENGER ZONE 🔥</span>
          </div>
          <span className="text-xs text-amber-300/90 font-bold hidden sm:inline">
            Live Podium Target & Gap Engine
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-xl">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Your Rank #{userRankNum}</span>
        </div>
      </div>

      {/* Core Dynamic Content */}
      <div className="space-y-3">
        {isInsideTop3 ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-yellow-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-yellow-500/30">
                👑
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-yellow-300">
                  {language === 'si'
                    ? 'සුබ පැතුම්! ඔබ දැනටමත් Top 3 වේදිකාවේ සිටී! 🏆'
                    : 'Glorious Scholar! You are currently on the Top 3 Podium! 🏆'}
                </h4>
                <p className="text-xs text-slate-300">
                  {userRankNum === 1
                    ? (language === 'si' ? 'ඔබ අංක 1 කිරුළ දරයි. දිගටම පෙරමුණේ රැඳෙන්න!' : 'You hold the Sovereign #1 Crown! Defend your reign with daily mock sets.')
                    : (language === 'si' ? 'අංක 1 රන් කිරුළ කරා ළඟා වීමට ප්‍රශ්න පත්‍ර විසඳන්න!' : 'Push forward to claim Sovereign Rank #1!')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-black text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
                {userXP.toLocaleString()} Total XP
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Bold Callout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {language === 'si'
                      ? `🎯 ඔබ Top 3 වේදිකාවට ඇතුළු වීමට තවත් XP ${xpDifference.toLocaleString()} ක් පමණක් පිටුපසින් සිටී!`
                      : `🎯 You are only ${xpDifference.toLocaleString()} XP away from entering the Top 3 Podium!`}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'si'
                    ? `3 වන ස්ථානය: ${rank3Scholar?.name || 'Top Scholar'} (${rank3XP.toLocaleString()} XP)`
                    : `Bronze 3rd Cutoff: ${rank3Scholar?.name || 'Top Scholar'} with ${rank3XP.toLocaleString()} XP`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Current vs Rank #3
                </span>
                <span className="text-sm font-black text-amber-300">
                  {userXP.toLocaleString()} / {rank3XP.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 relative overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 relative shadow-md shadow-amber-500/30"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-0.5">
                <span>You (#{userRankNum}: {userXP.toLocaleString()} XP)</span>
                <span className="text-amber-400 font-black">{progressPercent}% to Podium</span>
                <span>Bronze Cutoff (#{rank3XP.toLocaleString()} XP)</span>
              </div>
            </div>

            {/* Actionable Strategy Tip Box */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <p className="text-slate-300 leading-snug">
                  <strong className="text-amber-300">Quick Climb Tip: </strong>
                  {language === 'si'
                    ? `දිනපතා වීඩියෝ දැන්වීම් ${adsNeeded} ක් නැරඹීමෙන් හෝ විභාග ප්‍රශ්නාවලි ${quizzesNeeded} ක් සම්පූර්ණ කිරීමෙන් ඔබට මෙම Bronze ස්ථානය අභිබවා යා හැක!`
                    : `Watch ~${adsNeeded} daily video sponsor clips (+100 XP each) or complete ~${quizzesNeeded} mock quizzes (+50 XP) to claim your spot on the Global Podium!`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    if (onNavigate) onNavigate('quizzes');
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>Solve Quiz (+50 XP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playCorrect();
                    if (onNavigate) onNavigate('key_players');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center gap-1 transition cursor-pointer border border-slate-700 active:scale-95"
                >
                  <span>Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Motivational Bottom Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-amber-300 font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>The Champion's Crown is within your reach! 🏆</span>
        </span>
        <span className="text-slate-500">Real-time database synchronization</span>
      </div>
    </div>
  );
};
