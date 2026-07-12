/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Prompt templates for EcoSphere - AI Powered ESG Management Platform
 */

/**
 * Generates a prompt for general ESG Data Analysis
 * @param {object} esgData - The raw ESG data
 * @returns {string} The formatted prompt
 */
export const esgAnalysisTemplate = (esgData) => {
  return `As an expert ESG (Environmental, Social, and Governance) sustainability consultant, analyze the following corporate data:
${JSON.stringify(esgData, null, 2)}

Please provide a highly structured and detailed report containing:
1. An overall ESG Performance Rating/Assessment.
2. Direct highlights of key strengths and high-priority risks/weaknesses.
3. Clear, step-by-step actionable recommendations to improve the corporate ESG score, specifically focused on eco-efficiency, social responsibility, and robust governance structures.`;
};

/**
 * Generates a prompt for Carbon Footprint (Scope 1, 2, & 3) Calculation & Strategy
 * @param {object} emissionsData - The activities or energy consumption metrics
 * @returns {string} The formatted prompt
 */
export const carbonCalculationTemplate = (emissionsData) => {
  return `Using the provided energy, travel, and operations activity metrics:
${JSON.stringify(emissionsData, null, 2)}

Provide a detailed sustainability blueprint:
1. Estimates of Greenhouse Gas (GHG) emissions across Scope 1 (Direct), Scope 2 (Indirect - Purchased Energy), and Scope 3 (Value Chain).
2. Actionable decarbonization initiatives to achieve net-zero targets.
3. Relevant carbon offset or renewable transition recommendation strategies.`;
};

/**
 * Generates a default/fallback prompt
 * @param {string} prompt - General text prompt
 * @returns {string} The formatted prompt
 */
export const defaultTemplate = (prompt) => {
  return prompt;
};

/**
 * Generates a prompt for a comprehensive ESG Report
 * @param {object} esgData - The raw ESG data
 * @returns {string} The formatted prompt
 */
export const esgReportTemplate = (esgData) => {
  const {
    environmentScore = 'N/A',
    socialScore = 'N/A',
    governanceScore = 'N/A',
    carbonReduction = 'N/A',
    employeeEngagement = 'N/A',
    complianceScore = 'N/A'
  } = esgData || {};

  return `You are an expert ESG (Environmental, Social, and Governance) sustainability analyst.
Generate a comprehensive and highly professional AI ESG report based on the following corporate ESG performance metrics:

- Environment Score: ${environmentScore}
- Social Score: ${socialScore}
- Governance Score: ${governanceScore}
- Carbon Reduction: ${carbonReduction}%
- Employee Engagement: ${employeeEngagement}%
- Compliance Score: ${complianceScore}%

Your report must be structured with the following exact sections:
1. ESG Executive Summary: A high-level overview of the company's ESG standing, aggregate status, and overall sustainability profile.
2. Environmental Performance Analysis: Deep dive into the environmental score, Carbon Reduction efforts, and their direct ecological impacts.
3. Social Performance Analysis: Deep dive into the social score, Employee Engagement, and workforce relations.
4. Governance Performance Analysis: Deep dive into the governance score, compliance level, and leadership/ethical frameworks.
5. Key Strengths: Identify the top areas where the company is excelling based on the provided scores.
6. Areas of Improvement: Identify the weakest points where remediation is required.
7. Sustainability Recommendations: Provide clear, step-by-step actionable recommendations to improve each score and overall eco-efficiency.
8. Future ESG Goals: Suggest realistic, measurable short-term and long-term milestones for the company's ESG roadmap.

Keep the tone highly professional, objective, and analytical, suitable for corporate executives and investors.`;
};
