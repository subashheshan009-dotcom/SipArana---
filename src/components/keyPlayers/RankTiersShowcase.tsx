import React from 'react';
import {
  Flame,
  Award,
  Crown,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { RANK_TIERS, AVATAR_FRAMES } from '@/data/keyPlayersData';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import { useAuth } from '@/context/AuthContext';

export const RankTiersShowcase: React.FC = () => {
  const { profile } = useAuth();
  const userXP = profile?.xp || 0;
  const userLevel = Math.max(1, Math.floor(userXP / 300) + 1);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              Free Fire Rank Tier Progression & Unlockable Avatar Frames
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Level up by solving quizzes, completing past papers, and maintaining daily study streaks
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1.5 self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>300 XP = 1 Scholar Level</span>
        </div>
      </div>

      {/* Rank Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RANK_TIERS.map((tier) => {
          const isCurrentTier =
            userLevel >= tier.minLevel &&
            (RANK_TIERS.find((t) => t.minLevel > tier.minLevel)?.minLevel || 999) > userLevel;
          const isUnlocked = userLevel >= tier.minLevel;

          const matchingFrame = AVATAR_FRAMES.find((f) => f.tier === tier.tierId) || AVATAR_FRAMES[0];

          return (
            <div
              key={tier.tierId}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isCurrentTier
                  ? 'bg-gradient-to-br from-amber-950/50 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10'
                  : isUnlocked
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              {isCurrentTier && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black tracking-wider">
                  ACTIVE TIER
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AvatarFrameRenderer
                    avatarUrl={profile?.avatar}
                    frameId={matchingFrame.id}
                    size="md"
                    showCrown={tier.tierId === 'grandmaster'}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{tier.badgeIcon}</span>
                      <h4 className="text-sm font-black text-white">{tier.name}</h4>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">Level {tier.minLevel}+</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium">{tier.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unlocks {matchingFrame.name}</span>
                </span>
                {isUnlocked ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">Req Level {tier.minLevel}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
