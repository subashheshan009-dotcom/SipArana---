export interface GoogleToolDef {
  id: 'translate' | 'socratic' | 'scholar' | 'classroom' | 'arts_culture' | 'cs_first' | 'earth';
  name: string;
  nameSinhala: string;
  nameTamil: string;
  tagline: string;
  taglineSinhala: string;
  badge: string;
  category: string;
  color: string;
  bgGradient: string;
  iconName: string;
  description: string;
  descriptionSinhala: string;
  mascotTip: {
    si: string;
    ta: string;
    en: string;
  };
  features: {
    title: string;
    titleSinhala: string;
    desc: string;
  }[];
}

export const GOOGLE_TOOLS: GoogleToolDef[] = [
  {
    id: 'translate',
    name: 'Google Translate',
    nameSinhala: 'ගූගල් පරිවර්තකය (Google Translate)',
    nameTamil: 'கூகிள் மொழிபெயர்ப்பாளர்',
    tagline: 'Instant Multilingual Learning & Subject Vocabulary',
    taglineSinhala: 'සිංහල, දෙමළ සහ ඉංග්‍රීසි ක්ෂණික විෂය වචන පරිවර්තනය හා උච්චාරණය',
    badge: 'Real-Time Language Hub',
    category: 'Language & Communication',
    color: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-cyan-500/10',
    iconName: 'Languages',
    description: 'Break language barriers across English, Sinhala, and Tamil for exam papers, complex science/commerce terms, and spoken fluency.',
    descriptionSinhala: 'විභාග ප්‍රශ්න පත්‍ර, විද්‍යා හා වාණිජ තාක්ෂණික පාරිභාෂික වචන සහ ඉංග්‍රීසි භාෂා ඥානය ක්ෂණිකව සිංහල/දෙමළ භාෂාවෙන් තේරුම් ගන්න.',
    mascotTip: {
      si: '💡 මම ඔබට උපදෙසක් දෙන්නම්! විද්‍යා හෝ තාක්ෂණික වචන (Scientific Terms) ඉංග්‍රීසියෙන් කියවා තේරුම් ගැනීමට මෙම මෙවලම භාවිත කරන්න. ඔබට ශ්‍රව්‍ය උච්චාරණයද (Audio Pronunciation) මෙහිදීම අසා පුහුණු විය හැකියි!',
      ta: '💡 அறிவியல் மற்றும் தொழில்நுட்ப சொற்களை தமிழில் மொழிபெயர்த்து உச்சரிப்பைக் கேட்க இந்த கருவியைப் பயன்படுத்துங்கள்!',
      en: '💡 Tip from Arana: Use the integrated translator to master tricky English terms for Science, ICT, and Commerce with one-click voice pronunciation!'
    },
    features: [
      {
        title: 'Sinhala-Tamil-English Instant Translator',
        titleSinhala: 'ක්ෂණික ත්‍රිභාෂා පරිවර්තනය',
        desc: 'Translate complex paragraphs and sentences between English, Sinhala, and Tamil with high accuracy.'
      },
      {
        title: 'Subject-Specific Vocabulary Bank',
        titleSinhala: 'විෂය පාරිභාෂික වචන මාලාව',
        desc: 'Pre-loaded glossary of AL/OL Science, ICT, Mathematics, and Business vocabulary.'
      },
      {
        title: 'Voice Pronunciation Engine',
        titleSinhala: 'හඬ උච්චාරණ පුහුණුව (Text-to-Speech)',
        desc: 'Listen to native pronunciations to improve Spoken English and presentation skills.'
      }
    ]
  },
  {
    id: 'socratic',
    name: 'Socratic by Google',
    nameSinhala: 'සොක්‍රටීස් විෂය ගැටළු විසඳුම්කරු (Socratic AI)',
    nameTamil: 'சாக்ரடீஸ் வினா விடை தளம்',
    tagline: 'Visual AI Homework & Step-by-Step Problem Solver',
    taglineSinhala: 'ගණිතය, විද්‍යාව සහ භෞතික විද්‍යා ගැටළු පියවරෙන් පියවර විසඳා ගන්න',
    badge: 'AI Concept Solver',
    category: 'STEM & Homework Help',
    color: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
    iconName: 'Sparkles',
    description: 'Demystify challenging math equations, chemistry reactions, and physics principles with clear visual breakdowns and foundational theory.',
    descriptionSinhala: 'අමාරු ගණිත සමීකරණ, රසායන විද්‍යා ප්‍රතික්‍රියා හා භෞතික විද්‍යා මූලධර්ම පහසු පියවරෙන් පියවර රූප සටහන් සමඟ විසඳා ගන්න.',
    mascotTip: {
      si: '📐 ඕනෑම ගණිත හෝ විද්‍යා ගැටලුවක් මෙහි ලියන්න හෝ තෝරන්න! සූත්‍රය (Formula), ක්‍රමවේදය සහ පියවරෙන් පියවර පිළිතුර මම ඔබට විස්තර කර දෙන්නම්!',
      ta: '📐 கணித மற்றும் அறிவியல் வினாக்களுக்கான தெளிவான படிமுறை விளக்கங்களைப் பெறுங்கள்!',
      en: '📐 Enter any Math or Science problem! Socratic breaks it down into easy conceptual steps with formulas and explanations.'
    },
    features: [
      {
        title: 'Step-by-Step Math & Physics Solver',
        titleSinhala: 'පියවරෙන් පියවර ගණිත/භෞතික විසඳුම්',
        desc: 'Quadratic equations, calculus, vectors, chemical balancing, and mechanics solved with clear steps.'
      },
      {
        title: 'Concept Visualizer & Core Formulas',
        titleSinhala: 'මූලික සූත්‍ර සහ සංකල්ප සටහන්',
        desc: 'Visual summaries and cheat sheets for key A/L and O/L syllabus topics.'
      },
      {
        title: 'Interactive Practice Questions',
        titleSinhala: 'ස්වයං අභ්‍යාස ප්‍රශ්නාවලි',
        desc: 'Instant follow-up questions to test your conceptual clarity.'
      }
    ]
  },
  {
    id: 'scholar',
    name: 'Google Scholar',
    nameSinhala: 'ගූගල් ස්කොලර් පර්යේෂණ පත්‍රිකා (Google Scholar)',
    nameTamil: 'கூகிள் ஆய்விதழ் தளம்',
    tagline: 'Academic Literature, University Papers & Citation Generator',
    taglineSinhala: 'ශ්‍රී ලංකා හා ජාත්‍යන්තර සරසවි පර්යේෂණ පත්‍රිකා සහ නිල උපුටා දැක්වීම් (Citations)',
    badge: 'Research & Citations',
    category: 'Higher Education & Research',
    color: 'from-blue-700 to-cyan-700',
    bgGradient: 'from-blue-700/10 via-cyan-600/5 to-indigo-900/10',
    iconName: 'GraduationCap',
    description: 'Search academic articles, theses, conference papers, and generate automatic citations in APA, MLA, Harvard, and Chicago styles.',
    descriptionSinhala: 'සරසවි හා උසස් පෙළ සිසුන් සඳහා ලොව පුරා සහ ශ්‍රී ලංකාවේ පිළිගත් පර්යේෂණ පත්‍රිකා, නිබන්ධන සහ Citation සැකසුම් මෙවලම්.',
    mascotTip: {
      si: '🎓 උසස් පෙළ (A/L) General Information Technology හෝ සරසවි Assignment සඳහා පර්යේෂණ සොයනවාද? පහත Search එකෙන් සත්‍යාපිත ශාස්ත්‍රීය ලිපි කියවා APA / Harvard Citation එකවර ලබාගන්න!',
      ta: '🎓 உங்கள் பல்கலைக்கழக மற்றும் உயர்தர ஆய்வுக்கட்டுரைகளுக்கான ஆதாரங்களை இங்கே தேடுங்கள்!',
      en: '🎓 Researching for school projects or university degrees? Find peer-reviewed journals and instantly format APA/Harvard citations!'
    },
    features: [
      {
        title: 'Sri Lanka & Global Research Search',
        titleSinhala: 'දේශීය සහ ජාත්‍යන්තර පර්යේෂණ සෙවුම',
        desc: 'Access curated open-access academic publications from Universities of Colombo, Peradeniya, Moratuwa, and top world institutions.'
      },
      {
        title: 'Instant Citation Generator (APA/MLA/Harvard)',
        titleSinhala: 'ස්වයංක්‍රීය උපුටා දැක්වීම් සැකසුම',
        desc: 'Copy formatted academic reference citations with a single click for assignments.'
      },
      {
        title: 'Direct DOI & Abstract Reader',
        titleSinhala: 'සාරාංශ (Abstract) හා පර්යේෂණ කියවනය',
        desc: 'Read key findings, methodologies, and conclusions inside SipArana.'
      }
    ]
  },
  {
    id: 'classroom',
    name: 'Google Classroom Hub',
    nameSinhala: 'ගූගල් ක්ලාස්රූම් කාර්ය කළමනාකරු (Classroom Hub)',
    nameTamil: 'கூகிள் வகுப்பறை தளம்',
    tagline: 'Study Streams, Assignments, Deadlines & Lesson Tracker',
    taglineSinhala: 'පාසල් සහ උපකාරක පන්ති Assignment, කාලසටහන් හා කාර්ය සාධන සටහන',
    badge: 'Classroom & Task Manager',
    category: 'Classroom Management',
    color: 'from-emerald-600 to-teal-700',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-green-500/10',
    iconName: 'School',
    description: 'Keep track of school assignments, teacher notes, homework submission dates, and subject study materials all in one organized hub.',
    descriptionSinhala: 'පාසල් සහ පෞද්ගලික පන්තිවලින් ලබා දෙන පැවරුම් (Assignments), ගුරු නිවේදන සහ කාලසටහන් විධිමත්ව කළමනාකරණය කරන්න.',
    mascotTip: {
      si: '📚 ඔබේ ගෙදර වැඩ (Homework) සහ Assignments නියමිත දිනට පෙර සම්පූර්ණ කරන්න මෙම Tracker එක උපකාරී වේ. කාර්යයක් අවසන් කළ පසු Check කර XP ලබාගන්න!',
      ta: '📚 உங்கள் வீட்டுப்பாடங்களை ஒழுங்கமைத்து சரியான நேரத்தில் முடிக்க இந்த கருவி உதவும்!',
      en: '📚 Never miss a homework deadline! Track your subject streams, submit tasks, and earn bonus SipArana XP as you check items off!'
    },
    features: [
      {
        title: 'Subject Assignment Board',
        titleSinhala: 'විෂය පැවරුම් පුවරුව',
        desc: 'Kanban-style tracking for To-Do, In Progress, and Completed homework assignments.'
      },
      {
        title: 'Teacher Notice Stream & Study Links',
        titleSinhala: 'ගුරු නිවේදන සහ අධ්‍යයන සටහන්',
        desc: 'Organized stream of classroom announcements, PDF links, and past paper links.'
      },
      {
        title: 'Assignment & Due Date Alerts',
        titleSinhala: 'නියමිත දින දැනුම්දීම් සහ මතක් කිරීම්',
        desc: 'Interactive schedule reminders so you stay organized.'
      }
    ]
  },
  {
    id: 'arts_culture',
    name: 'Google Arts & Culture',
    nameSinhala: 'ගූගල් කලා හා සංස්කෘතික ගවේෂක (Arts & Culture)',
    nameTamil: 'கலை மற்றும் கலாச்சார தளம்',
    tagline: '3D Virtual Tours, Sri Lanka Heritage, History & High-Res Art',
    taglineSinhala: 'සීගිරිය, දළදා මාළිගාව, ජාතික කෞතුකාගාරය සහ ලෝක උරුම අතථ්‍ය චාරිකා (Virtual Tours)',
    badge: '3D Heritage & Art',
    category: 'History, Art & Culture',
    color: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-500/10 via-pink-500/5 to-indigo-500/10',
    iconName: 'Palette',
    description: 'Explore high-definition 3D virtual exhibits of Sri Lankan heritage, national museums, world wonders, and classical art movements.',
    descriptionSinhala: 'ශ්‍රී ලංකාවේ ඓතිහාසික උරුමයන්, දේශීය කෞතුකාගාර සහ ලෝක කලා කෘති 3D අතථ්‍ය තාක්ෂණයෙන් නරඹමින් ඉතිහාසය හා චිත්‍ර කලාව ඉගෙන ගන්න.',
    mascotTip: {
      si: '🏛️ සීගිරිය බලකොටුව, අනුරාධපුර නටබුන් සහ කොළඹ ජාතික කෞතුකාගාරයේ ඇති පුරාණ කාසි හා ආයුධ 3D අතථ්‍ය සංචාරයෙන් (Virtual Tour) දැන්ම නරඹමු!',
      ta: '🏛️ சீகிரியா, கண்டி தலதா மாளிகை மற்றும் உலக அருங்காட்சியகங்களை 3D மெய்நிகர் சுற்றுகள் மூலம் பார்வையிடுங்கள்!',
      en: '🏛️ Take an immersive virtual stroll through Sigiriya Rock Fortress, Dalada Maligawa, and world art museums right from your screen!'
    },
    features: [
      {
        title: 'Sri Lanka Ancient Heritage 3D Tours',
        titleSinhala: 'ශ්‍රී ලංකා ඓතිහාසික උරුම 3D චාරිකා',
        desc: 'Sigiriya, Polonnaruwa, Galle Fort, and Temple of the Tooth interactive panoramas.'
      },
      {
        title: 'Ultra High-Resolution Artwork Zoom',
        titleSinhala: 'අතිශය පැහැදිලි කලාකෘති පරීක්ෂක',
        desc: 'Explore brushstrokes of famous historic frescoes and classical masterworks.'
      },
      {
        title: 'History & Archeology Exam Quizzer',
        titleSinhala: 'ඉතිහාසය සහ පුරාවිද්‍යා විභාග දැනුම',
        desc: 'Curated trivia and archaeological facts aligned with Grade 6-11 History syllabi.'
      }
    ]
  },
  {
    id: 'cs_first',
    name: 'CS First by Google',
    nameSinhala: 'ගූගල් පරිගණක විද්‍යා මූලික පුහුණුව (CS First)',
    nameTamil: 'கூகிள் கணினி அறிவியல் தளம்',
    tagline: 'Block Coding, Scratch Game Development & ICT Fundamentals',
    taglineSinhala: 'Scratch කේතනය, ක්‍රීඩා නිර්මාණය සහ පාසල් තොරතුරු තාක්ෂණ (ICT) පුහුණුව',
    badge: 'Code & Game Maker',
    category: 'Computer Science & ICT',
    color: 'from-red-500 to-rose-600',
    bgGradient: 'from-red-500/10 via-rose-500/5 to-amber-500/10',
    iconName: 'Code2',
    description: 'Empower students of all ages to learn computer science, block-based coding, storytelling, and game mechanics interactively.',
    descriptionSinhala: 'පාසල් සිසුන්ට පරිගණක ක්‍රමලේඛනය (Coding), Scratch මෘදුකාංගයෙන් ක්‍රීඩා නිර්මාණය සහ ඇල්ගොරිතම සංකල්ප පහසුවෙන් පුහුණු වන්න.',
    mascotTip: {
      si: '💻 Coding ඉගෙන ගන්න කැමතිද? මෙහි ඇති interactive code runner එක මගින් Scratch Blocks එකලස් කර ඔබේම Animation එකක් හෝ Game එකක් සාදා බලන්න!',
      ta: '💻 பிளாக் கோடிங் மற்றும் ஸ்கிராட்ச் மூலம் சுலபமாக கோடிங் கற்றுக்கொள்ளுங்கள்!',
      en: '💻 Ready to code? Build animations, interactive games, and master O/L & A/L ICT logic with beginner-friendly visual blocks!'
    },
    features: [
      {
        title: 'Interactive Scratch Block Playground',
        titleSinhala: 'අන්තර්ක්‍රියාකාරී Scratch කේතන පිටිය',
        desc: 'Assemble visual logic blocks (Motion, Events, Loops, Variables) and run live output in-app.'
      },
      {
        title: 'Curated Google CS First Curriculum',
        titleSinhala: 'ගූගල් පරිගණක විද්‍යා පාඨමාලා මාලාව',
        desc: 'Game Design, Storytelling, Music & Sound, and Sports programming tutorials.'
      },
      {
        title: 'O/L & A/L ICT Algorithm Simulator',
        titleSinhala: 'ඇල්ගොරිතම සහ Flowchart අනුකරණය',
        desc: 'Bridge visual block coding with pseudocode and Python logic.'
      }
    ]
  },
  {
    id: 'earth',
    name: 'Google Earth',
    nameSinhala: 'ගූගල් අර්ත් 3D භූගෝල ගවේෂක (Google Earth)',
    nameTamil: 'கூகிள் பூமி முப்பரிமாண தளம்',
    tagline: '3D Interactive Globe, Sri Lanka Topography & Geography Lab',
    taglineSinhala: 'ශ්‍රී ලංකාවේ කඳුකර, ගංගා නිම්න, ජාතික වනෝද්‍යාන සහ ලෝක භූගෝල විද්‍යා 3D ගවේෂණය',
    badge: '3D Earth & Geography',
    category: 'Geography & Environmental Science',
    color: 'from-teal-600 to-blue-700',
    bgGradient: 'from-teal-500/10 via-blue-600/5 to-emerald-600/10',
    iconName: 'Globe',
    description: 'Fly around the globe in 3D, inspect satellite imagery, measure elevations, and explore Sri Lankan physical geography and landforms.',
    descriptionSinhala: 'පෘථිවි ගෝලය 3D ආකෘතියෙන් කරකවමින් ශ්‍රී ලංකාවේ පිදුරුතලාගල, ශ්‍රී පාදය, මහවැලි ගඟ සහ ලෝකයේ ප්‍රකට භූගෝලීය ලක්ෂණ සජීවීව නිරීක්ෂණය කරන්න.',
    mascotTip: {
      si: '🌍 භූගෝල විද්‍යාව (Geography) ප්‍රායෝගිකව ඉගෙන ගන්න! ශ්‍රී ලංකාවේ උසම කඳු, ප්‍රධාන වරායවල් සහ ලෝකයේ අගනුවරවල් 3D සිතියමෙන් ගවේෂණය කර Quiz එක කරන්න!',
      ta: '🌍 உலக வரைபடத்தையும் இலங்கையின் புவியியல் நிலப்பரப்பையும் 3D யில் ஆய்வு செய்யுங்கள்!',
      en: '🌍 Explore Sri Lanka’s mountains, rivers, and global topography with 3D views, coordinates, and interactive Geography challenges!'
    },
    features: [
      {
        title: 'Sri Lanka Physical Geography & Landmarks',
        titleSinhala: 'ශ්‍රී ලංකා භූ විෂමතා හා ප්‍රධාන සලකුණු',
        desc: 'Pidurutalagala, Adam’s Peak, Horton Plains, Mahaweli Ganga, Yala, and Trincomalee natural harbour.'
      },
      {
        title: '3D Satellite & Elevation Explorer',
        titleSinhala: '3D චන්ද්‍රිකා සහ උන්නතාංශ මිනුම්',
        desc: 'Inspect terrain contours, longitude/latitude coordinates, and climatic zones.'
      },
      {
        title: 'Geography Map Reading & Coordinates Quiz',
        titleSinhala: 'සිතියම් කියවීම සහ භූගෝල විභාග ප්‍රශ්නාවලිය',
        desc: 'Interactive location identification challenges mapped to the G.C.E O/L Geography syllabus.'
      }
    ]
  }
];

// Pre-loaded glossary for the integrated Google Translate engine
export const STUDY_GLOSSARY = [
  {
    en: 'Photosynthesis',
    si: 'ප්‍රභාසංස්ලේෂණය',
    ta: 'ஒளிச்சேர்க்கை',
    category: 'Science',
    definition: 'Process used by green plants to synthesize nutrients from carbon dioxide and water using sunlight.'
  },
  {
    en: 'Acceleration due to gravity',
    si: 'ගුරුත්වාකර්ෂණ ත්වරණය',
    ta: 'ஈர்ப்பு முடுக்கம்',
    category: 'Physics',
    definition: 'The acceleration of a body in free fall under the influence of earth’s gravitational field (approx 9.8 m/s²).'
  },
  {
    en: 'Electrolysis',
    si: 'විද්‍යුත් විච්ඡේදනය',
    ta: 'மின்னாற்பகுப்பு',
    category: 'Chemistry',
    definition: 'Chemical decomposition produced by passing an electric current through a liquid or solution containing ions.'
  },
  {
    en: 'Algorithm',
    si: 'ඇල්ගොරිතමය (ගණිත රීතිය)',
    ta: 'நெறிமுறை',
    category: 'ICT',
    definition: 'A step-by-step procedure or set of rules to solve a computational problem in a finite number of steps.'
  },
  {
    en: 'Quadratic Equation',
    si: 'වර්ගජ සමීකරණය',
    ta: 'இருபடிச் சமன்பாடு',
    category: 'Mathematics',
    definition: 'An algebraic equation of the second degree: ax² + bx + c = 0.'
  },
  {
    en: 'Opportunity Cost',
    si: 'ආවස්ථික පිරිවැය',
    ta: 'வாய்ப்புச் செலவு',
    category: 'Commerce',
    definition: 'The loss of potential gain from other alternatives when one alternative is chosen.'
  },
  {
    en: 'Biodiversity',
    si: 'ජෛව විවිධත්වය',
    ta: 'பல்லுயிர் பெருக்கம்',
    category: 'Biology',
    definition: 'The variety of plant and animal life in the world or in a particular habitat.'
  },
  {
    en: 'Microcontroller',
    si: 'ක්ෂුද්‍ර පාලකය (Microcontroller)',
    ta: 'மைக்ரோகண்ட்ரோலர்',
    category: 'Engineering Tech',
    definition: 'A compact integrated circuit designed to govern a specific operation in an embedded system (e.g. Arduino).'
  }
];

// Pre-loaded Socratic math & science step-by-step problem templates
export const SOCRATIC_SOLVER_PRESETS = [
  {
    id: 'quadratic',
    title: 'Solve: 2x² + 5x - 3 = 0',
    subject: 'Mathematics (A/L & O/L)',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    steps: [
      { stepNum: 1, text: 'Identify the coefficients: a = 2, b = 5, c = -3.' },
      { stepNum: 2, text: 'Calculate the discriminant: Δ = b² - 4ac = 5² - 4(2)(-3) = 25 + 24 = 49.' },
      { stepNum: 3, text: 'Take the square root of the discriminant: √49 = 7.' },
      { stepNum: 4, text: 'Substitute into the quadratic formula: x = (-5 ± 7) / (2 × 2) = (-5 ± 7) / 4.' },
      { stepNum: 5, text: 'Compute both roots: x₁ = (-5 + 7)/4 = 2/4 = 0.5; x₂ = (-5 - 7)/4 = -12/4 = -3.' }
    ],
    finalAnswer: 'x = 1/2 or x = -3'
  },
  {
    id: 'projectile',
    title: 'Physics: Maximum Height of a Projectile',
    subject: 'Physics (A/L Mechanics)',
    formula: 'H_max = (u² · sin²θ) / (2g)',
    steps: [
      { stepNum: 1, text: 'Let initial velocity be u = 20 m/s and launch angle θ = 30°.' },
      { stepNum: 2, text: 'Vertical component of velocity: u_y = u sin(30°) = 20 × 0.5 = 10 m/s.' },
      { stepNum: 3, text: 'At maximum height, vertical velocity v_y = 0.' },
      { stepNum: 4, text: 'Apply equation v² = u² - 2gh: 0 = (10)² - 2(9.8)H_max.' },
      { stepNum: 5, text: 'H_max = 100 / 19.6 ≈ 5.102 meters.' }
    ],
    finalAnswer: 'Maximum Height H = 5.10 meters'
  },
  {
    id: 'chemistry_balancing',
    title: 'Chemistry: Balance Fe + O₂ → Fe₂O₃',
    subject: 'Chemistry (O/L & A/L)',
    formula: '4Fe + 3O₂ → 2Fe₂O₃',
    steps: [
      { stepNum: 1, text: 'Count iron (Fe) atoms: 1 on reactants, 2 on products.' },
      { stepNum: 2, text: 'Count oxygen (O) atoms: 2 on reactants, 3 on products (LCM of 2 and 3 is 6).' },
      { stepNum: 3, text: 'Place coefficient 3 before O₂ (3 × 2 = 6 O atoms) and 2 before Fe₂O₃ (2 × 3 = 6 O atoms).' },
      { stepNum: 4, text: 'Products now have 2 × 2 = 4 Fe atoms. Balance reactants with coefficient 4 before Fe.' },
      { stepNum: 5, text: 'Verify both sides: 4 Fe atoms and 6 O atoms on both sides.' }
    ],
    finalAnswer: 'Balanced: 4Fe + 3O₂ → 2Fe₂O₃ (Rusting of Iron)'
  }
];

// Pre-loaded Google Scholar papers
export const SCHOLAR_PUBLICATIONS = [
  {
    id: 'p1',
    title: 'Analysis of G.C.E. Advanced Level Science Stream Performance in Sri Lanka: Trends and Predictive Factors',
    authors: 'Dr. K. M. Wickramasinghe, Prof. S. Jayasuriya',
    journal: 'Sri Lankan Journal of Educational Research (UoC / Peradeniya)',
    year: '2024',
    doi: '10.1016/j.sljer.2024.08.012',
    citationsCount: 142,
    abstract: 'This empirical study explores key predictors of academic success among secondary school candidates sitting for the G.C.E. A/L Science & Technology examinations in Sri Lanka, focusing on digital learning platforms, language proficiency, and diagnostic assessment feedback.',
    apaCitation: 'Wickramasinghe, K. M., & Jayasuriya, S. (2024). Analysis of G.C.E. Advanced Level Science Stream Performance in Sri Lanka. Sri Lankan Journal of Educational Research, 18(2), 115-134.',
    harvardCitation: 'Wickramasinghe, K.M. and Jayasuriya, S., 2024. Analysis of G.C.E. Advanced Level Science Stream Performance in Sri Lanka. Sri Lankan Journal of Educational Research, 18(2), pp.115-134.'
  },
  {
    id: 'p2',
    title: 'Renewable Energy Integration in the Sri Lankan National Power Grid: Solar and Wind Potential',
    authors: 'Eng. R. D. Senanayake, Dr. A. L. Silva',
    journal: 'University of Moratuwa Engineering Research Conference',
    year: '2023',
    doi: '10.1109/mercon.2023.101872',
    citationsCount: 98,
    abstract: 'A comprehensive investigation into smart grid dispatch algorithms, energy storage capabilities, and renewable penetration targets for Sri Lanka by 2030, examining solar photovoltaic adoption in rural and urban sectors.',
    apaCitation: 'Senanayake, R. D., & Silva, A. L. (2023). Renewable Energy Integration in the Sri Lankan National Power Grid. University of Moratuwa MERCon Proceedings, 45-52.',
    harvardCitation: 'Senanayake, R.D. and Silva, A.L., 2023. Renewable Energy Integration in the Sri Lankan National Power Grid. University of Moratuwa MERCon Proceedings, pp.45-52.'
  },
  {
    id: 'p3',
    title: 'Digital Pedagogies in Post-Primary Sinhala and Tamil Medium Classrooms: An AI-Assisted Model',
    authors: 'Prof. T. Rajaratnam, Dr. N. H. Fernando',
    journal: 'Asian Journal of Educational Technology & Linguistics',
    year: '2025',
    doi: '10.1080/ajetl.2025.04.091',
    citationsCount: 65,
    abstract: 'Investigates bilingual learning modalities and natural language processing applications designed specifically for Sinhala and Tamil grammar disambiguation in secondary school education.',
    apaCitation: 'Rajaratnam, T., & Fernando, N. H. (2025). Digital Pedagogies in Post-Primary Sinhala and Tamil Medium Classrooms. Asian Journal of Educational Technology, 12(1), 77-94.',
    harvardCitation: 'Rajaratnam, T. and Fernando, N.H., 2025. Digital Pedagogies in Post-Primary Sinhala and Tamil Medium Classrooms. Asian Journal of Educational Technology, 12(1), pp.77-94.'
  }
];

// Arts & Culture 3D & Heritage Exhibits
export const ARTS_EXHIBITS = [
  {
    id: 'sigiriya',
    name: 'Sigiriya Lion Rock Fortress',
    nameSinhala: 'සීගිරිය ලෝක උරුම බලකොටුව',
    period: '5th Century CE (King Kashyapa)',
    location: 'Matale District, Central Province, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    description: 'An ancient palace and fortress complex atop a 200-meter high rock column featuring world-famous frescoes, mirror walls, and sophisticated water gardens.',
    descriptionSinhala: 'කාශ්‍යප රජු විසින් නිර්මාණය කළ මීටර් 200ක් උසැති පර්වත මස්තකයේ පිහිටි විස්මිත මාලිගා සංකීර්ණය, සීගිරි බිතුසිතුවම් සහ දිය උද්‍යාන.',
    keyHighlights: ['Lion Paw Staircase', 'Sigiri Frescoes (කැටපත් පවුර සහ බිතුසිතුවම්)', 'Hydraulic Water Gardens', 'Mirror Wall Inscriptions']
  },
  {
    id: 'dalada_maligawa',
    name: 'Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)',
    nameSinhala: 'ශ්‍රී දළදා මාළිගාව',
    period: 'Kandyan Kingdom Era',
    location: 'Kandy, Central Province, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'The golden-roofed temple housing the sacred tooth relic of Lord Buddha, exhibiting masterpiece Kandyan wood carvings, murals, and architecture.',
    descriptionSinhala: 'සම්බුදු පාදස්පර්ශය ලද උතුම් ශ්‍රී දන්ත ධාතූන් වහන්සේ වැඩසිටින මහනුවර ඓතිහාසික රාජකීය උරුමය සහ උඩරට කැටයම් කලා මධ්‍යස්ථානය.',
    keyHighlights: ['Golden Canopy (රන් වියන)', 'Paththirippuwa Octagon', 'Embekke-Style Wood Carvings', 'Esala Perahera Heritage']
  },
  {
    id: 'galle_fort',
    name: 'Galle Dutch Fort & Lighthouse',
    nameSinhala: 'ගාල්ල ලන්දේසි බලකොටුව සහ ප්‍රදීපාගාරය',
    period: '16th–17th Century Colonial Heritage',
    location: 'Galle, Southern Province, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    description: 'A coastal UNESCO World Heritage fortress demonstrating European architecture fused with South Asian traditions and ocean bastions.',
    descriptionSinhala: 'දකුණු වෙරළ තීරයේ පිහිටි යුනෙස්කෝ ලෝක උරුමයක් වන ගාලු කොටුව, පැරණි ගොඩනැගිලි හා ප්‍රදීපාගාරය.',
    keyHighlights: ['Point Utrecht Bastion', 'Old Dutch Hospital', 'Galle Lighthouse', 'Ocean Ramparts']
  }
];

// CS First Block Coding Projects
export const CS_FIRST_PROJECTS = [
  {
    id: 'cs_pong',
    title: 'Build a Ping Pong Ball Game',
    titleSinhala: 'පිං පොං පරිගණක ක්‍රීඩාවක් තනමු',
    category: 'Game Design',
    difficulty: 'Beginner',
    blocksCount: 14,
    description: 'Learn event-driven programming, bounce collision physics, score variables, and paddle controls using Scratch blocks.',
    starterCode: `when green_flag clicked:
  set [Score] to 0
  go to x: 0 y: 150
  point in direction (45)
  forever:
    move (10) steps
    if on edge, bounce
    if touching [Paddle] then:
      turn clockwise (180) degrees
      change [Score] by 1`,
    logicTakeaways: ['Conditional Statements (If-Then)', 'Continuous Loops (Forever)', 'Variable State Management', 'Coordinate Grid System (X/Y)']
  },
  {
    id: 'cs_chatbot',
    title: 'Create an AI Dialogue Chatbot',
    titleSinhala: 'කතා කරන AI සංවාදකයක් (Chatbot) නිර්මාණය කරමු',
    category: 'Storytelling & AI',
    difficulty: 'Intermediate',
    blocksCount: 18,
    description: 'Program user inputs, string manipulation, condition checks, and automated speech synthesis answers.',
    starterCode: `when green_flag clicked:
  ask "What is your favorite subject?" and wait
  if (answer = "Science") then:
    say "Awesome! Science is key to the universe! ⭐" for (3) secs
  else:
    say (join "Great choice! I love learning " (answer)) for (3) secs`,
    logicTakeaways: ['User Input Handling (Ask/Wait)', 'String Concatenation (Join)', 'Branching Logic (If-Else)', 'Timing & Delays']
  }
];

// Google Earth Sri Lanka Key Landmarks
export const EARTH_LANDMARKS = [
  {
    id: 'pidurutalagala',
    name: 'Pidurutalagala (Mount Pedro)',
    nameSinhala: 'පිදුරුතලාගල කඳු මුදුන',
    elevation: '2,524 m (8,281 ft) — Highest Peak in Sri Lanka',
    lat: '7.0008° N',
    lon: '80.7733° E',
    category: 'Mountain Peak',
    description: 'The highest ultra-prominent mountain peak in Sri Lanka, situated near Nuwara Eliya with dense montane cloud forest reserves.',
    examFact: 'පිදුරුතලාගල ශ්‍රී ලංකාවේ උසම කන්ද වන අතර, එහි උන්නතාංශය මීටර් 2,524 කි.'
  },
  {
    id: 'adams_peak',
    name: "Sri Pada (Adam's Peak)",
    nameSinhala: 'ශ්‍රී පාදස්ථානය (සමනළ කන්ද)',
    elevation: '2,243 m (7,359 ft)',
    lat: '6.8096° N',
    lon: '80.4994° E',
    category: 'Sacred Landmark & Watershed',
    description: 'Famous for the sacred footprint relic (Sri Pada), unique conical shadow formation at sunrise, and source of major rivers including Kelani and Kalu.',
    examFact: 'කැළණි, කළු, වලවේ සහ මහවැලි යන ප්‍රධාන ගංගා සමනළ කඳුකර ප්‍රදේශයෙන් ඇරඹේ.'
  },
  {
    id: 'mahaweli_ganga',
    name: 'Mahaweli Ganga Basin',
    nameSinhala: 'මහවැලි ගංගා නිම්නය',
    elevation: '335 km (Longest River in Sri Lanka)',
    lat: '8.4552° N',
    lon: '81.2335° E',
    category: 'River System & Hydroelectric Power',
    description: 'The longest river in Sri Lanka covering nearly one-fifth of the island’s landmass, feeding Victoria, Randenigala, and Kotmale hydro reservoirs.',
    examFact: 'ශ්‍රී ලංකාවේ දිගම ගංගාව මහවැලි ගඟ වන අතර එහි දිග කිලෝමීටර් 335 කි.'
  },
  {
    id: 'trincomalee_harbour',
    name: 'Trincomalee Natural Deep-Water Harbour',
    nameSinhala: 'ත්‍රිකුණාමලය ස්වාභාවික වරාය',
    elevation: 'Sea Level (Deep Canyon Waters)',
    lat: '8.5711° N',
    lon: '81.2335° E',
    category: 'Ocean & Maritime Strategic Asset',
    description: 'The fifth largest natural harbour in the world, historically contested by Portuguese, Dutch, French, and British maritime fleets.',
    examFact: 'ලෝකයේ 5 වන විශාලතම ස්වාභාවික වරාය වන අතර ඉන්දියන් සාගරයේ ප්‍රධාන නාවික මර්මස්ථානයකි.'
  }
];
