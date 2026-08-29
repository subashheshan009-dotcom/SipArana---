import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calculator,
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  Repeat
} from 'lucide-react';
import type { SampleDocItem } from '@/data/sampleEvaluatorDocs';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface StepByStepSolverViewProps {
  document: SampleDocItem;
}

export default function StepByStepSolverView({ document }: StepByStepSolverViewProps) {
  const { language } = useLanguage();
  const [showPracticeHint, setShowPracticeHint] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4]);

  const solver = document.solverData;

  if (!solver) {
    return (
      <div className="p-8 text-center bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">No step-by-step solver calculations for this problem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problem Header & Physics/Math Paradigm Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border border-blue-400/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-300" />
            {solver.identifiedTopic}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-200">
            {solver.academicCitation}
          </span>
        </div>

        <div>
          <span className="text-[11px] uppercase font-bold text-cyan-200 tracking-wider block mb-1">
            {language === 'si' ? 'ස්කෑන් කළ ප්‍රශ්න ප්‍රකාශනය' : 'Scanned Problem Statement:'}
          </span>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-white">
            {language === 'si' ? solver.problemStatementSi : solver.problemStatement}
          </p>
        </div>

        {/* Given Parameters vs Target Unknowns Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
          {/* Given */}
          <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 space-y-1.5">
            <span className="font-extrabold text-cyan-300 uppercase text-[10px] tracking-wider block">
              Given Initial Parameters:
            </span>
            <div className="flex flex-wrap gap-2">
              {solver.givenVariables.map((v, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-white/10 text-white font-mono text-[11px] font-bold"
                  title={v.description}
                >
                  {v.symbol} = {v.value} {v.unit}
                </span>
              ))}
            </div>
          </div>

          {/* Targets */}
          <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 space-y-1.5">
            <span className="font-extrabold text-amber-300 uppercase text-[10px] tracking-wider block">
              Target Unknown Variables:
            </span>
            <div className="flex flex-wrap gap-2">
              {solver.targetUnknowns.map((u, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-200 font-mono text-[11px] font-bold"
                  title={u.description}
                >
                  {u.symbol} (?)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Step-by-Step Derivations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {language === 'si' ? 'පියවරෙන් පියවර ගණිතමය විසඳුම් ක්‍රමය' : 'Step-by-Step Mathematical Derivation'}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {solver.steps.length} Steps Solved
          </span>
        </div>

        <div className="space-y-4">
          {solver.steps.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 relative overflow-hidden"
              >
                {/* Accent indicator bar */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-cyan-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {language === 'si' ? step.titleSi : step.title}
                    </h4>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Verified
                  </span>
                </div>

                {/* Formula Equation Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs sm:text-sm font-bold border border-cyan-500/30 overflow-x-auto shadow-inner">
                  {step.equation}
                </div>

                {/* Pedagogical Explanation */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'si' ? step.explanationSi : step.explanation}
                </p>

                {/* Intermediate Result Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Step Result:</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-900/60">
                    {step.intermediateResult}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Boxed Verdict Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-2 border-emerald-400/60 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-500" />
            {language === 'si' ? 'අවසාන තහවුරු කළ පිළිතුර' : 'Final Boxed Analytical Answer'}
          </span>
          <span className="text-xs font-bold text-slate-500">{solver.finalAnswer.unit}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
          {solver.finalAnswer.value}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
          {language === 'si' ? solver.finalAnswer.verdictSi : solver.finalAnswer.verdict}
        </p>
      </div>

      {/* Examiner Pitfalls & Exam Traps Warning Box */}
      <div className="p-5 rounded-3xl bg-red-500/10 border border-red-400/40 space-y-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <h4 className="text-xs sm:text-sm font-black text-red-700 dark:text-red-300 uppercase tracking-wide">
            {language === 'si' ? 'විභාගයේදී බහුලව සිදුවන උගුල් සහ වැරදි (Examiner Pitfalls)' : 'Common Student Traps & Examiner Warnings'}
          </h4>
        </div>

        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {(language === 'si' ? solver.examinerPitfallsSi : solver.examinerPitfalls).map((trap, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                !
              </span>
              <p className="leading-snug">{trap}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Question Variant */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Repeat className="w-4 h-4" />
            {language === 'si' ? 'ස්වයං පුහුණු අනුරූප ප්‍රශ්නය' : 'Practice Variant to Test Yourself'}
          </span>
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setShowPracticeHint(!showPracticeHint);
            }}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            {showPracticeHint ? 'Hide Hint' : 'Show Solution Hint'}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
          {language === 'si' ? solver.practiceVariant.questionSi : solver.practiceVariant.question}
        </p>

        {showPracticeHint && (
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 text-xs text-cyan-900 dark:text-cyan-200 animate-in fade-in">
            <span className="font-bold block mb-0.5">💡 Strategy Hint:</span>
            {solver.practiceVariant.hint}
          </div>
        )}
      </div>
    </div>
  );
}
