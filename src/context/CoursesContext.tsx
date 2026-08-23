import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FreeCourse,
  FREE_COURSES,
  SIMULATED_NEW_COURSES,
  COURSE_AUTHORITIES,
  CourseProviderStatus
} from '@/data/freeCoursesData';

interface CoursesContextType {
  courses: FreeCourse[];
  isSyncing: boolean;
  lastSyncTime: Date;
  syncCountdown: number;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  latestDroppedCourse: FreeCourse | null;
  mascotCourseAlertDismissed: boolean;
  dismissMascotCourseAlert: () => void;
  syncCoursesNow: () => Promise<void>;
  simulateIncomingCourseDrop: () => void;
  bookmarkedIds: string[];
  toggleBookmark: (id: string, title?: string) => void;
  providerStatuses: Record<string, CourseProviderStatus>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COURSES = 'siparana_live_free_courses_v2';
const LOCAL_STORAGE_KEY_SAVED_COURSES = 'siparana_saved_free_courses';

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<FreeCourse[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COURSES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return FREE_COURSES;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED_COURSES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['morax-python-beginner', 'cs50-harvard', 'google-digital-marketing'];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncCountdown, setSyncCountdown] = useState(50);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [latestDroppedCourse, setLatestDroppedCourse] = useState<FreeCourse | null>(null);
  const [mascotCourseAlertDismissed, setMascotCourseAlertDismissed] = useState(true);

  const [providerStatuses, setProviderStatuses] = useState<Record<string, CourseProviderStatus>>(() => {
    const map: Record<string, CourseProviderStatus> = {};
    COURSE_AUTHORITIES.forEach((auth) => {
      map[auth.id] = { ...auth };
    });
    return map;
  });

  // Save courses to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch {}
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SAVED_COURSES, JSON.stringify(bookmarkedIds));
    } catch {}
  }, [bookmarkedIds]);

  // Sync execution
  const syncCoursesNow = useCallback(async () => {
    setIsSyncing(true);
    setProviderStatuses((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], status: 'FETCHING' };
      });
      return next;
    });

    // Simulate network query latency to MOOC providers & Open Course portals
    await new Promise((res) => setTimeout(res, 1100));

    setLastSyncTime(new Date());
    setSyncCountdown(60);
    setIsSyncing(false);

    setProviderStatuses((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = {
          ...next[k],
          status: 'SYNCED',
          pingMs: Math.floor(Math.random() * 25) + 20
        };
      });
      return next;
    });
  }, []);

  // Simulate an incoming live course drop
  const simulateIncomingCourseDrop = useCallback(() => {
    const available = SIMULATED_NEW_COURSES.filter(
      (sim) => !courses.some((c) => c.id === sim.id)
    );

    let newCourse: FreeCourse;
    if (available.length > 0) {
      newCourse = available[0];
    } else {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newCourse = {
        id: `course_live_${Date.now()}`,
        title: `Full-Stack Web & AI Development for Sri Lankan Youth (${timeStr})`,
        titleSinhala: `නොමිලේ Web Development & AI පාඨමාලාව - Moratuwa & Google (${timeStr})`,
        titleTamil: 'இலங்கை மாணவர்களுக்கான முழுமையான இணைய மேம்பாட்டு படிப்பு',
        provider: 'Open University & Google for Education',
        platform: 'OUSL Live Portal',
        category: 'it_programming',
        level: 'Beginner',
        duration: '6 Weeks (Self-Paced)',
        description: 'Comprehensive modern JavaScript, React, Tailwind CSS, and AI API development tailored for O/L and A/L students looking to build their digital portfolios.',
        descriptionSinhala: 'පාසල් සිසුන් සඳහා මුල සිටම Web Design, JavaScript, React සහ AI ඒකාබද්ධ කරමින් නවීන වෙබ් අඩවි නිර්මාණය කිරීමට උගන්වන නොමිලේ පාඨමාලාව.',
        whatYouWillLearn: [
          'Modern frontend design with HTML5, CSS3, and React',
          'Deploying web applications to cloud servers for free',
          'Integrating Gemini and AI APIs into portfolio projects',
          'Free digital certificate recognized by local tech companies'
        ],
        whatYouWillLearnSinhala: [
          'React සහ Tailwind CSS මගින් නවීන වෙබ් අඩවි නිර්මාණය',
          'Cloud මත නොමිලේ වෙබ් අඩවි Host කිරීම',
          'AI තාක්ෂණය වෙබ් අඩවි සඳහා සම්බන්ධ කිරීම',
          'දේශීය තොරතුරු තාක්ෂණ ආයතන පිළිගන්නා නිල සහතිකය'
        ],
        courseUrl: 'https://ou.ac.lk',
        badge: 'Live Drop • Free Certificate',
        freeCertificate: true,
        language: 'Sinhala & English',
        rating: 4.98,
        studentsCount: 'Just Added • 1,200 Enrolled',
        featured: true
      };
    }

    setCourses((prev) => [newCourse, ...prev.filter((p) => p.id !== newCourse.id)]);
    setLatestDroppedCourse(newCourse);
    setMascotCourseAlertDismissed(false);

    // Audio chime cue
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  }, [courses]);

  // Periodic Automated Sync Countdown
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          syncCoursesNow();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, syncCoursesNow]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const dismissMascotCourseAlert = useCallback(() => {
    setMascotCourseAlertDismissed(true);
  }, []);

  return (
    <CoursesContext.Provider
      value={{
        courses,
        isSyncing,
        lastSyncTime,
        syncCountdown,
        autoSyncEnabled,
        setAutoSyncEnabled,
        latestDroppedCourse,
        mascotCourseAlertDismissed,
        dismissMascotCourseAlert,
        syncCoursesNow,
        simulateIncomingCourseDrop,
        bookmarkedIds,
        toggleBookmark,
        providerStatuses
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = (): CoursesContextType => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
