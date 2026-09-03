import React from 'react';
import {
  Flame,
  Globe,
  Trophy,
  Zap,
  Sparkles,
  Edit3,
  Share2,
  GraduationCap,
  TrendingUp,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import { RANK_TIERS, type StudentAchiever } from '@/data/keyPlayersData';

interface GlobalRankCardProps {
  topStudents: StudentAchiever[];
  onOpenCustomizer: () => void;
  onNavigateToQuiz?: () => void;
}

export const GlobalRankCard: React.FC<GlobalRankCardProps> = ({
  topStudents,
  onOpenCustomizer,
  onNavigateToQuiz
}) => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const userXP = profile?.xp || 0;
  const userLevel = Math.max(1, Math.floor(userXP / 300) + 1);

  // Compute live user rank relative to the global leaderboard
  let userRank = topStudents.length + 1;
  let nextRankStudent: StudentAchiever | null = null;
  let xpDiffToNextRank = 300;

  for (let i = 0; i < topStudents.length; i++) {
    if (userXP >= topStudents[i].allTimeXP) {
      userRank = i + 1;
      nextRankStudent = i > 0 ? topStudents[i - 1] : null;
      break;
    }
  }

  if (userRank > topStudents.length) {
    const lastStudent = topStudents[topStudents.length - 1];
    xpDiffToNextRank = Math.max(50, (lastStudent?.allTimeXP || 9000) - userXP);
    nextRankStudent = lastStudent;
  } else if (nextRankStudent) {
    xpDiffToNextRank = Math.max(50, nextRankStudent.allTimeXP - userXP);
  }

  // Current Rank Tier info
  const currentTier = RANK_TIERS.slice().reverse().find((t) => userLevel >= t.minLevel) || RANK_TIERS[0];
  const nextTier = RANK_TIERS.find((t) => t.minLevel > userLevel);

  // Frame ID from profile
  const userFrameId = profile?.customAvatarFrameId || (
    userLevel >= 60 ? 'frame-grandmaster' :
    userLevel >= 50 ? 'frame-diamond' :
    userLevel >= 40 ? 'frame-platinum' :
    userLevel >= 30 ? 'frame-gold' :
    userLevel >= 20 ? 'frame-silver' :
    userLevel >= 10 ? 'frame-bronze' :
    'frame-default'
  );

  const countryFlag = profile?.countryFlag || '🇱🇰';
  const countryName = profile?.countryName || 'Sri Lanka';
  const institutionName = profile?.school || profile?.university || 'National Premier College';
  const targetUniv = profile?.targetUniversity || 'University of Moratuwa (CSE) / Cambridge';
  const bioQuote = profile?.bio || profile?.statusQuote || 'Dedicated scholar striving for peak academic mastery & Island Rank.';

  const handleShare = () => {
    soundFX.playPop();
    if (navigator.share) {
      navigator.share({
        title: `${profile?.name || 'Scholar'} - SipArana Global Rank #${userRank}`,
        text: `I'm ranked #${userRank} globally on the SipArana Global Education Ecosystem! Total XP: ${userXP.toLocaleString()} (${currentTier.name}).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `🏆 I'm ranked #${userRank} globally on SipArana Education! Total XP: ${userXP.toLocaleString()} (${currentTier.name}).`
      );
      alert('Rank card stats copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-4 sm:p-6 shadow-2xl overflow-hidden text-slate-100 ring-1 ring-amber-500/20">
      {/* Background Free Fire Aesthetic Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Bar with Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            100% Unified Global Ranks
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Open Worldwide to all Schools & Universities</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile & Frames</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Share your Global Rank"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Grid: Clean Responsive 2-Column on Desktop, Stack on Mobile */}
      <div className="relative z-10 mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Avatar & Identity Details Section */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 w-full min-w-0">
          <div className="relative group cursor-pointer shrink-0" onClick={onOpenCustomizer}>
            <AvatarFrameRenderer
              avatarUrl={profile?.avatar}
              name={profile?.name}
              frameId={userFrameId}
              rank={userRank <= 3 ? userRank : undefined}
              size="lg"
              showTierTag={true}
            />
            {/* Quick edit overlay */}
            <span className="absolute bottom-1 right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md group-hover:scale-110 transition">
              <Edit3 className="w-3 h-3" />
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate max-w-full">
                {profile?.name || 'Scholar Candidate'}
              </h2>
              <span className="text-lg shrink-0" title={countryName}>
                {countryFlag}
              </span>
            </div>

            {/* Rank Tier Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs max-w-full">
              <span className="text-sm shrink-0">{currentTier.badgeIcon}</span>
              <span className="font-extrabold text-amber-300 tracking-wide uppercase truncate">
                {currentTier.name}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-bold text-[11px] whitespace-nowrap">Level {userLevel}</span>
            </div>

            {/* Institution & Dream Target */}
            <div className="space-y-1 text-xs">
              <p className="text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{institutionName}</span>
              </p>
              <p className="text-amber-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Target: {targetUniv}</span>
              </p>
            </div>

            {/* Bio Quote */}
            <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-800/60 leading-relaxed">
              "{bioQuote}"
            </p>
          </div>
        </div>

        {/* Right Rank Stat Indicator & XP Progression */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-slate-950/70 border border-slate-800/90 p-4 sm:p-5 rounded-2xl w-full min-w-0">
          {/* Global Rank, Total Study XP, Daily Streak - 3 Even, Squeeze-Proof Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Box 1: Global Rank */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between overflow-hidden min-w-0 space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block truncate">
                Global Rank
              </span>
              <div className="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-1.5 py-0.5 min-w-0 flex-wrap overflow-hidden leading-tight">
                <Trophy className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
                <span className="truncate">#{userRank}</span>
                <span className="text-xs text-slate-400 font-normal truncate">/ 50k+</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block truncate">
                {userRank <= 10 ? '👑 Elite Top 10' : userRank <= 50 ? '🌟 Top 50 Achiever' : '🌍 Top 3.5% Global'}
              </span>
            </div>

            {/* Box 2: Total Study XP */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between overflow-hidden min-w-0 space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block truncate">
                Total Study XP
              </span>
              <div className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5 py-0.5 min-w-0 flex-wrap overflow-hidden leading-tight">
                <Zap className="w-4.5 h-4.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="truncate">{userXP.toLocaleString()} XP</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Weekly: +{(profile?.streakDays || 1) * 140} XP
              </span>
            </div>

            {/* Box 3: Daily Streak */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between overflow-hidden min-w-0 space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block truncate">
                Daily Streak
              </span>
              <div className="text-lg sm:text-xl font-black text-orange-400 flex items-center gap-1.5 py-0.5 min-w-0 flex-wrap overflow-hidden leading-tight">
                <Flame className="w-4.5 h-4.5 fill-orange-500 text-orange-500 shrink-0" />
                <span className="truncate">{profile?.streakDays || 1} Days</span>
              </div>
              <span className="text-[10px] text-orange-300 font-bold block truncate">
                Continuous Fire 🔥
              </span>
            </div>
          </div>

          {/* Dynamic Next Rank Overtake XP Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5 min-w-0 truncate">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {userRank === 1
                    ? '👑 You are Sovereign Rank #1 Globally! Defend the lead!'
                    : `Earn ${xpDiffToNextRank.toLocaleString()} more XP to overtake Rank #${userRank - 1}`}
                </span>
              </span>
              <span className="text-[11px] font-black text-amber-400 shrink-0">
                {nextTier ? `Next: ${nextTier.name} (Lv ${nextTier.minLevel})` : 'Apex Tier Reached'}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, Math.max(15, ((userXP % 1000) / 1000) * 100))}%`
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400 pt-0.5">
              <span>Current Progress: {(userXP % 1000)} / 1000 XP in Level {userLevel}</span>
              {onNavigateToQuiz && (
                <button
                  type="button"
                  onClick={onNavigateToQuiz}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  <span>Solve Daily Quiz to Earn +50 XP</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
