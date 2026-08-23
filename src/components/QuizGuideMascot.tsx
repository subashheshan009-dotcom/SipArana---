import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Smile, Flame, Lightbulb, ChevronRight, Zap, Trophy, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { soundFX } from '@/utils/audioUtils';
import { useLanguage } from '@/context/LanguageContext';

export interface QuizGuideMascotProps {
  currentStep: 'category' | 'stream' | 'subject' | 'quizzes';
  selectedCategoryName?: string;
  selectedStreamName?: string;
  selectedSubjectName?: string;
  totalQuizzesFound?: number;
  onResetFlow?: () => void;
}

export default function QuizGuideMascot({
  currentStep,
  selectedCategoryName,
  selectedStreamName,
  selectedSubjectName,
  totalQuizzesFound = 0,
  onResetFlow
}: QuizGuideMascotProps) {
  const { language } = useLanguage();
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [extraTipIndex, setExtraTipIndex] = useState(0);

  const getStepMessage = () => {
    switch (currentStep) {
      case 'category':
        return {
          si: 'ආයුබෝවන් මිත්‍රයා! 🎓 පළමුව ඔබගේ අධ්‍යාපන මට්ටම (A/L, O/L, කණිෂ්ඨ හෝ විශ්වවිද්‍යාල) තෝරන්න. මම ඔබට නියම ප්‍රශ්න පත්‍ර සොයා දෙන්නම්!',
          en: 'Hello friend! 🎓 First, please select your Grade / Education Category (A/L, O/L, Junior or University). I will find the right papers for you!',
          ta: 'வணக்கம் நண்பரே! 🎓 முதலில் உங்கள் கல்விப் பிரிவைத் (A/L, O/L, இடைநிலை, பல்கலைக்கழகம்) தெரிவுசெய்யுங்கள்!'
        };
      case 'stream':
        return {
          si: `විශිෂ්ට තේරීමක්! 🚀 දැන් ඔබ හදාරන විෂය ධාරාව (Stream) තෝරන්න. විෂයයන් පැටලෙන්නේ නැතිව පෙන්වන්නම්!`,
          en: `Great! 🚀 Now select your academic stream for ${selectedCategoryName || 'your category'}. Let's personalize your subjects!`,
          ta: `சிறந்தது! 🚀 இப்போது உங்கள் பாடப்பிரிவை (Stream) தெரிவுசெய்யுங்கள்.`
        };
      case 'subject':
        return {
          si: `නියමයි! ✨ දැන් ඔබ අද පුහුණු වීමට බලාපොරොත්තු වන නිශ්චිත විෂයය (Subject) තෝරාගන්න!`,
          en: `Awesome! ✨ Now pick the exact subject you want to master today from ${selectedStreamName || 'your stream'}!`,
          ta: `அற்புதம்! ✨ இன்று நீங்கள் பயிற்சி செய்ய விரும்பும் பாடத்தைத் தெரிவுசெய்யுங்கள்!`
        };
      case 'quizzes':
        return {
          si: `සුපිරි! 🏆 ${selectedSubjectName || 'මෙම විෂය'} සඳහා සකස් කළ සියලුම ඒකක බහුවරණ හා ආදර්ශ ප්‍රශ්න පත්‍ර පහතින් සූදානම් (${totalQuizzesFound} ක් ඇත)! "Start Test" ක්ලික් කර පටන් ගන්න!`,
          en: `Super! 🏆 Here are the official unit MCQ tests and model papers for ${selectedSubjectName || 'this subject'} (${totalQuizzesFound} available). Click "Start Test" to begin!`,
          ta: `வெற்றி நிச்சயம்! 🏆 ${selectedSubjectName || 'இப்பாடத்திற்குரிய'} வினாத்தாள்கள் தயார் (${totalQuizzesFound} உள்ளன). உடனே ஆரம்பியுங்கள்!`
        };
    }
  };

  const handleHighFive = () => {
    setIsHighFiving(true);
    try {
      soundFX.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => setIsHighFiving(false), 800);
  };

  const currentMsg = getStepMessage();
  const displayMsg = language === 'si' ? currentMsg.si : language === 'ta' ? currentMsg.ta : currentMsg.en;

  return (
    <motion.div
      id="quiz-guide-mascot-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-indigo-500/10 dark:from-amber-500/15 dark:to-indigo-950/40 border-2 border-amber-300/80 dark:border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
        {/* Animated Mascot Avatar */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: isHighFiving ? [0, -10, 10, -5, 0] : [0, 1, -1, 0]
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: isHighFiving ? 0.5 : 5, repeat: isHighFiving ? 0 : Infinity, ease: 'easeInOut' }
            }}
            className="relative"
          >
            <button
              id="mascot-avatar-trigger"
              type="button"
              onClick={handleHighFive}
              title="Click for motivation / High five! (අරණ මාස්කොට් සමඟ High-Five කරන්න)"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 p-1 shadow-[0_5px_0_0_#b45309] border-2 border-amber-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative shadow-inner">
                <img
                  src={mascotImage}
                  alt="SipArana Quiz Guide Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </button>

            {/* Glowing active badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
              <span>Arana Guide</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Mascot Speech Bubble */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm relative">
          {/* Arrow pointer towards mascot (visible on sm+) */}
          <div className="hidden sm:block absolute -left-2 top-6 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-l border-b border-amber-200 dark:border-slate-800 transform rotate-45" />

          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>අරණ විභාග සහයක මාස්කොට් (Arana Quiz Navigator)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="mascot-encourage-btn"
                type="button"
                onClick={handleHighFive}
                className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center gap-1 transition cursor-pointer"
              >
                <span>✋ High Five! (+10 XP)</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep + displayMsg}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed"
            >
              {displayMsg}
            </motion.p>
          </AnimatePresence>

          {/* Stepper context indicator bar */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                {currentStep === 'category' && 'පියවර 1: ශ්‍රේණිය / අංශය තෝරන්න (Step 1: Category)'}
                {currentStep === 'stream' && 'පියවර 2: විෂය ධාරාව තෝරන්න (Step 2: Stream)'}
                {currentStep === 'subject' && 'පියවර 3: විෂයය තෝරන්න (Step 3: Subject)'}
                {currentStep === 'quizzes' && 'පියවර 4: ප්‍රශ්නාවලිය තෝරන්න (Step 4: Practice Quiz)'}
              </span>
            </div>

            {onResetFlow && currentStep !== 'category' && (
              <button
                type="button"
                onClick={onResetFlow}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline transition cursor-pointer"
              >
                මුල සිට නැවත තෝරන්න (Start Over)
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
