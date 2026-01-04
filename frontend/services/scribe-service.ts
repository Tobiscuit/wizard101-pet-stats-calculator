"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const MODEL_NAME = "gemini-3.0-flash"; // User specified Gemini 3

const SYSTEM_PROMPT = `
You are **The Scribe**, an ancient and wise chronicler of the Spiral (Wizard101).
Your goal is to assist young Wizards with accurate, up-to-date knowledge.

**CRITICAL RULES:**
1.  **Date Awareness**: Today is ${new Date().toLocaleDateString()}. Be aware that game content changes.
2.  **Ambiguity Check**: If a user asks about "Darkmoor", clarify if they mean the **Classic Dungeon** (Level 100) or the **New World** (2025/2026 Expansion).
3.  **Search First**: You have access to Google Search. UTLIZE IT. Do not rely solely on your training data for stats, drops, or recent updates.
4.  **Tone**: Helpful, slightly arcane/wizardly, but concise. Do not answer questions unrelated to Wizard101 or Gaming.

**Formatting**:
- Use Markdown for bolding item names or locations.
- Keep answers brief unless asked for a guide.
`;

export async function chatWithScribe(history: { role: "user" | "model"; parts: string }[], message: string) {
    if (!process.env.GOOGLE_API_KEY) {
        return { 
            text: "My connection to the Aether (API Key) is missing. Please check the server logs.", 
            sources: [] 
        };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: SYSTEM_PROMPT,
            // @ts-ignore - Grounding tool types might be bleeding edge in this SDK version
            tools: [{ googleSearch: {} }], // Enable Grounding
        });

        // Convert history to Gemini format
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.parts }],
            })),
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        // Extract Grounding Metadata (Sources) if available
        // Note: The SDK structure might vary for Gemini 3, assuming standard candidates structure
        // In a real app, successful grounding returns groundingMetadata in the response candidate
        
        return { 
            text,
            // Mocking source extraction (The actual SDK returns groundingMetadata object)
            // In MVP we just return text. Frontend can parse citations if needed.
        };

    } catch (error: any) {
        console.error("Scribe Error:", error);
        return { 
            text: "The archives are cloudy regarding this matter. (Error: " + error.message + ")",
            sources: []
        };
    }
}
