import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Award,
  RefreshCw,
  X,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  GLOBAL_COUNTRIES,
  getCountryByCode,
  type GlobalCountry,
  type GlobalCountryCode,
  type GlobalCurriculum
} from '@/data/globalCurriculumData';
import { GlobalCurriculumEngine, type GlobalCurriculumSyncTelemetry } from '@/utils/globalCurriculumEngine';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface GlobalCountryCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalCountryCurriculumModal({
  isOpen,
  onClose
}: GlobalCountryCurriculumModalProps) {
  const { profile, setCountryAndCurriculum } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [selectedCountryCode, setSelectedCountryCode] = useState<GlobalCountryCode>(
    profile?.countryCode || 'LK'
  );
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>(
    profile?.curriculumId || 'LK_NIE'
  );
  const [activeTab, setActiveTab] = useState<'select' | 'telemetry'>('select');
  const [telemetries, setTelemetries] = useState<GlobalCurriculumSyncTelemetry[]>(
    GlobalCurriculumEngine.getGlobalSyncTelemetry()
  );
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  if (!isOpen) return null;

  const currentCountry = getCountryByCode(selectedCountryCode);
  const availableCurricula = currentCountry.curricula;

  const handleCountrySelect = (code: GlobalCountryCode) => {
    setSelectedCountryCode(code);
    const country = getCountryByCode(code);
    if (country.curricula.length > 0) {
      setSelectedCurriculumId(country.curricula[0].id);
    }
    soundFX.playClick();
  };

  const handleApplyGlobalChanges = () => {
    setCountryAndCurriculum(selectedCountryCode, selectedCurriculumId);
    
    // Auto-align language if desired
    const country = getCountryByCode(selectedCountryCode);
    if (country.defaultLanguage && country.defaultLanguage !== language) {
      setLanguage(country.defaultLanguage);
    }

    soundFX.playLevelUp();
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    onClose();
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshingTelemetry(true);
    soundFX.playClick();
    setTimeout(() => {
      setTelemetries(GlobalCurriculumEngine.getGlobalSyncTelemetry());
      setIsRefreshingTelemetry(false);
      soundFX.playCorrect();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Global Country & Curriculum Engine</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  Auto-Adaptive
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly switch national education frameworks, grading systems, and syllabi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'select'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Select Country & Curriculum</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Autonomous Telemetry ({telemetries.length} Regions)</span>
          </button>
        </div>

        {/* Tab 1: Country & Curriculum Selection */}
        {activeTab === 'select' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2 block">
                1. Select Country / Region
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {GLOBAL_COUNTRIES.map((c) => {
                  const isSelected = selectedCountryCode === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c.code)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">{c.flag}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <span className="font-extrabold text-xs leading-tight">{c.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full">{c.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Curriculum Breakdown */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2 block">
                2. Official Education Curriculum ({currentCountry.name})
              </label>
              <div className="space-y-2">
                {availableCurricula.map((curr) => {
                  const isCurrSelected = selectedCurriculumId === curr.id;
                  return (
                    <div
                      key={curr.id}
                      onClick={() => {
                        setSelectedCurriculumId(curr.id);
                        soundFX.playClick();
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start justify-between gap-3 ${
                        isCurrSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {curr.titleEnglish}
                          </span>
                          {curr.titleNative !== curr.titleEnglish && (
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              ({curr.titleNative})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {curr.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            🏛️ {curr.authorityBoard}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                            📊 Scale: {curr.gradingSystem.scaleName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                            📚 {curr.subjects.length} Core Subjects
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={isCurrSelected}
                        onChange={() => setSelectedCurriculumId(curr.id)}
                        className="mt-1 accent-blue-600"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyGlobalChanges}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply & Adapt Platform</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Live Autonomous Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Self-Evolving Authority Handshakes (Live Status)
              </span>
              <button
                type="button"
                onClick={handleRefreshTelemetry}
                disabled={isRefreshingTelemetry}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingTelemetry ? 'animate-spin' : ''}`} />
                <span>Ping Education Boards</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {telemetries.map((t) => (
                <div
                  key={t.countryCode}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{t.flag}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{t.countryName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({t.authorityBoard})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Build: {t.activeFrameworkVersion} • Latency: {t.latencyMs}ms
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-black text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                All international syllabi (NIE, Ofqual, College Board, MEXT, CBSE, IB) auto-sync without code deprecation.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
