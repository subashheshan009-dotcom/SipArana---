import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Search,
  SlidersHorizontal,
  Download,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Maximize2,
  RotateCcw,
  FastForward,
  FileText,
  MessageSquare,
  Share2,
  Award,
  Layers,
  Flame,
  Check,
  Film,
  Send,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CLASSROOM_VIDEOS_DATA } from '@/data/mockData';
import type { ClassVideo, VideoChapter } from '@/types';

interface SubjectCategory {
  id: string;
  name: string;
  nameSinhala: string;
  stream: string;
  color: string;
  iconBg: string;
}

const SUBJECT_CATEGORIES: SubjectCategory[] = [
  { id: 'all', name: 'All Subjects', nameSinhala: 'සියලු විෂයන්', stream: 'All', color: 'from-blue-600 to-indigo-600', iconBg: 'bg-blue-500' },
  { id: 'sub_maths', name: 'Combined Maths', nameSinhala: 'සංයුක්ත ගණිතය', stream: 'Physical Science (Maths)', color: 'from-blue-600 to-cyan-600', iconBg: 'bg-blue-600' },
  { id: 'sub_physics', name: 'Physics', nameSinhala: 'භෞතික විද්‍යාව', stream: 'Physical Science (Maths)', color: 'from-purple-600 to-indigo-600', iconBg: 'bg-purple-600' },
  { id: 'sub_chemistry', name: 'Chemistry', nameSinhala: 'රසායන විද්‍යාව', stream: 'Physical Science (Maths)', color: 'from-emerald-600 to-teal-600', iconBg: 'bg-emerald-600' },
  { id: 'sub_biology', name: 'Biology', nameSinhala: 'ජීව විද්‍යාව', stream: 'Biological Science (Bio)', color: 'from-green-600 to-emerald-700', iconBg: 'bg-green-600' },
  { id: 'sub_ict', name: 'Information Tech (ICT)', nameSinhala: 'තොරතුරු තාක්ෂණය', stream: 'Technology', color: 'from-amber-600 to-orange-600', iconBg: 'bg-amber-600' },
  { id: 'sub_accounting', name: 'Accounting', nameSinhala: 'ගිණුම්කරණය', stream: 'Commerce', color: 'from-rose-600 to-pink-600', iconBg: 'bg-rose-600' },
];

export default function ClassroomPage() {
  const { profile, addXP, updateProfile } = useAuth();

  // State for completed videos persistence
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siparana_completed_videos');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial completed ids from mock data
    return CLASSROOM_VIDEOS_DATA.filter(v => v.isCompleted).map(v => v.id);
  });

  // Filters and search
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'classAsc' | 'popular' | 'duration'>('classAsc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState<ClassVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'tute' | 'qna'>('chapters');
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('siparana_video_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [currentNoteText, setCurrentNoteText] = useState<string>('');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Q&A sample comments state
  const [comments, setComments] = useState<Record<string, Array<{ id: string; user: string; text: string; time: string }>>>({
    vid_math_01: [
      { id: 'c1', user: 'Kasun P.', text: 'මූලධර්මයෙන් sin(2x) අවකලනය කරන විදිහ පැහැදිලි වුණා. ගොඩක් ස්තූතියි සර්!', time: '2 hours ago' },
      { id: 'c2', user: 'Dinuka M.', text: 'Sir, what is the best substitution for tan(x) integration in Class 03?', time: 'Yesterday' }
    ]
  });
  const [newComment, setNewComment] = useState<string>('');

  // Persist completed videos
  useEffect(() => {
    try {
      localStorage.setItem('siparana_completed_videos', JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedIds]);

  // Load student note when active video changes
  useEffect(() => {
    if (activeVideo) {
      setCurrentNoteText(studentNotes[activeVideo.id] || '');
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [activeVideo]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleToggleComplete = (video: ClassVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyCompleted = completedIds.includes(video.id);

    if (isCurrentlyCompleted) {
      const updated = completedIds.filter(id => id !== video.id);
      setCompletedIds(updated);
      triggerToast(`'${video.titleSinhala}' නොනිමි ලෙස සටහන් විය.`);
    } else {
      const updated = [...completedIds, video.id];
      setCompletedIds(updated);
      addXP(50);
      if (profile) {
        updateProfile({ completedLessonsCount: (profile.completedLessonsCount || 0) + 1 });
      }
      triggerToast(`🎉 සාර්ථකයි! '${video.titleSinhala}' අවසන් කළා! +50 XP එකතු විය!`);
    }
  };

  const handleSaveNotes = () => {
    if (!activeVideo) return;
    const updated = { ...studentNotes, [activeVideo.id]: currentNoteText };
    setStudentNotes(updated);
    try {
      localStorage.setItem('siparana_video_notes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    triggerToast('📝 ඔබේ සටහන සුරැකිණි (Notes saved)!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVideo || !newComment.trim()) return;
    const currentList = comments[activeVideo.id] || [];
    const newEntry = {
      id: `c_${Date.now()}`,
      user: profile?.name || 'Student',
      text: newComment.trim(),
      time: 'Just now'
    };
    setComments({
      ...comments,
      [activeVideo.id]: [newEntry, ...currentList]
    });
    setNewComment('');
    triggerToast('💬 ඔබේ ප්‍රශ්නය / අදහස සාර්ථකව පළ කෙරිණි!');
  };

  const handleSeekChapter = (chapter: VideoChapter) => {
    setCurrentTime(chapter.timeSeconds);
    triggerToast(`⏩ Jumped to chapter: ${chapter.titleSinhala} (${chapter.timeFormatted})`);
  };

  // Filtered & Sorted Videos
  const filteredVideos = useMemo(() => {
    return CLASSROOM_VIDEOS_DATA.filter((video) => {
      // Subject filter
      if (selectedSubject !== 'all' && video.subjectId !== selectedSubject) {
        return false;
      }
      // Search filter (Sinhala & English titles, teacher, unit, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = video.title.toLowerCase().includes(q) || video.titleSinhala.toLowerCase().includes(q);
        const matchesTeacher = video.teacherName.toLowerCase().includes(q);
        const matchesUnit = video.unitTitle.toLowerCase().includes(q) || video.unitTitleSinhala.toLowerCase().includes(q);
        const matchesTags = video.tags.some(t => t.toLowerCase().includes(q));
        const matchesClassNum = `class ${video.classNumber}`.includes(q) || `පන්ති ${video.classNumber}`.includes(q) || `${video.classNumber}` === q;
        if (!matchesTitle && !matchesTeacher && !matchesUnit && !matchesTags && !matchesClassNum) {
          return false;
        }
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && video.difficulty !== selectedDifficulty) {
        return false;
      }
      // Completion filter
      const isDone = completedIds.includes(video.id);
      if (completionFilter === 'completed' && !isDone) return false;
      if (completionFilter === 'pending' && isDone) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'classAsc') {
        if (a.subjectId === b.subjectId) {
          return a.classNumber - b.classNumber;
        }
        return a.subjectName.localeCompare(b.subjectName);
      }
      if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      }
      if (sortBy === 'duration') {
        return b.durationSeconds - a.durationSeconds;
      }
      return 0;
    });
  }, [selectedSubject, searchQuery, selectedDifficulty, completionFilter, sortBy, completedIds]);

  // Overall Statistics
  const totalVideos = CLASSROOM_VIDEOS_DATA.length;
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / totalVideos) * 100);

  // Next / Previous Video Navigation in Player
  const currentVideoIndex = activeVideo ? CLASSROOM_VIDEOS_DATA.findIndex(v => v.id === activeVideo.id) : -1;
  const prevVideo = currentVideoIndex > 0 ? CLASSROOM_VIDEOS_DATA[currentVideoIndex - 1] : null;
  const nextVideo = currentVideoIndex >= 0 && currentVideoIndex < CLASSROOM_VIDEOS_DATA.length - 1 ? CLASSROOM_VIDEOS_DATA[currentVideoIndex + 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{showToast}</span>
        </div>
      )}

      {/* Classroom Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              <span>A/L & O/L Video Classroom • වීඩියෝ පන්ති කාමරය</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              විෂය නිර්දේශයේ සියලු වීඩියෝ පාඩම් එකම තැනකින්
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Combined Maths, Physics, Chemistry, Biology, ICT සහ Commerce විෂයන් සඳහා පළපුරුදු ආචාර්ය මණ්ඩලයේ විස්තරාත්මක වීඩියෝ දේශන, නිබන්ධන සහ ප්‍රගති ලුහුබැඳීම.
            </p>
          </div>

          {/* Quick Progress Metric Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 min-w-[260px] flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                පන්ති සම්පූර්ණ කිරීම
              </span>
              <span className="text-amber-300 font-extrabold">{progressPercent}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>අවසන් කළ වීඩියෝ: <b>{completedCount}</b> / {totalVideos}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                +{completedCount * 50} XP Earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Category Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            විෂය අනුව වර්ගීකරණය (Subject Categories)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filteredVideos.length} Classes Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUBJECT_CATEGORIES.map((cat) => {
            const isSelected = selectedSubject === cat.id;
            // count completed for this subject
            const subjectVideos = cat.id === 'all'
              ? CLASSROOM_VIDEOS_DATA
              : CLASSROOM_VIDEOS_DATA.filter(v => v.subjectId === cat.id);
            const subjectCompleted = subjectVideos.filter(v => completedIds.includes(v.id)).length;

            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedSubject(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.nameSinhala}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {subjectCompleted}/{subjectVideos.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Status & Sorting Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="classroom-search-input"
            type="text"
            placeholder="මාතෘකාව, ආචාර්යවරයා හෝ පන්ති අංකය සොයන්න (Search by topic, teacher, Class 01...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              id="filter-all-btn"
              onClick={() => setCompletionFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                completionFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              සියල්ල (All)
            </button>
            <button
              id="filter-pending-btn"
              onClick={() => setCompletionFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition ${
                completionFilter === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              නොනිමි (Pending)
            </button>
            <button
              id="filter-completed-btn"
              onClick={() => setCompletionFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                completionFilter === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              අවසන් කළා (Done)
            </button>
          </div>

          {/* Difficulty Dropdown */}
          <select
            id="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">සියලු මට්ටම් (All Levels)</option>
            <option value="Beginner">Beginner (මූලික)</option>
            <option value="Intermediate">Intermediate (මධ්‍යස්ථ)</option>
            <option value="Advanced">Advanced (උසස්)</option>
          </select>

          {/* Sort Dropdown */}
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="classAsc">පන්ති අංකය (Class 01 → N)</option>
            <option value="popular">වඩාත් ජනප්‍රිය (Popular)</option>
            <option value="duration">කාලය අනුව (Duration)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              id="view-grid-btn"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid / List */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            ගැළපෙන වීඩියෝ පාඩම් හමු නොවීය
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ඔබ සෙවූ වචන හෝ පෙරහන් සඳහා වීඩියෝ හමු නොවීය. කරුණාකර වෙනත් විෂයක් හෝ සෙවුම් පදයක් භාවිතා කරන්න.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSearchQuery('');
              setSelectedDifficulty('all');
              setCompletionFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            පෙරහන් ඉවත් කරන්න (Clear Filters)
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isCompleted = completedIds.includes(video.id);
            return (
              <div
                key={video.id}
                id={`video-card-${video.id}`}
                onClick={() => setActiveVideo(video)}
                className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${
                  isCompleted
                    ? 'border-emerald-500/40 dark:border-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                {/* Thumbnail & Video Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Class Number Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[11px] font-extrabold shadow-md backdrop-blur-xs flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      පන්ති අංක {String(video.classNumber).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-slate-200 text-[10px] font-semibold backdrop-blur-xs">
                      Unit {video.unitNumber}
                    </span>
                  </div>

                  {/* Quick Completed Toggle Button */}
                  <button
                    id={`toggle-complete-btn-${video.id}`}
                    onClick={(e) => handleToggleComplete(video, e)}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed (+50 XP)'}
                    className={`absolute top-3 right-3 p-1.5 rounded-xl backdrop-blur-md transition ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-2 ring-white/50'
                        : 'bg-black/50 text-white hover:bg-black/80 hover:text-emerald-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{video.duration}</span>
                  </div>

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Subject Tag & Difficulty */}
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-blue-600 dark:text-blue-400 truncate">
                        {video.subjectSinhala} • {video.unitTitleSinhala}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          video.difficulty === 'Beginner'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : video.difficulty === 'Intermediate'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {video.difficulty}
                      </span>
                    </div>

                    {/* Title in Sinhala & English */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.titleSinhala}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {video.title}
                    </p>
                  </div>

                  {/* Teacher & Chapters metadata */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={video.teacherAvatar}
                        alt={video.teacherName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 flex-shrink-0"
                      />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {video.teacherName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-shrink-0">
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {(video.viewCount / 1000).toFixed(1)}k
                      </span>
                      <span>•</span>
                      <span>{video.chapters.length} Chapters</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      id={`watch-btn-${video.id}`}
                      onClick={() => setActiveVideo(video)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>නරඹන්න (Watch)</span>
                    </button>

                    <button
                      id={`complete-action-btn-${video.id}`}
                      onClick={(e) => handleToggleComplete(video, e)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>අවසන්</span>
                        </>
                      ) : (
                        <span>Done</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredVideos.map((video) => {
            const isCompleted = completedIds.includes(video.id);
            return (
              <div
                key={video.id}
                id={`video-list-item-${video.id}`}
                onClick={() => setActiveVideo(video)}
                className={`group bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:shadow-md ${
                  isCompleted
                    ? 'border-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full sm:w-44 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                    Class {String(video.classNumber).padStart(2, '0')}
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
                    {video.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>{video.subjectSinhala}</span>
                    <span>•</span>
                    <span className="text-slate-500 dark:text-slate-400">{video.unitTitleSinhala}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition truncate">
                    {video.titleSinhala} ({video.title})
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {video.descriptionSinhala}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      👨‍🏫 {video.teacherName}
                    </span>
                    <span>•</span>
                    <span>{video.chapters.length} Chapters</span>
                    <span>•</span>
                    <span className="text-amber-500 font-semibold">★ {video.rating}</span>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    id={`list-toggle-complete-${video.id}`}
                    onClick={(e) => handleToggleComplete(video, e)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4" />}
                    <span>{isCompleted ? 'අවසන් කළා' : 'Mark Done'}</span>
                  </button>

                  <button
                    id={`list-play-btn-${video.id}`}
                    onClick={() => setActiveVideo(video)}
                    className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Interactive Video Player Modal / Studio */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div
          id="classroom-player-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-extrabold flex-shrink-0">
                  Class {String(activeVideo.classNumber).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">
                    {activeVideo.titleSinhala}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeVideo.subjectSinhala} • {activeVideo.teacherName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Mark as Completed Top Button */}
                <button
                  id="modal-complete-toggle-btn"
                  onClick={() => handleToggleComplete(activeVideo)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    completedIds.includes(activeVideo.id)
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  {completedIds.includes(activeVideo.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />
                      <span>පාඩම අවසන් (Completed)</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>පාඩම අවසන් කළා (+50 XP)</span>
                    </>
                  )}
                </button>

                {/* Close Button */}
                <button
                  id="close-player-modal-btn"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display Area */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
              {/* If is playing, show interactive mockup player video with animated waveform / controls */}
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
                />
                
                <div className="relative z-10 text-center space-y-3 p-6 max-w-lg">
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-4 ring-white/20 animate-pulse">
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </div>
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold border border-blue-400/20">
                      SipArana HD Classroom Player
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">
                      {activeVideo.titleSinhala}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {activeVideo.teacherName} • {activeVideo.teacherTitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Custom Video Player Control Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 text-white flex flex-col gap-2 z-20">
                  {/* Seek Bar */}
                  <div className="w-full flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-300">
                      {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={activeVideo.durationSeconds}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-[11px] font-mono text-slate-400">
                      {activeVideo.duration}
                    </span>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition"
                      >
                        {isPlaying ? <Play className="w-4 h-4 fill-white" /> : <RotateCcw className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                        className="p-1 rounded-lg hover:bg-white/20 transition text-slate-300"
                        title="Rewind 10s"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCurrentTime(Math.min(activeVideo.durationSeconds, currentTime + 10))}
                        className="p-1 rounded-lg hover:bg-white/20 transition text-slate-300"
                        title="Forward 10s"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1 text-slate-300">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">100%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Speed selector */}
                      <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[11px]">
                        {[1, 1.25, 1.5, 2].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => {
                              setPlaybackSpeed(spd);
                              triggerToast(`Speed: ${spd}x`);
                            }}
                            className={`px-2 py-0.5 rounded-md transition ${
                              playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => triggerToast('Theater / Fullscreen Mode')}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition text-slate-300"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tabs: Chapters / Notes / Tute / Q&A */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Tab Navigation */}
              <div className="px-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                  <button
                    id="tab-chapters-btn"
                    onClick={() => setActiveTab('chapters')}
                    className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'chapters'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>පාඩමේ පරිච්ඡේද (Chapters)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {activeVideo.chapters.length}
                    </span>
                  </button>

                  <button
                    id="tab-notes-btn"
                    onClick={() => setActiveTab('notes')}
                    className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'notes'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>මගේ සටහන් (My Notes)</span>
                  </button>

                  <button
                    id="tab-tute-btn"
                    onClick={() => setActiveTab('tute')}
                    className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'tute'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>නිබන්ධන (Tute & PDF)</span>
                  </button>

                  <button
                    id="tab-qna-btn"
                    onClick={() => setActiveTab('qna')}
                    className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'qna'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ප්‍රශ්න & සාකච්ඡා (Q&A)</span>
                  </button>
                </div>

                {/* Class Jumper Prev / Next */}
                <div className="hidden sm:flex items-center gap-1 py-2">
                  <button
                    id="prev-class-btn"
                    disabled={!prevVideo}
                    onClick={() => prevVideo && setActiveVideo(prevVideo)}
                    className="p-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-100 flex items-center gap-1"
                    title={prevVideo ? `Class ${prevVideo.classNumber}: ${prevVideo.titleSinhala}` : 'No previous class'}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>පෙර පන්තිය</span>
                  </button>
                  <button
                    id="next-class-btn"
                    disabled={!nextVideo}
                    onClick={() => nextVideo && setActiveVideo(nextVideo)}
                    className="p-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 flex items-center gap-1"
                    title={nextVideo ? `Class ${nextVideo.classNumber}: ${nextVideo.titleSinhala}` : 'No next class'}
                  >
                    <span>ඊළඟ පන්තිය</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Body Content */}
              <div className="p-5 flex-1">
                {activeTab === 'chapters' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      අවශ්‍ය මාතෘකාව හෝ අනුකොටස මත ක්ලික් කර එම ස්ථානයට ක්ෂණිකව පිවිසෙන්න:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeVideo.chapters.map((ch, idx) => (
                        <div
                          key={ch.id}
                          id={`chapter-item-${ch.id}`}
                          onClick={() => handleSeekChapter(ch)}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                {ch.titleSinhala}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {ch.title}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-md flex-shrink-0">
                            {ch.timeFormatted}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Lesson Description & Objectives */}
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                      <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        පාඩමේ සාරාංශය (Lesson Overview)
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeVideo.descriptionSinhala}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {activeVideo.tags.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        මෙම පන්තිය සඳහා ඔබේ පෞද්ගලික සටහන් (Class Scratchpad)
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        ස්වයංක්‍රීයව ඔබගේ උපාංගයේ සුරැකේ
                      </span>
                    </div>

                    <textarea
                      id="student-scratchpad-input"
                      rows={6}
                      placeholder="පාඩම නරඹන අතරතුර වැදගත් සූත්‍ර, උපක්‍රම හෝ විභාග සටහන් මෙහි ලියා තබාගන්න..."
                      value={currentNoteText}
                      onChange={(e) => setCurrentNoteText(e.target.value)}
                      className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-800 dark:text-slate-100"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>සටහන සුරකින්න (Save Notes)</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'tute' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-extrabold text-xs">
                          PDF
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                            {activeVideo.tuteTitle || 'Class 01 Complete Lecture Handout & Tute PDF'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            PDF Document • 4.2 MB • Past paper questions & answers included
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerToast(`📥 '${activeVideo.tuteTitle}' බාගත වීම ආරම්භ විය!`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>බාගත කරන්න (Download PDF)</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                      <p className="font-bold mb-1">💡 අධ්‍යයන උපදෙස:</p>
                      <p>වීඩියෝව නැරඹීමට පෙර හෝ නරඹන අතරතුර මෙම නිබන්ධනයේ ඇති ආදර්ශ ගැටලු තනිව විසඳීමට උත්සාහ කරන්න.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'qna' && (
                  <div className="space-y-4">
                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="මෙම වීඩියෝව සම්බන්ධයෙන් ඔබේ ගැටලුව හෝ ප්‍රශ්නය විමසන්න..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>යවන්න</span>
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
                      {(comments[activeVideo.id] || []).map((c) => (
                        <div key={c.id} className="pt-2.5 first:pt-0 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{c.user}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
