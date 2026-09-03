import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Languages,
  Sparkles,
  Search,
  GraduationCap,
  School,
  Palette,
  Code2,
  MapPin,
  CheckCircle2,
  Volume2,
  Copy,
  Check,
  Flame,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Send,
  Plus,
  Play,
  RotateCcw,
  Compass,
  FileText,
  SlidersHorizontal,
  Lightbulb,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import mascotImage from '@/assets/images/siparana_mascot_1787392758475.jpg';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import {
  GOOGLE_TOOLS,
  STUDY_GLOSSARY,
  SOCRATIC_SOLVER_PRESETS,
  SCHOLAR_PUBLICATIONS,
  ARTS_EXHIBITS,
  CS_FIRST_PROJECTS,
  EARTH_LANDMARKS,
  type GoogleToolDef
} from '@/data/googleHubData';

interface GoogleStudentHubPageProps {
  onNavigate?: (page: string) => void;
}

export default function GoogleStudentHubPage({ onNavigate }: GoogleStudentHubPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [activeToolId, setActiveToolId] = useState<GoogleToolDef['id']>('translate');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Mascot interaction states
  const [isHighFiving, setIsHighFiving] = useState(false);
  const [mascotCheerCount, setMascotCheerCount] = useState(0);

  // Translate tool state
  const [transSourceText, setTransSourceText] = useState('Photosynthesis in green plants produces glucose and oxygen.');
  const [transSourceLang, setTransSourceLang] = useState<'en' | 'si' | 'ta'>('en');
  const [transTargetLang, setTransTargetLang] = useState<'en' | 'si' | 'ta'>('si');
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState<string>('All');
  const [glossarySearch, setGlossarySearch] = useState('');

  // Socratic tool state
  const [selectedSolverId, setSelectedSolverId] = useState<string>('quadratic');
  const [customProblemText, setCustomProblemText] = useState<string>('');
  const [isSolving, setIsSolving] = useState(false);

  // Scholar tool state
  const [scholarSearchQuery, setScholarSearchQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('p1');
  const [citationFormat, setCitationFormat] = useState<'apa' | 'harvard'>('apa');

  // Classroom tool state
  const [classroomAssignments, setClassroomAssignments] = useState([
    {
      id: 'a1',
      title: 'Physics Mechanics: Resolving Forces Past Paper 2023',
      subject: 'A/L Physics',
      dueDate: 'Tomorrow, 5:00 PM',
      status: 'pending',
      xpReward: 35
    },
    {
      id: 'a2',
      title: 'Combined Maths: Integration by Parts Assignment #4',
      subject: 'Combined Mathematics',
      dueDate: 'Friday, 11:59 PM',
      status: 'in_progress',
      xpReward: 40
    },
    {
      id: 'a3',
      title: 'ICT: Relational Database Schema Normalization 3NF',
      subject: 'A/L & O/L ICT',
      dueDate: 'Completed Yesterday',
      status: 'completed',
      xpReward: 30
    }
  ]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState('A/L Physics');

  // Arts & Culture state
  const [selectedExhibitId, setSelectedExhibitId] = useState<string>('sigiriya');
  const [triviaSolved, setTriviaSolved] = useState<Record<string, boolean>>({});

  // CS First state
  const [activeProjectId, setActiveProjectId] = useState<string>('cs_pong');
  const [csFirstRunning, setCsFirstRunning] = useState(false);
  const [csFirstScore, setCsFirstScore] = useState(0);

  // Earth state
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('pidurutalagala');
  const [earthQuizAnswer, setEarthQuizAnswer] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    soundFX.playCorrect();
    triggerToast(`📋 ${label} ක්ලිප්බෝඩ් එකට පිටපත් කරගන්නා ලදී!`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleMascotCheer = () => {
    setIsHighFiving(true);
    try {
      soundFX.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65, x: 0.5 }
      });
    } catch {
      // safe fallback
    }
    setMascotCheerCount((prev) => prev + 1);
    triggerToast('🎉 අරණ මාස්කොට් සමඟ එක්වී සාර්ථකව සම්බන්ධ විය!');
    setTimeout(() => setIsHighFiving(false), 700);
  };

  const handleSpeakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      if (langCode === 'en') utterance.lang = 'en-US';
      if (langCode === 'si') utterance.lang = 'si-LK';
      if (langCode === 'ta') utterance.lang = 'ta-LK';
      window.speechSynthesis.speak(utterance);
      triggerToast('🔊 ශ්‍රව්‍ය උච්චාරණය වාදනය වේ...');
    } else {
      triggerToast('Browser speech synthesis not supported.');
    }
  };

  const activeTool = useMemo(() => {
    return GOOGLE_TOOLS.find((t) => t.id === activeToolId) || GOOGLE_TOOLS[0];
  }, [activeToolId]);

  // Mascot dynamic advice based on selected tool
  const currentMascotTip = useMemo(() => {
    if (language === 'si') return activeTool.mascotTip.si;
    if (language === 'ta') return activeTool.mascotTip.ta;
    return activeTool.mascotTip.en;
  }, [activeTool, language]);

  // In-app mock instant translator logic
  const translatedResult = useMemo(() => {
    if (!transSourceText.trim()) return '';
    const lower = transSourceText.toLowerCase().trim();
    // Check if in glossary
    const match = STUDY_GLOSSARY.find(
      (g) => g.en.toLowerCase() === lower || g.si.includes(lower) || g.ta.includes(lower)
    );
    if (match) {
      if (transTargetLang === 'si') return match.si;
      if (transTargetLang === 'ta') return match.ta;
      return match.en;
    }
    // Generic contextual translation
    if (transTargetLang === 'si') {
      return `පරිවර්තනය: "${transSourceText}" (ශ්‍රී ලංකා අධ්‍යාපන විෂය නිර්දේශයට අනුව සකස් කළ ක්ෂණික අර්ථය). පත්‍රිකා හා ප්‍රශ්න විසඳීමට අගනා විෂය වචන මාලාව පහතින් නරඹන්න.`;
    }
    if (transTargetLang === 'ta') {
      return `மொழிபெயர்ப்பு: "${transSourceText}" (கல்வித் திட்டத்திற்கு அமைவான உடனடி அர்த்தம்).`;
    }
    return `Translation: "${transSourceText}" (Accurate academic educational rendition).`;
  }, [transSourceText, transTargetLang]);

  // Filtered glossary
  const filteredGlossary = useMemo(() => {
    return STUDY_GLOSSARY.filter((item) => {
      if (selectedGlossaryCategory !== 'All' && item.category !== selectedGlossaryCategory) {
        return false;
      }
      if (glossarySearch.trim() !== '') {
        const q = glossarySearch.toLowerCase();
        return (
          item.en.toLowerCase().includes(q) ||
          item.si.toLowerCase().includes(q) ||
          item.ta.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedGlossaryCategory, glossarySearch]);

  const activePaper = useMemo(() => {
    return SCHOLAR_PUBLICATIONS.find((p) => p.id === selectedPaperId) || SCHOLAR_PUBLICATIONS[0];
  }, [selectedPaperId]);

  const activeExhibit = useMemo(() => {
    return ARTS_EXHIBITS.find((e) => e.id === selectedExhibitId) || ARTS_EXHIBITS[0];
  }, [selectedExhibitId]);

  const activeProject = useMemo(() => {
    return CS_FIRST_PROJECTS.find((p) => p.id === activeProjectId) || CS_FIRST_PROJECTS[0];
  }, [activeProjectId]);

  const activeLandmark = useMemo(() => {
    return EARTH_LANDMARKS.find((l) => l.id === selectedLandmarkId) || EARTH_LANDMARKS[0];
  }, [selectedLandmarkId]);

  const toggleAssignmentStatus = (id: string) => {
    setClassroomAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'completed' ? 'pending' : 'completed';
          if (nextStatus === 'completed') {
            soundFX.playCorrect();
            try {
              confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
            } catch {
              // safe
            }
            triggerToast(`🎉 "${a.title}" සාර්ථකව සම්පූර්ණ කරන ලදී!`);
          }
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;
    const newTask = {
      id: 'a_' + Date.now(),
      title: newAssignmentTitle.trim(),
      subject: newAssignmentSubject,
      dueDate: 'Due Next Week',
      status: 'pending',
      xpReward: 30
    };
    setClassroomAssignments([newTask, ...classroomAssignments]);
    setNewAssignmentTitle('');
    soundFX.playCorrect();
    triggerToast('✅ නව පැවරුම සාර්ථකව එක් කරන ලදී!');
  };

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages':
        return Languages;
      case 'Sparkles':
        return Sparkles;
      case 'GraduationCap':
        return GraduationCap;
      case 'School':
        return School;
      case 'Palette':
        return Palette;
      case 'Code2':
        return Code2;
      case 'Globe':
        return Globe;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 select-text">
      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{showToast}</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Google for Education Integrated Hub • ගූගල් අධ්‍යාපනික කේන්ද්‍රය</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Google Student Hub (ගූගල් අධ්‍යාපන පීඨය)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Google Translate, Socratic AI, Google Scholar, Classroom, Arts & Culture, CS First සහ Google Earth යන ප්‍රබල මෙවලම් SipArana තුළදීම බාධාවකින් තොරව භාවිත කර අධ්‍යයන කටයුතු ජයගන්න.
            </p>
          </div>

          {/* Quick Hub Stats Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[260px] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% In-App Experience
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
                No Redirects
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-amber-300">7 Tools</div>
                <div className="text-[10px] text-slate-300">Essential Google Tools</div>
              </div>
              <div className="p-2 rounded-xl bg-black/20">
                <div className="text-lg font-black text-cyan-300">Grades 6–13</div>
                <div className="text-[10px] text-slate-300">& University Portal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANIMATED MASCOT GUIDANCE & STEP-BY-STEP ADVICE */}
      <motion.div
        id="mascot-google-hub-guide"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border-2 border-blue-400/60 dark:border-blue-500/40 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Mascot 3D Avatar */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: isHighFiving ? [0, -12, 12, -6, 0] : [0, 1, -1, 0]
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: isHighFiving ? 0.6 : 5, repeat: isHighFiving ? 0 : Infinity, ease: 'easeInOut' }
            }}
            onClick={handleMascotCheer}
            className="relative cursor-pointer group flex-shrink-0"
            title="Click Arana for a High-Five & XP! ✋"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 p-1 shadow-lg border-2 border-blue-300 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                <img
                  src={mascotImage}
                  alt="Arana Mascot Guiding Google Hub"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition">
              ✋ {isHighFiving ? '🎉 High Five!' : 'Click Arana!'}
            </div>
          </motion.div>

          {/* Mascot Guidance Speech Bubble */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-blue-500 text-blue-500" />
                <span>අරණ ගුරු මාස්කොට්ගේ මඟපෙන්වීම (Arana's Interactive Guide)</span>
              </div>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                Active Tool: {activeTool.name}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeToolId + mascotCheerCount}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed bg-white/60 dark:bg-black/30 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/40"
              >
                {currentMascotTip}
              </motion.p>
            </AnimatePresence>

            <div className="pt-2 border-t border-blue-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Seamless In-App Workspace
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Syllabus Aligned
                </span>
              </div>

              <button
                onClick={handleMascotCheer}
                className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-1 transition shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>High-Five Arana (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. TOOL SELECTOR NAVIGATION BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Select Google Educational Tool (මෙවලම තෝරන්න)</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            7 In-App Workspaces
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {GOOGLE_TOOLS.map((tool) => {
            const Icon = getToolIcon(tool.iconName);
            const isSelected = activeToolId === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveToolId(tool.id);
                  soundFX.playCorrect();
                }}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 relative group cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 scale-102 ring-2 ring-blue-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-black truncate">{tool.name}</h3>
                  <p
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {tool.badge}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE IN-APP TOOL WORKSPACE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Active Tool Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {activeTool.category}
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In-App Live Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {activeTool.nameSinhala}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {activeTool.taglineSinhala}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                soundFX.playCorrect();
                triggerToast(`⭐ ${activeTool.name} මෙවලම අධ්‍යයනය සම්පූර්ණයි!`);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Mark Studied</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TOOL 1: GOOGLE TRANSLATE IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'translate' && (
          <div className="space-y-6">
            {/* Live Dual-Pane Translation Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Input */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Source:</span>
                    <select
                      value={transSourceLang}
                      onChange={(e) => setTransSourceLang(e.target.value as any)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      <option value="en">English (ඉංග්‍රීසි)</option>
                      <option value="si">Sinhala (සිංහල)</option>
                      <option value="ta">Tamil (දෙමළ)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleSpeakText(transSourceText, transSourceLang)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={transSourceText}
                  onChange={(e) => setTransSourceText(e.target.value)}
                  placeholder="පරිවර්තනය කිරීමට අවශ්‍ය වාක්‍යය හෝ විෂය කරුණ මෙහි සටහන් කරන්න..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{transSourceText.length} characters</span>
                  <button
                    onClick={() => setTransSourceText('')}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Target Translated Output */}
              <div className="bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Target:</span>
                      <select
                        value={transTargetLang}
                        onChange={(e) => setTransTargetLang(e.target.value as any)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-200"
                      >
                        <option value="si">Sinhala (සිංහල)</option>
                        <option value="ta">Tamil (දෙමළ)</option>
                        <option value="en">English (ඉංග්‍රීසි)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeakText(translatedResult, transTargetLang)}
                        className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translatedResult, 'පරිවර්තනය')}
                        className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                        title="Copy Translation"
                      >
                        {copiedText === translatedResult ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="min-h-[100px] bg-white dark:bg-slate-900 rounded-xl p-3 border border-blue-100 dark:border-blue-900/60 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {translatedResult || <span className="text-slate-400 italic">පරිවර්තන ප්‍රතිඵලය මෙහි දිස්වේ...</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-1">
                  <span>✓ Verified Educational Rendition</span>
                  <span>Instant In-App Sync</span>
                </div>
              </div>
            </div>

            {/* Curated Subject Vocabulary Bank */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>A/L & O/L Subject Technical Vocabulary Bank (විෂය පාරිභාෂික ශබ්දකෝෂය)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    විද්‍යා, ගණිත, ICT සහ වාණිජ විෂයයන්හි නිතර හමුවන ඉංග්‍රීසි-සිංහල-දෙමළ වචන
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedGlossaryCategory}
                    onChange={(e) => setSelectedGlossaryCategory(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="ICT">ICT</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Commerce">Commerce</option>
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="Search glossary..."
                      className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 w-36 sm:w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {item.category}
                      </span>
                      <button
                        onClick={() => handleSpeakText(item.en, 'en')}
                        className="text-slate-400 hover:text-blue-600 transition p-1"
                        title="Pronounce English Term"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                        {item.en}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {item.si}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.ta}
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {item.definition}
                    </p>

                    <button
                      onClick={() => {
                        setTransSourceText(item.en);
                        soundFX.playCorrect();
                        triggerToast(`"${item.en}" පරිවර්තකයට එක් කරන ලදී.`);
                      }}
                      className="w-full text-center py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                    >
                      Load into Translator →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 2: SOCRATIC BY GOOGLE IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'socratic' && (
          <div className="space-y-6">
            {/* Preset Problem Selectors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Select a Syllabus Problem or Formula to Demystify:
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Step-by-Step Breakdown
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SOCRATIC_SOLVER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedSolverId(preset.id);
                      soundFX.playCorrect();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                      selectedSolverId === preset.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/40 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 inline-block">
                      {preset.subject}
                    </span>
                    <h4 className="text-xs font-extrabold truncate">{preset.title}</h4>
                    <p className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 truncate">
                      {preset.formula}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Detailed Derivation Card */}
            {(() => {
              const activePreset =
                SOCRATIC_SOLVER_PRESETS.find((p) => p.id === selectedSolverId) ||
                SOCRATIC_SOLVER_PRESETS[0];

              return (
                <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-slate-800/80 dark:to-slate-900 border border-amber-300 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        {activePreset.subject}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                        {activePreset.title}
                      </h3>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-xs font-extrabold border border-amber-300 dark:border-amber-800">
                      Formula: {activePreset.formula}
                    </div>
                  </div>

                  {/* Step-by-step resolution chain */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>පියවරෙන් පියවර විසඳුම් ක්‍රමවේදය (Step-by-Step Derivation):</span>
                    </h4>

                    <div className="space-y-2.5">
                      {activePreset.steps.map((step) => (
                        <div
                          key={step.stepNum}
                          className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 text-xs sm:text-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {step.stepNum}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Answer Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-400/60 dark:border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                        අවසාන පිළිතුර (Final Result)
                      </span>
                      <div className="text-sm sm:text-base font-extrabold text-emerald-900 dark:text-emerald-200 font-mono">
                        {activePreset.finalAnswer}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(activePreset.finalAnswer, 'විසඳුම')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-500 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Solution</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 3: GOOGLE SCHOLAR IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'scholar' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={scholarSearchQuery}
                  onChange={(e) => setScholarSearchQuery(e.target.value)}
                  placeholder="Search Sri Lankan educational papers, science journals, university theses..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Citation Style:</span>
                <button
                  onClick={() => setCitationFormat('apa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    citationFormat === 'apa'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  APA 7th
                </button>
                <button
                  onClick={() => setCitationFormat('harvard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    citationFormat === 'harvard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Harvard
                </button>
              </div>
            </div>

            {/* Publications Grid & Active Reader */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Paper Selector List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Academic Papers (පර්යේෂණ පත්‍රිකා)
                </h3>

                <div className="space-y-2.5">
                  {SCHOLAR_PUBLICATIONS.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => {
                        setSelectedPaperId(paper.id);
                        soundFX.playCorrect();
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        selectedPaperId === paper.id
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-950 dark:text-blue-100 shadow-sm ring-1 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{paper.year}</span>
                        <span className="text-slate-400">{paper.citationsCount} Citations</span>
                      </div>
                      <h4 className="text-xs font-extrabold line-clamp-2">{paper.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{paper.journal}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* In-App Abstract & Citation Viewer */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                    Peer-Reviewed Research Paper
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-snug">
                    {activePaper.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Authors: {activePaper.authors} • {activePaper.journal} ({activePaper.year})
                  </p>
                </div>

                {/* Abstract */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    සාරාංශය (Abstract):
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                    {activePaper.abstract}
                  </p>
                </div>

                {/* Citation Copy Box */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                      Formatted {citationFormat.toUpperCase()} Citation for Assignments:
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          citationFormat === 'apa' ? activePaper.apaCitation : activePaper.harvardCitation,
                          'උපුටා දැක්වීම (Citation)'
                        )
                      }
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Citation</span>
                    </button>
                  </div>

                  <div className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    {citationFormat === 'apa' ? activePaper.apaCitation : activePaper.harvardCitation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 4: GOOGLE CLASSROOM HUB IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'classroom' && (
          <div className="space-y-6">
            {/* Quick Add Assignment Bar */}
            <form
              onSubmit={handleAddAssignment}
              className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <input
                type="text"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                placeholder="නව පැවරුමක් හෝ ගෙදර වැඩ සටහනක් එක් කරන්න (e.g. Physics past paper 2022)..."
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />

              <select
                value={newAssignmentSubject}
                onChange={(e) => setNewAssignmentSubject(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <option value="A/L Physics">A/L Physics</option>
                <option value="Combined Mathematics">Combined Mathematics</option>
                <option value="A/L Chemistry">A/L Chemistry</option>
                <option value="A/L Biology">A/L Biology</option>
                <option value="A/L & O/L ICT">ICT</option>
                <option value="General English">General English</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Assignments Kanban List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Study Streams & Classroom Tasks
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {classroomAssignments.filter((a) => a.status === 'completed').length} /{' '}
                  {classroomAssignments.length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {classroomAssignments.map((assignment) => {
                  const isDone = assignment.status === 'completed';
                  return (
                    <div
                      key={assignment.id}
                      onClick={() => toggleAssignmentStatus(assignment.id)}
                      className={`p-4 rounded-2xl border transition-all space-y-3 cursor-pointer flex flex-col justify-between ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-400/60 dark:border-emerald-500/40 opacity-80'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {assignment.subject}
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            +{assignment.xpReward} XP
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-extrabold leading-snug ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {assignment.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{assignment.dueDate}</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            isDone ? 'text-emerald-600' : 'text-slate-500'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-500' : 'text-slate-300'}`} />
                          {isDone ? 'Completed' : 'Mark Done'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 5: GOOGLE ARTS & CULTURE IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'arts_culture' && (
          <div className="space-y-6">
            {/* Exhibit selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {ARTS_EXHIBITS.map((exhibit) => (
                <button
                  key={exhibit.id}
                  onClick={() => {
                    setSelectedExhibitId(exhibit.id);
                    soundFX.playCorrect();
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                    selectedExhibitId === exhibit.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-102'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{exhibit.nameSinhala}</span>
                </button>
              ))}
            </div>

            {/* Exhibit 3D / Virtual Tour Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 group h-72">
                <img
                  src={activeExhibit.image}
                  alt={activeExhibit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                    {activeExhibit.period}
                  </span>
                  <h3 className="text-lg font-black">{activeExhibit.nameSinhala}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {activeExhibit.location}
                  </p>
                </div>
              </div>

              {/* Highlights & Trivia Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {activeExhibit.name} ({activeExhibit.nameSinhala})
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeExhibit.descriptionSinhala}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                    Key Architectural & Historical Highlights:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {activeExhibit.keyHighlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTriviaSolved({ ...triviaSolved, [activeExhibit.id]: true });
                    soundFX.playCorrect();
                    triggerToast(`🏛️ ${activeExhibit.name} කලාකෘතිය අධ්‍යයනය සම්පූර්ණ කළා!`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {triviaSolved[activeExhibit.id]
                      ? '✓ Cultural Study Completed'
                      : 'Complete Cultural Study'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 6: CS FIRST BY GOOGLE IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'cs_first' && (
          <div className="space-y-6">
            {/* Project tabs */}
            <div className="flex items-center gap-2">
              {CS_FIRST_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setCsFirstRunning(false);
                    soundFX.playCorrect();
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeProjectId === project.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{project.titleSinhala}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scratch Code Block Viewer */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Code2 className="w-4 h-4" /> Scratch Visual Block Logic
                  </span>
                  <span>{activeProject.difficulty} Level</span>
                </div>

                <pre className="p-3 bg-black/40 rounded-2xl text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {activeProject.starterCode}
                </pre>

                <div className="pt-2 text-[10px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-200 uppercase">Core ICT Concepts Mastered:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProject.logicTakeaways.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive In-App Simulation Canvas */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-wider">
                      Interactive Live Code Output
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Score: <span className="text-red-600 font-extrabold">{csFirstScore}</span>
                    </span>
                  </div>

                  <div className="h-44 bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden border border-slate-800 text-center">
                    {csFirstRunning ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-amber-400 mx-auto animate-bounce shadow-lg shadow-amber-400/40 flex items-center justify-center text-slate-950 font-bold">
                          ⚡
                        </div>
                        <div className="text-xs text-white font-bold">
                          Game Logic Running! Scratch Event Loop Active!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-slate-400 text-xs">
                        <Play className="w-8 h-8 mx-auto text-slate-500" />
                        <div>Click "Run Scratch Program" to test your code</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCsFirstRunning(true);
                      setCsFirstScore((prev) => prev + 1);
                      soundFX.playCorrect();
                      triggerToast('🚀 Scratch ක්‍රමලේඛය සාර්ථකව ධාවනය විය!');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run Scratch Program</span>
                  </button>

                  <button
                    onClick={() => {
                      setCsFirstRunning(false);
                      setCsFirstScore(0);
                    }}
                    className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TOOL 7: GOOGLE EARTH IN-APP WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        {activeToolId === 'earth' && (
          <div className="space-y-6">
            {/* Landmark Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {EARTH_LANDMARKS.map((landmark) => (
                <button
                  key={landmark.id}
                  onClick={() => {
                    setSelectedLandmarkId(landmark.id);
                    soundFX.playCorrect();
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                    selectedLandmarkId === landmark.id
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-102'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{landmark.nameSinhala}</span>
                </button>
              ))}
            </div>

            {/* In-App 3D Coordinates & Topographic Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coordinates & Geographic Metadata */}
              <div className="bg-gradient-to-br from-teal-500/10 via-blue-500/5 to-emerald-500/10 dark:from-slate-800/80 dark:to-slate-900 p-5 rounded-3xl border border-teal-300 dark:border-teal-900/60 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider">
                    {activeLandmark.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                    {activeLandmark.nameSinhala}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {activeLandmark.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Elevation / Scale:</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {activeLandmark.elevation}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Coordinates (GPS):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {activeLandmark.lat}, {activeLandmark.lon}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeLandmark.description}
                </p>

                <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-900 text-xs">
                  <span className="font-bold block mb-0.5">💡 O/L & A/L Exam Fact:</span>
                  <span>{activeLandmark.examFact}</span>
                </div>
              </div>

              {/* In-App Geography Map Simulator & Interactive Quiz */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                      O/L Geography Map Identification Challenge
                    </h4>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      +20 XP Reward
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      ප්‍රශ්නය: ශ්‍රී ලංකාවේ උසම කන්ද වන {activeLandmark.nameSinhala} පිහිටා ඇති දිස්ත්‍රික්කය කුමක්ද?
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {['නුවරඑළිය (Nuwara Eliya)', 'බදුල්ල (Badulla)', 'මහනුවර (Kandy)', 'රත්නපුර (Rathnapura)'].map(
                        (choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setEarthQuizAnswer(choice);
                              if (choice.includes('නුවරඑළිය')) {
                                soundFX.playCorrect();
                                triggerToast('🎉 නිවැරදියි! පිදුරුතලාගල නුවරඑළිය දිස්ත්‍රික්කයේ පිහිටා ඇත!');
                              } else {
                                soundFX.playWrong();
                                triggerToast('නැවත උත්සාහ කරන්න!');
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                              earthQuizAnswer === choice
                                ? choice.includes('නුවරඑළිය')
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-extrabold'
                                  : 'bg-rose-100 border-rose-400 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                            }`}
                          >
                            {choice}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Interactive 3D Topographic Analysis Active</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">100% In-App Session</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. ALL 7 GOOGLE TOOLS QUICK OVERVIEW GRID */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>All Integrated Google Student Tools (සියලුම ගූගල් මෙවලම්)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any card to jump directly into its in-app workspace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOOGLE_TOOLS.map((tool) => {
            const Icon = getToolIcon(tool.iconName);
            const isSelected = activeToolId === tool.id;

            return (
              <div
                key={tool.id}
                onClick={() => {
                  setActiveToolId(tool.id);
                  soundFX.playCorrect();
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 relative group ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition">
                    {tool.name}
                  </h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {tool.nameSinhala}
                  </p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {language === 'si' ? tool.descriptionSinhala : tool.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Open In-App Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
