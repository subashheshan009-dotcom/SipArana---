export interface MCQQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionTextSinhala: string;
  questionTextTamil?: string;
  codeSnippet?: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    textSinhala: string;
    textTamil?: string;
  }[];
  correctOptionId: string;
  explanation: string;
  explanationSinhala: string;
  explanationTamil?: string;
  guruPothaRef: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UnitQuiz {
  id: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  subjectId: string;
  subjectName: string;
  subjectSinhala: string;
  grade: number | string;
  category: 'scholarship' | 'al' | 'ol' | 'junior' | 'uni';
  stream: string;
  streamId: string;
  unitNumber: number;
  timeLimitMinutes: number;
  totalMarks: number;
  xpReward: number;
  iconName: string;
  color: string;
  description: string;
  descriptionSinhala: string;
  questions: MCQQuestion[];
}

export interface QuizCategory {
  id: 'scholarship' | 'al' | 'ol' | 'junior' | 'uni';
  name: string;
  nameSinhala: string;
  nameTamil: string;
  description: string;
  descriptionSinhala: string;
  badge: string;
  icon: string;
  gradient: string;
}

export interface QuizStream {
  id: string;
  categoryId: 'scholarship' | 'al' | 'ol' | 'junior' | 'uni';
  name: string;
  nameSinhala: string;
  nameTamil: string;
  icon: string;
  description: string;
  descriptionSinhala: string;
  color: string;
}

export interface QuizSubject {
  id: string;
  streamId: string;
  categoryId: 'scholarship' | 'al' | 'ol' | 'junior' | 'uni';
  name: string;
  nameSinhala: string;
  nameTamil: string;
  iconName: string;
  color: string;
  gradeLevels: string;
  syllabusCode: string;
  descriptionSinhala: string;
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'scholarship',
    name: 'Grade 5 Scholarship (5 වසර ශිෂ්‍යත්වය)',
    nameSinhala: '5 වසර ශිෂ්‍යත්ව විභාගය (ගුරු පොත අනුකූලයි)',
    nameTamil: 'தரம் 5 புலமைப்பரிசில் (ஆசிரியர் வழிகாட்டி)',
    description: 'Sinhala, Mathematics, Environment & IQ Puzzles tailored for primary kids with Kavi Owl guide',
    descriptionSinhala: 'සිංහල, ගණිතය, පරිසරය සහ බුද්ධි පරීක්ෂණ විනෝද ප්‍රශ්න (කවි බකමූණාගේ සරල මඟපෙන්වීම)',
    badge: 'Grade 5 • NIE Guru Potha',
    icon: 'Sparkles',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'al',
    name: 'G.C.E. Advanced Level (A/L)',
    nameSinhala: 'අ.පො.ස. උසස් පෙළ (12 - 13 ශ්‍රේණි)',
    nameTamil: 'க.பொ.த உயர்தரம் (A/L)',
    description: 'Physical Science, Bio, Commerce, Arts & Technology Streams with University Entrance Focus',
    descriptionSinhala: 'ගණිත, ජීව විද්‍යා, වාණිජ, කලා සහ තාක්ෂණවේදය සියලු ධාරා සඳහා විභාග බහුවරණ පරීක්ෂණ',
    badge: 'Grades 12 - 13 • National Syllabus',
    icon: 'GraduationCap',
    gradient: 'from-blue-600 to-indigo-800'
  },
  {
    id: 'ol',
    name: 'G.C.E. Ordinary Level (O/L)',
    nameSinhala: 'අ.පො.ස. සාමාන්‍ය පෙළ (10 - 11 ශ්‍රේණි)',
    nameTamil: 'க.பொ.த சாதாரண தரம் (O/L)',
    description: 'Core National Subjects (Science, Maths, History, English) & Electives',
    descriptionSinhala: 'විද්‍යාව, ගණිතය, ඉතිහාසය, භාෂාව සහ කාණ්ඩ විෂයයන් සඳහා ඒකක ආදර්ශ පරීක්ෂණ',
    badge: 'Grades 10 - 11 • O/L Exam Prep',
    icon: 'BookOpen',
    gradient: 'from-amber-600 to-orange-700'
  },
  {
    id: 'junior',
    name: 'Junior Secondary School',
    nameSinhala: 'කණිෂ්ඨ අංශය (6 - 9 ශ්‍රේණි)',
    nameTamil: 'இடைநிலைப் பிரிவு (தரம் 6 - 9)',
    description: 'Foundational concept building in Science, Mathematics, English & History',
    descriptionSinhala: 'මූලික සිද්ධාන්ත හා දැනුම වර්ධනය කරන ආකර්ෂණීය බහුවරණ ප්‍රශ්නාවලි',
    badge: 'Grades 6 - 9 • Middle School',
    icon: 'Sparkles',
    gradient: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'uni',
    name: 'University & Higher Undergrad',
    nameSinhala: 'විශ්වවිද්‍යාල උපාධි & වෘත්තීය අංශය',
    nameTamil: 'பல்கலைக்கழக மற்றும் உயர் கல்வி',
    description: 'Computer Science, Software Engineering, Business, Finance & Applied Sciences',
    descriptionSinhala: 'සරසවි උපාධි පාඨමාලා, පරිගණක විද්‍යාව, මෘදුකාංග ඉංජිනේරු විද්‍යාව සහ කළමනාකරණය',
    badge: 'Undergraduate • Higher Education',
    icon: 'Award',
    gradient: 'from-purple-600 to-violet-900'
  }
];

export const QUIZ_STREAMS: QuizStream[] = [
  // Grade 5 Scholarship Stream
  {
    id: 'stream_scholarship_core',
    categoryId: 'scholarship',
    name: 'Grade 5 Primary Curriculum',
    nameSinhala: '5 ශිෂ්‍යත්ව ප්‍රධාන විෂය ධාරාව (ගුරු පොත)',
    nameTamil: 'தரம் 5 முதன்மை பாடங்கள்',
    icon: 'Sparkles',
    description: 'Sinhala, Primary Mathematics, Environmental Studies & IQ Puzzles',
    descriptionSinhala: 'සිංහල භාෂාව, ප්‍රාථමික ගණිතය, පරිසරය සහ බුද්ධි පරීක්ෂණය',
    color: 'from-amber-500 to-orange-600'
  },

  // A/L Streams
  {
    id: 'stream_al_maths',
    categoryId: 'al',
    name: 'Physical Science (Combined Maths)',
    nameSinhala: 'භෞතික විද්‍යා (ගණිත) ධාරාව',
    nameTamil: 'பௌதிக விஞ்ஞானப் பிரிவு (கணிதம்)',
    icon: 'Calculator',
    description: 'Combined Mathematics, Physics, Chemistry, and ICT',
    descriptionSinhala: 'සංයුක්ත ගණිතය, භෞතික විද්‍යාව, රසායන විද්‍යාව සහ තොරතුරු තාක්ෂණය',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'stream_al_bio',
    categoryId: 'al',
    name: 'Biological Science (Bio)',
    nameSinhala: 'ජීව විද්‍යා ධාරාව',
    nameTamil: 'உயிரியல் விஞ்ஞானப் பிரிவு',
    icon: 'Dna',
    description: 'Biology, Chemistry, Physics, and Agricultural Science',
    descriptionSinhala: 'ජීව විද්‍යාව, රසායන විද්‍යාව, භෞතික විද්‍යාව සහ කෘෂි විද්‍යාව',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'stream_al_commerce',
    categoryId: 'al',
    name: 'Commerce Stream',
    nameSinhala: 'වාණිජ ධාරාව',
    nameTamil: 'வணிகப் பிரிவு',
    icon: 'TrendingUp',
    description: 'Accounting, Business Studies, Economics, and Information Tech',
    descriptionSinhala: 'ගිණුම්කරණය, ව්‍යාපාර අධ්‍යයනය, ආර්ථික විද්‍යාව',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'stream_al_arts',
    categoryId: 'al',
    name: 'Arts & Humanities',
    nameSinhala: 'කලා ධාරාව හා මානව ශාස්ත්‍ර',
    nameTamil: 'கலைப் பிரிவு',
    icon: 'Layers',
    description: 'Media Studies, Sinhala, Political Science, Logic, Geography',
    descriptionSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය, සිංහල, දේශපාලන විද්‍යාව, තර්ක ශාස්ත්‍රය',
    color: 'from-purple-600 to-pink-700'
  },
  {
    id: 'stream_al_tech',
    categoryId: 'al',
    name: 'Technology Stream',
    nameSinhala: 'තාක්ෂණවේදය ධාරාව',
    nameTamil: 'தொழில்நுட்பப் பிரிவு',
    icon: 'Cpu',
    description: 'Engineering Tech, Bio-systems Tech, Science for Technology (SFT), ICT',
    descriptionSinhala: 'ඉංජිනේරු තාක්ෂණවේදය, ජෛව පද්ධති තාක්ෂණවේදය, SFT, ICT',
    color: 'from-cyan-600 to-blue-700'
  },

  // O/L Streams
  {
    id: 'stream_ol_core',
    categoryId: 'ol',
    name: 'Core O/L National Subjects',
    nameSinhala: 'ප්‍රධාන සා.පෙළ විෂය ධාරාව',
    nameTamil: 'முக்கிய பாடங்கள் (O/L)',
    icon: 'BookOpen',
    description: 'Science, Mathematics, History, Sinhala/Tamil Language, English',
    descriptionSinhala: 'විද්‍යාව, ගණිතය, ඉතිහාසය, සිංහල භාෂාව හා සාහිත්‍යය, ඉංග්‍රීසි',
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'stream_ol_electives',
    categoryId: 'ol',
    name: 'Basket & Elective Subjects',
    nameSinhala: 'කාණ්ඩ හා තේරීම් විෂයයන්',
    nameTamil: 'தொகுதிப் பாடங்கள் (Electives)',
    icon: 'Zap',
    description: 'Commerce & Accounting, ICT, Agriculture, Music & Art',
    descriptionSinhala: 'ව්‍යාපාර හා ගිණුම්කරණය, තොරතුරු තාක්ෂණය (ICT), කෘෂි විද්‍යාව',
    color: 'from-indigo-600 to-purple-600'
  },

  // Junior Streams
  {
    id: 'stream_junior_foundation',
    categoryId: 'junior',
    name: 'Middle School Foundation (Grades 6-9)',
    nameSinhala: 'කණිෂ්ඨ පන්ති මූලික විෂයයන් (6-9 ශ්‍රේණි)',
    nameTamil: 'இடைநிலைப் பொதுப் பாடங்கள்',
    icon: 'Sparkles',
    description: 'Mathematics, Science, History, English, Geography',
    descriptionSinhala: 'ගණිතය, විද්‍යාව, ඉතිහාසය, ඉංග්‍රීසි, භූගෝල විද්‍යාව',
    color: 'from-emerald-600 to-teal-700'
  },

  // University Streams
  {
    id: 'stream_uni_computing',
    categoryId: 'uni',
    name: 'Computing & Software Engineering',
    nameSinhala: 'පරිගණක විද්‍යාව & මෘදුකාංග ඉංජිනේරු විද්‍යාව',
    nameTamil: 'கணினி விஞ்ஞானம் & மென்பொருள் பொறியியல்',
    icon: 'Terminal',
    description: 'Data Structures, Algorithms, Web Technologies, Database Systems',
    descriptionSinhala: 'දත්ත ව්‍යුහ, ඇල්ගොරිතම, දත්ත සමුදාය (DBMS) සහ මෘදුකාංග සංවර්ධනය',
    color: 'from-blue-600 to-violet-800'
  },
  {
    id: 'stream_uni_business',
    categoryId: 'uni',
    name: 'Management & Financial Economics',
    nameSinhala: 'ව්‍යාපාර කළමනාකරණය & මූල්‍ය ආර්ථික විද්‍යාව',
    nameTamil: 'வணிக முகாமைத்துவம் மற்றும் நிதி',
    icon: 'Briefcase',
    description: 'Financial Management, Marketing, Organizational Behavior',
    descriptionSinhala: 'මූල්‍ය කළමනාකරණය, අලෙවිකරණය සහ උපායමාර්ගික කළමනාකරණය',
    color: 'from-amber-600 to-emerald-700'
  }
];

export const QUIZ_SUBJECTS: QuizSubject[] = [
  // Grade 5 Scholarship Subjects
  {
    id: 'sub_sch_sinhala',
    streamId: 'stream_scholarship_core',
    categoryId: 'scholarship',
    name: 'Sinhala Language & Reading',
    nameSinhala: 'සිංහල භාෂාව හා සාහිත්‍යය',
    nameTamil: 'சிங்கள மொழி மற்றும் இலக்கியம்',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-rose-500',
    gradeLevels: 'Grade 5 Scholarship',
    syllabusCode: 'SCH-SIN-01',
    descriptionSinhala: 'ව්‍යාකරණ, නිවැරදි අක්ෂර වින්‍යාසය, සමාන පද, විරුද්ධ පද, යුගල පද සහ ඡේද කියවීම'
  },
  {
    id: 'sub_sch_maths',
    streamId: 'stream_scholarship_core',
    categoryId: 'scholarship',
    name: 'Primary Mathematics & Word Problems',
    nameSinhala: 'ගණිතය හා ප්‍රශ්න විසඳීම',
    nameTamil: 'கணிதம் மற்றும் சிக்கல் தீர்க்கும் முறை',
    iconName: 'Calculator',
    color: 'from-blue-500 to-indigo-600',
    gradeLevels: 'Grade 5 Scholarship',
    syllabusCode: 'SCH-MAT-02',
    descriptionSinhala: 'ස්ථානීය අගය, සංඛ්‍යා රටා, ගුණ කිරීම, බෙදීම, භාග, දිග, බර, කාලය සහ කෙටි ක්‍රම'
  },
  {
    id: 'sub_sch_env',
    streamId: 'stream_scholarship_core',
    categoryId: 'scholarship',
    name: 'Environmental Studies & Science',
    nameSinhala: 'පරිසරය ආශ්‍රිත ක්‍රියාකාරකම්',
    nameTamil: 'சுற்றாடல் சார் செயற்பாடுகள்',
    iconName: 'Compass',
    color: 'from-emerald-500 to-teal-600',
    gradeLevels: 'Grade 5 Scholarship',
    syllabusCode: 'SCH-ENV-03',
    descriptionSinhala: 'ශාක හා සතුන්, සොබාදහම, කාලගුණය, ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාන සහ අපේ උරුමය'
  },
  {
    id: 'sub_sch_iq',
    streamId: 'stream_scholarship_core',
    categoryId: 'scholarship',
    name: 'IQ & Mental Reasoning',
    nameSinhala: 'බුද්ධි පරීක්ෂණය සහ තර්කනය (I පත්‍රය)',
    nameTamil: 'நுண்ணறிவு மற்றும் தர்க்கம்',
    iconName: 'Sparkles',
    color: 'from-purple-500 to-pink-600',
    gradeLevels: 'Grade 5 Scholarship',
    syllabusCode: 'SCH-IQ-04',
    descriptionSinhala: 'රූප රටා, කැට ගණන් කිරීම, කඩදාසි නැමීම්, තාර්කික සබඳතා සහ කාල ගණනය'
  },

  // A/L Maths Stream
  {
    id: 'sub_combined_maths',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    name: 'Combined Mathematics',
    nameSinhala: 'සංයුක්ත ගණිතය',
    nameTamil: 'இணைந்த கணிதம்',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-MATH-01',
    descriptionSinhala: 'අවකලනය, අනුකලනය, ත්‍රිකෝණමිතිය, ගති විද්‍යාව සහ ස්ථිති විද්‍යාව'
  },
  {
    id: 'sub_physics',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    name: 'Physics',
    nameSinhala: 'භෞතික විද්‍යාව',
    nameTamil: 'பௌதிகவியல்',
    iconName: 'Zap',
    color: 'from-amber-600 to-orange-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-PHYS-02',
    descriptionSinhala: 'යාන්ත්‍ර විද්‍යාව, දෝලන හා තරංග, තාපය, ධාරා විද්‍යුතය සහ ඉලෙක්ට්‍රොනික විද්‍යාව'
  },
  {
    id: 'sub_chemistry',
    streamId: 'stream_al_maths',
    categoryId: 'al',
    name: 'Chemistry',
    nameSinhala: 'රසායන විද්‍යාව',
    nameTamil: 'இரசாயனவியல்',
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-CHEM-03',
    descriptionSinhala: 'කාබනික රසායනය, අකාබනික රසායනය, භෞතික රසායනය සහ සමතුලිතතාව'
  },

  // A/L Bio Stream
  {
    id: 'sub_biology',
    streamId: 'stream_al_bio',
    categoryId: 'al',
    name: 'Biology',
    nameSinhala: 'ජීව විද්‍යාව',
    nameTamil: 'உயிரியல்',
    iconName: 'Dna',
    color: 'from-green-600 to-emerald-800',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-BIO-04',
    descriptionSinhala: 'සෛල ජීව විද්‍යාව, ප්‍රවේණිය, ශාක හා සත්ත්ව ආකාර හා ක්‍රියාකාරීත්වය'
  },
  {
    id: 'sub_bio_chem',
    streamId: 'stream_al_bio',
    categoryId: 'al',
    name: 'Chemistry (Bio Science)',
    nameSinhala: 'රසායන විද්‍යාව (ජීව විද්‍යා ධාරාව)',
    nameTamil: 'இரசாயனவியல்',
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-CHEM-03B',
    descriptionSinhala: 'ජීව රසායන විද්‍යාව, කාබනික යාන්ත්‍රණ සහ අකාබනික විශ්ලේෂණය'
  },

  // A/L Commerce Stream
  {
    id: 'sub_accounting',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    name: 'Accounting',
    nameSinhala: 'ගිණුම්කරණය',
    nameTamil: 'கணக்கீடு',
    iconName: 'FileText',
    color: 'from-blue-600 to-cyan-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-ACC-05',
    descriptionSinhala: 'මූල්‍ය ප්‍රකාශන, හවුල් ව්‍යාපාර, සමාගම් ගිණුම් සහ පිරිවැය ගිණුම්කරණය'
  },
  {
    id: 'sub_business_studies',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    name: 'Business Studies',
    nameSinhala: 'ව්‍යාපාර අධ්‍යයනය',
    nameTamil: 'வணிகக் கற்கைகள்',
    iconName: 'Briefcase',
    color: 'from-amber-600 to-orange-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-BS-06',
    descriptionSinhala: 'ව්‍යාපාර පරිසරය, කළමනාකරණය, අලෙවිකරණය සහ මානව සම්පත් කළමනාකරණය'
  },
  {
    id: 'sub_economics',
    streamId: 'stream_al_commerce',
    categoryId: 'al',
    name: 'Economics',
    nameSinhala: 'ආර්ථික විද්‍යාව',
    nameTamil: 'பொருளியல்',
    iconName: 'TrendingUp',
    color: 'from-emerald-600 to-teal-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-ECON-07',
    descriptionSinhala: 'ක්ෂුද්‍ර ආර්ථික විද්‍යාව, සාර්ව ආර්ථික විද්‍යාව, ජාත්‍යන්තර වෙළඳාම සහ මූල්‍ය ප්‍රතිපත්ති'
  },

  // A/L Arts Stream
  {
    id: 'sub_media_studies',
    streamId: 'stream_al_arts',
    categoryId: 'al',
    name: 'Communication & Media Studies',
    nameSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    nameTamil: 'தொடர்பாடலும் ஊடகக் கற்கைகளும்',
    iconName: 'Layers',
    color: 'from-amber-600 to-amber-900',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-MEDIA-08',
    descriptionSinhala: 'සන්නිවේදන ආකෘති, සිනමා ඉතිහාසය, පුවත්පත් කලාව සහ ගුවන්විදුලි/රූපවාහිනී මාධ්‍ය'
  },
  {
    id: 'sub_sinhala_lit',
    streamId: 'stream_al_arts',
    categoryId: 'al',
    name: 'Sinhala Language & Literature',
    nameSinhala: 'සිංහල භාෂාව හා සාහිත්‍යය (උ/පෙළ)',
    nameTamil: 'சிங்கள மொழியும் இலக்கியமும்',
    iconName: 'BookOpen',
    color: 'from-purple-600 to-indigo-800',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-SINH-09',
    descriptionSinhala: 'සම්භාව්‍ය ගද්‍ය-පද්‍ය සාහිත්‍යය, භාෂා ව්‍යාකරණ, සාහිත්‍ය විචාරය සහ නූතන නිර්මාණ'
  },

  // A/L Technology Stream
  {
    id: 'sub_engineering_tech',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    name: 'Engineering Technology (ET)',
    nameSinhala: 'ඉංජිනේරු තාක්ෂණවේදය',
    nameTamil: 'பொறியியல் தொழில்நுட்பம்',
    iconName: 'Cpu',
    color: 'from-cyan-600 to-blue-800',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-ET-10',
    descriptionSinhala: 'සිවිල්, යාන්ත්‍රික සහ විද්‍යුත් ඉංජිනේරු තාක්ෂණික සිද්ධාන්ත'
  },
  {
    id: 'sub_sft',
    streamId: 'stream_al_tech',
    categoryId: 'al',
    name: 'Science for Technology (SFT)',
    nameSinhala: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    nameTamil: 'தொழில்நுட்பத்திற்கான விஞ்ஞானம்',
    iconName: 'Flame',
    color: 'from-orange-600 to-red-700',
    gradeLevels: 'Grade 12 - 13 (A/L)',
    syllabusCode: 'AL-SFT-11',
    descriptionSinhala: 'ව්‍යවහාරික භෞතික විද්‍යාව, රසායන විද්‍යාව, ජීව විද්‍යාව සහ ගණිතය'
  },

  // O/L Core Stream
  {
    id: 'sub_ol_science',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    name: 'Science (O/L)',
    nameSinhala: 'විද්‍යාව (සා.පෙළ)',
    nameTamil: 'விஞ்ஞானம் (O/L)',
    iconName: 'Flame',
    color: 'from-cyan-600 to-blue-800',
    gradeLevels: 'Grade 10 - 11 (O/L)',
    syllabusCode: 'OL-SCI-20',
    descriptionSinhala: 'ජීව විද්‍යාත්මක ක්‍රියාවලි, පදාර්ථයේ ව්‍යුහය, බලය හා ශක්තිය, පරිසර විද්‍යාව'
  },
  {
    id: 'sub_ol_maths',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    name: 'Mathematics (O/L)',
    nameSinhala: 'ගණිතය (සා.පෙළ)',
    nameTamil: 'கணிதம் (O/L)',
    iconName: 'Percent',
    color: 'from-indigo-600 to-purple-800',
    gradeLevels: 'Grade 10 - 11 (O/L)',
    syllabusCode: 'OL-MATH-21',
    descriptionSinhala: 'වර්ගජ සමීකරණ, ජ්‍යාමිතිය, ත්‍රිකෝණමිතිය, සංඛ්‍යානය සහ සම්භාවිතාව'
  },
  {
    id: 'sub_ol_history',
    streamId: 'stream_ol_core',
    categoryId: 'ol',
    name: 'History (O/L)',
    nameSinhala: 'ඉතිහාසය (සා.පෙළ)',
    nameTamil: 'வரலாறு (O/L)',
    iconName: 'Landmark',
    color: 'from-amber-600 to-yellow-800',
    gradeLevels: 'Grade 10 - 11 (O/L)',
    syllabusCode: 'OL-HIST-22',
    descriptionSinhala: 'අනුරාධපුර, පොළොන්නරුව යුග, යටත් විජිත පාලනය සහ ශ්‍රී ලංකාවේ නිදහස් සටන'
  },

  // O/L Electives
  {
    id: 'sub_ol_ict',
    streamId: 'stream_ol_electives',
    categoryId: 'ol',
    name: 'Information & Communication Tech (ICT)',
    nameSinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
    nameTamil: 'தகவல் தொடர்பாடல் தொழில்நுட்பம்',
    iconName: 'Terminal',
    color: 'from-blue-600 to-cyan-700',
    gradeLevels: 'Grade 10 - 11 (O/L)',
    syllabusCode: 'OL-ICT-23',
    descriptionSinhala: 'පරිගණක දෘඩාංග, මෘදුකාංග, ඇල්ගොරිතම, HTML සහ අන්තර්ජාලය'
  },

  // Junior Foundation
  {
    id: 'sub_junior_science',
    streamId: 'stream_junior_foundation',
    categoryId: 'junior',
    name: 'Junior General Science',
    nameSinhala: 'කණිෂ්ඨ විද්‍යාව (6-9 ශ්‍රේණි)',
    nameTamil: 'இடைநிலை விஞ்ஞானம்',
    iconName: 'Sparkles',
    color: 'from-emerald-600 to-teal-800',
    gradeLevels: 'Grade 6 - 9',
    syllabusCode: 'JUN-SCI-30',
    descriptionSinhala: 'ශාක හා සතුන්, පදාර්ථයේ අවස්ථා, තාපය, ආලෝකය සහ විද්‍යුතය'
  },
  {
    id: 'sub_junior_maths',
    streamId: 'stream_junior_foundation',
    categoryId: 'junior',
    name: 'Junior Mathematics',
    nameSinhala: 'කණිෂ්ඨ ගණිතය (6-9 ශ්‍රේණි)',
    nameTamil: 'இடைநிலைக் கணிதம்',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-700',
    gradeLevels: 'Grade 6 - 9',
    syllabusCode: 'JUN-MATH-31',
    descriptionSinhala: 'භාග, ප්‍රතිශත, මූලික වීජ ගණිතය, කෝණ සහ පරිමිතිය'
  },

  // University Undergrad
  {
    id: 'sub_uni_dsa',
    streamId: 'stream_uni_computing',
    categoryId: 'uni',
    name: 'Data Structures & Algorithms',
    nameSinhala: 'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම (DSA)',
    nameTamil: 'தரவு கட்டமைப்புகள் மற்றும் அல்காரிதம்கள்',
    iconName: 'Code',
    color: 'from-blue-600 to-indigo-900',
    gradeLevels: 'Undergraduate Year 1-2',
    syllabusCode: 'UNI-CS-101',
    descriptionSinhala: 'Arrays, Linked Lists, Trees, Graphs, Sorting & Big-O Time Complexity'
  },
  {
    id: 'sub_uni_management',
    streamId: 'stream_uni_business',
    categoryId: 'uni',
    name: 'Principles of Financial Management',
    nameSinhala: 'මූල්‍ය කළමනාකරණ මූලධර්ම',
    nameTamil: 'நிதி முகாமைத்துவக் கோட்பாடுகள்',
    iconName: 'Briefcase',
    color: 'from-amber-600 to-orange-800',
    gradeLevels: 'Undergraduate Year 1-2',
    syllabusCode: 'UNI-MGT-201',
    descriptionSinhala: 'Time Value of Money, Capital Budgeting, Risk & Return, Capital Structure'
  }
];

export const UNIT_QUIZZES_DATA: UnitQuiz[] = [
  // 0. Grade 5 Scholarship - IQ & Mental Ability (I පත්‍රය)
  {
    id: 'quiz_sch_iq_01',
    title: 'Grade 5 Scholarship IQ & Mental Ability Challenge',
    titleSinhala: '5 ශිෂ්‍යත්ව බුද්ධි පරීක්ෂණ සහ තර්කන අභ්‍යාසය (I පත්‍රය)',
    titleTamil: 'தரம் 5 நுண்ணறிவு வினாத்தாள் 1',
    subjectId: 'sub_sch_iq',
    subjectName: 'IQ & Mental Reasoning',
    subjectSinhala: 'බුද්ධි පරීක්ෂණය (I පත්‍රය)',
    grade: 5,
    category: 'scholarship',
    stream: 'Grade 5 Primary Curriculum',
    streamId: 'stream_scholarship_core',
    unitNumber: 1,
    timeLimitMinutes: 12,
    totalMarks: 100,
    xpReward: 100,
    iconName: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    description: 'Solve fun pattern sequences, cube counting, and logical riddles guided by Kavi the Owl.',
    descriptionSinhala: 'කවි බකමූණා සමඟ රූප රටා, කැට ගණන් කිරීම සහ ශිෂ්‍යත්ව I පත්‍රයේ කෙටි ක්‍රම පුහුණු වෙමු.',
    questions: [
      {
        id: 'q_sch_iq_1',
        questionNumber: 1,
        questionText: 'What is the next number in sequence: 3, 6, 12, 24, ...?',
        questionTextSinhala: '3, 6, 12, 24, ... රටාවේ ඊළඟට ලැබෙන සංඛ්‍යාව කුමක්ද?',
        options: [
          { id: 'opt_1', text: '48', textSinhala: '48' },
          { id: 'opt_2', text: '36', textSinhala: '36' },
          { id: 'opt_3', text: '30', textSinhala: '30' },
          { id: 'opt_4', text: '50', textSinhala: '50' }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Each number is doubled (x 2). 24 x 2 = 48.',
        explanationSinhala: 'සෑම සංඛ්‍යාවක්ම 2 න් ගුණ වෙමින් වැඩි වේ. එබැවින් 24 x 2 = 48 කි.',
        guruPothaRef: '5 ශ්‍රේණිය ශිෂ්‍යත්ව ගුරු මාර්ගෝපදේශය - සංඛ්‍යා රටා',
        topic: 'Number Sequences',
        difficulty: 'Easy'
      },
      {
        id: 'q_sch_iq_2',
        questionNumber: 2,
        questionText: 'Which animal in Sri Lanka has the highest speed on ground?',
        questionTextSinhala: 'ශ්‍රී ලංකාවේ වෙසෙන සතුන් අතරින් ගොඩබිම වේගයෙන්ම දිව යා හැකි සත්ත්වයා කවුද?',
        options: [
          { id: 'opt_1', text: 'Sri Lankan Leopard (දිවියා)', textSinhala: 'ශ්‍රී ලංකා කොටියා / දිවියා' },
          { id: 'opt_2', text: 'Spotted Deer (තිත් මුවා)', textSinhala: 'තිත් මුවා' },
          { id: 'opt_3', text: 'Wild Boar (වල් ඌරා)', textSinhala: 'වල් ඌරා' },
          { id: 'opt_4', text: 'Elephant (අලියා)', textSinhala: 'අලියා' }
        ],
        correctOptionId: 'opt_2',
        explanation: 'The Spotted Deer runs exceptionally fast to escape predators.',
        explanationSinhala: 'තිත් මුවා පැයට කි.මී. 70 කට වඩා වැඩි වේගයකින් දිව යා හැක.',
        guruPothaRef: '5 ශ්‍රේණිය පරිසරය - අපේ සත්ත්ව ලෝකය',
        topic: 'Animal Adaptations',
        difficulty: 'Medium'
      },
      {
        id: 'q_sch_iq_3',
        questionNumber: 3,
        questionText: 'Select the correctly spelled Sinhala word for "Sun":',
        questionTextSinhala: '"සූර්යයා" යන තේරුම දෙන නිවැරදි සමාන පදය තෝරන්න:',
        options: [
          { id: 'opt_1', text: 'දිනකර (Dinakara)', textSinhala: 'දිනකර' },
          { id: 'opt_2', text: 'නිශාකර', textSinhala: 'නිශාකර' },
          { id: 'opt_3', text: 'තාරකා', textSinhala: 'තාරකා' },
          { id: 'opt_4', text: 'මේඝය', textSinhala: 'මේඝය' }
        ],
        correctOptionId: 'opt_1',
        explanation: '"දිනකර" means the maker of the day (the Sun). "නිශාකර" is the Moon.',
        explanationSinhala: 'දිනකර යනු හිරුට/සූර්යයාට සමාන පදයකි. නිශාකර යනු සඳට සමාන පදයයි.',
        guruPothaRef: '5 ශ්‍රේණිය සිංහල - සමාන පද',
        topic: 'Sinhala Vocabulary',
        difficulty: 'Easy'
      }
    ]
  },

  // 1. A/L Combined Mathematics - Integration & Calculus
  {
    id: 'quiz_cm_calculus_01',
    title: 'Definite Integration & Differential Calculus',
    titleSinhala: 'නියත අනුකලනය සහ අවකලන යෙදීම්',
    titleTamil: 'தொகையீட்டு மற்றும் வகையீட்டு கணிதம்',
    subjectId: 'sub_combined_maths',
    subjectName: 'Combined Mathematics',
    subjectSinhala: 'සංයුක්ත ගණිතය',
    grade: 13,
    category: 'al',
    stream: 'Physical Science (Maths)',
    streamId: 'stream_al_maths',
    unitNumber: 4,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-700',
    description: 'Test your mastery on integration by parts, substitution, limits, and rate of change problems.',
    descriptionSinhala: 'කොටස් වශයෙන් අනුකලනය, ආදේශ ක්‍රම සහ සීමා පිළිබඳ අ.පො.ස. උසස් පෙළ බහුවරණ පරීක්ෂණය.',
    questions: [
      {
        id: 'q_cm_1',
        questionNumber: 1,
        questionText: 'Evaluate the definite integral ∫ (from 0 to π/2) of sin(x) cos(x) dx:',
        questionTextSinhala: '∫ (0 සිට π/2 දක්වා) sin(x) cos(x) dx හි අගය සොයන්න:',
        options: [
          { id: 'opt_1', text: '1/2', textSinhala: '1/2' },
          { id: 'opt_2', text: '1', textSinhala: '1' },
          { id: 'opt_3', text: '1/4', textSinhala: '1/4' },
          { id: 'opt_4', text: '0', textSinhala: '0' },
          { id: 'opt_5', text: 'π/4', textSinhala: 'π/4' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Using identity sin(x)cos(x) = (1/2)sin(2x), ∫ (1/2)sin(2x) dx = [-1/4 cos(2x)] from 0 to π/2 = (-1/4)(-1 - 1) = 1/2.',
        explanationSinhala: 'sin(x)cos(x) = (1/2)sin(2x) ත්‍රිකෝණමිතික සර්වසාම්‍යය භාවිතයෙන්: ∫ (1/2)sin(2x) dx = [-1/4 cos(2x)] |(0->π/2) = -1/4(-1 - 1) = 1/2 ලැබේ.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 08 Integration',
        topic: 'Integration by Substitution',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_2',
        questionNumber: 2,
        questionText: 'Find the derivative d/dx [ln(x² + 1)] at x = 1:',
        questionTextSinhala: 'x = 1 දී d/dx [ln(x² + 1)] හි අගය වන්නේ:',
        options: [
          { id: 'opt_1', text: '1', textSinhala: '1' },
          { id: 'opt_2', text: '2', textSinhala: '2' },
          { id: 'opt_3', text: '1/2', textSinhala: '1/2' },
          { id: 'opt_4', text: 'ln(2)', textSinhala: 'ln(2)' },
          { id: 'opt_5', text: '2/ln(2)', textSinhala: '2/ln(2)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Chain rule: d/dx[ln(x² + 1)] = 2x / (x² + 1). At x = 1, (2*1) / (1 + 1) = 2/2 = 1.',
        explanationSinhala: 'දාම නීතිය අනුව: d/dx[ln(x² + 1)] = 2x / (x² + 1). x = 1 ආදේශ කළ විට: (2*1) / (1 + 1) = 2/2 = 1.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 07 Differentiation',
        topic: 'Chain Rule Differentiation',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_3',
        questionNumber: 3,
        questionText: 'The root of equation x² - (k+2)x + 4 = 0 are real and equal. What are the possible values of k?',
        questionTextSinhala: 'x² - (k+2)x + 4 = 0 සමීකරණයේ මූල තාත්වික හා සමාන නම්, k හි අගයන් වන්නේ:',
        options: [
          { id: 'opt_1', text: 'k = 2 or k = -6', textSinhala: 'k = 2 හෝ k = -6' },
          { id: 'opt_2', text: 'k = 4 or k = -4', textSinhala: 'k = 4 හෝ k = -4' },
          { id: 'opt_3', text: 'k = 0 only', textSinhala: 'k = 0 පමණි' },
          { id: 'opt_4', text: 'k = 6 or k = -2', textSinhala: 'k = 6 හෝ k = -2' },
          { id: 'opt_5', text: 'k = 1 or k = -3', textSinhala: 'k = 1 හෝ k = -3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'For equal roots, discriminant Δ = b² - 4ac = 0 => (k+2)² - 4(1)(4) = 0 => (k+2)² = 16 => k+2 = ±4 => k = 2 or k = -6.',
        explanationSinhala: 'මූල සමාන වන විට විවේචකය Δ = b² - 4ac = 0 වේ. (k+2)² - 16 = 0 => (k+2) = ±4 => k = 2 හෝ k = -6.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 02 Quadratic Equations',
        topic: 'Quadratic Discriminants',
        difficulty: 'Medium'
      },
      {
        id: 'q_cm_4',
        questionNumber: 4,
        questionText: 'Evaluate limit as x -> 0 of (sin 3x) / (2x):',
        questionTextSinhala: 'x -> 0 වන විට (sin 3x) / (2x) හි සීමාව (limit) වන්නේ:',
        options: [
          { id: 'opt_1', text: '3/2', textSinhala: '3/2' },
          { id: 'opt_2', text: '2/3', textSinhala: '2/3' },
          { id: 'opt_3', text: '1', textSinhala: '1' },
          { id: 'opt_4', text: '0', textSinhala: '0' },
          { id: 'opt_5', text: '3', textSinhala: '3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'lim (x->0) [sin(3x)/(3x)] * (3/2) = 1 * (3/2) = 3/2.',
        explanationSinhala: 'lim (x->0) [sin(3x)/(3x)] * (3/2) = 1 * (3/2) = 3/2 (ප්‍රමත සීමාව sin θ / θ = 1 භාවිතයෙන්).',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 06 Limits',
        topic: 'Trigonometric Limits',
        difficulty: 'Easy'
      },
      {
        id: 'q_cm_5',
        questionNumber: 5,
        questionText: 'What is the sum to infinity of the geometric progression 4, 4/3, 4/9, 4/27... ?',
        questionTextSinhala: '4, 4/3, 4/9, 4/27... ගුණෝත්තර ශ්‍රේණියේ අනන්තය දක්වා ඓක්‍යය (S∞) සොයන්න:',
        options: [
          { id: 'opt_1', text: '6', textSinhala: '6' },
          { id: 'opt_2', text: '8', textSinhala: '8' },
          { id: 'opt_3', text: '12', textSinhala: '12' },
          { id: 'opt_4', text: '16/3', textSinhala: '16/3' },
          { id: 'opt_5', text: '4.5', textSinhala: '4.5' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'First term a = 4, common ratio r = 1/3. S∞ = a / (1 - r) = 4 / (1 - 1/3) = 4 / (2/3) = 6.',
        explanationSinhala: 'පළමු පදය a = 4, පොදු අනුපාතය r = 1/3. අනන්ත ඓක්‍යය S∞ = a / (1 - r) = 4 / (1 - 1/3) = 4 / (2/3) = 6 වේ.',
        guruPothaRef: 'A/L Combined Maths Syllabus • Unit 04 Series & Progressions',
        topic: 'Geometric Series',
        difficulty: 'Medium'
      }
    ]
  },

  // 2. A/L Physics - Mechanics & Circular Motion
  {
    id: 'quiz_phys_mechanics_01',
    title: 'Newtonian Mechanics & Circular Motion',
    titleSinhala: 'නිව්ටෝනියානු යාන්ත්‍ර විද්‍යාව සහ වෘත්ත චලිතය',
    titleTamil: 'நியூட்டனின் இயக்கவியல் மற்றும் வட்ட இயக்கம்',
    subjectId: 'sub_physics',
    subjectName: 'Physics',
    subjectSinhala: 'භෞතික විද්‍යාව',
    grade: 12,
    category: 'al',
    stream: 'Physical Science (Maths)',
    streamId: 'stream_al_maths',
    unitNumber: 2,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Zap',
    color: 'from-amber-600 to-orange-700',
    description: 'Master Newton laws, circular motion, angular momentum, and energy conservation.',
    descriptionSinhala: 'බලය, ඝර්ෂණය, කේන්ද්‍රාභිසාරී බලය සහ ගම්‍යතා සංස්ථිතිය පිළිබඳ ආදර්ශ ගැටලු.',
    questions: [
      {
        id: 'q_phy_1',
        questionNumber: 1,
        questionText: 'A car of mass 1000 kg moves at 20 m/s around a circular curve of radius 100 m on a flat road. What is the required centripetal force?',
        questionTextSinhala: 'ස්කන්ධය 1000 kg වන මෝටර් රථයක් 100 m අරයක් ඇති තිරස් වෘත්තාකාර මාර්ගයක 20 m/s වේගයෙන් ගමන් කරයි නම්, අවශ්‍ය කේන්ද්‍රාභිසාරී බලය කොපමණද?',
        options: [
          { id: 'opt_1', text: '4000 N', textSinhala: '4000 N' },
          { id: 'opt_2', text: '2000 N', textSinhala: '2000 N' },
          { id: 'opt_3', text: '8000 N', textSinhala: '8000 N' },
          { id: 'opt_4', text: '200 N', textSinhala: '200 N' },
          { id: 'opt_5', text: '400 N', textSinhala: '400 N' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'F = mv²/r = (1000 * 20²) / 100 = (1000 * 400) / 100 = 4000 N provided by road friction.',
        explanationSinhala: 'කේන්ද්‍රාභිසාරී බලය F = mv²/r = (1000 * 20²) / 100 = (1000 * 400) / 100 = 4000 N වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 02 Mechanics',
        topic: 'Circular Motion',
        difficulty: 'Easy'
      },
      {
        id: 'q_phy_2',
        questionNumber: 2,
        questionText: 'When an object of mass m falls through a viscous fluid, its terminal velocity (v_t) is directly proportional to:',
        questionTextSinhala: 'ස්කන්ධය m වන වස්තුවක් දුස්ස්‍රාවී තරලයක් තුළින් වැටෙන විට, එහි අන්ත ප්‍රවේගය (v_t) අනුලෝමව සමානුපාතික වන්නේ:',
        options: [
          { id: 'opt_1', text: 'Square of radius (r²)', textSinhala: 'අරයේ වර්ගයට (r²)' },
          { id: 'opt_2', text: 'Radius (r)', textSinhala: 'අරයට (r)' },
          { id: 'opt_3', text: 'Square root of radius (√r)', textSinhala: 'අරයේ වර්ගමූලයට (√r)' },
          { id: 'opt_4', text: 'Viscosity coefficient (η)', textSinhala: 'දුස්ස්‍රාවිතා සංගුණකයට (η)' },
          { id: 'opt_5', text: '1/r²', textSinhala: '1/r² ට' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'By Stokes Law: v_t = [2r²(ρ - σ)g] / (9η). Hence terminal velocity is proportional to r².',
        explanationSinhala: 'ස්ටෝක්ස් නියමය අනුව: v_t = [2r²(ρ - σ)g] / (9η) බැවින් අන්ත ප්‍රවේගය ගෝලයේ අරයේ වර්ගයට (r²) අනුලෝමව සමානුපාතික වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 03 Matter Properties',
        topic: 'Viscosity & Stokes Law',
        difficulty: 'Medium'
      },
      {
        id: 'q_phy_3',
        questionNumber: 3,
        questionText: 'What is the work done in stretching a spring of stiffness constant k by an extension x from its natural length?',
        questionTextSinhala: 'ස්වභාවික දිගෙහි ඇති k දුනු නියතයක් සහිත දුන්නක් x ප්‍රමාණයකින් ඇදීමේදී කරන ලද කාර්යය වන්නේ:',
        options: [
          { id: 'opt_1', text: '1/2 k x²', textSinhala: '1/2 k x²' },
          { id: 'opt_2', text: 'k x', textSinhala: 'k x' },
          { id: 'opt_3', text: 'k x²', textSinhala: 'k x²' },
          { id: 'opt_4', text: '2 k x²', textSinhala: '2 k x²' },
          { id: 'opt_5', text: '1/2 k² x', textSinhala: '1/2 k² x' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Elastic potential energy / Work done W = ∫ kx dx = 1/2 k x².',
        explanationSinhala: 'ප්‍රත්‍යාස්ථ විභව ශක්තිය / දුන්න ඇදීමට කළ කාර්යය W = 1/2 k x² සූත්‍රයෙන් ලැබේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 02 Work, Energy & Power',
        topic: 'Work and Elastic Energy',
        difficulty: 'Easy'
      },
      {
        id: 'q_phy_4',
        questionNumber: 4,
        questionText: 'A simple pendulum has period T on Earth. If taken to the Moon where g_moon = g_earth / 6, the new period will be:',
        questionTextSinhala: 'පෘථිවියේදී T ආවර්ත කාලයක් ඇති සරල ලෝලකයක් ගුරුත්වජ ත්වරණය g/6 වන සඳ මතුපිටට ගෙන ගියහොත් නව ආවර්ත කාලය:',
        options: [
          { id: 'opt_1', text: '√6 T', textSinhala: '√6 T' },
          { id: 'opt_2', text: 'T / √6', textSinhala: 'T / √6' },
          { id: 'opt_3', text: '6 T', textSinhala: '6 T' },
          { id: 'opt_4', text: 'T / 6', textSinhala: 'T / 6' },
          { id: 'opt_5', text: '36 T', textSinhala: '36 T' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'T = 2π√(L/g). When g becomes g/6, T_new = 2π√(6L/g) = √6 * T.',
        explanationSinhala: 'සරල ලෝලකයක ආවර්ත කාලය T = 2π√(L/g) බැවින් g අගය 6 ගුණයකින් අඩු වන විට T අගය √6 ගුණයකින් වැඩි වේ.',
        guruPothaRef: 'A/L Physics Resource Book • Unit 04 Oscillations & Waves',
        topic: 'Simple Harmonic Motion',
        difficulty: 'Medium'
      }
    ]
  },

  // 3. A/L Chemistry - Organic Mechanisms & Chemical Bonding
  {
    id: 'quiz_chem_organic_01',
    title: 'Organic Reaction Mechanisms & Bonding',
    titleSinhala: 'කාබනික ප්‍රතික්‍රියා යාන්ත්‍රණ සහ රසායනික බන්ධන',
    titleTamil: 'சேதன இரசாயன தாக்கப் பொறிமுறைகள்',
    subjectId: 'sub_chemistry',
    subjectName: 'Chemistry',
    subjectSinhala: 'රසායන විද්‍යාව',
    grade: 12,
    category: 'al',
    stream: 'Physical Science (Maths)',
    streamId: 'stream_al_maths',
    unitNumber: 3,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    description: 'Master electrophilic addition, nucleophilic substitution (SN1/SN2), and hybrid orbitals.',
    descriptionSinhala: 'ඉලෙක්ට්‍රෝෆිලික එකතු වීම්, නියුක්ලියෝෆිලික ආදේශ සහ sp³/sp²/sp මුහුම්කරණ ප්‍රශ්න.',
    questions: [
      {
        id: 'q_ch_1',
        questionNumber: 1,
        questionText: 'When propene (CH3-CH=CH2) reacts with HBr in absence of peroxides, the major product according to Markovnikov rule is:',
        questionTextSinhala: 'පෙරොක්සයිඩ නොමැති විට ප්‍රොපීන් (CH3-CH=CH2) සමඟ HBr ප්‍රතික්‍රියා කළ විට මාකෝනිකොව් නියමයට අනුව ලැබෙන ප්‍රධාන ඵලය වන්නේ:',
        options: [
          { id: 'opt_1', text: '2-bromopropane', textSinhala: '2-බ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_2', text: '1-bromopropane', textSinhala: '1-බ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_3', text: '1,2-dibromopropane', textSinhala: '1,2-ඩයිබ්‍රෝමෝප්‍රොපේන්' },
          { id: 'opt_4', text: 'Cyclopropane', textSinhala: 'සයික්ලෝප්‍රොපේන්' },
          { id: 'opt_5', text: '2,2-dibromopropane', textSinhala: '2,2-ඩයිබ්‍රෝමෝප්‍රොපේන්' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Electrophilic addition goes via the more stable secondary carbocation (CH3-CH(+)-CH3), yielding 2-bromopropane.',
        explanationSinhala: 'මාකෝනිකොව් නියමය අනුව වඩා ස්ථායී ද්විතීයික කාබොකැටායනය (2° carbocation) හරහා ප්‍රතික්‍රියාව සිදුවන බැවින් 2-බ්‍රෝමෝප්‍රොපේන් ප්‍රධාන ඵලය වේ.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 07 Organic Chemistry',
        topic: 'Electrophilic Addition',
        difficulty: 'Easy'
      },
      {
        id: 'q_ch_2',
        questionNumber: 2,
        questionText: 'What is the geometry and bond angle around the central chlorine atom in ClF3 molecule according to VSEPR theory?',
        questionTextSinhala: 'VSEPR සිද්ධාන්තයට අනුව ClF3 අණුවේ මධ්‍ය ක්ලෝරීන් පරමාණුව වටා ජ්‍යාමිතිය සහ බන්ධන කෝණය වන්නේ:',
        options: [
          { id: 'opt_1', text: 'T-shaped, ~87.5°', textSinhala: 'T-හැඩැති, ~87.5°' },
          { id: 'opt_2', text: 'Trigonal planar, 120°', textSinhala: 'ත්‍රිකෝණාකාර තලීය, 120°' },
          { id: 'opt_3', text: 'Trigonal pyramidal, 107°', textSinhala: 'ත්‍රිකෝණාකාර පිරමිඩාකාර, 107°' },
          { id: 'opt_4', text: 'Linear, 180°', textSinhala: 'රේඛීය, 180°' },
          { id: 'opt_5', text: 'See-saw, 90° & 120°', textSinhala: 'සිසෝ හැඩය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'ClF3 has 3 bonding pairs and 2 lone pairs on Cl (AX3E2). Trigonal bipyramidal electron geometry gives a T-shaped molecular shape.',
        explanationSinhala: 'ClF3 හි බන්ධන යුගල 3ක් සහ ඒකාක යුගල 2ක් (AX3E2) පවතින බැවින් අණුක හැඩය T-හැඩැති (T-shaped) වේ.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 02 Chemical Bonding',
        topic: 'VSEPR Theory',
        difficulty: 'Medium'
      },
      {
        id: 'q_ch_3',
        questionNumber: 3,
        questionText: 'Which reagent can distinguish between an Aldehyde and a Ketone by forming a silver mirror?',
        questionTextSinhala: 'ඇල්ඩිහයිඩ සහ කීටෝන වෙන්කර හඳුනා ගැනීමට රිදී කැඩපතක් (silver mirror) සාදන ප්‍රතිකාරකය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Tollens\' Reagent [Ag(NH3)2]+', textSinhala: 'ටොලන්ස් ප්‍රතිකාරකය (Tollens\' Reagent)' },
          { id: 'opt_2', text: '2,4-DNP', textSinhala: '2,4-ඩයිනයිට්‍රෝෆීනයිල්හයිඩ්‍රසීන් (2,4-DNP)' },
          { id: 'opt_3', text: 'Lucas Reagent (ZnCl2/HCl)', textSinhala: 'ලූකස් ප්‍රතිකාරකය' },
          { id: 'opt_4', text: 'Neutral FeCl3 solution', textSinhala: 'උදාසීන FeCl3 ද්‍රාවණය' },
          { id: 'opt_5', text: 'Aqueous NaHCO3', textSinhala: 'ජලීය NaHCO3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Tollens reagent oxidizes aldehydes to carboxylate ions while Ag+ is reduced to metallic silver (silver mirror). Ketones do not react.',
        explanationSinhala: 'ටොලන්ස් ප්‍රතිකාරකය මගින් ඇල්ඩිහයිඩ පමණක් ඔක්සිකරණය කර රිදී ලෝහය (Ag) තැන්පත් කරමින් රිදී කැඩපත සාදයි.',
        guruPothaRef: 'A/L Chemistry Resource Book • Unit 08 Carbonyl Compounds',
        topic: 'Aldehyde and Ketone Tests',
        difficulty: 'Easy'
      }
    ]
  },

  // 4. A/L Biology - Cell Division & Genetics
  {
    id: 'quiz_bio_genetics_01',
    title: 'Cell Division, Genetics & Molecular Biology',
    titleSinhala: 'සෛල විභාජනය, ප්‍රවේණිය සහ අණුක ජීව විද්‍යාව',
    titleTamil: 'கலப்பிரிவு மற்றும் பாரம்பரியவியல்',
    subjectId: 'sub_biology',
    subjectName: 'Biology',
    subjectSinhala: 'ජීව විද්‍යාව',
    grade: 12,
    category: 'al',
    stream: 'Biological Science (Bio)',
    streamId: 'stream_al_bio',
    unitNumber: 4,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Dna',
    color: 'from-green-600 to-emerald-800',
    description: 'Test your understanding of mitosis, meiosis, Mendelian ratios, DNA replication, and protein synthesis.',
    descriptionSinhala: 'ඌනන විභාජනය, මෙන්ඩලීය ප්‍රවේණිය සහ ඩී.එන්.ඒ. ප්‍රතිවලිත වීම පිළිබඳ බහුවරණ.',
    questions: [
      {
        id: 'q_bio_1',
        questionNumber: 1,
        questionText: 'During which stage of Meiosis does crossing over (chiasma formation) occur between non-sister chromatids?',
        questionTextSinhala: 'ඌනන විභාජනයේදී සහෝදර නොවන වර්ණදේහාංශ අතර ප්‍රතිසංයෝජනය හෙවත් ස්වස්තික (Chiasma) සෑදෙන්නේ කුමන අවස්ථාවේදීද?',
        options: [
          { id: 'opt_1', text: 'Prophase I (Pachytene)', textSinhala: 'පූර්වකලාව I (Prophase I)' },
          { id: 'opt_2', text: 'Metaphase I', textSinhala: 'මධ්‍යකලාව I (Metaphase I)' },
          { id: 'opt_3', text: 'Anaphase I', textSinhala: 'පශ්චාත්කලාව I (Anaphase I)' },
          { id: 'opt_4', text: 'Telophase II', textSinhala: 'අන්තකලාව II (Telophase II)' },
          { id: 'opt_5', text: 'Prophase II', textSinhala: 'පූර්වකලාව II (Prophase II)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Synapsis and crossing over occur during Prophase I of Meiosis, resulting in genetic recombination and diversity.',
        explanationSinhala: 'ස්වස්තික සෑදීම සහ ප්‍රතිසංයෝජනය සිදුවන්නේ ඌනන විභාජනයේ පූර්වකලාව I (Prophase I) හිදීය.',
        guruPothaRef: 'A/L Biology Resource Book • Unit 04 Genetics',
        topic: 'Meiosis and Crossing Over',
        difficulty: 'Easy'
      },
      {
        id: 'q_bio_2',
        questionNumber: 2,
        questionText: 'In a dihybrid cross of two heterozygous individuals (AaBb x AaBb), what proportion of offspring are expected to have the genotype AABB?',
        questionTextSinhala: 'විෂමයුග්මක දෙමුහුම් දෙමාපියන් දෙදෙනෙකු (AaBb x AaBb) අතර මුහුමකදී AABB ප්‍රවේණිදර්ශය සහිත දරුවන් ලැබීමේ සම්භාවිතාව කොපමණද?',
        options: [
          { id: 'opt_1', text: '1/16', textSinhala: '1/16' },
          { id: 'opt_2', text: '9/16', textSinhala: '9/16' },
          { id: 'opt_3', text: '3/16', textSinhala: '3/16' },
          { id: 'opt_4', text: '4/16 (1/4)', textSinhala: '4/16 (1/4)' },
          { id: 'opt_5', text: '2/16 (1/8)', textSinhala: '2/16 (1/8)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'P(AA) = 1/4 and P(BB) = 1/4. Since genes assort independently, P(AABB) = (1/4) * (1/4) = 1/16.',
        explanationSinhala: 'ස්වාධීන ව්‍යූහන නියමයට අනුව P(AA) = 1/4 සහ P(BB) = 1/4 බැවින් P(AABB) = 1/4 * 1/4 = 1/16 වේ.',
        guruPothaRef: 'A/L Biology Resource Book • Unit 04 Mendelian Genetics',
        topic: 'Dihybrid Cross Ratios',
        difficulty: 'Medium'
      }
    ]
  },

  // 5. A/L Commerce - Accounting (ගිණුම්කරණය)
  {
    id: 'quiz_comm_accounting_01',
    title: 'Partnerships & Financial Statements Analysis',
    titleSinhala: 'හවුල් ව්‍යාපාර ගිණුම් සහ මූල්‍ය ප්‍රකාශන විශ්ලේෂණය',
    titleTamil: 'கூட்டாண்மை கணக்குகள் மற்றும் நிதி அறிக்கைகள்',
    subjectId: 'sub_accounting',
    subjectName: 'Accounting',
    subjectSinhala: 'ගිණුම්කරණය',
    grade: 13,
    category: 'al',
    stream: 'Commerce Stream',
    streamId: 'stream_al_commerce',
    unitNumber: 3,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'FileText',
    color: 'from-blue-600 to-cyan-700',
    description: 'Master partnership appropriation accounts, goodwill adjustment, and liquidity ratios.',
    descriptionSinhala: 'ලාභ බෙදාහැරීමේ ගිණුම, කීර්තිනාම ගැලපීම් සහ ද්‍රවශීලතා අනුපාත පිළිබඳ බහුවරණ.',
    questions: [
      {
        id: 'q_acc_1',
        questionNumber: 1,
        questionText: 'Under the Sri Lanka Accounting Standards (LKAS/SLFRS), what is the formula to calculate Quick Ratio (Acid Test Ratio)?',
        questionTextSinhala: 'ශ්‍රී ලංකා ගිණුම්කරණ ප්‍රමිති අනුව ද්‍රවශීලතා අනුපාතය (Quick Ratio / Acid Test Ratio) ගණනය කරන්නේ කෙසේද?',
        options: [
          { id: 'opt_1', text: '(Current Assets - Inventories) / Current Liabilities', textSinhala: '(ජංගම වත්කම් - තොග) / ජංගම වගකීම්' },
          { id: 'opt_2', text: 'Current Assets / Current Liabilities', textSinhala: 'ජංගම වත්කම් / ජංගම වගකීම්' },
          { id: 'opt_3', text: '(Current Assets + Inventories) / Long Term Debt', textSinhala: '(ජංගම වත්කම් + තොග) / දිගුකාලීන ණය' },
          { id: 'opt_4', text: 'Cash / Total Assets', textSinhala: 'මුදල් / මුළු වත්කම්' },
          { id: 'opt_5', text: 'Gross Profit / Current Liabilities', textSinhala: 'දළ ලාභය / ජංගම වගකීම්' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Quick Ratio measures short-term liquidity by excluding inventory (the least liquid current asset): Quick Ratio = (Current Assets - Inventory) / Current Liabilities.',
        explanationSinhala: 'ද්‍රවශීලතා අනුපාතය = (ජංගම වත්කම් - තොග) / ජංගම වගකීම් සූත්‍රයෙන් ගණනය කරනු ලැබේ.',
        guruPothaRef: 'A/L Accounting Resource Book • Unit 09 Financial Ratio Analysis',
        topic: 'Liquidity Ratios',
        difficulty: 'Easy'
      },
      {
        id: 'q_acc_2',
        questionNumber: 2,
        questionText: 'In absence of a partnership agreement (Deed), what rate of interest per annum is allowed on partner loan advances according to the 1890 Partnership Ordinance?',
        questionTextSinhala: 'හවුල් ගිවිසුමක් නොමැති විට, හවුල්කරුවෙකු විසින් ව්‍යාපාරයට ලබාදුන් අත්තිකාරම් ණය සඳහා හිමිවන වාර්ෂික පොලී අනුපාතිකය කුමක්ද?',
        options: [
          { id: 'opt_1', text: '5% per annum', textSinhala: 'වසරකට 5% ක පොලියක්' },
          { id: 'opt_2', text: '10% per annum', textSinhala: 'වසරකට 10% ක පොලියක්' },
          { id: 'opt_3', text: '0% (No interest allowed)', textSinhala: 'පොලී හිමි නොවේ (0%)' },
          { id: 'opt_4', text: '6% per annum', textSinhala: 'වසරකට 6% ක පොලියක්' },
          { id: 'opt_5', text: 'Central Bank Base Rate', textSinhala: 'මහ බැංකු පොලී අනුපාතිකය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Under the 1890 Partnership Ordinance (applicable in SL in absence of agreement), partners are entitled to 5% p.a. interest on loan advances.',
        explanationSinhala: 'හවුල් ගිවිසුමක් නොමැති විට 1890 හවුල් ව්‍යාපාර ආඥා පනත අනුව හවුල්කරු ණය සඳහා වසරකට 5% ක පොලියක් හිමිවේ.',
        guruPothaRef: 'A/L Accounting Resource Book • Unit 05 Partnership Accounting',
        topic: 'Partnership Ordinance 1890',
        difficulty: 'Medium'
      }
    ]
  },

  // 6. A/L Commerce - Business Studies (ව්‍යාපාර අධ්‍යයනය)
  {
    id: 'quiz_comm_bs_01',
    title: 'Principles of Management & Organizational Theories',
    titleSinhala: 'කළමනාකරණ මූලධර්ම සහ සංවිධාන න්‍යාය',
    titleTamil: 'முகாமைத்துவக் கொள்கைகளும் நிறுவனக் கோட்பாடுகளும்',
    subjectId: 'sub_business_studies',
    subjectName: 'Business Studies',
    subjectSinhala: 'ව්‍යාපාර අධ්‍යයනය',
    grade: 12,
    category: 'al',
    stream: 'Commerce Stream',
    streamId: 'stream_al_commerce',
    unitNumber: 2,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Briefcase',
    color: 'from-amber-600 to-orange-700',
    description: 'Master Henri Fayol 14 principles, Maslow hierarchy of needs, and SWOT analysis.',
    descriptionSinhala: 'හෙන්රි ෆෙයෝල්ගේ 14 මූලධර්ම, මැස්ලෝගේ අවශ්‍යතා ධුරාවලිය සහ කළමනාකරණ කාර්යයන්.',
    questions: [
      {
        id: 'q_bs_1',
        questionNumber: 1,
        questionText: 'According to Henri Fayol, which management principle states that an employee should receive orders from one superior only?',
        questionTextSinhala: 'හෙන්රි ෆෙයෝල්ගේ කළමනාකරණ මූලධර්ම අනුව එක් සේවකයෙකුට උපදෙස් ලැබිය යුත්තේ එක් ප්‍රධානියෙකුගෙන් පමණක් බව දැක්වෙන මූලධර්මය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Unity of Command (විධාන ඒකීයත්වය)', textSinhala: 'විධාන ඒකීයත්වය (Unity of Command)' },
          { id: 'opt_2', text: 'Unity of Direction (දිශා ඒකීයත්වය)', textSinhala: 'දිශා ඒකීයත්වය (Unity of Direction)' },
          { id: 'opt_3', text: 'Scalar Chain (ශ්‍රේණි දාමය)', textSinhala: 'ශ්‍රේණි දාමය (Scalar Chain)' },
          { id: 'opt_4', text: 'Division of Work (ශ්‍රම විභජනය)', textSinhala: 'ශ්‍රම විභජනය' },
          { id: 'opt_5', text: 'Espirit de Corps (කණ්ඩායම් හැඟීම)', textSinhala: 'කණ්ඩායම් හැඟීම' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Unity of Command dictates that an employee receives instructions from and reports to only one direct manager to avoid confusion.',
        explanationSinhala: 'විධාන ඒකීයත්වය මූලධර්මය මගින් එක් සේවකයෙකු එක් ප්‍රධානියෙකුට පමණක් වගකිව යුතු බව අවධාරණය කෙරේ.',
        guruPothaRef: 'A/L Business Studies Syllabus • Unit 04 Management Functions',
        topic: 'Henri Fayol Principles',
        difficulty: 'Easy'
      }
    ]
  },

  // 7. A/L Commerce - Economics (ආර්ථික විද්‍යාව)
  {
    id: 'quiz_comm_econ_01',
    title: 'Market Equilibrium, Elasticity & Fiscal Policy',
    titleSinhala: 'වෙළඳපොළ සමතුලිතතාව, නම්‍යතාව සහ රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය',
    titleTamil: 'சந்தைச் சமநிலை மற்றும் நெகிழ்ச்சி',
    subjectId: 'sub_economics',
    subjectName: 'Economics',
    subjectSinhala: 'ආර්ථික විද්‍යාව',
    grade: 12,
    category: 'al',
    stream: 'Commerce Stream',
    streamId: 'stream_al_commerce',
    unitNumber: 2,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'TrendingUp',
    color: 'from-emerald-600 to-teal-700',
    description: 'Master price elasticity of demand (PED), cross elasticity, consumer surplus, and monetary tools.',
    descriptionSinhala: 'ඉල්ලුමේ මිල නම්‍යතාව, පාරිභෝගික අතිරික්තය සහ බදු ප්‍රතිපත්ති ආශ්‍රිත ප්‍රශ්න.',
    questions: [
      {
        id: 'q_econ_1',
        questionNumber: 1,
        questionText: 'When the price of a good falls by 10% and the quantity demanded rises by 20%, what is the Price Elasticity of Demand (PED)?',
        questionTextSinhala: 'භාණ්ඩයක මිල 10% කින් පහත වැටෙන විට ඉල්ලුම් ප්‍රමාණය 20% කින් ඉහළ යයි නම්, ඉල්ලුමේ මිල නම්‍යතාවය (PED) වන්නේ:',
        options: [
          { id: 'opt_1', text: '2.0 (Elastic demand)', textSinhala: '2.0 (නම්‍ය ඉල්ලුම)' },
          { id: 'opt_2', text: '0.5 (Inelastic demand)', textSinhala: '0.5 (අනම්‍ය ඉල්ලුම)' },
          { id: 'opt_3', text: '1.0 (Unitary elastic)', textSinhala: '1.0 (ඒකීය නම්‍ය)' },
          { id: 'opt_4', text: '0.0 (Perfectly inelastic)', textSinhala: '0.0 (පූර්ණ අනම්‍ය)' },
          { id: 'opt_5', text: '200 (Infinity)', textSinhala: '200' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'PED = % Change in Quantity Demanded / % Change in Price = 20% / 10% = 2.0. Since PED > 1, demand is price elastic.',
        explanationSinhala: 'PED = ඉල්ලුම් ප්‍රමාණයේ ප්‍රතිශත වෙනස / මිලෙහි ප්‍රතිශත වෙනස = 20% / 10% = 2.0 (නම්‍ය ඉල්ලුම) වේ.',
        guruPothaRef: 'A/L Economics Resource Book • Unit 02 Price Mechanism & Elasticity',
        topic: 'Price Elasticity of Demand',
        difficulty: 'Easy'
      }
    ]
  },

  // 8. A/L Arts - Communication & Media Studies
  {
    id: 'quiz_al_media_theories_01',
    title: 'Communication Models, Lasswell, Berlo & Semiotics',
    titleSinhala: 'සන්නිවේදන ආකෘති, ලැස්වෙල්, බර්ලෝ SMCR සහ සංකේතවේදය',
    titleTamil: 'தொடர்பாடல் மாதிரிகள் & குறியியல் (A/L Media Studies)',
    subjectId: 'sub_media_studies',
    subjectName: 'Communication & Media Studies',
    subjectSinhala: 'සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය',
    grade: 13,
    category: 'al',
    stream: 'Arts & Humanities',
    streamId: 'stream_al_arts',
    unitNumber: 1,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Layers',
    color: 'from-amber-600 to-amber-900',
    description: 'Test your grasp on Harold Lasswell 5-question formula, Shannon & Weaver noise, Berlo SMCR, and Saussure semiotic signs.',
    descriptionSinhala: 'ලැස්වෙල් ආකෘතිය, ෂැනන් සහ වීවර්ගේ ඝෝෂාව, බර්ලෝගේ ආකෘතිය සහ සසූර්ගේ සංකේතවේදය පිළිබඳ උසස් පෙළ බහුවරණ පරීක්ෂණය.',
    questions: [
      {
        id: 'q_med_1',
        questionNumber: 1,
        questionText: 'In Harold Lasswell\'s (1948) 5-question communication model, what research analysis corresponds to the question "In Which Channel?"',
        questionTextSinhala: 'හැරල්ඩ් ලැස්වෙල්ගේ (1948) සන්නිවේදන ආකෘතියේ "කුමන නාලිකාවෙන්ද?" (In Which Channel?) යන ප්‍රශ්නයට අදාළ වන පර්යේෂණ ක්ෂේත්‍රය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Media Analysis (මාධ්‍ය විශ්ලේෂණය)', textSinhala: 'මාධ්‍ය විශ්ලේෂණය (Media Analysis)' },
          { id: 'opt_2', text: 'Control Analysis (පාලන විශ්ලේෂණය)', textSinhala: 'පාලන විශ්ලේෂණය (Control Analysis)' },
          { id: 'opt_3', text: 'Content Analysis (අන්තර්ගත විශ්ලේෂණය)', textSinhala: 'අන්තර්ගත විශ්ලේෂණය (Content Analysis)' },
          { id: 'opt_4', text: 'Audience Analysis (ප්‍රේක්ෂක විශ්ලේෂණය)', textSinhala: 'ප්‍රේක්ෂක විශ්ලේෂණය (Audience Analysis)' },
          { id: 'opt_5', text: 'Effects Analysis (බලපෑම් විශ්ලේෂණය)', textSinhala: 'බලපෑම් විශ්ලේෂණය (Effects Analysis)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'In Lasswell\'s model: Who = Control Analysis, Says What = Content Analysis, In Which Channel = Media Analysis, To Whom = Audience Analysis, With What Effect = Effects Analysis.',
        explanationSinhala: 'ලැස්වෙල් ආකෘතියේ: කවුරුන්ද = පාලන විශ්ලේෂණය, කුමක් පවසයිද = අන්තර්ගත විශ්ලේෂණය, කුමන නාලිකාවෙන්ද = මාධ්‍ය විශ්ලේෂණය, කා හටද = ප්‍රේක්ෂක විශ්ලේෂණය, කුමන බලපෑමකින්ද = බලපෑම් විශ්ලේෂණය.',
        guruPothaRef: 'A/L Media Studies Teacher Guide • Unit 01 Communication Models',
        topic: 'Harold Lasswell Model',
        difficulty: 'Easy'
      },
      {
        id: 'q_med_2',
        questionNumber: 2,
        questionText: 'Which communication model was the first to introduce the concept of "Noise Source" (සන්නිවේදන බාධක / ඝෝෂාව)?',
        questionTextSinhala: 'සන්නිවේදන ක්‍රියාවලියට "ඝෝෂාව" (Noise Source) හෙවත් බාධක සංකල්පය ප්‍රථම වරට හඳුන්වාදුන් ආකෘතිය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Shannon and Weaver Model (1949)', textSinhala: 'ෂැනන් සහ වීවර්ගේ ගණිතමය ආකෘතිය (1949)' },
          { id: 'opt_2', text: 'Aristotle\'s Rhetoric Model', textSinhala: 'ඇරිස්ටෝටල්ගේ ආකෘතිය' },
          { id: 'opt_3', text: 'David Berlo\'s SMCR Model', textSinhala: 'ඩේවිඩ් බර්ලෝගේ SMCR ආකෘතිය' },
          { id: 'opt_4', text: 'Wilbur Schramm\'s 1st Model', textSinhala: 'විල්බර් ශ්‍රාම්ගේ පළමු ආකෘතිය' },
          { id: 'opt_5', text: 'Newcomb\'s ABX Model', textSinhala: 'නිව්කොම්බ්ගේ ABX ආකෘතිය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Claude Shannon and Warren Weaver introduced the mathematical model of communication in 1949 at Bell Labs, which explicitly modeled Noise in the channel.',
        explanationSinhala: '1949 දී ක්ලෝඩ් ෂැනන් සහ වොරන් වීවර් විසින් ඉදිරිපත් කළ ගණිතමය ආකෘතිය මගින් නාලිකාව තුළ හටගන්නා ඝෝෂාව (Noise) ප්‍රථම වරට විද්‍යාත්මකව හඳුන්වාදෙන ලදී.',
        guruPothaRef: 'A/L Media Studies Syllabus • Unit 01 Communication Models',
        topic: 'Shannon & Weaver Model',
        difficulty: 'Medium'
      },
      {
        id: 'q_med_3',
        questionNumber: 3,
        questionText: 'According to Swiss linguist Ferdinand de Saussure, a Sign (සංකේතය) is a dyadic composite of:',
        questionTextSinhala: 'ස්විස් ජාතික වාග්විද්‍යාඥ ෆර්ඩිනන්ඩ් ඩි සසූර්ට අනුව සංකේතයක් (Sign) යනු කුමන අංග දෙකෙහි එකතුවක්ද?',
        options: [
          { id: 'opt_1', text: 'Signifier (සංකේතකය) + Signified (සංකේතිතය)', textSinhala: 'සංකේතකය (Signifier) + සංකේතිතය (Signified)' },
          { id: 'opt_2', text: 'Sender (ප්‍රේෂකයා) + Receiver (ග්‍රාහකයා)', textSinhala: 'ප්‍රේෂකයා + ග්‍රාහකයා' },
          { id: 'opt_3', text: 'Icon (ප්‍රතිමාව) + Index (දර්ශකය)', textSinhala: 'ප්‍රතිමාව + දර්ශකය' },
          { id: 'opt_4', text: 'Denotation (වාච්‍යාර්ථය) + Connotation (ව්‍යංගාර්ථය)', textSinhala: 'වාච්‍යාර්ථය + ව්‍යංගාර්ථය' },
          { id: 'opt_5', text: 'Code (කේතය) + Message (පණිවිඩය)', textSinhala: 'කේතය + පණිවිඩය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Saussure defined Sign = Signifier (material form, sound, visual image) + Signified (the mental concept represented).',
        explanationSinhala: 'සසූර්ට අනුව සංකේතයක් යනු සංකේතකය (භෞතික/ශ්‍රව්‍ය/දෘශ්‍ය ස්වරූපය) සහ සංකේතිතය (මනසේ හටගන්නා අදහස/සංකල්පය) යන අංග දෙකේ එකතුවකි.',
        guruPothaRef: 'A/L Media Studies Textbook • Semiotics & Visual Culture',
        topic: 'Semiotics (සංකේතවේදය)',
        difficulty: 'Medium'
      }
    ]
  },

  // 9. A/L Technology - Science for Technology (SFT)
  {
    id: 'quiz_tech_sft_01',
    title: 'Applied Thermodynamics & Environmental Technology',
    titleSinhala: 'ව්‍යවහාරික තාපගති විද්‍යාව සහ පාරිසරික තාක්ෂණවේදය',
    titleTamil: 'பிரயோக வெப்பவியலும் சூழல் தொழினுட்பமும்',
    subjectId: 'sub_sft',
    subjectName: 'Science for Technology (SFT)',
    subjectSinhala: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    grade: 12,
    category: 'al',
    stream: 'Technology Stream',
    streamId: 'stream_al_tech',
    unitNumber: 2,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 120,
    iconName: 'Flame',
    color: 'from-orange-600 to-red-700',
    description: 'Test heat transfer mechanisms, renewable biogas production, and sensor transducers.',
    descriptionSinhala: 'සන්නයනය, සංවහනය, විකිරණය සහ ජෛව වායු තාක්ෂණය පිළිබඳ SFT ප්‍රශ්නාවලිය.',
    questions: [
      {
        id: 'q_sft_1',
        questionNumber: 1,
        questionText: 'What is the primary combustible gas component produced inside an anaerobic biogas digester?',
        questionTextSinhala: 'නිර්වායු ජෛව වායු නිපදවන ඒකකයක (Biogas Digester) නිපදවෙන ප්‍රධාන දහනශීලී වායුව කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Methane (CH4) ~ 55-70%', textSinhala: 'මීතේන් (CH4) ~ 55-70%' },
          { id: 'opt_2', text: 'Carbon Dioxide (CO2)', textSinhala: 'කාබන් ඩයොක්සයිඩ් (CO2)' },
          { id: 'opt_3', text: 'Hydrogen Sulfide (H2S)', textSinhala: 'හයිඩ්‍රජන් සල්ෆයිඩ්' },
          { id: 'opt_4', text: 'Nitrogen gas (N2)', textSinhala: 'නයිට්‍රජන් වායුව' },
          { id: 'opt_5', text: 'Oxygen (O2)', textSinhala: 'ඔක්සිජන්' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Biogas consists predominantly of methane (55-70%) and carbon dioxide (30-45%), with methane being the key flammable fuel.',
        explanationSinhala: 'ජෛව වායුවේ 55-70% පමණ අඩංගු වන්නේ දහනය වන මීතේන් (CH4) වායුවයි.',
        guruPothaRef: 'A/L SFT Resource Book • Unit 05 Energy & Environment',
        topic: 'Biogas Technology',
        difficulty: 'Easy'
      }
    ]
  },

  // 10. G.C.E. O/L Science - Electricity & Energy
  {
    id: 'quiz_ol_science_01',
    title: 'Electricity, Circuits & Magnetism (O/L)',
    titleSinhala: 'ධාරා විද්‍යුතය, පරිපථ සහ චුම්භකත්වය (සා.පෙළ)',
    titleTamil: 'மின்னியல் மற்றும் காந்தவியல் (O/L)',
    subjectId: 'sub_ol_science',
    subjectName: 'Science',
    subjectSinhala: 'විද්‍යාව',
    grade: 11,
    category: 'ol',
    stream: 'Core O/L National Subjects',
    streamId: 'stream_ol_core',
    unitNumber: 3,
    timeLimitMinutes: 12,
    totalMarks: 100,
    xpReward: 100,
    iconName: 'Flame',
    color: 'from-cyan-600 to-blue-800',
    description: 'Test your understanding of Ohm\'s law, series/parallel circuits, and domestic electricity.',
    descriptionSinhala: 'ඕම්ගේ නියමය, සමාන්තරගත හා ශ්‍රේණිගත ප්‍රතිරෝධ සහ විද්‍යුත් බලය පිළිබඳ ගැටලු.',
    questions: [
      {
        id: 'q_ol_sci_1',
        questionNumber: 1,
        questionText: 'Two resistors of 6 Ω and 3 Ω are connected in parallel to a 12V DC power source. What is the total current flowing from the source?',
        questionTextSinhala: '6 Ω සහ 3 Ω ප්‍රතිරෝධක දෙකක් සමාන්තරගතව 12V බැටරියකට සම්බන්ධ කර ඇත. පරිපථයේ මුළු ධාරාව කොපමණද?',
        options: [
          { id: 'opt_1', text: '6 A', textSinhala: '6 A' },
          { id: 'opt_2', text: '4 A', textSinhala: '4 A' },
          { id: 'opt_3', text: '2 A', textSinhala: '2 A' },
          { id: 'opt_4', text: '9 A', textSinhala: '9 A' },
          { id: 'opt_5', text: '1.33 A', textSinhala: '1.33 A' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Equivalent resistance R_eq = (6*3)/(6+3) = 18/9 = 2 Ω. Current I = V / R_eq = 12 / 2 = 6 A.',
        explanationSinhala: 'සමාන්තර ප්‍රතිරෝධය R_eq = (6*3)/(6+3) = 18/9 = 2 Ω වේ. මුළු ධාරාව I = V/R = 12/2 = 6 A වේ.',
        guruPothaRef: 'Grade 11 Science Textbook • Unit 07 Current Electricity',
        topic: 'Parallel Resistance & Ohm Law',
        difficulty: 'Easy'
      },
      {
        id: 'q_ol_sci_2',
        questionNumber: 2,
        questionText: 'Which electrical safety device protects appliances from overloading by melting when excessive current passes through?',
        questionTextSinhala: 'අධික ධාරාවක් ගලා යන විට උණු වී පරිපථය විසන්ධි කර උපකරණ ආරක්ෂා කරන උපාංගය කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Fuse (ෆියුස් කම්බිය)', textSinhala: 'ෆියුස් කම්බිය (Fuse wire)' },
          { id: 'opt_2', text: 'Switch (ස්විචය)', textSinhala: 'ස්විචය' },
          { id: 'opt_3', text: 'Capacitor (ධාරිත්‍රකය)', textSinhala: 'ධාරිත්‍රකය' },
          { id: 'opt_4', text: 'Voltmeter (වෝල්ට්මීටරය)', textSinhala: 'වෝල්ට්මීටරය' },
          { id: 'opt_5', text: 'Transformer (පරිණාමකය)', textSinhala: 'පරිණාමකය' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'A fuse wire has a low melting point (lead-tin alloy) and melts safely to break an overloaded circuit.',
        explanationSinhala: 'ෆියුස් කම්බිය (තූර්ය මිශ්‍ර ලෝහය) අඩු ද්‍රවාංකයක් සහිත බැවින් අධික ධාරාවකදී උණු වී පරිපථය ආරක්ෂා කරයි.',
        guruPothaRef: 'Grade 11 Science Textbook • Unit 08 Domestic Electricity',
        topic: 'Electrical Safety',
        difficulty: 'Easy'
      }
    ]
  },

  // 11. G.C.E. O/L Mathematics
  {
    id: 'quiz_ol_maths_01',
    title: 'Quadratic Equations, Pythagoras & Trigonometry (O/L)',
    titleSinhala: 'වර්ගජ සමීකරණ, පයිතගරස් ප්‍රමේයය සහ ත්‍රිකෝණමිතිය',
    titleTamil: 'இருபடிச் சமன்பாடுகள் மற்றும் திரிகோணமிதி (O/L)',
    subjectId: 'sub_ol_maths',
    subjectName: 'Mathematics',
    subjectSinhala: 'ගණිතය',
    grade: 11,
    category: 'ol',
    stream: 'Core O/L National Subjects',
    streamId: 'stream_ol_core',
    unitNumber: 2,
    timeLimitMinutes: 12,
    totalMarks: 100,
    xpReward: 100,
    iconName: 'Percent',
    color: 'from-indigo-600 to-purple-800',
    description: 'Solve factorizations, sin/cos/tan ratio word problems, and theorem verifications.',
    descriptionSinhala: 'සාධක සෙවීම, සයින් කොසයින් අනුපාත සහ කෝණ පිළිබඳ විභාග මට්ටමේ බහුවරණ.',
    questions: [
      {
        id: 'q_ol_m_1',
        questionNumber: 1,
        questionText: 'What are the roots of the quadratic equation x² - 5x + 6 = 0 ?',
        questionTextSinhala: 'x² - 5x + 6 = 0 වර්ගජ සමීකරණයේ විසඳුම් (මූල) මොනවාද?',
        options: [
          { id: 'opt_1', text: 'x = 2 and x = 3', textSinhala: 'x = 2 සහ x = 3' },
          { id: 'opt_2', text: 'x = -2 and x = -3', textSinhala: 'x = -2 සහ x = -3' },
          { id: 'opt_3', text: 'x = 1 and x = 6', textSinhala: 'x = 1 සහ x = 6' },
          { id: 'opt_4', text: 'x = -1 and x = -6', textSinhala: 'x = -1 සහ x = -6' },
          { id: 'opt_5', text: 'x = 0 and x = 5', textSinhala: 'x = 0 සහ x = 5' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Factoring: (x - 2)(x - 3) = 0 => x = 2 or x = 3.',
        explanationSinhala: 'සාධක වෙන් කිරීමෙන්: (x - 2)(x - 3) = 0 බැවින් x = 2 හෝ x = 3 වේ.',
        guruPothaRef: 'Grade 11 Mathematics Textbook • Unit 04 Quadratic Equations',
        topic: 'Factorization',
        difficulty: 'Easy'
      },
      {
        id: 'q_ol_m_2',
        questionNumber: 2,
        questionText: 'In a right-angled triangle, if opposite side = 3 cm and adjacent side = 4 cm, what is the value of sin θ?',
        questionTextSinhala: 'සෘජුකෝණී ත්‍රිකෝණයක සම්මුඛ පාදය 3 cm සහ බද්ධ පාදය 4 cm නම්, sin θ හි අගය කොපමණද?',
        options: [
          { id: 'opt_1', text: '3/5', textSinhala: '3/5' },
          { id: 'opt_2', text: '4/5', textSinhala: '4/5' },
          { id: 'opt_3', text: '3/4', textSinhala: '3/4' },
          { id: 'opt_4', text: '4/3', textSinhala: '4/3' },
          { id: 'opt_5', text: '5/3', textSinhala: '5/3' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'By Pythagoras: Hypotenuse = √(3² + 4²) = 5 cm. sin θ = Opposite / Hypotenuse = 3/5.',
        explanationSinhala: 'පයිතගරස් ප්‍රමේයයෙන් කර්ණය = √(3² + 4²) = 5 cm වේ. sin θ = සම්මුඛ පාදය / කර්ණය = 3/5 වේ.',
        guruPothaRef: 'Grade 11 Mathematics Textbook • Unit 12 Trigonometry',
        topic: 'Trigonometric Ratios',
        difficulty: 'Easy'
      }
    ]
  },

  // 12. Junior Secondary - Science (6-9 ශ්‍රේණි)
  {
    id: 'quiz_jun_sci_01',
    title: 'States of Matter, Heat & Human Body Systems (Grade 8)',
    titleSinhala: 'පදාර්ථයේ අවස්ථා, තාපය සහ මිනිස් සිරුරේ පද්ධති',
    titleTamil: 'பதார்த்த நிலைகள் மற்றும் மனித உடல்',
    subjectId: 'sub_junior_science',
    subjectName: 'Junior General Science',
    subjectSinhala: 'කණිෂ්ඨ විද්‍යාව',
    grade: 8,
    category: 'junior',
    stream: 'Middle School Foundation (Grades 6-9)',
    streamId: 'stream_junior_foundation',
    unitNumber: 2,
    timeLimitMinutes: 10,
    totalMarks: 100,
    xpReward: 80,
    iconName: 'Sparkles',
    color: 'from-emerald-600 to-teal-800',
    description: 'Fun, illustrated conceptual quiz on solid/liquid/gas states and digestion.',
    descriptionSinhala: 'ඝන, ද්‍රව, වායු අංශු ආකෘතිය සහ ජීවී ක්‍රියාකාරකම් පිළිබඳ බහුවරණ.',
    questions: [
      {
        id: 'q_jun_s_1',
        questionNumber: 1,
        questionText: 'Which state of matter has a fixed volume but takes the shape of the container it is poured into?',
        questionTextSinhala: 'නියත පරිමාවක් ඇති නමුත් බහාලන බඳුනේ හැඩය ගන්නා පදාර්ථයේ අවස්ථාව කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'Liquid (ද්‍රව)', textSinhala: 'ද්‍රව (Liquid)' },
          { id: 'opt_2', text: 'Solid (ඝන)', textSinhala: 'ඝන (Solid)' },
          { id: 'opt_3', text: 'Gas (වායු)', textSinhala: 'වායු (Gas)' },
          { id: 'opt_4', text: 'Plasma (ප්ලාස්මා)', textSinhala: 'ප්ලාස්මා' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'Liquids have a definite volume because intermolecular bonds keep particles together, but they flow to match container shapes.',
        explanationSinhala: 'ද්‍රව වලට නියත පරිමාවක් පවතින අතර බහාලන භාජනයේ හැඩය ගනී.',
        guruPothaRef: 'Grade 8 Science Textbook • Unit 03 Matter',
        topic: 'States of Matter',
        difficulty: 'Easy'
      }
    ]
  },

  // 13. University Undergrad - Computer Science DSA
  {
    id: 'quiz_uni_dsa_01',
    title: 'Data Structures: Hash Tables, Trees & Big-O',
    titleSinhala: 'දත්ත ව්‍යුහ: Hash Tables, Binary Search Trees & Big-O කාල සංකීර්ණතාව',
    titleTamil: 'தரவு கட்டமைப்புகள் மற்றும் அல்காரிதம்கள் (Undergraduate)',
    subjectId: 'sub_uni_dsa',
    subjectName: 'Data Structures & Algorithms',
    subjectSinhala: 'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම (DSA)',
    grade: 'Undergrad',
    category: 'uni',
    stream: 'Computing & Software Engineering',
    streamId: 'stream_uni_computing',
    unitNumber: 3,
    timeLimitMinutes: 15,
    totalMarks: 100,
    xpReward: 150,
    iconName: 'Code',
    color: 'from-blue-600 to-indigo-900',
    description: 'Assess asymptotic analysis, search tree heights, collision resolution in hashing, and recursion.',
    descriptionSinhala: 'Hash collisions, Binary Search Tree (BST) සෙවීම් සහ Time Complexity බහුවරණ.',
    questions: [
      {
        id: 'q_uni_1',
        questionNumber: 1,
        questionText: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (e.g. AVL Tree) with n nodes?',
        questionTextSinhala: 'n සංඛ්‍යාවක් නෝඩ් (nodes) ඇති තුලිත ද්වීමය සෙවුම් ගසක (Balanced BST / AVL Tree) අගයක් සෙවීමේ සාමාන්‍ය කාල සංකීර්ණතාව (Time Complexity) කුමක්ද?',
        options: [
          { id: 'opt_1', text: 'O(log n)', textSinhala: 'O(log n)' },
          { id: 'opt_2', text: 'O(n)', textSinhala: 'O(n)' },
          { id: 'opt_3', text: 'O(1)', textSinhala: 'O(1)' },
          { id: 'opt_4', text: 'O(n log n)', textSinhala: 'O(n log n)' },
          { id: 'opt_5', text: 'O(n²)', textSinhala: 'O(n²)' },
        ],
        correctOptionId: 'opt_1',
        explanation: 'In a balanced binary search tree, the tree height is bounded by log2(n), making both search and insert operations run in O(log n) time.',
        explanationSinhala: 'තුලිත ද්වීමය සෙවුම් ගසක උස log2(n) වන බැවින් සෙවීමේ සංකීර්ණතාව O(log n) වේ.',
        guruPothaRef: 'University Computing Curriculum • CS101 Data Structures',
        topic: 'Binary Search Trees & Big-O',
        difficulty: 'Medium'
      }
    ]
  }
];
