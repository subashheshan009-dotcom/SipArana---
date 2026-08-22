export interface BookListing {
  id: string;
  title: string;
  titleSi?: string;
  titleTa?: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'School Books' | 'Teacher Notes' | 'Creative Work' | 'Past Paper Collections';
  categorySi: string;
  categoryTa: string;
  coverImage: string;
  gradeLevel: 'Grade 6-9' | 'Grade 10-11 (O/L)' | 'Grade 12-13 (A/L)' | 'University' | 'General';
  subject?: string;
  medium: 'Sinhala' | 'Tamil' | 'English' | 'Bilingual';
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  sellerName: string;
  sellerRole: 'Student' | 'Teacher' | 'Parent' | 'Alumni';
  sellerPhone: string;
  sellerEmail?: string;
  sellerDistrict: string;
  isVerifiedSeller?: boolean;
  rating: number;
  reviewsCount: number;
  pages?: number;
  publicationYear?: number;
  deliveryAvailable: boolean;
  freeDelivery?: boolean;
  pickupLocation?: string;
  sampleHighlights?: string[];
  createdAt: string;
  isUserListing?: boolean;
}

export const INITIAL_BOOK_LISTINGS: BookListing[] = [
  {
    id: 'book-1',
    title: 'A/L Combined Mathematics Master Theory & Revision Book',
    titleSi: 'උසස් පෙළ සංයුක්ත ගණිතය පූර්ණ සිද්ධාන්ත හා පුනරීක්ෂණ සංග්‍රහය',
    titleTa: 'உயர்தர இணைந்த கணிதம் கோட்பாடு மற்றும் திருத்தல் வழிகாட்டி',
    author: 'Eng. Janaka Wickramasinghe (B.Sc. Eng. Hons)',
    description: 'Comprehensive theory coverage for Pure and Applied Mathematics with 1,200+ worked model problems, step-by-step calculus proofs, and unit-by-unit past paper classification with teacher annotations.',
    price: 1850,
    originalPrice: 2400,
    category: 'Teacher Notes',
    categorySi: 'ගුරු සටහන් & නිබන්ධන',
    categoryTa: 'ஆசிரியர் குறிப்புகள்',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 12-13 (A/L)',
    subject: 'Combined Mathematics',
    medium: 'Sinhala',
    condition: 'Like New',
    sellerName: 'Kavindu Senanayake',
    sellerRole: 'Student',
    sellerPhone: '+94 77 123 4567',
    sellerDistrict: 'Colombo',
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 38,
    pages: 480,
    publicationYear: 2025,
    deliveryAvailable: true,
    freeDelivery: false,
    pickupLocation: 'Nugegoda / Maharagama',
    sampleHighlights: [
      'Full Trigonometry & Calculus unit summaries',
      'Vectors & Relative Velocity shortcuts',
      'Model exam papers with marking schemes'
    ],
    createdAt: '2026-08-15'
  },
  {
    id: 'book-2',
    title: 'G.C.E. O/L Science Past Papers with Model Marking Scheme (2018-2025)',
    titleSi: 'සාමාන්‍ය පෙළ විද්‍යාව පසුගිය ප්‍රශ්න පත්‍ර හා ආදර්ශ ලකුණු දීමේ පටිපාටිය',
    titleTa: 'சா/த விஞ்ஞானம் கடந்த கால வினாத்தாள்கள் மற்றும் புள்ளித்திட்டம்',
    author: 'Dr. Nalini Ratnayake & NIE Advisory Panel',
    description: 'Official G.C.E. O/L Science past papers with full mcq clarifications, structured answer guides, lab experiment rubrics, and high-yield scoring tips approved by national examiners.',
    price: 950,
    originalPrice: 1300,
    category: 'Past Paper Collections',
    categorySi: 'පසුගිය විභාග ප්‍රශ්න පත්‍ර',
    categoryTa: 'கடந்த கால வினாத்தாள் தொகுப்புகள்',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 10-11 (O/L)',
    subject: 'Science',
    medium: 'Sinhala',
    condition: 'Brand New',
    sellerName: 'Mrs. Jayathilake (Science Teacher)',
    sellerRole: 'Teacher',
    sellerPhone: '+94 71 889 2345',
    sellerDistrict: 'Kandy',
    isVerifiedSeller: true,
    rating: 5.0,
    reviewsCount: 64,
    pages: 320,
    publicationYear: 2026,
    deliveryAvailable: true,
    freeDelivery: true,
    pickupLocation: 'Kandy City Center / Katugastota',
    sampleHighlights: [
      'MCQ step-by-step scientific explanations',
      'Genetics and Periodic table rapid charts',
      'Electricity calculations simplified'
    ],
    createdAt: '2026-08-18'
  },
  {
    id: 'book-3',
    title: 'Official Ministry Grade 10 English Literature Anthologies & Study Guide',
    titleSi: '10 ශ්‍රේණිය ඉංග්‍රීසි සාහිත්‍ය නිල පෙළපොත හා විවරණ කෘතිය',
    titleTa: 'தரம் 10 ஆங்கில இலக்கிய அதிகாரப்பூர்வ பாடநூல் மற்றும் வழிகாட்டி',
    author: 'Educational Publications Department (EPD)',
    description: 'Original Sri Lankan Ministry textbook for Grade 10 English Literature with poetic device breakdowns, character analysis for prose, drama context, and sample essay answers.',
    price: 650,
    originalPrice: 850,
    category: 'School Books',
    categorySi: 'පාසල් පෙළපොත්',
    categoryTa: 'பாடசாலை பாடப்புத்தகங்கள்',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 10-11 (O/L)',
    subject: 'English Literature',
    medium: 'English',
    condition: 'Like New',
    sellerName: 'Dinuwan Perera',
    sellerRole: 'Student',
    sellerPhone: '+94 76 543 9876',
    sellerDistrict: 'Gampaha',
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 19,
    pages: 210,
    publicationYear: 2024,
    deliveryAvailable: true,
    freeDelivery: false,
    pickupLocation: 'Kelaniya / Kiribathgoda',
    sampleHighlights: [
      'Line-by-line poem commentary',
      'The Nightingale and The Rose character maps',
      'Model 15-mark essay structures'
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'book-4',
    title: 'A/L Chemistry Organic Reactions & Mechanism Pathway Guide',
    titleSi: 'උසස් පෙළ රසායන විද්‍යාව කාබනික පරිවර්තන හා ප්‍රතික්‍රියා මාර්ග සිතියම',
    titleTa: 'உயர்தர இரசாயனவியல் சேதன தாக்கங்கள் மற்றும் பொறிமுறை வழிகாட்டி',
    author: 'Prof. R. M. Bandara (Senior Lecturer)',
    description: 'High-clarity roadmaps for all A/L Organic Chemistry conversions, named reactions, reagent reaction tables, mechanism derivations, and distinction practice problems.',
    price: 1450,
    originalPrice: 1950,
    category: 'Teacher Notes',
    categorySi: 'ගුරු සටහන් & නිබන්ධන',
    categoryTa: 'ஆசிரியர் குறிப்புகள்',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 12-13 (A/L)',
    subject: 'Chemistry',
    medium: 'Sinhala',
    condition: 'Brand New',
    sellerName: 'ChemMaster Publications',
    sellerRole: 'Teacher',
    sellerPhone: '+94 70 334 5566',
    sellerDistrict: 'Kurunegala',
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 82,
    pages: 290,
    publicationYear: 2026,
    deliveryAvailable: true,
    freeDelivery: true,
    pickupLocation: 'Kurunegala Town',
    sampleHighlights: [
      '50 Essential A/L organic multi-step conversions',
      'Color-coded reaction flowcharts',
      'Isomerism identification matrix'
    ],
    createdAt: '2026-08-19'
  },
  {
    id: 'book-5',
    title: 'Sanda Eliya (සඳ එළිය) - O/L Sinhala Literature Critical Appreciation Novel',
    titleSi: 'සඳ එළිය - සාමාන්‍ය පෙළ සාහිත්‍ය නිර්මාණාත්මක විචාර සංග්‍රහය',
    titleTa: 'சந்த எளிய - சிங்கள இலக்கிய விமர்சன நாவல் மற்றும் ஆய்வுக் கட்டுரைகள்',
    author: 'K. B. Sugathapala (National Sahitya Award Winner)',
    description: 'Award-winning creative literature study work featuring short stories, poetic rhythm appreciation, character essays, and creative writing techniques tailored for Sinhala Language & Literature students.',
    price: 750,
    originalPrice: 1000,
    category: 'Creative Work',
    categorySi: 'නිර්මාණශීලී කෘති',
    categoryTa: 'படைப்பிலக்கியம் & புதினங்கள்',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 10-11 (O/L)',
    subject: 'Sinhala Literature',
    medium: 'Sinhala',
    condition: 'Brand New',
    sellerName: 'Sarasavi Sahitya Kendraya',
    sellerRole: 'Parent',
    sellerPhone: '+94 71 223 8899',
    sellerDistrict: 'Matara',
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 45,
    pages: 240,
    publicationYear: 2025,
    deliveryAvailable: true,
    freeDelivery: false,
    pickupLocation: 'Matara Fort / Rahula Road',
    sampleHighlights: [
      'Original prose with literary analysis',
      'Creative essay writing patterns',
      'Vocabulary booster glossary'
    ],
    createdAt: '2026-08-12'
  },
  {
    id: 'book-6',
    title: 'A/L Physics Structured Essays & Practical Lab Guide (Full Theory + Errors)',
    titleSi: 'උසස් පෙළ භෞතික විද්‍යාව ව්‍යුහගත රචනා හා ප්‍රායෝගික පරීක්ෂණ මාර්ගෝපදේශය',
    titleTa: 'உயர்தர பௌதிகவியல் அமைப்புக் கட்டுரை மற்றும் செய்முறை வழிகாட்டி',
    author: 'Sunil Wijesinghe (Former Chief Examiner)',
    description: 'All 42 official A/L Physics experiments explained with error percentage calculations, graph plotting rules, micrometer/vernier vernier vernier readings, and 100+ predicted structured essay questions.',
    price: 1600,
    originalPrice: 2200,
    category: 'Teacher Notes',
    categorySi: 'ගුරු සටහන් & නිබන්ධන',
    categoryTa: 'ஆசிரியர் குறிப்புகள்',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 12-13 (A/L)',
    subject: 'Physics',
    medium: 'Sinhala',
    condition: 'Like New',
    sellerName: 'Amila Fernando',
    sellerRole: 'Student',
    sellerPhone: '+94 77 990 1122',
    sellerDistrict: 'Galle',
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 52,
    pages: 360,
    publicationYear: 2025,
    deliveryAvailable: true,
    freeDelivery: false,
    pickupLocation: 'Galle Karapitiya / Town',
    sampleHighlights: [
      'All 42 laboratory experiments with apparatus diagrams',
      'Error analysis formulas and graph intercept guides',
      'Top 20 recurring exam traps & how to avoid them'
    ],
    createdAt: '2026-08-16'
  },
  {
    id: 'book-7',
    title: 'Grade 8 & 9 Mathematics & Science National Textbooks (Set of 4)',
    titleSi: '8 & 9 ශ්‍රේණි ගණිතය හා විද්‍යාව නිල පෙළපොත් කට්ටලය',
    titleTa: 'தரம் 8 & 9 கணிதம் மற்றும் விஞ்ஞானம் உத்தியோகபூர்வ பாடப்புத்தகங்கள்',
    author: 'Educational Publications Department (Sri Lanka)',
    description: 'Complete set of official Ministry textbooks for Grades 8 and 9 in pristine condition. Covered with transparent plastic wraps, clean pages with no markings.',
    price: 800,
    originalPrice: 1200,
    category: 'School Books',
    categorySi: 'පාසල් පෙළපොත්',
    categoryTa: 'பாடசாலை பாடப்புத்தகங்கள்',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 6-9',
    subject: 'Mathematics & Science',
    medium: 'Sinhala',
    condition: 'Like New',
    sellerName: 'Chamari Gunawardena',
    sellerRole: 'Parent',
    sellerPhone: '+94 75 443 2190',
    sellerDistrict: 'Kalutara',
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 14,
    pages: 520,
    publicationYear: 2024,
    deliveryAvailable: true,
    freeDelivery: true,
    pickupLocation: 'Panadura / Wadduwa',
    sampleHighlights: [
      'Clean unwritten exercise problems',
      'Original color diagrams preserved',
      'Ideal for revision and second-copy study'
    ],
    createdAt: '2026-08-14'
  },
  {
    id: 'book-8',
    title: 'A/L Accounting & Business Studies Past Paper Compilation (10 Years Solved)',
    titleSi: 'උසස් පෙළ ගිණුම්කරණය සහ ව්‍යාපාර අධ්‍යයනය වසර 10 ක විසඳූ ප්‍රශ්න පත්‍ර සංග්‍රහය',
    titleTa: 'உயர்தர கணக்கியல் மற்றும் வணிகக் கல்வி 10 வருட வினாத்தாள் தீர்வுகள்',
    author: 'Chartered Accountants & Commerce Teachers Guild',
    description: 'Step-by-step ledger accounts, trial balance reconciliations, cash flow statements, and business strategy essay solutions aligned with the latest Sri Lanka Accounting Standards (LKAS).',
    price: 1550,
    originalPrice: 2100,
    category: 'Past Paper Collections',
    categorySi: 'පසුගිය විභාග ප්‍රශ්න පත්‍ර',
    categoryTa: 'கடந்த கால வினாத்தாள் தொகுப்புகள்',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'Grade 12-13 (A/L)',
    subject: 'Accounting & Business Studies',
    medium: 'English',
    condition: 'Brand New',
    sellerName: 'Tharindu Alwis (Commerce Teacher)',
    sellerRole: 'Teacher',
    sellerPhone: '+94 77 654 3210',
    sellerDistrict: 'Colombo',
    isVerifiedSeller: true,
    rating: 5.0,
    reviewsCount: 71,
    pages: 410,
    publicationYear: 2026,
    deliveryAvailable: true,
    freeDelivery: true,
    pickupLocation: 'Kollupitiya / Bambalapitiya',
    sampleHighlights: [
      'Full LKAS compliant financial statement formats',
      'Management ratio formulas & interpretation guides',
      'Time-saving exam ledger templates'
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'book-9',
    title: 'Rathna Deepa (රත්න දීප) - Creative Poems & Youth Essays Collection',
    titleSi: 'රත්න දීප - තරුණ නිර්මාණශීලී කාව්‍ය හා විචාර සංග්‍රහය',
    titleTa: 'ரத்ன தீப - கவிதை மற்றும் இளைஞர் கட்டுரைத் தொகுப்பு',
    author: 'SipArana Student Writers Guild',
    description: 'An inspiring anthology of original student poetry, creative short stories, and environmental essays compiled from island-wide school literary competitions.',
    price: 600,
    originalPrice: 800,
    category: 'Creative Work',
    categorySi: 'නිර්මාණශීලී කෘති',
    categoryTa: 'படைப்பிலக்கியம் & புதினங்கள்',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    gradeLevel: 'General',
    subject: 'Literature & Creative Arts',
    medium: 'Bilingual',
    condition: 'Brand New',
    sellerName: 'SipArana Arts Council',
    sellerRole: 'Alumni',
    sellerPhone: '+94 71 555 7788',
    sellerDistrict: 'Anuradhapura',
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 29,
    pages: 180,
    publicationYear: 2026,
    deliveryAvailable: true,
    freeDelivery: false,
    pickupLocation: 'Anuradhapura Town',
    sampleHighlights: [
      '35 Award-winning student poems with English commentary',
      'Creative prompts for essay exams',
      'Artistic illustrations by young artists'
    ],
    createdAt: '2026-08-11'
  }
];

export const SRI_LANKAN_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
];

export const PRESET_COVER_IMAGES = [
  { label: 'Science / Physics / Math', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Textbook / Study Notes', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Literature / Novel', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chemistry / Biology', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Past Papers / Exam Set', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Commerce / Accounts', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80' },
  { label: 'School Library Stack', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' }
];
