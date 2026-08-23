import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  RefreshCw,
  Clock,
  Flame,
  Volume2,
  VolumeX,
  Heart,
  ChevronRight,
  Share2,
  ThumbsUp,
  SlidersHorizontal,
  Rocket,
  CheckCircle2,
  Code2,
  Zap,
  Tag,
  Radio,
  BookOpen,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useUpdates } from '@/context/UpdatesContext';
import { AppUpdateItem } from '@/data/updatesData';

interface WhatsNewPageProps {
  onNavigate?: (page: string) => void;
}

export default function WhatsNewPage({ onNavigate }: WhatsNewPageProps) {
  const { language } = useLanguage();
  const { addXP } = useAuth();
  const {
    updates,
    isSyncing,
    lastSyncTime,
    syncCountdown,
    autoSyncEnabled,
    setAutoSyncEnabled,
    latestPushedUpdate,
    syncUpdatesNow,
    simulateIncomingUpdateDrop,
    upvotedIds,
    toggleUpvote,
    readUpdateIds,
    markUpdateAsRead
  } = useUpdates();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUpdateModal, setActiveUpdateModal] = useState<AppUpdateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mascotCheer, setMascotCheer] = useState(false);

  // Filter logic
  const filteredUpdates = updates.filter((item) => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.titleSinhala.toLowerCase().includes(q) ||
      item.version.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.affectedModules.some((m) => m.toLowerCase().includes(q));

    return matchCategory && matchSearch;
  });

  const handleOpenUpdate = (item: AppUpdateItem) => {
    markUpdateAsRead(item.id);
    setActiveUpdateModal(item);
  };

  const handleShare = (item: AppUpdateItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `[SipArana App Update] ${item.version}: ${item.titleSinhala} - ${item.title}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleMascotHighFive = () => {
    setMascotCheer(true);
    addXP(15);
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => setMascotCheer(false), 800);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'si' ? 'si-LK' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'HOT':
        return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30';
      case 'NEW':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'UPDATE':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      default:
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER & AUTOMATED ROADMAP SYNC RADAR */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-8 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 backdrop-blur-md text-xs font-black text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>LIVE AUTOMATED ROADMAP SYNC & DEPLOYMENT FEED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'si'
                ? 'නව යාවත්කාලීන සහ නිකුතු (What\'s New & Updates)'
                : language === 'ta'
                ? 'புதிய புதுப்பிப்புகள் & வெளியீடுகள்'
                : 'What\'s New, Updates & Platform Roadmap'}
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {language === 'si'
                ? 'සිප්අරණ පද්ධතියේ නවතම විශේෂාංග, AI හැකියාවන්, විභාග මෙවලම් සහ විෂය නිර්දේශ එක්වීම් පිළිබඳ සජීවී වාර්තාව සහ සැලැස්ම.'
                : 'Real-time automated release feed detailing new features, AI enhancements, syllabus additions, and roadmap deployments for Sri Lankan learners.'}
            </p>
          </div>

          {/* Sync Controls Card */}
          <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/15 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 min-w-[280px] lg:max-w-xs shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-200 font-bold">
                <Radio className={`w-4 h-4 ${isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
                <span>Roadmap Feed</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                AUTO-SYNC ON
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
                onClick={syncUpdatesNow}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/30 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Roadmap'}</span>
              </button>

              <button
                onClick={simulateIncomingUpdateDrop}
                title="Test real-time feature release notification"
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/30 cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>Simulate Drop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANIMATED CARTOON MASCOT ALERT BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-blue-500/15 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border-2 border-indigo-400/70 dark:border-indigo-500/50 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-1 shadow-lg transform transition-transform duration-300 ${mascotCheer ? 'scale-110 rotate-6' : 'hover:scale-105'}`}>
              <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,12 85,25 50,38 15,25" fill="#1e293b" />
                  <polygon points="50,15 80,26 50,37 20,26" fill="#0f172a" />
                  <rect x="42" y="27" width="16" height="6" fill="#3b82f6" rx="2" />
                  <line x1="82" y1="26" x2="86" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="86" cy="42" r="3" fill="#f59e0b" />
                  <ellipse cx="50" cy="62" rx="34" ry="32" fill="#6366f1" />
                  <ellipse cx="50" cy="67" rx="24" ry="22" fill="#e0e7ff" />
                  <circle cx="37" cy="52" r="12" fill="#ffffff" />
                  <circle cx="38" cy="52" r="6" fill="#1e3a8a" />
                  <circle cx="36" cy="49" r="2.5" fill="#ffffff" />
                  <circle cx="63" cy="52" r="12" fill="#ffffff" />
                  <circle cx="62" cy="52" r="6" fill="#1e3a8a" />
                  <circle cx="64" cy="49" r="2.5" fill="#ffffff" />
                  <polygon points="50,56 45,64 55,64" fill="#f59e0b" />
                  <circle cx="37" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  <circle cx="63" cy="52" r="13" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  <line x1="49" y1="52" x2="51" y2="52" stroke="#f59e0b" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[9px] font-bold text-white items-center justify-center">
                🚀
              </span>
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sipuru Mascot Live Release Dispatcher</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-black text-[10px]">
                Real-Time Sync 🦉
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-indigo-300 dark:border-indigo-600/40 shadow-xs space-y-1.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                "{language === 'si'
                  ? 'නව යාවත්කාලීන නිකුතුවක් සිප්අරණ වෙත එක්විය! නවතම විශේෂාංග සහ වැඩිදියුණු කිරීම් මෙතැනින් පරීක්ෂා කරන්න!'
                  : language === 'ta'
                  ? 'சிப்அரண தளத்திற்கு புதிய அம்சம் சேர்க்கப்பட்டது! இப்போது சரிபார்க்கவும்!'
                  : 'A brand new SipArana release is live! Check out the newest features and syllabus additions below!'}"
              </p>

              {latestPushedUpdate && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 font-mono text-[10px] font-bold">
                    {latestPushedUpdate.version}
                  </span>
                  <span className="truncate max-w-md">
                    {language === 'si' ? latestPushedUpdate.titleSinhala : latestPushedUpdate.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (latestPushedUpdate) {
                    speakText(
                      language === 'si' ? latestPushedUpdate.summarySinhala : latestPushedUpdate.summary
                    );
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Voice' : 'Mascot Voice Readout 🎙️'}</span>
              </button>

              {latestPushedUpdate && (
                <button
                  onClick={() => handleOpenUpdate(latestPushedUpdate)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Open Update Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleMascotHighFive}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 text-xs font-semibold transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>High Five (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, versions (v2.6, v2.5), AI tools, syllabus updates..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              autoSyncEnabled
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{autoSyncEnabled ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Releases' },
            { id: 'Major Release', label: '🚀 Major Releases' },
            { id: 'AI Feature', label: '🤖 AI & Voice Tools' },
            { id: 'Syllabus & Past Papers', label: '📚 Syllabus & Past Papers' },
            { id: 'Exam Tools', label: '⚡ Exam Tools & Hubs' },
            { id: 'UI & Performance', label: '🎨 UI & Offline Speed' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. UPDATES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredUpdates.map((item) => {
          const isUpvoted = upvotedIds.includes(item.id);
          const isRead = readUpdateIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleOpenUpdate(item)}
              className={`group bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs hover:shadow-xl transition duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                item.isBreaking
                  ? 'border-indigo-400 dark:border-indigo-500/80 ring-2 ring-indigo-400/20'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-500'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {item.version}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${getBadgeStyle(item.badge)}`}>
                      {item.badge}
                    </span>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread update" />}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUpvote(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isUpvoted
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                      title="Upvote Feature"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.upvotesCount}</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Share Update"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {language === 'si' ? item.titleSinhala : item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{item.releaseDate} • By {item.author}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {language === 'si' ? item.summarySinhala : item.summary}
                </p>

                {/* Modules Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.affectedModules.map((mod, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-semibold">{item.highlights.length} Core Improvements</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MODAL DETAIL */}
      {activeUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-indigo-600 text-white">
                    {activeUpdateModal.version}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${getBadgeStyle(activeUpdateModal.badge)}`}>
                    {activeUpdateModal.badge}
                  </span>
                </div>
                <button
                  onClick={() => setActiveUpdateModal(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 leading-snug">
                {language === 'si' ? activeUpdateModal.titleSinhala : activeUpdateModal.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono">Released: {activeUpdateModal.releaseDate} • Module: {activeUpdateModal.category}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {language === 'si' ? activeUpdateModal.summarySinhala : activeUpdateModal.summary}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Key Highlights & Improvements:
                </h4>
                <div className="space-y-2">
                  {activeUpdateModal.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{language === 'si' ? h.si : h.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => toggleUpvote(activeUpdateModal.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  upvotedIds.includes(activeUpdateModal.id)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Upvote ({activeUpdateModal.upvotesCount})</span>
              </button>

              <button
                onClick={() => setActiveUpdateModal(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
