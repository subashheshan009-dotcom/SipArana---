import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  ChevronRight,
  X,
  MessageCircle,
  Share2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  getLatestWeeklyReport,
  isTodaySunday,
  type WeeklyStudyReport
} from '@/services/weeklyReportService';
import { soundFX } from '@/utils/audioUtils';

interface ParentalNotificationBannerProps {
  onOpenReport: (report: WeeklyStudyReport) => void;
  onOpenChat: () => void;
  report?: WeeklyStudyReport | null;
}

export const ParentalNotificationBanner: React.FC<ParentalNotificationBannerProps> = ({
  onOpenReport,
  onOpenChat,
  report
}) => {
  const [dismissed, setDismissed] = useState(false);
  const activeReport = report || getLatestWeeklyReport();

  if (dismissed || !activeReport) return null;

  return (
    <div
      id="parental-notification-banner"
      className="w-full rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-3.5 sm:p-4 border border-blue-400/40 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 min-w-0 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0 animate-pulse">
          <Bell className="w-5 h-5 text-slate-950" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              End-of-Week Summary Ready
            </span>
            <span className="text-[11px] text-blue-200 font-mono">
              {activeReport.weekLabel}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
            "Here is your child's weekly learning performance summary! 🌟"
          </h4>

          <p className="text-[11px] text-blue-100/80 line-clamp-1">
            Logged {activeReport.studyHours}h {activeReport.studyMinutes}m study time • {activeReport.quizzesCompleted} quizzes completed • Rank #{activeReport.leaderboardRank}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 z-10 flex-shrink-0 self-end sm:self-center">
        <button
          id="banner-view-report-btn"
          type="button"
          onClick={() => {
            soundFX.playPop();
            onOpenReport(activeReport);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-black shadow-sm transition flex items-center gap-1 cursor-pointer"
        >
          <span>View Report Card</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          id="banner-open-chat-btn"
          type="button"
          onClick={() => {
            soundFX.playClick();
            onOpenChat();
          }}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-blue-300" />
          <span>Parent Chat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setDismissed(true);
          }}
          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
