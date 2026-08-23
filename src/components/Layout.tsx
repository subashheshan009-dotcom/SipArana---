import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users2,
  Wrench,
  Newspaper,
  Crown,
  Settings,
  Flame,
  Zap,
  Moon,
  Sun,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Video,
  ChevronDown,
  Globe,
  FileQuestion,
  Bot,
  BarChart3,
  HardDriveDownload,
  ShoppingBag,
  Compass
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/LanguageContext';
import { SCHOOL_GRADES } from '@/data/mockData';
import type { SchoolGrade, AppLanguage } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';

export type PageId =
  | 'dashboard'
  | 'google_hub'
  | 'free_courses'
  | 'book_shop'
  | 'quizzes'
  | 'ai_tutor'
  | 'analytics'
  | 'offline_syllabus'
  | 'university'
  | 'classroom'
  | 'subjects'
  | 'campus'
  | 'community'
  | 'utilities'
  | 'news'
  | 'premium'
  | 'settings';

interface LayoutProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

interface NavItemDef {
  id: PageId;
  icon: React.ElementType;
  transKey: string;
  enLabel: string;
  siLabel: string;
  taLabel: string;
  badgeKey?: string;
  badgeText?: string;
  isPro?: boolean;
  highlight?: boolean;
}

const NAV_ITEMS_CONFIG: NavItemDef[] = [
  { id: 'dashboard', icon: LayoutDashboard, transKey: 'dashboard', enLabel: 'Dashboard', siLabel: 'පුවරුව', taLabel: 'முகப்பு பலகை' },
  { id: 'google_hub', icon: Globe, transKey: 'googleHub', enLabel: 'Google Student Hub', siLabel: 'ගූගල් අධ්‍යාපන පීඨය', taLabel: 'கூகிள் மாணவர் தளம்', badgeText: 'In-App Hub', highlight: true },
  { id: 'free_courses', icon: Compass, transKey: 'freeCourses', enLabel: 'Free Online Courses', siLabel: 'නිදහස් ඔන්ලයින් පාඨමාලා', taLabel: 'இலவச இணையப் படிப்புகள்', badgeText: '100% Free', highlight: true },
  { id: 'book_shop', icon: ShoppingBag, transKey: 'bookShop', enLabel: 'SipArana Book Shop', siLabel: 'සිප්අරණ පොත් හල', taLabel: 'புத்தக சந்தை', badgeText: 'Marketplace', highlight: true },
  { id: 'quizzes', icon: FileQuestion, transKey: 'quizzes', enLabel: 'MCQ Quizzes', siLabel: 'බහුවරණ පරීක්ෂණ', taLabel: 'பன்மைத் தெரிவு வினாக்கள்', badgeText: 'Auto-Marked', highlight: true },
  { id: 'ai_tutor', icon: Bot, transKey: 'aiTutor', enLabel: 'AI Tutor & Voice', siLabel: 'AI ගුරු සහකාර', taLabel: 'AI குரல் ஆசிரியர்', badgeText: 'Voice AI', highlight: true },
  { id: 'analytics', icon: BarChart3, transKey: 'analytics', enLabel: 'Performance Analytics', siLabel: 'ප්‍රගති වාර්තාව', taLabel: 'செயல்திறன் பகுப்பாய்வு', badgeText: 'Live Diagnostic' },
  { id: 'offline_syllabus', icon: HardDriveDownload, transKey: 'offlineSyllabus', enLabel: 'Offline Syllabus & PDFs', siLabel: 'නිල විෂය නිර්දේශ PDF', taLabel: 'பாடத்திட்டம் & PDF', badgeText: '100% Free' },
  { id: 'university', icon: Sparkles, transKey: 'universityPortal', enLabel: 'University AI Portal', siLabel: 'සරසවි AI සහකාර', taLabel: 'பல்கலைக்கழக AI தளம்', badgeText: 'AI Degree' },
  { id: 'classroom', icon: Video, transKey: 'classroom', enLabel: 'HD Video Classroom', siLabel: 'වීඩියෝ පන්ති කාමරය', taLabel: 'வீடியோ வகுப்பறை', badgeText: 'HD • 6-13' },
  { id: 'subjects', icon: BookOpen, transKey: 'subjectsPapers', enLabel: 'Subjects & Past Papers', siLabel: 'විෂයන් & ප්‍රශ්න පත්‍ර', taLabel: 'பாடங்கள் & வினாத்தாள்கள்', badgeText: 'Guru Potha' },
  { id: 'campus', icon: GraduationCap, transKey: 'campusZScore', enLabel: 'Campus & Z-Score', siLabel: 'සරසවි & Z-Score', taLabel: 'பல்கலைக்கழகம் & Z-புள்ளி', badgeText: 'Cutoffs' },
  { id: 'community', icon: Users2, transKey: 'community', enLabel: 'Student Community', siLabel: 'ශිෂ්‍ය සංසදය', taLabel: 'மாணவர் சமூகம்' },
  { id: 'utilities', icon: Wrench, transKey: 'utilities', enLabel: 'Study Utilities', siLabel: 'පාඩම් මෙවලම්', taLabel: 'படிப்பு கருவிகள்', badgeText: 'Stopwatch & Chart' },
  { id: 'news', icon: Newspaper, transKey: 'examNews', enLabel: 'Exam News & Alerts', siLabel: 'විභාග පුවත්', taLabel: 'தேர்வுச் செய்திகள்' },
  { id: 'premium', icon: Crown, transKey: 'proMembership', enLabel: 'SipArana Pro', siLabel: 'ප්‍රෝ සාමාජිකත්වය', taLabel: 'புரோ உறுப்பினர்', isPro: true },
  { id: 'settings', icon: Settings, transKey: 'settings', enLabel: 'Settings', siLabel: 'සැකසුම්', taLabel: 'அமைப்புகள்' },
];

export default function Layout({ current, onNavigate, children }: LayoutProps) {
  const { profile, logout, setGradeAndStream, toggleStudentCategory } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const isUniversityStudent = profile?.studentCategory === 'University' || profile?.level === 'CAMPUS';

  const daysToExam = Math.max(1, Math.round((new Date(2026, 10, 15).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const currentGradeInfo = SCHOOL_GRADES.find(g => g.grade === profile?.grade);

  const getNavLabel = (item: NavItemDef) => {
    if (language === 'si') return item.siLabel;
    if (language === 'ta') return item.taLabel;
    return item.enLabel;
  };

  const getSubLabel = (item: NavItemDef) => {
    if (language === 'si') return item.enLabel;
    return item.siLabel;
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden relative">
      {/* Sidebar - Desktop */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-30 select-none"
      >
        {/* Brand Header */}
        <div className="p-4 lg:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group w-full"
          >
            <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md shadow-blue-900/10 border border-slate-200/80 dark:border-slate-700 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <SiparanaLogo variant="mark" size="sm" className="w-full h-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base lg:text-lg tracking-wider uppercase font-serif text-slate-900 dark:text-white">
                  SIPARANA
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-blue-600 text-white">
                  LK
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                ජාතික අධ්‍යාපන පියස
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Info with Grade or University Badge */}
        {profile && (
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                {profile.authProvider === 'google' && (
                  <div
                    title="Google Verified Account"
                    className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-full shadow"
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none">
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
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                    {profile.name}
                  </p>
                  {profile.isPremium && (
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {isUniversityStudent ? (
                    <>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        {profile.universityShort || 'Uni'}
                      </span>
                      <span>•</span>
                      <span className="truncate">{profile.degreeCode || profile.degreeProgramme || 'Undergraduate'}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {profile.grade} ශ්‍රේණිය
                      </span>
                      <span>•</span>
                      <span className="truncate">{profile.stream}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={toggleStudentCategory}
              title="Switch between School (6-13) and University Portal"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
            >
              {isUniversityStudent ? '🎓 Uni' : '🎒 Sch'}
            </button>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS_CONFIG.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : item.isPro
                        ? 'text-amber-500'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <div className="text-left leading-tight">
                    <div>{getNavLabel(item)}</div>
                    <span
                      className={`text-[10px] block opacity-70 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {getSubLabel(item)}
                    </span>
                  </div>
                </div>

                {item.badgeText && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                )}
                {item.isPro && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Banner & Log Out */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {language === 'si' ? 'විෂය නිර්දේශ පියස' : language === 'ta' ? 'பாடத்திட்ட வழிகாட்டி' : 'Curriculum Tracker'}
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {isUniversityStudent ? (profile?.universityShort || 'Uni') : `Grade ${profile?.grade || 11}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {language === 'si'
                ? 'ජාතික අධ්‍යාපන ආයතන (NIE) ගුරු පොතට අනුකූලයි.'
                : language === 'ta'
                ? 'தேசிய கல்வி நிறுவன (NIE) வழிகாட்டிக்கு அமைவானது.'
                : 'Aligned with National Institute of Education (NIE) guidelines.'}
            </p>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header
          id="top-navbar"
          className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between w-full max-w-full min-w-0 overflow-x-hidden"
        >
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div
              onClick={() => onNavigate('dashboard')}
              className="md:hidden flex items-center gap-1.5 cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white p-0.5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <SiparanaLogo variant="mark" size="xs" className="w-full h-full" />
              </div>
              <span className="font-black text-sm sm:text-base tracking-wider uppercase font-serif text-slate-900 dark:text-white">
                SIPARANA
              </span>
            </div>
          </div>

          {/* Quick Stats / Grade Switcher / Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-shrink">
            {/* Quick Grade Switcher Dropdown */}
            {profile && !isUniversityStudent && (
              <div className="relative">
                <button
                  id="grade-switcher-btn"
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/80 transition max-w-[90px] sm:max-w-none"
                  title="Change Active Grade"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    {language === 'si' ? `${profile.grade} වසර` : language === 'ta' ? `தரம் ${profile.grade}` : `Gr ${profile.grade}`}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70 flex-shrink-0" />
                </button>

                {showGradeDropdown && (
                  <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                      {language === 'si' ? 'ශ්‍රේණිය තෝරන්න' : language === 'ta' ? 'தரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Grade'}
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {SCHOOL_GRADES.map((g) => {
                        const isCurrent = profile.grade === g.grade;
                        return (
                          <button
                            key={g.grade}
                            onClick={() => {
                              setGradeAndStream(g.grade);
                              setShowGradeDropdown(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{language === 'ta' ? `தரம் ${g.grade}` : language === 'en' ? `Grade ${g.grade}` : g.nameSinhala}</span>
                            <span className="text-[10px] opacity-75 font-normal">
                              ({g.stage})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Streak indicator */}
            {profile && (
              <div
                id="streak-badge"
                title={`${profile.streakDays} Days Study Streak!`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 animate-pulse flex-shrink-0" />
                <span>{profile.streakDays}d</span>
                <span className="hidden sm:inline text-[11px] font-normal text-amber-600 dark:text-amber-400">
                  {t('streak')}
                </span>
              </div>
            )}

            {/* XP Points */}
            {profile && (
              <div
                id="xp-badge"
                title={`${profile.xp} Study XP Points`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                <span>{profile.xp.toLocaleString()}</span>
                <span className="hidden sm:inline text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                  {t('xpPoints')}
                </span>
              </div>
            )}

            {/* Global Language Selector Dropdown */}
            <div className="relative">
              <button
                id="header-lang-toggle-btn"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-2xs"
                title="Select Language (සිංහල / தமிழ் / English)"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>{activeLangObj.flag}</span>
                <span className="font-semibold hidden sm:inline">{activeLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 opacity-60 flex-shrink-0" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                    {t('selectLanguage')}
                  </div>
                  <div className="space-y-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          id={`nav-lang-${lang.code}-btn`}
                          onClick={() => {
                            setLanguage(lang.code as AppLanguage);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </div>
                          {isSelected && <span className="text-[10px] font-normal">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Theme switch */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Light / Dark theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
                title={t('notifications')}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold">{t('notifications')}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs mt-1">
                    <div className="py-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'si'
                          ? '📄 6–13 ශ්‍රේණි නව ගුරු පොත් විෂය නිර්දේශ එක් විය!'
                          : language === 'ta'
                          ? '📄 தரம் 6-13 புதிய ஆசிரியர் வழிகாட்டிகள் சேர்க்கப்பட்டன!'
                          : '📄 Grades 6–13 NIE Teacher Guides Available!'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {language === 'si'
                          ? 'ශ්‍රී ලංකා විෂය මාලාවට අනුකූල සියලු පාඩම් සහ වීඩියෝ දැන් ලබාගත හැක.'
                          : language === 'ta'
                          ? 'இலங்கை பாடத்திட்டத்திற்கு அமைவான அனைத்து பாடங்களும் வீடியோக்களும் கிடைக்கின்றன.'
                          : 'All syllabus modules and video lessons aligned with Sri Lanka national curriculum are live.'}
                      </p>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        🔥 Daily Streak Protected!
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {language === 'si'
                          ? 'අද දින ඔබ අධ්‍යයනය කර ලකුණු 50ක ප්‍රසාද XP උපයා ගත්තේය.'
                          : language === 'ta'
                          ? 'இன்று படித்து 50 போனஸ் XP பெற்றுள்ளீர்கள்.'
                          : 'You studied today and earned 50 bonus XP.'}
                      </p>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Quick Link */}
            {profile && (
              <button
                id="header-profile-btn"
                onClick={() => onNavigate('settings')}
                className="flex items-center gap-2 pl-0.5 sm:pl-1 hover:opacity-80 transition flex-shrink-0"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500"
                />
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-drawer"
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex"
          >
            <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-4 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <SiparanaLogo variant="mark" size="xs" className="w-full h-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-base tracking-wider uppercase font-serif text-slate-900 dark:text-white leading-none">
                      SIPARANA
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      National Education
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Language Switcher Row */}
              <div className="py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-around gap-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isActive = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as AppLanguage)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 py-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS_CONFIG.map((item) => {
                  const Icon = item.icon;
                  const isActive = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{getNavLabel(item)}</span>
                      </div>
                      {item.badgeText && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.badgeText}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('signOut')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main id="main-content-scroll" className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
