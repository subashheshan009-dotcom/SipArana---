import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  School,
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  Search,
  Filter,
  Users,
  Shield,
  ThumbsUp,
  Heart,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundFX } from '@/utils/audioUtils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { TOP_INSTITUTIONS_LIST, type InstitutionAchiever } from '@/data/keyPlayersData';

interface TopInstitutionsLeaderboardProps {
  onOpenProfileCustomizer?: () => void;
}

export const TopInstitutionsLeaderboard: React.FC<TopInstitutionsLeaderboardProps> = ({
  onOpenProfileCustomizer
}) => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [institutions, setInstitutions] = useState<InstitutionAchiever[]>(TOP_INSTITUTIONS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'xp' | 'students' | 'accuracy'>('xp');
  const [expandedInstId, setExpandedInstId] = useState<string | null>(null);

  // Filter and sort institutions
  const filteredInstitutions = useMemo(() => {
    let list = [...institutions];

    // Country filter
    if (selectedCountry !== 'ALL') {
      list = list.filter((inst) => inst.countryCode === selectedCountry);
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((inst) => inst.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.city.toLowerCase().includes(q) ||
          inst.countryName.toLowerCase().includes(q) ||
          inst.topStream.toLowerCase().includes(q)
      );
    }

    // Sort criteria
    list.sort((a, b) => {
      if (sortBy === 'students') return b.totalStudents - a.totalStudents;
      if (sortBy === 'accuracy') return b.averageAccuracy - a.averageAccuracy;
      return b.totalXP - a.totalXP;
    });

    return list;
  }, [institutions, selectedCountry, selectedCategory, searchQuery, sortBy]);

  const handleCheerInstitution = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundFX.playPop();

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 }
      });
    } catch {}

    // Increment institution cheer count in state
    setInstitutions((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, cheersCount: inst.cheersCount + 1 } : inst
      )
    );
  };

  const top3 = filteredInstitutions.slice(0, 3);

  return (
    <div id="top-institutions-battle-section" className="space-y-6">
      {/* Top 3 Institutions Podium Cards */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-400/60 p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-400/20 text-slate-200 border border-slate-400/40 text-xs font-black flex items-center gap-1.5">
                  <Medal className="w-4 h-4 text-slate-300" />
                  <span>#2 SILVER SHIELD</span>
                </span>
                <span className="text-xl">{top3[1].countryFlag}</span>
              </div>

              <div>
                <h4 className="text-base font-black text-white">{top3[1].name}</h4>
                <p className="text-xs text-slate-400">{top3[1].city} • {top3[1].category}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-700/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total XP:</span>
                  <span className="font-black text-amber-300">{top3[1].totalXP.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scholars:</span>
                  <span className="font-bold text-slate-200">{top3[1].totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="font-bold text-emerald-400">{top3[1].averageAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={(e) => handleCheerInstitution(e, top3[1].id)}
                className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-slate-300" />
                <span>Cheer School ({top3[1].cheersCount}) +5 XP</span>
              </button>
            </div>
          </div>

          {/* Rank 1 (Gold - Elevated Sovereign Card) */}
          <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-2 border-yellow-400 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2 ring-2 ring-yellow-400/40">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 text-xs font-black flex items-center gap-1.5 animate-pulse">
                  <Crown className="w-4 h-4 text-yellow-300 fill-yellow-400" />
                  <span>#1 NATIONAL CHAMPION</span>
                </span>
                <span className="text-2xl">{top3[0].countryFlag}</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">{top3[0].name}</h4>
                <p className="text-xs text-amber-200/80">{top3[0].city} • {top3[0].category}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-yellow-500/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total Accumulated XP:</span>
                  <span className="font-black text-yellow-300 text-sm">{top3[0].totalXP.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Active Scholars:</span>
                  <span className="font-bold text-white">{top3[0].totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Avg Exam Accuracy:</span>
                  <span className="font-bold text-emerald-400">{top3[0].averageAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={(e) => handleCheerInstitution(e, top3[0].id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/30 transition cursor-pointer active:scale-98"
              >
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Cheer Champion ({top3[0].cheersCount}) +5 XP</span>
              </button>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 md:order-3 rounded-3xl bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-700/60 p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-700/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-700/20 text-amber-300 border border-amber-700/40 text-xs font-black flex items-center gap-1.5">
                  <Medal className="w-4 h-4 text-amber-500" />
                  <span>#3 BRONZE SHIELD</span>
                </span>
                <span className="text-xl">{top3[2].countryFlag}</span>
              </div>

              <div>
                <h4 className="text-base font-black text-white">{top3[2].name}</h4>
                <p className="text-xs text-slate-400">{top3[2].city} • {top3[2].category}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-700/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total XP:</span>
                  <span className="font-black text-amber-400">{top3[2].totalXP.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scholars:</span>
                  <span className="font-bold text-slate-200">{top3[2].totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="font-bold text-emerald-400">{top3[2].averageAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={(e) => handleCheerInstitution(e, top3[2].id)}
                className="w-full py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 border border-amber-700/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Cheer School ({top3[2].cheersCount}) +5 XP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Full Table Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-black text-white">
                Inter-School & University Battle Arena
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-extrabold">
                BATTLE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated XP calculated in real-time from active students representing their academic institutions worldwide
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setSortBy('xp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortBy === 'xp'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Total XP
            </button>
            <button
              onClick={() => setSortBy('students')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortBy === 'students'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Scholars
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortBy === 'accuracy'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Accuracy
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school or university name, district, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="ALL">🌍 All Countries</option>
              <option value="LK">🇱🇰 Sri Lanka</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="IN">🇮🇳 India</option>
              <option value="US">🇺🇸 United States</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="National High School">High Schools</option>
              <option value="Collegiate University">Universities</option>
            </select>
          </div>
        </div>

        {/* High Density Institution Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 w-16">Rank</th>
                <th className="py-3 px-3">Institution & Location</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Scholars</th>
                <th className="py-3 px-3 text-right">Avg Accuracy</th>
                <th className="py-3 px-3 text-right">Total XP</th>
                <th className="py-3 px-3 text-center">Cheer (+5 XP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInstitutions.map((inst, index) => {
                const rankNum = index + 1;
                const isUserSchool =
                  profile?.school?.toLowerCase().includes(inst.shortName.toLowerCase()) ||
                  profile?.university?.toLowerCase().includes(inst.shortName.toLowerCase());

                return (
                  <tr
                    key={inst.id}
                    onClick={() => setExpandedInstId((prev) => (prev === inst.id ? null : inst.id))}
                    className={`hover:bg-slate-800/50 transition cursor-pointer ${
                      isUserSchool ? 'bg-indigo-950/30 font-semibold' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {rankNum === 1 ? (
                          <span className="w-7 h-7 rounded-xl bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-yellow-500/30">
                            1
                          </span>
                        ) : rankNum === 2 ? (
                          <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                            2
                          </span>
                        ) : rankNum === 3 ? (
                          <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                            3
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                            #{rankNum}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Institution Name & City */}
                    <td className="py-3.5 px-3 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg shrink-0">{inst.countryFlag}</span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{inst.name}</span>
                            {isUserSchool && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[9px] font-black uppercase">
                                My Institution
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            {inst.city}, {inst.countryName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium whitespace-nowrap">
                        {inst.category}
                      </span>
                    </td>

                    {/* Student count */}
                    <td className="py-3.5 px-3 text-right font-bold text-slate-300">
                      {inst.totalStudents.toLocaleString()}
                    </td>

                    {/* Accuracy */}
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      {inst.averageAccuracy}%
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-black text-amber-300 text-sm">
                        {inst.totalXP.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">XP</span>
                    </td>

                    {/* Cheer Button */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleCheerInstitution(e, inst.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>{inst.cheersCount}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Represent Your School CTA */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">
                Want to help your school or university climb the ranks?
              </h5>
              <p className="text-[11px] text-slate-300">
                Every quiz you solve, doubt you clear, and video you watch automatically adds XP to your institution's global total!
              </p>
            </div>
          </div>

          {onOpenProfileCustomizer && (
            <button
              type="button"
              onClick={onOpenProfileCustomizer}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap transition cursor-pointer"
            >
              Set My Institution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
