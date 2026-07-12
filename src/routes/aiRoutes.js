/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { testAI, generateESGReport } from "../controllers/aiController.js";

const router = express.Router();

// Route configuration mapping POST /api/ai/test to testAI controller
router.post("/test", testAI);

// Route configuration mapping POST /api/ai/esg-report to generateESGReport controller
router.post("/esg-report", generateESGReport);

export default router;