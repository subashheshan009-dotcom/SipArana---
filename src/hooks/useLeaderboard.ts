import { useState, useEffect, useCallback } from 'react';
import type { StudentAchiever } from '@/data/keyPlayersData';
import { useAuth } from '@/context/AuthContext';
import { fetchLiveLeaderboard, pingUserHeartbeat, LEADERBOARD_UPDATE_EVENT } from '@/services/leaderboardService';

export function useLeaderboard() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<StudentAchiever[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      if (profile?.id) {
        pingUserHeartbeat(profile.id);
      }
      const data = await fetchLiveLeaderboard(profile);
      setLeaderboard(data);
    } catch (err) {
      console.warn('Error loading live leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadData();

    // Listen to real-time custom event broadcasts
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ leaderboard?: StudentAchiever[] }>;
      if (customEvent.detail && customEvent.detail.leaderboard) {
        setLeaderboard(customEvent.detail.leaderboard);
      } else {
        loadData();
      }
    };

    window.addEventListener(LEADERBOARD_UPDATE_EVENT, handleUpdate);

    // Periodic live sync every 15 seconds to ensure changes from other devices are reflected
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      window.removeEventListener(LEADERBOARD_UPDATE_EVENT, handleUpdate);
      clearInterval(interval);
    };
  }, [loadData]);

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
