export interface WordQuizQuestion {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  sinhalaMeaning: string;
  tamilMeaning: string;
  exampleSentence: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  category: 'Vocabulary' | 'Idioms' | 'Phrasal Verbs' | 'Everyday English';
}

export interface StoryGlossaryWord {
  word: string;
  meaningSinhala: string;
  meaningTamil: string;
  pronunciation: string;
}

export interface ShortStory {
  id: string;
  title: string;
  titleSinhala: string;
  theme: string;
  readTime: string;
  level: 'Easy' | 'Medium' | 'Inspiring';
  content: string;
  paragraphs: string[];
  glossary: StoryGlossaryWord[];
  moral: string;
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface EnglishRiddle {
  id: string;
  riddle: string;
  sinhalaClue: string;
  tamilClue: string;
  hint: string;
  options: string[];
  correctIndex: number;
  answer: string;
  funExplanation: string;
}

export interface MovieQuoteWisdom {
  id: string;
  quote: string;
  source: string;
  speaker: string;
  grammarFocus: string;
  sinhalaTranslation: string;
  tamilTranslation: string;
  lifeLesson: string;
}

export interface MascotStepDialogue {
  stepIntro: { en: string; si: string; ta: string };
  stepSuccess: { en: string; si: string; ta: string };
  encouragement: { en: string; si: string; ta: string };
}

export const FUN_WORD_QUIZZES: WordQuizQuestion[] = [
  {
    id: 'wq_1',
    word: 'Serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: 'noun',
    definition: 'The occurrence of finding valuable or agreeable things not sought for by chance.',
    sinhalaMeaning: 'අනපේක්ෂිත සුබ වාසනාව / නොසිතූ මොහොතක සිදුවන සුබදායී සිදුවීම',
    tamilMeaning: 'எதிர்பாராத நல்ல அதிர்ஷ்டம்',
    exampleSentence: 'Finding my lost notes just before the exam was pure serendipity!',
    question: 'Choose the sentence that correctly uses the word "Serendipity":',
    options: [
      'Finding my favourite storybook in a dusty old bookshop was pure serendipity.',
      'He used a lot of serendipity to calculate the physics vector problem.',
      'The stormy weather caused extreme serendipity across the coastal town.',
      'She ordered a serendipity with extra sugar at the school canteen.'
    ],
    correctIndex: 0,
    funFact: 'Did you know? The word "Serendipity" is historically derived from "Serendib", the ancient Arabic name for Sri Lanka!',
    category: 'Vocabulary'
  },
  {
    id: 'wq_2',
    word: 'Piece of cake',
    phonetic: '/piːs əv keɪk/',
    partOfSpeech: 'idiom',
    definition: 'Something that is very easy to accomplish or do.',
    sinhalaMeaning: 'ඉතාම පහසු කාර්යයක් (කජු කනවා වගේ ලේසි වැඩක්)',
    tamilMeaning: 'மிகவும் எளிதான காரியம்',
    exampleSentence: 'After practicing with Arana, the English grammar test was a piece of cake!',
    question: 'When someone says "The quiz was a piece of cake", what do they mean?',
    options: [
      'They ate a chocolate cake during the quiz.',
      'The quiz was surprisingly easy and straightforward.',
      'The quiz was extremely difficult and confusing.',
      'The teacher rewarded everyone with birthday cake.'
    ],
    correctIndex: 1,
    funFact: 'This sweet idiom originated in 19th-century cake-walk competitions where cake was awarded for easiest performances!',
    category: 'Idioms'
  },
  {
    id: 'wq_3',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.i.ənt/',
    partOfSpeech: 'adjective',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    sinhalaMeaning: 'බාධක හමුවේ නොසැලී යළි නැගී සිටින (දරාගැනීමේ හැකියාව ඇති)',
    tamilMeaning: 'மீண்டு எழும் ஆற்றல் கொண்ட / விடாமுயற்சி உள்ள',
    exampleSentence: 'Sri Lankan students are known to be hardworking and resilient.',
    question: 'What is the closest synonym for "Resilient"?',
    options: [
      'Fragile and weak',
      'Strong, adaptable, and persistent',
      'Careless and noisy',
      'Lazy and sleepy'
    ],
    correctIndex: 1,
    funFact: 'Trees in strong tropical storms bend instead of breaking because their fibers are naturally resilient!',
    category: 'Vocabulary'
  },
  {
    id: 'wq_4',
    word: 'Hit the books',
    phonetic: '/hɪt ðə bʊks/',
    partOfSpeech: 'idiom / phrasal',
    definition: 'To begin studying hard and with full concentration.',
    sinhalaMeaning: 'සම්පූර්ණ අවධානයෙන් පාඩම් කිරීමට පටන් ගන්නවා',
    tamilMeaning: 'கடினமாகப் படிக்கத் தொடங்குதல்',
    exampleSentence: 'Exams are only two weeks away, so it is time to hit the books!',
    question: 'If Sanduni tells her friend "I need to hit the books tonight", what will she do?',
    options: [
      'She is going to study her lessons intensively.',
      'She is going to physically throw her textbooks.',
      'She will go to a bookstore to purchase novels.',
      'She wants to play cricket using a book.'
    ],
    correctIndex: 0,
    funFact: 'American students popularized this energetic slang expression in the early 20th century.',
    category: 'Idioms'
  },
  {
    id: 'wq_5',
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    definition: 'Fluent or persuasive in speaking or writing.',
    sinhalaMeaning: 'චතුර ලෙස සහ සිත්ගන්නා සුළු ලෙස අදහස් ප්‍රකාශ කරන (චතුර කථික)',
    tamilMeaning: 'சொல்வன்மை மிக்க / நாவன்மை உடைய',
    exampleSentence: 'Her eloquent speech in the English Day debate captivated the whole hall.',
    question: 'Which person would best be described as "Eloquent"?',
    options: [
      'A debater who speaks with clarity, elegance, and persuasive power.',
      'A runner who sprints 100 meters under 11 seconds.',
      'A student who forgets to bring their geometry instruments.',
      'A painter who only uses black and white watercolors.'
    ],
    correctIndex: 0,
    funFact: 'From Latin "eloqui" meaning "to speak out". Reading stories aloud improves your own eloquence!',
    category: 'Vocabulary'
  }
];

export const SHORT_STORIES: ShortStory[] = [
  {
    id: 'story_sigiriya_firefly',
    title: 'The Firefly of Sigiriya Rock',
    titleSinhala: 'සීගිරි පර්වතයේ පුංචි කණාමැදිරියා',
    theme: 'Courage, Curiosity & Perseverance',
    readTime: '3 mins read',
    level: 'Inspiring',
    content: `Deep in the lush green forests of Matale, a little firefly named Kavi lived near the ancient fortress of Sigiriya. While the other fireflies only flew low near the lotus ponds, Kavi dreamed of flying all the way to the top of the majestic Lion Rock to gaze at the shining stars.

"You are too small, Kavi! The wind at the summit is too fierce," warned his elder brother. But Kavi practiced fluttering his tiny glowing wings every single twilight, strengthening his resolve.

One starlit evening, a gentle breeze swept through the emerald valley. Kavi began his ascent. He passed the famous Mirror Wall, whose polished surface reflected his amber light. Higher and higher he climbed, navigating past the colossal lion paws. 

When a gust of mountain wind tried to push him back, Kavi remembered to angle his wings smoothly with the breeze rather than fighting it head-on. With one final determined burst of energy, he landed softly on the ancient palace summit. 

From the pinnacle of Sigiriya, the entire island beneath looked like a tapestry of glittering emerald and gold under the moonlight. Kavi shone his brightest pulse of light, proving that even the smallest dreamer can illuminate the highest peaks through patience and persistence.`,
    paragraphs: [
      "Deep in the lush green forests of Matale, a little firefly named Kavi lived near the ancient fortress of Sigiriya. While the other fireflies only flew low near the lotus ponds, Kavi dreamed of flying all the way to the top of the majestic Lion Rock to gaze at the shining stars.",
      "\"You are too small, Kavi! The wind at the summit is too fierce,\" warned his elder brother. But Kavi practiced fluttering his tiny glowing wings every single twilight, strengthening his resolve.",
      "One starlit evening, a gentle breeze swept through the emerald valley. Kavi began his ascent. He passed the famous Mirror Wall, whose polished surface reflected his amber light. Higher and higher he climbed, navigating past the colossal lion paws.",
      "When a gust of mountain wind tried to push him back, Kavi remembered to angle his wings smoothly with the breeze rather than fighting it head-on. With one final determined burst of energy, he landed softly on the ancient palace summit.",
      "From the pinnacle of Sigiriya, the entire island beneath looked like a tapestry of glittering emerald and gold under the moonlight. Kavi shone his brightest pulse of light, proving that even the smallest dreamer can illuminate the highest peaks through patience and persistence."
    ],
    glossary: [
      { word: 'Majestic', meaningSinhala: 'තේජාන්විත / මනස්කාන්ත', meaningTamil: 'கம்பீரமான', pronunciation: '/məˈdʒes.tɪk/' },
      { word: 'Twilight', meaningSinhala: 'සන්ධ්‍යා කාලය (ඉර බැස යන හෝරාව)', meaningTamil: 'அந்திப் பொழுது', pronunciation: '/ˈtwaɪ.laɪt/' },
      { word: 'Resolve', meaningSinhala: 'ස්ථිර අදිටන / දැඩි අධිෂ්ඨානය', meaningTamil: 'உறுதிப்பாடு', pronunciation: '/rɪˈzɒlv/' },
      { word: 'Ascent', meaningSinhala: 'ඉහළට නැගීම / ආරෝහණය', meaningTamil: 'ஏறுதல்', pronunciation: '/əˈsent/' },
      { word: 'Pinnacle', meaningSinhala: 'උසස්ම මුදුන / ශිඛරය', meaningTamil: 'உச்சம்', pronunciation: '/ˈpɪn.ə.kəl/' }
    ],
    moral: 'Small steps, steady practice, and resilience can carry you over the tallest obstacles in life and learning.',
    comprehensionQuestions: [
      {
        question: 'What did Kavi dream of doing that other fireflies doubted?',
        options: [
          'Flying to the top of the Lion Rock summit',
          'Swimming across the Mahaweli River',
          'Building a nest inside the Sigiriya frescoes',
          'Sleeping under the lotus pond all day'
        ],
        correctIndex: 0,
        explanation: 'Kavi dreamed of ascending to the pinnacle of Sigiriya to look at the starlit sky.'
      },
      {
        question: 'How did Kavi overcome the fierce mountain wind gust?',
        options: [
          'By angling his wings smoothly with the breeze rather than fighting it directly',
          'By crying out loud for help from monkeys',
          'By giving up and flying down instantly',
          'By hiding inside an ancient clay pot'
        ],
        correctIndex: 0,
        explanation: 'Kavi used smart technique and resilience by angling his wings with the airflow.'
      }
    ]
  },
  {
    id: 'story_tea_garden_inventor',
    title: 'The Young Inventor of Nuwara Eliya',
    titleSinhala: 'නුවරඑළියේ පුංචි නව නිපැයුම්කරු',
    theme: 'Creativity, STEM & Empathy',
    readTime: '2.5 mins read',
    level: 'Easy',
    content: `In the misty hills of Nuwara Eliya, thirteen-year-old Malith watched his grandmother carefully carry heavy baskets of plucked tea leaves down the slippery slope. 

Malith loved tinkering with old bicycle gears, bamboo poles, and pulleys in his backyard shed. "Grandma works so hard in the morning chill. I must invent something to lighten her load," he thought.

Using recycled bicycle wheels, strong coir rope from his garden, and a counterweight basket, Malith built a simple gravity-powered aerial zipline between the upper tea terrace and the collection depot. 

When his grandmother gently placed the first basket into the carrier, Malith pulled the bamboo brake lever. Smoothly, the tea leaves glided down the hill in ten seconds, saving an hour of exhausting walking. His grandmother beamed with joy and gave him a warm cup of cardamom tea. 

Malith learned that true innovation is not about expensive technology; it is about using everyday knowledge with kindness to solve real problems.`,
    paragraphs: [
      "In the misty hills of Nuwara Eliya, thirteen-year-old Malith watched his grandmother carefully carry heavy baskets of plucked tea leaves down the slippery slope.",
      "Malith loved tinkering with old bicycle gears, bamboo poles, and pulleys in his backyard shed. \"Grandma works so hard in the morning chill. I must invent something to lighten her load,\" he thought.",
      "Using recycled bicycle wheels, strong coir rope from his garden, and a counterweight basket, Malith built a simple gravity-powered aerial zipline between the upper tea terrace and the collection depot.",
      "When his grandmother gently placed the first basket into the carrier, Malith pulled the bamboo brake lever. Smoothly, the tea leaves glided down the hill in ten seconds, saving an hour of exhausting walking. His grandmother beamed with joy and gave him a warm cup of cardamom tea.",
      "Malith learned that true innovation is not about expensive technology; it is about using everyday knowledge with kindness to solve real problems."
    ],
    glossary: [
      { word: 'Tinkering', meaningSinhala: 'අත්හදා බැලීම් කරමින් යමක් අලුත්වැඩියා කිරීම / සැකසීම', meaningTamil: 'பழுதுபார்த்தல்', pronunciation: '/ˈtɪŋ.kər.ɪŋ/' },
      { word: 'Counterweight', meaningSinhala: 'ප්‍රතිතුලන බර / සමබර කරන බර', meaningTamil: 'எடை சமநிலை', pronunciation: '/ˈkaʊn.tə.weɪt/' },
      { word: 'Innovation', meaningSinhala: 'නවෝත්පාදනය / නව නිමැවුම්කරණය', meaningTamil: 'புத்தாக்கம்', pronunciation: '/ˌɪn.əˈveɪ.ʃən/' }
    ],
    moral: 'Empathy combined with scientific curiosity leads to the most wonderful inventions.',
    comprehensionQuestions: [
      {
        question: 'What inspired Malith to create the gravity-powered zipline?',
        options: [
          'He wanted to help his grandmother carry heavy tea baskets without exhausting herself',
          'He wanted to sell tea directly to tourists for money',
          'He was competing in an international bicycle race',
          'He lost his school bag in the river'
        ],
        correctIndex: 0,
        explanation: 'Malith saw his grandmother working hard and used mechanics to lighten her daily load.'
      }
    ]
  }
];

export const ENGLISH_RIDDLES: EnglishRiddle[] = [
  {
    id: 'riddle_1',
    riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind and mountains. What am I?',
    sinhalaClue: 'කඳු අතරේදී ඔබේ කටහඬ ආපසු ඔබටම ඇසෙන්නේ කුමක් නිසාද?',
    tamilClue: 'மலையில் நீங்கள் பேசும்போது மீண்டும் கேட்கும் குரல் என்ன?',
    hint: 'Think about sound bouncing back in a valley or empty hall!',
    options: ['An Echo', 'A Cloud', 'A Waterfall', 'A Shadow'],
    correctIndex: 0,
    answer: 'An Echo (ප්‍රතිරාවය)',
    funExplanation: 'An echo is produced when sound waves bounce off a solid barrier like a cliff and travel back to your ears!'
  },
  {
    id: 'riddle_2',
    riddle: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    sinhalaClue: 'භූගෝල විද්‍යා පන්තියේදී අප භාවිතා කරන සිතියම මතකද?',
    tamilClue: 'வரைபடத்தில் காணப்படும் இடங்கள்!',
    hint: 'You use me in geography to navigate roads and continents without leaving your desk!',
    options: ['A Dream', 'A Map', 'A Mirror', 'A Video Game'],
    correctIndex: 1,
    answer: 'A Map (සිතියම)',
    funExplanation: 'A map depicts continents, oceans, and city coordinates symbolically without containing physical buildings!'
  },
  {
    id: 'riddle_3',
    riddle: 'The more you take, the more you leave behind. What are they?',
    sinhalaClue: 'ඔබ වැලි සහිත මුහුදු වෙරළේ හෝ පාරේ ඇවිද යනවිට ඉතිරි වන්නේ මොනවාද?',
    tamilClue: 'நடக்கும்போது பின்னால் விட்டுச்செல்லும் அடையாளம்!',
    hint: 'Look down at the floor as you walk forward!',
    options: ['Footsteps', 'Breaths', 'Photographs', 'Coins'],
    correctIndex: 0,
    answer: 'Footsteps (පා සටහන්)',
    funExplanation: 'Every step you take walking forward leaves an additional footprint behind you!'
  },
  {
    id: 'riddle_4',
    riddle: 'What has keys but no locks, space but no room, and you can enter but never go outside?',
    sinhalaClue: 'පරිගණකයක හෝ ලැප්ටොප් එකක ඔබ අකුරු ටයිප් කරන්නේ කුමකින්ද?',
    tamilClue: 'கணினியில் தட்டச்சு செய்ய உதவும் கருவி!',
    hint: 'It has Spacebar, Enter, and Shift!',
    options: ['A Piano', 'A Keyboard', 'A Treasure Chest', 'A Prison Cell'],
    correctIndex: 1,
    answer: 'A Keyboard (යතුරුපුවරුව)',
    funExplanation: 'A computer keyboard has letter keys, a Space bar, and an Enter key!'
  }
];

export const MOVIE_QUOTES: MovieQuoteWisdom[] = [
  {
    id: 'quote_1',
    quote: '"Do, or do not. There is no try."',
    source: 'Star Wars: The Empire Strikes Back',
    speaker: 'Master Yoda',
    grammarFocus: 'Imperative sentences (Giving strong, direct commands or philosophies)',
    sinhalaTranslation: '"කරන්න, නැතහොත් නොකර සිටින්න. උත්සාහ කරනවා කියා දෙයක් නැත (සම්පූර්ණ කැපවීමෙන් කාර්යයේ නිරත වන්න)."',
    tamilTranslation: '"செய் அல்லது செய்யாதே. முயற்சி என்பது மட்டும் போதாது (முழு ஈடுபாட்டுடன் செய்)."',
    lifeLesson: 'When you study or work towards your goals, commit 100% of your heart and energy rather than having half-hearted doubts.'
  },
  {
    id: 'quote_2',
    quote: '"It is not our abilities that show what we truly are… it is our choices."',
    source: 'Harry Potter and the Chamber of Secrets',
    speaker: 'Professor Dumbledore',
    grammarFocus: 'Cleft sentence structure ("It is not X that... it is Y") used for poetic emphasis',
    sinhalaTranslation: '"අප සැබවින්ම කවුරුන්දැයි පෙන්වන්නේ අප සතු සහජ දක්ෂතා නොව… අප ගන්නා නිවැරදි තීරණයි."',
    tamilTranslation: '"நாம் யார் என்பதை வெளிப்படுத்துவது நமது திறமைகள் அல்ல... நமது தேர்வுகள் தான்."',
    lifeLesson: 'Talent is good, but hard work, kindness, and making the right moral choices every day define true greatness.'
  },
  {
    id: 'quote_3',
    quote: '"The journey of a thousand miles begins with a single step."',
    source: 'Ancient Philosophy & Literature (Lao Tzu)',
    speaker: 'Classic Proverb',
    grammarFocus: 'Subject-Verb agreement with singular noun phrase "The journey"',
    sinhalaTranslation: '"සැතපුම් දහසක දුර ගමනක් වුවද ආරම්භ වන්නේ එකම එක කුඩා පියවරකිනි."',
    tamilTranslation: '"ஆயிரம் மைல் பயணமும் ஒரு சிறிய அடியில்தான் தொடங்குகிறது."',
    lifeLesson: 'Even the biggest A/L or O/L exam syllabus is conquered by simply studying one page, one formula, and one chapter today.'
  }
];

export const MASCOT_STEP_GUIDANCE: Record<number, MascotStepDialogue> = {
  1: {
    stepIntro: {
      en: "Hello champion! 🌟 Step 1: Let's warm up your brain with a fun Word & Idiom Challenge! Pick the right answer to earn points.",
      si: "ආයුබෝවන් යාලුවා! 🌟 පළමු පියවර: විනෝදජනක ඉංග්‍රීසි වචන සහ ප්‍රහේලිකා අභියෝගයෙන් පටන් ගනිමු. නිවැරදි පිළිතුර තෝරා ලකුණු දිනාගන්න!",
      ta: "வணக்கம்! 🌟 படி 1: சுவாரஸ்யமான ஆங்கில சொல் மற்றும் பழமொழி வினாடி வினாவைத் தொடங்குங்கள்!"
    },
    stepSuccess: {
      en: "Spectacular vocabulary mastery! 🎉 You crushed Step 1! Now let's smoothly move to Step 2: An inspiring short English story!",
      si: "විශිෂ්ටයි! 🎉 ඔබ පළමු පියවර සාර්ථකව අවසන් කළා. දැන් දෙවන පියවර වන 'කෙටි ඉංග්‍රීසි කතාවක් කියවමු' වෙත යමු!",
      ta: "அருமை! 🎉 படி 1 முடிந்தது. இப்போது படி 2: ஒரு சுவாரஸ்யமான ஆங்கிலக் கதையைப் படிப்போம்!"
    },
    encouragement: {
      en: "Take a deep breath and have fun. English is all about curiosity and practice!",
      si: "සන්සුන්ව විනෝදයෙන් පිළිතුරු දෙන්න. ඉංග්‍රීසි යනු බියවිය යුතු විෂයක් නොව විනෝදජනක භාෂාවකි!",
      ta: "பதற்றமின்றி பதிலளியுங்கள். ஆங்கிலம் சுவாரஸ்யமானது!"
    }
  },
  2: {
    stepIntro: {
      en: "Step 2 Unlocked! 📖 Let's read an inspiring short English story. You can listen to the audio voice and tap words for Sinhala/Tamil meanings!",
      si: "දෙවන පියවර විවෘතයි! 📖 ලස්සන කෙටි ඉංග්‍රීසි කතාවක් කියවමු. ශ්‍රව්‍ය හඬින් අසන්නට හෝ වචන මත ක්ලික් කර සිංහල තේරුම බලන්නත් පුළුවන්!",
      ta: "படி 2 திறக்கப்பட்டது! 📖 ஆங்கிலக் கதையைப் படித்து மகிழுங்கள்!"
    },
    stepSuccess: {
      en: "Bravo! 🌟 Your reading comprehension and pronunciation are fantastic! Ready for Step 3: Daily English Riddles & Famous Movie Quotes?",
      si: "නියමයි! 🌟 ඔබ කතාව ඉතා හොඳින් තේරුම් ගත්තා. දැන් තෙවන පියවර වන 'ඉංග්‍රීසි ප්‍රහේලිකා සහ සිනමා උපුටන' අභියෝගයට යමු!",
      ta: "அற்புதம்! 🌟 படி 3: ஆங்கில விடுகதைகள் மற்றும் பொன்மொழிகளை ஆராய்வோம்!"
    },
    encouragement: {
      en: "Reading just 5 minutes a day builds immense confidence for exams and future university interviews!",
      si: "දිනපතා විනාඩි 5ක් ඉංග්‍රීසි කතා කියවීමෙන් විභාගවලට මෙන්ම අනාගත සම්මුඛ පරීක්ෂණවලටත් ඉහළ ආත්මවිශ්වාසයක් ලැබෙයි!",
      ta: "தினமும் 5 நிமிடங்கள் வாசிப்பது உங்கள் நம்பிக்கையை வளர்க்கும்!"
    }
  },
  3: {
    stepIntro: {
      en: "Step 3: English Riddles & Movie Quotes Challenge! 🎬 Solve the riddle and discover golden life lessons hidden in iconic movie lines.",
      si: "තෙවන පියවර: දවසේ ඉංග්‍රීසි ප්‍රහේලිකාව සහ සිනමා උපුටන! 🎬 ප්‍රහේලිකාව විසඳා ප්‍රසිද්ධ චිත්‍රපට දෙබස්වල ඇති රසවත් පාඩම් හඳුනාගනිමු.",
      ta: "படி 3: ஆங்கில விடுகதைகள் மற்றும் திரைப்பட மேற்கோள்கள்!"
    },
    stepSuccess: {
      en: "Hooray! 🏆 You solved the riddle like a true detective! Now let's wrap up with the Relax & Guided Breather zone to recharge your brain!",
      si: "හුරේ! 🏆 ඔබ සියලු ප්‍රහේලිකා විශිෂ්ට ලෙස විසඳුවා. දැන් මොළය සන්සුන් කරගැනීමට 'විවේක සුවය & හුස්ම ගැනීමේ විරාමය' (Mindfulness Zone) වෙත යමු!",
      ta: "வெற்றி! 🏆 நீங்கள் புதிர்களைத் தீர்த்துவிட்டீர்கள். இப்போது ஓய்வு எடுப்போம்!"
    },
    encouragement: {
      en: "Look for clever clues in the riddle words. Think outside the box!",
      si: "ප්‍රහේලිකාවේ වචන අතර සඟවා ඇති හෝඩුවාවන් ගැන සිතන්න!",
      ta: "சொற்களில் உள்ள குறிப்புகளைக் கவனியுங்கள்!"
    }
  },
  4: {
    stepIntro: {
      en: "Bonus Step 4: Relax & Mindfulness Breather! 🌿 Breathe with the animated circle, enjoy a daily fortune, and collect your Master Badge!",
      si: "විවේක සුවය: හුස්ම ගැනීමේ විරාමය! 🌿 සන්සුන්ව හුස්ම ගෙන ආතතිය දුරුකර, අද දවසේ සතුටු පණිවිඩය (Fortune) ලබාගෙන සහතිකය ලබාගන්න!",
      ta: "படி 4: மன அமைதி மற்றும் ஓய்வு நேரம்! 🌿 புத்துணர்ச்சி பெறுங்கள்!"
    },
    stepSuccess: {
      en: "Congratulations! 🎓 You completed the entire Fun English & Relax Journey today! +100 XP Earned! Come back tomorrow for new challenges.",
      si: "සුබ පැතුම්! 🎓 ඔබ අද දවසේ සම්පූර්ණ ඉංග්‍රීසි විවේක අභියෝගය සාර්ථකව අවසන් කළා! +100 XP ඔබේ ගිණුමට එක්විය.",
      ta: "வாழ்த்துக்கள்! 🎓 இன்றைய அனைத்து சவால்களையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!"
    },
    encouragement: {
      en: "A calm mind learns twice as fast as a stressed mind. You are doing fantastic!",
      si: "සන්සුන් මනසකට ඕනෑම අමාරු පාඩමක් දෙගුණයක් වේගයෙන් මතක තබාගත හැකියි!",
      ta: "அமைதியான மனம் வேகமாக கற்கும்!"
    }
  }
};
