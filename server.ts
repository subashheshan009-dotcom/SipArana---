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

  // General School Level AI Tutor Endpoint (for Grades 6-13)
  app.post('/api/gemini/school-tutor', async (req, res) => {
    try {
      const { prompt, grade, subject, stream, medium } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are "SipArana Guru Bot" (සිප්අරණ ගුරු සහකාර), the friendly and expert Sri Lankan National Curriculum AI Teacher for School Grade ${grade || 11}, Subject: ${subject || 'General'}, Stream: ${stream || 'General'}, Medium: ${medium || 'Sinhala'}.
Always strictly align with Sri Lankan Ministry of Education & NIE Guru Potha (ගුරු මාර්ගෝපදේශ සංග්‍රහය).
Explain in simple, encouraging Sinhala and English, with clear examples, diagrams described in text, and exam-focused mnemonic tips.`;

      if (!ai) {
        return res.json({
          text: `### 📚 සිප්අරණ පාසල් ගුරු සහකාර (SipArana School Tutor)\n\n**ශ්‍රේණිය:** ${grade || 11} ශ්‍රේණිය | **විෂය:** ${subject || 'සාමාන්‍ය'}\n\n*නිරීක්ෂණය:* "${prompt}" පිළිබඳ ගුරු පොතට අනුකූල කෙටි සටහන:\n1. ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයට අනුව මෙහි මූලික සිද්ධාන්ත හොඳින් මතක තබාගන්න.\n2. විභාග ප්‍රශ්න පත්‍රවල පසුගිය වසරවල (2018-2024) බහුවරණ හා ව්‍යුහගත රචනා ප්‍රශ්න පුහුණු වන්න.\n3. නිවැරදි විද්‍යාත්මක හෝ ගණිතමය පාරිභාෂික වචන භාවිත කරන්න.`,
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
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
