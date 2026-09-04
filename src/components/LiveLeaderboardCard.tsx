import React, { useState } from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, Star, ChevronRight, Crown, Medal, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { PageId } from '@/components/Layout';

interface LiveLeaderboardCardProps {
  onNavigate?: (page: PageId) => void;
}

export default function LiveLeaderboardCard({ onNavigate }: LiveLeaderboardCardProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const { leaderboard, userRank } = useLeaderboard();
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'allTime'>('weekly');

  const top5 = leaderboard.slice(0, 5);

  const getRankMedal = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md ring-2 ring-amber-300">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-md ring-2 ring-slate-400">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 ring-amber-600">
          🥉
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
        #{rank}
      </div>
    );
  };

  return (
    <section
      id="live-leaderboard-card"
      className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-4 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{language === 'si' ? 'සජීවී ප්‍රමුඛ පුවරුව' : 'Live Real-Time Leaderboard'}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                100% REAL
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'si' ? 'ලියාපදිංචි සැබෑ සිසුන්ගේ සජීවී ලකුණු ප්‍රගතිය' : 'Live progress from genuinely registered scholars'}
            </p>
          </div>
        </div>

        {/* Filter toggle */}
        <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterPeriod('weekly')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'weekly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setFilterPeriod('allTime')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'allTime'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Top 5 list */}
      <div className="space-y-2.5">
        {top5.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500">Log in or solve your first quiz to appear on the live board!</p>
          </div>
        ) : (
          top5.map((student, idx) => {
            const rank = idx + 1;
            const xp = filterPeriod === 'weekly' ? student.weeklyXP : student.allTimeXP;
            const isRank3Challenger = rank === 3;
            return (
              <div
                key={student.id}
                className={`relative flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/80 dark:border-amber-700/60 shadow-xs'
                    : isRank3Challenger
                    ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-400/80 dark:border-orange-600/70 shadow-xs ring-1 ring-orange-400/30'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Rank 3 Challenger Highlight Badge */}
                {isRank3Challenger && (
                  <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[9px] font-black text-white shadow-xs flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                    <span>CHALLENGER SPOT</span>
                  </div>
                )}

                {/* Rank + Avatar with Free Fire Status Dot + Name */}
                <div className="flex items-center gap-3">
                  {getRankMedal(rank)}

                  <div className="relative flex-shrink-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-800"
                    />
                    {student.isOnline ? (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-xs ring-1 ring-emerald-400"
                        title="Online"
                      />
                    ) : (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-900 rounded-full"
                        title="Offline"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {student.name}
                      </h4>
                      {student.isOnline ? (
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online 🟢
                        </span>
                      ) : (
                        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                          Offline ⚪
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold hidden sm:inline">
                        {student.districtOrCity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {student.stream}
                    </p>
                  </div>
                </div>

                {/* Stats: Streak & XP */}
                <div className="flex items-center gap-3 text-right">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{student.streakDays}d</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    <span>{xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DYNAMIC DISTANCE TO TOP 3 PODIUM TRACKER */}
      {(() => {
        const userXP = profile?.xp || 0;
        const userRankNum = userRank > 0 ? userRank : leaderboard.findIndex(u => u.name === profile?.name) + 1 || 1;
        const rank3Scholar = leaderboard.length >= 3 ? leaderboard[2] : leaderboard[leaderboard.length - 1];
        const rank3XP = rank3Scholar ? rank3Scholar.allTimeXP : 0;
        const isInsideTop3 = userRankNum > 0 && userRankNum <= 3;
        const xpDifference = isInsideTop3 ? 0 : Math.max(0, rank3XP - userXP + 1);
        const adsNeeded = Math.ceil(xpDifference / 100);
        const quizzesNeeded = Math.ceil(xpDifference / 50);
        const targetXP = isInsideTop3 ? (leaderboard[0]?.allTimeXP || (userXP + 100)) : (rank3XP > 0 ? rank3XP : userXP + 100);
        const progressPercent = Math.min(100, targetXP > 0 ? Math.max(10, Math.round((userXP / targetXP) * 100)) : 100);

        return (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 text-white space-y-3 shadow-lg">
            {/* Header / Callout */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-slate-950" />
                    <span>Challenger Zone 🔥</span>
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-300">
                    Your Rank #{userRankNum}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                  {isInsideTop3 ? (
                    language === 'si' ? '👑 ඔබ දැනටමත් Top 3 වේදිකාවේ සිටී!' : '👑 You are on the Global Top 3 Podium!'
                  ) : (
                    language === 'si'
                      ? `🎯 ඔබ Top 3 වේදිකාවට ඇතුළු වීමට තවත් XP ${xpDifference.toLocaleString()} ක් පමණක් පිටුපසින්!`
                      : `🎯 You are only ${xpDifference.toLocaleString()} XP away from entering the Top 3 Podium!`
                  )}
                </h4>
              </div>

              <div className="text-right shrink-0 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15">
                <span className="text-[9px] text-slate-300 block uppercase font-bold">Your Score</span>
                <span className="text-xs font-black text-amber-300 flex items-center justify-end gap-1">
                  <Zap className="w-3 h-3 fill-amber-300" />
                  {userXP.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* Progress bar towards Podium #3 */}
            <div className="space-y-1">
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-700 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>Current: {userXP.toLocaleString()} XP</span>
                <span className="text-amber-400">{progressPercent}% to Podium</span>
                <span>Cutoff: {rank3XP.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Actionable Strategy Tip */}
            {!isInsideTop3 && (
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between gap-2">
                <p className="line-clamp-2">
                  <strong className="text-amber-300">Action Tip: </strong>
                  {language === 'si'
                    ? `දිනපතා දැන්වීම් ${adsNeeded} ක් හෝ ප්‍රශ්නාවලි ${quizzesNeeded} ක් සම්පූර්ණ කර Top 3 ස්ථානය දිනාගන්න!`
                    : `Watch ~${adsNeeded} daily video ads (+100 XP) or complete ~${quizzesNeeded} quizzes (+50 XP) to claim your spot!`}
                </p>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('quizzes')}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] transition cursor-pointer"
                  >
                    Solve Quiz
                  </button>
                )}
              </div>
            )}

            <div className="text-[10.5px] text-amber-300/90 font-bold flex items-center gap-1">
              <span>The Champion's Crown is within your reach! 🏆</span>
            </div>
          </div>
        );
      })()}

      {/* Full Key Players Page Link */}
      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate('key_players')}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-400/50 hover:border-amber-500 text-amber-900 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <Crown className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-300" />
          <span>
            {language === 'si' ? 'සම්පූර්ණ Key Players විශිෂ්ටයින්ගේ පුවරුව බලන්න' : 'View Full Key Players Hall of Fame'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}
