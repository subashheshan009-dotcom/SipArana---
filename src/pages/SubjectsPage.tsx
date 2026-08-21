import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  PlayCircle,
  HelpCircle,
  Download,
  Bookmark,
  BookmarkCheck,
  Award,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  BookMarked
} from 'lucide-react';
import { SUBJECTS_DATA, SCHOOL_GRADES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import type { Subject, Unit, Lesson, PastPaper, Stream, SchoolGrade } from '@/types';

export default function SubjectsPage() {
  const { profile, toggleBookmarkPaper, addXP, setGradeAndStream } = useAuth();
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'All'>(profile?.grade || 'All');
  const [selectedStream, setSelectedStream] = useState<Stream | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'papers' | 'quiz'>('syllabus');

  // Quiz interactive state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Filtered list of subjects
  const filteredSubjects = SUBJECTS_DATA.filter((sub) => {
    // Grade matching
    let matchGrade = true;
    if (selectedGradeFilter !== 'All') {
      matchGrade = sub.grades.includes(selectedGradeFilter as SchoolGrade);
    }

    // Stream matching
    let matchStream = true;
    if (selectedStream !== 'All') {
      matchStream = sub.stream === selectedStream;
    }

    // Search matching
    const query = searchQuery.toLowerCase();
    const matchSearch =
      sub.titleSinhala.toLowerCase().includes(query) ||
      sub.titleEnglish.toLowerCase().includes(query) ||
      sub.description.toLowerCase().includes(query) ||
      sub.code.toLowerCase().includes(query) ||
      (sub.guruPothaReference && sub.guruPothaReference.toLowerCase().includes(query));

    return matchGrade && matchStream && matchSearch;
  });

  const handleSelectSubject = (sub: Subject) => {
    setActiveSubject(sub);
    setActiveLesson(sub.units[0]?.lessons[0] || null);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleQuickSwitchMyGrade = () => {
    if (profile?.grade) {
      setSelectedGradeFilter(profile.grade);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      {!activeSubject ? (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  ජාතික විෂය මාලාව • Guru Potha Aligned
                </span>
                {profile?.grade && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                    ඔබේ ශ්‍රේණිය: {profile.grade} වන ශ්‍රේණිය
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                විෂය නිර්දේශය සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                6 ශ්‍රේණියේ සිට 13 ශ්‍රේණිය (O/L & A/L) දක්වා සම්පූර්ණ විෂය මාලාව සහ පාසල් ගුරු පොත් ආශ්‍රිත සටහන්
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="විෂය, මාතෘකාව හෝ ගුරු පොත සොයන්න..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Grade Filtering Tabs */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  ශ්‍රේණිය අනුව පෙරා ගැනීම (Filter by Grade):
                </span>
              </div>
              {profile?.grade && (
                <button
                  onClick={handleQuickSwitchMyGrade}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  මගේ ශ්‍රේණිය ({profile.grade} වසර)
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedGradeFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedGradeFilter === 'All'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                සියලු ශ්‍රේණි (6-13)
              </button>

              {SCHOOL_GRADES.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => setSelectedGradeFilter(g.grade)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedGradeFilter === g.grade
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{g.nameSinhala}</span>
                  <span className="text-[10px] opacity-75 font-normal">({g.stage})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((sub) => {
              const percent = Math.round((sub.completedModules / sub.totalModules) * 100);
              const isMatchMyGrade = profile?.grade ? sub.grades.includes(profile.grade) : false;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub)}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4 ${
                    isMatchMyGrade
                      ? 'border-blue-300 dark:border-blue-800/80 ring-1 ring-blue-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {sub.code}
                        </span>
                        {isMatchMyGrade && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                            ඔබට නියමිතයි
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {sub.units.length} Units
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {sub.titleSinhala}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {sub.titleEnglish} • <span className="text-blue-600 dark:text-blue-400 font-semibold">{sub.stream}</span>
                      </p>
                    </div>

                    {/* Grade badges */}
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">අදාළ ශ්‍රේණි:</span>
                      {sub.grades.map(g => (
                        <span key={g} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {g}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>

                    {sub.guruPothaReference && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
                        <BookMarked className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{sub.guruPothaReference}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>සම්පූර්ණ ප්‍රගතිය</span>
                      <span className="text-blue-600 dark:text-blue-400">{percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-medium">
                      <span>පසුගිය ප්‍රශ්න පත්‍ර: {sub.pastPapers.length} ක්</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        විවෘත කරන්න <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
                තෝරාගත් ශ්‍රේණියට හෝ සෙවුමට අදාළ විෂයයන් හමු නොවීය
              </h3>
              <p className="text-xs text-slate-500">
                කරුණාකර සියලු ශ්‍රේණි (All Grades) තෝරන්න හෝ සෙවුම් පදය වෙනස් කරන්න.
              </p>
              <button
                onClick={() => {
                  setSelectedGradeFilter('All');
                  setSelectedStream('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition"
              >
                සියලු විෂයන් පෙන්වන්න
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Detailed Subject View */
        <div className="space-y-6">
          {/* Back button & Subject Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubject(null)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {activeSubject.code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{activeSubject.stream}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {activeSubject.titleSinhala} ({activeSubject.titleEnglish})
                </h2>
              </div>
            </div>

            {/* Navigation Tabs inside Subject */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'syllabus'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                පාඩම් මාලාව (Units)
              </button>
              <button
                onClick={() => setActiveTab('papers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'papers'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                පසුගිය ප්‍රශ්න පත්‍ර ({activeSubject.pastPapers.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Syllabus & Lessons */}
          {activeTab === 'syllabus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Units List (Left Column) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  විෂය ඒකක සහ පාඩම් ({activeSubject.units.length} Units)
                </h3>

                <div className="space-y-3">
                  {activeSubject.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {unit.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {unit.titleSinhala}
                      </h4>

                      {/* Lessons in this unit */}
                      <div className="space-y-1.5 pt-1">
                        {unit.lessons.map((les) => {
                          const isActive = activeLesson?.id === les.id;
                          return (
                            <button
                              key={les.id}
                              onClick={() => handleSelectLesson(les)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition ${
                                isActive
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {les.isCompleted ? (
                                  <CheckCircle2
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      isActive ? 'text-white' : 'text-emerald-500'
                                    }`}
                                  />
                                ) : (
                                  <PlayCircle
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      isActive ? 'text-white' : 'text-slate-400'
                                    }`}
                                  />
                                )}
                                <span className="truncate">{les.titleSinhala || les.title}</span>
                              </div>
                              <span className="text-[10px] opacity-80 flex-shrink-0">{les.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Lesson Detail Pane (Right Column) */}
              <div className="lg:col-span-7">
                {activeLesson ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          ක්‍රියාකාරී පාඩම (Active Lesson)
                        </span>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                          {activeLesson.titleSinhala || activeLesson.title}
                        </h3>
                        <p className="text-xs text-slate-400">{activeLesson.title}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        ⏱️ {activeLesson.duration}
                      </span>
                    </div>

                    {/* Lesson Summary */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        පාඩමේ සාරාංශය (Summary)
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {activeLesson.summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                          ප්‍රධාන කරුණු (Key Principles & Rules)
                        </h4>
                        <div className="space-y-2">
                          {activeLesson.keyPoints.map((pt, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30"
                            >
                              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formula Box */}
                    {activeLesson.formulaList && activeLesson.formulaList.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                          සූත්‍ර සහ ප්‍රමේය (Formulas)
                        </h4>
                        <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs space-y-2 border border-slate-800">
                          {activeLesson.formulaList.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-slate-500">▶</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Interactive Quiz */}
                    {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-amber-500" />
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                            ස්වයං ඇගයීම් ප්‍රශ්නය (Instant Concept Check)
                          </h4>
                        </div>

                        {activeLesson.quiz.map((q) => (
                          <div
                            key={q.id}
                            className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 p-5 rounded-2xl space-y-3"
                          >
                            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                              {q.questionSinhala || q.question}
                            </p>

                            <div className="space-y-2">
                              {q.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === q.correctIndex;
                                return (
                                  <button
                                    key={idx}
                                    disabled={quizSubmitted}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition ${
                                      quizSubmitted
                                        ? isCorrect
                                          ? 'bg-emerald-600 text-white border-emerald-500'
                                          : isSelected
                                          ? 'bg-rose-600 text-white border-rose-500'
                                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                        : isSelected
                                        ? 'bg-blue-600 text-white border-blue-500'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {!quizSubmitted ? (
                              <button
                                disabled={selectedOption === null}
                                onClick={() => {
                                  setQuizSubmitted(true);
                                  if (selectedOption === q.correctIndex) {
                                    addXP(30);
                                  }
                                }}
                                className="w-full py-2.5 bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition"
                              >
                                පිළිතුර තහවුරු කරන්න (Submit Answer)
                              </button>
                            ) : (
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  විවරණය (Explanation):
                                </span>
                                <p className="text-slate-600 dark:text-slate-400">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-xs text-slate-500">කරුණාකර වම් පසින් පාඩමක් තෝරන්න.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Past Papers */}
          {activeTab === 'papers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි (Marking Schemes)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department of Examinations Official Past Paper Archives
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSubject.pastPapers.map((paper) => {
                  const isBookmarked = profile?.bookmarkedPaperIds.includes(paper.id);
                  return (
                    <div
                      key={paper.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                              {paper.year} G.C.E. {activeSubject.stream === 'General O/L' ? 'O/L' : 'A/L'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {paper.medium}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {paper.part} • Marking Scheme Included
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleBookmarkPaper(paper.id)}
                          className={`p-2.5 rounded-xl border transition ${
                            isBookmarked
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={paper.pdfUrl}
                          download
                          onClick={(e) => {
                            e.preventDefault();
                            addXP(20);
                            alert(`${paper.year} Past Paper PDF download started! (+20 XP)`);
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
