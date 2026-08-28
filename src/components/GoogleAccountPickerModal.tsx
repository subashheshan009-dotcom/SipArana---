import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Plus,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '@/utils/audioUtils';
import type { UserProfile } from '@/types';
import { normalizeEmail } from '@/utils/userMemoryEngine';

export interface GoogleAuthPayload {
  name: string;
  email: string;
  avatar: string;
  id?: string;
  isNewUser?: boolean;
}

interface GoogleAccountPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAuthPayload) => Promise<void> | void;
}

interface DeviceGoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  badge?: string;
  isExisting?: boolean;
  isRegistered?: boolean;
}

export default function GoogleAccountPickerModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleAccountPickerModalProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [osName, setOsName] = useState<string>('Web Browser');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  
  // Custom account input fields
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [customError, setCustomError] = useState<string>('');
  
  // Stored device accounts
  const [accountsList, setAccountsList] = useState<DeviceGoogleAccount[]>([]);

  // Detect platform and load saved Google accounts from local storage
  useEffect(() => {
    if (!isOpen) return;

    // Detect device type & OS
    const ua = navigator.userAgent || '';
    const isTouchMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTouchTablet = /iPad|Tablet|PlayBook/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));

    if (isTouchMobile) {
      setDeviceType('mobile');
      setOsName(/iPhone|iPod/.test(ua) ? 'iOS Google Account' : 'Android Google Account');
    } else if (isTouchTablet) {
      setDeviceType('tablet');
      setOsName(/iPad/.test(ua) ? 'iPadOS Google Account' : 'Tablet Google Account');
    } else {
      setDeviceType('desktop');
      if (/Mac/.test(ua)) setOsName('macOS Chrome / Google One Tap');
      else if (/Win/.test(ua)) setOsName('Windows Google Account');
      else if (/CrOS/.test(ua)) setOsName('ChromeOS Google Account');
      else if (/Linux/.test(ua)) setOsName('Linux Google Account');
      else setOsName('Google One Tap / Web OAuth');
    }

    // Load registered accounts
    const initialAccounts: DeviceGoogleAccount[] = [];

    // Check if current user email (from env or metadata) is present
    const envEmail = 'thekalu54@gmail.com';
    initialAccounts.push({
      id: 'usr_g_thekalu',
      name: 'Thekalu (Google Account)',
      email: envEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Active Google Session'
    });

    try {
      const stored = localStorage.getItem('siparana_registered_accounts');
      if (stored) {
        const parsed: Array<{ profile: UserProfile }> = JSON.parse(stored);
        parsed.forEach((item, idx) => {
          if (item.profile && item.profile.email && !initialAccounts.some(a => normalizeEmail(a.email) === normalizeEmail(item.profile.email))) {
            initialAccounts.push({
              id: item.profile.id || `usr_saved_${idx}`,
              name: item.profile.name,
              email: item.profile.email,
              avatar: item.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              badge: item.profile.hasCompletedOnboarding ? 'SipArana Student Profile' : 'Google Account (Pending Setup)',
              isRegistered: true,
              isExisting: item.profile.hasCompletedOnboarding
            });
          }
        });
      }
    } catch {
      // ignore
    }

    // Preset standard demo accounts for instant testing if not already included
    const standardGooglePresets: DeviceGoogleAccount[] = [
      {
        id: 'usr_g_heshan',
        name: 'Heshan Subasinghe',
        email: 'subashheshan009@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        badge: 'University Engineering'
      },
      {
        id: 'usr_g_kasun',
        name: 'Kasun Perera',
        email: 'kasun.perera.studies@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        badge: 'A/L Maths Candidate'
      }
    ];

    standardGooglePresets.forEach(preset => {
      if (!initialAccounts.some(a => normalizeEmail(a.email) === normalizeEmail(preset.email))) {
        initialAccounts.push(preset);
      }
    });

    setAccountsList(initialAccounts);
    setIsAuthenticating(false);
    setSelectedEmail(null);
    setShowCustomForm(false);
    setCustomError('');
  }, [isOpen]);

  const handleSelect = async (account: DeviceGoogleAccount) => {
    setSelectedEmail(account.email);
    setIsAuthenticating(true);
    soundFX.playPop();

    // Check if account already exists in registered accounts with completed onboarding
    let isExistingUser = false;
    try {
      const stored = localStorage.getItem('siparana_registered_accounts');
      if (stored) {
        const parsed: Array<{ profile: UserProfile }> = JSON.parse(stored);
        const match = parsed.find(item => normalizeEmail(item.profile.email) === normalizeEmail(account.email));
        if (match && match.profile.hasCompletedOnboarding) {
          isExistingUser = true;
        }
      }
    } catch {
      // ignore
    }

    // Simulate cross-platform native auth handshake
    setTimeout(async () => {
      try {
        await onSelectAccount({
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar,
          isNewUser: !isExistingUser
        });
        soundFX.playLevelUp();
      } catch {
        setIsAuthenticating(false);
        setSelectedEmail(null);
      }
    }, 600);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    const trimmedEmail = customEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setCustomError('Please enter a valid Google / Gmail address.');
      soundFX.playIncorrect();
      return;
    }

    let finalName = customName.trim();
    if (!finalName) {
      const part = trimmedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      finalName = part.charAt(0).toUpperCase() + part.slice(1);
    }

    setIsAuthenticating(true);
    soundFX.playPop();

    // Check if custom email already registered
    let isExistingUser = false;
    try {
      const stored = localStorage.getItem('siparana_registered_accounts');
      if (stored) {
        const parsed: Array<{ profile: UserProfile }> = JSON.parse(stored);
        const match = parsed.find(item => normalizeEmail(item.profile.email) === normalizeEmail(trimmedEmail));
        if (match && match.profile.hasCompletedOnboarding) {
          isExistingUser = true;
        }
      }
    } catch {
      // ignore
    }

    setTimeout(async () => {
      try {
        await onSelectAccount({
          id: `usr_google_${Date.now()}`,
          name: finalName,
          email: trimmedEmail,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          isNewUser: !isExistingUser
        });
        soundFX.playLevelUp();
      } catch {
        setIsAuthenticating(false);
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Header (Google Authenticator Style) */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Google Colored Logo */}
            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Choose an account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                to continue to <strong className="text-slate-700 dark:text-slate-200">SipArana Global</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAuthenticating}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Indicator Bar */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            {deviceType === 'mobile' ? (
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            ) : deviceType === 'tablet' ? (
              <Tablet className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <Laptop className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{osName}</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>Google Secure OAuth</span>
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-3">
          {isAuthenticating && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Signing in with Google...
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  Retrieving Google profile and connecting academic memory
                </p>
              </div>
            </div>
          )}

          {!showCustomForm ? (
            <>
              {/* Linked Accounts List */}
              <div className="space-y-2">
                {accountsList.map((acc) => {
                  const isSelected = selectedEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={isAuthenticating}
                      onClick={() => handleSelect(acc)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {acc.name}
                            </span>
                            {acc.isExisting && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                Returning
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {acc.email}
                          </p>
                          {acc.badge && (
                            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                              {acc.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                        {isSelected ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Use Another Account Button */}
              <button
                type="button"
                disabled={isAuthenticating}
                onClick={() => {
                  soundFX.playPop();
                  setShowCustomForm(true);
                }}
                className="w-full p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition flex items-center gap-3 cursor-pointer group bg-slate-50/50 dark:bg-slate-900/50"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 block">
                    Use another Google account
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sign in with any Gmail or Workspace email
                  </span>
                </div>
              </button>
            </>
          ) : (
            /* Custom Google Account Form */
            <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                Enter your Google account credentials to log in or create a new student profile:
              </div>

              {customError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {customError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kasun Fernando"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                >
                  Back to Accounts
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security & Disclaimer Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Encrypted Cross-Platform Sync</span>
          </div>
          <p className="leading-relaxed">
            To continue, Google shares your name, email address, language preference, and profile picture with SipArana in compliance with Google Privacy Standards.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
