import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileQuestion,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  GraduationCap,
  Calculator,
  Dna,
  TrendingUp,
  Layers,
  Cpu,
  Terminal,
  Briefcase,
  Flame,
  Percent,
  Landmark,
  Code,
  FlaskConical,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import {
  UNIT_QUIZZES_DATA,
  QUIZ_CATEGORIES,
  QUIZ_STREAMS,
  QUIZ_SUBJECTS,
  type UnitQuiz,
  type QuizCategory,
  type QuizStream,
  type QuizSubject
} from '@/data/quizData';
import QuizPlayer from '@/components/QuizPlayer';
import QuizGuideMascot from '@/components/QuizGuideMascot';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface QuizzesPageProps {
  onNavigateAnalytics?: () => void;
}

type WizardStep = 'category' | 'stream' | 'subject' | 'quizzes';

export default function QuizzesPage({ onNavigateAnalytics }: QuizzesPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // Step-by-step state
  const [currentStep, setCurrentStep] = useState<WizardStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedStream, setSelectedStream] = useState<QuizStream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<QuizSubject | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<UnitQuiz | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
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
      case 'Flame': return <Flame className={className} />;
      case 'Percent': return <Percent className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'Code': return <Code className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      default: return <FileQuestion className={className} />;
    }
  };

  // Filter streams matching selected category
  const availableStreams = selectedCategory
    ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
    : [];

  // Filter subjects matching selected stream & category
  const availableSubjects = selectedStream
    ? QUIZ_SUBJECTS.filter((sub) => sub.streamId === selectedStream.id)
    : [];

  // Filter quizzes matching selected subject
  const availableQuizzes = selectedSubject
    ? UNIT_QUIZZES_DATA.filter((q) => q.subjectId === selectedSubject.id)
    : [];

  // Filter quizzes with search query in Step 4
  const filteredQuizzes = availableQuizzes.filter((quiz) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      quiz.title.toLowerCase().includes(q) ||
      quiz.titleSinhala.toLowerCase().includes(q) ||
      quiz.subjectName.toLowerCase().includes(q) ||
      quiz.subjectSinhala.toLowerCase().includes(q) ||
      quiz.descriptionSinhala.toLowerCase().includes(q)
    );
  });

  // Handle Category Click
  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSearchQuery('');

    const matchingStreams = QUIZ_STREAMS.filter((s) => s.categoryId === category.id);
    if (matchingStreams.length === 1) {
      // If only one stream exists for this category, auto-advance to stream or subject
      setSelectedStream(matchingStreams[0]);
      setCurrentStep('subject');
    } else {
      setCurrentStep('stream');
    }
  };

  // Handle Stream Click
  const handleSelectStream = (stream: QuizStream) => {
    setSelectedStream(stream);
    setSelectedSubject(null);
    setSearchQuery('');
    setCurrentStep('subject');
  };

  // Handle Subject Click
  const handleSelectSubject = (subject: QuizSubject) => {
    setSelectedSubject(subject);
    setSearchQuery('');
    setCurrentStep('quizzes');
  };

  // Reset / Start Over
  const handleResetFlow = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSelectedQuiz(null);
    setSearchQuery('');
  };

  // Step Back action
  const handleStepBack = () => {
    if (currentStep === 'quizzes') {
      setCurrentStep('subject');
    } else if (currentStep === 'subject') {
      const matchingStreams = selectedCategory
        ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
        : [];
      if (matchingStreams.length === 1) {
        setCurrentStep('category');
      } else {
        setCurrentStep('stream');
      }
    } else if (currentStep === 'stream') {
      setCurrentStep('category');
    }
  };

  // If a test is active, render QuizPlayer
  if (selectedQuiz) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <QuizPlayer
          quiz={selectedQuiz}
          onExit={() => setSelectedQuiz(null)}
          onViewAnalytics={onNavigateAnalytics}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Auto-Marked Assessment Suite (ස්වයංක්‍රීය ලකුණු පද්ධතිය)</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-serif tracking-tight leading-tight">
            ඒකක බහුවරණ පරීක්ෂණ & ආදර්ශ ප්‍රශ්න පත්‍ර
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            ඔබේ ශ්‍රේණිය සහ විෂය ධාරාව තෝරා ඒකක ආශ්‍රිත ප්‍රශ්න පත්‍රවලට පිළිතුරු සපයන්න. ක්ෂණික ලකුණු, Guru Potha විවරණ සහ XP ලකුණු ලබාගන්න.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Award className="w-4 h-4" />
              <span>Instant Marks & XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>National Syllabus Aligned</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Clock className="w-4 h-4" />
              <span>Real-time Exam Timer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Mascot Companion */}
      <QuizGuideMascot
        currentStep={currentStep}
        selectedCategoryName={selectedCategory?.nameSinhala}
        selectedStreamName={selectedStream?.nameSinhala}
        selectedSubjectName={selectedSubject?.nameSinhala}
        totalQuizzesFound={filteredQuizzes.length}
        onResetFlow={handleResetFlow}
      />

      {/* Interactive Step-by-Step Selection Flow Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                currentStep === 'category'
                  ? 'bg-blue-600 text-white font-black shadow-sm'
                  : selectedCategory
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                {selectedCategory ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span>{selectedCategory ? selectedCategory.nameSinhala.split(' ')[0] : '1. ශ්‍රේණිය (Category)'}</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />

            {/* Step 2 Pill */}
            <button
              type="button"
              disabled={!selectedCategory}
              onClick={() => selectedCategory && setCurrentStep('stream')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                currentStep === 'stream'
                  ? 'bg-blue-600 text-white font-black shadow-sm'
                  : selectedStream
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                {selectedStream ? <Check className="w-3 h-3" /> : '2'}
              </span>
              <span>{selectedStream ? selectedStream.nameSinhala.split(' ')[0] : '2. ධාරාව (Stream)'}</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />

            {/* Step 3 Pill */}
            <button
              type="button"
              disabled={!selectedStream}
              onClick={() => selectedStream && setCurrentStep('subject')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                currentStep === 'subject'
                  ? 'bg-blue-600 text-white font-black shadow-sm'
                  : selectedSubject
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                {selectedSubject ? <Check className="w-3 h-3" /> : '3'}
              </span>
              <span>{selectedSubject ? selectedSubject.nameSinhala : '3. විෂයය (Subject)'}</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />

            {/* Step 4 Pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap ${
                currentStep === 'quizzes'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                4
              </span>
              <span>4. ප්‍රශ්නාවලිය (Quizzes)</span>
            </div>
          </div>

          {currentStep !== 'category' && (
            <button
              type="button"
              onClick={handleStepBack}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ආපසු (Back)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Step-by-step Content Views with Animated Transitions */}
      <AnimatePresence mode="wait">
        {/* =========================================================================
            STEP 1: Select Grade / Education Category
            ========================================================================= */}
        {currentStep === 'category' && (
          <motion.div
            key="step-category"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <span>පියවර 1: ඔබගේ ශ්‍රේණිය හෝ අංශය තෝරන්න (Select Grade / Category)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  ඔබට අවශ්‍ය බහුවරණ පරීක්ෂණ නිවැරදිව ලබා ගැනීමට පළමුව අධ්‍යාපන අදියර තෝරන්න.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {QUIZ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`quiz-cat-${cat.id}`}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        {renderIcon(cat.icon, 'w-7 h-7')}
                      </div>

                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {cat.nameSinhala}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {cat.name}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cat.descriptionSinhala}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700">
                    <span>ධාරාවන් තෝරන්න (Continue to Streams)</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            STEP 2: Select Academic Stream
            ========================================================================= */}
        {currentStep === 'stream' && (
          <motion.div
            key="step-stream"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <span>තෝරාගත් අංශය: {selectedCategory?.nameSinhala}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-amber-500" />
                  <span>පියවර 2: විෂය ධාරාව තෝරන්න (Select Academic Stream)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  ඔබ හදාරන නිශ්චිත විෂය ධාරාව තෝරාගන්න.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep('category')}
                className="self-start sm:self-auto text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ශ්‍රේණිය වෙනස් කරන්න</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {availableStreams.map((stream) => (
                <button
                  key={stream.id}
                  id={`quiz-stream-${stream.id}`}
                  type="button"
                  onClick={() => handleSelectStream(stream)}
                  className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      {renderIcon(stream.icon, 'w-6 h-6')}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {stream.nameSinhala}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {stream.name}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {stream.descriptionSinhala}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400 group-hover:text-amber-700">
                    <span>විෂයයන් බලන්න (View Subjects)</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            STEP 3: Select Subject
            ========================================================================= */}
        {currentStep === 'subject' && (
          <motion.div
            key="step-subject"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <span>{selectedCategory?.nameSinhala}</span>
                  <span>•</span>
                  <span>{selectedStream?.nameSinhala}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span>පියවර 3: විෂයය තෝරන්න (Select Subject)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  තෝරාගත් ධාරාවට අදාළ විෂයයන් පමණක් පහත දැක්වේ. ඔබට අවශ්‍ය විෂය මත ක්ලික් කරන්න.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep('stream')}
                className="self-start sm:self-auto text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ධාරාව වෙනස් කරන්න</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {availableSubjects.map((sub) => {
                const quizCount = UNIT_QUIZZES_DATA.filter((q) => q.subjectId === sub.id).length;

                return (
                  <button
                    key={sub.id}
                    id={`quiz-subject-${sub.id}`}
                    type="button"
                    onClick={() => handleSelectSubject(sub)}
                    className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          {renderIcon(sub.iconName, 'w-6 h-6')}
                        </div>

                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {quizCount} {quizCount === 1 ? 'Quiz' : 'Quizzes'} Available
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {sub.syllabusCode} • {sub.gradeLevels}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mt-0.5">
                          {sub.nameSinhala}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {sub.name}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sub.descriptionSinhala}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700">
                      <span>ප්‍රශ්න පත්‍ර බලන්න (View MCQ Papers)</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            STEP 4: Quizzes & Model Papers List for Selected Subject
            ========================================================================= */}
        {currentStep === 'quizzes' && selectedSubject && (
          <motion.div
            key="step-quizzes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Subject Summary Bar with Search */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                    <span>{selectedCategory?.nameSinhala}</span>
                    <span>•</span>
                    <span>{selectedStream?.nameSinhala}</span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400">{selectedSubject.syllabusCode}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {renderIcon(selectedSubject.iconName, 'w-6 h-6 text-blue-600')}
                    <span>{selectedSubject.nameSinhala} - ඒකක බහුවරණ ප්‍රශ්නාවලි</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedSubject.name} • {filteredQuizzes.length} MCQ Quizzes & Model Papers Available
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('subject')}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>විෂයය වෙනස් කරන්න</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFlow}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>මුල සිට</span>
                  </button>
                </div>
              </div>

              {/* Search Within Subject */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`${selectedSubject.nameSinhala} පාඩම හෝ ප්‍රශ්නාවලිය සොයන්න (Search unit/topic)...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Quizzes List Grid */}
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    id={`quiz-card-${quiz.id}`}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] border border-blue-200 dark:border-blue-800">
                              {quiz.subjectSinhala}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Unit {quiz.unitNumber} • {quiz.questions.length} Questions
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                            {language === 'si' ? quiz.titleSinhala : quiz.title}
                          </h3>
                        </div>

                        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <FileQuestion className="w-5 h-5" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {language === 'si' ? quiz.descriptionSinhala : quiz.description}
                      </p>

                      {/* Quiz Specification Badges */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2">
                          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold">
                            <Clock className="w-3 h-3" /> Time
                          </div>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                            {quiz.timeLimitMinutes} mins
                          </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2">
                          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold">
                            <FileQuestion className="w-3 h-3" /> MCQs
                          </div>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                            {quiz.questions.length} Qs
                          </span>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-2 border border-amber-200 dark:border-amber-800/60">
                          <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                            <Zap className="w-3 h-3 fill-amber-500" /> Reward
                          </div>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            +{quiz.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Launch Quiz CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        id={`btn-start-quiz-${quiz.id}`}
                        type="button"
                        onClick={() => setSelectedQuiz(quiz)}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <span>ප්‍රශ්නාවලිය ආරම්භ කරන්න (Start Test)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <FileQuestion className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  සොයන ලද නමෙන් ප්‍රශ්න පත්‍ර හමුනොවුණි
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  වෙනත් සෙවුම් පදයක් භාවිතා කරන්න හෝ සෙවුම් පදය ඉවත් කරන්න.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  සියලු ප්‍රශ්නාවලි පෙන්වන්න (Clear Search)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
