import React from 'react';
import { X, Flame, Sparkles, Award, ShieldCheck, Zap, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimMysteryChest?: () => void;
}

const STREAK_MILESTONES = [
  { day: 3, reward: '+50 XP Bonus', icon: '⚡', unlocked: true },
  { day: 7, reward: 'Bronze Owl Badge & +150 XP', icon: '🦉', unlocked: true },
  { day: 14, reward: 'Silver Crown Frame & +300 XP', icon: '👑', unlocked: false },
  { day: 30, reward: 'Golden Scholar Master Trophy', icon: '🏆', unlocked: false },
  { day: 100, reward: 'Diamond Elite Hall of Fame', icon: '💎', unlocked: false }
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DailyStreakModal({
  isOpen,
  onClose,
  onClaimMysteryChest
}: DailyStreakModalProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const streakDays = profile?.streakDays || 1;
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const activeDaysIndices = [1, 2, 3, 4, 5]; // Mon - Fri active

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="daily-streak-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-400/80 shadow-2xl text-white p-6 sm:p-8 space-y-5"
      >
        {/* Ambient flame glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>DAILY STUDY STREAK</span>
          </div>

          {/* Big Streak Flame */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative">
              <span className="text-6xl sm:text-7xl filter drop-shadow-lg select-none">🔥</span>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-md">
                {streakDays} Days
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-3 text-amber-300">
              {streakDays} Day Study Streak!
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mt-1">
              {language === 'si'
                ? 'ඔබ දිනපතා අඛණ්ඩව අධ්‍යයනය කරමින් විශිෂ්ට ප්‍රගතියක් පෙන්වයි. අඛණ්ඩතාවය විභාග ජයග්‍රහණයේ රහසයි!'
                : 'You are crushing your study consistency! Daily active learning locks facts into permanent long-term memory.'}
            </p>
          </div>
        </div>

        {/* 7-Day Visual Tracker */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            This Week's Activity
          </span>
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {WEEK_DAYS.map((day, idx) => {
              const isToday = idx === (currentDayIndex === 0 ? 6 : currentDayIndex - 1);
              const isDone = activeDaysIndices.includes(idx);
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isDone
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                      : isToday
                      ? 'bg-white/15 border-white/40 text-white animate-pulse'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold">{day}</span>
                  <div className="text-sm mt-0.5">
                    {isDone ? '🔥' : isToday ? '⏳' : '⚪'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Upcoming Streak Rewards
          </span>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {STREAK_MILESTONES.map((m) => {
              const isAchieved = streakDays >= m.day;
              return (
                <div
                  key={m.day}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    isAchieved
                      ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{m.icon}</span>
                    <span>Day {m.day} Milestone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-300">{m.reward}</span>
                    {isAchieved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-400">
                        {m.day - streakDays}d left
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex gap-2">
          {onClaimMysteryChest && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onClaimMysteryChest();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Daily Mystery Chest 🎁</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
