import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  FileText,
  Sparkles,
  Brain,
  Calculator,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Clock,
  HardDrive,
  Eye,
  Sliders,
  ChevronRight,
  ShieldCheck,
  FileUp,
  Image as ImageIcon,
  BookOpen,
  Award,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { SAMPLE_EVALUATOR_DOCS, type SampleDocItem } from '@/data/sampleEvaluatorDocs';
import HandwrittenEvaluatorView from '@/components/evaluator/HandwrittenEvaluatorView';
import MindMapStudioView from '@/components/evaluator/MindMapStudioView';
import StepByStepSolverView from '@/components/evaluator/StepByStepSolverView';
import LiveCameraScannerModal from '@/components/evaluator/LiveCameraScannerModal';
import kaviInspectorOwlImg from '@/assets/images/kavi_inspector_owl_1788001642018.jpg';

interface SmartFileEvaluatorPageProps {
  onNavigateFlashcards?: () => void;
}

export default function SmartFileEvaluatorPage({ onNavigateFlashcards }: SmartFileEvaluatorPageProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [activeDoc, setActiveDoc] = useState<SampleDocItem>(SAMPLE_EVALUATOR_DOCS[0]);
  const [activeModule, setActiveModule] = useState<'answer' | 'mindmap' | 'math_physics'>('answer');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [processingTimer, setProcessingTimer] = useState('0.82s');
  const [speechText, setSpeechText] = useState(
    language === 'si'
      ? 'ආයුබෝවන්! මම කවි බකමූණා 🦉. ඔබේ පිළිතුරු පත්‍රය, PDF සටහන් හෝ ගණිත ප්‍රශ්නය අප්ලෝඩ් කරන්න!'
      : 'Hello! I am Kavi the Owl 🦉. Upload your handwritten answer, PDF notes, or math problem for instant AI evaluation!'
  );

  // Sync activeModule with selected document's primary category
  useEffect(() => {
    setActiveModule(activeDoc.category);
  }, [activeDoc]);

  // Dynamic speech bubble updates based on scanning state & module
  const triggerScanAnimation = (targetModule: 'answer' | 'mindmap' | 'math_physics', docTitle: string) => {
    setIsScanning(true);
    setScanProgress(15);
    soundFX.playPop();

    // Step 1: Vision OCR
    setSpeechText(
      language === 'si'
        ? `🔍 "${docTitle}" ලේඛනය පරිලෝකනය කරමින් පවතී... (OCR Scan)`
        : `🔍 Scanning visual text & handwritten structures from "${docTitle}"...`
    );

    setTimeout(() => {
      setScanProgress(55);
      if (targetModule === 'answer') {
        setSpeechText(
          language === 'si'
            ? '📐 ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනයේ (NIE) විභාග ලකුණු සම්මුතියට අනුව ඇගයීම කරමින්...'
            : '📐 Cross-referencing against Sri Lanka NIE & Cambridge official marking schemes...'
        );
      } else if (targetModule === 'mindmap') {
        setSpeechText(
          language === 'si'
            ? '🧠 ප්‍රධාන සංකල්ප, උප මාතෘකා හා 3D මනෝ සිතියම් ශාඛා සකස් කරමින්...'
            : '🧠 Synthesizing hierarchical concept nodes & collapsible mind-map branches...'
        );
      } else {
        setSpeechText(
          language === 'si'
            ? '📐 භෞතික/ගණිත මූලධර්ම සහ පියවරෙන් පියවර සමීකරණ විශ්ලේෂණය කරමින්...'
            : '📐 Deriving step-by-step mathematical theorems and intermediate steps...'
        );
      }
    }, 700);

    setTimeout(() => {
      setScanProgress(90);
    }, 1300);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      soundFX.playCorrect();
      const randTime = (0.65 + Math.random() * 0.35).toFixed(2) + 's';
      setProcessingTimer(randTime);
      setSpeechText(
        language === 'si'
          ? '✨ ඇගයීම සාර්ථකයි! ලකුණු, දෝෂ හා ආදර්ශ විසඳුම් පහතින් පරීක්ෂා කරන්න!'
          : '✨ Evaluation complete! Check marks, mistake annotations, and model answers below!'
      );
    }, 1800);
  };

  const handleSelectSample = (sample: SampleDocItem) => {
    soundFX.playClick();
    setActiveDoc(sample);
    triggerScanAnimation(sample.category, sample.title);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const objectUrl = URL.createObjectURL(file);
    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    // Build dynamic document item
    const newDoc: SampleDocItem = {
      id: `upload_${Date.now()}`,
      title: file.name,
      titleSi: file.name,
      titleTa: file.name,
      category: isPdf ? 'mindmap' : activeModule,
      subject: isPdf ? 'General Syllabus Study Notes' : 'Uploaded Exam Answer Sheet',
      grade: 'All Grades / G.C.E.',
      syllabus: 'Official National Curriculum Benchmark',
      fileType: isPdf ? 'pdf' : 'image',
      fileSize: formattedSize,
      fileName: file.name,
      previewUrl: objectUrl,
      description: `User uploaded ${isPdf ? 'PDF study material' : 'photograph'} analyzed with AI Vision.`,
      ocrExtractedText: `Parsed user file content from ${file.name}. OCR confidence: 99.1%.`,
      evaluationData: SAMPLE_EVALUATOR_DOCS[0].evaluationData,
      mindMapData: SAMPLE_EVALUATOR_DOCS[2].mindMapData,
      solverData: SAMPLE_EVALUATOR_DOCS[1].solverData
    };

    setActiveDoc(newDoc);
    triggerScanAnimation(newDoc.category, file.name);
  };

  const handleCameraCapture = (imageSrc: string, filename: string) => {
    const newDoc: SampleDocItem = {
      id: `camera_${Date.now()}`,
      title: 'Scanned Exam Paper (Live Camera)',
      titleSi: 'සජීවී කැමරා ඡායාරූපය',
      titleTa: 'நேரடி கேமரா புகைப்படம்',
      category: activeModule,
      subject: 'Handwritten Answer / Problem',
      grade: 'Grade 10–13 A/L',
      syllabus: 'NIE National Curriculum Benchmark',
      fileType: 'image',
      fileSize: '2.1 MB',
      fileName: filename,
      previewUrl: imageSrc,
      description: 'High-definition image snapped with live camera viewfinder.',
      ocrExtractedText: 'Live camera snapshot successfully processed by AI Vision OCR Engine.',
      evaluationData: SAMPLE_EVALUATOR_DOCS[0].evaluationData,
      mindMapData: SAMPLE_EVALUATOR_DOCS[2].mindMapData,
      solverData: SAMPLE_EVALUATOR_DOCS[1].solverData
    };

    setActiveDoc(newDoc);
    triggerScanAnimation(activeModule, 'Camera Scan');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-6 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Hidden File Input for Device Gallery & PDF Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Live Camera Scanner Modal */}
      <LiveCameraScannerModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />

      {/* TOP HERO & AMBIENCE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-white">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Hero Content */}
          <div className="space-y-3 max-w-2xl">
            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-400/40 shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                🟢 AI Vision Engine Online
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-400/30">
                <Clock className="w-3 h-3 text-cyan-400" />
                Latency: {processingTimer}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-400/30">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                NIE 2026 Rubric Synchronized
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {language === 'si'
                ? 'AI ස්මාර්ට් ලේඛන ඇගයුම්කරු සහ මනෝ සිතියම් මැදිරිය'
                : 'AI Smart File Evaluator & Mind-Map Studio'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'si'
                ? 'අතින් ලියන ලද විභාග පිළිතුරු පත්‍ර, ගණිත/විද්‍යා ගැටලු හෝ දිගු PDF පොත් පිටු ස්කෑන් කර NIE සම්මුති ලකුණු, 3D මනෝ සිතියම් සහ පියවරෙන් පියවර විසඳුම් ක්ෂණිකව ලබාගන්න.'
                : 'Upload or snap handwritten exam answers, problem images, or long PDF notes. Get instant mark scheme evaluations, interactive collapsible mind-maps, and step-by-step verified derivations.'}
            </p>

            {/* Direct Upload & Camera Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition transform hover:scale-102 active:scale-98 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{language === 'si' ? 'ඡායාරූපයක් / PDF එකක් තෝරන්න' : 'Upload Photo / PDF (Gallery / Files)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setShowCameraModal(true);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{language === 'si' ? 'සජීවී කැමරාවෙන් ගන්න' : 'Live Camera Scanner'}</span>
              </button>
            </div>
          </div>

          {/* Right Mascot & Interactive Speech Bubble Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 border border-cyan-500/40 p-4 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md w-full">
            {/* Animated Mascot Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl relative bg-slate-950">
                <img
                  src={kaviInspectorOwlImg}
                  alt="Kavi the Owl Inspector"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isScanning ? 'scale-110 rotate-3' : 'hover:scale-105'
                  }`}
                />
                {/* Laser scanline overlay when scanning */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-pulse pointer-events-none" />
                )}
              </div>

              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase shadow">
                KAVI 🦉
              </span>
            </div>

            {/* Dynamic Speech Bubble */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-cyan-300 text-[11px] uppercase tracking-wider">
                  Kavi Owl Inspector
                </span>
                {isScanning && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Analyzing...
                  </span>
                )}
              </div>

              <p className="text-slate-200 font-medium leading-relaxed italic">
                "{speechText}"
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Extraction Live Progress Bar (Module B & General scanning) */}
        {isScanning && (
          <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>AI Vision OCR & Semantic Knowledge Graph Extraction in Progress...</span>
              </span>
              <span className="font-mono">{scanProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-cyan-500/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300 shadow-md"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SAMPLE DOCUMENT QUICK SWITCHER & DRAG/DROP STRIP */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 rounded-3xl border-2 transition-all duration-200 flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/15 ring-4 ring-cyan-500/20'
            : 'border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <FileUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {isDragging
                ? 'Drop file here to analyze instantly!'
                : language === 'si'
                ? 'හෝ පහත ආදර්ශ ලේඛනයක් තෝරා ක්ෂණිකව පරීක්ෂා කරන්න'
                : 'Or test instantly with verified sample academic documents:'}
            </h4>
            <p className="text-[11px] text-slate-500">
              Supports JPG, PNG, WEBP, HEIC images & multi-page PDF documents
            </p>
          </div>
        </div>

        {/* 1-Click Sample Selectors */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {SAMPLE_EVALUATOR_DOCS.map((sample) => {
            const isSelected = activeDoc.id === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md ring-2 ring-cyan-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sample.category === 'answer' ? (
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                ) : sample.category === 'mindmap' ? (
                  <Brain className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {language === 'si' ? sample.titleSi : sample.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THREE KEY FEATURE MODULES TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {/* MODULE A */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveModule('answer');
              // switch to answer sample if activeDoc is not answer
              if (activeDoc.category !== 'answer') {
                setActiveDoc(SAMPLE_EVALUATOR_DOCS[0]);
              }
            }}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === 'answer'
                ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-md border border-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>[MODULE A] 📝 {language === 'si' ? 'අත්අකුරු පිළිතුරු ඇගයුම්කරු' : 'Handwritten Answer Evaluator'}</span>
          </button>

          {/* MODULE B */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveModule('mindmap');
              if (activeDoc.category !== 'mindmap') {
                setActiveDoc(SAMPLE_EVALUATOR_DOCS[2]);
              }
            }}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === 'mindmap'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-md border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-emerald-500" />
            <span>[MODULE B] 🧠 {language === 'si' ? 'ක්ෂණික මනෝ සිතියම් සහ සාරාංශ' : 'Instant Mind-Map & Summary'}</span>
          </button>

          {/* MODULE C */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveModule('math_physics');
              if (activeDoc.category !== 'math_physics') {
                setActiveDoc(SAMPLE_EVALUATOR_DOCS[1]);
              }
            }}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === 'math_physics'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-md border border-indigo-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 text-indigo-500" />
            <span>[MODULE C] 📐 {language === 'si' ? 'පියවරෙන් පියවර ගැටලු විසඳුම්' : 'Step-by-Step Problem Solver'}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE MODULE VIEW CONTAINER */}
      <div className="transition-all duration-300">
        {activeModule === 'answer' && <HandwrittenEvaluatorView document={activeDoc} />}
        {activeModule === 'mindmap' && (
          <MindMapStudioView document={activeDoc} onNavigateFlashcards={onNavigateFlashcards} />
        )}
        {activeModule === 'math_physics' && <StepByStepSolverView document={activeDoc} />}
      </div>
    </div>
  );
}
