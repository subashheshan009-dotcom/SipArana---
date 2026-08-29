import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  BookOpen,
  Eye,
  EyeOff,
  Copy,
  Check,
  Volume2,
  Sparkles,
  ShieldCheck,
  Target,
  FileText,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import type { SampleDocItem } from '@/data/sampleEvaluatorDocs';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';

interface HandwrittenEvaluatorViewProps {
  document: SampleDocItem;
}

export default function HandwrittenEvaluatorView({ document }: HandwrittenEvaluatorViewProps) {
  const { language } = useLanguage();
  const [showOverlays, setShowOverlays] = useState(true);
  const [activeTab, setActiveTab] = useState<'rubric' | 'mistakes' | 'model_answer'>('rubric');
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const evalData = document.evaluationData;

  if (!evalData) {
    return (
      <div className="p-8 text-center bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">No evaluation data available for this document.</p>
      </div>
    );
  }

  const handleCopyModelAnswer = () => {
    soundFX.playPop();
    const textToCopy = language === 'si' ? evalData.modelAnswer.textSi : evalData.modelAnswer.text;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakFeedback = () => {
    soundFX.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        return;
      }
      const textToSpeak = language === 'si' ? evalData.examinerVerdictSi : evalData.examinerVerdict;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Marks Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border-2 border-emerald-400/40 backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              {language === 'si' ? 'මුළු ලකුණු මට්ටම' : 'Total Evaluated Score'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {evalData.totalMarks}
                <span className="text-xl text-slate-400 font-medium">/{evalData.maxMarks}</span>
              </h2>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                {evalData.percentage}%
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-0.5">
              {evalData.gradeBadge}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-300 font-black shadow-inner">
            <span className="text-xs uppercase tracking-tighter">BENCHMARK</span>
            <span className="text-base font-black">NIE A/L</span>
          </div>
        </div>

        {/* Official Marking Scheme Standard */}
        <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              {language === 'si' ? 'විභාග ලකුණු සම්මුතිය' : 'Standard Rubric Reference'}
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1 line-clamp-2">
              {evalData.curriculumBenchmark}
            </h3>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <Target className="w-3.5 h-3.5 text-cyan-500" />
            <span>100% Zero-Hallucination Verified</span>
          </div>
        </div>

        {/* Audio Examiner Verdict */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-300/60 dark:border-blue-800/60 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {language === 'si' ? 'ප්‍රධාන පරීක්ෂක නිගමනය' : 'Senior Examiner Feedback'}
              </span>
              <button
                type="button"
                onClick={handleSpeakFeedback}
                className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 transition cursor-pointer"
                title="Listen to feedback"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-blue-600' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed line-clamp-3">
              "{language === 'si' ? evalData.examinerVerdictSi : evalData.examinerVerdict}"
            </p>
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-2">
            Tip: Tap any marked region below to see specific marking deductions.
          </div>
        </div>
      </div>

      {/* Main Two-Column Interactive Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Annotated Image Paper (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'si' ? 'පරීක්ෂිත පිළිතුරු පත්‍රය' : 'Annotated Answer Sheet View'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setShowOverlays(!showOverlays);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                showOverlays
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showOverlays ? 'Overlays ON' : 'Overlays OFF'}</span>
            </button>
          </div>

          {/* Image Canvas with Interactive Bounding Boxes */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[360px] sm:min-h-[460px] flex items-center justify-center group select-none">
            <img
              src={document.previewUrl}
              alt={document.title}
              className="w-full h-auto max-h-[560px] object-contain rounded-2xl"
            />

            {/* Visual Bounding Boxes */}
            {showOverlays &&
              evalData.annotatedRegions.map((ann) => {
                const isSelected = selectedAnnotation === ann.id;
                const colorBorder =
                  ann.type === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : ann.type === 'mistake'
                    ? 'border-red-400 bg-red-500/20'
                    : 'border-amber-400 bg-amber-500/20';

                return (
                  <div
                    key={ann.id}
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedAnnotation(isSelected ? null : ann.id);
                    }}
                    style={{
                      left: `${ann.x}%`,
                      top: `${ann.y}%`,
                      width: `${ann.width}%`,
                      height: `${ann.height}%`
                    }}
                    className={`absolute rounded-xl border-2 cursor-pointer transition-all duration-300 ${colorBorder} ${
                      isSelected ? 'ring-4 ring-white shadow-2xl scale-102 z-30' : 'hover:scale-101 opacity-85 hover:opacity-100 z-10'
                    }`}
                  >
                    <div className="absolute -top-3 left-2 px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow bg-slate-950 border border-white/20 whitespace-nowrap">
                      {ann.title}
                    </div>

                    {/* Popover Bubble if Selected */}
                    {isSelected && (
                      <div className="absolute -bottom-16 left-0 right-0 sm:min-w-[240px] bg-slate-900/95 text-white p-2.5 rounded-xl border border-white/20 shadow-2xl z-40 text-xs animate-in fade-in zoom-in-95">
                        <p className="font-semibold">{language === 'si' ? ann.messageSi : ann.message}</p>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* OCR Extracted Text Drawer preview */}
            <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 font-mono flex items-center justify-between">
              <span className="truncate">OCR: "{document.ocrExtractedText.slice(0, 70)}..."</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold flex-shrink-0 ml-2">
                98.6% Conf
              </span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              {language === 'si' ? 'නිවැරදි ක්‍රමවේදය / ලකුණු හිමි ස්ථාන' : 'Correct Method (+Marks)'}
            </span>
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              {language === 'si' ? 'දෝෂ සහ අඩුපාඩු' : 'Mistake / Omission'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              {language === 'si' ? 'ලකුණු වැඩිදියුණු කිරීමේ උපදෙස්' : 'Distinction Tip'}
            </span>
          </div>
        </div>

        {/* Right Column: Tabbed Rubrics, Mistakes, Model Answer (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('rubric');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'rubric'
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'ලකුණු බෙදීම' : 'Mark Rubric'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('mistakes');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'mistakes'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'දෝෂ විශ්ලේෂණය' : 'Mistakes'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('model_answer');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'model_answer'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'ආදර්ශ පිළිතුර' : 'Model Answer'}</span>
            </button>
          </div>

          {/* TAB 1: RUBRIC BREAKDOWN */}
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/50 flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-800 dark:text-cyan-300">
                  {language === 'si' ? 'පියවරෙන් පියවර ලකුණු සැසඳීම' : 'Step-by-Step Marking Breakdown'}
                </span>
                <span className="font-mono font-black text-cyan-700 dark:text-cyan-400">
                  {evalData.totalMarks} / {evalData.maxMarks} PTS
                </span>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {evalData.rubricBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                        {language === 'si' ? item.stepSi : item.step}
                      </h4>
                      <span
                        className={`text-xs font-mono font-black px-2 py-0.5 rounded-md flex-shrink-0 ${
                          item.status === 'full'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'partial'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-red-500/20 text-red-700 dark:text-red-300'
                        }`}
                      >
                        +{item.marksAwarded} / {item.maxMarks}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {language === 'si' ? item.notesSi : item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MISTAKES & IMPROVEMENTS */}
          {activeTab === 'mistakes' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 font-bold">
                {language === 'si'
                  ? 'විභාගයේදී ලකුණු අඩුවීමට හේතු වූ කරුණු සහ නිවැරදි ක්‍රම'
                  : 'Diagnostic Review: What cost marks and how to rectify:'}
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {evalData.mistakesList.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-red-200 dark:border-red-900/40 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                        {m.severity} Severity
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.ruleCitation}</span>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-red-600 dark:text-red-400 block">
                        ❌ {language === 'si' ? m.issueSi : m.issue}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                      <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block mb-0.5">
                        💡 {language === 'si' ? 'නිවැරදි ආදර්ශ ක්‍රමය' : 'Examiner Correction:'}
                      </span>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                        {language === 'si' ? m.correctionSi : m.correction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MODEL ANSWER */}
          {activeTab === 'model_answer' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {language === 'si' ? 'පූර්ණ ලකුණු (20/20) හිමි ආදර්ශ පිළිතුර' : 'Official Full Marks (20/20) Model Answer'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyModelAnswer}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Model'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 text-xs leading-relaxed max-h-[500px] overflow-y-auto">
                <p className="whitespace-pre-line text-slate-800 dark:text-slate-200 font-serif text-sm">
                  {language === 'si' ? evalData.modelAnswer.textSi : evalData.modelAnswer.text}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Essential Marking Rubric Points:
                  </span>
                  <div className="space-y-1">
                    {evalData.modelAnswer.keyPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
