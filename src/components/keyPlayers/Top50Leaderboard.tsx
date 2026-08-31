import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  Trophy,
  Medal,
  Flame,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  GraduationCap,
  Globe,
  ThumbsUp,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import type { StudentAchiever } from '@/data/keyPlayersData';

interface Top50LeaderboardProps {
  students: StudentAchiever[];
  onCheerStudent: (id: string) => void;
}

export const Top50Leaderboard: React.FC<Top50LeaderboardProps> = ({
  students,
  onCheerStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeframe, setTimeframe] = useState<'allTime' | 'weekly' | 'monthly'>('allTime');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Filtered & Sorted list
  const filteredStudents加快 = useMemo(() => {
    let list = [...students];

    // Filter by Country
    if (selectedCountry !== 'ALL') {
      list = list.filter((s) => s.countryCode === selectedCountry);
    }

    // Filter by Category
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
          s.stream.toLowerCase().includes(q) ||
          s.districtOrCity.toLowerCase().includes(q) ||
          s.countryName.toLowerCase().includes(q)
      );
    }

    // Sort by selected timeframe XP
    list.sort((a, b) => {
      const xpA = timeframe === 'weekly' ? a.weeklyXP : timeframe === 'monthly' ? a.monthlyXP : a.allTimeXP;
      const xpB = timeframe === 'weekly' ? b.weeklyXP : timeframe === 'monthly' ? b.monthlyXP : b.allTimeXP;
      return xpB - xpA;
    });

    return list;
  }, [students, selectedCountry, selectedCategory, searchQuery, timeframe]);

  const handleCheer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundFX.playPop();
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {}
    onCheerStudent(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedStudentId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header & Metric summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-black text-white">
              Global Top 50 Unified Student Leaderboard
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold">
              REAL-TIME
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            100% unrestricted global rankings open to all schools, high-schools & universities worldwide
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setTimeframe('allTime')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeframe === 'allTime'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time XP
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Sprint
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar name, school, university, stream, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white outline-none transition"
            />
          </div>

          {/* Academic Level Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold focus:border-amber-400 outline-none transition cursor-pointer"
          >
            <option value="ALL">All Academic Streams</option>
            <option value="University">University & College Level</option>
            <option value="A-Level / High School">A-Level / High School</option>
            <option value="O-Level / Secondary">O-Level / Secondary</option>
            <option value="Scholarship / Primary">Grade 5 Scholarship</option>
          </select>
        </div>

        {/* Country Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Region:</span>
          </span>
          {[
            { code: 'ALL', label: 'All Global 🌍' },
            { code: 'LK', label: '🇱🇰 Sri Lanka' },
            { code: 'UK', label: '🇬🇧 United Kingdom' },
            { code: 'US', label: '🇺🇸 United States' },
            { code: 'IN', label: '🇮🇳 India' },
            { code: 'JP', label: '🇯🇵 Japan' },
            { code: 'SG', label: '🇸🇬 Singapore' },
            { code: 'AU', label: '🇦🇺 Australia' },
            { code: 'CA', label: '🇨🇦 Canada' },
            { code: 'DE', label: '🇩🇪 Germany' }
          ].map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCountry === c.code
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {filteredStudents加快.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No student found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your search term or country filter</p>
          </div>
        ) : (
          filteredStudents加快.map((student, idx) => {
            const displayRank = idx + 1;
            const isRank1 = displayRank === 1;
            const isRank2 = displayRank === 2;
            const isRank3 = displayRank === 3;
            const isTop3 = isRank1 || isRank2 || isRank3;
            const isExpanded迷 = expandedStudentId === student.id;

            const currentXP =
              timeframe === 'weekly'
                ? student.weeklyXP
                : timeframe === 'monthly'
                ? student.monthlyXP
                : student.allTimeXP;

            return (
              <div
                key={student.id}
                onClick={() => toggleExpand(student.id)}
                className={`relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isRank1
                    ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-yellow-400/70 ring-1 ring-yellow-400/40 shadow-xl shadow-yellow-500/10'
                    : isRank2
                    ? 'bg-gradient-to-r from-slate-800/60 via-slate-900 to-slate-900 border-slate-300/60 ring-1 ring-slate-300/30'
                    : isRank3
                    ? 'bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border-amber-600/50'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Main Row */}
                <div className="p-4 flex items-center justify-between gap-4">
                  {/* Left: Rank + Avatar with Frame + Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {isRank1 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse">
                          👑 1
                        </div>
                      ) : isRank2 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                          🥈 2
                        </div>
                      ) : isRank3 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-amber-100 font-black text-sm flex items-center justify-center shadow-md">
                          🥉 3
                        </div>
                      ) : (
                        <span className="text-sm font-black text-slate-400">
                          #{displayRank}
                        </span>
                      )}
                    </div>

                    {/* Free Fire Style Avatar with Frame */}
                    <div className="shrink-0">
                      <AvatarFrameRenderer
                        avatarUrl={student.avatar}
                        name={student.name}
                        frameId={student.frameId}
                        rank={isTop3 ? displayRank : undefined}
                        size="md"
                        showCrown={isTop3}
                      />
                    </div>

                    {/* Student Identity */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-black truncate ${
                          isRank1 ? 'text-yellow-300' : isRank2 ? 'text-slate-100' : isRank3 ? 'text-amber-200' : 'text-white'
                        }`}>
                          {student.name}
                        </span>
                        <span className="text-sm" title={student.countryName}>
                          {student.countryFlag}
                        </span>
                        {student.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" title="Verified Top Scholar" />
                        )}
                        <span className="hidden sm:inline-block text-[10px] px-2 py-0.2 rounded-md bg-slate-800 text-amber-300 font-bold border border-slate-700">
                          {student.specialBadge}
                        </span>
                      </div>

                      {/* Institution & Stream */}
                      <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                        <GraduationCap className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="font-semibold text-slate-200 truncate">{student.institution}</span>
                        <span className="text-slate-500 hidden md:inline">•</span>
                        <span className="text-slate-400 hidden md:inline truncate">{student.stream}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: XP + Accuracy + Cheer Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        <span>{student.streakDays}d Streak</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-bold">
                        {student.quizAccuracy}% Accuracy ({student.quizzesSolved} Solved)
                      </div>
                    </div>

                    {/* XP Score Tag */}
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {timeframe === 'weekly' ? 'Weekly' : timeframe === 'monthly' ? 'Monthly' : 'Total'} XP
                      </span>
                      <span className={`text-base font-black flex items-center justify-end gap-1 ${
                        isRank1 ? 'text-yellow-400' : 'text-amber-400'
                      }`}>
                        <Zap className="w-4 h-4 fill-amber-400" />
                        <span>{currentXP.toLocaleString()}</span>
                      </span>
                    </div>

                    {/* Interactive Cheer Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCheer(e, student.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                      title="Cheer for this student (+1 Cheer)"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{student.cheersCount}</span>
                    </button>

                    <div className="text-slate-500">
                      {isExpanded迷 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded迷 && (
                  <div className="px-5 py-4 bg-slate-950/90 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Academic Focus</span>
                      <p className="text-slate-200 font-semibold">{student.honorTitle}</p>
                      <p className="text-slate-400">Stream: {student.stream} ({student.gradeLevel})</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Dream Target & Fellowship</span>
                      <p className="text-amber-300 font-semibold">🎯 {student.targetUniversity || 'Top National University'}</p>
                      <p className="text-slate-400">Location: {student.districtOrCity}, {student.countryName}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Study Bio & Strategy</span>
                      <p className="text-slate-300 italic">"{student.bioQuote || 'Consistent daily past paper drilling is the only key to success.'}"</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
