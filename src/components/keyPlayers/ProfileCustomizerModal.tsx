import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  Sparkles,
  Check,
  Lock,
  Camera,
  GraduationCap,
  Globe,
  Quote,
  Flame,
  Shield,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { soundFX } from '@/utils/audioUtils';
import { AvatarFrameRenderer } from './AvatarFrameRenderer';
import { AVATAR_FRAMES, PRESET_AVATARS, RANK_TIERS } from '@/data/keyPlayersData';
import type { GlobalCountryCode } from '@/types';

interface ProfileCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES_LIST: { code: GlobalCountryCode; name: string; flag: string }[] = [
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GLOBAL', name: 'International / Other', flag: '🌍' }
];

export const ProfileCustomizerModal: React.FC<ProfileCustomizerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { profile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive student level from XP
  const currentXP = profile?.xp || 0;
  const currentLevel = Math.max(1, Math.floor(currentXP / 300) + 1);

  // Form State
  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatar || PRESET_AVATARS[0]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>(
    profile?.customAvatarFrameId || (currentLevel >= 60 ? 'frame-grandmaster' : currentLevel >= 50 ? 'frame-diamond' : currentLevel >= 40 ? 'frame-platinum' : currentLevel >= 30 ? 'frame-gold' : currentLevel >= 20 ? 'frame-silver' : currentLevel >= 10 ? 'frame-bronze' : 'frame-default')
  );
  const [name, setName] = useState<string>(profile?.name || '');
  const [bioQuote, setBioQuote] = useState<string>(profile?.bio || profile?.statusQuote || 'Dedicated scholar striving for peak academic mastery.');
  const [targetUniversity, setTargetUniversity] = useState<string>(profile?.targetUniversity || 'University of Moratuwa / Cambridge');
  const [schoolOrInst, setSchoolOrInst] = useState<string>(profile?.school || profile?.university || 'National Top College');
  const [countryCode, setCountryCode] = useState<GlobalCountryCode>(profile?.countryCode || 'LK');

  const [activeTab, setActiveTab] = useState<'avatar_frame' | 'bio_info'>('avatar_frame');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle Custom Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
        soundFX.playPop();
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const selectedCountryObj = COUNTRIES_LIST.find((c) => c.code === countryCode) || COUNTRIES_LIST[0];

    updateProfile({
      name: name.trim() || profile?.name || 'Scholar',
      avatar: avatarUrl,
      customAvatarFrameId: selectedFrameId,
      bio: bioQuote.trim(),
      statusQuote: bioQuote.trim(),
      targetUniversity: targetUniversity.trim(),
      school: schoolOrInst.trim(),
      countryCode: selectedCountryObj.code,
      countryName: selectedCountryObj.name,
      countryFlag: selectedCountryObj.flag
    });

    soundFX.playCorrect();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
  };

  const currentTier = RANK_TIERS.slice().reverse().find((t) => currentLevel >= t.minLevel) || RANK_TIERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Flame className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Free Fire Profile & Frame Customizer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  LEVEL {currentLevel}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'si'
                  ? 'ඔබගේ Profile Picture එක, Free Fire Frames සහ Bio තොරතුරු customize කරගන්න.'
                  : 'Equip unlockable rank frames, upload your avatar, and set your global scholar bio.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AvatarFrameRenderer
              avatarUrl={avatarUrl}
              frameId={selectedFrameId}
              size="lg"
              showTierTag={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{name || 'Your Name'}</span>
                <span className="text-sm">
                  {COUNTRIES_LIST.find((c) => c.code === countryCode)?.flag || '🇱🇰'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentTier.gradientClass} text-white`}>
                  {currentTier.name}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium truncate max-w-xs sm:max-w-md">
                🎯 {targetUniversity || 'Dream Target'}
              </p>
              <p className="text-[11px] text-slate-400 italic line-clamp-1">
                "{bioQuote || 'Study hard, conquer your exams.'}"
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Mastery</span>
            <span className="text-lg font-black text-amber-400">{currentXP.toLocaleString()} XP</span>
            <span className="text-[10px] text-slate-400">Level {currentLevel} Scholar</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('avatar_frame')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'avatar_frame'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>1. Avatar & Free Fire Frames</span>
          </button>
          <button
            onClick={() => setActiveTab('bio_info')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'bio_info'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>2. Bio, Institution & Dream Goal</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'avatar_frame' && (
            <div className="space-y-6">
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Custom Photo / Avatar Upload</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Upload your real portrait or gaming avatar (JPEG, PNG, WebP up to 5MB)
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    </button>
                  </div>
                </div>

                {/* Preset Avatars quick select */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400">Or choose a preset scholar avatar:</span>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1">
                    {PRESET_AVATARS.map((pUrl, idx) => {
                      const isSelected = avatarUrl === pUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(pUrl);
                            soundFX.playPop();
                          }}
                          className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-400 ring-2 ring-amber-400/60 scale-110'
                              : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                          }`}
                        >
                          <img src={pUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                          {isSelected && (
                            <span className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Free Fire Style Avatar Frames Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>Free Fire Unlockable Rank Frames</span>
                  </h4>
                  <span className="text-xs text-amber-400 font-bold">
                    Your Current Level: {currentLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVATAR_FRAMES.map((frame) => {
                    const isUnlocked = currentLevel >= frame.unlockLevel;
                    const isSelected = selectedFrameId === frame.id;

                    return (
                      <div
                        key={frame.id}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedFrameId(frame.id);
                            soundFX.playPop();
                          } else {
                            soundFX.playIncorrect();
                          }
                        }}
                        className={`relative p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                            : isUnlocked
                            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                            : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                        }`}
                      >
                        {/* Frame mini preview */}
                        <AvatarFrameRenderer
                          avatarUrl={avatarUrl}
                          frameId={frame.id}
                          size="md"
                          showCrown={false}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">{frame.name}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black text-[9px]">
                                EQUIPPED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{frame.description}</p>
                          <div className="mt-1 flex items-center gap-2">
                            {isUnlocked ? (
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Unlocked (Req Lv {frame.unlockLevel})
                              </span>
                            ) : (
                              <span className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Unlocks at Level {frame.unlockLevel} ({frame.unlockLevel - currentLevel} lvls to go)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bio_info' && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Student / Scholar Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your student display name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white outline-none transition"
                />
              </div>

              {/* Country & Flag Selector (100% Global) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Country / Region (Global Leaderboard Representation)</span>
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value as GlobalCountryCode)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white outline-none transition"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Institution / School / University */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Current School / College / University</span>
                </label>
                <input
                  type="text"
                  value={schoolOrInst}
                  onChange={(e) => setSchoolOrInst(e.target.value)}
                  placeholder="e.g. Ananda College, Cambridge, MIT, Richmond, Royal College"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white outline-none transition"
                />
              </div>

              {/* Target University / Dream College */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Target University / Dream Fellowship</span>
                </label>
                <input
                  type="text"
                  value={targetUniversity}
                  onChange={(e) => setTargetUniversity(e.target.value)}
                  placeholder="e.g. University of Moratuwa (CSE), Faculty of Medicine, MIT, Cambridge"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white outline-none transition"
                />
              </div>

              {/* Status Quote / Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Personal Study Motto & Bio Status</span>
                </label>
                <textarea
                  value={bioQuote}
                  onChange={(e) => setBioQuote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Aiming for Island Rank 1 in Maths. Studying 6 hours daily with SipArana!"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white outline-none transition resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer transform hover:scale-102 active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Equip & Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
