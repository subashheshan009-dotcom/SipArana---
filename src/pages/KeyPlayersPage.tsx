import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  Trophy,
  Medal,
  Flame,
  Zap,
  Sparkles,
  Award,
  Globe,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Bot,
  Layers,
  ArrowRight,
  BookOpen,
  Tv,
  Gift
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { cheerStudent } from '@/services/leaderboardService';
import { soundFX } from '@/utils/audioUtils';
import type { PageId } from '@/components/Layout';

import { GlobalRankCard } from '@/components/keyPlayers/GlobalRankCard';
import { TestScoreProgressionChart } from '@/components/keyPlayers/TestScoreProgressionChart';
import { DailyAdRewardSection } from '@/components/keyPlayers/DailyAdRewardSection';
import { ReferralAndSocialShareSection } from '@/components/keyPlayers/ReferralAndSocialShareSection';
import { Top3Podium } from '@/components/keyPlayers/Top3Podium';
import { Top50Leaderboard } from '@/components/keyPlayers/Top50Leaderboard';
import { TopInstitutionsLeaderboard } from '@/components/keyPlayers/TopInstitutionsLeaderboard';
import { StudyScheduleTable } from '@/components/keyPlayers/StudyScheduleTable';
import { RankTiersShowcase } from '@/components/keyPlayers/RankTiersShowcase';
import { ProfileCustomizerModal } from '@/components/keyPlayers/ProfileCustomizerModal';

interface KeyPlayersPageProps {
  onNavigate?: (page: PageId) => void;
}

export default function KeyPlayersPage({ onNavigate }: KeyPlayersPageProps) {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();
  const { leaderboard, top3, refreshLeaderboard } = useLeaderboard();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'scholars' | 'institutions'>('scholars');

  const handleCheerStudent = async (id: string) => {
    // Reward user +5 XP for supporting fellow global scholars
    addXP(5);
    await cheerStudent(id);
    refreshLeaderboard();
  };

  return (
    <div id="key-players-page" className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-9 max-w-7xl mx-auto">
      {/* =========================================================================
          SECTION 1: GLOWING "WATCH AD & LUCKY SPIN WHEEL 🎡" WITH 20 DAILY LIMIT + DAILY CLAIM
          ========================================================================= */}
      <section id="section-daily-ad-rewards" className="space-y-3">
        <DailyAdRewardSection
          onRewardClaimed={() => {
            refreshLeaderboard();
          }}
        />
      </section>

      {/* =========================================================================
          SECTION 2: VIRAL GROWTH & REFERRAL ACCELERATOR (Invite Friends + WhatsApp Rank Share)
          ========================================================================= */}
      <section id="section-viral-referral-sharing" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            Viral Growth & Social Rank Sharing (+200 XP Referrals)
          </h2>
        </div>
        <ReferralAndSocialShareSection
          currentRank={14}
          onXPClaimed={() => {
            refreshLeaderboard();
          }}
        />
      </section>

      {/* =========================================================================
          SECTION 3: TOP 3 PODIUM (3D VISUAL GOLD, SILVER, BRONZE MASTER FRAMES)
          ========================================================================= */}
      <section id="section-top-3-podium" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Crown className="w-4 h-4 text-yellow-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            Top 3 Global Champions Podium (3D Master Frames)
          </h2>
        </div>
        <Top3Podium
          topStudents={top3}
          onCheerStudent={handleCheerStudent}
        />
      </section>

      {/* =========================================================================
          SECTION 4: UNIFIED LEADERBOARDS: TOP 50 SCHOLARS 🏆 VS TOP INSTITUTIONS 🏫
          ========================================================================= */}
      <section id="section-unified-leaderboard-tabs" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
              Global Ranks & Inter-School Battle Arena
            </h2>
          </div>

          {/* Tab Switcher for Scholars vs Institutions */}
          <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveLeaderboardTab('scholars')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                activeLeaderboardTab === 'scholars'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Top 50 Scholars 🏆</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLeaderboardTab('institutions')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                activeLeaderboardTab === 'institutions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Top Institutions 🏫</span>
            </button>
          </div>
        </div>

        {activeLeaderboardTab === 'scholars' ? (
          <Top50Leaderboard
            students={leaderboard}
            onCheerStudent={handleCheerStudent}
          />
        ) : (
          <TopInstitutionsLeaderboard
            onOpenProfileCustomizer={() => setIsCustomizerOpen(true)}
          />
        )}
      </section>

      {/* =========================================================================
          SECTION 4: MY PROFILE CARD
          Custom Avatar, Bio, Country Flag, Global Rank, and Daily Streak Counter (🔥)
          ========================================================================= */}
      <section id="section-my-profile-card" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Award className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            My Scholar Identity & Global Rank
          </h2>
        </div>
        <GlobalRankCard
          topStudents={leaderboard}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onNavigateToQuiz={() => onNavigate?.('quizzes')}
        />
      </section>

      {/* =========================================================================
          SECTION 5: INTERACTIVE "TEST SCORE PROGRESSION & TRAJECTORY" AREA CHART
          Smooth curved area chart (Test #1 to Test #5), 0-100%, Vibrant Blue Line
          with soft gradient fill and "Latest: 100%" badge.
          ========================================================================= */}
      <section id="section-score-progression" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            Visual Score Progression & Trajectory
          </h2>
        </div>
        <TestScoreProgressionChart />
      </section>

      {/* BONUS: FREE FIRE RANK TIERS & UNLOCKABLE AVATAR FRAMES SHOWCASE */}
      <section id="section-rank-tiers" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            Rank Tier Progression Matrix (Free Fire Framework)
          </h2>
        </div>
        <RankTiersShowcase />
      </section>

      {/* BONUS: WEEKLY HIGH-PRECISION STUDY SCHEDULE TABLE */}
      <section id="section-study-schedule" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
            Weekly Island Rank 1 Study Schedule & Daily Targets
          </h2>
        </div>
        <StudyScheduleTable />
      </section>

      {/* 6. AI STUDY ACCELERATOR CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white">
              Accelerate Your Global Rank with 24/7 AI Tutor & Past Paper Drills
            </h4>
            <p className="text-xs text-slate-300">
              Clear complex derivations, solve 100+ daily MCQs, and earn bonus mastery XP instantly.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('ai_tutor')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shrink-0 shadow-md shadow-blue-600/30"
          >
            <span>Open AI Tutor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile & Avatar Frame Customizer Modal */}
      <ProfileCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
}
