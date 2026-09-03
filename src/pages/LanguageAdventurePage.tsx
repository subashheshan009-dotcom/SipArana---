import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  PenTool,
  BookOpen,
  Trophy,
  Flame,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Smile,
  CheckCircle2,
  HelpCircle,
  Clock,
  Radio,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

import TimeAmbienceBackdrop, { TimePeriod } from '@/components/languageAdventure/TimeAmbienceBackdrop';
import SpeakingSection from '@/components/languageAdventure/SpeakingSection';
import WritingSection from '@/components/languageAdventure/WritingSection';
import ReadingSection from '@/components/languageAdventure/ReadingSection';
import AdventureTrophyCabinet from '@/components/languageAdventure/AdventureTrophyCabinet';
import owlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';

interface LanguageAdventurePageProps {
  onNavigate?: (page: string) => void;
}

const BADGES_STORAGE_KEY = 'siparana_adventure_unlocked_badges_v1';
const STREAK_STORAGE_KEY = 'siparana_adventure_streak_days_v1';

export default function LanguageAdventurePage({ onNavigate }: LanguageAdventurePageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // Active Main Section Tab
  const [activeSection, setActiveSection] = useState<'speaking' | 'writing' | 'reading' | 'trophies'>('speaking');

  // Automatic Time of Day determination
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'sunset';
    return 'night';
  });

  // Gamification Streak & Badges state
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 7;
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BADGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['badge_speech_star', 'badge_writing_wizard', 'badge_story_explorer'];
  });

  const [recentXPEarned, setRecentXPEarned] = useState<number | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Welcome to the Language Adventure! Choose Speaking, Writing, or Reading to level up your linguistic brilliance! 🦉'
  );

  // Live Learners Pulse count simulation
  const [liveLearners, setLiveLearners] = useState(1482);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLearners(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle XP earning (Stubbed for strict fair XP policy)
  const handleEarnXP = (_amount: number) => {
    // Controlled: XP restricted to Daily Attendance, Rewarded Ads, and 5-min Study Time
  };

  // Handle Unlocking Badges
  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      const next = [...unlockedBadges, badgeId];
      setUnlockedBadges(next);
      try {
        localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      soundFX.playLevelUp();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Dynamic Sun/Moon Time of Day Ambient Backdrop */}
      <TimeAmbienceBackdrop
        activeTime={timePeriod}
        onSelectTime={setTimePeriod}
        liveLearnersCount={liveLearners}
      />

      {/* 2. Top Bar: Streak Counter & Kavi Mascot Guidance Bubble */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Kavi Mascot Interactive Cheer */}
        <div className="flex items-center gap-3.5 flex-1">
          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => soundFX.playPop()}>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md ring-2 ring-indigo-400/20">
              <img
                src={owlAvatar}
                alt="Kavi Owl"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 text-xs">🦉</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-cyan-400 tracking-wider">
              Kavi's Adventure Cheer:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {mascotMessage}
            </p>
          </div>
        </div>

        {/* Gamified Streak & XP Badges */}
        <div className="flex items-center gap-3 justify-end flex-shrink-0">
          {/* Daily Streak Flame */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 shadow-xs">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-bounce" />
            <div>
              <span className="text-[9px] uppercase font-black text-orange-600 dark:text-orange-400 block">
                Daily Adventure Streak
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {streakDays} Days 🔥
              </span>
            </div>
          </div>

          {/* XP Badge Alert */}
          {recentXPEarned && (
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-lg animate-in zoom-in flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>+{recentXPEarned} XP Earned!</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Section Navigation Cards (Speaking, Writing, Reading, Trophies) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Tab 1: Speaking */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setActiveSection('speaking');
            setMascotMessage('Ready to speak with clarity? Click the glowing mic and let your voice soar! 🎙️');
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all text-left flex flex-col justify-between select-none cursor-pointer ${
            activeSection === 'speaking'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-400 shadow-xl ring-4 ring-blue-400/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🎙️</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeSection === 'speaking'
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              }`}
            >
              VOICE MENTOR
            </span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight">Speaking (කතා කරන)</h3>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${activeSection === 'speaking' ? 'text-blue-100' : 'text-slate-500'}`}>
              Pronunciation & AI Voice Chat
            </p>
          </div>
        </button>

        {/* Tab 2: Writing */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setActiveSection('writing');
            setMascotMessage('Dip your quill into glowing ink! Express your creative thoughts on the parchment. ✍️');
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all text-left flex flex-col justify-between select-none cursor-pointer ${
            activeSection === 'writing'
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400 shadow-xl ring-4 ring-purple-400/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">✍️</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeSection === 'writing'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              }`}
            >
              INKWELL SCROLL
            </span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight">Writing (ලියන)</h3>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${activeSection === 'writing' ? 'text-purple-100' : 'text-slate-500'}`}>
              Parchment & Grammar Wizard
            </p>
          </div>
        </button>

        {/* Tab 3: Reading */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setActiveSection('reading');
            setMascotMessage('Open the ancient illustrated scrolls! Listen to narration and test your wisdom. 📖');
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all text-left flex flex-col justify-between select-none cursor-pointer ${
            activeSection === 'reading'
              ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-xl ring-4 ring-emerald-400/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📖</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeSection === 'reading'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              ILLUSTRATED TALES
            </span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight">Reading (කියවන)</h3>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${activeSection === 'reading' ? 'text-emerald-100' : 'text-slate-500'}`}>
              TTS Stories & Word Meanings
            </p>
          </div>
        </button>

        {/* Tab 4: Trophies */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setActiveSection('trophies');
            setMascotMessage('Behold your honors! Study consistently to claim the Legendary Polyglot Master trophy. 🏆');
          }}
          className={`p-4 sm:p-5 rounded-3xl border transition-all text-left flex flex-col justify-between select-none cursor-pointer ${
            activeSection === 'trophies'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400 shadow-xl ring-4 ring-amber-400/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🏆</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeSection === 'trophies'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}
            >
              CABINET & RANKS
            </span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight">Trophy Cabinet (කුසලාන)</h3>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${activeSection === 'trophies' ? 'text-amber-100' : 'text-slate-500'}`}>
              Badges & Live Leaderboard
            </p>
          </div>
        </button>
      </div>

      {/* 4. Active Section Component */}
      <div>
        {activeSection === 'speaking' && (
          <SpeakingSection onEarnXP={handleEarnXP} onUnlockBadge={handleUnlockBadge} />
        )}
        {activeSection === 'writing' && (
          <WritingSection onEarnXP={handleEarnXP} onUnlockBadge={handleUnlockBadge} />
        )}
        {activeSection === 'reading' && (
          <ReadingSection onEarnXP={handleEarnXP} onUnlockBadge={handleUnlockBadge} />
        )}
        {activeSection === 'trophies' && (
          <AdventureTrophyCabinet unlockedBadgeIds={unlockedBadges} />
        )}
      </div>
    </div>
  );
}
