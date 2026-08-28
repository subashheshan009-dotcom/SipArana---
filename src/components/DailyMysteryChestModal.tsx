import React, { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Zap, Award, CheckCircle2, Gift, Clock, ShieldCheck, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface DailyMysteryChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (xpAmount: number) => void;
}

const CHEST_STORAGE_KEY = 'siparana_mystery_chest_claim_info';

interface ChestClaimRecord {
  lastClaimDate: string;
  totalOpened: number;
  unlockedBadges: string[];
}

const BADGE_REWARDS = [
  { id: 'bdg_owl_apprentice', title: '🦉 Owl Apprentice Badge', desc: 'Earned by learning daily with Kavi the Owl' },
  { id: 'bdg_streak_titan', title: '⚡ Streak Titan', desc: 'Maintained active daily study consistency' },
  { id: 'bdg_memory_master', title: '🧠 Quantum Memory Master', desc: 'Unlocked deep spaced repetition focus' },
  { id: 'bdg_diamond_scholar', title: '💎 Diamond Scholar', desc: 'Awarded for dedication to official syllabus benchmarks' }
];

export default function DailyMysteryChestModal({
  isOpen,
  onClose,
  onRewardClaimed
}: DailyMysteryChestModalProps) {
  const { profile, addXP, incrementStreak } = useAuth();
  const { language } = useLanguage();

  const [claimData, setClaimData] = useState<ChestClaimRecord>(() => {
    try {
      const saved = localStorage.getItem(CHEST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      lastClaimDate: '',
      totalOpened: 0,
      unlockedBadges: ['bdg_owl_apprentice']
    };
  });

  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [rewardWon, setRewardWon] = useState<{
    xp: number;
    badge: { id: string; title: string; desc: string };
    streakBonus: boolean;
  } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyClaimedToday = claimData.lastClaimDate === todayStr;

  useEffect(() => {
    try {
      localStorage.setItem(CHEST_STORAGE_KEY, JSON.stringify(claimData));
    } catch {
      // ignore
    }
  }, [claimData]);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    if (isAlreadyClaimedToday || isOpening || hasOpened) return;

    setIsOpening(true);
    soundFX.playClick();

    // 1.2 second build-up animation
    setTimeout(() => {
      soundFX.playChestOpen();
      setIsOpening(false);
      setHasOpened(true);

      const xpAmount = Math.floor(Math.random() * 150) + 100; // 100 - 250 XP
      const randomBadge = BADGE_REWARDS[Math.floor(Math.random() * BADGE_REWARDS.length)];

      setRewardWon({
        xp: xpAmount,
        badge: randomBadge,
        streakBonus: true
      });

      // Grant XP & Streak
      addXP(xpAmount);
      incrementStreak();
      if (onRewardClaimed) {
        onRewardClaimed(xpAmount);
      }

      // Update storage
      setClaimData(prev => ({
        lastClaimDate: todayStr,
        totalOpened: prev.totalOpened + 1,
        unlockedBadges: Array.from(new Set([...prev.unlockedBadges, randomBadge.id]))
      }));

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5, x: 0.5 }
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="daily-mystery-chest-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400/80 shadow-2xl text-white p-6 sm:p-8"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 text-center space-y-5">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black">
            <Gift className="w-3.5 h-3.5" />
            <span>
              {language === 'si' ? 'දෛනික අභිරහස් තිළිණ පෙට්ටිය' : 'Daily Mystery Chest Rewards'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {hasOpened
              ? language === 'si'
                ? 'සුබ පැතුම්! තිළිණ අගුළු හරින ලදී! 🎉'
                : 'Congratulations! Reward Unlocked! 🎉'
              : isAlreadyClaimedToday
              ? language === 'si'
                ? 'අද දවසේ තිළිණය ඔබ දැනටමත් ලබාගෙන ඇත! ⏳'
                : "Today's Chest Already Claimed! ⏳"
              : language === 'si'
              ? 'අද දවසේ අභිරහස් පෙට්ටිය විවෘත කරන්න! 🎁'
              : 'Tap Chest to Open Daily Mystery Loot!'}
          </h2>

          {/* Chest 3D Visual Box */}
          <div className="py-4 flex flex-col items-center justify-center">
            {!hasOpened ? (
              <div
                onClick={!isAlreadyClaimedToday ? handleOpenChest : undefined}
                className={`relative group p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-indigo-500/20 border-2 border-amber-400/60 shadow-xl transition-all duration-300 ${
                  !isAlreadyClaimedToday
                    ? 'cursor-pointer hover:scale-105 hover:border-amber-400 hover:shadow-amber-500/30'
                    : 'opacity-60 cursor-not-allowed'
                } ${isOpening ? 'animate-bounce scale-110' : ''}`}
              >
                <div className="text-6xl sm:text-7xl select-none filter drop-shadow-lg">
                  {isOpening ? '✨🎁✨' : isAlreadyClaimedToday ? '📦' : '🎁'}
                </div>

                {!isAlreadyClaimedToday && (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap animate-pulse">
                    {isOpening ? 'Opening Loot...' : 'Tap To Open'}
                  </div>
                )}
              </div>
            ) : (
              /* Opened Loot Reveal Card */
              <div className="w-full space-y-3.5 animate-in zoom-in-95 duration-300">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/50 flex items-center justify-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-lg">
                    +{rewardWon?.xp} XP
                  </div>
                  <div className="text-left space-y-0.5">
                    <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-300" />
                      XP Study Power-up
                    </div>
                    <div className="text-sm font-bold text-white">
                      Profile XP Boost Applied!
                    </div>
                  </div>
                </div>

                {/* Badge Unlocked */}
                {rewardWon?.badge && (
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/60 border border-purple-400/60 flex items-center justify-center text-xl flex-shrink-0">
                      🏅
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">
                        New Badge Unlocked
                      </span>
                      <h4 className="text-xs font-black text-white">{rewardWon.badge.title}</h4>
                      <p className="text-[11px] text-slate-300">{rewardWon.badge.desc}</p>
                    </div>
                  </div>
                )}

                {/* Streak Protected */}
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Daily Streak Active ({profile?.streakDays || 1} Days)
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            )}
          </div>

          {/* Subtext / Countdown */}
          {isAlreadyClaimedToday ? (
            <div className="space-y-1 text-xs text-slate-400">
              <p className="flex items-center justify-center gap-1.5 text-amber-300 font-bold">
                <Clock className="w-4 h-4" /> Next Mystery Chest unlocks tomorrow at midnight!
              </p>
              <p className="text-[11px]">
                Keep studying today to maintain your {profile?.streakDays || 1}-day streak and recharge Kavi the Owl.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Every day you log into SipArana, you earn bonus XP, exclusive badges, and keep your study pet happy!
            </p>
          )}

          {/* Action button */}
          <div className="pt-2">
            {hasOpened || isAlreadyClaimedToday ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-lg transition cursor-pointer"
              >
                {language === 'si' ? 'නියමයි! දිගටම පාඩම් කරමු' : 'Awesome! Back to Study'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenChest}
                disabled={isOpening}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl transition transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isOpening ? 'Unlocking...' : 'Open Mystery Chest Now!'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
