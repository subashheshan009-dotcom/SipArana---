import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  GLOBAL_COUNTRIES,
  getCountryByCode,
  getCurriculumById,
  type GlobalCountry,
  type GlobalCurriculum,
  type GlobalSubject,
  type GlobalEducationStage,
  type GlobalGradingSystem,
  type GlobalCountryCode
} from '@/data/globalCurriculumData';
import { GlobalCurriculumEngine, type LocalizedMascotPlan } from '@/utils/globalCurriculumEngine';

export interface CountryDictionary {
  countryCode: GlobalCountryCode;
  countryName: string;
  nativeCountryName: string;
  flag: string;
  ministryName: string;
  ministryShort: string;
  authorityTagline: string;
  officialTeacherGuideRef: string;
  curriculumTitle: string;
  curriculumTitleNative: string;
  curriculumCode: string;
  heroBadge: string;
  heroTitleGreeting: string;
  heroSubtitle: string;
  curriculumTrackerTitle: string;
  curriculumTrackerBadge: string;
  curriculumTrackerDesc: string;
  pastPapersTitle: string;
  pastPapersBadge: string;
  gradingTargetSample: string;
  gradingScaleName: string;
  mascotName: string;
  mascotGreeting: string;
  activeStreamName: string;
  availableStreams: string[];
  subTitleHeader: string;
}

export interface CountryContextType {
  country: GlobalCountry;
  curriculum: GlobalCurriculum;
  countryCode: GlobalCountryCode;
  curriculumId: string;
  subjects: GlobalSubject[];
  allCurriculumSubjects: GlobalSubject[];
  stages: GlobalEducationStage[];
  streams: string[];
  activeStream: string;
  activeGrade: number;
  gradingSystem: GlobalGradingSystem;
  mascot: LocalizedMascotPlan;
  dictionary: CountryDictionary;
  setCountry: (code: GlobalCountryCode, curriculumId?: string) => void;
  setCurriculum: (curriculumId: string) => void;
  setGrade: (grade: number) => void;
  setStream: (stream: string) => void;
  allCountries: GlobalCountry[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const { profile, setCountryAndCurriculum, setGradeAndStream } = useAuth();
  const { language } = useLanguage();

  const countryCode: GlobalCountryCode = (profile?.countryCode as GlobalCountryCode) || 'LK';
  const country = useMemo(() => getCountryByCode(countryCode), [countryCode]);

  const curriculumId = profile?.curriculumId || country.primaryCurriculumId || country.curricula[0]?.id || 'LK_NIE';
  const curriculum = useMemo(() => {
    return getCurriculumById(curriculumId) || country.curricula[0] || getCountryByCode('LK').curricula[0];
  }, [curriculumId, country]);

  const stages = useMemo(() => curriculum.stages || [], [curriculum]);
  
  const allCurriculumSubjects = useMemo(() => curriculum.subjects || [], [curriculum]);
  
  const activeGrade = profile?.grade || 11;
  const activeStream = profile?.stream || curriculum.subjects[0]?.stream || 'General Academic';

  const streams = useMemo(() => {
    const all = new Set<string>();
    stages.forEach(stage => {
      stage.streams.forEach(s => all.add(s));
    });
    if (all.size === 0) {
      curriculum.subjects.forEach(sub => all.add(sub.stream));
    }
    return Array.from(all);
  }, [stages, curriculum]);

  // Filtered subjects strictly matching active country, grade, stream
  const subjects = useMemo(() => {
    return GlobalCurriculumEngine.getFilteredGlobalSubjects(profile);
  }, [profile, curriculum]);

  const gradingSystem = useMemo(() => curriculum.gradingSystem, [curriculum]);

  const mascot = useMemo(() => {
    return GlobalCurriculumEngine.getLocalizedMascotGuidance(profile, language);
  }, [profile, language]);

  // Build localized dynamic dictionary based on country & active language
  const dictionary: CountryDictionary = useMemo(() => {
    switch (countryCode) {
      case 'JP':
        return {
          countryCode: 'JP',
          countryName: 'Japan',
          nativeCountryName: '日本 (Japan)',
          flag: '🇯🇵',
          ministryName: '文部科学省 (MEXT - Ministry of Education, Culture, Sports, Science and Technology)',
          ministryShort: '文部科学省 MEXT',
          authorityTagline: 'Aligned with MEXT (Monbukagakusho) Official Teacher Guide & Curriculum Standards',
          officialTeacherGuideRef: '文部科学省 高等学校学習指導要領 数学・理科・国語 2026',
          curriculumTitle: 'Japan MEXT National Curriculum & EJU / Daigaku Nyūshi',
          curriculumTitleNative: '日本国文部科学省 学習指導要領 & 大学入試 / EJU',
          curriculumCode: 'MEXT-JP-2026',
          heroBadge: '文部科学省 指導要領 準拠',
          heroTitleGreeting: language === 'ja' ? '日本の文部科学省カリキュラム & 大学入試対策' : 'Japan MEXT National Curriculum & College Entrance Hub',
          heroSubtitle: language === 'ja'
            ? '高校数学III・C、物理、化学、国語、共通テスト及びEJU日本留学試験対策の体系的学習と過去問アーカイブ'
            : 'Access official MEXT syllabus guides, Mathematics III/C, Physics, Chemistry, and EJU / Daigaku Nyūshi entrance preparation.',
          curriculumTrackerTitle: '学習指導要領 ガイド (MEXT Tracker)',
          curriculumTrackerBadge: 'MEXT Aligned',
          curriculumTrackerDesc: '日本国文部科学省 指導要領および大学入学共通テスト基準に完全準拠しています。',
          pastPapersTitle: '大学入試共通テスト・東大京大過去問 & EJU 日本留学試験 過去問アーカイブ',
          pastPapersBadge: 'MEXT & JASSO',
          gradingTargetSample: '偏差値 70+ (東大・京大・難関大目標)',
          gradingScaleName: '偏差値 (Hensachi) & 5段階評定',
          mascotName: 'フクロウ先生 (Fukurō-sensei 🦉🇯🇵)',
          mascotGreeting: 'こんにちは！フクロウ先生です。文部科学省指導要領に沿って、確実に偏差値を伸ばしていきましょう！',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: '文部科学省 指導要領ポータル'
        };

      case 'UK':
        return {
          countryCode: 'UK',
          countryName: 'United Kingdom',
          nativeCountryName: 'United Kingdom (UK)',
          flag: '🇬🇧',
          ministryName: 'Department for Education (DfE) & Ofqual',
          ministryShort: 'DfE / Ofqual',
          authorityTagline: 'Aligned with Department for Education (DfE) & Ofqual Official Specifications (AQA / Edexcel / OCR)',
          officialTeacherGuideRef: 'Ofqual National Curriculum & Exam Board Specifications 2026',
          curriculumTitle: 'UK National Curriculum (GCSE & GCE A-Levels)',
          curriculumTitleNative: 'UK National Curriculum (GCSE & A-Levels)',
          curriculumCode: 'UK-OFQUAL-2026',
          heroBadge: 'Ofqual Regulated Standards',
          heroTitleGreeting: 'Welcome to UK GCSE & GCE A-Level Preparation',
          heroSubtitle: 'Master A-Level STEM, Further Maths, Triple Science and GCSE courses with examiner reports and mark schemes.',
          curriculumTrackerTitle: 'UK Curriculum Tracker (Ofqual Aligned)',
          curriculumTrackerBadge: 'Ofqual & DfE',
          curriculumTrackerDesc: 'Aligned with official Ofqual, AQA, Edexcel Pearson & OCR GCSE/A-Level specifications.',
          pastPapersTitle: 'Official AQA, Edexcel & OCR Past Papers & Mark Schemes',
          pastPapersBadge: 'AQA / Edexcel / OCR',
          gradingTargetSample: 'A* A* A* (UCAS 168 pts)',
          gradingScaleName: 'GCSE 9-1 & A-Level A*-E Scale',
          mascotName: 'Barnaby the Scholar Owl (🦉🇬🇧)',
          mascotGreeting: 'Welcome back! Let us conquer your UK GCSE and A-Level revision with active recall and official mark schemes.',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'UK National Curriculum Hub'
        };

      case 'US':
        return {
          countryCode: 'US',
          countryName: 'United States',
          nativeCountryName: 'United States of America',
          flag: '🇺🇸',
          ministryName: 'U.S. Department of Education & The College Board',
          ministryShort: 'US Dept of Ed / College Board',
          authorityTagline: 'Aligned with College Board AP Course Frameworks & US Common Core Standards',
          officialTeacherGuideRef: 'College Board AP Course and Exam Descriptions (CED) 2026',
          curriculumTitle: 'US K-12 Common Core & AP (Advanced Placement)',
          curriculumTitleNative: 'US K-12 Common Core & College Board AP / SAT',
          curriculumCode: 'US-AP-SAT-2026',
          heroBadge: 'College Board AP Aligned',
          heroTitleGreeting: 'Welcome to US K-12, AP & SAT Mastery Hub',
          heroSubtitle: 'Target a 5 on AP Calculus BC, AP Physics C, AP Biology, and maximize your Digital SAT percentile.',
          curriculumTrackerTitle: 'US AP & Common Core Tracker',
          curriculumTrackerBadge: 'College Board Aligned',
          curriculumTrackerDesc: 'Aligned with College Board AP Course and Exam Descriptions (CED) & Common Core State Standards.',
          pastPapersTitle: 'Official College Board AP Free-Response Papers & Digital SAT Question Bank',
          pastPapersBadge: 'The College Board',
          gradingTargetSample: 'Unweighted 4.0 GPA / AP Score 5',
          gradingScaleName: '4.0 / 5.0 GPA & AP 1-5 Scoring',
          mascotName: 'Oliver the Academic Owl (🦉🇺🇸)',
          mascotGreeting: 'Hey Champion! Ready to score a 5 on your AP exams and conquer the SAT? Let us build momentum.',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'US K-12 & AP Portal'
        };

      case 'IN':
        return {
          countryCode: 'IN',
          countryName: 'India',
          nativeCountryName: 'भारत (India)',
          flag: '🇮🇳',
          ministryName: 'Ministry of Education (India) & CBSE / NTA',
          ministryShort: 'CBSE / NTA',
          authorityTagline: 'Aligned with CBSE / NCERT Curriculum & NTA Guidelines',
          officialTeacherGuideRef: 'CBSE / NCERT Syllabus & NTA JEE/NEET Guidelines 2026',
          curriculumTitle: 'India CBSE & JEE Mains/Advanced / NEET Framework',
          curriculumTitleNative: 'केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) & JEE / NEET',
          curriculumCode: 'CBSE-NTA-2026',
          heroBadge: 'CBSE & NTA Verified',
          heroTitleGreeting: 'Welcome to India CBSE & JEE / NEET Entrance Track',
          heroSubtitle: 'Line-by-line NCERT concept mastery, chapter-wise PYQs, formula cheat sheets, and mock tests for top ranks.',
          curriculumTrackerTitle: 'CBSE & NTA Curriculum Tracker',
          curriculumTrackerBadge: 'NCERT Grounded',
          curriculumTrackerDesc: 'Aligned with National Council of Educational Research and Training (NCERT) and NTA standards.',
          pastPapersTitle: 'Official CBSE Board 10-Year Papers & NTA JEE/NEET Previous Years Questions (PYQs)',
          pastPapersBadge: 'CBSE & NTA PYQs',
          gradingTargetSample: '99.95 Percentile (IIT Bombay / AIIMS target)',
          gradingScaleName: 'NTA Percentile & CBSE Board %',
          mascotName: 'Vidya the Wise Owl (🦉🇮🇳)',
          mascotGreeting: 'Namaste! Targeting CBSE Board 95%+ and JEE/NEET top rank? Let us master NCERT concepts step-by-step.',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'CBSE & NTA Academic Hub'
        };

      case 'AU':
        return {
          countryCode: 'AU',
          countryName: 'Australia',
          nativeCountryName: 'Australia (ACARA)',
          flag: '🇦🇺',
          ministryName: 'ACARA (Australian Curriculum, Assessment and Reporting Authority)',
          ministryShort: 'ACARA / VCAA / NESA',
          authorityTagline: 'Aligned with ACARA Australian Curriculum & Senior Secondary VCE/HSC/ATAR',
          officialTeacherGuideRef: 'ACARA Senior Secondary Standards & VCAA/NESA Guides 2026',
          curriculumTitle: 'Australian National Curriculum & ATAR (VCE / HSC / QCE)',
          curriculumTitleNative: 'Australian Senior Secondary Curriculum & ATAR',
          curriculumCode: 'ACARA-ATAR-2026',
          heroBadge: 'ACARA & ATAR Aligned',
          heroTitleGreeting: 'Welcome to Australian National Curriculum & ATAR Hub',
          heroSubtitle: 'Excel in Specialist Mathematics, Mathematical Methods, Physics, Chemistry, and maximize your ATAR rank.',
          curriculumTrackerTitle: 'Australian Curriculum Tracker',
          curriculumTrackerBadge: 'ACARA Standards',
          curriculumTrackerDesc: 'Aligned with ACARA Australian Curriculum and state senior secondary boards (VCAA, NESA, QCAA).',
          pastPapersTitle: 'VCAA & NESA Official Past Examination Papers & Assessment Reports',
          pastPapersBadge: 'VCAA & NESA',
          gradingTargetSample: 'ATAR 99.85 (Chancellor Scholar)',
          gradingScaleName: 'ATAR (Australian Tertiary Admission Rank)',
          mascotName: 'Sydney the Guide Owl (🦉🇦🇺)',
          mascotGreeting: 'G’day mate! Ready to push your ATAR score into the top percentile? Let’s tackle your study goals.',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'Australian Education Hub'
        };

      case 'GLOBAL':
        return {
          countryCode: 'GLOBAL',
          countryName: 'International (IB / Cambridge)',
          nativeCountryName: 'International Baccalaureate & Cambridge',
          flag: '🌍',
          ministryName: 'International Baccalaureate Organization (IBO) & Cambridge Assessment',
          ministryShort: 'IBO / Cambridge',
          authorityTagline: 'Aligned with International Baccalaureate (IB DP) & Cambridge International Assessment',
          officialTeacherGuideRef: 'IBO Diploma Programme & Cambridge Assessment Guides 2026',
          curriculumTitle: 'International Baccalaureate (IB DP) & Cambridge IGCSE / IAL',
          curriculumTitleNative: 'International Baccalaureate (IB) & Cambridge International',
          curriculumCode: 'IBO-CAMBRIDGE-2026',
          heroBadge: 'IB DP & Cambridge Aligned',
          heroTitleGreeting: 'Welcome to International Baccalaureate (IB) & Cambridge Hub',
          heroSubtitle: 'Master IB Higher Level (HL) Mathematics AA, Physics, Chemistry, and Cambridge International A-Levels.',
          curriculumTrackerTitle: 'Global Curriculum Tracker (IB & Cambridge)',
          curriculumTrackerBadge: 'IBO Geneva Standard',
          curriculumTrackerDesc: 'Aligned with International Baccalaureate (IB DP) and Cambridge Assessment specifications.',
          pastPapersTitle: 'Official IBO Examination Question Papers, Mark Schemes & Examiner Reports',
          pastPapersBadge: 'IBO & Cambridge',
          gradingTargetSample: '44 / 45 Points (HL 7 7 7 + TOK/EE A)',
          gradingScaleName: 'IB 45-Point Scale',
          mascotName: 'Atlas the Global Owl (🦉🌍)',
          mascotGreeting: 'Welcome! Atlas here. Let us advance your international curriculum goals with rigorous conceptual depth.',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'Global AI Education Core'
        };

      case 'LK':
      default:
        return {
          countryCode: 'LK',
          countryName: 'Sri Lanka',
          nativeCountryName: 'ශ්‍රී ලංකාව',
          flag: '🇱🇰',
          ministryName: 'Ministry of Education & National Institute of Education (NIE)',
          ministryShort: 'NIE / DoENet',
          authorityTagline: 'Aligned with National Institute of Education (NIE) Teacher Guide & Syllabi',
          officialTeacherGuideRef: 'NIE G.C.E. A/L & O/L Teacher Guides 2026 (ජාතික අධ්‍යාපන ආයතන ගුරු මාර්ගෝපදේශ)',
          curriculumTitle: 'Sri Lanka National Curriculum (NIE & DoENet)',
          curriculumTitleNative: 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශය (NIE)',
          curriculumCode: 'NIE-LK-2026',
          heroBadge: 'NIE & DoENet Aligned',
          heroTitleGreeting: language === 'si'
            ? 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන පියසට සාදරයෙන් පිළිගනිමු!'
            : language === 'ta'
            ? 'இலங்கை தேசிய கல்வி தளத்திற்கு உங்களை வரவேற்கிறோம்!'
            : 'Welcome to Sri Lanka National Education Hub',
          heroSubtitle: language === 'si'
            ? '5 ශිෂ්‍යත්වය, සාමාන්‍ය පෙළ සහ උසස් පෙළ (ගණිත, ජීව, වාණිජ, තාක්ෂණ, කලා) විෂය නිර්දේශයේ සියලුම පාඩම් සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර.'
            : language === 'ta'
            ? '5 ஆம் தர புலமைப்பரிசில், சாதாரண தரம் மற்றும் உயர்தர பாடத்திட்ட வீடியோக்கள் மற்றும் வினாத்தாள்கள்.'
            : 'Grade 5 Scholarship, G.C.E. O/L and A/L (Maths, Bio, Commerce, Tech, Arts) lessons and past papers.',
          curriculumTrackerTitle: language === 'si' ? 'විෂය නිර්දේශ පියස (NIE Tracker)' : language === 'ta' ? 'பாடத்திட்ட வழிகாட்டி' : 'Curriculum Tracker',
          curriculumTrackerBadge: 'NIE Aligned',
          curriculumTrackerDesc: language === 'si'
            ? 'ජාතික අධ්‍යාපන ආයතන (NIE) ගුරු පොත සහ විභාග දෙපාර්තමේන්තු ප්‍රමිතීන්ට අනුකූලයි.'
            : language === 'ta'
            ? 'தேசிய கல்வி நிறுவன (NIE) வழிகாட்டிக்கு அமைவானது.'
            : 'Aligned with National Institute of Education (NIE) guidelines.',
          pastPapersTitle: 'DoENet GCE Past Papers & Marking Schemes (විභාග ප්‍රශ්න පත්‍ර)',
          pastPapersBadge: 'DoENet Sri Lanka',
          gradingTargetSample: 'Z-Score > 2.100 (Island Top 100)',
          gradingScaleName: 'ඉසෙඩ් ස්කෝර් (Z-Score) සහ A/B/C/S ලකුණු ක්‍රමය',
          mascotName: 'කවි සහකාර බකමූණා (Kavi the Owl 🦉🇱🇰)',
          mascotGreeting: language === 'si'
            ? 'ආයුබෝවන්! මම කවි බකමූණා. විභාග ජයග්‍රහණය සහ Z-Score ඉහළ නංවා ගැනීම සඳහා පියවරෙන් පියවර මඟපෙන්වීමට මම සූදානම්.'
            : 'Welcome! I am Kavi your AI mentor. Ready to guide you step-by-step towards exam success!',
          activeStreamName: activeStream,
          availableStreams: streams,
          subTitleHeader: 'ජාතික අධ්‍යාපන පියස'
        };
    }
  }, [countryCode, language, activeStream, streams]);

  const setCountry = (code: GlobalCountryCode, newCurriculumId?: string) => {
    setCountryAndCurriculum(code, newCurriculumId);
  };

  const setCurriculum = (newCurriculumId: string) => {
    setCountryAndCurriculum(countryCode, newCurriculumId);
  };

  const setGrade = (newGrade: number) => {
    setGradeAndStream(newGrade as any);
  };

  const setStream = (newStream: string) => {
    if (!profile) return;
    setGradeAndStream(profile.grade, newStream as any);
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        curriculum,
        countryCode,
        curriculumId,
        subjects,
        allCurriculumSubjects,
        stages,
        streams,
        activeStream,
        activeGrade,
        gradingSystem,
        mascot,
        dictionary,
        setCountry,
        setCurriculum,
        setGrade,
        setStream,
        allCountries: GLOBAL_COUNTRIES
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

export const useCurriculum = useCountry;
