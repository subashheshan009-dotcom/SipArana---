import React, { useState } from 'react';
import { Sparkles, Flame, Volume2, ChevronRight, GraduationCap, Heart } from 'lucide-react';
import kaviOwlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';

export interface KaviMascotProps {
  mood?: 'smart' | 'celebrating' | 'thinking' | 'encouraging' | 'reading';
  customMessage?: string;
  contextPage?: 'planner' | 'flashcards' | 'audio' | 'general';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showVoiceButton?: boolean;
  className?: string;
}

const CONTEXT_TIPS = {
  planner: {
    si: '🦉 කවි මෙහෙම කියනවා: දිනපතා එකම වේලාවක පාඩම් කිරීමෙන් මොළයේ ස්වයංක්‍රීය අවධානය 40% කින් වැඩි වෙනවා! Pomodoro විනාඩි 25 ක්‍රමය භාවිතා කරන්න.',
    ta: '🦉 கவி சொல்கிறது: தினமும் ஒரே நேரத்தில் படிப்பது உங்கள் கவனத்தை 40% அதிகரிக்கும்! Pomodoro 25 நிமிட முறையைப் பின்பற்றுங்கள்.',
    en: '🦉 Kavi says: Studying at consistent daily slots increases neural focus by 40%! Stick to your AI generated schedule blocks.'
  },
  flashcards: {
    si: '🦉 කවි මෙහෙම කියනවා: Spaced Repetition (ස්ථානගත ආවර්ජනය) මගින් කෙටි කාලීන මතකය දීර්ඝ කාලීන මතකයට හරවනවා. අපහසු කාඩ්පත් දින 3ක් පුරා නැවත බලන්න!',
    ta: '🦉 கவி சொல்கிறது: Spaced Repetition முறை மூலம் குறுகிய கால நினைவாற்றலை நீண்ட கால நினைவாற்றலாக மாற்றலாம். கடினமான அட்டைகளை 3 நாட்கள் திருப்புங்கள்!',
    en: '🦉 Kavi says: Spaced repetition locks concepts into long-term memory! Flip 15 cards every morning before theory classes.'
  },
  audio: {
    si: '🦉 කවි මෙහෙම කියනවා: බස් රථයේ ගමන් කරන විට හෝ විවේක ගන්නා විට මෙම Audio Summaries වලට සවන් දෙන්න. නින්දට පෙර අසන සටහන් මතකයේ තදින් රැඳේ!',
    ta: '🦉 கவி சொல்கிறது: பயணம் செய்யும் போதோ ஓய்வெடுக்கும் போதோ இந்த ஆடியோ சுருக்கங்களைக் கேளுங்கள். உறங்குவதற்கு முன் கேட்பது நினைவில் ஆழமாகப் பதியும்!',
    en: '🦉 Kavi says: Listen to audio summaries during daily commutes or before sleep to trigger subconscious memory consolidation!'
  },
  general: {
    si: '🦉 ආයුබෝවන්! මම ඔයාගේ AI Study Buddy "කවි" බකමූණා! අමාරුම විෂය සංකල්ප පහසුවෙන් ජයගමු!',
    ta: '🦉 வணக்கம்! நான் உங்கள் AI படிப்புத் தோழன் "கவி" ஆந்தை! கடினமான பாடங்களை ஒன்றாக வெல்வோம்!',
    en: '🦉 Hoot! I am Kavi, your smart AI Owl study buddy! Let us conquer your exam syllabus together!'
  }
};

export default function KaviMascot({
  mood = 'smart',
  customMessage,
  contextPage = 'general',
  size = 'md',
  showVoiceButton = true,
  className = ''
}: KaviMascotProps) {
  const { language } = useLanguage();
  const [isWiggling, setIsWiggling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highFiveCount, setHighFiveCount] = useState(0);

  const activeMessage =
    customMessage ||
    CONTEXT_TIPS[contextPage]?.[language] ||
    CONTEXT_TIPS.general[language];

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    hero: 'w-28 h-28 sm:w-36 sm:h-36'
  };

  const handleMascotClick = () => {
    setIsWiggling(true);
    setHighFiveCount(prev => prev + 1);
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8, x: 0.5 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => setIsWiggling(false), 600);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeMessage.replace(/🦉/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.1;

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

  return (
    <div
      id="kavi-owl-mascot-banner"
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 dark:from-amber-950/20 dark:via-indigo-950/30 dark:to-blue-950/20 border border-amber-300/40 dark:border-amber-500/30 shadow-sm relative backdrop-blur-sm ${className}`}
    >
      {/* 3D Owl Mascot Avatar */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <button
          type="button"
          onClick={handleMascotClick}
          className={`group relative ${sizeClasses[size]} rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-indigo-600 p-1 shadow-lg border-2 border-amber-300/80 transition-all duration-300 transform hover:scale-105 hover:-rotate-2 cursor-pointer ${
            isWiggling ? 'scale-110 rotate-6 ring-4 ring-amber-300' : ''
          }`}
          title="Click Kavi Owl for a high-five and lucky study motivation!"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900 shadow-inner">
            <img
              src={kaviOwlAvatar}
              alt="Kavi the Smart Owl Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating mini badge */}
          <span className="absolute -bottom-2 -right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shadow-md border border-white dark:border-slate-900 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-950" />
            <span>Kavi AI</span>
          </span>
        </button>
      </div>

      {/* Speech Box */}
      <div className="flex-1 space-y-1.5 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-black uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>
                {language === 'si' ? 'කවි බකමූණු මඟපෙන්වීම' : language === 'ta' ? 'கவி ஆந்தை வழிகாட்டல்' : 'Kavi Study Buddy Tips'}
              </span>
            </span>
            {highFiveCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-pink-600 dark:text-pink-400 font-bold">
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                {highFiveCount} High-Fives!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showVoiceButton && (
              <button
                type="button"
                onClick={handleSpeak}
                className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                  isSpeaking
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
                title="Voice read study tip"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px]">
                  {isSpeaking ? 'Stop Voice' : 'Listen'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={handleMascotClick}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center"
            >
              <span>High-Five</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {activeMessage}
        </p>
      </div>
    </div>
  );
}
