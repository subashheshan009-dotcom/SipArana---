import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Zap, Award, Volume2, Smile, Moon, Coffee, RefreshCw, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

export interface KaviPetState {
  level: number;
  xp: number;
  xpToNext: number;
  happiness: number; // 0 - 100
  energy: number; // 0 - 100
  title: string;
  totalPats: number;
  berriesFed: number;
  lastUpdatedDate: string;
}

const DEFAULT_PET_STATE: KaviPetState = {
  level: 3,
  xp: 340,
  xpToNext: 500,
  happiness: 92,
  energy: 85,
  title: 'Sage Owl (ප්‍රඥාවන්ත බකමූණා)',
  totalPats: 24,
  berriesFed: 12,
  lastUpdatedDate: new Date().toISOString().split('T')[0]
};

const PET_STORAGE_KEY = 'siparana_kavi_study_pet_state_v1';

const KAVI_TIPS = {
  si: [
    'දිනපතා එකම වේලාවක විනාඩි 25ක් නොකඩවා පාඩම් කිරීමෙන් මතක ශක්තිය 40%කින් වැඩි වෙනවා!',
    'විභාග ප්‍රශ්න පත්‍ර කිරීමට පෙර පසුගිය වසර 5 ප්‍රශ්න වල ප්‍රධාන සංකල්ප සටහන් කරගන්න.',
    'සංකීර්ණ සූත්‍ර හෝ කරුණු මතක තබා ගැනීමට කෙටි මතක වැකි (Mnemonics) භාවිතා කරන්න.',
    'නින්දට යාමට මිනිත්තු 30කට පෙර දුරකථනය පසෙකලා කෙටි සාරාංශ සටහන් කියවීම මතකය තහවුරු කරයි.',
    'MCQ ප්‍රශ්න වල වැරදුණු කරුණු සඳහා වෙනම "වැරදි සටහන් පොතක්" පවත්වාගෙන යන්න.'
  ],
  ta: [
    'தினமும் 25 நிமிடங்கள் தொடர்ச்சியாகப் படிப்பது உங்கள் நினைவாற்றலை 40% அதிகரிக்கும்!',
    'கடந்த கால வினாத்தாள்களைச் செய்வதற்கு முன் முக்கிய கருத்துக்களைக் குறிப்பெடுங்கள்.',
    'சூத்திரங்களை நினைவில் வைத்திருக்க குறுக்கு வழிகளை (Mnemonics) பயன்படுத்துங்கள்.',
    'தூங்குவதற்கு முன் சிறிய சுருக்கக் குறிப்புகளைப் படிப்பது நீண்ட கால நினைவுக்கு உதவும்.'
  ],
  en: [
    'Studying in focused 25-minute Pomodoro sprints increases neural memory consolidation by 40%!',
    'Active recall + Spaced repetition beats passive re-reading every single time. Try testing yourself now!',
    'Keep a dedicated "Mistake Log" for missed MCQ questions to guarantee you never repeat an error.',
    'Review high-yield mind maps right before sleeping to let subconscious brain processing lock in concepts.'
  ]
};

interface KaviStudyPetWidgetProps {
  externalMood?: 'happy' | 'encouraging' | 'celebrating' | 'sleepy' | 'smart';
  onQuickStudy?: () => void;
}

export default function KaviStudyPetWidget({ externalMood, onQuickStudy }: KaviStudyPetWidgetProps) {
  const { language } = useLanguage();
  const [petState, setPetState] = useState<KaviPetState>(() => {
    try {
      const saved = localStorage.getItem(PET_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PET_STATE;
  });

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(petState));
    } catch {
      // ignore
    }
  }, [petState]);

  // Determine current mood
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 5;

  let currentMood: 'happy' | 'encouraging' | 'celebrating' | 'sleepy' | 'smart' = 'smart';
  if (externalMood) {
    currentMood = externalMood;
  } else if (isNightTime && petState.energy < 40) {
    currentMood = 'sleepy';
  } else if (petState.happiness >= 85) {
    currentMood = 'happy';
  }

  // Active tip text
  const tipsArray = KAVI_TIPS[language] || KAVI_TIPS.en;
  const currentTip = tipsArray[activeTipIndex % tipsArray.length];

  // Actions
  const handlePetKavi = () => {
    soundFX.playPetInteract();
    setIsWiggling(true);
    setHeartAnim(true);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6, x: 0.3 }
      });
    } catch {
      // ignore
    }

    setPetState(prev => {
      const nextHappiness = Math.min(100, prev.happiness + 6);
      const nextXp = prev.xp + 10;
      let nextLevel = prev.level;
      let nextXpToNext = prev.xpToNext;

      if (nextXp >= prev.xpToNext) {
        nextLevel += 1;
        nextXpToNext += 250;
        soundFX.playLevelUp();
      }

      return {
        ...prev,
        happiness: nextHappiness,
        xp: nextXp,
        level: nextLevel,
        xpToNext: nextXpToNext,
        totalPats: prev.totalPats + 1
      };
    });

    setTimeout(() => {
      setIsWiggling(false);
      setHeartAnim(false);
    }, 600);
  };

  const handleFeedBerry = () => {
    soundFX.playCorrect();
    setIsWiggling(true);

    setPetState(prev => {
      const nextEnergy = Math.min(100, prev.energy + 15);
      const nextHappiness = Math.min(100, prev.happiness + 8);
      const nextXp = prev.xp + 15;
      let nextLevel = prev.level;
      let nextXpToNext = prev.xpToNext;

      if (nextXp >= prev.xpToNext) {
        nextLevel += 1;
        nextXpToNext += 250;
        soundFX.playLevelUp();
      }

      return {
        ...prev,
        energy: nextEnergy,
        happiness: nextHappiness,
        xp: nextXp,
        level: nextLevel,
        xpToNext: nextXpToNext,
        berriesFed: prev.berriesFed + 1
      };
    });

    setTimeout(() => setIsWiggling(false), 500);
  };

  const handleNextTip = () => {
    soundFX.playClick();
    setActiveTipIndex(prev => prev + 1);
  };

  const handleSpeakTip = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentTip);
      utterance.rate = 1.0;
      utterance.pitch = 1.15;
      if (language === 'si') {
        utterance.lang = 'si-LK';
      } else if (language === 'ta') {
        utterance.lang = 'ta-LK';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get avatar expression based on mood
  const getOwlVisual = () => {
    if (currentMood === 'sleepy') {
      return (
        <div className="relative flex items-center justify-center">
          <span className="text-4xl sm:text-5xl select-none animate-bounce">🦉</span>
          <span className="absolute -top-1 -right-2 text-xs font-black text-blue-400 animate-pulse">Zzz...</span>
          <div className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-slate-900/80 text-[9px] font-black text-amber-300 border border-amber-400/40">
            🌙 Snoozing
          </div>
        </div>
      );
    }
    if (currentMood === 'celebrating') {
      return (
        <div className="relative flex items-center justify-center">
          <span className="text-4xl sm:text-5xl select-none">🦉</span>
          <span className="absolute -top-3 text-lg animate-spin">🎉</span>
          <span className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-[9px] font-black text-white shadow-xs">
            ⭐ Super Star!
          </span>
        </div>
      );
    }
    if (currentMood === 'encouraging') {
      return (
        <div className="relative flex items-center justify-center">
          <span className="text-4xl sm:text-5xl select-none">🦉</span>
          <span className="absolute -top-2 -right-1 text-sm">💡</span>
          <div className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-[9px] font-black text-white">
            💪 Keep Going!
          </div>
        </div>
      );
    }
    // Happy / Smart Default
    return (
      <div className="relative flex items-center justify-center">
        <span className="text-4xl sm:text-5xl select-none transition-transform hover:scale-110">🦉</span>
        <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
        <div className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-[9px] font-black text-white shadow-xs">
          ⚡ Energized
        </div>
      </div>
    );
  };

  const levelProgressPercent = Math.min(100, Math.round((petState.xp / petState.xpToNext) * 100));

  return (
    <section
      id="kavi-study-pet-widget"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 dark:from-amber-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border-2 border-amber-300/60 dark:border-amber-700/60 shadow-lg backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:border-amber-400"
    >
      {/* Background soft ambient glowing circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Pet Character & Stats */}
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          <div
            onClick={handlePetKavi}
            className={`cursor-pointer group relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-amber-400/30 via-orange-400/20 to-purple-500/30 dark:from-amber-900/50 dark:to-purple-900/50 border-2 border-amber-300/80 dark:border-amber-500/60 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-amber-500/20 ${
              isWiggling ? 'animate-bounce scale-110' : ''
            }`}
            title="Tap to Pet Kavi the Owl (+10 XP & Happiness!)"
          >
            {getOwlVisual()}

            {heartAnim && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              </div>
            )}
          </div>

          {/* Pet info & levels */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Level {petState.level} Companion
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Kavi the Scholar Owl 🦉
              </span>
            </div>

            {/* Happiness & Energy Bars */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* Happiness */}
              <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-900/70 border border-rose-200 dark:border-rose-900/50 px-2 py-0.5 rounded-lg text-[10.5px]">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Happiness</span>
                <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${petState.happiness}%` }}
                  />
                </div>
                <span className="text-[9.5px] font-black text-rose-600 dark:text-rose-400">{petState.happiness}%</span>
              </div>

              {/* Energy */}
              <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-900/70 border border-amber-200 dark:border-amber-900/50 px-2 py-0.5 rounded-lg text-[10.5px]">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Energy</span>
                <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${petState.energy}%` }}
                  />
                </div>
                <span className="text-[9.5px] font-black text-amber-600 dark:text-amber-400">{petState.energy}%</span>
              </div>
            </div>

            {/* Level XP Bar */}
            <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300">
              <span className="font-semibold">XP: {petState.xp} / {petState.xpToNext}</span>
              <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <span className="font-black text-purple-600 dark:text-purple-400">{levelProgressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Speech Bubble & Interactive Care buttons */}
        <div className="flex-1 max-w-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1">
                💬 Kavi's High-Yield Study Tip
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSpeakTip}
                className={`p-1.5 rounded-lg border transition ${
                  isSpeaking
                    ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Listen to Kavi read this tip aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextTip}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
                title="Get another tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            "{currentTip}"
          </p>

          {/* Quick Pet Care Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 relative z-20 pointer-events-auto">
            <button
              type="button"
              id="kavi-pet-btn"
              onClick={handlePetKavi}
              className="min-h-[40px] sm:min-h-[34px] px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Pet Kavi (+10 XP)</span>
            </button>

            <button
              type="button"
              id="kavi-feed-btn"
              onClick={handleFeedBerry}
              className="min-h-[40px] sm:min-h-[34px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs sm:text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Feed Berry (+15 Energy)</span>
            </button>

            {onQuickStudy && (
              <button
                type="button"
                onClick={onQuickStudy}
                className="ml-auto min-h-[40px] sm:min-h-[34px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-[11px] font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition cursor-pointer active:scale-95 touch-manipulation"
              >
                <span>Start 25m Focus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
