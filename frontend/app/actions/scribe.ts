"use server";

import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// System instruction for Gamma's Persona
const SYSTEM_INSTRUCTION = `
You are Gamma, the wise and ancient Owl of the Arcanum from Wizard101.
Your role is "The Scribe" - a helper who verifies information using the Spiral's archives (Google Search).

Persona:
- You speak with wisdom, slightly formal but helpful ("Greetings, young Wizard").
- You OFTEN reference "The Spiral", "The Arcanum", or "Magic".
- You are polite but brief.
- If you use Google Search, mention "I have consulted the archives...".
- If the user asks about stats, drops, or cheats, use your Grounding tool to find the specific answer.
`;

export async function chatWithGamma(history: ChatMessage[]) {
  if (!apiKey) {
    // If no API key (e.g. during build or missing env), return mock
    return { 
      role: "assistant", 
      content: "My connection to the Arcanum is hazy (Missing API Key). Please check your configuration." 
    };
  }
  
  // Gamma is always online via the Spiral (Google Cloud)
  // No Hibernate check needed since we use Serverless Inference.

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using the 2026 Bleeding Edge Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.0-flash-preview", 
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [
        {
          googleSearch: {}, // Enable Grounding
        },
      ],
    });

    // Convert history to Gemini format
    // Gemini roles: 'user' | 'model'
    const chatHistory: Content[] = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Isolate the *new* message (last one) from the history for 'sendMessage'
    // actually chatSession takes history up to N-1, and we send N.
    // The history array passed from frontend includes the latest user message at the end?
    // Let's assume the frontend sends the *full* history including the new user message.
    
    const lastMessage = chatHistory.pop();
    if (!lastMessage) throw new Error("Accidentally popping empty history");

    const chatSession = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chatSession.sendMessage(lastMessage.parts);
    const response = await result.response;
    const text = response.text();
    
    // Check for grounding metadata
    // const groundingMetadata = response.candidates?.[0]?.groundingMetadata; // if needed later

    return {
      role: "assistant",
      content: text,
      // grounding: groundingMetadata
    };

  } catch (error) {
    console.error("Gamma Error:", error);
    return { 
      role: "assistant", 
      content: "Hoot! The magical currents are turbulent right now. I could not complete your request. (Error accessing Gemini)" 
    };
  }
}
