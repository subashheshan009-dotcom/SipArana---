import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CloudRain,
  Music,
  TreePine,
  Brain,
  Zap,
  CheckCircle2,
  Sliders,
  Flame,
  Award
} from 'lucide-react';
import { soundFX, ambientSound, AmbientSoundType } from '@/utils/audioUtils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';

interface FocusZoneWidgetProps {
  onSessionComplete?: () => void;
}

export default function FocusZoneWidget({ onSessionComplete }: FocusZoneWidgetProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // Timer states (in seconds)
  const [selectedDuration, setSelectedDuration] = useState<number>(25 * 60); // 25 min default
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(2);

  // Sound generator states
  const [ambientType, setAmbientType] = useState<AmbientSoundType>('rain');
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.6);

  // Interval Ref
  const timerRef = useRef<number | null>(null);

  // Timer countdown effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  const handleToggleTimer = () => {
    soundFX.playClick();
    if (!isActive) {
      setIsActive(true);
      setIsCompleted(false);
      // Auto start sound if not already playing
      if (!isSoundPlaying && ambientType !== 'off') {
        ambientSound.setVolume(volume);
        ambientSound.play(ambientType);
        setIsSoundPlaying(true);
      }
    } else {
      setIsActive(false);
    }
  };

  const handleResetTimer = () => {
    soundFX.playClick();
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setIsCompleted(false);
  };

  const handleSelectPreset = (minutes: number) => {
    soundFX.playClick();
    setIsActive(false);
    setSelectedDuration(minutes * 60);
    setTimeLeft(minutes * 60);
    setIsCompleted(false);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    setIsCompleted(true);
    soundFX.playLevelUp();
    setSessionsCompletedToday(prev => prev + 1);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6, x: 0.5 }
      });
    } catch {
      // ignore
    }

    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  // Sound controls
  const handleToggleSound = (type: AmbientSoundType) => {
    soundFX.playClick();
    if (ambientType === type && isSoundPlaying) {
      ambientSound.stop();
      setIsSoundPlaying(false);
    } else {
      setAmbientType(type);
      ambientSound.setVolume(volume);
      ambientSound.play(type);
      setIsSoundPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientSound.setVolume(val);
  };

  // Calculate Progress Percent
  const progressPercent = Math.round(((selectedDuration - timeLeft) / selectedDuration) * 100);

  // Minutes and seconds format
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <section
      id="focus-study-zone-widget"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 shadow-2xl text-white p-5 sm:p-6 space-y-5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>{language === 'si' ? 'අවධානය යොමු කිරීමේ කලාපය' : 'Focus Study Zone & Lo-Fi Beats'}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                POMODORO
              </span>
            </h3>
            <p className="text-xs text-indigo-200/80">
              {language === 'si' ? 'විනාඩි 25ක සන්සුන් සංගීතය සමඟ ගැඹුරු අධ්‍යයනය (+100 XP)' : '25-minute deep focus sprints with procedural ambient sounds (+100 XP)'}
            </p>
          </div>
        </div>

        {/* Sessions badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-amber-300 font-bold">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{sessionsCompletedToday} Sessions Done Today</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Col: Timer Display & Presets */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-center">
          {/* Duration Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: '25m Focus', mins: 25 },
              { label: '50m Deep', mins: 50 },
              { label: '5m Break', mins: 5 }
            ].map(p => (
              <button
                key={p.mins}
                type="button"
                onClick={() => handleSelectPreset(p.mins)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedDuration === p.mins * 60
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Big Circular Ring / Digital Display */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                className="text-indigo-400 transition-all duration-1000"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-white drop-shadow-md">
                {timeFormatted}
              </span>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                {isActive ? 'Deep Focusing...' : isCompleted ? 'Completed!' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Play/Pause & Reset Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="focus-play-pause-btn"
              onClick={handleToggleTimer}
              className={`px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition transform hover:scale-105 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="focus-reset-btn"
              onClick={handleResetTimer}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Col: Ambient Sound Generator & Synthesizer */}
        <div className="lg:col-span-6 space-y-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              Ambient Sound Generator (Web Audio API)
            </span>
            {isSoundPlaying && (
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Audio Active
              </span>
            )}
          </div>

          {/* Sound selection pills */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'rain', icon: CloudRain, title: '🌧️ Gentle Rain', desc: 'Soft rainfall pink noise' },
              { id: 'lofi', icon: Music, title: '🎵 Lo-Fi Beats', desc: 'Warm chord progression' },
              { id: 'forest', icon: TreePine, title: '🌲 Nature Birds', desc: 'Forest breeze & chirps' },
              { id: 'deepFocus', icon: Brain, title: '🧠 40Hz Gamma', desc: 'Deep focus binaural' }
            ].map(snd => {
              const isSelected = ambientType === snd.id && isSoundPlaying;
              return (
                <button
                  key={snd.id}
                  type="button"
                  onClick={() => handleToggleSound(snd.id as AmbientSoundType)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/60 to-purple-600/60 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/40'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{snd.title}</span>
                    {isSelected ? (
                      <Volume2 className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{snd.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 pt-2">
            <Volume2 className="w-4 h-4 text-indigo-300 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-indigo-400 bg-white/20 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-indigo-300 w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
