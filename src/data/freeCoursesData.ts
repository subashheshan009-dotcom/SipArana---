export interface FreeCourse {
  id: string;
  title: string;
  titleSinhala: string;
  titleTamil?: string;
  provider: string;
  platform: string;
  category: 'it_programming' | 'design_creative' | 'languages' | 'science_math' | 'business_career' | 'local_sri_lanka';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  description: string;
  descriptionSinhala: string;
  descriptionTamil?: string;
  whatYouWillLearn: string[];
  whatYouWillLearnSinhala: string[];
  courseUrl: string;
  badge?: string;
  freeCertificate: boolean;
  language: string;
  rating: number;
  studentsCount: string;
  featured?: boolean;
}

export interface CourseCategory {
  id: string;
  label: string;
  labelSinhala: string;
  labelTamil: string;
  iconName: string;
  description: string;
  descriptionSinhala: string;
}

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: 'all',
    label: 'All Courses',
    labelSinhala: 'සියලුම පාඨමාලා',
    labelTamil: 'அனைத்துப் படிப்புகளும்',
    iconName: 'Sparkles',
    description: 'Explore the full directory of trusted free online learning materials.',
    descriptionSinhala: 'ලොව පිළිගත් විශ්වවිද්‍යාල සහ ආයතනවලින් පිරිනමන සියලුම නොමිලේ පාඨමාලා.'
  },
  {
    id: 'it_programming',
    label: 'IT & Programming',
    labelSinhala: 'තොරතුරු තාක්ෂණය & Coding',
    labelTamil: 'தகவல் தொழில்நுட்பம் & கோடிங்',
    iconName: 'Code2',
    description: 'Computer science, Python, Web development, Machine Learning & AI.',
    descriptionSinhala: 'Python, Web Development, Cloud Computing, AI සහ මෘදුකාංග ඉංජිනේරු විද්‍යාව.'
  },
  {
    id: 'design_creative',
    label: 'Graphic Design & UI/UX',
    labelSinhala: 'ග්‍රැෆික් ඩිසයින් & නිර්මාණකරණය',
    labelTamil: 'வரைகலை வடிவமைப்பு & UI/UX',
    iconName: 'Palette',
    description: 'Graphic design fundamentals, Figma UI/UX, video editing, and digital art.',
    descriptionSinhala: 'Canva, Photoshop, Figma UI/UX නිර්මාණකරණය සහ ඩිජිටල් නිර්මාණ.'
  },
  {
    id: 'languages',
    label: 'Languages & English',
    labelSinhala: 'භාෂා & ඉංග්‍රීසි ප්‍රවීණතාව',
    labelTamil: 'மொழிகள் & ஆங்கிலம்',
    iconName: 'Languages',
    description: 'Spoken English, IELTS preparation, Japanese, Korean, and French for Sri Lankan youth.',
    descriptionSinhala: 'Spoken English, Grammar, IELTS මගපෙන්වීම් සහ ජාත්‍යන්තර භාෂා.'
  },
  {
    id: 'science_math',
    label: 'Science & Mathematics',
    labelSinhala: 'විද්‍යාව & ගණිතය',
    labelTamil: 'அறிவியல் & கணிதம்',
    iconName: 'Atom',
    description: 'Physics, Chemistry, Calculus, Data Science, and STEM foundations.',
    descriptionSinhala: 'උසස් ගණිතය, භෞතික විද්‍යාව, රසායනය සහ දත්ත විද්‍යාව (Data Science).'
  },
  {
    id: 'business_career',
    label: 'Business & Digital Marketing',
    labelSinhala: 'ව්‍යාපාර & ඩිජිටල් මාර්කටින්',
    labelTamil: 'வணிகம் & டிஜிட்டல் சந்தைப்படுத்தல்',
    iconName: 'Briefcase',
    description: 'Digital marketing, SEO, entrepreneurship, finance, and career readiness.',
    descriptionSinhala: 'Google Digital Marketing, ඊ-වාණිජ්‍යය, මූල්‍ය කළමනාකරණය සහ Freelancing.'
  },
  {
    id: 'local_sri_lanka',
    label: 'Sri Lankan University MOOCs',
    labelSinhala: 'ශ්‍රී ලංකා සරසවි නොමිලේ පාඨමාලා',
    labelTamil: 'இலங்கை பல்கலைக்கழக படிப்புகள்',
    iconName: 'GraduationCap',
    description: 'Free online courses provided by Open University (OUSL), MoraX, and ICTA.',
    descriptionSinhala: 'මොරටුව සරසවිය (MoraX), විවෘත විශ්වවිද්‍යාලය (OUSL) සහ ICTA නොමිලේ පාඨමාලා.'
  }
];

export const FREE_COURSES: FreeCourse[] = [
  {
    id: 'cs50-harvard',
    title: "CS50's Introduction to Computer Science",
    titleSinhala: 'CS50 පරිගණක විද්‍යා හැඳින්වීම (Harvard University)',
    titleTamil: 'CS50 கணினி அறிவியல் அறிமுகம் (Harvard University)',
    provider: 'Harvard University',
    platform: 'edX / Harvard Online',
    category: 'it_programming',
    level: 'Beginner',
    duration: '12 Weeks (6-18 hrs/week)',
    description: "Harvard University's legendary introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, HTML, CSS, JavaScript, and algorithmic thinking.",
    descriptionSinhala: 'ලොව අංක 1 පරිගණක විද්‍යා ආරම්භක පාඨමාලාව! C, Python, SQL, Web සංවර්ධනය සහ ඇල්ගොරිතම මුල සිට සරලව උගන්වයි. ලොව පුරා මිලියන ගණනක් හදාරන නොමිලේ පාඨමාලාවකි.',
    whatYouWillLearn: [
      'Algorithmic thinking and efficient problem solving',
      'Fundamental concepts like abstraction, algorithms, data structures',
      'Programming in C, Python, SQL, HTML, CSS, and JavaScript',
      'How to build a complete full-stack capstone project'
    ],
    whatYouWillLearnSinhala: [
      'ගැටලු විසඳීමේ ඇල්ගොරිතම චින්තනය (Algorithmic Thinking)',
      'C, Python, SQL, HTML, CSS සහ JavaScript ක්‍රමලේඛනය',
      'දත්ත ව්‍යුහ (Data Structures) සහ ආරක්ෂිත කේතකරණය',
      'ස්වයං නිර්මාණශීලී වෙබ් හෝ මෘදුකාංග ව්‍යාපෘතියක් ගොඩනැගීම'
    ],
    courseUrl: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
    badge: 'World #1 CS Course',
    freeCertificate: false,
    language: 'English (Sinhala/Tamil subtitles on YouTube)',
    rating: 4.9,
    studentsCount: '4.8M+ Learners',
    featured: true
  },
  {
    id: 'freecodecamp-fullstack',
    title: 'freeCodeCamp Responsive Web Design & JavaScript',
    titleSinhala: 'freeCodeCamp සම්පූර්ණ වෙබ් නිර්මාණ & JavaScript සහතිකය',
    titleTamil: 'freeCodeCamp முழுமையான வலை வடிவமைப்பு & JavaScript',
    provider: 'freeCodeCamp.org',
    platform: 'freeCodeCamp (Interactive Web Platform)',
    category: 'it_programming',
    level: 'Beginner',
    duration: 'Self-Paced (approx. 300 Hours)',
    description: 'Learn modern HTML5, CSS3, Flexbox, CSS Grid, Responsive Design, and modern JavaScript with 100% interactive coding exercises in your browser and verified free certifications.',
    descriptionSinhala: 'කිසිදු මුදලක් අය නොකරන, Browser එක තුළදීම ප්‍රායෝගිකව Code ලියමින් ඉගෙනගත හැකි ලොව විශාලතම Web Development පාඨමාලාව. ව්‍යාපෘති 5ක් සම්පූර්ණ කළ පසු නොමිලේ සහතිකයක් පිරිනැමේ.',
    whatYouWillLearn: [
      'HTML5 semantic structure & modern CSS3 animations',
      'Responsive Web Design with Flexbox & CSS Grid',
      'JavaScript ES6+, DOM manipulation & algorithms',
      '5 Real-world portfolio projects for your developer CV'
    ],
    whatYouWillLearnSinhala: [
      'HTML5, නවීන CSS3, Flexbox සහ CSS Grid තාක්ෂණය',
      'ජංගම දුරකථන සහ පරිගණක සඳහා Responsive වෙබ් අඩවි සැකසීම',
      'JavaScript ES6+, DOM Manipulation සහ ඇල්ගොරිතම',
      'ඔබේ CV එකට එක්කළ හැකි සජීවී වෙබ් ව්‍යාපෘති 5ක්'
    ],
    courseUrl: 'https://www.freecodecamp.org/learn/responsive-web-design/',
    badge: '100% Free Verified Certificate',
    freeCertificate: true,
    language: 'English',
    rating: 4.9,
    studentsCount: '10M+ Worldwide',
    featured: true
  },
  {
    id: 'python-for-everybody-michigan',
    title: 'Python for Everybody Specialization',
    titleSinhala: 'සැමට Python ක්‍රමලේඛනය (University of Michigan)',
    titleTamil: 'அனைவருக்கும் Python நிரலாக்கம்',
    provider: 'University of Michigan (Dr. Charles Severance)',
    platform: 'Coursera (Free Audit) / py4e.com',
    category: 'it_programming',
    level: 'Beginner',
    duration: '8 Weeks (3-5 hrs/week)',
    description: 'Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data using Python data structures, networked application interfaces, and databases.',
    descriptionSinhala: 'ක්‍රමලේඛන පසුබිමක් නොමැති ඕනෑම අයෙකුට Python භාෂාවෙන් දත්ත විශ්ලේෂණය, වෙබ් Scraping, SQLite Databases සහ API හැසිරවීම ඉතාම සුහදශීලීව උගන්වයි.',
    whatYouWillLearn: [
      'Basics of Python programming syntax and core data structures',
      'Web scraping and connecting to REST APIs using Python',
      'Using SQLite databases with Python to store and process data',
      'Basic data visualization with Python'
    ],
    whatYouWillLearnSinhala: [
      'Python මූලික වාක්‍ය ඛණ්ඩ සහ දත්ත වර්ග (Lists, Dictionaries, Tuples)',
      'වෙබ් අඩවිවලින් දත්ත ලබාගැනීම (Web Scraping & APIs)',
      'SQLite දත්ත සමුදාය සමඟ Python සම්බන්ධ කිරීම',
      'දත්ත ප්‍රස්ථාර සහ වාර්තා නිර්මාණය කිරීම'
    ],
    courseUrl: 'https://www.py4e.com/',
    badge: 'Best Beginner Python',
    freeCertificate: false,
    language: 'English (Multi-language subtitles)',
    rating: 4.8,
    studentsCount: '3.2M+ Learners',
    featured: true
  },
  {
    id: 'morax-open-courses',
    title: 'MoraX - University of Moratuwa Free Open Courses',
    titleSinhala: 'මොරටුව විශ්වවිද්‍යාලයීය MoraX නොමිලේ ඔන්ලයින් පාඨමාලා',
    titleTamil: 'மொரட்டுவ பல்கலைக்கழக MoraX இலவச படிப்புகள்',
    provider: 'University of Moratuwa, Sri Lanka',
    platform: 'MoraX / Open edX UoM',
    category: 'local_sri_lanka',
    level: 'All Levels',
    duration: '4-8 Weeks per module',
    description: 'Free open online courses provided by the prestigious University of Moratuwa covering Python for Beginners, Web Development, Microcontroller Programming (Arduino), and Business English.',
    descriptionSinhala: 'ශ්‍රී ලංකාවේ ප්‍රමුඛතම තාක්ෂණ සරසවිය වන මොරටුව විශ්වවිද්‍යාලයේ ආචාර්ය මණ්ඩලය විසින් සිංහල සහ ඉංග්‍රීසි මාධ්‍යයෙන් මෙහෙයවන නොමිලේ විවෘත පාඨමාලා (Python, Web, Arduino & English).',
    whatYouWillLearn: [
      'Python and Software Development from Sri Lankan lecturers',
      'Web development fundamentals and database management',
      'Arduino and embedded electronic circuits',
      'Business Communication and Academic English'
    ],
    whatYouWillLearnSinhala: [
      'ශ්‍රී ලංකා ප්‍රමිතීන්ට අනුකූලව Python සහ මෘදුකාංග නිර්මාණය',
      'Web Development සහ දත්ත කළමනාකරණය',
      'Arduino සහ ක්ෂුද්‍ර පාලක පරිපථ ක්‍රමලේඛනය',
      'වෘත්තීය ඉංග්‍රීසි සන්නිවේදන කුසලතා'
    ],
    courseUrl: 'https://morax.uom.lk/',
    badge: 'National Sri Lankan Uni',
    freeCertificate: true,
    language: 'Sinhala & English',
    rating: 4.8,
    studentsCount: '150K+ Sri Lankan Students',
    featured: true
  },
  {
    id: 'ousl-moocs',
    title: 'Open University of Sri Lanka (OUSL) Free Open Courses',
    titleSinhala: 'ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලයීය විවෘත පාඨමාලා (OUSL MOOCs)',
    titleTamil: 'இலங்கை திறந்த பல்கலைக்கழக இலவச படிப்புகள்',
    provider: 'The Open University of Sri Lanka (OUSL)',
    platform: 'OUSL Open Educational Portal',
    category: 'local_sri_lanka',
    level: 'All Levels',
    duration: 'Self-Paced (2-6 Weeks)',
    description: 'Open access courses offered by the Open University of Sri Lanka covering General English, ICT Skills, Entrepreneurship, Mathematics refresher, and Distance Learning mastery.',
    descriptionSinhala: 'ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය (OUSL) මගින් පාසල් සිසුන් සහ තරුණ ප්‍රජාව වෙනුවෙන් පිරිනමන නොමිලේ පාඨමාලා (General English, Basic ICT, Entrepreneurship & Maths).',
    whatYouWillLearn: [
      'Essential ICT literacy and digital productivity tools',
      'English for everyday work and examination readiness',
      'Starting small enterprises in Sri Lanka',
      'Self-directed distance learning techniques'
    ],
    whatYouWillLearnSinhala: [
      'අත්‍යවශ්‍ය තොරතුරු තාක්ෂණ හා ඩිජිටල් මෙවලම් භාවිතය',
      'දෛනික භාවිතය සහ විභාග සඳහා සාමාන්‍ය ඉංග්‍රීසි ප්‍රවීණතාව',
      'ශ්‍රී ලංකාව තුළ නව ව්‍යාපාර ඇරඹීම (Entrepreneurship)',
      'විවෘත හා දුරස්ථ අධ්‍යාපනය ඵලදායීව සිදුකිරීමේ උපක්‍රම'
    ],
    courseUrl: 'https://ou.ac.lk/',
    badge: 'Sri Lanka Higher Ed',
    freeCertificate: true,
    language: 'Sinhala, Tamil & English',
    rating: 4.7,
    studentsCount: '80K+ Students',
    featured: false
  },
  {
    id: 'google-digital-garage',
    title: 'Fundamentals of Digital Marketing by Google',
    titleSinhala: 'Google ඩිජිටල් අලෙවිකරණ මූලධර්ම (නොමිලේ Google සහතිකය සහිතයි)',
    titleTamil: 'கூகிளின் டிஜிட்டல் மார்க்கெட்டிங் அடிப்படைகள்',
    provider: 'Google Digital Garage / Skillshop',
    platform: 'Google for Education / Skillshop',
    category: 'business_career',
    level: 'Beginner',
    duration: '40 Hours (26 Modules)',
    description: 'Master the basics of digital marketing with Google’s free accredited course. Includes 26 modules packed with practical exercises and real-world examples to help you turn knowledge into action.',
    descriptionSinhala: 'Google ආයතනය විසින්ම නොමිලේ පිරිනමන, ලොව පුරා පිළිගත් Digital Marketing සහතිකපත්‍ර පාඨමාලාව! SEO, Social Media Marketing, Search Ads, Email Marketing සහ Analytics ආවරණය කරයි.',
    whatYouWillLearn: [
      'Search Engine Optimization (SEO) & Search Engine Marketing (SEM)',
      'Social media marketing and online brand awareness',
      'Google Analytics and web data interpretation',
      'E-commerce marketing and mobile marketing strategy'
    ],
    whatYouWillLearnSinhala: [
      'Search Engine Optimization (SEO) මූලික ක්‍රම',
      'Social Media හරහා ව්‍යාපාර සහ සේවාවන් ප්‍රවර්ධනය',
      'Google Analytics භාවිතයෙන් වෙබ් දත්ත විශ්ලේෂණය',
      'ඊ-වාණිජ්‍යය (E-Commerce) සහ ඩිජිටල් වෙළඳ දැන්වීම්'
    ],
    courseUrl: 'https://skillshop.exceedlms.com/student/collection/654330-digital-marketing',
    badge: 'Official Google Certificate',
    freeCertificate: true,
    language: 'English (Multi-language subtitles)',
    rating: 4.9,
    studentsCount: '3M+ Certified',
    featured: true
  },
  {
    id: 'canva-design-school',
    title: 'Canva Design School - Graphic Design Essentials',
    titleSinhala: 'Canva Design School - ග්‍රැෆික් නිර්මාණකරණ මූලධර්ම',
    titleTamil: 'கேன்வா வரைகலை வடிவமைப்பு அடிப்படைகள்',
    provider: 'Canva',
    platform: 'Canva Design School',
    category: 'design_creative',
    level: 'Beginner',
    duration: 'Self-Paced (approx. 5-10 Hours)',
    description: 'Learn the principles of great design, typography, color theory, social media branding, presentations, and digital posters from Canva’s professional design team.',
    descriptionSinhala: 'Canva මෘදුකාංගය භාවිතයෙන් ආකර්ෂණීය Social Media Posts, Presentations, Flyers, සහ Branding නිර්මාණය කිරීමට අවශ්‍ය වර්ණ සංකලනය, Typography සහ Design මූලධර්ම නොමිලේ උගන්වයි.',
    whatYouWillLearn: [
      'Color theory, font pairing, and visual hierarchy',
      'Creating eye-catching social media posts & thumbnails',
      'Designing professional CVs, brochures, and slide presentations',
      'Branding essentials for businesses and freelance portfolios'
    ],
    whatYouWillLearnSinhala: [
      'වර්ණ න්‍යාය (Color Theory) සහ අකුරු සැකසුම (Typography)',
      'Social Media පෝස්ටර් සහ YouTube Thumbnails නිර්මාණය',
      'වෘත්තීය CV, අත්පත්‍රිකා සහ Presentation Slides සැකසීම',
      'Freelance නිර්මාණකරුවෙකු ලෙස වැඩ ආරම්භ කිරීම'
    ],
    courseUrl: 'https://www.canva.com/designschool/',
    badge: 'Visual & UI Skills',
    freeCertificate: false,
    language: 'English',
    rating: 4.8,
    studentsCount: '1.5M+ Designers',
    featured: false
  },
  {
    id: 'figma-uiux-crash-course',
    title: 'Figma for Beginners & UI/UX Design Essentials',
    titleSinhala: 'Figma මගින් UI/UX වෙබ් සහ Mobile App සැලසුම්කරණය',
    titleTamil: 'பிக்மா UI/UX வடிவமைப்பு அடிப்படைகள்',
    provider: 'Figma Community & FreeCodeCamp',
    platform: 'YouTube / Figma Official Learn',
    category: 'design_creative',
    level: 'Beginner',
    duration: 'Self-Paced (8-15 Hours)',
    description: 'Learn modern UI/UX design from scratch using Figma. Understand user wireframing, component design systems, interactive prototyping, and handoff to software developers.',
    descriptionSinhala: 'ලොව ඉහළම ඉල්ලුමක් ඇති UI/UX වෘත්තියට පිවිසීමට Figma භාවිතයෙන් Web & Mobile App Interface සැලසුම් කිරීම, Prototyping සහ Design Systems නිර්මාණය කිරීම මුල සිට සරලව.',
    whatYouWillLearn: [
      'UI/UX design fundamentals and user research methods',
      'Figma auto-layout, components, variants, and design tokens',
      'Creating clickable interactive prototypes for user testing',
      'Preparing Figma files for developer handoff'
    ],
    whatYouWillLearnSinhala: [
      'UI/UX මූලධර්ම සහ Wireframe ඇඳීම',
      'Figma Auto-layout, Components සහ Design Systems',
      'ජංගම දුරකථන Apps සඳහා Prototyping නිර්මාණය',
      'Frontend Developers ලාට කේත කිරීමට Design එක සූදානම් කිරීම'
    ],
    courseUrl: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-design',
    badge: 'High-Demand Career',
    freeCertificate: false,
    language: 'English',
    rating: 4.9,
    studentsCount: '800K+ Learners',
    featured: false
  },
  {
    id: 'khan-academy-math-science',
    title: 'Khan Academy - Advanced Calculus & Physics',
    titleSinhala: 'Khan Academy - උසස් ගණිතය, භෞතික විද්‍යාව සහ විද්‍යා සංකල්ප',
    titleTamil: 'கான் அகாடமி - கணிதம் & இயற்பியல்',
    provider: 'Khan Academy (Sal Khan)',
    platform: 'Khan Academy (100% Free Non-Profit)',
    category: 'science_math',
    level: 'All Levels',
    duration: 'Self-Paced (Unlimited Modules)',
    description: 'World-renowned free mastery-based learning in Calculus, Linear Algebra, Mechanics, Organic Chemistry, and Biology with thousands of interactive practice exercises and step-by-step videos.',
    descriptionSinhala: 'A/L සහ පළමු වසර සරසවි සිසුන්ට Calculus, ත්‍රිකෝණමිතිය, යාන්ත්‍ර විද්‍යාව, තාපය, රසායනික ප්‍රතික්‍රියා ඉතා පැහැදිලි සජීවිකරණ සහ අභ්‍යාස මගින් නොමිලේ ඉගෙනගත හැකි ලොව විශිෂ්ටතම අඩවිය.',
    whatYouWillLearn: [
      'Differential & Integral Calculus with intuitive visualizations',
      'Classical mechanics, thermodynamics, and electromagnetism',
      'Organic chemistry mechanisms and biological biochemistry',
      'Step-by-step problem-solving drills with instant feedback'
    ],
    whatYouWillLearnSinhala: [
      'අවකලනය සහ අනුකලනය (Differential & Integral Calculus)',
      'සම්භාව්‍ය යාන්ත්‍ර විද්‍යාව, තාප ගති විද්‍යාව සහ විද්‍යුතය',
      'කාබනික රසායනය සහ ජෛව රසායනික ක්‍රියාවලි',
      'ක්ෂණික ලකුණු සමග ස්වයං ඇගයීම් අභ්‍යාස'
    ],
    courseUrl: 'https://www.khanacademy.org/',
    badge: '100% Free Non-Profit',
    freeCertificate: false,
    language: 'English (Sinhala/Tamil subtitles available)',
    rating: 4.9,
    studentsCount: '150M+ Worldwide',
    featured: true
  },
  {
    id: 'mit-opencourseware',
    title: 'MIT OpenCourseWare (OCW) - Computer Science & STEM',
    titleSinhala: 'MIT OpenCourseWare - ලොව අංක 1 තාක්ෂණික සරසවියේ දේශන',
    titleTamil: 'எம்.ஐ.டி திறந்தவெளிப் படிப்புகள்',
    provider: 'Massachusetts Institute of Technology (MIT)',
    platform: 'MIT OCW / YouTube MIT',
    category: 'science_math',
    level: 'Intermediate',
    duration: 'Full Semester Courses (Self-Paced)',
    description: 'Free access to complete MIT lecture videos, lecture notes, assignments, and exams covering Linear Algebra (Prof. Gilbert Strang), Introduction to Algorithms (6.006), and Quantum Physics.',
    descriptionSinhala: 'ලොව සුප්‍රකට MIT සරසවියේ සම්පූර්ණ දේශන වීඩියෝ, විභාග ප්‍රශ්න පත්‍ර සහ ආචාර්යවරුන්ගේ Notes නොමිලේම අධ්‍යයනය කිරීමේ අවස්ථාව (Gilbert Strang Linear Algebra, Algorithms ආදිය).',
    whatYouWillLearn: [
      'University-level Linear Algebra and Differential Equations',
      'Data structures and algorithm design (6.006 / 6.046)',
      'Introductory Classical & Quantum Mechanics',
      'Rigorous scientific reasoning and problem-solving'
    ],
    whatYouWillLearnSinhala: [
      'සරසවි මට්ටමේ න්‍යාස සහ රේඛීය වීජ ගණිතය (Linear Algebra)',
      'දත්ත ව්‍යුහ සහ ඇල්ගොරිතම සැලසුම්කරණය (Algorithms)',
      'භෞතික විද්‍යා පර්යේෂණාත්මක ක්‍රම සහ යාන්ත්‍ර විද්‍යාව',
      'MIT විභාග ප්‍රශ්න පත්‍ර සහ පිළිතුරු විවරණ'
    ],
    courseUrl: 'https://ocw.mit.edu/',
    badge: 'MIT Ivy League Content',
    freeCertificate: false,
    language: 'English',
    rating: 5.0,
    studentsCount: '10M+ Global Students',
    featured: false
  },
  {
    id: 'british-council-learnenglish',
    title: 'British Council LearnEnglish - Grammar & Spoken Skills',
    titleSinhala: 'British Council LearnEnglish - ඉංග්‍රීසි ව්‍යාකරණ & කථන කුසලතා',
    titleTamil: 'பிரிட்டிஷ் கவுன்சில் ஆங்கிலக் கற்றல்',
    provider: 'British Council',
    platform: 'British Council LearnEnglish Portal',
    category: 'languages',
    level: 'Beginner',
    duration: 'Self-Paced Modules',
    description: 'Free English learning materials, listening podcasts, grammar explanation guides, reading comprehension, and business writing drills designed by British Council English specialists.',
    descriptionSinhala: 'British Council ආයතනය විසින් නොමිලේ පිරිනමන ඉංග්‍රීසි ව්‍යාකරණ (Grammar), Listening Podcasts, වචන මාලා (Vocabulary) සහ විභාගවලට සූදානම් වීමේ පාඩම් මාලාව.',
    whatYouWillLearn: [
      'Clear grammar rules with interactive quizzes and examples',
      'Listening comprehension through themed audio podcasts',
      'Professional email writing and workplace communication',
      'Vocabulary expansion for academic essays and exams'
    ],
    whatYouWillLearnSinhala: [
      'නිවැරදි ඉංග්‍රීසි ව්‍යාකරණ රීති සහ අභ්‍යාස',
      'Listening Podcasts මගින් ශ්‍රව්‍ය අවබෝධය දියුණු කිරීම',
      'වෘත්තීය ලිපි සහ Email ලිවීමේ නිවැරදි ආකෘති',
      'විභාග සහ සාමාන්‍ය කතාබහ සඳහා වචන මාලාව දියුණු කිරීම'
    ],
    courseUrl: 'https://learnenglish.britishcouncil.org/',
    badge: 'Official British Council',
    freeCertificate: false,
    language: 'English',
    rating: 4.8,
    studentsCount: '5M+ Learners',
    featured: true
  },
  {
    id: 'duolingo-languages',
    title: 'Duolingo - Interactive Language Learning (100% Free)',
    titleSinhala: 'Duolingo - ක්‍රීඩාවක් ලෙස විනෝදයෙන් නව භාෂා ඉගෙනගන්න',
    titleTamil: 'டுயோலிங்கோ - இலவச மொழி கற்றல்',
    provider: 'Duolingo',
    platform: 'Duolingo Mobile & Web',
    category: 'languages',
    level: 'Beginner',
    duration: '10-15 mins daily (Self-Paced)',
    description: 'The world’s most popular free language learning platform. Learn Japanese, Korean, French, German, Spanish, and English through fun bite-sized lessons, streaks, and speech recognition.',
    descriptionSinhala: 'දිනකට විනාඩි 10ක් වැනි කෙටි කාලයක් තුළ Japanese, Korean, French, German, Chinese හෝ English භාෂා මුල සිට ක්‍රීඩාවක් ආකාරයෙන් විනෝදයෙන් ඉගෙනගත හැකි නොමිලේ ඇප් එක.',
    whatYouWillLearn: [
      'Conversational phrases for daily travel, study, and work',
      'Speech pronunciation drills using smart voice detection',
      'Gamified streak challenges to maintain daily learning habits',
      'Reading basic scripts (Hiragana, Katakana, Hangul, Latin)'
    ],
    whatYouWillLearnSinhala: [
      'දෛනික කතාබහට අවශ්‍ය මූලික වාක්‍ය සහ වචන',
      'කටහඬ හඳුනාගැනීමේ තාක්ෂණයෙන් නිවැරදි උච්චාරණය පුහුණු වීම',
      'Streak ක්‍රමය මගින් දිනපතා අඛණ්ඩව පුහුණු වීමේ උනන්දුව',
      'විදේශීය භාෂා අක්ෂර (ජපන්, කොරියානු, ප්‍රංශ) කියවීමට හුරුවීම'
    ],
    courseUrl: 'https://www.duolingo.com/',
    badge: 'Gamified App',
    freeCertificate: false,
    language: 'English Interface (40+ Target Languages)',
    rating: 4.8,
    studentsCount: '500M+ Users',
    featured: false
  },
  {
    id: 'kaggle-microcourses',
    title: 'Kaggle Micro-Courses - Python, Pandas & Machine Learning',
    titleSinhala: 'Kaggle නොමිලේ දත්ත විද්‍යා & Machine Learning ක්ෂුද්‍ර පාඨමාලා',
    titleTamil: 'கேகில் தரவு அறிவியல் & மெஷின் லேர்னிங்',
    provider: 'Kaggle (Google)',
    platform: 'Kaggle Learn',
    category: 'it_programming',
    level: 'Intermediate',
    duration: '3-5 Hours per micro-course',
    description: 'Fast-paced, hands-on micro-courses covering Python, Pandas, Data Visualization, Intro to Machine Learning, Feature Engineering, and Deep Learning in interactive Jupyter notebooks.',
    descriptionSinhala: 'Google ආයතනයට අයත් Kaggle හරහා පැය 4ක් වැනි කෙටි කාලයක් තුළ Python, Data Cleaning, Pandas, Data Visualisation සහ Machine Learning කේත ලියමින් ඉගෙනගන්න. නොමිලේ සහතිකයක්ද හිමිවේ.',
    whatYouWillLearn: [
      'Hands-on data analysis with Python Pandas and Seaborn',
      'Training Scikit-learn Machine Learning prediction models',
      'Computer Vision and Deep Learning with TensorFlow',
      'Free verified certificates for each completed track'
    ],
    whatYouWillLearnSinhala: [
      'Pandas මගින් ප්‍රායෝගික දත්ත විශ්ලේෂණය',
      'Scikit-learn හරහා Machine Learning මොඩල පුහුණු කිරීම',
      'දත්ත පිරිසිදු කිරීම (Data Cleaning & Feature Engineering)',
      'සෑම Track එකක් අවසානයේම නොමිලේ ඩිජිටල් සහතිකයක්'
    ],
    courseUrl: 'https://www.kaggle.com/learn',
    badge: 'Google Kaggle Certificates',
    freeCertificate: true,
    language: 'English',
    rating: 4.9,
    studentsCount: '1M+ Data Scientists',
    featured: false
  },
  {
    id: 'hubspot-inbound-marketing',
    title: 'HubSpot Academy - Inbound Marketing & Social Media',
    titleSinhala: 'HubSpot Academy - Inbound Marketing සහ සමාජ මාධ්‍ය උපායමාර්ග',
    titleTamil: 'ஹப்ஸ்பாட் அகாடமி - டிஜிட்டல் மார்க்கெட்டிங்',
    provider: 'HubSpot Academy',
    platform: 'HubSpot Academy Online',
    category: 'business_career',
    level: 'Beginner',
    duration: '4-6 Hours (Comprehensive Video & Quiz)',
    description: 'Learn how to attract visitors, convert leads, and close customers through inbound marketing strategies, content creation, social media growth, and email automation.',
    descriptionSinhala: 'ලොව ප්‍රකට HubSpot වෙතින් නොමිලේ පිරිනමන Inbound Marketing සහතිකපත්‍ර පාඨමාලාව. Content Creation, Social Media Marketing සහ Email Automation ආවරණය කරයි.',
    whatYouWillLearn: [
      'Inbound marketing methodology and customer persona design',
      'Content strategy, blogging, and viral distribution',
      'Social media campaigns that generate paying customers',
      'Official LinkedIn-sharable HubSpot Certification'
    ],
    whatYouWillLearnSinhala: [
      'Inbound Marketing මූලික ක්‍රමවේදය සහ පාරිභෝගික ආකර්ෂණය',
      'ආකර්ෂණීය අන්තර්ගත (Content Creation) සැලසුම් කිරීම',
      'Social Media හරහා අලෙවිය ඉහළ නැංවීම',
      'LinkedIn CV එකට එක්කළ හැකි HubSpot නොමිලේ සහතිකය'
    ],
    courseUrl: 'https://academy.hubspot.com/courses/inbound-marketing',
    badge: 'Free Industry Certificate',
    freeCertificate: true,
    language: 'English',
    rating: 4.8,
    studentsCount: '500K+ Marketers',
    featured: false
  }
];

export interface CourseProviderStatus {
  id: string;
  name: string;
  shortCode: string;
  portalUrl: string;
  status: 'ONLINE' | 'FETCHING' | 'SYNCED';
  pingMs: number;
}

export const COURSE_AUTHORITIES: CourseProviderStatus[] = [
  { id: 'moratuwa', name: 'Univ of Moratuwa (MoraX)', shortCode: 'MoraX', portalUrl: 'https://open.uom.lk', status: 'SYNCED', pingMs: 38 },
  { id: 'google', name: 'Google Career Certificates & Skills', shortCode: 'Google', portalUrl: 'https://grow.google', status: 'SYNCED', pingMs: 25 },
  { id: 'harvard', name: 'Harvard & edX Free Courses', shortCode: 'Harvard', portalUrl: 'https://pll.harvard.edu', status: 'SYNCED', pingMs: 62 },
  { id: 'ousl', name: 'Open University of Sri Lanka', shortCode: 'OUSL', portalUrl: 'https://ou.ac.lk', status: 'SYNCED', pingMs: 44 }
];

export const SIMULATED_NEW_COURSES: FreeCourse[] = [
  {
    id: 'morax-ai-generative-sl',
    title: 'Generative AI & Prompt Engineering for Sri Lankan Students',
    titleSinhala: 'ශ්‍රී ලාංකික සිසුන් සඳහා Generative AI සහ Prompt Engineering (නොමිලේ)',
    titleTamil: 'இலங்கை மாணவர்களுக்கான ஜெனரேட்டிவ் AI மற்றும் பிராம்ப்ட் இன்ஜினியரிங்',
    provider: 'University of Moratuwa & ICTA',
    platform: 'MoraX Online Portal',
    category: 'it_programming',
    level: 'Beginner',
    duration: '4 Weeks (Self-Paced • 12 Hours)',
    description: 'Master practical AI tools, Gemini, ChatGPT, and Python AI frameworks to supercharge your academic research, coding, and problem-solving skills with official University of Moratuwa certificate.',
    descriptionSinhala: 'මොරටුව විශ්වවිද්‍යාලය සහ ICTA එක්ව නොමිලේ පිරිනමන Generative AI මූලික පාඨමාලාව. AI තාක්ෂණය අධ්‍යාපනයට සහ කේතකරණයට යොදාගන්නා ආකාරය ඉගෙනගන්න.',
    whatYouWillLearn: [
      'Prompt Engineering strategies for complex academic problems',
      'Using Gemini and Python for data summarization and science',
      'AI ethics, plagiarism avoidance, and responsible usage',
      'Official verified digital certificate from University of Moratuwa'
    ],
    whatYouWillLearnSinhala: [
      'අධ්‍යාපනික ගැටලු විසඳීමට Prompt Engineering නිවැරදිව භාවිතය',
      'Python සහ AI මගින් දත්ත විශ්ලේෂණය සහ සාරාංශ සකස් කිරීම',
      'AI සදාචාරාත්මක භාවිතය සහ plagiarism වළක්වා ගැනීම',
      'මොරටුව සරසවියෙන් නිකුත් වන නොමිලේ ඩිජිටල් සහතිකය'
    ],
    courseUrl: 'https://open.uom.lk',
    badge: 'MoraX Free Certificate',
    freeCertificate: true,
    language: 'Sinhala & English',
    rating: 4.95,
    studentsCount: '18,500+ Enrolled',
    featured: true
  },
  {
    id: 'google-cybersecurity-foundations',
    title: 'Google Cybersecurity & Digital Safety Essentials',
    titleSinhala: 'Google සයිබර් ආරක්ෂණ සහ ඩිජිටල් ආරක්ෂාව පිළිබඳ පාඨමාලාව',
    titleTamil: 'கூகிள் சைபர் பாதுகாப்பு அடிப்படைகள்',
    provider: 'Google Career Certificates',
    platform: 'Grow with Google',
    category: 'it_programming',
    level: 'Beginner',
    duration: '3 Weeks (Self-Paced)',
    description: 'Learn fundamental network defense, malware detection, encryption, and personal data privacy from Google security analysts.',
    descriptionSinhala: 'Google ආයතනයේ ආරක්ෂක ඉංජිනේරුවන් විසින් මෙහෙයවන නොමිලේ Cybersecurity පාඨමාලාව. සයිබර් ප්‍රහාරවලින් ආරක්ෂා වීම සහ Network Security මූලධර්ම.',
    whatYouWillLearn: [
      'Threat detection and network vulnerability assessment',
      'Password security, two-factor authentication, and phishing defense',
      'Google recognized badge for your LinkedIn resume'
    ],
    whatYouWillLearnSinhala: [
      'සයිබර් තර්ජන හඳුනාගැනීම සහ Network Security',
      'Password සහ පුද්ගලික දත්ත ආරක්ෂා කරගැනීම',
      'Google වෙතින් පිරිනමන නොමිලේ ඩිජිටල් Badge එක'
    ],
    courseUrl: 'https://grow.google/certificates/',
    badge: 'Google Official Badge',
    freeCertificate: true,
    language: 'English',
    rating: 4.9,
    studentsCount: '95,000+ Students',
    featured: true
  }
];

