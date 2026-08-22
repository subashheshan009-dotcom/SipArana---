import React, { useState } from 'react';
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
  FolderDown
} from 'lucide-react';
import { SYLLABUS_CATALOG_DATA, type SyllabusItem } from '@/data/syllabusData';
import { generateSyllabusPDF } from '@/utils/pdfGenerator';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function OfflineSyllabusPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedFileType, setSelectedFileType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<SyllabusItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [cachedIds, setCachedIds] = useState<Record<string, boolean>>({
    syl_al_maths: true,
    syl_al_physics: true
  });

  const filteredItems = SYLLABUS_CATALOG_DATA.filter((item) => {
    const matchesStream = selectedStream === 'All' || item.stream === selectedStream;
    const matchesType = selectedFileType === 'All' || item.fileType === selectedFileType;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleSinhala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectSinhala.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesType && matchesSearch;
  });

  const handleDownloadPDF = (item: SyllabusItem) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      generateSyllabusPDF(item, profile?.name || 'SipArana Student');
      setDownloadingId(null);
      // Mark as cached
      setCachedIds((prev) => ({ ...prev, [item.id]: true }));
    }, 600);
  };

  const handleToggleOfflineCache = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCachedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Offline Study Hub (අන්තර්ජාලය නොමැතිව කියවිය හැකි PDF)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            නිල විෂය නිර්දේශ (NIE Syllabi) & පසුගිය විභාග ප්‍රශ්න පත්‍ර PDF
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Download National Institute of Education (NIE) official syllabi, Guru Potha teacher guides, resource books, and unit formula summaries directly to your device for 100% offline study without internet access.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>NIE & Ministry of Education Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Print-Ready High Quality Format</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <FolderDown className="w-4 h-4" />
              <span>Offline Device Storage Cached</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search PDF notes, syllabus or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
            />
          </div>

          {/* Stream Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none text-xs font-bold">
            {['All', 'Physical Science (Maths)', 'Biological Science (Bio)', 'General O/L'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStream(s)}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedStream === s
                    ? 'bg-blue-600 text-white font-black shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'All' ? 'All Streams' : s.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* File Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none text-xs">
          {['All', 'NIE Syllabus', 'Resource Book', 'Guru Potha (Teacher Guide)'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedFileType(t)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFileType === t
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isCached = cachedIds[item.id];
          const isDownloading = downloadingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] border border-blue-200 dark:border-blue-800">
                        {item.subjectSinhala}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Grade {item.grade} • {item.yearPublished} Edition
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                      {language === 'si' ? item.titleSinhala : item.title}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {language === 'si' ? item.summarySinhala : item.summary}
                </p>

                {/* Specs pill row */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Pages</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{item.pageCount} pgs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Size</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{item.fileSize}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Downloads</div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(item.downloadCount / 1000).toFixed(1)}k</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={(e) => handleToggleOfflineCache(item.id, e)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isCached
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>{isCached ? 'Saved Offline' : 'Save Offline'}</span>
                  </button>
                </div>

                <button
                  disabled={isDownloading}
                  onClick={() => handleDownloadPDF(item)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition transform active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generating PDF Document...' : 'Download & Print PDF (බාගත කරන්න)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                  {previewItem.fileType}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {previewItem.titleSinhala}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {previewItem.title}
                </p>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Prescribed Competencies Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Prescribed Competencies & Periods (ඒකක සහ කාලච්ඡේද)
              </h4>

              <div className="space-y-2">
                {previewItem.competencies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        Unit {comp.competencyNo}:
                      </span>{' '}
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {comp.descriptionSinhala}
                      </span>
                      <div className="text-[10px] text-slate-500">{comp.description}</div>
                    </div>
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {comp.periods} Periods
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulas Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                High-Yield Master Formulas
              </h4>
              <div className="space-y-1.5">
                {previewItem.keyFormulasAndConcepts.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-mono text-xs font-bold"
                  >
                    ⚡ {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => {
                  handleDownloadPDF(previewItem);
                  setPreviewItem(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Save as PDF / Print Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
