import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  ChevronRight,
  Zap,
  Trophy,
  Heart,
  Globe2,
  Languages,
  BookOpen,
  Award,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import kaviOwlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import { soundFX } from '@/utils/audioUtils';
import { useLanguage } from '@/context/LanguageContext';

export interface ModernCurriculumMascotProps {
  currentStep: 1 | 2 | 3;
  selectedLevelName?: string;
  selectedSubjectName?: string;
  onResetFlow?: () => void;
  className?: string;
}

export default function ModernCurriculumMascot({
  currentStep,
  selectedLevelName,
  selectedSubjectName,
  onResetFlow,
  className = ''
}: ModernCurriculumMascotProps) {
  const { language } = useLanguage();
  const [isWiggling, setIsWiggling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highFived, setHighFived] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const getStepMessage = () => {
    switch (currentStep) {
      case 1:
        return {
          si: 'පුංචි යාළුවේ, ඔයාට අලුතින් එකතු වුණු ජපන්, කොරියානු, ප්‍රංශ, ජර්මන්, හින්දි, චීන, රුසියන් භාෂා හෝ ICT, ජීවිතයට තාක්ෂණවේදය, ව්‍යවසායකත්වය වැනි නවීන විෂයයන් ඉගෙන ගන්න මෙන්න මේ පියවර අනුගමනය කරන්න! මුලින්ම ඔයා ඉගෙන ගන්නා මට්ටම (Junior 6-9, O/L 10-11, හෝ A/L 12-13) තෝරන්න!',
          en: 'Welcome young learner! 🦉 To explore newly introduced Japanese, Korean, French, German, Hindi, Chinese, Russian, or ICT & Life Technology subjects, start right here! Step 1: Select your Student Level (Junior 6-9, O/L 10-11, or A/L 12-13)!',
          ta: 'அன்பு நண்பரே! 🦉 புதிதாக அறிமுகப்படுத்தப்பட்ட ஜப்பானிய, கொரிய, பிரெஞ்சு, ஜெர்மன் மொழிகள் மற்றும் ICT பாடங்களை கற்க படி 1: உங்கள் கல்வி நிலையைத் தெரிவுசெய்யுங்கள்!'
        };
      case 2:
        return {
          si: `විශිෂ්ටයි! 🦉 ඔබ තෝරාගත්තේ [${selectedLevelName || 'ඔබේ මට්ටම'}]. දැන් ඔබට ඉගෙන ගැනීමට අවශ්‍ය නිශ්චිත නවීන තාක්ෂණික විෂයය හෝ විදේශ භාෂාව (Japanese, Korean, French, German, Hindi, Chinese, Russian, ICT, Life Tech) නිල ලැයිස්තුවෙන් තෝරන්න!`,
          en: `Great job! 🦉 For [${selectedLevelName || 'your level'}], choose the specific Modern or Foreign Subject you want to study from the official Ministry of Education curriculum list!`,
          ta: `சிறந்தது! 🦉 இப்போது நீங்கள் கற்க விரும்பும் குறிப்பிட்ட நவீன அல்லது வெளிநாட்டு மொழிப் பாடத்தைத் தெரிவுசெய்யுங்கள்!`
        };
      case 3:
        return {
          si: `සුපිරි ජයග්‍රහණයක්! 🌟 මෙන්න ඔබ තෝරාගත් [${selectedSubjectName || 'මෙම විෂය'}] සඳහා ජාතික අධ්‍යාපන ආයතනයේ (NIE) සහ අධ්‍යාපන අමාත්‍යාංශයේ නවතම ප්‍රතිසංස්කරණ අනුව නිල විෂය නිර්දේශ ඒකක, සාරාංශ පාඩම්, ශ්‍රව්‍ය උච්චාරණ (Audio Pronunciation) සහ විභාග ආදර්ශ ප්‍රශ්න! එකින් එක අධ්‍යයනය කරමු!`,
          en: `Super achievement! 🌟 Here are the official NIE & Ministry of Education aligned syllabus units, lesson summaries, native audio pronunciations, and model exam questions for [${selectedSubjectName || 'this subject'}]! Let's explore together!`,
          ta: `வெற்றி நிச்சயம்! 🌟 [${selectedSubjectName || 'இப்பாடத்திற்குரிய'}] உத்தியோகபூர்வ பாடத்திட்ட அலகுகள், ஒலி உச்சரிப்புகள் மற்றும் மாதிரி வினாக்கள் தயார்!`
        };
    }
  };

  const currentMsgObj = getStepMessage();
  const activeMessage = language === 'si' ? currentMsgObj.si : language === 'ta' ? currentMsgObj.ta : currentMsgObj.en;

  const KAVI_LANGUAGE_TIPS = [
    '💡 කවිගේ භාෂා රහස: විදේශ භාෂාවක වචන දිනපතා විනාඩි 10ක් ශ්‍රව්‍ය උච්චාරණයට (Audio) සවන් දෙමින් කියවීමෙන් මතක තබා ගැනීම 60% කින් වේගවත් වේ!',
    '📝 Stroke Order: ජපන් (Hiragana/Katakana) සහ කොරියානු (Hangul) අක්ෂර නිවැරදි අනුපිළිවෙලට ලිවීමෙන් අකුරු ලස්සන වීම මෙන්ම අක්ෂර වින්‍යාසය නිවැරදි වේ.',
    '🎯 ICT & Tech Formula: පයිතන් සහ පරිපථ සංකල්ප තේරුම් ගැනීමට ප්‍රායෝගික කේත කොටස් ලියා අත්හදා බලන්න.',
    '🌍 Global Opportunities: කොරියානු (EPS-TOPIK/A-Level) හා ජපන් (JLPT) භාෂා ඉගෙනීමෙන් උසස් පෙළට මෙන්ම ජාත්‍යන්තර රැකියා සහ ශිෂ්‍යත්ව සඳහා සුවිශේෂී වරප්‍රසාද ලැබේ.'
  ];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = activeMessage.replace(/[🦉🌟🎯💡📝🌍\[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.15;

      if (language === 'si') {
        utterance.lang = 'si-LK';
      } else if (language === 'ta') {
        utterance.lang = 'ta-LK';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleHighFive = () => {
    setIsWiggling(true);
    setHighFived(true);
    soundFX.playCorrect();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => setIsWiggling(false), 700);
  };

  return (
    <motion.div
      id="modern-curriculum-kavi-mascot"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-indigo-500/15 dark:from-amber-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 border-2 border-amber-400/70 dark:border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm ${className}`}
    >
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
        {/* Mascot Avatar Card with Wiggle Effect */}
        <div className="flex-shrink-0 flex sm:flex-col items-center gap-3">
          <motion.div
            onClick={handleHighFive}
            animate={isWiggling ? { rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.1, 1.05, 1] } : {}}
            transition={{ duration: 0.6 }}
            className="relative cursor-pointer group"
            title="කවි බකමූණාට High-Five කරන්න! (+15 XP)"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-amber-400 dark:border-amber-300 shadow-md bg-white p-0.5 group-hover:scale-105 group-hover:shadow-amber-400/50 transition duration-200">
              <img
                src={kaviOwlAvatar}
                alt="Kavi the Owl Mascot"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full text-xs shadow-md font-bold flex items-center justify-center">
              ✨
            </div>
          </motion.div>

          <button
            onClick={handleHighFive}
            className="sm:w-full px-2.5 py-1 text-[11px] font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-full shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-900" />
            <span>{highFived ? 'High-Five! 🖐️' : 'High-Five! +15XP'}</span>
          </button>
        </div>

        {/* Mascot Speech Dialogue */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-400/40">
                <span>🦉 කවි බකමූණා (Kavi the Owl)</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                පියවර {currentStep} / 3: {currentStep === 1 ? 'ශ්‍රේණිය තෝරන්න' : currentStep === 2 ? 'විෂයය තෝරන්න' : 'විෂය නිර්දේශය & අභ්‍යාස'}
              </span>
            </div>

            {/* Voice speech playback toggle */}
            <button
              onClick={handleSpeak}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>කටහඬ නවත්වන්න</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>කවිගේ හඬින් අසන්න 🔊</span>
                </>
              )}
            </button>
          </div>

          {/* Main Friendly Sinhala Dialogue */}
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-3.5 border border-amber-200/80 dark:border-amber-800/60 shadow-xs">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              {activeMessage}
            </p>
          </div>

          {/* Quick Study Tip Pill */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1 px-1">
            <p className="text-[11px] truncate flex-1 font-medium text-amber-900 dark:text-amber-200">
              {KAVI_LANGUAGE_TIPS[tipIndex]}
            </p>
            <button
              onClick={() => setTipIndex((prev) => (prev + 1) % KAVI_LANGUAGE_TIPS.length)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-2 cursor-pointer"
            >
              ඊළඟ උපදෙස →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
