import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Smile, Flame, Lightbulb, ChevronRight, Zap, Trophy, Heart, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import owlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import { soundFX } from '@/utils/audioUtils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export interface SubjectGuideMascotProps {
  currentStep: 'category' | 'stream' | 'subject' | 'details';
  selectedCategoryName?: string;
  selectedStreamName?: string;
  selectedSubjectName?: string;
  totalSubjectsFound?: number;
  totalPastPapersCount?: number;
  onResetFlow?: () => void;
}

export default function SubjectGuideMascot({
  currentStep,
  selectedCategoryName,
  selectedStreamName,
  selectedSubjectName,
  totalSubjectsFound = 0,
  totalPastPapersCount = 0,
  onResetFlow
}: SubjectGuideMascotProps) {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [extraTipIndex, setExtraTipIndex] = useState(0);

  const isGrade5 =
    profile?.grade === 5 ||
    profile?.level === 'SCHOLARSHIP' ||
    profile?.stream === 'Grade 5 Scholarship' ||
    !!profile?.isKidMode;

  const getStepMessage = () => {
    if (isGrade5) {
      switch (currentStep) {
        case 'category':
        case 'stream':
        case 'subject':
          return {
            si: 'ආයුබෝවන් පුංචි යාළුවේ! 🦉 මම ඔයාගේ කවි බකමූණු මඟපෙන්වන්නා! සිංහල, ගණිතය, පරිසරය හෝ බුද්ධි පරීක්ෂණ (IQ) විෂයන්ගෙන් අද අපි ඉගෙනගන්නේ මොනවද? කැමති විෂය තෝරන්න!',
            en: 'Hello little friend! 🦉 I am your Kavi Owl study buddy! Choose Sinhala, Mathematics, Environmental Studies, or IQ Puzzles to learn today!',
            ta: 'வணக்கம் குட்டி நண்பரே! 🦉 நான் கவி ஆந்தை! இன்று சிங்களம், கணிதம், சுற்றாடல் அல்லது நுண்ணறிவு பாடங்களில் எதைக் கற்கலாம்?'
          };
        case 'details':
          return {
            si: `හරිම ලස්සනයි! 🌟 ${selectedSubjectName || 'මේ විෂයේ'} පාඩම්, විනෝද ප්‍රශ්න සහ ආදර්ශ ප්‍රශ්න පත්‍ර (${totalPastPapersCount} ක්) ගුරු පොතට අනුව මෙතැනින් බලන්න පුළුවන්!`,
            en: `Awesome! 🌟 Lessons, fun questions, and model papers (${totalPastPapersCount}) for ${selectedSubjectName || 'this subject'} are ready based on Guru Potha!`,
            ta: `அற்புதம்! 🌟 ${selectedSubjectName || 'இப்பாடத்திற்குரிய'} வினாத்தாள்கள் (${totalPastPapersCount}) தயார்!`
          };
      }
    }

    switch (currentStep) {
      case 'category':
        return {
          si: 'ආයුබෝවන් මිත්‍රයා! 📚 පළමුව ඔබගේ අධ්‍යාපන මට්ටම (A/L, O/L, කණිෂ්ඨ හෝ විශ්වවිද්‍යාල) තෝරන්න. මම ඔබට නියම විෂය මාලා, ඒකක පාඩම් සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර වෙන් කර පෙන්වන්නම්!',
          en: 'Hello friend! 📚 First, select your Education Category (A/L, O/L, Middle School, or University). I will organize the exact curriculum units, lessons, and past exam papers for you!',
          ta: 'வணக்கம் நண்பரே! 📚 முதலில் உங்கள் கல்விப் பிரிவைத் (A/L, O/L, இடைநிலை, பல்கலைக்கழகம்) தெரிவுசெய்யுங்கள். பொருத்தமான பாடங்களையும் வினாத்தாள்களையும் தருகிறேன்!'
        };
      case 'stream':
        return {
          si: `විශිෂ්ටයි! 🧭 දැන් ${selectedCategoryName || 'ඔබගේ මට්ටම'} සඳහා විෂය ධාරාව (Stream) තෝරන්න. අනවශ්‍ය විෂයයන් මඟහැර නියම විෂයයන් පමණක් තිරයට ගනිමු!`,
          en: `Great! 🧭 Now select your academic stream for ${selectedCategoryName || 'your category'}. Let's narrow down to your exact curriculum subjects!`,
          ta: `சிறந்தது! 🧭 இப்போது ${selectedCategoryName || 'உங்கள் கல்விப் பிரிவின்'} பாடப்பிரிவை (Stream) தெரிவுசெய்யுங்கள்.`
        };
      case 'subject':
        return {
          si: `නියමයි! ✨ දැන් ඔබ අධ්‍යයනය කිරීමට හෝ පසුගිය ප්‍රශ්න පත්‍ර බාගත කිරීමට බලාපොරොත්තු වන නිශ්චිත විෂයය (Subject) තෝරාගන්න!`,
          en: `Awesome! ✨ Now pick the specific subject you want to master today from ${selectedStreamName || 'your stream'}!`,
          ta: `அற்புதம்! ✨ இன்று நீங்கள் படிக்க அல்லது வினாத்தாள்களைப் பெற விரும்பும் குறிப்பிட்ட பாடத்தைத் தெரிவுசெய்யுங்கள்!`
        };
      case 'details':
        return {
          si: `සුපිරි! 📖 ${selectedSubjectName || 'මෙම විෂය'} සඳහා සියලුම විෂය ඒකක (Units), පාඩම් සාරාංශ, ප්‍රධාන සූත්‍ර, ක්ෂණික ප්‍රශ්න සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර (${totalPastPapersCount} ක්) පහතින් සූදානම්!`,
          en: `Super! 📖 All curriculum units, lesson summaries, key formulas, instant concept checks, and official past papers (${totalPastPapersCount} papers) for ${selectedSubjectName || 'this subject'} are ready below!`,
          ta: `வெற்றி நிச்சயம்! 📖 ${selectedSubjectName || 'இப்பாடத்திற்குரிய'} அனைத்து அலகுகள், பாடக் குறிப்புகள், சூத்திரங்கள் மற்றும் கடந்த கால வினாத்தாள்கள் (${totalPastPapersCount}) தயார்!`
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

  const STUDY_TIPS = isGrade5
    ? [
        '🦉 කවිගේ උපදෙස: දිනපතා ගුරු පොතේ ඇති ක්‍රියාකාරකම් හා කෙටි ප්‍රශ්න වලට උත්තර ලියන්න.',
        '🌟 ගණිත උපක්‍රමය: 5 න් ගුණ කිරීමේදී අගට 0 හෝ 5 ලැබෙන රටාව මතක තබාගන්න.',
        '🌿 පරිසරය: අපේ ජාතික සංකේත (නා ගස, නිල් මහනෙල්, වලි කුකුළා) නිවැරදිව මතක තබාගනිමු.',
        '✏️ අක්ෂර වින්‍යාසය: ණ/න සහ ළ/ල යෙදෙන තැන් හොඳින් බලා පාඩම් කරගන්න.'
      ]
    : [
        '💡 Tip: විභාගයට පෙර පසුගිය වසර 5 ක ප්‍රශ්න පත්‍ර අවම වශයෙන් දෙවරක්වත් කාල වේලාවට අනුව (Time limit) ලියා පුහුණු වන්න.',
        '📐 Formulas: පාඩමේ ඇති "සූත්‍ර සහ ප්‍රමේය (Formulas)" කොටස නිතරම පරිශීලනය කර මතකයේ තබාගන්න.',
        '⚡ Instant Quiz: එක් එක් පාඩම අවසානයේ ඇති Concept Check ප්‍රශ්නයට පිළිතුරු සපයා ක්ෂණිකව XP ලබාගන්න!',
        '🎯 Marking Schemes: පිළිතුරු ලිවීමේදී Marking Scheme එකේ ලකුණු ලබාදෙන ප්‍රධාන කරුණු (Points) කෙරෙහි විශේෂ අවධානයක් යොමු කරන්න.'
      ];

  const activeAvatar = isGrade5 ? owlAvatar : mascotImage;

  return (
    <motion.div
      id="subject-guide-mascot-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`border-2 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm ${
        isGrade5
          ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-400 dark:border-amber-500/50'
          : 'bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-indigo-500/10 dark:from-blue-950/30 dark:to-indigo-950/40 border-blue-300/80 dark:border-blue-500/40'
      }`}
    >
      {/* Decorative background glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none ${isGrade5 ? 'bg-amber-400/15' : 'bg-blue-400/10'}`} />

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
            className="relative cursor-pointer group"
            onClick={handleHighFive}
            title={isGrade5 ? "කවි බකමූණාට High-Five එකක් දෙන්න! 🦉✋" : "Click to give Arana a High-Five! ✋"}
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shadow-md ${isGrade5 ? 'border-amber-400 ring-4 ring-amber-400/30 bg-amber-950/20' : 'border-blue-500/50 ring-4 ring-blue-500/20 bg-blue-950/30'}`}>
              <img
                src={activeAvatar}
                alt={isGrade5 ? "Kavi the Owl" : "SipArana Mascot"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Cheer bubble badge */}
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 animate-bounce">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isGrade5 ? '🦉 හෝ!' : 'Hi!'}</span>
            </span>
          </motion.div>
        </div>

        {/* Mascot Speech Bubble & Dynamic Guidance */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-white shadow-xs ${isGrade5 ? 'bg-amber-600' : 'bg-blue-600'}`}>
                {isGrade5
                  ? (language === 'si' ? 'කවි බකමූණා • ශිෂ්‍යත්ව මඟපෙන්වීම' : 'Kavi the Owl • Scholarship Guide')
                  : (language === 'si' ? 'අරණ මාර්ගෝපදේශකයා' : language === 'ta' ? 'அரண வழிகாட்டி' : 'Arana Curriculum Guide')}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isGrade5
                  ? '• 5 ශ්‍රේණිය ගුරු පොත අනුකූලයි'
                  : currentStep === 'category'
                  ? '• පියවර 1: අධ්‍යාපන මට්ටම'
                  : currentStep === 'stream'
                  ? '• පියවර 2: විෂය ධාරාව'
                  : currentStep === 'subject'
                  ? '• පියවර 3: විෂයය තෝරාගැනීම'
                  : '• පියවර 4: විෂය ඒකක & ප්‍රශ්න පත්‍ර'}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleHighFive}
                className="text-[11px] font-bold px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 transition flex items-center gap-1 active:scale-95 shadow-xs"
              >
                <Smile className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHighFiving ? '🎉 High Five!' : '✋ High-Five!'}</span>
              </button>

              {!isGrade5 && currentStep !== 'category' && onResetFlow && (
                <button
                  onClick={onResetFlow}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                  title="Reset to category selection"
                >
                  නැවත මුලට (Reset)
                </button>
              )}
            </div>
          </div>

          {/* Speech Text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep + (selectedSubjectName || '') + (isGrade5 ? 'g5' : 'all')}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed"
            >
              {displayMsg}
            </motion.p>
          </AnimatePresence>

          {/* Study Tip Ticker */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/40 dark:border-amber-900/40 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate italic">{STUDY_TIPS[extraTipIndex % STUDY_TIPS.length]}</span>
            </div>
            <button
              onClick={() => setExtraTipIndex((prev) => prev + 1)}
              className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex-shrink-0"
            >
              ඊළඟ උපදෙස →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
