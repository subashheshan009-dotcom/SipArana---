import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Heart, Smile, Volume2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
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
    si: '🦉 කවි: ශිෂ්‍ය සංසදයේ (Study Group) ගැටලු අහන්න, අනෙක් අයටත් විසඳුම් කියලා දෙන්න!',
    ta: '🦉 கவி: மாணவர் கலந்துரையாடல் தளத்தில் சந்தேகங்களைக் கேட்டு நண்பர்களுடன் பகிருங்கள்!',
    en: '🦉 Kavi: Share doubts in Student Study Group and solve questions together!'
  }
];

export default function Mascot({ trigger, onNavigate }: MascotProps) {
  const { addXP } = useAuth();
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
    addXP(15);
    setHeartsCount(prev => prev + 1);
    setTimeout(() => setIsHighFiving(false), 800);
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
    <div id="siparana-mascot-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Speech bubble */}
      {isOpen && (
        <div
          id="mascot-speech-bubble"
          className="mb-3 max-w-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/50 p-4 rounded-3xl shadow-2xl text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ring-2 ring-amber-400/20"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mascotTitle}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSpeak}
                className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 transition"
                title="Listen to Kavi speak"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="mascot-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-slate-800 dark:text-slate-100 font-semibold leading-relaxed text-[13px]">
            "{primaryText}"
          </p>

          <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <button
              id="mascot-next-msg-btn"
              onClick={nextMessage}
              className="text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
            >
              <Smile className="w-3 h-3" /> {nextTipText}
            </button>
            <button
              id="mascot-highfive-btn"
              onClick={handleHighFive}
              className="bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 whitespace-nowrap shadow-sm"
            >
              ✋ High Five! (+15 XP)
            </button>
          </div>
        </div>
      )}

      {/* Mascot Avatar Button */}
      <div className="relative group">
        {/* Floating High Five Reaction */}
        {isHighFiving && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> +15 XP!
          </div>
        )}

        <button
          id="siparana-mascot-avatar-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) nextMessage();
          }}
          className={`relative p-1 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl ${
            isHighFiving
              ? 'scale-110 ring-4 ring-amber-400 rotate-6'
              : 'ring-2 ring-amber-400/80 hover:ring-amber-500'
          } bg-gradient-to-tr from-amber-400 via-amber-500 to-indigo-600`}
          title="Click to talk to Kavi Owl Mascot"
        >
          {/* Owl 3D Avatar Image */}
          <div className="w-13 h-13 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative shadow-inner border border-white/40">
            <img
              src={kaviOwlAvatar}
              alt="Kavi the Smart Owl Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Minimal non-distracting badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-900 items-center justify-center shadow">
              🦉
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
