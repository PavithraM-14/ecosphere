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

/**
 * Generates a prompt for a detailed sustainability report for Feature 1
 * @param {object} data - The company sustainability details
 * @returns {string} The formatted prompt
 */
export const esgGenerateReportTemplate = (data) => {
  const {
    companyName = "EcoSphere",
    department = "General",
    environmentScore = "N/A",
    socialScore = "N/A",
    governanceScore = "N/A",
    carbonEmission = "N/A",
    initiatives = []
  } = data || {};

  const initiativesList = Array.isArray(initiatives) && initiatives.length > 0
    ? initiatives.map(init => `- ${init}`).join("\n")
    : "None listed";

  return `You are an elite sustainability and ESG analyst. Generate a comprehensive, professional, and audit-ready ESG sustainability report for the following company/department details:

Company Name: ${companyName}
Department: ${department}
Environment Score: ${environmentScore}/100
Social Score: ${socialScore}/100
Governance Score: ${governanceScore}/100
Carbon Emission Status: ${carbonEmission}

Current Initiatives:
${initiativesList}

The generated report must be highly detailed and structured with the following exact headings:
1. Executive Summary: A concise high-level overview of the sustainability profile for ${companyName} - ${department} department.
2. Environmental Performance: A detailed analysis of the environmental efforts, the Environmental Score (${environmentScore}), and carbon footprint (${carbonEmission}).
3. Social Performance: A deep dive into workforce safety, employee engagement, diversity, and social impact indicators based on the Social Score (${socialScore}).
4. Governance Performance: Critical review of transparency, ethical leadership, corporate behavior, and structural governance based on the Governance Score (${governanceScore}).
5. Current Challenges: Identify potential ESG roadblocks, material risks, or structural gaps based on the department metrics.
6. Recommendations: Actionable, practical, and progressive step-by-step guidance to improve individual scores and resource management.
7. Future Sustainability Goals: Define realistic, measurable short-term and long-term milestones for the ESG roadmap.

Keep the tone expert, authoritative, analytical, and highly structured. Avoid generic fluff. Highlight how current initiatives can be scaled.`;
};

/**
 * Generates a prompt for the EcoSphere AI Chatbot Assistant with system instructions & constraints
 * @param {string} message - User query/message
 * @returns {string} The formatted prompt
 */
export const esgChatTemplate = (message) => {
  return `You are EcoSphere's dedicated AI ESG Assistant. EcoSphere is an advanced AI-powered ESG Management Platform designed to help companies track, analyze, and optimize their Environmental, Social, and Governance metrics.

Your primary objective is to assist users with inquiries specifically related to:
- ESG (Environmental, Social, and Governance) principles
- Sustainability, eco-efficiency, and circular economy
- Carbon reduction strategies, GHG protocols, and energy transitions
- Employee welfare, human rights, labor standard practices, and diversity
- Governance structure, board diversity, executive transparency, and compliance
- Corporate or organizational improvement suggestions based on ESG standards

Constraints:
- Focus solely on the context of EcoSphere ESG systems and corporate sustainability.
- If the user asks a question completely unrelated to ESG, sustainability, carbon reduction, employee welfare, governance, or company improvement, politely decline to answer, explaining that your expertise is restricted to EcoSphere ESG and sustainability topics.
- Keep answers professional, concise, encouraging, and deeply informative.

User Question: ${message}

Response:`;
};

/**
 * Generates a prompt for Sustainability Advisor
 * @param {object} esgAdvisorData - The advisor input data
 * @returns {string} The formatted prompt
 */
export const esgAdvisorTemplate = (esgAdvisorData) => {
  const {
    environmentScore = "N/A",
    socialScore = "N/A",
    governanceScore = "N/A",
    issues = []
  } = esgAdvisorData || {};

  const issuesList = Array.isArray(issues) && issues.length > 0
    ? issues.map(issue => `- ${issue}`).join("\n")
    : "None reported";

  return `You are a Sustainability Advisor on the EcoSphere ESG Platform.
Analyze the following company performance metrics and reported issues:

- Environment Score: ${environmentScore}/100
- Social Score: ${socialScore}/100
- Governance Score: ${governanceScore}/100

Reported Issues:
${issuesList}

Provide a comprehensive, professional sustainability advice report. Your output must contain the following exact sections with detailed and highly actionable context:
- Problems Identified: Detailed analysis of the critical bottlenecks, high carbon emissions, or issues reported.
- Improvement Suggestions: Clear, targeted solutions and process modifications for those problems.
- Sustainability Actions: Progressive, concrete steps the company must take immediately.
- Expected Impact: Positive outcomes, resource savings, and score improvements expected upon implementing these actions.

Maintain an expert, objective, encouraging, and corporate-ready tone.`;
};

/**
 * Generates a prompt for Department Ranking Explanation
 * @param {object} rankingData - The department ranking details
 * @returns {string} The formatted prompt
 */
export const esgRankingExplanationTemplate = (rankingData) => {
  const {
    department = "General",
    score = "N/A",
    previousScore = "N/A",
    metrics = {}
  } = rankingData || {};

  const {
    environment = "N/A",
    social = "N/A",
    governance = "N/A"
  } = metrics || {};

  return `You are an expert ESG Performance Analyst on the EcoSphere platform.
Explain the ranking and performance progress of the following department:

- Department: ${department}
- Current Combined ESG Score: ${score}/100
- Previous ESG Score: ${previousScore}/100
- Environment Metric: ${environment}/100
- Social Metric: ${social}/100
- Governance Metric: ${governance}/100

Your output must be structured with the following exact sections:
- Why the Department Achieved this Score: A clear data-backed analysis comparing the previous score (${previousScore}) and the current score (${score}), explaining the momentum or stagnation.
- Strength Areas: Highlight which metrics (Environment, Social, or Governance) are driving the ranking upward.
- Weak Areas: Highlight where the metrics are lagging and pulling the rank down.
- How to Improve Ranking: Clear, actionable instructions tailored specifically for the ${department} department to enhance their metrics and boost their internal ranking.

Maintain a professional, analytical, constructive, and clear tone.`;
};

/**
 * Generates a prompt for recommending SMART ESG goals
 * @param {object} goalData - The category and score details
 * @returns {string} The formatted prompt
 */
export const esgRecommendGoalsTemplate = (goalData) => {
  const {
    category = "General ESG",
    currentScore = "N/A",
    targetScore = "N/A"
  } = goalData || {};

  return `You are a corporate sustainability goal planner on the EcoSphere ESG Platform.
Your task is to suggest highly practical, realistic, and SMART (Specific, Measurable, Achievable, Relevant, Time-bound) ESG goals to bridge the score gap for the following request:

- ESG Category: ${category}
- Current Score: ${currentScore}/100
- Target Score: ${targetScore}/100

You must generate:
- Short-term goals (to be achieved within 3-12 months)
- Long-term goals (to be achieved within 1-5 years)
- Measurable ESG targets (exact indicators, e.g., % reductions or participation rates)

IMPORTANT:
Please output the final list of goals as a valid JSON array of strings ONLY. No markdown wrappers like \`\`\`json, no preamble, and no explanation. Just a plain, valid JSON array of strings.
Example output format:
[
  "Reduce Scope 1 carbon emissions by 15% within 12 months",
  "Adopt 100% renewable energy source contracts for IT departments",
  "Achieve 95% compliance score on external environmental audits"
]`;
};

/**
 * Generates a prompt for the What-If Simulator & Impact Forecaster
 * @param {object} simulationData - The simulation inputs
 * @returns {string} The formatted prompt
 */
export const esgSimulationTemplate = (simulationData) => {
  const {
    environmentScore = 70,
    socialScore = 70,
    governanceScore = 70,
    initiatives = []
  } = simulationData || {};

  const initiativesList = Array.isArray(initiatives) && initiatives.length > 0
    ? initiatives.map(init => `- ${init}`).join("\n")
    : "None listed";

  return `You are an elite sustainability advisor and expert AI simulation forecaster on the EcoSphere ESG Platform.
Your task is to analyze the hypothetical impact of proposed sustainability initiatives on the current ESG metrics of a company, and forecast the projected scores and outcomes.

Current Metrics:
- Current Environment Score: ${environmentScore}/100
- Current Social Score: ${socialScore}/100
- Current Governance Score: ${governanceScore}/100

Proposed Sustainability Initiatives:
${initiativesList}

Calculate and forecast the hypothetical post-implementation metrics and qualitative impacts. Be rigorous, realistic, and objective. 

You MUST output your response as a valid JSON object ONLY. No markdown wrapping like \`\`\`json, no preamble, and no conversational explanation. The JSON object must match this exact structure:
{
  "projectedEnvironmentScore": number (projected environment score out of 100, must be an integer),
  "projectedSocialScore": number (projected social score out of 100, must be an integer),
  "projectedGovernanceScore": number (projected governance score out of 100, must be an integer),
  "projectedOverallScore": number (weighted average or logical overall ESG score, must be an integer),
  "carbonReductionPercentage": "string" (estimated percentage range, e.g. "12% - 15%"),
  "financialImpact": "string" (concise explanation of estimated cost/savings),
  "implementationChallenges": "string" (concise summary of major obstacles or material risks),
  "recommendations": ["string"] (array of 2-4 highly actionable recommendations to optimize these initiatives)
}`;
};
