import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  School,
  Building2,
  Landmark,
  GraduationCap,
  Award,
  Check,
  Globe,
  Layers,
  MapPin,
  Compass,
  Info,
  Volume2,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SCHOOL_GRADES } from '@/data/mockData';
import { UNIVERSITIES_DATA } from '@/data/universityData';
import {
  GLOBAL_COUNTRIES,
  getCountryByCode,
  getCountrySubdivisions,
  type GlobalCountryCode
} from '@/data/globalCurriculumData';
import { GlobalCurriculumEngine } from '@/utils/globalCurriculumEngine';
import type { Stream, SchoolGrade, StudentCategory, Medium } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';
import heroGirlImage from '@/assets/images/mascot_hero_girl_1787746112702.jpg';
import kaviOwlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import { soundFX } from '@/utils/audioUtils';

export default function AuthPage() {
  const { simpleLogin } = useAuth();
  const { language, setLanguage } = useLanguage();

  // Interactive Explorer Modals
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [isSpeakingKavi, setIsSpeakingKavi] = useState(false);

  // Global Country & Curriculum State
  const [countryCode, setCountryCode] = useState<GlobalCountryCode>('LK');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>('LK_NIE');

  // Form State
  const [username, setUsername] = useState('');
  const [studentCategory, setStudentCategory] = useState<StudentCategory>('School');
  
  // School Student State
  const [grade, setGrade] = useState<SchoolGrade>(13);
  const [stream, setStream] = useState<Stream>('Physical Science (Maths)');
  const [locationRegion, setLocationRegion] = useState<string>('Colombo');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isCustomLocation, setIsCustomLocation] = useState<boolean>(false);
  const [medium, setMedium] = useState<Medium>('Sinhala');
  const [schoolName, setSchoolName] = useState('');

  // University Undergrad State
  const [selectedUniId, setSelectedUniId] = useState('uom');
  const [selectedFacultyId, setSelectedFacultyId] = useState('uom_eng');
  const [selectedDegreeCode, setSelectedDegreeCode] = useState('ENG-CSE');
  const [academicYear, setAcademicYear] = useState(1);
  const [academicSemester, setAcademicSemester] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeCountry = getCountryByCode(countryCode);
  const activeCurricula = activeCountry.curricula;
  const activeCurriculum = activeCurricula.find((c) => c.id === selectedCurriculumId) || activeCurricula[0];
  const activeSubdivisions = getCountrySubdivisions(countryCode);

  // Mascot guidance for the active configuration
  const mascotGuidance = GlobalCurriculumEngine.getLocalizedMascotGuidance(
    {
      id: 'preview',
      name: username || 'Student',
      email: '',
      studentCategory,
      grade,
      stream,
      countryCode,
      curriculumId: selectedCurriculumId,
      isPremium: true
    } as any,
    language
  );

  // University helpers
  const currentUni = UNIVERSITIES_DATA.find((u) => u.id === selectedUniId) || UNIVERSITIES_DATA[0];
  const currentFaculty =
    currentUni.faculties.find((f) => f.id === selectedFacultyId) || currentUni.faculties[0];
  const availableDegrees = currentFaculty ? currentFaculty.degrees : [];

  const handleCountryChange = (code: GlobalCountryCode) => {
    setCountryCode(code);
    const country = getCountryByCode(code);
    const subs = getCountrySubdivisions(code);
    
    setLocationRegion(subs.defaultSubdivision);
    setIsCustomLocation(false);
    setCustomLocation('');

    if (country.curricula.length > 0) {
      setSelectedCurriculumId(country.curricula[0].id);
      if (code !== 'LK') {
        const defaultStage = country.curricula[0].stages[country.curricula[0].stages.length - 1] || country.curricula[0].stages[0];
        const defaultGrade = (defaultStage?.targetGrades[defaultStage.targetGrades.length - 1] || 12) as SchoolGrade;
        setGrade(defaultGrade);
        setStream(defaultStage?.defaultStream || country.curricula[0].subjects[0]?.stream || 'General Academic');
      } else {
        setGrade(13);
        setStream('Physical Science (Maths)');
      }
    }

    // Set country-specific medium
    if (code === 'LK') {
      setMedium('Sinhala');
    } else if (code === 'JP') {
      setMedium('Japanese');
    } else if (code === 'DE') {
      setMedium('German');
    } else if (code === 'IN') {
      setMedium('English');
    } else {
      setMedium('English');
    }

    // Auto switch language if country has default
    if (country.defaultLanguage && country.defaultLanguage !== language) {
      setLanguage(country.defaultLanguage);
    }
    soundFX.playCorrect();
  };

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
    if (countryCode === 'LK') {
      if (newGrade === 5) {
        setStream('Grade 5 Scholarship');
      } else if (newGrade <= 9) {
        setStream('Junior Secondary (Grade 6-9)');
      } else if (newGrade <= 11) {
        setStream('General O/L');
      } else {
        if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)' || stream === 'Grade 5 Scholarship') {
          setStream('Physical Science (Maths)');
        }
      }
    } else {
      // Find stage in active curriculum
      const matchedStage = activeCurriculum.stages.find((st) => st.targetGrades.includes(newGrade));
      if (matchedStage) {
        setStream(matchedStage.defaultStream);
      }
    }
  };

  const handleSpeakMascotWelcome = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingKavi) {
        window.speechSynthesis.cancel();
        setIsSpeakingKavi(false);
        return;
      }
      window.speechSynthesis.cancel();
      const textToSpeak = countryCode === 'UK'
        ? "Let's tackle your UK GCSE and A-Level revision with active recall and official Ofqual mark schemes!"
        : mascotGuidance.spokenAudioScript;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.lang = countryCode === 'UK' ? 'en-GB' : mascotGuidance.speechLocale;
      utterance.onend = () => setIsSpeakingKavi(false);
      utterance.onerror = () => setIsSpeakingKavi(false);
      setIsSpeakingKavi(true);
      window.speechSynthesis.speak(utterance);
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
          : language === 'ja'
          ? 'お名前 (ユーザー名) を入力してください。'
          : language === 'ta'
          ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.'
          : 'Please enter your username / student name.'
      );
      return;
    }

    setLoading(true);
    const finalLocation = isCustomLocation
      ? customLocation.trim() || activeSubdivisions.defaultSubdivision
      : locationRegion || activeSubdivisions.defaultSubdivision;

    try {
      if (studentCategory === 'University' && countryCode === 'LK') {
        const degreeInfo = availableDegrees.find((d) => d.code === selectedDegreeCode);
        const res = await simpleLogin({
          name: cleanUsername,
          studentCategory: 'University',
          countryCode,
          countryName: activeCountry.name,
          countryFlag: activeCountry.flag,
          curriculumId: selectedCurriculumId,
          curriculumName: activeCurriculum.titleEnglish,
          gradingSystemId: activeCurriculum.gradingSystem.id,
          nativeLanguage: language,
          university: currentUni.name,
          faculty: currentFaculty.name,
          degreeProgramme: degreeInfo?.title || 'B.Sc. (Hons) in Computer Science & Engineering',
          degreeCode: selectedDegreeCode,
          academicYear,
          academicSemester,
          medium: medium || 'English',
          district: finalLocation
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
          countryCode,
          countryName: activeCountry.name,
          countryFlag: activeCountry.flag,
          curriculumId: selectedCurriculumId,
          curriculumName: activeCurriculum.titleEnglish,
          gradingSystemId: activeCurriculum.gradingSystem.id,
          nativeLanguage: language,
          grade,
          stream,
          district: finalLocation,
          medium,
          school: schoolName.trim() || (countryCode === 'LK' ? 'Sri Lanka National Model School' : `${activeCountry.name} Academy`),
          targetYear: grade === 5 ? 2026 : grade === 11 ? 2026 : grade === 13 ? 2026 : 2027,
          isKidMode: grade === 5 && countryCode === 'LK'
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

  // Available streams based on selection
  const availableStreams: string[] = countryCode === 'LK'
    ? grade >= 12
      ? [
          'Physical Science (Maths)',
          'Biological Science (Bio)',
          'Commerce',
          'Technology',
          'Arts'
        ]
      : grade >= 10
      ? ['General O/L']
      : grade === 5
      ? ['Grade 5 Scholarship']
      : ['Junior Secondary (Grade 6-9)']
    : (activeCurriculum.stages.find((st) => st.targetGrades.includes(grade))?.streams || [
        'General Academic',
        'STEM',
        'Humanities'
      ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-200">
      
      {/* Background ambient decorative glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-amber-100/50 rounded-full blur-3xl -translate-x-1/3" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-50/70 rounded-full blur-3xl translate-y-1/3" />
      </div>

      {/* TOP HEADER: Clean Header with Siparana Official Logo & Trilingual Language Selector */}
      <header className="relative z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Siparana Official Logo */}
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
                  {countryCode}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold hidden sm:block leading-tight">
                {language === 'si'
                  ? 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන සහ ගෝලීය AI ඉගෙනුම් පද්ධතිය'
                  : language === 'ta'
                  ? 'தேசிய கல்வி மற்றும் உலகளாவிய AI கற்றல் தளம்'
                  : 'National Education & Global AI Learning Ecosystem'}
              </p>
            </div>
          </div>

          {/* Top Right Navigation & Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <HeaderLanguageSelector variant="auto" idPrefix="auth-header-lang" />
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: Clean, Spacious, 2-Column Responsive Layout */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Student Photo, Mascot & Interactive Exploration */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            
            {/* Student Photo Card with Floating Chat Bubbles */}
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 to-blue-400/30 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative bg-white p-4 rounded-3xl border-2 border-amber-300/80 shadow-[0_8px_0_0_#fcd34d] flex flex-col gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 flex-shrink-0 shadow-inner">
                    <img
                      src={heroGirlImage}
                      alt="SipArana Student"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{mascotGuidance.avatarIcon}</span>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                        {mascotGuidance.mascotName}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                      {mascotGuidance.badgeLabel}
                    </span>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 text-[10px] font-black text-blue-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                      <span>{activeCountry.name} ({activeCountry.code})</span>
                    </div>
                  </div>
                </div>

                {/* Floating Chat Bubble */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/90 to-amber-100/50 border border-amber-200/90 text-xs text-slate-700 leading-relaxed text-left relative">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-200 flex-shrink-0 mt-0.5 border border-amber-400">
                      <img
                        src={kaviOwlAvatar}
                        alt="Kavi Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[11px] text-slate-800">
                        "{mascotGuidance.greetingMessage}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSpeakMascotWelcome}
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900 hover:text-amber-950 bg-white/90 px-3 py-1 rounded-xl border border-amber-300/80 cursor-pointer shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isSpeakingKavi ? 'Stop Voice' : `Listen to ${mascotGuidance.mascotName}`}</span>
                    </button>
                    <span className="text-[10px] font-bold text-amber-700">
                      ★ 100% Accurate
                    </span>
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
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block text-xs sm:text-[13px] leading-tight">
                      {language === 'si'
                        ? 'පාසල් 6–13 (O/L, A/L) සියලුම විෂය නිර්දේශ'
                        : `${activeCountry.name} Curriculum & Syllabus Units`}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {activeCurriculum.titleEnglish} • {activeCurriculum.authorityBoard}
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
                        : '100% Free & Globally Verified Standards'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 block">
                      {activeCurriculum.authorityBoard} ({activeCountry.educationMinistry})
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

          {/* RIGHT COLUMN: Clean, Simple, Single-Step Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] p-6 sm:p-7 space-y-5">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>
                    {language === 'si'
                      ? 'යෙදුමට ඇතුළු වන්න (Student Login)'
                      : language === 'ja'
                      ? 'プラットフォームにログイン (Student Login)'
                      : language === 'ta'
                      ? 'உள்நுழைக (Student Login)'
                      : 'Enter Global Education Portal'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {language === 'si'
                    ? 'නම, රට සහ විෂය ධාරාව තෝරා කෙලින්ම යෙදුමට පිවිසෙන්න.'
                    : 'Select your country, curriculum, and grade to configure your personalized AI learning portal.'}
                </p>
              </div>

              {/* Error feedback alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* 1. COUNTRY SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>Select Country / Region (රට තෝරන්න)</span>
                      <span className="text-red-500 font-black">*</span>
                    </span>
                    <span className="text-[11px] font-bold text-blue-600">
                      {activeCountry.flag} {activeCountry.name}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                    {GLOBAL_COUNTRIES.map((c) => {
                      const isSelected = countryCode === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountryChange(c.code)}
                          className={`p-2 rounded-2xl border-2 text-center transition flex flex-col items-center gap-0.5 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-black shadow-xs scale-102'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="text-[10px] font-bold truncate w-full">{c.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. CURRICULUM SELECTION FOR SELECTED COUNTRY */}
                {activeCurricula.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Official Curriculum Framework:</span>
                    </label>
                    <select
                      value={selectedCurriculumId}
                      onChange={(e) => setSelectedCurriculumId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900"
                    >
                      {activeCurricula.map((curr) => (
                        <option key={curr.id} value={curr.id}>
                          {curr.titleEnglish} ({curr.authorityBoard})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. USERNAME INPUT FIELD */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>
                        {language === 'si'
                          ? 'නම (Username / Student Name)'
                          : language === 'ta'
                          ? 'பெயர் (Student Name)'
                          : 'Username / Student Name'}
                      </span>
                      <span className="text-red-500 font-black">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {language === 'si' ? 'ඕනෑම නමක් ඇතුළත් කළ හැක' : 'Any name'}
                    </span>
                  </label>
                  <input
                    id="student-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      countryCode === 'LK'
                        ? 'උදා: කසුන් පෙරේරා / Heshan Subasinghe'
                        : countryCode === 'JP'
                        ? '例: 佐藤 健太 (Kenta Sato)'
                        : 'e.g. Alex Morgan / student'
                    }
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-inner"
                    autoFocus
                    required
                  />
                </div>

                {/* 4. SELECT CATEGORY: School Student vs University Undergrad (LK) */}
                {countryCode === 'LK' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'si'
                        ? 'ශිෂ්‍ය කාණ්ඩය තෝරන්න (Select Category):'
                        : language === 'ta'
                        ? 'பிரிவு (Select Category):'
                        : 'Select Category:'}
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
                          <span className="font-extrabold text-xs block text-slate-900">
                            {language === 'si' ? 'පාසල් ශිෂ්‍ය' : 'School Student'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">Grades 5 to 13</span>
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
                          <span className="font-extrabold text-xs block text-slate-900">
                            {language === 'si' ? 'සරසවි ශිෂ්‍ය' : 'University Undergrad'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">Undergraduate Degree</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5A. SCHOOL CONDITIONAL FIELDS */}
                {studentCategory === 'School' ? (
                  <div className="space-y-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                    
                    {/* Grade Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                          <span>{language === 'si' ? 'ශ්‍රේණිය (Grade)' : 'Select Grade:'}</span>
                        </span>
                        <span className="text-[11px] font-bold text-blue-700">
                          {countryCode === 'LK' ? (grade === 5 ? 'ශිෂ්‍යත්ව විභාගය' : grade === 11 ? 'G.C.E. O/L' : grade >= 12 ? 'G.C.E. A/L' : `Grade ${grade}`) : `Grade / Level ${grade}`}
                        </span>
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => handleGradeChange(Number(e.target.value) as SchoolGrade)}
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                      >
                        {SCHOOL_GRADES.map((g) => (
                          <option key={g.grade} value={g.grade}>
                            {countryCode === 'LK'
                              ? language === 'si' ? g.nameSinhala : g.nameEnglish
                              : `Grade ${g.grade} (${activeCountry.name} Stage)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Stream Selection */}
                    {availableStreams.length > 1 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-blue-600" />
                          <span>{language === 'si' ? 'විෂය ධාරාව (Stream):' : 'Select Stream:'}</span>
                        </label>
                        <select
                          value={stream}
                          onChange={(e) => setStream(e.target.value as Stream)}
                          className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                        >
                          {availableStreams.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* District / Province / Region */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>{activeSubdivisions.labelEn}:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomLocation(!isCustomLocation)}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          {isCustomLocation ? 'Select from list' : 'Type custom'}
                        </button>
                      </label>

                      {isCustomLocation ? (
                        <input
                          type="text"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder={`Enter custom ${activeSubdivisions.labelEn.toLowerCase()}`}
                          className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <select
                          value={locationRegion}
                          onChange={(e) => setLocationRegion(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                        >
                          {activeSubdivisions.subdivisions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Medium Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        <span>Medium of Study:</span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(countryCode === 'LK'
                          ? ['Sinhala', 'English', 'Tamil']
                          : countryCode === 'JP'
                          ? ['Japanese', 'English']
                          : countryCode === 'DE'
                          ? ['German', 'English']
                          : ['English', 'Sinhala', 'Tamil']
                        ).map((med) => (
                          <button
                            key={med}
                            type="button"
                            onClick={() => setMedium(med as Medium)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              medium === med
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {med}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 5B. UNIVERSITY CONDITIONAL FIELDS */
                  <div className="space-y-3.5 bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        State University:
                      </label>
                      <select
                        value={selectedUniId}
                        onChange={(e) => handleUniversityChange(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        {UNIVERSITIES_DATA.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Faculty:
                      </label>
                      <select
                        value={selectedFacultyId}
                        onChange={(e) => handleFacultyChange(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        {currentUni.faculties.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Degree Programme:
                      </label>
                      <select
                        value={selectedDegreeCode}
                        onChange={(e) => setSelectedDegreeCode(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-slate-200 font-bold text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        {availableDegrees.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.title} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Academic Year:
                        </label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(Number(e.target.value))}
                          className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-900"
                        >
                          <option value={1}>Year 1</option>
                          <option value={2}>Year 2</option>
                          <option value={3}>Year 3</option>
                          <option value={4}>Year 4</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Semester:
                        </label>
                        <select
                          value={academicSemester}
                          onChange={(e) => setAcademicSemester(Number(e.target.value))}
                          className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-900"
                        >
                          <option value={1}>Semester 1</option>
                          <option value={2}>Semester 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  id="student-login-submit-btn"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_6px_0_0_#1e3a8a] active:translate-y-1 active:shadow-none transition duration-150 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {language === 'si'
                          ? 'ඉගෙනුම අරඹන්න (START LEARNING)'
                          : language === 'ja'
                          ? '学習を開始 (START LEARNING)'
                          : language === 'ta'
                          ? 'கற்றலைத் தொடங்குங்கள் (START LEARNING)'
                          : 'START LEARNING'}
                      </span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 py-3.5 px-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/80 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SIPARANA AI Learning Ecosystem • Verified Curriculum Standards</span>
          <span className="font-bold text-blue-900">100% Free & Verified Academic Platform</span>
        </div>
      </footer>

      {/* MODAL 1: School Syllabus Preview Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {activeCountry.name} Curriculum & Syllabi
                  </h3>
                  <span className="text-[11px] text-blue-600 font-bold">
                    {activeCurriculum.titleEnglish} ({activeCurriculum.authorityBoard})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 max-h-64 overflow-y-auto pr-1">
              <p className="font-semibold text-slate-600">
                Siparana covers all official stages, units, and past examinations:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {activeCurriculum.stages.map((st) => (
                  <div key={st.id} className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                    <span className="font-bold text-blue-950 block text-xs">{st.name}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">{st.gradeRangeLabel} • Ages {st.typicalAge}</span>
                    <span className="text-[10px] font-bold text-blue-700 block mt-1">
                      Target Grades: {st.targetGrades.join(', ')} • Default Stream: {st.defaultStream}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSchoolModal(false);
                soundFX.playCorrect();
              }}
              className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: University Hub Preview Modal */}
      {showUniModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    State University Degree Hub
                  </h3>
                  <span className="text-[11px] text-indigo-600 font-bold">
                    Sri Lanka University Grants Commission (UGC)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUniModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 max-h-64 overflow-y-auto pr-1">
              <p className="font-semibold text-slate-600">
                Included State Universities with verified course modules & GPA tracking:
              </p>
              <div className="space-y-1.5">
                {UNIVERSITIES_DATA.map((u) => (
                  <div key={u.id} className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-950 block">{u.name}</span>
                      <span className="text-[10px] text-slate-500">{u.faculties.length} Faculties • {u.location}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-200/80 text-indigo-900">
                      UGC Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowUniModal(false);
                soundFX.playCorrect();
              }}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Verified Standards Modal */}
      {showVerifiedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    100% Free & Verified Academic Standard
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    Zero Hallucination AI Directive
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVerifiedModal(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>
                  <strong>Official Syllabi Alignment:</strong> Every question, theory, and mark scheme is benchmarked strictly against official curriculum frameworks.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>
                  <strong>100% Free for All Students:</strong> Full access to AI tutoring, step-by-step math solver, past paper repositories, and exam simulators.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>
                  <strong>Data Privacy & Safe AI:</strong> Child-safe conversational models without ads or tracking.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowVerifiedModal(false);
                soundFX.playCorrect();
              }}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
