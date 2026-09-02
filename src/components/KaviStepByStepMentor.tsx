import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
  Award,
  Zap,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Heart,
  Bot,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCountry } from '@/context/CountryContext';
import { getKaviDynamicAdvice, DynamicKaviAdvice } from '@/utils/autonomousCurriculumEngine';
import { GlobalCurriculumEngine } from '@/utils/globalCurriculumEngine';
import { soundFX } from '@/utils/audioUtils';
import kaviAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';
import confetti from 'canvas-confetti';
import type { PageId } from '@/components/Layout';

interface KaviStepByStepMentorProps {
  onNavigate?: (page: PageId) => void;
  className?: string;
}

export default function KaviStepByStepMentor({
  onNavigate,
  className = ''
}: KaviStepByStepMentorProps) {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();
  const { country, curriculum, dictionary, mascot } = useCountry();
  const [activeAdviceIndex, setActiveAdviceIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completedAdviceIds, setCompletedAdviceIds] = useState<string[]>([]);

  const globalMascot = mascot;

  const grade = profile?.grade || 11;
  const streak = profile?.streakDays || 1;
  const advices = getKaviDynamicAdvice(grade, profile?.stream, streak);
  const currentAdvice = advices[activeAdviceIndex] || advices[0];

  const isSriLanka = !profile?.countryCode || profile.countryCode === 'LK';

  const handleSpeak = (text: string, locale = 'si-LK') => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/🦉|"/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.lang = locale;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    soundFX.playClick();
    window.speechSynthesis.speak(utterance);
  };

  const handleClaimMission = (advice: DynamicKaviAdvice) => {
    if (completedAdviceIds.includes(advice.id)) return;
    setCompletedAdviceIds(prev => [...prev, advice.id]);
    addXP(advice.xpBonus);
    soundFX.playLevelUp();
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }

    if (advice.recommendedAction && onNavigate) {
      onNavigate(advice.recommendedAction.page as PageId);
    }
  };

  return (
    <div
      id="kavi-step-by-step-mentor-card"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-indigo-950/40 border-2 border-amber-400/80 dark:border-amber-500/70 p-5 sm:p-6 shadow-lg backdrop-blur-sm ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Avatar & Mascot Identity */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div
            className="relative group cursor-pointer"
            onClick={() =>
              isSriLanka
                ? handleSpeak(currentAdvice.audioPromptSi, 'si-LK')
                : handleSpeak(globalMascot.spokenAudioScript, globalMascot.speechLocale)
            }
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-2 border-amber-300 p-0.5 shadow-md bg-gradient-to-tr from-amber-400 to-indigo-600 transition-transform transform group-hover:scale-105">
              <img
                src={kaviAvatar}
                alt={globalMascot.mascotName}
                className="w-full h-full object-cover rounded-[22px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-white shadow-md border-2 border-white dark:border-slate-900">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-950 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-wide border border-amber-400/50 flex items-center gap-1">
                <span>{globalMascot.avatarIcon}</span>
                <span>{globalMascot.mascotName}</span>
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {globalMascot.badgeLabel}
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {country.flag} {country.name}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {globalMascot.greetingTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {globalMascot.greetingMessage}
            </p>
          </div>
        </div>

        {/* Right: Advice Selector & Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() =>
              isSriLanka
                ? handleSpeak(currentAdvice.audioPromptSi, 'si-LK')
                : handleSpeak(globalMascot.spokenAudioScript, globalMascot.speechLocale)
            }
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
            <span>{isSpeaking ? 'Stop Voice' : 'Listen to Voice AI'}</span>
          </button>

          {isSriLanka && (
            <div className="flex items-center gap-1">
              {advices.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveAdviceIndex(idx);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                    activeAdviceIndex === idx
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Localized Speech Bubble */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-300/80 dark:border-amber-600/60 shadow-sm relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-amber-100 leading-relaxed font-sans">
            {isSriLanka ? currentAdvice.messageSi : globalMascot.dailyStepMission}
          </p>
          <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] flex-shrink-0 flex items-center gap-1 border border-amber-300/50">
            <Zap className="w-3.5 h-3.5 fill-amber-500" /> +{currentAdvice.xpBonus} XP
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-semibold">
            {isSriLanka ? 'කවිගේ මතක උපදෙස:' : 'Mascot Study Tip:'} {globalMascot.pedagogicalTip}
          </span>
        </div>

        {/* Action Button */}
        {currentAdvice.recommendedAction && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isSriLanka ? 'පියවරෙන් පියවර මෙහෙයුම (Step Mission):' : 'Step-by-Step Goal:'}
            </span>

            <button
              type="button"
              onClick={() => handleClaimMission(currentAdvice)}
              className="min-h-[44px] sm:min-h-[38px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer relative z-20 pointer-events-auto touch-manipulation select-none"
            >
              <span>
                {completedAdviceIds.includes(currentAdvice.id)
                  ? 'Mission Completed! ✔'
                  : isSriLanka
                  ? currentAdvice.recommendedAction.labelSi
                  : currentAdvice.recommendedAction.labelEn}
              </span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
