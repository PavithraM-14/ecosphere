/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("[EcoSphere Warning] GEMINI_API_KEY is not configured in the environment.");
}

// Correct initialization as per Google AI Studio standards
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * Reusable function to generate a text response from the Gemini API.
 * Uses the recommended 'gemini-3.5-flash' model for basic text and summarization tasks.
 * Optimized and validated for the EcoSphere ESG Report Generator and Assistant Chat.
 * 
 * @param {string} prompt - The text prompt or instruction to send to the model.
 * @returns {Promise<string>} The generated response text.
 */
export async function generateResponse(prompt) {
  try {
    if (!prompt) {
      throw new Error("Prompt parameter is required.");
    }

    // Modern SDK query using generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty or invalid response from Gemini API.");
    }

    return response.text;
  } catch (error) {
    console.error("[EcoSphere Service Error] generateResponse failed:", error);
    throw error;
  }
}

