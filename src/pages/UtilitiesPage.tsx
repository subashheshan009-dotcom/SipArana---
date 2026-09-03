import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Calculator,
  RefreshCw,
  Eye,
  BookOpen
} from 'lucide-react';
import { FLASHCARDS_DATA, INITIAL_STUDY_TASKS } from '@/data/mockData';
import type { Flashcard, StudyTask } from '@/types';
import StudyStopwatch from '@/components/StudyStopwatch';

export default function UtilitiesPage() {
  const [activeTool, setActiveTool] = useState<'stopwatch' | 'calculator' | 'flashcards' | 'planner' | 'formulas'>('stopwatch');

  // GPA Calculator State
  const [sub1, setSub1] = useState('A');
  const [sub2, setSub2] = useState('B');
  const [sub3, setSub3] = useState('A');
  const [rawMark1, setRawMark1] = useState(78);
  const [rawMark2, setRawMark2] = useState(65);
  const [rawMark3, setRawMark3] = useState(82);

  // Flashcards State
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DATA);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(2);

  // Planner State
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSub, setNewTaskSub] = useState('Combined Maths');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask: StudyTask = {
      id: `t_${Date.now()}`,
      title: newTaskTitle,
      subject: newTaskSub,
      durationMinutes: 30,
      isCompleted: false,
      priority: 'High',
      date: 'Today'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Z-Score approximation formula
  const calculatedZScore = Number(
    (
      (rawMark1 - 50) / 15 * 0.35 +
      (rawMark2 - 50) / 15 * 0.35 +
      (rawMark3 - 50) / 15 * 0.3
    ).toFixed(4)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          පාඩම් මෙවලම් කට්ටලය (Study Utilities)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Supercharge your study efficiency with an unbounded Study Stopwatch & interactive time analytics Bar Chart, Z-Score estimator, and revision flashcards.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'stopwatch', label: '⏱️ Study Stopwatch & Bar Chart' },
          { id: 'calculator', label: '📊 Z-Score & GPA Estimator' },
          { id: 'flashcards', label: '🗂️ Spaced Flashcards' },
          { id: 'planner', label: '📝 Daily Study Planner' },
          { id: 'formulas', label: '🧪 High-Yield Formula Sheet' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTool === t.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Unbounded Study Stopwatch & Analytics Bar Chart Tool */}
      {activeTool === 'stopwatch' && (
        <StudyStopwatch />
      )}

      {/* 2. Z-Score & GPA Estimator */}
      {activeTool === 'calculator' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              G.C.E. A/L Z-Score & Grade Estimator
            </h3>
            <p className="text-xs text-slate-500">
              Simulate raw paper marks and estimate your standardized Z-Score value.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject 1 (Maths/Bio)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rawMark1}
                  onChange={(e) => setRawMark1(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border text-center font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 block text-center">Marks / 100</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject 2 (Physics/Econ)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rawMark2}
                  onChange={(e) => setRawMark2(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border text-center font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 block text-center">Marks / 100</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject 3 (Chem/Acc)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rawMark3}
                  onChange={(e) => setRawMark3(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border text-center font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 block text-center">Marks / 100</span>
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Estimated Standardized Z-Score:
              </span>
              <p className="text-4xl font-black font-mono text-blue-900 dark:text-blue-200">
                {calculatedZScore.toFixed(4)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Targeting Top 5% State University Placements (Moratuwa Eng / Colombo Medicine / J'pura Mgt)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Spaced Repetition Flashcards */}
      {activeTool === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Card {cardIndex + 1} of {cards.length}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Mastered: {masteredCount}/{cards.length}
            </span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] bg-white dark:bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-8 shadow-xl flex flex-col justify-between items-center text-center cursor-pointer hover:border-blue-500 transition group"
          >
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {cards[cardIndex].subject} • {cards[cardIndex].topic}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" /> Click to Flip
              </span>
            </div>

            <div className="my-auto px-4">
              <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                {isFlipped ? cards[cardIndex].back : cards[cardIndex].front}
              </p>
              <span className="text-xs text-slate-400 block mt-2">
                {isFlipped ? '✅ Answer & Formula Guide' : '❓ Recall the answer'}
              </span>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
              Difficulty: {cards[cardIndex].difficulty}
            </span>
          </div>

          {/* Flashcard Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200"
            >
              Previous Card
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setMasteredCount((prev) => Math.min(cards.length, prev + 1));
                setCardIndex((prev) => (prev + 1) % cards.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25"
            >
              Mastered
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev + 1) % cards.length);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* 4. Daily Study Planner */}
      {activeTool === 'planner' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              දිනපතා පාඩම් සැලසුම්කරු (Daily Study Checklist)
            </h3>
            <p className="text-xs text-slate-500">
              Organize your daily study goals and earn XP for each completed task.
            </p>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add task e.g. Solve 2023 Physics MCQ 1-25..."
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTaskSub}
              onChange={(e) => setNewTaskSub(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
            >
              <option value="Combined Maths">Maths</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Accounting">Accounting</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border flex items-center justify-between gap-3 text-xs"
              >
                <div
                  onClick={() => toggleTaskStatus(t.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => {}}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={`font-semibold ${
                      t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold">
                    {t.subject}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Formula Sheets Reference */}
      {activeTool === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-3">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">
              📐 Combined Maths Core Formulas
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                d/dx [sin(ax)] = a cos(ax)
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                ∫ sec^2(x) dx = tan(x) + C
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Range R = (u^2 sin 2α) / g
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Center of Mass (Solid Hemisphere) = 3r / 8
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-3">
            <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">
              ⚡ Physics Fundamental Laws
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Doppler: f' = f * [(v ± v_o) / (v ∓ v_s)]
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Capacitance Energy: E = 1/2 C V^2
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Photoelectric: hf = Φ + 1/2 m v_max^2
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                Bernoulli: P + 1/2 ρ v^2 + ρ g h = Constant
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
