import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Stream, ExamLevel, Medium, SchoolGrade, StudentCategory } from '@/types';

export type DemoPresetKey = 'maths' | 'bio' | 'commerce' | 'ol' | 'junior' | 'arts' | 'tech' | 'uni_cse' | 'uni_med' | 'uni_fin';

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleData?: {
    name?: string;
    email?: string;
    avatar?: string;
    category?: StudentCategory;
    grade?: SchoolGrade;
    stream?: Stream;
    university?: string;
    degreeProgramme?: string;
    district?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (presetKey: DemoPresetKey) => void;
  register: (data: Partial<UserProfile> & { password?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  setGradeAndStream: (grade: SchoolGrade, stream?: Stream) => void;
  setUniversityAndDegree: (university: string, faculty: string, degreeProgramme: string, degreeCode: string, academicYear?: number, academicSemester?: number) => void;
  toggleStudentCategory: (category: StudentCategory) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  toggleBookmarkPaper: (paperId: string) => void;
}

const DEFAULT_USERS: Record<DemoPresetKey, UserProfile> = {
  maths: {
    id: 'usr_maths_1',
    name: 'Kasun Perera',
    email: 'kasun.p@siparana.lk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentCategory: 'School',
    grade: 13,
    level: 'AL',
    stream: 'Physical Science (Maths)',
    targetYear: 2026,
    school: 'Ananda College, Colombo',
    district: 'Colombo',
    medium: 'Sinhala',
    isPremium: true,
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user session exists in local storage
    const saved = localStorage.getItem('siparana_user');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        setProfile(null);
      }
    } else {
      // User is not logged in by default - display Welcome / Sign In / Register screen
      setProfile(null);
    }
    setLoading(false);
  }, []);

  const persistUser = (user: UserProfile | null) => {
    setProfile(user);
    if (user) {
      localStorage.setItem('siparana_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('siparana_user');
    }
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
    name?: string;
    email?: string;
    avatar?: string;
    category?: StudentCategory;
    grade?: SchoolGrade;
    stream?: Stream;
    university?: string;
    degreeProgramme?: string;
    district?: string;
    medium?: Medium;
  }): Promise<{ success: boolean; error?: string }> => {
    const userEmail = (googleData?.email || 'subashheshan009@gmail.com').trim().toLowerCase();
    const rawName = googleData?.name || (userEmail.includes('@') ? userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : 'Heshan Subasinghe');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const userAvatar = googleData?.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    // Determine chosen medium or fallback to saved app language
    let activeMedium: Medium = googleData?.medium || 'Sinhala';
    try {
      const savedLang = localStorage.getItem('siparana_app_language');
      if (savedLang === 'ta') activeMedium = 'Tamil';
      else if (savedLang === 'en') activeMedium = 'English';
      else if (savedLang === 'si') activeMedium = 'Sinhala';
    } catch {
      // ignore
    }

    // Check if user already registered before
    const storedUsersJson = localStorage.getItem('siparana_registered_accounts');
    if (storedUsersJson) {
      try {
        const storedUsers: Array<{ profile: UserProfile; password?: string; phone?: string }> = JSON.parse(storedUsersJson);
        const existing = storedUsers.find(acc => acc.profile.email.toLowerCase() === userEmail);
        if (existing) {
          const updatedProfile: UserProfile = {
            ...existing.profile,
            medium: googleData?.medium || existing.profile.medium || activeMedium,
            authProvider: 'google',
            lastActiveDate: new Date().toISOString().split('T')[0]
          };
          persistUser(updatedProfile);
          return { success: true };
        }
      } catch {
        // continue
      }
    }

    const isUni = googleData?.category === 'University' || userEmail.includes('eng') || userEmail.includes('uni') || userEmail.includes('moratuwa');
    
    let newUser: UserProfile;
    if (isUni) {
      newUser = {
        id: `usr_google_${Date.now()}`,
        name: formattedName,
        email: userEmail,
        avatar: userAvatar,
        authProvider: 'google',
        studentCategory: 'University',
        level: 'CAMPUS',
        stream: 'Higher Education',
        school: googleData?.university || 'University of Moratuwa',
        university: googleData?.university || 'University of Moratuwa',
        universityShort: 'UoM',
        faculty: 'Faculty of Engineering',
        degreeProgramme: googleData?.degreeProgramme || 'B.Sc. (Hons) in Computer Science & Engineering',
        degreeCode: 'ENG-CSE',
        academicYear: 2,
        academicSemester: 1,
        studentIdNumber: '220459X',
        targetYear: 2027,
        district: googleData?.district || 'Colombo',
        medium: googleData?.medium || activeMedium || 'English',
        isPremium: true,
        xp: 1200,
        streakDays: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: 8,
        solvedDoubtsCount: 4,
        bookmarkedPaperIds: [],
        currentGpa: 3.85,
        targetGpa: 4.0
      };
    } else {
      const gradeVal = googleData?.grade || 13;
      newUser = {
        id: `usr_google_${Date.now()}`,
        name: formattedName,
        email: userEmail,
        avatar: userAvatar,
        authProvider: 'google',
        studentCategory: 'School',
        grade: gradeVal,
        level: gradeVal <= 9 ? 'JUNIOR' : gradeVal <= 11 ? 'OL' : 'AL',
        stream: googleData?.stream || (gradeVal <= 9 ? 'Junior Secondary (Grade 6-9)' : gradeVal <= 11 ? 'General O/L' : 'Physical Science (Maths)'),
        targetYear: 2026,
        school: 'Sri Lanka National School',
        district: googleData?.district || 'Colombo',
        medium: googleData?.medium || activeMedium || 'Sinhala',
        isPremium: true,
        xp: 1000,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessonsCount: 4,
        solvedDoubtsCount: 2,
        bookmarkedPaperIds: [],
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
    return { success: true };
  };

  const loginAsDemo = (presetKey: DemoPresetKey) => {
    persistUser(DEFAULT_USERS[presetKey] || DEFAULT_USERS.maths);
  };

  const register = async (
    data: Partial<UserProfile> & { password?: string; phone?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const gradeVal = data.grade || 12;
    let levelVal: ExamLevel = 'AL';
    let streamVal: Stream = data.stream || 'Physical Science (Maths)';

    if (gradeVal <= 9) {
      levelVal = 'JUNIOR';
      streamVal = 'Junior Secondary (Grade 6-9)';
    } else if (gradeVal <= 11) {
      levelVal = 'OL';
      streamVal = 'General O/L';
    }

    const { password, phone, ...profileFields } = data;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: profileFields.name || 'New Student',
      email: profileFields.email || 'student@siparana.lk',
      avatar:
        profileFields.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      grade: gradeVal,
      level: profileFields.level || levelVal,
      stream: streamVal,
      targetYear:
        profileFields.targetYear ||
        (gradeVal === 11 ? 2026 : gradeVal === 13 ? 2026 : 2027),
      school: profileFields.school || 'National School',
      district: profileFields.district || 'Colombo',
      medium: profileFields.medium || 'Sinhala',
      isPremium: false,
      xp: 250,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessonsCount: 0,
      solvedDoubtsCount: 0,
      bookmarkedPaperIds: [],
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
    return { success: true };
  };

  const setGradeAndStream = (newGrade: SchoolGrade, customStream?: Stream) => {
    if (!profile) return;
    let level: ExamLevel = 'AL';
    let stream: Stream = customStream || profile.stream;

    if (newGrade <= 9) {
      level = 'JUNIOR';
      stream = 'Junior Secondary (Grade 6-9)';
    } else if (newGrade <= 11) {
      level = 'OL';
      stream = 'General O/L';
    } else {
      level = 'AL';
      if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)') {
        stream = 'Physical Science (Maths)';
      }
    }

    const updated: UserProfile = {
      ...profile,
      grade: newGrade,
      level,
      stream,
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

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        login,
        loginWithGoogle,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        setGradeAndStream,
        setUniversityAndDegree,
        toggleStudentCategory,
        addXP,
        incrementStreak,
        toggleBookmarkPaper,
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
