import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Tv,
  Play,
  Volume2,
  VolumeX,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  GraduationCap,
  Globe,
  Flame,
  Award
} from 'lucide-react';
import { soundFX } from '@/utils/audioUtils';

interface RewardedAdPlaybackModalProps {
  isOpen: boolean;
  onAdCompleted: () => void;
  onClose?: () => void;
  adDurationSeconds?: number;
}

const SPONSOR_ADS = [
  {
    title: 'Cambridge & MIT Global Scholar Prep Series 2026',
    sponsor: 'SipArana Global Academic Alliance',
    category: 'STEM & Quantum Physics Masterclass',
    tag: 'Academic Partner',
    accentColor: 'from-amber-500 to-yellow-400',
    icon: '🏛️'
  },
  {
    title: 'Oxford & Stanford Pure Mathematics Diagnostic Drills',
    sponsor: 'International Olympiad Foundation',
    category: 'Advanced Calculus & Logic Analysis',
    tag: 'Verified Syllabus',
    accentColor: 'from-blue-500 to-cyan-400',
    icon: '📐'
  },
  {
    title: 'Tokyo & Singapore AI Neural Engineering Labs',
    sponsor: 'MEXT & Global Education Forum',
    category: 'Algorithmic Thinking & Robotics',
    tag: 'Future Scholar',
    accentColor: 'from-emerald-500 to-teal-400',
    icon: '🤖'
  }
];

export const RewardedAdPlaybackModal: React.FC<RewardedAdPlaybackModalProps> = ({
  isOpen,
  onAdCompleted,
  adDurationSeconds = 15
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(adDurationSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeAdIndex] = useState<number>(() => Math.floor(Math.random() * SPONSOR_ADS.length));
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeAd = SPONSOR_ADS[activeAdIndex] || SPONSOR_ADS[0];

  // Reset timer on open
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(adDurationSeconds);
      setIsCompleted(false);
    }
  }, [isOpen, adDurationSeconds]);

  // High precision countdown timer
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        if (secondsRemaining <= 1) {
          // Reached 0s - Instant completion and immediate auto-close
          setIsCompleted(true);
          setSecondsRemaining(0);
          soundFX.playLevelUp();

          try {
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.55 }
            });
          } catch {}

          // Immediately trigger completion callback to unmount modal without delay
          onAdCompleted();
        } else {
          setSecondsRemaining((prev) => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, secondsRemaining, isCompleted, onAdCompleted]);

  if (!isOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round(((adDurationSeconds - secondsRemaining) / adDurationSeconds) * 100)
  );

  return (
    <div
      id="rewarded-ad-playback-modal"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-2xl text-white flex flex-col">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* TOP HEADER BAR: Live Countdown & Lock Status */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-950/60 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
              <span>Ad playing... {secondsRemaining}s remaining 🎬</span>
            </span>
          </div>

          {/* Locked Close/Skip indicator */}
          <div className="flex items-center gap-2">
            {secondsRemaining > 0 ? (
              <div
                title="Early skip is disabled. Watch full ad to claim +100 XP."
                className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-bold text-slate-400 flex items-center gap-1.5 cursor-not-allowed select-none"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Skip locked ({secondsRemaining}s)</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-black text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed (+100 XP)</span>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE VIDEO PLAYER BODY */}
        <div className="p-4 sm:p-6 space-y-4 relative z-10">
          {/* Main Video Viewport Canvas */}
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4 sm:p-5">
            {/* Background Animation & Visuals */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/30 via-slate-950 to-blue-950/30" />
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />

            {/* Video Top Controls Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{activeAd.tag}</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-black/50 text-[10px] font-mono text-slate-300 border border-slate-700">
                  HD 1080p
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playPop();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Center Video Content Graphic */}
            <div className="relative z-10 text-center space-y-2 py-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-500/20 transform hover:scale-105 transition">
                {activeAd.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {activeAd.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{activeAd.category}</p>
              </div>
            </div>

            {/* Video Bottom Progress Bar & Time */}
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>0:{String(adDurationSeconds - secondsRemaining).padStart(2, '0')}</span>
                </span>
                <span className="font-mono text-amber-400">
                  -{String(secondsRemaining).padStart(2, '0')}s
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-900/90 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-1000 ease-linear shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ad Reward Information Footer */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-amber-300 truncate">
                  High-Yield Scholar Reward
                </h4>
                <p className="text-[11px] text-slate-300">
                  Automatic return to Key Players Leaderboard upon completion.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-black text-amber-300 font-mono block">
                +100 XP
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">Instant Boost</span>
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">SipArana Verified Academic Partner Network</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>20 Ads Daily Max</span>
          </div>
        </div>
      </div>
    </div>
  );
};
