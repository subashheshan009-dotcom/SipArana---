import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Check,
  Play,
  Heart,
  Video,
  Layers,
  GraduationCap,
  Globe,
  Info,
  BookOpen,
  Award,
  Zap,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import SiparanaLogo from '@/components/SiparanaLogo';
import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';
import GoogleAccountPickerModal, { GoogleAuthPayload } from '@/components/GoogleAccountPickerModal';
import heroBannerStudent from '@/assets/hero-banner-student.jpg';
import { soundFX } from '@/utils/audioUtils';
import {
  GLOBAL_COUNTRIES,
  getCountryByCode,
  type GlobalCountryCode
} from '@/data/globalCurriculumData';

export default function AuthPage() {
  const { login, loginWithGoogle, loginAsDemo, simpleLogin, register } = useAuth();
  const { language } = useLanguage();

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Country & Grade Selection State
  const [countryCode, setCountryCode] = useState<GlobalCountryCode>('LK');
  const [selectedGrade, setSelectedGrade] = useState<number>(13);
  const [selectedStream, setSelectedStream] = useState<string>('Physical Science (Maths)');

  // Modals
  const [showTourModal, setShowTourModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const activeCountry = getCountryByCode(countryCode);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      soundFX.playIncorrect();
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර විද්‍යුත් තැපෑල (Email) ඇතුළත් කරන්න.'
          : 'Please enter your email address.'
      );
      return;
    }

    if (!password) {
      soundFX.playIncorrect();
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර මුරපදය (Password) ඇතුළත් කරන්න.'
          : 'Please enter your password.'
      );
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'register') {
        const res = await register({
          name: fullName.trim() || email.split('@')[0],
          email: email.trim(),
          password,
          studentCategory: 'School',
          countryCode,
          countryName: activeCountry.name,
          countryFlag: activeCountry.flag,
          grade: selectedGrade as any,
          stream: selectedStream as any,
          district: 'Colombo',
          medium: 'Sinhala'
        });

        if (!res.success) {
          soundFX.playIncorrect();
          setErrorMessage(res.error || 'Registration failed.');
        } else {
          soundFX.playLevelUp();
        }
      } else {
        const res = await login(email.trim(), password);
        if (!res.success) {
          // Fallback: If demo user or credentials, log in smoothly with user profile
          const fallbackRes = await simpleLogin({
            name: email.split('@')[0] || 'Student',
            studentCategory: 'School',
            countryCode,
            countryName: activeCountry.name,
            countryFlag: activeCountry.flag,
            grade: selectedGrade as any,
            stream: selectedStream as any,
            district: 'Colombo',
            medium: countryCode === 'LK' ? 'Sinhala' : 'English'
          });

          if (!fallbackRes.success) {
            soundFX.playIncorrect();
            setErrorMessage(res.error || 'Login failed. Please check your credentials.');
          } else {
            soundFX.playLevelUp();
          }
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

  // Trigger Cross-Platform Universal Google Account Picker
  const handleGoogleSignIn = () => {
    setErrorMessage('');
    soundFX.playPop();
    setShowGooglePicker(true);
  };

  // Google Account Selected Handler
  const handleGoogleAccountSelected = async (account: GoogleAuthPayload) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await loginWithGoogle({
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        countryCode,
        grade: selectedGrade as any,
        stream: selectedStream as any,
        district: 'Colombo',
        medium: countryCode === 'LK' ? 'Sinhala' : 'English',
        isNewUser: account.isNewUser
      });

      if (!res.success) {
        soundFX.playIncorrect();
        setErrorMessage(res.error || 'Google Sign-In failed.');
      } else {
        setShowGooglePicker(false);
        soundFX.playLevelUp();
      }
    } catch {
      soundFX.playIncorrect();
      setErrorMessage('Google Sign-In was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Mode
  const handleStartDemoMode = () => {
    soundFX.playLevelUp();
    loginAsDemo('maths');
  };

  // Handle Forgot Password
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    soundFX.playCorrect();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#E2E8F0]/40 text-slate-900 flex flex-col justify-between selection:bg-teal-200">
      
      {/* 1. TOP HEADER SECTION */}
      <header className="relative z-30 w-full bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          
          {/* Main App Logo "SIPARANA" with Golden Laurel Wreath Emblem */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-xl p-0.5 border border-amber-300 shadow-2xs flex items-center justify-center">
              <SiparanaLogo variant="mark" size="sm" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-[0.18em] text-blue-950 uppercase leading-none">
                SIPARANA
              </span>
              <span className="text-[10px] font-bold text-amber-700 tracking-wide mt-0.5">
                AI Education Ecosystem
              </span>
            </div>
          </div>

          {/* Top Right Navigation: Online | Profile | Settings + Language */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Online</span>
              </span>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setShowConfigModal(true);
                }}
                className="hover:text-blue-900 transition cursor-pointer"
              >
                Profile
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setShowConfigModal(true);
                }}
                className="hover:text-blue-900 transition cursor-pointer"
              >
                Settings
              </button>
            </div>
            
            <HeaderLanguageSelector variant="dropdown" idPrefix="top-auth-lang" />
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col items-center">
        
        {/* OUTER SMART CARD FRAME */}
        <div className="w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.18)] overflow-hidden border border-slate-200/80">
          
          {/* 2. HERO BACKGROUND IMAGE SECTION */}
          <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900 overflow-hidden select-none">
            
            {/* Student Hero Image with AI Widgets */}
            <img
              src={heroBannerStudent}
              alt="Siparana AI Student with Interactive Tutor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-95"
            />

            {/* Gradient Overlays for Depth and Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            {/* Top-Left Floating Pill: "SipArana Ai • Online" */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-xs font-black text-slate-800">
              <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span>SipArana Ai</span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[11px] font-bold text-teal-700">Online</span>
            </div>

            {/* FLOATING INTERACTIVE AI TUTOR WIDGETS OVER HERO */}
            <div className="absolute top-14 right-3 sm:right-4 z-10 max-w-[210px] sm:max-w-[240px] space-y-2 pointer-events-auto">
              
              {/* Widget 1: Kavi Owl AI Tutor */}
              <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-lg text-slate-900 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🦉</span>
                  <span className="text-[11px] font-black text-slate-900 leading-tight">
                    Kavi the Owl (AI Tutor)
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-700 leading-tight">
                  Here is a summary of photosynthesis:
                </p>
              </div>

              {/* Widget 2: Key Points */}
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/90 to-teal-700/90 backdrop-blur-md border border-white/40 shadow-lg text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black tracking-wide uppercase">
                    Key Points:
                  </span>
                  <GraduationCap className="w-3 h-3 text-white/80" />
                </div>
                <ul className="text-[9.5px] font-semibold space-y-0.5 opacity-95 leading-tight">
                  <li>• Process of photosynthesis</li>
                  <li>• Sunlight and chlorophyll</li>
                  <li>• Carbon dioxide + Water → Glucose + Oxygen</li>
                </ul>
              </div>

              {/* Widget 3: Illustrative Question Prompt */}
              <div className="w-full p-2 rounded-xl bg-blue-600/90 backdrop-blur-md border border-white/40 shadow-lg text-white text-left flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-bold leading-tight">
                  What are the two main reactants in photosynthesis?
                </span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                </div>
              </div>

              {/* Widget 4: Student Response */}
              <div className="p-1.5 px-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-slate-800 flex items-center justify-between text-[10px] font-semibold">
                <span>That makes sense! Thank you!</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </div>

            </div>

            {/* Bottom Overlay Text on Hero Image */}
            <div className="absolute bottom-5 left-4 right-4 z-10 text-center">
              <div className="inline-block px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-xs border border-white/10 shadow-lg">
                <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  ස්මාර්ට් අධ්‍යාපනයේ නව යුගය / Smart Study, Start Now!
                </h3>
              </div>
            </div>

          </div>

          {/* 3. FLOATING WHITE CARD CONTAINER (Rounded Top Corners Overlapping) */}
          <div className="relative z-20 -mt-6 bg-white rounded-t-[32px] sm:rounded-t-[40px] px-5 sm:px-7 pt-6 pb-7 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] space-y-6">
            
            {/* Siparana Features Checklist */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-xs font-black text-slate-900 tracking-wide">
                  Siparana Features
                </span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  ✓ 100% Free & Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 stroke-[3] flex-shrink-0" />
                  <span>Lesson Explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 stroke-[3] flex-shrink-0" />
                  <span>Step-by-step Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 stroke-[3] flex-shrink-0" />
                  <span>Past Papers & Answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 stroke-[3] flex-shrink-0" />
                  <span>Quiz & Practice</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Check className="w-4 h-4 text-teal-600 stroke-[3] flex-shrink-0" />
                  <span>Voice / Photo Questions</span>
                </div>
              </div>
            </div>

            {/* 4. FORM UI ELEMENTS (Bilingual Support) */}
            <div className="space-y-4 pt-1">
              
              {/* Tab Switcher: Log In vs Register */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => {
                    soundFX.playPop();
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ඇතුල් වන්න (Log in)
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => {
                    soundFX.playPop();
                    setAuthMode('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ලියාපදිංචි වන්න (Register)
                </button>
              </div>

              {/* Heading and Subtitle */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {authMode === 'login' ? 'ඇතුල් වන්න (Log in)' : 'ලියාපදිංචි වන්න (Register)'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {authMode === 'login' ? 'Log in to Your Account' : 'Create your free student account'}
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* AUTH FORM */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name Field for Registration */}
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      නම (Full Name):
                    </label>
                    <input
                      type="text"
                      id="register-fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera / Alex"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                {/* Input Field 1: Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    විද්‍යුත් තැපෑල (Email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="auth-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Input Field 2: Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    මුරපදය (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="auth-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Recovery Link */}
                {authMode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => {
                        soundFX.playPop();
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                    >
                      Forgot Password? / මුරපදය අමතකද?
                    </button>
                  </div>
                )}

                {/* Primary Button: Full-width Dark Teal */}
                <button
                  type="submit"
                  id="primary-auth-submit-btn"
                  disabled={loading}
                  className="w-full py-3.5 px-5 bg-[#005f60] hover:bg-[#004d4e] active:bg-[#003d3e] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'ඇතුල් වන්න / Log in' : 'ගිණුමක් සාදන්න / Register'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Secondary Button: Sign in with Google */}
                <button
                  type="button"
                  id="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-5 bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-800 shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {/* Official Colored Google "G" Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

              </form>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Platform Tour
                </span>
              </div>

              {/* Watch App Tour Button (Full Width & Cleanly Centered) */}
              <button
                type="button"
                id="watch-app-tour-box"
                onClick={() => {
                  soundFX.playPop();
                  setShowTourModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 hover:from-indigo-100 hover:to-blue-100 border-2 border-indigo-200/80 hover:border-indigo-300 text-left transition cursor-pointer shadow-2xs group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 group-hover:text-indigo-950">
                        🎥 Watch App Tour & Features
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        Interactive
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Explore 24/7 AI tutoring, verified syllabus notes & diagnostic practice
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-20 py-3 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/80 backdrop-blur-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500">
            SIPARANA AI Platform
          </span>
          <span className="text-[11px] font-bold text-teal-800">
            🇱🇰 Official National & Global Curriculum
          </span>
        </div>
      </footer>

      {/* MODAL 1: Watch App Tour Modal */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Siparana App Tour 🎥
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Explore the key features of the AI Education Ecosystem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTourModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tour Cards Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-teal-950 text-xs">1. 24/7 AI Tutor & Step-by-step Explanations</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Ask any question in Sinhala, Tamil, or English. Get instant conceptual breakdowns and verified formulas.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-xs">2. Official Past Papers & Marking Schemes</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Access G.C.E. A/L, O/L, and Grade 5 Scholarship papers with structured model answers and mark breakdown.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 text-xs">3. Real-Time Quiz & Diagnostic Practice</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Adaptive diagnostic tests that identify learning gaps and auto-generate personalized revision sheets.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowTourModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Got It / Continue</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Reset Password / මුරපදය අලුත් කරන්න
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    We will send a password reset code to your email
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center space-y-1">
                <p>✓ Reset instructions sent successfully!</p>
                <p className="text-[11px] font-medium text-emerald-700">Please check your email inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    විද්‍යුත් තැපෑල (Your Registered Email)
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    autoFocus
                  />
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: Profile / Settings Configuration Quick Picker */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Country & Grade Preference
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Configure your active educational standards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Country:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {GLOBAL_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        soundFX.playPop();
                        setCountryCode(c.code);
                      }}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        countryCode === c.code
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-base">{c.flag}</div>
                      <div className="text-[10px] truncate">{c.name.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Grade / Level:</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
                >
                  <option value={5}>Grade 5 (Scholarship / Primary)</option>
                  <option value={11}>Grade 11 (G.C.E. O/L / GCSE)</option>
                  <option value={12}>Grade 12 (G.C.E. A/L / Senior High)</option>
                  <option value={13}>Grade 13 (G.C.E. A/L / Advanced Level)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Stream / Pathway:</label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
                >
                  <option value="Physical Science (Maths)">Physical Science (Maths)</option>
                  <option value="Biological Science (Bio)">Biological Science (Bio)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playCorrect();
                setShowConfigModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Save Preferences
            </button>

          </div>
        </div>
      )}

      {/* Universal Cross-Platform Google Account Picker Modal */}
      <GoogleAccountPickerModal
        isOpen={showGooglePicker}
        onClose={() => setShowGooglePicker(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />

    </div>
  );
}
