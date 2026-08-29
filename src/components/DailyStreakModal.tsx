import React, { useState } from 'react';
import {
  X,
  Flame,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Crown,
  BookOpen,
  HelpCircle,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

export interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimMysteryChest?: () => void;
  initialTab?: 'streak' | 'xp' | 'badges';
}

const STREAK_MILESTONES = [
  { day: 3, reward: '+50 XP Bonus & Bronze Flame', icon: '⚡', unlocked: true },
  { day: 7, reward: 'Bronze Owl Badge & +150 XP', icon: '🦉', unlocked: true },
  { day: 14, reward: 'Silver Crown Frame & +300 XP', icon: '👑', unlocked: false },
  { day: 30, reward: 'Golden Scholar Master Trophy', icon: '🏆', unlocked: false },
  { day: 60, reward: 'Emerald Genius Certificate', icon: '🌿', unlocked: false },
  { day: 100, reward: 'Diamond Elite Hall of Fame', icon: '💎', unlocked: false }
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ALL_ACHIEVEMENT_BADGES = [
  {
    id: 'first_quiz',
    title: 'First Step Scholar',
    titleSi: 'ප්‍රථම පියවර විද්වතා',
    desc: 'Completed your first exam practice quiz with over 80% accuracy',
    rarity: 'Common',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500',
    xpReward: 50,
    unlocked: true
  },
  {
    id: 'owl_mentorship',
    title: 'Kavi the Owl Companion',
    titleSi: 'කවි බකමූණු සහචරයා',
    desc: 'Practiced voice or reading with AI mentor Kavi the Owl',
    rarity: 'Rare',
    icon: '🦉',
    color: 'from-amber-500 to-orange-500',
    xpReward: 100,
    unlocked: true
  },
  {
    id: 'streak_master',
    title: 'Streak Titan (7 Days)',
    titleSi: 'සප්ත දින අඛණ්ඩතා විරුවා',
    desc: 'Logged in and studied for 7 consecutive days without breaking streak',
    rarity: 'Epic',
    icon: '🔥',
    color: 'from-red-500 to-amber-500',
    xpReward: 200,
    unlocked: true
  },
  {
    id: 'multilingual_explorer',
    title: 'Polyglot Explorer',
    titleSi: 'බහුභාෂා ගවේෂකයා',
    desc: 'Practiced in Sinhala, Tamil, and English language hubs',
    rarity: 'Rare',
    icon: '🌐',
    color: 'from-emerald-500 to-teal-500',
    xpReward: 150,
    unlocked: true
  },
  {
    id: 'speed_solver',
    title: 'Quantum Math Solver',
    titleSi: 'ක්ෂණික ගණිත ශූරයා',
    desc: 'Solved 10 G.C.E. O/L or A/L math questions in under 5 minutes',
    rarity: 'Epic',
    icon: '⚡',
    color: 'from-purple-500 to-indigo-500',
    xpReward: 250,
    unlocked: false
  },
  {
    id: 'diamond_scholar',
    title: 'National Ranker Diamond',
    titleSi: 'ජාතික මට්ටමේ විශිෂ්ටයා',
    desc: 'Ranked in the top 5% of national mock exam leaderboards',
    rarity: 'Legendary',
    icon: '💎',
    color: 'from-cyan-400 to-blue-600',
    xpReward: 500,
    unlocked: false
  }
];

export default function DailyStreakModal({
  isOpen,
  onClose,
  onClaimMysteryChest,
  initialTab = 'streak'
}: DailyStreakModalProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'streak' | 'xp' | 'badges'>(initialTab);

  if (!isOpen) return null;

  const streakDays = profile?.streakDays || 1;
  const totalXp = profile?.xp || 0;
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const activeDaysIndices = [1, 2, 3, 4, 5]; // Mon - Fri active

  // Calculate Level and Progress
  const XP_PER_LEVEL = 350;
  const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
  const xpProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100));

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 15) return language === 'si' ? 'ජාතික මහාචාර්ය (Grandmaster)' : 'Grandmaster Scholar';
    if (lvl >= 10) return language === 'si' ? 'විශිෂ්ට පර්යේෂක (Elite Scholar)' : 'Elite Scholar';
    if (lvl >= 6) return language === 'si' ? 'දක්ෂ විද්‍යාර්ථී (Master Student)' : 'Master Student';
    if (lvl >= 3) return language === 'si' ? 'උනන්දු ශිෂ්‍ය (Dedicated Learner)' : 'Dedicated Learner';
    return language === 'si' ? 'ආධුනික ගවේෂක (Apprentice)' : 'Apprentice';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="rewards-achievements-modal"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-2xl text-white flex flex-col max-h-[90vh]"
      >
        {/* Ambient flame glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="p-5 sm:p-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[10px] border border-amber-400/40 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              SipArana Honors & Rewards
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            {language === 'si' ? 'ත්‍යාග සහ ජයග්‍රහණ පියස' : 'Rewards, Streak & XP Level'}
          </h2>
          <p className="text-xs text-slate-300">
            {language === 'si'
              ? 'දිනපතා ඉගෙනීමෙන් XP ලකුණු, අඛණ්ඩතා දින සහ විශේෂ ගෞරව සම්මාන දිනා ගන්න!'
              : 'Track your daily consistency, study level progress, and prestigious academic badges.'}
          </p>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('streak');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'streak'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'si' ? 'අඛණ්ඩතාවය (Streak)' : 'Study Streak'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('xp');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'xp'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'si' ? 'XP මට්ටම (Level)' : 'XP & Level'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('badges');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-indigo-500 text-white shadow-md font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'සම්මාන (Badges)' : 'Badges & Trophies'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: STREAK */}
          {activeTab === 'streak' && (
            <div className="space-y-4">
              {/* Big Streak Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-400/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <span className="text-5xl select-none">🔥</span>
                    <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                      ACTIVE
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Current Study Streak</span>
                    <h3 className="text-2xl font-black text-white">{streakDays} Consecutive Days</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'si'
                        ? 'දිනපතා විනාඩි 15ක් ඉගෙනීමෙන් මතකය 85%කින් ස්ථාවර වේ!'
                        : '15 mins of daily active recall locks concepts into permanent long-term memory!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 7-Day Visual Tracker */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {language === 'si' ? 'මෙම සතියේ අධ්‍යයන දින දර්ශනය' : "This Week's Activity Calendar"}
                </span>
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {WEEK_DAYS.map((day, idx) => {
                    const isToday = idx === (currentDayIndex === 0 ? 6 : currentDayIndex - 1);
                    const isDone = activeDaysIndices.includes(idx);
                    return (
                      <div
                        key={day}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isDone
                            ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 font-bold'
                            : isToday
                            ? 'bg-white/15 border-white/40 text-white animate-pulse font-bold'
                            : 'bg-white/5 border-white/5 text-slate-500'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold">{day}</span>
                        <div className="text-base mt-1">
                          {isDone ? '🔥' : isToday ? '⏳' : '⚪'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Streak Milestones */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Streak Milestones & Unlocks
                </span>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {STREAK_MILESTONES.map((m) => {
                    const isAchieved = streakDays >= m.day;
                    return (
                      <div
                        key={m.day}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                          isAchieved
                            ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{m.icon}</span>
                          <div>
                            <span className="font-extrabold block text-white">Day {m.day} Goal</span>
                            <span className="text-[11px] text-slate-300">{m.reward}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAchieved ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Claimed
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
                              {m.day - streakDays} days left
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XP & LEVEL PROGRESSION */}
          {activeTab === 'xp' && (
            <div className="space-y-4">
              {/* Level Status Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-400/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                      L{currentLevel}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide block">Current Academic Rank</span>
                      <h3 className="text-lg font-black text-white">{getLevelTitle(currentLevel)}</h3>
                      <p className="text-xs text-slate-300">{totalXp.toLocaleString()} Total Lifetime XP</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Rank</span>
                    <span className="text-xs font-black text-emerald-300">Level {currentLevel + 1}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Level Progress</span>
                    <span className="text-emerald-300 font-mono">{xpInCurrentLevel} / {XP_PER_LEVEL} XP ({xpProgressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${xpProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* XP Earning Pathways */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Ways to Earn XP Points
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">📝</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Exam Mock Quizzes</span>
                        <span className="text-[10px] text-slate-400">+50 to +150 XP per test</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 font-mono">+150 XP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🗣️</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Language Adventure</span>
                        <span className="text-[10px] text-slate-400">Speaking & Writing drills</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 font-mono">+80 XP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🃏</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Flashcard Mastery</span>
                        <span className="text-[10px] text-slate-400">Spaced active recall</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 font-mono">+40 XP</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎁</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Daily Mystery Chest</span>
                        <span className="text-[10px] text-slate-400">Claim once every 24h</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400 font-mono">+250 XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNLOCKED BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  Honors Showcase ({ALL_ACHIEVEMENT_BADGES.filter(b => b.unlocked).length}/{ALL_ACHIEVEMENT_BADGES.length} Unlocked)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_ACHIEVEMENT_BADGES.map((badge) => {
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-white/10 to-white/5 border-indigo-400/50 shadow-md'
                          : 'bg-white/5 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-tr ${badge.color} shadow-sm`}>
                          {badge.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-extrabold text-white truncate">
                              {language === 'si' ? badge.titleSi : badge.title}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                              badge.rarity === 'Legendary' ? 'bg-amber-400 text-slate-950' :
                              badge.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                              badge.rarity === 'Rare' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {badge.rarity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                            {badge.desc}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px]">
                            <span className="text-emerald-400 font-bold">+{badge.xpReward} XP</span>
                            {badge.unlocked ? (
                              <span className="text-indigo-300 font-extrabold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Unlocked
                              </span>
                            ) : (
                              <span className="text-slate-500 font-semibold flex items-center gap-0.5">
                                <Lock className="w-3 h-3 text-slate-500" /> Locked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Academic Integrity Verified</span>
          </div>

          {onClaimMysteryChest && (
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                onClose();
                onClaimMysteryChest();
              }}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Daily Mystery Chest 🎁</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
