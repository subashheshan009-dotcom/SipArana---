export interface ModernSubjectLesson {
  id: string;
  lessonNumber: number;
  title: {
    en: string;
    si: string;
    ta: string;
  };
  duration: string;
  niePeriodCount: number;
  summary: {
    en: string;
    si: string;
    ta: string;
  };
  keyPoints: {
    en: string[];
    si: string[];
    ta: string[];
  };
  practicalActivity?: {
    en: string;
    si: string;
    ta: string;
  };
  examTip?: {
    en: string;
    si: string;
    ta: string;
  };
}

export interface ModernSubjectUnit {
  id: string;
  unitNumber: number;
  competencyLevel: string;
  title: {
    en: string;
    si: string;
    ta: string;
  };
  description: {
    en: string;
    si: string;
    ta: string;
  };
  allocatedPeriods: number;
  lessons: ModernSubjectLesson[];
}

export interface VocabularyItem {
  id: string;
  term: string; // Foreign script or technical term (e.g. こんにちは, 안녕하세요, Algorithm)
  transcription?: string; // Romaji, Hangul pronunciation, or Pinyin (e.g. Konnichiwa, Annyeonghaseyo)
  meaning: {
    si: string;
    en: string;
    ta: string;
  };
  exampleSentence?: {
    original: string;
    translationSi: string;
    translationEn: string;
  };
  audioLangCode?: string; // 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'hi-IN', 'zh-CN', 'ru-RU', 'en-US'
}

export interface ModernSubjectQuizQuestion {
  id: string;
  question: {
    si: string;
    en: string;
    ta: string;
  };
  options: {
    si: string[];
    en: string[];
    ta: string[];
  };
  correctIndex: number;
  explanation: {
    si: string;
    en: string;
    ta: string;
  };
}

export interface ModernSubject {
  id: string;
  code: string;
  categoryType: 'modern_tech' | 'foreign_language';
  levels: ('junior' | 'ol' | 'al')[];
  gradeRange: string;
  flagOrIcon: string;
  title: {
    en: string;
    si: string;
    ta: string;
  };
  nativeTitle: string; // e.g. "日本語", "한국어", "Français", "Information Technology"
  badge: {
    si: string;
    en: string;
  };
  themeColor: string;
  gradientBg: string;
  borderColor: string;
  textColor: string;
  description: {
    si: string;
    en: string;
    ta: string;
  };
  introductionKaviVoice: {
    si: string;
    en: string;
  };
  officialGuideRef: string;
  units: ModernSubjectUnit[];
  vocabularyList: VocabularyItem[];
  modelQuestions: ModernSubjectQuizQuestion[];
  quickCheatSheet: {
    title: { si: string; en: string };
    rules: { si: string; en: string }[];
  };
}

export const MODERN_CURRICULUM_DATA: ModernSubject[] = [
  // ==========================================
  // 1. JAPANESE LANGUAGE (ජපන් භාෂාව - 日本語)
  // ==========================================
  {
    id: 'subj-foreign-japanese',
    code: 'FL-JPN-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (O/L & A/L)',
    flagOrIcon: '🇯🇵',
    title: {
      en: 'Japanese Language (Nihongo)',
      si: 'ජපන් භාෂාව (නිහොන්ගෝ)',
      ta: 'ஜப்பானிய மொழி (Nihongo)'
    },
    nativeTitle: '日本語 (Japanese)',
    badge: {
      si: 'නව අධ්‍යාපන ප්‍රතිසංස්කරණ විෂය',
      en: 'National Reforms & JLPT Aligned'
    },
    themeColor: 'rose',
    gradientBg: 'from-rose-500/10 via-pink-500/5 to-amber-500/10 dark:from-rose-950/40 dark:to-pink-950/30',
    borderColor: 'border-rose-300 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-400',
    description: {
      si: 'ජාතික අධ්‍යාපන ආයතනයේ නව විෂය නිර්දේශයට අනුව හිරගනා (Hiragana), කතකනා (Katakana), මූලික කන්ජි (Kanji), වාක්‍ය ව්‍යාකරණ (Particles は, が, を, に, で) සහ සංවාද කුසලතා සම්පූර්ණයෙන්ම ආවරණය කරයි.',
      en: 'Comprehensive Sri Lankan national school curriculum for Japanese covering Hiragana, Katakana, basic Kanji, grammar particles (wa, ga, o, ni, de), JLPT N5/N4 alignment, and conversational skills.',
      ta: 'ஹிரகானா, கதகானா, காஞ்சி எழுத்துக்கள் மற்றும் இலக்கண விதிகளை உள்ளடக்கிய உத்தியோகபூர்ව பாடத்திட்டம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, ජපන් භාෂාව හරිම ලස්සන භාෂාවක්! මුලින්ම හිරගනා අකුරු 46 ඉගෙන ගෙන සරල වාක්‍ය හදන්න පටන් ගනිමු. මම ඔයාට උච්චාරණයත් කියලා දෙන්නම්!',
      en: 'Kavi says: Japanese is fun and beautiful! Master the 46 Hiragana characters first, and let us build your first conversation with polite greetings!'
    },
    officialGuideRef: 'NIE G.C.E. A/L & O/L Foreign Languages Curriculum Dept. / JLPT N5-N4 Benchmark',
    units: [
      {
        id: 'jp-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Japanese Phonetics & Writing Systems (Hiragana & Katakana)',
        title: {
          si: 'ඒකකය 01: ජපන් අක්ෂර මාලාව සහ මූලික ආචාර විධි (Greetings)',
          en: 'Unit 01: Japanese Writing Systems & Essential Etiquette',
          ta: 'அலகு 01: ஜப்பானிய எழுத்துக்கள் & முகமன் கூறுதல்'
        },
        description: {
          si: 'හිරගනා (Hiragana) අක්ෂර 46, කතකනා (Katakana) විදේශීය වචන ලිවීමේ ක්‍රමය, සහ දෛනික ආචාර සමාචාර.',
          en: 'Mastery of 46 basic Hiragana characters, Katakana for loanwords, and essential daily Japanese greetings.',
          ta: 'ஹிரகானா மற்றும் கதகானா எழுத்துக்கள்.'
        },
        allocatedPeriods: 12,
        lessons: [
          {
            id: 'jp-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'හිරගනා අක්ෂර සහ මූලික ස්වර (あ, い, う, え, お)',
              en: 'Hiragana Vowels & The 5 Core Sounds (a, i, u, e, o)',
              ta: 'ஹிரகானா உயிரெழுத்துக்கள் (a, i, u, e, o)'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'ජපන් භාෂාවේ සියලුම ශබ්ද පදනම් වන්නේ A, I, U, E, O යන ස්වර 5 මතය. අක්ෂර නිවැරදිව පේළි අනුපිළිවෙලට (Stroke Order) ලිවීම අත්‍යවශ්‍ය වේ.',
              en: 'All Japanese phonetic combinations stem from the 5 base vowels: a, i, u, e, o. Stroke order is vital for neat calligraphy.',
              ta: 'ஜப்பானிய மொழியின் 5 முக்கிய உயிரெழுத்துக்கள்.'
            },
            keyPoints: {
              si: [
                'ස්වර 5: あ (a), い (i), う (u), え (e), お (o)',
                'K-පේළිය: か (ka), き (ki), く (ku), け (ke), こ (ko)',
                'S-පේළිය: さ (sa), し (shi), す (su), せ (se), そ (so)',
                'T-පේළිය: た (ta), ち (chi), つ (tsu), て (te), と (to)'
              ],
              en: [
                '5 Base Vowels: あ (a), い (i), う (u), え (e), お (o)',
                'K-row: か (ka), き (ki), く (ku), け (ke), こ (ko)',
                'S-row: さ (sa), し (shi), す (su), せ (se), そ (so)',
                'T-row: た (ta), ち (chi), つ (tsu), て (te), と (to)'
              ],
              ta: ['5 முக்கிய உயிரெழுத்துக்கள்: a, i, u, e, o']
            },
            practicalActivity: {
              si: 'අභ්‍යාස පොතේ එක් එක් හිරගනා අකුර 5 වතාවක් නිවැරදි Stroke Order එකට ලියා උච්චාරණය කරන්න.',
              en: 'Write each Hiragana character 5 times in your notebook following exact stroke order rules.',
              ta: 'ஒவ்வொரு எழுத்தையும் 5 முறை எழுதிப் பழகுக.'
            },
            examTip: {
              si: 'විභාගයේදී Katakana අක්ෂර වන シ (shi) සහ ツ (tsu), ソ (so) සහ ン (n) අතර වෙනස පැහැදිලිව හඳුනාගන්න.',
              en: 'In exams, take care not to confuse Katakana シ (shi) vs ツ (tsu), and ソ (so) vs ン (n).',
              ta: 'பரீட்சையில் எழுத்துக்களைத் தெளிவாக எழுதுங்கள்.'
            }
          },
          {
            id: 'jp-u1-l2',
            lessonNumber: 2,
            title: {
              si: 'ස්වයං හැඳින්වීම (Jikoshoukai) සහ මූලික නිපාත (Particle は)',
              en: 'Self-Introduction (Jikoshoukai) & Topic Particle [Wa - は]',
              ta: 'சுய அறிமுகம் மற்றும் இலக்கணம்'
            },
            duration: '30 mins',
            niePeriodCount: 4,
            summary: {
              si: 'ජපන් භාෂාවෙන් තමන්ව හඳුන්වා දීමේදී "Hajimemashite" (ආයුබෝවන්/පළමුව හමුවීම), "Watashi wa [නම] desu", සහ "Douzo yoroshiku onegaishimasu" (කාරුණිකව පිළිගන්න) භාවිතා කරයි.',
              en: 'Self-introduction formula in Japanese: Hajimemashite (Nice to meet you), Watashi wa [Name] desu, Douzo yoroshiku onegaishimasu.',
              ta: 'சுய அறிமுக வாக்கிய அமைப்பு.'
            },
            keyPoints: {
              si: [
                'ප්‍රධාන වාක්‍ය රටාව: [නාම පදය] + は (wa) + [විස්තරය] + です (desu)',
                'උදා: わたし は කසුන් です。(මම කසුන් වෙමි / I am Kasun)',
                'ප්‍රශ්න ඇසීමේදී අගට か (ka) එකතු වේ: [වාක්‍යය] + ですか (desu ka?)'
              ],
              en: [
                'Basic pattern: [Subject/Topic] + は (wa) + [Predicate] + です (desu)',
                'Example: わたし は 학생 です (Watashi wa gakusei desu - I am a student)',
                'Question marker: Add か (ka) at the end: ...desu ka?'
              ],
              ta: ['வாக்கிய அமைப்பு: எழுவாய் + wa + விபரம் + desu']
            },
            examTip: {
              si: 'Topic marker ලෙස යෙදෙන විට は අකුර ලියන්නේ "ha" අකුරෙන් වුවද උච්චාරණය කරන්නේ "wa" ලෙසයි.',
              en: 'The particle は is written as "ha" but pronounced as "wa" when acting as a grammatical topic marker.',
              ta: 'விதி: は என்பது வாக்கியத்தில் "wa" என உச்சரிக்கப்படும்.'
            }
          }
        ]
      },
      {
        id: 'jp-u2',
        unitNumber: 2,
        competencyLevel: '2.1 - 2.4: Everyday Communication & Particle System (を, に, で, が)',
        title: {
          si: 'ඒකකය 02: දෛනික ක්‍රියාපද සහ නිපාත පද්ධතිය (Particles を, に, で)',
          en: 'Unit 02: Action Verbs, Time & Essential Particles (o, ni, de)',
          ta: 'அலகு 02: தொழிற்பெயர்கள் மற்றும் துகள்கள்'
        },
        description: {
          si: 'කෑම බීම, පාසල් යාම, කාලය දැක්වීම සහ ස්ථානීය නිපාත යොදා ගනිමින් සංයුක්ත වාක්‍ය ගොඩනැගීම.',
          en: 'Building compound sentences for daily routines: eating, going to school, telling time, and location particles.',
          ta: 'தினசரி வாழ்க்கை வாக்கியங்கள் மற்றும் வினைச்சொற்கள்.'
        },
        allocatedPeriods: 16,
        lessons: [
          {
            id: 'jp-u2-l1',
            lessonNumber: 1,
            title: {
              si: 'කර්ම නිපාතය を (o) සහ ක්‍රියාපද (食べる, 飲む, 勉強する)',
              en: 'Object Particle [o - を] & Daily Action Verbs (Tabemasu, Nomimasu)',
              ta: 'செயப்படுபொருள் துகள் [o] & வினைச்சொற்கள்'
            },
            duration: '35 mins',
            niePeriodCount: 4,
            summary: {
              si: 'ක්‍රියාවක් සිදුකරන කර්ම පදය දක්වන්නේ を (o) නිපාතයෙනි. උදා: බත් කනවා = Gohan o tabemasu.',
              en: 'The direct object particle を (pronounced "o") connects what you eat, drink, study, or buy with the corresponding verb.',
              ta: 'செயப்படுபொருளைக் குறிக்கும் துகள் [o].'
            },
            keyPoints: {
              si: [
                'පාන් කනවා → パン を たべます (Pan o tabemasu)',
                'ජලය බොනවා → みず を のみます (Mizu o nomimasu)',
                'පොත් කියවනවා → ほん を よみます (Hon o yomimasu)',
                'ජපන් ඉගෙන ගන්නවා → にほんご を べんきょうします (Nihongo o benkyou shimasu)'
              ],
              en: [
                'Eat bread → Pan o tabemasu',
                'Drink water → Mizu o nomimasu',
                'Read book → Hon o yomimasu',
                'Study Japanese → Nihongo o benkyou shimasu'
              ],
              ta: ['Pan o tabemasu (ரொட்டி சாப்பிடுகிறேன்)']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'jp-voc-1',
        term: 'こんにちは',
        transcription: 'Konnichiwa',
        meaning: {
          si: 'ආයුබෝවන් / සුබ දහවලක්',
          en: 'Hello / Good afternoon',
          ta: 'வணக்கம்'
        },
        exampleSentence: {
          original: 'せんせい、こんにちは！',
          translationSi: 'ගුරුතුමනි, ආයුබෝවන්!',
          translationEn: 'Teacher, hello!'
        },
        audioLangCode: 'ja-JP'
      },
      {
        id: 'jp-voc-2',
        term: 'ありがとう ございます',
        transcription: 'Arigatou gozaimasu',
        meaning: {
          si: 'ඉතාමත්ම ස්තූතියි (ගෞරවනීය)',
          en: 'Thank you very much (polite)',
          ta: 'மிக்க நன்றி'
        },
        exampleSentence: {
          original: 'ほんとうに ありがとうございます。',
          translationSi: 'ඇත්තෙන්ම ඔබට බෙහෙවින් ස්තූතියි.',
          translationEn: 'Thank you very much indeed.'
        },
        audioLangCode: 'ja-JP'
      },
      {
        id: 'jp-voc-3',
        term: 'がくせい',
        transcription: 'Gakusei',
        meaning: {
          si: 'ශිෂ්‍යයා / සිසුවා',
          en: 'Student',
          ta: 'மாணவர்'
        },
        exampleSentence: {
          original: 'わたし は がくせい です。',
          translationSi: 'මම ශිෂ්‍යයෙක් වෙමි.',
          translationEn: 'I am a student.'
        },
        audioLangCode: 'ja-JP'
      },
      {
        id: 'jp-voc-4',
        term: 'せんせい',
        transcription: 'Sensei',
        meaning: {
          si: 'ගුරුතුමා / ගුරුවරිය',
          en: 'Teacher / Professor',
          ta: 'ஆசிரியர்'
        },
        exampleSentence: {
          original: 'たなか せんせい は やさしい です。',
          translationSi: 'තනකා ගුරුතුමා කරුණාවන්තයි.',
          translationEn: 'Teacher Tanaka is kind.'
        },
        audioLangCode: 'ja-JP'
      },
      {
        id: 'jp-voc-5',
        term: 'にほんご',
        transcription: 'Nihongo',
        meaning: {
          si: 'ජපන් භාෂාව',
          en: 'Japanese language',
          ta: 'ஜப்பானிய மொழி'
        },
        exampleSentence: {
          original: 'にほんご は おもしろい です。',
          translationSi: 'ජපන් භාෂාව හරිම රසවත්.',
          translationEn: 'Japanese is interesting.'
        },
        audioLangCode: 'ja-JP'
      },
      {
        id: 'jp-voc-6',
        term: 'さようなら',
        transcription: 'Sayounara',
        meaning: {
          si: 'සමුගනිමි / ආයුබෝවන් (Goodbye)',
          en: 'Goodbye / Farewell',
          ta: 'விடைபெறுகிறேன்'
        },
        exampleSentence: {
          original: 'みなさん、さようなら！',
          translationSi: 'යාලුවනේ, සමුගනිමි!',
          translationEn: 'Goodbye, everyone!'
        },
        audioLangCode: 'ja-JP'
      }
    ],
    modelQuestions: [
      {
        id: 'jp-q1',
        question: {
          si: "'わたし は がくせい ...........' හිස්තැනට ගැළපෙන නිවැරදි ගෞරවාර්ථ ආඛ්‍යාතය (polite copula) කුමක්ද?",
          en: "What is the correct polite copula to complete 'Watashi wa gakusei ...........'?",
          ta: "'Watashi wa gakusei ..........' என்பதற்கு சரியான சொல் எது?"
        },
        options: {
          si: ['です (desu)', 'ます (masu)', 'でした (deshita)', 'じゃない (janai)'],
          en: ['です (desu)', 'ます (masu)', 'でした (deshita)', 'じゃない (janai)'],
          ta: ['です (desu)', 'ます (masu)', 'でした (deshita)', 'じゃない (janai)']
        },
        correctIndex: 0,
        explanation: {
          si: "නාම පදයක් හෝ විශේෂණ පදයක් අවසානයේ වර්තමාන කාල ගෞරවාර්ථ ආඛ්‍යාතය ලෙස 'です' (desu) යොදා ගනී.",
          en: "'です' (desu) is the polite present copula (to be) for nouns and na-adjectives.",
          ta: "'desu' என்பது நிகழ்கால ஒருமை/பன்மை வினைக்குரிய சொல்லாகும்."
        }
      },
      {
        id: 'jp-q2',
        question: {
          si: "'කෑම කනවා' යන ක්‍රියාවේ කර්මය (Direct object) දැක්වීමට යොදන නිවැරදි නිපාතය (particle) කුමක්ද? (උදා: ごはん ..... たべます)",
          en: "Which particle marks the direct object of an action (e.g. Gohan ..... tabemasu)?",
          ta: "செயப்படுபொருளைக் குறிக்கப் பயன்படும் துகள் எது?"
        },
        options: {
          si: ['を (o)', 'は (wa)', 'に (ni)', 'で (de)'],
          en: ['を (o)', 'は (wa)', 'に (ni)', 'で (de)'],
          ta: ['を (o)', 'は (wa)', 'に (ni)', 'で (de)']
        },
        correctIndex: 0,
        explanation: {
          si: "සෘජු කර්ම පදය දක්වන්නේ 'を' (o) නිපාතයෙනි. උදා: Gohan o tabemasu.",
          en: "The particle を (pronounced 'o') marks the direct object receiving the action of the verb.",
          ta: "'o' துகள் செயப்படுபொருளைக் குறிக்கும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'ජපන් භාෂා ඉක්මන් ව්‍යාකරණ රීති', en: 'Japanese Quick Grammar Cheatsheet' },
      rules: [
        { si: 'වාක්‍ය රටාව: Subject + Object + Verb (SOV) - සිංහල භාෂාවට සමානයි!', en: 'SOV word order (Subject - Object - Verb), matching Sinhala!' },
        { si: 'ප්‍රශ්න සෑදීම: ඕනෑම වාක්‍යයක් අගට か (ka) එකතු කරන්න.', en: 'Questions: Simply append か (ka) at the end of the sentence.' },
        { si: 'අතීත කාලය: です → でした (deshita) | ます → ました (mashita)', en: 'Past tense: desu → deshita | masu → mashita' }
      ]
    }
  },

  // ==========================================
  // 2. KOREAN LANGUAGE (කොරියානු භාෂාව - 한국어)
  // ==========================================
  {
    id: 'subj-foreign-korean',
    code: 'FL-KOR-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (A/L Stream & EPS-TOPIK)',
    flagOrIcon: '🇰🇷',
    title: {
      en: 'Korean Language (Hangul)',
      si: 'කොරියානු භාෂාව (හංගුල්)',
      ta: 'கொரிய மொழி (Hangul)'
    },
    nativeTitle: '한국어 (Korean)',
    badge: {
      si: 'උසස් පෙළ & EPS-TOPIK පෙළගැස්ම',
      en: 'G.C.E. A/L & EPS-TOPIK Aligned'
    },
    themeColor: 'indigo',
    gradientBg: 'from-indigo-500/10 via-blue-500/5 to-cyan-500/10 dark:from-indigo-950/40 dark:to-blue-950/30',
    borderColor: 'border-indigo-300 dark:border-indigo-800',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    description: {
      si: 'කොරියානු අක්ෂර මාලාව (Hangul - ස්වර 10 සහ ව්‍යංජන 14), බචිම් (Batchim - අවසන් ව්‍යංජන රීති), ගෞරවාර්ථ ආඛ්‍යාත (-ㅂ니다/습니다, -아요/어요), සහ විභාග ආදර්ශ ප්‍රශ්න.',
      en: 'Complete Sri Lankan school syllabus and EPS-TOPIK foundation: Hangul phonetic system (14 consonants & 10 vowels), Batchim final consonant rules, and honorific endings (-ㅂ니다/습니다).',
      ta: 'ஹங்குல் எழுத்துக்கள், உச்சரிப்பு மற்றும் கொரிய இலக்கணம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, සේජොං රජතුමා නිර්මාණය කළ හංගුල් අක්ෂර මාලාව ලෝකයේ පහසුවෙන්ම ඉගෙන ගත හැකි අක්ෂර ක්‍රමයයි! ව්‍යංජන සහ ස්වර එකතු කර ලියන හැටි බලමු!',
      en: 'Kavi says: King Sejong designed Hangul to be scientific and easy! Let us combine consonants and vowels to read any Korean word instantly!'
    },
    officialGuideRef: 'Ministry of Education National Foreign Languages Curriculum / TOPIK Level 1-2 Standards',
    units: [
      {
        id: 'ko-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.4: Hangul Alphabet, Syllable Blocks & Batchim',
        title: {
          si: 'ඒකකය 01: හංගුල් අක්ෂර මාලාව සහ අක්ෂර කුට්ටි (Syllable Blocks)',
          en: 'Unit 01: Hangul Scientific Alphabet & Syllable Construction',
          ta: 'அலகு 01: ஹங்குல் எழுத்துக்கள் & சொல்லாக்கம்'
        },
        description: {
          si: 'මූලික ව්‍යංජන 14ක් (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ) සහ ස්වර 10ක් (ㅏ, ㅑ, ㅓ, ㅕ, ㅗ, ㅛ, ㅜ, ㅠ, ㅡ, ㅣ).',
          en: '14 basic consonants and 10 basic vowels combined into 2D syllable blocks (Initial + Medial + Final).',
          ta: '14 மெய்யெழுத்துக்கள் மற்றும் 10 உயிரெழுத்துக்கள்.'
        },
        allocatedPeriods: 14,
        lessons: [
          {
            id: 'ko-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'හංගුල් ස්වර සහ ව්‍යංජන සංයෝජනය (가, 나, 다, 라)',
              en: 'Combining Hangul Consonants & Vowels (Ga, Na, Da, Ra)',
              ta: 'எழுத்துக்களின் சேர்க்கை'
            },
            duration: '30 mins',
            niePeriodCount: 4,
            summary: {
              si: 'කොරියානු භාෂාවේ සෑම අකුරු කුට්ටියක්ම (Syllable block) මුල් ව්‍යංජනයකින් ආරම්භ වී ස්වරයකින් සම්පූර්ණ වේ. ශබ්දයක් නොමැති විට ㅇ (Ieung) යොදයි. උදා: ㅇ + ㅏ = 아 (a).',
              en: 'Every Hangul syllable begins with a consonant followed by a vowel. If a vowel starts a syllable, the silent circle ㅇ is used as a placeholder (e.g. ㅇ + ㅏ = 아).',
              ta: 'ஹங்குல் எழுத்து சேர்க்கை விதிகள்.'
            },
            keyPoints: {
              si: [
                'මූලික ස්වර: ㅏ (a), ㅓ (eo), ㅗ (o), ㅜ (u), ㅡ (eu), ㅣ (i)',
                'මූලික ව්‍යංජන: ㄱ (g/k), ㄴ (n), ㄷ (d/t), ㄹ (r/l), ㅁ (m), ㅂ (b/p), ㅅ (s)',
                'ග + ආ = 가 (ga) | න + ආ = 나 (na) | ද + ආ = 다 (da)'
              ],
              en: [
                'Core vowels: ㅏ (a), ㅓ (eo), ㅗ (o), ㅜ (u), ㅡ (eu), ㅣ (i)',
                'Core consonants: ㄱ (g/k), ㄴ (n), ㄷ (d/t), ㄹ (r/l), ㅁ (m), ㅂ (b/p), ㅅ (s)',
                'ㄱ + ㅏ = 가 (ga) | ㄴ + ㅏ = 나 (na) | ㄷ + ㅏ = 다 (da)'
              ],
              ta: ['உயிரெழுத்துக்கள் மற்றும் மெய்யெழுத்துக்கள் சேர்க்கை']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'ko-voc-1',
        term: '안녕하세요',
        transcription: 'Annyeonghaseyo',
        meaning: {
          si: 'ආයුබෝවන් (ගෞරවනීය)',
          en: 'Hello / Good day (Polite)',
          ta: 'வணக்கம்'
        },
        exampleSentence: {
          original: '선생님, 안녕하세요!',
          translationSi: 'ගුරුතුමනි, ආයුබෝවන්!',
          translationEn: 'Teacher, hello!'
        },
        audioLangCode: 'ko-KR'
      },
      {
        id: 'ko-voc-2',
        term: '감사합니다',
        transcription: 'Gamsahamnida',
        meaning: {
          si: 'බොහොම ස්තූතියි',
          en: 'Thank you very much (Formal)',
          ta: 'மிக்க நன்றி'
        },
        exampleSentence: {
          original: '도와주셔서 감사합니다.',
          translationSi: 'උදව් කළාට බොහොම ස්තූතියි.',
          translationEn: 'Thank you for your help.'
        },
        audioLangCode: 'ko-KR'
      },
      {
        id: 'ko-voc-3',
        term: '학생',
        transcription: 'Haksaeng',
        meaning: {
          si: 'පාසල් ශිෂ්‍යයා',
          en: 'Student',
          ta: 'மாணவர்'
        },
        exampleSentence: {
          original: '저는 스리랑카 학생입니다.',
          translationSi: 'මම ශ්‍රී ලාංකික ශිෂ්‍යයෙක් වෙමි.',
          translationEn: 'I am a Sri Lankan student.'
        },
        audioLangCode: 'ko-KR'
      },
      {
        id: 'ko-voc-4',
        term: '선생님',
        transcription: 'Seonsaengnim',
        meaning: {
          si: 'ගුරුතුමා / ගුරුවරිය',
          en: 'Teacher / Instructor',
          ta: 'ஆசிரியர்'
        },
        exampleSentence: {
          original: '선생님은 친절하십니다.',
          translationSi: 'ගුරුතුමිය ඉතා කරුණාවන්තයි.',
          translationEn: 'The teacher is very kind.'
        },
        audioLangCode: 'ko-KR'
      },
      {
        id: 'ko-voc-5',
        term: '한국어',
        transcription: 'Hangugeo',
        meaning: {
          si: 'කොරියානු භාෂාව',
          en: 'Korean language',
          ta: 'கொரிய மொழி'
        },
        exampleSentence: {
          original: '한국어를 열심히 공부합니다.',
          translationSi: 'කොරියානු භාෂාව උනන්දුවෙන් පාඩම් කරමි.',
          translationEn: 'I study Korean diligently.'
        },
        audioLangCode: 'ko-KR'
      }
    ],
    modelQuestions: [
      {
        id: 'ko-q1',
        question: {
          si: "'저는 학생...........' (මම ශිෂ්‍යයෙක් වෙමි) හිස්තැනට ගැළපෙන නිල ගෞරවාර්ථ ආඛ්‍යාතය (formal ending) තෝරන්න.",
          en: "Choose the correct formal polite copula to complete '저는 학생...........' (I am a student).",
          ta: "'저는 학생..........' என்பதற்கு சரியான முடிவு எது?"
        },
        options: {
          si: ['입니다 (imnida)', '습니까 (seumnikka)', '합니다 (hamnida)', '가요 (gayo)'],
          en: ['입니다 (imnida)', '습니까 (seumnikka)', '합니다 (hamnida)', '가요 (gayo)'],
          ta: ['입니다 (imnida)', '습니까 (seumnikka)', '합니다 (hamnida)', '가요 (gayo)']
        },
        correctIndex: 0,
        explanation: {
          si: "නාම පදයක් අවසානයේ 'වෙමි/වේ' යන අර්ථය දීමට '입니다' (imnida) යොදා ගනී.",
          en: "'입니다' (imnida) is the formal honorific copula attached to nouns.",
          ta: "'imnida' என்பது மரியாதைக்குரிய முடிவாகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'කොරියානු භාෂා සාරාංශය', en: 'Korean Quick Grammar Rules' },
      rules: [
        { si: 'උක්ත නිපාත: 받침 (Batchim) ඇත්නම් 은 (eun), නැත්නම් 는 (neun)', en: 'Topic markers: 은 (eun) with final consonant, 는 (neun) without.' },
        { si: 'කර්ම නිපාත: 받침 ඇත්නම් 을 (eul), නැත්නම් 를 (reul)', en: 'Object markers: 을 (eul) with final consonant, 를 (reul) without.' }
      ]
    }
  },

  // ==========================================
  // 3. INFORMATION & COMMUNICATION TECHNOLOGY (ICT)
  // ==========================================
  {
    id: 'subj-tech-ict',
    code: 'MOD-ICT-2026',
    categoryType: 'modern_tech',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (Core Modern Tech)',
    flagOrIcon: '💻',
    title: {
      en: 'Information & Communication Tech (ICT)',
      si: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
      ta: 'தகவல் மற்றும் தொடர்பாடல் தொழில்நுட்பம் (ICT)'
    },
    nativeTitle: 'Information & Communication Technology',
    badge: {
      si: 'ප්‍රධාන නවීන තාක්ෂණික විෂය',
      en: 'National Core STEM & Digital Skills'
    },
    themeColor: 'blue',
    gradientBg: 'from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-blue-950/40 dark:to-cyan-950/30',
    borderColor: 'border-blue-300 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: {
      si: 'ඩිජිටල් සාක්ෂරතාව, පරිගණක දෘඩාංග හා මෘදුකාංග, ඇල්ගොරිතම සහ පයිතන් (Python) ක්‍රමලේඛනය, දත්ත සමුදාය (Database - SQL), තාර්කික ද්වාර (Logic Gates), සහ වෙබ් නිර්මාණය (HTML/CSS).',
      en: 'Complete Sri Lankan national ICT curriculum: digital literacy, hardware architecture, algorithm logic & Python programming, relational databases (SQL), digital logic gates, networking, and cyber ethics.',
      ta: 'கணினி வன்பொருள், மென்பொருள், பைதான் நிரலாக்கம் மற்றும் தரவுத்தளம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, අනාගත ලෝකය දිනන්න පරිගණක හා මෘදුකාංග දැනුම අත්‍යවශ්‍යයි! තාර්කික ද්වාර, පයිතන් කේත සහ වෙබ් අඩවි හදන හැටි පියවරෙන් පියවර ඉගෙන ගනිමු!',
      en: 'Kavi says: Computing powers modern Sri Lanka and the world! Let us master logic gates, write Python algorithms, and design websites with fun!'
    },
    officialGuideRef: 'NIE G.C.E. O/L (Subj 80) & A/L (Subj 20) National ICT Curriculum Guidelines',
    units: [
      {
        id: 'ict-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Digital Logic Gates & Boolean Algebra',
        title: {
          si: 'ඒකකය 01: තාර්කික ද්වාර සහ බූලියානු වීජ ගණිතය',
          en: 'Unit 01: Logic Gates & Truth Tables',
          ta: 'அலகு 01: தர்க்க வாயில்கள் & உண்மை அட்டவணைகள்'
        },
        description: {
          si: 'AND, OR, NOT, NAND, NOR, XOR ද්වාරවල සංකේත, බූලියානු ප්‍රකාශන සහ සත්‍යතා වගු ගොඩනැගීම.',
          en: 'Logic symbols, truth tables, and Boolean algebraic expressions for fundamental logic gates.',
          ta: 'தர்க்க வாயில்களின் குறியீடுகள் மற்றும் அட்டவணைகள்.'
        },
        allocatedPeriods: 10,
        lessons: [
          {
            id: 'ict-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'මූලික තාර්කික ද්වාර (AND, OR, NOT)',
              en: 'Basic Logic Gates (AND, OR, NOT) & Combinations',
              ta: 'அடிப்படை தர்க்க வாயில்கள்'
            },
            duration: '30 mins',
            niePeriodCount: 3,
            summary: {
              si: 'AND ද්වාරයේ ප්‍රතිදානය 1 වන්නේ ආදාන සියල්ලම 1 වූ විට පමණි. OR ද්වාරයේ ඕනෑම එක් ආදානයක් 1 වූ විට ප්‍රතිදානය 1 වේ. NOT ද්වාරය මඟින් ආදානය ප්‍රතිවිරුද්ධ කරයි.',
              en: 'AND Gate: Output 1 only when all inputs are 1. OR Gate: Output 1 if any input is 1. NOT Gate: Inverts 0 to 1 and 1 to 0.',
              ta: 'AND, OR, NOT வாயில்களின் தொழிற்பாடுகள்.'
            },
            keyPoints: {
              si: [
                'AND ද්වාරය: Y = A · B (ගුණ කිරීම හා සමානයි)',
                'OR ද්වාරය: Y = A + B (එකතු කිරීම හා සමානයි)',
                'NOT ද්වාරය: Y = Ā (ප්‍රතිලෝමය)',
                'XOR ද්වාරය: Y = A ⊕ B (ආදාන දෙක වෙනස් විට 1 වේ)'
              ],
              en: [
                'AND Gate: Y = A · B',
                'OR Gate: Y = A + B',
                'NOT Gate: Y = Ā (Inverter)',
                'XOR Gate: Y = A ⊕ B (Output 1 when inputs differ)'
              ],
              ta: ['AND: Y = A · B', 'OR: Y = A + B', 'NOT: Y = Ā']
            }
          }
        ]
      },
      {
        id: 'ict-u2',
        unitNumber: 2,
        competencyLevel: '2.1 - 2.4: Algorithm Design & Python Programming',
        title: {
          si: 'ඒකකය 02: ඇල්ගොරිතම, ගැලීම් සටහන් සහ පයිතන් (Python) ක්‍රමලේඛනය',
          en: 'Unit 02: Algorithms, Flowcharts & Python Programming',
          ta: 'அலகு 02: பாய்ச்சல் கோட்டுப்படம் & பைதான்'
        },
        description: {
          si: 'ගැලීම් සටහන් සංකේත (Flowchart symbols), ව්‍යාජ කේත (Pseudocode), විචල්‍ය (Variables), කොන්දේසි (if/else), සහ ලූප (for/while loops).',
          en: 'Flowchart logic, pseudocode, Python variables, conditional statements (if/elif/else), and loops (for/while).',
          ta: 'நிரலாக்க அடிப்படைகள் மற்றும் பைதான்.'
        },
        allocatedPeriods: 18,
        lessons: [
          {
            id: 'ict-u2-l1',
            lessonNumber: 1,
            title: {
              si: 'පයිතන් මූලික විධාන (Variables, Input/Output, Data Types)',
              en: 'Python Fundamentals (print, input, int, float, str)',
              ta: 'பைதான் கட்டளைகள்'
            },
            duration: '40 mins',
            niePeriodCount: 4,
            summary: {
              si: 'පයිතන් භාෂාවේ print() මඟින් ප්‍රතිදානයක් දෙන අතර, input() මඟින් පරිශීලකයාගෙන් ආදාන ලබා ගනී. int() මඟින් සංඛ්‍යා බවට හරවයි.',
              en: 'Python uses print() for output and input() for keyboard input. Typecasting int() and float() converts text to numbers.',
              ta: 'print() மற்றும் input() கட்டளைகள்.'
            },
            keyPoints: {
              si: [
                'ප්‍රතිදානය: print("Hello SipArana!")',
                'සංඛ්‍යා ආදානය: age = int(input("Enter age: "))',
                'කොන්දේසි: if mark >= 75: print("Grade A")',
                'ලූප: for i in range(1, 6): print(i)'
              ],
              en: [
                'Output: print("Hello SipArana!")',
                'Input: age = int(input("Enter age: "))',
                'Conditions: if mark >= 75: print("Grade A")',
                'Loops: for i in range(1, 6): print(i)'
              ],
              ta: ['print("Hello")', 'age = int(input())']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'ict-voc-1',
        term: 'Algorithm (ඇල්ගොරිතමය)',
        meaning: {
          si: 'ගැටළුවක් විසඳීම සඳහා වූ පියවරෙන් පියවර තාර්කික උපදෙස් මාලාව',
          en: 'A step-by-step set of logical instructions to solve a given problem',
          ta: 'படிமுறைத் தீர்வு'
        },
        audioLangCode: 'en-US'
      },
      {
        id: 'ict-voc-2',
        term: 'Database (දත්ත සමුදාය)',
        meaning: {
          si: 'පහසුවෙන් ප්‍රවේශ විය හැකි පරිදි සංවිධානය කරන ලද අදාළ දත්ත එකතුවක්',
          en: 'An organized collection of structured data for easy storage and retrieval',
          ta: 'தரவுத்தளம்'
        },
        audioLangCode: 'en-US'
      },
      {
        id: 'ict-voc-3',
        term: 'RAM (Random Access Memory)',
        meaning: {
          si: 'පරිගණකය ක්‍රියාත්මක වන විට දත්ත තාවකාලිකව රඳවා ගන්නා ප්‍රධාන මතකය (නශ්‍ය මතකයකි)',
          en: 'Volatile main memory holding data currently processed by CPU',
          ta: 'முதன்மை நினைவகம்'
        },
        audioLangCode: 'en-US'
      }
    ],
    modelQuestions: [
      {
        id: 'ict-q1',
        question: {
          si: "පයිතන් (Python) ක්‍රමලේඛයක `print(10 // 3)` විධානය ක්‍රියාත්මක කළ විට ලැබෙන නිවැරදි ප්‍රතිදානය කුමක්ද?",
          en: "What is the output of `print(10 // 3)` in Python?",
          ta: "பைதானில் `print(10 // 3)` இன் வெளியீடு என்ன?"
        },
        options: {
          si: ['3 (Floor division - පූර්ණ සංඛ්‍යා බෙදීම)', '3.333', '1', '3.0'],
          en: ['3 (Floor division)', '3.333', '1', '3.0'],
          ta: ['3', '3.333', '1', '3.0']
        },
        correctIndex: 0,
        explanation: {
          si: "පයිතන්හි `//` සංකේතය මඟින් පූර්ණ සංඛ්‍යා බෙදීම (Floor Division) සිදුකර භාග කොටස ඉවත් කර පූර්ණ අගය 3 ලබාදෙයි.",
          en: "The `//` operator performs floor division, returning the integer quotient (3).",
          ta: "`//` என்பது முழு எண் வகுத்தலாகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'ICT විභාග සූත්‍ර සහ කෙටි සටහන්', en: 'ICT Quick Revision Notes' },
      rules: [
        { si: '1 Byte = 8 Bits | 1 KB = 1024 Bytes | 1 MB = 1024 KB', en: '1 Byte = 8 Bits | 1 KB = 1024 Bytes | 1 MB = 1024 KB' },
        { si: 'De Morgan නියම: (A · B)̄ = Ā + B̄  සහ  (A + B)̄ = Ā · B̄', en: "De Morgan's Laws: (A · B)̄ = Ā + B̄ and (A + B)̄ = Ā · B̄" }
      ]
    }
  },

  // ==========================================
  // 4. TECHNOLOGY FOR LIFE (ජීවිතයට තාක්ෂණවේදය)
  // ==========================================
  {
    id: 'subj-tech-life',
    code: 'MOD-TFL-2026',
    categoryType: 'modern_tech',
    levels: ['junior', 'ol'],
    gradeRange: 'Grades 6 - 9 & O/L Practical Basket',
    flagOrIcon: '🛠️',
    title: {
      en: 'Technology for Life (Life Competencies)',
      si: 'ජීවිතයට තාක්ෂණවේදය හා ජීවන නිපුණතා',
      ta: 'வாழ்க்கைக்கான தொழில்நுட்பம்'
    },
    nativeTitle: 'Technology for Life',
    badge: {
      si: 'ප්‍රායෝගික වෘත්තීය නිපුණතා',
      en: 'Applied Practical Life Skills'
    },
    themeColor: 'emerald',
    gradientBg: 'from-emerald-500/10 via-teal-500/5 to-green-500/10 dark:from-emerald-950/40 dark:to-teal-950/30',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    description: {
      si: 'ගෘහස්ථ විදුලි පරිපථ, මූලික ඉලෙක්ට්‍රොනික විද්‍යාව (LED, Resistors, Transistors), ලී සහ ලෝහ වැඩ, ආහාර තාක්ෂණය සහ කෘෂි නවෝත්පාදන.',
      en: 'Hands-on practical syllabus: domestic electrical safety, basic electronics circuits, materials technology, food preservation, and sustainable environmental innovation.',
      ta: 'வீட்டு மின்சுற்றுக்கள், இலத்திரனியல் மற்றும் உணவுக் கைத்தொழில்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, අපේ දෛනික ජීවිතයට අවශ්‍ය උපකරණ නඩත්තුව, සූර්ය බලශක්තිය, සහ ආරක්ෂිත විදුලි පරිපථ හදන හැටි ප්‍රායෝගිකව ඉගෙන ගනිමු!',
      en: 'Kavi says: Practical skills make you independent and capable! Learn home electrical safety, solar power, and electronic circuits step-by-step!'
    },
    officialGuideRef: 'NIE Life Competencies & Technology National Curriculum',
    units: [
      {
        id: 'tfl-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.4: Domestic Electricity & Household Electrical Safety',
        title: {
          si: 'ඒකකය 01: ගෘහස්ථ විදුලිය සහ ආරක්ෂිත පරිපථ',
          en: 'Unit 01: Household Electricity & Circuit Safety Devices',
          ta: 'அலகு 01: வீட்டு மின்சாரம் மற்றும் பாதுகாப்பு'
        },
        description: {
          si: 'MCCB, MCB, RCCB (ට්‍රිප් ස්විචය), භූගත කිරීම (Earthing), සහ වයර් වර්ණ කේත.',
          en: 'Circuit breakers (MCB), Residual Current Circuit Breakers (RCCB/Trip switch), grounding safety, and wire color codes.',
          ta: 'மின் பாதுகாப்பு சாதனங்கள்.'
        },
        allocatedPeriods: 12,
        lessons: [
          {
            id: 'tfl-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'RCCB (ට්‍රිප් ස්විචය) සහ MCB ආරක්ෂණ ක්‍රම',
              en: 'RCCB (Trip Switch) & MCB Circuit Protection',
              ta: 'RCCB மற்றும் MCB இன் தொழிற்பாடு'
            },
            duration: '30 mins',
            niePeriodCount: 3,
            summary: {
              si: 'RCCB (ට්‍රිප් ස්විචය) මිනිස් සිරුර හරහා විදුලිය කාන්දු වීමේදී (30mA) තත්පර 0.03කදී විසන්ධි වී ජීවිත බේරා ගනී. MCB අධි ධාරාවලදී පරිපථය ආරක්ෂා කරයි.',
              en: 'The RCCB trips at 30mA earth leakage within 30 milliseconds to protect human life from fatal electric shocks.',
              ta: 'மின்னதிர்ச்சியிலிருந்து பாதுகாக்கும் சாதனம் RCCB ஆகும்.'
            },
            keyPoints: {
              si: [
                'සජීව කම්බිය (Live): දුඹුරු පැහැය (Brown)',
                'උදාසීන කම්බිය (Neutral): නිල් පැහැය (Blue)',
                'භූගත කම්බිය (Earth): කහ සහ කොළ ඉරි (Green/Yellow striped)',
                'RCCB සංවේදීතාව: 30 mA (මිනිස් ආරක්ෂාව)'
              ],
              en: [
                'Live wire: Brown',
                'Neutral wire: Blue',
                'Earth wire: Green & Yellow striped',
                'RCCB sensitivity: 30 mA'
              ],
              ta: ['Live: Brown', 'Neutral: Blue', 'Earth: Green/Yellow']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'tfl-voc-1',
        term: 'RCCB (Residual Current Circuit Breaker)',
        meaning: {
          si: 'භූගතයට ධාරාව කාන්දු වන විට විදුලි සැපයුම ක්‍ෂණිකව විසන්ධි කරන ජීවිත ආරක්ෂක ස්විචය (ට්‍රිප් ස්විචය)',
          en: 'Safety device that instantly disconnects power during earth leakage (30mA)',
          ta: 'மின்கசிவு தடுப்பான்'
        },
        audioLangCode: 'en-US'
      }
    ],
    modelQuestions: [
      {
        id: 'tfl-q1',
        question: {
          si: "ශ්‍රී ලංකා ප්‍රමිතීන්ට අනුව ගෘහස්ථ විදුලි රැහැනක භූගත කම්බියේ (Earth wire) නිවැරදි සම්මත වර්ණය කුමක්ද?",
          en: "What is the standard color code for the Earth wire in domestic wiring in Sri Lanka?",
          ta: "பூமித் தொடுப்புக் கம்பியின் நிறம் என்ன?"
        },
        options: {
          si: ['කොළ සහ කහ ඉරි (Green with Yellow stripes)', 'දුඹුරු (Brown)', 'නිල් (Blue)', 'කළු (Black)'],
          en: ['Green with Yellow stripes', 'Brown', 'Blue', 'Black'],
          ta: ['பச்சை & மஞ்சள்', 'பழுப்பு', 'நீலம்', 'கருப்பு']
        },
        correctIndex: 0,
        explanation: {
          si: "ශ්‍රී ලංකා සහ ජාත්‍යන්තර සම්මතය අනුව භූගත රැහැන (Earth) කහ සහ කොළ ඉරි සහිත වේ.",
          en: "Standard earth wire insulation is green with yellow stripes.",
          ta: "பூமித் தொடுப்பு கம்பி பச்சை மற்றும் மஞ்சள் நிறமாகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'ජීවිතයට තාක්ෂණවේදය ප්‍රධාන කරුණු', en: 'Technology for Life Key Rules' },
      rules: [
        { si: 'ඕම්ගේ නියමය: V = I × R (වෝල්ටීයතාව = ධාරාව × ප්‍රතිරෝධය)', en: "Ohm's Law: V = I × R" },
        { si: 'විදුලි බලය: P = V × I (වොට් = වෝල්ට් × ඇම්පියර්)', en: 'Electrical Power: P = V × I' }
      ]
    }
  },

  // ==========================================
  // 5. ENTREPRENEURSHIP & FINANCIAL LITERACY
  // ==========================================
  {
    id: 'subj-tech-entrepreneurship',
    code: 'MOD-ENT-2026',
    categoryType: 'modern_tech',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (Modern Reforms)',
    flagOrIcon: '📈',
    title: {
      en: 'Entrepreneurship & Financial Literacy',
      si: 'ව්‍යවසායකත්වය හා මූල්‍ය සාක්ෂරතාව',
      ta: 'தொழில்முயற்சியாண்மை & நிதி எழுத்தறிவு'
    },
    nativeTitle: 'Entrepreneurship & Financial Literacy',
    badge: {
      si: 'නව ආර්ථික ප්‍රතිසංස්කරණ විෂය',
      en: 'National Financial Independence Curriculum'
    },
    themeColor: 'amber',
    gradientBg: 'from-amber-500/10 via-yellow-500/5 to-orange-500/10 dark:from-amber-950/40 dark:to-orange-950/30',
    borderColor: 'border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: {
      si: 'ව්‍යාපාර අදහස් උත්පාදනය, මූල්‍ය අයවැය සැකසීම, ඉතිරිකිරීම් හා ආයෝජන, බැංකු ක්‍රම සහ ඩිජිටල් ගෙවීම් (LANKAQR, FinTech), සහ ව්‍යාපාර සැලැස්මක් සකස් කිරීම.',
      en: 'Modern financial literacy, business model canvas, personal budgeting, banking systems, digital payment innovations (LANKAQR), investment strategies, and SME startup formulation.',
      ta: 'வணிகத் திட்டம், நிதி முகாமைத்துவம் மற்றும் முதலீடுகள்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, මුදල් නිවැරදිව කළමනාකරණය කිරීම සහ අලුත් ව්‍යාපාර අදහස් බිහිකිරීම අනාගතයට ඉතා වැදගත්! ආයෝජන සහ මූල්‍ය රහස් එකට ඉගෙන ගනිමු!',
      en: 'Kavi says: Smart money management and entrepreneurship create leaders! Master budgeting, digital banking, and business planning today!'
    },
    officialGuideRef: 'NIE Commerce & Entrepreneurship Studies Department / Central Bank Financial Literacy Roadmap',
    units: [
      {
        id: 'ent-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Personal Budgeting & Financial Planning',
        title: {
          si: 'ඒකකය 01: පෞද්ගලික අයවැය සහ ඉතිරිකිරීමේ මූලධර්ම',
          en: 'Unit 01: Budgeting, Savings & The 50/30/20 Rule',
          ta: 'அலகு 01: தனிநபர் வரவு செலவுத் திட்டம்'
        },
        description: {
          si: 'ආදායම්, වියදම්, 50/30/20 අයවැය නීතිය, පොලී ගණනය සහ උද්ධමනයෙන් ආරක්ෂා වීම.',
          en: 'Income vs expenditure, the 50/30/20 budget framework, simple & compound interest, and inflation hedges.',
          ta: 'சேமிப்பு மற்றும் முதலீட்டு முறைகள்.'
        },
        allocatedPeriods: 10,
        lessons: [
          {
            id: 'ent-u1-l1',
            lessonNumber: 1,
            title: {
              si: '50/30/20 අයවැය නීතිය සහ මූල්‍ය විනය',
              en: 'The 50/30/20 Budgeting Rule for Students',
              ta: '50/30/20 வரவு செலவு விதி'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'ලැබෙන ආදායමෙන් 50% ක් අත්‍යවශ්‍ය අවශ්‍යතා සඳහාද, 30% ක් සුඛෝපභෝගී හෝ ද්විතීයික උවමනා සඳහාද, 20% ක් අනිවාර්ය ඉතිරිකිරීම් හා ආයෝජන සඳහාද වෙන් කිරීමේ රන් නීතිය.',
              en: 'Allocate 50% of income to Needs (food, shelter, books), 30% to Wants (hobbies, entertainment), and 20% to Savings & Investments.',
              ta: 'வருமானத்தை பிரித்து சேமிக்கும் முறை.'
            },
            keyPoints: {
              si: [
                '50% අත්‍යවශ්‍ය දේ (Needs): ආහාර, අධ්‍යාපන වියදම්, ගමන් බිමන්',
                '30% උවමනා (Wants): විනෝදාංශ, ඇඳුම් පැළඳුම්',
                '20% ඉතිරිකිරීම් (Savings): හදිසි අරමුදල, ස්ථාවර තැන්පතු'
              ],
              en: [
                '50% Needs: Food, tuition, basic transport',
                '30% Wants: Entertainment, lifestyle',
                '20% Savings: Emergency fund, investments'
              ],
              ta: ['50% தேவைகள் | 30% விருப்பங்கள் | 20% சேமிப்பு']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'ent-voc-1',
        term: 'Compound Interest (වැල් පොලිය)',
        meaning: {
          si: 'මූලධනයට අමතරව උපයාගත් පොලිය මතද නැවත පොලී ගණනය වීම (ධනවත් වීමේ ප්‍රබලම ක්‍රමවේදයකි)',
          en: 'Interest earned on both the initial principal and accumulated interest over time',
          ta: 'கூட்டு வட்டி'
        },
        audioLangCode: 'en-US'
      }
    ],
    modelQuestions: [
      {
        id: 'ent-q1',
        question: {
          si: "50/30/20 අයවැය සැලසුම් රීතියට අනුව, මාසික ආදායමෙන් ඉතිරිකිරීම් සහ ආයෝජන සඳහා වෙන් කළ යුතු නිවැරදි ප්‍රතිශතය කීයද?",
          en: "According to the 50/30/20 rule, what percentage of monthly income should go to savings and investments?",
          ta: "50/30/20 விதியின்படி சேமிப்புக்கு ஒதுக்க வேண்டிய வீதம் எவ்வளவு?"
        },
        options: {
          si: ['20% ක්', '50% ක්', '30% ක්', '10% ක්'],
          en: ['20%', '50%', '30%', '10%'],
          ta: ['20%', '50%', '30%', '10%']
        },
        correctIndex: 0,
        explanation: {
          si: "50% අත්‍යවශ්‍ය දේටත්, 30% උවමනාවලටත්, 20% ක් ඉතිරිකිරීම් හා ආයෝජන සඳහාත් වෙන් කෙරේ.",
          en: "20% is earmarked for savings, emergency funds, and investments.",
          ta: "20% சேமிப்புக்காக ஒதுக்கப்படுகிறது."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'මූල්‍ය සාක්ෂරතා සූත්‍ර', en: 'Financial Literacy Quick Formulas' },
      rules: [
        { si: 'සරල පොලිය: I = P × R × T / 100', en: 'Simple Interest: I = P × R × T / 100' },
        { si: 'ලාභ ප්‍රතිශතය = (ශුද්ධ ලාභය / මුළු පිරිවැය) × 100%', en: 'Profit Margin = (Net Profit / Total Cost) × 100%' }
      ]
    }
  },

  // ==========================================
  // 6. FRENCH LANGUAGE (ප්‍රංශ භාෂාව - Français)
  // ==========================================
  {
    id: 'subj-foreign-french',
    code: 'FL-FR-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (DELF A1-B1 & A/L)',
    flagOrIcon: '🇫🇷',
    title: {
      en: 'French Language (Le Français)',
      si: 'ප්‍රංශ භාෂාව (ෆ්‍රැන්සේ)',
      ta: 'பிரெஞ்சு மொழி (Français)'
    },
    nativeTitle: 'Français (French)',
    badge: {
      si: 'අ.පො.ස. උසස් පෙළ & DELF අනුකූල',
      en: 'G.C.E. A/L & DELF A1-B1 Aligned'
    },
    themeColor: 'sky',
    gradientBg: 'from-sky-500/10 via-blue-500/5 to-indigo-500/10 dark:from-sky-950/40 dark:to-indigo-950/30',
    borderColor: 'border-sky-300 dark:border-sky-800',
    textColor: 'text-sky-600 dark:text-sky-400',
    description: {
      si: 'ප්‍රංශ අක්ෂර හා උච්චාරණ (Accents), මූලික ක්‍රියාපද සංයෝජන (être, avoir, aller), නාම පද ස්ත්‍රී/පුරුෂ ලිංග භේදය, සහ දෛනික ප්‍රංශ සංවාද.',
      en: 'Full national curriculum & DELF framework: French phonetics & accents, essential auxiliary verbs (être, avoir), noun genders (masculin/féminin), and everyday conversation.',
      ta: 'பிரெஞ்சு எழுத்துக்கள், உச்சரிப்பு மற்றும் இலக்கணம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, ප්‍රංශ භාෂාව ලෝකයේ වඩාත්ම ආකර්ෂණීය භාෂාවකි! Bonjour කියා ආචාර කරන හැටි සහ ලස්සන ප්‍රංශ වචන ශ්‍රවණය කරමින් ඉගෙන ගනිමු!',
      en: 'Kavi says: Bonjour! French is an elegant global language! Let us learn polite greetings, grammar, and native pronunciation together!'
    },
    officialGuideRef: 'NIE Foreign Languages Department / DELF Diplôme d’Études en Langue Française',
    units: [
      {
        id: 'fr-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: French Greetings, Alphabet & Auxiliary Verbs',
        title: {
          si: 'ඒකකය 01: ප්‍රංශ ආචාර විධි සහ මූලික ක්‍රියාපද (Être & Avoir)',
          en: 'Unit 01: Greetings, Pronunciation & Core Verbs (Être & Avoir)',
          ta: 'அலகு 01: பிரெஞ்சு வாழ்த்துக்கள் & அடிப்படை வினைச்சொற்கள்'
        },
        description: {
          si: 'Bonjour, Bonsoir, Comment allez-vous, Être (වීම) සහ Avoir (තිබීම) ක්‍රියාපද.',
          en: 'Greetings, accents (aigu, grave, circonflexe), and conjugations of Être (to be) and Avoir (to have).',
          ta: 'வாழ்த்துக்கள் மற்றும் வினைச்சொற்கள்.'
        },
        allocatedPeriods: 12,
        lessons: [
          {
            id: 'fr-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'Être (වීම) සහ Avoir (තිබීම) වර්තමාන කාල සංයෝජන',
              en: 'Conjugating Être (to be) and Avoir (to have) in Present Tense',
              ta: 'Être & Avoir இணைத்தல்'
            },
            duration: '30 mins',
            niePeriodCount: 3,
            summary: {
              si: 'Être: Je suis (මම වෙමි), Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont. Avoir: J’ai (මට ඇත), Tu as, Il/Elle a, Nous avons, Vous avez, Ils/Elles ont.',
              en: 'Être (to be): Je suis, Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont. Avoir (to have): J’ai, Tu as, Il/Elle a, Nous avons, Vous avez, Ils/Elles ont.',
              ta: 'Être மற்றும் Avoir வினைச்சொற்களின் அமைப்புகள்.'
            },
            keyPoints: {
              si: [
                'Je suis étudiant (මම ශිෂ්‍යයෙක් වෙමි)',
                'J’ai quinze ans (මට වයස අවුරුදු 15කි)',
                'Nous sommes amis (අපි මිතුරෝ වෙමු)'
              ],
              en: [
                'Je suis étudiant (I am a student)',
                'J’ai quinze ans (I am 15 years old)',
                'Nous sommes amis (We are friends)'
              ],
              ta: ['Je suis (நான் இருக்கிறேன்)', 'J’ai (என்னிடம் உள்ளது)']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'fr-voc-1',
        term: 'Bonjour',
        meaning: {
          si: 'සුබ උදෑසනක් / ආයුබෝවන්',
          en: 'Hello / Good morning',
          ta: 'காலை வணக்கம்'
        },
        exampleSentence: {
          original: 'Bonjour monsieur, comment allez-vous?',
          translationSi: 'සුබ උදෑසනක් මහත්මයාණෙනි, ඔබට කෙසේද?',
          translationEn: 'Good morning sir, how are you?'
        },
        audioLangCode: 'fr-FR'
      },
      {
        id: 'fr-voc-2',
        term: 'Merci beaucoup',
        meaning: {
          si: 'බොහොම ස්තූතියි',
          en: 'Thank you very much',
          ta: 'மிக்க நன்றி'
        },
        audioLangCode: 'fr-FR'
      },
      {
        id: 'fr-voc-3',
        term: 'Au revoir',
        meaning: {
          si: 'නැවත හමුවෙමු / ආයුබෝවන් (Goodbye)',
          en: 'Goodbye / See you again',
          ta: 'விடைபெறுகிறேன்'
        },
        audioLangCode: 'fr-FR'
      }
    ],
    modelQuestions: [
      {
        id: 'fr-q1',
        question: {
          si: "'Je ........... étudiant' (මම ශිෂ්‍යයෙක් වෙමි) හිස්තැනට ගැළපෙන Être ක්‍රියාපදයේ නිවැරදි වර්තමාන කාල ස්වරූපය කුමක්ද?",
          en: "What is the correct form of the verb 'être' for 'Je ........... étudiant'?",
          ta: "'Je .......... étudiant' என்பதற்கு சரியான சொல் எது?"
        },
        options: {
          si: ['suis', 'es', 'est', 'sommes'],
          en: ['suis', 'es', 'est', 'sommes'],
          ta: ['suis', 'es', 'est', 'sommes']
        },
        correctIndex: 0,
        explanation: {
          si: "Je (මම) සඳහා 'être' ක්‍රියාපදයේ වර්තමාන කාල ස්වරූපය 'suis' වේ. (Je suis = I am).",
          en: "The first-person singular of 'être' is 'suis' (Je suis = I am).",
          ta: "'Je suis' என்பது 'நான் இருக்கிறேன்' என்பதாகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'ප්‍රංශ භාෂා සාරාංශය', en: 'French Quick Revision Notes' },
      rules: [
        { si: 'ලිංග භේදය: පිරිමි නාම සඳහා Un/Le, ගැහැණු නාම සඳහා Une/La', en: 'Definite articles: Le (Masculine), La (Feminine), Les (Plural).' },
        { si: 'ප්‍රශ්න සෑදීම: Est-ce que ... වාක්‍යය මුලට එක් කරන්න.', en: "Questions: Prepend 'Est-ce que...' to any declarative sentence." }
      ]
    }
  },

  // ==========================================
  // 7. GERMAN LANGUAGE (ජර්මන් භාෂාව - Deutsch)
  // ==========================================
  {
    id: 'subj-foreign-german',
    code: 'FL-GER-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (Goethe A1-B1 & A/L)',
    flagOrIcon: '🇩🇪',
    title: {
      en: 'German Language (Deutsch)',
      si: 'ජර්මන් භාෂාව (ඩොයිෂ්)',
      ta: 'ஜெர்மன் மொழி (Deutsch)'
    },
    nativeTitle: 'Deutsch (German)',
    badge: {
      si: 'උසස් පෙළ & Goethe A1-B1 අනුකූල',
      en: 'G.C.E. A/L & Goethe-Institut Aligned'
    },
    themeColor: 'purple',
    gradientBg: 'from-purple-500/10 via-slate-500/5 to-amber-500/10 dark:from-purple-950/40 dark:to-slate-950/30',
    borderColor: 'border-purple-300 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400',
    description: {
      si: 'ජර්මන් භාෂාවේ නිශ්චිත උපපද (der, die, das), විභක්ති පද්ධතිය (Nominativ, Akkusativ, Dativ), මූලික ක්‍රියාපද සහ ව්‍යුහගත සංවාද.',
      en: 'Comprehensive German curriculum: 3 noun genders (der, die, das), cases (Nominative, Accusative, Dative), modal verbs, and Goethe A1/A2 conversation patterns.',
      ta: 'ஜெர்மன் இலக்கணம், der/die/das மற்றும் உரையாடல்கள்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, ජර්මන් භාෂාව ඉතා ක්‍රමානුකූල සහ තාර්කික භාෂාවකි! Guten Tag කියා පටන් ගෙන der, die, das නාම පද පහසුවෙන්ම මතක තබා ගනිමු!',
      en: 'Kavi says: Guten Tag! German is precise and logical! Let us conquer German noun genders and everyday phrases with ease!'
    },
    officialGuideRef: 'NIE Foreign Languages Department / Goethe-Zertifikat A1-B1 Guidelines',
    units: [
      {
        id: 'de-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: German Articles (der/die/das) & Essential Verbs',
        title: {
          si: 'ඒකකය 01: ජර්මන් ආචාර විධි, උපපද (der, die, das) සහ sein ක්‍රියාපදය',
          en: 'Unit 01: Greetings, Genders (der/die/das) & Verb Sein',
          ta: 'அலகு 01: வாழ்த்துக்கள் மற்றும் der/die/das'
        },
        description: {
          si: 'Guten Morgen, Guten Tag, Danke, sein (වීම) සහ haben (තිබීම) ක්‍රියාපද.',
          en: 'Everyday greetings, three genders (masculine der, feminine die, neuter das), and verb conjugations of sein.',
          ta: 'அடிப்படை ஜெர்மன் இலக்கணம்.'
        },
        allocatedPeriods: 12,
        lessons: [
          {
            id: 'de-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'Sein (වීම) සහ Haben (තිබීම) ක්‍රියාපද සංයෝජන',
              en: 'Conjugation of Sein (to be) & Haben (to have)',
              ta: 'Sein & Haben'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'ich bin (මම වෙමි), du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.',
              en: 'ich bin (I am), du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.',
              ta: 'ich bin, du bist, er ist.'
            },
            keyPoints: {
              si: [
                'Ich bin Schüler (මම ශිෂ්‍යයෙක් වෙමි)',
                'Das ist ein Buch (මේ පොතකි)',
                'Wie geht es Ihnen? (ඔබට කෙසේද?)'
              ],
              en: [
                'Ich bin Schüler (I am a student)',
                'Das ist ein Buch (That is a book)',
                'Wie geht es Ihnen? (How are you?)'
              ],
              ta: ['Ich bin Schüler (நான் ஒரு மாணவன்)']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'de-voc-1',
        term: 'Guten Tag',
        meaning: {
          si: 'සුබ දවසක් / ආයුබෝවන්',
          en: 'Good day / Hello',
          ta: 'நல்ல நாள் / வணக்கம்'
        },
        audioLangCode: 'de-DE'
      },
      {
        id: 'de-voc-2',
        term: 'Danke schön',
        meaning: {
          si: 'බොහොම ස්තූතියි',
          en: 'Thank you very much',
          ta: 'மிக்க நன்றி'
        },
        audioLangCode: 'de-DE'
      },
      {
        id: 'de-voc-3',
        term: 'Auf Wiedersehen',
        meaning: {
          si: 'නැවත හමුවෙමු (Goodbye)',
          en: 'Goodbye / Until we meet again',
          ta: 'விடைபெறுகிறேன்'
        },
        audioLangCode: 'de-DE'
      }
    ],
    modelQuestions: [
      {
        id: 'de-q1',
        question: {
          si: "'Ich ........... aus Sri Lanka' (මම ශ්‍රී ලංකාවෙන් වෙමි) හිස්තැනට ගැළපෙන kommen ක්‍රියාපදයේ නිවැරදි ස්වරූපය කුමක්ද?",
          en: "What is the correct form of 'kommen' for 'Ich ........... aus Sri Lanka'?",
          ta: "'Ich .......... aus Sri Lanka' என்பதற்குரிய சொல் எது?"
        },
        options: {
          si: ['komme', 'kommst', 'kommt', 'kommen'],
          en: ['komme', 'kommst', 'kommt', 'kommen'],
          ta: ['komme', 'kommst', 'kommt', 'kommen']
        },
        correctIndex: 0,
        explanation: {
          si: "Ich (මම) සඳහා ක්‍රියාපදයේ අගට -e එකතු වේ (Ich komme).",
          en: "First person singular 'ich' takes the -e suffix: Ich komme.",
          ta: "'Ich' உடன் 'komme' இணையும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'ජර්මන් භාෂා සාරාංශය', en: 'German Quick Revision Rules' },
      rules: [
        { si: 'සියලුම නාම පද (Nouns) මුල් අකුර Capital අකුරින් ලියනු ලැබේ!', en: 'Rule: ALL German nouns are ALWAYS capitalized!' }
      ]
    }
  },

  // ==========================================
  // 8. HINDI LANGUAGE (හින්දි භාෂාව - हिन्दी)
  // ==========================================
  {
    id: 'subj-foreign-hindi',
    code: 'FL-HIN-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (O/L & A/L)',
    flagOrIcon: '🇮🇳',
    title: {
      en: 'Hindi Language (Devanagari)',
      si: 'හින්දි භාෂාව (දේවනාගරී)',
      ta: 'இந்தி மொழி (Devanagari)'
    },
    nativeTitle: 'हिन्दी (Hindi)',
    badge: {
      si: 'අ.පො.ස. සාමාන්‍ය පෙළ & උසස් පෙළ',
      en: 'National O/L & A/L Curriculum'
    },
    themeColor: 'orange',
    gradientBg: 'from-orange-500/10 via-amber-500/5 to-yellow-500/10 dark:from-orange-950/40 dark:to-yellow-950/30',
    borderColor: 'border-orange-300 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400',
    description: {
      si: 'දේවනාගරී අක්ෂර මාලාව (ස්වර සහ ව්‍යංජන), සිංහල භාෂාවට බෙහෙවින් සමාන ව්‍යාකරණ රටා, ලිංග භේදය (ස්ත්‍රී/පුරුෂ), සහ හින්දි සාහිත්‍ය නිර්මාණ.',
      en: 'Devanagari script, Sanskrit-derived phonetics closely related to Sinhala & Tamil, SOV syntax, gender rules, and classic Hindi literature.',
      ta: 'தேவநாகரி எழுத்துக்கள் மற்றும் இந்தி இலக்கணம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, හින්දි භාෂාව අපේ සිංහල භාෂාවට බොහොම ළඟින් යන භාෂාවක්! Namaste කියා පටන් ගෙන ලස්සන හින්දි වචන ඉගෙන ගනිමු!',
      en: 'Kavi says: Namaste! Hindi shares deep historical and linguistic roots with Sinhala and Sanskrit! Let us learn Devanagari together!'
    },
    officialGuideRef: 'NIE National Hindi Curriculum for G.C.E. O/L & A/L',
    units: [
      {
        id: 'hi-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Devanagari Script & Core Greetings',
        title: {
          si: 'ඒකකය 01: දේවනාගරී අක්ෂර මාලාව සහ මූලික ආචාර විධි',
          en: 'Unit 01: Devanagari Script & Namaste Etiquette',
          ta: 'அலகு 01: தேவநாகரி எழுத்துக்கள்'
        },
        description: {
          si: 'ස්වර (स्वर) 11ක් සහ ව්‍යංජන (व्यंजन) 33ක්, නමස්තේ (नमस्ते) සහ මූලික වාක්‍ය රටා.',
          en: '11 vowels (Swar), 33 consonants (Vyanjan), and basic SOV conversational sentence construction.',
          ta: 'உயிரெழுத்துக்கள் மற்றும் மெய்யெழுத்துக்கள்.'
        },
        allocatedPeriods: 10,
        lessons: [
          {
            id: 'hi-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'දේවනාගරී ස්වර සහ ව්‍යංජන මූලධර්ම',
              en: 'Devanagari Swar & Vyanjan Mastery',
              ta: 'எழுத்துக்களின் அடிப்படை'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'अ (a), आ (aa), इ (i), ई (ee), उ (u), ऊ (oo), ए (e), ऐ (ai), ओ (o), औ (au). ක-පේළිය: क (ka), ख (kha), ग (ga), घ (gha), ङ (nga).',
              en: 'Swar and Vyanjan phonetics mirroring Indo-Aryan script foundations.',
              ta: 'தேவநாகரி எழுத்து வரிசை.'
            },
            keyPoints: {
              si: [
                'नमस्ते (Namaste) - ආයුබෝවන්',
                'धन्यवाद (Dhanyavaad) - ස්තූතියි',
                'मैं छात्र हूँ (Main chhatra hoon) - මම ශිෂ්‍යයෙක් වෙමි'
              ],
              en: [
                'नमस्ते (Namaste) - Hello',
                'धन्यवाद (Dhanyavaad) - Thank you',
                'मैं छात्र हूँ (I am a student)'
              ],
              ta: ['नमस्ते (வணக்கம்)', 'धन्यवाद (நன்றி)']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'hi-voc-1',
        term: 'नमस्ते',
        transcription: 'Namaste',
        meaning: {
          si: 'ආයුබෝවන් / වඳිමි',
          en: 'Hello / Greetings',
          ta: 'வணக்கம்'
        },
        audioLangCode: 'hi-IN'
      },
      {
        id: 'hi-voc-2',
        term: 'धन्यवाद',
        transcription: 'Dhanyavaad',
        meaning: {
          si: 'බොහොම ස්තූතියි',
          en: 'Thank you very much',
          ta: 'நன்றி'
        },
        audioLangCode: 'hi-IN'
      }
    ],
    modelQuestions: [
      {
        id: 'hi-q1',
        question: {
          si: "'मैं विद्यार्थी ...........' (මම සිසුවෙක් වෙමි) හිස්තැනට ගැළපෙන නිවැරදි ආඛ්‍යාතය තෝරන්න.",
          en: "What is the correct auxiliary verb for 'मैं विद्यार्थी ...........' (I am a student)?",
          ta: "'मैं विद्यार्थी ..........' என்பதற்குரிய சொல் எது?"
        },
        options: {
          si: ['हूँ (hoon)', 'है (hai)', 'हैं (hain)', 'हो (ho)'],
          en: ['हूँ (hoon)', 'है (hai)', 'हैं (hain)', 'हो (ho)'],
          ta: ['हूँ (hoon)', 'है (hai)', 'हैं (hain)', 'हो (ho)']
        },
        correctIndex: 0,
        explanation: {
          si: "मैं (මම) සමඟ හැමවිටම ආඛ්‍යාතය වන්නේ 'हूँ' (hoon) වේ.",
          en: "The subject pronoun 'मैं' (Main - I) always pairs with the auxiliary 'हूँ' (hoon).",
          ta: "'मैं' உடன் 'हूँ' வரும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'හින්දි භාෂා ඉක්මන් සටහන්', en: 'Hindi Quick Revision Notes' },
      rules: [
        { si: 'වාක්‍ය රටාව: Subject + Object + Verb (SOV) - සිංහල වාක්‍ය රටාවට සමානයි.', en: 'SOV word order exactly matches Sinhala syntax.' }
      ]
    }
  },

  // ==========================================
  // 9. CHINESE / MANDARIN (චීන භාෂාව - 中文)
  // ==========================================
  {
    id: 'subj-foreign-chinese',
    code: 'FL-CHI-2026',
    categoryType: 'foreign_language',
    levels: ['junior', 'ol', 'al'],
    gradeRange: 'Grades 6 - 13 (HSK 1-3 & National Curriculum)',
    flagOrIcon: '🇨🇳',
    title: {
      en: 'Chinese Language (Mandarin / Pinyin)',
      si: 'චීන භාෂාව (මැන්ඩරින් / පින්යින්)',
      ta: 'சீன மொழி (Mandarin)'
    },
    nativeTitle: '中文 (Chinese)',
    badge: {
      si: 'අ.පො.ස. උසස් පෙළ & HSK අනුකූල',
      en: 'National A/L & HSK Level 1-3 Aligned'
    },
    themeColor: 'red',
    gradientBg: 'from-red-500/10 via-amber-500/5 to-rose-500/10 dark:from-red-950/40 dark:to-rose-950/30',
    borderColor: 'border-red-300 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400',
    description: {
      si: 'පින්යින් (Pinyin) උච්චාරණ පද්ධතිය, ස්වර 4 (Tones), මූලික හන්සි (Hanzi) අක්ෂර, HSK 1-3 වචන මාලාව සහ පාසල් විභාග ආදර්ශ ප්‍රශ්න.',
      en: 'Pinyin romanization system, 4 Mandarin tones, basic Hanzi stroke rules, HSK 1-3 vocabulary benchmarks, and conversational sentence structures.',
      ta: 'பின்யின், தொனிகள் மற்றும் சீன எழுத்துக்கள்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, චීන භාෂාව ලෝකයේ වැඩිම පිරිසක් කතා කරන භාෂාවයි! පින්යින් සහ ස්වර 4 (Tones) නිවැරදිව උච්චාරණය කරමින් Nǐ hǎo කියමු!',
      en: 'Kavi says: Nǐ hǎo! Chinese Mandarin is spoken by over 1 billion people! Let us master the 4 tones and read Chinese characters step-by-step!'
    },
    officialGuideRef: 'NIE National Foreign Languages Curriculum / HSK 1-3 International Standard',
    units: [
      {
        id: 'zh-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Pinyin System & 4 Mandarin Tones',
        title: {
          si: 'ඒකකය 01: පින්යින් (Pinyin) සහ ස්වර 4 (The 4 Tones)',
          en: 'Unit 01: Pinyin Phonetics & The 4 Mandarin Tones',
          ta: 'அலகு 01: பின்யின் & 4 தொனிகள்'
        },
        description: {
          si: 'පළමු ස්වරය (Flat - ā), දෙවන ස්වරය (Rising - á), තෙවන ස්වරය (Dipping - ǎ), සහ සිව්වන ස්වරය (Falling - à).',
          en: 'High flat tone (1st), rising tone (2nd), dipping tone (3rd), and sharp falling tone (4th).',
          ta: 'சீன மொழியின் 4 முக்கிய தொனிகள்.'
        },
        allocatedPeriods: 10,
        lessons: [
          {
            id: 'zh-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'ස්වර 4 හඳුනාගැනීම සහ Nǐ hǎo (你好) ආචාරය',
              en: 'The 4 Tones & Nǐ hǎo Greetings',
              ta: 'தொனிகள் மற்றும் வாழ்த்துக்கள்'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'චීන භාෂාවේ ස්වරය අනුව වචනයේ අර්ථය මුළුමනින්ම වෙනස් වේ (උදා: mā = අම්මා, mǎ = අශ්වයා).',
              en: 'Tone completely changes word meaning in Mandarin (e.g. mā = mother, mǎ = horse).',
              ta: 'தொனி மாற்றத்தால் பொருள் மாறுபடும்.'
            },
            keyPoints: {
              si: [
                '1st Tone: mā (මට්ටම් උස් ස්වරය)',
                '2nd Tone: má (ඉහළ නගින ස්වරය)',
                '3rd Tone: mǎ (පහත වැටී ඉහළ නගින ස්වරය)',
                '4th Tone: mà (වේගයෙන් පහත බසින ස්වරය)'
              ],
              en: [
                '1st Tone: mā (High level)',
                '2nd Tone: má (Rising)',
                '3rd Tone: mǎ (Falling-rising)',
                '4th Tone: mà (Sharp falling)'
              ],
              ta: ['4 தொனிகள்: mā, má, mǎ, mà']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'zh-voc-1',
        term: '你好',
        transcription: 'Nǐ hǎo',
        meaning: {
          si: 'ආයුබෝවන් / සුබ දවසක්',
          en: 'Hello / How are you',
          ta: 'வணக்கம்'
        },
        audioLangCode: 'zh-CN'
      },
      {
        id: 'zh-voc-2',
        term: '谢谢',
        transcription: 'Xièxiè',
        meaning: {
          si: 'ස්තූතියි',
          en: 'Thank you',
          ta: 'நன்றி'
        },
        audioLangCode: 'zh-CN'
      },
      {
        id: 'zh-voc-3',
        term: '再见',
        transcription: 'Zàijiàn',
        meaning: {
          si: 'නැවත හමුවෙමු / සමුගනිමි (Goodbye)',
          en: 'Goodbye / See you again',
          ta: 'விடைபெறுகிறேன்'
        },
        audioLangCode: 'zh-CN'
      }
    ],
    modelQuestions: [
      {
        id: 'zh-q1',
        question: {
          si: "'Nǐ hǎo' (你好) යන්නෙහි නිවැරදි සිංහල තේරුම කුමක්ද?",
          en: "What is the meaning of 'Nǐ hǎo' (你好)?",
          ta: "'Nǐ hǎo' என்பதன் பொருள் என்ன?"
        },
        options: {
          si: ['ආයුබෝවන් (Hello)', 'ස්තූතියි (Thank you)', 'සමුගනිමි (Goodbye)', 'කරුණාකර (Please)'],
          en: ['Hello', 'Thank you', 'Goodbye', 'Please'],
          ta: ['வணக்கம்', 'நன்றி', 'விடைபெறுகிறேன்', 'தயவுசெய்து']
        },
        correctIndex: 0,
        explanation: {
          si: "Nǐ (ඔබ) + hǎo (හොඳයි) එකතු වී 'ආයුබෝවන්' (Hello) යන අර්ථය ලබා දෙයි.",
          en: "'Nǐ hǎo' literally means 'You good' and is standard for 'Hello'.",
          ta: "'Nǐ hǎo' என்பது 'வணக்கம்' ஆகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'චීන භාෂා ඉක්මන් සටහන්', en: 'Chinese Quick Cheatsheet' },
      rules: [
        { si: 'ප්‍රශ්න සෑදීම: ඕනෑම වාක්‍යයක් අගට 吗 (ma) යොදන්න. උදා: Nǐ hǎo ma? (ඔබට සනීපද?)', en: "Add 吗 (ma) to end of sentence to form yes/no questions: Nǐ hǎo ma?" }
      ]
    }
  },

  // ==========================================
  // 10. RUSSIAN LANGUAGE (රුසියන් භාෂාව - Русский язык)
  // ==========================================
  {
    id: 'subj-foreign-russian',
    code: 'FL-RUS-2026',
    categoryType: 'foreign_language',
    levels: ['al'],
    gradeRange: 'Grades 12 - 13 (G.C.E. A/L Stream)',
    flagOrIcon: '🇷🇺',
    title: {
      en: 'Russian Language (Cyrillic)',
      si: 'රුසියන් භාෂාව (සිරිලික්)',
      ta: 'ரஷ்ய மொழி (Russian)'
    },
    nativeTitle: 'Русский язык (Russian)',
    badge: {
      si: 'අ.පො.ස. උසස් පෙළ විෂය',
      en: 'G.C.E. A/L National Curriculum'
    },
    themeColor: 'cyan',
    gradientBg: 'from-cyan-500/10 via-blue-500/5 to-slate-500/10 dark:from-cyan-950/40 dark:to-slate-950/30',
    borderColor: 'border-cyan-300 dark:border-cyan-800',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    description: {
      si: 'සිරිලික් අක්ෂර 33, විභක්ති 6 (Cases), රුසියානු සාහිත්‍යය (පුෂ්කින්, තෝල්ස්තෝයි), සහ උසස් පෙළ විභාග ආදර්ශ ප්‍රශ්න.',
      en: 'Complete Cyrillic alphabet (33 letters), 6 Russian grammatical cases, basic conjugations, and classic A/L Russian literature extracts.',
      ta: 'சிரிலிக் எழுத்துக்கள் மற்றும் ரஷ்ய இலக்கணம்.'
    },
    introductionKaviVoice: {
      si: 'පුංචි යාළුවේ, රුසියන් භාෂාව අ.පො.ස. උසස් පෙළ කලා විෂය ධාරාවේ ඉහළ ලකුණු ලබාගත හැකි විශිෂ්ට භාෂාවකි! සිරිලික් අක්ෂර සහ මූලික වචන ඉගෙන ගනිමු!',
      en: 'Kavi says: Privet! Russian is a prestigious A/L subject with rich literature! Let us master the Cyrillic alphabet and conversational Russian!'
    },
    officialGuideRef: 'NIE G.C.E. A/L Russian Syllabus (Subject Code 28)',
    units: [
      {
        id: 'ru-u1',
        unitNumber: 1,
        competencyLevel: '1.1 - 1.3: Cyrillic Alphabet & Essential Greetings',
        title: {
          si: 'ඒකකය 01: සිරිලික් අක්ෂර මාලාව සහ මූලික ආචාර විධි',
          en: 'Unit 01: Cyrillic Alphabet & Greetings (Здравствуйте)',
          ta: 'அலகு 01: சிரிலிக் எழுத்துக்கள்'
        },
        description: {
          si: 'අක්ෂර 33ක් සහිත සිරිලික් හෝඩිය සහ දෛනික ආචාර සමාචාර.',
          en: '33 letters of Cyrillic script, pronunciation rules, and formal greetings.',
          ta: 'சிரிலிக் எழுத்துக்கள்.'
        },
        allocatedPeriods: 10,
        lessons: [
          {
            id: 'ru-u1-l1',
            lessonNumber: 1,
            title: {
              si: 'සිරිලික් අක්ෂර සහ Здравствуйте (ආයුබෝවන්)',
              en: 'Cyrillic Script & Formal Greetings',
              ta: 'சிரிலிக் எழுத்துக்கள் & வாழ்த்துக்கள்'
            },
            duration: '25 mins',
            niePeriodCount: 3,
            summary: {
              si: 'Здравствуйте (Zdrast-vuy-te) යනු ගෞරවනීය ආයුබෝවන් යන්නයි. Привет (Privet) යනු මිතුරන් අතර ආචාරයයි.',
              en: 'Formal: Здравствуйте (Zdravstvuyte). Informal: Привет (Privet). Спасибо (Spasibo) means thank you.',
              ta: 'வணக்கம் மற்றும் நன்றி.'
            },
            keyPoints: {
              si: [
                'Здравствуйте (Zdravstvuyte) - ආයුබෝවන් (ගෞරවනීය)',
                'Привет (Privet) - ආයුබෝවන් (මිත්‍රශීලී)',
                'Спасибо (Spasibo) - ස්තූතියි',
                'До свидания (Do svidaniya) - සමුගනිමි'
              ],
              en: [
                'Здравствуйте (Zdravstvuyte) - Hello (formal)',
                'Привет (Privet) - Hi (informal)',
                'Спасибо (Spasibo) - Thank you',
                'До свидания (Do svidaniya) - Goodbye'
              ],
              ta: ['Здравствуйте (வணக்கம்)', 'Спасибо (நன்றி)']
            }
          }
        ]
      }
    ],
    vocabularyList: [
      {
        id: 'ru-voc-1',
        term: 'Здравствуйте',
        transcription: 'Zdravstvuyte',
        meaning: {
          si: 'ආයුබෝවන් (ගෞරවනීය)',
          en: 'Hello / Greetings (Formal)',
          ta: 'வணக்கம்'
        },
        audioLangCode: 'ru-RU'
      },
      {
        id: 'ru-voc-2',
        term: 'Спасибо',
        transcription: 'Spasibo',
        meaning: {
          si: 'බොහොම ස්තූතියි',
          en: 'Thank you very much',
          ta: 'நன்றி'
        },
        audioLangCode: 'ru-RU'
      }
    ],
    modelQuestions: [
      {
        id: 'ru-q1',
        question: {
          si: "'Спасибо' (Spasibo) යන්නෙහි නිවැරදි සිංහල තේරුම කුමක්ද?",
          en: "What is the meaning of 'Спасибо' (Spasibo)?",
          ta: "'Спасибо' என்பதன் பொருள் என்ன?"
        },
        options: {
          si: ['ස්තූතියි (Thank you)', 'ආයුබෝවන් (Hello)', 'සමුගනිමි (Goodbye)', 'සුබ උදෑසනක්'],
          en: ['Thank you', 'Hello', 'Goodbye', 'Good morning'],
          ta: ['நன்றி', 'வணக்கம்', 'விடைபெறுகிறேன்', 'காலை வணக்கம்']
        },
        correctIndex: 0,
        explanation: {
          si: "'Спасибо' (Spasibo) යනු රුසියන් භාෂාවෙන් 'ස්තූතියි' යන්නයි.",
          en: "'Спасибо' (Spasibo) translates to 'Thank you'.",
          ta: "'Спасибо' என்பது 'நன்றி' ஆகும்."
        }
      }
    ],
    quickCheatSheet: {
      title: { si: 'රුසියන් භාෂා ඉක්මන් සටහන්', en: 'Russian Quick Notes' },
      rules: [
        { si: 'රුසියන් භාෂාවේ වර්තමාන කාලයේදී "is/am/are" (to be) ක්‍රියාපදය යොදන්නේ නැත. උදා: Я студент (මම ශිෂ්‍යයෙක්).', en: "Present tense 'to be' is omitted in Russian: Я студент (I am a student)." }
      ]
    }
  }
];
