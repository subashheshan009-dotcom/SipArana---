import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Trophy,
  Award,
  CheckCircle2,
  Share2,
  MessageCircle,
  Copy,
  Download,
  Send,
  Heart,
  Sparkles,
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import type { WeeklyStudyReport } from '@/services/weeklyReportService';
import { formatReportForWhatsApp } from '@/services/weeklyReportService';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface WeeklyProgressPostCardProps {
  report: WeeklyStudyReport;
  onSendToChat?: () => void;
  onOpenChatModal?: () => void;
  compact?: boolean;
}

export const WeeklyProgressPostCard: React.FC<WeeklyProgressPostCardProps> = ({
  report,
  onSendToChat,
  onOpenChatModal,
  compact = false
}) => {
  const [copied, setCopied] = useState(false);
  const [sentToChatSuccess, setSentToChatSuccess] = useState(report.isSentToParent);

  const handleCopy = () => {
    soundFX.playClick();
    const formatted = formatReportForWhatsApp(report);
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    soundFX.playClick();
    const formatted = formatReportForWhatsApp(report);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formatted)}`;
    window.open(url, '_blank');
  };

  const handleSendToInAppChat = () => {
    soundFX.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
    if (onSendToChat) {
      onSendToChat();
    }
    setSentToChatSuccess(true);
  };

  return (
    <div
      id={`weekly-postcard-${report.id}`}
      className="w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white border-2 border-blue-500/40 shadow-2xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* 1. Header Bar: Official Stamp & Date Range */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-serif font-black text-sm shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-xs uppercase text-slate-300">
                SIPARANA ACADEMIC
              </span>
              <span className="px-1.5 py-0.2 rounded-sm bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[9px] font-black">
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] text-blue-200/70 font-mono">
              Official Parental Digest • Sunday Wrap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-amber-300">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{report.weekStartDate} – {report.weekEndDate}</span>
        </div>
      </div>

      {/* 2. Student Identity Row */}
      <div className="relative z-10 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative">
            <img
              src={report.studentAvatar}
              alt={report.studentName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-blue-400/80 shadow-lg shadow-blue-500/20"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[9px] shadow-sm">
              Gr {report.studentGrade}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white truncate tracking-tight">
                {report.studentName}
              </h3>
              <span className="text-base">{report.countryFlag}</span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate">
              {report.studentStream} • {report.schoolOrInstitute}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{report.rankTitle}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {report.streakDays}d Streak Active 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Big Rank Badge */}
        <div className="hidden sm:flex flex-col items-end text-right flex-shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Leaderboard Position
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
              #{report.leaderboardRank}
            </span>
            <span className="text-[11px] text-slate-400">/ {report.totalScholarsCount}</span>
          </div>
        </div>
      </div>

      {/* 3. BIG BOLD COUNTERS GRID */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
        {/* Counter 1: Total Study Hours */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors backdrop-blur-sm">
          <div className="flex items-center justify-between text-blue-300 text-[11px] font-bold mb-1">
            <span>Study Timer Time</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {report.studyHours}<span className="text-sm font-sans font-bold text-blue-300">h</span> {report.studyMinutes}<span className="text-sm font-sans font-bold text-blue-300">m</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            {report.studyTimerSessionsCount} logged focus sessions
          </p>
        </div>

        {/* Counter 2: Total XP Gained */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors backdrop-blur-sm">
          <div className="flex items-center justify-between text-amber-300 text-[11px] font-bold mb-1">
            <span>XP Gained</span>
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight">
            +{report.weeklyXPEarned.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Cumulative: {report.totalXP.toLocaleString()} XP
          </p>
        </div>

        {/* Counter 3: Quizzes Completed */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-colors backdrop-blur-sm">
          <div className="flex items-center justify-between text-emerald-300 text-[11px] font-bold mb-1">
            <span>Quizzes Solved</span>
            <Award className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {report.quizzesCompleted} <span className="text-xs font-sans text-slate-400 font-normal">tests</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Accuracy: <strong className="text-emerald-300">{report.quizAccuracyAvg}%</strong>
          </p>
        </div>

        {/* Counter 4: Lessons & Modules */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-colors backdrop-blur-sm">
          <div className="flex items-center justify-between text-purple-300 text-[11px] font-bold mb-1">
            <span>Curriculum Units</span>
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-300 tracking-tight">
            {report.lessonsCompleted} <span className="text-xs font-sans text-slate-400 font-normal">topics</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Verified syllabus units
          </p>
        </div>
      </div>

      {/* 4. WEEKLY ACHIEVEMENT BADGE SPOTLIGHT */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-800/40 border border-blue-400/30 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 flex-shrink-0 animate-bounce-slow">
          {report.achievementBadge.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">
              Weekly Honor Award
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] text-slate-300">Parental Commendation</span>
          </div>
          <h4 className="text-sm sm:text-base font-black text-white truncate">
            {report.achievementBadge.title} ({report.achievementBadge.titleSi})
          </h4>
          <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2 mt-0.5">
            {report.achievementBadge.description}
          </p>
        </div>
      </div>

      {/* 5. Subject Time Distribution Bar */}
      {!compact && (
        <div className="relative z-10 my-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Subject Study Distribution</span>
            <span className="text-[11px] font-mono text-slate-400">Total: {report.studyHours}h {report.studyMinutes}m</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex shadow-inner">
            {report.subjectBreakdown.map((item, idx) => (
              <div
                key={idx}
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-500 hover:opacity-90"
                title={`${item.subject}: ${item.minutes}m (${item.percentage}%)`}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {report.subjectBreakdown.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[10.5px] text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.subject}</span>
                <span className="text-slate-400 font-mono">({item.minutes}m)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Pedagogical Advice for Parents */}
      <div className="relative z-10 my-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kavi AI Academic Advisory for Parents:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-serif">
          "{report.pedagogicalAdvice.en}"
        </p>
      </div>

      {/* 7. ACTIONS PANEL: Send Report to Parent & Sharing */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {sentToChatSuccess ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Delivered to Parent Chat</span>
            </div>
          ) : (
            <button
              id="btn-send-report-chat"
              type="button"
              onClick={handleSendToInAppChat}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Report to Parent</span>
            </button>
          )}

          {onOpenChatModal && (
            <button
              id="btn-open-parent-chat"
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenChatModal();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Open Parent Chat</span>
            </button>
          )}
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-share-whatsapp"
            type="button"
            onClick={handleShareWhatsApp}
            title="Share Weekly Card on WhatsApp"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            id="btn-copy-report-text"
            type="button"
            onClick={handleCopy}
            title="Copy Report Text for SMS or Direct Message"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
