import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  Sliders,
  Flame,
  Brain,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveSync, SyncedStudySlot } from '@/context/LiveSyncContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function StudyPlannerPage() {
  const { profile, addXP } = useAuth();
  const { language, tText } = useLanguage();
  const { studySlots, updateStudySlots, toggleStudySlot, isSyncing, syncStatus, triggerManualSync } = useLiveSync();

  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Mon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [examTargetDate, setExamTargetDate] = useState('2026-11-15');
  const [dailyStudyHours, setDailyStudyHours] = useState(5);
  const [preferredPace, setPreferredPace] = useState<'balanced' | 'intensive' | 'relaxed'>('balanced');
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>(['Combined Mathematics', 'Physics', 'Chemistry']);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // Calculate stats
  const daySlots = studySlots.filter(s => s.day === selectedDay);
  const completedSlotsCount = studySlots.filter(s => s.isDone).length;
  const totalSlotsCount = studySlots.length;
  const progressPercent = totalSlotsCount > 0 ? Math.round((completedSlotsCount / totalSlotsCount) * 100) : 0;

  const handleGenerateAiTimetable = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generatedSlots: SyncedStudySlot[] = [];
      const daysList: (typeof DAYS[number])[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      const subjects = prioritySubjects.length > 0
        ? prioritySubjects
        : ['Combined Maths', 'Physics', 'Chemistry', 'Biology'];

      daysList.forEach((d, dIdx) => {
        const morningSubj = subjects[dIdx % subjects.length];
        const eveningSubj = subjects[(dIdx + 1) % subjects.length];
        const nightSubj = subjects[(dIdx + 2) % subjects.length];

        generatedSlots.push({
          id: `gen-${d}-1`,
          day: d,
          time: '06:00 - 07:30 AM',
          subject: morningSubj,
          topic: d === 'Sat' || d === 'Sun' ? 'Past Paper Timed Simulation' : 'Core Theory & Difficult Derivations',
          type: 'theory',
          durationMinutes: 90,
          isDone: false
        });

        generatedSlots.push({
          id: `gen-${d}-2`,
          day: d,
          time: '04:30 - 06:00 PM',
          subject: eveningSubj,
          topic: 'Structured Essay & Model Questions Drill',
          type: 'past_paper',
          durationMinutes: 90,
          isDone: false
        });

        if (dailyStudyHours >= 4) {
          generatedSlots.push({
            id: `gen-${d}-3`,
            day: d,
            time: '07:30 - 08:30 PM',
            subject: nightSubj,
            topic: 'Smart Flashcard Drill & Formula Memorization',
            type: 'revision',
            durationMinutes: 60,
            isDone: false
          });
        }
      });

      updateStudySlots(generatedSlots);
      setIsGenerating(false);
      addXP(50);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // safe fallback
      }
    }, 1200);
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubjectInput.trim() && !prioritySubjects.includes(customSubjectInput.trim())) {
      setPrioritySubjects([...prioritySubjects, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  const handleRemoveSubject = (subj: string) => {
    setPrioritySubjects(prioritySubjects.filter(s => s !== subj));
  };

  const handleSlotToggle = (slotId: string, currentDone: boolean) => {
    toggleStudySlot(slotId);
    if (!currentDone) {
      addXP(20);
    }
  };

  return (
    <div id="ai-study-planner-page" className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>AI Study Planner</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{isSyncing ? 'Auto-Syncing...' : 'Real-time Synced'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'AI අධ්‍යයන සැලසුම්කරු සහ කාලසටහන'
              : language === 'ta'
              ? 'AI படிப்புத் திட்டமிடுபவர் & கால அட்டவணை'
              : 'AI Study Planner & Timetable Generator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'ඔබේ විභාග ඉලක්ක සහ ප්‍රමුඛතා විෂයයන් අනුව ස්වයංක්‍රීයව සකස් වන පුද්ගලාරෝපිත දිනචරියාව'
              : language === 'ta'
              ? 'உங்கள் தேர்வு இலக்குகளுக்கு ஏற்ப தானாக உருவாக்கப்படும் தனிப்பயனாக்கப்பட்ட கால அட்டவணை'
              : 'Personalized, neuroscience-backed daily study schedule tailored to your exam date and target score.'}
          </p>
        </div>

        {/* Top Progress Badge */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Weekly Completion</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{progressPercent}% Done</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            {completedSlotsCount}/{totalSlotsCount}
          </div>
        </div>
      </div>

      {/* Mascot Guide Banner */}
      <KaviMascot
        contextPage="planner"
        customMessage={
          language === 'si'
            ? '🦉 කවි ඔයාට මෙහෙම කියනවා: උදෑසන 6:00 - 7:30 මොළයේ මතක ශක්තිය උපරිමයි! එම වේලාව අමාරුම විෂය සිද්ධාන්ත (Theory) සඳහා වෙන් කරන්න. AI Generator එකෙන් අදම අලුත් කාලසටහනක් හදාගන්න!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: காலை 6:00 - 7:30 மணிக்குள் மூளையின் நினைவுத்திறன் அதிகமாக இருக்கும்! கடினமான தியரி பாடங்களை இந்த நேரத்தில் படியுங்கள்.'
            : '🦉 Kavi says: Early morning 6:00 - 7:30 AM has the highest cognitive absorption rate! Reserve this prime block for complex derivations and theory.'
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Generator Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'si' ? 'කාලසටහන් සැකසුම්' : language === 'ta' ? 'அமைப்புகள்' : 'AI Schedule Parameters'}
              </h2>
            </div>

            {/* Target Exam Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Target Exam Date</span>
              </label>
              <input
                type="date"
                value={examTargetDate}
                onChange={(e) => setExamTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Daily Hours Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Daily Study Target</span>
                </span>
                <span className="font-black text-blue-600 dark:text-blue-400">{dailyStudyHours} Hours/Day</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>2 hrs (Light)</span>
                <span>5 hrs (Ideal)</span>
                <span>8 hrs (Intensive)</span>
              </div>
            </div>

            {/* Study Pace */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Pace & Style
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['relaxed', 'balanced', 'intensive'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreferredPace(p)}
                    className={`py-1.5 text-center text-xs font-bold rounded-xl capitalize transition ${
                      preferredPace === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects Tags */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Priority Subjects</span>
                <span className="text-[10px] text-slate-400">{prioritySubjects.length} added</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {prioritySubjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(s)}
                      className="hover:text-red-500 text-slate-400 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddCustomSubject} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Add subject (e.g. ICT)..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Generate Action Button */}
            <button
              id="generate-timetable-btn"
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAiTimetable}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition transform active:scale-98 disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Optimized Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate AI Study Timetable (+50 XP)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Study Rule Card */}
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Spaced Repetition & Feynman Rule</span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-200/70 leading-relaxed">
              Every study slot completed awards <strong>+20 XP</strong>. Mark completed blocks daily to keep your streak hot!
            </p>
          </div>
        </div>

        {/* Right Column: Weekly Day Selector & Interactive Slots */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Tabs */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {DAYS.map((day) => {
              const countForDay = studySlots.filter(s => s.day === day).length;
              const doneForDay = studySlots.filter(s => s.day === day && s.isDone).length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[58px] py-2 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold'
                  }`}
                >
                  <span className="text-xs">{day}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {doneForDay}/{countForDay}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots List for Selected Day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>{selectedDay}'s Scheduled Sessions</span>
                <span className="text-xs font-normal text-slate-400">({daySlots.length} sessions)</span>
              </h3>
              <button
                type="button"
                onClick={triggerManualSync}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Live Sync Now</span>
              </button>
            </div>

            {daySlots.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  No sessions created for {selectedDay} yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click the <strong>"Generate AI Study Timetable"</strong> button on the left to auto-build your full weekly routine!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {daySlots.map((slot) => {
                  const typeColors = {
                    theory: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    past_paper: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    revision: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    quiz: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    break: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  };

                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotToggle(slot.id, slot.isDone)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        slot.isDone
                          ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-300 dark:border-emerald-900/60 opacity-80'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          className={`flex-shrink-0 transition-transform ${slot.isDone ? 'text-emerald-500 scale-110' : 'text-slate-300 dark:text-slate-600 hover:text-blue-500'}`}
                        >
                          {slot.isDone ? (
                            <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {slot.subject}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${typeColors[slot.type]}`}>
                              {slot.type.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {slot.time}
                            </span>
                          </div>
                          <p className={`text-xs ${slot.isDone ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                            {slot.topic}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-amber-500" />
                          <span>+20 XP</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
