import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Zap,
  CheckCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';

interface AudioSummary {
  id: string;
  subject: string;
  category: 'A/L' | 'O/L';
  title: {
    en: string;
    si: string;
    ta: string;
  };
  duration: string;
  durationSeconds: number;
  author: string;
  summaryText: {
    en: string;
    si: string;
    ta: string;
  };
  keyTakeaways: string[];
}

const AUDIO_SUMMARIES: AudioSummary[] = [
  {
    id: 'aud-1',
    subject: 'Physics (A/L)',
    category: 'A/L',
    title: {
      en: 'Thermodynamics & Heat Engines in 4 Minutes',
      si: 'තාප ගති විද්‍යාව සහ තාප එන්ජින් මිනිත්තු 4කින්',
      ta: 'வெப்ப இயக்கவியல் மற்றும் வெப்ப இயந்திரங்கள் 4 நிமிடங்களில்'
    },
    duration: '4:15',
    durationSeconds: 255,
    author: 'Eng. Chathura Weerasinghe',
    summaryText: {
      en: "The First Law of Thermodynamics is conservation of energy: ΔQ = ΔU + ΔW. For an isothermal process (constant temperature), ΔU is zero, so heat supplied equals work done. For an adiabatic process (no heat exchange), ΔQ is zero, so work done equals -ΔU. In Carnot heat engine cycles, maximum theoretical efficiency η = 1 - (Tc / Th). Remember to always convert Celsius to Kelvin when calculating thermal efficiencies in A/L Paper 2 Part B!",
      si: "තාප ගති විද්‍යාවේ පළමු නියමය ශක්ති සංස්ථිති නියමයයි: ΔQ = ΔU + ΔW. සමඋෂ්ණත්ව ක්‍රියාවලියකදී (නියත උෂ්ණත්වය), අභ්‍යන්තර ශක්ති වෙනස ΔU ශුන්‍ය වන බැවින් සපයන තාපය කළ කාර්යයට සමාන වේ. තාප හුවමාරුවක් සිදුනොවන ස්ථිරතාපී ක්‍රියාවලියකදී ΔQ = 0 වන අතර, ΔW = -ΔU වේ. කානොට් තාප එන්ජිමක උපරිම කාර්යක්ෂමතාවය η = 1 - (Tc / Th) වේ. උෂ්ණත්ව ගණනය කිරීම් වලදී සෙල්සියස් අගයන් කෙල්වින් වලට හැරවීම අනිවාර්ය වේ!",
      ta: "வெப்ப இயக்கவியலின் முதல் விதி ஆற்றல் காப்பு விதியாகும்: ΔQ = ΔU + ΔW. சமவெப்பநிலை செயல்முறையில் ΔU பூஜ்ஜியம் ஆகும். வெப்பப் பரிமாற்றமில்லா செயல்முறையில் ΔQ பூஜ்ஜியமாகும். கார்னோ இயந்திரத்தின் உச்ச வினைத்திறன் η = 1 - (Tc / Th) ஆகும்."
    },
    keyTakeaways: [
      'ΔQ = ΔU + ΔW (First Law)',
      'Carnot Efficiency η = 1 - (T_cold / T_hot)',
      'Always convert temperature to Kelvin (K = °C + 273)'
    ]
  },
  {
    id: 'aud-2',
    subject: 'Biology (A/L)',
    category: 'A/L',
    title: {
      en: 'Human Nervous System & Action Potential Transmission',
      si: 'ස්නායු පද්ධතිය සහ ක්‍රියා විභව සම්ප්‍රේෂණය',
      ta: 'மனித நரம்பு மண்டலம் & தொழிற்பாட்டு அழுத்த கடத்தல்'
    },
    duration: '3:50',
    durationSeconds: 230,
    author: 'Dr. Senanayake',
    summaryText: {
      en: "Resting membrane potential is maintained at approximately -70mV by the Na+/K+ ATPase pump which actively pumps 3 Na+ out for every 2 K+ inside. When threshold stimulus (-55mV) is reached, voltage-gated Na+ channels open rapidly causing Depolarization up to +30mV. Then, Na+ channels inactivate and voltage-gated K+ channels open, causing Repolarization. In myelinated axons, action potentials jump across nodes of Ranvier via Saltatory Conduction.",
      si: "විවේක පටල විභවය ආසන්න වශයෙන් -70mV මට්ටමක පවත්වා ගන්නේ Na+/K+ පොම්පය මගිනි. එය Na+ අයන 3ක් පිටතටත් K+ අයන 2ක් ඇතුළටත් පොම්ප කරයි. උත්තේජනයක් හේතුවෙන් සීමක විභවය (-55mV) ඉක්මවූ විට, Na+ නාල විවෘත වී අධිධ්‍රැවීකරණය වී +30mV දක්වා ඉහළ යයි. ඉන්පසු K+ නාල විවෘත වී පුනර්ධ්‍රැවීකරණය සිදුවේ. මයලින් කොපුව සහිත ස්නායුවල ක්‍රියා විභවය රැන්වියර් ගැට ඔස්සේ පිමි ආකාරයෙන් ගමන් කරයි (Saltatory conduction).",
      ta: "ஓய்வு நிலை அழுத்தம் -70mV ஆகும். Na+/K+ பம்ப் மூலம் இது பராமரிக்கப்படுகிறது. சோடியம் உட்சென்று +30mV வரை உயர்வது Depolarization எனப்படும்."
    },
    keyTakeaways: [
      'Resting potential = -70 mV (3 Na+ out / 2 K+ in)',
      'Depolarization: Voltage-gated Na+ channels open',
      'Saltatory conduction across Nodes of Ranvier increases speed 50x'
    ]
  },
  {
    id: 'aud-3',
    subject: 'Combined Mathematics (A/L)',
    category: 'A/L',
    title: {
      en: 'Mastering Trigonometric Equations & Identities',
      si: 'ත්‍රිකෝණමිතික සමීකරණ සහ සර්වසාම්‍ය කෙටි සාරාංශය',
      ta: 'முக்கோணவியல் சமன்பாடுகள் & முற்றொருமைகள்'
    },
    duration: '5:10',
    durationSeconds: 310,
    author: 'Prof. K. Perera',
    summaryText: {
      en: "Compound angles are the root of almost all A/L trigonometry: sin(A ± B) = sinA cosB ± cosA sinB, cos(A ± B) = cosA cosB ∓ sinA sinB. For general solutions: sin θ = sin α implies θ = nπ + (-1)^n α. For cos θ = cos α, θ = 2nπ ± α. When solving tan θ = tan α, general solution is simply θ = nπ + α. Keep this memorized for immediate Part B marks!",
      si: "ත්‍රිකෝණමිතික මූලික සූත්‍ර: sin(A ± B) = sinA cosB ± cosA sinB, cos(A ± B) = cosA cosB ∓ sinA sinB. පොදු විසඳුම්: sin θ = sin α නම්, θ = nπ + (-1)^n α වේ. cos θ = cos α නම්, θ = 2nπ ± α වේ. tan θ = tan α නම් θ = nπ + α වේ. උසස් පෙළ දෙවන ප්‍රශ්න පත්‍රයේ මුල් ලකුණු 10 ලබා ගැනීමට මෙම පොදු විසඳුම් අත්‍යවශ්‍ය වේ!",
      ta: "sin(A ± B) = sinA cosB ± cosA sinB. பொதுத் தீர்வுகள்: sin θ = sin α எனின் θ = nπ + (-1)^n α. cos θ = cos α எனின் θ = 2nπ ± α."
    },
    keyTakeaways: [
      'sin θ = sin α ⇒ θ = nπ + (-1)^n α',
      'cos θ = cos α ⇒ θ = 2nπ ± α',
      'tan θ = tan α ⇒ θ = nπ + α'
    ]
  },
  {
    id: 'aud-4',
    subject: 'History & Science (O/L)',
    category: 'O/L',
    title: {
      en: 'Sri Lankan Irrigation Civilization & King Parakramabahu',
      si: 'ශ්‍රී ලංකාවේ වාරි ශිෂ්ටාචාරය සහ මහා පරාක්‍රමබාහු රජු',
      ta: 'இலங்கையின் நீர்ப்பாசன நாகரிகம் மற்றும் பராக்கிரமபாகு மன்னன்'
    },
    duration: '3:30',
    durationSeconds: 210,
    author: 'Anura Wickramasinghe',
    summaryText: {
      en: "The ancient hydraulic civilization of Sri Lanka is defined by the Biso Kotuwa (cistern sluice) which neutralized high water pressure without damaging earthen dam walls. King Parakramabahu I declared that 'Not even a single drop of rain water that falls on this island should flow into the sea without being made useful to man', constructing the magnificent Parakrama Samudraya which united five large reservoirs.",
      si: "පුරාණ ලක්දිව වාරි ශිෂ්ටාචාරයේ මහා තාක්ෂණික විප්ලවය වූයේ බිසෝකොටුවයි. ඒ මගින් ජල පීඩනය පාලනය කර වේලි ආරක්ෂා විය. 'අහසින් වැටෙන එකදු දිය බිඳක් හෝ මිනිසාගේ ප්‍රයෝජනයට නොගෙන මුහුදට ගලා යාමට ඉඩ නොදිය යුතුය' යැයි ප්‍රකාශ කළ පළමුවන පරාක්‍රමබාහු රජු විශාල වැව් පහක් එකතු කර පරාක්‍රම සමුද්‍රය නිර්මාණය කළේය.",
      ta: "பண்டைய நீர்ப்பாசனத்தின் உச்சம் பிசோகொட்டுவ ஆகும். மகா பராக்கிரமபாகு மன்னர் பராக்கிரம சமுத்திரத்தைக் கட்டினார்."
    },
    keyTakeaways: [
      'Biso Kotuwa: Ancient water pressure neutralizer',
      'Parakrama Samudra: 5 unified historic reservoirs',
      'High-yield 8-mark question in O/L History Part 2'
    ]
  }
];

export default function AudioSummariesPage() {
  const { addXP } = useAuth();
  const { language } = useLanguage();

  const [activeSummaryId, setActiveSummaryId] = useState<string>('aud-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentProgressSeconds, setCurrentProgressSeconds] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'A/L' | 'O/L'>('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const activeSummary = AUDIO_SUMMARIES.find((a) => a.id === activeSummaryId) || AUDIO_SUMMARIES[0];
  const activeText = activeSummary.summaryText[language] || activeSummary.summaryText.en;

  // Web Speech API Voice synthesis handling
  useEffect(() => {
    if (!isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeText);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;

      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentProgressSeconds(activeSummary.durationSeconds);
        addXP(40);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // safe fallback
        }
      };

      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }

    // Progress timer
    const interval = setInterval(() => {
      setCurrentProgressSeconds((prev) => {
        if (prev >= activeSummary.durationSeconds) {
          clearInterval(interval);
          return activeSummary.durationSeconds;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, activeSummaryId, playbackSpeed, language]);

  const handleTogglePlay = (summaryId?: string) => {
    if (summaryId && summaryId !== activeSummaryId) {
      setActiveSummaryId(summaryId);
      setCurrentProgressSeconds(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProgressSeconds(Number(e.target.value));
  };

  const handleToggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const filteredSummaries = AUDIO_SUMMARIES.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div id="audio-notes-summaries-page" className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>Voice Notes & Audio Summaries</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              High-Yield Revision
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'ශ්‍රව්‍ය කෙටි සටහන් (Audio Summaries)'
              : language === 'ta'
              ? 'குரல் குறிப்புகள் & ஆடியோ சுருக்கங்கள்'
              : 'Voice Notes & High-Yield Audio Summaries'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'ගමන් බිමන් වලදී හෝ විවේකීව සිටින විට පහසුවෙන් සවන් දී මතකය තහවුරු කරගත හැකි විෂය සාරාංශ'
              : language === 'ta'
              ? 'பயணம் செய்யும் போதோ அல்லது ஓய்வெடுக்கும் போதோ கேட்டுப் படிப்பதற்கான ஆடியோ சுருக்கங்கள்'
              : 'High-yield audio summaries and voice recitations for effortless learning on the go.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          {(['ALL', 'A/L', 'O/L'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Grades' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Guidance */}
      <KaviMascot
        contextPage="audio"
        customMessage={
          language === 'si'
            ? '🦉 කවි ඔයාට කියනවා: පාඩම් කරලා මහන්සි වෙලාවට ඇස් දෙක පියාගෙන මේ Audio Summaries වලට 1.25x වේගයෙන් සවන් දෙන්න. නින්දට පෙර අසන සටහන් මතකයේ 3 ගුණයක් තදින් රැඳෙනවා!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: கண்களை மூடிக்கொண்டு இந்த ஆடியோ சுருக்கங்களைக் கேளுங்கள். நினைவாற்றல் 3 மடங்கு அதிகரிக்கும்!'
            : '🦉 Kavi says: Close your eyes and listen to these high-yield audio notes at 1.25x speed during daily downtime for effortless recall!'
        }
      />

      {/* Master Interactive Audio Player */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/30">
              {activeSummary.subject} • {activeSummary.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
              {activeSummary.title[language] || activeSummary.title.en}
            </h2>
            <div className="flex items-center gap-2 text-xs text-indigo-300/80">
              <span>Presented by {activeSummary.author}</span>
              <span>•</span>
              <span>Duration {activeSummary.duration}</span>
            </div>
          </div>

          {/* Animated sound wave bars when playing */}
          <div className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-800/40">
            {[40, 70, 95, 60, 85, 30, 90, 50, 80, 45].map((height, i) => (
              <span
                key={i}
                style={{ height: isPlaying ? `${height}%` : '20%' }}
                className={`w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-amber-400 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar & Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max={activeSummary.durationSeconds}
            value={currentProgressSeconds}
            onChange={handleSeek}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-indigo-950/80 rounded-lg"
          />
          <div className="flex justify-between text-xs text-indigo-300 font-mono">
            <span>
              {Math.floor(currentProgressSeconds / 60)}:
              {String(currentProgressSeconds % 60).padStart(2, '0')}
            </span>
            <span>{activeSummary.duration}</span>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-indigo-800/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentProgressSeconds(0)}
              className="p-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-800 text-indigo-200 transition"
              title="Restart Audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Big Play / Pause Button */}
            <button
              id="main-audio-play-btn"
              type="button"
              onClick={() => handleTogglePlay()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm shadow-lg flex items-center gap-2 transition transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-slate-950" />
                  <span>Pause Summary</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Listen to Audio (+40 XP)</span>
                </>
              )}
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 bg-indigo-950/80 p-1.5 rounded-2xl border border-indigo-800/40">
            <span className="text-[11px] font-bold text-indigo-300 px-1">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  playbackSpeed === spd
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-indigo-300 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-800/50 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Note Transcript</span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
            {activeText}
          </p>

          {/* Key Takeaways */}
          <div className="pt-2 border-t border-indigo-900 flex flex-wrap gap-2">
            {activeSummary.keyTakeaways.map((takeaway, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-indigo-900/80 text-amber-200 text-[11px] font-semibold flex items-center gap-1 border border-indigo-700/50"
              >
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>{takeaway}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Playlists & Library */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Curated Audio Summaries Library</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{filteredSummaries.length} tracks available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredSummaries.map((summary) => {
            const isCurrent = summary.id === activeSummaryId;

            return (
              <div
                key={summary.id}
                onClick={() => handleTogglePlay(summary.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-md ring-1 ring-indigo-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0 ${
                      isCurrent && isPlaying
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {summary.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {summary.duration}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {summary.title[language] || summary.title.en}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {summary.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(summary.id);
                    }}
                    className={`p-1.5 rounded-xl transition ${
                      bookmarkedIds.includes(summary.id)
                        ? 'text-amber-500'
                        : 'text-slate-300 hover:text-slate-500'
                    }`}
                    title="Bookmark track"
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(summary.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
