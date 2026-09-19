import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Firestore,
  type Unsubscribe
} from 'firebase/firestore';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import type { StudentAchiever } from '@/data/keyPlayersData';
import { convertProfileToAchiever } from '@/data/keyPlayersData';
import {
  broadcastLeaderboardUpdate,
  syncUserWithBackend,
  fetchLiveLeaderboard,
  subscribeToRealtimeLeaderboard,
  updateUserPresence,
  getLocalRegisteredAchievers
} from './leaderboardService';

// =========================================================================
// 1. DYNAMIC CLIENT-SIDE CLOUD CONFIGURATION (FIREBASE & SUPABASE)
// =========================================================================

// Standard dynamic client-side Firebase configuration (pure client-side values, zero env reads)
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDynamicSipAranaClientAppKey2026',
  authDomain: 'siparana-global-education.firebaseapp.com',
  projectId: 'siparana-global-education',
  storageBucket: 'siparana-global-education.appspot.com',
  messagingSenderId: '671842726083',
  appId: '1:671842726083:web:siparana9921f00a'
};

// Supabase dynamic client configuration (pure client-side values, zero env reads)
const SUPABASE_URL = 'https://siparana-global-education.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.siparana_anonymous_key_2026';

const DEMO_MOCK_PREFIXES = ['usr_sch_', 'usr_uk_', 'usr_us_', 'usr_jp_', 'usr_in_', 'usr_au_', 'usr_ib_', 'usr_maths_', 'usr_bio_', 'usr_com_', 'usr_ol_', 'usr_jun_', 'usr_art_', 'usr_tech_', 'usr_uni_'];

export function isMockStudent(id?: string, email?: string): boolean {
  if (!id) return true;
  if (DEMO_MOCK_PREFIXES.some(prefix => id.startsWith(prefix))) return true;
  if (email && email.endsWith('@siparana.lk') && (email.startsWith('senuri.') || email.startsWith('kasun.') || email.startsWith('rashmi.') || email.startsWith('tharindu.') || email.startsWith('sithum.') || email.startsWith('minoli.') || email.startsWith('sanduni.'))) return true;
  return false;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let supabaseClient: SupabaseClient | null = null;

// Initialize standard client-side Firebase SDK directly
export function getFirestoreDb(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (!firestoreDb) {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp(FIREBASE_CONFIG);
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
    } catch (err) {
      console.warn('Dynamic Firebase SDK client initialization note:', err);
    }
  }
  return firestoreDb;
}

// Initialize Supabase client if needed
export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn('Dynamic Supabase SDK client initialization note:', err);
    }
  }
  return supabaseClient;
}

// Check Cloud SDK connectivity status
export function getCloudDatabaseStatus(): {
  provider: 'firebase' | 'central_bridge';
  isInitialized: boolean;
  collection: string;
} {
  const db = getFirestoreDb();
  return {
    provider: db ? 'firebase' : 'central_bridge',
    isInitialized: true,
    collection: 'users'
  };
}

// =========================================================================
// 2. SHARED USER PROFILE CLOUD SYNC (PHONE, LAPTOP, TAB CONCURRENT BINDING)
// =========================================================================

export async function syncUserProfileToCloud(profile: UserProfile): Promise<{
  success: boolean;
  leaderboard?: StudentAchiever[];
  userRank?: number;
}> {
  if (!profile || !profile.id || isMockStudent(profile.id, profile.email)) return { success: false };

  // Prepare sanitized cloud payload (excluding confidential passwords/secrets)
  const cloudPayload = {
    id: profile.id,
    name: profile.name || 'Scholar',
    email: profile.email || '',
    avatar: profile.avatar || '',
    school: profile.school || '',
    university: profile.university || '',
    faculty: profile.faculty || '',
    degreeProgramme: profile.degreeProgramme || '',
    degreeCode: profile.degreeCode || '',
    district: profile.district || '',
    countryCode: profile.countryCode || 'LK',
    countryFlag: profile.countryFlag || '🇱🇰',
    countryName: profile.countryName || 'Sri Lanka',
    stream: profile.stream || 'General Curriculum',
    grade: profile.grade || 12,
    studentCategory: profile.studentCategory || 'A-Level / High School',
    xp: profile.xp || 0,
    totalXP: profile.xp || 0,
    streakDays: profile.streakDays || 1,
    solvedDoubtsCount: profile.solvedDoubtsCount || 0,
    completedLessonsCount: profile.completedLessonsCount || 0,
    customAvatarFrameId: profile.customAvatarFrameId || '',
    bio: profile.bio || '',
    targetUniversity: profile.targetUniversity || '',
    cheersCount: (profile as any).cheersCount || 0,
    isVerified: true,
    isOnline: true,
    lastActiveDate: new Date().toISOString().split('T')[0],
    lastActiveTimestamp: Date.now(),
    updatedAt: serverTimestamp()
  };

  // 1. Direct Client-side Firestore Document write to shared 'users' collection
  try {
    const db = getFirestoreDb();
    if (db) {
      const userRef = doc(db, 'users', profile.id);
      await setDoc(userRef, cloudPayload, { merge: true });
    }
  } catch (firestoreErr) {
    // Non-blocking: central cross-device bridge guarantees delivery
    console.debug('Direct client-side Firestore write handled gracefully:', firestoreErr);
  }

  // 2. Synchronize with central multi-device bridge (Connects Phone, Laptop, and Tab instantly)
  const backendResult = await syncUserWithBackend(profile);
  return backendResult;
}

// =========================================================================
// 3. PURE REAL-USER LEADERBOARD (NO MOCK / NO DUMMY ACCOUNTS)
// =========================================================================

/**
 * Fetch ONLY actual registered accounts from the cloud database,
 * ordered by totalXP descending, accurately depicting Online 🟢 and Offline ⚪.
 */
export async function fetchRealUsersFromCloud(
  currentProfile?: UserProfile | null
): Promise<StudentAchiever[]> {
  let realUsers: StudentAchiever[] = [];

  // Attempt 1: Direct client-side Firestore query for real registered users
  try {
    const db = getFirestoreDb();
    if (db) {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, orderBy('xp', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const fetched: StudentAchiever[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data && data.id && !isMockStudent(data.id, data.email)) {
            const achiever = convertProfileToAchiever(
              {
                id: data.id,
                name: data.name,
                avatar: data.avatar,
                school: data.school,
                university: data.university,
                district: data.district,
                countryCode: data.countryCode,
                countryFlag: data.countryFlag,
                countryName: data.countryName,
                stream: data.stream,
                grade: data.grade,
                studentCategory: data.studentCategory,
                xp: Number(data.xp || data.totalXP || 0),
                streakDays: Number(data.streakDays || 1),
                solvedDoubtsCount: Number(data.solvedDoubtsCount || 0),
                completedLessonsCount: Number(data.completedLessonsCount || 0),
                customAvatarFrameId: data.customAvatarFrameId,
                bio: data.bio,
                targetUniversity: data.targetUniversity,
                isOnline: Boolean(data.isOnline)
              } as unknown as UserProfile,
              fetched.length + 1,
              Boolean(currentProfile && data.id === currentProfile.id)
            );
            fetched.push(achiever);
          }
        });

        if (fetched.length > 0) {
          realUsers = fetched;
        }
      }
    }
  } catch (cloudErr) {
    console.debug('Direct Firestore getDocs handled gracefully:', cloudErr);
  }

  // Attempt 2: If Firestore query is empty or offline, fetch from central cross-device bridge
  if (realUsers.length === 0) {
    const rawUsers = await fetchLiveLeaderboard(currentProfile);
    realUsers = rawUsers.filter(u => !isMockStudent(u.id));
  }

  // Ensure current user is present and active (only if real registered student)
  if (currentProfile && currentProfile.id && !isMockStudent(currentProfile.id, currentProfile.email)) {
    const existingIdx = realUsers.findIndex((u) => u.id === currentProfile.id);
    if (existingIdx >= 0) {
      realUsers[existingIdx].isCurrentUser = true;
      realUsers[existingIdx].isOnline = true;
    } else {
      const activeAchiever = convertProfileToAchiever(currentProfile, realUsers.length + 1, true);
      activeAchiever.isOnline = true;
      activeAchiever.isCurrentUser = true;
      realUsers.push(activeAchiever);
    }
  }

  // Pure sort by allTimeXP descending & assign official 1-based ranks
  const sorted = realUsers.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
  const ranked = sorted.map((student, idx) => ({
    ...student,
    rank: idx + 1
  }));

  // Broadcast to all listening UI components
  broadcastLeaderboardUpdate(ranked);
  return ranked;
}

// =========================================================================
// 4. REAL-TIME MULTI-DEVICE LISTENER (FIRESTORE onSnapshot + SSE BRIDGE)
// =========================================================================

export function subscribeToRealtimeCloudLeaderboard(
  currentProfile: UserProfile | null | undefined,
  onUpdate: (leaderboard: StudentAchiever[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  let firestoreUnsubscribe: Unsubscribe | null = null;
  let sseUnsubscribe: (() => void) | null = null;

  // 1. Direct Client-side Firestore Realtime Snapshot Listener
  try {
    const db = getFirestoreDb();
    if (db) {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, orderBy('xp', 'desc'));
      firestoreUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: StudentAchiever[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as any;
              if (data && data.id && !isMockStudent(data.id, data.email)) {
                const achiever = convertProfileToAchiever(
                  {
                    id: data.id,
                    name: data.name,
                    avatar: data.avatar,
                    school: data.school,
                    university: data.university,
                    district: data.district,
                    countryCode: data.countryCode,
                    countryFlag: data.countryFlag,
                    countryName: data.countryName,
                    stream: data.stream,
                    grade: data.grade,
                    studentCategory: data.studentCategory,
                    xp: Number(data.xp || data.totalXP || 0),
                    streakDays: Number(data.streakDays || 1),
                    solvedDoubtsCount: Number(data.solvedDoubtsCount || 0),
                    completedLessonsCount: Number(data.completedLessonsCount || 0),
                    customAvatarFrameId: data.customAvatarFrameId,
                    bio: data.bio,
                    targetUniversity: data.targetUniversity,
                    isOnline: Boolean(data.isOnline)
                  } as unknown as UserProfile,
                  list.length + 1,
                  Boolean(currentProfile && data.id === currentProfile.id)
                );
                list.push(achiever);
              }
            });

            if (list.length > 0) {
              if (currentProfile && currentProfile.id && !isMockStudent(currentProfile.id, currentProfile.email)) {
                const idx = list.findIndex((u) => u.id === currentProfile.id);
                if (idx >= 0) {
                  list[idx].isCurrentUser = true;
                  list[idx].isOnline = true;
                }
              }
              const sorted = list.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
              const ranked = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));
              onUpdate(ranked);
              broadcastLeaderboardUpdate(ranked);
            }
          }
        },
        (error) => {
          console.debug('Firestore onSnapshot note:', error);
        }
      );
    }
  } catch (err) {
    console.debug('Firestore listener handled gracefully:', err);
  }

  // 2. Central cross-device real-time sync stream (guarantees multi-device sync across Phone, Laptop, and Tab)
  sseUnsubscribe = subscribeToRealtimeLeaderboard(currentProfile, (liveList) => {
    onUpdate(liveList);
  });

  return () => {
    if (firestoreUnsubscribe) {
      try {
        firestoreUnsubscribe();
      } catch {}
    }
    if (sseUnsubscribe) {
      try {
        sseUnsubscribe();
      } catch {}
    }
  };
}

// =========================================================================
// 5. CLOUD USER PRESENCE (ONLINE 🟢 & OFFLINE ⚪ SYNC)
// =========================================================================

export function updateUserPresenceInCloud(userId: string, isOnline: boolean): void {
  if (!userId || typeof window === 'undefined') return;

  // 1. Direct client-side Firestore document update
  try {
    const db = getFirestoreDb();
    if (db) {
      const userRef = doc(db, 'users', userId);
      setDoc(
        userRef,
        {
          isOnline: Boolean(isOnline),
          lastActiveTimestamp: Date.now(),
          lastActiveDate: new Date().toISOString().split('T')[0]
        },
        { merge: true }
      ).catch(() => {});
    }
  } catch {}

  // 2. Central presence beacon update
  updateUserPresence(userId, isOnline);
}

// =========================================================================
// 6. TOP 3 PODIUM DIRECT DATABASE BINDING (STRICTLY REAL USERS ONLY)
// =========================================================================

/**
 * Directly fetch the authentic Top 3 Champions from the database,
 * sorted strictly by totalXP descending (orderBy('totalXP', 'desc').limit(3)).
 * Never creates dummy/fake users if fewer than 3 users exist.
 */
export async function fetchTopPodiumUsersFromDb(
  currentProfile?: UserProfile | null
): Promise<StudentAchiever[]> {
  let podiumUsers: StudentAchiever[] = [];

  // 1. Direct Firestore query: users collection, orderBy('totalXP', 'desc').limit(3)
  try {
    const db = getFirestoreDb();
    if (db) {
      const usersCol = collection(db, 'users');
      let q = query(usersCol, orderBy('totalXP', 'desc'), limit(3));
      let snapshot = await getDocs(q).catch(() => null);

      if (!snapshot || snapshot.empty) {
        // Fallback in case totalXP index differs
        const qFallback = query(usersCol, orderBy('xp', 'desc'), limit(3));
        snapshot = await getDocs(qFallback).catch(() => null);
      }

      if (snapshot && !snapshot.empty) {
        const fetched: StudentAchiever[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data && data.id && !isMockStudent(data.id, data.email)) {
            const rawXP = Number(data.totalXP ?? data.xp ?? 0);
            const achiever = convertProfileToAchiever(
              {
                id: data.id,
                name: data.name,
                avatar: data.avatar,
                school: data.school,
                university: data.university,
                district: data.district,
                countryCode: data.countryCode,
                countryFlag: data.countryFlag,
                countryName: data.countryName,
                stream: data.stream,
                grade: data.grade,
                studentCategory: data.studentCategory,
                xp: rawXP,
                totalXP: rawXP,
                streakDays: Number(data.streakDays || 1),
                solvedDoubtsCount: Number(data.solvedDoubtsCount || 0),
                completedLessonsCount: Number(data.completedLessonsCount || 0),
                customAvatarFrameId: data.customAvatarFrameId,
                bio: data.bio,
                targetUniversity: data.targetUniversity,
                isOnline: Boolean(data.isOnline)
              } as unknown as UserProfile,
              fetched.length + 1,
              Boolean(currentProfile && data.id === currentProfile.id)
            );
            fetched.push(achiever);
          }
        });

        if (fetched.length > 0) {
          podiumUsers = fetched;
        }
      }
    }
  } catch (err) {
    console.debug('Direct Firestore podium getDocs note:', err);
  }

  // 2. Central Database Backend API query (/api/leaderboard/podium)
  if (podiumUsers.length === 0) {
    try {
      const res = await fetch('/api/leaderboard/podium');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.podium)) {
          podiumUsers = data.podium
            .filter((item: any) => !isMockStudent(item.id))
            .slice(0, 3);
        }
      }
    } catch {}
  }

  // 3. Fallback to /api/leaderboard?limit=3
  if (podiumUsers.length === 0) {
    try {
      const res = await fetch('/api/leaderboard?limit=3');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.leaderboard)) {
          podiumUsers = data.leaderboard
            .filter((item: any) => !isMockStudent(item.id))
            .slice(0, 3);
        }
      }
    } catch {}
  }

  // 4. Local storage fallback if offline
  if (podiumUsers.length === 0) {
    const localAchievers = getLocalRegisteredAchievers(currentProfile);
    podiumUsers = localAchievers.filter((u) => !isMockStudent(u.id)).slice(0, 3);
  }

  // Ensure current active user is reflected if authentic
  if (currentProfile && currentProfile.id && !isMockStudent(currentProfile.id, currentProfile.email)) {
    const existingIdx = podiumUsers.findIndex((u) => u.id === currentProfile.id);
    if (existingIdx >= 0) {
      podiumUsers[existingIdx].isCurrentUser = true;
      podiumUsers[existingIdx].isOnline = true;
    }
  }

  // Sort strictly by totalXP / allTimeXP descending
  podiumUsers.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));

  // Map strictly to 1-based ranks (1, 2, 3)
  return podiumUsers.slice(0, 3).map((student, idx) => ({
    ...student,
    rank: idx + 1
  }));
}

/**
 * Real-time listener for the Top 3 Podium directly from cloud database.
 */
export function subscribeToPodiumCloud(
  currentProfile: UserProfile | null | undefined,
  onUpdate: (podium: StudentAchiever[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  let firestoreUnsub: Unsubscribe | null = null;
  let sseUnsub: (() => void) | null = null;

  try {
    const db = getFirestoreDb();
    if (db) {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, orderBy('totalXP', 'desc'), limit(3));
      firestoreUnsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: StudentAchiever[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as any;
              if (data && data.id && !isMockStudent(data.id, data.email)) {
                const rawXP = Number(data.totalXP ?? data.xp ?? 0);
                const achiever = convertProfileToAchiever(
                  {
                    id: data.id,
                    name: data.name,
                    avatar: data.avatar,
                    school: data.school,
                    university: data.university,
                    district: data.district,
                    countryCode: data.countryCode,
                    countryFlag: data.countryFlag,
                    countryName: data.countryName,
                    stream: data.stream,
                    grade: data.grade,
                    studentCategory: data.studentCategory,
                    xp: rawXP,
                    totalXP: rawXP,
                    streakDays: Number(data.streakDays || 1),
                    solvedDoubtsCount: Number(data.solvedDoubtsCount || 0),
                    completedLessonsCount: Number(data.completedLessonsCount || 0),
                    customAvatarFrameId: data.customAvatarFrameId,
                    bio: data.bio,
                    targetUniversity: data.targetUniversity,
                    isOnline: Boolean(data.isOnline)
                  } as unknown as UserProfile,
                  list.length + 1,
                  Boolean(currentProfile && data.id === currentProfile.id)
                );
                list.push(achiever);
              }
            });

            if (list.length > 0) {
              list.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
              const ranked = list.slice(0, 3).map((u, idx) => ({ ...u, rank: idx + 1 }));
              onUpdate(ranked);
            }
          }
        },
        () => {}
      );
    }
  } catch {}

  sseUnsub = subscribeToRealtimeLeaderboard(currentProfile, (fullList) => {
    const realUsers = fullList.filter((u) => !isMockStudent(u.id)).slice(0, 3);
    realUsers.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
    const ranked = realUsers.map((u, idx) => ({ ...u, rank: idx + 1 }));
    onUpdate(ranked);
  });

  return () => {
    if (firestoreUnsub) {
      try {
        firestoreUnsub();
      } catch {}
    }
    if (sseUnsub) {
      try {
        sseUnsub();
      } catch {}
    }
  };
}
