import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
  School,
  Building2,
  Landmark,
  GraduationCap,
  Award,
  PenTool,
  Check,
  Globe,
  Layers,
  MapPin,
  Compass,
  Info,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/data/translations';
import { SRI_LANKA_DISTRICTS, SCHOOL_GRADES } from '@/data/mockData';
import { UNIVERSITIES_DATA } from '@/data/universityData';
import type { Stream, ExamLevel, SchoolGrade, StudentCategory, Medium } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { soundFX } from '@/utils/audioUtils';

export default function AuthPage() {
  const { simpleLogin } = useAuth();
  const { language, setLanguage } = useLanguage();

  // Interactive Explorer Modals
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  // Unified Single-Step Form State
  const [username, setUsername] = useState('');
  const [studentCategory, setStudentCategory] = useState<StudentCategory>('School');
  
  // School Student State
  const [grade, setGrade] = useState<SchoolGrade>(12);
  const [stream, setStream] = useState<Stream>('Physical Science (Maths)');
  const [district, setDistrict] = useState('Colombo');
  const [medium, setMedium] = useState<Medium>('Sinhala');
  const [schoolName, setSchoolName] = useState('');

  // University Student State
  const [selectedUniId, setSelectedUniId] = useState('uom');
  const [selectedFacultyId, setSelectedFacultyId] = useState('uom_eng');
  const [selectedDegreeCode, setSelectedDegreeCode] = useState('ENG-CSE');
  const [academicYear, setAcademicYear] = useState(1);
  const [academicSemester, setAcademicSemester] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // University helpers
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
    } else if (newGrade <= 11) {
      setStream('General O/L');
    } else {
      if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)') {
        setStream('Physical Science (Maths)');
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      soundFX.playIncorrect();
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර ඔබගේ නම (Username) ඇතුළත් කරන්න.'
          : language === 'ta'
          ? 'தயவுசெய்து உங்கள் பெயரை (பயனர்பெயர்) உள்ளிடவும்.'
          : 'Please enter your username / student name.'
      );
      return;
    }

    setLoading(true);
    try {
      if (studentCategory === 'University') {
        const degreeInfo = availableDegrees.find((d) => d.code === selectedDegreeCode);
        const res = await simpleLogin({
          name: cleanUsername,
          studentCategory: 'University',
          university: currentUni.name,
          faculty: currentFaculty.name,
          degreeProgramme: degreeInfo?.title || 'B.Sc. (Hons) in Computer Science & Engineering',
          degreeCode: selectedDegreeCode,
          academicYear,
          academicSemester,
          medium: medium || 'English',
          district
        });

        if (!res.success) {
          soundFX.playIncorrect();
          setErrorMessage(res.error || 'Login failed');
        } else {
          soundFX.playLevelUp();
        }
      } else {
        const res = await simpleLogin({
          name: cleanUsername,
          studentCategory: 'School',
          grade,
          stream,
          district,
          medium,
          school: schoolName.trim() || 'Sri Lanka National Model School',
          targetYear: grade === 11 ? 2026 : grade === 13 ? 2026 : 2027
        });

        if (!res.success) {
          soundFX.playIncorrect();
          setErrorMessage(res.error || 'Login failed');
        } else {
          soundFX.playLevelUp();
        }
      }
    } catch {
      soundFX.playIncorrect();
      setErrorMessage(
        language === 'si'
          ? 'ඇතුළු වීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedGradeInfo = SCHOOL_GRADES.find((g) => g.grade === grade);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-200">
      {/* Background ambient decorative glows */}
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

          {/* Trilingual Language Selector Buttons */}
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
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Mascot & Highlights */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            {/* Mascot Card */}
            <div className="relative group w-full max-w-md">
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
                  <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 text-xs font-black text-blue-900 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="tracking-wide">Owner - Heshan</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Feature Exploration Cards */}
            <div className="w-full space-y-2.5 text-xs text-slate-600 font-medium max-w-md">
              {/* Card 1: School Syllabus & Past Papers */}
              <button
                type="button"
                id="interactive-school-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowSchoolModal(true);
                }}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-blue-50/50 border-2 border-slate-200/90 hover:border-blue-500 shadow-2xs transition flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-xs flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] leading-tight">
                      {language === 'si'
                        ? 'පාසල් 6–13 (O/L, A/L) සියලුම විෂය නිර්දේශ'
                        : 'Grades 6–13 NIE Syllabus & Past Papers'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'Combined Maths, Bio, Commerce, O/L' : 'Explore Subjects & Past Papers'}
                    </span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white transition">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Card 2: University Degree Hub */}
              <button
                type="button"
                id="interactive-uni-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowUniModal(true);
                }}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border-2 border-slate-200/90 hover:border-indigo-500 shadow-2xs transition flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 p-0.5 shadow-xs flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] leading-tight">
                      {language === 'si'
                        ? 'මොරටුව, කොළඹ, ජයවර්ධනපුර සරසවි AI Portal'
                        : 'University Degree Hub (UoM, UoC, USJ)'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'B.Sc. Engineering, Medicine, IT, Mgmt' : 'State University Degree Modules'}
                    </span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[10px] border border-indigo-200 flex items-center gap-1 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Card 3: Free & Verified */}
              <button
                type="button"
                id="interactive-verified-card"
                onClick={() => {
                  soundFX.playCorrect();
                  setShowVerifiedModal(true);
                }}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-slate-200/90 hover:border-emerald-500 shadow-2xs transition flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-0.5 shadow-xs flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] leading-tight">
                      {language === 'si'
                        ? '100% නොමිලේ, රාජ්‍ය ප්‍රමිතීන්ට අනුකූලයි'
                        : '100% Free & Verified NIE & UGC Standards'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {language === 'si' ? 'ජාතික අධ්‍යාපන ආයතන සම්මතයන්' : 'National Curriculum Aligned'}
                    </span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <span>Info</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Unified, 1-Step Direct Entrance Login Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] p-6 sm:p-7 space-y-5">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>
                    {language === 'si'
                      ? 'යෙදුමට ඇතුළු වන්න (Student Login)'
                      : language === 'ta'
                      ? 'உள்நுழைக (Student Login)'
                      : 'Enter SipArana Portal'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {language === 'si'
                    ? 'නම සහ ශ්‍රේණිය/විෂය ධාරාව තෝරා කෙලින්ම යෙදුමට පිවිසෙන්න.'
                    : language === 'ta'
                    ? 'பெயர் மற்றும் தரத்தைத் தேர்ந்தெடுத்து தொடரவும்.'
                    : 'Enter your name and select your curriculum to get started.'}
                </p>
              </div>

              {/* Error feedback alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Info className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* 1. USERNAME INPUT FIELD */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{language === 'si' ? 'නම (Username / Student Name)' : language === 'ta' ? 'பெயர் (Student Name)' : 'Username / Student Name'}</span>
                      <span className="text-red-500 font-black">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {language === 'si' ? 'ඕනෑම නමක් ඇතුළත් කළ හැක' : 'Any name'}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="student-username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={language === 'si' ? 'උදා: කසුන් පෙරේරා / Heshan Subasinghe' : 'e.g. Kasun Perera / Heshan'}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-inner"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* 2. SELECT CATEGORY: School Student vs University Undergrad */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {language === 'si' ? 'ශිෂ්‍ය කාණ්ඩය තෝරන්න (Select Category):' : language === 'ta' ? 'பிரிவு (Select Category):' : 'Select Category:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="category-school-btn"
                      onClick={() => {
                        soundFX.playCorrect();
                        setStudentCategory('School');
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                        studentCategory === 'School'
                          ? 'bg-blue-50/90 border-blue-600 text-blue-950 font-bold shadow-xs scale-101'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl flex-shrink-0 ${
                          studentCategory === 'School' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-black block text-slate-900">
                          {language === 'si' ? 'School Student' : 'School Student'}
                        </span>
                        <span className="text-[11px] text-blue-700 font-bold">
                          (O/L, A/L • 6–13)
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="category-uni-btn"
                      onClick={() => {
                        soundFX.playCorrect();
                        setStudentCategory('University');
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                        studentCategory === 'University'
                          ? 'bg-indigo-50/90 border-indigo-600 text-indigo-950 font-bold shadow-xs scale-101'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl flex-shrink-0 ${
                          studentCategory === 'University' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-black block text-slate-900">
                          {language === 'si' ? 'University Undergrad' : 'University Undergrad'}
                        </span>
                        <span className="text-[11px] text-indigo-700 font-bold">
                          (UoM, UoC, USJ, UoP)
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. CONDITIONAL FORM FIELDS: SCHOOL (Grade 6-13 & Stream) OR UNIVERSITY */}
                {studentCategory === 'School' ? (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    
                    {/* Grade Selector (6 - 13) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span>{language === 'si' ? 'ශ්‍රේණිය තෝරන්න (Grade 6–13):' : 'Select Grade (6–13):'}</span>
                        </label>
                        <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                          {selectedGradeInfo?.nameSinhala} ({selectedGradeInfo?.stage})
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {SCHOOL_GRADES.map((g) => {
                          const isSelected = grade === g.grade;
                          return (
                            <button
                              key={g.grade}
                              type="button"
                              id={`grade-btn-${g.grade}`}
                              onClick={() => {
                                soundFX.playCorrect();
                                handleGradeChange(g.grade);
                              }}
                              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105 font-black'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                              }`}
                            >
                              <span className="text-sm font-extrabold">{g.grade}</span>
                              <span className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                {g.stage}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stream Selection */}
                    {grade >= 12 ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-amber-600" />
                          <span>{language === 'si' ? 'උසස් පෙළ විෂය ධාරාව (A/L Stream):' : 'A/L Stream:'}</span>
                        </label>
                        <select
                          id="stream-select"
                          value={stream}
                          onChange={(e) => setStream(e.target.value as Stream)}
                          className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Physical Science (Maths)">Physical Science (Combined Maths / භෞතික විද්‍යා)</option>
                          <option value="Biological Science (Bio)">Biological Science (Biology / ජීව විද්‍යා)</option>
                          <option value="Commerce">Commerce (වාණිජ විෂය ධාරාව)</option>
                          <option value="Technology">Technology (තාක්ෂණවේදය - BST / ET / SFT)</option>
                          <option value="Arts">Arts (කලා විෂය ධාරාව)</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span>{language === 'si' ? 'විෂය මාලා ස්ථරය (Curriculum Layer):' : 'Curriculum Layer:'}</span>
                        </label>
                        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between">
                          <span>{grade <= 9 ? 'Junior Secondary (කනිෂ්ඨ ද්විතීයික 6–9)' : 'General O/L (අ.පො.ස. සාමාන්‍ය පෙළ 10–11)'}</span>
                          <span className="text-[11px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                            NIE Core
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Medium & District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{language === 'si' ? 'මාධ්‍යය (Medium):' : 'Medium:'}</span>
                        </label>
                        <select
                          value={medium}
                          onChange={(e) => setMedium(e.target.value as Medium)}
                          className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold text-xs text-slate-800"
                        >
                          <option value="Sinhala">සිංහල මාධ්‍යය (Sinhala)</option>
                          <option value="English">English Medium</option>
                          <option value="Tamil">தமிழ் மூலம் (Tamil)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{language === 'si' ? 'දිස්ත්‍රික්කය (District):' : 'District:'}</span>
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold text-xs text-slate-800"
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
                  /* UNIVERSITY UNDERGRAD FORM FIELDS */
                  <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                        <span>{language === 'si' ? 'විශ්වවිද්‍යාලය (Select University):' : 'Select University:'}</span>
                      </label>
                      <select
                        value={selectedUniId}
                        onChange={(e) => handleUniversityChange(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-indigo-200 font-bold text-xs sm:text-sm text-slate-900"
                      >
                        {UNIVERSITIES_DATA.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.shortName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'පීඨය (Faculty):' : 'Faculty:'}
                        </label>
                        <select
                          value={selectedFacultyId}
                          onChange={(e) => handleFacultyChange(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold text-xs text-slate-800"
                        >
                          {currentUni.faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'උපාධි පාඨමාලාව (Degree):' : 'Degree:'}
                        </label>
                        <select
                          value={selectedDegreeCode}
                          onChange={(e) => setSelectedDegreeCode(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold text-xs text-slate-800"
                        >
                          {availableDegrees.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.shortTitle || d.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Academic Year:
                        </label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(Number(e.target.value))}
                          className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold text-xs text-slate-800"
                        >
                          <option value={1}>Year 1 (Freshman)</option>
                          <option value={2}>Year 2 (Sophomore)</option>
                          <option value={3}>Year 3 (Junior)</option>
                          <option value={4}>Year 4 (Senior / Honours)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Semester:
                        </label>
                        <select
                          value={academicSemester}
                          onChange={(e) => setAcademicSemester(Number(e.target.value))}
                          className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold text-xs text-slate-800"
                        >
                          <option value={1}>Semester 1</option>
                          <option value={2}>Semester 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. "ඇතුල් වන්න" (LOGIN / ENTER) SUBMIT BUTTON */}
                <button
                  id="direct-login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-base rounded-2xl shadow-[0_5px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'si' ? 'ඇතුල් වන්න (Login to SipArana)' : language === 'ta' ? 'உள்நுழைக (Login)' : 'Enter SipArana Portal'}</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'si' ? '100% නොමිලේ • මුරපද හෝ Email අවශ්‍ය නොවේ' : '100% Free • No passwords or emails required'}</span>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/80 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 SipArana LK • Sri Lanka National Curriculum & Degree Ecosystem</span>
          <span className="font-bold text-blue-900">Developed by Heshan Subasinghe</span>
        </div>
      </footer>

      {/* MODAL 1: School Syllabus Explorer Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-blue-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>පාසල් 6–13 (O/L, A/L) විෂය මාලා පද්ධතිය</span>
              </h3>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 max-h-72 overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                <h4 className="font-bold text-blue-900 text-xs">🔹 Grade 12 & 13 A/L Streams</h4>
                <p className="mt-1 text-[11px]">
                  Physical Science (Combined Maths, Physics, Chemistry, ICT), Biological Science, Commerce (Accounting, Econ, BS), Technology (ET, BST, SFT), Arts (Media, Logic, Sinhala, History).
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-xs">🔹 Grade 10 & 11 O/L Core & Basket</h4>
                <p className="mt-1 text-[11px]">
                  Science, Mathematics, Sinhala/Tamil, English, History, Religion, plus Basket 1, 2, 3 subjects with complete past papers.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-bold text-amber-900 text-xs">🔹 Grade 6 to 9 Junior Secondary</h4>
                <p className="mt-1 text-[11px]">
                  Foundational NIE national textbooks, interactive lessons, formulas, and auto-marked quizzes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSchoolModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 cursor-pointer"
            >
              තහවුරුයි (Got it)
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: University Portal Modal */}
      {showUniModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-indigo-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>ශ්‍රී ලංකා සරසවි AI Degree Module Portal</span>
              </h3>
              <button
                onClick={() => setShowUniModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 max-h-72 overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                <h4 className="font-bold text-indigo-900 text-xs">🏛️ State Universities Covered</h4>
                <p className="mt-1 text-[11px]">
                  University of Moratuwa (UoM), University of Colombo (UoC), University of Peradeniya (UoP), University of Sri Jayewardenepura (USJ), University of Kelaniya, University of Ruhuna, University of Jaffna, OUSL.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                <h4 className="font-bold text-cyan-900 text-xs">💡 AI Module Assistant & Lecture Notes</h4>
                <p className="mt-1 text-[11px]">
                  Semester-by-semester course codes, syllabus topics, code explanations, past semester papers, and AI tutor support.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowUniModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer"
            >
              තහවුරුයි (Got it)
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Verified Standards Modal */}
      {showVerifiedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>100% නොමිලේ සහ රාජ්‍ය ප්‍රමිතීන්ට අනුකූලයි</span>
              </h3>
              <button
                onClick={() => setShowVerifiedModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p className="text-xs leading-relaxed">
                සිප්අරණ (SipArana LK) වේදිකාව ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනයේ (NIE) සහ විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාවේ (UGC) විෂය නිර්දේශයන්ට අනුකූලව නිර්මාණය කර ඇති ඩිජිටල් ඉගෙනුම් පද්ධතියකි.
              </p>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-[11px] space-y-1">
                <div>✓ 6 සිට 13 දක්වා සියලුම විෂයයන් සහ ගුරු මාර්ගෝපදේශ</div>
                <div>✓ පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි (Marking Schemes)</div>
                <div>✓ විශ්වවිද්‍යාල Z-Score ගණනය කිරීම් සහ පාඨමාලා විස්තර</div>
                <div>✓ කිසිදු ගාස්තුවකින් තොරව ශ්‍රී ලාංකික දූ දරුවන්ට සම්පූර්ණයෙන්ම නොමිලේ</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerifiedModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              තහවුරුයි (Got it)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
