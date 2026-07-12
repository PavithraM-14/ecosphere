/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateResponse } from "../services/geminiService.js";
import {
  esgReportTemplate,
  esgGenerateReportTemplate,
  esgChatTemplate,
  esgAdvisorTemplate,
  esgRankingExplanationTemplate,
  esgRecommendGoalsTemplate
} from "../utils/promptTemplates.js";

/**
 * Handles test prompt requests to evaluate the Gemini integration
 * POST /api/ai/test
 * 
 * Input body: { "prompt": "..." }
 * Output body: { "success": true, "response": "..." }
 */
export async function testAI(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "A valid non-empty 'prompt' is required in the request body.",
      });
    }

    const responseText = await generateResponse(prompt.trim());

    return res.status(200).json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] testAI failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while processing the AI request.",
    });
  }
}

/**
 * Generates an AI ESG Report using Google Gemini
 * POST /api/ai/esg-report
 * 
 * Input body: { "esgData": { "environmentScore": 85, "socialScore": 78, "governanceScore": 90, ... } }
 * Output body: { "success": true, "report": "AI generated ESG report" }
 */
export async function generateESGReport(req, res) {
  try {
    const { esgData } = req.body;

    if (!esgData || typeof esgData !== "object" || Array.isArray(esgData)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. A valid 'esgData' object is required in the request body.",
      });
    }

    // Build the formatted prompt using our ESG Report Template
    const prompt = esgReportTemplate(esgData);

    // Call the existing geminiService response generator
    const reportText = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      report: reportText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] generateESGReport failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while generating the ESG report.",
    });
  }
}

/**
 * Generates an AI ESG Report using Google Gemini for Feature 1 (detailed metrics)
 * POST /api/ai/generate-report
 * 
 * Input body: 
 * {
 *   "companyName": "EcoSphere",
 *   "department": "IT",
 *   "environmentScore": 85,
 *   "socialScore": 90,
 *   "governanceScore": 80,
 *   "carbonEmission": "1200 kg",
 *   "initiatives": ["Solar energy adoption", "Employee wellness programs"]
 * }
 * 
 * Output body: { "success": true, "report": "AI generated ESG sustainability report" }
 */
export async function generateReport(req, res) {
  try {
    const data = req.body;

    // Validate that some data is provided
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. A valid company ESG data object is required in the request body.",
      });
    }

    // Build the formatted prompt using our esgGenerateReportTemplate
    const prompt = esgGenerateReportTemplate(data);

    // Call the existing geminiService response generator
    const reportText = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      report: reportText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] generateReport failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while generating the detailed ESG report.",
    });
  }
}

/**
 * Handles ESG AI Assistant chatbot API requests for Feature 2
 * POST /api/ai/chat
 * 
 * Input body: { "message": "How can our company reduce carbon emissions?" }
 * Output body: { "success": true, "response": "Gemini AI answer" }
 */
export async function chatAI(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "A valid non-empty 'message' is required in the request body.",
      });
    }

    // Build the formatted prompt using our esgChatTemplate
    const prompt = esgChatTemplate(message.trim());

    // Call the existing geminiService response generator
    const responseText = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] chatAI failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while processing the chat request.",
    });
  }
}

/**
 * Generates sustainability recommendations based on scores and reported issues
 * POST /api/ai/advisor
 */
export async function getSustainabilityAdvice(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. A valid advisor data object is required in the request body.",
      });
    }

    // Build the formatted prompt using our esgAdvisorTemplate
    const prompt = esgAdvisorTemplate(data);

    // Call the existing geminiService response generator
    const adviceText = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      advice: adviceText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] getSustainabilityAdvice failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while generating sustainability advice.",
    });
  }
}

/**
 * Generates an explanation for department rankings based on scores and metrics
 * POST /api/ai/ranking-explanation
 */
export async function getRankingExplanation(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. A valid department ranking explanation data object is required in the request body.",
      });
    }

    // Build the formatted prompt using our esgRankingExplanationTemplate
    const prompt = esgRankingExplanationTemplate(data);

    // Call the existing geminiService response generator
    const explanationText = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      explanation: explanationText,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] getRankingExplanation failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while explaining the department ranking.",
    });
  }
}

/**
 * Recommends short-term, long-term, and measurable ESG goals
 * POST /api/ai/recommend-goals
 */
export async function getRecommendGoals(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. A valid goal recommendation data object is required in the request body.",
      });
    }

    // Build the formatted prompt using our esgRecommendGoalsTemplate
    const prompt = esgRecommendGoalsTemplate(data);

    // Call the existing geminiService response generator
    const responseText = await generateResponse(prompt);

    // Clean JSON response if model returns markdown wrapping or backticks
    let goals = [];
    try {
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "");
        cleaned = cleaned.replace(/\n```$/, "");
      }
      cleaned = cleaned.trim();
      
      goals = JSON.parse(cleaned);
      if (!Array.isArray(goals)) {
        goals = [cleaned];
      }
    } catch (e) {
      // Fallback parsing: split lines, filter empty lines, remove lists symbols (bullets, numbers)
      goals = responseText
        .split(/\n+/)
        .map(line => line.replace(/^-\s*/, "").replace(/^\d+\.\s*/, "").trim())
        .filter(line => line.length > 0 && !line.startsWith("[") && !line.startsWith("]"));
    }

    return res.status(200).json({
      success: true,
      goals: goals,
    });
  } catch (error) {
    console.error("[EcoSphere Controller Error] getRecommendGoals failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while generating goal recommendations.",
    });
  }
}

