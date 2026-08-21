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
  Layers
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SUBJECTS_DATA, NEWS_ARTICLES_DATA, INITIAL_STUDY_TASKS, SCHOOL_GRADES } from '@/data/mockData';
import type { PageId } from '@/components/Layout';
import type { StudyTask } from '@/types';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, addXP } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<boolean | null>(null);

  // Daily challenge question adaptive to level
  const userGrade = profile?.grade || 11;
  const isOLOrJunior = userGrade <= 11;

  const dailyQuiz = isOLOrJunior
    ? {
        subject: userGrade <= 9 ? 'විද්‍යාව (Science)' : 'ගණිතය (Mathematics - O/L)',
        question: userGrade <= 9
          ? 'ශාක පත්‍රවල ප්‍රභාසංස්ලේෂණය සඳහා ආලෝකය අවශෝෂණය කරන්නේ කුමන වර්ණකය මඟින්ද?'
          : 'වෘත්තයක කේන්ද්‍රයේ සිට ජ්‍යායකට අඳින ලද ලම්භය මඟින් එම ජ්‍යාය කුමක් කරන්නේද?',
        options: userGrade <= 9
          ? ['ක්ලෝරෝෆිල් (පත්‍රහරිත)', 'කැරොටින්', 'සැන්තොෆිල්', 'ඇන්තොසයනින්']
          : ['සමච්ඡේදනය කරයි (Bisects)', 'ත්‍රිච්ඡේදනය කරයි', 'ගුණ කරයි', 'වෙනසක් නොකරයි'],
        correct: 0,
        explanation: userGrade <= 9
          ? 'පත්‍රහරිත (Chlorophyll) මඟින් සූර්යාලෝකය අවශෝෂණය කර ආහාර නිපදවයි.'
          : 'ජ්‍යා ප්‍රමේයය අනුව කේන්ද්‍රයේ සිට ජ්‍යායකට අඳින ලම්භය මඟින් ජ්‍යාය සමච්ඡේදනය වේ.'
      }
    : {
        subject: 'Combined Mathematics (A/L)',
        question: 'f(x) = ln(x^2 + 1) ශ්‍රිතයේ x = 1 හිදී පළමු අවකල්‍ය අගය (dy/dx) වන්නේ කුමක්ද?',
        options: ['1/2', '1', '2', 'ln(2)'],
        correct: 1,
        explanation: 'dy/dx = 2x / (x^2 + 1). When x = 1, dy/dx = 2(1) / (1^2 + 1) = 2/2 = 1.'
      };

  const handleQuizSelect = (index: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(index);
    const isCorrect = index === dailyQuiz.correct;
    setQuizScore(isCorrect);
    if (isCorrect) {
      addXP(50);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) addXP(20);
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

  // If no exact match (fallback), show by stream
  const displaySubjects = streamSubjects.length > 0
    ? streamSubjects
    : SUBJECTS_DATA.filter(s => !profile || s.stream === profile.stream).slice(0, 3);

  const gradeInfo = SCHOOL_GRADES.find(g => g.grade === userGrade);
  const examTargetLabel = userGrade >= 12
    ? `A/L ${profile?.targetYear || 2026} (3 A's)`
    : userGrade >= 10
    ? `O/L ${profile?.targetYear || 2026} (9 A's)`
    : `Grade ${userGrade} Term Test`;

  const daysToExam = Math.max(1, Math.round((new Date(2026, 10, 15).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
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
                <span>{gradeInfo?.nameSinhala} ({gradeInfo?.stage} Level)</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                Guru Potha Aligned
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ආයුබෝවන්, {profile?.name || 'ශිෂ්‍යයා'}! 👋
            </h1>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              ඔබේ {userGrade} වන ශ්‍රේණියේ ({profile?.stream}) විෂය මාලාවට අදාළ පාඩම්, වීඩියෝ පන්ති සහ අභ්‍යාස සමඟින් ඉහළම ප්‍රගතියක් අත්කර ගනිමු.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
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

          {/* Quick Action Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col gap-3 min-w-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-200">Daily Study Target</span>
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
              <span>Continue Studying</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* University Degree Portal Feature Callout Banner */}
      <section
        id="dashboard-uni-spotlight-banner"
        onClick={() => onNavigate('university')}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-indigo-800/50 rounded-3xl p-5 shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-cyan-500/50 transition group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                UNIVERSITY AI DEGREE PORTAL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                UoM • UoC • USJ • UoP
              </span>
            </div>
            <h3 className="font-bold text-base text-white">
              විශ්වවිද්‍යාල ශිෂ්‍ය AI සහකාර සහ උපාධි විෂය මාලාව (AI Degree Assistant)
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              Engineering, Medicine, Computing, Management උපාධි සඳහා Semester Notes, Lab Helpers, Past Exams සහ Gemini AI සහය
            </p>
          </div>
        </div>

        <button
          id="dash-open-uni-portal-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('university');
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 shadow-lg shadow-cyan-900/30"
        >
          <span>සරසවි AI පියසට පිවිසෙන්න</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Metrics Row */}
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

      {/* Main Grid: Subjects & Study Checklist & Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Subjects & Quiz */}
        <div className="lg:col-span-8 space-y-6">
          {/* Classroom Video Spotlight Card */}
          <div
            id="dash-classroom-spotlight-card"
            onClick={() => onNavigate('classroom')}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-5 shadow-lg shadow-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
                <PlayCircle className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    NEW CLASSROOM
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                    Grade {userGrade} Video Lessons
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">
                  සිප්අරණ වීඩියෝ පන්ති කාමරය (SipArana Classroom)
                </h3>
                <p className="text-xs text-blue-100/90 line-clamp-1">
                  ගුරු පොත සහ පාසල් විෂය මාලාවට අනුකූල වීඩියෝ දේශන, නිබන්ධන සහ ප්‍රශ්න පත්‍ර සාකච්ඡා
                </p>
              </div>
            </div>

            <button
              id="dash-goto-classroom-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('classroom');
              }}
              className="px-4 py-2.5 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <span>පන්ති කාමරයට යන්න</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Subjects Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  මගේ විෂයන් (Grade {userGrade} Subjects & Progress)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {userGrade} වන ශ්‍රේණියට අදාළ පාසල් විෂය නිර්දේශයේ ප්‍රගතිය
                </p>
              </div>
              <button
                onClick={() => onNavigate('subjects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>සියල්ල (View All)</span>
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
                        {sub.titleSinhala}
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
                <span>දවසේ අභියෝගය (Grade {userGrade} Question Challenge)</span>
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
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  quizScore
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border border-red-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {quizScore ? '🎉 නිවැරදියි! You earned +50 XP.' : '❌ වැරදියි (Incorrect).'}
                </div>
                <p>{dailyQuiz.explanation}</p>
              </div>
            )}
          </div>

          {/* Quick Study Utilities Gateway */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('utilities')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 w-fit group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Pomodoro Timer</h4>
                <p className="text-[11px] text-slate-500">25 min focus loops</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('campus')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 w-fit group-hover:scale-105 transition">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {userGrade >= 12 ? 'Z-Score Cutoffs' : 'O/L Grade Target'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {userGrade >= 12 ? 'UGC University Guide' : 'Subject Grade Calculator'}
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('community')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-105 transition">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ask a Doubt</h4>
                <p className="text-[11px] text-slate-500">Peer & AI solutions</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('utilities')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition text-left space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-fit group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Formula Sheets</h4>
                <p className="text-[11px] text-slate-500">Instant revision cards</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Daily Checklist & Announcements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Study Planner Checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>අද පාඩම් සැලැස්ම (Tasks)</span>
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
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>විභාග පුවත් (Exam Bulletins)</span>
              </h3>
              <button
                onClick={() => onNavigate('news')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                More
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {NEWS_ARTICLES_DATA.slice(0, 2).map((news) => (
                <div key={news.id} className="pt-2 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{news.category}</span>
                    <span className="text-slate-400">{news.publishedDate}</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {news.titleSinhala}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
