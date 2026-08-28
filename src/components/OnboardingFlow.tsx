import React, { useState } from 'react';
import {
  Globe,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Library,
  Flame,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import SiparanaLogo from '@/components/SiparanaLogo';
import { soundFX } from '@/utils/audioUtils';
import type {
  GlobalCountryCode,
  SchoolGrade,
  Stream,
  StudentCategory,
  UserProfile
} from '@/types';
import { getCountryByCode } from '@/data/globalCurriculumData';

interface CountryOption {
  code: GlobalCountryCode;
  name: string;
  nativeName: string;
  flag: string;
  curriculumSubtitle: string;
}

const COUNTRIES_LIST: CountryOption[] = [
  {
    code: 'LK',
    name: 'Sri Lanka',
    nativeName: 'ශ්‍රී ලංකාව',
    flag: '🇱🇰',
    curriculumSubtitle: 'NIE National Curriculum (Scholarship, O/L, A/L)'
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    curriculumSubtitle: 'Ofqual / GCSE 9-1 & Pearson / Cambridge A-Levels'
  },
  {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    curriculumSubtitle: 'Common Core & AP Advanced Placement / SAT'
  },
  {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本 (Japan)',
    flag: '🇯🇵',
    curriculumSubtitle: 'MEXT 文部科学省 (Koko, Kyotsu Test & JLPT)'
  },
  {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत (India)',
    flag: '🇮🇳',
    curriculumSubtitle: 'CBSE / NCERT / JEE Mains & NEET Track'
  },
  {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    curriculumSubtitle: 'ACARA Curriculum & Senior Secondary ATAR'
  },
  {
    code: 'GLOBAL',
    name: 'International',
    nativeName: 'International',
    flag: '🌐',
    curriculumSubtitle: 'International Baccalaureate (IB DP) & Cambridge'
  }
];

interface UniversityOption {
  name: string;
  shortName: string;
  faculties: string[];
}

const UNIVERSITY_OPTIONS: UniversityOption[] = [
  {
    name: 'University of Moratuwa',
    shortName: 'UoM',
    faculties: [
      'Faculty of Engineering',
      'Faculty of Information Technology',
      'Faculty of Architecture',
      'Faculty of Business'
    ]
  },
  {
    name: 'University of Colombo',
    shortName: 'UoC',
    faculties: [
      'Faculty of Medicine',
      'Faculty of Science',
      'Faculty of Arts',
      'Faculty of Law',
      'Faculty of Management & Finance',
      'University of Colombo School of Computing (UCSC)'
    ]
  },
  {
    name: 'University of Peradeniya',
    shortName: 'UoP',
    faculties: [
      'Faculty of Engineering',
      'Faculty of Medicine',
      'Faculty of Science',
      'Faculty of Agriculture',
      'Faculty of Arts'
    ]
  },
  {
    name: 'University of Sri Jayewardenepura',
    shortName: 'USJ',
    faculties: [
      'Faculty of Management Studies & Commerce',
      'Faculty of Applied Sciences',
      'Faculty of Medical Sciences',
      'Faculty of Engineering',
      'Faculty of Technology'
    ]
  },
  {
    name: 'University of Kelaniya',
    shortName: 'UoK',
    faculties: [
      'Faculty of Science',
      'Faculty of Computing & Technology',
      'Faculty of Commerce & Management',
      'Faculty of Medicine'
    ]
  },
  {
    name: 'University of Ruhuna',
    shortName: 'UoR',
    faculties: [
      'Faculty of Engineering',
      'Faculty of Science',
      'Faculty of Medicine',
      'Faculty of Management & Finance'
    ]
  },
  {
    name: 'SLIIT (Sri Lanka Institute of Information Technology)',
    shortName: 'SLIIT',
    faculties: [
      'Faculty of Computing',
      'Faculty of Engineering',
      'SLIIT Business School',
      'Faculty of Humanities & Sciences'
    ]
  },
  {
    name: 'NSBM Green University',
    shortName: 'NSBM',
    faculties: [
      'Faculty of Computing',
      'Faculty of Business',
      'Faculty of Engineering'
    ]
  },
  {
    name: 'IIT (Informatics Institute of Technology)',
    shortName: 'IIT',
    faculties: [
      'School of Computing',
      'School of Business'
    ]
  },
  {
    name: 'Other State / International University',
    shortName: 'Other',
    faculties: [
      'Faculty of Computer Science & IT',
      'Faculty of Engineering & Technology',
      'Faculty of Health & Medicine',
      'Faculty of Business Administration',
      'Faculty of Arts & Humanities'
    ]
  }
];

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { profile, updateProfile, setGradeAndStream, setUniversityAndDegree } = useAuth();
  const { language } = useLanguage();

  // Current Step: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedCountry, setSelectedCountry] = useState<GlobalCountryCode>(
    profile?.countryCode || 'LK'
  );
  const [studentName, setStudentName] = useState<string>(
    profile?.name && profile.name !== 'New Student' && !profile.name.includes('@')
      ? profile.name
      : ''
  );
  const [category, setCategory] = useState<StudentCategory>(
    profile?.studentCategory || 'School'
  );

  // School State
  const [selectedGrade, setSelectedGrade] = useState<SchoolGrade>(
    (profile?.grade as SchoolGrade) || 13
  );
  const [selectedStream, setSelectedStream] = useState<Stream>(
    profile?.stream || 'Physical Science (Maths)'
  );

  // University State
  const [selectedUniversity, setSelectedUniversity] = useState<string>(
    profile?.university || 'University of Moratuwa'
  );
  const [selectedFaculty, setSelectedFaculty] = useState<string>(
    profile?.faculty || 'Faculty of Engineering'
  );
  const [selectedDegree, setSelectedDegree] = useState<string>(
    profile?.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering'
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    profile?.academicYear || 1
  );

  // Validation / Feedback State
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Synchronize available faculties when university changes
  const activeUniObj =
    UNIVERSITY_OPTIONS.find((u) => u.name === selectedUniversity) ||
    UNIVERSITY_OPTIONS[0];

  const handleUniversityChange = (uniName: string) => {
    setSelectedUniversity(uniName);
    const targetUni = UNIVERSITY_OPTIONS.find((u) => u.name === uniName);
    if (targetUni && targetUni.faculties.length > 0) {
      setSelectedFaculty(targetUni.faculties[0]);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setErrorMessage('');
    if (step === 1) {
      if (!selectedCountry) {
        setErrorMessage(
          language === 'si'
            ? 'කරුණාකර ඔබගේ රට තෝරන්න.'
            : 'Please select your country / region.'
        );
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!studentName.trim()) {
        setErrorMessage(
          language === 'si'
            ? 'කරුණාකර ඔබගේ නම හෝ Username ඇතුළත් කරන්න.'
            : 'Please enter your student name or username.'
        );
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!category) {
        setErrorMessage(
          language === 'si'
            ? 'කරුණාකර ඔබගේ අධ්‍යයන කාණ්ඩය තෝරන්න.'
            : 'Please select your academic category.'
        );
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      soundFX.playIncorrect();
      return;
    }
    soundFX.playPop();
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    soundFX.playPop();
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submit & Dynamic AI Prompt Grounding
  const handleFinish = async () => {
    if (!validateStep(currentStep)) {
      soundFX.playIncorrect();
      return;
    }

    setIsSubmitting(true);
    soundFX.playLevelUp();

    try {
      const activeCountryData = getCountryByCode(selectedCountry);
      const isUni = category === 'University';

      if (isUni) {
        setUniversityAndDegree(
          selectedUniversity,
          selectedFaculty,
          selectedDegree || 'Undergraduate Degree',
          'UNI-PROG',
          selectedYear,
          1
        );

        updateProfile({
          name: studentName.trim(),
          studentCategory: 'University',
          level: 'CAMPUS',
          stream: 'Higher Education',
          countryCode: selectedCountry,
          countryName: activeCountryData.name,
          countryFlag: activeCountryData.flag,
          school: selectedUniversity,
          university: selectedUniversity,
          universityShort: activeUniObj.shortName || 'Uni',
          faculty: selectedFaculty,
          degreeProgramme: selectedDegree,
          academicYear: selectedYear,
          hasCompletedOnboarding: true,
          medium: profile?.medium || 'English'
        });
      } else {
        setGradeAndStream(selectedGrade, selectedStream);

        const isGrade5 = selectedGrade === 5;
        const levelCalculated =
          selectedCountry === 'LK'
            ? isGrade5
              ? 'SCHOLARSHIP'
              : selectedGrade <= 9
              ? 'JUNIOR'
              : selectedGrade <= 11
              ? 'OL'
              : 'AL'
            : selectedGrade >= 11
            ? 'GLOBAL_SENIOR'
            : 'GLOBAL_SECONDARY';

        updateProfile({
          name: studentName.trim(),
          studentCategory: 'School',
          countryCode: selectedCountry,
          countryName: activeCountryData.name,
          countryFlag: activeCountryData.flag,
          grade: selectedGrade,
          stream: selectedStream,
          level: levelCalculated,
          isKidMode: isGrade5 && selectedCountry === 'LK',
          hasCompletedOnboarding: true,
          medium:
            selectedCountry === 'LK'
              ? profile?.medium || 'Sinhala'
              : selectedCountry === 'JP'
              ? 'Japanese'
              : 'English'
        });
      }

      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 400);
    } catch {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: language === 'si' ? 'රට තෝරන්න' : 'Country', icon: Globe },
    { num: 2, label: language === 'si' ? 'ශිෂ්‍ය නම' : 'Student Name', icon: User },
    { num: 3, label: language === 'si' ? 'කාණ්ඩය' : 'Category', icon: Layers },
    { num: 4, label: language === 'si' ? 'ශ්‍රේණිය / අංශය' : 'Grade & Stream', icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Header with SipArana Emblem */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <SiparanaLogo variant="horizontal" size="md" showSubtitle={true} />
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'si' ? 'ශිෂ්‍ය ප්‍රවේශ පිහිටුවීම' : 'Student Onboarding'}
          </span>
          <span className="text-xs font-black text-slate-400">
            Step {currentStep} of 4
          </span>
        </div>
      </header>

      {/* Main Form Card Container */}
      <main className="max-w-3xl w-full mx-auto my-auto py-4">
        {/* Step Progress Bar & Indicators */}
        <div className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="grid grid-cols-4 gap-2">
            {stepsList.map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              const StepIcon = step.icon;

              return (
                <div key={step.num} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold truncate max-w-[70px] sm:max-w-none text-center ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                        : isDone
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Linear Progress Indicator */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Step Content with Motion Animations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Validation Warning Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              {errorMessage}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* STEP 1: SELECT COUNTRY / REGION (රට තෝරන්න) */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-2">
                    <Globe className="w-3.5 h-3.5" />
                    Step 1 of 4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>🌐</span>
                    <span>Select Country / Region (රට තෝරන්න) *</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'si'
                      ? 'ඔබගේ නිල විභාග නිර්දේශය සහ ගුරු මාර්ගෝපදේශ පද්ධතිය ස්වයංක්‍රීයව පිහිටුවීමට ඔබගේ රට තෝරන්න.'
                      : 'Choose your location to automatically adapt all syllabus guidelines, examination standards, and pedagogical grading.'}
                  </p>
                </div>

                {/* Horizontal Selectable Chips / Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {COUNTRIES_LIST.map((country) => {
                    const isSelected = selectedCountry === country.code;
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          soundFX.playPop();
                          setSelectedCountry(country.code);
                        }}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-3xl sm:text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            {country.flag}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm sm:text-base font-black ${
                                  isSelected
                                    ? 'text-blue-900 dark:text-blue-200'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {country.name}
                              </h3>
                              {country.code === 'LK' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                              {country.curriculumSubtitle}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 dark:border-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: STUDENT PROFILE NAME */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Step 2 of 4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>👤</span>
                    <span>Username / Student Name *</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'si'
                      ? 'AI උපදේශකවරයා ඔබව ඇමතීමට සහ වාර්තාවල සඳහන් කිරීමට කැමති නම ඇතුළත් කරන්න.'
                      : 'Enter your preferred name or student handle for personalized AI tutoring and study analytics.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'si' ? 'ශිෂ්‍යයාගේ සම්පූර්ණ නම' : 'Full Student Name / Handle'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="උදා: කසුන් පෙරේරා / Heshan Subasinghe"
                      autoFocus
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-base font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/15 transition shadow-xs"
                    />
                    {studentName.trim() && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Suggested Examples */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400">
                      {language === 'si' ? 'උදාහරණ:' : 'Examples:'}
                    </span>
                    {['කසුන් පෙරේරා', 'Heshan Subasinghe', 'Dinithi Senanayake', 'Senuri Perera'].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          soundFX.playPop();
                          setStudentName(sample);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Encouraging Quote Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800/60 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'si'
                        ? '100% පුද්ගලීකරණය කළ අධ්‍යයන අත්දැකීමක්'
                        : '100% Personalized Academic Experience'}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      {language === 'si'
                        ? 'ඔබගේ ඉගෙනුම් ඉතිහාසය, ප්‍රශ්නාවලි හා සටහන් මෙම නම යටතේ ස්ථිරවම සුරැකේ.'
                        : 'Your learning goals, weakness tracking, and essay marks will be anchored to your student profile.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: ACADEMIC CATEGORY SELECTOR */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    Step 3 of 4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>Select Category:</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'si'
                      ? 'ඔබ පාසල් ශිෂ්‍යයෙක්ද (Grades 5-13) නැතහොත් විශ්වවිද්‍යාල ශිෂ්‍යයෙක්ද?'
                      : 'Select whether you are in Primary/Secondary School or an Undergraduate University Degree.'}
                  </p>
                </div>

                {/* Two Interactive Selection Cards Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Card A: School Student */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setCategory('School');
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden group ${
                      category === 'School'
                        ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-lg ring-4 ring-blue-500/15'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          category === 'School'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          category === 'School'
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 dark:border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        School Student
                      </h3>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        Grades 5 to 13 (Scholarship, O/L, A/L)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {language === 'si'
                          ? '5 වසර ශිෂ්‍යත්වය, සාමාන්‍ය පෙළ (O/L) සහ උසස් පෙළ (A/L) විෂය ධාරා සඳහා ගුරු පොතට අනුකූල මඟපෙන්වීම.'
                          : 'Official national curriculum materials, interactive model papers, unit revision, and past questions.'}
                      </p>
                    </div>
                  </button>

                  {/* Card B: University Undergrad */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setCategory('University');
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden group ${
                      category === 'University'
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-lg ring-4 ring-indigo-500/15'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          category === 'University'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          category === 'University'
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-300 dark:border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        University Undergrad
                      </h3>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        Undergraduate Degree (B.Sc., MBBS, Eng, IT, Mgt)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {language === 'si'
                          ? 'විශ්වවිද්‍යාල මොඩියුල, Assignment හා Lab Helper, IEEE/APA Citations සහ GPA ගණනය කිරීමේ මෙවලම්.'
                          : 'Specialized faculty modules, thesis research assistant, algorithmic code debugging, and GPA analytics.'}
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 4: DYNAMIC GRADE & STREAM SELECTION */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Step 4 of 4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>
                      {category === 'School'
                        ? '🎓 Grade & Stream Selection'
                        : '🏛️ University & Faculty Selection'}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {category === 'School'
                      ? language === 'si'
                        ? 'ඔබගේ නිශ්චිත ශ්‍රේණිය සහ අධ්‍යයන විෂය ධාරාව තෝරන්න.'
                        : 'Select your active school grade and exam stream.'
                      : language === 'si'
                      ? 'ඔබගේ විශ්වවිද්‍යාලය, පීඨය සහ අධ්‍යයන වර්ෂය තෝරන්න.'
                      : 'Select your university institution, faculty, and current academic year.'}
                  </p>
                </div>

                {/* CONDITIONAL BRANCH A: SCHOOL STUDENT */}
                {category === 'School' ? (
                  <div className="space-y-5 pt-1">
                    {/* Dropdown 1: Select Grade */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span>🎓 Select Grade (ශ්‍රේණිය තෝරන්න):</span>
                        <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedGrade}
                          onChange={(e) => {
                            const newGrade = Number(e.target.value) as SchoolGrade;
                            setSelectedGrade(newGrade);
                            if (newGrade === 5) {
                              setSelectedStream('Grade 5 Scholarship');
                            } else if (newGrade <= 9) {
                              setSelectedStream('Junior Secondary (Grade 6-9)');
                            } else if (newGrade <= 11) {
                              setSelectedStream('General O/L');
                            } else {
                              setSelectedStream('Physical Science (Maths)');
                            }
                          }}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition appearance-none cursor-pointer pr-10"
                        >
                          <option value={5}>Grade 5 (5 ශ්‍රේණිය - Scholarship Exam)</option>
                          <option value={6}>Grade 6 (6 ශ්‍රේණිය - Junior Secondary)</option>
                          <option value={7}>Grade 7 (7 ශ්‍රේණිය - Junior Secondary)</option>
                          <option value={8}>Grade 8 (8 ශ්‍රේණිය - Junior Secondary)</option>
                          <option value={9}>Grade 9 (9 ශ්‍රේණිය - Junior Secondary)</option>
                          <option value={10}>Grade 10 (10 ශ්‍රේණිය - O/L Foundation)</option>
                          <option value={11}>Grade 11 (11 ශ්‍රේණිය - G.C.E. O/L Exam)</option>
                          <option value={12}>Grade 12 (12 ශ්‍රේණිය - G.C.E. A/L Beginner)</option>
                          <option value={13}>Grade 13 (13 ශ්‍රේණිය - G.C.E. A/L Exam Candidate)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown 2: Select Stream */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span>🎗️ Select Stream (විෂය ධාරාව තෝරන්න):</span>
                        <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedStream}
                          onChange={(e) => setSelectedStream(e.target.value as Stream)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition appearance-none cursor-pointer pr-10"
                        >
                          {selectedGrade === 5 ? (
                            <option value="Grade 5 Scholarship">
                              Grade 5 Scholarship (ශිෂ්‍යත්ව ප්‍රශ්න පත්‍ර හා පරිසරය)
                            </option>
                          ) : selectedGrade <= 9 ? (
                            <option value="Junior Secondary (Grade 6-9)">
                              Junior Secondary Core (කනිෂ්ඨ ද්විතීයික විෂයයන්)
                            </option>
                          ) : selectedGrade <= 11 ? (
                            <option value="General O/L">
                              General O/L (සාමාන්‍ය පෙළ ප්‍රධාන හා කාණ්ඩ විෂයයන්)
                            </option>
                          ) : (
                            <>
                              <option value="Physical Science (Maths)">
                                Physical Science (Combined Maths, Physics, Chemistry, ICT)
                              </option>
                              <option value="Biological Science (Bio)">
                                Biological Science (Biology, Chemistry, Physics, Agri)
                              </option>
                              <option value="Commerce">
                                Commerce (Accounting, Business Studies, Economics, ICT)
                              </option>
                              <option value="Technology">
                                Technology (ET, BST, SFT, ICT)
                              </option>
                              <option value="Arts">
                                Arts (Languages, Media Studies, History, Logic, Sinhala/Tamil)
                              </option>
                              <option value="General Academic">
                                General Academic Stream
                              </option>
                            </>
                          )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CONDITIONAL BRANCH B: UNIVERSITY UNDERGRAD */
                  <div className="space-y-4 pt-1">
                    {/* Dropdown 1: Select University */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span>🏛️ Select University (විශ්වවිද්‍යාලය):</span>
                        <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedUniversity}
                          onChange={(e) => handleUniversityChange(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/15 transition appearance-none cursor-pointer pr-10"
                        >
                          {UNIVERSITY_OPTIONS.map((uni) => (
                            <option key={uni.name} value={uni.name}>
                              {uni.name} ({uni.shortName})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown 2: Select Faculty */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span>🏢 Select Faculty (පීඨය):</span>
                        <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedFaculty}
                          onChange={(e) => setSelectedFaculty(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/15 transition appearance-none cursor-pointer pr-10"
                        >
                          {activeUniObj.faculties.map((fac) => (
                            <option key={fac} value={fac}>
                              {fac}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown 3: Academic Year */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span>📅 Select Academic Year (අධ්‍යයන වර්ෂය):</span>
                        <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/15 transition appearance-none cursor-pointer pr-10"
                        >
                          <option value={1}>1st Year (පළමු වසර - Fresher / Foundation)</option>
                          <option value={2}>2nd Year (දෙවන වසර - Core Modules)</option>
                          <option value={3}>3rd Year (තෙවන වසර - Specialization & Internship)</option>
                          <option value={4}>4th Year / Final Year (අවසන් වසර - Thesis / Capstone)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls (Back, Next / Finish) */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <span>{language === 'si' ? 'ඊළඟ පියවර' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>
                      {language === 'si'
                        ? '🚀 අධ්‍යයනය ආරම්භ කරන්න'
                        : '🚀 Start Learning Dashboard'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl w-full mx-auto text-center py-2">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          SIPARANA Global AI Education Ecosystem • 100% Scientific & National Curriculum Aligned
        </p>
      </footer>
    </div>
  );
}
