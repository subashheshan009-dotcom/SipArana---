import { useState, useEffect, useCallback } from 'react';
import type { StudentAchiever } from '@/data/keyPlayersData';
import { useAuth } from '@/context/AuthContext';
import {
  pingUserHeartbeat,
  LEADERBOARD_UPDATE_EVENT
} from '@/services/leaderboardService';
import {
  fetchRealUsersFromCloud,
  subscribeToRealtimeCloudLeaderboard
} from '@/services/cloudDatabase';

export function useLeaderboard() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<StudentAchiever[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      if (profile?.id) {
        pingUserHeartbeat(profile.id);
      }
      const data = await fetchRealUsersFromCloud(profile);
      setLeaderboard(data);
    } catch (err) {
      console.warn('Error loading live cloud leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadData();

    // 1. Listen to real-time custom event broadcasts across browser windows / tabs
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ leaderboard?: StudentAchiever[] }>;
      if (customEvent.detail && customEvent.detail.leaderboard) {
        setLeaderboard(customEvent.detail.leaderboard);
      } else {
        loadData();
      }
    };

    window.addEventListener(LEADERBOARD_UPDATE_EVENT, handleUpdate);

    // 2. Real-time dynamic cloud database listener (Firestore snapshot + Central Multi-Device Bridge)
    const unsubscribeCloud = subscribeToRealtimeCloudLeaderboard(profile, (liveList) => {
      setLeaderboard(liveList);
      setLoading(false);
    });

    // 3. Periodic heartbeat and backup sync every 20 seconds
    const interval = setInterval(() => {
      if (profile?.id) {
        pingUserHeartbeat(profile.id);
      }
    }, 20000);

    return () => {
      window.removeEventListener(LEADERBOARD_UPDATE_EVENT, handleUpdate);
      unsubscribeCloud();
      clearInterval(interval);
    };
  }, [loadData, profile]);

  const top3 = leaderboard.slice(0, 3);
  const userRank = profile ? leaderboard.findIndex(u => u.id === profile.id) + 1 : 0;

  return {
    leaderboard,
    top3,
    userRank,
    loading,
    refreshLeaderboard: loadData
  };
}
