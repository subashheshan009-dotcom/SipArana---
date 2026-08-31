import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { WEEKLY_STUDY_SCHEDULE, type DayStudyData } from '@/data/keyPlayersData';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

export const StudyScheduleTable: React.FC = () => {
  const { language } = useLanguage();
  const [schedule, setSchedule] = useState<DayStudyData[]>(WEEKLY_STUDY_SCHEDULE);
  const [activeDay, setActiveDay] = useState<string>('Monday');

  const totalWeeklyMinutes = schedule.reduce((acc, curr) => acc + curr.totalMinutes, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const totalXPExpected = schedule.reduce((acc, curr) => acc + curr.xpEarned, 0);

  const toggleTarget = (dayName: string) => {
    soundFX.playPop();
    setSchedule((prev) =>
      prev.map((d) => (d.dayName === dayName ? { ...d, targetAchieved: !d.targetAchieved } : d))
    );
  };

  const selectedDayData = schedule.find((d) => d.dayName === activeDay) || schedule[0];

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Weekly High-Precision Study Schedule & Daily Targets</span>
          </h3>
          <p className="text-xs text-slate-400">
            Optimal study distribution modeled after Island Rank 1 scholars & Olympiad finalists
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{totalWeeklyHours} hrs / week target</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>+{totalXPExpected} XP Potential</span>
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="grid grid-cols-7 gap-2">
        {schedule.map((day) => {
          const isActive = day.dayName === activeDay;
          return (
            <button
              key={day.dayName}
              onClick={() => {
                setActiveDay(day.dayName);
                soundFX.playPop();
              }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                isActive
                  ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/40 text-white shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">{day.dayShort}</span>
              <span className="text-sm font-black text-amber-400">{day.hours}h {day.minutes}m</span>
              <span className="text-[10px]">
                {day.targetAchieved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Focus Card */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">{selectedDayData.dayName} Deep Focus Plan</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold border border-slate-700">
              {selectedDayData.hours}h {selectedDayData.minutes}m Active Practice
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Focus Modules: {selectedDayData.focusTopic}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedDayData.subjectTags.map((tag, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                🏷️ {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Daily Mastery Boost</span>
            <div className="text-sm font-black text-amber-400">+{selectedDayData.xpEarned} XP</div>
          </div>
          <button
            type="button"
            onClick={() => toggleTarget(selectedDayData.dayName)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedDayData.targetAchieved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedDayData.targetAchieved ? 'Target Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
