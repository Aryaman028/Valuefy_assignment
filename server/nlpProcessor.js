import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Initialize Gemini AI with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractActions = async (text) => {
    console.log('Received text:', text); // Debugging statement

    const prompt = `
    Analyze the following meeting transcript and extract key details.

    Transcript: "${text}"

    Return only a valid JSON object in this format:
    {
      "tasks": ["task1", "task2"],
      "calendarEvents": ["event1", "event2"],
      "todoItems": ["item1", "item2"],
      "summary": "short summary"
    }

    In calendarEvents try to add the points which have days time or months

    DO NOT include any explanations, just return a JSON object.
    Even dont give any extra word other than JSON object.
`;


    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text(); // Extract raw text output

        console.log('Gemini AI Response:', rawText); // Debugging statement

        // Parse JSON response safely
        let parsedData = {};
        try {
            parsedData = JSON.parse(rawText);
        } catch (jsonError) {
            console.error("Error parsing Gemini response:", jsonError);
        }
        
        return {
            tasks: parsedData.tasks || [],
            calendarEvents: parsedData.calendarEvents || [],
            todoItems: parsedData.todoItems || [],
            summary: parsedData.summary || "No summary available.",
        };
    }catch (error) {
        console.error('Error calling Gemini AI:', error);
        return { tasks: [], calendarEvents: [], todoItems: [], summary: 'Error extracting information.' };
    }
};
