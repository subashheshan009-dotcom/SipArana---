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
  Headphones,
  Languages,
  Brain,
  BrainCircuit,
  Newspaper,
  ScanLine,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCountry } from '@/context/CountryContext';
import { useExamNews } from '@/context/NewsContext';
import { SUBJECTS_DATA, INITIAL_STUDY_TASKS, SCHOOL_GRADES } from '@/data/mockData';
import type { PageId } from '@/components/Layout';
import type { StudyTask } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import AranaMascot from '@/components/AranaMascot';
import Grade5ScholarshipWizard from '@/components/Grade5ScholarshipWizard';
import StudentRoleIsolationBanner from '@/components/StudentRoleIsolationBanner';
import KaviStepByStepMentor from '@/components/KaviStepByStepMentor';
import AutonomousCurriculumSyncModal from '@/components/AutonomousCurriculumSyncModal';
import LiveStudyPulseBanner from '@/components/LiveStudyPulseBanner';
import KaviStudyPetWidget from '@/components/KaviStudyPetWidget';
import FocusZoneWidget from '@/components/FocusZoneWidget';
import LiveLeaderboardCard from '@/components/LiveLeaderboardCard';
import { CompactTop3Scholars } from '@/components/CompactTop3Scholars';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { cheerStudent } from '@/services/leaderboardService';
import { GlobalCurriculumEngine } from '@/utils/globalCurriculumEngine';
import { soundFX } from '@/utils/audioUtils';
import { getPersonalizedReturningGreeting } from '@/utils/userMemoryEngine';
import {
  isDailyActionClaimedToday,
  recordDailyActionClaim,
  triggerDailyLockToast
} from '@/utils/dailyXpLockEngine';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, studyMemory } = useAuth();
  const { language, t } = useLanguage();
  const { country, curriculum, dictionary, subjects: dynamicSubjects, gradingSystem, mascot } = useCountry();
  const { notices, isSyncing } = useExamNews();
  const { leaderboard, top3, refreshLeaderboard } = useLeaderboard();
  const userKey = profile?.email || profile?.id || 'guest_user';

  const handleCheerStudent = async (id: string) => {
    await cheerStudent(id);
    refreshLeaderboard();
  };

  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [isDailyQuizClaimed, setIsDailyQuizClaimed] = useState<boolean>(() => {
    return isDailyActionClaimedToday('dashboard_daily_quiz', userKey);
  });
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<boolean | null>(null);
  const [isScholarshipWizardOpen, setIsScholarshipWizardOpen] = useState(profile?.grade === 5);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Sync state on user profile change
  React.useEffect(() => {
    setIsDailyQuizClaimed(isDailyActionClaimedToday('dashboard_daily_quiz', userKey));
  }, [userKey]);

  // Daily challenge question adaptive to level and language
  const userGrade = profile?.grade || 11;
  const isSriLanka = country.code === 'LK';
  const isGrade5 = isSriLanka && (
    profile?.grade === 5 ||
    profile?.level === 'SCHOLARSHIP' ||
    profile?.stream === 'Grade 5 Scholarship' ||
    !!profile?.isKidMode
  );
  const isOLOrJunior = userGrade <= 11;

  const dailyQuiz = isGrade5
    ? {
        subject: language === 'si' ? '5 වසර බුද්ධි පරීක්ෂණ (Scholarship IQ)' : 'Grade 5 Scholarship IQ & Puzzles',
        question: language === 'si'
          ? 'රූප රටාවේ මීළඟට එන සංඛ්‍යාව කුමක්ද?  2,  4,  8,  16,  ?'
          : 'What is the next number in the pattern?  2,  4,  8,  16,  ?',
        options: ['20', '24', '32', '64'],
        correct: 2,
        explanation: language === 'si'
          ? 'සෑම සංඛ්‍යාවක්ම පෙර සංඛ්‍යාව 2 න් ගුණ කිරීමෙන් (දෙගුණ වීමෙන්) ලැබේ. 16 x 2 = 32.'
          : 'Each number is doubled (multiplied by 2). 16 x 2 = 32.'
      }
    : isOLOrJunior
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
    if (isDailyQuizClaimed) {
      triggerDailyLockToast(
        '⚠️ You have already completed and earned XP for today\'s Daily Brain Challenge! Come back tomorrow at midnight for a fresh challenge.',
        'Daily Brain Challenge'
      );
      return;
    }
    if (quizAnswered !== null) return;

    setQuizAnswered(index);
    const isCorrect = index === dailyQuiz.correct;
    setQuizScore(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      setIsDailyQuizClaimed(true);
    } else {
      soundFX.playIncorrect();
    }
  };

  const toggleTask = (taskId: string) => {
    const taskActionKey = `dashboard_task_${taskId}`;
    const isTaskClaimedToday = isDailyActionClaimedToday(taskActionKey, userKey);

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            soundFX.playLevelUp();
          }
          return { ...t, isCompleted: nextState };
        }
        return t;
      })
    );
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const taskProgressPercent = Math.round((completedTasksCount / tasks.length) * 100);

  // Filter subjects matching student's country, curriculum, grade and stream
  const activeCountry = country;
  const activeCurriculum = curriculum;
  const globalSubjects = dynamicSubjects;

  const streamSubjects = isGrade5
    ? SUBJECTS_DATA.filter((s) => ['sub_sch_sinhala', 'sub_sch_maths', 'sub_sch_env', 'sub_sch_iq'].includes(s.id))
    : SUBJECTS_DATA.filter((s) => s.grades.includes(userGrade)).slice(0, 3);

  const displaySubjects =
    activeCountry.code === 'LK'
      ? streamSubjects.length > 0
        ? streamSubjects
        : SUBJECTS_DATA.filter((s) => !profile || s.stream === profile.stream).slice(0, 3)
      : globalSubjects.map((gs) => ({
          id: gs.id,
          code: gs.code,
          titleEnglish: gs.titleEnglish,
          titleSinhala: gs.titleNative || gs.titleEnglish,
          category: gs.category,
          grades: gs.grades,
          stream: gs.stream,
          totalModules: gs.unitsCount || 10,
          completedModules: Math.floor((gs.unitsCount || 10) * 0.3),
          color: gs.color
        })).slice(0, 3);

  const gradeInfo = SCHOOL_GRADES.find((g) => g.grade === userGrade);
  const examTargetLabel =
    activeCountry.code !== 'LK'
      ? `${activeCurriculum.titleEnglish} (${gradingSystem.targetSample})`
      : isGrade5
      ? '5 වසර ශිෂ්‍යත්වය (160+ Target)'
      : userGrade >= 12
      ? `A/L ${profile?.targetYear || 2026} (3 A's)`
      : userGrade >= 10
      ? `O/L ${profile?.targetYear || 2026} (9 A's)`
      : `Grade ${userGrade} Term Exam`;

  const returningGreeting = getPersonalizedReturningGreeting(profile, studyMemory, language);

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* 0. LIVE COMMUNITY STUDY PULSE & PERSONALIZED AI GOAL GREETING */}
      <LiveStudyPulseBanner />

      {/* 0b. COMPACT TOP 3 REAL REGISTERED SCHOLARS (SLOTS FILLED AS REAL USERS REGISTER) */}
      {top3.length > 0 && (
        <CompactTop3Scholars
          students={top3}
          onNavigate={onNavigate}
          currentUserId={profile?.id}
        />
      )}

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
                <CheckCircle2 className="w-3 h-3" /> {dictionary.heroBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {returningGreeting.headline}
            </h1>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              {returningGreeting.subtext}
            </p>

            {returningGreeting.hasPreviousHistory && returningGreeting.resumeTopic && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playCorrect();
                    onNavigate('ai_tutor');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'si'
                      ? `"${returningGreeting.resumeTopic}" පාඩම දිගටම කරගෙන යන්න`
                      : `Resume "${returningGreeting.resumeTopic}"`}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Target: <strong>{examTargetLabel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Streak: <strong>{profile?.streakDays || 1} Days Active</strong></span>
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

      {/* 2. DYNAMIC STUDENT ROLE ISOLATION & CONTEXTUAL BANNER */}
      <StudentRoleIsolationBanner onOpenSyncModal={() => setShowSyncModal(true)} />

      {/* 2b. KAVI THE OWL STEP-BY-STEP ADAPTIVE MENTOR (SINHALA VOICE & SCRIPT) */}
      <KaviStepByStepMentor onNavigate={onNavigate} />

      {/* 2c. ARANA & KAVI INTERACTIVE AI COMPANIONS & STUDY PET */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6">
          <KaviStudyPetWidget />
        </div>
        <div className="md:col-span-6 flex flex-col justify-between">
          <section id="arana-mascot-mentor-card" className="h-full bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-amber-400/40 dark:border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-lg backdrop-blur-xs flex items-center">
            <AranaMascot
              size="md"
              mood={quizScore === true ? 'celebrating' : quizScore === false ? 'encouraging' : 'happy'}
              interactive={true}
            />
          </section>
        </div>
      </div>

      {/* 2d. COUNTRY-SPECIFIC STAGE BANNER */}
      {isSriLanka ? (
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
      ) : (
        <section
          id="global-stage-highlight-banner"
          className="p-4 sm:p-5 rounded-3xl border-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border-blue-200 dark:border-blue-800 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 text-white font-black text-xl">
              <span>{country.flag}</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                  {country.name} • {curriculum.authorityBoard}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  Target: {gradingSystem.targetExcellence}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Official National Standards & AI Lesson Modules
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                Calibrated against {curriculum.titleEnglish} teacher guides and national examination benchmarks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('subjects')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Explore {country.code} Subject Modules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 3. HORIZONTAL QUICK-ACTION APP TOOLS BAR */}
      {isGrade5 ? (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('subjects')}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/20 dark:from-amber-950/60 dark:to-orange-950/50 border-2 border-amber-400 dark:border-amber-500/60 hover:shadow-lg transition text-left space-y-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-amber-500 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300">
                5 වසර විෂයයන්
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">ගුරු පොත සහ පාඩම්</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('quizzes')}
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-cyan-500/20 dark:from-blue-950/60 dark:to-indigo-950/50 border-2 border-blue-400 dark:border-blue-500/60 hover:shadow-lg transition text-left space-y-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-blue-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-blue-900 dark:text-blue-300">
                විනෝද ප්‍රශ්න & IQ
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">ලකුණු සහ තරඟ</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai_tutor')}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-green-500/20 dark:from-emerald-950/60 dark:to-teal-950/50 border-2 border-emerald-400 dark:border-emerald-500/60 hover:shadow-lg transition text-left space-y-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-300">
                කවි AI ගුරුතුමා
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">හඬින් ප්‍රශ්න අහන්න</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('fun_english')}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-rose-500/20 dark:from-purple-950/60 dark:to-pink-950/50 border-2 border-purple-400 dark:border-purple-500/60 hover:shadow-lg transition text-left space-y-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-purple-600 text-white font-bold w-fit group-hover:scale-105 transition shadow-sm">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-purple-900 dark:text-purple-300">
                ඉංග්‍රීසි & විවේකය
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">කවි කතා & ක්‍රීඩා</p>
            </div>
          </button>
        </section>
      ) : (
        <>
        <div className="space-y-6">
          {/* GROUP 1: 🎓 CORE ACADEMICS & REVISION (අධ්‍යයන & ප්‍රශ්න පත්‍ර) */}
          <section className="bg-blue-50/60 dark:bg-blue-950/25 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-blue-200/40 dark:border-blue-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">🎓</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wide text-blue-900 dark:text-blue-200 uppercase">
                    {language === 'si' ? 'අධ්‍යයන & ප්‍රශ්න පත්‍ර' : language === 'ta' ? 'பாடங்கள் & வினாத்தாள்கள்' : 'CORE ACADEMICS & REVISION'}
                  </h3>
                  <p className="text-[10px] text-blue-700/70 dark:text-blue-300/70 font-medium leading-none">
                    {language === 'si' ? 'Core Academics, Past Papers & Video Classes' : 'විෂයන්, ප්‍රශ්න පත්‍ර සහ වීඩියෝ පන්ති'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                4 Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Subjects & Past Papers */}
              <button
                id="dash-tool-subjects"
                onClick={() => onNavigate('subjects')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {language === 'si' ? 'විෂයන් සහ ප්‍රශ්න පත්‍ර' : 'Subjects & Past Papers'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Subjects & Past Papers' : 'විෂයන් සහ ප්‍රශ්න පත්‍ර'}
                  </p>
                </div>
              </button>

              {/* MCQ Quizzes & Test Series */}
              <button
                id="dash-tool-quizzes"
                onClick={() => onNavigate('quizzes')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {language === 'si' ? 'එම්.සී.කියු. ප්‍රශ්න' : 'MCQ Quizzes & Tests'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'MCQ Quizzes & Test Series' : 'එම්.සී.කියු. ප්‍රශ්න'}
                  </p>
                </div>
              </button>

              {/* HD Video Classroom */}
              <button
                id="dash-tool-classroom"
                onClick={() => onNavigate('classroom')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {language === 'si' ? 'වීඩියෝ පාඩම්' : 'HD Video Classroom'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'HD Video Classroom' : 'වීඩියෝ පාඩම්'}
                  </p>
                </div>
              </button>

              {/* Offline Syllabus & PDFs */}
              <button
                id="dash-tool-syllabus"
                onClick={() => onNavigate('offline_syllabus')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                    <HardDriveDownload className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200/70">
                    FREE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
                    {language === 'si' ? 'විෂය නිර්දේශ සහ PDF' : 'Offline Syllabus & PDFs'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Offline Syllabus & PDFs' : 'විෂය නිර්දේශ සහ PDF'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* GROUP 2: 🤖 AI STUDY ASSISTANTS (ස්මාර්ට් AI මෙවලම්) */}
          <section className="bg-purple-50/60 dark:bg-purple-950/25 border border-purple-200/60 dark:border-purple-800/40 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-purple-200/40 dark:border-purple-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">🤖</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wide text-purple-900 dark:text-purple-200 uppercase">
                    {language === 'si' ? 'ස්මාර්ට් AI මෙවලම්' : language === 'ta' ? 'AI படிப்பு உதவியாளர்கள்' : 'AI STUDY ASSISTANTS'}
                  </h3>
                  <p className="text-[10px] text-purple-700/70 dark:text-purple-300/70 font-medium leading-none">
                    {language === 'si' ? 'AI Tutor, Planner, Flashcards & Voice Notes' : 'AI ගුරු සහකාර, කාලසටහන & මතක කාඩ්'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                4 Tools
              </span>
            </div>

            {/* AI Smart File Evaluator & Mind-Map Studio Hero Banner */}
            <div
              id="dash-tool-smart-evaluator-banner"
              onClick={() => onNavigate('smart_evaluator')}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-emerald-500/15 border-2 border-cyan-400/50 dark:border-cyan-500/40 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                        ⭐ NEW AI FEATURE
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        Camera OCR • 3D Mind-Maps • NIE Rubrics
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {language === 'si'
                        ? 'AI ස්මාර්ට් ලේඛන ඇගයුම්කරු සහ මනෝ සිතියම් මැදිරිය 🦉'
                        : 'AI Smart File Evaluator & Mind-Map Studio'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                      {language === 'si'
                        ? 'අතින් ලියූ පිළිතුරු පත්‍ර ලකුණු කරන්න, PDF වලින් 3D මනෝ සිතියම් හදන්න සහ ගණිත ගැටලු විසඳන්න.'
                        : 'Upload photo/PDF to evaluate handwritten answers, generate interactive mind-maps, and solve step-by-step.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md group-hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>{language === 'si' ? 'විවෘත කරන්න' : 'Launch Studio'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Continuous Study Memory & Saved Assets Sync Widget */}
            <div
              onClick={() => onNavigate('ai_tutor')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/70 dark:border-purple-900/60 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300/40">
                        ⚡ Continuous Memory Sync
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[180px]">
                        {profile?.email || 'Active Student Account'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'si'
                        ? 'අඛණ්ඩ අධ්‍යයන මතකය සහ සුරැකි සටහන්'
                        : 'Continuous Study Memory & Context Retention'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {language === 'si'
                        ? 'පෙර විමසූ ප්‍රශ්න, උත්පාදිත සාරාංශ සහ Flashcards සුරැකී ඇත.'
                        : 'Past chats, summaries, essay scores and weak points are safely retained.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                  <div className="flex gap-1.5 text-center text-xs">
                    <div className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] text-slate-400 font-bold">Chats</span>
                      <span className="font-black text-purple-600 dark:text-purple-400 text-xs">
                        {studyMemory?.chatHistory?.filter((m) => m.sender === 'user').length || 0}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] text-slate-400 font-bold">Assets</span>
                      <span className="font-black text-amber-600 dark:text-amber-400 text-xs">
                        {studyMemory?.savedAssets?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-600 text-white group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* AI Tutor & Voice Chat */}
              <button
                id="dash-tool-ai-tutor"
                onClick={() => onNavigate('ai_tutor')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {language === 'si' ? 'AI ගුරු සහකාර' : 'AI Tutor & Voice Chat'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'AI Tutor & Voice Chat' : 'AI ගුරු සහකාර'}
                  </p>
                </div>
              </button>

              {/* AI Study Planner */}
              <button
                id="dash-tool-planner"
                onClick={() => onNavigate('planner')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70">
                    NEW
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {language === 'si' ? 'පාඩම් කාලසටහන' : 'AI Study Planner'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'AI Study Planner' : 'පාඩම් කාලසටහන'}
                  </p>
                </div>
              </button>

              {/* Smart Flashcards */}
              <button
                id="dash-tool-flashcards"
                onClick={() => onNavigate('flashcards')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {language === 'si' ? 'ක්ෂණික මතක කාඩ්' : 'Smart Flashcards'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Smart Flashcards' : 'ක්ෂණික මතක කාඩ්'}
                  </p>
                </div>
              </button>

              {/* Voice Notes & Audio */}
              <button
                id="dash-tool-audio"
                onClick={() => onNavigate('audio')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Headphones className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {language === 'si' ? 'ශ්‍රව්‍ය සටහන්' : 'Voice Notes & Audio'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Voice Notes & Audio' : 'ශ්‍රව්‍ය සටහන්'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* GROUP 3: 🌐 LANGUAGES & SKILLS (භාෂා සහ ඉගෙනුම්) */}
          <section className="bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-amber-200/40 dark:border-amber-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">🌐</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wide text-amber-900 dark:text-amber-200 uppercase">
                    {language === 'si' ? 'භාෂා සහ ඉගෙනුම්' : language === 'ta' ? 'மொழிகள் & திறன்கள்' : 'LANGUAGES & SKILLS'}
                  </h3>
                  <p className="text-[10px] text-amber-700/70 dark:text-amber-300/70 font-medium leading-none">
                    {language === 'si' ? 'Language Adventure, Foreign Languages, English Practice & Online Courses' : 'භාෂා චාරිකාව, විදේශ භාෂා, ඉංග්‍රීසි පුහුණුව සහ පාඨමාලා'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                4 Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Language Learning Adventure */}
              <button
                id="dash-tool-lang-adventure"
                onClick={() => onNavigate('language_adventure')}
                className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/60 dark:to-purple-950/50 border border-indigo-300 dark:border-indigo-700/80 hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold group-hover:scale-105 transition-transform shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/70">
                    ADVENTURE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {language === 'si' ? 'භාෂා ඉගෙනුම් චාරිකාව' : 'Language Adventure'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Speaking, Writing & Reading' : 'කතා කරන, ලියන, කියවන'}
                  </p>
                </div>
              </button>

              {/* Modern & Foreign Languages */}
              <button
                id="dash-tool-languages"
                onClick={() => onNavigate('modern_languages')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <Languages className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70">
                    NEW
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                    {language === 'si' ? 'විදේශ භාෂා' : 'Modern & Foreign Languages'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Modern & Foreign Languages' : 'විදේශ භාෂා'}
                  </p>
                </div>
              </button>

              {/* Fun English & Practice */}
              <button
                id="dash-tool-fun-english"
                onClick={() => onNavigate('fun_english')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <Smile className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                    {language === 'si' ? 'ඉංග්‍රීසි පුහුණුව' : 'Fun English & Practice'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Fun English & Practice' : 'ඉංග්‍රීසි පුහුණුව'}
                  </p>
                </div>
              </button>

              {/* Free Online Courses */}
              <button
                id="dash-tool-free-courses"
                onClick={() => onNavigate('free_courses')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200/70">
                    FREE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
                    {language === 'si' ? 'නොමිලේ පාඨමාලා' : 'Free Online Courses'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Free Online Courses' : 'නොමිලේ පාඨමාලා'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* GROUP 4: 📊 PROGRESS & STUDENT HUB (ප්‍රගතිය සහ තොරතුරු) */}
          <section className="bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-200/40 dark:border-emerald-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">📊</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wide text-emerald-900 dark:text-emerald-200 uppercase">
                    {language === 'si' ? 'ප්‍රගතිය සහ තොරතුරු' : language === 'ta' ? 'முன்னேற்றம் & தளம்' : 'PROGRESS & STUDENT HUB'}
                  </h3>
                  <p className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70 font-medium leading-none">
                    {language === 'si' ? 'Performance Analytics, Campus, News & Community Hub' : 'ප්‍රගති වාර්තා, සරසවි තොරතුරු, පුවත් & පොත් හල'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                5 Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {/* Performance Analytics */}
              <button
                id="dash-tool-analytics"
                onClick={() => onNavigate('analytics')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {language === 'si' ? 'ප්‍රගති වාර්තාව' : 'Performance Analytics'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Performance Analytics' : 'ප්‍රගති වාර්තාව'}
                  </p>
                </div>
              </button>

              {/* Campus & Z-Score Info */}
              <button
                id="dash-tool-campus"
                onClick={() => onNavigate('campus')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {language === 'si' ? 'සරසවි සහ Z-Score' : 'Campus & Z-Score Info'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Campus & Z-Score Info' : 'සරසවි සහ Z-Score'}
                  </p>
                </div>
              </button>

              {/* Exam News & Alerts */}
              <button
                id="dash-tool-news"
                onClick={() => onNavigate('news')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <Newspaper className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {language === 'si' ? 'විභාග පුවත්' : 'Exam News & Alerts'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Exam News & Alerts' : 'විභාග පුවත්'}
                  </p>
                </div>
              </button>

              {/* Student Community Hub */}
              <button
                id="dash-tool-google-hub"
                onClick={() => onNavigate('google_hub')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {language === 'si' ? 'සිසු පියස' : 'Student Community Hub'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'Student Community Hub' : 'සිසු පියස'}
                  </p>
                </div>
              </button>

              {/* SipArana Book Shop */}
              <button
                id="dash-tool-book-shop"
                onClick={() => onNavigate('book_shop')}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                    {language === 'si' ? 'සිප්අරණ පොත් හල' : 'SipArana Book Shop'}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">
                    {language === 'si' ? 'SipArana Book Shop' : 'සිප්අරණ පොත් හල'}
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
        </>
      )}

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
              {isDailyQuizClaimed ? (
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Claimed Today ✅ (+50 XP)</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                  +50 XP
                </span>
              )}
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

          {/* Weekly Live Top Students Leaderboard */}
          <LiveLeaderboardCard onNavigate={onNavigate} />
        </div>
      </div>

      {/* 5. FOCUS STUDY ZONE & POMODORO TIMER + AMBIENT SOUND GENERATOR */}
      <FocusZoneWidget />

      {/* Grade 5 Scholarship Interactive Guided Wizard Modal */}
      <Grade5ScholarshipWizard
        isOpen={isScholarshipWizardOpen}
        onClose={() => setIsScholarshipWizardOpen(false)}
        onNavigateToSubject={(subjectId) => {
          setIsScholarshipWizardOpen(false);
          onNavigate('subjects');
        }}
      />

      {/* Autonomous Curriculum & Self-Healing Sync Modal */}
      <AutonomousCurriculumSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
