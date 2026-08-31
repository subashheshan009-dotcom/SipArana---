import type { StudentAchiever } from '@/data/keyPlayersData';
import { convertProfileToAchiever } from '@/data/keyPlayersData';
import type { UserProfile } from '@/types';

// Global Event for Real-Time Leaderboard Updates across components
export const LEADERBOARD_UPDATE_EVENT = 'siparana_leaderboard_updated';

export function broadcastLeaderboardUpdate(leaderboard?: StudentAchiever[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(LEADERBOARD_UPDATE_EVENT, { detail: { leaderboard } })
    );
  }
}

// Fetch 100% Real Live Leaderboard from Database API
export async function fetchLiveLeaderboard(currentProfile?: UserProfile | null): Promise<StudentAchiever[]> {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.leaderboard)) {
        // If current profile exists and isn't yet in server list, include it
        if (currentProfile && !data.leaderboard.some((a: StudentAchiever) => a.id === currentProfile.id)) {
          const clientAchiever = convertProfileToAchiever(currentProfile, data.leaderboard.length + 1, true);
          const combined = [...data.leaderboard, clientAchiever].sort((a, b) => b.allTimeXP - a.allTimeXP);
          return combined.map((item, idx) => ({ ...item, rank: idx + 1 }));
        }
        return data.leaderboard;
      }
    }
  } catch (error) {
    console.warn('Leaderboard API fetch error, using local verified registered accounts:', error);
  }

  // Fallback: Build leaderboard strictly from genuinely registered local accounts & current user
  return getLocalRegisteredAchievers(currentProfile);
}

// Sync Real User with Backend Database
export async function syncUserWithBackend(profile: UserProfile): Promise<{ success: boolean; leaderboard?: StudentAchiever[]; userRank?: number }> {
  try {
    const res = await fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
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
      headers: { 'Content-Type': 'application/json' },
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

// Helper: Extract only genuinely registered accounts from localStorage (no fake fillers)
export function getLocalRegisteredAchievers(currentProfile?: UserProfile | null): StudentAchiever[] {
  const registeredAccounts: Array<{ profile: UserProfile }> = [];
  
  try {
    const saved = localStorage.getItem('siparana_registered_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.profile && item.profile.id) {
            registeredAccounts.push(item);
          }
        }
      }
    }
  } catch {
    // ignore
  }

  const map = new Map<string, UserProfile>();

  // Add saved registered accounts
  for (const acc of registeredAccounts) {
    if (acc.profile?.id) {
      map.set(acc.profile.id, acc.profile);
    }
  }

  // Add current logged-in profile if active
  if (currentProfile && currentProfile.id) {
    map.set(currentProfile.id, currentProfile);
  }

  const users = Array.from(map.values());
  const sorted = users.sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return sorted.map((user, idx) =>
    convertProfileToAchiever(user, idx + 1, user.id === currentProfile?.id)
  );
}
