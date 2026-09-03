import React, { useState } from 'react';
import {
  Film,
  Camera,
  Radio,
  Newspaper,
  BookOpen,
  Sliders,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  Share2,
  Tv,
  Mic,
  Video,
  Layers,
  HelpCircle,
  PlayCircle,
  Eye,
  FileText,
  Volume2,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export type MediaSubTopic =
  | 'theories'
  | 'cinema'
  | 'journalism'
  | 'broadcasting'
  | 'photography'
  | 'practical_notes';

interface MediaStudiesPageProps {
  onNavigateTutor?: (prefill?: string) => void;
  onNavigateQuizzes?: () => void;
  onNavigateOffline?: () => void;
}

export default function MediaStudiesPage({
  onNavigateTutor,
  onNavigateQuizzes,
  onNavigateOffline
}: MediaStudiesPageProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<MediaSubTopic>('theories');
  const [selectedTheoryId, setSelectedTheoryId] = useState<string>('lasswell');

  // Camera Exposure Simulator State
  const [aperture, setAperture] = useState<number>(2.8); // f/2.8
  const [shutterSpeed, setShutterSpeed] = useState<string>('1/500s');
  const [iso, setIso] = useState<number>(400);

  // Completed practical topics state for student tracker
  const [completedNotes, setCompletedNotes] = useState<Record<string, boolean>>({
    'note_3point_lighting': true,
    'note_5w1h_lead': true,
    'note_kadawunu_poronduwa': true,
  });

  const toggleNoteCompletion = (id: string) => {
    setCompletedNotes((prev) => {
      const next = !prev[id];
      return { ...prev, [id]: next };
    });
  };

  // Sub topics configuration
  const SUB_TOPICS: { id: MediaSubTopic; labelEn: string; labelSi: string; labelTa: string; icon: any; count: string }[] = [
    { id: 'theories', labelEn: 'Communication Theories & Models', labelSi: 'සන්නිවේදන න්‍යාය හා ආකෘති', labelTa: 'தொடர்பாடல் கோட்பாடுகள்', icon: Layers, count: '6 Core Models' },
    { id: 'cinema', labelEn: 'Cinema & Sri Lankan Film History', labelSi: 'සිනමා කලාව & ලාංකීය සිනමා ඉතිහාසය', labelTa: 'சினிமா வரலாறு', icon: Film, count: '1895-2024 Milestones' },
    { id: 'journalism', labelEn: 'Print Journalism & News Production', labelSi: 'මුද්‍රිත පුවත්පත් කලාව & ප්‍රවෘත්ති', labelTa: 'அச்சு இதழியல்', icon: Newspaper, count: '5W1H & Ethics' },
    { id: 'broadcasting', labelEn: 'Broadcasting Arts (Radio & TV)', labelSi: 'ගුවන්විදුලි & රූපවාහිනී විකාශනය', labelTa: 'ஒலிபரப்புக் கலை', icon: Radio, count: 'Studio & Foley' },
    { id: 'photography', labelEn: 'Photography & Visual Media', labelSi: 'ඡායාරූප ශිල්පය & දෘශ්‍ය මාධ්‍ය', labelTa: 'புகைப்படக்கலை', icon: Camera, count: 'Interactive Simulator' },
    { id: 'practical_notes', labelEn: 'Practical Training Notes & Guides', labelSi: 'ප්‍රායෝගික පුහුණු සටහන් & මාර්ගෝපදේශ', labelTa: 'செய்முறை குறிப்புகள்', icon: BookOpen, count: 'Guru Potha Aligned' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30 backdrop-blur-sm">
            <Film className="w-4 h-4 text-amber-400" />
            <span>A/L Communication & Media Studies Stream (සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white leading-tight">
            මාධ්‍ය අධ්‍යයන විශේෂ අංශය (Dedicated Media Stream Portal)
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Master the G.C.E. Advanced Level Communication & Media Studies syllabus with interactive theory breakdown models, Sri Lankan cinema archives (1947–Present), photography exposure lab, journalism newsrooms, and practical studio engineering guides.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <button
              onClick={() => onNavigateTutor?.('Explain Harold Lasswell 5-Question Communication Model in Sinhala with exam marking scheme.')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-2 transition shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Media AI Tutor</span>
            </button>

            <button
              onClick={onNavigateQuizzes}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Media MCQ Quizzes</span>
            </button>

            <button
              onClick={onNavigateOffline}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Offline Media PDFs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Topic Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {SUB_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isActive = activeTab === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {topic.count}
                </span>
              </div>
              <div>
                <p className="text-xs font-black line-clamp-1">
                  {language === 'si' ? topic.labelSi : language === 'ta' ? topic.labelTa : topic.labelEn}
                </p>
                <p className="text-[10px] opacity-75 truncate">
                  {language === 'si' ? topic.labelEn : topic.labelSi}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. SUB-TOPIC 1: COMMUNICATION THEORIES & MODELS */}
      {activeTab === 'theories' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Unit 01 & 02 Core Syllabus</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                  සන්නිවේදන න්‍යාය සහ ආකෘති (Communication Models & Frameworks)
                </h2>
              </div>

              {/* Quick Model Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'lasswell', name: 'Harold Lasswell (1948)' },
                  { id: 'shannon', name: 'Shannon & Weaver (1949)' },
                  { id: 'berlo', name: 'David Berlo SMCR (1960)' },
                  { id: 'schramm', name: 'Wilbur Schramm' },
                  { id: 'semiotics', name: 'Semiotics (සංකේතවේදය)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedTheoryId(m.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      selectedTheoryId === m.id
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Breakdown Visualizer */}
            {selectedTheoryId === 'lasswell' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-transparent border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                      හැරල්ඩ් ඩී. ලැස්වෙල්ගේ සන්නිවේදන ආකෘතිය (Harold Lasswell 5-Question Model)
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black">
                      Linear Model • 1948
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    ලැස්වෙල්ගේ ආකෘතිය සන්නිවේදන ක්‍රියාවලිය පැහැදිලි කිරීම සඳහා ප්‍රශ්න 5ක් උපයෝගී කරගනී. මෙම ආකෘතිය ජනසන්නිවේදනයේ බලපෑම (Media Effects) අධ්‍යයනය සඳහා බහුලව භාවිත වේ.
                  </p>

                  {/* 5 Questions Flowchart */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-500/60 shadow-sm text-center space-y-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase">1. Who?</span>
                      <p className="text-xs font-black text-slate-900 dark:text-white">කවුරුන්ද? (Communicator)</p>
                      <p className="text-[10px] text-slate-500">පාලන විශ්ලේෂණය (Control Analysis)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-500/60 shadow-sm text-center space-y-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase">2. Says What?</span>
                      <p className="text-xs font-black text-slate-900 dark:text-white">කුමක් පවසයිද? (Message)</p>
                      <p className="text-[10px] text-slate-500">අන්තර්ගත විශ්ලේෂණය (Content Analysis)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500/60 shadow-sm text-center space-y-1">
                      <span className="text-[10px] font-black text-amber-600 uppercase">3. In Which Channel?</span>
                      <p className="text-xs font-black text-slate-900 dark:text-white">කුමන නාලිකාවෙන්ද? (Medium)</p>
                      <p className="text-[10px] text-slate-500">මාධ්‍ය විශ්ලේෂණය (Media Analysis)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/60 shadow-sm text-center space-y-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">4. To Whom?</span>
                      <p className="text-xs font-black text-slate-900 dark:text-white">කා හටද? (Receiver)</p>
                      <p className="text-[10px] text-slate-500">ප්‍රේක්ෂක විශ්ලේෂණය (Audience Analysis)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-rose-500/60 shadow-sm text-center space-y-1">
                      <span className="text-[10px] font-black text-rose-600 uppercase">5. With What Effect?</span>
                      <p className="text-xs font-black text-slate-900 dark:text-white">කුමන බලපෑමකින්ද? (Effect)</p>
                      <p className="text-[10px] text-slate-500">බලපෑම් විශ්ලේෂණය (Effects Analysis)</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> ලැස්වෙල් ආකෘතියේ වාසි (Strengths)
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                      <li>ඉතා සරල හා තේරුම් ගැනීමට පහසු ඒකදිශානතික (Linear) ආකෘතියක් වීම.</li>
                      <li>සන්නිවේදන ක්‍රියාවලිය පර්යේෂණ ක්ෂේත්‍ර 5කට වර්ගීකරණය කිරීම.</li>
                      <li>ජනසන්නිවේදන කාර්යයන් (දේශපාලන ප්‍රචාරණ, පුවත්පත්) සඳහා ඉතා යෝග්‍ය වීම.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Info className="w-4 h-4" /> ප්‍රධාන දුර්වලතා හා විභාග ප්‍රශ්න (Limitations)
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                      <li>ප්‍රතිපෝෂණය (Feedback) සහ බාධක (Noise) පිළිබඳ සඳහන් නොවීම.</li>
                      <li>සන්නිවේදනය දෙපැත්තට සිදුවන ගතික ක්‍රියාවලියක් බව නොසැලකීම.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTheoryId === 'shannon' && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                    ෂැනන් සහ වීවර්ගේ ගණිතමය සන්නිවේදන ආකෘතිය (Shannon & Weaver Mathematical Model)
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-black">
                    Mother of All Models • 1949
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  ක්ලෝඩ් ෂැනන් සහ වොරන් වීවර් විසින් Bell Laboratories හිදී හඳුන්වාදුන් මෙම ආකෘතිය මගින් ප්‍රථම වරට සන්නිවේදන බාධක (Noise Source) සහ කේතකරණය (Encoding/Decoding) හඳුන්වා දෙන ලදී.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-center">
                    <span className="text-[9px] font-bold text-slate-400">Step 1</span>
                    <p className="text-xs font-bold">තොරතුරු මූලාශ්‍රය (Information Source)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-center">
                    <span className="text-[9px] font-bold text-slate-400">Step 2</span>
                    <p className="text-xs font-bold">ප්‍රේෂකය (Transmitter / Encoder)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-400 text-center">
                    <span className="text-[9px] font-bold text-amber-600">Step 3 (Channel)</span>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">නාලිකාව + ඝෝෂාව (Noise Source)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-center">
                    <span className="text-[9px] font-bold text-slate-400">Step 4</span>
                    <p className="text-xs font-bold">ග්‍රාහකය (Receiver / Decoder)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-center">
                    <span className="text-[9px] font-bold text-slate-400">Step 5</span>
                    <p className="text-xs font-bold">ගමනාන්තය (Destination)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-center">
                    <span className="text-[9px] font-bold text-emerald-600">Extension</span>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">ප්‍රතිපෝෂණය (Feedback Loop)</p>
                  </div>
                </div>
              </div>
            )}

            {selectedTheoryId === 'berlo' && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                  ඩේවිඩ් බර්ලෝගේ SMCR ආකෘතිය (David Berlo's SMCR Model - 1960)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  බර්ලෝගේ ආකෘතිය මූලාශ්‍රය (Source), පණිවිඩය (Message), නාලිකාව (Channel) සහ ග්‍රාහකයා (Receiver) යන ප්‍රධාන සාධක 4 මත පදනම් වේ.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                    <span className="text-xs font-black text-blue-600">S - Source</span>
                    <p className="text-xs font-bold">සන්නිවේදන කුසලතා, ආකල්ප, දැනුම, සමාජ පද්ධතිය, සංස්කෘතිය</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                    <span className="text-xs font-black text-indigo-600">M - Message</span>
                    <p className="text-xs font-bold">අන්තර්ගතය (Content), අංග (Elements), සැලකීම (Treatment), ව්‍යුහය (Structure), කේතය (Code)</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                    <span className="text-xs font-black text-amber-600">C - Channel</span>
                    <p className="text-xs font-bold">පංචේන්ද්‍රිය: දැකීම (Seeing), ඇසීම (Hearing), ස්පර්ශය (Touching), ආඝ්‍රාණය (Smelling), රස බැලීම (Tasting)</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                    <span className="text-xs font-black text-emerald-600">R - Receiver</span>
                    <p className="text-xs font-bold">මූලාශ්‍රයට අනුරූප සන්නිවේදන කුසලතා, ආකල්ප, සංස්කෘතික පසුබිම සහිත ග්‍රාහකයා</p>
                  </div>
                </div>
              </div>
            )}

            {selectedTheoryId === 'semiotics' && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                  සංකේතවේදය සහ අර්ථ නිරූපණය (Semiotics - Ferdinand de Saussure & Roland Barthes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border space-y-2">
                    <h4 className="text-xs font-black text-purple-600">1. සසූර්ගේ සංකල්පය (Ferdinand de Saussure)</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      සංකේතය (Sign) = සංකේතකය (Signifier - භෞතික ස්වරූපය/ශබ්දය/රූපය) + සංකේතිතය (Signified - මනසේ ජනනය වන සංකල්පය).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border space-y-2">
                    <h4 className="text-xs font-black text-purple-600">2. රෝලන්ඩ් බාත්ගේ අර්ථ මට්ටම් (Roland Barthes)</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      • වාච්‍යාර්ථය (Denotation): සෘජු ශබ්දකෝෂ අර්ථය.<br />
                      • ව්‍යංගාර්ථය (Connotation): සංස්කෘතික, චිත්තවේගීය හා පුද්ගලික ගැඹුරු අර්ථය.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SUB-TOPIC 2: CINEMA & SRI LANKAN FILM HISTORY */}
      {activeTab === 'cinema' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">A/L Core Film History Archive</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                සිනමා කලාව හා ශ්‍රී ලාංකීය සිනමා ඉතිහාසය (Cinema History & Film Language)
              </h2>
            </div>

            {/* Historical Milestones Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                ශ්‍රී ලාංකේය සිනමාවේ ඓතිහාසික කඩඉම් (Sri Lankan Cinema Milestones)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black">1947 ජනවාරි 21</span>
                    <span className="text-[10px] text-slate-400 font-bold">පළමු සිංහල චිත්‍රපටය</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-serif">
                    කඩවුණු පොරොන්දුව (Kadawunu Poronduwa)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    බී.ඒ.ඩබ්. ජයමාන්නගේ අධ්‍යක්ෂණයෙන් ඉන්දියාවේ මදුරාසියේ චිත්‍රාගාරවලදී නිපදවන ලදී. මිනර්වා නාට්‍ය කණ්ඩායමේ රුක්මණී දේවි සහ එඩී ජයමාන්න ප්‍රධාන චරිත නිරූපණය කළහ. දකුණු ඉන්දීය නාට්‍යමය ආභාසය තදින් තිබුණි.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/60 border-2 border-blue-500/50 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black">1956 දෙසැම්බර් 28</span>
                    <span className="text-[10px] text-blue-500 font-bold">ස්වදේශීය සිනමා විප්ලවය</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-serif">
                    රේඛාව (Rekava) - ආචාර්ය ලෙස්ටර් ජේම්ස් පීරිස්
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    චිත්‍රාගාරවලින් බැහැරව ස්වභාවික එළිමහන් පරිසරයේ (Outdoor Location) කැමරාගත කළ ප්‍රථම සිංහල චිත්‍රපටයයි. දකුණු ඉන්දීය අනුකරණයෙන් මිදී සැබෑ ශ්‍රී ලාංකික ගැමි ජීවිතය හා සංස්කෘතිය සිනමාරූපී භාෂාවෙන් ඉදිරිපත් කළේය.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black">1963 / 1978</span>
                    <span className="text-[10px] text-emerald-500 font-bold">සම්භාව්‍ය යුගය</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-serif">
                    ගම්පෙරළිය & බඹරු ඇවිත්
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    මාටින් වික්‍රමසිංහගේ නවකතාව ඇසුරින් ලෙස්ටර් නිර්මාණය කළ ‘ගම්පෙරළිය’ නවදිල්ලි ජාත්‍යන්තර සිනමා උළෙලේදී රන් මයුර සම්මානය (Golden Peacock) දිනාගත් අතර ධර්මසේන පතිරාජගේ ‘බඹරු ඇවිත්’ දේශපාලන-සමාජ යථාර්ථවාදී සිනමාවක් බිහිකළේය.
                  </p>
                </div>
              </div>
            </div>

            {/* Film Language Rules */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                සිනමා භාෂාවේ ප්‍රධාන මූලධර්ම (Core Film Grammar Rules)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <p className="font-black text-amber-600 dark:text-amber-400">180° අංශක රීතිය (180-Degree Rule)</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">දෙදෙනෙකු අතර සංවාදයකදී කැමරාව එකම පැත්තක රඳවා තබාගනිමින් අවකාශීය දිශානතිය (Screen Direction) ආරක්ෂා කිරීම.</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <p className="font-black text-blue-600 dark:text-blue-400">කුලෙෂොව් ආචරණය (Kuleshov Effect)</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">ලෙව් කුලෙෂොව් පෙන්වාදුන් පරිදි, රූප රාමු දෙකක් සංස්කරණයේදී එකිනෙක යාකිරීමෙන් ප්‍රේක්ෂක මනසේ නව අර්ථයක් ජනනය වීම.</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <p className="font-black text-emerald-600 dark:text-emerald-400">මිසෝන්සෙන් (Mise-en-Scène)</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">කැමරා කාචය ඉදිරියේ රූප රාමුව තුළ ස්ථානගත කර ඇති සියලු දේ (නළු නිළියන්, ඇඳුම්, පසුතල නිර්මාණය, ආලෝකකරණය).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-TOPIC 3: PRINT JOURNALISM & NEWS PRODUCTION */}
      {activeTab === 'journalism' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Unit 04 & 05 Newsroom Practice</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                මුද්‍රිත පුවත්පත් කලාව සහ ප්‍රවෘත්ති සම්පාදනය (Print Journalism)
              </h2>
            </div>

            {/* Inverted Pyramid & 5W1H */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-4">
                <h3 className="text-base font-black text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  ප්‍රවෘත්ති රචනයේ 5W 1H සූත්‍රය (5W1H Lead Formula)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  පුවත්පත් ප්‍රවෘත්තියක මුල්ම ඡේදය හෙවත් ආරම්භක ඡේදයේදී (Lead Paragraph) මෙම මූලික ප්‍රශ්න 6ට පිළිතුරු සැපයිය යුතුය:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold">1. Who? (කවුරුන්ද / කවුරුන් පිළිබඳවද)</div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold">2. What? (සිදුවූයේ කුමක්ද)</div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold">3. Where? (සිදුවූයේ කොහේද / ස්ථානය)</div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold">4. When? (සිදුවූයේ කවදාද / වේලාව)</div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold">5. Why? (සිදුවූයේ කුමන හේතුවක් නිසාද)</div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-400 font-bold text-amber-900 dark:text-amber-300">6. How? (සිදුවූයේ කෙසේද / ක්‍රමය)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-4">
                <h3 className="text-base font-black text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  යටිකුරු පිරමිඩ ආකෘතිය (Inverted Pyramid Structure)
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-amber-500 text-slate-950 rounded-xl font-black text-center shadow">
                    ප්‍රධාන ශීර්ෂ පාඨය & ප්‍රමුඛ ඡේදය (Lead - 5W1H) • වඩාත්ම වැදගත් තොරතුරු
                  </div>
                  <div className="p-3 bg-amber-400/80 text-slate-950 rounded-xl font-bold text-center mx-4">
                    වැදගත් අතිරේක තොරතුරු, පසුබිම් විස්තර සහ උපුටා දැක්වීම් (Body Paragraphs)
                  </div>
                  <div className="p-2.5 bg-amber-300/60 text-slate-950 rounded-xl font-semibold text-center mx-10">
                    අඩු වැදගත්කමක් ඇති සාමාන්‍ය තොරතුරු (Least Important Details)
                  </div>
                </div>
              </div>
            </div>

            {/* News Values */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                ප්‍රවෘත්ති වටිනාකම් (News Values / Criteria for Selection):
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {['නැවුම් බව (Timeliness)', 'ආසන්න බව (Proximity)', 'ප්‍රමුඛතාව / ප්‍රකට බව (Prominence)', 'බලපෑම / ප්‍රතිඵලය (Consequence / Impact)', 'මානුෂික රුචිය (Human Interest)', 'ගැටුම / අරගලය (Conflict)', 'අපූර්වත්වය / අමුතු බව (Oddity / Novelty)'].map((val, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                    ✓ {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-TOPIC 4: BROADCASTING ARTS (RADIO & TV) */}
      {activeTab === 'broadcasting' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Radio & Television Production</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                ගුවන්විදුලි හා රූපවාහිනී විකාශන කලාව (Broadcasting Arts)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radio Production & Foley */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-base">
                  <Mic className="w-5 h-5" />
                  <span>ගුවන්විදුලි නාට්‍ය සහ ශබ්ද ප්‍රයෝග (Foley Sound Design)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ගුවන්විදුලිය ශ්‍රව්‍ය මාධ්‍යයක් (Blind Medium) වන බැවින් ශ්‍රාවකයාගේ මනසේ පරිකල්පනීය රූප මැවීම සඳහා ශබ්ද ප්‍රයෝග (Sound Effects) අත්‍යවශ්‍ය වේ.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex items-center justify-between">
                    <span className="font-bold">1. ස්වභාවික ශබ්ද (Natural Sound / Actuality)</span>
                    <span className="text-[10px] text-slate-400">කුරුලු නාද, වැසි හඬ</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex items-center justify-between">
                    <span className="font-bold">2. කෘත්‍රිම ෆෝලි ශබ්ද (Foley Effects)</span>
                    <span className="text-[10px] text-slate-400">පියවර හඬ, දොර වැසෙන හඬ</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex items-center justify-between">
                    <span className="font-bold">3. පසුබිම් සංගීතය (Theme & Mood Music)</span>
                    <span className="text-[10px] text-slate-400">චිත්තවේග උද්දීපනය</span>
                  </div>
                </div>
              </div>

              {/* Television Production */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-base">
                  <Tv className="w-5 h-5" />
                  <span>රූපවාහිනී ස්ටූඩියෝ කාර්යයන් සහ කැමරා කෝණ (Shot Sizes)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                    <p className="font-black text-blue-600">ELS (Extreme Long Shot)</p>
                    <p className="text-[10px] text-slate-500">පරිසරය හඳුන්වා දීම (Establishing)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                    <p className="font-black text-indigo-600">MS (Medium Shot)</p>
                    <p className="text-[10px] text-slate-500">ඉණෙන් ඉහළ සංවාද රූප රාමුව</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                    <p className="font-black text-amber-600">CU (Close-Up Shot)</p>
                    <p className="text-[10px] text-slate-500">මුහුණේ හැඟීම් ප්‍රකාශනය</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                    <p className="font-black text-rose-600">ECU (Extreme Close-Up)</p>
                    <p className="text-[10px] text-slate-500">ඇස්, ඇඟිලි සලකුණු ආදී කුඩා විස්තර</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SUB-TOPIC 5: PHOTOGRAPHY & VISUAL MEDIA (WITH INTERACTIVE LAB) */}
      {activeTab === 'photography' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Interactive Photography Simulator</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                  ඡායාරූප ශිල්පය සහ නිරාවරණ ත්‍රිකෝණය (Exposure Triangle Simulator)
                </h2>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Real-Time Physics Simulation</span>
              </div>
            </div>

            {/* Interactive Simulator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-6 space-y-5 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                {/* 1. Aperture Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>1. විවරය (Aperture / f-stop): <span className="text-amber-600 dark:text-amber-400 font-mono">f/{aperture}</span></span>
                    <span className="text-[10px] text-slate-500">
                      {aperture <= 2.8 ? 'Shallower Depth of Field (Bokeh)' : aperture >= 11 ? 'Deep Depth of Field (All in focus)' : 'Medium Depth'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.4"
                    max="22"
                    step="0.7"
                    value={aperture}
                    onChange={(e) => setAperture(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>f/1.4 (Wide Open)</span>
                    <span>f/5.6</span>
                    <span>f/11</span>
                    <span>f/22 (Small Hole)</span>
                  </div>
                </div>

                {/* 2. Shutter Speed Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>2. කපාට වේගය (Shutter Speed): <span className="text-blue-600 dark:text-blue-400 font-mono">{shutterSpeed}</span></span>
                    <span className="text-[10px] text-slate-500">
                      {shutterSpeed === '1/1000s' || shutterSpeed === '1/500s' ? 'Freezes Fast Action' : 'Captures Motion Blur'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {['1/1000s', '1/500s', '1/125s', '1/30s'].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setShutterSpeed(speed)}
                        className={`py-2 rounded-xl font-bold font-mono transition cursor-pointer ${
                          shutterSpeed === speed
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. ISO Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>3. සංවේදීතාව (ISO Sensitivity): <span className="text-emerald-600 dark:text-emerald-400 font-mono">ISO {iso}</span></span>
                    <span className="text-[10px] text-slate-500">
                      {iso <= 200 ? 'Clean Image (No Noise)' : iso >= 3200 ? 'High Grain / Digital Noise' : 'Balanced'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-xs">
                    {[100, 400, 800, 1600, 3200].map((val) => (
                      <button
                        key={val}
                        onClick={() => setIso(val)}
                        className={`py-1.5 rounded-xl font-bold font-mono transition cursor-pointer ${
                          iso === val
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Viewport */}
              <div className="lg:col-span-6 bg-slate-950 text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-4 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Camera className="w-4 h-4" /> DSLR LIVE VIEWFINDER
                  </span>
                  <span>M-MODE • RAW</span>
                </div>

                {/* Simulated Visual Preview */}
                <div className="my-6 p-6 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl relative">
                    <span className="font-black text-slate-950 text-lg">SUBJECT</span>
                    {/* Simulated Bokeh blur background */}
                    {aperture <= 2.8 && (
                      <span className="absolute -inset-4 bg-amber-500/20 rounded-full blur-lg animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-white">
                      Field Depth: {aperture <= 2.8 ? '🌟 Shallow Focus (Subject Pop-out)' : 'Full Scenery in Sharp Focus'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Noise Status: {iso >= 1600 ? '⚠️ High Digital Grain Detected' : '✅ Pristine Crisp Pixels'}
                    </p>
                  </div>
                </div>

                {/* Camera HUD Indicator */}
                <div className="flex items-center justify-around bg-slate-900 p-3 rounded-xl text-xs font-mono font-bold">
                  <span className="text-amber-400">f/{aperture}</span>
                  <span className="text-blue-400">{shutterSpeed}</span>
                  <span className="text-emerald-400">ISO {iso}</span>
                  <span className="text-slate-400">±0.0 EV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUB-TOPIC 6: PRACTICAL TRAINING NOTES & SYLLABUS CHECKLIST */}
      {activeTab === 'practical_notes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">A/L Practical Assessment Guide</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                ප්‍රායෝගික පුහුණු සටහන් & විභාග මාර්ගෝපදේශ (Practical Notes)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'note_3point_lighting',
                  title: 'ත්‍රිලක්ෂ්‍ය ආලෝකකරණය (3-Point Lighting Technique)',
                  category: 'Studio Lighting',
                  desc: 'Key Light (ප්‍රධාන ආලෝකය - 45°), Fill Light (පිරවුම් ආලෝකය - සෙවණැලි මකා දැමීමට), සහ Back Light (පසුපස ආලෝකය - වස්තුව පසුතලයෙන් වෙන් කිරීමට).',
                  marks: '+15 XP'
                },
                {
                  id: 'note_5w1h_lead',
                  title: 'ප්‍රවෘත්ති වාර්තාකරණය සහ මුඛ්‍ය ඡේදය ලිවීම',
                  category: 'Print Journalism',
                  desc: 'මූලික තොරතුරු 6 (5W1H) උපයෝගී කරගනිමින් වචන 30-40ක් ඇතුළත ආකර්ෂණීය ශීර්ෂ පාඨයක් හා මුඛ්‍ය ඡේදයක් සැකසීම.',
                  marks: '+15 XP'
                },
                {
                  id: 'note_mic_patterns',
                  title: 'මයික්‍රෆෝන ධ්‍රැවීය රටා (Microphone Polar Patterns)',
                  category: 'Audio Engineering',
                  desc: 'Cardioid (හෘදයාකාර), Omnidirectional (සර්වදිශානතික), Bidirectional (ද්විදිශානතික) සහ Shotgun මයික්‍රෆෝන භාවිත අවස්ථා.',
                  marks: '+15 XP'
                },
                {
                  id: 'note_radio_script',
                  title: 'ගුවන්විදුලි වාර්තා වැඩසටහන් පිටපත් රචනය',
                  category: 'Broadcasting Script',
                  desc: 'ශ්‍රව්‍ය සංඥා (Audio Cues), කථකයාගේ දෙබස් (Voice-over), සංගීත ඛණ්ඩ (Music stingers) සහ Fade-in/Fade-out ලකුණු කිරීම.',
                  marks: '+15 XP'
                },
              ].map((note) => {
                const isDone = completedNotes[note.id];
                return (
                  <div
                    key={note.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                      isDone
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {note.category}
                      </span>
                      <span className="text-xs font-bold text-amber-600">{note.marks}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white font-serif">{note.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{note.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onNavigateTutor?.(`Explain ${note.title} for A/L Media Studies with sample marking points.`)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Study with AI
                      </button>

                      <button
                        onClick={() => toggleNoteCompletion(note.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isDone ? 'Marked as Mastered' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
