import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Send,
  Bot,
  User,
  Layers,
  FileText,
  Calculator,
  Compass,
  Cpu,
  Code2,
  HelpCircle,
  Download,
  BookMarked,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Filter,
  Search,
  ExternalLink,
  Award,
  Flame,
  Clock,
  Settings,
  RefreshCw,
  Building2,
  Library,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { UNIVERSITIES_DATA, UNIVERSITY_RESOURCES_DATA } from '@/data/universityData';
import type {
  UniversityDegree,
  UniversityModule,
  UniversityAIChatMessage,
  UniversityResource
} from '@/types';

type PortalTab = 'assistant' | 'curriculum' | 'resources' | 'gpa' | 'research';

export default function UniversityPortal() {
  const { profile, setUniversityAndDegree } = useAuth();

  const [activeTab, setActiveTab] = useState<PortalTab>('assistant');

  // University Context States
  const [selectedUniId, setSelectedUniId] = useState<string>(() => {
    if (profile?.university) {
      const match = UNIVERSITIES_DATA.find(u => u.name === profile.university || u.shortName === profile.universityShort);
      return match ? match.id : 'uom';
    }
    return 'uom';
  });

  const [selectedDegreeCode, setSelectedDegreeCode] = useState<string>(() => {
    return profile?.degreeCode || 'ENG-CSE';
  });

  const [activeSemesterCode, setActiveSemesterCode] = useState<string>('Y1S1');
  const [selectedModule, setSelectedModule] = useState<UniversityModule | null>(null);

  // AI Assistant State
  const [messages, setMessages] = useState<UniversityAIChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `### 🎓 සාදරයෙන් පිළිගනිමු! (Welcome to SipArana University AI Assistant)\n\nමම ඔබගේ උපාධි පාඨමාලාවට (**${profile?.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering'}** • **${profile?.university || 'University of Moratuwa'}**) අදාළ විශ්වවිද්‍යාල මට්ටමේ විශේෂිත AI අධ්‍යයන සහකාරයා වෙමි.\n\n#### 🚀 මගෙන් ලබාගත හැකි පහසුකම්:\n1. **Lectures & Core Theory Breakdown**: සංකීර්ණ සරසවි න්‍යායන්, ගණිතමය ඔප්පු කිරීම් (Mathematical Proofs) සහ Concept Intuitions පැහැදිලි කර ගැනීම.\n2. **Code & Lab Practical Helper**: Data Structures, Algorithms, System Architecture, Code Debugging සහ Pseudo-code.\n3. **Semester Exam & Past Paper Preparation**: විභාග ආදර්ශ ප්‍රශ්න, Marking Schemes සහ Revision Summaries.\n4. **Research, Thesis & Citations**: Literature Reviews, Research Methodologies සහ IEEE/APA/Harvard Citation සැකසුම්.\n\n*පහතින් ඇති මොඩියුලයක් තෝරන්න හෝ ඔබගේ ගැටලුව විමසන්න!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextMode: 'concept'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [aiMode, setAiMode] = useState<'concept' | 'code' | 'research' | 'examprep' | 'assignment'>('concept');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings / Degree Switcher Modal
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Resource Filter State
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('All');

  // GPA Calculator State
  const [gpaCourses, setGpaCourses] = useState<Array<{ name: string; credits: number; grade: string }>>([
    { name: 'Data Structures & Algorithms', credits: 3, grade: 'A' },
    { name: 'Engineering Mathematics', credits: 3, grade: 'A+' },
    { name: 'Digital Logic Systems', credits: 3, grade: 'A-' },
    { name: 'Communication Skills', credits: 2, grade: 'A' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUni = UNIVERSITIES_DATA.find(u => u.id === selectedUniId) || UNIVERSITIES_DATA[0];
  
  // Find active degree in active university
  let activeDegree: UniversityDegree | undefined;
  for (const fac of activeUni.faculties) {
    const d = fac.degrees.find(deg => deg.code === selectedDegreeCode);
    if (d) {
      activeDegree = d;
      break;
    }
  }
  if (!activeDegree && activeUni.faculties[0]?.degrees[0]) {
    activeDegree = activeUni.faculties[0].degrees[0];
  }

  // Set default selected module if none selected
  useEffect(() => {
    if (activeDegree && activeDegree.semesters.length > 0) {
      const activeSem = activeDegree.semesters.find(s => s.code === activeSemesterCode) || activeDegree.semesters[0];
      if (activeSem.modules.length > 0 && !selectedModule) {
        setSelectedModule(activeSem.modules[0]);
      }
    }
  }, [activeDegree, activeSemesterCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // Handle Send to Server-Side Gemini API
  const handleSendMessage = async (customPrompt?: string) => {
    const queryToSend = customPrompt || inputQuery.trim();
    if (!queryToSend || isAiLoading) return;

    const userMessage: UniversityAIChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moduleCode: selectedModule?.code,
      contextMode: aiMode,
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInputQuery('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/gemini/degree-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToSend,
          university: activeUni.name,
          faculty: activeDegree?.facultyName,
          degreeProgramme: activeDegree?.title,
          semester: activeSemesterCode,
          moduleCode: selectedModule?.code,
          moduleName: selectedModule?.title,
          contextMode: aiMode,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      const assistantMessage: UniversityAIChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: data.text || 'No response generated. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moduleCode: selectedModule?.code,
        contextMode: aiMode,
        isFallback: data.isFallback
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Failed to communicate with AI degree server:', err);
      const errorMessage: UniversityAIChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Connection Notice\n\nCould not connect to the academic AI server. Please verify network connectivity.\n\n*Technical Details:* ${err?.message || 'Unknown network error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // GPA Calculation Formula
  const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'E': 0.0, 'F': 0.0
  };

  const totalCredits = gpaCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalWeightedPoints = gpaCourses.reduce((sum, c) => sum + (c.credits * (GRADE_POINTS[c.grade] ?? 0)), 0);
  const calculatedGpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : '0.00';

  const handleAddGpaCourse = () => {
    setGpaCourses(prev => [...prev, { name: `Module ${prev.length + 1}`, credits: 3, grade: 'A' }]);
  };

  const handleUpdateGpaCourse = (index: number, field: 'name' | 'credits' | 'grade', value: any) => {
    setGpaCourses(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveGpaCourse = (index: number) => {
    setGpaCourses(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectModuleForAI = (mod: UniversityModule) => {
    setSelectedModule(mod);
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Active University and Degree Context */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {activeUni.name} ({activeUni.shortName})
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeDegree?.facultyName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                UGC Accredited
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {activeDegree?.title}
              </h1>
              <p className="text-sm text-cyan-200/80 mt-1 flex items-center gap-2">
                <span>{activeDegree?.titleSinhala}</span>
                <span>•</span>
                <span className="text-slate-400">{activeDegree?.durationYears} Years Honours Programme</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Student: <strong className="text-white">{profile?.name || 'Heshan Subasinghe'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Target GPA: <strong className="text-amber-300">{profile?.targetGpa || '3.95'} / 4.0</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Credits: <strong className="text-white">{activeDegree?.totalCredits} Credits</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Degree & University Switcher Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              id="switch-degree-modal-btn"
              onClick={() => setIsSwitcherOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Switch University / Degree</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Current Semester</span>
              <span className="text-base font-extrabold text-cyan-400">
                Year {profile?.academicYear || 1} • Sem {profile?.academicSemester || 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 overflow-x-auto gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="tab-assistant-btn"
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assistant'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Degree Assistant</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-[10px] font-mono">Gemini 3.7</span>
          </button>

          <button
            id="tab-curriculum-btn"
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum & Modules</span>
          </button>

          <button
            id="tab-resources-btn"
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Notes & Past Exams</span>
          </button>

          <button
            id="tab-gpa-btn"
            onClick={() => setActiveTab('gpa')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gpa'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>GPA Forecaster</span>
          </button>

          <button
            id="tab-research-btn"
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'research'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Thesis & Citations</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI DEGREE ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Module Context & Mode Selection */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Module Selector Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-cyan-400" /> Target Module Context
                </span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  {selectedModule?.code || 'General'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <h4 className="text-sm font-bold text-white leading-snug">
                  {selectedModule?.title || 'General Degree Consultation'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {selectedModule?.description || 'Ask academic questions tailored to your degree programme.'}
                </p>
              </div>

              {/* Semester Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Change Active Semester:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {activeDegree?.semesters.map(s => (
                    <button
                      key={s.code}
                      onClick={() => {
                        setActiveSemesterCode(s.code);
                        if (s.modules.length > 0) setSelectedModule(s.modules[0]);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center ${
                        activeSemesterCode === s.code
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module List within Semester */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-slate-400">
                  Select Specific Module:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeDegree?.semesters
                    .find(s => s.code === activeSemesterCode)
                    ?.modules.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedModule(mod)}
                        className={`w-full p-2 rounded-xl text-left text-xs transition border flex items-center justify-between ${
                          selectedModule?.id === mod.id
                            ? 'bg-cyan-950/40 border-cyan-500/60 text-white font-bold ring-1 ring-cyan-500/30'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="text-[10px] text-cyan-400 font-mono block">{mod.code}</span>
                          <span className="truncate block">{mod.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{mod.credits} Cr</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* AI Assistant Mode Selection */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Academic Assistant Mode
              </span>

              <div className="space-y-1.5">
                {[
                  { id: 'concept', label: 'Theory & Concept Breakdown', icon: BookOpen, desc: 'Deep derivations, proof intuition, real-world examples' },
                  { id: 'code', label: 'Code, Algorithm & Lab Helper', icon: Code2, desc: 'Syntax, Big-O complexity, test suites, refactoring' },
                  { id: 'examprep', label: 'Semester Exam Prep & Rubrics', icon: Award, desc: 'Model past questions, marking schemes, formulas' },
                  { id: 'research', label: 'Research & Literature Review', icon: FileText, desc: 'IEEE/APA citations, methodology, thesis structure' },
                  { id: 'assignment', label: 'Assignment Problem Solver Guide', icon: HelpCircle, desc: 'Step-by-step logic verification without plagiarism' },
                ].map(mode => {
                  const Icon = mode.icon;
                  const isSelected = aiMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setAiMode(mode.id as any)}
                      className={`w-full p-2.5 rounded-xl text-left transition border flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-600/20 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="text-xs font-bold block">{mode.label}</span>
                        <span className="text-[10px] text-slate-400 leading-tight block">{mode.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Starters */}
            {selectedModule?.aiPromptStarters && selectedModule.aiPromptStarters.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" /> Module Quick Prompts
                </span>
                <div className="space-y-1.5">
                  {selectedModule.aiPromptStarters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(starter)}
                      className="w-full p-2 rounded-xl text-left bg-slate-800/70 hover:bg-cyan-950/40 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-200 transition line-clamp-2"
                    >
                      💡 {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive AI Chat Workbench */}
          <div className="lg:col-span-8 flex flex-col h-[700px] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    SipArana Academic AI
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active Mode: {aiMode.toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Context: {activeUni.shortName} • {activeDegree?.shortTitle} • {selectedModule?.code || 'General'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMessages([messages[0]])}
                className="text-xs text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition"
                title="Clear Chat History"
              >
                Clear History
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none space-y-2'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700/60 pb-1.5 mb-2">
                          <span className="font-semibold text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Academic Analysis
                          </span>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      <div className="text-[10px] text-slate-400 text-right pt-1 opacity-70">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 rounded-tl-none">
                    <div className="flex items-center gap-2 text-xs text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      <span>Analyzing university curriculum & synthesising response...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask a question on ${selectedModule?.code || activeDegree?.code || 'Degree'} (e.g. derivations, algorithms, past questions)...`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isAiLoading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-600/30"
                >
                  <span>Ask AI</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM & MODULES BREAKDOWN */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                {activeDegree?.title} • Complete Curriculum
              </h3>
              <p className="text-xs text-slate-400">
                Official syllabus modules with prescribed textbooks, formulas, and AI prompt integrations.
              </p>
            </div>

            {/* Semester Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeDegree?.semesters.map(s => (
                <button
                  key={s.code}
                  onClick={() => setActiveSemesterCode(s.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeSemesterCode === s.code
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid for Selected Semester */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDegree?.semesters
              .find(s => s.code === activeSemesterCode)
              ?.modules.map(mod => (
                <div
                  key={mod.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-cyan-500/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                        {mod.code}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                          {mod.type}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                          {mod.credits} Credits
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">{mod.title}</h4>
                      {mod.titleSinhala && (
                        <p className="text-xs text-slate-400">{mod.titleSinhala}</p>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Syllabus Topics */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Key Syllabus Topics:
                      </span>
                      <ul className="space-y-1">
                        {mod.syllabusTopics.map((topic, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prescribed Textbooks */}
                    <div className="space-y-1 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Prescribed Textbooks & References:
                      </span>
                      <div className="space-y-1">
                        {mod.prescribedTextbooks.map((book, i) => (
                          <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{book}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleSelectModuleForAI(mod)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Tutor for this Module</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTES, PAST EXAM PAPERS & LAB SHEETS */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search lecture notes, exam papers..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['All', 'Lecture Notes', 'Past Exam Paper', 'Assignment Guide'].map(type => (
                <button
                  key={type}
                  onClick={() => setResourceTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    resourceTypeFilter === type
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNIVERSITY_RESOURCES_DATA
              .filter(r => resourceTypeFilter === 'All' || r.type === resourceTypeFilter)
              .filter(r => !resourceSearch || r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || r.moduleCode.toLowerCase().includes(resourceSearch.toLowerCase()))
              .map(res => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                        {res.moduleCode}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                        {res.type}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {res.title}
                    </h4>

                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Author: {res.author}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>Uploaded: {res.uploadDate}</span>
                        <span>Size: {res.fileSize}</span>
                        <span>Rating: ⭐ {res.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {res.downloadCount.toLocaleString()} student downloads
                    </span>
                    <button
                      onClick={() => alert(`Downloading "${res.title}" (${res.fileSize})`)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: GPA FORECASTER & CREDIT PLANNER */}
      {activeTab === 'gpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Calculator Table */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Semester GPA & Credit Forecaster</h3>
                <p className="text-xs text-slate-400">
                  Standard Sri Lankan University 4.0 Scale with credit weighting.
                </p>
              </div>
              <button
                onClick={handleAddGpaCourse}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1"
              >
                + Add Course
              </button>
            </div>

            <div className="space-y-2.5">
              {gpaCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
                >
                  <div className="col-span-6 sm:col-span-7">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => handleUpdateGpaCourse(idx, 'name', e.target.value)}
                      placeholder="Course Module Name"
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <select
                      value={course.credits}
                      onChange={(e) => handleUpdateGpaCourse(idx, 'credits', Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value={1}>1 Credit</option>
                      <option value={2}>2 Credits</option>
                      <option value={3}>3 Credits</option>
                      <option value={4}>4 Credits</option>
                      <option value={6}>6 Credits</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <select
                      value={course.grade}
                      onChange={(e) => handleUpdateGpaCourse(idx, 'grade', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none font-bold text-amber-300"
                    >
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleRemoveGpaCourse(idx)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: GPA Summary Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-950/40 border border-purple-800/40 p-6 rounded-3xl text-center space-y-3">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                Calculated Semester GPA
              </span>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                {calculatedGpa}
              </div>
              <p className="text-xs text-slate-300">
                Total Credit Load: <strong>{totalCredits} Credits</strong>
              </p>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
                <div className="flex justify-between">
                  <span>First Class Honours:</span>
                  <span className="font-bold text-emerald-400">&gt;= 3.70</span>
                </div>
                <div className="flex justify-between">
                  <span>Second Upper (2:1):</span>
                  <span className="font-bold text-blue-400">3.30 - 3.69</span>
                </div>
                <div className="flex justify-between">
                  <span>Second Lower (2:2):</span>
                  <span className="font-bold text-amber-400">3.00 - 3.29</span>
                </div>
                <div className="flex justify-between">
                  <span>General Pass:</span>
                  <span className="font-bold text-slate-400">2.00 - 2.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RESEARCH, THESIS & CITATION TOOLS */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                Undergraduate Research & Final Year Project (FYP) Hub
              </h3>
              <p className="text-xs text-slate-400">
                Structure your thesis, generate standard academic citations, and synthesize literature reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-teal-300 block">1. Literature Review Synthesizer</span>
                <p className="text-xs text-slate-400">
                  Formulate research questions, identify research gaps, and build comparative matrix tables.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('assistant');
                    setAiMode('research');
                    handleSendMessage(`Help me structure a Literature Review section for my degree (${activeDegree?.title}) covering contemporary methodologies and research gaps.`);
                  }}
                  className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 pt-1"
                >
                  Generate Outline with AI →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-cyan-300 block">2. IEEE / APA / Harvard Citation Helper</span>
                <p className="text-xs text-slate-400">
                  Instantly format journal articles, conference papers, and online datasets into strict bibliography standards.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('assistant');
                    setAiMode('research');
                    handleSendMessage(`Explain the exact IEEE and APA 7th Edition citation formatting guidelines with 3 examples of journal articles and conference proceedings.`);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 pt-1"
                >
                  Open Citation Assistant →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-purple-300 block">3. Thesis Proposal Reviewer</span>
                <p className="text-xs text-slate-400">
                  Verify research objectives, methodology rigor, system architecture diagrams, and testing benchmarks.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('assistant');
                    setAiMode('research');
                    handleSendMessage(`Provide a comprehensive Thesis Proposal Checklist for an undergraduate project in ${activeDegree?.title}.`);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 pt-1"
                >
                  Review Proposal Checklist →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Degree & University Switcher Modal */}
      {isSwitcherOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                Switch University & Degree Programme
              </h3>
              <button
                onClick={() => setIsSwitcherOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select University Institution:
                </label>
                <select
                  value={selectedUniId}
                  onChange={(e) => {
                    setSelectedUniId(e.target.value);
                    const uni = UNIVERSITIES_DATA.find(u => u.id === e.target.value);
                    if (uni?.faculties[0]?.degrees[0]) {
                      setSelectedDegreeCode(uni.faculties[0].degrees[0].code);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {UNIVERSITIES_DATA.map(uni => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Degree Programme:
                </label>
                <select
                  value={selectedDegreeCode}
                  onChange={(e) => setSelectedDegreeCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {activeUni.faculties.flatMap(f => f.degrees).map(deg => (
                    <option key={deg.code} value={deg.code}>
                      {deg.title} ({deg.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSwitcherOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const deg = activeUni.faculties.flatMap(f => f.degrees).find(d => d.code === selectedDegreeCode);
                  if (deg) {
                    setUniversityAndDegree(
                      activeUni.name,
                      deg.facultyName,
                      deg.title,
                      deg.code,
                      1,
                      1
                    );
                  }
                  setIsSwitcherOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
              >
                Apply & Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
