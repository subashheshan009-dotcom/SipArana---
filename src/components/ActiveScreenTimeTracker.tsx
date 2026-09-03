import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

const ACTIVE_SCREEN_TIME_INTERVAL_SECONDS = 300; // 5 minutes = 300 seconds
const XP_PER_SCREEN_TIME_CHUNK = 10; // strictly +10 XP per 5 minutes

/**
 * Silent Background Active Screen Time Tracker:
 * - Runs completely in the background without any visible floating timer bar or toasts.
 * - Tracks active study time when tab is focused and visible.
 * - Silently awards +10 XP every 5 minutes to the student's profile & database.
 * - Zero notifications or audio interruptions so students stay completely in flow.
 */
export const ActiveScreenTimeTracker: React.FC = () => {
  const { profile, addXP } = useAuth();

  const userKey = profile?.email || profile?.id || 'guest_user';
  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = `siparana_active_study_sec_${userKey}_${todayStr}`;

  const activeSecondsRef = useRef<number>(0);
  const lastAwardedChunkRef = useRef<number>(0);

  // Initialize from saved study seconds for today
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(storageKey);
      const total = saved ? parseInt(saved, 10) : 0;
      activeSecondsRef.current = total;
      lastAwardedChunkRef.current = Math.floor(total / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS);
    } catch {
      activeSecondsRef.current = 0;
      lastAwardedChunkRef.current = 0;
    }
  }, [storageKey]);

  // Main active screen time timer loop (Silent background service)
  useEffect(() => {
    if (!profile) return;

    const interval = setInterval(() => {
      // Only tick if user is actively in the tab
      if (document.visibilityState !== 'visible') {
        return;
      }

      activeSecondsRef.current += 1;
      const currentTotal = activeSecondsRef.current;

      // Check if a 5-minute milestone (300s) has been reached
      const completedChunks = Math.floor(currentTotal / ACTIVE_SCREEN_TIME_INTERVAL_SECONDS);

      if (completedChunks > lastAwardedChunkRef.current) {
        lastAwardedChunkRef.current = completedChunks;
        // Silently award +10 XP directly to user profile and persistent database
        addXP(XP_PER_SCREEN_TIME_CHUNK);
      }

      // Periodically persist seconds count to localStorage every 5 seconds
      if (currentTotal % 5 === 0) {
        try {
          localStorage.setItem(storageKey, String(currentTotal));
        } catch {}
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      try {
        localStorage.setItem(storageKey, String(activeSecondsRef.current));
      } catch {}
    };
  }, [profile, storageKey, addXP]);

  // Completely invisible in DOM - runs 100% in background
  return null;
};

