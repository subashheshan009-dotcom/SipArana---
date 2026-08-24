import type { Subject, CampusCourse, NewsArticle, Flashcard, StudyTask, ClassVideo, SchoolGrade } from '@/types';

export const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export interface GradeInfo {
  grade: SchoolGrade;
  nameSinhala: string;
  nameEnglish: string;
  stage: 'Scholarship' | 'Junior' | 'O/L' | 'A/L';
  description: string;
}

export const SCHOOL_GRADES: GradeInfo[] = [
  { grade: 5, nameSinhala: '5 ශ්‍රේණිය (ශිෂ්‍යත්වය)', nameEnglish: 'Grade 5 (Scholarship)', stage: 'Scholarship', description: '5 වසර ශිෂ්‍යත්ව විභාගය (Grade 5 Scholarship Examination)' },
  { grade: 6, nameSinhala: '6 ශ්‍රේණිය', nameEnglish: 'Grade 6', stage: 'Junior', description: 'කනිෂ්ඨ ද්විතීයික මට්ටම (Junior Secondary - Year 1)' },
  { grade: 7, nameSinhala: '7 ශ්‍රේණිය', nameEnglish: 'Grade 7', stage: 'Junior', description: 'කනිෂ්ඨ ද්විතීයික මට්ටම (Junior Secondary - Year 2)' },
  { grade: 8, nameSinhala: '8 ශ්‍රේණිය', nameEnglish: 'Grade 8', stage: 'Junior', description: 'කනිෂ්ඨ ද්විතීයික මට්ටම (Junior Secondary - Year 3)' },
  { grade: 9, nameSinhala: '9 ශ්‍රේණිය', nameEnglish: 'Grade 9', stage: 'Junior', description: 'සාමාන්‍ය පෙළ පූර්ව සූදානම (Pre-O/L Foundation)' },
  { grade: 10, nameSinhala: '10 ශ්‍රේණිය', nameEnglish: 'Grade 10 (O/L)', stage: 'O/L', description: 'අ.පො.ස. සාමාන්‍ය පෙළ 1 වන වසර (G.C.E. O/L Year 1)' },
  { grade: 11, nameSinhala: '11 ශ්‍රේණිය', nameEnglish: 'Grade 11 (O/L Exam)', stage: 'O/L', description: 'අ.පො.ස. සාමාන්‍ය පෙළ විභාග වසර (G.C.E. O/L Final Year)' },
  { grade: 12, nameSinhala: '12 ශ්‍රේණිය', nameEnglish: 'Grade 12 (A/L)', stage: 'A/L', description: 'අ.පො.ස. උසස් පෙළ 1 වන වසර (G.C.E. A/L Year 1)' },
  { grade: 13, nameSinhala: '13 ශ්‍රේණිය', nameEnglish: 'Grade 13 (A/L Exam)', stage: 'A/L', description: 'අ.පො.ස. උසස් පෙළ විභාග වසර (G.C.E. A/L Final Year)' },
];

export const SUBJECTS_DATA: Subject[] = [
  // ==========================================
  // GRADE 5 SCHOLARSHIP CURRICULUM (5 වසර ශිෂ්‍යත්වය)
  // National Institute of Education (NIE) Sri Lanka
  // ==========================================
  {
    id: 'sub_sch_sinhala',
    titleSinhala: 'සිංහල භාෂාව හා සාහිත්‍යය (Sinhala)',
    titleEnglish: 'Sinhala Language & Reading',
    code: 'SCH-SIN-01',
    stream: 'Grade 5 Scholarship',
    grades: [5],
    category: 'Scholarship Core',
    guruPothaReference: 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනය (NIE) • 5 ශ්‍රේණිය ශිෂ්‍යත්ව විෂය නිර්දේශය',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-rose-500',
    description: 'ව්‍යාකරණ, නිවැරදි අක්ෂර වින්‍යාසය (ණ/න, ළ/ල, ශ/ෂ/ස), සමාන පද, විරුද්ධ පද, යුගල පද සහ ඡේද කියවා තේරුම් ගැනීමේ විනෝදජනක අභ්‍යාස.',
    totalModules: 12,
    completedModules: 9,
    units: [
      {
        id: 'u_sch_sin_1',
        unitNumber: 1,
        title: 'Sinhala Grammar & Word Magic (ව්‍යාකරණ හා නිවැරදි වචන)',
        titleSinhala: 'නාමපද, ක්‍රියාපද සහ නිවැරදි අක්ෂර වින්‍යාසය',
        durationMinutes: 90,
        lessons: [
          {
            id: 'l_sch_sin_1',
            title: 'Nouns, Verbs & Gender in Sinhala (නාම, ක්‍රියා සහ ලිංග භේදය)',
            titleSinhala: 'පුරුෂ ලිංග, ස්ත්‍රී ලිංග සහ නාමපද හඳුනාගනිමු',
            duration: '25 mins',
            summary: 'නාමපද සහ ක්‍රියාපද අතර ගැලපීම, ප්‍රාණවාචී හා අප්‍රාණවාචී නාමපද.',
            keyPoints: ['එක වචන සහ බහු වචන', 'පුරුෂ ලිංග (මුවා) -> ස්ත්‍රී ලිංග (දෙන)', 'ක්‍රියාපද අග (යි / හ / ත්) ගැලපීම'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_sch_sin_1',
                question: 'Select the correct opposite word for "ආලෝකය" (Light):',
                questionSinhala: '"ආලෝකය" යන වචනයේ විරුද්ධ පදය කුමක්ද?',
                options: ['අන්ධකාරය (Darkness)', 'එළිය', 'දීප්තිය', 'පැහැය'],
                correctIndex: 0,
                explanation: 'ආලෝකය යන වචනයේ සෘජු විරුද්ධ පදය "අන්ධකාරය" වේ.'
              },
              {
                id: 'q_sch_sin_2',
                question: 'Which is the correctly spelled Sinhala word for "School"?',
                questionSinhala: 'පහත සඳහන් වචන අතුරින් නිවැරදි අක්ෂර වින්‍යාසය සහිත වචනය තෝරන්න:',
                options: ['පාසල', 'පාසළ', 'පාසලා', 'පාශල'],
                correctIndex: 0,
                explanation: 'පාසල යන්නෙහි නිවැරදි අකුර වන්නේ දන්තජ "ල" අකුරයි.'
              }
            ]
          },
          {
            id: 'l_sch_sin_2',
            title: 'Synonyms & Idioms (සමාන පද සහ ප්‍රස්ථාව පිරුළු)',
            titleSinhala: 'සමාන පද සහ ප්‍රස්ථාව පිරුළු තේරුම් ගනිමු',
            duration: '30 mins',
            summary: 'විභාගයට නිතර එන සමාන පද, යුගල පද හා ප්‍රස්ථාව පිරුළු.',
            keyPoints: ['හිරු = සූර්යයා, දිනකර, භානු', 'සඳ = චන්ද්‍රයා, නිශාකර', 'ගස = වෘක්ෂය, තුරු'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      {
        id: 'sch_pp_sin_2025',
        title: 'Grade 5 Scholarship Sinhala Model Paper 2025',
        year: 2025,
        paperType: 'Model',
        medium: 'Sinhala',
        downloadUrl: '/mock/scholarship/2025_sinhala_model.pdf'
      }
    ]
  },
  {
    id: 'sub_sch_maths',
    titleSinhala: 'ගණිතය (Mathematics)',
    titleEnglish: 'Primary Mathematics & Word Problems',
    code: 'SCH-MAT-02',
    stream: 'Grade 5 Scholarship',
    grades: [5],
    category: 'Scholarship Core',
    guruPothaReference: 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනය (NIE) • 5 ශ්‍රේණිය ගණිත විෂය නිර්දේශය',
    iconName: 'Calculator',
    color: 'from-blue-500 to-indigo-600',
    description: 'ස්ථානීය අගය, ගුණ කිරීම, බෙදීම, භාග, මුදල්, දිග, බර, කාලය සහ ශිෂ්‍යත්ව විභාගයේ සුවිශේෂී ගැටලු විසඳීමේ කෙටි ක්‍රම.',
    totalModules: 14,
    completedModules: 10,
    units: [
      {
        id: 'u_sch_mat_1',
        unitNumber: 1,
        title: 'Numbers, Patterns & Calculations (සංඛ්‍යා රටා සහ ගණනය)',
        titleSinhala: 'සංඛ්‍යා රටා, ස්ථානීය අගය සහ සරල ගැටලු',
        durationMinutes: 100,
        lessons: [
          {
            id: 'l_sch_mat_1',
            title: 'Number Patterns & Quick Multiplications',
            titleSinhala: 'සංඛ්‍යා රටා සහ ගුණ කිරීමේ සරල උපක්‍රම',
            duration: '30 mins',
            summary: 'සංඛ්‍යා රටාවල ඊළඟ පදය සෙවීම, 5 න් සහ 10 න් ගුණ කිරීම.',
            keyPoints: ['ඔත්තේ සහ ඉරට්ටේ සංඛ්‍යා', 'ත්‍රිකෝණ සංඛ්‍යා (1, 3, 6, 10, 15)', 'සමචතුරස්‍ර සංඛ්‍යා (1, 4, 9, 16, 25)'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_sch_mat_1',
                question: 'What is the next number in sequence: 2, 4, 8, 16, ...?',
                questionSinhala: '2, 4, 8, 16, ... රටාවේ ඊළඟට එන සංඛ්‍යාව කුමක්ද?',
                options: ['32', '24', '20', '30'],
                correctIndex: 0,
                explanation: 'සෑම සංඛ්‍යාවක්ම 2 න් ගුණ වෙමින් ඉදිරියට යයි (16 x 2 = 32).'
              },
              {
                id: 'q_sch_mat_2',
                question: 'If 3 pencils cost Rs. 60, how much do 5 pencils cost?',
                questionSinhala: 'පැන්සල් 3 ක මිල රුපියල් 60 කි. එවැනි පැන්සල් 5 ක මිල කීයද?',
                options: ['රුපියල් 100', 'රුපියල් 80', 'රුපියල් 90', 'රුපියල් 120'],
                correctIndex: 0,
                explanation: 'එක් පැන්සලක මිල = 60 / 3 = රු. 20. පැන්සල් 5 ක මිල = 20 x 5 = රුපියල් 100 කි.'
              }
            ]
          }
        ]
      }
    ],
    pastPapers: [
      {
        id: 'sch_pp_mat_2025',
        title: 'Grade 5 Scholarship Maths & Logic Paper 2025',
        year: 2025,
        paperType: 'Model',
        medium: 'Sinhala',
        downloadUrl: '/mock/scholarship/2025_maths_model.pdf'
      }
    ]
  },
  {
    id: 'sub_sch_env',
    titleSinhala: 'පරිසරය ආශ්‍රිත ක්‍රියාකාරකම් (Environmental Studies)',
    titleEnglish: 'Environmental Studies & Science',
    code: 'SCH-ENV-03',
    stream: 'Grade 5 Scholarship',
    grades: [5],
    category: 'Scholarship Core',
    guruPothaReference: 'ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනය (NIE) • 5 ශ්‍රේණිය පරිසරය',
    iconName: 'Compass',
    color: 'from-emerald-500 to-teal-600',
    description: 'ශාක හා සත්ත්ව ලෝකය, කාලගුණය, ජලය, සෞඛ්‍යය, ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාන, ඉතිහාසය, ප්‍රවාහනය සහ අපේ සංස්කෘතිය.',
    totalModules: 15,
    completedModules: 11,
    units: [
      {
        id: 'u_sch_env_1',
        unitNumber: 1,
        title: 'Living World & Nature (ජීවී ලෝකය සහ සොබාදහම)',
        titleSinhala: 'ශාක, සතුන් සහ ස්වභාවික සම්පත්',
        durationMinutes: 90,
        lessons: [
          {
            id: 'l_sch_env_1',
            title: 'Plants, Animals & Sri Lankan Heritage',
            titleSinhala: 'ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය, පුෂ්පය සහ සත්ත්ව අනුවර්තන',
            duration: '25 mins',
            summary: 'ශ්‍රී ලංකාවේ ජාතික සංකේත, සතුන්ගේ ආහාර පුරුදු සහ ශාක කොටස්.',
            keyPoints: ['ජාතික වෘක්ෂය: නා ගස (Na Tree)', 'ජාතික පුෂ්පය: නිල් මහනෙල් (Blue Water Lily)', 'ජාතික පක්ෂියා: ශ්‍රී ලංකා වලි කුකුළා (Ceylon Junglefowl)'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_sch_env_1',
                question: 'What is the National Tree of Sri Lanka?',
                questionSinhala: 'ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය වන්නේ කුමක්ද?',
                options: ['නා ගස (Na Tree)', 'බෝ ගස', 'කොස් ගස', 'තල් ගස'],
                correctIndex: 0,
                explanation: 'ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය "නා ගස" (Mesua ferrea) වේ.'
              }
            ]
          }
        ]
      }
    ],
    pastPapers: [
      {
        id: 'sch_pp_env_2025',
        title: 'Grade 5 Scholarship Environment Model Paper 2025',
        year: 2025,
        paperType: 'Model',
        medium: 'Sinhala',
        downloadUrl: '/mock/scholarship/2025_environment_model.pdf'
      }
    ]
  },
  {
    id: 'sub_sch_iq',
    titleSinhala: 'බුද්ධි පරීක්ෂණය සහ තර්කනය (IQ & Reasoning)',
    titleEnglish: 'Scholarship Paper 1 - IQ & Reasoning',
    code: 'SCH-IQ-04',
    stream: 'Grade 5 Scholarship',
    grades: [5],
    category: 'Scholarship Core',
    guruPothaReference: 'ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුව • 5 ශ්‍රේණිය ශිෂ්‍යත්ව I පත්‍රය',
    iconName: 'Sparkles',
    color: 'from-purple-500 to-pink-600',
    description: 'රූප රටා, කැට ගණන් කිරීම, කඩදාසි නැමීම්, තාර්කික සබඳතා, කාල ගණනය සහ ශිෂ්‍යත්ව I පත්‍රයේ ඉහළම ලකුණු ගැනීමේ රහස් ක්‍රම.',
    totalModules: 16,
    completedModules: 12,
    units: [
      {
        id: 'u_sch_iq_1',
        unitNumber: 1,
        title: 'Visual Patterns & Spatial Reasoning (රූප රටා සහ කැට)',
        titleSinhala: 'රූප රටා, අනුරූප රූප සහ ඝන වස්තු',
        durationMinutes: 110,
        lessons: [
          {
            id: 'l_sch_iq_1',
            title: 'Shape Counting & Symmetry (කැට ගණන් කිරීම සහ සමමිතිය)',
            titleSinhala: 'කැට ගණන් කිරීම සහ දර්පණ ප්‍රතිබිම්බ',
            duration: '35 mins',
            summary: 'සැඟවුණු කැට ගණන් කිරීම සහ දර්පණයක පෙනෙන රූප හඳුනාගැනීම.',
            keyPoints: ['තට්ටු ක්‍රමය (Layer method) මඟින් කැට ගණන් කිරීම', 'දර්පණයක වම සහ දකුණ මාරු වීම', 'කඩදාසි නැමූ විට කැපුම් විවෘත වන ආකාරය'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_sch_iq_1',
                question: 'Which object will look exactly identical in a mirror reflection?',
                questionSinhala: 'පහත සඳහන් අකුරු අතුරින් කණ්ණාඩියකින් බැලූ විටත් නොවෙනස්ව පෙනෙන අකුර කුමක්ද?',
                options: ['A', 'B', 'P', 'R'],
                correctIndex: 0,
                explanation: 'A අකුර සිරස් අක්ෂය වටා සමමිතික බැවින් කණ්ණාඩිය තුළදීත් "A" ලෙසම දිස්වේ.'
              }
            ]
          }
        ]
      }
    ],
    pastPapers: [
      {
        id: 'sch_pp_iq_2025',
        title: 'Grade 5 Scholarship Paper 1 (IQ) Model Paper 2025',
        year: 2025,
        paperType: 'Model',
        medium: 'Sinhala',
        downloadUrl: '/mock/scholarship/2025_iq_model.pdf'
      }
    ]
  },
  // ==========================================
  // O/L & JUNIOR CURRICULUM (Grades 6 - 11)
  // Sri Lankan National Curriculum / Guru Potha
  // ==========================================
  {
    id: 'sub_ol_science',
    titleSinhala: 'විද්‍යාව (Science)',
    titleEnglish: 'Science',
    code: 'OL-SCI-01',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශය • අධ්‍යාපන ප්‍රකාශන දෙපාර්තමේන්තුව',
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    description: 'ජීවී ලෝකය, පදාර්ථය සහ එහි වෙනස්වීම්, ශක්තිය සහ එහි යෙදීම්, පෘථිවිය හා අභ්‍යවකාශය පිළිබඳ සම්පූර්ණ විද්‍යා පාඩම් මාලාව.',
    totalModules: 20,
    completedModules: 14,
    units: [
      {
        id: 'u_ol_sci_1',
        unitNumber: 1,
        title: 'Chemical Reactions & Matter (රසායනික ප්‍රතික්‍රියා)',
        titleSinhala: 'රසායනික ප්‍රතික්‍රියා සහ පදාර්ථයේ ව්‍යුහය',
        durationMinutes: 240,
        lessons: [
          {
            id: 'l_ol_sci_1',
            title: 'Types of Chemical Reactions & Equations',
            titleSinhala: 'රසායනික ප්‍රතික්‍රියා වර්ග සහ තුලිත කිරීම',
            duration: '40 mins',
            summary: 'සංයෝජන, වියෝජන, ඒකීය විස්ථාපන සහ ද්විත්ව විස්ථාපන ප්‍රතික්‍රියා තුලනය කිරීම.',
            keyPoints: ['ස්කන්ධ සංස්ථිති නියමය', 'ප්‍රතික්‍රියක සහ ඵල තුලිත සමීකරණ', 'තාපදායක සහ තාප අවශෝෂක ප්‍රතික්‍රියා'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_ol_sci_1',
                question: 'What type of reaction is: 2Mg + O2 -> 2MgO ?',
                questionSinhala: '2Mg + O2 -> 2MgO යනු කුමන වර්ගයේ රසායනික ප්‍රතික්‍රියාවක්ද?',
                options: ['සංයෝජන ප්‍රතික්‍රියාවක් (Combination)', 'වියෝජන ප්‍රතික්‍රියාවක් (Decomposition)', 'විස්ථාපන ප්‍රතික්‍රියාවක් (Displacement)', 'උදාසීනීකරණයක් (Neutralization)'],
                correctIndex: 0,
                explanation: 'මූලද්‍රව්‍ය දෙකක් එකතු වී තනි ඵලයක් සාදන බැවින් මෙය සංයෝජන (Combination) ප්‍රතික්‍රියාවකි.'
              }
            ]
          },
          {
            id: 'l_ol_sci_2',
            title: 'Acids, Bases & Salts (අම්ල, භස්ම හා ලවණ)',
            titleSinhala: 'අම්ල, භස්ම සහ pH අගය මැනීම',
            duration: '45 mins',
            summary: 'pH පරිමාණය, දර්ශක (ලිට්මස්, ෆීනෝල්ෆ්තැලීන්, මෙතිල් ඔරේන්ජ්) සහ උදාසීනීකරණය.',
            keyPoints: ['pH < 7 අම්ල, pH = 7 උදාසීන, pH > 7 භස්ම', 'අම්ල + භස්ම -> ලවණ + ජලය'],
            isCompleted: true
          }
        ]
      },
      {
        id: 'u_ol_sci_2',
        unitNumber: 2,
        title: 'Forces & Newton\'s Laws (බලය සහ චලිතය)',
        titleSinhala: 'බලය, පීඩනය සහ නිව්ටන්ගේ නියම',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_ol_sci_3',
            title: 'Newton\'s Laws of Motion (නිව්ටන් නියම)',
            titleSinhala: 'නිව්ටන්ගේ චලිත නියම 3 සහ F = ma සමීකරණය',
            duration: '50 mins',
            summary: 'නිව්ටන්ගේ 1, 2, 3 වන චලිත නියම, ගම්‍යතාව සහ ආවේගය පිළිබඳ විභාග ගැටලු.',
            keyPoints: ['F = ma සමීකරණ භාවිතය', 'ක්‍රියාව සහ ප්‍රතික්‍රියාව සමාන හා ප්‍රතිවිරුද්ධය'],
            isCompleted: false
          }
        ]
      },
      {
        id: 'u_ol_sci_3',
        unitNumber: 3,
        title: 'Genetics & Reproduction (ප්‍රවේණිය සහ ප්‍රජනනය)',
        titleSinhala: 'මානව ප්‍රජනන පද්ධතිය සහ ප්‍රවේණිය',
        durationMinutes: 260,
        lessons: [
          {
            id: 'l_ol_sci_4',
            title: 'Mendelian Genetics & Punnett Squares in O/L',
            titleSinhala: 'මෙන්ඩල්ගේ පරම්පරා හා ඒකමුහුම් අභිජනනය',
            duration: '45 mins',
            summary: 'ප්‍රමුඛ සහ නිලීන ලක්ෂණ, ෆීනෝටයිපික සහ ජෙනෝටයිපික අනුපාත (3:1 සහ 1:2:1).',
            keyPoints: ['ක්‍රෝමසෝම 46 (යුගල් 23)', 'XY ලිංගික ක්‍රෝමසෝම'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olsci_2024', subjectId: 'sub_ol_science', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' },
      { id: 'p_olsci_2023', subjectId: 'sub_ol_science', year: 2023, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' },
      { id: 'p_olsci_2022', subjectId: 'sub_ol_science', year: 2022, part: 'Full Paper', medium: 'English', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_maths',
    titleSinhala: 'ගණිතය (Mathematics)',
    titleEnglish: 'Mathematics',
    code: 'OL-MATH-02',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශය • ගුරු මාර්ගෝපදේශ සංග්‍රහය',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-700',
    description: 'අංක ගණිතය, වීජ ගණිතය, ජ්‍යාමිතිය (ප්‍රමේය 28), ත්‍රිකෝණමිතිය, සංඛ්‍යානය සහ සම්භාවිතාව.',
    totalModules: 22,
    completedModules: 16,
    units: [
      {
        id: 'u_ol_math_1',
        unitNumber: 1,
        title: 'Algebra & Quadratic Equations (වීජ ගණිතය)',
        titleSinhala: 'වර්ගජ සමීකරණ සහ සාධක සෙවීම',
        durationMinutes: 300,
        lessons: [
          {
            id: 'l_ol_math_1',
            title: 'Solving Quadratic Equations by Factorization & Formula',
            titleSinhala: 'වර්ගජ සමීකරණ සූත්‍රයෙන් හා සාධක මඟින් විසඳීම',
            duration: '45 mins',
            summary: 'ax^2 + bx + c = 0 සමීකරණ සඳහා x = [-b ± √(b^2 - 4ac)] / 2a සූත්‍රය භාවිතය.',
            keyPoints: ['සාධක වෙන් කිරීමේ කෙටි ක්‍රම', 'වර්ග පූර්ණ ක්‍රමය', 'සමගාමී සමීකරණ'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_ol_math_1',
                question: 'What are the roots of x^2 - 5x + 6 = 0 ?',
                questionSinhala: 'x^2 - 5x + 6 = 0 සමීකරණයේ මූල මොනවාද?',
                options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = -1 or x = -6'],
                correctIndex: 0,
                explanation: '(x - 2)(x - 3) = 0 බැවින් x = 2 හෝ x = 3 වේ.'
              }
            ]
          }
        ]
      },
      {
        id: 'u_ol_math_2',
        unitNumber: 2,
        title: 'Circle Geometry Theorems (වෘත්ත ප්‍රමේය)',
        titleSinhala: 'වෘත්ත ජ්‍යාමිතිය සහ කෝණ ප්‍රමේය',
        durationMinutes: 320,
        lessons: [
          {
            id: 'l_ol_math_2',
            title: 'Angles in Alternate Segments & Cyclic Quadrilaterals',
            titleSinhala: 'චක්‍රීය චතුරස්‍ර සහ ස්පර්ශක ප්‍රමේය',
            duration: '50 mins',
            summary: 'චක්‍රීය චතුරස්‍රයක සම්මුඛ කෝණවල ඓක්‍යය 180° වීම, ඒකාන්තර ඛණ්ඩයේ කෝණ.',
            keyPoints: ['කේන්ද්‍ර කෝණය පරිධි කෝණය මෙන් දෙගුණයකි', 'චක්‍රීය චතුරස්‍ර සම්මුඛ කෝණ = 180°'],
            isCompleted: true
          }
        ]
      },
      {
        id: 'u_ol_math_3',
        unitNumber: 3,
        title: 'Trigonometry & Bearings (ත්‍රිකෝණමිතිය හා දිශානති)',
        titleSinhala: 'ත්‍රිකෝණමිතිය, ආරෝහණ/අවරෝහණ කෝණ',
        durationMinutes: 260,
        lessons: [
          {
            id: 'l_ol_math_3',
            title: 'Sin, Cos, Tan ratios and 3-Figure Bearings',
            titleSinhala: 'sin, cos, tan අනුපාත සහ ත්‍රිකෝණමිතික ගැටලු',
            duration: '45 mins',
            summary: 'සෘජුකෝණී ත්‍රිකෝණවල sin, cos, tan අර්ථ දැක්වීම සහ ප්‍රායෝගික උස හා දුර සෙවීම.',
            keyPoints: ['sin = සම්මුඛ / කර්ණය', 'cos = බද්ධ / කර්ණය', 'tan = සම්මුඛ / බද්ධ'],
            isCompleted: false
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olmath_2024', subjectId: 'sub_ol_maths', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' },
      { id: 'p_olmath_2023', subjectId: 'sub_ol_maths', year: 2023, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_history',
    titleSinhala: 'ඉතිහාසය (History)',
    titleEnglish: 'History',
    code: 'OL-HIST-03',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'ශ්‍රී ලංකා ඉතිහාසය • ජාතික අධ්‍යාපන ආයතනය (NIE)',
    iconName: 'Landmark',
    color: 'from-amber-600 to-yellow-700',
    description: 'පැරණි ශ්‍රී ලාංකේය රාජධානි (අනුරාධපුර, පොළොන්නරුව, යාපහුව, මහනුවර), වාරි ශිෂ්ටාචාරය, යටත්විජිත යුගය සහ නිදහස් සටන.',
    totalModules: 16,
    completedModules: 10,
    units: [
      {
        id: 'u_ol_hist_1',
        unitNumber: 1,
        title: 'Ancient Hydraulic Civilization (වාරි ශිෂ්ටාචාරය)',
        titleSinhala: 'පැරණි ශ්‍රී ලංකාවේ වාරි කර්මාන්තය සහ තාක්ෂණය',
        durationMinutes: 220,
        lessons: [
          {
            id: 'l_ol_hist_1',
            title: 'Great Reservoir Construction: Bisokotuwa & Ralapanawa',
            titleSinhala: 'මහාවැව්, බිසෝකොටුව, සොරොව්ව සහ රළපනාව',
            duration: '40 mins',
            summary: 'ධාතුසේන, පරාක්‍රමබාහු, මහසෙන් රජවරුන්ගේ වාරි නිර්මාණ සහ ජල කළමනාකරණය.',
            keyPoints: ['බිසෝකොටුවේ ජල පීඩනය පාලනය කිරීමේ තාක්ෂණය', 'යෝධ ඇළේ බැස්ම (සැතපුමකට අඟලක්)'],
            isCompleted: true
          }
        ]
      },
      {
        id: 'u_ol_hist_2',
        unitNumber: 2,
        title: 'Resistance against Colonial Rule (නිදහස් අරගලය)',
        titleSinhala: '1818 සහ 1848 නිදහස් අරගල සහ ජාතික නායකයෝ',
        durationMinutes: 240,
        lessons: [
          {
            id: 'l_ol_hist_2',
            title: '1818 Uva Wellassa Rebellion & 1848 Matale Uprising',
            titleSinhala: '1818 ඌව වෙල්ලස්ස කැරැල්ල සහ වීර කැප්පෙටිපොළ',
            duration: '45 mins',
            summary: 'උඩරට ගිවිසුම, බ්‍රිතාන්‍ය ආධිපත්‍යයට එරෙහි ජනතා නැගිටීම් සහ ප්‍රතිඵල.',
            keyPoints: ['කැප්පෙටිපොළ නිලමේගේ නායකත්වය', 'පුරන් අප්පු සහ ගොන්ගාලේගොඩ බණ්ඩා'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olhist_2024', subjectId: 'sub_ol_history', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_sinhala',
    titleSinhala: 'සිංහල භාෂාව හා සාහිත්‍යය',
    titleEnglish: 'Sinhala Language & Literature',
    code: 'OL-SIN-04',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'අධ්‍යාපන ප්‍රකාශන දෙපාර්තමේන්තුව • සිංහල සාහිත්‍ය සංග්‍රහය',
    iconName: 'BookMarked',
    color: 'from-rose-600 to-red-700',
    description: 'සිංහල ව්‍යාකරණ (සන්ධි, සමාස, ක්‍රියා පද, අක්ෂර වින්‍යාසය), සම්භාව්‍ය සාහිත්‍යය (ගුත්තිලය, කාව්‍යශේඛරය, සද්ධර්මරත්නාවලිය), රචනා හා විචාර.',
    totalModules: 18,
    completedModules: 12,
    units: [
      {
        id: 'u_ol_sin_1',
        unitNumber: 1,
        title: 'Sinhala Grammar & Syntax (සිංහල ව්‍යාකරණ)',
        titleSinhala: 'සන්ධි, සමාස සහ උක්ත ආඛ්‍යාත පද සම්බන්ධය',
        durationMinutes: 240,
        lessons: [
          {
            id: 'l_ol_sin_1',
            title: 'Sandhi Rules: Swara, Vyanjana & Lopaya',
            titleSinhala: 'ස්වර සන්ධි, ව්‍යඤ්ජන සන්ධි සහ ලෝප සන්ධි',
            duration: '40 mins',
            summary: 'වචන එකතු වීමේදී සිදුවන ශබ්ද වෙනස්වීම්, සන්ධි කිරීම හා විසන්ධි කිරීම.',
            keyPoints: ['ස්වර සන්ධි (දෙව + ඉන්ද්‍ර = දේවේන්ද්‍ර)', 'ලෝප සන්ධි (ගුරු + උතුමා = ගුරුතුමා)'],
            isCompleted: true
          }
        ]
      },
      {
        id: 'u_ol_sin_2',
        unitNumber: 2,
        title: 'Classical Poetry Appreciation (පද්‍ය විචාරය)',
        titleSinhala: 'ගුත්තිල කාව්‍යය සහ හංස සන්දේශය රසවින්දනය',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_ol_sin_2',
            title: 'Guttilaya: Music Contest with Moosila',
            titleSinhala: 'ගුත්තිල - මූසිල වීණා වාදන තරගය හා කාව්‍යාලංකාර',
            duration: '45 mins',
            summary: 'වෑත්තෑවේ හිමියන්ගේ කාව්‍ය ප්‍රතිභාව, උපමා රූපක සහ ධ්වනි ගුණය.',
            keyPoints: ['ගුරු ගෞරවය හා කෘතවේදීත්වය', 'ශබ්ද ධ්වනිය හා විරිත්'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olsin_2024', subjectId: 'sub_ol_sinhala', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_buddhism',
    titleSinhala: 'බුද්ධ ධර්මය (Buddhism)',
    titleEnglish: 'Buddhism',
    code: 'OL-BUD-05',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'බුද්ධ ධර්මය ගුරු මාර්ගෝපදේශය • ජාතික අධ්‍යාපන ආයතනය',
    iconName: 'SunMedium',
    color: 'from-orange-600 to-amber-700',
    description: 'බුද්ධ චරිතය, ධර්ම කරුණු (චතුරාර්ය සත්‍ය, ආර්ය අෂ්ටාංගික මාර්ගය, පටිච්චසමුප්පාදය), ශාසන ඉතිහාසය සහ බෞද්ධ සදාචාරය.',
    totalModules: 14,
    completedModules: 9,
    units: [
      {
        id: 'u_ol_bud_1',
        unitNumber: 1,
        title: 'Core Doctrines (මූලික බුදු දහම)',
        titleSinhala: 'චතුරාර්ය සත්‍යය සහ ත්‍රිලක්ෂණය',
        durationMinutes: 220,
        lessons: [
          {
            id: 'l_ol_bud_1',
            title: 'The Four Noble Truths & Noble Eightfold Path',
            titleSinhala: 'චතුරාර්ය සත්‍යය සහ ආර්ය අෂ්ටාංගික මාර්ගය',
            duration: '40 mins',
            summary: 'දුක්ඛ, සමුදය, නිරෝධ, මාර්ග සත්‍යයන් සහ ශීල, සමාධි, ප්‍රඥා ත්‍රිශික්ෂාව.',
            keyPoints: ['දුක නැති කිරීමේ ප්‍රායෝගික මඟ', 'මධ්‍යම ප්‍රතිපදාව'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olbud_2024', subjectId: 'sub_ol_buddhism', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_english',
    titleSinhala: 'ඉංග්‍රීසි භාෂාව (English Language)',
    titleEnglish: 'English Language (O/L)',
    code: 'OL-ENG-06',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Core O/L',
    guruPothaReference: 'National English Language Curriculum • Ministry of Education',
    iconName: 'Languages',
    color: 'from-cyan-600 to-blue-700',
    description: 'Grammar (Tenses, Active/Passive voice, Reported Speech), Reading Comprehension, Formal Letters, Essay Writing, Dialogue, and Vocabulary Building.',
    totalModules: 18,
    completedModules: 13,
    units: [
      {
        id: 'u_ol_eng_1',
        unitNumber: 1,
        title: 'Grammar Mastery & Sentence Structures',
        titleSinhala: 'Tenses, Active & Passive Voice',
        durationMinutes: 240,
        lessons: [
          {
            id: 'l_ol_eng_1',
            title: 'Active to Passive Voice Transformation Rules',
            titleSinhala: 'Active Voice සිට Passive Voice දක්වා පරිවර්තනය',
            duration: '40 mins',
            summary: 'Subject-verb-object inversions, auxiliary verb adjustments across present, past, and future tenses.',
            keyPoints: ['Subject becomes object with by-phrase', 'Past participle (V3) is mandatory'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_oleng_2024', subjectId: 'sub_ol_english', year: 2024, part: 'Full Paper', medium: 'English', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_ict',
    titleSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (O/L ICT)',
    titleEnglish: 'Information & Communication Tech (O/L)',
    code: 'OL-ICT-07',
    stream: 'General O/L',
    grades: [10, 11],
    category: 'Basket O/L',
    guruPothaReference: 'අ.පො.ස. සාමාන්‍ය පෙළ ICT විෂය නිර්දේශය',
    iconName: 'Laptop',
    color: 'from-violet-600 to-purple-700',
    description: 'පරිගණක පද්ධති, දෘඩාංග, මෘදුකාංග, Scratch සහ Python ක්‍රමලේඛනය, වෙබ් නිර්මාණය (HTML), දත්ත සමුදාය (Database MS Access).',
    totalModules: 12,
    completedModules: 8,
    units: [
      {
        id: 'u_ol_ict_1',
        unitNumber: 1,
        title: 'Programming & Logic (Scratch & Python)',
        titleSinhala: 'Scratch සහ පයිතන් මූලික ක්‍රමලේඛනය',
        durationMinutes: 250,
        lessons: [
          {
            id: 'l_ol_ict_1',
            title: 'Loops, Conditions & Variables in Python',
            titleSinhala: 'පයිතන් ලූප, කොන්දේසි ප්‍රකාශන සහ විචල්‍ය',
            duration: '45 mins',
            summary: 'for loops, while loops, if-elif-else තීරණ ව්‍යුහ සහ සරල ගැටලු විසඳීම.',
            keyPoints: ['Sequential, Selection, Iteration පාලන ව්‍යුහ', 'Syntax & indentation'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olict_2024', subjectId: 'sub_ol_ict', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_commerce',
    titleSinhala: 'ව්‍යාපාර හා ගිණුම්කරණ අධ්‍යයනය (O/L Commerce)',
    titleEnglish: 'Business & Accounting Studies (O/L)',
    code: 'OL-COM-08',
    stream: 'General O/L',
    grades: [10, 11],
    category: 'Basket O/L',
    guruPothaReference: 'අ.පො.ස. සාමාන්‍ය පෙළ වාණිජ විෂය නිර්දේශය',
    iconName: 'BarChart3',
    color: 'from-teal-600 to-emerald-700',
    description: 'ද්විත්ව සටහන් මූලධර්ම, මූලික පොත්, ශේෂ පත්‍රය, වෙළඳ හා ලාභාලාභ ගිණුම්, බැංකු කටයුතු, ව්‍යාපාර පරිසරය.',
    totalModules: 14,
    completedModules: 9,
    units: [
      {
        id: 'u_ol_com_1',
        unitNumber: 1,
        title: 'Double Entry & Ledger Accounts (ද්විත්ව සටහන්)',
        titleSinhala: 'ද්විත්ව සටහන් මූලධර්මය සහ ලෙජර් ගිණුම්',
        durationMinutes: 260,
        lessons: [
          {
            id: 'l_ol_com_1',
            title: 'Assets = Capital + Liabilities (ගිණුම්කරණ සමීකරණය)',
            titleSinhala: 'ගිණුම්කරණ සමීකරණය සහ හර බැර නීති',
            duration: '45 mins',
            summary: 'වත්කම් = හිමිකම + වගකීම් සමීකරණය, මුදල් පොත සහ සුළු මුදල් පොත.',
            keyPoints: ['වත්කම් වැඩිවීම හර (Dr), අඩුවීම බැර (Cr)', 'ආදායම් බැර, වියදම් හර'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olcom_2024', subjectId: 'sub_ol_commerce', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ol_geography',
    titleSinhala: 'භූගෝල විද්‍යාව (Geography)',
    titleEnglish: 'Geography',
    code: 'OL-GEO-09',
    stream: 'General O/L',
    grades: [6, 7, 8, 9, 10, 11],
    category: 'Basket O/L',
    guruPothaReference: 'ශ්‍රී ලංකා භූගෝල විද්‍යාව විෂය නිර්දේශය',
    iconName: 'Globe2',
    color: 'from-lime-600 to-green-700',
    description: 'ශ්‍රී ලංකාවේ හා ලෝකයේ පිහිටීම, භූගෝලීය ලක්ෂණ, දේශගුණය, ජලවහන පද්ධති, කෘෂිකර්මය සහ 1:50,000 භූවිෂමතා සිතියම් කියවීම.',
    totalModules: 12,
    completedModules: 7,
    units: [
      {
        id: 'u_ol_geo_1',
        unitNumber: 1,
        title: 'Topographic Map Reading & Sri Lanka Drainage',
        titleSinhala: '1:50,000 භූවිෂමතා සිතියම් කියවීම',
        durationMinutes: 220,
        lessons: [
          {
            id: 'l_ol_geo_1',
            title: 'Contours, Grids & Sri Lanka River Basins',
            titleSinhala: 'සමෝච්ච රේඛා සහ ප්‍රධාන ගංගා නිම්න',
            duration: '40 mins',
            summary: 'මහවැලි, කැළණි, කළු, වලවේ ගංගා පද්ධති සහ සිතියම් සලකුණු හඳුනාගැනීම.',
            keyPoints: ['සමෝච්ච රේඛා ලක්ෂණ (කඳු, බෑවුම්, නිම්න)', 'සම්මත සංකේත'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_olgeo_2024', subjectId: 'sub_ol_geography', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  // ==========================================
  // A/L CURRICULUM (Grades 12 - 13)
  // G.C.E. Advanced Level - Ministry of Education
  // ==========================================
  {
    id: 'sub_maths',
    titleSinhala: 'සංයුක්ත ගණිතය (Combined Maths)',
    titleEnglish: 'Combined Mathematics',
    code: 'AL-MATH-01',
    stream: 'Physical Science (Maths)',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ සංයුක්ත ගණිතය විෂය නිර්දේශය',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600',
    description: 'Pure Mathematics (Algebra, Trigonometry, Calculus, Matrices) and Applied Mathematics (Statics, Dynamics, Vectors, Probability).',
    totalModules: 18,
    completedModules: 11,
    units: [
      {
        id: 'u_diff',
        unitNumber: 1,
        title: 'Differentiation & Applications (අවකලනය)',
        titleSinhala: 'අවකලනය සහ භාවිත',
        durationMinutes: 320,
        lessons: [
          {
            id: 'l_diff_1',
            title: 'First Principles & Fundamental Derivatives',
            titleSinhala: 'මූලධර්මයෙන් අවකලනය',
            duration: '45 mins',
            summary: 'Understanding limits, definition of derivative dy/dx = lim h->0 [f(x+h) - f(x)]/h.',
            keyPoints: ['Product Rule: d/dx[uv] = u v\' + v u\'', 'Quotient Rule: d/dx[u/v] = (v u\' - u v\') / v^2', 'Chain Rule'],
            isCompleted: true
          }
        ]
      },
      {
        id: 'u_int',
        unitNumber: 2,
        title: 'Integration & Definite Integrals (අනුකලනය)',
        titleSinhala: 'අනුකලනය',
        durationMinutes: 400,
        lessons: [
          {
            id: 'l_int_1',
            title: 'Integration by Substitution & Parts',
            titleSinhala: 'ආදේශයෙන් හා කොටස් වශයෙන් අනුකලනය',
            duration: '50 mins',
            summary: 'Techniques for solving standard A/L integration essay questions.',
            keyPoints: ['Trigonometric substitutions: x = a sin θ, x = a tan θ', 'Integration by parts ∫ u v\' dx = uv - ∫ v u\' dx'],
            isCompleted: false
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_cm_2024', subjectId: 'sub_maths', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' },
      { id: 'p_cm_2023', subjectId: 'sub_maths', year: 2023, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_physics',
    titleSinhala: 'භෞතික විද්‍යාව (Physics)',
    titleEnglish: 'Physics',
    code: 'AL-PHYS-02',
    stream: 'Physical Science (Maths)',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ භෞතික විද්‍යාව සම්පත් පොත',
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600',
    description: 'Mechanics, Waves & Vibrations, Optics, Thermal Physics, Fields, Electricity, Electronics, and Modern Radiation Physics.',
    totalModules: 14,
    completedModules: 9,
    units: [
      {
        id: 'u_phy_mech',
        unitNumber: 1,
        title: 'Mechanics & Hydrostatics (යාන්ත්‍ර විද්‍යාව)',
        titleSinhala: 'යාන්ත්‍ර විද්‍යාව',
        durationMinutes: 300,
        lessons: [
          {
            id: 'l_phy_rot',
            title: 'Rotational Dynamics & Moment of Inertia',
            titleSinhala: 'ඝූර්ණ චලිතය සහ අවස්ථිති ඝූර්ණය',
            duration: '40 mins',
            summary: 'Torque τ = Iα, Angular momentum conservation L = Iω.',
            keyPoints: ['Parallel axis theorem: I = I_cm + Md^2', 'Rotational kinetic energy: E_k = 1/2 I ω^2'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_phy_2024', subjectId: 'sub_physics', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' },
      { id: 'p_phy_2023', subjectId: 'sub_physics', year: 2023, part: 'Part I (MCQ)', medium: 'English', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_chemistry',
    titleSinhala: 'රසායන විද්‍යාව (Chemistry)',
    titleEnglish: 'Chemistry',
    code: 'AL-CHEM-03',
    stream: 'Physical Science (Maths)',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ රසායන විද්‍යාව සම්පත් පොත (NIE)',
    iconName: 'FlaskConical',
    color: 'from-emerald-500 to-teal-600',
    description: 'Atomic structure, Chemical Bonding, Inorganic Chemistry (s, p, d blocks), Organic Chemistry mechanisms, Physical & Environmental Chemistry.',
    totalModules: 16,
    completedModules: 10,
    units: [
      {
        id: 'u_chem_org',
        unitNumber: 1,
        title: 'Organic Chemistry Reactions & Mechanisms',
        titleSinhala: 'කාබනික රසායනය',
        durationMinutes: 450,
        lessons: [
          {
            id: 'l_chem_mech',
            title: 'SN1, SN2, E1, E2 Reaction Pathways',
            titleSinhala: 'SN1 සහ SN2 ප්‍රතික්‍රියා යාන්ත්‍රණ',
            duration: '50 mins',
            summary: 'Carbocation intermediates, solvent polarity effects, stereochemical inversion (Walden inversion).',
            keyPoints: ['SN2 involves single-step concerted inversion', 'SN1 goes via planar carbocation with racemization'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_chem_2024', subjectId: 'sub_chemistry', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_biology',
    titleSinhala: 'ජීව විද්‍යාව (Biology)',
    titleEnglish: 'Biology',
    code: 'AL-BIO-04',
    stream: 'Biological Science (Bio)',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ජීව විද්‍යාව සම්පත් පොත (Resource Book)',
    iconName: 'Dna',
    color: 'from-green-600 to-emerald-700',
    description: 'Cell biology, Plant Physiology, Animal Physiology, Genetics, Molecular Biology, Recombinant DNA technology, Ecology.',
    totalModules: 15,
    completedModules: 8,
    units: [
      {
        id: 'u_bio_gen',
        unitNumber: 1,
        title: 'Molecular Genetics & DNA Replication',
        titleSinhala: 'අණුක ප්‍රවේණිය',
        durationMinutes: 360,
        lessons: [
          {
            id: 'l_bio_rep',
            title: 'DNA Replication Mechanism & Polymerase Enzymes',
            titleSinhala: 'DNA ප්‍රතිවලිත වීම',
            duration: '50 mins',
            summary: 'Helicase unzipping, leading & lagging strand synthesis, Okazaki fragments and DNA ligase.',
            keyPoints: ['Direction of synthesis 5\' to 3\'', 'Semi-conservative replication'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_bio_2024', subjectId: 'sub_biology', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_ict',
    titleSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (A/L ICT)',
    titleEnglish: 'Information & Communication Tech (ICT)',
    code: 'AL-ICT-05',
    stream: 'Technology',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ICT විෂය නිර්දේශය',
    iconName: 'Laptop',
    color: 'from-cyan-600 to-blue-700',
    description: 'Data representation, Digital Logic, Computer Architecture, Networking, Database Systems, Python Programming, Web Technologies.',
    totalModules: 14,
    completedModules: 11,
    units: [
      {
        id: 'u_ict_prog',
        unitNumber: 1,
        title: 'Python Algorithms & Data Structures',
        titleSinhala: 'පයිතන් ක්‍රමලේඛනය',
        durationMinutes: 300,
        lessons: [
          {
            id: 'l_ict_py',
            title: 'Recursive Functions & File Handling',
            titleSinhala: 'පුනරාවර්තන ශ්‍රිත',
            duration: '45 mins',
            summary: 'Base case, recursion stack, reading CSV and text files.',
            keyPoints: ['Stack overflow prevention', 'with open() context management'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_ict_2024', subjectId: 'sub_ict', year: 2024, part: 'Full Paper', medium: 'English', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_accounting',
    titleSinhala: 'ගිණුම්කරණය (Accounting)',
    titleEnglish: 'Accounting',
    code: 'AL-ACC-06',
    stream: 'Commerce',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ගිණුම්කරණය විෂය නිර්දේශය (LKAS/SLFRS)',
    iconName: 'BarChart3',
    color: 'from-purple-600 to-indigo-700',
    description: 'Financial accounting standards (LKAS/SLFRS), Partnership Accounts, Manufacturing, Company Final Accounts, Cash Flow, Cost & Management Accounting.',
    totalModules: 14,
    completedModules: 7,
    units: [
      {
        id: 'u_acc_comp',
        unitNumber: 1,
        title: 'Company Final Accounts (සමාගම් අවසන් ගිණුම්)',
        titleSinhala: 'සමාගම් අවසන් ගිණුම්',
        durationMinutes: 380,
        lessons: [
          {
            id: 'l_acc_fin',
            title: 'Statement of Comprehensive Income and Financial Position',
            titleSinhala: 'මූල්‍ය තත්ත්ව ප්‍රකාශනය',
            duration: '55 mins',
            summary: 'Adhering to LKAS 1 formatting, debentures, share issue reserves.',
            keyPoints: ['Retained earnings calculation', 'Dividend distributions'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_acc_2024', subjectId: 'sub_accounting', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_bs',
    titleSinhala: 'ව්‍යාපාර අධ්‍යයනය (Business Studies)',
    titleEnglish: 'Business Studies',
    code: 'AL-BS-07',
    stream: 'Commerce',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ව්‍යාපාර අධ්‍යයනය විෂය නිර්දේශය',
    iconName: 'Briefcase',
    color: 'from-pink-600 to-rose-700',
    description: 'ව්‍යාපාර පසුබිම, ව්‍යාපාර කළමනාකරණය, මානව සම්පත්, අලෙවිකරණය, මූල්‍යකරණය සහ ව්‍යවසායකත්වය.',
    totalModules: 12,
    completedModules: 6,
    units: [
      {
        id: 'u_bs_mgt',
        unitNumber: 1,
        title: 'Principles of Management & Strategic Planning',
        titleSinhala: 'කළමනාකරණ මූලධර්ම සහ සැලසුම්කරණය',
        durationMinutes: 300,
        lessons: [
          {
            id: 'l_bs_mgt_1',
            title: 'Henri Fayol\'s 14 Principles of Management',
            titleSinhala: 'හෙන්රි ෆෙයෝල්ගේ කළමනාකරණ මූලධර්ම 14',
            duration: '45 mins',
            summary: 'ශ්‍රම විභජනය, ආඥා ඒකීයත්වය, විනය සහ අධිකාරීත්වය.',
            keyPoints: ['Unity of command vs unity of direction', 'Scalar chain'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_bs_2024', subjectId: 'sub_bs', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_econ',
    titleSinhala: 'ආර්ථික විද්‍යාව (Economics)',
    titleEnglish: 'Economics',
    code: 'AL-ECON-08',
    stream: 'Commerce',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ආර්ථික විද්‍යාව සම්පත් පොත',
    iconName: 'TrendingUp',
    color: 'from-teal-600 to-cyan-700',
    description: 'ක්ෂුද්‍ර ආර්ථික විද්‍යාව (ඉල්ලුම/සැපයුම, වෙළඳපොළ ව්‍යුහ) සහ සාර්ව ආර්ථික විද්‍යාව (දළ දේශීය නිෂ්පාදිතය, උද්ධමනය, මූල්‍ය ප්‍රතිපත්ති).',
    totalModules: 14,
    completedModules: 8,
    units: [
      {
        id: 'u_econ_macro',
        unitNumber: 1,
        title: 'Macroeconomic Equilibrium & Fiscal Policy',
        titleSinhala: 'සාර්ව ආර්ථික සමතුලිතතාව සහ මූල්‍ය ප්‍රතිපත්තිය',
        durationMinutes: 320,
        lessons: [
          {
            id: 'l_econ_gdp',
            title: 'GDP Calculations & Central Bank Monetary Tools',
            titleSinhala: 'දළ දේශීය නිෂ්පාදිතය (GDP) සහ මහ බැංකු ප්‍රතිපත්ති',
            duration: '50 mins',
            summary: 'නිෂ්පාදන, ආදායම්, සහ වියදම් ප්‍රවේශ මඟින් GDP ගණනය කිරීම.',
            keyPoints: ['GDP = C + I + G + (X - M)', 'නීතිප්‍රකාර සංචිත අනුපාතය (SRR)'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_econ_2024', subjectId: 'sub_econ', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_et',
    titleSinhala: 'ඉංජිනේරු තාක්ෂණවේදය (ET)',
    titleEnglish: 'Engineering Technology',
    code: 'AL-ET-09',
    stream: 'Technology',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ ඉංජිනේරු තාක්ෂණවේදය විෂය නිර්දේශය',
    iconName: 'Wrench',
    color: 'from-amber-600 to-orange-700',
    description: 'සිවිල් ඉංජිනේරු, යාන්ත්‍රික ඉංජිනේරු, විදුලි හා ඉලෙක්ට්‍රොනික තාක්ෂණය, ඔටෝමොබයිල් තාක්ෂණය සහ තාක්ෂණික ඇඳීම.',
    totalModules: 15,
    completedModules: 7,
    units: [
      {
        id: 'u_et_civil',
        unitNumber: 1,
        title: 'Civil Construction & Building Materials',
        titleSinhala: 'ගොඩනැගිලි තාක්ෂණය සහ කොන්ක්‍රීට් මිශ්‍රණ',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_et_conc',
            title: 'Concrete Slump Test & Reinforced Concrete Design',
            titleSinhala: 'කොන්ක්‍රීට් ඇනවුම, අවපාත පරීක්ෂාව සහ ශක්තිමත් කිරීම',
            duration: '45 mins',
            summary: 'සිමෙන්ති, වැලි, ගල් අනුපාත (1:2:4), ජල-සිමෙන්ති අනුපාතය සහ සම්පීඩ්‍යතා ශක්තිය.',
            keyPoints: ['ස්ලම්ප් කෝන් පරීක්ෂාව', 'යකඩ කම්බි ස්ථානගත කිරීමේ ප්‍රමිත'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_et_2024', subjectId: 'sub_et', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_sft',
    titleSinhala: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    titleEnglish: 'Science for Technology',
    code: 'AL-SFT-10',
    stream: 'Technology',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ SFT සම්පත් පොත',
    iconName: 'Cpu',
    color: 'from-blue-600 to-cyan-700',
    description: 'භෞතික විද්‍යාත්මක සංකල්ප, රසායනික මූලධර්ම, ජෛව පද්ධති, පරිගණක ගණිතය සහ සංඛ්‍යානය.',
    totalModules: 14,
    completedModules: 9,
    units: [
      {
        id: 'u_sft_elec',
        unitNumber: 1,
        title: 'Applied Electricity & Electronics',
        titleSinhala: 'ප්‍රායෝගික විද්‍යුතය සහ සංවේදක',
        durationMinutes: 290,
        lessons: [
          {
            id: 'l_sft_trans',
            title: 'Transistors, Op-Amps & Automation Sensors',
            titleSinhala: 'ට්‍රාන්සිස්ටර, LDR, තාප සංවේදක හා සරල ස්වයංක්‍රීය පරිපථ',
            duration: '45 mins',
            summary: 'NPN ට්‍රාන්සිස්ටර ස්විචයක් ලෙස භාවිතය, විභව බෙදුම් පරිපථ.',
            keyPoints: ['V_be = 0.7V සිලිකන් සක්‍රීය වෝල්ටීයතාව', 'ප්‍රතිදාන ධාරාව I_c = β * I_b'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_sft_2024', subjectId: 'sub_sft', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_art_sinhala',
    titleSinhala: 'සිංහල (A/L Sinhala)',
    titleEnglish: 'Sinhala (Arts Stream)',
    code: 'AL-SIN-11',
    stream: 'Arts',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ සිංහල විෂය නිර්දේශය',
    iconName: 'BookOpen',
    color: 'from-red-600 to-rose-700',
    description: 'සම්භාව්‍ය හා නූතන සිංහල ගද්‍ය හා පද්‍ය සාහිත්‍යය, නාට්‍ය, කාව්‍ය න්‍යාය (රස වාදය, ධ්වනි වාදය) සහ වාග්විද්‍යාව.',
    totalModules: 12,
    completedModules: 7,
    units: [
      {
        id: 'u_art_sin_1',
        unitNumber: 1,
        title: 'Classical Prose & Sanskrit Poetics',
        titleSinhala: 'සම්භාව්‍ය ගද්‍ය සාහිත්‍යය සහ රස වාදය',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_art_sin_1',
            title: 'Buthsarana & Amavatura Literary Analysis',
            titleSinhala: 'බුත්සරණ සහ අමාවතුර කෘතිවල භාෂා ශෛලිය',
            duration: '45 mins',
            summary: 'විද්‍යාචක්‍රවර්තීන්ගේ භක්ති රසය හා ගුරුළුගෝමීන්ගේ සරල ශෛලිය විචාරය කිරීම.',
            keyPoints: ['භක්ති කාව්‍ය ලක්ෂණ', 'සංස්කෘත තත්සම හා තද්භව පද භාවිතය'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_artsin_2024', subjectId: 'sub_art_sinhala', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_art_media',
    titleSinhala: 'ජනසන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    titleEnglish: 'Media & Communication Studies',
    code: 'AL-MED-12',
    stream: 'Arts',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ මාධ්‍ය අධ්‍යයනය විෂය නිර්දේශය',
    iconName: 'Tv',
    color: 'from-indigo-600 to-purple-700',
    description: 'සන්නිවේදන ආකෘති, ජනමාධ්‍ය (පුවත්පත්, ගුවන්විදුලිය, රූපවාහිනිය, ඩිජිටල් මාධ්‍ය), මාධ්‍ය ආචාරධර්ම සහ සිනමා විචාරය.',
    totalModules: 12,
    completedModules: 8,
    units: [
      {
        id: 'u_med_1',
        unitNumber: 1,
        title: 'Communication Models & Mass Media Ethics',
        titleSinhala: 'සන්නිවේදන ආකෘති සහ මාධ්‍ය ආචාරධර්ම',
        durationMinutes: 260,
        lessons: [
          {
            id: 'l_med_1',
            title: 'Lasswell, Shannon-Weaver & Berlo\'s SMCR Model',
            titleSinhala: 'ලැස්වෙල්, ෂැනන්-වීවර් සහ බර්ලෝගේ SMCR ආකෘති',
            duration: '45 mins',
            summary: 'ප්‍රභවය, පණිවිඩය, නාලිකාව, ග්‍රාහකයා සහ ප්‍රතිපෝෂණය.',
            keyPoints: ['රේඛීය හා චක්‍රීය ආකෘති', 'ශබ්ද බාධක (Noise)'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_med_2024', subjectId: 'sub_art_media', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_art_pol',
    titleSinhala: 'දේශපාලන විද්‍යාව (Political Science)',
    titleEnglish: 'Political Science',
    code: 'AL-POL-13',
    stream: 'Arts',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ දේශපාලන විද්‍යාව විෂය නිර්දේශය',
    iconName: 'Scale',
    color: 'from-blue-700 to-slate-800',
    description: 'රාජ්‍ය සංකල්පය, ආණ්ඩුක්‍රම ව්‍යවස්ථා, ශ්‍රී ලංකාවේ ආණ්ඩුක්‍රම පරිණාමය (1978 ව්‍යවස්ථාව), ප්‍රජාතන්ත්‍රවාදය, මානව හිමිකම් සහ ජාත්‍යන්තර සබඳතා.',
    totalModules: 14,
    completedModules: 8,
    units: [
      {
        id: 'u_pol_1',
        unitNumber: 1,
        title: 'State Concepts & Sri Lankan Constitution',
        titleSinhala: 'රාජ්‍යයේ මූලද්‍රව්‍ය සහ 1978 ආණ්ඩුක්‍රම ව්‍යවස්ථාව',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_pol_1',
            title: 'Executive Presidency, Parliament & Judiciary in SL',
            titleSinhala: 'විධායක ජනාධිපති ක්‍රමය සහ බලතල බෙදීමේ න්‍යාය',
            duration: '45 mins',
            summary: 'විධායකය, ව්‍යවස්ථාදායකය සහ අධිකරණය අතර තුලන හා සංවරණ.',
            keyPoints: ['මොන්ටෙස්කියුගේ බලතල බෙදීමේ න්‍යාය', 'පාර්ලිමේන්තු ප්‍රජාතන්ත්‍රවාදය'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_pol_2024', subjectId: 'sub_art_pol', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  {
    id: 'sub_art_bc',
    titleSinhala: 'බෞද්ධ ශිෂ්ටාචාරය (Buddhist Culture)',
    titleEnglish: 'Buddhist Culture',
    code: 'AL-BC-14',
    stream: 'Arts',
    grades: [12, 13],
    category: 'A/L Stream',
    guruPothaReference: 'අ.පො.ස. උසස් පෙළ බෞද්ධ ශිෂ්ටාචාරය විෂය නිර්දේශය',
    iconName: 'Flower2',
    color: 'from-amber-600 to-yellow-600',
    description: 'භාරතීය ආගමික පසුබිම, බෞද්ධ සමාජ දේශපාලන හා ආර්ථික දර්ශනය, බෞද්ධ කලාව, ගෘහ නිර්මාණ ශිල්පය (සඳකඩපහණ, මුරගල්, ස්තූප).',
    totalModules: 12,
    completedModules: 7,
    units: [
      {
        id: 'u_bc_1',
        unitNumber: 1,
        title: 'Buddhist Art, Stupas & Moonstones (සඳකඩපහණ)',
        titleSinhala: 'බෞද්ධ කලාව, ස්තූප නිර්මාණය සහ සඳකඩපහණ පරිණාමය',
        durationMinutes: 270,
        lessons: [
          {
            id: 'l_bc_1',
            title: 'Anuradhapura vs Polonnaruwa Moonstones & Symbolism',
            titleSinhala: 'අනුරාධපුර සහ පොළොන්නරු සඳකඩපහණ සංසන්දනය',
            duration: '45 mins',
            summary: 'පරණවිතාන මතය (සංසාර චක්‍රය), සතුන් සිව්දෙනා සහ සංකේතාත්මක අර්ථ.',
            keyPoints: ['පොළොන්නරු සඳකඩපහණෙන් ගවයා ඉවත් කිරීම', 'ලියවැල, හංස පේළිය සහ ගිනි දැල් මෝස්තරය'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_bc_2024', subjectId: 'sub_art_bc', year: 2024, part: 'Full Paper', medium: 'Sinhala', pdfUrl: '#' }
    ]
  },

  // ==========================================
  // UNIVERSITY & UNDERGRADUATE CURRICULUM
  // ==========================================
  {
    id: 'sub_uni_dsa',
    titleSinhala: 'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම (Data Structures & Algorithms)',
    titleEnglish: 'Data Structures & Algorithms (CS/SE)',
    code: 'UNI-CS-201',
    stream: 'Higher Education',
    grades: [],
    category: 'A/L Stream',
    guruPothaReference: 'Undergraduate Computer Science & Software Engineering Core Curriculum',
    iconName: 'Terminal',
    color: 'from-blue-600 to-indigo-700',
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting algorithms, Dynamic Programming, and Asymptotic Complexity (Big-O analysis).',
    totalModules: 12,
    completedModules: 7,
    units: [
      {
        id: 'u_uni_dsa_1',
        unitNumber: 1,
        title: 'Binary Search Trees & Tree Traversals',
        titleSinhala: 'ද්විමය සෙවුම් ගස් සහ ගස් සැරිසැරීම (In-order, Pre-order, Post-order)',
        durationMinutes: 300,
        lessons: [
          {
            id: 'l_uni_dsa_1',
            title: 'BST Insertion, Deletion & AVL Rotations',
            titleSinhala: 'BST ඇතුළත් කිරීම්, මකාදැමීම් සහ AVL සමතුලිත කිරීම',
            duration: '50 mins',
            summary: 'Left-Right rotations in self-balancing binary search trees (AVL Trees) to guarantee O(log N) operations.',
            keyPoints: ['Balance factor = height(left) - height(right)', 'Tree rotations maintain in-order traversal property'],
            isCompleted: true,
            quiz: [
              {
                id: 'q_uni_dsa_1',
                question: 'What is the worst-case time complexity of searching an unbalanced Binary Search Tree of N nodes?',
                questionSinhala: 'N ගැට සංඛ්‍යාවක් සහිත අසමතුලිත BST ගසක සෙවීමේ උපරිම කාල සංකීර්ණතාව (Worst-case time complexity) කුමක්ද?',
                options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
                correctIndex: 1,
                explanation: 'අසමතුලිත BST ගසක් තනි දාමයක් (skewed tree / linked list) බවට පත් විය හැකි බැවින් worst case කාලය O(N) වේ.'
              }
            ]
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_unidsa_2024', subjectId: 'sub_uni_dsa', year: 2024, part: 'Full Paper', medium: 'English', pdfUrl: '#' },
      { id: 'p_unidsa_2023', subjectId: 'sub_uni_dsa', year: 2023, part: 'Full Paper', medium: 'English', pdfUrl: '#' }
    ]
  },
  {
    id: 'sub_uni_finmgt',
    titleSinhala: 'මූල්‍ය කළමනාකරණය & ආයෝජන විශ්ලේෂණය',
    titleEnglish: 'Corporate Finance & Investment Analysis',
    code: 'UNI-MGT-301',
    stream: 'Higher Education',
    grades: [],
    category: 'A/L Stream',
    guruPothaReference: 'Undergraduate Faculty of Management & Finance Syllabus',
    iconName: 'Briefcase',
    color: 'from-amber-600 to-emerald-700',
    description: 'Capital budgeting (NPV, IRR), Cost of Capital (WACC), Capital Asset Pricing Model (CAPM), and Portfolio Optimization.',
    totalModules: 10,
    completedModules: 5,
    units: [
      {
        id: 'u_uni_fin_1',
        unitNumber: 1,
        title: 'Capital Budgeting & Net Present Value (NPV)',
        titleSinhala: 'ප්‍රාග්ධන අයවැයකරණය සහ ශුද්ධ වර්තමාන අගය (NPV)',
        durationMinutes: 280,
        lessons: [
          {
            id: 'l_uni_fin_1',
            title: 'Discounted Cash Flow (DCF) & Internal Rate of Return (IRR)',
            titleSinhala: 'වට්ටම් කළ මුදල් ප්‍රවාහ (DCF) සහ අභ්‍යන්තර ප්‍රතිලාභ අනුපාතය (IRR)',
            duration: '45 mins',
            summary: 'Evaluating capital investment projects using time value of money, discounted cash flows, and cost of capital.',
            keyPoints: ['Accept project if NPV > 0', 'IRR is the discount rate where NPV equals zero'],
            isCompleted: true
          }
        ]
      }
    ],
    pastPapers: [
      { id: 'p_unifin_2024', subjectId: 'sub_uni_finmgt', year: 2024, part: 'Full Paper', medium: 'English', pdfUrl: '#' }
    ]
  }
];

export const CAMPUS_COURSES_DATA: CampusCourse[] = [
  {
    id: 'c_mora_eng',
    universityName: 'University of Moratuwa',
    universityShort: 'UoM',
    courseName: 'B.Sc. Engineering (Honours)',
    streamRequired: 'Physical Science (Maths)',
    durationYears: 4,
    degreeType: 'B.Sc. Eng (Hons)',
    districtCutoffs: {
      Colombo: 1.9421,
      Gampaha: 1.9214,
      Kalutara: 1.8894,
      Kandy: 1.8951,
      Galle: 1.8742,
      Matara: 1.8541,
      Kurunegala: 1.8624,
      Jaffna: 1.8845,
      Anuradhapura: 1.7421,
      Badulla: 1.7124
    },
    averageZScore: 1.895,
    intakeCapacity: 980,
    careerProspects: ['Software Architect', 'Civil Engineer', 'Electrical & Electronic Engineer', 'Mechanical Engineer', 'AI/Data Engineer'],
    description: 'Premier engineering faculty in Sri Lanka with IESL and Washington Accord accreditation.',
    logo: '🏛️',
    isStateUni: true
  },
  {
    id: 'c_col_med',
    universityName: 'University of Colombo',
    universityShort: 'UoC',
    courseName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
    streamRequired: 'Biological Science (Bio)',
    durationYears: 5,
    degreeType: 'MBBS',
    districtCutoffs: {
      Colombo: 2.1245,
      Gampaha: 2.0841,
      Kalutara: 2.0412,
      Kandy: 2.0514,
      Galle: 2.0315,
      Matara: 2.0112,
      Kurunegala: 2.0245,
      Jaffna: 2.0912,
      Ratnapura: 1.9412
    },
    averageZScore: 2.062,
    intakeCapacity: 250,
    careerProspects: ['Medical Doctor', 'Surgeon', 'Consultant Physician', 'Medical Researcher'],
    description: 'The oldest medical faculty in Sri Lanka, producing world-class medical doctors with SLMC & WHO recognition.',
    logo: '🩺',
    isStateUni: true
  },
  {
    id: 'c_sjp_mgt',
    universityName: 'University of Sri Jayewardenepura',
    universityShort: 'USJ',
    courseName: 'B.Sc. Business Administration / Finance (Honours)',
    streamRequired: 'Commerce',
    durationYears: 4,
    degreeType: 'B.Com / B.BA',
    districtCutoffs: {
      Colombo: 1.8412,
      Gampaha: 1.8124,
      Kalutara: 1.7845,
      Kandy: 1.7941,
      Galle: 1.7612,
      Kurunegala: 1.7745
    },
    averageZScore: 1.794,
    intakeCapacity: 1450,
    careerProspects: ['Investment Banker', 'Chartered Accountant', 'Financial Analyst', 'Corporate CEO'],
    description: 'The leading management faculty in South Asia known as "The Center of Excellence in Management Education".',
    logo: '💼',
    isStateUni: true
  },
  {
    id: 'c_kel_arts',
    universityName: 'University of Kelaniya',
    universityShort: 'UoK',
    courseName: 'B.A. Mass Communication & Digital Media (Honours)',
    streamRequired: 'Arts',
    durationYears: 4,
    degreeType: 'B.A. (Hons)',
    districtCutoffs: {
      Colombo: 1.5621,
      Gampaha: 1.5412,
      Kandy: 1.4821,
      Galle: 1.4651
    },
    averageZScore: 1.52,
    intakeCapacity: 350,
    careerProspects: ['Journalist', 'Television Director', 'Corporate Public Relations Specialist', 'Digital Content Strategist'],
    description: 'Leading humanities and mass communication faculty in Sri Lanka with modern media production labs.',
    logo: '🎭',
    isStateUni: true
  },
  {
    id: 'c_mora_tech',
    universityName: 'University of Moratuwa',
    universityShort: 'UoM Tech',
    courseName: 'Bachelor of Technology (B.Tech Honours)',
    streamRequired: 'Technology',
    durationYears: 4,
    degreeType: 'B.Tech',
    districtCutoffs: {
      Colombo: 1.7215,
      Gampaha: 1.6984,
      Kurunegala: 1.6541,
      Kandy: 1.6712
    },
    averageZScore: 1.685,
    intakeCapacity: 450,
    careerProspects: ['Robotics Engineer', 'Automation Specialist', 'Mechatronics Technologist', 'Renewable Energy Consultant'],
    description: 'Dedicated technology faculty offering cutting-edge engineering and instrumentation specializations.',
    logo: '⚙️',
    isStateUni: true
  }
];

export const NEWS_ARTICLES_DATA: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'National School Curriculum & Guru Potha Digital Resources Synchronized',
    titleSinhala: 'ජාතික පාසල් විෂය මාලාව හා ගුරු මාර්ගෝපදේශ ඩිජිටල්කරණය සිදුකෙරේ',
    source: 'Ministry of Education',
    publishedDate: '2026-08-20',
    category: 'Syllabus Update',
    summary: 'Department of Educational Publications releases updated online supplementary materials for Grades 6 through 13 covering all streams.',
    fullContent: 'Official announcement ensuring that all secondary and advanced level students receive standardized textbook coverage and model questions.',
    isUrgent: true
  },
  {
    id: 'news_2',
    title: 'G.C.E. O/L and A/L Examination Practical Tests & Timetable Updates',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ සහ උසස් පෙළ විභාග කාලසටහන නිවේදනය කෙරේ',
    source: 'Department of Examinations',
    publishedDate: '2026-08-18',
    category: 'Exam Notice',
    summary: 'The Department of Examinations has released the official timetable guidelines for school and private candidates.',
    fullContent: 'Online candidate admission downloads are active on doenets.lk with district centers categorized for both O/L and A/L tracks.',
    isUrgent: true
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc_1',
    subject: 'Combined Mathematics',
    topic: 'Trigonometry',
    front: 'sin(A + B) + sin(A - B) = ?',
    back: '2 sin A cos B',
    difficulty: 'Easy'
  },
  {
    id: 'fc_ol_1',
    subject: 'Science (O/L)',
    topic: 'Physics / Mechanics',
    front: 'Newton\'s Second Law Formula (නිව්ටන් දෙවන නියමය)',
    back: 'F = ma  (බලය = ස්කන්ධය x ත්වරණය)',
    difficulty: 'Easy'
  },
  {
    id: 'fc_ol_2',
    subject: 'Mathematics (O/L)',
    topic: 'Algebra',
    front: 'Quadratic Formula to find roots of ax² + bx + c = 0',
    back: 'x = [-b ± √(b² - 4ac)] / 2a',
    difficulty: 'Medium'
  },
  {
    id: 'fc_3',
    subject: 'Physics (A/L)',
    topic: 'Electromagnetism',
    front: 'Magnetic flux density inside an ideal solenoid',
    back: 'B = μ₀ * n * I  (where n = N / L is turns per unit length)',
    difficulty: 'Medium'
  }
];

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 't_1',
    title: 'Complete Guru Potha Science / Maths Unit Exercise',
    subject: 'Core Subject',
    durationMinutes: 45,
    isCompleted: true,
    priority: 'High',
    date: 'Today'
  },
  {
    id: 't_2',
    title: 'Watch Classroom Video Lecture and write short summary',
    subject: 'Classroom Video',
    durationMinutes: 40,
    isCompleted: false,
    priority: 'High',
    date: 'Today'
  },
  {
    id: 't_3',
    title: 'Solve Past Paper MCQ Questions (2020-2024)',
    subject: 'Past Papers',
    durationMinutes: 30,
    isCompleted: false,
    priority: 'Medium',
    date: 'Today'
  }
];

export const CLASSROOM_VIDEOS_DATA: ClassVideo[] = [
  // ==========================================
  // O/L & JUNIOR CLASSROOM VIDEOS (Grades 6 - 11)
  // ==========================================
  {
    id: 'vid_ol_sci_01',
    subjectId: 'sub_ol_science',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සාමාන්‍ය පෙළ)',
    grade: 11,
    stream: 'General O/L',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Chemical Reactions & Equations (රසායනික ප්‍රතික්‍රියා)',
    unitTitleSinhala: 'රසායනික ප්‍රතික්‍රියා සහ සමීකරණ තුලනය',
    guruPothaUnit: '11 ශ්‍රේණිය විද්‍යාව ගුරු පොත • 01 වන පරිච්ඡේදය',
    title: 'Balancing Chemical Equations & Reaction Types with Sri Lankan O/L Past Paper Problems',
    titleSinhala: 'රසායනික සමීකරණ තුලිත කිරීම සහ සාමාන්‍ය පෙළ පසුගිය විභාග ගැටලු සාකච්ඡාව',
    teacherName: 'Kavinda Bandara (B.Sc.)',
    teacherTitle: 'National Institute of Education (NIE) Resource Person • Senior O/L Science Mentor',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    duration: '1h 15m',
    durationSeconds: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Master chemical equation balancing, understanding oxidation-reduction, displacement reactions, and structured essay question frameworks for O/L.',
    descriptionSinhala: 'රසායනික සමීකරණ තුලනය කිරීමේ කෙටි ක්‍රම, ඔක්සිකරණ-ඔක්සිහරණ ප්‍රතික්‍රියා සහ සාමාන්‍ය පෙළ ව්‍යුහගත ප්‍රශ්න පත්‍ර සාකච්ඡාව.',
    difficulty: 'Beginner',
    tags: ['O/L Science', 'Chemistry', 'Grade 11', 'Equation Balancing', 'Guru Potha'],
    chapters: [
      { id: 'ch_ol_s1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Law of Conservation of Mass & Symbols', titleSinhala: 'ස්කන්ධ සංස්ථිති නියමය සහ මූලද්‍රව්‍ය සංකේත' },
      { id: 'ch_ol_s1_2', timeSeconds: 900, timeFormatted: '15:00', title: 'Step-by-Step Balancing Method', titleSinhala: 'සමීකරණ තුලිත කිරීමේ සම්මත පියවර' },
      { id: 'ch_ol_s1_3', timeSeconds: 2400, timeFormatted: '40:00', title: 'O/L Past Paper Questions (2018-2023)', titleSinhala: 'පසුගිය විභාග ප්‍රශ්න පත්‍ර විවරණය' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_science_chemical_reactions.pdf',
    tuteTitle: 'Grade 11 Science Unit 01 Full Workbook & Tute',
    isCompleted: true,
    viewCount: 22400,
    rating: 4.96,
    totalRatings: 610
  },
  {
    id: 'vid_ol_sci_02',
    subjectId: 'sub_ol_science',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සාමාන්‍ය පෙළ)',
    grade: 10,
    stream: 'General O/L',
    classNumber: 2,
    unitNumber: 2,
    unitTitle: 'Newton\'s Laws of Motion & Pressure (බලය සහ පීඩනය)',
    unitTitleSinhala: 'නිව්ටන්ගේ චලිත නියම සහ F = ma සූත්‍රය',
    guruPothaUnit: '10 ශ්‍රේණිය විද්‍යාව ගුරු පොත • 06 වන පරිච්ඡේදය',
    title: 'Newton\'s Laws of Motion, F = ma Calculations & Everyday Physics Applications',
    titleSinhala: 'නිව්ටන්ගේ චලිත නියම 3, F = ma ගණනය කිරීම් සහ ප්‍රායෝගික යෙදීම්',
    teacherName: 'Kavinda Bandara (B.Sc.)',
    teacherTitle: 'National Institute of Education (NIE) Resource Person • Senior O/L Science Mentor',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    duration: '1h 20m',
    durationSeconds: 4800,
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Learn force, inertia, momentum, friction, and solve textbook model calculations for Grade 10 & 11 Science.',
    descriptionSinhala: 'බලය, අවස්ථිතිය, ගම්‍යතාව, ඝර්ෂණය සහ විභාග ගණනය කිරීම් විසඳන ආකාරය.',
    difficulty: 'Intermediate',
    tags: ['O/L Physics', 'Newton Laws', 'Grade 10', 'Force and Motion'],
    chapters: [
      { id: 'ch_ol_s2_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Newton First Law & Inertia', titleSinhala: 'නිව්ටන්ගේ 1 වන නියමය හා අවස්ථිතිය' },
      { id: 'ch_ol_s2_2', timeSeconds: 1200, timeFormatted: '20:00', title: 'F = ma and Acceleration Calculation', titleSinhala: 'F = ma සූත්‍රය භාවිතය' },
      { id: 'ch_ol_s2_3', timeSeconds: 3000, timeFormatted: '50:00', title: 'Action-Reaction Pairs & Pressure', titleSinhala: 'ක්‍රියාව හා ප්‍රතික්‍රියාව' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_physics_force.pdf',
    tuteTitle: 'Grade 10 Force & Newton Laws Master PDF',
    isCompleted: false,
    viewCount: 18900,
    rating: 4.93,
    totalRatings: 420
  },

  {
    id: 'vid_ol_math_01',
    subjectId: 'sub_ol_maths',
    subjectName: 'Mathematics (O/L)',
    subjectSinhala: 'ගණිතය (සාමාන්‍ය පෙළ)',
    grade: 11,
    stream: 'General O/L',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Quadratic Equations & Graphs (වර්ගජ සමීකරණ)',
    unitTitleSinhala: 'වර්ගජ සමීකරණ සහ ප්‍රස්ථාර අඳීම',
    guruPothaUnit: '11 ශ්‍රේණිය ගණිතය ගුරු පොත • 03 වන ඒකකය',
    title: 'Solving Quadratic Equations by Formula & Quadratic Functions Graph Sketching',
    titleSinhala: 'වර්ගජ සමීකරණ සූත්‍රයෙන් විසඳීම සහ වර්ගජ ශ්‍රිත ප්‍රස්ථාර ඇඳීම',
    teacherName: 'Prasanna Wickramasinghe',
    teacherTitle: 'B.Sc. (Mathematics) • 18+ Years O/L Island-Rank Mathematics Lecturer',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    duration: '1h 35m',
    durationSeconds: 5700,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Learn the quadratic formula x = [-b ± √(b^2-4ac)]/2a, completing the square, finding turning points of y = ax^2 + bx + c and scoring full 10 marks in O/L Paper II.',
    descriptionSinhala: 'වර්ගජ සූත්‍රය, වර්ග පූර්ණය, ප්‍රස්ථාරයේ හැරවුම් ලක්ෂ්‍යය හා සමමිතික අක්ෂය සොයා සාමාන්‍ය පෙළ II පත්‍රයේ සම්පූර්ණ ලකුණු ලබාගැනීම.',
    difficulty: 'Intermediate',
    tags: ['O/L Maths', 'Quadratic Equations', 'Graphs', 'Grade 11'],
    chapters: [
      { id: 'ch_ol_m1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Quadratic Equation Formula Derivation', titleSinhala: 'වර්ගජ සූත්‍රය ලබාගැනීම' },
      { id: 'ch_ol_m1_2', timeSeconds: 1500, timeFormatted: '25:00', title: 'Completing the Square Method', titleSinhala: 'වර්ග පූර්ණ ක්‍රමය' },
      { id: 'ch_ol_m1_3', timeSeconds: 3600, timeFormatted: '01:00:00', title: 'O/L Paper II Graph Problem Walkthrough', titleSinhala: 'ප්‍රස්ථාර ප්‍රශ්නයක් පියවරෙන් පියවර ඇඳීම' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_maths_quadratics.pdf',
    tuteTitle: 'O/L Quadratic Equations & Graphs Master Note',
    isCompleted: true,
    viewCount: 28900,
    rating: 4.98,
    totalRatings: 840
  },
  {
    id: 'vid_ol_math_02',
    subjectId: 'sub_ol_maths',
    subjectName: 'Mathematics (O/L)',
    subjectSinhala: 'ගණිතය (සාමාන්‍ය පෙළ)',
    grade: 11,
    stream: 'General O/L',
    classNumber: 2,
    unitNumber: 2,
    unitTitle: 'Circle Geometry & Tangent Theorems (ජ්‍යාමිතිය)',
    unitTitleSinhala: 'වෘත්ත ප්‍රමේය සහ ජ්‍යාමිතික සාධන',
    guruPothaUnit: '11 ශ්‍රේණිය ගණිතය ගුරු පොත • 12 වන ඒකකය',
    title: 'Circle Theorems, Angles in Alternate Segments & Writing Flawless Geometric Proofs',
    titleSinhala: 'වෘත්ත ප්‍රමේය, ස්පර්ශක ප්‍රමේය සහ ජ්‍යාමිතික සාධන නිවැරදිව ලිවීම',
    teacherName: 'Prasanna Wickramasinghe',
    teacherTitle: 'B.Sc. (Mathematics) • 18+ Years O/L Island-Rank Mathematics Lecturer',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    duration: '1h 45m',
    durationSeconds: 6300,
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Master the 28 school geometry theorems, cyclic quadrilaterals, tangent properties, and how to write mathematical reasons in exams.',
    descriptionSinhala: 'පාසල් විෂය මාලාවේ ජ්‍යාමිතික ප්‍රමේය, චක්‍රීය චතුරස්‍ර සහ සාධන නිවැරදි හේතු සහිතව ලියන ආකාරය.',
    difficulty: 'Advanced',
    tags: ['O/L Maths', 'Geometry', 'Theorems', 'Proof Methods'],
    chapters: [
      { id: 'ch_ol_m2_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Core Circle Theorems & Properties', titleSinhala: 'ප්‍රධාන වෘත්ත ප්‍රමේය' },
      { id: 'ch_ol_m2_2', timeSeconds: 1800, timeFormatted: '30:00', title: 'Cyclic Quadrilaterals & Tangents', titleSinhala: 'චක්‍රීය චතුරස්‍ර හා ස්පර්ශක' },
      { id: 'ch_ol_m2_3', timeSeconds: 4200, timeFormatted: '01:10:00', title: 'Model Essay Geometry Proof Step-by-Step', titleSinhala: 'ජ්‍යාමිතික සාධන ගැටලු 3ක් විසඳීම' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_geometry_theorems.pdf',
    tuteTitle: 'Geometry 28 Theorems Quick Reference Chart PDF',
    isCompleted: false,
    viewCount: 19400,
    rating: 4.95,
    totalRatings: 520
  },

  {
    id: 'vid_ol_hist_01',
    subjectId: 'sub_ol_history',
    subjectName: 'History (O/L)',
    subjectSinhala: 'ඉතිහාසය (සාමාන්‍ය පෙළ)',
    grade: 10,
    stream: 'General O/L',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Ancient Hydraulic Civilization (ශ්‍රී ලංකා වාරි ශිෂ්ටාචාරය)',
    unitTitleSinhala: 'පැරණි ශ්‍රී ලංකාවේ වාරි තාක්ෂණය හා වැව් ශිෂ්ටාචාරය',
    guruPothaUnit: '10 ශ්‍රේණිය ඉතිහාසය ගුරු පොත • 02 වන පරිච්ඡේදය',
    title: 'Hydraulic Engineering of Ancient Sri Lanka: Bisokotuwa, Yoda Ela, and Kings\' Irrigation Works',
    titleSinhala: 'පැරණි ශ්‍රී ලංකාවේ වාරි තාක්ෂණය: බිසෝකොටුව, යෝධ ඇළ සහ රජවරුන්ගේ වාරි මෙහෙවර',
    teacherName: 'Dr. Wasantha Bandara',
    teacherTitle: 'Senior History Scholar • National Curriculum Committee',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    duration: '1h 10m',
    durationSeconds: 4200,
    thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Detailed historical breakdown of Parakramabahu, Dhatusena, Mahasen irrigation systems, reservoir architecture, and map markings for O/L.',
    descriptionSinhala: 'මහසෙන්, ධාතුසේන, පරාක්‍රමබාහු රජවරුන්ගේ වාරි කර්මාන්ත, බිසෝකොටුව සහ සාමාන්‍ය පෙළ සිතියම් සලකුණු කිරීම.',
    difficulty: 'Beginner',
    tags: ['O/L History', 'Ancient Sri Lanka', 'Irrigation', 'Grade 10'],
    chapters: [
      { id: 'ch_ol_h1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Elements of Ancient Reservoirs', titleSinhala: 'මහාවැවක ප්‍රධාන අංග' },
      { id: 'ch_ol_h1_2', timeSeconds: 1200, timeFormatted: '20:00', title: 'Bisokotuwa & Sluice Valve Technology', titleSinhala: 'බිසෝකොටුවේ තාක්ෂණික විස්මිතය' },
      { id: 'ch_ol_h1_3', timeSeconds: 2700, timeFormatted: '45:00', title: 'Historical Maps Marking Session', titleSinhala: 'ඉතිහාස සිතියම් ලකුණු කිරීමේ පුහුණුව' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_history_irrigation.pdf',
    tuteTitle: 'Ancient Irrigation History Short Notes & Maps',
    isCompleted: true,
    viewCount: 15600,
    rating: 4.97,
    totalRatings: 380
  },

  {
    id: 'vid_ol_eng_01',
    subjectId: 'sub_ol_english',
    subjectName: 'English (O/L)',
    subjectSinhala: 'ඉංග්‍රීසි භාෂාව (සාමාන්‍ය පෙළ)',
    grade: 11,
    stream: 'General O/L',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Mastering English Grammar for O/L',
    unitTitleSinhala: 'Active & Passive Voice, Direct & Indirect Speech',
    guruPothaUnit: 'Grade 11 English Pupil\'s Book • Unit 04',
    title: 'Transforming Active to Passive Voice & Direct to Reported Speech for High Marks',
    titleSinhala: 'Active Voice සහ Reported Speech නිවැරදිව ලිවීම හා O/L විභාග පුහුණුව',
    teacherName: 'Mrs. Jayani Senanayake',
    teacherTitle: 'M.A. English (TESL) • Senior Examiner',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
    duration: '1h 15m',
    durationSeconds: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Sentence structures, punctuation, pronoun shifts, tense backshifting, and model question breakdowns.',
    descriptionSinhala: 'වාක්‍ය පරිවර්තනය, කාල භේදය (Tenses), විරාම ලක්ෂණ සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර විසඳීම.',
    difficulty: 'Intermediate',
    tags: ['O/L English', 'Grammar', 'Passive Voice', 'Reported Speech'],
    chapters: [
      { id: 'ch_ol_e1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Passive Voice Formula & Tense Rules', titleSinhala: 'Passive Voice සූත්‍ර සහ භාවිත' },
      { id: 'ch_ol_e1_2', timeSeconds: 1500, timeFormatted: '25:00', title: 'Reported Speech Backshifting Rules', titleSinhala: 'Reported Speech කාල පරිවර්තනය' },
      { id: 'ch_ol_e1_3', timeSeconds: 3000, timeFormatted: '50:00', title: 'Common Mistakes in O/L Paper I & II', titleSinhala: 'විභාගයේදී සිදුවන වැරදි සහ නිවැරදි කිරීම්' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ol_english_grammar.pdf',
    tuteTitle: 'O/L English Grammar Master Cheat Sheet PDF',
    isCompleted: false,
    viewCount: 14200,
    rating: 4.92,
    totalRatings: 310
  },

  // ==========================================
  // A/L CLASSROOM VIDEOS (Grades 12 - 13)
  // ==========================================
  {
    id: 'vid_math_01',
    subjectId: 'sub_maths',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    grade: 13,
    stream: 'Physical Science (Maths)',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Calculus & Differentiation (අවකලනය)',
    unitTitleSinhala: 'අවකලනය සහ භාවිත',
    guruPothaUnit: 'උසස් පෙළ සංයුක්ත ගණිතය • 01 වන ඒකකය',
    title: 'First Principles, Chain Rule, Product/Quotient Rules & Standard Derivatives',
    titleSinhala: 'මූලධර්මයෙන් අවකලනය, දාම නීතිය සහ මූලික අවකල්‍ය ලබාගැනීම',
    teacherName: 'Eng. Rohitha Senanayake',
    teacherTitle: 'B.Sc. Eng (Hons) Moratuwa • 15+ Yrs Island-Rank Math Lecturer',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    duration: '1h 45m',
    durationSeconds: 6300,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Comprehensive walkthrough of differentiation from limits dy/dx = lim h->0 [f(x+h) - f(x)]/h, product rule, quotient rule, implicit differentiation, and 2024 A/L essay model questions.',
    descriptionSinhala: 'සීමා මඟින් මූලධර්ම අවකලනය, ගුණිත නීතිය, බෙදුම් නීතිය, අප්‍රකට ශ්‍රිත අවකලනය සහ විභාග ප්‍රශ්න පත්‍ර සාකච්ඡාව.',
    difficulty: 'Beginner',
    tags: ['Pure Maths', 'Differentiation', 'Calculus', 'A/L 2026'],
    chapters: [
      { id: 'ch_1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Introduction to Limits & First Principles', titleSinhala: 'සීමා සහ මූලධර්මයෙන් අවකලනය' },
      { id: 'ch_1_2', timeSeconds: 1020, timeFormatted: '17:00', title: 'Product & Quotient Rules Explained', titleSinhala: 'ගුණිත සහ බෙදුම් නීති' },
      { id: 'ch_1_3', timeSeconds: 2700, timeFormatted: '45:00', title: 'Trigonometric & Exponential Derivatives', titleSinhala: 'ත්‍රිකෝණමිතික ශ්‍රිතවල අවකලනය' },
      { id: 'ch_1_4', timeSeconds: 4500, timeFormatted: '01:15:00', title: 'A/L Past Paper Problem Solving', titleSinhala: 'පසුගිය විභාග ගැටලු සාකච්ඡාව' }
    ],
    tutePdfUrl: 'https://example.com/tutes/maths_diff_01.pdf',
    tuteTitle: 'Combined Maths Differentiation Theory & Problem Set 01',
    isCompleted: true,
    viewCount: 18450,
    rating: 4.95,
    totalRatings: 412
  },

  {
    id: 'vid_phy_01',
    subjectId: 'sub_physics',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    grade: 12,
    stream: 'Physical Science (Maths)',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Measurement & Units (මිනුම්)',
    unitTitleSinhala: 'මිනුම් උපකරණ සහ ඒකක මාන',
    guruPothaUnit: 'උසස් පෙළ භෞතික විද්‍යාව සම්පත් පොත • 01 වන ඒකකය',
    title: 'Vernier Calipers, Micrometer Screw Gauge & Error Analysis',
    titleSinhala: 'වර්නියර් කැලිපරය, මයික්‍රෝමීටරය සහ දෝෂ විශ්ලේෂණය',
    teacherName: 'Prof. Samantha Dissanayake',
    teacherTitle: 'Senior Physics Scholar • 20+ Years Excellence in A/L',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    duration: '1h 25m',
    durationSeconds: 5100,
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Learn zero error corrections, least count derivations, fractional/percentage errors, and high-frequency structured essay practical exam questions.',
    descriptionSinhala: 'ශුන්‍ය දෝෂ නිවැරදි කිරීම, කුඩාම මිනුම සෙවීම, ප්‍රතිශත දෝෂ සහ ප්‍රායෝගික පරීක්ෂණ ආශ්‍රිත ව්‍යුහගත රචනා ප්‍රශ්න.',
    difficulty: 'Beginner',
    tags: ['Measurement', 'Practicals', 'Structured Essay', 'Physics 2026'],
    chapters: [
      { id: 'ch_p1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Principles of Measurement & Least Count', titleSinhala: 'මිනුම් මූලධර්ම සහ කුඩාම මිනුම' },
      { id: 'ch_p1_2', timeSeconds: 840, timeFormatted: '14:00', title: 'Vernier Scale & Zero Error Calculations', titleSinhala: 'වර්නියර් පරිමාණය සහ ශුන්‍ය දෝෂ' },
      { id: 'ch_p1_3', timeSeconds: 2400, timeFormatted: '40:00', title: 'Micrometer Screw Gauge Mastery', titleSinhala: 'මයික්‍රෝමීටර් ඉස්කුරුප්පු ආමානය' }
    ],
    tutePdfUrl: 'https://example.com/tutes/physics_measurements.pdf',
    tuteTitle: 'Physics Practical Unit 01 Note & Tute',
    isCompleted: true,
    viewCount: 16800,
    rating: 4.96,
    totalRatings: 440
  },

  {
    id: 'vid_chem_01',
    subjectId: 'sub_chemistry',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    grade: 12,
    stream: 'Physical Science (Maths)',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Atomic Structure & Chemical Bonding',
    unitTitleSinhala: 'පරමාණුක ව්‍යුහය සහ රසායනික බන්ධන',
    guruPothaUnit: 'උසස් පෙළ රසායන විද්‍යාව • 01 වන ඒකකය',
    title: 'Quantum Numbers, Orbitals, Lewis Structures & VSEPR Shapes',
    titleSinhala: 'ක්වොන්ටම් අංක, ලුවිස් ව්‍යුහ සහ VSEPR ජ්‍යාමිතිය',
    teacherName: 'Dr. Nuwan Senaviratne',
    teacherTitle: 'Ph.D. Chemistry (UOC) • 12+ Yrs Island-Rank Chemistry',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
    duration: '1h 40m',
    durationSeconds: 6000,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Learn quantum numbers (n, l, ml, ms), electron configurations, formal charges, resonance contributors, and hybridizations with 3D molecular geometry models.',
    descriptionSinhala: 'ක්වොන්ටම් අංක 4, ඉලෙක්ට්‍රෝන වින්‍යාස, ලුවිස් ව්‍යුහ ඇඳීමේ සම්මත ක්‍රමය, මුහුම්කරණය සහ VSEPR අණුක හැඩ.',
    difficulty: 'Beginner',
    tags: ['General Chemistry', 'Quantum Numbers', 'VSEPR', 'Hybridization'],
    chapters: [
      { id: 'ch_c1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Quantum Numbers & Aufbau Principle', titleSinhala: 'ක්වොන්ටම් අංක සහ අවුෆ්බාව් මූලධර්මය' },
      { id: 'ch_c1_2', timeSeconds: 1200, timeFormatted: '20:00', title: 'Lewis Structures & Formal Charge Math', titleSinhala: 'ලුවිස් ව්‍යුහ සහ නියමිත ආරෝපණ ගණනය' }
    ],
    tutePdfUrl: 'https://example.com/tutes/chem_bonding_01.pdf',
    tuteTitle: 'Chemical Bonding Theory & Color Chart',
    isCompleted: true,
    viewCount: 15400,
    rating: 4.97,
    totalRatings: 490
  },

  {
    id: 'vid_bio_01',
    subjectId: 'sub_biology',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    grade: 12,
    stream: 'Biological Science (Bio)',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Cell Biology & Biochemistry',
    unitTitleSinhala: 'සෛල ජීව විද්‍යාව සහ ජෛව රසායනය',
    guruPothaUnit: 'උසස් පෙළ ජීව විද්‍යාව සම්පත් පොත • 02 වන ඒකකය',
    title: 'Ultra-Structure of Cell Organelles & Biomolecules',
    titleSinhala: 'සෛල ඉන්ද්‍රිකා වල අන්වීක්ෂීය ව්‍යුහය සහ ප්‍රධාන ජෛව අණු',
    teacherName: 'Dr. Nilmini Wickramasinghe',
    teacherTitle: 'MBBS (Colombo) • Senior A/L Biology Mentor',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
    duration: '1h 38m',
    durationSeconds: 5880,
    thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Comprehensive guide to cell membrane fluid mosaic model, nucleus, mitochondria, chloroplasts, carbohydrates, proteins, lipids, and nucleic acids.',
    descriptionSinhala: 'සෛල පටලයේ තරල විචිත්‍ර ආකෘතිය, හරිතලව, මයිටොකොන්ඩ්‍රියා සහ ජෛව අණු වල ව්‍යුහ හා කෘත්‍යයන්.',
    difficulty: 'Beginner',
    tags: ['Cell Biology', 'Biochemistry', 'A/L Bio 2026'],
    chapters: [
      { id: 'ch_b1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Cell Theory & Fluid Mosaic Model', titleSinhala: 'සෛල වාදය සහ තරල විචිත්‍ර ආකෘතිය' },
      { id: 'ch_b1_2', timeSeconds: 1400, timeFormatted: '23:20', title: 'Double Membrane Organelles', titleSinhala: 'ද්විපටලමය ඉන්ද්‍රිකා' }
    ],
    tutePdfUrl: 'https://example.com/tutes/bio_cells.pdf',
    tuteTitle: 'Cell Biology Resource Book Summary PDF',
    isCompleted: true,
    viewCount: 13900,
    rating: 4.95,
    totalRatings: 370
  },

  {
    id: 'vid_ict_01',
    subjectId: 'sub_ict',
    subjectName: 'Information Technology (ICT)',
    subjectSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය',
    grade: 13,
    stream: 'Technology',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Number Systems & Digital Logic Gates',
    unitTitleSinhala: 'සංඛ්‍යා පද්ධති සහ ඩිජිටල් තාර්කික ද්වාර',
    guruPothaUnit: 'උසස් පෙළ ICT • 02 වන ඒකකය',
    title: 'Binary Arithmetic, 2s Complement & Karnaugh Maps (K-Maps)',
    titleSinhala: 'ද්විමය අංක ගණිතය, 2 හි අනුපූරකය සහ කර්නෝ සිතියම්',
    teacherName: 'Eng. Kusal Pathirana',
    teacherTitle: 'B.Sc. Eng (Computer Eng) Moratuwa • ICT Specialist',
    teacherAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
    duration: '1h 30m',
    durationSeconds: 5400,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Master binary/octal/hex conversions, signed integer 2s complement representation, Boolean algebra theorems, and 2/3/4 variable K-map simplification.',
    descriptionSinhala: 'සංඛ්‍යා පද්ධති පරිවර්තන, 2 හි අනුපූරක සෘණ සංඛ්‍යා, බූලීය වීජ ගණිතය සහ කර්නෝ සිතියම් (K-Maps) මඟින් සරල කිරීම.',
    difficulty: 'Intermediate',
    tags: ['ICT', 'Number Systems', 'Logic Gates', 'K-Maps'],
    chapters: [
      { id: 'ch_i1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Number Systems & Base Conversions', titleSinhala: 'පාද අතර පරිවර්තන' },
      { id: 'ch_i1_2', timeSeconds: 1000, timeFormatted: '16:40', title: 'Signed Binary & 2s Complement Math', titleSinhala: '2 හි අනුපූරක ගණනය කිරීම්' }
    ],
    tutePdfUrl: 'https://example.com/tutes/ict_logic_gates.pdf',
    tuteTitle: 'ICT Unit 01 Full Exercise Workbook',
    isCompleted: true,
    viewCount: 9800,
    rating: 4.93,
    totalRatings: 230
  },

  {
    id: 'vid_acc_01',
    subjectId: 'sub_accounting',
    subjectName: 'Accounting',
    subjectSinhala: 'ගිණුම්කරණය',
    grade: 13,
    stream: 'Commerce',
    classNumber: 1,
    unitNumber: 1,
    unitTitle: 'Financial Accounting & Final Accounts',
    unitTitleSinhala: 'මූල්‍ය ගිණුම්කරණය සහ අවසන් ගිණුම්',
    guruPothaUnit: 'උසස් පෙළ ගිණුම්කරණය • සමාගම් අවසන් ගිණුම්',
    title: 'Manufacturing Accounts & Comprehensive Income Adjustments',
    titleSinhala: 'නිෂ්පාදන ගිණුම් සහ සවිස්තර ආදායම් ප්‍රකාශන ගැලපීම්',
    teacherName: 'Dhanushka Rajapaksha (ACA)',
    teacherTitle: 'Chartered Accountant (ICASL) • Premier A/L Commerce Lecturer',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    duration: '1h 45m',
    durationSeconds: 6300,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0',
    description: 'Factory overhead allocations, work-in-progress adjustments, depreciation policies, bad debts provisions, and mastering LKAS/SLFRS standards.',
    descriptionSinhala: 'කර්මාන්තශාලා පොදු කාර්ය පිරිවැය, නිමනොවූ වැඩ ගැලපීම්, ක්ෂය ප්‍රතිපාදන සහ ශ්‍රී ලංකා ගිණුම්කරණ ප්‍රමිත (LKAS).',
    difficulty: 'Intermediate',
    tags: ['Accounting', 'Final Accounts', 'Manufacturing', 'Commerce'],
    chapters: [
      { id: 'ch_a1_1', timeSeconds: 0, timeFormatted: '00:00', title: 'Prime Cost & Production Overhead Breakdown', titleSinhala: 'ප්‍රාථමික පිරිවැය සහ නිෂ්පාදන පොදු කාර්ය' },
      { id: 'ch_a1_2', timeSeconds: 1500, timeFormatted: '25:00', title: 'Year-End Adjustments (Depreciation & Accruals)', titleSinhala: 'වර්ෂාවසාන ගැලපීම්' }
    ],
    tutePdfUrl: 'https://example.com/tutes/acc_final_accounts.pdf',
    tuteTitle: 'Accounting Final Accounts Master Format & Tute',
    isCompleted: true,
    viewCount: 8900,
    rating: 4.91,
    totalRatings: 195
  }
];
