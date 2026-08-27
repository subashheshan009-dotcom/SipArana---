import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Zap,
  GraduationCap,
  MessageSquare,
  Bot,
  User,
  FileText,
  UploadCloud,
  AlertCircle,
  X,
  Layers,
  Video,
  FileSearch,
  GitFork,
  Award,
  PenTool,
  CheckCircle2,
  Play,
  Share2,
  Download,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';
import { soundFX } from '@/utils/audioUtils';

type CoreFeatureTab =
  | 'chat_tutor'
  | 'content_quiz'
  | 'multi_format'
  | 'doc_analyzer'
  | 'mindmap_diagram'
  | 'model_paper'
  | 'essay_evaluator';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  subjectTag?: string;
  attachedImage?: string;
  attachedPdfName?: string;
}

export default function AITutorPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<CoreFeatureTab>('content_quiz');

  // Grade & Subject Context
  const [selectedGrade, setSelectedGrade] = useState<number | string>(profile?.grade || 12);
  const [selectedStream, setSelectedStream] = useState<string>(profile?.stream || 'Physical Science (Maths)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Combined Mathematics');
  const [targetTier, setTargetTier] = useState<'grade_5' | 'gce_ol' | 'gce_al' | 'university'>(
    profile?.studentCategory === 'University'
      ? 'university'
      : profile?.grade === 5
      ? 'grade_5'
      : profile?.grade && profile.grade <= 11
      ? 'gce_ol'
      : 'gce_al'
  );

  // Core Functionality 1: Content & Quiz Generation State
  const [contentTopic, setContentTopic] = useState('');
  const [contentSubType, setContentSubType] = useState<'all' | 'summary' | 'flashcards' | 'mcq'>('all');
  const [contentOutput, setContentOutput] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Core Functionality 2: Multi-Format Adaptation State
  const [multiFormatInput, setMultiFormatInput] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'plain_text' | 'audio_script' | 'video_script'>('all');
  const [multiFormatOutput, setMultiFormatOutput] = useState<string>('');
  const [isAdaptingFormat, setIsAdaptingFormat] = useState(false);
  const [isPlayingAudioScript, setIsPlayingAudioScript] = useState(false);

  // Core Functionality 3: Document & PDF Analyzer State
  const [docInputText, setDocInputText] = useState('');
  const [docType, setDocType] = useState<'Research Paper' | 'Lecture Slides' | 'Chapter Document'>('Chapter Document');
  const [docOutput, setDocOutput] = useState<string>('');
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);

  // Core Functionality 4: Visual Mind Map & Diagram Concept State
  const [mindmapTopic, setMindmapTopic] = useState('');
  const [mindmapOutput, setMindmapOutput] = useState<string>('');
  const [isGeneratingMindmap, setIsGeneratingMindmap] = useState(false);

  // Core Functionality 5: Exam & Model Paper Generator State
  const [examTopic, setExamTopic] = useState('');
  const [examStandard, setExamStandard] = useState<'Grade 5 Scholarship' | 'G.C.E. O/L' | 'G.C.E. A/L' | 'University Semester Exam'>('G.C.E. A/L');
  const [examPaperOutput, setExamPaperOutput] = useState<string>('');
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);

  // Core Functionality 6: Essay & Answer Evaluator State
  const [essayQuestion, setEssayQuestion] = useState('');
  const [essayAnswer, setEssayAnswer] = useState('');
  const [essayMaxMarks, setEssayMaxMarks] = useState<number>(20);
  const [essayOutput, setEssayOutput] = useState<string>('');
  const [isEvaluatingEssay, setIsEvaluatingEssay] = useState(false);

  // Chat & Voice Tutor State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `ආයුබෝවන් ${profile?.name || 'ශිෂ්‍යයා'}! මම සිප්අරණ AI Core (Educational AI Core). ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (5 වසර ශිෂ්‍යත්වය, O/L, A/L විද්‍යා/ගණිත/කලා/වාණිජ/තාක්ෂණවේද) මෙන්ම විශ්වවිද්‍යාල මට්ටමේ ඕනෑම පාඩමක් විග්‍රහ කිරීමට, ප්‍රශ්න පත්‍ර හැදීමට, රචනා ඇගයීමට සහ කෙටි සටහන් ලබා ගැනීමට ඉහත Core Tools භාවිතා කරන්න! 🚀📚`,
      timestamp: 'Just now',
      subjectTag: 'General'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat]);

  // Adjust default exam standard when targetTier changes
  const handleTierChange = (tier: 'grade_5' | 'gce_ol' | 'gce_al' | 'university') => {
    setTargetTier(tier);
    if (tier === 'grade_5') {
      setSelectedGrade(5);
      setSelectedStream('Grade 5 Scholarship');
      setSelectedSubject('පරිසරය හා ගණිතය (Scholarship Core)');
      setExamStandard('Grade 5 Scholarship');
    } else if (tier === 'gce_ol') {
      setSelectedGrade(11);
      setSelectedStream('General O/L');
      setSelectedSubject('Science (විද්‍යාව)');
      setExamStandard('G.C.E. O/L');
    } else if (tier === 'university') {
      setSelectedGrade('University');
      setSelectedStream('Engineering & Computing');
      setSelectedSubject('Data Structures & Algorithms');
      setExamStandard('University Semester Exam');
    } else {
      setSelectedGrade(12);
      setSelectedStream('Physical Science (Maths)');
      setSelectedSubject('Combined Mathematics');
      setExamStandard('G.C.E. A/L');
    }
    soundFX.playCorrect();
  };

  // Helper API Caller for the 6 Core Features
  const executeEducationalCoreAPI = async (
    feature: string,
    inputContent: string,
    additionalParams: Record<string, any> = {}
  ) => {
    const response = await fetch('/api/gemini/educational-core', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature,
        inputContent,
        grade: selectedGrade,
        stream: selectedStream,
        subject: selectedSubject,
        targetTier,
        language: language || 'auto',
        additionalParams
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate response');
    }
    return data.text as string;
  };

  // 1. Generate Content & Quiz
  const handleGenerateContentQuiz = async () => {
    if (!contentTopic.trim()) return;
    setIsGeneratingContent(true);
    try {
      const res = await executeEducationalCoreAPI('content_quiz', contentTopic, {
        subType: contentSubType
      });
      setContentOutput(res);
      addXP(30);
      soundFX.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
    } catch (err: any) {
      setContentOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // 2. Adapt Multi-Format Content
  const handleAdaptMultiFormat = async () => {
    if (!multiFormatInput.trim()) return;
    setIsAdaptingFormat(true);
    try {
      const res = await executeEducationalCoreAPI('multi_format', multiFormatInput, {
        targetFormat: selectedFormat
      });
      setMultiFormatOutput(res);
      addXP(30);
      soundFX.playLevelUp();
    } catch (err: any) {
      setMultiFormatOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsAdaptingFormat(false);
    }
  };

  // Play Audio Script via Web Speech
  const handlePlayAudioVoiceover = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }
    if (isPlayingAudioScript) {
      window.speechSynthesis.cancel();
      setIsPlayingAudioScript(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.lang = language === 'si' ? 'si-LK' : 'en-US';
    utterance.onend = () => setIsPlayingAudioScript(false);
    utterance.onerror = () => setIsPlayingAudioScript(false);
    setIsPlayingAudioScript(true);
    window.speechSynthesis.speak(utterance);
  };

  // 3. Analyze Document & PDF
  const handleAnalyzeDocument = async () => {
    if (!docInputText.trim()) return;
    setIsAnalyzingDoc(true);
    try {
      const res = await executeEducationalCoreAPI('doc_analyzer', docInputText, {
        docType
      });
      setDocOutput(res);
      addXP(40);
      soundFX.playLevelUp();
    } catch (err: any) {
      setDocOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // 4. Generate Visual Mind Map & Diagram Concept
  const handleGenerateMindmap = async () => {
    if (!mindmapTopic.trim()) return;
    setIsGeneratingMindmap(true);
    try {
      const res = await executeEducationalCoreAPI('mindmap_diagram', mindmapTopic);
      setMindmapOutput(res);
      addXP(35);
      soundFX.playLevelUp();
    } catch (err: any) {
      setMindmapOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsGeneratingMindmap(false);
    }
  };

  // 5. Generate Exam Model Paper
  const handleGenerateExamPaper = async () => {
    const topic = examTopic.trim() || selectedSubject;
    setIsGeneratingExam(true);
    try {
      const res = await executeEducationalCoreAPI('model_paper', topic, {
        examStandard
      });
      setExamPaperOutput(res);
      addXP(50);
      soundFX.playLevelUp();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });
    } catch (err: any) {
      setExamPaperOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsGeneratingExam(false);
    }
  };

  // 6. Evaluate Essay & Written Answer
  const handleEvaluateEssay = async () => {
    if (!essayAnswer.trim()) return;
    setIsEvaluatingEssay(true);
    try {
      const res = await executeEducationalCoreAPI('essay_evaluator', essayAnswer, {
        questionPrompt: essayQuestion || 'Explain the central concepts, theoretical mechanisms, and examination applications of the topic.',
        maxMarks: essayMaxMarks
      });
      setEssayOutput(res);
      addXP(45);
      soundFX.playLevelUp();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err: any) {
      setEssayOutput(`⚠️ Error: ${err.message}`);
      soundFX.playIncorrect();
    } finally {
      setIsEvaluatingEssay(false);
    }
  };

  // Chat Q&A Sender
  const handleSendChatMessage = async (promptToSend?: string) => {
    const query = promptToSend || inputQuery.trim();
    if (!query && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedImage: attachedImage || undefined,
      attachedPdfName: attachedFileName || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAttachedImage(null);
    setAttachedFileName(null);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/gemini/school-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          grade: selectedGrade,
          subject: selectedSubject,
          stream: selectedStream,
          medium: profile?.medium || 'Sinhala'
        })
      });
      const data = await response.json();
      const aiResponseText = data.text || 'Unable to retrieve answer. Please try again.';

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subjectTag: selectedSubject
      };
      setMessages((prev) => [...prev, aiMsg]);
      addXP(20);
      soundFX.playCorrect();
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `### 📚 සිප්අරණ ගුරු සහකාර (SipArana Guru Bot)\n\n**විෂය:** ${selectedSubject} • ${selectedGrade} ශ්‍රේණිය\n\nඔබ ඇසූ ප්‍රශ්නය: "${query}"\n\n1. **ප්‍රධාන සිද්ධාන්තය:** ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (Guru Potha) මෙම ඒකකයට අදාළ මූලික නීති සහ සූත්‍ර නිවැරදිව භාවිත කරන්න.\n2. **විභාග උපදෙස:** පසුගිය වසරවල ප්‍රශ්න පත්‍රවල (2019-2024) මෙවැනි ගැටලු පියවරෙන් පියවර ලියා ලකුණු ලබා ගැනීමේ ක්‍රමවේදය (Marking Scheme) අනුගමනය කරන්න.\n3. **ප්‍රායෝගික නිදසුන:** විද්‍යාත්මක හෝ ගණිතමය ඒකක (SI Units) සැමවිටම නිවැරදිව සඳහන් කරන්න.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subjectTag: selectedSubject
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Voice Recognition (Web Speech API)
  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Speech Recognition is not supported by your browser. Please type your question.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Copy helper
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playCorrect();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // File upload processing
  const processIncomingFile = (file: File) => {
    setFileError(null);
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size is larger than 10MB. Please attach a smaller file.');
      return;
    }
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');

    if (!isImage && !isPdf && !isText) {
      setFileError('Supported files: Images (JPG, PNG), PDFs, or Text documents.');
      setShowPermissionModal(true);
      return;
    }

    if (isText) {
      const textReader = new FileReader();
      textReader.onload = () => {
        const content = textReader.result as string;
        setDocInputText(content);
        setMultiFormatInput(content);
        soundFX.playCorrect();
      };
      textReader.readAsText(file);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
      setAttachedFileName(file.name);
      soundFX.playCorrect();
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processIncomingFile(file);
    if (e.target) e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processIncomingFile(file);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* HEADER BANNER: Core Educational AI Suite */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SIPARANA Advanced Educational AI Core (6 Core Engines)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            අධ්‍යාපනික AI පද්ධතිය (Educational AI Core Studio)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Curriculum-grounded pedagogical AI core tailored specifically for Sri Lankan students from Grade 5 Scholarship, G.C.E. O/L, G.C.E. A/L (Science, Maths, Commerce, Arts, Tech) to University level.
          </p>
        </div>

        {/* Grade-Adaptive Controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-3 relative z-10 text-xs w-full md:w-auto">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">
            Target Grade Level (ශ්‍රේණිය තෝරන්න):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleTierChange('grade_5')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                targetTier === 'grade_5'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-102'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800'
              }`}
            >
              🦉 5 ශිෂ්‍යත්වය
            </button>
            <button
              type="button"
              onClick={() => handleTierChange('gce_ol')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                targetTier === 'gce_ol'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md scale-102'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800'
              }`}
            >
              📘 G.C.E. O/L
            </button>
            <button
              type="button"
              onClick={() => handleTierChange('gce_al')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                targetTier === 'gce_al'
                  ? 'bg-blue-400 text-slate-950 border-blue-300 shadow-md scale-102'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800'
              }`}
            >
              🎓 G.C.E. A/L
            </button>
            <button
              type="button"
              onClick={() => handleTierChange('university')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                targetTier === 'university'
                  ? 'bg-indigo-400 text-slate-950 border-indigo-300 shadow-md scale-102'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800'
              }`}
            >
              🏛️ University
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-blue-200">
            <span className="font-semibold">Subject: {selectedSubject}</span>
            <span className="font-bold text-amber-300">100% Verified Benchmarks</span>
          </div>
        </div>
      </div>

      {/* CORE 6 FUNCTIONALITY NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          
          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('content_quiz');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'content_quiz'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Content & Quiz Gen</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('multi_format');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'multi_format'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>2. Multi-Format Adapter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('doc_analyzer');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'doc_analyzer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>3. Document & PDF Analyzer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('mindmap_diagram');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'mindmap_diagram'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>4. Visual Mind Map</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('model_paper');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'model_paper'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>5. Exam & Model Papers</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('essay_evaluator');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'essay_evaluator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>6. Essay Feedback Evaluator</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playCorrect();
              setActiveTab('chat_tutor');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'chat_tutor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>🎙️ AI Guru Voice Chat</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AUTOMATED CONTENT & QUIZ GENERATION */}
      {/* ========================================================================= */}
      {activeTab === 'content_quiz' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  1. Automated Content & Quiz Generation
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Generate structured summaries with bold key concepts, interactive flashcards, and 4-option MCQs with explanations.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['all', 'summary', 'flashcards', 'mcq'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setContentSubType(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    contentSubType === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Enter Lesson Name or Topic (පාඩම හෝ මාතෘකාව):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                placeholder={
                  targetTier === 'grade_5'
                    ? 'උදා: ශාක වල ප්‍රභාසංශ්ලේෂණය / කඩදාසි කැපුම් රටා'
                    : targetTier === 'university'
                    ? 'e.g. Dynamic Programming & Memoization / Organic Reaction Mechanisms'
                    : 'උදා: නිව්ටන්ගේ දෙවන නියමය (Newton\'s 2nd Law) / දෛශික (Vectors)'
                }
                className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleGenerateContentQuiz}
                disabled={isGeneratingContent || !contentTopic.trim()}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
              >
                {isGeneratingContent ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Pack...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Content & Quiz</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 self-center">Popular Topics:</span>
              {[
                "Newton's Laws of Motion",
                "Organic Chemistry Reactions",
                "Photosynthesis & Respiration",
                "Calculus Integration by Parts",
                "Communication Harold Lasswell Model"
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setContentTopic(t)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {contentOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    Generated Study & Quiz Output
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText('content_output', contentOutput)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100"
                >
                  {copiedId === 'content_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'content_output' ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {contentOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MULTI-FORMAT CONTENT ADAPTATION */}
      {/* ========================================================================= */}
      {activeTab === 'multi_format' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Video className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  2. Multi-Format Content Adaptation
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Convert lesson text into Plain Study Notes, Conversational Audio TTS Script, and Short Video Scene-by-Scene Scripts (Reels/Shorts).
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['all', 'plain_text', 'audio_script', 'video_script'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {fmt.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Input Lesson Content or Paste Paragraphs (පාඩමේ සටහන් ඇතුළත් කරන්න):
            </label>
            <textarea
              rows={4}
              value={multiFormatInput}
              onChange={(e) => setMultiFormatInput(e.target.value)}
              placeholder="Paste lesson text, textbook paragraph, or summarize key points here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Targeting {selectedGrade} • {selectedSubject}</span>
              <button
                type="button"
                onClick={handleAdaptMultiFormat}
                disabled={isAdaptingFormat || !multiFormatInput.trim()}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
              >
                {isAdaptingFormat ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adapting Formats...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Transform into Plain, Audio & Video</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {multiFormatOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    Multi-Format Adapted Scripts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayAudioVoiceover(multiFormatOutput)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100"
                  >
                    {isPlayingAudioScript ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudioScript ? 'Stop TTS' : 'Listen Audio Script'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText('format_output', multiFormatOutput)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === 'format_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'format_output' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {multiFormatOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DOCUMENT & PDF ANALYZER */}
      {/* ========================================================================= */}
      {activeTab === 'doc_analyzer' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                  <FileSearch className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  3. Document & PDF Analyzer
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Deep academic extraction from Lecture Slides, Research Papers, and Chapter PDFs with Key Findings, Methodologies, Q&A pairs, and Revision points.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {(['Chapter Document', 'Lecture Slides', 'Research Paper'] as const).map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => setDocType(dt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    docType === dt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`p-6 rounded-3xl border-2 border-dashed transition text-center flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Drag & Drop Document / Slides / Notes (or Paste text below)
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 px-4 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 hover:bg-slate-100 cursor-pointer"
              >
                Browse File (PDF / TXT / Image)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <textarea
              rows={5}
              value={docInputText}
              onChange={(e) => setDocInputText(e.target.value)}
              placeholder="Or paste the full text of the chapter, lecture slides transcript, or research excerpt here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleAnalyzeDocument}
                disabled={isAnalyzingDoc || !docInputText.trim()}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
              >
                {isAnalyzingDoc ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting Insights...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Deep Document Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {docOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Analysis Report & Q&A Synthesis
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('doc_output', docOutput)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'doc_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'doc_output' ? 'Copied' : 'Copy Report'}</span>
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {docOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUAL MIND MAP & DIAGRAM CONCEPT GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'mindmap_diagram' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold">
                <GitFork className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                4. Visual Mind Map & Diagram Concept Generator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hierarchical node trees, Mermaid.js code schemas, and step-by-step visual drawing guides for memory retention.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Concept to Visualize (දෘශ්‍ය සිතියම අවශ්‍ය මාතෘකාව):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={mindmapTopic}
                onChange={(e) => setMindmapTopic(e.target.value)}
                placeholder="e.g. Organic Chemistry Reaction Pathways / Cell Cycle & Mitosis / DBMS Normalization"
                className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleGenerateMindmap}
                disabled={isGeneratingMindmap || !mindmapTopic.trim()}
                className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {isGeneratingMindmap ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mapping Nodes...</span>
                  </>
                ) : (
                  <>
                    <GitFork className="w-4 h-4" />
                    <span>Generate Mind Map & Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {mindmapOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Mind Map Blueprint & Node Tree
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('mindmap_output', mindmapOutput)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'mindmap_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'mindmap_output' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {mindmapOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EXAM & MODEL PAPER GENERATION */}
      {/* ========================================================================= */}
      {activeTab === 'model_paper' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">
                  <Award className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  5. Exam & Model Paper Generation (with Marking Schemes)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Authentic model question papers aligned with Grade 5 Scholarship, G.C.E. O/L, G.C.E. A/L, and University benchmarks with official point schemes.
              </p>
            </div>
            <select
              value={examStandard}
              onChange={(e) => setExamStandard(e.target.value as any)}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Grade 5 Scholarship">Grade 5 Scholarship (ශිෂ්‍යත්ව විභාගය)</option>
              <option value="G.C.E. O/L">G.C.E. O/L Standard</option>
              <option value="G.C.E. A/L">G.C.E. A/L Standard (Maths/Bio/Commerce/Arts/Tech)</option>
              <option value="University Semester Exam">University Semester Exam</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Exam Subject & Target Topics (විභාග විෂය සහ ඒකක):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={examTopic}
                onChange={(e) => setExamTopic(e.target.value)}
                placeholder="e.g. Combined Maths Integration & Vectors / A/L Economics Macro Policy / 5 වසර පරිසරය"
                className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleGenerateExamPaper}
                disabled={isGeneratingExam}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {isGeneratingExam ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling Paper...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Generate Model Paper + Marking Scheme</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {examPaperOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Model Examination Paper & Official Marking Key
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('exam_output', examPaperOutput)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'exam_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'exam_output' ? 'Copied Paper' : 'Copy'}</span>
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {examPaperOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ESSAY & ANSWER FEEDBACK EVALUATOR */}
      {/* ========================================================================= */}
      {activeTab === 'essay_evaluator' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                  <PenTool className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  6. Essay & Answer Feedback Evaluator
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Evaluate 15-20 mark essays and written coursework: Estimated Score, Key Strengths, Missing Points, and Rewritten Model Sample Answer.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Max Marks:</span>
              <select
                value={essayMaxMarks}
                onChange={(e) => setEssayMaxMarks(Number(e.target.value))}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
              >
                <option value={10}>10 Marks</option>
                <option value={15}>15 Marks</option>
                <option value={20}>20 Marks (Standard Essay)</option>
                <option value={25}>25 Marks (A/L Structured)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Question / Assignment Prompt (ප්‍රශ්නය):
              </label>
              <input
                type="text"
                value={essayQuestion}
                onChange={(e) => setEssayQuestion(e.target.value)}
                placeholder="e.g. Explain Harold Lasswell's communication model with real-world examples and critique its linear nature."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Student's Written Answer (ශිෂ්‍යයා ලියූ පිළිතුර මෙතැනට ඇතුළත් කරන්න):
              </label>
              <textarea
                rows={5}
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                placeholder="Paste the student's essay answer, handwritten OCR text, or assignment draft here..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleEvaluateEssay}
                disabled={isEvaluatingEssay || !essayAnswer.trim()}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-sm"
              >
                {isEvaluatingEssay ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Grading & Evaluating...</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" />
                    <span>Evaluate Essay & Generate Model Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {essayOutput && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Academic Evaluation & Rubric Feedback
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('essay_output', essayOutput)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'essay_output' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'essay_output' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {essayOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LIVE INTERACTIVE CHAT & VOICE TUTOR */}
      {/* ========================================================================= */}
      {activeTab === 'chat_tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 flex flex-col h-[650px] shadow-sm overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    SipArana Live AI Guru Bot
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Interactive Voice & Markdown Tutor
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessages([messages[0]])}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {msg.attachedImage && (
                        <div className="mb-3 rounded-xl overflow-hidden max-h-48 border border-white/20">
                          <img
                            src={msg.attachedImage}
                            alt="Attached question"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      <div
                        className={`mt-2.5 pt-2 flex items-center justify-between text-[10px] ${
                          isUser ? 'text-blue-200 border-t border-blue-500/50' : 'text-slate-400 border-t border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (speakingMessageId === msg.id) {
                                  window.speechSynthesis?.cancel();
                                  setSpeakingMessageId(null);
                                } else {
                                  window.speechSynthesis?.cancel();
                                  const utt = new SpeechSynthesisUtterance(msg.text.replace(/[*#_`]/g, ''));
                                  utt.lang = language === 'si' ? 'si-LK' : 'en-US';
                                  utt.onend = () => setSpeakingMessageId(null);
                                  setSpeakingMessageId(msg.id);
                                  window.speechSynthesis?.speak(utt);
                                }
                              }}
                              className="hover:text-amber-500 cursor-pointer flex items-center gap-1"
                            >
                              {speakingMessageId === msg.id ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
                              <span>{speakingMessageId === msg.id ? 'Stop' : 'Listen'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-blue-500 cursor-pointer flex items-center gap-1"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoadingChat && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing official curriculum benchmarks & calculating steps...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              {attachedFileName && (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span className="truncate">Attached: {attachedFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedFileName(null);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse border-red-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer flex-shrink-0"
                  title="Attach Question Image or PDF"
                >
                  <UploadCloud className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Type any exam question, past paper problem, or formula in Sinhala/English..."
                  className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={isLoadingChat || (!inputQuery.trim() && !attachedImage)}
                  className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold cursor-pointer transition shadow-xs flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Subject Shortcuts & Fast Prompts */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Exam Revision Queries</span>
              </h4>
              <div className="space-y-2">
                {[
                  "Explain Newton's Second Law with F=ma derivation in Sinhala",
                  "What is Markovnikov's rule in Organic Chemistry?",
                  "Derive the quadratic formula using completing the square",
                  "Explain Harold Lasswell's communication model components",
                  "How is university Z-score calculated in Sri Lanka?"
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendChatMessage(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-blue-500/10 p-5 rounded-3xl border-2 border-amber-300/40 dark:border-amber-700/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦉</span>
                <h4 className="text-xs font-black text-amber-950 dark:text-amber-300">
                  Zero Hallucination Guarantee
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                All answers, model marking schemes, and syllabus breakdowns are cross-checked against official Sri Lankan NIE Teacher Guides and Department of Examinations past paper benchmarks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Permission helper modal */}
      {showPermissionModal && (
        <FilePermissionHelperModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          type="upload"
        />
      )}
    </div>
  );
}
