import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Heart, Smile, Bell, ArrowRight, Volume2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useExamNews } from '@/context/NewsContext';
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
    si: 'සුබ පැතුම්! අද දවසේ ඔයාගේ පාඩම් ඉලක්කය සපුරාගන්න පුළුවන්!',
    ta: 'வாழ்த்துகள்! இன்றைய படிப்பு இலக்கை உங்களால் எளிதாக அடைய முடியும்!',
    en: 'Great job! Keep the momentum going for today\'s study goal!'
  },
  {
    si: 'උත්සාහය අත්හරින්න එපා! හැම අමාරු ගණනක්ම විසඳන්න ක්‍රමයක් තියෙනවා.',
    ta: 'முயற்சியைக் கைவிடாதீர்கள்! கடினமான ஒவ்வொரு கேள்விக்கும் ஒரு தீர்வு உண்டு.',
    en: 'Never give up! Every tough problem has a structured solution.'
  },
  {
    si: 'A/L සහ O/L විභාග ජයගන්න දිනපතා පුහුණුව තමයි එකම රහස!',
    ta: 'A/L மற்றும் O/L தேர்வுகளில் வெல்ல தினசரி தொடர் பயிற்சியே சிறந்த வழி!',
    en: 'Daily consistent practice is the only secret to Island Top Ranks!'
  },
  {
    si: 'විනාඩි 25ක් පාඩම් කරලා විනාඩි 5ක විවේකයක් ගන්න (Pomodoro ක්‍රමය)!',
    ta: '25 நிமிடங்கள் படித்து 5 நிமிடங்கள் ஓய்வெடுங்கள் (Pomodoro முறை)!',
    en: 'Study for 25 mins, take a 5 min break for maximum retention!'
  },
  {
    si: 'Z-Score එක වැඩි කරගන්න Past Papers වැඩිපුර කරන්න!',
    ta: 'Z-புள்ளியை உயர்த்த கடந்த கால வினாத்தாள்களை அதிகம் பயிற்சி செய்யுங்கள்!',
    en: 'Boost your Z-Score by practicing at least 10 years of Past Papers!'
  },
  {
    si: 'AI සරසවි සහකාරගෙන් ඕනෑම විෂය ගැටලුවක් සරලව අහන්න!',
    ta: 'AI உதவியாளரிடம் எந்த பாட சந்தேகத்தையும் எளிதாகக் கேளுங்கள்!',
    en: 'Ask the AI study assistant any complex syllabus doubt instantly!'
  }
];

export default function Mascot({ trigger, onNavigate }: MascotProps) {
  const { addXP } = useAuth();
  const { language, tText, t } = useLanguage();
  const {
    latestBreakingNotice,
    mascotAlertDismissed,
    dismissMascotAlert,
    speakNotice,
    isSpeaking,
    stopSpeaking
  } = useExamNews();

  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [, setHeartsCount] = useState(0);

  // Show alert popover if there's a breaking notice that hasn't been dismissed
  const hasActiveExamAlert = !!latestBreakingNotice && !mascotAlertDismissed;

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
    ? 'සිපුරු (Sipuru AI Mascot)'
    : language === 'ta'
    ? 'சிப்புரு (Sipuru AI வழிகாட்டி)'
    : 'Sipuru AI Study Mascot';

  const nextTipText = language === 'si'
    ? 'තව උපදෙසක්'
    : language === 'ta'
    ? 'அடுத்த குறிப்பு'
    : 'Next Study Tip';

  const handleExamAlertClick = () => {
    if (onNavigate) {
      onNavigate('news');
    }
    dismissMascotAlert();
  };

  return (
    <div id="siparana-mascot-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* 1. Breaking Exam Notice Cartoon Mascot Notification Popup */}
      {hasActiveExamAlert && !isOpen && (
        <div
          id="mascot-breaking-exam-alert-bubble"
          className="mb-3 max-w-sm bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white p-4 rounded-3xl shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-4 ring-amber-300/50 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black tracking-wide uppercase">
              <Bell className="w-3.5 h-3.5 animate-bounce text-yellow-200" />
              <span>Official Exam Alert</span>
            </div>
            <button
              onClick={dismissMascotAlert}
              className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-black leading-snug">
              📢 {language === 'si' ? 'නව විභාග නිවේදනයක් නිකුත් විය!' : language === 'ta' ? 'புதிய தேர்வு அறிவிப்பு வெளியானது!' : 'New Exam Notice is Out!'}
            </p>
            <p className="text-[11px] text-amber-100 font-medium line-clamp-2 leading-relaxed">
              {language === 'si'
                ? latestBreakingNotice?.titleSinhala
                : language === 'ta'
                ? latestBreakingNotice?.tamilSummary
                : latestBreakingNotice?.title}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between gap-2 text-[11px]">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakNotice(
                    language === 'si'
                      ? latestBreakingNotice?.sinhalaSummary || ''
                      : latestBreakingNotice?.summary || '',
                    language
                  );
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 font-bold flex items-center gap-1 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
            </button>

            <button
              onClick={handleExamAlertClick}
              className="px-3 py-1 rounded-xl bg-white text-slate-900 font-black flex items-center gap-1 hover:bg-amber-100 transition shadow-md group"
            >
              <span>{language === 'si' ? 'දැන්ම බලන්න' : 'Check Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Speech bubble */}
      {isOpen && (
        <div
          id="mascot-speech-bubble"
          className="mb-3 max-w-xs bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 p-4 rounded-2xl shadow-xl text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mascotTitle}</span>
            </div>
            <button
              id="mascot-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-slate-800 dark:text-slate-100 font-semibold leading-relaxed text-[13px]">
            "{primaryText}"
          </p>
          
          {language !== 'en' && (
            <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">
              "{currentMsg.en}"
            </p>
          )}

          <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <button
              id="mascot-next-msg-btn"
              onClick={nextMessage}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <Smile className="w-3 h-3" /> {nextTipText}
            </button>
            <button
              id="mascot-highfive-btn"
              onClick={handleHighFive}
              className="bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 whitespace-nowrap"
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
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold bg-amber-400 text-slate-900 px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1">
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
              : hasActiveExamAlert
              ? 'ring-4 ring-amber-500 ring-offset-2 animate-pulse'
              : 'ring-2 ring-blue-500/50 hover:ring-blue-500'
          } bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600`}
          title="Click to talk to Sipuru Mascot"
        >
          {/* Owl / Mascot SVG Avatar */}
          <div className="w-13 h-13 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
            <svg
              className="w-11 h-11"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Graduation Cap */}
              <polygon points="50,12 85,25 50,38 15,25" fill="#1e293b" />
              <polygon points="50,15 80,26 50,37 20,26" fill="#0f172a" />
              <rect x="42" y="27" width="16" height="6" fill="#3b82f6" rx="2" />
              <line x1="82" y1="26" x2="86" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="86" cy="42" r="3" fill="#f59e0b" />

              {/* Owl Body */}
              <ellipse cx="50" cy="62" rx="34" ry="32" fill="#3b82f6" />
              <ellipse cx="50" cy="67" rx="24" ry="22" fill="#dbeafe" />

              {/* Left Eye */}
              <circle cx="37" cy="52" r="12" fill="#ffffff" />
              <circle cx="38" cy="52" r="6" fill="#1e3a8a" />
              <circle cx="36" cy="49" r="2.5" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="63" cy="52" r="12" fill="#ffffff" />
              <circle cx="62" cy="52" r="6" fill="#1e3a8a" />
              <circle cx="64" cy="49" r="2.5" fill="#ffffff" />

              {/* Beak */}
              <polygon points="50,56 45,64 55,64" fill="#f59e0b" />

              {/* Wings */}
              <ellipse cx="20" cy="64" rx="8" ry="16" fill="#1d4ed8" transform="rotate(15 20 64)" />
              <ellipse cx="80" cy="64" rx="8" ry="16" fill="#1d4ed8" transform="rotate(-15 80 64)" />

              {/* Glasses rim */}
              <circle cx="37" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <circle cx="63" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <line x1="49" y1="52" x2="51" y2="52" stroke="#f59e0b" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Pulse badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${hasActiveExamAlert ? 'bg-red-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-4 w-4 ${hasActiveExamAlert ? 'bg-red-500' : 'bg-amber-500'} text-[9px] font-bold text-slate-900 items-center justify-center`}>
              {hasActiveExamAlert ? '🚨' : '💡'}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
