import React from 'react';
import { Award, Trophy, Lock, CheckCircle2, Sparkles, Flame, Users, Star } from 'lucide-react';
import { ADVENTURE_BADGES, ADVENTURE_LEADERBOARD, AdventureBadge } from '@/data/languageAdventureData';
import owlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import { soundFX } from '@/utils/audioUtils';

interface AdventureTrophyCabinetProps {
  unlockedBadgeIds: string[];
}

export default function AdventureTrophyCabinet({ unlockedBadgeIds }: AdventureBadgePropsWrapper) {
  return (
    <div className="space-y-8">
      {/* Trophy Cabinet Card watched over by Kavi Owl */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-indigo-500/30 shadow-2xl space-y-6">
        {/* Header with Kavi Guardian */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-indigo-800/60">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg ring-4 ring-amber-400/20">
                <img
                  src={owlAvatar}
                  alt="Kavi Guardian of the Trophy Cabinet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs">👑</div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3 h-3" />
                GUARDIAN OF HONORS
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <span>Kavi’s Virtual Trophy Cabinet</span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-xs text-indigo-200">
                Master Speaking, Writing, and Reading to unlock prestigious legendary honors!
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-indigo-900/60 border border-indigo-700/60 text-xs font-black text-amber-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              {unlockedBadgeIds.length} of {ADVENTURE_BADGES.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* 3D Glass Pedestals Grid for Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVENTURE_BADGES.map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  if (isUnlocked) soundFX.playLevelUp();
                }}
                className={`relative p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between select-none ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-indigo-900/40 via-purple-900/30 to-slate-900/80 border-indigo-400/50 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 cursor-pointer ring-1 ring-indigo-400/20'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                {/* Rarity & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      badge.rarity === 'Legendary'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : badge.rarity === 'Epic'
                        ? 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
                        : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                    }`}
                  >
                    {badge.rarity}
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                {/* Pedestal & Icon */}
                <div className="flex flex-col items-center justify-center my-3">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition transform ${
                      isUnlocked
                        ? `bg-gradient-to-tr ${badge.glowColor} ring-4 ring-white/20 shadow-[0_0_25px_rgba(99,102,241,0.5)] animate-bounce-slow`
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  {/* Subtle glass pedestal reflection line */}
                  <div className="w-12 h-1.5 rounded-full bg-white/20 mt-3 blur-xs" />
                </div>

                {/* Info */}
                <div className="text-center space-y-1 mt-2">
                  <h4 className="text-sm font-black text-white">{badge.titleEn}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {badge.descEn}
                  </p>
                  <span className="text-[10px] font-mono text-amber-300/90 block pt-1">
                    Req: {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Adventure Leaderboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Live National Adventure Leaderboard 🇱🇰
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top performing students in Speaking, Writing & Reading across all districts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Updated Every 60s</span>
          </div>
        </div>

        {/* Table / List */}
        <div className="space-y-2.5">
          {ADVENTURE_LEADERBOARD.map(student => (
            <div
              key={student.rank}
              className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                student.rank === 1
                  ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-amber-950/30 border-amber-300 dark:border-amber-800 shadow-sm'
                  : student.rank === 2
                  ? 'bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/40 dark:to-blue-950/20 border-slate-300 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Rank & Student Info */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    student.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : student.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : student.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  #{student.rank}
                </div>

                <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{student.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">({student.district})</span>
                  </h4>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {student.badge}
                  </span>
                </div>
              </div>

              {/* Stats & Streak */}
              <div className="flex items-center gap-4 text-xs self-stretch sm:self-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Speaking Accuracy
                  </span>
                  <span className="font-black text-slate-800 dark:text-slate-200">
                    {student.speakingScore}%
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-black border border-orange-200 dark:border-orange-900/60">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>{student.streak}d</span>
                </div>

                <div className="text-right pl-2 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-amber-500 block">
                    Total XP
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {student.totalXP.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AdventureBadgePropsWrapper {
  unlockedBadgeIds: string[];
}
