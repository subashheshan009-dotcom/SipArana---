import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Phone,
  Settings,
  Heart,
  Smile,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  Share2,
  Calendar,
  Clock,
  Zap,
  Award,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import {
  getParentChatMessages,
  saveParentChatMessages,
  getParentContactInfo,
  saveParentContactInfo,
  type ParentChatMessage,
  type ParentContactInfo,
  type WeeklyStudyReport,
  sendWeeklyReportToParentChat
} from '@/services/weeklyReportService';
import { WeeklyProgressPostCard } from './WeeklyProgressPostCard';
import { soundFX } from '@/utils/audioUtils';
import confetti from 'canvas-confetti';

interface InAppParentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReport?: WeeklyStudyReport | null;
  onRefreshReport?: () => void;
}

export const InAppParentChatModal: React.FC<InAppParentChatModalProps> = ({
  isOpen,
  onClose,
  currentReport,
  onRefreshReport
}) => {
  const [messages, setMessages] = useState<ParentChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [parentContact, setParentContact] = useState<ParentContactInfo>(getParentContactInfo());
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');

  // Contact form state
  const [tempContact, setTempContact] = useState<ParentContactInfo>(parentContact);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages(getParentChatMessages());
      setParentContact(getParentContactInfo());
      setTempContact(getParentContactInfo());
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen to external broadcast events (e.g. from post card "Send Report to Parent")
  useEffect(() => {
    const handleReportSent = () => {
      setMessages(getParentChatMessages());
    };
    window.addEventListener('siparana_parent_chat_updated', handleReportSent);
    return () => window.removeEventListener('siparana_parent_chat_updated', handleReportSent);
  }, []);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    soundFX.playPop();
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ParentChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      senderName: 'Student',
      text,
      timestamp: Date.now(),
      timeFormatted: `Today ${timeFormatted}`
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveParentChatMessages(updated);
    setInputText('');

    // Simulate parent warm response after 1.5s
    setTimeout(() => {
      soundFX.playCorrect();
      const parentReplies = [
        "Very proud of you, putha! ❤️ Remember to take rest and drink water too.",
        "Saw your study report, amazing progress on your Maths and Science! Keep it going! 🌟",
        "Wonderful score on the quiz! Let's get ice cream this weekend to celebrate. 🍦",
        "You're doing great! Let me know if you need any study materials printed. 📚"
      ];
      const randomReply = parentReplies[Math.floor(Math.random() * parentReplies.length)];

      const parentMsg: ParentChatMessage = {
        id: `msg_parent_${Date.now()}`,
        sender: 'parent',
        senderName: parentContact.parentName,
        text: randomReply,
        timestamp: Date.now(),
        timeFormatted: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        reactions: ['❤️', '👏']
      };

      const withParent = [...updated, parentMsg];
      setMessages(withParent);
      saveParentChatMessages(withParent);
    }, 1200);
  };

  const handleSendReportNow = () => {
    if (!currentReport) return;
    soundFX.playFanfare();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 }
    });
    sendWeeklyReportToParentChat(currentReport);
    setMessages(getParentChatMessages());
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playCorrect();
    saveParentContactInfo(tempContact);
    setParentContact(tempContact);
    setIsEditingContact(false);
    setActiveTab('chat');
  };

  const handlePraiseReaction = (reaction: string) => {
    soundFX.playClick();
    handleSendMessage(`${reaction} (Praise Reaction)`);
  };

  return (
    <div
      id="in-app-parent-chat-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[90vh] max-h-[780px] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white text-lg font-black shadow-md shadow-rose-500/20">
                👩‍👦
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {parentContact.parentName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                  Parent Link
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {parentContact.parentPhone} • Direct In-App Chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="chat-toggle-settings-btn"
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab(activeTab === 'chat' ? 'settings' : 'chat');
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Parent Contact Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              id="close-parent-chat-modal"
              type="button"
              onClick={() => {
                soundFX.playPop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'settings' ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Parent Account & Contact Details</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure registered parent names and phone numbers for automated Sunday digest dispatch and notifications.
              </p>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent or Guardian Name
                </label>
                <input
                  type="text"
                  value={tempContact.parentName}
                  onChange={(e) => setTempContact({ ...tempContact, parentName: e.target.value })}
                  placeholder="e.g. Amma & Thatha / Mrs. Nilmini Perera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={tempContact.parentRelationship}
                    onChange={(e) => setTempContact({ ...tempContact, parentRelationship: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mom">Mother (Amma)</option>
                    <option value="Dad">Father (Thatha)</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Tutor">Personal Tutor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={tempContact.parentPhone}
                    onChange={(e) => setTempContact({ ...tempContact, parentPhone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Email (Optional)
                </label>
                <input
                  type="email"
                  value={tempContact.parentEmail}
                  onChange={(e) => setTempContact({ ...tempContact, parentEmail: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Parent Profile
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Action Notice Bar if report hasn't been sent yet */}
            {currentReport && !currentReport.isSentToParent && (
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
                  <span className="text-xs font-bold truncate">
                    Sunday Study Report is ready to dispatch to {parentContact.parentName}!
                  </span>
                </div>
                <button
                  onClick={handleSendReportNow}
                  className="px-3 py-1 rounded-lg bg-white text-blue-900 font-black text-xs hover:bg-blue-50 transition cursor-pointer flex-shrink-0 shadow-sm"
                >
                  Dispatch Report 🚀
                </button>
              </div>
            )}

            {/* Chat Message List */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
              {messages.map((msg) => {
                const isStudent = msg.sender === 'student';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="space-y-3">
                      <div className="flex items-center justify-center gap-2 my-2">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">
                          {msg.timeFormatted}
                        </span>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                      </div>

                      <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-center text-xs text-blue-900 dark:text-blue-200 max-w-md mx-auto space-y-1">
                        <p className="font-semibold">{msg.text}</p>
                      </div>

                      {/* Embedded Weekly Report Card if present */}
                      {msg.isReportCard && msg.reportCardData && (
                        <div className="my-3">
                          <WeeklyProgressPostCard report={msg.reportCardData} compact={true} />
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1 px-1">
                      <span>{isStudent ? 'You (Student)' : msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timeFormatted}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isStudent
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-black/10 dark:border-white/10">
                          {msg.reactions.map((emoji, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 dark:bg-white/10"
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Parent Praise Chips */}
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                Praise Reactions:
              </span>
              {[
                { label: 'Proud of you! ❤️', text: 'Proud of you! ❤️ Keep going strong!' },
                { label: 'Great Focus! 🎯', text: 'Great study focus this week! 🎯' },
                { label: 'Good luck with exams! 📚', text: 'Good luck with your exams! 📚' },
                { label: 'Ice cream treat! 🍦', text: 'You earned a treat this weekend! 🍦' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePraiseReaction(chip.text)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-[11px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap transition cursor-pointer flex-shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input Field */}
            <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                id="parent-chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${parentContact.parentName}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                id="btn-send-chat-message"
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
