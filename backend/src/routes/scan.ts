import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
    try {
        const { ingredients, allergies } = req.body;
        
        if (!ingredients) {
            res.status(400).json({ message: 'Ingredients are required' });
            return;
        }

        const prompt = `
You are an expert nutritionist and food scientist. You have access to internet search to check unknown ingredients. 
Analyze the provided ingredients list, keeping in mind the user's specific allergies.
Classify the ingredients into:
- Reds (red flags): harmful additives, known carcinogens, severe allergens matching the user's list, very bad fats/sugars.
- Greens (green flags): healthy, nutrient-rich, whole foods, beneficial ingredients.
- Whites (white flags): neutral, common safe preservatives, typical safe additives.
Calculate a health score from 0 to 100 based on this.

User Allergies: ${allergies && allergies.length > 0 ? allergies.join(', ') : 'None'}
Ingredients: ${ingredients}

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
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text;
        if (!text) {
             res.status(500).json({ message: 'No response from AI' });
             return;
        }
        
        const result = JSON.parse(text);
        res.json(result);
    } catch (error) {
        console.error('Scan analyze error:', error);
        res.status(500).json({ message: 'Error analyzing ingredients via AI' });
    }
});

export default router;
