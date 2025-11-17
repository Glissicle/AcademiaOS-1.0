import { GoogleGenAI } from "@google/genai";

// Lazily initialize the AI client to avoid crashes on startup if API key is missing.
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            // This error will be caught by the calling function's try/catch block
            throw new Error("API_KEY environment variable not set. Please configure it to use the Learn feature.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const parseGeminiResponse = (responseText: string) => {
  let jsonString = responseText.trim();
  
  // The model might still wrap the JSON in markdown backticks, so let's clean that up.
  if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
      if (jsonString.endsWith('```')) {
          jsonString = jsonString.substring(0, jsonString.length - 3);
      }
  }

  // It's possible the model returns a non-JSON string on failure, so we wrap in a try-catch
  try {
      const parsed = JSON.parse(jsonString);
      // Ensure the response has the expected structure
      if (typeof parsed === 'object' && parsed !== null) {
          return {
              articles: Array.isArray(parsed.articles) ? parsed.articles : [],
              videos: Array.isArray(parsed.videos) ? parsed.videos : [],
          };
      }
      throw new Error("Parsed JSON is not in the expected format.");
  } catch(e) {
      console.error("Failed to parse JSON response from Gemini:", jsonString);
      throw new Error("The model returned an invalid response. Please try again.");
  }
};

const handleApiError = (error: unknown) => {
    console.error("Error with Gemini API:", error);
    if (error instanceof Error) {
        // Pass specific, helpful messages to the UI
        if (error.message.includes('API key not valid')) {
           throw new Error("Invalid API Key. Please check your configuration.");
        }
        // Let other specific errors (like missing API key) pass through
        throw error;
    }
    // Fallback for non-Error objects
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
};

export const generateLearningContent = async (topic: string) => {
  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful research assistant. Find relevant, high-quality articles and YouTube videos about the user's topic: "${topic}". Your response must be a valid JSON object only, without any surrounding text or markdown formatting. The JSON object should have two top-level keys: "articles" and "videos". The "articles" key should be an array of objects, where each object has "title" (string), "link" (string), and "snippet" (string). The "videos" key should be an array of objects, where each object has "title" (string), "link" (string), and "description" (string). If you cannot find relevant results, return an empty array for the corresponding key.`,
        config: {
            tools: [{googleSearch: {}}],
        }
    });
    
    return parseGeminiResponse(response.text);

  } catch (error) {
    handleApiError(error);
  }
};

export const generateCurrentEventsContent = async () => {
  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful news aggregator. Find recent, high-quality articles and YouTube videos about current world events, technology, science, and culture. Your response must be a valid JSON object only, without any surrounding text or markdown formatting. The JSON object should have two top-level keys: "articles" and "videos". The "articles" key should be an array of objects, where each object has "title" (string), "link" (string), and "snippet" (string). The "videos" key should be an array of objects, where each object has "title" (string), "link" (string), and "description" (string). Ensure a diverse range of topics.`,
        config: {
            tools: [{googleSearch: {}}],
        }
    });

    return parseGeminiResponse(response.text);

  } catch (error) {
    handleApiError(error);
  }
};