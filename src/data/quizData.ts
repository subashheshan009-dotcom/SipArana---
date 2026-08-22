export interface MCQQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionTextSinhala: string;
  questionTextTamil?: string;
  codeSnippet?: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    textSinhala: string;
    textTamil?: string;
  }[];
  correctOptionId: string;
  explanation: string;
  explanationSinhala: string;
  explanationTamil?: string;
  guruPothaRef: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UnitQuiz {
  id: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  subjectId: string;
  subjectName: string;
  subjectSinhala: string;
  grade: number;
  stream: string;
  unitNumber: number;
  timeLimitMinutes: number;
  totalMarks: number;
  xpReward: number;
  iconName: string;
  color: string;
  description: string;
  descriptionSinhala: string;
  questions: MCQQuestion[];
}

export const UNIT_QUIZZES_DATA: UnitQuiz[] = [
  // 1. A/L Combined Mathematics - Integration & Calculus
  {
    id: 'quiz_cm_calculus_01',
    title: 'Definite Integration & Differential Calculus',
    titleSinhala: 'නියත අනුකලනය සහ අවකලන යෙදීම්',
    titleTamil: 'தொகையீட்டு மற்றும் வகையீட்டு கணிதம்',
    subjectId: 'sub_combined_maths',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    grade: 13,
    stream: 'Physical Science (Maths)',
    unitNumber: 4,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-700',
    description: 'Test your mastery on integration by parts, substitution, limits, and rate of change problems.',
    descriptionSinhala: 'කොටස් වශයෙන් අනුකලනය, ආදේශ ක්‍රම සහ සීමා පිළිබඳ අ.පො.ස. උසස් පෙළ බහුවරණ පරීක්ෂණය.',
    questions: [
      {
        id: 'q_cm_1',
        questionNumber: 1,
        questionText: 'Evaluate the definite integral ∫ (from 0 to π/2) of sin(x) cos(x) dx:',
        questionTextSinhala: '∫ (0 සිට π/2 දක්වා) sin(x) cos(x) dx හි අගය සොයන්න:',
        options: [
          { id: 'opt_1', text: '1/2', textSinhala: '1/2' },
          { id: 'opt_2', text: '1', textSinhala: '1' },
          { id: 'opt_3', text: '1/4', textSinhala: '1/4' },
          { id: 'opt_4', text: '0', textSinhala: '0' },
          { id: 'opt_5', text: 'π/4', textSinhala: 'π/4' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Using identity sin(x)cos(x) = (1/2)sin(2x), ∫ (1/2)sin(2x) dx = [-1/4 cos(2x)] from 0 to π/2 = (-1/4)(-1 - 1) = 1/2.',
        explanationSinhala: 'sin(x)cos(x) = (1/2)sin(2x) ත්‍රිකෝණමිතික සර්වසාම්‍යය භාවිතයෙන්: ∫ (1/2)sin(2x) dx = [-1/4 cos(2x)] |(0->π/2) = -1/4(-1 - 1) = 1/2 ලැබේ.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 08 Integration',
        topic: 'Integration by Substitution',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_2',
        questionNumber: 2,
        questionText: 'Find the derivative d/dx [ln(x² + 1)] at x = 1:',
        questionTextSinhala: 'x = 1 දී d/dx [ln(x² + 1)] හි අගය වන්නේ:',
        options: [
          { id: 'opt_1', text: '1', textSinhala: '1' },
          { id: 'opt_2', text: '2', textSinhala: '2' },
          { id: 'opt_3', text: '1/2', textSinhala: '1/2' },
          { id: 'opt_4', text: 'ln(2)', textSinhala: 'ln(2)' },
          { id: 'opt_5', text: '2/ln(2)', textSinhala: '2/ln(2)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Chain rule: d/dx[ln(x² + 1)] = 2x / (x² + 1). At x = 1, (2*1) / (1 + 1) = 2/2 = 1.',
        explanationSinhala: 'දාම නීතිය අනුව: d/dx[ln(x² + 1)] = 2x / (x² + 1). x = 1 ආදේශ කළ විට: (2*1) / (1 + 1) = 2/2 = 1.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 07 Differentiation',
        topic: 'Chain Rule Differentiation',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_3',
        questionNumber: 3,
        questionText: 'The root of equation x² - (k+2)x + 4 = 0 are real and equal. What are the possible values of k?',
        questionTextSinhala: 'x² - (k+2)x + 4 = 0 සමීකරණයේ මූල තාත්වික හා සමාන නම්, k හි අගයන් වන්නේ:',
        options: [
          { id: 'opt_1', text: 'k = 2 or k = -6', textSinhala: 'k = 2 හෝ k = -6' },
          { id: 'opt_2', text: 'k = 4 or k = -4', textSinhala: 'k = 4 හෝ k = -4' },
          { id: 'opt_3', text: 'k = 0 only', textSinhala: 'k = 0 පමණි' },
          { id: 'opt_4', text: 'k = 6 or k = -2', textSinhala: 'k = 6 හෝ k = -2' },
          { id: 'opt_5', text: 'k = 1 or k = -3', textSinhala: 'k = 1 හෝ k = -3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'For equal roots, discriminant Δ = b² - 4ac = 0 => (k+2)² - 4(1)(4) = 0 => (k+2)² = 16 => k+2 = ±4 => k = 2 or k = -6.',
        explanationSinhala: 'මූල සමාන වන විට විවේචකය Δ = b² - 4ac = 0 වේ. (k+2)² - 16 = 0 => (k+2) = ±4 => k = 2 හෝ k = -6.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 02 Quadratic Equations',
        topic: 'Quadratic Discriminants',
        difficulty: 'Medium'
      },
      {
        id: 'q_cm_4',
        questionNumber: 4,
        questionText: 'Evaluate limit as x -> 0 of (sin 3x) / (2x):',
        questionTextSinhala: 'x -> 0 වන විට (sin 3x) / (2x) හි සීමාව (limit) වන්නේ:',
        options: [
          { id: 'opt_1', text: '3/2', textSinhala: '3/2' },
          { id: 'opt_2', text: '2/3', textSinhala: '2/3' },
          { id: 'opt_3', text: '1', textSinhala: '1' },
          { id: 'opt_4', text: '0', textSinhala: '0' },
          { id: 'opt_5', text: '3', textSinhala: '3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'lim (x->0) [sin(3x)/(3x)] * (3/2) = 1 * (3/2) = 3/2.',
        explanationSinhala: 'lim (x->0) [sin(3x)/(3x)] * (3/2) = 1 * (3/2) = 3/2 (ප්‍රමත සීමාව sin θ / θ = 1 භාවිතයෙන්).',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 06 Limits',
        topic: 'Trigonometric Limits',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_5',
        questionNumber: 5,
        questionText: 'What is the sum to infinity of the geometric progression 4, 4/3, 4/9, 4/27... ?',
        questionTextSinhala: '4, 4/3, 4/9, 4/27... ගුණෝත්තර ශ්‍රේණියේ අනන්තය දක්වා ඓක්‍යය (S∞) සොයන්න:',
        options: [
          { id: 'opt_1', text: '6', textSinhala: '6' },
          { id: 'opt_2', text: '8', textSinhala: '8' },
          { id: 'opt_3', text: '12', textSinhala: '12' },
          { id: 'opt_4', text: '16/3', textSinhala: '16/3' },
          { id: 'opt_5', text: '4.5', textSinhala: '4.5' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'First term a = 4, common ratio r = 1/3. S∞ = a / (1 - r) = 4 / (1 - 1/3) = 4 / (2/3) = 6.',
        explanationSinhala: 'පළමු පදය a = 4, පොදු අනුපාතය r = 1/3. අනන්ත ඓක්‍යය S∞ = a / (1 - r) = 4 / (1 - 1/3) = 4 / (2/3) = 6 වේ.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 04 Series & Progressions',
        topic: 'Geometric Series',
        difficulty: 'Medium'
      }
    ]
  },

  // 2. A/L Physics - Mechanics & Circular Motion
  {
    id: 'quiz_phys_mechanics_01',
    title: 'Newtonian Mechanics & Circular Motion',
    titleSinhala: 'නිව්ටෝනියානු යාන්ත්‍ර විද්‍යාව සහ වෘත්ත චලිතය',
    titleTamil: 'நியூட்டனின் இயக்கவியல் மற்றும் வட்ட இயக்கம்',
    subjectId: 'sub_physics',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    grade: 12,
    stream: 'Physical Science (Maths)',
    unitNumber: 2,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Zap',
    color: 'from-amber-600 to-orange-700',
    description: 'Master Newton laws, circular motion, angular momentum, and energy conservation.',
    descriptionSinhala: 'බලය, ඝර්ෂණය, කේන්ද්‍රාභිසාරී බලය සහ ගම්‍යතා සංස්ථිතිය පිළිබඳ ආදර්ශ ගැටලු.',
    questions: [
      {
        id: 'q_phy_1',
        questionNumber: 1,
        questionText: 'A car of mass 1000 kg moves at 20 m/s around a circular curve of radius 100 m on a flat road. What is the required centripetal force?',
        questionTextSinhala: 'ස්කන්ධය 1000 kg වන මෝටර් රථයක් 100 m අරයක් ඇති තිරස් වෘත්තාකාර මාර්ගයක 20 m/s වේගයෙන් ගමන් කරයි නම්, අවශ්‍ය කේන්ද්‍රාභිසාරී බලය කොපමණද?',
        options: [
          { id: 'opt_1', text: '4000 N', textSinhala: '4000 N' },
          { id: 'opt_2', text: '2000 N', textSinhala: '2000 N' },
          { id: 'opt_3', text: '8000 N', textSinhala: '8000 N' },
          { id: 'opt_4', text: '200 N', textSinhala: '200 N' },
          { id: 'opt_5', text: '400 N', textSinhala: '400 N' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'F = mv²/r = (1000 * 20²) / 100 = (1000 * 400) / 100 = 4000 N provided by road friction.',
        explanationSinhala: 'කේන්ද්‍රාභිසාරී බලය F = mv²/r = (1000 * 20²) / 100 = (1000 * 400) / 100 = 4000 N වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 02 Mechanics',
        topic: 'Circular Motion',
        difficulty: 'Easy'
      },
      {
        id: 'q_phy_2',
        questionNumber: 2,
        questionText: 'When an object of mass m falls through a viscous fluid, its terminal velocity (v_t) is directly proportional to:',
        questionTextSinhala: 'ස්කන්ධය m වන වස්තුවක් දුස්ස්‍රාවී තරලයක් තුළින් වැටෙන විට, එහි අන්ත ප්‍රවේගය (v_t) අනුලෝමව සමානුපාතික වන්නේ:',
        options: [
          { id: 'opt_1', text: 'Square of radius (r²)', textSinhala: 'අරයේ වර්ගයට (r²)' },
          { id: 'opt_2', text: 'Radius (r)', textSinhala: 'අරයට (r)' },
          { id: 'opt_3', text: 'Square root of radius (√r)', textSinhala: 'අරයේ වර්ගමූලයට (√r)' },
          { id: 'opt_4', text: 'Viscosity coefficient (η)', textSinhala: 'දුස්ස්‍රාවිතා සංගුණකයට (η)' },
          { id: 'opt_5', text: '1/r²', textSinhala: '1/r² ට' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'By Stokes Law: v_t = [2r²(ρ - σ)g] / (9η). Hence terminal velocity is proportional to r².',
        explanationSinhala: 'ස්ටෝක්ස් නියමය අනුව: v_t = [2r²(ρ - σ)g] / (9η) බැවින් අන්ත ප්‍රවේගය ගෝලයේ අරයේ වර්ගයට (r²) අනුලෝමව සමානුපාතික වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 03 Matter Properties',
        topic: 'Viscosity & Stokes Law',
        difficulty: 'Medium'
      },
      {
        id: 'q_phy_3',
        questionNumber: 3,
        questionText: 'What is the work done in stretching a spring of stiffness constant k by an extension x from its natural length?',
        questionTextSinhala: 'ස්වභාවික දිගෙහි ඇති k දුනු නියතයක් සහිත දුන්නක් x ප්‍රමාණයකින් ඇදීමේදී කරන ලද කාර්යය වන්නේ:',
        options: [
          { id: 'opt_1', text: '1/2 k x²', textSinhala: '1/2 k x²' },
          { id: 'opt_2', text: 'k x', textSinhala: 'k x' },
          { id: 'opt_3', text: 'k x²', textSinhala: 'k x²' },
          { id: 'opt_4', text: '2 k x²', textSinhala: '2 k x²' },
          { id: 'opt_5', text: '1/2 k² x', textSinhala: '1/2 k² x' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Elastic potential energy / Work done W = ∫ kx dx = 1/2 k x².',
        explanationSinhala: 'ප්‍රත්‍යාස්ථ විභව ශක්තිය / දුන්න ඇදීමට කළ කාර්යය W = 1/2 k x² සූත්‍රයෙන් ලැබේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 02 Work, Energy & Power',
        topic: 'Work and Elastic Energy',
        difficulty: 'Easy'
      },
      {
        id: 'q_phy_4',
        questionNumber: 4,
        questionText: 'A simple pendulum has period T on Earth. If taken to the Moon where g_moon = g_earth / 6, the new period will be:',
        questionTextSinhala: 'පෘථිවියේදී T ආවර්ත කාලයක් ඇති සරල ලෝලකයක් ගුරුත්වජ ත්වරණය g/6 වන සඳ මතුපිටට ගෙන ගියහොත් නව ආවර්ත කාලය:',
        options: [
          { id: 'opt_1', text: '√6 T', textSinhala: '√6 T' },
          { id: 'opt_2', text: 'T / √6', textSinhala: 'T / √6' },
          { id: 'opt_3', text: '6 T', textSinhala: '6 T' },
          { id: 'opt_4', text: 'T / 6', textSinhala: 'T / 6' },
          { id: 'opt_5', text: '36 T', textSinhala: '36 T' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'T = 2π√(L/g). When g becomes g/6, T_new = 2π√(6L/g) = √6 * T.',
        explanationSinhala: 'සරල ලෝලකයක ආවර්ත කාලය T = 2π√(L/g) බැවින් g අගය 6 ගුණයකින් අඩු වන විට T අගය √6 ගුණයකින් වැඩි වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 04 Oscillations & Waves',
        topic: 'Simple Harmonic Motion',
        difficulty: 'Medium'
      }
    ]
  },

  // 3. A/L Chemistry - Organic Mechanisms & Chemical Bonding
  {
    id: 'quiz_chem_organic_01',
    title: 'Organic Reaction Mechanisms & Bonding',
    titleSinhala: 'කාබනික ප්‍රතික්‍රියා යාන්ත්‍රණ සහ රසායනික බන්ධන',
    titleTamil: 'சேதன இரசாயன தாக்கப் பொறிமுறைகள்',
    subjectId: 'sub_chemistry',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    grade: 12,
    stream: 'Physical Science (Maths)',
    unitNumber: 3,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    description: 'Master electrophilic addition, nucleophilic substitution (SN1/SN2), and hybrid orbitals.',
    descriptionSinhala: 'ඉලෙක්ට්‍රෝෆිලික එකතු වීම්, නියුක්ලියෝෆිලික ආදේශ සහ sp³/sp²/sp මුහුම්කරණ ප්‍රශ්න.',
    questions: [
      {
        id: 'q_ch_1',
        questionNumber: 1,
        questionText: 'When propene (CH3-CH=CH2) reacts with HBr in absence of peroxides, the major product according to Markovnikov rule is:',
        questionTextSinhala: 'පෙරොක්සයිඩ නොමැති විට ප්‍රොපීන් (CH3-CH=CH2) සමඟ HBr ප්‍රතික්‍රියා කළ විට මාකෝනිකොව් නියමයට අනුව ලැබෙන ප්‍රධාන ඵලය වන්නේ:',
        options: [
          { id: 'opt_1', text: '2-bromopropane', textSinhala: '2-බ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_2', text: '1-bromopropane', textSinhala: '1-බ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_3', text: '1,2-dibromopropane', textSinhala: '1,2-ඩයිබ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_4', text: 'Cyclopropane', textSinhala: 'සයික්ලෝප්‍රොපේන්' },
          { id: 'opt_5', text: '2,2-dibromopropane', textSinhala: '2,2-ඩයිබ්‍රෝමෝප්‍රොපේන්' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Electrophilic addition goes via the more stable secondary carbocation (CH3-CH(+)-CH3), yielding 2-bromopropane.',
        explanationSinhala: 'මාකෝනිකොව් නියමය අනුව වඩා ස්ථායී ද්විතීයික කාබොකැටායනය (2° carbocation) හරහා ප්‍රතික්‍රියාව සිදුවන බැවින් 2-බ්‍රෝමෝප්‍රොපේන් ප්‍රධාන ඵලය වේ.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 07 Organic Chemistry',
        topic: 'Electrophilic Addition',
        difficulty: 'Easy'
      },
      {
        id: 'q_ch_2',
        questionNumber: 2,
        questionText: 'What is the geometry and bond angle around the central chlorine atom in ClF3 molecule according to VSEPR theory?',
        questionTextSinhala: 'VSEPR සිද්ධාන්තයට අනුව ClF3 අණුවේ මධ්‍ය ක්ලෝරීන් පරමාණුව වටා ජ්‍යාමිතිය සහ බන්ධන කෝණය වන්නේ:',
        options: [
          { id: 'opt_1', text: 'T-shaped, ~87.5°', textSinhala: 'T-හැඩැති, ~87.5°' },
          { id: 'opt_2', text: 'Trigonal planar, 120°', textSinhala: 'ත්‍රිකෝණාකාර තලීය, 120°' },
          { id: 'opt_3', text: 'Trigonal pyramidal, 107°', textSinhala: 'ත්‍රිකෝණාකාර පිරමිඩාකාර, 107°' },
          { id: 'opt_4', text: 'Linear, 180°', textSinhala: 'රේඛීය, 180°' },
          { id: 'opt_5', text: 'See-saw, 90° & 120°', textSinhala: 'සිසෝ හැඩය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'ClF3 has 3 bonding pairs and 2 lone pairs on Cl (AX3E2). Trigonal bipyramidal electron geometry gives a T-shaped molecular shape.',
        explanationSinhala: 'ClF3 හි බන්ධන යුගල 3ක් සහ ඒකාක යුගල 2ක් (AX3E2) පවතින බැවින් අණුක හැඩය T-හැඩැති (T-shaped) වේ.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 02 Chemical Bonding',
        topic: 'VSEPR Theory',
        difficulty: 'Medium'
      },
      {
        id: 'q_ch_3',
        questionNumber: 3,
        questionText: 'Which reagent can distinguish between an Aldehyde and a Ketone by forming a silver mirror?',
        questionTextSinhala: 'ඇල්ඩිහයිඩ සහ කීටෝන වෙන්කර හඳුනා ගැනීමට රිදී කැඩපතක් (silver mirror) සාදන ප්‍රතිකාරකය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Tollens\' Reagent [Ag(NH3)2]+', textSinhala: 'ටොලන්ස් ප්‍රතිකාරකය (Tollens\' Reagent)' },
          { id: 'opt_2', text: '2,4-DNP', textSinhala: '2,4-ඩයිනයිට්‍රෝෆීනයිල්හයිඩ්‍රසීන් (2,4-DNP)' },
          { id: 'opt_3', text: 'Lucas Reagent (ZnCl2/HCl)', textSinhala: 'ලූකස් ප්‍රතිකාරකය' },
          { id: 'opt_4', text: 'Neutral FeCl3 solution', textSinhala: 'උදාසීන FeCl3 ද්‍රාවණය' },
          { id: 'opt_5', text: 'Aqueous NaHCO3', textSinhala: 'ජලීය NaHCO3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Tollens reagent oxidizes aldehydes to carboxylate ions while Ag+ is reduced to metallic silver (silver mirror). Ketones do not react.',
        explanationSinhala: 'ටොලන්ස් ප්‍රතිකාරකය මගින් ඇල්ඩිහයිඩ පමණක් ඔක්සිකරණය කර රිදී ලෝහය (Ag) තැන්පත් කරමින් රිදී කැඩපත සාදයි.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 08 Carbonyl Compounds',
        topic: 'Aldehyde and Ketone Tests',
        difficulty: 'Easy'
      }
    ]
  },

  // 4. A/L Biology - Cell Division & Genetics
  {
    id: 'quiz_bio_genetics_01',
    title: 'Cell Division, Genetics & Molecular Biology',
    titleSinhala: 'සෛල විභාජනය, ප්‍රවේණිය සහ අණුක ජීව විද්‍යාව',
    titleTamil: 'கலப்பிரிவு மற்றும் பாரம்பரியவியல்',
    subjectId: 'sub_biology',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    grade: 12,
    stream: 'Biological Science (Bio)',
    unitNumber: 4,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Dna',
    color: 'from-green-600 to-emerald-800',
    description: 'Test your understanding of mitosis, meiosis, Mendelian ratios, DNA replication, and protein synthesis.',
    descriptionSinhala: 'ඌනන විභාජනය, මෙන්ඩලීය ප්‍රවේණිය සහ ඩී.එන්.ඒ. ප්‍රතිවලිත වීම පිළිබඳ බහුවරණ.',
    questions: [
      {
        id: 'q_bio_1',
        questionNumber: 1,
        questionText: 'During which stage of Meiosis does crossing over (chiasma formation) occur between non-sister chromatids?',
        questionTextSinhala: 'ඌනන විභාජනයේදී සහෝදර නොවන වර්ණදේහාංශ අතර ප්‍රතිසංයෝජනය හෙවත් ස්වස්තික (Chiasma) සෑදෙන්නේ කුමන අවස්ථාවේදීද?',
        options: [
          { id: 'opt_1', text: 'Prophase I (Pachytene)', textSinhala: 'පූර්වකලාව I (Prophase I)' },
          { id: 'opt_2', text: 'Metaphase I', textSinhala: 'මධ්‍යකලාව I (Metaphase I)' },
          { id: 'opt_3', text: 'Anaphase I', textSinhala: 'පශ්චාත්කලාව I (Anaphase I)' },
          { id: 'opt_4', text: 'Telophase II', textSinhala: 'අන්තකලාව II (Telophase II)' },
          { id: 'opt_5', text: 'Prophase II', textSinhala: 'පූර්වකලාව II (Prophase II)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Synapsis and crossing over occur during Prophase I of Meiosis, resulting in genetic recombination and diversity.',
        explanationSinhala: 'ස්වස්තික සෑදීම සහ ප්‍රතිසංයෝජනය සිදුවන්නේ ඌනන විභාජනයේ පූර්වකලාව I (Prophase I) හිදීය.',
        guruPothaRef: 'A/L Biology Resource Book • Unit 04 Genetics',
        topic: 'Meiosis and Crossing Over',
        difficulty: 'Easy'
      },
      {
        id: 'q_bio_2',
        questionNumber: 2,
        questionText: 'In a dihybrid cross of two heterozygous individuals (AaBb x AaBb), what proportion of offspring are expected to have the genotype AABB?',
        questionTextSinhala: 'විෂමයුග්මක දෙමුහුම් දෙමාපියන් දෙදෙනෙකු (AaBb x AaBb) අතර මුහුමකදී AABB ප්‍රවේණිදර්ශය සහිත දරුවන් ලැබීමේ සම්භාවිතාව කොපමණද?',
        options: [
          { id: 'opt_1', text: '1/16', textSinhala: '1/16' },
          { id: 'opt_2', text: '9/16', textSinhala: '9/16' },
          { id: 'opt_3', text: '3/16', textSinhala: '3/16' },
          { id: 'opt_4', text: '4/16 (1/4)', textSinhala: '4/16 (1/4)' },
          { id: 'opt_5', text: '2/16 (1/8)', textSinhala: '2/16 (1/8)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'P(AA) = 1/4 and P(BB) = 1/4. Since genes assort independently, P(AABB) = (1/4) * (1/4) = 1/16.',
        explanationSinhala: 'ස්වාධීන ව්‍යූහන නියමයට අනුව P(AA) = 1/4 සහ P(BB) = 1/4 බැවින් P(AABB) = 1/4 * 1/4 = 1/16 වේ.',
        guruPothaRef: 'A/L Biology Resource Book • Unit 04 Mendelian Genetics',
        topic: 'Dihybrid Cross Ratios',
        difficulty: 'Medium'
      }
    ]
  },

  // 5. G.C.E. O/L Science - Electricity & Energy
  {
    id: 'quiz_ol_science_01',
    title: 'Electricity, Circuits & Magnetism (O/L)',
    titleSinhala: 'ධාරා විද්‍යුතය, පරිපථ සහ චුම්භකත්වය (සා.පෙළ)',
    titleTamil: 'மின்னியல் மற்றும் காந்தவியல் (O/L)',
    subjectId: 'sub_ol_science',
    subjectName: 'Science',
    subjectSinhala: 'විද්‍යාව',
    grade: 11,
    stream: 'General O/L',
    unitNumber: 3,
    timeLimitMinutes: 12,
    totalMarks: 100,
    xpReward: 100,
    iconName: 'Flame',
    color: 'from-cyan-600 to-blue-800',
    description: 'Test your understanding of Ohm\'s law, series/parallel circuits, and domestic electricity.',
    descriptionSinhala: 'ඕම්ගේ නියමය, සමාන්තරගත හා ශ්‍රේණිගත ප්‍රතිරෝධ සහ විද්‍යුත් බලය පිළිබඳ ගැටලු.',
    questions: [
      {
        id: 'q_ol_sci_1',
        questionNumber: 1,
        questionText: 'Two resistors of 6 Ω and 3 Ω are connected in parallel to a 12V DC power source. What is the total current flowing from the source?',
        questionTextSinhala: '6 Ω සහ 3 Ω ප්‍රතිරෝධක දෙකක් සමාන්තරගතව 12V බැටරියකට සම්බන්ධ කර ඇත. පරිපථයේ මුළු ධාරාව කොපමණද?',
        options: [
          { id: 'opt_1', text: '6 A', textSinhala: '6 A' },
          { id: 'opt_2', text: '4 A', textSinhala: '4 A' },
          { id: 'opt_3', text: '2 A', textSinhala: '2 A' },
          { id: 'opt_4', text: '9 A', textSinhala: '9 A' },
          { id: 'opt_5', text: '1.33 A', textSinhala: '1.33 A' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Equivalent resistance R_eq = (6*3)/(6+3) = 18/9 = 2 Ω. Current I = V / R_eq = 12 / 2 = 6 A.',
        explanationSinhala: 'සමාන්තර ප්‍රතිරෝධය R_eq = (6*3)/(6+3) = 18/9 = 2 Ω වේ. මුළු ධාරාව I = V/R = 12/2 = 6 A වේ.',
        guruPothaRef: 'Grade 11 Science Textbook • Unit 07 Current Electricity',
        topic: 'Parallel Resistance & Ohm Law',
        difficulty: 'Easy'
      },
      {
        id: 'q_ol_sci_2',
        questionNumber: 2,
        questionText: 'Which electrical safety device protects appliances from overloading by melting when excessive current passes through?',
        questionTextSinhala: 'අධික ධාරාවක් ගලා යන විට උණු වී පරිපථය විසන්ධි කර උපකරණ ආරක්ෂා කරන උපාංගය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Fuse (ෆියුස් කම්බිය)', textSinhala: 'ෆියුස් කම්බිය (Fuse wire)' },
          { id: 'opt_2', text: 'Switch (ස්විචය)', textSinhala: 'ස්විචය' },
          { id: 'opt_3', text: 'Capacitor (ධාරිත්‍රකය)', textSinhala: 'ධාරිත්‍රකය' },
          { id: 'opt_4', text: 'Voltmeter (වෝල්ට්මීටරය)', textSinhala: 'වෝල්ට්මීටරය' },
          { id: 'opt_5', text: 'Transformer (පරිණාමකය)', textSinhala: 'පරිණාමකය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'A fuse wire has a low melting point (lead-tin alloy) and melts safely to break an overloaded circuit.',
        explanationSinhala: 'ෆියුස් කම්බිය (තූර්ය මිශ්‍ර ලෝහය) අඩු ද්‍රවාංකයක් සහිත බැවින් අධික ධාරාවකදී උණු වී පරිපථය ආරක්ෂා කරයි.',
        guruPothaRef: 'Grade 11 Science Textbook • Unit 08 Domestic Electricity',
        topic: 'Electrical Safety',
        difficulty: 'Easy'
      }
    ]
  },

  // 6. G.C.E. O/L Mathematics - Quadratic Equations & Trigonometry
  {
    id: 'quiz_ol_maths_01',
    title: 'Quadratic Equations, Pythagoras & Trigonometry (O/L)',
    titleSinhala: 'වර්ගජ සමීකරණ, පයිතගරස් ප්‍රමේයය සහ ත්‍රිකෝණමිතිය',
    titleTamil: 'இருபடிச் சமன்பாடுகள் மற்றும் திரிகோணமிதி (O/L)',
    subjectId: 'sub_ol_maths',
    subjectName: 'Mathematics',
    subjectSinhala: 'ගණිතය',
    grade: 11,
    stream: 'General O/L',
    unitNumber: 2,
    timeLimitMinutes: 12,
    totalMarks: 100,
    xpReward: 100,
    iconName: 'Percent',
    color: 'from-indigo-600 to-purple-800',
    description: 'Solve factorizations, sin/cos/tan ratio word problems, and theorem verifications.',
    descriptionSinhala: 'සාධක සෙවීම, සයින් කොසයින් අනුපාත සහ කෝණ පිළිබඳ විභාග මට්ටමේ බහුවරණ.',
    questions: [
      {
        id: 'q_ol_m_1',
        questionNumber: 1,
        questionText: 'What are the roots of the quadratic equation x² - 5x + 6 = 0 ?',
        questionTextSinhala: 'x² - 5x + 6 = 0 වර්ගජ සමීකරණයේ විසඳුම් (මූල) මොනවාද?',
        options: [
          { id: 'opt_1', text: 'x = 2 and x = 3', textSinhala: 'x = 2 සහ x = 3' },
          { id: 'opt_2', text: 'x = -2 and x = -3', textSinhala: 'x = -2 සහ x = -3' },
          { id: 'opt_3', text: 'x = 1 and x = 6', textSinhala: 'x = 1 සහ x = 6' },
          { id: 'opt_4', text: 'x = -1 and x = -6', textSinhala: 'x = -1 සහ x = -6' },
          { id: 'opt_5', text: 'x = 0 and x = 5', textSinhala: 'x = 0 සහ x = 5' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Factoring: (x - 2)(x - 3) = 0 => x = 2 or x = 3.',
        explanationSinhala: 'සාධක වෙන් කිරීමෙන්: (x - 2)(x - 3) = 0 බැවින් x = 2 හෝ x = 3 වේ.',
        guruPothaRef: 'Grade 11 Mathematics Textbook • Unit 04 Quadratic Equations',
        topic: 'Factorization',
        difficulty: 'Easy'
      },
      {
        id: 'q_ol_m_2',
        questionNumber: 2,
        questionText: 'In a right-angled triangle, if opposite side = 3 cm and adjacent side = 4 cm, what is the value of sin θ?',
        questionTextSinhala: 'සෘජුකෝණී ත්‍රිකෝණයක සම්මුඛ පාදය 3 cm සහ බද්ධ පාදය 4 cm නම්, sin θ හි අගය කොපමණද?',
        options: [
          { id: 'opt_1', text: '3/5', textSinhala: '3/5' },
          { id: 'opt_2', text: '4/5', textSinhala: '4/5' },
          { id: 'opt_3', text: '3/4', textSinhala: '3/4' },
          { id: 'opt_4', text: '4/3', textSinhala: '4/3' },
          { id: 'opt_5', text: '5/3', textSinhala: '5/3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'By Pythagoras: Hypotenuse = √(3² + 4²) = 5 cm. sin θ = Opposite / Hypotenuse = 3/5.',
        explanationSinhala: 'පයිතගරස් ප්‍රමේයයෙන් කර්ණය = √(3² + 4²) = 5 cm වේ. sin θ = සම්මුඛ පාදය / කර්ණය = 3/5 වේ.',
        guruPothaRef: 'Grade 11 Mathematics Textbook • Unit 12 Trigonometry',
        topic: 'Trigonometric Ratios',
        difficulty: 'Easy'
      }
    ]
  }
];
