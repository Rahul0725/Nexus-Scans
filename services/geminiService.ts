import { GoogleGenAI, Type } from "@google/genai";
import { Comic } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using 'gemini-3-flash-preview' for speed and efficiency in generating JSON lists
const MODEL_NAME = "gemini-3-flash-preview";

export const getAiRecommendations = async (query: string): Promise<Comic[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found for Gemini");
    return [];
  }

  try {
    const prompt = `Generate a list of 6 fictional or real manhwa/comic titles that match this user query: "${query}". 
    If the query is generic, provide popular action/fantasy manhwa recommendations.
    Return valid JSON matching the schema.
    For the coverUrl, use "https://picsum.photos/seed/{slug}/300/450" replacing {slug} with the slugified title.
    Make the descriptions engaging and typical of scanlation sites.
    Ensure "chapters" is an empty array for now (we simulate it in UI).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              slug: { type: Type.STRING },
              description: { type: Type.STRING },
              coverUrl: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              status: { type: Type.STRING, enum: ['Ongoing', 'Completed', 'Hiatus'] },
              type: { type: Type.STRING, enum: ['Manhwa', 'Manga', 'Manhua'] },
              author: { type: Type.STRING },
              artist: { type: Type.STRING },
              genres: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'title', 'slug', 'description', 'coverUrl', 'rating', 'status', 'type', 'genres']
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];

    const rawData = JSON.parse(jsonStr);

    // Hydrate with some fake chapters so the UI doesn't break
    return rawData.map((c: any) => ({
      ...c,
      chapters: Array.from({ length: 20 }, (_, i) => ({
        id: `ai-${c.id}-${20 - i}`,
        number: `${20 - i}`,
        title: `Chapter ${20 - i}`,
        releaseDate: new Date().toISOString().split('T')[0]
      })),
      isNew: true
    }));

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [];
  }
};
