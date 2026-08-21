import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  School,
  MapPin,
  Layers,
  Award,
  Building2,
  Eye,
  EyeOff,
  Flame,
  Zap,
  KeyRound,
  FileCheck,
  Video,
  Info,
  Globe
} from 'lucide-react';
import { useAuth, type DemoPresetKey } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/data/translations';
import { SRI_LANKA_DISTRICTS, SCHOOL_GRADES } from '@/data/mockData';
import { UNIVERSITIES_DATA } from '@/data/universityData';
import type { Stream, ExamLevel, Medium, SchoolGrade, StudentCategory } from '@/types';

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
  const { language, setLanguage, medium, setMedium, t, tText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Google Modal state
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
  const [studentIdNumber, setStudentIdNumber] = useState('');

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

      const res = await loginWithGoogle({
        email: emailToUse,
        name: nameToUse,
        category: catToUse,
        grade: grade,
        stream: stream,
        university: currentUni.name,
        degreeProgramme: availableDegrees[0]?.title,
        district: district,
        medium: medium,
      });

      if (!res.success) {
        setErrorMessage(res.error || (language === 'si' ? 'Google පිවිසුම අසාර්ථක විය.' : language === 'ta' ? 'Google உள்நுழைவு தோல்வியடைந்தது.' : 'Google sign in failed.'));
      }
    } catch {
      setErrorMessage(language === 'si' ? 'Google Authentication දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'Google அங்கீகாரப் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Google Authentication error occurred. Please try again.');
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
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ විද්‍යුත් තැපෑල හෝ දුරකථන අංකය ඇතුළත් කරන්න.' : language === 'ta' ? 'உங்கள் மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your email or mobile phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || (language === 'si' ? 'පිවිසීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Sign in failed. Please try again.'));
      }
    } catch {
      setErrorMessage(language === 'si' ? 'පද්ධතියට ඇතුළත් වීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'உள்நுழைவில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'System sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!name.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.' : language === 'ta' ? 'உங்கள் முழுப் பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඊමේල් ලිපිනයක් හෝ දුරකථන අංකයක් ඇතුළත් කරන්න.' : language === 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter an email or phone number.');
      return;
    }

    if (!password) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ආරක්ෂිත මුරපදයක් (Password) ඇතුළත් කරන්න.' : language === 'ta' ? 'பாதுகாப்பான கடவுச்சொல்லை உள்ளிடவும்.' : 'Please create a secure password.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage(language === 'si' ? 'මුරපදය අවම වශයෙන් අකුරු/ඉලක්කම් 4කින් සමන්විත විය යුතුය.' : language === 'ta' ? 'கடவுச்சொல் குறைந்தது 4 எழுத்துக்களை கொண்டிருக்க வேண்டும்.' : 'Password must be at least 4 characters.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage(language === 'si' ? 'මුරපද දෙක එකිනෙකට නොගැලපේ (Passwords do not match).' : language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (studentCategory === 'University') {
        const matchedDegree =
          availableDegrees.find((d) => d.code === selectedDegreeCode) || availableDegrees[0];
        const res = await register({
          name: name.trim(),
          email: email.trim() || `${phone.replace(/[^0-9]/g, '') || 'uni'}@siparana.lk`,
          phone: phone.trim(),
          password,
          studentCategory: 'University',
          level: 'CAMPUS',
          stream: 'Higher Education',
          school: currentUni.name,
          university: currentUni.name,
          universityShort: currentUni.shortName,
          faculty: currentFaculty?.name || 'Faculty of Engineering',
          degreeProgramme: matchedDegree?.title || 'B.Sc. (Hons) in Computer Science & Engineering',
          degreeCode: matchedDegree?.code || selectedDegreeCode,
          academicYear,
          academicSemester,
          studentIdNumber: studentIdNumber || 'STU-2026',
          targetYear: new Date().getFullYear() + (matchedDegree?.durationYears || 4),
          district,
          medium,
          currentGpa: 3.8,
          targetGpa: 4.0,
        });

        if (!res.success) {
          setErrorMessage(res.error || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථක විය.' : language === 'ta' ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.'));
        }
      } else {
        let calculatedLevel: ExamLevel = 'AL';
        if (grade <= 9) calculatedLevel = 'JUNIOR';
        else if (grade <= 11) calculatedLevel = 'OL';

        const res = await register({
          name: name.trim(),
          email: email.trim() || `${phone.replace(/[^0-9]/g, '') || 'student'}@siparana.lk`,
          phone: phone.trim(),
          password,
          studentCategory: 'School',
          grade,
          level: calculatedLevel,
          stream,
          district,
          school: school.trim() || 'Sri Lanka Model National School',
          targetYear,
          medium,
        });

        if (!res.success) {
          setErrorMessage(res.error || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථක විය.' : language === 'ta' ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.'));
        }
      }
    } catch {
      setErrorMessage(language === 'si' ? 'ලියාපදිංචි වීමේ දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.' : language === 'ta' ? 'பதிவு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Registration error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedGradeInfo = SCHOOL_GRADES.find((g) => g.grade === grade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Background glowing ambient orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30 border border-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                SipArana
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-600/40 border border-blue-400/40 text-blue-200">
                LK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'si'
                ? 'ශ්‍රී ලංකා ජාතික පාසල් & විශ්වවිද්‍යාල ඩිජිටල් අධ්‍යාපන පද්ධතිය'
                : language === 'ta'
                ? 'இலங்கை தேசிய பாடசாலை & பல்கலைக்கழக டிஜிட்டல் கல்வி முறைமை'
                : 'Sri Lanka National School & University Digital Education Ecosystem'}
            </p>
          </div>
        </div>

        {/* Global Language Selector & Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Language Switcher Bar */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-700/80 shadow-lg">
            <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{t('language')}:</span>
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`auth-lang-btn-${lang.code}`}
                  onClick={() => {
                    setLanguage(lang.code as AppLanguage);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={lang.nativeName}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'si' ? 'ආරක්ෂිත සිසු දොරටුව' : language === 'ta' ? 'பாதுகாப்பான மாணவர் தளம்' : 'Secure Student Portal'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6 items-center z-10">
        {/* Left Column: Platform Value Proposition & Fast Demo Access */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>
              {language === 'si'
                ? 'ශ්‍රී ලාංකීය ඒකාබද්ධ අධ්‍යාපන පද්ධතිය'
                : language === 'ta'
                ? 'இலங்கையின் ஒருங்கிணைந்த கல்வி கட்டமைப்பு'
                : 'Unified Sri Lankan Educational Ecosystem'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {language === 'si' ? (
              <>
                ඔබගේ අධ්‍යාපන ගමනට <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  ස්මාර්ට් AI පියස
                </span>
              </>
            ) : language === 'ta' ? (
              <>
                உங்கள் கல்விப் பயணத்திற்கு <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  ஸ்மார்ட் AI களம்
                </span>
              </>
            ) : (
              <>
                Smart AI Platform For <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Your Academic Journey
                </span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'si'
              ? 'ජාතික අධ්‍යාපන ආයතනයේ (NIE) ගුරු පොතට අනුකූල 6–13 ශ්‍රේණි (O/L සහ A/L) පාඩම්, පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ විශ්වවිද්‍යාල සිසුන් සඳහා විශේෂිත වූ AI Degree Assistant එකට පිවිසෙන්න.'
              : language === 'ta'
              ? 'தேசிய கல்வி நிறுவன (NIE) பாடத்திட்டத்திற்கு அமைவான தரம் 6–13 பாடங்கள், கடந்த கால வினாத்தாள்கள் மற்றும் பல்கலைக்கழக மாணவர்களுக்கான AI Degree Assistant வசதியைப் பெறுங்கள்.'
              : 'Access NIE aligned Grades 6–13 syllabus modules, past exam papers, and University degree assistant powered by advanced conversational AI.'}
          </p>

          {/* Key Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'si' ? 'ගුරු පොත & විෂය නිර්දේශය' : language === 'ta' ? 'பாடத்திட்டம் & ஆசிரியர் வழிகாட்டி' : 'Syllabus & Teacher Guides'}
                </span>
                <span className="text-[11px] text-slate-400">Grades 6–13 Syllabus</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <Video className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'si' ? 'HD වීඩියෝ පන්ති කාමරය' : language === 'ta' ? 'HD வீடியோ வகுப்பறை' : 'HD Video Classroom'}
                </span>
                <span className="text-[11px] text-slate-400">Video Classes & Timetable</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'si' ? 'සරසවි AI Degree Portal' : language === 'ta' ? 'பல்கலைக்கழக AI Degree Portal' : 'University AI Degree Portal'}
                </span>
                <span className="text-[11px] text-slate-400">UoM, UoC, USJ, UoP</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'si' ? 'පසුගිය ප්‍රශ්න පත්‍ර ගබඩාව' : language === 'ta' ? 'கடந்த கால வினாத்தாள்கள்' : 'Past Papers & Schemes'}
                </span>
                <span className="text-[11px] text-slate-400">Marking Schemes & Model</span>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'si' ? 'ක්ෂණික පිවිසුම් (1-Click Instant Demo Login):' : language === 'ta' ? 'உடனடி மாதிரி கணக்குகள் (1-Click Demo Login):' : 'Instant 1-Click Demo Access:'}</span>
              </p>
            </div>

            {/* University Profiles Bar */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {language === 'si' ? 'සරසවි ශිෂ්‍ය ගිණුම්:' : language === 'ta' ? 'பல்கலைக்கழக மாணவர் கணக்குகள்:' : 'University Student Demo:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  id="demo-auth-uni-cse-btn"
                  onClick={() => loginAsDemo('uni_cse')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">🏛️ UoM Eng CSE</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800">
                      Y2S1
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">
                    Heshan (Moratuwa)
                  </span>
                </button>

                <button
                  id="demo-auth-uni-med-btn"
                  onClick={() => loginAsDemo('uni_med')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">🩺 UoC MBBS</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                      Pre-Clin
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">
                    Dinithi (Colombo)
                  </span>
                </button>

                <button
                  id="demo-auth-uni-fin-btn"
                  onClick={() => loginAsDemo('uni_fin')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">💼 USJ Finance</span>
                    <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-800">
                      Y1S1
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">
                    Kaveen (J'pura)
                  </span>
                </button>
              </div>
            </div>

            {/* School Profiles Bar */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                <School className="w-3 h-3" /> {language === 'si' ? 'පාසල් ශ්‍රේණි ගිණුම්:' : language === 'ta' ? 'பாடசாலை மாணவர் கணக்குகள்:' : 'School Grades 6–13 Demo:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  id="demo-auth-ol-btn"
                  onClick={() => loginAsDemo('ol')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-amber-400">🎒 11 O/L</span>
                  <span className="text-[10px] text-slate-400 truncate block">Sithum (Galle)</span>
                </button>
                <button
                  id="demo-auth-maths-btn"
                  onClick={() => loginAsDemo('maths')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-blue-400">📐 13 A/L Maths</span>
                  <span className="text-[10px] text-slate-400 truncate block">Kasun (Colombo)</span>
                </button>
                <button
                  id="demo-auth-bio-btn"
                  onClick={() => loginAsDemo('bio')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-emerald-400">🧬 12 A/L Bio</span>
                  <span className="text-[10px] text-slate-400 truncate block">Rashmi (Colombo)</span>
                </button>
                <button
                  id="demo-auth-junior-btn"
                  onClick={() => loginAsDemo('junior')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-teal-400">📘 8 Junior</span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    Minoli (Kurunegala)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login & Registration Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            {/* Tab Header */}
            <div className="flex bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                id="tab-signin-btn"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage('');
                  setSuccessNotice('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>පිවිසෙන්න (Sign In)</span>
              </button>

              <button
                type="button"
                id="tab-register-btn"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                  setSuccessNotice('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>ගිණුමක් සාදන්න (Register)</span>
              </button>
            </div>

            {/* Error and Success Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Info className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {activeTab === 'signin' ? (
              <div className="space-y-4">
                {/* Continue with Google Primary Action */}
                <div className="space-y-2">
                  <button
                    type="button"
                    id="google-signin-primary-btn"
                    onClick={() => handleGoogleLoginDirect('subashheshan009@gmail.com', 'Heshan Subasinghe')}
                    disabled={googleLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition transform active:scale-98 border border-slate-200 group"
                  >
                    {googleLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <GoogleLogoIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition transform" />
                        <span>Continue with Google / Gmail</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>One-click Fast & Secure Login</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline"
                    >
                      Google ගිණුම තෝරන්න (Select Account)
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest relative">
                    හෝ ඊමේල් මගින් (OR WITH EMAIL)
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ඊමේල් ලිපිනය හෝ දුරකථන අංකය (Email or Mobile Number)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        id="login-identifier-input"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="උදා: student@gmail.com හෝ 0771234567"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        මුරපදය (Password)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition underline"
                      >
                        මුරපදය අමතකද? (Forgot?)
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        id="login-password-input"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="ඔබගේ මුරපදය ඇතුළත් කරන්න"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                      />
                      <span>මාව මතක තබාගන්න (Remember Me)</span>
                    </label>
                    <span className="text-slate-500 text-[11px]">256-bit Encrypted</span>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>පද්ධතියට පිවිසෙන්න (Sign In to SipArana)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      තවමත් ගිණුමක් නැද්ද?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold underline ml-1"
                      >
                        නොමිලේ ලියාපදිංචි වන්න (Register Free)
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <div className="space-y-4">
                {/* Google Sign Up Quick Option */}
                <div className="space-y-2">
                  <button
                    type="button"
                    id="google-register-primary-btn"
                    onClick={() => handleGoogleLoginDirect('subashheshan009@gmail.com', 'Heshan Subasinghe')}
                    disabled={googleLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition transform active:scale-98 border border-slate-200 group"
                  >
                    {googleLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <GoogleLogoIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition transform" />
                        <span>Google මගින් ක්ෂණිකව ලියාපදිංචි වන්න (Continue with Google)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Google හරහා තත්පරයකින් ඔබගේ නොමිලේ ගිණුම සක්‍රිය කරගන්න.
                  </p>
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest relative">
                    හෝ විස්තර ඇතුළත් කර සාදන්න (OR FILL DETAILS)
                  </span>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {/* Student Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ශිෂ්‍ය කාණ්ඩය තෝරන්න (Select Student Category):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="reg-category-school-btn"
                      onClick={() => setStudentCategory('School')}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                        studentCategory === 'School'
                          ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          studentCategory === 'School'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <School className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">පාසල් ශිෂ්‍ය</span>
                        <span className="text-[10px] text-slate-400">Grades 6–13 (O/L, A/L)</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="reg-category-uni-btn"
                      onClick={() => setStudentCategory('University')}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                        studentCategory === 'University'
                          ? 'bg-cyan-600/20 border-cyan-500 text-white ring-1 ring-cyan-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          studentCategory === 'University'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">සරසවි ශිෂ්‍ය</span>
                        <span className="text-[10px] text-slate-400">University Degree</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    සම්පූර්ණ නම (Full Name) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      id="reg-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="උදා: කසුන් පෙරේරා / Kasun Perera"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ඊමේල් ලිපිනය (Email Address)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="reg-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@gmail.com"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      දුරකථන අංකය (Mobile Number)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="reg-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0771234567"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password and Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      මුරපදය (Create Password) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="reg-password-input"
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="අවම අකුරු 4ක්"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      මුරපදය තහවුරු කරන්න (Confirm)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        id="reg-confirm-password-input"
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="නැවත ඇතුළත් කරන්න"
                        className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Fields based on Student Category */}
                {studentCategory === 'University' ? (
                  /* UNIVERSITY FIELDS */
                  <div className="space-y-3 p-3.5 rounded-2xl bg-cyan-950/25 border border-cyan-800/40">
                    <div className="flex items-center gap-2 pb-1 border-b border-cyan-900/50">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300">
                        විශ්වවිද්‍යාල සහ උපාධි විස්තර (Degree Info)
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        විශ්වවිද්‍යාලය (University Institution)
                      </label>
                      <select
                        id="reg-uni-select"
                        value={selectedUniId}
                        onChange={(e) => handleUniversityChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {UNIVERSITIES_DATA.map((uni) => (
                          <option key={uni.id} value={uni.id}>
                            {uni.name} ({uni.shortName}) - {uni.nameSinhala}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        පීඨය (Faculty / School)
                      </label>
                      <select
                        id="reg-faculty-select"
                        value={selectedFacultyId}
                        onChange={(e) => handleFacultyChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {currentUni.faculties.map((fac) => (
                          <option key={fac.id} value={fac.id}>
                            {fac.name} ({fac.nameSinhala})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        උපාධි පාඨමාලාව (Degree Programme)
                      </label>
                      <select
                        id="reg-degree-select"
                        value={selectedDegreeCode}
                        onChange={(e) => setSelectedDegreeCode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {availableDegrees.map((deg) => (
                          <option key={deg.code} value={deg.code}>
                            {deg.title} ({deg.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-300 mb-1">
                          අධ්‍යයන වසර
                        </label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                        >
                          <option value={1}>1st Year</option>
                          <option value={2}>2nd Year</option>
                          <option value={3}>3rd Year</option>
                          <option value={4}>4th Year</option>
                          <option value={5}>5th Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-300 mb-1">
                          සෙමෙස්ටරය
                        </label>
                        <select
                          value={academicSemester}
                          onChange={(e) => setAcademicSemester(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                        >
                          <option value={1}>Sem 1</option>
                          <option value={2}>Sem 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-300 mb-1">
                          ශිෂ්‍ය අංකය (ID)
                        </label>
                        <input
                          type="text"
                          value={studentIdNumber}
                          onChange={(e) => setStudentIdNumber(e.target.value)}
                          placeholder="220459X"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SCHOOL FIELDS */
                  <div className="space-y-3">
                    {/* Grade Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          ශ්‍රේණිය තෝරන්න (Select Grade 6–13) *
                        </label>
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                          {selectedGradeInfo?.stage} Level
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-1.5">
                        {SCHOOL_GRADES.map((g) => {
                          const isSelected = grade === g.grade;
                          return (
                            <button
                              key={g.grade}
                              type="button"
                              onClick={() => handleGradeChange(g.grade)}
                              className={`py-1.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 scale-105'
                                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <span className="text-xs">{g.grade}</span>
                              <span className="text-[8px] opacity-75">{g.stage}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stream Selection */}
                    {grade >= 12 ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          උසස් පෙළ විෂය ධාරාව (A/L Stream)
                        </label>
                        <select
                          id="reg-stream-select"
                          value={stream}
                          onChange={(e) => setStream(e.target.value as Stream)}
                          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Physical Science (Maths)">
                            Physical Science (Maths) - සංයුක්ත ගණිතය
                          </option>
                          <option value="Biological Science (Bio)">
                            Biological Science (Bio) - ජීව විද්‍යාව
                          </option>
                          <option value="Commerce">
                            Commerce - වාණිජ (ගිණුම්කරණය, BS, Econ)
                          </option>
                          <option value="Technology">
                            Technology - තාක්ෂණවේදය (ET, SFT, ICT)
                          </option>
                          <option value="Arts">
                            Arts - කලා (සිංහල, මාධ්‍ය, දේශපාලන විද්‍යාව)
                          </option>
                        </select>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>
                          {grade <= 9
                            ? '6–9 ශ්‍රේණි: විද්‍යාව, ගණිතය, ඉතිහාසය, සිංහල, ඉංග්‍රීසි, ආගම'
                            : '10–11 සාමාන්‍ය පෙළ: ප්‍රධාන විෂය 6 + කාණ්ඩ විෂයයන් (ICT, වාණිජ)'}
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        පාසල (School Name)
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          id="reg-school-input"
                          type="text"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder="උදා: Ananda College / මහින්ද විද්‍යාලය"
                          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* District & Medium */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      දිස්ත්‍රික්කය (District)
                    </label>
                    <select
                      id="reg-district-select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      මාධ්‍යය (Medium)
                    </label>
                    <select
                      id="reg-medium-select"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value as Medium)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="Sinhala">සිංහල (Sinhala)</option>
                      <option value="English">English</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>ගිණුම තනා ආරම්භ කරන්න (Complete Registration)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-400">
                    දැනටමත් ලියාපදිංචි වී ඇත්නම්?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-blue-400 hover:text-blue-300 font-bold underline ml-1"
                    >
                      පිවිසෙන්න (Sign In)
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>

    {/* Google Account Picker Modal */}
    {showGoogleModal && (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700/80 max-w-lg w-full p-6 sm:p-7 rounded-3xl space-y-5 shadow-2xl animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-2xl shadow-md">
                <GoogleLogoIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Google සමඟින් සම්බන්ධ වන්න</h4>
                <p className="text-xs text-slate-400">Choose an account to continue to SipArana</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-sm"
            >
              ✕
            </button>
          </div>

          {/* Detected Account Card */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              ප්‍රමුඛ Google ගිණුම (Detected Account):
            </span>
            
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500 transition space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="Heshan Subasinghe"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow">
                    <GoogleLogoIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-white truncate">Heshan Subasinghe</h5>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-800/60 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">subashheshan009@gmail.com</p>
                </div>
              </div>

              {/* Role Switcher in Modal */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="text-[11px] text-slate-400">තෝරාගත් මට්ටම:</span>
                  <span className="font-bold text-cyan-400">
                    {studentCategory === 'University' ? '🏛️ සරසවි (UoM Eng)' : '🎒 පාසල් (Grades 6–13)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentCategory(studentCategory === 'University' ? 'School' : 'University')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
                >
                  මාරු කරන්න (Change)
                </button>
              </div>

              <button
                type="button"
                id="google-modal-detected-btn"
                onClick={() => handleGoogleLoginDirect('subashheshan009@gmail.com', 'Heshan Subasinghe', studentCategory)}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>මෙම ගිණුමෙන් පිවිසෙන්න (Sign in with subashheshan009)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Custom Google Account Input */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              වෙනත් Google / Gmail ගිණුමක් භාවිත කරන්න:
            </span>
            <div className="space-y-2.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  id="custom-google-email-input"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="ඔබගේ Gmail ලිපිනය (eg: student.name@gmail.com)"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {customGoogleEmail && (
                <button
                  type="button"
                  onClick={() => handleGoogleLoginDirect(customGoogleEmail, customGoogleEmail.split('@')[0], studentCategory)}
                  disabled={googleLoading}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>{customGoogleEmail} සමඟින් පිවිසෙන්න</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              අවලංගු කරන්න (Cancel)
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">මුරපදය නැවත සකසන්න (Reset Password)</h4>
                <p className="text-xs text-slate-400">Quick Access & Password Recovery</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ඔබට ඔබගේ මුරපදය අමතක වී ඇත්නම්, ඔබ ලියාපදිංචි වූ ඊමේල් ලිපිනය හෝ දුරකථන අංකය ඇතුළත් කර
              ක්ෂණිකව පිවිසිය හැක. නොඑසේ නම් පහත ඇති Demo ගිණුම් හරහා තත්පරයකින් ඇතුල් වන්න.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
              >
                තේරුම් ගත්තා (Understood)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-3 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © 2026 SipArana Educational Platform. Sri Lankan National Curriculum (Grades 6–13) & University Degree Ecosystem.
        </p>
        <div className="flex gap-4">
          <span className="hover:text-slate-400">ජාතික විෂය නිර්දේශය</span>
          <span className="hover:text-slate-400">UGC සරසවි මාර්ගෝපදේශ</span>
          <span className="hover:text-slate-400">AI Tutor</span>
        </div>
      </footer>
    </div>
  );
}
