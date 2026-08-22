import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  School,
  Building2,
  Landmark,
  Eye,
  EyeOff,
  Zap,
  KeyRound,
  FileCheck,
  Video,
  Info,
  Globe,
  Check,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Laptop,
  Compass,
  Award,
  BadgeCheck,
  PenTool,
  Pencil,
  Layers
} from 'lucide-react';
import { useAuth, type DemoPresetKey } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/data/translations';
import { SRI_LANKA_DISTRICTS, SCHOOL_GRADES } from '@/data/mockData';
import { UNIVERSITIES_DATA } from '@/data/universityData';
import type { Stream, ExamLevel, SchoolGrade, StudentCategory } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { soundFX } from '@/utils/audioUtils';

function GoogleLogoIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthPage() {
  const { login, register, loginAsDemo, loginWithGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();

  // Primary Tabs: 'signin' (default login) | 'register' (create account)
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Interactive Explorer Modals
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  // Sign In form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Google Modal & quick auth state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Register form state
  const [studentCategory, setStudentCategory] = useState<StudentCategory>('School');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // School registration specific
  const [grade, setGrade] = useState<SchoolGrade>(12);
  const [stream, setStream] = useState<Stream>('Physical Science (Maths)');
  const [district, setDistrict] = useState('Colombo');
  const [school, setSchool] = useState('');
  const [targetYear, setTargetYear] = useState(2026);

  // University specific registration state
  const [selectedUniId, setSelectedUniId] = useState('uom');
  const [selectedFacultyId, setSelectedFacultyId] = useState('uom_eng');
  const [selectedDegreeCode, setSelectedDegreeCode] = useState('ENG-CSE');
  const [academicYear, setAcademicYear] = useState(1);
  const [academicSemester, setAcademicSemester] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const currentUni = UNIVERSITIES_DATA.find((u) => u.id === selectedUniId) || UNIVERSITIES_DATA[0];
  const currentFaculty =
    currentUni.faculties.find((f) => f.id === selectedFacultyId) || currentUni.faculties[0];
  const availableDegrees = currentFaculty ? currentFaculty.degrees : [];

  const handleUniversityChange = (uniId: string) => {
    setSelectedUniId(uniId);
    const uni = UNIVERSITIES_DATA.find((u) => u.id === uniId);
    if (uni && uni.faculties.length > 0) {
      setSelectedFacultyId(uni.faculties[0].id);
      if (uni.faculties[0].degrees.length > 0) {
        setSelectedDegreeCode(uni.faculties[0].degrees[0].code);
      }
    }
  };

  const handleFacultyChange = (facId: string) => {
    setSelectedFacultyId(facId);
    const fac = currentUni.faculties.find((f) => f.id === facId);
    if (fac && fac.degrees.length > 0) {
      setSelectedDegreeCode(fac.degrees[0].code);
    }
  };

  const handleGradeChange = (newGrade: SchoolGrade) => {
    setGrade(newGrade);
    if (newGrade <= 9) {
      setStream('Junior Secondary (Grade 6-9)');
      setTargetYear(2028);
    } else if (newGrade <= 11) {
      setStream('General O/L');
      setTargetYear(newGrade === 11 ? 2026 : 2027);
    } else {
      if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)') {
        setStream('Physical Science (Maths)');
      }
      setTargetYear(newGrade === 13 ? 2026 : 2027);
    }
  };

  const handleGoogleLoginDirect = async (
    customEmail?: string,
    customName?: string,
    customCat?: StudentCategory
  ) => {
    setErrorMessage('');
    setSuccessNotice('');
    setGoogleLoading(true);
    try {
      const emailToUse = customEmail || 'subashheshan009@gmail.com';
      const nameToUse =
        customName ||
        (emailToUse.includes('heshan') || emailToUse.includes('subash')
          ? 'Heshan Subasinghe'
          : emailToUse.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '));
      const catToUse = customCat || studentCategory;

      soundFX.playCorrect();
      const res = await loginWithGoogle({
        email: emailToUse,
        name: nameToUse,
        category: catToUse,
        grade: catToUse === 'School' ? 12 : undefined,
        stream: catToUse === 'School' ? 'Physical Science (Maths)' : undefined,
        universityId: catToUse === 'University' ? 'uom' : undefined,
        degreeCode: catToUse === 'University' ? 'ENG-CSE' : undefined
      });

      if (!res.success) {
        soundFX.playIncorrect();
        setErrorMessage(res.error || (language === 'si' ? 'Google පිවිසුම අසාර්ථක විය.' : language === 'ta' ? 'Google உள்நுழைவு தோல்வியடைந்தது.' : 'Google sign in failed.'));
      }
    } catch {
      soundFX.playIncorrect();
      setErrorMessage(language === 'si' ? 'Google පිවිසුමේදී දෝෂයක් සිදුවිය.' : language === 'ta' ? 'Google உள்நுழைவு பிழை.' : 'Error during Google sign in.');
    } finally {
      setGoogleLoading(false);
      setShowGoogleModal(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!loginIdentifier.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ ඊමේල් ලිපිනය හෝ දුරකථන අංකය ඇතුළත් කරන්න.' : language === 'ta' ? 'தயவுசெய்து உங்கள் மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your email or phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier.trim(), loginPassword);
      if (!res.success) {
        soundFX.playIncorrect();
        setErrorMessage(res.error || (language === 'si' ? 'පිවිසුම අසාර්ථක විය. කරුණාකර තොරතුරු පරීක්ෂා කරන්න.' : language === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களைச் சரிபார்க்கவும்.' : 'Login failed. Please check your credentials.'));
      } else {
        soundFX.playCorrect();
      }
    } catch {
      soundFX.playIncorrect();
      setErrorMessage(language === 'si' ? 'පිවිසීමේ දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'உள்நுழைவு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!name.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.' : language === 'ta' ? 'தயவுசெய்து உங்கள் முழுப்பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඊමේල් ලිපිනය හෝ දුරකථන අංකය ඇතුළත් කරන්න.' : language === 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please provide either an email or phone number.');
      return;
    }

    if (password && password.length < 6) {
      setErrorMessage(language === 'si' ? 'මුරපදය සඳහා අවම වශයෙන් අක්ෂර 6ක්වත් තිබිය යුතුය.' : language === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்களைக் கொண்டிருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMessage(language === 'si' ? 'මුරපද ද්විත්වය සමාන නොවේ.' : language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை.' : 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const defaultEmail = `${phone.replace(/[^0-9]/g, '') || 'student'}@siparana.lk`;
      const isUniversity = studentCategory === 'University';
      const calculatedLevel: ExamLevel = grade <= 9 ? 'JUNIOR' : grade <= 11 ? 'OL' : 'AL';

      if (isUniversity) {
        const degreeInfo = availableDegrees.find((d) => d.code === selectedDegreeCode);
        const res = await register({
          name: name.trim(),
          email: email.trim() || defaultEmail,
          phone: phone.trim(),
          password,
          studentCategory: 'University',
          university: currentUni.name,
          faculty: currentFaculty.name,
          degreeProgramme: degreeInfo?.title || 'B.Sc. (Hons) in Computer Science & Engineering',
          degreeCode: selectedDegreeCode,
          academicYear,
          academicSemester,
          medium: 'English',
          district
        });

        if (!res.success) {
          soundFX.playIncorrect();
          setErrorMessage(res.error || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථක විය.' : language === 'ta' ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.'));
        } else {
          soundFX.playLevelUp();
        }
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim() || defaultEmail,
          phone: phone.trim(),
          password,
          studentCategory: 'School',
          grade,
          level: calculatedLevel,
          stream,
          district,
          school: school.trim() || 'Sri Lanka Model National School',
          targetYear,
          medium: 'Sinhala',
        });

        if (!res.success) {
          soundFX.playIncorrect();
          setErrorMessage(res.error || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථක විය.' : language === 'ta' ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.'));
        } else {
          soundFX.playLevelUp();
        }
      }
    } catch {
      soundFX.playIncorrect();
      setErrorMessage(language === 'si' ? 'ලියාපදිංචි වීමේ දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'பதிவு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Registration error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (key: DemoPresetKey) => {
    soundFX.playCorrect();
    loginAsDemo(key);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-200">
      {/* Subtle clean decorative background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-amber-100/50 rounded-full blur-3xl -translate-x-1/3" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-50/70 rounded-full blur-3xl translate-y-1/3" />
      </div>

      {/* TOP BAR: Clean Modern Header with Siparana Official Logo & Trilingual Language Selector */}
      <header className="relative z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Official High-Resolution Siparana Logo Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl p-1 shadow-sm border-2 border-amber-300/80 flex items-center justify-center">
              <SiparanaLogo variant="mark" size="md" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-wider uppercase font-serif text-blue-950">
                  SIPARANA
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                  LK
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300/90 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500" /> NIE & UGC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold hidden sm:block leading-tight">
                {language === 'si'
                  ? 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන සහ සරසවි ඩිජිටල් පද්ධතිය'
                  : language === 'ta'
                  ? 'இலங்கை தேசிய கல்வி & பல்கலைக்கழக தளம்'
                  : 'Sri Lanka National Education & Degree Ecosystem'}
              </p>
            </div>
          </div>

          {/* Duolingo-style Modern Trilingual Language Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/90 shadow-inner">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-btn-${lang.code}`}
                  onClick={() => {
                    soundFX.playCorrect();
                    setLanguage(lang.code as AppLanguage);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-black scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: Clean, Spacious, 2-Column Responsive Layout */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: 3D Mascot Character Welcome & Interactive Platform Cards */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            {/* 3D Mascot Card with Heshan Badge */}
            <div className="relative group w-full max-w-md">
              {/* Outer soft glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 to-blue-400/30 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative bg-white p-3.5 rounded-3xl border-2 border-amber-300/80 shadow-[0_8px_0_0_#fcd34d] flex items-center gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 flex-shrink-0 shadow-inner">
                  <img
                    src={mascotImage}
                    alt="SipArana 3D Mascot"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-left pr-2 flex-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                    Welcome to SipArana !
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Free National Curriculum & University AI Learning Portal.
                  </p>
                  {/* Crystal Clear Owner Badge */}
                  <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 text-xs font-black text-blue-900 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="tracking-wide">Owner - Heshan</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* FULLY INTERACTIVE EXPLORATION CARDS WITH HIGH-QUALITY BLUE & GOLD ICONS */}
            <div className="w-full space-y-3 text-xs text-slate-600 font-medium max-w-md">
              {/* Card 1: School Syllabus & Past Papers (Open Book with Pen) */}
              <button
                type="button"
                id="interactive-school-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(true);
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-amber-50/40 border-2 border-slate-200/90 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  {/* High-Quality Icon 1: Crisp Open Book with Study Pen */}
                  <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-0.5 shadow-sm border border-blue-400/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-full rounded-[14px] bg-blue-600/90 flex items-center justify-center relative overflow-hidden">
                      {/* Subtle gold inner aura */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-amber-300/20" />
                      <BookOpen className="w-5 h-5 text-white drop-shadow-xs" />
                      {/* Gold Pen Accent Badge at top right */}
                      <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border border-white shadow-xs flex items-center justify-center">
                        <PenTool className="w-2.5 h-2.5 text-slate-950 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] group-hover:text-blue-950 leading-tight">
                      {language === 'si'
                        ? 'පාසල් 6–13 (O/L, A/L) සියලුම විෂය නිර්දේශ'
                        : 'Grades 6–13 NIE Syllabus & Past Papers'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'Combined Maths, Bio, Commerce, O/L ➔' : 'Explore Subjects & Past Papers ➔'}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-[10px] sm:text-[11px] border border-blue-200/80 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 shadow-2xs transition-all flex-shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Card 2: University Degree Hub (Graduation Cap over University Building) */}
              <button
                type="button"
                id="interactive-uni-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowUniModal(true);
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-amber-50/40 border-2 border-slate-200/90 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  {/* High-Quality Icon 2: Graduation Cap over University Building */}
                  <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-900 p-0.5 shadow-sm border border-amber-400/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-full rounded-[14px] bg-slate-900/90 flex items-center justify-center relative overflow-hidden">
                      {/* Gold aura */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/15 to-amber-400/25" />
                      {/* University Building base */}
                      <Landmark className="w-5 h-5 text-indigo-200 drop-shadow-xs translate-y-0.5" />
                      {/* Radiant Golden Graduation Cap Header */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-white shadow-xs flex items-center justify-center">
                        <GraduationCap className="w-3 h-3 text-slate-950 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] group-hover:text-indigo-950 leading-tight">
                      {language === 'si'
                        ? 'මොරටුව, කොළඹ, ජයවර්ධනපුර සරසවි AI Degree Assist'
                        : 'University Degree Hub (UoM, UoC, USJ, UoP)'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'B.Sc. Engineering, Medicine, IT, Mgmt ➔' : 'State University Degree Modules ➔'}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-[10px] sm:text-[11px] border border-indigo-200/80 flex items-center gap-1 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-2xs transition-all flex-shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Card 3: Free & Verified Standards (Shield with Certificate Badge) */}
              <button
                type="button"
                id="interactive-verified-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowVerifiedModal(true);
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-emerald-50/70 hover:to-amber-50/40 border-2 border-slate-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  {/* High-Quality Icon 3: Shield with Certificate Gold Seal */}
                  <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800 p-0.5 shadow-sm border border-emerald-400/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-full rounded-[14px] bg-emerald-600/90 flex items-center justify-center relative overflow-hidden">
                      {/* Radiant gold glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-amber-300/25" />
                      {/* Shield */}
                      <ShieldCheck className="w-5 h-5 text-white drop-shadow-xs" />
                      {/* Golden Certificate Badge at top right */}
                      <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border border-white shadow-xs flex items-center justify-center">
                        <Award className="w-2.5 h-2.5 text-slate-950 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] group-hover:text-emerald-950 leading-tight">
                      {language === 'si'
                        ? '100% නොමිලේ, ආරක්ෂිත සහ රාජ්‍ය ප්‍රමිතීන්ට අනුකූලයි'
                        : '100% Free & Verified for Sri Lankan Students'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'NIE සහ UGC ප්‍රමිතීන් පරීක්ෂා කරන්න' : 'NIE & UGC Certified Learning'}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-[10px] sm:text-[11px] border border-emerald-200/80 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 shadow-2xs transition-all flex-shrink-0">
                  <span>Verified</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Pristine, Modern Clean Auth Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] p-6 sm:p-8 space-y-5">
              
              {/* PRIMARY 1-CLICK ACTION: Duolingo-style Tactile "Continue with Google" Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  id="google-primary-btn"
                  onClick={() => handleGoogleLoginDirect('subashheshan009@gmail.com', 'Heshan Subasinghe')}
                  disabled={googleLoading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm sm:text-base border-2 border-slate-300 shadow-[0_4px_0_0_#cbd5e1] hover:shadow-[0_2px_0_0_#cbd5e1] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <GoogleLogoIcon className="w-5 h-5 flex-shrink-0" />
                      <span>
                        {language === 'si' ? 'Google සමඟින් ක්ෂණිකව පිවිසෙන්න' : language === 'ta' ? 'Google மூலம் தொடரவும்' : 'Continue with Google'}
                      </span>
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 hidden sm:inline">
                        1-Click
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified: subashheshan009@gmail.com
                  </span>
                  <button
                    type="button"
                    id="switch-google-account-btn"
                    onClick={() => setShowGoogleModal(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    {language === 'si' ? 'වෙනත් ගිණුමක් ▾' : 'Switch Google Account ▾'}
                  </button>
                </div>
              </div>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider absolute">
                  {language === 'si' ? 'හෝ' : language === 'ta' ? 'அல்லது' : 'or'}
                </span>
              </div>

              {/* Modern Rounded Tab Segmented Switcher */}
              <div className="grid grid-cols-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5">
                <button
                  type="button"
                  id="tab-signin-toggle"
                  onClick={() => {
                    soundFX.playCorrect();
                    setActiveTab('signin');
                    setErrorMessage('');
                    setSuccessNotice('');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'bg-white text-blue-900 shadow-sm border border-slate-200/90 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>{language === 'si' ? 'පිවිසෙන්න' : language === 'ta' ? 'உள்நுழை' : 'Sign In'}</span>
                </button>

                <button
                  type="button"
                  id="tab-register-toggle"
                  onClick={() => {
                    soundFX.playCorrect();
                    setActiveTab('register');
                    setErrorMessage('');
                    setSuccessNotice('');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-blue-900 shadow-sm border border-slate-200/90 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'si' ? 'ලියාපදිංචිය' : language === 'ta' ? 'பதிவு' : 'Register'}</span>
                </button>
              </div>

              {/* Alert Feedback Notifications */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Info className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* TAB 1: CLEAN SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'si' ? 'ඊමේල් ලිපිනය හෝ දුරකථන අංකය' : language === 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்' : 'Email Address or Phone Number'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="signin-identifier-input"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={language === 'si' ? 'උදා: student@gmail.com හෝ 0771234567' : 'student@gmail.com or 0771234567'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        {language === 'si' ? 'මුරපදය (Password)' : language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                      >
                        {language === 'si' ? 'මුරපදය අමතකද?' : language === 'ta' ? 'கடவுச்சொல் மறந்ததா?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="signin-password-input"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{language === 'si' ? 'මාව මතක තබාගන්න' : language === 'ta' ? 'என்னை நினைவில் கொள்க' : 'Remember me'}</span>
                    </label>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> SSL Secured
                    </span>
                  </div>

                  <button
                    id="signin-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold rounded-2xl shadow-[0_4px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{language === 'si' ? 'ගිණුමට පිවිසෙන්න' : language === 'ta' ? 'உள்நுழைக' : 'Sign In to SipArana'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: CLEAN REGISTER NEW STUDENT */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Category Switch: School vs University */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'si' ? 'ශිෂ්‍ය කාණ්ඩය තෝරන්න:' : language === 'ta' ? 'மாணவர் பிரிவு:' : 'Select Category:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="reg-category-school"
                        onClick={() => setStudentCategory('School')}
                        className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                          studentCategory === 'School'
                            ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            studentCategory === 'School' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <School className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-slate-900">
                            {language === 'si' ? 'පාසල් (6–13)' : language === 'ta' ? 'பாடசாலை' : 'School Student'}
                          </span>
                          <span className="text-[10px] text-slate-500">O/L, A/L</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        id="reg-category-uni"
                        onClick={() => setStudentCategory('University')}
                        className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                          studentCategory === 'University'
                            ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            studentCategory === 'University' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-slate-900">
                            {language === 'si' ? 'සරසවි උපාධි' : language === 'ta' ? 'பல்கலைக்கழக' : 'University Undergrad'}
                          </span>
                          <span className="text-[10px] text-slate-500">UoM, UoC, USJ</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'සම්පූර්ණ නම' : language === 'ta' ? 'முழுப்பெயர்' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="reg-name-input"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Heshan Subasinghe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'ඊමේල් ලිපිනය හෝ දුරකථනය' : language === 'ta' ? 'மின்னஞ்சல்' : 'Email or Phone'}
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="reg-email-input"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'මුරපදය' : language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="reg-password-input"
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'මුරපදය තහවුරු කරන්න' : language === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்துக' : 'Confirm Password'}
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="reg-confirm-password-input"
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Details */}
                  {studentCategory === 'School' ? (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'ශ්‍රේණිය (Grade 6–13)' : language === 'ta' ? 'தரம்' : 'Grade (6–13)'}
                          </label>
                          <select
                            id="reg-grade-select"
                            value={grade}
                            onChange={(e) => handleGradeChange(Number(e.target.value) as SchoolGrade)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                          >
                            {SCHOOL_GRADES.map((g) => (
                              <option key={g.grade} value={g.grade}>
                                {g.nameSinhala} ({g.stage})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'විෂය ධාරාව (Stream)' : language === 'ta' ? 'பாடப்பிரிவு' : 'Stream'}
                          </label>
                          <select
                            id="reg-stream-select"
                            value={stream}
                            onChange={(e) => setStream(e.target.value as Stream)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                          >
                            {grade >= 12 ? (
                              <>
                                <option value="Physical Science (Maths)">Physical Science (Maths)</option>
                                <option value="Biological Science">Biological Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Technology">Technology</option>
                                <option value="Arts">Arts</option>
                              </>
                            ) : grade >= 10 ? (
                              <option value="General O/L">General O/L (Grades 10–11)</option>
                            ) : (
                              <option value="Junior Secondary (Grade 6-9)">Junior Secondary (Grades 6–9)</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'දිස්ත්‍රික්කය' : language === 'ta' ? 'மாவட்டம்' : 'District'}
                          </label>
                          <select
                            id="reg-district-select"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                          >
                            {SRI_LANKA_DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'රාජ්‍ය විශ්වවිද්‍යාලය' : language === 'ta' ? 'பல்கலைக்கழகம்' : 'State University'}
                          </label>
                          <select
                            id="reg-uni-select"
                            value={selectedUniId}
                            onChange={(e) => handleUniversityChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                          >
                            {UNIVERSITIES_DATA.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.shortName} - {u.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'පීඨය (Faculty)' : language === 'ta' ? 'பீடம்' : 'Faculty'}
                          </label>
                          <select
                            id="reg-faculty-select"
                            value={selectedFacultyId}
                            onChange={(e) => handleFacultyChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                          >
                            {currentUni.faculties.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'උපාධි පාඨමාලාව (Degree Programme)' : language === 'ta' ? 'பட்டப் படிப்பு' : 'Degree Programme'}
                        </label>
                        <select
                          id="reg-degree-select"
                          value={selectedDegreeCode}
                          onChange={(e) => setSelectedDegreeCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white"
                        >
                          {availableDegrees.map((deg) => (
                            <option key={deg.code} value={deg.code}>
                              [{deg.code}] {deg.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    id="register-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl shadow-[0_4px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න' : language === 'ta' ? 'இலவசமாக பதிவு செய்க' : 'Create Free Student Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* INTERACTIVE MODAL 1: SCHOOL EXPLORATION QUICK LAUNCHER */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 max-w-lg w-full p-6 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    පාසල් විෂය නිර්දේශ සහ පසුගිය ප්‍රශ්න පත්‍ර
                  </h4>
                  <p className="text-xs text-slate-500">Grades 6–13 National NIE Curriculum Portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ඔබට අවශ්‍ය විෂය ධාරාව තෝරා ක්ෂණිකව සියලුම පාඩම් මාලා, පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ AI සහාය පරිශීලනය කරන්න:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(false);
                  loginAsDemo('maths');
                }}
                className="p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/90 border border-blue-200 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-950">📐 A/L Maths</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Launch</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-1 font-medium">Combined Maths, Physics, Chemistry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(false);
                  loginAsDemo('bio');
                }}
                className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/90 border border-emerald-200 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950">🧬 A/L Bio</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Launch</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-1 font-medium">Biology, Physics, Chemistry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(false);
                  loginAsDemo('ol');
                }}
                className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/90 border border-purple-200 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-950">📝 Grade 10–11 O/L</span>
                  <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">Launch</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-1 font-medium">Maths, Science, History, Sinhala</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(false);
                  loginAsDemo('junior');
                }}
                className="p-3 rounded-2xl bg-teal-50/70 hover:bg-teal-100/90 border border-teal-200 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-950">📘 Grades 6–9 Junior</span>
                  <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">Launch</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-1 font-medium">Junior Science, Maths, English</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                වසන්න (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL 2: UNIVERSITY DEGREE HUB QUICK LAUNCHER */}
      {showUniModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 max-w-lg w-full p-6 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    ශ්‍රී ලංකා රාජ්‍ය විශ්වවිද්‍යාල AI Degree Portal
                  </h4>
                  <p className="text-xs text-slate-500">UGC State University Undergraduate Ecosystem</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUniModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              මොරටුව, කොළඹ, ජයවර්ධනපුර ඇතුළු ශ්‍රී ලංකාවේ ප්‍රමුඛ සරසවිවල උපාධි පාඨමාලා මොඩියුල, AI පර්යේෂණ සහාය සහ විභාග මඟපෙන්වීම්:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFX.playLevelUp();
                  setShowUniModal(false);
                  loginAsDemo('uni_cse');
                }}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/90 border border-purple-200 text-left transition cursor-pointer"
              >
                <span className="text-xs font-black text-purple-950 block">🏛️ UoM Moratuwa</span>
                <span className="text-xs font-bold text-slate-800 block">B.Sc. Eng (CSE)</span>
                <span className="text-[10px] text-purple-700 font-semibold mt-1 block">Explore Modules ➔</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLevelUp();
                  setShowUniModal(false);
                  loginAsDemo('uni_med');
                }}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200 text-left transition cursor-pointer"
              >
                <span className="text-xs font-black text-blue-950 block">🩺 UoC Colombo</span>
                <span className="text-xs font-bold text-slate-800 block">MBBS Medicine</span>
                <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Clinical Assist ➔</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLevelUp();
                  setShowUniModal(false);
                  loginAsDemo('uni_fin');
                }}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-left transition cursor-pointer"
              >
                <span className="text-xs font-black text-emerald-950 block">📈 USJ J'pura</span>
                <span className="text-xs font-bold text-slate-800 block">B.Sc. Finance</span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Management AI ➔</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowUniModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                වසන්න (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL 3: VERIFIED EDUCATIONAL STANDARDS */}
      {showVerifiedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  100% නොමිලේ & රාජ්‍ය ප්‍රමිති සහතිකය
                </h4>
                <p className="text-xs text-slate-500">Official Educational Verification</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900">ජාතික අධ්‍යාපන ආයතනය (NIE)</span>
                  <p className="text-slate-500 text-[11px]">ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයන්ට 100% ක් අනුකූල වේ.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900">විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාව (UGC)</span>
                  <p className="text-slate-500 text-[11px]">රාජ්‍ය විශ්වවිද්‍යාල උපාධි මොඩියුල හා විෂය ඒකක සමඟ සම්බන්ධයි.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900">දිවයිනේ සියලුම දිස්ත්‍රික්ක 25 සඳහාම නොමිලේ</span>
                  <p className="text-slate-500 text-[11px]">සැමට සමාන ගුණාත්මක ඩිජිටල් අධ්‍යාපන අයිතිය තහවුරු කරයි.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowVerifiedModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                තේරුම් ගත්තා (OK)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Account Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                  <GoogleLogoIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Google ගිණුම තෝරන්න</h4>
                  <p className="text-xs text-slate-500">Choose an account for SipArana</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 transition space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Heshan"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900">Heshan Subasinghe</h5>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">subashheshan009@gmail.com</p>
                </div>
              </div>

              <button
                type="button"
                id="google-modal-heshan-btn"
                onClick={() => handleGoogleLoginDirect('subashheshan009@gmail.com', 'Heshan Subasinghe')}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>මෙම ගිණුමෙන් පිවිසෙන්න (Sign in with subashheshan009)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Google Email Option */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                වෙනත් Google ලිපිනයක් ඇතුළත් කරන්න:
              </span>
              <div className="space-y-2">
                <input
                  type="email"
                  id="custom-google-email-input"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white"
                />
                {customGoogleEmail && (
                  <button
                    type="button"
                    onClick={() => handleGoogleLoginDirect(customGoogleEmail, customGoogleEmail.split('@')[0])}
                    disabled={googleLoading}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{customGoogleEmail} සමඟින් පිවිසෙන්න</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                අවලංගු කරන්න (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">මුරපදය නැවත සකසන්න</h4>
                <p className="text-xs text-slate-500">Quick Access & Password Recovery</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ඔබට ඔබගේ මුරපදය අමතක වී ඇත්නම්, ක්ෂණිකව Google ගිණුමෙන් හෝ 1-Click Fast Student Demo ගිණුම් භාවිතයෙන් ලොග් විය හැක.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                තේරුම් ගත්තා (OK)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER: Minimalist, Clean & Refined */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500">
            © 2026 SipArana Educational Platform. Aligned with Sri Lankan National NIE Curriculum & UGC University Ecosystem.
          </p>
          <div className="flex gap-4 text-xs font-bold text-slate-600">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setLanguage('si')}>සිංහල</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setLanguage('ta')}>தமிழ்</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setLanguage('en')}>English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
