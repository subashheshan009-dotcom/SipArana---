import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  PlayCircle,
  HelpCircle,
  Download,
  Bookmark,
  BookmarkCheck,
  Award,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookMarked,
  Calculator,
  Dna,
  TrendingUp,
  Cpu,
  Terminal,
  Briefcase,
  FlaskConical,
  Zap,
  RotateCcw,
  Languages,
  Check,
  Laptop,
  BarChart3,
  Globe2,
  Wrench,
  Landmark,
  Tv,
  Scale,
  Flower2,
  SunMedium
} from 'lucide-react';
import { SUBJECTS_DATA } from '@/data/mockData';
import { downloadPrintableHTMLDoc, generatePastPaperHTML } from '@/utils/fileDownloader';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';
import {
  QUIZ_CATEGORIES,
  QUIZ_STREAMS,
  type QuizCategory,
  type QuizStream
} from '@/data/quizData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCountry } from '@/context/CountryContext';
import type { Subject, Lesson } from '@/types';
import AranaMascot from '@/components/AranaMascot';
import SubjectGuideMascot from '@/components/SubjectGuideMascot';
import { soundFX } from '@/utils/audioUtils';

type WizardStep = 'category' | 'stream' | 'subject' | 'details';

export default function SubjectsPage() {
  const { profile, toggleBookmarkPaper, addXP } = useAuth();
  const { language } = useLanguage();
  const { country, curriculum, dictionary, stages } = useCountry();

  const isGrade5 =
    profile?.grade === 5 ||
    profile?.level === 'SCHOLARSHIP' ||
    profile?.stream === 'Grade 5 Scholarship' ||
    !!profile?.isKidMode;

  const scholarshipCategory = QUIZ_CATEGORIES.find((c) => c.id === 'scholarship') || QUIZ_CATEGORIES[0];
  const scholarshipStream = QUIZ_STREAMS.find((s) => s.id === 'stream_scholarship_core') || QUIZ_STREAMS[0];

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>(isGrade5 ? 'subject' : 'category');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(isGrade5 ? scholarshipCategory : null);
  const [selectedStream, setSelectedStream] = useState<QuizStream | null>(isGrade5 ? scholarshipStream : null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'papers'>('syllabus');

  // Ensure Grade 5 isolation state sync
  React.useEffect(() => {
    if (isGrade5) {
      setSelectedCategory(scholarshipCategory);
      setSelectedStream(scholarshipStream);
      if (currentStep === 'category' || currentStep === 'stream') {
        setCurrentStep('subject');
      }
    }
  }, [isGrade5]);

  // Search filter inside subject list
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz interactive state inside active lesson
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Download & File handling state
  const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | undefined>(undefined);
  const [activeDownloadName, setActiveDownloadName] = useState<string | undefined>(undefined);

  const handleDownloadPaper = (paper: any) => {
    if (!activeSubject) return;
    setDownloadingPaperId(paper.id);

    const filename = `SipArana_GCE_${activeSubject.titleEnglish.replace(/\s+/g, '_')}_${paper.year}_${paper.part.replace(/\s+/g, '_')}.html`;
    const html = generatePastPaperHTML(
      activeSubject.titleEnglish,
      activeSubject.titleSinhala,
      paper.year,
      paper.part,
      paper.medium,
      profile?.name || 'SipArana Student'
    );

    setTimeout(() => {
      const res = downloadPrintableHTMLDoc(html, filename, true);
      setDownloadingPaperId(null);
      addXP(20);

      if (!res.success || res.isPopupBlocked) {
        if (res.blobUrl) {
          setActiveDownloadUrl(res.blobUrl);
          setActiveDownloadName(filename);
        }
        setShowPermissionModal(true);
      }
    }, 500);
  };

  // Icon renderer helper
  const renderIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Dna': return <Dna className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'Languages': return <Languages className={className} />;
      case 'SunMedium': return <SunMedium className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'Globe2': return <Globe2 className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Flower2': return <Flower2 className={className} />;
      case 'BookMarked': return <BookMarked className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  // Helper: Get available streams for selected category
  const availableStreams = selectedCategory
    ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
    : [];

  // Helper: Get subjects for selected stream & category
  const getSubjectsForStream = (streamId: string, categoryId: string): Subject[] => {
    return SUBJECTS_DATA.filter((sub) => {
      if (categoryId === 'scholarship') {
        return ['sub_sch_sinhala', 'sub_sch_maths', 'sub_sch_env', 'sub_sch_iq'].includes(sub.id);
      }
      if (categoryId === 'al') {
        if (streamId === 'stream_al_maths') {
          return ['sub_maths', 'sub_physics', 'sub_chemistry', 'sub_ict'].includes(sub.id);
        }
        if (streamId === 'stream_al_bio') {
          return ['sub_biology', 'sub_chemistry', 'sub_physics'].includes(sub.id);
        }
        if (streamId === 'stream_al_commerce') {
          return ['sub_accounting', 'sub_bs', 'sub_econ', 'sub_ict'].includes(sub.id);
        }
        if (streamId === 'stream_al_arts') {
          return ['sub_art_sinhala', 'sub_art_media', 'sub_art_pol', 'sub_art_bc'].includes(sub.id);
        }
        if (streamId === 'stream_al_tech') {
          return ['sub_et', 'sub_sft', 'sub_ict'].includes(sub.id);
        }
      }
      if (categoryId === 'ol') {
        if (streamId === 'stream_ol_core') {
          return ['sub_ol_science', 'sub_ol_maths', 'sub_ol_history', 'sub_ol_sinhala', 'sub_ol_buddhism', 'sub_ol_english'].includes(sub.id);
        }
        if (streamId === 'stream_ol_electives') {
          return ['sub_ol_ict', 'sub_ol_commerce', 'sub_ol_geography'].includes(sub.id);
        }
      }
      if (categoryId === 'junior') {
        return ['sub_ol_maths', 'sub_ol_science', 'sub_ol_history', 'sub_ol_sinhala', 'sub_ol_buddhism', 'sub_ol_english', 'sub_ol_geography'].includes(sub.id);
      }
      if (categoryId === 'uni') {
        if (streamId === 'stream_uni_computing') {
          return ['sub_uni_dsa', 'sub_ict'].includes(sub.id);
        }
        if (streamId === 'stream_uni_business') {
          return ['sub_uni_finmgt', 'sub_accounting', 'sub_econ'].includes(sub.id);
        }
      }
      return false;
    });
  };

  const streamSubjects = selectedStream && selectedCategory
    ? getSubjectsForStream(selectedStream.id, selectedCategory.id)
    : [];

  // Filtered by search query
  const filteredStreamSubjects = streamSubjects.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.titleSinhala.toLowerCase().includes(q) ||
      sub.titleEnglish.toLowerCase().includes(q) ||
      sub.code.toLowerCase().includes(q) ||
      sub.description.toLowerCase().includes(q) ||
      (sub.guruPothaReference && sub.guruPothaReference.toLowerCase().includes(q))
    );
  });

  // Navigation handlers
  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setSelectedStream(null);
    setActiveSubject(null);
    setActiveLesson(null);
    setSearchQuery('');

    const matchingStreams = QUIZ_STREAMS.filter((s) => s.categoryId === category.id);
    if (matchingStreams.length === 1) {
      setSelectedStream(matchingStreams[0]);
      setCurrentStep('subject');
    } else {
      setCurrentStep('stream');
    }
  };

  const handleSelectStream = (stream: QuizStream) => {
    setSelectedStream(stream);
    setActiveSubject(null);
    setActiveLesson(null);
    setSearchQuery('');
    setCurrentStep('subject');
  };

  const handleSelectSubject = (sub: Subject) => {
    setActiveSubject(sub);
    setActiveLesson(sub.units[0]?.lessons[0] || null);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setActiveTab('syllabus');
    setCurrentStep('details');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleGoBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('subject');
      setActiveSubject(null);
      setActiveLesson(null);
    } else if (currentStep === 'subject') {
      if (isGrade5) {
        // Keep in scholarship subjects
        return;
      }
      const matchingStreams = selectedCategory
        ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
        : [];
      if (matchingStreams.length === 1) {
        setCurrentStep('category');
        setSelectedCategory(null);
        setSelectedStream(null);
      } else {
        setCurrentStep('stream');
        setSelectedStream(null);
      }
    } else if (currentStep === 'stream') {
      if (isGrade5) {
        setCurrentStep('subject');
        return;
      }
      setCurrentStep('category');
      setSelectedCategory(null);
    }
  };

  const handleResetFlow = () => {
    if (isGrade5) {
      setSelectedCategory(scholarshipCategory);
      setSelectedStream(scholarshipStream);
      setCurrentStep('subject');
      setActiveSubject(null);
      setActiveLesson(null);
      setSearchQuery('');
      return;
    }
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedStream(null);
    setActiveSubject(null);
    setActiveLesson(null);
    setSearchQuery('');
  };

  const displayCategories = isGrade5
    ? QUIZ_CATEGORIES.filter((c) => c.id === 'scholarship')
    : QUIZ_CATEGORIES.filter((c) => c.id !== 'scholarship');

  // Count total past papers in active subject
  const activeSubjectPastPapersCount = activeSubject ? activeSubject.pastPapers.length : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Hero Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden ${
          isGrade5
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 border border-amber-400/50'
            : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900'
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-sm">
            {isGrade5 ? <Sparkles className="w-3.5 h-3.5 text-amber-200" /> : <BookOpen className="w-3.5 h-3.5 text-amber-300" />}
            <span>
              {isGrade5
                ? `${dictionary.ministryShort} • ${dictionary.countryName} Primary & Guru Potha Guidelines`
                : `${dictionary.heroBadge} • ${dictionary.officialTeacherGuideRef}`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {isGrade5
              ? (language === 'si' ? `${dictionary.countryName} ප්‍රාථමික විෂයයන් සහ ගුරු පොත්` : `${dictionary.countryName} Primary Subjects & Official Guide`)
              : (language === 'si' ? `${dictionary.curriculumTitle} විෂය නිර්දේශය සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර` : `${dictionary.curriculumTitle} Curriculum & Past Papers`)}
          </h1>
          <p className="text-sm sm:text-base text-slate-100 dark:text-slate-200 leading-relaxed">
            {isGrade5
              ? 'සිංහල භාෂාව, ප්‍රාථමික ගණිතය, පරිසරය ආශ්‍රිත ක්‍රියාකාරකම් සහ බුද්ධි පරීක්ෂණ (IQ) විෂයන් සඳහා ඒකක පාඩම්, විනෝද අභ්‍යාස සහ ආදර්ශ ප්‍රශ්න පත්‍ර.'
              : 'ඔබේ අධ්‍යාපන මට්ටම හා විෂය ධාරාව අනුව පහසුවෙන් ඒකක පාඩම්, සූත්‍ර සටහන්, ස්වයං ඇගයීම් සහ Marking Schemes සහිත විභාග ප්‍රශ්න පත්‍ර පරිශීලනය කරන්න.'}
          </p>

          {/* Breadcrumb Steps indicator */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-bold text-slate-100">
            {!isGrade5 ? (
              <>
                <button
                  onClick={() => handleResetFlow()}
                  className={`px-3 py-1 rounded-lg transition ${
                    currentStep === 'category'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  1. අධ්‍යාපන මට්ටම (Category)
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                <button
                  disabled={!selectedCategory}
                  onClick={() => {
                    if (selectedCategory) {
                      setCurrentStep('stream');
                      setActiveSubject(null);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg transition disabled:opacity-40 ${
                    currentStep === 'stream'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  2. විෂය ධාරාව (Stream)
                  {selectedStream && ` (${selectedStream.nameSinhala.split(' ')[0]})`}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-white/20 text-white font-extrabold flex items-center gap-1">
                <span>🦉 5 වසර ශිෂ්‍යත්වය (Guru Potha)</span>
              </span>
            )}

            <button
              disabled={!selectedStream}
              onClick={() => {
                if (selectedStream) {
                  setCurrentStep('subject');
                  setActiveSubject(null);
                }
              }}
              className={`px-3 py-1 rounded-lg transition disabled:opacity-40 ${
                currentStep === 'subject'
                  ? 'bg-white text-amber-900 font-black shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isGrade5 ? 'ප්‍රධාන විෂයයන් (Subjects)' : '3. විෂයය (Subject)'}
            </button>

            {currentStep === 'details' && activeSubject && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-black shadow-md">
                  {isGrade5 ? `📖 ${activeSubject.titleSinhala}` : `4. ${activeSubject.titleSinhala.split(' ')[0]} (පාඩම් & ප්‍රශ්න පත්‍ර)`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Animated Mascot Guide */}
      <SubjectGuideMascot
        currentStep={currentStep}
        selectedCategoryName={
          selectedCategory
            ? language === 'si'
              ? selectedCategory.nameSinhala
              : selectedCategory.name
            : undefined
        }
        selectedStreamName={
          selectedStream
            ? language === 'si'
              ? selectedStream.nameSinhala
              : selectedStream.name
            : undefined
        }
        selectedSubjectName={
          activeSubject
            ? language === 'si'
              ? activeSubject.titleSinhala
              : activeSubject.titleEnglish
            : undefined
        }
        totalSubjectsFound={filteredStreamSubjects.length}
        totalPastPapersCount={activeSubjectPastPapersCount}
        onResetFlow={handleResetFlow}
      />

      {/* 3. Wizard Step Views */}
      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* STEP 1: CATEGORY SELECTION                                               */}
        {/* ========================================================================= */}
        {currentStep === 'category' && (
          <motion.div
            key="step_category"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>පියවර 1: ඔබේ අධ්‍යාපන මට්ටම තෝරන්න</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select your academic stage to load the correct national syllabus & past paper repository
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayCategories.map((category) => {
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.015, translateY: -4 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelectCategory(category)}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-6 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.gradient} opacity-10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                          {renderIcon(category.icon, 'w-7 h-7')}
                        </div>
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {category.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {language === 'si' ? category.nameSinhala : category.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                          {category.name}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'si' ? category.descriptionSinhala : category.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      <span>විෂය ධාරා තෝරන්න (Select Stream)</span>
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: STREAM SELECTION                                                 */}
        {/* ========================================================================= */}
        {currentStep === 'stream' && selectedCategory && (
          <motion.div
            key="step_stream"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shadow-xs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                    පියවර 2: විෂය ධාරාව (Stream) තෝරන්න
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {language === 'si' ? selectedCategory.nameSinhala : selectedCategory.name} සඳහා අදාළ විෂය ධාරාව
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetFlow}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>මට්ටම වෙනස් කරන්න</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableStreams.map((stream) => {
                const subCount = getSubjectsForStream(stream.id, selectedCategory.id).length;
                return (
                  <motion.div
                    key={stream.id}
                    whileHover={{ scale: 1.02, translateY: -4 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelectStream(stream)}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stream.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                          {renderIcon(stream.icon, 'w-6 h-6')}
                        </div>
                        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                          {subCount} Subjects Available
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {language === 'si' ? stream.nameSinhala : stream.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                          {stream.name}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {language === 'si' ? stream.descriptionSinhala : stream.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>විෂයයන් බලන්න (View Subjects)</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SUBJECT SELECTION                                                */}
        {/* ========================================================================= */}
        {currentStep === 'subject' && selectedStream && selectedCategory && (
          <motion.div
            key="step_subject"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shadow-xs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {selectedStream.nameSinhala}
                    </span>
                    <span className="text-xs text-slate-400">
                      {filteredStreamSubjects.length} Subjects
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                    පියවර 3: විෂයය (Subject) තෝරාගන්න
                  </h2>
                </div>
              </div>

              {/* Search bar inside this stream */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="විෂය නම හෝ කේතය සොයන්න..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreamSubjects.map((sub) => {
                const percent = Math.round((sub.completedModules / sub.totalModules) * 100);
                const isMatchMyGrade = profile?.grade ? sub.grades.includes(profile.grade) : false;

                return (
                  <motion.div
                    key={sub.id}
                    whileHover={{ scale: 1.015, translateY: -4 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelectSubject(sub)}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {sub.code}
                          </span>
                          {isMatchMyGrade && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                              ඔබට නියමිතයි
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {sub.units.length} Units
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {sub.titleSinhala}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {sub.titleEnglish} • <span className="text-blue-600 dark:text-blue-400 font-semibold">{sub.stream}</span>
                        </p>
                      </div>

                      {/* Grades badge if applicable */}
                      {sub.grades.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">අදාළ ශ්‍රේණි:</span>
                          {sub.grades.map((g) => (
                            <span key={g} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>

                      {sub.guruPothaReference && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
                          <BookMarked className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{sub.guruPothaReference}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>සම්පූර්ණ ප්‍රගතිය</span>
                        <span className="text-blue-600 dark:text-blue-400">{percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-medium">
                        <span>පසුගිය ප්‍රශ්න පත්‍ර: {sub.pastPapers.length} ක්</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          විවෘත කරන්න <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredStreamSubjects.length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
                  සෙවුමට අදාළ විෂයයන් හමු නොවීය
                </h3>
                <p className="text-xs text-slate-500">
                  කරුණාකර සෙවුම් පදය වෙනස් කර නැවත උත්සාහ කරන්න.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition"
                >
                  සෙවුම ඉවත් කරන්න
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DETAILED SUBJECT VIEW (UNITS & PAST PAPERS)                        */}
        {/* ========================================================================= */}
        {currentStep === 'details' && activeSubject && (
          <motion.div
            key="step_details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header with Back button & Tab Navigator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shadow-xs"
                  title="Back to subject selection"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {activeSubject.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{activeSubject.stream}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                    {activeSubject.titleSinhala} ({activeSubject.titleEnglish})
                  </h2>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'syllabus'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>පාඩම් මාලාව (Units)</span>
                </button>
                <button
                  onClick={() => setActiveTab('papers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'papers'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>පසුගිය ප්‍රශ්න පත්‍ර ({activeSubject.pastPapers.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: SYLLABUS & LESSONS */}
            {activeTab === 'syllabus' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Units & Lessons List */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    විෂය ඒකක සහ පාඩම් ({activeSubject.units.length} Units)
                  </h3>

                  <div className="space-y-3">
                    {activeSubject.units.map((unit) => (
                      <div
                        key={unit.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            Unit {unit.unitNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {unit.durationMinutes} mins
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {unit.titleSinhala || unit.title}
                        </h4>

                        {/* Lessons inside unit */}
                        <div className="space-y-1.5 pt-1">
                          {unit.lessons.map((les) => {
                            const isActive = activeLesson?.id === les.id;
                            return (
                              <button
                                key={les.id}
                                onClick={() => handleSelectLesson(les)}
                                className={`w-full p-2.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition ${
                                  isActive
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {les.isCompleted ? (
                                    <CheckCircle2
                                      className={`w-4 h-4 flex-shrink-0 ${
                                        isActive ? 'text-white' : 'text-emerald-500'
                                      }`}
                                    />
                                  ) : (
                                    <PlayCircle
                                      className={`w-4 h-4 flex-shrink-0 ${
                                        isActive ? 'text-white' : 'text-slate-400'
                                      }`}
                                    />
                                  )}
                                  <span className="truncate">{les.titleSinhala || les.title}</span>
                                </div>
                                <span className="text-[10px] opacity-80 flex-shrink-0">{les.duration}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Active Lesson Detail Viewer */}
                <div className="lg:col-span-7">
                  {activeLesson ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            ක්‍රියාකාරී පාඩම (Active Lesson)
                          </span>
                          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                            {activeLesson.titleSinhala || activeLesson.title}
                          </h3>
                          <p className="text-xs text-slate-400">{activeLesson.title}</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          ⏱️ {activeLesson.duration}
                        </span>
                      </div>

                      {/* Lesson Summary */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                          පාඩමේ සාරාංශය (Summary)
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {activeLesson.summary}
                        </p>
                      </div>

                      {/* Key Points */}
                      {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                            ප්‍රධාන කරුණු (Key Principles & Rules)
                          </h4>
                          <div className="space-y-2">
                            {activeLesson.keyPoints.map((pt, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30"
                              >
                                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Formula Box */}
                      {activeLesson.formulaList && activeLesson.formulaList.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                            සූත්‍ර සහ ප්‍රමේය (Formulas)
                          </h4>
                          <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs space-y-2 border border-slate-800">
                            {activeLesson.formulaList.map((f, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-slate-500">▶</span>
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Interactive Concept Check Quiz */}
                      {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-amber-500" />
                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                              ස්වයං ඇගයීම් ප්‍රශ්නය (Instant Concept Check)
                            </h4>
                          </div>

                          {activeLesson.quiz.map((q) => (
                            <div
                              key={q.id}
                              className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 p-5 rounded-2xl space-y-3"
                            >
                              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                                {q.questionSinhala || q.question}
                              </p>

                              <div className="space-y-2">
                                {q.options.map((opt, idx) => {
                                  const isSelected = selectedOption === idx;
                                  const isCorrect = idx === q.correctIndex;
                                  return (
                                    <button
                                      key={idx}
                                      disabled={quizSubmitted}
                                      onClick={() => setSelectedOption(idx)}
                                      className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition ${
                                        quizSubmitted
                                          ? isCorrect
                                            ? 'bg-emerald-600 text-white border-emerald-500'
                                            : isSelected
                                            ? 'bg-rose-600 text-white border-rose-500'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                          : isSelected
                                          ? 'bg-blue-600 text-white border-blue-500'
                                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {!quizSubmitted ? (
                                <button
                                  disabled={selectedOption === null}
                                  onClick={() => {
                                    setQuizSubmitted(true);
                                    if (selectedOption === q.correctIndex) {
                                      soundFX.playCorrect();
                                      addXP(30);
                                    } else {
                                      soundFX.playIncorrect();
                                    }
                                  }}
                                  className="w-full py-2.5 bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition shadow-md"
                                >
                                  පිළිතුර තහවුරු කරන්න (Submit Answer)
                                </button>
                              ) : (
                                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 shadow-md">
                                  <AranaMascot
                                    size="sm"
                                    mood={selectedOption === q.correctIndex ? 'celebrating' : 'encouraging'}
                                    interactive={false}
                                    showBadge={false}
                                    message={
                                      selectedOption === q.correctIndex
                                        ? 'ඉතා විශිෂ්ටයි! 🎉 ඔබගේ පිළිතුර නිවැරදියි. ඔබට +30 XP හිමිවුණා!'
                                        : 'හොඳ උත්සාහයක්! 💪 පහත විවරණය අධ්‍යයනය කර නැවත මතකයට නංවාගන්න.'
                                    }
                                  />
                                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                      විවරණය (Explanation):
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{q.explanation}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                      <p className="text-xs text-slate-500">කරුණාකර වම් පසින් පාඩමක් තෝරන්න.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PAST PAPERS & MARKING SCHEMES */}
            {activeTab === 'papers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි (Marking Schemes)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Department of Examinations Official Past Paper Archives
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSubject.pastPapers.map((paper) => {
                    const isBookmarked = profile?.bookmarkedPaperIds?.includes(paper.id);
                    return (
                      <div
                        key={paper.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                                {paper.year} G.C.E. {activeSubject.stream === 'General O/L' ? 'O/L' : 'A/L'}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {paper.medium}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {paper.part} • Marking Scheme Included
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleBookmarkPaper(paper.id)}
                            className={`p-2.5 rounded-xl border transition ${
                              isBookmarked
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            id={`download-pastpaper-${paper.id}`}
                            onClick={() => handleDownloadPaper(paper)}
                            disabled={downloadingPaperId === paper.id}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                          >
                            <Download className={`w-3.5 h-3.5 ${downloadingPaperId === paper.id ? 'animate-bounce' : ''}`} />
                            <span>{downloadingPaperId === paper.id ? 'Saving...' : 'PDF'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeSubject.pastPapers.length === 0 && (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-medium">
                      මෙම විෂය සඳහා පසුගිය ප්‍රශ්න පත්‍ර කට්ටල ඉක්මනින් එකතු වනු ඇත.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FilePermissionHelperModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        type="download"
        downloadUrl={activeDownloadUrl}
        downloadFilename={activeDownloadName}
      />
    </div>
  );
}
