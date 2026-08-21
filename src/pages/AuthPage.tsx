import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  School,
  MapPin,
  Layers,
  Award,
  Compass,
  Cpu,
  Building2,
  BookMarked
} from 'lucide-react';
import { useAuth, type DemoPresetKey } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS, SCHOOL_GRADES } from '@/data/mockData';
import { UNIVERSITIES_DATA } from '@/data/universityData';
import type { Stream, ExamLevel, Medium, SchoolGrade, StudentCategory } from '@/types';

export default function AuthPage() {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [studentCategory, setStudentCategory] = useState<StudentCategory>('School');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<SchoolGrade>(11);
  const [stream, setStream] = useState<Stream>('General O/L');
  const [district, setDistrict] = useState('Colombo');
  const [school, setSchool] = useState('');
  const [targetYear, setTargetYear] = useState(2026);
  const [medium, setMedium] = useState<Medium>('Sinhala');

  // University specific registration state
  const [selectedUniId, setSelectedUniId] = useState('uom');
  const [selectedFacultyId, setSelectedFacultyId] = useState('uom_eng');
  const [selectedDegreeCode, setSelectedDegreeCode] = useState('ENG-CSE');
  const [academicYear, setAcademicYear] = useState(1);
  const [academicSemester, setAcademicSemester] = useState(1);
  const [studentIdNumber, setStudentIdNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUni = UNIVERSITIES_DATA.find(u => u.id === selectedUniId) || UNIVERSITIES_DATA[0];
  const currentFaculty = currentUni.faculties.find(f => f.id === selectedFacultyId) || currentUni.faculties[0];
  const availableDegrees = currentFaculty ? currentFaculty.degrees : [];

  const handleUniversityChange = (uniId: string) => {
    setSelectedUniId(uniId);
    const uni = UNIVERSITIES_DATA.find(u => u.id === uniId);
    if (uni && uni.faculties.length > 0) {
      setSelectedFacultyId(uni.faculties[0].id);
      if (uni.faculties[0].degrees.length > 0) {
        setSelectedDegreeCode(uni.faculties[0].degrees[0].code);
      }
    }
  };

  const handleFacultyChange = (facId: string) => {
    setSelectedFacultyId(facId);
    const fac = currentUni.faculties.find(f => f.id === facId);
    if (fac && fac.degrees.length > 0) {
      setSelectedDegreeCode(fac.degrees[0].code);
    }
  };

  const handleGradeChange = (newGrade: SchoolGrade) => {
    setGrade(newGrade);
    if (newGrade <= 9) {
      setStream('Junior Secondary (Grade 6-9)');
      setTargetYear(2028);
    } else if (newGrade <= 11) {
      setStream('General O/L');
      setTargetYear(newGrade === 11 ? 2026 : 2027);
    } else {
      if (stream === 'General O/L' || stream === 'Junior Secondary (Grade 6-9)') {
        setStream('Physical Science (Maths)');
      }
      setTargetYear(newGrade === 13 ? 2026 : 2027);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email) {
          setError('කරුණාකර ඔබගේ නම සහ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.');
          setLoading(false);
          return;
        }

        if (studentCategory === 'University') {
          const matchedDegree = availableDegrees.find(d => d.code === selectedDegreeCode) || availableDegrees[0];
          await register({
            name,
            email,
            studentCategory: 'University',
            level: 'CAMPUS',
            stream: 'Higher Education',
            school: currentUni.name,
            university: currentUni.name,
            universityShort: currentUni.shortName,
            faculty: currentFaculty?.name || 'Faculty of Engineering',
            degreeProgramme: matchedDegree?.title || 'B.Sc. (Hons) in Computer Science & Engineering',
            degreeCode: matchedDegree?.code || selectedDegreeCode,
            academicYear,
            academicSemester,
            studentIdNumber: studentIdNumber || 'STU-2026',
            targetYear: new Date().getFullYear() + (matchedDegree?.durationYears || 4),
            district,
            medium,
            currentGpa: 3.80,
            targetGpa: 4.00,
          });
        } else {
          let calculatedLevel: ExamLevel = 'AL';
          if (grade <= 9) calculatedLevel = 'JUNIOR';
          else if (grade <= 11) calculatedLevel = 'OL';

          await register({
            name,
            email,
            studentCategory: 'School',
            grade,
            level: calculatedLevel,
            stream,
            district,
            school: school || 'Sri Lanka National School',
            targetYear,
            medium,
          });
        }
      } else {
        if (!email) {
          setError('කරුණාකර ඔබගේ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.');
          setLoading(false);
          return;
        }
        await login(email, password);
      }
    } catch {
      setError('පද්ධතියට ඇතුළත් වීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  const selectedGradeInfo = SCHOOL_GRADES.find(g => g.grade === grade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background aesthetic shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              SipArana LK
            </h1>
            <p className="text-xs text-slate-400">ශ්‍රී ලංකා පාසල් & සරසවි අධ්‍යාපන පියස</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Grades 6–13 & University AI Ecosystem</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold">
            v3.5 Unified Portal
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 items-center z-10">
        {/* Left column: Value proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka's Unified School & University Learning Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            පාසල් විෂය නිර්දේශයේ සිට <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              සරසවි උපාධි AI සහය
            </span>{' '}
            දක්වා සියල්ල එකම තැනක.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            6–13 ශ්‍රේණි (O/L සහ A/L) ගුරු පොතට අනුකූල පාඩම් මාලා, වීඩියෝ පන්ති සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර සමගින්, විශ්වවිද්‍යාල සිසුන් සඳහා විශේෂිත වූ University AI Study Assistant සහ Degree Portal එක.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Grades 6–13 (Junior, O/L, A/L)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>University Degree Portal & Modules</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Contextual AI Academic Assistant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Semester Notes & GPA Planner</span>
            </div>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ⚡ 1-Click Instant Demo Access:
              </p>
            </div>

            {/* University Demo Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> විශ්වවිද්‍යාල ශිෂ්‍ය පිවිසුම් (University Profiles):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  id="demo-login-uni-cse-btn"
                  onClick={() => loginAsDemo('uni_cse')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">🏛️ UoM Eng CSE</span>
                    <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/50">Y2S1</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">Heshan (Moratuwa)</span>
                </button>

                <button
                  id="demo-login-uni-med-btn"
                  onClick={() => loginAsDemo('uni_med')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">🩺 UoC MBBS</span>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/50">Pre-Clin</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">Dinithi (Colombo)</span>
                </button>

                <button
                  id="demo-login-uni-fin-btn"
                  onClick={() => loginAsDemo('uni_fin')}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500 text-left transition hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">💼 USJ Finance</span>
                    <span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/50">Y1S1</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium truncate block mt-0.5">Kaveen (J'pura)</span>
                </button>
              </div>
            </div>

            {/* School Demo Badges */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" /> පාසල් ශ්‍රේණි පිවිසුම් (School 6–13 Profiles):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  id="demo-login-ol-btn"
                  onClick={() => loginAsDemo('ol')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-amber-400">🎒 11 O/L</span>
                  <span className="text-[10px] text-slate-400 truncate block">Sithum (Galle)</span>
                </button>
                <button
                  id="demo-login-maths-btn"
                  onClick={() => loginAsDemo('maths')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-blue-400">📐 13 A/L Maths</span>
                  <span className="text-[10px] text-slate-400 truncate block">Kasun (Colombo)</span>
                </button>
                <button
                  id="demo-login-bio-btn"
                  onClick={() => loginAsDemo('bio')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-emerald-400">🧬 12 A/L Bio</span>
                  <span className="text-[10px] text-slate-400 truncate block">Rashmi (Colombo)</span>
                </button>
                <button
                  id="demo-login-junior-btn"
                  onClick={() => loginAsDemo('junior')}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500 text-left transition hover:bg-slate-800"
                >
                  <span className="text-xs font-bold block text-teal-400">📘 8 Junior</span>
                  <span className="text-[10px] text-slate-400 truncate block">Minoli (Kurunegala)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRegister ? 'නව ශිෂ්‍ය ගිණුමක් ලියාපදිංචි කරන්න' : 'සිප්අරණ ගිණුමට පිවිසෙන්න'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRegister
                    ? 'පාසල් හෝ විශ්වවිද්‍යාල කාණ්ඩය තෝරා ලියාපදිංචි වන්න'
                    : 'Sign in to access your customized academic dashboard'}
                </p>
              </div>
              <button
                id="toggle-auth-mode-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                {isRegister ? 'Already registered? Sign in' : 'New student? Register'}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  {/* Category Switch: School vs University */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ශිෂ්‍ය කාණ්ඩය තෝරන්න (Select Student Category):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="select-category-school-btn"
                        onClick={() => setStudentCategory('School')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                          studentCategory === 'School'
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${studentCategory === 'School' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          <School className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">පාසල් ශිෂ්‍ය</span>
                          <span className="text-[10px] text-slate-400">Grades 6–13 (O/L, A/L)</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        id="select-category-uni-btn"
                        onClick={() => setStudentCategory('University')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                          studentCategory === 'University'
                            ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${studentCategory === 'University' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">සරසවි ශිෂ්‍ය</span>
                          <span className="text-[10px] text-slate-400">University / Degree</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      සම්පූර්ණ නම (Full Name)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="උදා: කසුන් පෙරේරා / Heshan Subasinghe"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  {studentCategory === 'University' ? (
                    /* UNIVERSITY REGISTRATION FIELDS */
                    <div className="space-y-3.5 p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
                      <div className="flex items-center gap-2 pb-1 border-b border-cyan-900/50">
                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-300">විශ්වවිද්‍යාල සහ උපාධි විස්තර (Degree Programme Info)</span>
                      </div>

                      {/* University Selection */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          විශ්වවිද්‍යාලය (University Institution)
                        </label>
                        <select
                          value={selectedUniId}
                          onChange={(e) => handleUniversityChange(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        >
                          {UNIVERSITIES_DATA.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                              {uni.name} ({uni.shortName}) - {uni.nameSinhala}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Faculty Selection */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          පීඨය (Faculty / School)
                        </label>
                        <select
                          value={selectedFacultyId}
                          onChange={(e) => handleFacultyChange(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        >
                          {currentUni.faculties.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                              {fac.name} ({fac.nameSinhala})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Degree Programme Selection */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          උපාධි පාඨමාලාව (Degree Programme)
                        </label>
                        <select
                          value={selectedDegreeCode}
                          onChange={(e) => setSelectedDegreeCode(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        >
                          {availableDegrees.map((deg) => (
                            <option key={deg.code} value={deg.code}>
                              {deg.title} ({deg.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year, Semester & Student ID */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            අධ්‍යයන වසර (Year)
                          </label>
                          <select
                            value={academicYear}
                            onChange={(e) => setAcademicYear(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                          >
                            <option value={1}>1st Year</option>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                            <option value={4}>4th Year</option>
                            <option value={5}>5th Year (Medical)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            සෙමෙස්ටරය (Sem)
                          </label>
                          <select
                            value={academicSemester}
                            onChange={(e) => setAcademicSemester(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                          >
                            <option value={1}>Semester 1</option>
                            <option value={2}>Semester 2</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            ශිෂ්‍ය අංකය (Reg ID)
                          </label>
                          <input
                            type="text"
                            value={studentIdNumber}
                            onChange={(e) => setStudentIdNumber(e.target.value)}
                            placeholder="220459X"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SCHOOL REGISTRATION FIELDS */
                    <div className="space-y-3.5">
                      {/* Grade Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-slate-300">
                            ශ්‍රේණිය තෝරන්න (Select Grade)
                          </label>
                          <span className="text-[11px] font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                            {selectedGradeInfo?.stage} Level
                          </span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-2">
                          {SCHOOL_GRADES.map((g) => {
                            const isSelected = grade === g.grade;
                            return (
                              <button
                                key={g.grade}
                                type="button"
                                onClick={() => handleGradeChange(g.grade)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition border ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 scale-105'
                                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-700/60'
                                }`}
                              >
                                <span className="text-sm">{g.grade}</span>
                                <span className="text-[9px] opacity-80">{g.stage}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-blue-300">{selectedGradeInfo?.nameSinhala}</span>
                            <span className="text-slate-400 text-[11px] ml-2">({selectedGradeInfo?.description})</span>
                          </div>
                        </div>
                      </div>

                      {/* Stream Selection */}
                      {grade >= 12 ? (
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            උසස් පෙළ විෂය ධාරාව (A/L Stream)
                          </label>
                          <select
                            value={stream}
                            onChange={(e) => setStream(e.target.value as Stream)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          >
                            <option value="Physical Science (Maths)">Physical Science (Maths) - සංයුක්ත ගණිතය</option>
                            <option value="Biological Science (Bio)">Biological Science (Bio) - ජීව විද්‍යාව</option>
                            <option value="Commerce">Commerce - වාණිජ (ගිණුම්කරණය, BS, Econ)</option>
                            <option value="Technology">Technology - තාක්ෂණවේදය (ET, SFT, ICT)</option>
                            <option value="Arts">Arts - කලා (සිංහල, මාධ්‍ය, දේශපාලන විද්‍යාව)</option>
                          </select>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span>
                            {grade <= 9
                              ? '6–9 ශ්‍රේණි: සියලුම ප්‍රධාන විෂයයන් (විද්‍යාව, ගණිතය, ඉතිහාසය, සිංහල, බුද්ධාගම, ඉංග්‍රීසි)'
                              : '10–11 ශ්‍රේණි (සාමාන්‍ය පෙළ): ප්‍රධාන විෂය 6 + කාණ්ඩ විෂයයන් (ICT, වාණිජ, භූගෝලය)'}
                          </span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          පාසල (School Name)
                        </label>
                        <div className="relative">
                          <School className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            placeholder="උදා: Ananda College / මහින්ද විද්‍යාලය"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        දිස්ත්‍රික්කය (District)
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        මාධ්‍යය (Medium)
                      </label>
                      <select
                        value={medium}
                        onChange={(e) => setMedium(e.target.value as Medium)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="Sinhala">සිංහල (Sinhala)</option>
                        <option value="English">English</option>
                        <option value="Tamil">தமிழ் (Tamil)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  විද්‍යුත් තැපෑල (Email Address)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  මුරපදය (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition transform active:scale-98"
              >
                <span>{isRegister ? 'ගිණුම තනා ආරම්භ කරන්න' : 'පිවිසෙන්න (Sign In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-4 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 SipArana Educational Platform. Sri Lankan National Curriculum & University Higher Education Ecosystem.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">ජාතික විෂය නිර්දේශය</span>
          <span className="hover:text-slate-400 cursor-pointer">විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාව (UGC)</span>
          <span className="hover:text-slate-400 cursor-pointer">AI අධ්‍යයන සහය</span>
        </div>
      </footer>
    </div>
  );
}
