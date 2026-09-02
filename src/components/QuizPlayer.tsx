import React, { useState, useEffect } from 'react';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Flag,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Eye,
  Zap,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UnitQuiz, MCQQuestion } from '@/data/quizData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import type { TestAttemptRecord } from '@/data/analyticsData';

interface QuizPlayerProps {
  quiz: UnitQuiz;
  onExit: () => void;
  onViewAnalytics?: () => void;
}

export default function QuizPlayer({ quiz, onExit, onViewAnalytics }: QuizPlayerProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, string[]>>({}); // questionId -> array of optionIds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'flagged'>('all');
  const [startTime] = useState(Date.now());

  const currentQ = quiz.questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleToggleEliminate = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitted) return;
    setEliminatedOptions((prev) => {
      const list = prev[currentQ.id] || [];
      if (list.includes(optionId)) {
        return { ...prev, [currentQ.id]: list.filter((id) => id !== optionId) };
      } else {
        return { ...prev, [currentQ.id]: [...list, optionId] };
      }
    });
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    // Calculate score
    let correctCount = 0;
    const weakTopics: string[] = [];

    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount += 1;
      } else {
        if (q.topic && !weakTopics.includes(q.topic)) {
          weakTopics.push(q.topic);
        }
      }
    });

    const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    if (scorePct >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#f59e0b', '#10b981', '#ffffff']
        });
      } catch {
        // ignore
      }
    }

    // Save to localStorage test attempts
    const newAttempt: TestAttemptRecord = {
      id: `att_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      quizTitleSinhala: quiz.titleSinhala,
      subjectName: quiz.subjectName,
      subjectSinhala: quiz.subjectSinhala,
      score: scorePct,
      correctCount,
      totalQuestions: quiz.questions.length,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      xpEarned: earnedXP,
      grade: quiz.grade,
      weakTopicsDetected: weakTopics,
    };

    try {
      const stored = localStorage.getItem('siparana_test_attempts');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newAttempt);
      localStorage.setItem('siparana_test_attempts', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Result metrics
  let correctTotal = 0;
  quiz.questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctOptionId) {
      correctTotal += 1;
    }
  });
  const scorePercent = Math.round((correctTotal / quiz.questions.length) * 100);

  // Review questions list
  const filteredQuestions = quiz.questions.filter((q) => {
    if (reviewFilter === 'wrong') {
      return selectedAnswers[q.id] !== q.correctOptionId;
    }
    if (reviewFilter === 'flagged') {
      return flaggedQuestions[q.id];
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Quiz Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
              {quiz.subjectSinhala} • {quiz.subjectName}
            </span>
            <span>Grade {quiz.grade}</span>
            <span>• Unit {quiz.unitNumber}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {language === 'si' ? quiz.titleSinhala : quiz.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted && (
            <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-black text-sm sm:text-base border ${
              secondsRemaining < 120
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            {isSubmitted ? 'Close Test (නික්මෙන්න)' : 'Exit (පිටවෙන්න)'}
          </button>
        </div>
      </div>

      {!isSubmitted ? (
        /* ACTIVE TEST VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    of {quiz.questions.length} Questions
                  </span>
                </div>

                <button
                  onClick={handleToggleFlag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    flaggedQuestions[currentQ.id]
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQ.id] ? 'Flagged (සලකුණු කළා)' : 'Flag for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.questionTextSinhala}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {currentQ.questionText}
                </p>
                {currentQ.codeSnippet && (
                  <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                    {currentQ.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  const isEliminated = (eliminatedOptions[currentQ.id] || []).includes(opt.id);
                  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-md shadow-blue-500/10'
                          : isEliminated
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-40 line-through'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xs transition ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {optionLetters[oIdx]}
                        </div>
                        <div className="space-y-0.5 pt-0.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {opt.textSinhala}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {opt.text}
                          </p>
                        </div>
                      </div>

                      {/* Strikethrough Elimination Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleEliminate(opt.id, e)}
                        title={isEliminated ? 'Restore option' : 'Eliminate option'}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition font-bold"
                      >
                        {isEliminated ? 'Restore' : 'Eliminate'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Get Marks (අවසන් කරන්න)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Navigation Matrix */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Question Matrix (ප්‍රශ්න පුවරුව)
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = Boolean(selectedAnswers[q.id]);
                  const isFlagged = Boolean(flaggedQuestions[q.id]);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-black transition relative flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 bg-blue-600 text-white'
                          : isFlagged
                          ? 'bg-amber-500 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && !isCurrent && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Answered ({Object.keys(selectedAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span>Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <span>Unanswered ({quiz.questions.length - Object.keys(selectedAnswers).length})</span>
                </div>
              </div>

              <button
                onClick={handleSubmitQuiz}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Test Now</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS & AUTO-MARKING EXPLANATION VIEW */
        <div className="space-y-8">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
                  <Award className="w-4 h-4" />
                  <span>Test Auto-Marking Complete</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {scorePercent >= 75
                    ? '🎉 විශිෂ්ට ජයග්‍රහණයක්! Excellent Performance'
                    : scorePercent >= 50
                    ? '👍 සාර්ථක උත්සාහයක්! Good Effort'
                    : '💡 තව ටිකක් පුහුණු වන්න! Needs Practice'}
                </h2>
                <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
                  {quiz.titleSinhala} පරීක්ෂණයේ සියලු පිළිතුරු සහ ගුරු පොතට අනුකූල පියවරෙන් පියවර විවරණය පහතින් අධ්‍යයනය කරන්න.
                </p>
              </div>

              {/* Big Score Dial Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400">
                    {scorePercent}%
                  </div>
                  <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mt-1">
                    Final Mark
                  </div>
                </div>

                <div className="h-12 w-px bg-white/20" />

                <div className="text-left space-y-1 text-xs">
                  <div className="text-emerald-300 font-bold">
                    ✓ {correctTotal} of {quiz.questions.length} Correct
                  </div>
                  <div className="text-blue-200 font-medium">
                    ⏱️ Time: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setEliminatedOptions({});
                    setFlaggedQuestions({});
                    setSecondsRemaining(quiz.timeLimitMinutes * 60);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test (නැවත කරන්න)</span>
                </button>

                {onViewAnalytics && (
                  <button
                    onClick={onViewAnalytics}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-900 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>View Performance Analytics</span>
                  </button>
                )}
              </div>

              {/* Filter Review Questions */}
              <div className="inline-flex p-1 rounded-xl bg-white/10 text-xs font-bold">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    reviewFilter === 'all' ? 'bg-white text-slate-900' : 'text-white'
                  }`}
                >
                  All ({quiz.questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    reviewFilter === 'wrong' ? 'bg-white text-slate-900' : 'text-white'
                  }`}
                >
                  Wrong ({quiz.questions.length - correctTotal})
                </button>
                <button
                  onClick={() => setReviewFilter('flagged')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    reviewFilter === 'flagged' ? 'bg-white text-slate-900' : 'text-white'
                  }`}
                >
                  Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Question Explanations List */}
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Step-by-Step Question Review & Guru Potha Explanations</span>
            </h3>

            {filteredQuestions.map((q) => {
              const studentChoice = selectedAnswers[q.id];
              const isCorrect = studentChoice === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-slate-900 border-2 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-black text-xs flex items-center justify-center text-slate-700 dark:text-slate-300">
                        {q.questionNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Topic: {q.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+20 Marks)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {q.questionTextSinhala}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Options with correctness marking */}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isStudentPick = studentChoice === opt.id;
                      const isRightAnswer = opt.id === q.correctOptionId;

                      let rowStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30';
                      if (isRightAnswer) {
                        rowStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold';
                      } else if (isStudentPick && !isRightAnswer) {
                        rowStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${rowStyle}`}
                        >
                          <div className="space-y-0.5">
                            <div>{opt.textSinhala}</div>
                            <div className="text-[11px] opacity-75">{opt.text}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isRightAnswer && (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                                CORRECT ANSWER
                              </span>
                            )}
                            {isStudentPick && !isRightAnswer && (
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">
                                YOUR ANSWER
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-blue-700 dark:text-blue-300">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>විභාග විවරණය & ගුරු පොත (Explanation & Guru Potha):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {q.explanationSinhala}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.explanation}
                    </p>
                    <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 pt-1">
                      📚 {q.guruPothaRef}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
