import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Heart, Smile, Volume2, Crown, Bot, Trophy, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import kaviOwlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import type { PageId } from '@/components/Layout';

interface MascotProps {
  trigger?: boolean;
  onNavigate?: (page: PageId) => void;
}

interface MascotMessage {
  si: string;
  ta: string;
  en: string;
}

const MOTIVATION_MESSAGES: MascotMessage[] = [
  {
    si: '🦉 කවි: සුබ පැතුම්! අද දවසේ ඔයාගේ පාඩම් ඉලක්කය සපුරාගන්න පුළුවන්!',
    ta: '🦉 கவி: வாழ்த்துகள்! இன்றைய படிப்பு இலக்கை உங்களால் எளிதாக அடைய முடியும்!',
    en: '🦉 Kavi: Great job! Keep the momentum going for today\'s study goal!'
  },
  {
    si: '🦉 කවි: උත්සාහය අත්හරින්න එපා! හැම අමාරු ගණනක්ම විසඳන්න ක්‍රමයක් තියෙනවා.',
    ta: '🦉 கவி: முயற்சியைக் கைவிடாதீர்கள்! கடினமான ஒவ்வொரு கேள்விக்கும் ஒரு தீர்வு உண்டு.',
    en: '🦉 Kavi: Never give up! Every tough problem has a structured solution.'
  },
  {
    si: '🦉 කවි: A/L සහ O/L විභාග ජයගන්න දිනපතා පුහුණුව තමයි එකම රහස!',
    ta: '🦉 கவி: A/L மற்றும் O/L தேர்வுகளில் வெல்ல தினசரி தொடர் பயிற்சியே சிறந்த வழி!',
    en: '🦉 Kavi: Daily consistent practice is the only secret to Island Top Ranks!'
  },
  {
    si: '🦉 කවි: විනාඩි 25ක් පාඩම් කරලා විනාඩි 5ක විවේකයක් ගන්න (Pomodoro ක්‍රමය)!',
    ta: '🦉 கவி: 25 நிமிடங்கள் படித்து 5 நிமிடங்கள் ஓய்வெடுங்கள் (Pomodoro முறை)!',
    en: '🦉 Kavi: Study for 25 mins, take a 5 min break for maximum retention!'
  },
  {
    si: '🦉 කවි: Smart Flashcards සහ Past Papers මගින් Z-Score එක වේගයෙන් ඉහළ නංවාගන්න!',
    ta: '🦉 கவி: Smart Flashcards மற்றும் Past Papers மூலம் Z-புள்ளியை உயர்த்துங்கள்!',
    en: '🦉 Kavi: Boost your Z-Score with Smart Flashcards and systematic Past Paper drill!'
  },
  {
    si: '🦉 කවි: AI ගුරු සහකාර (AI Tutor) මගින් අපැහැදිලි සිද්ධාන්ත තත්පරයෙන් නිරවුල් කරගන්න!',
    ta: '🦉 கவி: AI ஆசிரியர் மூலம் கடினமான பாடக் கருத்துகளை நொடிகளில் தெளிவுபடுத்திக் கொள்ளுங்கள்!',
    en: '🦉 Kavi: Clarify tough syllabus theories and derivations instantly with your 24/7 AI Tutor!'
  }
];

export default function Mascot({ trigger, onNavigate }: MascotProps) {
  const { language, tText } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [, setHeartsCount] = useState(0);

  useEffect(() => {
    if (trigger) {
      handleHighFive();
    }
  }, [trigger]);

  const handleHighFive = () => {
    soundFX.playPop();
    setIsHighFiving(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85, x: 0.9 }
      });
    } catch {
      // safe fallback
    }
    setHeartsCount(prev => prev + 1);
    setTimeout(() => setIsHighFiving(false), 800);
  };

  const handleCrownClick = () => {
    soundFX.playCorrect();
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.85, x: 0.92 }
      });
    } catch {}
    if (onNavigate) {
      onNavigate('key_players');
    }
  };

  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % MOTIVATION_MESSAGES.length);
  };

  const currentMsg = MOTIVATION_MESSAGES[messageIndex];
  const primaryText = tText(currentMsg, currentMsg.en);

  const mascotTitle = language === 'si'
    ? 'කවි (Kavi Owl AI Buddy)'
    : language === 'ta'
    ? 'கவி (Kavi Owl AI தோழன்)'
    : 'Kavi the Smart Owl AI';

  const nextTipText = language === 'si'
    ? 'තව උපදෙසක්'
    : language === 'ta'
    ? 'அடுத்த குறிப்பு'
    : 'Next Study Tip';

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(primaryText.replace(/🦉/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="siparana-mascot-container" className="fixed bottom-[78px] right-2.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 max-w-[calc(100vw-1.5rem)] pointer-events-none transition-all duration-300 select-none">
      {/* Speech bubble for Kavi Owl AI Assistant */}
      {isOpen && (
        <div
          id="mascot-speech-bubble"
          className="pointer-events-auto mb-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900/95 border border-amber-400/60 p-3.5 sm:p-4 rounded-3xl shadow-2xl text-xs space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ring-2 ring-amber-400/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Bot className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="truncate">{mascotTitle}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition cursor-pointer touch-manipulation"
                title="Listen to Kavi speak"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="mascot-close-btn"
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg cursor-pointer touch-manipulation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-slate-800 dark:text-slate-100 font-semibold leading-relaxed text-[12px] sm:text-[13px] break-words">
            "{primaryText}"
          </p>

          <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              id="mascot-next-msg-btn"
              type="button"
              onClick={nextMessage}
              className="text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center gap-1 cursor-pointer truncate touch-manipulation"
            >
              <Smile className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{nextTipText}</span>
            </button>
            <button
              id="mascot-highfive-btn"
              type="button"
              onClick={handleHighFive}
              className="bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 whitespace-nowrap shadow-xs cursor-pointer flex-shrink-0 active:scale-95 touch-manipulation"
            >
              ✋ High Five! (+15 XP)
            </button>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onNavigate('ai_tutor');
              }}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-blue-200/60 dark:border-blue-800/60 active:scale-95 touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{language === 'si' ? 'AI ගුරු සහකාර වෙත යන්න' : 'Open 24/7 AI Tutor'}</span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* 1. SEPARATED GOLD CROWN BADGE DIRECT LINK TO KEY PLAYERS */}
      <div className="pointer-events-auto relative group flex items-center justify-end">
        {/* Floating tooltip on hover */}
        <div className="absolute right-full mr-2.5 px-3 py-1 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-amber-300 text-[11px] font-extrabold whitespace-nowrap shadow-xl border border-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span>Key Players (Top 50 Leaderboard)</span>
        </div>

        <button
          id="key-players-crown-badge-btn"
          type="button"
          onClick={handleCrownClick}
          className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/30 border-2 border-amber-200 dark:border-yellow-200 transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ring-2 ring-amber-400/50 hover:ring-amber-300 group-hover:rotate-6 touch-manipulation pointer-events-auto"
          title="Click to view Key Players & Top 50 Achievers Leaderboard"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-60 blur-xs animate-pulse -z-10" />

          {/* Golden Crown Icon */}
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-950/90 text-amber-950 filter drop-shadow-xs" />

          {/* Mini 'TOP 50' Tag */}
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 font-black text-[8px] tracking-tighter border border-amber-400/80 shadow-md">
            TOP 50
          </span>
        </button>
      </div>

      {/* 2. OWL MASCOT STRICTLY FOR AI ASSISTANT / CHAT MOTIVATION */}
      <div className="pointer-events-auto relative group">
        {/* Floating High Five Reaction */}
        {isHighFiving && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-bold bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1 z-50">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> +15 XP!
          </div>
        )}

        <button
          id="siparana-mascot-avatar-btn"
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) nextMessage();
          }}
          className={`relative p-1 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer touch-manipulation pointer-events-auto ${
            isHighFiving
              ? 'scale-110 ring-4 ring-amber-400 rotate-6'
              : 'ring-2 ring-amber-400/80 hover:ring-amber-500'
          } bg-gradient-to-tr from-amber-400 via-amber-500 to-indigo-600`}
          title="Click to talk to Kavi Owl AI Study Assistant"
        >
          {/* Owl 3D Avatar Image */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative shadow-inner border border-white/40">
            <img
              src={kaviOwlAvatar}
              alt="Kavi the Smart Owl Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* AI Helper Indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-[9px] font-bold text-white items-center justify-center shadow">
              🤖
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
