import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  BarChart3,
  Clock,
  Flame,
  Sparkles,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Layers,
  BookOpen,
  Plus,
  History,
  Timer,
  ChevronRight,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import type { StudySessionRecord } from '@/types';

// Default initial sessions to make the chart look populated and vibrant immediately
const INITIAL_DEFAULT_SESSIONS: StudySessionRecord[] = [
  {
    id: 'sess_1',
    subject: 'Combined Mathematics',
    topic: 'Calculus & Integration Past Papers',
    totalSeconds: 4520, // 1h 15m 20s
    hours: 1,
    minutes: 15,
    seconds: 20,
    xpEarned: 85,
    timestamp: Date.now() - 86400000 * 2,
    date: '2 Days Ago',
    timeFormatted: '01:15:20'
  },
  {
    id: 'sess_2',
    subject: 'Physics',
    topic: 'Rotational Motion & Waves',
    totalSeconds: 3150, // 0h 52m 30s
    hours: 0,
    minutes: 52,
    seconds: 30,
    xpEarned: 60,
    timestamp: Date.now() - 86400000,
    date: 'Yesterday',
    timeFormatted: '00:52:30'
  },
  {
    id: 'sess_3',
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    totalSeconds: 7415, // 2h 03m 35s
    hours: 2,
    minutes: 3,
    seconds: 35,
    xpEarned: 140,
    timestamp: Date.now() - 3600000 * 4,
    date: 'Today (Morning)',
    timeFormatted: '02:03:35'
  },
  {
    id: 'sess_4',
    subject: 'Biology / IT',
    topic: 'Genetics & Database Design',
    totalSeconds: 2740, // 0h 45m 40s
    hours: 0,
    minutes: 45,
    seconds: 40,
    xpEarned: 50,
    timestamp: Date.now() - 3600000 * 1,
    date: 'Today (Afternoon)',
    timeFormatted: '00:45:40'
  }
];

const AVAILABLE_SUBJECTS = [
  'Combined Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Information Technology (ICT)',
  'Accounting & Business',
  'Economics',
  'Engineering Technology',
  'Medicine (MBBS)',
  'English Language & Literature',
  'General Science'
];

export default function StudyStopwatch() {
  const { addXP, profile } = useAuth();
  const { language } = useLanguage();

  // Stopwatch state (starts from 00:00:00 and counts UP)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('Combined Mathematics');
  const [currentTopic, setCurrentTopic] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Saved study sessions history
  const [sessions, setSessions] = useState<StudySessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_study_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEFAULT_SESSIONS;
  });

  // Latest recorded session banner/modal
  const [lastRecordedSession, setLastRecordedSession] = useState<StudySessionRecord | null>(null);
  const [showSaveCelebration, setShowSaveCelebration] = useState(false);

  // Active Chart View Mode: 'breakdown' (Hours/Mins/Secs comparison) | 'totalUnits' (Aggregate) | 'subject'
  const [chartViewMode, setChartViewMode] = useState<'breakdown' | 'totalUnits' | 'subject'>('breakdown');

  // Ambient sound generator state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'library' | 'whitenoise'>('none');
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('siparana_study_sessions', JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  // Stopwatch Timer Interval Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Ambient Noise Synthesizer (Simulated soothing study atmosphere via Web Audio)
  useEffect(() => {
    if (ambientSound === 'none') {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.disconnect();
        } catch {}
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate brown/pink noise buffer for rain/library/white noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (ambientSound === 'rain' || ambientSound === 'lofi') {
          // Brown noise (softer, deep rain tone)
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // gain compensation
        } else {
          // Pink/White noise
          data[i] = (lastOut + (0.05 * white)) / 1.05;
          lastOut = data[i];
          data[i] *= 2.0;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === 'rain' ? 'lowpass' : ambientSound === 'lofi' ? 'bandpass' : 'lowpass';
      filter.frequency.value = ambientSound === 'rain' ? 600 : ambientSound === 'lofi' ? 450 : 800;

      const gain = ctx.createGain();
      gain.gain.value = 0.04; // Gentle background volume

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseNodeRef.current = gain;
    } catch {
      // Audio fallback
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.disconnect();
        } catch {}
        noiseNodeRef.current = null;
      }
    };
  }, [ambientSound]);

  // Helper formatting: seconds -> HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return {
      hoursStr: hrs.toString().padStart(2, '0'),
      minsStr: mins.toString().padStart(2, '0'),
      secsStr: secs.toString().padStart(2, '0'),
      fullFormatted: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      hours: hrs,
      minutes: mins,
      seconds: secs
    };
  };

  const currentFormatted = formatTime(elapsedSeconds);

  // START / RESUME HANDLER
  const handleStartResume = () => {
    soundFX.playCorrect();
    if (!isRunning && elapsedSeconds === 0) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(true);
  };

  // RECORD & SAVE SESSION FUNCTION
  const recordAndSaveSession = (secondsToRecord: number, wasPaused: boolean) => {
    if (secondsToRecord < 5) {
      // Ignore tiny accidental 1-2 second clicks
      setIsRunning(false);
      return null;
    }

    const { hours, minutes, seconds, fullFormatted } = formatTime(secondsToRecord);

    // Calculate XP: 10 base XP + 1 XP per minute + bonus for hours
    const calculatedXP = Math.max(10, Math.round(secondsToRecord / 60) + (hours * 30));

    const newRecord: StudySessionRecord = {
      id: `session_${Date.now()}`,
      subject: currentSubject,
      topic: currentTopic.trim() || 'General Focus Sprint',
      totalSeconds: secondsToRecord,
      hours,
      minutes,
      seconds,
      xpEarned: calculatedXP,
      timestamp: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      timeFormatted: fullFormatted
    };

    // Add XP to player context
    addXP(calculatedXP);

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#2563eb', '#f59e0b', '#10b981', '#6366f1']
      });
    } catch {}

    soundFX.playCorrect();

    // Update sessions state (prepend latest session)
    setSessions((prev) => [newRecord, ...prev]);
    setLastRecordedSession(newRecord);
    setShowSaveCelebration(true);

    return newRecord;
  };

  // PAUSE HANDLER (Automatically records session as requested)
  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);
    
    // Automatically record current duration
    if (elapsedSeconds >= 5) {
      recordAndSaveSession(elapsedSeconds, true);
    }
  };

  // STOP & RESET HANDLER (Finalizes session and resets stopwatch to 00:00:00)
  const handleStopAndReset = () => {
    if (isRunning) {
      setIsRunning(false);
    }

    if (elapsedSeconds >= 5) {
      recordAndSaveSession(elapsedSeconds, false);
    }

    // Reset Stopwatch to 0
    setElapsedSeconds(0);
    setSessionStartTime(null);
  };

  // COMPLETE RESET
  const handlePureReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setSessionStartTime(null);
  };

  // Delete a recorded session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Calculate Aggregates for Metric Cards
  const totalSecondsAll = sessions.reduce((acc, curr) => acc + curr.totalSeconds, 0);
  const totalHoursAll = (totalSecondsAll / 3600).toFixed(1);
  const totalMinutesAll = Math.round(totalSecondsAll / 60);
  const totalXpAll = sessions.reduce((acc, curr) => acc + curr.xpEarned, 0);

  // Prepare Data for Recharts Bar Charts:

  // 1. Session Breakdown Data (Hours, Minutes, Seconds for recent sessions)
  const recentSessionsData = sessions.slice(0, 7).map((s, index) => {
    const shortTitle = s.subject.length > 12 ? s.subject.substring(0, 10) + '..' : s.subject;
    return {
      name: `#${sessions.length - index} ${shortTitle}`,
      fullName: s.subject,
      topic: s.topic || 'General Practice',
      date: s.date,
      Hours: s.hours,
      Minutes: s.minutes,
      Seconds: s.seconds,
      totalSeconds: s.totalSeconds,
      formatted: s.timeFormatted,
      xp: s.xpEarned
    };
  }).reverse();

  // 2. Aggregate Time Units Breakdown (Overall seconds, minutes, hours total comparison)
  const totalUnitsData = [
    {
      unit: language === 'si' ? 'පැය (Hours)' : 'Hours',
      value: Number((totalSecondsAll / 3600).toFixed(2)),
      display: `${totalHoursAll} hrs`,
      fill: '#2563eb', // Royal Blue
      colorName: 'Royal Blue'
    },
    {
      unit: language === 'si' ? 'මිනිත්තු (Minutes)' : 'Minutes',
      value: totalMinutesAll,
      display: `${totalMinutesAll} mins`,
      fill: '#f59e0b', // Radiant Gold
      colorName: 'Radiant Gold'
    },
    {
      unit: language === 'si' ? 'තත්පර (Seconds)' : 'Seconds',
      value: totalSecondsAll,
      display: `${totalSecondsAll.toLocaleString()} secs`,
      fill: '#06b6d4', // Vibrant Cyan
      colorName: 'Cyan Ocean'
    }
  ];

  // 3. Subject-wise aggregation
  const subjectAggregates: { [key: string]: { subject: string; minutes: number; hours: number; sessionsCount: number } } = {};
  sessions.forEach((s) => {
    if (!subjectAggregates[s.subject]) {
      subjectAggregates[s.subject] = { subject: s.subject, minutes: 0, hours: 0, sessionsCount: 0 };
    }
    subjectAggregates[s.subject].minutes += Math.round(s.totalSeconds / 60);
    subjectAggregates[s.subject].hours = Number((subjectAggregates[s.subject].minutes / 60).toFixed(1));
    subjectAggregates[s.subject].sessionsCount += 1;
  });

  const subjectChartData = Object.values(subjectAggregates).map((item) => ({
    subject: item.subject.length > 14 ? item.subject.substring(0, 12) + '...' : item.subject,
    fullSubject: item.subject,
    Minutes: item.minutes,
    Hours: item.hours,
    count: item.sessionsCount
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP STOPWATCH FOCUS ENGINE CARD */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background aura */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row: Subject selection & Active Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Timer className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-lg sm:text-xl text-slate-800 dark:text-slate-100">
                  {language === 'si' ? 'අසීමිත පාඩම් නැවතුම් ඔරලෝසුව (Study Stopwatch)' : 'Unbounded Study Stopwatch'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'si'
                  ? '00:00:00 සිට ආරම්භ කර ඔබ කැමති ඕනෑම කාලයක් පාඩම් කරන්න. Pause කළ විට ස්වයංක්‍රීයව සටහන් වේ.'
                  : 'Counts upwards from 00:00:00 freely. Automatically records duration and XP on Pause/Stop.'}
              </p>
            </div>

            {/* Subject Selector Pill */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                {AVAILABLE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    📚 {sub}
                  </option>
                ))}
              </select>

              {/* Status Badge */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-2xs ${
                isRunning
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 animate-pulse'
                  : elapsedSeconds > 0
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-emerald-500 animate-ping' : elapsedSeconds > 0 ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span>{isRunning ? 'RECORDING STUDY TIME' : elapsedSeconds > 0 ? 'PAUSED (SAVED)' : 'READY TO START'}</span>
              </div>
            </div>
          </div>

          {/* Optional Topic Tag Input */}
          <div className="flex items-center gap-2 max-w-md">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Focus Topic:</span>
            <input
              type="text"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              placeholder="e.g. Past Paper 2023 / Trigonometry Proofs..."
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Centered Digital Stopwatch Counter Display */}
          <div className="relative py-4 flex flex-col items-center justify-center w-full">
            {/* Glowing Ring Frame */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-900 border-2 border-blue-200/80 dark:border-blue-900/50 shadow-inner flex flex-col items-center justify-center w-full max-w-sm">
              
              {/* Active Stopwatch Ticker */}
              <div className="space-y-1 text-center w-full">
                <div className="flex items-baseline justify-center gap-1.5 sm:gap-2 font-mono text-4xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
                  <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-blue-700 to-indigo-900 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                      {currentFormatted.hoursStr}
                    </span>
                    <span className="text-[10px] font-sans uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <span className="text-amber-500 font-sans animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
                      {currentFormatted.minsStr}
                    </span>
                    <span className="text-[10px] font-sans uppercase font-bold text-slate-400">Minutes</span>
                  </div>
                  <span className="text-amber-500 font-sans animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-800 dark:text-slate-100">
                      {currentFormatted.secsStr}
                    </span>
                    <span className="text-[10px] font-sans uppercase font-bold text-slate-400">Seconds</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span>
                    Studying: <strong className="text-blue-700 dark:text-blue-300">{currentSubject}</strong>
                    {currentTopic ? ` • ${currentTopic}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!isRunning ? (
              <button
                type="button"
                id="btn-start-study-stopwatch"
                onClick={handleStartResume}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{elapsedSeconds > 0 ? 'Resume Study Session' : 'Start Stopwatch'}</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-pause-study-stopwatch"
                onClick={handlePause}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>Pause & Record Duration</span>
              </button>
            )}

            {/* Stop & Save Complete Session Button */}
            {elapsedSeconds > 0 && (
              <button
                type="button"
                id="btn-stop-save-session"
                onClick={handleStopAndReset}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Finish & Save to Chart</span>
              </button>
            )}

            {/* Reset Button */}
            {elapsedSeconds > 0 && (
              <button
                type="button"
                onClick={handlePureReset}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Reset Stopwatch to 00:00:00"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Background Audio Generator & Live Stats Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-semibold">Focus Audio Atmosphere:</span>
              <select
                value={ambientSound}
                onChange={(e) => setAmbientSound(e.target.value as any)}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="none">🔇 Muted / Quiet Focus</option>
                <option value="rain">🌧️ Tropical Sri Lankan Rain</option>
                <option value="lofi">🎧 Deep Lo-Fi Focus Tone</option>
                <option value="library">📚 Quiet Library Ambience</option>
                <option value="whitenoise">⚡ Smooth White Noise</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+1 XP / Minute Studied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INSTANT RECORDING CELEBRATION NOTIFICATION */}
      {showSaveCelebration && lastRecordedSession && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-blue-500/10 to-amber-500/15 border-2 border-emerald-400/80 dark:border-emerald-500/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  🎉 Session Recorded & Saved to Chart!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
                  +{lastRecordedSession.xpEarned} XP
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {lastRecordedSession.subject} • {lastRecordedSession.hours}h {lastRecordedSession.minutes}m {lastRecordedSession.seconds}s
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Duration broken down: {lastRecordedSession.hours} Hours, {lastRecordedSession.minutes} Minutes, {lastRecordedSession.seconds} Seconds ({lastRecordedSession.totalSeconds} total seconds).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSaveCelebration(false)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer self-end sm:self-auto"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. TIME UNITS HIGH-CONTRAST METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Total Hours */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Total Hours</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalHoursAll} <span className="text-xs font-normal text-slate-400">hrs</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Deep focus logged</span>
        </div>

        {/* Card 2: Total Minutes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/60 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Total Minutes</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalMinutesAll} <span className="text-xs font-normal text-slate-400">mins</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">{sessions.length} sessions tracked</span>
        </div>

        {/* Card 3: Total Seconds */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-cyan-200 dark:border-cyan-900/60 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">Total Seconds</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalSecondsAll.toLocaleString()} <span className="text-xs font-normal text-slate-400">sec</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Exact ticking precision</span>
        </div>

        {/* Card 4: Total XP Gained */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Focus XP Earned</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            +{totalXpAll} <span className="text-xs font-normal text-slate-400">XP</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Rank & streak booster</span>
        </div>
      </div>

      {/* 4. SLEEK RECHARTS BAR CHART (STUDY TIME BREAKDOWN) */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                {language === 'si' ? 'පාඩම් කාල විශ්ලේෂණ ප්‍රස්තාරය (Study Time Bar Chart)' : 'Study Time Analytics Bar Chart'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'si'
                ? 'තත්පර (Seconds), මිනිත්තු (Minutes) සහ පැය (Hours) අනුව ඔබේ පාඩම් කාලය විශ්ලේෂණය කරන්න.'
                : 'Interactive breakdown of study duration across Seconds, Minutes, and Hours.'}
            </p>
          </div>

          {/* Chart View Mode Switcher */}
          <div className="flex flex-wrap sm:flex-nowrap items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 gap-1 text-xs font-bold max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setChartViewMode('breakdown')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                chartViewMode === 'breakdown'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Session Breakdown (H / M / S)
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('totalUnits')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                chartViewMode === 'totalUnits'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Time Units Aggregate
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('subject')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                chartViewMode === 'subject'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              By Subject
            </button>
          </div>
        </div>

        {/* Dynamic Recharts Bar Chart Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'breakdown' ? (
              /* VIEW 1: Multi-Bar Breakdown into Hours, Minutes, and Seconds */
              <BarChart data={recentSessionsData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Units (H / M / S)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 backdrop-blur-md">
                          <p className="font-extrabold text-slate-900 dark:text-white">
                            {data.fullName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {data.topic} • {data.date}
                          </p>
                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between gap-4 text-blue-600 font-bold">
                              <span>⏱️ Hours:</span>
                              <span>{data.Hours} hrs</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-amber-600 font-bold">
                              <span>⏳ Minutes:</span>
                              <span>{data.Minutes} mins</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-cyan-600 font-bold">
                              <span>⚡ Seconds:</span>
                              <span>{data.Seconds} secs</span>
                            </div>
                            <div className="pt-1 flex items-center justify-between gap-4 text-emerald-600 font-extrabold">
                              <span>🏆 XP Gained:</span>
                              <span>+{data.xp} XP</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}
                />
                {/* 3 Bars for Hours, Minutes, Seconds */}
                <Bar dataKey="Hours" fill="#2563eb" radius={[6, 6, 0, 0]} name="Hours (h)" />
                <Bar dataKey="Minutes" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Minutes (m)" />
                <Bar dataKey="Seconds" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Seconds (s)" />
              </BarChart>
            ) : chartViewMode === 'totalUnits' ? (
              /* VIEW 2: Aggregate Time Units (Hours, Minutes, Seconds Total) */
              <BarChart data={totalUnitsData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="unit" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white block">
                            {data.unit}
                          </span>
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400 block mt-1">
                            {data.display}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} name="Value">
                  {totalUnitsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              /* VIEW 3: Subject Time Distribution */
              <BarChart data={subjectChartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                          <p className="font-extrabold text-slate-900 dark:text-white">
                            {data.fullSubject}
                          </p>
                          <p className="text-blue-600 font-bold">
                            Total: {data.Minutes} Minutes ({data.Hours} Hours)
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            {data.count} focus sessions logged
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Minutes" fill="#4f46e5" radius={[8, 8, 0, 0]} name="Total Minutes Studied" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend Notes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-600 inline-block" /> Hours (Royal Blue)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500 inline-block" /> Minutes (Gold)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-cyan-500 inline-block" /> Seconds (Cyan)
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            📊 Live Synchronized with Stopwatch
          </span>
        </div>
      </div>

      {/* 5. DETAILED STUDY SESSION HISTORY LOG */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              {language === 'si' ? 'පසුගිය පාඩම් වාර්තා (Recorded Study Sessions)' : 'Recorded Study Session Log'}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {sessions.length} Recorded Sessions
          </span>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-blue-400 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {session.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                      {session.date}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {session.topic || 'General Practice'}
                  </p>
                </div>
              </div>

              {/* Breakdown Pills */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                <div className="flex items-center gap-1 font-mono text-xs font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="text-blue-600">{session.hours}h</span>
                  <span className="text-slate-300">:</span>
                  <span className="text-amber-600">{session.minutes}m</span>
                  <span className="text-slate-300">:</span>
                  <span className="text-cyan-600">{session.seconds}s</span>
                  <span className="text-slate-400 text-[10px] ml-1">({session.totalSeconds}s)</span>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800">
                  +{session.xpEarned} XP
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteSession(session.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
