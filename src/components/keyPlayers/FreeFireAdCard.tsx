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
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  TrendingUp,
  X
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

interface FreeFireAdCardProps {
  onRewardClaimed?: (xp: number) => void;
}

export const FreeFireAdCard: React.FC<FreeFireAdCardProps> = ({
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

  useEffect(() => {
    setAdsWatched(getDailyActionCount('rewarded_ad_watch', userKey));
    setHasClaimedDaily(isDailyActionClaimedToday('daily_attendance', userKey));
  }, [userKey]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilReset(getFormattedTimeUntilMidnight());
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleAdCompleted = () => {
    setIsWatchingAd(false);
    const { newCount } = incrementDailyActionCount('rewarded_ad_watch', userKey, MAX_DAILY_ADS);
    setAdsWatched(newCount);

    if (rewardMode === 'spin') {
      setIsSpinModalOpen(true);
    } else {
      addXP(XP_PER_AD);
      onRewardClaimed?.(XP_PER_AD);

      const remaining = Math.max(0, MAX_DAILY_ADS - newCount);
      setToastMessage({
        id: Date.now(),
        title: '🎉 +100 XP Granted!',
        description: `${remaining}/20 Ads Remaining • Synced to Live Leaderboard`,
        xp: XP_PER_AD
      });
    }
  };

  const handleSpinRewardClaimed = (reward: SpinReward) => {
    const remaining = Math.max(0, MAX_DAILY_ADS - adsWatched);
    const xpAmt = reward.type === 'xp' ? (reward.value || 0) : 50;

    setToastMessage({
      id: Date.now(),
      title: `🎡 Lucky Spin Won: ${reward.label}!`,
      description: reward.type === 'frame'
        ? `Unlocked "${reward.frameName}" (+50 XP Bonus) • ${remaining}/20 Ads Left`
        : `+${reward.value} XP Added • ${remaining}/20 Ads Left`,
      xp: xpAmt
    });

    onRewardClaimed?.(xpAmt);
  };

  const handleDailyClaim = () => {
    if (hasClaimedDaily) {
      triggerDailyLockToast(
        '⚠️ Daily Attendance reward already claimed for today! Resets at midnight.',
        'Daily Attendance Claim'
      );
      return;
    }

    const recorded = recordDailyActionClaim('daily_attendance', userKey);
    if (!recorded) {
      triggerDailyLockToast(
        '⚠️ Daily Attendance reward already claimed for today! Resets at midnight.',
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
    <div id="free-fire-ad-card" className="space-y-4">
      {/* Real-Time Toast Notification */}
      {toastMessage && (
        <div
          id="ad-toast-notification"
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-between gap-2 text-white animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">⚡</span>
            <div className="min-w-0">
              <div className="text-xs font-black text-amber-300 truncate">
                {toastMessage.title}
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                {toastMessage.description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Free Fire Style Ad Monetization Card */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/40 p-5 shadow-2xl relative overflow-hidden space-y-4">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
              <Tv className="w-3 h-3" />
              <span>SPONSOR BOOST 📺</span>
            </span>

            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{timeUntilReset}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            <span>Watch Ad & Earn XP</span>
            <span className="text-amber-400">🎡</span>
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'si'
              ? 'වීඩියෝවක් නරඹා Lucky Spin කරකවා +200 XP හෝ Rare Avatar Frames දිනාගන්න!'
              : 'Watch a short partner clip to spin the Lucky Spin Wheel! Win +10 to +200 XP or Rare Avatar Frames.'}
          </p>
        </div>

        {/* Ad Progress Bar & Counter */}
        <div className="relative z-10 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Daily Ad Capacity:</span>
            <span className="text-amber-300 font-black">
              {adsRemaining} / {MAX_DAILY_ADS} Left
            </span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300"
              style={{ width: `${(adsWatched / MAX_DAILY_ADS) * 100}%` }}
            />
          </div>

          {/* Reward Mode Toggle */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400 font-semibold">Reward Mode:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setRewardMode('spin')}
                className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                  rewardMode === 'spin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎡 Lucky Spin
              </button>
              <button
                type="button"
                onClick={() => setRewardMode('direct')}
                className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                  rewardMode === 'direct'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Direct XP
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button: Watch Ad & Spin Wheel */}
        <div className="relative z-10 space-y-2">
          <button
            type="button"
            onClick={handleWatchAd}
            disabled={isAdCapReached || isWatchingAd}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              isAdCapReached
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-[0.98]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isAdCapReached
                ? 'Daily Limit Reached (20/20)'
                : rewardMode === 'spin'
                ? 'Watch Ad & Spin Wheel 🎡'
                : 'Watch Ad (+100 XP) ⚡'}
            </span>
          </button>
        </div>

        {/* Secondary Card: Daily Attendance 10 XP Free Claim */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white truncate">
                Daily Attendance Free XP
              </h4>
              <p className="text-[10px] text-indigo-300 font-semibold">
                +10 Free XP Every 24h
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDailyClaim}
            disabled={hasClaimedDaily}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex-shrink-0 ${
              hasClaimedDaily
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            {hasClaimedDaily ? 'Claimed ✓' : 'Claim 🎁'}
          </button>
        </div>
      </div>

      {/* Interactive 15-Second Simulated Ad Modal */}
      <RewardedAdPlaybackModal
        isOpen={isWatchingAd}
        onClose={() => setIsWatchingAd(false)}
        onAdCompleted={handleAdCompleted}
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
