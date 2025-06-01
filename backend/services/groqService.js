// Load environment variables from .env file immediately
import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

// Check if the API key is loaded correctly
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Loaded' : 'Missing');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Calls Groq LLM API to get a book summary based on a prompt
 * @param {string} prompt - The input prompt/question for the LLM
 * @returns {Promise<string>} - The generated summary or error message
 */
export async function getBookSummary(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content.trim() || "No summary generated.";
  } catch (error) {
    console.error("Groq SDK Error:", error);
    return "Sorry, couldn't generate a recommendation summary.";
  }
}
