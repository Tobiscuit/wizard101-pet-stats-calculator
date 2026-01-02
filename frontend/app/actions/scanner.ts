"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Mock extraction if no key provided (for demo/dev without keys)
const MOCK_EXTRACTION = {
  wizardName: "Valdus Wildheart",
  school: "Storm",
  level: 150,
  stats: {
    damage: 175,
    resist: 45,
    accuracy: 35,
    critical: 650,
    pierce: 35,
    powerPips: 100,
    archmastery: 4
  },
  equipment: {
    hat: "Nullity's Storm Hat",
    robe: "Nullity's Storm Robe",
    boots: "Nullity's Storm Boots",
    wand: "Dawn of the Reaver"
  }
};

export async function scanWizardImage(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Convert File to Buffer/ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Using mock response.");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, data: MOCK_EXTRACTION, mock: true };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Wizard101 analyst. Analyze this screenshot of a character's stat sheet or inventory.
      
      Please extract the following information in JSON format:
      1. **Identity**: Wizard Name, School (Fire, Ice, Storm, Myth, Life, Death, Balance), and Level.
      2. **Stats**: Damage, Resistance (Universal/School specific), Accuracy, Critical, Block, Armor Piercing (Pierce), Pip Conversion, Power Pip Chance.
      3. **Equipment**: Identify visible names of Hat, Robe, Boots, Wand, Athame, Amulet, Ring, Deck.

      If a field is not visible, use null.
      
      Return ONLY valid JSON. Structure:
      {
        "wizardName": string | null,
        "school": string | null,
        "level": number | null,
        "stats": {
          "damage": number | null,
          "resist": number | null,
          "accuracy": number | null,
          "critical": number | null,
          "pierce": number | null
        },
        "equipment": { ... }
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean code blocks if present
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return { success: true, data };

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return { success: false, error: "Failed to analyze image. Ensure the screenshot is clear." };
  }
}
