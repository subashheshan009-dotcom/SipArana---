export type ExamLevel = 'AL' | 'OL' | 'JUNIOR' | 'CAMPUS';
export type StudentCategory = 'School' | 'University';
export type AppLanguage = 'si' | 'ta' | 'en';

export type Stream = 
  | 'Physical Science (Maths)' 
  | 'Biological Science (Bio)' 
  | 'Commerce' 
  | 'Technology' 
  | 'Arts' 
  | 'General O/L' 
  | 'Junior Secondary (Grade 6-9)'
  | 'Higher Education';
export type Medium = 'Sinhala' | 'English' | 'Tamil';

export type SchoolGrade = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentCategory?: StudentCategory; // 'School' or 'University'
  grade?: SchoolGrade;
  level: ExamLevel;
  stream: Stream;
  targetYear: number;
  school: string;
  district: string;
  medium: Medium;
  isPremium: boolean;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonsCount: number;
  solvedDoubtsCount: number;
  bookmarkedPaperIds: string[];
  enrolledSubjectIds?: string[];
  authProvider?: 'google' | 'email' | 'demo';
  
  // University Student Specific Attributes
  university?: string;
  universityShort?: string;
  faculty?: string;
  degreeProgramme?: string;
  degreeCode?: string;
  academicYear?: number; // 1, 2, 3, 4
  academicSemester?: number; // 1, 2 (or total semester index 1-8)
  studentIdNumber?: string;
  currentGpa?: number;
  targetGpa?: number;
}

export interface Subject {
  id: string;
  titleSinhala: string;
  titleEnglish: string;
  code: string;
  stream: Stream;
  grades: SchoolGrade[];
  category?: 'Core O/L' | 'Basket O/L' | 'A/L Stream' | 'Junior Core';
  guruPothaReference?: string;
  iconName: string;
  color: string;
  description: string;
  totalModules: number;
  completedModules: number;
  units: Unit[];
  pastPapers: PastPaper[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  titleSinhala?: string;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  titleSinhala?: string;
  videoUrl?: string;
  duration: string;
  summary: string;
  keyPoints: string[];
  formulaList?: string[];
  isCompleted?: boolean;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionSinhala?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PastPaper {
  id: string;
  subjectId: string;
  year: number;
  part: 'Part I (MCQ)' | 'Part II (Structured/Essay)' | 'Full Paper';
  medium: Medium;
  pdfUrl: string;
  markingSchemeUrl?: string;
  videoDiscussionUrl?: string;
  solvedPercentage?: number;
}

export interface CampusCourse {
  id: string;
  universityName: string;
  universityShort: string;
  courseName: string;
  streamRequired: Stream;
  durationYears: number;
  degreeType: 'B.Sc. Eng (Hons)' | 'MBBS' | 'B.Sc. (Hons)' | 'B.Com / B.BA' | 'B.Sc. IT / CS' | 'LL.B' | 'B.A. (Hons)' | 'B.Tech';
  districtCutoffs: Record<string, number>; // district -> min Z score
  averageZScore: number;
  intakeCapacity: number;
  careerProspects: string[];
  description: string;
  logo: string;
  isStateUni: boolean;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  createdAt: string;
  stream: Stream;
  subjectName: string;
  title: string;
  content: string;
  image?: string;
  upvotes: number;
  isUpvoted?: boolean;
  replies: ForumReply[];
  solved: boolean;
  tags: string[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'Student' | 'Teacher' | 'Campus Senior' | 'AI Tutor';
  createdAt: string;
  content: string;
  upvotes: number;
  isVerifiedAnswer?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleSinhala: string;
  source: 'Department of Examinations' | 'Ministry of Education' | 'UGC Sri Lanka' | 'SipArana Academic Board';
  publishedDate: string;
  category: 'Exam Notice' | 'University Intake' | 'Syllabus Update' | 'Scholarship' | 'Results';
  summary: string;
  fullContent: string;
  isUrgent?: boolean;
  linkUrl?: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

export interface VideoChapter {
  id: string;
  timeSeconds: number;
  timeFormatted: string;
  title: string;
  titleSinhala: string;
}

export interface ClassVideo {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectSinhala: string;
  grade: SchoolGrade;
  stream: Stream;
  classNumber: number; // e.g. 1, 2, 3
  unitNumber: number;
  unitTitle: string;
  unitTitleSinhala: string;
  guruPothaUnit?: string;
  title: string;
  titleSinhala: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  duration: string; // e.g. "1h 45m"
  durationSeconds: number;
  thumbnail: string;
  videoUrl: string; // youtube embed or demo stream
  description: string;
  descriptionSinhala: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Exam Booster';
  tags: string[];
  chapters: VideoChapter[];
  tutePdfUrl?: string;
  tuteTitle?: string;
  isCompleted?: boolean;
  viewCount: number;
  rating: number;
  totalRatings: number;
}

// ==========================================
// UNIVERSITY & DEGREE PORTAL TYPES
// ==========================================

export interface UniversityInstitution {
  id: string;
  name: string;
  shortName: string;
  nameSinhala: string;
  location: string;
  logo: string;
  badgeColor: string;
  description: string;
  website: string;
  isStateUni: boolean;
  faculties: UniversityFaculty[];
}

export interface UniversityFaculty {
  id: string;
  name: string;
  nameSinhala: string;
  shortCode: string;
  degrees: UniversityDegree[];
}

export interface UniversityDegree {
  id: string;
  code: string; // e.g. "ENG-CSE", "MED-MBBS", "MGT-FIN", "SCI-BIO", "TECH-BTEC"
  title: string;
  titleSinhala: string;
  shortTitle: string;
  facultyName: string;
  durationYears: number;
  totalCredits: number;
  careerTracks: string[];
  description: string;
  iconName: string;
  colorTheme: string;
  semesters: UniversitySemester[];
}

export interface UniversitySemester {
  semesterNumber: number; // 1 to 8
  year: number; // 1 to 4
  sem: number; // 1 or 2
  code: string; // e.g. "Y1S1", "Y2S2"
  label: string;
  modules: UniversityModule[];
}

export interface UniversityModule {
  id: string;
  code: string; // e.g. "CS2012", "MED1101", "FN3204"
  title: string;
  titleSinhala?: string;
  credits: number;
  type: 'Core' | 'Elective' | 'Lab/Practical' | 'Project' | 'Foundation';
  description: string;
  syllabusTopics: string[];
  prescribedTextbooks: string[];
  keyPrinciples: string[];
  sampleQuestions: string[];
  aiPromptStarters: string[];
  notesPdfUrl?: string;
  labManualUrl?: string;
}

export interface UniversityAIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  moduleCode?: string;
  contextMode?: 'concept' | 'code' | 'research' | 'examprep' | 'assignment';
  isFallback?: boolean;
}

export interface UniversityResource {
  id: string;
  title: string;
  degreeCode: string;
  moduleCode: string;
  type: 'Lecture Notes' | 'Past Exam Paper' | 'Lab Sheet' | 'Assignment Guide' | 'Research Paper';
  author: string;
  uploadDate: string;
  fileSize: string;
  downloadCount: number;
  rating: number;
}

export interface StudySessionRecord {
  id: string;
  subject: string;
  topic?: string;
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  xpEarned: number;
  timestamp: number;
  date: string;
  timeFormatted: string;
}


