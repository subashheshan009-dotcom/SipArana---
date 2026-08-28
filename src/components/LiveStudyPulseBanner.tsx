import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Users, CheckCircle2, ArrowRight, Zap, Target, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface LiveActivityItem {
  id: string;
  studentName: string;
  district: string;
  actionText: string;
  xpBonus: string;
  timeAgo: string;
}

const SAMPLE_LIVE_ACTIVITIES: LiveActivityItem[] = [
  { id: '1', studentName: 'Nisal S.', district: 'Colombo', actionText: 'completed Combined Maths Past Paper 2024', xpBonus: '+100 XP', timeAgo: 'Just now' },
  { id: '2', studentName: 'Amaya K.', district: 'Kandy', actionText: 'finished Chemistry Unit 3 Flashcards', xpBonus: '+50 XP', timeAgo: '1m ago' },
  { id: '3', studentName: 'Senuri P.', district: 'Galle', actionText: 'mastered Grade 5 Scholarship IQ Puzzle', xpBonus: '+40 XP', timeAgo: '2m ago' },
  { id: '4', studentName: 'Thilina M.', district: 'Kurunegala', actionText: 'completed 25m Deep Focus Pomodoro Block', xpBonus: '+75 XP', timeAgo: '3m ago' },
  { id: '5', studentName: 'Dhanushka R.', district: 'Gampaha', actionText: 'hit a 14-Day Study Streak!', xpBonus: '+200 XP', timeAgo: '4m ago' },
  { id: '6', studentName: 'Kavindi J.', district: 'Matara', actionText: 'evaluated A/L Sinhala Essay with AI Mentor', xpBonus: '+60 XP', timeAgo: '5m ago' }
];

interface LiveStudyPulseBannerProps {
  onOpenFocus?: () => void;
  onOpenQuizzes?: () => void;
}

export default function LiveStudyPulseBanner({ onOpenFocus, onOpenQuizzes }: LiveStudyPulseBannerProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [activeStudentCount, setActiveStudentCount] = useState(1248);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isSpeakingGreeting, setIsSpeakingGreeting] = useState(false);

  // Time-of-day greeting
  const hour = new Date().getHours();
  let timeGreetingEn = 'Good Morning';
  let timeGreetingSi = 'සුබ උදෑසනක්';
  let timeGreetingTa = 'காலை வணக்கம்';

  if (hour >= 12 && hour < 17) {
    timeGreetingEn = 'Good Afternoon';
    timeGreetingSi = 'සුබ දහවලක්';
    timeGreetingTa = 'மதிய வணக்கம்';
  } else if (hour >= 17 && hour < 22) {
    timeGreetingEn = 'Good Evening';
    timeGreetingSi = 'සුබ සැඳෑවක්';
    timeGreetingTa = 'மாலை வணக்கம்';
  } else if (hour >= 22 || hour < 5) {
    timeGreetingEn = 'Night Owl Study Session';
    timeGreetingSi = 'රාත්‍රී පාඩම් සැසිය';
    timeGreetingTa = 'இரவு படிப்பு அமர்வு';
  }

  const studentName = profile?.name ? profile.name.split(' ')[0] : 'Scholar';

  const dailyGoalTipSi = `අද දින ඉලක්කය: විෂය කරුණු 2ක් ආවර්ජනය කර MCQ 10කට පිළිතුරු දෙන්න.`;
  const dailyGoalTipTa = `இன்றைய இலக்கு: 2 தலைப்புகளை மீளாய்வு செய்து 10 வினாக்களுக்கு பதிலளிக்கவும்.`;
  const dailyGoalTipEn = `Daily Target: Review 2 syllabus units and solve 10 MCQs to preserve your study streak!`;

  const dynamicGreetingText =
    language === 'si'
      ? `${timeGreetingSi}, ${studentName}! ${dailyGoalTipSi}`
      : language === 'ta'
      ? `${timeGreetingTa}, ${studentName}! ${dailyGoalTipTa}`
      : `${timeGreetingEn}, ${studentName}! ${dailyGoalTipEn}`;

  // Fluctuate active student count slightly every 5 seconds for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStudentCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(1210, Math.min(1390, prev + delta));
      });
      setCurrentActivityIndex(prev => (prev + 1) % SAMPLE_LIVE_ACTIVITIES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handlePlayVoiceGreeting = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingGreeting) {
        window.speechSynthesis.cancel();
        setIsSpeakingGreeting(false);
        return;
      }

      soundFX.playCorrect();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dynamicGreetingText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      if (language === 'si') {
        utterance.lang = 'si-LK';
      } else if (language === 'ta') {
        utterance.lang = 'ta-LK';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onend = () => setIsSpeakingGreeting(false);
      utterance.onerror = () => setIsSpeakingGreeting(false);
      setIsSpeakingGreeting(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeActivity = SAMPLE_LIVE_ACTIVITIES[currentActivityIndex];

  return (
    <div
      id="live-study-pulse-banner"
      className="rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border border-blue-400/40 text-white p-3.5 sm:p-4 shadow-lg backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 transition-all"
    >
      {/* Left: Live Pulse Status & Active Count */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="tracking-wide">
            {activeStudentCount.toLocaleString()} {language === 'si' ? 'සිසුන් සජීවීව පාඩම් කරති' : 'Students Studying Live Now'}
          </span>
        </div>

        {/* Live dynamic activity ticker */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200/90 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="font-bold text-amber-300">{activeActivity.studentName} ({activeActivity.district})</span>
          <span className="truncate max-w-[200px] lg:max-w-[260px]">{activeActivity.actionText}</span>
          <span className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded">
            {activeActivity.xpBonus}
          </span>
        </div>
      </div>

      {/* Right: Personalized Audio Mentor Greeting Button */}
      <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
        <div className="text-left lg:text-right text-xs">
          <div className="font-bold text-blue-100 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'si'
                ? `${timeGreetingSi}, ${studentName}!`
                : `${timeGreetingEn}, ${studentName}!`}
            </span>
          </div>
          <span className="text-[11px] text-blue-300/80 hidden md:inline">
            {language === 'si' ? 'AI ගුරු හඬින් දවසේ ඉලක්කය අසන්න' : 'Tap to listen to your AI Mentor Daily Goal'}
          </span>
        </div>

        <button
          type="button"
          id="play-voice-greeting-btn"
          onClick={handlePlayVoiceGreeting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs shadow-md transition transform hover:scale-103 cursor-pointer flex-shrink-0 ${
            isSpeakingGreeting
              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
              : 'bg-white/15 hover:bg-white/25 border border-white/20 text-white'
          }`}
          title="Play Personalized AI Voice Greeting & Goal"
        >
          {isSpeakingGreeting ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-950" />
              <span>Speaking...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Play AI Greeting</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
