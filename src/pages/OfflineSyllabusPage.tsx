import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  FileText,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HardDriveDownload,
  Search,
  Eye,
  FileCheck,
  Zap,
  Printer,
  ShieldCheck,
  FolderDown,
  Trash2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  Calculator,
  Dna,
  TrendingUp,
  Layers,
  Cpu,
  Terminal,
  Briefcase,
  Flame,
  Percent,
  Landmark,
  Code,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  Award
} from 'lucide-react';
import { SYLLABUS_CATALOG_DATA, type SyllabusItem } from '@/data/syllabusData';
import {
  QUIZ_CATEGORIES,
  QUIZ_STREAMS,
  QUIZ_SUBJECTS,
  type QuizCategory,
  type QuizStream,
  type QuizSubject
} from '@/data/quizData';
import { generateSyllabusPDF } from '@/utils/pdfGenerator';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import SyllabusGuideMascot from '@/components/SyllabusGuideMascot';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';
import {
  isDailyActionClaimedToday,
  recordDailyActionClaim,
  triggerDailyLockToast
} from '@/utils/dailyXpLockEngine';

type WizardStep = 'category' | 'stream' | 'subject' | 'documents';

export default function OfflineSyllabusPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // Step-by-step navigation state
  const [currentStep, setCurrentStep] = useState<WizardStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedStream, setSelectedStream] = useState<QuizStream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<QuizSubject | null>(null);

  // Global tab switch: 'step_flow' vs 'my_offline_vault'
  const [mainView, setMainView] = useState<'step_flow' | 'my_offline_vault'>('step_flow');

  // Filter inside documents list (Step 4 or Vault)
  const [docFilterType, setDocFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Document Viewer Modal State
  const [readingItem, setReadingItem] = useState<SyllabusItem | null>(null);
  const [readerPage, setReaderPage] = useState<number>(1);
  const [readerZoom, setReaderZoom] = useState<number>(100);
  const [readerDarkMode, setReaderDarkMode] = useState<boolean>(false);
  const [readerSearch, setReaderSearch] = useState<string>('');

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [batchDownloading, setBatchDownloading] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | undefined>(undefined);
  const [activeDownloadName, setActiveDownloadName] = useState<string | undefined>(undefined);
  const [cachedIds, setCachedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('siparana_cached_documents');
      return saved
        ? JSON.parse(saved)
        : {
            syl_al_maths_syllabus: true,
            syl_al_physics_resource: true,
            syl_al_media_syllabus: true,
            syl_al_media_pastpapers: true
          };
    } catch {
      return { syl_al_maths_syllabus: true, syl_al_media_syllabus: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('siparana_cached_documents', JSON.stringify(cachedIds));
  }, [cachedIds]);

  // Icon mapping helper
  const renderIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Dna': return <Dna className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Percent': return <Percent className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'Code': return <Code className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'FileText': return <FileText className={className} />;
      default: return <FileText className={className} />;
    }
  };

  // Filter streams matching selected category
  const availableStreams = selectedCategory
    ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
    : [];

  // Filter subjects matching selected stream & category
  const availableSubjects = selectedStream
    ? QUIZ_SUBJECTS.filter((sub) => sub.streamId === selectedStream.id)
    : [];

  // Filter syllabus documents matching selected subject
  const subjectDocuments = selectedSubject
    ? SYLLABUS_CATALOG_DATA.filter((doc) => {
        if (doc.subjectId === selectedSubject.id) return true;
        // Fallback matching by name or stream
        if (doc.streamId === selectedStream?.id && doc.subjectName.toLowerCase() === selectedSubject.name.toLowerCase()) return true;
        return false;
      })
    : [];

  // Apply search and fileType filter in Step 4
  const filteredDocuments = subjectDocuments.filter((doc) => {
    if (docFilterType !== 'All' && doc.fileType !== docFilterType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.titleSinhala.toLowerCase().includes(q) ||
      doc.subjectName.toLowerCase().includes(q) ||
      doc.subjectSinhala.toLowerCase().includes(q) ||
      doc.summarySinhala.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q)
    );
  });

  // Filter offline vault items
  const allOfflineDocuments = SYLLABUS_CATALOG_DATA.filter((doc) => cachedIds[doc.id]);
  const filteredOfflineVault = allOfflineDocuments.filter((doc) => {
    if (docFilterType !== 'All' && doc.fileType !== docFilterType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.titleSinhala.toLowerCase().includes(q) ||
      doc.subjectName.toLowerCase().includes(q) ||
      doc.subjectSinhala.toLowerCase().includes(q)
    );
  });

  const cachedCount = Object.values(cachedIds).filter(Boolean).length;
  const estimatedOfflineSizeMb = (cachedCount * 4.8).toFixed(1);

  // Step 1: Select Category
  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSearchQuery('');
    setDocFilterType('All');

    const matchingStreams = QUIZ_STREAMS.filter((s) => s.categoryId === category.id);
    if (matchingStreams.length === 1) {
      setSelectedStream(matchingStreams[0]);
      setCurrentStep('subject');
    } else {
      setCurrentStep('stream');
    }
  };

  // Step 2: Select Stream
  const handleSelectStream = (stream: QuizStream) => {
    setSelectedStream(stream);
    setSelectedSubject(null);
    setSearchQuery('');
    setDocFilterType('All');
    setCurrentStep('subject');
  };

  // Step 3: Select Subject
  const handleSelectSubject = (subject: QuizSubject) => {
    setSelectedSubject(subject);
    setSearchQuery('');
    setDocFilterType('All');
    setCurrentStep('documents');
  };

  // Back Navigation
  const handleGoBack = () => {
    if (currentStep === 'documents') {
      setCurrentStep('subject');
      setSelectedSubject(null);
    } else if (currentStep === 'subject') {
      const matchingStreams = selectedCategory
        ? QUIZ_STREAMS.filter((s) => s.categoryId === selectedCategory.id)
        : [];
      if (matchingStreams.length === 1) {
        setCurrentStep('category');
        setSelectedCategory(null);
        setSelectedStream(null);
      } else {
        setCurrentStep('stream');
        setSelectedStream(null);
      }
    } else if (currentStep === 'stream') {
      setCurrentStep('category');
      setSelectedCategory(null);
    }
  };

  // Reset entire flow
  const handleResetFlow = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedStream(null);
    setSelectedSubject(null);
    setSearchQuery('');
    setDocFilterType('All');
    setMainView('step_flow');
  };

  const handleDownloadPDF = (item: SyllabusItem) => {
    setDownloadingId(item.id);
    const userKey = profile?.email || profile?.id || 'guest_user';
    const actionKey = `syllabus_download_${item.id}`;
    const isClaimedToday = isDailyActionClaimedToday(actionKey, userKey);

    setTimeout(() => {
      const res = generateSyllabusPDF(item, profile?.name || 'SipArana Student');
      setDownloadingId(null);
      setCachedIds((prev) => ({ ...prev, [item.id]: true }));

      if (res && (!res.success || res.isPopupBlocked)) {
        if (res.blobUrl) {
          setActiveDownloadUrl(res.blobUrl);
          setActiveDownloadName(`SipArana_NIE_${item.grade}_${item.subjectName.replace(/\s+/g, '_')}_${item.yearPublished}.html`);
        }
        setShowPermissionModal(true);
      }
    }, 600);
  };

  const handleToggleOfflineCache = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCachedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownloadAllSubject = () => {
    setBatchDownloading(true);
    const userKey = profile?.email || profile?.id || 'guest_user';
    const batchActionKey = `syllabus_batch_download_${selectedSubject?.id || 'all'}`;
    const isBatchClaimedToday = isDailyActionClaimedToday(batchActionKey, userKey);

    setTimeout(() => {
      const newCached = { ...cachedIds };
      filteredDocuments.forEach((it) => {
        newCached[it.id] = true;
      });
      setCachedIds(newCached);
      setBatchDownloading(false);
    }, 1000);
  };

  const handleClearOfflineStorage = () => {
    if (window.confirm('Are you sure you want to clear all offline cached documents to free local storage?')) {
      setCachedIds({});
    }
  };

  const openReader = (item: SyllabusItem) => {
    setReadingItem(item);
    setReaderPage(1);
    setReaderZoom(100);
    setReaderSearch('');
  };

  // Count items available for a category
  const getCategoryDocumentCount = (categoryId: string) => {
    return SYLLABUS_CATALOG_DATA.filter((d) => d.categoryId === categoryId).length;
  };

  // Count items available for a stream
  const getStreamDocumentCount = (streamId: string) => {
    return SYLLABUS_CATALOG_DATA.filter((d) => d.streamId === streamId).length;
  };

  // Count items available for a subject
  const getSubjectDocumentCount = (subjectId: string) => {
    return SYLLABUS_CATALOG_DATA.filter((d) => d.subjectId === subjectId).length;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>SipArana Offline Syllabus & PDF Library</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            නිල විෂය නිර්දේශ (NIE Syllabi) & පසුගිය විභාග ප්‍රශ්න පත්‍ර PDF
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            National Institute of Education (NIE) official syllabi, Teachers' Guides (Guru Potha), Past Papers with official Marking Schemes, and short summary notes with 1-click download and zero-data offline storage.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>NIE & DoE Verified Official Notes</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{cachedCount} Files Saved Offline ({estimatedOfflineSizeMb} MB)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <FolderDown className="w-4 h-4" />
              <span>Zero-Data Offline Document Reader</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode Selector: Guided Wizard vs My Offline Vault */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setMainView('step_flow');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              mainView === 'step_flow'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>පියවරෙන් පියවර ලේඛන තේරීම (Step-by-Step PDF Finder)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainView('my_offline_vault');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              mainView === 'my_offline_vault'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>මගේ Offline ලේඛන ගබඩාව ({cachedCount})</span>
          </button>
        </div>

        {/* Offline Storage Status Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {cachedCount} Files Offline ({estimatedOfflineSizeMb} MB)
            </span>
          </div>

          {cachedCount > 0 && (
            <button
              onClick={handleClearOfflineStorage}
              className="px-3 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer text-xs"
              title="Clear all offline cached documents"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. ANIMATED MASCOT COMPANION CARD */}
      <SyllabusGuideMascot
        currentStep={mainView === 'my_offline_vault' ? 'documents' : currentStep}
        selectedCategoryName={
          selectedCategory
            ? language === 'si'
              ? selectedCategory.nameSinhala
              : language === 'ta'
              ? selectedCategory.nameTamil
              : selectedCategory.name
            : undefined
        }
        selectedStreamName={
          selectedStream
            ? language === 'si'
              ? selectedStream.nameSinhala
              : language === 'ta'
              ? selectedStream.nameTamil
              : selectedStream.name
            : undefined
        }
        selectedSubjectName={
          selectedSubject
            ? language === 'si'
              ? selectedSubject.nameSinhala
              : language === 'ta'
              ? selectedSubject.nameTamil
              : selectedSubject.name
            : undefined
        }
        totalDocumentsFound={mainView === 'my_offline_vault' ? filteredOfflineVault.length : filteredDocuments.length}
        offlineCount={cachedCount}
        onResetFlow={handleResetFlow}
        onViewOfflineTab={() => setMainView('my_offline_vault')}
      />

      {/* ========================================================================= */}
      {/* 4. STEP-BY-STEP SELECTION FLOW */}
      {/* ========================================================================= */}
      {mainView === 'step_flow' && (
        <div className="space-y-6">
          {/* Interactive Step Breadcrumbs Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Stepper Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-xs font-bold">
                {/* Step 1: Grade / Category */}
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                    currentStep === 'category'
                      ? 'bg-blue-600 text-white shadow-md'
                      : selectedCategory
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>
                    {selectedCategory
                      ? language === 'si'
                        ? selectedCategory.nameSinhala.split('(')[0]
                        : selectedCategory.name.split('(')[0]
                      : '1. ශ්‍රේණිය / මට්ටම (Category)'}
                  </span>
                  {selectedCategory && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                {/* Step 2: Stream */}
                <button
                  type="button"
                  disabled={!selectedCategory}
                  onClick={() => {
                    if (selectedCategory) {
                      setCurrentStep('stream');
                      setSelectedSubject(null);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    currentStep === 'stream'
                      ? 'bg-blue-600 text-white shadow-md'
                      : selectedStream
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  <span>
                    {selectedStream
                      ? language === 'si'
                        ? selectedStream.nameSinhala.split('(')[0]
                        : selectedStream.name.split('(')[0]
                      : '2. විෂය ධාරාව (Stream)'}
                  </span>
                  {selectedStream && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                {/* Step 3: Subject */}
                <button
                  type="button"
                  disabled={!selectedStream}
                  onClick={() => {
                    if (selectedStream) {
                      setCurrentStep('subject');
                      setSelectedSubject(null);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    currentStep === 'subject'
                      ? 'bg-blue-600 text-white shadow-md'
                      : selectedSubject
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  <span>
                    {selectedSubject
                      ? language === 'si'
                        ? selectedSubject.nameSinhala
                        : selectedSubject.name
                      : '3. විෂයය (Subject)'}
                  </span>
                  {selectedSubject && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                {/* Step 4: Documents */}
                <div
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 ${
                    currentStep === 'documents'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">
                    4
                  </span>
                  <span>4. විෂය නිර්දේශ & PDF</span>
                </div>
              </div>

              {/* Back & Reset Controls */}
              {currentStep !== 'category' && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>ආපසු (Back)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFlow}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>මුලට (Reset)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: SELECT CATEGORY / GRADE */}
          {/* ========================================================================= */}
          {currentStep === 'category' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                    පියවර 1: ඔබගේ අධ්‍යාපන මට්ටම තෝරන්න (Step 1: Select Education Category)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    අධ්‍යයන මට්ටම තේරීමෙන් අදාළ නිල විෂය නිර්දේශ, ගුරු මාර්ගෝපදේශ සහ පසුගිය ප්‍රශ්න පත්‍ර පූරණය වේ.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {QUIZ_CATEGORIES.map((cat) => {
                  const docCount = getCategoryDocumentCount(cat.id);
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCategory(cat)}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between space-y-6 cursor-pointer group relative overflow-hidden"
                    >
                      {/* Gradient Accent Top */}
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${cat.gradient}`} />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            {renderIcon(cat.icon, 'w-7 h-7')}
                          </div>
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                            {cat.badge}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-blue-600 transition">
                            {cat.nameSinhala}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                            {cat.name}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {cat.descriptionSinhala}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{docCount} Official Files</span>
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>තෝරන්න (Select)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: SELECT STREAM */}
          {/* ========================================================================= */}
          {currentStep === 'stream' && selectedCategory && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                    පියවර 2: විෂය ධාරාව තෝරන්න (Step 2: Select Academic Stream)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {selectedCategory.nameSinhala} සඳහා අදාළ විෂය ධාරාව තෝරා ඉදිරියට යන්න.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>වෙනත් මට්ටමක් (Change Level)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableStreams.map((stream) => {
                  const docCount = getStreamDocumentCount(stream.id);
                  return (
                    <motion.button
                      key={stream.id}
                      type="button"
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectStream(stream)}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between space-y-6 cursor-pointer group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stream.color}`} />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${stream.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            {renderIcon(stream.icon, 'w-6 h-6')}
                          </div>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {docCount} Documents
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-blue-600 transition">
                            {stream.nameSinhala}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                            {stream.name}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {stream.descriptionSinhala}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400 text-[11px]">NIE & Past Papers</span>
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>විෂයයන් බලන්න (View Subjects)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SELECT SPECIFIC SUBJECT */}
          {/* ========================================================================= */}
          {currentStep === 'subject' && selectedStream && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                    පියවර 3: නිශ්චිත විෂයය තෝරන්න (Step 3: Choose Your Subject)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {selectedStream.nameSinhala} ධාරාව යටතේ ඇති පහත විෂයයන් අතුරින් ඔබට අවශ්‍ය විෂය තෝරන්න.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>වෙනත් ධාරාවක් (Change Stream)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableSubjects.map((subj) => {
                  const docCount = getSubjectDocumentCount(subj.id);
                  return (
                    <motion.button
                      key={subj.id}
                      type="button"
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectSubject(subj)}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between space-y-6 cursor-pointer group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${subj.color}`} />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${subj.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            {renderIcon(subj.iconName, 'w-6 h-6')}
                          </div>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                            {docCount} PDF Files
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                            {subj.syllabusCode}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-blue-600 transition mt-0.5">
                            {subj.nameSinhala}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {subj.name}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {subj.descriptionSinhala}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400 text-[11px]">{subj.gradeLevels}</span>
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>ලේඛන බලන්න (View Files)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: DISPLAY DOCUMENTS FOR THE SELECTED SUBJECT ONLY */}
          {/* ========================================================================= */}
          {currentStep === 'documents' && selectedSubject && (
            <div className="space-y-6">
              {/* Subject Title Banner & Back Button */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedSubject.color} text-white flex items-center justify-center shadow-lg flex-shrink-0`}>
                    {renderIcon(selectedSubject.iconName, 'w-7 h-7')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {selectedSubject.syllabusCode}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {selectedStream?.nameSinhala} • {selectedCategory?.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white mt-1">
                      {selectedSubject.nameSinhala} නිල විෂය නිර්දේශ & PDF
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedSubject.name} — Syllabi, Teacher Guides (Guru Potha), Past Papers, and Notes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleDownloadAllSubject}
                    disabled={batchDownloading || filteredDocuments.length === 0}
                    className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>{batchDownloading ? 'Downloading...' : 'Save All Offline'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>වෙනත් විෂයයක් (Change Subject)</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar for Subject Documents */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search ${selectedSubject.name} documents, formulas...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none text-xs font-bold">
                    {[
                      'All',
                      'NIE Syllabus',
                      'Guru Potha (Teacher Guide)',
                      'Past Paper PDF',
                      'Resource Book',
                      'Summary Notes'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDocFilterType(type)}
                        className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                          docFilterType === type
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Cards Grid */}
              {filteredDocuments.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    මෙම විෂය සඳහා ලේඛන හමු නොවීය (No documents matching filter)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Please clear the search query or select "All" from the document types.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDocFilterType('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((item) => {
                    const isCached = !!cachedIds[item.id];
                    const isDownloading = downloadingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4 group relative overflow-hidden"
                      >
                        <div className="space-y-3">
                          {/* Header Tag */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              {item.fileType}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isCached ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Offline Saved
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400">
                                  {item.fileSize}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white font-serif leading-snug group-hover:text-blue-600 transition">
                              {item.titleSinhala}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                              {item.title}
                            </p>
                          </div>

                          {/* Summary */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {item.summarySinhala}
                          </p>

                          {/* Metadata Pills */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-bold">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                              Grade {item.grade} • {item.stream}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                              {item.pageCount} Pages
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                              {item.downloadCount.toLocaleString()} Reads
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openReader(item)}
                            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Open Reader</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(item)}
                            disabled={isDownloading}
                            title="Download and print official PDF"
                            className="py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isDownloading ? 'Saving...' : 'PDF'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleOfflineCache(item.id, e)}
                            title={isCached ? 'Remove from Offline Storage' : 'Save in Local Offline Storage'}
                            className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                              isCached
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <HardDriveDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MY OFFLINE VAULT VIEW */}
      {/* ========================================================================= */}
      {mainView === 'my_offline_vault' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black">
                <HardDriveDownload className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                  මගේ Offline ලේඛන ගබඩාව (My Cached Offline Vault)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All documents saved locally for access without active internet connection.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMainView('step_flow')}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>නැවත විෂය තේරීමට (Back to Subject Finder)</span>
            </button>
          </div>

          {/* Search bar inside vault */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search your offline saved files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-xs font-bold">
              {['All', 'NIE Syllabus', 'Guru Potha (Teacher Guide)', 'Past Paper PDF', 'Resource Book', 'Summary Notes'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    docFilterType === type
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {filteredOfflineVault.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <HardDriveDownload className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Offline ගබඩා කළ ලේඛන නොමැත (No files cached offline yet)
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use the Step-by-Step PDF finder to select your subjects and click the offline download icon to save files for zero-data access.
              </p>
              <button
                type="button"
                onClick={() => setMainView('step_flow')}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>විෂයයන් ගවේෂණය කරන්න (Explore Subjects)</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfflineVault.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Offline Cached
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{item.fileSize}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white font-serif leading-snug group-hover:text-blue-600 transition">
                        {item.titleSinhala}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.title}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.summarySinhala}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-bold">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {item.subjectName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {item.pageCount} Pages
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openReader(item)}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Reader</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(item)}
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                      title="Print PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleOfflineCache(item.id, e)}
                      title="Remove from Offline Cache"
                      className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 transition cursor-pointer hover:bg-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. IN-APP OFFLINE DOCUMENT VIEWER MODAL */}
      {/* ========================================================================= */}
      {readingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div
            className={`w-full max-w-5xl h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden border transition-colors ${
              readerDarkMode
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* Viewer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-xl bg-blue-600 text-white font-bold flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-black truncate">{readingItem.titleSinhala}</h3>
                  <p className="text-[10px] text-slate-500 truncate">{readingItem.title}</p>
                </div>
              </div>

              {/* Viewer Controls */}
              <div className="flex items-center gap-2 text-xs flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setReaderDarkMode(!readerDarkMode)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Toggle Reader Dark Mode"
                >
                  {readerDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setReaderZoom((z) => Math.max(75, z - 15))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[10px] font-bold">{readerZoom}%</span>
                <button
                  type="button"
                  onClick={() => setReaderZoom((z) => Math.min(150, z + 15))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPDF(readingItem)}
                  className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition cursor-pointer"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setReadingItem(null)}
                  className="p-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition cursor-pointer"
                  title="Close Document"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Search Bar */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find in document (සෙවීම)..."
                  value={readerSearch}
                  onChange={(e) => setReaderSearch(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>
              <span className="text-[10px] text-slate-500 font-bold">
                100% Offline Cached Document Viewer
              </span>
            </div>

            {/* Viewer Document Body Canvas */}
            <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6" style={{ fontSize: `${readerZoom}%` }}>
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="border-b pb-4 text-center space-y-2">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                    {readingItem.fileType} • Page {readerPage} of {readingItem.pageCount}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black font-serif">{readingItem.titleSinhala}</h1>
                  <p className="text-xs text-slate-500">{readingItem.title}</p>
                </div>

                {/* Document Summary & Structure */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-200/50 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                    නිල විෂය සාරාංශය (Official Curriculum Overview)
                  </h4>
                  <p className="text-xs leading-relaxed">{readingItem.summarySinhala}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{readingItem.summary}</p>
                </div>

                {/* Key Formulas / Exam Notes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                    ප්‍රධාන සූත්‍ර සහ අත්‍යවශ්‍ය විභාග සංකල්ප (Key Formulas & Rules)
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {readingItem.keyFormulasAndConcepts.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono font-bold">
                        • {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competencies Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                    විෂය නිපුණතා සහ ඒකක ව්‍යුහය (Competencies & Period Allocations)
                  </h4>
                  <div className="space-y-2">
                    {readingItem.competencies.map((comp) => (
                      <div
                        key={comp.competencyNo}
                        className="p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-blue-600">Unit {comp.competencyNo}</span>
                          <p className="font-bold">{comp.descriptionSinhala}</p>
                          <p className="text-[10px] text-slate-500">{comp.description}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 whitespace-nowrap">
                          {comp.periods} Periods
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Viewer Footer Pagination */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={readerPage <= 1}
                onClick={() => setReaderPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border bg-white dark:bg-slate-900 disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="font-bold">
                Page {readerPage} of {readingItem.pageCount}
              </span>
              <button
                type="button"
                disabled={readerPage >= readingItem.pageCount}
                onClick={() => setReaderPage((p) => Math.min(readingItem.pageCount, p + 1))}
                className="px-3 py-1.5 rounded-xl border bg-white dark:bg-slate-900 disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <FilePermissionHelperModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        type="download"
        downloadUrl={activeDownloadUrl}
        downloadFilename={activeDownloadName}
      />
    </div>
  );
}
