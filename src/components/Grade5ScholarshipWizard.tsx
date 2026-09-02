import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
  Smile,
  Volume2,
  VolumeX,
  Printer,
  Download,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Award,
  Heart,
  Star,
  Clock,
  Coffee,
  X,
  Palette,
  Camera,
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import {
  generateGrade5ScholarshipPaperHTML,
  generateGrade5TimetableHTML,
  downloadPrintableHTMLDoc
} from '@/utils/fileDownloader';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';
import confetti from 'canvas-confetti';
import kaviAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';

interface Grade5ScholarshipWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSubject?: (subjectId: string) => void;
}

const AVATARS = [
  { id: 'owl', name: 'කවි බකමූණා (Kavi)', icon: '🦉', desc: 'නැණවත් සහ මිත්‍රශීලී' },
  { id: 'lion', name: 'සිංහ පැටියා (Sinha)', icon: '🦁', desc: 'ධෛර්යවන්ත සහ වේගවත්' },
  { id: 'bunny', name: 'තරු හාවා (Taru)', icon: '🐰', desc: 'කඩිසර සහ උනන්දු' },
  { id: 'astronaut', name: 'ගගනගාමියා (Hero)', icon: '🚀', desc: 'අලුත් දේ සොයන' },
  { id: 'elephant', name: 'හස්ති රජා (Gaja)', icon: '🐘', desc: 'මතක ශක්තියෙන් පිරි' }
];

const GRADE5_SUBJECTS = [
  {
    id: 'sub_sch_sinhala',
    titleSi: 'සිංහල භාෂාව හා සාහිත්‍යය',
    titleEn: 'Sinhala Language',
    icon: BookOpen,
    iconEmoji: '📚',
    color: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    accentColor: 'text-amber-600 dark:text-amber-400',
    topics: ['ව්‍යාකරණ (නාම/ක්‍රියා/ලිංග)', 'නිවැරදි අක්ෂර වින්‍යාසය (ණ/න, ළ/ල)', 'සමාන පද සහ විරුද්ධ පද', 'ඡේද කියවා ප්‍රශ්නවලට පිළිතුරු'],
    sampleRiddle: {
      q: '🦉 ප්‍රශ්නය: "හිරු" යන වචනයේ සමාන පදයක් නොවන්නේ කුමක්ද?',
      opts: ['1. සූර්යයා', '2. භානු', '3. නිශාකර (සඳ)', '4. දිනකර'],
      correct: 2,
      exp: 'නිශාකර යනු සඳට නමකි. සූර්යයා, භානු, දිනකර යනු හිරුට නම් වේ.'
    }
  },
  {
    id: 'sub_sch_maths',
    titleSi: 'ප්‍රාථමික ගණිතය',
    titleEn: 'Mathematics & Problems',
    icon: Calculator,
    iconEmoji: '🔢',
    color: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    accentColor: 'text-blue-600 dark:text-blue-400',
    topics: ['ස්ථානීය අගය සහ සංඛ්‍යා රටා', 'ගුණ කිරීම සහ බෙදීම', 'මුදල්, දිග, බර සහ කාලය', 'ශිෂ්‍යත්ව කෙටි ගැටලු විසඳීම'],
    sampleRiddle: {
      q: '🦉 ප්‍රශ්නය: පැන්සල් 4 ක මිල රු. 80 කි. එවැනි පැන්සල් 6 ක මිල කීයද?',
      opts: ['1. රු. 100', '2. රු. 120', '3. රු. 140', '4. රු. 160'],
      correct: 1,
      exp: 'පැන්සලක් = 80 ÷ 4 = රු. 20. පැන්සල් 6ක් = 20 x 6 = රුපියල් 120 කි!'
    }
  },
  {
    id: 'sub_sch_env',
    titleSi: 'පරිසරය ආශ්‍රිත ක්‍රියාකාරකම්',
    titleEn: 'Environmental Studies',
    icon: Compass,
    iconEmoji: '🌿',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    topics: ['ශාක, සතුන් සහ ස්වභාව සෞන්දර්යය', 'ජලය, වාතය සහ කාලගුණය', 'ශ්‍රී ලංකාවේ ජාතික සංකේත සහ උරුමයන්', 'යහපත් පුරුදු සහ ප්‍රථමාධාර'],
    sampleRiddle: {
      q: '🦉 ප්‍රශ්නය: ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය කුමක්ද?',
      opts: ['1. නා ගස', '2. බෝ ගස', '3. කොස් ගස', '4. තල් ගස'],
      correct: 0,
      exp: 'ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය වන්නේ "නා ගස" (Na Tree) වේ.'
    }
  },
  {
    id: 'sub_sch_iq',
    titleSi: 'බුද්ධි පරීක්ෂණය සහ තර්කනය',
    titleEn: 'Scholarship IQ & Reasoning',
    icon: Sparkles,
    iconEmoji: '💡',
    color: 'from-purple-500 to-pink-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    accentColor: 'text-purple-600 dark:text-purple-400',
    topics: ['රූප රටා සහ අනුරූප රූප', 'ඝන වස්තු සහ සැඟවුණු කැට ගණන් කිරීම', 'දර්පණ ප්‍රතිබිම්බ සහ සමමිතිය', 'කඩදාසි නැමීම් සහ කැපුම් රටා'],
    sampleRiddle: {
      q: '🦉 ප්‍රශ්නය: කණ්ණාඩියකින් බැලූ විටත් නොවෙනස්ව පෙනෙන අකුර කුමක්ද?',
      opts: ['1. A', '2. B', '3. E', '4. P'],
      correct: 0,
      exp: '"A" අකුර සිරස් අක්ෂය වටා සමමිතික නිසා කණ්ණාඩිය තුළදීත් "A" ලෙසම දිස්වේ.'
    }
  }
];

const DEFAULT_TIMETABLE_SLOTS = [
  {
    time: '06:30 AM - 07:00 AM',
    title: 'උදෑසන මනස ප්‍රබෝධය & ව්‍යායාම',
    category: 'relax',
    icon: '🌅',
    desc: 'නැවුම් වතුර වීදුරුවක්, සැහැල්ලු අභ්‍යාස සහ දවසේ ඉලක්ක මෙනෙහි කිරීම.'
  },
  {
    time: '07:30 AM - 01:30 PM',
    title: 'පාසල් පාඩම් සහ මිතුරන් සමඟ අධ්‍යාපනය',
    category: 'study',
    icon: '🏫',
    desc: 'ගුරුභවතුන්ට සවන් දීම සහ සටහන් පිළිවෙළට තබා ගැනීම.'
  },
  {
    time: '10:30 AM',
    title: 'ප්‍රණීත දිවා ආහාර සහ කිරි විවේකය',
    category: 'snack',
    icon: '🍎',
    desc: 'පෝෂ්‍යදායී ආහාර, පලතුරු සහ පිරිසිදු වතුර පානය.'
  },
  {
    time: '03:30 PM - 04:30 PM',
    title: 'චිත්‍ර ඇඳීම / පොත් කියවීම / විනෝදය',
    category: 'play',
    icon: '🎨',
    desc: 'මනස නිදහස් කරගන්නා නිර්මාණශීලී ක්‍රියාකාරකම්.'
  },
  {
    time: '05:00 PM - 06:00 PM',
    title: 'ශිෂ්‍යත්ව බුද්ධි පරීක්ෂණ සහ ගණිත ගැටලු',
    category: 'study',
    icon: '💡',
    desc: 'කවි බකමූණා සමඟ IQ ප්‍රශ්න 10 ක් සහ සරල ගණිත ගැටලු විසඳීම.'
  },
  {
    time: '06:00 PM - 07:00 PM',
    title: 'මිදුලේ සෙල්ලම් කිරීම / බයිසිකල් පැදීම',
    category: 'play',
    icon: '🚴',
    desc: 'ශරීරයට ව්‍යායාම ලැබෙන එළිමහන් විනෝද ක්‍රීඩා.'
  },
  {
    time: '07:30 PM - 08:30 PM',
    title: 'රාත්‍රී කෙටි පුනරීක්ෂණය සහ සිංහල/පරිසරය',
    category: 'study',
    icon: '📖',
    desc: 'දවසේ උගත් පාඩම් ආවර්ජනය සහ හෙට දවසට සූදානම් වීම.'
  },
  {
    time: '09:00 PM',
    title: 'සුවබර නින්ද සහ හෙට දවසේ සිහිනය',
    category: 'relax',
    icon: '🌙',
    desc: 'පැය 8 ක සුව නින්දක් මොළයේ මතක ශක්තිය දෙගුණ කරයි!'
  }
];

export default function Grade5ScholarshipWizard({
  isOpen,
  onClose,
  onNavigateToSubject
}: Grade5ScholarshipWizardProps) {
  const { profile, updateProfile } = useAuth();
  const { language } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [studentName, setStudentName] = useState(profile?.name || 'චතුරංග පුංචි යාළුවා');
  const [selectedAvatar, setSelectedAvatar] = useState('owl');
  const [targetYear, setTargetYear] = useState<number>(profile?.targetYear || 2026);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Subject exploration state
  const [activeSubjectId, setActiveSubjectId] = useState<string>('sub_sch_sinhala');
  const [selectedRiddleAns, setSelectedRiddleAns] = useState<number | null>(null);
  const [answeredStars, setAnsweredStars] = useState<Record<string, boolean>>({});

  // Timetable checklist state
  const [completedSlots, setCompletedSlots] = useState<Record<number, boolean>>({});

  // File permission state
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | undefined>(undefined);
  const [activeDownloadName, setActiveDownloadName] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const currentSubject = GRADE5_SUBJECTS.find(s => s.id === activeSubjectId) || GRADE5_SUBJECTS[0];

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/🦉|🌟|✨|📚|🔢|🌿|💡/g, ''));
      utterance.rate = 0.95;
      utterance.pitch = 1.15;
      utterance.lang = 'si-LK';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFinishStep1 = () => {
    soundFX.playLevelUp();
    updateProfile({
      name: studentName.trim() || 'SipArana Scholar',
      targetYear,
      grade: 5,
      stream: 'Grade 5 Scholarship',
      isKidMode: true
    });
    setStep(2);
  };

  const handleAnswerRiddle = (optionIndex: number) => {
    if (selectedRiddleAns !== null) return;
    setSelectedRiddleAns(optionIndex);

    if (optionIndex === currentSubject.sampleRiddle.correct) {
      soundFX.playCorrect();
      setAnsweredStars(prev => ({ ...prev, [currentSubject.id]: true }));
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      soundFX.playIncorrect();
    }
  };

  const handleDownloadPaper = (subj: typeof GRADE5_SUBJECTS[0]) => {
    soundFX.playCorrect();
    const filename = `SipArana_Grade5_${subj.titleEn.replace(/\s+/g, '_')}_Model_Paper.html`;
    const html = generateGrade5ScholarshipPaperHTML(subj.titleEn, subj.titleSi, targetYear, studentName);
    const res = downloadPrintableHTMLDoc(html, filename, true);

    if (!res.success || res.isPopupBlocked) {
      if (res.blobUrl) {
        setActiveDownloadUrl(res.blobUrl);
        setActiveDownloadName(filename);
      }
      setShowPermissionModal(true);
    }
  };

  const handleDownloadTimetable = () => {
    soundFX.playLevelUp();
    const filename = `SipArana_Grade5_${studentName.replace(/\s+/g, '_')}_Timetable.html`;
    const html = generateGrade5TimetableHTML(studentName, targetYear, DEFAULT_TIMETABLE_SLOTS);
    const res = downloadPrintableHTMLDoc(html, filename, true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    if (!res.success || res.isPopupBlocked) {
      if (res.blobUrl) {
        setActiveDownloadUrl(res.blobUrl);
        setActiveDownloadName(filename);
      }
      setShowPermissionModal(true);
    }
  };

  const toggleSlot = (idx: number) => {
    const isNowDone = !completedSlots[idx];
    if (isNowDone) {
      soundFX.playCorrect();
    }
    setCompletedSlots(prev => ({ ...prev, [idx]: isNowDone }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="grade5-scholarship-wizard-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl sm:rounded-[32px] border-4 border-amber-300 dark:border-amber-500/40 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Playful Top Header with Kavi Mascot & Steps */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 dark:from-amber-600 dark:via-orange-600 dark:to-rose-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden flex-shrink-0">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1 shadow-lg border-2 border-white/80 flex items-center justify-center flex-shrink-0">
              <img
                src={kaviAvatar}
                alt="Kavi the Owl"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-wide font-serif">
                  5 වසර ශිෂ්‍යත්ව විශේෂ මඟපෙන්වීම
                </span>
                <span className="bg-white text-orange-600 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  Grade 5 Hero 🌟
                </span>
              </div>
              <p className="text-xs text-amber-100 font-semibold mt-0.5">
                කවි බකමූණාගේ සරල සිංහල මඟපෙන්වීම සහ විනෝද කාලසටහන
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => handleSpeakText('සුබ දවසක් පුංචි යාළුවේ! මම කවි බකමූණා. 5 වසර ශිෂ්‍යත්වය ලේසියෙන්ම ජයගන්න මම ඔයාට උදව් කරනවා!')}
              className={`p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                isSpeaking ? 'animate-pulse ring-2 ring-white' : ''
              }`}
              title="කවිගේ හඬින් අසන්න (Hear Kavi Speak)"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'නවත්වන්න' : 'හඬ අසන්න'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-black/15 hover:bg-black/25 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Step Navigation Indicator */}
        <div className="bg-amber-50 dark:bg-slate-800/80 px-4 sm:px-6 py-2.5 border-b border-amber-100 dark:border-slate-700 flex items-center justify-between gap-2 overflow-x-auto flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full justify-around sm:justify-start">
            <button
              onClick={() => setStep(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                step === 1
                  ? 'bg-amber-500 text-white shadow-sm scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white text-amber-700 text-[10px] font-black flex items-center justify-center">1</span>
              <span>කවිගේ පිළිගැනීම & නම</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <button
              onClick={() => setStep(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                step === 2
                  ? 'bg-blue-600 text-white shadow-sm scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white text-blue-700 text-[10px] font-black flex items-center justify-center">2</span>
              <span>විෂය සිතියම & ප්‍රශ්න</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <button
              onClick={() => setStep(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                step === 3
                  ? 'bg-emerald-600 text-white shadow-sm scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center">3</span>
              <span>විනෝද කාලසටහන (Timetable)</span>
            </button>
          </div>
        </div>

        {/* STEP 1: WELCOME & LITTLE SCHOLAR SETUP */}
        {step === 1 && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            {/* Mascot Speech Bubble */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-700/60 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md border-2 border-amber-400 flex items-center justify-center">
                  <img src={kaviAvatar} alt="Kavi" className="w-full h-full object-cover rounded-xl animate-bounce" />
                </div>
                <span className="absolute -bottom-1 -right-1 text-xl">✨</span>
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <h3 className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-200">
                  "සුබ දවසක් පුංචි යාළුවේ! මම කවි බකමූණා!" 🦉
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  ඔයා 5 වසර ශිෂ්‍යත්ව විභාගයට ලෑස්ති වෙන දක්ෂ දරුවෙක් නේද? බය වෙන්න එපා, මම ඔයාට ලස්සන පාඩම්, විනෝද ප්‍රශ්න සහ සෙල්ලම් කරන්නත් වෙලාව තියෙන ලස්සන කාලසටහනක් හදලා දෙන්නම්!
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => handleSpeakText('සුබ දවසක් පුංචි යාළුවේ! මම කවි බකමූණා. ඔයාගේ නම සහ විභාග වසර මට කියන්නකෝ!')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>කවිගේ කටහඬින් අසන්න</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Form for Kids */}
            <div className="space-y-4 max-w-xl mx-auto">
              {/* Name Input */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  ✏️ ඔයාගේ නම මොකක්ද? (Your Name)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="උදා: සෙනුරි පෙරේරා / Kaveesha"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-600 rounded-2xl px-4 py-3 text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-400/30 transition shadow-inner"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 mb-2">
                  🎨 ඔයා කැමති සුරතල් චරිතය තෝරන්න (Choose Mascot Avatar):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        soundFX.playCorrect();
                        setSelectedAvatar(av.id);
                      }}
                      className={`p-3 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedAvatar === av.id
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 scale-105 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl">{av.icon}</span>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Exam Year */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  📅 ඔයා ශිෂ්‍යත්වය ලියන්නේ කවදාද? (Target Exam Year)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[2026, 2027].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        soundFX.playCorrect();
                        setTargetYear(yr);
                      }}
                      className={`p-3 rounded-2xl border-2 font-black text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer ${
                        targetYear === yr
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-102'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>🌟 {yr} වසරේ ශිෂ්‍යත්වය</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleFinishStep1}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer hover:scale-102"
              >
                <span>ඊළඟ පියවර: විෂයයන් බලමු</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PICTORIAL CHART OF GRADE 5 SUBJECTS & RIDDLES */}
        {step === 2 && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>📚 5 වසර ප්‍රධාන විෂයයන් 4 සහ විනෝද ප්‍රශ්න</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  විෂය කාඩ්පතක් තෝරා පුංචි ප්‍රශ්න විසඳන්න, ආදර්ශ පත්‍ර Print කරගන්න!
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-300">
                ⭐ තරු එකතු කළ විෂයන්: {Object.keys(answeredStars).length} / 4
              </span>
            </div>

            {/* 4 Pictorial Subject Big Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GRADE5_SUBJECTS.map((subj) => {
                const isSelected = activeSubjectId === subj.id;
                const hasStar = answeredStars[subj.id];
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => {
                      soundFX.playCorrect();
                      setActiveSubjectId(subj.id);
                      setSelectedRiddleAns(null);
                    }}
                    className={`p-3.5 sm:p-4 rounded-3xl border-3 text-left transition flex flex-col justify-between relative cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-b from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-900 border-amber-400 dark:border-amber-400 shadow-lg scale-103'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    {hasStar && (
                      <span className="absolute -top-2 -right-2 text-xl animate-spin-slow">
                        ⭐
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{subj.iconEmoji}</span>
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${subj.color} text-white shadow-xs`}>
                        <subj.icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-tight">
                        {subj.titleSi}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                        {subj.titleEn}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      <span>{isSelected ? 'තෝරා ඇත ✓' : 'තෝරන්න'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Subject Detail & Fun Riddle Card */}
            <div className={`p-5 rounded-3xl border-2 ${currentSubject.lightBg} space-y-4`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentSubject.iconEmoji}</span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                      {currentSubject.titleSi} ({currentSubject.titleEn})
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      ජාතික අධ්‍යාපන ආයතන (NIE) 5 ශ්‍රේණිය විෂය නිර්දේශ ප්‍රධාන කොටස්
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPaper(currentSubject)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ආදර්ශ පත්‍රය බාගන්න (Print PDF)</span>
                  </button>
                </div>
              </div>

              {/* Topics Pills */}
              <div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  📖 ඉගෙන ගන්නා ප්‍රධාන මාතෘකා:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSubject.topics.map((tp, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{tp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Sample Riddle */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-600/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    කවිගේ විනෝද ප්‍රශ්නය (Mini Riddle):
                  </span>
                  <button
                    onClick={() => handleSpeakText(currentSubject.sampleRiddle.q)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ප්‍රශ්නය අසන්න</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {currentSubject.sampleRiddle.q}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSubject.sampleRiddle.opts.map((opt, optIdx) => {
                    const isPicked = selectedRiddleAns === optIdx;
                    const isCorrect = optIdx === currentSubject.sampleRiddle.correct;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleAnswerRiddle(optIdx)}
                        className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          selectedRiddleAns === null
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                            : isPicked
                            ? isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                              : 'bg-red-100 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-200'
                            : isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedRiddleAns !== null && isCorrect && <span className="text-emerald-600 font-black">✓ හරි!</span>}
                      </button>
                    );
                  })}
                </div>

                {selectedRiddleAns !== null && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-semibold animate-in fade-in">
                    <strong>💡 පැහැදිලි කිරීම:</strong> {currentSubject.sampleRiddle.exp}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Step Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ආපසු</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLevelUp();
                  setStep(3);
                }}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>ඊළඟ පියවර: දවසේ කාලසටහන</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: "LEARN, RELAX, AND GROW" TIMETABLE BUILDER */}
        {step === 3 && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🌈 5 වසර දෛනික විනෝද කාලසටහන ("Learn, Relax & Grow")</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  පාඩම් කාලය, ක්‍රීඩා කාලය, රසවත් ආහාර සහ සුව නින්ද සමබරව සැලසුම් කර ඇත!
                </p>
              </div>

              <button
                onClick={handleDownloadTimetable}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>මේසයේ අලවන්න Print කරගන්න (PDF)</span>
              </button>
            </div>

            {/* Timetable Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_TIMETABLE_SLOTS.map((slot, idx) => {
                const isDone = !!completedSlots[idx];
                const catBg =
                  slot.category === 'play'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                    : slot.category === 'snack'
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700'
                    : slot.category === 'relax'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                    : 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700';

                const badgeColor =
                  slot.category === 'play'
                    ? 'bg-amber-500 text-white'
                    : slot.category === 'snack'
                    ? 'bg-rose-500 text-white'
                    : slot.category === 'relax'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 text-white';

                return (
                  <div
                    key={idx}
                    onClick={() => toggleSlot(idx)}
                    className={`p-3.5 rounded-2xl border-2 ${catBg} transition flex items-start gap-3 cursor-pointer group hover:shadow-md ${
                      isDone ? 'ring-2 ring-emerald-500 bg-emerald-100/60 dark:bg-emerald-950/60' : ''
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">{slot.icon}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${badgeColor}`}>
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 capitalize">
                          • {slot.category}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-1 leading-tight">
                        {slot.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {slot.desc}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 group-hover:border-amber-500'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational Mascot Advice Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm flex items-center justify-center flex-shrink-0">
                <img src={kaviAvatar} alt="Kavi" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                <strong>🦉 කවි බකමූණාගේ රන් උපදෙස:</strong> "හැමදාම එකම වේලාවට පොත් කියවීමෙන් සහ සවස මිදුලේ සෙල්ලම් කිරීමෙන් මතක ශක්තිය ඉහළ යයි. විභාගයට කිසිසේත්ම බය වෙන්න එපා!"
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ආපසු: විෂයයන්</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLevelUp();
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>පාඩම් ආරම්භ කරමු! (Start Learning)</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <FilePermissionHelperModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        type="download"
        downloadUrl={activeDownloadUrl}
        downloadFilename={activeDownloadName}
      />
    </div>
  );
}
