/**
 * Global Multi-Country Curriculum & Educational Framework Registry for SipArana
 * 
 * Supports autonomous multi-country adaptation across 10 global regions:
 * 1. 🇱🇰 Sri Lanka (NIE & DoENet GCE O/L, A/L, Scholarship, UGC)
 * 2. 🇬🇧 United Kingdom (Ofqual, GCSE, A-Levels, Cambridge/Edexcel)
 * 3. 🇺🇸 United States (K-12 Common Core, AP Advanced Placement, SAT/ACT)
 * 4. 🇦🇺 Australia (ACARA, ATAR, VCE, HSC)
 * 5. 🇯🇵 Japan (MEXT 文部科学省, Shogakko, Chugakko, Koko, EJU, JLPT)
 * 6. 🇮🇳 India (CBSE, ICSE, JEE Mains/Advanced, NEET)
 * 7. 🇨🇦 Canada (OSSD Ontario, BC Ministry of Education)
 * 8. 🇸🇬 Singapore (MOE, PSLE, GCE O/A-Levels, Integrated Programme)
 * 9. 🇩🇪 Germany (Gymnasium, KMK, Abitur 1.0-6.0 scale)
 * 10. 🌍 Global / International (International Baccalaureate IB DP/MYP, Cambridge International)
 */

import { AppLanguage } from './translations';
import { Stream, SchoolGrade } from '@/types';

export type GlobalCountryCode = 'LK' | 'UK' | 'US' | 'AU' | 'JP' | 'IN' | 'CA' | 'SG' | 'DE' | 'GLOBAL';

export interface GlobalGradingSystem {
  id: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  nameJa?: string;
  scaleType: 'Z_SCORE' | 'LETTER_GRADES' | 'NUMERICAL_9_TO_1' | 'GPA_4_POINT' | 'PERCENTILE_ATAR' | 'HENSACHI_JAPAN' | 'IB_POINTS_45' | 'GERMAN_ABITUR_1_6' | 'PERCENTAGE_100';
  highestHonor: string;
  passingBenchmark: string;
  description: string;
}

export interface GlobalEducationStage {
  id: string;
  name: string;
  nameLocal?: string;
  gradeRangeLabel: string;
  typicalAge: string;
  targetGrades: number[];
  defaultStream: string;
  streams: string[];
}

export interface GlobalSubject {
  id: string;
  code: string;
  titleEnglish: string;
  titleNative: string;
  category: string;
  color: string;
  iconName: string;
  grades: number[];
  stream: string;
  description: string;
  examWeighting?: string;
  officialRef: string;
  unitsCount: number;
}

export interface GlobalCurriculum {
  id: string;
  countryCode: GlobalCountryCode;
  titleEnglish: string;
  titleNative: string;
  authorityBoard: string;
  circularRegistry: string;
  stages: GlobalEducationStage[];
  gradingSystem: GlobalGradingSystem;
  subjects: GlobalSubject[];
  pastPaperRepositoryTitle: string;
  mascotGreetingKey: string;
  mascotName: string;
}

export interface GlobalCountry {
  code: GlobalCountryCode;
  name: string;
  nativeName: string;
  flag: string;
  region: 'South Asia' | 'Europe' | 'North America' | 'Oceania' | 'East Asia' | 'Southeast Asia' | 'International';
  defaultLanguage: AppLanguage;
  supportedLanguages: AppLanguage[];
  primaryCurriculumId: string;
  curricula: GlobalCurriculum[];
  educationMinistry: string;
  establishedYear: number;
}

export const GLOBAL_COUNTRIES: GlobalCountry[] = [
  {
    code: 'LK',
    name: 'Sri Lanka',
    nativeName: 'ශ්‍රී ලංකාව',
    flag: '🇱🇰',
    region: 'South Asia',
    defaultLanguage: 'si',
    supportedLanguages: ['si', 'ta', 'en'],
    primaryCurriculumId: 'LK_NIE',
    educationMinistry: 'Ministry of Education & National Institute of Education (NIE)',
    establishedYear: 1948,
    curricula: [
      {
        id: 'LK_NIE',
        countryCode: 'LK',
        titleEnglish: 'Sri Lanka National Curriculum (NIE & DoENet)',
        titleNative: 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශය (NIE)',
        authorityBoard: 'National Institute of Education & Department of Examinations Sri Lanka',
        circularRegistry: 'NIE/LK/CIRCULAR/2026-AUTONOMOUS',
        stages: [
          {
            id: 'lk_scholarship',
            name: 'Grade 5 Scholarship (Primary)',
            nameLocal: '5 වසර ශිෂ්‍යත්වය',
            gradeRangeLabel: 'Grade 5',
            typicalAge: 'Age 9-10',
            targetGrades: [5],
            defaultStream: 'Grade 5 Scholarship',
            streams: ['Grade 5 Scholarship']
          },
          {
            id: 'lk_junior',
            name: 'Junior Secondary',
            nameLocal: 'කනිෂ්ඨ ද්විතීයික (6-9 ශ්‍රේණි)',
            gradeRangeLabel: 'Grades 6-9',
            typicalAge: 'Age 11-14',
            targetGrades: [6, 7, 8, 9],
            defaultStream: 'Junior Secondary (Grade 6-9)',
            streams: ['Junior Secondary (Grade 6-9)']
          },
          {
            id: 'lk_ol',
            name: 'G.C.E. Ordinary Level (O/L)',
            nameLocal: 'සාමාන්‍ය පෙළ (10-11 ශ්‍රේණි)',
            gradeRangeLabel: 'Grades 10-11',
            typicalAge: 'Age 15-16',
            targetGrades: [10, 11],
            defaultStream: 'General O/L',
            streams: ['General O/L']
          },
          {
            id: 'lk_al',
            name: 'G.C.E. Advanced Level (A/L)',
            nameLocal: 'උසස් පෙළ (12-13 ශ්‍රේණි)',
            gradeRangeLabel: 'Grades 12-13',
            typicalAge: 'Age 17-19',
            targetGrades: [12, 13],
            defaultStream: 'Physical Science (Maths)',
            streams: [
              'Physical Science (Maths)',
              'Biological Science (Bio)',
              'Commerce',
              'Technology',
              'Arts'
            ]
          }
        ],
        gradingSystem: {
          id: 'LK_Z_SCORE',
          name: 'Z-Score & A/B/C/S System',
          nameSi: 'ඉසෙඩ් ස්කෝර් (Z-Score) සහ A/B/C/S ලකුණු ක්‍රමය',
          scaleType: 'Z_SCORE',
          highestHonor: 'Z-Score > 2.200 (District Rank 1-10)',
          passingBenchmark: 'Simple Pass (S Grade 35%+)',
          description: 'Standardized normal Gaussian distribution score computed by Department of Examinations for University Admissions (UGC).'
        },
        subjects: [
          {
            id: 'lk_g5_env',
            code: 'LK-SCH-01',
            titleEnglish: 'Primary Environment & Society',
            titleNative: 'පරිසරය හා ආශ්‍රිත ක්‍රියාකාරකම්',
            category: 'Scholarship Core',
            color: 'from-amber-500 to-orange-500',
            iconName: 'Sparkles',
            grades: [5],
            stream: 'Grade 5 Scholarship',
            description: 'ශ්‍රී ලංකාවේ ස්වාභාවික පරිසරය, සතුන්, පැළෑටි සහ සමාජ විද්‍යාව.',
            officialRef: 'NIE Guru Potha 2026 Primary Vol 5',
            unitsCount: 18
          },
          {
            id: 'lk_g5_sin',
            code: 'LK-SCH-02',
            titleEnglish: 'Sinhala Language & IQ Puzzles',
            titleNative: 'සිංහල භාෂාව හා බුද්ධි පරීක්ෂණ',
            category: 'Scholarship Core',
            color: 'from-blue-500 to-indigo-500',
            iconName: 'BookOpen',
            grades: [5],
            stream: 'Grade 5 Scholarship',
            description: 'ව්‍යාකරණ, පද බෙදීම, තේරුම් ගැනීම සහ රූප රටා තර්කන ප්‍රශ්න.',
            officialRef: 'NIE Primary Language Framework',
            unitsCount: 20
          },
          {
            id: 'lk_al_cmaths',
            code: 'LK-AL-01',
            titleEnglish: 'Combined Mathematics',
            titleNative: 'සංයුක්ත ගණිතය',
            category: 'A/L Stream',
            color: 'from-blue-600 to-cyan-600',
            iconName: 'Calculator',
            grades: [12, 13],
            stream: 'Physical Science (Maths)',
            description: 'ශුද්ධ ගණිතය (Pure Maths) සහ ප්‍රයෝගික ගණිතය (Applied Maths).',
            officialRef: 'NIE G.C.E. A/L Syllabi Ref 2026',
            unitsCount: 24
          },
          {
            id: 'lk_al_physics',
            code: 'LK-AL-02',
            titleEnglish: 'Physics',
            titleNative: 'භෞතික විද්‍යාව',
            category: 'A/L Stream',
            color: 'from-indigo-600 to-purple-600',
            iconName: 'Zap',
            grades: [12, 13],
            stream: 'Physical Science (Maths)',
            description: 'යාන්ත්‍ර විද්‍යාව, දෝලන හා තරංග, තාපය, විද්‍යුත් ක්ෂේත්‍ර සහ නූතන භෞතිකය.',
            officialRef: 'NIE A/L Physics Teacher Guide',
            unitsCount: 12
          },
          {
            id: 'lk_al_chemistry',
            code: 'LK-AL-03',
            titleEnglish: 'Chemistry',
            titleNative: 'රසායන විද්‍යාව',
            category: 'A/L Stream',
            color: 'from-emerald-600 to-teal-600',
            iconName: 'FlaskConical',
            grades: [12, 13],
            stream: 'Biological Science (Bio)',
            description: 'කාබනික රසායනය, අකාබනික රසායනය, භෞතික රසායනය සහ පරිසර රසායනය.',
            officialRef: 'NIE Chemistry Unit Compendium',
            unitsCount: 14
          },
          {
            id: 'lk_al_biology',
            code: 'LK-AL-04',
            titleEnglish: 'Biology',
            titleNative: 'ජීව විද්‍යාව',
            category: 'A/L Stream',
            color: 'from-green-600 to-emerald-700',
            iconName: 'Activity',
            grades: [12, 13],
            stream: 'Biological Science (Bio)',
            description: 'ශාක හා සත්ව කායික විද්‍යාව, ජාන විද්‍යාව, ක්ෂුද්‍රජීව විද්‍යාව සහ පරිසර විද්‍යාව.',
            officialRef: 'NIE Resource Book Biology',
            unitsCount: 10
          },
          {
            id: 'lk_ol_science',
            code: 'LK-OL-01',
            titleEnglish: 'Science (O/L)',
            titleNative: 'විද්‍යාව (සාමාන්‍ය පෙළ)',
            category: 'Core O/L',
            color: 'from-emerald-500 to-teal-600',
            iconName: 'Microscope',
            grades: [10, 11],
            stream: 'General O/L',
            description: '10-11 ශ්‍රේණි විද්‍යා විෂය නිර්දේශයේ සියලුම ප්‍රායෝගික හා න්‍යායාත්මක ඒකක.',
            officialRef: 'NIE O/L Science Guidelines',
            unitsCount: 22
          },
          {
            id: 'lk_ol_maths',
            code: 'LK-OL-02',
            titleEnglish: 'Mathematics (O/L)',
            titleNative: 'ගණිතය (සාමාන්‍ය පෙළ)',
            category: 'Core O/L',
            color: 'from-blue-500 to-indigo-600',
            iconName: 'Binary',
            grades: [10, 11],
            stream: 'General O/L',
            description: 'වීජ ගණිතය, ජ්‍යාමිතිය, ත්‍රිකෝණමිතිය, සංඛ්‍යානය සහ සම්භාවිතාව.',
            officialRef: 'NIE O/L Mathematics syllabus',
            unitsCount: 26
          }
        ],
        pastPaperRepositoryTitle: 'DoENet GCE Past Papers & Marking Schemes (විභාග ප්‍රශ්න පත්‍ර)',
        mascotGreetingKey: 'kavi_lk',
        mascotName: 'Kavi the Owl (කවි බකමූණා 🦉)'
      }
    ]
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    primaryCurriculumId: 'UK_GCSE_AL',
    educationMinistry: 'Department for Education (DfE) & Ofqual',
    establishedYear: 1870,
    curricula: [
      {
        id: 'UK_GCSE_AL',
        countryCode: 'UK',
        titleEnglish: 'UK National Curriculum (GCSE & GCE A-Levels)',
        titleNative: 'UK National Curriculum (GCSE & A-Levels)',
        authorityBoard: 'Ofqual, AQA, Edexcel (Pearson), OCR & Cambridge Assessment',
        circularRegistry: 'OFQUAL/UK/REG/2026-AUTONOMOUS',
        stages: [
          {
            id: 'uk_ks3',
            name: 'Key Stage 3 (Secondary)',
            gradeRangeLabel: 'Years 7-9 (Ages 11-14)',
            typicalAge: 'Age 11-14',
            targetGrades: [7, 8, 9],
            defaultStream: 'KS3 Foundation',
            streams: ['KS3 Foundation']
          },
          {
            id: 'uk_gcse',
            name: 'GCSE (General Certificate of Secondary Education)',
            gradeRangeLabel: 'Years 10-11 (Ages 14-16)',
            typicalAge: 'Age 14-16',
            targetGrades: [10, 11],
            defaultStream: 'GCSE Core & Triple Science',
            streams: ['GCSE Core & Triple Science', 'GCSE Humanities & Languages', 'GCSE Business & Design']
          },
          {
            id: 'uk_alevel',
            name: 'GCE Advanced Level (A-Levels / Sixth Form)',
            gradeRangeLabel: 'Years 12-13 (Ages 16-18)',
            typicalAge: 'Age 16-18',
            targetGrades: [12, 13],
            defaultStream: 'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
            streams: [
              'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
              'A-Level Medical Sciences (Biology, Chemistry, Psychology)',
              'A-Level Humanities, Law & Economics',
              'A-Level Computer Science & Digital Tech'
            ]
          }
        ],
        gradingSystem: {
          id: 'UK_9_TO_1',
          name: 'GCSE 9-1 & A-Level A*-E Scale',
          scaleType: 'NUMERICAL_9_TO_1',
          highestHonor: 'Grade 9 (Top 3-5% nationally) / A* at A-Level',
          passingBenchmark: 'Grade 4 (Standard Pass), Grade 5 (Strong Pass)',
          description: 'Ofqual regulated numerical grading scale for GCSE and letter scale for A-Levels mapped to UCAS Tariff points.'
        },
        subjects: [
          {
            id: 'uk_al_maths',
            code: 'UK-AL-MAT',
            titleEnglish: 'A-Level Mathematics',
            titleNative: 'A-Level Mathematics (Pure, Mechanics & Statistics)',
            category: 'A-Level STEM',
            color: 'from-blue-600 to-indigo-700',
            iconName: 'Calculator',
            grades: [12, 13],
            stream: 'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
            description: 'Pure Mathematics calculus, trigonometry, vectors, mechanics and statistical hypothesis testing.',
            officialRef: 'Edexcel/AQA A-Level Mathematics Specification 2026',
            unitsCount: 16
          },
          {
            id: 'uk_al_fmaths',
            code: 'UK-AL-FMAT',
            titleEnglish: 'A-Level Further Mathematics',
            titleNative: 'A-Level Further Mathematics',
            category: 'A-Level STEM',
            color: 'from-purple-600 to-violet-800',
            iconName: 'Binary',
            grades: [12, 13],
            stream: 'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
            description: 'Complex numbers, matrices, differential equations, polar coordinates and hyperbolic functions.',
            officialRef: 'Edexcel Further Maths Spec Ref',
            unitsCount: 14
          },
          {
            id: 'uk_al_physics',
            code: 'UK-AL-PHY',
            titleEnglish: 'A-Level Physics',
            titleNative: 'A-Level Physics (OCR A / AQA)',
            category: 'A-Level STEM',
            color: 'from-cyan-600 to-blue-700',
            iconName: 'Zap',
            grades: [12, 13],
            stream: 'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
            description: 'Quantum phenomena, astrophysics, thermodynamics, circular motion, electromagnetic fields and nuclear physics.',
            officialRef: 'AQA/OCR Physics Specification 2026',
            unitsCount: 15
          },
          {
            id: 'uk_gcse_sciences',
            code: 'UK-GCSE-SCI',
            titleEnglish: 'GCSE Triple Science (Biology, Chemistry, Physics)',
            titleNative: 'GCSE Triple Science',
            category: 'GCSE Core',
            color: 'from-emerald-600 to-teal-700',
            iconName: 'Microscope',
            grades: [10, 11],
            stream: 'GCSE Core & Triple Science',
            description: 'Comprehensive GCSE sciences covering molecular genetics, organic chemistry, electrolysis, energy and waves.',
            officialRef: 'Edexcel GCSE 9-1 Science Master Matrix',
            unitsCount: 24
          }
        ],
        pastPaperRepositoryTitle: 'Official AQA, Edexcel & OCR Past Papers & Mark Schemes',
        mascotGreetingKey: 'kavi_uk',
        mascotName: 'Barnaby the Scholar Owl (🦉🇬🇧)'
      }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    primaryCurriculumId: 'US_COMMON_CORE_AP',
    educationMinistry: 'U.S. Department of Education & The College Board',
    establishedYear: 1776,
    curricula: [
      {
        id: 'US_COMMON_CORE_AP',
        countryCode: 'US',
        titleEnglish: 'US K-12 Common Core & AP (Advanced Placement)',
        titleNative: 'US K-12 Common Core & College Board AP / SAT',
        authorityBoard: 'The College Board, ACT Inc. & State Education Agencies',
        circularRegistry: 'US/COLLEGEBOARD/AP-SAT/2026-AUTONOMOUS',
        stages: [
          {
            id: 'us_elementary',
            name: 'Elementary School (K-5)',
            gradeRangeLabel: 'Grades K-5 (Ages 5-10)',
            typicalAge: 'Age 5-10',
            targetGrades: [5],
            defaultStream: 'Elementary Foundations',
            streams: ['Elementary Foundations']
          },
          {
            id: 'us_middle',
            name: 'Middle School (Grades 6-8)',
            gradeRangeLabel: 'Grades 6-8 (Ages 11-13)',
            typicalAge: 'Age 11-13',
            targetGrades: [6, 7, 8],
            defaultStream: 'Middle School STEM & Humanities',
            streams: ['Middle School STEM & Humanities']
          },
          {
            id: 'us_high',
            name: 'High School & AP / SAT (Grades 9-12)',
            gradeRangeLabel: 'Grades 9-12 (Ages 14-18)',
            typicalAge: 'Age 14-18',
            targetGrades: [9, 10, 11, 12, 13],
            defaultStream: 'AP STEM Honours (Calculus BC, Physics C, Chemistry, CS)',
            streams: [
              'AP STEM Honours (Calculus BC, Physics C, Chemistry, CS)',
              'AP Pre-Med & Biological Sciences (AP Biology, AP Psychology)',
              'AP Humanities & Social Sciences (AP Gov, AP US History, AP Lit)',
              'SAT / ACT College Entrance Prep Track'
            ]
          }
        ],
        gradingSystem: {
          id: 'US_GPA_AP',
          name: '4.0 / 5.0 GPA & AP 1-5 Scoring',
          scaleType: 'GPA_4_POINT',
          highestHonor: 'Unweighted 4.0 GPA / AP Score 5 (Extremely Well Qualified)',
          passingBenchmark: 'GPA 2.0 (C average) / AP Score 3 (Qualified for College Credit)',
          description: 'Standard US 4.0 GPA with AP 5.0 weighted scale and College Board 1-5 score benchmark.'
        },
        subjects: [
          {
            id: 'us_ap_calc_bc',
            code: 'AP-CALC-BC',
            titleEnglish: 'AP Calculus BC',
            titleNative: 'AP Calculus BC (Single-Variable Calculus & Series)',
            category: 'AP STEM Honours',
            color: 'from-blue-600 to-indigo-700',
            iconName: 'Calculator',
            grades: [11, 12],
            stream: 'AP STEM Honours (Calculus BC, Physics C, Chemistry, CS)',
            description: 'Limits, derivatives, integration, parametric, polar equations, and infinite sequences and series.',
            officialRef: 'College Board AP Calculus BC Course and Exam Description 2026',
            unitsCount: 10
          },
          {
            id: 'us_ap_physics_c',
            code: 'AP-PHY-C',
            titleEnglish: 'AP Physics C: Mechanics & E&M',
            titleNative: 'AP Physics C (Calculus-Based Physics)',
            category: 'AP STEM Honours',
            color: 'from-purple-600 to-indigo-800',
            iconName: 'Zap',
            grades: [11, 12],
            stream: 'AP STEM Honours (Calculus BC, Physics C, Chemistry, CS)',
            description: 'Kinematics, Newton laws, work energy, rotational dynamics, electrostatics, Gauss law, circuits and magnetism.',
            officialRef: 'College Board AP Physics C Framework',
            unitsCount: 14
          },
          {
            id: 'us_ap_bio',
            code: 'AP-BIO',
            titleEnglish: 'AP Biology',
            titleNative: 'AP Biology (Molecular, Cellular & Ecology)',
            category: 'AP Pre-Med',
            color: 'from-emerald-600 to-green-700',
            iconName: 'Activity',
            grades: [10, 11, 12],
            stream: 'AP Pre-Med & Biological Sciences (AP Biology, AP Psychology)',
            description: 'Chemistry of life, cell structure, cellular energetics, cell communication, heredity, gene expression and natural selection.',
            officialRef: 'College Board AP Biology CED',
            unitsCount: 8
          },
          {
            id: 'us_sat_prep',
            code: 'US-SAT-PREP',
            titleEnglish: 'Digital SAT Math & Reading/Writing Mastery',
            titleNative: 'Digital SAT Complete Diagnostic Prep',
            category: 'SAT / ACT Prep',
            color: 'from-amber-600 to-orange-700',
            iconName: 'BookOpen',
            grades: [10, 11, 12],
            stream: 'SAT / ACT College Entrance Prep Track',
            description: 'Adaptive module practice for Digital SAT: Advanced Math, Problem Solving, Reading comprehension and grammar.',
            officialRef: 'College Board Digital SAT Suite',
            unitsCount: 16
          }
        ],
        pastPaperRepositoryTitle: 'Official College Board AP Free-Response Papers & Digital SAT Question Bank',
        mascotGreetingKey: 'kavi_us',
        mascotName: 'Oliver the Academic Owl (🦉🇺🇸)'
      }
    ]
  },
  {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    region: 'East Asia',
    defaultLanguage: 'ja',
    supportedLanguages: ['ja', 'en'],
    primaryCurriculumId: 'JP_MEXT',
    educationMinistry: 'MEXT 文部科学省 (Ministry of Education, Culture, Sports, Science and Technology)',
    establishedYear: 1872,
    curricula: [
      {
        id: 'JP_MEXT',
        countryCode: 'JP',
        titleEnglish: 'Japan MEXT National Curriculum & EJU / Daigaku Nyūshi',
        titleNative: '日本国文部科学省 学習指導要領 & 大学入試 / EJU',
        authorityBoard: '文部科学省 (MEXT), 大学入試センター & JASSO (EJU)',
        circularRegistry: 'MEXT/JP/GAKUSHU/2026-AUTONOMOUS',
        stages: [
          {
            id: 'jp_shogakko',
            name: 'Elementary (小学校 Shōgakkō)',
            nameLocal: '小学校 (1-6年生)',
            gradeRangeLabel: 'Grades 1-6 (Ages 6-12)',
            typicalAge: 'Age 6-12',
            targetGrades: [5, 6],
            defaultStream: 'Shōgakkō Sansū & Kokugo',
            streams: ['Shōgakkō Sansū & Kokugo']
          },
          {
            id: 'jp_chugakko',
            name: 'Junior High (中学校 Chūgakkō)',
            nameLocal: '中学校 (1-3年生)',
            gradeRangeLabel: 'Grades 7-9 (Ages 12-15)',
            typicalAge: 'Age 12-15',
            targetGrades: [7, 8, 9],
            defaultStream: 'Chūgakkō Sōgō',
            streams: ['Chūgakkō Sōgō']
          },
          {
            id: 'jp_koko',
            name: 'Senior High (高等学校 Kōtōgakkō & 大学入試)',
            nameLocal: '高等学校 & 大学共通テスト / EJU',
            gradeRangeLabel: 'Grades 10-12 (Ages 15-18)',
            typicalAge: 'Age 15-18',
            targetGrades: [10, 11, 12, 13],
            defaultStream: 'Rikei (理系 Science, Math & Engineering)',
            streams: [
              'Rikei (理系 Science, Math & Engineering)',
              'Bunkei (文系 Humanities, Law & Economics)',
              'EJU / International Japanese Degree Track (JLPT N1/N2)'
            ]
          }
        ],
        gradingSystem: {
          id: 'JP_HENSACHI',
          name: 'Hensachi (偏差値 Standard Score) & Hyotei 5-1',
          nameJa: '偏差値 (Hensachi) & 5段階評定',
          scaleType: 'HENSACHI_JAPAN',
          highestHonor: '偏差値 70+ (Top 2% Tokyo Univ / Kyoto Univ target)',
          passingBenchmark: '偏差値 50 (National Average) / 評定 3.0',
          description: 'Japanese standardized Hensachi T-score distribution (mean 50, standard deviation 10) used for high school and university admissions.'
        },
        subjects: [
          {
            id: 'jp_sugaku_3',
            code: 'JP-KOKO-SU3',
            titleEnglish: 'Mathematics III & C (数学III・C)',
            titleNative: '数学III・C (極限・微分・積分・複素数平面)',
            category: 'Rikei Science Stream',
            color: 'from-red-600 to-rose-700',
            iconName: 'Calculator',
            grades: [11, 12],
            stream: 'Rikei (理系 Science, Math & Engineering)',
            description: '高校数学の最高峰：極限、微分法、積分法、複素数平面、二次曲線、ベクトルの完全制覇。',
            officialRef: '文部科学省 高等学校学習指導要領 数学科 2026',
            unitsCount: 16
          },
          {
            id: 'jp_butsuri',
            code: 'JP-KOKO-PHY',
            titleEnglish: 'Physics (物理)',
            titleNative: '物理 (力学・熱力学・波動・電磁気・原子)',
            category: 'Rikei Science Stream',
            color: 'from-blue-600 to-indigo-800',
            iconName: 'Zap',
            grades: [11, 12],
            stream: 'Rikei (理系 Science, Math & Engineering)',
            description: '共通テスト及び二次試験対応の物理力学、波動干渉、電磁気誘導、原子物理の体系的解法。',
            officialRef: 'MEXT Senior High Physics Compendium',
            unitsCount: 14
          },
          {
            id: 'jp_eju_nihongo',
            code: 'JP-EJU-JPN',
            titleEnglish: 'EJU Japanese & Academic Reading (日本留学試験 日本語)',
            titleNative: 'EJU 日本語 (読解・聴解・記述対策)',
            category: 'EJU / JLPT Track',
            color: 'from-amber-600 to-orange-700',
            iconName: 'BookOpen',
            grades: [10, 11, 12, 13],
            stream: 'EJU / International Japanese Degree Track (JLPT N1/N2)',
            description: '日本の大学進学のためのアカデミック日本語、読解スピード養成、小論文記述対策。',
            officialRef: 'JASSO EJU Examination Guidelines 2026',
            unitsCount: 12
          }
        ],
        pastPaperRepositoryTitle: '大学入試共通テスト・東大京大過去問 & EJU 日本留学試験 過去問アーカイブ',
        mascotGreetingKey: 'kavi_jp',
        mascotName: 'Fukurō-sensei (フクロウ先生 🦉🇯🇵)'
      }
    ]
  },
  {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत (India)',
    flag: '🇮🇳',
    region: 'South Asia',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi', 'ta'],
    primaryCurriculumId: 'IN_CBSE_JEE',
    educationMinistry: 'Ministry of Education (India) & CBSE / NTA',
    establishedYear: 1947,
    curricula: [
      {
        id: 'IN_CBSE_JEE',
        countryCode: 'IN',
        titleEnglish: 'India CBSE & JEE Mains/Advanced / NEET Entrance Framework',
        titleNative: 'केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) & JEE / NEET',
        authorityBoard: 'CBSE, National Testing Agency (NTA) & IIT Joint Admission Board',
        circularRegistry: 'CBSE/NTA/JEE-NEET/2026-AUTONOMOUS',
        stages: [
          {
            id: 'in_secondary',
            name: 'Class 9-10 (Secondary Board)',
            gradeRangeLabel: 'Classes 9-10 (Ages 14-16)',
            typicalAge: 'Age 14-16',
            targetGrades: [9, 10],
            defaultStream: 'CBSE Class 10 Foundation',
            streams: ['CBSE Class 10 Foundation']
          },
          {
            id: 'in_senior',
            name: 'Class 11-12 & JEE / NEET (Senior Secondary)',
            gradeRangeLabel: 'Classes 11-12 (Ages 16-18)',
            typicalAge: 'Age 16-18',
            targetGrades: [11, 12, 13],
            defaultStream: 'Science PCM + JEE Mains & Advanced (Engineering Track)',
            streams: [
              'Science PCM + JEE Mains & Advanced (Engineering Track)',
              'Science PCB + NEET (Medical Track)',
              'Commerce with Mathematics (CA Foundation / Economics)',
              'Humanities & Social Sciences'
            ]
          }
        ],
        gradingSystem: {
          id: 'IN_NTA_PERCENTILE',
          name: 'NTA Percentile & CBSE 100% Board Percentage',
          scaleType: 'PERCENTILE_ATAR',
          highestHonor: '99.9+ NTA Percentile (IIT Bombay / AIIMS Delhi rank) / 98%+ Board',
          passingBenchmark: '33% in each subject (CBSE) / Qualifying Cutoff for JEE Advanced',
          description: 'CBSE Board percentage combined with multi-session normalized NTA percentile score for competitive college entrance.'
        },
        subjects: [
          {
            id: 'in_jee_maths',
            code: 'IN-JEE-MAT',
            titleEnglish: 'JEE Advanced Mathematics',
            titleNative: 'JEE Mathematics (Calculus, Algebra, Coordinate Geometry)',
            category: 'JEE Engineering Track',
            color: 'from-orange-600 to-amber-700',
            iconName: 'Calculator',
            grades: [11, 12],
            stream: 'Science PCM + JEE Mains & Advanced (Engineering Track)',
            description: 'Rigorous problem-solving in coordinate geometry, integral calculus, matrices, vectors, probability and binomial theorem.',
            officialRef: 'NTA JEE Advanced Syllabus 2026',
            unitsCount: 22
          },
          {
            id: 'in_jee_physics',
            code: 'IN-JEE-PHY',
            titleEnglish: 'JEE Physics',
            titleNative: 'JEE Physics (Mechanics, Electromagnetism, Modern Physics)',
            category: 'JEE Engineering Track',
            color: 'from-blue-600 to-indigo-700',
            iconName: 'Zap',
            grades: [11, 12],
            stream: 'Science PCM + JEE Mains & Advanced (Engineering Track)',
            description: 'Rotational dynamics, fluid mechanics, wave optics, electrostatics, electromagnetic induction and semiconductor electronics.',
            officialRef: 'NTA Physics Core Framework',
            unitsCount: 20
          },
          {
            id: 'in_neet_biology',
            code: 'IN-NEET-BIO',
            titleEnglish: 'NEET Biology (NCERT Complete Master)',
            titleNative: 'NEET Biology (Botany & Zoology NCERT 100%)',
            category: 'NEET Medical Track',
            color: 'from-emerald-600 to-green-700',
            iconName: 'Activity',
            grades: [11, 12],
            stream: 'Science PCB + NEET (Medical Track)',
            description: 'Human physiology, plant physiology, genetics, biotechnology, reproduction and ecology based on NCERT line-by-line mastery.',
            officialRef: 'NTA NEET UG Examination Syllabus 2026',
            unitsCount: 18
          }
        ],
        pastPaperRepositoryTitle: 'Official CBSE Board 10-Year Papers & NTA JEE/NEET Chapter-wise Previous Years Questions (PYQs)',
        mascotGreetingKey: 'kavi_in',
        mascotName: 'Vidya the Wise Owl (🦉🇮🇳)'
      }
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    primaryCurriculumId: 'AU_ATAR',
    educationMinistry: 'ACARA (Australian Curriculum, Assessment and Reporting Authority)',
    establishedYear: 1901,
    curricula: [
      {
        id: 'AU_ATAR',
        countryCode: 'AU',
        titleEnglish: 'Australian National Curriculum & ATAR (VCE / HSC / QCE)',
        titleNative: 'Australian Senior Secondary Curriculum & ATAR',
        authorityBoard: 'ACARA, VCAA (Victoria), NESA (NSW) & QCAA',
        circularRegistry: 'ACARA/AU/SENIOR/2026-AUTONOMOUS',
        stages: [
          {
            id: 'au_junior',
            name: 'Secondary (Years 7-10)',
            gradeRangeLabel: 'Years 7-10 (Ages 12-16)',
            typicalAge: 'Age 12-16',
            targetGrades: [7, 8, 9, 10],
            defaultStream: 'Australian National Secondary',
            streams: ['Australian National Secondary']
          },
          {
            id: 'au_senior',
            name: 'Senior Secondary & ATAR (Years 11-12)',
            gradeRangeLabel: 'Years 11-12 (Ages 16-18)',
            typicalAge: 'Age 16-18',
            targetGrades: [11, 12, 13],
            defaultStream: 'Specialist Maths & Physics (ATAR 95+ STEM Track)',
            streams: [
              'Specialist Maths & Physics (ATAR 95+ STEM Track)',
              'Mathematical Methods, Chemistry & Biology',
              'Business Management, Economics & Law',
              'Visual Arts & Media Communications'
            ]
          }
        ],
        gradingSystem: {
          id: 'AU_ATAR_SCALE',
          name: 'ATAR (Australian Tertiary Admission Rank)',
          scaleType: 'PERCENTILE_ATAR',
          highestHonor: 'ATAR 99.95 (Top 0.05% rank nationally - Go8 Chancellor Scholars)',
          passingBenchmark: 'ATAR 50.00 (Standard University Entry Cutoff)',
          description: 'A rank from 0.00 to 99.95 representing student achievement relative to their year cohort across all Australian states.'
        },
        subjects: [
          {
            id: 'au_spec_maths',
            code: 'AU-SPEC-MAT',
            titleEnglish: 'Specialist Mathematics',
            titleNative: 'Specialist Mathematics (Calculus, Vectors & Differential Eq)',
            category: 'ATAR 95+ STEM',
            color: 'from-blue-600 to-indigo-700',
            iconName: 'Calculator',
            grades: [11, 12],
            stream: 'Specialist Maths & Physics (ATAR 95+ STEM Track)',
            description: 'Advanced pure and applied mathematics, vectors, matrices, complex numbers and differential equations.',
            officialRef: 'ACARA Senior Secondary Specialist Maths 2026',
            unitsCount: 14
          },
          {
            id: 'au_methods_maths',
            code: 'AU-METH-MAT',
            titleEnglish: 'Mathematical Methods',
            titleNative: 'Mathematical Methods (Functions, Calculus & Probability)',
            category: 'ATAR STEM Track',
            color: 'from-teal-600 to-cyan-700',
            iconName: 'Binary',
            grades: [11, 12],
            stream: 'Mathematical Methods, Chemistry & Biology',
            description: 'Polynomial functions, exponential and logarithmic functions, calculus and discrete random variables.',
            officialRef: 'ACARA Methods Specification',
            unitsCount: 12
          }
        ],
        pastPaperRepositoryTitle: 'VCAA & NESA Official Past Examination Papers & Assessment Reports',
        mascotGreetingKey: 'kavi_au',
        mascotName: 'Sydney the Guide Owl (🦉🇦🇺)'
      }
    ]
  },
  {
    code: 'GLOBAL',
    name: 'International (IB / Cambridge)',
    nativeName: 'International (IB & Cambridge)',
    flag: '🌍',
    region: 'International',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fr', 'es', 'ja'],
    primaryCurriculumId: 'GLOBAL_IB_CAMBRIDGE',
    educationMinistry: 'International Baccalaureate Organization (IBO) & Cambridge International',
    establishedYear: 1968,
    curricula: [
      {
        id: 'GLOBAL_IB_CAMBRIDGE',
        countryCode: 'GLOBAL',
        titleEnglish: 'International Baccalaureate (IB DP) & Cambridge IGCSE / IAL',
        titleNative: 'International Baccalaureate (IB) & Cambridge International',
        authorityBoard: 'International Baccalaureate Organization (Geneva) & Cambridge Assessment',
        circularRegistry: 'IBO/CAMBRIDGE/GLOBAL/2026-AUTONOMOUS',
        stages: [
          {
            id: 'global_myp',
            name: 'Cambridge IGCSE / IB MYP',
            gradeRangeLabel: 'Grades 9-10 (Ages 14-16)',
            typicalAge: 'Age 14-16',
            targetGrades: [9, 10],
            defaultStream: 'Cambridge IGCSE Core & Extended',
            streams: ['Cambridge IGCSE Core & Extended']
          },
          {
            id: 'global_ibdp',
            name: 'IB Diploma Programme (IB DP) & Cambridge IAL',
            gradeRangeLabel: 'Grades 11-12 (Ages 16-18)',
            typicalAge: 'Age 16-18',
            targetGrades: [11, 12, 13],
            defaultStream: 'IB DP Higher Level (HL) Mathematics AA, Physics & Chemistry',
            streams: [
              'IB DP Higher Level (HL) Mathematics AA, Physics & Chemistry',
              'IB DP Pre-Med (HL Biology, HL Chemistry, SL Psychology)',
              'IB DP Economics, Global Politics & Business Management',
              'Cambridge International A-Levels (IAL STEM)'
            ]
          }
        ],
        gradingSystem: {
          id: 'GLOBAL_IB_SCALE',
          name: 'IB 45-Point Scale (1-7 Per Subject + TOK/EE 3pts)',
          scaleType: 'IB_POINTS_45',
          highestHonor: '45 Points (Maximum World Rank - Ivy League / Oxbridge)',
          passingBenchmark: '24 Points (Minimum Diploma Pass with Core conditions)',
          description: '6 subjects evaluated 1-7 points plus 3 bonus points for Theory of Knowledge (TOK) and Extended Essay (EE).'
        },
        subjects: [
          {
            id: 'ib_math_aa_hl',
            code: 'IB-MATH-AA-HL',
            titleEnglish: 'IB Mathematics: Analysis & Approaches HL',
            titleNative: 'IB Math AA HL (Calculus, Proofs & Differential Eq)',
            category: 'IB DP Higher Level',
            color: 'from-blue-700 to-indigo-900',
            iconName: 'Calculator',
            grades: [11, 12],
            stream: 'IB DP Higher Level (HL) Mathematics AA, Physics & Chemistry',
            description: 'Rigorous formal proofs, induction, series expansions, vectors in 3D, differential equations and statistical distributions.',
            officialRef: 'IBO Mathematics AA Guide 2026',
            unitsCount: 16
          },
          {
            id: 'ib_physics_hl',
            code: 'IB-PHY-HL',
            titleEnglish: 'IB Physics HL',
            titleNative: 'IB Physics HL (Quantum, Fields & Thermodynamics)',
            category: 'IB DP Higher Level',
            color: 'from-purple-700 to-violet-900',
            iconName: 'Zap',
            grades: [11, 12],
            stream: 'IB DP Higher Level (HL) Mathematics AA, Physics & Chemistry',
            description: 'Mechanics, thermal physics, wave phenomena, fields, electromagnetic induction, quantum and nuclear physics, plus option topic.',
            officialRef: 'IBO Physics Subject Guide',
            unitsCount: 14
          }
        ],
        pastPaperRepositoryTitle: 'Official IBO Examination Question Papers, Mark Schemes & Examiner Reports',
        mascotGreetingKey: 'kavi_global',
        mascotName: 'Atlas the Global Owl (🦉🌍)'
      }
    ]
  }
];

export function getCountryByCode(code?: string): GlobalCountry {
  if (!code) return GLOBAL_COUNTRIES[0];
  const found = GLOBAL_COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return found || GLOBAL_COUNTRIES[0];
}

export function getCurriculumById(curriculumId?: string): GlobalCurriculum {
  for (const c of GLOBAL_COUNTRIES) {
    const cur = c.curricula.find(curr => curr.id === curriculumId);
    if (cur) return cur;
  }
  return GLOBAL_COUNTRIES[0].curricula[0];
}

export interface CountrySubdivision {
  countryCode: GlobalCountryCode;
  labelEn: string;
  labelLocal: string;
  placeholder: string;
  defaultSubdivision: string;
  subdivisions: string[];
}

export const GLOBAL_COUNTRY_SUBDIVISIONS: Record<GlobalCountryCode, CountrySubdivision> = {
  LK: {
    countryCode: 'LK',
    labelEn: 'District',
    labelLocal: 'දිස්ත්‍රික්කය (District)',
    placeholder: 'දිස්ත්‍රික්කය තෝරන්න',
    defaultSubdivision: 'Colombo',
    subdivisions: [
      'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
      'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
      'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
      'Monaragala', 'Ratnapura', 'Kegalle'
    ]
  },
  UK: {
    countryCode: 'UK',
    labelEn: 'Nation / County / Region',
    labelLocal: 'Nation / County / Region',
    placeholder: 'Select region or county',
    defaultSubdivision: 'Greater London',
    subdivisions: [
      'Greater London',
      'South East England (Oxford, Surrey)',
      'East of England (Cambridge, Essex)',
      'West Midlands (Birmingham, Coventry)',
      'North West England (Manchester, Liverpool)',
      'Yorkshire & the Humber (Leeds, Sheffield)',
      'South West England (Bristol, Bath)',
      'East Midlands (Nottingham, Leicester)',
      'North East England (Newcastle, Durham)',
      'Scotland (Edinburgh, Glasgow, Aberdeen)',
      'Wales (Cardiff, Swansea)',
      'Northern Ireland (Belfast, Derry)'
    ]
  },
  US: {
    countryCode: 'US',
    labelEn: 'State / Territory',
    labelLocal: 'State / Territory',
    placeholder: 'Select state',
    defaultSubdivision: 'California',
    subdivisions: [
      'California', 'New York', 'Texas', 'Florida', 'Illinois',
      'Washington', 'Massachusetts', 'Pennsylvania', 'Georgia',
      'North Carolina', 'Virginia', 'New Jersey', 'Ohio', 'Michigan',
      'Colorado', 'Arizona', 'Maryland', 'Minnesota', 'Oregon',
      'Connecticut', 'Indiana', 'Tennessee', 'Missouri', 'Wisconsin', 'Utah'
    ]
  },
  JP: {
    countryCode: 'JP',
    labelEn: 'Prefecture / Region',
    labelLocal: '都道府県 (Prefecture / Region)',
    placeholder: '都道府県を選択',
    defaultSubdivision: '東京都 (Tokyo)',
    subdivisions: [
      '東京都 (Tokyo)', '神奈川県 (Kanagawa)', '大阪府 (Osaka)',
      '愛知県 (Aichi)', '埼玉県 (Saitama)', '千葉県 (Chiba)',
      '兵庫県 (Hyogo)', '北海道 (Hokkaido)', '福岡県 (Fukuoka)',
      '静岡県 (Shizuoka)', '京都府 (Kyoto)', '広島県 (Hiroshima)',
      '宮城県 (Miyagi)', '茨城県 (Ibaraki)', '新潟県 (Niigata)'
    ]
  },
  IN: {
    countryCode: 'IN',
    labelEn: 'State / Union Territory',
    labelLocal: 'State / Union Territory (राज्य / संघ राज्य क्षेत्र)',
    placeholder: 'Select state / UT',
    defaultSubdivision: 'Maharashtra',
    subdivisions: [
      'Maharashtra (Mumbai, Pune)', 'Delhi (NCR)', 'Karnataka (Bengaluru)',
      'Tamil Nadu (Chennai)', 'Uttar Pradesh (Lucknow, Noida)', 'Telangana (Hyderabad)',
      'West Bengal (Kolkata)', 'Gujarat (Ahmedabad)', 'Kerala (Kochi, Trivandrum)',
      'Rajasthan (Jaipur)', 'Punjab (Chandigarh)', 'Haryana (Gurugram)',
      'Madhya Pradesh (Indore)', 'Bihar (Patna)', 'Andhra Pradesh', 'Odisha (Bhubaneswar)'
    ]
  },
  AU: {
    countryCode: 'AU',
    labelEn: 'State / Territory',
    labelLocal: 'State / Territory',
    placeholder: 'Select state / territory',
    defaultSubdivision: 'New South Wales (NSW)',
    subdivisions: [
      'New South Wales (NSW - Sydney)',
      'Victoria (VIC - Melbourne)',
      'Queensland (QLD - Brisbane)',
      'Western Australia (WA - Perth)',
      'South Australia (SA - Adelaide)',
      'Australian Capital Territory (ACT - Canberra)',
      'Tasmania (TAS - Hobart)',
      'Northern Territory (NT - Darwin)'
    ]
  },
  CA: {
    countryCode: 'CA',
    labelEn: 'Province / Territory',
    labelLocal: 'Province / Territory',
    placeholder: 'Select province',
    defaultSubdivision: 'Ontario',
    subdivisions: [
      'Ontario (Toronto, Ottawa)',
      'British Columbia (Vancouver, Victoria)',
      'Quebec (Montreal, Quebec City)',
      'Alberta (Calgary, Edmonton)',
      'Manitoba (Winnipeg)',
      'Saskatchewan (Saskatoon, Regina)',
      'Nova Scotia (Halifax)',
      'New Brunswick (Fredericton)',
      'Newfoundland and Labrador',
      'Prince Edward Island'
    ]
  },
  SG: {
    countryCode: 'SG',
    labelEn: 'Planning Region / Area',
    labelLocal: 'Planning Region / Area',
    placeholder: 'Select area',
    defaultSubdivision: 'Central Region',
    subdivisions: [
      'Central Region (Downtown, Orchard, Bukit Merah)',
      'East Region (Tampines, Bedok, Pasir Ris)',
      'North-East Region (Hougang, Sengkang, Punggol)',
      'North Region (Woodlands, Yishun, Sembawang)',
      'West Region (Jurong, Clementi, Bukit Batok)'
    ]
  },
  DE: {
    countryCode: 'DE',
    labelEn: 'Bundesland (Federal State)',
    labelLocal: 'Bundesland (Federal State)',
    placeholder: 'Bundesland wählen',
    defaultSubdivision: 'Bayern (Bavaria)',
    subdivisions: [
      'Bayern (Bavaria - München)',
      'Baden-Württemberg (Stuttgart)',
      'Nordrhein-Westfalen (Köln, Düsseldorf)',
      'Berlin',
      'Hessen (Frankfurt)',
      'Hamburg',
      'Niedersachsen (Hannover)',
      'Sachsen (Dresden, Leipzig)',
      'Rheinland-Pfalz (Mainz)',
      'Schleswig-Holstein (Kiel)'
    ]
  },
  GLOBAL: {
    countryCode: 'GLOBAL',
    labelEn: 'Global Region / Major City',
    labelLocal: 'Global Region / Major City',
    placeholder: 'Select or enter region',
    defaultSubdivision: 'International / Global Hub',
    subdivisions: [
      'International / Global Hub',
      'London / Western Europe',
      'New York / Eastern US',
      'San Francisco / Silicon Valley',
      'Tokyo / East Asia',
      'Singapore / SE Asia',
      'Sydney / Oceania',
      'Dubai / Middle East Hub',
      'Toronto / Canada',
      'Other Global City'
    ]
  }
};

export function getCountrySubdivisions(countryCode?: string): CountrySubdivision {
  if (!countryCode) return GLOBAL_COUNTRY_SUBDIVISIONS.LK;
  const code = countryCode.toUpperCase() as GlobalCountryCode;
  return GLOBAL_COUNTRY_SUBDIVISIONS[code] || GLOBAL_COUNTRY_SUBDIVISIONS.GLOBAL;
}
