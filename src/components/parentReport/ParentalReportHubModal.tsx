import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  RefreshCw,
  MessageCircle,
  Share2,
  Send,
  History,
  CheckCircle2,
  Clock,
  Zap,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  WeeklyStudyReport,
  generateWeeklyStudyReport,
  getStoredWeeklyReports,
  saveWeeklyReport,
  sendWeeklyReportToParentChat,
  getParentContactInfo
} from '@/services/weeklyReportService';
import { WeeklyProgressPostCard } from './WeeklyProgressPostCard';
import { InAppParentChatModal } from './InAppParentChatModal';
import { useAuth } from '@/context/AuthContext';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface ParentalReportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat?: () => void;
}

export const ParentalReportHubModal: React.FC<ParentalReportHubModalProps> = ({
  isOpen,
  onClose,
  onOpenChat
}) => {
  const { profile } = useAuth();
  const [reports, setReports] = useState<WeeklyStudyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WeeklyStudyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen, profile]);

  const loadReports = async () => {
    let saved = getStoredWeeklyReports();
    if (saved.length === 0) {
      // Auto-generate current week's report if none exist
      setIsGenerating(true);
      const initialReport = await generateWeeklyStudyReport(profile);
      saveWeeklyReport(initialReport);
      saved = [initialReport];
      setIsGenerating(false);
    }
    setReports(saved);
    setSelectedReport(saved[0]);
  };

  const handleGenerateFreshReport = async () => {
    soundFX.playFanfare();
    setIsGenerating(true);
    const fresh = await generateWeeklyStudyReport(profile);
    saveWeeklyReport(fresh);
    setReports((prev) => [fresh, ...prev.filter((r) => r.id !== fresh.id)]);
    setSelectedReport(fresh);
    setIsGenerating(false);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  if (!isOpen) return null;

  const parentInfo = getParentContactInfo();

  return (
    <>
      <div
        id="parental-report-hub-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      >
        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Automated Weekly Study Report for Parents
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Sunday Engine
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Registered Parent: <strong className="text-slate-700 dark:text-slate-300">{parentInfo.parentName}</strong> ({parentInfo.parentPhone})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-recalculate-report"
                type="button"
                onClick={handleGenerateFreshReport}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Metrics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  onClose();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Quick action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50">
              <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  Every Sunday, Siparana aggregates your active timer hours, quiz marks, and XP into this verified performance card.
                </span>
              </div>

              <button
                id="open-parent-chat-from-hub"
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setShowChatModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open In-App Parent Chat</span>
              </button>
            </div>

            {/* Selected Report Post Card */}
            {selectedReport ? (
              <WeeklyProgressPostCard
                report={selectedReport}
                onSendToChat={() => {
                  sendWeeklyReportToParentChat(selectedReport);
                  loadReports();
                }}
                onOpenChatModal={() => setShowChatModal(true)}
              />
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Generating weekly performance metrics...
              </div>
            )}

            {/* History archive picker if multiple weeks exist */}
            {reports.length > 1 && (
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Previous Weekly Reports Archive</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {reports.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedReport(r);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        selectedReport?.id === r.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{r.weekLabel}</span>
                      <span className="text-[10px] opacity-80 font-mono">({r.studyHours}h)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-App Parent Chat Dialog */}
      <InAppParentChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        currentReport={selectedReport}
      />
    </>
  );
};
