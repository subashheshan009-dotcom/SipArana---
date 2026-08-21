import React, { useState } from 'react';
import {
  Settings,
  User,
  School,
  MapPin,
  Moon,
  Sun,
  Globe,
  Bell,
  Trash2,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Save,
  GraduationCap,
  Layers
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SRI_LANKA_DISTRICTS, SCHOOL_GRADES } from '@/data/mockData';
import type { Stream, ExamLevel, Medium, SchoolGrade } from '@/types';

export default function SettingsPage() {
  const { profile, updateProfile, setGradeAndStream, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(profile?.name || '');
  const [school, setSchool] = useState(profile?.school || '');
  const [district, setDistrict] = useState(profile?.district || 'Colombo');
  const [grade, setGrade] = useState<SchoolGrade>(profile?.grade || 11);
  const [stream, setStream] = useState<Stream>(profile?.stream || 'General O/L');
  const [targetYear, setTargetYear] = useState<number>(profile?.targetYear || 2026);
  const [medium, setMedium] = useState<Medium>(profile?.medium || 'Sinhala');

  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyPapers, setNotifyPapers] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGradeChange = (newGrade: SchoolGrade) => {
    setGrade(newGrade);
    if (newGrade <= 9) {
      setStream('Junior Secondary (Grade 6-9)');
    } else if (newGrade <= 11) {
      setStream('General O/L');
    } else {
      if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)') {
        setStream('Physical Science (Maths)');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedLevel: ExamLevel = 'AL';
    if (grade <= 9) calculatedLevel = 'JUNIOR';
    else if (grade <= 11) calculatedLevel = 'OL';

    updateProfile({
      name,
      school,
      district,
      grade,
      level: calculatedLevel,
      stream,
      targetYear,
      medium
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedGradeInfo = SCHOOL_GRADES.find(g => g.grade === grade);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          ගිණුම් සහ ශ්‍රේණි සැකසුම් (Account & Curriculum Settings)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ඔබගේ ශ්‍රේණිය (Grade 6-13), විෂය ධාරාව, පාසල, දිස්ත්‍රික්කය සහ තේමාවන් කළමනාකරණය කරන්න.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>සැකසුම් සාර්ථකව සුරකින ලදී! (Settings saved successfully).</span>
        </div>
      )}

      {/* 1. Profile Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <img
            src={profile?.avatar}
            alt={profile?.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {profile?.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {profile?.grade} ශ්‍රේණිය
              </span>
              {profile?.isPremium && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{profile?.email} • {profile?.school}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">නම (Full Name)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">පාසල (School Name)</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Grade Selector (6-13) */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>ශ්‍රේණිය වෙනස් කරන්න (Select Active Grade 6–13):</span>
              </label>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {selectedGradeInfo?.nameSinhala} ({selectedGradeInfo?.stage})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SCHOOL_GRADES.map((g) => {
                const isSelected = grade === g.grade;
                return (
                  <button
                    key={g.grade}
                    type="button"
                    onClick={() => handleGradeChange(g.grade)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25 scale-105'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span className="text-sm">{g.grade}</span>
                    <span className="text-[9px] opacity-75">{g.stage}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">දිස්ත්‍රික්කය (District)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {grade >= 12 ? (
              <div>
                <label className="block font-semibold text-slate-500 mb-1">උසස් පෙළ විෂය ධාරාව (A/L Stream)</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value as Stream)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100"
                >
                  <option value="Physical Science (Maths)">Physical Science (Maths)</option>
                  <option value="Biological Science (Bio)">Biological Science (Bio)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-500 mb-1">විෂය මාලා ස්ථරය (Curriculum Level)</label>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold truncate">
                  {grade <= 9 ? 'Junior Secondary (6–9)' : 'General O/L (10–11)'}
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-500 mb-1">ඉලක්ක වසර (Target Year)</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>වෙනස්කම් සුරකින්න (Save Changes)</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme & Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Moon className="w-4 h-4 text-blue-600" />
          <span>තේමාව සහ සංදර්ශනය (Theme & Display)</span>
        </h3>

        <div className="grid grid-cols-3 gap-3 text-xs font-bold">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'light'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'dark'
                ? 'bg-blue-950/60 border-blue-500 text-blue-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <Moon className="w-4 h-4 text-blue-400" />
            <span>Dark Theme</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'system'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* 3. Session & Danger Zone */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            ගිණුමෙන් නික්මෙන්න (Sign Out)
          </h4>
          <p className="text-xs text-slate-500">
            Sign out of your active session on this device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 text-xs font-bold hover:bg-red-100 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
