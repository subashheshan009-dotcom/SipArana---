import React, { useState } from 'react';
import {
  FileQuestion,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Zap,
  GraduationCap
} from 'lucide-react';
import { UNIT_QUIZZES_DATA, type UnitQuiz } from '@/data/quizData';
import QuizPlayer from '@/components/QuizPlayer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface QuizzesPageProps {
  onNavigateAnalytics?: () => void;
}

export default function QuizzesPage({ onNavigateAnalytics }: QuizzesPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [selectedQuiz, setSelectedQuiz] = useState<UnitQuiz | null>(null);
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = UNIT_QUIZZES_DATA.filter((quiz) => {
    const matchesStream = selectedStream === 'All' || quiz.stream === selectedStream;
    const matchesGrade = selectedGrade === 'All' || quiz.grade === selectedGrade;
    const matchesSearch =
      searchQuery === '' ||
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.titleSinhala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subjectSinhala.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesGrade && matchesSearch;
  });

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Auto-Marked Assessment Suite (ස්වයංක්‍රීය ලකුණු පද්ධතිය)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            ඒකක බහුවරණ පරීක්ෂණ & ආදර්ශ ප්‍රශ්න පත්‍ර
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Test your knowledge after every unit with Sri Lankan national curriculum standard MCQs. Get instant auto-marking, time pacing, weak point diagnosis, and in-depth Guru Potha explanations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Award className="w-4 h-4" />
              <span>Instant Marks & XP Rewards</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>National Syllabus Aligned (A/L & O/L)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Clock className="w-4 h-4" />
              <span>Real-time Exam Timer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quiz, subject or unit (විෂය හෝ පාඩම සොයන්න)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
            />
          </div>

          {/* Grade filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-slate-400 hidden sm:inline">Grade:</span>
            {['All', 13, 12, 11, 10].map((g) => (
              <button
                key={String(g)}
                onClick={() => setSelectedGrade(g as any)}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-blue-600 text-white font-black shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {g === 'All' ? 'All Grades' : `Grade ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* Stream Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none text-xs">
          {[
            { id: 'All', label: 'All Streams (සියලුම ධාරා)' },
            { id: 'Physical Science (Maths)', label: '📐 Combined Maths' },
            { id: 'Biological Science (Bio)', label: '🧬 Biology' },
            { id: 'General O/L', label: '🎒 General O/L' },
          ].map((str) => (
            <button
              key={str.id}
              onClick={() => setSelectedStream(str.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                selectedStream === str.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {str.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] border border-blue-200 dark:border-blue-800">
                      {quiz.subjectSinhala}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Grade {quiz.grade} • Unit {quiz.unitNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {language === 'si' ? quiz.titleSinhala : quiz.title}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileQuestion className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {language === 'si' ? quiz.descriptionSinhala : quiz.description}
              </p>

              {/* Specs pill row */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <FileQuestion className="w-3.5 h-3.5 text-blue-500" />
                  <span>{quiz.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{quiz.timeLimitMinutes} Mins</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{quiz.xpReward} XP</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setSelectedQuiz(quiz)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition transform active:scale-95 cursor-pointer"
              >
                <span>Start MCQ Test (පරීක්ෂණය අරඹන්න)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
