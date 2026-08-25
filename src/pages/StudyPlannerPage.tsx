import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Flame,
  Brain,
  AlertCircle,
  Check,
  Printer,
  ChevronRight,
  HelpCircle,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  Heart,
  FileText,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveSync, SyncedStudySlot } from '@/context/LiveSyncContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';

// Available Days
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type DayType = typeof DAYS[number];

// Stream Definitions based on NIE Sri Lanka Curricula
interface StreamDef {
  id: string;
  name: { en: string; si: string; ta: string };
  badge: string;
  color: string;
  description: { en: string; si: string; ta: string };
  defaultSubjects: string[];
  allCurriculumSubjects: string[];
}

const SRI_LANKAN_STREAMS: StreamDef[] = [
  {
    id: 'al-maths',
    name: {
      en: 'A/L Physical Science (Combined Maths)',
      si: 'උසස් පෙළ භෞතික විද්‍යා (සංයුක්ත ගණිතය)',
      ta: 'உயர்தர பௌதிக விஞ்ஞானப் பிரிவு (இணைந்த கணிதம்)'
    },
    badge: 'A/L Maths',
    color: 'from-blue-600 to-indigo-600',
    description: {
      en: 'Combined Maths, Physics, Chemistry & ICT for Engineering & Physical Sciences',
      si: 'ඉංජිනේරු සහ තාක්ෂණික පීඨ ඉලක්ක කරගත් සංයුක්ත ගණිතය, භෞතික විද්‍යාව, රසායන විද්‍යාව',
      ta: 'பொறியியல் பீடத்தை இலக்காகக் கொண்ட இணைந்த கணிதம், பௌதிகவியல், இரசாயனவியல்'
    },
    defaultSubjects: ['Combined Mathematics', 'Physics', 'Chemistry'],
    allCurriculumSubjects: ['Combined Mathematics', 'Physics', 'Chemistry', 'ICT (Information & Communication Tech)']
  },
  {
    id: 'al-bio',
    name: {
      en: 'A/L Biological Science (Bio Stream)',
      si: 'උසස් පෙළ ජීව විද්‍යා (Bio Stream)',
      ta: 'உயர்தர உயிரியல் விஞ்ஞானப் பிரிவு (Bio Stream)'
    },
    badge: 'A/L Bio',
    color: 'from-emerald-600 to-teal-600',
    description: {
      en: 'Biology, Chemistry, Physics & Agricultural Science for Medicine & Healthcare',
      si: 'වෛද්‍ය සහ ජීව විද්‍යා ක්ෂේත්‍ර ඉලක්ක කරගත් ජීව විද්‍යාව, රසායන විද්‍යාව, භෞතික විද්‍යාව',
      ta: 'மருத்துவத் துறையை இலக்காகக் கொண்ட உயிரியல், இரசாயனவியல், பௌதிகவியல்'
    },
    defaultSubjects: ['Biology', 'Chemistry', 'Physics'],
    allCurriculumSubjects: ['Biology', 'Chemistry', 'Physics', 'Agricultural Science']
  },
  {
    id: 'al-commerce',
    name: {
      en: 'A/L Commerce Stream',
      si: 'උසස් පෙළ වාණිජ අංශය',
      ta: 'உயர்தர வர்த்தகப் பிரிவு'
    },
    badge: 'A/L Commerce',
    color: 'from-amber-500 to-orange-600',
    description: {
      en: 'Accounting, Business Studies, Economics & ICT for Finance & Business Degrees',
      si: 'ගිණුම්කරණය, ව්‍යාපාර අධ්‍යයනය, ආර්ථික විද්‍යාව සහ ICT',
      ta: 'கணக்கியல், வணிகக் கல்வி, பொருளியல் மற்றும் ICT'
    },
    defaultSubjects: ['Accounting', 'Business Studies', 'Economics'],
    allCurriculumSubjects: ['Accounting', 'Business Studies', 'Economics', 'ICT', 'Business Statistics']
  },
  {
    id: 'al-tech',
    name: {
      en: 'A/L Technology Stream',
      si: 'උසස් පෙළ තාක්ෂණවේදය අංශය',
      ta: 'உயர்தர தொழில்நுட்பப் பிரிவு'
    },
    badge: 'A/L Technology',
    color: 'from-cyan-600 to-blue-700',
    description: {
      en: 'Engineering Tech / Biosystems Tech + Science for Technology (SFT) & 3rd Subject',
      si: 'ඉංජිනේරු/ජෛව පද්ධති තාක්ෂණවේදය, තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
      ta: 'பொறியியல்/உயிர்முறைமைகள் தொழில்நுட்பம், தொழில்நுட்பத்திற்கான விஞ்ஞானம்'
    },
    defaultSubjects: ['Engineering Technology', 'Science for Technology (SFT)', 'ICT'],
    allCurriculumSubjects: [
      'Engineering Technology',
      'Biosystems Technology',
      'Science for Technology (SFT)',
      'ICT',
      'Geography',
      'Agriculture'
    ]
  },
  {
    id: 'al-arts',
    name: {
      en: 'A/L Arts & Humanities Stream',
      si: 'උසස් පෙළ කලා අංශය',
      ta: 'உயர்தர கலைப் பிரிவு'
    },
    badge: 'A/L Arts',
    color: 'from-purple-600 to-pink-600',
    description: {
      en: 'Languages, Political Science, Logic, History, Geography & Civilizations',
      si: 'දේශපාලන විද්‍යාව, තර්ක ශාස්ත්‍රය, ඉතිහාසය, භාෂා සහ සාහිත්‍යය',
      ta: 'அரசியல் விஞ்ஞானம், அளவையியல், வரலாறு, மொழிகள் மற்றும் இலக்கியம்'
    },
    defaultSubjects: ['Political Science', 'Logic & Scientific Method', 'Sinhala / Tamil Literature'],
    allCurriculumSubjects: [
      'Political Science',
      'Logic & Scientific Method',
      'Sinhala Literature',
      'Tamil Literature',
      'Economics',
      'Geography',
      'History (Sri Lankan & World)',
      'Buddhist Civilization',
      'Hindu Civilization',
      'Islamic Civilization',
      'English Literature'
    ]
  },
  {
    id: 'ol-grade1011',
    name: {
      en: 'G.C.E. O/L (Grades 10 & 11)',
      si: 'අ.පො.ස. සාමාන්‍ය පෙළ (10 - 11 ශ්‍රේණි)',
      ta: 'க.பொ.த. சாதாரண தரம் (தரம் 10 & 11)'
    },
    badge: 'O/L (Grades 10-11)',
    color: 'from-rose-600 to-red-600',
    description: {
      en: '9 Essential O/L Subjects (Maths, Science, Languages, History, Religion & Baskets)',
      si: 'ගණිතය, විද්‍යාව, සිංහල/දෙමළ, ඉංග්‍රීසි, ඉතිහාසය, ආගම සහ කාණ්ඩ විෂයයන්',
      ta: 'கணிதம், விஞ்ஞானம், தமிழ்/சிங்களம், ஆங்கிலம், வரலாறு, சமயம் மற்றும் தொகுதிப் பாடங்கள்'
    },
    defaultSubjects: ['Mathematics', 'Science', 'History', 'English Language', 'Buddhism / Religion', 'First Language (Sinhala/Tamil)'],
    allCurriculumSubjects: [
      'Mathematics',
      'Science',
      'English Language',
      'First Language (Sinhala/Tamil)',
      'History',
      'Buddhism / Religion',
      'ICT (Basket 1)',
      'Business & Accounting (Basket 1)',
      'Agriculture (Basket 1)',
      'Art / Music / Dancing / Drama (Basket 2)',
      'Health & Physical Education (Basket 3)',
      'English Literature (Basket 3)'
    ]
  },
  {
    id: 'junior-grade69',
    name: {
      en: 'Junior Secondary (Grades 6 - 9)',
      si: 'කනිෂ්ඨ ද්විතීයික (6 - 9 ශ්‍රේණි)',
      ta: 'இடைநிலைப் பிரிவு (தரம் 6 - 9)'
    },
    badge: 'Grades 6-9',
    color: 'from-teal-600 to-emerald-700',
    description: {
      en: 'Foundational subjects for term tests and general academic excellence',
      si: 'වාර විභාග සහ මූලික අධ්‍යාපන පදනම සඳහා',
      ta: 'பாடசாலை தவணைப் பரீட்சைகளுக்கான அடிப்படைப் பாடங்கள்'
    },
    defaultSubjects: ['Mathematics', 'Science', 'English', 'History', 'Sinhala / Tamil', 'Geography'],
    allCurriculumSubjects: [
      'Mathematics',
      'Science',
      'English Language',
      'Sinhala / Tamil Language',
      'History',
      'Geography',
      'Civics Education',
      'Religion',
      'Health & Physical Education',
      'Practical & Technical Skills (PTS)'
    ]
  }
];

// Timeframe Option
interface TimeframeChoice {
  unit: 'days' | 'months' | 'years' | 'skip';
  value: number;
  label: { en: string; si: string; ta: string };
  badgeText: string;
}

const TIMEFRAME_PRESETS: TimeframeChoice[] = [
  {
    unit: 'days',
    value: 30,
    label: { en: '30 Days (Final Exam Sprint)', si: 'දින 30ක අධිවේගී පුනරීක්ෂණ සැලසුම', ta: '30 நாட்கள் தீவிர பயிற்சி' },
    badgeText: '30 Days Sprint'
  },
  {
    unit: 'days',
    value: 60,
    label: { en: '60 Days (2 Months Term Push)', si: 'දින 60 (මාස 2) වාර විභාග සූදානම', ta: '60 நாட்கள் தவணைத் தேர்வு' },
    badgeText: '60 Days Prep'
  },
  {
    unit: 'months',
    value: 6,
    label: { en: '6 Months (Comprehensive A/L or O/L)', si: 'මාස 6ක සම්පූර්ණ විෂය ආවරණය', ta: '6 மாதங்கள் முழுமையான திட்டம்' },
    badgeText: '6 Months Deep Plan'
  },
  {
    unit: 'years',
    value: 1,
    label: { en: '1 Year (12 Months Master Routine)', si: 'වසර 1ක දිගුකාලීන විශිෂ්ටතා සැලසුම', ta: '1 வருடம் நீண்டகால திட்டம்' },
    badgeText: '1 Year Full Mastery'
  },
  {
    unit: 'years',
    value: 2,
    label: { en: '2 Years (A/L 2026/2027 Foundation)', si: 'වසර 2ක අ.පො.ස. උසස් පෙළ පදනම', ta: '2 வருடங்கள் A/L அடிப்படை' },
    badgeText: '2 Years Foundation'
  }
];

export default function StudyPlannerPage() {
  const { addXP } = useAuth();
  const { language } = useLanguage();
  const { studySlots, updateStudySlots, toggleStudySlot, isSyncing, triggerManualSync } = useLiveSync();

  // Wizard Step Control (1 to 5)
  // Step 1: Grade/Stream
  // Step 2: Subject Selection
  // Step 3: Flexible Timeframe (Days/Months/Years or Skip)
  // Step 4: Daily Free Time & Preferred Hours
  // Step 5: Final Hour-by-Hour Interactive Timetable View
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wizardCompleted, setWizardCompleted] = useState<boolean>(false);

  // Step 1 State: Stream
  const [selectedStreamId, setSelectedStreamId] = useState<string>('al-maths');

  // Step 2 State: Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Combined Mathematics', 'Physics', 'Chemistry']);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // Step 3 State: Timeframe
  const [timeframeMode, setTimeframeMode] = useState<'preset' | 'custom' | 'skip'>('preset');
  const [timeframeUnit, setTimeframeUnit] = useState<'days' | 'months' | 'years'>('months');
  const [timeframeValue, setTimeframeValue] = useState<number>(6);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(2); // Default 6 months

  // Step 4 State: Daily Free Time & Chronotype
  const [chronotype, setChronotype] = useState<'early_bird' | 'balanced' | 'night_owl'>('early_bird');
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(6);
  const [scheduleType, setScheduleType] = useState<'school_day' | 'holiday_intensive'>('school_day');
  const [studyPace, setStudyPace] = useState<'balanced' | 'intensive' | 'relaxed'>('balanced');

  // Step 5 State: Active View & Filters
  const [selectedDay, setSelectedDay] = useState<DayType>('Mon');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'hour_by_hour' | 'week_matrix'>('hour_by_hour');

  // Current Stream Object
  const currentStream = SRI_LANKAN_STREAMS.find(s => s.id === selectedStreamId) || SRI_LANKAN_STREAMS[0];

  // Sync selected subjects when stream changes initially
  const handleSelectStream = (streamId: string) => {
    setSelectedStreamId(streamId);
    const stream = SRI_LANKAN_STREAMS.find(s => s.id === streamId);
    if (stream) {
      setSelectedSubjects(stream.defaultSubjects);
    }
  };

  // Toggle subject selection
  const handleToggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSubjectInput.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjects([...selectedSubjects, trimmed]);
      setCustomSubjectInput('');
    }
  };

  // Calculate calculated target days & phase strategy if timeframe provided
  const calculateTotalTargetDays = (): number | null => {
    if (timeframeMode === 'skip') return null;
    if (timeframeMode === 'preset') {
      const preset = TIMEFRAME_PRESETS[selectedPresetIndex];
      if (!preset) return null;
      if (preset.unit === 'days') return preset.value;
      if (preset.unit === 'months') return preset.value * 30;
      if (preset.unit === 'years') return preset.value * 365;
    }
    if (timeframeMode === 'custom') {
      if (timeframeUnit === 'days') return timeframeValue;
      if (timeframeUnit === 'months') return timeframeValue * 30;
      if (timeframeUnit === 'years') return Math.round(timeframeValue * 365);
    }
    return null;
  };

  const totalTargetDays = calculateTotalTargetDays();

  // Final Generator Algorithm - Hour-by-Hour structure from morning to night
  const handleGenerateHourByHourTimetable = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generatedSlots: SyncedStudySlot[] = [];
      const subjects = selectedSubjects.length > 0
        ? selectedSubjects
        : currentStream.defaultSubjects;

      // Hour-by-hour time templates based on Chronotype & Schedule Type
      // Early Bird: 05:00 AM onwards
      // Balanced: 06:00 AM onwards
      // Night Owl: 07:30 AM onwards

      DAYS.forEach((day, dayIndex) => {
        const isWeekend = day === 'Sat' || day === 'Sun';
        const isFullStudyDay = scheduleType === 'holiday_intensive' || isWeekend;

        const subj1 = subjects[dayIndex % subjects.length];
        const subj2 = subjects[(dayIndex + 1) % subjects.length];
        const subj3 = subjects[(dayIndex + 2) % subjects.length];
        const subj4 = subjects[(dayIndex + 3) % subjects.length];

        if (chronotype === 'early_bird') {
          // --- 05:00 - 06:00 AM: Prime Morning Deep Theory ---
          generatedSlots.push({
            id: `slot-${day}-1`,
            day,
            time: '05:00 - 06:00 AM',
            subject: subj1,
            topic: isWeekend ? 'Tough Past Paper Derivations & Formulas' : 'Core Syllabus Theory & Derivations',
            type: 'theory',
            durationMinutes: 60,
            isDone: false
          });

          // --- 06:00 - 07:00 AM: Core Problem Solving ---
          generatedSlots.push({
            id: `slot-${day}-2`,
            day,
            time: '06:00 - 07:00 AM',
            subject: subj1,
            topic: 'Structured Essay & Textbook Problems Solving',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          // --- 07:00 - 07:30 AM: Mindful Breakfast & Hydration Break ---
          generatedSlots.push({
            id: `slot-${day}-3`,
            day,
            time: '07:00 - 07:30 AM',
            subject: 'Break & Nutrition',
            topic: 'Nutritious Breakfast, Light Stretch & Mindful Pause',
            type: 'break',
            durationMinutes: 30,
            isDone: false
          });

          if (!isFullStudyDay) {
            // School Day Daytime Block
            generatedSlots.push({
              id: `slot-${day}-4`,
              day,
              time: '07:30 - 01:30 PM',
              subject: 'School / Academic Classes',
              topic: 'Active Classroom Participation & Class Notes Organization',
              type: 'revision',
              durationMinutes: 360,
              isDone: false
            });

            // --- 02:00 - 03:00 PM: Refreshment & Fun English / Relaxation ---
            generatedSlots.push({
              id: `slot-${day}-5`,
              day,
              time: '02:00 - 03:00 PM',
              subject: 'Relax & Fun English',
              topic: 'Afternoon Rest, Mascot Fun English & Brain Recharge',
              type: 'break',
              durationMinutes: 60,
              isDone: false
            });

            // --- 03:30 - 04:30 PM: Subject 2 Active Recall ---
            generatedSlots.push({
              id: `slot-${day}-6`,
              day,
              time: '03:30 - 04:30 PM',
              subject: subj2,
              topic: 'Past Paper MCQ Speed Test & Unit Review',
              type: 'past_paper',
              durationMinutes: 60,
              isDone: false
            });

            // --- 04:30 - 05:30 PM: Subject 2 Theory Reinforcement ---
            generatedSlots.push({
              id: `slot-${day}-7`,
              day,
              time: '04:30 - 05:30 PM',
              subject: subj2,
              topic: 'Short Notes Compilation & Highlighted Weak Points',
              type: 'theory',
              durationMinutes: 60,
              isDone: false
            });

            // --- 05:30 - 06:30 PM: Outdoor Walk & Physical Recreation ---
            generatedSlots.push({
              id: `slot-${day}-8`,
              day,
              time: '05:30 - 06:30 PM',
              subject: 'Physical Recharge',
              topic: 'Evening Walk / Sports / Family Time & Tea',
              type: 'break',
              durationMinutes: 60,
              isDone: false
            });

            // --- 07:00 - 08:00 PM: Subject 3 Deep Practice ---
            generatedSlots.push({
              id: `slot-${day}-9`,
              day,
              time: '07:00 - 08:00 PM',
              subject: subj3,
              topic: 'Model Questions & Complex Analytical Practice',
              type: 'past_paper',
              durationMinutes: 60,
              isDone: false
            });

            // --- 08:30 - 09:30 PM: Night Recall & Flashcards ---
            generatedSlots.push({
              id: `slot-${day}-10`,
              day,
              time: '08:30 - 09:30 PM',
              subject: subj3,
              topic: 'Smart Flashcard Drill & Audio Note Recitations',
              type: 'revision',
              durationMinutes: 60,
              isDone: false
            });

            // --- 09:30 - 10:00 PM: Daily Review & Sleep Prep ---
            generatedSlots.push({
              id: `slot-${day}-11`,
              day,
              time: '09:30 - 10:00 PM',
              subject: 'Daily Wrap-up',
              topic: 'Tomorrow Goal Planning & 8-Hour Deep Sleep Prep',
              type: 'break',
              durationMinutes: 30,
              isDone: false
            });
          } else {
            // Full Day Intensive / Weekend Schedule
            // 08:00 - 09:00 AM: Subject 1 Deep Drill
            generatedSlots.push({
              id: `slot-${day}-4`,
              day,
              time: '08:00 - 09:00 AM',
              subject: subj1,
              topic: 'Past Paper Part B Essay In-depth Timed Simulation',
              type: 'past_paper',
              durationMinutes: 60,
              isDone: false
            });

            // 09:00 - 10:00 AM: Subject 1 Marking Scheme Review
            generatedSlots.push({
              id: `slot-${day}-5`,
              day,
              time: '09:00 - 10:00 AM',
              subject: subj1,
              topic: 'Model Scheme Cross-Check & Error Correction Log',
              type: 'revision',
              durationMinutes: 60,
              isDone: false
            });

            // 10:00 - 10:30 AM: Brain Reset
            generatedSlots.push({
              id: `slot-${day}-6`,
              day,
              time: '10:00 - 10:30 AM',
              subject: 'Brain Break',
              topic: 'Hydration, Brain Fruit Snack & Quick Relax',
              type: 'break',
              durationMinutes: 30,
              isDone: false
            });

            // 10:30 - 11:30 AM: Subject 2 Theory Deep Dive
            generatedSlots.push({
              id: `slot-${day}-7`,
              day,
              time: '10:30 - 11:30 AM',
              subject: subj2,
              topic: 'High-Weightage Unit Theory & Diagram Practice',
              type: 'theory',
              durationMinutes: 60,
              isDone: false
            });

            // 11:30 - 12:30 PM: Subject 2 Past Paper Questions
            generatedSlots.push({
              id: `slot-${day}-8`,
              day,
              time: '11:30 - 12:30 PM',
              subject: subj2,
              topic: 'Provincial & Top School Term Test Questions Drill',
              type: 'past_paper',
              durationMinutes: 60,
              isDone: false
            });

            // 12:30 - 02:00 PM: Lunch & Rest
            generatedSlots.push({
              id: `slot-${day}-9`,
              day,
              time: '12:30 - 02:00 PM',
              subject: 'Lunch & Relaxation',
              topic: 'Nutritious Lunch, Power Nap & Fun English Mascot Relax',
              type: 'break',
              durationMinutes: 90,
              isDone: false
            });

            // 02:00 - 03:00 PM: Subject 3 Active Derivations
            generatedSlots.push({
              id: `slot-${day}-10`,
              day,
              time: '02:00 - 03:00 PM',
              subject: subj3,
              topic: 'Complex Problem Solving & Mathematical Calculations',
              type: 'theory',
              durationMinutes: 60,
              isDone: false
            });

            // 03:00 - 04:00 PM: Subject 3 Past Paper Drill
            generatedSlots.push({
              id: `slot-${day}-11`,
              day,
              time: '03:00 - 04:00 PM',
              subject: subj3,
              topic: '50-MCQ Timed Rapid Fire Session',
              type: 'quiz',
              durationMinutes: 60,
              isDone: false
            });

            // 04:30 - 06:00 PM: Physical Exercise / Walk
            generatedSlots.push({
              id: `slot-${day}-12`,
              day,
              time: '04:30 - 06:00 PM',
              subject: 'Recreation & Rest',
              topic: 'Evening Exercise, Mind Refreshment & Tea Break',
              type: 'break',
              durationMinutes: 90,
              isDone: false
            });

            // 06:30 - 07:30 PM: Subject 4 / Elective Review
            generatedSlots.push({
              id: `slot-${day}-13`,
              day,
              time: '06:30 - 07:30 PM',
              subject: subj4 || subj1,
              topic: 'Light Subject Revision, General English & ICT Tools',
              type: 'revision',
              durationMinutes: 60,
              isDone: false
            });

            // 07:30 - 08:30 PM: Weak Topic Patching
            generatedSlots.push({
              id: `slot-${day}-14`,
              day,
              time: '07:30 - 08:30 PM',
              subject: 'Weakness Mastery',
              topic: 'Reviewing Red-Flagged Question Mistakes from the Week',
              type: 'theory',
              durationMinutes: 60,
              isDone: false
            });

            // 09:00 - 10:00 PM: Night Flashcard Recall
            generatedSlots.push({
              id: `slot-${day}-15`,
              day,
              time: '09:00 - 10:00 PM',
              subject: 'Spaced Memory Lock',
              topic: 'Audio Summaries, Flashcard Flips & Sleep Consolidation',
              type: 'revision',
              durationMinutes: 60,
              isDone: false
            });
          }
        } else if (chronotype === 'night_owl') {
          // Night Owl Pattern (07:30 AM to 11:30 PM)
          generatedSlots.push({
            id: `slot-${day}-1`,
            day,
            time: '07:30 - 08:30 AM',
            subject: 'Morning Warm-up',
            topic: 'Quick Flashcards & Formula Revision with Coffee',
            type: 'revision',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-2`,
            day,
            time: '08:30 - 09:30 AM',
            subject: subj1,
            topic: 'Core Theory Concepts & Summary Mindmaps',
            type: 'theory',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-3`,
            day,
            time: '10:00 - 11:00 AM',
            subject: subj1,
            topic: 'Past Paper Standard Questions & Model Problems',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-4`,
            day,
            time: '02:00 - 03:00 PM',
            subject: subj2,
            topic: 'Structured Essay Writing & Timed Section Practice',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-5`,
            day,
            time: '03:30 - 04:30 PM',
            subject: subj2,
            topic: 'Unit Flashcards & Derivation Drills',
            type: 'theory',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-6`,
            day,
            time: '05:00 - 06:30 PM',
            subject: 'Recreation & Rest',
            topic: 'Sports / Outdoor Relaxation / Fun English Mascot',
            type: 'break',
            durationMinutes: 90,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-7`,
            day,
            time: '07:30 - 09:00 PM',
            subject: subj3,
            topic: 'High-Focus Deep Problem Solving (Prime Evening)',
            type: 'past_paper',
            durationMinutes: 90,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-8`,
            day,
            time: '09:30 - 11:00 PM',
            subject: subj3,
            topic: 'Night High-Yield Theory & Tough Equation Drills',
            type: 'theory',
            durationMinutes: 90,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-9`,
            day,
            time: '11:00 - 11:30 PM',
            subject: 'Night Consolidation',
            topic: 'Audio Summary Listening in Bed & Day Check-off',
            type: 'revision',
            durationMinutes: 30,
            isDone: false
          });
        } else {
          // Balanced Chronotype (06:00 AM to 10:30 PM)
          generatedSlots.push({
            id: `slot-${day}-1`,
            day,
            time: '06:00 - 07:00 AM',
            subject: subj1,
            topic: 'Prime Morning Focus: High-Yield Theory Derivations',
            type: 'theory',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-2`,
            day,
            time: '07:00 - 08:00 AM',
            subject: subj1,
            topic: 'Past Paper Part A MCQ & Structured Rapid Fire',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-3`,
            day,
            time: '08:00 - 08:30 AM',
            subject: 'Breakfast Break',
            topic: 'Healthy Breakfast, Hydration & Light Brain Stretch',
            type: 'break',
            durationMinutes: 30,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-4`,
            day,
            time: '03:00 - 04:00 PM',
            subject: subj2,
            topic: 'Standard Exam Questions & Model Papers Drilling',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-5`,
            day,
            time: '04:00 - 05:00 PM',
            subject: subj2,
            topic: 'Unit Review, Equation Proofs & Summary Notes',
            type: 'theory',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-6`,
            day,
            time: '05:00 - 06:00 PM',
            subject: 'Recharge & Relax',
            topic: 'Evening Tea, Relaxing Walk & Kavi Fun English Games',
            type: 'break',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-7`,
            day,
            time: '06:30 - 07:30 PM',
            subject: subj3,
            topic: 'Complex Analytical Calculations & Essay Structure',
            type: 'past_paper',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-8`,
            day,
            time: '08:00 - 09:00 PM',
            subject: subj3,
            topic: 'Flashcards, Tough Formula Memorization & Key Terms',
            type: 'revision',
            durationMinutes: 60,
            isDone: false
          });

          generatedSlots.push({
            id: `slot-${day}-9`,
            day,
            time: '09:30 - 10:15 PM',
            subject: 'Night Consolidation',
            topic: 'Audio Summary Recitation, Diary Review & Sleep Prep',
            type: 'revision',
            durationMinutes: 45,
            isDone: false
          });
        }
      });

      updateStudySlots(generatedSlots);
      setIsGenerating(false);
      setWizardCompleted(true);
      setCurrentStep(5);
      addXP(60);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // safe fallback
      }
    }, 900);
  };

  const handleSlotToggleWithXP = (slotId: string, currentDone: boolean) => {
    toggleStudySlot(slotId);
    if (!currentDone) {
      addXP(25);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {
        // safe
      }
    }
  };

  // Stats for the active day and overall
  const daySlots = studySlots.filter(s => s.day === selectedDay);
  const completedSlotsCount = studySlots.filter(s => s.isDone).length;
  const totalSlotsCount = studySlots.length;
  const progressPercent = totalSlotsCount > 0 ? Math.round((completedSlotsCount / totalSlotsCount) * 100) : 0;

  // Print timetable handler
  const handlePrintTimetable = () => {
    window.print();
  };

  // Slot Color Category Helper
  const getSlotColorClasses = (type: SyncedStudySlot['type']) => {
    switch (type) {
      case 'theory':
        return {
          bg: 'bg-blue-50/90 dark:bg-blue-950/40 hover:bg-blue-100/80',
          border: 'border-blue-300 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-300',
          badge: 'bg-blue-600 text-white',
          tag: 'Deep Theory & Derivations',
          accent: 'border-l-4 border-l-blue-600'
        };
      case 'past_paper':
        return {
          bg: 'bg-purple-50/90 dark:bg-purple-950/40 hover:bg-purple-100/80',
          border: 'border-purple-300 dark:border-purple-800',
          text: 'text-purple-800 dark:text-purple-300',
          badge: 'bg-purple-600 text-white',
          tag: 'Past Paper Drill & MCQ',
          accent: 'border-l-4 border-l-purple-600'
        };
      case 'revision':
        return {
          bg: 'bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100/80',
          border: 'border-amber-300 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-300',
          badge: 'bg-amber-500 text-slate-950 font-black',
          tag: 'Smart Flashcards & Review',
          accent: 'border-l-4 border-l-amber-500'
        };
      case 'quiz':
        return {
          bg: 'bg-teal-50/90 dark:bg-teal-950/40 hover:bg-teal-100/80',
          border: 'border-teal-300 dark:border-teal-800',
          text: 'text-teal-800 dark:text-teal-300',
          badge: 'bg-teal-600 text-white',
          tag: 'Speed Test Simulation',
          accent: 'border-l-4 border-l-teal-600'
        };
      case 'break':
      default:
        return {
          bg: 'bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100/70',
          border: 'border-rose-200 dark:border-rose-900/50',
          text: 'text-rose-800 dark:text-rose-300',
          badge: 'bg-rose-500 text-white',
          tag: 'Learn, Relax & Grow',
          accent: 'border-l-4 border-l-rose-500'
        };
    }
  };

  return (
    <div id="sip-arana-ai-study-planner-container" className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              <span>SipArana AI Study Planner</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{isSyncing ? 'Auto-Syncing...' : 'NIE Syllabus Synced'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'AI අධ්‍යයන සැලසුම්කරු සහ පැයෙන් පැය කාලසටහන'
              : language === 'ta'
              ? 'AI படிப்புத் திட்டமிடுபவர் & மணித்தியால அட்டவணை'
              : 'AI Study Planner & Hour-by-Hour Timetable Generator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'ශ්‍රී ලංකා විෂය නිර්දේශයට අනුව ඔබේ විභාග ඉලක්කයට ගැළපෙන, විවේකයද ඇතුළත් පැයෙන් පැය පුද්ගලාරෝපිත දිනචරියාව'
              : language === 'ta'
              ? 'இலங்கை பாடத்திட்டத்திற்கு ஏற்ப உங்கள் தேர்வுக்கு உகந்த, மணித்தியால வாரியான கால அட்டவணை'
              : 'Interactive 5-step generator tailored for Sri Lankan NIE A/L & O/L streams with balanced hourly routines.'}
          </p>
        </div>

        {/* Top Progress & Action Strip */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {wizardCompleted && (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Modify Settings</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Today's Progress</div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{progressPercent}% Done</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              {completedSlotsCount}/{totalSlotsCount}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mascot Encouragement & Buddy Tip */}
      <KaviMascot
        contextPage="planner"
        customMessage={
          currentStep === 1
            ? (language === 'si'
                ? '🦉 ආයුබෝවන්! මම කවි! පියවර 1: ඔයාගේ විභාග අංශය (A/L Physical, Bio, Commerce, Tech, Arts හෝ O/L) තෝරන්න.'
                : language === 'ta'
                ? '🦉 வணக்கம்! நான் கவி! படி 1: உங்கள் பரீட்சைப் பிரிவைத் தெரிவு செய்யுங்கள்.'
                : '🦉 Hoot! I am Kavi, your study buddy! Step 1: Let us begin by picking your target grade or stream!')
            : currentStep === 2
            ? (language === 'si'
                ? '🦉 නියමයි! පියවර 2: ඔයාගේ විෂය සංයෝජනය තෝරන්න. ජාතික විෂය මාලාවට අනුව අපි මේවා සමබරව බෙදා දෙනවා!'
                : language === 'ta'
                ? '🦉 நன்று! படி 2: உங்கள் பாடங்களைத் தெரிவு செய்யுங்கள்.'
                : '🦉 Excellent! Step 2: Select your exact combination of subjects based on the Sri Lankan NIE curriculum.')
            : currentStep === 3
            ? (language === 'si'
                ? '🦉 පියවර 3: විභාගයට ඉතිරි කාලය (දින / මාස / වසර) ඇතුළත් කරන්න. කාලයක් අවශ්‍ය නැතිනම් Skip කරන්නත් පුළුවන්!'
                : language === 'ta'
                ? '🦉 படி 3: தேர்வுக்கு மீதமுள்ள கால அவகாசத்தை (நாட்கள் / மாதங்கள் / வருடங்கள்) குறிப்பிடுங்கள் அல்லது Skip செய்யுங்கள்.'
                : '🦉 Step 3: Choose your target timeframe (Days, Months, or Years) or skip to get a balanced ongoing schedule!')
            : currentStep === 4
            ? (language === 'si'
                ? '🦉 පියවර 4: දිනපතා පාඩම් කරන පැය ගණන සහ උදෑසන අවදි වන වේලාව තෝරන්න. මොළයට විවේකයත් අවශ්‍යයි!'
                : language === 'ta'
                ? '🦉 படி 4: தினசரி படிக்கும் நேரம் மற்றும் உங்களின் விருப்பமான நேரத்தைத் தெரிவு செய்யுங்கள்.'
                : '🦉 Step 4: Tell me about your daily routine so we craft an optimized, neuroscience-backed routine with regular relaxation.')
            : (language === 'si'
                ? '🦉 ඔන්න ඔයාගේ පැයෙන් පැය කාලසටහන සූදානම්! දිනපතා සෙෂන්ස් සම්පූර්ණ කර ලකුණු කරගන්න. +25 XP බැගින් හිමිවේ!'
                : language === 'ta'
                ? '🦉 இதோ உங்கள் மணித்தியால வாரியான கால அட்டவணை! ஒவ்வொரு நேரப் பகுதியையும் முடித்து +25 XP புள்ளிகளைப் பெறுங்கள்!'
                : '🦉 Your hour-by-hour balanced schedule is ready! Check off each 1-hour session to earn +25 XP and build your winning streak!')
        }
      />

      {/* 3. STEP PROGRESS BAR (Steps 1 to 5) */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          {[
            { num: 1, label: { en: 'Grade / Stream', si: 'විෂය ධාරාව', ta: 'பிரிவு' } },
            { num: 2, label: { en: 'Subjects Choice', si: 'විෂයයන්', ta: 'பாடங்கள்' } },
            { num: 3, label: { en: 'Target Timeframe', si: 'කාලරාමුව', ta: 'கால அளவு' } },
            { num: 4, label: { en: 'Daily Routine', si: 'දිනචරියාව', ta: 'வழக்கம்' } },
            { num: 5, label: { en: 'Hourly Timetable', si: 'කාලසටහන', ta: 'அட்டவணை' } },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num || (wizardCompleted && currentStep !== s.num);

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition flex-1 min-w-[130px] justify-center ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isDone && !isActive ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="truncate">{s.label[language] || s.label.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          STEP 1: GRADE / STREAM SELECTION
         ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Step 1 of 5</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'si'
                ? 'ඔබේ ශ්‍රේණිය හෝ විභාග ධාරාව තෝරන්න'
                : language === 'ta'
                ? 'உங்கள் தரம் அல்லது பரீட்சைப் பிரிவைத் தெரிவு செய்யுங்கள்'
                : 'Select Your Grade or A/L / O/L Stream'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'si'
                ? 'ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුව සහ ජාතික අධ්‍යාපන ආයතන (NIE) නිර්දේශිත විෂය ධාරාවන් මෙහි ඇත.'
                : language === 'ta'
                ? 'இலங்கை கல்வித் திணைக்களத்தின் அதிகாரப்பூர்வ பாடப்பிரிவுகள்.'
                : 'Choose your academic track according to the Sri Lankan national curriculum.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SRI_LANKAN_STREAMS.map((stream) => {
              const isSelected = selectedStreamId === stream.id;

              return (
                <div
                  key={stream.id}
                  onClick={() => handleSelectStream(stream.id)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-lg ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${stream.color}`}>
                        {stream.badge}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white pt-1">
                      {stream.name[language] || stream.name.en}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {stream.description[language] || stream.description.en}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                    {stream.defaultSubjects.slice(0, 3).map((subj, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Subject Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: SUBJECTS LIST & CHART BASED ON SRI LANKAN CURRICULUM
         ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Step 2 of 5 • {currentStream.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'si'
                ? 'ඔබගේ විෂය සංයෝජනය තෝරන්න (Subjects Choice)'
                : language === 'ta'
                ? 'உங்கள் பாடங்களைத் தெரிவு செய்யுங்கள்'
                : 'Select Your Stream Subjects Chart'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'si'
                ? 'ඔබ අධ්‍යයනය කරන විෂයයන් මත ක්ලික් කර තෝරන්න. අමතර විෂයයන් පහළින් එකතු කළ හැක.'
                : language === 'ta'
                ? 'நீங்கள் கற்கும் பாடங்களைத் தெரிவு செய்யுங்கள் அல்லது புதிய பாடங்களைச் சேர்க்கவும்.'
                : 'Click subjects from the national curriculum below, or add custom subjects to personalize your schedule.'}
            </p>
          </div>

          {/* Subjects Visual Grid Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>National Curriculum Subjects ({currentStream.badge})</span>
              <span className="text-blue-600 dark:text-blue-400">{selectedSubjects.length} subjects selected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentStream.allCurriculumSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);

                return (
                  <div
                    key={subject}
                    onClick={() => handleToggleSubject(subject)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs sm:text-sm font-bold">{subject}</span>
                    </div>

                    <BookOpen className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Badges & Add Custom Subject Form */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selected Routine Focus:
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleSubject(s)}
                    className="hover:text-red-200 ml-1 text-white/80"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddCustomSubject} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom subject (e.g., General English, Git, French)..."
                value={customSubjectInput}
                onChange={(e) => setCustomSubjectInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Target Timeframe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: FLEXIBLE TIMEFRAME SELECTION (Days, Months, Years or Skip)
         ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Step 3 of 5 • Flexible Timeframe</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'si'
                ? 'විභාගය දක්වා ඉතිරි කාලරාමුව තෝරන්න (Target Timeframe)'
                : language === 'ta'
                ? 'தேர்வுக்கான கால அவகாசத்தைத் தெரிவு செய்யுங்கள்'
                : 'Choose or Input Your Target Exam Timeframe'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'si'
                ? 'ඔබට විභාගයට ඉතිරි දින (Days), මාස (Months), හෝ වසර (Years) අනුව ඉලක්කගත කාලසටහනක් සකස් කරගත හැක. නිශ්චිත කාලයක් නොමැති නම් Skip කළ හැක.'
                : language === 'ta'
                ? 'நாட்கள், மாதங்கள் அல்லது வருடங்களின் அடிப்படையில் உங்கள் இலக்கை நிர்ணயிக்கலாம்.'
                : 'Select or input your study timeframe (Days / Months / Years) for specialized pacing, or skip for a standard weekly routine.'}
            </p>
          </div>

          {/* Timeframe Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setTimeframeMode('preset')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                timeframeMode === 'preset'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Recommended Presets
            </button>
            <button
              type="button"
              onClick={() => setTimeframeMode('custom')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                timeframeMode === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Custom Days / Months / Years
            </button>
            <button
              type="button"
              onClick={() => setTimeframeMode('skip')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                timeframeMode === 'skip'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Skip (Standard Balanced Routine)
            </button>
          </div>

          {/* Mode 1: Presets */}
          {timeframeMode === 'preset' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TIMEFRAME_PRESETS.map((preset, index) => {
                const isSelected = selectedPresetIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPresetIndex(index)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                        {preset.badgeText}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600 text-white" />}
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white pt-1">
                      {preset.label[language] || preset.label.en}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {preset.unit === 'days'
                        ? `${preset.value} days intensive exam sprint & past paper simulation`
                        : preset.unit === 'months'
                        ? `${preset.value} months multi-phase concept and past paper mastery`
                        : `${preset.value} year long-term syllabus foundation & rank building`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode 2: Custom Days / Months / Years */}
          {timeframeMode === 'custom' && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Specify Your Exact Remaining Timeframe:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Unit Type</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {(['days', 'months', 'years'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => {
                          setTimeframeUnit(unit);
                          if (unit === 'days' && timeframeValue < 10) setTimeframeValue(45);
                          if (unit === 'months' && timeframeValue > 24) setTimeframeValue(6);
                          if (unit === 'years' && timeframeValue > 5) setTimeframeValue(1);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold capitalize transition ${
                          timeframeUnit === unit
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Number of {timeframeUnit.toUpperCase()} Remaining
                  </label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="number"
                      min={timeframeUnit === 'days' ? 5 : 1}
                      max={timeframeUnit === 'days' ? 730 : timeframeUnit === 'months' ? 36 : 4}
                      value={timeframeValue}
                      onChange={(e) => setTimeframeValue(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize px-1">
                      {timeframeUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Skip notification box */}
          {timeframeMode === 'skip' && (
            <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200">
                Standard Balanced Ongoing Schedule
              </h3>
              <p className="text-xs text-blue-700/80 dark:text-blue-300/70 max-w-md mx-auto">
                No specific exam date specified. SipArana will generate a steady, weekly balanced schedule ensuring every subject receives prime morning and evening coverage.
              </p>
            </div>
          )}

          {/* Strategic 3-Phase Roadmap Preview if Timeframe given */}
          {totalTargetDays && totalTargetDays > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white space-y-3 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Calculated Timeframe Strategy ({totalTargetDays} Days Target)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-indigo-300">
                  Approx. {Math.ceil(totalTargetDays / 7)} Weeks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-800/40 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">Phase 1 (40% Time)</div>
                  <div className="text-xs font-extrabold text-white">Syllabus Theory & Derivations</div>
                  <p className="text-[11px] text-indigo-200/70">Concept understanding & summary mindmaps.</p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-800/40 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">Phase 2 (40% Time)</div>
                  <div className="text-xs font-extrabold text-amber-300">Past Papers 2015-2024 Drill</div>
                  <p className="text-[11px] text-indigo-200/70">Structured essays & timed MCQ tests.</p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-800/40 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">Phase 3 (20% Time)</div>
                  <div className="text-xs font-extrabold text-emerald-300">High-Yield Exam Simulation</div>
                  <p className="text-[11px] text-indigo-200/70">Full model papers & speed optimization.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Daily Routine & Hours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: DAILY FREE TIME & PREFERRED STUDY HOURS
         ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Step 4 of 5 • Daily Routine & Hours</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'si'
                ? 'දෛනික පාඩම් වේලාවන් සහ චර්යාව සකසන්න'
                : language === 'ta'
                ? 'தினசரி படிக்கும் நேரம் மற்றும் வழக்கத்தைத் தெரிவு செய்யுங்கள்'
                : 'Set Daily Free Time & Preferred Study Hours'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'si'
                ? 'ඔබ වඩාත් කැමති උදෑසන ආරම්භය සහ දිනකට වෙන් කළ හැකි පාඩම් පැය ගණන තෝරන්න.'
                : language === 'ta'
                ? 'உங்கள் தினசரி படிக்கும் பழக்கத்திற்கு ஏற்ப உகந்த நேரத்தைத் தெரிவு செய்யுங்கள்.'
                : 'Select your preferred biological peak study hours and daily free time for an hour-by-hour balanced layout.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Chronotype */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Preferred Study Routine Style (Chronotype)
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'early_bird',
                    icon: Sunrise,
                    title: 'Early Bird (05:00 AM Start)',
                    desc: 'Prime morning theory absorption before school/classes.',
                    color: 'text-amber-500'
                  },
                  {
                    id: 'balanced',
                    icon: Sun,
                    title: 'Standard Balanced (06:00 AM Start)',
                    desc: 'Harmonious split between morning and evening sessions.',
                    color: 'text-blue-500'
                  },
                  {
                    id: 'night_owl',
                    icon: Moon,
                    title: 'Night Focus (Evening up to 11:30 PM)',
                    desc: 'Quiet late evening deep problem solving and past papers.',
                    color: 'text-indigo-500'
                  }
                ].map((item) => {
                  const isSelected = chronotype === item.id;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setChronotype(item.id as any)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Study Hours Target Slider & Day Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    2. Daily Pure Study Target
                  </span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{dailyStudyHours} Pure Hours / Day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>2 hrs (School Light)</span>
                  <span>5-6 hrs (Standard A/L)</span>
                  <span>10 hrs (Intensive Study Leave)</span>
                </div>
              </div>

              {/* Day Mode */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  3. Day Schedule Structure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleType('school_day')}
                    className={`p-3 rounded-2xl border-2 text-left transition ${
                      scheduleType === 'school_day'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">School & Classes Day</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Morning & Afternoon/Night slots</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleType('holiday_intensive')}
                    className={`p-3 rounded-2xl border-2 text-left transition ${
                      scheduleType === 'holiday_intensive'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Holiday / Study Leave</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Full day immersive hourly layout</div>
                  </button>
                </div>
              </div>

              {/* Pace */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  4. Session Pacing Strategy
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['relaxed', 'balanced', 'intensive'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setStudyPace(p)}
                      className={`py-2 text-center text-xs font-bold rounded-xl capitalize transition ${
                        studyPace === p
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="generate-hour-by-hour-btn"
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateHourByHourTimetable}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-sm shadow-xl transition transform active:scale-98 disabled:opacity-75 flex items-center gap-2.5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Hour-by-Hour Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Hour-by-Hour Timetable (+60 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: HOUR-BY-HOUR FINAL OUTPUT & TIMETABLE MATRIX
         ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary Strip & View Controls */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase">
                  {currentStream.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  {selectedSubjects.length} Core Subjects
                </span>
                {totalTargetDays && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>{totalTargetDays} Days Target</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {language === 'si'
                  ? 'ඔබගේ පැයෙන් පැය පුද්ගලාරෝපිත කාලසටහන'
                  : language === 'ta'
                  ? 'உங்கள் மணித்தியால வாரியான கால அட்டவணை'
                  : 'Your Personalized Hour-by-Hour Study Timetable'}
              </h2>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveViewMode('hour_by_hour')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeViewMode === 'hour_by_hour'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Day Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('week_matrix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeViewMode === 'week_matrix'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Full Week Matrix
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrintTimetable}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                title="Print or Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={triggerManualSync}
                className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold transition flex items-center gap-1.5"
                title="Sync Live"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Color-Coded Category Legend Bar (Learn, Relax, & Grow Philosophy) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="truncate">Deep Theory</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0" />
              <span className="truncate">Past Paper Drill</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="truncate">Flashcards & Memory</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span className="truncate">MCQ Speed Quiz</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 col-span-2 sm:col-span-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="truncate">Learn, Relax & Grow</span>
            </div>
          </div>

          {/* DAY SELECTOR TABS */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {DAYS.map((day) => {
              const countForDay = studySlots.filter(s => s.day === day).length;
              const doneForDay = studySlots.filter(s => s.day === day && s.isDone).length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[62px] py-2.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{day}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {doneForDay}/{countForDay} Done
                  </span>
                </button>
              );
            })}
          </div>

          {/* VIEW MODE 1: HOUR-BY-HOUR TIMELINE VIEW */}
          {activeViewMode === 'hour_by_hour' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>{selectedDay}'s Hour-by-Hour Scheduled Timeline</span>
                  <span className="text-xs font-normal text-slate-400">({daySlots.length} sessions)</span>
                </h3>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-500" />
                  <span>Click any slot to mark done (+25 XP)</span>
                </span>
              </div>

              {daySlots.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    No sessions found for {selectedDay}
                  </h4>
                  <button
                    type="button"
                    onClick={handleGenerateHourByHourTimetable}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                  >
                    Generate Now
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {daySlots.map((slot) => {
                    const styling = getSlotColorClasses(slot.type);

                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleSlotToggleWithXP(slot.id, slot.isDone)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${styling.bg} ${styling.border} ${styling.accent} ${
                          slot.isDone ? 'opacity-70 line-through grayscale-[30%]' : 'shadow-xs hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <button
                            type="button"
                            className={`flex-shrink-0 transition-transform ${
                              slot.isDone ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-blue-600'
                            }`}
                          >
                            {slot.isDone ? (
                              <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                {slot.subject}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styling.badge}`}>
                                {styling.tag}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{slot.time}</span>
                              </span>
                            </div>
                            <p className={`text-xs ${slot.isDone ? 'text-slate-500' : 'text-slate-700 dark:text-slate-200 font-semibold'}`}>
                              {slot.topic}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            +25 XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: FULL WEEK MASTER MATRIX VIEW */}
          {activeViewMode === 'week_matrix' && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Master Full-Week Timetable Grid (Monday to Sunday)</span>
                </h3>
              </div>

              <div className="grid grid-cols-7 gap-2 min-w-[760px]">
                {DAYS.map((day) => {
                  const slotsThisDay = studySlots.filter(s => s.day === day);

                  return (
                    <div key={day} className="space-y-2">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                        <div className="text-xs font-black text-slate-900 dark:text-white">{day}</div>
                        <div className="text-[10px] text-slate-400">{slotsThisDay.length} sessions</div>
                      </div>

                      <div className="space-y-1.5">
                        {slotsThisDay.map((slot) => {
                          const styling = getSlotColorClasses(slot.type);

                          return (
                            <div
                              key={slot.id}
                              onClick={() => handleSlotToggleWithXP(slot.id, slot.isDone)}
                              className={`p-2 rounded-xl border text-[11px] cursor-pointer transition ${styling.bg} ${styling.border} ${
                                slot.isDone ? 'opacity-60' : 'hover:scale-[1.02]'
                              }`}
                            >
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {slot.subject}
                              </div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                                {slot.time.split(' - ')[0]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Restart & Mascot Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600 text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Want to adjust your target days or subjects?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can re-run the 5-step generator at any time as your exam date nears!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
            >
              Re-launch Generator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
