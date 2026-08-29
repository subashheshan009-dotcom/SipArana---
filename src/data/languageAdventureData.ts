export interface StoryVocabulary {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningEn: string;
  meaningSi: string;
  meaningTa: string;
  example: string;
}

export interface StoryQuizQuestion {
  id: string;
  questionEn: string;
  questionSi: string;
  options: {
    textEn: string;
    textSi: string;
    isCorrect: boolean;
  }[];
  explanationEn: string;
  explanationSi: string;
}

export interface IllustratedStory {
  id: string;
  titleEn: string;
  titleSi: string;
  titleTa: string;
  category: 'Folk Tale' | 'Science & Nature' | 'Adventure' | 'Moral Story';
  readingTimeMinutes: number;
  xpReward: number;
  coverImage: string;
  accentColor: string;
  characterDialogue: {
    character: string;
    avatar: string;
    quoteEn: string;
    quoteSi: string;
  };
  paragraphs: {
    en: string;
    si: string;
    highlightWords: string[];
  }[];
  vocabulary: StoryVocabulary[];
  quiz: StoryQuizQuestion[];
}

export interface SpeakingPhrase {
  id: string;
  phraseEn: string;
  phraseSi: string;
  phraseTa: string;
  phonetic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Daily Conversation' | 'School & Studies' | 'Creative Expression' | 'Exam Confidence';
  tipEn: string;
  tipSi: string;
  audioText: string;
}

export interface WritingPrompt {
  id: string;
  titleEn: string;
  titleSi: string;
  category: 'Creative Story' | 'Letter Writing' | 'Paragraph Description' | 'Exam Essay';
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  xpReward: number;
  instructionsEn: string;
  instructionsSi: string;
  suggestedKeywords: string[];
  sampleStarter: string;
  kaviTipEn: string;
  kaviTipSi: string;
}

export interface AdventureBadge {
  id: string;
  titleEn: string;
  titleSi: string;
  descEn: string;
  descSi: string;
  icon: string;
  category: 'speaking' | 'writing' | 'reading' | 'master';
  unlocked: boolean;
  requirement: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  glowColor: string;
}

export const ADVENTURE_STORIES: IllustratedStory[] = [
  {
    id: 'story_1',
    titleEn: 'The Brave Owl of Sinharaja Rainforest',
    titleSi: 'සිංහරාජයේ නිර්භීත බකමූණා',
    titleTa: 'சிங்கராஜ காட்டின் துணிச்சலான ஆந்தை',
    category: 'Adventure',
    readingTimeMinutes: 3,
    xpReward: 120,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    accentColor: 'emerald',
    characterDialogue: {
      character: 'Kavi Owl',
      avatar: '🦉',
      quoteEn: 'Discover the ancient whispers of the canopy! Notice the glowing emerald moss along the paths.',
      quoteSi: 'සිංහරාජයේ රහස් සොයා යමු! ගස් අතර ඇති දිදුලන පාසි දෙස බලන්න.'
    },
    paragraphs: [
      {
        en: 'Deep within the lush emerald heart of Sri Lanka’s Sinharaja Rainforest lived a wise little owl named Kavi. Unlike other night birds, Kavi loved to explore during the golden morning mist.',
        si: 'ශ්‍රී ලංකාවේ හරිතවත් සිංහරාජ වැසි වනාන්තරයේ හදවත තුළ කවි නම් ප්‍රඥාවන්ත කුඩා බකමූණෙක් වාසය කළේය. අනෙක් රාත්‍රී කුරුල්ලන්ට වඩා වෙනස්ව, කවි උදෑසන රන්වන් මීදුම අතරේ සැරිසැරීමට ප්‍රිය කළේය.',
        highlightWords: ['emerald', 'lush', 'explore']
      },
      {
        en: 'One stormy dawn, a gentle deer named Ruvi lost her way near the roaring Gin Ganga river. The water was rising rapidly, threatening the tranquil sanctuary of the woodland creatures.',
        si: 'එක් කුණාටු සහිත අලුයමක, රුවි නම් නිහඬ මුව පැටවා ගොරවන ගිං ගඟ අසල අතරමං විය. ජල මට්ටම වේගයෙන් ඉහළ යමින් තිබූ අතර, එය වන සතුන්ගේ සන්සුන් නිවහනට තර්ජනයක් විය.',
        highlightWords: ['roaring', 'tranquil', 'sanctuary']
      },
      {
        en: 'Kavi spread his majestic feathers, hovered high above the mist, and hooted a rhythmic melody that guided Ruvi safely to the highland rock shelter. All the creatures celebrated Kavi’s courage with sweet wild berries.',
        si: 'කවි තම අලංකාර පිහාටු විහිදා මීදුමට ඉහළින් පාවී ගොස්, තාලානුකූල හඬකින් රුවිව ආරක්ෂිතව උස් ගල් ගුහාව වෙත යොමු කළේය. සියලු වන සතුන් මිහිරි වල් බෙරි පලතුරු සමඟ කවිගේ නිර්භීතකම සැමරූහ.',
        highlightWords: ['majestic', 'rhythmic', 'courage']
      }
    ],
    vocabulary: [
      {
        word: 'Emerald',
        phonetic: '/ˈem.ər.əld/',
        partOfSpeech: 'adjective',
        meaningEn: 'A bright green gemstone color representing lush vegetation.',
        meaningSi: 'දීප්තිමත් නිල්-කොළ පැහැති මැණික් වර්ණය.',
        meaningTa: 'மரகத பச்சை நிறம்.',
        example: 'The rain turned the tea plantation into a shining emerald carpet.'
      },
      {
        word: 'Tranquil',
        phonetic: '/ˈtræŋ.kwɪl/',
        partOfSpeech: 'adjective',
        meaningEn: 'Calm, peaceful, and quiet without disturbance.',
        meaningSi: 'සන්සුන්, නිහඬ සහ ශාන්ත වූ.',
        meaningTa: 'அமைதியான மற்றும் நிம்மதியான.',
        example: 'Early morning meditation near Kandy Lake is tranquil.'
      },
      {
        word: 'Sanctuary',
        phonetic: '/ˈsæŋk.tʃu.er.i/',
        partOfSpeech: 'noun',
        meaningEn: 'A safe haven or nature reserve protecting wildlife.',
        meaningSi: 'අභයභූමියක් හෝ ආරක්ෂිත ස්ථානයක්.',
        meaningTa: 'விலங்குகள் சரணாலயம் / புகலிடம்.',
        example: 'Sinharaja is a UNESCO world heritage sanctuary.'
      },
      {
        word: 'Majestic',
        phonetic: '/məˈdʒes.tɪk/',
        partOfSpeech: 'adjective',
        meaningEn: 'Having impressive beauty, dignity, or grandeur.',
        meaningSi: 'තේජාන්විත, ගම්භීර සහ අතිශය මනරම්.',
        meaningTa: 'கம்பீரமான மற்றும் அழகிய.',
        example: 'Sigiriya Rock fortress stands as a majestic historical monument.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        questionEn: 'Where did Kavi the wise owl live?',
        questionSi: 'කවි බකමූණා ජීවත් වූයේ කොහේද?',
        options: [
          { textEn: 'Sinharaja Rainforest', textSi: 'සිංහරාජ වැසි වනාන්තරයේ', isCorrect: true },
          { textEn: 'Yala National Park', textSi: 'යාල ජාතික වනෝද්‍යානයේ', isCorrect: false },
          { textEn: 'Horton Plains', textSi: 'හෝර්ටන් තැන්නෙහි', isCorrect: false },
          { textEn: 'Wilpattu Park', textSi: 'විල්පත්තුවේ', isCorrect: false }
        ],
        explanationEn: 'Kavi lived deep within the emerald heart of Sinharaja Rainforest.',
        explanationSi: 'කවි වාසය කළේ සිංහරාජ වැසි වනාන්තරයේ හරිතවත් හදවත තුළයි.'
      },
      {
        id: 'q2',
        questionEn: 'How did Kavi help Ruvi the deer escape the rising river?',
        questionSi: 'ජලය ඉහළ යන විට කවි රුවි මුව පැටවාට උදව් කළේ කෙසේද?',
        options: [
          { textEn: 'By carrying her on his back', textSi: 'ඇයව පිට මත හොවාගෙන', isCorrect: false },
          { textEn: 'By hooting a rhythmic melody from above the mist', textSi: 'මීදුමට ඉහළින් තාලානුකූල හඬක් නගමින් මඟ පෙන්වීමෙන්', isCorrect: true },
          { textEn: 'By building a wooden bridge', textSi: 'ලී පාලමක් ඉදිකිරීමෙන්', isCorrect: false },
          { textEn: 'By asking an elephant for help', textSi: 'අලියෙකුගෙන් උදව් ඉල්ලීමෙන්', isCorrect: false }
        ],
        explanationEn: 'Kavi hovered high above the mist and guided Ruvi with rhythmic calls to a rock shelter.',
        explanationSi: 'කවි මීදුමට ඉහළින් පාවී යමින් තාලානුකූල හඬකින් රුවිව ආරක්ෂිත ගල් ගුහාව වෙත යොමු කළේය.'
      }
    ]
  },
  {
    id: 'story_2',
    titleEn: 'The Young Inventor and the Solar Lamp',
    titleSi: 'තරුණ නව නිපැයුම්කරු සහ සූර්ය ලාම්පුව',
    titleTa: 'இளம் கண்டுபிடிப்பாளரும் சூரிய விளக்கும்',
    category: 'Science & Nature',
    readingTimeMinutes: 4,
    xpReward: 140,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    accentColor: 'indigo',
    characterDialogue: {
      character: 'Dinuka with Tablet',
      avatar: '👦‍💻',
      quoteEn: 'Curiosity transforms simple ideas into brilliant solutions. Let’s read and learn new words!',
      quoteSi: 'කුතුහලය සරල අදහස් විශිෂ්ට විසඳුම් බවට පත් කරයි. අලුත් වචන ඉගෙන ගනිමු!'
    },
    paragraphs: [
      {
        en: 'In a picturesque village nestled near the misty hills of Ella, a twelve-year-old student named Tarik loved tinkering with old circuits and copper wires.',
        si: 'ඇල්ලේ මීදුම් සහිත කඳු පාමුල පිහිටි සුන්දර ගම්මානයක, තාරික් නම් දොළොස් හැවිරිදි සිසුවා පැරණි පරිපථ සහ තඹ වයර් සමඟ අත්හදා බැලීම් කිරීමට ප්‍රිය කළේය.',
        highlightWords: ['picturesque', 'circuits', 'tinkering']
      },
      {
        en: 'During the heavy monsoon showers, village power outages often disrupted study hours. Tarik was determined to create a sustainable solution using recycled coconut shells and mini solar photovoltaic cells.',
        si: 'අධික මෝසම් වැසි කාලයේදී, විදුලිය විසන්ධි වීම නිසා පාඩම් කරන වේලාවන්ට නිතර බාධා ඇති විය. ප්‍රතිචක්‍රීකරණය කළ පොල් කටු සහ කුඩා සූර්ය කෝෂ භාවිතා කරමින් තිරසාර විසඳුමක් නිර්මාණය කිරීමට තාරික් අධිෂ්ඨාන කරගත්තේය.',
        highlightWords: ['monsoon', 'disrupted', 'sustainable']
      },
      {
        en: 'Within a week of perseverance, his compact "Eco-Lantern" illuminated his desk with bright, eco-friendly light. His teacher praised his ingenuity and showcased it at the National Junior Science Fair.',
        si: 'සතියක නොපසුබට උත්සාහයකින් පසුව, ඔහුගේ කුඩා "පරිසර ලාම්පුව" ඔහුගේ මේසය දීප්තිමත් පරිසර හිතකාමී ආලෝකයකින් ඒකාලෝක කළේය. ඔහුගේ ගුරුවරයා ඔහුගේ නිර්මාණශීලී කුසලතාව අගය කළ අතර එය ජාතික කනිෂ්ඨ විද්‍යා ප්‍රදර්ශනයේ ප්‍රදර්ශනය කළේය.',
        highlightWords: ['perseverance', 'illuminated', 'ingenuity']
      }
    ],
    vocabulary: [
      {
        word: 'Picturesque',
        phonetic: '/ˌpɪk.tʃərˈesk/',
        partOfSpeech: 'adjective',
        meaningEn: 'Visually charming or quaint, like a beautiful painted picture.',
        meaningSi: 'චිත්‍රයක් මෙන් අතිශය චමත්කාරජනක හා මනරම්.',
        meaningTa: 'சித்திரம் போன்ற அழகான.',
        example: 'Ella Gap offers a picturesque view of the southern plains.'
      },
      {
        word: 'Sustainable',
        phonetic: '/səˈsteɪ.nə.bəl/',
        partOfSpeech: 'adjective',
        meaningEn: 'Able to be maintained over time without depleting natural resources.',
        meaningSi: 'ස්වාභාවික සම්පත් විනාශ නොවන පරිදි පවත්වාගත හැකි තිරසාර.',
        meaningTa: 'நிலைத்து நிற்கக்கூடிய / நீடித்த.',
        example: 'Solar and wind energy provide sustainable power.'
      },
      {
        word: 'Perseverance',
        phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
        partOfSpeech: 'noun',
        meaningEn: 'Continued effort to do something despite difficulties.',
        meaningSi: 'බාධක හමුවේ නොසැලී ඉදිරියටම යාම (නොපසුබට උත්සාහය).',
        meaningTa: 'விடாமுயற்சி.',
        example: 'Her perseverance in solving hard math problems brought top results.'
      },
      {
        word: 'Ingenuity',
        phonetic: '/ˌɪn.dʒəˈnjuː.ə.ti/',
        partOfSpeech: 'noun',
        meaningEn: 'The quality of being clever, original, and inventive.',
        meaningSi: 'විශිෂ්ට නිර්මාණශීලී ඥානය සහ දක්ෂතාව.',
        meaningTa: 'புத்தி கூர்மை மற்றும் புத்தாக்கத் திறன்.',
        example: 'Ancient Sri Lankan irrigation systems demonstrate unmatched ingenuity.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        questionEn: 'What problem motivated Tarik to build the solar lamp?',
        questionSi: 'සූර්ය ලාම්පුව සෑදීමට තාරික්ව පෙළඹවූ ගැටලුව කුමක්ද?',
        options: [
          { textEn: 'Power outages during monsoon rains disrupting study', textSi: 'මෝසම් වැසි සමයේ විදුලිය විසන්ධි වීමෙන් පාඩම් කිරීමට බාධා වීම', isCorrect: true },
          { textEn: 'He wanted to sell lamps in the market', textSi: 'කඩේ ලාම්පු විකිණීමට අවශ්‍ය වීම', isCorrect: false },
          { textEn: 'His flashlight ran out of batteries', textSi: 'විදුලි පන්දමේ බැටරි බැසීම', isCorrect: false },
          { textEn: 'He needed light for fishing', textSi: 'මාළු ඇල්ලීමට එළිය අවශ්‍ය වීම', isCorrect: false }
        ],
        explanationEn: 'Frequent power cuts during the heavy monsoon season disrupted his night study routine.',
        explanationSi: 'අධික වර්ෂාව ඇති කාලයේ විදුලිය ඇනහිටීම නිසා රාත්‍රී පාඩම් වැඩ අඩාල විය.'
      }
    ]
  },
  {
    id: 'story_3',
    titleEn: 'The Secret of the Sigiriya Frescoes',
    titleSi: 'සීගිරියේ බිතුසිතුවම් රහස',
    titleTa: 'சிகிரியா சுவரோவியங்களின் ரகசியம்',
    category: 'Folk Tale',
    readingTimeMinutes: 3,
    xpReward: 130,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    accentColor: 'purple',
    characterDialogue: {
      character: 'Sari Scholar Girl',
      avatar: '👧🏻',
      quoteEn: 'History holds poetic wonder! Pay attention to the vibrant colors preserved over 1,500 years.',
      quoteSi: 'ඉතිහාසය කාව්‍යමය විශ්මයකින් පිරී ඇත! වසර 1,500ක් පුරා රැකුණු බිතුසිතුවම් වල වර්ණ දෙස අවධානය යොමු කරන්න.'
    },
    paragraphs: [
      {
        en: 'Rising sheer from the central plains, the ancient rock citadel of Sigiriya was built by King Kashyapa in the 5th century as a magnificent palace in the sky.',
        si: 'මධ්‍යම තැනිතලාවෙන් අහසට නැඟුණු ඓතිහාසික සීගිරි පර්වතය පස්වන සියවසේදී කාශ්‍යප රජු විසින් අහසේ පිහිටි තේජාන්විත මාලිගාවක් ලෙස ඉදිකරන ලදී.',
        highlightWords: ['citadel', 'magnificent']
      },
      {
        en: 'Halfway up the sheer granite cliff, hidden inside a sheltered pocket, celestial maidens painted in brilliant ochre, gold, and green hold lotus blossoms with enchanting smiles.',
        si: 'දැවැන්ත ග්‍රැනයිට් පර්වතයේ මැද කොටසේ පිහිටි ආරක්ෂිත කුහරයක, දීප්තිමත් කහ, රන් සහ කොළ පැහැයෙන් සිත්තම් කළ දිව්‍යාංගනාවන් මනස්කාන්ත සිනහවකින් යුතුව නෙළුම් මල් දරා සිටිති.',
        highlightWords: ['celestial', 'enchanting']
      }
    ],
    vocabulary: [
      {
        word: 'Citadel',
        phonetic: '/ˈsɪt.ə.del/',
        partOfSpeech: 'noun',
        meaningEn: 'A fortress, typically on high ground, protecting or dominating a city.',
        meaningSi: 'උස් බිමක ඉදිකළ ආරක්ෂිත බලකොටුව.',
        meaningTa: 'கோட்டை / காவல் அரண்.',
        example: 'Sigiriya served as a royal citadel and an aesthetic masterpiece.'
      },
      {
        word: 'Celestial',
        phonetic: '/sɪˈles.ti.əl/',
        partOfSpeech: 'adjective',
        meaningEn: 'Belonging or relating to heaven or divine beauty.',
        meaningSi: 'දිව්‍යමය, අහස්ගැබට හෝ දෙව්ලොවට අයත්.',
        meaningTa: 'வானுலக / தெய்வீக.',
        example: 'The Sigiriya maidens are depicted as celestial cloud nymphs.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        questionEn: 'Who built the ancient sky citadel of Sigiriya in the 5th century?',
        questionSi: '5 වන සියවසේදී සීගිරිය ඉදිකළ රජු කවුද?',
        options: [
          { textEn: 'King Kashyapa', textSi: 'කාශ්‍යප රජු', isCorrect: true },
          { textEn: 'King Parakramabahu', textSi: 'පරාක්‍රමබාහු රජු', isCorrect: false },
          { textEn: 'King Dutugemunu', textSi: 'දුටුගැමුණු රජු', isCorrect: false },
          { textEn: 'King Devanampiyatissa', textSi: 'දේවානම්පියතිස්ස රජු', isCorrect: false }
        ],
        explanationEn: 'Sigiriya was constructed by King Kashyapa as a royal fortress and palace.',
        explanationSi: 'සීගිරිය රාජකීය බලකොටුවක් සහ මාලිගාවක් ලෙස කාශ්‍යප රජු විසින් ගොඩනංවන ලදී.'
      }
    ]
  }
];

export const SPEAKING_PHRASES: SpeakingPhrase[] = [
  {
    id: 'sp_1',
    phraseEn: 'Good morning! I am excited to practice my English today.',
    phraseSi: 'සුබ උදෑසනක්! අද මගේ ඉංග්‍රීසි පුහුණු වීමට මම මහත් උනන්දුවෙන් සිටිමි.',
    phraseTa: 'காலை வணக்கம்! இன்று எனது ஆங்கிலத்தைப் பயிற்சி செய்ய ஆவலாக உள்ளேன்.',
    phonetic: '/ɡʊd ˈmɔː.nɪŋ aɪ æm ɪkˈsaɪ.tɪd tuː ˈpræk.tɪs maɪ ˈɪŋ.ɡlɪʃ/',
    level: 'Beginner',
    category: 'Daily Conversation',
    tipEn: 'Smile gently while speaking to give your voice a warm, bright tone.',
    tipSi: 'කතා කරන විට සිනහමුසු මුහුණින් සිටීමෙන් ඔබේ කටහඬ මිහිරි හා ආකර්ශනීය වේ.',
    audioText: 'Good morning! I am excited to practice my English today.'
  },
  {
    id: 'sp_2',
    phraseEn: 'Could you please explain this mathematics theorem step by step?',
    phraseSi: 'කරුණාකර මෙම ගණිත ප්‍රමේයය පියවරෙන් පියවර පැහැදිලි කළ හැකිද?',
    phraseTa: 'தயவுசெய்து இந்த கணித தேற்றத்தை படிப்படியாக விளக்க முடியுமா?',
    phonetic: '/kʊd juː pliːz ɪkˈspleɪn ðɪs ˌmæθ.əˈmæt.ɪks ˈθɪə.rəm step baɪ step/',
    level: 'Intermediate',
    category: 'School & Studies',
    tipEn: 'Emphasize the words "explain" and "step by step" with polite upward intonation.',
    tipSi: '"explain" සහ "step by step" යන වචන සුහදශීලීව අවධාරණය කරන්න.',
    audioText: 'Could you please explain this mathematics theorem step by step?'
  },
  {
    id: 'sp_3',
    phraseEn: 'Consistency and active revision are the true secrets to academic excellence.',
    phraseSi: 'අඛණ්ඩතාව සහ සක්‍රිය පුනරීක්ෂණය අධ්‍යාපනික විශිෂ්ටත්වයේ සැබෑ රහසයි.',
    phraseTa: 'தொடர்ச்சியான முயற்சியும் மறுஆய்வும் கல்விச் சிறப்பிற்கு உண்மையான திறவுகோல்.',
    phonetic: '/kənˈsɪs.tən.si ænd ˈæk.tɪv rɪˈvɪʒ.ən ɑː ðə truː ˈsiː.krəts/',
    level: 'Advanced',
    category: 'Exam Confidence',
    tipEn: 'Pause slightly after "Consistency" to allow the key concept to resonate.',
    tipSi: '"Consistency" යන වචනයට පසු සුළු විරාමයක් තබා මීළඟ කොටස පවසන්න.',
    audioText: 'Consistency and active revision are the true secrets to academic excellence.'
  },
  {
    id: 'sp_4',
    phraseEn: 'Sri Lanka is renowned worldwide for its Ceylon tea and rich biodiversity.',
    phraseSi: 'ශ්‍රී ලංකාව සිය සිලෝන් තේ සහ පොහොසත් ජෛව විවිධත්වය හේතුවෙන් ලොව පුරා ප්‍රසිද්ධය.',
    phraseTa: 'இலங்கை தனது சிலோன் தேயிலை மற்றும் வளமான பல்லுயிர் பெருக்கத்திற்கு உலகப் புகழ் பெற்றது.',
    phonetic: '/sri ˈlæŋ.kə ɪz rɪˈnaʊnd ˌwɜːldˈwaɪd fɔːr ɪts ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/',
    level: 'Intermediate',
    category: 'Creative Expression',
    tipEn: 'Pronounce "renowned" as /rɪ-nownd/ with a soft trailing d sound.',
    tipSi: '"renowned" යන්න පැහැදිලිව නිවැරදි උච්චාරණයෙන් කියවන්න.',
    audioText: 'Sri Lanka is renowned worldwide for its Ceylon tea and rich biodiversity.'
  },
  {
    id: 'sp_5',
    phraseEn: 'I believe with dedication and clear planning, I can achieve high results in my exams.',
    phraseSi: 'කැපවීම සහ පැහැදිලි සැලසුම්කරණය සමඟ මගේ විභාග වලින් ඉහළ ප්‍රතිඵල ලබාගත හැකි බව මම විශ්වාස කරමි.',
    phraseTa: 'அர்ப்பணிப்பு மற்றும் தெளிவான திட்டமிடல் மூலம் பரீட்சைகளில் உயர் தேர்ச்சி பெற முடியும் என நம்புகிறேன்.',
    phonetic: '/aɪ bɪˈliːv wɪð ˌded.ɪˈkeɪ.ʃən ænd klɪər ˈplæn.ɪŋ aɪ kæn əˈtʃiːv haɪ rɪˈzʌlts/',
    level: 'Advanced',
    category: 'Exam Confidence',
    tipEn: 'Deliver with confident breathing and clear eye contact posture.',
    tipSi: 'විශ්වාසයෙන් හා සෘජු ඉරියව්වකින් යුතුව පවසන්න.',
    audioText: 'I believe with dedication and clear planning, I can achieve high results in my exams.'
  }
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wp_1',
    titleEn: 'My Favorite Place in Sri Lanka',
    titleSi: 'මා වඩාත්ම ප්‍රිය කරන ශ්‍රී ලාංකීය ස්ථානය',
    category: 'Creative Story',
    difficulty: 'Easy',
    xpReward: 100,
    instructionsEn: 'Write 3-5 sentences describing a place you love (e.g. Ella, Galle Fort, Kandy Lake, or your village school). Mention why it is special to you.',
    instructionsSi: 'ඔබ ප්‍රිය කරන ස්ථානයක් ගැන වාක්‍ය 3-5ක් ලියන්න (උදා: ඇල්ල, ගාලු කොටුව, නුවර වැව හෝ ඔබේ ගමේ පාසල). එය ඔබට විශේෂ වන්නේ මන්දැයි සඳහන් කරන්න.',
    suggestedKeywords: ['scenic', 'peaceful', 'memories', 'breeze', 'heritage'],
    sampleStarter: 'One of the most breathtaking places I have ever visited is...',
    kaviTipEn: 'Use sensory words! What did you see, hear, or feel in that place?',
    kaviTipSi: 'ඉන්ද්‍රිය ගෝචර වචන යොදාගන්න! ඔබට එහිදී පෙනුණු, ඇසුණු හෝ දැනුණු දේ ලියන්න.'
  },
  {
    id: 'wp_2',
    titleEn: 'How Technology Helps Modern Education',
    titleSi: 'තාක්ෂණය නවීන අධ්‍යාපනයට උපකාරී වන ආකාරය',
    category: 'Exam Essay',
    difficulty: 'Medium',
    xpReward: 150,
    instructionsEn: 'Write a short persuasive paragraph (4-6 sentences) explaining how AI tools, digital textbooks, and smart study apps assist students in preparing for exams.',
    instructionsSi: 'AI මෙවලම්, ඩිජිටල් පෙළපොත් සහ ස්මාර්ට් යෙදුම් සිසුන්ට විභාග සඳහා සූදානම් වීමට උපකාරී වන ආකාරය පැහැදිලි කරමින් කෙටි ඡේදයක් ලියන්න.',
    suggestedKeywords: ['accessible', 'interactive', 'efficiency', 'comprehension', 'knowledge'],
    sampleStarter: 'In today’s digital era, technology has revolutionized the way students learn by...',
    kaviTipEn: 'Connect your points using transition words like "Furthermore", "In addition", and "Therefore".',
    kaviTipSi: '"Furthermore", "In addition", සහ "Therefore" වැනි සම්බන්ධක පද භාවිත කරන්න.'
  },
  {
    id: 'wp_3',
    titleEn: 'A Letter to a Pen Pal Describing Sinhala & Tamil New Year',
    titleSi: 'සිංහල හා දෙමළ අලුත් අවුරුද්ද විස්තර කරමින් මිතුරෙකුට ලියන ලිපියක්',
    category: 'Letter Writing',
    difficulty: 'Medium',
    xpReward: 130,
    instructionsEn: 'Write a friendly letter greeting a friend abroad and sharing 2 exciting traditions of the April New Year festival (such as sweet treats like Kiribath & Kavum, and traditional games).',
    instructionsSi: 'විදේශයක සිටින මිතුරෙකුට අප්‍රේල් අලුත් අවුරුදු චාරිත්‍ර (කිරිබත්, කැවුම් සහ සාම්ප්‍රදායික ජන ක්‍රීඩා) පිළිබඳ විස්තර කරමින් මිත්‍රශීලී ලිපියක් ලියන්න.',
    suggestedKeywords: ['celebration', 'auspicious', 'tradition', 'delicacies', 'harmony'],
    sampleStarter: 'Dear Alex, I hope this letter finds you well! I am writing to share our joyous April festival...',
    kaviTipEn: 'Remember the standard friendly letter format: Greeting, Body paragraph, and Warm closing!',
    kaviTipSi: 'සුබපැතුම, ප්‍රධාන ඡේදය සහ අවසන් කිරීම නිවැරදි ආකෘතියට අනුව ලියන්න.'
  }
];

export const ADVENTURE_BADGES: AdventureBadge[] = [
  {
    id: 'badge_speech_star',
    titleEn: 'Speech Star 🎙️',
    titleSi: 'කථික තාරකාව',
    descEn: 'Complete 3 pronunciation practice sessions with 90%+ voice accuracy.',
    descSi: '90%කට වැඩි නිවැරදි උච්චාරණයෙන් කථන සැසි 3ක් සම්පූර්ණ කරන්න.',
    icon: '🎙️',
    category: 'speaking',
    unlocked: true,
    requirement: '3 Spoken Sessions',
    rarity: 'Rare',
    glowColor: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'badge_writing_wizard',
    titleEn: 'Writing Wizard ✍️',
    titleSi: 'ලේඛන මායාකරුවා',
    descEn: 'Draft and review a complete essay using the glowing ink parchment with zero grammatical errors.',
    descSi: 'ව්‍යාකරණ දෝෂ රහිතව සම්පූර්ණ රචනාවක් සම්පාදනය කරන්න.',
    icon: '✍️',
    category: 'writing',
    unlocked: true,
    requirement: 'Parchment Essay Completed',
    rarity: 'Epic',
    glowColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'badge_story_explorer',
    titleEn: 'Story Explorer 📖',
    titleSi: 'කතා ගවේෂකයා',
    descEn: 'Read all illustrated tales and score 100% on reading comprehension quizzes.',
    descSi: 'සියලුම චිත්‍රකතා කියවා අවබෝධාත්මක ප්‍රශ්නාවලියෙන් 100%ක් ලකුණු ලබාගන්න.',
    icon: '📖',
    category: 'reading',
    unlocked: true,
    requirement: '100% Story Quiz Accuracy',
    rarity: 'Rare',
    glowColor: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'badge_polyglot_master',
    titleEn: 'Polyglot Master 🦉',
    titleSi: 'භාෂා විශාරදයා',
    descEn: 'Master Speaking, Writing, and Reading challenges in a single continuous 7-day streak.',
    descSi: 'දින 7ක අඛණ්ඩ අධ්‍යයනයක් සමඟ සියලු භාෂා අභියෝග ජයගන්න.',
    icon: '🦉',
    category: 'master',
    unlocked: false,
    requirement: '7-Day Tri-Module Streak',
    rarity: 'Legendary',
    glowColor: 'from-amber-400 to-orange-500'
  }
];

export const ADVENTURE_LEADERBOARD = [
  {
    rank: 1,
    name: 'Kavindu Theekshana',
    district: 'Colombo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    speakingScore: 98,
    writingWords: 1420,
    storiesRead: 12,
    totalXP: 3840,
    streak: 28,
    badge: '🦉 Polyglot Master'
  },
  {
    rank: 2,
    name: 'Methmi Nethsara',
    district: 'Kandy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    speakingScore: 96,
    writingWords: 1250,
    storiesRead: 10,
    totalXP: 3410,
    streak: 21,
    badge: '🎙️ Speech Star'
  },
  {
    rank: 3,
    name: 'Dinuka Senarath',
    district: 'Galle',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    speakingScore: 94,
    writingWords: 1180,
    storiesRead: 9,
    totalXP: 2950,
    streak: 16,
    badge: '✍️ Writing Wizard'
  },
  {
    rank: 4,
    name: 'Anuki Perera',
    district: 'Kurunegala',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    speakingScore: 92,
    writingWords: 990,
    storiesRead: 8,
    totalXP: 2620,
    streak: 14,
    badge: '📖 Story Explorer'
  },
  {
    rank: 5,
    name: 'Sahan Sandeepa',
    district: 'Matara',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    speakingScore: 90,
    writingWords: 840,
    storiesRead: 7,
    totalXP: 2280,
    streak: 11,
    badge: '🌟 Rising Scholar'
  }
];
