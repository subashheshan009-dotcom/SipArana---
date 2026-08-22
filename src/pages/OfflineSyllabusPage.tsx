import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bookmark,
  Share2,
  Award,
  Check
} from 'lucide-react';
import { SYLLABUS_CATALOG_DATA, type SyllabusItem } from '@/data/syllabusData';
import { generateSyllabusPDF } from '@/utils/pdfGenerator';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function OfflineSyllabusPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'catalog' | 'offline' | 'pastpapers' | 'shortnotes'>('catalog');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedFileType, setSelectedFileType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Document Viewer Modal State
  const [readingItem, setReadingItem] = useState<SyllabusItem | null>(null);
  const [readerPage, setReaderPage] = useState<number>(1);
  const [readerZoom, setReaderZoom] = useState<number>(100);
  const [readerDarkMode, setReaderDarkMode] = useState<boolean>(false);
  const [readerSearch, setReaderSearch] = useState<string>('');

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [batchDownloading, setBatchDownloading] = useState<boolean>(false);
  const [cachedIds, setCachedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('siparana_cached_documents');
      return saved ? JSON.parse(saved) : {
        syl_al_maths: true,
        syl_al_physics: true,
        syl_al_media_syllabus: true,
        syl_al_media_pastpapers: true
      };
    } catch {
      return { syl_al_maths: true, syl_al_media_syllabus: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('siparana_cached_documents', JSON.stringify(cachedIds));
  }, [cachedIds]);

  // Filter items based on activeTab and filters
  const filteredItems = SYLLABUS_CATALOG_DATA.filter((item) => {
    if (activeTab === 'offline' && !cachedIds[item.id]) return false;
    if (activeTab === 'pastpapers' && item.fileType !== 'Past Paper PDF') return false;
    if (activeTab === 'shortnotes' && item.fileType !== 'Summary Notes') return false;

    const matchesStream = selectedStream === 'All' || item.stream === selectedStream || (selectedStream === 'Arts' && item.stream.includes('Arts'));
    const matchesType = selectedFileType === 'All' || item.fileType === selectedFileType;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleSinhala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectSinhala.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesType && matchesSearch;
  });

  const cachedCount = Object.values(cachedIds).filter(Boolean).length;
  const estimatedOfflineSizeMb = (cachedCount * 4.8).toFixed(1);

  const handleDownloadPDF = (item: SyllabusItem) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      generateSyllabusPDF(item, profile?.name || 'SipArana Student');
      setDownloadingId(null);
      setCachedIds((prev) => ({ ...prev, [item.id]: true }));
      addXP(10);
    }, 600);
  };

  const handleToggleOfflineCache = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCachedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownloadAllStream = () => {
    setBatchDownloading(true);
    setTimeout(() => {
      const newCached = { ...cachedIds };
      filteredItems.forEach((it) => {
        newCached[it.id] = true;
      });
      setCachedIds(newCached);
      setBatchDownloading(false);
      addXP(30);
    }, 1200);
  };

  const handleClearOfflineStorage = () => {
    if (window.confirm('Are you sure you want to clear all offline cached documents to free storage?')) {
      setCachedIds({});
    }
  };

  const openReader = (item: SyllabusItem) => {
    setReadingItem(item);
    setReaderPage(1);
    setReaderZoom(100);
    setReaderSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Offline Document Library (බාගත කළ ලේඛන කළමනාකරු)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            නිල විෂය නිර්දේශ (NIE Syllabi) & පසුගිය විභාග ප්‍රශ්න පත්‍ර PDF
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Download and view National Institute of Education (NIE) official syllabi, Teachers' Guides (Guru Potha), Past Papers with official Marking Schemes, and short summary notes without internet data access.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>NIE & DoE Official Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{cachedCount} Files Saved Offline ({estimatedOfflineSizeMb} MB)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <FolderDown className="w-4 h-4" />
              <span>In-App Zero Data Offline Reader</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Storage Management & Quick Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black">
            <HardDriveDownload className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white">Offline Device Storage</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {cachedCount} Cached
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {estimatedOfflineSizeMb} MB used of 500 MB allocated offline cache
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
          <button
            onClick={handleDownloadAllStream}
            disabled={batchDownloading}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
          >
            <FolderDown className="w-4 h-4" />
            <span>{batchDownloading ? 'Downloading Stream...' : 'Download All Shown Offline'}</span>
          </button>

          {cachedCount > 0 && (
            <button
              onClick={handleClearOfflineStorage}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {[
          { id: 'catalog', label: 'All Documents Catalog (සියලුම)', icon: BookOpen },
          { id: 'offline', label: `My Offline Library (${cachedCount})`, icon: HardDriveDownload },
          { id: 'pastpapers', label: 'Past Papers & Marking Schemes (පසුගිය ප්‍රශ්න පත්‍ර)', icon: FileCheck },
          { id: 'shortnotes', label: 'Summary Short Notes & Mind Maps (කෙටි සටහන්)', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl border transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search past papers, marking schemes, media studies notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none text-xs font-bold">
            {['All', 'Arts', 'Physical Science (Maths)', 'Biological Science (Bio)', 'General O/L'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStream(s)}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedStream === s
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'All' ? 'All Streams' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none text-xs">
          {['All', 'NIE Syllabus', 'Past Paper PDF', 'Summary Notes', 'Guru Potha (Teacher Guide)'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedFileType(t)}
              className={`px-3 py-1 rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedFileType === t
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
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
                        <CheckCircle2 className="w-3 h-3" /> Offline Ready
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
                  onClick={() => openReader(item)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Reader</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(item)}
                  disabled={isDownloading}
                  title="Download and save PDF"
                  className="py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Saving...' : 'PDF'}</span>
                </button>

                <button
                  onClick={(e) => handleToggleOfflineCache(item.id, e)}
                  title={isCached ? 'Remove from Offline Cache' : 'Cache for Offline Usage'}
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

      {/* 6. IN-APP OFFLINE DOCUMENT VIEWER MODAL */}
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
                  onClick={() => setReaderDarkMode(!readerDarkMode)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Toggle Reader Dark Mode"
                >
                  {readerDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setReaderZoom((z) => Math.max(75, z - 15))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[10px] font-bold">{readerZoom}%</span>
                <button
                  onClick={() => setReaderZoom((z) => Math.min(150, z + 15))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDownloadPDF(readingItem)}
                  className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition cursor-pointer"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
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
    </div>
  );
}
