import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppUpdateItem,
  INITIAL_APP_UPDATES,
  SIMULATED_NEW_APP_UPDATES
} from '@/data/updatesData';

interface UpdatesContextType {
  updates: AppUpdateItem[];
  isSyncing: boolean;
  lastSyncTime: Date;
  syncCountdown: number;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  latestPushedUpdate: AppUpdateItem | null;
  mascotUpdateAlertDismissed: boolean;
  dismissMascotUpdateAlert: () => void;
  syncUpdatesNow: () => Promise<void>;
  simulateIncomingUpdateDrop: () => void;
  upvotedIds: string[];
  toggleUpvote: (id: string) => void;
  readUpdateIds: string[];
  markUpdateAsRead: (id: string) => void;
}

const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_UPDATES = 'siparana_app_updates_v2';
const LOCAL_STORAGE_KEY_UPVOTES = 'siparana_app_upvoted_updates';
const LOCAL_STORAGE_KEY_READ_UPDATES = 'siparana_app_read_updates';

export const UpdatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updates, setUpdates] = useState<AppUpdateItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_UPDATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_APP_UPDATES;
  });

  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_UPVOTES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['update_v2_6_live_sync'];
  });

  const [readUpdateIds, setReadUpdateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_READ_UPDATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncCountdown, setSyncCountdown] = useState(55);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [latestPushedUpdate, setLatestPushedUpdate] = useState<AppUpdateItem | null>(() => {
    return INITIAL_APP_UPDATES[0] || null;
  });
  const [mascotUpdateAlertDismissed, setMascotUpdateAlertDismissed] = useState(true);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_UPDATES, JSON.stringify(updates));
    } catch {}
  }, [updates]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_UPVOTES, JSON.stringify(upvotedIds));
    } catch {}
  }, [upvotedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_READ_UPDATES, JSON.stringify(readUpdateIds));
    } catch {}
  }, [readUpdateIds]);

  // Sync execution
  const syncUpdatesNow = useCallback(async () => {
    setIsSyncing(true);
    // Simulate remote git release / GitHub repository roadmap fetch
    await new Promise((res) => setTimeout(res, 900));
    setLastSyncTime(new Date());
    setSyncCountdown(60);
    setIsSyncing(false);
  }, []);

  // Simulate an incoming live update release
  const simulateIncomingUpdateDrop = useCallback(() => {
    const available = SIMULATED_NEW_APP_UPDATES.filter(
      (sim) => !updates.some((u) => u.id === sim.id)
    );

    let newUpdate: AppUpdateItem;
    if (available.length > 0) {
      newUpdate = available[0];
    } else {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newUpdate = {
        id: `update_live_${Date.now()}`,
        version: `v2.${Math.floor(Math.random() * 5) + 7}.0`,
        title: `⚡ Live Feature Drop: Smart O/L & A/L Formula Cheatsheet & Diagram Solver (${timeStr})`,
        titleSinhala: `⚡ සජීවී නිකුතුව: විභාග සූත්‍ර සහ රූපසටහන් ස්වයංක්‍රීය විසඳුම් සහායක (${timeStr})`,
        category: 'Exam Tools',
        releaseDate: 'Just Now (Live Push)',
        badge: 'HOT',
        summary: 'Instant formula lookups for Combined Maths, Physics, Chemistry, and ICT with step-by-step video proofs.',
        summarySinhala: 'උසස් පෙළ සංයුක්ත ගණිතය, භෞතික හා රසායන විද්‍යා සූත්‍ර සහ ආශ්‍රිත ප්‍රශ්න විසඳුම් එකතුව.',
        highlights: [
          {
            en: '100+ interactive diagrams and proof animations.',
            si: 'අන්තර්ක්‍රියාකාරී රූපසටහන් සහ සාධන 100කට අධික සංඛ්‍යාවක්.'
          },
          {
            en: 'Instant copy-to-clipboard for study notes and summaries.',
            si: 'සටහන් පොත් සඳහා ක්ෂණිකව සූත්‍ර පිටපත් කිරීමේ හැකියාව.'
          }
        ],
        affectedModules: ['Subjects', 'Classroom', 'AI Tutor'],
        author: 'SipArana Curriculum Team',
        isBreaking: true,
        upvotesCount: 460
      };
    }

    setUpdates((prev) => [newUpdate, ...prev.filter((p) => p.id !== newUpdate.id)]);
    setLatestPushedUpdate(newUpdate);
    setMascotUpdateAlertDismissed(false);

    // Audio chime cue
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(987.77, audioCtx.currentTime + 0.12); // B5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  }, [updates]);

  // Periodic Automated Sync Countdown
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          syncUpdatesNow();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, syncUpdatesNow]);

  const toggleUpvote = useCallback((id: string) => {
    setUpvotedIds((prev) => {
      const isUpvoted = prev.includes(id);
      const next = isUpvoted ? prev.filter((i) => i !== id) : [...prev, id];
      setUpdates((current) =>
        current.map((u) => {
          if (u.id === id) {
            return {
              ...u,
              upvotesCount: isUpvoted ? u.upvotesCount - 1 : u.upvotesCount + 1
            };
          }
          return u;
        })
      );
      return next;
    });
  }, []);

  const markUpdateAsRead = useCallback((id: string) => {
    setReadUpdateIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const dismissMascotUpdateAlert = useCallback(() => {
    setMascotUpdateAlertDismissed(true);
  }, []);

  return (
    <UpdatesContext.Provider
      value={{
        updates,
        isSyncing,
        lastSyncTime,
        syncCountdown,
        autoSyncEnabled,
        setAutoSyncEnabled,
        latestPushedUpdate,
        mascotUpdateAlertDismissed,
        dismissMascotUpdateAlert,
        syncUpdatesNow,
        simulateIncomingUpdateDrop,
        upvotedIds,
        toggleUpvote,
        readUpdateIds,
        markUpdateAsRead
      }}
    >
      {children}
    </UpdatesContext.Provider>
  );
};

export const useUpdates = (): UpdatesContextType => {
  const context = useContext(UpdatesContext);
  if (!context) {
    throw new Error('useUpdates must be used within an UpdatesProvider');
  }
  return context;
};
