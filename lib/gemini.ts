import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Never use a hardcoded API key in production!
// Users should provide their own Gemini API keys for AI features
const ADMIN_KEY = process.env.GEMINI_API_KEY; // Only for demo/development

/**
 * Get Gemini AI instance with user's API key
 * Users must provide their own key for production use
 */
function getGeminiInstance(userApiKey?: string): GoogleGenerativeAI | null {
  const apiKey = userApiKey || ADMIN_KEY;
  
  if (!apiKey) {
    console.warn('No Gemini API key provided - AI features disabled');
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generate virtual try-on image using Gemini
 * @param userApiKey - User's own Gemini API key (required for production)
 */
export async function generateTryOnDescription(
  userPhotoUrl: string,
  clothingItemPhotoUrl: string,
  clothingDetails: {
    title: string;
    category: string;
    color?: string;
    pattern?: string;
  },
  userApiKey?: string
): Promise<string> {
  const genAI = getGeminiInstance(userApiKey);
  
  if (!genAI) {
    throw new Error('Gemini API key required. Please add your API key in Settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a fashion styling AI assistant. Describe how the following clothing item would look on a person:

Clothing Item: ${clothingDetails.title}
Category: ${clothingDetails.category}
Color: ${clothingDetails.color || 'not specified'}
Pattern: ${clothingDetails.pattern || 'solid'}

Provide a detailed, helpful description of:
1. How this item would fit and flatter different body types
2. Styling suggestions (what to pair it with)
3. Occasions where this would be appropriate
4. Color combinations that work well

Keep the tone friendly and encouraging. Be specific and practical.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Analyze clothing item from image
 * @param userApiKey - User's own Gemini API key (required for production)
 */
export async function analyzeClothingImage(
  imageUrl: string,
  userApiKey?: string
): Promise<{
  category: string;
  colors: string[];
  pattern: string;
  style: string;
  suggestions: string;
}> {
  const genAI = getGeminiInstance(userApiKey);
  
  if (!genAI) {
    throw new Error('Gemini API key required. Please add your API key in Settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Fetch image as base64
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64,
      },
    },
    {
      text: `Analyze this clothing item and provide:
1. Category (e.g., shirt, dress, pants, jacket)
2. Main colors (list top 3)
3. Pattern (solid, striped, floral, etc.)
4. Style (casual, formal, athletic, etc.)
5. Brief styling suggestions

Respond in JSON format:
{
  "category": "...",
  "colors": ["...", "...", "..."],
  "pattern": "...",
  "style": "...",
  "suggestions": "..."
}`,
    },
  ]);

  const text = await result.response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  // Fallback if JSON parsing fails
  return {
    category: 'unknown',
    colors: [],
    pattern: 'unknown',
    style: 'unknown',
    suggestions: text,
  };
}

/**
 * Generate personalized style recommendations
 * @param userApiKey - User's own Gemini API key (required for production)
 */
export async function generateStyleRecommendations(
  userProfile: {
    preferredStyles?: string[];
    size?: string;
    favoriteColors?: string[];
  },
  wardrobeItems: Array<{
    category: string;
    color?: string;
    pattern?: string;
  }>,
  userApiKey?: string
): Promise<string[]> {
  const genAI = getGeminiInstance(userApiKey);
  
  if (!genAI) {
    throw new Error('Gemini API key required. Please add your API key in Settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a personal fashion stylist. Based on the following wardrobe, suggest 5 new items that would complete great outfits:

User Preferences:
- Styles: ${userProfile.preferredStyles?.join(', ') || 'versatile'}
- Size: ${userProfile.size || 'not specified'}
- Favorite Colors: ${userProfile.favoriteColors?.join(', ') || 'neutral tones'}

Current Wardrobe (${wardrobeItems.length} items):
${wardrobeItems.map(item => `- ${item.category} (${item.color || 'color unspecified'}, ${item.pattern || 'solid'})`).join('\n')}

Provide 5 specific item recommendations that would:
1. Fill gaps in their wardrobe
2. Create versatile outfit combinations
3. Match their style preferences
4. Work with what they already own

Format each recommendation as: "Category: Description (why it works)"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse recommendations
  return text
    .split('\n')
    .filter((line: string) => line.trim().match(/^\d+\./))
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
}

/**
 * Check if user has remaining AI credits
 */
export function hasAICredits(
  tier: string,
  creditsUsed: number,
  monthStart: Date
): { hasCredits: boolean; remaining: number; limit: number } {
  const TIER_LIMITS = {
    BASIC: 10,
    STANDARD: 50,
    PRO: 200,
  };

  const limit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || 0;
  
  // Reset credits if it's a new month
  const now = new Date();
  const isNewMonth = 
    now.getMonth() !== monthStart.getMonth() || 
    now.getFullYear() !== monthStart.getFullYear();

  const effectiveCreditsUsed = isNewMonth ? 0 : creditsUsed;
  const remaining = limit - effectiveCreditsUsed;

  return {
    hasCredits: remaining > 0,
    remaining: Math.max(0, remaining),
    limit,
  };
}
