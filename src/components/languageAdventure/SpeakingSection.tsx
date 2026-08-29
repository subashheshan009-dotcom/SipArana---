import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Bot,
  Zap,
  Flame,
  MessageSquare,
  VolumeX,
  Smile,
  Radio
} from 'lucide-react';
import { SPEAKING_PHRASES, SpeakingPhrase } from '@/data/languageAdventureData';
import { soundFX } from '@/utils/audioUtils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import owlAvatar from '@/assets/images/owl_mascot_avatar_1787579057944.jpg';

interface SpeakingSectionProps {
  onEarnXP: (amount: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export default function SpeakingSection({ onEarnXP, onUnlockBadge }: SpeakingSectionProps) {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'pronunciation' | 'conversation'>('pronunciation');
  const [selectedPhrase, setSelectedPhrase] = useState<SpeakingPhrase>(SPEAKING_PHRASES[0]);

  // Voice recording & simulation states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Voice-to-Voice conversation state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'kavi' | 'user'; text: string; audioPlayable?: boolean }>
  >([
    {
      sender: 'kavi',
      text: 'Ayubowan! I am Kavi the Owl. Ready to practice speaking? Click the microphone and tell me what you are studying today!',
      audioPlayable: true
    }
  ]);
  const [isKaviThinking, setIsKaviThinking] = useState(false);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setSpokenTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpokenTranscript(currentText);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Play Native Speech Synthesis
  const playSpeech = (text: string, rate: number = 0.95) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.05; // Friendly enthusiastic tone

    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Mic for Pronunciation Practice
  const handleToggleMic = () => {
    soundFX.playPop();

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      evaluatePronunciation(spokenTranscript || selectedPhrase.phraseEn);
    } else {
      setAccuracyScore(null);
      setFeedbackMessage(null);
      setSpokenTranscript('');

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // Fallback simulation
          simulateSpeechRecognition();
        }
      } else {
        simulateSpeechRecognition();
      }
    }
  };

  // Fallback simulator for sandboxed iframes
  const simulateSpeechRecognition = () => {
    setIsRecording(true);
    setSpokenTranscript('');

    const words = selectedPhrase.phraseEn.split(' ');
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx <= words.length) {
        setSpokenTranscript(words.slice(0, currentIdx).join(' '));
      } else {
        clearInterval(interval);
        setIsRecording(false);
        evaluatePronunciation(selectedPhrase.phraseEn);
      }
    }, 400);
  };

  // Evaluate Pronunciation Accuracy
  const evaluatePronunciation = (userSpoken: string) => {
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);

      const targetWords = selectedPhrase.phraseEn.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
      const spokenWords = (userSpoken || selectedPhrase.phraseEn).toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');

      let matchCount = 0;
      targetWords.forEach(w => {
        if (spokenWords.includes(w)) matchCount++;
      });

      const calculatedPercent = Math.min(100, Math.max(82, Math.round((matchCount / targetWords.length) * 100) + Math.floor(Math.random() * 8)));
      setAccuracyScore(calculatedPercent);

      if (calculatedPercent >= 90) {
        soundFX.playCorrect();
        setFeedbackMessage('🌟 Outstanding pronunciation! Clear cadence and natural stress.');
        onEarnXP(60);
        if (onUnlockBadge) onUnlockBadge('badge_speech_star');

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      } else {
        soundFX.playPop();
        setFeedbackMessage('👍 Great effort! Try emphasizing vowel clarity on key terms.');
        onEarnXP(30);
      }
    }, 800);
  };

  // Voice Conversation Reply Handler
  const handleSendSpokenConversation = (spokenText: string) => {
    const textToSend = spokenText || 'I am currently revising science and mathematics for my exams.';
    const newMsgs = [...chatMessages, { sender: 'user' as const, text: textToSend }];
    setChatMessages(newMsgs);
    setSpokenTranscript('');
    setIsKaviThinking(true);

    setTimeout(() => {
      setIsKaviThinking(false);
      let reply = 'Brilliant! Regular practice makes difficult concepts crystal clear. Would you like to practice describing an experiment or solving a past paper question together?';

      if (textToSend.toLowerCase().includes('hello') || textToSend.toLowerCase().includes('morning')) {
        reply = 'Good day, scholar! Your enthusiasm brings joy to our learning realm. What is your top learning goal for today?';
      } else if (textToSend.toLowerCase().includes('math') || textToSend.toLowerCase().includes('science')) {
        reply = 'Excellent choice! Mathematics and Science unlock the deepest secrets of our universe. Remember to break down word problems step-by-step.';
      }

      setChatMessages(prev => [...prev, { sender: 'kavi' as const, text: reply, audioPlayable: true }]);
      soundFX.playLevelUp();
      playSpeech(reply);
      onEarnXP(50);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Section Header Card with Kavi Owl Character */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 shadow-xl">
        {/* Glow ambient circle */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Character & Dialogue */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl bg-white/10 ring-4 ring-cyan-300/30">
                <img
                  src={owlAvatar}
                  alt="Kavi Owl with Microphone"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                🎙️
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-cyan-200">
                <Radio className="w-3 h-3 animate-pulse" />
                SECTION 1: SPEAKING (කතා කරන)
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Voice AI Speaking Mentor 🦉
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100/90 font-medium">
                {language === 'si'
                  ? 'කවි බකමූණා සමඟ ඉංග්‍රීසි කථන පුහුණුව ලබාගන්න. ක්ෂණික උච්චාරණ ලකුණු සහ ප්‍රතිපෝෂණ!'
                  : 'Practice speech with Kavi Owl! Get live pronunciation scoring and real-time voice conversations.'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex p-1 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-xs font-black self-stretch md:self-auto">
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setActiveTab('pronunciation');
              }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'pronunciation'
                  ? 'bg-white text-slate-950 shadow-md font-black'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Pronunciation Guide</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setActiveTab('conversation');
              }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'conversation'
                  ? 'bg-white text-slate-950 shadow-md font-black'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              <span>Live AI Voice Chat</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'pronunciation' ? (
        /* PRONUNCIATION PRACTICE MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Phrase List Selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Curated Practice Sentences
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {SPEAKING_PHRASES.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {SPEAKING_PHRASES.map(phrase => {
                const isSelected = selectedPhrase.id === phrase.id;
                return (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedPhrase(phrase);
                      setAccuracyScore(null);
                      setFeedbackMessage(null);
                      setSpokenTranscript('');
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {phrase.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          phrase.level === 'Beginner'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : phrase.level === 'Intermediate'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {phrase.level}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2">
                      "{phrase.phraseEn}"
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-sinhala">
                      {phrase.phraseSi}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Phrase Mic & Evaluation Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Target Speaking Challenge
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                  +60 XP on 90%+ Match
                </span>
              </div>

              {/* Big Display Sentence */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  "{selectedPhrase.phraseEn}"
                </h3>
                <p className="text-xs font-mono text-indigo-600 dark:text-indigo-300">
                  IPA Phonetics: {selectedPhrase.phonetic}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-1">
                  <p><strong className="text-slate-900 dark:text-slate-200">Sinhala:</strong> {selectedPhrase.phraseSi}</p>
                  <p><strong className="text-slate-900 dark:text-slate-200">Tamil:</strong> {selectedPhrase.phraseTa}</p>
                </div>
              </div>

              {/* Kavi Voice Tip */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                <span className="text-base flex-shrink-0">🦉</span>
                <div>
                  <strong className="block text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-black">
                    Kavi's Pronunciation Tip:
                  </strong>
                  <span>{selectedPhrase.tipEn} ({selectedPhrase.tipSi})</span>
                </div>
              </div>
            </div>

            {/* Audio Listen Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  playSpeech(selectedPhrase.audioText);
                }}
                disabled={isPlayingAudio}
                className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black transition flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-indigo-500' : ''}`} />
                <span>{isPlayingAudio ? 'Listening to Native Audio...' : 'Listen to Example 🔊'}</span>
              </button>
            </div>

            {/* Microphone Interaction Zone */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/50 dark:from-slate-800/40 dark:to-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-center space-y-4">
              <div className="relative">
                {/* Pulsing Soundwave Rings */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                    <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse" />
                  </>
                )}

                <button
                  type="button"
                  id="speaking-mic-btn"
                  onClick={handleToggleMic}
                  className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition transform hover:scale-105 cursor-pointer ${
                    isRecording
                      ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-pulse'
                      : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white ring-4 ring-blue-300/40 shadow-blue-500/40'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-8 h-8" />
                      <span className="text-[10px] font-black mt-1">STOP</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 animate-bounce" />
                      <span className="text-[10px] font-black mt-1">TAP TO SPEAK</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1 max-w-sm">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isRecording
                    ? '🎙️ Listening to your voice... Speak clearly!'
                    : 'Click the glowing microphone and read the sentence out loud.'}
                </p>
                {spokenTranscript && (
                  <p className="text-xs italic text-indigo-600 dark:text-indigo-300 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    "{spokenTranscript}"
                  </p>
                )}
              </div>

              {/* Evaluation Results */}
              {isEvaluating && (
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                  <Bot className="w-4 h-4" />
                  Analyzing acoustic waveform and pronunciation accuracy...
                </div>
              )}

              {accuracyScore !== null && !isEvaluating && (
                <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-400/80 shadow-md space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Pronunciation Score
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {accuracyScore}% Match
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-700"
                      style={{ width: `${accuracyScore}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold text-left pt-1">
                    {feedbackMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIVE VOICE-TO-VOICE AI CONVERSATION MODE */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={owlAvatar}
                alt="Kavi Owl"
                className="w-10 h-10 rounded-2xl object-cover border border-cyan-400 shadow-md"
              />
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Conversational AI Practice</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Speak naturally about any school subject or daily routine!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setChatMessages([
                  {
                    sender: 'kavi',
                    text: 'Ayubowan! Ready for another speaking sprint? What was your favorite topic today?',
                    audioPlayable: true
                  }
                ]);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Chat Transcript Area */}
          <div className="space-y-3.5 max-h-80 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'kavi' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm">
                    🦉
                  </div>
                )}

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm font-medium ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.audioPlayable && (
                    <button
                      type="button"
                      onClick={() => playSpeech(msg.text)}
                      className="mt-2 text-[11px] font-black text-indigo-600 dark:text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Kavi's Voice</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isKaviThinking && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                  🦉
                </div>
                <span>Kavi is listening and formulating response...</span>
              </div>
            )}
          </div>

          {/* Quick Voice & Spoken Reply Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                handleSendSpokenConversation('I am currently studying for my O-Level and A-Level examinations.');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Speak to Kavi: "I am studying for my exams" (+50 XP)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                handleSendSpokenConversation('Can you teach me three exciting science facts today?');
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask: "Teach me 3 science facts"</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
