import React from 'react';
import { Sun, Moon, Sparkles, Cloud, Stars, Compass } from 'lucide-react';

export type TimePeriod = 'morning' | 'afternoon' | 'sunset' | 'night';

interface TimeAmbienceBackdropProps {
  activeTime: TimePeriod;
  onSelectTime: (t: TimePeriod) => void;
  liveLearnersCount: number;
}

export default function TimeAmbienceBackdrop({
  activeTime,
  onSelectTime,
  liveLearnersCount
}: TimeAmbienceBackdropProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-700 shadow-2xl border border-white/20 mb-8 select-none">
      {/* Background Gradient matching time of day */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          activeTime === 'morning'
            ? 'bg-gradient-to-r from-sky-400 via-amber-200 to-emerald-300 dark:from-sky-950 dark:via-blue-900 dark:to-emerald-950'
            : activeTime === 'afternoon'
            ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950'
            : activeTime === 'sunset'
            ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 dark:from-orange-950 dark:via-purple-950 dark:to-slate-950'
            : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950'
        }`}
      />

      {/* Floating Animated Celestial Body (Sun / Moon) */}
      <div className="absolute top-4 right-10 pointer-events-none transition-transform duration-1000">
        {activeTime === 'night' ? (
          <div className="relative flex items-center justify-center">
            {/* Glowing Moon */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.5)] flex items-center justify-center animate-pulse">
              <span className="text-3xl sm:text-4xl">🌙</span>
            </div>
            {/* Twinkling Stars */}
            <div className="absolute -top-4 -left-12 text-yellow-200 text-lg animate-ping">✨</div>
            <div className="absolute top-10 -left-20 text-yellow-100 text-xs animate-pulse">⭐</div>
            <div className="absolute -bottom-6 -left-8 text-amber-200 text-sm animate-bounce">✨</div>
          </div>
        ) : activeTime === 'sunset' ? (
          <div className="relative flex items-center justify-center">
            {/* Sunset Golden Orb */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 shadow-[0_0_60px_rgba(249,115,22,0.6)] flex items-center justify-center">
              <span className="text-3xl sm:text-4xl">🌇</span>
            </div>
            <div className="absolute -bottom-2 -left-14 text-orange-200 text-sm animate-pulse">✨</div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Bright Morning / Day Sun */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 shadow-[0_0_60px_rgba(251,191,36,0.7)] flex items-center justify-center animate-spin-slow">
              <span className="text-3xl sm:text-4xl">☀️</span>
            </div>
            <div className="absolute -top-3 -left-8 text-yellow-200 text-base animate-bounce">✨</div>
          </div>
        )}
      </div>

      {/* Decorative Clouds & Light Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-6 left-1/4 w-48 h-12 bg-white/40 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-1/3 w-64 h-16 bg-white/30 rounded-full blur-2xl" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/25 dark:bg-black/40 backdrop-blur-md border border-white/30 text-xs font-black text-slate-900 dark:text-white shadow-xs">
            <span className="text-sm">✨</span>
            <span className="uppercase tracking-wider">
              {activeTime === 'morning'
                ? '🌅 Bright Morning Learning Realm'
                : activeTime === 'afternoon'
                ? '☀️ Sunny Daytime Adventure'
                : activeTime === 'sunset'
                ? '🌇 Golden Sunset Study Glow'
                : '🌙 Cozy Twilight Starlight Realm'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
            Language Learning Adventure 🌍
          </h1>

          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed drop-shadow-xs">
            Embark on a joyful journey through <strong>Speaking</strong>, <strong>Writing</strong>, and <strong>Reading</strong>. Practice with AI Mentor Kavi Owl, unlock magical badges, and climb the live national leaderboard!
          </p>
        </div>

        {/* Controls: Time Switcher + Live Learners Pulse */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 w-full sm:w-auto">
          {/* Live Learners Pulse Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 text-xs font-bold text-slate-900 dark:text-white shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>{liveLearnersCount.toLocaleString()} Students Active Now</span>
          </div>

          {/* Time Ambience Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 text-xs font-black">
            <button
              type="button"
              onClick={() => onSelectTime('morning')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTime === 'morning'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white'
              }`}
              title="Morning Sky"
            >
              <span>🌅</span>
              <span className="hidden sm:inline">Morning</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTime('afternoon')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTime === 'afternoon'
                  ? 'bg-cyan-400 text-slate-950 shadow-xs'
                  : 'text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white'
              }`}
              title="Daytime Sky"
            >
              <span>☀️</span>
              <span className="hidden sm:inline">Day</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTime('sunset')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTime === 'sunset'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white'
              }`}
              title="Sunset Glow"
            >
              <span>🌇</span>
              <span className="hidden sm:inline">Sunset</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTime('night')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTime === 'night'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white'
              }`}
              title="Night Stars"
            >
              <span>🌙</span>
              <span className="hidden sm:inline">Night</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
