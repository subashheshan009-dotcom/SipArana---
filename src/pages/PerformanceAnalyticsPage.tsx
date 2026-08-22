import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Zap,
  RotateCcw,
  BookOpen,
  Filter,
  BarChart3,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  INITIAL_TEST_ATTEMPTS,
  INITIAL_WEAK_POINTS,
  SUBJECT_MASTERY_DEFAULTS,
  type TestAttemptRecord,
  type WeakPointItem
} from '@/data/analyticsData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface PerformanceAnalyticsPageProps {
  onNavigateQuizzes?: () => void;
  onNavigateSyllabus?: () => void;
  onNavigateTutor?: () => void;
}

export default function PerformanceAnalyticsPage({
  onNavigateQuizzes,
  onNavigateSyllabus,
  onNavigateTutor
}: PerformanceAnalyticsPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [testAttempts, setTestAttempts] = useState<TestAttemptRecord[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPointItem[]>(INITIAL_WEAK_POINTS);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('all');

  // Load from localStorage or seed initial
  useEffect(() => {
    try {
      const stored = localStorage.getItem('siparana_test_attempts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setTestAttempts(parsed);
          return;
        }
      }
      setTestAttempts(INITIAL_TEST_ATTEMPTS);
    } catch {
      setTestAttempts(INITIAL_TEST_ATTEMPTS);
    }
  }, []);

  // Compute Metrics
  const totalTests = testAttempts.length;
  const avgScore = totalTests > 0
    ? Math.round(testAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests)
    : 0;
  
  const totalStudySeconds = testAttempts.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);
  const totalStudyHours = (totalStudySeconds / 3600).toFixed(1);

  // Score progression data for Area Chart
  const scoreProgressionData = testAttempts.map((att, idx) => ({
    name: `Test #${idx + 1}`,
    score: att.score,
    subject: att.subjectName,
    title: att.quizTitle,
    date: new Date(att.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }));

  // Subject performance distribution
  const subjectMasteryData = SUBJECT_MASTERY_DEFAULTS.map((sm) => ({
    subject: sm.subject,
    mastery: sm.masteryPercentage,
    fullMark: 100
  }));

  // Study time comparison data
  const studyTimeMetricsData = [
    {
      metric: 'Total Study Time',
      Seconds: Math.round(totalStudySeconds % 60),
      Minutes: Math.round((totalStudySeconds / 60) % 60),
      Hours: Number((totalStudySeconds / 3600).toFixed(1))
    },
    {
      metric: 'Combined Maths',
      Seconds: 45,
      Minutes: 38,
      Hours: 4.2
    },
    {
      metric: 'Physics',
      Seconds: 30,
      Minutes: 52,
      Hours: 3.8
    },
    {
      metric: 'Chemistry',
      Seconds: 15,
      Minutes: 24,
      Hours: 2.6
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Student Intelligence & Progress Report (ප්‍රගති වාර්තාව)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight">
            කාර්යසාධන විශ්ලේෂණ පුවරුව (Performance Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Real-time visual diagnostic reports tracking test scores, subject mastery distribution, study time trends, and AI-identified weak points for targeted exam readiness.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Tests Attempted</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {totalTests}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>100% Curriculum Auto-Marked</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Average Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-500 font-mono">
            {avgScore}%
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            Target benchmark: 75%+ Distinction
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Logged Test Time</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {totalStudyHours} <span className="text-sm font-sans font-bold text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Total {totalStudySeconds}s in active problem solving
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Weak Points Diagnosed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-500 font-mono">
            {weakPoints.length}
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
            2 High Urgency Revisions Needed
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Test Marks Progression Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Test Score Progression & Trajectory (ලකුණු ප්‍රගති ප්‍රස්තාරය)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Score percentage (%) across sequential unit tests
              </p>
            </div>

            <div className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              Latest: {scoreProgressionData[scoreProgressionData.length - 1]?.score || 0}%
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreProgressionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Score']}
                  labelFormatter={(label, payload) => {
                    const item = payload[0]?.payload;
                    return item ? `${item.title} (${item.date})` : label;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Mastery Radar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Subject Competency Radar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Proficiency balance across academic subjects
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectMasteryData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Mastery %" dataKey="mastery" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Highest Mastery: ICT (92%) & Combined Maths (88%)
            </span>
          </div>
        </div>
      </div>

      {/* Weak Points Diagnostic Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                දුර්වල කරුණු හඳුනාගැනීම & ප්‍රතිකර්ම (Weak Points & Action Plan)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Diagnostic AI tracks incorrect options in quizzes to highlight areas needing rapid revision.
            </p>
          </div>

          {onNavigateTutor && (
            <button
              onClick={onNavigateTutor}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>Ask AI Tutor to Explain Weak Points</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakPoints.map((wp) => (
            <div
              key={wp.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]">
                    {wp.subjectSinhala} • {wp.subject}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      wp.urgency === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                    }`}
                  >
                    {wp.urgency} Priority • {wp.accuracy}% Accuracy
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {language === 'si' ? wp.topicSinhala : wp.topic}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  💡 <strong>Action:</strong> {language === 'si' ? wp.suggestedActionSinhala : wp.suggestedAction}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {onNavigateSyllabus && (
                  <button
                    onClick={onNavigateSyllabus}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Download Resource Book Note</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Attempt History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              පසුගිය පරීක්ෂණ ඉතිහාසය (Test Attempts History)
            </h3>
            <p className="text-xs text-slate-400">
              Detailed chronological record of your unit-wise quizzes
            </p>
          </div>

          {onNavigateQuizzes && (
            <button
              onClick={onNavigateQuizzes}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Take New Test</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Subject & Quiz Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Time Spent</th>
                <th className="py-3 px-4">XP Earned</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {testAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {att.quizTitleSinhala}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {att.subjectName} • {att.quizTitle}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(att.completedAt).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-xl font-mono font-black text-xs ${
                        att.score >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : att.score >= 50
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {att.score}% ({att.correctCount}/{att.totalQuestions})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap">
                    {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    +{att.xpEarned} XP
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {onNavigateQuizzes && (
                      <button
                        onClick={onNavigateQuizzes}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                      >
                        Retake
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
