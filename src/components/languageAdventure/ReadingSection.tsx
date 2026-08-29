import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Zap,
  Flame,
  ChevronRight,
  Sliders,
  Info
} from 'lucide-react';
import { ADVENTURE_STORIES, IllustratedStory, StoryVocabulary } from '@/data/languageAdventureData';
import { soundFX } from '@/utils/audioUtils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import readerAvatar from '@/assets/images/siparana_mascot_1787392758475.jpg';

interface ReadingSectionProps {
  onEarnXP: (amount: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export default function ReadingSection({ onEarnXP, onUnlockBadge }: ReadingSectionProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [selectedStory, setSelectedStory] = useState<IllustratedStory>(ADVENTURE_STORIES[0]);
  const [activeVocabModal, setActiveVocabModal] = useState<StoryVocabulary | null>(null);

  // Audio narration states
  const [isReadingAudio, setIsReadingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Select Story
  const handleSelectStory = (story: IllustratedStory) => {
    soundFX.playClick();
    if (isReadingAudio && typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      setIsReadingAudio(false);
    }
    setSelectedStory(story);
    setActiveVocabModal(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCurrentParagraphIndex(0);
  };

  // Play Speech Narration
  const handleToggleNarration = () => {
    soundFX.playPop();

    if (isReadingAudio) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsReadingAudio(false);
    } else {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const fullText = selectedStory.paragraphs.map(p => p.en).join(' ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = audioSpeed;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsReadingAudio(true);
      utterance.onend = () => setIsReadingAudio(false);
      utterance.onerror = () => setIsReadingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Word Pronunciation
  const handlePronounceWord = (word: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  // Select Quiz Option
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    soundFX.playClick();
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < selectedStory.quiz.length) {
      soundFX.playWrong();
      return;
    }

    soundFX.playPop();
    let correctCount = 0;

    selectedStory.quiz.forEach(q => {
      const chosenIdx = selectedAnswers[q.id];
      if (chosenIdx !== undefined && q.options[chosenIdx]?.isCorrect) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / selectedStory.quiz.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore === 100) {
      soundFX.playCorrect();
      onEarnXP(selectedStory.xpReward);
      if (onUnlockBadge) onUnlockBadge('badge_story_explorer');

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      soundFX.playPop();
      onEarnXP(Math.round(selectedStory.xpReward * 0.6));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header Card with Reader Character */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl bg-white/10 ring-4 ring-emerald-300/30">
                <img
                  src={readerAvatar}
                  alt="Student Reading Book with Shimmering Text"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                📖
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-emerald-200">
                <BookOpen className="w-3 h-3" />
                SECTION 3: READING (කියවන)
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Illustrated Stories & Shimmering Tales 📚
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                {language === 'si'
                  ? 'සුන්දර චිත්‍රකතා කියවන්න, අලුත් වචනවල තේරුම් සොයන්න සහ අවබෝධාත්මක ප්‍රශ්නාවලියට පිළිතුරු සපයන්න!'
                  : 'Read illustrated stories, tap vocabulary words for instant definitions, and take comprehension quizzes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black text-amber-200">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>+{selectedStory.xpReward} XP for 100% Quiz</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Story Carousel & Selector */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Illustrated Story Library
          </span>

          <div className="space-y-3">
            {ADVENTURE_STORIES.map(story => {
              const isSelected = selectedStory.id === story.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => handleSelectStory(story)}
                  className={`w-full text-left rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="h-28 w-full overflow-hidden relative">
                    <img
                      src={story.coverImage}
                      alt={story.titleEn}
                      className="w-full h-full object-cover transition transform hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                        {story.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.readingTimeMinutes} min read
                      </span>
                      <span className="text-amber-300">+{story.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                      {story.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-sinhala">
                      {story.titleSi}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Character Dialogue Quote Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedStory.characterDialogue.avatar}</span>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {selectedStory.characterDialogue.character}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Reading Companion
                </span>
              </div>
            </div>
            <p className="text-xs italic text-slate-700 dark:text-slate-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              "{selectedStory.characterDialogue.quoteEn}"
            </p>
          </div>
        </div>

        {/* Right Column: Active Story Reader & Quizzes */}
        <div className="lg:col-span-8 space-y-5">
          {/* Reader Header & Audio Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {selectedStory.titleEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sinhala">
                {selectedStory.titleSi}
              </p>
            </div>

            {/* Audio narration button & speed selector */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={handleToggleNarration}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-md cursor-pointer ${
                  isReadingAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isReadingAudio ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Narration</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen (TTS) 🔊</span>
                  </>
                )}
              </button>

              <select
                value={audioSpeed}
                onChange={e => setAudioSpeed(parseFloat(e.target.value))}
                className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                title="Audio narration speed"
              >
                <option value="0.75">0.75x</option>
                <option value="1.0">1.0x (Normal)</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>
          </div>

          {/* Story Paragraphs with Interactive Vocabulary Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-4 font-serif text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed">
              {selectedStory.paragraphs.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  {/* English Paragraph */}
                  <p className="text-slate-900 dark:text-white">
                    {p.en}
                  </p>

                  {/* Sinhala Translation */}
                  <p className="text-xs font-sans text-slate-500 dark:text-slate-400 font-sinhala leading-normal pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    {p.si}
                  </p>
                </div>
              ))}
            </div>

            {/* Tap-to-Reveal Vocabulary Word Pills */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tap-to-Learn Key Vocabulary Words:
              </span>

              <div className="flex flex-wrap gap-2">
                {selectedStory.vocabulary.map(v => (
                  <button
                    key={v.word}
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setActiveVocabModal(v);
                      handlePronounceWord(v.word);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>📖 {v.word}</span>
                    <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Vocabulary Popover Modal */}
            {activeVocabModal && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/60 dark:via-teal-950/60 dark:to-cyan-950/60 border-2 border-emerald-400 shadow-md space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                      {activeVocabModal.word}
                    </h4>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {activeVocabModal.phonetic}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.2 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold">
                      {activeVocabModal.partOfSpeech}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePronounceWord(activeVocabModal.word)}
                    className="p-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>

                <div className="text-xs space-y-1 text-slate-800 dark:text-slate-200">
                  <p><strong className="text-emerald-800 dark:text-emerald-300">Meaning (English):</strong> {activeVocabModal.meaningEn}</p>
                  <p><strong className="text-emerald-800 dark:text-emerald-300">Meaning (Sinhala):</strong> {activeVocabModal.meaningSi}</p>
                  <p><strong className="text-emerald-800 dark:text-emerald-300">Meaning (Tamil):</strong> {activeVocabModal.meaningTa}</p>
                  <p className="italic text-slate-600 dark:text-slate-300 pt-1 font-serif">
                    Example: "{activeVocabModal.example}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reading Comprehension Quiz Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Reading Comprehension Quiz
              </h4>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                {selectedStory.quiz.length} Questions
              </span>
            </div>

            <div className="space-y-4">
              {selectedStory.quiz.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                      Question {qIdx + 1}:
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {q.questionEn}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sinhala">
                      {q.questionSi}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedAnswers[q.id] === optIdx;
                      const showFeedback = quizSubmitted;
                      const isCorrect = opt.isCorrect;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                            showFeedback && isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-black'
                              : showFeedback && isChosen && !isCorrect
                              ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200'
                              : isChosen
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/40 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                          }`}
                        >
                          <div>
                            <p>{opt.textEn}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sinhala">
                              {opt.textSi}
                            </p>
                          </div>

                          {showFeedback && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {showFeedback && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2 animate-in fade-in">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-600" />
                      <span>{q.explanationEn} ({q.explanationSi})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Submit Button & Scorecard */}
            {!quizSubmitted ? (
              <button
                type="button"
                id="submit-story-quiz-btn"
                onClick={handleSubmitQuiz}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Quiz & Check Understanding ✨</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg">
                    {quizScore === 100 ? '🏆' : '⭐'}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                      Score: {quizScore}% ({quizScore === 100 ? 'Perfect Mastery!' : 'Well Read!'})
                    </h5>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      +{selectedStory.xpReward} XP added to your scholar profile.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
