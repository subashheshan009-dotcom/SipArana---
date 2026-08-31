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
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { RewardedAdPlaybackModal } from './RewardedAdPlaybackModal';

const MAX_DAILY_ADS = 20;
const XP_PER_AD = 100;
const DAILY_CLAIM_XP = 10;

interface DailyAdRewardSectionProps {
  onRewardClaimed?: (xp: number) => void;
}

export const DailyAdRewardSection: React.FC<DailyAdRewardSectionProps> = ({
  onRewardClaimed
}) => {
  const { addXP } = useAuth();
  const { language } = useLanguage();

  // Local storage key for daily ad tracking
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKeyAds = `siparana_ads_watched_${todayKey}`;
  const storageKeyDailyClaim = `siparana_daily_claim_${todayKey}`;

  const [adsWatched, setAdsWatched] = useState<number>(() => {
    const saved = localStorage.getItem(storageKeyAds);
    return saved ? Math.min(MAX_DAILY_ADS, parseInt(saved, 10)) : 2; // Default 2 watched, 18 remaining
  });

  const [hasClaimedDaily, setHasClaimedDaily] = useState<boolean>(() => {
    return localStorage.getItem(storageKeyDailyClaim) === 'true';
  });

  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  const adsRemaining = Math.max(0, MAX_DAILY_ADS - adsWatched);
  const isAdCapReached = adsWatched >= MAX_DAILY_ADS;

  // Calculate midnight countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Watch Ad Click -> opens 15s interactive simulation modal
  const handleWatchAd = () => {
    if (isAdCapReached || isWatchingAd) return;
    soundFX.playPop();
    setIsWatchingAd(true);
  };

  // Called when 15s ad countdown hits 0
  const handleAdCompleted = () => {
    setIsWatchingAd(false);
    const newWatched = Math.min(MAX_DAILY_ADS, adsWatched + 1);
    setAdsWatched(newWatched);
    localStorage.setItem(storageKeyAds, newWatched.toString());

    // Grant +100 XP
    addXP(XP_PER_AD);
    onRewardClaimed?.(XP_PER_AD);
  };

  // Handle Daily 10 XP Free Claim
  const handleDailyClaim = () => {
    if (hasClaimedDaily) return;

    soundFX.playCorrect();
    setHasClaimedDaily(true);
    localStorage.setItem(storageKeyDailyClaim, 'true');

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    addXP(DAILY_CLAIM_XP);
    onRewardClaimed?.(DAILY_CLAIM_XP);
  };

  return (
    <div id="daily-rewards-monetization-section" className="space-y-4">
      {/* 2-Column Responsive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* CARD 1: Glowing "Watch Ad (+100 XP) 🎬" with Remaining Limit */}
        <div className="md:col-span-8 relative rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border border-amber-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-amber-500/30 group">
          {/* Ambient Glowing Effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-0 group-hover:bg-amber-500/20 transition duration-500" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  <span>DAILY SPONSOR BOOST</span>
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs font-bold text-amber-400">
                  +{XP_PER_AD} XP / Ad (Max 2,000 XP/day)
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Watch Ad (+100 XP) 🎬</span>
              </h3>

              <p className="text-xs text-slate-300 max-w-md">
                {language === 'si'
                  ? 'දිනකට වීඩියෝ 20ක් දක්වා නරඹා XP 2,000ක් දක්වා උපයාගෙන ඔබගේ Global Rank එක වේගයෙන් ඉහළ නංවාගන්න.'
                  : 'Support free education worldwide. Watch high-quality academic partner videos to claim +100 XP per view (Capped at 20 ads per day).'}
              </p>

              {/* Dynamic Remaining Counter */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs font-black text-amber-300 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  <span>
                    Ads Remaining Today: <strong className="text-white text-sm">{adsRemaining}/{MAX_DAILY_ADS}</strong> Left
                  </span>
                </div>

                {/* Progress Bar of Daily 20 Limit */}
                <div className="w-32 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{ width: `${(adsWatched / MAX_DAILY_ADS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Button or Countdown */}
            <div className="flex flex-col items-center sm:items-end justify-center shrink-0">
              {isAdCapReached ? (
                <div className="text-center sm:text-right p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Daily Limit Reached (20/20)</span>
                  </div>
                  <div className="text-sm font-black text-amber-400">
                    Resets in {timeUntilReset}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Check back at midnight for fresh 20 ads
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleWatchAd}
                  disabled={isWatchingAd}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer transform hover:scale-102 active:scale-98"
                >
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>Watch Ad (+100 XP)</span>
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

      {/* Rewarded Video Ad Modal with 15s Countdown, Locked Skip, Auto-Close & +100 XP */}
      <RewardedAdPlaybackModal
        isOpen={isWatchingAd}
        adDurationSeconds={15}
        onAdCompleted={handleAdCompleted}
        onClose={() => setIsWatchingAd(false)}
      />
    </div>
  );
};
