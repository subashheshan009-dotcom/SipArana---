import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Award, MessageCircle, Volume2, Lightbulb, ChevronRight, Zap } from 'lucide-react';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { soundFX } from '@/utils/audioUtils';

export interface AranaMascotProps {
  mood?: 'happy' | 'celebrating' | 'thinking' | 'encouraging';
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showBadge?: boolean;
  interactive?: boolean;
  onMascotClick?: () => void;
  className?: string;
}

const STUDY_TIPS_SINHALA = [
  'හේයි යාලුවා! 🌟 දිනපතා විනාඩි 20ක් පසුගිය ප්‍රශ්න පත්‍ර (Past Papers) පුහුණු වීමෙන් විභාග ලකුණු 30% කින් ඉහළ නංවාගත හැකියි!',
  'නොතේරෙන සිද්ධාන්ත තියෙනවාද? 🤖 අපේ SipArana AI ගුරුතුමාගෙන් ඕනෑම වේලාවක සිංහලෙන් අහන්න!',
  'විශිෂ්ටයි! 🚀 අද දිනයේ පාඩම් ඉලක්ක සම්පූර්ණ කර රන් පදක්කම් (Gold Badges) සහ XP උපයාගන්න!',
  'විවේකයක් ගන්න මතක තබාගන්න ☕ සෑම විනාඩි 45ක පාඩමකට පසු විනාඩි 5ක විවේකයක් ඔබේ මතක ශක්තිය වැඩි කරයි!',
  'ගණිතය සහ විද්‍යාව කෙටි සටහන් (Short Notes) ආවර්ජනය කිරීමට Notes අංශයට පිවිසෙන්න!'
];

export default function AranaMascot({
  mood = 'happy',
  message,
  size = 'md',
  showBadge = true,
  interactive = true,
  onMascotClick,
  className = ''
}: AranaMascotProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    hero: 'w-36 h-36 sm:w-44 sm:h-44'
  };

  const handleMascotInteraction = () => {
    setIsWiggling(true);
    soundFX.playCorrect();
    setTipIndex((prev) => (prev + 1) % STUDY_TIPS_SINHALA.length);
    if (onMascotClick) onMascotClick();
    setTimeout(() => setIsWiggling(false), 500);
  };

  const displayMessage = message || STUDY_TIPS_SINHALA[tipIndex];

  return (
    <div className={`flex items-start sm:items-center gap-4 ${className}`}>
      {/* Mascot 3D Character Avatar Container */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={interactive ? handleMascotInteraction : undefined}
          className={`relative ${sizeMap[size]} rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 p-1 shadow-[0_6px_0_0_#b45309] border-2 border-amber-300 flex items-center justify-center transition-all duration-300 ${
            interactive ? 'cursor-pointer hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_#b45309]' : ''
          } ${isWiggling ? 'animate-bounce' : ''}`}
          title="අරණ මාස්කොට් සමඟ කතා කරන්න (Click for study advice)"
        >
          {/* Inner 3D character image */}
          <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
            <img
              src={mascotImage}
              alt="SipArana 3D Mascot Character"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </button>

        {/* Small floating status badge */}
        {showBadge && (
          <div className="absolute -bottom-2 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
            <span>Arana AI</span>
          </div>
        )}
      </div>

      {/* Speech Bubble / Mentor Tip Box */}
      <div className="relative flex-1 bg-white dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-500/40 p-3.5 sm:p-4 rounded-2xl shadow-[0_5px_0_0_#fcd34d] dark:shadow-[0_5px_0_0_#78350f] transition-all">
        {/* Speech bubble pointer triangle */}
        <div className="absolute -left-2 top-5 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-l-2 border-b-2 border-amber-300/80 dark:border-amber-500/40 transform rotate-45" />

        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>අරණ ගුරු මාස්කොට් (Arana Study Buddy)</span>
          </div>

          {interactive && (
            <button
              type="button"
              onClick={handleMascotInteraction}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-amber-600 flex items-center gap-1 transition"
            >
              <span>ඊළඟ උපදෙස</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
          {displayMessage}
        </p>

        {interactive && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>මාස්කොට් මත ක්ලික් කර නව උපදෙස් ලබාගන්න</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-amber-500" /> +15 XP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
