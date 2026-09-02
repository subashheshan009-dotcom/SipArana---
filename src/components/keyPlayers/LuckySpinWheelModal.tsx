import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Zap,
  Gift,
  Crown,
  Trophy,
  Flame,
  Award,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';

export interface SpinReward {
  id: string;
  label: string;
  subLabel: string;
  type: 'xp' | 'frame';
  value?: number;
  frameId?: string;
  frameName?: string;
  color: string;
  textColor: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export const SPIN_SECTORS: SpinReward[] = [
  {
    id: 'rew-100xp',
    label: '+100 XP',
    subLabel: 'Power Boost',
    type: 'xp',
    value: 100,
    color: '#F59E0B',
    textColor: '#1E293B',
    icon: '⚡',
    rarity: 'Rare'
  },
  {
    id: 'rew-galactic',
    label: 'Galactic Frame',
    subLabel: 'Cosmic Shimmer',
    type: 'frame',
    frameId: 'frame-galactic',
    frameName: 'Galactic Nebula Cosmic Frame',
    color: '#9333EA',
    textColor: '#FFFFFF',
    icon: '🔮',
    rarity: 'Epic'
  },
  {
    id: 'rew-50xp',
    label: '+50 XP',
    subLabel: 'Sprint Surge',
    type: 'xp',
    value: 50,
    color: '#2563EB',
    textColor: '#FFFFFF',
    icon: '💎',
    rarity: 'Common'
  },
  {
    id: 'rew-cyberpunk',
    label: 'Cyberpunk Frame',
    subLabel: 'Neon Grid',
    type: 'frame',
    frameId: 'frame-cyberpunk',
    frameName: 'Cyberpunk Neon Laser Frame',
    color: '#10B981',
    textColor: '#0F172A',
    icon: '⚡',
    rarity: 'Epic'
  },
  {
    id: 'rew-200xp',
    label: '+200 XP',
    subLabel: 'MEGA JACKPOT',
    type: 'xp',
    value: 200,
    color: '#E11D48',
    textColor: '#FFFFFF',
    icon: '🌟',
    rarity: 'Legendary'
  },
  {
    id: 'rew-20xp',
    label: '+20 XP',
    subLabel: 'Speed Bonus',
    type: 'xp',
    value: 20,
    color: '#6366F1',
    textColor: '#FFFFFF',
    icon: '✨',
    rarity: 'Common'
  },
  {
    id: 'rew-crownjewel',
    label: 'Crown Sovereign',
    subLabel: 'Imperial 24K',
    type: 'frame',
    frameId: 'frame-crownjewel',
    frameName: 'Crown Jewel Sovereign Imperial Frame',
    color: '#FACC15',
    textColor: '#0F172A',
    icon: '👑',
    rarity: 'Legendary'
  },
  {
    id: 'rew-10xp',
    label: '+10 XP',
    subLabel: 'Daily Spark',
    type: 'xp',
    value: 10,
    color: '#0D9488',
    textColor: '#FFFFFF',
    icon: '🎁',
    rarity: 'Common'
  }
];

interface LuckySpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (reward: SpinReward) => void;
}

export const LuckySpinWheelModal: React.FC<LuckySpinWheelModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed
}) => {
  const { profile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(1);

  const numSectors = SPIN_SECTORS.length;
  const sectorAngle = (2 * Math.PI) / numSectors;

  // Draw the lucky spin wheel canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 12;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    // Draw Wheel Segments
    SPIN_SECTORS.forEach((sector, i) => {
      const startAngle = i * sectorAngle;
      const endAngle = (i + 1) * sectorAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = sector.color;
      ctx.fill();

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Sector Text & Icon
      ctx.save();
      const midAngle = startAngle + sectorAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = sector.textColor;

      // Icon
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(sector.icon, radius - 16, 5);

      // Label
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(sector.label, radius - 40, 4);

      ctx.restore();
    });

    // Outer Glowing Ring Border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    ctx.restore();
  }, [isOpen, currentRotation, numSectors, sectorAngle]);

  if (!isOpen) return null;

  // Spin Wheel Physics Execution
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);

    soundFX.playPop();

    // Select random winning sector with weighted excitement
    const winningIndex = Math.floor(Math.random() * numSectors);
    const winningSector = SPIN_SECTORS[winningIndex];

    // Compute final angle so pointer at top (270 deg or -90 deg) lands in winning segment
    // Sector i spans [i * deg, (i+1) * deg]. Middle is (i + 0.5) * deg
    const sectorDeg = 360 / numSectors;
    const targetSectorCenterDeg = winningIndex * sectorDeg + sectorDeg / 2;
    // Pointer is at 270 deg (top). Wheel angle + targetSectorCenter = 270 => wheel angle = 270 - targetSectorCenter
    const targetDeg = (270 - targetSectorCenterDeg + 360) % 360;

    const fullRotations = 5 * 360; // 5 full fast spins
    const totalTargetRotation = currentRotation + fullRotations + targetDeg - (currentRotation % 360);

    const startTime = performance.now();
    const duration = 4200; // 4.2 seconds smooth deceleration

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease-out cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = currentRotation + (totalTargetRotation - currentRotation) * easeOut;

      setCurrentRotation(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Spin finished
        setIsSpinning(false);
        setWonReward(winningSector);
        setFreeSpinsLeft((prev) => Math.max(0, prev - 1));

        // Sound & FX
        soundFX.playLevelUp();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch {}

        // Apply Frame Reward
        if (winningSector.type === 'frame' && winningSector.frameId) {
          updateProfile({
            customAvatarFrameId: winningSector.frameId
          });
        }

        onRewardClaimed?.(winningSector);
      }
    };

    requestAnimationFrame(animateSpin);
  };

  return (
    <div
      id="lucky-spin-wheel-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="lucky-spin-modal-card"
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 border border-amber-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-amber-400/40 text-center space-y-5"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-30 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>EXCLUSIVE SPONSOR REWARD</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>Lucky Spin Wheel 🎡</span>
          </h3>
          <p className="text-xs text-slate-300">
            {language === 'si'
              ? 'වීඩියෝව නැරඹීම සම්පූර්ණයි! චක්‍රය කරකවා +200 XP දක්වා හෝ සුවිශේෂී Rare Avatar Frames දිනාගන්න.'
              : 'Spin for instant XP rewards or unlock ultra-rare sovereign avatar frames for your global rank identity!'}
          </p>
        </div>

        {/* Wheel Container with Pointer */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2">
          {/* Top Golden Needle Pointer */}
          <div className="relative z-20 -mb-5 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-[0_4px_8px_rgba(234,179,8,0.9)] animate-pulse" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-yellow-300 -mt-6" />
          </div>

          {/* Canvas Wheel */}
          <div className="relative p-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-purple-500/30 border-2 border-amber-500/50 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="rounded-full select-none cursor-pointer"
              onClick={handleSpin}
            />
          </div>
        </div>

        {/* Won Prize Announcement Banner */}
        {wonReward && (
          <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-2 border-amber-400 shadow-xl backdrop-blur-md space-y-2 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{wonReward.icon}</span>
              <h4 className="text-lg font-black text-amber-300">
                You Won: {wonReward.label}!
              </h4>
            </div>

            <p className="text-xs text-slate-200">
              {wonReward.type === 'xp'
                ? `⚡ ${wonReward.value} XP has been added to your profile and synced to the Global Leaderboard!`
                : `👑 Unlocked the rare "${wonReward.frameName}" and equipped it to your profile! (+50 XP Bonus)`}
            </p>

            {wonReward.type === 'frame' && (
              <div className="flex items-center justify-center pt-2">
                <AvatarFrameRenderer
                  avatarUrl={profile?.avatar}
                  name={profile?.name}
                  frameId={wonReward.frameId}
                  size="lg"
                  showTierTag={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {wonReward ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer active:scale-98"
            >
              🎉 Claim Reward & Return
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer disabled:opacity-50 transform hover:scale-102 active:scale-98"
            >
              {isSpinning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Spinning The Wheel...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>Spin The Wheel (Free 🎡)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
