/**
 * SipArana Educational Ecosystem - Verified Referral & Attribution Engine
 * 
 * Strict Zero-Hallucination & Anti-Exploit Referral Rules:
 * 1. Referral links contain the unique student ID: `?ref=USER_ID`
 * 2. XP is ONLY awarded when an actual new student registers an account through a valid referral link.
 * 3. NO instant XP is awarded for merely clicking 'Copy Link' or 'Share to WhatsApp'.
 * 4. Self-referrals and duplicate registrations are strictly blocked.
 * 5. Referrer XP is credited directly (+200 XP per verified active new student).
 */

export interface VerifiedReferralRecord {
  newUserId: string;
  newUserName: string;
  registeredAt: string;
  xpAwarded: number;
}

const PENDING_REFERRER_KEY = 'siparana_pending_referrer';
const REFERRALS_PREFIX = 'siparana_verified_referrals_';

/**
 * Captures referral parameters from the URL when a user arrives via an invite link.
 * E.g., `https://siparana.edu/join?ref=usr_maths_1` or `?ref=SCHOLAR_123456`
 */
export function captureIncomingReferral(): string | null {
  try {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref') || urlParams.get('referrer');

    if (!ref && window.location.hash.includes('ref=')) {
      const hashQuery = window.location.hash.split('?')[1];
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        ref = hashParams.get('ref') || hashParams.get('referrer');
      }
    }

    if (ref && ref.trim().length > 0) {
      const cleanRef = ref.trim();
      localStorage.setItem(PENDING_REFERRER_KEY, cleanRef);
      sessionStorage.setItem(PENDING_REFERRER_KEY, cleanRef);
      return cleanRef;
    }
  } catch (err) {
    console.error('Error capturing incoming referral:', err);
  }
  return null;
}

/**
 * Gets the current pending referrer ID if one exists.
 */
export function getPendingReferrer(): string | null {
  try {
    return (
      sessionStorage.getItem(PENDING_REFERRER_KEY) ||
      localStorage.getItem(PENDING_REFERRER_KEY) ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Retrieves the list of verified registered referrals for a given user ID.
 */
export function getVerifiedReferrals(userId?: string): VerifiedReferralRecord[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${REFERRALS_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as VerifiedReferralRecord[];
  } catch {
    return [];
  }
}

/**
 * Retrieves the verified referral count for a user.
 */
export function getVerifiedReferralCount(userId?: string): number {
  return getVerifiedReferrals(userId).length;
}

/**
 * Verifies and executes a referral reward upon new account registration.
 * Awards +200 XP only to the referrer if the referral is valid and unique.
 */
export function processVerifiedReferralOnRegistration(
  newUserId: string,
  newUserName: string
): { success: boolean; referrerId?: string; xpAwarded?: number } {
  try {
    const pendingReferrer = getPendingReferrer();
    if (!pendingReferrer) {
      return { success: false };
    }

    // Block self-referral
    if (
      pendingReferrer === newUserId ||
      pendingReferrer.toLowerCase() === newUserName.toLowerCase()
    ) {
      localStorage.removeItem(PENDING_REFERRER_KEY);
      sessionStorage.removeItem(PENDING_REFERRER_KEY);
      return { success: false };
    }

    // Check referrer's record
    const storageKey = `${REFERRALS_PREFIX}${pendingReferrer}`;
    const existing: VerifiedReferralRecord[] = JSON.parse(
      localStorage.getItem(storageKey) || '[]'
    );

    // Prevent duplicate credit for the same new user
    const alreadyCounted = existing.some(
      (r) => r.newUserId === newUserId || (newUserId && r.newUserId.includes(newUserId))
    );

    if (alreadyCounted) {
      localStorage.removeItem(PENDING_REFERRER_KEY);
      sessionStorage.removeItem(PENDING_REFERRER_KEY);
      return { success: false };
    }

    const record: VerifiedReferralRecord = {
      newUserId,
      newUserName: newUserName || 'New Scholar',
      registeredAt: new Date().toISOString(),
      xpAwarded: 200
    };

    existing.push(record);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    // Credit referrer account if present in registered accounts repository
    try {
      const storedAccounts = JSON.parse(
        localStorage.getItem('siparana_registered_accounts') || '[]'
      );
      let accountUpdated = false;
      for (const acc of storedAccounts) {
        if (
          acc.profile.id === pendingReferrer ||
          `SCHOLAR_${(acc.profile.id || '').slice(-6).toUpperCase()}` === pendingReferrer
        ) {
          acc.profile.xp = (acc.profile.xp || 0) + 200;
          accountUpdated = true;
          break;
        }
      }
      if (accountUpdated) {
        localStorage.setItem(
          'siparana_registered_accounts',
          JSON.stringify(storedAccounts)
        );
      }

      // If active current user is the referrer, also update current active user
      const activeUserRaw = localStorage.getItem('siparana_user');
      if (activeUserRaw) {
        const activeUser = JSON.parse(activeUserRaw);
        if (
          activeUser.id === pendingReferrer ||
          `SCHOLAR_${(activeUser.id || '').slice(-6).toUpperCase()}` === pendingReferrer
        ) {
          activeUser.xp = (activeUser.xp || 0) + 200;
          localStorage.setItem('siparana_user', JSON.stringify(activeUser));
        }
      }
    } catch (err) {
      console.error('Error updating referrer XP:', err);
    }

    // Clear pending referral after successful one-time attribution
    localStorage.removeItem(PENDING_REFERRER_KEY);
    sessionStorage.removeItem(PENDING_REFERRER_KEY);

    return {
      success: true,
      referrerId: pendingReferrer,
      xpAwarded: 200
    };
  } catch (err) {
    console.error('Error processing referral:', err);
    return { success: false };
  }
}
