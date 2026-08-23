import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  OfficialCircularItem,
  INITIAL_OFFICIAL_NOTICES,
  SIMULATED_NEW_ALERTS,
  OFFICIAL_AUTHORITIES
} from '@/data/examNewsData';

interface AuthorityStatus {
  status: 'ONLINE' | 'FETCHING' | 'SYNCED';
  lastCount: number;
  pingMs: number;
}

interface NewsContextType {
  notices: OfficialCircularItem[];
  isSyncing: boolean;
  lastSyncTime: Date;
  syncCountdown: number;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  latestBreakingNotice: OfficialCircularItem | null;
  mascotAlertDismissed: boolean;
  dismissMascotAlert: () => void;
  showMascotAlertFor: (notice: OfficialCircularItem) => void;
  syncNow: () => Promise<void>;
  simulateIncomingDrop: () => void;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  readIds: string[];
  markAsRead: (id: string) => void;
  authorityStatuses: Record<string, AuthorityStatus>;
  speakNotice: (text: string, lang?: 'si' | 'ta' | 'en') => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_NOTICES = 'siparana_official_exam_notices_v2';
const LOCAL_STORAGE_KEY_BOOKMARKS = 'siparana_bookmarked_notices_v2';
const LOCAL_STORAGE_KEY_READS = 'siparana_read_notices_v2';

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<OfficialCircularItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTICES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_OFFICIAL_NOTICES;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['notice_doe_al2026_timetable'];
  });

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_READS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncCountdown, setSyncCountdown] = useState(45);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [latestBreakingNotice, setLatestBreakingNotice] = useState<OfficialCircularItem | null>(() => {
    return INITIAL_OFFICIAL_NOTICES.find(n => n.isBreaking) || INITIAL_OFFICIAL_NOTICES[0];
  });
  const [mascotAlertDismissed, setMascotAlertDismissed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [authorityStatuses, setAuthorityStatuses] = useState<Record<string, AuthorityStatus>>({
    DOENETS: { status: 'SYNCED', lastCount: 2, pingMs: 42 },
    MOE: { status: 'SYNCED', lastCount: 1, pingMs: 58 },
    UGC: { status: 'SYNCED', lastCount: 1, pingMs: 65 },
    NIE: { status: 'SYNCED', lastCount: 1, pingMs: 38 }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTICES, JSON.stringify(notices));
    } catch {}
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch {}
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_READS, JSON.stringify(readIds));
    } catch {}
  }, [readIds]);

  // Sync execution
  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    setAuthorityStatuses({
      DOENETS: { status: 'FETCHING', lastCount: 2, pingMs: 45 },
      MOE: { status: 'FETCHING', lastCount: 1, pingMs: 60 },
      UGC: { status: 'FETCHING', lastCount: 1, pingMs: 68 },
      NIE: { status: 'FETCHING', lastCount: 1, pingMs: 40 }
    });

    // Simulate network latency fetching RSS/Gov portals
    await new Promise((res) => setTimeout(res, 1200));

    setLastSyncTime(new Date());
    setSyncCountdown(60);
    setIsSyncing(false);

    setAuthorityStatuses({
      DOENETS: { status: 'SYNCED', lastCount: 2, pingMs: Math.floor(Math.random() * 20) + 30 },
      MOE: { status: 'SYNCED', lastCount: 1, pingMs: Math.floor(Math.random() * 25) + 40 },
      UGC: { status: 'SYNCED', lastCount: 1, pingMs: Math.floor(Math.random() * 30) + 50 },
      NIE: { status: 'SYNCED', lastCount: 1, pingMs: Math.floor(Math.random() * 20) + 35 }
    });
  }, []);

  // Simulate an incoming live drop
  const simulateIncomingDrop = useCallback(() => {
    // Pick an un-added simulation alert
    const available = SIMULATED_NEW_ALERTS.filter(
      (sim) => !notices.some((n) => n.id === sim.id)
    );

    let newAlert: OfficialCircularItem;
    if (available.length > 0) {
      newAlert = available[0];
    } else {
      // Create dynamically generated live alert
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newAlert = {
        id: `notice_live_${Date.now()}`,
        title: `⚡ Breaking Exam Circular: Examination Centers Allocation List (${timeStr})`,
        titleSinhala: `⚡ සජීවී නිවේදනය: විභාග මධ්‍යස්ථාන නාමලේඛනය සහ කාර්යමණ්ඩල උපදෙස් (${timeStr})`,
        source: 'Department of Examinations',
        authorityCode: 'DOENETS',
        publishedDate: 'Just Now (Live Sync)',
        effectiveDate: 'Immediate Effect',
        refNumber: `DOENETS/CIRCULAR/2026/${Math.floor(Math.random() * 800) + 100}`,
        category: 'Exam Notice',
        summary: 'The Department of Examinations has issued an urgent operational circular regarding emergency examination centers, medical room allocations, and special candidate seating arrangements.',
        sinhalaSummary: 'හදිසි විභාග මධ්‍යස්ථාන සහ විශේෂ අවශ්‍යතා සහිත සිසුන්ගේ ආසන පැනවීම් පිළිබඳ නවතම විභාග දෙපාර්තමේන්තු චක්‍රලේඛය නිකුත් විය.',
        tamilSummary: 'அவசர பரீட்சை நிலையங்கள் மற்றும் சிறப்பு ஒழுங்குகள் குறித்த அறிவிப்பு.',
        fullContent: `GOVERNMENT OF SRI LANKA - DEPARTMENT OF EXAMINATIONS
OFFICIAL ALERT - LIVE BROADCAST (${timeStr})

To all Provincial Directors and Chief Custodians of Examination Centers.
This circular confirms center preparedness and emergency protocols.
For inquiries, contact hotline: 1911.`,
        isUrgent: true,
        isBreaking: true,
        importance: 'CRITICAL',
        targetAudience: 'All Candidates, Invigilators & Principals',
        pdfDownloadUrl: 'https://doenets.lk/downloads/circulars/Exam_Centers_2026.pdf',
        linkUrl: 'https://doenets.lk',
        tags: ['Breaking', 'Centers', 'doenets.lk', 'Urgent Notice'],
        readCount: 1500
      };
    }

    setNotices((prev) => [newAlert, ...prev.filter((p) => p.id !== newAlert.id)]);
    setLatestBreakingNotice(newAlert);
    setMascotAlertDismissed(false);

    // Audio chime cue
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  }, [notices]);

  // Periodic Automated Sync Countdown
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          syncNow();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, syncNow]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const dismissMascotAlert = useCallback(() => {
    setMascotAlertDismissed(true);
  }, []);

  const showMascotAlertFor = useCallback((notice: OfficialCircularItem) => {
    setLatestBreakingNotice(notice);
    setMascotAlertDismissed(false);
  }, []);

  // Text-to-speech engine
  const speakNotice = useCallback((text: string, lang: 'si' | 'ta' | 'en' = 'en') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (lang === 'si') {
      utterance.lang = 'si-LK';
    } else if (lang === 'ta') {
      utterance.lang = 'ta-LK';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <NewsContext.Provider
      value={{
        notices,
        isSyncing,
        lastSyncTime,
        syncCountdown,
        autoSyncEnabled,
        setAutoSyncEnabled,
        latestBreakingNotice,
        mascotAlertDismissed,
        dismissMascotAlert,
        showMascotAlertFor,
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
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useExamNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useExamNews must be used within a NewsProvider');
  }
  return context;
};
