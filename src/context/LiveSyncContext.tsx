import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SyncedDiscussionPost {
  id: string;
  authorName: string;
  authorGrade: string;
  authorAvatar: string;
  stream: 'AL_PHYSICAL' | 'AL_BIO' | 'AL_COMMERCE' | 'AL_TECH' | 'AL_ARTS' | 'OL_ALL' | 'GENERAL';
  subject: string;
  title: string;
  content: string;
  createdAt: string;
  timestamp: number;
  upvotes: number;
  hasUpvoted?: boolean;
  replies: SyncedReply[];
  isSolved: boolean;
  verifiedAnswer?: string;
  tags: string[];
}

export interface SyncedReply {
  id: string;
  authorName: string;
  authorRole: 'student' | 'top_ranker' | 'teacher' | 'kavi_ai';
  content: string;
  createdAt: string;
  upvotes: number;
  isVerified?: boolean;
}

export interface SyncedGoal {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  completed: boolean;
  xpReward: number;
  createdAt: string;
}

export interface SyncedStudySlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  subject: string;
  topic: string;
  type: 'theory' | 'past_paper' | 'revision' | 'quiz' | 'break';
  durationMinutes: number;
  isDone: boolean;
}

interface LiveSyncContextType {
  isSyncing: boolean;
  lastSyncedAt: Date;
  activeOnlineStudents: number;
  syncStatus: 'synced' | 'syncing' | 'offline';
  posts: SyncedDiscussionPost[];
  goals: SyncedGoal[];
  studySlots: SyncedStudySlot[];
  addPost: (post: Omit<SyncedDiscussionPost, 'id' | 'createdAt' | 'timestamp' | 'upvotes' | 'replies' | 'isSolved'>) => void;
  upvotePost: (postId: string) => void;
  addReply: (postId: string, content: string, asAi?: boolean) => void;
  markPostSolved: (postId: string, verifiedAnswerId?: string) => void;
  addGoal: (goal: Omit<SyncedGoal, 'id' | 'completed' | 'createdAt'>) => void;
  toggleGoal: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  updateStudySlots: (slots: SyncedStudySlot[]) => void;
  toggleStudySlot: (slotId: string) => void;
  triggerManualSync: () => void;
}

const INITIAL_POSTS: SyncedDiscussionPost[] = [
  {
    id: 'post-1',
    authorName: 'Kasun Bandara',
    authorGrade: 'Grade 13 (2026 A/L)',
    authorAvatar: 'KB',
    stream: 'AL_PHYSICAL',
    subject: 'Combined Mathematics',
    title: 'How to efficiently solve integration of rational functions with irreducible quadratics?',
    content: 'In 2022 A/L Past Paper Part B Question 11, there is a partial fraction split involving (x^2 + 4). What is the fastest standard substitution to avoid lengthy algebraic manipulation?',
    createdAt: '5 mins ago',
    timestamp: Date.now() - 300000,
    upvotes: 24,
    isSolved: true,
    tags: ['Integration', 'Past Papers', 'Pure Maths'],
    replies: [
      {
        id: 'rep-1',
        authorName: 'Dilshan Silva (Island Rank 4 - 2024)',
        authorRole: 'top_ranker',
        content: 'Use standard substitution x = 2*tan(theta) or write the numerator as A*(derivative of denominator) + B. This splits it instantly into ln(denominator) and arctan.',
        createdAt: '3 mins ago',
        upvotes: 18,
        isVerified: true
      },
      {
        id: 'rep-2',
        authorName: 'Kavi Owl AI Tutor 🦉',
        authorRole: 'kavi_ai',
        content: 'Great insight! Remember: for ∫ (Px+Q)/(ax²+bx+c) dx, always force Px+Q = (P/2a)(2ax+b) + [Q - Pb/(2a)] to break it into logarithmic and standard arctan forms effortlessly.',
        createdAt: '1 min ago',
        upvotes: 12,
        isVerified: true
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Nethmi Wijesinghe',
    authorGrade: 'Grade 13 (2026 A/L)',
    authorAvatar: 'NW',
    stream: 'AL_BIO',
    subject: 'Biology',
    title: 'Easy mnemonic or flowchart for Calvin Cycle (Light-independent reactions)?',
    content: 'I frequently confuse the regeneration of RuBP with the reduction of 3-PGA to G3P. How do you guys memorize the exact ATP and NADPH counts for 1 glucose molecule?',
    createdAt: '18 mins ago',
    timestamp: Date.now() - 1080000,
    upvotes: 31,
    isSolved: true,
    tags: ['Photosynthesis', 'Resource Book', 'Bio Unit 2'],
    replies: [
      {
        id: 'rep-3',
        authorName: 'Dr. Anuradha Senanayake',
        authorRole: 'teacher',
        content: 'Rule of 3s & 6s: For 1 G3P export, it takes 3 CO₂, 9 ATP, and 6 NADPH. For 1 complete Glucose (2 G3P), double everything: 6 CO₂, 18 ATP, 12 NADPH. Fix this table in your short notes!',
        createdAt: '12 mins ago',
        upvotes: 27,
        isVerified: true
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Thevakanthan S.',
    authorGrade: 'Grade 11 (2026 O/L)',
    authorAvatar: 'TS',
    stream: 'OL_ALL',
    subject: 'Science',
    title: 'Electrolysis of acidified water - cathode vs anode gas volume ratio explanation',
    content: 'Why is the volume of gas collected at the cathode twice the volume collected at the anode? How should I structure the 4-mark answer for O/L Science Part 2?',
    createdAt: '42 mins ago',
    timestamp: Date.now() - 2520000,
    upvotes: 15,
    isSolved: false,
    tags: ['Chemistry', 'Grade 11', 'O/L Science'],
    replies: [
      {
        id: 'rep-4',
        authorName: 'Kavi Owl AI Tutor 🦉',
        authorRole: 'kavi_ai',
        content: 'Formula key: 2H₂O(l) → 2H₂(g) + O₂(g). At Cathode (reduction): 2H⁺ + 2e⁻ → H₂. At Anode (oxidation): 4OH⁻ → O₂ + 2H₂O + 4e⁻. Stoichiometric mole ratio of H₂ : O₂ is 2 : 1, which by Avogadro\'s law gives a 2:1 volume ratio!',
        createdAt: '30 mins ago',
        upvotes: 9,
        isVerified: true
      }
    ]
  }
];

const INITIAL_GOALS: SyncedGoal[] = [
  {
    id: 'goal-1',
    title: 'Complete 25 MCQ Questions on Physics Waves & Sound',
    category: 'Physics',
    priority: 'high',
    estimatedMinutes: 45,
    completed: true,
    xpReward: 50,
    createdAt: 'Today, 08:00 AM'
  },
  {
    id: 'goal-2',
    title: 'Review Chemistry Organic Reactions Functional Groups',
    category: 'Chemistry',
    priority: 'high',
    estimatedMinutes: 30,
    completed: false,
    xpReward: 40,
    createdAt: 'Today, 09:30 AM'
  },
  {
    id: 'goal-3',
    title: 'Do 20 mins of Spaced Repetition Flashcards on Biology Unit 3',
    category: 'Biology',
    priority: 'medium',
    estimatedMinutes: 20,
    completed: false,
    xpReward: 30,
    createdAt: 'Today, 11:00 AM'
  },
  {
    id: 'goal-4',
    title: 'Listen to Audio Summary on Sri Lankan History Key Eras',
    category: 'General',
    priority: 'low',
    estimatedMinutes: 15,
    completed: false,
    xpReward: 25,
    createdAt: 'Today, 01:15 PM'
  }
];

const INITIAL_STUDY_SLOTS: SyncedStudySlot[] = [
  { id: 's-1', day: 'Mon', time: '06:00 - 07:30 AM', subject: 'Combined Maths / Science', topic: 'Theory & Complex Derivations', type: 'theory', durationMinutes: 90, isDone: true },
  { id: 's-2', day: 'Mon', time: '04:00 - 05:30 PM', subject: 'Physics / English', topic: 'Structured Essay & Past Papers', type: 'past_paper', durationMinutes: 90, isDone: false },
  { id: 's-3', day: 'Mon', time: '07:30 - 08:30 PM', subject: 'Chemistry / History', topic: 'Smart Flashcard Rapid Drill', type: 'revision', durationMinutes: 60, isDone: false },
  { id: 's-4', day: 'Tue', time: '06:00 - 07:30 AM', subject: 'Biology / Commerce', topic: 'High-Yield Resource Book Notes', type: 'theory', durationMinutes: 90, isDone: false },
  { id: 's-5', day: 'Tue', time: '04:00 - 05:30 PM', subject: 'Combined Maths / ICT', topic: 'Model Paper Speed Test', type: 'quiz', durationMinutes: 90, isDone: false },
  { id: 's-6', day: 'Wed', time: '06:00 - 07:30 AM', subject: 'Physics / Sinhala', topic: 'Mechanics & Applied Theory', type: 'theory', durationMinutes: 90, isDone: false },
  { id: 's-7', day: 'Thu', time: '06:00 - 07:30 AM', subject: 'Chemistry / Business Studies', topic: 'Organic Pathways & Analysis', type: 'theory', durationMinutes: 90, isDone: false },
  { id: 's-8', day: 'Fri', time: '06:00 - 07:30 AM', subject: 'All Subjects', topic: 'Weekly Revision & Weak Topic Mastery', type: 'revision', durationMinutes: 90, isDone: false },
  { id: 's-9', day: 'Sat', time: '08:00 - 11:00 AM', subject: 'Full Mock Exam', topic: 'Timed 3-Hour Exam Simulation', type: 'past_paper', durationMinutes: 180, isDone: false },
  { id: 's-10', day: 'Sun', time: '09:00 - 10:30 AM', subject: 'Study Group Review', topic: 'Peer Discussion & AI Question Solving', type: 'revision', durationMinutes: 90, isDone: false }
];

const LiveSyncContext = createContext<LiveSyncContextType | undefined>(undefined);

export function LiveSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [activeOnlineStudents, setActiveOnlineStudents] = useState(1482);

  const [posts, setPosts] = useState<SyncedDiscussionPost[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_synced_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [goals, setGoals] = useState<SyncedGoal[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_synced_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [studySlots, setStudySlots] = useState<SyncedStudySlot[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_synced_schedule');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_SLOTS;
    } catch {
      return INITIAL_STUDY_SLOTS;
    }
  });

  // Save to local persistence
  useEffect(() => {
    try {
      localStorage.setItem('siparana_synced_posts', JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('siparana_synced_goals', JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('siparana_synced_schedule', JSON.stringify(studySlots));
    } catch {
      // ignore
    }
  }, [studySlots]);

  // Real-time background sync simulation (fluctuates active students & checks background state)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setSyncStatus('syncing');

      // Random jitter for realistic live presence
      setActiveOnlineStudents(prev => {
        const delta = Math.floor(Math.random() * 11) - 5;
        return Math.max(1200, Math.min(2500, prev + delta));
      });

      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      }, 750);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const triggerManualSync = useCallback(() => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    }, 600);
  }, []);

  const addPost = useCallback((postData: Omit<SyncedDiscussionPost, 'id' | 'createdAt' | 'timestamp' | 'upvotes' | 'replies' | 'isSolved'>) => {
    const newPost: SyncedDiscussionPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: 'Just now',
      timestamp: Date.now(),
      upvotes: 1,
      hasUpvoted: true,
      isSolved: false,
      replies: []
    };

    setPosts(prev => [newPost, ...prev]);
    triggerManualSync();

    // Auto-generate a helpful Kavi Owl AI reply after 3 seconds for student delight
    setTimeout(() => {
      const kaviReply: SyncedReply = {
        id: `rep-ai-${Date.now()}`,
        authorName: 'Kavi Owl AI Study Buddy 🦉',
        authorRole: 'kavi_ai',
        content: `Hoot! 🦉 I analyzed your question on "${postData.subject}". Here is a helpful tip to get you started: Break down the given data into standard SI units, write the governing formula, and check past marking schemes for similar step marks. Fellow students and mentors will also answer shortly!`,
        createdAt: 'Just now',
        upvotes: 3,
        isVerified: true
      };

      setPosts(currentPosts =>
        currentPosts.map(p =>
          p.id === newPost.id ? { ...p, replies: [...p.replies, kaviReply] } : p
        )
      );
    }, 3500);
  }, [triggerManualSync]);

  const upvotePost = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasUpvoted = p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUpvoted
          };
        }
        return p;
      })
    );
  }, []);

  const addReply = useCallback((postId: string, content: string, asAi: boolean = false) => {
    const newReply: SyncedReply = {
      id: `rep-${Date.now()}`,
      authorName: asAi ? 'Kavi Owl AI Study Buddy 🦉' : 'You (Student)',
      authorRole: asAi ? 'kavi_ai' : 'student',
      content,
      createdAt: 'Just now',
      upvotes: 1,
      isVerified: asAi
    };

    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p))
    );
    triggerManualSync();
  }, [triggerManualSync]);

  const markPostSolved = useCallback((postId: string, verifiedAnswerId?: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isSolved: true,
            replies: p.replies.map(r =>
              r.id === verifiedAnswerId ? { ...r, isVerified: true } : r
            )
          };
        }
        return p;
      })
    );
  }, []);

  const addGoal = useCallback((goalData: Omit<SyncedGoal, 'id' | 'completed' | 'createdAt'>) => {
    const newGoal: SyncedGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      completed: false,
      createdAt: 'Today, Just now'
    };
    setGoals(prev => [newGoal, ...prev]);
    triggerManualSync();
  }, [triggerManualSync]);

  const toggleGoal = useCallback((goalId: string) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const updateStudySlots = useCallback((slots: SyncedStudySlot[]) => {
    setStudySlots(slots);
    triggerManualSync();
  }, [triggerManualSync]);

  const toggleStudySlot = useCallback((slotId: string) => {
    setStudySlots(prev =>
      prev.map(s => (s.id === slotId ? { ...s, isDone: !s.isDone } : s))
    );
  }, []);

  return (
    <LiveSyncContext.Provider
      value={{
        isSyncing,
        lastSyncedAt,
        activeOnlineStudents,
        syncStatus,
        posts,
        goals,
        studySlots,
        addPost,
        upvotePost,
        addReply,
        markPostSolved,
        addGoal,
        toggleGoal,
        deleteGoal,
        updateStudySlots,
        toggleStudySlot,
        triggerManualSync
      }}
    >
      {children}
    </LiveSyncContext.Provider>
  );
}

export function useLiveSync() {
  const context = useContext(LiveSyncContext);
  if (!context) {
    throw new Error('useLiveSync must be used within a LiveSyncProvider');
  }
  return context;
}
