import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
const router = express.Router();

router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        const { ingredients, allergies, lang } = req.body;
        
        if (!ingredients) {
            res.status(400).json({ message: 'Ingredients are required' });
            return;
        }

        const targetLanguage = lang || 'en';

        const prompt = `
You are a world-class toxicologist, expert nutritionist, and food scientist. Your task is to forensically analyze the following list of food ingredients.
You MUST use your Google Search grounding to research any chemical additives, E-numbers, or unfamiliar ingredients to determine their real health impacts, including if they are banned in any countries (like the EU) or linked to severe health issues.

USER ALLERGIES: ${allergies && allergies.length > 0 ? allergies.join(', ') : 'None'}
INGREDIENTS TO ANALYZE: ${ingredients}

Instructions for Classification:
1. RED FLAGS ("reds"): Be extremely critical. Include ANY ingredient matching the User Allergies (these are critical dangers). Include artificial food dyes (Red 40, Yellow 5, etc.), artificial sweeteners (Aspartame, Sucralose), high fructose corn syrup, seed oils (canola, palm, soybean) if heavily processed, BHT/BHA, nitrates/nitrites, and any known carcinogens or endocrine disruptors. State specifically why it is bad (e.g., "Banned in EU, linked to hyperactivity").
2. GREEN FLAGS ("greens"): Only genuinely healthy, nutrient-dense whole foods. Organic ingredients, natural vitamins, whole grains, raw nuts, natural fibers.
3. WHITE FLAGS ("whites"): Neutral ingredients. Water, salt (if not excessive), natural spices, benign preservatives (like citric acid or ascorbic acid/Vitamin C), or common harmless thickeners (like guar gum).

Scoring Logic (0 to 100):
- Start at 100.
- Subtract 15 points for every major allergy match (CRITICAL).
- Subtract 10 points for every Red Flag.
- Add 5 points for every Green Flag (max 100).
- If the product is highly processed with multiple red flags, the score should reflect a failing grade (< 40).

CRITICAL LANGUAGE REQUIREMENT: Translate your reasoning and ingredient names into the language code: "${targetLanguage}".
HOWEVER, DO NOT translate the JSON keys ("greens", "reds", "whites", "score", "name", "reason"). They MUST remain in English.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "greens": [{ "name": "string", "reason": "string" }],
  "reds": [{ "name": "string", "reason": "string" }],
  "whites": [{ "name": "string", "reason": "string" }],
  "score": number
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text;
        if (!text) {
             res.status(500).json({ message: 'No response from AI' });
             return;
        }
        
        let result;
        try {
            // Find the JSON object even if there is surrounding text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            let cleanText = text;
            
            if (jsonMatch) {
                cleanText = jsonMatch[0];
            } else {
                // Fallback strip markdown if no clear object is found
                cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            }
            
            result = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', text);
            console.error('Parse error:', parseError);
            res.status(500).json({ message: 'Invalid format received from AI' });
            return;
        }
        
        res.json(result);
    } catch (error: any) {
        console.error('Scan analyze error details:', error?.message || error);
        
        // Handle Gemini Quota Exceeded
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            res.status(429).json({ message: 'AI Quota Exceeded. You have hit your Google Gemini API daily/minute limit.' });
            return;
        }

        res.status(500).json({ message: 'Error analyzing ingredients via AI', details: error.message });
    }
});

export default router;
