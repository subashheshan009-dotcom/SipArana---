export interface SyllabusItem {
  id: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  subjectCode: string;
  subjectName: string;
  subjectSinhala: string;
  subjectId: string;
  streamId: string;
  categoryId: 'al' | 'ol' | 'junior' | 'uni';
  grade: number | string;
  level: 'AL' | 'OL' | 'JUNIOR' | 'CAMPUS';
  stream: string;
  yearPublished: number;
  fileType: 'NIE Syllabus' | 'Guru Potha (Teacher Guide)' | 'Resource Book' | 'Summary Notes' | 'Past Paper PDF';
  fileSize: string;
  pageCount: number;
  downloadCount: number;
  isCachedOffline?: boolean;
  color: string;
  competencyCount: number;
  summary: string;
  summarySinhala: string;
  competencies: {
    competencyNo: string;
    description: string;
    descriptionSinhala: string;
    periods: number;
  }[];
  keyFormulasAndConcepts: string[];
}

export const SYLLABUS_CATALOG_DATA: SyllabusItem[] = [
  // ==========================================
  // 1. A/L COMBINED MATHEMATICS (Maths Stream)
  // ==========================================
  {
    id: 'syl_al_maths_syllabus',
    title: 'G.C.E. A/L Combined Mathematics Official NIE Syllabus',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සංයුක්ත ගණිතය නිල විෂය නිර්දේශය',
    titleTamil: 'க.பொ.த. உயர்தர இணைந்த கணிதம் தேசிய பாடத்திட்டம்',
    subjectCode: 'AL-CM-01',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    subjectId: 'sub_combined_maths',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '4.8 MB',
    pageCount: 142,
    downloadCount: 38400,
    color: 'from-blue-600 to-indigo-800',
    competencyCount: 16,
    summary: 'Complete NIE curriculum framework covering Pure Mathematics (Algebra, Trigonometry, Calculus) and Applied Mathematics (Vectors, Statics, Dynamics, Probability).',
    summarySinhala: 'ශුද්ධ ගණිතය (වීජ ගණිතය, ත්‍රිකෝණමිතිය, කලනය) සහ ව්‍යවහාරික ගණිතය (දෛශික, ස්ථිති විද්‍යාව, චලිතය, සම්භාවිතාව) සම්පූර්ණ ඒකක විස්තරය.',
    competencies: [
      { competencyNo: '1.0', description: 'Real Numbers & Polynomial Functions', descriptionSinhala: 'තාත්වික සංඛ්‍යා සහ බහුපද ශ්‍රිත', periods: 25 },
      { competencyNo: '2.0', description: 'Quadratic Equations and Discriminants', descriptionSinhala: 'වර්ගජ සමීකරණ සහ විවේචක', periods: 20 },
      { competencyNo: '3.0', description: 'Trigonometric Identities & Equations', descriptionSinhala: 'ත්‍රිකෝණමිතික සර්වසාම්‍ය සහ සමීකරණ', periods: 30 },
      { competencyNo: '4.0', description: 'Differential Calculus & Rate of Change', descriptionSinhala: 'අවකලනය සහ විචලන අනුපාත', periods: 40 },
      { competencyNo: '5.0', description: 'Definite and Indefinite Integration', descriptionSinhala: 'නියත හා අනියත අනුකලනය', periods: 45 },
      { competencyNo: '6.0', description: 'Equilibrium of Coplanar Forces (Statics)', descriptionSinhala: 'සමතල බල පද්ධති වල සමතුලිතතාව', periods: 35 },
      { competencyNo: '7.0', description: 'Newtonian Dynamics & Circular Motion', descriptionSinhala: 'චලිතය, නිව්ටන් නියම සහ වෘත්ත චලිතය', periods: 40 },
    ],
    keyFormulasAndConcepts: [
      'd/dx [sin x] = cos x, d/dx [ln x] = 1/x',
      '∫ (u dv) = uv - ∫ (v du) (Integration by parts)',
      'v² = u² + 2as, s = ut + 1/2 at²',
      'F_centripetal = mv² / r',
      'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'
    ]
  },
  {
    id: 'syl_al_maths_gurupotha',
    title: 'G.C.E. A/L Combined Mathematics Teacher Guide (Guru Potha)',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සංයුක්ත ගණිතය ගුරු මාර්ගෝපදේශය (ගුරු පොත)',
    titleTamil: 'க.பொ.த. உயர்தர இணைந்த கணிதம் ஆசிரியர் வழிகாட்டி',
    subjectCode: 'AL-CM-01G',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    subjectId: 'sub_combined_maths',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Guru Potha (Teacher Guide)',
    fileSize: '6.5 MB',
    pageCount: 220,
    downloadCount: 41200,
    color: 'from-indigo-600 to-blue-900',
    competencyCount: 16,
    summary: 'Official NIE Teacher Instructional Manual containing step-by-step mathematical proofs, exercise solutions, and lesson sequences.',
    summarySinhala: 'ජාතික අධ්‍යාපන ආයතනයේ නිල ගුරු උපදෙස් අත්පොත, සාධන පියවර සහ අභ්‍යාස විසඳුම්.',
    competencies: [
      { competencyNo: 'GP-1', description: 'Pure Mathematics Step-by-Step Proofs and Teaching Methodology', descriptionSinhala: 'ශුද්ධ ගණිත සාධන ක්‍රමවේද සහ විභාග ප්‍රශ්න විවරණ', periods: 60 },
      { competencyNo: 'GP-2', description: 'Applied Mathematics Vector & Equilibrium Teaching Strategies', descriptionSinhala: 'ව්‍යවහාරික ගණිත දෛශික හා සමතුලිතතා ඉගැන්වීම් උපක්‍රම', periods: 55 }
    ],
    keyFormulasAndConcepts: [
      'De Moivre: (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)',
      'Partial Fractions Decomposition Techniques',
      'Friction Law: F_lim = μR'
    ]
  },
  {
    id: 'syl_al_maths_pastpapers',
    title: 'G.C.E. A/L Combined Maths 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සංයුක්ත ගණිතය 2018-2024 පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர இணைந்த கணிதம் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-CM-PP',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    subjectId: 'sub_combined_maths',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '9.2 MB',
    pageCount: 260,
    downloadCount: 46700,
    color: 'from-blue-700 to-slate-900',
    competencyCount: 14,
    summary: 'Combined Maths Paper I (Pure) and Paper II (Applied) with Department of Examinations official marking schemes.',
    summarySinhala: 'ශුද්ධ ගණිතය (Paper I) සහ ව්‍යවහාරික ගණිතය (Paper II) සම්පූර්ණ ප්‍රශ්න පත්‍ර හා ලකුණු ක්‍රමවේදය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Combined Maths Paper I & II with Official Scheme', descriptionSinhala: '2024 උ/පෙළ සංයුක්ත ගණිතය ප්‍රශ්න පත්‍රය සහ නිල ලකුණු දීමේ පටිපාටිය', periods: 15 },
      { competencyNo: 'PP-2', description: '2023 A/L Combined Maths Paper I & II with Official Scheme', descriptionSinhala: '2023 උ/පෙළ සංයුක්ත ගණිතය ප්‍රශ්න පත්‍රය සහ නිල ලකුණු දීමේ පටිපාටිය', periods: 15 }
    ],
    keyFormulasAndConcepts: [
      'Pure Part A (10 Short Questions) & Part B (5 Structured Essays)',
      'Applied Part A (10 Short Questions) & Part B (5 Structured Essays)'
    ]
  },
  {
    id: 'syl_al_maths_shortnotes',
    title: 'A/L Combined Maths High-Yield Formula Book & Short Notes',
    titleSinhala: 'උසස් පෙළ සංයුක්ත ගණිතය සියලුම සූත්‍ර සංග්‍රහය සහ කෙටි සටහන්',
    titleTamil: 'இணைந்த கணிதம் சூத்திரங்கள் மற்றும் சுருக்கக் குறிப்புகள்',
    subjectCode: 'AL-CM-SN',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    subjectId: 'sub_combined_maths',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '3.4 MB',
    pageCount: 72,
    downloadCount: 39100,
    color: 'from-indigo-600 to-cyan-800',
    competencyCount: 16,
    summary: 'Pocket revision handbook containing all trigonometry, calculus, statics, vectors, dynamics, and probability formulas.',
    summarySinhala: 'විභාගයට පෙර කඩිනම් ආවර්ජනය සඳහා සියලුම ත්‍රිකෝණමිතිය, කලනය, ස්ථිති විද්‍යාව, දෛශික හා චලිත සූත්‍ර.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Complete Pure Maths Formula Directory', descriptionSinhala: 'ශුද්ධ ගණිත සූත්‍ර සංග්‍රහය', periods: 10 },
      { competencyNo: 'SN-2', description: 'Complete Applied Mechanics & Vectors Cheat Sheet', descriptionSinhala: 'ව්‍යවහාරික යාන්ත්‍ර විද්‍යාව සහ දෛශික සූත්‍ර සාරාංශය', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'sin(A ± B) = sinA cosB ± cosA sinB',
      'tan 2θ = 2tanθ / (1 - tan²θ)',
      'Centroid of solid hemisphere: 3r/8 from base'
    ]
  },

  // ==========================================
  // 2. A/L PHYSICS (Maths & Bio Streams)
  // ==========================================
  {
    id: 'syl_al_physics_resource',
    title: 'G.C.E. A/L Physics NIE Resource Book & Practical Handbook',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ භෞතික විද්‍යාව සම්පත් පොත සහ ප්‍රායෝගික පරීක්ෂණ අත්පොත',
    titleTamil: 'க.பொ.த. உயர்தர பௌதிகவியல் வள நூல்',
    subjectCode: 'AL-PHY-02',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    subjectId: 'sub_physics',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Resource Book',
    fileSize: '6.2 MB',
    pageCount: 210,
    downloadCount: 42100,
    color: 'from-amber-600 to-orange-700',
    competencyCount: 11,
    summary: 'Comprehensive resource book including measurement, mechanics, oscillations, thermal physics, electricity, electronics, and nuclear physics with practical guidelines.',
    summarySinhala: 'මිණුම්, යාන්ත්‍ර විද්‍යාව, දෝලන හා තරංග, තාප භෞතික විද්‍යාව, ධාරා විද්‍යුතය සහ ඉලෙක්ට්‍රොනික්ස් පිළිබඳ සම්පත් පොත.',
    competencies: [
      { competencyNo: '1.0', description: 'Measurement & Error Estimation in Physics', descriptionSinhala: 'මිණුම් සහ දෝෂ ඇස්තමේන්තු කිරීම', periods: 20 },
      { competencyNo: '2.0', description: 'Mechanics, Linear Motion & Rotational Dynamics', descriptionSinhala: 'යාන්ත්‍ර විද්‍යාව, රේඛීය සහ භ්‍රමණ චලිතය', periods: 55 },
      { competencyNo: '3.0', description: 'Oscillations & Mechanical Waves', descriptionSinhala: 'දෝලන සහ තරංග', periods: 40 },
      { competencyNo: '4.0', description: 'Thermal Physics & Laws of Thermodynamics', descriptionSinhala: 'තාපය සහ තාපගති විද්‍යාවේ නියම', periods: 35 },
      { competencyNo: '5.0', description: 'Electrostatics & Magnetic Fields', descriptionSinhala: 'ස්ථිති විද්‍යුතය සහ චුම්භක ක්ෂේත්‍ර', periods: 45 },
    ],
    keyFormulasAndConcepts: [
      'Bernoulli: P + 1/2 ρv² + ρgh = Constant',
      'Stokes: F = 6πηrv, Terminal velocity v_t = 2r²(ρ-σ)g / (9η)',
      'Doppler: f\' = f * (v ± v_o) / (v ∓ v_s)',
      'Thermodynamics: ΔQ = ΔU + ΔW',
      'Faraday: ε = -dΦ/dt'
    ]
  },
  {
    id: 'syl_al_physics_pastpapers',
    title: 'G.C.E. A/L Physics 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ භෞතික විද්‍යාව පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர பௌதிகவியல் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-PHY-PP',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    subjectId: 'sub_physics',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '8.4 MB',
    pageCount: 240,
    downloadCount: 44300,
    color: 'from-orange-600 to-amber-900',
    competencyCount: 11,
    summary: 'Official A/L Physics Paper I (50 MCQ) and Paper II (Structured Essay & Essay) with Department of Examinations marking scheme.',
    summarySinhala: 'භෞතික විද්‍යාව බහුවරණ 50 සහ ව්‍යුහගත/රචනා ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Physics Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 භෞතික විද්‍යාව ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 12 },
      { competencyNo: 'PP-2', description: '2023 A/L Physics Paper I & II with Evaluation Criteria', descriptionSinhala: '2023 භෞතික විද්‍යාව ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 12 }
    ],
    keyFormulasAndConcepts: [
      '50 MCQs (120 mins) + 4 Structured Essays + 4 Essay Questions'
    ]
  },
  {
    id: 'syl_al_physics_shortnotes',
    title: 'A/L Physics Complete Unit Revision Notes & Practical Cheat Sheets',
    titleSinhala: 'උසස් පෙළ භෞතික විද්‍යාව ඒකක සාරාංශ සටහන් සහ ප්‍රායෝගික පරීක්ෂණ සටහන්',
    titleTamil: 'பௌதிகவியல் சுருக்கக் குறிப்புகள்',
    subjectCode: 'AL-PHY-SN',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    subjectId: 'sub_physics',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '4.1 MB',
    pageCount: 88,
    downloadCount: 37900,
    color: 'from-amber-500 to-red-800',
    competencyCount: 11,
    summary: 'All 42 official practical experiments step-by-step summary with circuit diagrams, graph plots, and gradient calculations.',
    summarySinhala: 'නිල ප්‍රායෝගික පරීක්ෂණ 42 හි ප්‍රස්ථාර, සමීකරණ හා අනුක්‍රමණ ගණනය කෙටි සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: '42 Standard Physics Practicals Summary and Error Calculations', descriptionSinhala: 'ප්‍රායෝගික පරීක්ෂණ 42 හි සම්පූර්ණ සාරාංශය', periods: 20 }
    ],
    keyFormulasAndConcepts: [
      'Sonometer: f = (1 / 2l) * √(T / m)',
      'Potentiometer: E1 / E2 = l1 / l2',
      'Wheatstone Bridge: P / Q = R / S'
    ]
  },

  // ==========================================
  // 3. A/L CHEMISTRY (Maths & Bio Streams)
  // ==========================================
  {
    id: 'syl_al_chem_gurupotha',
    title: 'G.C.E. A/L Chemistry National Teacher Guide & Organic Summaries',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ රසායන විද්‍යාව ගුරු මාර්ගෝපදේශය සහ කාබනික ප්‍රතික්‍රියා සටහන්',
    titleTamil: 'க.பொ.த. உயர்தர இரசாயனவியல் ஆசிரியர் வழிகாட்டி',
    subjectCode: 'AL-CHE-03',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    subjectId: 'sub_chemistry',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Guru Potha (Teacher Guide)',
    fileSize: '5.4 MB',
    pageCount: 188,
    downloadCount: 39500,
    color: 'from-emerald-600 to-teal-800',
    competencyCount: 14,
    summary: 'Atomic structure, chemical bonding, kinetics, chemical equilibrium, electrochemistry, s, p, d block descriptive chemistry, and complete organic reaction charts.',
    summarySinhala: 'පරමාණුක ව්‍යුහය, රසායනික බන්ධන, චාලක විද්‍යාව, සමතුලිතතාව, අකාබනික රසායනය සහ කාබනික පරිවර්තන සටහන්.',
    competencies: [
      { competencyNo: '1.0', description: 'Atomic Structure & Periodic Trends', descriptionSinhala: 'පරමාණුක ව්‍යුහය සහ ආවර්තිතා රටා', periods: 25 },
      { competencyNo: '2.0', description: 'Chemical Bonding & Hybridization', descriptionSinhala: 'රසායනික බන්ධන සහ මුහුම්කරණය', periods: 35 },
      { competencyNo: '3.0', description: 'Calculations in Chemistry & Stoichiometry', descriptionSinhala: 'මවුල සංකල්පය සහ ස්ටොයිකියෝමිතිය', periods: 30 },
      { competencyNo: '4.0', description: 'Chemical Equilibrium, Kc, Kp, pH & Buffer Solutions', descriptionSinhala: 'රසායනික සමතුලිතතාව, Kc, Kp, pH සහ බෆර් ද්‍රාවණ', periods: 50 },
      { competencyNo: '5.0', description: 'Organic Reaction Mechanisms & Functional Groups', descriptionSinhala: 'කාබනික ප්‍රතික්‍රියා යාන්ත්‍රණ සහ කාණ්ඩ', periods: 60 },
    ],
    keyFormulasAndConcepts: [
      'Ideal Gas: PV = nRT',
      'Arrhenius: k = A * e^(-Ea / RT)',
      'Henderson-Hasselbalch: pH = pKa + log([Salt] / [Acid])',
      'Nernst: E_cell = E°_cell - (0.0592/n) * log(Q)',
      'Gibbs Free Energy: ΔG = ΔH - TΔS'
    ]
  },
  {
    id: 'syl_al_chem_pastpapers',
    title: 'G.C.E. A/L Chemistry 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ රසායන විද්‍යාව පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர இரசாயனவியல் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-CHE-PP',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    subjectId: 'sub_chemistry',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.9 MB',
    pageCount: 230,
    downloadCount: 41800,
    color: 'from-teal-700 to-emerald-900',
    competencyCount: 14,
    summary: 'Chemistry Paper I (50 MCQ) and Paper II (Structured & Inorganic/Organic Essays) with complete marking scheme.',
    summarySinhala: 'රසායන විද්‍යාව බහුවරණ හා රචනා ප්‍රශ්න පත්‍ර සහ විභාග දෙපාර්තමේන්තු පිළිතුරු.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Chemistry Paper I & II with Evaluation Report', descriptionSinhala: '2024 රසායන විද්‍යාව ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 12 }
    ],
    keyFormulasAndConcepts: [
      'Inorganic Cation & Anion qualitative analysis flowcharts'
    ]
  },
  {
    id: 'syl_al_chem_shortnotes',
    title: 'A/L Chemistry Organic Reaction Roadmap & Inorganic Color Charts',
    titleSinhala: 'උසස් පෙළ රසායන විද්‍යාව කාබනික පරිවර්තන මාර්ග සිතියම සහ අකාබනික වර්ණ සටහන',
    titleTamil: 'இரசாயனவியல் சுருக்கக் குறிப்புகள் & கரிம வினைகள்',
    subjectCode: 'AL-CHE-SN',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    subjectId: 'sub_chemistry',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '3.6 MB',
    pageCount: 68,
    downloadCount: 36200,
    color: 'from-emerald-500 to-cyan-800',
    competencyCount: 14,
    summary: 'High-yield roadmap of all organic conversions (Alkanes -> Alkenes -> Halides -> Alcohols -> Aldehydes -> Acids) and d-block precipitate color cheat sheet.',
    summarySinhala: 'සියලුම කාබනික පරිවර්තන සිතියම් සහ d ගොනුවේ අවක්ෂේප වර්ණ කෙටි සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Comprehensive Organic Conversion Roadmap', descriptionSinhala: 'කාබනික පරිවර්තන මාර්ග සිතියම', periods: 15 }
    ],
    keyFormulasAndConcepts: [
      'Grignard Reaction: R-MgX + HCHO -> R-CH2-OH (1° Alcohol)',
      'Fehling / Tollens Silver Mirror Test for Aldehydes',
      'Fe³⁺ (Blood Red with SCN⁻), Cu²⁺ (Deep Blue with excess NH3)'
    ]
  },

  // ==========================================
  // 4. A/L BIOLOGY (Bio Stream)
  // ==========================================
  {
    id: 'syl_al_bio_resource',
    title: 'G.C.E. A/L Biology Official Resource Book (Units 1 - 10)',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ජීව විද්‍යාව නිල සම්පත් පොත (ඒකක 1 - 10)',
    titleTamil: 'க.பொ.த. உயர்தர உயிரியல் உத்தியோகபூர்வ வள நூல்',
    subjectCode: 'AL-BIO-04',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    subjectId: 'sub_biology',
    streamId: 'stream_al_bio',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Biological Science (Bio)',
    yearPublished: 2024,
    fileType: 'Resource Book',
    fileSize: '8.1 MB',
    pageCount: 320,
    downloadCount: 45200,
    color: 'from-green-600 to-emerald-900',
    competencyCount: 10,
    summary: 'The primary syllabus reference for A/L Bio: Introduction to Biology, chemical & cellular basis of life, diversity of organisms, plant form & function, animal form & function, genetics, ecology, and applied biology.',
    summarySinhala: 'ජීවයේ පදනම, ශාක හා සත්ව ආකාර හා කෘත්‍ය, මානව කායික විද්‍යාව, ප්‍රවේණිය සහ පරිසර විද්‍යාව පිළිබඳ සම්පූර්ණ සම්පත් පොත.',
    competencies: [
      { competencyNo: '1.0', description: 'Cell Biology & Biochemical Basis of Life', descriptionSinhala: 'සෛල ජීව විද්‍යාව සහ ජෛව රසායනික පදනම', periods: 40 },
      { competencyNo: '2.0', description: 'Diversity of Organisms & 3 Domain Classification', descriptionSinhala: 'ජීවීන්ගේ විවිධත්වය සහ වසම් 3 වර්ගීකරණය', periods: 50 },
      { competencyNo: '3.0', description: 'Plant Physiology, Transport & Photosynthesis', descriptionSinhala: 'ශාක කායික විද්‍යාව සහ ප්‍රභාසංස්ලේෂණය', periods: 45 },
      { competencyNo: '4.0', description: 'Human Physiology, Circulation, Respiration & Nervous System', descriptionSinhala: 'මානව කායික විද්‍යාව (රුධිර සංසරණය, ස්නායු පද්ධතිය)', periods: 70 },
      { competencyNo: '5.0', description: 'Molecular Genetics, Recombinant DNA & Biotechnology', descriptionSinhala: 'අණුක ප්‍රවේණිය සහ ජෛව තාක්ෂණය', periods: 35 },
    ],
    keyFormulasAndConcepts: [
      'Photosynthesis Light & Dark (Calvin Cycle) Reactions',
      'Cellular Respiration: Glycolysis -> Krebs Cycle -> Oxidative Phosphorylation',
      'Hardy-Weinberg Principle: p² + 2pq + q² = 1',
      'Cardiac Cycle & Action Potential Depolarization',
      'Nephron Countercurrent Multiplier Mechanism'
    ]
  },
  {
    id: 'syl_al_bio_pastpapers',
    title: 'G.C.E. A/L Biology 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ජීව විද්‍යාව පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர உயிரியல் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-BIO-PP',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    subjectId: 'sub_biology',
    streamId: 'stream_al_bio',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Biological Science (Bio)',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '8.8 MB',
    pageCount: 250,
    downloadCount: 46100,
    color: 'from-emerald-700 to-green-950',
    competencyCount: 10,
    summary: 'A/L Biology 50 MCQs, Structured Essays, and Essays with official DoE marking points and keywords.',
    summarySinhala: 'ජීව විද්‍යාව බහුවරණ 50 සහ රචනා ප්‍රශ්න පත්‍ර විභාග දෙපාර්තමේන්තු ලකුණු දීමේ මාර්ගෝපදේශය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Biology Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 ජීව විද්‍යාව ප්‍රශ්න පත්‍රය සහ නිල ලකුණු ක්‍රමය', periods: 14 }
    ],
    keyFormulasAndConcepts: [
      'DoE Biology Keyword Highlighting System'
    ]
  },
  {
    id: 'syl_al_bio_shortnotes',
    title: 'A/L Biology Human Physiology & Genetics Mind Maps & Summaries',
    titleSinhala: 'උසස් පෙළ ජීව විද්‍යාව මානව කායික විද්‍යාව සහ ප්‍රවේණිය සංකල්ප සිතියම්',
    titleTamil: 'உயிரியல் மன வரைபடங்கள் மற்றும் சுருக்கங்கள்',
    subjectCode: 'AL-BIO-SN',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    subjectId: 'sub_biology',
    streamId: 'stream_al_bio',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Biological Science (Bio)',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '4.5 MB',
    pageCount: 96,
    downloadCount: 39900,
    color: 'from-green-600 to-teal-900',
    competencyCount: 10,
    summary: 'Visual flowcharts of endocrinology, cardiac cycle, kidney countercurrent mechanism, immune response, and Mendelian dihybrid crosses.',
    summarySinhala: 'හෝමෝන පාලනය, හෘද චක්‍රය, වෘක්කයේ ක්‍රියාකාරීත්වය, ප්‍රතිශක්තිකරණය සහ ප්‍රවේණික සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Physiology and Genetics Visual Summary Book', descriptionSinhala: 'මානව කායික විද්‍යා දෘශ්‍ය සාරාංශ සංග්‍රහය', periods: 15 }
    ],
    keyFormulasAndConcepts: [
      'Cardiac Output = Stroke Volume × Heart Rate',
      'GFR (Glomerular Filtration Rate) ~ 125 ml/min',
      'Mendelian Dihybrid Phenotypic Ratio: 9:3:3:1'
    ]
  },

  // ==========================================
  // 5. A/L MEDIA STUDIES (Arts Stream)
  // ==========================================
  {
    id: 'syl_al_media_syllabus',
    title: 'G.C.E. A/L Communication & Media Studies NIE Official Syllabus & Teacher Guide',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය නිල ගුරු මාර්ගෝපදේශය (Guru Potha)',
    titleTamil: 'க.பொ.த. உயர்தர தொடர்பாடலும் ஊடகக் கற்கையும் வழிகாட்டி',
    subjectCode: 'AL-MED-07',
    subjectName: 'Communication & Media Studies',
    subjectSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    subjectId: 'sub_media_studies',
    streamId: 'stream_al_arts',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Arts',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '5.4 MB',
    pageCount: 168,
    downloadCount: 42100,
    color: 'from-amber-600 to-amber-900',
    competencyCount: 18,
    summary: 'Comprehensive national curriculum for A/L Media Studies covering human communication theories, semiotics, print journalism, broadcasting, cinema history, and photography.',
    summarySinhala: 'මානව සන්නිවේදන න්‍යාය, සංකේතවේදය, මුද්‍රිත පුවත්පත් කලාව, ගුවන්විදුලි හා රූපවාහිනී විකාශනය, සිනමා ඉතිහාසය හා ඡායාරූප ශිල්පය සියලු නිපුණතා.',
    competencies: [
      { competencyNo: '1.0', description: 'Human Communication, Concepts & Models (Lasswell, Shannon-Weaver, Berlo, Schramm)', descriptionSinhala: 'මානව සන්නිවේදනය, මූලික සංකල්ප සහ සන්නිවේදන ආකෘති', periods: 35 },
      { competencyNo: '2.0', description: 'Print Journalism, News Values, 5W1H & Editorial Ethics', descriptionSinhala: 'මුද්‍රිත මාධ්‍ය, ප්‍රවෘත්ති සම්පාදනය සහ ජනමාධ්‍ය ආචාරධර්ම', periods: 40 },
      { competencyNo: '3.0', description: 'Broadcasting Arts (Radio Drama, TV Studio Production & Foley Sound)', descriptionSinhala: 'ගුවන්විදුලි හා රූපවාහිනී මාධ්‍ය නිර්මාණකරණය හා ශබ්ද ප්‍රයෝග', periods: 45 },
      { competencyNo: '4.0', description: 'Cinema & Sri Lankan Film History (1947 Kadawunu Poronduwa, 1956 Rekava to Modern Era)', descriptionSinhala: 'සිනමා ඉතිහාසය, සිනමා භාෂාව සහ ශ්‍රී ලාංකේය සිනමා විකාශනය', periods: 50 },
      { competencyNo: '5.0', description: 'Photography & Visual Media (Exposure Triangle, Depth of Field, Composition)', descriptionSinhala: 'ඡායාරූප ශිල්පය, නිරාවරණ ත්‍රිකෝණය සහ දෘශ්‍ය මාධ්‍ය සංස්කෘතිය', periods: 30 }
    ],
    keyFormulasAndConcepts: [
      'Harold Lasswell: Who -> Says What -> In Which Channel -> To Whom -> With What Effect',
      'Shannon-Weaver: Source -> Transmitter -> Channel (Noise) -> Receiver -> Destination',
      'Berlo SMCR: Source -> Message -> Channel -> Receiver',
      'Exposure: Aperture (f-stop), Shutter Speed (1/s), ISO Sensitivity',
      '1947: Kadawunu Poronduwa (1st Sinhala Film), 1956: Rekava (Lester James Peries - Realism Turning Point)'
    ]
  },
  {
    id: 'syl_al_media_pastpapers',
    title: 'G.C.E. A/L Media Studies 2018-2024 Past Papers with Official Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர ஊடகக் கற்கை கடந்த கால வினாத்தாள்கள் & புள்ளித்திட்டம்',
    subjectCode: 'AL-MED-08',
    subjectName: 'Communication & Media Studies',
    subjectSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    subjectId: 'sub_media_studies',
    streamId: 'stream_al_arts',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Arts',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.8 MB',
    pageCount: 184,
    downloadCount: 35600,
    color: 'from-amber-700 to-slate-900',
    competencyCount: 12,
    summary: 'Past papers Part I (MCQ) and Part II (Structured & Essay) with Department of Examinations official marking schemes and model answers.',
    summarySinhala: 'විභාග දෙපාර්තමේන්තුවේ නිල ලකුණු දීමේ පටිපාටි (Marking Scheme) සහිත 2018-2024 පසුගිය ප්‍රශ්න පත්‍ර සහ ආදර්ශ පිළිතුරු.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Media Studies Paper I & II with Evaluation Report', descriptionSinhala: '2024 උසස් පෙළ මාධ්‍ය අධ්‍යයන ප්‍රශ්න පත්‍රය සහ පිළිතුරු පත්‍ර ඇගයීම් වාර්තාව', periods: 10 },
      { competencyNo: 'PP-2', description: '2023 A/L Media Studies Paper I & II with Evaluation Report', descriptionSinhala: '2023 උසස් පෙළ මාධ්‍ය අධ්‍යයන ප්‍රශ්න පත්‍රය සහ පිළිතුරු පත්‍ර ඇගයීම් වාර්තාව', periods: 10 },
      { competencyNo: 'PP-3', description: '2022 A/L Media Studies Paper I & II with Evaluation Report', descriptionSinhala: '2022 උසස් පෙළ මාධ්‍ය අධ්‍යයන ප්‍රශ්න පත්‍රය සහ පිළිතුරු පත්‍ර ඇගයීම් වාර්තාව', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'MCQ Pacing: 50 Questions in 120 Minutes (2.4 min/question)',
      'Essay Marking Rubrics: Theoretical Definition (25%), Local Case Examples (35%), Critical Analysis (40%)',
      'Press Council Act & Defamation Defense Guidelines'
    ]
  },
  {
    id: 'syl_al_media_shortnotes',
    title: 'A/L Media Studies High-Yield Short Notes, Mind Maps & Formula Sheets',
    titleSinhala: 'උසස් පෙළ සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය කෙටි සටහන් සහ සංකල්ප සිතියම්',
    titleTamil: 'ஊடகக் கற்கை சுருக்கக் குறிப்புகள் & கருத்து வரைபடங்கள்',
    subjectCode: 'AL-MED-09',
    subjectName: 'Communication & Media Studies',
    subjectSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    subjectId: 'sub_media_studies',
    streamId: 'stream_al_arts',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Arts',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '3.1 MB',
    pageCount: 64,
    downloadCount: 29400,
    color: 'from-amber-500 to-blue-800',
    competencyCount: 10,
    summary: 'Fast revision sheets covering all communication models, cinema history timelines, photography exposure triangles, and journalism leads.',
    summarySinhala: 'විභාගයට පෙර කඩිනම් පුනරීක්ෂණය සඳහා සියලුම න්‍යාය ආකෘති, සිනමා කාලරාමු, ඡායාරූප සූත්‍ර සහ පුවත්පත් ශිල්ප ක්‍රම සාරාංශය.',
    competencies: [
      { competencyNo: 'SN-1', description: 'All Communication Models on 1-Page Comparison Matrix', descriptionSinhala: 'සියලුම සන්නිවේදන ආකෘති සංසන්දනාත්මක සාරාංශ සටහන', periods: 5 },
      { competencyNo: 'SN-2', description: 'Chronological Timeline of World & Sri Lankan Cinema', descriptionSinhala: 'ලෝක හා ශ්‍රී ලාංකේය සිනමාවේ ඓතිහාසික කාලරාමුව', periods: 5 },
      { competencyNo: 'SN-3', description: 'Photography Exposure & Camera Techniques Quick Cheat Sheet', descriptionSinhala: 'ඡායාරූප නිරාවරණ ත්‍රිකෝණය සහ කැමරා ශිල්ප ක්‍රම කෙටි සටහන', periods: 5 }
    ],
    keyFormulasAndConcepts: [
      'Aristotle: Ethos (Credibility), Pathos (Emotion), Logos (Logic)',
      'Semiotics: Sign = Signifier (Sound/Image) + Signified (Mental Concept)',
      'Cinema: 180° Rule, Kuleshov Montage Effect, 3-Point Lighting'
    ]
  },

  // ==========================================
  // 6. A/L ACCOUNTING (Commerce Stream)
  // ==========================================
  {
    id: 'syl_al_accounting_syllabus',
    title: 'G.C.E. A/L Accounting Official NIE Syllabus & Teacher Guide',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ගිණුම්කරණය නිල විෂය නිර්දේශය සහ ගුරු මාර්ගෝපදේශය',
    titleTamil: 'க.பொ.த. உயர்தர கணக்கீடு பாடத்திட்டம் மற்றும் ஆசிரியர் வழிகாட்டி',
    subjectCode: 'AL-ACC-05',
    subjectName: 'Accounting',
    subjectSinhala: 'ගිණුම්කරණය',
    subjectId: 'sub_accounting',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '4.6 MB',
    pageCount: 154,
    downloadCount: 36800,
    color: 'from-blue-600 to-cyan-800',
    competencyCount: 15,
    summary: 'Financial accounting standards (LKAS/SLFRS), partnerships, manufacturing accounts, company financial statements, cost accounting, and cash flow statements.',
    summarySinhala: 'ශ්‍රී ලංකා ගිණුම්කරණ ප්‍රමිති (LKAS/SLFRS), හවුල් ව්‍යාපාර, සමාගම් ගිණුම්, නිෂ්පාදන ගිණුම් සහ මුදල් ප්‍රවාහ ප්‍රකාශන.',
    competencies: [
      { competencyNo: '1.0', description: 'Conceptual Framework & Sri Lanka Accounting Standards (LKAS/SLFRS)', descriptionSinhala: 'සංකල්පික රාමුව සහ ශ්‍රී ලංකා ගිණුම්කරණ ප්‍රමිති', periods: 30 },
      { competencyNo: '2.0', description: 'Partnership Accounts, Dissolution & Goodwill Adjustments', descriptionSinhala: 'හවුල් ව්‍යාපාර ගිණුම්, විසුරුවා හැරීම සහ කීර්තිනාම ගැලපීම්', periods: 45 },
      { competencyNo: '3.0', description: 'Limited Liability Companies & Published Accounts (LKAS 1)', descriptionSinhala: 'සීමාසහිත පොදු සමාගම් සහ ප්‍රකාශිත මූල්‍ය ප්‍රකාශන', periods: 50 },
      { competencyNo: '4.0', description: 'Cost and Management Accounting (CVP Analysis & Standard Costing)', descriptionSinhala: 'පිරිවැය සහ කළමනාකරණ ගිණුම්කරණය (CVP විශ්ලේෂණය)', periods: 40 }
    ],
    keyFormulasAndConcepts: [
      'Accounting Equation: Assets = Liabilities + Equity',
      'Gross Profit Ratio = (Gross Profit / Net Revenue) × 100',
      'Break-even Point (Units) = Fixed Costs / Contribution per unit',
      'Current Ratio = Current Assets / Current Liabilities'
    ]
  },
  {
    id: 'syl_al_accounting_pastpapers',
    title: 'G.C.E. A/L Accounting 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ගිණුම්කරණය පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர கணக்கீடு கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-ACC-PP',
    subjectName: 'Accounting',
    subjectSinhala: 'ගිණුම්කරණය',
    subjectId: 'sub_accounting',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.6 MB',
    pageCount: 210,
    downloadCount: 38900,
    color: 'from-cyan-700 to-blue-950',
    competencyCount: 12,
    summary: 'A/L Accounting 50 MCQs and 6 Structured Financial/Cost Accounting Problems with official examiner marking scheme.',
    summarySinhala: 'ගිණුම්කරණ බහුවරණ 50 සහ මූල්‍ය ප්‍රකාශන ව්‍යුහගත ගැටලු නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Accounting Paper I & II with Evaluation Report', descriptionSinhala: '2024 ගිණුම්කරණය ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 12 }
    ],
    keyFormulasAndConcepts: [
      'LKAS 7 Cash Flow Direct & Indirect Method Adjustments'
    ]
  },
  {
    id: 'syl_al_accounting_shortnotes',
    title: 'A/L Accounting Formula Handbook, LKAS Standards & Ratio Cheat Sheet',
    titleSinhala: 'උසස් පෙළ ගිණුම්කරණය සූත්‍ර සංග්‍රහය, LKAS ප්‍රමිති සහ අනුපාත කෙටි සටහන්',
    titleTamil: 'கணக்கீடு சூத்திரங்கள் & LKAS சுருக்கங்கள்',
    subjectCode: 'AL-ACC-SN',
    subjectName: 'Accounting',
    subjectSinhala: 'ගිණුම්කරණය',
    subjectId: 'sub_accounting',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '2.9 MB',
    pageCount: 58,
    downloadCount: 31200,
    color: 'from-blue-500 to-indigo-800',
    competencyCount: 12,
    summary: 'Quick revision formulas for all 18 financial ratios, LKAS 2 (Inventory), LKAS 16 (PPE), LKAS 37 (Provisions), and SLFRS 15 (Revenue).',
    summarySinhala: 'මූල්‍ය අනුපාත 18, LKAS 2, LKAS 16, LKAS 37 ප්‍රමිති කෙටි ආවර්ජන සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Complete Ratio Analysis and Standards Summary', descriptionSinhala: 'මූල්‍ය අනුපාත සහ ප්‍රමිති සාරාංශය', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'ROCE = (Operating Profit / Capital Employed) × 100',
      'Inventory Turnover = Cost of Sales / Average Inventory',
      'Contribution = Selling Price - Variable Cost'
    ]
  },

  // ==========================================
  // 7. A/L BUSINESS STUDIES (Commerce Stream)
  // ==========================================
  {
    id: 'syl_al_bs_syllabus',
    title: 'G.C.E. A/L Business Studies NIE Syllabus & Teacher Guide',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ව්‍යාපාර අධ්‍යයනය නිල විෂය නිර්දේශය සහ ගුරු මාර්ගෝපදේශය',
    titleTamil: 'க.பொ.த. உயர்தர வணிகக் கற்கைகள் பாடத்திட்டம்',
    subjectCode: 'AL-BS-06',
    subjectName: 'Business Studies',
    subjectSinhala: 'ව්‍යාපාර අධ්‍යයනය',
    subjectId: 'sub_business_studies',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '4.2 MB',
    pageCount: 138,
    downloadCount: 33400,
    color: 'from-amber-600 to-orange-800',
    competencyCount: 12,
    summary: 'Business environment, social responsibility, management principles, marketing mix, human resource management, and international business trade.',
    summarySinhala: 'ව්‍යාපාර පරිසරය, කළමනාකරණ සංකල්ප, අලෙවිකරණ මිශ්‍රමය, මානව සම්පත් සහ ජාත්‍යන්තර වෙළඳාම.',
    competencies: [
      { competencyNo: '1.0', description: 'Business Environment & Stakeholder Analysis', descriptionSinhala: 'ව්‍යාපාර පරිසරය සහ පාර්ශ්වකරුවන්', periods: 25 },
      { competencyNo: '2.0', description: 'Management Functions (Planning, Organizing, Leading, Controlling)', descriptionSinhala: 'කළමනාකරණ කෘත්‍ය (සැලසුම්කරණය, සංවිධානය, මෙහෙයවීම, පාලනය)', periods: 40 },
      { competencyNo: '3.0', description: 'Marketing Mix (4Ps & 7Ps)', descriptionSinhala: 'අලෙවිකරණ මිශ්‍රමය (4P සහ 7P)', periods: 35 }
    ],
    keyFormulasAndConcepts: [
      '4Ps: Product, Price, Place, Promotion',
      'PESTEL Analysis (Political, Economic, Social, Tech, Environmental, Legal)'
    ]
  },
  {
    id: 'syl_al_bs_pastpapers',
    title: 'G.C.E. A/L Business Studies 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ව්‍යාපාර අධ්‍යයනය පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர வணிகக் கற்கைகள் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-BS-PP',
    subjectName: 'Business Studies',
    subjectSinhala: 'ව්‍යාපාර අධ්‍යයනය',
    subjectId: 'sub_business_studies',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '6.8 MB',
    pageCount: 176,
    downloadCount: 34100,
    color: 'from-orange-700 to-amber-950',
    competencyCount: 12,
    summary: 'A/L Business Studies Paper I (50 MCQ) and Paper II (Case Studies & Essay Questions) with official marking guide.',
    summarySinhala: 'ව්‍යාපාර අධ්‍යයනය බහුවරණ 50 සහ සිද්ධි අධ්‍යයන ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L Business Studies Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 ව්‍යාපාර අධ්‍යයනය ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'Case Study Analysis structured method (Issue -> Theory -> Solution)'
    ]
  },

  // ==========================================
  // 8. A/L ENGINEERING TECHNOLOGY (Tech Stream)
  // ==========================================
  {
    id: 'syl_al_et_syllabus',
    title: 'G.C.E. A/L Engineering Technology (ET) NIE Syllabus & Resource Book',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ඉංජිනේරු තාක්ෂණවේදය (ET) නිල විෂය නිර්දේශය සහ සම්පත් පොත',
    titleTamil: 'க.பொ.த. உயர்தர பொறியியல் தொழில்நுட்பம் பாடத்திட்டம்',
    subjectCode: 'AL-ET-10',
    subjectName: 'Engineering Technology (ET)',
    subjectSinhala: 'ඉංජිනේරු තාක්ෂණවේදය',
    subjectId: 'sub_engineering_tech',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Technology',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '6.9 MB',
    pageCount: 224,
    downloadCount: 32900,
    color: 'from-cyan-600 to-blue-800',
    competencyCount: 16,
    summary: 'Civil engineering, mechanical engineering, electrical circuits, electronics, materials science, workshop technology, and technical drawing standards.',
    summarySinhala: 'සිවිල් ඉංජිනේරු විද්‍යාව, යාන්ත්‍රික විද්‍යාව, විද්‍යුත් පරිපථ, ඉලෙක්ට්‍රොනික විද්‍යාව සහ ඉංජිනේරු චිත්‍රණ ප්‍රමිති.',
    competencies: [
      { competencyNo: '1.0', description: 'Engineering Drawing, Orthographic & Isometric Projections', descriptionSinhala: 'ඉංජිනේරු චිත්‍රණය, සෘජුකෝණී හා සමමිතික ප්‍රක්ෂේප', periods: 35 },
      { competencyNo: '2.0', description: 'Materials Science, Stress-Strain & Hardness Testing', descriptionSinhala: 'ද්‍රව්‍ය විද්‍යාව, ආතති-වික්‍රියා සහ දෘඪතා පරීක්ෂා', periods: 30 },
      { competencyNo: '3.0', description: 'Electrical Technology, AC/DC Circuits & Motors', descriptionSinhala: 'විද්‍යුත් තාක්ෂණවේදය, ප්‍රත්‍යාවර්ත/සරල ධාරා සහ මෝටර', periods: 40 }
    ],
    keyFormulasAndConcepts: [
      'Stress σ = F / A, Strain ε = ΔL / L, Young\'s Modulus E = σ / ε',
      'Ohm\'s Law: V = IR, Electrical Power P = VI = I²R',
      'Hydraulic Force: F1 / A1 = F2 / A2'
    ]
  },
  {
    id: 'syl_al_et_pastpapers',
    title: 'G.C.E. A/L Engineering Technology 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ඉංජිනේරු තාක්ෂණවේදය පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர பொறியியல் தொழில்நுட்பம் கடந்த கால விනාத்தாள்கள்',
    subjectCode: 'AL-ET-PP',
    subjectName: 'Engineering Technology (ET)',
    subjectSinhala: 'ඉංජිනේරු තාක්ෂණවේදය',
    subjectId: 'sub_engineering_tech',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Technology',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '8.2 MB',
    pageCount: 218,
    downloadCount: 35100,
    color: 'from-blue-700 to-indigo-950',
    competencyCount: 12,
    summary: 'A/L Engineering Tech 50 MCQs and Structured Design/Calculation Questions with official marking schemes.',
    summarySinhala: 'ඉංජිනේරු තාක්ෂණවේදය බහුවරණ 50 සහ සැලසුම් ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L ET Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 ඉංජිනේරු තාක්ෂණවේදය ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 12 }
    ],
    keyFormulasAndConcepts: [
      'Gear Ratio = N_driven / N_driver = T_driver / T_driven'
    ]
  },

  // ==========================================
  // 9. A/L SCIENCE FOR TECHNOLOGY (SFT) (Tech Stream)
  // ==========================================
  {
    id: 'syl_al_sft_syllabus',
    title: 'G.C.E. A/L Science for Technology (SFT) Official NIE Resource Book',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ තාක්ෂණවේදය සඳහා විද්‍යාව (SFT) නිල සම්පත් පොත',
    titleTamil: 'க.பொ.த. உயர்தர தொழில்நுட்பத்திற்கான விஞ்ஞானம் வள நூல்',
    subjectCode: 'AL-SFT-11',
    subjectName: 'Science for Technology (SFT)',
    subjectSinhala: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    subjectId: 'sub_sft',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Technology',
    yearPublished: 2024,
    fileType: 'Resource Book',
    fileSize: '6.5 MB',
    pageCount: 198,
    downloadCount: 38200,
    color: 'from-orange-600 to-red-700',
    competencyCount: 14,
    summary: 'Applied physics, basic chemistry, biology for technology, mathematical foundations, and environmental technology concepts.',
    summarySinhala: 'ව්‍යවහාරික භෞතික විද්‍යාව, තාක්ෂණික රසායන විද්‍යාව, ජීව විද්‍යාව සහ පරිසර තාක්ෂණවේදය සම්පත් පොත.',
    competencies: [
      { competencyNo: '1.0', description: 'Applied Mechanics, Work, Energy & Power in Technology', descriptionSinhala: 'ව්‍යවහාරික යාන්ත්‍ර විද්‍යාව, කාර්යය, ශක්තිය සහ ක්ෂමතාව', periods: 30 },
      { competencyNo: '2.0', description: 'Industrial Chemistry, Polymers, Fertilizers & Metals Extraction', descriptionSinhala: 'කාර්මික රසායනය, බහුඅවයවික, පොහොර සහ ලෝහ නිස්සාරණය', periods: 35 },
      { competencyNo: '3.0', description: 'Biotechnology, Food Preservation & Microbiology in Industry', descriptionSinhala: 'ජෛව තාක්ෂණය, ආහාර කල්තබා ගැනීම සහ ක්ෂුද්‍රජීව විද්‍යාව', periods: 35 }
    ],
    keyFormulasAndConcepts: [
      'Power = Torque × Angular Velocity (P = τω)',
      'Efficiency η = (Useful Output / Total Input) × 100',
      'Enzyme Kinetics & Pasteurization Time-Temperature Curve'
    ]
  },
  {
    id: 'syl_al_sft_pastpapers',
    title: 'G.C.E. A/L Science for Technology 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ SFT පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. உயர்தர SFT கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'AL-SFT-PP',
    subjectName: 'Science for Technology (SFT)',
    subjectSinhala: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    subjectId: 'sub_sft',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    grade: 13,
    level: 'AL',
    stream: 'Technology',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.5 MB',
    pageCount: 190,
    downloadCount: 39500,
    color: 'from-red-600 to-amber-900',
    competencyCount: 12,
    summary: 'A/L SFT Paper I (50 MCQ) and Paper II (Structured & Calculation Essays) with official marking guide.',
    summarySinhala: 'SFT බහුවරණ 50 සහ රචනා ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 A/L SFT Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 SFT ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'SFT 50 MCQ time pacing strategies (120 mins)'
    ]
  },

  // ==========================================
  // 10. G.C.E. O/L SCIENCE (O/L Core Stream)
  // ==========================================
  {
    id: 'syl_ol_science',
    title: 'G.C.E. O/L Science Official Syllabus & Unit Summary Notes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ විද්‍යාව නිල විෂය නිර්දේශය සහ ඒකක කෙටි සටහන්',
    titleTamil: 'க.பொ.த. சாதாரண தர விஞ்ஞானம் பாடத்திட்டம்',
    subjectCode: 'OL-SCI-05',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සා.පෙළ)',
    subjectId: 'sub_ol_science',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '3.9 MB',
    pageCount: 115,
    downloadCount: 52000,
    color: 'from-teal-600 to-cyan-800',
    competencyCount: 20,
    summary: 'Full Grades 10–11 core curriculum covering Biology, Chemistry, and Physics modules for G.C.E. O/L exam preparation.',
    summarySinhala: '10 සහ 11 ශ්‍රේණිවල විද්‍යා විෂය නිර්දේශයේ සියලුම ඒකක, ප්‍රායෝගික ක්‍රියාකාරකම් සහ විභාග ප්‍රශ්න රටා.',
    competencies: [
      { competencyNo: '1.0', description: 'Living Cell Structure & Microorganisms', descriptionSinhala: 'ජීවී සෛලයේ ව්‍යුහය සහ ක්ෂුද්‍ර ජීවීන්', periods: 20 },
      { competencyNo: '2.0', description: 'Chemical Reactions, Acids & Bases', descriptionSinhala: 'රසායනික ප්‍රතික්‍රියා, අම්ල සහ භස්ම', periods: 25 },
      { competencyNo: '3.0', description: 'Force, Work, Energy & Simple Machines', descriptionSinhala: 'බලය, කාර්යය, ශක්තිය සහ සරල යන්ත්‍ර', periods: 30 },
      { competencyNo: '4.0', description: 'Current Electricity & Magnetism', descriptionSinhala: 'ධාරා විද්‍යුතය සහ චුම්භකත්වය', periods: 25 },
    ],
    keyFormulasAndConcepts: [
      'Force: F = ma',
      'Work: W = F * d, Power: P = W / t = VI',
      'Ohm\'s Law: V = IR',
      'Photosynthesis: 6CO2 + 6H2O -> C6H12O6 + 6O2'
    ]
  },
  {
    id: 'syl_ol_science_pastpapers',
    title: 'G.C.E. O/L Science 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ විද්‍යාව පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. சாதாரண தர விஞ்ஞானம் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'OL-SCI-PP',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සා.පෙළ)',
    subjectId: 'sub_ol_science',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.1 MB',
    pageCount: 160,
    downloadCount: 54300,
    color: 'from-cyan-700 to-blue-900',
    competencyCount: 18,
    summary: 'O/L Science Paper I (40 MCQ) and Paper II (Structured & Essay) with Department of Examinations official marking schemes.',
    summarySinhala: 'සා.පෙළ විද්‍යාව බහුවරණ 40 සහ ව්‍යුහගත/රචනා ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 O/L Science Paper I & II with Marking Scheme', descriptionSinhala: '2024 සා.පෙළ විද්‍යාව ප්‍රශ්න පත්‍රය සහ ලකුණු දීමේ පටිපාටිය', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'O/L Science 40 MCQs in 60 minutes pacing'
    ]
  },
  {
    id: 'syl_ol_science_shortnotes',
    title: 'O/L Science Complete Formula Sheet & Unit Revision Short Notes',
    titleSinhala: 'සාමාන්‍ය පෙළ විද්‍යාව සියලුම සූත්‍ර සංග්‍රහය සහ ඒකක කෙටි සටහන්',
    titleTamil: 'சாதாரண தர விஞ்ஞானம் சுருக்கக் குறிப்புகள்',
    subjectCode: 'OL-SCI-SN',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සා.පෙළ)',
    subjectId: 'sub_ol_science',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '3.2 MB',
    pageCount: 60,
    downloadCount: 48900,
    color: 'from-teal-500 to-emerald-800',
    competencyCount: 18,
    summary: 'Quick memory flashcards and formulas for all Grade 10 & 11 Science units.',
    summarySinhala: '10 සහ 11 ශ්‍රේණිවල විද්‍යා පාඩම් වල සූත්‍ර, රූපසටහන් හා කෙටි සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Grade 10 & 11 Science Core Formulas & Definitions', descriptionSinhala: 'විද්‍යා මූලික සූත්‍ර සහ අර්ථදැක්වීම්', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'Density ρ = m / V, Pressure P = F / A = hρg',
      'Refractive Index n = sin(i) / sin(r) = c / v'
    ]
  },

  // ==========================================
  // 11. G.C.E. O/L MATHEMATICS (O/L Core Stream)
  // ==========================================
  {
    id: 'syl_ol_maths',
    title: 'G.C.E. O/L Mathematics Teacher Guide & Formula Reference Book',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ගණිතය ගුරු මාර්ගෝපදේශය සහ සූත්‍ර සංග්‍රහය',
    titleTamil: 'க.பொ.த. சாதாரண தர கணிதம் வழிகாட்டி',
    subjectCode: 'OL-MAT-06',
    subjectName: 'Mathematics (O/L)',
    subjectSinhala: 'ගණිතය (සා.පෙළ)',
    subjectId: 'sub_ol_maths',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'Guru Potha (Teacher Guide)',
    fileSize: '4.2 MB',
    pageCount: 130,
    downloadCount: 49800,
    color: 'from-purple-600 to-indigo-800',
    competencyCount: 22,
    summary: 'Arithmetic, Algebra, Geometry, Trigonometry, Statistics, and Probability modules according to the national curriculum.',
    summarySinhala: 'අංක ගණිතය, වීජ ගණිතය, ජ්‍යාමිතිය, ත්‍රිකෝණමිතිය, සංඛ්‍යානය සහ සම්භාවිතාව පිළිබඳ විභාග මට්ටමේ මාර්ගෝපදේශය.',
    competencies: [
      { competencyNo: '1.0', description: 'Percentages, Compound Interest & Taxation', descriptionSinhala: 'ප්‍රතිශත, වැල් පොලිය සහ බදු ගණනය', periods: 25 },
      { competencyNo: '2.0', description: 'Quadratic Equations, Factors & Graphs', descriptionSinhala: 'වර්ගජ සමීකරණ, සාධක සහ ප්‍රස්තාර', periods: 35 },
      { competencyNo: '3.0', description: 'Geometric Theorems on Triangles & Circles', descriptionSinhala: 'ත්‍රිකෝණ සහ වෘත්ත ආශ්‍රිත ජ්‍යාමිතික ප්‍රමේයයන්', periods: 40 },
      { competencyNo: '4.0', description: 'Trigonometric Ratios & Angles of Elevation/Depression', descriptionSinhala: 'ත්‍රිකෝණමිතික අනුපාත, ආරෝහණ සහ අවරෝහණ කෝණ', periods: 20 },
    ],
    keyFormulasAndConcepts: [
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)',
      'Circle Area = πr², Circumference = 2πr',
      'Pythagoras: c² = a² + b²',
      'Mean x̄ = Σfx / Σf'
    ]
  },
  {
    id: 'syl_ol_maths_pastpapers',
    title: 'G.C.E. O/L Mathematics 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ගණිතය පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. சாதாரண தர கணிதம் கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'OL-MAT-PP',
    subjectName: 'Mathematics (O/L)',
    subjectSinhala: 'ගණිතය (සා.පෙළ)',
    subjectId: 'sub_ol_maths',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '7.8 MB',
    pageCount: 180,
    downloadCount: 56100,
    color: 'from-indigo-700 to-purple-950',
    competencyCount: 22,
    summary: 'O/L Mathematics Paper I (Part A & B) and Paper II (Part A & B) with Department of Examinations official step marking schemes.',
    summarySinhala: 'සා.පෙළ ගණිතය Paper I සහ Paper II විභාග ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 O/L Mathematics Paper I & II with Step Marking', descriptionSinhala: '2024 සා.පෙළ ගණිතය ප්‍රශ්න පත්‍රය සහ පියවර ලකුණු ක්‍රමය', periods: 12 }
    ],
    keyFormulasAndConcepts: [
      'Geometric rider proof templates and step marks allocations'
    ]
  },

  // ==========================================
  // 12. G.C.E. O/L HISTORY (O/L Core Stream)
  // ==========================================
  {
    id: 'syl_ol_history_syllabus',
    title: 'G.C.E. O/L History Official NIE Syllabus & Teacher Guide',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ඉතිහාසය නිල විෂය නිර්දේශය සහ ගුරු මාර්ගෝපදේශය',
    titleTamil: 'க.பொ.த. சாதாரண தர வரலாறு வழிகாட்டி',
    subjectCode: 'OL-HIST-22',
    subjectName: 'History (O/L)',
    subjectSinhala: 'ඉතිහාසය (සා.පෙළ)',
    subjectId: 'sub_ol_history',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '3.8 MB',
    pageCount: 122,
    downloadCount: 41200,
    color: 'from-amber-600 to-yellow-800',
    competencyCount: 16,
    summary: 'Ancient civilizations, Anuradhapura, Polonnaruwa, Dambadeniya, Kotte, Kandyan Kingdom, British rule, and Sri Lankan constitutional independence history.',
    summarySinhala: 'අනුරාධපුර, පොළොන්නරුව, මහනුවර යුග, යටත් විජිත පාලනය සහ නිදහස් අරගලය ඉතිහාසය.',
    competencies: [
      { competencyNo: '1.0', description: 'Sources of Sri Lankan History & Early Settlements', descriptionSinhala: 'ඉතිහාස මූලාශ්‍ර සහ මුල් ජනාවාස', periods: 20 },
      { competencyNo: '2.0', description: 'Hydraulic Civilization & Ancient Kingdoms', descriptionSinhala: 'වාරි ශිෂ්ටාචාරය සහ පුරාණ රාජධානි', periods: 35 },
      { competencyNo: '3.0', description: 'Colonial Era (Portuguese, Dutch, British) & 1818/1848 Rebellions', descriptionSinhala: 'යටත් විජිත යුගය සහ 1818, 1848 නිදහස් සටන්', periods: 40 }
    ],
    keyFormulasAndConcepts: [
      'Mahavamsa, Dipavamsa, Inscriptions (Brahmi, Rock, Slab)',
      '1815 Kandyan Convention, 1948 Independence Constitution'
    ]
  },
  {
    id: 'syl_ol_history_pastpapers',
    title: 'G.C.E. O/L History 2018-2024 Past Papers & Map Marking Schemes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ඉතිහාසය පසුගිය ප්‍රශ්න පත්‍ර සහ සිතියම් ලකුණු කිරීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. சாதாரண தர வரலாறு கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'OL-HIST-PP',
    subjectName: 'History (O/L)',
    subjectSinhala: 'ඉතිහාසය (සා.පෙළ)',
    subjectId: 'sub_ol_history',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '6.4 MB',
    pageCount: 150,
    downloadCount: 43200,
    color: 'from-amber-700 to-yellow-950',
    competencyCount: 14,
    summary: 'O/L History Paper I (40 MCQ) and Paper II (Map Marking & Essay Questions) with official marking scheme.',
    summarySinhala: 'සා.පෙළ ඉතිහාසය බහුවරණ 40 සහ ලංකා/ලෝක සිතියම් ලකුණු කිරීමේ නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 O/L History Paper I & II with Map Keys', descriptionSinhala: '2024 සා.පෙළ ඉතිහාසය ප්‍රශ්න පත්‍රය සහ සිතියම් සටහන්', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'Sri Lanka & World Map Marking (12 Marks Guaranteed in Part II)'
    ]
  },

  // ==========================================
  // 13. G.C.E. O/L ICT (O/L Electives)
  // ==========================================
  {
    id: 'syl_ol_ict_syllabus',
    title: 'G.C.E. O/L ICT NIE Syllabus, Teacher Guide & HTML Cheatsheet',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ තොරතුරු තාක්ෂණය (ICT) නිල විෂය නිර්දේශය සහ HTML කෙටි සටහන්',
    titleTamil: 'க.பொ.த. சாதாரண தர ICT பாடத்திட்டம்',
    subjectCode: 'OL-ICT-23',
    subjectName: 'Information & Communication Tech (ICT)',
    subjectSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
    subjectId: 'sub_ol_ict',
    streamId: 'stream_ol_electives',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'Electives',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '4.1 MB',
    pageCount: 134,
    downloadCount: 44500,
    color: 'from-blue-600 to-cyan-700',
    competencyCount: 14,
    summary: 'Computer hardware, software, number systems (Binary/Hex), logic gates, flowcharts, algorithms, HTML web design, and database basics.',
    summarySinhala: 'පරිගණක දෘඩාංග, ද්වීමය සංඛ්‍යා, තාර්කික ද්වාර, ගැලීම් සටහන්, ඇල්ගොරිතම සහ HTML වෙබ් නිර්මාණය.',
    competencies: [
      { competencyNo: '1.0', description: 'Computer Architecture, CPU, Memory & Storage', descriptionSinhala: 'පරිගණක ගෘහ නිර්මාණ ශිල්පය, CPU, මතකය සහ ආචයනය', periods: 25 },
      { competencyNo: '2.0', description: 'Number Systems (Binary, Octal, Hex) & Logic Gates (AND, OR, NOT)', descriptionSinhala: 'සංඛ්‍යා පද්ධති සහ තාර්කික ද්වාර', periods: 30 },
      { competencyNo: '3.0', description: 'Algorithms, Flowcharts, Pseudocode & Python Basics', descriptionSinhala: 'ඇල්ගොරිතම, ගැලීම් සටහන් සහ පයිතන් මූලික', periods: 35 },
      { competencyNo: '4.0', description: 'HTML5 Web Authoring & Relational Database (DBMS)', descriptionSinhala: 'HTML5 වෙබ් නිර්මාණය සහ දත්ත සමුදාය', periods: 30 }
    ],
    keyFormulasAndConcepts: [
      'Logic Gates: AND (A·B), OR (A+B), NOT (Ā), XOR (A⊕B)',
      'Binary to Decimal conversion & 2\'s complement',
      'HTML: <table>, <tr>, <td>, <th>, <a>, <img>, <form>'
    ]
  },
  {
    id: 'syl_ol_ict_pastpapers',
    title: 'G.C.E. O/L ICT 2018-2024 Past Papers & Marking Schemes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ICT පසුගිය ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටි',
    titleTamil: 'க.பொ.த. சாதாரண தர ICT கடந்த கால வினாத்தாள்கள்',
    subjectCode: 'OL-ICT-PP',
    subjectName: 'Information & Communication Tech (ICT)',
    subjectSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
    subjectId: 'sub_ol_ict',
    streamId: 'stream_ol_electives',
    categoryId: 'ol',
    grade: 11,
    level: 'OL',
    stream: 'Electives',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '6.9 MB',
    pageCount: 164,
    downloadCount: 46200,
    color: 'from-cyan-700 to-blue-950',
    competencyCount: 12,
    summary: 'O/L ICT 40 MCQs and 5 Structured Practical/Coding Problems with official marking schemes.',
    summarySinhala: 'සා.පෙළ ICT බහුවරණ 40 සහ ක්‍රමලේඛන/වෙබ් නිර්මාණ ප්‍රශ්න පත්‍ර නිල ලකුණු ක්‍රමය.',
    competencies: [
      { competencyNo: 'PP-1', description: '2024 O/L ICT Paper I & II with Evaluation Criteria', descriptionSinhala: '2024 සා.පෙළ ICT ප්‍රශ්න පත්‍රය සහ ඇගයීම් වාර්තාව', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'Flowchart symbols and truth table evaluations'
    ]
  },

  // ==========================================
  // 14. JUNIOR SECONDARY SCIENCE (Grades 6-9)
  // ==========================================
  {
    id: 'syl_junior_sci_syllabus',
    title: 'Junior Secondary Science (Grades 6-9) National Curriculum Framework',
    titleSinhala: 'කණිෂ්ඨ අංශය විද්‍යාව (6 - 9 ශ්‍රේණි) නිල විෂය නිර්දේශය සහ ගුරු මාර්ගෝපදේශය',
    titleTamil: 'இடைநிலைப் பிரிவு விஞ்ஞானம் (தரம் 6-9) பாடத்திட்டம்',
    subjectCode: 'JUN-SCI-30',
    subjectName: 'Junior General Science',
    subjectSinhala: 'කණිෂ්ඨ විද්‍යාව (6-9 ශ්‍රේණි)',
    subjectId: 'sub_junior_science',
    streamId: 'stream_junior_foundation',
    categoryId: 'junior',
    grade: 8,
    level: 'JUNIOR',
    stream: 'Junior Foundation',
    yearPublished: 2024,
    fileType: 'NIE Syllabus',
    fileSize: '3.5 MB',
    pageCount: 110,
    downloadCount: 28900,
    color: 'from-emerald-600 to-teal-800',
    competencyCount: 16,
    summary: 'Foundational concepts in living organisms, plant parts, water cycle, states of matter, simple electrical circuits, light, sound, and energy.',
    summarySinhala: 'ජීවීන්ගේ ලක්ෂණ, ශාක කොටස්, ජල චක්‍රය, පදාර්ථයේ අවස්ථා, සරල විද්‍යුත් පරිපථ, ආලෝකය සහ ශබ්දය.',
    competencies: [
      { competencyNo: '1.0', description: 'Diversity of Life & Plant/Animal Classification', descriptionSinhala: 'ජීවීන්ගේ විවිධත්වය සහ ශාක/සත්ත්ව වර්ගීකරණය', periods: 25 },
      { competencyNo: '2.0', description: 'Matter, Density, Solubility & Mixtures Separation', descriptionSinhala: 'පදාර්ථය, ඝනත්වය සහ මිශ්‍රණ වෙන්කිරීම', periods: 25 },
      { competencyNo: '3.0', description: 'Light Reflection, Refraction & Sound Waves', descriptionSinhala: 'ආලෝකය පරාවර්තනය, වර්තනය සහ ශබ්ද තරංග', periods: 20 }
    ],
    keyFormulasAndConcepts: [
      'States of Matter (Solid, Liquid, Gas)',
      'Series & Parallel Circuit Connections',
      'Food Chains & Energy Pyramids'
    ]
  },
  {
    id: 'syl_junior_sci_shortnotes',
    title: 'Junior Science Illustrated Mind Maps & Activity Workbook',
    titleSinhala: 'කණිෂ්ඨ විද්‍යාව චිත්‍ර සහිත කෙටි සටහන් සහ ප්‍රශ්නාවලී අත්පොත',
    titleTamil: 'இடைநிலை விஞ்ஞானம் சுருக்கக் குறிப்புகள்',
    subjectCode: 'JUN-SCI-SN',
    subjectName: 'Junior General Science',
    subjectSinhala: 'කණිෂ්ඨ විද්‍යාව (6-9 ශ්‍රේණි)',
    subjectId: 'sub_junior_science',
    streamId: 'stream_junior_foundation',
    categoryId: 'junior',
    grade: 8,
    level: 'JUNIOR',
    stream: 'Junior Foundation',
    yearPublished: 2024,
    fileType: 'Summary Notes',
    fileSize: '2.8 MB',
    pageCount: 52,
    downloadCount: 27400,
    color: 'from-teal-500 to-emerald-700',
    competencyCount: 12,
    summary: 'Fun illustrated diagrams of cell structures, the water cycle, human digestion, and magnet experiments.',
    summarySinhala: 'පාසල් වාර විභාග සඳහා රූපසටහන් සහිත විද්‍යා කෙටි සටහන්.',
    competencies: [
      { competencyNo: 'SN-1', description: 'Illustrated Middle School Science Cheat Sheets', descriptionSinhala: 'චිත්‍ර සහිත විද්‍යා සාරාංශ සටහන්', periods: 10 }
    ],
    keyFormulasAndConcepts: [
      'Speed = Distance / Time',
      'Photosynthesis Word Equation'
    ]
  },

  // ==========================================
  // 15. UNIVERSITY COMPUTING (Higher Undergrad)
  // ==========================================
  {
    id: 'syl_uni_dsa_resource',
    title: 'University Data Structures, Algorithms & System Design Handbook',
    titleSinhala: 'සරසවි දත්ත ව්‍යුහ, ඇල්ගොරිතම සහ පද්ධති සැලසුම් විෂය අත්පොත',
    titleTamil: 'பல்கலைக்கழக தரவுக் கட்டமைப்புகள் மற்றும் வழிமுறைகள் வழிகாட்டி',
    subjectCode: 'UNI-CS-40',
    subjectName: 'Data Structures & Algorithms (DSA)',
    subjectSinhala: 'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම',
    subjectId: 'sub_uni_dsa',
    streamId: 'stream_uni_computing',
    categoryId: 'uni',
    grade: 'UG',
    level: 'CAMPUS',
    stream: 'Undergraduate Computing',
    yearPublished: 2024,
    fileType: 'Resource Book',
    fileSize: '7.4 MB',
    pageCount: 240,
    downloadCount: 31800,
    color: 'from-purple-600 to-violet-900',
    competencyCount: 12,
    summary: 'Arrays, Linked Lists, Trees (BST, AVL, Red-Black), Graphs (Dijkstra, Prim, Kruskal), Dynamic Programming, and Big-O Complexity Analysis.',
    summarySinhala: 'දත්ත ව්‍යුහ (Arrays, Trees, Graphs), ඇල්ගොරිතම සංකීර්ණතාව (Big-O) සහ ගතික ක්‍රමලේඛනය (DP).',
    competencies: [
      { competencyNo: '1.0', description: 'Asymptotic Analysis & Big-O Notation (Time & Space)', descriptionSinhala: 'කාල හා අවකාශ සංකීර්ණතා විශ්ලේෂණය (Big-O)', periods: 20 },
      { competencyNo: '2.0', description: 'Trees & Graph Traversal (DFS, BFS, Shortest Paths)', descriptionSinhala: 'ගස් හා ප්‍රස්ථාර සැරිසැරීම (DFS, BFS, Dijkstra)', periods: 35 },
      { competencyNo: '3.0', description: 'Dynamic Programming, Memoization & Greedy Algorithms', descriptionSinhala: 'ගතික ක්‍රමලේඛනය සහ ලෝභී ඇල්ගොරිතම', periods: 40 }
    ],
    keyFormulasAndConcepts: [
      'Master Theorem: T(n) = aT(n/b) + f(n)',
      'Binary Search: O(log n), MergeSort: O(n log n)',
      'Dijkstra\'s Algorithm with Min-Heap Priority Queue: O((V + E) log V)'
    ]
  },
  {
    id: 'syl_uni_dsa_pastpapers',
    title: 'University Computing Past Semester Papers & Model Coding Solutions',
    titleSinhala: 'සරසවි පරිගණක විද්‍යා පසුගිය අධ්‍යයන වාර ප්‍රශ්න පත්‍ර සහ කේත විසඳුම්',
    titleTamil: 'பல்கலைக்கழக செமஸ்டர் வினாத்தாள்கள்',
    subjectCode: 'UNI-CS-PP',
    subjectName: 'Data Structures & Algorithms (DSA)',
    subjectSinhala: 'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම',
    subjectId: 'sub_uni_dsa',
    streamId: 'stream_uni_computing',
    categoryId: 'uni',
    grade: 'UG',
    level: 'CAMPUS',
    stream: 'Undergraduate Computing',
    yearPublished: 2024,
    fileType: 'Past Paper PDF',
    fileSize: '8.1 MB',
    pageCount: 195,
    downloadCount: 29400,
    color: 'from-violet-700 to-slate-900',
    competencyCount: 10,
    summary: 'Past semester examination papers with step-by-step pseudo-code and C++/Python/Java implementations.',
    summarySinhala: 'විශ්වවිද්‍යාල අධ්‍යයන වාර විභාග ප්‍රශ්න පත්‍ර සහ C++/Python විසඳුම්.',
    competencies: [
      { competencyNo: 'PP-1', description: 'Semester Exam Algorithms & Complexity Papers with Solutions', descriptionSinhala: 'අධ්‍යයන වාර විභාග ප්‍රශ්න පත්‍ර සහ ක්‍රමලේඛන විසඳුම්', periods: 15 }
    ],
    keyFormulasAndConcepts: [
      '0/1 Knapsack Problem DP Matrix Transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])'
    ]
  }
];
