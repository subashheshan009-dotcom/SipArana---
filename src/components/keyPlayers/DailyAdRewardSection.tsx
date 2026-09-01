import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Tv,
  Gift,
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  Play,
  X,
  Award,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import {
  isDailyActionClaimedToday,
  recordDailyActionClaim,
  getDailyActionCount,
  incrementDailyActionCount,
  triggerDailyLockToast,
  getFormattedTimeUntilMidnight
} from '@/utils/dailyXpLockEngine';
import { RewardedAdPlaybackModal } from './RewardedAdPlaybackModal';
import { LuckySpinWheelModal, type SpinReward } from './LuckySpinWheelModal';

const MAX_DAILY_ADS = 20;
const XP_PER_AD = 100;
const DAILY_CLAIM_XP = 10;

interface DailyAdRewardSectionProps {
  onRewardClaimed?: (xp: number) => void;
}

export const DailyAdRewardSection: React.FC<DailyAdRewardSectionProps> = ({
  onRewardClaimed
}) => {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const userKey = profile?.email || profile?.id || 'guest_user';

  const [adsWatched, setAdsWatched] = useState<number>(() => {
    return getDailyActionCount('rewarded_ad_watch', userKey);
  });

  const [hasClaimedDaily, setHasClaimedDaily] = useState<boolean>(() => {
    return isDailyActionClaimedToday('daily_attendance', userKey);
  });

  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState<boolean>(false);
  const [rewardMode, setRewardMode] = useState<'spin' | 'direct'>('spin');
  const [timeUntilReset, setTimeUntilReset] = useState<string>(getFormattedTimeUntilMidnight());
  const [toastMessage, setToastMessage] = useState<{
    id: number;
    title: string;
    description: string;
    xp: number;
  } | null>(null);

  const adsRemaining = Math.max(0, MAX_DAILY_ADS - adsWatched);
  const isAdCapReached = adsWatched >= MAX_DAILY_ADS;

  // Sync state on external custom event or profile change
  useEffect(() => {
    setAdsWatched(getDailyActionCount('rewarded_ad_watch', userKey));
    setHasClaimedDaily(isDailyActionClaimedToday('daily_attendance', userKey));
  }, [userKey]);

  // Auto-dismiss toast notification
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Calculate midnight countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilReset(getFormattedTimeUntilMidnight());
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Watch Ad Click -> opens 15s interactive simulation modal
  const handleWatchAd = () => {
    if (isAdCapReached) {
      triggerDailyLockToast(
        '⚠️ Daily Ad Limit Reached (20/20)! Come back tomorrow at midnight for fresh ad rewards.',
        'Rewarded Ads'
      );
      return;
    }
    if (isWatchingAd) return;
    soundFX.playPop();
    setIsWatchingAd(true);
  };

  // Called when 15s ad countdown hits 0
  const handleAdCompleted = () => {
    // 1. Immediately close ad modal window
    setIsWatchingAd(false);

    // 2. Increment watched count via lock engine
    const { newCount } = incrementDailyActionCount('rewarded_ad_watch', userKey, MAX_DAILY_ADS);
    setAdsWatched(newCount);

    if (rewardMode === 'spin') {
      // 3a. Open Lucky Spin Wheel modal so student spins for randomized XP
      setIsSpinModalOpen(true);
    } else {
      // 3b. Direct +100 XP grant
      addXP(XP_PER_AD);
      onRewardClaimed?.(XP_PER_AD);

      const remaining = Math.max(0, MAX_DAILY_ADS - newCount);
      setToastMessage({
        id: Date.now(),
        title: '🎉 +100 XP Added Successfully!',
        description: `${remaining}/20 Ads Left Today • Synced to Global Leaderboard`,
        xp: XP_PER_AD
      });
    }
  };

  // Handle spin reward claimed from modal
  const handleSpinRewardClaimed = (reward: SpinReward) => {
    const remaining = Math.max(0, MAX_DAILY_ADS - adsWatched);
    const xpAmt = reward.type === 'xp' ? (reward.value || 0) : 50;

    setToastMessage({
      id: Date.now(),
      title: `🎡 Lucky Spin Won: ${reward.label}!`,
      description: reward.type === 'frame'
        ? `Unlocked "${reward.frameName}" (+50 XP Bonus) • ${remaining}/20 Ads Left`
        : `+${reward.value} XP Added • ${remaining}/20 Ads Left Today`,
      xp: xpAmt
    });

    onRewardClaimed?.(xpAmt);
  };

  // Handle Daily 10 XP Free Claim
  const handleDailyClaim = () => {
    if (hasClaimedDaily) {
      triggerDailyLockToast(
        '⚠️ You have already claimed your Daily Attendance reward today! Come back tomorrow at midnight for fresh XP.',
        'Daily Attendance Claim'
      );
      return;
    }

    const recorded = recordDailyActionClaim('daily_attendance', userKey);
    if (!recorded) {
      triggerDailyLockToast(
        '⚠️ You have already claimed your Daily Attendance reward today! Come back tomorrow at midnight for fresh XP.',
        'Daily Attendance Claim'
      );
      return;
    }

    soundFX.playCorrect();
    setHasClaimedDaily(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    addXP(DAILY_CLAIM_XP);
    onRewardClaimed?.(DAILY_CLAIM_XP);

    setToastMessage({
      id: Date.now(),
      title: '🎁 Daily Attendance Claimed (+10 XP)!',
      description: 'Your learning streak is active. Keep climbing the ranks!',
      xp: DAILY_CLAIM_XP
    });
  };

  return (
    <div id="daily-rewards-monetization-section" className="space-y-4 relative">
      {/* Real-time Toast Notification Banner */}
      {toastMessage && (
        <div
          id="daily-reward-toast-banner"
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-2 border-amber-400/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white animate-in fade-in slide-in-from-top-3 duration-300 ring-1 ring-amber-300/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              ⚡
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-black text-amber-300 flex items-center gap-2 flex-wrap">
                <span>{toastMessage.title}</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs">
                  +{toastMessage.xp} XP Granted
                </span>
              </h4>
              <p className="text-xs text-slate-200 truncate">
                {toastMessage.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Column Responsive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* CARD 1: Glowing "Watch Ad & Lucky Spin Wheel 🎡" */}
        <div className="md:col-span-8 relative rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border border-amber-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-amber-500/30 group">
          {/* Ambient Glowing Effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-0 group-hover:bg-amber-500/20 transition duration-500" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  <span>SPONSOR BOOST + LUCKY SPIN</span>
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs font-bold text-amber-400">
                  Win +10 to +200 XP or Rare Avatar Frames!
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Watch Ad & Lucky Spin 🎡</span>
              </h3>

              <p className="text-xs text-slate-300 max-w-md">
                {language === 'si'
                  ? 'වීඩියෝවක් නරඹා Lucky Spin Wheel එක කරකවන්න! +200 XP Jackpot එකක් හෝ Galactic, Cyberpunk, Crown Sovereign frames දිනාගන්න.'
                  : 'Watch a short partner video to spin the Lucky Spin Wheel! Win randomized rewards: +10, +50, +100, +200 XP Jackpot or Rare Avatar Frames.'}
              </p>

              {/* Mode Selector & Dynamic Remaining Counter */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs font-black text-amber-300 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  <span>
                    Ads Left: <strong className="text-white text-sm">{adsRemaining}/{MAX_DAILY_ADS}</strong>
                  </span>
                </div>

                {/* Progress Bar of Daily 20 Limit */}
                <div className="w-28 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{ width: `${(adsWatched / MAX_DAILY_ADS) * 100}%` }}
                  />
                </div>

                {/* Reward Mode Pill Switcher */}
                <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setRewardMode('spin')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      rewardMode === 'spin'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎡 Lucky Spin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardMode('direct')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      rewardMode === 'direct'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Fixed 100 XP
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2.5 shrink-0">
              {isAdCapReached ? (
                <div className="text-center lg:text-right p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-center lg:justify-end gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Daily Limit Reached (20/20)</span>
                  </div>
                  <div className="text-sm font-black text-amber-400">
                    Resets in {timeUntilReset}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleWatchAd}
                  disabled={isWatchingAd}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer transform hover:scale-102 active:scale-98"
                >
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>{rewardMode === 'spin' ? 'Watch Ad & Spin 🎡' : 'Watch Ad (+100 XP)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: "Daily Claim (10 XP) 🎁" Box */}
        <div className="md:col-span-4 relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border border-indigo-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-indigo-500/30 flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Gift className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase text-indigo-300 tracking-wider">
                FREE ATTENDANCE
              </span>
            </div>

            <h3 className="text-xl font-black text-white">
              Daily Claim (10 XP) 🎁
            </h3>

            <p className="text-xs text-slate-300">
              {language === 'si'
                ? 'දිනපතා SipArana වෙත පිවිස නොමිලේ දෛනික XP ප්‍රසාදය ලබාගන්න.'
                : 'Log in daily to keep your learning streak active and claim your instant free 10 XP bonus.'}
            </p>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleDailyClaim}
              disabled={hasClaimedDaily}
              className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                hasClaimedDaily
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-98'
              }`}
            >
              {hasClaimedDaily ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Claimed for Today (+10 XP)</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Claim Daily +10 XP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rewarded Video Ad Modal with 15s Countdown, Locked Skip, Auto-Close */}
      <RewardedAdPlaybackModal
        isOpen={isWatchingAd}
        adDurationSeconds={15}
        onAdCompleted={handleAdCompleted}
        onClose={() => setIsWatchingAd(false)}
      />

      {/* Lucky Spin Wheel Modal */}
      <LuckySpinWheelModal
        isOpen={isSpinModalOpen}
        onClose={() => setIsSpinModalOpen(false)}
        onRewardClaimed={handleSpinRewardClaimed}
      />
    </div>
  );
};

