import React, { useState } from 'react';
import { Trophy, ChevronRight, Sparkles } from 'lucide-react';
import type { StudentAchiever } from '@/data/keyPlayersData';
import type { PageId } from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

interface CompactTop3ScholarsProps {
  students: StudentAchiever[];
  onNavigate?: (page: PageId) => void;
  currentUserId?: string;
}

export const CompactTop3Scholars: React.FC<CompactTop3ScholarsProps> = ({
  students,
  onNavigate,
  currentUserId
}) => {
  const { language } = useLanguage();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Display only real registered students up to 3
  const topScholars = students.slice(0, 3);

  if (topScholars.length === 0) {
    return null;
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/50 text-amber-300 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-slate-300/20 to-slate-400/20 border border-slate-400/50 text-slate-200 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-700/20 to-orange-700/20 border border-amber-600/50 text-amber-400 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            🥉
          </span>
        );
      default:
        return (
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
            #{rank}
          </span>
        );
    }
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
    <section
      id="dashboard-compact-top3-section"
      className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-3 sm:p-4 shadow-md backdrop-blur-sm transition-all"
    >
      {/* Sleek, Minimal Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <span>
              {language === 'si' ? 'විශිෂ්ඨ සිසුන් (Top Scholars)' : 'Top Scholars Standings'}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </h3>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('key_players')}
            className="text-[11px] sm:text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition cursor-pointer group"
          >
            <span>{language === 'si' ? 'සියලු දෙනා බලන්න' : 'Leaderboard'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Clean Vertical Rows for Top Registered Students */}
      <div className="space-y-1.5">
        {topScholars.map((student, idx) => {
          const rank = student.rank || idx + 1;
          const isCurrentUser = student.id === currentUserId || student.isCurrentUser;
          const locationSubtitle = [student.institution, student.districtOrCity]
            .filter(Boolean)
            .join(' • ');

          const hasImgError = imageErrors[student.id];

          return (
            <div
              key={student.id || `scholar-${idx}`}
              onClick={() => onNavigate && onNavigate('key_players')}
              className={`flex items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl border transition cursor-pointer ${
                isCurrentUser
                  ? 'bg-blue-950/40 border-blue-500/40 hover:bg-blue-950/60'
                  : 'bg-slate-950/50 border-slate-800/70 hover:bg-slate-800/40 hover:border-slate-700/80'
              }`}
            >
              {/* Left: Rank Badge + Round Avatar with Free Fire Status Indicator */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {getRankBadge(rank)}

                <div className="relative flex-shrink-0">
                  {student.avatar && !hasImgError ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      onError={() => setImageErrors(prev => ({ ...prev, [student.id]: true }))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-700 bg-slate-800"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-700 to-purple-800 border border-slate-700 flex items-center justify-center text-white font-black text-xs">
                      {getInitials(student.name)}
                    </div>
                  )}
                  {/* Free Fire Online/Offline Indicator Dot */}
                  {student.isOnline ? (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-xs shadow-emerald-500/50 ring-1 ring-emerald-400"
                      title="Online"
                    />
                  ) : (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-slate-500 border-2 border-slate-950 rounded-full"
                      title="Offline"
                    />
                  )}
                </div>

                {/* Middle: Student's Registered Name + Registered School/City + Status */}
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-100 text-xs sm:text-sm truncate">
                      {student.name}
                    </span>
                    {student.isOnline ? (
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-slate-400 bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                        Offline
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="text-[9px] font-black text-blue-300 bg-blue-900/50 px-1.5 py-0.5 rounded border border-blue-700/40 whitespace-nowrap">
                        {language === 'si' ? 'ඔබ' : 'You'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {locationSubtitle || (student.stream ? student.stream : 'Scholar')}
                  </p>
                </div>
              </div>

              {/* Right: Total XP Score Pill Tag */}
              <div className="flex-shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-extrabold text-[11px] sm:text-xs whitespace-nowrap shadow-sm">
                  {student.allTimeXP.toLocaleString()} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
