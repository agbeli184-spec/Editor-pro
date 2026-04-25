
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCaptions(prompt: string, category: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 creative and engaging TikTok/Reels captions for a video about: ${prompt}. The vibe should be ${category}. Return the results as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text || "[]") as string[];
  } catch (error) {
    console.error("Caption generation error:", error);
    return ["Error generating captions. Please try again."];
  }
}
