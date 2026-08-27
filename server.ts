import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini Client Initialization
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      platform: 'SipArana LK Full-Stack Ecosystem'
    });
  });

  // Comprehensive Educational AI Core Endpoint (6 Core Functionalities)
  app.post('/api/gemini/educational-core', async (req, res) => {
    try {
      const {
        feature, // 'content_quiz' | 'multi_format' | 'doc_analyzer' | 'mindmap_diagram' | 'model_paper' | 'essay_evaluator'
        inputContent,
        grade,
        stream,
        subject,
        targetTier, // 'grade_5' | 'gce_ol' | 'gce_al' | 'university'
        language = 'auto',
        additionalParams = {}
      } = req.body;

      if (!inputContent && feature !== 'model_paper') {
        return res.status(400).json({ error: 'Input content or topic is required' });
      }

      const ai = getGeminiClient();

      // Build specialized system instructions based on feature & grade
      const isGrade5 = targetTier === 'grade_5' || grade === 5 || grade === '5' || stream?.toLowerCase().includes('scholarship');
      const isUniversity = targetTier === 'university' || stream?.toLowerCase().includes('university') || grade === 'university';

      let rolePersona = '';
      if (isGrade5) {
        rolePersona = `You are "Kavi the Owl" (කවි බකමූණා 🦉), the encouraging primary school AI educator for Grade 5 Sri Lankan Scholarship students. Use simple, gentle, encouraging language (Sinhala/English/Tamil), step-by-step clarity, and zero confusing academic jargon.`;
      } else if (isUniversity) {
        rolePersona = `You are "SipArana University AI Core", an advanced academic research and higher education pedagogical AI tailored for Sri Lankan university undergraduates and postgraduates across Engineering, Medicine, IT, Management, and Science. Provide mathematically and scientifically rigorous, citation-backed analyses.`;
      } else {
        rolePersona = `You are "SipArana National Curriculum AI Core", expert educator aligned with the Sri Lankan Ministry of Education & National Institute of Education (NIE Guru Potha) for G.C.E. O/L and G.C.E. A/L (Physical Science, Bio, Commerce, Arts, Technology).`;
      }

      let taskPrompt = '';
      let formatExpectations = '';

      switch (feature) {
        case 'content_quiz': {
          const subType = additionalParams.subType || 'all'; // 'summary' | 'flashcards' | 'mcq' | 'all'
          taskPrompt = `TASK: AUTOMATED CONTENT & QUIZ GENERATION
Input Lesson / Topic: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Stream: ${stream || 'General'} | Subject: ${subject || 'General'}

Generate the following according to requested subType (${subType}):
1. STRUCTURED SUMMARY:
   - Clear headings, bold key concepts, bullet points, and essential definitions.
2. INTERACTIVE FLASHCARDS (At least 5 high-yield cards):
   - Front: Precise Question / Formula / Concept
   - Back: Clear Definition / Derivation / Key Explanation
3. HIGH-QUALITY MCQs (At least 4-5 exam-grade questions):
   - 4 distinct options (A, B, C, D)
   - State the Correct Answer clearly
   - Provide a detailed step-by-step Explanation referencing curriculum concepts / formulas.`;
          formatExpectations = `Format with standard markdown, bold highlights, clean codeblocks if math/code, and clear demarcations between Summary, Flashcards, and MCQs.`;
          break;
        }

        case 'multi_format': {
          const targetFormat = additionalParams.targetFormat || 'all'; // 'plain_text' | 'audio_script' | 'video_script' | 'all'
          taskPrompt = `TASK: MULTI-FORMAT CONTENT ADAPTATION
Input Lesson / Material: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Subject: ${subject || 'General'}

Convert this lesson into the requested format(s) (${targetFormat}):
1. PLAIN TEXT STUDY NOTES:
   - Well-structured hierarchical notes with clear headings, bullet points, and memory mnemonics.
2. CONVERSATIONAL AUDIO SCRIPT (For TTS Voiceover Engines):
   - Natural, engaging, spoken-word cadence with audio cues like [Warm Greeting], [Pause for reflection], [Emphasis on key term], [Recap].
3. SHORT VIDEO SCRIPT (For Educational Reels / TikTok / YouTube Shorts):
   - Scene-by-scene script with exact timestamps (e.g. 0:00-0:05), Visual cues & on-screen text graphics, and energetic Narration/Voiceover lines.`;
          formatExpectations = `Use distinct markdown sections for each format with clean spacing.`;
          break;
        }

        case 'doc_analyzer': {
          const docType = additionalParams.docType || 'Chapter Document / Lecture Slides / Research Paper';
          taskPrompt = `TASK: DOCUMENT & PDF ANALYZER
Document Type: ${docType}
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L or University'} | Subject: ${subject || 'General'}
Document Content:
"""
${inputContent}
"""

Perform a deep academic extraction:
1. EXECUTIVE SUMMARY & CORE ARGUMENTS (The fundamental thesis and findings).
2. KEY METHODOLOGIES & THEORETICAL PRINCIPLES (Formulas, scientific mechanisms, algorithms, or historical contexts).
3. HIGH-YIELD Q&A PAIRS (5 critical exam-targeted questions extracted directly from this text with rigorous answers).
4. QUICK REVISION BULLET POINTS (Must-remember facts for rapid pre-exam recall).`;
          formatExpectations = `Ensure academic rigor, accurate formulas, and structured markdown bullet points.`;
          break;
        }

        case 'mindmap_diagram': {
          taskPrompt = `TASK: VISUAL MIND MAP & DIAGRAM CONCEPT GENERATOR
Topic / Concept: "${inputContent}"
Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'} | Subject: ${subject || 'General'}

Generate:
1. MERMAID.JS MINDMAP CODE:
   - Provide a valid \`\`\`mermaid graph TD or mindmap code block showing hierarchical relationships from core concept to sub-topics to key terms.
2. TEXTUAL HIERARCHICAL NODE TREE (Markdown Tree with └── and ├── characters).
3. STEP-BY-STEP VISUAL DIAGRAM DRAWING GUIDE:
   - Instructions on how a student should sketch or visualize this on paper (e.g. Center Circle, Branch 1 with color code, Branch 2 with formula box, Memory Anchors).`;
          formatExpectations = `Ensure valid Mermaid syntax and clear visual drawing steps.`;
          break;
        }

        case 'model_paper': {
          const examStandard = additionalParams.examStandard || (isGrade5 ? 'Grade 5 Scholarship' : isUniversity ? 'University Semester Exam' : 'G.C.E. A/L');
          const paperSection = additionalParams.paperSection || 'Full Model Paper';
          taskPrompt = `TASK: EXAM & MODEL PAPER GENERATION
Target Exam Standard: ${examStandard}
Subject: ${subject || inputContent} | Stream: ${stream || 'General'} | Grade: ${grade || 12}
Topic/Scope: "${inputContent || subject}"

Generate an authentic, curriculum-aligned Model Examination:
1. SECTION 1: QUESTION PAPER
   - Multiple Choice Questions (MCQ) or Structured Essay Questions styled exactly after official Sri Lankan Department of Examinations / University past papers.
   - Allocated marks for each part (e.g., [02 Marks], [05 Marks], Total [20 Marks]).
2. SECTION 2: OFFICIAL MARKING SCHEME & ANSWER KEY
   - Step-by-step point allocation (e.g., 1 mark for formula, 2 marks for substitution, 1 mark for final answer with correct SI units).
   - Expected keywords and alternative acceptable answers.`;
          formatExpectations = `Follow authentic Sri Lankan examination formatting with clear point allocations.`;
          break;
        }

        case 'essay_evaluator': {
          const question = additionalParams.questionPrompt || 'Explain the core principles and significance of the given topic.';
          const maxMarks = additionalParams.maxMarks || 20;
          taskPrompt = `TASK: ESSAY & ANSWER FEEDBACK EVALUATOR
Subject: ${subject || 'General'} | Target Level: ${grade ? `Grade ${grade}` : targetTier || 'A/L'}
Question / Assignment Prompt:
"${question}"
Max Marks: ${maxMarks}

Student's Submitted Answer:
"""
${inputContent}
"""

Evaluate the student's answer with high academic fidelity:
1. 📊 ESTIMATED SCORE & GRADING: Give a realistic mark out of ${maxMarks} (e.g., 15/${maxMarks}) with percentage and grade tier.
2. 🌟 KEY STRENGTHS: Specific well-explained points, correct terminology, and good reasoning demonstrated.
3. ⚠️ AREAS FOR IMPROVEMENT & MISSING POINTS: Critical omissions, factual ambiguities, incorrect steps, or lack of diagrams/examples.
4. ✍️ REWRITTEN MODEL SAMPLE ANSWER (100% Full-Marks Benchmark): A complete, well-structured, exemplary answer showing exactly how to score full marks in the exam.`;
          formatExpectations = `Provide constructive, motivating, yet academically honest evaluation in clean markdown.`;
          break;
        }

        default:
          taskPrompt = `Analyze and provide educational guidance on: "${inputContent}" for Grade ${grade || '12'} in ${subject || 'General'}.`;
      }

      const operationalRule = `OPERATIONAL RULES:
- Language: Respond in the exact language requested or used in the input (Sinhala, English, or Singlish/Bilingual).
- Grade-Adaptive Intelligence: Match cognitive depth to ${isGrade5 ? 'Grade 5 Primary' : isUniversity ? 'University Rigor' : 'G.C.E. Secondary/Higher Secondary'}.
- Formatting: Use pristine Markdown typography with clear bold terms, numbered lists, and bullet points.`;

      const fullSystemInstruction = `${rolePersona}\n\n${operationalRule}`;

      if (!ai) {
        // High fidelity offline fallback response tailored to the feature
        const fallbackData = generateEducationalCoreFallback(feature, inputContent, {
          grade,
          stream,
          subject,
          targetTier,
          additionalParams
        });
        return res.json({
          text: fallbackData,
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${taskPrompt}\n\n${fullSystemInstruction}` }]
          }
        ],
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.6,
        }
      });

      return res.json({
        text: response.text || 'Unable to generate response',
        isFallback: false
      });
    } catch (error: any) {
      console.error('Educational AI Core Error:', error);
      return res.status(500).json({
        error: error.message || 'Error processing request',
        text: `### ⚠️ Educational AI Core Error\n\n${error.message || 'An error occurred while generating study assets.'}\n\nPlease verify your input and try again.`
      });
    }
  });

  // Offline Fallback Generator for the 6 Core Functionalities
  function generateEducationalCoreFallback(feature: string, inputContent: string, ctx: any): string {
    const subj = ctx.subject || 'National Curriculum';
    const grade = ctx.grade || 12;

    switch (feature) {
      case 'content_quiz':
        return `### 📚 Automated Content & Quiz Pack (සිප්අරණ ස්මාර්ට් සටහන් සහ ප්‍රශ්නාවලිය)

**Topic:** ${inputContent} | **Subject:** ${subj} • Grade ${grade}

---

#### 1. 📌 Structured Summary (සාරාංශය)
* **Core Concept:** **${inputContent}** is a fundamental curriculum milestone in Sri Lankan ${subj} education.
* **Key Principles:**
  * Understand the **theoretical definitions** and foundational axioms.
  * Pay strict attention to **standard units, mathematical equations**, and real-world applications.
  * Familiarize with past paper recurring patterns across 2018–2024.

---

#### 2. 🗂️ Interactive Flashcards (මතක කාඩ්පත්)
* **Card 1 (Front):** What is the primary definition of ${inputContent}?
  * **(Back):** The scientifically verified mechanism describing ${inputContent} according to official NIE Guru Potha standards.
* **Card 2 (Front):** What are the key variables / formulas involved?
  * **(Back):** State standard mathematical or scientific equations with correct SI units.
* **Card 3 (Front):** How does this principle apply to real-world exam problems?
  * **(Back):** Applying step-by-step substitution, boundary condition checks, and graphical representations.

---

#### 3. 🎯 High-Quality MCQs (බහුවරණ ප්‍රශ්නාවලිය)
**Q1.** Which of the following statements is **most accurate** regarding ${inputContent}?
- A) It remains constant under all thermodynamic conditions.
- B) It directly satisfies the fundamental conservation laws of the syllabus. *(Correct)*
- C) It only applies to non-linear macroscopic states.
- D) It violates standard SI unit dimensional analysis.

* **Correct Answer:** **B**
* **Explanation:** In official syllabus benchmarks, this concept directly stems from fundamental conservation laws and standard syllabus unit definitions.`;

      case 'multi_format':
        return `### 🎙️ Multi-Format Content Adaptation (බහු-ආකෘති පාඩම් පරිවර්තනය)

**Topic:** ${inputContent} | **Level:** Grade ${grade} ${subj}

---

#### 📝 1. Plain Text Study Notes
# ${inputContent} — Complete Revision Notes
* **Overview:** A core pillar of the ${subj} syllabus designed for quick retention.
* **Key Steps:**
  1. Define the fundamental law with exact terminology.
  2. Write the core formula and label all symbols.
  3. Note common examiner traps from recent past paper marking schemes.

---

#### 🎧 2. Conversational Audio Script (For TTS Voiceover)
*[Warm, encouraging tone]*
"Hello students! Welcome back to your SipArana audio recap. Today, we're locking down **${inputContent}** in under 2 minutes. 
[Short pause]
Remember, whenever you encounter this in your exam paper, first identify the given variables. 
[Emphasis] **Focus on the core formula and never forget your units!** 
Let's keep your revision strong and ace that upcoming paper!"

---

#### 🎬 3. Short Video Script (Reels / TikTok / Shorts)
* **[0:00 - 0:05] Hook:** *Text on screen with flashing glow:* "Stop making this mistake in ${inputContent}!"
* **[0:05 - 0:25] Core Breakdown:** *Show dynamic visual diagram splitting into 3 key bullet points while narrator explains the main formula.*
* **[0:25 - 0:50] Exam Hack:** *Highlight a recurring 2024 past paper trick on screen with a green checkmark on the correct method.*
* **[0:50 - 0:60] Call to Action:** "Save this reel and test your score on SipArana AI Tutor!"`;

      case 'doc_analyzer':
        return `### 📑 Document & PDF Deep Analysis Report

**Analyzed Source:** ${inputContent}
**Target Standard:** Grade ${grade} / University Level ${subj}

---

#### 1. 🔍 Executive Summary & Core Arguments
* **Central Thesis:** The document establishes the critical framework governing ${inputContent}, aligning directly with advanced curriculum benchmarks.
* **Key Takeaway:** Mastery requires combining foundational theoretical proof with practical problem-solving applications.

---

#### 2. ⚙️ Methodologies & Theoretical Principles
* **Formulas / Models:** Direct application of standard curriculum theorems.
* **System Boundaries:** Analysis of input constraints, assumptions, and validation criteria.

---

#### 3. ❓ High-Yield Q&A Pairs
* **Q1:** What is the primary theoretical justification provided in the document?
  * **A1:** The document cites official experimental observations and standard scientific consensus.
* **Q2:** How does this apply to structured examination questions?
  * **A2:** By structuring answers into: (i) Theory definition, (ii) Mathematical derivation, (iii) Final unit check.

---

#### 4. ⚡ Quick Revision Points
* Always quote standard scientific laws accurately.
* Check dimensional homogeneity in derivations.
* Review the marking scheme criteria for maximum point capture.`;

      case 'mindmap_diagram':
        return `### 🧠 Visual Mind Map & Concept Blueprint

**Topic:** ${inputContent} | **Subject:** ${subj}

---

#### 1. 📊 Mermaid.js Mind Map Code
\`\`\`mermaid
graph TD
    Root["${inputContent}"] --> B1["Core Principles & Definitions"]
    Root --> B2["Mathematical Formulas & Laws"]
    Root --> B3["Exam Applications & Past Papers"]
    
    B1 --> B1_1["Key Terms & SI Units"]
    B1 --> B1_2["Assumptions & Conditions"]
    
    B2 --> B2_1["Derivations"]
    B2 --> B2_2["Calculations & Graphs"]
    
    B3 --> B3_1["Common Pitfalls"]
    B3 --> B3_2["Marking Scheme Keys"]
\`\`\`

---

#### 2. 🌳 Hierarchical Node Tree
\`\`\`text
${inputContent}
├── 📌 Core Principles & Definitions
│   ├── Key Terms & SI Units
│   └── Assumptions & Conditions
├── 📐 Mathematical Formulas & Laws
│   ├── Step-by-Step Derivations
│   └── Graph Sketches & Curves
└── 🎯 Exam Applications
    ├── Common Marking Traps
    └── Model Answer Templates
\`\`\`

---

#### 3. 🎨 Visual Diagram Drawing Guide (How to Sketch on Paper)
1. **Central Anchor (Circle in Blue):** Draw a circle in the center of your page labeled **${inputContent}**.
2. **Branch 1 (Top Right in Green):** Draw arrows to the 2 foundational laws.
3. **Branch 2 (Bottom Right in Orange):** Create a box for the main equation with units highlighted in yellow.
4. **Branch 3 (Left in Red):** List 3 common exam traps to avoid when writing answers under time pressure.`;

      case 'model_paper':
        return `### 📜 Model Examination Paper & Official Marking Scheme

**Examination Standard:** Sri Lankan National Curriculum Model Paper
**Subject:** ${subj} | **Grade:** ${grade} | **Topic:** ${inputContent}

---

### SECTION I: QUESTION PAPER
**Time Allowed:** 45 Minutes | **Total Marks:** 25 Marks

**Question 01 (Structured Question):**
(a) State the fundamental definition of **${inputContent}**. [03 Marks]  
(b) Write the standard mathematical expression associated with this concept and identify all symbols with their SI units. [04 Marks]  
(c) A student performs an experiment under standard conditions. Explain with a brief diagram how the result is affected if the primary variable is doubled. [08 Marks]  

---

### SECTION II: OFFICIAL MARKING SCHEME & ANSWER KEY
* **Q1 (a):**
  * Stating correct definition: **[02 Marks]**
  * Mentioning standard boundary condition: **[01 Mark]**
* **Q1 (b):**
  * Correct formula written: **[02 Marks]**
  * All symbols accurately identified with SI units: **[02 Marks]**
* **Q1 (c):**
  * Clear, labeled sketch/diagram: **[03 Marks]**
  * Explaining linear/proportional relationship: **[03 Marks]**
  * Final conclusion with correct reasoning: **[02 Marks]**
  * *Total: [25 Marks]*`;

      case 'essay_evaluator':
        return `### ✍️ Essay & Written Answer Evaluation Report

**Subject:** ${subj} • Grade ${grade}
**Evaluated Input:** "${inputContent.substring(0, 100)}..."

---

#### 📊 1. Estimated Score & Grade
* **Estimated Score:** **16 / 20 Marks** (80% — Distinction Grade A)
* **Marking Criteria Alignment:** Strong adherence to NIE Guru Potha standards with minor point gaps.

---

#### 🌟 2. Key Strengths
* Clear, well-articulated opening definition with appropriate subject terminology.
* Good structural organization with logical paragraph transitions.
* Accurate mention of primary scientific / theoretical principles.

---

#### ⚠️ 3. Areas for Improvement & Missing Points
* Missing specific SI units in the numerical/contextual calculation.
* A small schematic diagram would have elevated this answer to a full 20/20.
* Ensure conclusion ties directly back to practical real-world implications in Sri Lanka.

---

#### ✍️ 4. Rewritten Model Sample Answer (Full Marks 20/20)
> **Exemplary Answer Structure:**
> "${inputContent} fundamentally represents a core milestone in ${subj}. According to standard curriculum guidelines, this operates under the conservation principles where all boundary parameters remain strictly quantified. In examination settings, presenting this with a labeled schematic diagram and citing SI units ensures complete mark allocation across all structured marking rubrics."`;

      default:
        return `### 🎓 SipArana Educational AI Core\n\nAnalysis completed for **${inputContent}** in ${subj}.`;
    }
  }

  // AI Degree Study Assistant API Endpoint
  app.post('/api/gemini/degree-assistant', async (req, res) => {
    try {
      const {
        prompt,
        university,
        faculty,
        degreeProgramme,
        semester,
        moduleCode,
        moduleName,
        contextMode,
        history,
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are "SipArana Academic AI" (සිප්අරණ සරසවි අධ්‍යයන සහකාර), the specialized University Degree & Higher Education Study Assistant for undergraduate and postgraduate students in Sri Lanka.

Target Student Context:
- University: ${university || 'Sri Lankan University (e.g. UoM, UoC, UoP, USJ, UoK, UoR)'}
- Faculty: ${faculty || 'General Academic Faculty'}
- Degree Programme: ${degreeProgramme || 'Undergraduate Degree'}
- Academic Semester: ${semester || 'Current Semester'}
- Course Module: ${moduleCode ? `${moduleCode} - ${moduleName}` : 'General Degree Subject'}
- Assistant Mode: ${contextMode || 'General Academic Explainer'}

Your Goals & Guidelines:
1. Provide mathematically rigorous, academically accurate, and clear explanations tailored specifically to university-level curriculum in Sri Lanka and international university standards.
2. If Mode is 'concept': Break down theories, foundational principles, real-world engineering/medical/management applications, step-by-step mathematical proofs or conceptual intuition.
3. If Mode is 'code': Provide clean, well-commented, best-practice code with algorithmic complexity analysis (Big-O), test edge cases, and architectural explanation.
4. If Mode is 'research': Provide structured academic literature summaries, research methodology guidance, thesis hypothesis formulation, and proper IEEE/APA/Harvard citation guidance.
5. If Mode is 'examprep': Generate university-standard model questions with structured marking schemes, high-yield revision summaries, and key formula cheat-sheets.
6. If Mode is 'assignment': Guide the student step-by-step through the problem-solving thought process, logic verification, and concept clarity (without generating blind copy-paste plagiarism).
7. Language Style: Academic English mixed with clear Sinhala explanations (ද්විභාෂික විශ්වවිද්‍යාල ශෛලිය) where helpful, maintaining professional composure.
8. Structure your response using markdown with clear headings, bullet points, latex equations or code blocks where appropriate.`;

      if (!ai) {
        // High quality informative response when API key is pending configuration
        return res.json({
          text: `### 🎓 SipArana University Academic AI Assistant\n\n**Module Context:** ${moduleCode || 'General'} • ${moduleName || degreeProgramme || 'Degree Module'}\n**Mode:** ${contextMode || 'Concept Explainer'}\n\n*Note: Running in offline academic preview mode. Configure \`GEMINI_API_KEY\` in Settings > Secrets for live dynamic responses.*\n\n#### 📌 Key Academic Insights on "${prompt}":\n1. **Theoretical Foundation:** In university curricula (such as ${university || 'State Universities'}), this topic forms a cornerstone for higher-level research and industry applications.\n2. **Key Formulas & Principles:** Ensure you understand the underlying derivations, boundary conditions, and real-world system constraints.\n3. **Exam & Assignment Strategy:** Focus on past semester exam patterns, structural proofs, and clear step-by-step algorithmic or numerical calculations.\n4. **Recommended References:** Consult standard prescribed university textbooks (e.g., IEEE journals, standard faculty lecture notes, and recommended reference manuals).\n\n💡 *Tip: Select specific degree modules from the curriculum sidebar to receive tailored problem sets!*`,
          isFallback: true
        });
      }

      // Format conversation contents for Gemini
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const generatedText = response.text || 'Unable to generate response at this time.';

      return res.json({
        text: generatedText,
        isFallback: false
      });
    } catch (error: any) {
      console.error('Gemini Degree Assistant Error:', error);
      return res.status(500).json({
        error: error.message || 'Internal server error processing degree assistant query',
        text: `### ⚠️ Study Assistant Temporary Notice\n\nWe encountered a server error while analyzing your degree module query: ${error.message || 'Unknown error'}.\n\nPlease retry in a moment.`
      });
    }
  });

  // General School Level AI Tutor Endpoint (for Grade 5 Scholarship & Grades 6-13)
  app.post('/api/gemini/school-tutor', async (req, res) => {
    try {
      const { prompt, grade, subject, stream, medium, history } = req.body;
      const ai = getGeminiClient();

      const isGrade5 = grade === 5 || grade === '5' || stream === 'Grade 5 Scholarship' || subject?.toLowerCase().includes('scholarship') || subject?.toLowerCase().includes('ශිෂ්‍යත්ව');

      let systemInstruction = '';

      if (isGrade5) {
        systemInstruction = `You are "Kavi the Owl" (කවි බකමූණ යාළුවා 🦉), the cheerful, encouraging, and friendly cartoon mascot & AI tutor for Grade 5 Sri Lankan Scholarship (5 වසර ශිෂ්‍යත්වය) children.

Target Child Context:
- Grade: 5 ශ්‍රේණිය (Grade 5 Scholarship Exam)
- Subject: ${subject || 'සිංහල, ගණිතය, පරිසරය හෝ බුද්ධි පරීක්ෂණය (Grade 5 Core)'}
- Curriculum: Sri Lanka National Institute of Education (NIE) Guru Potha (ගුරු මාර්ගෝපදේශ සංග්‍රහය).
- Medium: ${medium || 'Sinhala'}

Your Core Instructions for Grade 5 Children:
1. Tone & Vocabulary: Speak in very simple, gentle, cheerful, and encouraging Sinhala (හරිම සරල, මිත්‍රශීලී සිංහලෙන්) using clear Sinhala letters appropriate for a 10-year-old child.
2. Step-by-Step Guidance: Break down explanations into simple, easy-to-follow steps (පියවර 1, පියවර 2) with friendly explanations and smiling emojis (🦉, 🌟, ✨, 🎈, 🏆, 📖, 🔢).
3. Core Curriculum Mastery:
   - සිංහල (Sinhala): ව්‍යාකරණ (ණ/න, ළ/ල, ශ/ෂ/ස නිවැරදි අක්ෂර වින්‍යාසය), සමාන පද, විරුද්ධ පද, ප්‍රස්ථාව පිරුළු, කෙටි ඡේද කියවා තේරුම් ගැනීම.
   - ගණිතය (Mathematics): සරල කෙටි ක්‍රම (Short tricks), සංඛ්‍යා රටා, මුදල්, කාලය, දිග/බර/පරිමාව, වාචික ගැටලු ලේසියෙන් හදන හැටි.
   - පරිසරය (Environmental Studies): ශාක හා සත්ත්ව ලෝකය, ශ්‍රී ලංකාවේ ජාතික සංකේත, සෞඛ්‍ය පුරුදු, අපේ පරිසරය, ප්‍රවාහනය හා ඉතිහාසය.
   - බුද්ධි පරීක්ෂණය (IQ & Reasoning - Paper 1): රූප රටා, සැඟවුණු කැට ගණන් කිරීම, කඩදාසි නැමීම් හා කැපුම්, දර්පණ ප්‍රතිබිම්බ, තාර්කික ප්‍රශ්න.
4. Praise & Encouragement: Always start or conclude with warm praise (e.g., "හරිම දක්ෂයි පුංචි යාළුවේ! 🌟", "අපි එකතු වෙලා මේක ලේසියෙන්ම විසඳමු!").
5. Strict Isolation: NEVER mention university concepts, complex formulas, calculus, or advanced terminology. Keep everything colorful, playful, and easy for primary school children.`;
      } else {
        systemInstruction = `You are "SipArana Guru Bot & Media Assistant" (සිප්අරණ ගුරු සහකාර සහ මාධ්‍ය අධ්‍යයන සහකාර), the expert AI educator for Sri Lanka's National Curriculum (NIE Guru Potha / ගුරු මාර්ගෝපදේශ සංග්‍රහය).
Target Context:
- Grade: ${grade || 'Grade 12/13 (A/L)'}
- Subject: ${subject || 'Communication and Media Studies (සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය)'}
- Stream: ${stream || 'Arts / Media Stream'}
- Preferred Medium: ${medium || 'Sinhala, Tamil, or English depending on user question'}

Specialized Domain Expertise:
1. A/L Communication & Media Studies (සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය / தொடர்பாடலும் ஊடகக் கற்கையும்):
   - Communication Models & Theories: Harold Lasswell, Shannon-Weaver, David Berlo, Wilbur Schramm, Semiotics.
   - Cinema & Film History: Sri Lankan and World cinema milestones.
   - Film Language, Print Journalism, Broadcasting Arts, Photography.
2. General National Curriculum: Combined Maths, Physics, Chemistry, Biology, Commerce/Economics, ICT, History, Languages.
3. Guidelines:
   - Provide answers in the requested language (Sinhala, Tamil, or English).
   - Use clear markdown with headings, bullet points, and exam mnemonics.
   - Reference previous A/L & O/L past paper marking schemes and NIE Teacher Guides.`;
      }

      if (!ai) {
        if (isGrade5) {
          const fallbackText = `### 🦉 කවි බකමූණ යාළුවාගේ ශිෂ්‍යත්ව මඟපෙන්වීම!\n\n**විෂය:** ${subject || '5 වසර ශිෂ්‍යත්වය (Grade 5)'}\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 🌟 පුංචි යාළුවාට පියවරෙන් පියවර සරල පැහැදිලි කිරීම:\n1. **පළමු පියවර (Step 1):** ප්‍රශ්නය හොඳින් කියවන්න. ප්‍රශ්නයේ අහන්නේ මොකක්ද කියලා තේරුම් ගනිමු.\n2. **දෙවන පියවර (Step 2):** අපි ඉගෙන ගත්තු සරල උපක්‍රමය හෝ ගුරු පොතේ (Guru Potha) ක්‍රමය භාවිත කරමු.\n3. **කවි යාළුවාගේ රහස් ඉඟිය (Kavi's Tip):** 5 වසර ශිෂ්‍යත්ව විභාගයේදී කලබල නොවී සන්සුන්ව ප්‍රශ්නයට පිළිතුරු සපයන්න. ඔබ හරිම දක්ෂයි! 🏆\n\n✨ *කවි බකමූණා සැමවිටම ඔබ සමඟයි! තවත් ඕනෑම ප්‍රශ්නයක් මගෙන් අහන්න පුංචි පැටියෝ!*`;
          return res.json({ text: fallbackText, isFallback: true });
        }

        const isMedia = subject?.toLowerCase().includes('media') || prompt?.toLowerCase().includes('media') || prompt?.toLowerCase().includes('film') || prompt?.toLowerCase().includes('lasswell') || prompt?.toLowerCase().includes('cinema') || prompt?.toLowerCase().includes('journalism');
        
        const fallbackText = isMedia
          ? `### 🎬 සිප්අරණ මාධ්‍ය අධ්‍යයන සහකාර (A/L Media Studies AI Guide)\n\n**විෂය:** සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය (Communication & Media Studies)\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 📌 ප්‍රධාන විභාග කරුණු (Core Syllabus Concept):\n1. **මූලික සිද්ධාන්තය:** ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුවේ පසුගිය විභාග ප්‍රශ්න පත්‍ර හා ගුරු මාර්ගෝපදේශ සංග්‍රහයට (Guru Potha) අනුව මෙම සංකල්පය අ.පො.ස. උසස් පෙළ විභාගයේ අනිවාර්ය ඒකකයකි.\n2. **න්‍යායික පසුබිම:** ආදර්ශ ආකෘතියේ සංරචක පැහැදිලි රූප සටහන් සහිතව ඉදිරිපත් කරන්න.\n3. **ප්‍රායෝගික නිදසුන:** ශ්‍රී ලාංකේය සන්නිවේදන ක්ෂේත්‍රය ආශ්‍රිත උදාහරණයක් මගින් පැහැදිලි කරන්න.\n4. **විභාග උපදෙස:** 2018-2024 Marking Scheme අනුව ලකුණු බෙදී යන ප්‍රධාන පියවර කෙරෙහි අවධානය යොමු කරන්න.`
          : `### 📚 සිප්අරණ පාසල් ගුරු සහකාර (SipArana School Tutor)\n\n**ශ්‍රේණිය:** ${grade || 12} ශ්‍රේණිය | **විෂය:** ${subject || 'සාමාන්‍ය'}\n**ප්‍රශ්නය:** "${prompt}"\n\n#### 📌 ගුරු පොතට අනුකූල මගපෙන්වීම:\n1. **මූලික සිද්ධාන්තය:** ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ (NIE Guru Potha) අදාළ නිපුණතාව හා ඉගෙනුම් ඵල නිවැරදිව අධ්‍යයනය කරන්න.\n2. **විභාග සැලසුම:** පසුගිය වසරවල (2018-2024) ප්‍රශ්න පත්‍රවල ව්‍යුහගත හා රචනා ප්‍රශ්න රටාවන්ට අනුව ලකුණු ලබා ගැනීමේ ප්‍රධාන පියවර ලියන්න.\n3. **පාරිභාෂික වචන:** විෂයානුබද්ධ නිවැරදි විද්‍යාත්මක හෝ තාක්ෂණික පාරිභාෂික යෙදුම් භාවිත කරන්න.`;

        return res.json({
          text: fallbackText,
          isFallback: true
        });
      }

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({
        text: response.text || 'Unable to generate response',
        isFallback: false
      });
    } catch (error: any) {
      console.error('School Tutor Error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SipArana Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
