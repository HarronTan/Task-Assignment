import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateSkillsFromTask(taskTitle: string): Promise<string[]> {
    const prompt = `
    You are an assistant that extracts the concrete **type of development skill** needed for a task.

    Based on the **task title**, return a JSON array of strings containing **ONLY** the following values: "frontend", "backend". 
    - If the task requires frontend work, include "frontend".
    - If the task requires backend work, include "backend".
    - If it requires both, include both values.
    - Do not include any other words or explanations.
    - Only output a valid JSON array. Examples: ["frontend"], ["backend"], ["frontend","backend"]

    Task title: "${taskTitle}"

    Rules:
    - Output only lowercase
    - Maximum of 2 items
    - No duplicates
    - No extra text, symbols, or numbers
    - Only alphabetic characters
    `;


    try {
  
        const response  = await ai.models.generateContent({ model: "gemini-2.5-flash-lite", contents: prompt});
        
        if(!response.text) return []
        console.log(response.text.trim())
        const parsed = JSON.parse(response.text.trim());

        if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === "string");
        }

        return [];
    } catch (e) {
        console.error("Failed to parse skills AI response:", e);

        return [];
    }
}