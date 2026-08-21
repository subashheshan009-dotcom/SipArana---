import type { UniversityInstitution, UniversityDegree, UniversityResource } from '@/types';

export const UNIVERSITIES_DATA: UniversityInstitution[] = [
  {
    id: 'uom',
    name: 'University of Moratuwa',
    shortName: 'UoM',
    nameSinhala: 'මොරටුව විශ්වවිද්‍යාලය',
    location: 'Katubedda, Moratuwa',
    logo: '🏛️',
    badgeColor: 'from-blue-600 to-indigo-700',
    description: 'Sri Lanka’s premier technological higher education institution specializing in Engineering, Architecture, and Information Technology with international Washington Accord accreditation.',
    website: 'https://uom.lk',
    isStateUni: true,
    faculties: [
      {
        id: 'uom_eng',
        name: 'Faculty of Engineering',
        nameSinhala: 'ඉංජිනේරු පීඨය',
        shortCode: 'FOE',
        degrees: [
          {
            id: 'deg_uom_cse',
            code: 'ENG-CSE',
            title: 'B.Sc. (Hons) in Computer Science & Engineering',
            titleSinhala: 'පරිගණක විද්‍යා හා ඉංජිනේරු ගෞරව උපාධිය',
            shortTitle: 'Computer Science & Eng',
            facultyName: 'Faculty of Engineering',
            durationYears: 4,
            totalCredits: 135,
            careerTracks: ['Software Architect', 'AI/ML Research Engineer', 'Distributed Systems Specialist', 'DevOps & Cloud Lead', 'Cybersecurity Director'],
            description: 'Intensive engineering degree covering high performance computing, algorithms, distributed operating systems, machine learning architectures, and VLSI hardware design.',
            iconName: 'Cpu',
            colorTheme: 'from-blue-600 to-cyan-700',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Year 1 • Semester 1 (General Eng Foundation)',
                modules: [
                  {
                    id: 'mod_cs1032',
                    code: 'CS1032',
                    title: 'Programming Fundamentals & Data Structures in C/C++',
                    titleSinhala: 'ක්‍රමලේඛන මූලධර්ම හා දත්ත ව්‍යුහ',
                    credits: 3,
                    type: 'Core',
                    description: 'Memory allocation, pointers, recursion, dynamic array handling, stacks, queues, linked lists, and time complexity Big-O intuition.',
                    syllabusTopics: [
                      'Pointers, References & Dynamic Memory (malloc/free, new/delete)',
                      'Recursion & Divide-and-Conquer Paradigms',
                      'Abstract Data Types: Stacks, Queues, Doubly Linked Lists',
                      'Asymptotic Complexity: Big-O, Big-Omega, Big-Theta Derivations'
                    ],
                    prescribedTextbooks: [
                      'Introduction to Algorithms (CLRS) by Cormen, Leiserson, Rivest, Stein',
                      'The C Programming Language (2nd Ed) by Brian Kernighan & Dennis Ritchie'
                    ],
                    keyPrinciples: [
                      'Dynamic memory leakage prevention using RAII / smart pointers',
                      'Array indexing vs pointer arithmetic execution speed in L1 cache',
                      'Time-space complexity tradeoffs in list traversals'
                    ],
                    sampleQuestions: [
                      'Implement an O(n) algorithm to reverse a singly linked list in-place using two pointer variables.',
                      'Derive the recurrence relation T(n) = 2T(n/2) + O(n) using the Master Theorem.'
                    ],
                    aiPromptStarters: [
                      'Explain pointer arithmetic vs array indexing in C++ with memory diagrams',
                      'Help me derive the time complexity of QuickSort average vs worst case',
                      'Write a C++ program implementing a thread-safe generic Queue'
                    ]
                  },
                  {
                    id: 'mod_ma1014',
                    code: 'MA1014',
                    title: 'Engineering Mathematics I (Calculus & Linear Algebra)',
                    titleSinhala: 'ඉංජිනේරු ගණිතය I (කලනය සහ රේඛීය වීජ ගණිතය)',
                    credits: 3,
                    type: 'Core',
                    description: 'Multi-variable differential calculus, partial derivatives, Taylor series expansions, matrices, eigenvalues, eigenvectors, and linear transformations.',
                    syllabusTopics: [
                      'Matrices, Determinants, Rank & Gauss-Jordan Elimination',
                      'Eigenvalues, Eigenvectors & Matrix Diagonalization',
                      'Partial Differentiation, Gradient Vectors & Directional Derivatives',
                      'Extreme Values of Multi-variable Functions & Lagrange Multipliers'
                    ],
                    prescribedTextbooks: [
                      'Advanced Engineering Mathematics by Erwin Kreyszig',
                      'Linear Algebra and Its Applications by Gilbert Strang'
                    ],
                    keyPrinciples: [
                      'Characteristic equation det(A - λI) = 0 for eigenvalues',
                      'Orthogonal eigenvectors of real symmetric matrices',
                      'Hessian Matrix determinant tests for multivariable saddle points'
                    ],
                    sampleQuestions: [
                      'Find the eigenvalues and corresponding normalized eigenvectors for matrix A = [[4, 2], [1, 3]].',
                      'Maximize f(x, y) = 2x + 3y subject to the elliptical constraint x^2 + 4y^2 = 4 using Lagrange multipliers.'
                    ],
                    aiPromptStarters: [
                      'Step-by-step diagonalization of a 3x3 symmetric matrix',
                      'Explain geometric meaning of eigenvalues in PCA and data compression',
                      'Solve multivariable optimization using Lagrange multipliers'
                    ]
                  },
                  {
                    id: 'mod_en1012',
                    code: 'EN1012',
                    title: 'Digital Electronics & Logic Circuit Synthesis',
                    titleSinhala: 'ඩිජිටල් ඉලෙක්ට්‍රොනික විද්‍යාව සහ පරිපථ සංස්ලේෂණය',
                    credits: 3,
                    type: 'Core',
                    description: 'Boolean algebra theorems, Karnaugh maps (up to 5 variables), Quine-McCluskey minimization, multiplexers, decoders, flip-flops, finite state machines (FSM), and timing diagrams.',
                    syllabusTopics: [
                      'Combinational Logic: K-Maps, Hazarding & Hazard-Free Synthesis',
                      'MSI Logic: Multiplexers, De-multiplexers, Adders & ALUs',
                      'Sequential Logic: Latches, Flip-Flops (D, JK, T), Setup & Hold Times',
                      'Mealy and Moore Finite State Machine (FSM) Design and State Reduction'
                    ],
                    prescribedTextbooks: [
                      'Digital Design: With an Introduction to the Verilog HDL by M. Morris Mano'
                    ],
                    keyPrinciples: [
                      'Setup time (t_su) and Hold time (t_h) constraints in synchronous flip-flops',
                      'Propagation delay and glitch elimination via redundant prime implicants',
                      'One-hot encoding vs binary encoding in FSM state synthesis'
                    ],
                    sampleQuestions: [
                      'Design a synchronous 3-bit Gray code up-counter using JK flip-flops.',
                      'Construct a Moore FSM state transition diagram that detects the serial binary sequence "1011".'
                    ],
                    aiPromptStarters: [
                      'Design a sequence detector for 1101 using Verilog HDL and D flip-flops',
                      'Explain setup and hold time violations in high-speed digital circuits',
                      'Simplify a 5-variable Boolean function using Karnaugh Maps'
                    ]
                  }
                ]
              },
              {
                semesterNumber: 2,
                year: 1,
                sem: 2,
                code: 'Y1S2',
                label: 'Year 1 • Semester 2',
                modules: [
                  {
                    id: 'mod_cs2012',
                    code: 'CS2012',
                    title: 'Object-Oriented Design & Design Patterns (Java/C++)',
                    titleSinhala: 'වස්තු-නැඹුරු මෘදුකාංග සැලසුම් සහ Design Patterns',
                    credits: 3,
                    type: 'Core',
                    description: 'SOLID principles, Gang of Four (GoF) design patterns, UML class and sequence modeling, polymorphism, interface segregation, and test-driven development (TDD).',
                    syllabusTopics: [
                      'SOLID Architecture Principles & Clean Code Standards',
                      'Creational Patterns: Singleton, Factory, Abstract Factory, Builder',
                      'Structural Patterns: Adapter, Composite, Decorator, Facade',
                      'Behavioral Patterns: Observer, Strategy, Command, State'
                    ],
                    prescribedTextbooks: [
                      'Design Patterns: Elements of Reusable Object-Oriented Software by GoF',
                      'Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin'
                    ],
                    keyPrinciples: [
                      'Favor composition over inheritance to prevent tight coupling',
                      'Open-Closed Principle (OCP): open for extension, closed for modification',
                      'Dependency Inversion: depend on abstractions, not concretions'
                    ],
                    sampleQuestions: [
                      'Implement an event notification bus using the Observer pattern in Java with thread safety.',
                      'Compare the Decorator Pattern with subclass inheritance in a beverage billing system.'
                    ],
                    aiPromptStarters: [
                      'Demonstrate SOLID principles with a real-world payment gateway example in Java',
                      'Explain Factory vs Abstract Factory design patterns with code comparisons',
                      'Refactor legacy spaghetti code into Strategy and Command patterns'
                    ]
                  },
                  {
                    id: 'mod_cs2022',
                    code: 'CS2022',
                    title: 'Operating Systems & Concurrency Architecture',
                    titleSinhala: 'මෙහෙයුම් පද්ධති හා සමගාමී ක්‍රියාවලි කළමනාකරණය',
                    credits: 3,
                    type: 'Core',
                    description: 'Kernel architectures, multi-threading, CPU scheduling algorithms, mutex locks, semaphores, deadlock avoidance (Banker’s algorithm), virtual memory paging, and Linux system calls.',
                    syllabusTopics: [
                      'Process Lifecycle, Context Switching & Inter-Process Communication (IPC)',
                      'Synchronization: Mutex, Counting Semaphores, Monitors, Race Conditions',
                      'Deadlock Characterization, Prevention & Banker’s Algorithm',
                      'Virtual Memory: Page Tables, TLB, Page Replacement Algorithms (LRU, Clock)'
                    ],
                    prescribedTextbooks: [
                      'Operating System Concepts by Silberschatz, Galvin, Gagne (The Dinosaur Book)',
                      'Modern Operating Systems by Andrew S. Tanenbaum'
                    ],
                    keyPrinciples: [
                      'Atomic operations in hardware (Test-and-Set / Compare-and-Swap)',
                      'The 4 Coffman conditions required for deadlock to occur',
                      'Thrashing phenomenon and Working Set Model in virtual memory'
                    ],
                    sampleQuestions: [
                      'Solve the Dining Philosophers synchronization problem using POSIX semaphores without deadlocks.',
                      'Calculate the effective memory access time given TLB hit ratio 95%, TLB lookup time 10ns, and main memory access 100ns.'
                    ],
                    aiPromptStarters: [
                      'Explain Banker’s Deadlock Avoidance Algorithm with step-by-step matrix allocation',
                      'How does POSIX sem_wait and sem_post work internally in the Linux kernel?',
                      'Compare Multi-level Feedback Queue (MLFQ) vs Round Robin CPU scheduling'
                    ]
                  }
                ]
              },
              {
                semesterNumber: 3,
                year: 2,
                sem: 1,
                code: 'Y2S1',
                label: 'Year 2 • Semester 1',
                modules: [
                  {
                    id: 'mod_cs3012',
                    code: 'CS3012',
                    title: 'Database Management Systems & Distributed Transactions',
                    titleSinhala: 'දත්ත සමුදාය පද්ධති හා විමසුම් ප්‍රශස්තීකරණය',
                    credits: 3,
                    type: 'Core',
                    description: 'Relational algebra, SQL normalization (1NF to BCNF), indexing (B+ Trees, Hashing), ACID transaction isolation levels, write-ahead logging (WAL), and distributed consensus.',
                    syllabusTopics: [
                      'Relational Schema Normalization: Functional Dependencies, 3NF, BCNF',
                      'Storage & Indexing: B+ Tree Insertion/Deletion, Hash Indexing',
                      'Transaction Concurrency: 2PL (Two-Phase Locking), MVCC, Isolation Levels',
                      'Query Processing: Join Algorithms (Nested Loop, Hash Join, Merge Join)'
                    ],
                    prescribedTextbooks: [
                      'Database System Concepts by Silberschatz, Korth, Sudarshan',
                      'Designing Data-Intensive Applications by Martin Kleppmann'
                    ],
                    keyPrinciples: [
                      'Strict 2-Phase Locking guarantees serializability and prevents cascading aborts',
                      'B+ tree depth balance and disk block I/O efficiency',
                      'Write-Ahead Logging (WAL) and ARIES recovery algorithm'
                    ],
                    sampleQuestions: [
                      'Normalize relation R(A, B, C, D, E) with FDs {A->BC, CD->E, B->D} to BCNF.',
                      'Explain how Multi-Version Concurrency Control (MVCC) prevents read locks in PostgreSQL.'
                    ],
                    aiPromptStarters: [
                      'Step-by-step normalization of complex database schemas into BCNF',
                      'Explain B+ Tree leaf node splitting and index traversal mechanics',
                      'Compare ACID vs BASE and the CAP Theorem in distributed databases'
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'deg_uom_entc',
            code: 'ENG-ENTC',
            title: 'B.Sc. (Hons) in Electronic & Telecommunication Engineering',
            titleSinhala: 'ඉලෙක්ට්‍රොනික හා විදුලි සංදේශ ඉංජිනේරු ගෞරව උපාධිය',
            shortTitle: 'Electronic & Telecom Eng',
            facultyName: 'Faculty of Engineering',
            durationYears: 4,
            totalCredits: 135,
            careerTracks: ['5G/6G Network Architect', 'RF & Antenna Engineer', 'Embedded IoT Systems Lead', 'Digital Signal Processing Scientist'],
            description: 'Covers RF wave propagation, fiber optics, embedded microcontrollers (ARM Cortex, FPGA), digital communication modulations (QAM, OFDM), and satellite networks.',
            iconName: 'Radio',
            colorTheme: 'from-indigo-600 to-purple-700',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Year 1 • Semester 1',
                modules: [
                  {
                    id: 'mod_en1022',
                    code: 'EN1022',
                    title: 'Signals & Systems Analysis (Fourier, Laplace, Z-Transform)',
                    titleSinhala: 'සංඥා හා පද්ධති විශ්ලේෂණය',
                    credits: 3,
                    type: 'Core',
                    description: 'Continuous and discrete time LTI systems, convolution integral, Fourier series, Fourier Transform, Laplace transform stability, and pole-zero diagrams.',
                    syllabusTopics: [
                      'LTI System Properties: Linearity, Time-Invariance, Causality, BIBO Stability',
                      'Continuous-Time Fourier Transform (CTFT) & Frequency Response',
                      'Laplace Transform: Region of Convergence (ROC) & Transfer Functions',
                      'Z-Transform & Discrete-Time Filter Design'
                    ],
                    prescribedTextbooks: [
                      'Signals and Systems (2nd Ed) by Alan V. Oppenheim, Alan S. Willsky'
                    ],
                    keyPrinciples: [
                      'Convolution in time domain equates to multiplication in frequency domain',
                      'BIBO stability requires all poles of H(s) to reside in the left-half s-plane',
                      'Nyquist-Shannon Sampling Theorem: f_s >= 2 * f_max'
                    ],
                    sampleQuestions: [
                      'Find the impulse response h(t) for system with transfer function H(s) = (s + 2) / (s^2 + 4s + 13).',
                      'Determine the CTFT of a rectangular pulse rect(t/T) and analyze its sinc spectral nulls.'
                    ],
                    aiPromptStarters: [
                      'Explain the derivation of the Fourier Transform from Fourier Series',
                      'How to determine BIBO stability from Laplace pole-zero plots',
                      'Explain Nyquist sampling rate and aliasing artifacts with mathematical proof'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'uoc',
    name: 'University of Colombo',
    shortName: 'UoC',
    nameSinhala: 'කොළඹ විශ්වවිද්‍යාලය',
    location: 'Cumaratunga Munidasa Mawatha, Colombo 03',
    logo: '🩺',
    badgeColor: 'from-emerald-600 to-teal-800',
    description: 'The oldest university in Sri Lanka, world-renowned for its prestigious Medical Faculty, Legal Studies, and University of Colombo School of Computing (UCSC).',
    website: 'https://cmb.ac.lk',
    isStateUni: true,
    faculties: [
      {
        id: 'uoc_med',
        name: 'Faculty of Medicine',
        nameSinhala: 'වෛද්‍ය පීඨය',
        shortCode: 'FOM',
        degrees: [
          {
            id: 'deg_uoc_mbbs',
            code: 'MED-MBBS',
            title: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
            titleSinhala: 'වෛද්‍ය හා ශල්‍ය වෛද්‍ය උපාධිය (MBBS)',
            shortTitle: 'Medicine (MBBS)',
            facultyName: 'Faculty of Medicine',
            durationYears: 5,
            totalCredits: 200,
            careerTracks: ['Medical Officer', 'Consultant Physician', 'General Surgeon', 'Clinical Researcher', 'Epidemiologist'],
            description: 'Comprehensive medical education covering Human Anatomy, Clinical Biochemistry, Physiology, Pathology, Pharmacology, Paediatrics, and Community Medicine.',
            iconName: 'Activity',
            colorTheme: 'from-emerald-600 to-teal-700',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Pre-Clinical • Year 1 (Anatomy, Physiology, Biochemistry)',
                modules: [
                  {
                    id: 'mod_med_anat',
                    code: 'ANAT101',
                    title: 'Gross Anatomy & Upper Limb / Thorax Neurovascular Anatomy',
                    titleSinhala: 'මිනිස් දේහ ව්‍යුහ විද්‍යාව (Gross Anatomy)',
                    credits: 6,
                    type: 'Core',
                    description: 'Osteology, muscle attachments, brachial plexus innervation, arterial branching of subclavian/axillary arteries, thoracic cage, mediastinum, and cardiac chambers.',
                    syllabusTopics: [
                      'Brachial Plexus: Roots, Trunks, Divisions, Cords and Terminal Branches',
                      'Axillary Artery: Relations, Branches & Anastomosis around Scapula',
                      'Mediastinum Divisions & Thoracic Duct Course',
                      'Coronary Arteries, Cardiac Valves & Conduction System'
                    ],
                    prescribedTextbooks: [
                      'Clinically Oriented Anatomy by Keith L. Moore',
                      'Grays Anatomy for Students by Richard Drake',
                      'Atlas of Human Anatomy by Frank H. Netter'
                    ],
                    keyPrinciples: [
                      'Klumpke’s paralysis (C8-T1) vs Erb’s palsy (C5-C6) root injuries',
                      'Left anterior descending (LAD) artery supplies anterior 2/3 of interventricular septum',
                      'Phrenic nerve (C3, 4, 5) keeps the diaphragm alive'
                    ],
                    sampleQuestions: [
                      'Describe the boundaries and contents of the cubital fossa, emphasizing clinical venepuncture anatomy.',
                      'Trace the course of the radial nerve through the spiral groove and explain the motor deficits in "wrist drop".'
                    ],
                    aiPromptStarters: [
                      'Explain the functional anatomy of the Brachial Plexus and clinical lesions',
                      'Step-by-step blood supply of the human heart and common MI coronary territories',
                      'Describe the anatomical structures pierced during an intercostal chest tube insertion'
                    ]
                  },
                  {
                    id: 'mod_med_phys',
                    code: 'PHYS101',
                    title: 'Cardiovascular & Respiratory Physiology',
                    titleSinhala: 'හෘද වාහිනී සහ ශ්වසන කායික විද්‍යාව',
                    credits: 6,
                    type: 'Core',
                    description: 'Cardiac cycle pressure-volume loops, Frank-Starling law, baroreceptor reflex, pulmonary ventilation-perfusion (V/Q) ratio, oxygen-hemoglobin dissociation curve, and arterial blood gas (ABG) mechanics.',
                    syllabusTopics: [
                      'Cardiac Action Potentials (Fast Response vs Slow Pacemaker SA Node)',
                      'Pressure-Volume Loops: Preload, Afterload, Contractility and Inotropy',
                      'Arterial Baroreflex & Renin-Angiotensin-Aldosterone System (RAAS)',
                      'O2-Hb Dissociation Curve: Bohr Effect, 2,3-DPG, Temperature and pH Shifts'
                    ],
                    prescribedTextbooks: [
                      'Guyton and Hall Textbook of Medical Physiology (14th Ed)',
                      'Ganong’s Review of Medical Physiology'
                    ],
                    keyPrinciples: [
                      'Frank-Starling Law: Force of contraction is proportional to initial resting sarcomere length',
                      'Rightward shift of O2-Hb curve facilitates tissue oxygen offloading during acidosis',
                      'V/Q mismatch is the most common cause of hypoxemia in pulmonary pathology'
                    ],
                    sampleQuestions: [
                      'Interpret an ABG showing pH 7.28, PaCO2 58 mmHg, and HCO3- 26 mmol/L.',
                      'Draw and label the left ventricular pressure-volume loop in aortic valve stenosis vs mitral regurgitation.'
                    ],
                    aiPromptStarters: [
                      'Explain the Wiggers diagram step-by-step with heart sounds and ECG correlation',
                      'How to systematically interpret arterial blood gas (ABG) reports in acid-base disorders',
                      'Explain the physiological compensation mechanisms in acute hypovolemic shock'
                    ]
                  }
                ]
              },
              {
                semesterNumber: 3,
                year: 2,
                sem: 1,
                code: 'Y2S1',
                label: 'Para-Clinical • Year 2 (Pathology & Pharmacology)',
                modules: [
                  {
                    id: 'mod_med_path',
                    code: 'PATH201',
                    title: 'General Pathology: Inflammation, Hemodynamics & Neoplasia',
                    titleSinhala: 'සාමාන්‍ය රෝග විද්‍යාව (General Pathology)',
                    credits: 5,
                    type: 'Core',
                    description: 'Cellular injury mechanisms, necrosis vs apoptosis, acute vs chronic inflammatory cascades, thrombosis (Virchow triad), hemodynamic shock, and hallmarks of malignant neoplasms.',
                    syllabusTopics: [
                      'Reversible vs Irreversible Cell Injury & Apoptotic Pathways',
                      'Acute Inflammation: Leukocyte Extravasation, Chemokines & Complement Cascades',
                      'Virchow’s Triad: Endothelial Injury, Stasis & Hypercoagulability',
                      'Molecular Hallmarks of Cancer: Oncogenes (KRAS, MYC) and Tumor Suppressors (TP53, RB)'
                    ],
                    prescribedTextbooks: [
                      'Robbins & Cotran Pathologic Basis of Disease (10th Ed) by Kumar, Abbas, Aster'
                    ],
                    keyPrinciples: [
                      'p53 protein "Guardian of the Genome" initiates cell cycle arrest or apoptosis upon DNA damage',
                      'Transudate vs Exudate differentiation via Light’s criteria in pleural effusions',
                      'Caseous necrosis as hallmark histopathology of Mycobacterium tuberculosis granulomas'
                    ],
                    sampleQuestions: [
                      'Differentiate between benign and malignant tumors based on microscopic histology and metastatic potential.',
                      'Outline the sequential events of leukocyte recruitment in acute inflammation.'
                    ],
                    aiPromptStarters: [
                      'Explain the intrinsic vs extrinsic pathways of apoptosis with caspase cascades',
                      'Break down the molecular biology of the 8 Hallmarks of Cancer',
                      'Describe the pathogenesis of atherosclerosis from fatty streak to plaque rupture'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'uoc_ucsc',
        name: 'School of Computing (UCSC)',
        nameSinhala: 'පරිගණක විද්‍යායතනය (UCSC)',
        shortCode: 'UCSC',
        degrees: [
          {
            id: 'deg_uoc_cs',
            code: 'UCSC-CS',
            title: 'B.Sc. (Hons) in Computer Science & Artificial Intelligence',
            titleSinhala: 'පරිගණක විද්‍යා හා කෘත්‍රිම බුද්ධි ගෞරව උපාධිය',
            shortTitle: 'Computer Science (UCSC)',
            facultyName: 'UCSC',
            durationYears: 4,
            totalCredits: 120,
            careerTracks: ['Full Stack Developer', 'Data Scientist', 'AI Researcher', 'Cloud Infrastructure Engineer'],
            description: 'Renowned computer science program focusing on modern software engineering, deep learning, cloud computing, and cybersecurity.',
            iconName: 'Binary',
            colorTheme: 'from-blue-600 to-indigo-800',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Year 1 • Semester 1',
                modules: [
                  {
                    id: 'mod_ucsc_algo',
                    code: 'SCS1201',
                    title: 'Data Structures and Algorithms Analysis',
                    titleSinhala: 'දත්ත ව්‍යුහ හා ඇල්ගොරිතම විශ්ලේෂණය',
                    credits: 3,
                    type: 'Core',
                    description: 'Graph algorithms (BFS, DFS, Dijkstra, Bellman-Ford), Minimum Spanning Trees (Kruskal, Prim), Dynamic Programming (Knapsack, LCS), and Greedy strategies.',
                    syllabusTopics: [
                      'Graph Representations: Adjacency List vs Adjacency Matrix',
                      'Shortest Path Algorithms: Dijkstra with Min-Heap, Bellman-Ford Negative Cycles',
                      'Dynamic Programming: Memoization vs Tabulation, 0/1 Knapsack, LCS, Matrix Chain',
                      'Greedy Choice Property: Huffman Coding, Fractional Knapsack, Activity Selection'
                    ],
                    prescribedTextbooks: [
                      'Introduction to Algorithms (CLRS)',
                      'Algorithm Design by Jon Kleinberg, Éva Tardos'
                    ],
                    keyPrinciples: [
                      'Optimal substructure and overlapping subproblems are the two hallmarks of DP',
                      'Dijkstra fails on graphs with negative edge weights; use Bellman-Ford in O(V*E)',
                      'Disjoint Set Union (DSU) with path compression yields near-constant O(α(V)) time'
                    ],
                    sampleQuestions: [
                      'Prove that the fractional knapsack problem possesses the greedy choice property.',
                      'Write the dynamic programming recurrence for the Longest Common Subsequence (LCS) problem and trace with example strings "BDCAB" and "ABCB".'
                    ],
                    aiPromptStarters: [
                      'Provide the Dynamic Programming table formulation for 0/1 Knapsack with C++ code',
                      'Explain Dijkstra’s algorithm step-by-step with priority queue complexity O((V+E)logV)',
                      'How to detect negative weight cycles using Bellman-Ford algorithm'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'usj',
    name: 'University of Sri Jayewardenepura',
    nameSinhala: 'ශ්‍රී ජයවර්ධනපුර විශ්වවිද්‍යාලය',
    shortName: 'USJ',
    location: 'Gangodawila, Nugegoda',
    logo: '💼',
    badgeColor: 'from-purple-600 to-indigo-800',
    description: 'The Center of Excellence in Management Education in Sri Lanka, producing top corporate leaders, chartered accountants, and finance executives.',
    website: 'https://www.sjp.ac.lk',
    isStateUni: true,
    faculties: [
      {
        id: 'usj_mgt',
        name: 'Faculty of Management Studies and Commerce',
        nameSinhala: 'කළමනාකරණ අධ්‍යයන හා වාණිජ විද්‍යා පීඨය',
        shortCode: 'FMSC',
        degrees: [
          {
            id: 'deg_usj_fin',
            code: 'MGT-FIN',
            title: 'B.Sc. (Hons) in Finance & Investment Banking',
            titleSinhala: 'මූල්‍ය හා ආයෝජන කළමනාකරණ ගෞරව උපාධිය',
            shortTitle: 'Finance & Banking',
            facultyName: 'Faculty of Management',
            durationYears: 4,
            totalCredits: 120,
            careerTracks: ['Investment Banker', 'Equity Research Analyst', 'Treasury Manager', 'Financial Risk Consultant', 'CFA Charterholder'],
            description: 'Advanced degree in corporate valuation, portfolio theory, derivatives (options & futures), Islamic banking, and financial econometrics.',
            iconName: 'TrendingUp',
            colorTheme: 'from-purple-600 to-indigo-700',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Year 1 • Semester 1',
                modules: [
                  {
                    id: 'mod_fin1320',
                    code: 'FIN1320',
                    title: 'Principles of Financial Management & Corporate Valuation',
                    titleSinhala: 'මූල්‍ය කළමනාකරණ මූලධර්ම හා සමාගම් ඇගයීම',
                    credits: 3,
                    type: 'Core',
                    description: 'Time value of money (TVM), discounted cash flow (DCF), Net Present Value (NPV), Internal Rate of Return (IRR), Capital Asset Pricing Model (CAPM), and Weighted Average Cost of Capital (WACC).',
                    syllabusTopics: [
                      'Time Value of Money: Annuities, Perpetuities, Effective Annual Rates (EAR)',
                      'Capital Budgeting Decisions: NPV vs IRR, Payback Period, Profitability Index',
                      'Risk and Return: Portfolio Variance, Beta Coefficient, Security Market Line (SML)',
                      'Cost of Capital: Cost of Equity via CAPM, Cost of Debt (after-tax), WACC Calculation'
                    ],
                    prescribedTextbooks: [
                      'Principles of Corporate Finance by Richard Brealey, Stewart Myers, Franklin Allen',
                      'Corporate Finance by Stephen Ross, Randolph Westerfield, Jeffrey Jaffe'
                    ],
                    keyPrinciples: [
                      'NPV is the gold standard capital budgeting metric due to its direct link to shareholder wealth creation',
                      'CAPM formula: E(R_i) = R_f + Beta_i * [E(R_m) - R_f]',
                      'Modigliani-Miller Theorem: Capital structure irrelevance under perfect frictionless markets'
                    ],
                    sampleQuestions: [
                      'Calculate the WACC for a company with 60% equity (Beta=1.2, Rf=8%, Rm=14%) and 40% debt (yield to maturity 10%, corporate tax rate 30%).',
                      'Explain why multiple IRRs can occur in non-conventional cash flow projects and why MIRR is preferred.'
                    ],
                    aiPromptStarters: [
                      'Step-by-step DCF valuation model with Free Cash Flow to Firm (FCFF) and WACC calculation',
                      'Explain the Capital Asset Pricing Model (CAPM) and Beta interpretation with practical examples',
                      'Compare NPV vs IRR under capital rationing scenarios'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'uop',
    name: 'University of Peradeniya',
    nameSinhala: 'පේරාදෙණිය විශ්වවිද්‍යාලය',
    shortName: 'UoP',
    location: 'Peradeniya, Kandy',
    logo: '🌿',
    badgeColor: 'from-amber-600 to-yellow-800',
    description: 'Renowned for its sprawling picturesque campus and internationally recognized faculties of Engineering, Agriculture, Science, Dental, and Arts.',
    website: 'https://www.pdn.ac.lk',
    isStateUni: true,
    faculties: [
      {
        id: 'uop_eng',
        name: 'Faculty of Engineering',
        nameSinhala: 'ඉංජිනේරු පීඨය',
        shortCode: 'FOE-PDN',
        degrees: [
          {
            id: 'deg_uop_mech',
            code: 'ENG-MECH',
            title: 'B.Sc. (Hons) in Mechanical & Manufacturing Engineering',
            titleSinhala: 'යාන්ත්‍රික හා නිෂ්පාදන ඉංජිනේරු ගෞරව උපාධිය',
            shortTitle: 'Mechanical Engineering',
            facultyName: 'Faculty of Engineering',
            durationYears: 4,
            totalCredits: 135,
            careerTracks: ['Automotive Engineer', 'HVAC Design Specialist', 'Aerospace Technologist', 'Robotics Designer'],
            description: 'Thermodynamics, fluid mechanics, finite element analysis (FEA), heat transfer, solid mechanics, and automated manufacturing systems.',
            iconName: 'Wrench',
            colorTheme: 'from-amber-600 to-orange-700',
            semesters: [
              {
                semesterNumber: 1,
                year: 1,
                sem: 1,
                code: 'Y1S1',
                label: 'Year 1 • Semester 1',
                modules: [
                  {
                    id: 'mod_me101',
                    code: 'ME101',
                    title: 'Engineering Thermodynamics & Applied Heat Transfer',
                    titleSinhala: 'ඉංජිනේරු තාපගති විද්‍යාව',
                    credits: 3,
                    type: 'Core',
                    description: '1st and 2nd Laws of Thermodynamics, Carnot efficiency, Otto/Diesel/Rankine power cycles, entropy generation, psychrometry, and conduction/convection heat transfer.',
                    syllabusTopics: [
                      'First Law for Control Volumes: Steady-Flow Energy Equation (SFEE)',
                      'Second Law: Clausius Inequality, Entropy Generation, Carnot Cycle',
                      'Gas Power Cycles: Air-Standard Otto, Diesel, and Dual Combustion Cycles',
                      'Vapor Power: Rankine Cycle with Superheat and Reheat Modifications'
                    ],
                    prescribedTextbooks: [
                      'Thermodynamics: An Engineering Approach by Yunus A. Çengel, Michael A. Boles'
                    ],
                    keyPrinciples: [
                      'SFEE: Q - W = m_dot * [ (h2 - h1) + (V2^2 - V1^2)/2 + g(z2 - z1) ]',
                      'Carnot Efficiency = 1 - (T_L / T_H) representing the theoretical maximum limit',
                      'Isentropic expansion through an ideal steam turbine produces maximum shaft power'
                    ],
                    sampleQuestions: [
                      'A steam power plant operates on an ideal Rankine cycle between 6 MPa (450°C) and 10 kPa. Calculate thermal efficiency and net power output for 20 kg/s mass flow.',
                      'Derive the thermal efficiency expression for an air-standard Otto cycle with compression ratio r.'
                    ],
                    aiPromptStarters: [
                      'Step-by-step Rankine Cycle thermodynamic calculation with T-s and h-s diagrams',
                      'Derive thermal efficiency for Otto vs Diesel cycle with compression ratio graphs',
                      'Explain conduction, convection and radiation Fourier equations with boundary conditions'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const UNIVERSITY_RESOURCES_DATA: UniversityResource[] = [
  {
    id: 'res_1',
    title: 'CS1032 Data Structures in C++ Comprehensive Lecture Notes & Memory Diagrams',
    degreeCode: 'ENG-CSE',
    moduleCode: 'CS1032',
    type: 'Lecture Notes',
    author: 'Dept of CSE, University of Moratuwa',
    uploadDate: '2026-08-15',
    fileSize: '4.8 MB',
    downloadCount: 1420,
    rating: 4.95
  },
  {
    id: 'res_2',
    title: 'ANAT101 Brachial Plexus & Upper Limb Neurovascular Cadaveric Guide',
    degreeCode: 'MED-MBBS',
    moduleCode: 'ANAT101',
    type: 'Lecture Notes',
    author: 'Faculty of Medicine, University of Colombo',
    uploadDate: '2026-08-10',
    fileSize: '12.4 MB',
    downloadCount: 2310,
    rating: 4.98
  },
  {
    id: 'res_3',
    title: 'FIN1320 Corporate Valuation & DCF Financial Modeling Template Excel',
    degreeCode: 'MGT-FIN',
    moduleCode: 'FIN1320',
    type: 'Assignment Guide',
    author: 'Dept of Finance, USJ',
    uploadDate: '2026-08-04',
    fileSize: '2.1 MB',
    downloadCount: 980,
    rating: 4.88
  },
  {
    id: 'res_4',
    title: 'SCS1201 UCSC Algorithms Past Semester Final Examination Papers & Marking Schemes (2020-2024)',
    degreeCode: 'UCSC-CS',
    moduleCode: 'SCS1201',
    type: 'Past Exam Paper',
    author: 'UCSC Student Union Academic Board',
    uploadDate: '2026-08-01',
    fileSize: '8.6 MB',
    downloadCount: 3100,
    rating: 4.97
  }
];
