/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import {
  testAI,
  generateESGReport,
  generateReport,
  chatAI,
  getSustainabilityAdvice,
  getRankingExplanation,
  getRecommendGoals
} from "../controllers/aiController.js";

const router = express.Router();

// Route configuration mapping POST /api/ai/test to testAI controller
router.post("/test", testAI);

// Route configuration mapping POST /api/ai/esg-report to generateESGReport controller
router.post("/esg-report", generateESGReport);

// Route configuration mapping POST /api/ai/generate-report to generateReport controller (Feature 1)
router.post("/generate-report", generateReport);

// Route configuration mapping POST /api/ai/chat to chatAI controller (Feature 2)
router.post("/chat", chatAI);

// Route configuration mapping POST /api/ai/advisor to getSustainabilityAdvice controller (Feature 1 - Hour 5-7)
router.post("/advisor", getSustainabilityAdvice);

// Route configuration mapping POST /api/ai/ranking-explanation to getRankingExplanation controller (Feature 2 - Hour 5-7)
router.post("/ranking-explanation", getRankingExplanation);

// Route configuration mapping POST /api/ai/recommend-goals to getRecommendGoals controller (Feature 3 - Hour 5-7)
router.post("/recommend-goals", getRecommendGoals);


export default router;