import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  Search,
  ExternalLink,
  Code2,
  Palette,
  Languages,
  Atom,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Filter,
  Bookmark,
  BookmarkCheck,
  Star,
  Zap,
  Flame,
  Smile,
  Compass,
  Check,
  Users,
  Layers,
  ChevronRight,
  TrendingUp,
  Share2,
  RefreshCw,
  Radio,
  Volume2,
  VolumeX,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCourses } from '@/context/CoursesContext';
import { soundFX } from '@/utils/audioUtils';
import {
  COURSE_CATEGORIES,
  type FreeCourse
} from '@/data/freeCoursesData';
import {
  isDailyActionClaimedToday,
  recordDailyActionClaim,
  triggerDailyLockToast
} from '@/utils/dailyXpLockEngine';

interface FreeCoursesPageProps {
  onNavigate?: (page: string) => void;
}

export default function FreeCoursesPage({ onNavigate }: FreeCoursesPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const {
    courses,
    isSyncing,
    lastSyncTime,
    syncCountdown,
    autoSyncEnabled,
    setAutoSyncEnabled,
    latestDroppedCourse,
    syncCoursesNow,
    simulateIncomingCourseDrop,
    bookmarkedIds,
    toggleBookmark,
    providerStatuses
  } = useCourses();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyCertificates, setOnlyCertificates] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Mascot interaction state
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [activeMascotSpeechIdx, setActiveMascotSpeechIdx] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleBookmarkClick = (course: FreeCourse) => {
    toggleBookmark(course.id, course.titleSinhala || course.title);
    const isSaved = bookmarkedIds.includes(course.id);
    const userKey = profile?.email || profile?.id || 'guest_user';
    const actionKey = `course_bookmark_${course.id}`;
    const isClaimedToday = isDailyActionClaimedToday(actionKey, userKey);

    if (!isSaved) {
      soundFX.playCorrect();
      triggerToast(`⭐ "${course.titleSinhala || course.title}" ඔබගේ සුරැකි පාඨමාලා ලැයිස්තුවට එක්විය!`);
    } else {
      triggerToast(`"${course.titleSinhala || course.title}" සුරැකි ලැයිස්තුවෙන් ඉවත් කරන ලදී.`);
    }
  };

  const handleMascotCheer = () => {
    setIsHighFiving(true);
    const userKey = profile?.email || profile?.id || 'guest_user';
    const actionKey = 'mascot_cheer_free_courses';
    const isClaimedToday = isDailyActionClaimedToday(actionKey, userKey);

    try {
      soundFX.playCorrect();
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65, x: 0.5 }
      });
    } catch {
      // safe fallback
    }

    triggerToast('🎉 අරණ මාස්කොට් සමඟ එක්වී සම්බන්ධ විය!');
    setActiveMascotSpeechIdx((prev) => (prev + 1) % MASCOT_SPEECHES.length);
    setTimeout(() => setIsHighFiving(false), 700);
  };

  const speakCourseInfo = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'si' ? 'si-LK' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const MASCOT_SPEECHES = [
    {
      si: 'ආයුබෝවන් මිත්‍රයා! 🌟 අද ලෝකයේ ඉහළම වටිනාකමක් ඇති Harvard, MIT, Google සහ Moratuwa සරසවියේ නොමිලේ පාඨමාලා හැදෑරීමෙන් ඔබේ අනාගතයට අගනා පදනමක් දමාගත හැකියි!',
      en: 'Welcome friend! 🌟 Level up your skills with globally verified free courses from Harvard, MIT, Google, and University of Moratuwa to supercharge your future!',
      ta: 'வணக்கம் நண்பரே! 🌟 ஹார்வர்ட், எம்ஐடி, கூகிள் மற்றும் மொரட்டுவ பல்கலைக்கழகங்களின் இலவச படிப்புகளைக் கற்று உங்கள் எதிர்காலத்தை பிரகாசமாக்குங்கள்!'
    },
    {
      si: '💡 නොමිලේ සහතික (Free Certificates) සහිත පාඨමාලා සඳහා "Free Certificate" filter එක භාවිතා කරන්න. Google සහ MoraX මගින් නොමිලේම සහතික පිරිනමයි!',
      en: '💡 Looking for free verified certificates? Enable the "Free Certificate" filter to discover accredited tracks from Google and MoraX at zero cost!',
      ta: '💡 இலவச சான்றிதழ்களுடன் கூடிய படிப்புகளைப் பார்க்க "Free Certificate" வடிகட்டியைப் பயன்படுத்துங்கள்!'
    },
    {
      si: '🚀 A/L සහ O/L විභාගවලට සමගාමීව Coding, AI Prompting, Graphic Design හෝ Spoken English දිනකට විනාඩි 20ක් පුහුණු වීමෙන් විශාල වාසියක් අත්වේ!',
      en: '🚀 Investing just 20 minutes a day in Coding, AI Prompting, Graphic Design, or Spoken English alongside your school exams builds an unstoppable competitive edge!',
      ta: '🚀 தினமும் 20 நிமிடங்கள் கோடிங், AI அல்லது ஆங்கிலம் கற்பதன் மூலம் புதிய திறன்களை வளர்த்துக்கொள்ளுங்கள்!'
    }
  ];

  const currentSpeech = MASCOT_SPEECHES[activeMascotSpeechIdx];
  const speechText = language === 'si' ? currentSpeech.si : language === 'ta' ? currentSpeech.ta : currentSpeech.en;

  // Filtered courses logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      // Certificate filter
      if (onlyCertificates && !course.freeCertificate) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }
      // Search keyword filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(query) || course.titleSinhala.toLowerCase().includes(query);
        const matchDesc = course.description.toLowerCase().includes(query) || course.descriptionSinhala.toLowerCase().includes(query);
        const matchProvider = course.provider.toLowerCase().includes(query) || course.platform.toLowerCase().includes(query);
        const matchTags = course.whatYouWillLearn.some((t) => t.toLowerCase().includes(query)) ||
          course.whatYouWillLearnSinhala.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchDesc || matchProvider || matchTags;
      }
      return true;
    });
  }, [courses, selectedCategory, onlyCertificates, selectedLevel, searchQuery]);

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'it_programming':
        return Code2;
      case 'design_creative':
        return Palette;
      case 'languages':
        return Languages;
      case 'science_math':
        return Atom;
      case 'business_career':
        return Briefcase;
      case 'local_sri_lanka':
        return GraduationCap;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 select-text">
      {/* Floating Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{showToast}</span>
        </div>
      )}

      {/* 1. HERO BANNER WITH AUTOMATED LIVE SYNC RADAR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>LIVE AUTOMATED MOOC SYNC: MORAX, GOOGLE, HARVARD & OUSL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Free Online Courses (නිදහස් ඔන්ලයින් පාඨමාලා)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Harvard, MIT, Google, freeCodeCamp, MoraX සහ විවෘත විශ්වවිද්‍යාලයේ (OUSL) ලොව පිළිගත් නොමිලේ ඔන්ලයින් පාඨමාලා, නිබන්ධන සහ සහතික එකම තැනකින් සජීවීව යාවත්කාලීන වේ.
            </p>
          </div>

          {/* Live Sync Controls & Radar Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[280px] flex flex-col gap-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Radio className={`w-4 h-4 ${isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
                <span>Real-Time Directory Feed</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                100% Free
              </span>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Last Synced:</span>
                <span className="font-semibold text-white">
                  {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Auto-Check:</span>
                <span className="font-bold text-amber-300">{autoSyncEnabled ? `in ${syncCountdown}s` : 'Paused'}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={syncCoursesNow}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                onClick={simulateIncomingCourseDrop}
                title="Test real-time course drop"
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/30 cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>Simulate Drop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Provider Ping Indicators */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {Object.values(providerStatuses).map((prov) => (
            <div
              key={prov.id}
              className="p-2.5 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-slate-300 backdrop-blur-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-[11px] truncate">{prov.shortCode}</span>
              </div>
              <span className="text-[10px] text-slate-400">{prov.pingMs}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ANIMATED MASCOT WELCOME & REAL-TIME COURSE DROP ALERT */}
      <motion.div
        id="mascot-free-courses-guide"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-cyan-500/10 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Mascot 3D Avatar */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: isHighFiving ? [0, -10, 10, -5, 0] : [0, 1, -1, 0]
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: isHighFiving ? 0.6 : 5, repeat: isHighFiving ? 0 : Infinity, ease: 'easeInOut' }
            }}
            onClick={handleMascotCheer}
            className="relative cursor-pointer group flex-shrink-0"
            title="Click Arana for a High-Five & XP! ✋"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 p-1 shadow-lg border-2 border-amber-300 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src={mascotImage}
                  alt="Arana Mascot Guiding Free Courses"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap group-hover:bg-amber-100 dark:group-hover:bg-amber-950 transition">
              ✋ {isHighFiving ? '🎉 High Five!' : 'Click Arana!'}
            </div>
          </motion.div>

          {/* Mascot Speech Bubble & Dynamic Tips */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>අරණ ගුරු මාස්කොට් (Arana Real-Time Course Watchdog)</span>
              </div>
              <button
                onClick={handleMascotCheer}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>ඊළඟ මගපෙන්වීම (Next Tip) →</span>
              </button>
            </div>

            {/* If there is a latest dropped course, highlight it */}
            {latestDroppedCourse ? (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 dark:bg-amber-950/50 border border-amber-400/50 text-xs space-y-1.5">
                <p className="font-extrabold text-slate-900 dark:text-slate-100">
                  📢 "Hey! A brand new free course is live! Check out <span className="text-blue-600 dark:text-blue-400 underline">{language === 'si' ? latestDroppedCourse.titleSinhala : latestDroppedCourse.title}</span> by {latestDroppedCourse.provider}!"
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={latestDroppedCourse.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition inline-flex items-center gap-1"
                  >
                    <span>Enroll For Free</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => speakCourseInfo(language === 'si' ? latestDroppedCourse.descriptionSinhala : latestDroppedCourse.description)}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px] transition inline-flex items-center gap-1"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeMascotSpeechIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed"
                >
                  {speechText}
                </motion.p>
              </AnimatePresence>
            )}

            <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Auto-Sync Active ({courses.length} Courses)
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Self-Paced Learning
                </span>
              </div>

              <button
                onClick={handleMascotCheer}
                className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-extrabold flex items-center gap-1 transition shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>High-Five Arana (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className="space-y-4">
        {/* Search input & Certificate Quick Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="පාඨමාලාව, විෂය හෝ ආයතනය සොයන්න (e.g. Python, Harvard, Graphic Design, English)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyCertificates(!onlyCertificates)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                onlyCertificates
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Free Certificate Only</span>
            </button>

            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Levels (සියලුම මට්ටම්)</option>
                <option value="Beginner">Beginner (ආරම්භක)</option>
                <option value="Intermediate">Intermediate (මැදි මට්ටම)</option>
                <option value="Advanced">Advanced (උසස් මට්ටම)</option>
              </select>
            </div>

            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                autoSyncEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{autoSyncEnabled ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {COURSE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'si' ? cat.labelSinhala : cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. COURSES GRID */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto text-blue-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            පාඨමාලා කිසිවක් හමු නොවීය (No Courses Found)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            ඔබ සෙවූ වචනයට හෝ තේරූ කාණ්ඩයට ගැලපෙන පාඨමාලා නොමැත. වෙනත් වචනයක් යොදා සොයන්න.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyCertificates(false);
              setSelectedLevel('all');
            }}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Clear Filters & View All Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isSaved = bookmarkedIds.includes(course.id);
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  course.featured
                    ? 'border-blue-400/80 dark:border-blue-500/60 ring-2 ring-blue-400/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {course.provider}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleBookmarkClick(course)}
                        className={`p-1.5 rounded-xl transition cursor-pointer ${
                          isSaved
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title="Save Course"
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                      {language === 'si' ? course.titleSinhala : course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                      {course.platform} • {course.duration}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {language === 'si' ? course.descriptionSinhala : course.description}
                  </p>

                  {/* Free Certificate Badge */}
                  {course.freeCertificate && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Free Accredited Certificate Included</span>
                    </div>
                  )}

                  {/* Key Highlights (Accordion) */}
                  <div className="pt-1">
                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'සඟවන්න (Hide Syllabus)' : 'විස්තර සහ ඉගෙනගන්නා දෑ (What You\'ll Learn) ↓'}</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                        >
                          <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <span>පාඨමාලාවෙන් ආවරණය වන ප්‍රධාන ක්ෂේත්‍ර:</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                            {(language === 'si' ? course.whatYouWillLearnSinhala : course.whatYouWillLearn).map(
                              (point, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={course.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25"
                  >
                    <span>Start Course Free</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => speakCourseInfo(language === 'si' ? course.descriptionSinhala : course.description)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                    title="Listen to summary"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. TRUSTED FREE MOOC PLATFORMS DIRECTORY */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>ලොව සුප්‍රකට නිදහස් අධ්‍යාපන පීඨ (Trusted Learning Platforms)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ශ්‍රී ලාංකීය සිසුන්ට සම්පූර්ණයෙන්ම නොමිලේ ලියාපදිංචි වී හැදෑරිය හැකි ප්‍රමුඛ වේදිකා
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              name: 'Harvard Online',
              badge: 'World #1 Uni',
              url: 'https://pll.harvard.edu/catalog/free',
              desc: 'CS50, Data Science, Humanities'
            },
            {
              name: 'freeCodeCamp',
              badge: 'Free Certs',
              url: 'https://www.freecodecamp.org/',
              desc: 'Fullstack, Python, JavaScript'
            },
            {
              name: 'MoraX (UoM)',
              badge: 'Sri Lanka UoM',
              url: 'https://morax.uom.lk/',
              desc: 'Python, Arduino, Web Tech'
            },
            {
              name: 'Google Skillshop',
              badge: 'Official Google',
              url: 'https://skillshop.withgoogle.com/',
              desc: 'Digital Marketing, Cloud, Ads'
            },
            {
              name: 'Khan Academy',
              badge: 'Math & Science',
              url: 'https://www.khanacademy.org/',
              desc: 'Calculus, Physics, Chemistry'
            },
            {
              name: 'MIT OCW',
              badge: 'MIT Open Course',
              url: 'https://ocw.mit.edu/',
              desc: 'Engineering, Linear Algebra'
            }
          ].map((pf, idx) => (
            <a
              key={idx}
              href={pf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all text-center space-y-1 group shadow-2xs"
            >
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 inline-block">
                {pf.badge}
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition flex items-center justify-center gap-1">
                <span>{pf.name}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{pf.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
