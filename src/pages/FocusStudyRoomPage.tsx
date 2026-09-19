import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  Maximize2,
  Minimize2,
  BookOpen,
  Coffee,
  Brain,
  History,
  Trash2,
  Flag,
  Share2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { focusSoundEngine, type AmbientSoundType } from '@/utils/focusSoundEngine';
import type { StudySessionRecord } from '@/types';
import { ParentalReportHubModal } from '@/components/parentReport/ParentalReportHubModal';
import { InAppParentChatModal } from '@/components/parentReport/InAppParentChatModal';
import { getLatestWeeklyReport, type WeeklyStudyReport } from '@/services/weeklyReportService';

type TimerMode = 'stopwatch' | 'pomodoro_25' | 'deep_50' | 'break_5' | 'break_15';

interface LapRecord {
  id: string;
  lapNumber: number;
  timeFormatted: string;
  totalSeconds: number;
  xpAtLap: number;
  timestamp: string;
}

const PRESET_DURATIONS: Record<TimerMode, number> = {
  stopwatch: 0,
  pomodoro_25: 25 * 60,
  deep_50: 50 * 60,
  break_5: 5 * 60,
  break_15: 15 * 60
};

const STUDY_SUBJECTS = [
  'Combined Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Information Technology (ICT)',
  'Accounting & Finance',
  'Business Studies',
  'Economics',
  'Engineering Technology',
  'Science for Technology',
  'English Language',
  'General Science (O/L)',
  'Mathematics (O/L)',
  'Scholarship IQ & General (Grade 5)',
  'History & Social Studies'
];

const MOTIVATIONAL_QUOTES = [
  '“Every 5 minutes of focused study moves you closer to Island Rank 1.”',
  '“Deep focus turns difficult concepts into permanent mastery.”',
  '“Consistency is the silent architect of exam triumph.”',
  '“Your future self is thanking you for the minutes you put in right now.”',
  '“Quality of attention matters more than empty hours at the desk.”'
];

export default function FocusStudyRoomPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  // Timer Core State
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0); // For stopwatch: counts up from 0. For pomodoro: counts down from preset
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Subject & Study Details
  const [subject, setSubject] = useState(STUDY_SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [laps, setLaps] = useState<LapRecord[]>([]);

  // Silent XP Engine state
  const [sessionEarnedXP, setSessionEarnedXP] = useState(0);
  const [silentXPToast, setSilentXPToast] = useState<{ id: string; text: string } | null>(null);
  const activeStudySecondsRef = useRef(0); // Cumulative active study seconds in current continuous run

  // Ambient Sound Engine State
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Fullscreen Zen State
  const [isZenMode, setIsZenMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Weekly Parent Report Hub state
  const [showReportHub, setShowReportHub] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [latestReport, setLatestReport] = useState<WeeklyStudyReport | null>(() => getLatestWeeklyReport());

  // Quote Rotator
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Today's Study Goal State
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [todaySeconds, setTodaySeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`siparana_daily_study_seconds_${todayKey}`);
      return saved ? parseInt(saved, 10) : 1800; // 30m default baseline
    } catch {
      return 1800;
    }
  });

  // Saved Past Sessions History
  const [sessions, setSessions] = useState<StudySessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_study_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sess_default_1',
        subject: 'Combined Mathematics',
        topic: 'Calculus Integration Papers',
        totalSeconds: 3600,
        hours: 1,
        minutes: 0,
        seconds: 0,
        xpEarned: 120,
        timestamp: Date.now() - 86400000,
        date: 'Yesterday',
        timeFormatted: '01:00:00'
      }
    ];
  });

  // Rotate motivational quotes every 45 seconds
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 45000);
    return () => clearInterval(qInterval);
  }, []);

  // Sync ambient sound volume changes
  const handleVolumeChange = (newVol: number) => {
    setSoundVolume(newVol);
    focusSoundEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    const muted = focusSoundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleSoundSelect = (type: AmbientSoundType) => {
    if (activeSound === type) {
      focusSoundEngine.stop();
      setActiveSound('none');
    } else {
      setActiveSound(type);
      focusSoundEngine.play(type);
    }
  };

  // Switch Modes
  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) {
      if (!confirm('Switching modes will pause and reset the current active timer. Continue?')) {
        return;
      }
    }
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'stopwatch') {
      setSeconds(0);
    } else {
      setSeconds(PRESET_DURATIONS[newMode]);
    }
    setLaps([]);
  };

  // Main Timer Interval & Silent XP Integration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        // 1. Advance time
        if (mode === 'stopwatch') {
          setSeconds((prev) => prev + 1);
        } else {
          setSeconds((prev) => {
            if (prev <= 1) {
              // Timer completed
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }

        // 2. Track active study seconds (only during study modes, not breaks)
        const isStudyMode = mode === 'stopwatch' || mode === 'pomodoro_25' || mode === 'deep_50';
        if (isStudyMode) {
          activeStudySecondsRef.current += 1;
          setTodaySeconds((t) => {
            const nextVal = t + 1;
            try {
              localStorage.setItem(`siparana_daily_study_seconds_${todayKey}`, nextVal.toString());
            } catch {}
            return nextVal;
          });

          // 3. SILENT BACKGROUND XP INTEGRATION: Every 5 minutes (300 seconds) of active study time, grant +10 XP
          if (activeStudySecondsRef.current > 0 && activeStudySecondsRef.current % 300 === 0) {
            const minutesMilestone = Math.floor(activeStudySecondsRef.current / 60);
            
            // Add XP via AuthContext (which automatically persists to real-time cloud database & local storage)
            addXP(10, 'focus_study_timer', {
              durationMinutes: 5,
              subject,
              topic: topic || 'General Study',
              mode
            });

            setSessionEarnedXP((x) => x + 10);

            // Trigger silent floating feedback toast
            const toastId = `xp_${Date.now()}`;
            setSilentXPToast({
              id: toastId,
              text: `+10 XP Earned! ⚡ (${minutesMilestone}m Focus Milestone)`
            });

            // Automatically clear toast after 4.5 seconds
            setTimeout(() => {
              setSilentXPToast((current) => (current?.id === toastId ? null : current));
            }, 4500);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, subject, topic, addXP, todayKey]);

  // Handle Pomodoro / Deep Work Timer Completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    soundFX.playCorrect();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Award bonus XP for finishing the target duration
    const bonusXP = mode === 'deep_50' ? 30 : 15;
    addXP(bonusXP, 'focus_study_complete', { mode, subject });
    setSessionEarnedXP((prev) => prev + bonusXP);

    setSilentXPToast({
      id: `complete_${Date.now()}`,
      text: `🎉 Session Complete! +${bonusXP} XP Completion Bonus Added!`
    });

    // Auto-save session
    saveCurrentSession(mode === 'deep_50' ? 50 * 60 : 25 * 60, bonusXP);
  };

  // Start / Pause
  const toggleStartPause = () => {
    if (!isRunning) {
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
      soundFX.playCorrect();
    }
    setIsRunning(!isRunning);
  };

  // Reset Timer
  const handleReset = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    if (mode === 'stopwatch') {
      setSeconds(0);
    } else {
      setSeconds(PRESET_DURATIONS[mode]);
    }
    activeStudySecondsRef.current = 0;
    setLaps([]);
  };

  // Add Lap Marker
  const handleAddLap = () => {
    const totalSec = mode === 'stopwatch' ? seconds : PRESET_DURATIONS[mode] - seconds;
    const formatted = formatTime(totalSec);
    const newLap: LapRecord = {
      id: `lap_${Date.now()}`,
      lapNumber: laps.length + 1,
      timeFormatted: `${formatted.hoursStr}:${formatted.minsStr}:${formatted.secsStr}`,
      totalSeconds: totalSec,
      xpAtLap: sessionEarnedXP,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLaps([newLap, ...laps]);
    soundFX.playCorrect();
  };

  // Save Session & Reset
  const handleFinishAndSave = () => {
    const elapsed = mode === 'stopwatch' ? seconds : PRESET_DURATIONS[mode] - seconds;
    if (elapsed < 30) {
      alert('Session duration is less than 30 seconds. Study a bit longer to record a session!');
      return;
    }

    saveCurrentSession(elapsed, sessionEarnedXP);
    setIsRunning(false);
    handleReset();
    setSessionEarnedXP(0);
    activeStudySecondsRef.current = 0;
    setSessionStartTime(null);

    soundFX.playLevelUp();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const saveCurrentSession = (totalSec: number, xp: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const timeFormatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const newRecord: StudySessionRecord = {
      id: `sess_${Date.now()}`,
      subject,
      topic: topic.trim() || 'Focused Study Session',
      totalSeconds: totalSec,
      hours: hrs,
      minutes: mins,
      seconds: secs,
      xpEarned: xp > 0 ? xp : 10,
      timestamp: Date.now(),
      date: 'Today',
      timeFormatted
    };

    const updated = [newRecord, ...sessions];
    setSessions(updated);
    try {
      localStorage.setItem('siparana_study_sessions', JSON.stringify(updated));
    } catch {}
  };

  // Clear Session History
  const clearSessionHistory = () => {
    if (confirm('Clear past study session history?')) {
      setSessions([]);
      try {
        localStorage.removeItem('siparana_study_sessions');
      } catch {}
    }
  };

  // Toggle Zen Fullscreen
  const toggleZenMode = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsZenMode(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsZenMode(false);
    }
  };

  // Helpers
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return {
      hoursStr: hrs.toString().padStart(2, '0'),
      minsStr: mins.toString().padStart(2, '0'),
      secsStr: secs.toString().padStart(2, '0')
    };
  };

  const displayTime = useMemo(() => {
    return formatTime(seconds);
  }, [seconds]);

  // Next XP countdown calculation (seconds remaining until the next 5-minute milestone)
  const secondsToNextXP = useMemo(() => {
    const current = activeStudySecondsRef.current % 300;
    const remaining = 300 - current;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [seconds, isRunning]);

  // Circular Dial Progress calculations
  const dialPercentage = useMemo(() => {
    if (mode === 'stopwatch') {
      // Sweeps 0-100% every 60 seconds for a rhythmic analog watch feel
      return ((seconds % 60) / 60) * 100;
    } else {
      // Remaining percentage of pomodoro duration
      const total = PRESET_DURATIONS[mode];
      return total > 0 ? ((total - seconds) / total) * 100 : 0;
    }
  }, [mode, seconds]);

  // SVG circle calculations
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dialPercentage / 100) * circumference;

  // Daily target (default 120 mins = 7200 seconds)
  const DAILY_GOAL_SECONDS = 7200;
  const dailyProgressPercent = Math.min(100, Math.round((todaySeconds / DAILY_GOAL_SECONDS) * 100));

  return (
    <div
      ref={containerRef}
      id="focus-study-room-container"
      className={`min-h-[85vh] transition-colors duration-500 ${
        isZenMode
          ? 'fixed inset-0 z-50 bg-slate-950 text-white p-6 overflow-y-auto flex flex-col justify-center items-center'
          : 'space-y-6'
      }`}
    >
      {/* Silent Floating XP Pulse Notification */}
      {silentXPToast && (
        <div
          id="silent-xp-toast"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-xl shadow-cyan-500/25 border border-cyan-300/30 animate-bounce transition-all backdrop-blur-md"
        >
          <div className="p-1.5 rounded-xl bg-white/20">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-cyan-100">Live Focus Reward</p>
            <p className="text-sm font-extrabold">{silentXPToast.text}</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      {!isZenMode && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Focus Study Room (ගැඹුරු පාඩම් කාමරය)
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Visual stopwatch & Pomodoro timer with silent background XP accumulation (+10 XP per 5m)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile?.streakDays || 1}d Streak</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200/80 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 text-xs font-bold">
              <Zap className="w-4 h-4 text-cyan-500 fill-cyan-500" />
              <span>Session: +{sessionEarnedXP} XP</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Today: {Math.floor(todaySeconds / 60)}m / 120m</span>
            </div>

            <button
              id="btn-focus-parent-report"
              onClick={() => {
                setLatestReport(getLatestWeeklyReport());
                setShowReportHub(true);
              }}
              title="View Weekly Parent Performance Report"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Parent Report</span>
            </button>

            <button
              id="btn-toggle-zen-mode"
              onClick={toggleZenMode}
              title="Toggle Fullscreen Zen Mode"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Study Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Timer Console (8 cols) */}
        <div className={`space-y-6 ${isZenMode ? 'w-full max-w-3xl' : 'lg:col-span-8'}`}>
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-white">
            {/* Background Neon Halo */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Zen Mode Exit Button */}
            {isZenMode && (
              <button
                onClick={toggleZenMode}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit Zen</span>
              </button>
            )}

            {/* Mode Switcher Pills */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-6">
              {[
                { id: 'stopwatch', label: '⏱️ Stopwatch Mode (00:00:00)', desc: 'Count-Up Unbounded' },
                { id: 'pomodoro_25', label: '🎯 25m Pomodoro', desc: 'Standard Focus' },
                { id: 'deep_50', label: '🧠 50m Deep Work', desc: 'High Intensity' },
                { id: 'break_5', label: '☕ 5m Short Break', desc: 'Recharge' },
                { id: 'break_15', label: '🌴 15m Rest', desc: 'Long Recovery' }
              ].map((m) => (
                <button
                  key={m.id}
                  id={`mode-pill-${m.id}`}
                  onClick={() => handleModeChange(m.id as TimerMode)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    mode === m.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105 border border-cyan-400/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Neon Glowing Circular Timer Dial */}
            <div className="relative flex flex-col items-center justify-center my-4">
              <div className="relative w-[290px] h-[290px] sm:w-[330px] h-[330px] flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                  {/* Outer glow filter definition */}
                  <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Track Circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800/90 fill-transparent"
                  />

                  {/* Active Neon Progress Circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    stroke={mode.startsWith('break') ? 'url(#breakGradient)' : 'url(#neonGradient)'}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                    className={`fill-transparent transition-all duration-300 ${
                      isRunning ? 'opacity-100' : 'opacity-80'
                    }`}
                  />
                </svg>

                {/* Central Time & Status Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                  {/* Active Status Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                      {isRunning
                        ? mode.startsWith('break')
                          ? 'Taking a Break ☕'
                          : 'Deep Focus Active ⚡'
                        : 'Study Room Ready'}
                    </span>
                  </div>

                  {/* Big Digital Monospace Clock */}
                  <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    {mode === 'stopwatch' ? (
                      <>
                        {displayTime.hoursStr}:{displayTime.minsStr}:{displayTime.secsStr}
                      </>
                    ) : (
                      <>
                        {displayTime.minsStr}:{displayTime.secsStr}
                      </>
                    )}
                  </div>

                  {/* Subtitle / Next XP indicator */}
                  <div className="mt-2 text-xs font-semibold text-cyan-300/90 flex items-center gap-1">
                    {isRunning && !mode.startsWith('break') ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                        <span>Next +10 XP in {secondsToNextXP}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">
                        {mode === 'stopwatch' ? 'Counting active study time upwards' : 'Target focus countdown'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Quote Banner */}
            <div className="text-center max-w-lg mx-auto mb-6 px-4 py-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 italic">
              {MOTIVATIONAL_QUOTES[quoteIdx]}
            </div>

            {/* Primary Action Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {/* Start / Pause Button */}
              <button
                id="btn-timer-toggle"
                onClick={toggleStartPause}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-xl transition-all transform active:scale-95 cursor-pointer ${
                  isRunning
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/30 hover:brightness-110'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold shadow-emerald-500/30 hover:brightness-110'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Focus</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start Studying</span>
                  </>
                )}
              </button>

              {/* Lap / Interval Checkpoint */}
              {mode === 'stopwatch' && isRunning && (
                <button
                  id="btn-timer-lap"
                  onClick={handleAddLap}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm border border-cyan-500/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <Flag className="w-4 h-4" />
                  <span>Mark Lap</span>
                </button>
              )}

              {/* Complete & Save Session */}
              {(seconds > 30 || activeStudySecondsRef.current > 30) && (
                <button
                  id="btn-timer-finish"
                  onClick={handleFinishAndSave}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish & Record XP</span>
                </button>
              )}

              {/* Reset Button */}
              <button
                id="btn-timer-reset"
                onClick={handleReset}
                title="Reset Timer"
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject & Chapter Tagging Bar */}
          {!isZenMode && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                <BookOpen className="w-4 h-4 text-cyan-500" />
                <span>Active Study Tag & Subject Focus</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Select Subject
                  </label>
                  <select
                    id="focus-subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-cyan-500"
                  >
                    {STUDY_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Specific Topic / Chapter (Optional)
                  </label>
                  <input
                    id="focus-topic-input"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Past Paper 2024 Question 4, Integration"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Laps List (if any recorded) */}
              {laps.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Flag className="w-3.5 h-3.5 text-cyan-500" />
                      Recorded Checkpoints ({laps.length})
                    </span>
                    <button
                      onClick={() => setLaps([])}
                      className="text-[11px] text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      Clear Laps
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {laps.map((lap) => (
                      <div
                        key={lap.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
                      >
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Lap #{lap.lapNumber}
                        </span>
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {lap.timeFormatted}
                        </span>
                        <span className="text-[10px] text-slate-400">{lap.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Background Ambient Sounds & Gamified Stats (4 cols) */}
        {!isZenMode && (
          <div className="space-y-6 lg:col-span-4">
            {/* Ambient Sound Sanctuary */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Ambient Study Soundscapes</span>
                </div>
                {activeSound !== 'none' && (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse">
                    PLAYING
                  </span>
                )}
              </div>

              {/* Sound Selector Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rain', label: '🌧️ Gentle Rain', desc: 'Warm brown noise' },
                  { id: 'lofi', label: '🎧 Lo-Fi Beats', desc: 'Soothing chill chords' },
                  { id: 'library', label: '☕ Library Whisper', desc: 'Acoustic room hum' },
                  { id: 'whitenoise', label: '🌊 White Noise', desc: 'Total focus mask' }
                ].map((s) => (
                  <button
                    key={s.id}
                    id={`sound-btn-${s.id}`}
                    onClick={() => handleSoundSelect(s.id as AmbientSoundType)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      activeSound === s.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{s.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>

              {/* Volume Slider & Mute */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  id="btn-ambient-mute"
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  id="ambient-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
                  {isMuted ? '0%' : `${Math.round(soundVolume * 100)}%`}
                </span>
              </div>

              {/* Animated Equalizer Waves (visual feedback when playing) */}
              {activeSound !== 'none' && !isMuted && (
                <div className="flex items-center justify-center gap-1 h-5 pt-1">
                  <span className="w-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                  <span className="w-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:150ms] h-5" />
                  <span className="w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms] h-3" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:450ms] h-5" />
                  <span className="w-1 bg-teal-500 rounded-full animate-bounce [animation-delay:200ms] h-4" />
                </div>
              )}
            </div>

            {/* Daily Study Target Progress */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-500" />
                  Daily Focus Goal (2 Hours)
                </span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {dailyProgressPercent}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${dailyProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{Math.floor(todaySeconds / 60)} mins completed</span>
                <span>{Math.max(0, 120 - Math.floor(todaySeconds / 60))} mins remaining</span>
              </div>
            </div>

            {/* Recent Recorded Study Sessions */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  <History className="w-4 h-4 text-indigo-500" />
                  <span>Recent Focus Sessions</span>
                </div>
                {sessions.length > 0 && (
                  <button
                    onClick={clearSessionHistory}
                    title="Clear history"
                    className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No completed study sessions yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {sessions.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{s.subject}</p>
                        <p className="text-[10px] text-slate-400 truncate">{s.topic || s.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {s.timeFormatted}
                        </p>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Zap className="w-3 h-3 fill-amber-500" />+{s.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Parental Report Hub Modal */}
      <ParentalReportHubModal
        isOpen={showReportHub}
        onClose={() => setShowReportHub(false)}
        onOpenChat={() => {
          setShowReportHub(false);
          setShowChatModal(true);
        }}
      />

      {/* In-App Parent Chat Modal */}
      <InAppParentChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        currentReport={latestReport}
        onRefreshReport={() => setLatestReport(getLatestWeeklyReport())}
      />
    </div>
  );
}
