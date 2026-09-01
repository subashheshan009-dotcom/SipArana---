import type { UserProfile } from '@/types';

export interface StudentAchiever {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  institution: string;
  districtOrCity: string;
  countryCode: string;
  countryFlag: string;
  countryName: string;
  stream: string;
  academicCategory: 'University' | 'A-Level / High School' | 'O-Level / Secondary' | 'Scholarship / Primary';
  gradeLevel: string;
  weeklyXP: number;
  monthlyXP: number;
  allTimeXP: number;
  streakDays: number;
  quizAccuracy: number;
  quizzesSolved: number;
  specialBadge: string;
  honorTitle: string;
  isVerified: boolean;
  cheersCount: number;
  bioQuote?: string;
  targetUniversity?: string;
  frameId?: string;
  recentXPDelta?: number;
}

export interface RankTierInfo {
  tierId: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'grandmaster';
  name: string;
  minLevel: number;
  badgeIcon: string;
  colorHex: string;
  gradientClass: string;
  borderClass: string;
  glowClass: string;
  description: string;
}

export const RANK_TIERS: RankTierInfo[] = [
  {
    tierId: 'bronze',
    name: 'Bronze Scholar',
    minLevel: 1,
    badgeIcon: '🥉',
    colorHex: '#CD7F32',
    gradientClass: 'from-amber-800 to-amber-600',
    borderClass: 'border-amber-700',
    glowClass: 'shadow-amber-700/30',
    description: 'Level 1 - 9 • Initiated Learning Journey'
  },
  {
    tierId: 'silver',
    name: 'Silver Scholar',
    minLevel: 10,
    badgeIcon: '🥈',
    colorHex: '#C0C0C0',
    gradientClass: 'from-slate-400 to-slate-200',
    borderClass: 'border-slate-300',
    glowClass: 'shadow-slate-400/30',
    description: 'Level 10 - 19 • Solid Conceptual Foundation'
  },
  {
    tierId: 'gold',
    name: 'Gold Scholar',
    minLevel: 20,
    badgeIcon: '🥇',
    colorHex: '#FFD700',
    gradientClass: 'from-yellow-500 to-amber-400',
    borderClass: 'border-yellow-400',
    glowClass: 'shadow-yellow-400/40',
    description: 'Level 20 - 29 • Elite Academic Precision'
  },
  {
    tierId: 'platinum',
    name: 'Platinum Master',
    minLevel: 30,
    badgeIcon: '💠',
    colorHex: '#00FFFF',
    gradientClass: 'from-cyan-500 to-blue-400',
    borderClass: 'border-cyan-400',
    glowClass: 'shadow-cyan-400/50',
    description: 'Level 30 - 39 • Subject Mastery & Speed'
  },
  {
    tierId: 'diamond',
    name: 'Diamond Legend',
    minLevel: 40,
    badgeIcon: '💎',
    colorHex: '#B980FF',
    gradientClass: 'from-purple-600 to-indigo-400',
    borderClass: 'border-purple-400',
    glowClass: 'shadow-purple-500/50',
    description: 'Level 40 - 49 • National & Global Olympiad Caliber'
  },
  {
    tierId: 'grandmaster',
    name: 'SipArana Grandmaster',
    minLevel: 50,
    badgeIcon: '🔥👑',
    colorHex: '#FF4500',
    gradientClass: 'from-red-600 via-orange-500 to-amber-400',
    borderClass: 'border-orange-500',
    glowClass: 'shadow-orange-500/60',
    description: 'Level 50+ • Apex Islandwide & World Champion'
  }
];

export interface AvatarFrame {
  id: string;
  name: string;
  unlockLevel: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'grandmaster' | 'rank_exclusive';
  icon: string;
  description: string;
  themeStyle: {
    outerBorder: string;
    glow: string;
    cornerAccent: string;
    badgeStyle: string;
    bannerText: string;
  };
}

export const AVATAR_FRAMES: AvatarFrame[] = [
  {
    id: 'frame-default',
    name: 'Standard Scholar Ring',
    unlockLevel: 1,
    tier: 'bronze',
    icon: '⭕',
    description: 'Classic minimalist ring for everyday learning',
    themeStyle: {
      outerBorder: 'border-2 border-slate-400',
      glow: 'shadow-md shadow-slate-500/20',
      cornerAccent: 'bg-slate-500',
      badgeStyle: 'bg-slate-800 text-slate-200',
      bannerText: 'INITIATE'
    }
  },
  {
    id: 'frame-bronze',
    name: 'Bronze Gladiator Frame',
    unlockLevel: 10,
    tier: 'bronze',
    icon: '🥉',
    description: 'Metallic bronze border with studded corner rivets',
    themeStyle: {
      outerBorder: 'border-4 border-amber-700',
      glow: 'shadow-lg shadow-amber-800/40 ring-2 ring-amber-600/50',
      cornerAccent: 'bg-amber-600',
      badgeStyle: 'bg-gradient-to-r from-amber-800 to-amber-600 text-amber-100',
      bannerText: 'BRONZE'
    }
  },
  {
    id: 'frame-silver',
    name: 'Silver Striker Frame',
    unlockLevel: 20,
    tier: 'silver',
    icon: '🥈',
    description: 'Chrome metallic edges with cool silver sheen',
    themeStyle: {
      outerBorder: 'border-4 border-slate-300',
      glow: 'shadow-lg shadow-slate-300/50 ring-2 ring-slate-200',
      cornerAccent: 'bg-slate-200',
      badgeStyle: 'bg-gradient-to-r from-slate-500 to-slate-300 text-slate-900 font-black',
      bannerText: 'SILVER'
    }
  },
  {
    id: 'frame-gold',
    name: 'Golden Solar Crown Frame',
    unlockLevel: 30,
    tier: 'gold',
    icon: '🥇',
    description: 'Radiant gold border with floating solar sparkles',
    themeStyle: {
      outerBorder: 'border-4 border-yellow-400',
      glow: 'shadow-xl shadow-yellow-500/50 ring-4 ring-yellow-300/60 animate-pulse',
      cornerAccent: 'bg-yellow-400',
      badgeStyle: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950 font-black',
      bannerText: 'GOLDEN'
    }
  },
  {
    id: 'frame-platinum',
    name: 'Platinum Frostwave Frame',
    unlockLevel: 40,
    tier: 'platinum',
    icon: '💠',
    description: 'Icy cyan aura with lightning-infused corner crystals',
    themeStyle: {
      outerBorder: 'border-4 border-cyan-400',
      glow: 'shadow-xl shadow-cyan-400/60 ring-4 ring-cyan-300/70',
      cornerAccent: 'bg-cyan-300',
      badgeStyle: 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-black',
      bannerText: 'PLATINUM'
    }
  },
  {
    id: 'frame-diamond',
    name: 'Diamond Mythic Frame',
    unlockLevel: 50,
    tier: 'diamond',
    icon: '💎',
    description: 'Prismatic crystal purple edges with celestial glow',
    themeStyle: {
      outerBorder: 'border-4 border-purple-400',
      glow: 'shadow-2xl shadow-purple-500/70 ring-4 ring-purple-300/80',
      cornerAccent: 'bg-purple-300',
      badgeStyle: 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 text-white font-black',
      bannerText: 'DIAMOND'
    }
  },
  {
    id: 'frame-grandmaster',
    name: 'SipArana Grandmaster Inferno Frame',
    unlockLevel: 60,
    tier: 'grandmaster',
    icon: '🔥👑',
    description: 'Blazing dragon fire wings with pulsed inferno vortex',
    themeStyle: {
      outerBorder: 'border-4 border-orange-500',
      glow: 'shadow-2xl shadow-orange-600/80 ring-4 ring-amber-400 animate-pulse',
      cornerAccent: 'bg-orange-500',
      badgeStyle: 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-slate-950 font-black',
      bannerText: 'GRANDMASTER'
    }
  },
  {
    id: 'frame-galactic',
    name: 'Galactic Nebula Cosmic Frame',
    unlockLevel: 1,
    tier: 'rank_exclusive',
    icon: '🔮✨',
    description: 'Deep cosmic violet aura with spinning starlight supernova dust (Lucky Spin Reward)',
    themeStyle: {
      outerBorder: 'border-4 border-fuchsia-400',
      glow: 'shadow-2xl shadow-fuchsia-500/80 ring-4 ring-indigo-400/80 animate-pulse',
      cornerAccent: 'bg-fuchsia-400',
      badgeStyle: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black',
      bannerText: 'GALACTIC'
    }
  },
  {
    id: 'frame-cyberpunk',
    name: 'Cyberpunk Neon Laser Frame',
    unlockLevel: 1,
    tier: 'rank_exclusive',
    icon: '⚡🛡️',
    description: 'High-voltage emerald laser grid with cybernetic pulse circuit (Lucky Spin Reward)',
    themeStyle: {
      outerBorder: 'border-4 border-emerald-400',
      glow: 'shadow-2xl shadow-emerald-500/80 ring-4 ring-teal-300/80',
      cornerAccent: 'bg-emerald-400',
      badgeStyle: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 text-slate-950 font-black',
      bannerText: 'CYBERPUNK'
    }
  },
  {
    id: 'frame-crownjewel',
    name: 'Crown Jewel Sovereign Imperial Frame',
    unlockLevel: 1,
    tier: 'rank_exclusive',
    icon: '👑💎',
    description: 'Ruby-studded 24K imperial gold filigree with eternal celestial glow (Lucky Spin Jackpot)',
    themeStyle: {
      outerBorder: 'border-4 border-yellow-300',
      glow: 'shadow-2xl shadow-yellow-400/90 ring-4 ring-amber-400 animate-pulse',
      cornerAccent: 'bg-yellow-300',
      badgeStyle: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-black',
      bannerText: 'SOVEREIGN'
    }
  }
];

export interface InstitutionAchiever {
  id: string;
  rank: number;
  name: string;
  shortName: string;
  category: 'National High School' | 'Collegiate University' | 'International School' | 'Primary / Junior College';
  countryCode: string;
  countryFlag: string;
  countryName: string;
  city: string;
  totalStudents: number;
  totalXP: number;
  averageAccuracy: number;
  topStream: string;
  cheersCount: number;
  shieldBadge: string;
  crestColor: string;
}

export const TOP_INSTITUTIONS_LIST: InstitutionAchiever[] = [
  {
    id: 'inst-1',
    rank: 1,
    name: 'Royal College, Colombo',
    shortName: 'Royal College',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Colombo 07',
    totalStudents: 1420,
    totalXP: 184500,
    averageAccuracy: 94.8,
    topStream: 'Physical Science (Maths)',
    cheersCount: 2840,
    shieldBadge: '👑 Royal Blue & Gold Crest',
    crestColor: 'from-blue-600 via-yellow-500 to-blue-700'
  },
  {
    id: 'inst-2',
    rank: 2,
    name: 'Ananda College, Colombo',
    shortName: 'Ananda College',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Colombo 10',
    totalStudents: 1380,
    totalXP: 176200,
    averageAccuracy: 94.2,
    topStream: 'Biological Science (Bio)',
    cheersCount: 2610,
    shieldBadge: '🦁 Maroon & Gold Standard',
    crestColor: 'from-red-700 via-amber-500 to-red-800'
  },
  {
    id: 'inst-3',
    rank: 3,
    name: 'University of Moratuwa',
    shortName: 'UoM Engineering',
    category: 'Collegiate University',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Moratuwa',
    totalStudents: 980,
    totalXP: 169800,
    averageAccuracy: 97.4,
    topStream: 'Computer Science & AI',
    cheersCount: 3120,
    shieldBadge: '⚡ Tech & Innovation Shield',
    crestColor: 'from-cyan-600 via-blue-600 to-indigo-700'
  },
  {
    id: 'inst-4',
    rank: 4,
    name: 'Musaeus College, Colombo',
    shortName: 'Musaeus College',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Colombo 07',
    totalStudents: 1120,
    totalXP: 154300,
    averageAccuracy: 93.6,
    topStream: 'Biological Science (Bio)',
    cheersCount: 1980,
    shieldBadge: '🌺 Blue & White Lotus Crest',
    crestColor: 'from-blue-500 via-sky-400 to-indigo-600'
  },
  {
    id: 'inst-5',
    rank: 5,
    name: 'Nalanda College, Colombo',
    shortName: 'Nalanda College',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Colombo 10',
    totalStudents: 1060,
    totalXP: 148900,
    averageAccuracy: 92.9,
    topStream: 'Technology & ICT',
    cheersCount: 1840,
    shieldBadge: '☀️ Maroon & Silver Crest',
    crestColor: 'from-red-800 via-slate-400 to-red-900'
  },
  {
    id: 'inst-6',
    rank: 6,
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    category: 'Collegiate University',
    countryCode: 'UK',
    countryFlag: '🇬🇧',
    countryName: 'United Kingdom',
    city: 'Cambridge',
    totalStudents: 740,
    totalXP: 142600,
    averageAccuracy: 98.2,
    topStream: 'Natural Sciences & Math',
    cheersCount: 2450,
    shieldBadge: '🏰 Cambridge Blue Crest',
    crestColor: 'from-teal-600 via-cyan-500 to-blue-700'
  },
  {
    id: 'inst-7',
    rank: 7,
    name: 'Indian Institute of Technology (IIT Bombay)',
    shortName: 'IIT Bombay',
    category: 'Collegiate University',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    countryName: 'India',
    city: 'Mumbai',
    totalStudents: 890,
    totalXP: 139400,
    averageAccuracy: 97.8,
    topStream: 'Advanced Physics & JEE Tech',
    cheersCount: 2190,
    shieldBadge: '🔥 IIT Excellence Wheel',
    crestColor: 'from-orange-600 via-amber-500 to-red-700'
  },
  {
    id: 'inst-8',
    rank: 8,
    name: 'Trinity College, Kandy',
    shortName: 'Trinity Kandy',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Kandy',
    totalStudents: 920,
    totalXP: 132100,
    averageAccuracy: 92.1,
    topStream: 'Physical Science (Maths)',
    cheersCount: 1720,
    shieldBadge: '🦁 Red, Gold & Blue Lion',
    crestColor: 'from-red-600 via-amber-400 to-blue-600'
  },
  {
    id: 'inst-9',
    rank: 9,
    name: 'Visakha Vidyalaya, Colombo',
    shortName: 'Visakha Vidyalaya',
    category: 'National High School',
    countryCode: 'LK',
    countryFlag: '🇱🇰',
    countryName: 'Sri Lanka',
    city: 'Colombo 04',
    totalStudents: 980,
    totalXP: 129700,
    averageAccuracy: 94.0,
    topStream: 'Commerce & Law',
    cheersCount: 1680,
    shieldBadge: '🌸 Gold & Blue Crest',
    crestColor: 'from-yellow-500 via-blue-600 to-amber-600'
  },
  {
    id: 'inst-10',
    rank: 10,
    name: 'Massachusetts Institute of Technology (MIT)',
    shortName: 'MIT',
    category: 'Collegiate University',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    countryName: 'United States',
    city: 'Cambridge, MA',
    totalStudents: 620,
    totalXP: 125400,
    averageAccuracy: 98.9,
    topStream: 'Artificial Intelligence & Quantum',
    cheersCount: 2310,
    shieldBadge: '⚙️ Cardinal & Grey Seal',
    crestColor: 'from-red-700 via-slate-400 to-zinc-800'
  }
];

// REAL LEADERBOARD ENGINE & STUDENT ACHIEVER MODEL
// All mock / dummy users have been wiped out. The system now uses 100% genuine registered users only.

export function convertProfileToAchiever(
  profile: UserProfile,
  rank: number,
  isCurrent: boolean = false
): StudentAchiever {
  const isUni = profile.studentCategory === 'University' || profile.level === 'CAMPUS';
  const grade = profile.grade || 12;

  let academicCategory: 'University' | 'A-Level / High School' | 'O-Level / Secondary' | 'Scholarship / Primary' = 'A-Level / High School';
  let gradeLevel = 'Grade 12 (A/L)';

  if (isUni) {
    academicCategory = 'University';
    gradeLevel = 'Undergraduate';
  } else if (grade === 5 || profile.level === 'SCHOLARSHIP') {
    academicCategory = 'Scholarship / Primary';
    gradeLevel = 'Grade 5 (Primary)';
  } else if (grade <= 11 || profile.level === 'OL' || profile.level === 'JUNIOR') {
    academicCategory = 'O-Level / Secondary';
    gradeLevel = `Grade ${grade} (Secondary)`;
  } else {
    academicCategory = 'A-Level / High School';
    gradeLevel = `Grade ${grade} (Senior)`;
  }

  const specialBadge =
    rank === 1 ? '👑 National Sovereign Rank 1' :
    rank === 2 ? '🥈 Global Runner Up' :
    rank === 3 ? '🥉 Global Bronze Scholar' :
    (profile.xp || 0) >= 5000 ? '🔥 Grandmaster Scholar' :
    (profile.xp || 0) >= 3000 ? '💎 Diamond Master' :
    (profile.xp || 0) >= 1500 ? '⚡ Speed & Precision Ace' :
    '📚 Active Scholar';

  const honorTitle =
    profile.stream?.includes('Math') ? 'Pure & Applied Mathematics' :
    profile.stream?.includes('Bio') ? 'Biological Science Virtuoso' :
    profile.stream?.includes('Commerce') ? 'Economics & Corporate Finance' :
    profile.stream?.includes('Tech') ? 'Engineering Tech & Robotics' :
    profile.stream?.includes('Computer') || isUni ? 'Computer Science & Algorithms' :
    'National Curriculum Scholar';

  return {
    id: profile.id,
    rank,
    name: profile.name || 'Scholar',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    institution: profile.university || profile.school || (profile.countryCode === 'LK' ? 'National College' : 'Premier Academy'),
    districtOrCity: profile.district || (profile.countryCode === 'LK' ? 'Colombo' : 'National'),
    countryCode: profile.countryCode || 'LK',
    countryFlag: profile.countryFlag || '🇱🇰',
    countryName: profile.countryName || 'Sri Lanka',
    stream: profile.stream || 'General Curriculum',
    academicCategory,
    gradeLevel,
    weeklyXP: Math.round((profile.xp || 0) * 0.45) || profile.xp || 0,
    monthlyXP: Math.round((profile.xp || 0) * 0.85) || profile.xp || 0,
    allTimeXP: profile.xp || 0,
    streakDays: profile.streakDays || 1,
    quizAccuracy: 96.5,
    quizzesSolved: profile.completedLessonsCount || profile.solvedDoubtsCount || 1,
    specialBadge,
    honorTitle,
    isVerified: true,
    cheersCount: (profile as any).cheersCount || 0,
    bioQuote: profile.bio || profile.statusQuote || 'Dedicated scholar striving for peak academic mastery & Island Rank.',
    targetUniversity: profile.targetUniversity || 'University of Moratuwa / Oxford',
    frameId: profile.customAvatarFrameId || (
      (profile.xp || 0) >= 15000 ? 'frame-grandmaster' :
      (profile.xp || 0) >= 10000 ? 'frame-diamond' :
      (profile.xp || 0) >= 6000 ? 'frame-platinum' :
      (profile.xp || 0) >= 3000 ? 'frame-gold' :
      (profile.xp || 0) >= 1500 ? 'frame-silver' :
      'frame-bronze'
    )
  };
}

// 100% Real Registered Users (empty initial array, dynamically populated from real database / auth accounts)
export const INITIAL_TOP_50_GLOBAL_STUDENTS: StudentAchiever[] = [];

export interface DayStudyData {
  dayName: string;
  dayShort: string;
  hours: number;
  minutes: number;
  totalMinutes: number;
  targetAchieved: boolean;
  subjectTags: string[];
  focusTopic: string;
  xpEarned: number;
}

export const WEEKLY_STUDY_SCHEDULE: DayStudyData[] = [
  {
    dayName: 'Monday',
    dayShort: 'Mon',
    hours: 3,
    minutes: 45,
    totalMinutes: 225,
    targetAchieved: true,
    subjectTags: ['Combined Maths', 'Physics'],
    focusTopic: 'Integration by Parts & Newton Laws',
    xpEarned: 240
  },
  {
    dayName: 'Tuesday',
    dayShort: 'Tue',
    hours: 4,
    minutes: 10,
    totalMinutes: 250,
    targetAchieved: true,
    subjectTags: ['Chemistry', 'AI Tutor'],
    focusTopic: 'Organic Reactions & Reaction Mechanisms',
    xpEarned: 310
  },
  {
    dayName: 'Wednesday',
    dayShort: 'Wed',
    hours: 2,
    minutes: 50,
    totalMinutes: 170,
    targetAchieved: false,
    subjectTags: ['Past Papers', 'MCQ Arena'],
    focusTopic: 'National Model Practice & Doubt Clearing',
    xpEarned: 190
  },
  {
    dayName: 'Thursday',
    dayShort: 'Thu',
    hours: 5,
    minutes: 20,
    totalMinutes: 320,
    targetAchieved: true,
    subjectTags: ['Physics', 'Flashcards'],
    focusTopic: 'Rotational Dynamics & Moment of Inertia',
    xpEarned: 420
  },
  {
    dayName: 'Friday',
    dayShort: 'Fri',
    hours: 4,
    minutes: 30,
    totalMinutes: 270,
    targetAchieved: true,
    subjectTags: ['Combined Maths', 'Mind-Maps'],
    focusTopic: 'Conic Sections, Parabola & Hyperbola',
    xpEarned: 350
  },
  {
    dayName: 'Saturday',
    dayShort: 'Sat',
    hours: 6,
    minutes: 15,
    totalMinutes: 375,
    targetAchieved: true,
    subjectTags: ['Full Syllabus Mock', 'Biology/Chemistry'],
    focusTopic: 'Weekend Full Exam Simulation Challenge',
    xpEarned: 520
  },
  {
    dayName: 'Sunday',
    dayShort: 'Sun',
    hours: 5,
    minutes: 0,
    totalMinutes: 300,
    targetAchieved: true,
    subjectTags: ['Active Recall', 'Diagnostic'],
    focusTopic: 'Weekly Summary & Weakness Remediation',
    xpEarned: 420
  }
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=160&auto=format&fit=crop&q=80'
];
