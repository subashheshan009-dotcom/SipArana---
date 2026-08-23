export interface TestAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  quizTitleSinhala: string;
  subjectName: string;
  subjectSinhala: string;
  score: number; // percentage 0-100
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string; // ISO date string
  xpEarned: number;
  grade: number | string;
  weakTopicsDetected: string[];
}

export interface SubjectMastery {
  subject: string;
  subjectSinhala: string;
  masteryPercentage: number;
  testsCompleted: number;
  avgScore: number;
  color: string;
}

export interface WeakPointItem {
  id: string;
  topic: string;
  topicSinhala: string;
  subject: string;
  subjectSinhala: string;
  accuracy: number; // e.g., 42%
  urgency: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  suggestedActionSinhala: string;
  resourceLink?: string;
}

export const INITIAL_TEST_ATTEMPTS: TestAttemptRecord[] = [
  {
    id: 'att_1',
    quizId: 'quiz_cm_calculus_01',
    quizTitle: 'Definite Integration & Differential Calculus',
    quizTitleSinhala: 'නියත අනුකලනය සහ අවකලන යෙදීම්',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    score: 80,
    correctCount: 4,
    totalQuestions: 5,
    timeSpentSeconds: 420,
    completedAt: '2026-08-16T14:30:00Z',
    xpEarned: 100,
    grade: 13,
    weakTopicsDetected: ['Geometric Series Infinity Sums']
  },
  {
    id: 'att_2',
    quizId: 'quiz_phys_mechanics_01',
    quizTitle: 'Newtonian Mechanics & Circular Motion',
    quizTitleSinhala: 'නිව්ටෝනියානු යාන්ත්‍ර විද්‍යාව සහ වෘත්ත චලිතය',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    score: 75,
    correctCount: 3,
    totalQuestions: 4,
    timeSpentSeconds: 380,
    completedAt: '2026-08-18T10:15:00Z',
    xpEarned: 90,
    grade: 12,
    weakTopicsDetected: ['Viscosity and Terminal Velocity Stokes Law']
  },
  {
    id: 'att_3',
    quizId: 'quiz_chem_organic_01',
    quizTitle: 'Organic Reaction Mechanisms & Bonding',
    quizTitleSinhala: 'කාබනික ප්‍රතික්‍රියා යාන්ත්‍රණ සහ රසායනික බන්ධන',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    score: 66,
    correctCount: 2,
    totalQuestions: 3,
    timeSpentSeconds: 290,
    completedAt: '2026-08-20T16:45:00Z',
    xpEarned: 80,
    grade: 12,
    weakTopicsDetected: ['VSEPR Theory & Lone Pair Geometry']
  },
  {
    id: 'att_4',
    quizId: 'quiz_ol_science_01',
    quizTitle: 'Electricity, Circuits & Magnetism (O/L)',
    quizTitleSinhala: 'ධාරා විද්‍යුතය, පරිපථ සහ චුම්භකත්වය (සා.පෙළ)',
    subjectName: 'Science',
    subjectSinhala: 'විද්‍යාව',
    score: 100,
    correctCount: 2,
    totalQuestions: 2,
    timeSpentSeconds: 150,
    completedAt: '2026-08-21T09:20:00Z',
    xpEarned: 100,
    grade: 11,
    weakTopicsDetected: []
  },
  {
    id: 'att_5',
    quizId: 'quiz_cm_calculus_01',
    quizTitle: 'Definite Integration & Differential Calculus',
    quizTitleSinhala: 'නියත අනුකලනය සහ අවකලන යෙදීම්',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    score: 100,
    correctCount: 5,
    totalQuestions: 5,
    timeSpentSeconds: 340,
    completedAt: '2026-08-22T08:00:00Z',
    xpEarned: 120,
    grade: 13,
    weakTopicsDetected: []
  }
];

export const INITIAL_WEAK_POINTS: WeakPointItem[] = [
  {
    id: 'wp_1',
    topic: 'VSEPR Theory & 3D Molecular Geometry (ClF3 / XeF4)',
    topicSinhala: 'VSEPR සිද්ධාන්තය සහ ත්‍රිමාන අණුක හැඩ (ClF3 / XeF4)',
    subject: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    accuracy: 45,
    urgency: 'High',
    suggestedAction: 'Review Chemistry Resource Book Unit 02 and practice 10 past paper hybrid orbital questions.',
    suggestedActionSinhala: 'රසායන විද්‍යාව සම්පත් පොතේ 02 වන ඒකකය නැවත කියවා පසුගිය විභාග ප්‍රශ්න 10ක් පුහුණු වන්න.'
  },
  {
    id: 'wp_2',
    topic: 'Viscous Drag, Terminal Velocity & Stokes Law Derivations',
    topicSinhala: 'දුස්ස්‍රාවී ඇදුම, අන්ත ප්‍රවේගය සහ ස්ටෝක්ස් නියමය සාධනය',
    subject: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    accuracy: 52,
    urgency: 'High',
    suggestedAction: 'Watch Video Lesson #02 on Fluid Dynamics and solve terminal velocity equations.',
    suggestedActionSinhala: 'තරල ගතිකය පිළිබඳ වීඩියෝ පාඩම නරඹා F = 6πηrv සූත්‍ර ආශ්‍රිත ප්‍රශ්න විසඳන්න.'
  },
  {
    id: 'wp_3',
    topic: 'Infinite Geometric Series & Partial Fractions Integration',
    topicSinhala: 'අනන්ත ගුණෝත්තර ශ්‍රේණි සහ භාගික භාග අනුකලනය',
    subject: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    accuracy: 64,
    urgency: 'Medium',
    suggestedAction: 'Practice Guru Potha exercises on S∞ = a/(1-r) condition |r| < 1.',
    suggestedActionSinhala: '|r| < 1 සීමාව යටතේ අනන්ත ඓක්‍යය සෙවීමේ ගැටලු 15ක් අභ්‍යාස පොතේ ලියන්න.'
  },
  {
    id: 'wp_4',
    topic: 'Dihybrid Cross Probability & Genetic Linkage',
    topicSinhala: 'දෙමුහුම් මුහුම් සම්භාවිතාව සහ ප්‍රවේණික බැඳීම',
    subject: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    accuracy: 68,
    urgency: 'Medium',
    suggestedAction: 'Draw Punnett squares for 9:3:3:1 ratio exceptions and recombinant test crosses.',
    suggestedActionSinhala: 'පනට් කොටු ඇඳ 9:3:3:1 අනුපාතය සහ ප්‍රතිසංයෝජන පරීක්ෂා මුහුම් විග්‍රහ කරන්න.'
  }
];

export const SUBJECT_MASTERY_DEFAULTS: SubjectMastery[] = [
  { subject: 'Combined Maths', subjectSinhala: 'සංයුක්ත ගණිතය', masteryPercentage: 88, testsCompleted: 8, avgScore: 84, color: '#2563eb' },
  { subject: 'Physics', subjectSinhala: 'භෞතික විද්‍යාව', masteryPercentage: 74, testsCompleted: 6, avgScore: 72, color: '#f59e0b' },
  { subject: 'Chemistry', subjectSinhala: 'රසායන විද්‍යාව', masteryPercentage: 68, testsCompleted: 5, avgScore: 66, color: '#10b981' },
  { subject: 'Biology', subjectSinhala: 'ජීව විද්‍යාව', masteryPercentage: 82, testsCompleted: 7, avgScore: 80, color: '#06b6d4' },
  { subject: 'ICT', subjectSinhala: 'තොරතුරු තාක්ෂණය', masteryPercentage: 92, testsCompleted: 4, avgScore: 91, color: '#8b5cf6' },
  { subject: 'O/L Science', subjectSinhala: 'සා.පෙළ විද්‍යාව', masteryPercentage: 95, testsCompleted: 9, avgScore: 94, color: '#ec4899' },
];
