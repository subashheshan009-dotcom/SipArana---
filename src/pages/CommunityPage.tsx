import React, { useState } from 'react';
import {
  Users2,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  PlusCircle,
  Search,
  Sparkles,
  CheckCircle2,
  Bot,
  Send,
  X,
  Share2,
  Tag
} from 'lucide-react';
import { FORUM_POSTS_DATA, SUBJECTS_DATA } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import type { ForumPost, Stream } from '@/types';

export default function CommunityPage() {
  const { profile, addXP } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // New Question form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('Combined Mathematics');
  const [newTagInput, setNewTagInput] = useState('');

  // Active expanded question
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleUpvote = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isUpvoted = !p.isUpvoted;
          return {
            ...p,
            isUpvoted,
            upvotes: isUpvoted ? p.upvotes + 1 : p.upvotes - 1
          };
        }
        return p;
      })
    );
    if (activePost && activePost.id === postId) {
      const isUpvoted = !activePost.isUpvoted;
      setActivePost({
        ...activePost,
        isUpvoted,
        upvotes: isUpvoted ? activePost.upvotes + 1 : activePost.upvotes - 1
      });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const tags = newTagInput
      ? newTagInput.split(',').map(t => t.trim()).filter(Boolean)
      : ['A/L 2026', newSubject];

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      authorName: profile?.name || 'Anonymous Student',
      authorAvatar: profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      authorBadge: profile?.district ? `${profile.district} Student` : 'Student',
      createdAt: 'Just now',
      stream: profile?.stream || 'Physical Science (Maths)',
      subjectName: newSubject,
      title: newTitle,
      content: newContent,
      upvotes: 1,
      isUpvoted: true,
      solved: false,
      tags,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setIsAskModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTagInput('');
    addXP(40);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent || !activePost) return;

    const newReply = {
      id: `rep_${Date.now()}`,
      authorName: profile?.name || 'Student',
      authorAvatar: profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      authorRole: 'Student' as const,
      createdAt: 'Just now',
      content: replyContent,
      upvotes: 0
    };

    const updatedPost = {
      ...activePost,
      replies: [...activePost.replies, newReply]
    };

    setActivePost(updatedPost);
    setPosts(prev => prev.map(p => (p.id === activePost.id ? updatedPost : p)));
    setReplyContent('');
    addXP(25);
  };

  const filteredPosts = posts.filter(post => {
    const matchSubject = selectedSubject === 'All' || post.subjectName === selectedSubject;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubject && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span>ශිෂ්‍ය සංසදය & ගැටලු සාකච්ඡාව</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ask questions, collaborate with peers, and get verified solutions from teachers & campus seniors.
          </p>
        </div>

        <button
          id="open-ask-modal-btn"
          onClick={() => setIsAskModalOpen(true)}
          className="py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>ගැටලුවක් යොමු කරන්න (Ask a Doubt)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, keywords, tags..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedSubject === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Subjects
          </button>
          {['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accounting'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedSubject === sub
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setActivePost(post)}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 rounded-3xl p-5 sm:p-6 shadow-xs transition cursor-pointer space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {post.authorName}
                    </span>
                    {post.authorBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold">
                        {post.authorBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{post.createdAt} • {post.subjectName}</span>
                </div>
              </div>

              {post.solved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Action Footers */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleUpvote(post.id, e)}
                  className={`flex items-center gap-1 font-semibold transition ${
                    post.isUpvoted ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.isUpvoted ? 'fill-blue-600' : ''}`} />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.replies.length} Answers</span>
                </div>
              </div>

              <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                View Discussion & Solve →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Question Details / Answers Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {activePost.subjectName}
                </span>
                {activePost.solved && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    • Solved
                  </span>
                )}
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {activePost.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {activePost.content}
                </p>
              </div>

              {/* Answers list */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  පිළිතුරු සහ විවරණ ({activePost.replies.length} Answers):
                </h4>

                {activePost.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      reply.isVerifiedAnswer
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {reply.authorRole} • {reply.createdAt}
                          </span>
                        </div>
                      </div>

                      {reply.isVerifiedAnswer && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Answer
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Input */}
            <form
              onSubmit={handleAddReply}
              className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="ඔබේ පිළිතුර හෝ උපදෙස ලියන්න... (Write your answer)"
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                නව ගැටලුවක් යොමු කරන්න (Ask a Doubt)
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  විෂය (Subject)
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="Combined Mathematics">Combined Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Information Technology (ICT)">ICT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  ගැටලුවේ මාතෘකාව (Question Title)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="උදා: 2024 Past Paper Q12 Integration doubt"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  ගැටලුව පැහැදිලි කරන්න (Detailed Question Content)
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="ඔබට නොතේරුණු පියවර සහ උපකාර අවශ්‍ය කොටස විස්තර කරන්න..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  ටැග් (Tags separated by commas)
                </label>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="A/L 2026, Calculus, Mechanics"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Post Question (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
