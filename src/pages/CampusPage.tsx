import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  Search,
  CheckCircle,
  Building2,
  Briefcase,
  Compass,
  Filter,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CAMPUS_COURSES_DATA, SRI_LANKA_DISTRICTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import type { Stream } from '@/types';

export default function CampusPage() {
  const { profile } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState(profile?.district || 'Colombo');
  const [selectedStream, setSelectedStream] = useState<Stream | 'All'>('Physical Science (Maths)');
  const [enteredZScore, setEnteredZScore] = useState<string>('1.85');
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'finder' | 'directory' | 'loans'>('finder');

  const userZScoreNum = parseFloat(enteredZScore) || 0;

  // Filter campus courses
  const filteredCourses = CAMPUS_COURSES_DATA.filter((course) => {
    const matchStream = selectedStream === 'All' || course.streamRequired === selectedStream;
    const matchSearch =
      course.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStream && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>UGC University Admissions & Z-Score Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          විශ්වවිද්‍යාල පිවිසුම සහ Z-Score මාර්ගෝපදේශය
        </h1>
        <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
          ශ්‍රී ලංකා විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාවේ (UGC) නිල Z-Score කඩඉම් ලකුණු පදනම් කරගනිමින් ඔබේ සුදුසුකම් පරික්ෂා කරන්න.
        </p>

        {/* Tab switcher */}
        <div className="pt-3 flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setTab('finder')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              tab === 'finder'
                ? 'bg-white text-blue-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Z-Score Degree Matcher</span>
          </button>
          <button
            onClick={() => setTab('directory')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              tab === 'directory'
                ? 'bg-white text-blue-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>University Directory</span>
          </button>
          <button
            onClick={() => setTab('loans')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              tab === 'loans'
                ? 'bg-white text-blue-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Scholarships & Loans</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Z-Score Degree Matcher */}
      {tab === 'finder' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>ඔබේ Z-Score අගය සහ දිස්ත්‍රික්කය තෝරන්න (Input Parameters)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  දිස්ත්‍රික්කය (District)
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  විෂය ධාරාව (Stream)
                </label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value as Stream)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Physical Science (Maths)">Physical Science (Maths)</option>
                  <option value="Biological Science (Bio)">Biological Science (Bio)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  ඔබේ Target / Actual Z-Score
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={enteredZScore}
                  onChange={(e) => setEnteredZScore(e.target.value)}
                  placeholder="e.g. 1.8500"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                ගැලපෙන පාඨමාලා සහ විශ්වවිද්‍යාල ({filteredCourses.length} Degree Matches)
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by district cutoff for {selectedDistrict}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const cutoff = course.districtCutoffs[selectedDistrict] || course.averageZScore;
                const diff = userZScoreNum - cutoff;
                let chanceBadge = {
                  label: 'High Probability (ඉතා ඉහළ සම්භාවිතාව)',
                  color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                };
                if (diff < -0.1) {
                  chanceBadge = {
                    label: 'Target / Reach Course (ඉලක්කගත පාඨමාලාව)',
                    color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300'
                  };
                } else if (diff < 0) {
                  chanceBadge = {
                    label: 'Moderate Chance (සමීප ලකුණු මට්ටමක)',
                    color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                  };
                }

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-blue-500 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                            {course.logo}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {course.universityShort} • {course.isStateUni ? 'State University' : 'UGC Approved Institute'}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                              {course.courseName}
                            </h4>
                            <p className="text-xs text-slate-500">{course.universityName}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cutoff comparison bar */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">
                            {selectedDistrict} Cutoff
                          </span>
                          <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                            {cutoff.toFixed(4)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 block">Your Score</span>
                          <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                            {userZScoreNum.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Probability badge */}
                      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold text-center ${chanceBadge.color}`}>
                        {chanceBadge.label}
                      </div>

                      {/* Career prospects */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Career Pathways:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {course.careerProspects.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Duration: {course.durationYears} Years Full-Time</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        View Syllabus & Details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Directory */}
      {tab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: 'University of Colombo', established: '1870', location: 'Colombo 03', faculties: 9, students: '12,000+', icon: '🏛️' },
            { name: 'University of Peradeniya', established: '1942', location: 'Peradeniya, Kandy', faculties: 9, students: '14,000+', icon: '🌳' },
            { name: 'University of Moratuwa', established: '1972', location: 'Katubedda, Moratuwa', faculties: 5, students: '9,500+', icon: '⚙️' },
            { name: 'University of Sri Jayewardenepura', established: '1958', location: 'Nugegoda', faculties: 8, students: '13,500+', icon: '📚' },
            { name: 'University of Kelaniya', established: '1959', location: 'Dalugama, Kelaniya', faculties: 7, students: '11,000+', icon: '🎓' },
            { name: 'University of Ruhuna', established: '1978', location: 'Wellamadama, Matara', faculties: 10, students: '10,000+', icon: '🌊' }
          ].map((uni, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-3">
              <div className="text-3xl">{uni.icon}</div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{uni.name}</h4>
              <div className="text-xs text-slate-500 space-y-1">
                <p>📍 Location: {uni.location}</p>
                <p>📅 Established: {uni.established}</p>
                <p>🏛️ Faculties: {uni.faculties} Departments</p>
                <p>👥 Student Population: {uni.students}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Scholarships & Loans */}
      {tab === 'loans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
              💰
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Mahapola Higher Education Scholarship
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Awarded by the Mahapola Higher Education Scholarship Trust Fund. Provides monthly stipends of up to LKR 5,000 for merit and need-based undergraduate state university students.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
              🏦
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Interest-Free Student Loan Scheme (IFSLS)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ministry of Higher Education program providing full funding up to LKR 800,000 for students to follow accredited degree courses in non-state higher education institutes like SLIIT, NSBM, CINEC, and horizon campus.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
