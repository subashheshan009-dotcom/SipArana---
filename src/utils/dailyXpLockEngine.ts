/**
 * SIPARANA Anti-Spam & Daily Action XP Lock Engine
 * 
 * Rules:
 * 1. Interactive daily actions (Daily claim, Daily quizzes, Flashcards, Syllabus downloads, Mascot cheer, etc.)
 *    are strictly locked to 1-TIME PER CALENDAR DAY per user.
 * 2. Automatic midnight reset (12:00 AM) clears daily claim barriers based on date string (YYYY-MM-DD).
 * 3. Rewarded Ads exception: Max 20 ads per day (+100 XP each).
 * 4. User Feedback Toast triggers whenever a user tries to re-claim an already completed task.
 */

export interface DailyActionRecord {
  lastClaimedDate: string; // "YYYY-MM-DD"
  claimedAtTimestamp?: number;
  countToday?: number; // for multi-allowed items like ads
}

export type DailyActionType =
  | 'daily_attendance'
  | 'dashboard_daily_quiz'
  | 'dashboard_study_task'
  | 'unit_quiz_completion'
  | 'flashcard_mastery'
  | 'syllabus_doc_download'
  | 'mascot_highfive_cheer'
  | 'course_bookmark'
  | 'rewarded_ad_watch'
  | 'study_schedule_task';

const STORAGE_KEY_PREFIX = 'siparana_daily_xp_lock_v1_';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

export function getFormattedTimeUntilMidnight(): string {
  const diffSec = getSecondsUntilMidnight();
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

/**
 * Check if a daily action is currently claimed today by the given user.
 */
export function isDailyActionClaimedToday(
  actionKey: string,
  userEmailOrId: string = 'global_guest'
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const today = getTodayDateString();
    const storageKey = `${STORAGE_KEY_PREFIX}${userEmailOrId}_${actionKey}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;

    const data: DailyActionRecord = JSON.parse(raw);
    return data.lastClaimedDate === today;
  } catch {
    return false;
  }
}

/**
 * Record and lock a daily action for today.
 * Returns true if newly claimed, false if it was already claimed today.
 */
export function recordDailyActionClaim(
  actionKey: string,
  userEmailOrId: string = 'global_guest'
): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const today = getTodayDateString();
    const storageKey = `${STORAGE_KEY_PREFIX}${userEmailOrId}_${actionKey}`;
    const raw = localStorage.getItem(storageKey);

    if (raw) {
      const data: DailyActionRecord = JSON.parse(raw);
      if (data.lastClaimedDate === today) {
        return false; // Already claimed today!
      }
    }

    const record: DailyActionRecord = {
      lastClaimedDate: today,
      claimedAtTimestamp: Date.now(),
      countToday: 1
    };

    localStorage.setItem(storageKey, JSON.stringify(record));
    
    // Broadcast event across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('siparana_daily_action_claimed', {
          detail: { actionKey, userEmailOrId, today }
        })
      );
    }

    return true;
  } catch {
    return true;
  }
}

/**
 * Get the daily count for multi-allow actions (like Ads max 20).
 */
export function getDailyActionCount(
  actionKey: string,
  userEmailOrId: string = 'global_guest'
): number {
  if (typeof window === 'undefined') return 0;
  try {
    const today = getTodayDateString();
    const storageKey = `${STORAGE_KEY_PREFIX}${userEmailOrId}_${actionKey}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return 0;

    const data: DailyActionRecord = JSON.parse(raw);
    if (data.lastClaimedDate !== today) {
      return 0; // Midnight reset passed!
    }
    return data.countToday || 0;
  } catch {
    return 0;
  }
}

/**
 * Increment daily action count (e.g. for Ads).
 */
export function incrementDailyActionCount(
  actionKey: string,
  userEmailOrId: string = 'global_guest',
  maxAllowed: number = 20
): { newCount: number; isCapReached: boolean } {
  if (typeof window === 'undefined') return { newCount: 1, isCapReached: false };
  try {
    const today = getTodayDateString();
    const storageKey = `${STORAGE_KEY_PREFIX}${userEmailOrId}_${actionKey}`;
    const raw = localStorage.getItem(storageKey);

    let currentCount = 0;
    if (raw) {
      const data: DailyActionRecord = JSON.parse(raw);
      if (data.lastClaimedDate === today) {
        currentCount = data.countToday || 0;
      }
    }

    const newCount = Math.min(maxAllowed, currentCount + 1);
    const record: DailyActionRecord = {
      lastClaimedDate: today,
      claimedAtTimestamp: Date.now(),
      countToday: newCount
    };

    localStorage.setItem(storageKey, JSON.stringify(record));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('siparana_daily_action_claimed', {
          detail: { actionKey, userEmailOrId, today, count: newCount }
        })
      );
    }

    return {
      newCount,
      isCapReached: newCount >= maxAllowed
    };
  } catch {
    return { newCount: 1, isCapReached: false };
  }
}

/**
 * Global toast emitter for blocked / already claimed actions
 */
export function triggerDailyLockToast(
  customMessage?: string,
  actionName?: string
) {
  if (typeof window === 'undefined') return;

  const msg =
    customMessage ||
    `⚠️ You have already claimed ${actionName ? `"${actionName}"` : 'this reward'} today! Come back tomorrow at midnight for fresh XP.`;

  window.dispatchEvent(
    new CustomEvent('siparana_daily_lock_toast', {
      detail: {
        message: msg,
        timestamp: Date.now()
      }
    })
  );
}
