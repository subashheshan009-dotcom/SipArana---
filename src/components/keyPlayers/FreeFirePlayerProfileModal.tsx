import React, { useState } from 'react';
import {
  X,
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  GraduationCap,
  Globe,
  ThumbsUp,
  Target,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import type { StudentAchiever } from '@/data/keyPlayersData';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface FreeFirePlayerProfileModalProps {
  student: StudentAchiever | null;
  isOpen: boolean;
  onClose: () => void;
  onCheer?: (id: string) => void;
  currentUserId?: string;
}

export const FreeFirePlayerProfileModal: React.FC<FreeFirePlayerProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onCheer,
  currentUserId
}) => {
  const [hasCheered, setHasCheered] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !student) return null;

  const isCurrentUser = student.id === currentUserId || student.isCurrentUser;

  const handleCheerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCheered) return;
    setHasCheered(true);
    soundFX.playPop();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    if (onCheer) {
      onCheer(student.id);
    }
  };

  const getRankTheme = (rank: number) => {
    if (rank === 1) {
      return {
        badge: '👑 GRANDMASTER #1',
        bannerGradient: 'from-amber-600 via-yellow-500 to-amber-700',
        borderColor: 'border-yellow-400',
        glowColor: 'shadow-yellow-500/30',
        textColor: 'text-yellow-300',
        bgPill: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
      };
    }
    if (rank === 2) {
      return {
        badge: '🥈 MASTER #2',
        bannerGradient: 'from-slate-400 via-slate-300 to-slate-500',
        borderColor: 'border-slate-300',
        glowColor: 'shadow-slate-400/20',
        textColor: 'text-slate-200',
        bgPill: 'bg-slate-300/20 border-slate-300/40 text-slate-200'
      };
    }
    if (rank === 3) {
      return {
        badge: '🥉 HEROIC #3',
        bannerGradient: 'from-amber-700 via-orange-600 to-amber-800',
        borderColor: 'border-orange-500',
        glowColor: 'shadow-orange-500/20',
        textColor: 'text-orange-300',
        bgPill: 'bg-orange-500/20 border-orange-500/40 text-orange-300'
      };
    }
    if (rank <= 10) {
      return {
        badge: `💎 DIAMOND #${rank}`,
        bannerGradient: 'from-blue-600 via-cyan-600 to-indigo-700',
        borderColor: 'border-cyan-400',
        glowColor: 'shadow-cyan-500/20',
        textColor: 'text-cyan-300',
        bgPill: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
      };
    }
    return {
      badge: `⚡ PLATINUM #${rank}`,
      bannerGradient: 'from-slate-700 via-slate-800 to-slate-900',
      borderColor: 'border-slate-700',
      glowColor: 'shadow-slate-800/20',
      textColor: 'text-slate-300',
      bgPill: 'bg-slate-800/60 border-slate-700 text-slate-300'
    };
  };

  const rankTheme = getRankTheme(student.rank);

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      id="free-fire-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="free-fire-profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-3xl bg-slate-950 border-2 ${rankTheme.borderColor} shadow-2xl ${rankTheme.glowColor} overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          title="Close profile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Free Fire Battle Banner Header */}
        <div className={`relative p-6 bg-gradient-to-r ${rankTheme.bannerGradient} border-b border-white/10 overflow-hidden`}>
          {/* Background Decorative Tech Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-start gap-4">
            {/* Player Avatar with Frame */}
            <div className="relative flex-shrink-0">
              <AvatarFrameRenderer frameId={student.frameId} size="lg">
                {student.avatar && !imgError ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    onError={() => setImgError(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/40 shadow-xl bg-slate-900"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border-2 border-white/40 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl">
                    {getInitials(student.name)}
                  </div>
                )}
              </AvatarFrameRenderer>
              {/* Free Fire Online/Offline status dot */}
              {student.isOnline ? (
                <span
                  className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-md shadow-emerald-500/50 ring-2 ring-emerald-300"
                  title="Online Now"
                />
              ) : (
                <span
                  className="absolute bottom-0 right-0 w-4 h-4 bg-slate-500 border-2 border-slate-950 rounded-full"
                  title="Offline (Rank Reserved)"
                />
              )}
              {isCurrentUser && (
                <span className="absolute -top-1 -left-1 px-2 py-0.5 rounded-full bg-blue-600 border border-white text-[9px] font-black text-white shadow-md">
                  YOU
                </span>
              )}
            </div>

            {/* Player Banner Name & Rank */}
            <div className="min-w-0 flex-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20 text-[10px] font-black tracking-wider uppercase text-white">
                  {rankTheme.badge}
                </div>
                {student.isOnline ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[10px] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    Offline (Rank Reserved)
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white truncate drop-shadow-md flex items-center gap-1.5">
                <span>{student.name}</span>
                {student.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 fill-cyan-400/30 flex-shrink-0" />
                )}
              </h2>

              <p className="text-xs text-white/80 font-medium truncate mt-0.5">
                {student.institution}
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                <span className="px-2 py-0.5 rounded bg-black/30 text-white font-bold flex items-center gap-1 border border-white/10">
                  <span>{student.countryFlag}</span>
                  <span>{student.countryName || 'Global'}</span>
                </span>
                {student.stream && (
                  <span className="px-2 py-0.5 rounded bg-black/30 text-white/90 font-medium truncate max-w-[180px] border border-white/10">
                    {student.stream}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body Combat / Study Stats Grid */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* Main XP & Streak Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Global Rank</span>
              </div>
              <p className="text-base sm:text-lg font-black text-amber-300">
                #{student.rank}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Total XP</span>
              </div>
              <p className="text-base sm:text-lg font-black text-cyan-300">
                {student.allTimeXP.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>Daily Streak</span>
              </div>
              <p className="text-base sm:text-lg font-black text-orange-400">
                {student.streakDays} Days
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Accuracy</span>
              </div>
              <p className="text-base sm:text-lg font-black text-emerald-400">
                {student.quizAccuracy || 95}%
              </p>
            </div>
          </div>

          {/* Academic & Target Goals */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Stream</span>
              </span>
              <span className="font-semibold text-slate-200 text-right">
                {student.gradeLevel || student.stream || 'A-Level / Secondary'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Institution & Location</span>
              </span>
              <span className="font-semibold text-slate-200 text-right">
                {student.institution} {student.districtOrCity ? `(${student.districtOrCity})` : ''}
              </span>
            </div>

            {student.targetUniversity && (
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target University</span>
                </span>
                <span className="font-bold text-amber-300 text-right">
                  {student.targetUniversity}
                </span>
              </div>
            )}
          </div>

          {/* Bio Status Quote if provided */}
          {student.bioQuote && (
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-slate-300 text-xs italic">
              "{student.bioQuote}"
            </div>
          )}

          {/* Bottom Actions: Cheers Button */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCheerClick}
              disabled={hasCheered}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                hasCheered
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasCheered ? 'fill-emerald-400' : ''}`} />
              <span>
                {hasCheered ? 'Cheered! (+5 XP to you)' : `Cheer Scholar (${(student.cheersCount || 0) + (hasCheered ? 1 : 0)})`}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
