import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Smile, Flame, Lightbulb, ChevronRight, Zap, Trophy, Heart, FileText, Download, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { soundFX } from '@/utils/audioUtils';
import { useLanguage } from '@/context/LanguageContext';

export interface SyllabusGuideMascotProps {
  currentStep: 'category' | 'stream' | 'subject' | 'documents';
  selectedCategoryName?: string;
  selectedStreamName?: string;
  selectedSubjectName?: string;
  totalDocumentsFound?: number;
  offlineCount?: number;
  onResetFlow?: () => void;
  onViewOfflineTab?: () => void;
}

export default function SyllabusGuideMascot({
  currentStep,
  selectedCategoryName,
  selectedStreamName,
  selectedSubjectName,
  totalDocumentsFound = 0,
  offlineCount = 0,
  onResetFlow,
  onViewOfflineTab
}: SyllabusGuideMascotProps) {
  const { language } = useLanguage();
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [extraTipIndex, setExtraTipIndex] = useState(0);

  const getStepMessage = () => {
    switch (currentStep) {
      case 'category':
        return {
          si: 'ආයුබෝවන් යාලුවා! 📚 පළමුව ඔබගේ අධ්‍යාපන මට්ටම (A/L, O/L, කණිෂ්ඨ හෝ විශ්වවිද්‍යාල) තෝරන්න. මම ඔබට නියම NIE විෂය නිර්දේශ, ගුරු පොත් සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර සොයා දෙන්නම්!',
          en: 'Welcome friend! 📚 First, select your Education Category (A/L, O/L, Middle School, or University). I will find the official NIE Syllabi, Teacher Guides & Past Papers for you!',
          ta: 'வணக்கம் நண்பரே! 📚 முதலில் உங்கள் கல்விப் பிரிவைத் (A/L, O/L, இடைநிலை, பல்கலைக்கழகம்) தெரிவுசெய்யுங்கள். உத்தியோகபூர்வ பாடத்திட்டங்களையும் வினாத்தாள்களையும் தருகிறேன்!'
        };
      case 'stream':
        return {
          si: `විශිෂ්ටයි! 🧭 දැන් ${selectedCategoryName || 'ඔබගේ මට්ටම'} සඳහා විෂය ධාරාව (Stream) තෝරන්න. විෂයයන් පැටලෙන්නේ නැතිව නිවැරදි ලිපිගොනු පෙන්වන්නම්!`,
          en: `Great! 🧭 Now select your academic stream for ${selectedCategoryName || 'your category'}. Let's narrow down to your exact subjects!`,
          ta: `சிறந்தது! 🧭 இப்போது ${selectedCategoryName || 'உங்கள் கல்விப் பிரிவின்'} பாடப்பிரிவைத் தெரிவுசெய்யுங்கள்.`
        };
      case 'subject':
        return {
          si: `නියමයි! ✨ දැන් ඔබ PDF ලේඛන බාගත කිරීමට හෝ Offline කියවීමට බලාපොරොත්තු වන නිශ්චිත විෂයය (Subject) තෝරාගන්න!`,
          en: `Awesome! ✨ Now choose the specific subject you want to download documents for from ${selectedStreamName || 'your stream'}!`,
          ta: `அற்புதம்! ✨ இப்போது ஆவணங்களைப் பெற விரும்பும் குறிப்பிட்ட பாடத்தைத் தெரிவுசெய்யுங்கள்!`
        };
      case 'documents':
        return {
          si: `සුපිරි! 📂 ${selectedSubjectName || 'මෙම විෂය'} සඳහා නිල NIE විෂය නිර්දේශ, ගුරු මාර්ගෝපදේශ (Guru Potha), සම්පත් පොත්, සහ Marking Schemes සහිත පසුගිය ප්‍රශ්න පත්‍ර (${totalDocumentsFound} ක්) පහතින් සූදානම්! 1-Click එකෙන් බාගත කරන්න හෝ Offline Cache කරන්න!`,
          en: `Super! 📂 Here are the official NIE Syllabi, Teacher Guides (Guru Potha), Past Papers with Marking Schemes, and Short Notes for ${selectedSubjectName || 'this subject'} (${totalDocumentsFound} files available). You can download or view offline anytime!`,
          ta: `வெற்றி நிச்சயம்! 📂 ${selectedSubjectName || 'இப்பாடத்திற்குரிய'} உத்தியோகபூர்ව பாடத்திட்டங்கள், ஆசிரியர் வழிகாட்டிகள் மற்றும் கடந்த கால வினாத்தாள்கள் தயார் (${totalDocumentsFound} கோப்புகள்). உடனே பதிவிறக்குங்கள்!`
        };
    }
  };

  const handleHighFive = () => {
    setIsHighFiving(true);
    try {
      soundFX.playCorrect();
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => setIsHighFiving(false), 800);
  };

  const currentMsg = getStepMessage();
  const displayMsg = language === 'si' ? currentMsg.si : language === 'ta' ? currentMsg.ta : currentMsg.en;

  const STUDY_TIPS = [
    '💡 Tip: විභාග ලකුණු ලබා දීමේ පටිපාටි (Marking Schemes) නිතරම අධ්‍යයනය කරන්න - විභාග පරීක්ෂකවරු බලාපොරොත්තු වන නිශ්චිත වචන (Keywords) හඳුනාගත හැක්කේ එවිටයි!',
    '💾 Offline Cache: ඕනෑම PDF එකක ඇති "Offline Save" බොත්තම එබූ විට ඉන්ටර්නෙට් නැතිව වුවද ඕනෑම තැනකදී පහසුවෙන් කියවිය හැක!',
    '📖 Guru Potha: ජාතික අධ්‍යාපන ආයතනයේ (NIE) ගුරු මාර්ගෝපදේශ පොත්වල එක් එක් ඒකකය සඳහා වෙන්කර ඇති කාලච්ඡේද (Periods) සහ නිපුණතා මට්ටම් පැහැදිලිව සඳහන් කර ඇත.',
    '🖨️ High-Quality Print: "Print PDF" ක්ලික් කර A4 ප්‍රමාණයට පැහැදිලිව මුද්‍රණය කරගත හැක.'
  ];

  return (
    <motion.div
      id="syllabus-guide-mascot-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-indigo-500/10 dark:from-blue-950/30 dark:to-indigo-950/40 border-2 border-blue-300/80 dark:border-blue-500/40 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

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
              id="syllabus-mascot-avatar-trigger"
              type="button"
              onClick={handleHighFive}
              title="Click for motivation / High five! (අරණ මාස්කොට් සමඟ High-Five කරන්න)"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 p-1 shadow-[0_5px_0_0_#b45309] border-2 border-amber-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative shadow-inner">
                <img
                  src={mascotImage}
                  alt="SipArana Document Guide Mascot"
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
              className="absolute -bottom-2 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center gap-1"
            >
              <FileText className="w-2.5 h-2.5 fill-white" />
              <span>Doc Guide</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Mascot Speech Bubble */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm relative">
          {/* Arrow pointer towards mascot (visible on sm+) */}
          <div className="hidden sm:block absolute -left-2 top-6 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-l border-b border-blue-200 dark:border-slate-800 transform rotate-45" />

          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>අරණ ලේඛන සහයක මාස්කොට් (Arana Document Guide)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExtraTipIndex((prev) => (prev + 1) % STUDY_TIPS.length)}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                title="Next study tip"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Tip</span>
              </button>

              <button
                type="button"
                onClick={handleHighFive}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-black rounded-lg border border-amber-300 dark:border-amber-700 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>High-Five! 👋</span>
              </button>
            </div>
          </div>

          {/* Main Speech Message */}
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {displayMsg}
          </p>

          {/* Active study tip bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2 flex-wrap">
            <span className="truncate max-w-full font-medium italic">
              {STUDY_TIPS[extraTipIndex]}
            </span>

            {/* Quick action button */}
            {currentStep !== 'category' && onResetFlow && (
              <button
                type="button"
                onClick={onResetFlow}
                className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 ml-auto flex-shrink-0"
              >
                <span>නැවත මුල සිට තෝරන්න (Change Grade)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
