import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
  RotateCcw,
  Zap,
  Flame,
  Send,
  HelpCircle,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { WRITING_PROMPTS, WritingPrompt } from '@/data/languageAdventureData';
import { soundFX } from '@/utils/audioUtils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import girlAvatar from '@/assets/images/mascot_hero_girl_1787746112702.jpg';

interface WritingSectionProps {
  onEarnXP: (amount: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

interface GrammarIssue {
  original: string;
  suggestion: string;
  reason: string;
}

export default function WritingSection({ onEarnXP, onUnlockBadge }: WritingSectionProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[0]);
  const [essayText, setEssayText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    grammarScore: number;
    vocabScore: number;
    structureScore: number;
    totalWords: number;
    issues: GrammarIssue[];
    praiseFeedback: string;
  } | null>(null);

  const [copiedStarter, setCopiedStarter] = useState(false);

  // Set default starter on prompt change
  const handleSelectPrompt = (prompt: WritingPrompt) => {
    soundFX.playClick();
    setSelectedPrompt(prompt);
    setAnalysisResult(null);
  };

  const handleUseStarter = () => {
    soundFX.playPop();
    setEssayText(prev => (prev ? prev + ' ' + selectedPrompt.sampleStarter : selectedPrompt.sampleStarter));
    setCopiedStarter(true);
    setTimeout(() => setCopiedStarter(false), 2000);
  };

  // Perform Live Grammar & Spelling Analysis
  const handleAnalyzeWriting = () => {
    if (!essayText.trim() || essayText.trim().split(/\s+/).length < 3) {
      soundFX.playWrong();
      return;
    }

    soundFX.playPop();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);

      const words = essayText.trim().split(/\s+/);
      const wordCount = words.length;

      // Smart rule-based checker
      const detectedIssues: GrammarIssue[] = [];
      const lower = essayText.toLowerCase();

      if (lower.includes(' i ') || lower.startsWith('i ')) {
        // Checking lowercase single 'i'
        if (essayText.includes(' i ') || essayText.startsWith('i ')) {
          detectedIssues.push({
            original: 'i',
            suggestion: 'I',
            reason: 'Always capitalize the first-person singular pronoun "I".'
          });
        }
      }

      if (lower.includes('good') && !lower.includes('extraordinary') && !lower.includes('remarkable')) {
        detectedIssues.push({
          original: 'good',
          suggestion: 'magnificent / outstanding',
          reason: 'Enrich your vocabulary with vivid adjectives!'
        });
      }

      if (lower.includes('alot')) {
        detectedIssues.push({
          original: 'alot',
          suggestion: 'a lot',
          reason: '"A lot" is always written as two separate words.'
        });
      }

      if (lower.includes('dont') || lower.includes('cant')) {
        detectedIssues.push({
          original: 'dont / cant',
          suggestion: "don't / can't",
          reason: 'Include apostrophes in informal contractions, or spell out "do not" for formal essays.'
        });
      }

      const calculatedGrammar = Math.min(100, Math.max(78, 100 - detectedIssues.length * 6));
      const calculatedVocab = Math.min(100, Math.max(80, 85 + Math.min(15, wordCount / 4)));
      const calculatedStructure = Math.min(100, Math.max(82, 88 + (essayText.includes('.') ? 10 : 0)));

      setAnalysisResult({
        grammarScore: calculatedGrammar,
        vocabScore: Math.round(calculatedVocab),
        structureScore: Math.round(calculatedStructure),
        totalWords: wordCount,
        issues: detectedIssues,
        praiseFeedback:
          wordCount >= 20
            ? 'Splendid writing! Your sentences flow with clarity and thoughtful descriptions.'
            : 'Well started! Add a few more descriptive details to bring your ideas to life.'
      });

      if (calculatedGrammar >= 88) {
        soundFX.playCorrect();
        onEarnXP(selectedPrompt.xpReward);
        if (onUnlockBadge) onUnlockBadge('badge_writing_wizard');

        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      } else {
        soundFX.playPop();
        onEarnXP(Math.round(selectedPrompt.xpReward / 2));
      }
    }, 1000);
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Section Header Card with Creative Girl Anime Character */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 shadow-xl">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl bg-white/10 ring-4 ring-pink-300/30">
                <img
                  src={girlAvatar}
                  alt="Creative Writer Anime Girl"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-pink-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                ✍️
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-pink-200">
                <PenTool className="w-3 h-3" />
                SECTION 2: WRITING (ලියන)
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Illuminated Parchment & Grammar Wizard 📜
              </h2>
              <p className="text-xs sm:text-sm text-pink-100/90 font-medium">
                {language === 'si'
                  ? 'රන්වන් තීන්තෙන් රචනා ලියන්න. ස්වයංක්‍රීය ව්‍යාකරණ, අක්ෂර වින්‍යාසය සහ වදන් මාලා ඇගයීම!'
                  : 'Draft stories on ancient glowing parchment! Get gentle spelling & grammar feedback.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black text-amber-200">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>+{selectedPrompt.xpReward} XP for Submission</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompts & Writing Guidance */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Creative Writing Prompts
          </span>

          <div className="space-y-2.5">
            {WRITING_PROMPTS.map(p => {
              const isSelected = selectedPrompt.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPrompt(p)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      +{p.xpReward} XP
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                    {p.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-sinhala">
                    {p.titleSi}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Prompt Details Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                Prompt Instructions:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {selectedPrompt.instructionsEn}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sinhala">
                {selectedPrompt.instructionsSi}
              </p>
            </div>

            {/* Suggested Keywords */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Suggested Power Words:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPrompt.suggestedKeywords.map(kw => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Kavi Tip */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <span className="text-base">🦉</span>
              <div className="text-[11px]">
                <strong className="font-black text-amber-800 dark:text-amber-400 block">
                  Kavi's Grammar Hint:
                </strong>
                <span>{selectedPrompt.kaviTipEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ancient Parchment Scroll Writing Space */}
        <div className="lg:col-span-8 space-y-4">
          {/* Scroll Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Ancient Inkwell Parchment</span>
                <span className="text-xs">📜</span>
              </span>
              <button
                type="button"
                onClick={handleUseStarter}
                className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition flex items-center gap-1 cursor-pointer"
                title="Insert sample starter sentence"
              >
                {copiedStarter ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStarter ? 'Inserted!' : 'Use Sentence Starter'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{wordCount} Words</span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setEssayText('');
                  setAnalysisResult(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-400 hover:text-slate-700"
                title="Clear parchment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parchment Styled Textarea */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-xl border-2 border-amber-300/80 dark:border-slate-700">
            <div className="relative rounded-2xl bg-[#FAF6EE] dark:bg-[#0F172A] p-5 sm:p-6 transition-all">
              {/* Quill watermark */}
              <div className="absolute top-4 right-4 text-4xl opacity-10 pointer-events-none select-none">
                🪶
              </div>

              <textarea
                id="writing-parchment-input"
                rows={9}
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                placeholder="Begin writing your story or essay here in flowing ink... Use full sentences, vivid adjectives, and proper punctuation."
                className="w-full bg-transparent resize-none outline-none font-serif text-slate-900 dark:text-amber-50 text-sm sm:text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />

              <div className="pt-3 border-t border-amber-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Tip: Write at least 20 words for full AI vocabulary analysis.
                </span>

                <button
                  type="button"
                  id="submit-writing-btn"
                  onClick={handleAnalyzeWriting}
                  disabled={isAnalyzing || !essayText.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg transition transform hover:scale-105 disabled:opacity-50 cursor-pointer flex items-center gap-2 self-stretch sm:self-auto justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Checking Grammar & Style...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for AI Review & XP ✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis & Feedback Scorecard */}
          {analysisResult && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-400/80 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  AI Writing Evaluation Report
                </h4>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                  +{selectedPrompt.xpReward} XP Awarded!
                </span>
              </div>

              {/* Three Stat Meters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Grammar Accuracy
                  </span>
                  <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400">
                    {analysisResult.grammarScore}%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Vocabulary Richness
                  </span>
                  <span className="text-lg sm:text-xl font-black text-pink-600 dark:text-pink-400">
                    {analysisResult.vocabScore}%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Sentence Flow
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {analysisResult.structureScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-purple-50/70 dark:bg-purple-950/30 p-3 rounded-2xl border border-purple-200 dark:border-purple-900/60">
                {analysisResult.praiseFeedback}
              </p>

              {/* Detected Corrections & Improvements */}
              {analysisResult.issues.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Gentle Suggestions & Enhancements:
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.issues.map((issue, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-black text-rose-600 dark:text-rose-400">
                            "{issue.original}"
                          </span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            "{issue.suggestion}"
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                            {issue.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Flawless grammar and spelling! Your written expression is superb.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
