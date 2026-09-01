import React, { useState, useEffect } from 'react';
import {
  Share2,
  Users,
  Copy,
  Check,
  Award,
  Crown,
  Flame,
  Zap,
  TrendingUp,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import {
  getVerifiedReferrals,
  getVerifiedReferralCount,
  type VerifiedReferralRecord
} from '@/services/referralService';

interface ReferralAndSocialShareSectionProps {
  currentRank?: number;
}

export const ReferralAndSocialShareSection: React.FC<ReferralAndSocialShareSectionProps> = ({
  currentRank = 14
}) => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStatusText, setCopiedStatusText] = useState(false);
  const [verifiedReferrals, setVerifiedReferrals] = useState<VerifiedReferralRecord[]>([]);

  // Unique Scholar Invite Code and Link
  const referralCode = `SCHOLAR_${(profile?.id || 'GLOBAL').slice(-6).toUpperCase()}`;
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}?ref=${profile?.id || referralCode}`
    : `https://siparana.edu/join?ref=${referralCode}`;

  const studentName = profile?.name || 'Dedicated Scholar';
  const studentXP = profile?.xp || 1850;
  const streakDays = profile?.streakDays || 7;
  const schoolOrUni = profile?.university || profile?.school || 'National High School';
  const countryFlag = profile?.countryFlag || '🇱🇰';

  // Load verified referrals on mount and whenever profile changes
  useEffect(() => {
    if (profile?.id) {
      const records = getVerifiedReferrals(profile.id);
      setVerifiedReferrals(records);
    }
  }, [profile?.id, profile?.xp]);

  const verifiedCount = verifiedReferrals.length;
  const totalReferralXP = verifiedCount * 200;

  // WhatsApp formatted share text
  const whatsAppShareText = `🏆 *My Academic Rank on SipArana AI Global Leaderboard!* 🚀\n\n👤 *Scholar:* ${studentName} ${countryFlag}\n🥇 *Global Rank:* #${currentRank} Sovereign Master\n⚡ *Total XP:* ${studentXP.toLocaleString()} XP | 🔥 *Streak:* ${streakDays} Days\n🏫 *Institution:* ${schoolOrUni}\n\nJoin me on SipArana AI — The Free 24/7 AI Education & Exam Accelerator! 📚✨\n👉 ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    soundFX.playPop();
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyStatusText = () => {
    navigator.clipboard.writeText(whatsAppShareText);
    setCopiedStatusText(true);
    soundFX.playPop();
    setTimeout(() => setCopiedStatusText(false), 3000);
  };

  const handleWhatsAppShare = () => {
    soundFX.playPop();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppShareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="referral-social-sharing-section" className="space-y-5">
      {/* 2-Column Responsive Viral Growth Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CARD 1: Invite Friends (+200 XP per classmate) */}
        <div className="lg:col-span-6 relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border border-blue-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-blue-500/30 flex flex-col justify-between space-y-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-black tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>REFERRAL ACCELERATOR</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                +200 XP / Registered Friend
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Invite Friends (+200 XP) 👥</span>
            </h3>

            <p className="text-xs text-slate-300">
              {language === 'si'
                ? 'ඔබගේ පුද්ගලික ආරාධනා සබැඳිය මිතුරන්ට බෙදාගන්න. ඔබගේ සබැඳියෙන් ලියාපදිංචි වන සෑම නව ශිෂ්‍යයෙකු වෙනුවෙන්ම ඔබට +200 XP ප්‍රසාද හිමිවේ.'
                : 'Share your personal referral link with classmates. Earn +200 XP automatically when a new student completes registration through your link.'}
            </p>

            {/* Verified Referral Real-Time Tracking Stats Banner */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Friends Joined</span>
                <span className="text-base font-black text-white">{verifiedCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">XP Earned</span>
                <span className="text-base font-black text-amber-400">+{totalReferralXP} XP</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Verification</span>
                <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Real-Time</span>
                </span>
              </div>
            </div>

            {/* List of Verified Joined Friends if any */}
            {verifiedReferrals.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Verified Registered Classmates:</span>
                  <span className="text-emerald-400 font-black text-[10px]">+{totalReferralXP} XP Granted</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {verifiedReferrals.map((ref, idx) => (
                    <div
                      key={ref.newUserId || idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                    >
                      <span className="font-bold text-slate-200 truncate">{ref.newUserName}</span>
                      <span className="text-amber-400 font-black shrink-0">+{ref.xpAwarded} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unique Referral Link Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">
                Your Unique Scholar Invite Link:
              </label>
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-blue-500/30">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="bg-transparent text-xs text-blue-300 font-mono flex-1 outline-none px-2 select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Share to WhatsApp Only */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Invite Link to WhatsApp</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Share My Rank to WhatsApp 📸 (Status Rank Card Generator) */}
        <div className="lg:col-span-6 relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden ring-1 ring-emerald-500/30 flex flex-col justify-between space-y-5">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIRAL STATUS MAKER</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold">
                WhatsApp Status
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Share My Rank to WhatsApp 📸</span>
            </h3>

            <p className="text-xs text-slate-300">
              {language === 'si'
                ? 'ඔබගේ Global Rank එක සහ ශිෂ්‍ය පදක්කම් WhatsApp Status එකක් ලෙස ක්ෂණිකව බෙදාගෙන මිතුරන්ට පෙන්වන්න.'
                : 'Generate a verified scholar status card showcasing your global rank, streak, and badges directly on WhatsApp.'}
            </p>

            {/* Live Visual Rank Card Mini Preview */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-inner flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarFrameRenderer
                  avatarUrl={profile?.avatar}
                  name={studentName}
                  frameId={profile?.customAvatarFrameId || 'frame-gold'}
                  size="sm"
                  showCrown={true}
                  showTierTag={false}
                />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                    <span>{studentName}</span>
                    <span>{countryFlag}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5 truncate">
                    <span className="text-amber-400 font-bold">Rank #{currentRank}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{studentXP.toLocaleString()} XP</span>
                    <span>•</span>
                    <span className="text-orange-400 font-bold">🔥 {streakDays}d</span>
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-[11px] border border-emerald-500/30 shrink-0">
                STATUS PREVIEW
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Post Rank to WhatsApp Status</span>
            </button>

            <button
              type="button"
              onClick={handleCopyStatusText}
              className="py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedStatusText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Caption Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Status Caption</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
