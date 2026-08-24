import React, { useState } from 'react';
import {
  Bell,
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  Share2,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Download,
  Volume2,
  VolumeX,
  CheckCircle2,
  Radio,
  Clock,
  Printer,
  ChevronRight,
  Heart,
  FileCheck2,
  SlidersHorizontal,
  Flame,
  Landmark,
  GraduationCap,
  BookOpen,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useExamNews } from '@/context/NewsContext';
import { OFFICIAL_AUTHORITIES, type OfficialCircularItem } from '@/data/examNewsData';
import { downloadPrintableHTMLDoc } from '@/utils/fileDownloader';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';

export default function NewsPage() {
  const { language } = useLanguage();
  const { addXP } = useAuth();
  const {
    notices,
    isSyncing,
    lastSyncTime,
    syncCountdown,
    autoSyncEnabled,
    setAutoSyncEnabled,
    latestBreakingNotice,
    syncNow,
    simulateIncomingDrop,
    bookmarkedIds,
    toggleBookmark,
    readIds,
    markAsRead,
    authorityStatuses,
    speakNotice,
    isSpeaking,
    stopSpeaking
  } = useExamNews();

  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<OfficialCircularItem | null>(null);
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mascotCheer, setMascotCheer] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | undefined>(undefined);
  const [activeDownloadName, setActiveDownloadName] = useState<string | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadOfficialCircular = (article: OfficialCircularItem) => {
    setIsDownloading(true);
    const filename = `SipArana_Official_Circular_${article.refNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${article.authorityCode}.html`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${article.title} - Official Notice</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', sans-serif; color: #0f172a; margin: 0; padding: 28px; line-height: 1.6; }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 20px; }
    .badge { display: inline-block; background: #1e3a8a; color: #fff; padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 13px; }
    .title { font-size: 20px; font-weight: 800; color: #1e293b; margin-top: 12px; }
    .ref { font-size: 12px; color: #64748b; font-family: monospace; }
    .content { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 16px 0; font-size: 13px; white-space: pre-wrap; font-family: monospace; }
    .footer { font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">OFFICIAL BULLETIN • ${article.authorityCode}</span>
    <div class="title">${article.title}</div>
    <div style="font-size: 16px; font-weight: 700; color: #334155; margin-top: 4px;">${article.titleSinhala}</div>
    <div class="ref" style="margin-top: 8px;">Ref No: ${article.refNumber} | Published Date: ${article.publishedDate} | Source: ${article.source}</div>
  </div>

  <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-size: 13px;">
    <strong>Executive Summary:</strong><br/>
    ${article.sinhalaSummary}<br/><br/>
    <em>${article.summary}</em>
  </div>

  <div class="content">${article.fullContent}</div>

  <div class="footer">
    Verified by SipArana LK Examination News Radar. Compliant with Sri Lanka Ministry of Education & Dept. of Examinations.
  </div>
</body>
</html>
    `;

    setTimeout(() => {
      const res = downloadPrintableHTMLDoc(htmlContent, filename, true);
      setIsDownloading(false);
      addXP(15);

      if (!res.success || res.isPopupBlocked) {
        if (res.blobUrl) {
          setActiveDownloadUrl(res.blobUrl);
          setActiveDownloadName(filename);
        }
        setShowPermissionModal(true);
      }
    }, 400);
  };

  // Filter logic
  const filteredNotices = notices.filter((n) => {
    const matchAuthority =
      selectedAuthority === 'ALL' || n.authorityCode === selectedAuthority;
    
    let matchCategory = true;
    if (selectedCategory === 'BOOKMARKS') {
      matchCategory = bookmarkedIds.includes(n.id);
    } else if (selectedCategory === 'BREAKING') {
      matchCategory = !!n.isBreaking;
    } else if (selectedCategory !== 'ALL') {
      matchCategory = n.category === selectedCategory;
    }

    const matchUrgent = !showOnlyUrgent || n.isUrgent || n.importance === 'CRITICAL';

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.titleSinhala.toLowerCase().includes(q) ||
      n.refNumber.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q));

    return matchAuthority && matchCategory && matchUrgent && matchSearch;
  });

  const handleOpenNotice = (notice: OfficialCircularItem) => {
    markAsRead(notice.id);
    setActiveArticle(notice);
  };

  const handleShare = (notice: OfficialCircularItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `[SipArana Exam Alert] ${notice.titleSinhala} (${notice.refNumber}) - Source: ${notice.source}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleMascotHighFive = () => {
    setMascotCheer(true);
    addXP(15);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => setMascotCheer(false), 800);
  };

  const getAuthorityBadge = (code: string) => {
    switch (code) {
      case 'DOENETS':
        return { label: 'Department of Examinations (doenets.lk)', bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
      case 'MOE':
        return { label: 'Ministry of Education (moe.gov.lk)', bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' };
      case 'UGC':
        return { label: 'UGC Sri Lanka (ugc.ac.lk)', bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' };
      case 'NIE':
        return { label: 'NIE Sri Lanka (nie.lk)', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      default:
        return { label: code, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER & AUTOMATED RSS LIVE SYNC STATUS RADAR */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-blue-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md text-xs font-black text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE AUTOMATED RSS SYNC: DOENETS.LK & MOE.GOV.LK</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'si'
                ? 'නිල විභාග පුවත් & සජීවී නිවේදන'
                : language === 'ta'
                ? 'அதிகாரப்பூர்வ தேர்வு செய்திகள் & அறிவிப்புகள்'
                : 'Official Exam Bulletins & Live Alerts'}
            </h1>

            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed">
              {language === 'si'
                ? 'ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුව (doenets.lk), අධ්‍යාපන අමාත්‍යාංශය (moe.gov.lk) සහ UGC නිල ද්වාරවලින් සෘජුවම ස්වයංක්‍රීයව සමමුහුර්ත වන නවතම විභාග කාලසටහන්, ප්‍රවේශ පත්‍ර, ප්‍රතිඵල සහ චක්‍රලේඛ.'
                : 'Real-time automated sync with Sri Lanka Department of Examinations (doenets.lk), Ministry of Education, and UGC for timetables, admission slips, cutoffs, and circulars.'}
            </p>
          </div>

          {/* Sync Controls & Radar Card */}
          <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/15 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 min-w-[280px] lg:max-w-xs shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-200 font-bold">
                <Radio className={`w-4 h-4 ${isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
                <span>Live Feed Status</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Last Synced:</span>
                <span className="font-semibold text-white">
                  {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Auto-Check:</span>
                <span className="font-bold text-amber-300">{autoSyncEnabled ? `in ${syncCountdown}s` : 'Paused'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={syncNow}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                onClick={simulateIncomingDrop}
                title="Test real-time alert drop from doenets.lk"
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/30 cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>Simulate Drop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Authority Ping Indicators */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {OFFICIAL_AUTHORITIES.map((auth) => {
            const status = authorityStatuses[auth.shortCode] || { status: 'ONLINE', pingMs: 40 };
            return (
              <div
                key={auth.id}
                onClick={() => setSelectedAuthority(selectedAuthority === auth.shortCode ? 'ALL' : auth.shortCode)}
                className={`p-2.5 rounded-xl border backdrop-blur-xs transition cursor-pointer flex items-center justify-between ${
                  selectedAuthority === auth.shortCode
                    ? 'bg-blue-600/40 border-blue-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-[11px] truncate">{auth.shortCode}</span>
                </div>
                <span className="text-[10px] text-slate-400">{status.pingMs}ms</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ANIMATED CARTOON MASCOT ALERT BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-orange-500/15 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40 border-2 border-amber-400/70 dark:border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Animated 3D Mascot Character */}
          <div className="relative shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-1 shadow-lg transform transition-transform duration-300 ${mascotCheer ? 'scale-110 rotate-6' : 'hover:scale-105'}`}>
              <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Graduation Cap */}
                  <polygon points="50,12 85,25 50,38 15,25" fill="#1e293b" />
                  <polygon points="50,15 80,26 50,37 20,26" fill="#0f172a" />
                  <rect x="42" y="27" width="16" height="6" fill="#3b82f6" rx="2" />
                  <line x1="82" y1="26" x2="86" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="86" cy="42" r="3" fill="#f59e0b" />
                  {/* Body */}
                  <ellipse cx="50" cy="62" rx="34" ry="32" fill="#3b82f6" />
                  <ellipse cx="50" cy="67" rx="24" ry="22" fill="#dbeafe" />
                  {/* Eyes */}
                  <circle cx="37" cy="52" r="12" fill="#ffffff" />
                  <circle cx="38" cy="52" r="6" fill="#1e3a8a" />
                  <circle cx="36" cy="49" r="2.5" fill="#ffffff" />
                  <circle cx="63" cy="52" r="12" fill="#ffffff" />
                  <circle cx="62" cy="52" r="6" fill="#1e3a8a" />
                  <circle cx="64" cy="49" r="2.5" fill="#ffffff" />
                  {/* Beak & Glasses */}
                  <polygon points="50,56 45,64 55,64" fill="#f59e0b" />
                  <circle cx="37" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  <circle cx="63" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  <line x1="49" y1="52" x2="51" y2="52" stroke="#f59e0b" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Mascot Live Alert Ping */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-900 items-center justify-center">
                📢
              </span>
            </span>
          </div>

          {/* Speech Bubble from Mascot */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sipuru Mascot Exam Alert Engine</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                Real-Time Watchdog 🦉
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-600/40 shadow-xs space-y-1.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                "{language === 'si'
                  ? 'නව විභාග නිවේදනයක් නිකුත් විය! doenets.lk සහ moe.gov.lk චක්‍රලේඛ මෙතැනින් ක්ෂණිකව කියවන්න හෝ ශ්‍රවණය කරන්න!'
                  : language === 'ta'
                  ? 'புதிய தேர்வு அறிவிப்பு வெளியாகிவிட்டது! உடனடியாக இங்கே சரிபார்க்கவும் அல்லது கேட்கவும்!'
                  : 'New Exam Notice is out! Tap here to check the latest circulars from doenets.lk instantly!'}"
              </p>
              
              {latestBreakingNotice && (
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 font-mono text-[10px]">
                    {latestBreakingNotice.refNumber}
                  </span>
                  <span className="truncate max-w-md">
                    {language === 'si' ? latestBreakingNotice.titleSinhala : latestBreakingNotice.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (latestBreakingNotice) {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakNotice(
                        language === 'si'
                          ? latestBreakingNotice.sinhalaSummary
                          : latestBreakingNotice.summary,
                        language
                      );
                    }
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Voice Narration' : 'Mascot Voice Readout 🎙️'}</span>
              </button>

              {latestBreakingNotice && (
                <button
                  onClick={() => handleOpenNotice(latestBreakingNotice)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Open Breaking Notice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleMascotHighFive}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 text-xs font-semibold transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>High Five Mascot (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AUTHORITY & CATEGORY FILTER NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xs space-y-4">
        {/* Search & Urgent Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, reference codes (e.g. DOENETS/AL-08), A/L, O/L, Z-Scores..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowOnlyUrgent(!showOnlyUrgent)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showOnlyUrgent
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Urgent Only</span>
            </button>

            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                autoSyncEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{autoSyncEnabled ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Authority Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold">
            <Landmark className="w-3.5 h-3.5 text-blue-500" />
            <span>Filter by Official Educational Authority:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedAuthority('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
                selectedAuthority === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Authorities (සියලු ආයතන)
            </button>

            {OFFICIAL_AUTHORITIES.map((auth) => (
              <button
                key={auth.id}
                onClick={() => setSelectedAuthority(auth.shortCode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedAuthority === auth.shortCode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{auth.shortCode}</span>
                <span className="text-[10px] opacity-75">({auth.portalUrl.replace('https://', '')})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          {[
            { id: 'ALL', label: 'All Updates' },
            { id: 'BREAKING', label: '⚡ Breaking (සජීවී)' },
            { id: 'Exam Notice', label: '📅 Exam Timetables & Notices' },
            { id: 'University Intake', label: '🎓 UGC & University Intake' },
            { id: 'Syllabus Update', label: '📄 Circulars & Syllabus' },
            { id: 'Scholarship', label: '🏆 Scholarships & Cut-Offs' },
            { id: 'Results', label: '📊 Results & Re-Scrutiny' },
            { id: 'BOOKMARKS', label: `🔖 Saved (${bookmarkedIds.length})` }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400 dark:border-blue-700 font-extrabold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. FEED NOTICES COUNT & STATS */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-500" />
          <span>Showing <strong>{filteredNotices.length}</strong> official circulars & bulletins</span>
        </div>
        <span className="text-[11px]">Real-time encrypted feed channel</span>
      </div>

      {/* 5. OFFICIAL NOTICES GRID */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              No circulars found matching your query
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your filters, clearing search keywords, or click 'Sync Now' to check official portals.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedAuthority('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setShowOnlyUrgent(false);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotices.map((notice) => {
            const isBookmarked = bookmarkedIds.includes(notice.id);
            const isRead = readIds.includes(notice.id);
            const authBadge = getAuthorityBadge(notice.authorityCode);

            return (
              <div
                key={notice.id}
                onClick={() => handleOpenNotice(notice)}
                className={`group relative bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                  notice.isBreaking
                    ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent'
                    : notice.isUrgent
                    ? 'border-red-300 dark:border-red-900/60 hover:border-red-500'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-500'
                }`}
              >
                {/* Top Badges & Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border ${authBadge.bg}`}>
                        {notice.authorityCode}
                      </span>
                      {notice.isBreaking && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 animate-pulse flex items-center gap-1">
                          <Flame className="w-3 h-3" /> BREAKING
                        </span>
                      )}
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread notice" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(notice.id);
                        }}
                        className={`p-1.5 rounded-xl transition ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Notice'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => handleShare(notice, e)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Share Notice"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Ref Number & Date */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{notice.refNumber}</span>
                    <span>{notice.publishedDate}</span>
                  </div>

                  {/* Titles */}
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {notice.titleSinhala}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {notice.title}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {language === 'si' ? notice.sinhalaSummary : notice.summary}
                  </p>

                  {/* Target Audience tag */}
                  <div className="pt-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 block truncate">
                      🎯 {notice.targetAudience}
                    </span>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px]">{notice.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakNotice(
                          language === 'si' ? notice.sinhalaSummary : notice.summary,
                          language
                        );
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      title="Listen with Text-to-Speech"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. OFFICIAL CIRCULAR DETAIL MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            {/* Sri Lanka State Emblem & Circular Header */}
            <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {activeArticle.authorityCode}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {activeArticle.refNumber}
                    </span>
                    <p className="text-[10px] text-slate-400">{activeArticle.source}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className={`p-2 rounded-xl border transition ${
                      bookmarkedIds.includes(activeArticle.id)
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 leading-snug">
                  {activeArticle.titleSinhala}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{activeArticle.title}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published: {activeArticle.publishedDate}</span>
                </span>
                <span>•</span>
                <span>Effective: {activeArticle.effectiveDate}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Official Verified Bulletin
                </span>
              </div>
            </div>

            {/* Circular Full Body */}
            <div className="space-y-4">
              {/* Mascot Audio Reader Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-2 font-bold">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Listen to this bulletin with Mascot Speech Synthesis:</span>
                </div>
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakNotice(
                        language === 'si' ? activeArticle.sinhalaSummary : activeArticle.summary,
                        language
                      );
                    }
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black whitespace-nowrap transition cursor-pointer"
                >
                  {isSpeaking ? 'Stop Voice' : 'Play Narration 🎙️'}
                </button>
              </div>

              {/* Full Content Text Area */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {activeArticle.fullContent}
              </div>

              {/* Official Source Warning and Link */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-2 text-xs text-blue-900 dark:text-blue-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  <span>නිල තහවුරු කිරීම සහ සත්‍යාපනය (Official Verification):</span>
                </span>
                <p className="leading-relaxed">
                  මෙම නිවේදනය ශ්‍රී ලංකා රජයේ නිල අධ්‍යාපන පද්ධති හරහා නිකුත් කර ඇත. වැඩිදුර තොරතුරු සඳහා නිල වෙබ් අඩවියට පිවිසෙන්න ({activeArticle.source}).
                </p>
                <a
                  href={activeArticle.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300 hover:underline pt-1"
                >
                  <span>Visit {activeArticle.linkUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadOfficialCircular(activeArticle)}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Downloading...' : 'Download Official PDF'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  title="Print Circular"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                Close Notice
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
