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
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import {
  FREE_COURSES,
  COURSE_CATEGORIES,
  type FreeCourse
} from '@/data/freeCoursesData';

interface FreeCoursesPageProps {
  onNavigate?: (page: string) => void;
}

export default function FreeCoursesPage({ onNavigate }: FreeCoursesPageProps) {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyCertificates, setOnlyCertificates] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Mascot interaction state
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [activeMascotSpeechIdx, setActiveMascotSpeechIdx] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Bookmarked courses state stored in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_saved_free_courses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const toggleBookmark = (courseId: string, courseTitle: string) => {
    setBookmarkedIds((prev) => {
      const isSaved = prev.includes(courseId);
      let updated: string[];
      if (isSaved) {
        updated = prev.filter((id) => id !== courseId);
        triggerToast(`"${courseTitle}" සුරැකි ලැයිස්තුවෙන් ඉවත් කරන ලදී.`);
      } else {
        updated = [...prev, courseId];
        soundFX.playCorrect();
        addXP(10);
        triggerToast(`⭐ "${courseTitle}" ඔබගේ සුරැකි පාඨමාලා ලැයිස්තුවට එක්විය! (+10 XP)`);
      }
      try {
        localStorage.setItem('siparana_saved_free_courses', JSON.stringify(updated));
      } catch {
        // safe fallback
      }
      return updated;
    });
  };

  const handleMascotCheer = () => {
    setIsHighFiving(true);
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
    addXP(15);
    setActiveMascotSpeechIdx((prev) => (prev + 1) % MASCOT_SPEECHES.length);
    triggerToast('🎉 අරණ මාස්කොට් සමඟ එක්වී +15 XP උපයාගත්තා!');
    setTimeout(() => setIsHighFiving(false), 700);
  };

  const MASCOT_SPEECHES = [
    {
      si: 'ආයුබෝවන් මිත්‍රයා! 🌟 අද ලෝකයේ ඉහළම වටිනාකමක් ඇති Harvard, MIT, Google සහ Moratuwa සරසවියේ නොමිලේ පාඨමාලා හැදෑරීමෙන් ඔබේ අනාගතයට අගනා පදනමක් දමාගත හැකියි!',
      en: 'Welcome friend! 🌟 Level up your skills with globally verified free courses from Harvard, MIT, Google, and University of Moratuwa to supercharge your future!',
      ta: 'வணக்கம் நண்பரே! 🌟 ஹார்வர்ட், எம்ஐடி, கூகிள் மற்றும் மொரட்டுவ பல்கலைக்கழகங்களின் இலவச படிப்புகளைக் கற்று உங்கள் எதிர்காலத்தை பிரகாசமாக்குங்கள்!'
    },
    {
      si: '💡 නොමිලේ සහතික (Free Certificates) සහිත පාඨමාලා සඳහා "Free Certificate" filter එක භාවිතා කරන්න. Google සහ freeCodeCamp මගින් නොමිලේම සහතික පිරිනමයි!',
      en: '💡 Looking for free verified certificates? Enable the "Free Certificate" filter to discover accredited tracks from Google and freeCodeCamp at zero cost!',
      ta: '💡 இலவச சான்றிதழ்களுடன் கூடிய படிப்புகளைப் பார்க்க "Free Certificate" வடிகட்டியைப் பயன்படுத்துங்கள்!'
    },
    {
      si: '🚀 A/L සහ O/L විභාගවලට සමගාමීව Coding, Graphic Design හෝ Spoken English දිනකට විනාඩි 20ක් පුහුණු වීමෙන් විශාල වාසියක් අත්වේ!',
      en: '🚀 Investing just 20 minutes a day in Coding, Graphic Design, or Spoken English alongside your school exams builds an unstoppable competitive edge!',
      ta: '🚀 தினமும் 20 நிமிடங்கள் கோடிங், கிராபிக் டிசைன் அல்லது ஆங்கிலம் கற்பதன் மூலம் புதிய திறன்களை வளர்த்துக்கொள்ளுங்கள்!'
    }
  ];

  const currentSpeech = MASCOT_SPEECHES[activeMascotSpeechIdx];
  const speechText = language === 'si' ? currentSpeech.si : language === 'ta' ? currentSpeech.ta : currentSpeech.en;

  // Filtered courses logic
  const filteredCourses = useMemo(() => {
    return FREE_COURSES.filter((course) => {
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
  }, [selectedCategory, onlyCertificates, selectedLevel, searchQuery]);

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

      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Global & Sri Lankan Free Learning Hub • නොමිලේ විවෘත පාඨමාලා</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Free Online Courses (නිදහස් ඔන්ලයින් පාඨමාලා)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Harvard, MIT, Google, freeCodeCamp, MoraX සහ විවෘත විශ්වවිද්‍යාලයේ (OUSL) ලොව පිළිගත් නොමිලේ ඔන්ලයින් පාඨමාලා, නිබන්ධන සහ සහතික එකම තැනකින් ගවේෂණය කරන්න.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[260px] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Verified Free Tracks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                100% Free
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-amber-300">14+</div>
                <div className="text-[10px] text-slate-300">Curated Courses</div>
              </div>
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-cyan-300">6</div>
                <div className="text-[10px] text-slate-300">Knowledge Tracks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANIMATED MASCOT WELCOME & STUDY MOTIVATION CARD */}
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
                <span>අරණ ගුරු මාස්කොට් (Arana Study Guide)</span>
              </div>
              <button
                onClick={handleMascotCheer}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>ඊළඟ මගපෙන්වීම (Next Tip) →</span>
              </button>
            </div>

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

            <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> No Payment Required
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

          {/* Filters controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Free Certificate toggle button */}
            <button
              onClick={() => setOnlyCertificates(!onlyCertificates)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${
                onlyCertificates
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Free Certificate Only</span>
            </button>

            {/* Level Selector */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Beginner">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {COURSE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 shadow-2xs ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'si' ? cat.labelSinhala : language === 'ta' ? cat.labelTamil : cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. RESULTS COUNT & ACTIVE FILTER SUMMARY */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredCourses.length}</span> free courses
          {selectedCategory !== 'all' && ` in ${COURSE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
          {onlyCertificates && ' (with Free Certificate)'}
        </span>

        {bookmarkedIds.length > 0 && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{bookmarkedIds.length} Saved Course{bookmarkedIds.length > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* 5. COURSE CARDS GRID */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            කිසිදු පාඨමාලාවක් සොයාගත නොහැකි විය (No Courses Found)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            ඔබ සෙවූ වචන හෝ Filters වෙනස් කර නැවත උත්සාහ කරන්න.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyCertificates(false);
              setSelectedLevel('all');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isBookmarked = bookmarkedIds.includes(course.id);
            const isExpanded = expandedCourseId === course.id;
            const CategoryIcon = getCategoryIcon(course.category);

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group ${
                  course.featured
                    ? 'border-blue-300 dark:border-blue-800/80 ring-1 ring-blue-500/20'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Top Row: Category Icon, Badges & Bookmark */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shadow-2xs">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {course.provider}
                        </span>
                        <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                          {course.platform}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {course.freeCertificate && (
                        <span
                          title="Free Certificate Provided Upon Completion"
                          className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-0.5"
                        >
                          <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Cert</span>
                        </span>
                      )}

                      <button
                        onClick={() => toggleBookmark(course.id, course.title)}
                        className={`p-1.5 rounded-xl border transition ${
                          isBookmarked
                            ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                        }`}
                        title={isBookmarked ? 'Remove from Saved' : 'Save this Course'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Course Title & Sinhala Subtitle */}
                  <div>
                    {course.badge && (
                      <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-1.5">
                        {course.badge}
                      </span>
                    )}
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      {course.titleSinhala}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {language === 'si' ? course.descriptionSinhala : course.description}
                  </p>

                  {/* Metadata Chips: Level, Duration, Rating */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold ml-auto">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </span>
                  </div>

                  {/* Expandable "What You Will Learn" List */}
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'What you will learn (විෂය කරුණු)'}</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                        >
                          {(language === 'si' ? course.whatYouWillLearnSinhala : course.whatYouWillLearn).map(
                            (item, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom Action: "Visit Course / Start Learning" Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <a
                    href={course.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      try {
                        soundFX.playCorrect();
                        addXP(20);
                        triggerToast(`🚀 "${course.title}" වෙත පිවිසියා! (+20 XP)`);
                      } catch {
                        // safe
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-98"
                  >
                    <span>Start Learning (පාඨමාලාවට පිවිසෙන්න)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-100" />
                  </a>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{course.studentsCount}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {course.freeCertificate ? '✓ Free Certificate' : '✓ 100% Free Access'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 6. RECOMMENDED FREE PLATFORMS DIRECTORY */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
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
