import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  CheckCircle,
  Bookmark,
  Sparkles,
  BookOpen,
  FastForward,
  Rewind,
  Share2,
  CheckCircle2,
  Download,
  Flame,
  Award,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  Calculator,
  Dna,
  Cpu,
  Landmark,
  Zap,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import KaviMascot from '@/components/KaviMascot';
import { soundFX } from '@/utils/audioUtils';

export interface ConceptQuizQuestion {
  question: { en: string; si: string; ta: string };
  options: { en: string[]; si: string[]; ta: string[] };
  correctIndex: number;
  explanation: { en: string; si: string; ta: string };
}

export interface AudioSummary {
  id: string;
  subject: string;
  subjectId: string;
  category: 'Grade 5' | 'O/L' | 'A/L';
  stream?: string;
  levelBadge: string;
  title: {
    en: string;
    si: string;
    ta: string;
  };
  duration: string;
  durationSeconds: number;
  author: string;
  authorTitle: string;
  summaryText: {
    en: string;
    si: string;
    ta: string;
  };
  keyTakeaways: string[];
  examTips: string[];
  formulasOrRules?: string[];
  conceptQuiz?: ConceptQuizQuestion[];
}

export const COMPREHENSIVE_AUDIO_SUMMARIES: AudioSummary[] = [
  // ==========================================
  // GRADE 5 SCHOLARSHIP (5 වසර ශිෂ්‍යත්වය)
  // ==========================================
  {
    id: 'aud-g5-sinhala-grammar',
    subject: 'සිංහල භාෂාව (Sinhala)',
    subjectId: 'scholarship_sinhala',
    category: 'Grade 5',
    stream: 'Grade 5 Scholarship',
    levelBadge: '5 වසර ශිෂ්‍යත්ව',
    title: {
      en: 'Grade 5 Sinhala Grammar & Vocabulary Quick Recall',
      si: '5 ශ්‍රේණිය සිංහල ව්‍යාකරණ, සමාන පද & යුගල පද කෙටි ආවර්ජනය',
      ta: '5 ஆம் தரம் சிங்கள இலக்கணம் மற்றும் சொல்வளம்'
    },
    duration: '3:20',
    durationSeconds: 200,
    author: 'ගුරු උපදේශිකා මාලිනී විජේසිංහ',
    authorTitle: 'Primary Education Specialist, NIE',
    summaryText: {
      en: "In Grade 5 Scholarship Sinhala Paper 2, grammar rules carry critical marks. Remember: In subject-predicate agreement (උක්ත-ආඛ්‍යාත පද සම්බන්ධය), when the subject is singular (ඒක වචන) like 'ළමයා', the verb ends with 'යි' or 'ති' like 'ලියයි'. When plural (බහු වචන) like 'ළමයි', the verb ends with 'ති' or 'හු' like 'ලියති'. For collective nouns (සමූහවාචී නාම) like 'හමුදාව' or 'රංචුව', the verb is always treated as singular. Memorize essential opposite words (විරුද්ධ පද) like 'කෘතඥ - කෘතඝ්න', and pair words (යුගල පද) like 'කෑම බීම', 'ඇඳුම් පැළඳුම්'!",
      si: "ශිෂ්‍යත්ව විභාගයේ 2 වන ප්‍රශ්න පත්‍රයේ සිංහල ව්‍යාකරණ ඉතා වැදගත් වේ. උක්ත-ආඛ්‍යාත පද සම්බන්ධයේදී: 'ළමයා' වැනි ඒක වචන උක්තයකට ආඛ්‍යාතය 'ලියයි' ලෙසත්, 'ළමයි' වැනි බහු වචන උක්තයකට 'ලියති' හෝ 'ලියත්' ලෙසත් යෙදේ. 'හමුදාව', 'ගව රංචුව' වැනි සමූහවාචී නාම පද හැමවිටම ඒක වචන ලෙස සලකා ආඛ්‍යාතය යෙදිය යුතුය. කෘතඥ x කෘතඝ්න, පක්ෂ x විපක්ෂ වැනි විරුද්ධ පදත්, කෑම බීම, ඇඳුම් පැළඳුම් වැනි යුගල පදත් හොඳින් මතක තබාගන්න!",
      ta: "5 ஆம் தரம் புலமைப்பரிசில் பரீட்சைக்குரிய சிங்கள இலக்கண விதிகள் மற்றும் எதிர்ச்சொற்கள்."
    },
    keyTakeaways: [
      'ඒක වචන උක්තය → ඒක වචන ආඛ්‍යාතය (ළමයා පාඩම් කරයි)',
      'බහු වචන උක්තය → බහු වචන ආඛ්‍යාතය (ළමයි පාඩම් කරති)',
      'සමූහවාචී නාම (රංචුව, සමිතිය) → ඒක වචන ආඛ්‍යාතය (රංචුව දුවයි)',
      'කෘතඥ x කෘතඝ්න | පක්ෂ x විපක්ෂ | අනුකූල x ප්‍රතිකූල'
    ],
    examTips: [
      'ප්‍රශ්න පත්‍රයේ උක්තය අගට "වරු" හෝ "යෝ" එකතු වූ විට (ගුරුවරු, ළමයෝ) ආඛ්‍යාතය බහුවචන විය යුතුය.',
      'සමාන පද ලිවීමේදී තනි වචනයකින් පමණක් පිළිතුරු සපයන්න.'
    ],
    formulasOrRules: [
      'උක්තය (ඒක) + ආඛ්‍යාතය (ඒක) = නිවැරදි වාක්‍යය',
      'උක්තය (බහු) + ආඛ්‍යාතය (බහු) = නිවැරදි වාක්‍යය'
    ],
    conceptQuiz: [
      {
        question: {
          si: "'ගව රංචුව තණකොළ ...........' හිස්තැනට ගැළපෙන නිවැරදි ආඛ්‍යාතය තෝරන්න.",
          en: "Choose the correct predicate for 'ගව රංචුව තණකොළ ...........'",
          ta: "சரியான விடையைத் தெரிவுசெய்க."
        },
        options: {
          si: ['කති', 'කයි', 'කන්නාහුය', 'කෑහ'],
          en: ['කති (Plural)', 'කයි (Singular)', 'කන්නාහුය', 'කෑහ'],
          ta: ['කති', 'කයි', 'කන්නාහුය', 'කෑහ']
        },
        correctIndex: 1,
        explanation: {
          si: "'ගව රංචුව' යනු සමූහවාචී නාම පදයකි. සමූහවාචී නාම පද සඳහා හැමවිටම ඒක වචන ආඛ්‍යාතයක් (කයි) යෙදිය යුතුය.",
          en: "'ගව රංචුව' is a collective noun and takes a singular verb ('කයි').",
          ta: "கூட்டுப் பெயருக்கு ஒருமை வினைச்சொல் வரும்."
        }
      }
    ]
  },
  {
    id: 'aud-g5-maths-tricks',
    subject: 'ප්‍රාථමික ගණිතය (Primary Maths)',
    subjectId: 'scholarship_maths',
    category: 'Grade 5',
    stream: 'Grade 5 Scholarship',
    levelBadge: '5 වසර ශිෂ්‍යත්ව',
    title: {
      en: 'Grade 5 Scholarship Mathematics Short Tricks & Interval Puzzles',
      si: '5 වසර ගණිතය ඉක්මන් කෙටි ක්‍රම (කණු, පරතර සහ අතට අත දීම් ගැටළු)',
      ta: '5 ஆம் தரம் கணித எளிய உத்திகள் & இடைவெளி புதிர்கள்'
    },
    duration: '4:05',
    durationSeconds: 245,
    author: 'කේ. ආර්. වික්‍රමසිංහ ගුරු මහතා',
    authorTitle: 'Senior Primary Mathematics Instructor',
    summaryText: {
      en: "Here are 3 golden math shortcuts for the Grade 5 Scholarship: 1. Straight Line Poles and Intervals: Number of Intervals = Number of Poles - 1. If distance between 2 poles is 4m and there are 10 poles, total length is (10 - 1) × 4m = 36m. 2. Closed Circular Loops: In a closed circle, Number of Poles = Number of Intervals! 3. Handshakes Problem: If n people shake hands with each other exactly once, Total Handshakes = n × (n - 1) ÷ 2. For 6 friends, total handshakes = 6 × 5 ÷ 2 = 15 handshakes. Memorize these to solve paper 1 puzzles in under 30 seconds!",
      si: "ශිෂ්‍යත්ව ගණිත ප්‍රශ්න පත්‍රයේ කාලය ඉතිරි කරගන්නා කෙටි ක්‍රම 3ක්: 1. සරල රේඛාවක කණු සහ පරතර: පරතර ගණන = කණු ගණන - 1. කණු 10ක් අතර පරතරය 4m නම්, මුළු දිග = (10 - 1) x 4m = 36m වේ. 2. සංවෘත වට රවුමක කණු සිටුවීමේදී: කණු ගණන = පරතර ගණන වේ! 3. අතට අත දීමේ ගැටළු: පුද්ගලයින් n දෙනෙකු එකිනෙකාට අතට අත දෙන වාර ගණන = n x (n - 1) ÷ 2 වේ. පුද්ගලයින් 6 දෙනෙකු සඳහා නම්, 6 x 5 ÷ 2 = 15 වතාවකි!",
      ta: "கம்பங்கள் மற்றும் இடைவெளிகள்: நேர்கோட்டில் இடைவெளிகள் = கம்பங்கள் - 1. வட்டப் பாதையில் கம்பங்கள் = இடைவெளிகள். கைகுலுக்கல் = n × (n - 1) ÷ 2."
    },
    keyTakeaways: [
      'සරල රේඛාවක: පරතර ගණන = කණු ගණන - 1',
      'සංවෘත වට රවුමක: පරතර ගණන = කණු ගණන',
      'අතට අත දීම් = n × (n - 1) ÷ 2',
      'ඔරලෝසු කටු: පැය කටුව සහ මිනිත්තු කටුව පැයකදී 1 වරක් එක මත එක පිහිටයි'
    ],
    examTips: [
      'ගැටළුව සරල රේඛාවක්ද වෘත්තාකාර වැටක්ද යන්න ප්‍රවේශමෙන් කියවන්න.',
      'අතට අත දීමේ සූත්‍රයේදී පුද්ගලයින් ගණනින් 1ක් අඩු කර ගුණ කර 2න් බෙදන්න.'
    ],
    formulasOrRules: [
      'Straight line: Intervals = Poles - 1',
      'Closed Loop: Intervals = Poles',
      'Handshakes = n(n - 1) / 2'
    ],
    conceptQuiz: [
      {
        question: {
          si: "මිතුරන් 8 දෙනෙකු සාදයකදී එකිනෙකාට අතට අත දුන්නේ නම් සිදුවූ මුළු අතට අත දීම් ගණන කීයද?",
          en: "If 8 friends shake hands with each other once at a party, how many total handshakes occur?",
          ta: "8 நண்பர்கள் தமக்குள் கைகுலுக்கினால் நிகழும் மொத்த கைகுலுக்கல்கள் எத்தனை?"
        },
        options: {
          si: ['28 වතාවක්', '56 වතාවක්', '16 වතාවක්', '64 වතාවක්'],
          en: ['28 times', '56 times', '16 times', '64 times'],
          ta: ['28', '56', '16', '64']
        },
        correctIndex: 0,
        explanation: {
          si: "සූත්‍රය: n x (n - 1) ÷ 2 = 8 x 7 ÷ 2 = 56 ÷ 2 = 28 වතාවකි.",
          en: "Formula: 8 × 7 ÷ 2 = 28 handshakes.",
          ta: "சூத்திரம்: 8 × 7 ÷ 2 = 28."
        }
      }
    ]
  },
  {
    id: 'aud-g5-environment',
    subject: 'පරිසරය හා විද්‍යාව (Environmental Studies)',
    subjectId: 'scholarship_environment',
    category: 'Grade 5',
    stream: 'Grade 5 Scholarship',
    levelBadge: '5 වසර ශිෂ්‍යත්ව',
    title: {
      en: 'Sri Lanka National Symbols, Kings & Natural Environment',
      si: 'අපේ පරිසරය, ජාතික සංකේත සහ ඓතිහාසික රජවරුන්ගේ වික්‍රම',
      ta: 'இலங்கையின் தேசிய சின்னங்கள், மன்னர்கள் & சுற்றாடல்'
    },
    duration: '3:45',
    durationSeconds: 225,
    author: 'ආචාර්ය ධම්මික හේරත්',
    authorTitle: 'National Curriculum Developer',
    summaryText: {
      en: "Key facts tested in Grade 5 Environmental Studies: 1. Sri Lanka National Symbols: National Tree is Ceylon Ironwood (නා ගස), National Flower is the Nil Manel (නිල් මානෙල්), National Bird is the Ceylon Junglefowl (ශ්‍රී ලංකා වලි කුකුළා), and National Sport is Volleyball. 2. Great Kings: King Dutugemunu built Ruwanwelisaya and Mirisawetiya. King Dhatusena built the majestic Kala Wewa and the Yoda Ela canal. King Parakramabahu I built Parakrama Samudraya. King Kasyapa built the world wonder Sigiriya rock fortress. 3. Plant Adaptations: Mangroves (කඩොලාන) have breathing roots (ශ්වසන මුල්/වායුධර මුල්) and stilt roots (කයිරු මුල්) to survive in saline muddy soil.",
      si: "5 වසර පරිසරය විභාග ප්‍රශ්න සඳහා අත්‍යවශ්‍ය කරුණු: 1. ජාතික සංකේත: ජාතික වෘක්ෂය නා ගස, ජාතික පුෂ්පය නිල් මානෙල්, ජාතික පක්ෂියා වලි කුකුළා, ජාතික ක්‍රීඩාව වොලිබෝල් වේ. 2. ශ්‍රේෂ්ඨ රජවරු: දුටුගැමුණු රජතුමා රුවන්වැලිසෑය සහ මිරිසවැටිය කරවීය. ධාතුසේන රජතුමා කලා වැව සහ ජය ගඟ (යෝධ ඇළ) නිර්මාණය කළේය. පළමුවන පරාක්‍රමබාහු රජු පරාක්‍රම සමුද්‍රයද, කාශ්‍යප රජු සීගිරිය බලකොටුවද කරවූහ. 3. කඩොලාන ශාක ලවණ අධික මඩ සහිත පරිසරයේ ජීවත් වීමට වායුධර මුල් (ශ්වසන මුල්) සහ කයිරු මුල් දරයි.",
      ta: "தேசிய மரம்: நாக மரம், தேசிய மலர்: நீலோற்பலம், தேசிய பறவை: காட்டுக்கோழி. தாதுசேன மன்னன் கலா வாவி & யோத எல நிர்மாணித்தார்."
    },
    keyTakeaways: [
      'ජාතික වෘක්ෂය: නා ගස | ජාතික පුෂ්පය: නිල් මානෙල්',
      'ජාතික පක්ෂියා: වලි කුකුළා | ජාතික ක්‍රීඩාව: වොලිබෝල්',
      'කලා වැව & යෝධ ඇළ: ධාතුසේන රජතුමා',
      'පරාක්‍රම සමුද්‍රය: I වන පරාක්‍රමබාහු රජතුමා',
      'සීගිරිය පර්වත බලකොටුව: කාශ්‍යප රජතුමා'
    ],
    examTips: [
      'රජවරුන් සහ ඔවුන් කළ නිර්මාණ (වැව්, සෑ) පැහැදිලිව සටහන් පොතක ලියා පාඩම් කරන්න.',
      'කඩොලාන ශාක වල බීජ ගසේ තිබියදීම ප්‍රරෝහණය වීම (ජලාබුජතාව) විභාගයේ නිතර අසන ප්‍රශ්නයකි.'
    ],
    conceptQuiz: [
      {
        question: {
          si: "කලා වැවේ සිට තිසා වැව දක්වා ජලය රැගෙන යන 'ජය ගඟ' (යෝධ ඇළ) කරවූ රජතුමා කවුද?",
          en: "Which king constructed the Yoda Ela (Jaya Ganga) connecting Kala Wewa to Tissa Wewa?",
          ta: "கலா வாவியிலிருந்து திசா வாவிக்கு நீரைக் கொண்டுசெல்லும் யோத எலையை நிர்மாணித்த மன்னன் யார்?"
        },
        options: {
          si: ['ධාතුසේන රජතුමා', 'දුටුගැමුණු රජතුමා', 'පරාක්‍රමබාහු රජතුමා', 'මහසෙන් රජතුමා'],
          en: ['King Dhatusena', 'King Dutugemunu', 'King Parakramabahu', 'King Mahasen'],
          ta: ['தாதுசேன மன்னன்', 'துட்டகைமுணு', 'பராக்கிரமபாகு', 'மகாசேனன்']
        },
        correctIndex: 0,
        explanation: {
          si: "කලා වැව සහ යෝධ ඇළ (සැතපුමකට අඟලක බැස්ම සහිත) නිර්මාණය කළේ ධාතුසේන රජතුමා විසිනි.",
          en: "King Dhatusena built Kala Wewa and the 54-mile long Yoda Ela canal.",
          ta: "தாதுசேன மன்னன் கலா வாவியையும் யோத எலையையும் அமைத்தார்."
        }
      }
    ]
  },

  // ==========================================
  // G.C.E. A/L STREAMS (PHYSICS, BIO, MATHS, COMMERCE, MEDIA)
  // ==========================================
  {
    id: 'aud-al-physics-thermo',
    subject: 'Physics (A/L)',
    subjectId: 'al_physics',
    category: 'A/L',
    stream: 'Physical Science (Maths / Bio)',
    levelBadge: 'A/L Combined Science',
    title: {
      en: 'Thermodynamics & Heat Engines in 4 Minutes',
      si: 'තාප ගති විද්‍යාව සහ තාප එන්ජින් මිනිත්තු 4කින්',
      ta: 'வெப்ப இயக்கவியல் மற்றும் வெப்ப இயந்திரங்கள் 4 நிமிடங்களில்'
    },
    duration: '4:15',
    durationSeconds: 255,
    author: 'Eng. Chathura Weerasinghe',
    authorTitle: 'Senior A/L Physics Lecturer (B.Sc. Eng)',
    summaryText: {
      en: "The First Law of Thermodynamics is conservation of energy: ΔQ = ΔU + ΔW. For an isothermal process (constant temperature), ΔU is zero, so heat supplied equals work done. For an adiabatic process (no heat exchange), ΔQ is zero, so work done equals -ΔU. In Carnot heat engine cycles, maximum theoretical efficiency η = 1 - (Tc / Th). Remember to always convert Celsius to Kelvin when calculating thermal efficiencies in A/L Paper 2 Part B!",
      si: "තාප ගති විද්‍යාවේ පළමු නියමය ශක්ති සංස්ථිති නියමයයි: ΔQ = ΔU + ΔW. සමඋෂ්ණත්ව ක්‍රියාවලියකදී (නියත උෂ්ණත්වය), අභ්‍යන්තර ශක්ති වෙනස ΔU ශුන්‍ය වන බැවින් සපයන තාපය කළ කාර්යයට සමාන වේ. තාප හුවමාරුවක් සිදුනොවන ස්ථිරතාපී ක්‍රියාවලියකදී ΔQ = 0 වන අතර, ΔW = -ΔU වේ. කානොට් තාප එන්ජිමක උපරිම කාර්යක්ෂමතාවය η = 1 - (Tc / Th) වේ. උෂ්ණත්ව ගණනය කිරීම් වලදී සෙල්සියස් අගයන් කෙල්වින් වලට හැරවීම අනිවාර්ය වේ!",
      ta: "வெப்ப இயக்கவியலின் முதல் விதி ஆற்றல் காப்பு விதியாகும்: ΔQ = ΔU + ΔW. சமவெப்பநிலை செயல்முறையில் ΔU பூஜ்ஜியம் ஆகும். வெப்பப் பரிமாற்றமில்லா செயல்முறையில் ΔQ பூஜ்ஜியமாகும். கார்னோ இயந்திரத்தின் உச்ச வினைத்திறன் η = 1 - (Tc / Th) ஆகும்."
    },
    keyTakeaways: [
      'ΔQ = ΔU + ΔW (First Law of Thermodynamics)',
      'Isothermal: ΔT = 0 ⇒ ΔU = 0 ⇒ ΔQ = ΔW',
      'Adiabatic: ΔQ = 0 ⇒ ΔW = -ΔU (PV^γ = Constant)',
      'Carnot Efficiency η = 1 - (T_cold / T_hot) [T in Kelvin]'
    ],
    examTips: [
      'PV ප්‍රස්ථාරවල චක්‍රීය ක්‍රියාවලියක සංවෘත වර්ගඵලය මඟින් එක් චක්‍රයකදී කරන ලද ශුද්ධ කාර්යය නිරූපණය වේ.',
      'කානොට් කාර්යක්ෂමතාවය ගණනය කිරීමේදී උෂ්ණත්වය කෙල්වින් (K = °C + 273) වලින් පමණක් ආදේශ කරන්න.'
    ],
    formulasOrRules: [
      'ΔQ = ΔU + ΔW',
      'ΔU = nCvΔT',
      'η = 1 - (Tc / Th) = (Qh - Qc) / Qh'
    ],
    conceptQuiz: [
      {
        question: {
          si: "වායුවක් ස්ථිරතාපීව (Adiabatic) ප්‍රසාරණය වීමේදී එහි උෂ්ණත්වයට කුමක් සිදුවේද?",
          en: "During an adiabatic expansion of an ideal gas, what happens to its temperature?",
          ta: "வெப்பப் பரிமாற்றமில்லா விரிவடைதலில் வெப்பநிலைக்கு என்ன நிகழும்?"
        },
        options: {
          si: ['උෂ්ණත්වය අඩු වේ (Cooling)', 'උෂ්ණත්වය වැඩි වේ (Heating)', 'උෂ්ණත්වය නියතව පවතී', 'අනාවැකි කිව නොහැක'],
          en: ['Temperature decreases', 'Temperature increases', 'Remains constant', 'Cannot predict'],
          ta: ['குறையும்', 'அதிகரிக்கும்', 'மாறாது', 'கூற முடியாது']
        },
        correctIndex: 0,
        explanation: {
          si: "ස්ථිරතාපී ප්‍රසාරණයේදී ΔQ = 0 වේ. එබැවින් වායුව කාර්යය කරන්නේ තමාගේ අභ්‍යන්තර ශක්තිය වැය කරමිනි (ΔW = -ΔU). අභ්‍යන්තර ශක්තිය අඩුවන නිසා උෂ්ණත්වය පහත බසී.",
          en: "Since ΔQ = 0, work is done at the expense of internal energy (ΔW = -ΔU), lowering the temperature.",
          ta: "அக ஆற்றல் குறைவதால் வெப்பநிலை குறையும்."
        }
      }
    ]
  },
  {
    id: 'aud-al-bio-nervous',
    subject: 'Biology (A/L)',
    subjectId: 'al_biology',
    category: 'A/L',
    stream: 'Biological Science',
    levelBadge: 'A/L Bio Stream',
    title: {
      en: 'Human Nervous System & Action Potential Transmission',
      si: 'ස්නායු පද්ධතිය සහ ක්‍රියා විභව සම්ප්‍රේෂණය',
      ta: 'மனித நரம்பு மண்டலம் & தொழிற்பாட்டு அழுத்த கடத்தல்'
    },
    duration: '3:50',
    durationSeconds: 230,
    author: 'Dr. Senanayake',
    authorTitle: 'MBBS (Col), Senior Bio Master',
    summaryText: {
      en: "Resting membrane potential is maintained at approximately -70mV by the Na+/K+ ATPase pump which actively pumps 3 Na+ out for every 2 K+ inside. When threshold stimulus (-55mV) is reached, voltage-gated Na+ channels open rapidly causing Depolarization up to +30mV. Then, Na+ channels inactivate and voltage-gated K+ channels open, causing Repolarization. In myelinated axons, action potentials jump across nodes of Ranvier via Saltatory Conduction.",
      si: "විවේක පටල විභවය ආසන්න වශයෙන් -70mV මට්ටමක පවත්වා ගන්නේ Na+/K+ පොම්පය මගිනි. එය Na+ අයන 3ක් පිටතටත් K+ අයන 2ක් ඇතුළටත් පොම්ප කරයි. උත්තේජනයක් හේතුවෙන් සීමක විභවය (-55mV) ඉක්මවූ විට, Na+ නාල විවෘත වී අධිධ්‍රැවීකරණය වී +30mV දක්වා ඉහළ යයි. ඉන්පසු K+ නාල විවෘත වී පුනර්ධ්‍රැවීකරණය සිදුවේ. මයලින් කොපුව සහිත ස්නායුවල ක්‍රියා විභවය රැන්වියර් ගැට ඔස්සේ පිමි ආකාරයෙන් ගමන් කරයි (Saltatory conduction).",
      ta: "ஓய்வு நிலை அழுத்தம் -70mV ஆகும். Na+/K+ பம்ப் மூலம் இது பராமரிக்கப்படுகிறது. சோடியம் உட்சென்று +30mV வரை உயர்வது Depolarization எனப்படும்."
    },
    keyTakeaways: [
      'Resting potential = -70 mV (3 Na+ out / 2 K+ in)',
      'Threshold potential = -55 mV',
      'Depolarization: Voltage-gated Na+ channels open (+30 mV)',
      'Saltatory conduction across Nodes of Ranvier increases speed 50x'
    ],
    examTips: [
      'සියල්ල හෝ නැත න්‍යාය (All-or-none law) අනුව ක්‍රියා විභවයේ විශාලත්වය උත්තේජනයේ ප්‍රබලතාවය මත රඳා නොපවතී.',
      'මයලින් කොපුව නිසා ස්නායු ආවේග සම්ප්‍රේෂණ වේගය 100m/s ඉක්මවයි.'
    ],
    conceptQuiz: [
      {
        question: {
          si: "ස්නායු සෛල පටලයේ විවේක විභවය (-70mV) පවත්වා ගැනීමට Na+/K+ පොම්පය මගින් අයන ප්‍රවාහනය කරන්නේ කුමන අනුපාතයකින්ද?",
          en: "What is the ion exchange ratio of the Na+/K+ ATPase pump in maintaining resting potential?",
          ta: "Na+/K+ பம்பின் அயன் விகிதம் என்ன?"
        },
        options: {
          si: ['3 Na+ පිටතට සහ 2 K+ ඇතුළට', '2 Na+ පිටතට සහ 3 K+ ඇතුළට', '3 Na+ ඇතුළට සහ 2 K+ පිටතට', '1 Na+ පිටතට සහ 1 K+ ඇතුළට'],
          en: ['3 Na+ out, 2 K+ in', '2 Na+ out, 3 K+ in', '3 Na+ in, 2 K+ out', '1 Na+ out, 1 K+ in'],
          ta: ['3 Na+ வெளியே, 2 K+ உள்ளே', '2 Na+ வெளியே, 3 K+ உள்ளே', '3 Na+ உள்ளே, 2 K+ வெளியே', '1:1']
        },
        correctIndex: 0,
        explanation: {
          si: "Na+/K+ පොම්පය ATP ශක්තිය වැය කර Na+ අයන 3ක් සෛලයෙන් පිටතටත් K+ අයන 2ක් ඇතුළටත් පොම්ප කරයි.",
          en: "The pump actively moves 3 Na+ out for every 2 K+ inside.",
          ta: "3 Na+ வெளியே, 2 K+ உள்ளே."
        }
      }
    ]
  },
  {
    id: 'aud-al-maths-trig',
    subject: 'Combined Mathematics (A/L)',
    subjectId: 'al_combined_maths',
    category: 'A/L',
    stream: 'Physical Science (Maths)',
    levelBadge: 'A/L Combined Maths',
    title: {
      en: 'Mastering Trigonometric Equations & General Solutions',
      si: 'ත්‍රිකෝණමිතික සමීකරණ සහ සර්වසාම්‍ය කෙටි සාරාංශය',
      ta: 'முக்கோணவியல் சமன்பாடுகள் & முற்றொருமைகள்'
    },
    duration: '5:10',
    durationSeconds: 310,
    author: 'Prof. K. Perera',
    authorTitle: 'Department of Mathematics, University of Moratuwa',
    summaryText: {
      en: "Compound angles are the root of almost all A/L trigonometry: sin(A ± B) = sinA cosB ± cosA sinB, cos(A ± B) = cosA cosB ∓ sinA sinB. For general solutions: sin θ = sin α implies θ = nπ + (-1)^n α. For cos θ = cos α, θ = 2nπ ± α. When solving tan θ = tan α, general solution is simply θ = nπ + α. Keep this memorized for immediate Part B marks!",
      si: "ත්‍රිකෝණමිතික මූලික සූත්‍ර: sin(A ± B) = sinA cosB ± cosA sinB, cos(A ± B) = cosA cosB ∓ sinA sinB. පොදු විසඳුම්: sin θ = sin α නම්, θ = nπ + (-1)^n α වේ. cos θ = cos α නම්, θ = 2nπ ± α වේ. tan θ = tan α නම් θ = nπ + α වේ. උසස් පෙළ දෙවන ප්‍රශ්න පත්‍රයේ මුල් ලකුණු 10 ලබා ගැනීමට මෙම පොදු විසඳුම් අත්‍යවශ්‍ය වේ!",
      ta: "sin(A ± B) = sinA cosB ± cosA sinB. பொதுத் தீர்வுகள்: sin θ = sin α எனின் θ = nπ + (-1)^n α. cos θ = cos α எனின் θ = 2nπ ± α."
    },
    keyTakeaways: [
      'sin θ = sin α ⇒ θ = nπ + (-1)^n α (n ∈ ℤ)',
      'cos θ = cos α ⇒ θ = 2nπ ± α (n ∈ ℤ)',
      'tan θ = tan α ⇒ θ = nπ + α (n ∈ ℤ)',
      'sin²A + cos²A = 1 | 1 + tan²A = sec²A'
    ],
    examTips: [
      'පොදු විසඳුම් ලිවීමේදී n ∈ ℤ (n යනු නිඛිලයකි) යන්න අනිවාර්යයෙන්ම ලියන්න. නැතහොත් ලකුණු 1ක් අහිමි වේ.',
      'sin2A = 2sinAcosA සහ cos2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A නිතර භාවිතා වේ.'
    ],
    formulasOrRules: [
      'sin θ = sin α ⇒ θ = nπ + (-1)^n α',
      'cos θ = cos α ⇒ θ = 2nπ ± α',
      'tan θ = tan α ⇒ θ = nπ + α'
    ]
  },
  {
    id: 'aud-al-econ-macro',
    subject: 'Economics (A/L)',
    subjectId: 'al_economics',
    category: 'A/L',
    stream: 'Commerce Stream',
    levelBadge: 'A/L Commerce',
    title: {
      en: 'Macroeconomic Fiscal Policy, Inflation & Central Bank Tools',
      si: 'සාර්ව ආර්ථික රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය, උද්ධමනය සහ මහ බැංකු උපක්‍රම',
      ta: 'பேரினப் பொருளாதார நிதிக் கொள்கை & பணவீக்கம்'
    },
    duration: '4:30',
    durationSeconds: 270,
    author: 'ආචාර්ය සුනිල් අබේරත්න',
    authorTitle: 'Senior Central Bank Consultant & A/L Author',
    summaryText: {
      en: "Fiscal policy (රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය) is conducted by the Ministry of Finance through government expenditure (G) and taxation (T). When inflation is high, the government uses contractionary fiscal policy (reducing G, increasing T). Monetary policy (මුදල් ප්‍රතිපත්තිය) is conducted by the Central Bank of Sri Lanka using Policy Interest Rates (SDFR and SLFR) and Statutory Reserve Ratio (SRR). Increasing policy interest rates reduces commercial bank lending and cools down aggregate demand.",
      si: "රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය මුදල් අමාත්‍යාංශය මගින් රජයේ වියදම් (G) සහ බදු ආදායම් (T) උපයෝගී කරගෙන ක්‍රියාත්මක කරයි. උද්ධමනය පාලනයට සංකෝචන මූල්‍ය ප්‍රතිපත්තියක් (රජයේ වියදම් අඩු කිරීම සහ බදු වැඩි කිරීම) යොදා ගනී. මුදල් ප්‍රතිපත්තිය ශ්‍රී ලංකා මහ බැංකුව විසින් ප්‍රතිපත්ති පොලී අනුපාතික (SDFR & SLFR) සහ ව්‍යවස්ථාපිත සංචිත අනුපාතිකය (SRR) හරහා ක්‍රියාත්මක කර මුදල් සැපයුම පාලනය කරයි.",
      ta: "நிதிக் கொள்கை அரசாங்க செலவுகள் மற்றும் வரிகளைப் பயன்படுத்துகிறது. நாணயக் கொள்கையை இலங்கை மத்திய வங்கி வட்டி விகிதங்கள் மூலம் கட்டுப்படுத்துகிறது."
    },
    keyTakeaways: [
      'රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය: මුදල් අමාත්‍යාංශය (රජයේ වියදම් G & බදු T)',
      'මුදල් ප්‍රතිපත්තිය: ශ්‍රී ලංකා මහ බැංකුව (SDFR, SLFR & SRR)',
      'සංකෝචන ප්‍රතිපත්තිය: උද්ධමනය පාලනයට (පොලී අනුපාත ඉහළ දැමීම)',
      'සමස්ත ඉල්ලුම AD = C + I + G + (X - M)'
    ],
    examTips: [
      'රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය සහ මුදල් ප්‍රතිපත්තිය පටලවා නොගන්න.',
      'AD = C + I + G + (X - M) සමීකරණයේ එක් එක් සංරචකය මත බදු සහ පොලී අනුපාත බලපාන ආකාරය ප්‍රස්ථාර සහිතව විස්තර කරන්න.'
    ]
  },

  // ==========================================
  // G.C.E. O/L STREAMS (SCIENCE, MATHS, HISTORY, ICT)
  // ==========================================
  {
    id: 'aud-ol-history-irrigation',
    subject: 'History (O/L)',
    subjectId: 'ol_history',
    category: 'O/L',
    stream: 'O/L Core Subjects',
    levelBadge: 'O/L History',
    title: {
      en: 'Sri Lankan Hydraulic Civilization & King Parakramabahu',
      si: 'ශ්‍රී ලංකාවේ වාරි ශිෂ්ටාචාරය සහ මහා පරාක්‍රමබාහු රජු',
      ta: 'இலங்கையின் நீர்ப்பாசன நாகரிகம் மற்றும் பராக்கிரமபாகு மன்னன்'
    },
    duration: '3:30',
    durationSeconds: 210,
    author: 'අනුර වික්‍රමසිංහ ගුරුතුමා',
    authorTitle: 'National History Educator',
    summaryText: {
      en: "The ancient hydraulic civilization of Sri Lanka is defined by the Biso Kotuwa (cistern sluice) which neutralized high water pressure without damaging earthen dam walls. King Parakramabahu I declared that 'Not even a single drop of rain water that falls on this island should flow into the sea without being made useful to man', constructing the magnificent Parakrama Samudraya which united five large reservoirs.",
      si: "පුරාණ ලක්දිව වාරි ශිෂ්ටාචාරයේ මහා තාක්ෂණික විප්ලවය වූයේ බිසෝකොටුවයි. ඒ මගින් ජල පීඩනය පාලනය කර වේලි ආරක්ෂා විය. 'අහසින් වැටෙන එකදු දිය බිඳක් හෝ මිනිසාගේ ප්‍රයෝජනයට නොගෙන මුහුදට ගලා යාමට ඉඩ නොදිය යුතුය' යැයි ප්‍රකාශ කළ පළමුවන පරාක්‍රමබාහු රජු විශාල වැව් පහක් එකතු කර පරාක්‍රම සමුද්‍රය නිර්මාණය කළේය.",
      ta: "பண்டைய நீர்ப்பாசனத்தின் உச்சம் பிசோகொட்டுவ ஆகும். மகா பராக்கிரமபாகு மன்னர் பராக்கிரம சமுத்திரத்தைக் கட்டினார்."
    },
    keyTakeaways: [
      'බිසෝකොටුව: අධික ජල පීඩනය පාලනය කරන ඉංජිනේරු නිර්මාණය',
      'පළමුවන පරාක්‍රමබාහු රජු: පරාක්‍රම සමුද්‍රය (වැව් 5ක එකතුවකි)',
      'ධාතුසේන රජු: කලා වැව සහ සැතපුමකට අඟලක බැස්ම ඇති යෝධ ඇළ',
      'මහසෙන් රජු: මින්නේරිය වැව ඇතුළු මහා වැව් 16ක් කරවූ මිණිහොඬු දෙවියෝ'
    ],
    examTips: [
      'සාමාන්‍ය පෙළ 2 වන පත්‍රයේ වාරි තාක්ෂණය පිළිබඳ ලකුණු 12ක ප්‍රශ්නයට බිසෝකොටුව, සොරොව්ව, රළපනාව සහ පිටවාන පැහැදිලි කරන්න.'
    ]
  },
  {
    id: 'aud-ol-science-reactions',
    subject: 'Science (O/L)',
    subjectId: 'ol_science',
    category: 'O/L',
    stream: 'O/L Core Subjects',
    levelBadge: 'O/L Science',
    title: {
      en: 'Chemical Reactions, Periodic Table & Activity Series',
      si: 'රසායනික ප්‍රතික්‍රියා, ආවර්තිතා වගුව සහ සක්‍රියතා ශ්‍රේණිය',
      ta: 'இரசாயனத் தாக்கங்கள் & ஆவர்த்தன அட்டவணை'
    },
    duration: '4:10',
    durationSeconds: 250,
    author: 'විද්‍යාපති සුදර්ශන ගුණවර්ධන',
    authorTitle: 'National Science Master',
    summaryText: {
      en: "Essential O/L Science rules: The Reactivity Series of metals from most reactive to least: K > Na > Ca > Mg > Al > Zn > Fe > Pb > (H) > Cu > Ag > Au. Metals above hydrogen react with dilute acids to liberate Hydrogen gas (H2). When balancing chemical equations, conserve atoms on both reactant and product sides. Remember: Oxidation is loss of electrons (OIL), Reduction is gain of electrons (RIG)!",
      si: "සාමාන්‍ය පෙළ විද්‍යාවට අත්‍යවශ්‍ය සක්‍රියතා ශ්‍රේණිය: K > Na > Ca > Mg > Al > Zn > Fe > Pb > (H) > Cu > Ag > Au. හයිඩ්‍රජන්ට ඉහළින් ඇති ලෝහ තනුක අම්ල සමඟ ප්‍රතික්‍රියා කර හයිඩ්‍රජන් වායුව (H2) පිටකරයි. ඔක්සිකරණය යනු ඉලෙක්ට්‍රෝන පිටකිරීමයි (Oxidation is Loss). ඔක්සිහරණය යනු ඉලෙක්ට්‍රෝන ලබාගැනීමයි (Reduction is Gain). ආවර්තයක වමේ සිට දකුණට යන විට විද්‍යුත් සෘණතාව වැඩිවේ.",
      ta: "உலோகங்களின் தாக்கத் தொடர்: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au. ஒட்சியேற்றம் என்பது இலத்திரன் இழப்பு."
    },
    keyTakeaways: [
      'සක්‍රියතා ශ්‍රේණිය: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu',
      'ලෝහය + අම්ලය → ලවණය + H₂ වායුව (පොප් ශබ්දය සහිතව දැල්වේ)',
      'ඔක්සිකරණය = ඉලෙක්ට්‍රෝන පිටකිරීම | ඔක්සිහරණය = ඉලෙක්ට්‍රෝන ලබාගැනීම',
      'CO₂ වායුව හඳුනාගැනීම: පැහැදිලි හුණු දියර කිරි පැහැ ගැන්වේ'
    ],
    examTips: [
      'වායු හඳුනාගැනීමේ පරීක්ෂණ (H2, O2, CO2, Cl2) ප්‍රශ්න පත්‍රයේ නිතරම අසනු ලැබේ.'
    ]
  },
  {
    id: 'aud-ol-ict-logic',
    subject: 'Information & Comm. Technology (O/L)',
    subjectId: 'ol_ict',
    category: 'O/L',
    stream: 'O/L Core Subjects',
    levelBadge: 'O/L ICT',
    title: {
      en: 'Logic Gates (AND, OR, NOT, XOR) & Truth Tables',
      si: 'තාර්කික ද්වාර (Logic Gates) සහ සත්‍යතා වගු විනාඩි 3කින්',
      ta: 'தர்க்க வாயில்கள் & உண்மை அட்டவணைகள்'
    },
    duration: '3:15',
    durationSeconds: 195,
    author: 'Eng. Nishantha Fernando',
    authorTitle: 'Senior ICT Lecturer',
    summaryText: {
      en: "The four primary logic gates in O/L ICT: 1. AND Gate (Y = A . B): Output is 1 only if BOTH inputs are 1. 2. OR Gate (Y = A + B): Output is 1 if AT LEAST ONE input is 1. 3. NOT Gate (Y = A'): Inverts input (0 becomes 1, 1 becomes 0). 4. XOR Gate (Exclusive OR): Output is 1 only when inputs are DIFFERENT (0,1 or 1,0). Master these combinations to secure 100% on the digital logic question!",
      si: "සාමාන්‍ය පෙළ ICT තාර්කික ද්වාර 4: 1. AND ද්වාරය (Y = A . B): ආදාන දෙකම 1 වූ විට පමණක් ප්‍රතිදානය 1 වේ. 2. OR ද්වාරය (Y = A + B): අඩුම තරමේ එක් ආදානයක් හෝ 1 වූ විට ප්‍රතිදානය 1 වේ. 3. NOT ද්වාරය (Y = A'): ආදානය ප්‍රතිවිරුද්ධ කරයි (0 නම් 1, 1 නම් 0). 4. XOR ද්වාරය: ආදාන දෙක එකිනෙකට වෙනස් වූ විට පමණක් (0,1 හෝ 1,0) ප්‍රතිදානය 1 වේ.",
      ta: "AND வாயில்: இரு உள்ளீடுகளும் 1 எனின் 1. OR வாயில்: ஏதேனும் ஒரு உள்ளீடு 1 எனின் 1. NOT வாயில்: தலைகீழ்."
    },
    keyTakeaways: [
      'AND Gate: Y = A · B (Both inputs 1 ⇒ 1)',
      'OR Gate: Y = A + B (Any input 1 ⇒ 1)',
      'NOT Gate: Y = Ā (Inverter)',
      'XOR Gate: Y = A ⊕ B (Different inputs ⇒ 1)'
    ],
    examTips: [
      'සත්‍යතා වගුවක් අඳින විට ආදාන 2ක් සඳහා අවස්ථා 4ක් (00, 01, 10, 11) පිළිවෙලින් ලියන්න.'
    ]
  }
];

export default function AudioSummariesPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  // Role detection
  const isGrade5 = profile?.grade === 5 || profile?.level === 'SCHOLARSHIP' || profile?.stream === 'Grade 5 Scholarship' || !!profile?.isKidMode;

  // Active view: 'audio_player' or 'short_notes_grid'
  const [activeTab, setActiveTab] = useState<'audio' | 'notes'>('audio');

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Grade 5' | 'O/L' | 'A/L'>(() => {
    if (isGrade5) return 'Grade 5';
    if (profile?.stream && profile?.stream.includes('O/L')) return 'O/L';
    return 'ALL';
  });

  const [activeSummaryId, setActiveSummaryId] = useState<string>(() => {
    if (isGrade5) return 'aud-g5-sinhala-grammar';
    return 'aud-al-physics-thermo';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentProgressSeconds, setCurrentProgressSeconds] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Concept quiz modal / inline state
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScoreAwarded, setQuizScoreAwarded] = useState(false);

  const activeSummary = COMPREHENSIVE_AUDIO_SUMMARIES.find((a) => a.id === activeSummaryId) || COMPREHENSIVE_AUDIO_SUMMARIES[0];
  const activeText = activeSummary.summaryText[language] || activeSummary.summaryText.si || activeSummary.summaryText.en;

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
      utterance.pitch = isGrade5 ? 1.15 : 1.0; // Cheerier pitch for Grade 5

      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentProgressSeconds(activeSummary.durationSeconds);
        addXP(40);
        try {
          soundFX.playCorrect();
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
  }, [isPlaying, activeSummaryId, playbackSpeed, language, isGrade5]);

  const handleTogglePlay = (summaryId?: string) => {
    if (summaryId && summaryId !== activeSummaryId) {
      setActiveSummaryId(summaryId);
      setCurrentProgressSeconds(0);
      setIsPlaying(true);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
      setQuizScoreAwarded(false);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProgressSeconds(Number(e.target.value));
  };

  const handleSkip = (seconds: number) => {
    setCurrentProgressSeconds((prev) => {
      const next = Math.max(0, Math.min(activeSummary.durationSeconds, prev + seconds));
      return next;
    });
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handlePrintShortNote = (summary: AudioSummary) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const langText = summary.summaryText[language] || summary.summaryText.si || summary.summaryText.en;
    const langTitle = summary.title[language] || summary.title.si || summary.title.en;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SipArana Short Revision Note - ${langTitle}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
          .badge { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
          h1 { color: #0f172a; margin-top: 10px; font-size: 22px; }
          .summary { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; line-height: 1.6; font-size: 14px; }
          .section { margin-top: 20px; }
          .section h3 { font-size: 15px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          ul { padding-left: 20px; line-height: 1.6; font-size: 13px; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">SipArana LK High-Yield Revision Note • ${summary.levelBadge}</span>
          <h1>${langTitle}</h1>
          <p style="margin: 4px 0; font-size: 12px; color: #64748b;">Subject: ${summary.subject} | Author: ${summary.author} (${summary.authorTitle})</p>
        </div>
        <div class="summary">
          <strong>Theory Summary:</strong><br/>
          ${langText}
        </div>
        <div class="section">
          <h3>Key Exam Takeaways & Formulas:</h3>
          <ul>
            ${summary.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        <div class="section">
          <h3>Exam Strategy & Tips:</h3>
          <ul>
            ${summary.examTips.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        <div class="footer">
          SipArana LK Smart Education Platform • National Curriculum Revision Hub • Printed by ${profile?.name || 'Student'}
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAnswerQuiz = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !activeSummary.conceptQuiz || activeSummary.conceptQuiz.length === 0) return;
    setQuizSubmitted(true);
    const isCorrect = selectedAnswer === activeSummary.conceptQuiz[0].correctIndex;
    if (isCorrect && !quizScoreAwarded) {
      addXP(25);
      setQuizScoreAwarded(true);
      try {
        soundFX.playCorrect();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {
        // safe
      }
    }
  };

  const filteredSummaries = COMPREHENSIVE_AUDIO_SUMMARIES.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div id="audio-notes-summaries-page" className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black backdrop-blur-sm">
            <Headphones className="w-3.5 h-3.5" />
            <span>SipArana Audio & Short Revision Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            {language === 'si'
              ? 'ශ්‍රව්‍ය සාරාංශ (Voice Notes) & විභාග කෙටි සටහන්'
              : language === 'ta'
              ? 'குரல் சுருக்கங்கள் & சுருக்கக் குறிப்புகள்'
              : 'High-Yield Audio Summaries & Quick Revision Flashcards'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            {language === 'si'
              ? 'ගමන් බිමන් වලදී හෝ විවේකීව සිටින විට 1.25x වේගයෙන් සවන් දී මනසට ධාරණය කරගත හැකි ශ්‍රව්‍ය සටහන් සහ A/L, O/L, ශිෂ්‍යත්ව කෙටි සටහන් පත්‍රිකා.'
              : language === 'ta'
              ? 'பயணம் செய்யும் போதோ அல்லது ஓய்வெடுக்கும் போதோ கேட்டுப் படிப்பதற்கான குரல் சுருக்கங்கள் மற்றும் பரீட்சைக் குறிப்புகள்.'
              : 'Effortless audio learning on the go with speed toggles (1x, 1.25x, 1.5x) and 1-click printable high-yield theory flashcards.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>NIE & University Lecturer Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{filteredSummaries.length} Audio Tracks Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Zap className="w-4 h-4" />
              <span>+40 XP per Completed Lesson</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Controls & Navigation: Mode Tabs + Grade Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Switch between Audio Player Mode and Short Notes Grid Mode */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>ශ්‍රව්‍ය ආවර්ජනය (Audio Player)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>කෙටි සටහන් කාඩ්පත් (Short Notes)</span>
          </button>
        </div>

        {/* Grade Category Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full sm:w-auto justify-end overflow-x-auto">
          {(['ALL', 'Grade 5', 'O/L', 'A/L'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'සියලු ශ්‍රේණි (All)'
                : cat === 'Grade 5'
                ? '5 වසර ශිෂ්‍යත්ව'
                : cat === 'O/L'
                ? 'සාමාන්‍ය පෙළ (O/L)'
                : 'උසස් පෙළ (A/L)'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mascot Companion Notice */}
      <KaviMascot
        contextPage="audio"
        customMessage={
          isGrade5
            ? '🦉 ආයුබෝවන් යාලුවේ! 5 වසර ශිෂ්‍යත්ව විභාගයට අවශ්‍ය සිංහල, ගණිත කෙටි ක්‍රම සහ පරිසරය පාඩම් වලට හඬින් සවන් දෙන්න. නින්දට පෙර අසන විට සියල්ල මතකයේ රැඳේ!'
            : language === 'si'
            ? '🦉 කවි උපදෙස: පාඩම් කරලා මහන්සි වෙලාවට ඇස් දෙක පියාගෙන මේ Audio Summaries වලට 1.25x වේගයෙන් සවන් දෙන්න. සවන් දීමෙන් පසු පහළ ඇති Concept Quiz එකට පිළිතුරු දී +25 XP දිනාගන්න!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: கண்களை மூடிக்கொண்டு இந்த ஆடியோ சுருக்கங்களைக் கேளுங்கள். 1.25x வேகத்தில் கேட்பது நினைவாற்றலை 3 மடங்கு அதிகரிக்கும்!'
            : '🦉 Kavi says: Close your eyes and listen to these high-yield audio notes at 1.25x speed during daily downtime for effortless recall!'
        }
      />

      {/* ========================================================================= */}
      {/* TAB 1: MASTER INTERACTIVE AUDIO PLAYER */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/30">
                    {activeSummary.levelBadge} • {activeSummary.subject}
                  </span>
                  {activeSummary.stream && (
                    <span className="text-xs text-indigo-200/70 font-semibold hidden sm:inline">
                      {activeSummary.stream}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                  {activeSummary.title[language] || activeSummary.title.si || activeSummary.title.en}
                </h2>
                <div className="flex items-center gap-2 text-xs text-indigo-300/80">
                  <span>Presented by {activeSummary.author}</span>
                  <span>•</span>
                  <span>{activeSummary.authorTitle}</span>
                  <span>•</span>
                  <span>Duration {activeSummary.duration}</span>
                </div>
              </div>

              {/* Animated Sound Waveform */}
              <div className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-800/40">
                {[40, 70, 95, 60, 85, 30, 90, 50, 80, 45, 65, 35].map((height, i) => (
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

            {/* Slider & Timing */}
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

            {/* Playback Controls & Speed Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-indigo-800/40">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  className="p-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-800 text-indigo-200 transition cursor-pointer"
                  title="Rewind 10 seconds"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                {/* Big Play / Pause Button */}
                <button
                  id="main-audio-play-btn"
                  type="button"
                  onClick={() => handleTogglePlay()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm shadow-lg flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-slate-950" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-slate-950" />
                      <span>Listen to Audio (+40 XP)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  className="p-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-800 text-indigo-200 transition cursor-pointer"
                  title="Forward 10 seconds"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentProgressSeconds(0)}
                  className="p-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-800 text-indigo-200 transition cursor-pointer"
                  title="Restart Audio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 bg-indigo-950/80 p-1.5 rounded-2xl border border-indigo-800/40">
                <span className="text-[11px] font-bold text-indigo-300 px-1">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'text-indigo-300 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Note Transcript Box */}
            <div className="p-5 rounded-2xl bg-indigo-950/70 border border-indigo-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Interactive Audio Transcript (හඬ සටහන)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePrintShortNote(activeSummary)}
                  className="text-xs font-bold text-indigo-200 hover:text-white flex items-center gap-1 cursor-pointer bg-white/10 px-3 py-1 rounded-xl"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Note</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                {activeText}
              </p>

              {/* Key Takeaways */}
              <div className="pt-2 border-t border-indigo-900 space-y-2">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Key Takeaways & Formulas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSummary.keyTakeaways.map((takeaway, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-indigo-900/80 text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-indigo-700/50"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Concept Check Quiz trigger */}
              {activeSummary.conceptQuiz && activeSummary.conceptQuiz.length > 0 && (
                <div className="pt-3 border-t border-indigo-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Quick Concept Check Quiz Available (+25 XP)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuiz(!showQuiz)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>{showQuiz ? 'Hide Quiz' : 'Take Concept Check'}</span>
                    {showQuiz ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Inline Concept Quiz Box */}
              {showQuiz && activeSummary.conceptQuiz && activeSummary.conceptQuiz.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-4 rounded-2xl bg-indigo-900/60 border border-amber-400/40 space-y-3"
                >
                  {(() => {
                    const q = activeSummary.conceptQuiz[0];
                    const qText = q.question[language] || q.question.si || q.question.en;
                    const opts = q.options[language] || q.options.si || q.options.en;
                    const expText = q.explanation[language] || q.explanation.si || q.explanation.en;

                    return (
                      <div className="space-y-3 text-xs">
                        <p className="font-bold text-white text-sm">
                          ❓ {qText}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {opts.map((opt, oIdx) => {
                            const isChosen = selectedAnswer === oIdx;
                            const isCorrect = oIdx === q.correctIndex;
                            let btnStyle = 'bg-indigo-950/80 text-indigo-200 border-indigo-700/50 hover:bg-indigo-900';

                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-900/80 text-emerald-200 border-emerald-500 font-bold';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'bg-rose-900/80 text-rose-200 border-rose-500';
                              }
                            } else if (isChosen) {
                              btnStyle = 'bg-amber-400 text-slate-950 font-bold border-amber-500';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleAnswerQuiz(oIdx)}
                                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>

                        {!quizSubmitted ? (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              disabled={selectedAnswer === null}
                              onClick={handleSubmitQuiz}
                              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs disabled:opacity-40 transition cursor-pointer"
                            >
                              Submit Answer
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-indigo-950/90 border border-indigo-700 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{selectedAnswer === q.correctIndex ? '🎉 නිවැරදියි! +25 XP එකතු විය!' : '💡 පැහැදිලි කිරීම:'}</span>
                            </div>
                            <p className="text-indigo-200 text-[11px] leading-relaxed">
                              {expText}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          </div>

          {/* Audio Playlist Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Curated Audio Summaries Library ({filteredSummaries.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-bold">Select any track to play</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSummaries.map((summary) => {
                const isCurrent = summary.id === activeSummaryId;

                return (
                  <div
                    key={summary.id}
                    onClick={() => handleTogglePlay(summary.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-600 shadow-md ring-2 ring-indigo-400/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 ${
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
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                            {summary.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">• {summary.duration}</span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {summary.levelBadge}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                          {summary.title[language] || summary.title.si || summary.title.en}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {summary.author}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(summary.id, e)}
                        className={`p-2 rounded-xl transition cursor-pointer ${
                          bookmarkedIds.includes(summary.id)
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-400 hover:text-slate-600'
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
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SHORT REVISION NOTES & FORMULA CARDS (කෙටි සටහන්) */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                විභාග කෙටි සටහන් කාඩ්පත් (High-Yield Quick Revision Cards)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                A/L, O/L, සහ 5 ශ්‍රේණිය සඳහා කෙටි සිද්ධාන්ත, සූත්‍ර, සහ විභාග ලකුණු ලබාගැනීමේ රහස් ක්‍රම.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
              {filteredSummaries.length} Notes Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSummaries.map((summary) => {
              const isExpanded = expandedNoteId === summary.id;
              const summaryTitle = summary.title[language] || summary.title.si || summary.title.en;
              const summaryBody = summary.summaryText[language] || summary.summaryText.si || summary.summaryText.en;

              return (
                <div
                  key={summary.id}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 rounded-3xl p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        {summary.levelBadge} • {summary.subject}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePrintShortNote(summary)}
                        className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-bold cursor-pointer"
                        title="Download / Print Note"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print A4</span>
                      </button>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white font-serif leading-snug">
                      {summaryTitle}
                    </h3>

                    <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {summaryBody}
                    </p>

                    {/* Key takeaways bullet box */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-2 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                        High-Yield Formulas & Rules:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {summary.keyTakeaways.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isExpanded && summary.examTips && (
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1.5 text-xs">
                        <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>Exam Traps & Tips:</span>
                        </span>
                        <ul className="list-disc pl-4 text-amber-900 dark:text-amber-200 space-y-1 text-[11px]">
                          {summary.examTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedNoteId(isExpanded ? null : summary.id)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse' : 'View Full Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSummaryId(summary.id);
                        setActiveTab('audio');
                        handleTogglePlay(summary.id);
                      }}
                      className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Listen Audio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

