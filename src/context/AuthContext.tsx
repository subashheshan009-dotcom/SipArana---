import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Stream, ExamLevel, Medium, SchoolGrade, StudentCategory, GlobalCountryCode, AppLanguage } from '@/types';
import { getCountryByCode, getCurriculumById, getCountrySubdivisions } from '@/data/globalCurriculumData';
import { syncUserWithBackend } from '@/services/leaderboardService';
import {
  captureIncomingReferral,
  processVerifiedReferralOnRegistration
} from '@/services/referralService';
import {
  getUserStudyMemory,
  saveUserStudyMemory,
  recordChatToMemory,
  recordGeneratedAssetToMemory,
  recordEssayEvaluationToMemory,
  recordWeakSubjectArea,
  resolveWeakSubjectArea,
  clearUserStudyMemory,
  normalizeEmail,
  type UserStudyMemory,
  type GeneratedStudyAsset,
  type EssayEvaluationRecord,
  type WeakSubjectAreaRecord
} from '@/utils/userMemoryEngine';

export type DemoPresetKey = 
  | 'scholarship' 
  | 'maths' 
  | 'bio' 
  | 'commerce' 
  | 'ol' 
  | 'junior' 
  | 'arts' 
  | 'tech' 
  | 'uni_cse' 
  | 'uni_med' 
  | 'uni_fin'
  | 'uk_alevel'
  | 'us_ap'
  | 'jp_koko'
  | 'in_jee'
  | 'au_atar'
  | 'global_ib';

export interface SimpleLoginParams {
  name: string;
  studentCategory: StudentCategory;
  grade?: SchoolGrade;
  stream?: Stream;
  medium?: Medium;
  district?: string;
  school?: string;
  targetYear?: number;
  isKidMode?: boolean;
  
  // Global Country & Multi-Curriculum Core
  countryCode?: GlobalCountryCode;
  countryName?: string;
  countryFlag?: string;
  curriculumId?: string;
  curriculumName?: string;
  gradingSystemId?: string;
  gradingTarget?: string;
  nativeLanguage?: AppLanguage;
  
  university?: string;
  faculty?: string;
  degreeProgramme?: string;
  degreeCode?: string;
  academicYear?: number;
  academicSemester?: number;
}

interface AuthContextType {
  profile: UserProfile | null;
  studyMemory: UserStudyMemory | null;
  loading: boolean;
  simpleLogin: (params: SimpleLoginParams) => Promise<{ success: boolean; error?: string }>;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleData?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    category?: StudentCategory;
    grade?: SchoolGrade;
    stream?: Stream;
    countryCode?: GlobalCountryCode;
    curriculumId?: string;
    university?: string;
    degreeProgramme?: string;
    district?: string;
    medium?: Medium;
    isNewUser?: boolean;
  }) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginAsDemo: (presetKey: DemoPresetKey) => void;
  register: (data: Partial<UserProfile> & { password?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  setGradeAndStream: (grade: SchoolGrade, stream?: Stream) => void;
  setCountryAndCurriculum: (countryCode: GlobalCountryCode, curriculumId?: string) => void;
  setUniversityAndDegree: (university: string, faculty: string, degreeProgramme: string, degreeCode: string, academicYear?: number, academicSemester?: number) => void;
  toggleStudentCategory: (category?: StudentCategory) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  toggleBookmarkPaper: (paperId: string) => void;
  
  // Continuous Context & Study Memory Retention methods
  recordChat: (
    userMsg: { text: string; attachedImage?: string; attachedPdfName?: string; subjectTag?: string },
    aiMsg: { text: string; subjectTag?: string }
  ) => void;
  recordAsset: (asset: Omit<GeneratedStudyAsset, 'id' | 'date'>) => GeneratedStudyAsset | null;
  recordEvaluation: (evaluation: Omit<EssayEvaluationRecord, 'id' | 'date'>) => EssayEvaluationRecord | null;
  recordWeakArea: (weakArea: Omit<WeakSubjectAreaRecord, 'id' | 'dateIdentified'>) => WeakSubjectAreaRecord | null;
  resolveWeakArea: (id: string) => void;
  clearStudySessionMemory: () => void;
  refreshStudyMemory: () => void;
}

const DEFAULT_USERS: Record<DemoPresetKey, UserProfile> = {
  scholarship: {
    id: 'usr_sch_1',
    name: 'සෙනුරි පුංචි පැටියා (Senuri)',
    email: 'senuri.k@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 5,
    level: 'SCHOLARSHIP',
    stream: 'Grade 5 Scholarship',
    countryCode: 'LK',
    countryName: 'Sri Lanka',
    countryFlag: '🇱🇰',
    curriculumId: 'LK_NIE',
    curriculumName: 'Sri Lanka National NIE',
    targetYear: 2026,
    school: 'Royal Primary School, Colombo',
    district: 'Colombo',
    medium: 'Sinhala',
    isPremium: true,
    isKidMode: true,
    xp: 1450,
    streakDays: 8,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 22,
    solvedDoubtsCount: 12,
    bookmarkedPaperIds: ['sch_pp_sin_2025', 'sch_pp_mat_2025'],
  },
  uk_alevel: {
    id: 'usr_uk_1',
    name: 'Alexander Wright',
    email: 'alex.wright@oxfordprep.uk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 13,
    level: 'GLOBAL_SENIOR',
    stream: 'A-Level STEM (Maths, Further Maths, Physics, Chemistry)',
    countryCode: 'UK',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    curriculumId: 'UK_GCSE_AL',
    curriculumName: 'UK National Curriculum (A-Levels)',
    gradingSystemId: 'UK_9_TO_1',
    gradingTarget: 'A* A* A* (UCAS 168 pts)',
    targetYear: 2026,
    school: 'Westminster School, London',
    district: 'Greater London',
    medium: 'English',
    isPremium: true,
    xp: 3450,
    streakDays: 19,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 52,
    solvedDoubtsCount: 24,
    bookmarkedPaperIds: ['uk_al_maths_2025'],
  },
  us_ap: {
    id: 'usr_us_1',
    name: 'Emily Zhang',
    email: 'emily.z@bayacademy.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'GLOBAL_SENIOR',
    stream: 'AP STEM Honours (Calculus BC, Physics C, Chemistry, CS)',
    countryCode: 'US',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    curriculumId: 'US_COMMON_CORE_AP',
    curriculumName: 'US K-12 Common Core & AP',
    gradingSystemId: 'US_GPA_AP',
    gradingTarget: '4.0 Unweighted GPA / AP 5',
    targetYear: 2026,
    school: 'Palo Alto High School, California',
    district: 'Santa Clara County, CA',
    medium: 'English',
    isPremium: true,
    xp: 4120,
    streakDays: 22,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 61,
    solvedDoubtsCount: 30,
    bookmarkedPaperIds: ['us_ap_calc_2025'],
  },
  jp_koko: {
    id: 'usr_jp_1',
    name: 'Kenji Sato (佐藤 健司)',
    email: 'kenji.sato@tokyoschool.jp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'GLOBAL_SENIOR',
    stream: 'Rikei (理系 Science, Math & Engineering)',
    countryCode: 'JP',
    countryName: 'Japan',
    countryFlag: '🇯🇵',
    curriculumId: 'JP_MEXT',
    curriculumName: 'Japan MEXT (文部科学省)',
    gradingSystemId: 'JP_HENSACHI',
    gradingTarget: '偏差値 72 (東京大学 理科一類)',
    targetYear: 2026,
    school: 'Kaisei High School, Tokyo (開成高等学校)',
    district: 'Tokyo (東京都)',
    medium: 'Japanese',
    isPremium: true,
    xp: 3890,
    streakDays: 25,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 58,
    solvedDoubtsCount: 27,
    bookmarkedPaperIds: ['jp_kyotsu_test_2025'],
  },
  in_jee: {
    id: 'usr_in_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitprep.in',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'GLOBAL_SENIOR',
    stream: 'Science PCM + JEE Mains & Advanced (Engineering Track)',
    countryCode: 'IN',
    countryName: 'India',
    countryFlag: '🇮🇳',
    curriculumId: 'IN_CBSE_JEE',
    curriculumName: 'CBSE & JEE / NEET Track',
    gradingSystemId: 'IN_NTA_PERCENTILE',
    gradingTarget: '99.95 Percentile (IIT Bombay CSE)',
    targetYear: 2026,
    school: 'Delhi Public School, R.K. Puram',
    district: 'New Delhi',
    medium: 'English',
    isPremium: true,
    xp: 4560,
    streakDays: 31,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 75,
    solvedDoubtsCount: 38,
    bookmarkedPaperIds: ['in_jee_adv_2025'],
  },
  au_atar: {
    id: 'usr_au_1',
    name: 'Liam O\'Connor',
    email: 'liam.oc@melbournegym.edu.au',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'GLOBAL_SENIOR',
    stream: 'Specialist Maths & Physics (ATAR 95+ STEM Track)',
    countryCode: 'AU',
    countryName: 'Australia',
    countryFlag: '🇦🇺',
    curriculumId: 'AU_ATAR',
    curriculumName: 'Australian Curriculum & ATAR',
    gradingSystemId: 'AU_ATAR_SCALE',
    gradingTarget: 'ATAR 99.85 (Melbourne Uni Chancellor Scholar)',
    targetYear: 2026,
    school: 'Melbourne High School, Victoria',
    district: 'Victoria',
    medium: 'English',
    isPremium: true,
    xp: 3200,
    streakDays: 15,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 45,
    solvedDoubtsCount: 17,
    bookmarkedPaperIds: ['au_vce_spec_2025'],
  },
  global_ib: {
    id: 'usr_ib_1',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@geneva-academy.ch',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'GLOBAL_SENIOR',
    stream: 'IB DP Higher Level (HL) Mathematics AA, Physics & Chemistry',
    countryCode: 'GLOBAL',
    countryName: 'International (IB / Cambridge)',
    countryFlag: '🌍',
    curriculumId: 'GLOBAL_IB_CAMBRIDGE',
    curriculumName: 'International Baccalaureate (IB DP)',
    gradingSystemId: 'GLOBAL_IB_SCALE',
    gradingTarget: '44 / 45 Points (HL 7 7 7 + TOK/EE A)',
    targetYear: 2026,
    school: 'International School of Geneva',
    district: 'Geneva / Global',
    medium: 'English',
    isPremium: true,
    xp: 4280,
    streakDays: 24,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 66,
    solvedDoubtsCount: 29,
    bookmarkedPaperIds: ['ib_math_aa_2025'],
  },
  maths: {
    id: 'usr_maths_1',
    name: 'Kasun Perera',
    email: 'kasun.p@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    countryCode: 'LK',
    countryName: 'Sri Lanka',
    countryFlag: '🇱🇰',
    curriculumId: 'LK_NIE',
    curriculumName: 'Sri Lanka National NIE',
    targetYear: 2026,
    school: 'Ananda College, Colombo',
    district: 'Colombo',
    medium: 'Sinhala',
    isPremium: true,
    hasCompletedOnboarding: true,
    xp: 2840,
    streakDays: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 42,
    solvedDoubtsCount: 19,
    bookmarkedPaperIds: ['p_cm_2024', 'p_phy_2023'],
  },
  bio: {
    id: 'usr_bio_2',
    name: 'Rashmi Fernando',
    email: 'rashmi.f@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'AL',
    stream: 'Biological Science (Bio)',
    targetYear: 2026,
    school: 'Visakha Vidyalaya, Colombo',
    district: 'Colombo',
    medium: 'English',
    isPremium: false,
    xp: 1950,
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 31,
    solvedDoubtsCount: 8,
    bookmarkedPaperIds: ['p_bio_2024'],
  },
  commerce: {
    id: 'usr_com_3',
    name: 'Tharindu Jayasinghe',
    email: 'tharindu.j@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 13,
    level: 'AL',
    stream: 'Commerce',
    targetYear: 2025,
    school: 'Dharmaraja College, Kandy',
    district: 'Kandy',
    medium: 'Sinhala',
    isPremium: true,
    xp: 3400,
    streakDays: 21,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 56,
    solvedDoubtsCount: 27,
    bookmarkedPaperIds: ['p_acc_2024'],
  },
  ol: {
    id: 'usr_ol_4',
    name: 'Sithum Nethsara',
    email: 'sithum.n@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 11,
    level: 'OL',
    stream: 'General O/L',
    targetYear: 2026,
    school: 'Mahinda College, Galle',
    district: 'Galle',
    medium: 'Sinhala',
    isPremium: false,
    xp: 1200,
    streakDays: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 18,
    solvedDoubtsCount: 4,
    bookmarkedPaperIds: ['p_olmath_2024'],
  },
  junior: {
    id: 'usr_jun_5',
    name: 'Minoli Devindi',
    email: 'minoli.d@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 8,
    level: 'JUNIOR',
    stream: 'Junior Secondary (Grade 6-9)',
    targetYear: 2029,
    school: 'Maliyadeva Balika, Kurunegala',
    district: 'Kurunegala',
    medium: 'Sinhala',
    isPremium: false,
    xp: 850,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 12,
    solvedDoubtsCount: 2,
    bookmarkedPaperIds: [],
  },
  arts: {
    id: 'usr_art_6',
    name: 'Sanduni Weerakkody',
    email: 'sanduni.w@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 12,
    level: 'AL',
    stream: 'Arts',
    targetYear: 2026,
    school: 'Devi Balika Vidyalaya, Colombo',
    district: 'Colombo',
    medium: 'Sinhala',
    isPremium: true,
    xp: 1650,
    streakDays: 9,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 24,
    solvedDoubtsCount: 6,
    bookmarkedPaperIds: [],
  },
  tech: {
    id: 'usr_tech_7',
    name: 'Janith Kavinda',
    email: 'janith.k@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 13,
    level: 'AL',
    stream: 'Technology',
    targetYear: 2026,
    school: 'Bandaranayake College, Gampaha',
    district: 'Gampaha',
    medium: 'Sinhala',
    isPremium: false,
    xp: 2200,
    streakDays: 11,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 38,
    solvedDoubtsCount: 15,
    bookmarkedPaperIds: ['p_ict_2024'],
  },
  uni_cse: {
    id: 'usr_uni_1',
    name: 'Heshan Subasinghe',
    email: 'subashheshan009@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'University',
    grade: 13,
    level: 'CAMPUS',
    stream: 'Higher Education',
    targetYear: 2027,
    school: 'University of Moratuwa',
    district: 'Colombo',
    medium: 'English',
    isPremium: true,
    xp: 4850,
    streakDays: 28,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 68,
    solvedDoubtsCount: 42,
    bookmarkedPaperIds: ['res_1', 'res_4'],
    university: 'University of Moratuwa',
    universityShort: 'UoM',
    faculty: 'Faculty of Engineering',
    degreeProgramme: 'B.Sc. (Hons) in Computer Science & Engineering',
    degreeCode: 'ENG-CSE',
    academicYear: 2,
    academicSemester: 1,
    currentGpa: 3.86,
    targetGpa: 3.95,
    studentIdNumber: '220459X',
  },
  uni_med: {
    id: 'usr_uni_2',
    name: 'Dr-to-be Dinithi Senanayake',
    email: 'dinithi.s@cmb.ac.lk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'University',
    grade: 13,
    level: 'CAMPUS',
    stream: 'Higher Education',
    targetYear: 2028,
    school: 'University of Colombo',
    district: 'Colombo',
    medium: 'English',
    isPremium: true,
    xp: 5200,
    streakDays: 35,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 82,
    solvedDoubtsCount: 51,
    bookmarkedPaperIds: ['res_2'],
    university: 'University of Colombo',
    universityShort: 'UoC',
    faculty: 'Faculty of Medicine',
    degreeProgramme: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
    degreeCode: 'MED-MBBS',
    academicYear: 2,
    academicSemester: 1,
    currentGpa: 3.92,
    targetGpa: 4.0,
    studentIdNumber: 'MED/2023/108',
  },
  uni_fin: {
    id: 'usr_uni_3',
    name: 'Kaveen Samarasinghe',
    email: 'kaveen.fin@sjp.ac.lk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'University',
    grade: 13,
    level: 'CAMPUS',
    stream: 'Higher Education',
    targetYear: 2027,
    school: 'University of Sri Jayewardenepura',
    district: 'Colombo',
    medium: 'English',
    isPremium: false,
    xp: 3100,
    streakDays: 16,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonsCount: 44,
    solvedDoubtsCount: 18,
    bookmarkedPaperIds: ['res_3'],
    university: 'University of Sri Jayewardenepura',
    universityShort: 'USJ',
    faculty: 'Faculty of Management Studies and Commerce',
    degreeProgramme: 'B.Sc. (Hons) in Finance & Investment Banking',
    degreeCode: 'MGT-FIN',
    academicYear: 1,
    academicSemester: 1,
    currentGpa: 3.74,
    targetGpa: 3.9,
    studentIdNumber: 'MGT/22/849',
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studyMemory, setStudyMemory] = useState<UserStudyMemory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Capture any incoming referral query params from URL (e.g. ?ref=SCHOLAR_123456)
    captureIncomingReferral();

    // Check if user session exists in local storage
    const saved = localStorage.getItem('siparana_user');
    if (saved) {
      try {
        const u = JSON.parse(saved) as UserProfile;
        const normalizedUser: UserProfile = {
          ...DEFAULT_USERS.maths,
          ...u,
          hasCompletedOnboarding: true
        };
        setProfile(normalizedUser);
        const mem = getUserStudyMemory(normalizedUser.email, normalizedUser);
        setStudyMemory(mem);
        syncUserWithBackend(normalizedUser);
      } catch {
        const defaultUser: UserProfile = { ...DEFAULT_USERS.maths, hasCompletedOnboarding: true };
        setProfile(defaultUser);
        const mem = getUserStudyMemory(defaultUser.email, defaultUser);
        setStudyMemory(mem);
        syncUserWithBackend(defaultUser);
      }
    } else {
      // Default to ready-to-use logged-in student profile so the entire dashboard & AI tools render immediately
      const defaultUser: UserProfile = { ...DEFAULT_USERS.maths, hasCompletedOnboarding: true };
      setProfile(defaultUser);
      try {
        localStorage.setItem('siparana_user', JSON.stringify(defaultUser));
      } catch {
        // ignore
      }
      const mem = getUserStudyMemory(defaultUser.email, defaultUser);
      setStudyMemory(mem);
      syncUserWithBackend(defaultUser);
    }
    setLoading(false);
  }, []);

  const persistUser = (user: UserProfile | null) => {
    setProfile(user);
    if (user) {
      localStorage.setItem('siparana_user', JSON.stringify(user));
      const mem = getUserStudyMemory(user.email, user);
      setStudyMemory(mem);

      // Asynchronously sync with backend database
      syncUserWithBackend(user);

      // Keep user in registered accounts repository so future email logins retrieve exact profile
      try {
        const storedUsers: Array<{ profile: UserProfile; password?: string; phone?: string }> =
          JSON.parse(localStorage.getItem('siparana_registered_accounts') || '[]');
        const norm = normalizeEmail(user.email);
        const idx = storedUsers.findIndex(acc => normalizeEmail(acc.profile.email) === norm);
        if (idx >= 0) {
          storedUsers[idx].profile = { ...storedUsers[idx].profile, ...user };
        } else {
          storedUsers.push({ profile: user });
        }
        localStorage.setItem('siparana_registered_accounts', JSON.stringify(storedUsers));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem('siparana_user');
      setStudyMemory(null);
    }
  };

  const simpleLogin = async (
    params: SimpleLoginParams
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = (params.name || '').trim();
    if (!trimmedName) {
      return { success: false, error: 'කරුණාකර නම (Username) ඇතුළත් කරන්න.' };
    }

    const isUni = params.studentCategory === 'University';
    let userProfile: UserProfile;

    if (isUni) {
      const universityName = params.university || 'University of Moratuwa';
      const shortUniMap: Record<string, string> = {
        'University of Moratuwa': 'UoM',
        'University of Colombo': 'UoC',
        'University of Peradeniya': 'UoP',
        'University of Sri Jayewardenepura': 'USJ',
        'University of Kelaniya': 'UoK',
        'University of Ruhuna': 'UoR',
        'University of Jaffna': 'UOJ',
        'Open University of Sri Lanka': 'OUSL'
      };

      userProfile = {
        id: `usr_uni_${Date.now()}`,
        name: trimmedName,
        email: `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@siparana.lk`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        studentCategory: 'University',
        level: 'CAMPUS',
        stream: 'Higher Education',
        school: universityName,
        university: universityName,
        universityShort: shortUniMap[universityName] || 'Uni',
        faculty: params.faculty || 'Faculty of Engineering',
        degreeProgramme: params.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering',
        degreeCode: params.degreeCode || 'ENG-CSE',
        academicYear: params.academicYear || 1,
        academicSemester: params.academicSemester || 1,
        targetYear: 2027,
        district: params.district || 'Colombo',
        medium: params.medium || 'English',
        isPremium: true,
        xp: 1500,
        streakDays: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: 6,
        solvedDoubtsCount: 3,
        bookmarkedPaperIds: [],
        currentGpa: 3.85,
        targetGpa: 4.0,
        studentIdNumber: '220459X'
      };
    } else {
      const selectedGrade = params.grade || 12;
      const targetCountryCode = params.countryCode || 'LK';
      const targetCountry = getCountryByCode(targetCountryCode);
      const targetCurriculum = params.curriculumId ? getCurriculumById(params.curriculumId) : targetCountry.curricula[0];
      
      let calculatedLevel: ExamLevel = 'AL';
      let calculatedStream: Stream = params.stream || (targetCountry.code === 'LK' ? 'Physical Science (Maths)' : targetCurriculum.subjects[0]?.stream || 'General Academic');

      if (targetCountryCode === 'LK') {
        if (selectedGrade === 5) {
          calculatedLevel = 'SCHOLARSHIP';
          calculatedStream = 'Grade 5 Scholarship';
        } else if (selectedGrade <= 9) {
          calculatedLevel = 'JUNIOR';
          calculatedStream = 'Junior Secondary (Grade 6-9)';
        } else if (selectedGrade <= 11) {
          calculatedLevel = 'OL';
          calculatedStream = 'General O/L';
        } else {
          calculatedLevel = 'AL';
          if (calculatedStream === 'General O/L' || calculatedStream === 'Junior Secondary (Grade 6-9)' || calculatedStream === 'Grade 5 Scholarship') {
            calculatedStream = 'Physical Science (Maths)';
          }
        }
      } else {
        calculatedLevel = selectedGrade >= 11 ? 'GLOBAL_SENIOR' : 'GLOBAL_SECONDARY';
      }

      userProfile = {
        id: `usr_sch_${Date.now()}`,
        name: trimmedName,
        email: `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@siparana.lk`,
        avatar: selectedGrade === 5 
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        studentCategory: 'School',
        grade: selectedGrade,
        level: calculatedLevel,
        stream: calculatedStream,
        countryCode: targetCountry.code,
        countryName: targetCountry.name,
        countryFlag: targetCountry.flag,
        curriculumId: targetCurriculum.id,
        curriculumName: targetCurriculum.titleEnglish,
        gradingSystemId: targetCurriculum.gradingSystem.id,
        gradingTarget: params.gradingTarget || (targetCountry.code === 'LK' ? 'Z-Score 2.10 (Top 100)' : targetCountry.code === 'JP' ? '偏差値 70' : 'A* / Grade 9'),
        nativeLanguage: params.nativeLanguage || targetCountry.defaultLanguage,
        targetYear: params.targetYear || (selectedGrade === 5 ? 2026 : selectedGrade === 11 ? 2026 : selectedGrade === 13 ? 2026 : 2027),
        school: params.school || (targetCountry.code === 'LK' ? (selectedGrade === 5 ? 'Royal Primary School, Colombo' : 'Sri Lanka National School') : `${targetCountry.name} International Academy`),
        district: params.district || (targetCountry.code === 'LK' ? 'Colombo' : targetCountry.name),
        medium: params.medium || (targetCountry.code === 'LK' ? 'Sinhala' : targetCountry.code === 'JP' ? 'Japanese' : 'English'),
        isPremium: true,
        isKidMode: selectedGrade === 5 || params.isKidMode,
        xp: selectedGrade === 5 ? 1450 : 1200,
        streakDays: selectedGrade === 5 ? 8 : 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: selectedGrade === 5 ? 22 : 8,
        solvedDoubtsCount: selectedGrade === 5 ? 12 : 4,
        bookmarkedPaperIds: selectedGrade === 5 ? ['sch_pp_sin_2025', 'sch_pp_mat_2025'] : []
      };
    }

    persistUser(userProfile);
    processVerifiedReferralOnRegistration(userProfile.id, userProfile.name);
    return { success: true };
  };

  const login = async (
    emailOrPhone: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = emailOrPhone.trim().toLowerCase();
    const cleanPhone = trimmedInput.replace(/[^0-9]/g, '');

    // 1. Check custom registered users in local storage
    const storedUsersJson = localStorage.getItem('siparana_registered_accounts');
    if (storedUsersJson) {
      try {
        const storedUsers: Array<{ profile: UserProfile; password?: string; phone?: string }> =
          JSON.parse(storedUsersJson);

        const found = storedUsers.find((acc) => {
          const emailMatch = acc.profile.email.toLowerCase() === trimmedInput;
          const phoneMatch = acc.phone && acc.phone.replace(/[^0-9]/g, '') === cleanPhone;
          return emailMatch || phoneMatch;
        });

        if (found) {
          if (found.password && pass && found.password !== pass) {
            return {
              success: false,
              error: 'මුරපදය වැරදියි. කරුණාකර නිවැරදි මුරපදය ඇතුළත් කරන්න (Invalid Password).',
            };
          }
          persistUser(found.profile);
          return { success: true };
        }
      } catch {
        // Continue to check demo presets
      }
    }

    // 2. Check predefined demo users
    const matchedDemo = Object.values(DEFAULT_USERS).find((u) => {
      return (
        u.email.toLowerCase() === trimmedInput ||
        u.name.toLowerCase().includes(trimmedInput) ||
        (trimmedInput.includes('kasun') && u.id === 'usr_maths_1') ||
        (trimmedInput.includes('heshan') && u.id === 'usr_uni_1')
      );
    });

    if (matchedDemo) {
      persistUser(matchedDemo);
      return { success: true };
    }

    // 3. Fallback: If non-empty email/phone, create a clean student profile
    const isEmail = trimmedInput.includes('@');
    const displayEmail = isEmail ? trimmedInput : `${cleanPhone || 'user'}@siparana.lk`;
    const derivedName = isEmail
      ? trimmedInput.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ')
      : `Student (${trimmedInput})`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: displayEmail,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      grade: 12,
      level: 'AL',
      stream: 'Physical Science (Maths)',
      targetYear: 2026,
      school: 'Sri Lanka Model School',
      district: 'Colombo',
      medium: 'Sinhala',
      isPremium: false,
      xp: 500,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessonsCount: 0,
      solvedDoubtsCount: 0,
      bookmarkedPaperIds: [],
    };

    // Save into registered accounts so it can be re-logged into later
    try {
      const existingAccounts: Array<{ profile: UserProfile; password?: string; phone?: string }> =
        JSON.parse(localStorage.getItem('siparana_registered_accounts') || '[]');
      existingAccounts.push({ profile: newUser, password: pass, phone: cleanPhone });
      localStorage.setItem('siparana_registered_accounts', JSON.stringify(existingAccounts));
    } catch {
      // ignore
    }

    persistUser(newUser);
    return { success: true };
  };

  const loginWithGoogle = async (googleData?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    category?: StudentCategory;
    grade?: SchoolGrade;
    stream?: Stream;
    countryCode?: GlobalCountryCode;
    curriculumId?: string;
    university?: string;
    degreeProgramme?: string;
    district?: string;
    medium?: Medium;
    isNewUser?: boolean;
  }): Promise<{ success: boolean; isNewUser?: boolean; error?: string }> => {
    const userEmail = (googleData?.email || 'subashheshan009@gmail.com').trim().toLowerCase();
    const rawName = googleData?.name || (userEmail.includes('@') ? userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : 'Google Student');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const userAvatar = googleData?.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    const targetCountryCode: GlobalCountryCode = googleData?.countryCode || 'LK';
    const targetCountry = getCountryByCode(targetCountryCode);

    // Determine chosen medium or fallback to saved app language
    let activeMedium: Medium = googleData?.medium || (targetCountryCode === 'LK' ? 'Sinhala' : targetCountryCode === 'JP' ? 'Japanese' : 'English');
    try {
      const savedLang = localStorage.getItem('siparana_app_language');
      if (savedLang === 'ta') activeMedium = 'Tamil';
      else if (savedLang === 'en') activeMedium = 'English';
      else if (savedLang === 'si') activeMedium = 'Sinhala';
    } catch {
      // ignore
    }

    // 1. Check if user already registered before in local storage
    const storedUsersJson = localStorage.getItem('siparana_registered_accounts');
    if (storedUsersJson) {
      try {
        const storedUsers: Array<{ profile: UserProfile; password?: string; phone?: string }> = JSON.parse(storedUsersJson);
        const existing = storedUsers.find(acc => acc.profile.email.toLowerCase() === userEmail);
        if (existing) {
          const isCompleted = existing.profile.hasCompletedOnboarding !== false;
          const updatedProfile: UserProfile = {
            ...existing.profile,
            name: googleData?.name && googleData.name !== 'Google Student' ? googleData.name : existing.profile.name,
            avatar: googleData?.avatar || existing.profile.avatar || userAvatar,
            medium: googleData?.medium || existing.profile.medium || activeMedium,
            authProvider: 'google',
            lastActiveDate: new Date().toISOString().split('T')[0],
            hasCompletedOnboarding: isCompleted
          };
          persistUser(updatedProfile);
          return { success: true, isNewUser: !isCompleted };
        }
      } catch {
        // continue
      }
    }

    // 2. Check if it matches a preset user
    const matchedPreset = Object.values(DEFAULT_USERS).find(u => u.email.toLowerCase() === userEmail);
    if (matchedPreset) {
      const updatedProfile: UserProfile = {
        ...matchedPreset,
        authProvider: 'google',
        hasCompletedOnboarding: true,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
      persistUser(updatedProfile);
      return { success: true, isNewUser: false };
    }

    // 3. New Google User: Create fresh profile with hasCompletedOnboarding: false
    const isUni = googleData?.category === 'University' || userEmail.includes('eng') || userEmail.includes('uni') || userEmail.includes('moratuwa');
    
    let newUser: UserProfile;
    if (isUni) {
      newUser = {
        id: googleData?.id || `usr_google_${Date.now()}`,
        name: formattedName,
        email: userEmail,
        avatar: userAvatar,
        authProvider: 'google',
        studentCategory: 'University',
        level: 'CAMPUS',
        stream: 'Higher Education',
        countryCode: targetCountryCode,
        countryName: targetCountry.name,
        countryFlag: targetCountry.flag,
        school: googleData?.university || 'University of Moratuwa',
        university: googleData?.university || 'University of Moratuwa',
        universityShort: 'UoM',
        faculty: 'Faculty of Engineering',
        degreeProgramme: googleData?.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering',
        degreeCode: 'ENG-CSE',
        academicYear: 1,
        academicSemester: 1,
        studentIdNumber: '220459X',
        targetYear: 2027,
        district: googleData?.district || (targetCountryCode === 'LK' ? 'Colombo' : targetCountry.name),
        medium: googleData?.medium || activeMedium || 'English',
        isPremium: true,
        xp: 1200,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: 0,
        solvedDoubtsCount: 0,
        bookmarkedPaperIds: [],
        currentGpa: 3.85,
        targetGpa: 4.0,
        hasCompletedOnboarding: false
      };
    } else {
      const gradeVal = googleData?.grade || (targetCountryCode === 'LK' ? 13 : 12);
      newUser = {
        id: googleData?.id || `usr_google_${Date.now()}`,
        name: formattedName,
        email: userEmail,
        avatar: userAvatar,
        authProvider: 'google',
        studentCategory: 'School',
        grade: gradeVal,
        level: targetCountryCode === 'LK' ? (gradeVal <= 5 ? 'SCHOLARSHIP' : gradeVal <= 9 ? 'JUNIOR' : gradeVal <= 11 ? 'OL' : 'AL') : (gradeVal >= 11 ? 'GLOBAL_SENIOR' : 'GLOBAL_SECONDARY'),
        stream: googleData?.stream || (targetCountryCode === 'LK' ? (gradeVal <= 5 ? 'Grade 5 Scholarship' : gradeVal <= 9 ? 'Junior Secondary (Grade 6-9)' : gradeVal <= 11 ? 'General O/L' : 'Physical Science (Maths)') : 'General Academic'),
        countryCode: targetCountryCode,
        countryName: targetCountry.name,
        countryFlag: targetCountry.flag,
        targetYear: 2026,
        school: targetCountryCode === 'LK' ? 'Sri Lanka National School' : `${targetCountry.name} Academy`,
        district: googleData?.district || (targetCountryCode === 'LK' ? 'Colombo' : targetCountry.name),
        medium: googleData?.medium || activeMedium || (targetCountryCode === 'LK' ? 'Sinhala' : targetCountryCode === 'JP' ? 'Japanese' : 'English'),
        isPremium: true,
        xp: 1000,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: 0,
        solvedDoubtsCount: 0,
        bookmarkedPaperIds: [],
        hasCompletedOnboarding: false
      };
    }

    try {
      const existingAccounts: Array<{ profile: UserProfile; password?: string; phone?: string }> =
        JSON.parse(localStorage.getItem('siparana_registered_accounts') || '[]');
      existingAccounts.push({ profile: newUser });
      localStorage.setItem('siparana_registered_accounts', JSON.stringify(existingAccounts));
    } catch {
      // ignore
    }

    persistUser(newUser);
    processVerifiedReferralOnRegistration(newUser.id, newUser.name);
    return { success: true, isNewUser: true };
  };

  const loginAsDemo = (presetKey: DemoPresetKey) => {
    const user = DEFAULT_USERS[presetKey] || DEFAULT_USERS.maths;
    persistUser({ ...user, hasCompletedOnboarding: true });
  };

  const register = async (
    data: Partial<UserProfile> & { password?: string; phone?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const { password, phone, ...profileFields } = data;
    const gradeVal = data.grade || 12;
    let levelVal: ExamLevel = 'AL';
    const targetCountryCode = profileFields.countryCode || 'LK';
    const targetCountry = getCountryByCode(targetCountryCode);
    const targetCurriculum = profileFields.curriculumId ? getCurriculumById(profileFields.curriculumId) : targetCountry.curricula[0];
    
    // Find matching stage in active curriculum
    const matchedStage = targetCurriculum.stages.find(s => s.targetGrades.includes(gradeVal)) || targetCurriculum.stages[targetCurriculum.stages.length - 1];
    let streamVal: Stream = data.stream || matchedStage?.defaultStream || (targetCountryCode === 'LK' ? 'Physical Science (Maths)' : 'General Academic');

    if (targetCountryCode === 'LK') {
      if (gradeVal === 5) {
        levelVal = 'SCHOLARSHIP';
        streamVal = 'Grade 5 Scholarship';
      } else if (gradeVal <= 9) {
        levelVal = 'JUNIOR';
        streamVal = 'Junior Secondary (Grade 6-9)';
      } else if (gradeVal <= 11) {
        levelVal = 'OL';
        streamVal = 'General O/L';
      }
    } else {
      levelVal = gradeVal >= 11 ? 'GLOBAL_SENIOR' : 'GLOBAL_SECONDARY';
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: profileFields.name || (gradeVal === 5 ? 'පුංචි ශිෂ්‍යත්ව යාළුවා' : 'New Student'),
      email: profileFields.email || 'student@siparana.lk',
      avatar:
        profileFields.avatar ||
        (gradeVal === 5 
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
      grade: gradeVal,
      level: profileFields.level || levelVal,
      stream: streamVal,
      targetYear:
        profileFields.targetYear ||
        (gradeVal === 5 ? 2026 : gradeVal === 11 ? 2026 : gradeVal === 13 ? 2026 : 2027),
      school: profileFields.school || (targetCountryCode === 'LK' ? (gradeVal === 5 ? 'Royal Primary School, Colombo' : 'National Model School') : `${targetCountry.name} Academy`),
      district: profileFields.district || (targetCountryCode === 'LK' ? 'Colombo' : getCountrySubdivisions(targetCountryCode).defaultSubdivision),
      medium: profileFields.medium || (targetCountryCode === 'LK' ? 'Sinhala' : targetCountry.defaultLanguage === 'ja' ? 'Japanese' : targetCountry.defaultLanguage === 'de' ? 'German' : 'English'),
      isPremium: false,
      isKidMode: (gradeVal === 5 && targetCountryCode === 'LK') || profileFields.isKidMode,
      xp: gradeVal === 5 ? 1000 : 250,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessonsCount: 0,
      solvedDoubtsCount: 0,
      bookmarkedPaperIds: [],
      hasCompletedOnboarding: false,
      ...profileFields,
    };

    // Store in permanent account list
    try {
      const existingAccounts: Array<{ profile: UserProfile; password?: string; phone?: string }> =
        JSON.parse(localStorage.getItem('siparana_registered_accounts') || '[]');
      existingAccounts.push({ profile: newUser, password: password, phone: phone });
      localStorage.setItem('siparana_registered_accounts', JSON.stringify(existingAccounts));
    } catch {
      // ignore
    }

    persistUser(newUser);
    processVerifiedReferralOnRegistration(newUser.id, newUser.name);
    return { success: true };
  };

  const setGradeAndStream = (newGrade: SchoolGrade, customStream?: Stream) => {
    if (!profile) return;
    const countryCode = profile.countryCode || 'LK';
    const country = getCountryByCode(countryCode);
    const curriculum = profile.curriculumId ? getCurriculumById(profile.curriculumId) : country.curricula[0];
    const matchedStage = curriculum.stages.find(s => s.targetGrades.includes(newGrade)) || curriculum.stages[curriculum.stages.length - 1];

    let level: ExamLevel = 'AL';
    let stream: Stream = customStream || matchedStage?.defaultStream || profile.stream;

    if (countryCode === 'LK') {
      if (newGrade === 5) {
        level = 'SCHOLARSHIP';
        stream = 'Grade 5 Scholarship';
      } else if (newGrade <= 9) {
        level = 'JUNIOR';
        stream = 'Junior Secondary (Grade 6-9)';
      } else if (newGrade <= 11) {
        level = 'OL';
        stream = 'General O/L';
      } else {
        level = 'AL';
        if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)' || stream === 'Grade 5 Scholarship') {
          stream = 'Physical Science (Maths)';
        }
      }
    } else {
      level = newGrade >= 11 ? 'GLOBAL_SENIOR' : 'GLOBAL_SECONDARY';
    }

    const updated: UserProfile = {
      ...profile,
      grade: newGrade,
      level,
      stream,
      isKidMode: newGrade === 5 && countryCode === 'LK',
    };
    persistUser(updated);
  };

  const setCountryAndCurriculum = (countryCode: GlobalCountryCode, curriculumId?: string) => {
    if (!profile) return;
    const country = getCountryByCode(countryCode);
    const curriculum = curriculumId ? getCurriculumById(curriculumId) : country.curricula[0];
    const defaultStream = countryCode === 'LK' ? 'Physical Science (Maths)' : curriculum.subjects[0]?.stream || 'General Academic';
    
    const updated: UserProfile = {
      ...profile,
      countryCode: country.code,
      countryName: country.name,
      countryFlag: country.flag,
      curriculumId: curriculum.id,
      curriculumName: curriculum.titleEnglish,
      gradingSystemId: curriculum.gradingSystem.id,
      gradingTarget: countryCode === 'LK' ? 'Z-Score 2.10 (Top 100)' : countryCode === 'JP' ? '偏差値 70' : 'A* / Grade 9',
      nativeLanguage: country.defaultLanguage,
      stream: profile.stream && countryCode === 'LK' ? profile.stream : defaultStream,
      medium: countryCode === 'LK' ? (profile.medium || 'Sinhala') : countryCode === 'JP' ? 'Japanese' : 'English',
      school: countryCode === 'LK' ? profile.school : `${country.name} High School`,
      district: countryCode === 'LK' ? profile.district : country.name
    };
    persistUser(updated);
  };

  const setUniversityAndDegree = (
    university: string,
    faculty: string,
    degreeProgramme: string,
    degreeCode: string,
    academicYear: number = 1,
    academicSemester: number = 1
  ) => {
    if (!profile) return;
    const shortUniMap: Record<string, string> = {
      'University of Moratuwa': 'UoM',
      'University of Colombo': 'UoC',
      'University of Peradeniya': 'UoP',
      'University of Sri Jayewardenepura': 'USJ',
      'University of Kelaniya': 'UoK',
      'University of Ruhuna': 'UoR',
      'University of Jaffna': 'UOJ',
      'Open University of Sri Lanka': 'OUSL'
    };

    const updated: UserProfile = {
      ...profile,
      studentCategory: 'University',
      level: 'CAMPUS',
      stream: 'Higher Education',
      school: university,
      university,
      universityShort: shortUniMap[university] || 'Uni',
      faculty,
      degreeProgramme,
      degreeCode,
      academicYear,
      academicSemester,
      medium: profile.medium || 'English'
    };
    persistUser(updated);
  };

  const toggleStudentCategory = (category: StudentCategory) => {
    if (!profile) return;
    if (category === 'University') {
      const updated: UserProfile = {
        ...profile,
        studentCategory: 'University',
        level: 'CAMPUS',
        stream: 'Higher Education',
        university: profile.university || 'University of Moratuwa',
        universityShort: profile.universityShort || 'UoM',
        faculty: profile.faculty || 'Faculty of Engineering',
        degreeProgramme: profile.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering',
        degreeCode: profile.degreeCode || 'ENG-CSE',
        academicYear: profile.academicYear || 1,
        academicSemester: profile.academicSemester || 1
      };
      persistUser(updated);
    } else {
      const updated: UserProfile = {
        ...profile,
        studentCategory: 'School',
        level: profile.grade <= 9 ? 'JUNIOR' : profile.grade <= 11 ? 'OL' : 'AL',
        stream: profile.grade <= 9 ? 'Junior Secondary (Grade 6-9)' : profile.grade <= 11 ? 'General O/L' : 'Physical Science (Maths)',
      };
      persistUser(updated);
    }
  };

  const logout = () => {
    persistUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    persistUser(updated);
  };

  const addXP = (amount: number) => {
    if (!profile) return;
    const updated = { ...profile, xp: profile.xp + amount };
    persistUser(updated);
  };

  const incrementStreak = () => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const updated = {
        ...profile,
        streakDays: profile.streakDays + 1,
        lastActiveDate: today,
        xp: profile.xp + 50,
      };
      persistUser(updated);
    }
  };

  const toggleBookmarkPaper = (paperId: string) => {
    if (!profile) return;
    const exists = profile.bookmarkedPaperIds.includes(paperId);
    const updated = {
      ...profile,
      bookmarkedPaperIds: exists
        ? profile.bookmarkedPaperIds.filter(id => id !== paperId)
        : [...profile.bookmarkedPaperIds, paperId],
    };
    persistUser(updated);
  };

  // Continuous Context & Study Memory Methods
  const recordChat = (
    userMsg: { text: string; attachedImage?: string; attachedPdfName?: string; subjectTag?: string },
    aiMsg: { text: string; subjectTag?: string }
  ) => {
    if (!profile) return;
    const updatedMem = recordChatToMemory(profile.email, userMsg, aiMsg);
    setStudyMemory({ ...updatedMem });
  };

  const recordAsset = (asset: Omit<GeneratedStudyAsset, 'id' | 'date'>) => {
    if (!profile) return null;
    const res = recordGeneratedAssetToMemory(profile.email, asset);
    const mem = getUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...mem });
    return res;
  };

  const recordEvaluation = (evaluation: Omit<EssayEvaluationRecord, 'id' | 'date'>) => {
    if (!profile) return null;
    const res = recordEssayEvaluationToMemory(profile.email, evaluation);
    const mem = getUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...mem });
    return res;
  };

  const recordWeakArea = (weakArea: Omit<WeakSubjectAreaRecord, 'id' | 'dateIdentified'>) => {
    if (!profile) return null;
    const res = recordWeakSubjectArea(profile.email, weakArea);
    const mem = getUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...mem });
    return res;
  };

  const resolveWeakArea = (id: string) => {
    if (!profile) return;
    resolveWeakSubjectArea(profile.email, id);
    const mem = getUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...mem });
  };

  const clearStudySessionMemory = () => {
    if (!profile) return;
    const fresh = clearUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...fresh });
  };

  const refreshStudyMemory = () => {
    if (!profile) return;
    const mem = getUserStudyMemory(profile.email, profile);
    setStudyMemory({ ...mem });
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        studyMemory,
        loading,
        simpleLogin,
        login,
        loginWithGoogle,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        setGradeAndStream,
        setCountryAndCurriculum,
        setUniversityAndDegree,
        toggleStudentCategory,
        addXP,
        incrementStreak,
        toggleBookmarkPaper,
        recordChat,
        recordAsset,
        recordEvaluation,
        recordWeakArea,
        resolveWeakArea,
        clearStudySessionMemory,
        refreshStudyMemory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
