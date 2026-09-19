import type { StudentAchiever } from '@/data/keyPlayersData';
import { convertProfileToAchiever } from '@/data/keyPlayersData';
import type { UserProfile } from '@/types';

// Global Event for Real-Time Leaderboard Updates across components
export const LEADERBOARD_UPDATE_EVENT = 'siparana_leaderboard_updated';

// Security: Auth Token Storage & Retrieval
export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem('siparana_auth_token');
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem('siparana_auth_token', token);
    } else {
      localStorage.removeItem('siparana_auth_token');
    }
  } catch {
    // ignore
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getStoredAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export function broadcastLeaderboardUpdate(leaderboard?: StudentAchiever[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(LEADERBOARD_UPDATE_EVENT, { detail: { leaderboard } })
    );
  }
}

// Fetch 100% Real Live Leaderboard from Database API (Online + Offline Registered Scholars)
export async function fetchLiveLeaderboard(currentProfile?: UserProfile | null): Promise<StudentAchiever[]> {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.leaderboard)) {
        const list: StudentAchiever[] = data.leaderboard.map((item: any) => ({
          ...item,
          isOnline: Boolean(item.isOnline || (currentProfile && item.id === currentProfile.id))
        }));

        if (currentProfile && currentProfile.id) {
          const existingIdx = list.findIndex(a => a.id === currentProfile.id);
          if (existingIdx >= 0) {
            list[existingIdx].isCurrentUser = true;
            list[existingIdx].isOnline = true;
          } else {
            const activeAchiever = convertProfileToAchiever(
              currentProfile,
              list.length + 1,
              true
            );
            activeAchiever.isOnline = true;
            activeAchiever.isCurrentUser = true;
            list.push(activeAchiever);
          }
        }
        const sorted = list.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
        return sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));
      }
    }
  } catch (error) {
    console.warn('Leaderboard API fetch error, using fallback:', error);
  }

  // Fallback: Build leaderboard from local registered accounts
  return getLocalRegisteredAchievers(currentProfile);
}

// Send periodic heartbeat to keep student marked Online
export async function pingUserHeartbeat(userId: string): Promise<void> {
  try {
    if (!userId) return;
    await fetch('/api/users/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch {
    // ignore
  }
}

// Subscribe to Realtime Central Database Leaderboard Stream (Multi-device instant sync)
export function subscribeToRealtimeLeaderboard(
  currentProfile: UserProfile | null | undefined,
  onUpdate: (leaderboard: StudentAchiever[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  let eventSource: EventSource | null = null;
  let isClosed = false;

  const processIncomingList = (rawList: any[]) => {
    const list: StudentAchiever[] = rawList
      .filter((item: any) => !isMockStudent(item.id, item.email))
      .map((item: any) => ({
        ...item,
        isOnline: Boolean(item.isOnline || (currentProfile && item.id === currentProfile.id))
      }));

    if (currentProfile && currentProfile.id && !isMockStudent(currentProfile.id, currentProfile.email)) {
      const existingIdx = list.findIndex(a => a.id === currentProfile.id);
      if (existingIdx >= 0) {
        list[existingIdx].isCurrentUser = true;
        list[existingIdx].isOnline = true;
      } else {
        const activeAchiever = convertProfileToAchiever(
          currentProfile,
          list.length + 1,
          true
        );
        activeAchiever.isOnline = true;
        activeAchiever.isCurrentUser = true;
        list.push(activeAchiever);
      }
    }
    const sorted = list.sort((a, b) => (b.allTimeXP || 0) - (a.allTimeXP || 0));
    const mapped = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));
    onUpdate(mapped);
    broadcastLeaderboardUpdate(mapped);
  };

  const connect = () => {
    if (isClosed) return;
    try {
      eventSource = new EventSource('/api/leaderboard/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.type === 'leaderboard' && Array.isArray(payload.leaderboard)) {
            processIncomingList(payload.leaderboard);
          }
        } catch (err) {
          console.warn('Error parsing SSE leaderboard message:', err);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // Auto-reconnect after 3 seconds if not explicitly closed
        if (!isClosed) {
          setTimeout(connect, 3000);
        }
      };
    } catch {
      // Fallback
    }
  };

  connect();

  // Redundant polling backup every 5 seconds (ensures guaranteed sync across all mobile devices)
  const pollInterval = setInterval(async () => {
    if (isClosed) return;
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.leaderboard)) {
          processIncomingList(data.leaderboard);
        }
      }
    } catch {
      // silent
    }
  }, 5000);

  return () => {
    isClosed = true;
    clearInterval(pollInterval);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}

// Register user in Central Database from Any Device
export async function registerUserWithBackend(
  user: UserProfile,
  password?: string,
  phone?: string
): Promise<{ success: boolean; user?: UserProfile; leaderboard?: StudentAchiever[]; error?: string; token?: string }> {
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, password, phone })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.token) {
        setStoredAuthToken(data.token);
      }
      if (data && data.leaderboard) {
        broadcastLeaderboardUpdate(data.leaderboard);
      }
      return {
        success: true,
        user: data.user ? { ...user, ...data.user } : user,
        leaderboard: data.leaderboard,
        token: data.token
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Registration failed' };
    }
  } catch (error: any) {
    console.warn('Central database registration error:', error);
    return { success: false, error: error.message };
  }
}

// Login user from Central Database across Any Device (Phone, Tablet, Laptop)
export async function loginUserWithBackend(
  emailOrPhone: string,
  password?: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string; notFoundInDb?: boolean; leaderboard?: StudentAchiever[]; token?: string }> {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.profile) {
      if (data.token) {
        setStoredAuthToken(data.token);
      }
      if (data.leaderboard) {
        broadcastLeaderboardUpdate(data.leaderboard);
      }
      return { success: true, profile: data.profile, leaderboard: data.leaderboard, token: data.token };
    }
    return {
      success: false,
      error: data.error || 'Login failed',
      notFoundInDb: Boolean(data.notFoundInDb)
    };
  } catch (error: any) {
    console.warn('Central database login error:', error);
    return { success: false, error: error.message, notFoundInDb: true };
  }
}

// Server-Authoritative Verified XP Award (Anti-Hacking & Rate-Limited)
export async function addXPWithBackend(
  userId: string,
  amount: number,
  activityType: string = 'general_study',
  activityPayload: any = {}
): Promise<{ success: boolean; newXP?: number; leaderboard?: StudentAchiever[] }> {
  try {
    const res = await fetch('/api/users/award-xp', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId,
        clientClaimAmount: amount,
        activityType,
        activityPayload
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.leaderboard) {
        broadcastLeaderboardUpdate(data.leaderboard);
      }
      return { success: true, newXP: data.newXP, leaderboard: data.leaderboard };
    }
  } catch (err) {
    console.warn('Award verified XP backend error:', err);
  }
  return { success: false };
}

// Sync Real User with Backend Database (Enforces RLS Write Permission)
export async function syncUserWithBackend(profile: UserProfile): Promise<{ success: boolean; leaderboard?: StudentAchiever[]; userRank?: number }> {
  try {
    const res = await fetch('/api/users/sync', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.token) {
        setStoredAuthToken(data.token);
      }
      if (data && data.leaderboard) {
        broadcastLeaderboardUpdate(data.leaderboard);
        return { success: true, leaderboard: data.leaderboard, userRank: data.userRank };
      }
    }
  } catch (error) {
    console.warn('Sync user error:', error);
  }

  // If server sync failed, broadcast local real accounts
  const localList = getLocalRegisteredAchievers(profile);
  broadcastLeaderboardUpdate(localList);
  return { success: true, leaderboard: localList };
}

// Cheer a Genuine Registered User
export async function cheerStudent(userId: string): Promise<{ success: boolean; cheersCount?: number }> {
  try {
    const res = await fetch('/api/users/cheer', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, cheersCount: data.cheersCount };
    }
  } catch (error) {
    console.warn('Cheer error:', error);
  }
  return { success: false };
}

// Explicit Presence Reporter across Mobile and Laptop (beacon on pagehide/unload)
export function updateUserPresence(userId: string, isOnline: boolean): void {
  if (!userId || typeof window === 'undefined') return;
  const payload = JSON.stringify({ userId, isOnline });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/users/presence', blob);
    } else {
      fetch('/api/users/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // ignore
  }
}

const DEMO_MOCK_PREFIXES = ['usr_sch_', 'usr_uk_', 'usr_us_', 'usr_jp_', 'usr_in_', 'usr_au_', 'usr_ib_', 'usr_maths_', 'usr_bio_', 'usr_com_', 'usr_ol_', 'usr_jun_', 'usr_art_', 'usr_tech_', 'usr_uni_'];

function isMockStudent(id?: string, email?: string): boolean {
  if (!id) return true;
  if (DEMO_MOCK_PREFIXES.some(prefix => id.startsWith(prefix))) return true;
  if (email && email.endsWith('@siparana.lk') && (email.startsWith('senuri.') || email.startsWith('kasun.') || email.startsWith('rashmi.') || email.startsWith('tharindu.') || email.startsWith('sithum.') || email.startsWith('minoli.') || email.startsWith('sanduni.'))) return true;
  return false;
}

// Helper: Extract verified registered accounts & local users (Online + Offline persistent ranks)
export function getLocalRegisteredAchievers(currentProfile?: UserProfile | null): StudentAchiever[] {
  const map = new Map<string, StudentAchiever>();

  // 1. Add saved registered accounts from localStorage if any
  try {
    const saved = localStorage.getItem('siparana_registered_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.profile && item.profile.id && !isMockStudent(item.profile.id, item.profile.email)) {
            const achiever = convertProfileToAchiever(item.profile, map.size + 1, false);
            map.set(item.profile.id, achiever);
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // 2. Add or update current logged-in profile if active
  if (currentProfile && currentProfile.id && !isMockStudent(currentProfile.id, currentProfile.email)) {
    const currentAchiever = convertProfileToAchiever(currentProfile, 1, true);
    map.set(currentProfile.id, currentAchiever);
  }

  const allAchievers = Array.from(map.values());
  const sorted = allAchievers.sort((a, b) => b.allTimeXP - a.allTimeXP);

  return sorted.map((student, idx) => ({
    ...student,
    rank: idx + 1
  }));
}

