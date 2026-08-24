import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Flame,
  Zap,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText,
  Calculator,
  Compass,
  PlayCircle,
  Award,
  ChevronRight,
  Send,
  Bot,
  Layers,
  Building2,
  Video,
  FileCheck,
  Calendar,
  Globe,
  FileQuestion,
  BarChart3,
  HardDriveDownload,
  ShoppingBag,
  Smile,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useExamNews } from '@/context/NewsContext';
import { SUBJECTS_DATA, INITIAL_STUDY_TASKS, SCHOOL_GRADES } from '@/data/mockData';
import type { PageId } from '@/components/Layout';
import type { StudyTask } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import AranaMascot from '@/components/AranaMascot';
import Grade5ScholarshipWizard from '@/components/Grade5ScholarshipWizard';
import { soundFX } from '@/utils/audioUtils';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, addXP } = useAuth();
  const { language, t } = useLanguage();
  const { notices, isSyncing } = useExamNews();
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<boolean | null>(null);
  const [isScholarshipWizardOpen, setIsScholarshipWizardOpen] = useState(profile?.grade === 5);

  // Daily challenge question adaptive to level and language
  const userGrade = profile?.grade || 11;
  const isOLOrJunior = userGrade <= 11;

  const dailyQuiz = isOLOrJunior
    ? {
        subject: language === 'si' 
          ? (userGrade <= 9 ? 'විද්‍යාව (Science)' : 'ගණිතය (Mathematics - O/L)')
          : language === 'ta'
          ? (userGrade <= 9 ? 'விஞ்ஞானம் (Science)' : 'கணிதம் (Mathematics - O/L)')
          : (userGrade <= 9 ? 'Science (Junior)' : 'Mathematics (O/L)'),
        question: language === 'si'
          ? (userGrade <= 9
              ? 'ශාක පත්‍රවල ප්‍රභාසංස්ලේෂණය සඳහා ආලෝකය අවශෝෂණය කරන්නේ කුමන වර්ණකය මඟින්ද?'
              : 'වෘත්තයක කේන්ද්‍රයේ සිට ජ්‍යායකට අඳින ලද ලම්භය මඟින් එම ජ්‍යාය කුමක් කරන්නේද?')
          : language === 'ta'
          ? (userGrade <= 9
              ? 'தாவர இலைகளில் ஒளிச்சேர்க்கைக்காக ஒளியை உறிஞ்சும் நிறமி எது?'
              : 'வட்டத்தின் மையத்திலிருந்து நாணிற்கு வரையப்படும் செங்குத்துக்கோடு அந்நாணை என்ன செய்யும்?')
          : (userGrade <= 9
              ? 'Which pigment in plant leaves absorbs sunlight for photosynthesis?'
              : 'A perpendicular line drawn from the center of a circle to a chord:'),
        options: language === 'si'
          ? (userGrade <= 9
              ? ['ක්ලෝරෝෆිල් (පත්‍රහරිත)', 'කැරොටින්', 'සැන්තොෆිල්', 'ඇන්තොසයනින්']
              : ['සමච්ඡේදනය කරයි (Bisects)', 'ත්‍රිච්ඡේදනය කරයි', 'ගුණ කරයි', 'වෙනසක් නොකරයි'])
          : language === 'ta'
          ? (userGrade <= 9
              ? ['குளோரோபில் (பச்சையம்)', 'கரோட்டின்', 'சாந்தோபில்', 'அந்தோசயனின்']
              : ['இருசமக்கூறிடும் (Bisects)', 'முக்கூறிடும்', 'பெருக்கும்', 'மாற்றாது'])
          : (userGrade <= 9
              ? ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Anthocyanin']
              : ['Bisects the chord', 'Trisects the chord', 'Doubles length', 'No effect']),
        correct: 0,
        explanation: language === 'si'
          ? (userGrade <= 9
              ? 'පත්‍රහරිත (Chlorophyll) මඟින් සූර්යාලෝකය අවශෝෂණය කර ආහාර නිපදවයි.'
              : 'ජ්‍යා ප්‍රමේයය අනුව කේන්ද්‍රයේ සිට ජ්‍යායකට අඳින ලම්භය මඟින් ජ්‍යාය සමච්ඡේදනය වේ.')
          : language === 'ta'
          ? (userGrade <= 9
              ? 'பச்சையம் (Chlorophyll) சூரிய ஒளியை உறிஞ்சி ஒளிச்சேர்க்கைக்கு உதவுகிறது.'
              : 'வட்ட மையத்திலிருந்து நாணிற்கு வரைந்த செங்குத்துக்கோடு நாணை இருசமக்கூறிடும்.')
          : (userGrade <= 9
              ? 'Chlorophyll absorbs photon energy for photosynthesis.'
              : 'By the chord theorem, a perpendicular line from the circle center bisects the chord.')
      }
    : {
        subject: language === 'si' ? 'Combined Mathematics (A/L)' : language === 'ta' ? 'இணைந்த கணிதம் (A/L)' : 'Combined Mathematics (A/L)',
        question: 'f(x) = ln(x² + 1) — x = 1 හිදී පළමු අවකල්‍ය අගය (dy/dx) වන්නේ කුමක්ද?',
        options: ['1/2', '1', '2', 'ln(2)'],
        correct: 1,
        explanation: 'dy/dx = 2x / (x² + 1). When x = 1, dy/dx = 2(1) / (1² + 1) = 2/2 = 1.'
      };

  const handleQuizSelect = (index: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(index);
    const isCorrect = index === dailyQuiz.correct;
    setQuizScore(isCorrect);
    if (isCorrect) {
      soundFX.playCorrect();
      addXP(50);
    } else {
      soundFX.playIncorrect();
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            soundFX.playLevelUp();
            addXP(20);
          }
          return { ...t, isCompleted: nextState };
        }
        return t;
      })
    );
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const taskProgressPercent = Math.round((completedTasksCount / tasks.length) * 100);

  // Filter subjects matching student's grade
  const streamSubjects = SUBJECTS_DATA.filter(
    s => s.grades.includes(userGrade)
  ).slice(0, 3);

  const displaySubjects = streamSubjects.length > 0
    ? streamSubjects
    : SUBJECTS_DATA.filter(s => !profile || s.stream === profile.stream).slice(0, 3);

  const gradeInfo = SCHOOL_GRADES.find(g => g.grade === userGrade);
  const examTargetLabel = userGrade >= 12
    ? `A/L ${profile?.targetYear || 2026} (3 A's)`
    : userGrade >= 10
    ? `O/L ${profile?.targetYear || 2026} (9 A's)`
    : `Grade ${userGrade} Term Exam`;

  const daysToExam = Math.max(1, Math.round((new Date(2026, 10, 15).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* 1. HORIZONTAL HERO BANNER */}
      <section
        id="dashboard-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'si'
                    ? `${gradeInfo?.nameSinhala || userGrade + ' ශ්‍රේණිය'} (${gradeInfo?.stage || 'General'} Level)`
                    : language === 'ta'
                    ? `தரம் ${userGrade} (${gradeInfo?.stage || 'General'})`
                    : `Grade ${userGrade} (${gradeInfo?.stage || 'General'})`}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold font-serif">
                <div className="w-4 h-4">
                  <SiparanaLogo variant="mark" size="xs" className="w-full h-full" />
                </div>
                <span>SIPARANA</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> NIE Aligned
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'si'
                ? `ආයුබෝවන්, ${profile?.name || 'ශිෂ්‍යයා'}! 👋`
                : language === 'ta'
                ? `வணக்கம், ${profile?.name || 'மாணவர்'}! 👋`
                : `Welcome, ${profile?.name || 'Student'}! 👋`}
            </h1>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              {language === 'si'
                ? `ඔබගේ ${userGrade} ශ්‍රේණියේ (${profile?.stream || 'Physical Science'}) විෂය නිර්දේශයට අදාළ වීඩියෝ පන්ති, පසුගිය ප්‍රශ්න පත්‍ර සහ AI උපකාර මෙතැනින් ලබාගන්න.`
                : language === 'ta'
                ? `உங்கள் தரம் ${userGrade} (${profile?.stream || 'Physical Science'}) பாடத்திட்ட வீடியோக்கள் மற்றும் வினாத்தாள்களை இங்கிருந்து அணுகவும்.`
                : `Access Grade ${userGrade} (${profile?.stream || 'Physical Science'}) video lessons, syllabus guides, and past exam papers.`}
            </p>

            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Target: <strong>{examTargetLabel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Countdown: <strong>{daysToExam} Days</strong></span>
              </div>
            </div>
          </div>

          {/* Daily Study Progress Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col gap-3 min-w-[230px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-200">
                {language === 'si' ? 'අද දවසේ ඉලක්කය' : language === 'ta' ? 'இன்றைய இலக்கு' : 'Daily Goal'}
              </span>
              <span className="text-xs font-bold text-amber-300">{taskProgressPercent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-200/80">
              {completedTasksCount} of {tasks.length} tasks completed today.
            </p>
            <button
              id="dash-resume-study-btn"
              onClick={() => onNavigate('subjects')}
              className="w-full py-2 px-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <span>{language === 'si' ? 'පාඩම් දිගටම කරගෙන යන්න' : language === 'ta' ? 'தொடர்ந்து கற்க' : 'Continue Studying'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. ARANA 3D MASCOT MENTOR & STUDY ADVISOR */}
      <section id="arana-mascot-mentor-card" className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-amber-400/40 dark:border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-lg backdrop-blur-xs">
        <AranaMascot
          size="md"
          mood={quizScore === true ? 'celebrating' : quizScore === false ? 'encouraging' : 'happy'}
          interactive={true}
        />
      </section>

      {/* 2b. GRADE 5 SCHOLARSHIP SPECIAL BANNER (KAVI MENTOR & INTERACTIVE WIZARD) */}
      <section
        id="grade5-scholarship-hero-launcher"
        className={`p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-md relative overflow-hidden ${
          userGrade === 5
            ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-yellow-500/20 border-amber-400 dark:border-amber-500'
            : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-amber-300/60 dark:border-amber-700/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🦉</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider bg-amber-200/80 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                  5 වසර ශිෂ්‍යත්වය (Grade 5)
                </span>
                <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400">
                  Step-by-Step Guide
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {language === 'si'
                  ? 'කවි බකමූණා සමඟ 5 ශිෂ්‍යත්වයට සූදානම් වෙමු! 🌟'
                  : 'Prepare for Grade 5 Scholarship with Kavi Owl!'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                {language === 'si'
                  ? 'සිංහල, ගණිතය, පරිසරය, බුද්ධි පරීක්ෂණ විනෝද ප්‍රශ්න, දවසේ කාලසටහන සහ ප්‍රශ්න පත්‍ර.'
                  : 'Sinhala, Maths, Environment, IQ puzzles, color-coded timetable and past papers.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="open-scholarship-wizard-btn"
            onClick={() => {
              soundFX.playCorrect();
              setIsScholarshipWizardOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md hover:shadow-lg transition transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>{language === 'si' ? 'ශිෂ්‍යත්ව මඟපෙන්වීම විවෘත කරන්න' : 'Launch Scholarship Wizard'}</span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          </button>
        </div>
      </section>

      {/* 3. HORIZONTAL QUICK-ACTION APP TOOLS BAR */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('planner')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/15 via-white to-indigo-600/15 dark:from-blue-950/50 dark:via-slate-900 dark:to-indigo-950/50 border-2 border-blue-500/80 dark:border-blue-400/70 hover:border-blue-600 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-700 dark:text-blue-300">
              {language === 'si' ? 'AI කාලසටහන' : language === 'ta' ? 'AI படிப்புத் திட்டம்' : 'AI Study Planner'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Auto-Sync Schedule</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('flashcards')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-white to-purple-500/15 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border-2 border-indigo-400/70 dark:border-indigo-500/60 hover:border-indigo-500 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-indigo-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-300">
              {language === 'si' ? 'ස්මාර්ට් ෆ්ලෑෂ්කාඩ්' : language === 'ta' ? 'ஃபிளாஷ்கார்டுகள்' : 'Smart Flashcards'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Spaced Quick Recall</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('countdown')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/15 via-white to-orange-500/15 dark:from-rose-950/40 dark:via-slate-900 dark:to-orange-950/40 border-2 border-rose-400/70 dark:border-rose-500/60 hover:border-rose-500 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-rose-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-rose-700 dark:text-rose-300">
              {language === 'si' ? 'විභාග ඔරලෝසුව' : language === 'ta' ? 'தேர்வு கடிகாரம்' : 'Exam Countdown'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Real-Time & Daily Goals</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('audio')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-white to-pink-500/15 dark:from-purple-950/40 dark:via-slate-900 dark:to-pink-950/40 border-2 border-purple-400/70 dark:border-purple-500/60 hover:border-purple-500 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-purple-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-purple-700 dark:text-purple-300">
              {language === 'si' ? 'ශ්‍රව්‍ය සටහන්' : language === 'ta' ? 'குரல் குறிப்புகள்' : 'Audio Summaries'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Listen & Revise High-Yield</p>
          </div>
        </button>
      </section>

      {/* 3b. ADDITIONAL APP TOOLS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('fun_english')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold w-fit group-hover:scale-105 transition shadow-xs">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'ඉංග්‍රීසි & විවේකය' : language === 'ta' ? 'ஆங்கிலம் & ஓய்வு' : 'Fun English'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">Mascot 4-Step Flow</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('google_hub')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/15 via-white to-indigo-600/15 dark:from-blue-950/50 dark:via-slate-900 dark:to-indigo-950/50 border-2 border-blue-500/80 dark:border-blue-400/70 hover:border-blue-600 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-700 dark:text-blue-300">
              {language === 'si' ? 'ගූගල් අධ්‍යාපන' : language === 'ta' ? 'கூகிள் தளம்' : 'Google Hub'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">7 In-App Tools</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('free_courses')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-white to-blue-500/15 dark:from-cyan-950/40 dark:via-slate-900 dark:to-blue-950/40 border-2 border-cyan-400/70 dark:border-cyan-500/60 hover:border-cyan-500 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-cyan-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-cyan-700 dark:text-cyan-300">
              {language === 'si' ? 'නිදහස් පාඨමාලා' : language === 'ta' ? 'இலவச படிப்புகள்' : 'Free Courses'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Harvard, Google & UoM</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('book_shop')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-blue-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-blue-950/30 border-2 border-amber-400/60 dark:border-amber-500/50 hover:border-amber-500 hover:shadow-lg transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold w-fit group-hover:scale-105 transition shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-700 dark:text-amber-300">
              {language === 'si' ? 'සිප්අරණ පොත් හල' : language === 'ta' ? 'புத்தக சந்தை' : 'Book Shop'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Buy & Sell Books</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('quizzes')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 w-fit group-hover:scale-105 transition">
            <FileQuestion className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'MCQ පරීක්ෂණ' : language === 'ta' ? 'MCQ வினாக்கள்' : 'MCQ Quizzes'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">Auto-Marked Tests</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ai_tutor')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-fit group-hover:scale-105 transition">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'AI ගුරු සහකාර' : language === 'ta' ? 'AI ஆசிரியர்' : 'AI Voice Tutor'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">Ask Doubts & Voice</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-105 transition">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'ප්‍රගති වාර්තාව' : language === 'ta' ? 'பகுப்பாய்வு' : 'Analytics'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">Weak Points & Charts</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('offline_syllabus')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 w-fit group-hover:scale-105 transition">
            <HardDriveDownload className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'විෂය නිර්දේශ PDF' : language === 'ta' ? 'பாடத்திட்டம்' : 'Offline PDFs'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">NIE Syllabi & Notes</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('classroom')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 w-fit group-hover:scale-105 transition">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'වීඩියෝ පන්ති' : language === 'ta' ? 'வீடியோ வகுப்புகள்' : 'Classroom'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">HD Video lessons</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('subjects')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-105 transition">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'විෂයන් & ගුරු පොත්' : language === 'ta' ? 'பாடங்கள்' : 'Subjects'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">NIE Curriculum</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('campus')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-105 transition">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'Z-Score & Cutoffs' : language === 'ta' ? 'Z-Score கணிப்பான்' : 'Z-Score Guide'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">UGC Cutoffs</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('utilities')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-red-500 hover:shadow-md transition text-left space-y-1.5 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 w-fit group-hover:scale-105 transition">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'si' ? 'Stopwatch & Chart' : language === 'ta' ? 'கடிகாரம்' : 'Study Timer'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">Bar Chart Track</p>
          </div>
        </button>
      </section>

      {/* 3. METRICS ROW */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profile?.streakDays || 0} Days</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Streak 🔥</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total XP Points</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4 fill-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profile?.xp.toLocaleString() || 0}</p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{profile?.district} District</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lessons Solved</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profile?.completedLessonsCount || 0}</p>
          <span className="text-[11px] text-slate-500">Grade {userGrade} Curriculum</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">School Grade</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{userGrade} වසර</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{gradeInfo?.stage}</span>
        </div>
      </section>

      {/* 4. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Subjects Tracker & Daily Challenge */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Subjects Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {language === 'si'
                    ? `මගේ විෂයන් (Grade ${userGrade} Subjects & Progress)`
                    : language === 'ta'
                    ? `எனது பாடங்கள் (தரம் ${userGrade})`
                    : `My Subjects (Grade ${userGrade} Progress)`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'si'
                    ? `${userGrade} වන ශ්‍රේණියට අදාළ පාසල් විෂය නිර්දේශයේ ප්‍රගතිය`
                    : `Active curriculum progress for Grade ${userGrade}`}
                </p>
              </div>
              <button
                onClick={() => onNavigate('subjects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{language === 'si' ? 'සියල්ල බලන්න' : language === 'ta' ? 'அனைத்தும்' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {displaySubjects.map((sub) => {
                const percent = Math.round((sub.completedModules / sub.totalModules) * 100);
                return (
                  <div
                    key={sub.id}
                    onClick={() => onNavigate('subjects')}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          {sub.code}
                        </span>
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
                        {language === 'ta' ? sub.titleEnglish : sub.titleSinhala}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{sub.titleEnglish}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{sub.completedModules}/{sub.totalModules} Units</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Quiz of the Day */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>
                  {language === 'si'
                    ? `දවසේ අභියෝගය (Grade ${userGrade} Challenge)`
                    : language === 'ta'
                    ? `இன்றைய கேள்வி (தரம் ${userGrade})`
                    : `Daily Brain Challenge (Grade ${userGrade})`}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                +50 XP
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {dailyQuiz.subject}
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {dailyQuiz.question}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dailyQuiz.options.map((opt, idx) => {
                let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500';
                if (quizAnswered !== null) {
                  if (idx === dailyQuiz.correct) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600';
                  } else if (idx === quizAnswered) {
                    btnStyle = 'bg-red-500 text-white border-red-600';
                  }
                }
                return (
                  <button
                    key={idx}
                    disabled={quizAnswered !== null}
                    onClick={() => handleQuizSelect(idx)}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-center shadow-xs ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizAnswered !== null && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-2 border shadow-xs transition-all ${
                  quizScore
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AranaMascot
                    size="sm"
                    mood={quizScore ? 'celebrating' : 'encouraging'}
                    showBadge={false}
                    interactive={false}
                    message={
                      quizScore
                        ? (language === 'si' ? 'නියමයි! 🎉 නිවැරදි පිළිතුර. ඔබට +50 XP හිමිවුණා!' : 'Great job! 🎉 Correct answer. You earned +50 XP!')
                        : (language === 'si' ? 'හොඳ උත්සාහයක්! 💪 නැවත උත්සාහ කර නිවැරදි සිද්ධාන්තය මතක තබාගන්න.' : 'Good try! 💪 Review the concept and try again.')
                    }
                  />
                </div>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/50 text-[11px] font-medium leading-relaxed pl-1">
                  <strong>{language === 'si' ? 'පැහැදිලි කිරීම:' : 'Explanation:'}</strong> {dailyQuiz.explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Daily Planner & Exam News */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Study Planner Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{language === 'si' ? 'අද පාඩම් සැලැස්ම (Tasks)' : language === 'ta' ? 'இன்றைய திட்டங்கள்' : 'Today\'s Study Tasks'}</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {completedTasksCount}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                    task.isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        task.isCompleted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{task.subject}</span>
                      <span>•</span>
                      <span>{task.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('utilities')}
              className="w-full py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition"
            >
              + Manage Study Schedule
            </button>
          </div>

          {/* Urgent Exam Notice Bulletin */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{language === 'si' ? 'විභාග පුවත්' : language === 'ta' ? 'தேர்வு செய்திகள்' : 'Exam Bulletins'}</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
              </div>
              <button
                onClick={() => onNavigate('news')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Live Feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {notices.slice(0, 2).map((news) => (
                <div
                  key={news.id}
                  onClick={() => onNavigate('news')}
                  className="pt-2 first:pt-0 space-y-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                      {news.authorityCode}
                    </span>
                    <span className="text-slate-400">{news.publishedDate}</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                    {language === 'si' ? news.titleSinhala : news.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Fun English & Relax with Mascot Banner Card */}
          <div
            onClick={() => onNavigate('fun_english')}
            className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20 dark:from-amber-950/50 dark:via-slate-900 dark:to-yellow-950/40 border-2 border-amber-400/80 dark:border-amber-500/60 shadow-md hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Mascot English & Relax</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black group-hover:scale-105 transition">
                4-Step Flow 🚀
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-amber-600 transition">
                {language === 'si' ? 'විනෝදජනක ඉංග්‍රීසි & විවේක පියස' : 'Fun English & Relax Zone'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Word Quizzes, Short Stories, Riddles & Guided Breather with Arana Mascot.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs font-black text-amber-700 dark:text-amber-400">
              <span>Start Daily Break</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Grade 5 Scholarship Interactive Guided Wizard Modal */}
      <Grade5ScholarshipWizard
        isOpen={isScholarshipWizardOpen}
        onClose={() => setIsScholarshipWizardOpen(false)}
        onNavigateToSubject={(subjectId) => {
          setIsScholarshipWizardOpen(false);
          onNavigate('subjects');
        }}
      />
    </div>
  );
}
