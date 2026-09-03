import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real Users Persistent Database Storage File
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'registered_users.json');

interface StoredUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentCategory?: 'School' | 'University';
  grade?: number;
  level?: string;
  stream?: string;
  school?: string;
  university?: string;
  district?: string;
  countryCode?: string;
  countryName?: string;
  countryFlag?: string;
  xp: number;
  streakDays: number;
  quizzesSolved?: number;
  completedLessonsCount?: number;
  quizAccuracy?: number;
  customAvatarFrameId?: string;
  bio?: string;
  statusQuote?: string;
  targetUniversity?: string;
  cheersCount?: number;
  isVerified?: boolean;
  lastActiveDate?: string;
  lastActiveTimestamp?: number;
  isOnline?: boolean;
  registeredAt?: string;
  phone?: string;
  password?: string;
}

// In-Memory User Store with disk persistence (Strict Genuine Registered Users Only)
let storedUsers: StoredUser[] = [];

// Set of active SSE connection streams for real-time live database updates
const sseClients = new Set<express.Response>();

function broadcastLeaderboardToSse() {
  if (sseClients.size === 0) return;
  const achievers = getLeaderboardAchievers();
  const payload = `data: ${JSON.stringify({ type: 'leaderboard', count: achievers.length, leaderboard: achievers })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function loadStoredUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Filter out any stale dummy seed accounts
        storedUsers = parsed.filter(u => u && u.id && !u.id.includes('senanayake') && !u.id.includes('wijesinghe') && !u.id.includes('sandaruwan') && !u.id.includes('oliver-harrison'));
      } else {
        storedUsers = [];
      }
    } else {
      storedUsers = [];
    }
    saveStoredUsers();
  } catch (err) {
    console.error('Error loading stored users:', err);
    storedUsers = [];
  }
  return storedUsers;
}

function saveStoredUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(storedUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stored users:', err);
  }
}

// Initialize stored users on server boot
loadStoredUsers();

// Determine Free Fire style Online / Offline state
function isUserActiveOnline(user: StoredUser): boolean {
  if (user.isOnline === true) return true;
  const now = Date.now();
  if (user.lastActiveTimestamp && (now - user.lastActiveTimestamp < 15 * 60 * 1000)) {
    return true;
  }
  const todayStr = new Date().toISOString().split('T')[0];
  if (user.lastActiveDate === todayStr && user.lastActiveTimestamp && (now - user.lastActiveTimestamp < 60 * 60 * 1000)) {
    return true;
  }
  return false;
}

// Helper to map a real stored user into the clean Leaderboard Achiever format
function mapUserToAchiever(user: StoredUser, rank: number) {
  const isUni = user.studentCategory === 'University' || user.level === 'CAMPUS';
  const grade = user.grade || 12;
  
  let academicCategory: 'University' | 'A-Level / High School' | 'O-Level / Secondary' | 'Scholarship / Primary' = 'A-Level / High School';
  let gradeLevel = 'Grade 12 (A/L)';
  
  if (isUni) {
    academicCategory = 'University';
    gradeLevel = 'Undergraduate';
  } else if (grade === 5 || user.level === 'SCHOLARSHIP') {
    academicCategory = 'Scholarship / Primary';
    gradeLevel = 'Grade 5 (Primary)';
  } else if (grade <= 11 || user.level === 'OL' || user.level === 'JUNIOR') {
    academicCategory = 'O-Level / Secondary';
    gradeLevel = `Grade ${grade} (Secondary)`;
  } else {
    academicCategory = 'A-Level / High School';
    gradeLevel = `Grade ${grade} (Senior)`;
  }

  const specialBadge =
    rank === 1 ? '👑 National Sovereign Rank 1' :
    rank === 2 ? '🥈 Global Runner Up' :
    rank === 3 ? '🥉 Global Bronze Scholar' :
    user.xp >= 5000 ? '🔥 Grandmaster Scholar' :
    user.xp >= 3000 ? '💎 Diamond Master' :
    user.xp >= 1500 ? '⚡ Speed & Precision Ace' :
    '📚 Active Scholar';

  const honorTitle =
    user.stream?.includes('Math') ? 'Pure & Applied Mathematics' :
    user.stream?.includes('Bio') ? 'Biological Science Virtuoso' :
    user.stream?.includes('Commerce') ? 'Economics & Corporate Finance' :
    user.stream?.includes('Tech') ? 'Engineering Tech & Robotics' :
    user.stream?.includes('Computer') || isUni ? 'Computer Science & Algorithms' :
    'National Curriculum Scholar';

  const isOnline = isUserActiveOnline(user);

  return {
    id: user.id,
    rank,
    name: user.name || 'Scholar',
    avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    institution: user.university || user.school || (user.countryCode === 'LK' ? 'National College' : 'Premier Academy'),
    districtOrCity: user.district || (user.countryCode === 'LK' ? 'Colombo' : 'National'),
    countryCode: user.countryCode || 'LK',
    countryFlag: user.countryFlag || '🇱🇰',
    countryName: user.countryName || 'Sri Lanka',
    stream: user.stream || 'General Curriculum',
    academicCategory,
    gradeLevel,
    weeklyXP: Math.round(user.xp * 0.45) || user.xp,
    monthlyXP: Math.round(user.xp * 0.85) || user.xp,
    allTimeXP: user.xp || 0,
    streakDays: user.streakDays || 1,
    quizAccuracy: user.quizAccuracy || 96.5,
    quizzesSolved: user.quizzesSolved || user.completedLessonsCount || 1,
    specialBadge,
    honorTitle,
    isVerified: user.isVerified ?? true,
    isOnline,
    lastActiveDate: user.lastActiveDate || new Date().toISOString().split('T')[0],
    lastActiveTimestamp: user.lastActiveTimestamp,
    cheersCount: user.cheersCount || 0,
    bioQuote: user.bio || user.statusQuote || 'Studying hard daily with SipArana past paper drills.',
    targetUniversity: user.targetUniversity || 'University of Moratuwa / Oxford',
    frameId: user.customAvatarFrameId || (
      user.xp >= 15000 ? 'frame-grandmaster' :
      user.xp >= 10000 ? 'frame-diamond' :
      user.xp >= 6000 ? 'frame-platinum' :
      user.xp >= 3000 ? 'frame-gold' :
      user.xp >= 1500 ? 'frame-silver' :
      'frame-bronze'
    )
  };
}

function getLeaderboardAchievers() {
  const sorted = [...storedUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  return sorted.map((user, idx) => mapUserToAchiever(user, idx + 1));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini Client Initialization
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      platform: 'SipArana LK Full-Stack Ecosystem'
    });
  });

  // ==========================================
  // REAL USER & LIVE LEADERBOARD REST API
  // ==========================================

  // Get Live Global Leaderboard (100% Real Registered Users Only)
  app.get('/api/leaderboard', (req, res) => {
    try {
      const achievers = getLeaderboardAchievers();
      return res.json({
        success: true,
        count: achievers.length,
        leaderboard: achievers,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Real-time Database Listener Stream (SSE) for instant cross-device updates
  app.get('/api/leaderboard/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    // Immediately push latest leaderboard on connect
    const achievers = getLeaderboardAchievers();
    res.write(`data: ${JSON.stringify({ type: 'leaderboard', count: achievers.length, leaderboard: achievers })}\n\n`);

    sseClients.add(res);

    // Keepalive ping comment every 15s to keep proxy connection alive across mobile/desktop
    const keepAliveTimer = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch {
        clearInterval(keepAliveTimer);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      sseClients.delete(res);
    });
  });

  // Central Database: Register User from Any Device (Phone, Tablet, Laptop)
  app.post('/api/users/register', (req, res) => {
    try {
      const user = req.body;
      if (!user || !user.id) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }

      const normEmail = user.email ? user.email.trim().toLowerCase() : '';
      const normPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';

      const existingIndex = storedUsers.findIndex(u => {
        if (u.id === user.id) return true;
        if (normEmail && u.email && u.email.trim().toLowerCase() === normEmail) return true;
        if (normPhone && u.phone && u.phone.replace(/[^0-9]/g, '') === normPhone) return true;
        return false;
      });

      const updatedUser: StoredUser = {
        id: user.id,
        name: user.name || 'Scholar',
        email: user.email || '',
        phone: user.phone || '',
        password: user.password || '',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        studentCategory: user.studentCategory || 'School',
        grade: Number(user.grade) || 12,
        level: user.level || 'AL',
        stream: user.stream || 'Physical Science (Maths)',
        school: user.school || '',
        university: user.university || '',
        district: user.district || 'Colombo',
        countryCode: user.countryCode || 'LK',
        countryName: user.countryName || 'Sri Lanka',
        countryFlag: user.countryFlag || '🇱🇰',
        xp: Number(user.xp) || 250,
        streakDays: Number(user.streakDays) || 1,
        quizzesSolved: Number(user.quizzesSolved || user.completedLessonsCount) || 1,
        completedLessonsCount: Number(user.completedLessonsCount) || 0,
        quizAccuracy: Number(user.quizAccuracy) || 96.5,
        customAvatarFrameId: user.customAvatarFrameId || user.frameId,
        bio: user.bio || user.statusQuote || '',
        statusQuote: user.statusQuote || user.bio || '',
        targetUniversity: user.targetUniversity || '',
        cheersCount: existingIndex >= 0 ? (storedUsers[existingIndex].cheersCount || 0) : (Number(user.cheersCount) || 0),
        isVerified: user.isVerified ?? true,
        lastActiveDate: new Date().toISOString().split('T')[0],
        lastActiveTimestamp: Date.now(),
        isOnline: true,
        registeredAt: existingIndex >= 0 ? (storedUsers[existingIndex].registeredAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (existingIndex >= 0) {
        if (!updatedUser.password && storedUsers[existingIndex].password) {
          updatedUser.password = storedUsers[existingIndex].password;
        }
        if (storedUsers[existingIndex].xp > updatedUser.xp && !req.body.forceOverrideXP) {
          updatedUser.xp = storedUsers[existingIndex].xp;
        }
        storedUsers[existingIndex] = updatedUser;
      } else {
        storedUsers.push(updatedUser);
      }

      saveStoredUsers();
      broadcastLeaderboardToSse();

      const achievers = getLeaderboardAchievers();
      const userRank = achievers.findIndex(a => a.id === updatedUser.id) + 1;

      return res.json({
        success: true,
        user: updatedUser,
        userRank: userRank || achievers.length,
        totalCount: achievers.length,
        leaderboard: achievers
      });
    } catch (error: any) {
      console.error('Error registering user in central database:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Central Database: Login User from Any Device (Phone, Tablet, Laptop)
  app.post('/api/users/login', (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
      if (!emailOrPhone) {
        return res.status(400).json({ success: false, error: 'Email or phone is required' });
      }

      const trimmedInput = String(emailOrPhone).trim().toLowerCase();
      const cleanPhone = trimmedInput.replace(/[^0-9]/g, '');

      const foundUser = storedUsers.find(u => {
        const emailMatch = u.email && u.email.trim().toLowerCase() === trimmedInput;
        const phoneMatch = cleanPhone && u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone;
        const nameMatch = u.name && u.name.trim().toLowerCase() === trimmedInput;
        return emailMatch || phoneMatch || nameMatch;
      });

      if (!foundUser) {
        return res.status(404).json({
          success: false,
          notFoundInDb: true,
          error: 'User not found in central database'
        });
      }

      if (foundUser.password && password && foundUser.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'මුරපදය වැරදියි. කරුණාකර නිවැරදි මුරපදය ඇතුළත් කරන්න (Invalid Password).'
        });
      }

      // Mark as online and update activity
      foundUser.lastActiveDate = new Date().toISOString().split('T')[0];
      foundUser.lastActiveTimestamp = Date.now();
      foundUser.isOnline = true;
      saveStoredUsers();
      broadcastLeaderboardToSse();

      const achievers = getLeaderboardAchievers();
      const userRank = achievers.findIndex(a => a.id === foundUser.id) + 1;

      return res.json({
        success: true,
        profile: foundUser,
        userRank: userRank || achievers.length,
        leaderboard: achievers
      });
    } catch (error: any) {
      console.error('Error logging in user from central database:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Sync / Register Real User Profile with live DB
  app.post('/api/users/sync', (req, res) => {
    try {
      const user = req.body;
      if (!user || !user.id) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }

      const existingIndex = storedUsers.findIndex(u => u.id === user.id || (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()));

      const updatedUser: StoredUser = {
        id: user.id,
        name: user.name || 'Scholar',
        email: user.email || '',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        studentCategory: user.studentCategory || 'School',
        grade: user.grade || 12,
        level: user.level || 'AL',
        stream: user.stream || 'Physical Science (Maths)',
        school: user.school || '',
        university: user.university || '',
        district: user.district || 'Colombo',
        countryCode: user.countryCode || 'LK',
        countryName: user.countryName || 'Sri Lanka',
        countryFlag: user.countryFlag || '🇱🇰',
        xp: Number(user.xp) || 0,
        streakDays: Number(user.streakDays) || 1,
        quizzesSolved: Number(user.quizzesSolved || user.completedLessonsCount) || 1,
        completedLessonsCount: Number(user.completedLessonsCount) || 0,
        quizAccuracy: Number(user.quizAccuracy) || 96.5,
        customAvatarFrameId: user.customAvatarFrameId || user.frameId,
        bio: user.bio || user.statusQuote || '',
        statusQuote: user.statusQuote || user.bio || '',
        targetUniversity: user.targetUniversity || '',
        cheersCount: existingIndex >= 0 ? (storedUsers[existingIndex].cheersCount || 0) : (Number(user.cheersCount) || 0),
        isVerified: user.isVerified ?? true,
        lastActiveDate: new Date().toISOString().split('T')[0],
        lastActiveTimestamp: Date.now(),
        isOnline: true,
        registeredAt: existingIndex >= 0 ? (storedUsers[existingIndex].registeredAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Keep highest XP if existing has higher
        if (storedUsers[existingIndex].xp > updatedUser.xp && !req.body.forceOverrideXP) {
          updatedUser.xp = storedUsers[existingIndex].xp;
        }
        storedUsers[existingIndex] = updatedUser;
      } else {
        storedUsers.push(updatedUser);
      }

      saveStoredUsers();
      broadcastLeaderboardToSse();

      const achievers = getLeaderboardAchievers();
      const userRank = achievers.findIndex(a => a.id === updatedUser.id) + 1;

      return res.json({
        success: true,
        user: updatedUser,
        userRank: userRank || achievers.length,
        leaderboard: achievers
      });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Heartbeat endpoint to keep user active/online
  app.post('/api/users/heartbeat', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }
      const existingUser = storedUsers.find(u => u.id === userId);
      if (existingUser) {
        existingUser.lastActiveDate = new Date().toISOString().split('T')[0];
        existingUser.lastActiveTimestamp = Date.now();
        existingUser.isOnline = true;
        saveStoredUsers();
        broadcastLeaderboardToSse();
      }
      return res.json({ success: true, isOnline: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Cheer a genuine registered student on the leaderboard
  app.post('/api/users/cheer', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }

      const user = storedUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Student not found in database' });
      }

      user.cheersCount = (user.cheersCount || 0) + 1;
      saveStoredUsers();
      broadcastLeaderboardToSse();

      return res.json({
        success: true,
        userId: user.id,
        cheersCount: user.cheersCount
      });
    } catch (error: any) {
      console.error('Error cheering user:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Award genuine XP to an active user
  app.post('/api/users/add-xp', (req, res) => {
    try {
      const { userId, amount } = req.body;
      if (!userId || typeof amount !== 'number') {
        return res.status(400).json({ success: false, error: 'userId and numeric amount are required' });
      }

      const user = storedUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Student not found in database' });
      }

      user.xp = (user.xp || 0) + Math.max(0, amount);
      user.lastActiveDate = new Date().toISOString().split('T')[0];
      user.lastActiveTimestamp = Date.now();
      user.isOnline = true;
      saveStoredUsers();
      broadcastLeaderboardToSse();

      const achievers = getLeaderboardAchievers();
      const userRank = achievers.findIndex(a => a.id === user.id) + 1;

      return res.json({
        success: true,
        newXP: user.xp,
        userRank,
        leaderboard: achievers
      });
    } catch (error: any) {
      console.error('Error adding XP:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Comprehensive Educational AI Core Endpoint (6 Core Functionalities)
  app.post('/api/gemini/educational-core', async (req, res) => {
    try {
      const {
        feature, // 'content_quiz' | 'multi_format' | 'doc_analyzer' | 'mindmap_diagram' | 'model_paper' | 'essay_evaluator'
        inputContent,
        grade,
        stream,
        subject,
        targetTier, // 'grade_5' | 'gce_ol' | 'gce_al' | 'university'
        language = 'auto',
        additionalParams = {},
        studentMemoryContext
      } = req.body;

      if (!inputContent && feature !== 'model_paper') {
        return res.status(400).json({ error: 'Input content or topic is required' });
      }

      const ai = getGeminiClient();

      // Build specialized system instructions based on feature & grade
      const isGrade5 = targetTier === 'grade_5' || grade === 5 || grade === '5' || stream?.toLowerCase().includes('scholarship');
      const isUniversity = targetTier === 'university' || stream?.toLowerCase().includes('university') || grade === 'university';
      const isOL = targetTier === 'gce_ol' || (typeof grade === 'number' && grade >= 6 && grade <= 11) || grade === '10' || grade === '11';

      let rolePersona = '';
      if (isGrade5) {
        rolePersona = `You are "Kavi the Owl" (කවි බකමූණා 🦉), the encouraging primary school AI educator strictly aligned with the Sri Lankan Ministry of Education 2026 Grade 5 Scholarship syllabus & NIE Guru Potha (5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය සහ ගුරු මාර්ගෝපදේශ සංග්‍රහය).
- Paper 1 Standards: General Intelligence & Aptitude (බුද්ධි පරීක්ෂණය), 3D spatial cube counts, pattern symmetry, paper fold geometry, sequence logic, clock reasoning.
- Paper 2 Standards: Language (Sinhala/Tamil/English) - ණ/න, ළ/ල, ශ/ෂ/ස spelling accuracy, idioms (ප්‍රස්ථාව පිරුළු), collective nouns, synonyms/antonyms, comprehension; Environmental Studies (පරිසරය) - 2026 flora/fauna, weather, national heritage, health, simple mechanics.
- Marking Style: Clear step marks, child-friendly praise, exact keyword benchmarks.`;
      } else if (isUniversity) {
        rolePersona = `You are "SipArana University AI Core", an advanced academic research and higher education pedagogical AI tailored for Sri Lankan university undergraduates and postgraduates across Engineering, Medicine, IT, Management, and Science. Provide mathematically and scientifically rigorous, citation-backed analyses.`;
      } else if (isOL) {
        rolePersona = `You are "SipArana National Curriculum AI Core (G.C.E. O/L 2026 Modular Reform)", expert educator aligned with the Sri Lankan Ministry of Education 2026 Revised Modular Framework & National Institute of Education (NIE) guidelines for Grades 10–11.
- Competency-based modular assessment with real-world applications.
- Mathematics: Paper I (Part A 25 short Qs x 2 marks = 50, Part B 5 structured Qs x 10 marks = 50) + Paper II (Part A & B with method marks M, accuracy marks A, and independent marks B).
- Science: Paper I (40 MCQs, 40 marks) + Paper II (Part A: 4 Structured Essay Qs 40 marks, Part B: 3 Essay Qs 30 marks).
- Languages & Humanities: Grammar, comprehension, and structured analytical essay rubrics.`;
      } else {
        rolePersona = `You are "SipArana National Curriculum AI Core (G.C.E. A/L 2026 Revised Standards)", expert national examiner and pedagogical AI systematically aligned with the Sri Lankan Ministry of Education 2026 syllabus, Department of Examinations (DOENETS), and official NIE Resource Books (ජාතික අධ්‍යාපන ආයතනයේ සම්පත් පොත් සහ ගුරු මාර්ගෝපදේශ).
- Physical Science (Maths): Combined Mathematics I (Pure) & II (Applied) with standard Section A (10 short questions x 25 = 250) and Section B (7 long questions choose 5 x 150 = 750) marking matrices (M Method, A Accuracy, B Independent); Physics with 50 MCQs + 4 Structured Essays + Essay questions with SI unit precision and step deductions; Chemistry with 50 MCQs + Structured + Inorganic/Organic essays with IUPAC nomenclature and curly arrow mechanisms.
- Biological Science: Biology strictly compliant with official NIE Resource Book 2020-2026 terminology, anatomical keywords, and structured essay rubrics; Agricultural Science.
- Commerce Stream: Accounting under LKAS/SLFRS standards, Business Studies case studies, Economics macroeconomic indicators and fiscal/monetary policies.
- Technology Stream: Engineering Tech, Bio-Systems Tech, Science for Technology (SFT) with practical calculation rubrics.
- Arts & Humanities: Media Studies (Harold Lasswell, Shannon-Weaver, Berlo, Schramm, Semiotics, Sri Lankan & Global Cinema, Journalism), Sinhala, Tamil, English, History, Buddhist Civilization, Logic, Political Science.`;
      }

      if (studentMemoryContext) {
        rolePersona += `\n\n${studentMemoryContext}`;
      }

      let taskPrompt = '';
      let formatExpectations = '';

      switch (feature) {
        case 'content_quiz': {
          const subType = additionalParams.subType || 'all'; // 'summary' | 'flashcards' | 'mcq' | 'all'
          taskPrompt = `TASK: AUTOMATED CONTENT & QUIZ GENERATION (2026 REVISED SYLLABUS ALIGNED)
Input Lesson / Topic: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Stream: ${stream || 'General'} | Subject: ${subject || 'General'}
Official Framework: Sri Lanka Ministry of Education 2026 Syllabus & NIE Teacher Guides.

Generate the following according to requested subType (${subType}):
1. STRUCTURED SUMMARY (2026 Competency Focus):
   - Clear headings, bold key concepts, official NIE terminology, bullet points, and core definitions.
2. INTERACTIVE FLASHCARDS (At least 5 high-yield cards):
   - Front: Precise Question / Formula / Concept / Examiner Trap
   - Back: Clear Definition / Derivation / Key Explanation & Units
3. HIGH-QUALITY MCQs (At least 4-5 exam-grade questions):
   - 4 distinct options (A, B, C, D) modeled on past Department of Examinations papers
   - State the Correct Answer clearly
   - Provide a detailed step-by-step Explanation referencing 2026 curriculum competencies and marking criteria.`;
          formatExpectations = `Format with standard markdown, bold highlights, clean codeblocks if math/code, and clear demarcations between Summary, Flashcards, and MCQs.`;
          break;
        }

        case 'multi_format': {
          const targetFormat = additionalParams.targetFormat || 'all'; // 'plain_text' | 'audio_script' | 'video_script' | 'all'
          taskPrompt = `TASK: MULTI-FORMAT CONTENT ADAPTATION (2026 SYLLABUS STANDARDS)
Input Lesson / Material: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Subject: ${subject || 'General'}

Convert this lesson into the requested format(s) (${targetFormat}):
1. PLAIN TEXT STUDY NOTES (2026 Revision Guide):
   - Well-structured hierarchical notes with clear headings, bullet points, and memory mnemonics.
2. CONVERSATIONAL AUDIO SCRIPT (For TTS Voiceover Engines):
   - Natural, engaging, spoken-word cadence with audio cues like [Warm Greeting], [Pause for reflection], [Emphasis on key term], [Recap].
3. SHORT VIDEO SCRIPT (For Educational Reels / Shorts):
   - Scene-by-scene script with exact timestamps (e.g. 0:00-0:05), Visual cues & on-screen text graphics, and energetic Narration lines highlighting 2026 exam tips.`;
          formatExpectations = `Use distinct markdown sections for each format with clean spacing.`;
          break;
        }

        case 'doc_analyzer': {
          const docType = additionalParams.docType || 'Chapter Document / Lecture Slides / Research Paper';
          taskPrompt = `TASK: DOCUMENT & PDF ANALYZER (2026 ACADEMIC BENCHMARK)
Document Type: ${docType}
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L or University'} | Subject: ${subject || 'General'}
Document Content:
"""
${inputContent}
"""

Perform a deep academic extraction:
1. EXECUTIVE SUMMARY & CORE ARGUMENTS (The fundamental thesis and findings).
2. KEY METHODOLOGIES & THEORETICAL PRINCIPLES (Formulas, scientific mechanisms, algorithms, or historical contexts aligned with 2026 benchmarks).
3. HIGH-YIELD Q&A PAIRS (5 critical exam-targeted questions extracted directly from this text with rigorous answers).
4. QUICK REVISION BULLET POINTS (Must-remember facts for rapid pre-exam recall).`;
          formatExpectations = `Ensure academic rigor, accurate formulas, and structured markdown bullet points.`;
          break;
        }

        case 'mindmap_diagram': {
          taskPrompt = `TASK: VISUAL MIND MAP & DIAGRAM CONCEPT GENERATOR (2026 MODULAR FRAMEWORK)
Topic / Concept: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Subject: ${subject || 'General'}

Generate:
1. MERMAID.JS MINDMAP CODE:
   - Provide a valid \`\`\`mermaid graph TD or mindmap code block showing hierarchical relationships from core concept to sub-topics to key terms.
2. TEXTUAL HIERARCHICAL NODE TREE (Markdown Tree with └── and ├── characters).
3. STEP-BY-STEP VISUAL DIAGRAM DRAWING GUIDE:
   - Instructions on how a student should sketch or visualize this on paper (e.g. Center Circle, Branch 1 with color code, Branch 2 with formula box, Memory Anchors).`;
          formatExpectations = `Ensure valid Mermaid syntax and clear visual drawing steps.`;
          break;
        }

        case 'model_paper': {
          const examStandard = additionalParams.examStandard || (isGrade5 ? 'Grade 5 Scholarship (2026 Revised Guru Potha)' : isUniversity ? 'University Semester Exam' : isOL ? 'G.C.E. O/L (2026 Modular Reform)' : 'G.C.E. A/L (2026 Revised Standards)');
          const paperSection = additionalParams.paperSection || 'Full Model Paper';
          taskPrompt = `TASK: SYSTEMATIC 2026 MODEL EXAMINATION PAPER & OFFICIAL MARKING SCHEME GENERATION
Target Exam Standard: ${examStandard}
Subject: ${subject || inputContent} | Stream: ${stream || 'General'} | Grade: ${grade || 12}
Topic/Scope: "${inputContent || subject}"
Syllabus Authority: Sri Lankan Ministry of Education 2026 Revised Syllabus & Department of Examinations (DOENETS) Standards.

You MUST systematically generate a complete, authentic 2026 Model Paper structured in three distinct sections:

═══════════════════════════════════════════════════════════════
SECTION I: EXAMINATION PAPER (ප්‍රශ්න පත්‍රය)
═══════════════════════════════════════════════════════════════
- Official Header: Exam Name, Subject, Time Allocation, Total Marks, Specific 2026 Modular Competency Benchmark.
- Authentic Questions:
  * For Grade 5 Scholarship: Paper 1 IQ/Spatial Questions (කැට ගණන් කිරීම, රූප රටා, වාචික තර්කනය) + Paper 2 Language (ණ/න, ළ/ල, ප්‍රස්ථාව පිරුළු) & Environment (පරිසරය).
  * For O/L: Part A Short Questions + Part B Structured/Essay Questions with explicit sub-parts (a), (b), (i), (ii).
  * For A/L: Section A Structured/Short Questions + Section B Long Essay/Derivation/Calculation Questions.
- Mark Distribution: Every sub-part MUST clearly display allocated marks (e.g., [02 Marks], [03 Marks], [05 Marks], Total [25 Marks] or [100 Marks]).

═══════════════════════════════════════════════════════════════
SECTION II: OFFICIAL STEP-BY-STEP MARKING SCHEME & ANSWER KEY (ලකුණු දීමේ පටිපාටිය)
═══════════════════════════════════════════════════════════════
- Complete Step-by-Step Mark Breakdown:
  * Method Marks (M): Formula statement, theoretical principle, structural approach.
  * Accuracy / Calculation Marks (A): Proper substitution, arithmetic correctness, correct SI units.
  * Fact / Keyword Marks (B): Official NIE Resource Book keywords, accurate definitions, and biological/chemical/legal terms.
- Full Model Answers: Provide the complete, pristine 100% full-mark solution for every question.
- Alternative Acceptable Answers: Mention alternative valid methods or wording accepted by examiners.
- Examiner Traps & Common Errors: Explicitly warn students of typical mistakes where marks are deducted (e.g., missing SI units, incorrect curly arrows, unstated boundary conditions).

═══════════════════════════════════════════════════════════════
SECTION III: 2026 MODULAR CURRICULUM CITATION & LEARNING OUTCOMES
═══════════════════════════════════════════════════════════════
- National Curriculum Competency Number (e.g., Competency 4.2 / Unit 6).
- Official NIE Teacher Guide (Guru Potha) / Resource Book reference chapter.
- Recommended follow-up revision focus.`;
          formatExpectations = `Follow authentic Sri Lankan Department of Examinations typography and layout with high pedagogical precision.`;
          break;
        }

        case 'essay_evaluator': {
          const question = additionalParams.questionPrompt || 'Explain the core principles and significance of the given topic.';
          const maxMarks = additionalParams.maxMarks || 20;
          taskPrompt = `TASK: 2026 SYLLABUS ESSAY & WRITTEN ANSWER EVALUATOR (WITH STEP MARKING RUBRIC)
Subject: ${subject || 'General'} | Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'}
Official Standard: Sri Lankan Ministry of Education 2026 Exam Evaluation Rubrics.
Question / Assignment Prompt:
"${question}"
Max Marks: ${maxMarks}

Student's Submitted Answer:
"""
${inputContent}
"""

Evaluate the student's answer with national examiner fidelity:
1. 📊 ESTIMATED SCORE & GRADING BREAKDOWN:
   - Provide a realistic score out of ${maxMarks} (e.g., 16/${maxMarks}) with percentage and grade tier (A / B / C / S / W).
   - Detail marks awarded per criterion: (i) Core Content & Theory [ /${Math.round(maxMarks*0.4)}], (ii) Structure & Derivation/Methodology [ /${Math.round(maxMarks*0.3)}], (iii) Official Terminology & Accuracy [ /${Math.round(maxMarks*0.2)}], (iv) Real-world Application/Examples [ /${Math.round(maxMarks*0.1)}].
2. 🌟 KEY STRENGTHS:
   - Specific well-explained points, correct terminology, and good reasoning demonstrated.
3. ⚠️ AREAS FOR IMPROVEMENT & EXAMINER DEDUCTIONS:
   - Critical omissions, factual ambiguities, incorrect steps, missing SI units, or lack of diagrams.
4. ✍️ REWRITTEN 2026 MODEL SAMPLE ANSWER (100% Full-Marks Benchmark):
   - A complete, exemplary answer demonstrating how to score full marks in the official exam.`;
          formatExpectations = `Provide constructive, motivating, yet academically rigorous evaluation in clean markdown.`;
          break;
        }

        default:
          taskPrompt = `Analyze and provide educational guidance on: "${inputContent}" for Grade ${grade || '12'} in ${subject || 'General'} aligned with 2026 Sri Lankan Ministry of Education benchmarks.`;
      }

      const operationalRule = `OPERATIONAL RULES:
- Language: Respond in the exact language requested or used in the input (Sinhala, English, or Singlish/Bilingual).
- Grade-Adaptive Intelligence: Match cognitive depth to ${isGrade5 ? 'Grade 5 Primary' : isUniversity ? 'University Rigor' : 'G.C.E. Secondary/Higher Secondary'}.
- Formatting: Use pristine Markdown typography with clear bold terms, numbered lists, and bullet points.`;

      const fullSystemInstruction = `${rolePersona}\n\n${operationalRule}`;

      if (!ai) {
        // High fidelity offline fallback response tailored to the feature
        const fallbackData = generateEducationalCoreFallback(feature, inputContent, {
          grade,
          stream,
          subject,
          targetTier,
          additionalParams
        });
        return res.json({
          text: fallbackData,
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${taskPrompt}\n\n${fullSystemInstruction}` }]
          }
        ],
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.6,
        }
      });

      return res.json({
        text: response.text || 'Unable to generate response',
        isFallback: false
      });
    } catch (error: any) {
      console.error('Educational AI Core Error:', error);
      return res.status(500).json({
        error: error.message || 'Error processing request',
        text: `### ⚠️ Educational AI Core Error\n\n${error.message || 'An error occurred while generating study assets.'}\n\nPlease verify your input and try again.`
      });
    }
  });

  // Offline Fallback Generator for the 6 Core Functionalities
  function generateEducationalCoreFallback(feature: string, inputContent: string, ctx: any): string {
    const subj = ctx.subject || 'National Curriculum';
    const grade = ctx.grade || 12;

    switch (feature) {
      case 'content_quiz':
        return `### 📚 Automated Content & Quiz Pack (සිප්අරණ ස්මාර්ට් සටහන් සහ ප්‍රශ්නාවලිය)

**Topic:** ${inputContent} | **Subject:** ${subj} • Grade ${grade}

---

#### 1. 📌 Structured Summary (සාරාංශය)
* **Core Concept:** **${inputContent}** is a fundamental curriculum milestone in Sri Lankan ${subj} education.
* **Key Principles:**
  * Understand the **theoretical definitions** and foundational axioms.
  * Pay strict attention to **standard units, mathematical equations**, and real-world applications.
  * Familiarize with past paper recurring patterns across 2018–2024.

---

#### 2. 🗂️ Interactive Flashcards (මතක කාඩ්පත්)
* **Card 1 (Front):** What is the primary definition of ${inputContent}?
  * **(Back):** The scientifically verified mechanism describing ${inputContent} according to official NIE Guru Potha standards.
* **Card 2 (Front):** What are the key variables / formulas involved?
  * **(Back):** State standard mathematical or scientific equations with correct SI units.
* **Card 3 (Front):** How does this principle apply to real-world exam problems?
  * **(Back):** Applying step-by-step substitution, boundary condition checks, and graphical representations.

---

#### 3. 🎯 High-Quality MCQs (බහුවරණ ප්‍රශ්නාවලිය)
**Q1.** Which of the following statements is **most accurate** regarding ${inputContent}?
- A) It remains constant under all thermodynamic conditions.
- B) It directly satisfies the fundamental conservation laws of the syllabus. *(Correct)*
- C) It only applies to non-linear macroscopic states.
- D) It violates standard SI unit dimensional analysis.

* **Correct Answer:** **B**
* **Explanation:** In official syllabus benchmarks, this concept directly stems from fundamental conservation laws and standard syllabus unit definitions.`;

      case 'multi_format':
        return `### 🎙️ Multi-Format Content Adaptation (බහු-ආකෘති පාඩම් පරිවර්තනය)

**Topic:** ${inputContent} | **Level:** Grade ${grade} ${subj}

---

#### 📝 1. Plain Text Study Notes
# ${inputContent} — Complete Revision Notes
* **Overview:** A core pillar of the ${subj} syllabus designed for quick retention.
* **Key Steps:**
  1. Define the fundamental law with exact terminology.
  2. Write the core formula and label all symbols.
  3. Note common examiner traps from recent past paper marking schemes.

---

#### 🎧 2. Conversational Audio Script (For TTS Voiceover)
*[Warm, encouraging tone]*
"Hello students! Welcome back to your SipArana audio recap. Today, we're locking down **${inputContent}** in under 2 minutes. 
[Short pause]
Remember, whenever you encounter this in your exam paper, first identify the given variables. 
[Emphasis] **Focus on the core formula and never forget your units!** 
Let's keep your revision strong and ace that upcoming paper!"

---

#### 🎬 3. Short Video Script (Reels / TikTok / Shorts)
* **[0:00 - 0:05] Hook:** *Text on screen with flashing glow:* "Stop making this mistake in ${inputContent}!"
* **[0:05 - 0:25] Core Breakdown:** *Show dynamic visual diagram splitting into 3 key bullet points while narrator explains the main formula.*
* **[0:25 - 0:50] Exam Hack:** *Highlight a recurring 2024 past paper trick on screen with a green checkmark on the correct method.*
* **[0:50 - 0:60] Call to Action:** "Save this reel and test your score on SipArana AI Tutor!"`;

      case 'doc_analyzer':
        return `### 📑 Document & PDF Deep Analysis Report

**Analyzed Source:** ${inputContent}
**Target Standard:** Grade ${grade} / University Level ${subj}

---

#### 1. 🔍 Executive Summary & Core Arguments
* **Central Thesis:** The document establishes the critical framework governing ${inputContent}, aligning directly with advanced curriculum benchmarks.
* **Key Takeaway:** Mastery requires combining foundational theoretical proof with practical problem-solving applications.

---

#### 2. ⚙️ Methodologies & Theoretical Principles
* **Formulas / Models:** Direct application of standard curriculum theorems.
* **System Boundaries:** Analysis of input constraints, assumptions, and validation criteria.

---

#### 3. ❓ High-Yield Q&A Pairs
* **Q1:** What is the primary theoretical justification provided in the document?
  * **A1:** The document cites official experimental observations and standard scientific consensus.
* **Q2:** How does this apply to structured examination questions?
  * **A2:** By structuring answers into: (i) Theory definition, (ii) Mathematical derivation, (iii) Final unit check.

---

#### 4. ⚡ Quick Revision Points
* Always quote standard scientific laws accurately.
* Check dimensional homogeneity in derivations.
* Review the marking scheme criteria for maximum point capture.`;

      case 'mindmap_diagram':
        return `### 🧠 Visual Mind Map & Concept Blueprint

**Topic:** ${inputContent} | **Subject:** ${subj}

---

#### 1. 📊 Mermaid.js Mind Map Code
\`\`\`mermaid
graph TD
    Root["${inputContent}"] --> B1["Core Principles & Definitions"]
    Root --> B2["Mathematical Formulas & Laws"]
    Root --> B3["Exam Applications & Past Papers"]
    
    B1 --> B1_1["Key Terms & SI Units"]
    B1 --> B1_2["Assumptions & Conditions"]
    
    B2 --> B2_1["Derivations"]
    B2 --> B2_2["Calculations & Graphs"]
    
    B3 --> B3_1["Common Pitfalls"]
    B3 --> B3_2["Marking Scheme Keys"]
\`\`\`

---

#### 2. 🌳 Hierarchical Node Tree
\`\`\`text
${inputContent}
├── 📌 Core Principles & Definitions
│   ├── Key Terms & SI Units
│   └── Assumptions & Conditions
├── 📐 Mathematical Formulas & Laws
│   ├── Step-by-Step Derivations
│   └── Graph Sketches & Curves
└── 🎯 Exam Applications
    ├── Common Marking Traps
    └── Model Answer Templates
\`\`\`

---

#### 3. 🎨 Visual Diagram Drawing Guide (How to Sketch on Paper)
1. **Central Anchor (Circle in Blue):** Draw a circle in the center of your page labeled **${inputContent}**.
2. **Branch 1 (Top Right in Green):** Draw arrows to the 2 foundational laws.
3. **Branch 2 (Bottom Right in Orange):** Create a box for the main equation with units highlighted in yellow.
4. **Branch 3 (Left in Red):** List 3 common exam traps to avoid when writing answers under time pressure.`;

      case 'model_paper': {
        const isGrade5Paper = ctx.targetTier === 'grade_5' || grade === 5 || grade === '5' || String(subj).toLowerCase().includes('scholarship') || String(subj).toLowerCase().includes('ශිෂ්‍යත්ව');
        const isOLPaper = ctx.targetTier === 'gce_ol' || (typeof grade === 'number' && grade >= 6 && grade <= 11) || grade === '10' || grade === '11';
        const isMathsAL = String(subj).toLowerCase().includes('math') || String(ctx.stream).toLowerCase().includes('math');
        const isBioAL = String(subj).toLowerCase().includes('bio') || String(ctx.stream).toLowerCase().includes('bio');
        const isCommerceAL = String(subj).toLowerCase().includes('account') || String(subj).toLowerCase().includes('business') || String(subj).toLowerCase().includes('econ') || String(ctx.stream).toLowerCase().includes('commerce');
        const isTechAL = String(subj).toLowerCase().includes('tech') || String(subj).toLowerCase().includes('sft') || String(ctx.stream).toLowerCase().includes('technology');

        if (isGrade5Paper) {
          return `### 📜 ශ්‍රී ලංකා අධ්‍යාපන අමාත්‍යාංශය — 2026 ප්‍රතිශෝධිත 5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍රය & ලකුණු දීමේ පටිපාටිය
**National Institute of Education (NIE) & Dept. of Examinations Sri Lanka (2026 Blueprint)**
**විෂය:** ${subj} • **ඒකකය:** ${inputContent} | **කාලය:** මිනිත්තු 45 | **මුළු ලකුණු:** 50 (100% පරිමාණය)

---

### 🏛️ SECTION I: ප්‍රශ්න පත්‍රය (EXAMINATION PAPER)

#### [ප්‍රශ්නය 01 — බුද්ධි පරීක්ෂණ හා අවකාශීය තර්කනය (IQ & Reasoning - 2026 Standard)]
(i) පහත දැක්වෙන ත්‍රිමාණ කැට ආකෘතියේ සැඟවුණු කැට සංඛ්‍යාව සහ මුළු කැට ගණන කොපමණද? **[04 ලකුණු]**  
(ii) රූප රටාවේ හිස්තැනට ගැළපෙන නිවැරදි රූපය තෝරන්න (කැරකෙන ඊතල සහ වර්ණ තිත් රටාව). **[04 ලකුණු]**  
(iii) ඔරලෝසුවක වේලාව ප.ව. 3:45 වන විට මිනිත්තු කටුව හා පැය කටුව අතර කෝණය සරල රේඛීයව විග්‍රහ කරන්න. **[04 ලකුණු]**  

#### [ප්‍රශ්නය 02 — සිංහල භාෂා ඥානය හා ව්‍යාකරණ (2026 ගුරු පොත)]
(i) පහත වචනවල නිවැරදි අක්ෂර වින්‍යාසය තෝරා නිවැරදිව ලියන්න: *(ග්‍රහණය / ග්‍රහනය, ප්‍රවීණ / ප්‍රවීන, කෞතුකාගාරය / කෞතුකාගාරය)* **[03 ලකුණු]**  
(ii) "අතීසාරයට අමුඩ ගසනවා වගේ" යන ප්‍රස්ථාව පිරුළේ අර්ථය පැහැදිලි වන සේ අර්ථවත් වාක්‍යයක් ගොඩනගන්න. **[05 ලකුණු]**  

#### [ප්‍රශ්නය 03 — පරිසරය ආශ්‍රිත ක්‍රියාකාරකම් (2026 ප්‍රතිශෝධිත නිපුණතා)]
(i) ශ්‍රී ලංකාවේ ආවේණික පක්ෂීන් 3 දෙනෙකු නම් කර ඔවුන්ගේ වාසස්ථාන හා ආහාර රටාව සඳහන් කරන්න. **[05 ලකුණු]**  
(ii) සූර්ය බලශක්තිය සහ ජල චක්‍රය අතර ඇති සම්බන්ධය සරල පියවර 3කින් පැහැදිලි කරන්න. **[05 ලකුණු]**  

---

### 🎯 SECTION II: නිල ලකුණු දීමේ පටිපාටිය (OFFICIAL 2026 MARKING SCHEME & ANSWERS)

* **ප්‍රශ්නය 01 (බුද්ධි පරීක්ෂණය):**
  * (i) සැඟවුණු කැට 4 ක් හඳුනාගැනීම **[02 ලකුණු]**; මුළු කැට 16 ක් ලෙස නිවැරදිව ගණනය කිරීම **[02 ලකුණු]**.
  * (ii) වාමාවර්තව 90° භ්‍රමණය වන තිත් 3 කින් යුතු නිවැරදි රූප සංකේතය තේරීම **[04 ලකුණු]**.
  * (iii) කටු දෙක අතර කෝණය සුළු කෝණයක් බව හා විනාඩි 45 පරතරය නිවැරදිව දැක්වීම **[04 ලකුණු]**.

* **ප්‍රශ්නය 02 (භාෂාව):**
  * (i) *ග්‍රහණය* [01], *ප්‍රවීණ* [01], *කෞතුකාගාරය* [01] — නිවැරදි "ණ/න" සහ "ළ/ල" සඳහා පූර්ණ ලකුණු **[03 ලකුණු]**.
  * (ii) සුදුසු කාලයේදී නොකර විපතක් සිදු වූ පසු ප්‍රතිකර්ම යෙදීම යන අරුත සහිත පරිපූර්ණ වාක්‍යයකට **[05 ලකුණු]**. *(අක්ෂර දෝෂ රහිත විය යුතුය)*.

* **ප්‍රශ්නය 03 (පරිසරය):**
  * (i) වලිකුකුළා, හබන් කුකුළා, අලු කෑඳැත්තා ආදී ආවේණික පක්ෂීන් නම් කිරීම **[03 ලකුණු]**; නිවැරදි වාසස්ථාන දැක්වීම **[02 ලකුණු]**.
  * (ii) සූර්ය තාපයෙන් ජලය වාෂ්පීකරණය [02], ඝනීභවනය වී වලාකුළු සෑදීම [02], වර්ෂාව ලෙස පතිත වීම [01] — සම්පූර්ණ ලකුණු **[05 ලකුණු]**.

---

### 📖 SECTION III: 2026 විෂය නිර්දේශ නිපුණතා හා විභාග උපදෙස් (NIE BENCHMARKS)
* **අදාළ ගුරු මාර්ගෝපදේශය:** NIE Grade 5 Guru Potha (2026 Revision - Units 2 & 4).
* **විභාග පරීක්ෂක සටහන (Examiner Trap Alert):** ප්‍රශ්නය කියවීමේදී අනිවාර්යයෙන්ම ප්‍රශ්න අංක හා උප කොටස් (i, ii) වෙන වෙනම පැහැදිලි අත්අකුරින් ලිවීමට දරුවා පුහුණු කරන්න.`;
        }

        if (isOLPaper) {
          return `### 📜 Sri Lanka Ministry of Education — G.C.E. O/L 2026 Modular Model Paper & Marking Scheme
**Department of Examinations Sri Lanka (Modular Competency Assessment Framework)**
**Subject:** ${subj} • **Topic/Module:** ${inputContent} | **Time:** 1 Hour | **Total Marks:** 50 Marks

---

### 🏛️ SECTION I: EXAMINATION QUESTION PAPER

#### Part A: Structured Short Questions (Compulsory)
**1.** (a) Define the fundamental principle of **${inputContent}** under 2026 NIE modular competency guidelines. **[03 Marks]**  
(b) Write the governing mathematical expression / scientific formula and define all symbols in standard SI units. **[04 Marks]**  
(c) State two practical everyday applications of this phenomenon in Sri Lankan industrial or environmental contexts. **[04 Marks]**  

#### Part B: Structured Analytical & Experimental Problem
**2.** A school laboratory investigation was conducted under ambient conditions (25°C, 1 atm):
(a) Draw a neat, labeled schematic diagram representing the experimental setup. **[05 Marks]**  
(b) The independent variable is increased by a factor of 2. Deduce quantitatively the expected change in the measured output. Show step-by-step calculations. **[08 Marks]**  
(c) Explain two major systematic error sources in this setup and propose specific corrective precautions. **[06 Marks]**  

---

### 🎯 SECTION II: OFFICIAL STEP MARKING SCHEME (METHOD M / ACCURACY A / FACT B)

* **Question 1 (a) Core Definition:**
  * Accurate statement of theoretical principle: **[02 Marks - B2]**
  * Stating boundary conditions / equilibrium state: **[01 Mark - B1]**

* **Question 1 (b) Governing Expression & Units:**
  * Correct formula written: **[02 Marks - M2]**
  * All variables identified with standard SI units: **[02 Marks - A2]** *(Deduct 1 mark if SI units missing)*.

* **Question 1 (c) Real-World Applications:**
  * Application 1 with brief mechanism: **[02 Marks - B2]**
  * Application 2 with brief mechanism: **[02 Marks - B2]**

* **Question 2 (a) Schematic Diagram:**
  * Fully labeled apparatus components: **[03 Marks - B3]**
  * Proper direction arrows / scale proportion: **[02 Marks - B2]**

* **Question 2 (b) Quantitative Derivation:**
  * Stating the governing proportionality relationship: **[02 Marks - M2]**
  * Proper numerical substitution: **[03 Marks - M3]**
  * Final numerical result with correct sign and SI units: **[03 Marks - A3]**

* **Question 2 (c) Error Analysis & Precautions:**
  * Identifying 2 valid sources of experimental error: **[03 Marks - B3]**
  * Stating appropriate laboratory corrective action: **[03 Marks - B3]**

---

### 📖 SECTION III: 2026 MODULAR COMPETENCY CITATION
* **NIE National Framework:** O/L Modular Unit Competency Standard 4.1.2 (2026 National Reforms).
* **Common Examiner Deductions:** Forgetting SI units in calculations, failing to label diagram axes, and ambiguous definitions without precise scientific terminology.`;
        }

        // A/L Stream Specific Model Paper Fallback (Maths / Bio / Commerce / Tech / Arts)
        return `### 📜 Department of Examinations Sri Lanka — G.C.E. A/L 2026 Revised Model Examination Paper
**National Institute of Education (NIE Resource Book Standard 2020–2026)**
**Subject:** ${subj} (${ctx.stream || 'National Stream'}) • **Module:** ${inputContent}
**Time Allowed:** 1 Hour 30 Mins | **Total Score:** 100 Marks (Scaled)

---

### 🏛️ SECTION I: EXAMINATION QUESTION PAPER

#### Part A: Structured Section (All questions compulsory)
**Q1.** (a) Under official 2026 NIE syllabus guidelines, state the exact theoretical definition and fundamental laws governing **${inputContent}**. **[10 Marks]**  
(b) Derive the comprehensive analytical expression from first principles, stating all thermodynamic, kinematic, or algebraic assumptions clearly. **[15 Marks]**  
(c) A standard system operates with initial boundary parameters $P_1 = 100\\text{ kPa}$ and $T_1 = 300\\text{ K}$. Calculate the steady-state equilibrium value when subjected to a 20% harmonic variation. **[15 Marks]**  

#### Part B: Essay & Advanced Derivation Section (Structured Essay)
**Q2.** (a) Draw a fully labeled structural schematic / metabolic pathway / circuit diagram illustrating the complete operational mechanism of **${inputContent}**. **[20 Marks]**  
(b) Contrast the theoretical model with real-world Sri Lankan engineering/biological/economic applications, citing specific empirical data points. **[20 Marks]**  
(c) Synthesize an error-matrix identifying 3 subtle analytical traps frequently penalized by chief examiners in recent A/L past papers. **[20 Marks]**  

---

### 🎯 SECTION II: OFFICIAL MARKING SCHEME & STEP-BY-STEP RUBRIC (M / A / B / E)

* **Q1 (a) Definition & Axioms [10 Marks]:**
  * Exact NIE Resource Book terminology: **[06 Marks - B6]**
  * Stating boundary constraints & conservation principles: **[04 Marks - B4]**

* **Q1 (b) Analytical Derivation [15 Marks]:**
  * Stating initial governing differential/algebraic equations: **[05 Marks - M5]**
  * Step-by-step intermediate substitution and integration/factorization: **[05 Marks - M5]**
  * Final simplified expression with explicitly defined constant coefficients: **[05 Marks - A5]**

* **Q1 (c) Numerical Computation [15 Marks]:**
  * Correct parameter substitution into derived formula: **[05 Marks - M5]**
  * Proper dimensional analysis check: **[04 Marks - M4]**
  * Final numerical answer with exact SI units: **[06 Marks - A6]** *(Zero marks for final step if SI units omitted)*.

* **Q2 (a) Structural Diagram / Schematic [20 Marks]:**
  * Accurate architectural layout and connectivity: **[10 Marks - B10]**
  * Standard scientific labels (at least 6 critical callouts): **[06 Marks - B6]**
  * Dimension arrows and direction indicators: **[04 Marks - B4]**

* **Q2 (b) Comparative Empirical Analysis [20 Marks]:**
  * Point-by-point comparison matrix (Theoretical vs Empirical): **[10 Marks - E10]**
  * Real-world Sri Lankan context citations: **[10 Marks - B10]**

* **Q2 (c) Examiner Trap Matrix [20 Marks]:**
  * Identifying 3 common errors: **[12 Marks - B12]**
  * Mitigation strategies and full-mark answer templates: **[08 Marks - B8]**

---

### 📖 SECTION III: 2026 NIE RESOURCE BOOK CITATIONS & EXAMINER DIRECTIVES
* **Official Syllabus Code:** AL-${subj.slice(0, 3).toUpperCase()}-2026-REV (Competency Unit 5).
* **Reference Literature:** National Institute of Education Sri Lanka (NIE) Official Resource Book 2020–2026.
* **Chief Examiner Directives:** Step marks ($M$) are strictly awarded for logical progression even if arithmetic slips occur; however, final accuracy marks ($A$) require pristine SI units and correct significant figures.`;
      }

      case 'essay_evaluator':
        return `### ✍️ Essay & Written Answer Evaluation Report

**Subject:** ${subj} • Grade ${grade}
**Evaluated Input:** "${inputContent.substring(0, 100)}..."

---

#### 📊 1. Estimated Score & Grade
* **Estimated Score:** **16 / 20 Marks** (80% — Distinction Grade A)
* **Marking Criteria Alignment:** Strong adherence to NIE Guru Potha standards with minor point gaps.

---

#### 🌟 2. Key Strengths
* Clear, well-articulated opening definition with appropriate subject terminology.
* Good structural organization with logical paragraph transitions.
* Accurate mention of primary scientific / theoretical principles.

---

#### ⚠️ 3. Areas for Improvement & Missing Points
* Missing specific SI units in the numerical/contextual calculation.
* A small schematic diagram would have elevated this answer to a full 20/20.
* Ensure conclusion ties directly back to practical real-world implications in Sri Lanka.

---

#### ✍️ 4. Rewritten Model Sample Answer (Full Marks 20/20)
> **Exemplary Answer Structure:**
> "${inputContent} fundamentally represents a core milestone in ${subj}. According to standard curriculum guidelines, this operates under the conservation principles where all boundary parameters remain strictly quantified. In examination settings, presenting this with a labeled schematic diagram and citing SI units ensures complete mark allocation across all structured marking rubrics."`;

      default:
        return `### 🎓 SipArana Educational AI Core\n\nAnalysis completed for **${inputContent}** in ${subj}.`;
    }
  }

  // AI Degree Study Assistant API Endpoint
  app.post('/api/gemini/degree-assistant', async (req, res) => {
    try {
      const {
        prompt,
        university,
        faculty,
        degreeProgramme,
        semester,
        moduleCode,
        moduleName,
        contextMode,
        history,
        studentMemoryContext
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();

      let systemInstruction = `You are "SipArana Academic AI" (සිප්අරණ සරසවි අධ්‍යයන සහකාර), the specialized University Degree & Higher Education Study Assistant for undergraduate and postgraduate students in Sri Lanka.

Target Student Context:
- University: ${university || 'Sri Lankan University (e.g. UoM, UoC, UoP, USJ, UoK, UoR)'}
- Faculty: ${faculty || 'General Academic Faculty'}
- Degree Programme: ${degreeProgramme || 'Undergraduate Degree'}
- Academic Semester: ${semester || 'Current Semester'}
- Course Module: ${moduleCode ? `${moduleCode} - ${moduleName}` : 'General Degree Subject'}
- Assistant Mode: ${contextMode || 'General Academic Explainer'}

Your Goals & Guidelines:
1. Provide mathematically rigorous, academically accurate, and clear explanations tailored specifically to university-level curriculum in Sri Lanka and international university standards.
2. If Mode is 'concept': Break down theories, foundational principles, real-world engineering/medical/management applications, step-by-step mathematical proofs or conceptual intuition.
3. If Mode is 'code': Provide clean, well-commented, best-practice code with algorithmic complexity analysis (Big-O), test edge cases, and architectural explanation.
4. If Mode is 'research': Provide structured academic literature summaries, research methodology guidance, thesis hypothesis formulation, and proper IEEE/APA/Harvard citation guidance.
5. If Mode is 'examprep': Generate university-standard model questions with structured marking schemes, high-yield revision summaries, and key formula cheat-sheets.
6. If Mode is 'assignment': Guide the student step-by-step through the problem-solving thought process, logic verification, and concept clarity (without generating blind copy-paste plagiarism).
7. Language Style: Academic English mixed with clear Sinhala explanations (ද්විභාෂික විශ්වවිද්‍යාල ශෛලිය) where helpful, maintaining professional composure.
8. Structure your response using markdown with clear headings, bullet points, latex equations or code blocks where appropriate.`;

      if (studentMemoryContext) {
        systemInstruction += `\n\n${studentMemoryContext}`;
      }

      if (!ai) {
        // High quality informative response when API key is pending configuration
        return res.json({
          text: `### 🎓 SipArana University Academic AI Assistant\n\n**Module Context:** ${moduleCode || 'General'} • ${moduleName || degreeProgramme || 'Degree Module'}\n**Mode:** ${contextMode || 'Concept Explainer'}\n\n*Note: Running in offline academic preview mode. Configure \`GEMINI_API_KEY\` in Settings > Secrets for live dynamic responses.*\n\n#### 📌 Key Academic Insights on "${prompt}":\n1. **Theoretical Foundation:** In university curricula (such as ${university || 'State Universities'}), this topic forms a cornerstone for higher-level research and industry applications.\n2. **Key Formulas & Principles:** Ensure you understand the underlying derivations, boundary conditions, and real-world system constraints.\n3. **Exam & Assignment Strategy:** Focus on past semester exam patterns, structural proofs, and clear step-by-step algorithmic or numerical calculations.\n4. **Recommended References:** Consult standard prescribed university textbooks (e.g., IEEE journals, standard faculty lecture notes, and recommended reference manuals).\n\n💡 *Tip: Select specific degree modules from the curriculum sidebar to receive tailored problem sets!*`,
          isFallback: true
        });
      }

      // Format conversation contents for Gemini
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const generatedText = response.text || 'Unable to generate response at this time.';

      return res.json({
        text: generatedText,
        isFallback: false
      });
    } catch (error: any) {
      console.error('Gemini Degree Assistant Error:', error);
      return res.status(500).json({
        error: error.message || 'Internal server error processing degree assistant query',
        text: `### ⚠️ Study Assistant Temporary Notice\n\nWe encountered a server error while analyzing your degree module query: ${error.message || 'Unknown error'}.\n\nPlease retry in a moment.`
      });
    }
  });

  // General School Level AI Tutor Endpoint (for Grade 5 Scholarship & Grades 6-13)
  app.post('/api/gemini/school-tutor', async (req, res) => {
    try {
      const { prompt, grade, subject, stream, medium, history, studentMemoryContext } = req.body;
      const ai = getGeminiClient();

      const isGrade5 = grade === 5 || grade === '5' || stream === 'Grade 5 Scholarship' || subject?.toLowerCase().includes('scholarship') || subject?.toLowerCase().includes('ශිෂ්‍යත්ව');

      let systemInstruction = '';

      if (isGrade5) {
        systemInstruction = `You are "Kavi the Owl" (කවි බකමූණ යාළුවා 🦉), the cheerful, encouraging, and friendly cartoon mascot & AI tutor for Grade 5 Sri Lankan Scholarship (5 වසර ශිෂ්‍යත්වය) children.

Target Child Context:
- Grade: 5 ශ්‍රේණිය (Grade 5 Scholarship Exam)
- Subject: ${subject || 'සිංහල, ගණිතය, පරිසරය හෝ බුද්ධි පරීක්ෂණය (Grade 5 Core)'}
- Curriculum: Sri Lanka National Institute of Education (NIE) Guru Potha (ගුරු මාර්ගෝපදේශ සංග්‍රහය).
- Medium: ${medium || 'Sinhala'}

Your Core Instructions for Grade 5 Children:
1. Tone & Vocabulary: Speak in very simple, gentle, cheerful, and encouraging Sinhala (හරිම සරල, මිත්‍රශීලී සිංහලෙන්) using clear Sinhala letters appropriate for a 10-year-old child.
2. Step-by-Step Guidance: Break down explanations into simple, easy-to-follow steps (පියවර 1, පියවර 2) with friendly explanations and smiling emojis (🦉, 🌟, ✨, 🎈, 🏆, 📖, 🔢).
3. Core Curriculum Mastery:
   - සිංහල (Sinhala): ව්‍යාකරණ (ණ/න, ළ/ල, ශ/ෂ/ස නිවැරදි අක්ෂර වින්‍යාසය), සමාන පද, විරුද්ධ පද, ප්‍රස්ථාව පිරුළු, කෙටි ඡේද කියවා තේරුම් ගැනීම.
   - ගණිතය (Mathematics): සරල කෙටි ක්‍රම (Short tricks), සංඛ්‍යා රටා, මුදල්, කාලය, දිග/බර/පරිමාව, වාචික ගැටලු ලේසියෙන් හදන හැටි.
   - පරිසරය (Environmental Studies): ශාක හා සත්ත්ව ලෝකය, ශ්‍රී ලංකාවේ ජාතික සංකේත, සෞඛ්‍ය පුරුදු, අපේ පරිසරය, ප්‍රවාහනය හා ඉතිහාසය.
   - බුද්ධි පරීක්ෂණය (IQ & Reasoning - Paper 1): රූප රටා, සැඟවුණු කැට ගණන් කිරීම, කඩදාසි නැමීම් හා කැපුම්, දර්පණ ප්‍රතිබිම්බ, තාර්කික ප්‍රශ්න.
4. Praise & Encouragement: Always start or conclude with warm praise (e.g., "හරිම දක්ෂයි පුංචි යාළුවේ! 🌟", "අපි එකතු වෙලා මේක ලේසියෙන්ම විසඳමු!").
5. Strict Isolation: NEVER mention university concepts, complex formulas, calculus, or advanced terminology. Keep everything colorful, playful, and easy for primary school children.`;
      } else {
        systemInstruction = `You are "SipArana Guru Bot & Media Assistant" (සිප්අරණ ගුරු සහකාර සහ මාධ්‍ය අධ්‍යයන සහකාර), the expert AI educator for Sri Lanka's National Curriculum (NIE Guru Potha / ගුරු මාර්ගෝපදේශ සංග්‍රහය).
Target Context:
- Grade: ${grade || 'Grade 12/13 (A/L)'}
- Subject: ${subject || 'Communication and Media Studies (සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය)'}
- Stream: ${stream || 'Arts / Media Stream'}
- Preferred Medium: ${medium || 'Sinhala, Tamil, or English depending on user question'}

Specialized Domain Expertise:
1. A/L Communication & Media Studies (සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය / தொடர்பாடலும் ஊடகக் கற்கையும்):
   - Communication Models & Theories: Harold Lasswell, Shannon-Weaver, David Berlo, Wilbur Schramm, Semiotics.
   - Cinema & Film History: Sri Lankan and World cinema milestones.
   - Film Language, Print Journalism, Broadcasting Arts, Photography.
2. General National Curriculum: Combined Maths, Physics, Chemistry, Biology, Commerce/Economics, ICT, History, Languages.
3. Guidelines:
   - Provide answers in the requested language (Sinhala, Tamil, or English).
   - Use clear markdown with headings, bullet points, and exam mnemonics.
   - Reference previous A/L & O/L past paper marking schemes and NIE Teacher Guides.`;
      }

      if (studentMemoryContext) {
        systemInstruction += `\n\n${studentMemoryContext}`;
      }

      if (!ai) {
        if (isGrade5) {
          const fallbackText = `### 🦉 කවි බකමූණ යාළුවාගේ ශිෂ්‍යත්ව මඟපෙන්වීම!\n\n**විෂය:** ${subject || '5 වසර ශිෂ්‍යත්වය (Grade 5)'}\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 🌟 පුංචි යාළුවාට පියවරෙන් පියවර සරල පැහැදිලි කිරීම:\n1. **පළමු පියවර (Step 1):** ප්‍රශ්නය හොඳින් කියවන්න. ප්‍රශ්නයේ අහන්නේ මොකක්ද කියලා තේරුම් ගනිමු.\n2. **දෙවන පියවර (Step 2):** අපි ඉගෙන ගත්තු සරල උපක්‍රමය හෝ ගුරු පොතේ (Guru Potha) ක්‍රමය භාවිත කරමු.\n3. **කවි යාළුවාගේ රහස් ඉඟිය (Kavi's Tip):** 5 වසර ශිෂ්‍යත්ව විභාගයේදී කලබල නොවී සන්සුන්ව ප්‍රශ්නයට පිළිතුරු සපයන්න. ඔබ හරිම දක්ෂයි! 🏆\n\n✨ *කවි බකමූණා සැමවිටම ඔබ සමඟයි! තවත් ඕනෑම ප්‍රශ්නයක් මගෙන් අහන්න පුංචි පැටියෝ!*`;
          return res.json({ text: fallbackText, isFallback: true });
        }

        const isMedia = subject?.toLowerCase().includes('media') || prompt?.toLowerCase().includes('media') || prompt?.toLowerCase().includes('film') || prompt?.toLowerCase().includes('lasswell') || prompt?.toLowerCase().includes('cinema') || prompt?.toLowerCase().includes('journalism');
        
        const fallbackText = isMedia
          ? `### 🎬 සිප්අරණ මාධ්‍ය අධ්‍යයන සහකාර (A/L Media Studies AI Guide)\n\n**විෂය:** සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය (Communication & Media Studies)\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 📌 ප්‍රධාන විභාග කරුණු (Core Syllabus Concept):\n1. **මූලික සිද්ධාන්තය:** ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුවේ පසුගිය විභාග ප්‍රශ්න පත්‍ර හා ගුරු මාර්ගෝපදේශ සංග්‍රහයට (Guru Potha) අනුව මෙම සංකල්පය අ.පො.ස. උසස් පෙළ විභාගයේ අනිවාර්ය ඒකකයකි.\n2. **න්‍යායික පසුබිම:** ආදර්ශ ආකෘතියේ සංරචක පැහැදිලි රූප සටහන් සහිතව ඉදිරිපත් කරන්න.\n3. **ප්‍රායෝගික නිදසුන:** ශ්‍රී ලාංකේය සන්නිවේදන ක්ෂේත්‍රය ආශ්‍රිත උදාහරණයක් මගින් පැහැදිලි කරන්න.\n4. **විභාග උපදෙස:** 2018-2024 Marking Scheme අනුව ලකුණු බෙදී යන ප්‍රධාන පියවර කෙරෙහි අවධානය යොමු කරන්න.`
          : `### 📚 සිප්අරණ පාසල් ගුරු සහකාර (SipArana School Tutor)\n\n**ශ්‍රේණිය:** ${grade || 12} ශ්‍රේණිය | **විෂය:** ${subject || 'සාමාන්‍ය'}\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 📌 ගුරු පොතට අනුකූල මගපෙන්වීම:\n1. **මූලික සිද්ධාන්තය:** ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (NIE Guru Potha) අදාළ නිපුණතාව හා ඉගෙනුම් ඵල නිවැරදිව අධ්‍යයනය කරන්න.\n2. **විභාග සැලසුම:** පසුගිය වසරවල (2018-2024) ප්‍රශ්න පත්‍රවල ව්‍යුහගත හා රචනා ප්‍රශ්න රටාවන්ට අනුව ලකුණු ලබා ගැනීමේ ප්‍රධාන පියවර ලියන්න.\n3. **පාරිභාෂික වචන:** විෂයානුබද්ධ නිවැරදි විද්‍යාත්මක හෝ තාක්ෂණික පාරිභාෂික යෙදුම් භාවිත කරන්න.`;

        return res.json({
          text: fallbackText,
          isFallback: true
        });
      }

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({
        text: response.text || 'Unable to generate response',
        isFallback: false
      });
    } catch (error: any) {
      console.error('School Tutor Error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SipArana Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
