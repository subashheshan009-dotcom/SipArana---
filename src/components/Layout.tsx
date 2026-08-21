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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SCHOOL_GRADES } from '@/data/mockData';
import type { SchoolGrade } from '@/types';

export type PageId =
  | 'dashboard'
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

interface NavItem {
  id: PageId;
  label: string;
  labelSinhala: string;
  icon: React.ElementType;
  badge?: string;
  isPro?: boolean;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelSinhala: 'පුවරුව', icon: LayoutDashboard },
  { id: 'university', label: 'University Portal', labelSinhala: 'සරසවි AI සහකාර', icon: Sparkles, badge: 'AI Degree', highlight: true },
  { id: 'classroom', label: 'Classroom', labelSinhala: 'වීඩියෝ පන්ති කාමරය', icon: Video, badge: 'HD • 6-13' },
  { id: 'subjects', label: 'Subjects & Papers', labelSinhala: 'විෂයන් & ප්‍රශ්න පත්‍ර', icon: BookOpen, badge: 'Guru Potha' },
  { id: 'campus', label: 'Campus & Z-Score', labelSinhala: 'සරසවි & Z-Score', icon: GraduationCap, badge: 'Cutoffs' },
  { id: 'community', label: 'Student Community', labelSinhala: 'ශිෂ්‍ය සංසදය', icon: Users2 },
  { id: 'utilities', label: 'Study Utilities', labelSinhala: 'පාඩම් මෙවලම්', icon: Wrench, badge: 'Pomodoro' },
  { id: 'news', label: 'Exam News & Alerts', labelSinhala: 'විභාග පුවත්', icon: Newspaper },
  { id: 'premium', label: 'SipArana Pro', labelSinhala: 'ප්‍රෝ සාමාජිකත්වය', icon: Crown, isPro: true },
  { id: 'settings', label: 'Settings', labelSinhala: 'සැකසුම්', icon: Settings },
];

export default function Layout({ current, onNavigate, children }: LayoutProps) {
  const { profile, logout, setGradeAndStream, toggleStudentCategory } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [langSinhala, setLangSinhala] = useState(true);

  const isUniversityStudent = profile?.studentCategory === 'University' || profile?.level === 'CAMPUS';

  const daysToExam = Math.max(1, Math.round((new Date(2026, 10, 15).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const currentGradeInfo = SCHOOL_GRADES.find(g => g.grade === profile?.grade);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-30 select-none"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  SipArana
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  LK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                ජාතික පාසල් අධ්‍යාපන පියස
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Info with Grade or University Badge */}
        {profile && (
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20 flex-shrink-0"
              />
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
          {NAV_ITEMS.map((item) => {
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
                    <div>{langSinhala ? item.labelSinhala : item.label}</div>
                    <span
                      className={`text-[10px] block opacity-70 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {langSinhala ? item.label : item.labelSinhala}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
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

        {/* Bottom Banner */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Curriculum Tracker
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                Grade {profile?.grade || 11}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              ජාතික අධ්‍යාපන ආයතන (NIE) ගුරු පොතට අනුකූලයි.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          id="top-navbar"
          className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between"
        >
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div
              onClick={() => onNavigate('dashboard')}
              className="md:hidden flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="font-bold text-base tracking-tight text-blue-600 dark:text-blue-400">
                SipArana
              </span>
            </div>
          </div>

          {/* Quick Stats / Grade Switcher / Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Grade Switcher Dropdown */}
            {profile && (
              <div className="relative">
                <button
                  id="grade-switcher-btn"
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/80 transition"
                  title="Change Active Grade"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{profile.grade} ශ්‍රේණිය</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {showGradeDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                      ශ්‍රේණිය තෝරන්න (Select Grade)
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
                            <span>{g.nameSinhala}</span>
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{profile.streakDays}d</span>
                <span className="hidden sm:inline text-[11px] font-normal text-amber-600 dark:text-amber-400">
                  Streak
                </span>
              </div>
            )}

            {/* XP Points */}
            {profile && (
              <div
                id="xp-badge"
                title={`${profile.xp} Study XP Points`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold"
              >
                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>{profile.xp.toLocaleString()}</span>
                <span className="hidden sm:inline text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                  XP
                </span>
              </div>
            )}

            {/* Language switch */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLangSinhala(!langSinhala)}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Sinhala / English Interface"
            >
              {langSinhala ? 'සිංහල' : 'ENG'}
            </button>

            {/* Theme switch */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Light / Dark theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold">දැනුම්දීම් (Notifications)</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs mt-1">
                    <div className="py-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        📄 6–13 ශ්‍රේණි නව ගුරු පොත් විෂය නිර්දේශ එක් විය!
                      </p>
                      <p className="text-[11px] text-slate-500">ශ්‍රී ලංකා විෂය මාලාවට අනුකූල සියලු පාඩම් සහ වීඩියෝ දැන් ලබාගත හැක.</p>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        🔥 Daily Streak Protected!
                      </p>
                      <p className="text-[11px] text-slate-500">You studied today and earned 50 bonus XP.</p>
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
                className="flex items-center gap-2 pl-1 hover:opacity-80 transition"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
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
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    SipArana
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
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
                        <span>{langSinhala ? item.labelSinhala : item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.badge}
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
                  <span>Log Out (නික්මෙන්න)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main id="main-content-scroll" className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
