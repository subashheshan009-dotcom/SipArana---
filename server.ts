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
