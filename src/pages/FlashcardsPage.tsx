import React, { useState } from 'react';
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Zap,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Filter,
  Brain,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';
import {
  isDailyActionClaimedToday,
  recordDailyActionClaim,
  triggerDailyLockToast
} from '@/utils/dailyXpLockEngine';

interface Flashcard {
  id: string;
  subject: string;
  category: 'A/L' | 'O/L' | 'GENERAL';
  topic: string;
  question: {
    en: string;
    si: string;
    ta: string;
  };
  answer: {
    en: string;
    si: string;
    ta: string;
  };
  keyFormulaOrTip?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'Combined Mathematics',
    category: 'A/L',
    topic: 'Calculus & Integration',
    question: {
      en: 'What is the standard integral of ∫ 1 / (x² + a²) dx?',
      si: '∫ 1 / (x² + a²) dx හි සම්මත අනුකලන ප්‍රකාශනය කුමක්ද?',
      ta: '∫ 1 / (x² + a²) dx இன் நிலையான தொகையீட்டு முடிவு என்ன?'
    },
    answer: {
      en: '(1/a) * arctan(x/a) + C. Standard substitution is x = a*tan(θ).',
      si: '(1/a) * arctan(x/a) + C වේ. සම්මත ආදේශය x = a*tan(θ) වේ.',
      ta: '(1/a) * arctan(x/a) + C ஆகும். நிலையான பிரதியீடு x = a*tan(θ) ஆகும்.'
    },
    keyFormulaOrTip: '∫ 1/(x²+a²) dx = (1/a)tan⁻¹(x/a) + C',
    difficulty: 'Easy'
  },
  {
    id: 'fc-2',
    subject: 'Physics',
    category: 'A/L',
    topic: 'Waves & Sound',
    question: {
      en: 'What is the Doppler effect apparent frequency formula when source moves towards a stationary observer?',
      si: 'ප්‍රභවය නිශ්චල නිරීක්ෂකයා දෙසට චලනය වන විට ඩොප්ලර් ආචරණයේ දෘශ්‍ය සංඛ්‍යාත සමීකරණය කුමක්ද?',
      ta: 'நிலையான பார்வையாளரை நோக்கி ஒலி மூலம் நகரும் போது டாப்ளர் விளைவின் தோற்ற அதிர்வெண் சமன்பாடு என்ன?'
    },
    answer: {
      en: "f' = f * [ v / (v - u) ], where v is speed of sound in air and u is speed of the source. Apparent pitch is higher.",
      si: "f' = f * [ v / (v - u) ] වේ. මෙහි v යනු ශබ්දයේ වේගය වන අතර u යනු ප්‍රභවයේ වේගයයි. නිරීක්ෂිත සංඛ්‍යාතය ඉහළ යයි.",
      ta: "f' = f * [ v / (v - u) ] ஆகும். இதில் v என்பது ஒலியின் வேகம், u என்பது மூலத்தின் வேகம்."
    },
    keyFormulaOrTip: "f' = f [v / (v - u_s)]",
    difficulty: 'Medium'
  },
  {
    id: 'fc-3',
    subject: 'Chemistry',
    category: 'A/L',
    topic: 'Organic Chemistry',
    question: {
      en: 'What reagent is used for Markovnikov addition of HBr to an unsymmetrical alkene?',
      si: 'අසමමිතික ඇල්කීන වලට HBr මාකොනිකොෆ් එකතු වීම සිදුකිරීමට භාවිතා කරන ප්‍රතිකාරකය කුමක්ද?',
      ta: 'சீரற்ற அல்கீன்களில் HBr மார்கோவ்னிகோவ் சேர்க்கைக்கான காரணி எது?'
    },
    answer: {
      en: 'Pure HBr without peroxides (in dark/inert solvent like CCl₄). Hydrogen adds to the carbon with more hydrogen atoms.',
      si: 'පෙරොක්සයිඩ් නොමැති පිරිසිදු HBr (අඳුරේ හෝ CCl₄ වැනි අක්‍රිය ද්‍රාවකයක). හයිඩ්‍රජන් වැඩි හයිඩ්‍රජන් ඇති කාබන් වෙත බැඳේ.',
      ta: 'பெராக்சைடு இல்லாத தூய HBr. அதிக ஹைட்ரஜன் கொண்ட கார்பனுடன் ஹைட்ரஜன் இணையும்.'
    },
    keyFormulaOrTip: 'CH₃-CH=CH₂ + HBr → CH₃-CH(Br)-CH₃ (2-Bromopropane)',
    difficulty: 'Medium'
  },
  {
    id: 'fc-4',
    subject: 'Biology',
    category: 'A/L',
    topic: 'Cell Biology & Genetics',
    question: {
      en: 'What are the three main post-transcriptional modifications of eukaryotic pre-mRNA?',
      si: 'යූකැරියෝටික පූර්ව-mRNA වල සිදුවන ප්‍රධාන පසු-පිටපත් කිරීමේ විකරණ තුන මොනවාද?',
      ta: 'யூகேரியோட் pre-mRNA இல் நிகழும் மூன்று முக்கிய மாற்றங்கள் யாவை?'
    },
    answer: {
      en: '1. 5\' 7-methylguanosine capping, 2. 3\' poly-A tail addition, 3. Splicing (removal of introns and joining of exons).',
      si: '1. 5\' අග්‍රයට 7-මෙතිල්ගුවානොසීන් වැස්ම එක්වීම, 2. 3\' අග්‍රයට පොලි-A වලිගය එක්වීම, 3. ස්ප්ලයිසිං (ඉන්ට්‍රෝන ඉවත් කර එක්සෝන සම්බන්ධ කිරීම).',
      ta: '1. 5\' 7-methylguanosine மூடி, 2. 3\' poly-A வால் சேர்த்தல், 3. ஸ்ப்ளைசிங் (இன்ட்ரான்களை நீக்கி எக்சான்களை இணைத்தல்).'
    },
    keyFormulaOrTip: '5\' Cap + Poly-A Tail + Splicing (Intron out, Exon in)',
    difficulty: 'Hard'
  },
  {
    id: 'fc-5',
    subject: 'Science',
    category: 'O/L',
    topic: 'Grade 11 Physics & Chemistry',
    question: {
      en: "State Newton's Second Law of Motion and its mathematical form.",
      si: 'නිව්ටන්ගේ දෙවන චලිත නියමය සහ එහි ගණිතමය සමීකරණය සඳහන් කරන්න.',
      ta: 'நியூட்டனின் இரண்டாம் இயக்க விதியையும் அதன் கணிதச் சமன்பாட்டையும் குறிப்பிடுக.'
    },
    answer: {
      en: 'The rate of change of momentum is directly proportional to the applied unbalanced external force: F = ma.',
      si: 'වස්තුවක ගම්‍යතා වෙනස්වීමේ සීඝ්‍රතාව ඒ මත යොදන ලද අසමතුලිත බාහිර බලයට අනුලෝමව සමානුපාතික වේ: F = ma.',
      ta: 'உந்த மாற்ற வீதமானது அதன் மீது தொழிற்படும் புறவிசைக்கு நேர்விகித சமனாகும்: F = ma.'
    },
    keyFormulaOrTip: 'F = ma (Force = Mass × Acceleration)',
    difficulty: 'Easy'
  },
  {
    id: 'fc-6',
    subject: 'ICT',
    category: 'A/L',
    topic: 'Database & SQL',
    question: {
      en: 'What is the purpose of the SQL GROUP BY clause and HAVING clause?',
      si: 'SQL හි GROUP BY සහ HAVING වගන්ති භාවිතා කරන්නේ කුමන අරමුණක් සඳහාද?',
      ta: 'SQL இல் GROUP BY மற்றும் HAVING கூறுகளின் பயன் என்ன?'
    },
    answer: {
      en: 'GROUP BY groups rows sharing the same values for aggregate functions (SUM, COUNT, AVG). HAVING filters aggregated groups (unlike WHERE which filters rows).',
      si: 'GROUP BY මගින් සමාන අගයන් ඇති පේළි එකතු කරයි (SUM, COUNT ආදිය සඳහා). HAVING මගින් එම සමූහගත දත්ත පෙරීම සිදුකරයි.',
      ta: 'GROUP BY ஒரே மாதிரியான வரிசைகளைத் தொகுக்கும். HAVING தொகுக்கப்பட்ட குழுக்களை வடிகட்டும்.'
    },
    keyFormulaOrTip: 'SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > 5;',
    difficulty: 'Medium'
  }
];

export default function FlashcardsPage() {
  const { addXP, profile } = useAuth();
  const { language, tText } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'A/L' | 'O/L'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter cards
  const filteredCards = FLASHCARDS_DATA.filter((c) => {
    const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchSubj = selectedSubject === 'All' || c.subject === selectedSubject;
    return matchCat && matchSubj;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const totalCards = filteredCards.length;

  const subjectsList = ['All', ...Array.from(new Set(FLASHCARDS_DATA.map((c) => c.subject)))];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalCards - 1);
    }
  };

  const handleMarkConfidence = (level: 'mastered' | 'review') => {
    if (!currentCard) return;
    const userKey = profile?.email || profile?.id || 'guest_user';
    const cardActionKey = `flashcard_${currentCard.id}_${level}`;
    const isClaimedToday = isDailyActionClaimedToday(cardActionKey, userKey);

    if (level === 'mastered') {
      if (!masteredIds.includes(currentCard.id)) {
        setMasteredIds([...masteredIds, currentCard.id]);
        setNeedsReviewIds(needsReviewIds.filter((id) => id !== currentCard.id));
        if (!isClaimedToday) {
          const recorded = recordDailyActionClaim(cardActionKey, userKey);
          if (recorded) {
            addXP(25);
          }
        } else {
          triggerDailyLockToast(
            '⚠️ You have already claimed XP for mastering this card today! Card status updated; XP resets at midnight.',
            currentCard.topic
          );
        }
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      if (!needsReviewIds.includes(currentCard.id)) {
        setNeedsReviewIds([...needsReviewIds, currentCard.id]);
        setMasteredIds(masteredIds.filter((id) => id !== currentCard.id));
        if (!isClaimedToday) {
          const recorded = recordDailyActionClaim(cardActionKey, userKey);
          if (recorded) {
            addXP(10);
          }
        }
      }
    }

    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const handleVoiceRecitation = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="smart-flashcards-page" className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Spaced Repetition</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
              {masteredIds.length} Mastered 🌟
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'ස්මාර්ට් ෆ්ලෑෂ්කාඩ් සහ කෙටි ආවර්ජන'
              : language === 'ta'
              ? 'ஸ்மார்ட் ஃபிளாஷ்கார்டுகள் & விரைவு திருப்புதல்'
              : 'Smart Flashcards & Quick Revision Cards'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'විභාගයට පෙර ප්‍රධාන සූත්‍ර, අර්ථ දැක්වීම් සහ සිද්ධාන්ත සිතියම් මතක තබා ගැනීමට උපකාරී වන වේගවත් ආවර්ජනය'
              : language === 'ta'
              ? 'தேர்வுக்கு முன் முக்கிய சூத்திரங்கள் மற்றும் தியரிகளை நினைவில் வைக்க உதவும் விரைவு திருப்புதல்'
              : 'Active recall and spaced repetition deck for high-yield definitions, formulas, and diagrams.'}
          </p>
        </div>

        {/* Progress status */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Deck Progress</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">
              {currentIndex + 1} / {totalCards}
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Guidance */}
      <KaviMascot
        contextPage="flashcards"
        customMessage={
          language === 'si'
            ? '🦉 කවි ඔයාට කියනවා: කාඩ්පත හරවන්න කලින් උත්තරය හිතින් හරි ශබ්ද නගා හරි කියා බලන්න (Active Recall). එවිට මතකයේ 80% වැඩි කාලයක් රැඳෙනවා!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: கார்டைத் திருப்புவதற்கு முன் பதிலை மனதில் அல்லது சத்தமாகச் சொல்லிப் பாருங்கள்!'
            : '🦉 Kavi says: Always attempt to recite the answer out loud before flipping the card! Active recall activates deep memory pathways.'
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'A/L', 'O/L'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Grades' : cat}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {subjectsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive 3D Flip Flashcard */}
      {currentCard ? (
        <div className="space-y-4">
          <div
            id="flashcard-container"
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative min-h-[300px] sm:min-h-[340px] w-full rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-500 transform hover:scale-[1.01] shadow-xl border-2 flex flex-col justify-between select-none bg-gradient-to-br from-white via-slate-50 to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-amber-300/80 dark:border-amber-500/40"
          >
            {/* Top Card Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
                  {currentCard.subject}
                </span>
                <span className="text-xs text-slate-400 font-semibold">• {currentCard.topic}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    currentCard.difficulty === 'Easy'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : currentCard.difficulty === 'Medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {currentCard.difficulty}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const text = isFlipped
                      ? currentCard.answer[language] || currentCard.answer.en
                      : currentCard.question[language] || currentCard.question.en;
                    handleVoiceRecitation(text);
                  }}
                  className="p-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 transition"
                  title="Listen to card audio"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-amber-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Middle Card Content */}
            <div className="my-6 space-y-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{isFlipped ? 'REVEALED ANSWER & INSIGHT' : 'QUESTION / CONCEPT (Click card to flip)'}</span>
              </div>

              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-2xl mx-auto">
                {isFlipped
                  ? currentCard.answer[language] || currentCard.answer.en
                  : currentCard.question[language] || currentCard.question.en}
              </p>

              {isFlipped && currentCard.keyFormulaOrTip && (
                <div className="p-3 bg-amber-100/70 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 max-w-md mx-auto">
                  <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300">
                    💡 Key Formula / Rule to Remember
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-amber-100 mt-0.5">
                    {currentCard.keyFormulaOrTip}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                <span>{isFlipped ? 'Click again to flip back' : 'Tap to see step-by-step solution'}</span>
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500" /> +25 XP upon Mastery
              </span>
            </div>
          </div>

          {/* Confidence Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              id="card-needs-review-btn"
              type="button"
              onClick={() => handleMarkConfidence('review')}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-800 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
            >
              <XCircle className="w-4 h-4" />
              <span>Need Review (+10 XP)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="hidden sm:flex py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm items-center justify-center gap-2 shadow-sm transition"
            >
              <RotateCw className="w-4 h-4 text-amber-500" />
              <span>Flip Card</span>
            </button>

            <button
              id="card-mastered-btn"
              type="button"
              onClick={() => handleMarkConfidence('mastered')}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Mastered This! (+25 XP)</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Card</span>
            </button>

            <div className="flex items-center gap-1">
              {filteredCards.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-6 bg-blue-600'
                      : masteredIds.includes(filteredCards[i].id)
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Next Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No flashcards found for selected filter</h3>
          <p className="text-xs text-slate-400">Try choosing "All Grades" or a different subject above.</p>
        </div>
      )}
    </div>
  );
}
