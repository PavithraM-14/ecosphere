/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateResponse } from "../services/geminiService.js";
import { esgReportTemplate } from "../utils/promptTemplates.js";

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
