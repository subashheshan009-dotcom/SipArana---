import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe2,
  Languages,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  FileText,
  Award,
  Search,
  Filter,
  Check,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Zap,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  Laptop,
  Flame,
  Printer
} from 'lucide-react';
import {
  MODERN_CURRICULUM_DATA,
  type ModernSubject,
  type ModernSubjectUnit,
  type ModernSubjectLesson,
  type VocabularyItem,
  type ModernSubjectQuizQuestion
} from '@/data/modernCurriculumData';
import ModernCurriculumMascot from '@/components/ModernCurriculumMascot';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface ModernLanguagesPageProps {
  onNavigate?: (pageId: string) => void;
}

type LevelFilter = 'all' | 'junior' | 'ol' | 'al';
type CategoryFilter = 'all' | 'modern_tech' | 'foreign_language';
type SubjectDetailTab = 'units' | 'vocabulary' | 'quiz' | 'cheatsheet';

export default function ModernLanguagesPage({ onNavigate }: ModernLanguagesPageProps) {
  const { language } = useLanguage();
  const { profile, addXP } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<ModernSubject | null>(null);

  // Step 3 state
  const [activeTab, setActiveTab] = useState<SubjectDetailTab>('units');
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ModernSubjectLesson | null>(null);

  // Audio pronunciation state
  const [playingVocabId, setPlayingVocabId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuizIds, setSubmittedQuizIds] = useState<string[]>([]);
  const [bookmarkedVocabIds, setBookmarkedVocabIds] = useState<string[]>([]);

  // Filter subjects based on selections
  const filteredSubjects = MODERN_CURRICULUM_DATA.filter((subj) => {
    // Level match
    if (selectedLevel !== 'all' && !subj.levels.includes(selectedLevel)) {
      return false;
    }
    // Category match
    if (categoryFilter !== 'all' && subj.categoryType !== categoryFilter) {
      return false;
    }
    // Search match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitleEn = subj.title.en.toLowerCase().includes(q);
      const matchTitleSi = subj.title.si.toLowerCase().includes(q);
      const matchNative = subj.nativeTitle.toLowerCase().includes(q);
      return matchTitleEn || matchTitleSi || matchNative;
    }
    return true;
  });

  const handleSelectLevel = (level: LevelFilter) => {
    setSelectedLevel(level);
    soundFX.playCorrect();
    setCurrentStep(2);
  };

  const handleSelectSubject = (subj: ModernSubject) => {
    setActiveSubject(subj);
    if (subj.units.length > 0) {
      setExpandedUnitId(subj.units[0].id);
      if (subj.units[0].lessons.length > 0) {
        setSelectedLesson(subj.units[0].lessons[0]);
      }
    }
    setActiveTab('units');
    soundFX.playCorrect();
    setCurrentStep(3);
  };

  const handleBackToStep = (step: 1 | 2) => {
    if (step === 1) {
      setActiveSubject(null);
      setCurrentStep(1);
    } else if (step === 2) {
      setCurrentStep(2);
    }
  };

  // Text to Speech Pronunciation Handler
  const handlePlayPronunciation = (vocab: VocabularyItem) => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support Speech Synthesis audio playback.');
      return;
    }

    if (playingVocabId === vocab.id) {
      window.speechSynthesis.cancel();
      setPlayingVocabId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingVocabId(vocab.id);

    const utterance = new SpeechSynthesisUtterance(vocab.term);
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    if (vocab.audioLangCode) {
      utterance.lang = vocab.audioLangCode;
    }

    utterance.onend = () => {
      setPlayingVocabId(null);
    };

    utterance.onerror = () => {
      setPlayingVocabId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleBookmarkVocab = (vocabId: string) => {
    setBookmarkedVocabIds((prev) =>
      prev.includes(vocabId) ? prev.filter((id) => id !== vocabId) : [...prev, vocabId]
    );
  };

  const handleQuizOptionSelect = (questionId: string, optionIndex: number) => {
    if (submittedQuizIds.includes(questionId)) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuestion = (q: ModernSubjectQuizQuestion) => {
    if (quizAnswers[q.id] === undefined) return;
    setSubmittedQuizIds((prev) => [...prev, q.id]);

    const isCorrect = quizAnswers[q.id] === q.correctIndex;
    if (isCorrect) {
      soundFX.playCorrect();
      addXP(25);
      try {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7, x: 0.5 }
        });
      } catch {
        // safe fallback
      }
    } else {
      soundFX.playIncorrect();
    }
  };

  const getLevelLabel = () => {
    if (selectedLevel === 'junior') return 'Junior Secondary (Grades 6-9) - කණිෂ්ඨ ද්විතීයික';
    if (selectedLevel === 'ol') return 'G.C.E. O/L (Grades 10-11) - අ.පො.ස. සාමාන්‍ය පෙළ';
    if (selectedLevel === 'al') return 'G.C.E. A/L (Grades 12-13) - අ.පො.ස. උසස් පෙළ';
    return 'සියලුම මට්ටම් (All Levels)';
  };

  const printCurrentLesson = () => {
    window.print();
  };

  return (
    <div id="modern-languages-page" className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* 1. TOP HEADER & EDUCATIONAL REFORMS BANNER */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>නවතම අධ්‍යාපන ප්‍රතිසංස්කරණ 2026 • Ministry of Education & NIE Guidelines</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              නවීන විෂයයන් & විදේශ භාෂා පීඨය
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
              පාසල් විෂය මාලාවට අලුතින් එක් වූ ජපන්, කොරියානු, ප්‍රංශ, ජර්මන්, හින්දි, චීන, රුසියන් භාෂා සහ ICT, ජීවිතයට තාක්ෂණවේදය, ව්‍යවසායකත්ව විෂය නිර්දේශ, ශ්‍රව්‍ය උච්චාරණ සහ ආදර්ශ අභ්‍යාස මෙතැනින් අධ්‍යයනය කරන්න!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-xl bg-white/15 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-amber-300" />
                <span>විදේශ භාෂා 7ක් (Japanese, Korean, French, etc.)</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/15 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-300" />
                <span>නවීන තාක්ෂණය & ICT</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/15 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live Audio Pronunciations</span>
              </span>
            </div>
          </div>

          {/* Step Progress Tracker Card */}
          <div className="bg-white/10 dark:bg-slate-900/40 border border-white/20 rounded-2xl p-4 backdrop-blur-md flex flex-col gap-3 min-w-[240px] w-full md:w-auto">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
              පියවරෙන් පියවර මඟපෙන්වීම
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 flex items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep === step
                        ? 'bg-amber-400 text-slate-950 scale-110 shadow-md ring-2 ring-white'
                        : currentStep > step
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 rounded-full ${
                        currentStep > step ? 'bg-emerald-400' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-white">
              {currentStep === 1 && '1. අධ්‍යාපන මට්ටම තෝරන්න'}
              {currentStep === 2 && '2. විෂයය හෝ භාෂාව තෝරන්න'}
              {currentStep === 3 && '3. පාඩම් & ශ්‍රව්‍ය උච්චාරණ'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. KAVI THE OWL PROACTIVE MASCOT GUIDANCE */}
      <ModernCurriculumMascot
        currentStep={currentStep}
        selectedLevelName={getLevelLabel()}
        selectedSubjectName={activeSubject ? activeSubject.title.si : undefined}
        onResetFlow={() => handleBackToStep(1)}
      />

      {/* 3. STEP-BY-STEP INTERACTIVE WIZARD BODY */}
      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT STUDENT LEVEL / STREAM */}
        {currentStep === 1 && (
          <motion.section
            key="step-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>පියවර 1: ඔබේ අධ්‍යාපන මට්ටම හෝ විෂය ධාරාව තෝරන්න</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select your Student Level to view all curriculum-approved modern and foreign language subjects.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Option A: Junior Secondary */}
              <div
                onClick={() => handleSelectLevel('junior')}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🌱</span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
                      Grades 6 - 9
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition">
                    කණිෂ්ඨ ද්විතීයික (Junior Secondary)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    6 සිට 9 ශ්‍රේණි දක්වා හඳුන්වා දී ඇති මූලික විදේශ භාෂා හැඳින්වීම්, ඩිජිටල් සාක්ෂරතාව සහ ජීවිතයට තාක්ෂණවේදය.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🇯🇵 Japanese Basics
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🇰🇷 Korean Intro
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      💻 Junior ICT
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🛠️ Life Tech
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition">
                  <span>විෂයයන් තෝරන්න (Select Subjects)</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option B: G.C.E. O/L */}
              <div
                onClick={() => handleSelectLevel('ol')}
                className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-white to-blue-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/30 border-2 border-indigo-400/80 dark:border-indigo-500/60 hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🎯</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs">
                      Grades 10 - 11 • O/L
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-200 group-hover:text-indigo-600 transition">
                    අ.පො.ස. සාමාන්‍ය පෙළ (G.C.E. O/L)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    සාමාන්‍ය පෙළ විභාගය සඳහා නිල වශයෙන් පවතින විදේශ භාෂා කූඩ (Foreign Language Baskets), ICT (විෂය අංක 80), සහ ව්‍යවසායකත්වය.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      🇯🇵 Japanese O/L
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      🇫🇷 French O/L
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      🇩🇪 German O/L
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      🇮🇳 Hindi O/L
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      💻 ICT (Subj 80)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-indigo-200/60 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 group-hover:translate-x-1 transition">
                  <span>සා/පෙළ විෂයයන් පෙන්වන්න</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option C: G.C.E. A/L */}
              <div
                onClick={() => handleSelectLevel('al')}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🏛️</span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs">
                      Grades 12 - 13 • A/L
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition">
                    අ.පො.ස. උසස් පෙළ (G.C.E. A/L)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    උසස් පෙළ කලා හා තාක්ෂණවේදය ධාරාවල විදේශ භාෂා 7ම (Korean, Japanese, French, German, Hindi, Chinese, Russian) සහ A/L ICT.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🇰🇷 Korean (TOPIK/A-L)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🇨🇳 Chinese Mandarin
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🇷🇺 Russian A/L
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      💻 A/L ICT (Subj 20)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition">
                  <span>උසස් පෙළ විෂයයන් පෙන්වන්න</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Explore All Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => handleSelectLevel('all')}
                className="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                සියලුම විෂයයන් එකවර බලන්න (Explore All 10 Subjects) →
              </button>
            </div>
          </motion.section>
        )}

        {/* STEP 2: SELECT SPECIFIC MODERN OR FOREIGN SUBJECT */}
        {currentStep === 2 && (
          <motion.section
            key="step-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Navigation Bar & Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBackToStep(1)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  title="පෙර පියවරට (Back to Step 1)"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Globe2 className="w-6 h-6 text-amber-500" />
                    <span>පියවර 2: විෂයය හෝ භාෂාව තෝරාගන්න</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    තෝරාගත් මට්ටම: <strong className="text-slate-800 dark:text-slate-200">{getLevelLabel()}</strong>
                  </p>
                </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="විෂයය හෝ භාෂාව සොයන්න..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full text-xs font-semibold">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    සියල්ල ({MODERN_CURRICULUM_DATA.length})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('foreign_language')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer ${
                      categoryFilter === 'foreign_language'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    විදේශ භාෂා (7)
                  </button>
                  <button
                    onClick={() => setCategoryFilter('modern_tech')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer ${
                      categoryFilter === 'modern_tech'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    නවීන තාක්ෂණය (3)
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubjects.map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => handleSelectSubject(subj)}
                  className={`p-5 rounded-3xl bg-gradient-to-br ${subj.gradientBg} border-2 ${subj.borderColor} hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl filter drop-shadow-sm">{subj.flagOrIcon}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {subj.code}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {subj.nativeTitle}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {subj.title.si}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {subj.title.en}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {subj.description.si}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/70 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
                        <BookOpen className="w-3 h-3 text-blue-500" />
                        <span>ඒකක {subj.units.length}ක්</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/70 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
                        <Volume2 className="w-3 h-3 text-emerald-500" />
                        <span>ශ්‍රව්‍ය උච්චාරණ ({subj.vocabularyList.length})</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/70 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
                        <HelpCircle className="w-3 h-3 text-amber-500" />
                        <span>ආදර්ශ ප්‍රශ්න ({subj.modelQuestions.length})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <span>පාඩම් මාලාව අරඹන්න</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  ගැළපෙන විෂයයක් හමු නොවීය.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setSelectedLevel('all');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  ෆිල්ටර නැවත සකසන්න (Reset Filters)
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* STEP 3: DEEP INTERACTIVE SUBJECT EXPLORER */}
        {currentStep === 3 && activeSubject && (
          <motion.section
            key="step-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Subject Hero Bar & Breadcrumb */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <button
                  onClick={() => handleBackToStep(2)}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex-shrink-0"
                  title="විෂය ලැයිස්තුවට (Back to Subject List)"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeSubject.flagOrIcon}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                      {activeSubject.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {activeSubject.gradeRange}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {activeSubject.title.si} ({activeSubject.nativeTitle})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    නිල නිර්දේශය: {activeSubject.officialGuideRef}
                  </p>
                </div>
              </div>

              {/* Print / Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={printCurrentLesson}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>A4 මුද්‍රණය (Print)</span>
                </button>
              </div>
            </div>

            {/* 4 Interactive Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('units')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'units'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>විෂය නිර්දේශ ඒකක & පාඩම් ({activeSubject.units.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'vocabulary'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>වචන මාලාව & ශ්‍රව්‍ය උච්චාරණ ({activeSubject.vocabularyList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>විභාග ආදර්ශ ප්‍රශ්න ({activeSubject.modelQuestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('cheatsheet')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'cheatsheet'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>කෙටි සටහන් & ව්‍යාකරණ රීති</span>
              </button>
            </div>

            {/* TAB 1: UNITS & STRUCTURED LESSONS */}
            {activeTab === 'units' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Unit Navigator */}
                <div className="space-y-4 lg:col-span-1">
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    නිල ඒකක ලැයිස්තුව (NIE Units)
                  </h3>

                  <div className="space-y-3">
                    {activeSubject.units.map((unit) => (
                      <div
                        key={unit.id}
                        onClick={() => {
                          setExpandedUnitId(unit.id);
                          if (unit.lessons.length > 0) {
                            setSelectedLesson(unit.lessons[0]);
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                          expandedUnitId === unit.id
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-black text-[10px]">
                            Unit 0{unit.unitNumber}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {unit.allocatedPeriods} Periods
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">
                          {unit.title.si}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {unit.competencyLevel}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Lesson Detail Content */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedLesson ? (
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            පාඩම 0{selectedLesson.lessonNumber} • කාලච්ඡේද {selectedLesson.niePeriodCount}ක්
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                            {selectedLesson.title.si}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedLesson.title.en}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{selectedLesson.duration}</span>
                        </span>
                      </div>

                      {/* Lesson Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>පාඩම් සාරාංශය (Theory & Summary)</span>
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                          {selectedLesson.summary.si}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>ප්‍රධාන විභාග කරුණු (Key Competencies)</span>
                        </h4>
                        <ul className="space-y-2">
                          {selectedLesson.keyPoints.si.map((pt, idx) => (
                            <li
                              key={idx}
                              className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40"
                            >
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practical Activity if available */}
                      {selectedLesson.practicalActivity && (
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-700/60 space-y-1.5">
                          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>ප්‍රායෝගික අභ්‍යාසය (Hands-on Activity)</span>
                          </h4>
                          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            {selectedLesson.practicalActivity.si}
                          </p>
                        </div>
                      )}

                      {/* Exam Tip */}
                      {selectedLesson.examTip && (
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-300/80 dark:border-blue-700/60 space-y-1.5">
                          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                            <Zap className="w-4 h-4" />
                            <span>විභාග රහස් උපදෙස (Exam Secret Tip)</span>
                          </h4>
                          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                            {selectedLesson.examTip.si}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        වම් පසින් ඒකකයක් තෝරන්න.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: VOCABULARY & LIVE AUDIO PRONUNCIATION PLAYER */}
            {activeTab === 'vocabulary' && (
              <div className="space-y-6">
                {/* Audio Controls Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:to-pink-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        ශ්‍රව්‍ය උච්චාරණ වාදකය (Live Native Speech Player)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Click the speaker icon to listen to native pronunciation with real-time text-to-speech.
                      </p>
                    </div>
                  </div>

                  {/* Playback speed toggle */}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">වේගය (Speed):</span>
                    {[0.75, 1.0, 1.25].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setAudioSpeed(speed)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          audioSpeed === speed
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vocabulary Flashcards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSubject.vocabularyList.map((vocab) => {
                    const isPlaying = playingVocabId === vocab.id;
                    const isBookmarked = bookmarkedVocabIds.includes(vocab.id);

                    return (
                      <div
                        key={vocab.id}
                        className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all space-y-3 relative ${
                          isPlaying
                            ? 'border-indigo-500 ring-2 ring-indigo-400/40 shadow-lg'
                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {/* Top row: native word & speech trigger */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-wide">
                              {vocab.term}
                            </span>
                            {vocab.transcription && (
                              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                {vocab.transcription}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleBookmarkVocab(vocab.id)}
                              className={`p-1.5 rounded-full transition cursor-pointer ${
                                isBookmarked
                                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                              title="මතකයේ තබාගන්න (Bookmark)"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handlePlayPronunciation(vocab)}
                              className={`p-2.5 rounded-full transition shadow-xs cursor-pointer ${
                                isPlaying
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                              title="උච්චාරණයට සවන් දෙන්න (Listen)"
                            >
                              {isPlaying ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Meaning in Sinhala & English */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            🇱🇰 සිංහල: {vocab.meaning.si}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            🇬🇧 English: {vocab.meaning.en}
                          </p>
                        </div>

                        {/* Example sentence if present */}
                        {vocab.exampleSentence && (
                          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1 text-xs">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                              💬 {vocab.exampleSentence.original}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              "{vocab.exampleSentence.translationSi}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: PRACTICE QUIZZES & MODEL QUESTIONS */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        විභාග ආදර්ශ ප්‍රශ්න පත්‍ර (Exam Model MCQs)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        නිවැරදි පිළිතුර තෝරා Submit කරන්න. සෑම නිවැරදි පිළිතුරකටම +25 XP හිමිවේ!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {activeSubject.modelQuestions.map((q, idx) => {
                    const isSubmitted = submittedQuizIds.includes(q.id);
                    const selectedIdx = quizAnswers[q.id];
                    const isCorrect = isSubmitted && selectedIdx === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-xs">
                            ප්‍රශ්නය 0{idx + 1}
                          </span>
                          {isSubmitted && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {isCorrect ? '✅ නිවැරදියි (+25 XP)' : '❌ වැරදියි'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                          {q.question.si}
                        </h4>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {q.options.si.map((opt, optIdx) => {
                            const isSelected = selectedIdx === optIdx;
                            let optionClass = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                            if (isSubmitted) {
                              if (optIdx === q.correctIndex) {
                                optionClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                              } else if (isSelected && !isCorrect) {
                                optionClass = 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200';
                              }
                            } else if (isSelected) {
                              optionClass = 'bg-blue-500/15 border-blue-600 text-blue-900 dark:text-blue-200 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                                className={`p-3.5 rounded-2xl border-2 text-left text-xs transition flex items-center gap-3 cursor-pointer ${optionClass}`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Submit Button & Explanation */}
                        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {!isSubmitted ? (
                            <button
                              disabled={selectedIdx === undefined}
                              onClick={() => handleSubmitQuestion(q)}
                              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                            >
                              පිළිතුර තහවුරු කරන්න (Submit Answer)
                            </button>
                          ) : (
                            <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                              <p className="font-bold text-slate-800 dark:text-slate-200">
                                💡 නිවැරදි විවරණය (Explanation):
                              </p>
                              <p className="text-slate-600 dark:text-slate-400">
                                {q.explanation.si}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: CHEATSHEET & RULES */}
            {activeTab === 'cheatsheet' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>{activeSubject.quickCheatSheet.title.si}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    විභාගයට පෙර මතක තබා ගත යුතු ප්‍රධාන සූත්‍ර සහ ව්‍යාකරණ කෙටි රීති.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSubject.quickCheatSheet.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-800/50 space-y-1.5"
                    >
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                        රීතිය 0{idx + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {rule.si}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {rule.en}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span>නිල ගුරු මාර්ගෝපදේශ (Guru Potha Reference)</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    මෙම විෂය නිර්දේශ ඒකක ජාතික අධ්‍යාපන ආයතනයේ (National Institute of Education - NIE) නවතම විෂය ප්‍රතිසංස්කරණවලට සහ විභාග දෙපාර්තමේන්තුවේ ප්‍රමිතීන්ට අනුකූලව සකස් කර ඇත.
                  </p>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
