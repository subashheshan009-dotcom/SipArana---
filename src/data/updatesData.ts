export interface AppUpdateItem {
  id: string;
  version: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  category: 'Major Release' | 'AI Feature' | 'Syllabus & Past Papers' | 'Exam Tools' | 'UI & Performance';
  releaseDate: string;
  badge: 'NEW' | 'UPDATE' | 'HOT' | 'IMPROVEMENT';
  summary: string;
  summarySinhala: string;
  summaryTamil?: string;
  highlights: {
    en: string;
    si: string;
  }[];
  affectedModules: string[];
  author: string;
  isBreaking?: boolean;
  upvotesCount: number;
}

export const INITIAL_APP_UPDATES: AppUpdateItem[] = [
  {
    id: 'update_v2_6_live_sync',
    version: 'v2.6.0',
    title: 'Real-Time Auto-Sync Engine for Exam Circulars, Free Courses & Roadmap',
    titleSinhala: 'විභාග නිවේදන, නොමිලේ පාඨමාලා සහ යාවත්කාලීන සඳහා සජීවී ස්වයංක්‍රීය සමමුහුර්ත පද්ධතිය',
    category: 'Major Release',
    releaseDate: 'Today (Live Deployment)',
    badge: 'HOT',
    summary: 'Automated background RSS & live API sync for Department of Examinations (doenets.lk), MOE, UGC, and free university course directories with animated mascot notifications.',
    summarySinhala: 'ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුව සහ නොමිලේ පාඨමාලා දත්ත ගබඩා සමඟ ස්වයංක්‍රීයව සජීවීව සම්බන්ධ වන නවීන Auto-Sync තාක්ෂණය.',
    highlights: [
      {
        en: 'Live automated polling every 45 seconds for newly published circulars & free MOOCs.',
        si: 'තත්පර 45කට වරක් ස්වයංක්‍රීයව නව චක්‍රලේඛ සහ පාඨමාලා පරීක්ෂා කර යාවත්කාලීන වීම.'
      },
      {
        en: 'Interactive 3D Mascot speech bubble alerts on every incoming drop.',
        si: 'නව යාවත්කාලීන නිකුත් වූ සැනින් සිපුරු මාස්කොට් චරිතය මගින් සිසුන් දැනුවත් කිරීම.'
      },
      {
        en: 'One-click manual sync and instant simulation drop controls.',
        si: 'ක්ෂණිකව පරීක්ෂා කිරීමේ සහ Simulate Drop කිරීමේ පහසුකම.'
      }
    ],
    affectedModules: ['Exam News & Alerts', 'Free Online Courses', 'What\'s New', 'Mascot Engine'],
    author: 'SipArana Core Engineering',
    isBreaking: true,
    upvotesCount: 428
  },
  {
    id: 'update_v2_5_ai_tutor',
    version: 'v2.5.2',
    title: 'Trilingual AI Voice Tutor with Real-Time Audio Synthesis',
    titleSinhala: 'සිංහල, දෙමළ සහ ඉංග්‍රීසි කටහඬින් උගන්වන AI ගුරු සහකාර පද්ධතිය',
    category: 'AI Feature',
    releaseDate: 'August 2026',
    badge: 'UPDATE',
    summary: 'Direct speech-to-text and text-to-speech AI guidance for resolving A/L and O/L math and science queries.',
    summarySinhala: 'උසස් පෙළ සහ සාමාන්‍ය පෙළ ඕනෑම විෂය ගැටලුවක් කටහඬින් අසා ක්ෂණික පැහැදිලි කිරීම් ලබා ගැනීමේ පහසුකම.',
    highlights: [
      {
        en: 'Natural Sinhala voice readout with speech synthesis for all exam circulars and lesson summaries.',
        si: 'චක්‍රලේඛ සහ සාරාංශ සටහන් පැහැදිලි කටහඬින් ශ්‍රවණය කිරීමේ හැකියාව.'
      },
      {
        en: 'Step-by-step problem solver for physics derivations and chemistry calculations.',
        si: 'භෞතික විද්‍යාව සහ රසායන විද්‍යා ගණනය කිරීම් පියවරෙන් පියවර විසඳීම.'
      }
    ],
    affectedModules: ['AI Tutor & Voice', 'Subjects', 'Classroom'],
    author: 'SipArana AI Research Lab',
    upvotesCount: 315
  },
  {
    id: 'update_v2_4_google_hub',
    version: 'v2.4.0',
    title: 'Google Student Hub & Developer Workspace Integration',
    titleSinhala: 'ගූගල් ශිෂ්‍ය අධ්‍යාපන පීඨය සහ ඩිජිටල් මෙවලම් පද්ධතිය',
    category: 'Syllabus & Past Papers',
    releaseDate: 'July 2026',
    badge: 'NEW',
    summary: 'Direct in-app access to Google Classroom, Google Drive Past Paper Archives, Google Scholar, and Kaggle Learn.',
    summarySinhala: 'ගූගල් අධ්‍යාපනික මෙවලම් සහ ලේඛනාගාර සෘජුවම සිප්අරණ තුළින් පරිශීලනය කිරීමේ පහසුකම.',
    highlights: [
      {
        en: 'Embedded Google Classroom and Colab notebook workspace for coding learners.',
        si: 'Google Classroom සහ Colab කේතකරණ පරිසරය.'
      },
      {
        en: 'Quick cloud backup for study notes and past paper downloads.',
        si: 'පාඩම් සටහන් ක්ෂණිකව Google Drive වෙත සුරැකීමේ හැකියාව.'
      }
    ],
    affectedModules: ['Google Student Hub', 'Utilities'],
    author: 'SipArana Product Team',
    upvotesCount: 264
  },
  {
    id: 'update_v2_3_book_shop',
    version: 'v2.3.1',
    title: 'SipArana Student Book Shop Marketplace & Island-Wide Delivery',
    titleSinhala: 'සිප්අරණ පොත් හල - දිවයින පුරා බෙදාහැරීමේ වෙළඳපොළ',
    category: 'Exam Tools',
    releaseDate: 'June 2026',
    badge: 'IMPROVEMENT',
    summary: 'Order official NIE Teacher Guides, past paper anthologies, and model test books directly to your doorstep.',
    summarySinhala: 'NIE නිල සම්පත් පොත් සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර කට්ටල නිවසටම ගෙන්වා ගැනීමේ පහසුකම.',
    highlights: [
      {
        en: 'Cash on delivery across all 25 districts in Sri Lanka.',
        si: 'ශ්‍රී ලංකාවේ සියලුම දිස්ත්‍රික්ක 25 සඳහා භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීමේ පහසුකම (COD).'
      },
      {
        en: 'Special student discount vouchers with earned SipArana XP.',
        si: 'පාඩම් කිරීමෙන් උපයන XP ලකුණු මගින් පොත් මිලදී ගැනීමේ වට්ටම්.'
      }
    ],
    affectedModules: ['Book Shop', 'Dashboard'],
    author: 'SipArana Logistics',
    upvotesCount: 198
  }
];

export const SIMULATED_NEW_APP_UPDATES: AppUpdateItem[] = [
  {
    id: 'update_v2_7_ai_mock_eval',
    version: 'v2.7.0-BETA',
    title: '⚡ Live Drop: Instant AI Essay & Structured Paper Auto-Grader',
    titleSinhala: '⚡ සජීවී නිකුතුව: AI රචනා සහ ව්‍යුහගත ප්‍රශ්න පත්‍ර ස්වයංක්‍රීය ලකුණු දීමේ පද්ධතිය',
    category: 'AI Feature',
    releaseDate: 'Just Now (Live Push)',
    badge: 'HOT',
    summary: 'Upload photos of handwritten A/L and O/L answers and receive marking-scheme breakdown with grade projections.',
    summarySinhala: 'අතින් ලියන ලද පිළිතුරු පත්‍රවල ඡායාරූප මගින් ලකුණු දීමේ පටිපාටියට අනුව ලකුණු සහ උපදෙස් ලබාගැනීම.',
    highlights: [
      {
        en: 'Trained on 15 years of official DOENETS marking schemes.',
        si: 'වසර 15ක නිල විභාග ලකුණු ලබාදීමේ පටිපාටි (Marking Schemes) ඇසුරින් සකස් කර ඇත.'
      },
      {
        en: 'Identifies missing key terms and awards part-marks with constructive advice.',
        si: 'අඩුපාඩු හඳුනාගෙන ලකුණු වැඩි කරගත හැකි ක්‍රමවේද උපදෙස් ලබාදීම.'
      }
    ],
    affectedModules: ['Quizzes', 'AI Tutor', 'Performance Analytics'],
    author: 'SipArana AI Labs',
    isBreaking: true,
    upvotesCount: 512
  },
  {
    id: 'update_v2_6_5_arana_offline',
    version: 'v2.6.5',
    title: '⚡ Live Drop: Ultra-Low Data Mode & Full Offline Past Paper Caching',
    titleSinhala: '⚡ සජීවී නිකුතුව: අඩු ඩේටා වැයවන Offline Past Paper සංචිතය',
    category: 'UI & Performance',
    releaseDate: 'Just Now (Live Push)',
    badge: 'NEW',
    summary: 'Cache entire subject past paper booklets with 80% reduced bandwidth for rural students.',
    summarySinhala: 'අඩු අන්තර්ජාල පහසුකම් ඇති සිසුන් සඳහා ඩේටා 80%කින් ඉතිරි කරමින් Offline පරිශීලනය කිරීමේ පහසුකම.',
    highlights: [
      {
        en: 'Zero-data offline mode for cached marking schemes and syllabi.',
        si: 'ඩේටා නොමැතිව ප්‍රශ්න පත්‍ර සහ Marking Schemes පරිශීලනය.'
      },
      {
        en: 'Instant PDF renderer with built-in dark mode invert.',
        si: 'රාත්‍රී කාලයේ පහසුවෙන් කියවීමට Dark Mode PDF කියවනය.'
      }
    ],
    affectedModules: ['Offline Syllabus', 'Subjects'],
    author: 'SipArana Infrastructure',
    isBreaking: true,
    upvotesCount: 389
  }
];
