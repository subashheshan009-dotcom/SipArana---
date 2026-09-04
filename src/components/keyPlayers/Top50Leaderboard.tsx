import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Search,
  Globe,
  UserCheck,
  CheckCircle2,
  Filter,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import type { StudentAchiever } from '@/data/keyPlayersData';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import { FreeFirePlayerProfileModal } from './FreeFirePlayerProfileModal';

interface Top50LeaderboardProps {
  students: StudentAchiever[];
  onCheerStudent: (id: string) => void;
  currentUserId?: string;
}

export const Top50Leaderboard: React.FC<Top50LeaderboardProps> = ({
  students,
  onCheerStudent,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeframe, setTimeframe] = useState<'allTime' | 'weekly' | 'monthly'>('allTime');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentAchiever | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filtered & Sorted list of authentic registered users
  const filteredStudents = useMemo(() => {
    let list = [...students];

    // Filter by Country
    if (selectedCountry !== 'ALL') {
      list = list.filter((s) => s.countryCode === selectedCountry);
    }

    // Filter by Academic Category
    if (selectedCategory !== 'ALL') {
      list = list.filter((s) => s.academicCategory === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.institution.toLowerCase().includes(q) ||
          (s.stream && s.stream.toLowerCase().includes(q)) ||
          (s.districtOrCity && s.districtOrCity.toLowerCase().includes(q)) ||
          (s.countryName && s.countryName.toLowerCase().includes(q))
      );
    }

    // Sort strictly by selected timeframe XP in descending order
    list.sort((a, b) => {
      const xpA = timeframe === 'weekly' ? a.weeklyXP : timeframe === 'monthly' ? a.monthlyXP : a.allTimeXP;
      const xpB = timeframe === 'weekly' ? b.weeklyXP : timeframe === 'monthly' ? b.monthlyXP : b.allTimeXP;
      return xpB - xpA;
    });

    return list.slice(0, 50);
  }, [students, selectedCountry, selectedCategory, searchQuery, timeframe]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-300 flex-shrink-0 animate-pulse">
          🥇 1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-slate-300 flex-shrink-0">
          🥈 2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-orange-500 flex-shrink-0">
          🥉 3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-300 font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
        #{rank < 10 ? `0${rank}` : rank}
      </div>
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      id="free-fire-top50-leaderboard"
      className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4 backdrop-blur-md w-full h-auto"
    >
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>Top 50 Student Leaderboard</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live ({students.length})
              </span>
            </h3>
            <p className="text-[11px] text-slate-300 font-medium">
              Free Fire Ranking Arena • Click any student to view full profile
            </p>
          </div>
        </div>

        {/* Timeframe Filter Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setTimeframe('allTime')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              timeframe === 'allTime'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All-Time XP
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by registered name, school, city, or stream..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white placeholder-slate-400 outline-none transition"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-bold focus:border-amber-400 outline-none transition cursor-pointer"
          >
            <option value="ALL">All Streams</option>
            <option value="University">University</option>
            <option value="A-Level / High School">A-Level / Grade 12-13</option>
            <option value="O-Level / Secondary">O-Level / Grade 6-11</option>
            <option value="Scholarship / Primary">Primary / Scholarship</option>
          </select>
        </div>

        {/* Country Filter Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { code: 'ALL', label: 'All Global 🌍' },
            { code: 'LK', label: '🇱🇰 Sri Lanka' },
            { code: 'UK', label: '🇬🇧 UK' },
            { code: 'US', label: '🇺🇸 USA' },
            { code: 'IN', label: '🇮🇳 India' },
            { code: 'JP', label: '🇯🇵 Japan' },
            { code: 'SG', label: '🇸🇬 Singapore' },
            { code: 'AU', label: '🇦🇺 Australia' }
          ].map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelectedCountry(c.code)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCountry === c.code
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Scrollable Leaderboard List */}
      <div
        id="leaderboard-scroll-list"
        className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 custom-scrollbar w-full"
      >
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 w-full">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">
              {students.length === 0
                ? 'No Verified Registered Students in Database'
                : 'No Students Match the Selected Filters'}
            </h4>
            <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
              {students.length === 0
                ? 'Slots will dynamically populate as genuine students register and earn XP.'
                : 'Try adjusting your search or switching filters back to All Global.'}
            </p>
          </div>
        ) : (
          filteredStudents.map((student, idx) => {
            const rank = idx + 1;
            const isCurrentUser = student.id === currentUserId || student.isCurrentUser;
            const currentXP =
              timeframe === 'weekly'
                ? student.weeklyXP
                : timeframe === 'monthly'
                ? student.monthlyXP
                : student.allTimeXP;

            const hasImgError = imageErrors[student.id];

            return (
              <div
                key={student.id || `student-${idx}`}
                onClick={() => setSelectedStudentForModal({ ...student, rank })}
                className={`group relative flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer min-w-0 w-full h-auto ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-950/50 via-slate-950/90 to-slate-950 border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/60 shadow-md shadow-amber-500/5'
                    : rank === 2
                    ? 'bg-gradient-to-r from-slate-900/60 via-slate-950/90 to-slate-950 border-slate-400/40 hover:border-slate-300 hover:bg-slate-900/80'
                    : rank === 3
                    ? 'bg-gradient-to-r from-orange-950/40 via-slate-950/90 to-slate-950 border-orange-500/40 hover:border-orange-400 hover:bg-orange-950/50'
                    : isCurrentUser
                    ? 'bg-blue-950/40 border-blue-500/50 hover:bg-blue-950/60'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Left: Rank Badge + Small Round Avatar + Identity */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Rank Badge */}
                  {getRankBadge(rank)}

                  {/* Small Round Profile Picture with Free Fire Status Indicator */}
                  <div className="relative shrink-0">
                    <AvatarFrameRenderer frameId={student.frameId} size="sm">
                      {student.avatar && !hasImgError ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          onError={() => setImageErrors((prev) => ({ ...prev, [student.id]: true }))}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-700 to-purple-800 border border-slate-700 flex items-center justify-center text-white font-black text-xs shadow-inner">
                          {getInitials(student.name)}
                        </div>
                      )}
                    </AvatarFrameRenderer>
                    {/* Free Fire Online/Offline Status Dot */}
                    {student.isOnline ? (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-xs shadow-emerald-500/50 ring-1 ring-emerald-400"
                        title="Online 🟢"
                      />
                    ) : (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-slate-500 border-2 border-slate-950 rounded-full"
                        title="Offline ⚪"
                      />
                    )}
                  </div>

                  {/* Student Name & School/Country Info with clean line heights */}
                  <div className="min-w-0 flex-1 pr-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0 leading-snug">
                      <span className="font-bold text-slate-100 text-xs sm:text-sm truncate group-hover:text-amber-300 transition-colors">
                        {student.name}
                      </span>
                      {student.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                      {student.isOnline ? (
                        <span className="text-[9px] font-extrabold text-emerald-300 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/50 whitespace-nowrap flex items-center gap-1 leading-none shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online 🟢
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap leading-none">
                          Offline ⚪
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="text-[9px] font-black text-blue-300 bg-blue-900/50 px-1.5 py-0.5 rounded border border-blue-700/40 whitespace-nowrap leading-none">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate leading-tight font-medium">
                      <span className="truncate">
                        {student.institution || 'Verified Scholar'}
                        {student.districtOrCity ? ` • ${student.districtOrCity}` : ''}
                      </span>
                      <span className="shrink-0 text-xs">
                        {student.countryFlag || '🌍'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Total XP Pill Tag + Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-xs sm:text-xs whitespace-nowrap shadow-xs">
                    {currentXP.toLocaleString()} XP
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Free Fire Style Pop-up Profile Modal */}
      <FreeFirePlayerProfileModal
        student={selectedStudentForModal}
        isOpen={Boolean(selectedStudentForModal)}
        onClose={() => setSelectedStudentForModal(null)}
        onCheer={onCheerStudent}
        currentUserId={currentUserId}
      />
    </div>
  );
};
