import { NewsArticle } from '@/types';

export interface OfficialAuthority {
  id: string;
  name: string;
  nameSinhala: string;
  nameTamil: string;
  shortCode: 'DOENETS' | 'MOE' | 'UGC' | 'NIE';
  portalUrl: string;
  rssFeedUrl: string;
  badgeColor: string;
  logoIcon: string;
  description: string;
}

export interface OfficialCircularItem extends NewsArticle {
  refNumber: string;
  authorityCode: 'DOENETS' | 'MOE' | 'UGC' | 'NIE';
  gazetteNumber?: string;
  pdfDownloadUrl: string;
  isBreaking?: boolean;
  effectiveDate: string;
  targetAudience: string;
  sinhalaSummary: string;
  tamilSummary: string;
  tags: string[];
  readCount?: number;
  importance: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

export const OFFICIAL_AUTHORITIES: OfficialAuthority[] = [
  {
    id: 'doenets',
    name: 'Department of Examinations Sri Lanka',
    nameSinhala: 'ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුව',
    nameTamil: 'இலங்கை பரீட்சைத் திணைக்களம்',
    shortCode: 'DOENETS',
    portalUrl: 'https://doenets.lk',
    rssFeedUrl: 'https://doenets.lk/feed/news.xml',
    badgeColor: 'bg-emerald-500 text-white',
    logoIcon: 'Building2',
    description: 'National examinations (G.C.E. A/L, O/L, Grade 5 Scholarship), timetables, admission slips, and re-correction results.'
  },
  {
    id: 'moe',
    name: 'Ministry of Education Sri Lanka',
    nameSinhala: 'අධ්‍යාපන අමාත්‍යාංශය',
    nameTamil: 'கல்வி அமைச்சு',
    shortCode: 'MOE',
    portalUrl: 'https://moe.gov.lk',
    rssFeedUrl: 'https://moe.gov.lk/feed',
    badgeColor: 'bg-blue-600 text-white',
    logoIcon: 'GraduationCap',
    description: 'School term schedules, teacher circulars, scholarship cut-off marks, and national curriculum policy updates.'
  },
  {
    id: 'ugc',
    name: 'University Grants Commission (UGC)',
    nameSinhala: 'විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාව',
    nameTamil: 'பல்கலைக்கழக மானியங்கள் ஆணைக்குழு',
    shortCode: 'UGC',
    portalUrl: 'https://ugc.ac.lk',
    rssFeedUrl: 'https://ugc.ac.lk/feed/notices',
    badgeColor: 'bg-purple-600 text-white',
    logoIcon: 'Landmark',
    description: 'University intake handbook, minimum Z-Scores cut-offs, aptitude test registrations, and Mahapola/Bursary notices.'
  },
  {
    id: 'nie',
    name: 'National Institute of Education (NIE)',
    nameSinhala: 'ජාතික අධ්‍යාපන ආයතනය (NIE)',
    nameTamil: 'தேசிய கல்வி நிறுவகம்',
    shortCode: 'NIE',
    portalUrl: 'https://nie.lk',
    rssFeedUrl: 'https://nie.lk/rss/publications',
    badgeColor: 'bg-amber-600 text-white',
    logoIcon: 'BookOpen',
    description: 'Teacher Instructional Guides, Resource Books, revised syllabus outlines, and model question papers.'
  }
];

export const INITIAL_OFFICIAL_NOTICES: OfficialCircularItem[] = [
  {
    id: 'notice_doe_al2026_timetable',
    title: 'G.C.E. (A/L) Examination 2026 Timetable & Admission Cards Release Notice',
    titleSinhala: '2026 අ.පො.ස. (උසස් පෙළ) විභාග කාලසටහන සහ ප්‍රවේශ පත්‍ර නිකුත් කිරීමේ නිවේදනය',
    source: 'Department of Examinations',
    authorityCode: 'DOENETS',
    publishedDate: '2026-08-23',
    effectiveDate: '2026-08-23 to 2026-11-30',
    refNumber: 'DOENETS/EX/2026/AL-08',
    category: 'Exam Notice',
    summary: 'The Department of Examinations has officially released the complete subject timetable for the upcoming G.C.E. (A/L) Examination. School candidate admission cards have been dispatched to school principals, and private candidates can download their admission slips online via doenets.lk.',
    sinhalaSummary: '2026 අ.පො.ස. (උ.පෙළ) විභාගයේ සියලු විෂය ධාරාවන් සඳහා වූ සම්පූර්ණ කාලසටහන සහ ප්‍රවේශ පත්‍ර විභාග දෙපාර්තමේන්තුවේ doenets.lk වෙබ් අඩවිය ඔස්සේ දැන් බාගත කරගත හැක. පාසල් අයදුම්කරුවන්ගේ ප්‍රවේශ පත්‍ර විදුහල්පතිවරුන් වෙත තැපැල් මඟින් යවා ඇත.',
    tamilSummary: '2026 க.பொ.த (உ/த) பரீட்சைக்கான பாட அட்டவணை மற்றும் அனுமதிப் பத்திரங்கள் doenets.lk இணையத்தளத்தில் வெளியிடப்பட்டுள்ளன.',
    fullContent: `GOVERNMENT OF SRI LANKA - DEPARTMENT OF EXAMINATIONS
CIRCULAR REFERENCE: DOENETS/EX/2026/AL-08
DATE OF ISSUE: 23rd August 2026

SUBJECT: G.C.E. (Advanced Level) Examination 2026 - Official Timetable, Practical Test Dates & Admission Card Downloads

1. ISSUANCE OF TIMETABLE:
The Commissioner General of Examinations hereby notifies all school candidates and private candidates that the official examination timetable for the G.C.E. (A/L) Examination 2026 has been published on the official web portal (www.doenets.lk).

2. ADMISSION CARDS:
- School Candidates: Admission cards have been posted to the respective Principals of all registered government, semi-government, and recognized private schools.
- Private Candidates: Admission cards can be downloaded by entering the National Identity Card (NIC) number or Examination Application Reference Number on onlineexams.gov.lk/eic.

3. CORRECTIONS & MEDIUM CHANGES:
Any amendments regarding Subject Combinations, Medium of Examination, or Name Corrections must be submitted via the online correction portal before 15th September 2026.

4. INQUIRIES & HOTLINES:
School Examinations Organization Branch: 011-2784208 / 011-2784537 / 1911 (Toll-Free).

Commissioner General of Examinations,
Department of Examinations, Pelawatta, Battaramulla.`,
    isUrgent: true,
    isBreaking: true,
    importance: 'CRITICAL',
    targetAudience: 'All Grade 12 & 13 A/L Students, Teachers & School Principals',
    pdfDownloadUrl: 'https://doenets.lk/downloads/circulars/AL_2026_Timetable_Official.pdf',
    linkUrl: 'https://doenets.lk',
    tags: ['A/L Exam', 'Timetable', 'Admission Slip', 'doenets.lk', 'Breaking'],
    readCount: 14280
  },
  {
    id: 'notice_ugc_zscore_handbook_2026',
    title: 'UGC University Admissions Handbook & Minimum Z-Score Cutoffs Published',
    titleSinhala: 'විශ්වවිද්‍යාල ප්‍රවේශ අත්පොත සහ දිස්ත්‍රික් අවම Z-අගය සීමාවන් ප්‍රකාශයට පත්කිරීම',
    source: 'UGC Sri Lanka',
    authorityCode: 'UGC',
    publishedDate: '2026-08-21',
    effectiveDate: 'Academic Year 2025/2026',
    refNumber: 'UGC/ADM/2026/HB-01',
    category: 'University Intake',
    summary: 'The University Grants Commission (UGC) has released the Official University Admission Guidebook and course details for state universities across Sri Lanka. Online applications for aptitude-based degree programs are now open.',
    sinhalaSummary: 'ශ්‍රී ලංකාවේ සියලුම රාජ්‍ය විශ්වවිද්‍යාල සඳහා සිසුන් ඇතුළත් කරගැනීමේ නිල මාර්ගෝපදේශ අත්පොත (UGC Handbook) සහ පීඨ අනුව පාඨමාලා විස්තර ugc.ac.lk ඔස්සේ ප්‍රකාශයට පත් කර ඇත.',
    tamilSummary: 'பல்கலைக்கழக மானியங்கள் ஆணைக்குழுவின் உத்தியோகபூர்வ அனுமதி வழிகாட்டி நூல் வெளியிடப்பட்டுள்ளது.',
    fullContent: `UNIVERSITY GRANTS COMMISSION - SRI LANKA
NOTICE NO: UGC/ADM/2026/HB-01

ADMISSION OF STUDENTS TO FIRST DEGREE COURSES OF HIGHER EDUCATIONAL INSTITUTIONS (ACADEMIC YEAR 2025/2026)

The University Grants Commission announces that the official University Admissions Handbook is now accessible online.

Key Instructions:
1. Online Application Submission: Candidates eligible for university admissions are advised to submit applications through the official UGC portal (www.ugc.ac.lk).
2. Aptitude Tests: Applications for aptitude tests (Architecture, Design, Information Technology, Translation Studies, Sports Science) must be submitted to the respective universities on or before the prescribed closing dates.
3. Help Desk: 011-2695301 / 011-2695302 (Admissions Department).

Secretary, University Grants Commission, Colombo 07.`,
    isUrgent: true,
    isBreaking: false,
    importance: 'HIGH',
    targetAudience: 'A/L Completed Students & University Applicants',
    pdfDownloadUrl: 'https://ugc.ac.lk/downloads/admissions/UGC_Handbook_2025_2026.pdf',
    linkUrl: 'https://ugc.ac.lk',
    tags: ['UGC', 'Z-Score', 'University Admission', 'Aptitude Tests'],
    readCount: 9840
  },
  {
    id: 'notice_moe_term_calendar_2026',
    title: 'Ministry of Education Circular: School Term Dates & Vacation Schedule',
    titleSinhala: 'අධ්‍යාපන අමාත්‍යාංශ චක්‍රලේඛය: පාසල් වාර සටහන සහ නිවාඩු කාලසීමාවන්',
    source: 'Ministry of Education',
    authorityCode: 'MOE',
    publishedDate: '2026-08-18',
    effectiveDate: '2026 Term Schedule',
    refNumber: 'MOE/SCH/CIRCULAR/2026/14',
    gazetteNumber: 'Gazette Extra 2419/12',
    category: 'Syllabus Update',
    summary: 'The Ministry of Education has issued the revised national academic calendar for all government and approved private schools, detailing term examination dates and school vacation intervals.',
    sinhalaSummary: 'සියලුම රජයේ සහ අනුමත පෞද්ගලික පාසල් සඳහා වූ සංශෝධිත අධ්‍යයන වාර සටහන, වාර විභාග පැවැත්වෙන දින සහ පාසල් නිවාඩු කාලසීමාවන් පිළිබඳ චක්‍රලේඛය නිකුත් කර ඇත.',
    tamilSummary: 'அரச மற்றும் அங்கீகரிக்கப்பட்ட பாடசாலைகளுக்கான புதிய தவணை அட்டவணை வெளியிடப்பட்டுள்ளது.',
    fullContent: `MINISTRY OF EDUCATION - SRI LANKA
CIRCULAR NO: MOE/SCH/CIRCULAR/2026/14
TO: All Provincial Directors of Education, Zonal Directors, and School Principals

SUBJECT: School Term Dates and Examination Schedules for the Year 2026

The revised schedule of school terms for Sinhala, Tamil, and Muslim schools for the academic year 2026 is hereby communicated for strict adherence.

- Second Term Conclusion: 28th August 2026
- Third Term Commencement: 8th September 2026
- Year-End School Term Tests: Scheduled between 15th October and 30th October 2026.

Secretary, Ministry of Education, Isurupaya, Battaramulla.`,
    isUrgent: false,
    isBreaking: false,
    importance: 'NORMAL',
    targetAudience: 'Teachers, Students, Parents & School Administrators',
    pdfDownloadUrl: 'https://moe.gov.lk/circulars/School_Terms_2026_Gazette.pdf',
    linkUrl: 'https://moe.gov.lk',
    tags: ['MoE', 'Term Dates', 'Vacations', 'Circular', 'Isurupaya'],
    readCount: 6510
  },
  {
    id: 'notice_doe_ol2026_rescrutiny',
    title: 'G.C.E. (O/L) Re-Correction / Re-Scrutiny Results Released on doenets.lk',
    titleSinhala: 'අ.පො.ස. (සා.පෙළ) නැවත සමීක්ෂණ ප්‍රතිඵල doenets.lk ඔස්සේ නිකුත් කෙරේ',
    source: 'Department of Examinations',
    authorityCode: 'DOENETS',
    publishedDate: '2026-08-15',
    effectiveDate: '2026-08-15',
    refNumber: 'DOENETS/RES/2026/OL-RC',
    category: 'Results',
    summary: 'The Department of Examinations has published the re-scrutiny results of the recent G.C.E. (Ordinary Level) examination. Candidates can verify updated results and download certificate transcripts instantly.',
    sinhalaSummary: 'අ.පො.ස. (සාමාන්‍ය පෙළ) විභාගයේ නැවත සමීක්ෂණ ප්‍රතිඵල විභාග දෙපාර්තමේන්තුවේ doenets.lk සහ results.exams.gov.lk වෙබ් අඩවි මඟින් දැන් ලබාගත හැක.',
    tamilSummary: 'க.பொ.த (சா/த) பரீட்சையின் மீள் பரிசீலனை முடிவுகள் வெளியிடப்பட்டுள்ளன.',
    fullContent: `DEPARTMENT OF EXAMINATIONS - SRI LANKA
PRESS RELEASE: G.C.E. (O/L) RE-SCRUTINY RESULTS

The Commissioner General of Examinations informs that the results of the re-scrutiny of answer scripts for the G.C.E. Ordinary Level Examination are now available on the following websites:
1. www.doenets.lk
2. www.results.exams.gov.lk

Candidates may enter their Examination Index Number to check revised results.

Department of Examinations, Battaramulla.`,
    isUrgent: false,
    isBreaking: false,
    importance: 'HIGH',
    targetAudience: 'O/L Students & Grade 12 entrants',
    pdfDownloadUrl: 'https://doenets.lk/downloads/results/OL_Rescrutiny_Notice.pdf',
    linkUrl: 'https://results.exams.gov.lk',
    tags: ['O/L Exam', 'Results', 'Re-scrutiny', 'doenets.lk'],
    readCount: 11200
  },
  {
    id: 'notice_nie_resource_book_2026',
    title: 'NIE Publishes Revised A/L Combined Mathematics & Biology Resource Books',
    titleSinhala: 'ජාතික අධ්‍යාපන ආයතනය (NIE) සංයුක්ත ගණිතය සහ ජීව විද්‍යා සම්පත් පොත් නිකුත් කරයි',
    source: 'SipArana Academic Board',
    authorityCode: 'NIE',
    publishedDate: '2026-08-10',
    effectiveDate: '2026 Curriculum',
    refNumber: 'NIE/CURR/2026/A-L-RES',
    category: 'Syllabus Update',
    summary: 'The National Institute of Education (NIE) has uploaded the updated digital editions of the official Resource Books for G.C.E. A/L Combined Mathematics, Biology, and Physics (Sinhala, English, and Tamil mediums).',
    sinhalaSummary: 'උසස් පෙළ සංයුක්ත ගණිතය, ජීව විද්‍යාව සහ භෞතික විද්‍යාව සඳහා වූ නවතම නිල සම්පත් පොත් (Resource Books) නොමිලේ ඩිජිටල් පිටපත් ලෙස nie.lk වෙබ් අඩවියෙන් බාගත හැක.',
    tamilSummary: 'தேசிய கல்வி நிறுவகம் புதிய க.பொ.த (உ/த) வள நூல்களை வெளியிட்டுள்ளது.',
    fullContent: `NATIONAL INSTITUTE OF EDUCATION (NIE) - MAHARAGAMA
PUBLICATION DIVISION

Notice on Availability of G.C.E. (Advanced Level) Official Teacher Guides and Student Resource Books.

All students and educators can freely download PDF copies of the approved syllabi and teacher instructional manuals directly from the NIE official repository (nie.lk/teacherguides).

Director General, National Institute of Education, Maharagama.`,
    isUrgent: false,
    isBreaking: false,
    importance: 'NORMAL',
    targetAudience: 'A/L Science, Maths & Technology Students and Teachers',
    pdfDownloadUrl: 'https://nie.lk/downloads/resourcebooks/AL_Combined_Maths_2026.pdf',
    linkUrl: 'https://nie.lk',
    tags: ['NIE', 'Resource Books', 'Combined Maths', 'Biology', 'Syllabus'],
    readCount: 7890
  }
];

// Realistic automated live stream simulated drops
export const SIMULATED_NEW_ALERTS: OfficialCircularItem[] = [
  {
    id: 'notice_doe_scholarship_cutoff_live',
    title: '⚡ JUST IN: Grade 5 Scholarship Examination District Cut-Off Marks Released',
    titleSinhala: '⚡ විශේෂ පුවතක්: 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාග දිස්ත්‍රික් කඩඉම් ලකුණු නිකුත් කෙරේ',
    source: 'Department of Examinations',
    authorityCode: 'DOENETS',
    publishedDate: 'Just Now (Live Sync)',
    effectiveDate: '2026 Intake',
    refNumber: 'DOENETS/G5/2026/CUT-OFF',
    category: 'Scholarship',
    summary: 'The Department of Examinations has officially announced the district-wise minimum cut-off marks for popular school admissions following the Grade 5 Scholarship Examination.',
    sinhalaSummary: '5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයේ දිස්ත්‍රික් කඩඉම් ලකුණු සහ ජනප්‍රිය පාසල් සඳහා සුදුසුකම් ලැබූ සිසුන්ගේ නාමලේඛන doenets.lk හි දැන් ප්‍රදර්ශනය කෙරේ.',
    tamilSummary: '5 ஆம் தர புலமைப்பரிசில் பரீட்சைக்கான மாவட்ட ரீதியான வெட்டுப்புள்ளிகள் வெளியிடப்பட்டுள்ளன.',
    fullContent: `DEPARTMENT OF EXAMINATIONS - SRI LANKA
BREAKING BULLETIN: GRADE 5 SCHOLARSHIP EXAMINATION DISTRICT CUT-OFF MARKS

The Commissioner General of Examinations announces the district cut-off marks for the Sinhala and Tamil medium candidates:
- Colombo District: Sinhala 154 / Tamil 151
- Gampaha District: Sinhala 153 / Tamil 150
- Kandy District: Sinhala 152 / Tamil 149
- Galle District: Sinhala 152 / Tamil 148
- Jaffna District: Tamil 149

Appeals for school placements will open on 1st September 2026 via moe.gov.lk.`,
    isUrgent: true,
    isBreaking: true,
    importance: 'CRITICAL',
    targetAudience: 'Grade 5 Students, Parents & Teachers',
    pdfDownloadUrl: 'https://doenets.lk/downloads/scholarship/Grade_5_Cutoff_2026.pdf',
    linkUrl: 'https://doenets.lk',
    tags: ['Grade 5', 'Scholarship', 'Cutoff Marks', 'doenets.lk', 'Breaking'],
    readCount: 18950
  },
  {
    id: 'notice_moe_al_ict_practical_live',
    title: '⚡ G.C.E. A/L Information & Communication Technology (ICT) Practical Exam Dates',
    titleSinhala: '⚡ උසස් පෙළ තොරතුරු හා සන්නිවේදන තාක්ෂණ (ICT) ප්‍රායෝගික පරීක්ෂණ දින ප්‍රකාශයට පත්කෙරේ',
    source: 'Department of Examinations',
    authorityCode: 'DOENETS',
    publishedDate: 'Just Now (Live Sync)',
    effectiveDate: '2026-09-10 to 2026-09-25',
    refNumber: 'DOENETS/EX/2026/ICT-PR',
    category: 'Exam Notice',
    summary: 'The practical examination schedule for G.C.E. A/L Technology and ICT stream candidates has been scheduled across designated school computer resource centers island-wide.',
    sinhalaSummary: 'උසස් පෙළ තොරතුරු තාක්ෂණ (ICT) ප්‍රායෝගික පරීක්ෂණ දිවයින පුරා මධ්‍යස්ථානවල පැවැත්වෙන දින වකවානු විභාග දෙපාර්තමේන්තුව විසින් නිවේදනය කර ඇත.',
    tamilSummary: 'க.பொ.த (உ/த) தகவல் தொடர்பாடல் தொழிநுட்ப செய்முறைப் பரீட்சை திகதிகள் அறிவிக்கப்பட்டுள்ளன.',
    fullContent: `DEPARTMENT OF EXAMINATIONS - SRI LANKA
NOTICE: G.C.E. (A/L) ICT PRACTICAL EXAMINATION 2026

Candidates registered for ICT (Subject Code 20) are requested to check their practical center allocations and batch numbers by entering their index number on doenets.lk.

Testing window: 10th September 2026 - 25th September 2026.

Commissioner General of Examinations.`,
    isUrgent: true,
    isBreaking: true,
    importance: 'HIGH',
    targetAudience: 'A/L Technology & ICT Candidates',
    pdfDownloadUrl: 'https://doenets.lk/downloads/ict/AL_ICT_Practical_Schedule_2026.pdf',
    linkUrl: 'https://doenets.lk',
    tags: ['ICT', 'Practical Exam', 'doenets.lk', 'Technology Stream'],
    readCount: 8430
  }
];
