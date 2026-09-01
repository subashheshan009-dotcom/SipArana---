import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Sparkles, Clock } from 'lucide-react';
import { getFormattedTimeUntilMidnight } from '@/utils/dailyXpLockEngine';
import { soundFX } from '@/utils/audioUtils';

export const GlobalDailyLockToastContainer: React.FC = () => {
  const [toastData, setToastData] = useState<{
    id: number;
    message: string;
  } | null>(null);

  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  useEffect(() => {
    const handleDailyLockToast = (e: CustomEvent<{ message: string; timestamp: number }>) => {
      soundFX.playIncorrect();
      setToastData({
        id: e.detail.timestamp || Date.now(),
        message: e.detail.message
      });
      setTimeUntilReset(getFormattedTimeUntilMidnight());
    };

    window.addEventListener('siparana_daily_lock_toast' as any, handleDailyLockToast as any);
    return () => {
      window.removeEventListener('siparana_daily_lock_toast' as any, handleDailyLockToast as any);
    };
  }, []);

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => {
      setToastData(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastData]);

  if (!toastData) return null;

  return (
    <div
      id="global-daily-lock-toast"
      className="fixed bottom-6 right-6 z-[9999] max-w-md w-[calc(100vw-2rem)] p-4 rounded-3xl bg-slate-900/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-xl text-white animate-in slide-in-from-bottom-5 fade-in duration-300 ring-2 ring-amber-400/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-lg shadow-orange-500/30">
            <ShieldAlert className="w-5 h-5 text-slate-950" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Daily XP Limit Reached
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>Reset in {timeUntilReset || 'Midnight'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {toastData.message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setToastData(null)}
          className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          title="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
