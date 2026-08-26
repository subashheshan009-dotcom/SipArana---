import React, { useState } from 'react';
import {
  Shield,
  GraduationCap,
  Sparkles,
  Lock,
  CheckCircle2,
  Filter,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Eye,
  Smile
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCountry } from '@/context/CountryContext';
import { soundFX } from '@/utils/audioUtils';
import type { SchoolGrade, Stream } from '@/types';
import type { GlobalEducationStage } from '@/data/globalCurriculumData';

interface StudentRoleIsolationBannerProps {
  onOpenSyncModal?: () => void;
  className?: string;
}

export default function StudentRoleIsolationBanner({
  onOpenSyncModal,
  className = ''
}: StudentRoleIsolationBannerProps) {
  const { profile, setGradeAndStream, loginAsDemo } = useAuth();
  const { language } = useLanguage();
  const { country, curriculum, dictionary, stages } = useCountry();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const grade = profile?.grade || 11;
  const isSriLanka = country.code === 'LK';

  // Find the active stage dynamically from stages list
  const activeStage: GlobalEducationStage = React.useMemo(() => {
    if (!stages || stages.length === 0) {
      return {
        id: 'default_stage',
        name: 'General Academic',
        gradeRangeLabel: `Grade ${grade}`,
        typicalAge: 'Standard School Age',
        targetGrades: [grade],
        defaultStream: profile?.stream || 'General Academic',
        streams: [profile?.stream || 'General Academic']
      };
    }

    const matched = stages.find(s => s.targetGrades.includes(grade));
    return matched || stages[stages.length - 1];
  }, [stages, grade, profile?.stream]);

  // Stage tier styling and copy helper
  const currentRoleTier = React.useMemo(() => {
    const stageName = (language === 'si' && activeStage.nameLocal) ? activeStage.nameLocal : activeStage.name;
    const stageIndex = stages.findIndex(s => s.id === activeStage.id);

    let color = 'from-blue-600 to-indigo-600';
    let bgColor = 'bg-blue-500/10 border-blue-400/50 dark:border-blue-500/40';
    let textColor = 'text-blue-900 dark:text-blue-300';

    if (stageIndex === 0) {
      color = 'from-amber-500 to-orange-500';
      bgColor = 'bg-amber-500/10 border-amber-400/50 dark:border-amber-500/40';
      textColor = 'text-amber-900 dark:text-amber-300';
    } else if (stageIndex === 1) {
      color = 'from-purple-600 to-pink-600';
      bgColor = 'bg-purple-500/10 border-purple-400/50 dark:border-purple-500/40';
      textColor = 'text-purple-900 dark:text-purple-300';
    } else if (stageIndex === 2) {
      color = 'from-emerald-600 to-teal-600';
      bgColor = 'bg-emerald-500/10 border-emerald-400/50 dark:border-emerald-500/40';
      textColor = 'text-emerald-900 dark:text-emerald-300';
    }

    const streamLabel = profile?.stream || activeStage.defaultStream || dictionary.activeStreamName;

    return {
      title: `${dictionary.flag} ${country.name} • ${stageName}`,
      subtitle: `${activeStage.gradeRangeLabel} (${activeStage.typicalAge}) • ${streamLabel}`,
      badge: `${country.code} ${activeStage.name.split(' ')[0]} Tier`,
      color,
      bgColor,
      textColor,
      activeFilterDesc: language === 'si' && isSriLanka
        ? `${stageName} විෂය නිර්දේශය සහ ${dictionary.ministryShort} ප්‍රමිතීන් සක්‍රීය කර ඇත.`
        : language === 'ja'
        ? `${country.name} ${curriculum.authorityBoard} 指導要領に完全準拠 (${activeStage.gradeRangeLabel})。`
        : `Aligned with ${curriculum.authorityBoard} official curriculum standards for ${activeStage.gradeRangeLabel}.`
    };
  }, [country, curriculum, dictionary, activeStage, stages, language, isSriLanka, profile?.stream]);

  const handleSelectStage = (stage: GlobalEducationStage) => {
    soundFX.playClick();
    const targetGrade = stage.targetGrades[stage.targetGrades.length - 1] as SchoolGrade;
    setGradeAndStream(targetGrade, stage.defaultStream as Stream);
    setIsSwitcherOpen(false);
  };

  return (
    <div
      id="student-role-isolation-bar"
      className={`rounded-2xl p-3.5 sm:p-4 border backdrop-blur-xs transition-all shadow-xs ${currentRoleTier.bgColor} ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Role Info & Security Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 shadow-xs flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{currentRoleTier.title}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-bold">
                {currentRoleTier.badge}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold">
                {activeStage.typicalAge}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
              {currentRoleTier.activeFilterDesc}
            </p>
          </div>
        </div>

        {/* Right: Quick Switcher Dropdown & Autonomous Hub Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onOpenSyncModal && (
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'si' ? 'ස්වයංක්‍රීය සමමුහුර්ත පුවරුව' : 'Autonomous Sync Hub'}</span>
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              id="role-switcher-toggle-btn"
              onClick={() => setIsSwitcherOpen(prev => !prev)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs hover:border-amber-500 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'si' ? 'අධ්‍යාපන මට්ටම මාරු කරන්න' : 'Switch Education Stage'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSwitcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-2xl z-30 space-y-1 text-xs">
                <div className="p-2 text-[11px] font-black text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>{country.name} Official Stages</span>
                  <span className="text-amber-500 font-bold">{country.code}</span>
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {stages.map((stg, idx) => {
                    const isCurrent = activeStage.id === stg.id;
                    const stageDisplay = (language === 'si' && stg.nameLocal) ? stg.nameLocal : stg.name;
                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => handleSelectStage(stg)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between group transition cursor-pointer border ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-950 dark:text-blue-200'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{stageDisplay}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">{stg.gradeRangeLabel}</span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-blue-400">{stg.typicalAge}</span>
                            </div>
                          </div>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
