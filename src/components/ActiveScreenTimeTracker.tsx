import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, CheckCircle2, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

const ACTIVE_SCREEN_TIME_INTERVAL_SECONDS = 300; // 5 minutes = 300 seconds
const XP_PER_SCREEN_TIME_CHUNK = 10; // strictly +10 XP per 5 minutes

export const ActiveScreenTimeTracker: React.FC = () => {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const userKey = profile?.email || profile?.id || 'guest_user';
  const todayStr = new Date().toISOString().split('T')[0];

  // Storage key for daily active seconds
  const storageKey = `siparana_active_study_sec_${userKey}_${todayStr}`;

  const [totalActiveSecondsToday, setTotalActiveSecondsToday] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [currentChunkSeconds, setCurrentChunkSeconds] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(storageKey);
      const total = saved ? parseInt(saved, 10) : 0;
      return total % ACTIVE_SCREEN_TIME_INTERVAL_SECONDS;
    } catch {
      return 0;
    }
  });

  const [isTabActive, setIsTabActive] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastDetails, setToastDetails] = useState<{ totalMinutes: number; xpGranted: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const lastAwardedChunkRef = useRef<number>(
    Math.floor(totalActiveSecondsToday / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS)
  );

  // Monitor document visibility and tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };

    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main active screen time timer loop
  useEffect(() => {
    if (!profile) return;

    const interval = setInterval(() => {
      // Only tick if user is actively in the tab
      if (document.visibilityState !== 'visible') {
        return;
      }

      setTotalActiveSecondsToday((prevTotal) => {
        const nextTotal = prevTotal + 1;
        const currentChunk = nextTotal % ACTIVE_SCREEN_TIME_INTERVAL_SECONDS;
        setCurrentChunkSeconds(currentChunk);

        // Check if a 5-minute milestone (300s) has been reached
        const completedChunks = Math.floor(nextTotal / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS);

        if (completedChunks > lastAwardedChunkRef.current) {
          lastAwardedChunkRef.current = completedChunks;

          // Award strictly +10 XP for 5 minutes active study time
          addXP(XP_PER_SCREEN_TIME_CHUNK);
          soundFX.playCorrect();

          const totalMins = completedChunks * 5;
          setToastDetails({
            totalMinutes: totalMins,
            xpGranted: XP_PER_SCREEN_TIME_CHUNK
          });
          setShowToast(true);

          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.85, x: 0.85 }
            });
          } catch {}
        }

        // Periodically save to localStorage
        if (nextTotal % 5 === 0) {
          try {
            localStorage.setItem(storageKey, String(nextTotal));
          } catch {}
        }

        return nextTotal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [profile, storageKey, addXP]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  const secondsRemainingInChunk = ACTIVE_SCREEN_TIME_INTERVAL_SECONDS - currentChunkSeconds;
  const progressPercent = Math.min(100, Math.round((currentChunkSeconds / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS) * 100));

  const totalMinutesToday = Math.floor(totalActiveSecondsToday / 60);
  const totalSecondsRemainder = totalActiveSecondsToday % 60;
  const remMinutes = Math.floor(secondsRemainingInChunk / 60);
  const remSeconds = secondsRemainingInChunk % 60;

  const totalEarnedXpToday = Math.floor(totalActiveSecondsToday / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS) * XP_PER_SCREEN_TIME_CHUNK;

  if (!profile) return null;

  return (
    <>
      {/* 5-Minute Milestone Reward Toast */}
      {showToast && toastDetails && (
        <div
          id="active-screen-time-xp-toast"
          className="fixed bottom-20 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-400 text-white shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-emerald-400/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg animate-bounce">
              ⏱️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                  Active Study Reward
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px]">
                  +{toastDetails.xpGranted} XP
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                {language === 'si'
                  ? `මිනිත්තු ${toastDetails.totalMinutes}ක් ක්‍රියාකාරීව අධ්‍යයනය කළා! ලකුණු +${toastDetails.xpGranted} XP සජීවීව එක්විය.`
                  : `5 minutes active study milestone reached! +${toastDetails.xpGranted} XP synced to Leaderboard.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Active Study Streak Tracker Pill / Drawer */}
      <div
        id="active-study-time-floating-tracker"
        className="fixed bottom-4 right-4 sm:right-6 z-40"
      >
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-slate-100 border border-emerald-500/50 shadow-xl backdrop-blur-md transition-all hover:scale-103 cursor-pointer group ring-1 ring-emerald-400/30"
            title="Click to view Active Study Screen Time Tracker"
          >
            <div className="relative">
              <Timer className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              {isTabActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-black">
                <span className="text-emerald-400">
                  {totalMinutesToday}m {totalSecondsRemainder}s
                </span>
                <span className="text-slate-400 text-[10px] font-normal">Active</span>
              </div>
            </div>
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-amber-400">
              +{XP_PER_SCREEN_TIME_CHUNK}XP in {remMinutes}:{String(remSeconds).padStart(2, '0')}
            </span>
          </button>
        ) : (
          <div className="w-72 sm:w-80 rounded-3xl bg-slate-950/95 border-2 border-emerald-500/60 p-4 text-white shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 space-y-3 ring-2 ring-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-100">
                    {language === 'si' ? 'ක්‍රියාකාරී අධ්‍යයන කාලය' : 'Active Study Screen Time'}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isTabActive ? 'Active in App' : 'Paused (Background Tab)'}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* 5-Min Milestone Progress */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Next +10 XP Reward:</span>
                <span className="text-emerald-400 font-mono font-black">
                  {remMinutes}m {remSeconds}s left
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>0m</span>
                <span className="text-amber-300 font-bold">5 mins = +10 XP</span>
                <span>5m</span>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Today's Study</div>
                <div className="text-sm font-black text-slate-100 mt-0.5">
                  {totalMinutesToday}m {totalSecondsRemainder}s
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Screen Time XP</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  +{totalEarnedXpToday} XP
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center leading-relaxed">
              ⭐ Automatically awards strictly +10 XP every 5 minutes while studying in the app.
            </div>
          </div>
        )}
      </div>
    </>
  );
};
