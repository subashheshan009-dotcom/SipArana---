import React, { useState, useEffect } from 'react';
import {
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Zap,
  Flame,
  Award,
  Calendar,
  Sparkles,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveSync } from '@/context/LiveSyncContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';

interface ExamCountdown {
  id: string;
  name: {
    en: string;
    si: string;
    ta: string;
  };
  date: string; // YYYY-MM-DD
  stream?: string;
  badgeColor: string;
}

const EXAM_PRESETS: ExamCountdown[] = [
  {
    id: 'al-2026',
    name: {
      en: 'G.C.E. Advanced Level (A/L) 2026',
      si: 'අ.පො.ස. උසස් පෙළ (A/L) 2026 විභාගය',
      ta: 'க.பொ.த. உயர்தரப் பரீட்சை (A/L) 2026'
    },
    date: '2026-11-20T08:30:00',
    stream: 'A/L All Streams',
    badgeColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'ol-2026',
    name: {
      en: 'G.C.E. Ordinary Level (O/L) 2026',
      si: 'අ.පො.ස. සාමාන්‍ය පෙළ (O/L) 2026 විභාගය',
      ta: 'க.பொ.த. சாதாரண தரப் பரீட்சை (O/L) 2026'
    },
    date: '2026-12-10T08:30:00',
    stream: 'O/L Grade 11',
    badgeColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'sch-2026',
    name: {
      en: 'Grade 5 Scholarship Exam 2026',
      si: '5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය 2026',
      ta: '5 ஆம் தர புலமைப்பரிசில் பரீட்சை 2026'
    },
    date: '2026-10-18T09:00:00',
    stream: 'Grade 5',
    badgeColor: 'from-emerald-500 to-teal-600'
  }
];

export default function ExamCountdownPage() {
  const { addXP } = useAuth();
  const { language, tText } = useLanguage();
  const { goals, addGoal, toggleGoal, deleteGoal, isSyncing } = useLiveSync();

  const [selectedExamId, setSelectedExamId] = useState<string>('al-2026');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Goal Form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Physics');
  const [goalPriority, setGoalPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [goalMinutes, setGoalMinutes] = useState(30);

  const selectedExam = EXAM_PRESETS.find((e) => e.id === selectedExamId) || EXAM_PRESETS[0];

  // Real-time tick
  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(selectedExam.date).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedExam.date]);

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const totalGoalsCount = goals.length;
  const goalCompletionRate =
    totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      priority: goalPriority,
      estimatedMinutes: goalMinutes,
      xpReward: goalPriority === 'high' ? 50 : goalPriority === 'medium' ? 35 : 20
    });

    setGoalTitle('');
    addXP(15);
  };

  const handleToggleGoalWithConfetti = (goalId: string, currentCompleted: boolean) => {
    toggleGoal(goalId);
    if (!currentCompleted) {
      addXP(30);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // safe fallback
      }
    }
  };

  return (
    <div id="exam-countdown-goal-tracker-page" className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Real-Time Exam Clock</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              {goalCompletionRate}% Goals Achieved
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'විභාග ගණන් කිරීමේ ඔරලෝසුව සහ දෛනික ඉලක්ක'
              : language === 'ta'
              ? 'தேர்வு கவுண்டவுன் கடிகாரம் & தினசரி இலக்குகள்'
              : 'Exam Countdown Timer & Goal Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'විභාගයට ඉතිරි දින, පැය සහ තත්පර සජීවීව නිරීක්ෂණය කර දෛනික ඉලක්ක සම්පූර්ණ කරන්න'
              : language === 'ta'
              ? 'தேர்வுக்கு மீதமுள்ள நேரத்தைக் கண்காணித்து உங்கள் தினசரி இலக்குகளை அடையுங்கள்'
              : 'Live ticking countdown paired with gamified daily study checklists and readiness metrics.'}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          {EXAM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedExamId(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedExamId === preset.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {preset.stream}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Guidance */}
      <KaviMascot
        contextPage="countdown"
        customMessage={
          language === 'si'
            ? '🦉 කවි ඔයාට කියනවා: විභාගයට තව දින ' +
              timeLeft.days +
              ' ක් ඉතිරිව ඇත! දවසට කුඩා ඉලක්ක 3ක් සාක්ෂාත් කරගන්න. කුඩා ජයග්‍රහණ එකතු වී අවසානයේ A3 සාමාර්ථයක් බවට පත්වේ!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: தேர்வுக்கு இன்னும் ' +
              timeLeft.days +
              ' நாட்கள் உள்ளன! தினமும் 3 இலக்குகளை முடித்து வெற்றி பெறுங்கள்!'
            : '🦉 Kavi says: Only ' +
              timeLeft.days +
              ' days remaining! Conquering your 3 micro-goals today builds the foundation for Island Ranks!'
        }
      />

      {/* Big Visual Real-Time Countdown Hero Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${selectedExam.badgeColor} text-white shadow-xl space-y-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider">
              {selectedExam.stream}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">{selectedExam.name[language] || selectedExam.name.en}</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md self-start sm:self-auto">
            <Calendar className="w-4 h-4" />
            <span>Target: {new Date(selectedExam.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 4-Block Digital Countdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20 shadow-inner">
            <div className="text-3xl sm:text-5xl font-mono font-black tracking-tight">{timeLeft.days}</div>
            <div className="text-[11px] uppercase tracking-widest font-extrabold text-white/80 mt-1">Days Remaining</div>
          </div>
          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20 shadow-inner">
            <div className="text-3xl sm:text-5xl font-mono font-black tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[11px] uppercase tracking-widest font-extrabold text-white/80 mt-1">Hours</div>
          </div>
          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20 shadow-inner">
            <div className="text-3xl sm:text-5xl font-mono font-black tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[11px] uppercase tracking-widest font-extrabold text-white/80 mt-1">Minutes</div>
          </div>
          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20 shadow-inner">
            <div className="text-3xl sm:text-5xl font-mono font-black tracking-tight text-amber-300 animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[11px] uppercase tracking-widest font-extrabold text-amber-200 mt-1">Seconds</div>
          </div>
        </div>
      </div>

      {/* Goal Tracker & Daily Checklist Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add Goal Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Target className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Study Milestone Goal</h3>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Goal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 2019 Past Paper Part B..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Est. Time (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    step="5"
                    value={goalMinutes}
                    onChange={(e) => setGoalMinutes(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Priority Level</label>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setGoalPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                        goalPriority === p
                          ? p === 'high'
                            ? 'bg-red-500 text-white'
                            : p === 'medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Daily Goal</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Goals List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>Today's Action Goals</span>
              <span className="text-xs font-normal text-slate-400">
                ({completedGoalsCount}/{totalGoalsCount} completed)
              </span>
            </h3>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>Earn +30 XP per goal</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {goals.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Target className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No daily goals yet</h4>
                <p className="text-xs text-slate-400">Add a high-yield goal on the left to power up your daily streak.</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    goal.completed
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-900/50 opacity-85'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleGoalWithConfetti(goal.id, goal.completed)}
                      className={`flex-shrink-0 transition-transform ${
                        goal.completed ? 'text-emerald-500 scale-110' : 'text-slate-300 hover:text-blue-500'
                      }`}
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {goal.category}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-md text-[10px] font-bold capitalize ${
                            goal.priority === 'high'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : goal.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {goal.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">⏱️ {goal.estimatedMinutes}m</span>
                      </div>
                      <p className={`text-xs ${goal.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-700 dark:text-slate-200 font-semibold'}`}>
                        {goal.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      +{goal.xpReward} XP
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-300 hover:text-red-500 p-1 rounded transition"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
