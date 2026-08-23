import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Sparkles,
  Bell,
  BellRing,
  CheckCircle2,
  Play,
  Calendar,
  Video,
  Clock,
  GraduationCap,
  Award,
  BookOpen,
  Layers,
  Laptop,
  Dna,
  Calculator,
  Zap,
  Flame,
  Smile,
  ArrowRight,
  Radio,
  FileText,
  MessageSquare,
  Volume2,
  Tv,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface ClassroomPageProps {
  onNavigate?: (page: string) => void;
}

export default function ClassroomPage({ onNavigate }: ClassroomPageProps) {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const [isNotified, setIsNotified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('siparana_classroom_notified') === 'true';
    } catch {
      return false;
    }
  });

  const [isHighFiving, setIsHighFiving] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleToggleNotify = () => {
    if (!isNotified) {
      setIsNotified(true);
      try {
        localStorage.setItem('siparana_classroom_notified', 'true');
        soundFX.playCorrect();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65, x: 0.5 }
        });
      } catch {
        // safe fallback
      }
      addXP(25);
      triggerToast('🎉 ඔබට ස්තූතියි! නව වීඩියෝ පන්ති ආරම්භ වූ වහාම ඔබට දැනුම්දෙනු ඇත. (+25 XP හිමිවිය!)');
    } else {
      setIsNotified(false);
      try {
        localStorage.setItem('siparana_classroom_notified', 'false');
      } catch {
        // safe fallback
      }
      triggerToast('දැනුම්දීම් අක්‍රිය කරන ලදී.');
    }
  };

  const handleMascotCheer = () => {
    setIsHighFiving(true);
    try {
      soundFX.playCorrect();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setActiveSpeechIndex((prev) => (prev + 1) % MASCOT_SPEECHES.length);
    setTimeout(() => setIsHighFiving(false), 800);
  };

  const MASCOT_SPEECHES = [
    {
      si: 'හේයි මිත්‍රයා! 🎬 අපේ ප්‍රවීණ ගුරු මණ්ඩලය 4K Ultra HD තත්ත්වයෙන් A/L & O/L සියලුම විෂය ඒකක සඳහා වීඩියෝ පාඩම් සහ ප්‍රශ්න පත්‍ර සාකච්ඡා මේ දිනවල පටිගත කරමින් පවතිනවා!',
      en: 'Hey friend! 🎬 Our master educators are currently in the studio producing 4K Ultra HD video lessons, theory explanations, and past paper walkthroughs!',
      ta: 'வணக்கம் நண்பரே! 🎬 எமது சிறந்த ஆசிரியர்கள் 4K Ultra HD தரத்தில் A/L & O/L பாடங்களுக்கான காணொளி வகுப்புகளைப் பதிவுசெய்து வருகின்றனர்!'
    },
    {
      si: '✨ සෑම වීඩියෝ පාඩමකටම අදාළ Downloadable Theory Tutes සහ ස්වයං ඇගයීම් Quizzes නොමිලේම ඔබට ලැබෙනවා!',
      en: '✨ Every video lesson will come with downloadable theory handouts, past paper model sets, and instant XP quizzes!',
      ta: '✨ ஒவ்வொரு காணொளிப் பாடத்துடனும் பதிவிறக்கம் செய்யக்கூடிய குறிப்பேடுகளும் பயிற்சிகளும் இலவசமாக வழங்கப்படும்!'
    },
    {
      si: '🔥 පහත ඇති "මාව දැනුවත් කරන්න (Notify Me)" බටනය ක්ලික් කර පන්ති ආරම්භ වූ වහාම දැනුම්දීම් ලබාගන්න!',
      en: '🔥 Tap the "Notify Me" button below to get an instant alert and early access as soon as our master classes go live!',
      ta: '🔥 வகுப்புகள் ஆரம்பிக்கப்பட்டதும் உடனடியாக அறிந்துகொள்ள கீழே உள்ள "Notify Me" பொத்தானை அழுத்துங்கள்!'
    }
  ];

  const currentSpeech = MASCOT_SPEECHES[activeSpeechIndex];
  const speechText = language === 'si' ? currentSpeech.si : language === 'ta' ? currentSpeech.ta : currentSpeech.en;

  const UPCOMING_STREAMS = [
    {
      id: 'maths',
      title: 'Combined Mathematics',
      titleSinhala: 'සංයුක්ත ගණිතය',
      desc: 'Pure Maths & Applied Maths සම්පූර්ණ විෂය නිර්දේශය, ප්‍රමේය සහ ගැටලු විසඳීමේ කෙටි ක්‍රම.',
      icon: Calculator,
      color: 'from-blue-600 to-cyan-600',
      badge: 'A/L Physical Science'
    },
    {
      id: 'physics',
      title: 'Physics',
      titleSinhala: 'භෞතික විද්‍යාව',
      desc: 'චලිතය, දෝලන හා තරංග, විද්‍යුතය, තාපය සහ ඉලෙක්ට්‍රොනික්ස් විවරණ.',
      icon: Zap,
      color: 'from-purple-600 to-indigo-600',
      badge: 'A/L Science Stream'
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      titleSinhala: 'රසායන විද්‍යාව',
      desc: 'කාබනික, අකාබනික සහ භෞතික රසායනය ආශ්‍රිත සියලුම ප්‍රතික්‍රියා හා ව්‍යුහගත රචනා.',
      icon: Award,
      color: 'from-emerald-600 to-teal-600',
      badge: 'A/L Science Stream'
    },
    {
      id: 'biology',
      title: 'Biology',
      titleSinhala: 'ජීව විද්‍යාව',
      desc: 'සෛල ජීව විද්‍යාව, ජාන විද්‍යාව, මානව කායික විද්‍යාව සහ පරිසර විද්‍යාව.',
      icon: Dna,
      color: 'from-green-600 to-emerald-700',
      badge: 'A/L Bio Science'
    },
    {
      id: 'ict',
      title: 'Information Technology (ICT)',
      titleSinhala: 'තොරතුරු තාක්ෂණය',
      desc: 'Python Programming, Database SQL, Web Development & Networking ප්‍රායෝගික පුහුණුව.',
      icon: Laptop,
      color: 'from-amber-600 to-orange-600',
      badge: 'A/L & O/L Tech'
    },
    {
      id: 'commerce',
      title: 'Commerce & Accounting',
      titleSinhala: 'වාණිජ හා ගිණුම්කරණය',
      desc: 'මූල්‍ය ගිණුම්කරණය, ව්‍යාපාර අධ්‍යයනය සහ ආර්ථික විද්‍යා ගැටලු සාකච්ඡා.',
      icon: Layers,
      color: 'from-rose-600 to-pink-600',
      badge: 'A/L Commerce Stream'
    }
  ];

  const UPCOMING_PERKS = [
    {
      icon: Tv,
      titleSinhala: '4K Ultra HD & Smart Whiteboard',
      titleEnglish: 'Crystal-clear visuals & digital annotations',
      desc: 'පැහැදිලි ඩිජිටල් වයිට්බෝඩ් රූපරාමු සහ අධි-විභේදිත ශබ්ද තත්ත්වය.'
    },
    {
      icon: FileText,
      titleSinhala: 'Downloadable Tutes & PDF Notes',
      titleEnglish: 'Comprehensive study packs & model questions',
      desc: 'සෑම වීඩියෝවකටම අදාළ විස්තරාත්මක නිබන්ධන සහ ප්‍රශ්න පත්‍ර PDF නොමිලේ.'
    },
    {
      icon: Zap,
      titleSinhala: 'Instant Concept Quizzes & XP',
      titleEnglish: 'Self-assessment checks after each chapter',
      desc: 'වීඩියෝව අවසානයේදී ක්ෂණික ප්‍රශ්නාවලිවලට පිළිතුරු දී XP සහ ලාංඡන ලබාගන්න.'
    },
    {
      icon: MessageSquare,
      titleSinhala: 'Direct Teacher Q&A Support',
      titleEnglish: 'Ask questions and clear your doubts',
      desc: 'නොතේරෙන ගැටලු සහ සිද්ධාන්ත සෘජුවම ගුරු මණ්ඩලයෙන් විමසීමේ හැකියාව.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{showToast}</span>
        </div>
      )}

      {/* 1. Classroom Hero Banner (Kept exactly as requested) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              <span>A/L & O/L Video Classroom • වීඩියෝ පන්ති කාමරය</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              විෂය නිර්දේශයේ සියලු වීඩියෝ පාඩම් එකම තැනකින්
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Combined Maths, Physics, Chemistry, Biology, ICT සහ Commerce විෂයන් සඳහා පළපුරුදු ආචාර්ය මණ්ඩලයේ විස්තරාත්මක වීඩියෝ දේශන, නිබන්ධන සහ ප්‍රගති ලුහුබැඳීම.
            </p>
          </div>

          {/* Studio Production Status Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[260px] flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                පටිගත කිරීම් තත්ත්වය (Status)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-400/30">
                In Production
              </span>
            </div>

            {/* Pulsing indicator */}
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                style={{ width: '60%' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Studio 4K Quality Recording</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                ළඟදීම විකාශය වේ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT ANIMATED "CLASSES COMING SOON" SHOWCASE SECTION */}
      <motion.div
        id="classes-coming-soon-showcase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-blue-500/5 to-purple-500/10 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8"
      >
        {/* Decorative Background Lighting Effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Top Centered Live Production Pill */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-400/40 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Master Class Video Series • Exclusive Studio Release</span>
          </motion.div>
        </div>

        {/* Mascot & Main "Classes Coming Soon" Presentation Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Mascot Presentation Avatar & Interactive Greeting */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: isHighFiving ? [0, -12, 12, -6, 0] : [0, 1.5, -1.5, 0]
              }}
              transition={{
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: isHighFiving ? 0.6 : 6, repeat: isHighFiving ? 0 : Infinity, ease: 'easeInOut' }
              }}
              onClick={handleMascotCheer}
              className="relative cursor-pointer group"
              title="Click Arana for a High-Five & study excitement! ✋"
            >
              {/* Mascot Outer Glow Ring */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 p-1.5 shadow-[0_12px_24px_-8px_rgba(245,158,11,0.5)] border-4 border-amber-300/80 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                  <img
                    src={mascotImage}
                    alt="Arana Mascot Presenting Classes"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Animated Floating Pointer Badge */}
              <motion.div
                animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900 flex items-center gap-1"
              >
                <Film className="w-3 h-3" />
                <span>Coming Soon!</span>
              </motion.div>

              {/* High-Five Trigger Tooltip */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap group-hover:bg-amber-100 dark:group-hover:bg-amber-950 transition">
                ✋ {isHighFiving ? '🎉 High Five!' : 'Click to High-Five!'}
              </div>
            </motion.div>

            {/* Mascot Speech Bubble */}
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-500/40 p-4 sm:p-5 rounded-3xl shadow-lg relative text-left">
              <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>අරණ මාස්කොට් (Arana Guide)</span>
                </div>
                <button
                  onClick={handleMascotCheer}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  ඊළඟ පණිවිඩය →
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSpeechIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="pt-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed"
                >
                  {speechText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Main Animated Title & Call-to-Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 dark:from-amber-400 dark:via-rose-400 dark:to-indigo-400 drop-shadow-sm">
                  Classes Coming Soon
                </span>
              </motion.div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                නව HD වීඩියෝ පන්ති මාලාව ළඟදීම ආරම්භ වේ! 🎓
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                A/L & O/L විෂය නිර්දේශයේ සියලුම ප්‍රධාන විෂය ධාරා සඳහා ප්‍රවීණ දේශක මණ්ඩලය විසින් මෙහෙයවනු ලබන විස්තරාත්මක සිද්ධාන්ත (Theory), පසුගිය විභාග ප්‍රශ්න පත්‍ර සාකච්ඡා (Paper Class) සහ ආදර්ශ ප්‍රශ්න පත්‍ර සහිත වීඩියෝ මාලාව ඉතා ඉක්මනින් මෙහිදී මුදාහැරේ.
              </p>
            </div>

            {/* Interactive Action Notification Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={handleToggleNotify}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 active:scale-95 ${
                  isNotified
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-300/50'
                }`}
              >
                {isNotified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>දැනුම්දීම් සක්‍රියයි (Notification Enabled)</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-5 h-5 text-slate-950 animate-bounce" />
                    <span>මාව දැනුවත් කරන්න (Notify Me When Live)</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-950/20 text-slate-950 font-extrabold rounded-full">
                      +25 XP
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleMascotCheer}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>අරණගෙන් උපදෙස් (Study Advice)</span>
              </button>
            </div>

            {/* Quick Status Ticker */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 justify-center lg:justify-start">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                100% Free for all Sri Lankan Students
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                National Curriculum & Guru Potha Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                Sinhala & English Medium Subtitles
              </span>
            </div>
          </div>
        </div>

        {/* 3. Upcoming Subject Streams Grid */}
        <div className="space-y-4 pt-4 border-t border-amber-200/50 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>වීඩියෝ පන්ති කාමරයට එක්වන විෂය ධාරාවන් (Upcoming Subjects)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                පහත විෂයන් සඳහා සම්පූර්ණ වීඩියෝ මාලාව සූදානම් වෙමින් පවතී
              </p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 self-start sm:self-auto">
              6 Main Streams
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_STREAMS.map((st) => {
              const Icon = st.icon;
              return (
                <motion.div
                  key={st.id}
                  whileHover={{ scale: 1.02, translateY: -3 }}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${st.color} opacity-10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform`} />

                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                        Coming Soon
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {st.badge}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {st.titleSinhala}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400">{st.title}</p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Theory + Papers + Tutes</span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                      ළඟදීම • Soon
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. Classroom Key Perks Highlight Cards */}
        <div className="space-y-4 pt-4 border-t border-amber-200/50 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>වීඩියෝ පන්ති කාමරයේ විශේෂාංග (Key Highlights)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UPCOMING_PERKS.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 backdrop-blur-xs shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    {perk.titleSinhala}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
