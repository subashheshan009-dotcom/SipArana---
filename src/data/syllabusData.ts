export interface SyllabusItem {
  id: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  subjectCode: string;
  subjectName: string;
  subjectSinhala: string;
  grade: number;
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
  // 1. A/L Combined Mathematics
  {
    id: 'syl_al_maths',
    title: 'G.C.E. A/L Combined Mathematics Official NIE Syllabus & Guru Potha',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ සංයුක්ත ගණිතය නිල විෂය නිර්දේශය සහ ගුරු මාර්ගෝපදේශය',
    titleTamil: 'க.பொ.த. உயர்தர இணைந்த கணிதம் தேசிய பாடத்திட்டம்',
    subjectCode: 'AL-CM-01',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
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

  // 2. A/L Physics
  {
    id: 'syl_al_physics',
    title: 'G.C.E. A/L Physics NIE Resource Book & Practical Handbook',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ භෞතික විද්‍යාව සම්පත් පොත සහ ප්‍රායෝගික පරීක්ෂණ අත්පොත',
    titleTamil: 'க.பொ.த. உயர்தர பௌதிகவியல் வள நூல்',
    subjectCode: 'AL-PHY-02',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
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

  // 3. A/L Chemistry
  {
    id: 'syl_al_chem',
    title: 'G.C.E. A/L Chemistry National Teacher Guide & Organic Summaries',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ රසායන විද්‍යාව ගුරු මාර්ගෝපදේශය සහ කාබනික ප්‍රතික්‍රියා සටහන්',
    titleTamil: 'க.பொ.த. உயர்தர இரசாயனவியல் ஆசிரியர் வழிகாட்டி',
    subjectCode: 'AL-CHE-03',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
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

  // 4. A/L Biology
  {
    id: 'syl_al_bio',
    title: 'G.C.E. A/L Biology Official Resource Book (Units 1 - 10)',
    titleSinhala: 'අ.පො.ස. උසස් පෙළ ජීව විද්‍යාව නිල සම්පත් පොත (ඒකක 1 - 10)',
    titleTamil: 'க.பொ.த. உயர்தர உயிரியல் உத்தியோகபூர்வ வள நூல்',
    subjectCode: 'AL-BIO-04',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
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

  // 5. G.C.E. O/L Science
  {
    id: 'syl_ol_science',
    title: 'G.C.E. O/L Science Official Syllabus & Unit Summary Notes',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ විද්‍යාව නිල විෂය නිර්දේශය සහ ඒකක කෙටි සටහන්',
    titleTamil: 'க.பொ.த. சாதாரண தர விஞ்ஞானம் பாடத்திட்டம்',
    subjectCode: 'OL-SCI-05',
    subjectName: 'Science (O/L)',
    subjectSinhala: 'විද්‍යාව (සා.පෙළ)',
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

  // 6. G.C.E. O/L Mathematics
  {
    id: 'syl_ol_maths',
    title: 'G.C.E. O/L Mathematics Teacher Guide & Formula Reference Book',
    titleSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ ගණිතය ගුරු මාර්ගෝපදේශය සහ සූත්‍ර සංග්‍රහය',
    titleTamil: 'க.பொ.த. சாதாரண தர கணிதம் வழிகாட்டி',
    subjectCode: 'OL-MAT-06',
    subjectName: 'Mathematics (O/L)',
    subjectSinhala: 'ගණිතය (සා.පෙළ)',
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
  }
];
