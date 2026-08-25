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
import { SCHOOL_GRADES } from '@/data/mockData';
import { soundFX } from '@/utils/audioUtils';
import type { SchoolGrade, Stream } from '@/types';

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
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const grade = profile?.grade || 11;
  const isGrade5 = grade === 5 || profile?.level === 'SCHOLARSHIP';
  const isAL = grade >= 12;
  const isOL = grade >= 10 && grade <= 11;
  const isJunior = grade >= 6 && grade <= 9;

  const currentRoleTier = isGrade5
    ? {
        nameSi: '5 වසර ප්‍රාථමික ශිෂ්‍යත්ව මාදිලිය (Grade 5 Primary Isolated)',
        nameEn: 'Grade 5 Primary Scholarship Isolated Tier',
        badge: 'Kid-Mode & Voice First',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10 border-amber-400/50 dark:border-amber-500/40',
        textColor: 'text-amber-900 dark:text-amber-300',
        activeFilterDescSi: 'උසස් පෙළ Z-Score වැනි අනවශ්‍ය දෑ ස්වයංක්‍රීයව අගුලු දමා (Locked out), 5 වසර විෂයයන් සහ කවි බකමූණා පමණක් සක්‍රීය කර ඇත.',
        activeFilterDescEn: 'A/L Z-Score & complex senior modules locked out. Rendered child-friendly Sinhala interface & primary syllabus.'
      }
    : isAL
    ? {
        nameSi: `උසස් පෙළ (${profile?.stream || 'Physical Science'}) මාදිලිය`,
        nameEn: `G.C.E. A/L (${profile?.stream || 'Physical Science'}) Senior Tier`,
        badge: 'A/L Stream Isolated',
        color: 'from-blue-600 to-indigo-600',
        bgColor: 'bg-blue-500/10 border-blue-400/50 dark:border-blue-500/40',
        textColor: 'text-blue-900 dark:text-blue-300',
        activeFilterDescSi: `ඔබගේ ${profile?.stream || 'Physical Science'} ධාරාවට අදාළ විෂයයන්, Z-Score සහ පසුගිය ප්‍රශ්න පත්‍ර පමණක් සක්‍රීයයි.`,
        activeFilterDescEn: `Custom-tailored to ${profile?.stream || 'Physical Science'} stream. Irrelevant grade content isolated.`
      }
    : isOL
    ? {
        nameSi: 'සාමාන්‍ය පෙළ 10-11 ශ්‍රේණි මාදිලිය (G.C.E. O/L Isolated)',
        nameEn: 'G.C.E. O/L (Grades 10-11) Target Tier',
        badge: 'O/L 9-A Target',
        color: 'from-emerald-600 to-teal-600',
        bgColor: 'bg-emerald-500/10 border-emerald-400/50 dark:border-emerald-500/40',
        textColor: 'text-emerald-900 dark:text-emerald-300',
        activeFilterDescSi: 'සාමාන්‍ය පෙළ විෂයන් 9 සහ ආදර්ශ ප්‍රශ්න පත්‍ර පද්ධතිය සක්‍රීය කර ඇත.',
        activeFilterDescEn: 'Optimized for 9 O/L core and basket subjects with auto-marked MCQ diagnostics.'
      }
    : {
        nameSi: 'කනිෂ්ඨ ද්විතීයික 6-9 ශ්‍රේණි මාදිලිය (Junior Secondary)',
        nameEn: 'Junior Secondary (Grades 6-9) Tier',
        badge: 'Junior Secondary',
        color: 'from-purple-600 to-pink-600',
        bgColor: 'bg-purple-500/10 border-purple-400/50 dark:border-purple-500/40',
        textColor: 'text-purple-900 dark:text-purple-300',
        activeFilterDescSi: '6-9 ශ්‍රේණිවල පාසල් විෂය මාලාවට අදාළ මූලික සංකල්ප සහ ප්‍රායෝගික පැවරුම් සක්‍රීයයි.',
        activeFilterDescEn: 'Foundational secondary curriculum active with interactive lessons and STEM activities.'
      };

  const handleSelectGrade = (newGrade: SchoolGrade, newStream?: Stream) => {
    soundFX.playClick();
    setGradeAndStream(newGrade, newStream);
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
                {language === 'si' ? currentRoleTier.nameSi : currentRoleTier.nameEn}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-bold">
                {currentRoleTier.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
              {language === 'si' ? currentRoleTier.activeFilterDescSi : currentRoleTier.activeFilterDescEn}
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
              <span>{language === 'si' ? 'ශ්‍රේණිය මාරු කරන්න' : 'Switch Grade Role'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSwitcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-2xl z-30 space-y-1 text-xs">
                <div className="p-2 text-[11px] font-black text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
                  {language === 'si' ? 'ශ්‍රේණි භූමිකාව තෝරන්න (Role Isolation)' : 'Select Role Isolation Tier'}
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectGrade(5, 'Grade 5 Scholarship')}
                  className="w-full p-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🦉</span>
                    <div>
                      <div className="font-bold text-amber-900 dark:text-amber-300">5 වසර ශිෂ්‍යත්වය (Scholarship)</div>
                      <div className="text-[10px] text-slate-500">Kid Mode, Puzzles, Primary Sinhala</div>
                    </div>
                  </div>
                  {isGrade5 && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGrade(9)}
                  className="w-full p-2 rounded-xl text-left hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎒</span>
                    <div>
                      <div className="font-bold text-purple-900 dark:text-purple-300">6-9 කනිෂ්ඨ ශ්‍රේණි (Junior)</div>
                      <div className="text-[10px] text-slate-500">General Science, Maths, History</div>
                    </div>
                  </div>
                  {isJunior && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGrade(11)}
                  className="w-full p-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📝</span>
                    <div>
                      <div className="font-bold text-emerald-900 dark:text-emerald-300">10-11 සාමාන්‍ය පෙළ (O/L)</div>
                      <div className="text-[10px] text-slate-500">9 Subjects, Past Papers, Auto Tests</div>
                    </div>
                  </div>
                  {isOL && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGrade(13, 'Physical Science (Maths)')}
                  className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📐</span>
                    <div>
                      <div className="font-bold text-blue-900 dark:text-blue-300">12-13 උසස් පෙළ Maths (A/L)</div>
                      <div className="text-[10px] text-slate-500">Combined Maths, Physics, Z-Score</div>
                    </div>
                  </div>
                  {isAL && profile?.stream === 'Physical Science (Maths)' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGrade(13, 'Biological Science (Bio)')}
                  className="w-full p-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔬</span>
                    <div>
                      <div className="font-bold text-emerald-900 dark:text-emerald-300">12-13 උසස් පෙළ Bio (A/L)</div>
                      <div className="text-[10px] text-slate-500">Biology, Chemistry, Physics</div>
                    </div>
                  </div>
                  {isAL && profile?.stream === 'Biological Science (Bio)' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
