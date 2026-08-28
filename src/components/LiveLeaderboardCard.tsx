import React, { useState } from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, Star, ChevronRight, Crown, Medal, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  district: string;
  stream: string;
  weeklyXP: number;
  streakDays: number;
  badge: string;
  isCurrentUser?: boolean;
}

const TOP_STUDENTS_MOCK: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Kavindu Theekshana',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    district: 'Colombo',
    stream: 'Physical Science (Maths)',
    weeklyXP: 2840,
    streakDays: 24,
    badge: '🏆 Top Scholar'
  },
  {
    rank: 2,
    name: 'Methmi Nethsara',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    district: 'Kandy',
    stream: 'Biological Science (Bio)',
    weeklyXP: 2510,
    streakDays: 19,
    badge: '⚡ Speed Master'
  },
  {
    rank: 3,
    name: 'Dinuka Senarath',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    district: 'Galle',
    stream: 'Grade 11 O/L',
    weeklyXP: 2180,
    streakDays: 15,
    badge: '🎯 Precision 99%'
  },
  {
    rank: 4,
    name: 'Anuki Perera',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    district: 'Kurunegala',
    stream: 'Commerce Stream',
    weeklyXP: 1950,
    streakDays: 12,
    badge: '🧠 Logic Ace'
  },
  {
    rank: 5,
    name: 'Sahan Sandeepa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    district: 'Matara',
    stream: 'Technology Stream',
    weeklyXP: 1820,
    streakDays: 10,
    badge: '🌟 Rising Star'
  }
];

export default function LiveLeaderboardCard() {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'allTime'>('weekly');

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
              <span>{language === 'si' ? 'සතිපතා ප්‍රමුඛ පුවරුව' : 'Weekly Scholar Leaderboard'}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'si' ? 'ලකුණු සහ දිනපතා අඛණ්ඩතාව අනුව ඉහළම සිසුන් 5 දෙනා' : 'Top 5 performing students across all streams'}
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
        {TOP_STUDENTS_MOCK.map((student) => (
          <div
            key={student.rank}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              student.rank === 1
                ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/80 dark:border-amber-700/60 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {/* Rank + Avatar + Name */}
            <div className="flex items-center gap-3">
              {getRankMedal(student.rank)}

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
                    {student.district}
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
                <span>{student.weeklyXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User's current rank snippet */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
            #12
          </div>
          <div>
            <div className="text-xs font-black flex items-center gap-1.5">
              <span>{profile?.name || 'Your Profile'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black">
                Top 3%
              </span>
            </div>
            <p className="text-[11px] text-blue-100/90">
              Only 280 XP to enter the Top 10 Scholars!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-black text-xs bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>{profile?.xp || 1450} XP</span>
        </div>
      </div>
    </section>
  );
}
