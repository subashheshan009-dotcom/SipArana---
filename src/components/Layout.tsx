import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
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
  ChevronUp,
  Globe,
  FileQuestion,
  Bot,
  BarChart3,
  HardDriveDownload,
  ShoppingBag,
  Compass,
  Smile,
  Calendar,
  Layers,
  Headphones,
  Languages,
  Cpu,
  CheckCircle2,
  User,
  Award,
  CreditCard,
  Radio,
  ScanLine
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/LanguageContext';
import { useCountry } from '@/context/CountryContext';
import { useExamNews } from '@/context/NewsContext';
import { SCHOOL_GRADES } from '@/data/mockData';
import type { SchoolGrade, AppLanguage, Stream } from '@/types';
import SiparanaLogo from '@/components/SiparanaLogo';
import AutonomousCurriculumSyncModal from '@/components/AutonomousCurriculumSyncModal';
import GlobalCountryCurriculumModal from '@/components/GlobalCountryCurriculumModal';
import DailyMysteryChestModal from '@/components/DailyMysteryChestModal';
import DailyStreakModal from '@/components/DailyStreakModal';
import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';
import { GLOBAL_COUNTRIES } from '@/utils/globalCurriculumEngine';
import { soundFX } from '@/utils/audioUtils';
import { Gift } from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'smart_evaluator'
  | 'planner'
  | 'flashcards'
  | 'audio'
  | 'language_adventure'
  | 'modern_languages'
  | 'fun_english'
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
  | 'utilities'
  | 'news'
  | 'key_players'
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
  enLabel: string;
  siLabel: string;
  taLabel: string;
  badgeText?: 'NEW' | 'FREE' | 'LIVE' | string;
  badgeType?: 'new' | 'free' | 'live' | 'pro' | 'default';
  isPro?: boolean;
}

interface NavGroupDef {
  id: string;
  icon: string;
  enTitle: string;
  siTitle: string;
  taTitle: string;
  pastelBg: string;
  pastelBorder: string;
  pastelText: string;
  items: NavItemDef[];
}

const RAW_NAV_ITEMS: Record<PageId, NavItemDef> = {
  dashboard: {
    id: 'dashboard',
    icon: LayoutDashboard,
    enLabel: 'Dashboard',
    siLabel: 'ප්‍රධාන පුවරුව',
    taLabel: 'முகப்பு பலகை'
  },
  // GROUP 1: CORE ACADEMICS & REVISION
  subjects: {
    id: 'subjects',
    icon: BookOpen,
    enLabel: 'Subjects & Past Papers',
    siLabel: 'විෂයන් සහ ප්‍රශ්න පත්‍ර',
    taLabel: 'பாடங்கள் & வினாத்தாள்கள்'
  },
  quizzes: {
    id: 'quizzes',
    icon: FileQuestion,
    enLabel: 'MCQ Quizzes & Test Series',
    siLabel: 'එම්.සී.කියු. ප්‍රශ්න',
    taLabel: 'பன்மைத் தெரிவு வினாக்கள்',
    badgeText: 'LIVE',
    badgeType: 'live'
  },
  classroom: {
    id: 'classroom',
    icon: Video,
    enLabel: 'HD Video Classroom',
    siLabel: 'වීඩියෝ පාඩම්',
    taLabel: 'வீடியோ வகுப்பறை'
  },
  offline_syllabus: {
    id: 'offline_syllabus',
    icon: HardDriveDownload,
    enLabel: 'Offline Syllabus & PDFs',
    siLabel: 'විෂය නිර්දේශ සහ PDF',
    taLabel: 'பாடத்திட்டம் & PDF',
    badgeText: 'FREE',
    badgeType: 'free'
  },

  // GROUP 2: AI STUDY ASSISTANTS
  smart_evaluator: {
    id: 'smart_evaluator',
    icon: ScanLine,
    enLabel: 'AI File Evaluator & Mind-Maps',
    siLabel: 'AI ගොනු ඇගයුම්කරු & මනෝ සිතියම්',
    taLabel: 'AI கோப்பு மதிப்பீட்டாளர் & மன வரைபடம்',
    badgeText: 'NEW',
    badgeType: 'new'
  },
  ai_tutor: {
    id: 'ai_tutor',
    icon: Bot,
    enLabel: 'AI Tutor & Voice Chat',
    siLabel: 'AI ගුරු සහකාර',
    taLabel: 'AI குரல் ஆசிரியர்',
    badgeText: 'LIVE',
    badgeType: 'live'
  },
  planner: {
    id: 'planner',
    icon: Calendar,
    enLabel: 'AI Study Planner',
    siLabel: 'පාඩම් කාලසටහන',
    taLabel: 'AI படிப்புத் திட்டம்',
    badgeText: 'NEW',
    badgeType: 'new'
  },
  flashcards: {
    id: 'flashcards',
    icon: Layers,
    enLabel: 'Smart Flashcards',
    siLabel: 'ක්ෂණික මතක කාඩ්',
    taLabel: 'ஃபிளாஷ்கார்டுகள்'
  },
  audio: {
    id: 'audio',
    icon: Headphones,
    enLabel: 'Voice Notes & Audio',
    siLabel: 'ශ්‍රව්‍ය සටහන්',
    taLabel: 'குரல் குறிப்புகள்'
  },

  // GROUP 3: LANGUAGES & SKILLS
  language_adventure: {
    id: 'language_adventure',
    icon: Sparkles,
    enLabel: 'Language Learning Adventure',
    siLabel: 'භාෂා ඉගෙනුම් චාරිකාව',
    taLabel: 'மொழி கற்றல் சாகசம்',
    badgeText: 'NEW',
    badgeType: 'new'
  },
  modern_languages: {
    id: 'modern_languages',
    icon: Languages,
    enLabel: 'Modern & Foreign Languages',
    siLabel: 'විදේශ භාෂා',
    taLabel: 'நவீன & வெளிநாட்டு மொழிகள்',
    badgeText: 'NEW',
    badgeType: 'new'
  },
  fun_english: {
    id: 'fun_english',
    icon: Smile,
    enLabel: 'Fun English & Practice',
    siLabel: 'ඉංග්‍රීසි පුහුණුව',
    taLabel: 'வேடிக்கையான ஆங்கிலம்'
  },
  free_courses: {
    id: 'free_courses',
    icon: Compass,
    enLabel: 'Free Online Courses',
    siLabel: 'නොමිලේ පාඨමාලා',
    taLabel: 'இலவசப் படிப்புகள்',
    badgeText: 'FREE',
    badgeType: 'free'
  },

  // GROUP 4: PROGRESS & STUDENT HUB
  analytics: {
    id: 'analytics',
    icon: BarChart3,
    enLabel: 'Performance Analytics',
    siLabel: 'ප්‍රගති වාර්තාව',
    taLabel: 'செயல்திறන් பகுப்பாய்வு'
  },
  campus: {
    id: 'campus',
    icon: GraduationCap,
    enLabel: 'Campus & Z-Score Info',
    siLabel: 'සරසවි සහ Z-Score',
    taLabel: 'பல்கலைக்கழகம் & Z-புள்ளி'
  },
  university: {
    id: 'university',
    icon: Sparkles,
    enLabel: 'University AI Portal',
    siLabel: 'සරසවි AI සහකාර',
    taLabel: 'பல்கலைக்கழக AI தளம்',
    badgeText: 'NEW',
    badgeType: 'new'
  },
  news: {
    id: 'news',
    icon: Newspaper,
    enLabel: 'Exam News & Alerts',
    siLabel: 'විභාග පුවත්',
    taLabel: 'தேர்வுச் செய்திகள்'
  },
  google_hub: {
    id: 'google_hub',
    icon: Globe,
    enLabel: 'Student Community Hub',
    siLabel: 'සිසු පියස',
    taLabel: 'மாணவர் தளம்'
  },
  book_shop: {
    id: 'book_shop',
    icon: ShoppingBag,
    enLabel: 'SipArana Book Shop',
    siLabel: 'පොත් හල',
    taLabel: 'புத்தக சந்தை'
  },

  // Other utilities
  utilities: {
    id: 'utilities',
    icon: Wrench,
    enLabel: 'Study Utilities',
    siLabel: 'පාඩම් මෙවලම්',
    taLabel: 'படிப்பு கருவிகள்'
  },
  key_players: {
    id: 'key_players',
    icon: Crown,
    enLabel: 'Key Players',
    siLabel: 'විශිෂ්ටයින් (Key Players)',
    taLabel: 'சிறந்த சாதனையாளர்கள்',
    badgeText: 'TOP 10',
    badgeType: 'default'
  },
  premium: {
    id: 'key_players',
    icon: Crown,
    enLabel: 'Key Players',
    siLabel: 'විශිෂ්ටයින් (Key Players)',
    taLabel: 'சிறந்த சாதனையாளர்கள்'
  },
  settings: {
    id: 'settings',
    icon: Settings,
    enLabel: 'Settings & Profile',
    siLabel: 'සැකසුම් & පැතිකඩ',
    taLabel: 'அமைப்புகள் & சுயவிவரம்'
  }
};

export default function Layout({ current, onNavigate, children }: LayoutProps) {
  const { profile, logout, setGradeAndStream, toggleStudentCategory } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { country, curriculum, dictionary, countryCode, stages } = useCountry();
  const { notices, readIds, markAsRead } = useExamNews();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showAutonomousModal, setShowAutonomousModal] = useState(false);
  const [showGlobalCountryModal, setShowGlobalCountryModal] = useState(false);
  const [showChestModal, setShowChestModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakModalTab, setStreakModalTab] = useState<'streak' | 'xp' | 'badges'>('streak');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Click outside refs
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target as Node)) {
        setShowGradeDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    academics: false,
    ai_assistants: false,
    languages_skills: false,
    progress_hub: false,
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const activeCountryObj = country;

  const unreadNotices = notices.filter(n => !readIds.includes(n.id));
  const unreadCount = unreadNotices.length;

  const handleMarkAllAsRead = () => {
    notices.forEach(n => markAsRead(n.id));
  };

  const handleNotificationClick = (noticeId: string) => {
    markAsRead(noticeId);
    setShowNotifications(false);
    onNavigate('news');
  };

  const isUniversityStudent = profile?.studentCategory === 'University' || profile?.level === 'CAMPUS';
  const isGrade5 = profile?.grade === 5 || profile?.level === 'SCHOLARSHIP' || profile?.stream === 'Grade 5 Scholarship' || !!profile?.isKidMode;

  const GRADE5_ALLOWED_PAGES: PageId[] = [
    'dashboard',
    'smart_evaluator',
    'subjects',
    'planner',
    'flashcards',
    'audio',
    'language_adventure',
    'fun_english',
    'quizzes',
    'ai_tutor',
    'offline_syllabus',
    'key_players',
    'settings'
  ];

  // Strictly enforce page isolation if user is on a forbidden page
  React.useEffect(() => {
    if (isGrade5 && !GRADE5_ALLOWED_PAGES.includes(current)) {
      onNavigate('dashboard');
    }
  }, [isGrade5, current, onNavigate]);

  const navGroups: NavGroupDef[] = React.useMemo(() => {
    if (isGrade5) {
      return [
        {
          id: 'academics',
          icon: '🎓',
          enTitle: 'CORE ACADEMICS & REVISION',
          siTitle: 'අධ්‍යයන & ප්‍රශ්න පත්‍ර',
          taTitle: 'பாடங்கள் & வினாத்தாள்கள்',
          pastelBg: 'bg-blue-50/80 dark:bg-blue-950/40',
          pastelBorder: 'border-blue-200/70 dark:border-blue-800/50',
          pastelText: 'text-blue-800 dark:text-blue-200',
          items: [
            { ...RAW_NAV_ITEMS.subjects, enLabel: '4 Core Subjects & Guru Potha', siLabel: '5 වසර විෂයන් සහ ගුරු පොත' },
            { ...RAW_NAV_ITEMS.quizzes, enLabel: 'IQ & Scholarship Quizzes', siLabel: 'බුද්ධි පරීක්ෂණ & ප්‍රශ්න' },
            { ...RAW_NAV_ITEMS.offline_syllabus, enLabel: 'Grade 5 Teacher Guides (PDF)', siLabel: '5 වසර ගුරු පොත් සහ PDF' }
          ]
        },
        {
          id: 'ai_assistants',
          icon: '🤖',
          enTitle: 'AI STUDY ASSISTANTS',
          siTitle: 'ස්මාර්ට් AI මෙවලම්',
          taTitle: 'AI படிப்பு உதவியாளர்கள்',
          pastelBg: 'bg-purple-50/80 dark:bg-purple-950/40',
          pastelBorder: 'border-purple-200/70 dark:border-purple-800/50',
          pastelText: 'text-purple-800 dark:text-purple-200',
          items: [
            RAW_NAV_ITEMS.smart_evaluator,
            { ...RAW_NAV_ITEMS.ai_tutor, enLabel: 'Kavi Owl AI Tutor', siLabel: 'කවි බකමූණා AI ගුරු සහකාර' },
            { ...RAW_NAV_ITEMS.planner, enLabel: 'My Study Routine', siLabel: 'මගේ පාඩම් කාලසටහන' },
            { ...RAW_NAV_ITEMS.flashcards, enLabel: 'Scholarship Flashcards', siLabel: 'ක්ෂණික මතක කාඩ්' },
            { ...RAW_NAV_ITEMS.audio, enLabel: 'Voice Stories & Audio Notes', siLabel: 'ශ්‍රව්‍ය සටහන් & කතා' }
          ]
        },
        {
          id: 'languages_skills',
          icon: '🌐',
          enTitle: 'LANGUAGES & SKILLS',
          siTitle: 'භාෂා සහ ඉගෙනුම්',
          taTitle: 'மொழிகள் & திறன்கள்',
          pastelBg: 'bg-amber-50/80 dark:bg-amber-950/40',
          pastelBorder: 'border-amber-200/70 dark:border-amber-800/50',
          pastelText: 'text-amber-800 dark:text-amber-200',
          items: [
            RAW_NAV_ITEMS.language_adventure,
            { ...RAW_NAV_ITEMS.fun_english, enLabel: 'Fun English & Relax', siLabel: 'ඉංග්‍රීසි පුහුණුව & විවේකය' }
          ]
        }
      ];
    }

    return [
      {
        id: 'academics',
        icon: '🎓',
        enTitle: 'CORE ACADEMICS & REVISION',
        siTitle: 'අධ්‍යයන & ප්‍රශ්න පත්‍ර',
        taTitle: 'பாடங்கள் & வினாத்தாள்கள்',
        pastelBg: 'bg-blue-50/80 dark:bg-blue-950/40',
        pastelBorder: 'border-blue-200/70 dark:border-blue-800/50',
        pastelText: 'text-blue-800 dark:text-blue-200',
        items: [
          RAW_NAV_ITEMS.subjects,
          RAW_NAV_ITEMS.quizzes,
          RAW_NAV_ITEMS.classroom,
          RAW_NAV_ITEMS.offline_syllabus
        ]
      },
      {
        id: 'ai_assistants',
        icon: '🤖',
        enTitle: 'AI STUDY ASSISTANTS',
        siTitle: 'ස්මාර්ට් AI මෙවලම්',
        taTitle: 'AI படிப்பு உதவியாளர்கள்',
        pastelBg: 'bg-purple-50/80 dark:bg-purple-950/40',
        pastelBorder: 'border-purple-200/70 dark:border-purple-800/50',
        pastelText: 'text-purple-800 dark:text-purple-200',
        items: [
          RAW_NAV_ITEMS.smart_evaluator,
          RAW_NAV_ITEMS.ai_tutor,
          RAW_NAV_ITEMS.planner,
          RAW_NAV_ITEMS.flashcards,
          RAW_NAV_ITEMS.audio
        ]
      },
      {
        id: 'languages_skills',
        icon: '🌐',
        enTitle: 'LANGUAGES & SKILLS',
        siTitle: 'භාෂා සහ ඉගෙනුම්',
        taTitle: 'மொழிகள் & திறன்கள்',
        pastelBg: 'bg-amber-50/80 dark:bg-amber-950/40',
        pastelBorder: 'border-amber-200/70 dark:border-amber-800/50',
        pastelText: 'text-amber-800 dark:text-amber-200',
        items: [
          RAW_NAV_ITEMS.language_adventure,
          RAW_NAV_ITEMS.modern_languages,
          RAW_NAV_ITEMS.fun_english,
          RAW_NAV_ITEMS.free_courses
        ]
      },
      {
        id: 'progress_hub',
        icon: '📊',
        enTitle: 'PROGRESS & STUDENT HUB',
        siTitle: 'ප්‍රගතිය සහ තොරතුරු',
        taTitle: 'முன்னேற்றம் & தளம்',
        pastelBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
        pastelBorder: 'border-emerald-200/70 dark:border-emerald-800/50',
        pastelText: 'text-emerald-800 dark:text-emerald-200',
        items: [
          RAW_NAV_ITEMS.key_players,
          RAW_NAV_ITEMS.analytics,
          isUniversityStudent ? RAW_NAV_ITEMS.university : RAW_NAV_ITEMS.campus,
          {
            ...RAW_NAV_ITEMS.news,
            badgeText: unreadCount > 0 ? `${unreadCount} NEW` : undefined,
            badgeType: 'new'
          },
          RAW_NAV_ITEMS.google_hub,
          RAW_NAV_ITEMS.book_shop
        ]
      }
    ];
  }, [isGrade5, isUniversityStudent, unreadCount]);

  const getNavLabel = (item: NavItemDef) => {
    if (language === 'si') return item.siLabel;
    if (language === 'ta' && item.taLabel) return item.taLabel;
    return item.enLabel;
  };

  const getSubLabel = (item: NavItemDef) => {
    if (language === 'si') return item.enLabel;
    return item.siLabel;
  };

  const getGroupTitle = (grp: NavGroupDef) => {
    if (language === 'si') return grp.siTitle;
    if (language === 'ta' && grp.taTitle) return grp.taTitle;
    return grp.enTitle;
  };

  const getGroupSubTitle = (grp: NavGroupDef) => {
    if (language === 'si') return grp.enTitle;
    return grp.siTitle;
  };

  const renderBadge = (item: NavItemDef, isActive: boolean) => {
    if (!item.badgeText) return null;
    if (isActive) {
      return (
        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white shadow-xs">
          {item.badgeText}
        </span>
      );
    }

    if (item.badgeType === 'live') {
      return (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/50 flex items-center gap-1 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {item.badgeText}
        </span>
      );
    }

    if (item.badgeType === 'new') {
      return (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 shadow-2xs">
          {item.badgeText}
        </span>
      );
    }

    if (item.badgeType === 'free') {
      return (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-800/50 shadow-2xs">
          {item.badgeText}
        </span>
      );
    }

    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        {item.badgeText}
      </span>
    );
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
                  {dictionary.countryCode}
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {dictionary.subTitleHeader}
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
        <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto custom-scrollbar">
          {/* Main Dashboard Button */}
          {(() => {
            const dashItem = RAW_NAV_ITEMS.dashboard;
            const Icon = dashItem.icon;
            const isActive = current === 'dashboard';
            return (
              <button
                id="nav-item-dashboard"
                onClick={() => onNavigate('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? isGrade5
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs shadow-orange-500/25 ring-1 ring-amber-400/50'
                      : 'bg-blue-600 text-white shadow-xs shadow-blue-500/25 ring-1 ring-blue-500/50'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isGrade5
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="font-bold text-[13px]">{getNavLabel(dashItem)}</div>
                    <span
                      className={`text-[10px] block font-normal leading-none mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {getSubLabel(dashItem)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })()}

          {/* Categorized Groups */}
          {navGroups.map((group) => {
            const isCollapsed = !!collapsedGroups[group.id];
            const hasActiveChild = group.items.some((it) => it.id === current);
            return (
              <div
                key={group.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  group.pastelBorder
                } ${group.pastelBg} p-1.5 shadow-2xs`}
              >
                {/* Section Header Accordion Trigger */}
                <button
                  type="button"
                  id={`nav-group-toggle-${group.id}`}
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm select-none">{group.icon}</span>
                    <div className="min-w-0">
                      <span
                        className={`text-[11px] font-black tracking-wide uppercase block truncate ${group.pastelText}`}
                      >
                        {getGroupTitle(group)}
                      </span>
                      <span className="text-[9.5px] font-medium text-slate-500 dark:text-slate-400 block leading-none truncate">
                        {getGroupSubTitle(group)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 text-slate-400">
                    {hasActiveChild && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    {isCollapsed ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Group Items */}
                {!isCollapsed && (
                  <div className="mt-1 space-y-0.5 pt-0.5 border-t border-black/5 dark:border-white/5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = current === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`nav-item-${item.id}`}
                          onClick={() => onNavigate(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                            isActive
                              ? isGrade5
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs font-semibold'
                                : 'bg-blue-600 text-white shadow-xs font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-2xs font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive
                                  ? 'text-white'
                                  : isGrade5
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            />
                            <div className="text-left min-w-0 leading-tight">
                              <div className="text-[12.5px] font-semibold truncate">
                                {getNavLabel(item)}
                              </div>
                              <span
                                className={`text-[10px] block font-normal leading-none mt-0.5 truncate ${
                                  isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
                                }`}
                              >
                                {getSubLabel(item)}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 ml-1.5">
                            {renderBadge(item, isActive)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Settings & Key Players footer shortcuts */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            {/* Key Players Button */}
            <button
              id="nav-item-key-players"
              onClick={() => onNavigate('key_players')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                current === 'key_players' || current === 'premium'
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left leading-tight min-w-0">
                  <div className="text-[12.5px] font-bold flex items-center gap-1">
                    <span>{language === 'si' ? 'විශිෂ්ටයින් (Key Players)' : 'Key Players'}</span>
                  </div>
                  <span className="text-[9.5px] opacity-85 block truncate">
                    {language === 'si' ? 'ඉහළම සාධකයින් & ජයග්‍රාහක පුවරුව' : 'Top Achievers & Leaderboard'}
                  </span>
                </div>
              </div>
              <span className="text-sm flex-shrink-0 ml-1">👑</span>
            </button>

            {/* Settings Button */}
            <button
              id="nav-item-settings"
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                current === 'settings'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-500" />
                <div className="text-left leading-tight">
                  <div className="text-[12.5px] font-semibold">
                    {getNavLabel(RAW_NAV_ITEMS.settings)}
                  </div>
                  <span className="text-[9.5px] text-slate-400 block">
                    {getSubLabel(RAW_NAV_ITEMS.settings)}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </nav>

        {/* Bottom Banner & Log Out */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {dictionary.curriculumTrackerTitle}
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-[10px]">
                {isUniversityStudent ? (profile?.universityShort || 'Uni') : `${dictionary.countryCode} • Gr ${profile?.grade || 11}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
              {dictionary.curriculumTrackerDesc}
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
            {/* 1. Quick Grade Switcher Dropdown */}
            {profile && !isUniversityStudent && (
              <div className="relative" ref={gradeDropdownRef}>
                <button
                  id="grade-switcher-btn"
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setShowGradeDropdown(!showGradeDropdown);
                  }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/80 transition max-w-[140px] sm:max-w-none cursor-pointer"
                  title="Change Active Grade / Stage"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    {countryCode === 'LK'
                      ? (language === 'si' ? `${profile.grade} වසර` : language === 'ta' ? `தரம் ${profile.grade}` : `Grade ${profile.grade}`)
                      : countryCode === 'UK'
                      ? `Year ${profile.grade}`
                      : countryCode === 'JP'
                      ? (profile.grade >= 10 ? `高校 ${profile.grade - 9}年` : `中学 ${profile.grade - 6}年`)
                      : `Grade ${profile.grade}`}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70 flex-shrink-0" />
                </button>

                {showGradeDropdown && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-2 flex items-center justify-between">
                      <span>{language === 'si' ? 'අධ්‍යාපන මට්ටම තෝරන්න' : `${country.name} Stages & Grades`}</span>
                      <span className="text-blue-500 font-extrabold">{country.code}</span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {stages.map((stg) => {
                        const isStageActive = stg.targetGrades.includes(profile.grade);
                        const stageLabel = (language === 'si' && stg.nameLocal) ? stg.nameLocal : stg.name;
                        return (
                          <div key={stg.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                            <div className="px-1 flex items-center justify-between text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                              <span>{stageLabel}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">{stg.typicalAge}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {stg.targetGrades.map((gNum) => {
                                const isCurrent = profile.grade === gNum;
                                const gradeName = countryCode === 'UK'
                                  ? `Year ${gNum}`
                                  : countryCode === 'JP'
                                  ? (gNum >= 10 ? `高${gNum - 9}` : `中${gNum - 6}`)
                                  : countryCode === 'LK' && language === 'si'
                                  ? `${gNum} වසර`
                                  : `Grade ${gNum}`;
                                return (
                                  <button
                                    key={gNum}
                                    type="button"
                                    onClick={() => {
                                      soundFX.playCorrect();
                                      setGradeAndStream(gNum as SchoolGrade, (gNum >= 12 ? (profile.stream || 'Physical Science') : stg.defaultStream) as Stream);
                                      setShowGradeDropdown(false);
                                    }}
                                    className={`px-2 py-1.5 rounded-lg text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                                      isCurrent
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800'
                                    }`}
                                  >
                                    <span>{gradeName}</span>
                                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Stream selector for A/L (Grades 12-13) */}
                            {profile.grade >= 12 && isStageActive && (
                              <div className="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block px-1">
                                  {language === 'si' ? 'A/L විෂය ධාරාව තෝරන්න:' : 'Select A/L Stream:'}
                                </span>
                                <div className="grid grid-cols-1 gap-1">
                                  {[
                                    { id: 'Physical Science', label: 'Physical Science (Maths)', labelSi: 'භෞතික විද්‍යා (සංයුක්ත ගණිතය)' },
                                    { id: 'Biological Science', label: 'Biological Science (Bio)', labelSi: 'ජීව විද්‍යා ධාරාව' },
                                    { id: 'Commerce', label: 'Commerce Stream', labelSi: 'වාණිජ ධාරාව' },
                                    { id: 'Technology', label: 'Technology Stream', labelSi: 'තාක්ෂණවේදය ධාරාව' },
                                    { id: 'Arts', label: 'Arts & Humanities', labelSi: 'කලා ධාරාව' }
                                  ].map(str => (
                                    <button
                                      key={str.id}
                                      type="button"
                                      onClick={() => {
                                        soundFX.playCorrect();
                                        setGradeAndStream(profile.grade, str.id as Stream);
                                        setShowGradeDropdown(false);
                                      }}
                                      className={`px-2 py-1 rounded-md text-[11px] font-semibold text-left flex items-center justify-between transition cursor-pointer ${
                                        profile.stream === str.id
                                          ? 'bg-amber-500 text-slate-950 font-bold'
                                          : 'hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                      }`}
                                    >
                                      <span>{language === 'si' ? str.labelSi : str.label}</span>
                                      {profile.stream === str.id && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Global Country & Curriculum Switcher Trigger */}
            <button
              type="button"
              id="header-global-country-btn"
              onClick={() => {
                soundFX.playClick();
                setShowGlobalCountryModal(true);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-xl text-blue-900 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
              title="Change Country & Global Curriculum Framework"
            >
              <span className="text-sm sm:text-base">{activeCountryObj.flag}</span>
              <span className="hidden md:inline text-[11px] font-black">{activeCountryObj.code}</span>
              <span className="hidden lg:inline text-[10px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-extrabold">
                {profile?.curriculumId?.toUpperCase() || 'NIE'}
              </span>
            </button>

            {/* 3. Autonomous AI Core Status & Toggle Trigger */}
            <button
              type="button"
              id="header-autonomous-sync-btn"
              onClick={() => {
                soundFX.playClick();
                setShowAutonomousModal(true);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-emerald-500/15 dark:from-amber-950/40 dark:via-blue-950/30 dark:to-emerald-950/40 border border-amber-400/60 dark:border-amber-500/50 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-black hover:border-amber-500 transition shadow-2xs cursor-pointer"
              title="Autonomous Syllabus & Real-Time Sync Hub"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-pulse" />
              <span className="hidden sm:inline">
                {language === 'si' ? 'ස්වයංක්‍රීය AI විෂය පියස' : 'Autonomous AI Core'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            </button>

            {/* 4. Daily Mystery Chest Trigger */}
            <button
              type="button"
              id="header-mystery-chest-btn"
              onClick={() => {
                soundFX.playPop();
                setShowChestModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 dark:from-amber-950/60 dark:via-purple-950/50 dark:to-indigo-950/60 border border-amber-400/70 dark:border-amber-500/60 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-black hover:scale-105 transition-all shadow-xs cursor-pointer group"
              title="Open Daily Mystery Chest Rewards!"
            >
              <span className="text-sm group-hover:scale-125 transition-transform">🎁</span>
              <span className="hidden sm:inline font-black">
                {language === 'si' ? 'අභිරහස් තිළිණ' : 'Mystery Chest'}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </button>

            {/* 5. Study Streak indicator - Clickable with Modal */}
            {profile && (
              <button
                type="button"
                id="streak-badge"
                onClick={() => {
                  soundFX.playStreak();
                  setStreakModalTab('streak');
                  setShowStreakModal(true);
                }}
                title={`${profile.streakDays} Days Study Streak! Tap to view milestones.`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-black shadow-xs hover:border-amber-400 hover:scale-103 transition cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 animate-pulse flex-shrink-0" />
                <span>{profile.streakDays}d</span>
                <span className="hidden sm:inline text-[11px] font-normal text-amber-600 dark:text-amber-400">
                  {t('streak')}
                </span>
              </button>
            )}

            {/* 6. XP Points Button - Clickable to open Level Progression */}
            {profile && (
              <button
                type="button"
                id="xp-badge"
                onClick={() => {
                  soundFX.playPop();
                  setStreakModalTab('xp');
                  setShowStreakModal(true);
                }}
                title={`${profile.xp} Study XP Points. Click to view level progression & badges.`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold transition cursor-pointer hover:scale-103"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                <span>{profile.xp.toLocaleString()}</span>
                <span className="hidden sm:inline text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                  {t('xpPoints')}
                </span>
              </button>
            )}

            {/* 7. Modern Header Language Selector */}
            <HeaderLanguageSelector variant="dropdown" idPrefix="nav-header-lang" align="right" />

            {/* 8. Theme Switch */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={() => {
                soundFX.playPop();
                toggleTheme();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Toggle Light / Dark theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* 9. Notifications Button & Popover */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                id="notifications-toggle-btn"
                onClick={() => {
                  soundFX.playClick();
                  setShowNotifications(!showNotifications);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition flex items-center justify-center cursor-pointer"
                title={t('notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    id="notifications-unread-badge"
                    className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-84 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {language === 'si' ? 'විභාග සහ අධ්‍යාපනික නිවේදන' : language === 'ta' ? 'தேர்வு மற்றும் கல்வி அறிவிப்புகள்' : 'Exam & Study Alerts'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        {language === 'si' ? 'සියල්ල කියවූ බව සලකුණු කරන්න' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 text-xs my-1 pr-1">
                    {notices.slice(0, 5).map((notice) => {
                      const isUnread = !readIds.includes(notice.id);
                      return (
                        <div
                          key={notice.id}
                          onClick={() => handleNotificationClick(notice.id)}
                          className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex flex-col gap-1 ${
                            isUnread
                              ? 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                {notice.authorityCode}
                              </span>
                              {notice.isUrgent && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                  Urgent
                                </span>
                              )}
                              {notice.isBreaking && (
                                <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-[10px] font-bold text-red-700 dark:text-red-400">
                                  Breaking
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {notice.publishedDate}
                            </span>
                          </div>

                          <p className={`text-xs leading-snug line-clamp-2 ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                            {language === 'si' ? notice.titleSinhala : language === 'ta' ? notice.tamilSummary : notice.title}
                          </p>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {language === 'si' ? notice.sinhalaSummary : notice.summary}
                          </p>
                        </div>
                      );
                    })}

                    {notices.length === 0 && (
                      <div className="py-6 text-center text-slate-400 text-xs">
                        {language === 'si' ? 'දැනට නව නිවේදන නොමැත' : 'No new notices at this time.'}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('news');
                      }}
                      className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition cursor-pointer"
                    >
                      {language === 'si' ? 'සියලු විභාග චක්‍රලේඛ සහ නිවේදන බලන්න →' : 'View All Exam Bulletins & Circulars →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 10. User Profile Avatar & Dropdown Menu */}
            {profile && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  id="header-profile-btn"
                  onClick={() => {
                    soundFX.playClick();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className="flex items-center gap-2 pl-0.5 sm:pl-1 hover:opacity-80 transition flex-shrink-0 cursor-pointer"
                  title={`${profile.name} - Profile & Settings Menu`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500 hover:ring-amber-400 transition"
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                    {/* User Header */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {profile.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {profile.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs">{activeCountryObj.flag}</span>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            Grade {profile.grade} {profile.stream ? `• ${profile.stream}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Players & Free Scholar Status */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playPop();
                        setShowProfileDropdown(false);
                        onNavigate('key_players');
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/10 border border-amber-400/50 flex items-center justify-between text-left cursor-pointer hover:border-amber-400 transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                          <Crown className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-300" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <span>Key Players Hall of Fame</span>
                            <span className="text-xs">👑</span>
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            {language === 'si' ? 'ඉහළම සාධකයින් & ඔබේ ශ්‍රේණිගත කිරීම' : 'Top Achievers & Your Live Rank'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                        <span>TOP 10</span>
                      </span>
                    </button>

                    {/* Navigation items */}
                    <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          onNavigate('settings');
                        }}
                        className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>{language === 'si' ? 'මගේ ගිණුම් සැකසුම් (Account)' : 'My Account Settings'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setStreakModalTab('badges');
                          setShowStreakModal(true);
                        }}
                        className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{language === 'si' ? 'ත්‍යාග සහ ගෞරව සම්මාන (Honors)' : 'Rewards & Badges Showcase'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setShowAutonomousModal(true);
                        }}
                        className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Cpu className="w-4 h-4 text-emerald-500" />
                        <span>{language === 'si' ? 'AI එන්ජින් තත්ත්වය (AI Core Specs)' : 'Autonomous AI Core Status'}</span>
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playPop();
                          setShowProfileDropdown(false);
                          logout();
                        }}
                        className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{t('signOut')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                    <div className="flex items-center gap-1">
                      <span className="font-black text-base tracking-wider uppercase font-serif text-slate-900 dark:text-white leading-none">
                        SIPARANA
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded font-extrabold bg-blue-600 text-white">
                        {dictionary.countryCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate max-w-[140px]">
                      {dictionary.subTitleHeader}
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
              <div className="py-3 px-1 border-b border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{t('selectLanguage') || 'Select Language'}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">{language.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isActive = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        id={`drawer-lang-${lang.code}-btn`}
                        onClick={() => {
                          soundFX.playCorrect();
                          setLanguage(lang.code as AppLanguage);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-sm leading-none">{lang.flag}</span>
                        <span className="text-[10px] truncate max-w-full leading-tight font-extrabold">{lang.nativeName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 py-3 space-y-2.5 overflow-y-auto custom-scrollbar">
                {/* Dashboard item */}
                {(() => {
                  const dashItem = RAW_NAV_ITEMS.dashboard;
                  const Icon = dashItem.icon;
                  const isActive = current === 'dashboard';
                  return (
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? isGrade5
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold'
                            : 'bg-blue-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <div className="text-left">
                          <div>{getNavLabel(dashItem)}</div>
                          <span className="text-[9.5px] opacity-75 block font-normal">{getSubLabel(dashItem)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })()}

                {/* Groups */}
                {navGroups.map((group) => {
                  const isCollapsed = !!collapsedGroups[group.id];
                  return (
                    <div
                      key={group.id}
                      className={`rounded-2xl border ${group.pastelBorder} ${group.pastelBg} p-1.5`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-xl text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm">{group.icon}</span>
                          <span className={`text-[11px] font-black uppercase truncate ${group.pastelText}`}>
                            {getGroupTitle(group)}
                          </span>
                        </div>
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
                      </button>

                      {!isCollapsed && (
                        <div className="mt-1 space-y-0.5 pt-1 border-t border-black/5 dark:border-white/5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = current === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  onNavigate(item.id);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition ${
                                  isActive
                                    ? isGrade5
                                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold'
                                      : 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                                  <div className="text-left min-w-0">
                                    <div className="font-semibold truncate text-[12px]">{getNavLabel(item)}</div>
                                    <span className="text-[9px] opacity-75 block font-normal truncate">{getSubLabel(item)}</span>
                                  </div>
                                </div>
                                {renderBadge(item, isActive)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Settings & Key Players */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('key_players');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-amber-900 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600 dark:text-amber-300" />
                      </div>
                      <div className="text-left leading-tight">
                        <span className="block">{language === 'si' ? 'Key Players (විශිෂ්ටයින්)' : 'Key Players'}</span>
                        <span className="text-[9px] font-normal opacity-80 block">{language === 'si' ? 'ජයග්‍රාහක පුවරුව' : 'Top Achievers & Leaderboard'}</span>
                      </div>
                    </div>
                    <span className="text-sm">👑</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>{getNavLabel(RAW_NAV_ITEMS.settings)}</span>
                  </button>
                </div>
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

      {/* Autonomous NIE Curriculum Sync & Diagnostics Modal */}
      <AutonomousCurriculumSyncModal
        isOpen={showAutonomousModal}
        onClose={() => setShowAutonomousModal(false)}
        onNavigate={onNavigate}
      />

      {/* Global Country & Autonomous Curriculum Engine Modal */}
      <GlobalCountryCurriculumModal
        isOpen={showGlobalCountryModal}
        onClose={() => setShowGlobalCountryModal(false)}
      />

      {/* Daily Mystery Loot Chest Modal */}
      <DailyMysteryChestModal
        isOpen={showChestModal}
        onClose={() => setShowChestModal(false)}
      />

      {/* Daily Streak, XP Level & Rewards Modal */}
      <DailyStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        onClaimMysteryChest={() => setShowChestModal(true)}
        initialTab={streakModalTab}
      />
    </div>
  );
}
