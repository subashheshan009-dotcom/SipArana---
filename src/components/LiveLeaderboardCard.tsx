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
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/80 dark:border-amber-700/60 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Rank + Avatar + Name */}
                <div className="flex items-center gap-3">
                  {getRankMedal(rank)}

                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {student.name}
                      </h4>
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

      {/* User's current rank snippet */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
            #{userRank > 0 ? userRank : 1}
          </div>
          <div>
            <div className="text-xs font-black flex items-center gap-1.5">
              <span>{profile?.name || 'Your Profile'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black">
                Active Scholar
              </span>
            </div>
            <p className="text-[11px] text-blue-100/90">
              Watch daily ads & complete mock quizzes to climb the global leaderboard!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-black text-xs bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>{profile?.xp || 0} XP</span>
        </div>
      </div>

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
