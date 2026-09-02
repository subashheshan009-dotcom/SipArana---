import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Film,
  Smile,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  ArrowRight,
  Flame,
  Award,
  Star,
  Check,
  Lightbulb,
  Share2,
  Trophy,
  Coffee,
  Wind,
  MessageCircle,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import {
  FUN_WORD_QUIZZES,
  SHORT_STORIES,
  ENGLISH_RIDDLES,
  MOVIE_QUOTES,
  MASCOT_STEP_GUIDANCE,
  type WordQuizQuestion,
  type ShortStory,
  type EnglishRiddle,
  type MovieQuoteWisdom
} from '@/data/funEnglishData';

interface FunEnglishRelaxPageProps {
  onNavigate?: (page: string) => void;
}

export default function FunEnglishRelaxPage({ onNavigate }: FunEnglishRelaxPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // Active step flow (1: Quiz, 2: Story, 3: Riddle & Quotes, 4: Relax)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([1]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Mascot animation & interaction states
  const [mascotMood, setMascotMood] = useState<'happy' | 'celebrating' | 'thinking' | 'encouraging'>('happy');
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [mascotCheerCount, setMascotCheerCount] = useState(0);
  const [customMascotMessage, setCustomMascotMessage] = useState<string | null>(null);

  // -------------------------------------------------------------
  // STEP 1: WORD QUIZ STATE
  // -------------------------------------------------------------
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [step1Finished, setStep1Finished] = useState(false);

  // -------------------------------------------------------------
  // STEP 2: SHORT STORY STATE
  // -------------------------------------------------------------
  const [selectedStoryId, setSelectedStoryId] = useState<string>(SHORT_STORIES[0].id);
  const [isPlayingStoryAudio, setIsPlayingStoryAudio] = useState(false);
  const [storyPlaybackRate, setStoryPlaybackRate] = useState<number>(1.0);
  const [selectedWordGlossary, setSelectedWordGlossary] = useState<string | null>(null);
  const [storyQuizAnswers, setStoryQuizAnswers] = useState<Record<number, number>>({});
  const [storyQuizSubmitted, setStoryQuizSubmitted] = useState(false);
  const [step2Finished, setStep2Finished] = useState(false);

  // -------------------------------------------------------------
  // STEP 3: RIDDLE & MOVIE QUOTES STATE
  // -------------------------------------------------------------
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [selectedRiddleOption, setSelectedRiddleOption] = useState<number | null>(null);
  const [riddleSubmitted, setRiddleSubmitted] = useState(false);
  const [showRiddleHint, setShowRiddleHint] = useState(false);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [step3Finished, setStep3Finished] = useState(false);

  // -------------------------------------------------------------
  // STEP 4: RELAX & MINDFULNESS STATE
  // -------------------------------------------------------------
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(0);
  const [step4Finished, setStep4Finished] = useState(false);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  // Text-to-Speech Engine
  const speakText = (text: string, lang = 'en-US', rate = 0.95) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
      triggerToast('🔊 ඉංග්‍රීසි ශ්‍රව්‍ය උච්චාරණය වාදනය වේ...');
    } else {
      triggerToast('Speech synthesis not supported in this browser.');
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingStoryAudio(false);
  };

  // Active items
  const currentQuiz = FUN_WORD_QUIZZES[quizIndex] || FUN_WORD_QUIZZES[0];
  const activeStory = SHORT_STORIES.find((s) => s.id === selectedStoryId) || SHORT_STORIES[0];
  const currentRiddle = ENGLISH_RIDDLES[riddleIndex] || ENGLISH_RIDDLES[0];
  const activeQuote = MOVIE_QUOTES[selectedQuoteIndex] || MOVIE_QUOTES[0];

  // Mascot dynamic advice
  const currentGuidance = MASCOT_STEP_GUIDANCE[currentStep] || MASCOT_STEP_GUIDANCE[1];
  const mascotSpeechText = customMascotMessage || (() => {
    const isFinished =
      (currentStep === 1 && step1Finished) ||
      (currentStep === 2 && step2Finished) ||
      (currentStep === 3 && step3Finished) ||
      (currentStep === 4 && step4Finished);

    if (isFinished) {
      if (language === 'si') return currentGuidance.stepSuccess.si;
      if (language === 'ta') return currentGuidance.stepSuccess.ta;
      return currentGuidance.stepSuccess.en;
    }

    if (language === 'si') return currentGuidance.stepIntro.si;
    if (language === 'ta') return currentGuidance.stepIntro.ta;
    return currentGuidance.stepIntro.en;
  })();

  const handleMascotHighFive = () => {
    setIsHighFiving(true);
    setMascotMood('celebrating');
    soundFX.playCorrect();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setMascotCheerCount((c) => c + 1);
    setCustomMascotMessage(
      language === 'si'
        ? '🎉 නියමයි! අරණ සමඟ High-Five කළා! දිගටම විනෝදයෙන් ඉගෙන ගනිමු!'
        : language === 'ta'
        ? '🎉 சிறப்பு! அரணாவுடன் High-Five செய்தீர்கள்!'
        : '🎉 Awesome high-five! Keep smiling and learning!'
    );
    setTimeout(() => {
      setIsHighFiving(false);
      setCustomMascotMessage(null);
    }, 4000);
  };

  // -------------------------------------------------------------
  // STEP 1 HANDLERS
  // -------------------------------------------------------------
  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswerSubmitted) return;
    setSelectedQuizAnswer(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedQuizAnswer === null || quizAnswerSubmitted) return;
    setQuizAnswerSubmitted(true);

    const isCorrect = selectedQuizAnswer === currentQuiz.correctIndex;
    if (isCorrect) {
      soundFX.playCorrect();
      setQuizScore((prev) => prev + 1);
      setMascotMood('celebrating');
      triggerToast('🎉 නිවැරදි පිළිතුරයි!');
    } else {
      soundFX.playWrong();
      setMascotMood('encouraging');
      triggerToast('නැවත උත්සාහ කරමු! නිවැරදි පිළිතුර සහ විස්තරය බලන්න.');
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < FUN_WORD_QUIZZES.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedQuizAnswer(null);
      setQuizAnswerSubmitted(false);
    } else {
      // Step 1 Complete!
      setStep1Finished(true);
      if (!completedSteps.includes(1)) {
        setCompletedSteps((prev) => [...prev, 1]);
      }
      if (!unlockedSteps.includes(2)) {
        setUnlockedSteps((prev) => [...prev, 2]);
      }
      soundFX.playCorrect();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {
        // safe
      }
      triggerToast('🏆 පියවර 1 සාර්ථකයි! දෙවන පියවර (කෙටි කතාව) විවෘත විය');
    }
  };

  // -------------------------------------------------------------
  // STEP 2 HANDLERS
  // -------------------------------------------------------------
  const handlePlayStoryAudio = () => {
    if (isPlayingStoryAudio) {
      stopAudio();
    } else {
      setIsPlayingStoryAudio(true);
      speakText(activeStory.content, 'en-US', storyPlaybackRate);
    }
  };

  const handleStoryQuizSelect = (qIdx: number, optIdx: number) => {
    if (storyQuizSubmitted) return;
    setStoryQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitStoryQuiz = () => {
    if (storyQuizSubmitted) return;
    setStoryQuizSubmitted(true);
    setStep2Finished(true);
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    if (!unlockedSteps.includes(3)) {
      setUnlockedSteps((prev) => [...prev, 3]);
    }
    soundFX.playCorrect();
    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    } catch {
      // safe
    }
    triggerToast('🌟 කතාව කියවා ප්‍රශ්නාවලිය සම්පූර්ණයි! පියවර 3 විවෘත විය');
  };

  // -------------------------------------------------------------
  // STEP 3 HANDLERS
  // -------------------------------------------------------------
  const handleSelectRiddle = (idx: number) => {
    if (riddleSubmitted) return;
    setSelectedRiddleOption(idx);
  };

  const handleSubmitRiddle = () => {
    if (selectedRiddleOption === null || riddleSubmitted) return;
    setRiddleSubmitted(true);

    const isCorrect = selectedRiddleOption === currentRiddle.correctIndex;
    if (isCorrect) {
      soundFX.playCorrect();
      setMascotMood('celebrating');
      triggerToast('🕵️‍♂️ ප්‍රහේලිකාව නිවැරදියි!');
    } else {
      soundFX.playWrong();
      setMascotMood('encouraging');
    }
  };

  const handleFinishStep3 = () => {
    setStep3Finished(true);
    if (!completedSteps.includes(3)) {
      setCompletedSteps((prev) => [...prev, 3]);
    }
    if (!unlockedSteps.includes(4)) {
      setUnlockedSteps((prev) => [...prev, 4]);
    }
    soundFX.playCorrect();
    try {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    } catch {
      // safe
    }
    triggerToast('🎉 පියවර 3 සම්පූර්ණයි! විවේක සුවය (Relax Zone) විවෘත විය');
  };

  // -------------------------------------------------------------
  // STEP 4: RELAX / BREATHING LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSeconds((sec) => {
          if (sec <= 1) {
            setBreathPhase((prev) => {
              if (prev === 'Inhale') return 'Hold';
              if (prev === 'Hold') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const handleFinishStep4 = () => {
    setStep4Finished(true);
    if (!completedSteps.includes(4)) {
      setCompletedSteps((prev) => [...prev, 4]);
    }
    soundFX.playCorrect();
    try {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    } catch {
      // safe
    }
    triggerToast('🏆 සම්පූර්ණ Fun English Journey අවසන්! සුබ පැතුම්!');
  };

  const FORTUNES = [
    {
      en: "Every master was once a beginner. Keep your passion burning bright!",
      si: "සෑම ප්‍රවීණයෙකුම මුලදී ආධුනිකයෙකි. ඔබේ උනන්දුව දිගටම පවත්වා ගන්න!",
      ta: "ஒவ்வொரு நிபுணரும் ஒரு காலத்தில் தொடக்கநிலையாளரே!"
    },
    {
      en: "Mistakes are proof that you are trying and growing every single day.",
      si: "වැරදීම් යනු ඔබ දිනපතා අලුත් දේ ඉගෙන ගන්නා බවට හොඳම සාක්ෂියයි.",
      ta: "தவறுகள் நீங்கள் முயற்சி செய்கிறீர்கள் என்பதற்கான சான்று."
    },
    {
      en: "Believe in your brilliance. You have the power to achieve your biggest dreams!",
      si: "ඔබේ හැකියාව විශ්වාස කරන්න. ඔබේ උසස්ම හීන ජයගැනීමේ ශක්තිය ඔබ සතුයි!",
      ta: "உங்கள் திறமையை நம்புங்கள்!"
    }
  ];

  const STEPS_NAV = [
    {
      step: 1,
      title: 'Step 1: Word Quiz',
      titleSinhala: '1. විනෝදජනක වචන ප්‍රශ්නාවලිය',
      icon: Lightbulb,
      xp: '+20 XP',
      color: 'amber'
    },
    {
      step: 2,
      title: 'Step 2: Short Story',
      titleSinhala: '2. කෙටි ඉංග්‍රීසි කතාව',
      icon: BookOpen,
      xp: '+35 XP',
      color: 'blue'
    },
    {
      step: 3,
      title: 'Step 3: Riddles & Quotes',
      titleSinhala: '3. ප්‍රහේලිකා & සිනමා උපුටන',
      icon: Film,
      xp: '+35 XP',
      color: 'purple'
    },
    {
      step: 4,
      title: 'Step 4: Relax & Recharge',
      titleSinhala: '4. විවේක සුවය & හුස්ම ගැනීම',
      icon: Wind,
      xp: '+50 XP',
      color: 'emerald'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 select-text">
      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{showToast}</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Step-by-Step Mascot Learning Journey • විනෝදජනක ඉංග්‍රීසි හා විවේකය</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Fun English & Relax (ඉංග්‍රීසි විවේක පියස)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              අධික පාඩම් වෙහෙස දුරු කරමින් අරණ මාස්කොට්ගේ මඟපෙන්වීම යටතේ පියවරෙන් පියවර විනෝදජනක වචන ප්‍රශ්නාවලි, රසවත් කෙටි කතා, ප්‍රහේලිකා සහ සන්සුන් හුස්ම ගැනීමේ විවේකයෙන් ඉංග්‍රීසි දැනුම දියුණු කරගන්න.
            </p>
          </div>

          {/* Quick Progress Stats Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[260px] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Step Progress
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                {completedSteps.length}/4 Steps Completed
              </span>
            </div>

            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / 4) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-amber-300">+{profile?.xp || 0}</div>
                <div className="text-[10px] text-slate-300">Your Total XP</div>
              </div>
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-emerald-300">Step {currentStep}</div>
                <div className="text-[10px] text-slate-300">Active Zone</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANIMATED MASCOT INTERACTIVE ADVICE & SPEECH BUBBLE */}
      <motion.div
        id="arana-mascot-speech-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-blue-500/10 dark:from-slate-900/90 dark:via-amber-950/40 dark:to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* 3D Mascot Character Avatar */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: isHighFiving ? [0, -12, 12, -6, 0] : [0, 1, -1, 0]
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: isHighFiving ? 0.6 : 5, repeat: isHighFiving ? 0 : Infinity, ease: 'easeInOut' }
            }}
            onClick={handleMascotHighFive}
            className="relative cursor-pointer group flex-shrink-0"
            title="Click Arana for a High-Five & XP! ✋"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 p-1 shadow-lg border-2 border-amber-300 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src={mascotImage}
                  alt="Arana Animated Mascot Guide"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap group-hover:bg-amber-100 dark:group-hover:bg-amber-950 transition">
              ✋ {isHighFiving ? '🎉 High Five!' : 'Click Arana!'}
            </div>
          </motion.div>

          {/* Mascot Speech Bubble */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>අරණ ගුරු මාස්කොට්ගේ මඟපෙන්වීම (Arana's Step Mentor)</span>
              </div>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                Step {currentStep}: {STEPS_NAV[currentStep - 1]?.title}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep + String(customMascotMessage) + mascotCheerCount}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed bg-white/60 dark:bg-black/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40"
              >
                {mascotSpeechText}
              </motion.p>
            </AnimatePresence>

            <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Dynamic Unlocks
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Speech & Phonetics
                </span>
              </div>

              <button
                onClick={handleMascotHighFive}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1 transition shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>High-Five Arana (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. STEP PROGRESSION PIPELINE NAVIGATION BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Interactive Learning Pathway (පියවරෙන් පියවර ගමන්මග)</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {completedSteps.length} of 4 Unlocked & Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS_NAV.map((s) => {
            const isUnlocked = unlockedSteps.includes(s.step);
            const isCompleted = completedSteps.includes(s.step);
            const isActive = currentStep === s.step;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentStep(s.step);
                    soundFX.playCorrect();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 relative group cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 scale-102 ring-2 ring-amber-400/50'
                    : isUnlocked
                    ? isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 opacity-60 cursor-not-allowed text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isUnlocked
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                        {s.xp}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 text-[10px] font-black flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black truncate">{s.title}</h3>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s.titleSinhala}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE STEP WORKSPACE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* ============================================================= */}
        {/* STEP 1 WORKSPACE: FUN WORD QUIZ / VOCABULARY CHALLENGE */}
        {/* ============================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {currentQuiz.category} • Question {quizIndex + 1} of {FUN_WORD_QUIZZES.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Fun Word Quiz & Idiom Sprint (වචන ප්‍රශ්නාවලිය)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  විනෝදයෙන් පිළිතුරු දී නිවැරදි උච්චාරණය සහ සැබෑ භාවිතය හඳුනාගන්න.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(`${currentQuiz.word}. ${currentQuiz.definition}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
                  title="Listen to Word & Definition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Pronounce</span>
                </button>
              </div>
            </div>

            {/* Word Spotlight Hero Box */}
            <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-200">
                      {currentQuiz.word}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {currentQuiz.phonetic}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 uppercase">
                      {currentQuiz.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {currentQuiz.definition}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 min-w-[200px] text-right sm:text-left space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                    සිංහල & දෙමළ අර්ථය
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {currentQuiz.sinhalaMeaning}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentQuiz.tamilMeaning}
                  </div>
                </div>
              </div>

              {/* Example in Context */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 italic">
                  Example: "{currentQuiz.exampleSentence}"
                </div>
              </div>
            </div>

            {/* Quiz Interactive Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {currentQuiz.question}
              </h4>

              <div className="space-y-2.5">
                {currentQuiz.options.map((option, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === currentQuiz.correctIndex;

                  let cardStyle =
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400';

                  if (quizAnswerSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400/40';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-100 font-medium';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/40 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={quizAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fun Fact / Feedback Banner */}
            {quizAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 flex items-start gap-3"
              >
                <Smile className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-black uppercase text-amber-800 dark:text-amber-300">
                    Did You Know? (දැනුවත් බව සඳහා)
                  </h5>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQuiz.funFact}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500">
                Score: {quizScore} Correct • Question {quizIndex + 1}/{FUN_WORD_QUIZZES.length}
              </div>

              <div className="flex items-center gap-3">
                {!quizAnswerSubmitted ? (
                  <button
                    disabled={selectedQuizAnswer === null}
                    onClick={handleSubmitQuizAnswer}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <span>Check Answer (පරීක්ෂා කරන්න)</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <span>{quizIndex < FUN_WORD_QUIZZES.length - 1 ? 'Next Question →' : 'Complete Step 1 & Proceed 🎉'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step 1 Completion Celebration Banner */}
            {step1Finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/20 border-2 border-emerald-400 dark:border-emerald-500/50 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Step 1 Mastered • +30 XP Earned
                    </span>
                    <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                      🎉 Great Job! Step 2 is Unlocked!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      "Now that you've mastered the word quiz, let's move on to the next fun challenge: Reading an inspiring short English story!"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      soundFX.playCorrect();
                    }}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition shadow-lg cursor-pointer"
                  >
                    <span>Start Step 2: Read Short Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 2 WORKSPACE: READ A SHORT ENGLISH STORY */}
        {/* ============================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  Step 2 • Story Reader with Audio & Vocabulary
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Read an Inspiring Short English Story (කෙටි ඉංග්‍රීසි කතාවක්)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  කතාව කියවන්න හෝ ශ්‍රව්‍ය හඬින් අසන්න. අපහසු වචන මත ක්ලික් කර සිංහල තේරුම බලන්න.
                </p>
              </div>

              {/* Story Switcher */}
              <div className="flex items-center gap-2">
                {SHORT_STORIES.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => {
                      setSelectedStoryId(story.id);
                      stopAudio();
                      soundFX.playCorrect();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                      selectedStoryId === story.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100'
                    }`}
                  >
                    {story.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Player & Audio Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                    {activeStory.title}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                    {activeStory.titleSinhala} • {activeStory.readTime} • {activeStory.theme}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={storyPlaybackRate}
                    onChange={(e) => setStoryPlaybackRate(parseFloat(e.target.value))}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <option value="0.8">0.8x (Slow & Clear)</option>
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.2">1.2x (Fast)</option>
                  </select>

                  <button
                    onClick={handlePlayStoryAudio}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    {isPlayingStoryAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingStoryAudio ? 'Pause Narration' : 'Listen to Story'}</span>
                  </button>
                </div>
              </div>

              {/* Story Paragraphs Text Reader */}
              <div className="space-y-3.5 text-xs sm:text-sm sm:leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                {activeStory.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    {p}
                  </p>
                ))}
              </div>

              {/* Moral Box */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 flex items-start gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-semibold">
                  <span className="font-black uppercase">Moral of the Story: </span>
                  {activeStory.moral}
                </div>
              </div>
            </div>

            {/* Story Curated Vocabulary Glossary */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Story Vocabulary & Key Phrases (කතාවේ ප්‍රධාන වචන මාලාව):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeStory.glossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-blue-600 dark:text-blue-400">
                        {item.word}
                      </h5>
                      <button
                        onClick={() => speakText(item.word)}
                        className="text-slate-400 hover:text-blue-600 transition p-1"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.meaningSinhala}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.meaningTamil} • {item.pronunciation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Story Mini Comprehension Check */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Quick Comprehension Check (කතාව තේරුම් ගැනීමේ ප්‍රශ්නಾವලිය):</span>
              </h4>

              {activeStory.comprehensionQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = storyQuizAnswers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                      if (storyQuizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-600 text-white font-bold border-blue-600';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={storyQuizSubmitted}
                          onClick={() => handleStoryQuizSelect(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                {!storyQuizSubmitted ? (
                  <button
                    onClick={handleSubmitStoryQuiz}
                    disabled={Object.keys(storyQuizAnswers).length < activeStory.comprehensionQuestions.length}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>Submit & Complete Step 2</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentStep(3);
                      soundFX.playCorrect();
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>Proceed to Step 3: Riddles & Quotes →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 3 WORKSPACE: DAILY RIDDLES & MOVIE QUOTES */}
        {/* ============================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Step 3 • Detective Riddles & Cinema Wisdom
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Daily English Riddle & Movie Quote (ප්‍රහේලිකා & සිනමා උපුටන)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  වචන අතර ඇති හෝඩුවාවන් සොයා ප්‍රහේලිකාව විසඳා, සිනමා දෙබස්වලින් ව්‍යාකරණ රසය විඳින්න.
                </p>
              </div>

              {/* Riddle Switcher */}
              <div className="flex items-center gap-2">
                {ENGLISH_RIDDLES.map((_, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => {
                      setRiddleIndex(rIdx);
                      setSelectedRiddleOption(null);
                      setRiddleSubmitted(false);
                      setShowRiddleHint(false);
                      soundFX.playCorrect();
                    }}
                    className={`w-7 h-7 rounded-xl text-xs font-black transition cursor-pointer ${
                      riddleIndex === rIdx
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    #{rIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Riddle Detective Card */}
            <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 border-2 border-purple-300 dark:border-purple-900/60 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider">
                  English Mystery Riddle #{riddleIndex + 1}
                </span>

                <button
                  onClick={() => speakText(currentRiddle.riddle)}
                  className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 dark:text-purple-300 transition"
                  title="Listen to Riddle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-100 dark:border-slate-800">
                "{currentRiddle.riddle}"
              </div>

              {/* Hint Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowRiddleHint(!showRiddleHint)}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showRiddleHint ? 'Hide Clues' : 'Need a Clue from Arana? (හෝඩුවාවක් බලන්න)'}</span>
                </button>

                <span className="text-[11px] text-slate-400">Pick the mystery answer below:</span>
              </div>

              {showRiddleHint && (
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs space-y-1 animate-in fade-in">
                  <p className="font-semibold text-purple-900 dark:text-purple-200">
                    💡 <span className="font-bold">Clue:</span> {currentRiddle.hint}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    සිංහල හෝඩුවාව: {currentRiddle.sinhalaClue}
                  </p>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentRiddle.options.map((opt, optIdx) => {
                  const isSelected = selectedRiddleOption === optIdx;
                  const isCorrect = optIdx === currentRiddle.correctIndex;

                  let optStyle =
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400';

                  if (riddleSubmitted) {
                    if (isCorrect) optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                    else if (isSelected) optStyle = 'bg-rose-500/20 border-rose-500 text-rose-950 dark:text-rose-100';
                  } else if (isSelected) {
                    optStyle = 'bg-purple-600 text-white font-bold border-purple-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={riddleSubmitted}
                      onClick={() => handleSelectRiddle(optIdx)}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition cursor-pointer ${optStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {riddleSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  ✓ {currentRiddle.funExplanation}
                </div>
              )}

              <div className="flex justify-end pt-2">
                {!riddleSubmitted && (
                  <button
                    disabled={selectedRiddleOption === null}
                    onClick={handleSubmitRiddle}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>Check Riddle Answer</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Movie Quote & Grammar Spotlight */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                    Cinema Wisdom & Grammar Breakdown
                  </span>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {activeQuote.source} • {activeQuote.speaker}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {MOVIE_QUOTES.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => setSelectedQuoteIndex(qIdx)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedQuoteIndex === qIdx
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Quote {qIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-100 dark:border-slate-800 space-y-3">
                <div className="text-base sm:text-lg font-black text-purple-950 dark:text-purple-200 italic leading-snug">
                  {activeQuote.quote}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {activeQuote.sinhalaTranslation}
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 space-y-1 text-xs">
                  <div className="font-bold text-purple-700 dark:text-purple-300 uppercase text-[10px]">
                    Grammar Focus: {activeQuote.grammarFocus}
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 font-medium">
                    <span className="font-bold">Life Lesson: </span>
                    {activeQuote.lifeLesson}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleFinishStep3}
                  className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-lg"
                >
                  <span>Complete Step 3 & Unlock Relax Zone →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 4 WORKSPACE: RELAX & MINDFULNESS BREATHER */}
        {/* ============================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Step 4 • Mindful Breathing & Daily Fortune
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Relax & Mindfulness Zone (විවේක සුවය & හුස්ම ගැනීමේ විරාමය)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  මොළය නැවුම් කරගෙන ආතතිය දුරු කිරීමට සන්සුන් හුස්ම ගැනීමේ අභ්‍යාසයෙහි නිරත වන්න.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsBreathingActive(!isBreathingActive);
                    soundFX.playCorrect();
                  }}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isBreathingActive ? 'Pause Breathing' : 'Start 60s Breather'}</span>
                </button>
              </div>
            </div>

            {/* Guided Breathing Visual Circle */}
            <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Box Breathing Technique (4-4-4)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
                  {breathPhase === 'Inhale'
                    ? 'Inhale Slowly (හුස්ම ඇතුළට ගන්න...)'
                    : breathPhase === 'Hold'
                    ? 'Hold Gently (හුස්ම රඳවා තබාගන්න...)'
                    : 'Exhale Completely (හුස්ම පිටකරන්න...)'}
                </h3>
              </div>

              {/* Animated Glowing Breathing Bubble */}
              <motion.div
                animate={{
                  scale: breathPhase === 'Inhale' ? [1, 1.35] : breathPhase === 'Hold' ? [1.35, 1.35] : [1.35, 1],
                  boxShadow:
                    breathPhase === 'Inhale'
                      ? '0 0 40px rgba(16, 185, 129, 0.4)'
                      : breathPhase === 'Hold'
                      ? '0 0 50px rgba(59, 130, 246, 0.4)'
                      : '0 0 20px rgba(16, 185, 129, 0.2)'
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 flex flex-col items-center justify-center text-slate-950 font-black shadow-2xl p-4 border-4 border-white/60"
              >
                <Wind className="w-8 h-8 mb-1 animate-pulse" />
                <span className="text-2xl sm:text-3xl font-black">{breathSeconds}s</span>
                <span className="text-[11px] uppercase tracking-wider font-extrabold">{breathPhase}</span>
              </motion.div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
                "Deep breathing increases oxygen flow to your prefrontal cortex, enhancing long-term memory retention and exam composure."
              </p>
            </div>

            {/* Daily Fortune Cookie & Motivation */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Smile className="w-4 h-4" />
                  <span>Arana's Daily Smile & Motivation Card (දවසේ සතුටු පණිවිඩය):</span>
                </span>
                <button
                  onClick={() => {
                    setFortuneIndex((prev) => (prev + 1) % FORTUNES.length);
                    soundFX.playCorrect();
                  }}
                  className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Next Fortune</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-slate-800 space-y-1.5">
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 italic">
                  "{FORTUNES[fortuneIndex].en}"
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {FORTUNES[fortuneIndex].si}
                </p>
              </div>

              {/* Final Journey Wrap up Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleFinishStep4}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xl shadow-emerald-600/20"
                >
                  <Award className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Finish Journey & Collect Master Badge (+50 XP)</span>
                </button>
              </div>
            </div>

            {/* Master Completion Trophy Banner */}
            {step4Finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 border-2 border-amber-400 text-center space-y-4"
              >
                <Trophy className="w-12 h-12 text-amber-500 fill-amber-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                    🎓 Daily English Break Master Achievement!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                    You have successfully navigated through all four steps with Arana Mascot. Keep this awesome momentum in your studies!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      soundFX.playCorrect();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition cursor-pointer"
                  >
                    Restart Journey
                  </button>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition cursor-pointer"
                    >
                      Back to Dashboard →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
