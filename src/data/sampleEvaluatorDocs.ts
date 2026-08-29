export interface SampleDocItem {
  id: string;
  title: string;
  titleSi: string;
  titleTa: string;
  category: 'answer' | 'mindmap' | 'math_physics';
  subject: string;
  grade: string;
  syllabus: string;
  fileType: 'image' | 'pdf';
  fileSize: string;
  previewUrl: string;
  fileName: string;
  description: string;
  ocrExtractedText: string;
  
  // Module A data (Handwritten Evaluator)
  evaluationData?: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    gradeBadge: string;
    curriculumBenchmark: string;
    examinerVerdict: string;
    examinerVerdictSi: string;
    rubricBreakdown: {
      step: string;
      stepSi: string;
      marksAwarded: number;
      maxMarks: number;
      status: 'full' | 'partial' | 'zero';
      notes: string;
      notesSi: string;
    }[];
    annotatedRegions: {
      id: string;
      x: number; // percentage
      y: number;
      width: number;
      height: number;
      type: 'correct' | 'mistake' | 'improvement';
      title: string;
      message: string;
      messageSi: string;
    }[];
    mistakesList: {
      severity: 'high' | 'medium' | 'low';
      issue: string;
      issueSi: string;
      correction: string;
      correctionSi: string;
      ruleCitation: string;
    }[];
    modelAnswer: {
      text: string;
      textSi: string;
      keyPoints: string[];
    };
  };

  // Module B data (Mind-Map Studio)
  mindMapData?: {
    rootNode: {
      id: string;
      label: string;
      labelSi: string;
      color: string;
      icon: string;
      children: {
        id: string;
        label: string;
        labelSi: string;
        color: string;
        summary: string;
        summarySi: string;
        children?: {
          id: string;
          label: string;
          labelSi: string;
          details: string;
          detailsSi: string;
        }[];
      }[];
    };
    summaryBulletPoints: string[];
    summaryBulletPointsSi: string[];
    keyTerms: { term: string; definition: string; definitionSi: string }[];
  };

  // Module C data (Step-by-Step Solver)
  solverData?: {
    problemStatement: string;
    problemStatementSi: string;
    identifiedTopic: string;
    academicCitation: string;
    givenVariables: { symbol: string; value: string; unit: string; description: string }[];
    targetUnknowns: { symbol: string; description: string }[];
    steps: {
      stepNumber: number;
      title: string;
      titleSi: string;
      equation: string;
      explanation: string;
      explanationSi: string;
      intermediateResult: string;
    }[];
    finalAnswer: {
      value: string;
      unit: string;
      verdict: string;
      verdictSi: string;
    };
    examinerPitfalls: string[];
    examinerPitfallsSi: string[];
    practiceVariant: {
      question: string;
      questionSi: string;
      hint: string;
    };
  };
}

export const SAMPLE_EVALUATOR_DOCS: SampleDocItem[] = [
  {
    id: 'sample_chem_reaction',
    title: 'G.C.E. A/L Chemistry - Organic Reaction & Equilibrium Answer',
    titleSi: 'උසස් පෙළ රසායන විද්‍යාව - කාබනික රසායනය පිළිතුරු පත්‍රය',
    titleTa: 'க.பொ.த உயர்தர வேதியியல் - கரிம வினைகள் விடைத்தாள்',
    category: 'answer',
    subject: 'Chemistry (A/L Science)',
    grade: 'Grade 12/13 A/L',
    syllabus: 'NIE G.C.E. A/L Chemistry 2026 - Unit 12 & Unit 7',
    fileType: 'image',
    fileSize: '1.4 MB',
    fileName: 'student_chem_paper2_q3.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=900&auto=format&fit=crop&q=80',
    description: 'Handwritten answer on Aldehyde nucleophilic addition mechanism and Le Chatelier equilibrium shift.',
    ocrExtractedText: `Q3: (a) Outline the step-by-step mechanism for the reaction of propanal with HCN in the presence of trace NaOH base.
(b) Explain why temperature increase from 25°C to 75°C reduces equilibrium yield for the exothermic synthesis reaction (ΔH = -92 kJ/mol).
[Student handwriting OCR parsed with 98.6% confidence]`,
    evaluationData: {
      totalMarks: 17,
      maxMarks: 20,
      percentage: 85,
      gradeBadge: 'A (Distinction)',
      curriculumBenchmark: 'NIE G.C.E. A/L Marking Scheme 2026 Structured Essay Q3',
      examinerVerdict: 'Excellent structured mechanism presentation. Minor penalty on step 2 for missing nucleophile lone pair curly arrow origin.',
      examinerVerdictSi: 'විශිෂ්ට කාබනික යාන්ත්‍රණ දැක්වීමකි. 2 වන පියවරේ නියුක්ලියෝෆයිලයේ තනි ඉලෙක්ට්‍රෝන යුගල ඊතල ආරම්භය පැහැදිලි නොවීම හේතුවෙන් සුළු ලකුණු අඩුවීමක් සිදුව ඇත.',
      rubricBreakdown: [
        {
          step: '1. Cyanide Ion Generation & Propanal Electrophilic Carbon Attack',
          stepSi: '1. සයනයිඩ් අයනය උත්පාදනය හා කාබොනයිල් කාබන් වෙත ප්‍රහාරය',
          marksAwarded: 5,
          maxMarks: 5,
          status: 'full',
          notes: 'Correct generation of CN- from HCN using base catalyst with precise partial charges δ+ on Carbon and δ- on Oxygen.',
          notesSi: 'කාබොනයිල් කාබන් මත ධන ආරෝපණය සහ ඔක්සිජන් මත ඍණ ආරෝපණය නිවැරදිව දක්වා ඇත.'
        },
        {
          step: '2. Tetrahedral Alkoxide Intermediate & Proton Transfer',
          stepSi: '2. චතුස්තලීය ඇල්කොක්සයිඩ් අතරමැදිය සහ ප්‍රෝටෝනකරණය',
          marksAwarded: 4,
          maxMarks: 5,
          status: 'partial',
          notes: 'Tetrahedral intermediate drawn accurately, but curly arrow origin from O- lone pair lacks explicit lone pair dots.',
          notesSi: 'අතරමැදිය නිවැරදි නමුත් O- ඔක්සිජන් ඉලෙක්ට්‍රෝන යුගල ලක්ෂ්‍ය පැහැදිලිව සටහන් කර නොමැත (-1 Mark).'
        },
        {
          step: '3. Cyanohydrin Product & Chiral Center Identification',
          stepSi: '3. සයනොහයිඩ්‍රින් ඵලය හා කයිරල් කාබන් නම් කිරීම',
          marksAwarded: 5,
          maxMarks: 5,
          status: 'full',
          notes: 'Accurate 2-hydroxybutanenitrile formula; recognized racemic mixture formation due to planar carbonyl geometry.',
          notesSi: 'රැසීමික මිශ්‍රණය සෑදීම සහ තලීය කාබොනයිල් කාණ්ඩය නිවැරදිව පැහැදිලි කර ඇත.'
        },
        {
          step: '4. Le Chatelier Temperature Shift & ΔH Analysis',
          stepSi: '4. ලේ ෂැටලියර් මූලධර්මය සහ තාපදායක ප්‍රතික්‍රියා විවරණය',
          marksAwarded: 3,
          maxMarks: 5,
          status: 'partial',
          notes: 'Stated exothermic nature correctly, but omitted mentioning equilibrium constant Kc variation with temperature.',
          notesSi: 'තාපය වැඩිවීමේදී සමතුලිත නියතය Kc අගය අඩුවන බව සඳහන් නොකිරීම නිසා ලකුණු 2ක් අඩුවී ඇත.'
        }
      ],
      annotatedRegions: [
        {
          id: 'ann_1',
          x: 18,
          y: 22,
          width: 38,
          height: 18,
          type: 'correct',
          title: '✔ Correct Nucleophile Attack',
          message: 'Base catalysis HCN + OH- -> CN- + H2O perfectly depicted with charge conservation.',
          messageSi: 'සයනයිඩ් අයන උත්පාදනය හා ආරෝපණ තුලනය 100% නිවැරදියි.'
        },
        {
          id: 'ann_2',
          x: 58,
          y: 36,
          width: 32,
          height: 20,
          type: 'mistake',
          title: '⚠ Missing Lone Pair on O⁻',
          message: 'NIE Guideline: Lone pair dots on Oxygen must be drawn before showing the arrow to H2O.',
          messageSi: 'විභාග උපදෙස්: O⁻ මත ඉලෙක්ට්‍රෝන යුගල තිත් ලකුණු කර පසුව ඊතලය ඇඳිය යුතුය.'
        },
        {
          id: 'ann_3',
          x: 20,
          y: 68,
          width: 60,
          height: 22,
          type: 'improvement',
          title: '💡 Add Kc Equilibrium Statement',
          message: 'To get 20/20: Explicitly state "Since reaction is exothermic (ΔH < 0), Kc decreases as T increases".',
          messageSi: 'පූර්ණ ලකුණු සඳහා "තාපදායක බැවින් උෂ්ණත්වය වැඩිවීමත් සමඟ Kc අගය අඩුවේ" යන්න එකතු කරන්න.'
        }
      ],
      mistakesList: [
        {
          severity: 'medium',
          issue: 'Missing formal electron lone pair on Oxygen alkoxide intermediate.',
          issueSi: 'ඇල්කොක්සයිඩ් ඔක්සිජන් පරමාණුවේ නිදහස් ඉලෙක්ට්‍රෝන යුගලය නොදැක්වීම.',
          correction: 'Draw two dots on O⁻ representing the non-bonding electron pair before drawing the arrow to H⁺.',
          correctionSi: 'O⁻ මත ඉලෙක්ට්‍රෝන යුගලය තිත් දෙකකින් දක්වා ඉන්පසු H⁺ වෙත ඊතලය යොමු කරන්න.',
          ruleCitation: 'NIE A/L Chemistry Syllabus 2026 Unit 12.4 Marking Directives'
        },
        {
          severity: 'low',
          issue: 'Omitted temperature dependency of the Equilibrium Constant Kc.',
          issueSi: 'සමතුලිතතා නියතය Kc උෂ්ණත්වය මත රඳා පවතින බව නොදැක්වීම.',
          correction: 'State: As T increases for exothermic forward reaction, Kc value drops, shifting equilibrium left towards reactants.',
          correctionSi: 'උෂ්ණත්වය වැඩි වන විට තාපදායක ප්‍රතික්‍රියාවේ Kc අගය අඩුවන බව සඳහන් කරන්න.',
          ruleCitation: 'NIE A/L Chemistry Syllabus Unit 7 Chemical Equilibrium'
        }
      ],
      modelAnswer: {
        text: `Model Answer (Full Marks Scheme):
1. Formation of cyanide nucleophile: HCN + OH⁻ ⇌ CN⁻ + H₂O
2. Nucleophilic attack: Propanal (CH₃CH₂CHO) possesses a polarized carbonyl bond (C^(δ+) = O^(δ-)). The CN⁻ attacks the electrophilic carbon from either face of the planar sp² carbonyl group.
3. Intermediate: A tetrahedral alkoxide [CH₃CH₂CH(O⁻)CN] is formed. The lone pair on O⁻ abstracts H⁺ from H₂O to yield 2-hydroxybutanenitrile (racemic mixture) and regenerates OH⁻ catalyst.
4. Equilibrium: For exothermic synthesis (ΔH = -92 kJ/mol), increasing temperature causes the system to absorb heat by favoring the endothermic reverse direction (Le Chatelier's Principle). Thus, the equilibrium constant Kc decreases, leading to lower equilibrium yield.`,
        textSi: `පූර්ණ ලකුණු හිමි ආදර්ශ පිළිතුර:
1. HCN + OH⁻ ⇌ CN⁻ + H₂O මඟින් සයනයිඩ් නියුක්ලියෝෆයිලය උත්පාදනය වේ.
2. ප්‍රොපනැල්හි ධ්‍රැවීකෘත කාබොනයිල් කාබන් (C^(δ+)) වෙත CN⁻ අයනය ප්‍රහාර එල්ල කරයි.
3. චතුස්තලීය ඇල්කොක්සයිඩ් අතරමැදිය ඔක්සිජන් ඉලෙක්ට්‍රෝන යුගල ආධාරයෙන් ජලයෙන් H⁺ ලබාගෙන 2-හයිඩ්‍රොක්සිබියුටේන් නයිට්‍රයිල් රැසීමික මිශ්‍රණය සාදයි.
4. තාපදායක ප්‍රතික්‍රියාවක (ΔH < 0) උෂ්ණත්වය වැඩි කිරීමේදී ලේ ෂැටලියර් මූලධර්මයට අනුව තාපය අවශෝෂණය වන ප්‍රතිවර්ත දිශාවට සමතුලිතතාවය විතැන් වී Kc අගය අඩුවේ.`,
        keyPoints: [
          'HCN + OH- -> CN- + H2O catalyst regeneration',
          'δ+ and δ- dipole arrows correctly labeled',
          'Racemic mixture explained via planar sp2 geometry',
          'Le Chatelier shift linked to Kc temperature decay'
        ]
      }
    }
  },
  {
    id: 'sample_physics_kinematics',
    title: 'G.C.E. A/L Physics - Kinematics & Mechanics Projectile Problem',
    titleSi: 'උසස් පෙළ භෞතික විද්‍යාව - ප්‍රක්ෂිප්ත චලිතය සහ යාන්ත්‍ර විද්‍යාව',
    titleTa: 'க.பொ.த உயர்தர இயற்பியல் - எறிபொருள் இயக்கம் & இயக்கவியல்',
    category: 'math_physics',
    subject: 'Physics (A/L Science)',
    grade: 'Grade 12/13 A/L',
    syllabus: 'NIE G.C.E. A/L Physics 2026 - Unit 2 Mechanics & Kinematics',
    fileType: 'image',
    fileSize: '1.2 MB',
    fileName: 'physics_projectile_problem_scan.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&auto=format&fit=crop&q=80',
    description: 'Calculates maximum height, time of flight, and impact velocity for a ball launched at 30° from an elevated cliff.',
    ocrExtractedText: `Problem Statement: A projectile is fired from the edge of a cliff 45 m high with an initial velocity of 40 m/s at an angle of 30° above the horizontal. (Take g = 9.8 m/s²).
Find:
(i) Time taken to reach maximum height.
(ii) Total flight time until it strikes the ground below.
(iii) Horizontal range from the cliff base.
(iv) Impact velocity vector and final angle with ground.`,
    solverData: {
      problemStatement: 'A projectile is launched from a 45m high cliff at initial speed u = 40 m/s and launch angle θ = 30° above horizontal. Find maximum height, total flight time, range, and final impact velocity vector (g = 9.8 m/s²).',
      problemStatementSi: '45m උසැති ප්‍රපාතයක මුදුනේ සිට 40 m/s ආරම්භක ප්‍රවේගයකින් සහ තිරසට 30° ක කෝණයකින් ප්‍රක්ෂිප්තයක් විදිනු ලැබේ (g = 9.8 m/s²). උපරිම උස, මුළු ගමන් කාලය, තිරස් පරාසය සහ පොළොවට වදින ප්‍රවේගය ගණනය කරන්න.',
      identifiedTopic: '2D Kinematics - Elevated Projectile Motion with Gravitational Acceleration',
      academicCitation: 'NIE G.C.E. A/L Physics Unit 2.3 Motion under Gravity & Cambridge A-Level Physics 9702 Sec 2.1',
      givenVariables: [
        { symbol: 'u', value: '40', unit: 'm/s', description: 'Initial launch speed' },
        { symbol: 'θ', value: '30°', unit: 'degrees', description: 'Angle of elevation above horizontal' },
        { symbol: 'h_cliff', value: '45', unit: 'm', description: 'Height of the cliff origin above ground' },
        { symbol: 'g', value: '9.8', unit: 'm/s²', description: 'Acceleration due to gravity downwards' }
      ],
      targetUnknowns: [
        { symbol: 't_max', description: 'Time to reach maximum height apex' },
        { symbol: 'H_max', description: 'Total maximum altitude above ground' },
        { symbol: 'T_total', description: 'Total flight time to reach ground' },
        { symbol: 'R_x', description: 'Horizontal landing range' },
        { symbol: 'v_impact', description: 'Final speed vector magnitude at landing' }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Resolve Initial Velocity into Orthogonal Components',
          titleSi: '1. ආරම්භක ප්‍රවේගය තිරස් හා සිරස් සංරචක වලට විභේදනය කිරීම',
          equation: 'u_x = u \\cos(30°) = 40 \\times \\frac{\\sqrt{3}}{2} = 34.64\\text{ m/s}, \\quad u_y = u \\sin(30°) = 40 \\times 0.5 = 20.00\\text{ m/s}',
          explanation: 'Horizontal velocity remains constant throughout flight because no horizontal forces act (air resistance neglected). Vertical component undergoes constant deceleration g = 9.8 m/s².',
          explanationSi: 'වායු ප්‍රතිරෝධය නොසලකා හරින බැවින් තිරස් ප්‍රවේගය නියතව පවතින අතර සිරස් සංරචකය ගුරුත්වජ ත්වරණයෙන් විචලනය වේ.',
          intermediateResult: 'u_x = 34.64 m/s, u_y = 20.0 m/s'
        },
        {
          stepNumber: 2,
          title: 'Calculate Time to Apex & Maximum Height Above Cliff',
          titleSi: '2. උපරිම උසට ළඟාවීමට ගතවන කාලය හා උපරිම උස සෙවීම',
          equation: 'v_y = u_y - g t_1 = 0 \\implies t_1 = \\frac{20.0}{9.8} = 2.04\\text{ s}; \\quad h_1 = \\frac{u_y^2}{2g} = \\frac{400}{19.6} = 20.41\\text{ m}',
          explanation: 'At apex, vertical velocity component v_y momentarily becomes 0. Adding cliff height gives H_max = 45 + 20.41 = 65.41 m above ground level.',
          explanationSi: 'උපරිම ලක්ෂ්‍යයේදී සිරස් ප්‍රවේගය ශූන්‍ය වේ. ප්‍රපාතයේ උස එකතු කළ විට පොළොවේ සිට මුළු උපරිම උස 65.41 m වේ.',
          intermediateResult: 't_apex = 2.04 s, H_max = 65.41 m'
        },
        {
          stepNumber: 3,
          title: 'Calculate Total Flight Time using Vertical Displacement s_y = -45 m',
          titleSi: '3. සිරස් විස්ථාපනය s_y = -45 m යොදා මුළු ගමන් කාලය සෙවීම',
          equation: 's_y = u_y T - \\frac{1}{2}g T^2 \\implies -45 = 20T - 4.9T^2 \\implies 4.9T^2 - 20T - 45 = 0',
          explanation: 'Solving the quadratic equation using quadratic formula T = [20 + sqrt(400 - 4(4.9)(-45))] / (2*4.9) gives positive root T = 5.72 seconds.',
          explanationSi: 'වර්ගජ සමීකරණය විසඳීමෙන් මුළු කාලය T = 5.72 තත්පර ලෙස ලැබේ.',
          intermediateResult: 'T_total = 5.72 s'
        },
        {
          stepNumber: 4,
          title: 'Compute Horizontal Range and Landing Velocity Vector',
          titleSi: '4. තිරස් පරාසය සහ පොළොවට ගැටෙන ප්‍රවේග දෛශිකය සෙවීම',
          equation: 'R_x = u_x T = 34.64 \\times 5.72 = 198.14\\text{ m}; \\quad v_y = 20 - (9.8)(5.72) = -36.06\\text{ m/s}; \\quad v = \\sqrt{u_x^2 + v_y^2} = 50.01\\text{ m/s}',
          explanation: 'Final speed is 50.01 m/s at angle tan⁻¹(36.06 / 34.64) = 46.15° below the horizontal.',
          explanationSi: 'පොළොවට වදින අවසාන ප්‍රවේගය 50.01 m/s වන අතර එය තිරසට පහළින් 46.15° කෝණයක් සාදයි.',
          intermediateResult: 'Range = 198.14 m, Impact Speed = 50.01 m/s @ 46.15°'
        }
      ],
      finalAnswer: {
        value: 'Range = 198.14 m, Flight Time = 5.72 s, Impact Speed = 50.01 m/s',
        unit: 'SI Metric',
        verdict: 'Exact Analytical Solution verified with Conservation of Energy & Kinematic Equations.',
        verdictSi: 'ශක්ති සංස්ථිති නියමය හා චලිත සමීකරණ මඟින් තහවුරු කළ නිවැරදි විශ්ලේෂණාත්මක විසඳුමකි.'
      },
      examinerPitfalls: [
        'Do NOT assume s_y = 0 because projectile does not land on the same horizontal level as launch point (cliff offset -45m).',
        'Always include unit notation (m/s, m, s) on every line to prevent marking scheme deduction (-1 Mark).',
        'Check vector direction signs: upward displacement is positive (+), downward gravity acceleration is negative (-).'
      ],
      examinerPitfallsSi: [
        'ප්‍රක්ෂිප්තය පොළොවට වැටෙන්නේ ප්‍රපාතයට පහළින් බැවින් s_y = 0 යැයි උපකල්පනය නොකරන්න (s_y = -45m විය යුතුය).',
        'සෑම පියවරකදීම SI ඒකක (m/s, m, s) නිවැරදිව සටහන් කරන්න.',
        'දෛශික දිශා ලකුණු (+ / -) ආරම්භයේ සිට අවසානය දක්වා එකම පිළිවෙළට තබා ගන්න.'
      ],
      practiceVariant: {
        question: 'Variant Practice: If the cliff height is 80 m and projectile is launched horizontally (θ = 0°) at 25 m/s, find time of impact and horizontal range.',
        questionSi: 'පුහුණු ප්‍රශ්නය: ප්‍රපාතයේ උස 80 m වන විට තිරස්ව (θ = 0°) 25 m/s ප්‍රවේගයෙන් විදින ලද වස්තුවක පොළොවට වැටෙන කාලය හා තිරස් පරාසය සොයන්න.',
        hint: 'Since initial vertical velocity u_y = 0, use s_y = (1/2)gt² directly to find t.'
      }
    }
  },
  {
    id: 'sample_biology_mindmap',
    title: 'G.C.E. A/L Biology - Cellular Respiration & Photosynthesis Chapter PDF',
    titleSi: 'උසස් පෙළ ජීව විද්‍යාව - සෛලීය ශ්වසනය සහ ප්‍රභාසංස්ලේෂණය PDF සාරාංශය',
    titleTa: 'க.பொ.த உயர்தர உயிரியல் - உயிரணு சுவாசம் & ஒளிச்சேர்க்கை குறிப்பு',
    category: 'mindmap',
    subject: 'Biology (A/L Science)',
    grade: 'Grade 12/13 A/L',
    syllabus: 'NIE G.C.E. A/L Biology 2026 - Unit 3 Cell Biology & Bioenergetics',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    fileName: 'AL_Biology_Unit3_Bioenergetics_Notes.pdf',
    previewUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80',
    description: 'Comprehensive 18-page summary of Glycolysis, Krebs Cycle, Oxidative Phosphorylation, Light Reactions, and Calvin Cycle.',
    ocrExtractedText: `Cellular Bioenergetics (NIE Grade 12 Biology Resource Book):
1. Glycolysis (Cytosol): Glucose (6C) converted into 2 Pyruvate (3C). Net gain: 2 ATP (substrate-level phosphorylation) + 2 NADH + 2 H+.
2. Link Reaction (Mitochondrial Matrix): Pyruvate + CoA + NAD+ -> Acetyl-CoA + CO2 + NADH.
3. Krebs Cycle (Citric Acid Cycle): Acetyl-CoA (2C) combines with Oxaloacetate (4C) -> Citrate (6C). Yields per glucose: 2 ATP, 6 NADH, 2 FADH2, 4 CO2.
4. Electron Transport Chain & Chemiosmosis: Inner mitochondrial membrane ATP synthase driven by proton gradient (H+ PMF). Theoretical net yield: 30-32 ATP.`,
    mindMapData: {
      rootNode: {
        id: 'bioenergetics_root',
        label: 'Cellular Bioenergetics & Energy Transformation',
        labelSi: 'සෛලීය ජෛව ශක්ති විද්‍යාව හා පරිවෘත්තිය',
        color: 'from-emerald-500 to-teal-600',
        icon: '🌿',
        children: [
          {
            id: 'resp_glycolysis',
            label: '1. Glycolysis (ග්ලයිකොලිසිය)',
            labelSi: '1. ග්ලයිකොලිසිය (සෛල ප්ලාස්මය)',
            color: 'from-blue-500 to-cyan-600',
            summary: 'Occurs in Cytosol under anaerobic/aerobic conditions. Glucose (6C) cleaved into 2 Pyruvate molecules.',
            summarySi: 'සෛල ප්ලාස්මයේදී සිදුවේ. ග්ලූකෝස් අණුවක් පයිරුවේට් අණු 2ක් බවට බිඳ වැටේ.',
            children: [
              {
                id: 'glyc_yield',
                label: 'Energy Yield',
                labelSi: 'ශක්ති ඵලදාව',
                details: 'Net 2 ATP (Substrate-level phosphorylation) + 2 NADH + 2 H+',
                detailsSi: 'ශුද්ධ 2 ATP (ප්‍රතික්‍රියක මට්ටමේ පොස්පොරයිලීකරණය) + 2 NADH'
              },
              {
                id: 'glyc_enzymes',
                label: 'Key Enzyme Regulators',
                labelSi: 'ප්‍රධාන එන්සයිම',
                details: 'Hexokinase, Phosphofructokinase (PFK - rate limiting), Pyruvate Kinase',
                detailsSi: 'හෙක්සොකයිනේස්, පොස්පොෆෲක්ටොකයිනේස් (වේගය පාලනය කරන ප්‍රධාන එන්සයිමය)'
              }
            ]
          },
          {
            id: 'resp_krebs',
            label: '2. Krebs Cycle & Link Reaction (ක්‍රෙබ්ස් චක්‍රය)',
            labelSi: '2. සම්බන්ධක ප්‍රතික්‍රියාව & ක්‍රෙබ්ස් චක්‍රය',
            color: 'from-amber-500 to-orange-600',
            summary: 'Occurs inside Mitochondrial Matrix. Acetyl-CoA oxidized releasing carbon dioxide.',
            summarySi: 'මයිටොකොන්ඩ්‍රියා පූරකය තුළ සිදුවේ. ඇසිටයිල්-CoA ඔක්සිකරණය වී CO2 මුදා හරී.',
            children: [
              {
                id: 'krebs_yield',
                label: 'Per Glucose Yield',
                labelSi: 'ග්ලූකෝස් අණුවක ඵලදාව',
                details: '2 ATP, 6 NADH, 2 FADH2, 4 CO2 waste released',
                detailsSi: '2 ATP, 6 NADH, 2 FADH2, 4 CO2 මුදාහැරේ'
              },
              {
                id: 'krebs_oxaloacetate',
                label: 'Oxaloacetate Regeneration',
                labelSi: 'ඔක්සැලෝඇසිටේට් ප්‍රතිජනනය',
                details: '4C Oxaloacetate combines with 2C Acetyl-CoA to form 6C Citric Acid',
                detailsSi: '4C ඔක්සැලෝඇසිටේට් සමඟ 2C ඇසිටයිල්-CoA එකතු වී 6C සිට්‍රේට් සාදයි'
              }
            ]
          },
          {
            id: 'resp_etc',
            label: '3. Oxidative Phosphorylation & ETC (ඉලෙක්ට්‍රෝන ප්‍රවාහන දාමය)',
            labelSi: '3. ඔක්සිකාරක පොස්පොරයිලීකරණය & ETC',
            color: 'from-purple-500 to-indigo-600',
            summary: 'Inner mitochondrial cristae membrane. Proton motive force powers ATP Synthase turbine.',
            summarySi: 'ඇතුළු මයිටොකොන්ඩ්‍රියා පටලය මත H+ ප්‍රෝටෝන අනුක්‍රමණයෙන් ATP සින්තේස් ක්‍රියාකාරී වේ.',
            children: [
              {
                id: 'etc_oxygen',
                label: 'Terminal Electron Acceptor',
                labelSi: 'අවසාන ඉලෙක්ට්‍රෝන ප්‍රතිග්‍රාහකයා',
                details: 'Molecular Oxygen (O2) accepts e- and H+ to form metabolic H2O',
                detailsSi: 'අණුක ඔක්සිජන් (O2) ඉලෙක්ට්‍රෝන සහ H+ ලබාගෙන ජලය (H2O) සාදයි'
              },
              {
                id: 'etc_atp_count',
                label: 'Theoretical Net ATP',
                labelSi: 'මුළු ATP ප්‍රමාණය',
                details: '30 to 32 ATP molecules produced per 1 Glucose molecule',
                detailsSi: 'ග්ලූකෝස් අණුවකට සම්පූර්ණ 30 - 32 ATP නිපදවේ'
              }
            ]
          },
          {
            id: 'photo_calvin',
            label: '4. Photosynthesis Light & Dark Phase (ප්‍රභාසංස්ලේෂණය)',
            labelSi: '4. ප්‍රභාසංස්ලේෂණ ආලෝක හා අඳුරු ප්‍රතික්‍රියා',
            color: 'from-emerald-600 to-teal-700',
            summary: 'Thylakoid membrane Photolysis of water -> Stroma Calvin cycle carbon fixation via RuBisCO.',
            summarySi: 'තයිලකොයිඩ පටලයේ ජලය ප්‍රකාශ විච්ඡේදනය -> පූරකයේ RuBisCO එන්සයිමය මඟින් CO2 ස්ථිර කිරීම.',
            children: [
              {
                id: 'calvin_rubisco',
                label: 'RuBisCO Carbon Fixation',
                labelSi: 'RuBisCO කාබන් ස්ථිර කිරීම',
                details: 'RuBP (5C) + CO2 -> unstable 6C -> 2x 3-PGA (Phosphoglyceric acid)',
                detailsSi: 'RuBP (5C) + CO2 මඟින් 3-PGA අණු 2ක් සාදයි'
              },
              {
                id: 'photo_g3p',
                label: 'G3P Triose Synthesis',
                labelSi: 'ට්‍රයෝස් සීනි සංස්ලේෂණය',
                details: 'Glyceraldehyde 3-phosphate exported to form Glucose, Sucrose & Starch',
                detailsSi: 'G3P මඟින් ග්ලූකෝස්, සුක්‍රෝස් සහ පිෂ්ඨය සංස්ලේෂණය කරයි'
              }
            ]
          }
        ]
      },
      summaryBulletPoints: [
        'Glycolysis is common to both aerobic and anaerobic pathways, occurring in the cytosol with net 2 ATP.',
        'Link reaction bridges glycolysis to the citric acid cycle by forming Acetyl-CoA and releasing CO2.',
        'The Krebs cycle in the mitochondrial matrix yields reducing powers (6 NADH, 2 FADH2) for high-energy electron transport.',
        'Chemiosmosis via ATP Synthase creates 30-32 ATP using the proton electrochemical gradient.',
        'Photosynthesis utilizes H2O photolysis in thylakoids and RuBisCO CO2 fixation in stroma to generate triose carbohydrates.'
      ],
      summaryBulletPointsSi: [
        'ග්ලයිකොලිසිය වායුගෝලීය හා නිර්වායු යන දෙකටම පොදු වන අතර සෛල ප්ලාස්මයේදී සිදුවී ශුද්ධ 2 ATP නිපදවයි.',
        'සම්බන්ධක ප්‍රතික්‍රියාව මඟින් පයිරුවේට් ඇසිටයිල්-CoA බවට පත්කර CO2 මුදා හරියි.',
        'ක්‍රෙබ්ස් චක්‍රය මඟින් ඉහළ ශක්ති ඉලෙක්ට්‍රෝන වාහක (6 NADH, 2 FADH2) නිපදවයි.',
        'ATP සින්තේස් එන්සයිමය මඟින් ප්‍රෝටෝන අනුක්‍රමණය ආධාරයෙන් 30-32 ATP සාදයි.',
        'ප්‍රභාසංස්ලේෂණයේදී තයිලකොයිඩ පටලයේ ජල විච්ඡේදනයෙන් O2 ද, පූරකයේ RuBisCO මඟින් සීනිද නිපදවයි.'
      ],
      keyTerms: [
        {
          term: 'Substrate-Level Phosphorylation',
          definition: 'Direct enzymatic transfer of a phosphate group from a phosphorylated metabolic intermediate to ADP forming ATP without an electron transport chain.',
          definitionSi: 'ඉලෙක්ට්‍රෝන ප්‍රවාහන දාමයකින් තොරව සෘජුවම උපස්තරයකින් ADP වෙත පොස්පේට් කාණ්ඩයක් මාරු කර ATP සෑදීම.'
        },
        {
          term: 'Proton Motive Force (PMF)',
          definition: 'Electrochemical gradient of H+ ions across the inner mitochondrial membrane generated by electron transport complexes I, III, and IV.',
          definitionSi: 'අභ්‍යන්තර මයිටොකොන්ඩ්‍රියා පටලය හරහා නිර්මාණය වන H+ ප්‍රෝටෝන විද්‍යුත් රසායනික අනුක්‍රමණය.'
        },
        {
          term: 'RuBisCO',
          definition: 'Ribulose-1,5-bisphosphate carboxylase-oxygenase, the most abundant enzyme on Earth, catalyzing the primary rate-limiting step of carbon fixation in the Calvin cycle.',
          definitionSi: 'කැල්වින් චක්‍රයේ CO2 ස්ථිර කිරීම උත්ප්‍රේරණය කරන පෘථිවියේ බහුලතම එන්සයිමය.'
        }
      ]
    }
  }
];
