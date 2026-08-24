import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Zap,
  GraduationCap,
  MessageSquare,
  Bot,
  User,
  FileText,
  UploadCloud,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import FilePermissionHelperModal from '@/components/FilePermissionHelperModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  subjectTag?: string;
  attachedImage?: string;
  attachedPdfName?: string;
}

export default function AITutorPage() {
  const { profile, addXP } = useAuth();
  const { language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `ආයුබෝවන් ${profile?.name || 'ශිෂ්‍යයා'}! මම සිප්අරණ ගුරු සහකාර AI Tutor (SipArana Guru Bot). ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (NIE Guru Potha) ඕනෑම විෂයක ගැටලුවක්, සූත්‍රයක්, පසුගිය විභාග ප්‍රශ්නයක් හෝ සිද්ධාන්තයක් පිළිබඳව මගෙන් අසන්න. ඔබට Voice (හඬ මගින්) හෝ Text (ලියමින්) ප්‍රශ්න විමසිය හැක! 🎙️✍️`,
      timestamp: 'Just now',
      subjectTag: 'General'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(profile?.stream === 'Physical Science (Maths)' ? 'Combined Mathematics' : 'Science');
  const [selectedGrade, setSelectedGrade] = useState<number>(profile?.grade || 12);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice Recognition (Web Speech API)
  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Speech Recognition is not supported by your browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-Speech Playback
  const handleSpeakText = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const query = promptToSend || inputQuery.trim();
    if (!query && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedImage: attachedImage || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      // Call Server-Side Gemini API School Tutor Endpoint
      const response = await fetch('/api/gemini/school-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          grade: selectedGrade,
          subject: selectedSubject,
          stream: profile?.stream || 'General',
          medium: profile?.medium || 'Sinhala',
        }),
      });

      const data = await response.json();
      const aiResponseText = data.text || 'Unable to retrieve answer. Please try again.';

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subjectTag: selectedSubject
      };

      setMessages((prev) => [...prev, aiMsg]);
      addXP(20);
    } catch {
      // Offline fallback
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `### 📚 සිප්අරණ ගුරු සහකාර (SipArana Guru Bot)\n\n**විෂය:** ${selectedSubject} • ${selectedGrade} ශ්‍රේණිය\n\nඔබ ඇසූ ප්‍රශ්නය: "${query}"\n\n1. **ප්‍රධාන සිද්ධාන්තය:** ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (Guru Potha) මෙම ඒකකයට අදාළ මූලික නීති සහ සූත්‍ර නිවැරදිව භාවිත කරන්න.\n2. **විභාග උපදෙස:** පසුගිය වසරවල ප්‍රශ්න පත්‍රවල (2019-2024) මෙවැනි ගැටලු පියවරෙන් පියවර ලියා ලකුණු ලබා ගැනීමේ ක්‍රමවේදය (Marking Scheme) අනුගමනය කරන්න.\n3. **ප්‍රායෝගික නිදසුන:** විද්‍යාත්මක හෝ ගණිතමය ඒකක (SI Units) සැමවිටම නිවැරදිව සඳහන් කරන්න.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subjectTag: selectedSubject
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processIncomingFile = (file: File) => {
    setFileError(null);
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size is larger than 10MB. Please attach a smaller image or document.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setFileError('Supported files: Images (JPG, PNG, WEBP) or PDF documents.');
      setShowPermissionModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
      setAttachedFileName(file.name);
    };
    reader.onerror = () => {
      setFileError('Failed to read file from your device. Check storage permissions.');
      setShowPermissionModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processIncomingFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processIncomingFile(file);
    }
  };

  const PROMPT_SUGGESTIONS = [
    { label: 'Newton\'s 2nd Law (F=ma)', text: 'Explain Newton\'s Second Law of Motion with derivation and exam examples in Sinhala.' },
    { label: 'Markovnikov\'s Rule', text: 'Explain Markovnikov\'s Rule in Organic Chemistry with reaction mechanism for Propene + HBr.' },
    { label: 'Definite Integration', text: 'How do I solve definite integration by substitution with change of limits?' },
    { label: 'Z-Score Formula', text: 'How is university Z-Score calculated in Sri Lanka? Explain standard deviation and mean.' },
    { label: 'Mitosis vs Meiosis', text: 'What are the main differences between Mitosis and Meiosis cell division for A/L Biology?' },
    { label: 'Quadratic Roots', text: 'Explain how to find quadratic equation roots using discriminant Δ = b² - 4ac.' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold backdrop-blur-sm">
            <Bot className="w-4 h-4" />
            <span>AI Guru Bot & Voice Tutor (හඬ සහායක ගුරු රොබෝ)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            සිප්අරණ AI ගුරු සහකාර (Interactive AI Tutor)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Ask any question across Grade 6–13 & University curricula. Speak your doubts or type equations to get instant, syllabus-aligned explanations with voice speech reading!
          </p>
        </div>

        {/* Context Controls Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 relative z-10 text-xs">
          <div>
            <label className="text-[10px] text-blue-200 font-bold block mb-1">Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-900 text-white font-bold p-2 rounded-xl text-xs border border-white/20 focus:outline-none"
            >
              <option value="Combined Mathematics">Combined Maths</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Science">O/L Science</option>
              <option value="Mathematics">O/L Maths</option>
              <option value="ICT">ICT</option>
              <option value="Accounting">Accounting</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-blue-200 font-bold block mb-1">Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="bg-slate-900 text-white font-bold p-2 rounded-xl text-xs border border-white/20 focus:outline-none"
            >
              {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1 whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Quick Questions:
        </span>
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.text)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold whitespace-nowrap transition cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    {msg.attachedImage && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/20 max-h-48 max-w-sm">
                        <img src={msg.attachedImage} alt="Uploaded Problem" className="w-full object-cover" />
                      </div>
                    )}
                    {msg.text}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          title={isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
                          className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 font-bold ${
                            isSpeaking ? 'text-amber-500' : 'text-slate-500'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isSpeaking ? 'Playing...' : 'Listen'}</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          title="Copy text"
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-3xl rounded-tl-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2">
                  Guru Bot is analyzing Sri Lankan curriculum references...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {fileError && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fileError}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionModal(true)}
                className="underline font-bold text-[11px]"
              >
                Need Help?
              </button>
            </div>
          )}

          {attachedImage && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {attachedFileName?.toLowerCase().endsWith('.pdf') ? (
                <FileText className="w-4 h-4 text-rose-500" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              <span className="font-semibold truncate">
                {attachedFileName ? `Attached: ${attachedFileName}` : 'Diagram Attached for OCR Problem Solving'}
              </span>
              <button
                onClick={() => {
                  setAttachedImage(null);
                  setAttachedFileName(null);
                }}
                className="ml-auto text-rose-500 font-bold px-1.5 py-0.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Hidden file input with proper accept attribute */}
            <input
              id="ai-tutor-file-picker-input"
              type="file"
              ref={fileInputRef}
              accept="image/*, application/pdf"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Camera / Diagram / PDF Attachment */}
            <button
              id="ai-tutor-camera-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Problem Diagram, Photo, or PDF Notes"
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-500 transition cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Voice Input Mic Button */}
            <button
              onClick={handleToggleVoiceInput}
              title={isListening ? 'Stop recording' : 'Voice Input (කතා කර අසන්න)'}
              className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:border-amber-500'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening to your voice (කන් දෙමින් පවතී)...'
                  : 'Type your question or formula (e.g. Derive Bernoulli equation in Sinhala)...'
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
            />

            {/* Send Button */}
            <button
              disabled={isLoading || (!inputQuery.trim() && !attachedImage && !attachedFileName)}
              onClick={() => handleSendMessage()}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      <FilePermissionHelperModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        type="upload"
      />
    </div>
  );
}
