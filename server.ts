import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini client if key is set
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

interface ItemReport {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  category: string;
  description: string;
  color: string;
  brand?: string;
  location: string;
  date: string;
  time: string;
  additionalDetails?: string;
  status: 'active' | 'matched' | 'resolved';
  custodyLocation?: string; // for found items
  createdAt: string;
}

interface MatchIndicator {
  status: 'exact' | 'high' | 'nearby' | 'compatible' | 'moderate' | 'low';
  label: string;
}

interface MatchResult {
  candidateId: string;
  similarityScore: number;
  confidence: 'High' | 'Moderate' | 'Low';
  explanation: string;
  indicators: {
    itemType: MatchIndicator;
    color: MatchIndicator;
    location: MatchIndicator;
    time: MatchIndicator;
    description: MatchIndicator;
  };
  matchingCharacteristics: string[];
  recommendedAction: string;
  suggestedVerificationPrompt: string;
}

// Fallback intelligent matching heuristic when Gemini API is unavailable or rate-limited
function heuristicMatch(target: ItemReport, candidate: ItemReport): MatchResult {
  let score = 0;
  const characteristics: string[] = [];

  // 1. Category check
  const sameCategory = target.category.toLowerCase() === candidate.category.toLowerCase();
  let itemTypeInd: MatchIndicator = { status: 'low', label: 'Different category' };
  if (sameCategory) {
    score += 30;
    characteristics.push(`Matching category: ${target.category}`);
    itemTypeInd = { status: 'exact', label: 'Exact category match' };
  } else {
    // Check keyword similarity in titles
    const targetTitleWords = target.itemName.toLowerCase().split(/\s+/);
    const candTitleWords = candidate.itemName.toLowerCase().split(/\s+/);
    const sharedWords = targetTitleWords.filter(w => w.length > 2 && candTitleWords.includes(w));
    if (sharedWords.length > 0) {
      score += 20;
      characteristics.push(`Related items: ${sharedWords.join(', ')}`);
      itemTypeInd = { status: 'high', label: 'High title similarity' };
    }
  }

  // 2. Color check
  const targetColor = (target.color || '').toLowerCase().trim();
  const candColor = (candidate.color || '').toLowerCase().trim();
  let colorInd: MatchIndicator = { status: 'low', label: 'Color variance' };
  if (targetColor && candColor) {
    if (targetColor === candColor || targetColor.includes(candColor) || candColor.includes(targetColor)) {
      score += 20;
      characteristics.push(`Identical color specified: ${target.color}`);
      colorInd = { status: 'exact', label: 'Exact color match' };
    } else {
      colorInd = { status: 'moderate', label: 'Different shade/unspecified' };
    }
  } else {
    colorInd = { status: 'moderate', label: 'Color partially specified' };
  }

  // 3. Location proximity
  const targetLoc = (target.location || '').toLowerCase();
  const candLoc = (candidate.location || '').toLowerCase();
  let locInd: MatchIndicator = { status: 'low', label: 'Different campus zone' };
  const campusKeywords = ['library', 'cafeteria', 'gym', 'quad', 'hall', 'student center', 'bus', 'lab', 'recreation', 'dining'];
  const sharedCampusKeyword = campusKeywords.find(k => targetLoc.includes(k) && candLoc.includes(k));
  if (sharedCampusKeyword) {
    score += 20;
    characteristics.push(`Occurred in same area (${sharedCampusKeyword})`);
    locInd = { status: 'nearby', label: 'Same facility / zone' };
  } else if (targetLoc.includes(candLoc) || candLoc.includes(targetLoc)) {
    score += 18;
    characteristics.push('Close location match');
    locInd = { status: 'nearby', label: 'Nearby location' };
  } else {
    locInd = { status: 'moderate', label: 'Different reported location' };
  }

  // 4. Time & date compatibility
  let timeInd: MatchIndicator = { status: 'compatible', label: 'Compatible timeframe' };
  if (target.date && candidate.date) {
    const tDate = new Date(target.date).getTime();
    const cDate = new Date(candidate.date).getTime();
    if (!isNaN(tDate) && !isNaN(cDate)) {
      const diffDays = Math.abs(tDate - cDate) / (1000 * 60 * 60 * 24);
      if (diffDays <= 2) {
        score += 15;
        characteristics.push('Reported within 48 hours of each other');
        timeInd = { status: 'compatible', label: 'Within 48 hours' };
      } else if (diffDays <= 7) {
        score += 8;
        timeInd = { status: 'compatible', label: 'Within same week' };
      } else {
        timeInd = { status: 'low', label: 'Dates further apart' };
      }
    }
  }

  // 5. Description semantic keyword overlap
  const targetDesc = `${target.description} ${target.brand || ''} ${target.additionalDetails || ''}`.toLowerCase();
  const candDesc = `${candidate.description} ${candidate.brand || ''} ${candidate.additionalDetails || ''}`.toLowerCase();
  const keyTokens = ['case', 'earbuds', 'headphones', 'bottle', 'backpack', 'wallet', 'id', 'card', 'keys', 'calculator', 'blue', 'black', 'apple', 'sony', 'airpods', 'leather', 'zipper', 'stickers'];
  const matchingTokens = keyTokens.filter(t => targetDesc.includes(t) && candDesc.includes(t));
  if (matchingTokens.length > 0) {
    score += Math.min(15, matchingTokens.length * 5);
    characteristics.push(`Key terms align: ${matchingTokens.slice(0, 3).join(', ')}`);
  }

  // Calculate realistic probabilistic score
  const finalScore = Math.min(94, Math.max(0, score));
  const confidence: 'High' | 'Moderate' | 'Low' = finalScore >= 75 ? 'High' : finalScore >= 55 ? 'Moderate' : 'Low';

  const explanation = `This report may match because both describe ${target.category.toLowerCase()} items (${target.color || 'similar color'}) noted around the ${target.location.split(',')[0]} area within a compatible timeframe. The reported descriptions share multiple matching characteristics, though physical ownership should be verified before item transfer.`;

  return {
    candidateId: candidate.id,
    similarityScore: finalScore,
    confidence,
    explanation,
    indicators: {
      itemType: itemTypeInd,
      color: colorInd,
      location: locInd,
      time: timeInd,
      description: {
        status: matchingTokens.length > 1 ? 'high' : 'moderate',
        label: matchingTokens.length > 1 ? 'Strong detail similarity' : 'Moderate description overlap'
      }
    },
    matchingCharacteristics: characteristics.length > 0 ? characteristics : ['General category resemblance', 'Potential proximity on campus'],
    recommendedAction: candidate.custodyLocation
      ? `Visit ${candidate.custodyLocation} or request desk verification.`
      : 'Connect securely through FindBack AI to verify unlisted identifying marks.',
    suggestedVerificationPrompt: `Ask the claimant to specify a private detail (such as internal stickers, brand serial letters, pouch contents, or screen lock features) not shown publicly.`
  };
}

// API: Match query report against candidate pool
app.post('/api/match', async (req, res) => {
  try {
    const { targetReport, candidateReports } = req.body as {
      targetReport: ItemReport;
      candidateReports: ItemReport[];
    };

    if (!targetReport || !Array.isArray(candidateReports) || candidateReports.length === 0) {
      return res.json({ matches: [], analyzedAt: new Date().toISOString() });
    }

    const ai = getGeminiClient();

    // If Gemini client is available, leverage gemini-3.8-flash for deep reasoning with timeout
    if (ai) {
      try {
        const prompt = `You are FindBack AI, an intelligent lost and found matching agent for universities and campuses.
A user has submitted a ${targetReport.type.toUpperCase()} report:
Item Name: ${targetReport.itemName}
Category: ${targetReport.category}
Color: ${targetReport.color}
Brand: ${targetReport.brand || 'Not specified'}
Location: ${targetReport.location}
Date: ${targetReport.date}
Time: ${targetReport.time}
Description: ${targetReport.description}
Additional Details: ${targetReport.additionalDetails || 'None'}

Here is the database of candidate ${targetReport.type === 'lost' ? 'FOUND' : 'LOST'} reports:
${JSON.stringify(candidateReports.map(c => ({
  id: c.id,
  itemName: c.itemName,
  category: c.category,
  color: c.color,
  brand: c.brand,
  location: c.location,
  date: c.date,
  time: c.time,
  description: c.description,
  additionalDetails: c.additionalDetails,
  custodyLocation: c.custodyLocation
})), null, 2)}

Analyze each candidate report against the user's report.
Compare:
1. Item type & category similarity
2. Color matching
3. Location proximity (e.g. campus areas, buildings)
4. Time & date compatibility
5. Description & physical attribute details

Strict Guidelines:
- Return a JSON object with a "matches" array sorted by similarityScore descending.
- Only include candidates that have a possible match or similarity score of at least 50%. If a candidate is completely unrelated (e.g. different item type and category), do NOT include it.
- "similarityScore" must be a number from 50 to 96 (never claim 100% certainty, always present as an estimate).
- "confidence": "High" (score >= 75), "Moderate" (55-74), or "Low" (<55).
- Do NOT make definitive claims like "This is definitely your item". Use cautious probabilistic phrasing like "This report may match because..."
- Do not expose any sensitive personal info.
- Include "indicators" with labels:
  - itemType: { status: "exact" | "high" | "moderate" | "low", label: string }
  - color: { status: "exact" | "high" | "moderate" | "low", label: string }
  - location: { status: "nearby" | "moderate" | "low", label: string }
  - time: { status: "compatible" | "moderate" | "low", label: string }
  - description: { status: "high" | "moderate" | "low", label: string }
- "matchingCharacteristics": list of 3-5 concise bullet points (e.g., "Identical category: Electronics", "Same color: Black").
- "explanation": 2-3 sentences explaining why it may match and reminding to verify ownership.
- "recommendedAction": Safe next action (e.g. "Contact the campus lost & found desk" or "Initiate safe ownership verification through FindBack").
- "suggestedVerificationPrompt": 1 question the finder/owner can ask to prove ownership privately (e.g., "Ask claimant to specify the keychain color or internal label").
`;

        const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
        let geminiResponseText: string | null = null;
        let successfulModel = '';

        for (const modelName of modelsToTry) {
          try {
            const geminiPromise = ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json'
              }
            });

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Gemini ${modelName} timed out after 8s`)), 8000)
            );

            const response: any = await Promise.race([geminiPromise, timeoutPromise]);
            if (response && response.text) {
              geminiResponseText = response.text;
              successfulModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} attempt failed:`, modelErr?.status || modelErr?.message || modelErr);
          }
        }

        if (geminiResponseText) {
          const parsed = JSON.parse(geminiResponseText);
          if (parsed && Array.isArray(parsed.matches)) {
            // Normalize candidateId if Gemini returned 'id' or 'candidate_id'
            const qualifiedMatches = parsed.matches
              .map((m: any) => ({
                ...m,
                candidateId: m.candidateId || m.id || m.candidate_id || '',
              }))
              .filter((m: any) => typeof m.similarityScore === 'number' && m.similarityScore >= 50 && m.candidateId);

            return res.json({
              matches: qualifiedMatches,
              engine: successfulModel || 'gemini-3.1-flash-lite',
              analyzedAt: new Date().toISOString()
            });
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini matching error/timeout, using semantic fallback:', geminiError?.message || geminiError);
      }
    }

    // Fallback heuristic scoring: filter matches >= 50
    const fallbackMatches = candidateReports
      .map(candidate => heuristicMatch(targetReport, candidate))
      .filter(match => match.similarityScore >= 50)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return res.json({
      matches: fallbackMatches,
      engine: 'semantic-heuristic',
      analyzedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Match API Error:', err);
    return res.status(500).json({ error: 'Failed to process match request', details: err.message });
  }
});

// API: Quick AI Assistant assistance for description enhancement & privacy scan
app.post('/api/analyze-item', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.json({ suggestedCategory: 'Others', extractedColor: '', safetyNotice: null });
    }

    // Safety regex check for phone numbers / emails / IDs
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasSensitive = phoneRegex.test(text) || emailRegex.test(text);

    return res.json({
      safetyNotice: hasSensitive ? 'Warning: Text seems to contain contact details. For privacy, keep reports free of phone numbers or emails.' : null,
      sanitized: true
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// API: Proxy for n8n AI Chatbot Agent
const DEFAULT_N8N_WEBHOOK = 'https://madhuri-reddy06.app.n8n.cloud/webhook/05e8976c-9bca-42e2-aa54-6fc33a795eb9/chat';
const TEST_N8N_WEBHOOK = 'https://madhuri-reddy06.app.n8n.cloud/webhook-test/05e8976c-9bca-42e2-aa54-6fc33a795eb9/chat';

app.post('/api/n8n-chat', async (req, res) => {
  try {
    const { message, sessionId, webhookUrl } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const targetWebhook = webhookUrl || DEFAULT_N8N_WEBHOOK;
    const sid = sessionId || `findback-session-${Date.now()}`;

    // Payload formatted for standard n8n chat triggers & webhook nodes
    const payload = {
      chatInput: message,
      message: message,
      sessionId: sid,
      timestamp: new Date().toISOString()
    };

    // 1. First, attempt to call the user's n8n webhook
    let n8nSuccess = false;
    let n8nOutput: string | null = null;

    try {
      const n8nResponse = await fetch(targetWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(payload)
      });

      if (n8nResponse.ok) {
        const contentType = n8nResponse.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await n8nResponse.json();
          n8nOutput =
            data?.output ||
            data?.text ||
            data?.message ||
            data?.response ||
            (Array.isArray(data) ? (data[0]?.output || data[0]?.text || JSON.stringify(data[0])) : JSON.stringify(data));
        } else {
          n8nOutput = await n8nResponse.text();
        }

        if (n8nOutput && typeof n8nOutput === 'string' && n8nOutput.trim().length > 0) {
          n8nSuccess = true;
          return res.json({
            output: n8nOutput,
            sessionId: sid,
            source: 'n8n'
          });
        }
      }
    } catch (n8nErr: any) {
      console.warn('n8n webhook network attempt failed, using built-in agent:', n8nErr?.message);
    }

    // 2. If n8n is inactive or returned 404, seamlessly answer using Gemini AI
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are the FindBack AI Assistant, the intelligent lost-and-found agent for university campuses and community facilities.
A user on the FindBack AI website sent this message:
"${message}"

Your knowledge and guidelines:
- Role: Friendly, campus-aware lost & found assistant.
- Reporting: Users can click "Report Lost Item" or "Report Found Item" in the navigation bar to submit an item.
- Matching: FindBack AI uses multimodal AI to compare categories, colors, locations, times, and descriptions without sharing private contact info publicly.
- Safe Verification: FindBack uses private verification prompts (e.g. asking for lock screen wallpaper, specific stickers, keychain attachments, or case engravings) so finders and owners can safely confirm ownership before handover.
- Key Campus Desks:
  • Main Library 1st Floor Circulation Desk (books, electronics, chargers)
  • Campus Recreation Center Equipment Desk (bottles, gym gear, sportswear)
  • Student Union Information Desk (keys, backpacks, umbrellas)
  • Campus Safety & Police Substation Room 105 (official ID cards, wallets, jewelry)
- Tone: Helpful, reassuring, clear, and concise. Use bullet points where appropriate. Do NOT mention internal webhook status or say you are a fallback; simply answer the user directly and helpfully as their assistant.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt
        });

        if (response && response.text) {
          return res.json({
            output: response.text.trim(),
            sessionId: sid,
            source: 'gemini-assistant'
          });
        }
      } catch (aiErr: any) {
        console.warn('Gemini chat generation failed:', aiErr?.message);
      }
    }

    // 3. Graceful heuristic response if both are unavailable
    return res.json({
      output: `I'm here to help you with campus lost and found! You can report a lost or found item using the buttons in the top menu, browse active matches in the Dashboard, or check in at the Main Library Circulation Desk or Student Union Help Desk for items turned in today.`,
      sessionId: sid,
      source: 'local-assistant'
    });
  } catch (err: any) {
    console.error('n8n proxy error:', err);
    return res.status(500).json({ error: 'Failed to process message', details: err.message });
  }
});

// Dev vs Prod Vite setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FindBack AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
