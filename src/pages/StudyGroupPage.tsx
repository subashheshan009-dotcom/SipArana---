import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Sparkles,
  ThumbsUp,
  CheckCircle,
  Search,
  Plus,
  Send,
  ShieldCheck,
  Tag,
  Filter,
  RefreshCw,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveSync, SyncedDiscussionPost } from '@/context/LiveSyncContext';
import KaviMascot from '@/components/KaviMascot';
import confetti from 'canvas-confetti';

const STREAMS = [
  { id: 'ALL', label: 'All Streams' },
  { id: 'AL_PHYSICAL', label: 'A/L Maths' },
  { id: 'AL_BIO', label: 'A/L Bio' },
  { id: 'AL_COMMERCE', label: 'A/L Commerce' },
  { id: 'AL_TECH', label: 'A/L Tech' },
  { id: 'AL_ARTS', label: 'A/L Arts' },
  { id: 'OL_ALL', label: 'O/L (Grade 10-11)' }
] as const;

export default function StudyGroupPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();
  const {
    posts,
    addPost,
    upvotePost,
    addReply,
    markPostSolved,
    isSyncing,
    activeOnlineStudents,
    triggerManualSync
  } = useLiveSync();

  const [selectedStream, setSelectedStream] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('Combined Mathematics');
  const [newStream, setNewStream] = useState<SyncedDiscussionPost['stream']>('AL_PHYSICAL');
  const [newTags, setNewTags] = useState('Calculus, Past Papers');

  const filteredPosts = posts.filter((p) => {
    const matchStream = selectedStream === 'ALL' || p.stream === selectedStream;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStream && matchSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addPost({
      authorName: profile?.name || 'Anonymous Student',
      authorGrade: profile?.grade || 'Grade 13',
      authorAvatar: profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'ST',
      stream: newStream,
      subject: newSubject,
      title: newTitle,
      content: newContent,
      tags: tagsArray.length > 0 ? tagsArray : ['General']
    });

    addXP(30);
    setShowNewPostModal(false);
    setNewTitle('');
    setNewContent('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleSendReply = (postId: string) => {
    if (!replyInput.trim()) return;
    addReply(postId, replyInput.trim());
    addXP(15);
    setReplyInput('');
    setActiveReplyPostId(null);
  };

  return (
    <div id="student-study-group-page" className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Peer Study Corner</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeOnlineStudents.toLocaleString()} Students Active Now</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'si'
              ? 'ශිෂ්‍ය අධ්‍යයන සංසදය (Discussion Corner)'
              : language === 'ta'
              ? 'மாணவர் படிப்பு கலந்துரையாடல் தளம்'
              : 'Student Study Group & Discussion Corner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'si'
              ? 'විෂය ධාරාව අනුව සංවිධානය වූ, සත්‍යාපිත විසඳුම් සහ කවි AI සහය සහිත විනයගරුක ශිෂ්‍ය සංසදය'
              : language === 'ta'
              ? 'பாடப் பிரிவுகளுக்கு ஏற்ப ஒழுங்கமைக்கப்பட்ட பாதுகாப்பான மாணவர் சந்தேக தீர்வு தளம்'
              : 'Moderated, safe peer learning forum with AI-verified solutions and real-time live synchronization.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerManualSync}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Force auto-sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            id="ask-question-modal-btn"
            type="button"
            onClick={() => setShowNewPostModal(true)}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Ask a Question (+30 XP)</span>
          </button>
        </div>
      </div>

      {/* Mascot Guidance */}
      <KaviMascot
        contextPage="discussion"
        customMessage={
          language === 'si'
            ? '🦉 කවි ඔයාට කියනවා: වෙනත් යාලුවෙකුගේ ප්‍රශ්නයකට නිවැරදි විසඳුම පැහැදිලි කර දීමෙන් ඔයාට +15 XP ලැබෙනවා වගේම ඔබේ මතකය ස්ථිර වෙනවා!'
            : language === 'ta'
            ? '🦉 கவி சொல்கிறது: மற்ற மாணவர்களின் கேள்விகளுக்கு சரியான விளக்கம் அளிப்பதன் மூலம் நீங்கள் +15 XP பெறுவீர்கள்!'
            : '🦉 Kavi says: Helping a peer with a verified step-by-step solution awards +15 XP and solidifies your mastery before exams!'
        }
      />

      {/* Stream Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {STREAMS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStream(s.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                selectedStream === s.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussion topics, formulas, past paper questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Discussion Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No questions found</h3>
            <p className="text-xs text-slate-400">Be the first student to start a discussion in this stream!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {post.authorName}
                      </span>
                      <span className="text-[11px] text-slate-400">• {post.authorGrade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{post.subject}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {post.isSolved && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-black flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Solved</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                    {post.stream.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Post Actions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => upvotePost(post.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                      post.hasUpvoted
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.replies.length} Replies</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SipArana Safe Moderation</span>
                </div>
              </div>

              {/* Replies Section */}
              {post.replies.length > 0 && (
                <div className="space-y-2.5 pt-2 pl-3 sm:pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                  {post.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3.5 rounded-2xl space-y-1.5 text-xs ${
                        reply.authorRole === 'kavi_ai'
                          ? 'bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-500/30'
                          : reply.isVerified
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {reply.authorName}
                          </span>
                          {reply.authorRole === 'kavi_ai' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                              AI Study Buddy
                            </span>
                          )}
                          {reply.authorRole === 'top_ranker' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-black">
                              Top Ranker
                            </span>
                          )}
                          {reply.authorRole === 'teacher' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-black">
                              Educator
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Box */}
              {activeReplyPostId === post.id && (
                <div className="flex gap-2 pt-2 animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder="Write a clear, helpful solution..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post.id)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(post.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Question Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Post Study Question to Group
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Stream</label>
                  <select
                    value={newStream}
                    onChange={(e) => setNewStream(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="AL_PHYSICAL">A/L Maths</option>
                    <option value="AL_BIO">A/L Biology</option>
                    <option value="AL_COMMERCE">A/L Commerce</option>
                    <option value="AL_TECH">A/L Technology</option>
                    <option value="AL_ARTS">A/L Arts</option>
                    <option value="OL_ALL">O/L All Subjects</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Question Title / Concept
                </label>
                <input
                  type="text"
                  required
                  placeholder="What is your doubt or past paper question?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Detailed Explanation / Given Information
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Include given values, steps attempted so far, or past paper year & number..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Waves, Doppler, Past Paper 2023"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                >
                  Publish Question (+30 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
