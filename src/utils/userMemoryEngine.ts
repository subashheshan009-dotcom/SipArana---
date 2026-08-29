import type { UserProfile, SchoolGrade, Medium } from '@/types';

export interface MemoryChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  dateISO: string;
  subjectTag?: string;
  attachedImage?: string;
  attachedPdfName?: string;
}

export interface UploadedStudyMaterial {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'text' | 'document';
  subject?: string;
  uploadedAt: string;
  summary?: string;
  dataUrlOrPreview?: string;
  fileSize?: string;
}

export interface GeneratedStudyAsset {
  id: string;
  type: 'summary' | 'flashcards' | 'mcq' | 'mindmap' | 'model_paper' | 'adapted_format' | 'doc_analysis';
  topic: string;
  subject: string;
  grade: number | string;
  content: string;
  date: string;
  keyPoints?: string[];
  mermaidCode?: string;
}

export interface EssayEvaluationRecord {
  id: string;
  topic: string;
  subject: string;
  question: string;
  submittedAnswer: string;
  maxMarks: number;
  estimatedMarks: number;
  percentage: number;
  gradeLetter: string;
  strengths: string[];
  areasForImprovement: string[];
  modelAnswer: string;
  fullFeedback: string;
  date: string;
}

export interface WeakSubjectAreaRecord {
  id: string;
  subject: string;
  topic: string;
  identifiedFrom: 'quiz' | 'essay' | 'doubt' | 'user_flag';
  accuracyPercentage?: number;
  urgency: 'High' | 'Medium' | 'Low';
  dateIdentified: string;
  recommendedAction: string;
  recommendedActionSinhala?: string;
  isResolved?: boolean;
}

export interface UserStudyMemory {
  email: string;
  userId: string;
  userName: string;
  studentCategory?: 'School' | 'University';
  grade?: SchoolGrade;
  stream?: string;
  countryCode?: string;
  countryName?: string;
  countryFlag?: string;
  university?: string;
  faculty?: string;
  degreeProgramme?: string;
  academicYear?: number;
  lastActiveDate: string;
  totalSessionsCount: number;
  lastStudiedTopic?: {
    topic: string;
    subject: string;
    timestamp: string;
  };
  chatHistory: MemoryChatMessage[];
  uploadedMaterials: UploadedStudyMaterial[];
  generatedAssets: GeneratedStudyAsset[];
  essayEvaluations: EssayEvaluationRecord[];
  weakSubjectAreas: WeakSubjectAreaRecord[];
  studyGoals: Array<{
    id: string;
    title: string;
    subject: string;
    targetScore: string;
    progress: number;
  }>;
}

// Normalize email key
export function normalizeEmail(email: string | undefined): string {
  if (!email) return 'guest_student@siparana.lk';
  return email.trim().toLowerCase();
}

const MEMORY_PREFIX = 'siparana_study_memory_';

// Initial default memory tailored to student's grade/stream if brand new
function createInitialUserMemory(profile: UserProfile): UserStudyMemory {
  const isUni = profile.studentCategory === 'University';
  const isGrade5 = profile.grade === 5 || profile.level === 'SCHOLARSHIP';
  const isOL = profile.grade && profile.grade <= 11 && profile.grade >= 10;
  
  let defaultLastTopic = {
    topic: isGrade5 ? 'පරිසරය හා සරල ගණිත කෙටි ක්‍රම' : isUni ? 'Data Structures & System Architecture' : isOL ? 'විද්‍යාව - රසායනික ප්‍රතික්‍රියා හා චලිතය' : 'සංයුක්ත ගණිතය - අවකලන යෙදීම් (Differentiation)',
    subject: isGrade5 ? '5 වසර ශිෂ්‍යත්වය' : isUni ? 'Computing / Engineering' : isOL ? 'Science (විද්‍යාව)' : 'Combined Mathematics',
    timestamp: new Date().toISOString()
  };

  let defaultChat: MemoryChatMessage[] = [
    {
      id: `msg_welcome_${Date.now()}`,
      sender: 'ai',
      text: isGrade5
        ? `ආයුබෝවන් ${profile.name}! 🦉 මම කවි බකමූණ යාළුවා (Kavi AI). 5 වසර ශිෂ්‍යත්වයේ සිංහල, ගණිතය, පරිසරය හෝ බුද්ධි පරීක්ෂණ ඕනෑම ප්‍රශ්නයක් මගෙන් අහන්න. අපි එකතු වෙලා 160+ ඉලක්කයට ලෑස්ති වෙමු! 🌟🎈`
        : `ආයුබෝවන් ${profile.name}! මම සිප්අරණ AI Core. ඔබේ අධ්‍යයන මතකය සහ පෙර ඉගෙනුම් ඉතිහාසය (Study Memory) සක්‍රියයි. ඕනෑම විෂය ගැටලුවක්, විභාග ප්‍රශ්න පත්‍රයක් හෝ රචනා ඇගයීමක් සඳහා මම සූදානම්. 🚀📚`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateISO: new Date().toISOString(),
      subjectTag: defaultLastTopic.subject
    }
  ];

  let defaultGeneratedAssets: GeneratedStudyAsset[] = [
    {
      id: `asset_init_1`,
      type: 'summary',
      topic: defaultLastTopic.topic,
      subject: defaultLastTopic.subject,
      grade: profile.grade || 12,
      content: `### 📌 ඉක්මන් සංශෝධන සාරාංශය (High-Yield Quick Revision)\n* **මූලික සංකල්ප:** විභාග ප්‍රශ්න පත්‍රවල නිතර අසන මූලික නීති සහ සූත්‍ර.\n* **විභාග ඉඟි:** පියවරෙන් පියවර ලකුණු ලබා ගැනීමේ සම්මත ක්‍රමවේදය.`,
      date: new Date().toISOString().split('T')[0],
      keyPoints: ['මූලික නීති නිවැරදිව මතක තබා ගන්න', 'SI ඒකක අනිවාර්යයෙන් ලියන්න', 'පසුගිය විභාග ප්‍රශ්න රටා නැවත පුහුණු වන්න']
    }
  ];

  let defaultWeakAreas: WeakSubjectAreaRecord[] = [
    {
      id: `weak_init_1`,
      subject: defaultLastTopic.subject,
      topic: isGrade5 ? 'කාලය හා මුදල් ආශ්‍රිත වාචික ගැටලු' : isOL ? 'රසායනික සමීකරණ තුලනය' : 'ත්‍රිකෝණමිතික සර්වසාම්‍ය සහ අනුකලන ආදේශ',
      identifiedFrom: 'quiz',
      accuracyPercentage: 55,
      urgency: 'Medium',
      dateIdentified: new Date().toISOString().split('T')[0],
      recommendedAction: 'Review past paper MCQ step-by-step solutions in AI Tutor',
      recommendedActionSinhala: 'AI ගුරු සහකාර සමඟ පසුගිය ප්‍රශ්න පත්‍ර පියවරෙන් පියවර සාකච්ඡා කරන්න'
    }
  ];

  return {
    email: normalizeEmail(profile.email),
    userId: profile.id,
    userName: profile.name,
    studentCategory: profile.studentCategory,
    grade: profile.grade,
    stream: profile.stream,
    countryCode: profile.countryCode || 'LK',
    countryName: profile.countryName || 'Sri Lanka',
    countryFlag: profile.countryFlag || '🇱🇰',
    university: profile.university,
    faculty: profile.faculty,
    degreeProgramme: profile.degreeProgramme,
    academicYear: profile.academicYear,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalSessionsCount: 1,
    lastStudiedTopic: defaultLastTopic,
    chatHistory: defaultChat,
    uploadedMaterials: [],
    generatedAssets: defaultGeneratedAssets,
    essayEvaluations: [],
    weakSubjectAreas: defaultWeakAreas,
    studyGoals: [
      {
        id: 'goal_1',
        title: isGrade5 ? 'ශිෂ්‍යත්ව 160+ ලකුණු ඉලක්කය' : 'A/L Distinction Mastery (3 A\'s)',
        subject: defaultLastTopic.subject,
        targetScore: isGrade5 ? '165/200' : '90%+',
        progress: 45
      }
    ]
  };
}

/**
 * Fetch persistent user memory linked to the specified email address
 */
export function getUserStudyMemory(email: string, fallbackProfile?: UserProfile): UserStudyMemory {
  const normEmail = normalizeEmail(email);
  try {
    const raw = localStorage.getItem(`${MEMORY_PREFIX}${normEmail}`);
    if (raw) {
      const parsed: UserStudyMemory = JSON.parse(raw);
      // Ensure arrays exist
      if (!Array.isArray(parsed.chatHistory)) parsed.chatHistory = [];
      if (!Array.isArray(parsed.uploadedMaterials)) parsed.uploadedMaterials = [];
      if (!Array.isArray(parsed.generatedAssets)) parsed.generatedAssets = [];
      if (!Array.isArray(parsed.essayEvaluations)) parsed.essayEvaluations = [];
      if (!Array.isArray(parsed.weakSubjectAreas)) parsed.weakSubjectAreas = [];
      if (!Array.isArray(parsed.studyGoals)) parsed.studyGoals = [];
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading user study memory:', err);
  }

  // If not found, create new memory structure
  if (fallbackProfile) {
    const fresh = createInitialUserMemory(fallbackProfile);
    saveUserStudyMemory(normEmail, fresh);
    return fresh;
  }

  // Barebones fallback
  const bare: UserStudyMemory = {
    email: normEmail,
    userId: `usr_${Date.now()}`,
    userName: 'Student',
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalSessionsCount: 1,
    chatHistory: [],
    uploadedMaterials: [],
    generatedAssets: [],
    essayEvaluations: [],
    weakSubjectAreas: [],
    studyGoals: []
  };
  saveUserStudyMemory(normEmail, bare);
  return bare;
}

/**
 * Save user study memory persistently to localStorage
 */
export function saveUserStudyMemory(email: string, memory: UserStudyMemory): void {
  const normEmail = normalizeEmail(email || memory.email);
  try {
    memory.email = normEmail;
    memory.lastActiveDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(`${MEMORY_PREFIX}${normEmail}`, JSON.stringify(memory));
  } catch (err) {
    console.error('Failed to save user study memory:', err);
  }
}

/**
 * Record a new chat interaction into the student's email memory
 */
export function recordChatToMemory(
  email: string,
  userMsg: { text: string; attachedImage?: string; attachedPdfName?: string; subjectTag?: string },
  aiMsg: { text: string; subjectTag?: string }
): UserStudyMemory {
  const mem = getUserStudyMemory(email);
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const nowISO = new Date().toISOString();

  const uMessage: MemoryChatMessage = {
    id: `user_${Date.now()}`,
    sender: 'user',
    text: userMsg.text,
    timestamp: nowTime,
    dateISO: nowISO,
    subjectTag: userMsg.subjectTag,
    attachedImage: userMsg.attachedImage,
    attachedPdfName: userMsg.attachedPdfName
  };

  const aMessage: MemoryChatMessage = {
    id: `ai_${Date.now() + 1}`,
    sender: 'ai',
    text: aiMsg.text,
    timestamp: nowTime,
    dateISO: nowISO,
    subjectTag: aiMsg.subjectTag || userMsg.subjectTag
  };

  mem.chatHistory.push(uMessage, aMessage);
  
  // Update last studied topic
  if (userMsg.text) {
    mem.lastStudiedTopic = {
      topic: userMsg.text.length > 50 ? `${userMsg.text.slice(0, 50)}...` : userMsg.text,
      subject: userMsg.subjectTag || mem.lastStudiedTopic?.subject || 'General Study',
      timestamp: nowISO
    };
  }

  // If user attached material, record it in uploadedMaterials
  if (userMsg.attachedImage || userMsg.attachedPdfName) {
    mem.uploadedMaterials.push({
      id: `mat_${Date.now()}`,
      name: userMsg.attachedPdfName || (userMsg.attachedImage ? 'Photo Question Attachment' : 'Study Attachment'),
      type: userMsg.attachedPdfName ? 'pdf' : 'image',
      subject: userMsg.subjectTag,
      uploadedAt: new Date().toLocaleDateString(),
      dataUrlOrPreview: userMsg.attachedImage
    });
  }

  saveUserStudyMemory(email, mem);
  return mem;
}

/**
 * Record a generated study asset (Summary, Flashcard set, Mindmap, Model paper)
 */
export function recordGeneratedAssetToMemory(
  email: string,
  asset: Omit<GeneratedStudyAsset, 'id' | 'date'>
): GeneratedStudyAsset {
  const mem = getUserStudyMemory(email);
  const newAsset: GeneratedStudyAsset = {
    ...asset,
    id: `asset_${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };

  mem.generatedAssets.unshift(newAsset);
  
  // Also track as last studied topic
  mem.lastStudiedTopic = {
    topic: asset.topic,
    subject: asset.subject,
    timestamp: new Date().toISOString()
  };

  saveUserStudyMemory(email, mem);
  return newAsset;
}

/**
 * Record an essay or structured answer evaluation
 */
export function recordEssayEvaluationToMemory(
  email: string,
  evaluation: Omit<EssayEvaluationRecord, 'id' | 'date'>
): EssayEvaluationRecord {
  const mem = getUserStudyMemory(email);
  const newEval: EssayEvaluationRecord = {
    ...evaluation,
    id: `eval_${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };

  mem.essayEvaluations.unshift(newEval);

  // If score is low (< 65%), automatically flag improvement area as a weak subject point
  if (newEval.percentage < 65 || (newEval.estimatedMarks / newEval.maxMarks) < 0.65) {
    const weakTopic = evaluation.topic || evaluation.question.slice(0, 40);
    const existing = mem.weakSubjectAreas.find(w => w.topic.toLowerCase() === weakTopic.toLowerCase());
    if (!existing) {
      mem.weakSubjectAreas.unshift({
        id: `weak_${Date.now()}`,
        subject: evaluation.subject || 'National Curriculum',
        topic: weakTopic,
        identifiedFrom: 'essay',
        accuracyPercentage: Math.round(newEval.percentage),
        urgency: newEval.percentage < 50 ? 'High' : 'Medium',
        dateIdentified: new Date().toISOString().split('T')[0],
        recommendedAction: `Review ${evaluation.areasForImprovement[0] || 'marking criteria and structured derivations'}`,
        recommendedActionSinhala: `රචනා ප්‍රශ්න රටාවන් සහ ලකුණු බෙදීමේ ක්‍රමවේදය නැවත සමාලෝචනය කරන්න`
      });
    }
  }

  saveUserStudyMemory(email, mem);
  return newEval;
}

/**
 * Record or update a weak subject area identified during study sessions or quizzes
 */
export function recordWeakSubjectArea(
  email: string,
  weakArea: Omit<WeakSubjectAreaRecord, 'id' | 'dateIdentified'>
): WeakSubjectAreaRecord {
  const mem = getUserStudyMemory(email);
  const existingIndex = mem.weakSubjectAreas.findIndex(
    w => w.topic.toLowerCase() === weakArea.topic.toLowerCase() && w.subject === weakArea.subject
  );

  let record: WeakSubjectAreaRecord;
  if (existingIndex >= 0) {
    record = {
      ...mem.weakSubjectAreas[existingIndex],
      ...weakArea,
      dateIdentified: new Date().toISOString().split('T')[0]
    };
    mem.weakSubjectAreas[existingIndex] = record;
  } else {
    record = {
      ...weakArea,
      id: `weak_${Date.now()}`,
      dateIdentified: new Date().toISOString().split('T')[0]
    };
    mem.weakSubjectAreas.unshift(record);
  }

  saveUserStudyMemory(email, mem);
  return record;
}

/**
 * Mark a weak area as resolved / mastered
 */
export function resolveWeakSubjectArea(email: string, id: string): void {
  const mem = getUserStudyMemory(email);
  mem.weakSubjectAreas = mem.weakSubjectAreas.map(w =>
    w.id === id ? { ...w, isResolved: true } : w
  );
  saveUserStudyMemory(email, mem);
}

/**
 * Explicit user command to clear study session memory (NEVER done automatically)
 */
export function clearUserStudyMemory(email: string, profile?: UserProfile): UserStudyMemory {
  const normEmail = normalizeEmail(email);
  localStorage.removeItem(`${MEMORY_PREFIX}${normEmail}`);
  if (profile) {
    const fresh = createInitialUserMemory(profile);
    saveUserStudyMemory(normEmail, fresh);
    return fresh;
  }
  const blank: UserStudyMemory = {
    email: normEmail,
    userId: `usr_${Date.now()}`,
    userName: 'Student',
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalSessionsCount: 1,
    chatHistory: [],
    uploadedMaterials: [],
    generatedAssets: [],
    essayEvaluations: [],
    weakSubjectAreas: [],
    studyGoals: []
  };
  saveUserStudyMemory(normEmail, blank);
  return blank;
}

/**
 * Get personalized returning greeting recognizing student context
 */
export function getPersonalizedReturningGreeting(
  profile: UserProfile | null,
  memory?: UserStudyMemory | null,
  language: string = 'si'
): {
  headline: string;
  subtext: string;
  resumeTopic: string;
  hasPreviousHistory: boolean;
} {
  const userName = profile?.name || memory?.userName || 'ශිෂ්‍යයා';
  const chatHistory = memory?.chatHistory || [];
  const generatedAssets = memory?.generatedAssets || [];
  const essayEvaluations = memory?.essayEvaluations || [];
  const hasHistory = chatHistory.length > 1 || generatedAssets.length > 0 || essayEvaluations.length > 0;
  const lastTopic = memory?.lastStudiedTopic?.topic || 'පාඩම් ඒකකය';
  const lastSubject = memory?.lastStudiedTopic?.subject || profile?.stream || 'විෂය';

  if (!hasHistory) {
    if (language === 'si') {
      return {
        headline: `සාදරයෙන් පිළිගන්නවා, ${userName}! 🌟`,
        subtext: `සිප්අරණ ස්මාර්ට් ඉගෙනුම් මධ්‍යස්ථානයට ඔබව සාදරයෙන් පිළිගනිමු. අද අපි අලුත් පාඩමක් ආරම්භ කරමුද?`,
        resumeTopic: lastTopic,
        hasPreviousHistory: false
      };
    } else if (language === 'ta') {
      return {
        headline: `வணக்கம், ${userName}! 🌟`,
        subtext: `சிப்பாரண கற்றல் மையத்திற்கு உங்களை வரவேற்கிறோம். இன்றே உங்கள் படிப்பைத் தொடங்குங்கள்.`,
        resumeTopic: lastTopic,
        hasPreviousHistory: false
      };
    } else {
      return {
        headline: `Welcome, ${userName}! 🌟`,
        subtext: `Welcome to SipArana Smart Learning Ecosystem. Ready to begin your learning journey today?`,
        resumeTopic: lastTopic,
        hasPreviousHistory: false
      };
    }
  }

  // Returning user with history
  if (language === 'si') {
    return {
      headline: `සාදරයෙන් පිළිගන්නවා ${userName}! 👋`,
      subtext: `අපි කලින් නැවතුණු "${lastTopic}" (${lastSubject}) පාඩම දිගටම කරගෙන යමුද?`,
      resumeTopic: lastTopic,
      hasPreviousHistory: true
    };
  } else if (language === 'ta') {
    return {
      headline: `மீண்டும் வருக, ${userName}! 👋`,
      subtext: `நாங்கள் கடைசியாக விட்ட "${lastTopic}" பாடத்திலிருந்து தொடருவோமா?`,
      resumeTopic: lastTopic,
      hasPreviousHistory: true
    };
  } else {
    return {
      headline: `Welcome back, ${userName}! 👋`,
      subtext: `Shall we continue from where we left off on "${lastTopic}" (${lastSubject})?`,
      resumeTopic: lastTopic,
      hasPreviousHistory: true
    };
  }
}

/**
 * Format active student memory context for injection into Gemini AI prompts
 */
export function buildMemoryContextForGemini(memory?: UserStudyMemory | null): string {
  if (!memory) {
    return 'No prior memory recorded.';
  }

  const recentQuestions = (memory.chatHistory || [])
    .filter(m => m.sender === 'user')
    .slice(-4)
    .map(m => `- "${m.text}" (${m.subjectTag || 'General'})`)
    .join('\n');

  const weakAreas = (memory.weakSubjectAreas || [])
    .filter(w => !w.isResolved)
    .slice(0, 3)
    .map(w => `- ${w.subject}: ${w.topic} (Urgency: ${w.urgency}, Identified from ${w.identifiedFrom})`)
    .join('\n');

  const recentEvaluations = (memory.essayEvaluations || [])
    .slice(0, 2)
    .map(e => `- Topic: ${e.topic}, Score: ${e.estimatedMarks}/${e.maxMarks}, Improvement Focus: ${e.areasForImprovement?.[0] || 'Structured formatting'}`)
    .join('\n');

  const lastTopic = memory.lastStudiedTopic ? `${memory.lastStudiedTopic.topic} (${memory.lastStudiedTopic.subject})` : 'None';

  const academicBackground = memory.studentCategory === 'University'
    ? `- Category: University Undergraduate\n- University: ${memory.university || 'Sri Lankan University'}\n- Faculty: ${memory.faculty || 'General Faculty'}\n- Degree Programme: ${memory.degreeProgramme || 'Undergraduate Degree'}\n- Academic Year: Year ${memory.academicYear || 1}`
    : `- Category: School Student\n- Grade: ${memory.grade ? `Grade ${memory.grade}` : 'Secondary'}\n- Stream: ${memory.stream || 'General Academic'}`;

  return `
STUDENT'S CONTINUOUS MEMORY CONTEXT (Email: ${memory.email}):
- User Name: ${memory.userName}
- Country / Region: ${memory.countryFlag || '🇱🇰'} ${memory.countryName || 'Sri Lanka'} (${memory.countryCode || 'LK'})
${academicBackground}
- Last Studied Topic: ${lastTopic}
- Previously Asked Questions & Inquiries:
${recentQuestions || '  None recorded yet'}
- Identified Weak Subject Areas (Needs targeted reinforcement):
${weakAreas || '  No critical weak areas flagged'}
- Recent Essay & Written Answer Evaluations:
${recentEvaluations || '  No previous essays evaluated'}

INSTRUCTION FOR AI: Reference this prior learning context naturally when appropriate. If the student previously struggled with an identified weak area, provide supportive, step-by-step reinforcement without repeating introductory explanations.
`;
}
